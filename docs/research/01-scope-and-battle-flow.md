# 战斗时间、推进与关卡样本

初始核查：2026-10-07；后续批次分别注明来源。本文保留时间、对象推进与关卡取样的原生依据。调度字段结论集中于 [Case 30](cases/30-scheduler-action-data-fields.md)，项目推进契约见[总体架构](../architecture/ARCHITECTURE.md)。

## 1. 范围与证据强度

本文以本仓库选择的 `act2autochess`（卫戍协议：盟约下半）作为重点调查样本。ArkBattle 是通用明日方舟战斗模拟器；本篇样本与当前实现优先级不限定 Core 的通用战斗语义。
生息演算、保全派驻等特殊模式及船运寻路暂不考虑；这不排除普通关卡的通用战斗机制。
客户端存在 `LhshipSPFA` 等类，不能据此把对应寻路模式加入卫戍协议。

证据分三类：

| 标记 | 可以证明什么 | 不能直接证明什么 |
| --- | --- | --- |
| 原生确认 | 本机客户端普通原生分支的字段、调用和条件 | Lua 热更新后的完整现场行为 |
| 原始配置确认 | 指定关卡、角色、技能及实际引用 prefab 的描述和绑定 | 所有条件分支都会激活，或某隐藏实例已经出场 |

本机来源是 `GameAssembly.dll`、`global-metadata.dat` 与实际 Unity bundle；metadata 格式为 IL2CPP 29，Unity 为 `2021.3.39f1`。
资源清单 `hot_update_list.json` 的 `versionId=26-08-16-14-00-43_415873`、`manifestVersion=V077`；这是资源清单版本，不等于可执行程序版本号。
既有调研写作“2.7.71”时，应保留其原始记录，不用资源清单日期替它补证。
大量方法先检查 `XLua.DelegateBridge`；本次没有执行客户端或确认全部 Lua 覆盖。

持久证据与复查入口：

