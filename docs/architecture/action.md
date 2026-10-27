# Action 设计

Action 负责行为程序的选择、启动、推进与完整终止。具体内容通过释放通知和内容程序点组合 [Skill](skill.md)、[Effect](effect.md) 与其他领域操作。

接口遵守[五类约定](api-conventions.md)：完整操作使用 battle 与 typed Ref，Definition 程序使用 battle 与 self，当前时间来自 battle.tick。

> **Definition 保存基础间隔、基础速度、持久状态初始化与执行程序；Unit 的 Action Capability 保存每个配置项的持久数据与 Cooldown、运行实例集合，以及贡献和启动规则；Action 保存一次执行的私有进度。推进由 Runtime 调度。**
>
> 同步嵌套遵守[状态接续约定](functional-core.md#状态接续后的读取与续执行)：后续需要当前对象或资格时重读，明确采样与历史载荷保留，不用旧实例覆盖嵌套更新。

## 1. 状态与领域职责

| 对象 | 职责 |
| --- | --- |
| unit/action/Definition | 行动身份、基础 intervalTicks／speed、持久 initialize、start／step 与可选 onEnd |
| Unit Action Capability Definition | 已配置的异构 Definitions 集合和可选 select 程序 |
| Unit Action Capability State | 按 Definition ID 区分的持久状态、运行实例集合、interval／speed 贡献、启动 Rule、释放前拦截与成功释放通知 |
| unit/action/State | 已配对的 Definition、持久私有 data 与 Cooldown，每个 Unit 的每个配置项各有一份 |
| Action | 宿主内单次执行身份、typed host、Definition、startedAtTick、status 和私有 state |
| Runtime | 固定候选、逐项推进与启动、接续状态，成功后发布整 Tick |

Cooldown 表达同种行动何时可以再次启动；Casting 表达实例尚未完成终止。同 Unit 同配置 Definition 的 RUNNING／ENDING 实例占用该启动位置。不同 Definition 可以同时存在；互斥、抢占与等待由内容选择、启动 Rule 和明确取消表达。

Rule 只负责启动准入，不自动中断现有实例。眩晕等需要中断的内容显式调用 cancel／cancelForUnit。

## 2. 模块与导入

执行定义、实例、容器和生命周期操作位于 unit/action/；配置、贡献、Cooldown、Rule 与释放 Hook 位于 unit/capability/action/。领域内使用 Definition、State、Action、Id 等局部名字，不重复领域前缀，不建立仅缩短路径的转发层。

```typescript
import type { Definition as ActionDefinition } from "./action/definition.js";
import type { Action } from "./action/action.js";
import type { Action as ActionCapability } from "./capability/action/capability.js";
import * as actions from "./action/operations.js";
```

消费侧按实际角色选择具名导入、命名空间或别名，不机械要求 definition.Definition。

## 3. Definition、实例与 Typed Ref

```typescript
export type End =
    | { readonly type: "FINISHED" }
    | { readonly type: "CANCELLED"; readonly reason: string };

export interface Definition<P extends object, E extends object> {
    readonly id: string;
    readonly intervalTicks: number;
    readonly speed: number;
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly start: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: State<P, E>,
    ) => Result<E | null>;
    readonly step: (battle: BattleState, self: Action<P, E>) => Result<boolean>;
    readonly onEnd?: (battle: BattleState, self: Action<P, E>, end: End) => BattleState;
}

export interface State<P extends object, E extends object> {
    readonly definition: Definition<P, E>;
    readonly data: P;
    readonly cooldown: CooldownState;
}

export interface Action<P extends object, E extends object> extends Identified<{
    readonly host: Ref<Unit & ActionCapability>;
    readonly id: number;
}> {
    readonly id: number;
    readonly host: Ref<Unit & ActionCapability>;
    readonly definition: Definition<P, E>;
    readonly startedAtTick: number;
    readonly status: "RUNNING" | "ENDING";
    readonly state: E;
}
```

Definition.initialize 在 Unit 初始化时逐项执行，创建每个配置项的 P 并接续 Result.state；即使从未启动，该状态也已经存在。共享 Definition 的不同 Unit 各自初始化，私有数据不共享。此时宿主尚未登记，不能从战场查询自己或假设兄弟能力已经可用。start 不补建缺失的持久状态。

start 取得当前已配对的持久 State，只检查本次内容条件、初始化 E 和必要采样；null 表示未启动。已发生的状态更新接续返回，普通无变更拒绝返回输入 battle。伤害、召唤、绑定本次 Action 的 Effect 及可能同步重入的业务，在实例登记后由 step 执行。start 初始化阶段不递归启动自己或改变来源配置。

step.value 表达是否完成；私有进度通过 `update(battle, ref(self), current => next)` 写入后继状态。transform 取得传入 battle 中的当前执行 state，只返回新的私有值；不会在 callback 返回时自动覆盖 self.state。需要被嵌套观察的进度先写回，再进入外部业务。

ref(self) 返回包含 host 与宿主内 id 的 Ref，保留具体 Action<P, E> 类型；公共 Ref 使用 common/ref.ts 的 Identity 与 Phantom。start 接收 typed Definition<P, E>，成功返回 Ref<Action<P, E>>，从创建到传递和查询保持 P／E。以纯字符串启动不能产生相同的类型证明，因此自动调度在 Definitions.read 的泛型边界内完成启动。

## 4. 异构集合与查询

Definitions、Actions 与持久 States 分别以私有 `Store` 保存完整对象，不对外暴露可写 Store。`values()`／`keys()` 返回绑定该容器版本的 Query，保留登记顺序；替换不改变位置，删除后新增排在末尾。

各模块的公共 `View` 只声明查询需要的事实：Definition 的 id／intervalTicks／speed，Action 的 host／id／startedAtTick／status 与定义元数据，持久 State 的定义元数据与 Cooldown。普通 `get(id)`／`values()` 不公开私有 data／state 或完整回调。精确 Ref 查询保留调用者已有的完整实例类型；`read<R>(id, reader)` 在未知配置项上保持 P／E 配对，`get(id, definition)` 通过 Definition 对象身份取得具体类型。实例查询使用 Ref 时同时检查 host 与本地 id。

Definitions.empty().add(definition) 保留程序与 P／E 的配对，ID 在同一配置集合内唯一。每个宿主的 Actions.empty() 保存该宿主执行实例和 nextId，删除不回收身份；不同宿主可拥有相同实例 id，完整身份为 host 与 id。

Action Capability 本身非泛型。getState(battle, source, definition) 以具体 Definition 对象身份恢复持久 State<P, E>；replaceState(battle, source, self) 写回已配对条目。内部 read 在未知配置项上执行保持 P／E 配对的程序，不让调用方自行指定类型恢复。

```typescript
export declare function all(battle: BattleState): readonly Ref<View>[];
export declare function forUnit(battle: BattleState, source: Ref<Unit>): readonly Ref<View>[];
export declare function get<A extends View>(battle: BattleState, ref: Ref<A>): A | undefined;
export declare function isCasting(battle: BattleState, source: Ref<Unit>, definitionId?: string): boolean;
```

这里的 View 来自 `unit/action/action.ts`，身份、终结接口与 Lifetime 不依赖容器枚举返回类型。all／forUnit 返回已物化的候选 Ref 数组；isCasting 包括 ENDING 占位，直到完整终止移除为止。

快照使用独立的 Snapshot 投影，允许携带不解释其类型的私有载荷。Actions.toJSON 保存实例与 nextId；States.toJSON 保存持久条目及 data。快照数据不重新进入普通 View，也不作为 Definition／回调的 JSON 恢复协议。

Unit.action.instances 是该宿主唯一运行实例容器；BattleState 不另存全场 Action 集合。保留旧 State 即保留各宿主容器及 nextId。all 按 Unit 集合顺序依次展平各宿主实例，forUnit 直接查询宿主；不承诺全场启动顺序。实例直接共享不可变 Definition，私有 state 与身份进度保留；不要求含程序函数的整份 Definition 参与 JSON roundtrip。没有额外 Definition 注册表、lastAdvancedTick 或重复推进容错字段。取消命令携带完整 Ref；领域事件用 sourceUnitId 与宿主内 executionId 共同标识实例。

## 5. Capability 与冷却

```typescript
interface Definition {
    readonly definitions: Definitions;
    readonly select?: (battle: BattleState, self: Unit & ActionCapability) => Result<readonly string[]>;
}

interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, self: Unit & ActionCapability, definitionId: string) => boolean;
}

type Input = readonly Modifier[] | ((battle: BattleState, self: Unit & ActionCapability) => readonly Modifier[]);

interface State {
    readonly states: States;
    readonly instances: Actions;
    readonly interval: readonly Contribution<Input>[];
    readonly speed: readonly Contribution<Input>[];
    readonly rules: readonly Rule[];
    readonly beforeRelease: readonly ReleaseHook[];
    readonly released: readonly ReleasedHook[];
}
```

局部 setIntervalContribution／setSpeedContribution 只返回局部 State；完整操作在贡献实际改变的时点调用 refreshCooldowns(battle, source)，按完成比例换算旧周期。动态查询采用 resolveBaseInterval／resolveSpeed／resolveInterval(battle, source, definition)。需要从战场读取的 Contribution 继续取得明确的只读事实。

普通攻击周期依据 [PRTS 攻速公式](https://prts.wiki/w/游戏数据基础#攻速公式)：修正间隔 × 100 / 限制后的速度。速度属性下限为 20，周期计算速度上限为 600，有效周期至少为 1 Tick。纯 Cooldown 支持非负连续周期，不在纯值函数中强加攻击的量化限制。

每个 states 条目包含配对的 Definition、私有 data 与 Cooldown。Cooldown 保存 periodTicks／readyAtTick；Unit 初始化时建立初始就绪条目，reset 从当前时点开始完整周期，clear 立即就绪。resizeKeepingProgress 保留完成比例，resizeKeepingElapsed 保留绝对已过时间，二者明确分开。

成功启动开始周期；结束和取消不默认重置或清空。refreshCooldowns 只更新已初始化条目的周期；resetCooldown／clearCooldown 明确控制指定配置行动。普通攻击不足一 Tick 余量的节奏政策由具体攻击程序处理，不进入通用 reset；修正所用的先前到期时间在内容 start 返回的最新 BattleState 中采样，不能沿用回调前的冷却快照覆盖本次修改。

## 6. 完整启动、写回与终止

```typescript
export type StartOutcome<P extends object, E extends object> =
    | { readonly type: "STARTED"; readonly ref: Ref<Action<P, E>> }
    | { readonly type: "REJECTED"; readonly reason:
        "SOURCE_UNAVAILABLE" | "RULE" | "COOLDOWN" | "CASTING" | "CONDITION" };

export declare function start<P extends object, E extends object>(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
): Result<StartOutcome<P, E>>;
export declare function cancel(battle: BattleState, ref: Ref<View>, reason?: string): BattleState;
export declare function update<P extends object, E extends object>(
    battle: BattleState,
    ref: Ref<Action<P, E>>,
    transform: (current: NoInfer<E>) => NoInfer<E>,
): BattleState;
```

start 检查来源当前资格、配置对象身份、同 Definition 占用、Rule、Cooldown 和内容条件。未配置 Definition 属于调用／配置错误；普通拒绝不分配实例或启动周期。STARTED 表示已受理，首次 step 可能立即完成或被同步取消，因此返回时 ref 可以已经失效。

update 从最新 battle 读取实例，只把 transform 的结果写入私有 state；不接收整份 Action，也不改变 id、host、Definition、startedAtTick 或 status。宿主或实例缺失时抛出 RangeError，处于 ENDING 时抛出 TypeError，均不执行 transform；transform 返回当前 state 引用时同样返回原 battle。transform 是纯局部值转换，不修改输入、不消费 RNG，也不执行嵌套领域操作。

需要累加或保留其他私有字段时，从 transform 的 current 构造结果，不捕获旧 self.state 来覆盖当前数据。外部业务调用后的存在性、生命周期与其他资格仍按状态接续契约重新确认，不引入版本锁。`NoInfer` 只限制 transform 参与泛型推导。私有更新必须保留实例与 Definition 对应的 P／E 类型关联；Ref 可协变查询，借预先弱化的完整 Ref 写入不兼容私有数据属于调用契约错误，不增加运行时数据形状检查。

底层 `Actions.replace(ref, next)` 供 Core 提交已经配对的完整实例，信任内部构造的身份、Definition 与 startedAtTick，保持缺失时不重建；精确 Ref 查询仍匹配 host 与本地 id。进入 ENDING 等生命周期变更由 Core 的完整终止流程调用它；内容更新私有进度使用 update。

持久 data 与执行 state 分别写回。start 回调返回后重新读取当前宿主与持久条目，按最新周期重新确认冷却准入；回调使自身进入冷却时返回 COOLDOWN，保留已结算的回调修改，不创建执行实例或重新启动周期。仍可启动时才基于最新宿主一次写回本次周期和新实例，保留 data、兄弟配置项及其他能力修改。完成、取消只移除本次执行 E，不删除或重新 initialize P；内容需要重置某个持久计数时明确更新。持久状态随宿主生命周期结束，不隐含跨部署保存。

终止顺序为：RUNNING → 写入 ENDING → 关闭 ACTION lifetime 及依赖 → 读取最新私有状态进入可选 onEnd → 移除实例 → 登记结束事件。重复终止看到 ENDING 不重复收尾；结束过程仍占同配置启动位置。

onEnd 可在宿主已因嵌套离场而消失时凭已捕获的终结快照执行；结束后只从最新仍存在的宿主移除实例，不重新插入 Unit。终止不等待外层 step 退出。外层代码继续普通控制流，并按后续业务需要重新确认状态。结束回调抛错继续由 Runtime 整 Tick 发布边界处理。

cancelForUnit 是同领域的批量完整取消。Unit 离场通过该接口终止 Action，不直接编辑内部集合；Action 取消原因 SOURCE_ABSENT 与依赖 Effect 的原离场原因分别保留。

## 7. 调度

Runtime 采用以下候选政策：

1. 固定本轮 Unit 候选及每个宿主当时的 Action Ref，Unit 按 ID 排序。宿主离场由完整离场操作终止其 Action，不保存脱离宿主的孤立实例。
2. 对每个 Unit，先推进原有实例，再从最新状态运行该 Unit 的 select。
3. select 返回本轮候选 ID 及接续状态，可以表达优先级、随机选择和具体模式政策；未提供时尝试全部配置行动。
4. 候选去重后逐一 start，每次读取最新来源与配置。列表顺序不代表引擎赋予的业务优先级。
5. start 登记后立即首次 step；常规扫描仅推进 startedAtTick 早于当前 Tick 的实例，因此同步新建实例不会重复首推。
6. 本轮自动候选只尝试一次，不按“仍然就绪”循环重启即时完成的同一行动。

advance(battle, ref) 位于专用推进模块，仅由调度器及启动后的首次执行使用。内容使用启动、取消、实例写回及具体领域操作，不推进别人的实例。没有实例级同 Tick 去重状态。

## 8. 普通攻击、释放 Hook 与移动

可复用普通攻击程序位于 content/actions/attack.ts，直接调用 Damage、Healing 与 Elemental 的公开操作。它在 start 绑定目标并保存 releaseAtTick／finishAtTick、released 等执行进度；到点执行输出并在恢复结束后完成。create 提供空持久／执行数据的入口；createWithState<P, E> 明确区分 initialize(battle) → Result<P> 与 start(battle, source, self) → Result<E>，output／afterOutput／onEnd 保留两者类型。Skill 弹药行动在 start 采样当前 Activation Ref，不能提前到 Unit 初始化时采样。isAttack 只恢复纯配置元数据，不恢复未知程序的私有状态。周期变化不自动缩放已经采样的 Casting 等待；特殊程序需要实时响应速度时自行查询。

需要首次起手或连续会话的内容，可以在具体 Unit 扩展状态中保存跨轮事实，由 Unit 的 tick Hook 或相关业务 Hook 维护，成功登记后的 step 消费；失败启动不消费。通用 Action 不制造另一套共享起手阶段机。

beforeRelease(battle, actionRef) 返回 CONTINUE 或 INTERRUPT／recoveryTicks。Hook 使用公共 Hook<Context, Directive>，Context 固定 source 与 action 的 typed Ref，accepts／invoke 接收 battle、context、current 并返回统一 Result。候选 ID 固定，逐项重读最新登记；stop 在行动结束、宿主离场或首个中断时停止。恢复信息交给具体程序，不写通用 Unit recoveryUntilTick。

释放 Hook 返回后，普通攻击进入输出前重新确认实例运行及宿主在场资格；已经完成输出后的消耗按实际业务和采样身份处理。不能把所有跨领域调用后的检查都机械化为同一个存活门槛。

普通攻击通过拦截后写入 ACTION_RELEASED，再调用 released 通知，随后从最新实例取得本次输出载荷。Skill.enter 通过该扩展点登记 ACTION 回复，通用 Action 调度器不自动通知或授予 SP。普通攻击本身不读取 Skill；content/actions/skill.ts 的内容组合器在行动创建时采样 typed Activation Ref，在 afterOutput 调用 consume／check。旧攻击不消耗／结束新的 Activation。

released 表示已经到达成功释放点，发生在伤害／治疗输出之前，不表示输出已完成。回复 Hook 可以同步取消行动或使宿主离场，此后模板不执行旧输出，已写入的 ACTION_RELEASED 事实保留。通知逐项检查当前登记、行动 RUNNING 与宿主 PRESENT 资格。

afterOutput 是模板中运行实例的后继程序，进入前检查当前 Action 仍为 RUNNING；输出过程已经取消或结束该实例时，不再执行它。afterOutput 自身也可以结束 Skill、取消 Action 或触发离场，返回后模板重新读取当前实例，避免重复完成。它不是无条件清理回调；已进入程序所承担的结算按内容自身的控制流接续。

移动许可由 Locomotion Rule 查询当前 battle 与 Unit。具体敌人在 enter 生命周期节点登记 Casting 移动限制；已经发射的 Projectile 保持自己的生命周期。

## 9. 机制依据与接口整合

玩法依据见[行动与弹道](../research/cases/02-action-and-projectile-phases.md)、[计时与动画](../research/cases/07-action-timing-and-animation.md)、[启动与中断](../research/cases/08-action-eligibility-and-interruption.md)。敌人技能施放期间暂停的触发冷却，与通用 Action 周期分开表达。

Effect 与 [Projectile](projectile.md) 的生命周期回调直接接收 battle、self 与必要业务参数，异构容器 read 保持实例和 Definition 的类型配对。Hook 的固定事件 Context 不进入 Action state、BattleState 或全局容器。
