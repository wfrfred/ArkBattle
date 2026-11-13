# 内容接入

Core 表达通用作战规则并维护模拟状态，Content 提供具体内容的 Definition，Data 转换客户端静态资料。以重要的可观察玩法结果为依据选择工程结构，原生内部类与字段布局不直接决定项目 API。

## 数据与行为

Data 按 Unit、Skill、Action、Effect、Level 组织战斗需要的静态转换；Prefab 和动画是资料来源。Data 可以静态建图、组装 Definition 并调用已有工厂绑定参数，具体字段、换算与支持边界见[静态数据转换](data.md)。

Content 模块通过 ESM 导入，按规范化数据组合 Capability、Effect、Hook 和 Action，构造包含回调与初始化程序的完整 Definition。Core 根据 Definition 与本次 Initial 创建初始 State，再按明确的领域时点执行内容程序。Content 不自行推进模拟，也不在模块或闭包中保存本场运行事实；私有数据由其初始化程序返回，随实例保存在 Core State 中。内容不通过字符串动态装载技能或 Effect 程序。

Meta 可以选择配置或提供关卡输入。卫戍的普通／金色等政策由 Meta 映射到内容配置，不能替代主模式等级／潜能模型。未实现的内容规则应在内容入口明确拒绝，不能静默丢弃。

## 内容目录与共享规则

具体内容按角色目录组织，例如 `enemies/hound/`、`enemies/crossbowman/`、`operators/melantha/`、`operators/mudrock/`。action.ts 描述该角色的具体行动、目标条件、私有状态和输出程序；unit.ts 组装属性、Capability、天赋与行动选择策略。Unit 的 action.initialize 用 createActions 接续各项具体创建程序，运行时只维护 Actions，不另建静态定义注册表。Skill 只需一个聚合，Unit 的 skill.initialize 调用 skills.create(battle, programDefinition)；完整程序与元数据保存在当前 unit.skill.definition，Skill 回调使用显式 source 与聚合 self。

标准效果成品位于 `core/effects/`，控制、保护、可选中性程序分别由 [control.ts](../../src/core/effects/control.ts)、[protection.ts](../../src/core/effects/protection.ts)、[visibility.ts](../../src/core/effects/visibility.ts) 提供；标准元素爆发的具体程序位于 `core/effects/elemental/`。通用附着实例、生命周期操作与 Effects 异构容器继续位于 `core/unit/effect/`。Content 复用标准效果，决定触发时机、对象、参数与专属附加业务；同一标准效果的识别、叠加、替换和伤判规则由公共实现维护。

