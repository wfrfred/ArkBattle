# Schedule 设计

Schedule 保存出生计划、主 Wave 进度、Branch 执行实例及已出生 Unit 的等待关系。出生时刻由调度计划决定，Unit 离场又影响下一 Wave 的开始时间，因此本领域围绕出怪与波次组织。

Schedule 负责普通 Spawn 调度，不支持 STORY、ACTIVATE_PREDEFINED 等原生 Action，也不承担通用定时任务。Predefined 通过自身公开的 appear／remove 操作处理出现与移除。

## 静态计划

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

interface Spawn {
    readonly definition: UnitDefinition;
    readonly plan: Route.Plan;
    readonly offset: WorldPosition;
    readonly randomRange: WorldPosition;
    readonly atTick: number;
    readonly wait: Wait;
}

type Wait = "NONE" | "FINAL" | "WAVE";

type Entry = readonly Spawn[] | WeightedSpawns;

interface WeightedSpawns {
    readonly options: readonly {
        readonly weight: number;
        readonly spawns: readonly Spawn[];
    }[];
}
```

Definition 的 waves 是确定的主线程序，branches 按名称查找。Fragment 保存预处理后的确定 Spawn 序列；BranchPhase.entries 可以包含确定序列或执行时抽选的整组候选。它们不保存执行索引、每次抽选结果或实际等待关系。

Schedule 导出的 UnitDefinition 描述可由普通 Spawn 创建的完整静态 Unit：基础定义、必需的 Route.definition，以及不需要额外必需 Initial 的可选 Capability。该入口排除 Occupancy 和依赖它的 Deployable，因为 Spawn 只提供 Route 的必需初始化输入。Content 提供完整 Unit Definition，Data 将原始出怪配置转换为引用这些定义的静态计划；Plan、出生偏移与时间快照通过实例初始化建立。

Plan 是本次路线选择，独立于共享 UnitDefinition。offset 是固定出生偏移，randomRange 是各轴随机半宽，出生时取：

```typescript
sampledOffset = offset + random(-randomRange, +randomRange);
position = Tile.center(plan.startPosition) + sampledOffset;
```

同一个 sampledOffset 同时用于 Unit.position 和 Route.Initial.offset。这里是固定偏移加随机扰动；MOVE.randomizeOffset 的含义另见 [Route](navigation.md#checkpoint-与进入)。每项 Spawn 只描述一次出生，不保留 count 或重复执行游标。

## 运行 State

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
    | { readonly type: "FRAGMENT"; readonly fragmentIndex: number }
    | { readonly type: "WAITING"; readonly startTick: number }
    | { readonly type: "POST_DELAY"; readonly startTick: number }
    | { readonly type: "COMPLETED" };

interface ActivePhase {
    readonly phase: BranchPhase;
    readonly startTick: number;
    readonly spawns: readonly Spawn[];
}
```

waveIndex、waveStartTick、fragmentStartTick 保存主线位置和最近发生的时间事实。fragmentIndex 只存在于 FRAGMENT；其他阶段根据主线位置和 Definition 查询最近进入过的 Fragment。ActivePhase.phase 引用静态定义，startTick 是本次触发时刻，spawns 保存本次抽选后的完整序列。

MainProgress.COMPLETED 表示主 Wave 程序结束，此时可以仍有 activePhases 或 waiting.final。waveIndex 保留最后一个 Wave 的索引；没有 Wave 时为 0。State 不保存出生队列游标、剩余序列或 lastTick。

## 公开入口

