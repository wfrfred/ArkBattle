# 单位分类与战斗标签

研究日期：2026-11-14，2026-11-18 补核召唤物、装置与资料组合、豆苗磐蟹的实体类别切换，以及攻击方式的形态汇总和实际模组绑定。问题是原生单位有哪些可被战斗程序查询的分类事实、它们从哪里建立、哪些会变化，以及实际内容读取哪一项。调查涵盖通用战斗、干员／敌人／召唤物／装置和代表内容；不涉及生息演算、保全派驻、船运寻路。原件、输入指纹和复跑入口见[分类批次](../evidence/unit-classification-20261114/README.md)、[组合批次](../evidence/unit-classification-composition-20261118/README.md)、[类别切换批次](../evidence/entity-category-20261118/README.md)与[攻击方式补证](../evidence/attack-way-20261118/README.md)。

本案整理原生需求，不确定 ArkBattle 的新字段、Capability 或标签 API。静态客户端正文、资源绑定、社区说明分别记录；没有执行实机，也没有取得活跃 XLua 的运行结果。

## 1. 原生存在多条独立分类轴

| 事实 | 原生来源与消费者 | 不能替代什么 |
| --- | --- | --- |
| 实现类身份 | `Enemy → Unit`；`Trap → Token → Character → Unit`；实际类测试参与单位类型筛选和特化查询 | 阵营、职业和“玩家称为装置”都不能反推出具体实现类 |
| 实体类别 | `EntityCategory`：DEFAULT、TRAP_OR_ITEM、OBSTACLE 等；TargetOptions 独立筛选 | 不等于 UnitType 或职业 |
| 单位类型掩码 | `CheckEntityUnitType` 按 CHARACTER／ENEMY／TOKEN 位作类测试；Token／Trap 也可能通过 CHARACTER 位 | 不是三个互斥身份，也不是阵营 |
| 阵营与玩家侧 | `BObject.side`、`playerSide` 分别存储，TargetOptions 有相应资格分支 | ALLY 不等于 Character；PlayerSide 不应直接当成 ALLY／ENEMY |
| 职业与附加职业 | Character 数据保存基础 profession；共享数据另存 extraProfession；Selector 可选择是否检查附加职业 | 分支、单位实现类和阵营不能代替职业资格 |
| 分支与部署位置 | 角色表分别提供 `subProfessionId` 与 `position`；实际静态记录存在 TOKEN 职业、executor 分支的镜中虚影 | 部署位置的 MELEE／RANGED 不能当作 Enemy.applyWay，分支不能反推职业 |
| 运动身份 | EnemyData 的 motion、实例空地身份及其切换由移动／Layer 消费，见 Case 15、21 | FLY 不等于 RANGED，也不等于 drone 标签 |
| 敌人标签／FilterTag | Enemy 的 FilterTag 查询读 `Enemy.data.enemyTags`；Character 默认实现与 Trap 实现另有行为 | 不是全部 Unit 共用的档案种族字段 |
| 角色阵营／组织标签 | Character 的 GroupTag 查询读取角色数据与额外组标签；与 FilterTag 使用不同入口 | 不是战斗 Side，也不与 enemyTags 通用 |
| 敌人普通／精英／领袖级别 | `Enemy.data.levelType`；等级节点、等级掩码和 `isBoss` 消费 | 不等于种族、敌人等级索引或是否计入击杀统计 |
| 目标攻击方式 | Enemy 的 `allApplyWay` 读当前 EnemyData；普通 Unit 读当前 Mode 的汇总值；另有节点指定读取 EnemyDB level 0 | 不等于当前这笔攻击的近战／远程分类 |
| 本次 Ability 攻击方式 | Ability 的 `applyWay` 虚属性及过滤节点 | 不等于目标单位标签、物理／法术／治疗公式类型 |
| 展示资料 | 干员 `tagList`、档案种族文本和敌人图鉴分类需要各自的战斗消费者证据；本批未提取完整 enemy_handbook_table | 字段或界面标签存在，不能证明战斗程序以同一方式查询 |

