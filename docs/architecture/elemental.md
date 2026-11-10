# Elemental

Elemental 负责元素值的接收、资源提交、爆发触发与恢复预算；EP Damage／Healing 的 Calculate／Apply 由 Battle 编排。整轮 Burst 由 Core 标准效果库的 Effect 承载，复用 Effect 的身份、状态、时间推进与 Lifetime。标准爆发程序实现 HP 伤害、控制、属性变化和周期输出，Data 提供数值配置，Content 通过公开接口实现特殊单位机制。当前四型为 NEURAL、EROSION、BURN、NECROSIS；狂躁尚未接入。

Unit Definition 直接关联共享的 Elemental Definition。bursts 按元素类型映射到实际的 Burst Effect Definition；Data 选择 Core 提供的具体 Effect 并传入数值，不编写爆发执行回调。

公开类型、查询和业务操作从 [elemental/index.ts](../../src/core/unit/capability/elemental/index.ts) 导入，包括只读的 available。Capability 的 Rule、Hook 与属性贡献 set／remove 不接收 Ref，返回 `Change<Unit & Elemental>`，交给 Unit.update 登记。资源提交复用对应业务的 CommitContext，爆发与恢复等操作保持 BattleState 协议，状态写回使用 Core 内部的 Unit.replace；query.ts 负责查询。

## 关键语义

- EP 提交、burstStarted、onInstall 的一次性爆发输出、damaged、Battle Applied 依次发生。零恢复预算仍执行安装业务，随后由通用 Effect 安装流程正常结束，不补发周期输出。
- 恢复进度只保存在根 Effect 的 DURATION expiration。根的 rate 为零，内容 onTick 按当前恢复速度推进同一 elapsed；Elemental 写回四型真实 EP，恢复进度通过 Effect.setExpiration 提交，周期业务前两项均已完成；自然到期交给 Effect 框架。
- 神经眩晕使用独立期限，不绑定根恢复时间；永久侵蚀减防与剩余麻痹也独立保留。灼燃减抗、封技与阻回依赖根结束。
- 最后一次正常推进先结算预算内周期业务，再结束；取消、提前完成与离场不补未来输出。时间协议由 Effect 集中验收，Elemental 只验证这些资源与业务结果。

## 1. 能力与定义

[capability.ts](../../src/core/unit/capability/elemental/capability.ts) 的 Definition 为：

```typescript
interface Definition {
    readonly maxEp: number;
    readonly recoverySpeed: number;
    readonly elementResistance: number;
    readonly damageResistance: number;
    readonly burstRecoverySpeed: number;
    readonly bursts: Readonly<Record<Type, BurstDefinition>>;
}
```

元素 Type 是字符串字面量联合，同名的 as const 对象提供 Type.NEURAL 等运行时常量，联合类型与 ELEMENT_TYPES 均从该对象导出；接口接受对应字面量。Data／Content 直接提供完整静态 Definition；Data 按接收者类别选择 bursts 表，Core 通过 `definition.elemental.bursts[type]` 取得实际 Effect Definition。initialize 作为能力构造入口，校验基础数值和各型爆发时长，再建立初始状态；Definition 与 bursts 共享原引用。内部计算信任已建立的配置与能力配对。

四条 EP 分别保存数值，共用基础上限、自然回复速度与抗性。Definition 的 recoverySpeed、同名贡献与查询统一表示每秒回复的 EP，推进时除以 TICKS_PER_SECOND。elementResistance 用于 EP 损伤，damageResistance 用于 HP 元素伤害；两个结算入口和两个属性各自独立。两项抗性在贡献求值后限制到 0–100；5% 损伤保底属于各自的伤害公式，不改变抗性查询结果。回复与爆发恢复速度不小于零，上限不小于 1。