```typescript
function initialize(definition: Definition): State;

function timing(state: State): {
    readonly waveStartTick: number;
    readonly fragmentReadyTick: number;
};

function isCompleted(state: State): boolean;

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

initialize 建立主线初始位置、各 Branch 的下一 Phase 索引与空等待集合。有 Wave 时从索引 0 的 PRE_DELAY 开始；没有 Wave 时主线为 COMPLETED。初始时间字段为 0，尚无主线历史时 timing 返回零基准。

isCompleted 由三个事实推导：主线为 COMPLETED、activePhases 为空、waiting.final 为空。它不决定 Battle 胜负，也不需要独立完成锁存位。

advance、triggerBranch、resolveUnits 接续并返回完整 BattleState。triggerBranch.id 是 Definition.branches 的键；loop 仅允许选择位置到末尾后回到首项，每次调用仍只触发一个 Phase。

resolveUnits 从 waiting.wave 和 waiting.final 移除给定 Unit 的关系，不隐式调用 advance。Battle 的组成初始化通过全局 leaveHook 登记离场反馈，任意完整 Unit 移除都同步释放等待；通用 Unit 生命周期不依赖 Schedule。

## 出生时间

所有时刻使用 battle.tick。进入 Wave／Fragment／Branch Phase 的时刻均不包含对应前延迟，Spawn.atTick 是前延迟结束后的偏移：

```typescript
waveReadyTick = waveStartTick + wave.preDelayTicks;

spawnTick = fragmentStartTick + fragment.preDelayTicks + spawn.atTick;

branchSpawnTick = activePhase.startTick + activePhase.phase.preDelayTicks + spawn.atTick;

timeoutTick = main.startTick + wave.maxWaitingTicks; // WAITING，且非 null
postDelayEndTick = main.startTick + wave.postDelayTicks; // POST_DELAY
```

WAITING.startTick 是开始等待本波 Unit 的时刻，POST_DELAY.startTick 是进入后延迟的时刻。maxWaitingTicks=null 表示不设等待超时。

推进不快进 battle.tick。进入新 Wave、Fragment、WAITING 或 POST_DELAY 时分别记录当前 tick；零延迟和已经满足的条件在本次调用中连续处理。

## 从 Spawn 到 Unit

出生操作依次执行：

1. 分配 Unit ID，采样本次出生偏移，并发布更新后的 RNG。
2. 沿用 Spawn.definition，以 Spawn.plan 与该偏移调用统一 Unit 初始化。
3. 接续初始化返回的最新 State，按 Spawn.wait 登记该 Unit 的等待关系。
4. 调用 unit.add 登记完整 Unit，执行普通 enter Hook。

```typescript
const created = unit.initialize(battle, {
    id,
    definition: spawn.definition,
    position: Vec2.add(Tile.center(spawn.plan.startPosition), sampledOffset),
    initial: { route: { plan: spawn.plan, offset: sampledOffset } },
});
```

Route initializer 通过 Capability fold 构造 Main，并在实际出生时读取 Schedule 的主线时间上下文；Unit.enter 同步进入首条 Route 指令。等待关系和出生所需调度事实先于 enter 发布，所以首指令及其同步 Hook 能看到完整出生状态。unit.add 只登记并执行 enter，不解释 Plan。

每次出生及其 Hook 返回后都接续最新 BattleState。外层出生流程不能用旧 Schedule、RNG 或 Unit 快照覆盖同步操作。其他技能、Buff 与机制创建者使用同一 Unit 初始化通道，自行组织路线来源与出生业务，不要求复用 Schedule 的 Spawn 类型。

## 主线推进

```text
PRE_DELAY
  → Wave 前延迟结束 → FRAGMENT
  → 执行本 Tick 到期的 Spawn
  → 当前 Fragment 出生完成 → 下一个 FRAGMENT
  → 所有 Fragment 出生完成 → WAITING
  → waiting.wave 解除或超时 → POST_DELAY
  → 后延迟结束 → 下一个 Wave／COMPLETED
