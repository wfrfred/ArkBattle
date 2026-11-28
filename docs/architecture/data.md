# 静态数据转换

战斗需要的静态资料涉及 Unit、Skill、Action、Effect、Level 五类业务输入。原表、Prefab 和动画是资料来源；同一来源可以为多个业务提供配置，由对应业务解释字段。

Data 提供原始资料的通用解析、校验、选择、覆写与单位换算，并转换关卡输入。具体单位由所属 Content 的 `resolve` 解释本次静态配置，再以 `create(parameters)` 组装 Definition。输出按实际对象组织，可以直接使用 Core 的 Plan、几何、Definition、初始地图及已有工厂，不另建统一中间协议。具体机制程序由 Core 的通用实现或 Content 的专属实现提供，Core 根据 Definition、Initial 创建并推进运行状态，见[项目分层](ARCHITECTURE.md#项目分层)。

原始 JSON／Prefab 可以缺失字段，由解析器按资料语义转换；已解析配置用 null 表达无值、空集合表达无条目，而非省略字段。地图配置明确提供 mire、deepsea（无控制器时为 null）和 tileDeploymentPrefabs（无条目时为空数组）；黑板读取者明确提供是否允许空 key 或缺失 valueStr 的策略。TileDeploymentPrefab 明确提供 forceBoxCollider，缺失原始字段时解析为 false。

## 业务输入

| 主题 | 静态输入职责 |
| --- | --- |
| Unit | 干员、敌人、召唤物和装置的身份、分类、战斗标签、基础属性与养成数据；特性、天赋和模组的候选、解锁、黑板与关联资源；空间、免疫、部署、运动参数；模式、技能和关联单位的绑定及继承参数。 |
| Skill | 干员的技能等级参数，包括发动方式、SP、持续时间、黑板、范围和资源绑定；敌人各招式的优先级、费用、初始／后续冷却、黑板和资源绑定，以及实例或模式覆写。 |
| Action | 输出类别、数值、多段和发射参数；目标类别、数量、排序和特殊豁免配置；弹道运动、寿命、命中与关联输出；动画释放事件、动作长度、固定延迟和多段事件时间。 |
| Effect | 效果身份、实现关联和参数；时长、周期、延迟；重复施加、叠层、续期、竞争和来源配置；属性修正、异常适用与免疫／抵抗参数；具体模板和生命周期关联配置。原生元素类型映射也在这里。 |
| Level | 地图、地块、路线、Wave／Fragment／Branch、出怪和等待政策；预置单位、装置、机制和卡牌；初始资源、部署限制、环境、全局规则、关卡覆写及统计资格输入。 |

五类职责描述静态输入主题，不要求每个对象具有相同字段，也不要求每类建立一份通用 Profile。具体单位已在自身 Content 中解析所需数据，不为其另建通用单位 Profile。只有已实现的转换才建立具体文件。

Unit 的模式描述采用哪些 Skill、Action 和关联单位，具体参数由对应转换解释，Level 提供本次实例覆写。同一份配置可以被多个内容程序引用，不复制为多份权威数据。

敌人技能转换应分别保留各招式的费用、冷却和优先级，以及单位共享的 SP 配置。Content 可以用一份 Skill 协调多个 Action，不从原始技能数组推导 Core 必须有多个 Skill 实例。依据见[敌人技能与行动](../research/cases/08-action-eligibility-and-interruption.md#8-enemyskill-的触发动作与共享-sp2026-11-10)。

共用的选择和弹道静态转换可由 Action、Effect、Skill 或其他内容独立使用；当前具体敌人的固定弹道与选敌配置由其 Content 声明。何时索敌、重新选择、采样和输出，以及取消后结算哪些业务，属于实际运行机制。

Effect 的重复施加、启用竞争、接收免疫／抵抗和生命周期关联各自描述不同机制。各具体效果使用精确配置，已有 Core 配置类型直接复用，不合成所有字段可选的通用 EffectConfig。Data 绑定已有实现；安装、启停、伤判、续期及来源采样程序由所属运行领域执行。

## 共享读取与换算

| 文件 | 职责 |
| --- | --- |
| `json.ts` | 共享原始 JSON 结构读取与校验。 |
| `tables.ts` | 保留完整原表，按表根对象校验。 |
| `load.ts` | 独立文件读取入口；纯转换不依赖文件系统。 |
| `enemy-database.ts` | 原始条目索引、等级层选择与定义字段合并，不解释战斗属性。 |
| `level.ts` | 保留原始关卡对象，按需读取格坐标与原始地图索引矩阵。 |
| `blackboard.ts` | 读取数值／字符串参数；静态覆写顺序由使用这些资料的业务决定。 |
| `range.ts` | 将范围表转换为可直接使用的几何描述。 |
| `prefab.ts` | 读取提取结果中的组件、对象引用和资源关联；单位、关卡等字段在各自目录解释。 |
| `core/tick.ts` | Data 与 Content 共用的时间和速率换算。 |

当前具体干员和敌人的已确认固定时序，猎狗与弩手的固定运动配置，以及整理箱与射击台的固定改格规则，均由对应 Content 声明；Prefab 与动画证据不再作为每次构造的输入。只转换模拟需要的时间和关联，纯画面与音效资料不要求进入战斗输入。

Content 的 `actions/timing.ts` 中 `parseAttackTiming` 接收明确的作者帧率、起手／主段长度、释放帧、原始播放速率及缩放边界，换算为连续 Tick；负下限规范为零、负上限为无限制。转换不预先取整、不读取运行时攻速。当前具体 Action 直接使用依据该换算得到的固定时序；共享攻击程序将该时序与运行时单位属性组合，在实际攻击开始和等待进入时采样，见 [Action](action.md#8-普通攻击释放-hook-与移动)。

固定时序的依据是已提取的默认模型参数及其 Prefab／动画映射证据，不提供全量 Prefab／Spine 解码器，也不把标称事件时间称为官方实测释放帧。皮肤、特殊 Ability 和热更新未由这项转换自动覆盖。

## 干员静态资料

完整原表来自 `assets/arknights-game-data` 子模块固定的数据版本。使用完整表时先运行 `git submodule update --init --depth 1 assets/arknights-game-data`，再用 `data/load.ts` 的 `loadTables()` 读取 `zh_CN/gamedata/excel` 并把结果交给干员的 `resolve(configuration, tables)`。解析结果可分别交给 `create(parameters)` 和 `createCard(parameters)`，后者复用已解析的部署费用和再部署时间。同一份加载结果可用于多个干员。测试使用 `fromTables()` 接入原表摘录。[原表加载](../../src/data/load.ts) · [原表关联](../research/cases/06-talent-lifecycle-and-model.md#干员跨表绑定2026-11-21)

`tables.ts` 定义原表的 `Tables`。加载只校验表根对象，保留完整记录，包括 `uniequip_table.json` 的装备索引和其他字段。具体干员通过 `resolve(configuration, tables)` 选择记录和字段。Content 可以复用常规养成、范围和技能读取，也可以直接读专属机制需要的字段。信赖从同一数据版本的 `favor_table.json` 选择，普攻固定时序由各自的 Action 定义，取自默认模型的动画证据。[原表类型](../../src/data/tables.ts) · [攻击时序](../research/cases/07-action-timing-and-animation.md)

常规养成按配置读取所选精英阶段、已获得的潜能、信赖、所选技能等级及模组阶段。等级属性和信赖增量分别按各自关键帧插值。MaxHP、ATK、DEF、嘲讽、阻挡数、费用和再部署时间取偶舍入，法抗、攻速与基础攻击间隔保留小数。先分别取整，再相加，然后应用潜能与选中模组阶段的加值。[干员配置数据补核](../research/cases/06-talent-lifecycle-and-model.md#干员配置数据补核2026-11-10)

## 敌人静态资料

猎狗和弩手各自的 `resolve(raw, configuration)` 接收按关卡 ID 找到的敌人数据库条目。`data/enemy-database.ts` 提供 `selectEnemyLayers` 与 `mergeDefinedFields`：标有 `m_defined` 的字段和属性按等级 0、指定等级、关卡覆写的顺序合并；选择结果的 `layers` 保留完整原始层，包括 `skills`、`talentBlackboard` 和 `spData`，由需要这些数据的内容读取。内容解析器复用普通战斗属性和出生事实的读取，分别提供其 `create(parameters)` 所需参数和出生配置所需的 `notCountInTotal`、`lifePointLoss`、`delayToBornTicks`。[原始敌人资料](../../src/data/enemy-database.ts) · [猎狗参数](../../src/content/enemies/hound/parameters.ts) · [弩手参数](../../src/content/enemies/crossbowman/parameters.ts)

猎狗和弩手校验最终 `prefabKey` 为各自已实现的普通模型且运动方式为 WALK；不把任意替换 Prefab 自动视作已支持内容。两者的 Prefab 原始转向系数 8、最大转向力 10（分别除以 Tick 率及其平方）、避让半宽 0.20000000298023224、alwaysCheckCurrentPoint=false、出生延迟 0 直接取已确认的固定配置。命中圆半径 0.2 仍是项目模型近似，不是由避让半宽推导出的原生命中体。弩手弹箭速度为 10 格／秒，到达后停止延迟为 0，依据实际 `projectile_crossbow` 运动组件和停止配置；不再由场景传入自定义弹速。[猎狗 Prefab 摘录](../../test/fixtures/arknights/prefab_enemy_1000_gopro.json) · [弩手 Prefab 摘录](../../test/fixtures/arknights/prefab_enemy_1003_ncbow.json) · [路点策略依据](../research/cases/13-route-and-movement-timing.md) · [弩箭配置证据](../research/evidence/projectile-boundaries-20261021/examples/REPORT.md#1-actual-ordinary-crossbowman---locked-projectile) · [停止延迟证据](../research/evidence/projectile-stop-20261021/delay/REPORT.md#crossbow-control)

## 路线静态资料

原始资料中的 `{ row, col }` 在 Data 转换边界映射为 Core 格坐标 `[col, row]`（即 `[x, y]`）。原始地图矩阵的行列组织、行序转换和连续世界偏移的 x/y 含义不变。

原始路线的 motionMode 解析为 Data Route.mode，出怪编译将 mode 交给 Schedule.Spawn.mode，实际出生时用作 Locomotion Initial 的 mode，不进入 Route Plan。普通原始路线转换为 `Plan.destination` 的 EXIT 分支，保留原终点位置与是否必须完成全部路点的配置（requireFinish）。不根据通用关卡 END Marker 推导退出资格；具体 Content／Meta 按本次单位和玩法的实际路线语义选择 MOVE 或 EXIT，MOVE 保留终点而不自然退出。无固定目标以 null 表达，详见 [Route](navigation.md#类型与身份)。

`compileSpawnSchedule` 独立转换 Wait 与 `Spawn.statistics`：Action／Enemy 的 notCountInTotal 任一成立则不计数，普通 Branch 默认不计数；主波其余按普通或 alwaysCountAsKilled 资格登记。非管理、只阻终局等 Wait 政策不影响统计资格。主波经过选择和数量展开后已具备完整 Spawn 资格；Battle 初始化从该计划推导 `statistics.total`，Data 不另行返回重复总数。 [Statistics](statistics.md)

敌人解析结果的 `lifePointLoss` 取等级继承与关卡覆写后的 `lifePointReduce`；没有任何定义值时使用原生计算默认值 1。出怪编译对 `isUnharmfulAndAlwaysCountAsKilled` 的 Action 将本次扣血量设为零，其余保留敌人解析值，不由 Wait、Branch 或统计资格推断。关卡装配用 `options.maxLifePoint` 提供 `Battle.Input.lifePoints.balance`，普通关卡的 `temporary` 初值为零；玩法层可传入其本场实际初值。[Life Points](life-points.md)

## 静态配置与数值

`m_defined`、潜能的零基 rank、原表天赋候选和模组数据槽等原始表示不进入 Core。标签、免疫和关联资源应有明确的转换结果。原始敌人资料的 `applyWay` 随记录保留，查询以实际登记的 [Action](action.md#攻击方式) 为准。

Content 明确 [Classification](capability.md#classification) 的单位类别、职业／子职业及固定标签，并从资料读取可配置的组织与战斗筛选标签。角色的 mainPower／subPower 合并为 `groupTags`，以首次出现顺序去重；敌人的 enemyTags／levelType 规范为 filterTags／rank。标签必须是非空字符串，转换保留大小写。

预置整理箱和射击台分别通过具体的 `resolve(configuration, characterValue)` 读取角色资料中的生命、回血、组织标签及基础嘲讽，并校验具体角色和 Prefab 身份。两者身份为 DEVICE、阵营为 ALLY；整理箱无筛选标签且受选类别为 OBSTACLE，射击台具 SANDBOX_FACTORY 标签且受选类别为 DEVICE。固定分类与改格规则由各自的 Content 工厂直接声明；原来用于关卡预置选择的 Prefab profile 不再向具体工厂提供这些配置。`parsePredefinedCreation()` 将装置和地形控制器转换为 UNIT 或 EFFECT 创建输入，前者为普通 Unit，后者为无宿主 Effect，附带明确的无来源、无额外依赖、无限期且启用的 Initial。原表的 `alias` 和 `hidden` 留在关卡配置里，由关卡接入处选择开场创建项（`initialUnits` 或 `initialEffects`）和后续触发逻辑。TileDeployment 描述地图地块的部署条件。资料中的 TOKEN／TRAP 不进入八职业，subProfession 不按原始字符串直接透传；Rune／模组提供的额外职业与组织标签预处理尚未接入。[原生预置转换](../../src/data/level/predefined.ts)

组装 Core 属性 Definition 时，Content 或已有工厂显式提供 [Attribute](attribute.md) 的 default/min/max。hpRecoveryPerSec 保持 HP／秒，绑定到 Vitality.recoverySpeed.default。自然 SP 速率保持 SP／秒。基础攻击间隔乘 Tick 率后保留连续值。

模式配置和继承参数是静态输入；当前模式、当前来源属性和实际继承值由运行状态与内容程序确定。Meta 提供本次选定的阵容和玩法配置，商店、抽取与局外经营不由 Data 执行。未支持的配置在内容入口明确拒绝，不能因当前机制未接入而静默丢弃必要输入。

## 当前支持边界

现有转换覆盖代表性干员的养成数据与已接入技能、敌人等级及关卡覆写、范围与黑板、元素枚举，以及关卡地图、路线、调度、预置和地形。当前已确认的固定运动、攻击时序和装置改格由具体 Content 使用现有证据声明。敌人招式配置与共享 SP 目前保留原始记录，具体转换随内容接入。

`effect/stacking.ts` 与 `effect/modifier.ts` 提供重应用和属性修正的静态描述。Core Effect 提供分组、重应用与层数操作；具体配置到 Definition 的绑定由 Content 实现，属性修正描述的通用运行采样仍未接入。装置部署资格由 Content 的共享装置程序实现，Data 只绑定解析后的条件。更多动作模板、完整选择与弹道配置，以及异常适用和生命周期选项仍需随实际内容接入，详见[内容支持与缺口](tactical-semantics.md)。

静态转换以真实输入和规范化结果验收，机制程序归对应领域；集中归属见[语义验收](verification.md)。
