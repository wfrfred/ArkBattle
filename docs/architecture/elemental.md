# Elemental 设计

Elemental 负责元素值的接收、资源提交与标准爆发规则；EP Damage／Healing 的 Calculate／Apply 由 Battle 编排。整轮 Burst 由本领域的标准 Effect 承载，复用 Effect 的身份、状态、时间推进与 Lifetime。Core 实现标准爆发造成的 HP 伤害、控制、属性变化和周期输出，Data 提供数值配置，Content 通过公开接口实现特殊单位机制。当前四型为 NEURAL、EROSION、BURN、NECROSIS；狂躁尚未接入。

Unit Definition 直接关联共享的 Elemental Definition。各型 BurstDefinition 是纯配置，不接收外部 onStart／onEnd 程序。

公开类型、查询和业务操作从 [elemental/index.ts](../../src/core/unit/capability/elemental/index.ts) 导入，包括只读的 available。Capability 的 Rule、Hook 与属性贡献 set／remove 绑定 Ref<Unit & Elemental> 返回 Change，交给 Unit.update 登记。资源提交复用对应业务的 CommitContext，爆发与恢复等操作保持 BattleState 协议，状态写回使用 Core 内部的 Unit.replace；query.ts 负责查询。

## 1. 能力与定义

[capability.ts](../../src/core/unit/capability/elemental/capability.ts) 的 Definition 为：

```typescript
interface Definition {
    readonly maxEp: number;
    readonly recoveryPerSecond: number;
    readonly elementResistance: number;
    readonly damageResistance: number;
    readonly burstRecoverySpeed: number;
    readonly bursts: Readonly<Record<Type, BurstDefinition>>;
}
```

Data／Content 直接提供完整静态 Definition，明日方舟的基础参数由 Data 选择。initialize 作为能力构造入口，校验基础数值和各型爆发时长，再建立初始状态；Definition 与 bursts 共享原引用。内部计算信任已建立的配置与能力配对。

四条 EP 分别保存数值，共用基础上限、自然回复速度与抗性。elementResistance 用于 EP 损伤，damageResistance 用于 HP 元素伤害；两个结算入口和两个属性各自独立。抗性有效值限制在 0–95，回复与爆发恢复速度不小于零，上限不小于 1。

| State 字段 | 含义 |
| --- | --- |
| ep | 四型当前 EP，可以保存小数；初始化为基础上限 |
| burst | 当前标准 Burst Effect 的 Typed Ref，或 null；同一宿主至多一个 |
| maxEp／recoverySpeed／elementResistance／damageResistance／burstRecoverySpeed | 五个属性的 Contribution |
| damageReceiving | 抗性计算后、本次提交前的 DamageReceivingHook，逐项接续 battle 与 Pending |
| damageRules／healingRules | 损伤／回复各自的接收许可登记 |
| damaged／healed／burstStarted／burstEnded | 各明确业务事实的 Hook |

属性 Contribution 的动态 Input 为 `(battle, self) => readonly attribute.Modifier[]`。属性修正、资格 Rule、伤判和事实通知分别承担自己的职责。请求类型相关的减免通过 DamageReceivingHook 读取 calculated.type 并返回新 Pending，不复制四组基础抗性，也不在布尔 Rule 中执行副作用。

能力组合由内容装配决定。内容中的干员与地面敌人默认同时提供 Vitality 和 Elemental；Core 的 Unit 允许明确组合所需能力。免疫不通过删除 Elemental 表达。CHARACTER／ENEMY 仅用于 Data 选择八套静态配置，不进入 Core 接收者枚举，也不由当前阵营推导。

## 2. Burst Effect 与标准规则

[burst.ts](../../src/core/unit/capability/elemental/burst.ts) 定义本领域的固定标准 Effect。其数据只保存元素类型与一份有效进度：

```typescript
interface BurstState {
    readonly type: Type;
    readonly elapsedTicks: number;
}

type Burst = Effect<BurstState, Elemental>;
```

Core 为四种元素一次性建立固定 Definition，initialize 返回真实初态 `{ type, elapsedTicks: 0 }`；每轮直接复用，不创建捕获本轮状态的 Definition。总时长和标准效果参数通过宿主不可变的 `definition.elemental.bursts[burst.data.type]` 取得，不另保存 remainingTicks、周期 Clock 或攻击力恢复 scaler。

