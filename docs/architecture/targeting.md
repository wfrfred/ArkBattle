# Targeting 与 Targetable

目标选择由普通 Query、集合算法和领域函数组合。Targeting 提供常用候选资格、空间判断与优先级比较；Targetable 保存目标自己的受选限制和嘲讽属性。选择时机、目标绑定与后续复验归调用业务。

## 查询组合

```typescript
const candidates = units.all(battle)
    .filter(hasTargetable)
    .filter(targeting.damage(battle, source))
    .filter(targeting.inRange(origin, range));

const selected = topK(candidates, count, targeting.distance(origin));
const bindings = selected.map(units.ref);
```

source 是调用者选定版本的 Unit。采用标准敌我资格时，来源必须具有 Allegiance，由类型约束表达；调用方从宽泛 Unit 取得来源时，在调用边界收窄。Query 绑定输入 BattleState，谓词读取同一版本；集合终端保留候选完整类型，只有保存身份或调用后续操作时才生成 Ref。候选来源可以是全场、阻挡关系或既有名单，内容可以组合多个查询。

`common.topK` 负责稳定排序与截取，比较相同保留源顺序。`Query.take` 只取当前顺序的前若干项。`rng.sample(candidates, count)` 立即消费候选并无放回抽样；调用者显式接续 RNG 状态，不能在惰性谓词或比较器中消费随机数。

标准谓词直接适配 `Query.filter`，不要求所有查询经过同一选择入口。简单的身份、Layer 或资源条件直接读取已有对象；敌我关系、阻挡关系与属性求值复用所属领域查询。

## 标准资格

四种标准谓词均接收 `(battle, source, ignore?)`，返回保留输入 U 的能力守卫：

```typescript
function damage(
    battle: BattleState,
    source: Unit & Allegiance,
    ignore?: (restriction: Restriction) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Vitality & Allegiance;
```

四种标准谓词均要求来源具有 Allegiance。候选来自异构集合，谓词检查候选的能力并保留证明：damage、healing 证明 Vitality 与 Allegiance；elementDamage、elementHealing 证明 Elemental 与 Allegiance。已有 Hitbox、Route 等能力不会在连续筛选中丢失。通用 Targetable 限制查询不因此要求所有来源或目标具有阵营。

| 谓词 | 常用政策 |
| --- | --- |
| damage | PRESENT、空间存在、有 Vitality 且 HP>0、敌对、目标受选限制允许。 |
| healing | PRESENT、空间存在、有 Vitality 且 HP>0、同阵营、有效 HP 未满、目标受选限制允许，且没有 ACTIVE 的标准 healFree Effect。 |
| elementDamage | 空间存在、Elemental 可用、无 Burst、目标非中立、敌对、目标受选限制允许。 |
| elementHealing | 空间存在、Elemental 可用、无 Burst、同阵营、有 EP 恢复需求、目标受选限制允许。 |

Elemental 可用要求 PRESENT；具有 Vitality 时还要求 HP>0，不要求所有 Elemental Unit 都具有 Vitality。EP 标准资格不构造 Damage／Healing Request，也不执行其完整接收 Rule。具体作用仍由 Apply 检查；选择成功不保证接收成功。

标准谓词明确组合各自政策。普通 HP 治疗选择检查 healFree，独立 EP 回复不检查；特殊选择由内容直接组合目标限制和所属机制查询。

联合治疗的需求是 HP 或有效 EP 可恢复，不能先使用 HP healing 排除满 HP 的患者，再尝试补 EP 条件。Burst 中 EP 不构成恢复需求，但缺 HP 仍可入选。具体内容明确是否采用 healFree 限制，以及比较 HP 比例与绝对 EP 剩余量的主次。

## 空间与优先级

`inRange(origin, range)` 检查目标 Hitbox 与显式原点的几何范围相交，无 Hitbox 返回 false。它不隐含生命周期、空间存在或阵营。朝向范围由 `geometry.fromTiles` 生成；来源位置、搜索原点和排序参考可以分别指定。

比较器使用普通 `(left, right) => number`：

- `distance(origin)` 比较距离平方。
- `hpRatio(left, right)` 要求双方具有 Vitality，比较当前 HP 与有效 MaxHP 的比例。
- `taunt(battle)` 要求双方具有 Targetable，有效嘲讽越高越优先。
- `blockedFirst(source)` 按该来源的实际阻挡关系列表顺序排列相关目标；来源要求 Blocker 或 Blockable。

比较规则按内容用 `a(left, right) || b(left, right)` 组合。入场先后采用当前 UID 顺序，后入场优先直接比较 `right.id - left.id`。仇恨是比较公式，不保存在 Unit 或 Targetable State 中，不增加入场时间、序号或仇恨缓存。

路线优先读取 Route／Navigation 提供的估计剩余路程，不以当前位置至最终格的直线距离或导航搜索代价代替。角色按入场顺序、敌人按路线距离等普通规则由内容明确采用，不能从 ALLY／ENEMY 推断实体使用哪项政策。

