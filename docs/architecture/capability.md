# Capability 的数据与操作契约

Capability 按领域组织静态规则、当前状态和操作。每项 Capability 都具有配对的静态配置、State、能力接口和统一的 initialize；程序配置可由对应独立领域提供，例如 Skill Definition 归 unit/skill。没有静态配置或运行事实的一侧使用空实现，不使用 null 或省略字段代替。

## 数据与类型

单一领域模块使用 Definition、State 与该能力的名称。多个概念共存时保留能区分角色的名称，例如 Blocker／Blockable、ActionDefinition 与 Action Capability 的 Definition。Layer 与 Hitbox 分别位于独立领域目录，使用各自的 Definition 与 State。

```typescript
interface Vitality {
    readonly definition: { readonly vitality: Definition };
    readonly vitality: State;
}
```

Definition 保存静态参数与行为描述，State 保存本领域当前事实。结构相同的配置与初态可以共享引用；更新当前状态创建新值，不修改配置。Unit 可以不选择某项能力；一旦选择，对应 Definition 和 State 必须同时存在。SpatialPresence 使用空 Definition，Hitbox 使用空 State；空定义和空状态均使用 interface {}。Occupancy Definition 声明 Slot，State 记录当前登记地块。Targetable 的 Definition 使用必填 restrictions 数组声明固有限制，初始化复制贡献容器建立 State；空数组表示没有固有限制，详见 [Targeting 与 Targetable 类型](targeting.md)。Skill.activation 为 null 等领域内部业务状态不受此配对约定限制。

基础 Unit 是非泛型接口，保留运行时实例 ID 与 definition.id 对应的静态内容身份。通用工厂返回 Unit 基础结构与明确选择的能力的标准 Definition／State 组合。Skill／Action Capability 本身非泛型，不把具体程序的私有类型传播到宿主 Unit、SP、Rule、Hook 或 Contribution。Skill 的内部 getCurrent 返回完整单槽聚合；已知 Definition 构造持久 Ref、已知非空聚合构造本轮 Ref，分别保持私有类型配对。需要某项能力的业务通过 Unit 与对应 Capability 的交叉类型声明依赖。

各领域保留 hasVitality／hasSkill 等结构守卫。它们可以使用泛型保留调用者已知结构，因为守卫不更新值。普通状态变换不承诺保留任意输入字面量类型，也不使用 StableUnit／widenUnit。Core 遵守 readonly 与约定式不可变，无需所有权接管与反复复制。

## 操作范围

局部值变换接收本领域的标准 State，返回新 State；需要基础值时同时接收 Definition。跨能力规则可以接收 Unit 与所需 Capability，保持自然、易读的参数。真实查询条件和事件数据作为明确业务输入；本次派发的候选由领域局部保存，不传播通用调用范围，不通过 Pick 枚举最小依赖，也不统一成全领域大上下文。

完整结算接收当前 BattleState，按业务顺序返回已结算的新版本。有额外拒绝原因、结算报告或新身份时返回 `{ state, value }`，否则直接返回 State。普通查询不推进世界。所谓提交指生成并接续后继值；Tick 成功后，Runtime 才发布最终版本。

## 初始化与装配

每项 Capability 的公开初始化契约统一为：

```typescript
initialize(battle: BattleState, definition: Definition): Result<State>
```

Result.state 是接续的 BattleState，Result.value 是新建的 Capability State。初始化不改变战斗事实时返回原 battle；当前时间从 battle.tick 读取，不再传独立 tick 或只有时点的 Context。空 Definition 也保留必选参数。Skill 的 SP、Sustain 等内部值模型仍使用各自的局部初始化接口，不因名称相同升级为 Capability 创建操作。

Catalog 只登记 capability → initializer 字典，并从函数签名派生配置、状态及能力组合类型：

```typescript
export const initializers = {
    vitality: vitality.initialize,
    elemental: elemental.initialize,
    skill: skill.initialize,
} as const;

export type Definitions = {
    readonly [K in keyof typeof initializers]:
        Parameters<(typeof initializers)[K]>[1];
};

export type States = {
    readonly [K in keyof typeof initializers]:
        ReturnType<(typeof initializers)[K]>["value"];
};

type SelectedKeys<D> = {
    [K in keyof States]:
        [D] extends [Readonly<Record<K, Definitions[K]>>] ? K : never;
}[keyof States];

export type Product<D> = {
    readonly definition: D;
} & Pick<States, SelectedKeys<D>>;
```