Burst 的 id、host、source、enabled、status 由 Effect 提供，Elemental 的 burst 槽位只保存它的 Typed Ref。`ref(self)` 复用 Effect Ref，地址为 host + Effect ID；没有独立 Burst ID 分配器或 Lifetime。旧引用不能操作后来的爆发。来源引用保存历史身份，不要求来源仍在场，也不隐含生命周期绑定；跨 Battle 使用 Ref 仍属于调用契约错误。

BurstDefinition 只包含持续时间、即时或周期伤害、控制和属性修正等实际参数。配置类型归 Core，[data/arknights/elemental.ts](../../src/data/arknights/elemental.ts) 负责原始类型映射及八套数值。眩晕使用明确的 stun 配置，持续时间跟随本轮 Burst；不另提供没有独立语义的 stunTicks。通用控制 Effect 位于 [unit/control.ts](../../src/core/unit/control.ts)，Content 直接复用，通用 Effect 引擎不解释元素规则。

需要随本轮结束的产物通过 `scope(effects.lifetime, ref)` 绑定根 Burst Effect：眩晕、灼燃减抗、封技、阻止 SP 回复等在根实例结束时清理。是否允许新依赖沿用 Effect Lifetime 的可用性，不建立另一套 Burst 状态机。

永久侵蚀减防和冷却结束后尚未消费的麻痹具有独立生命周期，不绑定根实例。永久性由侵蚀规则决定，不由减防数值的正负推断；再次神经爆发时按标准规则重置尚存麻痹的层数。

## 3. 查询、结算与资源提交

