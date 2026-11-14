# HP／EP 回复与元素全链补核

2026-11-14。本文是供 Case 25、29、34、37 汇总的取证说明，不是新的接口契约。`N` 为当前 Windows 客户端普通 native 分支，`D` 为固定资料或本机资源，`I` 为从已核分支得到的条件性推断。没有启动游戏、执行这些内容或验证活跃 XLua。

## 1. 先纠正范围

当前 metadata 的 `ElementType` 为 `NONE=0, SANITY=1, WATER=2, FIRE=3, DARK=4, ANGER=5, E_NUM=6`，不是四类。固定的 `ep_breakbuff_table.json` 也有五项；每项包含角色类我方／其他接收者两套时长与同一根效果标识。完整原始表、版本与 SHA 在 [static-inputs.json](static-inputs.json)。不能把现有四类型实现或旧八套数值当成原生边界。

`SANITY/WATER/FIRE/DARK/ANGER` 分别对应神经／侵蚀／灼燃／凋亡／狂躁损伤。这些是 EP 损伤；`DamageType.ELEMENT` 是扣 HP 的元素伤害，二者不互换。

原生选择标准爆发的两套接收者政策并非阵营二分。`EPController._GetEpBreakDuration` 67764 与 `OnElementBreak` 67763 的实际判断是：宿主可转换为 `Character`，且 side 为 ALLY，才取 `elementBreakDuration`；其余取 `enemyElementBreakDuration`。根模板使用 `IsCharacterOrTokenOrTrap` 再检查 ALLY，选择对应子模板。类型身份另经 metadata usage 独立解码，不是按变量名称猜测。

## 2. 实际使用例及证据闭环

| 机制 | 实际配置 → 程序 → 消费 | 结论与边界 |
| --- | --- | --- |
| 第五类损伤 | `act3break_04` 的 `enemy_8018_etouch_1`；Prefab `enemy_8018_etouch` 普通攻击 `_elementDamageType=5`；EnemyDB 的 `Attack.attack@ep_damage_ratio=.5`／`Reborn.attack@ep_damage_ratio=.6` | 不是未启用的枚举。`AbstractBasicAttack.DoSetData` 92296 读取 `ep_damage_ratio`，再经 93894／93895 构造 `ApplyElementDamage`。Prefab 默认 ratio=0 不能证明该路径不输出。见 [level-examples.json](level-examples.json)、[content.json](content.json)、[attack-ep-source.json](attack-ep-source.json)。 |
| EP 自然回复 | 余 `char_2026_yu` 第二天赋，静态 `ep_heal_ratio=.015`，潜能提升为 `.02`；默认模式 Talent2 的 ToggleablePassiveBuffAbility PathID `7714492335250386474` 安装 `yu_t_2[heal]` | 模板 event2 每 .2 秒采样目标 MAX_HP×比例，写入 `ep_recovery_per_sec`，更新属性29。此后 Entity 的普通 EP timer 逐脉冲调用 setter；不构造 ElementHeal。见第5节。 |
| 动态爆发恢复速度 | 酒神 `char_1042_phatm2`，S3 Talent2（PathID `-263653456522888950`）安装 `phatm2_t_2[s3]`；S3 黑板 `talent@ep_break_recover_speed=.5` | 模板在启用或神经爆发开始时，为处于 SANITY 恢复的目标安装属性 `EP_BREAK_RECOVER_SPEED` 倍乘修正，离开相应条件时撤销。`OnTick` 67758 每次读当前速度。这里没有证明所有标准子效果的独立时长也按此速度推进。 |
| 直接缩短爆发预算 | 珊比 `char_4235_thumpy`，第二天赋“探险理论”，Talent2 PathID `-3045388504718096767` 安装 `thumpy[t_2]` | 来源造成物理伤害的 event21，若目标正在 WATER 恢复，调用 `ReduceEpBreakCooldownDuration(duration_dec)`；潜能提升配置为1.2秒，否则分支可造成侵蚀损伤。不是仅存在的工具节点。见第4节。 |
| EP 免疫 | `act35side_01` 中 `enemy_10009_sggem`；实际 PassiveBuffAbility PathID `-5566533995896123389` 的 Buff 含异常21 `ELEMENT_FREE_ALL` | `get_isEPFreeAll` 67517 查询此异常；`OnTakeEPDamage` 67711 在非 force 路径取消，同时仍继续专属接收通知。免疫标记与零值、接收量护盾分别存在。 |
| EP 接收量护盾 | 纯烬艾雅法拉 S2 `skchr_agoat2_2` 的配置及 `agoat2_s_2` 模板 | event6 先 `IsElementDamage`，再 `BlockElementDamage` 99225，读取来源的 `agoat2_s_2[shield]` 黑板池；不应拿 HP ES 或 HP 次数盾代替。这条普通治疗技能在角色表有实际选择引用。 |
| HP 溢出转 ES 再转屏障 | 休谟斯 Talent1 PathID `7941709051775367590` → `humus_t_1`；医生 Talent2 PathID `7486918287888683052` → `rdoc_t2[heal]` | 两条都显式设置 `HEAL_CAN_GENERAL_SHIELD`。HP 资源层先处理 ES，内容监听 event47 再转自己的 BlockDamage 池。医生还安装临时 ES listener，并按来源实体相等结束。见第6节。 |
| 行医双回复 | Case29 末药／桑葚默认模式、Trait PPtr、脚本绑定与弹道附件链 | 桑葚 Trait 实际是附件 `ep_heal_all`，先 EP、后主 HP；本批 [static-inputs.json](static-inputs.json) 的桑葚原始 Trait 黑板补齐 `ep_heal_ratio=.5`（原 Case29 的数值来源缺口），不能由 HP 实际回复0推导 EP 为0。旧原件见 Case29。 |
| 生命复原 | 号角实际 Talent1 → `horn_t_1[muso]` → `horn_t_1[reborn_effect]` | `HealViaMaxHpRatio` 的 `_skipModifierEvent=true`，走 skip Modifier 分支，不等于自然回复，也不等于完全无回调。完整实际绑定引用同批 [life/content.json](../life/content.json)、[life/templates.json](../life/templates.json)。 |
| 满血通知实际消费者 | 缇缇 S3 的 Aura `skchr_titi_3`（PathID `-4423267185127745216`）→ `titi_s_3[doze]` → `doze_indoze` | `doze_indoze` 监听 event98 `OnOwnerHpFull` 结束，自身另有 .2秒满血检查。进入来源是 lethal-prevention event27。该例证明满血通知有实际消费者，**尚未证明已满血的重复 no-op setter 通知对这个内容有额外结果**。见第7节。 |
| 特殊“拷贝血量” | `enemy_1436_dsdivi` 的实际技能 `BuffAfterAffecting`、卫戍 `enemy_9014_acstma`／`enemy_9015_acstmb` 的模式及模板链 | `CopyHealth` 99015 实际取来源缺失HP（或缺失比例×目标MaxHP），向目标施加无来源真实伤害。不是任意 HP 直接赋值或治疗。满血新目标是其调用场景的重要前提，见第8节。 |

