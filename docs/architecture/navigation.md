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

create 信任来自同一战场地块地图的 WALK／FLY 投影，直接保存传入的 readonly baseline Record 引用，不重复验证尺寸或 FLY 基础代价，不复制或冻结容器。初始 WALK、FLY Overlay 集合均为空数组。调用方遵守 readonly 输入契约，后续变更通过新 State 表达。

基础 Map 由 Battlefield 创建和转换后传入，Navigation 不负责解释战场地块。

### Overlay 登记

操作在指定 mode 的集合中按 ID 定位。每个集合中 ID 唯一，Overlay 本身不保存 mode。

| 操作 | 行为 |
| --- | --- |
| setOverlay，ID 不存在 | 新增 Overlay。 |
| setOverlay，ID 已存在 | 替换原 Overlay，保留 ID。 |
| removeOverlay，ID 存在 | 删除对应 Overlay。 |
| removeOverlay，ID 不存在 | 返回原 State。 |

操作不修改输入 State，以新集合保存变更。setOverlay 在实际登记入口校验 ID 为非负安全整数，提供 cost 时要求它为正安全整数；登记 FLY Overlay 时，cost 只能省略或为 1。通过校验后直接保存 readonly Overlay 引用，不复制或冻结其数组与坐标；通用 apply 保持已有合并规则。

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

- Route.advance 更新等待、检查路点、执行即时指令；Route.movementTarget 选择活动路线，转换路线偏移并调用 Navigation.nextPoint，返回实际世界坐标中的 nextPoint 与 goal；Locomotion 使用当前 pathMotionMode 执行运动。
- 地图内的不可达路点直接利用 nextPoint 的 null 结果反馈给 Route，决定等待或跳过。当前不增加独立可达性查询、失败原因联合类型或额外的 Navigation API。
- 地图外的位置恢复目标由 Route 的追踪点查询协调，Locomotion 负责实际位移及空间约束，不要求 Navigation 为此扩张返回类型。
- 每 Tick 等待最多计时一次、路点可以连续推进、移动只消费一次预算。移动前后如何组织 Route 结算可以采用简单、确定的项目顺序，不强制复制客户端调用位置。
- 路线出生偏移在 Spawn 构造最终 Definition 前采样，保存在 Definition.offset 中。移动路点仅使用固定 position 与 offset，不保留尚无配置需求的路点随机开关和可配置到达半径。
- Route Definition 不保留 allowDiagonalMove、visitEveryTileCenter、visitEveryNodeCenter。Locomotion 若需要其他运动执行进度，由 Unit 持有，不藏进导航缓存。

Locomotion 使用原生 Steering、八邻域地形避障和目的格反射。局部力每次积分时计算，不保存刷新缓存或计数器；完整 Unity 刚体系统及推拉不属于普通自主移动。

## Route 定义与进度

Route 将不可变指令与对应执行进度配对。主路线和临时替代路线使用同一结构，各自引用对应的不可变 Definition；相同定义在实例与快照之间直接共享：

