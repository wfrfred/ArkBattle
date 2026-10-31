# Projectile 设计

Projectile 是具有空间位置的独立执行实例，存于 Battlefield。框架管理身份与生命周期，Definition 管理行为；运动、命中与终结是实例内部的不同过程，不固定成“飞行 → 命中 → 消失”的流水线。

接口遵守[五类约定](api-conventions.md)：完整操作接收 battle 与 Typed Ref，Definition 回调直接接收 self，当前时间来自 battle.tick。

## 1. 领域边界

- Projectile 不继承 Unit，不引入通用 Entity，也不另建 Capability Catalog、Behaviour Registry 或通用事件总线。
- Geometry 与 Battlefield Spatial Query 提供几何和空间候选；需要重新选择接收者的具体行为调用 Targeting。范围原点可以是弹道位置或落点，不等同于属性来源 Unit 的位置。
- Damage、Healing、Effect 执行各自的完整结算。Projectile 是这些操作的调用方，不因读取来源攻击力而具有 Offense，也不因施加 Effect 而自动成为 Effect 宿主。
- 来源身份、属性采样和来源存活依赖分别表达。保存 source 不自动建立生命周期父子关系；Action 结束也不自动终结已经创建的 Projectile。
- 可复用的追踪、运动与命中函数根据具体内容形成，不把原生 Behaviour 逐项映射成框架组件。

## 模块归属

- [projectile/index.ts](../../src/core/projectile/index.ts) 是类型与 ref／all／get 的显式公共入口；完整 Battle 操作仍直接从 battle/projectile.ts 导入，不为入口汇聚搬动模型或操作。
- `projectile/projectile.ts`、`definition.ts`、`event.ts` 定义实例、内容程序与事件类型。
- `projectile/query.ts` 提供 `all`、`get` 和 `ref`，与 Unit 查询入口一致。all 返回绑定传入 BattleState 版本、按登记顺序惰性遍历的 Query<Projectile>，不自动筛选生命周期或转换 Ref；get/ref 保留 Typed Ref 中的已知对象类型。
- `projectile/projectiles.ts` 封装异构完整实例的存储与类型恢复，不推进生命周期。
- `battle/projectile.ts` 提供完整 `create`、`update`、`stop` 和 `advance`，直接替换 Battlefield 中的不可变 Projectiles 容器，负责身份、回调、事件与终结；不另设 Battlefield 转发操作。
- `battlefield/state.ts` 定义唯一公开 State 与 create；Unit 的纯 `add`、`update`、`remove` 位于 `battlefield/unit.ts`。

Battle 层的 update 只允许内容计算 position 和私有 state，Core 基于当前实例构造新值，因此身份、Definition 和生命周期自然保留，不另设完整实例更新接口或重复校验层。Field 继续拥有 Projectiles 状态，但不分配战斗身份或执行内容回调。advance 接收 Runtime 在整个 Tick 开始时捕获的候选 Ref，不在 Projectile 阶段重新枚举集合。

## 2. 实例与 Definition

`projectile/projectile.ts`：

```typescript
import type { Identified } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Definition } from "./definition.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface Projectile<S extends object = object> extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: Definition<S>;
    readonly lifecycle: Lifecycle;
    readonly position: WorldPosition;
    readonly state: S;
}

```

`projectile/definition.ts`：

```typescript
import type { State as BattleState } from "../battle/state.js";
import type { Projectile } from "./projectile.js";

export type StopReason =
    | "ARRIVED"
    | "EXPIRED"
    | "EXPLICIT"
    | "SOURCE_UNAVAILABLE"
    | "DISPEL";

export interface Definition<S extends object = object> {
    readonly id: string;

    readonly onStart?: (
        battle: BattleState,
        self: Projectile<S>,
    ) => BattleState;

    readonly onTick?: (
        battle: BattleState,
        self: Projectile<S>,
    ) => BattleState;

    readonly onEnd?: (
        battle: BattleState,
        self: Projectile<S>,
        reason: StopReason,
    ) => BattleState;
}
```

