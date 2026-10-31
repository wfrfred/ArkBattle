# Blocking 设计

Blocking 负责阻挡关系的建立、解除、站位计算及必要维护；Blockable 保存并推进自身位置修正计划。本文描述两端状态、搜索政策、关系身份、位置推进及同步维护契约，原生特殊机制的未完成部分单列。

Blocker／Blockable 的数值与能力 Change 工厂见 [Capability API](capability.md#blocking)。状态归属与同步返回契约见 [函数式内核](functional-core.md)。

关系查询、acquire／release、maintain／maintainAll 与搜索从 [battle/blocking/index.ts](../../src/core/battle/blocking/index.ts) 导入；Layer、Rule、容量、volume 与 Hook 的 Change 工厂从 [capability/blocking/index.ts](../../src/core/unit/capability/blocking/index.ts) 导入。Blocking 自己定义 Layer 与容量 Modifier，公共类型也由 Capability 入口导出。工厂绑定 Typed Ref，由 Unit.update 执行；完整关系业务由 battle/blocking/operations.ts 组织，hook.ts 只派发。Blockable 的 advancePosition、releaseBlockable 完整操作及 stableBlockPosition 查询由 Capability 入口导出。关系解除统一使用接收 Relation 数组的 release，字段发布仍由所属领域负责。

## 已确定的职责与调度政策

以下政策已实现。阻挡资格、容量裁撤和业务副作用按原生证据核对；搜索候选与容量接续采用下述明确的项目政策。普通接敌采用项目固定阶段，不重构 Combat／Movement 来模拟 Unity 按 UID 逐对象 OnTick。

1. **Battlefield 负责不可变状态与索引一致性。** 阻挡归属与关联由 Unit 的 Blockable／Blocker State 保存，不再要求 BattleState.blocking.relations 的全局权威集合。底层存储转换不派发需要完整 BattleState 的业务 Hook；Runtime 组织调度，Blocking 完整操作负责有时序语义的关系变更。状态存于 Unit 不意味着 Battlefield 存储层负责解释阻挡业务。
2. **关系业务只由 Blocking 明确操作执行。** acquire／release 构造双端、发布后通知；acquire 最后维护本 Blocker，release 只处理给定旧关系集合，不自动维护或搜索。Blocker／Blockable 的 Layer、Rule、容量及 volume 工厂返回 Change，由 Unit.update 一次发布全批字段，再原顺序执行其后继。通用发布不推断关系、不派发通知；Hook 登记和私有 state 写回没有 Blocking 后继。嵌套局部后继不接管无关 Blocker 的外层待结算事实，同对象交叠则使用共同最新状态。
3. **普通搜索每 Tick 在 Movement 后的固定 Blocking Step 统一执行。** advance() 绑定本阶段开始时的 Unit Query，过滤 Blocker 后按既定 Unit 顺序逐个生成 Ref 调用 search()，每项接续最新 BattleState 并检查当前资格。不保存独立搜索周期或周期计数；阶段内新建的 Blocker 等待下一 Tick 的普通搜索。一次普通阶段不反复全场搜索到关系稳定。
4. **按操作范围同步完成清理。** Rule、容量和 volume Change 的后继在返回前完成各自维护，不能等待普通搜索阶段。release 在返回前完成给定旧集合的批量解除与通知，不额外复核剩余关系或搜索；有空余容量且附近仍有未接敌目标，可以是合法的返回状态。
5. **阻挡变化同步通知，后继读取最新状态。** 取得关系将双端关联与目标的位置修正计划一起发布，再分别通知双方。Movement 先推进所有已有阻挡偏移，再在 Route 推进后查询当前关系决定是否执行普通自主移动，不继续同步 Blocking 专用 Locomotion Rule；阻挡不停止 Route 等待及即时指令，也不禁止强制位移。每次回调返回后接续其 BattleState；后续依赖阻挡者、目标、关系、资格或容量时重新读取，不用旧 Unit、旧关系或旧 remaining 覆盖嵌套修改。Hook 可同步解除关系、改变容量或使单位离场。
6. **普通搜索与显式取得分开。** 具体内容需要立即搜索时调用 search，需要尝试取得指定双方时调用 acquire；不以每 Tick 去重吞掉合法的额外操作。search() 只固定开始时按距离稳定排序的候选 Ref 数组，同距离保留 Unit 登记顺序，不按起始容量预选接敌名单或冻结容量预算。每次 acquire() 从最新 BattleState 检查双方资格、目标当前阻挡关系及容量。Hook 增容可以使后续候选在本次搜索接敌，减容可以使后续尝试失败；新增单位不加入本次候选。关系变化以最新状态为准，不重复建立已被提前取得的关系，也不重新收集或重排候选。
7. **先稳定语义，再优化性能。** 不为提前减少复制、扫描或通知而改变以上结算与可见性契约。

各操作按自己的契约保证存储、索引与双端关联一致；release 只保证给定旧集合已经解除，资格与容量维护由相应 Change 后继、maintain 或 maintainAll 明确承担，也不要求所有可能的新关系都已经建立。Content 调用这些领域接口，不为其补做内部步骤。同步业务由完整 BattleState 操作承接，不把任意内容程序塞进只接收 BattlefieldState 的存储转换。

## 状态与关系身份

关系存于两端 Capability，字段含义如下：

Unit 初始化时至多声明 Blocker、Blockable 之一，也允许两者皆无。组合约束在创建入口建立，内部操作信任能力身份保持稳定，不在各次查询或维护中重复校验互斥。这是当前项目的支持范围，不据此要求 Blocker 属于 ALLY、Blockable 属于 ENEMY，也不推导宿主的 Layer、Route 或 Locomotion。容量为 0 或暂时被 Rule 禁止参与不会移除能力。

- Blockable 的 blocker 字段保存当前由哪个 Blocker 取得，未被取得时为 null；该字段是排他归属的权威。
- Blocker 的 blocked 字段按建立顺序保存关联，解除保留其余关联的顺序，重新建立追加到末尾。
- Blockable 的 adjustment 保存本次位置修正的起点、终点和起始 Tick，与当前关系独立；没有 blocker 但仍有 adjustment 是合法状态。

每次取得都读取最新 Blockable 归属，已有归属就不能由另一 Blocker 重复取得。两侧关联与新 adjustment 在首次 ACQUIRED Hook 前一起发布，不暴露仅一侧完成登记的中间状态。

Blocker 的配置与当前状态明确区分：

```typescript
export type Layer = "GROUND" | "AIR";

export type Modifier =
    | { readonly type: "ADD"; readonly value: number }
    | { readonly type: "ZERO" };

interface Definition {
    readonly capacity: number;
    readonly layer: Layer;
    readonly radius?: number;
    readonly rules: readonly Rule[];
}
```

layer 表示该 Blocker 能阻挡的目标层，与宿主自身的 Unit Layer 分开，类型由 Blocking 自己定义，不依赖 Unit Layer Capability。Definition.layer 和 rules 都必填；没有额外规则时明确写 rules: []。State.layer 与 State.radius 保存当前阻挡层及实际半径，不保存另一份派生层或通过查询临时恢复半径。

Core 提供 GROUND 半径 0.7071、AIR 半径 0.8944。初始化和 setLayer 切换时均选择 definition.radius ?? DEFAULT_RADIUS[layer]；Definition 显式提供的 radius 始终覆盖默认值，切层不改变该覆盖。DEFAULT_RADIUS 是类型为 Readonly<Record<Layer, number>> 的内部共享常量，不经过公共入口导出。普通干员省略 radius；特殊对象按需声明明确半径。

两端关系字段如下；其他容量、占用与 Rule 字段保持各自职责：

```typescript
interface PositionAdjustment {
    readonly from: WorldPosition;
    readonly to: WorldPosition;
    readonly startTick: number;
}

interface BlockableState {
    readonly blocker: Ref<Unit & Blocker> | null;
    readonly adjustment: PositionAdjustment | null;
}

interface BlockerState {
    readonly layer: Layer;
    readonly radius: number;
    readonly capacity: readonly Contribution<readonly Modifier[]>[];
    readonly blocked: readonly Ref<Unit & Blockable>[];
}
```

容量贡献使用 Blocking 自己的 Modifier：ADD 追加数值，ZERO 将最终容量置零。setCapacityContribution(reference, entry) 接收 Contribution<readonly Modifier[]>，返回 Change，在发布后局部完成必要裁撤与通知；通用 Contribution 只负责按来源登记、替换、移除及互斥选择。Blocking 的 resolveCapacity 先选择生效来源，再展平其 Modifier 数组；出现任一有效 ZERO 时直接返回 0，否则在 Definition.capacity 上累加全部 ADD，再按既有 ties-to-even 整数化和下限 0 求值。未胜出来源里的 ZERO 不影响结果；撤销有效 ZERO 后按剩余生效贡献重新计算。

这项 ADD／ZERO 协议是项目对容量修正接口的收紧，不作为原生全体阻挡数公式的调查结论，也不改变其他领域的 Attribute 修正协议。Blockable 的 volume 仍使用整数追加量与下限 1。

两端字段不具有对等写入语义。Blockable 保存唯一归属，Blocker 保存本次取得创建的有序关联；二者都由 Blocking 完整操作明确构造。普通 Content 不直接写归属或列表，不能把提交 Ref 当作接敌请求。acquire 检查双方资格、距离、唯一归属与容量，计算目标站位后准备两个完整对象，将双端关系与新 adjustment 一起发布并自行派发取得通知；release 同样准备两端解除值并自行通知。Core 内部 replace 不承担资格检查或结构修补，Content 不能通过公开 update 提交手写关系字段。

| Blocking 操作形成的归属变化 | 同次操作构造的 Blocker 关联 |
| --- | --- |
| null → A | 创建新的目标 Ref 对象，在 A 的列表末尾追加 |
| A → null | 移除 A 列表中的本次关联条目，其余保序 |
| A → A | 已有归属时 acquire 不重建关系，保留列表顺序和既有条目对象 |
| A → B | 不支持普通单次更新，先完整 Release，再执行新的 Acquire |

Blocker 的 blocked[] 包含建立顺序这一历史事实，不能每次按 Unit 枚举顺序重新生成。取得追加新条目，解除只移除对应旧条目，其余保序。Blocking 先基于当前对象准备两侧新值，再通过内部 replace 发布，之后执行对应通知；通用发布层不扫描、补齐或重新构造关联。

本次关系身份由 Blocker 列表中保存的目标 Ref 条目对象承担。固定旧候选时捕获所属 Blocker 与该条目；解除前在当前 Blocker 列表中通过 ===／includes 确认条目仍存在，不重新构造 Ref 来作对象比较。每次重新建立创建新条目，未解除的条目保留原对象。若 Hook 已解除旧关系并重建相同双方，外层旧候选跳过它；再次解除同一旧条目不重复通知。不增加全局关系集合、关系 ID 或独立 Relation 实例。

归属由 Blocker 的 Unit ID 定位，本次关系是否仍存在按正向条目对象比较。不涉及关系业务的普通更新共享既有关系字段，不创建新条目或产生关系通知。

advance(battle) 由 Runtime 每 Tick 调度一次。search(battle, blocker) 指定 Blocker 立即搜索一次，显式调用不受普通阶段限制；Blocking.release 解除关系，不取消目标已有的位置计划，也不隐式重新搜索。Blockable 自身主动解除使用 releaseBlockable，同时取消自己的计划并解除入向关系。

search() 的执行规则已经确定：固定候选数组，逐个 acquire()，每项接续最新 BattleState。初始容量仅是开始时的当前事实，不是本轮预算；候选构造不按该容量提前预选或截断。

例如初始剩余容量为 1、E1 和 E2 都在候选中，取得 E1 的 Hook 将容量提高到 2 后，E2 可以在同一次 search() 中接敌。若 Hook 已提前阻挡 E2，外层尝试跳过它；新创建的 E3 不加入本次候选。

## 关系资格与 Rule

两端使用同一个 [Rule](../../src/core/unit/capability/blocking/rule.ts)，从 [Capability 入口](../../src/core/unit/capability/blocking/index.ts) 导入：

```typescript
export interface Rule {
    readonly id: string;
    readonly allows: (
        battle: BattleState,
        blocker: Unit & Blocker,
        blockable: Unit & Blockable,
    ) => boolean;
}
```

Rule 是针对当前双方的纯查询，可以读取完整 Unit 的其他能力及 BattleState，不执行状态写入。`blocker.rules` 与 `blockable.rules` 只表示规则的登记所有者；两边都按相同参数顺序调用，不把 Blockable 侧的参数反转，也不另定义各自的 Rule 类型。多个限制按独立 ID 登记与撤销。

Blocking 结算不要求双方具有 Allegiance，也不内置 `areHostile` 条件。原生的阵营资格是阻挡者允许哪些目标阵营，普通 Character 允许 ENEMY 是标准策略，不是关系本身的公理。Capability 入口提供可选的标准 Rule：

```typescript
export function sides(...sides: readonly Side[]): Rule;
```

它以 `blocking/sides` 为 ID，仅检查目标当前具有 Allegiance 且其 `allegiance.side` 在指定集合内，不要求阻挡者具有 Allegiance。多个阵营可在同一规则内声明，例如 `sides("ALLY", "NEUTRAL")`。`setBlockerRule(reference, sides(...))` 生成替换策略的 Change，Unit.update 发布后同步维护自身旧关系。未选择该规则时，没有隐含的阵营限制。

Blocker Definition 的必填 `rules` 在初始化时进入当前 State，之后只读取当前 `blocker.rules`。普通干员和 Legacy 干员适配显式声明：

```typescript
blocker: {
    capacity,
    layer: "GROUND",
    rules: [sides("ENEMY")],
}
```

Content 也可直接提供同一二元 Rule 类型的其他策略，不增加位掩码、另一套授权协议或强制 Capability 组合。

Blocking 将资格与其他取得条件分开处理：

| 阶段 | 检查内容 |
| --- | --- |
| `canSearch` | 不依赖具体目标的基础资格，包括阻挡者在场、存活、空间存在；GROUND 另要求当前根格的阻挡许可，AIR 跳过该地块条件；不提前求值二元 Rule。 |
| `canRetain` | 双方 PRESENT 且空间存在，阻挡层与目标空地身份匹配，以及两端所有 `Rule.allows(battle, blocker, blockable)`；GROUND 还要求当前根格允许阻挡，AIR 豁免。临时 HP 为 0 不作为默认保持资格的退出条件。 |
| 新关系取得 | 在搜索和关系资格之外，双方有 Vitality 时 HP 必须大于 0，确认目标尚无归属、双方在接敌距离内，且当前占用加目标 volume 不超过 capacity。 |
| 容量裁撤 | 独立比较当前总占用与容量，超出时从既有有序关联末尾逐项解除；每项通知后接续最新状态。 |

距离只约束新取得，普通移动超出起始半径不使旧关系失效。目标是否已有归属在取得入口检查，不属于 `canRetain`；当前容量已满也不使每条既有关系分别变成不合格。Capability 不保存第二个 enabled 状态，也不将二元 Rule 压成单个 Unit 的 enabled 投影。

正常空地匹配要求目标实际具有 Unit Layer，且 blocker.layer === target.layer.type；没有 Layer 的 Blockable 不参与正常阻挡，不隐式视为 GROUND。生产敌人装配均提供该身份，测试参与关系的对象也应明确配置；Blockable 自身的类型与构造不因此强制依赖 Layer Capability。

普通伤害提交 HP 后先完成 HP Applied 响应；若响应恢复了生命，原有关系继续保留。全部响应后仍然 HP 不大于 0，Damage 才请求 Unit.remove，由离场操作发布 LEAVING 后明确释放该 Unit 的当前关系。Damage／Healing 的 HP 写入不调用 Blocking.maintain，也不让临时 HP 为 0 提前触发解除。此处是项目同步结算边界，不追加原生调查结论。

## 已确定的操作接口

```typescript
export function relations(
    battle: BattleState,
    reference?: Ref<Unit>,
): readonly Relation[];

export function advance(battle: BattleState): BattleState;

export function acquire(
    battle: BattleState,
    blockerRef: Ref<Unit & Blocker>,
    targetRef: Ref<Unit & Blockable>,
): BattleState;

export function release(
    battle: BattleState,
    captured: readonly Relation[],
): BattleState;

export function maintain(battle: BattleState, reference: Ref<Unit>): BattleState;

export function maintainAll(battle: BattleState): BattleState;

export function search(
    battle: BattleState,
    blockerRef: Ref<Unit & Blocker>,
): BattleState;
```

advance() 在每 Tick 的统一 Blocking 阶段使用绑定阶段起始状态的 Unit Query，过滤 Blocker 并按既定 Unit 顺序逐个生成 Ref 调用 search()。每次调用接续最新 BattleState；本阶段中新建的 Blocker 不加入普通阶段候选，但可以通过明确业务调用 search()。

search() 固定的是开始时按距离稳定排序的候选 Ref 数组，同距离保留 Unit 登记顺序，执行方式如下。canSearch、findCandidates 是内部职责的示意名称，不另建框架；acquire 是同一公开取得操作。

```typescript
const blocker = units.get(battle, blockerRef);

if (blocker === undefined || !canSearch(battle, blocker)) {
    return battle;
}

const candidates = findCandidates(battle, blocker);

for (const ref of candidates) {
    battle = acquire(battle, blockerRef, ref);
}

return battle;
```

每次尝试重新确认双方当前资格、目标是否已被阻挡及当前剩余容量。Hook 增容、减容、提前接敌或解除关系都以返回后的状态为准；初始数组以外的新单位不加入，候选不重新排序，不增加本轮预选名单或冻结预算。

acquire 失败时返回原 BattleState，不产生临时关系或通知。成功时在首次 Hook 前发布明确构造的双端状态与新 adjustment，再按 Blocker、Blockable 顺序通知，最后仅维护本 Blocker。它不绕过任何普通取得条件。

`release(battle, captured)` 是唯一的关系解除操作，输入可以跨多个 owner。入口按正向列表中的原 Ref 条目过滤已失效的旧关系，重复的同一旧身份只处理一次，并保留首次出现的输入顺序。它先准备并发布整批双端解除结果，再记录整批 BLOCKING_RELEASED 事件，最后按该顺序逐条派发双方 RELEASED Hook。首个 Hook 已能读取整批解除结果和事件。

release 只处理传入的旧集合，不自动 maintain、搜索或取消位置计划；Hook 新建立的条目不属于本次解除。过期集合或空集合返回原状态。旧身份在入口确认后，内部纯构造信任该事实；其他领域先完成自己的字段发布，再提交关系集合。调用方可使用 `relations(battle, reference)` 取得当前局部集合，或按具体业务提交已有的旧 Relation。

两端 Capability 的 Change 工厂由 capability/blocking/index.ts 导出：

| 工厂 | 主要对象与输入 |
| --- | --- |
| setLayer | `(Ref<Unit & Blocker>, Layer): Change` |
| setBlockerRule／removeBlockerRule | `(Ref<Unit & Blocker>, Rule / id): Change` |
| setCapacityContribution／removeCapacityContribution | `(Ref<Unit & Blocker>, Contribution<readonly Modifier[]> / id): Change` |
| setBlockableRule／removeBlockableRule | `(Ref<Unit & Blockable>, Rule / id): Change` |
| setVolumeContribution／removeVolumeContribution | `(Ref<Unit & Blockable>, Contribution<number> / id): Change` |
| setBlockerHook／removeBlockerHook | `(Ref<Unit & Blocker>, Key, Hook / id): Change` |
| setBlockableHook／removeBlockableHook | `(Ref<Unit & Blockable>, Key, Hook / id): Change` |

工厂绑定 Ref，不接收 battle，也不自行提交。Unit.update 在整批准备时确认宿主存在，缺失时抛出 RangeError；存储中的 LEAVING 宿主仍可清理。Rule、容量和 volume 附带各自的局部后继，Hook Change 只登记集合。相同条目或移除不存在 ID 的本项转换返回原 Unit，由 update 统一跳过 Settlement，不借无变化输入触发裁撤。

工厂实现在 [blocker-operations.ts](../../src/core/unit/capability/blocking/blocker-operations.ts) 和 [blockable-operations.ts](../../src/core/unit/capability/blocking/blockable-operations.ts)。blocker.ts／blockable.ts 保留模型、初始化、守卫和数值查询，Catalog 与只读查询可精确依赖模型。公共入口直接导出工厂，不增加包装。

setLayer 的 transform 只设置 layer 与实际 radius，不修改关系。同层请求由 transform 返回原 Unit，update 统一跳过其 settle。真实切层的 settle 将 previous.blocked 中的原 Ref 组成 Relation 数组交给 release；后者按当前 BattleState 过滤旧身份后批量解除、记录事件并通知。后继不重调 setLayer，也不把 previous 整体发布；本批其他字段和嵌套操作的新值因此保留。

setLayer 不因旧关系在最终层下仍合法而保留它。新建立的同 ID 关系有新的 Ref 条目，不属于旧候选；该项解除不再额外维护新集合。它不自动 search、不新增 layerChanged Hook、不改变自身 Unit Layer。内容在对应 Effect 生命周期程序中提交该 Change，不机械绑定所有 Skill 开始或结束。

## 要求解除旧阻挡的空间操作

SpatialPresence 仍是完整领域操作，先纯发布新位置／空间存在性并取消自身 adjustment，再调用 `release(battle, relations(battle, ref))`。Route 主动覆盖位置时同样取消自身计划并解除当前关系；有 Presence 时使用该完整空间操作，没有 Presence 时自行纯发布后调用 release。字段发布与关系解除之间没有业务回调，因此首个 RELEASED Hook 已能读取新空间事实、计划取消与整批双端解除结果，无需将所有字段挤入同一次 replace，也不向 release 传入额外更新值。

Blocker.layer 的 Change 先在全批发布时设置 layer／radius，等轮到自己的 settle 才通过 release 批量清理 previous 中的旧集合。该 settle 开始后仍存在的全部旧候选，在它自己的首个 RELEASED Hook 前一并清除。若较早 settle 已解除部分关系，那些较早通知遵守自己的结算语义，不能承诺全批第一个 RELEASED 前切层旧关系已全清空。

例如同批先设置 capacity=1，再 GROUND→AIR，所有 Hook 都看到最终 AIR；容量后继可能先逐项解除 GROUND 旧关系，首个通知时其他旧关系仍存在。反向排列则先由切层后继批量清除。批内 GROUND→AIR→GROUND 最终仍为 GROUND，但旧出向关系应清理，通知不观察中间 AIR。拆成两次 update 则各自完成一轮发布和结算。

旧候选只携带有意采样的 Ref 身份，不保留可重新提交的旧 Unit。Hook 新建的关系不被外层候选覆盖；每项通知接续最新 BattleState。普通移动仍不因超出初次接敌半径而自动解除关系。

## 显式关系操作与同步维护

公开 Unit.update 的顺序为全部 transform → 一次 Field／Lifetime 发布 → 按 Change 顺序 settle；内部 replace 只发布 Core 已构造好的完整值，两者都不根据字段差异补齐关系或启动维护。Blocking 的 acquire、release 自己明确构造双端，通过 replace 发布后自行派发通知。关系解除与资格／容量维护分别由 release 和 maintain 承担。

| 后继来源 | 作用范围 |
| --- | --- |
| Blocker Rule 或容量 Change | `maintain(battle, reference)`，只维护本 Blocker 的资格和容量。 |
| Blockable Rule Change | maintain 先复核自身关系；真正解除后继续维护该旧 owner。 |
| Blockable volume Change | settle 读取执行时当前 owner，有 owner 时调用 maintain；不在 Hook 后追随新的 owner。 |
| acquire | 通知完成后维护本 Blocker。 |
| release、setLayer、SpatialPresence／Unit.remove | release 仅解除给定旧集合，不附带维护或搜索。 |
| Locomotion／Blockable 偏移位置提交 | maintain 该 Unit 的当前角色；只有 velocity 改变不启动维护。Route 主动覆盖位置则明确解除关系。 |
| maintainAll、完整地块更新 | 明确的全场维护，按 Unit 顺序选择待解除项。 |

`maintain(battle, reference)` 按当前 Unit 的唯一角色工作。Blocker 按 blocked 顺序先找不合格关系，没有不合格项时才按当前容量选择超额尾项；每次只 release 一条，在 Hook 返回后重读本 Blocker，直到其关系满足资格和容量。Blockable 只先检查自己的当前关系；真正解除后继续 maintain 当时的旧 owner，不追随 Hook 中建立的新归属。不存在、没有阻挡能力或无需清理时返回当前状态。

`maintainAll(battle)` 按既定 Unit 顺序查找第一个需要解除关系的 Blocker；在该 owner 内，先找不合格项，再判断超额尾项。每次 release 一条，Hook 返回后从全场开头重新查找。它不先扫描全场所有不合格项再处理超额，不把不同 owner 的待解除项提前组成批次，也不搜索新目标。

例如容量从 3 降为 1，先解除并通知 E3；该 Hook 把同一 owner 容量恢复为 2 后，E2 保留。若 Hook 先修改同一 owner 的 Rule／容量，嵌套后继可以按最新值先解除 E2，恢复容量不撤销既成事实。若修改的是无关 Blocker B，B 的局部后继不会顺便裁撤 A；外层仍在 Hook 返回后按最新 A 决定是否继续。

嵌套 update 只执行自己的局部结算列表，不调度外层剩余项，不保存全局 pending 或更新锁。已经发布的同对象或同关联事实可以交叠，不能把局部队列误称为事务隔离。显式全场地块操作仍可通过 maintainAll 处理其他已发布事实；需要局部语义的工厂不能以全场维护代替自身后继。

Unit 的真实离场由 Lifetime 先纯发布 LEAVING；若自身是 Blockable，则同时取消自身 adjustment，再以 relations 的局部查询结果调用 release。Blocker 离场将自己的全部旧关系批量解除后才通知，不取消其原目标的计划。Hook 返回后 Prepare 从最新 Unit 计算返费；Finalize 不扫描全场。Damage／Healing 写 HP 不启动 Blocking，临时 HP 为 0 不使旧关系失效，普通 Damage 完成 HP Applied 后仍应死亡才请求上述离场清理。普通私有 state 写回和 Hook Change 不启动 Blocking，Rule 能读取其他能力不代表系统自动订阅任意字段。

## 取得归属与通知时点

取得先计算站位并一次发布双端关系与位置计划，再分别通知：

```text
从最新 BattleState 检查双方资格、目标归属及容量
    ↓
计算 E 的目标站位和新 adjustment
    ↓
一次发布 E.blockable.blocker、A.blocker.blocked 与 E.blockable.adjustment
    ↓
A 的 ACQUIRED Hook
    ↓
E 的 ACQUIRED Hook
```

双端关系与目标站位计划必须在首次可重入回调前确定。A 的 Hook 中若 B 尝试取得 E，B 读取最新归属后拒绝；不需要额外的 ACQUIRING 状态、锁或全局登记表。

双端关系与计划的发布先于两侧 Hook，通知顺序不由字段准备顺序推导。任何可能重入的操作之后，后续字段修改都重新读取双方和同一次关系；原关系已终结时，不能回填旧字段或覆盖新关系。

## 两侧通知顺序

同一次关系变化先派发 Blocker 侧 Hook，再派发 Blockable 侧 Hook；嵌套关系操作及其 Hook 同步完成后，外层才继续后续通知。

例如 A 的 ACQUIRED Hook 解除原关联条目，嵌套 RELEASED 通知同步完成；外层检查旧关联已失效，停止 A 剩余及 E 的 ACQUIRED 响应。同一双方重新建立的新条目属于另一次关系，不能恢复旧关系的派发。取得事件已经发生，不回滚事件日志；这里只停止已失效关系尚未执行的响应。RELEASED 是解除后的历史通知，不以原关系仍存在作为执行资格。

Contribution 不处理自身生命周期，也不感知 Blocking 关系；它只提供登记、替换、移除及互斥归并。贡献何时安装、更新或移除，始终由外部 Effect／Content 或其他业务所有者负责，不向 Contribution 增加 Relation、owner、enabled 或生命周期绑定机制。

Blocking 保证每个 ACQUIRED Hook 开始时原关联 Ref 条目仍然有效。已经进入的 Hook 如果调用了其他可重入领域操作，后续依赖关系或宿主时仍须重新检查当前事实。贡献的安装与清理由外部所有者执行；清理应定位属于原关系的资源，不能误删后来重建关系的贡献，不给 Contribution 增加自身生命周期管理。

## 查询、Hook 与 Runtime 接入

battle/blocking/query.ts 提供 blockerOf(battle, ref)、blocked(battle, ref)、usedCapacity(battle, ref)；输入保留相应 Capability 的 Typed Ref。按 Ref 读取后检查对象是否仍存在，不重复检查 Ref 已证明的稳定能力。`relations(battle, reference?)` 返回只读 Relation 数组：省略 reference 时按 Unit 顺序投影全场当前关联；提供 Unit Ref 时直接读取该 Unit 的角色与关联，不扫描全场。Blocker 按自身 blocked 顺序返回关系，Blockable 从当前 owner 列表取原条目；无能力、无关系或宿主已不存在时返回空数组。查询保留正向列表中的原 blocked Ref，hasRelation 据此判断某次旧关联是否仍有效，区分解除后重建的同双方关系。不存在独立的持久 Relation 实例。

Blocker／Blockable State 各自持有 acquired、released Hook 数组，使用绑定对应 Typed Ref 的 setHook(reference, key, hook)／removeHook(reference, key, id) 返回 Change，再由 Unit.update 登记。每条关系在其第一个业务回调前同时固定两侧候选 ID，逐项恢复最新同 ID 登记并检查 accepts；新增 ID 不参加该条通知，同 ID 替换使用最新登记。先 Blocker，后 Blockable；Context 固定原关系事实，BattleState 每项接续最新版本。ACQUIRED 每项执行前通过原关联 Ref 条目身份确认关系仍存在，RELEASED 是历史通知，不要求旧关系仍存在。BLOCKING_ACQUIRED 在取得通知开始前记录；release 先记录整批 BLOCKING_RELEASED，再逐条开始派发，各条 Hook 候选在轮到该条时固定，不提前冻结后续关系的监听登记。

Runtime 执行 Movement → Mechanism.advance → Blocking.advance → resolveRouteCompletion。最后一步只检查路线是否已完成和能否离场，不再次推进 Route。消费侧通过 relations(battle) 从两端状态取得 Typed Ref 关系，按需生成输出；不保存额外的全局权威关系。Movement 根据 Blockable 的当前归属决定是否推进自主 Locomotion。

明确要求解除关系的空间操作先纯发布新空间事实及自身计划取消，再调用局部 relations 与 release；这两步之间没有回调，首个通知仍可见完整结果。切层 Change 则先发布全批 layer 字段，自己的 settle 再解除 previous 中的旧集合；普通位置更新仍不按距离解除旧关系。Lifetime 请求发布 LEAVING 前已登记 Pending 和结算标记，随后明确调用 release 批量释放本 Unit 的关系；released Hook 可以重入请求，但不能开启第二个 drain。Unit 等真实依赖者整个 Finalize 后才物理移除，不在 Finalize 追加全场 Blocking 扫描；后续实时业务重读宿主，Departure 保留离场入口历史，返费则在标记发布及这些 Hook 返回后从最新 Unit 求值。

## 地块阻挡资格

GROUND 搜索只选一个当前根格：有非空 `occupancy.tile` 时使用登记格；没有登记格时，以 `World.toTile(unit.position)` 回退到身体所在格。随后读取该格的 `state.allowsBlocking`。不额外以登记格的 `elevation === "HIGHLAND"` 拒绝，也不把登记格高度与另一身体格的阻挡许可拼成两条条件。显式配置的 `allowsBlocking: true` 在高地上仍然有效。AIR 搜索绕过这项地块资格，不修改 Tile，也不让同格的 GROUND 阻挡者获得豁免。

既有项目政策继续要求 GROUND 丢失当前根格阻挡许可时同步解除旧关系，AIR 保持关系同样豁免。搜索和保持资格分别组合这一只读地块事实，不通过 canRetain 调用 canSearch 共享整套条件。原生调查直接证明的是搜索入口的地块检查，没有证明旧关系每次都重查地块；此处同步解除是项目已有选择，不冒充额外的原生结论。

原生 `Character._SearchBlockee`（76016，`0x180a38200`）进入 `BlockManager.SearchBlockee`（77190，`0x180aa09e0`）；普通地面分支通过 Entity.rootTile 读取 `Tile.isMeleeBlockable`。`Character.get_rootTile`（75833，`0x180a3c1d0`）返回保存的 `m_rootTile`，不是每次由世界位置重新取格。项目以 Occupancy 表达已登记角色的根格；无登记对象的身体格回退是项目的统一查询政策。

`Tile.get_isMeleeBlockable`（70673，`0x1808c6070`）先读黑板 `tile_blockable`，有值直接返回，未配置才取 `!isHighland`。`Tile.get_isHighland`（70670，`0x1808c5f10`）默认读取 TileData 的原始高度；它与读取当前 Options 的 `get_heightType` 不是同一字段语义。因此普通高地的显式阻挡许可不能被当前 elevation 的硬判断覆盖。

射击台另有内容规则。本机 `trap_1106_achplat` 的 `trap_1106_achplat_passive` 在 `ON_OWNER_OVERLAPPED` 向乘员创建 `highland_common[block]`；后者对 WALK 阻挡模式施加带 `BLOCK_FREE` 的派生 Buff，并随阻挡模式变化维护。`Tile.RegisterCharacter`（70726，`0x1808c1eb0`）通知 `BuffContainer.OnOwnerOverlapped`（65410，`0x1806764e0`），`SearchBlockee` 再通过 `Entity.isBlockFree`（66511，`0x180705590`）拒绝接敌。这证明平台禁阻挡来自具体内容，不是所有高地的通用规则。射击台 Content 通过 Occupancy 的 SUPPORT occupantAdded Hook 在当前乘员的 blocker.rules 登记平台自己的 Rule，只禁止 GROUND 阻挡；该纯规则直接读取当前 blocker.layer，AIR 可通过。occupantRemoved Hook 同步移除该平台规则，不改变地块 allowsBlocking，也不需要新的层变化通知。

## 阻挡层与其他领域的边界

[原生模式调查](../research/evidence/blocking-native-20261023/modes/report.txt) 已确认阻挡者的 `blockMode` 与目标的 `changeableMotionMode` 需要匹配，`ignoreBlockMode` 可豁免；`pathMotionMode` 只负责寻路，`BlockFree` 是独立的禁挡状态。当前各事实的归属如下：

| 原生事实 | 当前表达能力 |
| --- | --- |
| 目标当前运动身份 `changeableMotionMode` | 现有 `Layer.state.type` 的 GROUND／AIR 可表达目标当前空地身份，不需另存一份 Blockable motion。 |
| 寻路模式 `pathMotionMode` | Route 的 Progress 已独立保存，并有 `setPathMotionMode`；不得用它代替阻挡资格。Locomotion 消费此模式处理运动，但不保存第二份身份。 |
| 阻挡者 `blockMode` | 项目以 blocker.layer 表示能够阻挡的目标层，并由 blocking.setLayer 执行切换；不从宿主自身 Layer 推导，也不把原生名称引入项目状态。 |
| `BlockFree` 等禁挡状态 | 现有双端二元 Rule 可表达，不需要第三个模式或新的 enabled 字段。 |

“被阻挡后停止自主移动”已经由 Movement 根据 `blockable.blocker !== null` 跳过 Locomotion 推进实现，不安装另一条禁移动 Rule，也不新增 blocked 状态或 BlockMode。

本轮通用 Blocking 支持 GROUND／AIR 目标匹配、Core 默认半径、AIR 地块豁免，以及切层时清除全部旧出向关系。规则仍处理阵营和其他资格；禁挡不增加第三个层值或新的状态机。具体干员的起降程序继续由 Content 实现。

[蒂比案例调研](../research/cases/21-tippi-air-blocking.md) 已用实际 Prefab／Buff 闭合起飞与落地：本人仍为 WALK，起飞切换阻挡层并独立施加对地规避；默认半径变为 0.8944、获得近战地块条件豁免，切换时清理旧关系。通用接口承接这些 Blocking 行为，但本轮不实现蒂比内容。普通关系已经足以停止飞行目标自主移动，不需要新的移动禁止机制。

[补核](../research/cases/21-tippi-air-blocking.md#6-补核非巡空者实例与半径机制) 确认空中阻挡不限定巡空者：守望者风絮和《未许之地》可浮空区块均有实际内容依据。普通 Character 的 0.8944 是统一空中基准，运行时另有倍率，特殊装置可覆盖。

## 站位计算与位置推进

`battle/blocking/position.ts` 提供普通阻挡站位计算。acquire 从目标的当前真实位置与 Blocker 位置形成偏移，距离小于 0.5 时沿两者连线推到最小间距；归一化的近零向量不产生新方向。0.5 是站位间距，与接敌半径分开，不从 Hitbox 推导。

计算先以该径向位置检查先前阻挡目标的稳定位置：若有距离平方小于 0.01 的点，再累加分散修正。距离小于 0.1 时采用该先前目标相对 Blocker 的顺时针垂线方向；`0.1 ≤ d < 0.4` 时采用沿分离方向的加权贡献，距离达到 0.4 时不贡献。最后用归一化分散方向的 0.2 修正偏移方向并保留原径向距离。前序坐标按 blocked[] 的建立顺序消费，支持惰性 Iterable，不另建位置容器。

`stableBlockPosition(unit)` 在当前仍有 blocker 时返回 `adjustment?.to ?? unit.position`，无关系时返回当前真实位置。后续取得因此使用先前目标的预定站位，而不只看它尚未完成的插值位置。稳定位置是查询结果，不在 State 中再保存一份。

acquire 从当前 `Unit.position` 建立 `{ from, to, startTick }`，新计划覆盖旧计划。偏移按 0.2 秒推进，项目固定 30 Hz 对应 6 Tick；`advancePosition(battle, ref)` 以 `(tick - startTick) / 6` 计算线性位置，到达终点后清除 adjustment，不改变关系。`Unit.position` 始终是唯一真实坐标，不保存额外 progress／velocity，也不建立独立 Tween 对象或全局任务表。偏移位置变化作为完整操作提交后，维护该 Unit 当前关系；它不借用自主 Locomotion Rule，也不额外重置自主速度。

Movement 复用绑定阶段起始 BattleState 的 Unit Query，先过滤 Blockable 并推进全部已有位置修正，再过滤 Route 并执行路线和自主移动。各步在调用时生成 Typed Ref，完整操作从最新 BattleState 读取当前计划、位置和资格。固定枚举来源不要求提前生成 Ref 数组或调用 toArray()。没有 Route 的 Blockable 也能推进偏移；偏移尚未结束或刚结束都不自动跳过自主移动，仍按当前关系、Route 与 Locomotion 资格决定。

两遍推进不构成整批偏移的原子发布，每项接续返回的最新状态。它沿用项目 `Combat → Projectile → Movement` 的阶段安排，没有将原生 Tween 先于全部对象更新的全局位置照搬进 Runtime。[原生时序与取消依据](../research/cases/22-block-positioning-and-interruption.md)与项目阶段政策分别维护。

| 操作 | 关系 | 自身位置计划 |
| --- | --- | --- |
| Blocking.release／关系裁撤 | 解除捕获的关系 | 保留 |
| Blocker 离场、切层或容量裁撤 | 解除其目标的关系 | 保留目标计划 |
| Blockable.release（公共别名 releaseBlockable） | 解除自身当前关系 | 取消 |
| 新 acquire | 建立新关系 | 从当前真实位置创建新计划，覆盖旧计划 |
| 偏移自然完成 | 不变 | 清除 |
| 自身主动空间覆盖或 Unit 离场 | 按相应完整操作清理 | 取消自身计划 |

Blockable.release 先纯发布自身计划取消，再将 `relations(battle, ref)` 交给 Blocking.release，不扫描全场关系。两步之间没有回调，首次 RELEASED Hook 已可见计划取消和关系解除。只剩孤立计划时仍可单独取消；不向关系解除增加 reason 或 cancelAdjustment 开关。Blocker 的普通清理不接管其他目标的位置计划。

## 未完成的原生机制

- **特殊资格与几何。** 特殊目标层豁免、BLOCK_RADIUS_SCALE 运行时修正及 Trap／GiantTrap 特殊几何仍按实际内容需求接入，不扩大本轮接口。原生研究保留在案例和证据中。
- **浮空区块。** 可浮空区块仍是未实现的 Content 机制，不增加 Tile 阻挡层覆盖字段，也不引入 Layer Contribution 或多来源覆盖协议。
- **特殊关系增容。** 大君之触／大君之赐等内容与满阻挡边界仍待实现，见下节。

## 与原生的差异及对照验收

[原生时序调查](../research/evidence/blocking-timing-native-20261023/report.txt)确认：普通接敌与各对象的自主移动交错进行；同一阻挡者的普通入口没有全场多轮收敛，具体内容可以显式立即搜索。[单次操作调查](../research/evidence/blocking-native-20261023/report.txt)记录模式与资格、竞争、容量裁撤、同步通知及位置偏移。

项目另有意取消原生的起始预算预选：原生先按起始剩余容量挑选接敌名单，项目则对固定候选逐次读取当前容量。因此 Hook 增容可能使关系更早建立，并持续改变后续分配；这是已接受的项目语义，不以恢复预算预选为修复目标。

Movement 后的固定阶段会改变部分接敌归属、目标选择、已执行位移、攻击机会乃至漏怪结果，不能预先归类为只有一帧的小差异。是否需要进一步修正，以对照测试的实际影响决定，不由架构直觉或与 Unity 调用位置不同这一事实单独决定。

后续实现需覆盖以下对照案例；下表列出项目政策及主要验收结果；原生逐帧对照仍按具体内容推进：

| 场景 | 需要比较或保证的结果 |
| --- | --- |
| 敌人本 Tick 移入／穿过接敌范围，分别早于或晚于阻挡者分配身份 | 固定阶段与原生交错顺序下的接敌、实际位移及漏怪差异 |
| 多个阻挡者竞争同一目标；多个不同体积目标竞争容量 | 接敌归属、目标顺序、容量使用及后续攻击机会 |
| Release、模式／资格失效、容量缩减发生在普通阶段前后 | 必要解除与裁撤立即可见，普通重接敌遵守每 Tick 的固定阶段，不把释放变成持续豁免 |
| 关系 Hook 中离场、解除、改变容量、移动目标或触发另一关系操作 | 按已定义阶段读取当前归属；外层接续最新状态，不复活旧对象，不重复通知同一变更 |
| Unit 同时声明两种阻挡能力，或两者皆未声明 | 初始化拒绝双角色，允许无角色；内部不追加互斥校验，也不推导阵营、Layer 或 Locomotion |
| A 的 ACQUIRED Hook 内，B 尝试取得同一 E | E 已明确归属 A，B 的尝试失败；通知仍按 A 先、E 后处理原关系事实 |
| 显式 acquire 构造目标归属与正向关联 | 取得入口检查资格并一次发布双端状态，Hook 前归属与有序关联相符；Unit 发布层不补齐或推断关系 |
| HP Applied 恢复临时 HP 为 0 的目标，或响应结束后仍应死亡 | 恢复者保留旧关系；仍需离场者在发布 LEAVING 后明确释放自身全部关系；HP 为 0 的双方不能新取得关系 |
| 每 Tick 统一搜索、阶段内新增 Blocker，以及同 Tick 普通与显式搜索 | 固定本阶段候选；新增 Blocker 下一 Tick 正常参与；合法立即搜索不被普通调度去重抹掉 |
| 搜索中增容、减容、提前接敌及新增单位 | 固定候选，实时容量；增容允许后续候选本轮接敌，已被阻挡的候选跳过，新单位不加入 |
| 旧关系解除后，Hook 重建相同双方，外层稍后再次提交旧集合 | 按列表中 Ref 条目对象身份过滤旧候选，新建关系不被误删，同一旧关系不重复通知 |
| 一个 release 数组包含跨 owner、重复或已重建的旧关系 | 过滤旧身份并按首次输入顺序去重；首 Hook 前整批双端解除和事件均已发布；不自动维护或搜索 |
| 明确要求断开旧阻挡的空间操作，解除通知中重入搜索或修改 Unit | 先纯发布新空间事实及自身计划取消，再局部查询并批量解除关系；Hook 读取完整结果，外层不误删新关系或回填旧 Unit |
| Release Hook 先执行另一项 Blocking 资格／容量完整操作，再增加容量 | 内层返回前完成当时必要的裁撤，后续增容不撤销已经发生的解除；普通私有状态写回不替代这一操作 |
| 容量由 3 降至 1，E3 的 Release Hook 将容量恢复为 2 | 验证本次解除通知与后续维护的顺序；不得因先递归裁撤而让 E2 失去该 Hook 的增容机会 |
| 较早 Unit 超额而较晚 Unit 有不合格关系 | maintainAll 先处理较早 Unit 的超额尾项；每条 Hook 后从头重查，不采用全场不合格优先 |
| 新取得前已有目标仍在插值，或目标与 Blocker 中心重合 | 用先前目标的稳定终点计算分散；保持径向距离，近零中心不凭空生成方向；首次 ACQUIRED 已可见双端关系与新计划 |
| 容量裁撤／Blocker 离场后只剩孤立偏移，随后目标主动解除或重新取得 | 关系解除保留计划；releaseBlockable 仍可取消孤立计划；新取得从当前真实位置覆盖旧计划 |
| 偏移未结束或本 Tick 刚完成，且当前已满足自主移动资格 | 先推进偏移，再从最新位置执行自主移动，不因计划存在而整 Tick 跳过；没有 Route 的目标也能单独推进偏移 |
| 关系建立／解除使容量或 volume Contribution 登记或撤销 | 通过对应 Capability 完整操作登记或撤销，返回前维护与通知已完成；通用 Contribution 不承担生命周期或结算 |

## 满阻挡筛选与关系引起的容量变化

满阻挡时跳过检测可能影响大君之触／大君之赐；以下行为仍待专项核对与实现。

**已确认机制：** [大君之触](https://prts.wiki/w/大君之触) 与 [大君之赐](https://prts.wiki/w/大君之赐) 使阻挡自身的单位阻挡数 +1，同类效果最多叠加 6 次。占用数与对阻挡者的容量贡献是两个可独立观察的事实；后者可能影响后续候选、阻挡目标更换与读取最高阻挡数的其他机制，不能通过把该敌人的 volume 改为 0 代替。

**当前实现边界：** [search 与关系维护](../../src/core/battle/blocking/operations.ts) 已使用固定候选、实时容量，关系 Hook 增容允许后续候选在本轮接敌；不再预先冻结预算或在额度首次用尽时结束候选循环。每次实际取得仍要求当前占用加目标 volume 不超过容量，没有额外的满容量特许入口。这些敌人的具体增容效果尚未接入。

**证据限度：** PRTS 的 +1／最多 +6 描述不能单独证明“满阻挡时也能新抓取这类敌人”。[完整普通客户端路径证据](../research/evidence/blocking-native-20261023/competition/report.txt)确认 SearchBlockee 在剩余额度不大于 0 时退出，并先按初始预算选定名单、再逐项建立关系；回调增加容量不会自动回填本轮名单。这些敌人的特殊内容、容量增益生效时点及额外调用链尚未完整核对。这些原生证据不改变项目已经确定的实时容量政策：对本次初始候选，增容后允许后续尝试；不因此新增候选，也不增加绕过容量或资格的特殊接敌。特殊敌人的满阻挡行为仍需单独核对。

后续需核对并验收：

- 普通敌人已经占满容量后接触该类敌人，是否允许新建关系；先阻挡该类敌人再进入满额状态时是否不同。
- 第一只该类敌人被阻挡、产生容量贡献后，后续候选何时获得重新判断的机会；对照同轮实时容量行为及原生特殊条件。
- 普通敌人与该类敌人混合、同类贡献达到 6 层上限时的实际容量、占用与选择顺序。
- 敌人死亡、解除阻挡、转移阻挡者时撤销正确来源的容量贡献，并重新检查既有关系。
- 基础 capacity 为 0、被 Rule 禁止阻挡与仅剩余额度为 0 分别核对，不因引入特殊尝试而绕过明确的资格限制。
- 若接入同步关系回调，按跨领域状态失效契约重读宿主、目标、关系及当前容量，不继续使用回调前的 remaining。

