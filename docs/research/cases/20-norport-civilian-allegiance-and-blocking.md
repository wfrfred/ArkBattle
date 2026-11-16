# 诺伯特平民：阵营、可选性与阻挡

研究日期：2026-10-29。本轮核实诺伯特平民能被我方阻挡、却不被普通攻击选中的原因，不修改 Core API 或内容实现。

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

## 3. 阵营、选中与阻挡分别判断

| 判断 | 我方干员与初始诺伯特平民 |
| --- | --- |
| 阵营字段 | 普通 ALLY 与 ENEMY；友好标签不等于运行时 ALLY。 |
| 普通攻击可选性 | 无敌的异阵营禁选使其不可选。 |
| 伤害接收 | 无敌另行限制接收，不能只靠此前没有被索敌保证免伤。 |
| 阻挡资格 | 不经过普通攻击的可选性筛选，初始仍可建立阻挡；鉴定完成后按内容禁挡。 |

[原生阻挡调查](../evidence/blocking-native-20261023/modes/report.txt)的普通掩码判断是：

```text
candidate.sideType != NONE
&& (blocker.blockSideMask & candidate.sideType) == candidate.sideType
```

普通 Character 使用 ENEMY 掩码；这不是一项统一的来源与目标 areHostile 判断。诺伯特平民恰好符合该普通掩码，不足以证明所有阻挡者都使用同一政策。

鉴定进度、无敌、禁挡和终点奖励的完整原生调用链仍未在本案闭合。项目如何组合这些事实见 [Targeting](../../architecture/targeting.md)、[Blocking](../../architecture/blocking.md)与[Content](../../architecture/content.md)，不在研究中保留旧阵营硬条件或 Rule 草案。