```

advance 持续转换到阻塞点：未来的出生或延迟时刻、尚未解除的 Wave 等待，或者主线结束。Fragment 完成只表示出生操作执行完，不等待这些 Unit 离场；空 Fragment 立即完成。WAITING 只检查 waiting.wave，waiting.final 不阻止主线结束。

主线每 Tick 推进一次，按确定的 spawnTick 执行出生，不保存出生游标或剩余队列。进入新阶段时使用当前 tick，后续 Spawn 的时刻由该阶段的起点重新计算。每项出生在其到期 Tick 执行一次；同步 Hook 后继续尚未执行的同 Tick 项目，不能再次扫描已经执行的出生。

## Branch 抽选与同步重入

普通 Spawn 的 count、interval 及主 Wave 的随机组由 Data 在战斗前转换为确定序列；手写内容也可以直接提供静态计划。BranchPhase 的 WeightedSpawns 每次触发时按权重抽选一个 option，整组选中的 spawns 一起加入本次 ActivePhase，不对展开后的每个 Spawn 分别抽选，也不在后续 Tick 重抽。

循环 Branch 再次执行同一 Phase 时重新抽选。确定 Entry 直接纳入本次完整序列；抽选结果保存在 ActivePhase.spawns，静态 Definition 保持不变。

当前 Arknights Data 适配器支持无 Pack 的加权随机组：主线先选择 Action，再按原动作顺序展开；Branch 只接受候选连续的随机组，交错组与 Pack 关联明确报不支持。Core Entry 可以接收内容方已经准备好的确定序列或整组候选，不解释原生分组字段。

triggerBranch 按以下顺序执行：

1. 根据 nextPhaseIndices[id] 选择本次 Phase，按 loop 处理末尾。
2. 使用 Battle RNG 确定本次 Entry 结果，形成完整 Spawn 列表。
3. 发布下一 Phase 索引、RNG 和新的 ActivePhase。
4. 同步推进这个新实例，执行本 Tick 到期的出生。
5. 实例已完成时，从最新 activePhases 按该实例身份移除。

第 3 步先于任何会执行 Hook 的出生。前延迟与首个 atTick 都为零时，出生发生在 triggerBranch 调用中：

```text
triggerBranch(A)
  → 发布 Phase 0、下一索引与 RNG
  → Spawn U1
      → enter Hook
          → triggerBranch(A)
              → 发布 Phase 1、下一索引与 RNG
              → Spawn U2
  → 继续 Phase 0 的剩余 Spawn
  → 从最新 activePhases 移除 Phase 0 实例
```

内层读取已经提交的下一索引与 RNG。外层保留本次实例及所选序列，每项后续出生仍接续最新 BattleState；不回写触发前的 activePhases，也不合并同 Tick 触发的不同实例。

两个推进入口的分工固定：triggerBranch 负责新实例触发 Tick 的到期项；常规 advance 每 Tick 只处理 startTick < battle.tick 的已有实例，各一次。本 Tick 新实例已经由 triggerBranch 处理，常规 advance 不重复执行。完成实例从最新集合按对象身份移除，不按 Phase Definition 或 startTick 批量删除。

触发发生在常规推进之前、期间或之后，都遵守相同的实例推进分工。到期项由绝对出生 Tick 决定，同步重入保留内层登记，每项出生只执行一次。

## Route 的主流程时间上下文

Route initializer 在实际出生时调用 timing，保存 waveStartTick 与 fragmentReadyTick。已有 Unit 新建临时 Context 共享该 Unit 的 Route State 快照，不重新查询 Schedule。

```typescript
route.waveStartTick = schedule.waveStartTick;
route.fragmentReadyTick = schedule.fragmentStartTick + fragment.preDelayTicks;
```

fragment 是最近进入过的主线 Fragment，分支出生也不采用 Branch Phase 的时间基准。waveStartTick 是 Wave 进入时刻，fragmentReadyTick 是主 Fragment 前延迟结束时刻；两者是绝对战斗 Tick。

| 主线位置 | timing 查询的最近 Fragment |
| --- | --- |
| FRAGMENT | 当前 Wave 中 main.fragmentIndex 指向的 Fragment。 |
| WAITING／POST_DELAY | 当前 Wave 最后进入过的 Fragment。 |
| PRE_DELAY | 当前 Wave 之前最近进入过的 Fragment。 |
| COMPLETED | 主线最后进入过的 Fragment。 |

空 Wave 沿 Definition 向前查找，不为查询增加持久索引。尚未进入任何 Fragment 时 fragmentReadyTick=0；尚未进入任何 Wave 时 waveStartTick=0。COMPLETED 保留最后 Wave 索引，无 Wave 的索引为 0，时间查询也返回零基准。

## 等待关系与生命周期

等待政策属于 Spawn，实际关系属于 Schedule.State：

| Wait | waiting.wave | waiting.final |
| --- | --- | --- |
| NONE | 不登记。 | 不登记。 |
| FINAL | 不登记。 | 登记。 |
| WAVE | 登记。 | 登记。 |

WAVE 同时承担 Wave 等待和最终管理责任。Wave 等待超时只清 waiting.wave，不清 waiting.final，也不移除仍存在的 Unit。Unit 完整离场时，leaveHook 通过 resolveUnits 释放两个集合中的关系。

主线进入 POST_DELAY 后不重开已经完成的 Wave 等待；后延迟期间新增的 WAVE 关系不回退主线。进入下一 Wave 时清空 waiting.wave，waiting.final 保留，不把旧 Wave 的等待转交给下一 Wave。

Fragment 等待出生操作执行完，Wave 等待已登记 Unit 的关系解除，最终管理集合记录仍受调度管理的实例；这些是不同事实。Wait 不决定击杀、漏怪、扣血或全局计数资格。

Data 先合并 Action 与已解析 EnemyData 的 notCountInTotal，再结合普通 Spawn 所处主 Wave／Branch 上下文生成等待政策。Action 字段缺省为 false：

```typescript
const notCountInTotal = action.notCountInTotal || enemy.notCountInTotal;
const wait: Wait =
    notCountInTotal || !managedByScheduler
        ? "NONE"
        : dontBlockWave || (fromBranch && !forceBlockWaveInBranch)
          ? "FINAL"
          : "WAVE";
