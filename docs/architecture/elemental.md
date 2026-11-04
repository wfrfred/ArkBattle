# Elemental 设计

Elemental 负责元素值的接收与资源提交、一次爆发的身份和冷却预算；EP Damage／Healing 的 Calculate／Apply 由 Battle 编排。爆发造成的 HP 伤害、异常状态、属性变化和周期输出由 Content 通过公开领域接口组合。当前四型为 NEURAL、EROSION、BURN、NECROSIS；狂躁尚未接入。

Unit Definition 直接关联共享的 Elemental Definition，Content 提供爆发程序。

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
| burst | 当前 Burst，或 null；Core 同一宿主至多一个 |
| nextBurstId | 宿主内单调分配的爆发身份 |
| maxEp／recoverySpeed／elementResistance／damageResistance／burstRecoverySpeed | 五个属性的 Contribution |
| receiving | 抗性计算后、本次提交前的 DamageReceivingHook，逐项接续 battle 与 Pending |
| rules | damage／heal 两个节点各自的接收许可登记 |
| damaged／healed／burstStarted／burstEnded | 各明确业务事实的 Hook |

属性 Contribution 的动态 Input 为 `(battle, self) => readonly attribute.Modifier[]`。属性修正、资格 Rule、伤判和事实通知分别承担自己的职责。请求类型相关的减免通过 DamageReceivingHook 读取 calculated.type 并返回新 Pending，不复制四组基础抗性，也不在布尔 Rule 中执行副作用。

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
| advance | `(battle, host: Ref<Unit & Elemental>) => BattleState`；Runtime 专用 |
| get | `(battle, ref: Ref<Burst>) => Burst \| undefined` |
| resolveMaxEp／resolveRecoverySpeed／resolveElementResistance／resolveDamageResistance／resolveBurstRecoverySpeed | `(battle, self: Unit & Elemental) => number` |
| resolveDamageRatio | `(battle, self: Unit & Elemental) => number`，使用有效 MaxEP |
| currentType／damageRatio | `(self: Unit & Elemental, maxEp: number)`，显式接收有效上限，不回落到静态 Definition |
| available | 已知 Unit 的基础在场、空间存在与生命资格查询 |

接收要求宿主在场且空间存在，具有 Vitality 时 HP 大于零。Burst 存在期间，包括 ENDING，拒绝损伤和治疗；中立阵营默认拒绝损伤。Rule 按 damage／heal 两个节点登记：damage 使用 `allows(battle, { self, request, type })`，type 是本次实际元素类型；heal 使用 `{ self, request }`。它们只读，均由 setRule／removeRule 的 Change 修改。无敌通过 damage Rule 拒绝，不查询 Vitality 内部接收规则；HP 禁疗不隐式决定 EP 接收。

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

Damage 的 before／after／loss 描述本次元素类型，Burst 身份描述本次创建事实；治疗对四型各应用完整接收量，分别限制到当前上限，不在四型间分摊。某型 EP 耗尽时同步将四型 EP 置零并创建 Burst。动态上限变化不按比例重算 EP，后续实际写入或 Runtime 推进限制到当前上限。

报告在写入时采样；Battle 的 Application 直接引用同一类型，并放入 APPLIED Outcome。损伤有 REJECTED／CANCELLED／UNAVAILABLE／APPLIED；EP Healing 没有取消工作值阶段，只提供 REJECTED／UNAVAILABLE／APPLIED。成功但实际变化为零时，不派发能力 damaged／healed，Battle 仍派发通用 Applied。

## 4. Hook、提交事实与同步重入

通用 Formula、Output、BeforeReceive、BeforeCommit、targetApplied、sourceApplied 存于 [Unit.hooks](hook.md)，由对应 Battle 子域定义键与派发。基础目标资格成立后执行 beforeReceive，再读取最新 Rule；取消、失效及已提交结果按各业务 Outcome 表达。

Elemental 仅保存专属 DamageReceivingHook 和实际资源／Burst 通知。`setDamageReceivingHook`／`removeDamageReceivingHook` 返回 Change。接收 Context 固定 `{ target, request, calculated }`，工作值为 Pending；取消后仍派发后续 Hook，但保留已有取消及原因。领域 cancel 构造函数封装类型断言，不新增运行时取消检查。EP Healing 没有专属 Receiving，不导出取消构造器。

事实通知固定 `{ host, event }`，T=void；以下 event 在资源写入或生命周期转移处确定：

| Hook | 载荷与时点 |
| --- | --- |
| damaged | `{ request, ...DamageApplication }`；本次实际 EP 损失大于零，已经提交 |
| healed | `{ request, ...HealingApplication }`；显式恢复至少一型 EP，已经提交 |
| burstStarted | 已登记的 Burst，表示创建事实，不承诺 onStart 已完成 |
| burstEnded | `{ burst, end }`；本轮完整结束、清理并移除后 |

EP 损伤的爆发分支按以下顺序执行：

