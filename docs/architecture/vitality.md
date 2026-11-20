# Vitality

Vitality 拥有普通 HP、负生命债务、容量、防御、抗性、自然回复和 HP 接收许可。Damage／Healing 的请求、计算、接收、排除和死亡通知由 [Resource](resource.md) 统一定义；本页只规定 HP 的资源规则与提交扩展点。公开入口为 [vitality/index.ts](../../src/core/unit/capability/vitality/index.ts)。

原生资源与保护依据见[案例11](../research/cases/11-damage-apply-and-hp-application.md)，恢复见[案例29](../research/cases/29-hp-and-ep-healing-settlement.md)，属性范围与 MaxHP 变更见[案例39](../research/cases/39-death-attribution-and-attribute-ranges.md)。已提供的资源能力、具体内容尚未接入、尚未闭合的表达需求分别判断，不以一份 Hook 或调查记录代替完整内容支持。

## Vitality Capability

```typescript
interface Health {
    readonly hp: number;
    readonly minusHp: number;
}
```

State 通过 health 唯一持有生命，不另存顶层 hp；maxMinusHpRatio 是运行时债务容量配置。maxHp、defense、resistance、recoverySpeed、recoveryRatio 各使用 [Attribute](attribute.md) 的 Definition 与 State，当前边界由 Vitality Change 修改；资源和变化量均保留小数。

| 项目 | 初始值或默认属性边界 |
| --- | --- |
| Health | `{hp:初始有效MaxHP, minusHp:0}` |
| MaxHP | 下限 1 |
| 债务容量 | `有效 MaxHP × maxMinusHpRatio`；比例初始为 0 |
| DEF | 下限 0 |
| RES | 0～100 |
| 固定自然回复 | 下限 0，单位 HP／秒 |
| 比例自然回复 | 0～1，单位 MaxHP／秒 |

isAlive 只判断普通 HP>0，不合并 lifecycle 或 Presence；hpRatio 使用普通 HP／有效 MaxHP，不计屏障和债务。业务在自己需要的时点检查生命周期，治疗需求及比例排序复用有效 MaxHP。

MaxHP 贡献只接受静态 Modifier 数组。贡献或范围改变有效上限时，以 `旧普通 HP / 旧 MaxHP × 新 MaxHP` 形成拟写值，再按新容量分配 Health；正向变化也先偿债。属性与生命在同一 Change 中发布，不派发治疗或伤害提交 Hook，零 HP 不因属性变化复活。容量耗尽时，Settlement 从最新状态确认后以 killer:null 请求 DEATH；结构与析构后继归 Unit。

DEF、RES 和自然回复贡献可为静态修正或 `(battle,self)` 查询函数，按当前 Attribute 求值；查询不额外施加表中默认边界。接收限制只保存 Damage Restriction；普通 HP Healing 无独立限制数组，治疗干预使用接收 Hook。Restriction 与 Change 契约见 [Capability](capability.md)。

## 自然 HP 回复

自然回复量为：

```text
(有效固定回复速度 + 当前有效 MaxHP × 有效比例回复速度) / TICKS_PER_SECOND
```

Runtime 在 Effect 后、Elemental 资源推进前调用 Vitality.advance，之后才进入 Skill／Action。每 Tick 读取当前贡献与上限，先偿债，余额增加普通 HP。仅 ACTIVE 且 HP>0 的 Unit 自然回复；Presence 消失和 healFree 不阻止，零 HP 不被自然复活。零速直接返回，不顺带清算容量；满资源且无债务时保留原状态。

