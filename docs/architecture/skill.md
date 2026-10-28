# Skill 设计

Skill 负责 SP、发动、持续预算、主动操作和完整终止。Action 负责行为程序，Effect 负责附着影响及依赖清理；具体内容组合这些领域的公开接口。

领域 API 从 [unit/skill/index.ts](../../src/core/unit/skill/index.ts) 导入；能力守卫、初始化和局部登记从 [capability/skill/index.ts](../../src/core/unit/capability/skill/index.ts) 导入。两个入口按职责选择导出，不相互转发整套 API。

## 模块与入口

| 模块 | 职责 |
| --- | --- |
| `unit/skill/definition.ts` | 泛型 Definition、Capability 配置声明 Declaration 与 createDefinition |
| `unit/skill/activation.ts`、`instance.ts` | Activation、配对 Instance、局部 data 变换与内部完整写回 |
| `unit/skill/query.ts`、`operations.ts` | 当前 Activation 查询、发动、主动操作、时间推进、结束与 lifetime |
| `unit/skill/sp.ts`、`ammo.ts`、`sustain.ts`、`modifier.ts` | SP、Ammo、持续预算与领域数值规则 |
| `unit/skill/internal/read.ts` | 现有 Definition／私有状态的内部配对读取，不从公共入口导出 |
| `unit/capability/skill/capability.ts` | Skill、公共 State、结构守卫、initialize、validateState 与局部登记 |
| `unit/capability/skill/rule.ts`、`hook.ts` | 能力 Rule、Hook 类型与事件契约 |

领域 index 提供 Definition／createDefinition、Activation、查询及 SP／Ammo／激活业务，不转发能力守卫、Rule／Hook 登记和持续预算贡献 setter。Capability index 提供对应能力 API，不再聚合领域程序、资源结算或 Activation 业务。Core 的配对读取与完整写回继续按实际职责深导。

SP 的 setContribution／removeContribution 仍是 `unit/skill/sp.ts` 的局部资源操作，经领域入口以 setSpContribution／removeSpContribution 导出；它们与 SP State／Input 保持同一模块，不因目录分开增加 Capability 转发函数。内部 read 与 validateState 保留原有配对和校验算法。

## 1. Definition 与状态

`unit/skill/definition.ts` 的 `Definition<S, A>` 直接保存在 Unit Definition 中，由所有部署实例共享。Capability 使用同一模块的 Declaration 表达公共配置，不另建一套程序定义。

| 数据 | 职责 |
| --- | --- |
| `Definition.initialize()` | 创建本次 Unit 持有期间的私有状态 S |
| `Definition.sp` | 基础 SP 容量、门槛、数值支付量与回复来源；无 SP 时为 null |
| `Definition.activation` | 发动方式、持续政策、私有状态 A 的初始化及执行程序；不需要常规激活时为 null |
| `skill.data` | 跨多次激活保留的 S |
| `skill.active` | 当前 Activation，或 null |
| `skill.nextActivationId` | 本宿主单调分配的激活身份 |
| `skill.sustain` | 持久登记的持续预算贡献，每次发动时采样 |

一个 Unit 至多持有一个 Skill，一个 Skill 同时至多有一个 Activation。私有状态在 Unit 生命周期内保留，不隐含跨部署保存。

`Skill` Capability 与公共 `State` 均不携带内容泛型，宿主身份始终为 `Ref<Unit & Skill>`。Catalog 仍调用 `unit/capability/skill` 的 initialize(battle, definition)，只返回公共 State，不另设 Stored Capability，也不通过直接初始化恢复私有类型。SP、Rule、Hook、Contribution 只依赖这个公共能力。

内容程序的 `Definition<S, A>` 保留持久状态 S 与激活状态 A。Definition 的回调接收配对的 `Instance<S, A>`：`host` 定位宿主，`definition` 保存具体程序，`state` 保存同一程序的私有数据和当前激活。需要配对 Instance 的流程仍通过 `internal/read` 恢复这组关联；调用者不能自行选择 S／A 宣称宿主类型。领域内部需要恢复持久 S 时，通过 instance.ts 的 get(battle, host, definition) 按当前配置 Definition 的对象身份确认配对；get、setData 和配对写回协议不从公共入口导出。跨领域回调后继续执行时，仍须从当前 battle 重新读取。

