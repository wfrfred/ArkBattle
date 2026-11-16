# Elemental

Elemental 拥有 EP、接收许可、标准 Burst 的创建与恢复。EP Damage／Healing 的公共结算见 [Resource](resource.md)，实例与结束机制见 [Effect](effect.md) 和 [Lifetime](lifetime.md)。标准爆发程序由 Core 提供，Data 绑定数值与具体 Effect，Content 组合特殊单位业务。

原生五型配置、接收、恢复与时间修改依据见[案例25](../research/cases/25-elemental-burst-recovery-timing.md)，分类依据见[案例38](../research/cases/38-damage-classification-and-permissions.md)。当前四型实现及未闭合范围见本页末节。

## 关键语义

- EP 写入先于 burstStarted、onInstall 一次性输出、damaged，再进入 Battle Applied；创建回调取消爆发不撤销本次损伤。
- 根 Effect 的 DURATION 是唯一恢复进度；四型 EP 随当前进度回填，周期输出与恢复使用同一预算。
- 根绑定的临时效果随其结束，独立眩晕、麻痹和永久减防保留自己的生命周期。
- 正常完成包含预算内最后一次周期输出；零预算仅执行安装业务，取消／提前结束不补未来输出。

## 1. 能力与定义

四型 Type 为 NEURAL、EROSION、BURN、NECROSIS 字符串联合。Definition 提供共同 maxEp、recoverySpeed、elementResistance、damageResistance、burstRecoverySpeed，以及按 Type 查找的 Burst Definition 表。State 保存四条 EP、唯一当前 Burst Ref、属性贡献和损伤／恢复 Restriction；不按当前阵营推导接收者类型，免疫也不通过删除能力表达。

构造入口校验基础数值与各型爆发时长，EP 初值为基础上限。四型共用修正后的上限，下限为 1；两项恢复速度下限为 0。recoverySpeed 单位为 EP／秒，burstRecoverySpeed 是每次推进消耗的恢复预算。所有 EP 可保留小数。

