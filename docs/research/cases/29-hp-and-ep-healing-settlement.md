# HP 与 EP 治疗的结算与事件

研究日期：2026-11-03；基线 `a85aaa4`。复用[案例 27](27-attack-additions-and-damage-events.md)、[案例 25](25-elemental-burst-recovery-timing.md)与 [EP 事件补查](../evidence/ep-modifier-events-20261103/README.md)的同指纹主体，只补治疗公式、分类、接收、来源后置和末药／桑葚普通模式的内容绑定。定位、指纹与复跑命令见[证据批次](../evidence/healing-settlement-20261103/README.md)。

2026-11-06 补核负治疗数值，基线 `92f76d2`；客户端指纹与原调查相同。新增构造器与数值读写证据见[补查批次](../evidence/healing-negative-values-20261106/README.md)，公式和提交链直接复用既有材料。

2026-11-13 补核自然 HP 回复的属性、计时与 HP setter，见[证据批次](../evidence/hp-regeneration-20261113/README.md)。与普通治疗、生命复原分开记录，不改变项目的 Healing Hook 契约。

## 1. 问题与结论

问题：HP 治疗、EP 回复经过哪些共同 Modifier 时点，哪些处理独立？行医的两种回复如何组合，EP 是否取决于实际 HP 恢复量？

普通 HP 治疗与 EP 回复共享部分 Modifier 应用阶段，但不共享全部公式或专属事件。所查 HP `CalculateHeal` 与 EP `ApplyElementHeal` 的基本求值不直接派发 HP 伤害的 Calculate／BeingCalculate／AfterCalculate Buff 回调。不能从普通攻击可能产生治疗，推导每次治疗都要建立 Action；也不能从共用 Modifier 入口，推导四种结算必须套用完全相同的阶段模板。

代表性内容中，末药默认治疗只产生主 HP 回复。桑葚配置通过 Trait 的附加 Buff 接入 EP 回复；结合 attachment 的命中调用链，确认所选普通分支 **EP 回复先于主 HP 治疗**，不是根据主 HP 实际恢复量再计算 EP。Trait 的外部 MonoScript 引用也已解析到实际类；这是静态绑定与调用链结论，不冒充实机运行结果。

## 2. 两条普通应用路径

下表限定存活目标、合法正数输入、未设置 skip、没有中途取消、资源提交成功且分类未被通用回调改变的普通分支。来源事件还要求当时能取得有效来源。编号属于 Buff.Event，不能与 Entity／EventPool 编号混用。

| 阶段 | HP 治疗 | EP 回复 |
| --- | --- | --- |
| 基本求值 | 当前或显式 ATK 与调用方传入的 healScale | 所查普通节点读取当前／缓存 ATK 与 epHealRatio |
| 目标前置 | `OnBeforeApplyingModifier`，event5 | 相同通用时点 |
| 来源输出 | `OnOutputModifier`，event8；不走 HP 伤害专属输出 | 相同通用时点 |
| 目标通用接收 | `OnApplyingModifier`，event6 | 相同通用时点 |
| 专属接收 | 普通 `OnTakeHeal` 逻辑检查 HEAL_FREE 并可取消 | 不走 HP OnTakeHeal，也不走 EP Damage 的 OnTakeEPDamage |
| 接收后、提交前 | 来源 `OnBeforeTargetApplyModifier`，event61 | 相同通用时点 |
| 提交 | 当前 HP 加 finalDelta，普通 setter 限制到当前范围 | 正向 EP 修改遍历各型，分别加同一数额、限制到当前上限 |
| 目标后置 | `OnAppliedModifier`，event7 | 相同通用时点 |
| 来源后置 | `OnAfterOutputHeal`，event85 | 所查普通 EP Heal 不进入 HP 治疗85或 EP Damage83 |

HP 的 `get_isHeal` 72135 只判断 damageType=HEAL(4)，不是根据实际回复量或名字判断。EP `NewElementHeal` 72183 构造 targetType=EP(5)、deltaType=正向(1)、elementType=NONE(0)，通用构造器把 damageType 置0；`get_isElementHeal` 72137 单独判断 EP 与正向组合。因此上表的专属分流有实际字段与条件依据，不是按函数名称推测。

