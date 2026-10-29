# Blocking 设计

Blocking 负责阻挡关系的建立、解除及必要维护。本文描述两端状态、搜索政策、关系身份及同步维护契约，原生特殊机制的未完成部分单列。

Blocker／Blockable 的数值与局部 State 接口见 [Capability API](capability.md#blocking)。状态归属与同步返回契约见 [函数式内核](functional-core.md)。

关系查询与公开结算从 [battle/blocking/index.ts](../../src/core/battle/blocking/index.ts) 导入，两端 Capability 的类型与局部变换从 [unit/capability/blocking/index.ts](../../src/core/unit/capability/blocking/index.ts) 导入。公共 Relation、Context、Hook、Key 定义在 [Capability contract.ts](../../src/core/unit/capability/blocking/contract.ts)，由 Capability 入口导出；Battle 入口只提供查询与操作，不重复转发这些类型。[battle/blocking/hook.ts](../../src/core/battle/blocking/hook.ts) 只实现派发。整批更新的准备、差分、通知及维护在 operations.ts 内保持有序内聚，Change 是该文件内未导出的变更类型；Core 按需精确依赖阶段接口，不将它们扩为内容 API。

## 已确定的职责与调度政策

以下政策已实现。阻挡资格、容量裁撤和业务副作用按原生证据核对；搜索候选与容量接续采用下述明确的项目政策。普通接敌采用项目固定阶段，不重构 Combat／Movement 来模拟 Unity 按 UID 逐对象 OnTick。

1. **Battlefield 负责不可变状态与索引一致性。** 阻挡归属与关联由 Unit 的 Blockable／Blocker State 保存，不再要求 BattleState.blocking.relations 的全局权威集合。底层存储转换不派发需要完整 BattleState 的业务 Hook；Runtime 组织调度，Blocking 完整操作负责有时序语义的关系变更。状态存于 Unit 不意味着 Battlefield 存储层负责解释阻挡业务。
2. **保留 unit.update() 的完整更新保证。** Capability 的 set／remove 等接口继续只转换自身 State；调用方以普通方式提交新 Unit。unit.update(battle, [unit]) 在 Battle 层接续存储、索引和必要的同步阻挡维护，返回维护及其 Hook 完成后的最新 BattleState，不为 Contribution 另设一套完整更新 API。这个保证适用于每一层同步嵌套调用，不只适用于最外层操作；不因已有 Blocking 维护正在执行而延迟必要维护。Runtime 提交 Unit 修改统一使用 unit.update 或相应完整领域操作，不直接选择 battlefield/unit.update 绕过完整结算。
3. **普通搜索每 Tick 在 Movement 后的固定 Blocking Step 统一执行。** advance() 在本阶段开始时固定 Blocker 候选 Ref，按枚举顺序逐个调用 search()，每项接续最新 BattleState 并检查当前资格。不保存独立搜索周期或周期计数；阶段内新建的 Blocker 等待下一 Tick 的普通搜索。一次普通阶段不反复全场搜索到关系稳定。
4. **Release、容量裁撤和失效清理同步完成。** 相关事实变化后，必要的既有关系维护必须在完整操作返回前完成，不能等待普通搜索阶段。释放关系不自动附带普通 Acquire；有空余容量且附近仍有未接敌目标，可以是合法的返回状态。
5. **阻挡变化同步通知，后继读取最新状态。** 取得关系先确定 Blockable 端的唯一归属，再分别通知双方；字段写入顺序与 Hook 顺序分别定义，不要求双端在所有内部阶段同时更新。普通自主移动由 Movement 在 Route 推进后查询当前关系决定是否执行，不继续同步 Blocking 专用 Locomotion Rule；阻挡不停止 Route 等待及即时指令，也不禁止强制位移。每次回调返回后接续其 BattleState；后续依赖阻挡者、目标、关系、资格或容量时重新读取，不用旧 Unit、旧关系或旧 remaining 覆盖嵌套修改。Hook 可同步解除关系、改变容量或使单位离场。
6. **普通搜索与显式立即搜索分开。** 具体内容需要立即接敌时，执行明确的 Blocking 操作；不以每 Tick 去重吞掉合法的额外搜索。search() 只固定开始时按距离、目标 ID 排序的候选 Ref 数组，不按起始容量预选接敌名单或冻结容量预算。每次 tryAcquire() 从最新 BattleState 检查双方资格、目标当前阻挡关系及容量。Hook 增容可以使后续候选在本次搜索接敌，减容可以使后续尝试失败；新增单位不加入本次候选。关系变化以最新状态为准，不重复建立已被提前取得的关系，也不重新收集或重排候选。
7. **先稳定语义，再优化性能。** 不为提前减少复制、扫描或通知而改变以上结算与可见性契约。

这里的“返回状态自洽”要求存储、索引、关系合法性和移动约束一致，不要求所有可能的新关系都已经建立。同步业务维护由完整 BattleState 操作承接，不把任意内容程序塞进只接收 BattlefieldState 的存储转换。

## 状态与关系身份

关系存于两端 Capability，字段含义如下：

- Blockable 的 blocker 字段先确定当前由哪个 Blocker 取得，未被取得时为 null；该字段是排他归属的权威。
- Blocker 的 blocked 字段按建立顺序保存关联，解除保留其余关联的顺序，重新建立追加到末尾。

每次取得都读取最新 Blockable 归属，已有归属就不能由另一 Blocker 重复取得；不以正向列表尚未更新作为重新取得的理由。允许已确定归属、另一侧尚未推进的阶段状态，不再要求通过一次原子写入同时修改双方。

两端字段的类型基线如下；这里只列关系字段，其他容量、占用与 Rule 字段保持各自职责：

```typescript
interface BlockableState {
    readonly blocker: Ref<Unit & Blocker> | null;
}

interface BlockerState {
    readonly blocked: readonly Ref<Unit & Blockable>[];
}
```

两端字段不具有对等写入语义。Blockable 的归属变化驱动 Blocker 有序关联的增量维护；Blocker 列表不是第二个接敌请求入口，普通 Content 不任意写入它。归属的建立和解除由 Blocking 完整操作发起，不能把直接写入 Ref 当作绕过资格检查的入口。`unit.update()` 对 null → A 复用取得资格、距离及容量检查；不合格的直接写入属于契约错误，在关系关联写入和业务通知之前抛出异常，不先通知取得再解除。

| Blockable 归属变化 | Blocker 关联维护 |
| --- | --- |
| null → A | 创建新的目标 Ref 对象，在 A 的列表末尾追加 |
| A → null | 移除 A 列表中的本次关联条目，其余保序 |
| A → A | 按 Unit ID 判断归属未变，保留列表顺序和既有条目对象 |
| A → B | 不支持普通单次更新，先完整 Release，再执行新的 Acquire |

Blocker 的 blocked[] 包含建立顺序这一历史事实，不能每次按 Unit 枚举顺序重新生成。补齐关联基于本批最终 Blocker 构造，只修改本次涉及的关系字段，不覆盖同批提交的其他字段。Blocking 的取得和解除先准备两侧新值，再统一调用 update；单条归属更新需要补齐时，也在纯准备阶段合并进同一批，不再写回第二版 Field。

本次关系身份由 Blocker 列表中保存的目标 Ref 条目对象承担。固定旧候选时捕获所属 Blocker 与该条目；解除前在当前 Blocker 列表中通过 ===／includes 确认条目仍存在，不重新构造 Ref 来作对象比较。每次重新建立创建新条目，未解除的条目保留原对象。若 Hook 已解除旧关系并重建相同双方，外层旧候选跳过它；再次解除同一旧条目不重复通知。不增加全局关系集合、关系 ID 或独立 Relation 实例。

归属是否变化按 Blocker 的 Unit ID 比较，本次关系是否仍存在按正向条目对象比较。普通更新仅将 blocker 换成另一个指向同一 Unit 的 Ref 对象，不创建新关系，也不更换正向条目。

advance(battle) 由 Runtime 每 Tick 调度一次。search(battle, blocker) 指定 Blocker 立即搜索一次，显式调用不受普通阶段限制；release 解除关系，不隐式重新搜索。

search() 的执行规则已经确定：固定候选数组，逐个 tryAcquire()，每项接续最新 BattleState。初始容量仅是开始时的当前事实，不是本轮预算；候选构造不按该容量提前预选或截断。

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

它以 `blocking/sides` 为 ID，仅检查目标当前具有 Allegiance 且其 `allegiance.side` 在指定集合内，不要求阻挡者具有 Allegiance。多个阵营可在同一规则内声明，例如 `sides("ALLY", "NEUTRAL")`。`setBlockerRule(state, sides(...))` 替换现有阵营策略；仍由完整 Unit 更新维护旧关系。未选择该规则时，没有隐含的阵营限制。

Blocker Definition 的可选 `rules` 在初始化时进入当前 State，之后只读取当前 `blocker.rules`。普通干员和 Legacy 干员适配显式声明：

```typescript
blocker: {
    capacity,
    geometry: { radius: 0.70709997 },
    rules: [sides("ENEMY")],
}
```

Content 也可直接提供同一二元 Rule 类型的其他策略，不增加位掩码、另一套授权协议或强制 Capability 组合。

Blocking 将资格与其他取得条件分开处理：

| 阶段 | 检查内容 |
| --- | --- |
| `canSearch` | 不依赖具体目标的基础资格，包括阻挡者在场、存活、空间存在及当前根格的阻挡许可；不提前求值二元 Rule。 |
| `canRetain` | 双方是不同实例、当前基础资格、目标空地身份，以及两端所有 `Rule.allows(battle, blocker, blockable)`；阵营策略由显式 Rule 决定，新取得和旧关系维护共用这一判断。 |
| 新关系取得 | 在关系资格之外，确认目标尚无归属、双方在接敌距离内，且当前占用加目标 volume 不超过 capacity。 |
| 容量裁撤 | 独立比较当前总占用与容量，超出时从既有有序关联末尾逐项解除；每项通知后接续最新状态。 |

距离只约束新取得，普通移动超出起始半径不使旧关系失效。目标是否已有归属在取得入口检查，不属于 `canRetain`；当前容量已满也不使每条既有关系分别变成不合格。Capability 不保存第二个 enabled 状态，也不将二元 Rule 压成单个 Unit 的 enabled 投影。

## 已确定的操作接口

```typescript
export function advance(battle: BattleState): BattleState;

export function release(
    battle: BattleState,
    reference: Ref<Unit>,
): BattleState;

export function search(
    battle: BattleState,
    blockerRef: Ref<Unit & Blocker>,
): BattleState;
```

advance() 在每 Tick 的统一 Blocking 阶段固定 Blocker 候选 Ref，按 Unit 登记顺序逐个调用 search()。每次调用接续最新 BattleState；本阶段中新建的 Blocker 不加入普通阶段候选，但可以通过明确业务调用 search()。

search() 固定的是开始时的候选 Ref 数组及其距离／ID 顺序，执行方式如下。canSearch、findCandidates、tryAcquire 是内部职责的示意名称，不另建框架。

```typescript
const blocker = units.get(battle, blockerRef);

if (blocker === undefined || !canSearch(battle, blocker)) {
    return battle;
}

const candidates = findCandidates(battle, blocker);

for (const ref of candidates) {
    battle = tryAcquire(battle, blockerRef, ref);
}

return battle;
```

每次尝试重新确认双方当前资格、目标是否已被阻挡及当前剩余容量。Hook 增容、减容、提前接敌或解除关系都以返回后的状态为准；初始数组以外的新单位不加入，候选不重新排序，不增加本轮预选名单或冻结预算。

release 只解除关系，不自动接敌。固定旧关联条目的内部解除按对象身份确认，已经消失的旧条目直接跳过。release(battle, reference) 捕获该 Unit 作为 Blocker 或 Blockable 的旧关联，逐项解除；Hook 中新建立的条目不属于该次候选。

旧关系是否仍存在统一在 releaseUpdates 的入口确认；releaseRelation 直接接续其准备结果提交，不在两者之间重复查询同一关系。

## 要求解除旧阻挡的空间操作

对于明确要求解除旧阻挡的空间操作，采用以下顺序：

```text
捕获旧 Blocker 与关联 Ref 条目候选
    ↓
纯准备新空间事实和旧关系两侧的解除值
    ↓
update 一次提交本批最终状态
    ↓
逐项同步通知本批已发生的关系变化
```

捕获发生在空间事实更新之前，纯准备按列表中保存的 Ref 条目对象身份确认旧关系。同批明确要求解除的关系在首个回调前已全部写好，Release Hook 同时读取新的位置／空间存在性和解除后的双侧字段。通知保留各条已经发生的解除事实，不在通知阶段再清一次旧关系。

Hook 合法重建的关系使用新的列表 Ref 条目，不属于外层旧候选，不被本次旧关系解除覆盖。每次回调后接续最新 BattleState，后续若仍需修改宿主或目标，重新读取当前对象与资格，不回填空间操作开始时的旧 Unit。

该顺序仅用于明确要求解除旧阻挡的空间操作。普通移动不因超出起始接敌半径而自动解除已有关系。

## 嵌套更新与完整结算

沿用项目已有领域操作契约：每次 unit.update() 返回时，当前状态所要求的关系失效清理、容量裁撤及对应同步 Hook 都已完成。嵌套调用与最外层调用具有同样的完整性保证，不增加 Blocking 特有的延迟维护或最外层统一收尾协议。

`unit.update()` 的任一目标不存在时抛出 RangeError；数组为空或所有元素都是当前 Unit 对象时返回原 BattleState；没有本次事实变更，不借无效更新触发关系维护。提交不同 Unit 对象的更新仍完整执行必要维护。

prepareUpdates 信任 unit.update 已确认的目标存在与 Definition 身份一致，并依赖同一 Definition 保持能力结构的既有契约，不重复验证这些前提。新写入关系所引用的端点仍须存在并具有相应能力，归属与双端关联仍须一致；这些是本次关系输入的校验，不能由更新目标合法性代替。

领域操作可以改变多个对象和领域事实。调用者必须接续返回的 BattleState；回调之后需要继续使用 Unit、关联条目、容量或资格时，从最新状态重新读取，不能依赖调用前的对象或剩余额度。

例如容量从 3 降至 1，外层先解除 E3。E3 的 Release Hook 若先调用 unit.update() 修改其他状态，该嵌套调用也会完成当前所需的维护，可能在返回前解除 E2；之后再增容到 2，不撤销已经发生的 E2 解除。若首先完成增容，再进行后续操作，则按新的容量继续维护。这个结果由实际调用顺序决定，不等待整个 Hook 返回后才处理嵌套更新。

归属解除时随之移除反向关联，关系业务通知前先补齐结构；已解除的通知不表示旧归属仍有效。整轮维护尚在执行时，通知入口可能仍处于暂时超容量的过渡状态。它与“某次完整 unit.update() 返回时必要维护已完成”是不同边界。后续裁撤继续读取最新关系与容量，不预先计算最终数组后覆盖嵌套结算。

完整更新保证沿用已定义的业务阶段，不等于每个中间版本都要求双端镜像一致。不能仅因 Blocker 列表尚未更新就自动取消 Blockable 已取得的归属，也不以正在执行外层 Blocking 操作为由跳过嵌套更新所需的维护。

unit.update 仅接收 readonly Unit[]，普通单单位操作传入 [unit]；必要维护可以涉及其他 Unit。批量输入表达一组最终状态，Blocking 先纯地合并所需对侧关联，Field 一次完成 Unit 与 Occupancy 写入，然后同步整批 Effect Dependency，再根据批前与批后关系确认变更。结构准备阶段不执行关系业务 Hook，也不递归调用完整更新。

显式准备双方时，不重复追加 blocked 条目，不覆盖同批对 owner 的其他修改。新关系必须通过整批最终状态下的资格、距离和容量检查；目标已经包含于最终 blocked 列表时不再次加算 volume，多条新关系共用同一最终容量预算。原有关系身份仍按保存的 Ref 对象保持，未改变的关系不因重建 Ref 而产生新取得通知。

```text
准备一组最终 Unit（包含本次关系两侧）
    ↓
一次更新 Battlefield 与 Occupancy
    ↓
同步本批全部 Effect Dependency
    ↓
确认关系变化及本次写入需要的维护
    ↓
逐项同步通知，接续最新 BattleState
    ↓
完成本次初始变化所需的维护并返回
```

不在 Hook 派发结束后追加一轮兜底全场扫描。Hook 发起的嵌套 update 自行完整处理其写入；外层不重写准备阶段的数据，也不接管嵌套操作产生的新维护任务。无 Hook 的普通容量或资格修改仍需由这次更新完整处理。

不能统一采用“先完成其余关系维护，最后通知本次归属变化”。例如 A 的容量从 3 降到 1，原列表为 E1、E2、E3：解除 E3 所用的 unit.update 若先递归裁撤剩余容量，会先解除并通知 E2，再通知 E3。E3 的 Released Hook 即使把容量恢复到 2，也来不及保留 E2。

本次解除写好归属、关联与索引后，先同步通知 E3 的关系变化，再依据 Hook 返回的最新容量决定是否继续解除 E2。嵌套 unit.update 仍执行完整维护，不能用禁止重入或外层收尾标志代替该顺序。新 Acquire 同样需要避免被无关维护的 Release Hook 抢在首次 Acquired 通知前终结。Acquired 派发每项执行前检查本次关系仍存在；Blocker Hook 内解除后，不再执行旧关系剩余的 Blocker 或 Blockable Acquired 响应。

## 取得归属与通知时点

取得使用先确定目标归属、再分别通知的政策：

```text
从最新 BattleState 检查双方资格、目标归属及容量
    ↓
E.blockable.blocker 确定为 A
    ↓
推进 A.blocker.blocked 的关联
    ↓
A 的 ACQUIRED Hook
    ↓
E 的 ACQUIRED Hook
```

Blockable 的归属必须在首次可重入回调前确定。A 的 Hook 中若 B 尝试取得 E，B 读取最新归属后拒绝；不需要额外的 ACQUIRING 状态、锁或全局登记表。允许中间阶段不代表可以把排他归属推迟到 A 的 Hook 之后。

字段写入不要求与该侧 Hook 相邻。E 先确定归属，不意味着 E 的通知先执行。任何可能重入的操作之后，后续字段修改都重新读取双方和同一次关系；原关系已终结时，不能回填旧字段或覆盖新关系。

## 两侧通知顺序

同一次关系变化先派发 Blocker 侧 Hook，再派发 Blockable 侧 Hook；嵌套关系操作及其 Hook 同步完成后，外层才继续后续通知。

例如 A 的 ACQUIRED Hook 解除原关联条目，嵌套 RELEASED 通知同步完成；外层检查旧关联已失效，停止 A 剩余及 E 的 ACQUIRED 响应。同一双方重新建立的新条目属于另一次关系，不能恢复旧关系的派发。取得事件已经发生，不回滚事件日志；这里只停止已失效关系尚未执行的响应。RELEASED 是解除后的历史通知，不以原关系仍存在作为执行资格。

Contribution 不处理自身生命周期，也不感知 Blocking 关系；它只提供登记、替换、移除及互斥归并。贡献何时安装、更新或移除，始终由外部 Effect／Content 或其他业务所有者负责，不向 Contribution 增加 Relation、owner、enabled 或生命周期绑定机制。

Blocking 保证每个 ACQUIRED Hook 开始时原关联 Ref 条目仍然有效。已经进入的 Hook 如果调用了其他可重入领域操作，后续依赖关系或宿主时仍须重新检查当前事实。贡献的安装与清理由外部所有者执行；清理应定位属于原关系的资源，不能误删后来重建关系的贡献，不给 Contribution 增加自身生命周期管理。

## 查询、Hook 与 Runtime 接入

battle/blocking/query.ts 提供 blockerOf(battle, ref)、blocked(battle, ref)、usedCapacity(battle, ref)；输入保留相应 Capability 的 Typed Ref。按 Ref 读取后检查对象是否仍存在，不重复检查 Ref 已证明的稳定能力。relations 只生成当前条目的只读投影，hasRelation 使用列表中保存的 Ref 对象判断具体旧关联是否仍有效；这一对象身份检查区分解除后重建的同双方关系，不属于重复能力校验。不存在独立的持久 Relation 实例。

Blocker／Blockable State 各自持有 acquired、released Hook 数组，使用 setHook(state, key, hook) 与 removeHook(state, key, id) 登记。同一次关系变化在第一个业务回调之前同时固定两侧候选 ID，逐项恢复最新同 ID 登记并检查 accepts；新增 ID 不参加本次通知，同 ID 替换使用最新登记。先 Blocker，后 Blockable；Context 固定原关系事实，BattleState 每项接续最新版本。ACQUIRED 每项执行前通过原关联 Ref 条目身份确认关系仍存在，RELEASED 不要求旧关系仍存在。BLOCKING_ACQUIRED／BLOCKING_RELEASED 事件在对应通知开始前记录。

Runtime 执行 Movement → Mechanism.advance → Blocking.advance → resolveRouteCompletion。最后一步只检查路线是否已完成和能否离场，不再次推进 Route。消费侧通过 relations(battle) 从两端状态取得 Typed Ref 关系，按需生成输出；不保存额外的全局权威关系。移动限制由 Blockable 的归属事实参与 Locomotion Rule 判断。

Core 的空间操作捕获旧条目，再写入新空间事实，通过 releaseCaptured 解除仍然存在的同一条目；普通位置更新仍不按距离解除旧关系。Lifetime 请求发布 LEAVING 前已登记 Pending 和结算标记，必要维护及 released Hook 可以重入请求，但不能开启第二个 drain。Unit 等真实依赖者整个 Finalize 后才物理移除；后续实时业务重读宿主，Departure 保留离场入口历史，返费则在标记发布及这些 Hook 返回后从最新 Unit 求值。

## 地块阻挡资格

Blocking 只选一个当前根格：有非空 `occupancy.tile` 时使用登记格；没有登记格时，以 `World.toTile(unit.position)` 回退到身体所在格。随后读取该格的 `state.allowsBlocking`。不额外以登记格的 `elevation === "HIGHLAND"` 拒绝，也不把登记格高度与另一身体格的阻挡许可拼成两条条件。显式配置的 `allowsBlocking: true` 在高地上仍然有效。

原生 `Character._SearchBlockee`（76016，`0x180a38200`）进入 `BlockManager.SearchBlockee`（77190，`0x180aa09e0`）；普通地面分支通过 Entity.rootTile 读取 `Tile.isMeleeBlockable`。`Character.get_rootTile`（75833，`0x180a3c1d0`）返回保存的 `m_rootTile`，不是每次由世界位置重新取格。项目以 Occupancy 表达已登记角色的根格；无登记对象的身体格回退是项目的统一查询政策。

`Tile.get_isMeleeBlockable`（70673，`0x1808c6070`）先读黑板 `tile_blockable`，有值直接返回，未配置才取 `!isHighland`。`Tile.get_isHighland`（70670，`0x1808c5f10`）默认读取 TileData 的原始高度；它与读取当前 Options 的 `get_heightType` 不是同一字段语义。因此普通高地的显式阻挡许可不能被当前 elevation 的硬判断覆盖。

射击台另有内容规则。本机 `trap_1106_achplat` 的 `trap_1106_achplat_passive` 在 `ON_OWNER_OVERLAPPED` 向乘员创建 `highland_common[block]`；后者对 WALK 阻挡模式施加带 `BLOCK_FREE` 的派生 Buff，并随阻挡模式变化维护。`Tile.RegisterCharacter`（70726，`0x1808c1eb0`）通知 `BuffContainer.OnOwnerOverlapped`（65410，`0x1806764e0`），`SearchBlockee` 再通过 `Entity.isBlockFree`（66511，`0x180705590`）拒绝接敌。这证明平台禁阻挡来自具体内容，不是所有高地的通用规则。当前项目只覆盖地面关系，射击台 Content 通过 Occupancy 的 SUPPORT occupantAdded Hook 在当前乘员的 blocker.rules 登记平台自己的 Rule，禁止其与任何目标建立或保留阻挡；occupantRemoved Hook 同步移除该平台规则，不改变地块 `allowsBlocking`。尚未复刻按 WALK／空中阻挡模式切换的完整 Buff 行为。

## 阻挡模式的表达边界

[原生模式调查](../research/evidence/blocking-native-20261023/modes/report.txt) 已确认阻挡者的 `blockMode` 与目标的 `changeableMotionMode` 需要匹配，`ignoreBlockMode` 可豁免；`pathMotionMode` 只负责寻路，`BlockFree` 是独立的禁挡状态。当前各事实的归属如下：

| 原生事实 | 当前表达能力 |
| --- | --- |
| 目标当前运动身份 `changeableMotionMode` | 现有 `Layer.state.type` 的 GROUND／AIR 可表达目标当前空地身份，不需另存一份 Blockable motion。 |
| 寻路模式 `pathMotionMode` | Route 的 Progress 已独立保存，并有 `setPathMotionMode`；不得用它代替阻挡资格。Locomotion 消费此模式处理运动，但不保存第二份身份。 |
| 阻挡者 `blockMode` | 表示允许阻挡的目标运动模式，是关系资格，不是“被阻挡后停止移动”。不能从阻挡者自身 Layer 推导，但可以用二元 Rule 按目标 Layer 表达策略，不因原生存在该字段就要求新增共享状态。 |
| `BlockFree` 等禁挡状态 | 现有双端二元 Rule 可表达，不需要第三个模式或新的 enabled 字段。 |

“被阻挡后停止自主移动”已经由 Movement 根据 `blockable.blocker !== null` 跳过 Locomotion 推进实现，不安装另一条禁移动 Rule，也不新增 blocked 状态或 BlockMode。

当前接入的阻挡者均使用地面阻挡，`canRetain` 的目标 GROUND 限制只是该支持范围，不是完整模式匹配。当前也没有随原生 FLY 阻挡实现地块资格豁免、独立半径、忽略模式或模式切换时清除旧关系；射击台现有规则只覆盖已接入的地面阻挡者。

这些是尚未覆盖的行为，不直接证明缺少某个共享字段。本轮不新增模式类型或状态；以后接入空中阻挡或实际模式切换时，先用现有 Layer、Rule 和内容状态表达资格，再落实相应地块、半径及关系维护语义。只有实际多处消费同一个独立事实时，再决定共享状态的归属；不要复制三个原生字段，也不要把禁挡写成 NONE 模式。

[蒂比案例调研](../research/cases/21-tippi-air-blocking.md) 已用实际 Prefab／Buff 闭合起飞与落地：本人仍为 WALK，起飞切换阻挡模式并独立施加对地规避；半径变为 0.8944、获得近战地块条件豁免，切换时清理旧关系。当前目标 GROUND 硬限制、无条件地块许可及射击台恒 false Rule 是接入空中阻挡的实际障碍；普通关系已经足以停止飞行目标自主移动，不需要新的移动禁止机制。本轮仅补充研究依据，尚未修改这些资格或实现蒂比内容。

## 未完成的原生机制

- **阻挡模式与完整资格。** 当前地面阻挡消费当前根格的 `Tile.state.allowsBlocking`，阵营及特殊资格由显式 Rule 表达。地图适配按 `tile_blockable ?? (初始高度为LOWLAND)` 生成初值，不从可通行性或可部署性推断。独立空中阻挡及完整特殊资格组合尚未覆盖，具体表达边界见上节。
- **阻挡站位修正。** 原生接敌会影响实际位置，不能只交给表现层；当前关系模型没有加入位移插值状态。
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
| A 的 ACQUIRED Hook 内，B 尝试取得同一 E | E 已明确归属 A，B 的尝试失败；通知仍按 A 先、E 后处理原关系事实 |
| 写入目标归属并自动补齐正向关联 | 补齐阶段不执行关系业务 Hook；回调前有序关联与归属相符，容量统计和裁撤不遗漏新条目 |
| 每 Tick 统一搜索、阶段内新增 Blocker，以及同 Tick 普通与显式搜索 | 固定本阶段候选；新增 Blocker 下一 Tick 正常参与；合法立即搜索不被普通调度去重抹掉 |
| 搜索中增容、减容、提前接敌及新增单位 | 固定候选，实时容量；增容允许后续候选本轮接敌，已被阻挡的候选跳过，新单位不加入 |
| 解除旧关系的 Hook 提前解除另一旧候选，并重建相同双方的关系 | 按列表中 Ref 条目对象身份确认旧候选，新建关系不被外层旧候选误删，同一旧关系不重复通知 |
| 明确要求断开旧阻挡的空间操作，解除通知中重入搜索或修改 Unit | 先捕获旧对象、更新空间事实，再解除旧关系；Hook 读取新空间事实，外层不误删新关系或回填旧 Unit |
| Release Hook 先进行嵌套 unit.update()，再增加容量 | 内层返回前完成当时必要的裁撤，后续增容不撤销已经发生的解除；外层继续读取最新状态 |
| 容量由 3 降至 1，E3 的 Release Hook 将容量恢复为 2 | 验证本次解除通知与后续维护的顺序；不得因先递归裁撤而让 E2 失去该 Hook 的增容机会 |
| 关系建立／解除使 Contribution 登记或撤销 | Capability 纯修改方式不变；完整提交后维护与通知已完成 |

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

