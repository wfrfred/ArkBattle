# Skill 设计

Skill 负责 SP、发动、持续预算、主动操作和完整终止。Action 负责行为程序，Effect 负责附着影响及依赖清理；具体内容组合这些领域的公开接口。

领域 API 从 [unit/skill/index.ts](../../src/core/unit/skill/index.ts) 导入；能力守卫、初始化和局部登记从 [capability/skill/index.ts](../../src/core/unit/capability/skill/index.ts) 导入。两个入口按职责选择导出，不相互转发整套 API。

## 模块与入口

| 模块 | 职责 |
| --- | --- |
| `unit/skill/definition.ts` | 完整泛型 Definition |
| `unit/skill/skill.ts`、`activation.ts` | 单槽聚合 Skill、同一聚合的非空 Activation 视图与两种 Ref |
| `unit/skill/initialize.ts` | create 接续 Definition.initialize，创建聚合初态 |
| `unit/skill/query.ts`、`operations.ts` | 查询、字段写回、发动、主动操作、推进、结束与 lifetime |
| `unit/skill/sp.ts`、`ammo.ts`、`sustain.ts`、`modifier.ts` | SP、Ammo、持续预算与领域数值规则 |
| `unit/capability/skill/capability.ts` | 初始化工厂 Definition、Skill Capability、公共 State、结构守卫与局部登记 |
| `unit/capability/skill/rule.ts`、`hook.ts` | 能力 Rule、Hook 类型与事件契约 |

领域 index 提供 create、Skill／Activation、ref／activationRef、getSkill／getActivation、字段写回及 SP／Ammo／激活业务，不转发能力守卫、Rule／Hook 登记和持续预算贡献 setter。Capability index 提供对应能力 API。内部 getCurrent 在受信边界取得已擦除参数的完整聚合，不解释私有 data；不公开内部写回，不使用泛型 reader。

SP 的 setContribution／removeContribution 仍在 sp.ts，经领域入口以 setSpContribution／removeSpContribution 导出；它们与 SP State／Input 保持同一模块，不增加 Capability 转发函数。

## 1. 单槽聚合、Definition 与两种身份

每个 Unit 的 unit.skill 直接保存一份 Skill 聚合，至多有一个当前 Activation，不使用集合或额外 Instance 包装：

| 数据 | 职责 |
| --- | --- |
| self.definition | 完整 Skill Definition，与该聚合的 S／A 配对 |
| self.data | 跨多次激活保留的私有 S |
| self.sp | 当前 SP 或 null |
| self.activation | 本轮 id、startedAtTick、status、Sustain、私有 data: A，或 null |
| Capability.nextActivationId | 宿主内单调分配的轮次身份 |
| Capability.sustain／rules／Hook | 持久登记的预算贡献、许可和通知 |

Skill<S, A> 允许 activation 为 null；Activation<S, A> 是同一个聚合的非空运行视图，self.activation 确定存在。两者都通过 self.data 读取持久 S，本轮数据读取 self.activation.data。两个泛型均默认 object，只关心本轮 A 时使用 Activation<object, A>；具体私有类型由已知 Definition 或精确 Ref 保持。

聚合不保存 host，内容程序显式接收 source。Capability State 扩展默认 Skill<object, object>，直接包含完整 Definition、data、SP 与可空 activation；object 不承诺某种具体私有形状。Activation 是同一完整聚合按本轮身份读取的非空细化，不增加元数据类型、对象复制或执行容器。

Definition<S, A> 直接保存 id、SP 配置、初始化与完整内容程序。Skill 程序与元数据从 unit.skill.definition 取得，Unit Definition.skill 只保存初始化工厂：

```typescript
skill: {
    initialize: (battle) => skills.create(battle, programDefinition),
}
```

Definition.initialize(battle) 返回 Result<S>；create 接续其 state，建立 definition、data、初始 SP 和 activation: null，返回 Result<Skill<S, A>>。静态身份、SP 与持续预算配置在 create(battle, definition) 入口校验，校验通过后才调用私有初始化程序，sp.initialize 只建立初态，信任已校验的 Definition 和当前战斗 Tick。Capability.initialize 接续工厂结果，并补 nextActivationId、贡献、规则与 Hook 初态。Capability 工厂以 Result<Skill<any, any>> 接纳不同私有 S／A 的完整创建结果，公共 State 继承的 Skill 默认参数仍是 object；该创建组合边界不增加运行时形状校验。共享程序不保存私有运行进度，Unit 尚未登记时不能查询自己或假设兄弟能力已经存在。

### 引用、查询与写回

| 引用 | 构造与用途 |
| --- | --- |
| 持久 Skill Ref | ref(source, definition)，地址为 host＋Definition；getSkill、activate、setData 使用它，跨多轮有效 |
| 本轮 Activation Ref | activationRef(source, self)，地址为 host＋self.activation.id；getActivation、finish、cancel、operate、extendTime、setActivationData 与 SKILL Scope 使用它 |