`Activation<A>` 保存 `host: Ref<Unit & Skill>`、id、startedAtTick、ACTIVE／ENDING、Sustain 和 data。私有类型 A 的证明来自具体 Definition 的内容回调，通过公共 `ref(self)` 保留；也可以向 `get(battle, ref, definition)` 传入具体 Definition，由运行时对象身份比对确认当前配置程序后恢复 A。仅凭普通宿主 Ref 调用 `activate` 返回公共 Activation，不能指定或推导私有类型。typed Activation Ref 不意味着宿主私有状态 S 可被恢复，过期激活身份不能读取、消费或结束新激活。

完整宿主写回与激活写回归 unit/skill/instance.ts 的 replaceHost／replaceActivation，与配对 Instance 的 replace 一同供 Core 内部使用，不从 index 导出。replaceActivation 仍由 typed Ref 确定私有 A，待写回值使用 NoInfer，不能通过替换数据反向扩大类型；生命周期变化仍由完整业务操作负责。

instance.setData(self, data) 与 activation.setData(self, data) 只接收已经计算好的私有数据，分别返回更新 S 的 Instance 与更新 A 的 Activation；数据引用未变时返回原对象。两者是局部值操作，不读取或提交 BattleState。activation.setData 以 setActivationData 从公共入口导出；完整实例提交仍由 Core 内部的 replace／replaceActivation 负责。调用方计算结果值前按所需版本取得当前对象，跨完整操作后先接续 battle 并重读，局部 setter 不隐式恢复最新状态。

## 2. SP

SP Definition 保存 initial、capacity、requirement、可选数值 cost 和 Recovery。cost 未指定时以有效 requirement 为基础，再结算 cost 贡献。特殊发动可在同一输入版本中查询本次 cost 并初始化形态数据。

SP 容量、门槛与支付贡献使用 Skill 自己的 Modifier：`{ priority, apply(battle, self, current) => number }`。先由 Contribution 选择互斥胜者，再按程序 priority 升序执行，同优先级沿候选 ID 顺序；这是显式数值变换，不是 Attribute 四段叠加。两项回复属性继续使用 attribute.Modifier，setContribution 的 key 决定并约束对应载荷。

实际需求包括：琳琅诗怀雅的金币容量覆写、玛露西尔的容量／最低门槛／逐次支付分离，以及 Fever 期间门槛与支付的变化。这些干员的完整内容接入仍需逐项完成。容量变化时的额外 SP 清空等行为由明确资源操作完成，不在纯查询中偷偷结算。

Recovery 为 TIME、ACTION、HIT 或 NONE。EXTERNAL 是资源操作的来源，普通 Action 的启动、推进和结束不会自动授予 SP。具体普通行动在成功释放点调用 Action.released，Skill.enter 登记相应监听并调用自己的 recover；被拦截或取消的释放不产生通知。

| 操作 | 契约 |
| --- | --- |
| `recover(battle, host, source, amount?)` | 检查来源及回复 Rule，按容量结算；TIME／ACTION／HIT 使用相应定义 |
| `pay(battle, host, amount?)` | 足额支付或失败，不要求 Activation，也不受回复 Rule 否决 |
| `modify(battle, host, delta, forced?)` | 直接修改；普通正增量仍检查 EXTERNAL 回复许可，负增量不因阻回被拦截；force 只绕过规定的回复限制 |

三种操作从当前 battle 读取宿主，要求宿主在场且具有 Vitality 时 HP 大于零。无 Vitality 的 Skill 宿主仍可使用资源操作。

自然回复速度和回复倍率各自结算贡献，再相乘。计时状态保存周期、余时与 lastTick：

