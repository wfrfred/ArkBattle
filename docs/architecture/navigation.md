# Navigation 设计

本页规定 Navigation、Route 与 Locomotion 的类型、API 与行为契约。

Route 与 Locomotion 的公共契约分别从 [route/index.ts](../../src/core/unit/capability/route/index.ts)、[locomotion/index.ts](../../src/core/unit/capability/locomotion/index.ts) 导入；Navigation 保留下面按状态与算法划分的自然入口，不增加模板 index。Core 调度可以直接依赖实际模型、查询和操作文件。

文件按职责划分：

```text
navigation/
├── map.ts       Cell、Map、判等与 Hash
├── overlay.ts   Overlay 与应用
├── field.ts     Node、Field、SPFA 构建与原地平滑
├── raycast.ts   导航射线与沿途格子通行检查
├── state.ts     权威状态与公开操作
└── cache.ts     两层身份缓存及派生值读取
```

Field 选择平滑候选、沿后继链推进并修改 next；Raycast 检查给定两点间的格子和有向出口，不维护后继链。缓存是内部可变派生存储，与不可变的权威 State 分开。

## 职责与状态归属

Navigation 是独立子系统，负责基础通行规则、Overlay 操作与导航查询。Battlefield 将战场地块转换为基础 Map，调用 Navigation.create 创建状态并持有该值。有效地图和寻路场是确定性派生结果，可以重新计算。

Route 与 Locomotion 是两个独立 Unit Capability。Route 管理行程并调用 Navigation，把路线目标解析为实际世界坐标中的追踪点；Locomotion 消费追踪点并执行实际运动。

上层 Navigation 查询的公开目标使用精确的 `WorldPosition`；Field 构建接收由 `World.toTile(target)` 派生的 `TilePosition`。精确目标继续用于末段移动及到达判断。当前没有已经核实的需求要求上层调用方同时提供独立的原始目标格。

Navigation.State 聚合基础 Map 与 Overlay 集合这两项权威输入，由 Battlefield.State.navigation 持有，不增加 Layer。apply 的有效 Map 与 Field 是派生结果，不放进 State。单位的 Cursor、Visits 等执行进度仍归 Unit，不混入战场级导航规则状态。

Navigation 内部维护可变派生缓存，不进入 BattleState，也不需要 Operation 返回缓存的新状态。缓存命中、未命中、淘汰或重建不得改变领域结果。

### Navigation 的关键语义

- 通行资格、WALK／FLY 代价和有向出口共同决定可达性，不能因额外直线筛选而替换 Field 的导航建议。
- Overlay 只能增加限制；多来源叠加以及撤销其中一项后，都继续保留其他来源和基础地图的限制。
- 当前地图或 Overlay 变化后，查询使用该版本的有效规则；旧状态的查询结果不被后来变更污染。
- 不可达时返回 null；能够追踪目标时保留精确世界坐标，实际移动与到达由消费方判断。
- 路径计算及缓存保持确定结果。Hash 数值、缓存键、对象共享和命中次数属于内部实现，不形成独立玩法验收目标。

Battlefield 的纯存储、地块写回与完整 Battle 操作边界见 [Battlefield](battlefield.md)。下文的类型与算法说明用于解释这些语义，不要求按每个字段或内部函数分别建立验收场景。Route 与 [Schedule](schedule.md) 一并重设计，已确认 Definition／Plan／Initial／Context、Context 关系与稳定身份需求；Phase、State 的 Context 组织及操作接口继续讨论。Navigation、Locomotion 的已审查职责不因此改变。

## State 与公共操作

navigation/state.ts 定义 Navigation 自身的 State。接口不依赖完整 BattleState、BattlefieldState 或 Battlefield 的具体地图类型。

```typescript
export type MotionMode = "WALK" | "FLY";

export interface State {
    readonly baseline: Readonly<Record<MotionMode, Map>>;
    readonly overlays:
        Readonly<Record<MotionMode, readonly Overlay[]>>;
}

export function create(
    baseline: Readonly<Record<MotionMode, Map>>,
): State;

export function setOverlay(
    state: State,
    mode: MotionMode,
    overlay: Overlay,
): State;

export function removeOverlay(
    state: State,
    mode: MotionMode,
    ref: Ref<Overlay>,
): State;

export function nextPoint(
    state: State,
    mode: MotionMode,
    current: WorldPosition,
    target: WorldPosition,
): WorldPosition | null;
```

### 创建

create 信任来自同一战场地块地图的 WALK／FLY 投影，不重复验证尺寸或 FLY 基础代价。调用方遵守 readonly 输入契约，后续变更通过新 State 表达；Overlay 初始为空。

基础 Map 由 Battlefield 创建和转换后传入，Navigation 不负责解释战场地块。

### Overlay 登记

操作在指定 mode 的集合中按 ID 定位。每个集合中 ID 唯一，Overlay 本身不保存 mode。