```typescript
export type Checkpoint =
    | {
          readonly type: "MOVE";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
      }
    | { readonly type: "WAIT"; readonly tick: number }
    | { readonly type: "WAIT_UNTIL"; readonly tick: number }
    | {
          readonly type: "APPEAR_AT_POS";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
      }
    | { readonly type: "DISAPPEAR" }
    | { readonly type: "ALERT" }
    | { readonly type: "GOTO"; readonly index: number };

export interface Definition {
    readonly pathMotionMode: MotionMode;
    readonly startPosition: TilePosition;
    readonly endPosition: TilePosition;
    readonly offset: WorldPosition;
    readonly checkpoints: readonly Checkpoint[];
    readonly requireAllCheckpoints: boolean;
    readonly alwaysCheckCurrentPoint: boolean;
}

export type CheckpointState =
    | { readonly type: "PENDING" }
    | { readonly type: "MOVING" }
    | {
          readonly type: "WAITING";
          readonly deadlineTick: number;
      }
    | { readonly type: "CONSUMED" };

export type Phase =
    | {
          readonly type: "CHECKPOINT";
          readonly index: number;
          readonly checkpointState: CheckpointState;
      }
    | { readonly type: "END" }
    | { readonly type: "COMPLETED" };

export interface Progress {
    readonly definition: Definition;
    readonly pathMotionMode: MotionMode;
    readonly phase: Phase;
}

export interface State {
    readonly main: Progress;
    readonly alternative: Progress | null;
}

export interface Route {
    readonly definition: {
        readonly route: Definition;
    };
    readonly route: State;
}

export function initialize(
    battle: BattleState,
    definition: Definition,
): Result<State>;

export function advance(
    battle: BattleState,
    ref: Ref<Unit & Route>,
): BattleState;

export function isCompleted(state: State): boolean;

export function movementTarget(
    battle: BattleState,
    ref: Ref<Unit & Route>,
): MovementTarget | null;

export function pathMotionMode(state: State): MotionMode;

export function setPathMotionMode(
    battle: BattleState,
    ref: Ref<Unit & Route>,
    mode: MotionMode,
): BattleState;

export function setAlternative(
    battle: BattleState,
    ref: Ref<Unit & Route>,
    definition: Definition,
): BattleState;

export function clearAlternative(
    battle: BattleState,
    ref: Ref<Unit & Route>,
): BattleState;
```

当前执行路线取 `state.alternative ?? state.main`。已完成的 Alternative 仍然占用活动路线位置；此时 movementTarget 返回 null，不回退到 Main。切换替代路线保留 main 的进度；恢复时依据单位的实际当前位置继续。替代路线取得执行权不自动意味着主路线的全部等待时钟暂停，等待所用时钟由指令语义决定。

Alternative 接管时，Main 不推进路点，但仍独立检查终点完成资格；requireAllCheckpoints 为 true 且仍有未完成路点时，不会提前完成。符合完成条件时 Main 仍可进入 COMPLETED，由 Battle 处理正常离场。这保留了客户端恐惧／吸引分支的可观测行为，证据见 [路线字段与完成检查](../research/cases/14-route-definition-fields.md)。

Route.movementTarget 从最新 BattleState 读取单位并选择活动路线。MOVE 的目标由当前指令的 position 与 offset 推导；END 的目标为 definition.endPosition。查询将身体坐标减去对应路线偏移，调用 Navigation.nextPoint，再给 nextPoint 和 goal 加回路线偏移。Locomotion 不需要知道活动路线、路线偏移或 Field；MotionMode 通过 MovementContext 传入。完成由 Phase 表达，不用 null 表示完成。

Route 不对 Navigation 返回的追踪点追加整段射线筛选，也不回退到当前格中心。追踪点与当前实际位置之间的完整直线未必可通行；实际位移的合法性在运动结算中检查，不能借此替换导航目标或提前拒绝整段导航建议。

Definition.pathMotionMode 是初始通行模式，Progress.pathMotionMode 是当前模式。setPathMotionMode 更新当前活动 Progress，保留 Definition 和 Phase；Main 与 Alternative 各自保存模式，clearAlternative 恢复 Main 原有模式。Route 查询与传给 Locomotion 的 mode 读取同一当前值。Layer 的 State.type（unit.layer.type）独立表达空地身份，升空不自动改变寻路方式。startPosition 用于初始位置及路线相关查询；Definition.offset 是构造最终 Definition 前已经采样的总路线偏移，Progress 不重复保存。原始 offset 与 randomRange 只作为 Spawn 构造输入，不将 randomRange 保留在最终 Definition 中。

requireAllCheckpoints 承接原 visitEveryCheckPoint 的语义，控制是否允许在尚未逐个完成路点时，因抵达终点而提前完成路线。alwaysCheckCurrentPoint 同样是固定执行政策，由 Definition 持有。CONSUMED 表示当前指令已经消费，用于同步重入时避免重复执行，不表示整条路线完成。类型、初始化及 isCompleted／pathMotionMode 的局部读取归 route/capability.ts；movementTarget 及其 target／recoveryPoint 辅助查询归 route/query.ts，target 仅供领域内部共享，不从 index 导出。完整路线操作仍由 route/operations.ts 提供，公共入口名字与业务契约不变。

### 指令归一化

