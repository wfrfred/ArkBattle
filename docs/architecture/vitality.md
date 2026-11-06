# Vitality、Damage 与 Healing 设计

Vitality 保存 HP、MaxHP、DEF、RES，以及伤害与治疗的专属接收 Hook 和伤害接收规则。通用结算 Hook 由对应领域定义，存于来源或目标的 Unit.hooks。`battle/damage/`、`battle/healing/` 提供 Calculate／Apply 操作，复用[公共 Hook 契约](functional-core.md#6-hook-和生命周期的纯契约)。

Damage／Healing 顶层入口仅导出 hp、ep 命名空间。上层分别从 [vitality/index.ts](../../src/core/unit/capability/vitality/index.ts)、[damage/hp/index.ts](../../src/core/battle/damage/hp/index.ts) 与 [healing/hp/index.ts](../../src/core/battle/healing/hp/index.ts) 导入公共契约。Damage／Healing 保持 Calculate／Apply 两阶段；Hook 登记与公开类型可由入口取得，内部 dispatch 不公开。

普通 Damage 覆盖物理、法术、真实与元素 HP 伤害。特殊生命机制、伤害分类和死亡扫描等未完成设计分别保留在第 3.2、4.2、5 节，不作为普通主路径的占位字段。

## 0. Vitality Capability

`vitality/capability.ts` 提供定义、初始化和属性 Change 工厂，`vitality/query.ts` 提供依赖战场的防御查询；DEF／RES 属于 Vitality，不构成独立 Capability。

```typescript
interface Definition {
    readonly maxHp: number;
    readonly defense: number;
    readonly resistance: number;
}

initialize<U extends Unit & Pick<Vitality, "definition">>(battle, unit: U): Result<U & Vitality>;
setMaxHpContribution(entry): Change<Unit & Vitality>;
removeMaxHpContribution(id): Change<Unit & Vitality>;
resolveMaxHp(definition, state): number;
setContribution(key: "defense" | "resistance", entry): Change<Unit & Vitality>;
removeContribution(key: "defense" | "resistance", id): Change<Unit & Vitality>;
setHook(key, hook): Change<Unit & Vitality>;
removeHook(key, id): Change<Unit & Vitality>;
resolveDefense(battle, self: Unit & Vitality): number;
resolveResistance(battle, self: Unit & Vitality): number;
```

基础 MaxHP、DEF、RES 全部必填，由 initialize 校验为有限非负数，可以是小数。初始 HP 为 `Math.max(1, definition.maxHp)`，有效 MaxHP 的下限为 1。基础 RES 可以超过 100，有效值在属性修正后限制到 0～100；有效 DEF 的下限为 0。普通 HP 使用 0～有效 MaxHP 的范围，不在每次计算后取整。

MaxHP 保留静态 Modifier[]，set／remove 工厂分别负责贡献登记与移除，共用局部 HP 比例计算，在同一次纯 transform 中生成新贡献集合和新 HP。零 HP 不因属性变化复活；不附带治疗通知或 Blocking 后继。DEF／RES 的 Input 为静态修正或 `(battle, self: Unit & Vitality) => readonly Modifier[]`，由普通注册工厂生成 setContribution／removeContribution。专属接收 Hook 同样通过 setHook／removeHook 登记，字段与 Hook 类型保持配对。MaxHP 单独保留领域实现，不进入普通字段集合。resolveDefense／resolveResistance 接收已取得的当前宿主并返回 number，不重复定位或判空；Damage 在 Formula Hook 后确认当前目标，再按伤害类型求值，不提前缓存或混入穿透。

HP、Contribution、专属接收 Hook 与 Rule 共存于同一 Vitality State。DEF／RES 的修改保留其他字段；属性变化不派发普通治疗 Hook。治疗索敌默认 provider 与显式注入 provider 均读取有效 MaxHP，避免把基础值或未计修正的上限用于缺血判定和比例排序。

Damage 接收 Rule 使用 `allows(battle, ReceivingContext)`；Rules 声明 damageRules，State 直接继承 Rules、Contributions、Hooks。单节点登记接口保留 `setRule(rule)`／`removeRule(id)`，由普通登记工厂固定 damageRules 字段生成，返回 Change 交给 Unit.update 提交。普通治疗不另设 Rule 数组，治疗干预仍由专属 Receiving Hook 表达。

## 1. Calculate 与 Apply 的语义边界

HP Damage、EP Damage、HP Healing 与 EP Healing 共同采用两阶段边界：Calculate 表示输出计算，Apply 表示目标接收。两阶段均显式接续 BattleState，允许 Hook 参与；这是 ArkBattle 的明确设计选择，不以复刻原生 Hook 时序为目标。下文具体接口描述普通 HP 伤害与治疗，EP 接口仍需按此边界整理。

| 阶段 | 职责 |
| --- | --- |
| Calculate：输出计算 | 来源尝试产生一笔伤害或治疗；执行来源与目标的公式修正，读取防御、抗性等属性，计算并修正输出，返回 Calculated 及对应 BattleState。 |
| Apply：目标接收 | 目标尝试接收选定的输出；执行目标应用前程序、接收资格及有序伤判、资源提交、应用后通知与后继业务。接收阶段仍可修改或取消本笔输出。 |

Calculate 不提交本笔输出的资源变化，也不派发本笔输出的受击或受治疗响应。计算 Hook 可以消费资源、推进 RNG 或发起独立的伤害、治疗、Effect 与生命周期操作；嵌套结算正常执行自己的 Apply，并进入返回状态。目标参与公式修正不等于目标已经受击。

Calculate 成功不意味着目标受击；Apply 被调用也不意味着一定发生资源变化。Apply 从传入的最新 BattleState 读取对象并确认当前资格，不因计算成功跳过接收判断。

四种业务统一区分三种量：Calculate 最终形成的计算输出量、Receiving 后的接收量，以及 Capability 提交后的实际变化量。**零计算输出在 Apply 入口返回 REJECTED，不进入本笔接收或 Applied；Calculate 已完成的状态仍保留。零实际变化允许成功返回 APPLIED。** 例如正数治疗作用于满血目标，仍正常接收并通知，报告中的实际恢复量为零；不能按实际变化量倒推是否发生了接收。接收量归零与明确取消也分别处理，取消仍按取消结果结算。

内容程序按机制语义归属，不按原生事件编号逐项映射：

| 内容程序 | 所属阶段 |
| --- | --- |
| 修改公式输入或最终输出 | Calculate |
| 目标因即将受到伤害或治疗而响应 | Apply |
| 闪避、护盾、反伤、受击回复 SP | Apply |
| 成功造成伤害后的附加 EP | Apply 的来源后置 Hook，发起独立 EP 结算 |
| 资源变化、爆发与死亡 | Apply 中的对应资源提交及后继业务，具体职责由领域契约规定 |

即使原生先执行目标前置程序、再执行来源输出修正，ArkBattle 仍先完成 Calculate，再开始 Apply。以后仅在具体 Content 确认重要玩法差异时处理该机制，不据此恢复整套原生事件序列。原生时序及本次反例核对见[案例 28 第 6 节](../research/cases/28-damage-hooks-and-event-granularity.md#6-目标前置与来源输出能否交换)。

Content 负责具体机制的采样、特殊公式和流程组合；公共 API 提供通用计算与实行。请求是静态数据，不携带延迟计算回调；Hook 通过工作值修改本次计算或接收结果。

每次 Hook 派发仍遵守独立固定候选 ID、逐项读取最新登记与 accepts 的契约。同步回调返回后，需要继续依赖对象当前状态时，从返回的 BattleState 重新查询并确认生命周期；明确采样的数值继续使用。

### 1.1 Calculate

```text
公式参数 Hook
    ↓
读取目标当前防御属性，按当前伤害类型计算基础公式
    ↓
输出伤害 Hook
    ↓
Calculated
```

公式参数 Hook 依次包含来源和目标的干预。随后读取目标当前 DEF／RES 或元素伤害抗性，按当前类型计算基础公式，再执行来源的输出修正。Calculated 包含整个 Calculate 的结果。

Calculate 不实行本次伤害的 HP 变化。Formula／Output Hook 可以消费资源、推进 RNG 或发起独立 Operation，其状态逐项接续。闪避、护盾、屏障、接收减伤、同步反伤、受击治疗及死亡由 Apply 处理；反伤可以在外层伤害扣血之前发生。

防御属性在公式节点采样，之后的属性变化不会使 Apply 自动重算。Apply 重新读取生命周期、HP、Effect 和接收规则。

### 1.2 请求与计算参数

Request 携带发起时已经确定、接收方无法自行推导的必要事实，以及初始 Parameters。请求描述本次伤害，不提供配置内部执行步骤的开关。

来源和目标使用 Typed Ref；伤害分类的未完成设计见第 5 节。

```typescript
interface AttackParameters {
    readonly power: number;
    readonly multiplier: number;
    readonly addition: number;
}

interface Penetration {
    readonly fixed: number;
    readonly proportional: number;
}

type DamageType = "PHYSICAL" | "ARTS" | "TRUE" | "ELEMENTAL";

type Parameters =
    | {
          readonly type: "PHYSICAL" | "ARTS";
          readonly attack: AttackParameters;
          readonly penetration: Penetration;
      }
    | {
          readonly type: "TRUE" | "ELEMENTAL";
          readonly attack: AttackParameters;
      };

interface Request {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly parameters: Parameters;
}

interface Calculated {
    readonly type: DamageType;
    readonly amount: number;
}
```

AttackParameters 表示用于本次计算的数值，不要求 power 一定来自来源的 ATK。基本数值为 `power * multiplier + addition`；具体伤害类型再决定防御公式。

物理／法术参数只携带当前类型所使用的一套穿透。类型转换必须同时保证新类型参数的业务含义正确；类型系统不负责证明采样来源与时点。跨类型计算需要的历史参数由发起该业务的 Content 保存，例如双分支各自取得完整的物理／法术穿透快照；普通 Request 不因此固定携带两套穿透，也不在来源失效后以实时查询冒充历史采样。

### 1.3 固定 Request 与当前工作值

Calculate 的参数派发使用三个通道：

| 通道 | 本阶段含义 |
| --- | --- |
| 固定 Context | `{ target, request }`，request.parameters 是初始参数。 |
| 动态 BattleState | 前一个 Hook 返回的最新战斗状态。 |
| 可接续 current | 前一个 Hook 返回的当前 Parameters。 |

四种结算的 Request 统一通过 parameters 携带初始 Parameters，不必额外复制一份请求。Hook 通过返回新工作值修改参数，不能改写原始请求的历史含义。

例如 Request 初始类型为 PHYSICAL，Hook 将 current 转为 ARTS 后，后续依赖实际类型的筛选与公式读取 current.type；输出阶段使用公式阶段确定的类型，Apply 使用 Calculated.type。不能重新读取 Request 的初始类型来代表后续阶段的实际类型。

### 1.4 跨阶段载荷

Calculated 只保存最终伤害类型与计算后数值；来源、目标和初始事实通过单独传入的 Request 保留。不保存目标当前 HP、DEF／RES 或 Effect State 的快照。已计算的数值保留其采样意义；后续业务需要当前对象状态时，从最新 BattleState 查询。

跨阶段仅传递 Calculate 已确定、Apply 实际需要的事实。具体业务需要跨越 Projectile 或 Calculate／Apply 保存的性质时，必须明确采样时点、作用范围与输入通道；不能以接收时查询来源代替历史采样，也不能仅以“由 Hook 实现”代替数据传递。

### 1.5 操作与结果

```typescript
calculateDamage(battle, request): Result<Calculated | undefined>;
applyDamage(request, calculated: Result<Calculated | undefined>): Result<Outcome>;

type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "CANCELLED"; readonly received: Pending }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | {
          readonly type: "APPLIED";
          readonly received: Pending;
          readonly application: Application;
      };
```

Apply 接续计算返回的 state；调用间若有其他状态转换，调用者须把最新 state 接回计算 Result。计算失败返回 undefined 时保留已经完成的状态前缀，Apply 形成 REJECTED 并通知仍符合资格的 Completed 观察者。

Parameters Hook 使用固定 Context 中的 Request 和当前 Parameters；HP Damage 的 Output 使用固定 `{ target, request, type }` 和可修改的 number，HP Healing 的 Output 使用其 Context。type 是公式阶段已确定的类型，输出 Hook 不重新分类或重算防御。

AppliedContext 保留 request、calculated、Receiving 最终 received 和本次 application，不重复携带 Outcome；Outcome 的 APPLIED 分支引用同一个 Application 类型。CompletedContext 保留 request、可能 undefined 的 calculated 和同一份 outcome。application 的 hpBefore／hpAfter／hpLoss 在普通 HP 写入处确定，不受之后治疗、嵌套伤害或离场影响。

Formula 分来源与目标两个节点，Output 属于来源，BeforeReceive／ReceivingStarted／Receiving 属于目标，BeforeCommit 属于来源。Applied 分别通过 targetApplied 与 sourceApplied 键依次通知目标和来源，同一 Unit 承担两个角色时也分别执行各自登记；Completed 仍按既定终结通知契约，同一宿主不重复通知。每个节点、每个宿主的派发独立固定候选 ID，目标响应中新登记的来源 Hook 可进入随后独立的来源派发。登记、优先级和生命周期见第 1.7 节。

DAMAGE 事件只携带飘字需要的目标、伤害类型、实际 HP 损失和发生 Tick。取消保留零值表现；接收量、取消原因和提交后的 HP 属于 Outcome／Application，不复制到 Event。零数值输入在 Apply 入口 REJECTED，不进入普通受击回复；无敌等入口 Rule 拒绝也不进入 Receiving。取消不停止后继 Receiving Hook，次数盾自行筛除取消或非正数值；反伤可继续。

### 1.6 已定稿的结算 Hook 类型

HP Damage、EP Damage、HP Healing 与 EP Healing 各自定义 Request、Context、Parameters、Calculated、Pending、Application 与 Hook，不建立四种业务的联合 Request／Context 或通用 SettlementContext。共同使用现有 `Hook<C, T>` 与派发协议；某内容同时响应多种结算时，分别登记精确 Hook，再调用共享的内容程序。以下使用 HP Damage 子域内的局部类型名。

```typescript
interface Context {
    readonly target: Ref<Unit & Vitality>;
    readonly request: Request;
}

interface OutputContext extends Context {
    readonly type: DamageType;
}

interface ReceivingContext extends Context {
    readonly calculated: Calculated;
}

interface CommitContext extends ReceivingContext {
    readonly received: Pending;
}

type Application = vitality.DamageApplication;

interface AppliedContext extends CommitContext {
    readonly application: Application;
}

interface Entry<C, T> extends Hook<C, T> {
    readonly priority?: number;
}

type SourceFormulaHook = Entry<Context, Parameters>;
type TargetFormulaHook = Entry<Context, Parameters>;
type OutputHook = Entry<OutputContext, number>;
type BeforeReceiveHook = Entry<ReceivingContext, void>;
type ReceivingStartedHook = Entry<ReceivingContext, void>;
type BeforeCommitHook = Entry<CommitContext, void>;
type AppliedHook = Entry<AppliedContext, void>;
```

Request 始终表示初始事实；公式参数、输出量和接收工作值只经对应 Hook 的 current 接续。OutputContext.type 是公式确定的类型，不重新读取 Request 的初始类型。BeforeReceive、ReceivingStarted、BeforeCommit 与 Applied 只接续 BattleState 业务；Applied 的报告在提交时确定，只对成功提交派发，零实际变化仍可成功。其余业务定义自己的 Application，不重复声明成功 Outcome 的另一份报告。

各业务 Hook 键由相应子域导出。Vitality 专属接收使用 setHook(key, hook)，key 为 damageReceivingStarted／damageReceiving／healingReceiving；Elemental 专属接收使用同一接口登记到 damageReceiving 字段。撤销使用对应 removeHook 接口。

ReceivingStarted 目前只供 HP Damage 的普通受击 SP 等接收开始业务使用，不向其他三种结算机械添加。EP Healing 不提供专属 Receiving，其 Pending.cancellation 固定为 null，也不导出无执行路径的取消构造器或 CANCELLED 结果。各业务只提供实际需要的阶段，不按目录模板补齐接口。

#### 接收工作值与取消

以下 Reason 为 HP Damage 的取消原因示例，其他业务按自身机制定义，不统一强制相同原因集合。

```typescript
type Reason = "EVADE" | "BLOCK" | "IMMUNE";

interface Cancellation<R extends Reason = Reason> {
    readonly reason: R;
}

interface Pending<
    C extends Cancellation | null = Cancellation | null,
> {
    readonly amount: number;
    readonly cancellation: C;
}

type Next<C extends Cancellation | null> =
    C | (null extends C ? Cancellation : never);

interface ReceivingHook extends Entry<ReceivingContext, Pending> {
    readonly invoke: <C extends Cancellation | null>(
        battle: BattleState,
        context: ReceivingContext,
        current: Pending<C>,
    ) => Result<Pending<Next<C>>>;
}

declare function cancel<C extends Cancellation | null>(
    current: Pending<C>,
    reason: Reason,
): Pending<Next<C>>;
```

amount 与 cancellation 独立：接收量可以归零而未取消，取消也可以保留非零数值。取消一旦成立，后续 Hook 保留已有取消及原因，仍可修改 amount 或按自身资格执行独立业务。Receiving 结束时若已取消，返回 CANCELLED，不执行 BeforeCommit、资源提交或 Applied；先前完成的业务仍接续，最终 Pending 保存在取消结果中。

Next 在输入未取消时允许首次取消，输入已有取消时只允许返回原取消类型；amount 始终为 number。ReceivingHook 可作为普通 `Hook<ReceivingContext, Pending>` 交给现有派发器，不增加运行时取消校验。

领域提供纯工作值构造函数 cancel，内容在 invoke 的返回值中使用 `value: cancel(current, "EVADE")`。cancel 保留当前 amount，已有 cancellation 则原样保留，否则写入新原因；必要的条件类型断言集中在此构造函数内部。内容不需要显式操作 Next 或编写类型断言，普通改量继续使用 `{ ...current, amount: nextAmount }`。

### 1.7 已定稿的 Hook 登记、顺序与生命周期

使用[类型化键与 Unit 本地 Hooks 集合](hook.md)。HP Damage、EP Damage、HP Healing、EP Healing 分别导出自己的 sourceFormula、targetFormula、output、beforeReceive、beforeCommit、targetApplied、sourceApplied 等实际需要的精确键，不通过联合 Context 或中央事件目录描述。

固有登记直接写入 Unit Definition.hooks，在任何 enter 程序之前完成装配。运行时统一使用 `unit.setHook(key, hook): Change<Unit>`／`unit.removeHook(key, id): Change<Unit>`，经 Unit.update 发布；生命周期键也允许修改，不另设登记权限或领域转发入口。集合本身只要求 id，priority 在上文结算域的实际 Hook 类型中声明，缺省为 0；同阶段按 priority 降序，相同时保留登记顺序。同键同 ID 替换保位，当前派发不因替换重新排序。

HP ReceivingStarted、HP Damage／Healing Receiving 仍存于 Vitality，EP Damage Receiving 仍存于 Elemental，使用各自 Capability 的 Change API；EP Healing 不机械新增专属 Receiving。Burst 与实际 EP 变化通知保持 Elemental 自身职责。

本地登记随承载 Unit 注销而移除，不建立 BattleState 外置表或单独 Hook Lifetime。临时 Effect 在启停时登记、撤销自己的输出；跨 Unit 安装仍由机制拥有者管理撤销。通用集合不承担派发、接收资格或自动回滚。

### 1.8 已定稿的接收与资源提交接口

Battle 编排四种业务各自的 Calculate／Apply、通用 Hook 与 Outcome；Vitality／Elemental 提供资格查询、专属接收和资源提交。Capability 不执行来源 Formula、Output、通用 BeforeReceive／BeforeCommit／Applied，Battle 不直接写入 HP／EP。接口如下。

| 职责 | Vitality | Elemental |
| --- | --- | --- |
| 只读接收资格 | canReceiveDamage、canReceiveHealing | canReceiveDamage、canReceiveHealing |
| 专属接收 | receiveDamage、receiveHealing | receiveDamage；EP Healing 不增加空的接收接口 |
| 资源提交 | commitDamage、commitHealing | commitDamage、commitHealing |

canReceive 只查询当前资格与接收 Rule，不执行 Hook。它接收相应业务判断资格实际需要的事实，不统一要求完整 ReceivingContext：EP 索敌发生在 Calculate 前，不需要也不能伪造 Calculated。HP 接收规则需要计算后的实际伤害类型时，读取该次计算确定的事实，不以 Request 中的初始类型代替。各业务不为形式一致强制同形输入。

receive 接续当前 BattleState 和 Pending，执行该资源的专属接收阶段。已有 ReceivingContext 包含目标，不再单独传入重复的 target：

```typescript
// Vitality；Elemental 的损伤接收使用 EpDamage 的精确类型。
receiveDamage(
    battle: BattleState,
    context: HpDamage.ReceivingContext,
    pending: HpDamage.Pending,
): Result<HpDamage.Pending>;

receiveHealing(
    battle: BattleState,
    context: HpHealing.ReceivingContext,
    pending: HpHealing.Pending,
): Result<HpHealing.Pending>;
```

HP Damage 的 receive 包含 ReceivingStarted 和有序 Receiving，HP Healing 只执行自己的 Receiving；EP Damage 执行 EP 专属 Receiving。它们都可能发生同步业务，不能退化为只返回数值的局部计算。取消继续遵守第 1.6 节的 Pending 契约。

commit 直接复用已经定义的精确 CommitContext，不再拆出目标、原始请求和最终接收量作为另一组参数。该 Context 已提供本次固定请求、计算结果与 received，足以支持资源写入、Burst 归因和能力通知。两种能力分别提供：

```typescript
// Vitality
commitDamage(battle: BattleState, context: HpDamage.CommitContext): Result<DamageApplication>;
commitHealing(battle: BattleState, context: HpHealing.CommitContext): Result<HealingApplication>;

// Elemental
commitDamage(battle: BattleState, context: EpDamage.CommitContext): Result<DamageApplication>;
commitHealing(battle: BattleState, context: EpHealing.CommitContext): Result<HealingApplication>;
```

DamageApplication／HealingApplication 由各自资源能力定义。Battle 的 Application 直接引用同一报告，不再声明相同字段的副本。HP 报告保存 hpBefore、hpAfter 和实际 hpLoss／hpGain；EP 报告保存本次实际变化及对应 Burst 创建事实，治疗逐型报告，不把数额在四型间分摊。报告在资源写入时确定，之后的嵌套业务不重算它。

共享 CommitContext 是复用结算事实，不改变业务控制权。commit 从最新 BattleState 读取资源，保留 Receiving 与 BeforeCommit 已完成的变化；进入前已经确认资格且其间没有回调时，内部信任该事实，不重复检查同一组 Rule。特殊生命写入接管仍按具体内容另行研究，不在这里增加占位协议。

Apply 的编排为：

```text
非零计算输出与目标基础资格
→ 通用 BeforeReceive
→ 最新 canReceive
→ 专属 receive（该业务具有时）
→ 确认取消与当前资格
→ 来源 BeforeCommit
→ 确认当前资格
→ 对应 Capability.commit（复用 CommitContext）
→ targetApplied
→ sourceApplied
→ HP Damage 按当前 HP 确认死亡
→ Outcome
```

只在同步业务可能改变续执行条件的边界重查资格，无回调的连续步骤不追加防御。取消不执行 BeforeCommit、commit 或 Applied；正数计算输出在接收后归零、或实际变化为零，仍可成功提交并派发 Applied。

HP commit 不提前请求死亡，Battle 在两侧 Applied 后读取当前目标，仍为 PRESENT 且 HP 不大于零时才请求离场。EP commit 同步完成 EP 写入、必要的 Burst 创建及 Lifetime 登记；Burst 的 onInstall 先发布创建事实并通知 burstStarted，再执行仍有效的本轮一次性爆发业务。安装流程完成后派发实际损失的 damaged 通知，再返回提交报告，供 Battle 依次派发 targetApplied、sourceApplied。零恢复预算仍执行安装业务，随后由通用 Effect 安装流程结束，不启用或推进根实例。EP Healing 的 healed 也由资源操作按实际变化派发；CommitContext 保留其所需的原始请求事实。自然恢复不经过普通 Healing 的 Calculate／Apply。

## 2. 弱点伤害的项目规则

**本项目采用两个独立计算分支：物理、法术分别执行完整 Calculate，各自派发 Hook，选取较高结果后 Apply 一次。** 这有意区别于 [PRTS 的限定公式项、无额外计算事件的理论比较](https://prts.wiki/w/伤害分类)。

```text
同一个起始 BattleState
    ├── calculate(PHYSICAL)，包含其 Hook → 物理结果及对应 BattleState
    └── calculate(ARTS)，包含其 Hook     → 法术结果及对应 BattleState
                         ↓
              选择计算伤害较高的结果
                         ↓
              接续该结果的完整 BattleState
                         ↓
                    apply 一次
```

两个候选从同一个输入状态分别执行，不把物理分支返回的状态传给法术分支。选择依据是包含输出修正在内的 Calculate 最终伤害结果，不是仅完成防御公式的数值，也不是护盾、闪避、HP 上限裁切等实行之后的结果。例如物理公式为 100、法术公式为 90，而法术输出修正后为 180，则选择法术的 180 及其对应状态。

选中分支的状态、事件、RNG、ID 分配与 Hook 引发的嵌套业务一并接续；未选分支全部丢弃。不仅选取一个伤害数值，也不在选择之后重新计算一遍。两次 Calculate 都不派发本笔伤害的受击响应；只有选中分支进入 Apply，接收阶段的 Hook 与本次 HP 应用执行一次。

这依赖既有纯状态契约：Hook 的战斗影响通过返回的 BattleState 表达，不修改输入版本或依赖闭包保存战斗进度。两个计算分支允许共享不可变输入，不需要为试算建立另一套可变 Runtime。

相等结果的选择、固定弱点等内容政策尚待对应内容设计确定。

客户端事实另见[弱点伤害与概率判定](../research/cases/10-weak-damage-and-critical.md)：原生弱点动作读取执行到当时的攻击倍率，两个无事件试算共享该值，不重新派发倍率事件；不能将其理解为排除已发生的暴击。本节分支规则是独立的项目选择。

## 3. Apply 的结算时点

### 3.1 普通伤害流程

| 时点 | 职责 |
| --- | --- |
| 接收开始 | 进入本次接收流程后的起始通知；普通受击回复 SP 等机制在此按自己的资格参与。 |
| 受击处理（Receiving） | 按顺序处理当前伤害，包括闪避、抵挡、屏障、减伤，以及属于此时点的同步反伤、治疗和计数。 |
| HP 应用（HP Application） | 从最新 HP 扣除 Receiving 最终数值，最低为零。 |
| 生命变化已应用 | 本次生命变化已形成事实，响应不能追溯改写这次应用；响应产生的治疗或其他操作正常接续。 |
| 结算完成 | 通过 Outcome 观察拒绝、取消、失效或已应用的结果。 |

初始零伤害与入口拒绝不进入 Receiving；伤害后来被护盾抵挡与一开始就是零是不同的事实。机制依据见[机制时序对照](../research/cases/11-damage-apply-and-hp-application.md)。

Receiving 取消当前伤害不自动终止整个 Hook 派发。每项从最新 BattleState 与 current 判断自己的资格：次数盾可以要求伤害仍有效，反伤或计数可以允许已经取消的伤害。成功闪避／抵挡的响应在成功节点同步触发；盾消耗、嵌套治疗与反伤等已经完成的业务不因外层取消而回滚。

Receiving 内不按“先所有闪避、再所有护盾、再所有减伤”建立固定分类顺序。具体节点按业务优先级及稳定的登记先后组织；公共派发器仍只消费领域给出的固定候选 ID 序列，并在逐项执行时读取最新登记和资格。排序、参与资格、业务成功与整次派发停止分别表达。

### 3.2 暂缓：特殊 HP Application 必须区分的事实

非致命、不死、免死、替身、形态转换及 HP Application 接管尚未实现。下列约束用于后续设计；普通扣血不引入对应状态、接管 Hook 或占位字段。

| 事实 | 含义与边界 |
| --- | --- |
| 本次 HP 变化的默认应用责任 | 本次变化是否仍需由 Vitality 默认路径实行、具体还待应用什么；其他机制接管默认应用不等于停止所有 HP Application Hook。 |
| 普通免死的成功归属 | 本次普通免死是否已有某个效果成功取得，以及该效果的后续与消耗；不代表所有生命干预都已失去资格。 |
| 当前 HP 与生命状态 | 从最新 BattleState 查询的当前事实；不以旧 candidateHp、保护是否成功或默认应用是否被接管替代。 |

普通免死的“单次最多成功一个”仅约束属于这项业务契约的效果。不死、替身、形态转换、非致命伤害及特殊生命机制，不因此自动加入同一组竞争。统一 Hook 派发顺序不等于统一的保护竞争关系。

某项保护阻止 HP 归零，不会自动否定其他机制观察致命预判或执行生命干预的资格。若叶睦持有不死时仍能因致命伤切换替身，是必须能表达的案例；具体内容的实际先后另按证据记录，不能由这个结果反推出一条所有机制共用的调用顺序。

某机制接管默认 HP 应用后，后续 Hook 仍可按自身条件观察该决定或执行另一种干预。默认应用责任改变、普通免死成功、伤害取消和停止派发不是同一件事，不以全局 protected 或 handled 布尔值将它们合并。

工作值设计还须说明：致命预判使用哪一步的事实；回调修改 HP 或生命机制后，原本待应用的变化如何续接；默认路径与内容各自已经应用了什么。不能只因回调后 HP 大于零就推断本次伤害已完成，也不能每次回调后都无条件重扣原伤害。candidateHp 可作为局部计算值，但不能单独承担上述语义。

本节不预定一个通用竞争框架、状态机或数据结构。先用具体机制核对这些事实如何组合，再确定 current、固定 Context 与 BattleState 各自承担什么；不把三个语义要求直接翻译成三个独立字段。

### 3.3 生命状态、通知与离场

HP 变化、死亡确定、Unit 仍存在和离场完成分别处理。已确定死亡时，普通治疗不能仅因 Unit 尚在集合中就获得执行资格；普通治疗与明确的免死、复活、形态转换也不共用这一推断。

普通 Damage 提交 HP 后不维护 Blocking，先按目标、来源顺序完成全部 HP Applied 响应，再读取当前目标：仍为 PRESENT 且 HP 不大于 0 时才请求 Unit.remove，最后派发 Completed。既有关系的默认保持资格不因临时 HP 为 0 失效，保护响应恢复生命后可以保留原阻挡；新关系取得仍要求双方存活。确实离场时，由 Unit Lifetime 先发布 LEAVING，再派发能力自行登记的 prepare Hook，由 Blocking 清理本 Unit 的关系，而不是由 HP 写入或全场扫描提前推断死亡。已有 Lifetime 结算时，remove 返回只保证请求／Prepare，Completed 不承诺目标全部离场 Finalize 已完成；没有活动结算时，remove 在当前调用内完成 drain。伤害通知保留本次已发生事实，响应按需要读取最新资格。这是项目结算契约，不作为新原生调查结论；特殊生命干预的其余协议仍见第 3.2 节。

真实离场沿用 [Lifetime 偏序](lifetime.md)：请求发布 LEAVING，再派发能力自行登记的 prepare Hook 完成 Blocking 清理，通过 Lifetime 已登记的 owner 与 Scope 请求子项；子项整个 Finalize 返回后才注销 Unit，再执行本地 leave 与全局 leave，不在 Finalize 兜底扫描全场关系。Occupancy 清理已通知的旧配对，Deployable 本地 leave 归还实际占用；部署来源预装的死亡程序只响应已确认 DEATH，按 Card 策略处理费用阶段与库存恢复。主动撤退由对应领域操作在请求离场前直接结算退款、Card 费用阶段与库存恢复，不由 Damage 或通用 Unit 推导部署业务。成功保护、替身或复活是否进入真实离场由对应机制决定。资源时点见 [Deployment](deployment.md)。

## 4. Healing 的两阶段契约

普通治疗沿用 Damage 的状态接续与派发结构，但不引入伤害类型、穿透、防御公式或默认死亡处理。

普通 HP／EP 治疗的原生公式、共享与专属事件、满血回复及具体治疗内容顺序见[治疗结算调查](../research/cases/29-hp-and-ep-healing-settlement.md)。调查不改变本章已确认的项目规则或直接规定统一领域接口。

```typescript
interface HealingParameters {
    readonly power: number;
    readonly multiplier: number;
}

interface Request {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly parameters: HealingParameters;
}

interface Calculated {
    readonly amount: number;
}

calculateHealing(battle, request): Result<Calculated | undefined>;
applyHealing(request, calculation): Result<Outcome>;
```

Calculate 依次派发来源 Formula、目标 Formula，将当前 power 与 multiplier 相乘，再派发来源数值 Output。Request 始终表示初始事实，当前 Parameters 与 Output 数值逐项接续。初始负 power 按零处理；每个完成阶段的最终数值必须有限且非负。目标缺失、LEAVING 或 HP 为零时无法计算，已完成的状态前缀仍返回。

Apply 对最终计算量为零的治疗在入口返回 REJECTED，不派发本笔接收与 Applied。正数治疗确认目标当前存在、PRESENT 且 HP 大于零，按第 1 节的接收与提交边界执行，读取最新 HP、MaxHP 截断恢复量并提交；该 HP 发布不附带 Blocking 维护。随后依次派发 targetApplied 与 sourceApplied，即使来源与目标为同一 Unit 也分别执行；Completed 保持同一宿主不重复通知。HP Healing 不另设 ReceivingStarted。来源缺失或 LEAVING 时不运行其 Hook，但不因此取消仍可作用于有效目标的已采样治疗。

结果与 Damage 使用相同的 REJECTED、CANCELLED、UNAVAILABLE、APPLIED 区分。Pending 保存 amount 与可空 cancellation；取消不停止剩余 Receiving Hook。Application 保存 hpBefore、hpAfter、hpGain，后续嵌套业务不追溯修改这次恢复事实。Received amount 与实际 hpGain 分开；完整恢复量不在 Calculate 提前按缺失 HP 截断。

**满血不自动拒绝正数治疗。** 普通索敌是否排除满血对象由选择器决定；已明确目标的正数治疗仍经过正常 Hook，可形成 APPLIED、hpGain 为零。事件 HEAL 只携带目标、实际恢复量和发生 Tick，取消保留零值表现；接收量与取消报告通过 Outcome／Application 返回。普通治疗不能复活 HP 为零的对象。

### 4.1 治疗不可选中是项目选择

**healFree 只限制治疗目标选择，不是 Healing 的接收免疫。** 该 Effect 在 Targetable 登记限制贡献，按 Request 显式声明的 HEAL 用途判断。特殊 Filter 可以在 allowsRestrictions 中按 healFreeKind 对本次查询豁免；Request 与 HEAL Operation 不携带该开关。阻挡关系不隐式豁免本次 Filter 中的限制检查。

显式 Ref 治疗不重新检查 Targetable、索敌距离、满血筛选或选择排序。泥岩自疗与普通直接治疗使用相同 API，照常参与治疗修正及响应，不需要特设绕过开关。已选中后目标变为不可被治疗选中，不撤销已经明确目标的治疗；具体内容如有中断要求，自行重新验证或取消行动。

这个政策有意区别于官方 HEAL_FREE 同时影响选中和接收的组合，不以恢复原生双重检查作为修复目标。单纯不可选中不能推导出无法恢复 HP；真正需要取消治疗的机制由具体 Effect 的 Receiving Hook 表达。

### 4.2 特殊恢复机制

再生、生命复原与特殊 HP 恢复的修正、通知和统计语义尚待核对，不混入普通请求，也不提前新增恢复模式或入口。

## 5. 未完成的机制设计

实际内容对扩展时点与事件粒度的要求见[伤害 Hook 需求调查](../research/cases/28-damage-hooks-and-event-granularity.md)。该调查区分必要语义机会与独立公共 Hook，不代替本章已确认的项目政策。

- **死亡清理**：普通 Damage 同步确认死亡并请求离场，Finalize 遵循 Lifetime 的最外层完成边界；全场扫描的位置及绕过 Damage 的致死操作如何完成清理，尚未定案。扫描保留，不以此改变普通 Damage／Healing 时序。
- **特殊 HP 修改**：暂定绝大多数伤害进入 Damage，少数 Effect 可以直接修改 HP 以绕过普通受击，负责读取最新状态并遵守 HP 范围。暂不新增 HpTransition、setHp 或另一套通用管线；这项政策不决定死亡扫描与离场时点。
- **伤害分类**：AttackType、ApplyWay 等描述本次伤害的固有分类，不能从目标状态或来源单位类型反推。具体字段尚未确定；是否需要表达以可观测游戏语义为准，不以现有消费者或客户端同名枚举为准。不预设 DamageAttributes、DamageAttribution、DamageMode 或通用 Flags。无视闪避、取消限制、非致命、生命流失的表达仍需对应机制审查；分担和特殊生命机制也不属于普通主路径。
- **受伤与 HIT 回复资格**：毒性雾霾、血雾等需要受伤响应但不提供普通受击 SP。元素爆发默认周期配置的阻回规则有效；自定义周期配置在不阻回时抑制 HIT 回复的差异仍待处理。暂不为这些特例向 Request 增加 triggersHitRecovery／ignoreForSp 或替代调用上下文。
- **指定 Hook 禁用**：保留需求，待具体机制明确资格和作用范围后设计。

特殊机制的客户端事实、PRTS 说明与项目选择分别记录在[机制研究](../research/cases/11-damage-apply-and-hp-application.md)，不将未经确认的细节视为普通核心契约。
