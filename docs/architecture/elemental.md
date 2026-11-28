# Elemental

Elemental 拥有 EP、接收许可、标准 Burst 的创建与恢复。EP Damage／Healing 的公共结算见 [Resource](resource.md)，实例与结束机制见 [Effect](effect.md) 和 [Lifetime](lifetime.md)。标准爆发程序与两套标准数值预设由 Core 提供，Content 选择预设并配置具体单位的元素属性。

原生五型配置、接收、恢复与时间修改依据见[案例25](../research/cases/25-elemental-burst-recovery-timing.md)，分类依据见[案例38](../research/cases/38-damage-classification-and-permissions.md)。尚未闭合的时间操作与接收机制见本页末节。

## 关键语义

- EP 写入先于 burstStarted、onInstall 一次性输出、damaged，再进入 Battle Applied；创建回调取消爆发不撤销本次损伤。
- 根 Effect 的 DURATION 是唯一恢复进度；五型 EP 随当前进度回填。凋亡周期使用恢复预算，狂躁周期按实际 ACTIVE Tick 推进。
- 根绑定的临时效果随其结束，独立眩晕、麻痹、角色狂躁和永久减防保留自己的生命周期。
- 正常推进保留到期 Tick 的最后业务；零恢复预算仍执行安装与独立产物，不补根的未来周期。

## 1. 能力与定义

五型 Type 为 NEURAL、EROSION、BURN、NECROSIS、MANIA 字符串联合；原生 ANGER／数值5转换为 MANIA。maxEp、recoverySpeed、elementResistance、damageResistance、burstRecoverySpeed 各使用 [Attribute](attribute.md) 的 Definition 与 State；Definition 另按 Type 提供 Burst 表。State 保存五条 EP、唯一当前 Burst Ref 和损伤／恢复 Restriction；不按当前阵营推导接收者类型，免疫也不通过删除能力表达。

EP 初值为有效 MaxEP，五型共用当前上限。Content 提供的是最终容量，默认下限1、无上限，普通／领袖容量可分别配置1000／2000，不把原生基础 MAX_EP 的1000上限重复施加于最终容量。两项恢复速度默认下限0；recoverySpeed 单位为 EP／秒，burstRecoverySpeed 是每次推进消耗的恢复预算。各型爆发时长在构造时校验，EP 保留小数。

