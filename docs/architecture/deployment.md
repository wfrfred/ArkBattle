# Deployment、Card 与 Unit 生命周期

Deployment 完成一次部署的资格判断、资源消费、实例创建和通知。Card 保存跨部署的状态；Deployable 保存本次场上实例的部署事实；Unit 与 Lifetime 负责登记、登场和完整离场。普通创建、Unit 登场和部署是三个不同操作，不能由阵营、Card 关联或一次 add 自动推断部署。

范围是主模式作战规则与卫戍协议的接入能力，不包含保全派驻和生息演算的区域流转。执行约定见 [函数式内核](functional-core.md)，创建与修改约定见 [Capability](capability.md)。

## 状态归属

| 事实 | 所属领域 |
| --- | --- |
| 本次实例的身份、真实位置、PRESENT／LEAVING | Unit |
| 地块、空间索引和实际占位 | Battlefield／Occupancy |
| 当前 DP、下限、上限、自然回复进度 | Deployment |
| Card 身份、私有 state、库存、计时与费用修正 | Card |
| 本次 COST、额度、返费条件、手动撤退资格、来源 Card | Deployable |
| 共有一次性机会、来源关系、倒地位置、自动部署条件 | 对应 Effect、Skill 或 Mechanism |

Definition ID 标识内容，Card ID 标识本场持续存在的可部署记录，Unit ID 标识本次场上实例。Card.definition 直接引用原 Unit Definition，不另建 Card 内容定义或包一层 definition.unit。每次部署重新初始化 Unit；需要跨部署保留的资源放入 Card.state，由具体 enter／leave 程序显式转换，不保存旧 Unit 作为下次初态。

库存、库存上限、同 Card 在场上限、全场部署额度与地块占位分别表达。activeCount 和 usedSlots 从 Battlefield 中的实例事实查询，不保存第二份在场列表或计数。**本项目在 Unit 物理注销时释放在场数量和额度**，所以 LEAVING 仍占用它们；这是项目结算约定，不由 Lifetime 的存储要求推定为已证实的原生退出时点。

Card 直接保存 stock、stockLimit 与 activeLimit。stock 始终为非负整数，表示当前可用份数；stockLimit 与 activeLimit 可为 null，分别只表示不设持有上限或同 Card 在场上限，stock 仍保留实际计数。

创建 Card 时必须明确提供数量和部署程序，addCard 的 Initial 与 Battle Input 中每条 Card 配置均要求 stock、stockLimit、activeLimit、program：

```typescript
addCard(battle, definition, {
    stock: 1,
    stockLimit: 1,
    activeLimit: 1,
    program: operator,
});
```

初始份数来自本场带入配置，不是 Unit Definition 的固有限制。每份普通干员分别建立 Card；即使引用相同 Definition，库存、计时、费用阶段和私有状态仍各自独立。堆叠召唤物则由同一 Card 的多份库存表达，不能将多份普通干员合并成一条恢复队列。

## 一次部署的程序

[battle/deployment/program.ts](../../src/core/battle/deployment/program.ts) 定义静态程序：

```typescript
interface Program<I> {
    readonly id: string;
    readonly prepare: (battle: BattleState, input: I) => Preparation | Rejected;
}
```

prepare 只读当前事实，可以拒绝，或准备本次的地块要求、COST、额度、返费条件、支付、消费程序与实例创建程序。它不扣资源、不分配身份、不安装 Effect，也不消耗共享机会。准备结果只在完整 deploy 内接续使用；preview 只返回资格、费用与支付事实，不向外暴露可延后提交的计划。

普通程序可在本地推进目标 Card 的纯计时值，并以纯替换形成只读工作 Battle，让自身与 Rule 查询同一版本；这不发布到调用方，也不执行 Card.onTick。拒绝仍返回原 Battle；成功时在 consume 阶段接续已准备的计时事实与实际消费。

Preparation 的 initialize 和 consume 闭包在已知类型的位置保存 Definition、Typed Ref 与采样值，因此不需要再建立 Deployment Execution、Activation 或通用私有上下文。Core 执行准备好的程序，不解释内容的私有数据。参数和准备结果必须遵守领域契约，程序异常直接传播，不转换为普通业务拒绝，也不增加回滚或重试框架。

