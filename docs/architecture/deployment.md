# Deployment、Card 与 Unit 生命周期

Deployment 管理 Card、供给、部署经济和完整部署操作；Deployable 保存场上实例的部署参数；Unit 生命周期操作派发生命周期节点，能力与领域自行接入清理。

部署方向、手动资格、费用上限、特殊部署与卫戍接入仍有未完成设计，见相关段落及[待定事项](#后续需要定案的内容)。其目标接口不表示对应链路已经实现，逐项要求见 [Tactical 语义](tactical-semantics.md)。

范围是主模式干员／敌人的作战规则与卫戍协议接入，不包含保全派驻和生息演算。函数式执行契约见 [Tactical 函数式内核](functional-core.md)，能力接口约定见 [Capability API](capability.md)。

## 状态归属与执行职责

| 概念 | 数据或规则归属 | 执行职责 |
| --- | --- | --- |
| 场上实例的身份、位置与生命周期状态 | Unit | 局部不可变变换形成新 Unit |
| Unit 的集合与占格 | Battlefield | 直接不可变操作完成登记、删除及空间／承载结构维护；阻挡关系由 Blocking 操作构造 |
| 登场、退场及其连锁结算 | Unit 生命周期领域 | Unit 派发统一 Hook；能力自行接入，Lifetime 按已登记依赖完成析构 |
| Card、库存、再部署进度及部署经济 | Deployment | 本领域转换维护场下记录和部署操作的后果 |
| 倒地记录、自动再登场等模式规则 | 对应 Mechanism | 组合公开领域操作，保存模式事实 |
| Tick 执行顺序 | battle/runtime.step | 直接调用领域操作并返回完整新 State |

Unit 是不可变数据，不是自主推进的运行时对象。`lifecycle` 属于 Unit，但完成一次退场可能改变其他 Unit 的 Effect、未完成 Action、Card 与模式状态，因此完整退场是作用于 BattleState 的纯函数。

“规则属于 Unit 生命周期领域”不要求 Unit 实例持有方法；“操作接收 BattleState”也不意味着算法都归 Tick 调度函数。step 只编排时序；Battlefield 只维护场上事实及其约束，不自动执行角色内容回调。领域结算没有第二套 Unit 存储或共享可变工作视图。

## 三种身份与待部署状态

- Definition ID 标识静态内容。等级、潜能、技能和模组选型完成后得到本场使用的不可变 Definition。
- Card ID 标识本场战斗中持续存在的可部署记录；普通干员退出场上后，这个记录继续保存进度。
- Unit ID 标识本次场上实例。场上实例退出与 Card 消失是不同的事实。

普通再次部署调用 `deploy(battle, { card, tilePosition })`，业务接口使用 `Ref<Card>`。默认创建标准 Capability 初态；确需跨部署保留的资源单独保存并显式转换，不保存整个旧 Unit 作为下次初态。普通干员 Card 对应至多一个场上实例；召唤物的库存与同时在场数量可以不同。

`unit.deployable.card: Ref<Card> | null` 关联本次实例的来源 Card。例如关卡直接预置的干员未必存在对应待部署记录。是否发生部署业务由执行该操作的领域明确决定，不能从 card 非空、阵营为 ALLY 或“新注册 Unit”推导。

阵营、当前玩家归属与原始责任归属分别表达，不在 Deployable State 中统一塞入 `side`。旧多人模式的地块 `playerSideMask` 不在支持范围内，不进入 Tile 或部署请求。

## Deployable Capability

Deployable 表达场上实例的部署参数和本次部署事实。Deployment 是完整部署操作与场下经济的领域，两者名称按职责区分。

```text
unit/capability/deployable/
├── index.ts            显式公共类型、局部操作与部署 Hook
├── capability.ts       Definition、State、查询与初始化
└── hook.ts             部署观察 Hook 的类型及不可变增删

battle/deployment/
├── index.ts            显式公共查询、资源、部署与生命周期协作
├── card/
│   ├── index.ts        Card 公共类型、Typed Ref 查询与完整写回
│   ├── card.ts         Program、Definition、Card 与 ref
│   ├── state.ts        供给、费用与冷却的内部纯计算
│   ├── query.ts        Typed Ref 的 get／all
│   └── operations.ts   私有 state、贡献、库存与当前冷却写回
├── deployment.ts       Definition、Input、State、初始化与局部 DP 转换
├── query.ts            部署额度与当前地块／占格资格查询
├── resources.ts        Card 创建与 Card、DP 时间推进
├── lifecycle.ts        Deployable prepare／leave Hook 与部署通知
└── operations.ts       完整部署、撤退与 Command 处理
```

上层通过两个领域各自的 index 导入公共契约。Deployable.initialize 自行登记 lifecycle.ts 提供的 prepare／leave Hook，分别负责退款与回卡；Unit 不依赖 Deployment。实际部署由 operations.ts 记录 UNIT_DEPLOYED，并在 add 返回后派发部署通知，Unit.add 不推断是否发生部署。Card 的完整替换仅供 Core 内部使用，Content 调用带 Typed Ref 的字段或资源操作。

```typescript
// unit/capability/deployable/capability.ts
export interface Definition<S extends object = object> {
    readonly cost: number;
    readonly redeployTicks: number;
    readonly slots: number;
    readonly placement: Exclude<Placement, "NONE">;
    readonly allowedSiteConditions: readonly SiteCondition[];
    readonly refund: {
        readonly rate: number;
        readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
    };
    readonly card?: Program<S>;
}

export interface State {
    readonly card: Ref<Card> | null;
    readonly cost: number;
    readonly refundLimit: number;
    readonly refundAllowed: boolean;
    readonly deployedHooks: readonly DeployedHook[];
}

export interface Deployable {
    readonly definition: { readonly deployable: Omit<Definition, "card"> };
    readonly deployable: State;
}
```

| 字段 | 含义 |
| --- | --- |
| Definition.cost | 配置选定后的基础部署费用；Card 当前有效费用另行计算 |
| redeployTicks | 基础再部署时间；当前冷却进度是 Card 的运行事实 |
| slots | 占用的部署额度；与地块占用、库存及同 Card 在场上限分别表达 |
| placement | 通常可部署于近战、远程或两类地块 |
| allowedSiteConditions | 必填的场地条件 symbol 数组；由内容装配明确提供 |
| refund | 内容配置的撤退返费率与上限策略，普通干员为 50%／BASE_COST |
| Definition.card | 可选的 Card 私有程序；由 Deployment 创建 Card 时初始化，不由 Unit initializer 执行 |
| State.card | 本次场上实例关联的 Card Typed Ref；允许无记录的实例 |
| State.cost | 此实例的部署费用属性，不等同于实际扣款，也不随 Card 后续费用变化 |
| refundLimit | 部署时确定的本实例返费上限数值 |
| refundAllowed | 此次部署是否允许返费，由创建流程明确赋值 |
| deployedHooks | 此 Unit 登记的部署观察函数；随不可变 Unit 状态更新 |

slots 采用静态参数。选定技能或模组后固定的差异由内容装配产生，不为未确认的动态额度变化先添加 Contribution 容器。关卡自动放置的装置不占部署数，必须明确配置 slots 为 0；不能用阻挡数推算部署额度。[PRTS 射击台](https://prts.wiki/w/射击台) 明确区分手动与关卡自动部署的占用规则。

部署资格读取当前 Tile.state.placement 与 siteCondition。siteCondition 是单个 symbol 或 null；null 无条件通过场地条件检查，其余值必须包含在 Deployable.allowedSiteConditions 中。Content 的 condition.normal（NORMAL）是普通场地条件，不等于 null；Core 不默认引入它。官方数值位掩码在 Data 边界转换，不进入 Core。

地块覆写直接更新当前 Tile.state，TileBinding 已移除。SUPPORT 登记本身不覆写部署许可；平台内容按登记格显式改写，详见 [Terrain 与 Mechanism](terrain.md)。Occupancy 的 Definition 声明 OCCUPANT／SUPPORT 槽位，State.tile 保存当前登记地块，Field 自动维护双槽反向表，见 [Occupancy 与 Support](occupancy.md)；SpatialPresence 表达是否参与空间事实；Layer 表达 GROUND／AIR，均不能替代 Deployable。

本次部署的 COST 属性与实际扣除的 DP 必须区分，也不能在撤退时读取 Card 的当前费用代替旧实例的属性。允许返费时按 `floor(min(State.cost × refund.rate, State.refundLimit))` 结算。基础上限从本次基础费用计算；采用 DEPLOYMENT_COST 策略时以上场费用属性为限。返费资格由具体操作确定，免费投递不必然禁止返费；直接预放的初态默认不允许返费，但不能从 card 为 null 推断所有实例都不能返费。[PRTS 部署费用](https://prts.wiki/w/部署费用#撤退返费) 提供玩法依据。

## Card 与部署子系统

Card 是本场战斗中跨部署存在的不可变实体，保存在 Deployment，不是 Unit 或部署按钮。Card<S>.definition 直接引用原 Unit Definition，不包一层 definition.unit，也不复制或改写共享定义；supply 独立保存本次供给政策。Card 的 Definition<S> 是带 Deployable／Occupancy 与相应 Card 程序的 Unit Definition 类型，不是第二份内容定义。

```typescript
interface Program<S extends object = object> {
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly onTick?: (battle: BattleState, self: Card<S>) => BattleState;
}

interface Supply {
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly recharge: "DEPLOYMENT" | "RETURN" | "QUEUED";
    readonly costPenalty: boolean;
}

interface Cooldown {
    readonly readyAtTick: number;
    readonly durationTicks: number;
}

interface Card<S extends object = object> extends Identified<{ readonly id: CardId }> {
    readonly id: CardId;
    readonly definition: Definition<S>;
    readonly supply: Supply;
    readonly state: S;
    readonly stock: number | null;
    readonly cooldown: Cooldown | null;
    readonly pendingReturns: number;
    readonly costStage: number;
    readonly costContributions: readonly Contribution<readonly attribute.Modifier[]>[];
    readonly redeployTimeContributions: readonly Contribution<readonly attribute.Modifier[]>[];
}
```

需要场下私有逻辑的内容在 Unit Definition 的 deployable.card 提供 Program<S>，包括 initialize 与可选 onTick；普通干员省略该字段，创建时取得空 state，不必另外编写 Card 内容。Deployment 创建 Card 时接续 initialize 返回的 BattleState；Card 的身份与私有 state 不随一次 Unit 离场重建。普通查询返回默认 object 的完整 Card，精确 Ref 或匹配已知 Unit Definition 的查询保留 S；异构类型擦除留在内部存储边界，不向 Content 返回 any。Deployable 守卫只证明部署所需配置与状态，保留已知 Unit Definition 中 Card 程序的私有类型，不将其覆盖为 Program<object>。

每次普通部署仍重新初始化 Unit 的全部 Capability。Card.state 负责跨部署事实，Unit 自身的 enter／leave Hook 通过 deployable.card 的 Ref 显式读取、转换和写回这些数据。例如魔力在入场时转换为当前 SP，离场时从 Departure 读取剩余 SP 再保存回 Card；不保存整个旧 Unit，也不自动继承 HP、Skill、Effect 等状态。部署附加复用 Unit enter，不增加 Entry 阶段或 Card 的 Effect 容器。

| 内容 | 职责 |
| --- | --- |
| id、definition | Card 身份与原 Unit Definition；基础费用／冷却取自 definition.deployable |
| state | 具体内容跨部署保存的私有状态 |
| supply.stockLimit、supply.activeLimit | 库存上限与同 Card 在场上限，null 分别表示无限库存／不限在场数 |
| stock | 当前可用数量；null 表示无限供给，0 表示没有可用库存 |
| cooldown | 当前周期的截止 Tick 与启动时长；不等同于基础 redeployTicks |
| pendingReturns | 排队补充中等待完成的回收数量，不能由库存或在场数量推算 |
| costStage | 本 Card 的费用惩罚进度，普通撤退／死亡增加，最多两个阶段 |
| costContributions | 对当前费用的修正候选 |
| redeployTimeContributions | 对以后启动的冷却周期时长的修正候选 |

普通干员供给默认无限库存、至多一个场上实例、RETURN 冷却，并启用费用惩罚。默认策略不是所有召唤物的规则，具体创建配置明确自身供给。

- DEPLOYMENT：消耗库存时启动冷却，周期结束解除冷却；不自动补回库存。
- RETURN：离场启动冷却，周期结束补回一个库存。
- QUEUED：离场登记待回收数量，按顺序完成补充；有库存时可继续部署，不因补充周期正在运行而禁止消耗。

每次有效回收都必须保留其供给事实。只保存一个截止时间的 RETURN 仅用于不会同时存在多个待回收实例的合法组合；多实例来源采用已明确的供给政策。RETURN 的实际构造约束和更多并行／串行政策仍待核对，见 DEPLOY-06；本轮不改变既有 Supply 政策。

库存、库存上限和同时在场上限是三个独立事实。场上 Unit 的 deployable.card 是关联的权威事实，查询当前实例从 Battlefield 取得，不另存 card.deployed[]。实际返费属于完整离场结算，Card 内部纯转换只处理自己的供给、计时及费用进度。

setRedeployTimeContribution／removeRedeployTimeContribution 只影响以后启动的冷却，不缩放正在运行的截止 Tick。reduceCooldown／clearCooldown 处理当前周期，并按 Supply 完成到期与补回；排队供给仍可继续下个周期，不把多余缩短量传给它。零时长周期可在当前 Tick 完成。Deployment 固定阶段入口的 Card 候选，逐项读取当前 Card，先发布到期结果再调用其 onTick；新建 Card 不加入本轮候选，回调后不写回旧整份对象。

Deployment 保存静态 initialDp／maxDp／dpRecoveryTicks／slotLimit 与运行时 cards／dp／nextDpRecoveryAtTick。dpRecoveryTicks 为 null 表示不自然回复，slotLimit 为 null 表示不限制部署额度；额度查询读取场上 Deployable Definition。达到 DP 上限时停止自然回复计时，扣费后重新开始。

Card ID 由 nextCardId 分配，独立于 Unit ID；addCard 返回精确 Ref<Card<S>>，初始化 Card 不消耗 Unit ID。Card 集合与 Deployment State 随 BattleState 显式接续，不另设待部署记录镜像。Contribution 可用于 Card，但其登记与结算由 Card 领域负责；不复制 Unit Change 或公开完整 Card replace。

本轮保留现有数值算法和 Supply 政策。费用分阶段取整与独立上限已有取证，多来源归并与再部署修正仍有证据缺口；这些差异后续独立收敛。未确定的 Rule、Hook、共享机会与排序框架不在本轮新增。

## API 与 Commands

Card 内容从 battle/deployment/card/index.ts 使用模型、ref、get／all、数值查询与完整写回。state.ts 的局部 Card→Card 计算和完整替换供 Core 内部使用，不要求 Content 自行查对象、调用局部 setter 后再补写回。

```typescript
// card/index.ts：普通查询使用默认 object，精确 Ref／Definition 查询保留私有 S
ref(self): Ref<Card<S>>;
get(battle, ref): Card<S> | undefined;
get(battle, ref, definition): Card<S> | undefined;
all(battle): Query<Card>;
resolveBaseCost(card): number;
resolveCost(card): number;
resolveRedeployTicks(card): number;

setState(battle, ref, nextState): BattleState;
recharge(battle, ref, count): BattleState;
reduceCooldown(battle, ref, ticks): BattleState;
clearCooldown(battle, ref): BattleState;
setCostContribution(battle, ref, contribution): BattleState;
removeCostContribution(battle, ref, id): BattleState;
setRedeployTimeContribution(battle, ref, contribution): BattleState;
removeRedeployTimeContribution(battle, ref, id): BattleState;

// deployment/index.ts
addCard(battle, definition, options?: { supply?: Supply; stock?: number | null }): Result<Ref<Card<S>>>;
deploy<T extends Card<any>>(battle, request: DeployRequest<T>): Result<DeployOutcome>;
retreat(battle, unitId): BattleState;
```

setState 只接收已经计算好的 state，用 Typed Ref 与 NoInfer 保持私有类型配对；其余操作只允许修改对应字段或资源。Content 不提交完整 Card，不使用通用 transform 写回。写回目标缺失时抛出 RangeError；给定结果值与当前值相同时保留原状态，身份、共享 Definition、供给及无关字段由 Core 保持。

Deployable 的 prepare／leave Hook 与 notifyDeployed 位于 lifecycle.ts；它们消费相应节点的明确业务载荷，不重新拼接 Unit 登记或离场流程。

战斗 Input 可配置 deployment: { definition, cards }，cards 中每项为 `{ definition: 原 Unit Definition, supply?, stock? }`。这些条目只配置本次 Card 的创建，内容程序仍属于原 Unit Definition。供给缺省使用普通干员规则；不配置 Deployment 时，Card 集合为空、初始 DP 为 0。

业务 deploy 请求使用 Card Ref 与地块；外部 Command 仍携带 cardId 编号，由命令边界转换为 Card Ref。Card 已在战斗输入／创建阶段建立，Command 不临时带入任意 Unit Definition。部署直接使用 card.definition 初始化新 Unit；刷怪和直接生成对象使用自身流程。本次方向仍未接入，见 DEPLOY-03。

```typescript
type DeploymentCommand =
    | { readonly type: "DEPLOY_UNIT"; readonly cardId: CardId;
        readonly tilePosition: TilePosition }
    | { readonly type: "RETREAT_UNIT"; readonly unitId: UnitId };
```

完整部署依次检查 Card 是否存在、库存、冷却、同 Card 在场上限、总部署额度、DP 与地形占位。普通资格拒绝返回 REJECTED；外部 Command 输出 DEPLOYMENT_REJECTED，且不消费库存、DP 或 Unit ID。程序异常仍使本次 Tick 失败，不当作业务拒绝。成功结果保存 cardId 与生成的 unitId，登记已发生的领域事件；value 不重复返回已写入事件流的 Signals。部署被接受不保证回调结束后 Unit 仍存活，结果表达已经发生的事实。

实际部署费用还需按关卡费用上限裁定。手动撤退命令按可撤退性和调用方控制范围裁定；网络身份与授权由外层处理，内容强退和实际离场保留独立语义。当前这两项仍有缺口，不能把只检查 Unit 存在的通用离场入口当作完整手动规则。

再次部署没有额外 redeploy Command。当前不提供直接改变既有部署对象位置的公共操作、命令、事件或内容回调；特殊撤退—再部署仍须按真实内容审查退出原因、Buff／技能初态、HP 和费用政策，本轮不实现，不能借普通 Unit 状态更新推导出免费搬动平台或干员的能力。

正常部署由外部 Command 驱动，卫戍初始／自动部署由 Mechanism 组合公开领域操作。实例创建、Card 关联、战场登记和生命周期规则集中维护。模式消费政策与公共部署流程的接入契约仍需按玩法明确，不用 force/free/ignore 开关或通用权限注册表替代这项设计。

## 生命周期与 Hook 接口

### Unit：生命周期 Hook

Unit 只保存 PRESENT／LEAVING；注册前和删除后通过战场中不存在该实例表达，不增加一组出生、死亡、回收中间状态。

Unit Definition 必填 hooks 数组，没有生命周期程序时显式传入 []。Unit 实例的 hooks 保存本次装配后的统一序列，初始化先登记能力提供的 Hook，再按 Definition 中的原顺序登记内容 Hook；程序对象可以共享，原 Definition 的身份与 hooks 不变。能力初始化自行登记所需 Hook：Skill 接入 enter，Deployable 接入 prepare／leave，Blocker 或 Blockable 将自身 prepare 清理放在序列前部；随后追加内容 Hook。Unit 不枚举能力或调用其专属操作。

```typescript
// unit/hook.ts：只声明 Unit 的阶段类型
export interface EnterHook extends TacticalHook<Unit, void> {
    readonly stage: "enter";
}

export interface TickHook extends TacticalHook<Unit, void> {
    readonly stage: "tick";
}

export interface PrepareHook extends TacticalHook<Departure, void> {
    readonly stage: "prepare";
}

export interface LeaveHook extends TacticalHook<Departure, void> {
    readonly stage: "leave";
}

export type Hook = EnterHook | TickHook | PrepareHook | LeaveHook;

// unit/unit.ts
export interface Definition {
    readonly id: DefinitionId;
    readonly hooks: readonly Hook[];
}

export interface Unit extends Identified<{ readonly id: Id }> {
    // 其余身份、位置、能力与 Effects 字段省略
    readonly hooks: readonly Hook[];
}

export interface Departure {
    readonly unit: Unit;
    readonly reason: LeaveReason;
}
```

TacticalHook 是 core/hook.ts 的通用 Hook<C, T>。该模块集中既有 Hook 类型、dispatch 和 set／remove 数组操作；unit/hook.ts 仅声明阶段类型，battle/unit.ts 直接调用通用 dispatch。Effect、Skill、Mechanism 等领域自身的回调契约不因 Unit 的调整改变。

enter 是本次场上实例的登场节点。battle/unit.add 完成登记后，筛选实例 hooks 中的 enter Hook，按登记顺序调用通用 dispatch；不单独识别 Skill。Skill 的 enter Hook 负责登记技力回复监听、执行 Skill Definition.onEnter，并尝试发动 PASSIVE 技能，属于同一次派发。advance 在阶段开始时固定 Unit 候选，轮到单位时读取最新 PRESENT 实例并派发实例 hooks 中的 tick Hook；本轮新登场的单位下次参与。

每次派发固定该阶段 Hook 的候选与 Context。enter／tick 的 Context 是开始派发时的 Unit，后续 Hook 仍接收同一对象；BattleState 则逐项接续最新版本。每项执行前检查宿主仍为 PRESENT，嵌套操作导致离场后停止剩余 enter／tick Hook。需要当前 Unit 属性时，从返回的最新 BattleState 查询，不将固定 Context 当作持续更新的对象。

prepare 在 LEAVING 发布后、自动请求子依赖之前派发。Blocking Hook 先批量解除自身关系，Blockable 同时取消自己的 adjustment；Deployable Hook 随后按最新 Unit 与结束原因退款。prepare／leave 的固定 Context 均为 Departure，记录开始离场、尚未清理 Skill／Effect 的 Unit 与 reason；不把这个历史对象整体写回。

leave 在全部子依赖完整析构、Unit 物理注销与登记变化通知后派发。Deployable 自身的 leave Hook 回收 Card，随后内容 Hook 可以读取 Departure 中的原 SP 或位置并修改当前 Card、生成新对象；不查询已删除的宿主，也不保存整个旧 Unit 作为 Card 初态。leave 不以宿主仍在场作为派发资格。

旧 Unit 的静态／采样数据可直接读取；依赖当时全场的动态有效值须在清理前求出。不能将旧 Unit 与新 BattleState 混合后声称查到了离场前的动态属性。Effect 的结束业务仍在自己的 onDisable／onEnd 时点执行，不把全部退场业务搬进最后的 leave Hook。

承载关系变化由 Occupancy 的 SUPPORT Definition 中的 occupantAdded／occupantRemoved Hook 接收，不属于 Unit 生命周期 Hook；具体契约见 [Occupancy](occupancy.md#同步登记通知)。不提供直接重定位流程或对应的内容回调。

### Deployable：对实际部署的观察

Deployable 复用 Unit 的 prepare／leave 生命周期节点；实际部署通过 deployedHooks 通知观察者。

动态部署观察保存在所属 Unit 的 deployable.deployedHooks 中。Deployable 提供接入点，具体 Effect／技能内容登记闭包；Deployment 结算负责通知，聚合 State 不另存全局 Hook 集合。

```typescript
// unit/capability/deployable/hook.ts
export interface Deployed {
    readonly unit: Unit & Deployable;
    readonly kind: "MANUAL" | "INITIAL" | "AUTOMATIC" | "MOVE";
}

export type DeployedHook = Hook<Deployed, void>;

setHook(ref: Ref<Unit & Deployable>, hook: DeployedHook): Change;
removeHook(ref: Ref<Unit & Deployable>, id: string): Change;
```

Deployed 是已发生部署的输入事实，unit 取自本次登记完成时的值；其中的 deployable.card 可以为 null。kind 表达本次方式，不是跳过费用／地形检查的权限开关。回调需要单位当前状态时，从传入 BattleState 查询，不把事实中的旧值当作持续更新的对象。

调用遵守公共 Hook 的 accepts／invoke 契约。自身部署动作和其他单位的部署响应均可登记；业务自行判断事实中的实例是不是自身。Effect 通过当前输入版本查询自己的存在和生效状态，控制资格并在结束时撤销登记。

通知开始时按 Unit 存储顺序及各 Unit 内 Hook 登记顺序固定候选身份；每项执行前从最新返回版本重查所属实例、登记与资格。本次通知中新登记的 Hook 不补进当前列表。较早进入战场的观察者通常先于新实例在 enter 节点登记的 Hook，但不规定所有自身战吼都发生在他人响应之后：需要早执行的自身内容属于 enter 节点，需要部署通知的内容属于对应 Hook。具体内容若存在显著顺序依赖，以官方业务证据确定，不能仅凭一个通用顺序替代规则。

普通敌人出生只走登场流程，不自动广播部署事实。创建者必须明确这是否是部署；新 Unit、ALLY 阵营和 card 非空都不是充分条件。自己与他人的部署响应共用这个入口，不建立两套通知协议。

### 完整顺序

普通部署的顺序是：

```text
接纳部署，初始化本次 Unit 并附加 Card 关联
→ 提交本次 Card／DP 消费，记录 UNIT_DEPLOYED
→ 登记 Unit，发布 Occupancy，不扫描全场 Blocking 或能力槽位
→ Unit 的 enter Hook：接入实例内容与规定的入场业务，各领域自行登记 Lifetime 关系
→ registrationChanged 观察通知：Occupancy 处理承载变化
→ Deployment 以本次 Unit 事实派发 deployedHooks
→ 返回部署结果
```

Unit 的 enter Hook 可以同步触发退场，部署通知仍表示此前已发生的部署，不因回调返回时当前 Unit 已不存在就丢失。通知本身也可以触发退场；后续 Hook 接续实际返回版本。拒绝的部署没有 Unit 的 enter Hook 或部署通知。

真实离场委托 [Unit Lifetime](lifetime.md)，分成同步请求与最终析构：

```text
首次接受离场，捕获 Departure 与明确采样数值
→ 登记 PREPARING，发布 LEAVING
→ 统一 prepare Hook：Blocking 先解除关系并通知，Deployable 随后按最新 Unit 返费
→ 按关系登记顺序请求 owner／显式依赖子项
→ 等待全部真实依赖者整个 Finalize 返回
→ Unit Finalize 从当前状态注销、记录移除事实，完成占格发布；不追加全场阻挡扫描
→ registrationChanged 观察通知：Occupancy 处理承载变化
→ Unit 的 leave Hook：Deployable 回收 Card，再执行内容 Hook（初始 Departure）
→ 全局 leave 观察通知：Mechanism 等自行登记的响应
→ 整个 Unit Finalize 返回，移除 Pending，完成本次离场工作
```

Departure.unit 保存开始离场时、尚未清理 Skill／Effect 的不可变 Unit，作为本次业务结束输入随 Pending 保留；它不是通用 Context 或最后可得实例回退。动态属性若需要离场前的全场采样，应在清理前按业务明确取得。注销和移除记录使用清理后最新 Unit，不能用 Departure.unit 覆盖当前状态。返费在标记发布及 Blocking Hook 后从最新 Unit 求值，在 Card 费用进度更新之前发生，不把 Departure.unit 当作实时退款依据。

Unit 不点名 Blocking、Deployment、Skill、Action 或 Effect。能力通过统一 Hook 接入业务，拥有关系由各领域的完整创建／启动与结束操作登记／注销，Lifetime 图是唯一关系权威；Unit 不扫描能力槽位。每个领域负责自己的结束内容、数据写回和事件，公共运行器不解释其私有状态。

### 离场清理的偏序

请求顺序和完成顺序分别确定：

```text
Unit 请求：LEAVING → prepare Hook（Blocking 清理 → Deployable 退款 → 内容）
        │
        ▼
按关系登记顺序请求直接依赖者
        │
        ▼
各子项完成整个 Finalize（含 onEnd、槽位结算、末尾通知）
        │
        ▼
Unit Finalize：注销 → registrationChanged → leave Hook（含回卡）→ 全局 leave
```

直接子候选按父子边的登记顺序，不区分能力种类或 owner／显式 Scope；更新已有边保序，解绑后重绑追加。真实依赖仍优先完成，不为无依赖兄弟设置能力优先级。兄弟可以都先成为 ENDING，前一个兄弟的结束程序不能假设后一个仍在运行。同一依赖者被多个目标请求时复用首次 Pending，End 与传播原因不被后续请求覆盖。

Pending 在整个 Finalize 返回前存在。子实例已注销但仍在派发末尾 Hook 时，其 parents 仍让 Unit 等待；不能用对象已从容器消失推断其结束内容全部完成。Unit 的物理删除仍由所属领域 Finalize 执行，公开 Battlefield.remove 只承担纯存储职责。

Effect.onEnd 内请求宿主离场，嵌套 remove 会标记 LEAVING、同步执行首次 Prepare 并返回；宿主等待该 Effect 完整 Finalize 后才注销。等待来自实际 Effect→Unit 关系，调用 remove 不反向建立 Effect 等待 Unit 的边。普通函数继续控制流，后续实时事实从返回 battle 查询；不等待无关调用栈退出。

无活动结算时 remove 在本次调用内 drain 完再返回；已有结算时，返回不保证占格释放、Card 回收或 leave 通知已发生。Damage.completed 同样不保证目标的离场 Finalize 完成，需要完成事实的业务应使用既有最终通知，不在嵌套调用中强行 drain。

LEAVING 宿主与 Pending／ENDING 目标不能接受新的真正依赖；空间查询和普通业务资格不能只检查 get 非空。其他 Unit 上只有 source、未绑定生命周期的独立效果仍可保留。结束中的合法清理字段仍按各自 API 写入，跨完整操作后接续最新状态；异常直接传播，不补做剩余 Finalize。

BattleState.unitHooks 保存 registrationChanged 与 leave 的全局观察登记，由 battle/unit-hook.ts 按通用 Hook 协议派发。Runtime 初始化时登记 Occupancy 的 registrationChanged 观察者；Mechanism 创建时为 onUnitLeave 登记 leave 观察者，结束时撤销，派发时确认当前 Mechanism 的 ACTIVE 资格。Unit 只发通用通知，不导入这些消费者。模式响应位于 Unit 的本地 leave Hook 之后，自动再登场可读取已完成跨部署资源转换的 Card。更早就必须成立的倒地／资格约束仍由对应业务步骤维护。

HP 归零、复活与真实离场分别处理；成功复活不执行 Unit 的 leave Hook。直接更新位置不重新执行 Unit 的 enter Hook，也不广播部署。特殊撤退—再部署与其原因、状态继承和通知政策尚待实际内容实现，本轮不预设一套移动流程。

Unit 生命周期 Hook 与部署 Hook 遵循通用 accepts／invoke 契约，invoke 返回 Result<void> 并接续其中的 BattleState；模式响应继续使用自身回调契约。Unit 不自驱，Battlefield 的存储与一致性维护不触发这些内容；完整领域结算控制调用顺序，Runtime 只推进 Tick 和发布最终结果。

### 内容接入示例

下列示例说明职责分工；各角色的原生相对触发顺序仍需按具体内容核对。

- 泥岩的初始盾通过 Unit Definition 的 `stage: "enter"` Hook 调用 Effect.install，持续充能由该 Effect 推进；Unit 初始化只建立空 Effects。是否有需要后于其他部署业务的动作，按具体内容安排，而非把所有自身动作强制放在一个时点。
- [焰尾 X 模组](https://m.prts.wiki/w/焰尾#天赋)需要观察其他卡西米尔干员的部署，可以在天赋 Effect 中登记 DeployedHook。
- [玛露西尔](https://prts.wiki/w/玛露西尔#天赋)需要入场／退场转换魔力与技力。Unit 的 enter Hook 读取持续资源；Unit 的 leave Hook 读取 departure.unit 的清理前 SP，再写入当前 Card。场下资源推进仍属于对应领域。
- [伊内丝](https://m.prts.wiki/w/伊内丝#天赋)的离场生成物可在 Unit 的 leave Hook 创建，原位置已释放。技能对影哨生成的影响读取离场事实与内容状态，不因存在统一回调就忽略技能规则。

登场与部署通知之间存在业务观察顺序。具体内容所需的早晚节点参照[天赋生命周期调研](../research/cases/06-talent-lifecycle-and-model.md)，不按客户端内部方法数量增加公共回调。

## 卫戍协议接入

倒地位置、初始格子和自动再登场政策由模式 Mechanism 保存，例如 `{ cardId, tile, initialTile }`。这类非空间目标的记录无需额外 Tactical Unit 或 Battlefield Reservation；Mechanism 负责实际拦截／驱动有关操作，仅保存记录不会自动改变部署规则。

联防的敌人责任归属不属于 Card，也不等同于当前阵营。模式记录原始责任玩家，在真实生成时绑定并向分裂／召唤子体传递；登场业务能观察这项事实。结算保留所需的逃逸、离场和未登场事实，Meta 消费最终结果调整局内状态，不逐 Tick 维护第二份战场镜像。

主模式 Card／Deployment 不保存卫戍倒地字段。模式 Mechanism 需要保存私有运行事实并接入部署／离场操作；当前 Mechanism 的基本结构不能被当作这条链路已经实现。具体玩法资料入口见 [PRTS 卫戍协议帮助](https://m.prts.wiki/w/卫戍协议/帮助)。

## 后续需要定案的内容

1. 特殊部署对费用属性、实际扣款和返费资格的独立调整入口。
2. 更多召唤物的宿主资格、真实供给政策及专属场下资源。
3. 正常 Command 与模式 Mechanism 共用的部署结算边界及消费政策接入方式。
4. 各具体内容的部署触发顺序及跨部署资源转换规则。
5. 特殊移动的退出／重新进入原因与具体继承政策，避免普通撤退惩罚和业务通知误触发。

这些事项按真实内容落实；重要玩法语义查证，普通一 Tick 差异采用简单约定，纯工程中间过程不增加防御框架。天赋的跨部署与场下需求见 [天赋调研](../research/cases/06-talent-lifecycle-and-model.md)。
