# 领域边界与当前实现差距

当前源码对照：`314b942`。

本文件综合 [流程证据](01-scope-and-battle-flow.md)、[交战证据](02-combat-buffs-and-effects.md) 和 [空间证据](03-space-units-and-mechanisms.md)。下文的职责划分是依据这些行为作出的设计判断，不是声称官方客户端采用同名架构。

具体调用、候选作用域与返回时可见性已经通过[第一轮案例](cases/00-INDEX.md)细化；[协议结论](cases/04-protocol-conclusions.md)补充本文件的领域边界，不提前规定最终 API。

## 1. 保留大框架，但不要把它解释为全部执行逻辑

| 层次 | 应当组织的内容 | 不应承担的内容 |
| --- | --- | --- |
| BattleRuntime | 战斗推进、阶段顺序、命令接入、确定性执行上下文、整体提交与战斗结果 | 逐种解释技能、Buff 或伤害修正 |
| Battlefield | 当前单位及必要场景事实、空间集合与关系、空间投影、提交不变量 | 自动推进所有能力，或自行解释“沼泽要扣多少攻速” |
| Unit + capabilities | 实体身份与位置；生命、行动、运动、状态、附着实例等实际需要的事实 | 每个 Unit 都有全部能力；把编译函数或派生缓存存进权威事实 |
| 领域 subsystem | 拥有一类领域的查询、转换、结算顺序与可见性；给出明确事实变化和结果 | 把一个角色的整套特殊机制变成通用执行器分支，或要求每个领域都有 tick manager |
| 内容程序 | 决定本技能／天赋／设备在什么时点做什么、以何种顺序组合领域操作 | 重新实现伤害公式、绕过生命或空间提交规则 |
| Resources | 编译程序、函数和可重建缓存 | 战斗进度、贡献载荷、同步候选作用域或上次读到的 Unit 状态 |

跨帧施法、投射物、周期机制也有运行事实。它们最终存在哪个容器仍需单独决定，但不能因尚未确定归属就放入可重建 Resources，也不能仅因有 ID 和计时就强行成为 Unit。

当前阵营、玩家归属、创建／来源和持续实例的生命周期所有者也不能互相推导。Buff 派生与来源匹配已有直接反例；联合防御的来源玩家归因则还需要外层流程与单场输入衔接。哪些对象需要这些事实应按具体规则确定，不要求所有 Unit 都有统一关系字段。

## 2. 需要哪些领域能力

这是职责清单，不是目录树，也不要求每行都建成一个独立类或 tick system。纯查询、即时 transition 和跨帧驱动需要不同执行形式。

| 领域 | 核心职责 | 与相邻领域的边界 |
| --- | --- | --- |
| 场景与生成调度 | 初始化、预置实例显隐、波次／片段／分支、受管单位、波次与全局完成账本 | 消费单位生命周期通知；击杀／漏怪统计由战斗与玩法规则解释；不执行敌人的攻击规则 |
| 各领域有效参数查询 | 从基础定义与本领域已登记贡献取得当前有效值 | 不设统一 AttributesManager 或独立 Attributes subsystem；可共享数值代数，采样／刷新时点属于内容过程 |
| 状态贡献 | 状态身份、增撤与组合 | 状态事实不统一解释所有行动许可；资格由对应查询／接收领域决定 |
| Buff／持续附着实例 | 安装、接纳／有效性、覆盖、刷新、周期、失效／结束、派生生命周期 | 协调领域贡献与内容动作；不统一拥有各领域的 hook 契约和结算顺序 |
| 行动／能力执行 | 启动条件、执行阶段、目标绑定、前后摇、取消与恢复 | 普通攻击只是其中一种程序；技能 SP／弹药事实不能压成统一冷却 |
| 技能资源与启动规则 | SP 增减、技能可用性、卫戍自动释放政策、持续与弹药 | 自动释放规则来自模式与具体技能；不属于纯 Targeting |
| 投射物／延迟命中 | 在途事实、目标／位置绑定、接触、命中动作、结束与取消 | 接触不等于扣血成功；几何命中不代替目标接收规则 |
| Targeting | 候选、用途资格、覆盖几何、纯比较与确定性选择 | 不写标记、不抽随机数；标记准备属于查询前的内容步骤 |
| Damage | 单次输入与接收入口政策、公式、来源／接收修改、吸收、致死保护、确认结果 | DamageType 与 ingress policy 分开；伤害前后内容动作可调用它，但不能全部塞入它的内部阶段 |
| Healing／HP 回复 | 接收资格、回复量与生命上限、结果语义 | 医疗查询、直接回复与再生未必共享资格、增益或触发方式 |
| Elemental | 多类型 EP、积累、抵抗、爆发／恢复、元素治疗及爆发衍生效果 | EP 损伤与 `DamageType.ELEMENT` 的 HP 伤害分开；不归入普通 HP 公式 |
| 生命与场上存在 | 受击后的生命事实、死亡／撤退／失效、必要的复活与移除通知 | 死亡判定、展示事件、场上移除不是同一个动作 |
| Blocking | 地面接触资格、容量／占用、关系建立与释放 | 与命中半径、攻击范围及导航高成本分开 |
| Route／Navigation／Locomotion | 脚本目标与等待、空间求解、按运动规则推进位置 | 临时路线接管可复用运动执行；产生恐惧／诱导是内容规则 |
| 位移／身体规则 | 推拉、失衡、重量、物理或明确解析的外力 | 不是改 Route 目标；与普通路径行进历史分别处理 |
| 部署／占位／支撑 | 放置资格、slot 占用、支撑与动态设备的空间贡献 | 障碍不是不可通行的同义词；放置许可不是寻路成本 |
| 环境／关卡机制 | 全局或区域激活、参数、周期与规则切换 | 可产生 Buff、伤害、设备变化或空间贡献；不必伪造生命与位置 |