elementResistance 只用于 EP 损伤，damageResistance 只用于 HP 元素伤害，默认范围均为0～100；当前范围可由 Change 覆写。5% 基础保底属于 [Resource 公式](resource.md#基础公式与弱点选择)，不改变属性查询结果。五项属性均支持静态或 `(battle,self)` 动态贡献。请求相关减免在 Receiving 表达，不按元素类型复制抗性，也不在 Restriction 内执行副作用。

## 2. Burst Effect 与标准规则

标准库在 `core/effects/elemental/` 提供十种实际 Effect：神经眩晕／麻痹、物理／元素侵蚀、法术／元素灼燃、消耗 SP／恢复攻击力的凋亡，以及按行动／时间累加伤害的狂躁。[`core/effects/elemental/index.ts`](../../src/core/effects/elemental/index.ts) 提供 `allyCharacterBursts` 与 `otherBursts` 两套五型标准爆发表，保留各具体 Effect 的参数化工厂。原生标准配置区分我方 Character 与其他接收者，不能以阵营或干员／敌人的分类直接替代（见[案例25第6节](../research/cases/25-elemental-burst-recovery-timing.md#6-五型配置接收者分流及实际来源)）。Content 显式绑定适用爆发表；Core 按元素类型读取已配置的爆发，不自行推断接收者。标准爆发 HP 输出均为 nature=DAMAGE；角色狂躁周期允许 HIT 回复，其余标准输出不允许，不因 Effect 或周期身份变为 ENVIRONMENT，也不以全局阻回替代本笔许可。

Burst 是普通 Effect：state 至少保存元素类型，Definition 增加 durationTicks 恢复预算，group 固定为 null。具体爆发通过 `burst.create(input)` 装配 Definition，Input 提供 id、durationTicks、initialize 和可选的 onInstall／onEnable／onDisable／onTick，不提供分组或结束程序。工厂统一保证槽位登记、入场通知、EP 恢复和结束结算；具体回调只实现爆发特有业务。Definition／Burst 的泛型保留具体私有 State 与回调配对，实例 Definition 和异构爆发表统一使用公共 `EraseCallbacks`；安装时恢复已经配对的程序。安装时直接提供 `duration = remaining = durationTicks`、`rate = 0` 的 DURATION。Elemental 只保存根 Effect 的 Typed Ref，不分配独立 Burst ID；旧 Ref 不操作下一次爆发。

持续输出由 onEnable／onDisable 管理，一次性输出属于 onInstall。需要随根结束的灼燃减抗、封技、阻止 SP 回复等产物绑定根 Lifetime。神经眩晕按独立 stunDurationTicks 建立 DEADLINE，不绑定恢复预算；标准恢复与眩晕虽各配置十秒，仍分别计时，零眩晕期限遵守 Effect 安装到期规则。永久侵蚀减防与尚未消费的麻痹独立保留，再次神经爆发按标准规则重置麻痹层数。永久性由规则决定，不按数值正负推导。

### 狂躁的行动与时间累加

依据[案例25第10节](../research/cases/25-elemental-burst-recovery-timing.md#10-狂躁的两套程序与能力计数)，`createActionScaledDamage` 的根仅负责恢复；独立程序使用 DEADLINE，默认持续15秒，保存周期 timer、当前伤害及已计数的 Execution Ref。生效时增加50攻速，每30次 ACTIVE Tick 造成一次当前伤害，初始100。Action 每次 Execution 首次 released、Skill 每次 activationStarted 各增加50，默认最高600；未释放的行动、失败的技能发动不加，多段释放不重复计数。两项监听按宿主能力分别安装，技能激活与期间的攻击分别计数。天赋与通用被动程序由 Effect／回调表达，安装和推进本身不算施放。输出为无来源、无途径的 TRUE／NORMAL，hitRecovery=true；实际回复仍服从 Skill 资格。取消根不清除此独立程序，其到期自行撤销攻速和两项 Hook。

`createTimeScaledDamage` 由根保存私有 timer／damage，生效时增加20攻速；每30次 ACTIVE Tick 先增加130，再造成当前伤害，默认160起步，首跳290。输出为无来源、无途径的 ELEMENTAL／BUFF，hitRecovery=false。根结束即撤销输出；周期不随恢复倍率加速。每次先推进恢复，再处理当次周期，整个 onTick 返回后才结算到期，因此正常15秒的末次脉冲保留。

## 3. 查询、结算与资源提交

公开入口为 [elemental/index.ts](../../src/core/unit/capability/elemental/index.ts)。available 只判断已知 Elemental 宿主的 ACTIVE 与生命资格，不含空间存在。实际接收还检查 Burst 槽位及相应 Restriction；当前中立阵营默认拒绝损伤。Burst 存在时包括 ENDING 均拒收 EP 损伤与显式恢复。

损伤规则读取 `{self,request,type}`，type 来自本次 Calculated；恢复规则读取 `{self,request}`。两者分别登记，不借用 HP 接收规则。无敌和 Presence 通过 EP 损伤限制表达；Presence 不直接限制明确恢复、自然回复或已有 Burst。Targeting 的 EP 谓词另检查目标侧限制、阵营与需要恢复的资源，不为候选查询伪造完整计算结果；HP 行动附加 EP 输出也不自动套用 EP 索敌条件。

EP Damage.Request 必填 nature=DAMAGE／ENVIRONMENT，环境身份由输出方显式提供。Restriction、BeforeReceive／Receiving 等直接读取 request.nature，沿现有流程拒绝或取消本笔环境损伤；标签不改变抗性公式、Burst 或 Hook 派发。普通攻击的附加 EP 输出明确使用 DAMAGE。

MaxEP 的贡献或范围变更本身不改写 EP。后续提交先按最新上限规范化，再计算本笔实际损失／增益；**规范化结果必须真实发布到 State，不能只在报告中使用截断值**。五型均应一致，即使本笔增益或损失为零也不能留下超上限的实际 EP。自然回复和 Burst 恢复也使用同一有效上限，比例查询不回落到静态基础值。

| Application | 资源事实 |
| --- | --- |
| DamageApplication | 本型 type、epBefore、epAfter、epLoss，以及本次创建的 Burst Ref 或 null |
| HealingApplication | 五型 epBefore、epAfter、epGain；每型应用完整接收量，不在五型间分摊 |

某型耗尽时同步将五型归零，再创建对应 Burst。报告描述写点，之后的启动取消、恢复回填或嵌套业务不追溯改写。正数输出即使实际变化为零，仍可成功、派发通用 Applied 并输出零值 UI；资源 damaged／healed 仅在实际损失／至少一型增益大于零时通知。

## 4. Hook、提交事实与同步重入

EP 的 Formula／Output／BeforeReceive／Receiving／BeforeCommit／Applied 遵守 [Resource](resource.md)；此处只定义资源与爆发事实，均为宿主本地通知：

| Hook | 固定事实与时点 |
| --- | --- |
| damaged | request 与本次损伤报告；实际 EP 损失已提交 |
| healed | request 与本次恢复报告；至少一型正增益已提交 |
| burstStarted | 已登记并写入槽位的根 Effect；一次性输出尚未执行 |
| burstEnded | burst 与 End；依赖已清理、EP 已重置、槽位已清空，根随后移除 |

损伤触发 Burst 的同步顺序为：

```text
EP 写入／五型归零
→ 以 DURATION 安装根 Effect，onInstall 登记 Burst 槽位
→ burstStarted
→ 仍有效的该次 onInstall 一次性输出
→ 通用安装到期检查与适用的启用
→ damaged → 返回报告 → targetApplied → sourceApplied
```

零恢复预算仍执行安装程序与独立产物，随后结束，不启用根持续贡献或补根的周期输出；独立程序继续遵守自己的期限。burstStarted 可以同步取消该实例；启动输出因此跳过，但 damaged 与适用 Applied 继续报告已发生的损伤。后续操作按原 Ref 和最新状态确认该次实例，不误操作后来创建的根。

## 5. 完整结束与离场

根结束遵守 Effect Lifetime：先发布 ENDING、撤销持续输出并结束依赖；依赖完整结束后，onEnd 将五型 EP 写为宿主最新有效上限、清空槽位并通知 burstEnded，随后移除根。正常完成与在场取消采用同一资源重置政策，重置不派发 healed。

End 区分 FINISHED 与携带原因的 CANCELLED。自然到期映射 FINISHED，宿主离场使根 Effect 以 `CANCELLED` 结束。ENDING 仍占槽，嵌套结束返回时资源收尾可能仍未完成。宿主等到根 Effect 的整个 Finalize 返回才注销。`getCurrentBurst(battle, reference)` 仅在宿主当前槽位仍指向该 Ref 时返回实例，与按登记身份读取的 `reference.get(battle)` 不同。burstEnded 时旧根仍为 ENDING；在场宿主可创建新爆发，随后旧根移除只处理旧 Ref，不覆盖新槽。

## 6. 时间推进

按 Tick 推进恢复由 `burst.create` 装配的根 onTick 负责；对正 duration：

```text
remaining' = max(0, remaining - 当前 burstRecoverySpeed)
elapsed' = duration - remaining'
五型 EP = 当前有效 MaxEP × elapsed' / duration
```

统一检查当前宿主及爆发的推进资格，先发布 EP 与 remaining，再以最新 Burst 和恢复前的 Duration 调用具体 onTick。凋亡根据前后恢复进度结算本次跨过的各个周期，副作用发生后按原 Ref 判断是否继续；狂躁另存自己的周期进度。恢复速度为零时只暂停恢复预算及其周期，不暂停狂躁独立的 ACTIVE Tick 计数；当前无推进资格时不积攒补算。每次恢复重新求值速度与上限；取消、提前 finish 或离场不补未来输出，工厂装配的 onEnd 只收尾。周期与根绑定关系由具体标准程序规定，不据共享的默认时长合并时钟。

`reduceDuration(battle, reference, ticks)` 是本次 Burst 的完整缩时操作，ticks 为非负安全整数，0 保持原状态。操作保留已推进量：

```text
elapsed = duration - remaining
duration' = max(0, duration - ticks)
remaining' = max(0, duration' - elapsed)
```

发布新预算后，按当前有效 MaxEP 与 `elapsed / duration'` 即时回填五型 EP；已推进量达到新预算时先写满，再请求完整 finish，仍遵守 Lifetime 的结束时序。缩时不执行 onTick／周期业务，也不派发 healed 或普通 Healing。旧 Ref、ENDING 根及失效宿主不改动后来实例。

缩时只改根的 expiration 与 EP，不修改 Definition 或私有周期进度，不传播到独立产物；根绑定产物仍随完整结束清理。凋亡减攻保持原定义的衰减曲线。依据为[珊比缩时与即时回填](../research/cases/25-elemental-burst-recovery-timing.md#9-恢复变速与直接缩时有不同语义)；具体内容自行限定元素类型和触发条件。

无 Burst 时由 Elemental.advance 自然恢复：通过当前生命和 healingRestrictions 后，每 Tick 增加 `recoverySpeed/TICKS_PER_SECOND`，同时按当前上限规范化。速度为零仍需处理上限降低；五型未变则保留原状态。不派发 healed、普通 Healing 或其 UI。阶段调度不增加创建 Tick 跳过／lastAdvancedTick；通用 Effect 的时间规则只在 [Effect](effect.md) 定义。

## 支持边界

- 同一宿主当前只允许一个 Burst；特殊内容可组合输出与生命周期，不由标准库提供通用多阶段爆发或启动免疫窗口。
- 狂躁的郁金香 S1 空施放例外暂缓接入：无目标时成功发动并扣除 SP，但原生空动画分支不增加狂躁。当前双监听保留，不据此增加通用分类或接口。原生天赋／通用程序由上述职责划分表达。具体依据见[案例25第11节](../research/cases/25-elemental-burst-recovery-timing.md#11-狂躁计数的原生排除范围)。
- 环境 EP 分类已提供；齐尔查克的条件光环、深水我方损伤等具体 Content 仍需按原生配置接入，不由环境标签代替来源与免疫程序。
- 酒神 S3 的神经恢复变速、珊比天赋的侵蚀缩时等具体触发内容尚未接入。

以上真实需求和原生边界见[案例25](../research/cases/25-elemental-burst-recovery-timing.md)、[案例38](../research/cases/38-damage-classification-and-permissions.md)及[覆盖表](../research/cases/37-resource-mechanism-coverage.md)。必要验收结果统一见 [EP 回归语义](verification.md#hook-与伤害治疗的回归语义)。
