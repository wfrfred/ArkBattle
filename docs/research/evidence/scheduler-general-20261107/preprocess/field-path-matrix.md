# ActionData 构造、预处理与附加载荷：独立核对

日期：2026-11-07。本文件为独立证据摘录；不决定 Data／Content／Core 的职责，也不改变支持模式范围。N 表示本次静态普通原生分支直接可核实；I 表示结合字段布局和调用关系的推断；U 表示尚未闭合。未执行客户端，未确认运行时 XLua 替换或某份内容实际走到所有分支。

## 字段／路径矩阵

ActionData 的偏移均为对象偏移。完整布局见 `../../scheduler-action-fields-20261107/action-types.json`；Enemy.Options 值类型偏移采用 unboxed。

| 字段 | 构造／复制 | 转为调度输入的已证实路径 | 限制 |
| --- | --- | --- | --- |
| `randomType` (+0x50) | N-P01：构造无额外写入；N-P02：MemberwiseClone 一并复制 | 在本次完整追踪的 Default／RandomGroup／DataDriven、Phase Fetch 与 SandboxV3 最小随机生成候选中未找到该字段的直接读取 | U-P01：不能据此说全客户端忽略，也不能从 ALWAYS 配置样本推出通用规则；如何转成输入随机结果／valid／count 仍未闭合 |
| `refreshType` (+0x54) | 同上 | 同上；尤其 SandboxV3 的 `DoLevelDataRandomGroupProcess` 只见 group／weight／位置选择，不能填补刷新周期语义 | U-P01：PER_DAY 等枚举名不等于已经证明刷新时机；不得解释为 Action 队列刷新频率 |
| `randomSpawnGroupKey` (+0x40) | 引用浅复制 | N-P03：DataDriven 仅对 type 0/6/13、已 valid、group 或 pack 至少一个非空的动作按位置结果判定；N-P08：Phase Fetch 另在 Phase 内按 group 抽选；N-P09：RandomGroup 是主线 wave/frag/group 删除算法 | 这些入口不能混为同一随机算法；调用存在不证明每份内容会用 |
| `randomSpawnGroupPackKey` (+0x48) | 引用浅复制 | N-P03：本 Fragment 中已选且 pack 非空的动作贡献 pack key；第二遍可将同 pack 的 invalid 动作重新设 valid；N-P08：Phase 同样有选中 pack 的关联启用；N-P09：主线 RandomGroup 采用删除未选及关联项的路径 | DataDriven 第二遍只检查 invalid、pack 非空和 pack 集合命中，未再次限制 actionType；不得缩写成每个 pack 独立抽一个 |
| `weight` (+0x58) | 构造无显式非零初始化；N-P02浅复制 | N-P07：`get_weightValue` 直接 int 转 float；N-P08/N-P09用于各自随机选择；N-P10 SandboxV3 候选也把本字段转 float 写入随机候选记录 | 不直接决定时间；抽选策略需注明入口 |
| `isValid` (+0x5e) | N-P01 默认 true；N-P02复制当前值 | N-P03 初始化重置 true；valid 输入、single killed count、remain budget、empty key 均可改变；N-P06 按其删 Action 并重建数组；N-P08 Phase 也筛选；N-P11 队列执行器还在执行前直接读取 false 并跳过 | 是实质性执行门槛，不能当成仅给预处理器看的诊断字段；不同路径不总是删除对象 |
| `extraMeta` (+0x60) | N-P02 引用浅复制 | N-M01：卫戍 Self／Help／Boss 生成器写入三个 EnemyInfo 子类型对象；N-M02：`_DoSpawn.MoveNext` 将它写到 Options.actionExtraMeta，且 null 差异参与分支身份／完成计数；N-M03：卫戍 OnEnemyRegistered 读 Options.actionExtraMeta，按 EnemyInfo 判断 isSpecial／effectInstId，条件成立时 AddBuffById | 原生 object 已有具体业务载荷，既不是无语义注释，也不直接等于项目必须原样承载的公共接口。完整三种载荷的所有业务用途仍未穷举 |
| `actionId` (+0x68，16 bytes) | 值类型四整数；N-P02值复制 | N-P03：`_InitValidation` 写 `(subIndex,wave,frag,action)`；构造有效结果与匹配 valid/single count 时，另构造 `(0,wave,frag,action)` 的比较键；N-P04/P05 改 valid/count，最终 N-P06 改数组 | 不是每个出生实例的新 ID；预处理删除后保留的是原位置值，不重新编号。外部三整数结果的外围来源及全部子调度调用约定未闭合 |
| `count` (+0x20，补充) | N-P01默认 1；N-P02值复制 | N-P04 减单 Action killed count；N-P05 按 key 依序消耗 remain budget；随后无效项删除，再由调度层展开重复动作 | 两条外部 count 路径处理范围不同，不能合并成单一 max(0,count-killed) 公式 |

