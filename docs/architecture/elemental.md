# Elemental 设计

Elemental 负责元素值、元素损伤与治疗、一次爆发的身份和冷却预算。爆发造成的 HP 伤害、异常状态、属性变化和周期输出由 Content 通过公开领域接口组合。当前四型为 NEURAL、EROSION、BURN、NECROSIS；狂躁尚未接入。

Unit Definition 直接关联共享的 Elemental Definition，Content 提供爆发程序。

公开类型、查询和业务操作从 [elemental/index.ts](../../src/core/unit/capability/elemental/index.ts) 导入，包括只读的 available。Capability 的 Rule、Hook 与属性贡献 set／remove 绑定 Ref<Unit & Elemental> 返回 Change，交给 Unit.update 登记。爆发、损伤与恢复等完整操作保持 BattleState 协议，状态写回使用 Core 内部的 Unit.replace；query.ts 负责查询。

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
| burst | 当前 Burst，或 null；Core 同一宿主至多一个 |
| nextBurstId | 宿主内单调分配的爆发身份 |
| maxEp／recoverySpeed／elementResistance／damageResistance／burstRecoverySpeed | 五个属性的 Contribution |
| receiving | 抗性后、本次提交前的 DamageHook，逐项接续 battle 与剩余损伤 |
| rules | damage／heal 两个节点各自的接收许可登记 |
| received／damaged／healed／burstStarted／burstEnded | 各明确业务事实的 Hook |

属性 Contribution 的动态 Input 为 `(battle, self) => readonly attribute.Modifier[]`。属性修正、资格 Rule、伤判和事实通知分别承担自己的职责。请求类型相关的减免通过 DamageHook 读取 request.type 并返回新剩余数额，不复制四组基础抗性，也不在布尔 Rule 中执行副作用。

能力组合由内容装配决定。内容中的干员与地面敌人默认同时提供 Vitality 和 Elemental；Core 的 Unit 允许明确组合所需能力。免疫不通过删除 Elemental 表达。CHARACTER／ENEMY 仅用于 Data／Content 选择静态爆发程序，不进入 Core 接收者枚举，也不由当前阵营推导。

## 2. Burst 身份与内容程序

[burst.ts](../../src/core/unit/capability/elemental/burst.ts) 中，Burst 保存 host、id、type、source、startedAtTick、status 和 remainingTicks。host 为 `Ref<Unit & Elemental>`，source 为 `Ref<Unit> | null`，状态为 ACTIVE／ENDING。

`burst.ref(self)` 返回 `Ref<Burst>`，地址为 host + id。身份与元素类型、期限分开；旧引用不能操作后来的爆发。来源引用保存历史身份，不要求来源仍在场，也不隐含生命周期绑定。跨 Battle 使用 Ref 仍属于调用契约错误。

Burst Definition 由宿主 Definition 与 type 确定，不经过注册表：

```typescript
interface Definition {
    readonly durationTicks: number;
    readonly onStart: (battle: BattleState, self: Burst) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Burst, end: End) => BattleState;
}

type End =
    | { readonly type: "FINISHED" }
    | { readonly type: "CANCELLED"; readonly reason: string };
```

内容按需创建 Effect，使用 core/lifetime 的 scope(burstLifetime, ref) 绑定一次爆发；Burst 的静态 lifetime 由领域入口导出，地址仍为宿主 ID 与 Burst ID。只有当前 ACTIVE 且未 Pending 的 Burst 可以接受新依赖；周期 Effect 用 Lifetime.dependencies 查询显式依赖，再由 getRef(scope, burstLifetime) 恢复对应 Ref，以查询状态与恢复速率。绑定只表达终止关系，不共享时间轴。

不是所有爆发产物都绑定 Burst。例如永久侵蚀减防、冷却结束后尚待消费的麻痹保留自己的生命周期。具体爆发程序位于 [data/arknights/elemental-burst.ts](../../src/data/arknights/elemental-burst.ts)。