Prefab 的对象身份均以 `SerializedFile + PathID` 表示，完整值／PPtr／层级及原始对象 SHA 在 [content.json](content.json)，所选模板及递归子模板在 [templates.json](templates.json)。表镜像与本机 Bundle 是独立版本，不能把版本间字段一致当作已执行游戏的证据。

## 3. 数值、修正、接收与提交

`BattleFormula.CalculateElementDamage` 65902–65904 支持来源当前ATK、显式ATK等入口，最终核心式为：

```text
r = max(0, target.epResistance)
damage = max(base × MIN_ATK_FACTOR, base × max(0, 1 − r × .01))
MIN_ATK_FACTOR ≈ .05
```

`.05` 由 `BattleFormula..cctor` 65915 的 float32 读取独立核对，见 [formula-operations.json](formula-operations.json)、[metadata-details.json](metadata-details.json)。5%是公式保底，不能由此给属性查询加95上限。`EP_RESISTANCE=32` 与 HP 元素伤害使用的 `EP_DAMAGE_RESISTANCE=31` 是两项属性。`MAX_EP=28`、自然 EP 回复29也各自独立。

`Enemy.get_maxEp` 77644 取当前属性28，加 `Consts.ENEMY_EXTRA_EP[levelType]`。当前 `Consts..cctor` 建立长度3数组，前两项0、index2为1000。因而通常领袖为基础1000+额外1000；不是对任意基础覆盖都固定返回2000。`EnemyGiantBoss` 78299 调回 Enemy getter。见 [maximum-ep.json](maximum-ep.json)、[constants.json](constants.json)。

EP 损伤并非只有ATK附带一种来源：`ApplyFixedElementDamage` 99352、`ApplyElementDamageBasedOnDamageValue` 99347、AOE 99337/99339 与基础附带节点都有独立输入。节点支持是否经过公式、来源／缓存ATK等区别，不能凭“固定量”名字就假设它一定跳过抗性。酒神S2的配置定位 `phatm2_s_2[damage]` 明确 `_calculateDamage=false`，与社区页描述相符；本批未额外展开该技能产物的安装图，不把单一模板存在当完整绑定。相关字段／完整体在 [inventory.json](inventory.json)、[core-operations.json](core-operations.json)。

