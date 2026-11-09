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

source 是调用者选定版本的 Unit。Query 绑定输入 BattleState，谓词读取同一版本；集合终端保留候选完整类型，只有保存身份或调用后续操作时才生成 Ref。候选来源可以是全场、阻挡关系或既有名单，内容可以组合多个查询。

`common.topK` 负责稳定排序与截取，比较相同保留源顺序。`Query.take` 只取当前顺序的前若干项。`rng.sample(candidates, count)` 立即消费候选并无放回抽样；调用者显式接续 RNG 状态，不能在惰性谓词或比较器中消费随机数。

标准谓词直接适配 `Query.filter`，不要求所有查询经过同一选择入口。简单的身份、Layer 或资源条件直接读取已有对象；敌我关系、阻挡关系与属性求值复用所属领域查询。

## 标准资格

四种标准谓词均接收 `(battle, source, ignore?)`，返回保留输入 U 的能力守卫：

```typescript
function damage(
    battle: BattleState,
    source: Unit,
    ignore?: (kind: symbol) => boolean,
): <U extends Unit & Targetable>(target: U) => target is U & Vitality;
```

healing 同样证明 Vitality；elementDamage、elementHealing 证明 Elemental。已有 Hitbox、Route 等能力不会在连续筛选中丢失。

| 谓词 | 常用政策 | 选择用途 |
| --- | --- | --- |
| damage | PRESENT、空间存在、有 Vitality 且 HP>0、敌对、目标受选限制允许。 | DAMAGE |
| healing | PRESENT、空间存在、有 Vitality 且 HP>0、同阵营、有效 HP 未满、目标受选限制允许。 | HEAL |
| elementDamage | 空间存在、Elemental 可用、无 Burst、目标非中立、敌对、目标受选限制允许。 | ELEMENTAL_INJURY |
| elementHealing | 空间存在、Elemental 可用、无 Burst、同阵营、有 EP 恢复需求、目标受选限制允许。 | ELEMENTAL_INJURY_HEALED |

Elemental 可用要求 PRESENT；具有 Vitality 时还要求 HP>0，不要求所有 Elemental Unit 都具有 Vitality。EP 标准资格不构造 Damage／Healing Request，也不执行其完整接收 Rule。具体作用仍由 Apply 检查；选择成功不保证接收成功。

选择标准谓词即明确采用其用途和公共政策，不从后续 Operation 反推。独立 EP 回复用途不隐含 HEAL。复合用途、纯 Effect 或特殊资格通过 Targetable 的公开查询和所属机制查询组合，不要求伪造 HP／EP 请求。

联合治疗的需求是 HP 或有效 EP 可恢复，不能先使用 HP healing 排除满 HP 的患者，再尝试补 EP 条件。Burst 中 EP 不构成恢复需求，但缺 HP 仍可入选。具体内容决定比较 HP 比例与绝对 EP 剩余量的主次。

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

interface Context {
    readonly source: Unit;
    readonly purposes: readonly Purpose[];
    readonly owner: Unit & Targetable;
}

interface Restriction {
    readonly kind: symbol;
    readonly allows: (battle: BattleState, context: Context) => boolean;
}

interface State {
    readonly taunt: readonly Contribution<Input>[];
    readonly restrictions: readonly Contribution<Restriction>[];
}
```

Purpose 为 DAMAGE、HEAL、ELEMENTAL_INJURY、ELEMENTAL_INJURY_HEALED、EFFECT 的字符串联合。它描述本次许可判断的用途；空数组不声明特定用途，EFFECT 不携带 Effect Definition ID，也不自动检查安装免疫。

Context 仅属于一次 Restriction 求值，包含来源、用途和限制宿主，不携带候选、范围、比较器或数量。来源输入可以由调用者从当前状态取得，也可以由具体延迟输出保留；Targetable 不自行解析失效 Ref 或猜测回退策略。

Definition 的 taunt 和 restrictions 均显式提供。初始化建立空嘲讽贡献，并核对固有限制 ID 唯一性，重复 ID 拒绝构造。固有与动态限制进入同一 State 集合。

`resolveTaunt(battle, self)` 先选有效贡献、动态求值，再按属性公式计算并作半值取偶的整数求值。嘲讽允许负数。`setTauntContribution`／`removeTauntContribution` 沿用普通注册 Change；查询时求值，不维护衍生仇恨状态或附加 Settlement。

`setRestriction`／`removeRestriction` 同样返回 Change。Contribution.id 标识一次登记，Restriction.kind 标识机制，同一机制可以有多个来源。

```typescript
const permitted = targetable.allowsRestrictions(
    battle,
    source,
    purposes,
    ignore,
);
```

返回的谓词只检查目标侧限制：先按 Contribution 规则解析有效项，再排除本次豁免的 kind，最后要求剩余项全部允许。豁免不恢复被竞争压制的项，不改变目标状态，也不豁免生命、阵营、范围或实际作用的接收规则。

普通内容调用标准资格，不需要解释各项限制；特殊内容可以直接使用 Targetable 查询。无视隐匿只需声明对应 kind，仍保留迷彩、无敌等其它限制。异常免疫由所属机制维护，Restriction 复用其事实，不在 Targetable 复制免疫状态。

## 调用业务

攻击模板的每个 TargetGroup 保存 `select(battle, sourceRef): Result<readonly Ref<Unit>[]>`。调用时读取来源、构造并消费 Query，按组顺序接续返回状态后保存 bindings。启动拒绝仍保留此前已经发生的随机消费。

需要复用资格的内容共享自己的谓词或候选构造函数：启动条件使用存在性查询，选择使用集合终端，已绑定目标的显式复验只检查当前资格，不重新竞争名额或抽随机数。各时点是否采用相同资格由该内容决定。

已有锁定身份的 Projectile 不自动重新执行普通选择。AOE 等延迟业务自己决定何时保存来源事实、何时搜索当前空间目标，见[原生实例](../research/cases/33-targeting-and-targetable-pipeline.md#46-来源离场后的真实群攻弹道)。Targeting 不管理这些输出的生命周期或快照。

## 关键语义与验收

- 普通 HP／EP 选择采用对应标准资格；EP 候选不因完整接收 Rule 拒绝而提前消失，实际 Apply 仍可拒绝。
- 来源与搜索原点独立；范围使用当前 Hitbox。空间消失、Layer 和绑定后的命中按各自业务判断。
- 机制豁免忽略同 kind 的所有有效来源，保留独立限制；竞争先于豁免，固有与临时登记互不误删。
- 联合治疗使用 HP 或有效 EP 的需求。阻挡前缀与普通候选可以采用不同政策，不因迁移改变既定内容结果。
- 目标资格守卫保留已有能力；嘲讽读取有效贡献，允许负值；入场排序直接使用 ID。
- 攻击按顺序接续各组 RNG，保存绑定；显式复验不重选。随机算法、Query 遍历与稳定 TopK 由公共套件集中验证。

验收先按上述独立结果选最小代表场景，不测试已删除接口的缺席或为每个函数复制公共算法矩阵。具体归属见[语义验收](verification.md)。
