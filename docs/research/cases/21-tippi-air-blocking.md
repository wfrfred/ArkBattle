# 蒂比：空中阻挡与起飞的边界

研究日期：2026-10-29；项目对照 `a0bc26b`。本轮以蒂比 `char_4191_tippi` 的实际 Prefab 和 Buff 程序核对空中阻挡，不实现蒂比，也不增加 Core 字段或 API。

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

半径来自 Character 普通原生路径；`BLOCK_RADIUS_SCALE` 的修正只作用于 FLY 半径。本轮蒂比配置没有证明需要新增一套半径贡献系统，当前项目的 `blocker.geometry.radius` 已能保存这两个实际半径。

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

## 5. 当前项目需要修改什么，不需要增加什么

现有二元 Rule、Targetable 限制、Blocker 半径、关系和 Movement 已能承载大部分行为。蒂比的起飞事实应由实际起飞模式 Buff 的取得／失效驱动，不直接绑定 Skill 开始／结束，也不据原生字段复制一个通用 BlockMode 状态。

实际硬限制有三处：

1. `blocking.canRetain` 固定拒绝 AIR 目标，AIR 放行 Rule 也无法越过；没有 Layer 的目标则仍可通过此项条件。
2. `blocking.canSearch` 无条件要求根格 `allowsBlocking`，没有表达空中阻挡的地块豁免。
3. 射击台现有乘员 Rule 恒为 false，会一并否决空中阻挡；再添加一个返回 true 的 Rule 无法覆盖已有否决。

后续应把这些资格整理为可组合的明确策略。普通地面策略仍须明确选择地面目标和相应地块条件，不能只删除限制而把所有地面干员同时变成空中阻挡者。这不要求现在确定新的公共字段或照搬原生掩码。

内容提交起飞／落地变化时，相关规则、半径和 Targetable 限制应在同一个新 Unit 中提交。蒂比切换时需要结束全部旧关系；如果新 Rule 已使所有旧目标不再合格，现有完整更新维护就能完成这些释放，不必重复调用释放操作。需要独立结束旧关系时已有明确的释放操作可用；不能把“仅释放不合格关系”泛化为所有模式切换的清空协议，也不能靠缩半径冒充释放。现有保持逻辑不因普通半径缩小而释放旧关系。

本轮只记录已证实差异和实际实现缺口，不修改源码，不增加模式状态机或新的回归测试。

## 6. 补核：非巡空者实例与半径归属

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

按本轮要求的项目边界，**标准地面／空中半径由 Content 提供共享配置或策略，Core 保留有效半径的数据承载与关系结算**。当前 `blocker.geometry.radius` 已能承载结果和特殊覆盖，不需要把 0.8944 写死进 Blocking Core，也不因每个对象都有 radius 槽位就把统一默认值误称为逐单位配置。倍率的表达和公式另按真实需求接入，不在本次调研中提前增加系统。