## N-P：构造与预处理定位

- **N-P01**：ActionData `.ctor`，index 32183，VA `0x182460e50`；`+0x14=true`、`+0x20=1`、`+0x5e=true`。其余本次关注字段没有额外构造写入。来源：旧批 `action-fields-bodies.json`。
- **N-P02**：ActionData `Duplicate`，32182，`0x182460dca` 调 `0x186176520`，元数据别名包含 `System.Object.MemberwiseClone` 与 `System.Delegate.Clone`；接着类型检查。这里不把共享地址别名当两个操作。ActionData 是普通对象，I：MemberwiseClone 对引用字段为浅复制、对内嵌 ActionID 为值复制。来源同上。
- **N-P03**：DataDriven `.DoPreprocess`，73600，`0x18099eb20..0x18099ebc4` 的次序为 Default → InitValidation → 有非空 valid 输入才 ProcessValid → 有非空 single-killed 输入才 ProcessSingleCount → 有非空 remain 输入才 ProcessCount → ProcessEmptyActionKeys → DeleteInvalidActions。`_InitValidation` 73601 在 `0x18099f646..0x18099f66a` 生成四整数并写 `+0x68`，同时重置 `+0x5e=true`。`_ConstructorImpl` 73597 在 `0x18099f0e6..0x18099f15f` 将至少三元素的输入列表前三个数放入 wave/frag/action，subScheduler=0。`_ProcessValidActionsViaInputResults` 73603 在 `0x1809a02a4..0x1809a0439` 执行上述 type、group/pack、位置匹配与 pack 启用。
- **N-P04**：`_ProcessActionSingleCountViaInputResults`，73605，`0x18099fc93..0x18099fd3f`：仅已 valid 的 type 0/13/6；命中 `(0,w,f,a)` 后 `count -= inputKilledCount`，`isValid=(count>0)`。此方法没有将负数 count 钳为 0，也不要求 group 或 pack 非空。
- **N-P05**：`_ProcessActionCountViaInputResults`，73604，`0x18099f903..0x18099f9ba`：仅已 valid 的 type 0/6 且 key 非空；若 key 命中，则 `count=min(count,remaining[key])`，`isValid=(count>0)`，写回 `remaining[key]-=count`。同 key 的多个 Action 按 wave/frag/action 遍历顺序共享并消耗预算。
- **N-P06**：`_ProcessEmptyActionKeys`，73606，`0x18099ffc3..0x18099ffd2`：只查 key 的 IsNullOrEmpty，空则 invalid。它**不读取 actionType，也不按 EMPTY=13 清除**。`_DeleteInvalidActions`，73602，`0x18099f3ac..0x18099f40e`：从后向前删除 `isValid=false` 的项，只有长度变化才把列表转数组写回 Fragment.actions。源码中非空 key 的 EMPTY 不能由此步骤解释。
- **N-P07**：`get_weightValue`，32181，`0x182460e70..0x182460e78` 直接读取 `weight` 并转 float。
- **N-P08**：Branch Phase `FetchActionsWithRandomSpawn(true)`，32193，旧批 `random-bodies.json`：`0x18247017c/194` 初始化 valid；`0x18247025b` 启用所选 Action；`0x182470320..0x182470351` 传播 pack 后筛选返回。它是每个随机组抽 Action 后启用选中 pack 的路径，再由调度展开 count。
- **N-P09**：`RandomGroupSchedulerPreprocessor.DoPreprocess`，73623，旧批 `action-fields-bodies.json`：分 wave/frag/group 收集并取权重，`0x1809a3bae` 取随机源，后半段按未选动作及 pack 关联删除。不得将其写成 Phase Fetch 的 isValid 返回列表算法。
- **N-P10**：`SandboxV3.SandboxV3BattleUtils.DoLevelDataRandomGroupProcess`，90907，`0x180ebc433..0x180ebc4bb` 只选择 type 0/6/13、group 非空，读取 weight，收集位置；后段按组取一个并输出 wave/frag/action 索引列表。完整所选普通 body 不读 ActionData.randomType/refreshType；这是最小候选核对，未展开模式玩法。
- **N-P11**：DefaultWaveHandler `<ExecuteActionQueue>d__26.MoveNext`，73387，`../native-paths.json`：`0x1809895e2` 读取 ActionData.isValid，false 跳过执行并推进队列 offset/cursor；`0x18098962c` 后才按 actionType 取执行器。EMPTY=13 没有注册普通执行器不能反推为空操作，注册列表需联查旧批 `_RegisterActionExecutors`。

