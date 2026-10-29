# 诺伯特平民：阵营、可选性与阻挡

研究日期：2026-10-29；项目对照 `45a5cb2`。本轮核实诺伯特平民能被我方阻挡、却不被普通攻击选中的原因，不修改 Core API 或内容实现。

## 1. 客户端配置：初始阵营是 ENEMY

本机 `battle/enm_pfb_13.ab` 中，`enemy_1313_wdfmr`（诺伯特平民）及变体 `enemy_1313_wdfmr_2` 的 Enemy Controller 都保存 `_sideTypeIndex=1`。这里的字段是 **SideTypeIndex，不是 SideType**：

| 枚举 | ALLY | ENEMY | NEUTRAL |
| --- | --- | --- | --- |
| `Torappu.Battle.SideTypeIndex` | 0 | 1 | 2 |
| `Torappu.Battle.SideType` | 1 | 2 | 4 |

因此这个配置指向 ENEMY，不能把数值 1 按 `SideType.ALLY` 解读。平民 Controller 的 `_blockVolume=1`；基础 Mode 的 combat／attack Ability 是 EmptyActiveAbility，Trigger 是 NeverTrigger。

对照的寻路密探 `enemy_1314_wdnjd` 同样保存 `_sideTypeIndex=1`。图鉴中的“友好单位”、伪装外观和鉴定结果都不能代替运行时阵营字段；也不能由鉴定标识变红反推此时才变成 ENEMY。

资源指纹、对象 PathID、精选字段和枚举定位见 [selected-witnesses.json](../evidence/norport-civilian-20261029/selected-witnesses.json)。这是 Prefab 初始配置与原生普通分支的静态证据，没有核实活跃 XLua 替换，不能据此断言所有运行阶段都不可能改变阵营。

## 2. 游戏机制：不被攻击不等于不能被阻挡

[游戏内教学 TR-22](https://prts.wiki/w/TR-22_明辨是非#关卡内剧情) 明确说明：进入我方干员攻击范围或被阻挡会逐渐确认身份；真正平民确认身份后不再被我方阻挡，只有已确认身份者进入保护区才补充部署资源。这部分是 Wiki 收录的游戏原文。

[PRTS 诺伯特平民机制说明](https://prts.wiki/w/诺伯特平民) 进一步记录：

- 初始不攻击，持有无敌。无敌既包含异阵营无法选中，也包含伤害和元素损伤归零；禁选与免伤不是同一项判断。
- 鉴定实际检查被阻挡或处于我方单位视野，包含装置类我方单位的视野。鉴定分两阶段，失去条件会倒退进度，第二阶段不会退回第一阶段。不能直接复用要求目标可被攻击的普通伤害索敌来判断视野。
- 鉴定完成后获得不可阻挡，解除当前阻挡；到达路径终点时，我方费用上限增加 2。

上述鉴定、无敌和终点奖励细节来自 Wiki 机制记录。本轮没有闭合对应热更新／Buff 的完整原生调用链，不把 Wiki 解释写成已经逐条复核的客户端指令事实。

## 3. 对 Allegiance 的影响

当前 `allegiance.areHostile` 判断阵营关系，`targeting.filter.damage` 再组合在场、存活、阵营和 Targetable 限制。这个分工可以保留：

| 判断 | 我方干员与初始诺伯特平民 |
| --- | --- |
| 阵营关系 | ALLY 与 ENEMY，满足敌对阵营条件 |
| 普通攻击可选性 | 无敌的异阵营禁选使其不可选 |
| 伤害接收 | 无敌另行使伤害归零，不能只靠此前没有被索敌保证免伤 |
| 阻挡资格 | 不经过普通攻击的可选性筛选，仍可建立阻挡 |

因此不应为了“友好单位”标签把平民改成 ALLY／NEUTRAL，也不需要新增 FRIENDLY_CIVILIAN 阵营。`areHostile` 不能解释成“现在可以攻击”，阵营也不承担故事身份、鉴定进度或关卡奖励。

本案不验证所有 NEUTRAL 组合的原生主观阵营算法；现有项目对照表仍以 [PRTS 选择器](https://prts.wiki/w/选择器#目标阵营（targetSide）) 为来源。

## 4. 对 Blocking 的影响

现有统一二元 `Rule.allows(battle, blocker, blockable)` 足以表达平民鉴定完成后的禁挡。鉴定状态由 Content 保存；完成时提交禁挡 Rule，完整 Unit 更新维护现有关系并派发解除通知。不需要为平民增加特殊 Blocking 状态机、第二种 Rule 或“友好目标可阻挡”例外。

阵营资格还须保留一个既有证据边界：[原生阻挡调查](../evidence/blocking-native-20261023/modes/report.txt) 证明原生检查的是阻挡者的定向 `blockSideMask`，普通 Character 的掩码为 ENEMY：

```text
candidate.sideType != NONE
&& (blocker.blockSideMask & candidate.sideType) == candidate.sideType
```

所以 `areHostile` 不是完整原生阻挡允许关系的通用替代。当前 Core 将它作为两端所有 Rule 之前的必要条件，Rule 只能进一步拒绝，不能越过该条件授权同阵营阻挡。

但**诺伯特平民本身不要求改变这个条件**：其初始 ENEMY 阵营已经满足普通我方阻挡者的原生掩码，也满足当前项目的 `areHostile`。以后支持明确使用其他掩码的内容时，再调整阻挡的阵营资格；不能用本案为依据预先增加掩码 API 或多套授权协议。

鉴定进度、无敌和禁挡的安装、终点奖励分别由内容程序组织。Allegiance、Targetable、伤害接收和 Blocking 保留各自的公共事实与操作，不根据其中一个结果推断其余结果。