两个公共调用对应不同来源：

```typescript
deploy(battle, { card, tilePosition, direction });
deploy(battle, input, program);
```

第一种读取 Card.program；第二种由具体内容或 Mechanism 显式提供本次程序。标准程序位于 [normal.ts](../../src/core/battle/deployment/normal.ts)：

| 程序 | 成功部署 | 实例离场 |
| --- | --- | --- |
| operator | 消耗一个库存 | 登记一个库存恢复份数；普通撤退／死亡另递增费用阶段 |
| consumable | 消耗一个库存并启动使用冷却 | 不自动归还库存 |
| queued | 消耗一个库存 | 登记一个串行恢复份数；仍有库存时允许继续部署 |

这些是明确组合资源操作的程序，不是 Card 内部 switch 的生命周期策略。Content 可以通过 createProgram 组合其它已确认的供给行为，或直接提供特殊 Program；消费、计时和离场归还由程序明确组合，不由库存值选择另一种生命周期行为。没有离场业务的 consumable 不登记空的 leave Hook。Card 存在或实例关联 Card，不意味着离场必须补回一个库存。离场是否归还与允许手动撤退分别表达，归还程序可以按实际结束原因决定是否执行。

标准程序统一检查 Card、可用库存、部署间隔 cooldown、同卡在场数和 Card Rule；recovery 存在本身不禁止部署，只要仍有可用库存且其它资格满足，就可继续部署。完整 deploy 再统一检查全场额度、DP 支付范围、当前地块与占位。拒绝不消费 DP、库存、共享机会或 Unit ID；特殊程序自己选择是否消费库存及采用哪种冷却，不通过 force／free／ignore 标志组合授权。

## 支付、属性与完整执行

本次场上 COST、实际支付和返费条件彼此独立：

- payment 为 `{ amount: 0 }` 表示发生了正常零费支付；null 表示没有支付流程。
- cost 保存本次实例的费用属性，后续 Card 改价不改写它。
- refund 为 null 表示不返费，否则保存本次 rate 和 limit；免费投递可以保留正常 COST 与返费资格。
- slots 保存本次额度占用，可与同内容的其它创建方式不同。

完整执行顺序为：

```text
Program.prepare（只读）
→ 公共资格检查
→ 接纳本次固定参数并支付 DP
→ consume：库存、共享机会及其它来源消费
→ initialize：分配身份，完成本次 Unit 构造
→ 写入本次 Deployable 事实，记录 UNIT_DEPLOYED
→ Unit.add：登记、普通 enter Hook、registrationChanged
→ 派发 deployedHooks
```

消费先于构造和 enter，入场程序嵌套部署时能读到已消费的机会。接纳后不再重新报价、选择优惠或决定已固定的程序。consume 仍通过正常领域操作接续 BattleState，不额外承诺内容回调之间的隔离。enter 中立即死亡仍是一次已经发生的成功部署，结果和通知保存该历史事实，不保证返回时新 Unit 仍存在。

手动 Command 只携带 cardId、地块和可选方向，在边界恢复 Card Ref；不接受临时的任意 Unit Definition。手动撤退使用 `retreat(battle, Ref<Unit & Deployable>)`，检查 PRESENT、retreatAllowed 和当前 retreatRules。内容强退使用明确的 Unit 离场操作；控制者身份与网络授权由外层处理，不混入撤退 Rule。

## 本次方向与创建输入

本轮的四向摆放朝向归 [Occupancy](../../src/core/unit/capability/occupancy/index.ts)：Definition.occupancy.direction 可选，State.occupancy.direction 为 Direction 或 null。没有朝向的装置使用 null，不伪造 RIGHT；基础 Unit 没有方向字段。这是当前固定地块摆放需求的领域归属，不将所有未来朝向与占格宣称为数学等价。

Unit.initialize 与直接 Placement 创建的 initial 按已声明能力约束输入。Occupancy 接收可选 tile 和 direction；省略方向时使用 Definition 初态或 null，本次部署输入可以明确覆盖。能力的 initializer 在 fold 中处理自己的输入，通用 Unit 不判断具体能力。initial 不是 Partial<Unit>，不能导入任意 Skill、Vitality、Effect 等运行状态。Content 的 directionalRange 读取当前 occupancy.direction，非 null 时旋转相对范围；静态 range 仍接收已确定的几何范围。

