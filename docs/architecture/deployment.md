# Deployment、Card 与 Unit 生命周期

Deployment 完成一次部署的资格判断、资源消费、实例创建和部署通知。Card 保存跨部署状态，Deployable 保存本次场上实例的部署事实，Occupancy 保存占格和摆放朝向，Unit 与 Lifetime 负责通用实例生命周期。

原生研究用于确认业务条件、结果、继承和关键时序，不要求项目照搬客户端字段或类结构。当前覆盖普通按格部署；完整特殊重部署留待下一轮，不能用直接搬格替代。

## 状态归属

| 事实 | 所属领域 |
| --- | --- |
| 实例身份、真实位置、PRESENT／LEAVING | Unit |
| 登记地块、摆放朝向、Support／乘员业务配对 | Occupancy |
| 当前 DP、回复进度、部署位账户 usedSlots | Deployment |
| 库存、计时、费用阶段、私有 state | Card |
| 来源 Card、本次 COST、占用额度、退费依据、撤退规则 | Deployable |

通用 Unit 不识别这些具体能力。Capability 初始化时登记所需的普通生命周期程序，完整领域操作负责自身结算；Unit 只登记、发布和执行已登记程序。

## 静态内容与 Card

内容提供一份完整静态 Unit Definition，顶层平铺声明 card、occupancy、deployable 及其他能力。Card.definition 保留这份原对象，Card 配置从 definition.card 读取。部署复用同一对象，不按次重建或修改 Definition，也不新增 Card／Unit 配对容器。

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

基础属性、初始库存、固定上限及普通供给行为在 Card 静态配置中明确声明。三个行为字段分别控制部署间隔、普通离场库存恢复和费用阶段推进，互不从库存或上限推导；它们不决定是否允许手动撤退，也不代表对所有 Unit.leave 自动执行。

| 现有普通配置 | cooldownOnDeploy | recoverOnLeave | increaseCostOnLeave |
| --- | --- | --- | --- |
| 普通干员 | false | true | true |
| 队列恢复装置 | false | true | false |
| 有部署间隔的消耗品 | true | false | false |

Card 创建为 addCard(battle, definition)，Battle 输入的 cards 直接保存完整静态 Definition 数组。相同 Definition 出现多次会创建多张独立 Card，不增加单字段输入包装。入口校验静态数值配置，并在登记前执行 initialize；没有私有状态时也显式提供返回空对象的初始化程序。Card.initialize 只执行一次，部署和返手不重建 Card。

实例保留 definition、state、当前 stock、cooldown、recovery、costStage、贡献及动态规则／Unit Hook。固定上限不重复保存，删除 Program 与来源 Initial 配置。setState 接收计算后的状态值；普通 get 保持 object 默认类型，精确 Ref 保留具体私有类型，any 只用于 Core 异构边界。

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

createRequest(battle, cardRef, tilePosition, direction?) 生成普通请求；来源不存在时返回 undefined。Command 只携带 Card ID、地块和可选方向，由边界生成完整请求；Content 可以在明确的请求上提供本次报价、规则和程序。

Quote 表示实际支付与消费。dp:null 跳过支付，dp:0 是正常零费支付；stock 和 slots 可以为 0。本次 COST 与退费上限在消费前另外采样，不等同于实付 DP，也不放回 Quote。

Deployment Rule 为 { id, allows(battle, { request }) }。evaluate 按以下顺序合并并执行一次：

1. Core 默认规则。
2. Card Definition 的 deploymentRules。
3. Card 当前动态规则。
4. Request 的规则。

同 ID 后者替换前者，保留首次登记的位置。默认规则覆盖库存、间隔、同 Card 在场上限、全场额度、DP、地图范围、同槽占用与禁部署地块。部署类型和特殊场地许可由内容规则表达，不在 Rule 外增加另一套不可覆盖的资格判断。

Card 动态 Rule 保留 DISPLAY／SELECT／DEPLOY 的上下文；DEPLOY 时传入完整 request。Card.allows 只查询 DISPLAY／SELECT，部署资格统一使用 evaluate／preview，由其完整合并规则，不再公开只检查部分规则的 DEPLOY 查询。

