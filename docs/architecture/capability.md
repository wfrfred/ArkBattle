# Capability 的数据与操作契约

Capability 按领域组织静态规则、当前状态和操作。每项 Capability 都具有配对的静态配置、State、能力接口和统一的 initialize；程序配置可由对应独立领域提供，例如 Skill Definition 归 unit/skill。没有静态配置或运行事实的一侧使用空实现，不使用 null 或省略字段代替。

Deployable Definition 仅声明固有撤退规则，State 保存本次来源 Card、COST、实际额度、退费依据和当前撤退规则。Capability 初始化建立未关联部署的初态；Deployment 在 Unit 登记前写入本次事实，直接使用 Content 的完整静态 Unit Definition。Card 创建入口接收这同一份定义，通用 Unit／Catalog 不识别 card 字段。完整流程见 [Deployment](deployment.md)。

## 数据与类型

单一领域模块使用 Definition、State 与该能力的名称。多个概念共存时保留能区分角色的名称，例如 Blocker／Blockable、ActionDefinition 与 Action Capability 的 Definition。Layer 与 Hitbox 分别位于独立领域目录，使用各自的 Definition 与 State。

```typescript
interface Vitality {
    readonly definition: { readonly vitality: Definition };
    readonly vitality: State;
}
```

Definition 保存静态参数与行为描述，State 保存本领域当前事实。结构相同的配置与初态可以共享引用；更新当前状态创建新值，不修改配置。Unit 可以不选择某项能力；一旦选择，对应 Definition 和 State 必须同时存在。SpatialPresence 使用空 Definition，Hitbox 使用空 State；空定义和空状态均使用 interface {}。Occupancy Definition 声明 Slot，State 记录当前登记地块、实例朝向和已通知的配对事实。Targetable 的 Definition 使用必填 restrictions 数组声明固有限制，初始化复制贡献容器建立 State；空数组表示没有固有限制，详见 [Targeting 与 Targetable 类型](targeting.md)。Skill.activation 为 null 等领域内部业务状态不受此配对约定限制。

基础 Unit 是非泛型接口，保留运行时实例 ID 与 definition.id 对应的静态内容身份。通用工厂返回 Unit 基础结构与明确选择的能力的标准 Definition／State 组合。Skill／Action Capability 本身非泛型，不把具体程序的私有类型传播到宿主 Unit、SP、Rule、Hook 或 Contribution。Core 从当前 unit.skill 直接读取完整单槽聚合；已知 Definition 构造持久 Ref、已知非空聚合构造本轮 Ref，分别保持私有类型配对。需要某项能力的业务通过 Unit 与对应 Capability 的交叉类型声明依赖。

各领域保留 hasVitality／hasSkill 等结构守卫。它们可以使用泛型保留调用者已知结构，因为守卫不更新值。普通状态变换不承诺保留任意输入字面量类型，也不使用 StableUnit／widenUnit。Core 遵守 readonly 与约定式不可变，无需所有权接管与反复复制。

## 操作范围

纯数值与几何等局部计算仍直接接收值、返回值。对已登记 Unit 的公开 Rule、Hook、Contribution、Layer.type 与 Blocker.layer 写入则统一为 `setXxx(ref, value): Change`／`removeXxx(ref, id): Change` 工厂；Content 不接触任意 Unit 转换函数。Core 用 createChange 将目标、纯 transform 与可选 settle 配对，Unit.update 先完成全批转换、一次发布，再原顺序结算。跨能力 Rule 仍可只读完整 Unit 与 BattleState，不把真实业务输入压成通用上下文。