类型、掩码和职业的完整字段／常量见[身份证据](../evidence/unit-classification-20261114/identity/README.md)；EnemyData 布局和攻击方式读取见[消费者证据](../evidence/unit-classification-20261114/inventory/README.md)。本表说明已证实的差别，不要求项目复制原生类层次或全部枚举。

## 2. 实际内容能区分这些事实

### 2.1 我方 Enemy 与 Token 类型掩码

[Case 32](32-leithanien-summons-blocking-and-movement.md)已将莱塔尼亚盟约的两个召唤物绑定到 `enemy_9025_aclts`／`enemy_9026_acltm`。它们使用 Enemy 实现，Prefab 配置为 ALLY 阵营。因此用 ALLY 判断“Character 类单位”，或者用 Enemy 实现判断敌对，都会改变这类内容的筛选结果。

`CheckEntityUnitType` 的三个掩码位分别执行 Character／Enemy／Token 类测试。由于继承关系，Token 及 Trap 可同时满足 CHARACTER 位和 TOKEN 位。`UnitType` 的 TOKEN 枚举值为 3，`UnitTypeMask.TOKEN` 为 4，也不能直接相互强转。

实际 `skchr_tocka_3` 的三个 Selector 同时要求 ALLY、CHARACTER 类型掩码和 `professionMask=639`（八职业）。原生职业检查对 ALLY 非 Character 在非零职业掩码下已拒绝，TOKEN／TRAP 职业又不在639内。因此，在这个具体组合中 Character 检查不能证明项目需要额外保存一份 Character 身份。两个原生谓词并不普遍等价，但配置同时出现不等于架构必须保存两套独立事实。精确配置和分支见[身份调查](../evidence/unit-classification-20261114/identity/README.md)。

固定资料中的镜中虚影是 TOKEN 职业、executor 分支；妖怪同时是 `drone` 标签、FLY 运动方式、NONE 攻击方式。它们分别提供了职业／分支、标签／移动／攻击方式不能互相推导的静态正例。

### 2.2 泥岩：来源敌人的萨卡兹标签

当前泥岩 `Talents/2` 的 PassiveBuffAbility 指向 `mudrok_t_2`，采用 `filtertag[reduce_damage]` 模板，`tag='sarkaz'`。模板在伤害接收事件中对 `MODIFIER_SOURCE` 执行 `CheckFilterTag`，通过时修改伤害倍率。

原生虚派发的 Enemy 分支检查 `enemyTags.Contains(tag)`；Character 的普通实现返回 false；Trap 另读 Prefab `_filterTag[]`。所以本例不是读取攻击者档案中的种族文字，也没有证据支持“所有萨卡兹外观或档案种族的 Unit 都自动满足”。配置和完整消费者见[标签证据](../evidence/unit-classification-20261114/tags/README.md)、[内容绑定](../evidence/unit-classification-20261114/config/README.md)。

### 2.3 守林人：目标的攻击方式

当前守林人 `Talents/1` 指向 `milu_t_1`；对应 AtkScaleUp 配置开启 `_filterApplyWay`，掩码为 RANGED。执行节点查询目标的 `Entity.allApplyWay`，不查询守林人这一笔 Modifier 的 `applyWay`。

本批直接核对三条不同路径：

| 路径 | 读取值 |
| --- | --- |
| 守林人的 AtkScaleUp → Enemy `allApplyWay` | 当前 `Enemy.data.applyWay` |
| 通用 `CheckEnemyApplyWay` 节点 | `EnemyDB.TryGet(id, level=0)` 返回数据的 applyWay |
| `FilterAbilityApplyWay` 节点 | 当前 Ability 的 applyWay |