敌人实例化时已经拥有原始路线及该次出生的完整时间上下文。在构造 Unit Definition 之前完成 Route Definition 规范化，再初始化 Route State 并登记单位。带路线的创建结果保留原 Unit Definition 的内容字段及联合分支信息，仅将 route 替换为规范化后的 Route.Definition。Main 的 Progress.definition 与 unit.definition.route 引用同一份不可变 Definition；Alternative 引用设置时传入的规范化 Definition。Unit 不同时保存原始路线和展开后的主路线，也不修改共享敌人内容 Definition。

PATROL_MOVE 归一化为 MOVE 与显式 GOTO。不保留 MAP_OFFSET_MOVE、allowDiagonalMove、visitEveryTileCenter、visitEveryNodeCenter、MOVE 的随机开关及可配置到达半径。引航者试炼不在支持范围内，不保留 Boss 波次等待指令及其计数状态。

规范化后的等待仅有 WAIT 与 WAIT_UNTIL：

```text
WAIT_CURRENT_WAVE_TICKS(n)     → WAIT_UNTIL(waveStartedAtTick + n)
WAIT_CURRENT_FRAGMENT_TICKS(n) → WAIT_UNTIL(fragmentStartedAtTick + n)
```

波次与片段起点使用该次 Spawn 已确定的上下文；分支 CURRENT_MAIN 在实际派发时取得这些起点，不能提前到关卡解析或分支队列建立时绑定。规范化属于 Spawn／Content 构造层，Route.initialize 只消费最终 Definition，Progress 不保存 Timing，advance 不处理波次或片段换算。

进入 WAIT 时记录 deadlineTick = battle.tick + checkpoint.tick；进入 WAIT_UNTIL 时记录 deadlineTick = checkpoint.tick。到期判断统一为 battle.tick >= deadlineTick；已经过期的等待立即满足。普通相对等待不能在出生时提前换算，因为进入时间取决于移动、阻挡及循环。

跳转目标按归一化后的完整指令序列确定。执行 GOTO 时更新 index，将 checkpointState 重置为 PENDING，同 Tick 继续处理，不消耗时间或移动预算，不增加 GOTO 运行阶段。GOTO 重新进入 WAIT 时重新计算截止时间；WAIT_UNTIL 的绝对时间保持不变。切换 Alternative 后恢复 Main 保留已进入等待的 deadlineTick。阻挡、眩晕与恐惧不暂停已进入等待所使用的战斗时钟。

实际形成的巡逻回边没有次数上限，但并非每个 PATROL_MOVE 都产生回边；归一化必须分析完整巡逻段，不能将每个巡逻节点转换成自循环。无限巡逻保留 GOTO 回边，不能靠有限复制展开。

单次 advance 必须限制即时转换次数。耗尽预算时保留当前执行进度，后续 Tick 继续，不将合法循环拒绝为无效 Definition，也不在一次调用中无限执行。现有实现使用 128 次预算；具体数值属于实现选择，不影响公开接口。

advance 直接通过领域公开操作结算 DISAPPEAR、APPEAR_AT_POS 等即时指令，不向调用方返回待执行的信号队列。执行可能同步回调的操作前先记录指令已进入或消费，回调后重新读取最新单位与路线进度，防止重复执行或用旧进度覆盖替换结果。不在查询中隐式进入路点或执行 GOTO。

### 初始化

初始化流程已经确定：

```text
Spawn 提供原始路线及波次、片段起始时间
    ↓
规范化指令、采样总路线偏移，构造最终 Route Definition
    ↓
根据 Definition.startPosition 与 Definition.offset 确定初始 Unit.position
    ↓
Unit 初始化各 Capability，包括 Route State
    ↓
登记 Unit
    ↓
Route.advance()
    ↓
Locomotion
```

Route 初始化遵循 [Capability 约定](capability.md)，统一使用 initialize(battle, definition): Result<State>。Spawn 负责采样并接续更新后的 BattleState；Route.initialize 只建立执行进度，不再采样。初始 Unit.position 与路线查询使用同一份 Definition.offset。

Alternative 的业务所有者同样提供已经规范化、偏移已经确定的 Definition，再调用 setAlternative。

