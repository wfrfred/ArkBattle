# Targeting 与 Targetable

目标选择是普通 Query 与集合算法的组合。Targeting 提供常用资格、类别筛选、几何条件和比较器；Targetable 拥有目标侧受选类别、受选限制及嘲讽。选择时机、绑定、重选与命中复验归调用业务，不存在另一套通用选择流程对象。

## 查询组合

```typescript
const candidates = units.all(battle)
    .filter(hasTargetable)
    .filter(targeting.inCategories(["DEFAULT"]))
    .filter(targeting.damage(source)(battle))
    .filter(targeting.inRange(origin, range));
const selected = topK(candidates, count, targeting.distance(origin));
```

Query 绑定输入版本，来源 Unit 是调用者选定的事实。候选可来自全场、阻挡或已有名单，内容可多次查询组合策略；终端保留能力类型，只在保存身份或调用后续操作时生成 Ref。

`targeting.damage(source, ignore?)` 绑定调用方选定的来源和限制豁免。它返回一个接收 `BattleState` 的函数，使用查询当时提供的状态构造目标谓词。延迟输出可以先保存该函数，再于命中时传入当前战斗状态。

topK 稳定排序截取，take 只取现有顺序；随机无放回选择立即消费序列，调用者显式接续 RNG，不在惰性谓词或比较器中取随机。

## 标准资格

标准谓词要求来源具有 Classification，并为异构目标证明所需资源能力与分类，保留已有其他能力。这里只消费 side，不按单位类别猜阵营：

| 谓词 | 政策 |
| --- | --- |
| damage | ACTIVE、空间存在、正生命、敌对，受选限制允许。 |
| healing | ACTIVE、空间存在、正生命、同阵营、有效 HP 未满，限制允许且无 ACTIVE healFree。 |
| elementDamage | 空间存在、Elemental 可用、无 Burst、非中立敌对目标，限制允许。 |
| elementHealing | 空间存在、Elemental 可用、无 Burst、同阵营且有恢复需求，限制允许。 |

生命和比例由 Vitality 解释；Elemental 不要求所有宿主都有 Vitality，具有时仍检查存活。EP 选择不伪造资源 Request 或执行完整接收限制，选中不保证后续作用成功，见 [Resource](resource.md)。

职业、子职业、组织、战斗标签和敌人级别使用 [Classification](capability.md#classification) 的纯查询组合进 Query；阵营、出生方式和 Capability 组成不能替代这些事实。分类查询不承担选择资格，标准资格也不隐含职业或标签限制。

联合治疗先判断 HP 或有效 EP 有需求，不能先排除满 HP 再补 EP 条件。Burst 不提供 EP 需求，但缺 HP 仍可入选；healFree 是否适用及混合排序由具体内容明确选择。

## 空间与优先级

inRange 检查目标 Hitbox 与显式原点的 Range 相交，无 Hitbox 为 false，不隐含其他资格。来源位置、搜索原点与排序参考可不同；朝向范围使用当前实例方向和几何转换。

普通比较器提供距离平方、有效 HP 比例、有效嘲讽及来源实际阻挡顺序，内容按主次组合。入场先后使用 UID；路线优先使用 Route／Navigation 几何剩余路程，不用直线或搜索代价替代。仇恨是比较公式，不保存入场时间、序号或仇恨缓存，也不按当前阵营猜实体的排序政策。

阻挡前缀可以先选关系目标，再排除已选身份补范围名额。敌人对自身 blocker 的直选可按内容绕过受选限制，但仍判断在场、空间、生命与敌对；干员阻挡目标没有隐含豁免。

## Targetable

Definition 提供初始受选类别，State 保存当前类别，内容通过 setCategory 切换。inCategories 读取当前值，普通范围查询纳入 DEFAULT，特殊选择可显式纳入 DEVICE 或 OBSTACLE。类别筛选和受选限制分别判断，阻挡直选按内容决定是否筛选类别。单位身份由 Classification 表达。

Definition 明确基础 taunt 与固有限制，State 保存嘲讽贡献及固有／动态的同一限制集合。固有限制重复登记 ID 在构造处拒绝。嘲讽按有效贡献和属性公式取偶舍入，允许负值，不另存派生仇恨。

限制使用精确 `{ source, target }` 纯 Context；allowsRestrictions 返回目标谓词，不读取完整查询程序、不解释用途枚举或失效 Ref。普通内容通过标准资格隐藏限制细节，特殊内容才直接组合它。

Contribution.id 是登记身份，限制定义对象是机制身份。豁免谓词在有效项竞争后执行；可按定义对象 === 忽略某机制，或以恒真豁免全部受选限制。共用 allows 函数不合并不同定义，忽略胜者不复活被压制项，也不绕过阵营、生命、范围或实际接收规则。公共贡献语义见 [Capability](capability.md#资格限制)。

healFree 使用标准 Effect 的 Definition 身份和 ACTIVE 状态，不重复登记限制；只影响普通 HP 治疗选择，明确目标的 Healing 与独立 EP 恢复不检查它。

## 调用业务

攻击各 TargetGroup 的内容选择函数按组顺序接续 State 并保存绑定；即使后来启动拒绝，已完成的 RNG 消费仍保留。启动存在性、实际选择和绑定复验可共享内容谓词，但复验不重新竞争名额或取随机，各时点是否同资格仍由内容决定。

锁定 Projectile 不自动重新索敌；延迟范围输出自己决定来源采样和搜索时点，Targeting 不管理其生命周期。真实例子见[来源退场后的群攻弹道](../research/cases/33-targeting-and-targetable-pipeline.md#46-来源离场后的真实群攻弹道)。

## 关键语义与验收

标准资格／类型保留、有效 HP／EP 需求、独立空间原点、定义豁免、healFree、绑定后复验与多组 RNG 的最小代表见[语义验收](verification.md)。Query、稳定 TopK 和抽样算法集中保障，不逐谓词重复。

原生完整流程见[Targeting 调查](../research/cases/33-targeting-and-targetable-pipeline.md)。其中启动条件、绑定与最终接收属于上下游证据，不能因原生 Selector／Ability 结构复杂而扩张本领域。普通仇恨及特殊内容的接入缺口集中见 [Tactical 语义](tactical-semantics.md)。
