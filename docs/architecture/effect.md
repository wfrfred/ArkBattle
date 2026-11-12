# Effect

Effect 负责附着实例、生效状态、覆写组与生命周期。总体执行模型见[总体架构](ARCHITECTURE.md)，状态接续契约见[函数式内核](functional-core.md)。

公开契约遵守[接口分类约定](api-conventions.md)。回调接收 battle 与 self；onTick 另接收本次推进前的 Expiration，onStackChange 另接收变化前的实际层数 previous，onEnd 另接收结束原因。内容程序通过领域操作接续 BattleState。

具体 Buff、异常与 Aura 的规则及未接入项见 [Tactical 语义](tactical-semantics.md)。标准效果库的职责、目录和候选范围见[标准效果库](#10-标准效果库与候选范围)。

Effect 用于表达属性增益、护盾、周期伤害与治疗、技能附带状态、效果覆写和光环分发。核心负责附着实例与生命周期，具体 Definition 组合 Capability 的操作实现玩法。

来源分组、重复施加、叠层与本文的剩余时间契约已确定，尚待代码接入。它们沿用现有 Effect 生命周期与 Lifetime；下文描述目标架构。

## 关键语义

Effect 需要保障的结果是：

- 安装、实际生效和存在性分开。onInstall 完成后重读实例；零有效时长或已经到期的实例直接进入结束，不启用、不推进、不调用 onDisable。禁用保留实例及私有进度，安装期间结束的实例不能被外层流程恢复。
- 同组重复施加先决定拒绝、合并或新建；只有新建分支登记实例、Lifetime 并执行 onInstall，包括暂未生效的候补与零时长实例。合并保留原实例的身份与内容状态。
- 整体覆写组按优先级和安装先后选一个生效对象。禁用最强实例不使弱者补位；最强实例结束后，仍有资格的候补才重新生效。
- 宿主所有权、显式 Scope 与来源分开。宿主或任一依赖结束会关闭 Effect，普通 source 不自动建立依赖；开始结束的依赖链拒绝新绑定。
- 持续计时、绝对期限与无限期明确区分。DURATION 在 ACTIVE／INACTIVE 均扣减 remaining，先发布时间，再仅对 ACTIVE 执行 onTick，最后按最新时间状态结算到期。rate 为零允许内容自行推进；末次业务和其中的续期得到完整结算。
- 普通实例到期结束；STACK 按结束或逐层衰减政策结算。逐层衰减尚有层数时重置本轮剩余时间，实例保持存在。保留实例的层数变化先发布，再同步调用 onStackChange，具体输出由 Definition 的业务程序更新；手动减层保留当前剩余时间，耗尽则正常结束。
- 结束时先撤销自身输出，再等待依赖者完整结束，最后执行自身收尾并移除实例。收尾使用当前状态，宿主由所有权保护到本 Effect 的整个 Finalize 返回。

这些语义用于选择必要的业务场景。公共依赖析构、Hook 派发和不可变状态接续由各自契约集中说明；容器实现、字段清单与逐个 Setter 的内部检查不独立构成玩法验收目标。Aura 与具体 Buff 需要有实际内容程序，不能用夹具实现其策略后将夹具自身当作产品验收。

## 1. 目录与职责

| 模块 | 职责 |
| --- | --- |
| [unit/effect/index.ts](../../src/core/unit/effect/index.ts) | 显式公共类型、查询与生命周期操作 |
| `unit/effect/definition.ts` | 共享 Definition 与生命周期回调 |
| `unit/effect/effect.ts` | 实例、身份与时间状态 |
| `unit/effect/expiration.ts` | Expiration 联合类型及时间状态判断 |
| `unit/effect/effects.ts` | 不可变异构容器与宿主内 ID 进度 |
| `unit/effect/query.ts` | 按精确 Ref 读取当前实例的 get |
| `unit/effect/operations.ts` | 安装、私有数据与时间状态写回、启停、推进与完整结束 |
| `core/lifetime/` | 共享依赖关系、结束请求与 DAG 析构 |
| [core/effects/](../../src/core/effects) | 控制、保护、可选中性与标准元素爆发的具体 Definition |
| `content/` | 角色专属效果及标准效果的使用程序；Aura 接入范围见后文 |

内容从 index 导入公开契约，包含 Effect 的静态 lifetime 描述符；get 归 query.ts，领域操作直接依赖该查询。Effects 容器保持内部职责；通用依赖索引归 core/lifetime。Effect、Hook、Contribution 都在 Unit 域内，与 Capability 平级。Effect 集合是 Unit 的组成部分；具体能力负责自己的数值和事件。

| 模块            | 负责什么                                          | 集合由谁持有                 |
| --------------- | ------------------------------------------------- | ---------------------------- |
| Effect          | 安装、私有数据、生效状态、覆写组、时间、结束     | Unit.effects                 |
| Effects         | 不可变异构实例存储、增删查改与宿主内 ID 进度      | Unit.effects                 |
| Hook            | 不可变登记项、类型化集合及动态登记               | Unit.hooks 或事件专属 Capability |
| Contribution    | 不可变贡献类型与 resolve 有效来源选择     | 提供该属性的 Capability      |
| Capability      | 属性读写、事件阶段、调用顺序、短路与修改响应      | 对应 Capability State        |
| 具体 Definition | 将生命周期回调与 Capability 操作组合为玩法        | 实例 state 保存内容需要的进度 |
| Battlefield     | 定义场上状态值，纯转换维护存储与结构索引        | Battlefield State            |
| battle/runtime.step | 按领域顺序接续纯操作并返回完整 State | 输入与返回的不可变值 |

[Damage 与 Healing](vitality.md) 由 Battle 领域执行，属性计算由所属 Capability 执行；具体 Definition 组合这些操作。

## 2. Definition、实例与泛型

Definition 是可共享的静态行为，Effect 是附着在一个 Unit 上的运行实例。实例直接保存 Definition 引用；创建接收 Definition，查询恢复类型，私有数据写回使用精确 Ref 与已经计算好的结果值。

普通与 STACK 使用两组配对的 Definition／Effect。STACK 的政策参数 P 同时约束回调 self 和实例时间，默认联合保留各分支的关联。公共字段与分支字段分别声明：

```typescript
interface GroupFields {
    readonly id: string;
    readonly priority: number;
    readonly independentSource: boolean;
}

interface OrdinaryGroup extends GroupFields {
    readonly type: "DEFAULT" | "UNIQUE" | "EXTEND" | "EXTEND_TIME";
}

interface StackGroup extends GroupFields {
    readonly type: "STACK";
    readonly maxCount: number | null;
    readonly maxEffectiveCount: number | null;
    readonly refreshAtMax: boolean;
    readonly expirationPolicy: "END" | "DECAY";
}

type Group = OrdinaryGroup | StackGroup;

type DecayExpiration = Extract<
    Expiration,
    { readonly type: "DURATION" | "INFINITE" }
>;

type ExpirationPolicy = StackGroup["expirationPolicy"];

type StackExpiration<P extends ExpirationPolicy> =
    P extends "DECAY" ? DecayExpiration : Expiration;

interface DefinitionFields<
    S extends object,
    Self extends { readonly expiration: Expiration },
> {
    readonly id: string;
    readonly initialize: () => S;
    readonly onInstall?: (battle: BattleState, self: Self) => BattleState;
    readonly onEnable?: (battle: BattleState, self: Self) => BattleState;
    readonly onDisable?: (battle: BattleState, self: Self) => BattleState;
    readonly onTick?: (
        battle: BattleState,
        self: Self,
        previous: Self["expiration"],
    ) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Self, reason: string) => BattleState;
}

interface EffectFields<S extends object, H extends object> extends Identified<{
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly id: Id;
}> {
    readonly id: Id;
    readonly host: Ref<Unit> & Ref<Unit & H>;
    readonly state: S;
    readonly source: Ref<Unit> | null;
    readonly enabled: boolean;
    readonly lifecycle: "INSTALLING" | "INACTIVE" | "ACTIVE" | "ENDING";
}

interface OrdinaryDefinition<S extends object, H extends object = object>
    extends DefinitionFields<S, OrdinaryEffect<S, H>> {
    readonly group?: OrdinaryGroup;
}

interface OrdinaryEffect<S extends object = object, H extends object = object>
    extends EffectFields<S, H> {
    readonly definition: OrdinaryDefinition<S, H>;
    readonly expiration: Expiration;
    readonly stackCount?: never;
}

type StackDefinition<
    S extends object,
    H extends object = object,
    P extends ExpirationPolicy = ExpirationPolicy,
> = P extends ExpirationPolicy
    ? DefinitionFields<S, StackEffect<S, H, P>> & {
          readonly group: StackGroup & { readonly expirationPolicy: P };
          readonly onStackChange?: (
              battle: BattleState,
              self: StackEffect<S, H, P>,
              previous: number,
          ) => BattleState;
      }
    : never;

type StackEffect<
    S extends object = object,
    H extends object = object,
    P extends ExpirationPolicy = ExpirationPolicy,
> = P extends ExpirationPolicy
    ? EffectFields<S, H> & {
          readonly definition: StackDefinition<S, H, P>;
          readonly expiration: StackExpiration<P>;
          readonly stackCount: number;
      }
    : never;

type Definition<S extends object, H extends object = object> =
    | OrdinaryDefinition<S, H>
    | StackDefinition<S, H>;

type Effect<S extends object = object, H extends object = object> =
    | OrdinaryEffect<S, H>
    | StackEffect<S, H>;
```

两个层数上限的 null 表示无限制。END 允许全部 Expiration；DECAY 允许 DURATION／INFINITE，拒绝没有重启预算的 DEADLINE。这个关联贯穿 Definition、Effect、安装 Initial、返回 Ref 与 setExpiration，具体数值在真正输入边界校验，内部信任已建立的类型配对。

Content 声明 STACK 时选择具体政策，例如 `satisfies StackDefinition<State, Action, "DECAY">`，或直接使用该类型注解。这样回调 self、onTick.previous 和时间写回均保留精确分支。用于异构输入的默认联合不依赖嵌套的 group.expirationPolicy 为对象字面量回调提供上下文类型；Core 读取联合实例时也通过类型守卫或受信任的配对边界恢复关联。普通 Definition 可用 satisfies 保留明确的 group.type，供安装重载判断是否可能合并。

S 是实例私有数据的类型，例如护盾次数、周期进度或 Aura 的目标登记，值保存在 `effect.state`；通用 STACK 的层数属于 Effect 内建状态。H 是宿主需要的 Capability 结构，例如 Offense 或 Vitality；回调通过 `units.get(battle, self.host)` 取得 `(Unit & H) | undefined`。H 不要求抽象 Effect 导入所有 Capability。

具体 Definition 已经建立的私有数据约束由内容内部信任。例如确认泥岩护盾的内容身份后，直接按 ShieldState 读取 layers／timer，不将已知实例数据重新当作外部 JSON 逐字段校验；真正的解析与配置入口仍负责输入校验。

安装入口接收 `Ref<Unit & NoInfer<H>>`，通过 units.get 取得最新宿主。创建与内容入口保证宿主能力组合，类型表达所需结构。Definition 中的函数是静态行为，self 是这次回调输入版本中的类型化实例。当前时间读取 battle.tick，实例身份通过 ref(self) 取得。嵌套返回后需要后继事实时，从新 BattleState 查询，不靠动态 getter 接续。

覆写组与固定优先级属于 Definition，实例直接读取 `definition.group`。每次安装的初始属性使用 `Initial<S, E>`，E 是该 Definition 分支允许的 Expiration：`source`、`scopes`、`expiration`、`state` 和 `enabled`。source 为 `Ref<Unit> | null`，省略时为 null；scopes 只作为创建时的 Lifetime 依赖输入，不保存到 Effect；expiration 省略时为 `{ type: "INFINITE" }`。时间状态的三种形式见下文，不用 null 表达无限期。这些输入不覆写 Definition 的规则。

Unit 初始化始终建立空 Effects，不接收预装容器。初始 Buff、护盾等由 Unit Definition 的 enter 键下的 Hook 在宿主登记后调用 install，按正常安装流程执行 onInstall、生效协调与依赖登记。

当前 battle/unit.add 先登记宿主，再按实例 hooks 的登记顺序统一派发 enter Hook，不推断部署事实或扫描全场 Blocking。Skill 的入场处理也是其中一个 Hook；初始 Effect 与技能入场业务的先后由装配顺序决定，不另设 Effect 入场阶段。默认装配先登记 Skill，再追加 Definition 中的内容 Hook。

### 不可变 Effects 容器

`Unit.effects: Effects` 以私有 `Store<Id, Effect<any, any>>` 持有异构 Effect 集合与宿主内的 `nextId`。容器是不可变值：增删改返回新容器，原容器与其中的旧实例仍可读取；查询返回共享的不可变引用。

普通 get(id) 返回完整 Effect<object, object>，values() 返回绑定容器版本的 Query<Effect>，keys() 返回 Query<Id>。实例的 state 和完整 Definition 都存在，默认 object 不声称某种私有形状。Query 惰性、可重复遍历，绑定的不可变容器版本已经固定枚举来源；在完整操作处生成 Ref，并从最新 BattleState 读取当前实例，不为固定身份额外生成数组。

Effect<S, H> 直接保存完整 Definition<S, H> 与 state，以及 id、宿主、来源、expiration 和参与状态。宿主类型同时保留 Ref<Unit> 与 Ref<Unit & H>，内部 H 擦除为 any 时仍有 Unit 地址与身份。普通读取不增加另一套实体类型，具体私有读写继续使用原配对证明。

具体内容需要恢复 S／H、STACK 与政策分支时，使用精确 Ref 或 Definition 对象身份查询。Core 只把未知实例交给它自身 Definition 的程序，不解释具体私有 state。联合回调与 self 的关联在受信任的异构调用边界统一恢复，沿用容器内部类型擦除；存储容器本身仍不选择或派发业务。

| 存储操作                      | 含义                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `Effects.empty()`             | 取得空容器                                                |
| `effects.nextId`              | 下一次安装可使用的宿主内实例 ID                           |
| `effects.get(id)`             | 按实例 ID 取得默认 object 的完整 Effect     |
| `effects.get(ref)`            | 根据精确 Ref 恢复对应实例，并检查宿主与局部 ID          |
| `effects.get(id, definition)` | 检查 Definition 身份，恢复对应实例的 S／H、STACK 与政策分支         |
| `effects.values()`            | 返回绑定当前版本的 `Query<Effect>`                         |
| `effects.keys()`              | 返回绑定当前版本的 `Query<Id>`                           |
| `effects.add(effect)`         | 仅接受 `effect.id === nextId`，返回新容器并将 nextId 加一 |
| `effects.replace(ref, next)`  | Core 完整替换；信任 Ref 与完整实例已经配对                  |
| `effects.remove(id)`          | 返回移除实例的新容器，保留 ID 进度                        |

具体内容已知 Definition 时，用 `get(id, definition)` 同时检查实例 ID 和 Definition 对象身份，再读取对应的 OrdinaryEffect 或 StackEffect，保留 S／H 和政策分支。仅字符串 ID 相同的另一个 Definition 不匹配。已持有精确 Ref 时直接使用 `get(ref)`，更新私有数据则调用领域 `setState()`。

通用生命周期操作直接读取当前完整实例：

```typescript
get(id: Id): Effect | undefined;
```

Core 与 Content 统一使用 get(id) 取得默认 object 参数的完整 Effect。Core 在受信任边界恢复该实例与自身 Definition 程序的配对后调用，不解释私有 state 或 H；生命周期与状态接续仍由 operations 决定。类型擦除集中在异构存储与其配对调用边界，不逐个内容断言，也不另设返回 any 私有数据的查询出口。

异构存储需要的擦除与恢复集中在容器内部，不另设业务代码需要理解的 Instance 类型。`add()` 保留 effect.id === nextId 的登记约束，随后直接递增 nextId；按游戏尺度计算，不追加安全整数上界或理论溢出检查。`replace()` 信任 Core 提供已经配对的 Ref 与完整 Effect，宿主、局部 ID 和 Definition 的稳定性由 Core 保证，容器不重复执行这些运行时校验。缺失实例的 replace／remove 返回原容器，替换值与当前实例引用相同时保留原容器；删除不回收已经分配的 ID。get(ref) 的宿主识别与 get(id, definition) 的 Definition 对象身份查询仍负责类型恢复。

Effects 的完整替换属于 Core 存储接口。它不接收 BattleState，不选择或执行生命周期回调，不决定覆写赢家、不检查宿主生命周期，也不结束 Scope。Core 通过它提交已完成的领域结算；内容私有数据更新使用 `setState()`，许可与生命周期变化使用相应完整操作。

Core 的完整替换提交已经配对的宿主与 Effect，信任入口建立的身份、Definition 和能力约束；业务资格由所属领域操作负责。存储替换只发布数据和结构索引，不执行生命周期回调或重建依赖图。

不可变 State 直接共享这个容器。容器的 `toJSON()` 直接物化底层 values，返回类型为 `{ readonly instances: readonly Snapshot[]; readonly nextId: Id }`。Snapshot 用 unknown 表达诊断载荷并限制 Definition 的诊断字段，让 JSON 诊断包含数据与 ID 进度。实例与诊断 Snapshot 的 source 均保留 `Ref<Unit> | null`；具体输出只需数值来源 ID 时在输出位置读取 source?.id。诊断表示独立于普通 Query，不承担恢复 Definition、回调或运行容器的职责。

```typescript
type Ref<T> = Identity<T> & Phantom<T>;
```

Ref 从公共 `core/common/ref.ts` 导入。Effect 通过 Identified 协议声明 `{ host: Ref<Unit & H>; id: EffectId }` 地址，`ref(self)` 从已知实例产生精确引用。引用保持 S / H，公开 get(battle, ref) 无需再次传 Definition，跨 Unit 的同一个局部 ID 由 host 区分。

Ref 与静态 Definition 不同。Definition 相同可以有多个实例；实例 ID 在宿主内分配，state 更新与重新生效不改变身份，Core 写回时保持 host 与 Definition 不变。

## 3. 生命周期约束

宿主 Unit 退场必然结束其附着 Effect；install 在 Lifetime 图中登记这条 owner 关系。`source: Ref<Unit> | null` 只标注施加者；安装不要求来源仍在场，来源也不自动成为 Scope。A 给 B 施加中毒，不因为 source 指向 A 就自动随 A 退场结束；确实需要随来源结束的内容通过 Unit 的 lifetime 描述符显式绑定 A。

额外生命周期约束使用 [公共 Lifetime](lifetime.md) 的 Scope。内容用 scope(领域 lifetime, ref) 建立配对，用 getRef 恢复对应 Ref。SKILL 绑定一次 Activation，ACTION 绑定一次 Execution；标准 Burst 本身就是 Effect，通过 effects.lifetime 绑定其精确运行身份，持久 Action 配置不是生命周期目标。任一上游请求结束就请求结束本 Effect，不等待所有目标都结束。绑定不共享时间轴，详见 [Elemental 设计](elemental.md)。

BattleState.lifetime.dependencies 是 owner 与显式依赖的唯一关系权威。install 在入口校验宿主 PRESENT、输入 Scope 可用性与 expiration，发布 INSTALLING 实例并登记 owner／scopes 后才调用 onInstall。后续通过 Lifetime.bind／unbind 管理显式依赖；dependencies 查询不包含 owner。Effect 不重复保存 scopes，也不从 Unit 更新投影关系。内部写回信任已经建立的约束，战斗初始化不扫描预装实例。

关系图合并 owner 与显式 Scope，直接子候选统一按父子边登记顺序请求；更新同一边保序，解除后重绑追加。Finalize 移除实例后注销关系；setState、setExpiration 等普通字段写回不修改关系图。

ENDING 时保留关系，物理移除后活索引可以撤销，但未完成 Pending.parents 保留到整个 Finalize 返回。查询依赖者同时合并这两种来源，避免子 Effect 注销后的结束通知中请求宿主退场时漏掉等待。Pending 表示工作进度，不是第二份生命周期或实例表。

Scope 资格沿实际 owner 和显式 Scope 父边，检查目标及全部上游的 Pending 与最新领域状态；任一上游缺失或结束中即拒绝新的安装／绑定，即使目标自身尚未收到结束请求。各节点的存活要求为：Unit 为 PRESENT，Action 为 RUNNING，Skill 为 ACTIVE，Effect（包括标准 Burst）只要存在且未 ENDING 即可，包含 INSTALLING／INACTIVE；Mechanism 的 INACTIVE 也可成为目标。不能把 HP 或空间存在附加为 Unit 生命周期资格。开始结束的目标不能接受新绑定。

宿主退场、Scope 结束、显式 end，以及到期结算决定结束实例时，都进入同一个 Effect lifetime 请求。STACK 减层重启不请求结束；各领域负责决定何时请求结束自己的实例，共享 Lifetime 运行器负责依赖传播与完成调度。

## 4. 生效状态与覆写

```mermaid
stateDiagram-v2
    [*] --> INSTALLING: 登记实例 / onInstall
    INSTALLING --> INACTIVE: 安装回调完成
    INSTALLING --> ENDING: end
    INACTIVE --> ACTIVE: 获准生效 / onEnable
    ACTIVE --> INACTIVE: 禁用或被覆写 / onDisable
    ACTIVE --> ENDING: end / onDisable
    INACTIVE --> ENDING: end
    ENDING --> [*]: onEnd 后移除
```

`enabled` 是外部许可，`lifecycle` 是实例当前所处的生命周期阶段。实例 enabled 为 true 时仍可能被同组实例覆写，所以两个字段表达不同事实。

| 状态       | 含义                     | 时间推进与输出                                         |
| ---------- | ------------------------ | ------------------------------------------------------ |
| INSTALLING | 已登记，安装回调尚未完成 | 可以被查询和绑定；不执行 onEnable 或 onTick            |
| ACTIVE     | 获准且当前生效           | 先推进 DURATION，再执行 onTick；Hook 资格与 Contribution 输出可以生效 |
| INACTIVE   | 仍存在，当前被禁用或覆写 | 保存私有 state；DURATION 继续扣时，不执行 onTick；DEADLINE 仍会到期 |
| ENDING     | 已进入不可逆的结束结算   | 停止正常参与；Prepare 撤销输出，Finalize 后移除        |

同一个宿主、同一个 Effect group 的竞争规则是：先在所有未结束实例中选最高 priority，平局选较早安装的实例，再检查这个实例的 enabled。禁用最强实例仍占据组位置，弱者不会补位；最强实例结束后，仍存活的弱者可以重新生效。

重新生效调用 onEnable，不重新执行 onInstall，也不自动重置 State 或重新采样。具体 Definition 决定恢复输出时沿用样本还是刷新。

以下四种判断各自有明确位置：

| 判断                                 | 归属                       |
| ------------------------------------ | -------------------------- |
| 多个 Effect 哪个整体生效             | Effect 管理                |
| 一个属性的多项 Contribution 哪些计入 | Capability 数值结算        |
| 本次事件 Hook 如何排序、何时中止     | 提供扩展点的领域           |
| 已生效 Effect 本次是否执行具体动作   | 具体 Definition 的业务函数 |

Hook 的 accepts 读取 Effect 的覆写结果；伤害阶段与优先级由 Damage 定义。

### 重复施加与叠层

组身份决定哪些施加相遇，重复施加政策决定保留哪些实例，优先级决定现存候选谁实际生效。Definition 以判别联合声明同组重复施加政策：

| 政策 | 同组已有实例时 |
| --- | --- |
| DEFAULT | 新建并保留为竞争候选，按优先级协调是否生效。 |
| UNIQUE | 拒绝本次施加；未生效的已有实例仍占据组位置。 |
| STACK | 保留已有实例，按实际层数加一并应用层数上限；加层时取新旧剩余时间的较大值。达到实际上限后，仅在配置允许时刷新剩余时间。 |
| EXTEND | 保留已有实例，用本次施加的完整持续时间补足剩余时间；有限时间取较大值，无限期输入使其无限期。 |
| EXTEND_TIME | 保留已有实例，将本次施加的有限持续时间同时加到 duration 与 remaining；无限期输入不参与加算。 |

空组正常新建。未声明 group 的实例独立安装；同一完整组的重复施加政策保持一致，合并使用保留实例的规则。合并保留其 ID、Definition、source、私有 state 及 Lifetime 关系。

STACK 分支包含实际层数上限、有效层数上限、满层刷新与到期政策。实际层数决定可积累数量；有效层数受有效上限截断，供具体业务使用。STACK 实例将内建层数保存在 stackCount，初始为一。
Definition 的 STACK 分支与带层数状态的 Effect 成对，其他分支不带通用层数状态；类型约束作用于完整实例，保持 Definition、回调与运行状态的关联。`state: S` 继续只保存具体内容数据。

STACK 到期政策为 END 或 DECAY。END 结束整个实例；DECAY 在 stackCount 大于一时减一并令 `remaining = duration`，最后一层到期时结束。有限 DECAY 使用 DURATION；INFINITE 不会自然到期，仍可由业务消耗层数或结束。到期处理属于普通结算，不增加生命周期阶段。

层数如何影响攻击力、伤害或其他输出，由具体 Definition 的程序和 Contribution 表达。Core 负责层数、有效层数、时间与到期结算，内容通过所属领域操作更新自身输出。

STACK Definition 提供 `onStackChange(battle, self, previous): BattleState`。previous 是变化前实际层数的 number 样本，self 是已经发布新层数的 STACK 实例，保留对应私有状态与宿主类型。增加、手动减少和自然衰减共用这个回调；实际层数变化即调用，即使有效层数因上限而未变。INACTIVE 实例变层也执行回调，具体输出更新遵守当前生效资格。满层仅刷新时间不调用；初次创建由 onInstall／onEnable 处理，最后一层耗尽走正常结束流程。

`decreaseStack(battle, ref, amount): BattleState` 是公开的减层完整操作，ref 要求指向 STACK 实例。它从最新状态读取当前层数，仍有剩余时先发布新层数，再调用 onStackChange；耗尽则正常 end。手动减层保留 expiration，自然 DECAY 则先一起发布新层数和 `remaining = duration`，再调用回调。调用者通过该操作改变层数，回调只负责相应内容程序。回调返回后继续按最新 BattleState 读取后继事实，遵守公共同步重入契约。

重复施加与计时的原生依据见[普通合并分支](../research/cases/01-buff-installation-and-parent-scope.md#82-普通-buff-合并分支)与[到期流程](../research/cases/01-buff-installation-and-parent-scope.md#9-2026-11-11-补核覆盖组身份与-stack-到期)。安装前决定重复施加结果是项目选择。

### 来源分组

Definition.group.independentSource 声明是否按来源独立分组，组归属在安装时确定。

未声明 group 的 Effect 不参与覆写组。已声明 group 时，分组范围限于同一个宿主；Definition 决定是否要求来源独立：

| 情况 | 分组身份 |
| --- | --- |
| 不要求来源独立 | `group.id` |
| 要求来源独立，来源 Unit 关联 Card | `(group.id, Card.id)` |
| 要求来源独立，来源 Unit 没有 Card | `(group.id, Unit.id)` |
| 要求来源独立，没有来源 | `(group.id, null)` |

Card 关联沿实际 `source → Unit → deployable.card` 读取；无 Card 的来源使用该 Unit 身份，适用于任意来源 Unit。Card 与 Unit 属于不同身份域，数值相同也不表示同一来源。同一卡牌产生的多个 Unit（包括重新部署）共享来源身份，不同 Card 保持独立；无 Card 的预放干员仍按各自 Unit 区分。

安装时确定组归属，此后来源退场不改变已存在实例的组归属。分组身份不替换 `Effect.source`，不改变内容的来源比较、重复施加／竞争政策或生命周期依赖。实际来源由具体机制确定；例如海嗣治疗以宿主浊心斯卡蒂为 source，而非执行光环的海嗣。

该契约明确采用上述分区，不复刻原生的前缀查找、匿名组迁移或 Character 类别判断。不新增通用 SourceIdentity 字段或映射表，也不要求 install 调用者手工拼键或重复传递身份。机制依据与实际内容影响见[来源分组调查](../research/cases/01-buff-installation-and-parent-scope.md#99-分组简化的实际内容影响)。


## 5. 回调与同步操作

| 回调      | 何时调用                         | 典型职责                            |
| --------- | -------------------------------- | ----------------------------------- |
| onInstall | 实例已登记后，一次               | 登记稳定 Hook，初始化内容所需联系   |
| onEnable  | 从不生效变为生效                 | 登记静态 Contribution，恢复输出     |
| onDisable | 从生效变为不生效，或活跃实例结束 | 撤销静态 Contribution，关闭附带输出 |
| onTick    | 本次推进时实例仍为 ACTIVE，时间状态已发布 | 根据本次前后时间状态结算周期伤害、治疗、补盾、Aura 刷新 |
| onStackChange | STACK 实例保留且实际层数变化已发布 | 接收 previous，按新层数更新贡献或执行具体业务 |
| onEnd     | 实例仍为 ENDING，依赖完整结束后，一次 | 移除稳定 Hook，执行结束业务         |

安装先检查宿主、Scope 与输入资格，再确定组归属和重复施加结果。拒绝分支不创建实例；合并分支直接更新保留实例；新建分支登记 INSTALLING 实例与 Lifetime，再调用 onInstall。暂未获准生效的 DEFAULT 候补也属于新建分支。

onInstall 是实际生效与到期结算前的一次性安装程序。接续其返回值后，重新读取当前实例和 expiration；仍为 INSTALLING 时先结算到期，零时长的新实例因此执行安装业务后结束，不调用 onEnable、onTick 或 onDisable。继续存在的实例转为 INACTIVE，再协调是否生效。onInstall 可以用 setExpiration 延长初始零时长或已到期期限，安装继续使用回调返回后的事实。生效协调也先结算到期，再决定是否启用。生效切换先形成新 lifecycle，再运行回调并接续返回值；回调输入表达新状态。

install 检查已取得宿主的生命周期；生效协调排除 INSTALLING／ENDING，并通过 Lifetime.available 检查自身及全部上游资格。纯发布不会调用内容程序：初次登记后直接将新实例传给 onInstall，状态切换发布后直接将新实例传给 onEnable／onDisable，无需重新查询刚写入的实例。onInstall、onDisable 等内容程序或完整业务操作返回后，按[状态接续约定](functional-core.md#状态接续后的读取与续执行)重读后续需要的事实；安装继续前确认当前仍为 INSTALLING。结束中宿主由所有权边保护到本 Effect 完整 Finalize 返回。

onInstall 完成前，实例不能执行 onEnable。安装期间的同步嵌套操作可以登记子实例、改变许可与私有 state，也可以结束自己或宿主。INSTALLING 和 ENDING 都由实例自身保存；结束的实例不在外层安装返回时恢复。INSTALLING 实例已经登记，可以成为子 Effect 的 Scope，也作为尚未结束的同组候选。

Contribution 的登记／撤销与 Hook 的开关是两种自然接入方式，不要求所有输出统一走同一个生命周期模板。

### 公开 API

操作按实际改变的领域事实命名：

| 操作                                              | 含义与返回值                                             |
| ------------------------------------------------- | -------------------------------------------------------- |
| `install(battle, hostRef, definition, initial)` | 新建返回新实例 Ref，合并或续期返回保留实例 Ref，拒绝返回 null；同时返回接续后的 BattleState |
| `get(battle, ref)`                    | 从明确输入版本查一个实例，不转换事实                     |
| `setState(battle, ref, state)`                 | 设置指定实例的私有 state，返回相应战斗版本               |
| `setEnabled(battle, ref, enabled)`               | 返回完成许可、生效变化与回调后的状态                     |
| `setExpiration(battle, ref, expiration)`           | 替换当前实例的时间状态，返回 BattleState |
| `decreaseStack(battle, ref, amount)`               | 对 STACK 实例完整结算减层、变层回调或耗尽结束，返回 BattleState |
| `end(battle, ref, reason?)`                       | 同步执行结束请求；最外层调用完成整批 Finalize 后返回      |
| `advance(battle)`                                | 由 Runtime 调度，返回一次 Effect 时间推进后的状态         |

返回的 Ref 指向本次新建或参与合并的保留实例；同步回调结束该实例不撤销这项事实，当前是否存在需从接续的 State 查询。合并返回值保留旧实例真实的 Definition／私有状态类型关联，不将它当作传入 Definition 的实例。

install 重载按 Definition 保证的行为保留返回证明，统一返回 `Result<Ref<T> | null>`：

| Definition 分支 | Initial 的 expiration | 返回实例类型 T |
| --- | --- | --- |
| 普通，无 group／DEFAULT／UNIQUE | Expiration | `OrdinaryEffect<S, H>` |
| STACK、END | Expiration | `StackEffect<object, object, "END">` |
| STACK、DECAY | DecayExpiration | `StackEffect<object, object, "DECAY">` |
| 普通，EXTEND／EXTEND_TIME | Expiration | `OrdinaryEffect` |

只有保证不合并的分支保留传入 Definition 的 S／H。可能合并的重载擦除无法证明的私有类型，保留同组政策保证的 STACK 与 END／DECAY 事实；同一完整组的政策一致包括 expirationPolicy。具体私有类型由已有的 Definition 身份查询恢复。

安装输入与同一重载内的 Definition 分支对应：

```typescript
interface Initial<S extends object, E extends Expiration = Expiration> {
    readonly source?: Ref<Unit> | null;
    readonly scopes?: readonly Scope[];
    readonly expiration?: E;
    readonly state?: S;
    readonly enabled?: boolean;
}
```

上述安装分支允许的时间类型均包含 INFINITE，省略 expiration 时采用该默认值。DECAY 的重载使用 `Initial<NoInfer<S>, DecayExpiration>`；其余使用 `Initial<NoInfer<S>>`，宿主参数继续要求 `Ref<Unit & NoInfer<H>>`。重载由 Definition 分支决定，Initial 不反推或扩大允许的时间类型，宽实现签名保持内部。

Effect 的 end 委托自身 lifetime 描述符。Scope 构造、类型恢复、资格与依赖查询、绑定和解绑使用 core/lifetime 的 scope／getRef／available／dependencies／bind／unbind；通用 request／drain 不向内容开放。

```typescript
function setState<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState;

function setExpiration<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    expiration: NoInfer<T["expiration"]>,
): BattleState;
```

`setState()` 接收已经计算好的 state，从传入 BattleState 重新读取当前实例。宿主或实例缺失时抛出 RangeError；给定 state 与当前 state 引用相同时返回原 BattleState。提交只改变 state，保留当前身份、Definition、source、expiration、enabled、lifecycle 和编号进度。

内容从当前 battle 查询 state，完成业务采样和局部计算后直接提交结果值，保留未变字段。计算和提交之间不执行其他完整操作；跨领域调用后先接续其 battle，再重读所需实时状态。INSTALLING、INACTIVE、ACTIVE、ENDING 都允许设置私有数据；onDisable／onEnd 因而可以更新清理进度，写入不会恢复生命周期或阻止最终移除。

`setState()` 不自动重建静态 Contribution、刷新 Aura 或重新执行 onEnable。内容程序接续返回状态，需要刷新输出时明确调用对应 Capability 的操作。生命周期程序用公开函数形成并返回后继版本，self 只表示本次调用的输入实例。

`NoInfer` 约束本次结果值的类型推导。私有更新必须保留实例与 Definition 对应的 S／H 类型关联；Ref 可协变查询，借预先弱化的完整 Ref 写入不兼容私有数据属于调用契约错误，不增加运行时数据形状检查。

`setExpiration()` 从当前 battle 按精确 Effect Ref 取得宿主与实例，只替换 expiration。新值遵守 Ref 所指类型的 expiration 约束；普通 Effect 可以切换时间类型，Burst 等已收窄类型保持自身的时间契约。DURATION 的 duration、remaining、rate 在写入入口校验为有限非负数，remaining 可以大于 duration；DEADLINE 的 tick 为非负安全整数。非法值、缺失宿主或实例抛出 RangeError。给定对象与当前 expiration 引用相同时返回原 BattleState，不修改 Lifetime 关系。

时间写回保留当前 lifecycle，INSTALLING、INACTIVE、ACTIVE、ENDING 均可更新；ENDING 中写入不会恢复实例或阻止最终移除。该操作只提交结果值，不额外推进或立即结算到期。安装完成、生效协调或正常 advance 在各自的检查点处理后继。

DURATION 的手动续期或减时同样使用 setExpiration。调用方从当前实例取得已收窄的 DURATION，只替换 remaining 即保留 duration 与 rate：

```typescript
effects.setExpiration(battle, ref(self), {
    ...self.expiration,
    remaining: 120,
});
```

remaining 写为零也由上述检查点结算到期。

### 结束流程

Effect 的 end 使用共享的请求／Finalize 协议：

1. 先登记 PREPARING 工作，发布 ENDING 及必要关系。
2. Prepare 根据标记前是否 ACTIVE，调用 onDisable 撤销输出，然后协调 Group。
3. 按确定顺序请求直接依赖者，接续各项状态，本实例进入 READY。
4. 所有未完成依赖者完整 Finalize 后，从当前存储读取本实例，调用 onEnd。
5. 接续 onEnd 返回状态，按同一身份移除实例并注销 Lifetime 关系；整个 Finalize 返回后解除 Pending.parents。

Group 在 Prepare 即排除 ENDING 候选并协调弱者，早于本实例 onEnd。补位仍按最新宿主 PRESENT、enabled、Scope 资格及原竞争规则决定；Unit 已 LEAVING 时不会启用候补。onDisable 中的多步操作不是原子事务：其中同步调用的 Hook 可以观察到尚未全部撤销的输出，需要随标记原子失效的具体事实必须一起提交。

父对象准备结束与依赖者完整完成之间的顺序、首次原因和嵌套请求边界，统一遵守[Lifetime 请求与完成契约](lifetime.md#请求与-prepare)。嵌套 end 不保证实例已经注销，需要已完成事实的后继业务使用领域完成通知。

Unit 从 LEAVING 开始，通过真实所有权边请求 Skill、Action 和 Effect（包括标准 Burst）结束；只有这些子项与显式依赖者都完整 Finalize 后才注销。Effect.onEnd 内请求宿主退场会先标记宿主，但宿主会等待本 Effect 整个 Finalize 返回，不会在回调中途消失。onEnd 从当前存储取得 self，宿主在整个回调期间受所有权保护。

每次可能执行内容的完整操作后，后续需要当前事实时仍重读最新 battle，不把旧 Unit 或 Effect 整体写回。等待只来自真实拥有关系和显式 Scope；Effect.onEnd 调用 Unit.remove 本身不生成反向调用等待边。

逐接收者业务仍按普通控制流决定：先判断并请求结束 A，再判断 B。B 可以观察到 A 的同步 Prepare；若当前已有结算范围，不能把 A 的 Finalize 当作已完成。HP 到零、倒地、复活与实际离场分开；时间到期的原因仍为 EXPIRED。

## 6. 时间推进

battle/runtime.step 每 Tick 调用一次 Effect advance，安排在 Schedule 与 Unit tick 之后、Elemental 与 Skills 之前。step 直接表达领域操作的顺序并接续返回值；Effect 只完成一次时间推进。

时间状态由公开的 Expiration 表达：

```typescript
type Expiration =
    | {
          readonly type: "DURATION";
          readonly duration: number;
          readonly remaining: number;
          readonly rate: number;
      }
    | { readonly type: "DEADLINE"; readonly tick: number }
    | { readonly type: "INFINITE" };
```

DURATION 保存一轮完整预算 duration、当前剩余量 remaining，以及每次调度自动扣除的 rate。每次对 ACTIVE／INACTIVE 实例令 `remaining = max(0, remaining - rate)`，为零时到期。remaining 可以超过 duration，刷新当前剩余量不自动改变下一轮的重启预算。rate 是具体数值，零表示由内容程序自行推进。DEADLINE 在 `battle.tick >= tick` 时到期；INFINITE 没有自动时间到期条件。合法输入只在 install／setExpiration 校验一次，内部推进信任已建立的约束。

```text
固定本次推进的 Unit / Effect Ref 候选
    ↓
逐个读取上一项返回状态中的实例
    ├─ ACTIVE／INACTIVE：采样 previousExpiration
    │                    → 自动推进 DURATION 并发布
    │                    → 若仍为 ACTIVE，执行 onTick
    └─ 重新读取实例与 expiration，按普通／STACK 政策结算到期
```

新装实例不进入已经固定的本次推进候选；已经结束的候选跳过。onTick 取得时间状态已经发布的 self，第三参数是本次自动推进前的固定样本，不是第二份持久状态。DURATION 的 rate 为 0 时自动计时不变，ACTIVE 实例仍执行 onTick；DEADLINE 和 INFINITE 也照常执行 ACTIVE 的 onTick。

本次自动扣时达到零后，ACTIVE 实例仍执行最后一次 onTick，再读取最新实例结算到期。回调可以用 setExpiration 续期、替换剩余量或转换时间类型，最终检查使用回调返回后的 expiration；同步结束或移除的旧实例不再被外层推进恢复。普通到期请求 end(EXPIRED)，STACK 按 END／DECAY 政策结束或减层重启。

INACTIVE 的 DURATION 继续扣时，但不执行 onTick；恢复生效不补发停用期间的业务。Burst 以 rate 为零且仅在 ACTIVE 的 onTick 手动推进恢复，因此停用时恢复进度暂停。对 Burst 这类不续期的单轮进度，可以用 `duration - remaining` 得到已推进量；周期输出的独立相位与刷新政策由具体 Definition 决定。

首次立即触发表示第一次符合条件的推进可以触发；内容明确需要安装时执行的业务才放进 onInstall／onEnable。抽象 Effect 不添加通用周期定时器或专用 Aura 刷新阶段。

### 必要回归场景

- 安装回调可以观察和修改初始时间；回调后仍为零时长或已到期时只完成结束，不调用 onEnable／onTick／onDisable，onInstall 已完成的业务不回滚。安装中已结束的实例不会复活。
- 重复施加按政策拒绝、合并或新建；合并保留原实例的身份与内容状态，DEFAULT 候补仍执行安装程序。
- DURATION 在禁用或被覆盖时继续扣时，onTick 仅对 ACTIVE 执行；rate 为零允许手动推进。最后一次推进先发布时间再结算业务，回调续期或转换类型后按最新结果决定后继。
- STACK 区分实际／有效层数与当前剩余量／重启预算；按配置加层、满层刷新，END 到期结束，DECAY 减层并在最后一层结束。
- 保留实例变层先发布再同步调用 onStackChange，previous 保留旧实际层数；手动减层保留当前时间，自然衰减重启预算，耗尽正常结束。
- 禁用实例的绝对期限仍可到期；时间 Setter 只写入结果，启用前的到期检查不产生短暂输出。

以上场景集中验证公共时间协议，不按每种标准 Effect 复制计时、续期或启停矩阵；具体内容只补自身新增的可观察结果。

## 7. Capability 的接入

### Hook：函数与资格闭包

Hook 使用公共协议，具体阶段与工作值由提供扩展点的领域定义：

```typescript
interface Hook<C, T> {
    readonly id: string;
    readonly accepts?: (battle: BattleState, context: C, current: T) => boolean;
    readonly invoke: (battle: BattleState, context: C, current: T) => Result<T>;
}
```

Context 是本次派发固定的事件或操作事实；BattleState 与 current 逐项接续。Hook 存于 Unit.hooks 或专属 Capability State；提供扩展点的领域决定排序、资格和整次派发的停止条件。Damage 的阶段与 priority 不成为 Effect 的字段。

具体 Effect 可以在 onInstall 登记 Hook，在 onEnd 撤销。闭包捕获稳定的 Effect Ref 与静态配置；accepts 和 invoke 从最新 battle 读取当前实例、覆写结果和私有 state。不能把安装时捕获的数据当作当前盾数。消耗等需要被嵌套观察的进度先写回，再进入其他领域操作。

候选、替换和嵌套派发遵守[公共 Hook 契约](functional-core.md#7-同步候选范围)。Effect 接入只补充自身实际生效资格与对应业务结果，不为各个回调点另外定义派发协议。

吸血、反伤、安装其他 Effect 等业务直接调用对应领域操作并接续结果。零层护盾只是不满足本次拦截资格；若 Effect 还负责周期补盾，可以继续保持 ACTIVE 和执行 onTick。

### Contribution：由 Capability 持有的数据包

```typescript
interface Contribution<V> {
    readonly id: string;
    readonly value: V;
    readonly group?: { readonly id: string; readonly priority: number };
}
```

Contribution 模块只提供贡献类型与 resolve 有效来源选择，载荷求值由所属领域完成。Capability 的属性保存 Contribution 数组，通过领域 Change 复用 common/collection/entries.ts 完成登记、替换与移除，公开 `setAttackContribution()`、`removeAttackContribution()`、`resolveAttack()` 等操作；来源决定何时调用这些操作。

Contribution 分组平局使用 ID 字典序，Effect 覆写平局使用安装先后，两者按各自领域规则独立结算。

属性增益通常在 onEnable 登记 Contribution、在 onDisable 撤销；具体 Definition 依赖所需 Capability，Effect 核心不依赖它们。Contribution 的载荷和计算模型由所属领域决定，详见[属性与贡献](capability.md#属性与贡献)。

静态采样由内容决定刷新时点，动态 Contribution 在查询时只读求值。`setState()` 不隐式刷新已经登记的输出；需要响应私有数据变化的内容明确更新相应 Contribution。

## 8. Aura 的支持边界

Core 没有通用 Aura 实现，具体光环也未完成接入。现有 Effect、Targeting 与 Lifetime 提供以下内容组合边界；内容覆盖范围见 [Tactical 语义的逐项目标与缺口](tactical-semantics.md#逐项目标与缺口)。

```text
Unit A
└─ Aura Effect
   ├─ State：目标登记、精确子 Ref、刷新进度
   ├─ onTick：查询目标，按内容规则更新登记
   └─ 接收 Effect
      ├─ Unit B.effects
      └─ Unit C.effects
```

Aura 本身是宿主上的 Effect。需要选择目标时复用 Targeting；私有 state 保存已经安装的子 Ref 及必要历史。接收者进入时安装普通 Effect，离开时按具体规则结束，刷新时按具体规则替换样本。

如果子 Effect 必须随 Aura 结束，使用 scope(effectLifetime, auraRef) 绑定该实例。若子效果可以保留，则不绑定这个 Scope，结束策略由内容显式执行。Aura 暂时失效是否禁用子实例、恢复是否保留身份，也由这个 Definition 的生命周期回调表达。

普通光环与一次性分发都由具体 Effect Definition 表达。目标选择复用 Targeting，生命周期复用 Scope，刷新、保留与重装策略按内容需求决定。

## 9. 状态返回、可见性与不可变约定

Effect 操作组合直接的不可变领域更新，由所属领域操作维护 Battlefield 与 Lifetime 关系。调用者接续返回值；嵌套 end 返回只保证请求和首次 Prepare，不保证最终通知与移除已完成。最外层 Lifetime 结束入口清空 Pending 后返回，step 在全部领域操作与结果计算成功后返回最终 State。

self 是本次回调输入版本中的不可变实例，不动态跟随另一份状态。嵌套调用返回后，需要后继事实就从新 State 查询，不能把嵌套前的整个 Unit 回填到新版本。

Unit、Effect、Hook、Contribution 与其嵌套状态一旦写入，就按不可变值使用。创建新对象更新受影响路径，其余共享引用。查询返回共享引用；Core 调用者共同遵守这个约定，readonly 辅助表达意图。

回调输入不保存为异步运行句柄。跨 Tick 的业务进度保存在实例 state 中。step(battle, commands) 是外部同步入口；异常直接传播，输入 State 保持不变，不定义额外恢复协议。

共享终止协议见 [Lifetime 与依赖析构](lifetime.md)。实例自身保存 ENDING／LEAVING；BattleState.lifetime.endings 保存未完成工作，不保存第二份存活状态。完整 Finalize 返回前保留 parents，宿主不能因子实例已物理移除而提前注销。

## 10. 标准效果库与候选范围

标准效果成品库位于 `core/effects/`；具体角色的私有机制由 Content 实现。下列清单是语义候选目录，不表示各项都有成品或公共 API。已实现范围见本节的目录与支持范围。

### 候选范围

| 类别 | 效果候选 |
| --- | --- |
| 基础控制 | 眩晕、无法行动、束缚、自缚、缴械、强制缴械、战栗 |
| 技能限制 | 沉默、静默、单独禁止 Skill 发动 |
| 持续控制 | 停顿、寒冷、冻结、麻痹、麻痹震颤、迟钝 |
| 复合状态 | 沉睡、小睡、闭锁、放逐的标准状态部分、重伤 |
| 移动与阻挡 | 浮空、缚地、恐惧、自惧、诱导、不可阻挡、起飞 |
| 资源与操作限制 | 阻回、技力封闭、治疗接收禁止、禁止手动撤退 |
| 可选中性 | 隐匿、迷彩、反隐、异阵营不可选中、同阵营不可选中、治疗不可选中、对地规避 |
| 保护 | 无敌、不死、元素免疫 |
| 伤判 | 闪避、伤害抵挡、次数护盾、物理护盾、HP 屏障、元素损伤屏障 |
| 接收量修正 | 庇护、对空庇护、固定伤害减免、脆弱、物理脆弱、法术脆弱、元素脆弱 |
| 标准属性效果 | 虚弱、鼓舞、失重、坚忍、精力充沛、偷取、折射、术法充盈 |
| 标准元素爆发 | 神经、侵蚀、灼燃、凋亡、狂躁的对应爆发效果 |

这些是语义种类，不对应封闭的 Effect 枚举，也不要求每项有独立的 Definition、工厂或文件。具体实现的归属由行为与数据职责决定；候选项的精确机制和交互不属于当前通用 Effect 协议。

机制资料参考社区资料：[异常效果](https://prts.wiki/w/异常效果)、[术语释义](https://prts.wiki/w/术语释义)、[伤判效果](https://prts.wiki/w/伤判效果)。已有客户端证据见[启动资格与中断](../research/cases/08-action-eligibility-and-interruption.md)、[异常免疫与反制](../research/cases/19-effect-selection-and-immunity.md)。本表不是对全部候选完成客户端取证的声明。

### 需要区分的基础机制

| 机制 | 需保留的职责区别 |
| --- | --- |
| 异常免疫、组合免疫 | 对应状态或组合是否有效；与拒绝整个 Effect 安装分开 |
| 异常反制 | 清除相关既有 Effect，并阻止新增 |
| 抵抗 | 对应可抵抗效果的计时与衰减 |
| 技能强启 | 特定异常中的发动许可，以及发动时的清理 |
| 位移、失衡、传送免疫 | 相应空间操作的资格 |

Core 的领域规则、资源操作、查询、Hook、Contribution 和生命周期，为标准效果库提供基础接口。标准效果组合这些接口实现公共行为；候选清单本身不建立实例状态或公共 API。

### 目录与职责

```text
core/
├── effects/
│   ├── control.ts
│   ├── protection.ts
│   ├── visibility.ts
│   └── elemental/
│       ├── neural.ts
│       ├── erosion.ts
│       ├── burn.ts
│       └── necrosis.ts
└── unit/
    ├── effect/          # 附着实例、生命周期操作、Effects 异构容器
    └── capability/
        └── elemental/
            └── burst.ts  # 共同类型、进度、EP 恢复与结束收尾
```

- 标准元素爆发依赖眩晕等标准效果，公共程序保持 Core 内部依赖；Content 直接复用这些成品，避免各自实现同一机制而产生优先级、叠加或替换差异。
- 标准效果库导出 stun、invincible 等具体 Definition 或配置工厂；`core/unit/effect/` 提供 install、end 等实例操作。Effects 是运行时异构容器，两者按职责和导入名称区分。
- Elemental Capability 继续负责 EP 接收与提交、爆发触发和当前爆发引用；`effects/elemental/` 实现标准爆发造成的伤害、控制、属性变化与周期输出。Data 选择已有实现并绑定静态数值，不自行实现爆发执行程序。
- Content 决定标准效果的施加对象、触发时机、配置参数与专属附加业务。普通属性增减、任意周期输出、反伤、标记、光环等继续按具体内容组合；专属程序也使用同一套 Definition 与安装接口，不建立涵盖所有 Effect 的封闭总枚举。
- 控制、保护、可选中性程序分别位于 [control.ts](../../src/core/effects/control.ts)、[protection.ts](../../src/core/effects/protection.ts)、[visibility.ts](../../src/core/effects/visibility.ts)，八个标准元素爆发 Effect 位于 `effects/elemental/`。文件按职责组织，一个文件可以提供多个具体效果。

### 支持范围

Core 提供四型元素的八套标准爆发，狂躁只在候选目录中。`control.silence` 仅限制 Skill 发动，不提供完整沉默或静默语义。

`healFree` 是只供普通 HP 治疗选择检查的标准 Effect，按 Definition 身份和 ACTIVE 生命周期生效，不登记目标限制贡献；独立 EP 回复与明确目标的 Healing 接收不检查它。Damage／Healing 的 Calculate、Apply、Hook 和提交时序见 [Vitality](vitality.md)。