S 是内容私有的运行状态，可以包含运动进度、目标身份、记忆位置、命中历史、来源、数值样本和业务计时，也可以没有其中某些部分。根实例不强制保存来源、追踪目标、攻击力样本、速度、接触范围、停止期限或推进 Tick。

普通查询直接返回完整 Projectile<object>，包含 state 与原 Definition；object 表示尚未证明具体私有形状，不另设元数据实体或复制定义。精确 Ref／Definition 查询保留具体 S，Core 从同一实例调用其自身 Definition 的程序。追踪弹道的 tracking.project(battle, ref) 仍在内容层生成实际需要的 Presentation 数值投影，不承担实例恢复。

Definition 直接共享。三个回调都可选，派发方已经确定实例与 Definition 的泛型配对，直接传 self，不再要求回调先按 Ref 查询一次。self 表达进入该次回调时的实例值；跨领域操作返回后，需要当前状态或资格时，按 Ref 从最新 battle 重读，遵守[状态接续约定](functional-core.md#状态接续后的读取与续执行)。

StopReason 使用单层联合，DISPEL 是其中一种原因；不另套 STOP／DISPEL 的 Termination 包装。原因既供内容选择收尾政策，也供事件记录。框架不需要为每个原因建立不同的生命周期分支，原因枚举随实际案例校准。

## 3. 异构集合与类型恢复

Battlefield 持有不可变 Projectiles，容器内部以私有 `Store<Id, Projectile<any>>` 保存完整实例。Store 不理解 Ref、Definition、泛型关联或生命周期；关联由 Projectiles 的写入入口建立，擦除与恢复集中在容器内部。

| 容器接口 | 契约 |
| --- | --- |
| `Projectiles.empty()` | 空容器。 |
| `get(id)` | 返回默认 object 的完整 Projectile。 |
| `get(reference)` | 根据精确 Ref 恢复调用方已知的实例类型。 |
| `get(id, definition)` | 检查 Definition 对象身份后返回对应 Projectile<S>；字符串 id 相同不等同于同一定义。 |
| `values()`／`keys()` | 返回绑定当前容器版本、保留登记顺序的 Query。 |
| `add(self)` | 委托 Store.add 保存完整实例，重复键由 Store 拒绝。 |
| `replace(reference, next)` | 按 reference.id 委托 Store.replace 写回；缺失键由 Store 拒绝，同一实例对象保留原容器。 |
| `remove(id)` | 委托 Store.remove 移除身份，缺失键由 Store 拒绝。 |

Projectiles 信任 Core 已构造的完整实例，不在 replace 重复检查 Ref 与实例 id、Definition 或缺失键，也不包装 Store 的异常。完整领域操作在构造更新值时保留 Definition；Typed Ref 与 Definition 的类型恢复仍由容器封装；内部 any 只擦除异构参数，普通 get／values 返回 Projectile<object>，不把 any 作为公共默认值。

身份计数器属于 Battle 执行状态，创建流程直接使用分配器产生的身份与调用方提供的 Definition，不重复校验身份数值、Definition.id 或理论计数溢出，也不增加 Definition 工厂。替换不改变登记位置，删除后新增排在末尾。查询惰性、可重复遍历，绑定入口不可变容器就已固定候选来源；推进接收 Iterable<Ref<P>>，在操作处生成 Ref，不要求预先物化数组。

## 4. 创建、查询与内容更新

```typescript
export interface CreateInput<S extends object> {
    readonly position: WorldPosition;
    readonly state: S;
}

export function ref<P extends Projectile<any>>(self: P): Ref<P>;

export function get<P extends Projectile<any>>(
    battle: BattleState,
    reference: Ref<P>,
): P | undefined;

export function create<S extends object>(
    battle: BattleState,
    definition: Definition<S>,
    input: CreateInput<NoInfer<S>>,
): Result<Ref<Projectile<S>>>;

export function update<T extends Projectile<any>>(
    battle: BattleState,
    reference: Ref<T>,
    changes: {
        readonly position?: WorldPosition;
        readonly state?: NoInfer<T["state"]>;
    },
): BattleState;

export function stop(
    battle: BattleState,
    reference: Ref<Projectile<any>>,
    reason: StopReason = "EXPLICIT",
): BattleState;
```

ref 保留已知实例类型；get 只读取传入 battle 的版本，不隐含 ACTIVE 筛选，ENDING 实例在注销前仍可查询。跨 Battle 使用 Ref 属于调用契约错误。

创建方直接提供完整 state 和已确定的 Definition，不先执行无参数 initialize 再覆盖初态。需要采样属性、消费 RNG 或读取目标时，由内容构造过程明确接续 BattleState，再把确定的初态交给 create。

创建顺序：

```text
分配身份，更新身份计数器并登记 ACTIVE 实例
    ↓
onStart(battle, self)
    ↓
返回最新 BattleState 与创建时分配的 Ref
```

身份计数器与实例登记均在 onStart 前生效；嵌套 create 不复用身份。onStart 可以同步终结自己，因此返回 Ref 不保证返回时实例仍存在；外层不得在回调之后重新写回旧实例。

update 接收已经计算好的 `{ position?, state? }`，从传入 battle 读取最新实例；缺失时抛出 RangeError。调用方先查询当前实例，局部计算位置与私有状态后一次提交；计算与提交之间不执行其他完整操作，跨领域调用后先接续 battle，再重读所需实时状态。

未提供的字段保留当前值，不隐含合并 S 内部字段。两个字段均未变化时返回原 BattleState；ACTIVE 和 ENDING 均允许更新，终结回调仍可能需要提交命中记录或清理进度。Core 只提取 changes 中的 position／state，不直接展开输入对象；id、Definition 与 lifecycle 不进入此接口的写入边界。

`NoInfer` 阻止输入结果值反向放宽由 Definition／精确 Ref 确定的 S。私有更新必须保留实例与 Definition 对应的原始类型关联；Ref 可以弱化用于公共查询，主动弱化后写入不兼容的私有状态属于调用契约错误，不增加运行时数据形状检查。

## 5. 时间推进

Runtime 在整个 Battle Step 开始、任何可能创建或终结弹道的阶段操作之前，捕获本次 Projectile 候选 Ref；到 Projectile 阶段再按登记顺序逐项读取最新实例，只推进 ACTIVE 对象。

候选固定的是身份，不是实例快照。前一回调可以终结后面的候选，后者到执行时会被跳过。捕获名单之后新创建的弹道不参与本次正常推进；Step 开始前已经登记的实例会进入本次名单，包括初始化已有的弹道。创建回调与显式 stop 仍可在当前同步调用中立即执行。

正常时间推进只有 Runtime 调度的入口，不允许内容推进其他实例。同 Tick 重复调度属于调度器错误，不保存 lastAdvancedTick，也不用创建 Tick 替代候选边界。

onTick 可以移动、报告到达、命中、等待、切换运动方式或发起终结。到达后不再移动的实例仍可以保持 ACTIVE 并执行周期业务。职责分离不要求全场先统一运动、再统一命中、最后统一终结；具体过程可以同步调用并立即接续返回状态。

## 6. 终止请求、Finalize 与事件

停止操作接收 StopReason，委托 Projectile 的静态 lifetime。请求阶段与 Finalize 分开：

```text
从最新 battle 确认 ACTIVE
    ↓
登记 Pending，发布 ENDING
    ↓
Prepare 记录 PROJECTILE_STOPPED，保留首次 StopReason
    ↓
请求依赖者；最外层结算器等待其完整 Finalize
    ↓
Finalize 从当前实例调用 onEnd(battle, self, reason)
    ↓
从回调返回的最新 battle 注销实例；整个返回后移除 Pending
```

重复请求先查 Pending，首次 StopReason 与传播原因不变，不重复事件与回调；缺失时不创建工作。ENDING 阻止后续正常推进，不无差别拒绝终结程序中的命中、位置／私有状态更新和 Effect 清理。

无活动 Lifetime 结算时 stop 在本次调用内完成整批 Finalize；有活动结算时，首次嵌套 stop 只保证 Prepare，不保证实例已从 get／all 消失或 onEnd 已执行，重复 PREPARING 请求也不等待。Pending 在整个 Finalize 返回前保留，即使领域先物理注销、再执行末尾业务，真实依赖关系也仍能约束上游完成。独立 Projectile 不因来源 Unit／Action 结束而自动成为依赖者。

普通停止可以执行该内容的原目标保底、停止爆炸及其他收尾；DISPEL 是否跳过命中、执行什么专属业务由 Definition 确定。两者共用相同的生命周期保护与注销过程，清理可在同一个 onEnd 中完成。

注销使用最新容器，保留回调中新建或修改的其他实例。注销后不保存长期驻留的 STOPPED／DESTROYED 状态，不增加 onDestroy 回调。PROJECTILE_STOPPED 记录进入终结的事实，因此收尾中仍可能记录命中事件；它不代表收尾已经全部完成。

到达与命中事件由具体内容在实际业务节点记录，Core 不因停止自动补发 REACHED 或 HIT，也不把三个事件固化成固定顺序。

停止不会自动截断已经进入的同步调用栈。内容继续依赖实例活动资格时必须重读；旧 self 可以继续代表本次已发生的事实，不能被当作最新可写实例。延迟业务执行前同样需要确认资格，不能仅依赖最后一次 stop 防重来阻止前面已经发生的输出。

## 7. 命中与内容状态

基础 Definition 不增加固有 onHit。原目标直选、落点范围、沿途接触和周期重新索敌各自取得接收者并检查资格，不统一套用空间重叠或普通伤害 Filter。

命中记录在相应内容回调前提交，避免同步重入重复取得同一次命中。终结防重、原目标保底尝试、历史范围与次数预算分别表达。Reached 与 Stop 的保底可以共享记录，周期业务按实际政策划分轮次；不默认整条弹道生命周期内每个单位只能命中一次。

命中过程不统一要求 Targetable、Hitbox 或 Vitality；这些要求由取得接收者的入口与最终 Damage／Healing／Effect 操作声明。Hit 入场与实际 HP 变化分别观察。

| 内容 | 私有状态与执行方式 |
| --- | --- |
| 普通弩箭 | 保存原目标、记忆位置、来源、速度、ATK 样本和必要的命中记录；推进追踪，在到达与普通停止入口协调原目标命中。 |
| 慑砂 S2 | 保存运动进度及到达后的停止期限；等待时保持 ACTIVE，普通停止在实际落点执行爆炸命中。 |
| 承曦格雷伊 S2 | 保存到达状态、周期触发时间、停止期限及周期命中进度；到达后继续正常推进周期业务。 |

这些案例约束过程的可表达性，不据此预先增加统一运动枚举、命中组件、通用计时器或第二套注册机制。追踪内容直接用当前 Tick 加延迟计算停止期限，不为理论上的安全整数溢出增加检查或回退。

## 8. 语义边界与研究依据

- **消除资格按内容确认。** 已知原生存在拒绝消除的情况；完整“尝试消除”是否需要独立结果由实际内容决定，不提前增加 Rule 或 canDispel 字段。
- **来源死亡后的取值差异独立处理。** 当前致死后立即注销 Unit，可能比原生更早转用缓存 ATK；不通过把 Projectile 变成 Unit 或新增尸体运行阶段默认解决。

原生事实与证据分别见[运动与命中](../research/cases/16-projectile-motion-and-hit-boundaries.md)、[停止与终结](../research/cases/17-projectile-stop-and-termination.md)、[来源与目标生命周期](../research/cases/18-projectile-source-and-target-lifecycles.md)。研究证明职责需要分离，不要求复刻原生 Behaviour 系统；特殊命中辅助函数和统一计时政策仍由实际内容验证后形成。