- 阻回和满槽暂停并保留余时，不积累暂停期间的回复。
- 宿主 HP 为零但仍在场时同样暂停计时；lastTick 随推进更新，同一身份恢复生命后不追补暂停期间的 SP。没有 Vitality 的宿主照常推进。
- 速度变化保留绝对已过时长，不保留周期完成比例。
- 速度变为零使计时无效，恢复正速度后从完整周期开始。
- 多 Tick 推进达到满槽后即暂停余下时间。

默认激活期间阻回由 `@skill/active-recovery` Rule 表达，可通过公开局部操作移除；SP 操作没有“active 必然禁止回复或支付”的硬编码。

## 3. Sustain 与弹药

TIME 实例仅保存 endsAtTick。AMMO 保存 initial、remaining、replenished；INFINITE 由内容调用完整结束操作。

持续时间与初始弹药贡献在发动、支付 SP 之前采样。之后的贡献变化影响后续发动；本次时长可通过 extendTime 明确调整。

持续时间、耗弹量及贡献输入在实际入口校验。内部预算、到期 Tick、剩余弹药与激活身份按游戏尺度直接计算，不重复检查算术结果是否超过安全整数范围。

TIME 的 setDurationContribution 使用 Skill 领域 Modifier，可在发动输入版本中读取 SP 决定预算。雷狼龙S空爆按消耗充能延长持续时间，既可在此采样预算，也可由启动程序按原生流程消费并延时；该案例不证明通用属性叠加。哈蒂娅的运行中条件延长由 extendTime 表达。

AMMO 的 setAmmoContribution 使用 ammo.Modifier `{ addition, ratio }`，归并公式为 `max(1, base + Σaddition + RoundToEven(base × Σratio))`。固定追加不参与比例乘算。TIME 与 AMMO 使用各自的贡献载荷和 setter。

弹药消费按完整指定数额结算，允许负余量。`consume` 不自动结束，`check` 独立检查最新同一 Activation 的余量并结束。具体行动决定调用耗尽检查的业务节点。

普通攻击程序只保存自身执行状态与泛型内容 data，不读取 Skill。弹药行动的内容组合器在每次行动启动时采样 Activation Ref，在 afterOutput 调用该激活的 consume／check；旧行动不能消费后来激活的弹药。输出完成后仅隐藏宿主不撤销已产生的消费责任，宿主实际离场则由完整清理取消行动。

普通 `replenish` 同时受本次容量与累计补弹额度限制；`grant` 表达内容自身增加弹药，不占用普通补弹额度，但仍受本次容量限制。结束时丢弃剩余弹药不算消费。

`ammoReplenished` 只通知实际补入量大于零的普通补弹，报告同时保存 requested、实际 amount 及本次前后快照。容量和累计额度裁剪不会覆盖请求数量，嵌套补弹不会改写外层报告。grant 不派发普通补弹 Hook。自身增加弹药的独立通知仍需由具体观察需求确定。

AMMO 描述资源和耗尽结束政策，不代表所有“弹药类技能”加成的资格。图耶式内容可以复用消费、偷弹、补弹及其通知，再由具体加成判断资格；不因客户端内部持续类型不同而新增项目中无外部差异的状态机。TIME／INFINITE 与独立弹药同时存在的模型，仍需具体玩法需求证明，不能仅从图耶案例推出。

## 4. Rule、程序与 Hook

Operation（STOP／RETRIGGER）归领域 activation.ts，由 unit/skill/index.ts 导出；Capability 的 rule.ts 只引用该类型。Rule 只有 allowsActivation、allowsOperation、allowsRecovery。它们提供额外业务许可；内部完成、到期结束及宿主离场清理不受主动操作 Rule 否决。

Definition 的 onEnter／onTick 与 Activation Definition 的 initialize／accepts／cost 接收 battle 与配对的 Instance。Activation 的 onStart／onTick／onOperation／onEnd 接收 battle 与当前 Activation 实例；initialize 仅构造数据。STOP 与 RETRIGGER 交给内容程序处理，STOP 请求不预设一定立即结束；未提供自定义操作程序时，STOP 默认正常结束。