N-P03、P04、P05、P06、P07、P10的新完整方法在 `preprocess-bodies.json`。旧批路径相对于本目录是 `../../scheduler-action-fields-20261107/` 与 `../../scheduler-native-20261107/`。

## N-M：extraMeta 的真实生产与消费

**N-M01：ActionData.extraMeta 的直接生产。** `autochess-action-meta-producers.json` 保存三个完整方法。`meta-types.json` 从本次 IL2CPP GenericClass / GenericInst 直接展开它们的 List 参数，保留原始指针与类型记录：

| 方法 | 枚举输入类型 | 写 ActionData.extraMeta 的指令 |
| --- | --- | --- |
| `_GenerateSelfBattleEnemyData` (81510) | List<SelfEnemyInfo> | `0x180bf3431 mov [rax+0x60],rdi` |
| `GenerateHelpBattleEnemyData` (81511) | List<EscapedEnemyInfo> | `0x180bf0728 mov [rax+0x60],rsi` |
| `GenerateBossBattleEnemyData` (81512) | List<BossBattleEnemyInfo> | `0x180bf00b9 mov [rax+0x60],rdi` |

三处写入前均已检查当前列表项非 null；Action 来自 `_GenerateAction` 或 `_GenerateActionFromEnemyInfo` 的返回值，写入后调用引用写屏障。三个子类型继承 EnemyInfo：基类含 `instId`、`enemyId`、`isSpecial`、`effectInstId`；Self 增 `actionIndex`，Escaped 增 `uidIndex/isToken/killedByPlayer`，Boss 增 `playerGroup/actionIndex`。Help／Boss 方法随后调用 `_ApplyRealActionData`；该方法 `0x180bf184a` 将生成的 Action 列表转数组写回选中的 Fragment.actions。此为静态存在的非空载荷生产路径，未声称观测到具体对局运行。

**N-M02：出生时进入 Options。** 旧批 `spawn-bodies.json` 的 `_DoSpawn.MoveNext` (73442)：`0x18098ec82` 取 ActionData.extraMeta；`0x18098eceb`、`0x18098ed3e` 做 null 检查，影响分支的完成计数／召唤身份；`0x18098ed75..0x18098ed83` 把该字段写到 Options 起点 `rsp+0x40` 的 `+0x18`，即 actionExtraMeta。`0x18098ed91` 另写 Options.actionData（unboxed +0x20）。二者不是同一字段。

**N-M03：已找到卫戍具体消费。** `AutoChessGameManager.OnEnemyRegistered` (81309)，`autochess-meta-consumers.json`：`0x180bd645e` 取 Enemy.options，`0x180bd646d` 读 unboxed +0x18；类型检查使用 `0x188ba8cb8` TypeInfo 槽。本次原始槽值 `0x2001a4e1` 的 encoded TypeInfo index 为 53872，解析为 `Torappu.Battle.AutoChess.EnemyInfo`（记录及解码见 meta-types.json / extract_preprocess_types.py）。随后 `0x180bd64cd` 检查 isSpecial(+0x20)，`0x180bd6525` 用 effectInstId(+0x24) 查询效果配置；通过后可在 `0x180bd6562` 调 Entity.AddBuffById。另已保留 `OnSelfBattleEnemyKilled` 的读取／快照调用，但未穷举全部战斗结算业务。

**N-M04：应单列的出生后改写。** `Enemy.SetExtraMeta` (77682)，`0x180ac3350` 写复制的 Options 起点 `rsp+0x20` 的 +0x18，再在 `0x180ac3395` set_options；确实是同一个 Options.actionExtraMeta 字段。直接调用候选只有 `BossRoundSpawnEscapedEnemy`、`_SummonFixedPositionEnemy`，已经在 `autochess-meta-bodies.json` 核对为正常指令边界。后者参数直接是 EnemyInfo。此路径证明 Options 字段可以出生后改写，**不能用它替代 N-M01 证明 ActionData.extraMeta 的来源**。

## U 缺口

1. `randomType/refreshType` 的全部非 ALWAYS 语义、刷新生命周期和外部输入生产者未闭合。所选原生路径没有读取证据，不是全客户端无消费的证明。
2. 非空 key 的 EMPTY=13 如何保证不会进入缺失执行器的普通队列，当前 DataDriven 空 key 步骤不足以解释；需结合实际内容／调用者。不能先把它定义为普通 no-op。
3. 各模式何时选择 Default／RandomGroup／DataDriven／Roguelike，及外部三整数结果的所有生产约定，仍需按目标内容核实。已经确认的字段消费不能作为所有入口都激活的证据。
4. EnemyInfo 载荷已证明有具体生产者／消费者，但没有穷举三个子类型的每个字段、所有消费路径或服务端协议；这些不妨碍撤销“卫戍中来源／具体类型完全未知”的表述。
