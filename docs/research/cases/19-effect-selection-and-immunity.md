# Effect 索敌与异常免疫

研究日期：2026-10-21。本轮核对“为施加效果而索敌”的实际需求、索敌排除与施加／生效免疫的区别；不设计或实现新的 Effect API。

证据来自本机客户端的原生 C# fallback 和实际 Prefab，没有执行实机注入或核实活跃 XLua 替换。二进制身份、精选指令、内容配置及校验值见 [manifest.json](../evidence/effect-immunity-20261021/manifest.json)。

## 1. 为施加状态而排除免疫目标，确有实际内容

### 爱丽丝二技能：免疫者不占两个名额

实际配置闭合：

```text
Iris S2 的 RangedAttack
  → AdvancedSelector：postFilter=31，maxNum=2
  → projectile_chr_iris_s2_1
  → 结束附加 Buff iris_s_2[sleep]，abnormalCombos=[SLEEPING]
```

原生调用链：

```text
AdvancedSelector.OnPostFilter [74238]
  → FilterUtil.Filter [74633]
  → FilterFunc 31 [74679]
  → Attributes.CheckAbnormalComboImmune(SLEEPING)
       ├─ 免疫：丢弃候选
       └─ 不免疫：计算排序权重，竞争两个名额
```

闭合泛型的派发体确认：FilterFunc 返回 false 后直接进入下个候选，跳过堆插入及 k 个名额裁剪。因此不是“先选两个，再让睡眠施加失败”。普通攻击仍可选中该免疫者。

定位：`FilterUtil._Filter_HatredDesExcludeImmuneSleeping` [74679] `0x1809dd850`；`0x1809dd8ea` 调用 `CheckAbnormalComboImmune`；泛型 `Filter` 体 `0x1844f9140` 中 `0x1844f938b` 的失败分支跳过名额处理。枚举值与泛型映射见 [selection/REPORT.md](../evidence/effect-immunity-20261021/selection/REPORT.md)。

[PRTS 爱丽丝页面](https://prts.wiki/w/Iris) 也明确记录二技能无法选择沉睡免疫或已沉睡的目标。此处 Wiki 用于交叉核对；“免疫者不占名额”的执行顺序依据原生指令与真实限额配置。

### 卡夫卡一技能：睡眠与伤害不共用一条资格

实际睡眠子动作使用相同的 Filter 31；后续伤害选择器的 postFilter=0，未采用这项睡眠免疫排除。不能把“对睡眠免疫”统一解释成“整个技能不能选中”，也不能要求所有附加控制的攻击先排除控制免疫者。

实际配置与路径见 [content/REPORT.md](../evidence/effect-immunity-20261021/content/REPORT.md)。

## 2. 光环确实索敌，但不一定检查传入 Effect 的身份

### 爱丽丝的原生 Purpose 补核

不能把下述光环配置中的 purposeMask=0 泛化为爱丽丝二技能也使用 NONE。其实际组件是 RangedAttack，父类为 AbstractBasicAttack；后者的 `GeneratePurposeMask` [90311] 在 `0x180e9ae11` 调用基础生成逻辑后，于 `0x180e9ae16` 执行 `or eax, 1`，即附加 DAMAGE 位。睡眠免疫仍由 Filter31 独立查询，未变成一个 EFFECT Purpose。这一结论针对原生生成路径，未核实活跃 XLua 替换。

实际技能 Prefab 包含：

| 内容 | 验证器／配置 | 已证实的含义 |
| --- | --- | --- |
| 空 S2、浊心斯卡蒂 S2／S3 鼓舞 | FilterBuffTargetValidator，排除 immune_to_encourage，purposeMask=0 | 通过目标当前标记排除，不依赖入站 Buff ID |
| 闪灵 S3 防御光环、夜莺 S3 法抗光环、空 S1 睡眠光环 | 普通 TargetValidator，purposeMask=0 | 纯效果目标选择不需要 DAMAGE／HEAL Purpose |

`FilterBuffTargetValidator.Validate` [75545] 先检查普通 TargetValidator，再调用 `Entity.CheckOneOfFilterBuffs` [66604]；后者遍历配置的键并调用 `BuffContainer.ContainsBuff`。`_excludeKey` 控制是否反转结果。它不是试装一个新 Buff，也没有从 TargetRequest 读取被施加的 Effect ID。

空和浊心斯卡蒂的实际 Character Prefab 都通过 `commonAbilities → PassiveBuffAbility` 添加 `immune_to_encourage`。该标记的模板为 empty，属性／异常免疫／异常抗性数组为空。这里的已证实路径是内容标记配合光环 Filter；不能仅凭这个名字把它当成通用施加层免疫，也未穷尽所有热更新或硬编码消费者。

定位与具体 PathID 见 [root/REPORT.md](../evidence/effect-immunity-20261021/root/REPORT.md) 和 [content/REPORT.md](../evidence/effect-immunity-20261021/content/REPORT.md)。

## 3. 拒绝整个 Buff 与抑制异常生效是两种机制

原生至少区分以下行为，不能全部翻译成 `canInstallEffect(): boolean`：

| 行为 | 原生证据 | 粒度 |
| --- | --- | --- |
| 安装前拒绝 | NewBuff [65310] → _CheckThroughBuffAbnormalAnti [65363]；传入 abnormalFlags 任一被目标 GetAbnormalAnti 禁止即拒绝 | 整个输入 Buff，在 Reset／OnStart 前返回 null |
| 移除已有异常 Buff | 安装带 abnormalAnti 的 Buff 后，_FilterBuffAbnormalAnti [65367] 检查旧 Buff；交集成立则 MarkFinish | 整个相交旧 Buff |
| 异常免疫 | Attributes.GetAbnormalFlag [64279] 等查询按当前免疫状态抑制异常结果 | 异常状态的有效性，不等同于删除或拒绝整个 Buff |

因此，一个复合 Effect 中某项异常不生效，不足以推导该 Effect 的其余状态、回调和生命周期都应该消失。实际模板及上述指令见 [immunity/REPORT.md](../evidence/effect-immunity-20261021/immunity/REPORT.md)。本轮不要求复刻 Anti／Immune 的内部命名或计数存储，只要求后续模型保留已证明的行为区别。

## 4. 结论与项目对应

选择名额前排除免疫者、拒绝整个 Buff、移除旧异常 Buff和抑制异常生效是不同原生语义。睡眠 Filter 查询异常资格，鼓舞 Filter 查询当前内容标记，均不能用入站 Effect Definition ID 统一代替。

这些结果不决定项目是否采用原生 Purpose、Anti／Immune 枚举或一套通用施加流程。项目选择与 Effect 边界见 [Targeting](../../architecture/targeting.md)和[Effect](../../architecture/effect.md)；具体机制仍须在选择、施加与生效各自适用的时点读取资格。
