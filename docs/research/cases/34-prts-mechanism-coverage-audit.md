# PRTS 公共战斗机制覆盖审计

2026-11-14 的Vitality／Elemental／Damage／Healing完整补查以[案例37](37-resource-mechanism-coverage.md)为入口；原生证据、实际绑定和项目选择不再由本页初始概览代替。

本次从 PRTS 的机制目录检查公共需求是否遗漏，不重做各领域架构，也不将具体干员、Effect 种类尚未接入算作 Core 缺口。核对日期：2026-11-13。

## 1. 范围与证据等级

阅读[游戏数据基础](https://prts.wiki/w/游戏数据基础)、[作战机制](https://prts.wiki/w/作战机制)、[特殊机制](https://prts.wiki/w/特殊机制)、[伤害分类](https://prts.wiki/w/伤害分类)、[衍生生命](https://prts.wiki/w/衍生生命)，再按问题查阅数值范围、技能、BUFF、异常效果、命中率、诱发移动及代表内容。

PRTS 是社区资料。本次直接核对页面，但未为每项重新提取客户端；下文分别注明 Wiki 规则、已有客户端证据、证据推断及未核实项。页面版本不能视为同一客户端快照：《特殊机制》《伤害分类》《异常效果》注明 2.7.91，《数值范围》仍注明 2.7.81；《命中率》有施工警告。来源版本、固定链接目标、查阅范围和失败请求见[证据批次](../evidence/prts-mechanism-audit-20261113/README.md)。

调查覆盖通用战斗、普通关卡及其单位机制。生息演算、保全派驻、船运寻路等不纳入本轮；纯音画、教程、剧情指令不因此成为战斗内核需求。战前随机准备和局外配置归 Meta／Data，运行中的 Branch 随机与等待仍属于 Schedule。

## 2. 目录检查补出的实际语义

### 2.1 活 Unit 独立解除当前 Wave 等待

[火龙](https://prts.wiki/w/火龙)返巢时在指定路点解除当前波次关系，仍以睡眠姿态留场；这不是死亡、撤退或整波超时。[Case 30 §5](30-scheduler-action-data-fields.md#5-四个争议字段与退出账务)及[ReleaseEnemyFromCurrentWave 原件](../evidence/scheduler-general-20261107/lifecycle/ReleaseEnemyFromCurrentWave-0x18097f830.txt)说明只移除当前波次等待，最终管理关系和完成计数不因此变化。

### 2.2 面向是持久玩法事实

[作战机制](https://prts.wiki/w/作战机制#敌人朝向与相对方位)、[眩光手雷](https://prts.wiki/w/眩光手雷)与[火龙](https://prts.wiki/w/火龙)记录正背面判定、甩尾及断尾累计。[原生面向证据](../evidence/facing-semantics-20261113/README.md)定位移动／攻击／受力写入及部位生命消费者；目标向量、身体四向和有效左右符号分别存在，不能只由当前速度还原。转向资格与火龙实际绑定的后续结论见 [Case 35](35-facing-and-turning-conditions.md)。

### 2.3 伤害、击杀与旁观死亡

来源伤害、程序来源、最终击杀归属和受害者死亡响应分别存在；锡人无来源伤害、嵯峨处决、阿米娅回复和来源后继／死亡爆炸的完整补核见 [Case 39](39-death-attribution-and-attribute-ranges.md)。不能再以初始“仅找到最终消费者”的调查范围代替这些后续证据。

## 3. 专题覆盖入口

| 主题 | 原生结论 |
| --- | --- |
| 数值公式、伤害分类、权限、生命干预、恢复与 EP | [Case 37](37-resource-mechanism-coverage.md)统一连接实际内容与原件。 |
| 属性上下限 | [Case 39](39-death-attribution-and-attribute-ranges.md)的信仰搅拌机 X 模组；范围覆写不是属性加算。 |
| 单位分类与标签 | [Case 36](36-unit-classification-and-combat-tags.md)区分实现类、阵营、职业、FilterTag／GroupTag、级别与攻击方式。 |
| 光环、共享状态与后来出生 | [空间研究 §9](../03-space-units-and-mechanisms.md#9-非空间机制与范围贡献)保留 Aura／GlobalBuff 关联及具体共享机制的未闭合链。 |
| Fear、Attract、Trace、改道与缓存 | [Case 13](13-route-and-movement-timing.md)、[Case 31](31-route-operations-and-state.md)、[Case 32](32-leithanien-summons-blocking-and-movement.md)。 |
| 阻挡、空地、浮空与站位 | [Case 21](21-tippi-air-blocking.md)、[Case 22](22-block-positioning-and-interruption.md)、[Case 23](23-blocker-and-blockable-roles.md)。 |
| 部署、免费投递、特殊移动与待部署资源 | [Case 24](24-deployment-cost-and-supply.md)分别记录普通路径和特殊内容。 |
| 推拉、失衡、物理与自主运动 | [Case 15](15-locomotion-native-semantics.md)，完整物理／外力覆盖仍受该案范围限制。 |
| 位移累计触发 | PRTS 特殊机制记载测距和跳跃过滤；本批未闭合需要怎样保存累计路程的具体内容与完整时序，不凭原生计数器名推导项目字段。 |

本批原始[覆盖记录](../evidence/prts-mechanism-audit-20261113/coverage.json)保留取证时的检查对象和代码基线，不能当作当前实现支持表。项目当前结构与验收见[架构入口](../../architecture/ARCHITECTURE.md)和[验证文档](../../architecture/verification.md)。

## 4. 证据边界

机制目录和代表样本不能证明全客户端、全角色或全关卡完整；具体 Content 未接入也不能反过来证明公共模型不支持。剧情、音画、教程、局外养成及明确排除模式不因出现在目录中就变成 Core 需求。

本页不维护另一份 Core 缺口／延期清单。后续结论更新到对应专题，实际未闭合的来源、参数与调用链保留在其证据边界中。
