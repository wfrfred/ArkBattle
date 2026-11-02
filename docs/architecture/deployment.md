# Deployment、Card 与 Unit 生命周期

Deployment 完成一次部署的资格判断、资源消费、实例创建和部署通知。Card 保存跨部署状态，Deployable 保存本次场上实例的部署事实，Occupancy 保存占格和摆放朝向，Unit 与 Lifetime 负责通用实例生命周期。

原生研究用于确认业务条件、结果、继承和关键时序，项目按这些语义划分领域。当前支持普通按格部署、主动撤退和被动死亡结算。

## 关键语义

验收按以下业务结果选择代表场景，不为每个字段、资源 Setter 或 Hook 节点分别建立矩阵。通用状态接续与依赖完成要求见[函数式内核](functional-core.md#状态接续后的读取与续执行)和 [Lifetime](lifetime.md)。

1. **资格与消费一致。** 预览和实际部署使用同一完整 Request、规则合并方式和当前资源事实。预览不消费资源或创建实例；拒绝部署不消费；规则通过后先提交 DP、库存及部署额度，再构造、登记和执行入场程序。
2. **部署事实属于本次实例。** 本次 COST、退款依据、占用额度和来源 Card 在登记前确定；朝向和地块是实例输入。Card 跨场上实例存续，持久资源不因每次部署重新初始化。
3. **主动撤退与死亡分别结账。** 撤退先按本次部署事实退款、处理 Card，再请求 Unit 结束；被动死亡只在确认死亡后通过已登记程序处理。普通 SCRIPT／EXPIRED 离场不冒充死亡，也不重复执行主动撤退的账务。
4. **离场先清理结构与额度，再通知内容。** 真实依赖者完整结束后，注销 Unit 并释放结构占格，再归还本次占用的部署额度、结算死亡 Card，随后执行内容与配对通知。嵌套结束只完成请求时，不提前宣称对象已注销或额度已归还。
5. **库存与时间不凭空增减。** 部署间隔和库存恢复相互独立；逐份恢复按各段启动时采样预算，暂停保存剩余时间，修改当前段不消费后段预算，补库存不重置时钟。
6. **DP 按账户规则运行。** 支付不补发满额期间的自然回复；负 DP 仅使自然回复减半，主动增费不减半；跨零保留已有回复进度。

## 状态归属

| 事实 | 所属领域 |
| --- | --- |
| 实例身份、真实位置、PRESENT／LEAVING | Unit |
| 登记地块、摆放朝向、Support／乘员业务配对 | Occupancy |
| 当前 DP、回复进度、部署位账户 usedSlots | Deployment |
| 库存、计时、费用阶段、私有 state | Card |
| 来源 Card、本次 COST、占用额度、退费依据、撤退规则 | Deployable |

Capability 初始化时登记所需的普通生命周期程序，完整领域操作负责自身结算；Unit 负责通用登记、发布和已登记程序的执行。

## 静态内容与 Card

Card 位于 battle/deployment/card，由 Deployment 持有集合与顺序。它是跨多次场上实例存续的部署资源，不属于某个 Unit 的生命周期。

内容提供一份完整静态 Unit Definition，顶层平铺声明 card、occupancy、deployable 及其他能力。Card.definition 保留这份原对象，Card 配置从 definition.card 读取，每次部署直接复用同一静态 Definition。

```typescript
interface Refund {
    readonly rate: number;
    readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
}

interface Definition<S extends object = object> {
    readonly cost: number;
    readonly redeployTicks: number;
    readonly slots: number;
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly refund: Refund | null;
    readonly cooldownOnDeploy: boolean;
    readonly recoverOnLeave: boolean;
    readonly increaseCostOnLeave: boolean;
    readonly deploymentRules: readonly deployment.Rule[];
    readonly unitHooks: readonly unit.Hook[];
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly onTick?: (battle: BattleState, self: Card<S>) => BattleState;
}
```

基础属性、初始库存、固定上限及供给行为在 Card 静态配置中明确声明。cooldownOnDeploy 控制部署时启动间隔，recoverOnLeave 和 increaseCostOnLeave 分别控制普通撤退／死亡的库存恢复与费用阶段推进。手动撤退资格由 Deployable 的撤退规则决定。

| 配置 | cooldownOnDeploy | recoverOnLeave | increaseCostOnLeave |
| --- | --- | --- | --- |
| 普通干员 | false | true | true |
| 队列恢复装置 | false | true | false |
| 有部署间隔的消耗品 | true | false | false |

Card 创建为 addCard(battle, definition)，Battle 输入的 cards 保存完整静态 Definition 数组。相同 Definition 出现多次会创建多张独立 Card。入口校验静态数值配置，并在登记前执行 initialize；没有私有状态时也显式提供返回空对象的初始化程序。Card.initialize 只执行一次，Card 在部署和返手之间持续存在。

实例保留 definition、state、当前 stock、cooldown、recovery、costStage、贡献、动态 rules 和 unitHooks；固定上限从 Definition 读取。unitHooks 是注入以后部署实例的 Unit 生命周期程序，通过 setUnitHook／removeUnitHook 按 ID 登记、替换和移除，已创建 Unit 的程序保持原有装配结果。

setState 接收计算后的状态值。普通 get 返回默认 object 私有状态，精确 Ref 或已知 Definition 查询保留具体私有类型；any 用于 Core 异构边界或泛型约束。activeCount(battle, Ref<Card<any>>) 仅按来源身份统计当前场上实例，接纳带具体私有状态的 Card Ref，不读取或返回其私有状态。

## 请求与统一资格

```typescript
interface Quote {
    readonly dp: number | null;
    readonly stock: number;
    readonly slots: number;
}

interface DeployRequest<T extends Card<any> = Card> {
    readonly card: Ref<T>;
    readonly tilePosition: TilePosition;
    readonly direction?: Direction;
    readonly quote: Quote;
    readonly rules: readonly deployment.Rule[];
    readonly hooks: readonly unit.Hook[];
}
```

createRequest(battle, cardRef, tilePosition, direction?) 生成普通请求；来源不存在时返回 undefined。DEPLOY_UNIT Command 携带 ref: Ref<Card>、地块和可选方向，再据此生成完整请求；RETREAT_UNIT 携带 ref: Ref<Unit & Deployable>，直接调用撤退操作。生成方确认所需目标类型，领域操作仍检查引用是否存在及当前业务资格。Content 可以在明确的请求上提供本次报价、规则和程序。

Command 默认使用 Card；显式声明可以用 Command<Card<S>> 保留具体 Card 类型。step 与命令处理器在 Core 统一执行边界接纳不同私有类型的 Card 引用，不读取其私有 state。

Quote 表示实际支付与消费。dp:null 跳过支付，dp:0 是正常零费支付；stock 和 slots 可以为 0。本次 COST 与退费上限在消费前独立采样，分别保存在 Deployable 的部署事实中。

Deployment Rule 为 { id, allows(battle, { request }) }。evaluate 按以下顺序合并并执行一次：

1. Core 默认规则。
2. Card Definition 的 deploymentRules。
3. Card 当前动态规则。
4. Request 的规则。

同 ID 后者替换前者，保留首次登记的位置。默认规则覆盖库存、间隔、同 Card 在场上限、全场额度、DP、地图范围、同槽占用与禁部署地块。部署类型和特殊场地许可由内容规则表达，规则合并后统一决定部署资格。

Card 动态 Rule 按 DISPLAY／SELECT／DEPLOY 区分上下文；DEPLOY 时传入完整 request。Card.allows 查询展示和点选资格，evaluate／preview 合并全部部署规则并查询部署资格。

求值前接续一次到期库存、时钟及 DP，让全部规则看到相同的当前事实；完整部署在该版本上判断并消费资源。evaluate／preview 只读该临时版本，不发布状态或创建实例，返回资格或预览结果。positions 接收完整请求，复用资源版本和合并后的规则集合，各落点完整执行规则，保留报价和规则覆盖。

规则通过后，内部消费按已确认的报价执行。单独公开的资源操作维护自己的入口契约。资格拒绝返回输入 BattleState。

## 普通部署流程

```text
合并规则并判断资格
→ 采样 COST 与退费依据
→ 提交 DP、usedSlots、Card 库存，按配置启动部署间隔
→ 分配 Unit ID，调用 unit.initialize
→ 在未登记 Unit 上写入本次部署事实
→ 登记 Unit 与占格结构索引
→ 顺序执行已登记 enter
```

付款同时维护 DP 回复的计时基准，不能把满额期间停留的时间在消费后补算成回复。部署间隔在统一资源提交时启动，先于 Unit 初始化，也不依赖是否支付 DP。

部署把落点和本次方向传入 Occupancy 的可选创建输入。Unit.initialize 完成后，Deployment 在尚未登记的 Unit 上写入 card、cost、slots、refund，再交给 add 登记完整结果。本次方向属于实例事实。

Deployment 先登记派发部署事实的 enter 程序，再登记 Card.unitHooks 和 Request.hooks，随后交给 Capability fold。Occupancy 追加自己的配对程序，各程序按登记顺序执行。

Unit.add 完成通用登记并执行 enter。Deployment 和 Occupancy 分别通过已登记程序完成部署通知与配对通知。普通非 Card 创建按其所属领域的入场语义执行。

## 关卡预置与开场 Unit

开场 Unit 通过 Predefined 的 initiallyPresent 声明：

```typescript
predefines: [
    {
        id: 0,
        alias: null,
        initiallyPresent: true,
        creation: {
            type: "UNIT",
            definition,
            position,
            initial: { occupancy: { tile, direction } },
            hooks: [],
        },
    },
]
```

definition 是完整静态 Unit Definition；initial 和 hooks 按需提供。Predefined 在出现时分配 Unit ID，调用 unit.initialize，登记预置项与实例的绑定，再由 add 完成登记和 enter。Predefined 管理别名、出现／移除及重复出现，Unit.initialize 负责实例构造。

预置出现只执行对应的创建与入场程序；玩家部署的资源消费和部署通知由 Deployment 提供。

## Deployable 依赖与构造

Deployable 单向依赖 Occupancy；占格对象不反向要求可部署能力。

```typescript
interface Definition {
    readonly retreatRules: readonly Rule[];
}

interface Refund {
    readonly rate: number;
    readonly limit: number;
}

interface State {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly slots: number;
    readonly refund: Refund | null;
    readonly retreatRules: readonly Rule[];
}

type Deployable = Occupancy & {
    readonly definition: { readonly deployable: Definition };
    readonly deployable: State;
};

function initialize<
    U extends Unit & Occupancy & {
        readonly definition: { readonly deployable: Definition };
    },
>(battle: BattleState, unit: U): Result<U & Deployable>;
```

Catalog 先构造 Occupancy、再构造 Deployable；Deployable 在初始化入口确认 Occupancy 依赖。初始化建立 card:null、cost:0、slots:0、refund:null 和固有撤退规则，表示尚未关联一次部署；本次部署事实由 Deployment 在登记前写入。Deployment 预先登记的 Hook 保留原位置。

公开入口为 hasDeployable、initialize、canRetreat、retreat、setRule、removeRule，以及相应模型类型。Ref<Unit & Deployable> 已保证 Occupancy，无需内部重复能力检查。临时撤退规则按 ID 登记和移除，不清除其他来源。

## 主动操作与被动死亡

retreat 位于 Deployable 的 operations.ts，接收 Typed Ref，确认 PRESENT 和当前撤退规则后，依次按本次依据退款、根据 Card 配置推进费用阶段并登记库存恢复，再请求 Unit 正常结束。Deployment 公共入口重导出同一实现；canRetreat 独立查询当前撤退资格。

Card 贡献、费用阶段和恢复计时归 Card，跨对应场上实例存续。需要新启动恢复段时，retreat 按 Card 当前有效时长建立预算；追加已有队列保留当前段，后续段按计时规则启动。后续离场程序能够读取已结算的 DP 与 Card 状态。嵌套 Lifetime 请求可能只同步进入 LEAVING，此时 retreat 的资源结算已完成，物理注销与共有清理由外层 Lifetime 结算继续处理。

被动死亡的程序在创建时登记，接受原因为 DEATH 的真实 leave，按 Card 配置完成费用阶段与库存结算。HP 初次归零与死亡确认是不同阶段；SCRIPT／EXPIRED 按其所属业务处理。

Occupancy 配对解除和实例额度释放是共有清理，在各类真实离场时执行。

## 离场清理的偏序

```text
Unit 请求结束并发布 LEAVING
→ 顺序执行 prepare（包括 Blocking 自行登记的清理）
→ Lifetime 结束真实 owner／Scope 依赖者
→ 注销 Unit、释放结构占格，记录移除事实
→ @deployable/release-slots 归还本次部署额度
→ @deployment/death 仅在 DEATH 时结算 Card
→ Card.unitHooks 的 leave
→ Request.hooks 的 leave
→ @occupancy/leave 清理已通知的配对
→ Definition 的 leave
→ 顺序派发全局 leave
```

本地 leave 按上述登记顺序执行。Card、Request 与 Definition 的内容程序均能观察到 Unit 已注销、结构占格已释放和部署额度已归还；死亡时，Card 账务也已完成。Occupancy 按上述顺序清理旧业务配对，不影响替代实例的新配对。

普通 deploy 在资源提交时增加 usedSlots，并将相同份额写入本次 Deployable State；离场按该份额归还。关卡预置直接初始化 Unit，部署位份额为 0。usedSlots 是独立账户，在 prepare 与依赖者析构期间仍计入该份额；Unit 物理注销后，由 @deployable/release-slots 在本地内容 leave 之前归还。activeCount 按当前仍登记的实例及其来源 Card 统计，因此包含尚未注销的 LEAVING 实例。

Unit 执行已登记的生命周期程序；Lifetime 关系由各实例所属领域维护。Deployable.card 只表示来源地址，不构成 Lifetime 依赖；Lifetime 所有权由显式登记的 owner 关系决定，回收行为由 Card 的供给配置与对应领域操作决定。

## 部署观察

Deployment 自己持有 Hook 集合，setHook(battle, hook)／removeHook(battle, id) 登记、替换和撤销。观察者无需具有 Deployable；Effect／Mechanism 根据自身生命周期管理登记。

Deployed 载荷为 { unit, request }，支付信息读取 request.quote。它是已登记新实例的部署事实；后续普通入场程序尚可能修改状态或移除实例，观察者需要当前事实时重新查询。UNIT_DEPLOYED 诊断事件保存 Unit ID、位置、payment:number|null 与 Tick。

观察集合遵守[公共 Hook 派发契约](functional-core.md#7-同步候选范围)。一次性来源在触发新部署等完整业务前先消费自己的机会；嵌套操作接续最新 BattleState。

## 库存与计时

Card.stock 保存当前可用份数，stockLimit 和 activeLimit 从静态配置读取。cooldown 表示部署间隔，到期只解除间隔限制；recovery 保存串行恢复的份数和当前时钟，每段完成补一份。普通干员使用恢复队列表达再部署时间。

完整推进为 advance(battle)，统一读取 battle.tick；Card 和 DP 的局部值转换显式接收 tick。

Clock 保存启动时的 durationTicks；RUNNING 保存 readyAtTick，PAUSED 保存 remainingTicks。恢复队列的 pending 包括正在恢复的当前份。每段开始时采样当时的有效时长，预算固定到该段结束。

setRedeployTimeContribution 影响后续周期。reduceCooldown／clearCooldown／pauseCooldown／resumeCooldown 必须指定 COOLDOWN 或 RECOVERY，只修改选中当前段；多余减时不传递到后续段。recharge 直接增加库存，不重置时钟。暂停保存剩余量，零周期可以在当前 Tick 完成。

## DP

当前 DP、允许下限和自然回复进度由 Deployment 保存。自然回复受回复周期和上限限制；满额期间不累计可在以后消费时补发的回复。付款与显式资源变更先接续当前回复事实，再提交本次增减。

允许下限为负时，负 DP 状态的自然回复速度减半，主动 recover／modify 不减半。跨过零值保留已经取得的回复进度，不重新启动一段计时。该规则见[目标语义中的 DEPLOY-07](tactical-semantics.md#逐项目标与缺口)与[部署调查](../research/cases/24-deployment-cost-and-supply.md)。

## 支持范围

当前支持 Card 资源、普通部署、主动撤退、被动死亡与 Occupancy 配对通知。完整特殊重部署及其资格失败、资源交接、状态继承和返回契约尚未实现。多来源手牌重排的竞争规则、隐藏／锁定来源和特殊回收规则仍需调查。

费用与再部署时间的 Contribution 当前使用 Attribute Modifier；全部多来源公式尚未确认为原生规则，详见[部署研究](../research/cases/24-deployment-cost-and-supply.md)。

卫戍的倒地位置、自动部署及经济政策由外部 Mechanism／Meta 组合领域操作。
