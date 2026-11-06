# Scheduler ActionData 字段与 Meta／Schedule 边界

研究日期：2026-11-07。逐项核对客户端的 24 个 ActionData 字段，区分原始关卡配置、预处理结果与出生选项。不修改 Data、Core 或测试，不把字段名当成已确认的行为。

目标仍为卫戍协议。其他玩法的按日、按季刷新不列入支持需求。N 表示当前客户端普通原生分支直接证实，D 表示固定版本配置直接证实，U 表示仍未闭合。静态方法不能证明运行时没有 XLua 覆盖。

## 1. 来源和覆盖

- [字段补核证据](../evidence/scheduler-action-fields-20261107/README.md)：字段布局、出生选项、初始化／预处理、卫戍模板替换、配置摘录与统计。
- [Scheduler 执行证据](../evidence/scheduler-native-20261107/README.md)：Action 展开、Fragment／Phase 队列、隐藏组、分支选择和调度账本。
- [主波次与分支配置](../evidence/schedule-level-structure-20261106/README.md)：H8-1 与卫戍模板的具体结构。

配置镜像固定为 `Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。本批选取 act2autochess 目录全部 6 份文件，以及 act1autochess 排除地图、训练和 enemy_data 后的 33 份文件，共 39 份、473 条主线／分支 Action。此集合包括候选模板及地图，不能将文件数当作本季实际启用关卡数。

出现 449 条 SPAWN、24 条 ACTIVATE_PREDEFINED；所有动作都有 19 个相同的配置字段。以下五个客户端字段在本批 JSON 中均未出现：`useExtraRoute`、`isValid`、`notCountInTotal`、`extraMeta`、`actionId`。这是本批输入与运行时结构的区别，不是对所有客户端 JSON 的序列化规范作全局断言。

## 2. 逐字段契约

| 字段 | 客户端类型 | 已核实的消费、生成与条件 | 本批原始配置 |
| --- | --- | --- | --- |
| `actionType` | ActionType | N：选择执行器。SPAWN 与 PREVIEW_CURSOR 按 count 展开；其他已追踪类型只排一个动作。不能统一按 count 重复所有 Action。 | SPAWN 449；ACTIVATE_PREDEFINED 24 |
| `managedByScheduler` | bool | N：出生后是否参与 Scheduler 的管理登记；还受计数资格及实例资格约束，不是“所有统计都开启”的总开关。 | 全部 true |
| `key` | string | N：按 actionType 解释。SPAWN 查 enemyMap；ACTIVATE_PREDEFINED 交给 TryActivePredefined，按预置实例 alias／隐藏卡入口处理，不是敌人 ID。 | 43 个不同值 |
| `count` | int | N：SPAWN／PREVIEW_CURSOR 的重复数。卫戍模板准备还会重写 SPAWN 的 count。构造器默认 1。 | 1—10，共 8 种值 |
| `preDelay` | float | N：与 Fragment／Phase 的 preDelay 相加形成动作偏移；SPAWN 首次排队偏移再扣除 Prefab 的 delayToBorn，限制不小于 0。 | 56 种值 |
| `interval` | float | N：重复项 i 在首次排队偏移上加 i×interval。卫戍替换 count 时也会重算 interval，不能只替换敌人键和数量。 | 29 种值 |
| `useExtraRoute` | bool | N：_DealAction 根据 fromBranch 写入，主线为 false、分支为 true；出生时据此选 routes／extraRoutes，也参与分支出生选项判断。 | 未出现 |
| `routeIndex` | int | N：对应路线数组的索引；SPAWN 与路线预览使用。不能单独脱离路线数组解释。 | 28 种值 |
| `blockFragment` | bool | N：增加待完成动作数；执行器通过完成回调扣减。SPAWN 不等敌人死亡。有未来动作的队列即使全为 false，仍须执行完队列。 | 全部 false |
| `autoPreviewRoute` | bool | N：SPAWN 排队时追加 PREVIEW_CURSOR 辅助动作，复制路线和分支选择；不是敌人实例的移动规则。 | true 46 条 |
| `autoDisplayEnemyInfo` | bool | N：SPAWN 排队时追加 DISPLAY_ENEMY_INFO 动作，沿用敌人键；不是是否将敌人计入图鉴／击杀总数。 | true 25 条 |
| `isUnharmfulAndAlwaysCountAsKilled` | bool | N：传入 Enemy.Options.unharmful；只有主线出生才同时传入 alwaysCountAsKilled，分支路径将后者置 false。不能把它理解成所有路径均同步设置两项。 | true 12 条 |
| `hiddenGroup` | string | N：null 直接放行，否则须存在于 enabledHiddenGroups。初始化先加入启用组，再排除禁用组。出生后还复制到 Options.hiddenGroupKey；不是战斗中的隐匿效果。 | 全部 null |
| `randomSpawnGroupKey` | string | N：Phase 路径按该键收集候选；主线另有 RandomGroupSchedulerPreprocessor，作用域和处理方式不同，不能直接套用 Phase 解释。 | null 459；local 14 |
| `randomSpawnGroupPackKey` | string | N：Phase 中选中项的非空 Pack Key 可使关联项有效；主线预处理另有未选项及关联项删除流程。Pack 不是固定表示“同 Pack 必互斥”或“各路径必一起启用”。 | null 459；1 共 13；50 共 1 |
| `randomType` | RandomType | N：_DealAction、已追踪的 Phase 选择与卫戍替换不读取此字段。D：本批全部 ALWAYS。其他取值的实际消费未核实，不据枚举名实现其行为。 | 全部 ALWAYS |
| `refreshType` | RefreshType | N：上述已追踪执行链不读取此字段。D：本批全部 ALWAYS。其他取值的实际消费未核实，不把它当作 interval 或队列刷新频率。 | 全部 ALWAYS |
| `weight` | int | N：Phase 的加权选择读取；选择先于 count 展开。主线 RandomGroup 预处理也读取，但不能由此认定所有玩法共用同一选择协议。 | 0 共 443；50 共 29；1 共 1 |
| `dontBlockWave` | bool | N：禁止该出生项进入当前波的阻塞集合；不表示不计总数，也不自动排除全场结束集合。 | 全部 false |
| `forceBlockWaveInBranch` | bool | N：分支默认不阻塞当前主波，本字段允许取消这一默认豁免；若 dontBlockWave=true，仍不阻塞。 | 全部 false |
| `isValid` | bool | N：构造器默认 true；Phase 选择改写并据此建立有效列表；DataDriven 预处理也会初始化／修改。不等同于 hiddenGroup 是否启用，也不是输入数值校验结果。 | 未出现 |
| `notCountInTotal` | bool | N：对非空敌人键，_NotCountInTotal 将本字段与 EnemyData.notCountInTotal 作 OR；影响计数及管理登记。与 unharmful、dontBlockWave 独立。 | 未出现 |
| `extraMeta` | object | N：传入 Options.actionExtraMeta；是否为 null 还参与分支的 isSummon、dontCountAsFinished 计算。U：目标玩法中非空载荷的实际生成者、具体类型和下游解释仍未闭合。 | 未出现 |
| `actionId` | ActionID 值类型 | N：含 subSchedulerI／waveI／fragI／actionI；DataDriven 预处理按位置生成并匹配外部结果。是动作位置标识，不能当成敌人实例 ID 或每次出生 ID。目标普通执行链未用它决定排队时刻。 | 未出现 |

原生构造器显式初始化 `managedByScheduler=true`、`count=1`、`isValid=true`。OnAllocate／OnRecycle 的普通方法体为空；Duplicate 使用 MemberwiseClone。不能假定复制时自动清空运行时标记、附加载荷或位置标识。

## 3. 出生选项的准确关系

以下是 `_DoSpawn.MoveNext` 的普通路径，不是新增项目策略。设 B 为 `_DealAction` 写入的分支标记，M 表示 extraMeta 非空，N 表示 `_NotCountInTotal(action)`：

```text
不阻塞当前波 = dontBlockWave || (B && !forceBlockWaveInBranch)
unharmful = isUnharmfulAndAlwaysCountAsKilled
alwaysCountAsKilled = !B && isUnharmfulAndAlwaysCountAsKilled
isSummon = B && !M
dontCountAsFinished = (B && !M) || N
actionExtraMeta = extraMeta
actionData = 当前 ActionData
sourceScheduler = 当前 Scheduler
```

`managedByScheduler` 与 `_NotCountInTotal` 再控制本波／全场集合登记。完成计数、死亡时是否按击杀统计和波次阻塞不是同一个开关。

这纠正了此前“extraMeta 只是任意附加信息”和“isUnharmfulAndAlwaysCountAsKilled 总是同时打开两项”的过简解释。extraMeta 的具体业务类型尚未知，不妨碍确认其 null／非 null 已具有行为差异；也不能因此将非空值静默丢掉。

## 4. 主线随机与 Phase 随机不能混写

Phase 路径先将具有 groupKey／packKey 的动作标为无效，每组按权重选 Action，再依据选中项的 Pack Key 收集关联项，最后按原列表重建有效列表，之后才展开 count。本批卫戍 Branch 没有随机组，相关非空配置均在主线。

主线的 `RandomGroupSchedulerPreprocessor.DoPreprocess` 只收 SPAWN、ACTIVATE_PREDEFINED、EMPTY 候选，以 Wave、Fragment、groupKey 组织索引，并有移除未选动作及关联 Pack 的后处理。其实现不同于 Phase 的 isValid／有效 Pack 收集，不能借 Phase 结论替代主线证据。

但当前 AutoChessGameMode 类型没有 GetSchedulerPreprocessor 原生重写，构造器继承 DefaultGameMode；DefaultGameMode.GetSchedulerPreprocessor 普通路径创建 DefaultSchedulerPreprocessor，后者 DoPreprocess 普通路径为空。AutoChessGameMode.PreprocessLevelData 的普通路径也没有配置修改，存在 XLua 入口。尚未证明卫戍运行时是否替换这些入口，或主线的 local 配置是否参与实际抽选。

一个具体反例是 `level_act1autochess_h08_01.json` 的主线 actions[7]／[8]：两项敌人不同，但同为 groupKey=local、packKey=1、weight=50。仅凭两个权重相同，不能宣布“二选一”；更不能将它交给 Phase 选择器并宣称是同一机制。

因此本案关闭的是字段布局、已追踪消费和配置取值问题，尚未关闭的是目标玩法主线随机选择的实际入口。这个原生问题影响 Meta 如何准备本轮敌人集合，不能用项目实现或人工触发测试补证；但它不是战斗内 Schedule 的设计前置。

## 5. 卫戍模板准备

`RandomEnemyGenerater._GenerateRoundEnemyData` 加载模板后调用 `_DoReplaceLevelDataClient`；后者沿主 waves 中的 Action 执行 `_DoReplaceActionDataClient`，不等于把所有 Branch 也无条件生成。

选定替换敌人后，程序根据原 count、属性／战斗效能计算新 count，设置新 key，并令新 interval 等于 `旧 count × 旧 interval / 新 count`。因此这些原始字段在模板上可能是生成预算，而不是最终实例参数。

## 6. 项目分层与未决研究

按[项目架构](../../architecture/ARCHITECTURE.md#meta-与-arkbattle)及本轮用户明确的边界：

- **Meta** 负责本轮主线的随机选择、阵容与模板准备，产生本场战斗输入。主线随机不能因原生实现位于某个 Preprocessor 类，就被迁入 ArkBattle Schedule。
- **Data** 适配原始描述、提供内容定义与转换能力；字段研究为正确解释资料服务，不意味着 Data 或 Core 必须承担原生客户端全部准备职责。
- **Schedule** 接收已经确定的本场出兵配置，负责 Wave／Fragment／Action 的推进、战斗期间的 Branch 执行、等待及完成账务。战斗中触发 Branch 与战斗前选择本轮阵容分别归属，不能一起推回 Meta。

仍保留的原生研究问题：

1. **卫戍主线随机的真实消费入口**：实际预处理器／热更新绑定、local 组与 Pack 的消费尚未闭合。它属于 Meta 原生准备流程的研究，不阻塞 Schedule 主体设计，也不要求 Schedule 预留原生随机字段。
2. **目标玩法的非空 extraMeta 来源**：载荷生产者、类型和下游解释仍未闭合。不能将原生 object 当成项目必须透传的输入；后续应核对其中是否存在尚未表达的战斗事实，以及该事实归属。已证实的计数、召唤身份、阻波差异可分别审视，不必等待整个原生载荷系统复刻完成。

randomType／refreshType 非 ALWAYS 的规则不在本批卫戍配置中，且不在目标已追踪执行链消费。此处只记录证据边界，不研究范围外刷新机制，也不自行决定导入器对未来未知值的接受策略。

本案不宣称完整复刻原生 ActionData。现有证据足以开始 Schedule 的职责和类型设计；尚未闭合的 Meta 准备问题不能被列为 Schedule 的阻塞项。具体输入仍应围绕需要表达的战斗语义设计，不能将 24 个客户端字段机械复制成项目静态 Definition，也不能仅因原生有字段就为它新增接口。
