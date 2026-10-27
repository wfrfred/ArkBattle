# Targeting 与 Targetable

Targeting 执行本次目标选择；Targetable 提供单位参与索敌的能力及目标侧限制。领域内使用 Request、Filter、Selector、Comparator、Definition、State 等短命名。下文省略 import，targeting 表示 Targeting 领域的命名空间导入。

Targeting 位于 `battle/targeting/`，公共契约从 [index.ts](../../src/core/battle/targeting/index.ts) 导入；Targetable 保留 `unit/capability/targetable/capability.ts` 单文件入口。标准伤害、治疗与元素 Filter 由 Targeting 提供，具体内容显式组合本次请求的策略。

## Targeting

```typescript
export type Purpose =
    | "DAMAGE"
    | "HEAL"
    | "ELEMENT_DAMAGE"
    | "ELEMENT_HEAL"
    | "EFFECT";

export interface Request {
    readonly source: Ref<Unit>;
    readonly purposes: readonly Purpose[];
    readonly filter: Filter;
    readonly selector: Selector;
}

export type Filter = (
    battle: BattleState,
    request: Request,
    target: Unit & Targetable,
) => boolean;

export type Selector = (
    battle: BattleState,
    request: Request,
    candidates: readonly (Unit & Targetable)[],
) => Result<readonly Ref<Unit & Targetable>[]>;

export type Comparator = (
    battle: BattleState,
    request: Request,
    left: Unit & Targetable,
    right: Unit & Targetable,
) => number;
```

Request 描述整次索敌。候选目标通过 Filter 和 Selector 的参数传入；排序、目标数量与抽样方式由具体 Selector 决定。source 保留实例身份，回调直接消费已经取得的目标 Unit。

purposes 由调用方明确声明，不从 Action 的后续操作自动推导。空数组表示没有声明特定用途。用途对应的资格判断由显式组合的 Filter 和 Restriction 表达。

纯属性增益、施加状态等效果索敌声明 EFFECT，用途不携带 Effect Definition ID。伤害或治疗光环分别按本次索敌意图声明 DAMAGE 或 HEAL；是否由 Effect 实例承载不决定用途。EFFECT 不自动检查免疫或排除目标。异常免疫由对应效果机制维护；是否因免疫而提前排除候选，由索敌发起方组合 Filter 决定。

Filter 与 Comparator 只读，不执行领域结算或消费 RNG。Comparator 小于零表示 left 优先，大于零表示 right 优先，等于零表示本级相同，可以继续后续比较项。

Selector 接收本次筛选完成后的固定候选快照，返回来自这些候选的 Typed Ref。确定性排序、截取、随机抽样及其组合都由 Selector 表达。随机消费通过 Result.state 接续；伤害、治疗、离场等业务由调用方执行。调用方接续返回的 state，后续使用 Ref 读取当前对象并确认所需资格。

每个请求显式提供完整 Filter。选择流程只按请求给出的策略执行，不自动追加标准攻击、治疗或限制检查。标准 Filter 与特殊 Filter 都由内容组合。

## 选择入口与组合

```typescript
export function select(
    battle: BattleState,
    request: Request,
): Result<readonly Ref<Unit & Targetable>[]>;

export function hasCandidate(
    battle: BattleState,
    request: Request,
): boolean;
```

select 通过 units.all(battle) 按逻辑登记顺序枚举具有 Targetable 的单位，执行 request.filter，固定筛选后的 Unit 快照后调用 request.selector。空集合也交给 Selector。Selector 返回值来自候选的约束属于调用契约，不另设输出恢复或运行时验证层。

hasCandidate 实现在 query.ts，短路判断是否存在通过显式 Filter 的候选，不调用 Selector，不消费 RNG。它不承诺最终一定选出目标，例如数量为零的 Selector 仍返回空结果。Skill 等只读启动条件使用这个查询；需要实际选目标的 Action 接续 select 的 Result。select 保留在 select.ts，按 Selector 返回的状态接续随机消费，不归入只读查询。

filter.ts 提供 and、or、not、notSelf、present、alive、hostile、sameSide、ground、range、blocking、blocker、missingHp，以及标准组合 damage、healing、elementDamage 和 elementHealing。它们各自表达明确条件，调用方选择组合。阻挡关系只影响显式范围与排序政策，不隐式豁免限制。

敌人的 Combat 选择由内容显式提供单向例外：在场、存活且敌对的 blocker 直接成为候选，绕过普通索敌限制与范围。范围攻击的普通候选仍使用 damage 与 range；处于阻挡关系中的 blocker 分支同样保留直选。干员选择自己阻挡的敌人继续检查有效限制，阻挡本身不令隐匿、迷彩或无敌失效。直选只决定选择资格，伤害接收仍由 Damage／Vitality 处理。

