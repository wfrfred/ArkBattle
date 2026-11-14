# 单位分类与战斗标签

研究日期：2026-11-14。问题是原生单位有哪些可被战斗程序查询的分类事实、它们从哪里建立、哪些会变化，以及实际内容读取哪一项。调查涵盖通用战斗、干员／敌人／召唤物／装置和代表内容；不涉及生息演算、保全派驻、船运寻路。原件、输入指纹和复跑入口见[证据批次](../evidence/unit-classification-20261114/README.md)。

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

`CheckEntityUnitType` 的三个掩码位分别执行 Character／Enemy／Token 类测试。由于继承关系，Token 及 Trap 可同时满足 CHARACTER 位和 TOKEN 位。实际 `skchr_tocka_3` 配置同时要求 CHARACTER 类型掩码与 `professionMask=639`；两项并非重复。`UnitType` 的 TOKEN 枚举值为 3，`UnitTypeMask.TOKEN` 为 4，也不能直接相互强转。

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

这已证明同名“攻击方式”查询具有不同采样对象。尚未找到同一实际敌人在上述两个 Enemy 数据查询间产生不同结果的可执行正例，不将代码差别冒充已观测的玩法差别。

### 2.4 迷迭香模组：追加职业，不替换基础职业

静态 `uniequip_003_rosmon` 的黑板含 `extra_profession='caster'`，并带 `game_tag_meta='roguelike'`。原生 `_ProcessExtraProfession` 将该字符串解析为 ProfessionCategory，按位加入共享 extraProfession，保留基础 profession。

Selector 的 `checkExtraProfession` 决定该次职业检查是否接受附加职业，不能把额外职业直接覆盖进基础职业。本例有配置与原生消费链，不声称该模组在所有模式都启用，也不以 `RuntimeData` 命名推断它可以在战斗中任意增删。

职业筛选也不等于“非 Character 一律通过”。已核 TargetOptions 的非 Character 分支：目标 `side == ALLY` 且职业掩码非零时拒绝，其他非 Character 可通过这一职业分支；其他资格仍分别检查。因此不能把 Enemy 无职业简化成所有阵营下都忽略职业限制。

### 2.5 维娜模组：普通／精英／领袖分别处理

`uniequip_003_siege2` 高等级配置引用 `siege2_equip_2_2_p5`／`siege2_equip_2_3_p5`，对应 PassiveBuffAbility 安装 `siege2_t_2`，使用 `siege2_e_003_t_2` 模板。模板的敌人分支执行 `CheckEnemyLevelType`，分别处理 NORMAL／ELITE／BOSS，应用不同缴械配置。完整资源对象及模板摘录见[配置证据](../evidence/unit-classification-20261114/config/README.md)。

原生 `CheckEnemyLevelType` 和 `CheckEnemyLevelMask` 都读当前 `Enemy.data.levelType`；`EnemyData.isBoss` 是 `levelType == BOSS`，不是另一套独立 Boss 事实。这项分类确有战斗消费者，不能只保留在敌人手册展示中。

## 3. 初始化与变化范围

Enemy 的战斗分类来自转换后的 EnemyData，再由 Enemy 初始化保存数据引用；基础记录、等级覆盖和关卡引用覆写必须按各自路径检查，不能默认查手册或固定 level 0 就等价。Character 的基础职业、附加职业及组标签则来自 Character 数据构造与相应预处理。具体赋值、合并及保留证据见[标签调查](../evidence/unit-classification-20261114/tags/README.md)和[身份调查](../evidence/unit-classification-20261114/identity/README.md)。

角色组织资料的转换已闭合：`CharacterData.mainPower` 内联的 nation／group／team 复制到 `BattleCharacterData.nationId/groupId/teamId`，`subPower` 另行复制。GroupTag 查询检查这些主／附加组织，再检查 `extraGroupTags`，不是把旧表 legacy 字段与 mainPower 当成两套同时生效的数据。

额外 GroupTag 的已核写入发生在 Rune 的 Character 预处理。调用者包括预置 Character／Token 的临时 Dummy 创建—预处理—回收，以及卡牌属性资料处理；它们不是已在场 Character 动态增删标签的正例。本批未找到该 Rune 的实际非默认启用配置，保留这一具体缺口。

实体类别另有真正的修改入口：`Token.SwitchCategory` 写入覆盖值，`get_category` 在覆盖值非零时读它，否则使用 Prefab `_category`。本批保留完整方法与相关调用节点，尚未逐个闭合实际内容绑定；不能因为部分标签只找到构造路径，就把全部分类轴宣布为不可变。

静态镜像中有敌人分类的逐级显式字段，但“某级重新声明”不等于“分类实际改变”。例如 `enemy_1570_ymgscm` 的 level 0／1 都是空 enemyTags；不能将 level 1 的显式空数组单独当成清除非空标签的玩法正例。静态统计、版本和查询保存在[配置证据](../evidence/unit-classification-20261114/config/README.md)。

已核对的 Enemy 模式切换／重生路径不替换该数据引用；这只能说明这些具体操作保留相应分类。本轮没有证明任意热更新或内容程序都不能改变标签，也没有为每条分类轴找到战中修改正例。是否需要动态修改公共状态，应依据实际修改链决定，不能从字段是数组、名称含 RuntimeData，或已有 Contribution 框架反推。

## 4. 已闭合与剩余证据缺口

已闭合：分类轴之间的区别、主要数据来源及读取位置；单位类型掩码的类测试与重叠；FilterTag／GroupTag 区别；泥岩、守林人、附加职业模组和敌人级别模组的配置／消费者链。旧的 Profile.tags 转换不能作为这些原生语义的依据。

仍未闭合的具体问题：

1. 所有标签／职业／阵营的战中增删路径与热更新覆盖，没有穷尽。已提取的方法与配置不等于全客户端完整性证明。
2. 额外角色组标签的 Rune 消费已定位，但实际非默认启用配置和其影响范围需要单独核对；不能把处理入口本身称为实际战斗正例。
3. 当前 EnemyData 与 EnemyDB level 0 的攻击方式读取差别已证实，但尚缺会改变选择结果的同一敌人实际内容对照。
4. 敌人手册展示分类与战斗值不能互相代替；未将所有界面 race／标签逐项映射到战斗 FilterTag。

因此，这次证据足以开始讨论哪些共同事实应脱离完整 Data Profile，以及各查询到底读取什么；尚不足以宣称单位分类的全部运行时变化已经穷尽。具体字段与修改 API 留给后续架构决定，本轮不修改实现。