普通 Unit 的 `allApplyWay` 读取 `m_currentMode.allApplyWay`；该字段位于 Unit `+0x200`，Mode 的汇总值位于 `+0xc0`。它仍不等于某一笔 Modifier 的分类。普通原生 MeleeAttack／RangedAttack 分别返回 MELEE／RANGED，Heal 返回 NONE；治疗不会因有弹道而自动成为此处的 RANGED。

2026-11-18 补核：`UnitMode.OnInit` 将汇总值清零，依次将 `_combat` 与 `_attack` 的 `Ability.applyWay` 按位并入，受各自组件分支控制。贝娜的本体与替身各自绑定 MeleeAttack 和 RangedAttack，实际切换流程保持同一 Unit，读值随形态从 MELEE 变为 RANGED，回到本体恢复 MELEE。磐蟹的作战和战术点形态都绑定 MeleeAttack，战术点用 NeverTrigger 禁止普通攻击，仍汇总为 MELEE。能否发动与该值分别判断。Enemy 的 getter 独立读取 EnemyData，即使弩手当前执行阻挡近战，读取的仍是资料中的 RANGED。

守林人 Y 模组二、三级实际绑定 `milu_e_t_1`，在同一公式事件先判断目标值是否为 NONE，失败后再判断是否包含 RANGED。普通天赋仅匹配 RANGED，ALL 同时包含 MELEE 与 RANGED。所取敌人资料在显式等级记录中实际包含这四种值。模组判断使用目标实体的同一虚槽，适用于进入该公式的非 Enemy 目标；没有用真实关卡实机复核该分支。[攻击方式补证](../evidence/attack-way-20261118/README.md)

无餍的 EnemyData 攻击方式为 ALL，普通 Enemy prefab 的默认形态两个攻击槽均为近战，复活形态两个槽均为远程。应用守林人的普通天赋判定时，默认形态也符合远程这一项条件。这里比较的是单项攻击方式检查，实战是否命中还取决于独立资格。[无餍的资料和组件](../evidence/attack-way-20261118/README.md)

棘刺的周期中毒用 IfTarget 查询中毒者是否含 RANGED，导火索的防弹护盾用同一节点查询物理伤害来源。两项配置都关闭 Enemy 类检查。普通客户端的 IfTarget 在启用攻击方式检查时调用同一虚槽 51。阿 S2／S3 的实际伤害选择器允许友方导火索，相关定值伤害以阿为来源且不跳过受击事件，因此导火索可读取普通 Character 的非零攻击方式，尽管该伤害本身由定值伤害节点施加。该组合由客户端普通分支和实际配置核对，未运行实机。[棘刺、导火索与阿的原件](../evidence/attack-way-20261118/README.md)

这已证明同名“攻击方式”查询具有不同采样对象。尚未找到同一实际敌人在上述两个 Enemy 数据查询间产生不同结果的可执行正例，不将代码差别冒充已观测的玩法差别。

### 2.4 迷迭香模组：追加职业，不替换基础职业

静态 `uniequip_003_rosmon` 的黑板含 `extra_profession='caster'`，并带 `game_tag_meta='roguelike'`。原生 `_ProcessExtraProfession` 将该字符串解析为 ProfessionCategory，按位加入共享 extraProfession，保留基础 profession。

Selector 的 `checkExtraProfession` 决定该次职业检查是否接受附加职业，不能把额外职业直接覆盖进基础职业。本例有配置与原生消费链，不声称该模组在所有模式都启用，也不以 `RuntimeData` 命名推断它可以在战斗中任意增删。

职业筛选也不等于“非 Character 一律通过”。已核 TargetOptions 的非 Character 分支：目标 `side == ALLY` 且职业掩码非零时拒绝，其他非 Character 可通过这一职业分支；其他资格仍分别检查。因此不能把 Enemy 无职业简化成所有阵营下都忽略职业限制。

### 2.5 维娜模组：普通／精英／领袖分别处理