```text
提交本次 EP 扣减、四型归零与 Burst
→ 登记 Burst→Unit 的 Lifetime owner 关系
→ 记录 ELEMENTAL_INJURY 和 ELEMENTAL_BURST 的 UI 瞬时事实
→ burstStarted
→ damaged
→ 重读同一 Burst、ACTIVE 状态和宿主资格
→ 仍有资格才执行 Definition.onStart
→ 返回固定资源报告
→ Battle 的 targetApplied、sourceApplied
```

非爆发分支的实际损伤只派发 damaged。burstStarted 可以同步取消 Burst，随后 damaged 仍报告已发生的损失；后续嵌套业务不重算外层报告。无活动 Lifetime 结算时，早先候选可以使 burstEnded 嵌套完成；有活动结算时等待 Finalize。当前对象、资格与 Hook 登记在完整业务返回后从最新 BattleState 查询，明确采样的事实继续保留。

## 5. 完整结束与离场

finish 和 cancel 委托 Burst 的 lifetime，先同步请求，再由最外层结算器完成 Finalize：

```text
登记 Pending，ACTIVE → ENDING
→ 请求依赖者，进入 READY
→ 依赖者完整 Finalize 后开始本轮 Finalize
→ 从当前实例与原 Definition 调用 onEnd(battle, self, end)
→ 从最新宿主读取状态，四型 EP 重置到最新上限
→ 移除 Burst，注销本轮 Lifetime 关系
→ 派发 burstEnded
```

ENDING 期间仍占用爆发槽位，重复请求不覆盖首次原因，也不重复 Prepare。嵌套 finish／cancel 返回不保证 EP 已重置、槽位已清空或 burstEnded 已派发。Unit 所有权保证宿主直到 Burst 整个 Finalize 返回才可注销，原 Definition 可从当前 Unit 取得，不使用通用 fallback。onEnd 后按最新同一 Burst 提交结算，burstEnded 在槽位释放后可以引发新业务。

正常完成与取消都在宿主仍存在时重置 EP，显式在场取消也采用相同政策。重置属于结束操作，不派发 healed。结束原因通过 burstEnded Hook 与结束回调传递，并用于依赖清理。爆发恢复状态由 UI 查询当前 State，不输出自然恢复完成或爆发结束的诊断 Event。

Unit 请求离场发布 LEAVING 后，通过所有权边自动请求本轮 Burst 取消；取消与正常完成保留各自 End。Unit 等待 Burst 与其他依赖者整个 Finalize 后才注销和派发 leave；离场入口不手动调用 Elemental.cancel，也不清空 burst 或依赖集合。

## 6. 时间推进

原生首次恢复与宿主更新顺序的证据见[案例 25](../research/cases/25-elemental-burst-recovery-timing.md)。Core 采用固定步长的全场阶段调度，按项目语义尺度忽略创建时点造成的帧内微时序差异；恢复期间 EP 写回的项目映射仍需独立审查。

Runtime 每 Tick 调度一次 Elemental，遍历绑定阶段入口状态的 `units.all(snapshot).filter(hasElemental)`，在调用 advance 时生成宿主 Ref 并读取当前对象。每次 advance 固定推进一个 Tick：正常 EP 回复量为 `当前 recoverySpeed / TICKS_PER_SECOND`，爆发预算扣除当前 `burstRecoverySpeed`，归零后正常完成。速度为零时暂停，后续变化作用于剩余预算。

本阶段执行到宿主时，按其当前状态决定推进自然恢复还是 Burst。阶段之前已经创建的 Burst 可以在本 Tick 推进，阶段之后创建的自然等下一次调度；创建和阶段切换没有额外的首 Tick 跳过规则。每次调度只推进当前一步，暂停或不具备资格期间不积攒补算时间。自然回复由 Runtime 更新 EP，不派发显式 heal 的 healed Hook。

爆发的周期 Effect 保存已经处理的有效进度，每次 onTick 按当前爆发恢复速度推进一步，跨过周期边界时结算对应输出。自然预算耗尽时，Effect.onEnd 结清完整预算内尚未执行的周期边界，避免阶段内新建 Effect 少一次调度而丢失整次伤害或 SP 操作。该收尾只接受 ELEMENTAL_BURST_FINISHED、Burst 剩余预算已归零且宿主仍在场的情况；取消、提前 finish 或宿主离场不补输出。

周期推进与预算收尾均由 Content 程序完成，Lifetime 绑定只表达结束关系。明确固定间隔的其他业务使用自己的时钟。累计输出、触发次数、生命周期等可观察行为按 [README 的语义尺度](README.md)核对。

Core 同一宿主只允许一个 Burst，并在爆发期间拒绝损伤和治疗。少数多种元素爆发的特殊内容由 Content 组合输出和生命周期，不引入通用多阶段爆发或启动免疫窗口。

狂躁及其余角色特例的内容覆盖仍需补充；这不改变上述四型与单 Burst 契约。
