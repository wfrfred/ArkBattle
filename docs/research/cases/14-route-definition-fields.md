# RouteDefinition 字段的实际消费与冗余判断

研究日期：2026-10-19。本文审查十个现有顶层字段的实际行为，区分语义、字段归属和可删除的配置入口，不决定最终 API，不修改实现。

2026-11-07 补核见第 6 节：从出生入口追踪路线创建、位置／偏移和时间快照，作为重新审查 Route 初始化职责的依据；不以当前项目的 Definition、State 或创建接口证明其合理性。

创建以后的路线替换、重建、缓存恢复、临时控制与导航更新，另见[案例 31](31-route-operations-and-state.md)；第 6 节的创建调查不代替这些操作的生命周期核对。

N 表示客户端原生分支直接证实；D 表示固定版本数据及引用直接证实；I 表示组合证据后的设计推断；U 表示尚未确认。客户端输入沿用 [Case 12 清单](../evidence/navigation-native-20261018/manifest.json)。本次新增方法及文件校验见 [证据清单](../evidence/route-fields-20261019/manifest.json)。

## 1. 静态配置覆盖

扫描 `Kengxxiao/ArknightsGameData` 固定版本 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` 的 `zh_CN/gamedata/levels/obt` 与 `activities` 全部 JSON。每个文件核对 Git blob SHA-1，以含有 `allowDiagonalMove` 的对象识别路线配置。

扫描 3,997 份文件、147,252 个配置对象，零错误。配置对象包括 routes、extraRoutes 和模板，不等于实际部署数量。排除 `/obt/sandbox/` 和 `/activities/act1sandbox/` 后为 3,664 份文件、137,741 个对象。

| 字段 | 全部配置 | 排除生息演算后 |
| --- | --- | --- |
| allowDiagonalMove | 全部 true | 全部 true |
| visitEveryTileCenter | 全部 false | 全部 false |
| visitEveryNodeCenter | 全部 false | 全部 false |
| visitEveryCheckPoint=true | 7,844 | 6,675 |
| 非零 spawnOffset | 1,430 | 1,410 |
| 非零 spawnRandomRange | 3,741 | 3,400 |

[扫描摘要](../evidence/route-fields-20261019/summary.json)保存范围、字段分布及代表配置。未开启不等于原生分支没有作用，也不能排除特化代码或热更新动态设置；当前没有据此证明两个中心开关存在实际内容消费者。

## 2. 十个字段

| 字段 | 直接消费与外部行为 | 判断 |
| --- | --- | --- |
| pathMotionMode | 原始数据名为 motionMode；选择 WALK／FLY 的通行图与 Field，单位变更该方式会重建相应导航过程。 | 有实质语义。由 Route 还是 Locomotion 持有属于所有权选择。 |
| startPosition | 出生位置；全路线距离查询和可达性检查也读取它。 | 不是死字段。运行推进不必持续依赖静态起点，但迁到 Creation 后，完整路线查询仍须有明确起点来源。 |
| endPosition | 终点 Field、距离查询和独立终点完成条件。 | 有实质语义，不总等价于最后一个普通 MOVE。 |
| spawnOffset | 固定值参与一次采样后的路线实例偏移；影响出生及随后整段移动。 | 字段名容易误导，行为不是仅出生偏移。配置归属可以调整，采样结果不能丢。 |
| spawnRandomRange | 初始化时各轴独立随机采样，结果进入同一持久路线偏移。 | 与固定偏移不冗余；随机范围是静态配置，结果是实例事实。 |
| checkpoints | 移动、等待、跳转及跨领域指令组成的执行程序。 | 程序语义必要；官方指令名称和分类可以归一化。 |
| allowDiagonalMove | 在 SPFA 原始四方向搜索后选择两种平滑算法。 | 有算法差异，但当前扫描无 false 配置。项目排除生息演算，可不保留该可配置开关。 |
| visitEveryTileCenter | 方向查询先访问尚未访问过的当前格中心，约 0.05 容差后记已访问。 | 是真实运动政策，但当前扫描无启用配置；不因原生分支存在就预先保留配置入口。 |
| visitEveryNodeCenter | 沿当前路点／终点的已平滑后继跟踪节点中心，约 0.05 容差后记访问。 | 与前项独立，也不是禁用平滑；实际内容需求未证实。 |
| visitEveryCheckPoint | true 时先处理完指令序列，才允许终点完成；false 时可以尚有未完成路点就因到达终点而结束。 | 有实际配置消费者，是完成资格政策，不能归一化掉其行为。 |

原始 motionMode 还存在数值 0／1 及 E_NUM。Map._InitRoutesAndPassableMaps（70040）只为 0、1 创建两套通行地图；本次未追出 E_NUM 的执行决议，标为 U，不猜测其必然回退到 EnemyData.motion，也不将其视为第三种寻路策略。

## 3. 出生偏移持续作用于整条路线

**N：** Route.GetSpawnOffset（70368）取得 `RandomVector2(spawnRandomRange) + spawnOffset`。RandomVector2（22393）对两个轴分别使用随机数，范围为各自的 `[-range, +range]`。

Enemy.Init（76469）每次初始化采样一次，把起点格中心加采样值传给 Entity.Init，同时把采样值取负后传给 DirectionCursor 构造器（70270）。GetLocatorPosition（70291）和 PredictReached（70273）继续进行坐标转换：

```text
s = spawnOffset + sampledRandomOffset
bodyStart = center(startPosition) + s
cursorOffset = -s
locator = bodyPosition + cursorOffset = bodyPosition - s
bodyTrackingTarget = navigationTarget - cursorOffset = navigationTarget + s
```

[出生偏移](../evidence/route-fields-20261019/70368-Route-SpawnOffset.asm)、[随机取样](../evidence/route-fields-20261019/22393-RandomVector2.asm)、[Enemy 初始化](../evidence/route-fields-20261019/76469-Enemy-Init.asm)、[locator](../evidence/route-fields-20261019/70291-DirectionCursor-Locator.asm)、[目标转换](../evidence/route-fields-20261019/70273-DirectionCursor-Predict.asm)。

因此，仅给初始 Unit.position 加一次偏移，随后直接以身体坐标查询未偏移路线，不能保留这项行为。固定偏移与随机范围可由 Creation 采样，但样本须与具体路线执行进度配对。

**N：** Fear.UpdateFearCursor（76895）与 Attract.UpdateAttractCursor（76905）创建的临时 Cursor 使用零偏移，主路线仍保存原样本。不能把主路线样本无条件应用于所有 Alternative。[Fear](../evidence/route-fields-20261019/76895-Fear-Cursor.asm)、[Attract](../evidence/route-fields-20261019/76905-Attract-Cursor.asm)。

**N：** startPosition 除出生之外还被 Route.GetDistToFinal（70358）作为全路线距离查询起点读取；Route.CheckReachable（70373）默认从它开始检查，存在 APPEAR 时改用最后一个出现位置。这些功能不自动要求它必须保存在运行 Capability 的 Definition 中，但迁移时不能忽略消费者。[总距离](../evidence/route-fields-20261019/70358-Route-TotalDistance.asm)、[可达性](../evidence/route-fields-20261019/70373-Route-Reachable.asm)。

## 4. 两个中心访问开关

**N：** DirectionCursor.GetNextDirection（70277）按 TileCenter、NodeCenter 的优先顺序检查，两个分支发生在普通 Checkpoint／Field 方向消费之前；SPFA 构建和平滑不读取它们。

TileCenter 要求访问每个实际进入且尚未记录访问的格中心；NodeCenter 访问 Field 的后继节点中心，可以跨过中间格。它们不是同一种轨迹，也不能在注册时展开成固定 MOVE 数组：实际格子和节点随当前位置、地图和重寻路改变，访问记录属于单位执行进度。原生证据及调用位置见 [Case 12 移动消费](12-navigation-native-algorithm.md#5-实际移动如何消费)。

**I：** 不同轨迹可能改变阻挡、范围和地块接触，但这不证明某个具体机关实际需要这两个开关。结合全量静态配置未启用的结果，当前可以不为它们设计公开字段；这项判断不能表述成“已经证明客户端全局死代码”。

## 5. 终点完成与逐路点完成

**N：** DirectionCursor.CheckReached（70272）在 visitEveryCheckPoint 为 true 且索引仍位于指令序列内时直接返回 false；其余情况使用当前 locator 调用 Route.CheckReached。该逻辑与普通 MOVE 的不可达跳过政策不同。[完成检查](../evidence/route-movement-20261018/70272.asm)。

Enemy.OnTick（76531）每 Tick 经 Enemy.get_cursor（76397）取得主 Cursor 后独立调用此完成检查；恐惧／吸引关闭主路点推进检查，并不关闭这次终点判断。**I：** 因此替代运动或其他位移把单位送到主终点时，false 政策可能在指令未结束前完成主路线。调用链见 [Case 13](13-route-and-movement-timing.md#5-目标采样与最终完成)。

**D：** `level_tough_14-10.json` 的 `/routes/55` 起点与终点同为 `(row 3, col 0)`，指令为 MOVE `(3,1)` → WAIT 500 秒，且 visitEveryCheckPoint=true。它被 `/waves/0/fragments/2/actions/8` 的 SPAWN（enemy_1555_lrking）直接引用。若只按初始位置已到终点就结束，会改变这份配置的含义。[最小原始配置与引用](../evidence/route-fields-20261019/visit-checkpoints-case.json)。未实际运行该战斗。

**设计影响：** 仅在 Phase.END 检查终点，不能同时表达 true／false 两种行为。Route.advance 需要依据完成政策处理主终点资格，或明确选择不同的项目规则。把终点追加成普通 MOVE 只覆盖严格顺序完成的一种情况。

## 6. 路线创建与初始化（2026-11-07 补核）

本节回答路线如何进入 Enemy，以及位置、路线偏移和时间何时成为实例事实；不扩展到替代路线的完整接管／恢复。新增原件及当前客户端指纹见[创建批次](../evidence/route-creation-20261107/README.md)。以下 N 均指未走 XLua 覆盖的静态原生分支，不是运行游戏的观测。

### 6.1 路线来源与出生参数

**N：** `Map.GenerateRuntimeRoute` 返回普通 `Battle.Route`，不是另一种 RuntimeRoute 类。带 key 的重载在 key 不存在时构造 Route，存在时对原对象执行 `ReconstructRoute`；另外两个重载构造新 Route，分别使用地图默认或显式提供的寻路器。[生成方法及调用节点](../evidence/route-creation-20261107/origins/route-origins-bodies.json)、[Route 类型](../evidence/route-creation-20261107/origins/route-type.json)。

不同出生入口不能仅凭“召唤”或“带 host”归成同一种位置规则：

| 原生入口 | 路线与位置输入 | 创建前显式处理的偏移 |
| --- | --- | --- |
| `SpawnEnemyWithRoute`，包括带 host 的重载 | 直接传入已有 Route；带 host 的重载不读取 host 坐标，成功出生后才设置 hostUid | 不在该入口采样，由公共 Enemy.Init 解释已有路线 |
| `SpawnSummonedEnemyWithRuntimeRoute`，17 参数重载 | 由 sourcePos／targetPos、运动方式及路点构造 RouteData，再生成 Route | 使用 scalar offset 取随机向量，写入 **spawnOffset**；avoidHighland 分支可把候选改为零；该方法未显式写 spawnRandomRange |
| 同名 11 参数 void 重载 | 由明确的 startGridPos／endGridPos 和路点构造 RouteData | 显式把 spawnOffset 设零；未显式写 spawnRandomRange |
| `SpawnEnemyNpc` | 由 targetPos／endPos 构造 RouteData | spawnOffset 设零；randomOffset 分支选择向量或零写入 **spawnRandomRange** |
| tracked RuntimeRoute 协程 | 由捕获的两个 GridPosition 构造 RouteData，随后进入公共出生链 | 显式把 spawnOffset 设零；未在该段写 spawnRandomRange |

[各重载完整原件](../evidence/route-creation-20261107/origins/existing-origin-bodies.json)中，17 参数重载在 `0x180982816–0x180982835` 写 start／end／spawnOffset；void 重载在 `0x180982d0d–0x180982d65` 写对应字段；Npc 的 randomOffset 分支是 `0x18098024b–0x1809802b7`。字段解释由[当前 RouteData 布局](../evidence/route-creation-20261107/origins/route-data-type.json)确认，不能将两种 offset 写入位置混为一谈。这里记录方法的显式写入，不从未写字段推导整个构造器的默认政策。

**N：** 代表 Action 节点 `SummonEnemyWithRuntimeRoute.Execute` 先从选中实体读取 **gridPosition**（`0x1811ad220`），也能以快照实体、Blackboard 格坐标或最近可通行格替代。固定格偏移在召唤调用前应用（`0x1811ad392–0x1811ad3fa`）；host 还能另外选取。因此，这条链证明的是“由内容决定出生源格”，不是“任何召唤都直接复制宿主当前连续坐标”。LevelScript 的同类节点则从配置的起终点格生成路线。上述节点原件同[生成方法批次](../evidence/route-creation-20261107/origins/route-origins-bodies.json)。

**N／范围：** 所查外部入口在构造 Route 后交给 CreateEnemy，其后没有覆写出生坐标的调用。这只是所选调用体的观察，不用于证明所有内部构造或其他调用者的行为。CreateEnemy 的 Route 重载参数是 enemyData、handbookData、snapshot、route、options，没有独立的出生坐标参数；这些路径的位置求值见下一节。[Controller 创建原件](../evidence/route-creation-20261107/initialization/create-enemy-bodies.json)。tracked 的两个捕获格字段已追到 RouteData，但 wrapper 到协程字段的逐项赋值未在本批补提，不据参数名扩大证明范围。

### 6.2 公共 Enemy 初始化：位置与路线偏移配对

**N：** Controller.CreateEnemy 取得 Enemy 后虚调用 `Enemy.Spawn`（`0x18064eb52`，slot 232）；Spawn 保存 Options 后，再虚调用 `Enemy.Init`（`0x180ac39fd`，slot 237）。Snapshot 在这两层按值复制传递，没有在这条普通转交链中改写 Wave／Fragment 基准。见 [Controller](../evidence/route-creation-20261107/initialization/create-enemy-bodies.json)、[Spawn](../evidence/route-creation-20261107/initialization/enemy-spawn-body.json)及 [Enemy 方法布局](../evidence/route-creation-20261107/initialization/enemy-type.json)。

**N：** 当前 `Enemy.Init` 仍只在本次初始化中调用一次 `Route.GetSpawnOffset`（`0x180abcb71`）。它取得路线起点（`0x180abcbeb`），相加得到身体初始坐标，交给 Entity.Init；随后把样本取负传入 DirectionCursor（`0x180abcd9e`）。本版本的完整调用见[初始化原件](../evidence/route-creation-20261107/initialization/core-init-bodies.json)，偏移公式和后续 locator／身体目标坐标转换沿用第 3 节的独立证据。

因此，运行时入口预先写入 spawnOffset 的向量，与 Enemy.Init 消费路线的过程是两层。不能把所有随机性都挪成同一个“初始化时随机出生坐标”，也不能只保留位置而丢掉与 Cursor 配对的偏移。

### 6.3 时间快照在实际出生链中绑定

**N：** `Scheduler.TakeSnapshot` 的普通分支在 `0x180983026／0x180983032` 读取当前 Scheduler 的 waveStartTime／fragmentStartTime，并将 actionStartTime 置零。[方法](../evidence/route-creation-20261107/timing/take-snapshot.json)、[Snapshot 布局](../evidence/route-creation-20261107/timing/snapshot-type.json)。

这里的原生 Wave 基准取进入 Wave 时的 userFixedPlayTime（`0x18098c391／0x18098c396`）；Fragment 基准则已经包含前延迟：当前 userFixedPlayTime 加 fragment.preDelay，再写入 Scheduler（`0x18098be72–0x18098bed6`）。原件为 [Wave](../evidence/scheduler-native-20261107/branch-bodies.json)与 [Fragment](../evidence/scheduler-native-20261107/random-bodies.json)。不能把这两个原生字段都直译为“不含前延迟的进入时刻”。

普通 `_DoSpawn`、`_DoSpawnEnemyInternal(Route)` 和 Npc 都在实际 CreateEnemy 前取这个快照。对应取样／创建调用分别为 `0x18098eef4 → 0x18098ef74`、`0x1809863bd → 0x18098642e`、`0x1809805bb → 0x18098068c`。tracked RuntimeRoute 在延迟恢复后进入公共内部出生方法，而不是在发出延迟请求时就把路线时钟绑定完毕。出生入口复用[同指纹 Scheduler 原件](../evidence/scheduler-general-20261107/native-paths.json)、[普通出生](../evidence/scheduler-native-20261107/spawn-bodies.json)与[tracked 协程](../evidence/scheduler-general-20261107/lifecycle/tracked-runtime-bodies.json)。

**N：** 快照随后按值传入 Enemy.Init → DirectionCursor → BasicCursor。BasicCursor 在 `0x1808cdcad／0x1808cdcb1` 将 24 字节存入自身 `+0x48／+0x58`，早于运行路点创建与首次进入。[构造原件](../evidence/route-creation-20261107/initialization/basic-cursor-bodies.json)、[字段布局](../evidence/route-creation-20261107/initialization/basic-cursor-type.json)。Wave／Fragment 等待怎样消费已保存的基准，见[案例 13](13-route-and-movement-timing.md#3-等待如何计时)。

**I：** 对这些出生入口，路线可以更早取得或生成，但 Wave／Fragment 基准属于实际出生时绑定的执行上下文；不能用“取得 Route”“请求召唤”或“触发 Branch”的时刻替代。原生基准的具体写法仍沿用 Scheduler 调查，不将其倒推为项目必须保留多种原生时钟。

### 6.4 初始执行与临时 Cursor 不是同一初始化政策

**N：** BasicCursor 构造会建立运行 Checkpoint，并调用 Reset。DirectionCursor.Reset 调用 BasicCursor.Reset（`0x1808d31f1`）；后者把索引置为 -1，再尾转 `_MoveNext`（`0x1808ccf4c`）。`_MoveNext` 对当前选定路点调用 OnBegin（`0x1808cd9d0`，Checkpoint slot 10）。[Reset](../evidence/route-creation-20261107/initialization/cursor-reset-bodies.json)、[构造及推进](../evidence/route-creation-20261107/initialization/basic-cursor-bodies.json)、[方法签名与 slot](../evidence/route-creation-20261107/initialization/cursor-methods.json)。所以初始路点可以在 Cursor 构造期间进入，不必等到第一个运动 Tick；后续随机 MOVE 目标仍按进入路点采样，见案例 13。

**N：** 当前 Fear.UpdateFearCursor 在 `0x180adf517` 读取宿主所提供 Cursor 的 snapshot，再于 `0x180adf585` 传给新 DirectionCursor；Attract 对应 `0x180ad5024／0x180ad509b`。两者同时传入零路线偏移，不重新调用 Scheduler.TakeSnapshot。[临时 Cursor 原件](../evidence/route-creation-20261107/timing/temporary-cursor-clocks.json)。这只证明这两个创建路径：不能规定一切动态／替代 Route 都重新采样主偏移，或一律重新绑定当前 Scheduler 时钟。

首 DISAPPEAR／APPEAR 的位置、标志、同步回调与两层登记的进一步区别，见[案例 13 第 9 节](13-route-and-movement-timing.md#9-checkpoint-参数与首路点时序2026-11-07-补核)；OnBegin 被调用并不保证已经成功进入相应状态机状态。

### 6.5 本轮边界

已能作为后续设计依据的事实是：路线创建不只来自 Schedule；出生源格和 host 归属独立；每个执行实例需要位置／偏移配对；出生时间快照与临时 Cursor 的继承有不同来源；初始路点有明确进入时点。

这些事实不直接决定由哪个项目模块采样偏移、谁设置 Unit 初始位置，或是否在初始化还是登记后执行路点程序。下一步应结合路点副作用和完整创建／Enter 契约决定，而不是先修改当前 Route 类型再为其补理由。

尚未在本批闭合：所有特殊召唤节点的实际 Prefab 启用情况、临时 Route 对原进度／等待／目标的完整保存与恢复。临时 Cursor 的两条短链不能代替第 4 项生命周期审查。