当前无法从已抽查的模板证明所有内容只需要以上固定操作集合。这份表确定稳定领域范围；具体机制覆盖仍应沿“实际内容引用 → prefab／Buff → 执行路径”补齐。

## 3. Effect 必须先区分含义

| 含义 | 官方或数据中的实例 | 需要保存什么 | 由谁解释行为 |
| --- | --- | --- | --- |
| 一次领域操作 | ApplyDamage、Heal、AddBuff、位移、生成对象 | 通常只需本次输入／输出；延迟执行另有进度 | 具体领域与内容编译器 |
| 跨调用／跨 tick 的附着实例 | 护盾余量、层数、维什戴尔残影、持续属性修改 | 身份、来源、期限、层数／余量、父作用域等事实 | Buff 生命周期与相应领域的程序 |
| 空间规则贡献 | 工事的 WALK 高成本、范围通行限制、支撑 | 来源、锚点、覆盖与激活事实；有效格网可派生 | Battlefield 空间投影 |
| 表现资源 | prefab 的 `effectKey`、CreateEffect、音效 | 本轮逻辑模拟不需要复刻 Unity 视觉对象 | 展示适配层 |

这几种含义可以协作，但不天然共享 ID、到期方式或一个管理器。例如沼泽控制器决定施加什么，格子／范围查询决定作用于谁，单位 Buff 保存已累积层数，属性查询消费贡献，运动和攻击分别读取对应有效值。

“持有附着实例”可以是一种 Unit capability；一次伤害、一个 selector、一个几何值不因此成为 capability。非空间机制也可能持有持续事实，不能把持续实例抽象的全部使用者预先限定为有 HP 的 Unit。

### 3.1 领域贡献与实例生命周期

Definition 保存基础值；相应 capability 保存本领域已登记的贡献事实；领域查询按当前参与资格与规则派生有效值。Offense／Defense 只有静态参数时无需空 State，需要接收运行贡献时就有对应事实。最终 ATK／DEF 不再独立维护一份可以任意修改的真相。

Effect 生命周期协调登记、参与启停、刷新和撤销，领域决定怎样解释和合成贡献。已登记不等于当前参与；暂时停用或被覆盖不统一删除或重算旧载荷，恢复不自动重新采样。

贡献求值分为固定贡献、周期／指定时点采样、状态变化时更新的维护投影、实时纯 provider。实时 provider 的行为在 Resources 中，按调用协议读取当前事实或本次 Request／context；纯查询不安装／刷新贡献、不消费 RNG。采样与载荷更新是明确转换；例如 Buff 层数从 2 变成 3 时，相关领域投影在实例转换中同步更新，先完成一致性，再允许合法后继观察。

样本只能有一份权威归属，按机制选择领域贡献、Buff 实例或执行过程。其他结构持有关联或受维护投影，不能自由修改另一份同义载荷。Buff 核心不解释 ATK 的乘区，Offense 查询也不猜测来源 Buff 的覆盖、到期或父关系。

### 3.2 来源过程与接收绑定

