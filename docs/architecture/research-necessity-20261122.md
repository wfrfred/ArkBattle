# Core 剩余缺口

范围为卫戍协议、集成战略关卡、主线与支线常规作战。表内只列缺失或行为有差异的 Core 能力，以及仍需验证、可能改变 Core 设计的具体问题。编号沿用[全库初次盘点](research-audit-20261122.md)，此前的取证和组合验证见[逐项复核记录](https://github.com/wfrfred/ArkBattle/blob/b2327f6d5105230fd6b96464b8fdc7c18bcb6a40/docs/architecture/research-necessity-20261122.md)。

组合探针证明指定输入能得到某个结果。接口复核还要确认账务、状态和通知由负责该业务的领域维护。如果调用者要重算领域公式、另存同一业务事实，或借用其它操作模拟一个已有明确语义的业务，保留为 Core 缺口或待定取舍。

本轮取证已更新各项状态。待查证指可能影响 Core 的具体组合或分支，待定指已有证据、仍需项目作设计取舍，待接入指已有语义缺少对应的 Core 表达。

## Deployment / Card / DP

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | **特殊移动（U028）** | 缺明确的 `deployment.redeploy`。两种移动均从同一卡免费创建新 Unit。自身移动跳过普通回收，创建失败时默认模式回收 Card。翔虫的外部移动在旧 Unit 离场时走通常的回收，可累积下次部署费用惩罚。思衡托后检失败保留 Card 上的技能进度和待投放记录，下一次入场恢复计时，结束后清除限制。特殊移动保留通常的出生通知。「岁怒」仍触发，「他缚」读取原 Card 的离场原因并跳过自身移动。 [特殊移动的结果与实际消费者](../research/cases/24-deployment-cost-and-supply.md#特殊移动的结束原因) |
| 待定 | Card 参与本次 Unit 的初始属性（G06、U035） | 松桐的 Card 修正先进入单位属性，再用有效 MaxHP 建立出生 HP。探针用高优先级 `entered` 改 HP，按 Ref 读到 115／115，`entered` 和 `deployed` 的固定载荷仍是 100／100。已查的另一个出生观察者「他缚」是在出生后读取实时 HP。需决定在哪里提交部署输入，令固定载荷与实际初始状态一致。 [原生生命初始化](../research/cases/24-deployment-cost-and-supply.md#普通-native-分支的阶段区别) · [当前入场载荷](../../src/core/unit/operations.ts#L14) |
| 待接入 | 可修正的再部署涨费上限（U023） | 凛御银灰 X3 在计算原始费用前把涨费上限从 ×2 改为 ×1.75。野鬃的整数减费在原始费用和后段倍率取整之后结算。Core 把涨费上限固定为 ×2，探针由调用端重算再编码成倍率。算价与取整应由 Card 按这两个输入阶段处理。 [实际叠加顺序](../research/cases/24-deployment-cost-and-supply.md#凛御银灰-x3-与野鬃) · [当前算价](../../src/core/battle/deployment/deck/card/state.ts#L18) |
| 待接入 | 动态容量与恢复队列（U029） | 谬因 S3 同时改变 Card 的持有上限、在场上限和恢复库存。准备阶段宿主离场时撤两份并清计时余量，持续阶段结束按撤容量、召回、清余量处理。原生队列随增量和更新后的总库存裁剪。部署与补货当前都读静态上限，Card 需要统一结算有效容量和队列。 [实际容量与结束分支](../research/cases/24-deployment-cost-and-supply.md#已核的两条附属-card-路径) · [当前库存上限](../../src/core/battle/deployment/deck/card/state.ts#L110) |

## Blocking

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 跨层阻挡（G04） | 迷狂牢笼同时维持地面与空中关系，自身受击资格也读取这些关系。当前获取要求双方同层，切层会解除原有关系。 [实际配置](../research/evidence/resource-mechanisms-20261114/life/content.json#L136150) · [当前资格检查](../../src/core/battle/blocking/operations.ts#L51) |
| 待接入 | 动态空中阻挡半径（U022） | 凯尔希·思衡托 S1 让在场干员拦截原半径外的空中目标。当前 Restriction 只能筛除固定搜索范围内的候选。 [实际规则](../research/cases/21-tippi-air-blocking.md#L96) · [当前搜索](../../src/core/battle/blocking/operations.ts#L183) |
| 待接入 | 迷狂牢笼的阻挡站位 | 牢笼保留距离 0.2 格内目标的位置，较远目标向中心聚拢。当前取得关系会向外推开近处目标，探针中距离 0.1 格的目标被推入邻格。 [站位依据](../research/evidence/cage-block-position-20261122/README.md) · [当前取得流程](../../src/core/battle/blocking/operations.ts#L150) |

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