## 3. 查询与完整操作

完整操作与查询使用最新 battle，当前时间读取 battle.tick。

EP 损伤与治疗遵守[Calculate 输出计算、Apply 目标接收的项目边界](vitality.md#1-calculate-与-apply-的语义边界)：零计算输出在 Apply 入口拒绝，不进入本笔接收或 Applied；零实际变化允许成功。本节现有完整入口仍需按此边界整理；具体协调接口尚未确定，Burst 生命周期保持下文契约，不按原生事件序列重新设计。

普通 EP 回复的原生求值、逐型提交、共享 Modifier 时点及行医命中组合见[治疗结算调查](../research/cases/29-hp-and-ep-healing-settlement.md)，与本文的当前项目政策分别记录。

| 接口 | 形状与结果 |
| --- | --- |
| operations.damage | `(battle, target: Ref<Unit>, { source, type, power }) => Result<DamageOutcome>` |
| operations.heal | `(battle, target: Ref<Unit>, { source, power }) => Result<HealOutcome>` |
| operations.finish | `(battle, ref: Ref<Burst>) => BattleState` |
| operations.cancel | `(battle, ref: Ref<Burst>, reason?) => BattleState` |
| operations.advance | `(battle, host: Ref<Unit & Elemental>) => BattleState`；Runtime 专用推进 |
| query.get | `(battle, ref: Ref<Burst>) => Burst \| undefined` |
| query.canReceiveDamage／canReceiveHeal | `(battle, target: Ref<Unit>, request) => boolean` |
| query.resolveMaxEp／resolveRecoverySpeed／resolveElementResistance／resolveDamageResistance／resolveBurstRecoverySpeed | `(battle, host: Ref<Unit & Elemental>) => number \| undefined` |
| query.resolveDamageRatio | `(battle, host: Ref<Unit & Elemental>) => number \| undefined` |
| query.currentType／damageRatio | `(self: Unit, maxEp?) => Type \| undefined / number`；已知对象的局部查询 |
| query.available | `(self: Unit) => boolean`；基础在场、空间存在与生命资格查询 |

DamageOutcome 为 APPLIED `{ amount, burst: Ref<Burst> | null }` 或 REJECTED `{ reason }`；HealOutcome 为 APPLIED `{ amounts: Values }` 或 REJECTED `{ reason }`。实际 EP 变化为零可以成功返回 APPLIED，不派发实际变化的 damaged／healed Hook；这不表示允许零计算输出进入接收。操作接受普通 Unit Ref，目标不具有 Elemental 时返回 NO_ELEMENTAL。

损伤先按当前 elementResistance 修正，再执行本次 DamageHook 管线。Hook 返回 Result<number>，接续新的 BattleState 和剩余数额；每次派发固定候选 ID，逐项读取最新登记，嵌套派发独立收集。返回后重查目标资格、当前上限及 EP，再提交数额，损失不超过当前 EP。Effect 可以保存护盾预算、在启停时登记和撤销 DamageHook，Hook 消耗当前 Effect 预算并返回剩余损伤；Elemental 不认识具体护盾。某型 EP 归零时，一次性把四条 EP 置零、登记新 Burst；在内容回调前登记 Burst→Unit 的 Lifetime owner 关系。治疗对每条 EP 各应用完整请求数额，分别限制到当前上限，不在四型之间分摊。动态上限变化不按比例重算 EP；后续实际写入 EP 的操作或 Runtime 推进将数值限制在当前上限内。

接收的基本资格为宿主在场、空间存在，具有 Vitality 时 HP 大于零。Burst 存在期间，包括 ENDING，拒绝损伤和治疗；中立阵营默认拒绝损伤。Rule 按 damage／heal 节点分别保存，统一使用 `allows(battle, { self, request })`，request 类型由节点确定。`setRule(ref, key, rule)`／`removeRule(ref, key, id)` 返回 Change，同 ID 在不同节点独立。元素免疫可以只限制损伤；HP 禁疗不隐式决定元素治疗。无敌内容向 damage 节点登记拒绝 Rule，并在失效时移除，Core 不读取 Vitality 的内部接收规则。

Targeting 提供标准元素 Filter，由 Content 显式组合：elementDamage 根据本次实际类型和数值调用 canReceiveDamage；elementHealing 调用 canReceiveHeal 与 resolveDamageRatio，始终读取最新 battle 中的动态 Rule 和有效上限。普通 HP 行动附带元素输出，不自动套用元素接收条件。只读 Filter 不派发收到请求 Hook，也不执行结算；Selector 的随机消费由 Targeting Result 接续。

## 4. Hook、提交事实与同步重入

结算 Hook 采用[已定稿的精确类型与取消契约](vitality.md#16-已定稿的结算-hook-类型)：EP Damage／Healing 各有自己的 Context 与 Application，不并入联合 Context；EP Damage 接收的 Pending 独立保存 amount 与 cancellation。取消后仍可修改 amount、继续独立业务，但保留已有取消及原因；领域 cancel 构造函数封装条件类型断言。EP Healing 暂不机械增加专属 Receiving Hook，HP Damage 的 ReceivingStarted 不向 EP 复制。以下既有接收接口尚待迁移，Burst 及实际 EP 变化通知保持各自语义。

Hook 采用公共协议 `(battle, fixedContext, current) => Result<T>`。事实通知固定 `{ host, event }`，T=void；DamageHook 固定 `{ host, request }`，T=number，金额只在 current 接续，内容程序负责返回合法的非负剩余损伤。accepts 只查询，实时宿主按 host 从 battle 读取。setDamageHook／removeDamageHook 管理伤判登记。每次派发固定候选 ID，逐项读取最新登记与 accepts；同 ID 替换使用新版本，新 ID 等待下一次派发。嵌套操作独立取候选。

| Hook | 载荷与时点 |
| --- | --- |
| received | `{ request }`；基本目标资格成立后、接收 Rule 与爆发锁定等准入检查之前；可能最终被拒绝 |
| damaged | `{ request, previous, current, amount, burst }`；实际 EP 损失大于零，已经提交 |
| healed | `{ request, previous, current, amounts }`；显式 heal 至少一型实际恢复，已经提交 |
| burstStarted | 已登记的 Burst；表示创建事实，不承诺 onStart 内容已经完成 |
| burstEnded | `{ burst, end }`；完整结束、清理并移除当前实例后 |

收到请求与实际损失分别表达，免疫抵消仍可被 received 观察。不存在目标、没有 Elemental 或基本资格不成立时不派发 received。received 可以同步改变或终结目标；返回后从最新 battle 重做准入和数额求值。

爆发分支的顺序为：

```text
提交本次 EP 扣减、归零与 Burst
→ 记录 ELEMENT_DAMAGE 和 ELEMENT_BURST
→ burstStarted Hook
→ damaged Hook
→ 重读同一 Burst、ACTIVE 状态和宿主资格
→ 仍有资格才执行 Definition.onStart
```

非爆发分支提交损伤后只派发 damaged。报告与 Hook 保留提交时的数值，不因同步嵌套结束而重算。burstStarted Hook 可以请求结束 Burst，随后仍可能派发原损伤事实。没有活动 Lifetime 结算时，早先 burstStarted 候选可以使 burstEnded 嵌套完成；已有结算时，burstEnded 等到 Finalize。后续 burstStarted 候选继续处理原创建事实，不改写已提交报告。

任何跨领域操作之后，如果后续依赖自己或宿主的当前资格，都按[状态接续契约](functional-core.md#状态接续后的读取与续执行)重新读取。已明确采样的数值和已提交事实继续保留。

## 5. 完整结束与离场

finish 和 cancel 委托 Burst 的 lifetime，先同步请求，再由最外层结算器完成 Finalize：

```text
登记 Pending，ACTIVE → ENDING
→ 请求依赖者，进入 READY
→ 依赖者完整 Finalize 后开始本轮 Finalize
→ 从当前实例与原 Definition 调用 onEnd(battle, self, end)
→ 从最新宿主读取状态，四型 EP 重置到最新上限
→ 移除 Burst，注销本轮 Lifetime 关系
→ 记录结束事件，派发 burstEnded
```

ENDING 期间仍占用爆发槽位，重复请求不覆盖首次原因，也不重复 Prepare。嵌套 finish／cancel 返回不保证 EP 已重置、槽位已清空或 burstEnded 已派发。Unit 所有权保证宿主直到 Burst 整个 Finalize 返回才可注销，原 Definition 可从当前 Unit 取得，不使用通用 fallback。onEnd 后按最新同一 Burst 提交结算，burstEnded 在槽位释放后可以引发新业务。

正常完成与取消都在宿主仍存在时重置 EP，显式在场取消也采用相同政策。重置属于结束操作，不派发 healed。ELEMENT_BURST_ENDED 保留完整 End；仅 FINISHED 另外记录 ELEMENT_RECOVERED，取消原因同时用于依赖清理与结束回调。

Unit 请求离场发布 LEAVING 后，通过所有权边自动请求本轮 Burst 取消；取消与正常完成保留各自 End。Unit 等待 Burst 与其他依赖者整个 Finalize 后才注销和派发 leave；离场入口不手动调用 Elemental.cancel，也不清空 burst 或依赖集合。

## 6. 时间推进

原生首次恢复与宿主更新顺序的证据见[案例 25](../research/cases/25-elemental-burst-recovery-timing.md)。Core 采用固定步长的全场阶段调度，按项目语义尺度忽略创建时点造成的帧内微时序差异；恢复期间 EP 写回的项目映射仍需独立审查。

Runtime 每 Tick 调度一次 Elemental，遍历绑定阶段入口状态的 `units.all(snapshot).filter(hasElemental)`，在调用 advance 时生成宿主 Ref 并读取当前对象。每次 advance 固定推进一个 Tick：正常 EP 回复量为 `当前 recoverySpeed / TICKS_PER_SECOND`，爆发预算扣除当前 `burstRecoverySpeed`，归零后正常完成。速度为零时暂停，后续变化作用于剩余预算。

本阶段执行到宿主时，按其当前状态决定推进自然恢复还是 Burst。阶段之前已经创建的 Burst 可以在本 Tick 推进，阶段之后创建的自然等下一次调度；创建和阶段切换没有额外的首 Tick 跳过规则。每次调度只推进当前一步，暂停或不具备资格期间不积攒补算时间。自然回复由 Runtime 更新 EP，不派发显式 heal 的 healed Hook。

爆发的周期 Effect 保存已经处理的有效进度，每次 onTick 按当前爆发恢复速度推进一步，跨过周期边界时结算对应输出。自然预算耗尽时，Effect.onEnd 结清完整预算内尚未执行的周期边界，避免阶段内新建 Effect 少一次调度而丢失整次伤害或 SP 操作。该收尾只接受 ELEMENTAL_BURST_FINISHED、Burst 剩余预算已归零且宿主仍在场的情况；取消、提前 finish 或宿主离场不补输出。

周期推进与预算收尾均由 Content 程序完成，Lifetime 绑定只表达结束关系。明确固定间隔的其他业务使用自己的时钟。累计输出、触发次数、生命周期等可观察行为按 [README 的语义尺度](README.md)核对。

Core 同一宿主只允许一个 Burst，并在爆发期间拒绝损伤和治疗。少数多种元素爆发的特殊内容由 Content 组合输出和生命周期，不引入通用多阶段爆发或启动免疫窗口。

狂躁及其余角色特例的内容覆盖仍需补充；这不改变上述四型与单 Burst 契约。