光环或全局单位加成的来源过程保存激活、锚点、刷新进度、接收者与接收实例联系；接收 Buff 有自己的身份、有效性和期限；其贡献归接收者对应领域。当前范围候选是几何／资格查询的派生结果，不自动等于已经建立的绑定，也不能靠重新扫描范围替代离开后保留、撤销和未来新单位接入等过程事实。

全场共享额度或周期由有相应作用域的过程持有。接收实例可引用或调用共享过程，不能把共享三次复活额度复制成每个接收者各有三次。具体刷新、离开保留与多来源竞争继续按内容核对，这个边界不规定统一光环状态机。

## 4. Combat mechanism 不是另一种通用引擎对象

“机制”描述玩家观察到的行为，粒度并不稳定。普通伤害、残影爆炸、Boss 共享生命、海水周期伤害、装备受击回 SP 都可能被称为机制，但其状态归属不同。

更有效的分类依据是：是否有独立场上实体；事实属于单个单位、附着实例、执行过程还是全局规则；需要哪个领域提供何种 transition；由何处组织触发顺序。只有需要独立非空间状态／作用域的场景控制器，才自然落入目前讨论的 MechanismRuntime。所有特殊敌人和技能不应因此统一转成 MechanismRuntime。

维什戴尔是一个跨领域内容程序：攻击模式与有效 ATK → projectile 命中前附着残影 → 有序余震动作与条件／RNG → 独立爆炸请求 → Damage → 标记结束。这里需要组合与跨调用事实，不需要新建一个“维什戴尔 subsystem”。

## 5. Hook 有三种不同契约

| 介入形式 | 适用实例 | 约束 |
| --- | --- | --- |
| 纯贡献／查询规则 | 属性 contribution、目标 predicate／comparator | 读取本次事实；不消费 RNG，不写世界；按相应代数聚合 |
| 有序修改 | 公式输入、伤害输出、接收减免、护盾吸收 | 明确所属阶段、参与资格、优先级、顺序与取消语义；可以返回实例消耗 |
| 事实发生后的反应 | 确认受击、实际 HP 变化、致死尝试结果 | 读取明确结果；按契约继续内容程序；不能反过来隐式改写已确认结果 |

另外，命中前附标记、Dice 后查条件、施法前准备目标是**内容程序的步骤**，不必全注册到 Damage hook。生命周期开始／结束／周期通知也是另一类确定时点，不能等同“伤害后”。

官方确实有事件表和优先级；这只证明需要时点与有序分派，不证明本项目应该复制一个任意广播、任意监听的全局 HookBus。流程的拥有者必须解释事件何时发生、下一步读到哪些事实，以及能否在反应中发起嵌套结算。[Case C](cases/03-dispatch-and-nested-settlement.md)已确认同一 Buff 集合的候选作用域、逐候选有效性及同步分担；这不自动推广成全部领域的重入／队列规则。

Buff 核心拥有实例生命周期；Damage、Healing 等接收领域定义各自 hook 的阶段、输入／结果、排序、允许操作与取消范围；内容编译器提供登记到这些入口的程序。Buff 核心不增加一张包办所有领域阶段的表。

执行上下文管理具体集合的活跃候选范围，包含该范围内已登记但暂时停用的实例。同集合嵌套枚举与按 key 查询复用身份范围，逐候选检查当前资格和载荷；UID 查询按其登记查询契约执行。新身份不加入旧范围，旧停用候选恢复则可参加。作用域正常／异常退出都须释放，不进入 Resources 或跨 tick 快照。

伤害类别不决定全部事件参与资格。分担的无来源 PURE Modifier 使用跳过普通 Modifier 事件的接收入口；不能只编译成普通 TRUE Damage 或一个“禁止再次分担”的条件。领域取消也不统一终止已经进入的内容后继。

## 6. Resources 的边界

Resources 在这里是软件架构概念，不是官方游戏的一种机制。

| 可重建资源 | 必须保留的运行事实 |
| --- | --- |
| 从 Definition 编译的内容程序、目标 predicate、参数／伤害处理函数 | 当前 HP／EP、领域贡献、Buff 层数与余量、唯一权威采样值 |
| 不可变模板解析结果、程序注册表 | 来源、父子关系、当前期限、获得次序 |
| NavigationField 等派生缓存 | Route 游标、已解析随机目标、等待余量 |
| 可以根据当前输入重建的查询投影 | 在途弹道、弹药、技能阶段、取消状态、RNG 位置、来源／接收绑定 |

静态参数可以进入不可变 Definition。行为编译进入 Resources。编译程序每次通过 context 读事实，不能捕获上次的 HP、位置或技能状态；有意在发射／安装时冻结的数值是该次执行／实例的事实，不是缓存。

