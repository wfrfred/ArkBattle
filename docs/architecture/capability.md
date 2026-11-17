# Capability 的数据与操作契约

Capability 拥有本领域的静态配置、当前状态、初始化与合法操作。基础 Unit 只提供身份、Definition、位置、生命周期、Hooks 与 Effects；内容明确选择能力，不把全部能力做成基础 Unit 可选字段。

## 数据与类型

选择某能力时 Definition／State 必须配对，空的一侧使用空实现；未选择能力则两者都没有。领域内部的可空业务状态不受此规则影响。各能力的标准状态不携带 Action／Skill 等内容私有泛型，精确程序与 Ref 在所属领域保持私有配对。

业务以 Unit 与所需 Capability 的交叉类型表达依赖，泛型 hasX 守卫保留已知结构。登记后身份、Definition 与能力组成稳定；运行中的值变化不产生永久能力证明。

## 操作范围

纯数值／几何查询接收已经取得的值。已登记能力字段使用要求最低宿主能力的 Change，完整业务使用 BattleState 与 Typed Ref；何时需要后继由领域决定。

Change 组合、单宿主发布与 Settlement 的详细契约以[接口约定](api-conventions.md#51-unit-完整操作与批量变更)为准。本页不复制函数声明；跨领域只能调用该领域的合法 Change 或完整操作，不能手写其私有 State。

## 初始化与装配

Catalog 从 initializer 字典的函数签名派生配置、标准状态和 Initial，不维护第二份必需能力清单。initializer 接收当前 BattleState 与正在装配的 Unit，读取自身配置并补自身状态，保留已有字段与登记；有前置依赖时在输入类型中明确声明。

具体 Definition 决定装配哪些能力；对应 initializer 的第三参数必填时，initial 对应键及顶层 initial 都必填。允许额外的已知 Initial，它们在未选能力时忽略，未知键和错误值仍被类型拒绝。Occupancy 必需 tile，Route 必需 Plan／offset，Facing 必需方向；调用者不能预装运行进度或 Effects 容器。

Unit.initialize 按 Catalog 顺序接续各 initializer，最后合并 Definition.hooks；同键同 ID 后者覆盖、位置保留。Occupancy 先于依赖它的 Deployable。初始化可读取当前战场或消费 RNG，但半成品尚未登记，不能从战场查询自己；需要已有能力时直接读取输入 Unit。

能力可在装配时登记 enter／prepare／leave 等 Hook。固有登记在完整 add 和任何 enter 前就绪；同级保留默认装配顺序，实际执行按[公共 Hook 优先级](hook.md)。通用装配和 Unit 生命周期不按具体能力建立额外阶段。初始 Effect 在登记后的 enter 正常安装。

Unit enter／tick 要求宿主仍 PRESENT；prepare 使用固定 Departure 并先于自动请求依赖者。leave 在注销前捕获最新登记对象与优先级，注销后派发，历史载荷不变。完整机制见 [Lifetime](lifetime.md)，死亡归属与来源响应见 [Resource](resource.md)。

## 构造、校验与命名

真实输入和合法构造入口建立数值、身份、能力依赖与配置配对。内部信任 Typed Ref 和已有不变量，不重复解析私有数据，也不以强转或任意状态覆盖补出缺失能力。

Definition 可由 Content 组装，也可由 Data 调用已有工厂静态绑定；运行程序由所属 Core 领域或 Content 实现。初始化不等于 validate，查询不推进业务。命名、公开入口与字段级写回遵守[接口约定](api-conventions.md)，不增加空转发层、深拷贝或冻结协议。

## Classification

Classification 按需装配，Definition 保存静态分类资料，配对的 State 为空。Content 明确单位类别：OPERATOR、SUMMON、DEVICE 或 ENEMY；它们不建立 Unit 的行为继承，也不自动赋予 Capability。公共字段只有 side，其他事实按类别限定，所有静态数组显式提供。

OPERATOR 保存 groupTags、八职业之一、对应 subProfession 及 extraProfessions；合法职业与子职业配对由 professions 表确定，子职业使用闭合的大写标识。SUMMON 保存 groupTags，没有八职业，可复用子职业或明确为 null；DEVICE 保存 groupTags 与 filterTags，没有职业及子职业；ENEMY 保存 filterTags 与 NORMAL／ELITE／BOSS 级别。召唤物复用 EXECUTOR 不使其成为 SPECIAL 干员，额外职业也不改写基础职业与子职业。

类别、阵营与创建方式分别独立：ALLY／ENEMY／NEUTRAL 不决定单位类别，部署、调度或召唤操作也不自动改分类。原生依据见[单位分类调查](../research/cases/36-unit-classification-and-combat-tags.md)及[我方 Enemy 召唤物](../research/cases/32-leithanien-summons-blocking-and-movement.md)；明确游戏类别、单一 Capability 与空 State 是项目组织选择，不复刻原生 Character／Token／Trap 类链。

filterTags 是战斗筛选标签，groupTags 是组织归属，两者分别查询，类别没有对应字段时返回 false。干员档案种族不自动成为 filterTags。职业匹配由调用者明确是否包含额外职业；子职业可匹配 OPERATOR 与 SUMMON，级别只匹配 ENEMY，类别不符则返回 false。

hasClassification 与指定明确类别的 isType 提供结构／类别守卫，保留已有能力；isType 接收动态类别时只返回布尔值。matchesProfession／matchesSubProfession／matchesRank 也只返回布尔资格，不从匹配失败推断其他类别。需要类别字段时，先用 isType 收窄，再组合匹配条件。查询不检查存活、空间存在或受选资格，也不推进状态。泥岩等内容通过公共标签查询，不读取其他内容的完整 Profile。

普通敌对判定为一方 ENEMY、另一方非 ENEMY；ALLY 与 NEUTRAL 不因此敌对。阵营只作为具体业务输入，不自动决定索敌、受伤或阻挡资格。Blocking 的目标阵营由显式二元限制表达。空地身份、运动方式和本笔攻击途径继续由各自领域提供，不由分类或标签推导。

原生 EntityCategory、类筛选与单位当前攻击方式的剩余需求见 [Tactical 语义](tactical-semantics.md)，不把已有静态分类接口当作这些内容已闭合的依据。

## 属性与贡献

[Attribute](attribute.md)统一底值、贡献和最终范围：Definition 保存默认值／边界，State 保存修正来源及当前完整边界。范围单槽后写覆盖，clear 完整恢复默认，不保存来源历史；各领域通过自己的 Change 接入必要后继。

Offense、Vitality、Elemental、Locomotion、Targetable 与 SP 回复属性使用同一 Attribute 模型。它不代替当前 HP／EP／SP 余额、弹药聚合、阻挡容量政策或部署报价。Elemental 的 MaxEP 表示项目最终容量（含敌人级别预算），保留正容量前提，不将它误作原生基础 MAX_EP 字段的1000上限。

Contribution 只管理来源选择：同组最高 priority，平局较小 ID，独立项全部保留；resolveEntries 保留登记元数据，resolve 返回有效值，二者不求值动态载荷。动态 Input 由所属领域按当前 battle／self 只读求值，静态输入由来源在明确时点更新。

MaxHP、Action 时序与 Blocking 等具有各自的变化后继，见对应领域；不把属性查询变成完整业务或统一同步所有领域。

### 资格限制

Restriction 是精确领域 Context 上的纯允许判断，登记为 Contribution<Restriction>。登记 ID 管理来源，定义对象可标识机制；共享定义的多来源独立撤销，参数不同不自动共享身份。

有效贡献先竞争，再按 AND 判断未豁免的限制，空集合允许；豁免不恢复被压制项，也不修改登记。基础身份、生命周期、资源与结构前提不属于可豁免限制。业务检查点及必要后继由各领域决定，Hook 的响应与重入不是限制求值。单次资源豁免见 [Resource](resource.md)。

### Offense

Offense 保存 attack Attribute，默认下限为0；选择有效来源后按当前范围求值，不取整。查询不附加生命／空间资格，调用者先取得所需能力。

攻击力的采样归输出业务：普通攻击可逐输出读取；弩箭保存发射样本并按来源是否存在选择实时／缓存；泥岩 S2 在自疗和目标循环前采样一次。Offense 不统一这些时点，不在贡献变化后自动维护 Blocking。

## Layer 与 Hitbox

Unit.position 是身体坐标，Layer 是 GROUND／AIR，Route Plan.motionMode 是 WALK／FLY；它们互相独立。Layer.setType 主动脱离当前阻挡，同值也清理：先发布身份，Settlement 按能力调用 Blocker.releaseAll 或 Blockable.release，后者取消自身计划。它不改路径、自身阻挡层或自动搜索；依据见[运动模式调查](../research/cases/15-locomotion-native-semantics.md)。

Hitbox Definition 保存单个静态 Shape，State 为空，不复制几何或提供运行时改形接口。它与阻挡半径、Locomotion 半身宽分别用于受击、接敌和避障，不能替代。[Spatial](spatial.md)提供战场几何查询。

四向摆放方向归 [Occupancy](occupancy.md)，可为空；几何 Direction 不反向依赖 Unit。左右面向另见下节。

## Facing

Facing 保存 LEFT／RIGHT 有效面向，与摆放朝向、自主移动独立；既可静止转向，也可移动不转向。声明时必须提供 initial.facing。符号由方向派生，不另存；向量 X 为正／负映射右／左，X 为零保留原值，不由动画或摄像机决定。

turn 是完整操作，要求当前 PRESENT；NORMAL 检查本次方向限制，FORCED 仅绕过这些限制。方向相同、拒绝或宿主缺失不变，成功仅改自身面向。限制登记复用普通 Change。

### 触发与跨领域交互

- 自主移动获准且有效速度为正时，具有 Facing、距导航 nextPoint 超过 0.25 才采样方向；先发布位移／速度，再 turn。转向拒绝不撤销移动，不用避障后的位移反推面向。
- 攻击／治疗由内容的首次开始程序决定是否转向。普通近远程程序在绑定目标距离超过 0.2 时尝试，泥岩 S2 不请求转向；后续 Tick 和命中不重复开始业务。
- 眩晕分别限制转向、移动和其他能力；强制转向不恢复其他能力或绕过生命周期。
- 正背面业务读取当前 Facing，动画只消费结果。

### 初始化

Schedule 提供 RIGHT 初值，地面敌人 enter 在 Route 首指令后按当前导航尝试强制转向。Deployment 的 LEFT 摆放选左，其他或未指定选右；直接创建／预置明确提供初值。上述默认与同步政策属于项目选择，依据见[面向调查](../research/cases/35-facing-and-turning-conditions.md)。

### 必要回归语义

[Verification](verification.md)集中覆盖必需初值、正常／强制资格、移动与转向独立、开始只执行一次及多来源限制撤销。其他受力、待机和特殊转向未因此自动完成。

## Presence

[Presence](presence.md)保存空间存在，组合所属能力的限制并在发布后完整释放阻挡、取消现有 Action；不统一结束 Skill、Effect 或 Burst。普通空间查询直接读存在性，其他能力消费自己的限制。

## Blocking

[Blocking](blocking.md)拥有两端共享 Relation、搜索／保持资格、容量裁撤与位置计划。Blocker 表达可阻挡目标层，不从自身 Layer 推导；默认 GROUND 半径 0.7071、AIR 半径 0.8944，Definition 显式 radius 在切层后仍覆盖默认。

capacity 与 volume 独立于重量；capacity 的 ADD／ZERO 和 volume 下限一属于项目协议。Restriction、容量／volume、切层分别有自己的 Settlement，不因任意字段更新自动全场维护。详细时序和未闭合特殊增容不在本页重复。

## 事件与结果

返回结果、同步 Hook 与 UI 瞬时 Event 分工见 [Event](event.md)。创建、开始程序完成和最终结束不是同一事实；具体 Action／Skill／Resource 的顺序由领域文档规定，通用 Unit 不反推内容业务。

## 文件职责

能力目录保留模型、初始化、守卫与所属 Change，独立实例领域保留其创建、私有状态和完整操作。文件按真实职责与规模划分，不以是否纯函数、参数大小或名称统一强拆。源码提供具体声明，文档记录所有权、边界和必要语义。
