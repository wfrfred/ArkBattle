# Navigation 设计

Navigation 提供确定的导航建议，Route 解释路线，Locomotion 执行自主移动；三者不共享执行状态。公共入口见 [Navigation](../../src/core/battlefield/navigation/state.ts)、[Route](../../src/core/unit/capability/route/index.ts)与 [Locomotion](../../src/core/unit/capability/locomotion/index.ts)。

## 职责与状态归属

Battlefield 将当前地块投影为 WALK／FLY 基础 Map，并持有 Navigation State。State 只保存基础图与 Overlay；有效图和 Field 是可重建派生值。Route Context 保存程序进度，Locomotion 保存历史速度，位置只归 Unit.position。

Navigation 接收精确世界目标；Field 按目标所在格构建，末段仍使用精确目标。缓存可以内部可变，但不进入 BattleState，也不能改变领域结果。

### Navigation 的关键语义

通行、WALK／FLY 代价与有向出口共同决定结果。Overlay 只增加限制；撤销一项仍保留其他限制。查询使用传入版本，不污染旧状态；不可达返回 null，抵达和实际位移由消费方判断。

## State 与公共操作

Navigation 不依赖 BattleState 或战场地块类型。具体类型和签名以源码为准，接口只围绕建图、覆盖登记及导航查询。

### 创建

创建接收同一战场投影出的 WALK／FLY 图，初始 Overlay 为空；后续改变使用新 State。尺寸、完整数据及基本代价约束在上游构造边界建立。

### Overlay 登记

Overlay 在指定运动方式的集合内按 ID 登记，替换保序，同对象重复登记没有刷新语义。操作入口验证身份与代价；FLY 代价只能省略或为一。Overlay 不保存 mode 或生命周期，业务所有者决定登记与撤销。

### nextPoint

当前位置或目标越界、目标不可通、当前位置不可达时返回 null。若已位于目标格或后继是目标格，返回精确目标；否则返回后继格中心。

查询直接消费 Field 后继，不附加整段射线筛选，也不把 null 当到达。建议点不保证从偏离格心的实际位置可直线到达，局部避障归 Locomotion。

### distance

估计路程沿导航后继累加几何段长，并将身体相对格心的偏移投影到前进方向修正；同格使用至精确目标的距离。越界或不可达返回 null。

Field 的 distance 是搜索代价，不是实际路程；高代价格权重不能当作行走长度。

### Route／Locomotion 的交互约束

Route 解析当前指令目标与偏移，调用 Navigation 获得 nextPoint／goal；Locomotion 消费实际世界坐标和当前运动方式。不可达 MOVE 由 Context 政策决定等待或跳过；地图外恢复由 Route 协调，不扩张 Navigation 的结果协议。

每 Tick 路线可连续消费即时指令，实际运动只有一份预算。出生调用者为位置和 Route Initial 使用同一偏移样本；主路线和临时路线各自持有对应样本。

## Route 定义与进度

Route 是统一的路线解释器。Main 与其他 Context 使用相同 Plan 和指令；控制来源的选择、优先级和有效期归 Content／Effect。

### 类型与身份

Definition 保存初始执行政策 alwaysCheckCurrentPoint；Plan 保存运动方式、出生起点、可空最终终点、指令序列和 requireAllCheckpoints。Plan 不属于共享 UnitDefinition；创建时必需 Initial 提供本次 Plan 与 offset。

Context 保存 Plan、offset、index、已进入的 current、有效的不可达政策和 ticking。Main 固定 ID 0，其他 Context 使用宿主内递增 ID，移除后不复用；Ref 由宿主和 Context ID 定位，不使用数组位置或不断替换的对象引用作长期身份。

Route State 组织 Main、其他 Context、activeId 与出生时的 Wave／Fragment 时间快照。index 是执行位置，current 是已经进入的指令实例；current 为空且索引耗尽表示序列完成，不等于 Context 移除或 Main 可以退出。

### 控制选择与计时

activeId 选择跨指令推进与位移目标；ticking 独立决定各 Context 的当前指令是否计时。非活动 Context 可以计时但不消费指令；活动 Context 即使不计时，仍能执行无需计时的到达检查和即时指令。Main 出口检查独立于 activeId。

切换 Context 不自动改 ticking 或删除其他执行。Fear／Attract／Trace 的控制政策由内容明确提交，Route 不建立优先级系统或通用暂停栈；Locomotion 禁止移动也不自动暂停路线计时。

### Checkpoint 与进入