Product<D>.definition 直接保留 D，包含内容自有字段、字面量与联合分支信息；各 Capability 的运行 State 则使用 initializer 派生的标准 States 类型。SelectedKeys 的条件以 [D] 包裹，只有联合 Definition 的所有分支都明确要求某项能力时才承诺对应 State；可选能力也不提供存在保证。Unit 基础身份与生命周期 Hook 契约归 Unit 模块。类型推导与运行时装配共用 initializers，不另建能力映射表。Definition 与内部状态按项目契约保持不可变，不额外套深只读包装、复制或冻结。

Unit 装配实现在 unit/initialize.ts，由 [unit/index.ts](../../src/core/unit/index.ts) 公开 initialize(battle, input) → Result<Unit & Product<D>> 及模型、Hook 类型和查询；完整登记与离场操作仍直接归 battle/unit.ts。Input 的 id、definition、position 为必填，不接收 effects；每个 Unit 始终以 Effects.empty() 初始化。初始 Effect 由 Unit Definition 中 `stage: "enter"` 的 Hook 在登记后调用 install，正常执行安装、生效与依赖结算。实现签名接收 Input<Definition & Partial<Definitions>>，按配置键是否存在选择能力，并直接读取 definition[key]；不使用 Reflect，也不重复检查内部能力配置是否为 undefined 或 null。已知能力的 Definition 受 Catalog 派生类型约束；通用装配结果只承诺 Definition 中明确选择的能力。capability/skill.initialize 返回完整的非泛型 Capability State，Catalog 的装配入口不变；程序私有类型由 unit/skill 内部恢复。

装配按登记次序调用所选 initializer，逐个接续返回的 battle，再组合完整 Unit。初始化可以读取当前战场或按所属流程消费 RNG；后续初始化与创建流程使用返回版本，不能重新接回旧 battle。这个阶段 Unit 尚未登记，初始化不能假设自己或兄弟能力已经可从战场取得。登记、Skill 入场及 Unit 的 enter Hook 等登场结算由创建流程负责。

Action Capability 的 Definition 保存 initialize(battle) → Result<Actions> 和可选 select。具体内容在类型明确处创建行动初始化函数，再以 createActions 顺序组合；Capability 接续返回的 BattleState，将 Actions 放入公共 State，并建立执行 ID 计数、贡献、规则和 Hook 的初值。配置不另存静态 Definition 集合，也不让调度器恢复具体内容类型。

每个行动创建程序生成配对的 Definition、持久 state、初始就绪的 Cooldown 和 execution: null；即使尚未启动也已经存在。持久 Action Ref 由宿主与 Definition 定位，跨多轮有效；每次 start 接收该引用，只创建本轮执行数据，宿主内 nextExecutionId 独立递增，返回携带 host 与本轮 execution.id 的 Execution Ref。onTick／onEnd 通过 Execution<P, E> 取得本轮完整视图，持久 state 与 execution.state 保持各自类型，宿主引用由回调参数提供。完成或取消只清空 execution，保留最新持久 state 与 Cooldown。Skill Capability 的 Definition 只保存 initialize 工厂，以 Result<Skill<any, any>> 接纳完整的不同私有类型聚合；State 扩展默认 Skill<object, object>，不建立另一套公开元数据类型。内容调用 unit/skill.create(battle, programDefinition)，接续 Definition.initialize(battle) → Result<S>，创建定义、持久 data、SP 与 activation: null；Capability 接续结果补规则、贡献、Hook 与 nextActivationId，本轮 A 在 activate 时建立。

