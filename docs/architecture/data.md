# 静态数据转换

Data 按战斗需要的静态输入组织为 Unit、Skill、Action、Effect、Level 五部分。原表、Prefab 和动画是资料来源；同一来源可以为多个业务提供配置，由对应业务解释字段。

Data 接收原始资料和本次静态配置，完成解析、校验、选择、覆写与单位换算。输出按实际对象组织，可以直接使用 Core 的 Plan、几何、Definition、初始地图及已有工厂，不另建统一中间协议。具体机制程序由 Core 的通用实现或 Content 的专属实现提供，Core 根据 Definition、Initial 创建并推进运行状态，见[项目分层](ARCHITECTURE.md#项目分层)。

原始 JSON／Prefab 可以缺失字段，由解析器按资料语义转换；已解析配置用 null 表达无值、空集合表达无条目，而非省略字段。地图配置明确提供 mire、deepsea（无控制器时为 null）和 tileDeploymentPrefabs（无条目时为空数组）；黑板读取者明确提供是否允许空 key 或缺失 valueStr 的策略。TileDeploymentPrefab 明确提供 forceBoxCollider，缺失原始字段时解析为 false。

## 业务输入

| 目录 | 静态输入职责 |
| --- | --- |
| `unit/` | 干员、敌人、召唤物和装置的身份、分类、战斗标签、基础属性与养成数据；特性、天赋和模组的候选、解锁、黑板与关联资源；空间、免疫、部署、运动参数；模式、技能和关联单位的绑定及继承参数。 |
| `skill/` | 干员的技能等级参数，包括发动方式、SP、持续时间、黑板、范围和资源绑定；敌人各招式的优先级、费用、初始／后续冷却、黑板和资源绑定，以及实例或模式覆写。 |
| `action/` | 输出类别、数值、多段和发射参数；目标类别、数量、排序和特殊豁免配置；弹道运动、寿命、命中与关联输出；动画释放事件、动作长度、固定延迟和多段事件时间。 |
| `effect/` | 效果身份、实现关联和参数；时长、周期、延迟；重复施加、叠层、续期、竞争和来源配置；属性修正、异常适用与免疫／抵抗参数；具体模板和生命周期关联配置。原生元素类型映射也在这里。 |
| `level/` | 地图、地块、路线、Wave／Fragment／Branch、出怪和等待政策；预置单位、装置、机制和卡牌；初始资源、部署限制、环境、全局规则、关卡覆写及统计资格输入。 |

五类职责规定所需资料的转换归属，不要求每个对象具有相同字段，也不要求每类建立一份通用 Profile。只有已实现的转换才建立具体文件；`action/timing.ts` 转换已提取的作者帧参数，不解释完整原生行为程序。

Unit 的模式描述采用哪些 Skill、Action 和关联单位，具体参数由对应转换解释，Level 提供本次实例覆写。同一份配置可以被多个内容程序引用，不复制为多份权威数据。

敌人技能转换应分别保留各招式的费用、冷却和优先级，以及单位共享的 SP 配置。Content 可以用一份 Skill 协调多个 Action，不从原始技能数组推导 Core 必须有多个 Skill 实例。依据见[敌人技能与行动](../research/cases/08-action-eligibility-and-interruption.md#8-enemyskill-的触发动作与共享-sp2026-11-10)。

选择和弹道配置放在 `action/`，不要求使用者具有 Action；Effect、Skill 或其他内容也可独立使用这些转换。何时索敌、重新选择、采样和输出，以及取消后结算哪些业务，属于实际运行机制。

Effect 的重复施加、启用竞争、接收免疫／抵抗和生命周期关联各自描述不同机制。各具体效果使用精确配置，已有 Core 配置类型直接复用，不合成所有字段可选的通用 EffectConfig。Data 绑定已有实现；安装、启停、伤判、续期及来源采样程序由所属运行领域执行。

## 共享读取与换算

| 文件 | 职责 |
| --- | --- |
| `blackboard.ts` | 读取数值／字符串参数；静态覆写顺序由使用这些资料的业务决定。 |
| `range.ts` | 将范围表转换为可直接使用的几何描述。 |
| `prefab.ts` | 读取提取结果中的组件、对象引用和资源关联；单位、关卡等字段在各自目录解释。 |
| `core/tick.ts` | Data 与 Content 共用的时间和速率换算。 |

单位的移动参数归 `unit/`，即使来源是 Prefab；攻击释放点归 `action/`，即使来源是动画。只转换模拟需要的时间和关联，纯画面与音效资料不要求进入战斗输入。

`parseAttackTiming` 接收明确的作者帧率、起手／主段长度、释放帧、原始播放速率及缩放边界，换算为连续 Tick；负下限规范为零、负上限为无限制。转换不预先取整、不读取运行时攻速。Content 将结果与单位属性组合，在实际攻击开始和等待进入时采样，见 [Action](action.md#8-普通攻击释放-hook-与移动)。

当前输入来自已提取的默认模型参数及其 Prefab／动画映射证据，不提供全量 Prefab／Spine 解码器，也不把标称事件时间称为官方实测释放帧。皮肤、特殊 Ability 和热更新未由这项转换自动覆盖。

## 干员静态资料

完整原表来自 `assets/arknights-game-data` 子模块固定的数据版本。使用完整表时先运行 `git submodule update --init --depth 1 assets/arknights-game-data`，再用 `data/unit/operator-tables.ts` 的 `load()` 读取 `zh_CN/gamedata/excel` 并把结果交给干员的 `create(configuration, tables)`。同一份加载结果可用于多个干员。测试使用 `fromTables()` 接入原表摘录。[原表加载](../../src/data/unit/operator-tables.ts) · [原表关联](../research/cases/06-talent-lifecycle-and-model.md#干员跨表绑定2026-11-21)

`unit/operator.ts` 定义原表的 `Tables`。加载只校验表根对象，保留完整记录，包括 `uniequip_table.json` 的装备索引和其他字段。具体干员通过 `resolve(configuration, tables)` 选择记录和字段。Content 可以复用常规养成、范围和技能读取，也可以直接读专属机制需要的字段。信赖从同一数据版本的 `favor_table.json` 选择，普攻时序取自默认模型的动画证据。[原表类型](../../src/data/unit/operator.ts) · [攻击时序](../research/cases/07-action-timing-and-animation.md)

常规养成按配置读取所选精英阶段、已获得的潜能、信赖、所选技能等级及模组阶段。等级属性和信赖增量分别按各自关键帧插值。MaxHP、ATK、DEF、嘲讽、阻挡数、费用和再部署时间取偶舍入，法抗、攻速与基础攻击间隔保留小数。先分别取整，再相加，然后应用潜能与选中模组阶段的加值。[干员配置数据补核](../research/cases/06-talent-lifecycle-and-model.md#干员配置数据补核2026-11-10)

## 敌人静态资料

`resolveEnemy(record, configuration)` 接收按关卡 ID 找到的敌人数据库条目。标有 `m_defined` 的字段和属性按等级 0、指定等级、关卡覆写的顺序合并。`ResolvedEnemy.layers` 保留完整原始层，包括 `skills`、`talentBlackboard` 和 `spData`，由需要这些数据的内容读取。`readEnemyParameters()` 转换普通战斗属性。[敌人数据](../../src/data/unit/enemy.ts)

`readEnemyMovementPrefab()` 用最终的 `prefabKey` 选择已提取的组件记录，提供转向、避让宽度、路点策略和出生延迟。关卡接入处把运动参数交给敌人工厂，把出生延迟和本次计数资格交给出生配置。[Prefab 读取](../../src/data/unit/prefab.ts) · [路点策略依据](../research/cases/13-route-and-movement-timing.md)

## 路线静态资料

原始路线的 motionMode 解析为 Data Route.mode，出怪编译将 mode 交给 Schedule.Spawn.mode，实际出生时用作 Locomotion Initial 的 mode，不进入 Route Plan。普通原始路线转换为 `Plan.destination` 的 EXIT 分支，保留原终点位置与是否必须完成全部路点的配置（requireFinish）。不根据通用关卡 END Marker 推导退出资格；具体 Content／Meta 按本次单位和玩法的实际路线语义选择 MOVE 或 EXIT，MOVE 保留终点而不自然退出。无固定目标以 null 表达，详见 [Route](navigation.md#类型与身份)。

`compileSpawnSchedule` 独立转换 Wait 与 `Spawn.statistics`：Action／Enemy 的 notCountInTotal 任一成立则不计数，普通 Branch 默认不计数；主波其余按普通或 alwaysCountAsKilled 资格登记。非管理、只阻终局等 Wait 政策不影响统计资格。主波经选择和数量展开后汇总 `statistics.total`，由关卡装配传入 Battle 初始化。无害对关卡生命损失的影响归独立生命值领域，不混入击杀 Policy。[Statistics](statistics.md)

## 静态配置与数值

`m_defined`、潜能的零基 rank、原表天赋候选和模组数据槽等原始表示不进入 Core。标签、免疫和关联资源应有明确的转换结果。原始敌人资料的 `applyWay` 随记录保留，查询以实际登记的 [Action](action.md#攻击方式) 为准。

Content 明确 [Classification](capability.md#classification) 的单位类别、职业／子职业，Data 提供组织与战斗筛选标签。角色的 mainPower／subPower 合并为 `groupTags`，以首次出现顺序去重；敌人的 enemyTags／levelType 规范为 filterTags／rank。标签必须是非空字符串，转换保留大小写。

预置 Unit 装置从实际 Prefab 读取阵营与筛选标签，从角色资料读取组织标签及基础嘲讽。装置身份为 DEVICE，Content 工厂指定初始受选类别。`parsePredefinedCreation()` 将装置和地形控制器转换为 UNIT 或 EFFECT 创建输入，前者为普通 Unit，后者为无宿主 Effect，附带明确的无来源、无额外依赖、无限期且启用的 Initial。原表的 `alias` 和 `hidden` 留在关卡配置里，由关卡接入处选择开场创建项（`initialUnits` 或 `initialEffects`）和后续触发逻辑。TileDeployment 描述地图地块的部署条件。资料中的 TOKEN／TRAP 不进入八职业，subProfession 不按原始字符串直接透传；Rune／模组提供的额外职业与组织标签预处理尚未接入。[原生预置转换](../../src/data/level/predefined.ts)

组装 Core 属性 Definition 时，Content 或已有工厂显式提供 [Attribute](attribute.md) 的 default/min/max。hpRecoveryPerSec 保持 HP／秒，绑定到 Vitality.recoverySpeed.default。自然 SP 速率保持 SP／秒。基础攻击间隔乘 Tick 率后保留连续值。

模式配置和继承参数是静态输入；当前模式、当前来源属性和实际继承值由运行状态与内容程序确定。Meta 提供本次选定的阵容和玩法配置，商店、抽取与局外经营不由 Data 执行。未支持的配置在内容入口明确拒绝，不能因当前机制未接入而静默丢弃必要输入。

## 当前支持边界

现有转换覆盖代表性干员的养成数据与已接入技能、敌人等级及部分运动配置、已提取的攻击时序、范围与黑板、元素枚举，以及关卡地图、路线、调度、预置和地形。敌人招式配置与共享 SP 目前保留原始记录，具体转换随内容接入。

`effect/stacking.ts` 与 `effect/modifier.ts` 提供重应用和属性修正的静态描述。Core Effect 提供分组、重应用与层数操作；具体配置到 Definition 的绑定由 Content 实现，属性修正描述的通用运行采样仍未接入。装置部署资格由 Content 的共享装置程序实现，Data 只绑定解析后的条件。更多动作模板、完整选择与弹道配置，以及异常适用和生命周期选项仍需随实际内容接入，详见[内容支持与缺口](tactical-semantics.md)。

静态转换以真实输入和规范化结果验收，机制程序归对应领域；集中归属见[语义验收](verification.md)。