getSkill(battle, skillRef) 确认当前聚合的 Definition 对象身份，恢复 S／A；getActivation(battle, roundRef) 确认本轮 ID，返回同一聚合的非空视图。activate 返回的本轮 Ref 保留原 Definition 的 S／A。普通查询返回默认 object 的完整实体，精确 Ref 保留已有 S／A；获取 Ref 的泛型上界使用 any 以接纳不同私有类型，结果保持原 T，不把默认参数改为 any。过期 Ref 不读取或操作后来一轮，生命周期资格仍从当前 battle 检查。

字段级写回只接受结果值：

```typescript
setData<T extends Skill<any, any>>(
    battle: BattleState, ref: Ref<T>, data: NoInfer<T["data"]>,
): BattleState;

setActivationData<T extends Activation<any, any>>(
    battle: BattleState, ref: Ref<T>, data: NoInfer<T["activation"]["data"]>,
): BattleState;
```

setData 只更新当前 Skill 的 data，setActivationData 只更新当前本轮 activation.data，保留 Definition、SP、Sustain、规则、Hook、槽位和 ID 进度。宿主缺失时抛出 RangeError；持久 Ref 的 Definition 不匹配时抛出 TypeError，本轮 Ref 过期时抛出 RangeError。持久 data 允许在 LEAVING 或结束程序中更新；普通本轮数据写入在 ENDING 时抛出 TypeError。数据同引用时返回原 battle，不执行完整更新，不提供旧局部 setter 或回调双协议。

计算与提交之间不执行其他完整操作；跨领域调用后先接续 battle 并重读私有数据。字段写回保留其他当前字段，但不替调用者合并陈旧 data。NoInfer 阻止结果值反向扩大私有类型，完整聚合写回仅归 Core。


## 2. SP

SP Definition 保存 initial、capacity、requirement、可选数值 cost 和 Recovery。cost 未指定时以有效 requirement 为基础，再结算 cost 贡献。特殊发动可在同一输入版本中查询本次 cost 并初始化形态数据。

SP 容量、门槛与支付贡献使用 Skill 自己的 Modifier：`{ priority, apply(battle, self, current) => number }`。先由 Contribution 选择互斥胜者，再按程序 priority 升序执行，同优先级沿候选 ID 顺序；这是显式数值变换，不是 Attribute 四段叠加。SP 容量／门槛／支付以及 TIME 时长的静态 Modifier.priority 在对应贡献登记入口校验为有限数；每次 apply 的结果仍在程序输出边界校验。两项回复属性继续使用 attribute.Modifier，setContribution 的 key 决定并约束对应载荷。

实际需求包括：琳琅诗怀雅的金币容量覆写、玛露西尔的容量／最低门槛／逐次支付分离，以及 Fever 期间门槛与支付的变化。这些干员的完整内容接入仍需逐项完成。容量变化时的额外 SP 清空等行为由明确资源操作完成，不在纯查询中偷偷结算。

Recovery 为 TIME、ACTION、HIT 或 NONE。EXTERNAL 是资源操作的来源，普通 Action 的启动、推进和结束不会自动授予 SP。具体普通行动在成功释放点调用 Action.released，Skill.enter 登记相应监听并调用自己的 recover；被拦截或取消的释放不产生通知。

| 操作 | 契约 |
| --- | --- |
| `recover(battle, host, source, amount?)` | 检查来源及回复 Rule，按容量结算；TIME／ACTION／HIT 使用相应定义 |
| `pay(battle, host, amount?)` | 足额支付或失败，不要求 Activation，也不受回复 Rule 否决 |
| `modify(battle, host, delta, forced?)` | 直接修改；普通正增量仍检查 EXTERNAL 回复许可，负增量不因阻回被拦截；force 只绕过规定的回复限制 |

三种操作从当前 battle 读取宿主，要求宿主在场且具有 Vitality 时 HP 大于零。无 Vitality 的 Skill 宿主仍可使用资源操作。

sp.advance 对 ACTION／HIT／NONE 回复直接返回原 battle，不更新 lastTick，也不提交无业务变化的 Unit。仅 TIME 推进自然计时；自然回复速度与倍率分别结算后相乘，计时状态保存周期、余时与 lastTick：

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

activate 要求宿主 PRESENT、空间在场，具有 Vitality 时 HP 大于零；operate 则保留 PRESENT、同一 Activation ACTIVE 与 Rule 准入，不附加空间或 HP 条件。当前 Activation 已存在时，内部信任对应 Activation Definition 已配置。持久 Skill.onTick 按 PRESENT 推进，Activation.onTick 另要求本轮 ACTIVE；它们不自动采用自然 SP 回复的暂停条件。已有技能的 STOP／RETRIGGER、计时或内部进度可以在不具备新发动资格时继续，这是各入口明确的规则选择，不合并为通用 available。

