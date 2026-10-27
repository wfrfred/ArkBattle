# RouteDefinition 字段的实际消费与冗余判断

研究日期：2026-10-19。本文审查十个现有顶层字段的实际行为，区分语义、字段归属和可删除的配置入口，不决定最终 API，不修改实现。

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
