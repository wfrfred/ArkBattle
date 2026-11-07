# Schedule 重设计

状态：已确认领域语义、静态容器大纲、普通 Spawn／Wait、Branch Entry／WeightedSpawns、统一时间规则、完整 State 字段、公开操作入口、同步重入顺序及直接 Unit 初始化链；Route 运行结构、个体结算与等待关系边界继续讨论，实现待重构。本页是后续设计的依据；现有 Schedule 代码、接口和测试不能反过来确定目标模型。

## 职责与本轮范围

Schedule 在特定时刻执行操作，与 Spawn 存在真实的双向依赖：出生时间由调度计划决定，出生 Unit 的等待关系又影响后续 Wave 的开始时间。因此围绕出怪和波次组织领域，不抽象为完全通用的定时任务系统。

本轮先设计普通 Spawn 的 Definition、执行与等待关系。STORY 不实现；ACTIVATE_PREDEFINED 等其他操作以后再讨论，不先设计统一 Action 联合或通用执行器。

Predefined 通过 `predefined.appear(battle, id)` 与 `predefined.remove(battle, id, reason)` 操作，id 对应 PredefinedDefinition.id。它们是领域操作，不是内部 Command；以后接入 Schedule 时调用这些操作。

## 静态容器大纲

```typescript
interface Definition {
    readonly waves: readonly Wave[];
    readonly branches: Readonly<Record<string, Branch>>;
}

interface Wave {
    readonly preDelayTicks: number;
    readonly postDelayTicks: number;
    readonly maxWaitingTicks: number | null;
    readonly fragments: readonly Fragment[];
}

interface Fragment {
    readonly preDelayTicks: number;
    readonly spawns: readonly Spawn[];
}

interface Branch {
    readonly phases: readonly BranchPhase[];
}

interface BranchPhase {
    readonly preDelayTicks: number;
    readonly entries: readonly Entry[];
}
```

Definition 描述主 Wave 序列与按名称查找的 Branch；Wave 包含 Fragment，Branch 包含 BranchPhase。Fragment.spawns 保存预处理后的确定出生序列，不接受运行时随机候选；BranchPhase.entries 组织确定序列或执行时选择的候选。

这是静态程序结构，不包含 Branch 游标、同时运行的 Phase、每次执行的随机选择结果或实际等待关系；这些归运行 State。

## 普通 Spawn

以下列出已确认的调度字段；Plan 与出生配置在 Spawn 中的具体绑定字段继续确定。

```typescript
interface Spawn {
    readonly definition: UnitDefinition;
    readonly atTick: number;
    readonly wait: Wait;
}

type Wait = "NONE" | "FINAL" | "WAVE";
```

