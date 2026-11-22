# Damage 分类、权限与接收路径

核对日期：2026-11-14。完整来源指纹与复跑见[证据批次](../evidence/resource-mechanisms-20261114/damage/README.md)。生命提交见[案例11](11-damage-apply-and-hp-application.md)，死亡归属见[案例39](39-death-attribution-and-attribute-ranges.md)，全范围验收见[案例37](37-resource-mechanism-coverage.md)。


本记录是原生调查，不是 ArkBattle 的 API 方案。依据为证据批次固定指纹的当前 Windows 客户端、完整 Buff Holder、实际角色／技能 Prefab 绑定和固定版本的角色表；Wiki 用于交叉核对。没有执行客户端，也没有把 XLua 可替换入口的 fallback 当作线上实测。

## 1. 范围与证据层次

调查从 `Modifier`、`BattleFormula`、Damage 构造节点、接收节点、`DamageApplyConfig` 的 metadata 字段与方法开始，再追生产者、传播、消费者和实际内容。完整 Holder 扫描覆盖 9,054 个模板，返回 3,084 个候选定位；候选里的非默认值、启用过滤器和实际资源引用分别核对。模板存在、Prefab 层级存在、被实际 Talent／Mode／Skill 引用是不同证据层次。

数据文件：

- `inventory.json`：类型、枚举、字段及方法清单。
- `modifier-core.json`、`flag-callers.json`：Modifier 操作与直接 helper 调用者的完整逻辑方法体。直接调用定位经过指令边界验证；参数提示不替代控制流解释。
- `classification-producers.json`、`secondary-contracts.json`：攻击分类、公式调用政策和过滤器。
- `receiving-dispatch.json`、`receiving-actions.json`、`buff-missable.json`：目标接收至 Buff 动作的完整派发链和 Buff 可闪避字段的本类访问扫描。
- `holder-scan.json`：全扫描定位与选中模板的完整事件程序。
- `operator-bindings.json`：实际角色／技能／敌人资源组件、原始 PPtr、对象指纹和角色表选型。
- `resource-bindings-search.json`、`literal-consumers.json`：范围明确的负例搜索，不能据此宣布机制废弃。
- `dynamic-classification.json`：完整517资源文件的相关类型字段解码，不以角色样本的默认值推断开关未使用。

生息演算、保全派驻、船运寻路不纳入所需玩法正例。相关模板仍保留定位，明确标出，不能用于证明普通战斗需要该路径。

## 2. 四个独立分类不能混为一种伤害类型

| 维度 | 当前原生枚举 | 已验证的实际用途 |
| --- | --- | --- |
| `DamageType` | `NONE=0, PHYSICAL=1, MAGICAL=2, PURE=3, HEAL=4, ELEMENT=5` | 公式与接收过滤。`ELEMENT` 是扣 HP 的元素伤害，不是扣 EP 的元素损伤。 |
| `SourceAttackType` | `NONE=0, NORMAL=1, SPLASH=2, BUFF=4, ADDITION=8` | Filter、附加伤害和部分内容特殊判断；不是普通攻击／技能的区分。 |
| `SourceApplyWay` | `NONE=0, MELEE=1, RANGED=2, ALL=3` | 公式及接收过滤；不是 Unit 空地身份，也不是动画播放形式。 |
| shared flags | 独立的位集合，完整表见下节 | 环境来源、跳过事件、非致命、数值写权限、睡眠接收等。 |

`DamageTypeMask` 使用 `1 << DamageType`，所以物理 mask 为 2、法术为 4、真实为 8、治疗为 16、元素为 32。不能把枚举值直接当 mask。

### 实际分类配置

- 锡人 S1：`skchr_tinman_1` 根组件 `-3864122712601635940` 安装 `tinman_s_1[dot]` 与 `tinman_t_2`。前者 `NoSourceDamage` 为 MAGICAL／BUFF，后者只匹配 BUFF 再修正伤害。S2 的 HitEnemy／HitTile 也实际安装该天赋模板。这不是从模板名称推断 Buff 伤害。
- 仇白天赋：角色默认 Mode 的 PassiveBuffAbility `6278260286092620084` 安装 `qiubai_t_1`，事件 14 创建 `qiubai_t_1[damage]`；子模板 `DamageViaAttr` 明确为 ADDITION／NONE。S1 的 `qiubai_s_1[aoe]` 则是 SPLASH。
- 响石 S2：实际技能根组件 `4953579350423322503` 安装 `cairn_s_2[damage]`，`AdvancedApplyDamage` 使用 BUFF／ALL。`ALL` 有非默认的实际技能配置，不能因常见路径只有近程／远程便删掉。
- 佩佩、怒潮凛冬：实际攻击组件为 `MeleeAttackWithSplashDmg`。主目标和扩散节点分别写 shared flag 19／20。怒潮凛冬天赋 1 的 `headb2_t_1[damage_scale]` 只对 flag20 分支缩放，S3 也分别检查 19／20。
- 泥岩S2：实际技能根动作显式触发 `RollAttack`；该子对象 **8290759946353997940** 的真实脚本是 `MeleeAttack`，`_attackType=1`（NORMAL）、`_useDynamicAttackType=0`。当前 `MeleeAttack.get_applyWay #92334` 普通分支在 `0x180f5099b` 返回1（MELEE）。所以这笔范围反击是 **NORMAL／MELEE**，不因AOE自动归入SPLASH或BUFF。完整技能根8组件与原体、复提见[定向证据](../evidence/resource-mechanisms-20261114/damage/mudrock-s2-classification/README.md)；没有实机或有效XLua验证。

动态攻击类型并不是“当前是否发动技能”。`ApplyDamage._SetAttackTypeByMainTarget #99121`、`DamageApplyConfig._ResolveAttackType #102943` 在启用动态政策时比较本次目标与 mainTarget：相同为 NORMAL，不同或无 mainTarget 为 SPLASH；禁用则保留配置。

