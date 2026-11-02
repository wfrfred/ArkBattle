# 一次攻击的索敌、弹道与伤害结算：妮芙一技能

研究日期：2026-11-02 至 2026-11-03；补查基线 `269584a`。核对官方 Windows IL2CPP 客户端普通 native 分支与真实资源，没有运行完整游戏或验证活跃 XLua 覆盖。首次[附加程序取证](../evidence/attack-addon-order-20261102/README.md)与本次[完整短链取证](../evidence/nymph-action-settlement-20261103/README.md)的 DLL／metadata 指纹一致。

## 1. 问题与结论

问题：从一次典型 Action 的目标选择出发，经过弹道与主伤害，附加 HP 伤害、EP、爆发、通知和死亡分别何时结算？能否先完成 HP Damage，再统一执行附加内容？

**一次攻击由多个有先后关系的业务组成，不是 HP、EP 和 Effect 一起原子提交。** 妮芙 S1 的附加元素伤害先检查既有凋亡爆发，主法术伤害随后独立结算；按该伤害产生的凋亡损伤，在来源的伤害后程序内同步应用。前置条件、接收处理、归零处理和后置报告不能合并成“攻击完成后”这一个时点。

这里“元素伤害”扣除 HP，“凋亡损伤”扣除 EP；后者达到阈值才引发爆发，三者不能混称为同一段伤害。

下列普通路径以 S1 正在生效、来源有效、目标存活并且相关接收允许为前提。取消、致死和来源失效另述：

```text
本次攻击准备：取得目标
→ 启动攻击，等待动画攻击事件
→ 创建弹道，保存目标身份、动作及来源属性备用样本
→ 弹道抵达，对保存的追踪目标尝试命中
→ 来源的弹道命中通知
→ 安装攻击自带的前置 Buff，立即执行其开始程序
    → 检查目标此刻是否已有凋亡爆发
    → 有则先独立结算一段元素 HP 伤害
→ 计算主法术伤害
→ 目标／来源的应用前处理与接收处理
→ 来源的应用前程序：第一天赋登记短延迟监听
→ 写入 HP；若普通致死，同步执行归零、击杀与目标清理
→ 目标应用后通知
→ 来源伤害后通知
    → S1 ActiveEP 计算并应用本击凋亡损伤
    → 若达到阈值，同步启动爆发业务与恢复
→ 返回命中动作

稍后第一天赋监听触发：再检查当前爆发，决定是否附加天赋持续伤害
```

这不是所有攻击的固定模板。它首先说明：不能把全部附加程序固定在完整 Damage 调用返回后，也不能让所有伤害后通知统一等待 EP。

## 2. 社区资料与资源绑定