普通 `_OnApplyingModifier` 的治疗分支执行与 `Entity.OnTakeHeal` 67710 相同的代码：force=false 时检查 HEAL_FREE(7)，成立则取消，随后仍发出 Entity 事件13。这里没有独立的 BuffContainer.OnTakeHeal 列表；内容可以在通用 Applying(event6) 中干预。Entity 事件13不是 Buff.Event13。

EP 提交对 targetType=5 先检查 EPFreeAll，再区分正负修改。爆发恢复控制器在期间提供这项限制，因此普通 EP 回复可以在提交处被拒绝，早先通用前置已可能执行；失败提交不进入目标 Applied。这个原生时点不自动改变项目目前的准入政策。

## 3. 数值与实际变化

### HP：基本量、接收量与实际恢复量

两个 `CalculateHeal` 重载 65905／65906 构造 HEAL 类型的 AttackInfo，附加项取 FP.Zero，以 source=null 进入无事件计算。普通 HEAL 分支直接返回 `GetFinalAtk`，该构造下基本量为：

\[
H=\max(0,\operatorname{ATK}\times\operatorname{healScale})
\]

这段计算不应用 DEF／RES。通用 Modifier.value getter 只读取当前数值；finalDelta 72155 只处理方向和非负量，没有在这两个 getter 或 OnTakeHeal 中额外乘算通用治疗加成。具体内容仍可改变传入倍率或在前置程序修改 value，本轮不穷尽所有治疗加成的来源。

普通、没有 ES／HP override 或额外同步干预时，DoApplyModifier 先读取当时 HP，再调用 setter，最后读取新 HP，原生 realDelta 是本次实际差值。它不能无条件替代基本量或当前接收量；带过量转额外生命的分支还可能把 ES 变化计入 realDelta，本轮不展开。

一个直接控制流支持的区分例子：已满 HP 的目标接收正数治疗100，最终 HP 不变、实际回复0，但 DoApply 仍可成功，继续目标 Applied7 和来源 AfterOutputHeal85。初始数值为0则会在原生入口被取消判断排除。**满血的正数治疗与初始零治疗不同，普通后置并不统一要求实际回复大于0。** 该例是静态分支推导，没有实机执行。

零值入口的直接证据复用[接收节点原体](../evidence/damage-hook-needs-20261103/native-reception.json)中的 `Modifier.get_isCancelled` 72132：普通非 XLua 分支在 deltaType 非 NONE 时读取当前 value，再调用 `MathUtil.IsZero`。`Entity.ApplyModifier` 67665 在目标 Before5 之前调用这个判断。这里是原生 Modifier 入口的当前数值；ArkBattle 的 Calculate／Apply 划分仍按项目契约，不将两个检查位置机械等同。

### EP：独立基数、逐型恢复与累计量

所查 `ApplyElementHeal.Execute` 99906 在 `_maxEpHeal=false` 时，读取当前或弹道缓存 ATK，乘节点黑板可覆盖的 epHealRatio，然后直接构造 EP Modifier 并应用。不调用 HP CalculateHeal，不读取主 HP 的理论量或实际恢复量，也没有在该节点公式中应用 EP 损伤抗性。通用前置程序仍可修改或取消这次数值。

节点默认比例为1.0；不能将其当成桑葚实际配置。桑葚分支50%有社区资料支持，本机外部 TraitData 的0.5条目未在本轮闭合。

当前客户端正向 EP 提交循环元素 ID 1～5，每型各恢复同一数额并独立截断，realDelta 累加各型的实际变化。它既不是只恢复最低的一型，也不是把一个总预算分摊给各型。ArkBattle 当前支持四型，本调查不增加第五型支持。

### 负数：基础求值、Modifier 数值与提交量