elementResistance 只用于 EP 损伤，damageResistance 只用于 HP 元素伤害；两者修正后均限制在 0～100，5% 基础保底属于 [Resource 公式](resource.md#基础公式与弱点选择)，不改变属性查询结果。五项属性均支持静态或 `(battle,self)` 动态贡献。请求相关减免在 Receiving 表达，不复制四组抗性，也不在 Restriction 内执行副作用。

## 2. Burst Effect 与标准规则

标准库在 `core/effects/elemental/` 提供八种实际 Effect：神经眩晕／麻痹、物理／元素侵蚀、法术／元素灼燃、消耗 SP／恢复攻击力的凋亡。Data 按静态接收者配置选取工厂、绑定参数并建立共享查表；CHARACTER／ENEMY 不成为 Core 接收者枚举。标准爆发 HP 输出为 nature=DAMAGE、hitRecovery=false，不因 Effect 或周期身份变为 ENVIRONMENT，也不以全局阻回替代本笔 HIT 许可。

Burst 是普通 Effect：state 只保存元素类型，Definition 增加 durationTicks 恢复预算；onInstall 建立 rate=0 的 DURATION，后续 Burst 类型收窄到该时间类型。其 expiration 同时决定恢复、周期边界与凋亡攻击力恢复，不再保存另一份进度。Elemental 只保存根 Effect 的 Typed Ref，不分配独立 Burst ID；旧 Ref 不操作下一次爆发。

持续输出由 onEnable／onDisable 管理，一次性输出属于 onInstall。需要随根结束的灼燃减抗、封技、阻止 SP 回复等产物绑定根 Lifetime。神经眩晕按独立 stunDurationTicks 建立 DEADLINE，不绑定恢复预算；标准恢复与眩晕虽各配置十秒，仍分别计时，零眩晕期限遵守 Effect 安装到期规则。永久侵蚀减防与尚未消费的麻痹独立保留，再次神经爆发按标准规则重置麻痹层数。永久性由规则决定，不按数值正负推导。

## 3. 查询、结算与资源提交

公开入口为 [elemental/index.ts](../../src/core/unit/capability/elemental/index.ts)。available 只判断已知 Elemental 宿主的 PRESENT 与生命资格，不含空间存在。实际接收还检查 Burst 槽位及相应 Restriction；当前中立阵营默认拒绝损伤。Burst 存在时包括 ENDING 均拒收 EP 损伤与显式恢复。

损伤规则读取 `{self,request,type}`，type 来自本次 Calculated；恢复规则读取 `{self,request}`。两者分别登记，不借用 HP 接收规则。无敌和 Presence 通过 EP 损伤限制表达；Presence 不直接限制明确恢复、自然回复或已有 Burst。Targeting 的 EP 谓词另检查目标侧限制、阵营与需要恢复的资源，不为候选查询伪造完整计算结果；HP 行动附加 EP 输出也不自动套用 EP 索敌条件。

MaxEP 贡献变更本身不改写 EP。后续提交先按最新上限规范化，再计算本笔实际损失／增益；**规范化结果必须真实发布到 State，不能只在报告中使用截断值**。四型均应一致，即使本笔增益或损失为零也不能留下超上限的实际 EP。自然回复和 Burst 恢复也使用同一有效上限，比例查询不回落到静态基础值。

| Application | 资源事实 |
| --- | --- |
| DamageApplication | 本型 type、epBefore、epAfter、epLoss，以及本次创建的 Burst Ref 或 null |
| HealingApplication | 四型 epBefore、epAfter、epGain；每型应用完整接收量，不在四型间分摊 |

某型耗尽时同步将四型归零，再创建对应 Burst。报告描述写点，之后的启动取消、恢复回填或嵌套业务不追溯改写。正数输出即使实际变化为零，仍可成功、派发通用 Applied 并输出零值 UI；资源 damaged／healed 仅在实际损失／至少一型增益大于零时通知。

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
EP 写入／四型归零
→ 根 Effect 登记并写入 Burst 槽位、建立 DURATION
→ burstStarted
→ 仍有效的该次 onInstall 一次性输出
→ 通用安装到期检查与适用的启用
→ damaged → 返回报告 → targetApplied → sourceApplied
```

零恢复预算仍执行安装程序与独立产物，随后结束，不启用根持续贡献或补周期输出。burstStarted 可以同步取消该实例；启动输出因此跳过，但 damaged 与适用 Applied 继续报告已发生的损伤。后续操作按原 Ref 和最新状态确认该次实例，不误操作后来创建的根。

## 5. 完整结束与离场

根结束遵守 Effect Lifetime：先发布 ENDING、撤销持续输出并结束依赖；依赖完整结束后，onEnd 将四型 EP 写为宿主最新有效上限、清空槽位并通知 burstEnded，随后移除根。正常完成与在场取消采用同一资源重置政策，重置不派发 healed。

End 区分 FINISHED 与携带原因的 CANCELLED；自然到期映射 FINISHED。ENDING 仍占槽，嵌套结束不保证返回时资源收尾已完成。Unit 的 owner 关系保护宿主到根整个 Finalize 返回，离场不手工清空根。burstEnded 时旧根仍为 ENDING；在场宿主可创建新爆发，随后旧根移除只处理旧 ID，不覆盖新槽。

## 6. 时间推进

根 onTick 是唯一爆发推进入口；对正 duration：

```text
remaining' = max(0, remaining - 当前 burstRecoverySpeed)
elapsed' = duration - remaining'
四型 EP = 当前有效 MaxEP × elapsed' / duration
```

先发布 EP 与 remaining，再执行跨过的周期业务。速度为零或当前无推进资格时暂停，不积攒补算；每次实际推进重新求值速度与上限。正常末次推进包含预算内最后一次周期输出，取消、提前 finish 或离场不补未来输出，onEnd 只收尾。

无 Burst 时由 Elemental.advance 自然恢复：通过当前生命和 healingRestrictions 后，每 Tick 增加 `recoverySpeed/TICKS_PER_SECOND`，同时按当前上限规范化。速度为零仍需处理上限降低；四型未变则保留原状态。不派发 healed、普通 Healing 或其 UI。阶段调度不增加创建 Tick 跳过／lastAdvancedTick；通用 Effect 的时间规则只在 [Effect](effect.md) 定义。

## 支持边界

- 同一宿主当前只允许一个 Burst；特殊内容可组合输出与生命周期，不由标准库提供通用多阶段爆发或启动免疫窗口。
- 狂躁有普通战斗实际输入，当前四型尚未支持；不是已批准排除。
- EP 环境损伤分类及相应实际免疫交互尚未接入，不能因 HP 已有 ENVIRONMENT 就宣称 EP 已覆盖，也不能从地形来源猜测。
- 珊比直接缩短爆发预算的原生行为保留已推进量、降低总预算并立即重算 EP；当前仅修改 Effect.remaining 不自动完成这项资源操作。根与独立子效果的时间交互仍须闭合。

以上真实需求和原生边界见[案例25](../research/cases/25-elemental-burst-recovery-timing.md)、[案例38](../research/cases/38-damage-classification-and-permissions.md)及[覆盖表](../research/cases/37-resource-mechanism-coverage.md)。必要验收结果统一见 [EP 回归语义](verification.md#hook-与伤害治疗的回归语义)。