逐 Tick 小数回复是明确的项目选择，区别于[原生每次增加 1 HP 的脉冲计时器](../research/cases/29-hp-and-ep-healing-settlement.md#自然-hp-回复的完整普通路径)，不保存脉冲进度，允许启停或变速时的脉冲细节不同。

increaseHp 是公开直接恢复：目标必须仍为 ACTIVE，缺失或 ENDING 抛出 RangeError；恢复前 HP 可为零，恢复量必须有限非负。它从最新 Health 先偿债再增 HP，按当前容量裁切并返回固定恢复报告；不构造 Healing Request、不经过普通治疗或伤害提交 Hook、不输出 HEAL。生命复原、复活恢复及 HP 同步由 Content 选择合适的直接恢复或 Damage，不提供任意 HP 赋值接口。

普通 Healing、自然回复和直接恢复共享同一资源分配规则。普通治疗遵循 [Resource](resource.md) 的接收与存活门控。自然回复检查存活与零速，直接恢复允许对仍处于 ACTIVE 的零 HP 单位执行。

## 伤害写入前后

所有 HP Nature 共用同一提交。Vitality 先按当前 Health 和 received.amount 分配伤害，damageCommitting 接续待写入的绝对 Health；写入并固定报告后，damageCommitted 接续 void。两者只服务伤害提交，治疗、自然回复、初始化与 MaxHP Change 不派发。

| 扩展点 | 固定事实 | 工作值与时点 |
| --- | --- | --- |
| damageCommitting | request、入口 previous:Health | 待写 Health；尚未截到最终资源范围 |
| damageCommitted | request、固定 application | void。资源与 DAMAGE Event 已发布，随后才执行普通 Applied。 |

例如没有债务时，100 HP 接收 150 的候选 hp 为 −50；保护程序可以同时调整普通 HP 与债务。它不改变 received 或取消原因，FIXED 接收量也进入此干预。内部两个键不继承 Apply 的 exclude、ignore 或 forbidden；排序与同步候选遵守 [Hook](hook.md)。

damageCommitting 返回后，重新读取当前宿主、生命与容量。目标缺失、ENDING 或已归零时返回 null，由 Apply 形成 UNAVAILABLE，回调已完成的业务保留，不发本笔成功 Event／Applied。仍可写时只修改最新 Unit 的 Health；候选保持绝对值含义，不自动对回调后的生命再加减一次。

Application.before 在实际写点取得，after 为最终提交值。成功包括零实际变化，均同步执行 damageCommitted；失败不执行。后继修改 MaxHP、恢复生命或结束宿主不会重写原报告、将成功改成失败或被旧候选覆盖。独立嵌套修改同一生命时，内容自行接续必要候选，公共提交不合并变化量。

## 负生命与资源分配

负生命是非负债务，不是允许普通 hp 持续为负。setMaxMinusHpRatio 只设置有限非负比例，不立即清债、改 HP 或判死；降低比例可暂时留下超过新容量的旧债务，后续资源分配再限幅。容量为零时不参与债务累计或偿还，已有债务不会因关闭配置自动丢失。

令旧生命为 h、旧债务为 m、原始拟写 HP 为 q。启用负生命且 q≤0 时，按[原生两分支](../research/cases/11-damage-apply-and-hp-application.md#1-常规-hp额外生命与负生命分别保存)累计：

```text
d = h - q
h > 1：新债务 = d - h
h ≤ 1：新债务 = m + d
```

容量未耗尽时普通 HP 至少为 1；债务达到容量时形成 HP0。不能先截 q，也不能统一为每击只计算超过 HP−1 的部分。例如容量100时，HP100受150→HP1／债50，再受30→债80。damageCommitting 仍可干预两项资源，最后走普通 HP 死亡确认，不新增负生命离场流程。

正向恢复先抵债，余额再增普通 HP，MaxHP 比例变化的正向部分也适用。例如 HP1／债80恢复100→HP21／债0。最终普通 HP 限制在有效上限内，债务保持非负，启用容量时限制到当前容量；未耗尽债务保留普通生命，满债使 HP0。

容量降低后，恢复结算的债务余额仍可能达到新容量。恢复前 HP 大于零且本次写入将 HP 降至零时，恢复以 killer:null 请求正常 DEATH。普通 Healing 先发布 HEAL，再请求离场，并保留 APPLIED 和适用的来源后继。恢复前已为零时，可以通过直接恢复救回单位。仍为零时由原业务确认死亡。零速自然回复跳过资源结算。以上规定动态容量的 Core 行为，具体角色接入按对应内容验证。

## 提交报告与特殊恢复

报告在资源写点固定，before／after 均为 Health：

| 报告 | 实际变化量 |
| --- | --- |
| DamageApplication | `hpLoss=max(0,before.hp-after.hp)`；`minusHpGain=max(0,after.minusHp-before.minusHp)` |
| HealingApplication | `hpGain=max(0,after.hp-before.hp)`；`minusHpLoss=max(0,before.minusHp-after.minusHp)`；`overflow=max(0,本次恢复量-minusHpLoss-hpGain)` |

偿债不属于可转换溢出。UI 的 DAMAGE／HEAL amount 仍只使用 hpLoss／hpGain，债务信息从报告读取。过量转屏障可在 Applied 消费 overflow；屏障额度属于 Effect 私有状态，Core 不增加 ES 或 maxEsRatio 中转。实际 ES 来源和债务交互见[案例29](../research/cases/29-hp-and-ep-healing-settlement.md#7-溢出治疗es与屏障的真实交接)，项目按上述资源报告与 Effect 组合表达。

## 特殊 HP Application 的支持边界

非致命、不死、免死、替身、形态切换和复活的具体内容尚未全部接入；已提供的 Health 与 Hook 不能代替各个完整程序的验证，也不预设必须新增 Core 状态机。

- 非致命由 Effect 在 damageCommitting 按来源／具体请求调整 Health，不增加 Damage 分类；嵯峨本笔保护、应用后重伤与明确处决是不同业务。
- 普通免死的成功竞争由内容限定，不把不死、替身或形态切换放进一个通用 handled／protected 开关。若叶睦已有不死仍可触发切换，不能因候选已被保护就一律跳过其它程序。
- 号角、斯卡蒂模组等可由自身 Effect 保存本次成功事实，在 damageCommitted 更替效果、改变 MaxHP 和恢复；Core 不保存成功者 Effect。
- 当前 Health、拟写候选、是否消费保护和默认变化是否已由内容接管分别处理；后续 Hook 能继续独立业务，不能仅凭回调后 HP>0 认定本笔已完成。
- 同实例假死／复活不等同于完整离场重建；内容组织其限制、进度、属性和恢复时点。复活恢复可用 increaseHp，完整模式／动作与特殊恢复仍按实际内容验证。

原生免死、负生命、固定扣血目标、替身与复活依据统一见[案例11](../research/cases/11-damage-apply-and-hp-application.md)。最终死亡归属、targetKilled 与直接致死的调用者组合统一见 [Resource](resource.md#生命状态通知与离场)。