compare.ts 提供 combine、distance、hpRatio、blockedFirst。combine 依序比较，第一个非零结果决定顺序；全相同时由稳定选择算法保留候选顺序。blockedFirst 按实际阻挡关系列表的顺序排列相关目标，其他目标交由后续 Comparator 判断。仇恨属性、出场顺序与剩余路线的接入仍见[目标语义缺口](tactical-semantics.md#targeting-后续重构记录)，不由阵营猜测实体类别。

selector.ts 的 first(k, compare) 使用稳定 topK；random(k) 在合法候选中无放回抽取，数量不超过候选数。两者选零个时返回空结果；随机空样本不消费 RNG。不同次选择独立抽样，可以重复选中同一单位。Action 决定在启动、每发释放或其他业务时点调用选择。

攻击模板的 TargetGroup.targeting 使用 Omit<Request, "source">。chooseTargets 按配置次序为各组补上 source，逐组接续状态，返回 Result<bindings>；启动回调读取选择完成后的 BattleState，启动拒绝同样保留已完成的选择消费。用途不从同组的输出操作推导；普通伤害附带被拒绝的元素输出，不会自动失去目标资格。

## Targetable

```typescript
export interface Definition {
    readonly restrictions: readonly Contribution<Restriction>[];
}

export interface Restriction {
    readonly kind: symbol;
    readonly allows: (
        battle: BattleState,
        request: targeting.Request,
        owner: Unit & Targetable,
    ) => boolean;
}

export interface State {
    readonly restrictions: readonly Contribution<Restriction>[];
}

export interface Targetable {
    readonly definition: {
        readonly targetable: Definition;
    };
    readonly targetable: State;
}
```

Definition.restrictions 与 State.restrictions 都是必填数组。没有固有限制时使用空数组，不以 undefined 表达另一种初态。初始化先检查 Contribution ID 唯一性，重复 ID 抛出 TypeError，包括同一 entry 被重复放入数组；不静默覆盖或去重。检查后按原顺序复制 Definition 中的贡献容器建立 State：

```typescript
const state: State = {
    restrictions: [...definition.restrictions],
};
```

单位固有的限制直接由 Definition 声明，不要求创建永久 Effect。Effect 等业务所有者可以在运行时登记和清理动态限制。固有与动态贡献进入同一个 State 集合，沿用现有 Contribution 的身份、替换、移除和互斥机制。

Contribution.id 标识一次登记，Restriction.kind 标识 Content 定义的机制；同一机制的多个贡献可以共存。kind 使用共享的 symbol 身份，Targetable 不枚举隐匿、迷彩、禁疗或免疫等具体内容机制，也不依赖 Effect 来源查询。

Restriction.allows 只读地判断单项限制是否允许其宿主被本次请求选中。Filter 判断本次候选是否符合选择策略；两者分别声明类型，结构相同不改变各自职责。owner 就是这项限制所属的目标 Unit，Request 本身没有 target 字段。

检查限制的 Filter 先按 Contribution 的规则取得有效限制，再按本次策略排除特定 kind，检查剩余限制是否全部允许。忽略某项限制不会使已被互斥规则压制的贡献重新生效。免疫和无视某种机制的具体语义由 Content 组合，不进入 Targetable 的内置分支。State 使用 restrictions 统一登记索敌限制。

## Targetable API

```typescript
export function hasTargetable<U extends Unit>(unit: U): unit is U & Targetable;

export function initialize(
    battle: BattleState,
    definition: Definition,
): Result<State>;

export function setRestriction(
    state: State,
    entry: Contribution<Restriction>,
): State;

export function removeRestriction(state: State, id: string): State;

export function allowsRestrictions(
    battle: BattleState,
    request: targeting.Request,
    owner: Unit & Targetable,
    ignore?: (kind: symbol) => boolean,
): boolean;
```

setRestriction 与 removeRestriction 是局部 State 转换，沿用 Contribution 的 ID 与引用复用规则。同一个 entry 对象重复登记、删除不存在的 ID 返回原 State；相同 ID 的新对象执行替换，不尝试比较回调的业务等价性。固有与动态限制共用 ID 空间，替换后删除不会恢复 Definition 的旧项；临时压制并在撤销后恢复的机制使用独立 ID 与互斥组。

allowsRestrictions 先 resolve，再按本次 ignore 豁免 kind，要求剩余限制全部允许。空限制集合返回 true。ignore 只读且只影响这次查询，不修改 State，也不使被互斥规则压制的贡献重新参与。查询只处理已登记限制，不额外判断存活、射程或阵营；owner 已具备 Targetable 并来自调用者选定的状态版本。

## 通用集合算法

common 提供与战斗领域无关的纯算法，Selector 按需调用：

```typescript
export function sort<T>(
    candidates: readonly T[],
    compare: (left: T, right: T) => number,
): T[];

export function topK<T>(
    candidates: readonly T[],
    k: number,
    compare: (left: T, right: T) => number,
): T[];
```

两个函数不修改输入，返回新数组；比较相同时保留输入顺序，包括第 K 名边界。k 约定为非负整数，topK 返回已经排序的结果，语义等价于 sort(candidates, compare).slice(0, k)。k 为零时返回空数组，超过候选数量时返回全部排序结果。具体算法可以优化，但结果遵守同一契约。
