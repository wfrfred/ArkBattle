# 卫戍协议内容范围与战斗推进

核查日期：2026-10-07。本文记录机制事实、来源边界和当前实现差距，不确定最终类型或 API。

## 1. 范围与证据强度

目标内容是本仓库选择的 `act2autochess`，即卫戍协议：盟约下半；不是明日方舟所有玩法。
当前整理配置包含单人／联合模拟各四种难度，训练模式标为 `inScope=false`。
生息演算、保全派驻以及其他玩法的船运寻路不在目标范围。
客户端存在 `LhshipSPFA` 等类，不能据此把对应寻路模式加入卫戍协议。

证据分三类：

| 标记 | 可以证明什么 | 不能直接证明什么 |
| --- | --- | --- |
| 原生确认 | 本机客户端普通原生分支的字段、调用和条件 | Lua 热更新后的完整现场行为 |
| 原始配置确认 | 指定关卡、角色、技能及实际引用 prefab 的描述和绑定 | 所有条件分支都会激活，或某隐藏实例已经出场 |
| 项目事实／设计选择 | 当前代码、整理数据和授权的确定性契约 | 官方客户端具有相同架构和精确帧顺序 |

本机来源是 `GameAssembly.dll`、`global-metadata.dat` 与实际 Unity bundle；metadata 格式为 IL2CPP 29，Unity 为 `2021.3.39f1`。
资源清单 `hot_update_list.json` 的 `versionId=26-08-16-14-00-43_415873`、`manifestVersion=V077`；这是资源清单版本，不等于可执行程序版本号。
既有调研写作“2.7.71”时，应保留其原始记录，不用资源清单日期替它补证。
大量方法先检查 `XLua.DelegateBridge`；本次没有执行客户端或确认全部 Lua 覆盖。

可重复定位的本地报告：

- `/tmp/stronghold-client-logic/report.txt`、`/tmp/stronghold-client-logical-frames.txt`：逻辑帧、定点时间及步进控制。
- `/tmp/stronghold-batch4-scheduler/report.txt`：波次、片段、出生队列与阻塞账本。
- `/tmp/stronghold-6b-deployment-report.md`：工事、平台与深水许可的实际 prefab 绑定。
- [旧波次调研](../../external/upstream/docs/research/08-waves-official.md)、[限伤调研](../../external/upstream/docs/research/11-limits-official.md)：内容生成与特殊玩法边界。

## 2. 整理数据的实际规模

`data/` 是 `tools/build-data.mjs` 汇总客户端数据、研究 JSON 和项目选择后的输出，不是未经解释的原始客户端格式。
标有 `assumed` 的经济、模式倍率或玩家数量缩放，不因进入该目录就成为官方已确认规则。

| 文件 | 本次读取的条目数 | 解释 |
| --- | ---: | --- |
| `chess.json` | 266 | 133 套普通／精英棋子配置；对应 122 个不同 `charId` |
| `enemies.json` | 249 | 包含占位模板、召唤等角色；其中 `tokenOnly` 为真的有 8 条 |
| `tokens.json` | 22 | 整理分类为 19 个 summon、1 个 bondSummon、2 个 mapChar |
| `garrisons.json` | 249 | 棋子特质配置，含战斗与整局玩法事件 |
| `effects.json` | 361 | 共用内容描述，横跨羁绊、装备、策略、机变等入口 |
| `items.json` | 115 | 112 个装备配置，加 3 个术式配置 |
| `bonds.json`／`bands.json` | 23／40 | 盟约与策略配置，并非普通单位列表 |
| `bosses.json` | 10 | 领袖内容及模式关联 |
| `waves.json` | 38 | 13 normal、2 escaped、14 boss、6 hidden、3 training 模板 |
| `stages.json` | 11 | 本季选择中 8 个 active，另外 3 个为遗留地图 |

数量描述的是当前文件，不是“core 已支持多少内容”；旧研究中 enemy 的 326 条统计使用不同集合，不应混用。
本次整理数据指纹为 SHA-256 前 16 位：`waves=80cb535958f22a1b`、`chess=9eee03961114ea86`、`enemies=7361604e47bd3954`。
另外 `config=a8e1fc4cf9bd3362`、`bonds=73fe3949e97a5107`、`items=6122a3cd75531f55`、`effects=96e28be614f04da6`。

内容覆盖至少要走完这条证据链：

```text
本季／模式选择
→ 关卡、棋子、装备或玩法事件引用
→ 实际选用的技能、prefab、模式及条件
→ 已编译并可执行的行为
→ 对应行为验证
```

全局 Buff 模板存在只证明定义可用，不能跳过上述引用与激活链。

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

当前 `garrisons.json` 中 121 条属于 `IN_BATTLE`；其余为 `SERVER_PRICE`、`SERVER_CHESS_SOLD`、`SERVER_GAIN`、`SERVER_PREP_FIN`、`SERVER_PREP_START` 和 `SERVER_REFRESH_SHOP`。
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

项目已经选择固定 **30 tick/s**，core 不读取 clock；倍速由外部驱动多次 step。
这是授权的模拟规则，不能写作“严格复现官方所有阶段固定 30 Hz”。
当前 `secondsToTicks` 按项目时间转换且消除接近整数的浮点误差，不模拟官方 Q32.32 每次扣减残余。
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

## 6. 官方 Scheduler 已确认的语义

主波次 `_DealWave`（71369）记录 `userFixedPlayTime`，执行 preDelay，逐片段执行，之后检查波次阻塞，最后执行 postDelay。
`maxTimeWaitingForNextWave` 的计时起点是片段／队列执行完成后进入等待时，不是 wave 开始时。
最后一波不靠该最大等待时间提前放行；超时只释放本波阻塞集合，不移除存活敌人。

