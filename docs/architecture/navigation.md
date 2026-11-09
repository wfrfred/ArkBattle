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

Battlefield 的纯存储、地块写回与完整 Battle 操作边界见 [Battlefield](battlefield.md)。下文的类型与算法说明用于解释这些语义，不要求按每个字段或内部函数分别建立验收场景。Route 与 [Schedule](schedule.md) 共同绑定出生路线和时间基准，Navigation 与 Locomotion 分别负责寻路和实际运动。

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
- Route 每 Tick 推进一次；各 Context 的相对等待是否计时由 ticking 决定，跨路点推进及位移目标由 activeId 选择。路点可以连续推进，移动只消费一次预算。
- 创建调用者处理出生偏移的配置与采样，通过 initial.route 传入 Plan 与本次 offset；初始 Unit.position 与路线计算使用同一样本。主路线与临时替代路线的样本各自配对，不将一个样本无条件应用于所有路线。
- Plan 不保留 allowDiagonalMove、visitEveryTileCenter、visitEveryNodeCenter。Locomotion 若需要其他运动执行进度，由 Unit 持有，不藏进导航缓存。

Locomotion 使用原生 Steering、八邻域地形避障和目的格反射。局部力每次积分时计算，不保存刷新缓存或计数器；完整 Unity 刚体系统及推拉不属于普通自主移动。

## Route 定义与进度

Route 是路线解释器。Main 与其他 Context 使用相同的 Plan、指令和进入逻辑；控制来源通过公开操作创建、选择或重建 Context。

### 类型与身份

```typescript
interface Definition {
    readonly alwaysCheckCurrentPoint: boolean;
}

interface Plan {
    readonly motionMode: MotionMode;
    readonly startPosition: TilePosition;
    readonly endPosition: TilePosition | null;
    readonly checkpoints: readonly Checkpoint[];
    readonly requireAllCheckpoints: boolean;
}

interface Initial {
    readonly plan: Plan;
    readonly offset: WorldPosition;
}

type ContextId = number;

interface Context extends Identified<{
    readonly host: Ref<Unit & Route>;
    readonly id: ContextId;
}> {
    readonly id: ContextId;
    readonly plan: Plan;
    readonly offset: WorldPosition;
    readonly index: number;
    readonly current: Checkpoint | null;
    readonly alwaysCheckCurrentPoint: boolean;
    readonly ticking: boolean;
}

interface State {
    readonly main: Context;
    readonly others: readonly Context[];
    readonly activeId: ContextId;
    readonly nextContextId: ContextId;
    readonly waveStartTick: number;
    readonly fragmentReadyTick: number;
}
```

Definition 声明能力的初始化政策。Plan 是不可变的路线程序，motionMode 同时供 Navigation 与 Locomotion 使用；startPosition 描述出生路线起点，不代替 Unit.position。endPosition=null 表示没有最终终点。requireAllCheckpoints 决定存在终点时，是否要求先耗尽全部指令才具备 Main 的出口资格。

Initial 是本次 Unit 创建必需的 `{ plan, offset }` 输入；Plan 不放入共享 UnitDefinition。创建者决定 Plan 与偏移样本，Route initializer 用 Definition.alwaysCheckCurrentPoint 初始化 Main，临时 Context 可以使用自己的执行政策。alwaysCheckCurrentPoint 只控制普通 MOVE 不可达时是否仍须实际到达，不决定计时、控制优先级或 Main 出口。

Main 是 Unit 固有的 Context，ID 固定为 0。others 由 Route 分配宿主内递增的 ID，nextContextId 初始为 1，移除后不复用。Ref<Context> 使用宿主 Ref 与 ContextId 定位；Context 只存 id，不为身份再保存宿主。不可变更新、选择与 reassign 保留 Context 身份；数组位置和对象引用不作为长期地址。

index 指向当前执行位置，current 保存已经进入的指令实例。current=null 且 index 有效时，下次解释进入对应指令；current=null 且 index 等于指令数时，指令序列已经耗尽。指令序列耗尽、Context 被移除和 Main 满足出口条件分别判断。

### 控制选择与计时

activeId 同时选择跨路点推进和位移目标的 Context。ticking 独立决定每个 Context 当前指令的计时更新：非活动 Context 也可以计时，但不会因此跨越指令；活动 Context 的 ticking=false 时仍可执行不需要计时的到达检查和即时指令。Main 的最终出口检查独立于 activeId。

