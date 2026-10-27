# Tactical 内容接入

Core 表达通用作战规则，内容模块表达角色行为，数据适配层解释客户端原表。保持官方可观察的玩法语义，不要求复刻官方类结构、旧版本字段布局或早期干员程序的内部组织。

## 数据与行为

干员的静态角色模块通过 ESM 导入，组合 Capability、Effect、Hook 和 Action。选择精英阶段、等级、潜能、信赖、技能等级／专精及模组后，数据层提供规范化的配置结果；角色模块据此产生具体 Definition。它们不通过字符串动态装载技能或 Effect 程序。

敌人的模板等级和关卡覆盖先在数据边界合并。`m_defined`、潜能的零基 rank、原表天赋候选覆盖、模组数据槽等历史表示不进入 Core。未实现的内容规则应在内容入口明确拒绝，不能静默丢弃。

Meta 可以选择配置或提供关卡输入。卫戍的普通／金色等政策由 Meta 映射到内容配置，不能替代主模式等级／潜能模型。费用、再部署时间等可由上层玩法使用，不因数据层读取了这些值就视为 Tactical 已实现相关政策。

## 内容目录与共享规则

每种敌人拥有独立的内容模块，例如 `enemies/hound.ts`、`enemies/crossbowman.ts`。具体模块负责自己的创建入口、特殊行为及所用弹道；确实共用的地面能力装配和攻击时序可以由普通函数提供。场景选择敌人和配置波次，不通过一个带敌人 ID 分支的中央工厂构造所有内容。

装置行为位于 `devices/`。`crate.ts`、`shooting-platform.ts` 接受类型化配置并构造 Unit Definition，通过 Unit 的 enter／leave Hook 处理改格和清理；实际共用的改格函数放在 Content 内。射击台在 Occupancy 的 SUPPORT Definition 中提供 occupantAdded／occupantRemoved Hook，为当前乘员安装独占的禁阻挡 Blocker.Rule，解除登记或消失时清理自身规则，不改写地块阻挡许可。Data 只解析资源与关卡实例，并根据资源标识选择工厂，不在运行程序中按 Prefab Key 决定业务。内部批量登记交换用于验证结构与同步通知，不能证明游戏允许自由搬动平台。

干员按职业、分支、干员组织：`operators/defender/unyield/mudrock.ts`、`operators/guard/fearless/melantha.ts`。职业目录负责分类；分支共享模块表达共同特性和默认行为；具体干员显式组合这些函数，接入自己的天赋、技能及模组变化。该目录结构不要求建立模板继承、中央分支注册表或逐层转发工厂。只有出现实际共享规则时才建立对应模块。

例如，不屈者的友方普通治疗限制和 UNY-X 模组的阻挡来源减伤属于分支规则；泥岩的护盾、扣盾自疗、萨卡兹减伤和二技能属于个人内容。分支函数继续读取规范化 Profile 中的阻挡容量、攻击间隔和范围，不按职业或分支名称硬编码所有配置下的数值。数据表的职业／分支标识用于分类和配置核对，不承担动态选择行为程序的职责。

## 状态与登场

Definition 保存静态配置和纯内容函数，Unit 保存运行时身份、Capability 状态和 Effects。角色无需手工构造标准 Capability State；通用初始化工厂根据 Definition 自动装配它们。

Unit Definition 必填 hooks 数组，静态声明 enter、tick 和 leave 阶段的 Hook；没有生命周期程序时使用 []。Unit 实例不保存另一份 Hook 数组。初始对象、部署、刷怪和预定义出现按输入顺序逐个完成创建、登记、Skill 入场和 enter Hook；下一对象接续前一对象的最新 BattleState，不预先创建后续实例。

