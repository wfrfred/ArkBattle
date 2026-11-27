# Deployment、Card 与 Unit 生命周期

Deployment 聚合资源、部署历史及调度；Card 完成部署资格、消费、构造前装配与实例创建，并保存跨部署资源和当前关联 Unit；Deployable 保存本次场上部署事实并负责撤退及离场结算，Occupancy 保存登记格与摆放朝向，Unit／Lifetime 处理通用生命周期。当前支持普通按格部署、特殊移动、主动撤退及被动死亡。

## 关键语义

- 预览与执行使用同一请求、报价契约和资格流程；拒绝不消费，成功先支付再构造与入场。
- 本次来源 Card、COST、退款依据与额度在登记前由 Deployable 构造，账户仍归 Deployment。
- 主动撤退在请求离场前返还 DP。Card 常规离场回收由自身装配的 `removed` 结算；自身特殊移动失败另行回收。
- Unit 注销及结构占格释放先于本地 removed，再全局 removed；各集合内部遵守公共 priority。
- 死亡时立即清格及回收 Card，全局部署位从 `removed` 起占用 1 战斗秒。
- 部署间隔与逐份恢复独立，暂停保留余时，不把满额等待补发为资源。

## 状态归属

| 事实 | 领域 |
| --- | --- |
| 身份、身体位置、生命周期 | Unit |
| 登记格、方向与 Support 配对 | Occupancy |
| 部署历史 | Deployment |
| Card 集合、排序、费用截断上限 | Deck |
| DP 余额、上下限和自然回复 | DP |
| 全局部署位上限、占用和待归还份额 | Slot |
| 单卡库存、费用阶段、时钟、部署限制、当前关联 Unit、构造前 Hook 和私有 state | Card |
| 默认返费规则、本次 Card／COST／额度／退款与撤退限制 | Deployable |

各领域通过自身操作维护状态，不借通用 Unit 更新推断账务。具体声明见 [deployment/index.ts](../../src/core/battle/deployment/index.ts)。

`Deployment.State` 聚合 `deck`、`dp`、`slot` 与部署历史。初始化配置由三个子域的 Definition 组合，`Deployment.Definition.dp` 和 `Deployment.Definition.slot` 分别提供账户和部署位的基础配置。`Deployment.Definition.costCeiling` 必填，是 Card 费用计算的截断上限，DP 的有效上限约束账户余额。Battle Input 的 deployment 为必填的 Deployment.Definition 或 null；null 使用 99 费用上限、零 DP（账户范围 0–99、无自然回复）及不限部署位的默认配置。

`deployment.initialize(definition)` 只构造三个子领域的 State 与空部署历史。初始 Card 列表由 Battle.Input.initialCards 提供，与 initialEffects、initialUnits 并列；Battle 按输入顺序使用 Card 自身的构造和登记操作，在开场 Effect 和 Unit 装配前完成手牌登记。

## 静态内容与 Card

开场手牌的每一项绑定一份 `definition` 和一份 `unitDefinition`。Card Definition 描述卡牌政策和程序。Unit Definition 描述场上单位，并提供卡牌部署所需的 `occupancy` 和 `deployable`。部署时默认复用该 Unit Definition，可由本次构造前 Hook 调整。多张 Card 可以共用一份 Unit Definition，各有独立身份和资源。

Card 绑定的蓝图所需 `Initial` 必须由部署入口提供。普通按格部署提供 Occupancy 和 Facing 初值。Route 需要本次路线的 Plan 和 offset，因此带 Route 的蓝图在 Card 构造时由类型检查拒绝。

`card.initialize(battle, { definition, unitDefinition })` 创建 Ref、运行 Card Definition 的初始化并返回完整实例。`card.add(battle, self)` 将 `Card<S, P>` 按 Ref 登记，并把新卡追加到当前牌序末尾，同时登记 Lifetime。Card 使用 `Config<Card, never>`，能够作为依赖目标，结束输入在编译期被禁止。Deck 使用异构 Store 以 Ref 为键存放完整实例。`card.all(battle)` 与 `deck.ordered(battle)` 返回默认 `Card`，精确引用通过 `ref.get(battle)` 取得对应的实例类型。