EP 损伤与治疗分别通过 [damage/ep/index.ts](../../src/core/battle/damage/ep/index.ts) 和 [healing/ep/index.ts](../../src/core/battle/healing/ep/index.ts) 使用两阶段接口。Damage／Healing 顶层仅导出 hp、ep 命名空间。Calculate 形成输出，Apply 才开始接收；零计算输出在 Apply 入口拒绝，零实际变化允许成功。完整边界见 [Vitality／Elemental 接口](vitality.md#18-已定稿的接收与资源提交接口)。

EP Damage.Request 为 `{ source, target, type, power }`，Parameters 为可变工作值 `{ type, power }`，Calculated 保存公式确定的 `{ type, amount }`。先来源 Formula、再目标 Formula，然后按当前元素损伤抗性计算数额，最后执行来源 Output。抗性有效值在 0～95，之后的状态变化不使 Apply 重算；实际元素类型来自 Calculated，不用初始 Request.type 代替。

EP Healing.Request 为 `{ source, target, power }`，Parameters 为 `{ power }`，Calculated 为 `{ amount }`。它经过自己的 Formula／Output，不应用元素损伤抗性。

| 接口 | 形状与结果 |
| --- | --- |
| damage.ep.calculateDamage | `(battle, request) => Result<Calculated \| undefined>` |
| damage.ep.applyDamage | `(request, calculation) => Result<Outcome>` |
| healing.ep.calculateHealing | `(battle, request) => Result<Calculated \| undefined>` |
| healing.ep.applyHealing | `(request, calculation) => Result<Outcome>` |
| canReceiveDamage | `(battle, request, type = request.type) => boolean`；资格查询不要求 Calculated |
| canReceiveHealing | `(battle, request) => boolean` |
| receiveDamage | `(battle, context: damage.ep.ReceivingContext, pending) => Result<Pending>` |
| commitDamage／commitHealing | `(battle, context: 对应业务的 CommitContext) => Result<对应资源报告>` |
| finish／cancel | `(battle, ref: Ref<Burst>, reason?) => BattleState`；finish 不接收原因 |
| advance | `(battle, host: Ref<Unit & Elemental>) => BattleState`；Runtime 专用，只推进无 Burst 时的自然 EP 回复 |
| get | `(battle, ref: Ref<Burst>) => Burst \| undefined` |
| resolveMaxEp／resolveRecoverySpeed／resolveElementResistance／resolveDamageResistance／resolveBurstRecoverySpeed | `(battle, self: Unit & Elemental) => number` |
| resolveDamageRatio | `(battle, self: Unit & Elemental) => number`，使用有效 MaxEP |
| currentType／damageRatio | `(self: Unit & Elemental, maxEp: number)`，显式接收有效上限，不回落到静态 Definition |
| available | 已知 Unit 的基础在场、空间存在与生命资格查询 |

接收要求宿主在场且空间存在，具有 Vitality 时 HP 大于零。Burst 存在期间，包括 ENDING，拒绝损伤和治疗；中立阵营默认拒绝损伤。Rules 声明 damageRules／healingRules 两个数组，State 直接继承 Rules、Contributions、Hooks。damageRules 使用 `allows(battle, { self, request, type })`，type 是本次实际元素类型；healingRules 使用 `{ self, request }`。两者均由普通登记工厂生成的 `setRule(ref, key, rule)`／`removeRule(ref, key, id)` 修改，key 与对应 Context 类型配对。无敌通过 damageRules 拒绝，不查询 Vitality 内部接收规则；HP 禁疗不隐式决定 EP 接收。

Targeting 的 elementDamage／elementHealing Filter 按当前候选构造完整请求并查询 canReceive；索敌不运行 Calculate，也不派发接收 Hook。没有 Elemental 的候选在过滤边界排除，后续 Typed Ref 保留该能力证明。elementHealing 另外要求当前存在元素损伤。普通 HP 行动附带 EP 输出，不自动套用元素接收条件。

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

报告在写入时采样；Battle 的 Application 直接引用同一类型，并放入 APPLIED Outcome。损伤有 REJECTED／CANCELLED／UNAVAILABLE／APPLIED；EP Healing 没有取消工作值阶段，只提供 REJECTED／UNAVAILABLE／APPLIED。成功但实际变化为零时，不派发能力 damaged／healed，Battle 仍派发通用 Applied。

## 4. Hook、提交事实与同步重入

通用 Formula、Output、BeforeReceive、BeforeCommit、targetApplied、sourceApplied 存于 [Unit.hooks](hook.md)，由对应 Battle 子域定义键与派发。基础目标资格成立后执行 beforeReceive，再读取最新 Rule；取消、失效及已提交结果按各业务 Outcome 表达。

Elemental 仅保存专属 DamageReceivingHook 和实际资源／Burst 通知，统一由 Hooks 分组声明。专属接收使用 `setHook(ref, "damageReceiving", hook)`／`removeHook(ref, "damageReceiving", id)`，与事实通知共用普通登记工厂并返回 Change。接收 Context 固定 `{ target, request, calculated }`，工作值为 Pending；取消后仍派发后续 Hook，但保留已有取消及原因。领域 cancel 构造函数封装类型断言，不新增运行时取消检查。EP Healing 没有专属 Receiving，不导出取消构造器。

事实通知固定 `{ host, event }`，T=void；以下 event 在资源写入或生命周期转移处确定：

| Hook | 载荷与时点 |
| --- | --- |
| damaged | `{ request, ...DamageApplication }`；本次实际 EP 损失大于零，已经提交 |
| healed | `{ request, ...HealingApplication }`；显式恢复至少一型 EP，已经提交 |
| burstStarted | 已登记并写入槽位的 Burst Effect，表示创建事实；标准效果尚未启用 |
| burstEnded | `{ burst, end }`；依赖已清理、EP 已重置且槽位已清空，根 Effect 随后由通用流程移除 |

EP 损伤的爆发分支在同一次 commitDamage 内按以下顺序执行：

```text
提交本次 EP 扣减并将四型归零，记录 ELEMENTAL_INJURY
→ effects.install(enabled: false)，登记标准 Burst Effect 及 Unit owner
    → onInstall 写入 Elemental 的 Burst 引用
    → 记录 ELEMENTAL_BURST，派发 burstStarted
→ damaged
→ effects.setEnabled(true)
    → 仍有效的本轮实例执行 onEnable，标准爆发立即生效
→ 返回固定资源报告
→ Battle 的 targetApplied、sourceApplied
```

分阶段启用复用现有 Effect 操作，为 damaged 保留资源提交后、标准爆发生效前的明确时点，不引入额外生命周期。Apply 不在 Commit 返回后补做爆发业务。非爆发分支的实际损伤只派发 damaged；显式回复继续通过 healed 通知资源变化，二者不与 Battle Applied 合并。

burstStarted 可以同步取消本轮 Effect；随后 damaged 和适用的 Battle Applied 仍报告已经发生的提交，本轮 onEnable 不执行。后续嵌套业务不重算外层报告。无活动 Lifetime 结算时，取消可以使 burstEnded 嵌套完成；有活动结算时等待 Finalize。当前对象、资格与 Hook 登记在完整业务返回后从最新 BattleState 查询，明确采样的数值和原 Ref 继续使用，不误操作后来创建的新一轮。

## 5. 完整结束与离场

Burst 的结束复用 Effect Lifetime，先同步请求，再由最外层结算器完成 Finalize：

```text
登记 Pending，Effect → ENDING
→ onDisable 撤销启用输出，结束依赖 Effect
→ 所有依赖者完整 Finalize 后执行根 Effect.onEnd
    → 四型 EP 重置到宿主最新有效上限
    → 清空 Elemental 的 Burst 引用
    → 派发 burstEnded
→ 通用 Effect 流程移除根实例并注销 Lifetime 关系
```

ENDING 期间仍占用爆发槽位，重复请求不覆盖首次原因或重复清理。嵌套结束返回不保证 EP 已重置、槽位已清空或 burstEnded 已派发。Unit 所有权保证宿主直到根 Effect 整个 Finalize 返回才可注销；资源收尾直接使用当前宿主，不以旧快照兜底。

burstEnded 表示 Elemental 侧资源收尾完成，触发时根 Effect 仍为 ENDING，随后才从 Effect 容器移除。该通知可以创建下一轮；通用 Finalize 接续最新 Unit，仅移除旧 Effect ID，不覆盖新槽位。无需为此增加 afterRemove 回调。

正常完成与取消都在宿主仍存在时重置 EP，显式在场取消也采用相同政策。重置属于结束操作，不派发 healed。End 保留 FINISHED 与携带 reason 的 CANCELLED 语义，并用于通知及依赖清理。恢复进度由 UI 查询当前 State，不输出自然恢复完成或爆发结束的诊断 Event。

Unit 请求离场发布 LEAVING 后，通过所有权边自动结束根 Burst Effect。Unit 等待它与其他依赖者整个 Finalize 后才注销和派发 leave；离场入口不手动取消爆发，也不提前清空 burst 或依赖集合。

## 6. 时间推进

原生恢复顺序与 EP 写回的证据见[案例 25](../research/cases/25-elemental-burst-recovery-timing.md)。Core 采用固定步长的全场阶段调度，按项目语义尺度忽略创建时点造成的帧内微时序差异，不增加创建 Tick 跳过或 lastAdvancedTick。

根 Burst Effect 的 onTick 是唯一爆发推进入口。对正时长配置，每次获准推进时使用当前 burstRecoverySpeed 更新有效进度，并按最新有效上限回填全部 EP：

```text
elapsed' = min(duration, elapsed + currentBurstRecoverySpeed)
allEP = currentMaxEP × elapsed' / duration
```

恢复期间四型 EP 会逐步回填，不一直保持零值到结束；Burst 槽位存在期间仍拒绝新的 EP 损伤和显式回复。速度为零或宿主暂时不具备推进资格时暂停，后续只推进当前一步，不积攒补算。动态上限与恢复速度在各次实际推进时重新求值。

同一份有效进度决定跨过的周期边界与凋亡攻击力恢复。自然推进先完成预算内最后一次周期业务，再正常结束；取消、提前 finish 或宿主离场不补未来输出。不另装一枚周期 Effect 保存同类时钟，也不在 onEnd 补发另一个调度器遗漏的周期。

Elemental 的 Runtime 推进只负责无 Burst 时的自然回复，量为 `当前 recoverySpeed / TICKS_PER_SECOND`，保留小数，不派发显式 heal 的 healed Hook 或普通治疗通知。Effect 与自然回复分别由既有调度阶段安排；阶段之前创建的实例可以参与当次推进，阶段之后创建的实例等下一次候选，不新增首 Tick 特判。

Core 同一宿主只允许一个 Burst。少数多种元素爆发的特殊内容由 Content 组合输出和生命周期，不引入通用多阶段爆发或启动免疫窗口。狂躁及其余角色特例的内容覆盖仍需补充；这不改变上述四型与单 Burst 契约。