battle/unit.add 在 Skill 入场后读取最新 PRESENT Unit 并直接派发 enter Hook；advance 在阶段开始时固定 Unit 候选，本轮新创建的单位下次参与，轮到单位时读取最新 PRESENT 实例并派发 tick Hook。每次派发固定 Context；enter／tick 每项前确认宿主仍为 PRESENT。leave 在注销后使用开始离场时捕获的 Departure，保留清理前 SP 等事实，不查询已经删除的宿主。跨同步操作后当前运行状态仍需重新查询。具体契约见 [Unit 生命周期](deployment.md#unit生命周期-hook)。

具体 Unit 可以直接增加自己的运行时字段，例如 Boss 阶段与转阶段截止时间。Unit 的 tick Hook 位于部署、刷怪之后，Effect、技能与行动推进之前；需要立即响应伤害或行动结束的阶段变化仍由对应领域 Hook 或内容程序执行。单位行为推进不代替各 Capability 的独立推进，异常直接向外抛出，Tick 成功后才发布新状态。

低层 Battlefield 变换不执行角色程序。伤害、治疗、Skill 和 Effect 等完整结算继续使用显式的纯状态传递；Runtime 承担外部推进和 Tick 发布。

完整 battle/unit.add、update、remove 根据受影响登记格的承载差分，只向对应 SUPPORT 派发 occupantAdded／occupantRemoved Hook。候选和关系 Context 在通知时固定；Removed 可以携带已移除对象的历史值，Added 每项确认当前组合仍然有效。具体当前资格始终从最新 battle 查询，不将历史通知重新写成当前状态。通知不轮询，也不因仅更新乘员 Rule 而重复派发，完整契约见 [Occupancy](occupancy.md#同步登记通知)。

## 语义证据与项目政策

显著影响游戏结果的规则应核对客户端实现、原表及可信的玩法资料。工程上可以用一个 Effect 表达层数护盾，只要扣层、挡伤、治疗和启停行为符合已确认语义，不必照搬内部 Buff 分工。

泥岩二技能的自动触发范围与技能范围相同，满足条件时不等待普通攻击周期；护盾消耗殆尽不移除充能机制。依据：[PRTS 泥岩](https://prts.wiki/w/%E6%B3%A5%E5%B2%A9)。该页面是玩家整理的行为资料，不能把它等同于原生调用链证据。盾挡伤后自疗及取消伤害不撤销已完成副结算，另有 [嵌套结算调查](../research/cases/03-dispatch-and-nested-settlement.md) 的原生调用证据。

当前代表性内容检查范围为泥岩二技能、无模组／X 模组，玫兰莎一技能、猎狗与弩手。Y 模组及其他技能未实现时明确拒绝。

以下细节尚未获得完整原生证据，样例采用明确的确定性约定，不能宣称与客户端逐帧一致：

- 护盾充能周期持续推进；满层时不累积额外层数。
- 二技能眩晕按实际结算目标独立抽样，随机状态在每次取样后立即传递。
- 受击回复使用 Core 的伤害结算时点；盾挡伤保留本次受击 SP。
- 练习场前摇、后摇、碰撞半径、弩箭弹速和路线布局是显式场景配置。

这些约定放在具体内容／场景和研究记录中，Core 不增加泥岩或敌人 ID 兼容分支。若后续证据推翻某项语义，修改对应内容政策并补上可观察结果测试。

## Unit 与 Capability 的类型约束

具体角色 Definition 必须声明实际依赖的 Capability，工厂输出保留标准状态与配置的对应关系。Effect 的 Host 泛型用于表达回调读取哪些能力。

基础 Unit 只声明身份、生命周期、Definition、位置和 Effects。每个 Capability 同时声明自身的配置与运行状态；业务通过 `Unit & Vitality & Offense` 等组合表达需要的能力。初始化工厂由具体 Definition 推导所创建的标准状态，异构战场查询则通过 `hasX` 收窄为实际需要的能力。能力集合用于装配和快照投影，不作为基础 Unit 的可选字段聚合。

局部更新返回新的 Capability State；完整 Unit 写入接受具体的 Unit 组合，只返回结算后的 BattleState，不承诺任意输入子类型在更新后仍成立。统一构造入口建立能力配对，登记后能力组成保持稳定，内部操作遵守这一契约。类型系统无需枚举所有能力组合，也不通过所有权品牌或防御复制证明内部调用者的不可变约定。
