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

半径来自 Character 普通原生路径；`BLOCK_RADIUS_SCALE` 的修正只作用于 FLY 半径。本轮蒂比配置没有证明需要新增一套半径贡献系统，当前项目的 `blocker.radius` 已能保存这两个实际半径。

地块豁免不是“飞起来就让整格允许阻挡”：地面阻挡者仍按自己的资格处理。射击台的原生 `highland_common[block]` 也按 WALK 阻挡模式施加 BlockFree，不能对所有乘员一律禁挡。相关平台证据已记录在 [Blocking 设计](../../architecture/blocking.md#地块阻挡资格)。

## 3. 对地规避与“自身是飞行目标”不同

[PRTS 起飞说明](https://prts.wiki/w/Tippi#特性) 记录：起飞时不能被地面行动方式的异阵营来源选中，但蒂比自身行动方式仍是地面，选择她不要求攻击能够对空。不能把这条规则改写成“能攻击 AIR 的地面来源就能选中她”。

本轮原生短核补上了相关区别：`Character.isStillMotionTargetFreeWithImmuneFlag`（76014，`0x180a3cf00`）接收的参数明确名为 `sourceMotionMode`；普通分支在相关标志有效时比较 `get_blockMode()` 与这个参数是否不同。Character 特意使用阻挡模式；Entity 基类对应路径使用自身当前运动模式。该局部方法直接比较传入参数，自身不查询选择器配置。

本轮没有继续追完整选择器如何取得和传入该参数。异阵营条件、所有豁免和特殊选择器仍不能由这个局部方法单独推导。已核实的玩法区别可由 Targetable 限制表达，而不是改变蒂比自己的 Layer。

对地规避属于选中限制，不自动等于免伤。[PRTS 技能二说明](https://prts.wiki/w/Tippi#技能) 另有本次伤害闪避机制；不能只靠起飞后的索敌限制替代它。本轮不展开技能二的伤害处理顺序。

## 4. 起飞、落地与飞行目标停走

原生 `ChangeBlockMode`／`ResetBlockMode` 进入 `OnBlockModeChanged`：有效模式改变时，先清空旧阻挡关系，再通知模式变化，没有在该入口立即搜索新目标。蒂比起飞释放原有地面目标，落地释放原有飞行目标；不能将其简化为改变模型高度后继续保留旧关系。

关系解除与下一次接敌是不同操作。恢复到地面资格不表示 ResetBlockMode 自己同步取得附近地面目标；后续普通搜索或明确的立即搜索入口决定何时接敌。

当前项目的 Movement 在 Route 推进后检查 `blockable.blocker`：非空则跳过 Locomotion 推进，路线完成离场也受该关系约束。这条判断不依赖 GROUND／AIR。飞行目标取得普通阻挡关系后，已经会停止自主移动；无需新增空中专用关系、禁移动 Rule 或 blocked 状态。被挡住也不意味着要修改目标的 Layer 或寻路模式。

## 5. 项目接入更新（2026-10-30）

原始基线有三项实际限制：canRetain 固定拒绝 AIR 目标、canSearch 无条件要求根格 allowsBlocking、射击台乘员 Rule 恒为 false。新通用接口以 Blocking 自己定义的 Layer = GROUND | AIR 表达能够阻挡的目标层，与宿主自身 Layer 分开，不将原生 BlockMode 命名引入项目。

Blocker Definition 的 layer、rules 必填，radius 可选；State 保存当前 layer 和实际 radius。Core 在未显式覆盖时提供 GROUND 半径 0.7071、AIR 半径 0.8944；显式 Definition.radius 在初始化和切层时都保持覆盖。空地匹配与 AIR 地块豁免由通用 Blocking 解释，阵营和其他特殊资格仍通过双方二元 Rule 判断。射击台 Rule 只禁止当前 GROUND 阻挡，AIR 可通过。

起飞／落地 Blocking 业务通过 capability/blocking 入口的 setLayer(battle, ref, layer) 完成，实现在 blocker-operations.ts。层改变时，新 layer、实际半径和全部旧出向关系的双端解除在第一个 RELEASED Hook 前一起提交；Hook 接续最新 BattleState，不误删嵌套新建的关系，随后由该操作显式维护，不自动搜索新目标。普通 unit.update 发布数据、索引与显式关系差分，不根据任意字段写回触发全场维护或推断完整切换事件；Content 不能直接改 blocker.layer 绕过该操作。关系保持和搜索资格的项目政策详见 [Blocking 设计](../../architecture/blocking.md#关系资格与-rule)。

蒂比仍应由实际起飞 Buff 的取得／失效调用相应操作，不直接绑定通用 Skill 开始／结束事件。Targetable 对地规避及表现高度继续独立处理；本轮不实现蒂比，也不修改她自身的空地身份。

这次接入不引入新的 Blocking 状态机、layerChanged Hook、Layer Contribution 或任意模式覆盖协议。浮空区块、特殊目标层豁免、BLOCK_RADIUS_SCALE 运行时修正及 Trap／GiantTrap 特殊几何继续作为未接入内容或证据保留，按实际需求推进。

## 6. 补核：非巡空者实例与半径机制

同日针对 `4b59185` 补核，空中阻挡不是巡空者专属，已有两类明确内容：

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
