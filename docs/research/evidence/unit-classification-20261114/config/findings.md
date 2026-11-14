# 配置事实与内容正例

## 分类不是一个字段

| 轴 | 静态输入 | 本次查到的值与限制 |
| --- | --- | --- |
| 原生类／类型筛选 | Prefab MonoScript；消费者的 `_checkUnitType`、`_unitTypeMask` | Character、Enemy、Token、Trap 的实际类关系由 native 专项核对；不能用资源 key 前缀证明类。 |
| 阵营 | Enemy Prefab `_sideTypeIndex` 等创建配置 | 与原生类独立。卫戍莱塔尼亚两召唤物是真实 Enemy、ALLY 阵营，见下文。index 和 mask 是不同枚举。 |
| 实体类别 | Prefab／创建数据中的 EntityCategory | 与原生类、职业另为独立轴，具体默认值和消费者归 identity 专项。 |
| 职业 | `character_table/<id>/profession` | 本镜像八职业加 TOKEN、TRAP，共10种；TOKEN75、TRAP846。角色表范围不等于全部战场实体。 |
| 分支 | `subProfessionId` | 本镜像74种，与职业不构成一一对应；镜中虚影是 TOKEN／executor。 |
| 额外职业 | 模组黑板 `extra_profession` | 迷迭香IS模组为 `caster`，并有 `game_tag_meta=roguelike`；不是改写基础 `profession` 的配置。实际消费由 identity 专项核对。 |
| 主／附加势力 | `mainPower`、`subPower`，以及 `nationId/groupId/teamId` | 三类身份有空值和复合结构。守林人主势力 rhodes、附加 kazimierz；德克萨斯主 lungmen/penguin、附加 siracusa。不能只读 UI 所属势力。 |
| 敌人类别标签 | EnemyDB `enemyTags` | 可定义数组、显式 null，或 `m_defined=false`。非空值11种，见下文。不能由干员档案种族推出相同标签。 |
| 敌人级别 | EnemyDB `levelType` | NORMAL／ELITE／BOSS；与类别标签、阵营、当前模式独立。未定义行的存储值是 NORMAL，不擅自当作本级显式覆盖。 |
| 敌人攻击方式 | EnemyDB `applyWay` | NONE／MELEE／RANGED／ALL。是分类消费者读取的输入，不能仅凭当前 Ability 的伤害途径推导。 |
| 行动方式 | EnemyDB `motion`、Prefab／动态切换 | WALK／FLY；不等于攻击方式或职业。当前有效值、切换与挡人政策需读各自消费者。 |
| 部署位置类别 | `character_table/<id>/position` | NONE／MELEE／RANGED／ALL。它不是 Enemy.applyWay，也不是每次伤害的施加途径。 |
| UI 标签 | `character_table/<id>/tagList` | 输出、防护、支援等19种字符串（含空串）；许多 Token／Trap 为 null。不可据此构造战斗敌人种类或职业筛选。 |
| 图鉴资料 | PRTS图鉴／敌方档案库 | 多数列表筛选使用图鉴，PRTS 明确提醒它不等于战斗属性；本批未提取完整 enemy_handbook_table，不能证明其全部字段映射。 |

这里列的是原始来源及已经核实的区别，不把它们预先压成一个通用 `tags[]`。

## EnemyDB 的定义、默认与覆盖

`EnemyData` 的分类项使用 `{m_defined,m_value}`；不同等级分别有记录。`m_defined=false` 的保留值不等于显式配置，例如本镜像有一个未定义行仍保存 `enemyTags=['machine']`，27行保存 `[]`。共享查询中的 `m_value` 分组必须结合该标记解读。

2483个等级行中：

| 字段 | 显式定义 | 未定义 |
| --- | ---: | ---: |
| enemyTags | 1544 | 939 |
| applyWay | 2170 | 313 |
| motion | 2040 | 443 |
| levelType | 1653 | 830 |

显式 `enemyTags` 中，195行是 null、525行是空数组，其余824行各有一个字符串：`infection`、`collapsal`、`animated`、`seamonster`、`drone`、`machine`、`origen`、`sarkaz`、`originiumartscraft`、`mutant`、`wildanimal`。本次固定镜像没有长度大于1的数组，**不能据此认定 native 只允许一个标签**。

非零级有分类字段的显式记录，但本快照没有找到其值不同于首行的例子：三船光平两级 `enemyTags=[]`；“花匠”两级 `applyWay=NONE`、`levelType=BOSS`。这是覆盖结构的正例，不是分类发生变化的正例。是否合并、替换、先取哪一级、关卡覆盖能否改此值，由 native 构造链核实；本脚本不自行解释有效继承。

