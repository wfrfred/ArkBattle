# PRTS 公共战斗机制覆盖审计

2026-11-14 的Vitality／Elemental／Damage／Healing完整补查以[案例37](37-resource-mechanism-coverage.md)为入口；原生证据、实际绑定和项目选择不再由本页初始概览代替。

本次从 PRTS 的机制目录检查公共需求是否遗漏，不重做各领域架构，也不将具体干员、Effect 种类尚未接入算作 Core 缺口。核对日期：2026-11-13；代码基线：`408ab7cf7e4fb9aa0332312bf11621e0368c7912`。

## 1. 范围与证据等级

阅读[游戏数据基础](https://prts.wiki/w/游戏数据基础)、[作战机制](https://prts.wiki/w/作战机制)、[特殊机制](https://prts.wiki/w/特殊机制)、[伤害分类](https://prts.wiki/w/伤害分类)、[衍生生命](https://prts.wiki/w/衍生生命)，再按问题查阅数值范围、技能、BUFF、异常效果、命中率、诱发移动及代表内容。

PRTS 是社区资料。本次直接核对页面，但未为每项重新提取客户端；下文分别注明 Wiki 规则、已有客户端证据、代码事实及待证实推断。页面版本不能视为同一客户端快照：《特殊机制》《伤害分类》《异常效果》注明 2.7.91，《数值范围》仍注明 2.7.81；《命中率》有施工警告。来源版本、固定链接目标、查阅范围和失败请求见[证据批次](../evidence/prts-mechanism-audit-20261113/README.md)。

调查覆盖通用战斗、普通关卡及其单位机制。生息演算、保全派驻、船运寻路等不纳入本轮；纯音画、教程、剧情指令不因此成为战斗内核需求。战前随机准备和局外配置归 Meta／Data，运行中的 Branch 随机与等待仍属于 Schedule。

## 2. 新识别的遗漏与待核实项

### 2.1 活 Unit 独立解除当前 Wave 等待：公共操作缺失

[火龙](https://prts.wiki/w/火龙)的返巢在指定路点解除当前波次关系，随后继续以睡眠姿态留场。这是普通活动战斗中的实际用例，不是死亡、撤退或波次超时。

已有[案例 30 第 5 节](30-scheduler-action-data-fields.md#5-四个争议字段与退出账务)及原始 `ReleaseEnemyFromCurrentWave` 提取已确认：释放当前波次不移除最终管理关系，也不增加完成计数。见[原始方法](../evidence/scheduler-general-20261107/lifecycle/ReleaseEnemyFromCurrentWave-0x18097f830.txt)。因此无需重新猜测这项原生能力是否存在。

当前 `schedule.resolveUnits()` 同时移除 `waiting.wave` 和 `waiting.final`；Wave 超时清理的是整组等待。两者都不能自然表达“只放行这个仍活着的 Unit，仍等待它最终结束”。预先使用 `FINAL` 又会过早放行，设置整波超时还会放行其他单位。状态结构已有两个独立集合，缺的是对应的合法领域操作，不能要求 Content 直接改 Schedule State。

这属于已有研究未落实到公共操作的遗漏。具体入口和批量形式留待架构审查，不据此增加新调度系统。

### 2.2 移动单位的历史面向：已确认的公共事实遗漏

[作战机制的面向章节](https://prts.wiki/w/作战机制#敌人朝向与相对方位)将移动、攻击转向及受推后的面向用于正背面判断。[眩光手雷](https://prts.wiki/w/眩光手雷)按目标是否背对爆点决定控制；火龙甩尾保留既有面向，断尾累计又读取背面伤害。这些结果会改变战斗，不只是模型展示。

定向[客户端核验](../evidence/facing-semantics-20261113/README.md)已补齐写入与玩法消费：`_MoveByCursor`、可转向的攻击、KnockBack 的指定分支写入面向；`MhPartHpHudPluginTalent._OnApplyedModifier` 读取宿主 `faceSign`，按方向决定是否累计部位生命，达到条件时调用 Buff.Trigger。这直接证明面向可影响战斗，不能因消费者名字含 HUD 就当作纯表现。

原生至少区分 `m_faceTo` 目标向量、`m_direction` 身体四向和 Animator 保存的左右符号；Unit 的有效 `faceSign` 通常读取后者。摄像机投影只位于 `_CalculateFaceDirection` 的条件分支，并非所有移动都投影，也不能说永远只看世界 X。两篇 PRTS 简述不能直接互换，更不能据此要求逻辑内核实现摄像机。

本次补核时 Unit 只有位置；`Occupancy.direction` 是部署四向；`Locomotion.velocity` 不能表示攻击转向后、停止运动时仍保留的面向。现有事实因而不能无条件还原这项公共输入。单个内容的部位计量可私有保存，但共同面向的维护不能默认交给每个内容轮询速度。后续[面向调查](35-facing-and-turning-conditions.md)补核资格、调用时点和实际内容，项目据此接入独立 [Facing](../../architecture/capability.md#facing)；世界 X 映射、初始化和动画边界为项目选择。

证据仍分档：本批核验的是 generic native 部位消费者，没有完成火龙 Prefab 到该 Talent 的绑定；PRTS 火龙／手雷是实际内容需求资料，不把两者冒充同一条已完整验证的配置链。

转向条件、实际调用时点与火龙绑定的后续补核集中在[案例35](35-facing-and-turning-conditions.md)，不再以本节的初始缺口清单代替后续结论。

### 2.3 单笔击杀结果已落实；原生独立归属仍需补核

[案例 28](28-damage-hooks-and-event-granularity.md)已结合案例 27 的客户端死亡链、苇草与炎客模组，确认来源击杀和旁观死亡是不同事实。项目的 HP Request.source 表示本笔伤害来源；最终 APPLIED.killed 报告本笔是否确认并请求目标死亡，Content 据此编排逐目标、累计或整次攻击的后继，不增加 Kill Hook。Unit.Departure 仍提供 Unit 快照和离场原因，既有生命周期观察承担相应死亡响应。

普通 Applied Hook 观察一次 HP 变化，仍早于本笔死亡确认；保护或嵌套结算可以改变其后结果。killed 位于完整 Apply 返回的 Outcome，不加入 Application 或 AppliedContext。其精确定义与必要回归见[单笔击杀契约](../../architecture/vitality.md#34-单笔击杀结果)，这是项目返回协议，不将其等同于下列原生事件实现。

来源栈生产者、同步嵌套恢复、锡人S1无来源伤害、嵯峨处决及阿米娅击杀回复已在[案例39](39-death-attribution-and-attribute-ranges.md)补核。原生捕获Context.source、来源Event9与目标Event29的不同资格，以及最终回收分开记录，不再用原先“只找到最终消费者”的证据边界代表当前调查。项目Outcome.killed仍是已确认返回协议，不等于已经表达所有原生独立归属。

## 3. 既有缺口需要写得更精确

| 已有项目 | 本次补充的需求边界 | 当前事实与判断 |
| --- | --- | --- |
| DMG-02 伤害分类／通知政策 | 攻击类型、施加途径和特殊标签是不同维度；原生还区分允许修改数值、允许闪避取消、允许抵挡取消等。[伤害分类](https://prts.wiki/w/伤害分类)、[特殊机制](https://prts.wiki/w/特殊机制) | Request 没有这些共同事实；`cancel()` 直接锁存取消。按来源 Unit、是否有 Projectile 或现有 DamageType 猜测均不可靠。需要细化既有 Damage 需求，不建立标签名对应的一批子系统。 |
| DMG-02 计算路径 | 缓存攻击数值后仍算防御，与直接应用已算定结果不同；拆分伤害还可不触发普通 HIT 回复。 | Calculate／Apply 可分别承担部分流程；独立HIT许可已由Request.hitRecovery表达；其余来源公式事件差异见案例38，不能将两个状态混称未实现。它不推翻项目 Calculate／Apply 边界。 |
| ATTR-02 属性范围 | [信仰搅拌机 X 模组](https://prts.wiki/w/信仰搅拌机#天赋)实际改变特定单位的攻速下限；[数值范围](https://prts.wiki/w/数值范围#数值范围覆写)将范围覆写与属性加算分开。 | 当前查询仍使用领域内固定限幅；单纯 Contribution 的数值修正不能完整代替可变上下限。早已有登记，不能从近期简短清单遗漏它就视为新发现。 |
| DMG-04 特殊 HP | 额外生命、负生命、非致命、不死、一次性保护、替身及最终死亡不是单一 HP 扣减的变种名称。 | [案例11](11-damage-apply-and-hp-application.md)已补齐实际生命／复活路径；当前普通commit尚未表达，不构成获准延期或简化。 |
| DMG-03／HEAL-02 流失与自回 | 伤害数学类别与是否经过接收／通知分开；自然回复与普通治疗分开。 | 本轮在[案例 11](11-damage-apply-and-hp-application.md)补充流失，在[案例 29](29-hp-and-ep-healing-settlement.md)补充自然回复，避免将本页概览冒充完整原生流程。 |
| 通用单位分类事实 | 实体种类、阵营、职业、FilterTag／GroupTag、敌人级别和攻击方式并不等价。 | [案例 36](36-unit-classification-and-combat-tags.md)已核对主要来源、消费者和实际内容绑定，记录仍未闭合的修改路径。当前部分查询仍依赖完整 Data Profile，公共资料归属尚待架构决定，不复制原生 Entity 类层次。 |

本表只说明需求，不决定照搬原生标志枚举。普通盾／闪避的程序如何处理，仍须服从项目已确认的有序 Receiving 与取消契约。

## 4. 分类覆盖表

“可组合”表示已有合法状态与操作足以承载该类需求，**不表示对应具体内容已经完成或全部交互已经验证**。

| 机制范围 | 归类 | 对现有接口的判断 |
| --- | --- | --- |
| 属性修正、Effect 分组、重复施加、竞争、叠层衰减 | 公共机制已有 | Contribution 与 Effect group／stack／Expiration 已分别承担；无需原生 Buff 脚本解释器。 |
| 抵抗缩短时间、周期触发、触发次数 | 可组合 | Effect expiration、rate 与私有 state 可表达；具体抵抗公式和采样属于所用程序，不因缺某种 Effect 就判 Core 缺。 |
| 光环、进入后保留、实时范围响应、全局进场响应 | 可组合 | 用 Effect 私有接收关联、Query、Unit Hook、scope；不能只用范围查询冒充已安装事实。 |
| 攻击级命中率、连击共用随机结果 | 可组合 | Action 私有 state 与 RNG 可以只采样一次，后续输出读同一事实；每笔 Damage 各掷一次不能冒充它。命中与取消权限的公共信息另归 DMG-02。 |
| 多目标、多段、附加 HP／EP、来源退场后命中 | 可组合 | Action／Projectile 决定顺序、样本与绑定；已定 Card 历史归属解决 Effect 来源身份。没有依据增加攻击整体事务。 |
| 普通仇恨、阻挡优先、特殊排序、分组回退、随机选取 | 可组合 | Query、目标侧限制、比较器、TopK 与 RNG；选择和命中／接收仍分别负责。 |
| 范围形状、中点／碰撞体／地格、动态范围扩展 | 已有部分能力／既有延期 | 几何基础可组合，完整动态范围资料和属性尚未接通；不改成新的 Targeting 过程协议。 |
| 隐匿、迷彩、反隐、免疫与异常组合 | 可组合，内容按需补 | Restriction 定义身份、Effect 有效状态、Rule 与 Hook 可承载；不把原生每个 flag 计作一个缺少的 Capability。 |
| 沉默、静默、睡眠及受伤唤醒 | 可组合，语义按内容核对 | 对 Action、Skill、Effect 分别安装限制／启用政策；“可影响沉睡伤害”涉及的共同 Damage 信息归 DMG-02。 |
| 充能、蓄力、弹药、二次触发、延长技能 | 基础能力已有 | Skill 私有状态、资源、Activation 与主动操作可承载；具体消费时点继续由真实内容验证。运行 SP 配置切换、基础弹药容量变更仍是已有延期。 |
| 敌人多技能、模式绑定、独立冷却与攻击竞争 | 可组合 | 多 Action 与内容条件可表达；不要求所有敌人技能映射成多个 Skill Capability。 |
| 自然回复、生命复原、物理／法术流失 | 既有公共缺口 | 见案例 11、29；不从“都是 HP 变化”推导它们经过普通 Healing／Damage Hook。 |
| 溢出治疗转屏障 | 原生资源交接已补核，公共提交存在差距 | [案例29](29-hp-and-ep-healing-settlement.md)核对ES许可、上限、偿债及临时监听；不能无条件以received−hpGain替代真正溢出。 |
| 特殊 HP、致死保护竞争、代受、复活／模式转换 | 原生及实际绑定已补核，架构差距待整体评估 | [案例11](11-damage-apply-and-hp-application.md)、[38](38-damage-classification-and-permissions.md)、[39](39-death-attribution-and-attribute-ranges.md)；不得将既有TODO等同已批准不实现。 |
| 推拉、失衡、重量与力度、受力中陷落 | 已有延期 | Locomotion 的自主运动不是强制位移的完整替代；不要求本轮新增每种位移 Effect。 |
| Fear、Attract、Trace、路线缓存与改道 | 公共机制已有，内容未齐 | 多 Route Context、ticking、显式指令与 Content 缓存支持；实际选择、失效与优先级由内容实现。 |
| 阻挡、空地切换、浮空及起飞组合 | 公共基础已有 | Blocker／Blockable／Layer 独立，合法 release 操作与 Rule 接入；具体异常组合不据此声称已全实现。 |
| 动态地形、连通区域、地块计量、环境机关 | 可组合 | Tile／Navigation 操作与 Mechanism 私有状态承载；特定机关未实现不代表缺通用机关框架。 |
| 放置、免费部署、特殊撤退再部署、多格设施 | 普通协议已有，特殊业务延期 | Quote、Card、Occupancy 和生命周期已分工；特殊再部署与多格登记仍需完整业务，不以瞬移代替。 |
| Wave／Fragment／Branch、预置、等待和超时 | 基础已有；发现独立 Wave 释放缺口 | 状态已分离 wave／final；活 Unit 仅释放 wave 的操作见 2.1。 |
| 击杀、漏怪、计数资格及关卡生命 | 已有延期；归属另待核实 | Schedule 等待不是完成／击杀统计；Core 不裁定胜负的项目边界保持。 |
| 位移累计触发伤害 | 证据待定，暂不判缺 | 特殊机制记载公共测距和跳跃过滤；Effect 可私有采样位置，但是否需要共享累计路程事实，须用重叠实例和完整运动时序证明，不能只因原生有计数器就新增模型。 |
| 剧情、音画、教程、局外养成及明确排除模式 | 不纳入本轮 | 不由 PRTS 目录条目存在推导 Core 实现义务。 |

各项的来源定位及对应代码路径另存[覆盖记录](../evidence/prts-mechanism-audit-20261113/coverage.json)。

## 5. 后续调查边界

1. 独立 Wave 释放的原生效果已有直接证据，可以进入操作审查；若核对火龙具体触发位置，只补 Content 调用者与关卡配置，不重复调查整个 Scheduler。
2. 面向已有最短写入与玩法消费链，具体项目近似、字段归属及内容绑定仍分别审查；独立击杀归属的后续结论见案例39，不宣称所有原生分支已经实机验证。
3. Damage 分类、选择性响应、属性上下限等回到既有项目条目细化，不用新的总框架遮住真实缺口。
4. 此清单是按目录和代表机制的分类覆盖，不是全客户端、全角色、全关卡的完整性证明。文档所称已有能力仍须按真实生产内容验证，不以测试夹具组合证明所有内容已接入。