求值前接续一次到期库存、时钟及 DP，让全部规则看到相同的当前事实；完整部署在该版本上判断并消费资源，不丢弃结果后重新计算。evaluate／preview 的查询不发布该临时状态、不初始化 Unit、不分配身份。positions 接收完整请求，复用资源版本和合并后的规则集合，各落点仍完整执行规则，保留报价和规则覆盖。

规则通过后，内部消费信任已确认的资格，不重新判断或钳制成不足额消费。单独公开的资源操作仍维护自己的入口契约。资格拒绝返回输入 BattleState，不发布计时接续或其他部分结果。

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

部署把落点和本次方向传入 Occupancy 的可选创建输入。Unit.initialize 完成后，Deployment 在尚未登记的 Unit 上写入 card、cost、slots、refund，再交给 add；只登记完整结果，不发布中间实例或调用第二次 update。Definition 不保存本次方向。

Deployment 先登记自己的 enter 程序，再交给 Capability fold；该程序派发部署事实。Card 和 Request 提供的普通 Unit Hook 也在此装配。Occupancy 随后追加自己的配对程序，先注册、先执行，不引入额外优先级。

Unit.add 不识别 Deployment，不推断部署，也不发出占格差分通知。普通非 Card 创建与 Unit 入场各有自己的业务，不自动等同正式部署。

## 关卡预置与开场 Unit

开场 Unit 使用已有 Predefined 的 initiallyPresent，不另设初始 Unit 列表或创建工厂：

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

definition 是完整静态 Unit Definition；initial 和 hooks 按需提供。Predefined 在出现时分配 Unit ID，直接调用 unit.initialize，登记预置项与实例的绑定，再由 add 完成登记和 enter。它管理别名、出现／移除及重复出现，不承担另一套 Unit 构造协议，也不要求保留具体 Definition 泛型。

预置出现不自动消费 DP 或 Card 库存，不派发普通部署通知；需要玩家部署语义时使用 Deployment。initialMechanisms 仍保留现有输入，不在本轮扩展其迁移范围。

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

Catalog 显式先构造 Occupancy、再构造 Deployable；Deployable 在初始化入口拒绝缺失 Occupancy 的能力组合。初始化建立 card:null、cost:0、slots:0、refund:null 和固有撤退规则，表示尚未关联一次部署；本次部署事实由 Deployment 在登记前写入。通用初始化不推导必填部署输入，不增加配对标记或另一套构造框架。构造顺序不改变 Deployment 已经登记的 Hook 位置。

公开入口为 hasDeployable、initialize、canRetreat、retreat、setRule、removeRule，以及相应模型类型。Ref<Unit & Deployable> 已保证 Occupancy，无需内部重复能力检查。临时撤退规则按 ID 登记和移除，不清除其他来源。

## 主动操作与被动死亡

完整 retreat 位于 Deployable 的 operations.ts，接收 Typed Ref，确认 PRESENT 和当前撤退规则后，依次按本次依据退款、根据 Card 配置推进费用阶段并登记库存恢复，再请求 Unit 正常结束。不将资格检查与执行拆成两层转发；Deployment 公共入口仅重导出同一实现，canRetreat 保留为独立查询。

Card 贡献、费用阶段和恢复计时归 Card，不因目标 Unit 的离场清理自动撤销。需要新启动恢复段时，retreat 按 Card 当前有效时长建立预算；追加已有队列仍保留当前段，后续段按既有规则启动。后续离场程序能够读取已结算的 DP 与 Card 状态。嵌套 Lifetime 请求不保证立即注销 Unit，但 retreat 的资源结算已经完成，物理注销与共有清理由外层 Lifetime 结算继续处理。不登记临时全局 leave Hook，也不增加完成回调或延续队列。

被动死亡的程序在创建时登记，只响应已确认死亡，在真实 leave 时按 Card 配置完成费用阶段与库存结算。不能在 HP 初次归零、内容仍可能救活单位时提前执行，也不能对 SCRIPT／EXPIRED 等所有 leave 无条件恢复库存。

Occupancy 配对解除和实例额度释放是共有清理，覆盖所有相应离场。主动操作不重复执行这些清理；移动也不意味着死亡。不增加原因分类体系或临时的“本次离场结算”状态。