### Alternative 操作

| 情况 | 行为 |
| --- | --- |
| 没有 Alternative，调用 setAlternative | 创建并启用新的 Progress。 |
| 已有 Alternative，再次调用 setAlternative | 替换旧路线，从头开始执行。 |
| 重复设置同一个 Definition | 仍然重新开始，不按对象身份跳过。 |
| 调用 clearAlternative | 删除 Alternative，恢复 Main 原有进度。 |
| 没有 Alternative 时调用 clearAlternative | 返回原 BattleState。 |
| Alternative 抵达终点 | 标记 COMPLETED，不自动清除。 |

Alternative 是否存在由业务所有者控制，执行完成只改变其 Progress.phase。例如恐惧安装临时路线，抵达终点后保持 Alternative 为 COMPLETED，暂时没有移动目标；恐惧结束时调用 clearAlternative，单位才恢复 Main。

### Main 完成与 Battle 出口

Route 将 Main 标记为 COMPLETED。isCompleted(state) 是局部查询，仅判断 state.main.phase.type === "COMPLETED"，不采用活动路线选择逻辑。Alternative 完成不表示 Main 完成，也不触发正常路线离场。

Battle 负责完成后的出口：

```text
Route.advance()
    ↓
Main 是否 COMPLETED？
    ├─ 否 → 正常进入 Locomotion
    └─ 是
         ↓
       是否允许离场？
         ├─ 否 → 保留 Unit 与 Main 的完成状态，后续重新检查
         └─ 是
              ├─ 记录 ROUTE_COMPLETED
              └─ Unit.remove(..., "SCRIPT")
```

是否允许离场由 Battle 的结算政策判断，Route 不自行执行 Unit 离场。暂不能离场期间不重复产生 ROUTE_COMPLETED；事件在允许正常离场时由 Battle 记录，随后通过 Unit 的完整生命周期操作结算离场。

advance 可以同步触发跨领域操作。Battle 必须从其返回的最新 BattleState 重新读取 Unit，确认生命周期，再查询完成状态及离场资格；不能沿用推进前的 Unit 或 Route 快照。

## Locomotion

Locomotion 是独立 Capability。Definition 的 speed 与 minSpeed 使用格/Tick；steeringParameters 已由内容适配为每 Tick 参数：原生 steeringFactor 除以 tickRate，maxSteeringForce 除以 tickRate²。halfBodyWidth 使用世界距离，独立于命中半径。真实移动 Profile 读取 MovementController._halfBodyWidth；Content 工厂显式接收独立半宽，不从 AttackTiming.hitRadius 推导。

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

export interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, self: Unit & Locomotion) => boolean;
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

