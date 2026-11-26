# 蒂比：空中阻挡与起飞的边界

研究日期：2026-10-29；原始项目对照 `a0bc26b`。取证以蒂比 `char_4191_tippi` 的实际 Prefab 和 Buff 程序核对空中阻挡；2026-10-30 的通用 Blocking 接入在第 5 节单独更新，不改变原生取证结论，也不实现蒂比内容。

新取证见 [selected-assets.json](../evidence/tippi-air-blocking-20261029/selected-assets.json) 和 [selected-native.json](../evidence/tippi-air-blocking-20261029/selected-native.json)；模式兼容、地块、半径和切换清理复用 [Blocking 原生模式调查](../evidence/blocking-native-20261023/modes/report.txt)。证据是已安装客户端的静态资产与普通原生分支，未执行实战采样或核实活跃 XLua 替换。Wiki 说明单独标注，不能代替客户端指令。

## 1. 实际配置没有把蒂比自身改成飞行目标

蒂比 Character Controller（PathID `6874620698869221580`）的初始配置为：

```text
_motionMode = WALK (0)
_blockMode = WALK (0)
_ignoreBlockMode = false
```

默认 Mode 的 `ClearFlyState` PassiveBuffAbility 安装 `tippi_tr[ground]`。该模板结束 `tippi_tr[fly_core]`，没有施加 `BLOCK_FREE` 的配置；已查初始配置按普通 WALK 阻挡处理，没有“落地时禁止阻挡”的依据。[PRTS 蒂比](https://prts.wiki/w/Tippi) 的基础阻挡数为 2，可作容量交叉核对。

起飞的核心调用链是：

```text
S1／S2 起飞模式 Attack 对象上的 BuffToOwner
  → tippi_tr[fly]
      → 创建 tippi_tr[fly_core]
          → 施加 MOTION_TARGET_FREE
          → ChangeCharBlockMode(FLY)

回到默认地面模式
  → ClearFlyState → tippi_tr[ground]
      → FinishBuffsById(tippi_tr[fly_core])
          → ResetBlockMode()
```

`fly_core` 配置中事件 0 设置 FLY、事件 1 恢复默认 BlockMode。高度变化由独立 `ModifyGraphicHolderHeight` 节点处理。角色有独立的 TakeOff／技能循环／Landing Mode：起飞 Attack Ability 的 `ON_CAST_START` 施加 fly，落地 Attack Ability 的 `ON_CAST_END` 切回 Default，随后运行地面清理。这些 CAST 事件属于起降 Ability，不能等同 Skill 的开始／结束，也不能用图形高度代替实际 Buff 变化的时点。已查起飞链没有 ChangeMotionMode 节点：不能用表现高度变化推导蒂比自身运动身份改变，更不能把她的 Layer 改成 AIR 来表达起飞。

`MOTION_TARGET_FREE` 与 `BLOCK_FREE` 是不同异常标志，原生枚举分别为 35 和 3；起飞核心 Buff 带的是前者。她起飞后能挡飞行敌人，不是给自己施加了“不可阻挡”。

## 2. 空中阻挡与地面阻挡的具体差异

下表中的普通模式行为来自通用原生方法，蒂比的配置通过 Change／ResetBlockMode 进入这些方法；不另建一套“蒂比阻挡器”。

| 项目 | 普通 WALK 阻挡 | 蒂比起飞后的 FLY 阻挡 |
| --- | --- | --- |
| 目标资格 | 目标当前运动模式为 WALK | 目标当前运动模式为 FLY；不再阻挡地面目标 |
| 默认接敌半径 | 0.7071 | 0.8944 |
| 地块条件 | 搜索要求根格允许近战阻挡 | FLY 分支绕过近战地块阻挡条件 |
| 蒂比自己的运动身份 | WALK | 仍为 WALK |
| 对地规避 | 初始配置未施加 | 起飞核心 Buff 施加 MOTION_TARGET_FREE |
| 关系建立、容量与归属 | 使用普通 Blocking 关系 | 仍使用普通 Blocking 关系，不是另一种关系类型 |

`Enemy._CheckMotionModeBlockable` 比较目标的 `changeableMotionMode` 与阻挡者的 `blockMode`，不读目标的 `pathMotionMode`。因此寻路模式、目标空地身份和阻挡策略不能合并为一个值。

半径来自 Character 普通原生路径；`BLOCK_RADIUS_SCALE` 的修正只作用于 FLY 半径。蒂比配置证明半径的普通默认与模式差异，不直接决定项目的修正接口。

地块豁免不是“飞起来就让整格允许阻挡”：地面阻挡者仍按自己的资格处理。射击台的原生 `highland_common[block]` 也按 WALK 阻挡模式施加 BlockFree，不能对所有乘员一律禁挡。相关平台证据已记录在 [Blocking 设计](../../architecture/blocking.md#地块阻挡资格)。

## 3. 对地规避与“自身是飞行目标”不同

[PRTS 起飞说明](https://prts.wiki/w/Tippi#特性) 记录：起飞时不能被地面行动方式的异阵营来源选中，但蒂比自身行动方式仍是地面，选择她不要求攻击能够对空。不能把这条规则改写成“能攻击 AIR 的地面来源就能选中她”。

本轮原生短核补上了相关区别：`Character.isStillMotionTargetFreeWithImmuneFlag`（76014，`0x180a3cf00`）接收的参数明确名为 `sourceMotionMode`；普通分支在相关标志有效时比较 `get_blockMode()` 与这个参数是否不同。Character 特意使用阻挡模式；Entity 基类对应路径使用自身当前运动模式。该局部方法直接比较传入参数，自身不查询选择器配置。

本轮没有继续追完整选择器如何取得和传入该参数。异阵营条件、所有豁免和特殊选择器仍不能由这个局部方法单独推导。已核实的玩法区别可由 Targetable 限制表达，而不是改变蒂比自己的 Layer。

2026-11-09 的[通用选择调查](33-targeting-and-targetable-pipeline.md#43-对地规避来源补核)已补齐这条上游：TargetOptions 在相应异阵营分支取得来源运动方式，身份有效时读当前值，失效时可回退初始化样本，再经目标虚方法判断；是否忽略该限制由本次选择选项决定。该补核不将蒂比的阻挡模式解释为她自身的 Layer。

对地规避属于选中限制，不自动等于免伤。[PRTS 技能二说明](https://prts.wiki/w/Tippi#技能) 另有本次伤害闪避机制；不能只靠起飞后的索敌限制替代它。本轮不展开技能二的伤害处理顺序。

## 4. 起飞、落地与飞行目标停走

原生 `ChangeBlockMode`／`ResetBlockMode` 进入 `OnBlockModeChanged`：有效模式改变时，先清空旧阻挡关系，再通知模式变化，没有在该入口立即搜索新目标。蒂比起飞释放原有地面目标，落地释放原有飞行目标；不能将其简化为改变模型高度后继续保留旧关系。

关系解除与下一次接敌是不同操作。恢复到地面资格不表示 ResetBlockMode 自己同步取得附近地面目标；后续普通搜索或明确的立即搜索入口决定何时接敌。

飞行目标停走依赖已建立的普通阻挡关系，不由目标的寻路模式或视觉高度直接决定。项目切层、关系清理及站位结算见 [Blocking](../../architecture/blocking.md)，自身目标 Layer 与能够阻挡的目标层继续分别表达。

## 6. 补核：非巡空者实例与半径机制

2026-10-29 补核，空中阻挡不是巡空者专属，已有两类明确内容：

- **风絮，医疗·守望者。** 角色表记录 `char_4222_taraxa`、`profession=MEDIC`、`subProfessionId=watchman`，基础阻挡数为 1，特性包含起飞。[PRTS 风絮](https://prts.wiki/w/风絮#特性) 明确其起飞后可以阻挡飞行敌人。这说明能力不能按巡空者职业判断；基础容量与天赋等运行时修正仍须区分。
- **《未许之地》的可浮空区块。** [UR-4 晴空湍流](https://prts.wiki/w/UR-4_晴空湍流) 的关卡配置说明，放置于该区块的单位在区块浮空时能阻挡空中敌人，不要求单位属于巡空者。保留的客户端表镜像中 `/stages/act47side_04/description` 直接包含这个机制；活动表确认 `act47side` 为《未许之地》。

这些记录见 [content-witnesses.json](../evidence/air-blocking-radius-20261029/content-witnesses.json)，注明了镜像来源、指纹与字段位置。风絮的具体 Buff 实现和可浮空区块的具体 Prefab→动态地块链本轮未追；通用动态高度覆盖 BlockMode 的原生能力与该描述相容，但不能当成已经闭合的具体调用链。起飞、浮空、可以对空攻击和 `ignoreBlockMode` 的代码能力本身都不再额外计为内容实例。

半径须区分三层，而不是在“全都固定”和“每个单位独立配置”之间二选一：

| 层次 | 已确认原生行为 | 结论 |
| --- | --- | --- |
| 普通 Character 基准 | Character getter 直接读取 DLL 常量：WALK 约 0.7071，FLY 约 0.8944 | **空中基础半径是统一默认值，不是各角色 Prefab 独立配置。** |
| 普通角色运行时倍率 | `defaultBlockRadiusScale` 同样读取统一常量 1；FLY 路径可按 `0.8944 × BLOCK_RADIUS_SCALE` 计算 | 当前有效半径可以变化，倍率不是另一份逐角色基础半径；该修正不作用于普通 WALK 半径。 |
| 特殊对象覆盖 | Trap getter 读取实例 `_blockRadiusSquare`；GiantTrap 使用自己的固定平方半径并遍历多个原点 | 不能把普通 Character 默认值宣称为所有装置的强制常量。 |

常量地址、倍率字段、方法和旧证据指纹见 [selected-witnesses.json](../evidence/air-blocking-radius-20261029/selected-witnesses.json)。这证明倍率通道存在，没有调查每项内容是否实际修正它，也不根据可写 schema 虚构某个干员的特殊倍率。

**D：2026-11-22 多原点内容筛查。** 基础 Windows 安装的 123 个所选 Bundle 有 11 个实际绑定 `GiantTrap` 的组件，本机缓存的 44 个更新 Bundle 未增加匹配。四个带非零基础阻挡数的装置均与生息演算表关联。还有三个基础阻挡数为零的组件关联生息演算，四个属于次生预案并设置 `_alwaysBlockFreeOptimize=true`，其基础阻挡数亦为零。本次没有取得普通战斗或卫戍中可实际阻挡的多原点配置。包外资源、动态增容和其它版本的证据范围另列。 [Prefab、容量与模式配置](../evidence/spatial-content-20261122/README.md#gianttrap-的实际配置)

### 2026-11-22 补核：凯尔希·思衡托的动态半径

**D：** 固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 中，`char_1052_kalts2` 的第一天赋“遗尘守望”在 `/char_1052_kalts2/talents/0/candidates/*/blackboard/3` 写有 `block_radius_scale=0.23`。同角色 S1 `skchr_kalts2_1` 的各技能等级在 `/skchr_kalts2_1/levels/*/blackboard/1` 写有 `attack@block_radius_scale=0.23`，持续时间均为 35 秒。 [角色表](../../../assets/arknights-game-data/zh_CN/gamedata/excel/character_table.json) · [技能表](../../../assets/arknights-game-data/zh_CN/gamedata/excel/skill_table.json)

**P：** 社区条目将天赋的范围变化记为自身的阻挡半径倍率，S1 则提高其他持有对地规避的友方干员的倍率。S1 开启和结束能改变已在场受益者的有效范围，范围内外的飞行单位取得阻挡关系的结果会不同。第 6 节的原生半径读取证明普通飞行阻挡消费 `BLOCK_RADIUS_SCALE`，普通地面阻挡不消费该属性。本次没有重新提取新版 Buff 模板或运行客户端验证倍率叠加。 [PRTS 天赋与技能](https://prts.wiki/w/凯尔希·思衡托#技能) · [半径读取原件](../evidence/air-blocking-radius-20261029/selected-witnesses.json)

## 7. 2026-11-26 汇总：阻挡模式、目标资格、半径与站位

这几项原生规则应分别理解：

- **阻挡模式与目标匹配。** 普通阻挡者当前有效 `blockMode` 决定 WALK／FLY 模式，Character 的根格动态覆盖可改变该值；它不等同于阻挡者自身的运动身份。`_CheckMotionModeBlockable` 比较目标当前运动身份，`ignoreBlockMode` 仅跳过这一匹配。普通搜索的地块资格另行检查（FLY 绕过地面阻挡限制）。[模式与地块取证](../evidence/blocking-native-20261023/modes/report.txt)
- **跨层的实际样本。** 迷狂牢笼的组件为 `_motionMode=0`、`_blockMode=0`、`_ignoreBlockMode=1`，仍持有地面阻挡模式。旧版本专属搜索入口避开普通搜索的部分前提，但它的候选检查仍调用 Enemy 的接敌范围及资格判断；不可由运动层豁免推出所有对象均豁免地块或使用全格搜索。新版已核实组件与站位覆盖，未完整复核专属过滤调用链。[实际组件](../evidence/resource-mechanisms-20261114/life/content.json#L136150) · [特殊搜索](../evidence/blocking-timing-native-20261023/frequency/report.txt#L132) · [旧候选检查](../evidence/blocking-native-20261023/modes/77294.asm) · [PRTS 迷狂牢笼](https://prts.wiki/w/迷狂牢笼)
- **接敌半径。** 普通 WALK 使用 0.7071，FLY 使用 0.8944 乘当前有效 `BLOCK_RADIUS_SCALE`（基础倍率 1）。接敌距离按双方位置计算，与 Hitbox、取得后的最小站位间距无关。一个 +0.23 的独立倍率贡献在基础倍率为 1 时令普通 FLY 有效半径约为 1.1 格；多来源叠加未在本轮重新验证。
- **取得与保持的区别。** 普通既有关系不因中心距离超出接敌半径而逐 Tick 自动解除；有效阻挡模式改变有清除出向关系的后继。飞行半径属性变化另有 `RevalidateBlockees` 入口，其静态回退会重新调用包含已有归属拒绝的检查，不能据此断言实战仅释放半径外目标。[关系保持与重验](../evidence/blocking-native-20261023/retention/report.txt)
- **取得后的站位。** 普通取得将过近目标沿相对方向推至最小间距 0.5 格，另计算已有目标造成的分散，不主动拉近较远目标。迷狂牢笼覆盖这一结果：0.2 格内保留原位，超过时沿原方向将距离缩为随机的 0 至 0.2 格。二者都与接敌半径独立，覆盖的是站位终点而不是插值算法。[普通站位](../evidence/blocking-native-20261023/geometry/report.txt) · [迷狂牢笼与插值](22-block-positioning-and-interruption.md#L73)

本节汇总既有静态客户端、配置与社区证据，不将原生字段直接确定为项目模型，也不将未验证的重验行为视为实战定论。
