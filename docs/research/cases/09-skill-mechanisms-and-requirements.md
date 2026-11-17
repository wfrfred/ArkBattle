# Skill 机制与需求核对

核查日期：2026-10-15；2026-10-29 补核数值修正协议，见 2.5；2026-11-10 补查启动结果的实际消费，见 3.3。本文先确定业务机制和需求，不固定 Definition、实例、Hook 或 API 的最终形状，不修改源码。案例用于检验协议表达能力；具体内容接入范围仍按项目已有约定处理。

## 1. 来源与证据边界

本轮直接核对 PRTS 的技能、异常效果、代表干员、敌人技能及卫戍帮助页面。PRTS 的概括与干员备注应一起读取；下文保留特例，不将页面通则推广为无例外的不变量。

官方客户端的既有原生证据见 [05 Skill 开始与结束](05-skill-start-and-finish.md)、[08 Action 启动资格与中断](08-action-eligibility-and-interruption.md)及对应 JSON。本轮重新核对本机 DLL / metadata 指纹；原生静态分析与 Wiki、项目设计分别记录。未运行官方战斗、未验证实际 XLua 热更新覆盖。

### 本轮官方客户端复查

本轮持久证据见 [skill-mechanisms-20261015.json](../evidence/skill-mechanisms-20261015/records.json)。DLL SHA256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`，metadata SHA256 为 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`，与 10-13／14 证据相同。独立解析 metadata v29、方法指针和字段偏移，对既有反汇编中的 109 条直接调用核查当前 DLL 的 E8 指令及相对位移，全部匹配。

这使既有普通分支证据继续适用：Ability 开始先登记 casting；结束先清理 casting／协程，再执行结束业务；BasicSkill 的宿主结束会中断 Ability；已经进入的同步行为列表没有通用逐项存活检查。

本轮还独立定位到下列结构；方法名和字段存在只证明区分，不能独自证明所有调用顺序或具体内容配置：

| 事实 | 当前客户端定位 |
| --- | --- |
| Skill affecting 与 Ability casting 有不同入口 | `BasicSkill.get_isAffecting` 72608，`0x18095fc50`；`Ability.get_isCasting` 63037，`0x1805d7e90` |
| Skill、施法、攻击结束分开处理 | `OnCastFinish` 72704，`OnSkillEnd` 72667，`OnAfterAttack` 72683；`_earlySkillFinishAtAttackFinished`、`_stopAffectOnInterrupt`、`m_waitForSkillEnd` 为独立字段 |
| 二次操作有独立资格及执行入口 | `IsOpRetriggerable` 72600，`IsRetriggerAvailable` 72602，`RetriggerSkill` 72669 |
| SP 时间、攻击／治疗输出和受击有独立入口 | `SpController.OnTakeDamage` 66748，`OnOutputAttackOrHeal` 66749，`UpdateSpRecoveryPerSec` 66750，`OnTick` 66751 |
| 生效期间回复不是仅由一个 active 布尔值说明的概念 | BasicSkill 具有 `_allowSpRecoveryWhenAffecting` 配置字段；具体启用内容及规则仍需引用链证明 |

上述首次复查没有重新完整解码所有方法。随后针对 SP 公式、计时器与阻回完成了新的原生反汇编，见下文及 [SP 原生证据](../evidence/sp-calculation-20261015/records.json)。负弹药等未在此次原生范围内的机制仍依据注明的 PRTS 来源。首次复查的两份专用提取／复核脚本没有归档，持久 JSON 仍保存当时输入与调用核对结果；当前可复查范围和命令见[Skill 机制批次](../evidence/skill-mechanisms-20261015/README.md)。

## 2. SP 机制