| 操作 | 行为 |
| --- | --- |
| setOverlay，ID 不存在 | 新增 Overlay。 |
| setOverlay，ID 已存在且为同一对象 | 返回原 State。 |
| setOverlay，ID 已存在且为新对象 | 替换原 Overlay，保留登记位置。 |
| removeOverlay，ID 存在 | 删除对应 Overlay。 |
| removeOverlay，ID 不存在 | 返回原 State。 |

操作不修改输入 State，以新集合保存实际变更。同一 Overlay 对象重复登记没有刷新语义，沿用普通登记操作的同引用不变约定。setOverlay 在实际登记入口建立 ID 与代价约束：ID 为非负安全整数，提供 cost 时须为正安全整数；FLY 的 cost 只能省略或为 1。内部 apply 信任已登记的数据，按下面的合并规则计算。

### nextPoint

内部根据 State 与 mode 计算有效 Map，再按 target 所在格获取或构建 Field。调用方只提供当前位置和精确目标，不需要取得 Map、Field 或组合内部构建函数。

| 条件 | 返回值 |
| --- | --- |
| current 在地图外 | null。 |
| target 在地图外或目标格不可通行 | null。 |
| 当前格对应 Node 为 null | null。 |
| 当前格是有效目标节点，或 Node.next 指向目标格 | 精确的 target。 |
| 当前格存在其他 Node.next | next 对应格子的中心坐标。 |

当下一导航格已是目标格时，就追踪精确 target。返回坐标是建议追踪点，实际能移动多远由 Locomotion 决定。

nextPoint 不执行额外 Raycast，不维护或推进 Cursor、Visits，也不判断是否抵达。即使 current 已非常接近 target，也按相同规则返回建议坐标；抵达由 Locomotion／Route 根据实际位置判断，null 不兼作到达通知。

nextPoint 不保证返回位置能从当前实际坐标直线到达。Field 平滑基于格子规则，单位偏离格子中心后的实际运动、局部避障与位移修正交给 Locomotion。

nextPoint 不修改 State。同一 State 与相同参数始终产生相同的坐标值或 null，结果对象身份不作承诺。有效 Map、Field 可以内部缓存；命中、未命中、淘汰或重建不改变返回结果。缓存不能保存影响查询结果的隐式执行历史。

Field、build、queryField 均不属于调用方使用 Navigation 所需的公共接口。

### Route／Locomotion 的交互约束

按[项目语义判断标准](README.md)选择最小设计，不以客户端的类层级或函数调用位置作为接口要求。

- Route.advance 更新等待、检查路点、执行即时指令；Route.movementTarget 选择活动路线，转换路线偏移并调用 Navigation.nextPoint，返回实际世界坐标中的 nextPoint 与 goal；Locomotion 使用当前 motionMode 执行运动。
- 地图内的不可达路点直接利用 nextPoint 的 null 结果反馈给 Route，决定等待或跳过。当前不增加独立可达性查询、失败原因联合类型或额外的 Navigation API。
- 地图外的位置恢复目标由 Route 的追踪点查询协调，Locomotion 负责实际位移及空间约束，不要求 Navigation 为此扩张返回类型。
- 每 Tick 等待最多计时一次、路点可以连续推进、移动只消费一次预算。移动前后如何组织 Route 结算可以采用简单、确定的项目顺序，不强制复制客户端调用位置。
- 创建调用者处理出生偏移的配置与采样，通过 initial.route 传入 Plan 与本次 offset；初始 Unit.position 与路线计算使用同一样本。主路线与临时替代路线的样本各自配对，不将一个样本无条件应用于所有路线。
- Plan 不保留 allowDiagonalMove、visitEveryTileCenter、visitEveryNodeCenter。Locomotion 若需要其他运动执行进度，由 Unit 持有，不藏进导航缓存。

Locomotion 使用原生 Steering、八邻域地形避障和目的格反射。局部力每次积分时计算，不保存刷新缓存或计数器；完整 Unity 刚体系统及推拉不属于普通自主移动。

## Route 定义与进度

Route 是路线解释器。同一解释器使用不同的 Plan 与 Context，不为主路线、临时路线分别建立一套指令系统。

### 已确认的类型

```typescript
interface Definition {
    readonly alwaysCheckCurrentPoint: boolean;
}

interface Plan {
    readonly motionMode: MotionMode;
    readonly startPosition: TilePosition;
    readonly endPosition: TilePosition;
    readonly checkpoints: readonly Checkpoint[];
    readonly requireAllCheckpoints: boolean;
}

interface Initial {
    readonly plan: Plan;
    readonly offset: WorldPosition;
}

interface Context {
    readonly plan: Plan;
    readonly offset: WorldPosition;
    readonly phase: Phase;
    readonly alwaysCheckCurrentPoint: boolean;
}
```