2026-11-06 先复查 [PRTS 治疗量](https://prts.wiki/w/游戏数据基础#治疗量)与[特殊机制](https://prts.wiki/w/特殊机制)，社区资料没有闭合负数 EP 输入的行为，因而补查普通 native 分支：

- HP 基础治疗的裁零发生在 ATK 与 healScale 相乘之后，即上式 `max(0, ATK × healScale)`；不能改述为先将输入 ATK 裁零。`GetFinalAtk` 65919 在乘法、附加项之后才与零取 Max，治疗构造的附加项为零。
- 普通 EP 治疗节点直接传入 `ATK × epHealRatio`。`NewHeal` 72182 与 `NewElementHeal` 72183 均固定正向修改；`set_value` 72157 与 `get_value` 72156 的普通分支原样保存、读取数值，没有取绝对值、按负号改成损伤或负值异常。
- 两者共用 `finalDelta` 72155：先取 `max(0, value)`，再乘声明的方向。因此，若提交时治疗 Modifier 的 value 仍为负，最终资源增量为零，不会变成伤害。
- 这不意味着负数输入在入口就作为零取消。`get_isCancelled` 72132 检查方向 NONE 或 `MathUtil.IsZero(value)`，没有 `value < 0` 分支；不属于该零值判定的负数仍可能进入接收程序，其数值也可能被后续程序改变。最终提交量为零不能证明整次调用没有 Hook 或其他副作用。

上述结论区分了基础公式、Modifier 当前数值与最终提交量，没有证实某个实际内容会产生负治疗，也未验证活跃 XLua。它不决定 ArkBattle 是否拒绝负数参数、在哪个边界裁零或如何检查 Output Hook 的结果；这些是独立的项目数值契约。

## 4. 普通医师与行医的真实配置

先查 [PRTS 末药](https://prts.wiki/w/末药#特性)、[桑葚](https://prts.wiki/w/桑葚#特性)与[游戏数据基础](https://prts.wiki/w/游戏数据基础#治疗量)。社区资料支持普通医师治疗、行医满 HP 时仍可回复 EP，以及50%的分支比例；没有闭合此次命中程序的先后，因此继续核对本机资源。

| 内容 | 静态绑定与必要结果 |
| --- | --- |
| 末药普通治疗 | `char_117_myrrh` 默认模式引用 RangedHeal，弹道 key=`projectile_myrrh`；Trait为空，activeBuffs为空，`_applyEPHeal=0`，主动作由 `NewHealNode` 构造 ApplyHeal。所选默认内置链只产生 HP 回复。 |
| 桑葚普通治疗 | `char_473_mberry` 默认模式引用 RangedHeal，弹道 key=`projectile_chr_mberry`；主治疗同样 `_applyEPHeal=0`，没有采用 Heal 基类可选的“主 HP 后追加 EP”分支。 |
| 桑葚分支特性 | Character 的 Trait 引用 PathID `2182608855241056915`，包含 `_additiveActiveBuffs=[mberry_trait]`，模板 key=`ep_heal_all`，familyMask=31，validator为空、probKey为空。 |
| 特性模板 | 当前 Holder 中 `ep_heal_all` 的 event0 直接执行 `ApplyElementHeal(_isCont=false, _healTarget=TARGET, _maxEpHeal=false)`，不是来源 HP 治疗后的事件。 |
| 命中组合 | 实际弹道未禁止附件；既有命中控制器先执行 attachments.Apply，同步 AddBuff→OnStart，再执行 HIT_TARGET 主动作。结合上述特性路径，EP 程序先于主 HP 程序。 |

Trait 的外部 MonoScript 引用为 fileID1、PathID `-8004000125733044417`。按角色 externals 定位到 SerializedFile `CAB-658d74aab777086fc32b93f385be999a`，对应脚本对象直接记录 `Torappu.Battle.Abilities.PassiveAttachmentAbility`、程序集 `Assembly-CSharp.dll`。其 DoAttach 94559 把 `_additiveActiveBuffs`、来源和 Ability 黑板放入 attachment 并登记到 Entity。精确 PPtr、外部文件、类名及脚本小对象见 `content/script-binding/trait-script-binding.json`；不是仅凭相似字段推定实际类型。

50%的数值与实际基数分开记录：社区说明按 ATK 的50%；节点指令证明按自己的 ATK×比例求值、没有 HP 恢复量接续。不能把“主 HP gain=0”解释为“因此 EP 数额为0”。普通选择仍受禁疗等限制，不能由 EP 前置直接推导行医能正常锁定禁疗目标；发射后条件变化的全部组合本轮未穷尽。

以上限定所选默认内容和附件实际参与的路径，不推广到所有行医、技能或外部装备，也不把两次回复变成原子操作。

## 5. skip、生命复原与自然回复

当前 ApplyModifier 的 SKIP_MODIFIER_EVENT(0x80)路径跳过目标 Before5、来源 Output8、目标 Applying6、OnTakeHeal 的普通 HEAL_FREE 检查，以及成功后的目标 Applied7／来源 AfterOutputHeal85。它调用独立的 OnApplyingSkippedModifier 后，仍会到取消检查、有效来源 BeforeTargetApply61 和资源提交。**skip 不等于完全没有回调。**

社区[特殊机制·生命复原](https://prts.wiki/w/特殊机制#生命复原)对绕过禁疗和多种普通治疗事件的说明，与这条 skip 分支相符。本轮没有核对所有生命复原 Content，不将所有恢复形式统一等同于该分支。

### 自然 HP 回复的完整普通路径

当前 native 的 `Entity.get_sumUpHpRecoveryPerSec` 67475 读取两项**有效属性**：

\[
R=\operatorname{HP\_RECOVERY\_PER\_SEC}
  +\operatorname{MaxHP}\times\operatorname{HP\_RECOVERY\_PER\_SEC\_BY\_MAX\_HP\_RATIO}
\]

属性通过 `Attributes.GetValue` 65243 取得：缓存脏时进入普通属性归并，不是直接读取敌人表的基础值。当前字段元数据直接声明固定回复速率下限为0、无声明上限，比例回复范围为 `[0,1]`；不能把负自然回复当作原生生命流失的另一种写法。

| 环节 | 直接证据与行为 |
| --- | --- |
| 初始化 | `Entity.Init` 67624 以 `canRecoverHp` 检查 `R>0`；正数以 `1/R` 为周期、等待首个完整周期重置 `PrecisePeriodicTimer`，否则使 timer 无效。 |
| 每 Tick 门控 | `Entity.OnTick` 67697 在状态机与 Buff Tick 后，检查虚函数 `get_alive`，成立才推进 HP／EP 回复。Entity 的普通实现要求状态机正在运行且 HP>0；Character 的覆盖77129还要求不是 Dummy、未处于 Dying 状态。不使用身份有效性查询 `get_isAlive` 替代这个条件。 |
| 计时 | `_UpdateHpRecovery` 67642 先检查 timer 有效，减去本 Tick 的 dt，再反复执行 `Next`；`PrecisePeriodicTimer` 在 remaining≤0 时就绪，`Next` 加回一个周期而保留超额时间。一个 Tick 可以产生多个脉冲。 |
| 每个脉冲 | 调用普通 `set_hp(当前 HP + 1)`，不是构造治疗 Modifier，也不是把本 Tick 的 `R×dt` 直接加到 HP。 |
| 属性变化 | `OnAttributeDirty` 67699 在 MaxHP、固定回复或比例回复变化时，先用 dt=0 处理旧 timer 已到期的脉冲，再读取新 `R`；非正数使 timer 无效，正数调用 `ResetButKeepPastTime(1/R)`。新 remaining 为 `max(0,新周期-(旧周期-旧remaining))`，不是按比例保留进度。 |
| 资源提交 | `set_hp` 67434 调虚槽111的 `SetHpInternal` 67625。普通 setter 保留 HP 范围、生命干预及 HP 满值／归零业务；它不是无通知的字段写入。正回复脉冲本身不进入负值归零分支。 |

外层与回复循环均没有满血、消失或 HEAL_FREE 检查。**满血仍推进 timer，并继续尝试每个 +1 脉冲。** 普通 setter 在 Clamp 并写入后，检查 `Clamp01(当前HP/MaxHP)` 是否等于1，成立则调用 `BuffContainer.OnOwnerHpFull` 66447。这里没有比较 previous HP 或实际回复量，所以已满血、实际变化为0也能通知；不能将它解释为只在“从非满变满”时触发。对应指令为 `SetHpInternal` 的 `0x18072f01f..0x18072f199`。

`OnOwnerHpFull` 派发 Buff.Event98。当前9054项模板中两项配置了该事件，其中 `titi_s_3[doze_indoze]` 执行 `FinishBuff`，说明这项资源通知有配置消费者。本批只确认该模板程序，没有闭合缇缇 S3 的实际安装绑定或现场触发；另一项属于项目不支持的生息演算，不据此扩大需求。

自然回复链没有经过 `CalculateHeal`、`ApplyModifier`、`OnTakeHeal`、普通目标 Applied 或来源 AfterOutputHeal。它与生命复原的区别不只是忽略禁疗：后者的所查 skip Modifier 仍执行独立 skipped 接收、取消检查和有效来源 BeforeTargetApply；自然回复直接由属性 timer 调用 HP setter。**不派发普通治疗事件不等于没有资源通知。**

真实非默认配置正例为普通关卡5-8的宿主士兵：固定镜像 EnemyDB 的 `enemy_1043_zomsbr`、level0 明确声明 `hpRecoveryPerSec=80`；关卡 `enemyDbRefs` 使用该等级、无覆盖，五条 SPAWN 实际引用该 key。EnemyDB 与关卡分别固定镜像修订、原始字节 SHA-256，见证据批次，不与本机资源版本混称。所扫 EnemyDB 的993个显式定义有13正值、980零值、0负值；有限配置扫描不证明所有内容绝无临时负值，但普通 native 的 `R>0` 门控也没有负速率扣血路径。

以上是静态 native 与配置证据，未执行游戏或验证活跃 XLua。项目选择由 Vitality 按当前有效速度逐 Tick 回复小数 HP，不采用每1HP脉冲或保存脉冲进度；不派发普通 Healing Hook。启停、变速时的脉冲时间差异按此近似处理，详见[自然 HP 回复契约](../../architecture/vitality.md#01-自然-hp-回复)。这项选择不改变上文原生事实。

EP 自然回复与爆发恢复通过直接 EP setter 推进，不经过上表普通 EP Heal Modifier 链，复用[案例 25](25-elemental-burst-recovery-timing.md)证据。

## 6. 项目关联与未决项

这些事实支持一个协调领域组织 HP Damage、EP Damage、HP Healing、EP Healing，但不直接决定领域命名、共同 Request 或最终 Hook API。可以复用应用阶段的语义和状态接续协议，分别保留公式、接收规则、提交与后继。一次 Action／命中中的多次结算仍由内容编排，不能预设所有附加恢复都在主 HP 返回之后。

项目已确认[Calculate 输出计算、Apply 目标接收](../../architecture/vitality.md#1-calculate-与-apply-的语义边界)的共同边界；本节原生事件顺序是机制证据，不是逐项迁移 Hook 的目标。

普通医师与行医的启动选择、混合 HP／EP 排序，以及 Selector 与 Heal 能力同名 ignoreHealFree 字段的不同消费者，已在[案例33](33-targeting-and-targetable-pipeline.md#53-混合-hpep-治疗)补核。本案的治疗作用顺序不能代替这些选择政策；选择豁免和最终 force 接收也不合并。

**零值项目决策（2026-11-03，用户确认）：** 四种业务的最终计算输出为零时，在 Apply 入口拒绝，不进入本笔接收或 Applied；实际资源变化为零则允许成功。满血目标接收正数治疗属于后者。具体契约见[Calculate 与 Apply 的语义边界](../../architecture/vitality.md#1-calculate-与-apply-的语义边界)。

其余政策保持：healFree 只限制 Targeting；显式治疗不因此新增接收免疫；自然回复不派发普通治疗 Hook；既定死亡通知顺序、弱点完整双 Calculate 与 Burst 生命周期不变。上述政策与原生的差异已分别标明，不通过调查静默修改。

未知项包括活跃 XLua、特化 GameMode／force／skip组合、额外生命和 HP override、全部治疗加成来源、桑葚外部 TraitData 的0.5参数与所有动态资格组合。研究限定普通 native 与所选资源，没有运行完整客户端；不据字段名称补齐未知结论。