| State 字段 | 含义 |
| --- | --- |
| ep | 四型当前 EP，可以保存小数；初始化为基础上限 |
| burst | 当前标准 Burst Effect 的 Typed Ref，或 null；同一宿主至多一个 |
| maxEp／recoverySpeed／elementResistance／damageResistance／burstRecoverySpeed | 五个属性的 Contribution |
| damageReceiving | 抗性计算后、本次提交前的 DamageReceivingHook，逐项接续 battle 与 Pending |
| damageRules／healingRules | 损伤／回复各自的接收许可登记 |
| damaged／healed／burstStarted／burstEnded | 各明确业务事实的 Hook |

属性 Contribution 的动态 Input 为 `(battle, self) => readonly attribute.Modifier[]`。属性修正、资格 Rule、伤判和事实通知分别承担自己的职责。请求类型相关的减免通过 DamageReceivingHook 读取 calculated.type 并返回新 Pending，不复制四组基础抗性，也不在布尔 Rule 中执行副作用。

能力组合由内容装配决定。内容中的干员与地面敌人默认同时提供 Vitality 和 Elemental；Core 的 Unit 允许明确组合所需能力。免疫不通过删除 Elemental 表达。CHARACTER／ENEMY 仅用于 Data 选择两套具体 Effect 映射，不进入 Core 接收者枚举，也不由当前阵营推导。

## 2. Burst Effect 与标准规则