不能从少数角色的默认值推断该开关未用。完整517资源文件中，5,630个具有相关类型字段的对象全部解码，74个true、5,556个false，0错误。实际普通干员正例是奥达：Character根 `5738367271359756278` 的 modes 引用 Default `-4614659544937121802` 与 S2 `2488778428770170870`，二者分别引用攻击 `4602251123936671734`、`-5563051550404888586`，均为 dynamic=true；S1资源根 `-1230062449438609090` 也启用。角色表实际技能引用为 `skchr_odda_1`。完整 Holder 另有10个 dynamic 字段配置，均为false。原生分支有实际使用，不能省略这个独立政策。

### 现有标准爆发与地块输出的分类

下表对应项目现有八套Burst输出。攻击类型来自[实际根／子模板](../evidence/resource-mechanisms-20261114/recovery-elemental/templates.json)，不是按“爆发”或“周期”统一猜值。

| 当前输出入口 | 原生模板／子模板 | attackType／applyWay |
| --- | --- | --- |
| 角色神经，即时HP伤害 | `ep_break_sanity_char` | **NONE／NONE** |
| 敌人神经，即时HP伤害 | `ep_break_sanity_enemy` | NORMAL／NONE |
| 角色侵蚀，即时HP伤害 | `ep_break_water_char` | NORMAL／NONE |
| 敌人侵蚀，即时HP伤害 | `ep_break_water_enemy` | NORMAL／NONE |
| 角色灼燃，即时HP伤害 | `ep_break_fire_char` | NORMAL／NONE |
| 敌人灼燃，即时HP伤害 | `ep_break_fire_enemy` | NORMAL／NONE |
| 角色凋亡，周期HP伤害 | `ep_break_dark_char → periodic_magic_damage` | BUFF／NONE |
| 敌人凋亡，周期HP伤害 | `ep_break_dark_enemy → periodic_element_damage` | BUFF／NONE |

这些输出使用 `NoSourceDamage`；当前 #99151 在 `0x181103f1a` 置ESI为0，在 `0x181103ff1` 将其作为applyWay传给 `CalculateDamageByAtkNoSource`，所以是NONE途径。原体见 `damage/flag-callers.json`，不从“Effect产生”推定途径。

活性源石实际绑定的 `periodic_damage → NoSourceDamage(PURE, attackType=BUFF, isEnvDamage=true)` 同样是 **BUFF／NONE**，见[地块模板](../evidence/unit-audit-20261110/control-terrain/templates.json)。

深水敌方HP分支有实际绑定依据：[控制器原件](../evidence/unit-audit-20261110/control-terrain/components.json) `/result/26` 是 `sktok_tidectrl_3/Enemy` 的 GlobalAuraAbility（PPtr **3698421838164534390**），其 Buff key 为 `sea_drown[enemy]`，实际 template 为 `periodic_damage_without_modify_no_fx`，`triggerInterval=1`；不能将 Buff key 当成 `trap_sea_drown[enemy]` 模板名。[Holder原件](../evidence/resource-mechanisms-20261114/damage/holder-scan.json)中该实际模板明确配置 `NoSourceDamage(PURE, attackType=BUFF, ignoreForSp=true, damageWithoutModify=true, isEnvDamage=false, isNotChangeableValue=false)`，因此为周期真实HP伤害，分类 **BUFF／NONE**。**原生 `isEnvDamage=false`，不能仅因来自地形就认定为环境伤害标签。**