`Card<S, P>` 是按策略区分的判别联合，与 `Definition<S, P>` 共享私有状态类型 `S` 和策略类型 `P`。初始化从 `definition.policy` 设置实例顶层的 `card.policy`，它在卡牌生命周期内保持稳定。策略为 `DEFAULT`、`UNIQUE` 或 `QUEUED`。

`dp` 配置基础费用和涨费，`Supply.Definition<P>` 配置初始库存、普通部署的库存消耗量 `consumption`、持有／在场上限及基础冷却时长（Tick）。`slot` 是单次部署默认占用数。运行时 `card.dp` 保存涨费阶段和费用贡献，`card.supply` 按 `Supply.State<P>` 保存库存、冷却和再部署时长贡献。只有 `QUEUED` 的供给配置和状态持有 `pending`，其初始值在配置中必填。`Card.Definition.restrictions` 声明静态部署限制，运行时 Card 保存后续登记的限制；两者均参与整次部署的资格判断。

Card 根据策略结算本次扣库、回收和冷却，并写回 Deck。每 Tick 的 `card.advance` 提交计时变化，再执行 `Definition.onTick`。[Card 操作](../../src/core/battle/deployment/deck/card/operations.ts)

Supply 的库存、计时和 Contribution 操作保留 `Card<S, P>` 的私有状态和策略类型。调用者可以组合多项修改，再通过 `deck.replace(battle, card)` 按 Ref 写回。如果中途有其他操作更新了同一张卡，从最新 BattleState 重新取卡后再修改。[Supply 操作](../../src/core/battle/deployment/deck/card/supply/operations.ts) · [Deck 写回](../../src/core/battle/deployment/deck/operations.ts)

Card 保存自身的 Hooks，初始化时由 Definition 装配。Card 是 Lifetime 实例，可以直接作为 Effect 的宿主；需要跟踪或消费后续部署机会的 Effect，通过 Card 的 Hook 执行本卡业务，不提前保存一组 Unit 程序。私有状态的构造、类型配对与写回遵守公共约定，不在此复制异构容器接口。

## 卡牌费用

Card 的 `dp.parameters` 必须提供数值费用。`card.dp.create` 补齐参数的中性值，卡牌初始化验证基础费用非负。运行时 `stage` 记录涨费次数，`contributions` 保存可安装和移除的费用修正。`card.dp.setCostContribution(card, entry)` 和 `card.dp.removeCostContribution(card, id)` 返回修改后的 Card，由调用者通过 `deck.replace` 写回。

有效费用贡献按既有分组规则选出。同组只保留优先级胜出的整条贡献。若仍有多个费用覆写，按贡献 ID 顺序取第一个非 `null` 值。`baseAddition`、`step`、`maxMultiplier`、`finalAddition` 各自加总，`costScale` 相乘。

只有 `UNIQUE` 的 DP Definition 和 State 声明 `increase`。其基础值与所有生效的布尔贡献都为 true 时，回收允许累加。内容通过 `card.dp.setIncreaseContribution` 和 `card.dp.removeIncreaseContribution` 更新 `UNIQUE` Card 后写回 Deck。