| 指令 | 行为 |
| --- | --- |
| MOVE | 进入时确定目标偏移，到达或按不可达政策跳过后消费。 |
| WAIT | 按进入剩余时间或指定绝对基准等待。 |
| TRACE | 保存最后目标格与 reached，持续执行，到达不自动消费。 |
| GOTO | 跳转并按进入语义重建目标指令。 |
| DISAPPEAR／APPEAR | 同步执行消失或固定位置出现。 |

Plan 与 current 复用 Checkpoint 联合，求值只改 current：随机 MOVE 每次进入按各轴半宽独立采样，current 保留样本，Plan 保留原配置；固定 MOVE／APPEAR 使用固定偏移。GOTO 重新进入会重建 WAIT 和随机样本。原生巡逻段在 Data 编译为显式 MOVE／GOTO，不复制有限路线或把每点编译成自循环。

#### WAIT

ENTER 进入时建立剩余 timer，仅 ticking 时扣减；重新进入取得完整时长。BATTLE 比较全局 Tick，WAVE 比较出生快照 waveStartTick，FRAGMENT 比较 fragmentReadyTick；三者 timer 为空，按各自基准加配置偏移判断。恢复检查时已经过期便满足，不积累独立计时。

非活动 Context 即使等待已满足也保留指令，成为活动执行后才消费。skipWait 仅显式跳过当前 ENTER，不跳过其他基准。