Hook 登记仅使用 capability/skill 的 setHook(state, key, hook)／removeHook(state, key, id)，Key 与事件载荷保持类型配对，不再为每个事件提供同义专名 setter。

除持久初始化外，Definition 与 Activation Definition 的内容回调都显式接收 source 为第二参、聚合 self 为第三参。Definition.onEnter／onTick 和 Activation Definition.initialize／accepts／cost 接收 Skill<S, A>；onStart／onTick／onOperation／onEnd 接收 activation 非空的 Activation<S, A>，Operation 或 End 为第四参。Activation.initialize 只构造本轮 A；持久 Definition.initialize 则接续 Result<S>。STOP 与 RETRIGGER 交给内容程序处理，未提供 onOperation 时 STOP 默认正常结束。

| Hook | 事实 |
| --- | --- |
| spRecovered | 实际回复 SP |
| spPaid | 成功支付 SP |
| spModified | 直接修改 SP |
| ammoConsumed | 指定弹药消费已经结算 |
| ammoReplenished | 普通补弹已经结算 |
| activated | 本次 Activation 已成功创建 |
| ended | 本次 Activation 完整结束 |

Hook 使用公共 Hook<Context<E>, void>；Context 固定 host 与本次 event。activated 载荷为非空聚合视图，ended 的 activation 字段也保存该视图；视图内部的 activation 才是本轮元数据。accepts 只读，invoke 返回 Result<void>。每次派发固定候选 ID，逐项读取最新登记；Activation 结束或被替换后，后续观察者仍收到原始事件，当前状态另从最新 battle 查询。

不提供通用 changed、阈值注册表或充能状态机。资源事件携带本次结算前后事实；阈值观察者订阅相关业务 Hook。每次派发独立固定候选 ID，逐项按 ID 读取最新登记并执行最新 accepts／invoke；同 ID 替换在本轮使用新版本，新 ID 等待下次派发，嵌套报告不会重写外层事实。

HIT 回复由 Skill.enter 在 Damage 的 receivingStarted 扩展点登记，发生在接收准入后、Receiving Hook 和 HP 扣减前。Skill 自行监听受击事实并执行回复，Damage 与 Vitality 不依赖 Skill。

## 5. 发动与完整结束

发动先检查当前宿主、触发方式、许可、门槛与足额支付，采样数据与持续预算，再一次性写入扣费和新 Activation。随后依次记录 SKILL_ACTIVATED、派发 activated、通知 spPaid，再执行仍有资格的 onStart。支付 Hook 可以终止已创建的激活；后续启动程序必须重读同一身份、ACTIVE 状态和宿主当前资格，创建事实不会被撤销，支付报告保留已提交时的前后值。

activated 表达实例已经创建，不承诺 onStart 效果已经安装。它的派发先于可能终止激活的支付与启动程序。没有活动 Lifetime 结算时，前一个 activated Hook 的结束操作可以在后续 activated 候选前完成 ended；已有结算时，嵌套结束只同步执行请求／Prepare，ended 等待 Finalize。后续候选始终处理原创建事实，不因终止重写报告。

Skill 的公共 lifetime 描述符绑定本轮 Activation，Effect 使用 scope(skillLifetime, activationRef) 建立依赖。请求先登记 Pending 并发布 ENDING，再展开依赖；最外层结算器等待依赖者完整完成后进入 Finalize。Finalize 从所有权保护的当前 unit.skill 取得同一轮完整聚合，以显式 source 调用 onEnd，再重读宿主并只清空 activation，保留最新持久 data／SP，记录事件与派发 ended；其他完整操作同样通过普通查询线性接续，不经过泛型 reader。整个 Finalize 返回后才解除 owner 等待，Unit 在此期间保留原 Definition 与当前状态，不需要通用历史回退。

ENDING 期间继续占用同一激活槽位，持久 Skill 聚合始终保留。嵌套 finish／cancel 首次请求返回只保证 Prepare，不保证本轮已清空或 ended 已派发；需要下一次激活的业务放在槽位释放后的 ended 时点，已有结算范围中不能强行 drain。重复 PREPARING 请求也不等待原 Prepare。

Unit 退场通过派生所有权关系自动请求 Skill、Action、Burst 与 Effects；Skill 请求先于 Action，兄弟可以都先进入 ENDING。首次原因不会被后续完成／取消覆盖；Unit Finalize 晚于这些子项的整个 Finalize。结束内容跨完整操作后仍按需要读取当前宿主与实例。

## 6. 待完成的机制覆盖

跨部署魔力的持久载体、Fever 的持续暂停／恢复、特殊异常状态发动许可与不同弹药类加成资格，仍需按[代表技能覆盖审查](../research/cases/09-skill-mechanisms-and-requirements.md#7-当前目标设计的代表技能覆盖性)逐项接入。

TIME／INFINITE 与独立弹药同时存在的模型、grant 的独立增加通知，须结合具体玩法和观察需求确定；现有 AMMO 生命周期不自动代表全部弹药类加成资格。