## 可以直接区分这些轴的内容

### 泥岩：检查伤害来源的类别标签

角色表第二天赋选中 `prefabKey='2'`；实际 `char_311_mudrok/Talents/2` 的 PassiveBuffAbility 登记 `mudrok_t_2`，模板 `filtertag[reduce_damage]`，黑板 `tag='sarkaz'`。Holder 事件10先执行 `CheckFilterTag(MODIFIER_SOURCE, bbKey='tag')`，再执行 `DamageScale`。完整配置在 `prefabs.json` 和 `templates.json`。

这是“对来源的战斗类别作条件”的正例。角色表泥岩自身是 TANK／unyield、主势力 rhodes；没有 `enemyTags` 字段。干员档案属于萨卡兹这一事实不能代替 `CheckFilterTag` 的原生实现；该调用对 Character、Enemy、Trap 的不同实现归 tags 专项。

### 守林人：读取攻击方式

角色表第一天赋 `prefabKey='1'` 对应 `char_158_milu/Talents/1`。其 PassiveBuffAbility（PathID `963236196431464861`）登记 `milu_t_1`；Holder 事件14执行 `AtkScaleUp`，`_filterApplyWay=true`、`_applyWay=RANGED`、`_filterNoneApplyWay=false`。

这证明普通天赋的分类输入是 applyWay。不能根据目标“现在发射了弹道”或名称描述替代此判断。目标当前 data／基础EnemyDB／UnitMode 的读取区别由 native 专项闭合。

### 维娜Y模组：按 NORMAL／ELITE／BOSS 决定控制参数

固定模组表 `uniequip_003_siege2` 的二／三级配置分别引用 `siege2_equip_2_2_p5`、`siege2_equip_2_3_p5`。安装资源 `[uc]equips.ab` 同名根的 PassiveBuffAbility（PathID `1447089353056446272`／`-1190797586985866839`）登记 `siege2_t_2`，模板 `siege2_e_003_t_2`。

Holder 模板索引6984、事件61先判断目标是 Enemy，再依据 `CheckEnemyLevelType` 的 NORMAL／ELITE／BOSS 分支，读取不同 `not_combat_*` 参数并创建缴械。它与来源／目标阵营、职业和 `sarkaz` 类别标签是不同条件。

### Token／Trap：职业与分支不能混为同一身份

`token_10001_deepcl_tentac` 是 TOKEN／notchar1；`token_10007_phatom_twin` 是 TOKEN／executor；`trap_007_ballis` 是 TRAP／notchar2。这些是同一固定角色表的直接记录；原生继承链和 selector mask 的组合见 identity 专项，不能把所有 Character 类概括成八职业干员。

### ALLY Enemy：复用已有实际卫戍样本

[Case32 原件](../../leithanien-summons-20261109/content/README.md)已核对 `enemy_9025_aclts`、`enemy_9026_acltm` 的 MonoScript 均为 Enemy，`_sideTypeIndex=0` 对应 ALLY；盟约的真实召唤节点引用它们。该配置来自2026-11-06热更。当前固定EnemyDB镜像不含两项，未命中不能否定新内容，也不能猜其未取得的静态属性。

普通关卡正例包括猎狗（infection）、萨卡兹大剑手（sarkaz／ELITE）、妖怪（drone／NONE攻击／FLY）、宿主士兵（mutant）、泥岩敌人版（sarkaz／BOSS）。其原始记录均已摘录。空类别也独立保存：士兵的 enemyTags 未定义且值为 null，三船光平显式为空数组；不替它们发明一个名为“人类”的标签。

## 已知限制

- 完整表统计包含项目排除模式；上述普通关卡／实际卫戍例子才用于证明支持玩法的需求。未用生息或保全样本推 Core 政策。
- 额外职业的模组配置来自集成战略，不意味着所有玩法都消费该字段。
- 两个 `act1vautochess_*` 模板已提取，但本批没有展开它们从关卡／盟约配置安装的完整入口；不当作实际启用的闭环。
- 未找到静态多 enemyTags 正例或跨等级分类值变化正例；数组表达能力、等级合并与runtime改写必须由相应native调查判断。
- 没有全面扫描 Prefab 的 `_filterTag` 或实例覆盖，不用两个角色资源概括全部实体默认配置。
- PRTS 是社区解释；本批没有固定其 MediaWiki oldid。原件指纹、内容绑定和 native 方法分别承担不同证据作用。