标准爆发的具体 Effect 程序位于 `core/effects/elemental/`；通用控制位于 `core/effects/control.ts`。Elemental Capability 负责 EP、爆发触发与当前引用，通用实例管理归 `core/unit/effect/`。完整范围和按需实现原则见[标准效果库](effect.md#10-标准效果库与候选范围)。

标准爆发组装 HP 伤害请求的共享程序位于 `effects/elemental/damage.ts`，由具体效果调用 Battle 的 Calculate／Apply；Elemental Capability 不承担 HP 伤害输出。

[burst.ts](../../src/core/unit/capability/elemental/burst.ts) 定义共同的 Burst 类型、进度、EP 恢复与结束收尾；[neural.ts](../../src/core/effects/elemental/neural.ts)、[erosion.ts](../../src/core/effects/elemental/erosion.ts)、[burn.ts](../../src/core/effects/elemental/burn.ts)、[necrosis.ts](../../src/core/effects/elemental/necrosis.ts) 分别实现神经、侵蚀、灼燃和凋亡的具体标准 Effect。其 state 只保存元素类型：

```typescript
interface BurstState {
    readonly type: Type;
}

type Duration = Extract<Expiration, { type: "DURATION" }>;

interface Burst extends Effect<BurstState, Elemental> {
    readonly expiration: Duration;
}
```

Core 提供八个具体 Effect：神经眩晕／麻痹、物理／元素侵蚀、法术／元素灼燃，以及消耗 SP／恢复攻击力的凋亡。每个实现接收自身所需的数值参数。Data 在模块初始化时传入数值，构建并保存完整静态 Definition，爆发时查表复用。initialize 返回 `{ type }`，state 只保存元素类型。BurstDefinition 是普通 Effect Definition 加共同的只读 durationTicks 恢复预算；onInstall 接收尚未初始化时间的普通 Effect，以此预算建立 DURATION 后形成 Burst，后续程序在领域回调边界恢复该类型。Burst 的 Typed Ref 保留 DURATION 写入约束；expiration 是恢复、周期边界与攻击力恢复共用的唯一进度。

Burst 的 id、host、source、enabled、lifecycle 由 Effect 提供，Elemental 的 burst 槽位只保存它的 Typed Ref。`ref(self)` 复用 Effect Ref，地址为 host + Effect ID；没有独立 Burst ID 分配器或 Lifetime。旧引用不能操作后来的爆发。来源引用保存历史身份，不要求来源仍在场，也不隐含生命周期绑定；跨 Battle 使用 Ref 仍属于调用契约错误。

[data/arknights/elemental.ts](../../src/data/arknights/elemental.ts) 保存原始类型映射、八套数值和具体 Effect 的选择表。通用 EP 的 Calculate／Apply／Commit 通过映射调用对应 Effect；共享函数只处理进度、EP 恢复和结束收尾。通用控制实现在 [effects/control.ts](../../src/core/effects/control.ts)，Content 直接复用；通用 Effect 引擎不解释元素规则。

需要随该次爆发结束的产物通过 `scope(effects.lifetime, ref)` 绑定根 Burst Effect：灼燃减抗、封技、阻止 SP 回复等在根实例结束时清理。新依赖的资格由 Effect Lifetime 的可用性判断。

神经眩晕由独立的 stunDurationTicks 配置建立 DEADLINE，不绑定根恢复时间；Data 明确配置恢复十秒与眩晕十秒，二者不是同一个事实。零眩晕期限使用通用安装到期处理，不启用控制。永久侵蚀减防和冷却结束后尚未消费的麻痹也具有独立生命周期，不绑定根实例。永久性由侵蚀规则决定，不由减防数值的正负推断；再次神经爆发时按标准规则重置尚存麻痹的层数。

## 3. 查询、结算与资源提交

EP 损伤与治疗分别通过 [damage/ep/index.ts](../../src/core/battle/damage/ep/index.ts) 和 [healing/ep/index.ts](../../src/core/battle/healing/ep/index.ts) 使用两阶段接口。Damage／Healing 顶层仅导出 hp、ep 命名空间。Calculate 形成输出，Apply 才开始接收；零计算输出在 Apply 入口拒绝，零实际变化允许成功。完整边界见 [Vitality／Elemental 接口](vitality.md#18-接收与资源提交接口)。

EP Damage.Request 为 `{ source, target, parameters }`，Parameters 为可变工作值 `{ type, power }`，Calculated 保存公式确定的 `{ type, amount }`。先来源 Formula、再目标 Formula，然后按当前元素损伤抗性计算数额，最后执行来源 Output。令 `power = max(0, parameters.power)`，基础公式为 `max(power × 0.05, power × (1 - elementResistance / 100))`；抗性有效值在 0～100，即使达到 100，基础公式仍保留 5%。Output 可以继续将数额降到保底以下，不在它之后再次套用保底。之后的状态变化不使 Apply 重算；实际元素类型来自 Calculated，不用初始 Request.parameters.type 代替。

EP Healing.Request 同样为 `{ source, target, parameters }`，Parameters 为 `{ power }`，Calculated 为 `{ amount }`。它经过自己的 Formula／Output，不应用元素损伤抗性。两种 EP Calculate 均从原始 Parameters 开始，不对负数 power 单独抛异常；按[共同输出约束](vitality.md#1-calculate-与-apply-的语义边界)，在 Output Hook 全部执行后将最终输出截为非负数，零输出由 Apply 拒绝。

| 接口 | 形状与结果 |
| --- | --- |
| damage.ep.calculateDamage | `(battle, request) => Result<Calculated \| undefined>` |
| damage.ep.applyDamage | `(request, calculation) => Result<Outcome>` |
| healing.ep.calculateHealing | `(battle, request) => Result<Calculated \| undefined>` |
| healing.ep.applyHealing | `(request, calculation) => Result<Outcome>` |
| canReceiveDamage | `(battle, request, type = request.parameters.type) => boolean`；资格查询不要求 Calculated |
| canReceiveHealing | `(battle, request) => boolean` |
| receiveDamage | `(battle, context: damage.ep.ReceivingContext, pending) => Result<Pending>` |
| commitDamage／commitHealing | `(battle, context: 对应业务的 CommitContext) => Result<对应资源报告>` |
| finish／cancel | `(battle, ref: Ref<Burst>, reason?) => BattleState`；finish 不接收原因 |
| advance | `(battle, host: Ref<Unit & Elemental>) => BattleState`；Runtime 专用，只推进无 Burst 时的自然 EP 回复 |
| get | `(battle, ref: Ref<Burst>) => Burst \| undefined` |
| resolveMaxEp／resolveRecoverySpeed／resolveElementResistance／resolveDamageResistance／resolveBurstRecoverySpeed | `(battle, self: Unit & Elemental) => number` |
| resolveDamageRatio | `(battle, self: Unit & Elemental) => number`，使用有效 MaxEP |
| currentType／damageRatio | `(self: Unit & Elemental, maxEp: number)`，显式接收有效上限，不回落到静态 Definition |
| available | `(self: Unit & Elemental) => boolean`，已知 Elemental 宿主的基础生命周期与生命资格查询，不包含空间存在性 |

接收要求宿主生命周期为 PRESENT，具有 Vitality 时 HP 大于零。Burst 存在期间，包括 ENDING，拒绝损伤和治疗；中立阵营默认拒绝损伤。Rules 声明 damageRules／healingRules 两个数组，State 直接继承 Rules、Contributions、Hooks。damageRules 使用 `allows(battle, { self, request, type })`，type 是本次实际元素类型；healingRules 使用 `{ self, request }`。两者均由普通登记工厂生成的 `setRule(key, rule)`／`removeRule(key, id)` 修改，key 与对应 Context 类型配对。无敌通过 damageRules 拒绝，不查询 Vitality 内部接收规则；HP 禁疗不隐式决定 EP 接收。[Presence](presence.md) 同样通过 damageRules 拒收消失宿主的普通 EP 损伤，不直接限制显式回复、自然回复或 Burst 推进；普通索敌仍独立检查空间存在。

Targeting 的 elementDamage／elementHealing 是 Query 谓词，检查 Elemental 能力、当前可用性、Burst、阵营与目标侧限制；elementHealing 还要求有 EP 恢复需求。候选选择不构造完整结算请求、不执行接收 Rule 或 Hook；实际 Apply 仍按真实 Request 检查。类型守卫保留输入能力并增加 Elemental 证明，保存 Ref 时延续该证明。普通 HP 行动附带 EP 输出，不自动套用 EP 候选条件。

Elemental 定义两种资源报告：

```typescript
interface DamageApplication {
    readonly type: Type;
    readonly epBefore: number;
    readonly epAfter: number;
    readonly epLoss: number;
    readonly burst: Ref<Burst> | null;
}

interface HealingApplication {
    readonly epBefore: Values;
    readonly epAfter: Values;
    readonly epGain: Values;
}
```

Damage 的 before／after／loss 描述本次元素类型，Burst 身份描述本次创建事实；治疗对四型各应用完整接收量，分别限制到当前上限，不在四型间分摊。某型 EP 耗尽时同步将四型 EP 置零并创建 Burst。动态上限贡献本身不立即改写 EP；后续资源操作和自然回复按最新上限结算，爆发恢复则按最新上限与当前有效进度回填。

报告在写入时采样；Battle 的 Application 直接引用同一类型，并放入 APPLIED Outcome。Outcome 统一以 type 判别：损伤有 REJECTED／CANCELLED／UNAVAILABLE／APPLIED；EP Healing 没有取消工作值阶段，只提供 REJECTED／UNAVAILABLE／APPLIED。成功但实际变化为零时，仍输出 amount 为零的 ELEMENTAL_INJURY／ELEMENTAL_INJURY_HEALED，Battle 仍派发通用 Applied；能力 damaged／healed 只通知实际变化大于零的业务。自然回复不经过该成功输出路径。

## 4. Hook、提交事实与同步重入

通用 Formula、Output、BeforeReceive、BeforeCommit、targetApplied、sourceApplied 存于 [Unit.hooks](hook.md)，由对应 Battle 子域定义键与派发。基础目标资格成立后执行 beforeReceive，再读取最新 Rule；取消、失效及已提交结果按各业务 Outcome 表达。

Elemental 仅保存专属 DamageReceivingHook 和实际资源／Burst 通知，统一由 Hooks 分组声明。专属接收使用 `setHook("damageReceiving", hook)`／`removeHook("damageReceiving", id)`，与事实通知共用普通登记工厂并返回 Change。接收 Context 固定 `{ target, request, calculated }`，工作值为 Pending；取消后仍派发后续 Hook，但保留已有取消及原因。全部接收 Hook 完成后，receiveDamage 将最终 amount 截为非负数，再交给 Battle 构造 CommitContext；BeforeCommit、资源提交及报告使用同一份接收量，零接收量仍可成功。中间各 Hook 不单独截零。领域 cancel 构造函数封装类型断言，取消保持约束由类型表达。EP Healing 没有专属 Receiving，不导出取消构造器。

事实通知固定 `{ host, event }`，T=void；以下 event 在资源写入或生命周期转移处确定：

| Hook | 载荷与时点 |
| --- | --- |
| damaged | `{ request, ...DamageApplication }`；本次实际 EP 损失大于零，已经提交 |
| healed | `{ request, ...HealingApplication }`；显式恢复至少一型 EP，已经提交 |
| burstStarted | 已登记并写入槽位的 Burst Effect，表示创建事实；一次性爆发输出尚未执行 |
| burstEnded | `{ burst, end }`；依赖已清理、EP 已重置且槽位已清空，根 Effect 随后由通用流程移除 |

EP 损伤的爆发分支在同一次 commitDamage 内按以下顺序执行：

```text
提交本次 EP 扣减并将四型归零，记录 ELEMENTAL_INJURY
→ effects.install 登记标准 Burst Effect 及 Unit owner
    → onInstall 写入 Elemental 的 Burst 引用，再通过 Effect.setExpiration 提交 DURATION { elapsed: 0, total: durationTicks, rate: 0 }
    → 记录 ELEMENTAL_BURST，派发 burstStarted
    → 重新读取该次爆发实例，仍可执行时运行一次性爆发输出
    → 通用安装流程处理到期；未到期时启用持续输出
→ damaged
→ 返回固定资源报告
→ Battle 的 targetApplied、sourceApplied
```

一次性产物与即时伤害属于 onInstall；根自身可撤销的持续属性贡献由 onEnable／onDisable 管理。Apply 不在 Commit 返回后补做爆发业务。非爆发分支的实际损伤只派发 damaged；显式回复继续通过 healed 通知资源变化，二者不与 Battle Applied 合并。

通用 Effect 在 onInstall 完成后检查到期，因此零预算仍产生即时伤害和独立产物，随后正常结束并通知 damaged。尚存麻痹、永久减防与独立眩晕继续遵守自己的生命周期，临时派生输出随根清理；根自身的持续贡献不经历启用。

burstStarted 可以同步取消该次爆发 Effect；随后 damaged 和适用的 Battle Applied 仍报告已经发生的提交，该实例的启动输出不执行。后续嵌套业务不重算外层报告。无活动 Lifetime 结算时，取消可以使 burstEnded 嵌套完成；有活动结算时等待 Finalize。当前对象、资格与 Hook 登记在完整业务返回后从最新 BattleState 查询，明确采样的数值和原 Ref 继续使用，不误操作后来创建的爆发实例。

## 5. 完整结束与离场

Burst 的结束复用 Effect Lifetime，先同步请求，再由最外层结算器完成 Finalize：

```text
登记 Pending，Effect → ENDING
→ 已启用时 onDisable 撤销持续输出，结束依赖 Effect
→ 所有依赖者完整 Finalize 后执行根 Effect.onEnd
    → 四型 EP 重置到宿主最新有效上限
    → 清空 Elemental 的 Burst 引用
    → 派发 burstEnded
→ 通用 Effect 流程移除根实例并注销 Lifetime 关系
```

ENDING 期间仍占用爆发槽位，重复请求不覆盖首次原因或重复清理。嵌套结束返回不保证 EP 已重置、槽位已清空或 burstEnded 已派发。Unit 所有权保证宿主直到根 Effect 整个 Finalize 返回才可注销；资源收尾直接使用当前宿主，不以旧快照兜底。

burstEnded 表示 Elemental 侧资源收尾完成，触发时根 Effect 仍为 ENDING，随后才从 Effect 容器移除。该通知可以创建下一次爆发；通用 Finalize 接续最新 Unit，仅移除旧 Effect ID，不覆盖新槽位。

正常完成与取消都在宿主仍存在时重置 EP，显式在场取消也采用相同政策。重置属于结束操作，不派发 healed。End 保留 FINISHED 与携带 reason 的 CANCELLED 语义，并用于通知及依赖清理；Effect 自然到期映射为 FINISHED。恢复进度由 UI 查询当前 expiration，不输出自然恢复完成或爆发结束的诊断 Event。

Unit 请求离场发布 LEAVING 后，通过所有权边自动结束根 Burst Effect。Unit 等待它与其他依赖者整个 Finalize 后才注销和派发 leave；离场入口不手动取消爆发，也不提前清空 burst 或依赖集合。

## 6. 时间推进

原生恢复顺序与 EP 写回的证据见[案例 25](../research/cases/25-elemental-burst-recovery-timing.md)。Core 采用固定步长的全场阶段调度，按项目语义尺度忽略创建时点造成的帧内微时序差异，不增加创建 Tick 跳过或 lastAdvancedTick。

根 Burst Effect 的 onTick 是唯一爆发推进入口。expiration 保存唯一有效进度，rate 固定为零，通用自动推进不另加一份时间。对正时长配置，每次宿主获准推进时，内容程序按当前 burstRecoverySpeed 计算 expiration.elapsed，并按最新有效上限回填全部 EP。Elemental 先提交 EP，再通过 Effect.setExpiration 提交恢复进度；两项在周期业务前均已完成：

```text
elapsed' = min(duration, elapsed + currentBurstRecoverySpeed)
allEP = currentMaxEP × elapsed' / duration
```

恢复期间四型 EP 会逐步回填，不一直保持零值到结束；Burst 槽位存在期间仍拒绝新的 EP 损伤和显式回复。速度为零或宿主暂时不具备推进资格时暂停，后续只推进当前一步，不积攒补算。动态上限与恢复速度在各次实际推进时重新求值。

同一份有效进度决定跨过的周期边界与凋亡攻击力恢复。内容程序完成预算内最后一次周期业务后返回，通用 Effect 框架按最新 expiration 处理自然到期；取消、提前 finish 或宿主离场不补未来输出。周期业务由根 Effect 的同一进度调度，onEnd 只负责资源收尾。

Elemental 的 Runtime 推进只负责无 Burst 时的自然回复，量为 `当前 recoverySpeed / TICKS_PER_SECOND`，保留小数，不派发显式 heal 的 healed Hook 或普通治疗通知。按当前有效 MaxEP 完成归一化与回复后，四型 EP 均未变化则返回原 BattleState；速度为零仍需处理上限降低。Effect 与自然回复分别由既有调度阶段安排；阶段之前创建的实例可以参与当次推进，阶段之后创建的实例等下一次候选，不新增首 Tick 特判。

Core 同一宿主只允许一个 Burst。少数多种元素爆发的特殊内容由 Content 组合输出和生命周期，Core 不提供通用多阶段爆发或启动免疫窗口。标准库覆盖上述四型，不包含狂躁及其余角色专属爆发。

### 必要回归场景

- 以有效抗性达到 100 的代表场景同时核对属性查询、HP 元素与 EP 的独立公式：5% 保底在基础公式产生，随后正常执行 Output；计算结果保留采样事实。
- 标准灼燃验证 EP 中间值、动态上限与速度、暂停和根结束后的临时减抗撤销；通过回填量与完成时点验证恢复预算，不在夹具重写计时算法。
- 零恢复预算验证即时伤害和独立眩晕／永久减防仍发生，四型 EP 写满并清槽，凋亡不产生未来周期输出。
- 正常完成包含预算内最后一次周期业务；取消或启动回调中结束根后不继续输出。既定 burstStarted、damaged 与 Battle Applied 时序继续由现有集中场景保障。