```

notCountInTotal 为 true 时不登记两个等待集合，即使 Unit 仍在场也不阻止波次或调度完成。Branch 默认不阻波；forceBlockWaveInBranch 只取消这一豁免，不能压过 notCountInTotal=true、managedByScheduler=false 或 dontBlockWave=true。Core 直接执行转换后的 Wait，不再次根据出生位置推导默认政策。

## 领域边界

Schedule 提供调度进度与实际等待事实，Route 到达出口后请求 Unit 完整移除，通用生命周期通过已登记的 leaveHook 反馈等待释放。Unit 不持有 Schedule 的等待政策，Battle 也不重复解释路线出口。

Schedule 只提供调度进度与等待事实，不处理统计、蓝门扣血或胜负。State 不持有 Total／Finished／Killed，也不产生 Battle.result。演示或外部规则可以读取 isCompleted 等事实决定何时结束其运行。

## 回归语义

- Spawn.atTick 在前延迟之后计时；出生位置和 Route offset 使用同一次固定偏移加随机扰动，Unit.enter 能看到已登记的等待关系。
- 主线零延迟连续推进，Fragment 完成不等 Unit 离场；WAVE 同时登记两个集合，超时仅释放 wave，完整离场同步释放二者。Data 合并 Action／Enemy 的 notCountInTotal，主线与 Branch 均将其转换为 NONE，不等待这些仍在场的 Unit。
- Branch 零延迟出生同步发生，enter 重入同一 Branch 时看见新的索引与 RNG，外层继续后不覆盖内层实例或重复出生。
- Branch 每次执行按整组权重重新抽选；触发 Tick 与后续常规推进各负其责，延迟出生只执行一次。
- 分支出生使用实际出生时的主流程时间快照；空计划、空 Wave 与主线结束后的时间查询及完成条件保持明确。

## 机制依据

[案例 30：通用 Scheduler 字段消费与调用路径](../research/cases/30-scheduler-action-data-fields.md)记录主 Wave、Fragment、Branch Phase、随机预处理、管理集合与统计的原生证据及限制。[Route](navigation.md#route-定义与进度)规定初始化、等待和出口契约。机制研究提供证据，本页规定项目的职责与行为。