export function setRule(state: State, rule: Rule): State;
export function removeRule(state: State, id: string): State;
export function setSpeedContribution(
    state: State,
    entry: Contribution<Input>,
): State;
export function removeSpeedContribution(state: State, id: string): State;
```

类型、初始化、类型守卫及 Rule／速度贡献的局部登记变换统一位于 locomotion/capability.ts；operations.ts 只提供完整推进，不再转发局部 setter。canMove 与 resolveSpeed 是内部辅助函数。初始化验证速度、下限、几何半宽和转向参数非负，不要求基础速度已经大于 minSpeed。

推进读取最新 Unit，要求生命周期 PRESENT、空间存在且所有 Rule 允许。Movement 在 Route 推进后查询当前关系，只有自主移动受阻挡门禁约束；Locomotion 在实际位置提交后显式调用 Blocking.maintain，保留历史 velocity，不依赖 unit.update 自动扫描关系。SpatialPresence 的空间操作及 Route 无 Presence 分支的显式位置变化也由各自完整操作主动维护。Blocking 不再同步专用禁移 Rule，见 [Blocking 设计](blocking.md)。有效速度为 `max(minSpeed, attribute.apply(speed, contributions)) * speedMultiplier`。无目标时 Runtime 不调用 advance；速度为零或不允许移动时返回原 BattleState，保留 velocity。

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

`moveCost` 统一改为 `cost`。Map 不保存移动方式、历史 revision 或公开的 Hash 字段。

Map 构造器直接保存 rows、columns 与 readonly cells 引用，Cell 及 departures 同样共享，不逐格校验、不复制快照，也不执行运行时冻结。尺寸、稠密 Cell 数组和有效代价由上游输入构造与地块投影提供；调用方遵守 readonly 契约，不在发布后修改共享输入。FLY 基础代价为 1 由战场地块投影产生，setOverlay 保留 FLY 覆盖代价只能为 1 的入口约束。

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

Overlay 覆盖已经确定的格子，使用公共 `Ref<Overlay>` 表达身份。它不保存移动方式，也不管理自身生命周期。生命周期由具体业务所有者负责，Battlefield 在必要时协调其对 Navigation 的影响。删除旧 NavigationModifier 的 source、follow、expiresAtTick 等通用管理机制，不在 Battlefield 恢复同一套机制。

Overlay 直接以 readonly 对象表达，不另设构造函数；数值校验集中在 Navigation.setOverlay 入口。内部格子坐标、数组与 Overlay 对象直接共享。移动方式由 State 中的登记集合及操作参数 mode 决定，不需要 Overlay 保存，也不引入 Layer。

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

不另设 resolve。apply 可以透明使用缓存，缓存命中率、对象复用和淘汰策略不进入 API 契约。removeOverlay 更新权威 Overlay 集合，后续查询重新 apply 或复用相同内容的缓存，不对有效 Map 做逆操作。

## hash

`map.ts` 的 `hash(map)` 仅由地图尺寸与全部 Cell 内容决定。`a.equals(b)` 为真时，两者 Hash 必须相同；Hash 相同不保证地图相等。

`hash` 完整读取地图内容。增量计算可以作为内部优化，不改变该接口或判等契约。

## 内部缓存

有效 Map 使用 `WeakMap<State, Partial<Record<MotionMode, Map>>>` 按 State 身份与移动方式复用。Field 使用 `WeakMap<Map, Map<TargetKey, Field>>` 按有效 Map 身份与目标格复用；命中后直接返回，未命中则构建并登记 Field。

精确的 WorldPosition 不进入 Field 缓存键，仍由 nextPoint 在末段返回。缓存不调用 Hash 或内容比较，不保存历史内容索引、容量预算或淘汰顺序。不同 Map 即使内容相等，也各自构建 Field；缓存只保留仍存活 State／Map 所需的派生结果。

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

Field 是只读、可共享的目标导向寻路结果，不持有 Map。rows、columns 描述网格尺寸，nodes 是完整稠密数组，长度为 rows × columns，以 row × columns + col 定位对应节点；null 是不可达的唯一节点值。Field、Node 与数组不执行运行时冻结，消费方遵守 readonly 契约。

- 不可达格：nodes[index] 为 null。
- 可达目标格：distance 为 0，next 为 null。
- 其他可达格：distance 为正数，next 为平滑后的后继坐标。

Map 的代价为正，因此只有可达目标节点的 distance 为 0。target 记录请求目标，不保证该格一定可达；目标格越界或不可通时，nodes 全部为 null。上述不变量由 build 保证，不增加显式状态判别字段。

distance 使用普通 number 直接累计原始 SPFA 代价，不增加理论溢出的 Infinity 回退或额外抛错分支；平滑后不重新计算，不表示实际连续运动距离。Map 是 build 的输入，缓存仍可依据输入 Map 和目标定位结果，不要求在 Field 中反向保存 Map。

最终 Node.next 只保存平滑后的后继，不保存 rawNext 或 nextTurn。原始后继可以作为内部构建工作值，经平滑覆盖后发布只读 Field。Field 不保存 Cursor、Visits 或其他 Unit 执行进度。

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

Navigation 使用上述 SPFA 与原地平滑，删除旧计算的射线代价预算及 query.ts 的三候选回退。Route 管理指令与导航追踪点，包括地图外恢复目标；Locomotion 消费实际世界坐标与当前模式，并内部完成运动、避障及目的格反射；Battle 负责调度和生命周期。两个 Capability 经由 Catalog 独立初始化，不保存共享 Field、请求 ID 或缓存 Provider。