HP 普通治疗的基础公式仍为 `max(0, ATK × healScale)`，不读取 DEF／RES；EP 普通回复节点取自己的 ATK×epHealRatio，不读取前一笔 HP 的实际回复量。修正与权限应沿 `Entity.ApplyModifier` 分流检查，不能从 CalculateHeal 简单推出“没有任何治疗加成”。具体治疗倍率、来源／目标通用 Modifier 程序均可参与。主流程复用 Case27／29 及同批 damage 的完整 ApplyModifier。

HP普通治疗与EP回复都参与通用 Before／Output／Applying／来源BeforeTargetApply／Applied；HP另有 `OnTakeHeal`、来源 `OnAfterOutputHeal`，普通 EP 回复不因此进入 HP 专属事件。HP原生普通接收会检查 HEAL_FREE，EP不是复用 HP OnTakeHeal。项目已明确选择 healFree 只影响 Targeting，本调查不覆盖该选择。

EP正向提交遍历真实类型1～5，每型各加同一个数额并独立截到最大值，`realDelta` 累加实际变化；不是选最低EP，也不是将总量分摊五份。爆发恢复提供的 ELEMENT_FREE_ALL 同时参与普通 EP 提交准入，故普通回复在恢复期可失败，而通用前置已发生。force/skip/notCancelOthersEp 的通用语义由同批 damage 调查列明。

`Modifier.finalDelta` 共用“当前value截零后乘方向”。初始零与正计算量最终变化0不同；负数输入原生也不是 EP 单独抛异常。本项目已经确认最终 Calculate非负、零输出拒绝、正输出提交实际0仍可成功；这里只记录原生分支，不重新引入负数接收语义。

## 4. 爆发开始、恢复、缩时与结束

普通 EP 写入归零，同步进入 `OnElementBreak` 67763：读取对应 BreakData，确定 `recoveryType`，通知 `OnBeforeEPBreakStart`，创建根 Buff，随后 `_StartEPRecovery`。`set_isInBreakRecovery(true)` 加入控制器属性修改器后通知 Start；结束方向先通知 BeforeFinish，切换状态并移除属性修改器，再通知 Finish。三个通知名称不能机械等同于 ArkBattle 的 Hook 时点。

恢复启动清零全部真实 EP，保存 total、elapsed=0。每次宿主调用 `OnTick`：

```text
elapsed += deltaTime × 当前 epBreakRecoverSpeed
未满：全部EP = 当前maxEP × elapsed / total
已满：写满全部EP、清预算、解除恢复状态
```

没有统一创建Tick跳过。零／非正预算当场写满并结束恢复；根 Buff 的零寿命仍执行开始、结束程序，子效果按自己的生命周期处理。神经独立眩晕／麻痹、侵蚀独立减防、灼燃派生减抗、凋亡周期与衰减、狂躁动态增量程序分别见完整模板，不能以“根0秒”推导全部子效果不执行。旧 Case25 的零寿命逐指令证据继续有效；本批补足五型根映射及狂躁的根／子配置。

珊比实际调用的缩时不是普通的 `remaining -= delta`：

1. `ReduceEpBreakCooldownDuration` 67759 要求当前恢复有效且参数有效；反向遍历本次记录的爆发Buff，对仍有效者 `SubtractRemainingTime(delta)`，剔除已失效引用。
2. `total = max(0, total − delta)`，**elapsed保留**。
3. `_RefreshEpRecoverAfterCooldownReduced` 67760 同步重写所有EP为新比例；若新total≤0或elapsed已达到新total，当场写满并结束。

例如旧 total10、elapsed4，减2后不是仅缩短倒计时而EP仍40%；新比例为4/8=50%。这是由真实珊比调用支持的可观察差别。不能用只改速度或只加elapsed的替代程序假装等价。

控制器记录的恢复时钟、根Buff以及独立子Buff并非同一个对象。比如酒神仅修改神经恢复速度，神经敌方的独立麻痹另有消费规则。不能由恢复结束推导所有独立控制立即结束，也不能把标准配置压成只有时长和伤害两个数。

## 5. EP 自然回复的实际非零来源

完整安装输入扫描见 [rare-inputs.json](rare-inputs.json)：1180个Bundle、33411个相关MonoBehaviour，0解码失败；除字符串外也按type tree检查数字属性29，并解析内联 `SerializedState` JSON。命中为 globalbuff `ep_recovery`、恐鱼铃 `trap_038_dsbell` 的两个启用模式、Holder中的 `trpot_buff[tentcl]` 与 `yu_t_2[heal]`。后两者是更新属性的动作节点，不是 `attributes.attributeModifiers` 数组；只查数组会漏掉真实内容。