阻挡前缀补足可以分两次选择：先按关系顺序筛选并占用名额，再从普通范围候选排除已选身份，补足剩余名额。敌人对自身 blocker 的直选按既定内容政策检查 PRESENT、空间存在、存活与敌对，可以绕过普通受选限制；普通范围分支仍使用标准资格。干员阻挡目标没有隐含的限制豁免。

## Targetable

```typescript
interface Definition {
    readonly taunt: number;
    readonly restrictions: readonly Contribution<Restriction>[];
}

interface Restriction {
    readonly allows: (
        battle: BattleState,
        source: Unit,
        target: Unit & Targetable,
    ) => boolean;
}

interface State {
    readonly taunt: readonly Contribution<Input>[];
    readonly restrictions: readonly Contribution<Restriction>[];
}
```

Restriction 只读地判断目标是否允许给定来源选择自己，不接收整次查询程序。来源输入可以由调用者从当前状态取得，也可以由具体延迟输出保留；Targetable 不自行解析失效 Ref 或猜测回退策略。

Definition 的 taunt 和 restrictions 均显式提供。初始化建立空嘲讽贡献，并核对固有限制 ID 唯一性，重复 ID 拒绝构造。固有与动态限制进入同一 State 集合。

`resolveTaunt(battle, self)` 先选有效贡献、动态求值，再按属性公式计算并作半值取偶的整数求值。嘲讽允许负数。`setTauntContribution`／`removeTauntContribution` 沿用普通注册 Change；查询时求值，不维护衍生仇恨状态或附加 Settlement。

`setRestriction`／`removeRestriction` 同样返回 Change。Contribution.id 标识一次独立登记，Restriction 定义对象本身是豁免身份。同一机制的固有和动态来源共享定义对象；不同机制保留不同定义对象，即使复用同一个 allows 函数。

```typescript
const permitted = targetable.allowsRestrictions(
    battle,
    source,
    (restriction) => restriction === invisibleRestriction,
);
```

`allowsRestrictions(battle, source, ignore?)` 返回目标谓词。它先按 Contribution 规则解析有效项，再将定义传给 ignore；返回 true 的定义在本次查询中豁免，剩余项必须全部允许。省略 ignore 表示不豁免，`() => true` 表示豁免全部受选限制。豁免不恢复被竞争压制的项，不改变目标状态，也不豁免生命、阵营、范围或实际作用的接收规则。

普通内容调用标准资格，不需要解释各项限制；特殊内容可以直接使用 Targetable 查询。选择性豁免按定义对象的 `===` 身份比较；上例跳过所有有效的 invisibleRestriction 登记，仍保留迷彩、无敌等其它定义。异常免疫由所属机制维护，Restriction 复用其事实，不在 Targetable 复制免疫状态。

healFree 是独立的标准 Effect，普通 HP healing 按 Definition 对象身份查询其 ACTIVE 实例。它不登记 Restriction，有效性由 Effect 生命周期与竞争决定。复合内容通过安装独立的标准实例取得此语义；明确目标的 Healing 接收不检查该标记。

## 调用业务

攻击模板的每个 TargetGroup 保存 `select(battle, sourceRef): Result<readonly Ref<Unit>[]>`。调用时读取来源、构造并消费 Query，按组顺序接续返回状态后保存 bindings。启动拒绝仍保留此前已经发生的随机消费。

需要复用资格的内容共享自己的谓词或候选构造函数：启动条件使用存在性查询，选择使用集合终端，已绑定目标的显式复验只检查当前资格，不重新竞争名额或抽随机数。各时点是否采用相同资格由该内容决定。

已有锁定身份的 Projectile 不自动重新执行普通选择。AOE 等延迟业务自己决定何时保存来源事实、何时搜索当前空间目标，见[原生实例](../research/cases/33-targeting-and-targetable-pipeline.md#46-来源离场后的真实群攻弹道)。Targeting 不管理这些输出的生命周期或快照。

## 关键语义与验收

- 普通 HP／EP 选择采用对应标准资格；EP 候选不因完整接收 Rule 拒绝而提前消失，实际 Apply 仍可拒绝。
- 来源与搜索原点独立；范围使用当前 Hitbox。空间消失、Layer 和绑定后的命中按各自业务判断。
- 定义对象豁免覆盖共享定义的全部有效来源，保留其它定义；共用允许函数不合并豁免身份。竞争先于豁免，固有与临时登记互不误删。
- ACTIVE 的标准 healFree 只影响普通 HP 治疗选择，禁用或结束后不再限制；明确目标的 Healing 和独立 EP 回复分别判断。
- 联合治疗使用 HP 或有效 EP 的需求。阻挡前缀与普通候选可以采用不同政策，不因迁移改变既定内容结果。
- 标准资格的来源类型要求阵营；目标资格守卫保留已有能力并证明资源能力与阵营。嘲讽读取有效贡献，允许负值；入场排序直接使用 ID。
- 攻击按顺序接续各组 RNG，保存绑定；显式复验不重选。随机算法、Query 遍历与稳定 TopK 由公共套件集中验证。

验收先按上述独立结果选最小代表场景，不测试已删除接口的缺席或为每个函数复制公共算法矩阵。具体归属见[语义验收](verification.md)。