`uniequip_003_siege2` 高等级配置引用 `siege2_equip_2_2_p5`／`siege2_equip_2_3_p5`，对应 PassiveBuffAbility 安装 `siege2_t_2`，使用 `siege2_e_003_t_2` 模板。模板的敌人分支执行 `CheckEnemyLevelType`，分别处理 NORMAL／ELITE／BOSS，应用不同缴械配置。完整资源对象及模板摘录见[配置证据](../evidence/unit-classification-20261114/config/README.md)。

原生 `CheckEnemyLevelType` 和 `CheckEnemyLevelMask` 都读当前 `Enemy.data.levelType`；`EnemyData.isBoss` 是 `levelType == BOSS`，不是另一套独立 Boss 事实。这项分类确有战斗消费者，不能只保留在敌人手册展示中。

### 2.6 组织筛选也有实际模组绑定

信仰搅拌机 X3 的 `rmixer_equip_1_3_p2` 关联 GlobalAuraAbility，validator 为 `FilterGroupTagTargetValidator`，标签是 `laterano`，实际安装 `rmixer_e_002_t1`。完整绑定已在[属性范围调查](39-death-attribution-and-attribute-ranges.md#实际范围覆写)闭合。它证明普通组织归属有实际战斗消费者，与下述额外 GroupTag Rune 的启用缺口不同。

### 2.7 召唤途径、阵营与分类资料的组合

2026-11-18 全表与选定原生路径补核见[组合批次](../evidence/unit-classification-composition-20261118/README.md)。

固定 `character_table` 的1382项具有相同的36个顶层字段；按显式 profession 分为八职业461项、TOKEN75项、TRAP846项。八职业有29项没有组织归属，TOKEN本快照均没有；TRAP则有三项通过 `subPower` 附加 `laterano`：圣徒像扮演者、圣堂射手扮演者、圣堂保育员扮演者。故组织归属既不保证八职业单位非空，也不限定为八职业专有。空组织集合是实际资料，不必等同于缺失字段。

TOKEN资料也不只有统一的分支：镜中虚影是 TOKEN／executor；`trap_079_allydonq` 猎潮的骑士是 TOKEN／pioneer。后者虽使用 trap key，职业仍是TOKEN。精确原文和深海色、傀影、麦哲伦、琳琅诗怀雅的 `tokenKey/overrideTokenKey` 引用保存在[JSON核对](../evidence/unit-classification-composition-20261118/data/README.md)；这些引用证明静态绑定，不单独证明实际启用或阵营。

两份完整 Character／Enemy JSON 对精确字段名 `side`、`sideType`、`sideTypeIndex`、`_sideTypeIndex`、`playerSide` 的递归查询均无命中。阵营须按 Prefab 与创建链读取，不能由表名、职业或召唤动作反推。莱塔尼亚“一个小节／一个乐部”是已有实际正例：SummonEnemyWithRuntimeRoute 创建 Enemy 控制器，Prefab明确为ALLY；召唤不是与Enemy资料互斥的第三种资料。

普通 Character 的初始化阵营 getter 返回 `SideType.ALLY=1`；Token 覆盖该 getter，直接读取 Prefab `_sideType`。已核部署链通过 `BuildParam.sideType → Entity.Init → BObject.Init` 写入当前 side，playerSide另存；Enemy则先将 Prefab的SideTypeIndex转换成SideType。这些路径没有根据职业或“被召唤”自动决定阵营，也不能推出全部特殊创建入口都沿用默认值。完整字段与调用片段见[原生补核](../evidence/unit-classification-composition-20261118/native/README.md)。

筛选标签也不由Enemy独占。`trap_042_tidectrl` 涨潮控制的实际 Trap Prefab 含 `_filterTag=['redman_exclude','storm']`，卫戍 act2autochess m04 有可见预置和技能选择；Trap的查询读取这一数组，同时其职业／组织查询仍走角色资料路径。其 `_sideType=1` 是ALLY；另一实际Trap资源 `trap_317_ubprison` 禁闭所的 `_sideType=2` 则是ENEMY。因此不能以“角色只有组织标签、敌人只有战斗标签”，或以敌我阵营为联合分支前提。该例不声称两条标签的全部实际消费者均已展开。

以上事实约束项目抽象：创建途径、敌我阵营和分类资料必须分别解释；原生继承不自动成为项目类型层次。职业资料与Enemy级别资料在已核路径中分属不同数据来源，可以据此评估资料联合，但本批不将有限样本提升为禁止组合的全局规则，也不确定 Capability 数量、分支名或字段归属。

## 3. 初始化与变化范围

Enemy 的战斗分类来自转换后的 EnemyData，再由 Enemy 初始化保存数据引用；基础记录、等级覆盖和关卡引用覆写必须按各自路径检查，不能默认查手册或固定 level 0 就等价。Character 的基础职业、附加职业及组标签则来自 Character 数据构造与相应预处理。具体赋值、合并及保留证据见[标签调查](../evidence/unit-classification-20261114/tags/README.md)和[身份调查](../evidence/unit-classification-20261114/identity/README.md)。

角色组织资料的转换已闭合：`CharacterData.mainPower` 内联的 nation／group／team 复制到 `BattleCharacterData.nationId/groupId/teamId`，`subPower` 另行复制。GroupTag 查询检查这些主／附加组织，再检查 `extraGroupTags`，不是把旧表 legacy 字段与 mainPower 当成两套同时生效的数据。

额外 GroupTag 的已核写入发生在 Rune 的 Character 预处理。调用者包括预置 Character／Token 的临时 Dummy 创建—预处理—回收，以及卡牌属性资料处理；它们不是已在场 Character 动态增删标签的正例。本批未找到该 Rune 的实际非默认启用配置，保留这一具体缺口。

实体类别可以战中切换。普通 `Token.SwitchCategory` 写入 `m_category`，普通 `Token.get_category` 在覆盖值非零时读它，否则使用 Prefab `_category`。`RallyPoint.get_category` 直接读取 `m_category`。涨潮控制的 Prefab 有非默认 `_category=2`，豆苗磐蟹则提供同一在场实例来回切换的正例。

豆苗磐蟹 `token_10014_bstalk_crab` 在 Crab 模式的监听器 `crab_s_1[listener]` 处理击倒，先执行 `SwitchRallyPointCategory` 写入 `TRAP_OR_ITEM=2`，随后切到 Flower。恢复时 `crab_switch` 安装 `crab_t_1[category_default]`，通过黑板 `category=1` 使同一节点写入 `DEFAULT=1`，然后恢复 HP 并切回 Crab。这两个程序作用于同一个 RallyPoint，恢复链见[磐蟹生命机制](11-damage-apply-and-hp-application.md#rallypoint-不是-unit-完整死亡)。

`TargetOptions.VerifyTarget` 将本次类别掩码传给 `BattleUtil.VerifyTarget`，后者虚调用目标的当前类别 getter，再判断掩码交集。只允许 `DEFAULT` 的查询因此在磐蟹形态通过类别这一关，在战术点形态被这一关排除。阵营、存活和其他受选条件另由相应检查决定。配置、黑板键与原生指令定位见[类别切换批次](../evidence/entity-category-20261118/README.md)。

### 实体类别的实际查询方

普通弩手的远程攻击 Selector 使用 `DEFAULT=1`。齐尔查克的环境免伤光环则将 `DEFAULT | TRAP_OR_ITEM=3` 交给自己的 validator，让范围内合格的友方装置也可获得光环。无餍的 `KillCjbtow` 用 `TRAP_OR_ITEM=2` 查询装置，再筛选 `trap_cjbtow[mark]`，选中一个废弃火灶时执行强制击杀。三条实际配置的定位见[查询方原件索引](../evidence/entity-category-20261118/README.md#实际查询方)。

这三个用法说明类别掩码让每次查询选择所处理的对象集合。齐尔查克允许装置通过类别筛选，无餍还要求特定标记。豆苗战术点在类别这一关符合允许装置的查询，最终是否入选取决于相应查询的其他条件。

### 豆苗两种形态的分类资料与实际消费者

磐蟹的角色表职业为 `TOKEN`，组织字段均空。Crab／Flower 两种模式共用一个 `RallyPoint` 根组件。其继承链为 `RallyPoint → Trap → Token → Character`，所以两种形态的 `CHARACTER` 和 `TOKEN` 类检查均成立。筛选标签的虚槽沿继承调用 `Trap.CheckHasFilterTag`，查询同一个 Prefab 的 `_filterTag`，本例为空。这条查询没有按当前 `EntityCategory` 切换到另一份标签资料。组织标签查询也从 Character 的资料读取。 [分类资料原件](../evidence/entity-category-20261118/README.md#两种形态的分类查询)

豆苗 S1「定点指令」是实际消费者。它通过施术者的召唤归属找到首个 RallyPoint，读取战术点状态，等待形态触发 `crab_switch` 提前恢复，参战形态走回满生命的分支。原生的该状态查询读取当前类别值。两种形态都参与这条归属查询，其结果与普通 `DEFAULT` 索敌分开。 [S1 的配置与客户端正文](../evidence/entity-category-20261118/README.md#两种形态的分类查询)

装置资料本身也横跨三种实际类别。禁闭所为 `DEFAULT=1`，战术射击平台为 `TRAP_OR_ITEM=2`，战术装备整理箱为 `OBSTACLE=4`。羽毛笔 S2 对禁闭所的命中范围筛选见 [Case 28](28-damage-hooks-and-event-granularity.md#6-目标前置与来源输出能否交换)。因此，处于哪一类候选集合需要由实际受选规则判定。 [装置配置对照](../evidence/entity-category-20261118/README.md#两种形态的分类查询)

静态镜像中有敌人分类的逐级显式字段，但“某级重新声明”不等于“分类实际改变”。例如 `enemy_1570_ymgscm` 的 level 0／1 都是空 enemyTags；不能将 level 1 的显式空数组单独当成清除非空标签的玩法正例。静态统计、版本和查询保存在[配置证据](../evidence/unit-classification-20261114/config/README.md)。

已核对的 Enemy 模式切换／重生路径不替换该数据引用；这只能说明这些具体操作保留相应分类。本轮没有证明任意热更新或内容程序都不能改变标签，也没有为每条分类轴找到战中修改正例。是否需要动态修改公共状态，应依据实际修改链决定，不能从字段是数组、名称含 RuntimeData，或已有 Contribution 框架反推。

## 4. 已闭合与剩余证据缺口

已闭合：分类轴之间的区别、主要数据来源及读取位置；单位类型掩码的类测试与重叠；FilterTag／GroupTag 区别；豆苗磐蟹的战中实体类别切换及类别筛选；泥岩、守林人、附加职业模组和敌人级别模组的配置／消费者链。旧的 Profile.tags 转换不能作为这些原生语义的依据。

仍未闭合的具体问题：

1. 所有标签／职业／阵营的战中增删路径与热更新覆盖，没有穷尽。已提取的方法与配置不等于全客户端完整性证明。
2. 额外角色组标签的 Rune 消费已定位，但实际非默认启用配置和其影响范围需要单独核对；不能把处理入口本身称为实际战斗正例。
3. 当前 EnemyData 与 EnemyDB level 0 的攻击方式读取差别已证实，但尚缺会改变选择结果的同一敌人实际内容对照。
4. 敌人手册展示分类与战斗值不能互相代替；未将所有界面 race／标签逐项映射到战斗 FilterTag。

因此，这次证据足以开始讨论哪些共同事实应脱离完整 Data Profile，以及各查询到底读取什么；尚不足以宣称单位分类的全部运行时变化已经穷尽。具体字段与修改 API 留给后续架构决定，本轮不修改实现。