时间快照由 Route initializer 在实际出生时向 [Schedule](schedule.md#route-的主流程时间上下文) 取得：Wave 进入时刻与最近主 Fragment 前延迟结束时刻。Branch 出生也使用当时主线，不使用 Phase 时刻；后续调度变化不改快照，所有 Context 共享它。

#### TRACE

Content 持有目标 Unit Ref 并更新目标格；Route 只保存最后登记的位置，不索敌、持有目标 Ref 或管理其结束。目标死亡不自动清除最后目标格。

到达记录 reached，保留指令与索引并停止为本次目标提供位移；不自动结束 Context、进入后继或恢复 Main。目标更新清除 reached；同格尚未到达可保持原值，同格已到达可显式重启。持续 TRACE 可以使用没有最终终点的 Plan，不伪造终点或超长 WAIT。

### 推进与同步操作

advance 先更新各 Context 的计时，再连续解释活动 Context，最后检查 Main 出口。MOVE 未到、WAIT 未满足或持续 TRACE 阻塞解释。

一次连续解释以局部已访问索引集合保证终止；再遇索引时在进入前让出，保留待进入位置，下一 Tick 再进入。长而无环的序列不受固定次数截断；集合不写 State、不跨调用共享，Plan 改变时重置。

APPEAR／DISAPPEAR 先提交已消费的指令进度，再执行跨领域操作。返回后重读最新宿主、Context 与 activeId；宿主离场、Context 移除或失去资格便停止，重建路线则按最新进度继续，不恢复旧快照。查询不隐式进入、跳转或采样。

### 公开操作

createContext 建立独立身份并同步进入首条指令，不自动选择控制权。removeContext 不能移除 Main；移除活动 Context 时由调用者明确给出现存后继。selectContext 选择执行，不修改计时政策。

reassign 保留身份、offset 和执行政策，绑定新 Plan 并从指定索引重建当前执行；不提供编辑 Plan 后保留旧 current 的隐式索引映射。skipWait、setTicking 与 setTraceTarget 各修改自己的事实。除创建和推进完整业务外，写入通过 Route Change 组合发布。

### 运动目标与 Main 出口

movementTarget 使用活动 Context 的当前 MOVE 样本或未 reached 的 TRACE；指令耗尽后可追踪最终终点。等待或无目标返回空，空目标不表示 Main 完成。

导航先从身体位置减去 Context.offset，得到建议点后加回偏移。alwaysCheckCurrentPoint 仅决定普通 MOVE 不可达时是否仍要求实际到达，不决定 Main 出口、时间或控制优先级；Layer 独立于运动方式。

remainingDistance 显式指定 Context，不把临时控制当作普通路线优先级。它累计当前与后续 MOVE／终点的导航几何路程，WAIT 不加距离，APPEAR 只改变后续起点而不累加传送，未来随机目标按格心估计且不消费 RNG。

当前 TRACE 查询最后目标格的距离；没有可确定有限出口的无终点路线、循环或未来持续 TRACE 返回 undefined。有限路线的当前段越界或不可达时只给该段直线回退，不继续叠加后续段，也不用回退掩盖无有限出口。

Main 必须有最终终点、实际到达，且满足 requireAllCheckpoints；要求全部指令时必须耗尽，否则允许提前退出。其他 Context 到达不产生 Main 退出。Route 在 advance 末尾记录 ROUTE_COMPLETED，按 SCRIPT 请求完整 Unit 离场，不负责统计、扣血或胜负；调度随后重读 Unit 决定是否移动。

### 初始化

创建者选择 Plan、采样 offset，以同一样本构造出生位置并提供 Initial。Route 只建立 Main、执行政策和 Schedule 时基，不重新合成 UnitDefinition，也不接受预装执行状态。

首指令由登记后的普通 Unit.enter 同步进入；Schedule 在 Unit.add 前发布等待关系。动态 Context 复用进入逻辑；已有 Unit 的新 Context 共享原出生时基，新 Unit 从当前 Schedule 独立取样，不从召唤者继承。

### 回归语义

首指令、重新采样、WAIT 基准与 ticking、即时循环、持续 TRACE、Main 独立出口和同步重入由[语义验收](verification.md)集中保障，Route 不重复 Locomotion 或 Hook 的公共矩阵。

## Locomotion

Locomotion 保存历史 velocity、speed 的 [Attribute](attribute.md) State 与移动限制。目标由本次参数提供，真实位置归 Unit。速度及范围使用格／Tick，普通内容将0.1格／秒转换为默认下限；半身宽独立于 Hitbox。Data 将 steeringFactor 除以 Tick 率、maxSteeringForce 除以 Tick 率平方，内容绑定运动配置。

### 关键语义

本次速度为 `当前有效speed × 本次倍率`；贡献和范围通过 Locomotion 的 Change 修改，限制与速度独立。暂停、零速或无目标不清历史速度。取得移动资格后，接近最终 goal 且预算足够时直接吸附，保留 velocity；中间建议点不吸附。

普通积分以历史速度、目标速度误差与八邻域局部避障形成合力，先限力再积分限速。WALK 将硬障碍和 cost≥1000 的邻格用于避障，FLY 只看硬障碍；半身宽参与横向几何，局部力去除沿目标方向的分量，并按历史速度比例缩放。当前格不可通时选择相邻可通格恢复方向。

仅在位移跨格且目的格不可通时反射整次位移，不做整段扫掠或反射后二次检查；高代价不等于不可通，反射不改积分所得 velocity。运动结束后可通过 [Facing](capability.md#facing)接续转向。

项目每次积分重算局部避障。Presence 通过限制禁自主移动，Blocking 在 Movement 入口通过当前关系限制它。位置计划、Route 等待与强制空间操作各自独立。

## 强制位移

[Shifting](../../src/core/unit/capability/shifting/index.ts) 提供推击、牵引和失衡。`Shifter` 持有施力方 `baseForceLevel`，`Shiftable` 依赖 `Locomotion`，持有受力限制、物理体、`massLevel` 和失衡段。力度与重量各为可贡献、可覆写范围的 [Attribute](attribute.md)，读取有效等级时舍入到最近整数，恰在中点时取偶数。省略重量或物理体时，使用重量等级 0、以自主移动半身宽为半径的圆、质量和摩擦倍率 1。

### 施力入口

`push` 读取施力方基础力度、目标重量与本次力度。推表与拉表分别使用 `clamp(3 + 本次力度 + 基础力度 − 重量, 0, 表长 − 1)`。推击以方向、推表值、战斗 `pushMultiplier` 和 0.02 换算一次冲量，默认倍率为 0.5，关卡可从 `options.moveMultiplier` 提供倍率。`unbalance.applyImpulse` 也可直接接收以质量单位乘格／秒表示的冲量，换算后叠加到以格／Tick 表示的外力速度。

一次失衡以宿主和递增段 ID 定位，重复推击与新牵引可叠加在当前段。推击和开始牵引通过存活、空间存在和受力限制后刷新三 Tick 保护。首次进入先发布失衡和本次受力，再释放阻挡关系。已有失衡暂停自主积分和接敌，Route 继续推进。新受力被免疫拒绝时返回 `null`，已有段在下一次失衡推进时结束。

### 牵引的身份、近停和结束

`pull.create` 接收施力方、受力方、来源 Scope、本次力度和拉点。拉点可为固定坐标或实时读取位置的弹道。创建时采样有效力度、重量、拉表值与初始距离。每步按目标和当前拉点计算方向，初始距离大于零时以 `min(1, 当前距离 / 初始距离)^4` 衰减。施力方不存在、来源 Scope 或弹道拉点失效、受力资格拒绝、拉表值为零，以及创建时已符合 `endOnReach` 的近停条件，均返回 `null`。

每次创建分配独立 `Ref<Pull>`。同一来源 Scope 可同时拥有多条牵引，各自可结束。`pull.lifetime` 以牵引引用提供依赖 Scope，来源 Scope、所属失衡段和弹道拉点结束时均清理对应实例。`pull.end` 结束一条牵引并保留已有速度，其他牵引继续推进。旧引用只定位原实例。

满足调用方提供的任一近停谓词即进入近停，可用 `pull.withinRadius` 表达距离判定。有效牵引在近停范围内本步施力为零，保留实例可在离开近停范围后继续施力。默认自动清速策略 `ONCE` 在首次成功清速后记住结果，`WHILE_NEAR` 可在以后满足近停条件时再次清速。显式 `pull.brake` 可在近停范围外调用。两种入口均要求请求对应本段唯一有效牵引。同一 Scope 的两个实例也各计一条。`endOnReach` 以 `ARRIVED` 结束到达的牵引，与清速是否成功独立。

### 单步结算

失衡推进检查受力资格，应用摩擦、牵引和单步力，再积分一次。物理体扫掠地块碰撞盒，截去朝障碍的速度分量并保留可行的切向分量。先发布实际位置，再派发 `unbalance.forcedMoved`，载荷包括原段 Ref、实际起止位置及接触格和法线。回调可按原段引用调整速度或追加下一步的力。自动清速与到达结束在回调之后读取最新已提交的位置。

失衡只在推进阶段检查自然结束。速度不高于停止阈值、保护到期、已无有效牵引和待施单步力时结束。段的 Lifetime 先发布 `ENDING`、使本段 Scope 失效，再结束依赖。清理回调内可开始新段，仍按旧引用完成清理。来源或拉点结束会撤掉牵引，剩余外力速度留给下一次失衡推进。

Movement 推进失衡单位，包括无 Route 的单位。每五个 Tick 以两次实际位置的距离更新 `totalMoveDistance`。随后由 Mechanism 观察落点，由 Blocking 结算阻挡。位置相关 Effect 可读取累计距离，持有相应牵引或失衡段的 Scope，并结算自身伤害。

扫掠使用项目的确定性胶囊／圆体与静态地块碰撞盒模型。原生接触轨迹的实测和具体内容的接入范围见 [Tactical 语义](tactical-semantics.md)。

## Map

Map 保存尺寸、格子通行、正代价和有向出口。FLY 基础代价为一；具体数据由战场投影建立。相等比较检查完整内容，Hash 只能辅助，不能代替判等。

## Overlay

Overlay 保存确定格子与通行／出口禁止及可选代价。叠加为通行取 AND、出口取 AND、代价取 max，只增加限制；合并交换且幂等，不能解除基础图或其他来源的限制。

## apply

apply 由基础图与当前覆盖重算有效图，忽略越界覆盖格；撤销覆盖不对旧有效图做逆操作。对象复用是内部优化，不是路径有效性的前提。

## hash

Hash 由地图内容确定，具体数值不属于玩法结果；相同 Hash 仍需内容判等。

## 内部缓存

有效图和目标导向 Field 可复用，同目标格的不同精确目标可共用 Field，末段仍采用各自精确坐标。命中、淘汰与重建不能引入历史相关结果。

## 内部 Field 类型与构建 API

Field 是内部目标导向结构：不可达节点为空，目标节点代价零且无后继，其他可达节点具有正搜索代价及平滑后继。越界或不可通目标产生全不可达结果，不抛目标越界异常。

构建先四方向 SPFA，再按行优先顺序在同一工作数组原地平滑，读取已经更新的后继。搜索代价在平滑后不重算，不等于连续路程；高代价格不参与平滑捷径。有向出口始终按实际行进方向检查，不能因射线端点排序改变方向。

## Field 与移动消费的研究依据

[导航算法调查](../research/cases/12-navigation-native-algorithm.md)提供搜索、平滑和后继依据；[路线与移动时序](../research/cases/13-route-and-movement-timing.md)、[路线字段](../research/cases/14-route-definition-fields.md)和[路线修改操作](../research/cases/31-route-operations-and-state.md)提供指令、等待、初始化和状态保留依据。项目不支持生息演算，具体内容缺口不以导航缓存代替。
