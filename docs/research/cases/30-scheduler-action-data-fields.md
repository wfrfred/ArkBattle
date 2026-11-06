# 通用 Scheduler：ActionData 字段消费与调用路径

研究日期：2026-11-07。按“构造／预处理 → 排队 → 执行 → 登记 → 销毁／回收 → 结束判断”调查 24 个 ActionData 字段，再比较入口和实际样本，最后讨论项目职责。不以现有 Core 类型或卫戍配置的默认值推导通用政策；本轮不修改 Core、Data 或 Skill。

ArkBattle 是通用明日方舟战斗模拟器。卫戍是当前重点，生息、保全等特殊模式暂不考虑。跨玩法取样用于区分字段行为，不等于将样本来源的整套玩法纳入实现范围。

## 1. 方法、来源与证据级别

- **直接使用**：在指定路径找到对该字段的读取、写入或判定。
- **间接影响**：字段已被解释为队列、出生选项、实例或账本，后继读取的是解释结果。
- **仅结构保留**：在指定路径只看到构造默认、复制或保存，没有找到解释；不表示其他路径也不消费。
- **N** 为普通原生分支直接证据，**D** 为固定版本配置，**U** 为未闭合。静态指令不代替运行时观测，也不证明 XLua 没有覆盖。

[新批次](../evidence/scheduler-general-20261107/README.md)保存外部入口、执行器、预处理、载荷生产／消费和跨玩法样本；[初次字段批次](../evidence/scheduler-action-fields-20261107/README.md)保留构造器、字段布局及原始记录；[队列与出生批次](../evidence/scheduler-native-20261107/README.md)保留主 Wave、Branch Phase 和普通出生链。客户端指纹与镜像版本分别记录，二者不自动视为同一现场版本。