2026-11-03 复查 PRTS 的[妮芙·技能与天赋](https://prts.wiki/w/妮芙)和[伤害分类·攻击附加效果](https://prts.wiki/w/伤害分类#攻击附加效果)。这些社区资料支持前置 Buff／后置元素损伤的区别，以及触发爆发的当次攻击可以触发第一天赋，但不能闭合每个通知、采样和归零时点。因此继续调查官方客户端。查阅方式与限制见本批 [prts-sources.json](../evidence/nymph-action-settlement-20261103/prts-sources.json)；之前核对的固定版本见[原记录](../evidence/attack-addon-order-20261102/prts-sources.json)。

资源投影复用 [decoded-content.json](../evidence/attack-addon-order-20261102/content/decoded-content.json)、[selected-templates.json](../evidence/attack-addon-order-20261102/content/selected-templates.json)，本次增加[完整弹道组件绑定](../evidence/nymph-action-settlement-20261103/projectile/projectile-content.json)。对象身份由 SerializedFile 与 PathID 共同确定，不能只比较字符串或数字。

| 对象 | 实际绑定 |
| --- | --- |
| 妮芙资源 | `charpack/char_4146_nymph.ab`，SerializedFile `CAB-006dc4b4a46fa89f39fb416e2c9920e8`。 |
| S1 模式 | PathID `336072622153021997`，攻击为 `16031150783937069`，ActiveEP 为 `6576157648104864301`。 |
| S1 攻击 | `_projectileKey=projectile_chr_nymph_s1`；activeBuffs 引用 `nymph_s_1[ep_damage]`；`_epDamageRatio=0`。这个零值不代表 S1 没有 EP，实际 EP 由独立的 ActiveEP 实现。 |
| S1 ActiveEP | 使用 `ep_damage_based_on_damage_value`，在来源伤害后事件执行，和前置 Buff 是不同的程序。 |
| S1 弹道 | `SimpleProjectile` 与 `AdvancedMovement`，没有独立 HitBehaviour／目标选择组件；最大命中数 1，达到上限后停止，配置允许在抵达流程命中保存的追踪目标。 |

## 3. 目标、发射与命中时的采样

### 目标属于本次攻击，抵达时不重新索敌

当前 metadata 将 `_selectTargetSource=1` 绑定为 `FROM_OWNER`，`_selectTargetTiming=0` 绑定为 `AT_BEGINING`。S1 使用这两个值；`_waitForAttackEvent=true`。准备、施放协程与释放分支见 [selected-native.json](../evidence/nymph-action-settlement-20261103/target/selected-native.json)，枚举的实际常量见 [selector-enums.json](../evidence/nymph-action-settlement-20261103/target/selector-enums.json)。不能仅凭枚举名字证明调用顺序。

`AbilityStandard.CastToTarget`（64098，`0x1805fbe40`）写入输入目标后检查 timing；值为 0 或 2 时在 `0x1805fc0f8` 调用 UpdateTargets(false)，成功后才在 `0x1805fc12b` 启动施放。S1 因此在本次攻击开始时取得 castTargets。后续 `_DoCast.MoveNext` 仅对 timing 1、3、2 的分支重选，S1 的 0 值跳过这些分支。释放经 ExecuteSpell、DoCastOnTargets、RangedAttack.OnCastOnTarget，把已取得目标交给创建入口。

`RangedAttack.CreateProjectile`（92841，`0x180f699c0`）在 `0x180f69bcf` 调用 BattleController.CreateProjectile，传递弹道 key、来源、发射点、已经取得的目标与 Ability；命中动作在弹道 ActionController.Init 中从 Ability 取得并登记。弹道保存追踪对象身份；抵达后 `_DealHitTraceTarget` 使用该身份并检查可用性，不重新执行普通单位索敌。

本配置的 `alwaysHitTraceTargetWhenReached=false` **不表示抵达不命中**：`DealProjectileReached`（72549，`0x1809157f0`）还检查 `alwaysHitTraceTargetInTheEnd`；S1 为 true，因此在 `0x18091594e` 调用 `_DealHitTraceTarget`。尝试标记与命中记录约束抵达／停止路径，不把两条入口误算成两击。调用与字段见 [projectile/native.json](../evidence/nymph-action-settlement-20261103/projectile/native.json)。

### 不是把全部战斗事实在发射时锁定

| 事实 | 本例采样位置 |
| --- | --- |
| 目标身份 | 本次攻击取得目标后交给弹道；命中不改选其他单位。 |
| 来源攻击力 | 发射预处理保存备用攻击力；有效来源可取得时，命中计算仍读取来源攻击力。来源不可取得时才采用缓存分支。 |
| 目标防御／法抗 | 命中主伤害的公式阶段读取，位于前置 Buff 开始程序之后。 |
| 目标是否已有凋亡爆发 | S1 前置 Buff 的 OnStart 检查，早于本击主法术伤害及其后置 EP。 |
| 按伤害值产生 EP 的基数 | 来源伤害后程序读取本次 Modifier.value，不是简单的 HP 前后差。 |
| 第一天赋所需的爆发事实 | 短延迟监听稍后触发时再次检查，和 S1 额外 HP 段使用不同采样时点。 |

`ApplyDamage.PreprocessForProjectile` 在 `0x1810dc9cb` 读取攻击力并写入 `m_cachedAtk`。命中时 `CreateDamageModifier` 对有效来源走 CalculateDamageBySource；无有效来源时走缓存攻击力的 CalculateDamageByAtkNoSource。不能由“发射时有缓存”推断所有弹道伤害都锁定攻击力，也不能由这里推导所有附加程序在来源离场后仍有效。

主伤害的来源计算先采样攻击力并构造两份 AttackInfo，随后经过来源 OnCalculateDamage、目标 OnBeingCalculateDamage、公式求值、来源 OnAfterCalculateDamage。防御／法抗读取位于公式内部。原生随后还执行一次 source=null、triggerSourceEvent=false 的参考计算，再次运行目标 OnBeingCalculateDamage，将两个结果分别作为 value 和 rawValue 构造 Modifier。这不是额外输出了一段 HP 伤害；也说明公式回调次数不等于受伤次数，不能将其全部当作命中通知。具体实参与方法区间见 [damage/native-damage.json](../evidence/nymph-action-settlement-20261103/damage/native-damage.json)。

## 4. 单次命中的结算顺序

### 前置 Buff 可以先完整输出另一段伤害

外层 `Projectile.OnHitTarget`（72545）先更新命中记录并处理 Behaviour；普通分支在 `0x180917afb` 通知有效来源 OnProjectileHitTarget，再在 `0x180917b13` 调用 ActionController。这一弹道命中通知也不能等同于主 HP 伤害已经成功。

`Projectile.ActionController.OnHitTarget`（72625，`0x1809207b0`）先安装 activeBuffs，再处理 Attachment，最后执行 HIT_TARGET 动作。S1 没有禁用这些附加程序；`_AttachBuffs → Entity.AddBuff → BuffContainer.NewBuff → Buff.OnStart` 同步执行，不把 OnStart 排到主伤害之后。

slot 47 已通过当前 metadata 与 RangedAttack 继承链绑定为 GetActiveBuffs，实际返回 AbstractAnimatedAbility 的 `_activeBuffs`。字段、方法和继承链见[原批次的原生绑定](../evidence/attack-addon-order-20261102/content/native/projectile-active-buffs.json)、[访问器](../evidence/attack-addon-order-20261102/content/native/ability-active-buffs.json)及[类型链](../evidence/attack-addon-order-20261102/content/native/ability-type-chain.json)。

`nymph_s_1[ep_damage]` 的事件 0 依次检查来源技能仍在生效、接收者正在 DARK 爆发，再执行 `AdvancedApplyDamage(ELEMENT, BUFF, NONE)`。满足条件时，这一段元素 HP 伤害拥有自己的计算、接收和结束流程；它不是尚未发生的主法术伤害的一个字段。

### 主伤害内部仍有应用前与应用后的不同程序

在未取消、未绕过相应通知的普通 HP 分支，`Entity.ApplyModifier` 的实质先后为：

| 顺序 | native 入口与本例含义 |
| --- | --- |
| 1 | 目标 OnBeforeApplyingModifier。 |
| 2 | 来源 OnOutputModifier／OnOutputDamage。 |
| 3 | 目标 `_OnApplyingModifier`，含 OnApplyingModifier／OnTakeDamage 接收处理。 |
| 4 | 来源 OnBeforeTargetApplyModifier；第一天赋在这个时点安装延迟监听。 |
| 5 | GameMode 应用入口及 DoApplyModifier，写入 HP。 |
| 6 | 目标 OnAppliedModifier，然后来源 OnAfterOutputDamage。 |

所以第一天赋的事件 61 虽叫 BeforeTargetApply，**仍在目标接收处理之后、HP 实际写入之前**，不能单凭名称将它放在接收处理前。关键地址依次为 `0x1807214bd`、`0x1807216f3/819`、`0x1807218bb`、`0x180721984`、`0x180721b08`、`0x180721b40`。完整主体复用 [native-hp.json](../evidence/attack-addon-order-20261102/hp/native-hp.json)，新增采样及归零链见[本批 Damage 证据](../evidence/nymph-action-settlement-20261103/damage/native-damage.json)。

HP 写回后，`OnAppliedModifier` 在 `0x180727d8b` 通知目标，再在 `0x18072803e` 通知仍有效的来源。S1 ActiveEP 是来源事件 21 中的一项程序；它执行期间，其他伤害后程序未必已经全部运行完。

### EP 在来源的伤害后程序内同步应用

`ApplyElementDamageBasedOnDamageValue.Execute`（99347，`0x1810f70b0`）读取本次 Modifier.value，乘比例，计算并构造 EP Modifier，在 `0x1810f74e2` 同步调用目标 ApplyModifier。

该 value 是当时的 Modifier 数值，不是 HP 截断后的 realDelta。DoApplyModifier 的 HP 分支写回 HP 和 realDelta，没有用剩余 HP 重写 m_value。此前回调接收同一份可变 Modifier，因此不能进一步把 value 解释为永不变化的历史计算结果，也不能默认用项目的 `application.hpLoss` 替代。

若 EP 耗尽，`SetEpInternal → EPController.OnElementBreak` 同步运行；先创建爆发 Buff，再启动恢复，不统一延迟到下一 Tick。此链与恢复时序复用[案例 25](25-elemental-burst-recovery-timing.md)的同指纹证据。

### 致死发生在后置通知之前，回收又是另一件事

普通敌人、不进入重生且没有阻止归零的路径中，DoApplyModifier 调用 HP setter 时即可同步进入：

```text
HP 归零
→ OnHpZero
→ FinishMe / OnFinish
    → 来源 OnTargetKilled
    → 目标 OnOwnerFinish
    → 结束目标 Buff，结束 EPController
→ 返回 HP 应用
→ 目标应用后通知入口
→ 来源伤害后通知
```

目标 Buff 已在 OnFinish 中被标记结束，后面的 Buff 派发会跳过 finished／disabled 项。不能因为仍调用了目标 OnAppliedModifier 方法，就宣称原来的目标 Buff 此刻仍会响应。

来源的伤害后通知仍可能执行，但随后产生的 EP 需要重新取得接收者并执行一次新的 ApplyModifier。目标身份若仍有效，请求也会被 alive 入口拒绝；身份若已失效，则更早无法取得接收者。当前 alive 同时要求状态机仍在运行以及 HP 大于零，因此普通致死目标不会被这一后置 EP 再触发爆发。

这不依赖目标是否已经物理注销。DefaultGameMode 的普通死亡经过 RecycleSelfWithDelay；Enemy 的回收延迟取实例配置，正延迟走协程，非正延迟才立即回收。BObject.OnRecycle 才执行注销并清除实例 UID。**HP 归零、业务结束与物理回收不能混成同一个时点。** 本结论不覆盖所有重生、死亡规避或特定 GameMode 分支。

## 5. 第一天赋与可区分结果

第一天赋 `nymph_t_1` 在事件 61 给目标安装一次性 `nymph_t_1[listener]`。它等待首次 0.1 秒间隔，触发时检查当前 DARK 爆发，再按来源与现有产物决定是否创建周期伤害 Buff；无论成功、失败或已有同源产物，监听最终结束。周期产物间隔为 1 秒且不等待首次间隔，但实际开始依赖前面的监听触发。

因此同一击可以具有两个不同答案：S1 前置检查时尚未爆发，本击没有额外元素 HP 段；随后主伤害带来的 EP 触发爆发，稍后的第一天赋仍能成立。不能把这两个判断合并，也不能声称所有“HP 返回后才施加的同 Tick EP”必然漏掉第一天赋。

下表是依据调用链的条件性推导，不是实机轨迹：

| 情形 | 结果 |
| --- | --- |
| 本击前尚未爆发，本击主法术伤害后 EP 达阈值 | S1 前置额外 HP 段不执行；爆发随后开始，存活目标上的延迟监听可以观察到它。 |
| 本击前已经爆发 | 先尝试 S1 额外元素 HP 伤害，再尝试主法术伤害；不能把两段当作不可分割的一次 HP 写回。 |
| 主法术伤害普通致死 | 归零／目标清理先完成；来源伤害后程序仍可能被调用，但这次后置 EP 不能被已死亡的目标接受。 |
| 弹道抵达时原目标已失效 | 不重新索敌给另一个目标；按追踪目标有效性处理本次尝试。 |

一个最小伤害差异例子：目标本击前没有爆发，剩余 EP 为 10，主伤害 100，附加 EP 为 15，条件元素 HP 段为 50，且目标存活。原顺序的本击额外 HP 为 0；若实现成“主伤害 → EP → 再检查当前爆发并执行附加”，会错误地多出 50。数值只为区分顺序，不代表角色面板。

这个反例只证明 S1 的前置判断不能后移。保持前置程序不变，仅调整 EP 与其他 HP 伤害后观察者的相对顺序，是否会产生具体玩法差异，仍需要对应内容的证据；不能用这个反例代替该项评估。

## 6. EP 损伤的共用与专属事件

2026-11-03 在同指纹客户端补查 EP 分支，复用上述 HP 主体和[案例 25](25-elemental-burst-recovery-timing.md)的提交／爆发链，只新增 13 个方法与浮空信件的精确资源绑定。材料、定位与复跑命令见 [EP 事件证据](../evidence/ep-modifier-events-20261103/README.md)。以下编号均属于 Buff.Event，不与 Entity／EventPool 编号混用。

对于存活目标、非零合法输入、普通 force=false、未设置跳过通知标记、没有中途取消且分类未被回调改写的 EP 损伤，顺序为：

| 顺序 | 原生时点 | 与 HP 的关系 |
| --- | --- | --- |
| 1 | 目标 `OnBeforeApplyingModifier`，event5 | 共用前置时点 |
| 2 | 来源 `OnOutputModifier`，event8 | 共用；EP 不进入 HP 专属 `OnOutputDamage` |
| 3 | 目标 `OnApplyingModifier`，event6 | 共用接收前程序 |
| 4 | EP 免疫／无敌判断，目标 `OnTakeEPDamage`，event68 | EP 专属；HP 另走 `OnTakeDamage` |
| 5 | 来源 `OnBeforeTargetApplyModifier`，event61 | 共用；位于接收与取消检查之后 |
| 6 | `DoApplyModifier → _DoApplyEPModifierInternal → SetEpInternal` | EP 写入；归零可在这里同步启动爆发与恢复 |
| 7 | 目标 `OnAppliedModifier`，event7 | 共用；不保证原目标 Buff 仍有效 |
| 8 | 来源 `OnAfterOutputElementDamage`，event83 | EP 专属；不进入 HP 专属 `OnAfterOutputDamage` |

分流直接依据当前 Modifier：`get_isDamage` 72134 要求 targetType=HP(0) 且 damageType 不是 NONE／HEAL；`get_isElementDamage` 72136 要求 targetType=EP(5)、deltaType=损伤(2)。EP 构造方法 72181 写入后一组标签。目标应用后程序返回后，来源后置分支再次读取当前分类，不能把初始请求类型当作原生全程不变的事实。

EP 免疫／无敌分支刚执行取消后仍可能进入 `OnTakeEPDamage`，各 Buff 再按自己的条件决定是否响应；并不意味着每项接收程序必然输出。外层取消检查、来源有效性、force 与 skip 路径仍限制上表的实际执行。

skip 的范围不能简称为跳过全部 Modifier 事件：当前0x80路径绕过目标 Before5、来源 Output8、目标 Applying6和普通专属接收，并在提交后绕过普通 Applied；但独立的 skipped 接收返回后仍可能执行来源 BeforeTargetApply61。分支锚点补核见[治疗调查](29-hp-and-ep-healing-settlement.md#5-skip生命复原与自然回复)。

所选三个 `CalculateElementDamage` 重载读取来源攻击力或显式损伤量、倍率和目标当前 `epResistance`，没有调用 HP 的 Calculate／BeingCalculate／AfterCalculate Buff 回调。该结论限定这三个方法，不扩展为所有特殊 EP 内容均无其他前置程序。本轮没有展开公式中静态下限数值的初始化值，也不以社区简式替代完整数值公式。

共用时点确有真实内容依据：[PRTS 的浮空信件](https://prts.wiki/w/浮空信件)描述其在将受到符合条件的伤害或元素损伤前累计 SP，满 SP 后无敌并传送。当前 `enemy_10231_agpack` Prefab 的 PassiveAbility 直接绑定 `agpack_t[record_damage_cnt]`，该模板的 event5 明确使用 `IsDamage OR IsElementDamage`，然后判断来源、累计 SP 并执行后续。Prefab、模板和 event5 的原生映射相互闭合；这是静态内容选择证据，没有冒充实机观察。

这些事实证明 HP／EP 既有共享的内容时点，也有各自的接收和来源后置事件，不能把 EP 直接套进 HP 专属管线。它们不决定项目必须采用同一注册表或完全相同的阶段接口，也不证明把附加 EP 移到全部 HP 后置观察者之后必然改变玩法。

## 7. 项目关联与未决边界

这些事实支持以下接口边界，但不直接指定新的 API：

1. Targeting 负责本次选择；Action／Projectile 保存必要身份与样本。命中时读取实时事实和保存发射样本需要按具体内容区分。
2. 本例的原生程序分别位于主伤害前、接收后 HP 写入前及来源伤害后。不能把 Attack.afterOutput 或完整 Damage 返回点当作这些不同采样与执行时点的共同替代；项目是否需要独立的应用前扩展点，仍应依据具体结果差异决定。
3. EP、HP 与 Effect 的操作各有接收与生命周期语义；附加 HP 段也会独立触发伤害业务。Battle 可以协调这些领域，不需要让 Elemental 反向调用或拥有整个 Damage 管线。
4. 伤害数值、实际 HP／屏障变化、击杀事实与目标仍可接收后续输出是不同事实。完成报告不应依靠目标一定仍在当前存储中，也不能默认后置 EP 按 HP 差计算。
5. 不能只因原生具有某个回调、参考计算或延迟监听，就要求项目新增同样的字段、事件总线或阶段框架；应以这里可区分的游戏结果决定需要的契约。

本轮仅归档机制，没有修改运行代码、测试或自行确定新的时序政策。仍未核实活跃 XLua、所有特化攻击／重生分支、全部伤害标签的旁路规则，以及来源离场后本例所有附加程序的保留情况。静态链中出现通知调用，不代表每个观察者必然有效或必然输出。