| Hook | 事实 |
| --- | --- |
| spRecovered | 实际回复 SP |
| spPaid | 成功支付 SP |
| spModified | 直接修改 SP |
| ammoConsumed | 指定弹药消费已经结算 |
| ammoReplenished | 普通补弹已经结算 |
| activated | 本次 Activation 已成功创建 |
| ended | 本次 Activation 完整结束 |

Hook 使用公共 Hook<Context<E>, void>；Context 固定 host 与本次 event，accepts 只读，invoke 返回 Result<void>。每次派发固定候选 ID，逐项读取最新登记；Activation 结束或被替换后，后续观察者仍收到原始事件，当前状态另从最新 battle 查询。

不提供通用 changed、阈值注册表或充能状态机。资源事件携带本次结算前后事实；阈值观察者订阅相关业务 Hook。每次派发独立固定候选 ID，逐项按 ID 读取最新登记并执行最新 accepts／invoke；同 ID 替换在本轮使用新版本，新 ID 等待下次派发，嵌套报告不会重写外层事实。

HIT 回复由 Skill.enter 在 Damage 的 receivingStarted 扩展点登记，发生在接收准入后、Receiving Hook 和 HP 扣减前。Skill 自行监听受击事实并执行回复，Damage 与 Vitality 不依赖 Skill。

## 5. 发动与完整结束

发动先检查当前宿主、触发方式、许可、门槛与足额支付，采样数据与持续预算，再一次性写入扣费和新 Activation。随后依次记录 SKILL_ACTIVATED、派发 activated、通知 spPaid，再执行仍有资格的 onStart。支付 Hook 可以终止已创建的激活；后续启动程序必须重读同一身份、ACTIVE 状态和宿主当前资格，创建事实不会被撤销，支付报告保留已提交时的前后值。

activated 表达实例已经创建，不承诺 onStart 效果已经安装。它的派发先于可能终止激活的支付与启动程序。没有活动 Lifetime 结算时，前一个 activated Hook 的结束操作可以在后续 activated 候选前完成 ended；已有结算时，嵌套结束只同步执行请求／Prepare，ended 等待 Finalize。后续候选始终处理原创建事实，不因终止重写报告。

Skill 的公共 lifetime 描述符绑定本轮 Activation，Effect 使用 scope(skillLifetime, activationRef) 建立依赖。请求先登记 Pending 并发布 ENDING，再展开依赖；最外层结算器等待依赖者完整完成后进入 Finalize。Finalize 直接从所有权保护的当前 Unit 取得配对 Definition 与 Activation，线性执行 onEnd、重读宿主、清空本轮、事件与 ended，不经过 read 包装；其他 Skill 流程暂保留内部 read。整个 Finalize 返回后才解除 owner 等待，Unit 在此期间保留原 Definition 与当前状态，不需要通用历史回退。

ENDING 期间继续占用 Skill。嵌套 finish／cancel 首次请求返回只保证 Prepare，不保证本轮已清空或 ended 已派发；需要下一次激活的业务放在槽位释放后的 ended 时点，已有结算范围中不能强行 drain。重复 PREPARING 请求也不等待原 Prepare。

Unit 退场通过派生所有权关系自动请求 Skill、Action、Burst 与 Effects；Skill 请求先于 Action，兄弟可以都先进入 ENDING。首次原因不会被后续完成／取消覆盖；Unit Finalize 晚于这些子项的整个 Finalize。结束内容跨完整操作后仍按需要读取当前宿主与实例。

## 6. 待完成的机制覆盖

跨部署魔力的持久载体、Fever 的持续暂停／恢复、特殊异常状态发动许可与不同弹药类加成资格，仍需按[代表技能覆盖审查](../research/cases/09-skill-mechanisms-and-requirements.md#7-当前目标设计的代表技能覆盖性)逐项接入。

TIME／INFINITE 与独立弹药同时存在的模型、grant 的独立增加通知，须结合具体玩法和观察需求确定；现有 AMMO 生命周期不自动代表全部弹药类加成资格。