配置固定为 `Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。新批次目的性选取 82 份、3,447 条 Action，并逐文件核验 Git blob SHA：79 份非生息来源有 3,283 条；另取 3 份排除模式配置、164 条作为字段取值对照，分别统计。不是全仓覆盖，也不将所有来源玩法宣布为支持目标。配置见证与 Branch／隐藏组激活链尚未核实的限制分别记录。

本案依次检查五件事：完整消费链；入口间差异；能区分行为的非默认样本；Data／Content／Core／Meta 边界；是否有依据压缩类型。最后一步尚未实施。

### 关联容器字段

ActionData 必须连同上游容器和下游账本解释。容器字段布局与取值见新批次 `execution/supporting-types.json`、`execution/wave-tags.json`，推进原件见主 Wave／Fragment／Branch 状态机。

| 字段 | 已核实消费与证据边界 |
| --- | --- |
| Wave.preDelay／postDelay | 分别交给 WaveHandler 的前、后延迟过程；不合并成每个 Action 的延迟 |
| Wave.fragments | 主 Wave 按顺序执行 Fragment；先前片段的实例可以继续存活 |
| Wave.maxTimeWaitingForNextWave | 片段队列完成后进入本波阻塞等待，存在下一波且配置非负才采用最大等待；超时清理本波阻塞，不删除实例 |
| Fragment.preDelay／actions | 前延迟参与动作 offset 与片段时间锚点，actions 经选择／资格、展开与排序后执行；空队列不是无条件额外等待前延迟 |
| Branch.phases／Phase.preDelay／actions | 由显式调用选择 Phase，独立执行其队列；与主 Fragment 的额外完成等待不同 |
| Wave.advancedWaveTag | N：BossRushGameMode.OnWaveWillStart 直接比较 bonuswave／bosswave，NextWaveIsBonusWave 读取下一 Wave 标签；Cooperate 预处理直接识别 stage，相关分支还解析数字标签。D：联机和试炼配置有非空标签。具体程序消费与通用队列推进分别记录，不能据其位置就宣布必须成为 Core 字段；boss_wave 的消费仍未闭合，不能与 bosswave 混同 |

## 2. 构造、复制与预处理

### 构造和保存

ActionData 构造器显式设置 `managedByScheduler=true`、`count=1`、`isValid=true`。OnAllocate／OnRecycle 普通方法体为空；Duplicate 调用 MemberwiseClone。`actionId` 是位置值类型，`extraMeta` 是对象引用；复制不会自动重新生成位置或深拷贝载荷。

### 预处理不是一种算法

- **DefaultSchedulerPreprocessor** 的普通 DoPreprocess 为空，另有 XLua 入口；不能据此说所有玩法没有预处理。
- **RandomGroupSchedulerPreprocessor** 对主 waves 组织 Wave／Fragment／groupKey 索引，读取 SPAWN、ACTIVATE_PREDEFINED、EMPTY 的组、Pack、权重与空 key 信息，并删除未选项及关联项；不是 Phase 的有效 Pack 收集算法。
- **Branch Phase.FetchActionsWithRandomSpawn(true)** 先重置有效标记，按组选择 Action，收集选中项的 Pack Key，再按原动作顺序生成有效列表。选择发生在 count 展开之前。
- **DataDrivenRandomSchedulerPreprocessor** 的顺序为 Default → InitValidation → 外部 valid 结果筛选 → 逐 Action 已击杀数 → 同 key 剩余数预算 → 空 key 处理 → 删除无效项。外部结果集合为空时跳过对应步骤，不能解释为“全部不选”。

DataDriven 的 InitValidation 将 actionId 写为 `(subSchedulerI, waveI, fragI, actionI)`，并将 isValid 重置为 true；有效位置与逐 Action 已击杀数匹配另构造 `(0, waveI, fragI, actionI)` 键，不能直接等同于按完整 actionId 匹配。逐 Action 已击杀数对已有效的 type 0／6／13 扣减 count，再以 count>0 判有效；同 key 剩余数对已有效的 type 0／6 按遍历顺序取 min(count, remaining[key])，并消耗共享 remaining 预算。这里改变的是最终动作列表和次数，不是给每次出生增加一个 ID。

`_ProcessEmptyActionKeys` 只根据 key 是否为空设置 isValid=false，不根据 actionType 专门识别 EMPTY。不能从函数名推断所有 EMPTY 类型都已被清理。

## 3. 逐字段消费矩阵

下表的“本链不读”只限定对应阶段。直接消费与间接后继分列，不能把某阶段不读当成字段全局无意义。

| 字段／客户端类型 | 构造、预处理、排队的直接使用 | 执行／登记的直接使用 | 销毁、回收、结束的间接影响或结构边界 |
| --- | --- | --- | --- |
| `actionType`／ActionType | 预处理筛选类型；_DealAction 仅对 SPAWN／PREVIEW_CURSOR 按 count 展开；CalculateStates 仅计 SPAWN | 主队列按类型索引执行器；Branch 路线模板只接受 SPAWN／EMPTY 并提取信息 | 不由销毁阶段重新派发；类型改变可使其根本不产生 Enemy |
| `managedByScheduler`／bool | 默认 true；主 waves 计划总数计算不读它 | 普通 _DoSpawn 将它作为 wave／final 集合登记 gate 之一 | 通过集合影响等待；销毁统计不以 managed 为总开关 |
| `key`／string | 空 key 可由预处理置为无效；敌人键参与 N 计算；随机算法也解释空候选 | SPAWN 查 enemyMap；其他动作分别解释为剧情、音效、alias、事件参数等；Branch 路线模板读取它 | 经出生内容、EnemyData 与保存的 Action／Options 影响后继；不是所有 Action 都要求敌人 ID |
| `count`／int | 默认 1；预处理可改写；主总数加 count；SPAWN／PREVIEW_CURSOR 展开次数 | 普通出生器一次处理一个展开项；外部 Branch 路线模板不展开它 | 实际出现数量与计划总数受其影响；销毁不会再按原 count 重复计数 |
| `preDelay`／float | 加 Fragment／Phase 的 preDelay；SPAWN 再扣 delayToBorn 并对首次偏移截零 | 队列按展开后的 offset 等待 | 间接决定后继时刻；外部只借 Branch 路线的入口忽略它 |
| `interval`／float | 第 i 项加 i×interval；卫戍替换数量时也重算 interval | 一次出生本身不再重读间隔 | 外部 Branch 路线模板不执行此间隔；不是所有动作都重复 |
| `useExtraRoute`／bool | _DealAction 对 SPAWN／PREVIEW_CURSOR 根据 fromBranch 写入 | 选择 routes／extraRoutes；普通出生还据此推导召唤、计数和默认阻波政策 | 不只是数组选择；解释后的 Options 继续影响退出统计 |
| `routeIndex`／int | 路线预览辅助动作复制该值 | SPAWN／预览选路线；外部 Branch 模板提取该值 | 后续通过 Route 实例影响移动；退出不重新选路 |
| `blockFragment`／bool | _DealAction 增加待回调计数 | 主 Fragment 完成回调读取它并扣减；成功和失败出生都回调 | 等的是动作完成，不是死亡。普通 Branch 只有局部计数，不具有主 Fragment 额外等待，见第 4 节 |
| `autoPreviewRoute`／bool | SPAWN 排队时追加 PREVIEW_CURSOR 辅助项 | 本出生器不读原字段 | 辅助项影响队列与表现，不是敌人的行动或统计开关 |
| `autoDisplayEnemyInfo`／bool | SPAWN 排队时追加 DISPLAY_ENEMY_INFO 辅助项 | 本出生器不读原字段 | 不等于是否登记击杀、完成或总数 |
| `isUnharmfulAndAlwaysCountAsKilled`／bool | 普通预处理不据此合并管理政策 | _DoSpawn 直接拆为 unharmful，以及仅非分支时成立的 alwaysCountAsKilled | 销毁读取 Options.alwaysCountAsKilled 决定击杀判定；它不等于 managed 或不阻波 |
| `hiddenGroup`／string | Init 建启用集并排除禁用集；CalculateStates／排队资格调用 CheckActionEnabled | 普通出生复制到 Options.hiddenGroupKey；外部只借路线的入口不执行该筛选 | 是动作启用资格，不是隐匿；不证明隐藏配置实际已激活 |
| `randomSpawnGroupKey`／string | 主预处理／Phase 收集候选；作用域与算法因入口而异 | 到出生阶段通常已转为选中的项；外部路线模板不做组选择 | 本生命周期链仅保留结构；不可把每次出生重新随机当成既定规则 |
| `randomSpawnGroupPackKey`／string | 主预处理解释删除关联；Phase 解释选中 Pack 关联 | 普通出生不重新解释 Pack | 同名字段不是各路径都代表“互斥”或“一起启用” |
| `randomType`／RandomType | 结构与样本已确认；本批已追踪预处理未找到解释其周期策略的直接读取 | 普通队列、出生、外部路线模板未读 | **U：**具体策略消费者尚未定位，不能由枚举名实现，也不能宣布无用 |
| `refreshType`／RefreshType | 同上；不等于 interval 或每 Tick 刷新频率 | 上述执行路径未读 | **U：**非 ALWAYS 如何转为外部选择／恢复结果尚未闭合 |
| `weight`／int | 加权选择读取；ActionData getter 将值提供给选择程序；非零而无组不自动证明触发抽选 | 展开后的普通出生不再按权重抽取 | 间接影响实际候选，不直接作为数量／伤害倍率 |
| `dontBlockWave`／bool | 不参与主 waves 总数计算 | 普通出生推导 wave 登记豁免；外部入口也有独立实参 | 只移除本波阻塞资格，不因此移除 final、total 或完成统计 |
| `forceBlockWaveInBranch`／bool | 不参与主 waves 总数计算 | 普通分支取消默认不阻波；dontBlockWave=true 仍优先豁免 | 通过 wave 集合影响等待；非默认内容见证仍缺，不等于分支判断不存在 |
| `isValid`／bool | 默认 true；预处理重写／删除；Phase 用于有效列表 | **主 ExecuteActionQueue 在派发前直接读取，false 跳过执行并推进队列位置** | 与 hiddenGroup、数值合法性不同；生命周期后继不再解释这一标记 |
| `notCountInTotal`／bool | 非空 key 时与 EnemyData 同名项作 OR 得 N；CalculateStates 排除 N 项 | 普通出生通过 N 设置 dontCountAsFinished 并控制管理登记 | 经 Options 和集合影响后继；外部直接出生不必执行这一合并；Action 与 Enemy 字段的配置见证分开 |
| `extraMeta`／object | 复制时保留引用；卫戍运行时生成器可写入 EnemyInfo | _DoSpawn 读取 null 性、复制到 Options.actionExtraMeta；登记程序可解释实际类型 | null 性影响召唤／计数；载荷程序还可安装 Buff。具体来源与出生后写回区分，见第 6 节 |
| `actionId`／ActionID 值类型 | DataDriven 写入四段位置，外部结果按位置匹配 | 普通排队／一次出生不以其定位 Unit | 本生命周期链只保存结构；不是 Unit ID、spawnedCnt 或每次出生 ID |

主队列直接读 isValid 的证据为 `DefaultWaveHandler/<ExecuteActionQueue>.MoveNext` 的 `0x1809895e2`。false 分支跳过执行器并推进 offset／cursor。此前只记录预处理或 Phase 对 isValid 的使用不完整。

`_RegisterActionExecutors` 注册索引 0—12，主队列按索引读取执行器并要求非空。EMPTY 能被随机预处理和 Branch 路线模板识别，不等于普通队列为它注册了执行程序。不能将类型列表中的全部名称机械翻译为可直接执行的统一指令。

## 4. 不同调用路径的差异

| 路径 | 实际解释的输入 | 等待、登记与统计差异 |
| --- | --- | --- |
| 主 Wave／Fragment | CheckActionEnabled 后展开、排序；主执行器收到完成回调 | 有全局 blockCounter 的额外等待；_DoSpawn 创建成功且 managed、非 N、alive 才加入管理集合 |
| 普通 Branch Phase | 先 Phase 随机有效列表，再资格过滤、展开并按序 yield 执行器 | 给 _DealAction 的 blockCounter 是局部变量；执行器 callback=null，队列末尾不等待该局部计数，但仍等待被 yield 的执行器本身 |
| 主线随机预处理 | 输入原始 Action，按本算法组织、选取／删除并生成后继列表 | 是输入转换，不能拿 Phase 算法替代；实际执行入口需沿调用者确认 |
| DataDriven 预处理 | 外部有效位置、已击杀数、剩余数量预算 | 修改 isValid、actionId、count 并删项；不能把外部空结果列表解释成相同业务政策 |
| 外部 Branch Route／Phase 模板召唤 | 以 isLoop=true 取下一 Phase 并推进游标，提取 type、key、routeIndex；可覆盖敌人键 | 不展开 count、不等 preDelay／interval，也不解释该项的管理／随机／隐藏标志；后续使用外部方法实参。取 Phase 后校验失败，本方法内不回滚游标 |
| 外部 SpawnEnemyWithRoute 的 bool 参数重载 | 已选 Route 与独立 managed／dontBlock／isSummon／alwaysCount 实参 | 不走 ActionData.N；dontCountAsFinished 默认 false；管理与召唤身份独立 |
| 外部 SpawnEnemyWithRoute 的 host 重载 | 宿主、Route、伤害／计数选项及 managed 实参 | 固定 isSummon=true、dontCountAsFinished=false；managed 只控制 final 登记，没有独立 dontBlock／isSummon 实参 |
| 外部 RuntimeRoute／Npc | 运行时路线或位置、宿主及各重载参数 | 某重载只登记 final，某重载／Npc 在本方法内不登记；不能从相似函数名推定相同政策 |
| TrackedInGameMode 召唤 | 宿主、延迟、追踪与管理参数 | 固定 dontCountAsFinished=true、isSummon=true、alwaysCount=false；另有允许召唤及宿主检查和模式回调 |

一个可区分的例子：同一 Branch Action.count=3，普通 Phase 可展开三次；外部 BranchPhase 路线模板入口只提取该项一次。再如普通 Branch 的 extraMeta=null 时强制 dontCount／isSummon，而外部 BranchRoute 可以用独立实参得到不同选项。

原生 TryGetEnemyRouteFromBranch／TryGetAllEnemyRoutFromBranch 不是纯 peek：它们传 true 给 TryPickNextPhase 的 isLoop 参数（`0x180983d7d`、`0x18098389d`），成功取项时后者写 nextPhaseI=index+1（`0x180978723`）。不能仅凭 Get 命名将这条路径建模成只读查询。

Branch 的 blockFragment 结论见 `_DealBranchPhase.MoveNext`：局部 counter 地址传给 _DealAction（`0x18098b7a2`／`0x18098b7bf`），执行器 callback=null（`0x18098bab5`），其 IEnumerator 被 yield，末尾没有主 Fragment 的 WaitWhile(counter)。因此不能说“Branch 完全不等待”，也不能宣称它完整复用了主 Fragment 的回调等待政策。

### 非 SPAWN 执行器

本轮追踪了 STORY／TUTORIAL（StoryDB、AVG）、DIALOG（对话控制器）、PLAY_BGM（BGM 管理器）、DISPLAY_ENEMY_INFO、PREVIEW_CURSOR、ACTIVATE_PREDEFINED、WITHDRAW_PREDEFINED、TRIGGER_PREDEFINED、PLAY_OPERA、SHOW_ALL_HIDDEN_CARDS 与 BATTLE_EVENTS。key 在这些入口中分别是资源、alias、触发参数或模式事件输入；部分执行器不消费 key。完成时点也由各执行器的回调／协程决定。

这些动作即使保存 managed、routeIndex 或 count，也不能因此认为它们执行出生账务或重复 count 次。音画程序本身与出怪规则分别归属，但若它承担阻塞和完成信号，转换时不能连同控制流程一起静默删除。

## 5. 四个争议字段与退出账务

令 B 为普通 _DealAction 写入的分支标记，M 表示 extraMeta 非空，N 表示 `_NotCountInTotal(action)`。普通 _DoSpawn 的解释为：

```text
不阻塞当前波 = dontBlockWave || (B && !forceBlockWaveInBranch)
unharmful = isUnharmfulAndAlwaysCountAsKilled
alwaysCountAsKilled = !B && isUnharmfulAndAlwaysCountAsKilled
isSummon = B && !M
dontCountAsFinished = (B && !M) || N
```

这里不等同于所有外部出生入口，不能把这组公式扩大为“Branch 总是召唤”的领域公理。

- **计划总数**：CalculateStates 遍历主 waves，以启用、type=SPAWN、非 N 为条件加 count；不读取 managedByScheduler、dontBlockWave 或 forceBlockWaveInBranch。本方法不遍历 Branch。
- **本波／最终集合**：普通 _DoSpawn 成功创建后要求 managed、非 N、enemy.alive；不阻波只影响 wave 集合，随后仍可加入 final 集合。创建前已递增的 spawnedCnt 也不能当作成功出生数量。
- **完成／击杀计数**：_OnUnitDestroyed 先经 _VerifyEnemy 核验非空，仅在多层地图匹配 mapLayer；普通地图不查询 sourceScheduler 或管理集合归属。统计主要看 Options.dontCountAsFinished 与 isSummon，击杀再看结束原因、alwaysCount 等。它没有先要求实例还在 managed 集合。
- **销毁／回收**：销毁解除 wave 阻塞。动态配置 useRecycleToFinishScheduler=false 时也解除 final；为 true 时 final 留到回收入口解除。不能固定认为死亡或回收的任意一项总是最后等待点。
- **结束判断**：wave 集合、final 集合、模式条件及显式结束 blocker 分别参与；remaining=total−finished，completeProgress 使用 killed／total，都不是管理集合数量或完整结束条件的同义接口。

外部 MarkEnemyKilled 可提前完成账务并使实例不再重复完成计数；ReleaseEnemyFromCurrentWave 只释放本波／缓存关系，不增加完成计数或移除 final。动作完成回调在普通创建成功或失败路径都执行，也不等待敌人死亡。

因此已有证据足以否定“managed 是总开关”“不阻波就不计数”“分支统一固定政策”等合并方式。尚未据此决定 Core 最终保留几个字段：需要保留的是这些独立的战斗事实，而不是原生字段数量本身。

## 6. extraMeta 的实际生产与消费

卫戍的 `_GenerateSelfBattleEnemyData`、`GenerateHelpBattleEnemyData`、`GenerateBossBattleEnemyData` 会分别把 `SelfEnemyInfo`、`EscapedEnemyInfo`、`BossBattleEnemyInfo` 写入新 ActionData.extraMeta，三者继承 EnemyInfo。普通出生将它传到 Enemy.Options.actionExtraMeta；OnEnemyRegistered 对 EnemyInfo 类型进行判定，读取 isSpecial／effectInstId 等并可调用 AddBuffById。故载荷不是仅用于日志的任意对象，也不是 JSON 漏配置的一个可选静态属性。

Enemy.SetExtraMeta 写的是同一 Options.actionExtraMeta，但这是出生后的改写，不能当成 ActionData 原始生产证据。生产者、出生传递与出生后写回分别见新批次 preprocess 证据。

这条链解释了为什么既不能丢弃未知非空载荷，也不能给通用 Core 增加一个未经解释的 EnemyInfo／extraMeta 容器。应先提取其承担的具体事实与程序，再判断输入准备、内容安装和通用账务分别归属。

## 7. 跨玩法非默认见证与缺口

[配置证据](../evidence/scheduler-general-20261107/config/README.md)保存完整动作、JSON Pointer、固定 ref、Git blob 校验与可复跑选择。以下只给能区分行为的代表，不以数量代替机制证明。

| 字段／区别 | 固定配置见证 | 能证明及不能证明的内容 |
| --- | --- | --- |
| managed=false | `rogue6_3-7 /waves/0/fragments/11/actions/1`、`/2`；`crisis_v2_05-01 /branches/cai_fish/phases/0/actions/0` | 真实非默认配置存在；隐藏组／Branch 的具体激活仍需调用链，不能说所有场次必出现 |
| blockFragment=true | `guide_02 /waves/0/fragments/2/actions/2` 为 ACTIVATE_PREDEFINED；教学剧情另有 STORY | 该字段确实用于非 SPAWN，不能从卫戍全 false 推导可删除 |
| 数量、时刻与路线 | `main_00-01 /waves/0/fragments/2/actions/0`：SPAWN，count=2、preDelay=3、interval=2、routeIndex=3、autoPreviewRoute=true | 同一实际节点同时启用重复、延迟、间隔与路线选择，不由人工夹具组合 |
| 两项自动表现动作 | `main_12-18 /waves/0/fragments/0/actions/0`：SPAWN，autoPreviewRoute／autoDisplayEnemyInfo 均 true | 必须结合 type=SPAWN 才是当前消费者的启用见证；STORY 保存 autoPreviewRoute=true 不能冒充路线预览已执行 |
| 无害／击杀选项 | `main_06-15 /waves/0/fragments/0/actions/0`：SPAWN，isUnharmfulAndAlwaysCountAsKilled=true | 证明非默认出生选项存在；其条件化拆分仍以实际路径为准 |
| dontBlockWave=true | `main_14-02 /waves/0/fragments/0/actions/0` 为普通主线 SPAWN | 普通主线的主 waves 实际配置了 true，不仅见于外部召唤；执行语义由原生链证实 |
| hiddenGroup 非空 | 肉鸽配置的 normal、cargo、calamity、hidden 等组；详见样本原路径 | 配置启用条件存在；不将配置文件存在当成组已经被启用 |
| group／Pack／weight | 肉鸽、联合等配置，分别保留有 group 的候选与仅有关联 Pack 的项 | 证明需要研究选择及关联；具体算法由真实路径决定 |
| 空 key 的随机候选 | `rogue1_1-1 /waves/0/fragments/0/actions/0`：ACTIVATE_PREDEFINED，key 为空、group=g1、weight=70 | 空 key 是实际候选数据；不能无条件将所有动作键收紧为非空敌人 ID，也不能由空值直接推断其执行结果 |
| 非 SPAWN | STORY、ACTIVATE_PREDEFINED、PREVIEW_CURSOR、DISPLAY_ENEMY_INFO、TRIGGER_PREDEFINED、DIALOG、PLAY_BGM | 不能只为 JSON SPAWN 建立完整字段解释 |
| forceBlockWaveInBranch=true | 本批无正例；部分较旧配置缺失字段 | **D 缺口**，不证明原生判断无用，也不自行补造内容 |
| ActionData.notCountInTotal=true | 本批 Action 全部缺失此字段；另存 EnemyData 覆盖为 true 的主线节点 | 两种结构不是同一份配置见证；N 的合并已核实，Action 侧非默认实际来源仍缺 |
| randomType／refreshType 非 ALWAYS | 仅在 3 份排除模式字段对照中找到，本批其他来源未命中 | 证明非默认值存在，不自动提出 Core 需求；其实际周期策略消费仍为 U |
| extraMeta／actionId／useExtraRoute／isValid | 原始 Action 样本多不提供；运行时生成、预处理和排队链另有 N 证据 | 运行时写入不是静态配置缺失，不能以 JSON 未出现推导无语义 |

79 份非生息样本中，managed=false 有 3 项、blockFragment=true 有 41 项、dontBlockWave=true 有 69 项；隐藏组非空 318 项、group 非空 327 项、Pack 非空 332 项。排除模式的字段对照独立统计，不纳入通用机制支持清单。数字枚举原值也保留，不凭声明顺序转换为名称。

## 8. 独立判断项目职责

依据是上文已追踪的行为，不按原生类名、字段名或当前项目目录分配职责：

| 工作 | 所属职责与边界 |
| --- | --- |
| 解释敌人键／alias／动作类型、时间与路线引用 | Data 适配原始描述并绑定内容定义；不能将一个 key 统一解释成敌人 ID |
| 预先确定本轮阵容、读取保存的有效位置和剩余预算、改写模板 | 由对应输入准备／Meta 或玩法适配负责；先理解其最终输出，不能因不是 Core 就不研究 |
| 战斗中选择 Phase、按条件触发出怪、组织附加效果 | 由实际战斗领域与 Content 程序协作；不能将所有随机选择一律提前到 Meta |
| 逐 Tick 推进、当前动作完成、波次／最终等待、实例退出账务 | Core 的通用调度与生命周期语义；管理、计数和阻波是不同事实 |
| 敌人信息载荷中的专属强化或特训程序 | 解释为具体内容事实／初始化或登记程序；不直接让 Core 理解卫戍 EnemyInfo |
| 原生音画动作 | 表现与控制流程分开审视，保留实际影响调度的完成／阻塞语义；不机械搬进战斗能力模型 |

卫戍本轮阵容随机已明确属于 Meta；这个结论不决定普通关卡、Branch 或战斗中随机出怪的归属。另一方面，原生存在字段也不意味着 Core 必须保留同名字段。应在原生解释与最终调度输入的关系清楚后，再设计最小的通用类型。

## 9. 当前仍未闭合的事项

1. randomType／refreshType 的具体周期策略消费者及其产生外部有效项／刷新结果的完整链。已追踪的通用预处理和最小额外字段处理没有闭合这点；不得按枚举名称补出规则。
2. forceBlockWaveInBranch=true 与 ActionData.notCountInTotal=true 的实际非默认内容来源；已有原生分支与 EnemyData 见证不能代替这两项自身的配置／生成见证。
3. 个别 Branch、隐藏组、其他 Wave 标签及外部重载的实际内容调用者、参数和激活条件；静态入口差异已证实，不把每个公开入口都宣称为本季实际可达。
4. XLua 实际覆盖、运行时动态配置开关当前取值和跨协程精确唤醒顺序。记录静态条件及分支，不宣称所有线上版本逐帧一致。
5. 非空 key 的 EMPTY 项如何避免进入未注册对应执行器的普通队列；空 key 清理、类型存在和外部路线模板可读取 EMPTY，均不能代替这条实际流转证据。

这些缺口分别属于策略消费、内容见证和运行时绑定，不能笼统写成“整个 Schedule 不能设计”，也不能宣布字段研究全部闭环。本轮建立通用语义及证据矩阵，不压缩 Core 类型，不从当前样本默认值推出固定政策。
