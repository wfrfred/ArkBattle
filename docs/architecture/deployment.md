# Deployment、Card 与 Unit 生命周期

Deployment 管理 Card、供给、部署经济和完整部署操作；Deployable 保存场上实例的部署参数；Unit 生命周期操作协调登场、离场及领域清理。

部署方向、手动资格、费用上限、特殊部署与卫戍接入仍有未完成设计，见相关段落及[待定事项](#后续需要定案的内容)。其目标接口不表示对应链路已经实现，逐项要求见 [Tactical 语义](tactical-semantics.md)。

范围是主模式干员／敌人的作战规则与卫戍协议接入，不包含保全派驻和生息演算。函数式执行契约见 [Tactical 函数式内核](functional-core.md)，能力接口约定见 [Capability API](capability.md)。

## 状态归属与执行职责

| 概念 | 数据或规则归属 | 执行职责 |
| --- | --- | --- |
| 场上实例的身份、位置与生命周期状态 | Unit | 局部不可变变换形成新 Unit |
| Unit 的集合与场上关系 | Battlefield | 直接不可变操作完成登记、删除，内部纯函数维护空间／阻挡／承载一致性 |
| 登场、退场及其连锁结算 | Unit 生命周期领域 | 完整领域函数接续 BattleState，协调 Action、Skill、Effect 等规则 |
| Card、库存、再部署进度及部署经济 | Deployment | 本领域转换维护场下记录和部署操作的后果 |
| 倒地记录、自动再登场等模式规则 | 对应 Mechanism | 组合公开领域操作，保存模式事实 |
| Tick 执行顺序 | battle/runtime.step | 直接调用领域操作并返回完整新 State |

Unit 是不可变数据，不是自主推进的运行时对象。`lifecycle` 属于 Unit，但完成一次退场可能改变其他 Unit 的 Effect、未完成 Action、Card 与模式状态，因此完整退场是作用于 BattleState 的纯函数。

“规则属于 Unit 生命周期领域”不要求 Unit 实例持有方法；“操作接收 BattleState”也不意味着算法都归 Tick 调度函数。step 只编排时序；Battlefield 只维护场上事实及其约束，不自动执行角色内容回调。领域结算没有第二套 Unit 存储或共享可变工作视图。

## 三种身份与待部署状态

- Definition ID 标识静态内容。等级、潜能、技能和模组选型完成后得到本场使用的不可变 Definition。
- Card ID 标识本场战斗中持续存在的可部署记录；普通干员退出场上后，这个记录继续保存进度。
- Unit ID 标识本次场上实例。场上实例退出与 Card 消失是不同的事实。

普通再次部署调用 `deploy(cardId, ...)`。默认创建标准 Capability 初态；确需跨部署保留的资源单独保存并显式转换，不保存整个旧 Unit 作为下次初态。普通干员 Card 对应至多一个场上实例；召唤物的库存与同时在场数量可以不同。

`unit.deployable.cardId` 允许为 null。例如关卡直接预置的干员未必存在对应待部署记录。是否发生部署业务由执行该操作的领域明确决定，不能从 cardId 非空、阵营为 ALLY 或“新注册 Unit”推导。

阵营、当前玩家归属与原始责任归属分别表达，不在 Deployable State 中统一塞入 `side`。旧多人模式的地块 `playerSideMask` 不在支持范围内，不进入 Tile 或部署请求。

## Deployable Capability

Deployable 表达场上实例的部署参数和本次部署事实。Deployment 是完整部署操作与场下经济的领域，两者名称按职责区分。

```text
unit/capability/deployable/
├── capability.ts       Definition、State、查询与初始化
└── hook.ts             部署观察 Hook 的类型及不可变增删

battle/deployment/
├── card.ts             单个 Card 的数据与局部转换
├── deployment.ts       Card 集合、DP、时间推进与部署通知
├── query.ts            当前地块与占格资格查询
└── operations.ts       完整部署、撤退与 Command 处理
```

```typescript
// unit/capability/deployable/capability.ts
export interface Definition {
    readonly cost: number;
    readonly redeployTicks: number;
    readonly slots: number;
    readonly placement: Exclude<Placement, "NONE">;
    readonly allowedSiteConditions: readonly SiteCondition[];
    readonly refund: {
        readonly rate: number;
        readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
    };
}

export interface State {
    readonly cardId: CardId | null;
    readonly cost: number;
    readonly refundLimit: number;
    readonly refundAllowed: boolean;
    readonly deployedHooks: readonly DeployedHook[];
}

export interface Deployable {
    readonly definition: { readonly deployable: Definition };
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
| State.cardId | 本次场上实例关联的持续待部署记录；允许无记录的实例 |
| State.cost | 此实例的部署费用属性，不等同于实际扣款，也不随 Card 后续费用变化 |
| refundLimit | 部署时确定的本实例返费上限数值 |
| refundAllowed | 此次部署是否允许返费，由创建流程明确赋值 |
| deployedHooks | 此 Unit 登记的部署观察函数；随不可变 Unit 状态更新 |

slots 采用静态参数。选定技能或模组后固定的差异由内容装配产生，不为未确认的动态额度变化先添加 Contribution 容器。关卡自动放置的装置不占部署数，必须明确配置 slots 为 0；不能用阻挡数推算部署额度。[PRTS 射击台](https://prts.wiki/w/射击台) 明确区分手动与关卡自动部署的占用规则。

部署资格读取当前 Tile.state.placement 与 siteCondition。siteCondition 是单个 symbol 或 null；null 无条件通过场地条件检查，其余值必须包含在 Deployable.allowedSiteConditions 中。Content 的 condition.normal（NORMAL）是普通场地条件，不等于 null；Core 不默认引入它。官方数值位掩码在 Data 边界转换，不进入 Core。

地块覆写直接更新当前 Tile.state，TileBinding 已移除。SUPPORT 登记本身不覆写部署许可；平台内容按登记格显式改写，详见 [Terrain 与 Mechanism](terrain.md)。Occupancy 的 Definition 声明 OCCUPANT／SUPPORT 槽位，State.tile 保存当前登记地块，Field 自动维护双槽反向表，见 [Occupancy 与 Support](occupancy.md)；SpatialPresence 表达是否参与空间事实；Layer 表达 GROUND／AIR，均不能替代 Deployable。

本次部署的 COST 属性与实际扣除的 DP 必须区分，也不能在撤退时读取 Card 的当前费用代替旧实例的属性。允许返费时按 `floor(min(State.cost × refund.rate, State.refundLimit))` 结算。基础上限从本次基础费用计算；采用 DEPLOYMENT_COST 策略时以上场费用属性为限。返费资格由具体操作确定，免费投递不必然禁止返费；直接预放的初态默认不允许返费，但不能从 cardId 为 null 推断所有实例都不能返费。[PRTS 部署费用](https://prts.wiki/w/部署费用#撤退返费) 提供玩法依据。

## Card 与部署子系统

Card 保存持续的待部署事实，是不可变值。静态 Definition 保存 Unit Definition、供给规则和随实例建立的导航 Modifier 配置；不在 Command 中临时传入这些内容。

```typescript
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

interface Card {
    readonly id: CardId;
    readonly definition: {
        readonly unit: UnitDefinition & Deployable["definition"];
        readonly supply: Supply;
        readonly navigationModifiers?: readonly UnitNavigationModifierPlacement[];
    };
    readonly stock: number | null;
    readonly cooldown: Cooldown | null;
    readonly pendingReturns: number;
    readonly costStage: number;
    readonly costContributions: readonly Contribution<readonly attribute.Modifier[]>[];
    readonly redeployContributions: readonly Contribution<readonly attribute.Modifier[]>[];
}
```

| 内容 | 职责 |
| --- | --- |
| id、definition | Card 身份与本场静态配置；基础费用／冷却仍取自 Unit.deployable Definition |
| stockLimit、activeLimit | 库存上限与同 Card 在场上限，null 分别表示无限库存／不限在场数 |
| stock | 当前可用数量；null 表示无限供给，0 表示没有可用库存 |
| cooldown | 当前周期的截止 Tick 与启动时长；不等同于基础 redeployTicks |
| pendingReturns | 排队补充中等待完成的回收数量，不能由库存或在场数量推算 |
| costStage | 本 Card 的费用惩罚进度，普通撤退／死亡增加，最多两个阶段 |
| costContributions | 对当前费用的修正候选 |
| redeployContributions | 对以后启动的冷却周期时长的修正候选 |

普通干员供给默认无限库存、至多一个场上实例、RETURN 冷却，并启用费用惩罚。默认策略不是所有召唤物的规则，具体内容明确配置自身供给。

- DEPLOYMENT：消耗库存时启动冷却，周期结束解除冷却；不自动补回库存。
- RETURN：离场启动冷却，周期结束补回一个库存。
- QUEUED：离场登记待回收数量，按顺序完成补充；有库存时可继续部署，不因补充周期正在运行而禁止消耗。

每次有效回收都必须保留其供给事实。只保存一个截止时间的 RETURN 仅用于不会同时存在多个待回收实例的合法组合；多实例来源采用已明确的供给政策。不能让后一次回收覆盖前一次而丢失库存。RETURN 的实际构造约束和更多并行／串行政策仍待实现核对，见 DEPLOY-06。

库存、库存上限和同时在场上限是三个独立事实，不能相互推算。场上 Unit 的 cardId 是关联的权威事实，查询当前实例从 Battlefield 取得，不另存一份 `card.deployed[]`。实际返费属于完整离场结算，Card 局部转换只负责自己的供给、计时及费用进度。

启动周期后，其截止 Tick 不因新登记的时长 Contribution 自动缩放；新周期读取新的有效时长。明确的缩短冷却操作只改变当前周期，超过当前剩余时长的部分不传给下一周期。零时长周期可在当前 Tick 完成。普通一 Tick 的刷新差异采用简单、确定的约定，不引入额外计时框架。

Deployment 子系统保存静态 `initialDp / maxDp / dpRecoveryTicks / slotLimit`，以及运行时 `cards / dp / nextDpRecoveryAtTick`。dpRecoveryTicks 为 null 表示不自然回复，slotLimit 为 null 表示不限制部署额度；额度查询读取场上 Deployable Definition。达到 DP 上限时停止自然回复计时，扣费后重新开始。

Card 集合和 Deployment State 由 BattleState 显式接续，并在 Tick 成功后一起发布。Card ID 由 nextCardId 分配，独立于 Unit ID；初始化 Card 不消耗 Unit ID。Card 在登场内容执行前可用，内容不依赖第二份待部署记录。

Contribution 是泛型不可变数值候选，不依赖 Unit，可以用于 Card。Card 所属领域负责施加、撤销、求值及计时响应；公共 Contribution 不增加 owner、生命周期或 Card 状态。目录位置不改变这个依赖方向。

不增加 nextCostContributions／nextRedeployContributions。先使用普通贡献集合；“下次部署后撤销”由具体来源接入对应操作，不能误作“下次开始冷却时使用一次”。确有必要时才引入独立集合，并先明确消费边界。

## API 与 Commands

局部 Card 操作返回新 Card；完整领域结算接收并返回 BattleState 或 Result，不直接写入 Runtime。

```typescript
// card.ts
create(id, input, stock?): Card;
resolveBaseCost(card): number;
resolveCost(card): number;
resolveRedeployTicks(card): number;
consume(card, tick): Card;
recycle(card, tick, reason): Card;
advance(card, tick): Card;
recharge(card, count): Card;
reduceCooldown(card, ticks, tick): Card;
setCostContribution(card, contribution): Card;
removeCostContribution(card, id): Card;
setRedeployContribution(card, contribution): Card;
removeRedeployContribution(card, id): Card;

// Deployment 聚合状态与完整结算
addCard(state, input): Result<CardId>;
getCard(state, cardId): Card | undefined;
updateCard(state, card): BattleState;
changeDp(deployment, amount, tick): DeploymentState;
advance(state, tick): BattleState;
usedSlots(state): number;
deploy(state, request): Result<DeployOutcome>;
retreat(state, unitId): BattleState;
```

战斗 Input 可配置 `deployment: { definition, cards }`。Card 输入包含 unit、可选 supply 和 navigationModifiers；供给缺省采用普通干员规则。不配置该部分时，场下 Card 集合为空、初始 DP 为 0。

正常部署请求标识 cardId、地块和本次朝向。Card 已在战斗输入／创建阶段建立，Command 不临时带入任意 Unit Definition。工厂从 Card Definition 和本次部署参数初始化 Unit；刷怪和直接生成对象使用自身流程。方向是本次实例的事实，影响范围和方向相关业务；当前代码尚未接入该参数，见 DEPLOY-03。

```typescript
type DeploymentCommand =
    | { readonly type: "DEPLOY_UNIT"; readonly cardId: CardId;
        readonly tilePosition: TilePosition;
        readonly direction: Direction }
    | { readonly type: "RETREAT_UNIT"; readonly unitId: UnitId };
```

完整部署依次检查 Card 是否存在、库存、冷却、同 Card 在场上限、总部署额度、DP 与地形占位。普通资格拒绝返回 REJECTED；外部 Command 输出 DEPLOYMENT_REJECTED，且不消费库存、DP 或 Unit ID。程序异常仍使本次 Tick 失败，不当作业务拒绝。成功结果保存 cardId 与生成的 unitId，登记已发生的领域事件；value 不重复返回已写入事件流的 Signals。部署被接受不保证回调结束后 Unit 仍存活，结果表达已经发生的事实。

实际部署费用还需按关卡费用上限裁定。手动撤退命令按可撤退性和调用方控制范围裁定；网络身份与授权由外层处理，内容强退和实际离场保留独立语义。当前这两项仍有缺口，不能把只检查 Unit 存在的通用离场入口当作完整手动规则。

再次部署没有额外 redeploy Command。当前不提供直接改变既有部署对象位置的公共操作、命令、事件或内容回调；特殊撤退—再部署仍须按真实内容审查退出原因、Buff／技能初态、HP 和费用政策，本轮不实现，不能借普通 Unit 状态更新推导出免费搬动平台或干员的能力。

正常部署由外部 Command 驱动，卫戍初始／自动部署由 Mechanism 组合公开领域操作。实例创建、Card 关联、战场登记和生命周期规则集中维护。模式消费政策与公共部署流程的接入契约仍需按玩法明确，不用 force/free/ignore 开关或通用权限注册表替代这项设计。

## 生命周期与 Hook 接口

### Unit：生命周期 Hook

Unit 只保存 PRESENT／LEAVING；注册前和删除后通过战场中不存在该实例表达，不增加一组出生、死亡、回收中间状态。

Unit Definition 必填 hooks 数组，没有生命周期程序时显式传入 []。这些静态 Hook 由所有对应实例共享；Unit 不再增加一份 hooks 字段，也不提供动态生命周期 Hook 登记操作。

```typescript
// unit/hook.ts：只声明 Unit 的阶段类型
export interface EnterHook extends TacticalHook<Unit, void> {
    readonly stage: "enter";
}

export interface TickHook extends TacticalHook<Unit, void> {
    readonly stage: "tick";
}

export interface LeaveHook extends TacticalHook<Departure, void> {
    readonly stage: "leave";
}

export type Hook = EnterHook | TickHook | LeaveHook;

// unit/unit.ts
export interface Definition {
    readonly id: DefinitionId;
    readonly hooks: readonly Hook[];
}

export interface Departure {
    readonly unit: Unit;
    readonly reason: LeaveReason;
}
```

TacticalHook 是 core/hook.ts 的通用 Hook<C, T>。该模块集中既有 Hook 类型、dispatch 和 set／remove 数组操作；unit/hook.ts 仅声明阶段类型，battle/unit.ts 直接调用通用 dispatch。Effect、Skill、Mechanism 等领域自身的回调契约不因 Unit 的调整改变。

enter 是本次场上实例的登场节点。battle/unit.add 在登记及战场关系维护后执行 Skill 入场操作，再读取最新 PRESENT Unit，筛选 Definition 中的 enter Hook 并直接调用通用 dispatch。advance 在阶段开始时固定 Unit 候选，轮到单位时读取最新 PRESENT 实例并派发 tick Hook；本轮新登场的单位下次参与。

每次派发固定该阶段 Hook 的候选与 Context。enter／tick 的 Context 是开始派发时的 Unit，后续 Hook 仍接收同一对象；BattleState 则逐项接续最新版本。每项执行前检查宿主仍为 PRESENT，嵌套操作导致离场后停止剩余 enter／tick Hook。需要当前 Unit 属性时，从返回的最新 BattleState 查询，不将固定 Context 当作动态 View。

leave Hook 在本次实例完成清理、注销和 Card 回收之后派发，顺序与原离场业务节点一致。固定 Context 是 Departure；Departure.unit 是开始离场、尚未清空 Skill／Effect 前捕获的不可变 Unit，不以清理后的 Unit 替换它，也不在注销后重新查询已不存在的宿主。内容可以读取原 SP 或位置，并修改当前 Card、生成新对象。这个旧值不复制，也不作为整个旧 Unit 持久存入 Card。leave 不以宿主仍在场作为派发资格。

旧 Unit 的静态／采样数据可直接读取；依赖当时全场的动态有效值须在清理前求出。不能将旧 Unit 与新 BattleState 混合后声称查到了离场前的动态属性。Effect 的结束业务仍在自己的 onDisable／onEnd 时点执行，不把全部退场业务搬进最后的 leave Hook。

承载关系变化由 Occupancy 的 SUPPORT Definition 中的 occupantAdded／occupantRemoved Hook 接收，不属于 Unit 生命周期 Hook；具体契约见 [Occupancy](occupancy.md#同步登记通知)。不提供直接重定位流程或对应的内容回调。

### Deployable：对实际部署的观察

Deployable 复用 Unit 的 enter／leave 生命周期节点；实际部署通过 deployedHooks 通知观察者。

动态部署观察保存在所属 Unit 的 deployable.deployedHooks 中。Deployable 提供接入点，具体 Effect／技能内容登记闭包；Deployment 结算负责通知，聚合 State 不另存全局 Hook 集合。

```typescript
// unit/capability/deployable/hook.ts
export interface Deployed {
    readonly unit: Unit & Deployable;
    readonly kind: "MANUAL" | "INITIAL" | "AUTOMATIC" | "MOVE";
}

export type DeployedHook = Hook<Deployed, void>;

setHook(state: DeployableState, hook: DeployedHook): DeployableState;
removeHook(state: DeployableState, id: string): DeployableState;
```

Deployed 是已发生部署的输入事实，unit 取自本次登记完成时的值；其中的 cardId 可以为 null。kind 表达本次方式，不是跳过费用／地形检查的权限开关。回调需要单位当前状态时，从传入 BattleState 查询，不把事实中的旧值当作动态 View。

调用遵守公共 Hook 的 accepts／invoke 契约。自身部署动作和其他单位的部署响应均可登记；业务自行判断事实中的实例是不是自身。Effect 通过当前输入版本查询自己的存在和生效状态，控制资格并在结束时撤销登记。

通知开始时按 Unit 存储顺序及各 Unit 内 Hook 登记顺序固定候选身份；每项执行前从最新返回版本重查所属实例、登记与资格。本次通知中新登记的 Hook 不补进当前列表。较早进入战场的观察者通常先于新实例在 enter 节点登记的 Hook，但不规定所有自身战吼都发生在他人响应之后：需要早执行的自身内容属于 enter 节点，需要部署通知的内容属于对应 Hook。具体内容若存在显著顺序依赖，以官方业务证据确定，不能仅凭一个通用顺序替代规则。

普通敌人出生只走登场流程，不自动广播部署事实。创建者必须明确这是否是部署；新 Unit、ALLY 阵营和 cardId 非空都不是充分条件。自己与他人的部署响应共用这个入口，不建立两套通知协议。

### 完整顺序

普通部署的顺序是：

```text
接纳部署，完成本次应有的 Card／DP 消费与关联
→ 初始化并登记 Unit，维护战场关系
→ 捕获本次 Deployed 事实
→ Unit 的 enter Hook：接入实例内容与规定的入场业务
→ 依次执行 deployedHooks
→ 返回部署结果
```

Unit 的 enter Hook 可以同步触发退场，部署通知仍表示此前已发生的部署，不因回调返回时当前 Unit 已不存在就丢失。通知本身也可以触发退场；后续 Hook 接续实际返回版本。拒绝的部署没有 Unit 的 enter Hook 或部署通知。

真实离场的顺序是：

```text
接受真实离场，捕获旧 Unit 与所需结算数值
→ 标记 LEAVING
→ 按原因执行本次应有的返费
→ 关闭 Action／Skill／Unit 生命周期，执行相应结束内容
→ 从 Battlefield 删除 Unit，维护场上关系
→ 若有关联，完成 Card 回收／库存／冷却／费用进度结算
→ Unit 的 leave Hook（使用开始离场时捕获的 Departure）
→ 模式 Mechanism 的离场响应
→ 返回离场结果
```

返费依据和数值在撤销贡献前确定，返费在 Card 费用进度更新之前发生。Action、Skill、Elemental Burst、Effect 如何结束由所属领域管理；生命周期入口接续它们的返回版本，不重建第二套结束算法。

### 离场清理的偏序

离场固定以下偏序；Action、Skill、Elemental Burst 之间不规定通用业务优先级：

```text
Unit 进入 LEAVING
        │
        ├── 终止 Action 及其依赖
        ├── 终止 Skill 及其依赖
        ├── 终止 Elemental Burst 及其依赖
        └── 终止剩余 Effect
        │
        ▼
Unit 从 Battlefield 移除
        │
        ▼
Unit 的 leave Hook
```

remove 入口负责进入 LEAVING；清理后重新读取的实例用于注销与移除记录，私有步骤不重复设置生命周期。公开 Battlefield.remove 仍独立检查身份存在性。

图中的四个分支是清理职责，不表示并行执行，也不要求一个分支必须完全退出后才能同步进入另一分支。各领域负责自己的完整终止、依赖关闭和结束内容；开始终止先形成相应生命周期事实，重复请求不重复收尾。Effect 同时绑定 Action 和 Skill 时，任一依赖关闭即可结束它，另一分支再次遇到它时跳过。

任何跨领域操作返回后，外层若还需要依赖宿主或自身的当前生命周期，就从最新 BattleState 查询并确认。同步回调允许重入，重入可以结束外层正在执行的对象；Typed Ref 保留身份与类型，不保证它仍在运行。这是既定执行模型的正常续执行要求。

终止不等待已经进入调用栈的回调退出。例如 Effect.onEnd 内造成宿主死亡，离场可在该嵌套调用返回前完成；原 onEnd 随后继续，使用已采样载荷或依据最新事实判断后继。图中的清理边界不承诺所有已进入的 JavaScript 函数都已返回，不为此延迟移除 Unit 或恢复已经结束的实例。

`LEAVING` 宿主及已关闭的生命周期不能接受新的依赖安装。其他 Unit 上仅记录来源、没有绑定已关闭生命周期的独立效果仍可保留。结束内容触发的伤害、治疗、安装和其他单位离场逐项接续最新状态，不回滚已完成的前缀。

当前离场实现先取消 Skill，再取消 Action，避免 Action.onEnd 重入 finish 把离场取消记为正常完成；这是该流程的固定执行顺序，各兄弟领域之间仍只要求上述必要偏序。各领域自行管理 ENDING、依赖关闭、结束程序、实例移除和领域事件。

模式观察可由 Mechanism Definition 提供 `onUnitLeave(state, mechanismId, departure) → state`，无需另建生命周期容器或事件总线。模式响应位于该 Unit 的 leave Hook 之后，自动再登场因此能读取完成跨部署资源转换的 Card。模式若有更早就必须成立的倒地／资格约束，应在对应业务步骤显式维护，不能把正确性寄托于末尾观察通知。正常模式响应仍可继续产生后续业务。

HP 归零、复活与真实离场分别处理；成功复活不执行 Unit 的 leave Hook。直接更新位置不重新执行 Unit 的 enter Hook，也不广播部署。特殊撤退—再部署与其原因、状态继承和通知政策尚待实际内容实现，本轮不预设一套移动流程。

Unit 生命周期 Hook 与部署 Hook 遵循通用 accepts／invoke 契约，invoke 返回 Result<void> 并接续其中的 BattleState；模式响应继续使用自身回调契约。Unit 不自驱，Battlefield 的存储与一致性维护不触发这些内容；完整领域结算控制调用顺序，Runtime 只推进 Tick 和发布最终结果。

### 内容接入示例

下列示例说明职责分工；各角色的原生相对触发顺序仍需按具体内容核对。

- 泥岩的初始盾与持续充能由登场内容接入 Effect；是否有需要后于其他部署业务的动作，按具体内容安排，而非把所有自身动作强制放在一个时点。
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
