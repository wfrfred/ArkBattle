# 战斗伤害、属性、Buff 与效果生命周期核查

核查日期：2026-10-07。仓库基线：`3f35bfd` 及当前目录整理工作树。本报告只记录事实、证据与当前表达范围，不确定最终目录或 API。

本报告给出交战领域概览。安装／父作用域、行动／弹道、派发／嵌套的具体执行轨迹与已确认协议见[第一轮案例](cases/00-INDEX.md)；本篇末尾未决项按这些案例继续收窄。

## 证据范围

主要来源是本机官方 Windows 客户端的 `GameAssembly.dll`、IL2CPP metadata、实际 AssetBundle 中的 prefab 与 `buff_template_holder`。资源 manifest 为 `V077`，`versionId=26-08-16-14-00-43_415873`。这是资源版本，不是客户端可执行文件的版本号。

[持久化客户端摘录](evidence/client-excerpts-20261007/records.json)记录 manifest、二进制文件 SHA-256、部分方法索引及维什戴尔模板字段。下面另外保留属性、减伤、生命流失的短字段摘录，相关批次的输入与复现范围见[归档说明](evidence/client-excerpts-20261007/README.md)。方法索引只对所记录二进制成立。

证据强度分为：

- **A：原生实现直接确认。** 字段、枚举、实际调用顺序、计算和条件分支；没有展开对应 Lua/hotfix 分支，也没有据此声称已复现全部实战。
- **B：模板与原生执行器共同确认。** 实际配置选择某个动作，再由原生执行顺序解释；比单看技能文案或节点名强，但仍需核对其调用场景。
- **C：社区互证或未完成路径。** 社区资料帮助定位案例，不能替代尚未展开的能力调度、状态切换和统计路径。

本次临时提取入口为 `stronghold-inspect-client.py`、`stronghold-client-logic-types.py`、`stronghold-official-pathfinding/audit_client.py`、`stronghold-prefab-audit.py`；关键结果已经摘录到本文与上述 JSON。没有进行战斗注入或修改官方客户端。

## 属性与伤害不是同一个倍率集合

**A。** `AttributeModifierData.AttributeModifier.FormulaItemType` 的原始枚举与属性位置如下：

| 原始值 | 位置 | 有效贡献的组合 |
| --- | --- | --- |
| `ADDITION=0` | 百分比计算前的加算 | 累加 |
| `MULTIPLIER=1` | 基础百分比 | 百分比累加，再加 1 |
| `FINAL_ADDITION=2` | 百分比计算后的加算 | 累加 |
| `FINAL_SCALER=3` | 最终属性倍率 | 连乘 |

`Attributes._CalculateAttributeValue`（63722）先汇总当前有效 modifier，再执行：

```text
((base + Σ addition) × max(0, 1 + Σ multiplier) + Σ finalAddition)
× Π finalScaler
```

最终还应用该属性自身的范围限制。原始 `FINAL_SCALER.value` 的规范化由 `SharedUtils.ProcessFinalScaler` 参与处理，不能认为原始字段始终已经是可以直接相乘的数值。`loadFromBlackboard` 也说明数值可能来自运行参数，而非模板常量。

**B。** 实际 `[uc]skills` 的 `bldsk_s_2`（对象 5978367411090055933）有 `attributeType=ATK(1), formulaItem=MULTIPLIER(1), loadFromBlackboard=true`。这是华法琳二技能的属性百分比贡献，不是最终 HP 伤害倍率。

空／浊心斯卡蒂使用 `atk_to_atk[final_addition]`。该模板在 `Buff.OnTrigger` 派发的触发事件 2 中先检查来源属性是否变化，再结束旧派生 Buff、创建新的 `encourage[atk]`。触发频率由实际 Buff 的配置决定，不能仅凭事件编号认定每 tick 执行。所创建 modifier 的原始字段投影为：

```json
{
  "attributeType": "ATK",
  "formulaItem": "FINAL_SCALER",
  "loadFromBlackboard": true,
  "fetchBaseValueFromSourceEntity": true
}
```

