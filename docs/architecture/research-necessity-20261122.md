# Core 剩余缺口

范围为卫戍协议、集成战略关卡、主线与支线常规作战。表内只列缺失或行为有差异的 Core 能力，以及仍需验证、可能改变 Core 设计的具体问题。编号沿用[全库初次盘点](research-audit-20261122.md)，此前的取证和组合验证见[逐项复核记录](https://github.com/wfrfred/ArkBattle/blob/b2327f6d5105230fd6b96464b8fdc7c18bcb6a40/docs/architecture/research-necessity-20261122.md)。

组合探针证明指定输入能得到某个结果。接口复核还要确认账务、状态和通知由负责该业务的领域维护。如果调用者要重算领域公式、另存同一业务事实，或借用其它操作模拟一个已有明确语义的业务，保留为 Core 缺口或待定取舍。

本轮取证已更新各项状态。待查证指可能影响 Core 的具体组合或分支，待定指已有证据、仍需项目作设计取舍，待接入指已有语义缺少对应的 Core 表达。

## Blocking

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 迷狂牢笼的阻挡站位 | 牢笼保留距离 0.2 格内目标的位置，较远目标向中心聚拢。当前取得关系会向外推开近处目标，探针中距离 0.1 格的目标被推入邻格。 [站位依据](../research/evidence/cage-block-position-20261122/README.md) · [当前取得流程](../../src/core/battle/blocking/operations.ts#L153) |

## Navigation / Route / Locomotion / Shifting

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 出口资格与离场原因（G08） | 喀兰圣女有真实终点且抵达后留场，探针需要额外 MOVE 和持续 WAIT 才能保留两者。终点抵达与允许退出应作为独立判断。自然到达蓝门与思旧强制出口还应提供可供关卡结算消费的出口事实，当前自然抵达和同位置脚本清除都传 `SCRIPT`。 [原生出口路径](../research/cases/13-route-and-movement-timing.md#L153) · [实际业务消费者](../research/cases/30-scheduler-action-data-fields.md#L155) |
| 待定 | 跨格路点偏移（U006） | 原生按路点原格构场，到最后一段才加世界偏移。主线 5-2 破阵者的首段朝向因此与当前 Core 不同。Plan 已保存两个输入，需决定是否采用原格构场。 [实际路线与取格对照](../research/cases/12-navigation-native-algorithm.md#10-实际路线中的跨格-move) |
| 待接入 | 自主运动的冲撞资格（U019） | 水手重艇和凶豕兽的冲撞读来源当时的自主运动状态。失衡中的外力位移以及已经脱离自主移动状态的历史速度均不满足资格。Core 需要表达这一共同的运动事实。 [实际冲撞模板与原生谓词](../research/cases/15-locomotion-native-semantics.md#水手重艇与凶豕兽的冲撞) |

## Targeting / Route

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待定 | 普通仇恨所用的路线距离 | 普通敌人仇恨取有效 Trace 或 Main 的剩余路程。恐惧和诱导可以接管移动，但其临时路线不参与这一距离。当前 `remainingDistance` 要求调用者自行选 Context，直接传活动 Context 会读错。需确定由哪一层解释仇恨所用的路线，比较政策仍由选敌程序决定。 [原生仇恨与路线选择](../research/cases/33-targeting-and-targetable-pipeline.md#L230) · [当前距离约定](navigation.md#运动目标与-main-出口) |

## Resource / Vitality

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 生命比例同步的 HP 调整 | 魔王和「岁」的有符号调整跳过普通浮字、伤疗应用后通知和战斗记录，保留专用接收及生命归零处理。淬羽赫默 Y2／Y3 的屏障实际监听专用接收。探针负差走 `LOSS` 并排除普通 Hook，仍会产生 `DAMAGE` Event，也无法派发这项专用接收。变形者的同比例同步使用普通接收。 [生命提交与实际消费者](../research/cases/29-hp-and-ep-healing-settlement.md#有符号调整保留特定接收与生命归零程序) · [当前提交](../../src/core/unit/capability/vitality/operations.ts#L131) |

## Schedule

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 动态出生参与调度等待（U048） | FD-8 的糖果车动态出生后加入当前波次和终局等待，主线 12-20 的分身只加入终局等待。Core 可以直接创建这些 Unit，等待登记只由计划内 Spawn 使用。 [实际出生与等待登记](../research/evidence/managed-summons-20261122/README.md) · [当前调度](../../src/core/battle/schedule/runtime.ts#L13) |
| 待定 | 波次和终局等待的释放时点（U047） | 主线 0-1 的普通敌人死亡时释放波次等待，之后回收才释放终局等待。当前 `resolveUnits` 同时解除两者。探针要为每次死亡另发一条延迟 Branch 才能保留结果。需决定项目是否区分这两个时点，再确定由 Schedule 还是终局规则持有这段等待。 [普通关卡配置和释放链](../research/evidence/scheduler-recycle-config-20261122/README.md) · [当前等待释放](../../src/core/battle/schedule/runtime.ts#L291) |