每项描述一次出生、出生时刻与该 Unit 的调度等待政策。Data／Content 提供完整静态 UnitDefinition，路线方案由独立的 Plan 描述，不为每次路线选择重新合成 UnitDefinition。Schedule 出生操作负责取得 Plan、处理出生偏移与位置，Route initializer 负责构造 Context 与 State，见 [Route 类型](navigation.md#route-定义与进度)。

### 从 Spawn 到 Unit

出生代码取得本次 Plan，分配 id，采样一次 offset，并将同一个样本用于初始位置和 Route 初始化输入：

```typescript
const created = unit.initialize(battle, {
    id,
    definition: entry.definition,
    position: Vec2.add(Tile.center(startPosition), offset),
    initial: { route: { plan, offset } },
});
```

Unit.initialize 接续 Capability initializer 的 fold。Route initializer 接收 initial.route 的 `{ plan, offset }`，构造 Context，自行从当前 Schedule 取得主 Wave／Fragment 时间基准并保存于 Route State。普通出怪与动态创建 Unit 都由 initializer 读取，不额外向 Initial 传入时间；主路线与多临时 Context 共享这两个基准。不另设 Route Execution，也不重新采样出生偏移或接收预装的执行状态。

初始化返回后，出生操作接续 created.state，按 entry.wait 登记 created.value.id 的等待关系，再调用 unit.add。Unit.add 登记已经完整的 Unit 并执行 enter，不解释 Plan 或构造 Route Context。后续由 Route.advance 依据 Plan 和实例状态运行路线。

出生时沿用 entry.definition 的同一个对象，不为本次 Plan、偏移或时间基准重新生成或合成 UnitDefinition。重构时删除 creation/routed-unit.ts 这层包装，直接复用统一 Unit 初始化。其他创建者自行处理路线来源和出生业务，不强制使用统一的 SpawnRoute 类型。

## 出生时间

Fragment 与 Branch Phase 使用相同的时间模型：

1. 主线 fragmentStartTick 是进入 Fragment 的时刻，ActivePhase.startTick 是触发 Phase 的时刻，均不包含前延迟。
2. preDelayTicks 是对应 Definition 规定的前延迟。
3. Spawn.atTick 是相对于前延迟结束时刻的偏移。

```typescript
// Wave 前延迟结束
waveReadyTick = waveStartTick + wave.preDelayTicks;

// Fragment 的 Spawn
spawnTick = fragmentStartTick + fragment.preDelayTicks + spawn.atTick;

// Branch Phase 的 Spawn
spawnTick = activePhase.startTick + activePhase.phase.preDelayTicks + spawn.atTick;

// WAITING，且 maxWaitingTicks 非 null
timeoutTick = main.startTick + wave.maxWaitingTicks;

// POST_DELAY
postDelayEndTick = main.startTick + wave.postDelayTicks;
```

waveStartTick 是进入当前 Wave 的时刻。主线的 Fragment 时刻只保存在根级 fragmentStartTick；ActivePhase 保存触发时刻和对应的 BranchPhase Definition 引用。定义中的前延迟不并入这些起点，也不改写 Spawn.atTick。

WAITING.startTick 是开始等待本波 Unit 的时刻；POST_DELAY.startTick 是进入后延迟阶段的时刻。maxWaitingTicks 为 null 时没有等待超时期限。所有时刻均使用 battle.tick。

## Spawn 预处理

普通 Spawn 的 count、interval 在 Data 阶段展开，转换为具有确定出生时刻的序列。Core 接收预处理后的序列，每项普通 Spawn 对应一次出生，不再解释 count、interval 或维护重复出生进度。

主 Wave 的 Action 随机组也在预处理阶段完成选择，并已计算 Total。Core 接收确定的主 Wave 出生序列，不再选择这些随机组或重新计算 Total。

## 随机选择

不同路径的随机选择分别处理：

| 随机的业务含义 | 处理位置与时点 |
| --- | --- |
| 鸭爵策略、敌人阵容替换等战斗前内容准备 | 可以提前生成实际出怪计划 |
| 主 Wave 的 Action 随机组 | 预处理阶段选定，计算 Total 后交给 Core |
| Branch Phase 的 Action 随机组 | 每次执行该 Phase 时选择 |

Branch 的 Entry 类型为：

```typescript
type Entry = readonly Spawn[] | WeightedSpawns;

interface WeightedSpawns {
    readonly options: readonly {
        readonly weight: number;
        readonly spawns: readonly Spawn[];
    }[];
}
```

确定序列直接入队。每次执行 Phase 时，每个 WeightedSpawns 按权重选择一个 option，选中的整组 spawns 一起入队，不对展开后的每个 Spawn 分别抽选，也不在每 Tick 重新选择。

循环 Branch 多次执行同一个 Phase，可能得到不同随机结果，不能把第一次选择永久展开为该 Phase 的固定计划。这项需求不扩大到主 Wave。

## 公开操作

```typescript
function advance(battle: BattleState): BattleState;

function triggerBranch(
    battle: BattleState,
    id: string,
    loop: boolean,
): BattleState;

function resolveUnits(
    battle: BattleState,
    removedUnitIds: readonly UnitId[],
): BattleState;
```

三个入口均接续并返回 BattleState。triggerBranch 的 id 是 Definition.branches 的键；loop 仅控制选择位置到末尾后是否允许回到首项，一次调用仍只触发一个 Phase，不自动循环执行整个 Branch。

resolveUnits 从 waiting.wave／waiting.final 移除给定 Unit 的等待关系，不负责 Finished／Killed、蓝门结算或胜负，也不隐式调用 advance。

## 推进与同步触发

### 主线推进

```text
PRE_DELAY
  → 到达 Wave 前延迟结束时刻 → FRAGMENT
  → 执行本 Tick 到期的 Spawn
  → 当前 Fragment 全部出生操作完成 → 下一个 FRAGMENT
  → 所有 Fragment 完成 → WAITING
  → waiting.wave 解除或超时 → POST_DELAY
  → 到达后延迟结束时刻 → 下一个 Wave／COMPLETED
```

advance 每次调用中，主线持续转换到阻塞点；对本 Tick 应处理的活动 Phase 各执行一次。不通过反复全量扫描 activePhases 寻求收敛，也不重复命中同 Tick 的出生。

主线的阻塞点是下一步需要等待未来 Tick、尚未满足的等待条件，或主线已经完成。零延迟和已满足条件之间不人为插入一 Tick；推进不会快进 Battle.tick。

Fragment 完成表示出生操作执行完，不等待出生 Unit 离场；没有未来 Spawn 后即可继续，空 Fragment 立即完成。WAITING 只检查 waiting.wave，waiting.final 不阻止主线进入 COMPLETED。

进入 Wave、Fragment 时分别记录 waveStartTick、fragmentStartTick；进入 WAITING／POST_DELAY 时记录该阶段的 main.startTick，均使用当前 battle.tick。

### Branch 触发

triggerBranch 按以下顺序执行：

1. 根据 nextPhaseIndices[id] 选取本次 Phase，按 loop 处理末尾。
2. 使用 Battle RNG 确定本次 Entry 的选择结果，形成完整 Spawn 列表。
3. 提交新的 Phase 索引、RNG 状态，以及新建的 ActivePhase。
4. 立即推进这个新实例，执行本 Tick 到期的 Spawn。
5. 如果本次 Phase 已完成，从最新 State 中按对象身份移除它。

第 3 步必须早于任何可能触发 Hook 的操作。前延迟与首个 Spawn 的 atTick 都为零时，出生发生在触发调用中，不等待下一次常规 Schedule 推进。

```text
triggerBranch(A)
  → 提交 Phase 0、下一索引与 RNG
  → Spawn U1
      → U1 enter Hook
          → triggerBranch(A)
              → 提交 Phase 1、下一索引与 RNG
              → Spawn U2
  → 继续 Phase 0 的剩余 Spawn
  → 从最新 activePhases 按对象身份移除 Phase 0
```

内层触发读取外层已提交的下一 Phase 索引和 RNG。外层保留本次 ActivePhase 与选中序列，每个后续出生操作仍接续最新 Battle State，不回写触发前的索引、RNG 或 activePhases。

### 本 Tick 的推进分工

ActivePhase.startTick 就是触发时的 Battle.tick。两个入口各自负责：

1. triggerBranch 只同步推进本次新激活的 Phase，处理本 Tick 已到期的出生。
2. 常规 advance 每 Tick 执行一次，只处理 startTick < battle.tick 的 Phase，各执行一次；本 Tick 新激活的 Phase 已由 triggerBranch 处理。
3. 后续按计算出的 spawnTick 执行对应出生；主 Fragment 同样按出生时刻推进，不另存出生游标或剩余序列。

因此同一 Tick 内，触发发生在常规推进之前、期间或之后，都由触发操作负责新 Phase 的本 Tick 执行；常规推进不重复处理。ActivePhase.spawns 保留本次选中的完整出生序列，不改成剩余队列，也不另加游标或 lastAdvancedTick。

Phase 登记、下一 Phase 索引和 RNG 的发布先于出生的 enter，出生所需的调度归属也先于 enter 发布。回调后接续最新 Schedule，不用旧 activePhases 覆盖同步触发的新 Phase。

Hook 中再次触发 Branch 会创建另一个独立 ActivePhase。完成的 Phase 从最新 activePhases 中按该实例对象身份移除，不按 phase Definition 或 startTick 合并、删除，避免影响同 Tick 的其他执行。

## 运行 State

已确认的状态结构如下；路线构造接入与等待关系边界另行补齐：

```typescript
interface State {
    readonly definition: Definition;

    readonly waveIndex: number;
    readonly waveStartTick: number;
    readonly fragmentStartTick: number;
    readonly main: MainProgress;

    readonly nextPhaseIndices: Readonly<Record<string, number>>;
    readonly activePhases: readonly ActivePhase[];

    readonly waiting: {
        readonly wave: readonly UnitId[];
        readonly final: readonly UnitId[];
    };
}

type MainProgress =
    | { readonly type: "PRE_DELAY" }
    | {
          readonly type: "FRAGMENT";
          readonly fragmentIndex: number;
      }
    | {
          readonly type: "WAITING";
          readonly startTick: number;
      }
    | {
          readonly type: "POST_DELAY";
          readonly startTick: number;
      }
    | { readonly type: "COMPLETED" };

interface ActivePhase {
    readonly phase: BranchPhase;
    readonly startTick: number;
    readonly spawns: readonly Spawn[];
}
```

definition 持有静态调度程序；waveIndex、waveStartTick 和 fragmentStartTick 持久保存主线位置及时间事实。MainProgress.COMPLETED 只表示主 Wave 程序结束，仍可以存在 activePhases 与 waiting.final。ActivePhase.startTick 固定表示触发时刻，phase 引用静态 Definition，spawns 是该次执行选中的完整序列。

fragmentIndex 只存在于 MainProgress.FRAGMENT。其他阶段结合当前主线位置与 Definition，查询最近进入过的 Fragment；查询的是已经发生的调度历史，不为查询方便再保存一份索引。

### Route 的主流程时间上下文

[Route 初始化](navigation.md#初始化)在实际出生时取得当时主线的时间锚点，保存于 Route State 的 waveStartTick／fragmentReadyTick，由主路线与多临时 Context 共享。前者是主 Wave 进入时刻，后者是主 Fragment 前延迟结束时刻；Schedule.fragmentStartTick 仍表示进入 Fragment 的时刻。

出生采样值为：

```typescript
waveStartTick = schedule.waveStartTick;
fragmentReadyTick = schedule.fragmentStartTick + fragment.preDelayTicks;
```

这里的 fragment 是最近进入过的主线 Fragment Definition，不是触发出生的 Branch Phase。两个字段都是绝对战斗 Tick；Route 的 WAVE／FRAGMENT 等待分别在其上增加配置的 ticks。

| 主流程位置 | 最近进入过的 Fragment |
| --- | --- |
| FRAGMENT | 当前 Wave 中 main.fragmentIndex 指向的 Fragment |
| WAITING／POST_DELAY | 当前 Wave 中最后进入过的 Fragment |
| PRE_DELAY | 当前 Wave 之前最近进入过的 Fragment |
| COMPLETED | 主线最后进入过的 Fragment |

空 Wave 可以沿静态 Definition 向前查找；不新增持久索引或额外的历史执行记录。尚未进入任何 Fragment 时的路线基准，以及 COMPLETED 时 waveIndex 的边界含义，留在 Operations 中明确。

## 计数、等待与蓝门结算

原生 Boolean 按实际效果区分计数、调度等待与蓝门结算。同一领域内等价的组合归一为明确类型，不用一个综合政策混合这些职责。

### 全局计数与个体资格

- Total 表示纳入计数口径的总数，在主 Wave 预处理阶段已经计算完成。
- Finished 表示已经完成个体结算的数量。
- Killed 表示符合击杀结算的数量。

Finished、Killed 根据各 Unit 的个体结算资格和实际结果更新。普通敌人进入蓝门增加 Finished，不增加 Killed。是否等待某个 Unit 不自动决定该 Unit 的计数资格，管理集合也不能替代计数。

个体资格倾向由 Unit 实例承载，但具体字段、归属及结算接口尚未确定。全局统计的具体模块和 State 也尚未确定；不要继续以 Schedule 持有这些统计作为设计前提。

### 调度等待

Schedule 需要分别表达：

1. Fragment 对动作完成的等待。
2. Wave 对 Unit 的等待，影响下一 Wave 何时开始。
3. 最终管理集合，表达调度仍在管理哪些实例。

等待政策属于调度计划，实际等待关系属于运行状态。动作完成与 Unit 离场是不同事实；最终管理集合为空也不直接等于整个 Battle 获胜。

普通 Spawn 的 wait 只表达已出生 Unit 的等待：

| Wait | 加入当前 Wave 等待 | 加入最终管理集合 |
| --- | --- | --- |
| NONE | 否 | 否 |
| FINAL | 否 | 是 |
| WAVE | 是 | 是 |

waiting.wave 保存当前 Wave 的等待关系，允许超时解除；waiting.final 保存最终等待关系，不随 Wave 超时清空。超时不删除仍存活的 Unit。

WAVE 包含 FINAL 的管理责任；不存在只加入 Wave 等待、不加入最终管理集合的第四种政策。wait 不决定 Total／Finished／Killed、蓝门扣血或 Battle 胜负，也不承担 Fragment 对动作执行完成的等待。

就 managedByScheduler、dontBlockWave、forceBlockWaveInBranch 三个原生字段而言，Data 根据普通 Scheduler Spawn 所在的主 Wave／Branch 上下文转换：

```typescript
const wait: Wait =
    !managedByScheduler
        ? "NONE"
        : dontBlockWave || (fromBranch && !forceBlockWaveInBranch)
          ? "FINAL"
          : "WAVE";
```

managedByScheduler=false 时不加入两个集合；dontBlockWave=true 时只加入最终管理集合。Branch 默认不阻波，forceBlockWaveInBranch 只取消这个默认豁免，不能压过前两个条件。Core 接收 wait，不保留这三个 Boolean，也不根据所在 Wave／Branch 重新推导默认政策。

以上转换限定这三个字段，不把其他出生资格、计数资格或外部出生入口自动归入同一公式。实际等待关系的登记／释放接口与 Wave 归属仍待确定。

### 蓝门结算

进入蓝门是否扣血，与是否增加 Finished、Killed 分别表达。无害和视为击杀也不是同一项语义，不把原生的组合字段作为项目的整体开关。

## 战斗结束

Schedule 提供调度进度与等待状态，不负责决定整个 Battle 的胜负。统计等其他领域分别提供事实，外部 Content／规则读取这些状态并决定结果。

下一 Wave 何时开始仍由 Schedule 决定。这与 Battle 的结束条件是不同职责。

现有 Runtime 使用 SCHEDULE_COMPLETED／TIME_LIMIT 形成结果的代码尚未迁移；它不构成新设计的胜负契约。外部规则的具体接口另行确定。

## 尚未定稿

| 项目 | 待确定内容 |
| --- | --- |
| Route 运行结构 | Plan／Context／State、Definition 的 alwaysCheckCurrentPoint、initial.route 的 `{ plan, offset }`、State 共享出生时间锚点及 [Checkpoint 类型](navigation.md#checkpoint)已定；主／多临时 Context 的容器、稳定身份形式与选择接口继续审查 |
| Spawn 出生配置 | UnitDefinition 与本次 Plan 分开；Plan、偏移采样和出生位置配置在 Spawn 中的具体绑定字段待定，不引入强制所有创建者使用的 SpawnRoute 类型 |
| 主流程边界 | 尚未进入任何 Fragment 时的 Route 基准、COMPLETED 时 waveIndex 的含义待明确 |
| 个体结算 | 资格的实际归属、字段及 Finished／Killed／蓝门结算接口 |
| 等待关系 | Unit 的 Wait 三态与 resolveUnits 接口已定；Wave 归属、出生登记及离场反馈接入待定 |
| 外部协调 | 全局统计与 Battle 结束规则的状态及接口 |

此前讨论过的 `blocksWave`／`blocksCompletion`、三态 `CompletionPolicy` 都不是已确认设计，不能作为实现或测试依据。

后续补齐路线与出生输入、个体结算及等待关系边界。行为定稿后，先整理语义验收清单，再选择最小代表测试，不以现有测试要求保留历史结构。

## 机制依据

[案例 30：通用 Scheduler 字段消费与调用路径](../research/cases/30-scheduler-action-data-fields.md)记录主 Wave、Fragment、Branch Phase、随机预处理、管理集合与统计的原生证据及缺口。研究解释机制，本页记录项目已确认的职责选择；原生字段和客户端结构不直接成为项目类型。
