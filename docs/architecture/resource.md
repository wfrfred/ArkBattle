# Damage 与 Healing 结算

本页是 HP／EP 四类资源业务的公共契约。HP 状态、债务和提交干预见 [Vitality](vitality.md)，EP 状态与爆发见 [Elemental](elemental.md)；登记、优先级与同步候选见 [Hook](hook.md)，结束偏序见 [Lifetime](lifetime.md)。具体公开类型由 [resource/index.ts](../../src/core/battle/resource/index.ts) 下的四个业务入口提供，保留各自 Request、Context、Reason 和报告，不建立联合请求或中央事件目录。

原生依据集中在[公式与概率](../research/cases/10-weak-damage-and-critical.md)、[生命应用](../research/cases/11-damage-apply-and-hp-application.md)、[接收阶段](../research/cases/28-damage-hooks-and-event-granularity.md)、[治疗](../research/cases/29-hp-and-ep-healing-settlement.md)、[分类与权限](../research/cases/38-damage-classification-and-permissions.md)及[死亡归属](../research/cases/39-death-attribution-and-attribute-ranges.md)。Calculate／Apply 的划分及下述明确标出的规则是项目选择，不要求逐步复刻原生 Modifier。

## Calculate 与 Apply 的语义边界

Calculate 计算一笔输出；Apply 让目标接收该输出并完成资源与后继。两阶段分别接续 BattleState。计算成功不保证最终可接收，Calculate 本身不提交本笔资源、不产生本笔受击或受治疗响应；计算 Hook 发起的独立操作正常完成并保留在返回状态中。

```text
来源 Formula → 目标 Formula → 基础公式 → 来源 Output → Calculated

非零计算输出与基础目标资格
→ BeforeReceive → 最新接收资格
→ Receiving（该业务具有时）→ 取消与资格确认
→ 来源 BeforeCommit → 最新接收资格
→ 所属能力提交 → targetApplied → sourceApplied
→ HP Damage 确认死亡 → Completed → Outcome
```

基础目标必须仍登记且 PRESENT，HP 业务还要求 HP>0；EP 的 Burst 等固有前提由 Elemental 定义。BeforeReceive 位于接收 Restriction 前，能改变数值与准入状态；它不绕过基础前提。三次接收复检分别位于 BeforeReceive、Receiving、BeforeCommit 之后，读取最新有效规则。没有同步业务的连续步骤不重复校验。

各业务区分计算输出、接收量和实际变化：

- 全部 Output 完成后以 `max(0, output)` 形成 Calculated；负值不反转方向。零计算输出由 Apply 拒绝，已完成的计算状态仍保留。
- 接收中不逐项截零，全部接收完成后才将未取消的 amount 截为非负。正数计算输出接收为零，或实际变化为零，仍可成功。
- 资源报告在写点固定，后续嵌套恢复、伤害、属性变化或离场不重算；Applied 只通知成功提交。UI 仅消费实际变化，成功零变化仍有对应零值 Event，参见 [Event](event.md)。

Outcome 使用 type 判别：REJECTED 表示未获受理，CANCELLED 保留取消工作值，UNAVAILABLE 表示接收后失去继续提交资格，APPLIED 携带 received 与 Application。EP Healing 没有取消协议，因而没有 CANCELLED。Calculate 无法继续时返回 undefined 并保留已完成状态。

## 固定 Request 与当前工作值

Request 保存来源、目标、初始 parameters 及发起时确定的事实。来源与目标使用 Typed Ref；source 可为 null，来源已注销或 LEAVING 时不派发其普通输出 Hook，但不否定目标仍可接收已采样输出。

Formula 以原始 Parameters 为初值逐项接续。当前参数可改变伤害类型；基础公式、OutputContext.type 与 Calculated.type 使用改变后的实际类型，不重新读取 Request.parameters.type。防御与抗性在 Formula 后采样，Apply 不因之后属性变化自动重算。

Context 只保留本阶段所需的固定事实：基础为 request，接收增加 calculated 及本次取消权限，提交增加 received，Applied 增加固定 application，Completed 保存同一最终 outcome。目标从 request.target 取得。Calculated 不复制来源、目标或实时 HP／Effect；弹道和跨阶段业务所需样本由具体内容明确保存，不能用命中时查询来源冒充发射时采样。

