# Vitality、Damage 与 Healing 设计

Vitality 保存 HP、MaxHP、DEF、RES，以及伤害与治疗的 Hook 登记和伤害接收规则。`battle/damage/`、`battle/healing/` 提供普通伤害与治疗的完整操作，复用[公共 Hook 契约](functional-core.md#6-hook-和生命周期的纯契约)。

上层分别从 [vitality/index.ts](../../src/core/unit/capability/vitality/index.ts)、[damage/index.ts](../../src/core/battle/damage/index.ts) 与 [healing/index.ts](../../src/core/battle/healing/index.ts) 导入公共契约。Damage／Healing 保持 Calculate／Apply 两阶段；Hook 登记与公开类型可由入口取得，内部 dispatch 不公开。

普通 Damage 覆盖物理、法术、真实与元素 HP 伤害。特殊生命机制、伤害分类和死亡扫描等未完成设计分别保留在第 3.2、4.2、5 节，不作为普通主路径的占位字段。

## 0. Vitality Capability

`vitality/capability.ts` 提供定义、初始化和属性 Change 工厂，`vitality/query.ts` 提供依赖战场的防御查询；DEF／RES 属于 Vitality，不构成独立 Capability。

```typescript
interface Definition {
    readonly maxHp: number;
    readonly defense: number;
    readonly resistance: number;
}

initialize(battle, definition): Result<State>;
setMaxHpContribution(ref: Ref<Unit & Vitality>, entry): Change;
removeMaxHpContribution(ref: Ref<Unit & Vitality>, id): Change;
resolveMaxHp(state, definition): number;
setDefenseContribution(ref: Ref<Unit & Vitality>, entry): Change;
removeDefenseContribution(ref: Ref<Unit & Vitality>, id): Change;
setResistanceContribution(ref: Ref<Unit & Vitality>, entry): Change;
removeResistanceContribution(ref: Ref<Unit & Vitality>, id): Change;
resolveDefense(battle, ref: Ref<Unit & Vitality>): DefenseValues | undefined;
```

基础 MaxHP、DEF、RES 全部必填，由 initialize 校验为有限非负数，可以是小数。初始 HP 为 `Math.max(1, definition.maxHp)`，有效 MaxHP 的下限为 1。基础 RES 可以超过 100，有效值在属性修正后限制到 0～100；有效 DEF 的下限为 0。普通 HP 使用 0～有效 MaxHP 的范围，不在每次计算后取整。

MaxHP 保留静态 Modifier[]，set／remove 工厂返回 Change，在纯 transform 中同步维持 HP 比例，零 HP 不因属性变化复活；不附带治疗通知或 Blocking 后继。DEF／RES 的 Input 为静态修正或 `(battle, self: Unit & Vitality) => readonly Modifier[]`，对应工厂也绑定 Ref 返回 Change。resolveDefense 从最新 battle 读取对象，缺失返回 undefined；Damage 在 Formula Hook 后读取，不提前缓存或混入穿透。

HP、Contribution、Hook 与 Rule 共存于同一 Vitality State。DEF／RES 的修改保留其他字段；属性变化不派发普通治疗 Hook。治疗索敌默认 provider 与显式注入 provider 均读取有效 MaxHP，避免把基础值或未计修正的上限用于缺血判定和比例排序。

## 1. 计算与实行

伤害分为 `calculate` 和 `apply` 两步，均为显式接续 BattleState 的纯状态转换，允许 Hook 参与。

| 阶段 | 职责 |
| --- | --- |
| calculate | 结算本次伤害的计算与输出修正，得到交给实行阶段的数值及业务数据；相关 Hook 可以修改本次结果并接续 BattleState。 |
| apply | 接收选定的计算结果，执行接收 Hook、伤判、生命变化及致死处理；接收阶段仍可以修改或取消本次伤害。 |

计算阶段不直接应用本次伤害的 HP 变化，但 Hook 发起的嵌套伤害、治疗、Effect 操作及生命周期业务正常进入其返回状态。实行阶段从传入的最新 BattleState 读取对象并确认当前资格。

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
CalculatedDamage
```

公式参数 Hook 依次包含来源和目标的干预。随后读取目标当前 DEF／RES 或元素伤害抗性，按当前类型计算基础公式，再执行来源的输出修正。CalculatedDamage 包含整个 Calculate 的结果。

Calculate 不实行本次伤害的 HP 变化。Formula／Output Hook 可以消费资源、推进 RNG 或发起独立 Operation，其状态逐项接续。闪避、护盾、屏障、接收减伤、同步反伤、受击治疗及死亡由 Apply 处理；反伤可以在外层伤害扣血之前发生。

防御属性在公式节点采样，之后的属性变化不会使 Apply 自动重算。Apply 重新读取生命周期、HP、Effect 和接收规则。

### 1.2 请求与计算参数

DamageRequest 携带发起时已经确定、接收方无法自行推导的必要事实，以及初始 DamageParameters。请求描述本次伤害，不提供配置内部执行步骤的开关。

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

type DamageParameters =
    | {
          readonly type: "PHYSICAL" | "ARTS";
          readonly attack: AttackParameters;
          readonly penetration: Penetration;
      }
    | {
          readonly type: "TRUE" | "ELEMENTAL";
          readonly attack: AttackParameters;
      };

interface DamageRequest {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly parameters: DamageParameters;
}

interface CalculatedDamage {
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
| 固定 Context | 原始 DamageRequest，其中 parameters 是初始参数。 |
| 动态 BattleState | 前一个 Hook 返回的最新战斗状态。 |
| 可接续 current | 前一个 Hook 返回的当前 DamageParameters。 |

Request 可以直接携带初始 Parameters，不必额外复制一份请求。Hook 通过返回新工作值修改参数，不能改写原始请求的历史含义。

例如 Request 初始类型为 PHYSICAL，Hook 将 current 转为 ARTS 后，后续依赖实际类型的筛选与公式读取 current.type；输出阶段使用公式阶段确定的类型，Apply 使用 CalculatedDamage.type。不能重新读取 Request 的初始类型来代表后续阶段的实际类型。

### 1.4 跨阶段载荷

CalculatedDamage 只保存最终伤害类型与计算后数值；来源、目标和初始事实通过单独传入的 DamageRequest 保留。不保存目标当前 HP、DEF／RES 或 Effect State 的快照。已计算的数值保留其采样意义；后续业务需要当前对象状态时，从最新 BattleState 查询。

跨阶段仅传递 Calculate 已确定、Apply 实际需要的事实。具体业务需要跨越 Projectile 或 Calculate／Apply 保存的性质时，必须明确采样时点、作用范围与输入通道；不能以接收时查询来源代替历史采样，也不能仅以“由 Hook 实现”代替数据传递。

### 1.5 操作与结果

```typescript
calculateDamage(battle, request): Result<CalculatedDamage | undefined>;
applyDamage(request, calculated: Result<CalculatedDamage | undefined>): Result<DamageOutcome>;

type DamageOutcome =
    | { readonly kind: "REJECTED" }
    | { readonly kind: "CANCELLED"; readonly received: PendingDamage }
    | { readonly kind: "UNAVAILABLE"; readonly received: PendingDamage }
    | {
          readonly kind: "APPLIED";
          readonly received: PendingDamage;
          readonly application: ApplicationResult;
      };
```

Apply 接续计算返回的 state；调用间若有其他状态转换，调用者须把最新 state 接回计算 Result。计算失败返回 undefined 时保留已经完成的状态前缀，Apply 形成 REJECTED 并通知仍符合资格的 Completed 观察者。

Parameters Hook 使用固定 Request 和当前 DamageParameters；Output 使用固定 `{ request, type }` 和可修改的 number。Output 的 type 是公式阶段已确定的类型，输出 Hook 不重新分类或重算防御。

AppliedContext 保留 request、calculated、Receiving 最终 received 和本次 application；CompletedContext 保留 request、可能 undefined 的 calculated 和同一份 outcome。application 的 hpBefore／hpAfter／hpLoss 在普通 HP 写入处确定，不受之后治疗、嵌套伤害或离场影响。

Formula 分来源与目标两个节点，Output 属于来源，Receiving Started／Receiving 属于目标。HP Applied 和 Completed 依次通知目标与来源，同一宿主不重复通知。每个节点、每个宿主的派发独立固定候选 ID；目标响应中新登记的来源 Hook 可进入随后独立的来源派发。登记保存在 Vitality，使用 stage、priority 与 setHook／removeHook；同优先级保留登记顺序。

DAMAGE 事件的 amount 表示本次实际 HP 损失，receivedAmount 保留 Receiving 最终数值，cancellation 区分取消。取消后目标已被嵌套移除时仍记录事件，hp 为 null，不伪造当前生命快照。零数值输入在 Apply 入口 REJECTED，不进入普通受击回复；无敌等入口 Rule 拒绝也不进入 Receiving。取消不停止后继 Receiving Hook，次数盾自行筛除取消或非正数值；反伤可继续。

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

选中分支的状态、事件、RNG、ID 分配与 Hook 引发的嵌套业务一并接续；未选分支全部丢弃。不仅选取一个伤害数值，也不在选择之后重新计算一遍。只有选中分支进入 apply，实行阶段的 Hook 与本次 HP 应用执行一次。

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
| 结算完成 | 通过 DamageOutcome 观察拒绝、取消、失效或已应用的结果。 |

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

普通 Damage 提交 HP 后不维护 Blocking，先按目标、来源顺序完成全部 HP Applied 响应，再读取当前目标：仍为 PRESENT 且 HP 不大于 0 时才请求 Unit.remove，最后派发 Completed。既有关系的默认保持资格不因临时 HP 为 0 失效，保护响应恢复生命后可以保留原阻挡；新关系取得仍要求双方存活。确实离场时，由 Unit Lifetime 先发布 LEAVING，再显式释放该 Unit 的全部入向与出向关系，而不是由 HP 写入或全场扫描提前推断死亡。已有 Lifetime 结算时，remove 返回只保证请求／Prepare，Completed 不承诺目标全部离场 Finalize 已完成；没有活动结算时，remove 在当前调用内完成 drain。伤害通知保留本次已发生事实，响应按需要读取最新资格。这是项目结算契约，不作为新原生调查结论；特殊生命干预的其余协议仍见第 3.2 节。

真实离场沿用 [Lifetime 偏序](deployment.md#离场清理的偏序)：请求发布 LEAVING，明确释放本 Unit 的 Blocking 关系后执行 Prepare，通过所有权与 Scope 请求子项；子项整个 Finalize 返回后才注销 Unit、回收 Card、派发 leave，不在 Finalize 兜底扫描全场关系。成功保护、替身或复活是否进入真实离场由对应机制决定。

## 4. Healing 的两阶段契约

普通治疗沿用 Damage 的状态接续与派发结构，但不引入伤害类型、穿透、防御公式或默认死亡处理。

```typescript
interface HealingParameters {
    readonly power: number;
    readonly multiplier: number;
}

interface HealingRequest {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly parameters: HealingParameters;
}

interface CalculatedHealing {
    readonly amount: number;
}

calculateHealing(battle, request): Result<CalculatedHealing | undefined>;
applyHealing(request, calculation): Result<HealingOutcome>;
```

Calculate 依次派发来源 Formula、目标 Formula，将当前 power 与 multiplier 相乘，再派发来源数值 Output。Request 始终表示初始事实，当前 Parameters 与 Output 数值逐项接续。初始负 power 按零处理；每个完成阶段的最终数值必须有限且非负。目标缺失、LEAVING 或 HP 为零时无法计算，已完成的状态前缀仍返回。

Apply 依次确认目标当前存在、PRESENT 且 HP 大于零，派发 Receiving Started、有序 Receiving，重新确认生命周期与 HP，再读取最新 HP、MaxHP 截断恢复量并提交；该 HP 发布不附带 Blocking 维护。随后按目标、来源顺序派发 HP Applied 与 Completed，同一宿主不重复通知。来源缺失或 LEAVING 时不运行其 Hook，但不因此取消仍可作用于有效目标的已采样治疗。

结果与 Damage 使用相同的 REJECTED、CANCELLED、UNAVAILABLE、APPLIED 区分。PendingHealing 保存 amount 与可空 cancellation；取消不停止剩余 Receiving Hook。ApplicationResult 保存 hpBefore、hpAfter、hpGain，后续嵌套业务不追溯修改这次恢复事实。Received amount 与实际 hpGain 分开；完整恢复量不在 Calculate 提前按缺失 HP 截断。

**满血与零治疗不自动拒绝。** 普通索敌是否排除满血对象由选择器决定；已明确目标的治疗仍经过正常 Hook，可形成 APPLIED、hpGain 为零。事件 HEAL 的 amount 保持实际恢复量，receivedAmount 记录最终接收量，cancellation 记录业务取消；取消后目标被嵌套移除时仍记录事件，hp 为 null。普通治疗不能复活 HP 为零的对象。

### 4.1 治疗不可选中是项目选择

**healFree 只限制治疗目标选择，不是 Healing 的接收免疫。** 该 Effect 在 Targetable 登记限制贡献，按 Request 显式声明的 HEAL 用途判断。特殊 Filter 可以在 allowsRestrictions 中按 healFreeKind 对本次查询豁免；HealingRequest 与 HEAL Operation 不携带该开关。阻挡关系不隐式豁免本次 Filter 中的限制检查。

显式 Ref 治疗不重新检查 Targetable、索敌距离、满血筛选或选择排序。泥岩自疗与普通直接治疗使用相同 API，照常参与治疗修正及响应，不需要特设绕过开关。已选中后目标变为不可被治疗选中，不撤销已经明确目标的治疗；具体内容如有中断要求，自行重新验证或取消行动。

这个政策有意区别于官方 HEAL_FREE 同时影响选中和接收的组合，不以恢复原生双重检查作为修复目标。单纯不可选中不能推导出无法恢复 HP；真正需要取消治疗的机制由具体 Effect 的 Receiving Hook 表达。

### 4.2 特殊恢复机制

再生、生命复原与特殊 HP 恢复的修正、通知和统计语义尚待核对，不混入普通请求，也不提前新增恢复模式或入口。

## 5. 未完成的机制设计

- **死亡清理**：普通 Damage 同步确认死亡并请求离场，Finalize 遵循 Lifetime 的最外层完成边界；全场扫描的位置及绕过 Damage 的致死操作如何完成清理，尚未定案。扫描保留，不以此改变普通 Damage／Healing 时序。
- **特殊 HP 修改**：暂定绝大多数伤害进入 Damage，少数 Effect 可以直接修改 HP 以绕过普通受击，负责读取最新状态并遵守 HP 范围。暂不新增 HpTransition、setHp 或另一套通用管线；这项政策不决定死亡扫描与离场时点。
- **伤害分类**：AttackType、ApplyWay 等描述本次伤害的固有分类，不能从目标状态或来源单位类型反推。具体字段尚未确定；是否需要表达以可观测游戏语义为准，不以现有消费者或客户端同名枚举为准。不预设 DamageAttributes、DamageAttribution、DamageMode 或通用 Flags。无视闪避、取消限制、非致命、生命流失的表达仍需对应机制审查；分担和特殊生命机制也不属于普通主路径。
- **受伤与 HIT 回复资格**：毒性雾霾、血雾等需要受伤响应但不提供普通受击 SP。元素爆发默认周期配置的阻回规则有效；自定义周期配置在不阻回时抑制 HIT 回复的差异仍待处理。暂不为这些特例向 DamageRequest 增加 triggersHitRecovery／ignoreForSp 或替代调用上下文。
- **指定 Hook 禁用**：保留需求，待具体机制明确资格和作用范围后设计。

特殊机制的客户端事实、PRTS 说明与项目选择分别记录在[机制研究](../research/cases/11-damage-apply-and-hp-application.md)，不将未经确认的细节视为普通核心契约。