Fear／Attract／Trace 等控制的来源、目标选择、有效期与优先级属于 Content／Effect。Route 执行它们明确选择的 Context 与 ticking 政策，不保存控制来源的优先级、不建立通用暂停栈。切换运动来源不自动删除 Context，也不自动修改其他 Context 的 ticking。

例如 Trace 接管时可以关闭 Main.ticking，使 Main 的相对 WAIT 保留剩余时长；Fear／Attract 接管位移期间也可以保留基础路线的计时。统一 battle.tick 只提供时间源，不决定每个 Context 是否积累经过时间。禁止自主移动的 Locomotion Rule 本身不改变 Route 计时。

### Checkpoint 与进入

Checkpoint 支持 MOVE、WAIT、TRACE、GOTO、DISAPPEAR、APPEAR：

| 指令 | 保存的数据与行为 |
| --- | --- |
| MOVE | position、offset、randomizeOffset；进入时确定本次偏移样本，抵达或按不可达政策跳过后消费。 |
| WAIT | anchor、tick、timer；ENTER 按剩余 tick 计时，其他 anchor 按各自基准比较。 |
| TRACE | position、reached；保存最后登记的目标格和本次到达事实，持续执行，不因到达自动消费。 |
| GOTO | index；同步跳转并按进入语义重新进入目标指令。 |
| DISAPPEAR | 同步调用 Presence 的完整消失操作。 |
| APPEAR | position、offset；同步执行固定位置的完整出现操作。 |

MOVE 的 randomizeOffset=false 使用固定 offset；为 true 时，各轴 offset 表示随机半宽，每次进入独立采样 [-offset, +offset]。current 保存样本并关闭再次采样，Plan 保留重新进入时使用的原始配置。APPEAR 使用固定落点偏移。

Checkpoint 使用同一个联合类型保存配置与进入后的执行实例：

```typescript
type Checkpoint =
    | {
          readonly type: "MOVE";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
          readonly randomizeOffset: boolean;
      }
    | {
          readonly type: "WAIT";
          readonly anchor: "ENTER" | "BATTLE" | "WAVE" | "FRAGMENT";
          readonly tick: number;
          readonly timer: number | null;
      }
    | {
          readonly type: "TRACE";
          readonly position: TilePosition;
          readonly reached: boolean;
      }
    | { readonly type: "GOTO"; readonly index: number }
    | { readonly type: "DISAPPEAR" }
    | {
          readonly type: "APPEAR";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
      };
```

Plan 的 WAIT.timer 为 null，TRACE.reached 通常为 false；进入 TRACE 时重置 reached=false。current 是当前指令的执行实例，求值和采样只写入 current，不写回 Plan。GOTO 每次重新进入都会重建等待与随机样本。PATROL_MOVE 在 Data 中编译为 MOVE 与显式 GOTO，回边按完整巡逻段确定，不能把每个巡逻点编译为自循环，也不能用有限复制代替循环。

#### WAIT

WAIT 使用 ENTER／BATTLE／WAVE／FRAGMENT 四种 anchor。tick 表示配置时长或相对基准的偏移：

- ENTER：进入时将 timer 初始化为 tick；timer 保存剩余 tick，仅在该 Context.ticking=true 时扣减，降到零即满足。
- BATTLE：比较 battle.tick 与配置 tick。
- WAVE：比较 battle.tick 与 state.waveStartTick + tick。
- FRAGMENT：比较 battle.tick 与 state.fragmentReadyTick + tick。

后三种的 timer 保持 null，直接比较 battle.tick 与配置及 Route State 中的基准；绝对战斗时钟持续前进，恢复检查时已经过期的等待立即满足。ENTER 在重新进入时重新取得完整时长。非活动 Context 即使已满足 WAIT 也保留当前指令，直至成为活动 Context 后消费；skipWait 可以显式跳过当前 ENTER 等待，其他 anchor 仍按各自时间基准判断。