需要保存到 Battle.Input 或排程中的异构创建描述通过 createUnitPlacementDefinition 建立输入配对，UnitPlacementDefinition 的初始输入只暴露类型层的已配对标记，默认不含 any。直接 instantiate 仍能按具体 Definition 接收类型化初态。这里没有新的运行实例、容器、View 或二次运行时校验；实际字段仍由原 initializer 处理。

Placement.hooks 是调用方明确提前登记的普通 Hook。装配顺序为初始 hooks、各 Capability 的登记、Definition.hooks；同 ID 后者替换前者并保留首次登记的位置。没有 CardEnter 阶段或按来源种类自动排序的优先级。具体内容可以据业务选择登记位置，不把这种项目装配顺序称为所有原生外来效果的统一顺序。

## 入场附着与共享机会

Card.hooks 保存未来实例要携带的普通 Unit Hook。新实例通过已有 enter Hook 调用 effects.install，创建真实 Effect，照常执行安装、生效与 Lifetime 登记。松桐生命增益、银灰屏障和延迟攻击均按这种职责组合，不设置独立 Attachment 容器、登记协议或生命周期，也不预装 Effects。

授予时采样的数据可由程序闭包保存；需要输出时实时读取的数据在对应 Effect 的执行点查询。Hook 的移除由实际内容决定：下次部署消耗、下次离场失效、来源离场失效并不相同。已接纳部署保存本次程序，即使 consume 随后撤销 Card 上的下次机会，也不撤销本次已经接受的安装程序。

多个 Card 共享一次优惠时，剩余机会保存在实际来源的 Effect／Skill／Mechanism.state。报价与成功消费引用同一来源；不能给每张 Card 复制一份次数，也不为了共享来源把优惠、屏障和定时攻击强行做成一种生命周期。

Card.rules 使用 DISPLAY、SELECT、DEPLOY 区分显示、选择和部署资格，统一执行 `allows(battle, context)`。`cards.allows(battle, context)` 在 DISPLAY／SELECT 时接收 `{ purpose, ref }`，在 DEPLOY 时接收 `{ purpose: "DEPLOY", request }`，部署规则读取真实请求的落点和方向。RuleContext 的泛型保留已知 Card Ref，普通规则仍只依赖公开状态；实际计时、库存和临时资格各自查询，不新增重复的 enabled 状态。Rule 不执行状态变更。

Unit Definition 的 deployable.card 必填。没有自定义私有状态或时间程序时明确写 `card: {}`；Deployable.createDefinition 在构造入口补上空状态初始化器，归一后的 Card Definition 始终具有 initialize，无 onTick 时不登记空回调。

[card/definition.ts](../../src/core/battle/deployment/card/definition.ts) 的 Definition<S> 描述 initialize／onTick，负责创建和推进跨部署私有 state；Deployment.Program<I>.prepare 负责准备一次部署。Card.definition 仍引用原 Unit Definition，其 UnitDefinition<S> 类型别名保留与 Card 私有状态的配对，不增加第二份内容对象。

空配置产生默认 object 状态；提供 initialize 时从返回值推断具体 S，构造入口不把 `{}` 断言成任意 S。addCard 和匹配已知 Unit Definition 的 get 使用同一套泛型契约，不区分有状态／无状态的 Definition。普通查询仍使用默认 object，Typed Ref 或匹配 Unit Definition 的查询恢复具体 S；异构存储的类型擦除不向 Content 暴露 any。

## 待部署区顺序

Deployment.order 独立保存 Card Ref 的业务顺序，cards 保持身份存储；ordered 查询前者，Card.all 枚举后者。重排不改变 Card ID、私有状态或同卡在场关联。

当前只保存一个纯 Ordering 程序，输入当前 BattleState 与顺序，返回同一集合的新排列。setOrdering 替换这个唯一程序，refreshOrder 重新求值；新增 Card 先追加到序列，再按现有程序整理，Card 写回同样更新顺序。依赖其它 Battle 事实的重排由来源在所需时点显式 refresh，不跟踪纯程序的任意读取依赖。程序由内容负责给出合法排列，不在内部反复校验自己已经构造的 Ref。

