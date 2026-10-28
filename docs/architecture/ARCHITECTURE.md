# ArkBattle 目标架构

本文定义项目的目标架构：领域概念、状态归属、模块职责与执行契约。文件和类按这些职责组织。

战斗的状态接续与执行契约见 [函数式内核](functional-core.md)，具体玩法目标与当前缺口见 [目标语义与实现缺口](tactical-semantics.md)。行动的类型、时间与调度契约见 [Action 设计](action.md)，技能资源与激活见 [Skill 设计](skill.md)，元素值与爆发见 [Elemental 设计](elemental.md)，附着实例的生命周期与内容接入见 [Effect 设计](effect.md)，共享请求与析构协议见 [Lifetime 设计](lifetime.md)。研究文档提供玩法行为依据。

Core 的公共入口与保留实现边界见[接口约定总表](api-conventions.md#core-领域入口与保留边界)。上层默认使用已有的领域显式 index，Core 内部按实际依赖直接导入；Runtime 入口不汇聚各个独立领域操作，也不以导出位置扩大内容调用权限。

> **状态接续的基本约定：接续操作返回的最新 BattleState 后，后续业务需要的实时事实，以这个版本为准；此前按业务规则明确采样的事实继续保留。**
>
> 旧 Unit、Action、Effect 引用仍是有效的历史快照，但不保证代表当前状态。可能触发同步回调的结算，是后续实时读取与续执行资格需要重新确认的边界；同领域结算也遵守这一约定。完整操作检查自己的执行资格，调用方只检查自己后续步骤所需的条件，不在每次嵌套之后重新检查一切。具体规则见 [状态接续后的读取与续执行](functional-core.md#状态接续后的读取与续执行)。

## 范围与行为依据

项目模拟明日方舟支持范围内的战斗机制。生息演算、保全派驻和船运寻路不在范围内。

机制依据优先采用官方客户端、prefab、Buff 模板、原始数据和可核对的游戏资料。大语义遵从官方，小差异从简；项目约定明确小差异与执行结构，验证预期由已确认的玩法规则推导。差异分类见 [架构文档说明](README.md)。

确定性要求相同初始事实、输入、种子和程序版本产生相同结果。对官方行为的取舍以重要离散结果、可察觉表现和累积数值偏差为准。随机消费顺序和细微帧序仅在影响这些结果时需要对齐。

## 项目分层

```text
Meta / 网络 / UI / 渲染 / 存储 / 工具（外部项目）
                ↓
            ArkBattle
       ├─ Core：战斗规则与不可变状态
       ├─ Content：具体战斗内容
       ├─ Data：原始资料与内容编译
       └─ Legacy：上游接入适配
```

Core 可以在服务器、浏览器和无界面测试中使用。时钟、网络、文件和渲染由外层负责。

Data 保留官方描述语言，将领域事实规范化为值，并在边界将行为描述编译为程序。Core 可以保留有限的领域定义，如伤害类别、几何形状、路线和调度配置。

外部适配层转换 Core 的输入与输出格式。Core 的规则与状态归属由领域需求决定。

## Meta 与 ArkBattle

Meta 在独立仓库中管理回合、经济、商店、棋盘、共享池、装备、羁绊、选择和局内结算，通过依赖 ArkBattle 生成战斗输入并消费战斗结果。ArkBattle 不依赖 Meta。

房间、连接、会话、计时器和展示对象由外层持有。上游项目通过 `external/upstream` 中的 subrepo 接入，格式和执行协议转换放在 `src/legacy/`；Core 不依赖 Legacy 或上游。

## 战斗状态的层级

```text
initialize(input) / step(battle, commands)：创建与推进不可变状态
└─ battle.State
   ├─ tick、调度、预置进度、统计与结果
   ├─ Deployment、RNG 与战斗级身份分配进度
   ├─ lifetime（派生依赖索引、当前 endings 与 settling）
   ├─ Mechanisms
   ├─ 本 Tick 的事件与移除事实
   └─ Battlefield
      ├─ Map
      ├─ Units + Effects + Capabilities
      ├─ Projectiles
      ├─ 空间影响
      ├─ Occupancy 登记反向表（Support 由登记派生）
      └─ 派生投影与索引
```

战斗领域使用完整的 battle.State；消费侧可将 State 导入为 BattleState。Schedule、统计和结果都保存在其中。lifetime.dependencies 从存储所有权与 Effect.scopes 派生；endings／settling 只保留本次结算工作，正常稳定状态为空／false。

runtime.initialize(input) 创建 BattleState；runtime.step(battle, commands) 直接按明确顺序调用纯领域操作，逐次接续并返回最终 State。commands 是必填只读数组，没有命令时传 []。本 Tick 的临时字段在开帧时通过新值清空或覆盖，未变的事实继续共享；不原地清空旧版本中的数组或集合。Schedule、Action 等跨 Tick 进度按所属领域保存为不可变值。行动的程序与调度契约见 [Action 设计](action.md)。

调用方用 `battle = step(battle, commands)` 接续状态，events 与 result 直接读取返回值。异常抛出时赋值未发生，原值保持不变；已结束战斗返回原 State，不产生新 Tick 或清空最后一帧事实。表现层直接接收 State 并使用领域查询生成所需的视觉数据，不复制 Unit、不展开核心容器，也不形成第二套完整 Snapshot 模型。

State.definition 只保存推进需要的静态 predefines、maxTicks 与 routeMoveMultiplier；地图与 Schedule Definition 已由所属领域持有。完整 Input 的初始单位、初始机制、Card 配置与随机种子只在初始化时消费，不由另一个 Runtime 对象保存。

Battlefield 拥有不可变场上事实及关系，维护存储和索引一致性，提供值形式的 State 与纯转换。集合操作直接构造下一版本，内部纯函数集中维护一致性；有时序语义的 Blocking 操作与同步通知由完整 BattleState 操作承接，普通搜索由 step 固定阶段调度。领域不持有可变 Battlefield Runtime，不重放操作或业务回调。

Map 是不可变矩形 Tiles 容器与 marker。Tile 结构为 `{ definition: { terrain, initial }, state }`；具体地形与参数由 Content 定义，Core 只消费通用 State。field.map 保存当前地块，Tiles.replace(index, state) 保留定义，不另设 tileStates。battlefield/tile.update 同步 Navigation baseline 并保留 overlay；完整 battle/tile.update 再维护 Blocking。TileBinding 与 tile-cost Effect 已移除，内容显式改格，见 [Terrain 与 Mechanism](terrain.md)。marker 表达地图固有的入口、目标和传送标记；波次、路线和预置实例由战斗定义描述。

Mechanism 是没有独立场上空间实体的机制实例，由 `battle.State.mechanisms` 保存。Definition 与私有 State 的泛型关系封装于异构容器；公开操作使用 Typed Ref，回调接收 self。登记、更新、停用、终止及离场响应属于 Battle 运行态，修改机制不产生新的 Battlefield 版本。地形 Mechanism 在 Movement 后、Blocking 前推进，持续结算由 Unit Effect 负责，见 [Terrain 与 Mechanism](terrain.md)。需要位置或可被选中的空间对象通过 Unit 与能力表达。

## Unit 与 Capability

通用二维向量由 common/vector.ts 的 Vec2 提供；战斗领域的 TilePosition 与 WorldPosition 复用其表示，coordinate.ts 只处理坐标语义与转换。Unit 提供身份、静态定义、WorldPosition 与自身的生命周期状态。`lifecycle` 为 PRESENT 或 LEAVING；退场入口先写 LEAVING，完成相关领域结算后再移除 Unit。规则与格网查询使用 TilePosition。几何坐标与位置约束分别表达：干员的固定位置和敌人的连续移动是规则差异。

Capability 接口同时描述对应的静态 Definition 与运行时 State，组合 Unit & Vitality & Offense 即可同时访问这些能力的配置与状态。单位可以拥有 Vitality、Offense、Action、Skill、Elemental、Locomotion、Targetable、空间几何、部署、占用或阻挡能力。每项已声明能力必须同时提供 Definition 与 State；没有内容的一侧使用空实现。Unit 登记后不能增加或删除能力，只更新其当前状态。

Definition 保存不可变基础值、参数和行为描述。Capability State 保存当前已经生效的事实、贡献、冷却和进度。Catalog 只有 initializer 字典与从签名派生的 Definitions／States／Product；装配归 unit/initialize.ts。统一构造入口建立能力配对，内部更新遵守组成稳定的契约，存储层不反复遍历能力校验。领域规则留在所属模块。

Content 直接组合 Unit Definition 与所需的 Catalog Definitions，不经过干员或敌人 Archetype 工厂；必要的领域校验放在 initialize。静态内容可用 satisfies 声明具体能力；动态加载结果使用标准 Definition，并在需要可选能力时通过守卫缩窄。

Capability.initialize(battle, definition) 返回 Result<State>，Unit.initialize(battle, input) 返回 Result<Unit & Product<D>>；逐个接续 battle，在登记前组合完整 Unit。Product<D> 由 Catalog 从 initializer 字典推导，只组合明确选择的能力的标准 Definition／State，不保留整个输入 D 或额外内容字段。通用创建不接受预制能力状态或独立当前 tick，路线与部署等在明确的业务创建流程中设置。Skill／Action Capability 非泛型，领域内部 read 保持具体程序与私有状态的类型配对；Action 每个配置项在 Unit 初始化时建立聚合条目，保存 Definition、持久 state、Cooldown 和可空的 Execution；每次启动创建新执行身份，终结只清空 execution。详见 [Capability 初始化与装配](capability.md#初始化与装配)。标签归属仍待整理，现有 Profile 依赖见 [后续整理记录](capability.md#待整理单位标签与-profile-依赖)。

Effect 是附着于 Unit 的实例；`Unit.effects` 持有实例集合。`unit/effect/`、`unit/contribution/` 与 `unit/capability/` 平级；通用 Hook 位于 core/hook.ts，unit/hook.ts 只定义 Unit 的阶段类型。Capability 保存本领域的 Hook 和 Contribution；具体 Effect Definition 组合这些公开操作，抽象 Effect 只管理实例与生命周期。

Unit 初始化始终建立空 Effects，不接受预装实例输入。初始护盾、Buff 等通过现有 Unit Definition 的 `stage: "enter"` Hook 在登记后调用 Effect.install，接续正常安装与生效结算。

眩晕、无敌、治疗不可选中等由具体 Effect 组合各领域规则；领域查询读取当前能力事实。沉默与静默、免疫与反制等尚未完成的机制见 [目标语义与实现缺口](tactical-semantics.md)。

阵营、当前玩家归属、创建者和来源分别表达，按需求存在。Unit 的生命周期状态与战场成员关系共同表达它是否仍可参与新的生命周期绑定。

局部更新函数接受并返回本领域的标准 State；需要基础参数时同时接收 Definition，例如 MaxHP 修改在返回 VitalityState 前完成 HP 响应。调用层重建 Unit，未修改的能力共享原引用。核心不提供 StableUnit 或 widenUnit，不承诺保留任意输入的字面量细化。真正的跨领域内容通过 Unit 与所需 Capability 的交叉类型声明依赖；同步结算仍显式接续 BattleState。Route 与 Locomotion 独立装配，目标、运动与空间约束的接口见 [Navigation 设计](navigation.md)。

## Subsystem 的责任与调用

每个 subsystem 拥有其查询规则、状态转换和内部结算顺序。查询与局部计算返回值；跨领域结算与内容程序按明确时序接续输入、返回状态及报告。副作用在外部驱动、版本发布和 I/O 边界，不借 Context setter 或共享可变工作对象传播。

| 领域               | 拥有的语义                                     | 主要事实与边界                                                                    |
| ------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Schedule           | 出生、波次、分支、等待与完成统计               | 定义和进度在创建及后续调用链保持关联                                              |
| Action             | 启动周期、运行实例、推进、取消与完成 | Definition 保存基础间隔、速度与程序；Unit.action.actions 按配置 ID 保存持久 state、Cooldown 与当前 Execution；nextExecutionId、贡献与 Rule 归 Capability |
| Skill              | SP 获取与支付、激活许可、持续、结束和弹药消耗  | Skill 能力保存 SP、恢复进度与激活身份；附带 Effect 通过 SKILL Scope 关联          |
| Targeting          | 候选、查询资格、优先级与确定性选择             | 读取当前事实；比较器纯函数并追加确定性 tie-break                                  |
| Damage             | 公式、输出、有序接收、普通扣血及死亡       | 流程在 battle/damage；Offense／Vitality／Elemental 提供属性，Vitality 保存 HP 与 Hook／规则登记。特殊生命保护尚待设计 |
| Healing            | 计算、输出、有序接收、普通恢复与通知           | 流程在 battle/healing；Vitality 保存 HP／MaxHP 与 Hook。治疗不可选中由 Targetable 表达，明确 Ref 的治疗只检查生命周期和接收 Hook |
| Elemental          | 元素值、损伤与治疗、爆发身份及动态冷却预算 | Unit 直接关联 Definition，状态保存四型 EP 与当前 Burst；元素损伤抗性和元素 HP 伤害抗性分别表达 |
| Effect             | 附着实例、私有状态、生效切换、覆写与结束       | Unit 持有实例；scopes 表达生命周期依赖；具体 Definition 登记 Hook 和 Contribution |
| Lifetime           | 结束幂等、依赖传播与完成调度 | 静态描述符配对 Typed Ref；关系索引派生；Pending 保存本次请求与阶段，owner 等全部依赖者完整 Finalize |
| Projectile         | 独立空间执行实例、内容程序与终止请求／Finalize | 根实例保存身份、Definition、位置、ACTIVE／ENDING 与私有 state；运动、命中、采样和计时按内容组合，见 [Projectile 设计](projectile.md) |
| Route              | 路线脚本、活动目标、等待和后继                 | 主／替代路线各自保存 Definition、当前 pathMotionMode 与 Phase；Spawn 规范化并采样偏移 |
| Navigation         | 基础通行图、Overlay 与建议移动点查询           | Battlefield 持有 Navigation State；有效 Map 和 Field 在内部派生并缓存 |
| Locomotion         | 按速度与运动规则执行自主移动、避障及目的格反射 | 保存历史速度、移速贡献与规则；消费 Route 已准备好的世界坐标目标和当前模式 |
| Blocking / Support | 建立、保留和解除领域关系                       | 资格规则与依赖复用判断共享领域事实提取                                            |

Action 程序在实际业务位置调用伤害、治疗等领域操作；Effect 表示有生命周期的附着实例。Action 聚合条目存在所属 Unit.action.actions，当前 Execution 的 Ref 携带 host 与宿主内执行 id；Projectile 独立存于 Battlefield，不因 Action 结束自动终结，显式生命周期依赖由内容结算。Aura 用宿主 Unit 上的 Effect 表示，目标登记与刷新进度保存在其私有 State，接收 Effect 存在各自 Unit 上。

阻挡几何、目标命中几何、攻击覆盖几何和物理运动体分别建模。Blocking capacity 的消耗也独立于推拉重量和物理质量。Movement 在 Route 推进后读取当前阻挡关系，决定是否推进自主移动；Locomotion 继续消费自身 Rule。Blocking 不再同步登记／撤销专用禁移 Rule，见 [Blocking 设计](blocking.md)。运动避障半宽与命中几何独立配置。

Targeting 的查询资格与接收端是否接受某次作用分别判断。已选中目标仍可能拒绝、取消或承受零 HP 变化。混合行动的索敌资格由内容明确表达，Action 不从输出操作自动推导用途或组合接收条件，见 [Targeting 与 Targetable](targeting.md)。

Targetable 通过 Definition 中的必填 restrictions 声明固有限制，初始化后与动态限制共用 State 中的 Contribution 集合。限制使用 Content 定义的 kind 与只读 allows，Targetable 不枚举隐匿、迷彩等机制。Targeting 的 Request 显式提供 purposes、Filter 和 Selector；Filter 判断资格，Selector 负责排序、数量和随机抽样，必要时通过 Result 接续 RNG。嘲讽、角色创建顺序和敌人剩余路线由相应领域提供，具体 Comparator 决定排序。完整类型见 [Targeting 与 Targetable 类型](targeting.md)。

Damage 和 Healing 分别在 battle/damage、battle/healing 维护 Calculate／Apply 协议；Targeting 位于 battle/targeting，select 返回 Result 接续选取状态，hasCandidate 提供不调用 Selector 的只读候选检查。领域 Hook 读取当前输入版本，通过公开的纯 Damage、Healing、Effect 等操作执行同步嵌套结算，再把返回版本交给外层。取消保留已完成的消耗、回复与后继；普通死亡和治疗使用各自完整操作；倒地复活、特殊生命机制、再生与生命复原仍待设计与接入。治疗不可选中不等于接收免疫，已选中后仍可直接治疗，不设置通用禁疗绕过或跳事件开关。

Skill 直接共享泛型 Definition，状态保存持久数据、SP 与本次 Activation；无需静态登记或编译程序查找。自然回复按 tick 进度产生 SP；ACTION 回复通过成功释放通知，HIT 回复通过 Damage 的接收 Hook，由 Skill 自己登记和结算。默认激活阻回由 Rule 表达，上限、门槛和支付分别求值。普通攻击不依赖 Skill，具体技能行动通过公开扩展点组合，不修改基础 Definition。

技能结束与单位退场委托同一 Lifetime 请求／析构协议。Unit 的所有权边保护 Execution、Activation、Burst 和 Effects，全部子项完成 Finalize 后才能移除 Unit。已经进入的内容仍按普通控制流继续，后继按最新状态确认资格；不能重建已结束实例，新的真正依赖也不能绑定到 Pending／ENDING 对象。

弹药消耗属于实际攻击输出，准备步骤与取消的前摇不消耗弹药；同一次攻击的多目标输出只消费一次。消耗与耗尽检查由内容在明确节点分别调用；普通弹药技能检查时点的内容对照见 [待完成机制](tactical-semantics.md)。已经释放的 Projectile 具有独立生命周期，技能结束或 Action 取消不会删除它。

干员和敌人内容按需组合 Vitality 与 Elemental；Core 的基础 Unit 不隐含这些能力，也不提供干员或敌人 Archetype 层。免疫通过 Elemental Rule 表达，不通过删除能力表达。神经、侵蚀、灼燃和坏死分别积累，Core 保留一个稳定身份的 Burst，以动态速度推进剩余冷却预算。Content 直接提供并共享爆发程序，接收者类别只用于内容装配，不依赖当前阵营或 Core 注册表。EP 损伤与 HP 元素伤害调用不同操作；请求接收与实际损失分开通知。元素治疗有自己的查询及接收资格，HP 禁疗不隐式决定 EP 接收。少数多爆发特例由 Content 组合实际语义，详见 [Elemental 设计](elemental.md)。

## 数值、贡献与领域响应

```text
基础 Definition + 当前参与的 Contribution
                ↓
         Modifier 的领域求值
                ↓
       有效数值 + 所属领域响应
```

Contribution<V> 是带身份、载荷和可选分组的不可变登记项，负责登记、替换与互斥。Capability 决定载荷类型与归并规则；attribute.Modifier 的四段公式仅用于适用的属性。详见 [属性与贡献](capability.md#属性与贡献)。

属性 Contribution 的 `value` 可以是静态 Modifier 数组，也可以是接受 `(battle, self)` 的只读函数，self 声明本领域所需的 Capability。静态值只在来源显式替换时改变；动态函数在属性查询时求值，不执行状态转换，也不消耗 RNG。先按 group 选择候选，再求值；同优先级按 Contribution ID 的字典序确定胜者，不保存取得顺序。

各数值 Capability 暴露自己的 set、remove 和 resolve 操作，并限定可接受的值类型。MaxHP 和阻挡容量只允许静态贡献；攻击、防御、行动时间和移速可以接受动态求值。Effect、技能、装备或其他来源决定贡献何时登记、替换、撤销。Effect 非生效时撤销其静态输出，恢复是否沿用样本或重新采样由具体 Definition 决定。

采样值有唯一权威归属。鼓舞样本可以属于 Offense contribution，Projectile 内容需要的 ATK 样本保存在该实例的私有 state，不成为所有弹道必需的根字段；同一数据的领域投影由同一转换维护。

伤害的数值输入由内容明确指定为固定值、结算时实时读取或指定时点采样。采样值归产生它的执行过程所有，不随来源属性变化自动更新，也不自动因来源死亡而失效；重新采样是明确的操作。来源可用性由当前输入版本能否解析到来源 Unit 决定，HP 为零与 Unit 被移除分别表达。

实时 ATK 伤害在每次结算时读取来源当前有效 ATK；来源不可用时，只有明确存在的样本才能继续提供攻击力，否则该次操作正常不执行。强制采样的内容始终使用样本。即时 Action 不自动缓存，固定威力伤害使用声明的 power；需要样本的 Projectile 或 Action 实例 保存各自的历史事实，样本按内容需要及其领域归属保存。

一次伤害操作正常不执行与 Action 取消分别表达。来源在同步内容中被移除后，后续需要实时 ATK 的伤害从最新状态判断是否有可用来源或明确样本。已经进入的函数按具体内容控制流继续，需要当前实例仍在执行的后继重新确认资格，不以取消实例自动退出 JavaScript 调用栈。

MaxHP 的变化由 Vitality 按前后有效上限保持 HP 比例，独立于 Healing 和 Damage。修改操作纯地返回包含相应 HP 响应的新 Unit，后续结算使用该版本。Effect 不组织跨贡献的批量 reconcile，不按回调身份去重。

属性变化需要响应时，由对应 Capability 与状态写入口确定结算边界。领域可以保留明确差异，公共机制承接共享的领域规则与不变量。

行动 Definition 保存基础间隔与基础速度，Unit 的 Action Capability 保存相应贡献。共享规则求有效周期，速度属性下限与周期公式的限制分别处理。Cooldown 保存采用过的周期作为历史事实；影响周期的完整状态转换及时刷新，普通更新保留完成比例，不统一改写本次程序已缓存的预算或已进入等待。具体类型与非普通计时的边界见 [Action 设计](action.md)。

逻辑推进只发生在整数 tick。攻击间隔与就绪期限可以保留小数 tick，连续攻击继承上次到期的小数余量，避免逐次取整造成长期攻速损失；错过整个逻辑帧的行动机会不累积补发。自动调度逐一尝试每轮固定的行动候选，不循环重启即时完成的同一行动。

Locomotion 保存移速贡献，运动阶段读取当前有效速度后再乘运动上下文倍率。速度与其下限都规范化为每 tick 世界距离；真实数据的属性下限由适配层按相同单位换算，停止运动由运动许可或上下文表达。变速只改变本次位移预算，不重建主／临时 Route 的目标样本、等待或导航请求。实时 provider 读取运动阶段约定的事实视图。

Blocker 的 Definition 保存基础容量，State 保存容量贡献。Blocking 在统一事实入口求值、限制为非负并按半值取偶数量化。unit.update 仅接收 Unit 数组，普通单单位操作传入 [unit]；批量更新按整批最终状态一次维护 Occupancy，并在首个关系 Hook 前同步完整生命周期投影的派生依赖索引。统一更新保留完整更新保证：Capability 继续纯地修改自身 State，完整提交同步完成必要的关系解除、容量裁撤和失效清理。归属与关联保存于 Blockable／Blocker State，不再要求独立的全局关系集合。取得先确定 Blockable 端的唯一归属，再按 Blocker、Blockable 顺序同步通知，后继接续最新 BattleState；关系两侧在同一批数据写入中完成，业务通知仍逐项接续最新状态。这些业务不放入只处理存储的一致性维护函数。Runtime 提交 Unit 修改使用 unit.update 或相应完整领域操作，不直接以 battlefield/unit.update 拼装业务更新。自主移动由 Movement 在 Route 推进后查询当前阻挡关系，再决定是否调用 Locomotion，不继续同步专用禁移 Rule。

普通搜索每 Tick 在 Movement 后的固定 Blocking Step 中统一执行，不保存独立搜索周期，不因每次 Unit 更新全局搜索，不重构 Combat／Movement 模拟 Unity UID OnTick。显式立即搜索用于有真实需求的业务，不因本 Tick 已执行普通搜索而被拒绝。单次搜索固定开始时按距离、目标 ID 排序的候选 Ref 数组，逐项按最新资格、关系及容量尝试，不预选接敌名单或冻结起始预算；Hook 增容允许后续候选在本轮接敌，新单位不加入候选。该政策有意区别于原生预算预选，可能产生持续的关系分配差异。其余资格、容量及副作用按原生证据核对，固定阶段改变的接敌结果按对照测试评价；不以“只是一个 Tick”预先接受，也不为复刻内部调度引入全场多轮收敛。性能优化在语义稳定后进行。完整约定见 [Blocking 职责与调度政策](blocking.md#已确定的职责与调度政策)。Blockable 的阻挡消耗独立于容量、推拉重量和物理质量。

## Effect、Hook 与生命周期

Effect 直接持有 `Definition<S, H>` 与私有 State。S 描述实例状态，H 描述宿主需要的 Capability 结构。抽象 Effect 不依赖 Damage、Healing、Offense 等具体 Capability；具体 Definition 通过这些领域的公开操作登记与撤销输出。

生命周期状态为 `INSTALLING`、`INACTIVE`、`ACTIVE`、`ENDING`，外部许可 `enabled` 独立保存。宿主实际退场必然结束其 Effect；额外 scopes 可以绑定 Unit、Action、Skill 激活、Elemental Burst 或另一个 Effect，任一依赖结束即结束实例。TICK scope 表达截止时点；source 使用 `Ref<Unit> | null` 记录施加者，不要求来源仍在场，也不隐含生命周期绑定。所有权与显式 Scope 的合并关系保持 DAG。

同宿主覆写组先在未结束实例中选取最高优先级，同优先级保留较早取得的实例，再检查赢家的 enabled。禁用最强实例不会让弱者补位。Contribution 分组、Hook 调用顺序与具体业务条件分别由所属模块处理。

生命周期由纯状态操作推进：安装执行 onInstall，生效切换执行 onEnable／onDisable；结束请求登记 Pending、发布 ENDING、执行 Prepare，再请求依赖者。Effect 在 Prepare 撤销输出并按当前资格协调 Group；最外层结算器在依赖者完整 Finalize 后执行本实例 onEnd 与移除。嵌套结束返回不保证注销或最终通知已完成；每项业务继续接续最新 BattleState，安装返回时重读实例与安装状态。

每 Tick 只执行一次 Effect 时间推进。开始时固定 Unit 与 Effect 身份列表，轮到实例时读取当前状态；仅 ACTIVE 实例执行 onTick，随后重新读取期限并检查到期。新实例下次参与推进；非生效实例仍会到期。周期进度和首次触发策略由具体 Definition 的私有 State 表达。

Hook 是函数与资格开关的不可变登记项，由对应领域或 Capability 保存。Effect 可以在 onInstall 登记 Hook，资格闭包读取当前输入版本的 Effect，在 onEnd 撤销。执行 Hook 返回新状态及领域值；领域调用固定候选并逐项从返回版本重查登记与资格。每次派发独立收集候选 ID，嵌套操作使用自己的候选。公共 Hook 固定 Context、接续 battle 与 current；领域决定参与资格、排序及停止条件。Unit 通过必填的静态 Definition.hooks 接入 enter／tick／leave 生命周期内容；Unit 实例不另存 Hook 数组；承载变化由 Occupancy 的 SUPPORT Definition 保存 occupantAdded／occupantRemoved Hook，复用同一派发器，不在 Unit 添加能力专属回调。

Context 表达本次调用的数据与必要只读参数；Unit、Effect 和 State 都对应明确输入版本。内容先形成消耗后的新状态再进入同步嵌套，返回后从后继版本查询。候选范围属于调用期，不进入长期快照；Context 不通过可变 holder 或动态 getter 追踪当前世界。

Aura 是宿主 Unit 上的 Effect，私有 State 保存目标登记与刷新进度，复用普通 Effect 的 onTick 与 scopes。目标选择、采样、离开与结束策略由具体 Definition 决定。完整 API 与案例见 [Effect 设计](effect.md)。

## 工作事实、提交与时间

战斗使用固定 30 Hz 逻辑 tick。核心通过显式 RNG 状态与身份计数推进，运行中不读取外部 clock。

公开 Damage、Healing 和 Elemental 结算使用明确的请求与调用时点。同一同步嵌套沿用当前只读时点；绑定静态参数的便利函数仍须显式接收并返回状态，不能捕获可变当前世界。

step(battle, commands) 直接展开领域操作的线性顺序。每次已完成转换的返回值是后续读取与嵌套调用的输入；全部领域操作与结果计算成功后返回最终 State。调用方可以保留旧值或独立分支，不需要共享可变 Draft 或版本发布对象。

可见性按领域协议确定：Unit 与 Effect 查询读取明确传入的版本，派发候选身份冻结；Blocking 完整操作返回时必要的解除、裁撤、清理及同步 Hook 已完成，普通新关系等待固定搜索阶段或显式请求；Navigation 按消费契约提供视图。并不存在一个适用于全部查询的统一实时或统一快照政策。

领域操作逐项接续已经执行的状态转换。例如 Damage 可以触发 Effect，再调用 Healing 或 Damage；已有 Lifetime 结算时，嵌套结束只保证同步请求／Prepare，外层不能据此假定 Finalize、槽位释放或最终通知已完成。最外层结束入口在当前调用内清空 Pending。

跨 tick 的等待保留 Action、Projectile 或 Route 的进度与必要样本。同步调用栈不持久化。

`step(battle, commands)` 是外部驱动的同步入口；领域模块与 Effect 回调只执行领域操作。正常领域拒绝、取消和零作用通过明确结果表达，保留已经完成的转换。非预期异常直接传播，不返回半完成的 Tick。

纯函数可以用本次新建的局部容器构建结果，输入与返回的共享领域值遵守不可变约定。失败的模拟不再推进；已发布的 State、固定快照和历史引用保持原值。只读调用期范围随同步调用结束，不靠共享可变登记表释放。

外层 Simulation Runner 负责报告故障并终止模拟；网络、存储和 UI 各自处理环境与 I/O 故障。内容程序同样遵守纯计算和隔离约定，不修改外部状态。

## 不可变值与静态定义

Battlefield 采用以下项目约定：

1. 保存的领域对象视为不可变值。Unit、Mechanism、Effect、Projectile、Navigation Overlay 及其嵌套状态一旦写入，就不允许原地修改。
2. 领域操作直接构造新状态，并复用内部纯函数维护存储、索引及关系一致性。更新 Unit 时创建新对象；修改嵌套状态时创建受影响路径上的新值，未修改的部分继续共享。
3. State 与领域查询共享不可变对象引用。调用者有义务不修改返回的数据，也不继续修改已提交的输入或返回结果中的共享领域值。
4. 版本通过 Copy-on-Write 共享数据。状态操作返回已经维护事实、关系和派生索引的新 State；外部 Runtime 只发布最终版本，不提取差异或重放操作。

Core 内部传递领域值时共享引用，状态转换只创建受影响路径上的新对象。不可变 State 与 Copy-on-Write 表达固定版本。校验维护数值范围、身份、能力组合与生命周期关系等领域约束。

这些是项目的调用与实现约定。`const` 约束变量绑定，`readonly` 辅助表达接口意图；不可变值与 Copy-on-Write 保持固定版本隔离。

View 捕获固定输入版本。后续转换和发布不会改变其表达的事实；需要后继事实时，从返回的新 State 构建或查询相应 View。

不可变 Definition 由实例与快照直接共享。Unit、Effect、Action、Projectile、Mechanism 等实例的定义关联统一直接保存 Definition，不经 DefinitionRef 和注册表间接查找；保存引用不会复制整份定义。实例之间的 ID 与生命周期 Ref 表示运行身份，仍按各自领域关系使用。

局部工作容器、批量构建器和 Navigation 的有效 Map／Field 等派生缓存可以内部可变，但不能原地修改已写入的领域值或已有版本表达的战场事实。Skill 的参数与行为也直接关联共享 Definition，具体类型与生命周期见 [Skill 设计](skill.md)。

创建接收 Definition，已知 typed Ref 的查询直接恢复对象类型；未知异构条目可由 Definition 身份或类型守卫建立类型依据。普通私有状态转换接收类型化实例，不额外传 Definition。内存快照共享不可变 Definition 和已登记的 Hook／动态 Contribution 函数。跨进程导出与恢复由序列化边界转换数据、重新关联定义和行为，不以运行时定义注册表替代恢复协议。

| 内容                                   | 保存位置         |
| -------------------------------------- | ---------------- |
| 基础事实与有限行为描述                 | Definition       |
| 当前状态、身份、归属、阶段、样本与联系 | State |
| 内容程序、纯规则函数与可重建缓存       | 所属 Definition／Content 模块或有明确职责的派生缓存 |
| 当前业务输入与明确版本的只读事实       | 显式参数或本次业务载荷 |
| 本次派发的固定 Hook 候选               | 所属领域派发函数的局部值 |

静态定义、Hook 与 Contribution 直接共享引用，由所属领域组织执行与结算顺序。异构实例容器内部封装类型配对。战斗 initialize 接收 Input，领域操作直接调用所属模块的公开 API。

快照保存固定版本的事实，并可共享静态 Definition，不包含借用上下文、运行时句柄或注册容器。事件记录已发生结果，权威状态继续由领域事实表示。

## TypeScript 与模块惯例

Core 是封闭、严格检查的 TypeScript 系统。Data 与外部适配层在输入边界处理外部格式。Core 维护数值范围、身份、能力组合和生命周期关系等领域不变量，内部调用者共同遵守不可变约定，通过不可变更新共享领域值。

采用 ESM、具名导出和清楚的模块边界。多项相关操作可用小写开头的命名空间导入；少量常用符号用具名导入。模块提供上下文，局部符号不用重复完整领域前缀。

Unit 基础模块使用 unit.Id、unit.Definition、unit.Lifecycle；查询层提供 all／get／ref，按 BattleState 和 Typed Ref 读取当前对象；初始化模块提供 Input 和 initialize，结果复用 battle.Result，能力组合 Product<D> 归 Catalog。内容与创建流程按实际需要组合 Unit Definition 和 Catalog Definitions，不提供统一的干员、敌人或 CombatDefinition 包装。跨模块组合多个同名类型时使用命名空间或有角色含义的导入别名。

内容配置与行为定义使用 Definition，运行时实体使用领域名称，例如 EffectDefinition / Effect、ProjectileDefinition / Projectile、MechanismDefinition / Mechanism。Runtime 用于持有并推进可变状态的容器；Compiled 用于确实经过编译而产生的独立执行表示；Program 用于实际可执行的程序，不作为普通定义的领域别名。

`unit/contribution/` 提供不可变数据包、数组操作与公共数值运算；core/hook.ts 提供通用 Hook 数据、dispatch 与数组操作；unit/hook.ts 仅声明 Unit 生命周期阶段类型；`unit/effect/` 管理附着实例与生命周期。Capability 持有自身的集合并提供领域写入、查询与调用协议，具体 Definition 完成组合。

只导出实际需要的契约。类型描述应与转换真实保留的信息一致。使用能够表达约束的简单类型结构；映射与条件类型集中用于确有价值的能力推导。

目录反映领域和所有权，不要求每个领域都有 Resources、Services、Context、Provider、Transition 等一整套文件。普通函数承担小型共同操作，有私有可变存储的容器才使用 class。

## 验证与架构成本

验证从明确的项目规则推导预期，覆盖玩法结果、确定性、状态隔离和结算协议。类型验证覆盖公开入口的能力要求、合法状态组合与转换所保留的信息。

一个抽象的价值由它为使用者接管的身份、生命周期、采样、顺序和隔离工作衡量。新增机制应主要描述自己的规则；同一事实和不变量应有唯一维护位置。

相似代码形状可以保留。共享规则和固定装配由小型普通函数或已有机制承接。模块划分和命名应让实现、修改、排错和验证所需的知识更少。