## 离场清理的偏序

```text
Unit 请求结束并发布 LEAVING
→ 顺序执行 prepare（包括 Blocking 自行登记的清理）
→ Lifetime 结束真实 owner／Scope 依赖者
→ 注销 Unit 与结构索引，记录移除事实
→ 顺序执行本地 leave
→ 顺序派发全局 leave
```

本地 leave 中，普通部署的死亡程序按接受条件响应；Occupancy 清理已通知的旧配对，Deployable 归还实例占用的 usedSlots。Definition 的内容 Hook 随后按登记序执行。Card 自定义携带的 Hook 同样保留自身登记位置，不由 Unit 按能力安排优先级。

普通 deploy 在资源提交时增加 usedSlots，并将相同份额写入本次 Deployable State；离场按该份额归还，不重复消费。关卡预置直接初始化 Unit，没有一次玩家部署时保持 slots:0，不根据静态 Card 配置自动消费部署位。usedSlots 是独立账户，不通过每次扫描 Unit 计算；activeCount 仍从当前实例查询。离场未走到对应额度释放程序时，该份额仍计入账户。

通用 Unit 只执行这些程序，不识别 Card／Occupancy，也不扫描能力重建 Lifetime 关系。Card 关联只是来源地址，不自动成为 Lifetime owner 或授予回收政策。

## 部署观察

Deployment 自己持有 Hook 集合，setHook(battle, hook)／removeHook(battle, id) 登记、替换和撤销。观察者无需具有 Deployable；Effect／Mechanism 根据自身生命周期管理登记。

Deployed 载荷为 { unit, request }，支付信息读取 request.quote。它是已登记新实例的部署事实；后续普通入场程序尚可能修改状态或移除实例，观察者需要当前事实时重新查询。UNIT_DEPLOYED 诊断事件保存 Unit ID、位置、payment:number|null 与 Tick，不保存 Program 标识或按调用者区分的 origin。

派发先固定已有 Hook ID，再逐项从最新状态查找：撤销或替换影响后继候选，新登记项不加入当前轮。一次性来源在触发新部署等完整业务前先消费自己的机会；嵌套操作接续最新 BattleState。

## 库存与计时

Card.stock 保存当前可用份数，stockLimit 和 activeLimit 从静态配置读取。cooldown 表示部署间隔，到期不补库存；recovery 保存串行恢复的份数和当前时钟，每段完成补一份。普通干员只使用恢复队列表达再部署时间，不复制相同的间隔。

完整推进为 advance(battle)，统一读取 battle.tick；Card 和 DP 的局部值转换仍显式接收 tick。

Clock 保存启动时的 durationTicks；RUNNING 保存 readyAtTick，PAUSED 保存 remainingTicks。恢复队列的 pending 包括正在恢复的当前份。每段开始时采样当时的有效时长，不给整个队列永久固定首次预算，也不在每份入队时预存全部预算。

setRedeployTimeContribution 影响后续周期。reduceCooldown／clearCooldown／pauseCooldown／resumeCooldown 必须指定 COOLDOWN 或 RECOVERY，只修改选中当前段；多余减时不传递到后续段。recharge 直接增加库存，不重置时钟。暂停保存剩余量，零周期可以在当前 Tick 完成。

## 本轮范围与后续

本轮迁移 Card、Deployable、普通 deploy、主动撤退与被动死亡的基本协作，以及对应 Occupancy 通知。未实现完整 redeploy，不预留通用 Program、任意初始化回调或新的延续队列。

费用与再部署时间的 Contribution 本轮保留现有数值行为，仅迁移配置读取位置；不把当前通用 Modifier 载荷或全部多来源公式当作已确认游戏规则。后续按实际机制调查并收敛，详见[部署研究](../research/cases/24-deployment-cost-and-supply.md)。

特殊移动的资格失败、旧资源交接、状态继承与返回契约，多来源手牌重排、隐藏／锁定来源和特殊回收规则另行闭合，不阻塞普通部署。卫戍的倒地位置、自动部署及经济政策仍由外部 Mechanism／Meta 组合领域操作，Core 不按模式名称分支。