Capability 也可提供接收 BattleState 与 Typed Ref 的完整操作，例如 SpatialPresence.appear／disappear 与 Locomotion.advance；是否需要时间推进、资格判断或领域结算由实际业务决定。Rule、Hook、Contribution、Layer.type 与 Blocker.layer 的工厂不自行提交；有后继的 Change 在发布后同步结算，无后继的 Hook Change 只改变集合。完整私有 state／生命周期操作保持各自原协议，见 [批量变更](api-conventions.md#51-unit-完整操作与批量变更)。

完整结算接收当前 BattleState，按业务顺序返回已结算的新版本。有额外拒绝原因、结算报告或新身份时返回 `{ state, value }`，否则直接返回 State。普通查询不推进世界。所谓提交指生成并接续后继值；Tick 成功后，Runtime 才发布最终版本。

## 初始化与装配

每项 Capability 的公开初始化契约统一为：

```typescript
initialize<U extends Unit & Pick<Capability, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Capability>
```

这里的 Capability 代表各自的能力接口，例如 Vitality 或 Skill。输入 Unit 已声明本能力的 Definition，initializer 直接读取 unit.definition 中的配置；Result.state 接续 BattleState，Result.value 返回保留已有字段并补充自身能力的新 Unit。具有前置能力依赖的 initializer 也在输入类型中声明该依赖。Occupancy 可以另接收可选的 `{ tile?, direction? }` 创建参数；Catalog 从 initializer 签名派生 Inputs，Initial<D> 仅表达所选能力的可选创建输入，不接收任意预装 State。Deployable 沿用两参数初始化，不为部署事实扩展通用构造协议。初始化可以直接登记自身的 Unit Hook，不经通用装配器识别具体能力。不改变战斗事实时返回原 battle；当前时间从 battle.tick 读取，不传独立 tick 或只有时点的 Context。Skill 的 SP、Sustain 等内部值模型仍使用各自的局部初始化接口，不因名称相同改为 Unit 装配操作。

Catalog 只登记 capability → initializer 字典，并从函数签名派生配置、状态及能力组合类型：

```typescript
export const initializers = {
    vitality: vitality.initialize,
    elemental: elemental.initialize,
    skill: skill.initialize,
} as const;

export type Definitions = {
    readonly [K in keyof typeof initializers]:
        Parameters<(typeof initializers)[K]>[1]["definition"] extends
            Readonly<Record<K, infer D>> ? D : never;
};

export type States = {
    readonly [K in keyof typeof initializers]:
        ReturnType<(typeof initializers)[K]>["value"] extends
            Readonly<Record<K, infer S>> ? S : never;
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

Unit 装配实现在 unit/initialize.ts，由 [unit/index.ts](../../src/core/unit/index.ts) 公开 initialize(battle, input) → Result<Unit & Product<D>> 及模型、Hook 类型和查询；完整登记与离场操作仍直接归 battle/unit.ts。Input 的 id、definition、position 为必填，hooks 与 initial 可选，不接收 effects；基础 Unit 具有原始 Definition、位置、PRESENT、调用方已登记的 hooks（缺省为空）和 Effects.empty()。初始 Effect 仍由登记后的 enter Hook 调用 install，正常执行安装、生效与依赖结算。实现按 Definition 中的配置键选择 initializer，将当前 battle、正在装配的 Unit 和该项初始输入传给它；异构 initializer 的类型只在 fold 派发处擦除。不使用 Reflect，不重复检查内部能力配置是否为 undefined 或 null，不维护另一套能力专属分支。已知能力的 Definition 受 Catalog 派生类型约束；公开装配结果只承诺明确选择的能力，Skill／Action 的私有类型仍由所属领域恢复。

Unit.initialize 是对所选 initializer 列表的 fold：从调用方已登记初始 Hooks 的基础 Unit 开始，按 Catalog 登记顺序逐个接续 Result 中的 battle 与 Unit，最后 merge Definition.hooks。同键同 ID 后者覆盖前者并保留首次出现的位置，执行时不重复去重。每项 initializer 保留身份、Definition、已有能力及登记项，补充自身状态或 Hook；Skill 登记 enter，Occupancy 登记入场／离场配对程序，Deployable 登记实际占用释放的本地 leave。部署来源预先登记部署通知与被动死亡响应，主动撤退的退款、Card 费用阶段与库存恢复由领域操作在请求离场前直接结算。Blocker 或 Blockable 将必要清理 prepare 放在该键的序列前部。这里表达显式登记顺序，不按来源类型增加生命周期阶段或普遍优先级。通用初始化器及 Unit 生命周期操作不解释这些具体领域。初始化可以读取当前战场或消费 RNG，但当前 Unit 尚未登记；已有能力直接从输入 Unit 读取，不通过战场查询半成品。所有固有 Hook，包括结算 Hook，均在完整 add 与任何入场程序之前就绪。

Unit Definition、创建输入和实例 hooks 使用[类型化键组织的 Hooks 集合](hook.md)，无登记时显式使用 Hooks.empty()。通用 Unit.setHook／removeHook 返回 Change，允许运行期间修改生命周期键。enter／tick／prepare 固定候选 ID 和 Context，逐项读取最新登记；enter／tick 每项前确认宿主仍为 PRESENT，prepare 使用既定 Departure。leave 在注销前捕获最新 Hook 集合，注销后按该快照执行，Departure 的历史事实不变。全局 Unit 观察者和 Capability 专属登记继续使用各自的存储与派发入口。

Deployable 单向依赖 Occupancy，类型以交叉组合表达，initialize(battle, unit) 接收已经具有 Occupancy 的 Unit，Catalog 先构造 Occupancy 再构造 Deployable。Deployable 初态为 card:null、cost:0、slots:0、refund:null，撤退规则来自静态 Definition。Deployment 消费资源、调用 Unit.initialize 后，在尚未登记的 Unit 上写入本次来源 Card、COST、部署位份额和退费依据，再登记并执行 enter。Deployment 在 fold 前登记的 Hook 保留原位置；能力构造的前置依赖不改变程序登记顺序。主动撤退在请求离场前结算退款、Card 费用阶段与库存恢复；被动死亡程序只响应已确认死亡。共有占格与占用释放覆盖各类真实离场。完整契约与支持范围见 [Deployment](deployment.md)。

Action Capability 的 Definition 保存 initialize(battle) → Result<Actions> 和可选 select。具体内容在类型明确处创建行动初始化函数，再以 createActions 顺序组合；Capability 接续返回的 BattleState，将 Actions 放入公共 State，并建立执行 ID 计数、贡献、规则和 Hook 的初值。配置不另存静态 Definition 集合，也不让调度器恢复具体内容类型。

每个行动创建程序生成配对的 Definition、持久 state、初始就绪的 Cooldown 和 execution: null；即使尚未启动也已经存在。持久 Action Ref 由宿主与 Definition 定位，跨多轮有效；每次 start 接收该引用，只创建本轮执行数据，宿主内 nextExecutionId 独立递增，返回携带 host 与本轮 execution.id 的 Execution Ref。onTick／onEnd 通过 Execution<P, E> 取得本轮完整视图，持久 state 与 execution.state 保持各自类型，宿主引用由回调参数提供。完成或取消只清空 execution，保留最新持久 state 与 Cooldown。Skill Capability 的 Definition 只保存 initialize 工厂，以 Result<Skill<any, any>> 接纳完整的不同私有类型聚合；State 扩展默认 Skill<object, object>，不建立另一套公开元数据类型。内容调用 unit/skill.create(battle, programDefinition)，接续 Definition.initialize(battle) → Result<S>，创建定义、持久 state、SP 与 activation: null；Capability 接续结果补规则、贡献、Hook 与 nextActivationId，本轮 A 在 activate 时建立。

路线、部署占格和 Card 归属等属于具体实例的创建业务。Occupancy 用 initial.occupancy 的 tile／direction 初始化本次登记与朝向，Slot 来自该能力的 Definition，状态与双槽反向表见 [Occupancy 与 Support](occupancy.md)。Deployment 和 Predefined 调用 Unit.initialize。关卡开场 Unit 使用 initiallyPresent:true 的预置项，Predefined 负责别名、出现／移除命令和当前实例绑定。带路线的 Unit 由 battle/creation/routed-unit.ts 的 initialize(battle, input) 创建，返回 Result<Unit & Route> 及所选能力；它先规范化路线并采样总偏移，将最终 Route Definition 与初始位置交给 Unit 初始化。输出 Definition 保留原 D 的内容字段和各联合分支元数据，仅将 route 字段替换为规范化的 Route.Definition，不把原 Definition 收窄为通用能力配置。Route 与 Locomotion 通过 Catalog 独立装配，见 [Navigation、Route 与 Locomotion 设计](navigation.md)。

Core 不提供干员或敌人 Archetype 层；内容直接组合 Unit Definition 与所需的 Catalog Definitions，具体创建流程只声明实际需要的能力。Unit.initialize 是统一构造入口，负责按 Definition 建立能力配对。Unit 登记后的 Definition 与能力组成保持稳定，局部 State 可以更新；内部领域操作遵守此契约。路线可改变 SpatialPresence.present，不能临时安装或删除 SpatialPresence。查询与历史业务记录直接共享不可变 Unit，保留内容自有状态字段。

当前项目将 Blocker 与 Blockable 约束为至多一种，也允许 Unit 两者皆无。Blocking 的构造入口确认组合，通用 Unit 不点名这两个能力；内部信任能力身份不变，不重复检查互斥。该约束不推导阵营、自身 Layer、Route 或 Locomotion，也不把容量为 0 或暂时禁挡视为能力消失。

领域的结构存在性检查不反向依赖 Catalog。无需中央 hasCapability、CapabilityMap 或 DefinitionPart 描述业务依赖。

多文件 Capability 通过各自 index.ts 显式公开类型、局部变换、查询与业务操作；单文件的小能力保留 capability.ts 自然入口。完整列表及内部深导边界见[Core 入口表](api-conventions.md#core-领域入口与保留边界)，Catalog 继续直接使用实际初始化依赖，不经公共入口反向汇聚。

## 待整理：单位标签与 Profile 依赖

泥岩的萨卡兹减伤目前通过 content/operators/mudrock/unit.ts 的 hasSarkazTag 读取攻击者 definition.profile.tags。这里需要的是战斗中的单位标签语义，完整数据 Profile 不应成为跨内容查询接口。

后续整理单位标签时，应明确数据归属和查询接口，再迁移萨卡兹判断与 Profile 挂载。迁移必须保留现有减伤语义。标签归属确定前保留当前运行时依赖；名称、外观等展示信息与构造时已分配到各能力的基础属性分别按其职责处理。

## 构造、校验与命名

合法构造入口建立 Definition／State 配对、能力依赖和身份约束；登记后的内部操作信任这些不变量，不把内容私有状态重新视作未知 JSON，也不重复检查 Typed Ref 已证明的能力。初值与写回遵守所属领域的职责，不能绕过领域操作，靠任意 State 覆写补出缺失能力或部署事实。Deployment 在 Unit 初始化后、登记前写入本次部署事实属于合法的领域创建流程。测试夹具同样遵守这些边界。

- Capability Definition 由 Content 直接构造，必要的领域不变量校验放在 initialize。Action 的 Definition 提供 initialize 与可选 select；Elemental 的标准爆发由 Core 的具体 Effect 实现，Data 选择具体实现并绑定数值，能力初始化校验基础数值和各型爆发时长。几何构造等局部值转换由内容按需调用。
- Capability.initialize 使用当前 battle 和正在装配的 Unit，读取自身 Definition，返回 Result<U & Capability>；内部纯值模型保留自己的自然初始化参数。
- validateState 验证已有值，返回 void，不伪装成构造。
- Rule、Hook、Contribution 与 Blocker.layer 的 set／remove 工厂绑定 Ref 返回 Change；add、生命周期与精确私有 state 写回维持所属领域完整操作；resolve 查询有效值，advance 表达时间推进。Change 的后继由领域明确提供，不由 Unit 发布推断。

不为统一前缀增加 normalize，不保留无工作转发，不以 Object.freeze 证明内部调用者遵守不可变约定。外部格式检查在 Data／I/O 边界，领域不变量由对应领域维护。跨模块出现同名类型和函数时，使用命名空间或有角色含义的导入别名。

Deployable Definition 声明 retreatRules。Card 配置归 battle/deployment/card/definition.ts，由完整静态 Unit Definition 的顶层 card 字段提供；initialize 必填，无私有数据时显式返回空对象。Card.unitHooks 通过 setUnitHook／removeUnitHook 管理以后部署的 Unit 生命周期程序，Deployment 在构造前将它们加入 Unit 的初始 Hook 序列。

## Allegiance

Allegiance 保存 ALLY、ENEMY、NEUTRAL 三种 Side，表达阵营关系，不表示干员、敌人、装置等实体类别。标准敌对判定为一方属于 ENEMY、另一方不属于 ENEMY；ALLY 与 NEUTRAL 之间不因此互为敌对。

阵营只是相应业务规则的输入，不自动决定是否可索敌、可受伤或可阻挡。Blocking 由双方资格与明确选择的 Rule 判断，不把普通干员采用的 ENEMY 侧策略提升为所有阻挡关系的公理。

## 属性与贡献

unit/contribution/attribute.ts 只定义明日方舟属性的 Modifier、create、apply。四字段和四段公式只属于 Attribute，不是所有数值过程的通用公式。动态 Input 由各领域声明：静态 Modifier 数组，或 `(battle, self: Unit & 本领域Capability) => readonly Modifier[]`；所属领域直接求值，不使用通用 Query Context 或 evaluate 包装。

Contribution<V> 没有默认载荷。通用模块只处理身份、登记、替换、移除和互斥；resolve 返回有效 V，不求值或展开。属性调用者显式采样并展开 Modifier 数组；特殊领域使用自己的载荷和计算。互斥优先级选择赢家，不能借此代替领域程序的执行顺序。

MaxHP 只接收明确采样的属性修正，在贡献变更时协调当前 HP 比例。各属性的范围、取整、采样和变化响应由所属领域维护。

### Offense

Offense Definition 保存基础 attack，State 保存 Contribution<Input>[]。Input 为静态 Modifier 数组，或只读的 `(battle, self: Unit & Offense) => readonly Modifier[]`。动态输入直接取得本次查询的 BattleState 与当前宿主，直接使用领域实体与战场事实，不依赖通用 Context 包装。

initialize(battle, unit) 校验 unit.definition.offense.attack 为有限非负数，在保留输入 Unit 的同时建立空攻击贡献状态；Definition 由内容直接构造。setAttackContribution／removeAttackContribution 绑定 Ref<Unit & Offense> 返回 Change，沿用 Contribution 的 ID 替换与互斥组规则；无额外结算，不启动 Blocking。

公开求值为 query.resolveAttack(battle, self: Unit & Offense): number。调用业务先取得当前宿主并确认能力，求值直接使用该对象，不重复定位或判空，也不附加生命值、空间存在或生命周期检查。计算先选择有效贡献，只求值胜出项，再按 Attribute 公式求值并限制下限为 0，不取整。

采样与降级由调用业务决定。普通攻击模板在每个 SOURCE_ATTACK 输出时查询；弩手在发射时保存缓存，命中时沿用当前实时／来源移除后缓存的政策；泥岩 S2 在自疗和目标循环前采样一次。查询不负责这些政策，也不把攻击力读取变成 BattleState 操作。

## Layer 与 Hitbox

四向摆放朝向归 Occupancy，occupancy.direction 为 Direction 或 null；本次摆放方向通过 initial.occupancy.direction 建立，不写入 Content 的静态 Definition。部署路径从 Request.direction 提供该输入，其它创建路径由对应入口提供。占格不意味着一定有朝向，装置可以为 null；基础 Unit 不增加字段，也不建立独立 Direction Capability。setDirection 返回绑定 Occupancy Ref 的 Change，hasDirection 只缩窄非 null 的字段。方向相关索敌读取当前实例，不在共享 Action 程序里捕获本次方向。几何 Direction 类型和坐标旋转仍属于 Geometry，不反向依赖 Unit；当前领域选择不预设未来所有方向需求都必须占格。

Unit.position 表达当前世界坐标；Layer 表达 GROUND／AIR 空地身份，Route.pathMotionMode 表达 WALK／FLY 通行方式。这三者独立，升空不自动改变坐标或寻路模式。

unit/capability/layer/capability.ts 的 Definition.type 提供初始身份，State.type 保存当前身份；领域消费者读取 unit.layer.type。Unit.position 与 SpatialPresence 表达位置和空间存在事实，不承担空地身份。Battlefield 不保存另一份位置索引。

Layer 的 `setType(reference: Ref<Unit & Layer>, type: Type): Change` 归 operations.ts，经 index.ts 与模型、守卫和 initialize 显式导出；Core 只需模型时继续直接依赖 capability.ts。它设置自身空地身份，与 Blocking.setLayer 调整可阻挡目标层的操作不同。setType 同时主动脱离阻挡，即使 type 相同也执行清理，每次形成新的 Layer State 和 Unit，不改变通用 update 的同引用跳过协议。全批 transform 先发布，settle 再按 previous 的稳定角色分支：Blocker 捕获 previous.blocker.blocked 中的原 Ref，批量解除旧出向关系，Hook 重建的新 Ref 不受旧请求影响；Blockable 调用自身 release，按最新状态解除入向关系并取消位置计划，后续独立请求仍可再次脱离当前关系；两种角色皆无时只更新身份。该操作不自动搜索，不修改 Definition、position、Route.pathMotionMode 或 Blocker 自己的 layer／radius，也不代替浮空效果的其他业务。原生边界见[运动调查](../research/cases/15-locomotion-native-semantics.md)和[蒂比起飞调查](../research/cases/21-tippi-air-blocking.md)。

unit/capability/hitbox/capability.ts 的 Definition.shape 保存单个静态 Shape，State 为空实现；Spatial 与采用相交判定的 Targeting 读取 unit.definition.hitbox.shape。initialize 校验有限偏移、非负有限半径或半宽高；不复制几何到 State，不提供运行时形状修改接口。公开 API 只有 hasHitbox 与 initialize。

Hitbox 几何、Blocker 阻挡半径和 Locomotion.halfBodyWidth 分别用于受击接触、建立阻挡和地形避障，不相互代替。Targetable 的资格限制由其自身领域处理。

Battlefield 的通用空间查询领域使用 battlefield/spatial/ 命名，与单位空地身份 Layer 分开。范围重叠与形状扫掠的接口及资格边界见 [Spatial Query](spatial.md)。

## Blocking

Blocker 的 capacity 表示可用阻挡数，Blockable 的 volume 表示占用阻挡数；重量等级来自 massLevel，与阻挡占用分开。Data 的敌人 Profile 对应字段为 blockVolume，Capability 内不重复领域前缀。

两端 Definition 保存基础数值，State 保存按来源登记的静态 Contribution 与 Rule。Blocker 自己定义 Layer = GROUND | AIR，表示能够阻挡的目标层，不依赖宿主自身的 Layer Capability。Blocker Definition 的 layer、rules 必填；无规则时明确写 []。radius 可选，省略时 Core 为 GROUND 提供半径 0.7071、为 AIR 提供 0.8944；State 保存当前 layer 与实际 radius。初始化和切层均采用 definition.radius ?? DEFAULT_RADIUS[layer]，显式半径覆盖在切层后仍保持。普通 Content 不再重复配置标准半径，内部默认半径常量不作为公共配置导出。

capacity／volume 由 resolveCapacity／resolveVolume 求值。Blocking 容量 Modifier 为 `{ type: "ADD", value: number } | { type: "ZERO" }`，State.capacity 保存 Contribution<readonly Modifier[]>；setCapacityContribution(reference, entry) 返回带本 Blocker 容量裁撤 Settlement 的 Change。通用 Contribution 只选生效来源，Blocking 展平 Modifier：任一有效 ZERO 使容量为 0，否则全部 ADD 加到基础 capacity，再 ties-to-even 整数化并限制下限 0。互斥未胜出的 ZERO 不生效，撤销有效 ZERO 后按剩余来源计算。这是项目接口选择，不追加原生公式结论。

volume 使用 Contribution<number>，筛选互斥胜者后累加整数追加量。项目约定 volume 下限为 1，基础值要求正整数；贡献将占用数降到 0 或负值时仍占用 1，不借零占用表达不可被阻挡。

公共 Relation、Context、Hook、Key 归 unit/capability/blocking/contract.ts，与模型及 Change 工厂一起由 capability/blocking/index.ts 导出。blocker-operations.ts／blockable-operations.ts 提供 setLayer、两端 Rule／Hook、容量／volume 的工厂，接收相应 Typed Ref 与业务输入，返回 Change。blocker.ts／blockable.ts 保留模型与 initialize／resolve／has，Blockable 模型还提供 stableBlockPosition 查询；Catalog 和查询直接依赖模型；公共入口不增加包装。宿主存在性在 Unit.update 准备时统一确认，允许存储中的 LEAVING 对象清理。battle/blocking/index.ts 提供关系查询及 acquire／release／maintain／maintainAll／search／advance，不重复导出 setLayer。relations(battle, ref?) 支持直接读取局部关联并保留原 Ref；release 接收 readonly Relation[]，maintain 接收单条 Relation，均保留双方 Typed Ref 与原关系身份。内部共享的 settleCapacity 不经公共入口导出。

两端共享 unit/capability/blocking/rule.ts 的 Rule，经 capability/blocking/index.ts 导出。唯一签名为 `allows(battle, blocker, blockable)`，参数分别是 BattleState、完整的 Unit & Blocker 和 Unit & Blockable；规则可以查询双方其他能力，不执行状态写入。两端 rules 只表达登记所有者，Blocking 的 canRetain 按相同参数顺序检查双方规则，不提供一元资格查询或各端同义 Rule 类型。Capability 不维护第二个 enabled 开关，Battlefield 也不保存从二元资格投影出的单体 enabled；多个限制按独立 ID 登记与撤销。完整签名及取得、保留与容量的边界见 [关系资格与 Rule](blocking.md#关系资格与-rule)。

阻挡事实读取当前 layer、radius、贡献与双方 Rule。canSearch 判断基础搜索资格，GROUND 要求根格 allowsBlocking，AIR 豁免；canRetain 检查双方 PRESENT、空间存在、层匹配和 Rule，旧关系不因临时 HP 为 0 失效；新 acquire 仍要求双方有 Vitality 时 HP 大于 0。无 Unit Layer 的 Blockable 不隐式作为 GROUND，但不强制跨能力构造依赖。距离和无归属只限制新取得；容量超额另行裁撤。Rule Change 的 Settlement 固定自身相关关系，逐条调用 maintain(battle, relation) 复核资格；不维护其他关系或裁容量。容量 Change 的 Settlement 只裁撤本 Blocker，volume Change 在 settle 读取当前 owner 并结算该阻挡组，不在 Hook 后追随新 owner；两者共享内部 settleCapacity，每条末尾解除的 Hook 返回后重新读取当前占用与容量，不先扫描失效资格。

Rule 可以读取时间、第三方单位等任意 Battle 事实，系统不跟踪函数依赖，也不让每次字段发布都执行全场维护。每 Tick 的 Blocking 阶段先固定阶段初 Blocker 候选，再通过 maintainAll 固定入口既有关系、按顺序各复核一次资格，最后搜索新关系。完整地块更新同样显式调用 maintainAll；它不裁容量、不重新收集候选或回头复核已访问项。晚于某条复核才发生的间接条件变化在下一检查点反映，需要同步生效的业务明确执行相应关系操作。

切换阻挡层使用 `setLayer(Ref<Unit & Blocker>, layer): Change`。transform 只更新 layer／radius；同层请求返回原 Unit，由 update 统一跳过后继；实际变化的 settle 将 previous.blocked 的原 Ref 组成 Relation 数组交给 release。后继不重做 transform、不写回旧 Unit；首个 RELEASED 前本次有效旧集合的双端解除已发布，不附加维护或搜索。混合批次中较早的其他后继可能先处理部分旧关系，不能把切层自身的批量可见性扩为全批首个 RELEASED 的保证。切换不改变自身 Layer、不增加 Hook 或 Contribution；细节见 [Blocking 批次契约](blocking.md#显式关系操作与同步维护)。

关系归属与关联由两端 State 保存：Blockable.blocker 是唯一 owner 或 null，Blocker.blocked 是按建立顺序保留的目标 Ref 数组。acquire 发布双端与新计划后通知，再复核本次新 Relation 的资格；不扫描整个阻挡组或裁容量。release 入口过滤失效旧身份与重复项，整批发布双端解除，再按首次输入顺序逐条通知；每条仍先 Blocker、后 Blockable，双方 Hook 候选在该条通知开始时同时固定。release 不附加维护、搜索或计划取消。通用发布不补齐或比较关系。同一次关系的身份由正向列表中的 Ref 条目对象承担，重建必须创建新条目，普通字段更新共享既有引用。转移使用完整 Release 和新 Acquire。

Blockable.State 另保存 `adjustment: PositionAdjustment | null`，计划只有 `from`、`to` 和 `startTick`。acquire 以当前真实位置和先前目标的 stableBlockPosition 计算普通 0.5 最小间距与分散站位，将计划与双端关系一起发布后才通知 ACQUIRED。`Unit.position` 是唯一真实坐标；稳定位置在有关系时取计划终点，否则取当前坐标，不重复保存。固定 30 Hz 下，位置按 0.2 秒、6 Tick 线性推进，完成后清计划，不额外保存 Tween、progress 或 velocity。

`blockable-operations.ts` 提供完整的 `advancePosition(battle, Ref<Unit & Blockable>)` 与 `release(battle, Ref<Unit & Blockable>)`，公共入口分别导出 advancePosition 和 releaseBlockable，并导出模型查询 stableBlockPosition。前者只推进并提交自身位置与计划，不调用关系维护；依赖位置的 Rule 在 Blocking 检查点复核。后者先纯发布自身计划取消，再以 relations(battle, ref) 的局部结果调用 Blocking.release。两步之间没有回调，首次 RELEASED 已可见完整结果。Blocking.release 只解除关系，Blocker 离场／切层／容量裁撤也保留目标计划；孤立计划可由 Blockable.release 单独取消。

Movement 绑定本轮起始的 Unit Query，分两遍先推进 Blockable 偏移，再推进 Route 与符合资格的 Locomotion；每步单独过滤，不为固定枚举提前生成 Ref 数组或调用 toArray()。偏移存在或刚完成不构成自主禁移条件，偏移不借用 Locomotion Rule 或重置自主速度。Presence／Route 的主动空间覆盖及自身 Unit 离场先纯发布所属字段和自身计划取消，再解除局部关系；首个 Hook 可见完整结果，无需一次 replace 同时承接空间与关系数据。项目保留当前 Movement 阶段位置，不声称完全复制原生全局 Tween 调度。

大君之触／大君之赐等“被阻挡后增加阻挡者容量”的内容尚未接入。满容量是否应继续尝试、关系结算后如何接续新容量，见 [Blocking 专项记录](blocking.md#满阻挡筛选与关系引起的容量变化)。

## 事件与结果

完整结算通过公开 value 返回业务结果，通过 Hook 执行同步响应。仅有实际 UI 瞬时需求时，由事实所属领域定义 Event，在发生时点追加至 BattleState.events；不要求完整操作为全部变化记录事件，不通过事件反推统计或业务。具体归属与载荷见 [UI 瞬时输出](event.md)。

Skill 激活先一次性提交支付与新 Activation，再记录 SKILL_ACTIVATED，派发 activationStarted Hook、spPaid Hook，重读同一身份及宿主资格后执行仍有资格的 onStart。activationStarted 表示创建事实，后续嵌套终止不撤销创建或支付报告；无活动 Lifetime 结算时，先前 activationStarted 候选可以触发 activationEnded 嵌套；已有结算时，嵌套结束只同步完成请求与 Prepare。后续候选仍处理原创建事实。正常零持续期也先创建与通知，再请求结束。请求发布 ENDING，最外层结算器等真实依赖者完整 Finalize 后调用结束程序、清空本轮、记录事件并派发 activationEnded；Unit 所有权保护原 Definition 和宿主到整个 Finalize 返回。两项公共报告分别为 ActivationStarted `{ ref }` 与 ActivationEnded `{ ref, end }`，不携带 Definition 或私有 state；Context.host 已提供宿主，结束报告中的 Ref 不保证本轮仍可查询。详见 [Skill 设计](skill.md#5-发动与完整结束)。

已进入的同步内容与未来执行进度有各自的结束边界，具体后继资格由所属规则判断。官方普通原生依据见 [Skill 研究](../research/cases/05-skill-start-and-finish.md)。项目报告顺序是明确的工程约定，不冒充官方同名事件协议。

## 文件职责

Skill 的程序定义、Activation、SP／Ammo 与完整业务位于 [unit/skill](../../src/core/unit/skill/index.ts)；[capability/skill](../../src/core/unit/capability/skill/index.ts) 保留能力、守卫、initialize 及 Rule／Hook／Ammo 贡献 Change 工厂。Capability Definition 只提供 initialize，State 扩展默认 Skill；程序由 unit.skill.definition 持有。setHook／removeHook 按 Key 保留载荷配对并绑定 Ref；SP 的 setContribution／removeContribution 同样返回 Change，仍归 sp.ts，只登记 recoverySpeed／recoveryMultiplier，不套 Capability 转发。数值输入复用 Input<M,H>，SP 自然回复用 Attribute，Ammo 保留独立公式；配置切换、消费和本轮延时不通过贡献登记。

文件按真实领域职责和代码规模划分。完整结算也是纯函数，纯度和参数大小都不能单独决定拆文件。小型内部步骤可以与完整操作同处；具有独立使用与理解价值的规则才单独组织。删除只转发的跳转层，保留 Unit 离场等确有业务顺序的分阶段操作。

重要业务语义查官方；条件性差异先检查真实中间业务；约一个 Tick 的小差异采用简单约定；无业务影响的工程中间过程不阻塞设计。
