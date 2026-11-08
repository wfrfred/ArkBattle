# 莱塔尼亚盟约召唤物的阻挡与移动

研究日期：2026-11-09。问题限定于卫戍协议·规程的“一个小节”和“一个乐部”：怎样出生、选择移动目标，以及阻挡与普通移动如何交互。本案调查机制，不修改 Core 类型或接口。

## 来源与范围

- **P：** [PRTS 盟约记录](https://prts.wiki/w/卫戍协议·规程/PRTS盟约记录)说明三人莱塔尼亚盟约在敌人被击倒时召唤“一个小节”，六人效果允许升级为“一个乐部”，并增加召唤来源与上限。该页面不提供本案所需的完整移动、阻挡流程。
- **D：** 当前安装的 PersistentData 热更新资源；manifest 版本 `26-11-06-12-42-25-70182449`／V079。两单位在更新 `enm_pfb_36.ab` 的实际对象与 MonoScript、UnitMode、Selector 引用均已配对，召唤模板从当前更新 Holder 重新提取，不依赖失效的旧缓存脚本。
- **N：** 当前 Windows x64 客户端普通 Enemy、BlockManager、Trace、Selector 与状态机实现。精确指纹、对象身份、方法与复跑入口见[本批证据](../evidence/leithanien-summons-20261109/README.md)。部分既有原生正文按相同 DLL／metadata 指纹复用，复用与本轮提取分别记录。

这是配置绑定与静态可执行链，没有运行游戏、核验执行中的 XLua 或观察实战轨迹。没有取得当前新 EnemyData 的最终属性值，见下文缺口。

## 1. 对象与出生

| 名称 | 配置 key | 实际控制器 | 攻击配置 |
| --- | --- | --- | --- |
| 一个小节 | `enemy_9025_aclts` | `Torappu.Battle.Enemy` | MeleeAttack，近战 |
| 一个乐部 | `enemy_9026_acltm` | `Torappu.Battle.Enemy` | RangedAttack，远程 |

**D／N：** `act3autochess_bond_eff_lethania[summoner]` 的分支直接调用 SummonEnemyWithRuntimeRoute。两项使用 WALK、零出生偏移、最近可通行地块、无普通终点及 999 秒 WAIT，并安装 summoned 计数 Buff。这里的长 WAIT 是出生主路线配置，不能据此推断召唤物在原地等待 999 秒后才行动；实际运动可由 Trace 接管。

两 Prefab 的 `_sideTypeIndex=0`，当前 metadata 将其解释为 `SideTypeIndex.ALLY`。这与 SideType 的数值不是同一枚举；不能把 Enemy 控制器误读为敌方阵营，也不能直接把索引数值当 SideType 值。

名称与 key 的配对来自社区说明和普通／升级召唤分支的对应，不冒称已经取得新 EnemyData 的中文 name 字段。

## 2. 阻挡路径

**D／N：** 两个 Prefab 的 `_specificBlockMask=2`，当前 `Enemy.get_canBlockEnemies` 对非零掩码返回 true，`get_blockSideMask` 返回该掩码；当前 SideType.ENEMY 的值为 2。因此两者启用的是普通 BlockManager 的敌方目标搜索与关系处理路径，不只是拥有一个未被消费的阻挡属性。

出生使用 WALK，Prefab 未忽略阻挡层匹配。普通非 FLY 阻挡基础半径约为 0.7071；本轮实读半径平方常量为 0.4999903738498688，默认半径倍率为 1。新的关系仍须通过目标资格、距离和容量检查，不能由阵营标签单独决定。

**U：** 最终阻挡容量未取得。Prefab 的 `_blockVolume=1` 是自身作为被挡候选时的体积，不是阻挡容量；不能据此说“一个小节挡一”或推断“一个乐部”的阻挡数。CheckBlockable 也没有因为 source 本身可阻挡就一概拒绝其被挡资格，但本轮未证明两者实际同时建立入向与出向关系。

## 3. 如何移动和停下

**D／N：** 两个 UnitMode 都登记并启用 EnemyTraceTargetByPriorityAbility 和 MoveController。实际 Trace Selector 使用全场范围、敌方阵营、WALK_ONLY，最多选择一个目标；后置筛选为 HATRED_DES。故它们按合资格地面敌人的仇恨顺序选择追踪目标，不是简单选择最近敌人。

Trace 更新目标所在格的运行路线，普通移动读取当前 Trace Cursor，实际位移仍走 MoveController。随机追踪偏移为零。Prefab 的 `dontMarkReachedByInAttackRange=true` 表示不会仅因进入攻击范围就提前标记追踪完成，不能将其解释成无视攻击或阻挡状态继续移动。

普通 MoveState 在执行移动前依次处理：

```text
检查自身的入向 blocker
    ↓
检查自己阻挡的可交战目标
    ↓
若存在，转 COMBAT，不执行普通移动
    ↓ 否则
搜索普通攻击目标
    ↓
若存在，转 ATTACK，不执行普通移动
    ↓ 否则
通过当前运动 Cursor 移动
```

BlockManager 的作战目标查询按阻挡列表选择首个 alive 且非 invincible 的目标。CombatWrapper 优先取自身 blocker，没有时取自己的阻挡目标；它与全场 Trace 选择是不同查询，因此实际交战对象可以不是原追踪目标。Attack／Combat 在相应攻击与目标条件满足后返回 MOVE，重新进入移动流程。

**结论边界：** 这条普通状态机支持“寻敌接近，接敌后停下作战”的行为，不是普通自主移动始终拖着被挡目标一起走。这里没有把特殊强制位移、无敌目标或全部派生覆盖也判成相同停走政策。

### 3.1 追踪到达、目标结束与继续控制

2026-11-09 定向补核，复用同指纹的 [Trace Ability 原件](../evidence/leithanien-summons-20261109/movement/trace-native.json)、[Cursor 原件](../evidence/route-operations-20261107/cursor/state-bodies.json)和[普通移动消费者](../evidence/route-operations-20261107/temporary/advance-selection-20261108/move-bodies.json)，没有新增客户端提取或实机观测。

**N：到达查询与到达标记不同。** TracePositionCursor.PredictReached（71444）使用路线终点格坐标加本次 reachedOffset 与 locator 比较；本次运动距离足够时写入到达标记，返回零方向和当前 locator，不补走到终点。GetNextDirection 同样基于导航节点和 reachedOffset，不直接读取被追踪实体的连续坐标。CheckReached（71446／71447）查询 Route.CheckReached 或既有标记，本身不写标记；其中路线查询不叠加 reachedOffset。两召唤物的追踪随机偏移为零，不能据此抹平通用方法的区别。

**N／D：到达后的目标与地块分别处理。** Priority.OnTick（95579）在 Cursor 已标记到达，或追踪地块存在但不可达时，按以下独立配置执行清理，然后继续后续搜索流程：

| 配置语义 | 本例配置 | 消费结果 |
| --- | --- | --- |
| 到达后移除单位目标 | true | 只将 traceTarget 置空 |
| 到达后移除追踪地块 | false | 本例保留 traceTile，不因到达直接撤销全部追踪控制 |
| 不因进入攻击范围而标记到达 | true | 跳过射程内主动 MarkReached 的捷径；运动预测仍可标记到达 |
| 本轮 Selector 无匹配项时移除旧目标 | false | 可保留仍通过存活等验证的旧目标；出现不同的新首选仍可替换 |

进入攻击范围后不标记追踪到达，与状态机可以停止移动并攻击并不矛盾，见上节。

**N：到达不自动恢复 Main。** Enemy.get_usingTraceCursor（77714）在存在启用的 Trace Ability 时采用 Ability 的选择结果；BaseTraceTargetAbility.get_usingTraceCursor（95246）根据有效目标或仍存在的追踪地块判断，不直接读取 Cursor 的到达标记。只有没有启用 Ability 的备用路径才采用 alwaysUsing 或尚未标记的判断。因此，不能把“MarkReached”直接翻译成销毁追踪 Cursor、结束 Context 或切回 Main。

**N：目标结束不等于立即清掉全部追踪。** Priority._OnUnitFinish（95589）比较离场对象与当前目标，相同时调用 `_RegisterTraceTarget(null)`；null 分支只清单位目标，不清地块、不销毁 Cursor、不立即重新索敌。单纯 alive=false 也使目标资格失败，但不自动移除保留的地块。后续 Priority.OnTick 按搜索计时器和 Selector 处理重选或默认地块，不能断言同 Tick 必然完成重选。

原生没有把到达过的单位永久排除候选，后续可以再次选中同一单位。RegisterTraceTile 对同地块／同运动方式且已标记的 Cursor 可以重置到达偏移，继续本轮追踪。这里保存的是单位目标、追踪地块和到达标记三个不同事实。

**U：** 当前目标验证还有针对 Unit.shouldRenderFlag 的条件，但本轮未将其与具体 disappear／隐藏入口完整配对；不把空间消失、alive=false 和物理离场合并成同一个已证条件。本节不据这些实现字段直接确定 ArkBattle 的 TRACE 指令形状或 Context 退出协议。

## 4. 没有追踪目标时

**D／N：** 默认地块 Selector 使用 GridPositionRange，只配置相对 `(0,0)`；调用时传入自身 mapPosition。原生先把该位置转格坐标，再加配置偏移，因此选择的是自身当前格，而不是地图固定原点或全场随机地块。有合法候选时注册该格作为追踪地块，通常表现为停留或靠向当前格中心；没有合法地块时不新增注册。

这与没有普通蓝门终点的出生路线相配合，不能把它描述成没有敌人后自行向蓝门行军。

## 5. 证据缺口与项目关联

- 当前可取得的公共 EnemyDB 镜像早于新内容，两 key 均未命中；本地当前敌人表缓存仍加密。因此最终 blockCnt、moveSpeed 与关卡覆盖值未确认，不填猜测数值。[数据范围与指纹](../evidence/leithanien-summons-20261109/data/README.md)
- 阻挡数值、关系实际取得与特殊互动未做实机观测；启用的配置与执行路径不能替代这类观测。
- 这是已找到的 Enemy 类我方单位的自主移动／阻挡通路；[案例 23](23-blocker-and-blockable-roles.md)的旧版全零掩码扫描不覆盖这些热更新对象。它不单独证明双重关系实际成立，也不直接确定项目是否需要某个通用维护接口。
- 出生主路线、追踪控制、普通攻击与阻挡目标各有职责。本案不据客户端类名或方法数量增加 ArkBattle 的 Context、Rule 或操作接口。