本批闭合的明确非零正例是余。角色原始数据配置人数阈值和 .015／.02比例；Prefab默认 Talent2由 `ProfessionCntToggleChecker`（PathID `-4131437825277186518`）控制。`LoadData` 94810以黑板 `cnt` 覆盖序列化默认阈值，附着／离场事件驱动重判。S3另将同一恢复模板作为GlobalAura赋给其他干员。

`yu_t_2[heal]` 在 .2秒周期内重新采样接收者的当前 MaxHP，再更新 EP回复属性，所以原生不是在Unit出生时永久固定其值。属性变更时 `Entity.OnAttributeDirty` 67699 先 `_UpdateEpRecovery(0)` 接续原timer，再按新的有效速率重设间隔或使timer无效。原生普通自然EP循环每次timer到期给类型1～5各+1，走 `SetEpInternal`，不构造普通 EP Heal。详见 [ep-regeneration-content.json](ep-regeneration-content.json)、[core-operations.json](core-operations.json)；`OnAttributeDirty` 全体引用同批 death-attributes 的 [attribute-recomputation.json](../death-attributes/attribute-recomputation.json)。

自然HP的本批复核复用 Case29／hp-regeneration-20261113：属性timer每1HP脉冲、保留已积累时间、变速时重设间隔、直接setter；它不走普通Heal事件。项目已明确选择按当前速率逐Tick回复小数且不派发普通Healing Hook，原生timer事实单独保留。

## 6. 溢出治疗、ES与独立屏障

`HEAL_CAN_GENERAL_SHIELD` 是 shared mask `0x400`。NewHeal／NewElementHeal构造器里的bool是 IS_CONTINUOUS，不是溢出开关。实际溢出分支由 `DoApplyModifier` 67683 读取该flag，再受当前 `maxEs` 限制；生命资源的精确差值、负生命偿还优先级见同批life原体，不能把 HP增量、ES增量和屏障增量混为一个值。

休谟斯目标自身 `humus_t_1` 在开始event0设置Character maxEsRatio，在event6的IsHeal后加flag；event47 `OnEsOverZero` 读取ES、累加并限制自身屏障池，再以 `DamageViaEs` 清掉临时ES。后续受击消耗的是 `BlockDamage` 的dynamic池。休谟斯Trait自疗明确 `_ignoreHealFree=true`；不能由此声称普通治疗都能绕过禁疗。

医生来源 `rdoc_t2[heal]` 在来源提交前 event61 给本笔治疗加flag，并给目标装 `rdoc_t2[listener]`。listener保存旧 maxEsRatio、临时提高ES容纳值，event47将ES转换为自己的屏障池并清ES。listener的event7在 IsHeal后调用 `CheckEntityEquals(BUFF_SOURCE, MODIFIER_SOURCE)`，同源才结束；结束程序恢复旧maxEsRatio。`CheckEntityEquals` 101876 读取双方实际Entity并使用Unity实体相等，**不是Card身份或效果组身份**。独立屏障的周期衰减／受击耗尽和临时ES监听的结束是两件事。

`OnEsOverZero` 为Entity67649→BuffContainer66440→Buff66190→Buff event47，不是一个专门“本次治疗溢出多少”的通知。不能用该事件名代替实际提交报告。原体在 [overflow-operations.json](overflow-operations.json)；生命层DoApply／ES setter引用同批life。

## 7. 满血通知：有消费者不等于已证明重复no-op必要

缇缇S3在致命预处理event27安装 `doze_indoze`，后者给目标UNDEADABLE、派生沉睡与自然回复产物；其event98在满血时结束，另有 .2秒的HP比例及沉睡存在检查。完整原生HP setter确实会在已满血时重复通知，但该内容正常入口为濒死，非满到满的那次通知已足以触发结束。

本批没有找到一个可达轨迹，能证明 `doze_indoze` 合法保持在已满血状态，且必须依靠后续+1HP的零实际变化通知才结束。故不把此消费者当作推翻已确认自然回复近似的依据，也不据此提出新Hook。若要主张改变契约，应先补可达轨迹。

## 8. 特殊恢复／初始化动作

`CopyHealth` 99015：`copyByRatio=false` 用来源 maxHP−HP，true用目标maxHP×(1−来源HP/来源maxHP)，然后构造无来源真实伤害、按配置设置skip并施加。它没有先读目标当前HP来求“目标HP−期望HP”，所以不能作为任意时刻的通用拷贝接口。`dsdivi_tr_1` 在创建对象链上施加 `dsdivi_tr_1[copy_hp]`；其ratio模式为true。卫戍两种 `acstma/acstmb` 的转换链用false。创建／转换时新目标的状态是语义的一部分。