路线、部署占格和 Card 归属等属于具体实例的创建业务。Placement 接收可选 tile，提供登记地块时要求 Unit 已声明 Occupancy，登记 Slot 来自该 Capability 的 Definition；状态与双槽反向表见 [Occupancy 与 Support](occupancy.md)；部署在通用初始化结果上设置本次费用与 Card 等字段。带路线的 Unit 由 battle/creation/routed-unit.ts 的 initialize(battle, input) 创建，公开 Input／Initialization，结果字段为 unit；它先规范化路线并采样总偏移，将最终 Route Definition 与初始位置交给 Unit 初始化。输出 Definition 保留原 D 的内容字段和各联合分支元数据，仅将 route 字段替换为规范化的 Route.Definition，不把原 Definition 收窄为通用能力配置。Route 与 Locomotion 通过 Catalog 独立装配，见 [Navigation、Route 与 Locomotion 设计](navigation.md)。

Core 不提供干员或敌人 Archetype 层；内容直接组合 Unit Definition 与所需的 Catalog Definitions，具体创建流程只声明实际需要的能力。Unit.initialize 是统一构造入口，负责按 Definition 建立能力配对。Unit 登记后的 Definition 与能力组成保持稳定，局部 State 可以更新；内部领域操作遵守此契约。路线可改变 SpatialPresence.present，不能临时安装或删除 SpatialPresence。查询与历史业务记录直接共享不可变 Unit，保留内容自有状态字段。

领域的结构存在性检查不反向依赖 Catalog。无需中央 hasCapability、CapabilityMap 或 DefinitionPart 描述业务依赖。