Catalog 只负责能力组合层的初始化、复制与一致性，不负责 Action、Damage、Blocking 或 Locomotion 规则。高阶函数注入不会自动解决生命周期、事件顺序与派生依赖失效。

共享当前工作事实不要求一个统一 Work 类。领域可使用窄视图、局部值与明确结果；已经完成的同步转换在调用返回后可见，外层不能拿嵌套前的 Unit／实例覆盖新事实。Blocking／Navigation 等仍按自己的阶段契约读值，不因共享事实入口就全部实时重建。

整 tick 成功后才权威发布。领域拒绝／取消按协议返回，并保留已完成前缀与允许的后继；未处理异常或明确 tick abort 才放弃整份工作结果，不泄漏 HP、贡献、执行进度、RNG、身份和公开事件。纯缓存可以保留，但不得保存权威进度。跨 tick 只保存协议明确暂停点的事实，不把半次同步 Damage／Healing 留成外层程序计数。

## 7. 当前源码：哪些保留，哪些不足

下表不把“尚未完成”当成 bug，也不把原始枚举存在本身当成架构错误。

| 项目 | 当前事实与评价 | 下一步需要先确定的行为 |
| --- | --- | --- |
| 状态／资源分离 | [Unit](../../src/core/unit/unit.ts)、[实例状态](../../src/core/unit/capability/effects/instance.ts)、[CombatResources](../../src/core/battle/resources.ts) 已区分；基本方向保留 | 跨帧 execution 与非 Unit 持续事实的所有权 |
| 能力组合 | [Catalog](../../src/core/unit/capability/catalog.ts) 限于 initialize／copy；Offense／Defense／Vitality 已有本领域贡献事实 | 不把生命周期流程、领域规则或执行上下文放进 Catalog |
| 行为编译 | [Action 编译](../../src/core/unit/capability/action/compile.ts)、[compileEffect](../../src/core/unit/capability/action/compile-effect.ts) 已编译为函数，通用 runner 不分派 DAMAGE／HEAL | Basic Definition 仍只有即时伤害／治疗；不能覆盖能力阶段与 projectile |
| 语义映射 | [effectPurposes](../../src/core/unit/capability/action/effect.ts) 显式把效果语义映射为查询要求，合理 | 新操作按目标绑定组解释用途；不能令 Effect 分类等同 QueryPurpose |
| 数值代数与领域参数 | [numeric](../../src/core/modifier/numeric.ts) 可共享；[Offense](../../src/core/unit/capability/offense/query.ts)、[Defense](../../src/core/unit/capability/defense/query.ts)、[Vitality](../../src/core/unit/capability/vitality/query.ts) 持有领域贡献并查询当前视图 | 固定／采样／投影无需 provider；实时纯 provider 单独注入；maxHp 变更策略另核对 |
| Damage 主流程 | [settlement](../../src/core/unit/capability/vitality/damage/settlement.ts) 拥有公式、输出、接收、致死保护和报告；[dispatch](../../src/core/unit/capability/vitality/damage/dispatch.ts) 拥有领域排序和逐候选执行；取消与停止派发独立 | 当前报告确认、来源后目标反应及退场顺序是项目有限契约，不宣布完整对应官方死亡／通知路径；命中前内容仍不归 reaction |
| Effect 生命周期协调 | [lifecycle](../../src/core/unit/capability/effects/lifecycle.ts) 统一维护实例与领域 bindings；登记、开始、当前参与、结束与 finalize 分开；自动安装在清理连锁后分配身份 | 目前表达已初始化接收者的有限协议；完整覆盖／刷新／周期、未初始化接收者及非 Unit 宿主仍需补齐 |
| Buff 覆盖 | [生命周期 admission](../../src/core/unit/capability/effects/lifecycle-resources.ts) 支持按已开始且未结束实例的同 key 占位判定 UNIQUE 接纳；[Damage 分组](../../src/core/unit/capability/vitality/damage/dispatch.ts) 仅在该领域选当前最强项 | **不等同**官方 STACK／UNIQUE／EXTEND 全部安装、续期和覆盖状态机；暂时停止参与保留载荷，不自动重采样 |
| Buff 父作用域 | [实例](../../src/core/unit/capability/effects/instance.ts) 保存精确父身份，独立于 source／lifetimeOwner；父结束同步传播，子 finalize 由接收者清理；退场先停止所属实例参与 | 非 Unit 来源过程及光环安装关系仍待实现；当前 Unit 退场与外部接收者清理时点是项目选择，不推广为原生全部回收路径 |
| Buff 派发与领域 hook | [EffectDispatchScope](../../src/core/unit/capability/effects/dispatch.ts) 按接收 Unit 管理活跃事件的登记身份范围，同容器嵌套复用；执行前重新检查参与／分组；UID 查询读当前登记；领域 Resources 可独立缺席规则 | 该作用域不冻结整个 Damage、HP 或参数，也不进入 Resources／snapshot；其他领域集合的规则仍需分别核对 |
| Hook 权限与已进入程序 | [Vitality hook](../../src/core/unit/capability/vitality/hook.ts) 仅提供事实、Effect 操作及阶段允许的同步 Damage／Healing；公式阶段只提供 Effect 操作；活跃 callback 在 finalize 后可读该实例最后载荷，UID 查询已 absent | 活跃程序与参与资格分开；暂存只属于调用期，退出即清除，不提供任意 Battlefield mutation；更复杂内容阶段按需扩展明确 ports |
| 查询与几何 | [Targeting](../../src/core/unit/targeting/compile.ts)、[Spatial](../../src/core/unit/capability/spatial.ts) 已区分查询用途、受击几何与覆盖；纯 selector 与稳定 tie-break 保留 | 动态范围／特殊 selector、准备 transition 与重查时点；物理 Body 尚未接入 |
| 目标绑定与读值时点 | Basic Action 一次绑定全部组；SOURCE_ATTACK 在效果执行时读，来源不在时回退配置 power | 这是当前即时策略；**不能推广为官方弹道语义**。原生有不同 selectTargetTiming 与数据冻结过程 |
| Healing／Elemental | [Healing](../../src/core/unit/capability/vitality/healing/settlement.ts) 已有有限输出／接收／报告反应协议及同步嵌套；Core 独立判断 HEAL_FREE，skip 只选择 skippedReception；已核对的原生 skip 入口在数据侧显式适配为 ignoreHealFree=true；元素仍仅查询用途占位 | 医疗／直接回复／再生的完整类别与触发差异、更多接收政策和完整 EP 领域仍待核对；不能从有限 Healing 合同推导所有回复路径 |
| 机制与空间贡献 | [MechanismRuntime](../../src/core/battlefield/mechanism.ts) 只有 id／definition／active；[NavigationSpatialEffect](../../src/core/battlefield/navigation/effect.ts) 只供导航投影 | 非空间周期状态、地形 Buff、动态范围；类型存在不等于机制驱动已实现 |
| 局部结算 | [CombatWork](../../src/core/battle/execution/work.ts) 支持当前事实 transition 与独立生命周期结果，Blocking 取阶段基线；新建后移除不再丢失事实结果 | 保留可见性约定；Mechanism／空间贡献按需提供操作与结果，不强行统一 Work；同段投影另按契约决定 |
| Battlefield 依赖 | [dependencies](../../src/core/battlefield/storage/dependencies.ts) 仍自行读取阻挡／支撑输入，虽调用部分领域判断 | 是工程演进点；规则与复用判断应共享输入，不能因函数搬家就认为不会漏失效 |
| 战斗阶段 | [systems](../../src/core/battle/systems.ts) 的线性阶段已与 BattleRuntime 分开 | 阶段顺序是项目已选协议；影响结果的阶段可见性、增删与重入语义仍需核对，不要求复刻完整内部调度 |
| 卫戍跨阶段事实 | 当前只有有限 [阵营](../../src/core/unit/capability/allegiance.ts)，部署输入另收 playerSide；单场生命与结果独立 | 玩家／来源归因、联合防御延续、领袖共享生命与反馈未闭合；先核对实际规则，不提前决定统一关系结构 |

## 8. 本轮不应提前决定的事项

物理目录已经按 Battle／Battlefield／Unit 领域组织，详见 [总体架构](../architecture/ARCHITECTURE.md)。这不预设万能 Effect 接口、全局 hook enum、统一 AttackInstance、统一能力模板或所有 subsystem 的一致 step 签名。

第一轮已用父子 Buff、普通弹道和泥岩盾／分担锁定一组调用约束，当前文档据此确定领域贡献、生命周期、执行过程与局部上下文的责任，不增加新的总管理层。医疗／再生、元素爆发、地形控制器和工事／平台切换仍需具体案例验证；致死后的状态机移除与后继资格也尚未闭合。每例说明触发、读值、查询用途、生命周期与后继可见性，再补相应领域协议。