Elemental Capability 负责 EP 接收与提交、爆发触发和当前爆发引用，共同的类型、进度、EP 恢复与结束收尾保留在 `core/unit/capability/elemental/burst.ts`。Data 按接收者类别选取 Core 的具体 Effect、绑定标准数值，构造元素到 Effect Definition 的映射；爆发执行程序由 Core 实现。标准效果按实际使用逐项实现，完整候选范围见[标准效果库](effect.md#10-标准效果库与候选范围)；清单不作为一次性实现计划，也不提前建立空文件。

弩手的 action.ts 分别定义 melee 与 ranged，两者有各自的冷却和执行状态。unit.ts 按当前阻挡关系选择近战或远程，在已有主动作执行期间不并发启动另一主动作；选择和互斥属于内容策略。场景选择敌人和配置波次，不通过一个带敌人 ID 分支的中央工厂构造所有内容。确实共用的地面属性与能力装配由普通函数提供，具体攻击程序归各自内容。

装置行为位于 `devices/`。`crate.ts`、`shooting-platform.ts` 接受类型化配置并构造 Unit Definition，通过 Unit 的 enter／leave Hook 处理改格和清理；实际共用的改格函数放在 Content 内。射击台在 Occupancy 的 SUPPORT Definition 中提供 onOccupantAdded／onOccupantRemoved 程序，在当前乘员的 blocker.rules 登记平台实例独占的共享二元 Rule，只禁止 GROUND 阻挡，AIR 仍由其余 Blocking 规则判断；配对解除时只清理该平台规则，不改写地块阻挡许可。Data 解析资源标识、数值和关卡实例，并调用这些现有工厂绑定静态配置。内部批量登记交换用于验证结构与同步通知，不能证明游戏允许自由搬动平台。

干员的分支共享模块表达共同特性和默认行为；具体干员显式组合这些函数，接入自己的天赋、技能及模组变化。不建立模板继承、中央分支注册表或逐层转发工厂。只有出现实际共享规则时才建立对应模块。

例如，不屈者的友方普通治疗限制和 UNY-X 模组的阻挡来源减伤属于分支规则；泥岩的护盾、扣盾自疗、萨卡兹减伤和二技能属于个人内容。分支函数继续读取规范化 Profile 中的阻挡容量、攻击间隔和范围，不按职业或分支名称硬编码所有配置下的数值。数据表的职业／分支标识用于分类和配置核对，不承担动态选择行为程序的职责。

## 状态与登场

Definition 保存静态配置和纯内容函数，Unit 保存运行时身份、Capability 状态和 Effects。角色无需手工构造标准 Capability State；通用初始化工厂根据 Definition 自动装配它们。

Unit Definition 必填[类型化 Hooks 集合](hook.md)，静态组合生命周期和各结算领域的固有 Hook；无登记使用 Hooks.empty()。Unit.initialize 从调用方显式提供的初始 hooks 开始，各能力按 fold 登记，最后 merge Definition.hooks；Skill 的入场处理自动作为普通 enter Hook 登记，不修改共享 Definition。所有固有登记在 Unit.add 及任何 enter 之前就绪，不要求通过 enter 安装天赋 Hook。这个顺序是创建程序的明确装配顺序，不宣称原生外来效果均有统一的优先级。初始对象、部署、刷怪和预定义出现按输入顺序逐个完成创建、登记和统一 enter Hook；下一对象接续前一对象的最新 BattleState，不预先创建后续实例。

battle/unit.add 登记 PRESENT Unit 后派发 enter 键；advance 在阶段开始时固定 Unit 候选，本轮新创建的单位下次参与，轮到单位时读取最新 PRESENT 实例并派发 tick 键。运行时可通过通用 Hook Change 修改登记，包括生命周期键；enter／tick／prepare 固定本轮候选 ID，逐项读取最新登记。每次派发固定 Context，Skill 的 enter Hook 也不为后继重新采样 Context；enter／tick 每项前确认宿主仍为 PRESENT。prepare 在 LEAVING 发布后、请求子依赖前执行；leave 的 Hook 快照在注销前读取，注销后使用开始离场时捕获的 Departure 执行，保留清理前 SP 等历史事实，不查询已经删除的宿主。跨同步操作后当前运行状态仍需重新查询。具体契约见 [Unit 生命周期](capability.md#初始化与装配)。

具体 Unit 可以直接增加自己的运行时字段，例如 Boss 阶段与转阶段截止时间。Unit 的 tick Hook 位于部署、刷怪之后，Effect、技能与行动推进之前；需要立即响应伤害或行动结束的阶段变化仍由对应领域 Hook 或内容程序执行。单位行为推进不代替各 Capability 的独立推进，异常直接向外抛出，Tick 成功后才发布新状态。

低层 Battlefield 变换不执行角色程序。伤害、治疗、Skill 和 Effect 等完整结算继续使用显式的纯状态传递；Runtime 承担外部推进和 Tick 发布。

Occupancy 初始化自行登记 enter／leave 程序，直接调用 SUPPORT Definition 的 onOccupantAdded／onOccupantRemoved 程序；Deployment 在 fold 前已登记的入场程序仍先执行。双方先发布共享的 Pair，再调用 onOccupantAdded；解除按旧 Pair 身份先发布清理结果，再调用 onOccupantRemoved，不能影响后来建立的新绑定。Pair 保存绑定建立时的双方快照，需要当前生命值、Effect 或其它事实时从最新 BattleState 查询。通用 Change update 和内部 replace 仅维护双槽索引，不调用配对内容程序；当前生产没有任意搬格工厂。具体契约见 [Occupancy](occupancy.md)。

## 语义证据与项目政策

显著影响游戏结果的规则应核对客户端实现、原表及可信的玩法资料。工程上可以用一个 Effect 表达层数护盾，只要扣层、挡伤、治疗和启停行为符合已确认语义，不必照搬内部 Buff 分工。

泥岩二技能的自动触发范围与技能范围相同，满足条件时不等待普通攻击周期；护盾消耗殆尽不移除充能机制。依据：[PRTS 泥岩](https://prts.wiki/w/%E6%B3%A5%E5%B2%A9)。该页面是玩家整理的行为资料，不能把它等同于原生调用链证据。盾挡伤后自疗及取消伤害不撤销已完成副结算，另有 [嵌套结算调查](../research/cases/03-dispatch-and-nested-settlement.md) 的原生调用证据。

当前内容支持泥岩二技能、无模组／X 模组，玫兰莎一技能、猎狗与弩手。Y 模组及其他技能未实现时明确拒绝。

以下内容采用明确的确定性约定，尚无完整原生逐帧证据：

- 护盾充能周期持续推进；满层时不累积额外层数。
- 二技能眩晕按实际结算目标独立抽样，随机状态在每次取样后立即传递。
- 受击回复使用 Core 的伤害结算时点；具备 HIT 资格的普通伤害被盾抵挡后，保留本次受击 SP。LOSS 不参与盾的受伤程序，普通环境伤害也不因被盾抵挡而获得 HIT 资格。

这些约定放在具体内容／场景和研究记录中，Core 不增加泥岩或敌人 ID 兼容分支。若后续证据推翻某项语义，修改对应内容政策并补上可观察结果测试。

## Unit 与 Capability 的类型约束

具体角色 Definition 必须声明实际依赖的 Capability，工厂输出保留标准状态与配置的对应关系。Effect 的 Host 泛型用于表达回调读取哪些能力。

可部署内容在完整静态 Unit Definition 的顶层分别声明 card、deployable 和 occupancy。card 明确提供基础费用、时长、初始库存与上限、退费策略、部署规则、Unit 附加 Hook，以及 initialize 和可选 onTick；没有私有逻辑时 initialize 显式返回空对象。Deployable Definition 只保存固有 retreatRules，单向依赖 Occupancy，本次来源 Card、COST、部署位份额和退费依据由 Deployment 在 Unit 初始化完成、登记之前写入。Card.definition 保留原静态定义，不另建或按次拼装内容对象。Card 的 state 跨部署保存，Unit 每次部署重新初始化；需要继承的具体资源由内容显式转换。Card 通过自身领域的 Typed Ref 操作写回。

一次部署使用完整 Request，包含 Card Ref、落点、可选方向、Quote、附加 Rule 和普通 Unit Hook。默认规则、Card 的静态与当前规则、本次附加规则按 ID 合并后统一判断，UI 与实际部署复用相同资格；通过后先消费 DP／库存／部署位，再构造、登记并执行入场程序。quote.dp 为 null 表示跳过支付，0 表示正常零费。Card 显式配置部署间隔、离场库存恢复及费用阶段策略；主动撤退与被动死亡在各自路径使用这些策略，不对所有 leave 自动回收。主动撤退在请求 Unit 离场前直接结算退款、Card 费用阶段与库存恢复；slots 由本地 leave 归还。入场附着使用 Card 或 Request 携带的普通 Hook 调用 effects.install，不建立 Attachment 或 Card Effect 容器。共享一次机会由真正来源保存，不能复制到各 Card。完整契约见 [Deployment](deployment.md)，特殊移动重部署留待后续实现。

四向摆放朝向归 Occupancy；方向不在静态 Definition 中声明，本次部署通过 initial.occupancy.direction 提供，方向相关攻击范围读取当前实例。没有朝向的装置使用 null，不伪造 RIGHT；基础 Unit 没有方向字段。选择 Occupancy 时，必须通过 initial.occupancy.tile 提供本次登记格，State.tile 非空，不通过通用 Partial<Unit> 预装运行状态。关卡开场 Unit 声明为 initiallyPresent:true 的 Predefined，直接提供静态 definition、position、所选能力要求的 initial 和可选 hooks。Predefined 与 Deployment 都直接调用 unit.initialize，不经过额外创建工厂、品牌或泛型配对层。

基础 Unit 声明身份、生命周期、Definition、位置、Hooks 和 Effects。每个 Capability 同时声明自身的配置与运行状态；业务通过 `Unit & Vitality & Offense` 等组合表达需要的能力。初始化工厂由具体 Definition 推导所创建的标准状态，异构战场查询则通过 `hasX` 收窄为实际需要的能力。能力集合用于装配和结构收窄，不作为基础 Unit 的可选字段聚合。

Content 通过 Rule／Hook／Contribution／Blocker.layer 工厂构造要求相应宿主能力的 Change，再调用 battle/unit.update(battle, ref, change)。同宿主的多项使用 compose 有序组合，全部纯应用完成后一次发布，再顺序结算后继；需要按能力选择时，用 optional 在实际应用时检查前序变换产生的当前宿主。Content 不手工重建 Unit、不传任意 Unit Transformation，也不调用 Core 内部 replace。精确私有 state 写回与完整生命周期操作保持各自业务契约。完整组合契约见 [Unit 批量变更](api-conventions.md#51-unit-完整操作与批量变更)。统一构造入口建立能力配对，登记后能力组成稳定，不为约束内部调用者增加所有权框架或防御复制。