Definition 声明能力的初始化配置；Plan 描述路线程序，可以预先配置，也可以在运行时构造或修改；Initial 是本次创建输入；Context 保存单份路线的当前 Plan、实例偏移、执行政策和进度，不再并列另一个 Execution 类型。共享 UnitDefinition 不绑定本次出生所选的 Plan。

Definition.alwaysCheckCurrentPoint 提供 Main 的初始值，Context.alwaysCheckCurrentPoint 保存该份执行实际使用的政策；临时控制可以明确使用 false。两者分别是初始配置与执行事实，普通 Initial 不重复传递该值。该政策只控制普通 MOVE 不可达时是否仍要求实际到达，不决定整条路线完成，依据见[案例 13 第 4.1 节](../research/cases/13-route-and-movement-timing.md#41-配置来源与-cursor-政策2026-11-08-补核)。

Context.plan 直接保存当前路线描述。motionMode 由该 Plan 提供给 Navigation 和 Locomotion，不在 Context 中再保存一份；startPosition 是路线起点，不代替 Unit.position。requireAllCheckpoints 决定能否在未完成全部路点时因抵达终点而完成路线。

Phase 的具体联合类型尚未定稿。它需要表达当前指令及必要执行数据，例如 MOVE 本次进入已采样的目标偏移、WAIT 截止时间和整条执行的完成状态，不保存每个历史路点的完整运行对象。

State 是一个 Unit 的 Route 聚合，组织主路线、临时路线及共享时间基准。已确认共享字段为：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| waveStartTick | number | 出生时捕获的主 Wave 进入时刻，即 Wave 前延迟开始时刻 |
| fragmentReadyTick | number | 出生时捕获的主 Fragment 前延迟结束时刻 |

多个 Context 的具体容器、Main 单独保存还是作为固定项、当前运动选择的字段及身份类型继续确定。`alternative: Context | null` 与 `Context[] + activeIndex` 都不能作为已定 State 声明；稳定定位要求见下文。

initial.route 使用上述 Initial。创建调用者负责选取或生成 Plan、解析 offset 及确定出生位置，Route initializer 据此构造 Main Context 并捕获共享时间基准，不要求所有创建者使用统一的 SpawnRoute 类型。

### Checkpoint

Checkpoint 类型已确认；Phase 和 Context 的组织、定位与操作接口继续审查。

```typescript
export type Checkpoint =
    | {
          readonly type: "MOVE";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
          readonly randomizeOffset: boolean;
      }
    | {
          readonly type: "WAIT";
          readonly anchor: "ENTER" | "BATTLE" | "WAVE" | "FRAGMENT";
          readonly ticks: number;
      }
    | {
          readonly type: "GOTO";
          readonly index: number;
      }
    | { readonly type: "DISAPPEAR" }
    | {
          readonly type: "APPEAR";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
      };
```

MOVE 的 randomizeOffset=false 时使用固定 offset；为 true 时，offset 各轴表示随机半宽，每次进入路点时独立采样各轴 [-offset, +offset]，后续沿用本次样本，不把固定偏移与随机偏移相加。APPEAR 始终使用固定落点偏移。

GOTO.index 指向当前路线程序中的指令。程序修改负责明确处理跳转引用，不将原生数组插入的隐式巡逻分段作为本类型的编辑契约。兼容目标是已确认的实际内容语义，不要求任意原生序列及任意编辑组合都等价；当前 Insert 与巡逻交叉结果见[案例 31 第 4.1 节](../research/cases/31-route-operations-and-state.md#41-insert-是否实际改变巡逻回边)。

原生主路线保留出生偏移，恐惧／吸引临时 Cursor 可以使用零偏移，因此偏移按 Context 保存；它们继承的出生时间基准由 State 共享，见[原生偏移证据](../research/cases/14-route-definition-fields.md#3-出生偏移持续作用于整条路线)。

Route.movementTarget 从最新 BattleState 读取单位与当前取得运动控制权的 Context。MOVE 的目标由当前指令 position 与本次进入已确定的偏移推导，查询不重新采样；终点取 context.plan.endPosition。查询将身体坐标减去 context.offset，调用 Navigation.nextPoint，再给 nextPoint 和 goal 加回偏移。Locomotion 消费实际坐标与对应 Plan 的 motionMode，不需要知道控制来源、路线偏移或 Field。完成由 Phase 表达，不用 null 表示完成。

Route 不对 Navigation 返回的追踪点追加整段射线筛选，也不回退到当前格中心。追踪点与当前实际位置之间的完整直线未必可通行；实际位移的合法性在运动结算中检查，不能借此替换导航目标或提前拒绝整段导航建议。

Layer 的 unit.layer.type 独立表达自身空地身份，修改路线的 motionMode 不自动等同于修改 Layer。跨领域副作用由对应完整操作明确组织。

### Plan 编辑与 Context 关系

Plan 是普通不可变数据。调用者可以直接构造编辑后的值，不必为每种数组编辑建立专用接口：

```typescript
const plan: Plan = {
    ...context.plan,
    checkpoints: [
        ...context.plan.checkpoints.slice(0, index),
        checkpoint,
        ...context.plan.checkpoints.slice(index),
    ],
};
```

构造新 Plan 与写回运行状态分开。提交通过 Route 自己提供的合法 Change 或完整操作，并明确如何接续 phase；不能因 Plan 对象变化自动重置全部进度，也不能跨领域直接重建 Route State。编辑者按本次操作语义处理 GOTO 索引与当前指令的对应关系。

已确认需要区分以下操作关系：

| 情况 | Context 处理 |
| --- | --- |
| 普通改道 | 原 Context 更换 Plan，按指定索引重新建立所需进度 |
| 修改路点或终点 | 构造新 Plan，按具体操作保留或重建进度，不因编辑本身新增 Context |
| 改变寻路方式 | 存在重建 Main 并继承部分事实的需求；具体继承与进入政策由操作接口明确 |
| 临时运动控制 | 独立 Context 可以并存，各自保留必要状态；控制业务决定当前运动来源与推进资格 |
| 路线缓存与恢复 | 需要该机制的 Content 保存旧 Plan 与必要索引，恢复时重新建立路点状态 |
| 地图变化 | 更新 Navigation 派生路径，不修改 Context 的程序、进度或既有目标样本 |

路线缓存不保存完整旧 Cursor，也不承诺原样恢复 WAIT 剩余时间或 MOVE 已采样目标。当前证据不要求通用的“暂停整个 Context、以后原样恢复”机制，不建立暂停栈。独立 Context 并存与业务缓存恢复不能互相替代，依据见[案例 31 的状态保留与需求归纳](../research/cases/31-route-operations-and-state.md#3-状态究竟保留什么)。

推进时间、推进 Checkpoint 与取得运动控制权分别处理。恐惧／诱导接管期间，Main 已进入的 WAIT 继续按战斗时钟到期，Main 的终点完成资格仍独立检查；不能让一个 activeIndex 统一决定所有 Context 是否计时、推进或完成。Trace 的控制政策不同，也不必强制包装成完整 Route Context。

多份诱导 Effect 可以各自保存来源、目标和有效期，通过生命周期程序登记与撤销。已确认的诱导需求是按新到旧选择有效来源；旧来源暂未取得运动控制权不等于 Effect 被禁用，通用 Group 不承担诱导选择。多个诱导来源不要求每份 Effect 都有完整 Context；原生多个 Buff→Tile 登记共享一个当前 Attract Cursor，来源失效后的回退由诱导程序处理。Route 不认识具体 Effect 类型，控制来源和 Context 的对应方式随操作接口确定。

### Context 身份与定位

外部创建者需要在后续更新 Plan 或结束控制时定位原 Context，因此动态 Context 需要稳定身份。新增操作应向调用者提供可供后续更新、移除使用的标识。

- 数组 index 只表示存储位置，其他 Context 被移除后可能变化，不能作为外部长期地址。
- 当前运动选择与 Context 身份不同；若 State 持久保存当前选择，当前倾向使用稳定标识定位，具体字段仍待定，不让存储位置成为长期地址。
- Context 随 phase 等字段的不可变更新产生新对象，旧 Context 对象引用不能直接作为长期身份。
- Route 分配数值 ID，或复用创建者已有的稳定身份，都是候选；具体形式在操作接口审查时确定，不同时维护两套身份。
- Main 固定存在，不要求为了与动态 Context 形式一致而经过动态登记或额外分配 ID。

State 的集合形式、Main 的定位方式、身份类型与作用域、创建／更新／移除／选择签名及选择后的推进协议均未定稿。这里记录定位需求，不新增 ContextId、Ref 包装或通用注册框架。

### 指令与实例求值

关卡中的静态指令由 Data 编译为 Plan，运行时创建者也可以生成 Plan。出生代码沿用完整 UnitDefinition，通过 initial.route 传入 `{ plan, offset }`；Route initializer 捕获本次出生的时间基准。Route 在自己的执行状态机中求值等待期限，不为绑定路线、偏移或时基重新合成 UnitDefinition。

PATROL_MOVE 归一化为 MOVE 与显式 GOTO，循环边界由显式跳转决定。不保留 MAP_OFFSET_MOVE、allowDiagonalMove、visitEveryTileCenter、visitEveryNodeCenter 及可配置到达半径。引航者试炼不在支持范围内，不保留 Boss 波次等待指令及其计数状态。

等待期限由指令与本次执行状态决定：

```text
WAIT(ENTER, ticks)    → 本路点进入时的 battle.tick + ticks
WAIT(BATTLE, ticks)   → ticks
WAIT(WAVE, ticks)     → state.waveStartTick + ticks
WAIT(FRAGMENT, ticks) → state.fragmentReadyTick + ticks
```

Wave／Fragment 基准在实际出生时捕获；分支采用当时的主线时间上下文，不能在解析关卡或选择 Phase 时提前固定。它们都是从战斗 Tick 0 起算的绝对时刻，WAIT.ticks 是相对所选基准的偏移。Route 运行时使用自身保存的快照，不重新查询已推进的 Schedule 主线。Wave 基准是进入时刻，Fragment 基准是前延迟结束时刻；后者由 Schedule.fragmentStartTick 加对应 Fragment.preDelayTicks 得到，其历史 Definition 的查询规则见 [Schedule](schedule.md#route-的主流程时间上下文)。

进入等待路点时，将所需期限保存在该路点的执行状态。到期判断统一为 battle.tick >= deadlineTick；已经过期的等待立即满足。普通相对等待不能在出生时提前换算，因为进入时间取决于移动、阻挡及循环。

跳转目标按归一化后的完整指令序列确定。执行 GOTO 时转入 index 指定的路点，按进入语义重新初始化，同 Tick 继续处理，不消耗时间或移动预算，不增加 GOTO 运行阶段。重新进入 WAIT 时按 anchor 计算截止时间：ENTER 从这次进入重新计时，BATTLE 的绝对阈值以及 WAVE／FRAGMENT 的实例基准保持不变。临时控制接管期间，Main 已进入等待的 deadlineTick 保留。阻挡、眩晕与恐惧不暂停已进入等待所使用的战斗时钟。

实际形成的巡逻回边没有次数上限，但并非每个 PATROL_MOVE 都产生回边；归一化必须分析完整巡逻段，不能将每个巡逻节点转换成自循环。无限巡逻保留 GOTO 回边，不能靠有限复制展开。

单次 advance 必须限制即时转换次数。耗尽预算时保留当前执行进度，后续 Tick 继续，不将合法循环拒绝为无效 Plan，也不在一次调用中无限执行；具体预算属于实现选择。

advance 直接通过领域公开操作结算 DISAPPEAR、APPEAR 等即时指令，不向调用方返回待执行的信号队列。执行可能同步回调的操作前先记录指令已进入或消费，回调后重新读取最新单位与路线进度，防止重复执行或用旧进度覆盖替换结果。不在查询中隐式进入路点或执行 GOTO。

### 初始化

初始化使用统一 Unit 入口。以 Schedule 出生为例：

```text
出生代码取得 UnitDefinition，选取或生成 Plan
    ↓
出生代码采样一次 offset，并接续更新后的 BattleState
    ↓
position = center(startPosition) + offset
    ↓
unit.initialize(battle, { id, definition, position, initial: { route: { plan, offset } } })
    → Capability fold
    → Route initializer 据 Plan、offset 与 Definition 初始政策构造 Main Context
    → 出生时间锚点保存于 Route State
    ↓
Schedule 登记等待关系 → unit.add 登记 Unit 并执行 enter
    ↓
Route.advance()
    ↓
Locomotion
```

Route 初始化遵循 [Capability 约定](capability.md)，通过 Catalog 的已有创建输入通道接收 `{ plan, offset }`，读取 Definition.alwaysCheckCurrentPoint 建立 Main Context，不重新采样出生偏移或接收预装的 Context。Plan 的来源不改变该初始化契约；复用已有 Plan 也不自动继承其他实例的执行进度。

waveStartTick／fragmentReadyTick 由 Route initializer 自行根据当时 Schedule 的主线时间取得，保存于 Route State，不由创建者通过 Initial 传入。普通出怪与技能、Buff、机制动态创建 Unit 使用同一规则；延迟创建在实际初始化时采样，不提前绑定，也不从召唤者继承。已有 Unit 新建临时 Context 继续使用该 State 的共享基准，不重新取样。原生出生与临时 Cursor 的区别见[案例 14 第 6.3—6.4 节](../research/cases/14-route-definition-fields.md#63-时间快照在实际出生链中绑定)。

Unit Creation 的调用者处理各自的路线来源与出生业务。Schedule 在初始化后、unit.add 前登记等待关系；技能、Buff 或机制创建 Unit 时自行组织其出生与必要后继。各调用者不必共享强制的 SpawnRoute 包装。

unit.add 接收完整 Unit，只负责登记和 enter，不解释 Plan 或构造 Context。重构时删除 creation/routed-unit.ts，不保留出生时重新生成、合成 UnitDefinition 的包装。

创建入口建立偏移、等待与跳转的输入约束；内部按游戏尺度计算采样范围和等待截止时间，信任合法输入，不为极端算术溢出追加结果断言。纯进度发布不执行回调，后续可直接使用已构造的新值；Presence／Blocking 等完整操作返回后，仍按续执行条件读取最新宿主和进度。

### Main 完成与 Battle 出口

Route 记录 Main 的完成状态。正常路线完成与离场资格始终针对 Main，不由当前运动选择决定；临时 Context 完成不表示 Main 完成，也不触发正常路线离场。Main 的具体存储位置与 Phase 类型尚未定稿。

Battle 负责完成后的出口：

```text
Route.advance()
    ↓
Main 是否已完成？
    ├─ 否 → 正常进入 Locomotion
    └─ 是
         ↓
       是否允许离场？
         ├─ 否 → 保留 Unit 与 Main 的完成状态，后续重新检查
         └─ 是
              ├─ 累计路线完成数并输出 ROUTE_COMPLETED
              └─ Unit.remove(..., "SCRIPT")
```

是否允许离场由 Battle 的结算政策判断，Route 不自行执行 Unit 离场。暂不能离场期间不增加完成计数或重复产生 ROUTE_COMPLETED；允许正常离场时由 Battle 直接累计路线完成数、输出漏怪表现事实，随后通过 Unit 的完整生命周期操作结算离场。统计不读取表现 Event，详见 [UI 瞬时输出](event.md)。

advance 可以同步触发跨领域操作。Battle 必须从其返回的最新 BattleState 重新读取 Unit，确认生命周期，再查询完成状态及离场资格；不能沿用推进前的 Unit 或 Route 快照。

## Locomotion

Locomotion 是独立 Capability。Definition 的 speed 与 minSpeed 使用格/Tick；steeringParameters 已由内容适配为每 Tick 参数：原生 steeringFactor 除以 tickRate，maxSteeringForce 除以 tickRate²。halfBodyWidth 使用世界距离，独立于命中半径。真实移动 Profile 读取 MovementController._halfBodyWidth；Content 工厂显式接收独立半宽，不从 AttackTiming.hitRadius 推导。

### 关键语义

- 当前速度贡献按属性公式求值，先应用 minSpeed，再乘本次运动倍率；Rule 独立决定是否允许自主移动。暂停或零速度不清除历史速度。
- Steering 使用历史速度、目标速度误差和局部避障力，合力先限幅，再积分并限速。接近最终 goal 时可直接到达并保留历史速度；中间 nextPoint 只提供方向。
- WALK 的避障同时考虑硬障碍和高代价格，FLY 只考虑硬障碍；半身宽用于横向几何，避障力去除沿目标方向的分量，并按历史速度比例缩放。当前位置不可通时采用相邻可通格的恢复方向。
- 普通积分只根据跨格后的目的格决定是否反射位移，反射不改写积分速度；不另加整段扫掠或反射后的二次通行检查。
- Route 的等待与即时指令、阻挡位置计划和自主移动分别推进。真实位置只保存于 Unit.position，历史 velocity 不代表本 Tick 一定移动。

这些结果由少量纯算法与真实移动场景分别保障，不按邻格方向、微小阈值、字段或暂停原因展开矩阵。登记、旧版本和缺失 Ref 等公共协议集中验证。场景通过正常构造、advance 和主动空间操作建立位置与历史速度，不注入运行状态。

```typescript
export interface Definition {
    readonly speed: number;
    readonly minSpeed: number;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Locomotion>;

export interface State {
    readonly velocity: WorldPosition;
    readonly speed: readonly Contribution<Input>[];
    readonly rules: readonly Rule[];
}

export interface RuleContext {
    readonly self: Unit & Locomotion;
}

export interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, context: RuleContext) => boolean;
}

export interface Locomotion {
    readonly definition: { readonly locomotion: Definition };
    readonly locomotion: State;
}

export interface MovementTarget {
    readonly nextPoint: WorldPosition;
    readonly goal: WorldPosition;
}

export interface MovementContext {
    readonly mode: MotionMode;
    readonly speedMultiplier: number;
}

export function advance(
    battle: BattleState,
    ref: Ref<Unit & Locomotion>,
    target: MovementTarget,
    context: MovementContext,
): BattleState;

export function setRule(rule: Rule): Change<Unit & Locomotion>;
export function removeRule(id: string): Change<Unit & Locomotion>;
export function setSpeedContribution(
    entry: Contribution<Input>,
): Change<Unit & Locomotion>;
export function removeSpeedContribution(id: string): Change<Unit & Locomotion>;
```

类型、初始化、守卫及 Rule／速度贡献 Change 工厂位于 locomotion/capability.ts；工厂不接收 Ref，返回 `Change<Unit & Locomotion>`，由 Unit.update 组合发布，不附带 Blocking 后继。operations.ts 提供完整推进，不转发工厂。初始化验证速度、下限、几何半宽和转向参数非负，不要求基础速度大于 minSpeed。

SteeringParameters 是普通配置值，不提供只校验并复制对象的构造工厂。Data 解析原始 Prefab 并完成 Tick 换算，Ground Enemy 内容工厂显式接收 halfBodyWidth 与 steeringParameters，不隐藏一组固定转向参数；演示调用方自行提供其示例配置。

推进读取最新 PRESENT 且 Rule 允许的 Unit；[空间消失](presence.md)由 Presence 登记 Locomotion Rule 禁止自主移动，不由 Locomotion 读取空间存在字段。Movement 先推进全部 Blockable 位置修正，再推进 Route 并读取当前关系，只限制自主移动；独立位置计划存在或刚完成不自动禁止自主移动。Locomotion 只经内部 replace 提交位置与速度，不依赖 Blocking 维护；Blockable 的偏移推进同样只发布位置与计划。依赖当前位置或其他 Battle 事实的阻挡 Rule 在后续 Blocking 检查点复核；明确要求解除旧关系的空间操作仍自行完成清理。Blocker／Blockable 在 Unit 初始化时至多选择一种，但该约束不决定是否具有 Route、Locomotion 或何种自身 Layer。

Presence Change 纯转换空间事实及所需限制，发布后按稳定能力角色调用 Blockable.release 或 Blocker.releaseAll，读取当前关系并完成清理；详细顺序见[空间存在](presence.md)。Route 在消失期间继续处理等待与出现指令；无 Presence 分支的 APPEAR 先发布位置，再调用相同完整操作。各释放操作自己的首个 RELEASED Hook 已可见新位置、所属计划清理和此次整批双端解除结果。release 不自动维护、搜索或取消目标计划，Blocker 的释放保留其原目标的偏移。Blocking 不同步专用禁移 Rule，见 [Blocking](blocking.md)。有效速度为 `max(minSpeed, attribute.apply(speed, contributions)) * speedMultiplier`；无目标不调 advance，速度为零或不可移动返回原 battle 并保留 velocity。

如果当前位置到 goal 的距离不超过本 Tick 预算，直接设置位置为 goal，保留 velocity，跳过 Steering、避障及目的格反射。nextPoint 仅用于计算 Steering 方向，不因接近中间导航节点而吸附。

正常积分先根据实际 Unit.position、halfBodyWidth 和 Navigation 有效 Map 计算八邻域避障。WALK 考虑硬不可通及 cost>=1000 的邻格；FLY 只考虑硬不可通。保留原生几何阈值、最近可通邻格选择、方向投影与速度比例缩放；原生局部力乘 `1/tickRate²` 后进入每 Tick 积分。使用实际身体位置作为几何基准，不引入 Route offset 或原生脚点安装偏移。

Steering 将局部力与目标速度误差产生的力相加后统一限幅，再更新速度并限制在有效移速内。仅当候选位移跨格且目的格不可通时，围绕当前位置指向目的格中心的法向量反射整次位移；不扫描完整线段，不因成本高而反射，也不再次检查反射后的目的格。最终位置可受反射修正，velocity 仍保存积分器得到的新速度。

State 不保存位置、目标、moving、避障缓存或刷新计数器。位置属于 Unit；实际位置变化由展示或业务观察者按需要读取，不能从保留的历史速度直接推断本 Tick 是否发生移动。推拉与直接传送使用各自的领域契约。

## Map

`navigation/map.ts`：

```typescript
export interface Cell {
    readonly passable: boolean;
    readonly cost: number;
    readonly departures: Readonly<Record<Direction, boolean>>;
}

export class Map {
    readonly rows: number;
    readonly columns: number;
    readonly cells: readonly Cell[];

    constructor(
        rows: number,
        columns: number,
        cells: readonly Cell[],
    );

    contains(position: TilePosition): boolean;
    get(position: TilePosition): Cell | undefined;
    equals(other: Map): boolean;
}

export type Hash = number;

export function hash(map: Map): Hash;
```

Map 描述尺寸和每个 Cell 的通行资格、代价及有向出口。移动方式由所属 State 的集合确定。

尺寸、完整 Cell 数据和有效代价由上游构造与地块投影建立。内部 Map 信任这些输入，遵守 readonly 契约，不逐格重复校验。FLY 的基础代价为 1，覆盖代价在 setOverlay 入口保持同一约束。

`equals` 比较尺寸及全部 Cell 内容。相同引用可以直接判等；若借助 Hash，Hash 相同后仍需确认内容。

## Overlay

```typescript
export type Id = number;

export interface Overlay extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly cells: readonly TilePosition[];

    readonly denyPassage: boolean;
    readonly denyDepartures: readonly Direction[];
    readonly cost?: number;
}

```

Overlay 覆盖已经确定的格子，使用公共 `Ref<Overlay>` 表达身份。它不保存移动方式，也不管理自身生命周期。何时登记、更新和撤销由具体业务所有者负责。

Overlay 以 readonly 值表达，数值校验集中在 Navigation.setOverlay 入口。移动方式由 State 中的登记集合及操作参数 mode 决定，与单位的空地身份分别表达。

单个格子的叠加语义为：

```typescript
cell.passable &&= !overlay.denyPassage;
cell.departures[d] &&= !overlay.denyDepartures.includes(d);
cell.cost = Math.max(cell.cost, overlay.cost ?? 1);
```

Overlay 只能增加这些限制，不能解除基础地图或其他 Overlay 已有的限制。叠加满足交换律和幂等性，顺序不影响最终内容。

## apply

```typescript
export function apply(
    base: Map,
    overlays: readonly Overlay[],
): Map;
```

`overlay.ts` 的 `apply` 是局部值转换，不修改任何输入。计算只读取 Overlay 的格子及限制，ID 不参与结果计算。超出 Map 范围的覆盖格子直接忽略。没有实际内容变化时可以复用 base，但对象复用不是领域契约。

不同输入得到相同地图内容时，不要求 `apply` 返回同一个对象；历史内容的对象复用属于缓存优化，不能成为路径有效性的业务前提。

removeOverlay 更新权威 Overlay 集合，后续查询按剩余集合重新计算有效规则，不对旧有效 Map 做逆操作。缓存命中率、对象复用和淘汰策略不进入业务契约。

## hash

`map.ts` 的 hash 是地图内容的辅助值；相等地图得到相同 Hash，Hash 相同仍不能代替内容判等。Hash 的具体数值和计算过程不影响通行语义，不作为玩法验收目标。

## 内部缓存

有效 Map 与目标导向 Field 可以按对应输入复用。同一目标格内的不同精确目标可以复用 Field，末段仍由 nextPoint 返回各自的精确 WorldPosition。

缓存不拥有执行进度，也不决定结果。缓存键、容器类型和存活策略均属于内部实现；重建或命中必须得到相同的导航建议。

## 内部 Field 类型与构建 API

`field.ts` 保存 Field 类型、构建与平滑过程。Field 是 Navigation 的内部计算结构，不作为调用方导航所需的公共契约：

```typescript
export interface Node {
    readonly distance: number;
    readonly next: TilePosition | null;
}

export interface Field {
    readonly rows: number;
    readonly columns: number;
    readonly target: TilePosition;
    readonly nodes: readonly (Node | null)[];
}

export function build(
    map: Map,
    target: TilePosition,
): Field;
```

Field 是只读的目标导向寻路结果。nodes 对应完整网格，null 表达不可达；内部布局和对象复用不改变下列含义：

- 不可达格：nodes[index] 为 null。
- 可达目标格：distance 为 0，next 为 null。
- 其他可达格：distance 为正数，next 为平滑后的后继坐标。

Map 的代价为正，因此只有可达目标节点的 distance 为 0。target 记录请求目标，不保证该格一定可达；目标格越界或不可通时，nodes 全部为 null。上述不变量由 build 保证，不增加显式状态判别字段。

distance 累计原始搜索代价，平滑后不重新计算，不表示实际连续运动距离。按游戏尺度信任已构造的合法代价，不为内部累加增加理论溢出协议。

最终 Node.next 表达平滑后的后继格。原始后继是构建工作值，Field 不保存 Unit 执行进度。

build 是不修改输入 Map 的确定性计算：

```text
验证目标格
    ↓
四方向 SPFA，写入原始 next
    ↓
同一内部工作数组按行优先顺序原地平滑 next
    ↓
发布只读 Field
```

目标格越界或不可通时，返回 nodes 全为 null 的 Field，保留请求 target 和地图尺寸，不因目标越界抛出异常。平滑读取已经更新的 next。项目范围明确排除生息演算，当前无已核实的关闭斜向平滑业务需求，因此 build、Field 和后续缓存键都不保留 allowDiagonalMove，统一采用允许斜向平滑的算法。原始搜索仍为四方向。

平滑按实际 from 到 to 的行进方向检查出口；为射线扫描排序端点，不改变有向通行规则。高成本格不参与平滑捷径。Locomotion 的局部避障将 WALK 下 cost>=1000 的可通格视为障碍类；目的格反射只检查 passable，不把高成本直接等同于不可通行。

额外的运动修正与强制访问政策按实际业务需求审查，不由 Field 或缓存接管。

## Field 与移动消费的研究依据

[客户端原生核对](../research/cases/12-navigation-native-algorithm.md)确认原始搜索后原地覆盖唯一的 next 完成平滑；普通移动不保留另一份 rawNext。[Route 与移动时序核对](../research/cases/13-route-and-movement-timing.md)记录路点、等待与运动消费的原生条件及调用顺序。

Navigation 使用上述搜索与平滑规则。Route 管理指令与导航追踪点，Locomotion 消费实际世界坐标并完成运动，Battle 负责调度和生命周期。导航计算保持独立，不接管这些执行状态。