多文件 Capability 通过各自 index.ts 显式公开类型、局部变换、查询与业务操作；单文件的小能力保留 capability.ts 自然入口。完整列表及内部深导边界见[Core 入口表](api-conventions.md#core-领域入口与保留边界)，Catalog 继续直接使用实际初始化依赖，不经公共入口反向汇聚。

## 待整理：单位标签与 Profile 依赖

泥岩的萨卡兹减伤目前通过 content/operators/mudrock/unit.ts 的 hasSarkazTag 读取攻击者 definition.profile.tags。这里需要的是战斗中的单位标签语义，完整数据 Profile 不应成为跨内容查询接口。

后续整理单位标签时，应明确数据归属和查询接口，再迁移萨卡兹判断与 Profile 挂载。迁移必须保留现有减伤语义。标签归属确定前保留当前运行时依赖；名称、外观等展示信息与构造时已分配到各能力的基础属性分别按其职责处理。

## 构造、校验与命名

- Capability Definition 由 Content 直接构造，不要求额外的 createDefinition 工厂。几何构造等局部值转换由内容按需调用；必要的领域不变量校验放在 initialize，保持构造入口统一。其他领域尚存的历史工厂随各模块审查整理。
- Capability.initialize 使用当前 battle 和 Definition 建立初态，返回 Result<State>；内部纯值模型保留自己的自然初始化参数。
- validateState 验证已有值，返回 void，不伪装成构造。
- set／add／remove 是局部不可变更新；resolve 是有效值查询；advance 表达时间推进；完整结算使用领域动词。

不为统一前缀增加 normalize，不保留无工作转发，不以 Object.freeze 证明内部调用者遵守不可变约定。外部格式检查在 Data／I/O 边界，领域不变量由对应领域维护。跨模块出现同名类型和函数时，使用命名空间或有角色含义的导入别名。

## 属性与贡献

unit/contribution/attribute.ts 只定义明日方舟属性的 Modifier、create、apply。四字段和四段公式只属于 Attribute，不是所有数值过程的通用公式。动态 Input 由各领域声明：静态 Modifier 数组，或 `(battle, self: Unit & 本领域Capability) => readonly Modifier[]`；所属领域直接求值，不使用通用 Query Context 或 evaluate 包装。

Contribution<V> 没有默认载荷。通用模块只处理身份、登记、替换、移除和互斥；resolve 返回有效 V，不求值或展开。属性调用者显式采样并展开 Modifier 数组；特殊领域使用自己的载荷和计算。互斥优先级选择赢家，不能借此代替领域程序的执行顺序。

MaxHP 只接收明确采样的属性修正，在贡献变更时协调当前 HP 比例。各属性的范围、取整、采样和变化响应由所属领域维护。

### Offense

Offense Definition 保存基础 attack，State 保存 Contribution<Input>[]。Input 为静态 Modifier 数组，或只读的 `(battle, self: Unit & Offense) => readonly Modifier[]`。动态输入直接取得本次查询的 BattleState 与当前宿主，直接使用领域实体与战场事实，不依赖通用 Context 包装。

initialize(battle, definition) 校验 attack 为有限非负数，返回空贡献状态；Definition 由内容直接构造。setAttackContribution／removeAttackContribution 是本领域 State 的局部值转换，沿用 Contribution 的 ID 替换与互斥组规则。

公开查询为 query.resolveAttack(battle, Ref<Unit & Offense>)，从指定 battle 读取当前对象，不存在时返回 undefined。能力由 Typed Ref 保证，查询不把缺少 Offense 解释为攻击力 0，也不附加生命值、空间存在或生命周期检查。计算先选择有效贡献，只求值胜出项，再按 Attribute 公式求值并限制下限为 0，不取整。

采样与降级由调用业务决定。普通攻击模板在每个 SOURCE_ATTACK 输出时查询；弩手在发射时保存缓存，命中时沿用当前实时／来源移除后缓存的政策；泥岩 S2 在自疗和目标循环前采样一次。查询不负责这些政策，也不把攻击力读取变成 BattleState 操作。

## Layer 与 Hitbox

Unit.position 表达当前世界坐标；Layer 表达 GROUND／AIR 空地身份，Route.pathMotionMode 表达 WALK／FLY 通行方式。这三者独立，升空不自动改变坐标或寻路模式。

unit/capability/layer/capability.ts 的 Definition.type 提供初始身份，State.type 保存当前身份；领域消费者读取 unit.layer.type。Unit.position 与 SpatialPresence 表达位置和空间存在事实，不承担空地身份。Battlefield 不保存另一份位置索引。

unit/capability/hitbox/capability.ts 的 Definition.geometry 保存静态 ShapeGeometry，State 为空实现；索敌范围与弹道接触读取 unit.definition.hitbox.geometry。initialize 校验非空、稠密的形状集合，以及有限偏移、非负半径或半宽高；不复制几何到 State，不提供运行时形状修改接口。公开 API 只有 hasHitbox 与 initialize。

Hitbox 几何、Blocker 阻挡半径和 Locomotion.halfBodyWidth 分别用于受击接触、建立阻挡和地形避障，不相互代替。Targetable 的资格限制由其自身领域处理。

Battlefield 的通用空间查询领域使用 battlefield/spatial/ 命名，与单位空地身份 Layer 分开。范围重叠与形状扫掠的接口及资格边界见 [Spatial Query](spatial.md)。

## Blocking

Blocker 的 capacity 表示可用阻挡数，Blockable 的 volume 表示占用阻挡数；重量等级来自 massLevel，与阻挡占用分开。Data 的敌人 Profile 对应字段为 blockVolume，Capability 内不重复领域前缀。

两端 Definition 保存基础数值，State 保存按来源登记的静态 Contribution 与 Rule。Blocker 另保存当前 geometry。capacity／volume 由 resolveCapacity／resolveVolume 求值。capacity 使用 attribute.Modifier 的四段属性公式及 ties-to-even 整数化；volume 使用 Contribution<number>，筛选互斥胜者后累加整数追加量，不复用属性公式。项目约定 capacity 下限为 0，volume 下限为 1，volume 的基础值要求正整数；贡献将占用数降到 0 或负值时仍占用 1，不借零占用表达不可被阻挡。

canBlock 接收 Unit & Blocker，canBeBlocked 接收 Unit & Blockable；各自 Rule 的 allows 接收相同的能力交叉类型。Capability State 不维护第二个 enabled 开关，多个禁止效果按独立 ID 登记与撤销。Battlefield Facts 中的 enabled 是从当前 Rule 求值得到的只读结果。

阻挡事实读取当前贡献与规则。统一更新保留 Capability 的纯 State 修改方式和 unit.update() 的完整更新保证：完整提交同步完成必要的旧关系解除、容量裁撤、失效清理及 Hook，普通新关系搜索每 Tick 在 Movement 后的固定阶段统一执行，不保存各阻挡者的搜索周期；不为 Contribution 增加特殊完整更新 API。替换贡献但有效值不变时，不必重建阻挡投影。Blocker／Blockable 不提供 createDefinition，初始化负责基础数值与半径的不变量检查，内容负责提供几何值。职责与回调契约见[Blocking 政策](blocking.md#已确定的职责与调度政策)。

关系归属与关联由两端 State 保存。Blockable 的 blocker 保存 Ref<Unit & Blocker> 或 null，先确定排他归属；Blocker 的 blocked 保存按建立顺序维护的 Ref<Unit & Blockable>[]。unit.update 根据归属变化增量补齐对侧关联与索引，补齐阶段不执行关系业务 Hook，通知仍按 Blocker 先、Blockable 后派发。归属是否变化按 Unit ID 比较，同一次关系的身份由正向列表中保留的 Ref 条目对象承担；重新建立创建新条目，同归属普通更新保留条目。不支持直接 A → B 换归属，使用完整 Release 和新的 Acquire。归属通知与后续容量维护的相对顺序见 [Blocking 更新顺序](blocking.md#通知与后续维护的顺序)。

大君之触／大君之赐等“被阻挡后增加阻挡者容量”的内容尚未接入。满容量是否应继续尝试、关系结算后如何接续新容量，见 [Blocking 专项记录](blocking.md#满阻挡筛选与关系引起的容量变化)。

## 事件与结果

完整结算登记自身已发生的领域事件。调用方只接续返回状态，无需补写 Signals；公开 value 只保留业务结果。局部步骤可以报告尚未提交的事实或信号，由负责完整结算的领域消费。Tick 收尾允许根据 Removal Facts 等生成输出投影。

Skill 激活先一次性提交支付与新 Activation，再记录 SKILL_ACTIVATED，派发 activated Hook、spPaid Hook，重读同一身份及宿主资格后执行仍有资格的 onStart。activated 表示创建事实，后续嵌套终止不撤销创建或支付报告；无活动 Lifetime 结算时，先前 activated 候选可以触发 ended 嵌套；已有结算时，嵌套结束只同步完成请求与 Prepare。后续候选仍处理原创建事实。正常零持续期也先创建与通知，再请求结束。请求发布 ENDING，最外层结算器等真实依赖者完整 Finalize 后调用结束程序、清空本轮、记录事件并派发 ended；Unit 所有权保护原 Definition 和宿主到整个 Finalize 返回。详见 [Skill 设计](skill.md#5-发动与完整结束)。

已进入的同步内容与未来执行进度有各自的结束边界，具体后继资格由所属规则判断。官方普通原生依据见 [Skill 研究](../research/cases/05-skill-start-and-finish.md)。项目报告顺序是明确的工程约定，不冒充官方同名事件协议。

## 文件职责

Skill 的程序定义、Activation、SP／Ammo 与完整业务位于 [unit/skill](../../src/core/unit/skill/index.ts)；[capability/skill](../../src/core/unit/capability/skill/index.ts) 保留 Skill／State、守卫、initialize 及局部 Rule／Hook／Ammo／时长贡献 setter。完整程序 Definition 归 unit/skill/definition.ts，聚合归 skill.ts。Capability Definition 仅提供 initialize 工厂，State 扩展默认 Skill；程序由 unit.skill.definition 持有，不在 Unit Definition.skill 上重复保存。Catalog 继续从 Capability.initialize 签名推导工厂配置。两个 index 分别提供领域和能力 API，不相互转发整套入口。Skill 的 Hook 只用 setHook／removeHook 按 Key 登记，保留事件类型配对，不提供同义专名 setter。SP 的局部 setContribution／removeContribution 继续归领域 sp.ts，与资源类型同处，不增加 Capability 包装；Skill 静态 Modifier.priority 在 SP／时长贡献登记入口校验，每次 apply 仍校验动态程序输出。

文件按真实领域职责和代码规模划分。完整结算也是纯函数，纯度和参数大小都不能单独决定拆文件。小型内部步骤可以与完整操作同处；具有独立使用与理解价值的规则才单独组织。删除只转发的跳转层，保留 Unit 离场等确有业务顺序的分阶段操作。

重要业务语义查官方；条件性差异先检查真实中间业务；约一个 Tick 的小差异采用简单约定；无业务影响的工程中间过程不阻塞设计。
