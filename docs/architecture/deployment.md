# Deployment、Card 与 Unit 生命周期

Deployment 完成部署资格、消费、实例创建与通知；Card 保存跨部署资源，Deployable 保存本次场上部署事实，Occupancy 保存登记格与摆放朝向，Unit／Lifetime 处理通用生命周期。当前支持普通按格部署、主动撤退及被动死亡。

## 关键语义

- 预览与执行使用同一请求、报价契约和资格流程；拒绝不消费，成功先支付再构造与入场。
- 本次来源 Card、COST、退款依据与额度在登记前由 Deployable 构造，账户仍归 Deployment。
- 主动撤退在请求离场前结账，被动死亡由真实死亡的 removed 结账；SCRIPT／EXPIRED 不冒充死亡。
- Unit 注销及结构占格释放先于本地 removed，再全局 removed；各集合内部遵守公共 priority。
- 部署间隔与逐份恢复独立，暂停保留余时，不把满额等待补发为资源。

## 状态归属

| 事实 | 领域 |
| --- | --- |
| 身份、身体位置、生命周期 | Unit |
| 登记格、方向与 Support 配对 | Occupancy |
| DP、自然回复进度与 usedSlots | Deployment |
| 库存、费用阶段、时钟、私有 state 和部署历史 | Card |
| 本次 Card／COST／额度／退款与撤退限制 | Deployable |

各领域通过自身操作维护状态，不借通用 Unit 更新推断账务。具体声明见 [deployment/index.ts](../../src/core/battle/deployment/index.ts)。

## 静态内容与 Card

开场手牌的每一项绑定一份 `definition` 和一份 `unitDefinition`。Card Definition 描述卡牌政策和程序。Unit Definition 描述场上单位，并提供卡牌部署所需的 `occupancy` 和 `deployable`。部署时直接复用该 Unit Definition。多张 Card 可以共用一份 Unit Definition，各有独立身份和资源。

`card.initialize(battle, { definition, unitDefinition })` 分配 ID、运行 Card Definition 的初始化并返回完整实例。`card.add(battle, self)` 接收私有状态与 Definition 配对的 `Card<S>`，按 ID 登记进通用 `Store`。`card.get(battle, ref)` 依据 typed Ref 恢复实例类型。展示顺序独立保存，Card 登记或写回变更后接续 Deployment 的排序策略。

Card 配置明确费用、部署间隔、库存／在场上限、额度、退款和供给政策。当前 cooldownOnDeploy 控制部署时启动间隔，recoverOnRetreatOrDeath 与 increaseCostOnRetreatOrDeath 分别控制普通撤退／死亡恢复及费用阶段；这些字段的组织仍待重审，不能把现有布尔组合视为已完成领域收口。