| 机制事实 | 可以确定的需求 | 来源 |
| --- | --- | --- |
| SP 是整数；自然回复保存独立的冷却进度。阻回或满 SP 时，剩余进度保留并暂停。 | SP 数值与自然回复进度分别保存；暂停期间不累计待补回复，满槽不自动清零进度。 | [技能：技力需求](https://prts.wiki/w/技能#技力需求) |
| 攻击回复通常按攻击取得；连击及剑豪有不同规则。部分伤害明确禁止触发受击回复。 | 回复接入可辨别的攻击／受击业务事实；不能按 Action 数、目标数或伤害次数统一换算。 | [技能：技力需求](https://prts.wiki/w/技能#技力需求) |
| 充能通常扩大储存容量；技力需求与实际消耗可以不同。 | 储存上限、启动门槛、支付量分别表达；充能次数可由具体规则解释。 | [技能：特殊属性](https://prts.wiki/w/技能#特殊属性) |
| 阻回与技力封闭是不同异常；强制修改另有政策。 | 区分自然回复、非强制增加与 modifier 修改的许可；active 或自然回复倍率为零不能替代这些事实。 | [异常效果](https://prts.wiki/w/异常效果#异常效果（AbnormalFlag）) |
| 森蚺的条件阻回、阻挡时回复增益，以及模组改变阻回并调整未阻挡时自然回复倍率，可以分别存在。 | 回复条件、自然回复速度、自然回复倍率独立并可组合；允许查询战场状态。 | [森蚺](https://prts.wiki/w/森蚺#特性)、[数值范围](https://prts.wiki/w/数值范围) |
| 外部提供 SP 也可能受阻回；有明确无视阻回的回复。 | 外部来源不天然拥有绕过限制的资格，特殊绕过有明确业务含义。 | [森西](https://prts.wiki/w/森西#技能)、[掠风](https://prts.wiki/w/掠风#技能) |
| 流明 S2 普通／蓄力启动消耗全部技力；薇薇安娜 S1 未蓄满时只扣最低需求。 | 支付不能固定为 spCost，也不能固定为所有蓄力技能一律清空 SP。 | [流明](https://prts.wiki/w/流明#技能)、[薇薇安娜](https://prts.wiki/w/薇薇安娜#技能) |
| 薇薇安娜 S1 达到蓄力阈值会尝试进入强化模式，直至下次技能结束；后续 SP 下降不必撤销已经形成的模式。 | 阈值跨越可以产生持续事实；当前效果不一定能仅由当前 SP 或启动时的一次采样推导。 | [薇薇安娜](https://prts.wiki/w/薇薇安娜#技能) |
| 玛露西尔有按攻击／爆炸逐次消费资源的技能；魔力还涉及跨部署保存及场下回复。 | 支付可发生在执行途中；激活内状态、携带期间状态和跨部署资源必须能分别保存。跨部署资源的具体归属另行设计。 | [玛露西尔](https://prts.wiki/w/玛露西尔#技能) |

### 2.1 SP 公式与计时器：新的客户端原生核对

DLL 与 metadata 的 SHA256 仍与上文一致。此次使用 Capstone 重新解析 metadata v29、Assembly-CSharp／Torappu.Common 方法表与字段偏移，直接读取本机 DLL 的指令；不运行客户端，也不将普通原生分支等同于已验证的运行时 XLua 覆盖。指纹、工具来源及 31 个相关方法的指令见 [sp-calculation-20261015.json](../evidence/sp-calculation-20261015/records.json)。

`Entity.get_spRecoveryPerSec`（`0x180708750`）分别读取属性 14 `SP_RECOVERY_PER_SEC` 与属性 30 `SP_RECOVER_RATIO`，通过 `FP.op_Multiply` 相乘。两个属性各自按通用属性计算并应用范围：

```text
attribute = clamp(((base + Σaddition) × max(0, 1 + Σmultiplier)
                   + ΣfinalAddition) × ΠfinalScaler)
effectiveRate = recoverySpeed × recoveryMultiplier
periodSeconds = 1 / effectiveRate    （effectiveRate > 0）
```

因此自然回复速度与自然回复倍率是两项独立属性；普通直接增加 SP 不套用这条自然回复公式。属性公式的原生位置为 `Attributes._CalculateAttributeValue`（`0x18064ad80`）；默认两个属性均为 1、下限为 0，亦可对照 [数值范围](https://prts.wiki/w/数值范围)。

`SpController.OnTick`（`0x18070a1c0`）在阻回或满 SP 时直接跳过计时器更新；否则由精确周期计时器计算完成周期数，再增加相应 SP。此路径保留暂停前的计时余量。

动态修改有效速度时，`SpController.UpdateSpRecoveryPerSec`（`0x18070a670`）先用零时间更新结清旧计时器已完成的周期；有效计时器随后调用 `PeriodicTimer.ResetButKeepPastTime`（`0x181e044e0`）：

```text
elapsed = previousPeriod - previousRemaining
nextRemaining = max(0, nextPeriod - elapsed)
```

保留的是已经经过的绝对计时时长，不是周期完成比例。

有效速度不大于零时，普通分支将计时器设为无效（周期和余量写为 -1）；以后恢复正速度且旧计时器无效时，使用 `Reset(period, true)` 从完整新周期开始。这与阻回／满 SP 保留余量的暂停语义不同。项目不需要复刻无效值 -1，但应保留这项可观察差异；浮点 epsilon 与约一 Tick 的响应沿用 README 的从简约定。

### 2.2 MODIFY 不隐含强制或无视阻回

`ModifySp.Execute`（`0x181041ca0`）具有独立的 `_forceFlag`（实例偏移 `0x24`），作为黑板布尔值的默认值传给 `Entity.ApplyModifier`。`Entity.DoApplyModifier`（`0x1806f1c00`）的 SP 分支明确区分：

| 操作 | 阻回 `SP_RECOVER_STOPPED` | 技力封闭 `SP_MODIFY_STOPPED` |
| --- | --- | --- |
| 普通 SP modifier，正增量 | 拦截 | 拦截 |
| 普通 SP modifier，负增量 | 不因阻回拦截 | 拦截 |
| 显式强制 SP modifier，正／负增量 | 绕过该检查 | 绕过该检查 |

原生位置：`0x1806f20ba` 的 force 分支、`0x1806f2127` 的异常 29 检查、`0x1806f2156` 的 force 分支，以及 `0x1806f2160` 至 `0x1806f21b9` 的阻回与负增量检查。自然／攻击／受击回复走 `SpController._RecoverMp`，此入口检查阻回后直接写 SP，不通过 modifier 的技力封闭检查。不能把所有资源变更按一个许可处理，也不能从 `MODIFY` 这个名字推导强制性。

PRTS 的[异常效果](https://prts.wiki/w/异常效果)与该区分一致。[森西](https://prts.wiki/w/森西#技能)的普通外部增加会受阻回影响；[掠风](https://prts.wiki/w/掠风#技能)则有明确无视阻回的回复。这不能证明 MODIFY 名称本身代表强制操作。

### 2.3 项目接口

SP、弹药、持续时间与通知的项目契约集中于 [Skill](../../architecture/skill.md)，本案不保留接口草案或实现变迁。

### 2.4 回复来源、支付与充能类型的收敛

客户端的攻击回复入口是 `AbilityStandard.OnOutputAttackOrHeal` → `Entity.OnOutputAttackOrHeal` → SP controller 的攻击来源分支，覆盖符合资格的攻击／治疗输出通知；并非只依赖对敌伤害，也不将每个 Damage／Healing 结算包视为一次触发。`OnOutputAttackOrHealEachSpell` 是另一通知入口，普通 Entity 分支只通知 Buff，不在此直接回复 SP。具体连击、剑豪等例外仍按内容核对。

特殊达标历史仍是实际需求：如薇薇安娜 S1 达标后改变攻击范围，SP 下降不自动退出直到下一次技能结束。这类内容用持久私有状态 S 记录事实并管理相应 Effect；不能将所有内容仅按发动时的当前 SP 重建。

### 2.5 数值修正协议补核：动态输入不等于有序变换

2026-10-29 补核。客户端 DLL／metadata 的 SHA256 与 2.1 一致；新增完整方法指令、字段偏移与输入指纹见 [native.json](../evidence/skill-modifier-20261029/native.json)，实际资源片段与 Bundle 指纹见 [content.json](../evidence/skill-modifier-20261029/content.json)。未运行官方战斗，也未验证运行时 XLua 覆盖。

**本轮结论：已核对案例需要动态数值、不同参数公式和明确业务操作，但未找到要求多个独立数值贡献按内容自选优先级串行处理前一个结果的组合。** 这不证明全游戏不存在顺序特例，也不证明 SP 容量、门槛、支付和 TIME 时长都采用 Attribute 四段公式。

#### 原生证据

| 方法 | 本轮直接核对的普通原生分支 | 能确定的边界 |
| --- | --- | --- |
| `BasicSkill._ApplyModifierToData` 72708，`0x18095e5e0` | 合并 `Delta.blackboard`，并按输入替换范围 ID。 | 名称中的 Modifier 不是本项目的数值 `apply(current)` 协议。 |
| `BasicSkill.PostprocessData` 72709，`0x18095d990` | 遍历 `m_behaviours` 并调用 Behaviour 的后处理；本轮定位的原生覆盖为 `SkillSubTalents.PostprocessData`，负责分配子天赋。 | 存在内容程序列表，不自动证明参数贡献按数值优先级组合。 |
| `BasicSkill.ModifyCostMinSp` 72712，`0x18095aec0` | 直接设置 `m_costMinSp`。 | 最低门槛可以独立修改；该操作没有贡献归并。 |
| `SpController.UpdateSpData` 66747，`0x18070a4f0`；`Entity.UpdateSpData` 66606，`0x1806feff0` | 提交已经选定的 SP 配置；`onlyUpdateSpCost` 决定是否同时替换类型、increments 并维护回复计时。Entity 还按 `SpData.maxSp` 设置容量。 | 这是配置写入及其业务维护，不是数值查询时依次调用贡献程序。 |
| `Skills.ModifySpDataAfterSkillCast` 84877／84878／84880 | 发动时保存旧 cost，设置配置的 cost；按 `_resetWhenSkillEnd` 在结束时恢复。 | 状态切换需要明确采样、写入和恢复操作。 |
| `Skills.SpScaleAfterSkillCast._ScaleSpCost` 84998，`0x180cef770` | 将现有 `SpData.spCost` 乘以配置的 `_spScale`，再调用 `Entity.UpdateSpData`。 | 施放后费用变化是按实际事件执行的业务，不等于每次查询都重新归并的贡献。 |
| `UnitDataFlowConfig.Modifier.Execute` 77853；`_ModifyBlackboard` 77852 | 使用有限的操作数据：赋值 `v`、加法 `b + v`、乘法 `b × v`、`1 + (b - 1) × v` 或字符串赋值。`b` 来自显式输入黑板或已采样的第二操作数；结果写入 Delta。其字段没有 priority。 | 支持以数据描述修正。本方法内部没有任意优先级排序；上游多个修改的调用次序仍不能仅据此判定。 |

自然回复速度与倍率仍以 2.1 的原生 Attribute 证据为准：两项属性各自按固定公式计算后相乘。项目可由提供者动态返回各公式项，再由领域归并；动态程序不必取得前一贡献算出的累计数值。

#### 实际案例及其证明范围

| 案例 | 本轮资源／既有机制证据 | 对设计的要求 |
| --- | --- | --- |
| 琳琅诗怀雅 | `skchr_swire2_1/2/3` 的附加组件配置 `_spCost = 0`、`_resetWhenSkillEnd = 1`；`swire2_t_1` 明列清空 SP 后修改 SP 的节点，S3 结束路径另行采样并清空。 | 原生复用 SP 承载金币；金币可以由 Content 私有状态管理，不能据这些节点直接要求项目切换普通 SP 配置。 |
| 玛露西尔 | `marcil_t` 事件 12 明列 `ClearCharacterSp → ModifySpData(mana_max, onlyUpdateSpCost = true, updateSkillSpCostMin = false) → forced ModifySp(mana)`；技能 Prefab 允许无 SP 发动，具体技能在内容事件中以负 `ModifySp` 支付。 | 出生配置、发动资格与途中付款分别处理；魔力是否复用通用 SP 是项目表示选择，不由原生存储位置决定。 |
| 雷狼龙 S 空爆 | 当时仅按技能说明讨论消耗充能与持续预算；后续 2.7 已核实先支付首层，再读取剩余 SP、清空并延时的完整链。 | 具体先后以 2.7 的真实绑定为准。 |
| 哈蒂娅 | `hadiya_s_2[extand_time]` 明列 `ExtendAbilityCooldown`，目标为 `S2Ability`，时长键为 `duration`，`_keepPassedTime = true`。 | 运行中延时由明确业务操作表达，不应借初始预算贡献偷偷结算。 |
| Fever | 既有行为资料区分发动许可、免付 SP、持续计时暂停／恢复；本轮只核对了专用环境 Prefab，未闭合修改发动参数的全部原生链。 | 不能把这些机制当成已证明的数值归并公式，更不能据此证明有序变换协议。 |

上述资源配置是内容证据，不代表已执行其全部路径。跨部署魔力、Fever 热更新政策及未闭合的具体调用仍保持各自未决范围。

### 2.6 继续补核：费用预处理、配置操作与持续预算

为确定 2.5 的边界，随后沿客户端 Rune、遗物及实际资源节点继续核查。新增完整指令与字段见 [parameter-operations.json](../evidence/skill-modifier-20261029/parameter-operations.json)，资源片段补充于 [content.json](../evidence/skill-modifier-20261029/content.json)。以下普通原生分支不能推广为运行时 XLua 或全内容组合的结论。

| 路径 | 直接核对的规则 | 所属阶段 |
| --- | --- | --- |
| 普通 SP 容量 | `SpData.get_maxSp` 32849：`spCost × maxChargeTime`。 | 根据明确配置派生容量。 |
| 启动门槛 | `BasicSkill.get_spEnough` 72632：配置了 `m_costMinSp` 时比较该门槛，否则使用 `data.spCost`，另有无 SP 发动许可。 | 发动资格，不查询任意数值变换列表。 |
| Rune 费用修改 | `CSkillCdAdd` 85329：`cost = RoundEven(cost + value)`；`CSkillCdMul` 85326：`cost = RoundEven(cost × scale)`。固定队列值分别为 500、501，因此先加后乘；每个来源都写回并取整。 | 角色创建前的配置预处理。 |
| Roguelike 遗物费用倍率 | `RoguelikeBattleManager.PreProcessCharacter` 85519 逐项遍历遗物，`CSkillCostMul` 85835 对当时的 cost 乘倍率并 RoundEven 写回。 | 逐项配置预处理，不是一次合并倍率后取整。 |
| 运行中 SP 配置变化 | `Nodes.ModifySpData.Execute` 96563：设置黑板提供的整数，或 `ceil(oldCost × ratio)`，提交 `Entity.UpdateSpData`；按配置另行更新最低门槛。 | 明确资源配置操作。 |
| Sandbox 费用倍率 | `SandboxV3RelicSpModify._ModifySpCost` 89161 及实际模板读取现有费用、按配置计算、向上取整并提交；部分模板在退出时恢复旧值。 | 安装／退出等内容事件，不是纯参数查询。 |
| 普通持续预算 | `ActiveBuffAbility.SetLifeTime` 90969 读取黑板 duration，并结合所附 Buff 时长求最大值；相关配置另可使其为无限期。 | 初始化具体 Ability 的持续事实，不能直接推导任意时长贡献都相加或相乘。 |
| 运行中延时 | `ExtendAbilityCooldown.Execute` 99674 取得当前 Ability 周期与黑板延长量，再调用明确修改入口。 | 实例已开始后的业务操作。 |

这里确实存在来源顺序和逐来源舍入，但不是可据此保留任意公共 `priority + apply(current)` 的理由。以说明用数值为例，逐项 `RoundEven(RoundEven(5 × 0.5) × 1.5) = 3`，统一合并后 `RoundEven(5 × 0.5 × 1.5) = 4`。不能把原生预处理不加区分地翻译成查询时的 Attribute 归并，也不能反过来用四段归并宣称复刻了这些预处理结果。后续接入对应玩法时，应按其真实阶段组织有限数据与明确操作。

实际卫戍表中的 `act2autochess_bond_eff_sunt` 带有 `sp_ratio = 0.7`，但本机资源尚未闭合它到具体原生操作的绑定；不得仅按键名认定其倍率、取整、叠加和恢复规则。多来源配置覆写、实际时长组合与各内容特殊支付仍按具体链路核实，不以统一 Input 类型替代这些调查。

### 2.7 原生公式复核：Ammo、SP 与具体持续时间操作

本节不从项目现有实现或测试反推游戏规则。重新核对后的 DLL 与 metadata 指纹仍与 2.1 一致；普通原生分支、实际内容绑定与数学推导分别记录。完整证据分别为 [Ammo 指令与类型](../evidence/skill-parameter-formulas-20261029/ammo-native.json)、[Ammo 实际内容](../evidence/skill-parameter-formulas-20261029/ammo-content.json)、[SP 配置与支付](../evidence/skill-parameter-formulas-20261029/sp-native.json)和[具体时长链路](../evidence/skill-parameter-formulas-20261029/duration-native.json)。未运行客户端，未验证运行时 XLua 覆盖。

#### Ammo 上限：固定追加与比例确有独立原生归并

`CastSkillWithLimitTimes._UpdateMaxAdditionCount` 72966（`0x180966d70`）有两份不同的字典：`Dictionary<uint, int>` 保存固定追加，`Dictionary<uint, float>` 保存比例追加。原生先分别求和，然后读取 `AbilityEventCounter.originalMaxCount`，只对比例部分取整，最后加入固定追加。

```text
B = 计数器原始上限 m_originalMaxCount
M = 计数器当前基础上限 m_maxCount（不是当前剩余弹药）
A = Σ 固定追加
P = Σ 比例追加

maxCount = max(1, M + A + RoundEven(B × P))
```

`AbilityEventCounter.SetData` 94243 从黑板的 `trigger_time` 或 `another_trigger_time` 初始化 M，并复制到 B；在这条普通初始化路径上 M = B，因此简化为 `max(1, B + Σaddition + RoundEven(B × Σratio))`。一般式与初始化特例分别成立，不能仅从本次路径声称 M 与 B 在所有内容中永远相等。

关键指令与辅助函数：

- 72966 的 `0x180966f21` 逐项累加固定追加，`0x180966fe2` 用 `addss` 累加比例；`0x1809670f8` 将原始 B 乘总比例，`0x180967120` 调用 `MathUtil.RoundToInt`，`0x18096712a` 在舍入后加入固定追加。
- `MathUtil.RoundToInt` 220338（`0x1866e6620`）调用 `FP.Round` 220463（`0x1866fc8d0`）；后者精确比较 FP 小数位 `0x80000000`，半数时按整数奇偶取舍，确为四舍六入五成双。
- `AbilityEventCounter.get_maxCount` 94230（`0x180f73b10`）最后执行至少为 1 的裁剪。

以下是指令公式的说明用数值，并非运行官方战斗所得：B = M = 10、固定追加 2、比例 0.5，结果为 17；把固定追加也乘比例则会得到 18。比例来源先求和、只取整一次，也不同于每来源独立取整或将多个倍率相乘。原生比例求和与乘法使用 float32，再转为 FP 后舍入；上式是数学表达，不隐去实际数值类型。

来源与采样同样已核实：

- 两个字典均按 Buff UID 登记；同 UID 再次登记覆盖该项，不是新增另一份累计来源。
- `AmmoSkillCountModifier` 的恢复路径提交零值；它不证明物理删除了字典条目。
- `SetMaxAdditionCount` 72982、`SetMaxAdditionCountPercent` 72983 在 Skill 已 affecting 时不立即重算当前 Counter。`_FetchCounterSource` 72965 在原引用缺失／失效后重新取得或绑定 Counter 时调用归并；已存在有效 Counter 时直接返回。因此不能描述为每 Tick 无条件重新计算当前弹药预算，也不能仅据此保证重新绑定的是全新实例身份。
- 实际隐现与蕾缪安等技能已通过当前 MonoScript 绑定到 `CastSkillWithLimitTimes`。隐现的友方光环候选要求拉特兰标签及 AMMO 持续类型；其 Buff 与蕾缪安自身追加使用不同键，配置支持不同来源参与，未执行实机共存验证。
- 本次扫描 `buff_template_holder.ab` 的全部 8,659 个模板：22 个 Ammo 计数节点中，12 个修改上限，均为固定追加；没有找到 `_addCountUsePercent = true` 的模板。这限定实际内容样例范围，不否定已由原生指令证实的比例入口和公式，也不证明其他脚本或 XLua 不会调用它。

因此，Ammo 的独立公式已取得直接原生证据；此前只能追到项目旧实现的证据缺口在此闭合。它的固定追加位置、比例来源求和及取整阶段都不能由普通 Attribute 四段公式替代。

#### SP：余额、配置、资格与支付分别有规则

| 路径 | 核实的普通原生规则 | 不能由此推导的内容 |
| --- | --- | --- |
| 自然回复 | 2.1 已证实两个 Attribute 分别归并后相乘。 | 普通 SP 增减、容量或支付也使用相同属性公式。 |
| 普通容量 | `SpData.get_maxSp` 32849：`spCost × maxChargeTime`。 | 任意容量贡献的通用归并。 |
| 发动门槛 | `BasicSkill.get_spEnough` 72632：`m_costMinSp >= 0` 时比较该值，否则允许按无 SP 发动政策跳过，或比较 `SkillData.spCost`。比较使用 `MathUtil.GE`。 | 门槛恒等于实际支付，或费用为零就自动获得发动许可。 |
| 实际支付 | `ReduceSp` 72702 接收本次整数费用，普通支付构造 `NewSp(-cost)`；零费用、无 SP 发动或具体虚拟政策可以跳过扣除。 | 一个通用 cost Modifier 自动覆盖所有特殊付款时点。 |
| 支付时点 | `CastSkill.DoCast` 72895 在 CastDirectly 成功后扣费；`CastSkillWithCost.DoCast` 72943 则先扣费，成功才调用 CastDirectly。 | 基类顺序适用于所有具体技能；内容真实脚本绑定决定所走路径。 |
| 余额写入 | `SetSpInternal` 66628／`DoSetSpInternal` 66631 在允许写入的普通分支执行 `clamp(value, 0, maxSp)`。 | 修改配置时就必然发生同一次余额写入。 |
| 配置提交 | `Entity.UpdateSpData` 66606 更新派生容量和 SP Controller 配置；已核对的普通分支不调用余额写入来清零或按比例换算 SP。 | 所有调用方也不处理余额；具体内容仍可显式清空、补入或消费。 |
| 费用倍率与替换 | 2.6 已证实 Rune／遗物逐来源取整及 `ModifySpData` 的明确配置提交。 | 将不同阶段折成统一四段贡献公式。 |

#### TIME：先写清本次具体运算及其发生时点

雷狼龙 S 空爆的 `catap2_s1[trigger]`／`catap2_s2[trigger]` 原始模板明确执行以下数据流：

```text
读取天赋的每层倍率 r
读取触发时当前 SP 为 S，以及单层费用 C
L = floor(abs(S / C)) + 1
Δ = abs(黑板 duration × r × L)
清空当前 SP
对 S1Ability／S2Ability 执行 ExtendAbilityCooldown(Δ, keepPassedTime = true)
```

这里的 `+1` 不能靠方法名猜测。当前原始 MonoScript 绑定显示，S1 使用 `CastSkillWithCost`，S2 使用 `RetriggerableCastSkillWithCost`；后者委托前者。72943 已证实先扣除一层费用，再开始对应 Ability，随后 BeginAttack 子 Ability 的 `BuffToOwner` 在 ON_CAST_START 安装触发模板。因此 S 是首层扣除后的 SP，`+1` 补计刚刚已支付的一层；不能直接把模板里的 S 当作发动前余额。原生执行的是具体技能启动过程中的消费和延时，不是对一个通用 duration 贡献列表求值。

哈蒂娅的 `hadiya_s_2[extand_time]` 则明确使用 `ExtendAbilityCooldown`，并要求保留已过时间。99674 读取当前周期 P 和黑板延长量 Δ，计算 `P' = P + Δ`，再调用 `UpdateCooldown`。`keepPassedTime = true` 对有效计时器使用 `ResetButKeepPastTime`；若原剩余时间为 R，则保留 `e = P - R`，得到：

```text
R' = max(0, P' - e) = max(0, R + Δ)
```

该式描述本轮已经运行的计时器，不表示下次发动的基础时长也增加。总周期 `P + Δ` 与用于计算追加量的黑板 duration 应分别记录；不能在未核对二者相等前将所有内容简写为一条基础时长乘倍率公式。具体模板在退出时还可恢复原周期，详见原始动作摘录。

周期 P 自身也有具体组合规则：`AbilitySequenceGroup._UpdateCooldownFromSubAbilities` 91734 只处理 Category 含 ACTIVE 的子 Ability；`_useLongestAbilityCooldown = false` 时累加其 cooldown，为 true 时取最大值。`ActiveBuffAbility.SetLifeTime` 90969 则按配置读取黑板 duration，并与所附 Buff 的有限时长取最大值；非忽略的无限 Buff 另走无限分支。这些是具体 Ability 的初始化规则，不能统一解释成 Attribute 四段归并。

本节确认了 Ammo 的专用聚合、SP 的不同状态／配置运算，以及具体技能的消费和延时链。它没有建立全部技能参数共享的“原生 Modifier 公式”，也不以统一 `Input<M, H>` 推导任何未证实的数值算法。

## 3. 触发、持续与输出

| 代表机制 | 已确认行为 | 对模型的要求 |
| --- | --- | --- |
| 慕斯 S1 | 特殊被动，在攻击开始前按条件扣 SP、取得本轮增益；没有普通技能开启／结束事件，本轮不回复攻击 SP。 | 资源支付不必产生一次常规 activation；事件按真实机制发生。 [来源](https://prts.wiki/w/慕斯#技能) |
| 常见强力击、水月 S1 | PRTS 记录动态持续时间，技能过程与攻击间隔／动画结束相联系；水月 S1 另有动画不随间隔变化的提前结束情形。 | 就绪、触发、动作、输出与结束分别辨认；“SP 满后先开启并无限等待下一次普攻”不能作为普遍流程。 [动态持续时间](https://prts.wiki/w/游戏数据基础#动态持续时间)、[水月](https://m.prts.wiki/w/水月#技能) |
| 古米 S1 | 有可治疗的受伤目标才触发，切入治疗模式，完成一次治疗普攻后结束。 | 自动启动有目标条件；结束可以依赖具体动作完成。 [来源](https://m.prts.wiki/w/古米#技能) |
| 乌有 S2 | 无限持续，可主动关闭；开始动画结束时选择效果，后续启动排除上次效果，再部署重置记录。 | 随机采样有具体时点；需要跨激活保留记录，同时具有本次激活状态。 [来源](https://prts.wiki/w/乌有#技能) |
| 流明 S3 | 普通治疗不耗弹；治疗指定异常状态的目标时才耗弹并清除状态。 | 耗弹由实际内容业务决定，不能规定每次 Action 输出都扣弹。 [来源](https://m.prts.wiki/w/流明#技能) |
| 普通弹药机制 | PRTS 记录一次消费可超过余量而出现负弹药；在下一次普攻检查弹药不高于零时退出。 | 支付数、剩余量与结束检查有各自边界，不能截断消费或统一归零即时结束。 [来源](https://prts.wiki/w/技能#特殊属性) |
| 隐现天赋 | 弹药上限提升只在弹药类技能开始时生效，已经开启的技能无法受益。 | 初始弹药贡献在发动时采样；改变后续发动预算与补充本次剩余弹药是不同操作。 [来源](https://prts.wiki/w/隐现#天赋) |
| 新约能天使第一天赋 | 响应友方弹药消费；单次消费多发时按消费数触发，不以实际剩余量限制次数。主动正常关闭技能不算消耗剩余弹药。 | 需要可由其他单位订阅的消费事实；报告区分消费与清理，并保留本次消费量及前后值。 [来源](https://prts.wiki/w/新约能天使#天赋) |
| 图耶 S2 | 持有三发弹药，消费能触发新约能天使第一天赋，也可被偷弹、补弹；但持续类型不是普通弹药持续类型，不满足大部分弹药类技能相关加成的判定。 | 弹药资源及其事件可复用；拥有弹药不能直接作为所有弹药类加成的资格。项目可以共用 AMMO 资源／结束抽象，另行表达真实加成资格，不要求复制客户端的持续类型。 [来源](https://prts.wiki/w/Tuye#技能) |
| 普通补弹与自身额外弹药 | 普通补弹在一次技能内具有累计补充上限；圣约送葬人、烛煌的自身弹药增加不计入该累计额度。 | 本次初始量与剩余量不足以恢复普通补弹的累计历史；补弹政策需要自己的已用额度，报告需保留操作语义。 [补弹](https://prts.wiki/w/术语释义#补弹)、[圣约送葬人](https://prts.wiki/w/圣约送葬人#技能)、[烛煌](https://prts.wiki/w/烛煌#技能) |
| 号角 S2 | 弹药阈值触发过载；二次触发可进入倾泻并暂时禁止再次关闭。倾泻结束／中断后仍有余弹时可能回到原状态。 | 激活中存在有条件的操作、阶段转换与暂时限制；二次操作不等于 stop。 [号角](https://m.prts.wiki/w/号角#技能)、[弹药倾泻](https://prts.wiki/w/特殊机制#弹药倾泻) |
| 蕾缪安 S3 | 持续锁定并追踪目标，目标退场后标记留在原处；结束后依次轰炸，使用结束时缓存的攻击力。 | 需要持续记录、结束时采样与结束后的独立执行；Skill 结束与全部产物结束不相等。 [来源](https://prts.wiki/w/蕾缪安#技能) |
| 被动 | 部署触发的被动可以有限持续；慕斯又属于按攻击条件工作的特殊被动。 | 被动不是“无消耗、无限持续、自动启动一次”的唯一模板。 [止颂 S2](https://m.prts.wiki/w/止颂#技能)、[慕斯](https://prts.wiki/w/慕斯#技能) |

Skill 结束后的输出不自动证明宿主离场后也继续。例如蕾缪安的轰炸在宿主死亡／撤退后的完整规则，本轮尚未确认。产物是否绑定 Skill、Unit 或其他生命周期，应按实际内容确定。

### 3.2 2026-11-05：灰烬 S2 的消费节点与攻击中断

本节区分“攻击中断”“本次是否已经消费”“已经进入的同步程序如何返回”。不能从输出已发生，直接推导后续尚未提交的消费一定需要补做；也不能从某次被取消，直接推导本次一定不消费。新的本机资源、指令、输入指纹及复跑入口见 [ammo-cancellation-20261105](../evidence/ammo-cancellation-20261105/README.md)。当前 DLL／metadata SHA-256 分别为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`／`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，不是本案开头的旧客户端；没有运行游戏、注入中断或验证活跃 XLua。

**实际绑定直接证实：** 本机灰烬 Character 的 S2 Mode 指向本轮 RangedAttack，同一 Attack GameObject 具有 AbilityEventCounter，`_countEvent=4`、`_expendPerTrigger=1`。`skchr_ash_2` 使用 CastSkillWithLimitTimes，并按配置取得当前主攻击的计数源。当前枚举常量 4 为 `ON_SPELL_ON`，3 为 `ON_CAST_END`；标签来自当前 metadata，不由整数或节点名称猜测。

**消费早于实际目标输出：** `AbilityStandard.ExecuteSpell` 64119 在 `0x1805fd6d6` 发送事件 4。Counter 在符合本次计数条件的普通分支进入 `DealCountEvent` 96419，于 `0x181004147` 写入计数，再通知 `OnEventCountConsumed`；之后才返回施放流程，进入 `Entity.OnAbilitySpellOn`（`0x1805fd766`）和目标输出（`0x1805fd866`）。因此本例消费不应被理解为 afterOutput 的欠账。

**中断的普通结束链：** `InterruptIfNot` 64025 以 `INTERRUPTED(1)` 进入 `FinishIfNot` 64056。实际 RangedAttack 的 OnCastEnd 沿 AbstractBasicAttack、AbstractAnimatedAbility、EasyToStartAbility 到 AbilityStandard，发出的是事件 3，没有补发本次事件 4。所查 Counter 没有接收结束原因来判断是否退还这次消费的普通分支。

| 本次中断时点 | 本例普通 native 的结论 |
| --- | --- |
| 尚未进入本次消费节点 | 中断／结束本身不会额外补出这次消费。 |
| 已经通过本次计数并写入消费 | 后续普通中断链没有按 INTERRUPTED 撤销这次消费的退款分支。计数器重置、技能退出和其它内容显式补弹分别判断。 |

消费与耗尽结束仍分离：Counter 的 ready-to-reset 协调及 `ResetCount` 门控制后续技能收尾；CastSkillWithLimitTimes 的 OnTick 不是看到余额耗尽就无条件在本次输出前结束。不能仅据“前置消费”就把项目 consume／check 整段一同前移。

这些结论限定灰烬 S2 的所选配置及普通未免耗路径，不推广为所有弹药技能的统一消费节点。流明等条件消费、节弹、弹药倾泻，以及技能关闭丢弃余弹，不与普通攻击中断合并。项目的 Lifetime／对象保留规则决定程序和存储何时结束，不能替代各玩法的消费条件和发生节点；本轮不据此修改通用 Lifetime、ENDING 写入权限或生产接口。

### 3.3 启动结果与失败后继：实际需求核对

本轮区分两个问题：内容是否需要知道一次启动成功／失败，以及是否需要根据不同启动失败原因选择不同后继。不以 ArkBattle 当前调用者或测试作为需求证据。当前原生签名、指令与内容摘录见 [2026-11-10 证据](../evidence/operation-results-20261110/README.md)。未运行客户端或验证现场 XLua。

**成功／失败结果确有实际用途。**

| 路径 | 已核实的消费方式 | 证据范围 |
| --- | --- | --- |
| 郁金香 `skchr_apionr_1` | Prefab 的 FirstSucceedGroup 依次放置不允许空目标的 MultiMeleeAttack 与允许空目标的 EmptyAnimatedAbility；原生组合在子能力返回 false 后尝试下一项，true 后记录成功项并开始组合施法。 | 角色／技能表绑定、实际技能 Prefab 和当前原生分支；资源指纹复核通过。 |
| `TriggerAbility.Execute` 102055 | `_useCastResult=true` 时向内容序列返回 CastToTarget／CastDirectly 的布尔结果，false 时统一返回 true。调用方可以让后续动作依赖这次成败。 | 原生字段分支直接证实；所选旧模板中也存在 true 配置，模板存在与当前角色实际启用分别记录。 |
| “Touch”，再生之流 | 当关联召唤物获得自缚时尝试触发“吸收灌注”；未能发动时，立即直接执行相同效果。 | [PRTS 固定版本](https://prts.wiki/index.php?title=“Touch”，再生之流&oldid=443827) 的具体内容说明；本轮未闭合该敌人的当前 Prefab／原生调用绑定。 |
| 普通技能与二次操作 | BasicSkill.Cast、CastSkill.DoCast、CastSkillWithCost.DoCast、RetriggerSkill 和 Character.OpTrigSkill 返回 bool；调用者据此执行成功记录、维护 pending 标记或处理失败。 | 当前 Skill／Character／SkillState／UI 普通原生分支。 |

失败不总是没有后继。`BasicSkill.Cast` 73861 在 IsAvailable=false 时直接返回 false，DoCast=false 时才派发无参数的 `Behaviour.OnCastFailed`。SkillState 77511 的 canUseAbility=false 分支另有 `OnCastFailedInSkillState`，同样不携带原因参数。已展开的 Fever／OxiFireRainSlotBehaviour 失败程序会查询当前 casting／affecting 并按需清理，但本轮未证明这两个 Behaviour 的当前角色绑定。不能把所有失败通知都泛化成相同的触发资格。

**本轮未找到按不同启动失败原因分流的明确内容需求。** 上述组合、节点、技能调用与二次操作消费的是布尔结果，没有消费 SP 不足、冷却、受控、无目标等统一原因码。PRTS 的“Touch”例子也只区分能否发动。相反，技能已经启动后的概率分支、资源支付失败、召唤失败，以及中断／丢失目标导致结束，分别属于其他业务阶段，不能用来证明启动拒绝原因分类的必要性。

本轮由实际调用证明需要保留可观察的成败与相应后继；尚无证据要求复制 ArkBattle 当前 Outcome 的具体结构或拒绝原因集合。有限样本不证明全游戏绝不存在原因分流，也不据此决定项目返回类型或新增 Hook。

## 4. 调度与范围

[卫戍帮助](https://prts.wiki/w/卫戍协议/帮助#作战阶段)明确，模式会自动操作原本的手动技能，具有自己的操作冷却和普通／特殊策略，也存在主动关闭的特殊策略。因此，技能自身触发类型与模式控制策略是两项需求。不能仅把 MANUAL 改为 AUTO 后按 SP 足够启动。既有项目的明确偏离继续按原约定处理。

[敌人技能说明](https://prts.wiki/w/矢量战术装备#技能)与既有官方原生证据记录了：各技能的首次／后续冷却、施放期间暂停、绑定模式下推进、优先级与同层随机选择，以及另有 SP 条件。敌人技能的触发冷却不等于普通攻击周期。完整敌人链见 [Case 08 §8](08-action-eligibility-and-interruption.md#8-enemyskill-的触发动作与共享-sp2026-11-10)，项目组织见 [Content](../../architecture/content.md)。

## 6. 尚未确定的具体行为

- 断罪者等具体强力击何帧扣 SP，以及前摇中目标失效／中断时是否返还，尚不能统一归纳。冬时 S1 有索敌失败返还的特殊处理，不能推广。 [冬时](https://m.prts.wiki/w/冬时#技能)
- 攻击回复与失效弹道、多目标等完整组合仍需具体内容；普通受击回复、闪避／屏障／抵挡的后续结论见 [Case 38 §11](38-damage-classification-and-permissions.md#11-接收前置普通-hit-与伤判)。
- SP 配置更新、容量与普通余额写入已由 2.7 核实；具体配置切换调用者是否另行清空／补入余额仍须沿内容追踪。
- 2.6 的 Rune／遗物逐来源舍入不能推广为全部技能参数的共同公式；具体配置切换的余额、许可与恢复顺序按实际内容分别核实。
- 来源退场后，具体持续／延迟技能输出的退出规则要逐例确认。

## 7. 特殊持续与跨部署事实

[Fever](https://prts.wiki/w/术语释义#Fever) 对已有技能和在 Fever 中新开的技能有不同退出政策。本轮已核对角色实际绑定与期限延后、退出及 SP 处理；不能仅从社区使用“暂停”一词推导通用暂停状态机。玛露西尔魔力、图耶的弹药资格和止颂 S3 异常下发动也已补核，结论见 §9。

## 8. 本季技能观察者与公共事件载荷补查

2026-10-29 扫描了[来源登记中的 activity_table 镜像](../evidence/skill-modifier-20261029/content.json)的 `activity.AUTOCHESS_SEASON.act2autochess`：361 项效果、23 项盟约、40 项策略、320 项特质、266 项棋子配置。镜像来源、指纹及版本关联限制见[持久来源登记](../evidence/skill-modifier-20261029/content.json)的 `sources.mirrorActivityTable`。数量分别对应 effectInfoDataDict、bondInfoDict、bandDataListDict、garrisonDataDict、charChessDataDict；同一效果的配置与 Buff 信息不重复计数。这是本季配置扫描范围，不代表已核实全部原生执行链。

代表性外部观察需求如下；效果描述另与 [PRTS 本季盟约记录](https://prts.wiki/w/卫戍协议：盟约_下半/PRTS盟约记录)及[本季策略记录](https://prts.wiki/w/卫戍协议：盟约_下半)交叉核对。

| 代表内容 | 需要观察的公开事实与内容自身状态 |
| --- | --- |
| 炎国短刀 | 观察技能开启，装备效果保存自己的叠层数与上限。 |
| 黄沙罗盘 | 观察首次技能结束及组合装备的开启触发；效果保存自己的首次标记。 |
| 萨尔贡盟约 | 观察盟约成员开启技能；盟约内容管理受益者与各层期限。 |
| 迅捷盟约 | 观察技能结束后按自身层数与概率规则回复 SP。 |
| 休谟斯「回收利用」 | 观察地面干员技能结束，按公开位置选择受益者并回复 SP。 |

这些样本说明观察者需要技能开启／结束事实以及自己的历史状态；没有显示其需要读取被观察技能的任意私有状态。公共载荷见 [Skill](../../architecture/skill.md)。

本节依据是配置文本、镜像描述与 PRTS 记录，不是对原生回调签名或派发时序的反编译证明；具体原生消费／计时链仍以 2.7 的独立证据为准。

## 9. Skill 覆盖审查：2026-11-17

本轮从配置、资源、发动、持续和主动操作检查到生命周期及外部观察，不以架构 TODO 或尚未接入某个角色推定 Core 缺口。复用 Case 05、08 和本案原件，补提当前客户端方法与实际 Prefab 绑定，详见[证据批次](../evidence/skill-audit-20261117/README.md)。没有运行官方战斗或验证活跃 XLua；下列项目接口判断不是原生事实。

### 已确认的表达缺口

| 需求与实际使用 | 原生依据 | 当前项目限制 |
| --- | --- | --- |
| 初始预算及本次发动资格、支付可以变化。 | 提丰等按次数改变持续预算，假日威龙陈 S2按蓄力选择初始弹药基础值；Fever参与技能豁免普通门槛和支付。数量与原生链见 §10。 | 当前 sustain 固定在 Activation Definition；普通门槛与支付额由同一 Definition 静态显式声明，尚无 Fever 的单次豁免。需要分别表达预算初始化与特殊发动政策，不据此预定整份 Definition 生成函数或通用配置写入。 |
| 本次发动豁免特定异常限制。 | 止颂 S3 的实际 Skill 允许异常中开启；原生仍独立检查沉默，不是忽略所有异常。S2 是有限持续的部署被动，不是这个特例。见[发动补查](../evidence/skill-audit-20261117/lifecycle/README.md)。 | stun 登记无条件拒绝的启动限制，activate 没有本次豁免入口；accepts 只能增加条件，无法覆盖已拒绝的限制。公开 API probe 确认：眩晕中、SP 足够也不能发动，且未进入 accepts。 |

这些需求要求明确的输入与资格契约，不要求复制原生异常枚举或临时补 SP。Fever 豁免本次普通门槛与支付，不修改静态发动配置。具体接口在 §10 的有限表达范围内比较，不预先决定 Contribution 或完整定义生成函数。

原生技力封闭的正／负增减检查及玛露西尔自身强制付款均已核实，标准角色凋亡也有 `force=false` 的减 SP 来源。这些事实不能直接证明项目必须新增通用 SP 封闭：若魔力采用 Content 私有资源，普通 SP 操作并不直接操作它；若选择复用通用 SP，则需保留这种隔离。不能在资源表示尚未确定时，把原生复用方式当成 Core 必需结构。普通恢复类型替换也只有通用方法证据，本轮未闭合非默认实际内容。

玫兰莎实际普通 CastSkill 不允许主动丢弃或二次触发。项目据此明确主动操作支持：Definition 只为支持的操作提供处理器，未提供便拒绝，再由 operationRestrictions 判断当前资格；普通技能无需登记禁止关闭的特例。具体契约见 [Skill](../../architecture/skill.md#4-restriction程序与-hook)，原生绑定与改造前复现保存在[持续补查](../evidence/skill-audit-20261117/sustain/README.md#已有内容的-stop-资格遗漏)。

### 可由现有领域组合表达的需求

| 需求 | 对应事实与边界 |
| --- | --- |
| 多次充能、蓄力与特殊支付 | capacity、requirement、cost 已分开；每次支付、全量支付和达到满槽后的锁存增强由具体程序选择，持久 state 保存跨次事实。无需另存充能次数作为第二份余额。 |
| Fever 中已有技能延续 | 实际普通分支给当前周期加 Fever 时长、保留已过时间；退出时区分进入前已开启与在 Fever 内新开的技能。现有 extendTime 和具体管理程序可表达已查固定窗口，不据此重做 Sustain。该时长读取配置周期，不能推广为任意动态剩余时长。 |
| 玛露西尔跨部署魔力 | 原生有卡牌持有与场下回复链。Card 持久 state／onTick 与 Unit 生命周期通知可保存和恢复魔力；实际容量与初始值可在构造前合成，不能因此证明必须运行中修改普通 SP 配置。 |
| 弹药消费、补弹、自身加弹与加成资格 | consume／check、replenish／grant 已分开。图耶 S2 虽不属于原生普通 AMMO 持续分类，仍是三弹耗尽结束；可以共用项目 AMMO 预算，不能因此获得所有普通弹药类加成。实际资格由具体加成定义判断，不能只读 sustain.type。 |
| 条件关闭、倾泻、二次操作 | operations 处理器与 operationRestrictions 可以表达乌有关闭、号角倾泻及期间禁止再次操作，不要求另建生命周期。 |
| 有限被动、特殊被动与动作结束 | 止颂 S2 有限部署持续可用 PASSIVE + TIME；慕斯 S1 按攻击条件支付、没有普通技能开启／结束通知，可由持久 Skill 编排 Action，不强制创建 Activation。 |
| 敌人多技能 | Case 08 §8 已确认各自触发计时、模式与宿主共享 SP。持久 Skill 可编排多份 Action 并保存各自计时，不能把每个 EnemySkill 强行当成同槽 Activation。未发现要求多份并行 Activation 的实际消费者。 |
| 暂时消失与通知 | Presence 改变不自动代表重新创建 Skill；现有项目契约保留已成立的 Activation，具体中断另由内容决定。开始／结束观察者保存自己的历史，已查使用例不要求公开任意私有 state。 |

### 证据边界

本轮没有找到“有限 TIME 与 Ammo 两个退出预算必须并存”或“技能中途替换弹药基础容量”的实际正例。图耶不能证明前者，隐现和蕾缪安的容量修正也只证明发动时采样。保留这些检索范围，不能从未找到推导全游戏不存在，也不把它们继续列作已确认 Core 缺口。

具体技能的消费／返还节点、宿主离场后产物是否保留、沉默对具体效果的适用性，仍须在相应内容链核实；通用通知、私有状态或 Lifetime 的存在本身不是内容完成证据。

同实例复活的生命流程见 [Case 11](11-damage-apply-and-hp-application.md#5-hp-归零后的复活是同一实例的另一条生命周期)。本轮补核的 Character 状态退出会按具体配置中断行动或持续影响，Enemy 恢复后另重置各招次数／初始冷却；所选入口没有统一清空 SP。已有 Action 取消、Activation 完整结束与 Skill.setState 可分别表达，见[重生链核对](../evidence/skill-audit-20261117/lifecycle/README.md)。这不构成全部技能统一保留／重置的政策，也不代表所有角色的复活组合已验证。

## 10. 发动变化的数量与表达范围：2026-11-17

以实际变化决定接口所需表达力，不将前述完整 Definition 生成函数当作既定模型。原件与可复跑统计见[本批说明](../evidence/skill-activation-variation-20261117/README.md)。

### 样本与数量

完整固定镜像包含1846个 SkillID、1403条 Character；搜索所有资料等级、全部角色／召唤物／装置技能引用及 Trait／Talent，去重得到232个 SkillID 候选和53条角色记录，再人工核对。角色实际引用1845个 SkillID，其中1842项在表、3项缺失；4个未被该字段引用的表项是阿米娅其他形态技能，仍纳入搜索。候选不是确认结果，数量不代表完整游戏语义普查；模块、其他 Effect、敌人和关卡表未全量扫描。

| 已确认变化 | SkillID 数 | 实际使用与所需输入 |
| --- | --- | --- |
| 第二次起限时→无限 | 6 | 青枳 S2、国度 S2、遥 S2、怒潮凛冬 S2、棘刺 S3、提丰 S2；改变初始 Sustain 的 TIME／INFINITE 判别值。 |
| 按次数或蓄力改变限时时长 | 3 | 薇薇安娜 S3为15／25秒；龙舌兰 S2、温米 S2为15／30秒。 |
| 蓄力改变初始弹药基础值 | 1 | 假日威龙陈 S2，普通8发、蓄力20发。 |
| Fever 门槛与支付豁免 | 11 | 五名干员共用同一种政策，不是11种程序替换。实际名单见[付款批次](../evidence/skill-activation-variation-20261117/payment/README.md)。 |
| 具体付款、锁存与明确时间操作 | 定向4项 | 流明 S2、薇薇安娜 S1，以及雷狼龙 S 空爆两技能。前两项已补实际付款模板，后两项复用 §2.7 的先付首层、读取／清空剩余 SP、再延时链。 |

前三行合计10项初始预算变化。哈蒂娅 S2的期间延时另属现有完整操作；分类会交叉，不把各行直接相加当作全部动态技能数。静态清单见[目录审查](../evidence/skill-activation-variation-20261117/catalog/README.md)，提丰、棘刺、薇薇安娜、假日威龙陈及重岳的实际消费链见[预算批次](../evidence/skill-activation-variation-20261117/budget/README.md)。

### 有限参数与程序分组

预算代表的普通原体核对显示：提丰／棘刺从有限和无限 Buff 路径取得本次持续；薇薇安娜按历史次数写入本次 duration_plus；假日威龙陈按充能状态选择不同攻击 Counter。它们需要本次基础预算能变化，不要求同时更换全部初始化、回调和操作表。

假日威龙陈的20发会成为本次 Counter 的 `originalMaxCount`，再参与独立容量修正。不能把普通8发固定追加12发当成等价实现：比例贡献应作用于本次基础20，而不是基础8。初始基础值选择与已有 Ammo Contribution 的固定追加／比例归并是两个步骤。

重岳 S3五次后由周期程序自动尝试发动，但原 SkillData 保持 MANUAL；丰川祥子 S1和焰狐龙梓兰 S1的满充能自动一次也不能据描述推成互斥的触发枚举替换。冻河 S2及两个装置记录另有外部自动使用政策，不作为自身 Activation 定义替换计数。相关模式适用性与时序限制保留于目录原件。

程序分组同样逐例判断，不以“一个回调总能写分支”作为架构证明。玛露西尔 S2确有首次召唤／随后升级的不同业务；已归档 `marcil_s_2` 同一段程序检查持久的 `marcil_s2_enhance`，进入普通／强化模式。本轮属性子效果随父结束，独立增强标记保留。它直接支持固定程序读取持久阶段及本次快照；STOP 的次数资格另由对应机制处理，不证明必须更换初始化或整个操作表。结城理 S3的形态、丰川祥子 S2的音色也有自然的 Action／Effect 程序分组，但本批没有取得它们必须更换整份 Activation 生命周期程序的证据。

### 对候选接口的约束

- 目前确认的初始变化集中于门槛、最终支付和 Sustain；TIME／INFINITE 是联合值选择，不能全部压成数值加乘。
- Contribution 可以承载联合值，不仅能存数字；但自身次数决定基础预算，并不天然具有多个独立来源、撤销或竞争。不能为了“值会变”而强制登记贡献。
- 已有 Ammo 容量增益及 SP 回复速度／倍率具有明确多来源模型，继续各自按已核公式处理；不能把这些公式推广成全部初始参数的共同算法。
- 具体资源采样、清空和运行中延时有真实顺序；不能用一个定义生成步骤吞掉既定业务时点。乌有随机效果、过载或音色切换也不等于创建时随机更换整份定义。
- 本批确认的“必须替换完整 Activation.Definition”数量为0，含义是没有取得这种必要性证据，不是全游戏不存在。当前依据支持先比较有限参数输入与真实多来源贡献，不足以把完整定义生成函数定为所有技能的默认接口。

现有架构仍以 [Skill](../../architecture/skill.md) 为准，本节不写入尚未确认的工厂、参数类型或 Contribution 归并接口。