- [初始客户端摘录](evidence/client-excerpts-20261007/README.md)：保留逻辑推进的所选方法及初始输入记录；Scheduler、出生账本等其余锚点见本文，当时完整报告没有归档。
- [Blocking 推进时序批次](evidence/blocking-timing-native-20261023/README.md)：后续客户端的 BattleController／对象推进指令；索引只适用于该批次指纹。
- 工事、平台与深水的引用及摘录见 [空间研究第 11 节](03-space-units-and-mechanisms.md#11-可复查证据入口)。旧部署报告未入仓，不能将当前客户端重提结果冒充原报告。

## 3. 战斗之前、战斗之中、战斗之后

卫戍的一整局存在准备、普通交战、联合防御和领袖阶段；一场 tactical battle 只是其中一段空间与战斗推进。
`AutoChessGameStateType` 原生枚举包含 `SP_PREPARE=2`、`PREPARE=3`、`BATTLE=4`、`HELP_BATTLE=5`、`BOSS_BATTLE=6`。
阶段枚举、网络协议及整理配置支持这一区分，但不等于完整外层状态转换条件已逐一复核。

| 内容入口 | 事实或实例 | 职责所在层 |
| --- | --- | --- |
| 商店、获得／出售棋子、休整期开始／结束 | 库存、资金、棋子配置、盟约层数 | 整局玩法协调；向战斗准备内容输入 |
| 波次和分支 | 队列、游标、已出生身份与完成账本 | Battle 的调度领域 |
| 干员／敌人／作战召唤物 | 位置、生命、行动、运动等能力事实 | Unit 与相应领域转换 |
| 工事、平台、炮台等设备 | 按实际行为组合空间、生命及行动 | 有空间实例时为 Unit；不能仅按 TRAP 名称归类 |
| 潮汐、地图控制和非空间事件 | 控制器进度与作用对象 | 关卡机制；是否需要空间身份按实际输入判断 |
| 持续 Buff、装备战斗效果 | 实例身份、局部状态、来源和时限 | 效果实例及所属领域；资源保存行为 |
| 击杀、漏怪、战斗结束 | 领域报告、统计与玩法反馈 | Battle 汇总，外层玩法解释 LP、奖励及后续阶段 |

该批整理资料中的 garrison 事件分为 `IN_BATTLE` 和 `SERVER_PRICE`、`SERVER_CHESS_SOLD`、`SERVER_GAIN`、`SERVER_PREP_FIN`、`SERVER_PREP_START` 和 `SERVER_REFRESH_SHOP`。
例如 `garrison_25_a` 是获得棋子时加盟约层数，`garrison_123_a` 是休整期首次刷新相关；不能为它们创建普通战斗攻击 hook。
`garrison_01_a` 的弱点伤害则通过 `env_gbuff_new_with_verify` 和具体效果键进入战斗内容。
“同一效果表”不代表“同一个生命周期”。这些例子目前以整理数据为引用证据，原生事件到模板的完整链仍按具体内容补证。

装备 `chess_item_1_01_e_a` 引用 `eff_acarm041`，再引用属性 Buff；盟约 `swiftShip` 等也持效果描述和参数。
它们可以在准备时生成战斗参数或安装持续实例，不能把装备、盟约本身当成场上 Unit。
策略还可修改准备阶段规则；`BAND_INITIAL` 这个整理分类不保证所有附带 Buff 都只执行一次。

原始地图 `act1autochess_m01` 同时含正常区、镜像区、领袖区与整备／预览区域，以及隐藏角色与设备。
因此 Map 中有红蓝门、隐藏角色或设备，不足以决定本场出生、胜负或所有预置实例自动创建。

## 4. 官方时间：逻辑帧与定点秒并存

`BattleController.FixedUpdate`（method 64251）通过播放／暂停守卫调用 `IGameMode.Tick(Action OnTick)`。
`DefaultGameMode.Tick`（81216）普通原生分支调用一次该回调。
`BattleController.OnTick`（64252）递增 `s_fixedFrameCnt`，并用 `s_deltaPlayTimeFP` 推进 `s_fixedPlayTime` 与 float 镜像。
`Torappu.FP` 是 Q32.32 定点数；官方不是只有整数 tick，也不是每帧读取 wall clock 决定领域行为。

| 时间 | 已确认作用 | 注意 |
| --- | --- | --- |
| `s_fixedFrameCnt` | 已推进逻辑帧数 | 与通用 TimeManager.frameCount 不同 |
| `fixedPlayTime` | 定点战斗时间 | 由模式提供的固定 delta 累加 |
| `userFixedPlayTime` | `fixedPlayTime - fixedPlayTimeIgnored` | Scheduler 记录波次／片段起点用此值 |
| `realPlayTime` | Update 中由 unscaledDeltaTime 累加 | 不是路线与伤害推进的统一时间 |

普通默认 delta 由 `GlobalConsts..cctor`（218085）读取 Unity `fixedDeltaTime` 并缓存；`RestoreDeltaTimeScale`（64173）恢复它。
本机 `globalgamemanagers` 的 TimeManager 对象给出约 `0.03333330154418945` 秒，即约 30 Hz，而非数学上精确的 1/30。
`AutoChessGameManager.StartBattle`（78611）在 `BOSS_BATTLE && !isTrainingMode` 条件下启用步进。
`AutoChessBattleConst..cctor`（77551）将 0.05 秒转 FP；该分支约为 20 Hz，不能按“所有卫戍阶段”或“仅多人”概括。

普通倍速通过 Unity `timeScale` 改变现实时间内的调度；没有在普通 OnTick 中把 delta 再乘一次倍速。
服务步进 `ServerStepModeHelper.Tick` 按播放速度尝试多个 `NextFrame`，还受可用同步帧限制。
[Unity 2021.3 timeScale 文档](https://docs.unity3d.com/2021.3/Documentation/ScriptReference/Time-timeScale.html)说明 FixedUpdate 的调用频率受其影响；这是引擎语义佐证，不替代游戏模式分支。

项目时间表达见[总体架构](../architecture/ARCHITECTURE.md)，不能将其固定 Tick 选择倒推为原生所有阶段的频率。
例如本机默认 raw delta 下 1 秒 WAIT 连续扣减的静态推算需 31 次；步进 delta 下需 21 次。
这些数字不包含 checkpoint 进入位置与 coroutine 唤醒阶段，尚不是运行客户端确认的最终到达帧。
此推算只记录来源差异，不作为项目兼容验收或设计前置；项目按已选择的 30 tick/s 表达等待语义。

## 5. 官方帧内调用与已知边界

`BattleController.OnTick` 的普通原生路径直接调用顺序已定位：

```text
推进逻辑时间
→ BattleTweenMgr.Tick
→ BattleCostManager.UpdateCost
→ Deck.OnFixedUpdate
→ ObjectManager.OnFixedUpdate
→ Map.OnFixedUpdate
→ ActionExecutorManager.Tick
→ LevelScriptEventManager.OnTick
→ Physics2D.Simulate 等条件分支
→ DialogController.OnTick、模式模块、GlobalEnvSystemController.Tick
→ ObjectManager.OnLateFixedUpdate
```

这是当前方法中的调用顺序，带条件的调用不能视作每帧必执行；也不是所有领域行为的最终全序。
ObjectManager 的普通原生遍历已在 [Case B](cases/02-action-and-projectile-phases.md) 补充核对：从按 priority／instanceUid 排序的对象列表冻结当前 validAndBorned 身份，再逐个 OnTick；Enemy 的路线位移与 Projectile 的 live 位置采样发生在各自的对象更新中，没有全局 Projectile-before-Movement 阶段。当前项目的领域 phase 划分仍是独立选择。
其余 Manager 的完整遍历、回调重入与修改缓冲契约尚未核对。
特别是 Scheduler 使用 coroutine；没有完整确认其等待恢复相对对象更新的具体帧内位置。
因此不能从上述列表推导“全部出生先于攻击”或“官方所有单位按 UnitId 依次结算”。

受击 Buff 的局部顺序有独立证据：`SortedDoubleBufferedBuffList.Add` 与 `BuffContainer.OnTakeDamage` 按事件优先级、同优先级加入顺序执行。
这个结论属于一次领域派发，不能扩展成整场所有事件共享同一排序。
Buff 派发期间增删实例的完整可见性、延迟命中与技能切换同帧采样，仍需具体程序和调用链核查。

## 6. Scheduler 专题与配置来源

通用构造、预处理、队列、出生、销毁／回收及等待账本的结论集中于 [Case 30](cases/30-scheduler-action-data-fields.md)。新批次版本与完整原体见 [scheduler-native](evidence/scheduler-native-20261107/README.md)及 [scheduler-general](evidence/scheduler-general-20261107/README.md)，不能混用下列初始客户端索引。

| 初始锚点 | 记录范围 |
| --- | --- |
| _DealWave 71369、_DealFragment 71380、ExecuteActionQueue 71343、比较器71375 | 前后延迟、队列与片段完成后的波次等待；原始比较器只比较时间，没有据此证明同刻稳定排序。 |
| _DealAction 71258、_DoSpawn 71398、_OnActionExecuted 71292 | count 展开、delayToBorn 修正及动作完成回调，动作完成不等于敌人死亡。 |
| _NotCountInTotal 71224、_OnUnitDestroyed 71295、_OnEnemyRecycled 71297、_CheckFinalNotFinish 71294 | 总数、波次／最终等待、销毁／回收及模式结束条件分别存在。 |
| TryMoveNextBranch 71235、BranchRuntime.TryPickNextPhase 71309 | 逐次选取 Phase、游标与循环；分支存在不表示自动开始。 |
| RandomEnemyGenerater._DoReplaceLevelDataClient 79011、_DoReplaceActionDataClient 79012 | 卫戍准备层替换占位动作；不代表通用 Scheduler 自行决定阵容。 |

本节早期完整转储没有归档，来源限度见[初始批次](evidence/client-excerpts-20261007/README.md)；后续相同机制以各新批次的原件与独立指纹复核。

[两份完整关卡摘录](evidence/schedule-level-structure-20261106/README.md)固定镜像提交 bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d：

| 样本 | 主线 | 分支 |
| --- | --- | --- |
| H8-1，level_hard_08-01 | 一波六个 Fragment；片段1前延迟5，动作偏移5／15／25；片段5动作4为 count2、preDelay20、interval8。 | branches=null。 |
| level_act1autochess_h07_02 | 一波一个 Fragment，七条出生动作。 | dragon、boss_escaped_walk、boss_escaped_fly、boss_battle_multi_player各一Phase。 |

主线 routeIndex 指 routes，Branch 指 extraRoutes。dragon 的 Phase0含 enemy_9012_acloon、count1、preDelay0、routeIndex0；具体触发来源未由该配置证明。两份文件均没有顶层 timeline；Branch 配置只有 phases，各项为 preDelay／actions，不携带触发器。配置名义时刻不能冒充实际出生帧，仍受 delayToBorn 与 coroutine 调度影响。

## 7. 地图、设备与隐藏内容的可达性

本次有 17 份原始关卡样本，均为单 wave／单 fragment，但包括地图骨架、普通、联合防御与部分领袖模板；不能代表全部 38 份模板。
原始 `h07_01` 明确含 MOVE、DISAPPEAR、WAIT_FOR_SECONDS、APPEAR_AT_POS；`h07_02` 还有 PATROL_MOVE。
联合防御和领袖通路由具体 routes／extraRoutes 与程序决定，红蓝门 marker 不自行产生跨区域行为。

| 具体来源 | 确认的引用／绑定 | 覆盖边界 |
| --- | --- | --- |
| `act1autochess_m01` | 12 个非隐藏工事、4 个隐藏炮台 | 工事引用成立；炮台真实启用条件需玩法入口 |
| `act1autochess_m02` | 16 个隐藏工事、16 个隐藏平台 | 初始 recipe 存在，不能自动创建全部实例 |
| `act1autochess_m03` | 16 个非隐藏平台、8 个非隐藏工事 | 平台实际 mode 修改部署／高度，保持通行条件 |
| `act2autochess_m02` | `trap_098_mire`、工事 | 控制器参数与地形累积行为是不同执行职责 |
| `act2autochess_m04` | `trap_042_tidectrl` 的深水技能选择 | 本图控制器引用不能证明船运寻路可达 |
| 旧 `act1autochess_m05` | 64 个 `trap_040_canoe` | 本季 active=false；船相关残留不进入支持承诺 |

`trap_1106_achplat` 和 `trap_1105_accrate` 的真实引用 mode 已独立解码，不能只凭“平台／箱子”名称推定阻挡或部署能力。
原始角色表中 `trap_1112_acblzd` 的技能配置有 `overridePrefabKey=sktok_empty`。
所以地图里统一存在“寒风”控制器，不能直接证明默认执行寒冷；还要确认所选程序以及盟约等入口的激活链。
这也说明 prefab 目录中的技能模板、角色表技能名称和战斗实际执行程序不能混为一项。