`HealCurrentGiantBossViaMaxHpRatio` 99895仍是NewHeal＋可选溢出flag＋ApplyModifier。`trap_056_sfsuifire` 的Aura（PathID `4514430745249233746`）实际装 `trap_sfsuiball_devour`，目标validator要求 `enemy_msfsui_mask`；模板触发巨型Boss治疗。`_GetCurrentGiantBoss` 99897从UnitManager选择有效Boss，不应在Core中引入专用恢复资源种类。该内容的maxEs来自GiantBoss自身getter，和医生／休谟斯Character maxEsRatio不是同一来源。

`AtkToHpRecovery` 98997是将ATK×比例写成回复属性修改；不直接产生Heal。万顷实际S2使用 `wanqin_s_2[hp_recover]`；普通Bard类的持续回复也应与瞬时治疗分开。完整方法及字段见 [special-recovery.json](special-recovery.json)。

### 喷口：按差量同步，不是CopyHealth

`SetHpSameToSource` 102151读取来源HP−目标HP；相等直接成功返回，不构造零Modifier。不等时用差值构造 `Modifier.NewHp` 72184，按节点参数加入非致命mask8、skip mask0x80，再调用目标ApplyModifier。完整体见 [hp-synchronization.json](hp-synchronization.json)。

`NewHp` 对差值取绝对值作为value，并以原符号选择正向／负向Delta；不会把负差值当作负数治疗交给finalDelta截零。这也是它不能被CopyHealth或固定正向NewHeal替代的直接依据。

实际来源是“喷口” `enemy_4053_muejet`：Enemy根CommonAbility PPtr `8925333982436687758` 指向ToggleablePassiveAbilityGroup；checker `-5020798498992783474` 在重生期间关闭；Aura `213789113610436494` 的validator `3335830940454977422` 只选择 `trap_259_murjet`，并登记 `enemy_muejet_mark`。该模板给目标建立 `enemy_muejet_hp`，每 .03秒的event2先按来源更新目标MaxHP，再执行HP差量同步，nonlethal、skip均为true。**event0只记录原MaxHP，不能把它写成一次性的初始化赋值。** 目标装置根和完整公共Ability也已选入content.json。

固定 `act2multi/raftlevels/level_act2multi_raft_start-r-1.json` 包含该敌人EnemyDB引用，静态属性名称为喷口、3500HP；它是载具玩法相关输入。此处已闭合资源图与程序消费，尚未将该关卡的玩法创建入口等同于普通Wave出怪，也不以“船运寻路不实现”自行排除HP同步语义。引用存在与某场实战实际触发分别记录。

## 9. 明确保留的证据边界

- `ElementHealViaMaxHpRatio` 有完整普通native实现（99914），在本批1180包安装输入与9054模板范围未找到引用。此结果不是“已废弃”的证明；尚未证明运行时构造或XLua不存在。是否省略对应公共操作必须另获用户认可，不能以无命中自动排除自然EP回复。
- `AverageHealViaHpUseAbilitySelector` 的Holder命中只在 `legion_trap_cdrone_heal`；`HealSplitToUnionFindMembers`只在 `sandbox_v3_relic[paddy-share-heal]`／`sandbox_v3_xb2fmr2`。这些键指向排除模式的候选，**本批尚未用模式表或实际Prefab创建链确认归属**，不能仅凭前缀宣告“仅在排除模式”。完整native仍已提取，既不据此自动新增通用Core能力，也不擅自删除需求。
- `ON_BEFORE_TRY_SET_EP_ZERO=46`：`SetEpInternal`在输入≤0时先通知，然后才限幅与写入。当前全Holder唯一消费者为 `trap_creep_sanity_break[log]`，执行 `LogExtraBattleInfo`。无参数void通知不代表它能取消或改写EP；也不需要为统计程序直接创设资源提交Hook。
- 当前安装输入没有标准爆发时长0的配置；五型表均为正数。零寿命结论是给定0参数时的真实代码行为，不伪装成已找到0秒标准内容。
- 环境EP的构造flag14与齐尔查克实际免疫消费见同批 [damage/findings.md](../damage/findings.md)／[operator-bindings.json](../damage/operator-bindings.json)；不要把它当成另一个元素类型。
- 本文没有新批准任何简化或延期。已确认的Calculate／Apply边界、healFree仅Targeting、逐Tick自然回复、零输出与零实际变化政策继续按项目选择分别标注。