waveStartTick 是实际出生时捕获的主 Wave 进入时刻，fragmentReadyTick 是当时最近进入过的主 Fragment 前延迟结束时刻。两者由 Route initializer 从 Schedule 取得，保存在 Route State，主路线与其他 Context 共享；分支出生也采用当时的主线时间上下文，不采用触发它的 Branch Phase 时刻。后续 Schedule 变化不改写快照，见 [Schedule 时间上下文](schedule.md#route-的主流程时间上下文)。

#### TRACE

Route 只接收并在 current.position 保留最后登记的 TilePosition，不持有或选择 UnitRef。Content／Effect 持有目标 UnitRef，按追踪策略更新目标格；目标死亡时清理该 Ref，不自动清除 Route 中的最后目标格，Content 不另存一份 lastTile。

TRACE 抵达时记录 reached=true，继续保留 current 与 index，并停止为这次目标提供位移；到达不触发后继指令、不删除 Context、不切回 Main。目标更新与显式重启分别表达：显式重启即使仍是同一格，也清除 reached，重新执行本次追踪。

TRACE 的目标格不是 Plan 的最终终点。无最终终点的 Plan 可以长期执行 TRACE，也可以在没有位移目标时保留执行上下文；不能用伪造终点或超长 WAIT 代替这种语义。

### 推进与同步操作

调度器每 Tick 调用一次 Route.advance。一次推进先按各 Context.ticking 更新当前指令的计时，再连续解释活动 Context，最后独立检查 Main 的出口条件。进入时结算与跨指令推进同步完成，不返回待执行信号队列。

固定 Plan 的一次连续解释使用局部 Set<number> 记录已处理的索引。再次遇到同一索引时，在进入前停止本次解释，保留待进入的 index 与 current=null，后续 Tick 再进入。尚未抵达的 MOVE、未满足的 WAIT 和持续 TRACE 也会阻塞解释。visited 不进入 State、不跨 Context 或调用复用；不使用固定转换预算截断长而无环的指令链。

进入 GOTO 时直接改索引并继续；进入 DISAPPEAR／APPEAR 时先发布已越过该指令的进度，再调用对应完整领域操作。副作用返回后，从最新 BattleState 重新读取宿主、Context 与 activeId；宿主仍在场且该 Context 仍取得执行资格时，按最新 Plan、index 与 current 继续解释，不回写旧快照。Context 被修改或 reassign 本身不要求外层停止；宿主已离场、Context 已移除或失去执行资格时停止。visited 只属于本次解释调用，不与嵌套操作共享；Plan 改变时清空本次集合。

查询不隐式进入指令、不重新采样，也不执行 GOTO。每次真实位移只有一份 Locomotion 预算。

### 公开操作

createContext 与 advance 是完整操作；其余写入通过 Change<Unit & Route> 组合发布，查询只读：

```typescript
function createContext(
    battle: BattleState,
    host: Ref<Unit & Route>,
    input: {
        readonly plan: Plan;
        readonly offset: WorldPosition;
        readonly alwaysCheckCurrentPoint: boolean;
        readonly ticking: boolean;
    },
): Result<Ref<Context>>;

function removeContext(id: ContextId, nextActiveId: ContextId): Change<Unit & Route>;
function selectContext(id: ContextId): Change<Unit & Route>;
function reassign(id: ContextId, plan: Plan, index?: number): Change<Unit & Route>;
function skipWait(id: ContextId): Change<Unit & Route>;
function setTicking(id: ContextId, ticking: boolean): Change<Unit & Route>;
function setTraceTarget(id: ContextId, position: TilePosition): Change<Unit & Route>;
function advance(battle: BattleState, host: Ref<Unit & Route>): BattleState;
function getContext(battle: BattleState, ref: Ref<Context>): Context | undefined;
function movementTarget(battle: BattleState, host: Ref<Unit & Route>): MovementTarget | null;
```

- createContext 分配动态 ID、建立执行状态并同步进入首条指令，向调用者返回 Ref<Context>；不隐式取得运动控制权。
- removeContext 只移除其他 Context，Main 不可移除；移除活动 Context 时选择调用者明确指定的现存后继，Route 不推断控制优先级。
- selectContext 选择现存 Context，同时决定跨指令推进与位移目标，不隐式修改 ticking。
- reassign 为原 Context 绑定新 Plan，并从指定 index（默认 0）重建 current 等执行事实，保留身份、offset 和执行政策；不支持任意编辑 Plan 并保留旧 current 的隐式索引映射。
- skipWait 只跳过当前 anchor=ENTER 的 WAIT，后续在活动 Context 的解释流程中进入下一指令；BATTLE／WAVE／FRAGMENT 等待仍按时间基准判断，不改变其他指令或 Context。
- setTraceTarget 登记当前 TRACE 的目标格并清除 reached；同格且尚未到达时保持原值，同格且已到达时也可以显式重启。
- getContext 按 Typed Ref 从最新 BattleState 查找；宿主或 Context 已不存在时返回空。

### 运动目标与 Main 出口

movementTarget 读取 activeId 选择的最新 Context。MOVE 使用本次进入已确定的目标样本，TRACE 使用尚未 reached 的 current.position；指令耗尽后，仅在 plan.endPosition 非空时提供最终终点目标。等待、无目标或已经抵达的 TRACE 返回空，不把空目标当作 Main 出口通知。

查询将 Unit.position 减去 Context.offset，调用 Navigation.nextPoint，再给 nextPoint 和 goal 加回偏移。Locomotion 接收实际世界坐标与该 Plan.motionMode，不解释控制来源或路线偏移。地图内不可达 MOVE 根据 alwaysCheckCurrentPoint 决定跳过或等待；TRACE 的持续控制不由普通 MOVE 的跳过规则终止。

Route 不追加整段射线筛选，也不回退到当前格中心。地图外的位置恢复由 Route 协调，实际位移合法性由 Locomotion 保证。Layer 的空地身份独立于 Plan.motionMode；修改寻路方式不自动改变 Layer。

Route.advance 末尾从最新状态检查 Main：必须存在最终终点、位置满足终点到达条件，并满足 requireAllCheckpoints；为 true 时要求指令序列耗尽，为 false 时允许提早到达终点。满足出口条件时，Route 直接请求 Unit 的完整移除操作；其他 Context 的到达或指令耗尽不触发 Main 出口。

完整移除接续 Unit 生命周期、Lifetime、等待关系清理和相应 Hook。统计、蓝门扣血与胜负规则由各自领域处理，本次 Route 接入不增加这些政策。advance 返回后，运动调度重新读取 Unit，再决定是否继续 Locomotion。

### 初始化

创建者选取 Plan、确定本次 offset，并以同一样本构造出生位置和 Initial：

```typescript
const created = unit.initialize(battle, {
    id,
    definition,
    position: Vec2.add(Tile.center(plan.startPosition), offset),
    initial: { route: { plan, offset } },
});
```

Route initializer 通过 [Capability 初始化通道](capability.md#初始化与装配)读取必需 Initial，建立 Main ID 0、activeId=0、nextContextId=1、index=0、current=null、ticking=true，并捕获 Schedule 时间基准。Plan、offset 或时间快照不重新合成 UnitDefinition，也不接收调用者预装的执行状态。

首条指令在完整 Unit、结构索引与 Lifetime 登记后，由普通 Unit.enter Hook 同步进入，遵守 Hook 登记顺序；unit.add 只登记并执行 enter，不特判 Route。Schedule 在 unit.add 前发布等待关系，使首指令及其同步 Hook 可见完整出生事实。动态 Context 使用同一指令进入逻辑。

已有 Unit 新建 Context 共享其 Route State 的出生时基；新建 Unit 则在实际初始化时从当前 Schedule 取样，不从召唤者继承。技能、Buff 与机制创建者各自组织出生业务，无需强制使用统一的 Schedule Spawn 包装。

### 回归语义

- 出生首指令同步生效，MOVE 的随机样本只在进入时采样，循环重入取得新样本；长无环指令链与即时循环分别正确完成和让出。
- Main 相对 WAIT 在 ticking 关闭期间保留剩余时长，绝对等待按快照基准到期；选择另一个 Context 不偷偷改动计时政策。
- TRACE 到达后保留当前指令，目标死亡保留最后目标格，同格显式重启可以再次移动；控制来源撤销与 Main 出口分别处理。
- 无最终终点时不因指令耗尽移除 Unit；有终点时 Main 出口独立于活动 Context，并通过完整生命周期清理等待关系。
- 同步出现／消失 Hook 重建路线或移除宿主后，外层接续最新状态，不覆盖变更或执行旧后继。

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