片段 `_DealFragment`（71380）记录 `fragmentStartTime=userFixedPlayTime+preDelay`，排队动作并等待整个队列执行完。
空队列没有独立的无条件 preDelay 等待；有未来动作的队列即使无 blockFragment，也不能提前跳过。
`ExecuteActionQueue`（71343）按相邻 offset 等待并执行；比较器（71375）仅比较时间，未证明同 offset 的 List.Sort 稳定。
项目可以采用自己的确定性同刻顺序；只有动作之间存在改变结果的状态依赖，才需要继续核对相应先后语义，不要求复刻内部排序实现。

`_DealAction`（71258）将 count 展开并计算出生偏移；SPAWN 会扣 prefab 的 `delayToBorn` 并限制非负。
`_DoSpawn`（71398）创建／登记后回调 `_OnActionExecuted`（71292），释放的是动作完成计数，不等待敌人死亡。
实例创建、出生动画结束、可操作并非同一时点；不能把 blockFragment 理解成“片段敌人全部被击杀”。

| 账本 | 进入与退出依据 | 不等同于 |
| --- | --- | --- |
| 本波 managedWave | managed、计数资格、主／分支阻塞标志 | 当前场上所有敌人 |
| 全场 managedFinal | managed 且计入调度；销毁或回收策略决定退出 | 本波集合是否为空 |
| blockCounter | 排队动作与执行完成 callback | 战场活单位数 |
| 击杀／漏怪统计 | 对应生命周期与玩法规则 | 单纯减少任何一个账本 |

`_NotCountInTotal`（71224）组合 EnemyData 与 ActionData 标志；与 unharmful 不是同义开关。
`_OnUnitDestroyed`（71295）和 `_OnEnemyRecycled`（71297）揭示销毁／回收退出 final 的配置差异。
`_CheckFinalNotFinish`（71294）还检查模式与 finish-blocker；final 集合为空不是所有模式的完整胜利条件。
`TryMoveNextBranch`（71235）一次取下一 phase；`BranchRuntime.TryPickNextPhase`（71309）管理游标与 loop。
分支存在不表示自动开始，分支路线使用 extraRoutes；出生时沿用当时主波／片段计时快照。

原始 `act1autochess_01` 的 dragon 分支包含 `enemy_9012_acloon`，但主 waves 没有对应触发动作。
既有 native 调用扫描尚不能证明普通回合的触发时点；显式触发测试不能替代真实玩法触发证据。
`h08_01` 的两个本地随机动作有相同 packKey，不能简化成互斥的两敌人随机选择。
随机组的选择／关联规则、daily／season 内容输入，以及出生／完成／等待的可观察调度语义仍保留未核对状态；内部随机调用轨迹与 coroutine 精确量化不作为兼容目标。

卫戍 `RandomEnemyGenerater._DoReplaceLevelDataClient`（79011）与 `_DoReplaceActionDataClient`（79012）改写占位动作。
普通回合选定特训条目后保留相应移动类别，并按战斗效能计算 count；另一移动类别占位动作不生成。
此投影属于卫戍内容准备，通用 Scheduler 不能自己猜 N／NF 模板的替换结果。

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

## 8. 当前 TS 实现与官方事实的对应

当前 [BattleRuntime](../../src/core/battle/runtime.ts) 复制工作容器，所有阶段与结果构造成功后才替换公开状态。
其 [系统阶段](../../src/core/battle/systems.ts) 顺序为：

```text
预置／空间效果到期 → 战斗效果准备 → 部署 → 出生
→ 重寻路 → 阻挡 → 交战 → 运动 → 阻挡
→ 预置反馈 → 调度反馈 → 完成／时限结果
```

阶段内提交给后续阶段可见，整 tick 失败则不发布；这是项目的确定性与事务契约，不是从官方原生列表复刻出的全序。
交战阶段按 UnitId 排序，单位与效果事实逐笔更新，Blocking 查询沿用阶段开始关系。
反应通过最新工作状态同步结算；这也是已选择并测试的项目契约，尚无证据宣称官方完全相同。

| 已有能力 | 官方依据／当前限制 |
| --- | --- |
| 波次状态机、pre/postDelay、maxWait、独立 wave/final 账本 | 对应已核对的 Scheduler 语义；同 tick 连续推进是项目策略 |
| 显式分支触发、出生时 RouteTiming | 保留主／分支来源；未自动接入所有官方技能／玩法触发 |
| 出生、死亡、路线完成与调度反馈 | 已有最小生命周期通知；官方 recycle 与统计政策仍需扩展 |
| 地图与设备空间投影 | 工事／平台和选定控制器支持明确；不等于全技能执行 |
| Action、有效属性、Damage／Healing、局部效果规则 | 已有闭环；未覆盖所有角色、投射物、元素爆发和技能状态机 |
| `SCHEDULE_COMPLETED`／`TIME_LIMIT` | 当前单场结果；不等于完整卫戍 LP、联防、领袖共享血池结算 |

[Data 调度边界](../../src/data/arknights/schedule.ts) 当前明确拒绝随机 pack、特殊计杀、非 ALWAYS 条件和非零出生延迟等未实现组合。
所以“原始数据可解析”与“所选内容可模拟”要分别报告；整季内容替换、Buff 安装、技能触发和结束反馈不能留给通用 runtime 用内容分支兜底。

后续核查重点是内容触发到执行链、出生／退场各时点、派发增删可见性、投射物采样及联防／领袖共享状态。
BattleRuntime 负责稳定推进和协调；Battlefield 管空间事实与关系；领域 subsystem 拥有公式与状态转换；关卡机制与内容程序负责具体条件和顺序。
上述边界是根据事实得到的职责建议，不是声称官方客户端已经采用同样的模块或最终接口。