我方分支 `trap_sea_drown[ally]` 的周期节点另为 `ApplyElementDamage(WATER, isEnvElementDamage=true)`，即侵蚀EP损伤；它不能用于否定上述敌方HP分支。[DC-3](https://prts.wiki/w/DC-3)亦明确记载敌方每秒40点真实伤害、攻击速度降低60%、移动速度降至60%，与这类敌方深水行为相符。

### 过滤器并不共用一种位运算含义

`FilterDamageModifer #101507` 的 AttackType 条件为 `(input & filter) == filter`，不是任何位相交就通过。本次 Holder 中实际启用的这项过滤器使用单一 NORMAL／BUFF／ADDITION／SPLASH 位；不能据此改写组合 mask 的原生判断。ApplyWay 的 `NONE`、子集／位比较也应按各消费者解释，不能仅因它们都是 mask 就合并语义。

## 3. shared flags 完整清单

`SharedFlagIndex` 的 metadata 底层类型是 `short`。本表由两字节常量解码；编号是 index，实际 mask 为 `1 << index`。

| index | 原生名称 | 当前已证实的作用／证据边界 |
| ---: | --- | --- |
| 0 | `IS_CONTINUOUS` | `NewHeal`／`NewElementHeal` 的 continuous 参数写入；`Entity.OnAppliedModifier` 检查。不是所有治疗都走同一事件路径。 |
| 1 | `FORCE_TO_DISPLAY_NUMBER` | UI applied 消费者；展示选项不能自动推导为伤害接收政策。 |
| 2 | `FORCE_NOT_TO_DISPLAY_SP` | UI applied 消费者；与 `ignoreForSp` 不同字段，不能按名字合并。 |
| 3 | `DAMAGE_IS_UNDEADABLE_THIS_TIME` | 嵯峨 `saga_t_1` 事件11写入；普通 `Entity.DoApplyModifier` 将相应 HP 损失限制至至少1。派生提交者可能不执行这一分支。 |
| 4 | `DAMAGE_WITHOUT_MODIFY` | `NoSourceDamage` 等有明确写入参数；Holder `scale_damage_on_hp_less` 以它跳过一项缩放。该消费者尚无实际资源绑定，见未闭合项。它不是通用 value setter 的保护位。 |
| 5 | `IS_ENVIRONMENT_DAMAGE` | 亚叶天赋 `folnic_t_1` 启用 shared-mask 过滤并缩放 HP 环境伤害；齐尔查克实际光环模板也使用。 |
| 6 | `FORCE_TO_DISPLAY_NEGATIVE_NUMER` | 原生拼写如此；UI applied 检查。 |
| 7 | `SKIP_MODIFIER_EVENT` | `Entity.ApplyModifier` 有独立 skipped 路径；分担节点实际使用，不能理解为无条件跳过所有接收约束。 |
| 8 | `DAMAGE_CAN_HURT_SLEEPING_ENTITY` | 瑕光第二天赋实际安装 `blemsh_t_2`，事件11写入；`Entity.IsUnhurtableWithModifier` 消费。 |
| 9 | `LIFE_POINT_LOSS_BY_REACH_EXIT` | `BattleController` 全局生命点 Modifier 的标志；不是 HP／EP 伤害分类。 |
| 10 | `HEAL_CAN_GENERAL_SHIELD` | HP 治疗提交消费者与溢出护盾；已找到休谟斯等实际模板，治疗专项闭合。 |
| 11 | `FORCE_TO_DISPLAY_CRITICAL_NUMBER` | HUD DamageText 消费；怒潮凛冬 S3 实际设置。不能把强制暴击字样推成独立伤害公式。 |
| 12 | `ALLOW_ADD_TEMP_LIFE_POINT_FLAG` | 全局临时生命点接收；不等于 HP 治疗权限。 |
| 13 | `INSTANT_KILL_LIKE_DAMAGE` | `NoSourceDamage` 等可设置，HUD 与多个内容 Filter 检查。不是强制 `InstantKill` 操作本身；死亡专项另核。 |
| 14 | `IS_ENVIRONMENT_ELEMENT_DAMAGE` | EP 环境损伤来源与齐尔查克光环的独立消费者；不能和 flag5 互换。 |
| 15 | `SKIP_MODIFIER_CONSIDER_UNHURTABLE` | 在 SKIP 路径中**重新考虑**消失／不可伤资格；不是绕过不可伤。`ApplyModifier` 在 `0x180721353` 检查mask0x8000，未置则直接继续skipped，置位才进入消失与 `IsUnhurtableWithModifier` 检查。 |
| 16 | `IS_NOT_CHANGEABLE_VALUE_MODIFIER` | **`Modifier.set_value #72157` 本身拒绝写入**；`HpNoLessThanCertainPercentModifier` 可先解除再重设。与 flag4 独立。 |
| 17 | `IS_RETRIGGER_SKILL_USING` | 技能重触发的 SP Modifier，另有 UI 检查；不应一概列入 HP Damage API。 |
| 18 | `IS_CAST_SKILL_WITH_COST_USING` | `CastSkill` 等扣费 SP Modifier 的标志。 |
| 19 | `APPLY_TO_HAMMER_SUBCLASS_MAIN_TARGET` | 锤手实际主目标输出，怒潮凛冬有内容消费者。 |
| 20 | `APPLY_TO_HAMMER_SUBCLASS_SPLASH_TARGET` | 锤手实际扩散输出，怒潮凛冬有内容消费者。 |
| 21 | `IS_DEPLOY_COST_POST_DELTA` | 部署费用 Modifier 的传播标志；不是某种 HP 伤害。 |

表中 UI、全局资源和 SP 项仍属原生 Modifier 的真实语义，但不因此要求四种 HP／EP 操作都提供它们。哪些必要输入以 ArkBattle 何种方式表达，要由架构审查决定，本调查不裁掉它们。

### 实际绑定补充

- 嵯峨：Talent `-7569029876682738619` → PassiveBuffAbility `-1556272054020295611` → `saga_t_1`。
- 亚叶：`char_345_folnic/Others/Direction/Talents/1`，PassiveBuffAbility `7145696445386126787` → `folnic_t_1`；其 Filter 的 `_filterSharedMask=true`，不是未启用字段的默认 flag。
- 瑕光：Talents/2 PassiveBuffAbility `-8944484619005244114` → `blemsh_t_2`。
- 齐尔查克：Character `3544407240711701106` 的 commonAbilities → ToggleablePassiveAbilityGroup `-3626189131675893134`；checker `-8697591171134750094` 查询 `char_chilc[active_talent]`，再启用 Aura `2240213445508825714`。天赋1组件 `6710562461065183858` 实际安装该 marker。光环 `char_chilc[immune_env_dmg][include_element]` 先检查 flag14，再检查 flag5，分别 Cancel。不是无条件常驻免疫。

## 4. 取消权限、数值权限、接收资格是三个独立问题

`CancelReason` 为 NONE／UNHURTABLE／MISS／BLOCKED／BLOCKED_WITH_DAMAGE_NUMBER／INTERRUPT／HIT_FAILED／MINUS_HEALTH，对应0..7；`CancelReasonMask.NONE=0`，其余命名项为相应 `1 << reason`。`ignoreMissFlag` 按 DamageTypeMask 选择，`ignoreCancelReasonMask` 按取消原因选择。

`Modifier.Cancel #72160`：已取消则失败；调用 `CheckIgnoreCancel #72161`；通过才写取消类型和原因并返回成功。取消不把 value 清零。被取消的 Modifier 仍保留原始／当前输出量供后续程序观察，不表示还会正常扣除该 amount。

`CheckIgnoreCancel` 先检查 `_CheckIgnoreMiss #72162`：仅 MISS 原因会按当前 DamageType 与 ignoreMissFlag 过滤，然后再检查 reason mask。类型改变后按最终 DamageType 判断，物理豁免不是法术豁免。

`Modifier.set_value #72157` 在 `0x18090eca7` 检查 flag16（mask0x10000）。存在则直接返回，不执行数值写入。`HpNoLessThanCertainPercentModifier #100255` 在 `0x181177239` 检查同一标志。2026-11-22 补核了两条完整分支：标志已存在才暂时解除并在改值后复原；未设标志的普通请求在 `0x1811772bd` 写值后直接返回，随后仍可以改值。煌的 `huang_t_1[lock]` 对应事件只执行该节点。 [标志分支与实际模板](../evidence/resource-observers-20261122/README.md#锁血只保留原有数值权限)

集成战略收藏品“他缚”实际部署后施加 70% 当前生命的无来源真实伤害。`rogue_6_char_loss_hp` 设置 `_isNotChangeableValue=true`，保留普通接收，取消原因未设限制。该请求进入后续接收之前就持有标志 16。它补足了实际固定输入的正例，尚未证明煌正处于锁血期间收到这笔伤害，或锁血临时解锁后的数值被另外一项实际伤判消费。 [主题表、模板与设置指令](../evidence/resource-observers-20261122/README.md#锁血只保留原有数值权限)

非致命 flag3 在普通 Entity HP 提交分支生效，但小说卷轴 `PropLikeEnemy.DoApplyModifier #78593` 会按 `hp-1` 提交一次命中，不走该普通分支。具体提交者的特殊路径见同批 `life` 证据；不能把一项 flag 的普通消费者当成所有目标的统一保证。

## 5. 伤判与反伤的实际程序

### 闪避与成功闪避通知

远牙第二天赋的 SkillSyncedTalent `3950863222984049299` → PassiveBuffAbility `7595340385069073043` → `fartth_t_2`，在事件8设置 PHYSICAL ignoreMiss。骋风 S2 的 ActiveBuffAbility `-6585418766489787390` → `wscoot_sk2[mode]`，事件11设置 ignoreCancelReasonMask MISS。两种权限确有不同的生产路径。

`Evade.Execute #98879` 的内部顺序是过滤 → RNG (`0x1810e69af`) → `Cancel(MISS)` (`0x1810e69dd`) → 成功才通知 `OnEvadeDamage` (`0x1810e6a27`)。

补核的实际闪避提供者是焰尾第二天赋 GlobalAuraAbility `4692429388277831716`：Buff key `flamtl_t_2`，template `evade_physical`，`isDamageMissable=0`；模板事件10只有 `Evade(PHYSICAL, ALL)`，没有额外权限前置节点。`Unit.OnTakeDamage #79019 → Entity.OnTakeDamage #67709 → BuffContainer.OnTakeDamage #66383 → Buff.OnTakeDamage #66152 → _IsActionValid #66091 → _RunActions #66232 / _RunActionsCore #66233` 的 fallback 中没有 ignoreMiss gate；`_IsActionValid` 只检查对应动作数组是否非空。另扫描全部242个 Buff 本类 file-backed 方法，`m_isDamageMissable(+0x1f1)` 只有 `Reset #66092` 的写入，未发现本类读取。因此不能用该字段补出一个该实际闪避 Buff 的“RNG前忽略”分支。

当前上述普通路径中，ignoreMiss 与 ignoreCancelReason(MISS) 均在 RNG 后的 Cancel 资格中生效。PRTS 对这两种机制有“前者不进入概率判断”的区别描述；当前 fallback 并未复现该区别。此为证据冲突，可能涉及版本或 XLua，不以其中一方覆盖另一方，更没有宣称线上实测等效。

焰尾的 `flamtl_t_1`／`flamtl_t_1+` 由实际 Talent PassiveBuffAbility 安装，事件15（成功闪避）登记下一次攻击 marker；其 Attack_T1／Attack_T1+ 的选择器和攻击程序使用该 marker。因此“随机通过”与“成功取消为闪避”不能混同，通知有实际后继内容。

### 抵挡及屏障

`BlockDamage #99230` 在 `_showDamageNumber=false` 时先检查取消原因 BLOCKED 的权限 (`0x1810fa0c7`)，true 时检查 BLOCKED_WITH_DAMAGE_NUMBER (`0x1810fa0fc`)；若禁止相应取消，跳到返回失败，早于自身动态额度消耗。这个普通节点不支持“即使不能被抵挡，也必定先消耗该节点护盾量”的通用结论。

泥岩的实际 Talent → PassiveBuffAbility `4005481957556965552` 安装 `mudrok_t_1[init]`／`[recharge]`，二者创建 `[shield_a]`／`[shield_b]`／`[shield_c]`。实际盾模板事件10执行 BlockDamage，随后治疗、特效、结束或减层。`BlockDamage` 的成功返回决定后继是否继续，取消权限、计次消耗和回复不能随意拆开重排。

砾S2的实际 ActiveBuffAbility `-8092369471119681444` 安装 Buff key `gravel_s_1`、template `shield_atten`（原始命名如此，不因S2便擅自改成s_2）。模板事件10的 BlockDamage 启用 `_useDynamicVar=true`／`_allowNegativeDynamicVar=false`／`_showShieldUI=true`，然后按 dynamic 是否耗尽结束；事件2另有动态额度衰减。这闭合了数值屏障的当前资源正例，不只依赖一个通用节点字段存在。

2026-11-22 补核星熊 Y 模组。实际二级、三级资源配置使用 `hsguma_e_002_t`，其中 `ON_BLOCK_DAMAGE` 负责附加攻击增益。原生 `BlockDamage.Execute` 中原因 3、原因 4 两个成功分支在返回前调用同一个 `Entity.OnBlockDamage`。该模板不按取消原因或抵挡提供者过滤，所以两种成功抵挡触发相同的增益。维吉尔狼群分别识别两个原因，但两者均跳过失去狼的后续。 [模组绑定、派发与原因过滤](../evidence/resource-observers-20261122/README.md#星熊-y2y3-消费独立的成功抵挡)

### 分担和反伤

浊心斯卡蒂 S1 的 Aura `-8317465033843690151` 安装 `skadi2_s_1[protect]`。事件10先 `DamageSplit`，再对原伤害执行 isOneMinus 的 DamageScale。`DamageSplit #99255` 使用无来源公式入口 (`0x1810fed93`)，设置 skip flag7 (`0x1810fedff`)，同步执行新请求 (`0x1810fee16`)；外层缩放发生在嵌套返回后。分担不是单次 HP 减法的拆账，实际含新的同步接收。

玛恩纳第二天赋的 GlobalAuraAbility `698888525428027683` 安装 `mlynar_t_2[inverse]`。事件10 `InverseDamage` 配置 PURE、NORMAL、`hasSource=true`、`skipSourceEvent=true`、`skipModifierEvent=false`、`filterModifierCancelled=false`。反伤可能保留来源但跳过来源输出通知；不能用“有来源／无来源”一个布尔值同时代表计算、归属和事件政策。

## 6. 公式入口与缓存输入

`BattleFormula.CalculateDamage` 显式接受 `triggerTargetEvent` 和 `triggerSourceEvent`。当前节点 helpers 的真实组合：

| helper | 来源 | 目标公式事件 | 来源公式事件 |
| --- | --- | --- | --- |
| `CalculateDamageByAtkNoSource #79615` | null | 是 | 否 |
| `CalculateDamageByAtkWithSourceNoOnCalDmg #79617` | 保留 | 是 | 否 |
| `CalculateDamageByAtkWithSourceOnCalDmg #79618` | 保留 | 是 | 是 |

来源存在与来源事件触发并非同义。仇白天赋的子模板实际进入 DamageViaAttr → #79617，保留目标公式处理而不再次触发来源公式事件，不能把所有附加伤害直接当成重复执行同一完整计算。

`CalculateCachedAtkDamageFromProjectile #79616` 在来源存在时先执行 `OnCalculateCachedProjectileDamage` (`0x180b3f7b9`)，再使用已缓存输入，进入 targetEvent=true、sourceEvent=false 的公式调用 (`0x180b3f812`)。其可选参数还可以清除公式来源。这不是完整来源状态快照：缓存的输入与后续当前目标、防御／抗性、来源穿透及事件选择必须分别分析。旧 Case18 的实际弹道来源退场例证可复用，但不能因此宣称发射时采样全部属性。

`CalculateDamageNoEvent #65899` 仍会计算防御／抗性与相应穿透，和直接应用已计算伤害不同。弱点分支的原生静默比较与 ArkBattle 已确认的双完整 Calculate 是项目选择，不在本次调查中撤销。

### Modifier 复制不是一个统一操作

`Assign #72163` 只复制 targetType、deltaType、value、source、target、originalSource、ignoreForSp 等指定字段，不复制所有 flag／分类。`Split #72166` 先复制整个值类型 Modifier，再通过 value setter 修改分量；仍受数值写权限影响。构造器、Assign、Split 不能互换而假定传播结果相同。

锡人 S1 的 `NoSourceDamage #99151` 在 `0x181103ff5` 调用无来源公式，再按 `_setOriginalSource=true / BUFF_SOURCE` 在 `0x181104223..22f` 设置 originalSource，最后应用。Modifier.source、originalSource 与 Torappu.Battle.Context当前程序来源是不同事实；[Case 39](39-death-attribution-and-attribute-ranges.md)记录击杀来源的实际消费者，不能凭字段名称推定谁获得击杀。

### 心烛的实际来源不是 Schedule SPAWN

`enemy_5601_entlec` 是隐德来希的心烛，资源根为 `EnemyLikeNeutral`。应追实际召唤内容，而不是根据 `enemy_` 前缀要求关卡直接出怪。

补充的 `entlec-origin.json`／`entlec-templates.json` 闭合了普通干员的实际配置链：角色表技能3引用 `skchr_etlchi_3`；该技能 ActiveBuffAbility `-42568903513513161` 安装 `etlchi_s_3[switch_mode]`。Character `8272212950974201806` 的 S3 Mode `-2680197105679073330` 通过 generalAbilities 引用 PassiveBuffAbility `7988694513843634126`，安装 `etlchi_s3[create_entlec]`；它使用 SelectEnemy 创建 `etlchi_s3[to_enemy]`。后者的 `SummonEnemiesOnAttackRange` **明确配置** `_enemyKey="enemy_5601_entlec"`、`_summonCount=1`、`_unharmful=true`、`_waitTime=99999`。召唤产物的默认Mode与 `entlec_a[damage]`／`entlec_t[ensure_dmg]` 绑定已在 `operator-bindings.json` 中保存。

固定版本关卡 `act18mini/level_act18mini_sub-1-1.json` 的 `/predefines/characterCards/0` 提供隐德来希，但 `skillIndex=1` 是S2。因此该关卡只用作普通关卡提供此干员的交叉资料，**不**冒充S3施放或直接生成心烛的证明。S3的真实内容绑定来自上面的角色技能、Mode与召唤模板链。

## 7. 未闭合项与明确不能推出的结论

1. `DAMAGE_WITHOUT_MODIFY` 的唯一已定位缩放消费者 `scale_damage_on_hp_less` 存在于完整 Holder，但对517个已安装 charpack／enemy／battle prefab／config 文件的目标字节与对象搜索没有找到该模板绑定，metadata 字面量也未命中。全 Holder 中71个节点具有 `_damageWithoutModify` 字段，6处为true：`periodic_damage_without_modify`、`periodic_damage_without_modify_no_fx`、`enemy_hvyslr_drown`、`enemy_sgass[damage]`、`enemy_nscola[passive]`、`rogue_6_wooden_weather_2[cooldown]`。生产配置不等于该特定消费者正在实际使用。需要进一步来源定位或明确将其维持为未证候选，不能宣布废弃，也不能拿它作普通玩法必需机制的闭合正例。
2. ignoreMiss 与 ignoreCancelReason(MISS) 的 RNG 区别已核至普通 Buff 完整派发链，仍与 Wiki 描述存在冲突。要关闭线上行为差异，需要对应版本有效 XLua 或客户端运行证据；当前不代替用户选择保留或简化。
3. 心烛已通过隐德来希S3的实际召唤配置闭合，不能再列为“缺关卡SPAWN”的机制缺口；这条链本来就不是Schedule创建。仍未声称运行客户端复现或特定关卡实际施放S3。
4. `INSTANT_KILL_LIKE_DAMAGE` 的内容过滤器和写入入口已定位，强制死亡、当前上下文与击杀归属由同批 death 研究闭合。不能因为名字含 instant kill 就等同强制死亡。

这些是证据范围，不是推迟实现或简化的决定。本记录没有据现有 ArkBattle 实现选择删去任何原生需求。


## 8. 弱点及概率倍率的当前证据

当前指纹WeakDamage／AtkScaleUp、山真实ProbAdditionNextAtkTalent与附件、赤刃明霄陈loadFromDB到完整定义的链已补齐，结论集中在[案例10](10-weak-damage-and-critical.md)。候选atkAddition仍为零，与Wiki理论比较存在版本／热更证据边界；本页不重复维护两套弱点解释。

完整114条BuffDB按templateKey扫描未发现scale_damage_on_hp_less，补充了第7节flag4消费者的负搜索范围；普通弱点别名common_weak_damage则明确映射common_weak_damage_buff。二者不能只按同名buffKey查找。

## 9. 附加输出与接收资格分别判断

来源公式事件、攻击分类、是否进入普通接收及HIT回复许可是独立维度。附加伤害不能仅因名称就被解释为不受击，也不能仅因多一次Apply就推导所有计数均增加。

当前仇白附伤的实际配置为ADDITION、MAGICAL、skip=false、ignoreForSp=false；来源公式事件不派发，目标公式仍可参与。普通Apply经 `_OnApplyingModifier → get_isDamage → slot131 → Unit/Entity.OnTakeDamage`，没有ADDITION统一排除；get_isDamage按HP目标及伤害数学类型判断。HIT机会另检查目标SP类型、取消、ignoreForSp及SP回复停止状态；随后目标Buff继续按自身资格接收。完整门控、字段传播与独立复提见[补核原件](../evidence/resource-mechanisms-20261114/damage/addition-reception/README.md)。

攻击动作次数、每笔资源接收、HIT回复以及具体机制的计次分别由所观察的业务事实决定。原生没有在这条普通流程里提供一个可以统一代称这些含义的“段数”。架构审查应检查既有Calculate／Apply扩展点能否表达相应资格、是否收到必要事实；不根据原生字段数量增加项目开关，也不根据具体内容尚未接入判定流程缺失。

## 10. 取消原因的实际生产与消费

2026-11-14 补核当前客户端及完整9,054个 Holder 模板。原生原因枚举、成功写入、取消后的业务筛选、取消尝试权限和 UI 是不同证据，不能只因枚举存在就要求项目保留同名原因。原件及复跑命令分为[消费端](../evidence/resource-mechanisms-20261114/damage/cancel-consumers/README.md)、[实际内容](../evidence/resource-mechanisms-20261114/damage/cancel-content/README.md)、[特殊原因与未命中生产](../evidence/resource-mechanisms-20261114/damage/cancel-specials/README.md)。

### 直接消费者

| 消费者 | 已证判断 | 范围 |
| --- | --- | --- |
| `Entity.ApplyModifier #67665` | `0x18072163d` 在目标 BeforeApplying 返回后仅对 INTERRUPT(5) 提前返回。 | 该门之前的中断；在来源输出或接收阶段才写5，不会倒退到此门。 |
| `FilterModifierCancelReason #100276` | 与所配置的原因精确相等。 | 本体不限定资源，必须另核实际事件和绑定。 |
| `FilterDamageCancellation #101496` | 先检查 isDamage；未取消按 acceptUncancelled，取消按原因列表。 | HP 数学伤害，不是 HP Healing 或 EP 的统一消费者。 |
| `Modifier.CheckIgnoreCancel #72161` | MISS 专属忽略闪避政策，再检查具体原因 mask。 | 取消尝试的权限，不是已经发生的取消结果。通用 mask 能分别配置，不证明内容真的区分。 |
| `UIController.ShowModifierText #105936` | 入口限定 HP；MISS、HIT_FAILED 都显示 `miss`，但走不同呈现路径；BLOCKED 显示 `block`，BLOCKED_WITH_DAMAGE_NUMBER 显示 abs(value) 的数值。 | 这是 HP 表现差异，不是 EP UI 或独立玩法后继的证明。 |

getter 的直接调用核对上述消费者及 XLua 包装。Modifier 本类65个方法的取消字段 `+0x70` 扫描中，98处定位只有 getter／setter 两处标量访问，其余为整份 Modifier 的向量复制。本范围不等于全模块指针别名分析，也不排除有效 XLua。

### 已闭合的内容差别

- **阿斯卡纶 S3**：实际技能 → Mode2 → Aura／自身监听绑定闭合。敌方命中率属性33／34降低；自身 `ascln_s_3[self]` 在事件10仅对 HIT_FAILED 自疗，事件15另对成功闪避自疗。因此 MISS 与 HIT_FAILED 不能合并成同一类闪避。
- **塔露拉 S2**：`skchr_oxi_2` 的额外 PassiveBuffAbility 安装 `oxi_s_2_guard_manager`，接受未取消伤害及 MISS／HIT_FAILED 两种取消；抵挡、不可伤等不在允许列表。此处有实际技能和当前资源绑定，不只是通用过滤器可配置。
- **逻各斯 S1**：实际 Aura 处决模板的忽略原因 mask 包含 MISS、两种 BLOCKED 及 HIT_FAILED。权限与取消结果的不同用途分别存在。
- **伺夜狼影**：增强持有者存在且当前伤害达到 HP 时，监听先执行 `Cancel(NONE)`，再检查六类既有取消原因；若早已取消，Cancel 不能覆盖旧原因，后继被筛掉；本节点成功取消时，才继续自身狼层／恢复程序。这证明无指定原因的取消确有使用，不证明原生存在一套通用“HP 应用已被接管”协议。

完整 Holder 中共定位8个精确原因 Filter、1个列表 Filter、10个非默认忽略原因配置、131个 BlockDamage（17个显示数值）。已核对的狼影过滤把两种 BLOCKED 同样排除，相关忽略 mask 也同时包含二者；未定位只因两种 BLOCKED 的区别而产生不同玩法后继的实际配置。因此不能从通用 mask 能分别区分或显示数字的模板存在，推导它们必须成为两个领域原因；两者的表现差异仍真实存在。

### HIT_FAILED 的采样属于来源攻击

`AbstractBasicAttack.OnCastStart #92299` 按攻击类型读取来源的物理／法术命中率，低于1时抽样，失败写入 Ability.damageMissFlag；`OnCastEnd #92300` 清除。`Projectile.Init #72512/#72514` 复制该标志。`Entity.OnTakeDamage → _VerifyAbilityDamageMiss` 读取当前 Ability／Projectile 的标志，取消为 HIT_FAILED(6)。

物理／法术命中率 getter 分别读取属性33／34，与阿斯卡纶 S3 实际降低的两项属性对应。这是来源本次攻击的未命中，采样范围和目标 Evade 节点的 MISS 不同；不能在每笔 Damage 中把两者重新抽成同一种概率。

### NONE、INTERRUPT 与 MINUS_HEALTH

`CancelModifier.Execute #100273` 原样把节点 `_reason` 传给 Cancel，不把 NONE 改成其他原因，且该节点返回 true，不以 Cancel 是否成功决定返回。Cancel 普通路径把 deltaType 设为0并写入原因；`get_isCancelled #72132` 对 deltaType 为0返回 true。因此 **NONE 不表示未取消**。上述狼影就是实际使用。

INTERRUPT 有具体写入：`enemy_wdsdw[loss_hp]` 在目标事件5对特定来源的 EP Modifier 中断；`immune_env_damage` 在事件5中断环境伤害；普通活动关卡实际生成的小号手，其来源事件8中断原输出后自行产生 AOE；另有目标事件10中断后切换模式／触发敌人技能。只有在前述早退门之前写入，才享有该门的后继省略；不能将枚举5统一解释为任意时点都停止同一套事件。项目既定 Calculate／Apply 边界不由这些原生时序覆盖。

MINUS_HEALTH(7) 出现在枚举和狼影未排除的剩余空间中，但本次全部 Cancel 直接调用生产者（30个调用、21个方法）及完整 Holder 的 CancelModifier 配置，未定位实际写7的普通路径。未排除一个值不是该值被生产的证据，也不能据此解释成狼影的普通扣血结果。当前不宣称它已废弃或全客户端不可达；间接调用、其他字段写入和有效 XLua 仍是证据范围之外。

### 资源边界

- HP Damage：上述具体内容的 MISS、HIT_FAILED、抵挡、无指定原因取消，以及不可伤与中断均有对应证据。
- EP Damage：`OnTakeEPDamage #67711` 对 EPFreeAll 取消为 NONE、对不可伤取消为 UNHURTABLE；另有上面的事件5中断正例。2026-11-22 在固定镜像的 8662 条模板递归查到八个 `FilterModifierCancelReason` 节点，均在 HP 专属的 `ON_TAKE_DAMAGE`。在本表中没有找到 EP 对具体原因的消费者。 [检索范围](../evidence/resource-observers-20261122/README.md#取消原因与-sp-方式的固定表检索)
- HP Healing：`OnTakeHeal #67710` 的 HEAL_FREE 路径取消为 NONE。项目接收政策见 [Resource](../../architecture/resource.md)，不由本证据直接生成治疗的全部原因集合。

## 11. 接收前置、普通 HIT 与伤判

2026-11-15 补核。问题是原生机制要求哪些接收机会及顺序，不从 ArkBattle 当前 Content 接入数量或公开 Hook 名称推导必要性。[专项证据](../evidence/reception-stages-20261115/README.md)包含当前指纹84个完整方法、全metadata接收／SP虚派发覆盖，以及完整9,054模板的事件5／6／10扫描；三个时点分别有20／59／650个程序，3,107个节点，0解析错误。配置存在、实际绑定及方法控制流分别核实，未执行游戏或有效XLua。

### 原生的实际边界

普通入口先要求目标 alive、输入尚未取消；force不绕过这两个条件。后续链为：

```text
目标事件5：接收前程序
→ 若此时为INTERRUPT，整次Apply早退
→ 来源事件8；本笔为HP伤害时再执行来源事件11
→ 目标事件6：通用接收程序
→ 各资源专属资格与接收
    HP伤害：消失则提前退出；否则不可伤／来源未命中 → 普通HIT回复 → 目标事件10
    HP治疗：禁疗检查与受疗通知
    EP损伤：EPFreeAll／不可伤 → 目标事件68
    EP治疗：没有独立专属接收分支
→ 取消复核
→ 来源事件61
→ 提交与后置
```

事件5、6接续的是同一份可变 Modifier，能改变数值、取消、分类和权限，也能执行业务；它们不是纯 void 通知。来源输出位于这两轮目标程序之间，不能把原生各阶段仅按名称直接映射为项目接口。完整地址、参数传播、force／skip及四类资源差异见[调用链说明](../evidence/reception-stages-20261115/pipeline/findings.md)。项目已有的 Calculate／Apply 分离、取消后继续、HEAL_FREE仅限制Targeting等选择，不由此静默撤销。

### 普通 HIT 与 Receiving 的组织

`Entity.OnTakeDamage #67709` 先处理不可伤、来源HIT_FAILED，再由SP controller判断当前伤害未取消、允许回SP及回复类型，随后派发目标事件10。因而早期取消可阻止普通HIT回复，事件10中的闪避／抵挡则不回滚此前回复。原生普通不可伤取消后仍派发事件10；消失路径提前返回，两者不能按同一资格结果概括。

沿 `SpController._RecoverMp #67752 → Entity.set_sp #67439 → SetSpInternal(slot113)` 补取全部虚覆盖：普通Entity只检查资格、按MaxSP限幅并写SP，Trap覆盖可转发关联对象；未见在该恢复路径同步触发技能、安装Buff或通知Content。因此这里证明的是“HIT先于普通伤判”，没有证明必须存在独立公开的 receivingStarted Key。项目可以用同轮高优先级Receiving表达这项先行业务；不能凭假设的候选新增或同步回调保留另一轮派发。

### 实际内容及可观察区别

实际组件、Buff key与template对应、原表和关卡见[配置调查](../evidence/reception-stages-20261115/content/README.md)。以下不以模板名称猜测角色、模式或是否实际启用。

| 实际内容 | 已闭合的执行链 | 对时点的约束 |
| --- | --- | --- |
| 浮空信件 `enemy_10231_agpack` | 实际Talent／PassiveBuffAbility安装 `agpack_t[record_damage_cnt]`；原表MaxSP=5、初始0、自然增量0。事件5对符合来源、位置等条件的HP／EP请求加计数，满5时安装无敌、插入消失／出现／等待路线并清SP。`act53side_01`等23关有实际SPAWN。 | 达阈值这一笔先改变宿主资格，再进入后续专属接收检查；不能先按旧状态完成准入，再把这项前置业务当成普通伤判。 |
| 纯烬艾雅法拉S2的范围元素屏障 | 实际Aura安装事件6反应与公共盾池；其目标Validator没有EPFreeAll／Burst排除，反应Buff也无对应停用配置。事件6的 `BlockElementDamage #99225` 在后续EPFreeAll检查前扣盾池、改变本笔value，自身不检查Burst或EPFreeAll。 | 取侵蚀恢复中的存活干员，在范围内新获得有效正额度屏障，再接收超过剩余盾量的正EP请求：先扣盾、减小本笔value，剩余部分随后被EPFreeAll拒收，EP不变。若把屏障统一移到准入后，就会漏掉这次消耗。完全吸收时则由value归零成为取消，不能将其误说成EPFreeAll才取消。此为实际配置与完整fallback的组合推导，未作实机观测。 |
| 菲莱S1、S2及天赋 | 实际Skill／Talent绑定事件6程序：S1提供元素屏障；S2收到元素请求后安装攻击增益；天赋对元素请求减量、对凋亡请求另尝试回SP。 | 资格前接收既有数值处理，也有独立业务，不能把所有前置程序统一当成纯资格谓词，或只保留VOID通知。各程序自己的类型／取消／SP资格仍须执行。 |
| 蒂比S2 | 实际S2 CastSkill与同根ActiveBuffAbility的被动Buff安装 `tippi_s_2[trigger]`；事件6依次检查伤害和模式、尝试发动技能，再对物理／法术执行Evade。天赋1另安装 `tippi_t`，其事件10无取消过滤，直接操作计时Buff。 | 技能触发与闪避确实配置在普通HIT和伤判之前；但不能仅据此声称整个事件10被跳过，见下述来源差异。 |

EP恢复资格的组合依据复用[当前控制器原件](../evidence/resource-mechanisms-20261114/recovery-elemental/burst-controller.json)：`_StartEPRecovery #67762 → set_isInBreakRecovery(true) #67755` 登记EPController属性修饰，其 `get_abnormalFlagMask #67766` 提供 `1 << 21`（EPFreeAll）；恢复结束只移除自身修饰，不清理外来Aura。屏障例要求Aura正常有效、盾池仍有正额度，不能以已经耗尽的屏障构造例子。

### 来源差异与范围边界

[PRTS蒂比](https://prts.wiki/w/蒂比)记载S2闪避后不再执行伤判，包括第一天赋计时；[社区讨论](https://prts.wiki/w/话题:Ytavkwvywob1ug8x)也区分它与普通闪避。但当前完整fallback在事件6后没有统一取消早退，`get_isDamage`只看目标与数学类型，Unit及其接收虚覆盖也没有能撤销先前事件10的前置门。实际 `tippi_t` 的事件10本身没有取消过滤。该具体计时表现尚未由当前静态链复现，不能把社区概括直接补成当前fallback中未见的统一早退；有效XLua及实机结果保留为明确证据边界，不以此否定其已绑定的早期技能程序。

2026-11-22 补核 `enemy_wdsdw[loss_hp]` 的实际出场。关卡文件 `main_12-18` 出生的变形者集群在第二形态启用 `syncAttackWithSummon`；实际弹道 `projectile_enemy_wdslm_p2s2` 通过 `SummonEnemiesOnTargetTile` 召唤 `enemy_1323_wdbshd`。子 Prefab 的实际天赋引用该模板。前置程序先按 `MODIFIER_SOURCE` 的 `ENEMY` 阵营过滤，再对 EP 取消为 INTERRUPT。玩家干员的普通 EP 请求因阵营门控不会进入这一取消分支。仍未找到实际被该中断省略的来源 EP 输出后继。 [出场与天赋](../evidence/wdslm-ep-interrupt-20261122/README.md) · [阵营条件原件](../evidence/resource-observers-20261122/evidence.json)

`enemy_wlrage_t_check` 尚未闭合直接出场。`immune_env_damage` 绑定巨翼兽，既有 sandbox 也有玩法归属未核实的 act1arkhub 记录。完整索引与未闭合项保留于配置记录。

### 项目对应

资格前的可变工作值、普通 HIT 与伤判的组织见 [Resource](../../architecture/resource.md)和[Hook](../../architecture/hook.md)。原生事件5／6／10证明不同的业务条件与机会，不要求项目按函数数目复制公开 Key。