**A+B。** `Buff._LoadAttributesModifier`（64674）在上述来源属性分支调用 `source.attributes.GetValue`，将来源值与比例合成后写入目标的最终加算数组。因此此处不是对目标 ATK 直接乘 `FINAL_SCALER`。模板还明确存在刷新时点，不能统一改成“每次属性查询都读取来源最新数值”。

“白值加成”是玩家描述，不能唯一指定某组：等级、信赖、潜能、模组或关卡预处理可能先决定基础数据，Buff 再作用于上述位置。属性归并前还要处理覆盖、叠层与启用资格。社区的四组公式可作互证：[游戏数据基础](https://prts.wiki/w/游戏数据基础)。

### MaxHP 响应与默认法抗范围

**A。** `Entity.OnAttributeDirty`（66111，`0x1807044e0`）的 MAX_HP 分支执行 `hp / oldValue × maxHp → set_hp`，见[原生段](evidence/numeric-parameters/66111-OnAttributeDirty.asm#L147)。`Attributes.MarkAttributeDirty`（63717）把旧的有效值缓存交给回调；回调内 `get_maxHp` 重算新的有效值。初始化则先 Reset，再直接写入 initHp，不从未初始化的旧上限缩放。

普通 HP 写入由 `SetHpInternal`（66039）限制到上限；`alive=false && !force` 时拒绝，因此 MaxHP 变化不会复活零 HP 单位。项目在同一公开生命周期 operation 的所有 bindings 完成后协调一次，早于 enable／disable 回调和内容后继。无有效变化时保留 HP；安装、载荷更新、启停、结束和清理使用同一边界。这属于 Vitality 参数响应，不派发 Damage 或 Healing。

官方 metadata 的 `maxHp` 字段为 `AttributeMetaAttribute(MAX_HP=0,min=1f)`，`magicResistance` 为 `AttributeMetaAttribute(MAGIC_RESISTANCE=3,min=0f,max=100f)`；[原始 blob、字段 token 与偏移](evidence/numeric-parameters/attribute-meta-evidence.json)保留了解码来源。63722 在四组归并后限幅，Damage 再解释本次固定／比例穿透；共享数值代数不裁剪这些领域值。

`OverrideDataRange`（63697）能够覆写属性范围，因此 `[0,100]` 是法抗默认范围，并非所有内容都无法突破的硬规则。首批保留默认区间，特殊覆写待真实内容接入。MaxHP 首批只接受固定载荷与显式维护投影，查询不依赖任意实时 provider；否则依赖改变后缺少参数响应的确定时点。[PRTS 基本属性](https://prts.wiki/w/游戏数据基础#基本属性)互证 MaxHP 保比例与上述默认范围。

## 单次 HP 伤害与接收过程

**A。** `BattleFormula.AttackInfo` 独立保存 `originAtk / atk / atkScale / atkAddition`；`GetFinalAtk`（64366）计算：

```text
power = max(0, atk × atkScale + (atkScale > 0 ? atkAddition : 0))
```

`atkAddition` 在防御计算前加入，不等于有效 ATK 的加算，也不是防御计算后的固定 HP 伤害。`logos_t_2[core]` 在 `ON_BEING_CALCULATE_DAMAGE`（事件 73）挂 `AtkAdditionUpBeforeCalcDamage`，并过滤 `MAGICAL`；这是实际内容案例。

`BattleFormula.CalculateDamage`（64345）可分别触发来源和目标的计算前事件；其非 hotfix 分支调用顺序的摘录是：

```text
source.OnCalculateDamage
target.OnBeingCalculateDamage
BattleFormula.CalculateDamageNoEvent
source.OnAfterCalculateDamage
```

这些调用由 `triggerSourceEvent / triggerTargetEvent` 控制，不是每个入口无条件执行。`CalculateHeal` 还会以 HEAL 类别借用无事件数学入口，不能因此把治疗的完整接收过程归为伤害。

**A。** `CalculateDamageInternal`（64347）读取当前 DEF／法抗；先减固定穿透、限制非负，再乘剩余比例。正常穿透比例下：

```text
effectiveDef = max(0, DEF − fixedPenetration) × (1 − proportionalPenetration)
effectiveRes = max(0, RES − fixedPenetration) × (1 − proportionalPenetration)
physical = max(0.05 × power, power − effectiveDef)
magical  = max(0.05 × power, power × max(0, 100 − effectiveRes) / 100)
pure     = power
```

降低目标 DEF／法抗会改变目标属性，穿透只影响本次输入，两者不能合并。5% 保底位于基础公式；后面的规则仍可以将伤害降到更低或取消。

**B。** `buff_template_holder` 中几个实际模板的字段投影：

| 模板 | 事件 | 动作与资格 |
| --- | --- | --- |
| `damage_scale[out]` | `ON_OUTPUT_DAMAGE=11` | `DamageScale`，输出修正 |
| `damage_scale[input]` | `ON_TAKE_DAMAGE=10` | `DamageScale`，`ANY_ATTACK_EXCEPT_ELEMENT` |
| `damage_resistance` | 10 | `DamageScale`，`PHYSICAL_AND_MAGICAL`，`_isOneMinus=true` |
| `damage_reduce_pure` | 10 | `DamageFixedValueResistance`，`PURE` |
| `damage_reduce_element` | 10 | `DamageFixedValueResistance`，`ELEMENT` |
| `damage_scale[ep]` | `ON_APPLYING_MODIFIER=6` | `IsElementDamage → EpDamageScale`，修改 EP 损伤 |
| `skadi2_s_1[protect]` | 10，优先级 −2000 | `DamageSplit → DamageScale` |

`damage_scale[ep]` 不等于 HP 元素伤害易伤；要结合 Modifier 目标与动作判断。Friston-3 的 `damage_reduce_all[limit]` 实际会生成各伤害类别的固定减伤，真伤和元素 HP 伤害也包含在内。真伤忽略防御／法抗，不代表绕过所有接收规则。

**A。** `Buff.SortedDoubleBufferedBuffList.Add`（64708）按 `onEventPriority` 从高到低插入；相同优先级，新元素插在原有元素之后。`BuffContainer.OnTakeDamage`（64807）与 `Buff.OnTakeDamage`（64595）依次执行动作，后续读取已修改的 Modifier。不能把全部受击倍率先抽出汇总再统一扣屏障。

例如基础伤害 700、倍率 2、屏障余量 500，`(700−500)×2=400` 与 `700×2−500=900` 不同。这是对顺序要求的数值说明，不是新定义某名干员的固定顺序。社区伤判优先级和获得顺序整理可作互证：[伤判效果](https://prts.wiki/w/伤判效果)。

**A+B。** 无敌、闪避、次数盾、屏障、免死、分担分别涉及取消、次数／额度消耗、HP 下限或额外接收者。官方 Modifier 另存取消原因和实际变化。`Entity.SetHpInternal`（66039）处理免死下限；免死不等于无敌。

生命流失也不是独立数学伤害类别。华法琳二技能所用模板的短摘录为：

```json
{
  "templateKey": "periodic_damage_by_hp_ratio[skip_modifier_fix]",
  "node": "DamageViaMaxHpRatio",
  "_damageType": "PURE",
  "_skipModifierEvent": true,
  "_noSourceDamage": false,
  "_ignoreForSp": true
}
```

`Entity.ApplyModifier`（66079）为跳过常规 Modifier 事件的路径保留专门处理；它也不同于直接 `SetHpDirectly`。不能以一个“生命流失”名称承诺统一免疫、盾或反应政策。

## 治疗、回复与元素

**A。** `BattleFormula.CalculateHeal`（64352／64353）分别从来源当前 ATK 或明确给定的 ATK 构造 HEAL 数学输入。`Entity.OnTakeHeal`（66122）检查 `HEAL_FREE`，`force` 可绕过该检查，并另外发出治疗接收事件。数学结果、接收许可、最终实际回复量是不同事实。

当前没有穷尽持续生命再生、强制回复、恢复 Modifier 的事件配置和作战统计归因。因此不能认为所有 HP 增加都等于医疗行动，也不能把展示 HEAL 事件数量或 amount 之和当成已核对的官方治疗统计。

**A。** 普通官方 `Entity` 基类保存 `m_epArray` 与 `EPController`，`Entity.Init`（66038）初始化独立的各类 EP。默认 maxEp 为 1000；`Enemy.get_maxEp`（75471）另按敌人类别增加 `ENEMY_EXTRA_EP`，本机 BOSS 追加 1000。拥有存储与当前接收资格、UI 显示不是同一件事。

| 机制 | 状态变化 | 原始抵抗字段 |
| --- | --- | --- |
| 元素损伤 | 降低 EP，耗尽触发爆发 | `EP_RESISTANCE / epResistance` |
| 元素伤害 | 扣 HP，`DamageType.ELEMENT` | `EP_DAMAGE_RESISTANCE / epDamageResistance` |
| 元素治疗 | EP 回复 Modifier | 不应复用“HP 未满”资格 |

`ElementType` 是 `NONE / SANITY / WATER / FIRE / DARK / ANGER`，并非 HP 的 DamageType。`CalculateElementDamage`（64351）读取损伤抵抗；`CalculateDamageInternal` 的 ELEMENT 分支读取元素抗性。不能因两个原生方法都含 damage 就视为一个领域。

`BattleUtil.CheckElementModifierValid`（77311）排除中立对象；`Entity.OnTakeEPDamage`（66123）还检查 `ELEMENT_FREE_ALL` 和不可伤害条件。爆发由共享 `EPController` 管理，恢复期间通过其 abnormal mask（66178）提供 `ELEMENT_FREE_ALL`，结束后恢复各条 EP；强制入口和全部热更新未穷尽。不能让 core 的 Vitality 自动包含元素接收资格。

原生 `Modifier.NewElementHeal`（70172）使用 EP 目标类型，`DoApplyModifier`（66095）的 EP 加算分支处理元素回复。社区的元素状态整理仅作互证：[元素](https://prts.wiki/w/元素)。

## Buff 的身份、覆盖与生命周期

**A+B。** 原始 Buff descriptor 至少包含以下相互独立的轴：

| 轴 | 已读取的原始字段或路径 |
| --- | --- |
| 内容与参数 | `buffKey / templateKey / loadFromDB / blackboard` |
| 覆盖、叠层、独立来源 | `disableOverride / overrideKey / overrideType / independentCharacterSource / maxStackCnt / maxValidStackCnt` |
| 覆盖优先级 | `priority / priorityBBKeys`，由 `_CalculatePriority` 处理 |
| 动作排序 | `overrideOnEventPriority / onEventPriority` |
| 时限、触发与延长 | `lifeTimeType / durationKey / takeSnapshotWhenExtend / triggerLifeType / triggerInterval` 等 |
| 结束传播 | owner finish、ability detach、parent Buff 派生关系及对应清理策略 |

`BuffData.OverrideType` 的原始值为 `DEFAULT=0 / STACK=1 / UNIQUE=2 / EXTEND=3 / EXTEND_TIME=4`。它不是一个统一“取最大倍率”的枚举。实际模板还包含达到层数上限是否刷新时限、到期是否清空全部层数等条件。

需要区分：哪些实例存在、哪些实例当前生效、实例怎样延长／叠层、有效动作如何排序。事件优先级不决定覆盖胜者；获得顺序也不能代替内容的覆盖优先级。各 override 分支的完整行为尚未逐一逆向，不在此补写猜测。

**A+B。** 派生关系有独立于 Unit 的生命周期。`Buff.AddDerivedBuffSafe`（64560）检查父 Buff 是否已结束；`finishDerivedBuffIfParentFinish` 只控制绑定时父已结束的分支，不保存为未来传播开关。成功绑定后，父 `MarkFinish`（64548）经 `ClearDerivedBuffsIfNot` 同步标记子结束并撤销贡献；ON_FINISH、容器移除与回收另有完成路径。详细区别见 [Case A](cases/01-buff-installation-and-parent-scope.md)。

维什戴尔残影 `wisdel_t_1[bomb]` 的 ON_START 检查来源父天赋 `wisdel_t_1`，然后 `AttachAsDerivedBuffById`，`_finishDerivedBuffIfParentFinish=true`。token 版本会绑定宿主的天赋。来源 Unit 仍在场时，父 Buff 也能结束；仅有 `UNIT / EXECUTION` 生命周期 owner 不能直接完整表达这条关联。

残影 prefab 另有 `overrideType=UNIQUE(2), maxStackCnt=1, independentCharacterSource=false`。这是覆盖与来源分组事实，不能因为生命周期挂在某来源父 Buff 就自动按来源独立叠层。

## 维什戴尔对事件位置与资源的约束

**A+B。** 持久化摘录已经保存两个关键模板和方法入口；短调用序列如下：

```text
Projectile.ActionController.OnHitTarget（70602）
  _AttachBuffs
  AbilityAttachment.Apply
  _AttachExtraBuffWhenStopHit
  _RunActions(HIT_TARGET)
```

因此主弹残影在本目标的命中处理内、伤害动作前附着；不是纯索敌返回时，也不是伤害成功后。余震的 extra Buff 在余震伤害动作前执行：

```text
wisdel_t_1[projectile_shock].ON_START
  Dice(prob)
  CheckContainsBuff(wisdel_t_1[bomb], checkBuffSource=false)
  AOEDamage(PHYSICAL, radius=1.1, bomb_atk_scale, 附晕眩)
  AlwaysNext → 视觉／声音
  FinishBuffsById(wisdel_t_1[bomb], checkBuffSource=false)
```

`ActionUtil.RunActions`（99407）按列表顺序携带前一步成功值；默认 executeCondition 为前一步成功。官方模板把随机判定放在残影检查之前，这是来源事实，不是项目必须复刻的 RNG 消费协议。

项目可以先执行纯残影检查，无残影时省略抽样；前提是保持爆炸概率、条件依赖和后续动作语义。仅改变后续伪随机序列不构成兼容缺陷。概率 0／1 是否消费 RNG 不再列为待研究项；随机结果影响目标选择、状态变化或具有玩法含义的重复／关联时，才需要研究具体依赖和执行顺序。

引爆查询不限制残影来源，爆炸来源与残影父生命周期来源是不同事实。S3 锁定 selector 同样 `_filterBuffSource=false`；准备阶段可以写共享标记，再进行纯查询。辅助能力完整调度与结束／中断清理路径未穷尽，不能据此宣布必须新增全局 AttackInstanceId。

主伤害、余震和天赋爆炸具有不同的倍率选择与步骤，不需要扩展一个无限增长的全局 component 枚举。维什戴尔的案例和未完成路径另可与[干员资料](https://prts.wiki/w/维什戴尔)互证，社区描述不替代原生时点。

## 概念边界的研究约束

| 概念 | 事实要求 |
| --- | --- |
| Subsystem | 拥有领域公式、流程与接收政策；不应成为内容节点的全域解释器 |
| 即时效果操作 | 一次 Damage／Healing／状态施加等转换，可以没有跨 tick 实例 |
| 持续 Buff／附着实例 | 保存身份、来源、父作用域、顺序、时限、层数、可消耗状态等事实 |
| 参数贡献 | 由消费领域登记载荷／程序关联及必要参与事实，按所属公式组合；登记不等于生效或注册常量 |
| 事件注入 | 接收领域定义阶段、排序与资格，内容编译绑定行为，执行 context 管候选作用域；不让 Buff core 解释全部领域阶段 |
| Resources | 保存编译行为、注册关系和可重建缓存，不能捕获上一次目标／HP／随机状态 |
| 空间投影 | 由实例和当前空间事实派生，不能把投影与产生它的机制实例当成同一身份 |

有效值归 Offense／Defense、Vitality、Locomotion 等消费领域查询，不设统一 Attributes 状态或独立 subsystem。当前静态配置在实际接收贡献后可以增加领域 State，Catalog 仍只处理组合生命周期。共享数值代数不改变事实归属。

贡献区分固定值、周期或指定时点采样、状态变化维护投影、实时纯 provider。鼓舞采样贡献由 Offense 持有，Buff 保存关联；Projectile.cachedAtk 归在途过程。若 Buff 私有历史输入生成多个领域结果，则该输入为唯一权威事实，结果为同一 transition 维护的投影。停用仅停止参与，恢复旧样本／重新采样依具体程序确定；纯查询不触发更新或 RNG。

原始节点 `CreateEffect` 还常用于视觉效果；仓库的 `EffectDefinition` 是即时战斗效果描述，`EffectInstance` 则用于持续附着。词相同不代表所有操作都必须创建实例，或所有实例都必须由 Damage 推进。

固定属性组与有序事件共存：明确可汇总的位置使用领域归并；接收链保留中间值和实例顺序。取消、零伤害、全吸收、实际扣血与新死亡应分开。安装拒绝／取消伤害是正常结果，保留已完成前缀；未处理异常或明确 tick abort 才放弃整 tick 工作事实。后续行为还要按具体机制区分立即嵌套结算、当前内容下一步骤和未来 tick，不能由一个无时序语义的通用队列统一决定。

## 当前实现范围与差距

以下核对 `3f35bfd` 及当前目录整理工作树，区分已经成立的结构与尚未覆盖的官方内容；未实现本身不等于职责错误。

| 当前模块 | 已有范围 | 尚未覆盖／必须继续约束 |
| --- | --- | --- |
| [数值代数](../../src/core/modifier/numeric.ts) | 四组规范化贡献与纯求值 | 原始值解释、属性各自范围与刷新时点由领域编译／调用侧确定 |
| [Offense](../../src/core/unit/capability/offense/query.ts)／[Defense](../../src/core/unit/capability/defense/query.ts)／[Vitality](../../src/core/unit/capability/vitality/query.ts) | 各 capability 持有已登记贡献；按身份查询当前视图；固定／采样／维护投影无需资源，实时 provider 注入纯求值资源 | 不扩展统合属性管理器；maxHp 改变时现有 HP 的保持／比例规则未核对 |
| [Damage](../../src/core/unit/capability/vitality/damage/settlement.ts) | 计算前、输出、接收、结果反应；当前防御与穿透；实际扣血／取消／免死报告 | 只支持物理／法术／真伤；skip 接收政策、元素与全部取消后继契约未覆盖 |
| [Healing](../../src/core/unit/capability/vitality/healing.ts) | 专属接收资格、HEAL_FREE、当前 maxHp、实际治疗量与 nullable 来源 | 持续回复、元素医疗、治疗量修正与官方统计事件路径未覆盖 |
| [Action 编译](../../src/core/unit/capability/action/compile.ts)／[执行](../../src/core/unit/capability/action/execution.ts) | 编译、有序步骤、绑定与当前工作事实；自定义步骤可重新查询 | 默认仍先绑定再同步执行；跨 tick 行动／投射物身份与中断未实现 |
| [资源装配](../../src/core/battle/resources.ts)／[伤害规则资源](../../src/core/unit/capability/vitality/damage/resources.ts) | 编译登记装配与领域规则已分开；有限阶段规则、稳定排序与强度组政策保留 | 活跃候选身份范围仍待接入执行 context；静态 `{id,strength}` 不等于完整 override |
| [实例](../../src/core/unit/capability/effects/instance.ts)／[程序](../../src/core/unit/capability/effects/program.ts)／[登记](../../src/core/unit/capability/effects/registry.ts) | 数据实例、来源与 owner、类型关联及纯数据快照；可重建程序分开保存 | owner 仅 Unit／Execution，缺少父实例关系；完整跨进程定义版本重建另议 |
| [附着值操作](../../src/core/unit/capability/effects/lifecycle.ts)／[贡献绑定转换](../../src/core/unit/capability/effects/transition.ts) | 简单安装、移除、过期、owner 清理；更新当前私有事实并同步维护投影 | 完整登记／接纳／禁用／恢复、父传播、周期与结束动作仍未实现 |
| [Work](../../src/core/battle/execution/work.ts) | 逐笔当前事实、固定基线关系、execution 与独立生命周期结果；创建后移除不依赖净差分保留历史结果 | 不成为全域 Effect System，不替代权威提交与调度，也不使全部空间关系 live |

目录与文件分块反映领域所有权。[CombatResources](../../src/core/battle/resources.ts) 只装配编译登记；固定贡献的有效值从领域事实直接求值，不需要先构造 Work 或依赖整局资源。第 1 步当前事实与贡献已完成，目录整理不代表后续生命周期协议已经接入。

现有[程序回归](../../test/sim/combat-program.test.js)验证非生命目标的自定义效果、逐步重新绑定、执行时读取贡献、快照无函数、资源注入、屏障与 RNG 原子回滚、过期和 Unit owner 清理；这些证据不证明维什戴尔完整实现或官方全时序兼容。

## 尚未核对的内容

- 各 overrideType、动态 priority、失效／启用及层数时限的完整状态机，尤其相同来源与不同来源如何建立覆盖组。
- MaxHP 与法抗以外属性的最终限制、具体内容如何覆写范围，以及特殊强制 HP 接收政策。
- Case A 的 S3 鼓舞和 Case B 的两种 ATK 策略以外，各操作数与内容模式的采样／刷新契约。
- Healing／持续回复／元素治疗的全部事件、取消与统计归因路径。
- Case C 的分担 skip 入口与泥岩取消后继以外，其他 HP／EP 接收入口、死亡移除与后继资格。
- 父 Buff／辅助能力／执行记录／Unit 的结束传播及通知顺序，延迟回收与实际退场的区别。
- 元素爆发的各类型模板、恢复计时、最新热更新分支以及哪些内容属于卫戍支持范围。
- 维什戴尔辅助锁定的开始／结束与中断语义；AoE 目标结算顺序是否影响后续反应或其他可观察结果。无语义影响的 coroutine 调度细节与 RNG 消费轨迹不要求复刻。

## 原生证据索引

| 结论 | 可定位入口（括号为本机 metadata 方法索引） |
| --- | --- |
| 属性四组、来源转换 | `Attributes._CalculateAttributeValue`（63722）、`Buff._LoadAttributesModifier`（64674） |
| 输入、穿透、防御 | `AttackInfo.GetFinalAtk`（64366）、`BattleFormula.CalculateDamage`（64345）、`CalculateDamageInternal`（64347） |
| 治疗输入／接收 | `BattleFormula.CalculateHeal`（64352／64353）、`Entity.OnTakeHeal`（66122）、`Modifier.NewElementHeal`（70172） |
| 元素区分与恢复 | `Entity.Init`（66038）、`OnTakeEPDamage`（66123）、`EPController.get_abnormalFlagMask`（66178）、`BattleUtil.CheckElementModifierValid`（77311） |
| 有序受击／生命提交 | `SortedDoubleBufferedBuffList.Add`（64708）、`BuffContainer.OnTakeDamage`（64807）、`Entity.ApplyModifier`（66079）、`SetHpInternal`（66039） |
| 派生生命周期 | `Buff.AddDerivedBuffSafe`（64560）、`Buff.OnFinish`（64568）、`BuffContainer._FinishBuff`（64788） |
| 内容动作顺序 | `Projectile.ActionController.OnHitTarget`（70602）、`ActionUtil.RunActions`（99407）；模板摘录见 evidence JSON |
