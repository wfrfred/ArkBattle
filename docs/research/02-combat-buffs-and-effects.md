# 战斗伤害、属性、Buff 与效果生命周期核查

初始核查：2026-10-07；后续批次分别记录版本。本篇保留属性和具体内容的早期原生锚点；资源全链以 [Case 37](cases/37-resource-mechanism-coverage.md)及其专题为准。

本报告给出交战领域概览。安装／父作用域、行动／弹道、派发／嵌套的具体执行轨迹与已确认协议见[第一轮案例](cases/00-INDEX.md)；本篇末尾未决项按这些案例继续收窄。

## 证据范围

主要来源是本机官方 Windows 客户端的 `GameAssembly.dll`、IL2CPP metadata、实际 AssetBundle 中的 prefab 与 `buff_template_holder`。资源 manifest 为 `V077`，`versionId=26-08-16-14-00-43_415873`。这是资源版本，不是客户端可执行文件的版本号。

[持久化客户端摘录](evidence/client-excerpts-20261007/records.json)记录 manifest、二进制文件 SHA-256、部分方法索引及维什戴尔模板字段。下面另外保留属性、减伤、生命流失的短字段摘录，相关批次的输入与复现范围见[归档说明](evidence/client-excerpts-20261007/README.md)。方法索引只对所记录二进制成立。

2026-11-10 对 Attribute descriptor、Buff 合并与覆盖组的有限补核使用[独立输入指纹与当前索引](evidence/unit-audit-20261110/buff-attributes/README.md)，机制结论集中在 [Case A 第 8 节](cases/01-buff-installation-and-parent-scope.md#8-2026-11-10-补核属性-descriptor合并与覆盖组)。该批没有运行客户端或补齐每个模板的实际启用链。

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

**A，2026-11-10 默认范围补核。** 当前 `AttributesData` 原始 AttributeMeta、`Attributes.Reset`（65235）建立范围、`_CalculateAttributeValue`（65262）最终 Clamp，以及普通 Entity getter 已连起来核对：MaxHP 下限 1、DEF 下限 0、RES 为 0–100，两种元素抗性（31／32）也均为 0–100。[原始 blob、受限解码及消费链](evidence/unit-audit-20261110/coordinates-numeric/native.json)。这是默认原生范围，不排除显式范围覆写或 XLua。

HP 元素公式（65900）与 EP 损伤公式（65904）另读取 `BattleFormula.MIN_ATK_FACTOR`；当前静态初始化（65915）写入 0.05，最终按此取最低伤害。**属性上限 100 与公式 5% 保底是两项事实。** 属性查询与伤害公式不能据此合并为同一限幅；项目契约见 [Resource](../architecture/resource.md)。

**A，2026-11-10 补核。** `_LoadAttributesModifier`（66234）在黑板查找失败时回退 descriptor.value，显式 0 不回退；先将 operand 乘层数，再处理来源采样与负 FINAL_SCALER 的 `1+x` 修正。source 无效时跳过需要来源的 descriptor；source 分支的四种写槽及指令锚点见 [Case A §8.1](cases/01-buff-installation-and-parent-scope.md#81-原始属性-operand-的解释)。BAT／移速的单位换算不改变上述原生写槽含义。

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

普通 HP 写入由 `SetHpInternal`（66039）限制到上限；`alive=false && !force` 时拒绝，因此该普通 MaxHP 响应不会复活零 HP 单位。完整 setter 与负生命交互见 [Case 39](cases/39-death-attribution-and-attribute-ranges.md)。

官方 metadata 的 `maxHp` 字段为 `AttributeMetaAttribute(MAX_HP=0,min=1f)`，`magicResistance` 为 `AttributeMetaAttribute(MAGIC_RESISTANCE=3,min=0f,max=100f)`；[原始 blob、字段 token 与偏移](evidence/numeric-parameters/attribute-meta-evidence.json)保留了解码来源。63722 在四组归并后限幅，Damage 再解释本次固定／比例穿透；共享数值代数不裁剪这些领域值。

`OverrideDataRange`（63697）能够覆写属性范围，因此 `[0,100]` 是法抗默认范围，并非所有内容都无法突破的硬规则。实际范围覆写正例与 MaxHP 后继见 [Case 39](cases/39-death-attribution-and-attribute-ranges.md)。[PRTS 基本属性](https://prts.wiki/w/游戏数据基础#基本属性)互证 MaxHP 保比例与上述默认范围。

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

`Entity.ApplyModifier`（66079）为跳过常规 Modifier 事件的路径保留专门处理；它也不同于直接 `SetHpDirectly`。2026-11-13 已用实际物理／法术／真实内容补核公式、计算事件、skip 剩余回调与普通 setter，见[案例 11 第 6 节](cases/11-damage-apply-and-hp-application.md#6-生命流失补核2026-11-13)。流失仍可能计算 DEF／RES 并参与计算事件；不能以一个“生命流失”名称承诺统一免疫、盾或反应政策。

## 治疗、回复与元素

HP／EP 治疗、自然回复、生命复原、ES 与同步分别见 [Case 29](cases/29-hp-and-ep-healing-settlement.md)；五类 EP、爆发及恢复见 [Case 25](cases/25-elemental-burst-recovery-timing.md)。基础求值、接收许可与实际资源变化不能互相代替；自然回复不创建普通治疗 Modifier。

初始客户端的治疗、元素与生命方法索引保留在文末，不由旧概览替代后续完整原体和实际绑定。项目当前契约见 [Resource](../architecture/resource.md)、[Vitality](../architecture/vitality.md)及[Elemental](../architecture/elemental.md)。

## Buff 的身份、覆盖与生命周期

安装／开始／生效、父子结束传播、五类重复施加、覆盖组选胜、来源键、层数到期及 Card 身份统一在 [Case 01](cases/01-buff-installation-and-parent-scope.md)维护。普通 modifier 归并、覆盖优先级和事件优先级不是同一种排序；来源 Unit、独立组来源身份及精确父实例也不是同一关系。

对应初始模板与方法锚点见文末及[初始批次](evidence/client-excerpts-20261007/README.md)，后续属性／覆盖组批次各有独立指纹。项目实例、重复施加与生命周期见 [Effect](../architecture/effect.md)及[Lifetime](../architecture/lifetime.md)。

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

主伤害、余震和天赋爆炸具有不同的倍率选择与步骤。维什戴尔的案例和未完成路径另可与[干员资料](https://prts.wiki/w/维什戴尔)互证，社区描述不替代原生时点。

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