### 请求分类

HP／EP Damage 顶层必填单值 `attackType`、`applyWay` 与 `nature`：

| 字段 | 合法值与职责 |
| --- | --- |
| attackType | NONE、NORMAL、SPLASH、BUFF、ADDITION；本笔攻击类别 |
| applyWay | NONE、MELEE、RANGED、ALL；本笔施加途径 |
| HP nature | DAMAGE、ENVIRONMENT、LOSS；HP 业务性质 |
| EP nature | DAMAGE、ENVIRONMENT；EP 损伤性质 |
| HP hitRecovery | 独立的受击类 SP 回复许可 |
| HP killer | 显式击杀者 Ref 或 null，与 source 独立 |

这些事实由调用者提供，不从阵营、距离、周期、Effect、地形或空来源推导，不改变数学伤害类型。分类采用字符串联合而非组合 mask 是项目选择；不据此断言原生禁止组合。Healing 不携带这些 Damage 分类。

HP 的三种 Nature、EP 的两种 Nature 分别使用各自同一管线。ENVIRONMENT 标签本身不跳过 Hook、固定数值或改变公式；source、HP hitRecovery 与本次 exclude 分别控制来源、HIT 许可与响应排除。EP 的限制与接收 Hook 通过 request.nature 实现环境免疫，取消权限仍遵守 Receiving 契约，排除 Hook 不删除登记。原生深水损伤来源与齐尔查克条件光环依据见[案例38](../research/cases/38-damage-classification-and-permissions.md#3-shared-flags-完整清单)。

普通无敌和 Presence 的 HP 接收规则只允许 LOSS；流失仍计算防御并进入提交和死亡后继。具体护盾、闪避、减伤或受伤机制按自身资格处理，泥岩接受 nature!==LOSS。活性源石为 ENVIRONMENT，敌方深水与标准爆发 HP 输出为 DAMAGE。角色狂躁周期明确允许 HIT；其它标准爆发、活性源石与敌方深水不允许，见 [Elemental](elemental.md#狂躁的行动与时间累加)。

普通 HIT 回复与伤判共用 HP Damage.receiving，Skill 的监听约定 priority=10000，普通伤判通常为 0。它仅接受未取消、amount>0、nature!==LOSS 且 hitRecovery=true 的工作值，回复后原样返回；前置取消或归零不授予 HIT，后续抵挡或闪避不回滚已完成回复。实际回复仍受 SP 自身资格与容量限制，详见 [Skill](skill.md)。

## 基础公式与弱点选择

HP Damage 使用 `p=max(0, power×multiplier+addition)`。power 不必来自 ATK；单笔乘加量与单位属性贡献是不同输入。物理／法术只携带当前类型使用的一份穿透，类型转换及跨类型采样由内容保证含义正确。

| 输出 | 基础公式 |
| --- | --- |
| HP 物理 | `max(0.05p, p-d)`，`d=max(0, DEF-fixed)×max(0, 1-proportional)` |
| HP 法术 | `max(0.05p, p×(1-r/100))`，r 对 RES 使用相同穿透顺序 |
| HP 真实 | p |
| HP 元素 | `max(0.05p, p×(1-damageResistance/100))`；无 Elemental 时抗性为 0 |
| EP 损伤 | `max(0.05p, p×(1-elementResistance/100))`，`p=max(0, power)` |
| HP 治疗 | `max(0, power×multiplier)` |
| EP 治疗 | power，不使用 HP 治疗量或元素抗性 |

抗性属性范围与 5% 基础保底分开；Output 可以继续降到保底以下，后续不再套用保底。HP 元素伤害与 EP 损伤使用独立抗性。所有数值遵守有限数值契约，正常资源与变化量保留小数。

### 弱点伤害的项目规则

物理、法术从同一输入 State 分别执行完整 Calculate，以包含 Output 的最终数额选较高分支，接续该分支的完整 State 后 Apply 一次。未选分支的事件、RNG、ID 与嵌套结果全部丢弃；不串行接续两次计算，也不选中后重算。这依赖纯状态契约，区别于[原生无事件试算](../research/cases/10-weak-damage-and-critical.md)。相等结果和固定弱点的选择归具体内容，尚未接入。

## 接收工作值、数值固定与取消

HP Damage、EP Damage、HP Healing 的 beforeReceive 与 receiving 使用同一业务 ReceivingHook、不同键，接续同一 Pending；EP Healing 只有 beforeReceive 和简单 Pending，没有准入后的 receiving 或取消协议。

| 当前 Pending | 可返回的后继 | 数值约束 |
| --- | --- | --- |
| NORMAL | NORMAL、FIXED、CANCELLED | 可改量、固定或取消 |
| FIXED | FIXED、CANCELLED | 保留原 amount |
| CANCELLED | CANCELLED | 保留取消时 amount 与原 reason |

固定和取消均不结束整轮派发，后续 Hook 可执行独立业务。前置已取消且准入通过，仍进入 Receiving；准入失败则跳过 Receiving、保留 CANCELLED，未取消者返回 REJECTED。最终取消不执行 BeforeCommit、提交或 Applied，先前消耗、治疗和反伤不回滚。接收量归零与取消不同。

fix 固定 NORMAL，其他状态保留。`cancel(current, reason, forbidden)` 必须显式传本域权限集合；已有取消原样返回，原因被禁止时保留原对象与状态，其余情况产生 CANCELLED。调用者检查结果是否真的取消后，才执行盾消耗、自疗等成功后继。泛型 Next 保证状态和原因单向接续；固定数值由内容契约保证，不增加运行时纠正。

| 业务 | 取消原因 |
| --- | --- |
| HP Damage | UNSPECIFIED、UNHURTABLE、MISS、BLOCKED、HIT_FAILED、INTERRUPT |
| EP Damage | UNSPECIFIED、UNHURTABLE、INTERRUPT |
| HP Healing | UNSPECIFIED |

MISS 是目标成功闪避，HIT_FAILED 是来源未命中，BLOCKED 是抵挡；原因不使用内容自造字符串。INTERRUPT 只表示本笔取消，不恢复原生特定时点的早退规则。成功闪避的通用后继用目标侧 Completed 观察最终 CANCELLED／MISS，在剩余 Receiving 后、同次 Apply 返回前执行；须确认自身为目标。这是项目时点选择，原生在 Evade 成功节点立即通知。

## 本次 Hook 排除、取消权限与接收豁免

三项政策独立，不写入 Request／Calculated，不自动传播到嵌套操作：

| 政策 | 本次作用范围 |
| --- | --- |
| Options.exclude | 按 Key 对象身份及 ID 排除本次响应；null ID 排除整键，不改登记、公式、提交或资格 |
| ApplyOptions.forbidden | HP Damage、EP Damage、HP Healing 的取消权限；Apply 一次建立 ReceivingContext.forbidden，接收／提交／Applied 共用，Hook 显式传给 cancel |
| ApplyOptions.ignore | HP／EP Damage 的接收 Restriction 豁免；每次复检解析最新有效贡献，再豁免匹配定义，不恢复竞争落败项 |

Calculate 与 Apply 分别接受 exclude；同键在本次多个宿主上使用时一致匹配。专属 Receiving 接续 Apply 的选项。Vitality 内部 damageCommitting／damageCommitted、EP 资源／Burst 通知与其它生命周期不自动继承它；HP targetKilled 是下节规定的显式转发。

ignore 不绕过 PRESENT、存活、Burst 或中立默认前提。HP Restriction 接收实际 ReceivingContext，EP 接收 `{self, request, type}`，实际 type 来自 Calculated；不为索敌伪造计算结果。HP Healing 没有接收限制数组，EP Healing 保留自己的 healingRestrictions，均不增加本次 ignore；EP Healing 也没有 forbidden。

Hook 的固定 Context、priority、候选快照与重入资格只在 [Hook](hook.md) 定义。sourceFormula／targetFormula、targetApplied／sourceApplied 是不同角色；同一 Unit 承担两个角色仍分别 Applied，Completed 对同一宿主只通知一次。

## 生命状态、通知与离场

HP 资源提交及 damageCommitted 完成后，依次执行目标与来源 Applied，再读取目标：仍为 PRESENT 且 HP≤0 才确认本笔死亡。此前零 HP 不等于已离场，不提前清掉 Blocking；恢复后可保留旧关系。普通 Healing 不恢复零 HP，明确的保护或复活恢复使用 [Vitality](vitality.md#自然-hp-回复) 的直接操作。Combat 不扫描 HP 或代为判死。

HP Damage.Request.killer 必填，由调用者给定；无伤害 source 也可有 killer，无归属则为 null。Core 不从当前世界猜测，也不因来源注销而重判。Unit.End 的 DEATH 分支必须携带 killer；首次有效结束固定 Departure，重复请求不覆盖原因、归属或重复 Prepare。

### 单笔击杀结果与 targetKilled

仅在本笔确认死亡且 killer 非 null 时，HP Apply 给目标临时登记 priority=10000 的 Unit.prepare Hook，然后调用 Unit.remove(DEATH,killer)。Unit 先固定 Departure、发布 LEAVING，临时 Hook 再以当前 State、传入的死亡 Departure 派发击杀者本地 targetKilled；普通目标 prepare 业务约定低于 10000。更高优先级或同级先登记项仍服从公共排序，没有强制分区。

`TargetKilledContext = Extract<Departure, {reason:"DEATH"}>`，工作值为 void，typed Key 要求 Unit。它只携带受害者 unit、reason 和 killer，不复制 Request 或资源报告。仍登记的 LEAVING 击杀者可响应，已注销或 null 时跳过；每项 Effect 的实际资格仍由自身 Hook 判断。Apply.exclude 显式用于该键／ID，排除不影响临时 Prepare 本身、目标死亡或其它生命周期，也不传播到嵌套伤害。

APPLIED.killed 表示本笔取得死亡确认，不加入 Application 或提前发生的 AppliedContext。目标已由内层确认死亡、已离场、或已被救回时，外层不再确认；Finalize 延后不丢结果，Completed 后发业务不回写旧结果。逐击杀即时后继使用 targetKilled，范围／多段累计或整次限额仍可由 Content 使用 killed 编排。

### 直接致死的调用者组合

直接 Unit.remove(DEATH,killer) 提供死亡事实，不自动生成 targetKilled，也不要求先写 HP0。InstantKill 内容若需要来源后继，调用者先登记自己的本地 Prepare 闭包，再请求移除；Unit 发布 LEAVING／固定 Departure 后才在 Prepare 中通知击杀者：当前 State 已是 LEAVING，Departure 仍保留离场入口历史；随后执行普通目标准备和依赖清理。它复用 typed Key、公共 dispatch 与 Unit 结束，不增加 InstantKill API、全局 Prepare 或 Unit／Vitality 的预装击杀逻辑。

完整结束偏序与嵌套完成边界归 [Lifetime](lifetime.md)：Prepare 先于自动请求依赖者，真实依赖者完整结束后宿主才注销。Apply 返回及 Completed 不保证处于已有结算范围中的 Finalize 已完成。归属依据见[案例39](../research/cases/39-death-attribution-and-attribute-ranges.md)，临时 Hook 组织方式是项目选择。

## 治疗选择与支持边界

满 HP 的正数治疗仍可成功、报告零增加和实际溢出；普通选目标时是否排除满血由 [Targeting](targeting.md) 决定。标准 healFree 只限制 HP 治疗选择，不构成接收免疫；独立 EP 回复不检查该标记，明确目标的 Healing 不携带选择豁免开关。这与原生 HEAL_FREE 的接收检查存在明确项目差异。

基础结算和真实内容是否接入分别记录：[Vitality](vitality.md#特殊-hp-application-的支持边界) 说明生命干预与特殊恢复，[Elemental](elemental.md#支持边界) 说明标准爆发及具体内容的支持范围。研究覆盖见[案例37](../research/cases/37-resource-mechanism-coverage.md)，验收结果与集中归属见[语义验收](verification.md#hook-与伤害治疗的回归语义)。