deployedUnits 保存本场成功部署的 Unit Ref 历史，在初始化后、任何 entered 前登记；离场不删除。cardForUnit 因而在来源注销后仍可查 Card，支持 [Effect 来源分组](effect.md#来源分组)。历史不等于在场数，deployedCount 查询当前仍登记的实例，包含 ENDING。

Card 的 unitHooks 注入未来实例，不追改已经创建的 Unit。私有状态的构造、类型配对与写回遵守公共约定，不在此复制异构容器接口。

## 请求与统一资格

DeployRequest 明确 Card Ref、落点、可选方向、Quote、本次限制及 Hook。普通 Command 生成默认请求，Content 可以按本次业务提供报价和策略；显示／点选与部署 Context 各保留实际所需输入，不伪造落点。

Quote 承诺 DP、库存和额度消费：dp 为 null 表示不支付，零表示正常零费；stock／slots 可为零。公开查询与执行共用报价校验，非法报价在入口失败；合法请求中的未知 Card 返回业务拒绝。

固定前提由代码检查：Card 存在、资源足够、支付后不低于 DP 下限、落点合法、同 Slot 不冲突。不能用限制豁免保留无法履行的消费承诺。冷却、同卡在场上限、部署位上限及普通地块许可属于可配置限制。

限制依次合并默认、Card 静态、Card 当前与 Request，同 ID 后者覆盖。有效项按贡献政策选择，按 ID 稳定求值；首拒绝映射既有原因，自定义原因是 RULE，不依赖历史插入位置。查询与执行都使用同一规则和资源事实。

求值先接续到当前 Tick 的库存／时钟／DP。preview／evaluate 只读这个临时版本，positions 保留完整报价和限制逐落点求值；拒绝不发布资源推进或创建实例。

## 普通部署流程

合并并判定资格 → 采样 COST／退款依据 → 提交 DP、库存、usedSlots 及部署间隔 → `Unit.initialize` 分配身份并装配 → Deployable.setDeployment 写入本次事实 → 登记 Unit／占格 → 普通 entered。

付款先处理 DP 时基，不能在消费后补发满额期间回复。落点与方向通过 Occupancy Initial 提供；Deployment 不直接重建 Deployable State。

部署 entered 程序先装配，然后 Card／Request Hook，再 Capability 和内容程序；公共 priority 可调整同一集合，默认同级保持装配顺序。Deployment 部署通知和 Occupancy 配对各自通过已登记程序完成，Unit.add 不特判这些领域。

## 关卡预置与开场 Unit

Predefined 持有完整 Unit 或 Mechanism 创建项，只增加区分领域的 `type`。`initiallyPresent` 声明开场出现。`appear` 先用所属领域的 `initialize` 分配身份并构造实例，再登记预置绑定，最后通过 `add` 登记实例。预布置 Unit 在该路径直接使用 Unit Definition，`deployable.card` 初始为空。Unit 此时派发 `entered`，Mechanism 此时安装所需的 Battle 监听。

appear／remove 是按 PredefinedDefinition.id 的领域操作，不通过 Command。remove 先撤销旧绑定再完整结束实例；Unit 分支接收 Unit.End。离场回调重新出现同一预置项时，外层保留新绑定。预置不执行玩家部署的支付与部署通知。

## Deployable 依赖与构造

Deployable 单向依赖 Occupancy。初始来源为空、COST／额度为零、退款为空；没有专属 Initial，尚未登记时由 setDeployment 构造本次部署事实。运行中的撤退限制经 Change 更新，Context 使用当前 self。

可占格但不可部署的对象不需要 Card；Deployable.card 只是来源关系，不是 Lifetime 依赖。

## 主动操作与被动死亡

retreat 要求当前 ACTIVE 且撤退限制允许，先按本次依据退款，再按 Card 政策推进费用阶段／库存恢复，最后请求 Unit 以 RETREAT 结束。已有恢复队列保留当前段，新段启动时才采样时长。嵌套结束只完成 Prepare 时，这些前置账务也已完成。

被动死亡程序只在 DEATH 的 removed 结算 Card；零 HP 的暂态不是死亡确认。其他真实离场仍清理 Occupancy 配对和本次额度。HP 死亡确认与归属通知见 [Resource](resource.md)。

## 离场清理的偏序

公共阶段为：发布 ENDING／派发 removing → 真实依赖完整结束 → 捕获当前 removed 登记快照 → 注销 Unit 与结构占格、记录移除 → 本地 removed → 全局 removed。

本地默认同级装配顺序是：归还本次 slots、适用的死亡 Card 结账、Card Hook、Request Hook、Occupancy 配对清理、Definition Hook。显式 priority 可改变本地顺序，不能跨公共阶段。高优先级内容不能假设尚未执行的账务已经完成。

removing 和依赖收尾期间的 removed 登记变化进入注销前快照；固定 Departure 仍代表离场开始时的历史。所有本地 removed 都看到 Unit 与结构已注销，旧配对不清掉同格替代实例的新绑定。

usedSlots 在 removing 和依赖结束期间仍计入本次份额，物理注销后的 Deployable Hook 调用 Deployment 归还；预置份额为零。账户不由能力直接写入，Card 历史和当前 deployedCount 也不代替它。

## 部署观察

Deployment 的 deployed 与全局 Unit removed 分别存于所属 Battle Hooks 集合，不塞进某个 Unit。Deployed 固定 `{ unit, request }` 创建事实，支付读取 request.quote；后续 entered 仍可能改变或移除实例，需要实时状态时重新查询。

公共候选、priority、替换和嵌套派发见 [Hook](hook.md)。一次性来源在同步触发新部署前先消费自己的机会，不用 Event 执行业务。

## 库存与计时

cooldown 是部署间隔，recovery 是串行逐份恢复；间隔到期不凭空加库存。每段开始采样有效时长，RUNNING 保存到期点，PAUSED 保存余量，恢复 pending 包含当前份。

再部署时间贡献影响后续段。减时／清除／暂停／恢复明确选择 COOLDOWN 或 RECOVERY，只改当前段，超额减时不传给后段；直接充值库存不重置时钟，零周期可当前 Tick 完成。

## DP

DP 自然回复受周期和上限约束，满额期间不积累补发；付款和显式修改先接续已有回复事实。允许负值时，负 DP 仅使自然回复减半，主动回复不减半，跨零保留已有进度。

## 支持范围

完整特殊重部署及失败／继承／资源交接、手牌重排竞争、隐藏／锁定和特殊回收仍未完整实现；卫戍倒地、自动部署与经济政策由外部机制／Meta 组合。费用和再部署时间的全部多来源公式也尚未闭合，不能以现有 Attribute 形式推定原生一致。

机制依据见[部署与供给研究](../research/cases/24-deployment-cost-and-supply.md)，必要验收和未闭合范围分别集中于 [Verification](verification.md)与 [Tactical 语义](tactical-semantics.md)。