`card.dp.resolveCost(battle, card)` 根据当前 Deck 的费用上限计算牌价。牌价的基数取费用覆写或定义费用加基础增量。先用 `min(1 + stage × step, max(1, maxMultiplier))` 乘基数并向下取整，再乘 `costScale` 并向下取整，最后加 `finalAddition` 并按 Deck 的费用上限截断。部署时从 Card 采样两笔金额，基础费用取定义费用加基础增量，本次 COST 取牌价。 [算价查询](../../src/core/battle/deployment/deck/card/dp/query.ts) · [原生参数修改](../research/cases/24-deployment-cost-and-supply.md#各费用参数的修改时点)

## 待部署区顺序

`deck.ordered(battle)` 读取已保存的牌序。开场按传入顺序登记卡牌，卡牌写回和部署结算各自提交业务变化。`deck.setOrdering(battle, rule)` 接受比较器 `(battle, left: Card, right: Card) => number`，只设置后续使用的排序规则，传入 `null` 停止重排并保留当前顺序。

Deck 每 Tick 推进所有 Card 后调用一次 `deck.sort(battle)`。有排序规则时，按最新 BattleState 稳定排序现有全部牌，同分保留原顺序，并保存结果。需要在同一次操作内按新牌序选目标时，例如凛御银灰 S2 减费后，内容可以显式调用 `deck.sort(battle)` 再读取顺序。[原生排序样本](../research/cases/24-deployment-cost-and-supply.md#四手牌顺序与目标选择)

## 部署历史

`battle.deployment.history` 是本场成功 Card 部署的只读序列，每条保存 `card: Ref<Card>` 和 `unit: Ref<Unit & Deployable>`。`card.deploy` 按实际部署顺序追加，在 Unit 初始化后、任何 `entered` 前发布记录。拒绝部署和无 Card 的直接 Unit 登记不产生记录。`card.deploy` 成功时返回新 Unit Ref，失败时返回 null；Card 身份已由 Request 提供。

Unit 注销后保留记录，`cardForUnit` 仍可反查它来自哪张 Card；具体 Content 可以用此事实决定 [Effect 来源分组](effect.md#来源分组)。Card 的 `units: readonly Ref<Unit & Deployable>[]` 初始为空，每次部署成功构造 Unit 后、登记并派发 `entered` 前先追加新 Ref；在 Card 装配的 `removed` 结算时，无论离场原因，都解除该关联。该列表含 `ENDING`，与仅记录历史的 Deployment 不同。局部 removed 中先于 Card 关联结算的 Hook 可能看到已经注销但尚未解除关联的实例。

## 请求与统一资格

`Card.DeployRequest` 明确 Card Ref、落点、方向（`null` 表示未指定）、报价选择及本次限制。普通 Command 同样显式提供方向，生成默认请求；Content 可以直接构造请求并提供本次业务的报价和策略。

`quote` 为必填字段，取值为 `Card.Quote | null`。null 表示在查询或执行时从当前 Card 读取有效 DP 费用、`supply.consumption` 与 `slot`；非 null 则完整指定本次 DP、库存和额度消费。Quote 中的 dp 为 null 表示不支付，零表示正常零费；stock／slots 可为零。consumption 为必填非负安全整数。公开请求查询与执行共用请求校验，合法请求中的未知 Card 不通过资格。

固定前提由代码检查：Card 存在、资源足够、支付后不低于 DP 下限、落点合法、同 Slot 不冲突。不能用限制豁免保留无法履行的消费承诺。冷却、同卡在场上限、部署位上限及普通地块许可属于可配置限制，其默认限制 ID 分别为 `@deployment/cooldown`、`@deployment/active-limit`、`@deployment/slots`、`@deployment/placement`。

Card 初始化与 DeployRequest 入口各自校验列表内的限制 ID 唯一。限制依次合并默认、Card 静态、Card 当前与 Request，不同列表的同 ID 后者覆盖。有效项按贡献政策选择，所有限制均允许才通过资格；不对具体拒绝分支建立公共原因分类。查询与执行都使用同一规则和资源事实。

部署资格读取传入的 BattleState。`card.canDeploy(battle, request)` 返回本次请求是否满足全部资格；`card.positions(battle, cardRef)` 查询普通 Card 当前可部署的全部地块，使用未指定方向、默认报价及空的本次限制列表。特殊请求需要逐格调用 `card.canDeploy`。`Card.Restriction` 的 Context 为 `Card.RestrictionContext`，仅包含原始 `request: DeployRequest`（quote 可为 null）。调度器先推进部署领域，再处理本 Tick 的部署命令。

## 普通部署流程

合并并判定资格 → 采样基础费用与本次 COST → 提交 DP、部署位、库存及部署间隔 → 同步派发本次 Card 的 `card.beforeDeploy` → `Unit.initialize` 分配身份并装配 → Deployable.setDeployment 写入本次事实 → 追加 Card.units 关联及部署记录 → 登记 Unit／占格 → 派发 Battle 级和 Unit 本地 `entered`。

付款使用当前 DP 余额。落点与方向通过 Occupancy Initial 提供；Card 不直接重建 Deployable State。

Card 在构造前 Hook 完成后将自己的离场关联结算 Hook 追加至本次 Unit.Input.hooks。Unit 构造从调整后的 Unit.Input 装配输入 Hook、Capability 和 Unit Definition 的程序；公共 priority 可调整同一集合，默认同级保持装配顺序。Unit.add 完成登记、全场及本地 entered，Occupancy 配对由其本地程序处理。

## 开场 Unit

`Battle.initialize()` 的 `initialUnits` 接收普通 `Unit.Input`。开场依次调用 `Unit.initialize()` 和 `Unit.add()`，用各自的 Definition、位置及 Initial 创建、登记并派发 `entered`。通过这个入口创建的 Deployable 初始来源 Card 为空，COST 与额度为零。

关卡运行中的出现或离场由具体关卡程序调用 Unit 或 Effect 的创建及结束入口。开场装配的业务通知沿用所创建实体的登场流程。

## Deployable 依赖与构造

Deployable 单向依赖 Occupancy。初始来源为空，COST 与额度为零。尚未登记时由 `setDeployment` 构造本次部署事实。运行中的撤退限制经 Change 更新，Context 使用当前 self。

`Deployable.Definition.refund` 声明默认返费倍率和上限规则，`null` 表示禁止返费。`setDeployment` 接收采样的基础费用与本次 COST，根据 Unit 的规则计算实例上限。`BASE_COST` 取基础费用，`DEPLOYMENT_COST` 取基础费用与本次 COST 的较大值。`Deployable.State.refund` 保存本次返费倍率和数值上限，未配置部署事实时为 `null`。 [Deployable 部署操作](../../src/core/unit/capability/deployable/operations.ts)

可占格但不可部署的对象不需要 Card；Deployable.card 只是来源关系，不是 Lifetime 依赖。

## 离场结算

`deployable.canRetreat` 查询当前 ACTIVE 与撤退限制；`deployable.retreat` 负责完整撤退业务。返费按本次 COST 与返费倍率计算，并受实例上限约束。系统先返还 DP，再请求 Unit 以 RETREAT 结束。`removing` 可观察到已返还的 DP。

Unit 注销后，Deployable 固定 `removed` 通过 Slot 归还实际占位；Card 自己装配的独立 `removed` Hook 解除本次 Unit 关联并按离场原因决定是否回收。两者各以普通 priority 0 结算，不承诺在同一回调内执行。RETREAT、DEATH 和 REDEPLOY_EXTERNAL 触发 Card 回收，并按 Supply 策略处理库存与冷却。只有 `UNIQUE` 且有效 `increase` 为 true 时自动增加涨费次数，即使牌价已触及倍率上限。REDEPLOY_SELF、SCRIPT、EXPIRED、EXIT 跳过回收。

DEATH 传入 `TICKS_PER_SECOND` 作为归还延迟，其他离场立即归还占位。Unit 与格子在离场时立即注销，Card.units 则在 Card 自身的 removed Hook 中更新。 [原生退出与延迟](../research/evidence/deployment-exit-limits-20261122/README.md#退出与延迟)

## 特殊移动

`deployable.redeploy(battle, reference: Ref<Unit & Deployable>, tilePosition: TilePosition, direction: Direction | null, kind: "SELF" | "EXTERNAL")` 返回 `Result<Ref<Unit & Deployable> | null>`。Unit 不存在、已进入 ENDING 或无来源 Card 时返回原状态及 null。direction 为 null 时沿用旧实例的 occupancy.direction。

先完整结束旧 Unit（SELF 对应 REDEPLOY_SELF，EXTERNAL 对应 REDEPLOY_EXTERNAL），两种原因均立即归还旧部署位，不返还 DP。旧 Unit 离场后，使用原 Card 执行正常 `card.deploy`，本次报价为 `{ dp: null, stock: 0, slots: card.definition.slot }`，本次覆盖冷却限制，其他普通部署资格仍然有效。落点资格在旧 Unit 离场后判定，原地部署也不额外豁免地块限制。

成功使用当前 Card 基础费用、COST、Unit 的返费配置和本次额度，生成新 Unit 身份、关联和历史记录，正常派发 entered；不复制旧实例的部署事实。失败不恢复旧 Unit，SELF 补做一次 Card 回收，EXTERNAL 已在旧 Unit 离场时回收，不重复执行。HP、SP 和技能状态等具体接续由 Content 通过离场和部署流程处理。

这是同步完整操作。若调用处正在 Lifetime 析构中，应由调用者以 [defer](lifetime.md#析构后执行操作) 延后整次操作，确保旧 Unit 完整注销后才开始新部署。若结束请求返回时旧 Unit 仍登记，则抛出同步入口契约错误，而不是继续部署。

## 离场清理的偏序

公共阶段为：发布 ENDING／派发 removing → 真实依赖完整结束 → 捕获当前 removed 登记快照 → 注销 Unit 与结构占格、记录移除 → 本地 removed → 全局 removed。

本地默认同级装配顺序为 Unit.Input Hook（包含 Card 追加的关联结算）、Capability 程序（包含 Deployable 额度归还与 Occupancy 配对清理）、Unit Definition Hook。显式 priority 可改变本地顺序，不能跨公共阶段。高优先级内容不能假设尚未执行的账务已经完成。

removing 和依赖收尾期间的 removed 登记变化进入注销前快照；固定 Departure 仍代表离场开始时的历史。所有本地 removed 都看到 Unit 与结构已注销，旧配对不清掉同格替代实例的新绑定。

`slot.used` 在 `removing`、依赖结束和死亡延迟期间仍计入本次份额。预置份额为零。部署历史用于来源反查；`card.units.length` 用于当前同卡在场限制，包含尚未完成 Card removed 结算的 Unit。与此前按登记 Unit 扫描计数不同，较早的 removed Hook 可能看到尚未解除的关联；Card 关联结算和 Slot 归还可以分别观察，不建立额外的共同完成阶段。

## 构造前 Hook

`type BeforeDeployHook = Hook<DeployRequest, UnitInput<UnitDefinition>>`。资格通过并提交 DP、部署位、库存和部署间隔之后，`Unit.initialize` 之前，直接从本次 Card 的 Hooks 同步派发 `card.beforeDeploy`；拒绝部署不派发。Context 固定为原始 DeployRequest（quote 可为 null），工作值为本次 Unit.Input，初始 hooks 为 `Hooks.empty()`。内容可以调整本次 Unit 的 definition、initial 和 hooks，已确认的落点及支付事实不属于修改职责。Card 的 Hooks 不复制给 Unit，不提前保存一组 Unit 程序。

公共候选、priority、替换和嵌套派发见 [Hook](hook.md)。多卡共享的效果通过同一个 Effect Ref 读取最新状态，并在可能重入的操作前先发布机会消耗。构造前时点本身不保证重入安全；同组优惠或报价等更早使用的机会仍须在可能重入的操作前消费，不用 Event 执行业务。全场观察者通过 `battle.unit.entered` 及 Deployable 的 Card 关联区分部署入场；不提供额外的 Card 后置通知或全局 deployed Hook。

## 库存与计时

`stock` 是可用库存。`QUEUED` 的 `supply.pending` 是待恢复份数，总持有量为 `stock + pending`。Supply 的公开接口由 Card 的 `supply` 命名空间导出。`consume` 只扣 `stock`，库存不足时拒绝。`recharge` 直接增加可用库存。`enqueue` 要求 `Card<S, "QUEUED">`，增加待恢复份数。通用 Card 可通过 `card.policy === "QUEUED"` 收窄。两种补充都受总持有上限约束。

每张卡保存一个 `cooldown`，记录当前段的剩余 Tick。DEFAULT 部署后开始冷却，普通离场保留库存。默认消耗为零的 Card（如风雪之眼）普通部署不扣库存，仍启动冷却；库存容量不限不等于免消耗。见[原生策略与消费行为](../research/cases/24-deployment-cost-and-supply.md#计时与消耗是不同的原生维度)。UNIQUE 普通离场立即归还一份库存并开始冷却。两种策略都等冷却到零才允许再次部署。QUEUED 普通离场追加一份待恢复库存，已在推进的恢复段保留余时。QUEUED 的可用库存可以在恢复期间部署。

调度器每 Tick 通过 Deck 逐张调用 `card.advance`。Card 先推进库存和冷却，再用已发布的状态执行 `Definition.onTick`。暂停保留余时。QUEUED 中一段到期时，将一份从 `pending` 移到 `stock`，必要时用有效时长开始下一段。每次推进最多恢复一份，包括零时长。`setCooldown`、`reduceCooldown` 只改当前余时，设置为零后由下一次正常推进结算队列。时长 Contribution 作用于未来段。

持有上限和在场上限使用各自的 Contribution。有效上限取非负整数，`null` 表示不限。`supply.total(card)` 返回总持有量，`supply.remaining(card)` 返回还能增加的份数，不限量时返回 `null`。持有上限降低时同步裁剪总持有量，优先保留待恢复份数。若裁掉最后一份待恢复库存，则清除当前计时与暂停状态。在场上限用于后续部署资格，已部署单位由内容决定是否召回。

## DP

`Deployment.Definition.dp` 提供起始余额、基础上下限和自然回复周期。`dp.resolveMin`、`dp.resolveMax` 与 `dp.resolveRecoverySpeed` 按对应的 Modifier 贡献求出有效值。账户上限独立于 Deck 的卡牌费用截断上限。

调度器每 Tick 调用一次 DP 推进。自然回复的基础速率为每 Tick `1 / recoveryInterval` 点 DP，周期为 `null` 时关闭自然回复。`progress` 以基础回复速度对应的 Tick 数累计。每次推进按有效速率累积，负余额时额外乘 0.5。跨零或变更回复速度保留已有进度，达到或超过有效上限时停止累积并清空进度。

`dp.modify` 按有符号差值修改余额并应用有效上下限。余额已超上限时，正差值保持原余额，负差值按实际金额减少并仍受下限约束。`dp.pay` 按有效下限判断能否支付，成功时扣除准确金额，拒绝时返回原状态。支付零点合法，免支付的报价由 Card 跳过付款。支付、余额修改与资格查询都使用当前余额。

提高有效下限时同步抬高低于下限的余额。设置上限贡献必须指定 clamp：`false` 保留余额，`true` 将超出的余额截到新上限。移除上限贡献重新求值，保留余额。

## Slot

`slot.resolveLimit(battle)` 从基础上限和贡献求出有效上限，`slot.remaining(battle)` 返回非负的剩余额度。基础上限为 `null` 时表示不限位，两项查询均返回 `null`。改变上限只影响之后的资格检查，已有占用继续保留。剩余额度为零时，零占位部署仍可通过部署位检查。

`occupy` 登记本次实际占用。`release` 接收相对延迟，零延迟立即扣减占用，有延迟时保存 `{ amount, atTick }`，其中 `atTick = battle.tick + delayTicks`。调度器在处理本 Tick 的部署命令前结算到期归还，扣减 `used` 并移除记录。部署查询和部署操作使用已结算的占用。

## 支持范围

特殊移动的 Core 操作已接入，具体 Content 的 HP／技能接续、待投放及特殊消费者仍未实现。机制依据见[特殊移动的结果与实际消费者](../research/cases/24-deployment-cost-and-supply.md#特殊移动的结束原因)。

待部署区成员模型尚待调整；手牌重排竞争、隐藏／锁定和特殊回收仍未完整实现。卫戍倒地、自动部署与经济政策由外部机制／Meta 组合。再部署时间的多来源公式仍待核对。

机制依据见[部署与供给研究](../research/cases/24-deployment-cost-and-supply.md)，必要验收和未闭合范围分别集中于 [Verification](verification.md)与 [Tactical 语义](tactical-semantics.md)。
