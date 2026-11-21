# 天赋的运行事实与配置来源

调研日期：2026-10-13。范围是主模式代表性干员及普通引擎协议，区分内容选型、附着资格、私有状态与生命周期，不以原生组件名规定项目模型。

## 结论

官方确实有 BasicTalent 组件、Unit 的天赋集合、数据绑定、附着／分离和领域回调；部分天赋还保存专门运行状态。不能将天赋概括为静态数值，也不能以“一个 onEnter 安装 Buff”覆盖所有天赋。

项目内容装配与状态归属见 [Content](../../architecture/content.md)、[Effect](../../architecture/effect.md)和[Capability](../../architecture/capability.md)。

## 来源与版本

- **本机官方客户端原生静态证据**：[本轮证据包](../evidence/talent-lifecycle-20261013/records.json)。输入为当前安装客户端，metadata 29。GameAssembly.dll SHA-256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`；metadata 为 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。它们与旧 `client-excerpts.json` 不同，本案不混用旧方法索引／地址。未执行客户端或确认 XLua 现场覆盖。
- **客户端表镜像**：当时本机 `character_table.json` 与 `battle_equip_table.json` 的读取，来源定位见[批次说明](../evidence/talent-lifecycle-20261013/README.md)；仓库 main-mode fixture 的来源声明指向 [Kengxxiao 镜像 commit 17759cc8](https://github.com/Kengxxiao/ArknightsGameData/tree/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel)。本案未独立核验临时完整表与该 commit 的完整哈希，也不将表镜像与当前安装客户端绑定为同一版本。
- **PRTS 玩法资料**：用于核对具体天赋的作用对象、条件和持续方式，是社区资料，不替代原生调用链。[生效条件汇总](https://prts.wiki/w/天赋生效条件一览) 是案例入口，具体行为以各干员页面备注互证。

## 已确认的官方共同外壳

| 事实 | 本轮原生锚点 |
| --- | --- |
| Unit 与 UnitMode 各自保存 talents 数组；BasicTalent 保存 owner、内部 Ability、data 和 parentMode | Unit.OnAwake 77702、RecollectTalents 77703、UnitMode._InitTalents 77844；字段正面投影见证据包 |
| 角色配置先预处理天赋，再根据 skillIndex 和 talentKey 绑定数据；无匹配内容会标记无效 | Character._AssignData 76054、_AssignTalents 76062 |
| 数据有效与当前附着是不同事实 | BasicTalent.get_isValid 73274、get_isAttached 73275 |
| 基础天赋将数据与附着操作委托给内部 Ability | AssignData 73301、DoAttach 73317、DoDetach 73318 |
| OnInit 已有按当前模式资格附着天赋的入口，早于 OnBorn | Character.OnInit 76025、OnBorn 76027、Unit.OnBorn 77696 |
| 模式切换与重新选型可分别分离、重新绑定并附着内容 | UnitMode.OnActivate 77836、Unit.InactiveMode 77669、Character.ReassignTalents 76063 |
| 攻击前后有天赋虚回调，随后进入 BuffContainer 对应事件 | Character.OnBeforeAttack 76038、OnAfterAttack 76039 |
| 结束涉及 Buff 清理、Ability 分离及模式停用，回收另有天赋回调 | Character.OnFinish 76033、Unit.OnFinish 77689、Entity.OnFinish 66653、ClearAbilities 66639、Unit.OnRecycle 77698 |

这些是普通原生路径的结构和顺序；没有据此要求项目复制 Unity 组件、逐 Unit Update 或上述所有微时序。

## 子类状态不能抹掉，也不能推广到全部天赋

**SilenceableTalent** 持有手动附着意图；`_UpdateInternalAbilityAttachStatus`（73543）根据配置及宿主的沉默／结束状态决定内部 Ability 的实际附着。它证明需要表达特定内容的参与条件，不能据此规定所有天赋都响应沉默。

**RebornTalent** 持有最大复活次数、已使用次数及复活数据。`CheckReborn`（73528）通过条件后立即增加自己的计数及 Entity 的计数；`Unit.OnHpZero`（77704）在 `!skipReborn` 时先尝试 `Unit.CheckReborn`（77683），后者按附着资格选择并在首个成功结果后返回。复活的次数与结算位置是运行事实，不能由静态参数或已安装 Buff 名称替代。所有计数是否跨撤退／普通复活保留尚需逐机制核查。

**AppearTalent** 的 `_OnBorn`／`_OnLocate`（73269／73270）按配置选择出生或定位时调用内部 Ability。登场动作是一类天赋的行为，不是全部天赋的统一发动方式。

## 代表性主模式需求

| 案例与来源 | 区分出的事实 | 项目应接入的职责 |
| --- | --- | --- |
| [玫兰莎](https://prts.wiki/w/玫兰莎#天赋) | 配置选定的常驻攻击加成 | 参数选择；Offense Contribution 与常驻内容激活 |
| [泥岩](https://prts.wiki/w/泥岩#天赋) | 部署时初始盾层、周期补层与破盾回复；层数耗尽仍保留同一 Buff | Effect 私有层数／计时，时间推进与受伤 Hook |
| [风笛](https://prts.wiki/w/风笛#天赋) | 攻击概率机制、编队初始 SP，以及模组追加的自身部署 SP | 攻击准备／目标规则、战斗编队政策与 Skill 初始化、部署操作 |
| [银灰](https://prts.wiki/w/银灰#天赋) | 编队再部署修正与场上反隐作用域不同 | Deployment／待部署状态；Aura 与 Status |
| [砾](https://prts.wiki/w/砾#天赋) | 在场加防与部署时缩短其他干员剩余再部署计时是两种操作 | Defense Aura；部署时的一次计时转换 |
| [伊内丝](https://prts.wiki/w/伊内丝#天赋) | 目标标记依赖本次部署身份，退场后影哨继续存在 | 伤害后介入、来源身份与标记；独立战场生成物 |
| [玛露西尔](https://prts.wiki/w/玛露西尔#天赋) | 魔力整场保留，进场转为技能 SP、离场转换回魔力，场下仍回复 | 持续的待部署对象／战斗资源状态与场上 Skill 转换；不能仅存于离场即删除的宿主 Effect |

编队由 Meta 提供，但本场战斗的编队效果、待部署状态及部署参数仍应由 Tactical 的对应规则落实。把天赋标成 Meta 内容，不能替代这些战斗内转换。

原表的天赋候选承载解锁条件、潜能要求、prefabKey 和黑板等；模组可替换指定 talentIndex，也可新增隐藏候选。槽位用于选型，不直接证明玩家可动态选择天赋或需要固定运行槽数。表中未提供统一运行状态，不等于 prefab／代码没有专门状态；RebornTalent 的次数计数是直接例子。统一冷却规则仍未证实。

## 未闭合的事项

- 全部具体天赋 prefab 子类与主模式／卫戍模式可达链尚未穷尽；本案不宣称支持全部内容。
- 模式切换、假死复活、撤退重部署时，各机制的计数和目标身份如何保留，需要对应内容案例。
- ReassignTalents 的具体调用内容与旧实例／计数保留需要逐机制核对，不从方法存在推导全部重绑政策。
- 当前客户端与旧调查版本的 hash 不同；本案的新地址仅用于本案输入，不倒推旧模板的所有执行路径。

## 干员配置数据补核（2026-11-10）

本节补等级、信赖与模组的选型依据，不重新设计 Talent。原生方法／字段见[本机静态摘录](../evidence/unit-audit-20261110/operator-config/native.json)，配置见[固定提交摘录](../evidence/unit-audit-20261110/operator-config/configuration.json)，版本和复跑范围见[批次说明](../evidence/unit-audit-20261110/operator-config/README.md)。两类材料分别固定版本，不假定镜像与安装客户端同版，也没有运行时 XLua 验证。

### 等级插值不能推出整数属性保留小数

`AttributesCalculator.TryGetBasicData`（22759）按精英阶段取得属性关键帧。`AttributesKeyFrame.LerpData`（31641）计算并限制插值比例，再调用 `AttributesData.Lerp`（31440）；后者对允许插值的数值字段执行 `from + (to - from) × ratio`，写回 `WriteAttributesField(float)`（31442）。不能把这条链简化成“所有字段都线性插值且保留小数”。

当前 `AttributesData.maxHp / atk / def / tauntLevel / blockCnt / cost / respawnTime` 是 `ObscuredInt`；31442 在写入这类字段前调用 `0x180007310` 取偶舍入，再构造整数。该 helper 与 [World→Tile 数值补证](../evidence/unit-audit-20261110/coordinates-numeric/README.md)中核实的舍入路径共用。`magicResistance / attackSpeed / baseAttackTime` 是 `ObscuredFloat`，写回不做上述整数转换。

原生等级属性、信赖增量各自在写回时完成取偶舍入，再相加。例如泥岩精一 2 级攻击力的插值为 `515 + 172/79`，整数写回得到 `517`。

### 信赖的表映射与饱和

`AttributesCalculator.Input` 的显式等级构造器（22774）通过 `FavorDB.GetFavorData` 取得 `battlePhase`；22759 再用它查询 `CharacterData.favorKeyFrames` 并 `ApplyDelta`。信赖百分比不能直接当作插值比例。

固定表中，49%／50%／99%／100%／200% 分别对应 battlePhase 24／25／49／50／100。所选干员的信赖关键帧止于 50；关键帧查询超出末端时取末帧，因而 100% 后属性饱和。PRTS [信赖值](https://prts.wiki/w/干员信赖)提供玩法互证。信赖增量自身也经过 `AttributesDeltaKeyFrame.LerpData` → 31440 的字段写回，整数增量在加到等级属性前已经取整。

### 模组阶段与真实 DATA_ONLY 正例

`UniEquipUtil.TryGetUniEquipPackData`（91550）按查询的 `equipLevel` 选取单个阶段；`FetchUniEquipAttributeAddition`（22763）读取该阶段的 `attributeBlackboard`。泥岩 X 模组三级的 HP 加值分别为 245／325／400，是各阶段的完整加值，不累计前两级。

解锁资格另有静态依据：同一模组要求精二 60 级，`unlockFavors` 的二／三级分别为 2732／10070，对应 50%／100% 信赖。它们是配置进入合法选型的要求，不能说战斗中的模组属性消费函数再次检查了所有解锁条件。

黍的 `uniequip_002_shu` 三级提供真实 `TALENT_DATA_ONLY`：目标为已有天赋 key `1`，黑板包含 `born_range_id`，数值为 0、字符串为 `0-1`。因此字符串黑板保留有实际数据需求，无需用人工新增天赋证明该字段。`AddEquipTalentData`（91564）接纳 TALENT／TALENT_DATA_ONLY 的数据；天赋候选仍按精英、等级和潜能选择。这个正例不证明 DATA_ONLY 可以任意新增另一套 Prefab，也不代表全部模组的运行行为已经审查。

## 干员跨表绑定（2026-11-21）

本轮沿 `charId` 核对普通角色资料的关联方式。分别使用 `63c7cec7` 的角色／技能原表及 `17759cc8` 的装备原表与范围摘录。样本、文件指纹、原文路径和复跑命令见[跨表绑定证据](../evidence/operator-table-bindings-20261121/README.md)。

| 资料 | 实际组织 |
| --- | --- |
| 角色 | `character_table[charId]` 包含 `phases`、`favorKeyFrames`、`potentialRanks`。精英阶段给出等级上限、属性关键帧、`rangeId` 和 `characterPrefabKey`。 |
| 技能槽与升级 | `character_table[charId].skills[slot]` 记录 `skillId`、`unlockCond`、`levelUpCostCond` 和资源覆盖。`allSkillLvlup` 在角色级提供常规升级条件，槽位的 `levelUpCostCond` 补专精条件。 |
| 技能等级 | `skill_table[skillId].levels[level - 1]` 保存 `spData`、发动类型、持续类型与数值、黑板、`rangeId`、`prefabId`。这里的 `rangeId` 可为 null，角色的普通范围另由精英阶段引用。 |
| 特性与天赋 | 角色表内联 `trait.candidates` 和 `talents[].candidates`。候选带精英／等级解锁、零基潜能门槛、黑板、`prefabKey` 和可空范围等字段。候选可以具有相同的 `prefabKey`。 |
| 模组 | `uniequip_table.charEquip[charId]` 列出装备 ID，`equipDict[id]` 给出归属、类型及精英／等级／信赖门槛。同一 ID 连接 `battle_equip_table[id].phases[]`，按 `equipLevel` 记录阶段属性和 `parts`。普通证章 `uniequip_001_mudrok` 是 `INITIAL`，在所核战斗装备表没有同 ID 记录。 |

**技能数据和资源有独立的键。** 泥岩 S1 的 `skillId` 是 `skcom_def_up[3]`，拜松也引用这条技能数据。技能等级的 `prefabId` 是 `skcom_def_up`，泥岩的槽位另填 `overridePrefabKey=skchr_mudrok_1`。蜜蜡 S2 的 `skillId` 是 `skchr_beewax_2`，`overrideTokenKey=token_10011_beewax_oblisk` 指向角色表中的沙之碑。两种覆盖分别指向资源和召唤物，技能等级记录继续按 `skillId` 查。[角色槽位](../evidence/operator-table-bindings-20261121/character-bindings.json) · [技能记录](../evidence/operator-table-bindings-20261121/skill-levels.json)

**具体可选等级取决于绑定和解锁。** 玫兰莎 S1 在精零 1 级开放，技能表有七级，槽位的专精条件数组为空。七级是手动发动、自然回复，40 SP、20 秒，黑板 `atk=0.5`，技能 `rangeId=null`。泥岩 S2 在精一 1 级开放，三个专精要求精二 1 级，技能表共有十级。专三是自动发动、受击回复，4 SP，`rangeId=x-4` 指向九格，黑板给出 2.7 倍攻击力、0.3 眩晕概率、1.2 秒眩晕及 0.06 自疗比例。表中 S2 `duration=0`，实际发动后的输出与结束另见[行动时序调查](07-action-timing-and-animation.md)。[固定表摘录](../evidence/operator-table-bindings-20261121/skill-levels.json) · [PRTS 玫兰莎](https://prts.wiki/index.php?title=玫兰莎&oldid=442324) · [PRTS 泥岩](https://prts.wiki/index.php?title=泥岩&oldid=446594)

**模组阶段可以同时提供属性、特性和天赋变体。** 泥岩 X 二／三级的 `TALENT` 指定 `talentIndex=0`，护盾各保留普通和潜能五候选，破盾回 SP 分别为 1／2。Y 的二／三级指向 `talentIndex=1`，数据涉及第二天赋。黍有 `TALENT_DATA_ONLY` 的字符串范围引用，迷迭香的模组还出现 `talentIndex=-1` 的隐藏候选、`isToken` 部分及 `OVERWRITE_BATTLE_DATA`。各变体语义及特殊模式的生效仍依具体内容核对。[跨表模组样本](../evidence/operator-table-bindings-20261121/equipment-parts.json)

交付发生在养成选型前时，跨表汇集可以解析已知引用，并保留阶段、技能合法等级、天赋候选、模组分级和覆写条件。每次建战只需选择本次配置。动画释放点和其他动作时序来自各自的资源证据，可与表摘录并入同批静态输入。[动作时序资料](07-action-timing-and-animation.md)