setOrdering(null) 停止自动重排并保留现有顺序，不自动恢复所谓原始顺序。多来源重排的竞争、来源退出后的恢复及真实初始／中途插入排序仍待具体内容取证；单程序接口不宣称这些机制已经实现，也不预设 priority 或隐式恢复栈。

## 冷却与库存恢复

Card 将部署间隔 cooldown 与库存恢复 recovery 分开。部署间隔结束只解除本段间隔，不补库存；库存恢复保存 pending 份数和一条 clock，每段结束补回一份，再决定是否启动下一段。普通干员的库存循环为 1 → 部署消费至 0 → 实例离场后启动恢复 → 到期回到 1；期间 Card 身份、费用阶段和私有状态保持。每份干员使用自己 Card 的恢复时钟，不复制一份相同的 cooldown。

Clock 保存启动时的 durationTicks；RUNNING 保存 readyAtTick，PAUSED 保存 remainingTicks。setRedeployTimeContribution 只影响后续周期。恢复下一段时读取 Card 当时已有的有效时长，不为每份入队保存预算，也不永久复用整条队列首次启动的预算。

enqueueRecovery 的公共约定是追加份数并保留已存在的当前段；没有当前段时才启动。每次有效回收都保留份数，不会被后一次归队覆盖。原生 OnRecycle 某些状态切换可能 Reset 的具体来源路径尚未闭合，本项目不把这些未确认路径偷偷加入通用追加操作；有实际内容要求时，由来源显式重置对应周期。

reduceCooldown／clearCooldown／pauseCooldown／resumeCooldown 必须明确指定 COOLDOWN 或 RECOVERY，不提供默认目标，不自动选择非空时钟，也不同时修改两者。普通干员的再部署时间操作作用于 RECOVERY；部署间隔操作作用于 COOLDOWN。减时只操作当前段，不把多余缩短量传给后续段。recharge 直接增加可用库存，不重置计时器。暂停保存剩余时间；暂停期间减时和清零只修改该剩余值，恢复时再继续并结算到期。零时长周期可以在当前 Tick 完成。这些是当前公共操作的明确项目契约，不能据此声称黑棺、莲座等所有来源组合均已核实。

Deployment 在阶段入口固定 Card 候选，逐项读取当前 Card，先发布到期结果再调用可选私有 onTick；新 Card 下次参与，回调后不回填旧整份对象。

## DP 与费用计算

Deployment 保存 dp、minDp、自然回复进度和最近推进 Tick。maxDp、dpRecoveryTicks、slotLimit 属于配置；minDp 默认 0，可由显式操作调整。费用支付允许降至当前下限，主动 recover／modify 与自然回复分别处理。

自然回复逐次采样推进开始时的当前 DP。负数时，本次时间推进量乘 0.5；回到 0 后下一次正常推进，保留已有进度。主动加费不减半。达到最大 DP 时清空自然回复进度，之后再次消费从新的时点继续；没有自然回复时不运行计时。一次推进内产生多个回复点时不在循环跨零处额外拆分。

costCeiling 是独立费用上限，默认 99，与 maxDp 分开配置，不假定两者动态同步。普通费用先计算再部署阶段后的 rawCost 并向下取整，再按运行修正乘算、向下取整、加最终增量，最后限制到 `[0, costCeiling]`。普通费用阶段最多两层，每层 0.5；COST 和实付数值仍由本次程序分别决定。

当前 costContributions 保留既有项目组合：基础 addition 求和；运行倍率采用 `(1 + Σmultiplier) × ΠfinalScaler`；finalAddition 求和。明确的分阶段取整与独立上限已有原生依据，**这些多来源字段的归并不因此自动获得原生证明**。完整来源写入、倍率上限偏移及同步规则仍有调查缺口；本轮不扩展一套新的通用价格修正系统。

## 生命周期与 Hook 接口

### Unit：生命周期 Hook

Unit 只保存 PRESENT／LEAVING，登场前和注销后通过集合中不存在表达。Unit Definition.hooks 必填；实例 hooks 保存构造期合并的初始登记、能力登记与内容登记，运行期间不提供本地生命周期 Hook 的增删接口，原 Definition 保持不变。Skill 自行登记普通 enter Hook，Deployable 自行登记退款 prepare Hook；来源程序需要离场回收时自行提供普通 leave Hook。Unit 不枚举这些领域。

