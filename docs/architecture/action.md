# Action 设计

Action 负责行为程序的选择、启动、推进与完整终止。具体内容通过释放通知和内容程序点组合 [Skill](skill.md)、[Effect](effect.md) 与其他领域操作。

接口遵守[五类约定](api-conventions.md)：完整操作使用 battle 与 typed Ref，Definition 程序显式接收 battle、宿主引用和 self，当前时间来自 battle.tick。

> **每个 Unit 的每种 Action 聚合一份 Definition、持久 state、Cooldown 和可空的当前 Execution。Unit 的 Action Capability 只保存一个 Actions 运行容器；每次启动创建新的执行身份，结束只清空 execution。推进由 Runtime 调度。**
>
> 同步嵌套遵守[状态接续约定](functional-core.md#状态接续后的读取与续执行)：后续需要当前对象或资格时重读，明确采样与历史载荷保留，不用旧聚合条目覆盖嵌套更新。

## 1. 状态与领域职责

| 对象 | 职责 |
| --- | --- |
| unit/action/Definition | 行动身份、基础 intervalTicks／speed、持久 initialize、prepare／onTick 与可选 onEnd |
| Unit Action Capability Definition | 创建本 Unit 行动的 initialize 程序和可选 select 程序 |
| Unit Action Capability State | 单一 Actions 容器、宿主内 nextExecutionId、interval／speed 贡献、启动 Rule、释放前拦截与成功释放通知 |
| Action | 一种配置行动在某 Unit 上的 Definition、持久 state、Cooldown 和当前 execution |
| Execution | 以本轮执行身份读取同一聚合条目的完整视图，execution 确定非空 |
| execution.State | 聚合条目内本次执行的 id、startedAtTick、status 和私有 state |
| Runtime | 固定候选、逐项推进与启动、接续状态，成功后发布整 Tick |

Cooldown 表达同种行动何时可以再次启动；execution 非空表示本轮尚未完成终止。同 Unit 同配置 Definition 同时最多有一个 Execution，RUNNING／ENDING 均占用该启动位置。不同 Definition 可以同时执行；互斥、抢占与等待由内容选择、启动 Rule 和明确取消表达。

Rule 只负责启动准入，不自动中断现有执行。眩晕等需要中断的内容显式调用 cancel／cancelForUnit。

## 2. 模块与导入

聚合类型、Execution、Definition、创建程序、容器、Cooldown 和生命周期操作位于 unit/action/；Capability 配置、贡献、Rule、周期属性与释放 Hook 位于 unit/capability/action/。模块组织遵守[公共入口约定](api-conventions.md#模块与公共入口)，领域内使用 Definition、Action、Execution、Id 等局部名字。

[unit/action/index.ts](../../src/core/unit/action/index.ts) 显式提供公共 API，上层默认从该入口导入。初始公开范围为：

| 职责 | 导出 |
| --- | --- |
| 身份与类型 | ref、executionRef、lifetime；Action、Execution、Definition、Signal、StartOutcome |
| 创建 | create、createActions |
| 查询 | all、forUnit、getExecution、getAction、isCasting |
| 业务操作 | start、setExecutionState、setState、setCooldown、cancel、cancelForUnit、refreshCooldowns、resetCooldown、clearCooldown |
| 调度协作 | advance，仅由调度器主动调用 |

五个查询实现在 [query.ts](../../src/core/unit/action/query.ts)；启动、写回、advance 推进与终止适配统一由 [operations.ts](../../src/core/unit/action/operations.ts) 实现，执行请求和依赖调度归 [公共 Lifetime](lifetime.md)。advance 派发执行程序，并按完成结果请求本轮结束，由 index.ts 显式导出供调度器调用。lifetime 的公开协作不授予 Content 任意正常完成或推进权限。

```typescript
import {
    ref,
    executionRef,
    type Definition as ActionDefinition,
    type Action,
    type Execution,
} from "./action/index.js";
import type { Action as ActionCapability } from "./capability/action/index.js";
import * as actions from "./action/index.js";
```

消费侧按实际角色选择具名导入、命名空间或别名。Actions 运行时类不从 index 导出；内部容器、执行数据和局部 Cooldown 计算仍可按职责从实现文件深导。Core 调度与协作可以精确导入依赖，不要求领域内部经由 index。

## 3. Definition、Action 与 Execution

```typescript
import type { State as ExecutionState } from "./execution.js";

export type End =
    | { readonly type: "FINISHED" }
    | { readonly type: "CANCELLED"; readonly reason: string };

export interface Definition<P extends object = object, E extends object = object> {
    readonly id: string;
    readonly intervalTicks: number;
    readonly speed: number;
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly prepare: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Action<P, E>,
    ) => Result<E | null>;
    readonly onTick: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Execution<P, E>,
    ) => Result<boolean>;
    readonly onEnd?: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Execution<P, E>,
        end: End,
    ) => BattleState;
}

export interface Action<P extends object = object, E extends object = object> {
    readonly definition: Definition<P, E>;
    readonly state: P;
    readonly cooldown: CooldownState;
    readonly execution: ExecutionState<E> | null;
}

export interface Execution<P extends object = object, E extends object = object> {
    readonly definition: Definition<P, E>;
    readonly state: P;
    readonly cooldown: CooldownState;
    readonly execution: ExecutionState<E>;
}
```

Action<P, E> 表达持久行动，Execution<P, E> 表达其中某一轮执行的完整视图；两者读取同一个聚合条目，但声明不同的引用身份。Execution 的 execution 确定非空，onTick／onEnd 直接读取 self.execution.state，持久数据读取 self.state。内部 execution.State<E> 仍只保存 id、startedAtTick、status 和 E，不从公共 index 导出。宿主引用由回调的 source 参数提供，聚合条目不重复保存 host。

具体内容将 Definition<P, E> 交给公共入口的 create，得到创建行动的初始化函数；其实现位于 [initialize.ts](../../src/core/unit/action/initialize.ts)，类型配对在这个具体创建位置建立。Unit 的 Action Capability.initialize 调用内容提供的 initialize，内容使用 createActions 按顺序执行这些函数，接续每项 Result.state，并将完整聚合条目加入 Actions。

每项创建程序调用自己的 Definition.initialize，建立 P、初始就绪的 Cooldown 和 execution: null。即使从未启动，该聚合条目也已经存在。共享 Definition 的不同 Unit 分别初始化，私有状态随各次创建产生。此时宿主尚未登记，不能从战场查询自己或假设兄弟能力已经可用。start 不补建缺失的配置条目。

prepare 取得当前已配对的 Action，只检查本次内容条件、初始化 E 和必要采样；null 表示未启动。已发生的状态更新接续返回，普通无变更拒绝返回输入 battle。伤害、召唤、绑定本次执行的 Effect 及可能同步重入的业务，在 execution 登记后由 onTick 执行。prepare 阶段不递归启动自己或改变来源配置。

onTick.value 表达是否完成。本轮私有进度通过 `setExecutionState(battle, executionRef(source, self), nextState)` 写回；调用方从当前 execution.state 计算新的 E，再提交结果值。需要被嵌套观察的进度先写回，再进入外部业务；callback 返回时不会自动用旧 self 覆盖当前 Action。

## 4. 异构容器与两种引用身份

Unit.action.actions 是该宿主唯一运行容器，按 definition.id 保存 Action。Capability 配置只保存 initialize 与可选 select，不保留静态定义集合。具体内容负责组合自己的创建程序；默认候选、启动派发、冷却刷新从运行时 Actions 条目进入，由条目取得 Definition。

```typescript
import { create as createAction, createActions } from "./action/index.js";

const attack = createAction(attackDefinition);
const skillAttack = createAction(skillAttackDefinition);

const action = {
    initialize: (battle: BattleState) => createActions(battle, attack, skillAttack),
};
```

create 在接收具体 Definition 时校验非空 ID、基础间隔与速度一次，返回的函数负责创建并登记自己的 Action；重复 ID 由 Actions.add 拒绝。createActions 只从空 Actions 开始逐项接续 BattleState 和容器，不解释内容私有 P／E，也不读取底层 Store。内容通过具名的具体 Definition 或 typed Ref 读写私有状态。

Actions 以私有 Store<DefinitionId, Action<any, any>> 保存异构完整聚合。普通 get(id)／values() 返回默认 object／object 的 Action，包含完整 Definition、state、Cooldown 和可空 Execution；get(id, definition) 按 Definition 对象身份恢复 P／E。容器按配置 ID 统一使用 get(id)，getExecution(id) 则按本轮 Execution ID 读取完整条目，不另维护执行集合或索引；领域 getAction(battle, ref) 继续提供持久 Typed Ref 查询。any 留在异构存储及必要的泛型上界，普通查询不把 any 作为默认结果。

Core 的选择、冷却刷新、推进与终止直接读取内部完整条目，保持条目与其自身 Definition 的配对，不解释私有 P／E 的形状，也不通过高阶 reader 传递具体泛型。内容查询仍由精确 Typed Ref 恢复 P／E，字段 setter 保留 NoInfer；普通查询直接返回完整对象，私有形状仍只由精确 Ref／Definition 证明，底层 Store 不公开。

同一 BattleState 内的连续只读求值复用已取得的宿主和条目；完整操作返回后仍按状态接续约定重新读取。释放派发在每项 Hook 前从当前版本检查执行与宿主资格，不缓存入口时的资格。

values()／keys() 返回绑定容器版本的 Query，并保留配置登记顺序。替换不改变顺序；Actions.size 表示已配置行动数量，当前执行数量由 execution 非空的条目决定。配置条目随 Unit 存在，不因本轮完成而删除。

nextExecutionId 保存在 Capability State，从 0 开始；每次成功启动后递增，完成或取消不回收。不同宿主可以具有同号执行，完整执行身份为 host 与 execution.id。

`ref(source, definition)` 生成持久 Ref<Action<P, E>>，其地址保存 host 与 Definition 对象。Definition 同时保留 P／E 配对，查询按 definition.id 定位并确认同一个 Definition。该引用跨多轮执行有效，getAction、start、setState、setCooldown、resetCooldown 和 clearCooldown 均以它指定目标行动。

`executionRef(source, self)` 由宿主引用和当前 self.execution.id 生成 Ref<Execution<P, E>>，地址仍为 host 与执行 id。它只绑定本轮执行；本轮结束或后续执行 ID 不匹配时，getExecution 返回 undefined。执行查询、推进、取消、执行状态更新及 ACTION Lifetime 均使用这种引用。

两种类型的 Identified 声明各自地址，Ref 的 Phantom 保留 P／E 关联。构造引用不读取 battle，也不缓存 Action 或 Cooldown；各操作从接续的最新 BattleState 读取当前条目。引用变化不增加配置 ID、执行 ID、存储集合或运行对象。

```typescript
export declare function ref<P extends object, E extends object>(
    host: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
): Ref<Action<P, E>>;
export declare function executionRef<X extends Execution<any, any>>(
    host: Ref<Unit & ActionCapability>,
    self: X,
): Ref<X>;
export declare function all(battle: BattleState): readonly Ref<Execution>[];
export declare function forUnit(
    battle: BattleState,
    source: Ref<Unit>,
): readonly Ref<Execution>[];
export declare function getExecution<X extends Execution<any, any>>(
    battle: BattleState,
    ref: Ref<X>,
): X | undefined;
export declare function getAction<T extends Action<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
): T | undefined;
export declare function isCasting(
    battle: BattleState,
    source: Ref<Unit>,
    definitionId?: string,
): boolean;
```

Execution 是按本轮身份读取的完整聚合，execution 确定非空；普通查询的 P／E 默认为 object，精确 Ref 保留具体类型。all／forUnit 返回本次已经物化的执行 Ref 候选，包含 ENDING；isCasting 同样保留 ENDING 占位，直到 execution 被清空。

Actions.toJSON 直接物化容器条目并返回诊断 Snapshot 数组，以 unknown 声明持久 state 与 execution.state，Definition 只承诺诊断字段。nextExecutionId 由 Capability State 单独保存。该真实诊断表示不替代完整 Action，也不承担恢复 Definition、回调或容器的协议。

BattleState 不另存全场 Action 集合。all 按 Unit 集合顺序展平当前执行，各宿主内按 execution.id 升序枚举，保留本宿主的启动顺序；不承诺全场启动顺序。保留旧 BattleState 即保留旧聚合条目、执行进度及 nextExecutionId。Definition 直接共享；事件使用 sourceUnitId 与宿主内 executionId 标识一次执行。

## 5. Capability 与冷却

```typescript
interface Definition {
    readonly initialize: (battle: BattleState) => Result<Actions>;
    readonly select?: (battle: BattleState, self: Unit & ActionCapability) => Result<readonly string[]>;
}

interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, self: Unit & ActionCapability, definitionId: string) => boolean;
}

type Input = contribution.Input<Modifier, Unit & ActionCapability>;

interface State {
    readonly actions: Actions;
    readonly nextExecutionId: number;
    readonly interval: readonly Contribution<Input>[];
    readonly speed: readonly Contribution<Input>[];
    readonly rules: readonly Rule[];
    readonly beforeRelease: readonly BeforeReleaseHook[];
    readonly released: readonly ReleasedHook[];
}
```

setIntervalContribution／setSpeedContribution 及对应 remove 绑定 Ref<Unit & ActionCapability> 返回 Change，实现在 capability/action/operations.ts。transform 只修改贡献集合，无变化时返回原 Unit，由 update 统一跳过 settle；实际变化的 settle 从最新 battle 调用 refreshCooldowns，按全批最终周期及当前完成比例换算冷却；Content 不补一次手工刷新。Rule／释放 Hook 登记也返回 Change，但不附带冷却或 Blocking 后继。动态查询继续使用 resolveBaseInterval／resolveSpeed／resolveInterval(battle, source, definition)。

普通攻击周期依据 [PRTS 攻速公式](https://prts.wiki/w/游戏数据基础#攻速公式)：修正间隔 × 100 / 限制后的速度。速度属性下限为 20，周期计算速度上限为 600，有效周期至少为 1 Tick。纯 Cooldown 支持非负连续周期，不在纯值函数中强加攻击的量化限制。

基础数值在配置入口校验，周期计算信任已建立的数值约束，按游戏尺度直接计算；不在结果上追加极端浮点溢出检查。

Cooldown 保存 periodTicks／readyAtTick；reset 从当前时点开始完整周期，clear 立即就绪。resizeKeepingProgress 保留完成比例，resizeKeepingElapsed 保留绝对已过时间，二者明确分开。

成功启动开始周期；结束和取消不默认重置或清空。refreshCooldowns 从 Actions 逐项读取对应 Definition 和当前 Cooldown；resetCooldown／clearCooldown 先刷新周期，再明确控制指定配置行动。setCooldown 只设置指定条目的 Cooldown，不隐式刷新全部行动。

普通攻击不足一 Tick 余量的节奏政策由具体攻击程序处理，不进入通用 reset；修正所用的先前到期时间在内容 prepare 返回的最新 BattleState 中采样，不能沿用回调前的冷却快照覆盖本次修改。周期变化不自动缩放已经采样的执行等待。

## 6. 完整启动、写回与终止

```typescript
export type StartOutcome<P extends object, E extends object> =
    | { readonly type: "STARTED"; readonly ref: Ref<Execution<P, E>> }
    | { readonly type: "REJECTED"; readonly reason:
        "SOURCE_UNAVAILABLE" | "RULE" | "COOLDOWN" | "CASTING" | "CONDITION" };

export declare function start<P extends object, E extends object>(
    battle: BattleState,
    ref: Ref<Action<P, E>>,
): Result<StartOutcome<P, E>>;
export declare function cancel<T extends Execution<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    reason?: string,
): BattleState;
export declare function setExecutionState<T extends Execution<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    state: NoInfer<T["execution"]["state"]>,
): BattleState;
export declare function setState<T extends Action<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState;
export declare function setCooldown<T extends Action<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    cooldown: CooldownState,
): BattleState;
export declare function resetCooldown<T extends Action<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
): BattleState;
export declare function clearCooldown<T extends Action<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
): BattleState;
```

start 从当前 Action 检查配置对象身份、来源资格、execution 占用、Rule、Cooldown 和内容条件。未配置 Definition 属于调用／配置错误；普通拒绝不分配执行 ID 或开始周期。STARTED 表示已受理：start 通过 prepare 构造 E、登记本轮 Execution 并重置 Cooldown，首次 onTick 由独立的 advance 入口执行。返回的 Ref 标识本轮执行，使用时仍从最新 BattleState 确认其状态。

start 内的局部 check 复用同一套准入规则，在 prepare 前检查，并在 prepare 成功后从接续的 BattleState 重新读取宿主与聚合条目，按最新周期再次确认准入，再以其结果登记。prepare 返回 null 时直接返回 CONDITION。回调使自身进入冷却时返回 COOLDOWN，保留已经发生的修改。仍可启动时才基于最新宿主一次写回该 Action 的新 Cooldown、Execution 和 nextExecutionId，保留持久 state、兄弟行动及其他能力的修改。

三类写入只接收已经计算好的结果值。setExecutionState 以 Execution Ref 指定本轮，只设置 execution.state；setState 与 setCooldown 以 Action Ref 指定持久行动，分别只设置持久 state 与 Cooldown。Core 从传入的最新 BattleState 读取当前聚合条目，只替换指定字段，保留其他字段、Definition、执行身份和生命周期；给定值与当前字段引用相同时返回原 BattleState。

宿主或指定执行缺失时，写入操作抛出 RangeError；Action Ref 所给 Definition 未配置或对象身份不匹配时抛出 TypeError。setExecutionState 在 execution 为 ENDING 时抛出 TypeError；setState／setCooldown 可以在结束程序中更新持久事实。调用方从当前 battle 查询并计算下一值，计算和提交之间不执行其他完整操作；跨领域调用返回后先接续 battle，再重读所需实时状态，避免用旧 self.state／self.execution.state 覆盖当前数据。`NoInfer` 限制结果值参与泛型推导；精确 Ref 保持 P／E 关联，预先弱化类型后写入不兼容数据属于调用契约错误，不增加运行时形状校验。

单个 Action 的完整写回由文件私有 replaceAction 统一，通过底层 Actions.replace(definition, next) 提交已配对条目，信任已有宿主、Definition 与执行身份。start 仍将新 Cooldown、Execution 和 nextExecutionId 一次写回；refreshCooldowns 仍批量构造后一次提交，不改为逐条写回。生命周期变更由完整领域操作管理，内容只调用对应字段的更新操作。

终止通过 Action 的 lifetime 请求：登记 Pending、发布 execution.ENDING，再按关系请求本轮依赖者。所有依赖者完整 Finalize 后，从当前存储取得配对 Execution 执行可选 onEnd，接续返回状态，清空同一 execution 并登记结束事件。首次请求固定 End 与依赖传播原因，重复请求不覆盖或重复收尾；整个 Finalize 返回后才解除 owner 等待。

Unit 对 Execution 的所有权保护宿主到本轮整个 Finalize 返回。onEnd 内请求宿主离场会先使 Unit LEAVING，但 Unit 不会在该回调中途注销；不再保留宿主缺失时的通用 ending 回退。onEnd 返回后从最新状态读取配对 Action，再清空本轮 execution，保留回调修改的持久 state 与 Cooldown；不删除配置条目，也不清理后来执行。持久状态不隐含跨部署保存。

首次嵌套 cancel 同步完成请求与 Prepare，不保证 execution 已清空或结束事件已记录；同一结算范围内 cancel 后立即 start 同配置可能仍被占位拒绝。无活动结算时，结束入口在本次调用内 drain 完再返回。已经进入的 onTick 继续普通控制流，后继按需要重读当前资格；等待边不来自函数调用栈。cancelForUnit 固定执行 Ref，依次请求取消；Unit 退场改由所有权边传播，无须手工调用这套批量入口。Action.onEnd／事件的 SOURCE_ABSENT 与依赖者接收的原离场原因分别保留。

## 7. 调度

Runtime 采用以下候选政策：

1. 按 Unit 登记顺序一次物化本轮候选及每个宿主当时的执行 Ref，保留调度入口的完整快照。宿主离场由完整离场操作终止其执行，不保存脱离宿主的孤立 Execution。
2. 对每个 Unit，先推进原有执行，再刷新 Cooldown；刷新返回后重新读取来源，仍为 PRESENT 且空间在场时才运行 select，已经离场或隐藏则跳过。
3. select 返回本轮候选 Definition ID 及接续状态，可以表达优先级、随机选择和具体模式政策；未提供时从 Actions.keys() 取得全部配置项。
4. 候选去重后逐一通过 Actions.get(id) 取得条目及其 Definition，再构造持久 Action Ref 调用 start，每次读取最新来源与配置。列表顺序不代表引擎赋予的业务优先级。
5. 调度器扫描入口固定的执行 Ref，每项读取最新状态并推进一次。自动候选的 start 返回 STARTED 后，Combat 显式调用 advance 推进该 Ref，保持自动动作在同 Tick 首次执行。
6. 本轮自动候选只尝试一次，不按“仍然就绪”循环重启即时完成的同一行动。
7. 内容直接 start 或回调内嵌套 start 只登记执行，等待调度器推进。调度入口前已登记的执行可以在本次调度中推进；调度内嵌套登记的执行不在已固定快照中，等待后续调度。

advance(battle, ref) 由 operations.ts 实现，index.ts 继续导出供调度协作；仍仅由调度器主动调用，start 不隐式推进。它通过同一 Actions 容器的 getExecution 直接取得当前执行，再调用该执行 Definition 的 onTick，并显式传入宿主引用；完成与取消直接调用 lifetime.end 请求结束，可选 onEnd 在 Finalize 中调用。跨完整操作后的实时读取仍遵守状态接续约定。首次推进中的即时完成或同步取消按通常终止流程结算；内容不主动推进执行，不保存实例级同 Tick 去重字段。

## 8. 普通攻击、释放 Hook 与移动

可复用普通攻击程序位于 content/actions/attack.ts，直接调用 Damage、Healing 与 Elemental 的公开操作。它在 prepare 绑定目标并保存 releaseAtTick／finishAtTick、released 等执行进度；到点执行输出并在恢复结束后完成。create 提供空持久／执行数据的入口；createWithState<P, E> 明确区分 initialize(battle) → Result<P> 与 prepare(battle, source, self) → Result<E>。output／afterOutput／onEnd 接收显式 source 与 execution 非空的 Execution<P, State<E>>，模板私有数据位于 self.execution.state.data。

CD 补偿、cooldownAdjusted 与 released 的私有字段写回继续由完整 Action 操作经内部 replace 发布，不改为公开 Change，也不隐式触发 Blocking。Rule 可读取双方 Action 状态不表示自动订阅其所有字段；改变阻挡资格的内容在对应业务流程中显式复核关系。Attack 在真正执行 Hook、伤害等领域操作后按同一 Execution Ref 恢复当前 RUNNING 执行，并确认宿主 PRESENT 与空间存在；不把原始发布本身当成内容回调。Combat 的 select 使用冷却刷新后当前来源。

Attack 模板统一校验前后摇、操作数值和绑定关系，上层内容不重复校验原样传入的同一字段。只读配置直接共享，公开 attack 配置只投影配置字段，不携带程序私有回调，也不额外复制、冻结其子对象。

Skill 弹药行动在 prepare 采样当前 Activation Ref，不能提前到 Unit 初始化时采样。isAttack 只恢复纯配置元数据，不恢复未知程序的私有状态。特殊程序需要实时响应速度时自行查询。

需要首次起手或连续会话的内容，可以在具体 Unit 扩展状态中保存跨轮事实，由 Unit 的 tick Hook 或相关业务 Hook 维护，成功登记后的 onTick 消费；失败启动不消费。通用 Action 不制造另一套共享起手阶段机。

beforeRelease(battle, executionRef) 返回 CONTINUE 或 INTERRUPT／recoveryTicks。前置干预类型为 BeforeReleaseHook，使用公共 Hook<Context, Directive>；业务事实通知类型为 ReleasedHook，使用 Hook<Context, void>。Context 固定 source 与 execution: Ref<Execution>，后者明确绑定本轮执行。accepts／invoke 接收 battle、context、current 并返回统一 Result。候选 ID 固定，逐项重读最新登记；stop 在执行结束、宿主离场或首个中断时停止。Hook 程序负责返回合法的 recoveryTicks，派发器直接信任其 Directive，不重复校验恢复时长；来自配置的数值仍在相应创建入口校验。恢复信息交给具体程序，不写通用 Unit recoveryUntilTick。

释放 Hook 返回后，普通攻击进入输出前重新确认本轮 execution.RUNNING 及宿主在场资格；已经完成输出后的消耗按实际业务和采样身份处理。不能把所有跨领域调用后的检查都机械化为同一个存活门槛。

普通攻击通过拦截后写入 ACTION_RELEASED，再调用 released 通知，随后从最新执行取得本次输出载荷。Skill.enter 通过该扩展点登记 ACTION 回复，通用 Action 调度器不自动通知或授予 SP。普通攻击本身不读取 Skill；content/actions/skill.ts 的组合器在本轮创建时采样 typed Activation Ref，在 afterOutput 调用 consume／check。旧攻击不消耗／结束新的 Activation。

released 表示已经到达成功释放点，发生在伤害／治疗输出之前，不表示输出已完成。回复 Hook 可以同步取消执行或使宿主离场，此后模板不执行旧输出，已写入的 ACTION_RELEASED 事实保留。通知逐项检查当前登记、本轮 execution.RUNNING 与宿主 PRESENT 资格。

afterOutput 是模板中本轮执行的后继程序，进入前检查对应执行仍为 RUNNING；输出过程已经取消或结束它时，不再执行。afterOutput 自身也可以结束 Skill、取消执行或触发离场，返回后模板重新读取本轮执行，避免重复完成。它不是无条件清理回调；已进入程序承担的结算按内容自身的控制流接续。

移动许可由 Locomotion Rule 查询当前 battle 与 Unit。具体敌人在 enter 生命周期节点登记 Casting 移动限制；已经发射的 Projectile 保持自己的生命周期。

## 9. 机制依据与接口整合

玩法依据见[行动与弹道](../research/cases/02-action-and-projectile-phases.md)、[计时与动画](../research/cases/07-action-timing-and-animation.md)、[启动与中断](../research/cases/08-action-eligibility-and-interruption.md)。弩手近战与远程的独立冷却要求每种配置各自保存 Cooldown；冷却就绪与执行占用是不同事实。跨轮事实和本轮多段进度分别保存在 P 与 E，按实际内容确定重置边界；研究不要求运行时使用多个独立集合。敌人技能施放期间暂停的触发冷却，与通用 Action 周期分开表达。

Effect 通过 scope(actionLifetime, executionRef) 绑定本轮 Ref<Execution>，不绑定长期存在的配置项；Pending／ENDING 后不能安装新的该轮依赖。Action、Effect 与 [Projectile](projectile.md) 的异构容器均在内部保持实例和 Definition 的类型配对。Hook 的固定事件 Context 不进入 Action、BattleState 或全局容器。