enter 在 Unit 登记后执行。tick 固定阶段入口 Unit 候选，逐项读取当前 PRESENT 实例。本地生命周期直接按该阶段的固定 Hook 对象序列执行，不转换成 ID 后再查找；Context 保持固定，accepts 使用逐项接续的最新 BattleState。enter／tick 每项前确认宿主仍为 PRESENT，离场后停止后续项。需要实时属性时重新查询，不将开始执行时的 Unit Context 当作可变对象。

prepare 在发布 LEAVING 后、请求子依赖前执行。Departure 保存开始离场时的 Unit 与 reason，保留 Skill／Effect 清理前的数据；当前退款仍从最新 Unit 读取。leave 在子依赖完整析构、Unit 物理注销和登记变化通知之后执行，使用 Departure，不再查询已删除的宿主。跨部署资源在这些普通程序中转换，不由通用初始化器继承。

### Deployable：对实际部署的观察

Deployed 保存本次 Unit、program 标识、origin 与 Payment。origin 只区分 MANUAL／CONTENT 的调用来源，不选择一组隐含消费权限；具体程序标识表达业务来源。正常零费支付和没有支付在通知中仍然可区分。

通知在 add 返回后固定观察者候选，按 Unit 顺序和各自登记顺序执行；每项重查当前 PRESENT 观察者及登记。输入的 Unit 是本次部署事实，回调需要当前状态时另查。新登记 Hook 不补进本次派发，入场后已删除的 Unit 不影响历史部署事实。普通敌人创建不自动广播部署。

### 离场清理的偏序

```text
请求 Unit 结束并保存 Departure
→ 发布 LEAVING
→ prepare（Blocking 清理、退款、内容）
→ 按关系登记顺序请求直接依赖者
→ 所有依赖者完整 Finalize，包括末尾通知
→ Unit 注销、记录移除事实
→ registrationChanged
→ 本地 leave（来源回收、内容转换等普通程序）
→ 全局 leave（Mechanism 等观察者）
```

Blocker／Blockable 将必要的 Blocking 清理 prepare 放在序列前部；其余程序遵守实际登记顺序。真实依赖先于 owner 完整析构，无依赖兄弟按边的登记顺序处理，不设置能力种类优先级。Pending 保留到整个 Finalize 返回，不能由实例已从容器删除推断末尾业务已经结束。详细状态机与依赖登记见 [Lifetime](lifetime.md)。

嵌套 remove 同步标记和 Prepare，但不保证已注销、释放占位或回收 Card；无外层结算时由本次 drain 完成后返回。Effect.onEnd 请求宿主离场时，宿主等待该 Effect 完整结束。ENDING／Pending 的上游不再接受新依赖；清理字段通过正常领域操作写入，异常直接传播。成功复活不等于真实离场，不执行 leave。

Unit 只派发通用节点。Runtime 为 Occupancy 登记 registrationChanged 观察；Mechanism 自行登记和撤销全局 leave 观察。Unit 不点名 Blocking、Deployment、Action、Skill、Effect 或模式内容，也不扫描能力重建 Lifetime 投影。

## 卫戍协议与剩余范围

卫戍的初始免费部署、倒地位置、隐藏待部署区、自动再部署和回合间经济由外部 Mechanism／Meta 组合领域操作。普通干员初始免费部署保留该份 Card 的正常库存消费，支付流程与库存消费独立；预放召唤物按已确认的机制通过特殊 Program 选择不消费库存。是否补数由该次来源的离场程序决定，不能因关联 Card 自动归还。特殊 Program 仍经过公共地块、占位和额度检查；Core 不按模式名称分支。

该接入边界不代表卫戍内容链已经完成。仍需按实际内容闭合：来源 Card 在宿主结束时的保留／隐藏／重建、多来源排序竞争、特定归队 Reset、暂停来源组合、术语移动的退出与继承政策，以及各内容的具体入场时序。费用来源的完整归并与退出资格的精确原生阶段也保留证据缺口。未知项不阻止已明确的通用操作，但不能由接口或测试存在推定相应玩法已接入。
