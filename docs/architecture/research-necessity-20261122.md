# Core 剩余缺口

范围为卫戍协议、集成战略关卡、主线与支线常规作战。表内只列缺失或行为有差异的 Core 能力，以及仍需验证、可能改变 Core 设计的具体问题。编号沿用[全库初次盘点](research-audit-20261122.md)，此前的取证和组合验证见[逐项复核记录](https://github.com/wfrfred/ArkBattle/blob/b2327f6d5105230fd6b96464b8fdc7c18bcb6a40/docs/architecture/research-necessity-20261122.md)。

## Deployment / Card / DP

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入，细节待查证 | **特殊移动（U028）** | 缺明确的 `deployment.redeploy`，表达同一卡下的特殊离场与再入场。乌尔比安和 Mon3tr 的原生正常路径沿用原 Card、创建新 Unit。普通 `retreat` 会结算退款、涨费与库存恢复，普通 `deploy` 派发部署通知。渡桥会识别上次离场是否属于特殊移动，这个区别有实际用途。还需核对落点失败、同一卡的账务与通知、技能接续，以及思衡托待投放解除后如何接续。 [特殊移动原生路径](../research/cases/24-deployment-cost-and-supply.md#特殊移动的结束原因) · [渡桥的部署条件](../research/cases/24-deployment-cost-and-supply.md#L103) |
| 待接入 | 战中调整 DP 上限（G05） | 诺伯特平民鉴定后进入保护区可提高我方 DP 上限。当前自然回复和显式加费都受开场上限约束。 [奖励依据](../research/cases/20-norport-civilian-allegiance-and-blocking.md#L22) · [现行上限](../../src/core/battle/deployment/dp.ts#L5) |
| 待接入 | 死亡后独立归还全局部署位（U038） | 实机确认干员被击倒后仍暂占全局部署位。当前死亡离场立即归还，满额时另一张卡可随即部署。 [原生与实机复测](../research/evidence/deployment-exit-limits-20261122/README.md#实机复测) |
| 待查证 | 涨费上限的叠加（U023） | 凛御银灰 X3 已给两层涨费的 Card 登记 ×1.75 上限，之后野鬃再减费。核对野鬃的修正进入哪一段，以及上限是否按更新后的费用基数计算。单独使用 X3 已有组合验证。 [涨费公式](../research/evidence/redeploy-cost-cap-20261122/README.md) · [野鬃减费](../research/cases/24-deployment-cost-and-supply.md#L139) |
| 待查证 | 运行中的再部署冷却（U026、U027） | 原版银灰 X 模组修正随银灰退场解除时，是否重算受益卡正在运行的冷却。与砾 X 缩短当前段叠加时，核对结算顺序与取整。当前 Core 分开处理开始时采样与显式减时。 [实际规则](../research/cases/24-deployment-cost-and-supply.md#L145) · [原生计时入口](../research/evidence/deployment-recovery-20261101/README.md) |
| 待查证 | 动态容量撤销与恢复队列（U029） | 谬因 S3 期间已有中继器排队恢复，宿主提前离场时，核对容量撤销、召回、队列裁剪以及当前计时段。正常技能结束已有组合验证，提前离场的结果决定现有 Card 操作是否足够。 [实际容量与结束分支](../research/evidence/redeploy-state-and-repeater-20261122/README.md#谬因-s3-的中继器) |
| 待查证 | 临时 Card 的结束与重建（U031） | 淬羽赫默 S2 结束后，未部署的无人机卡是否注销。下次发动是否沿用卡牌身份、库存和冷却。现有资格限制能控制窗口，是否需要 Card 注销入口取决于实际结果。 [技能窗口](../research/cases/24-deployment-cost-and-supply.md#L214) |

## Blocking

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 跨层阻挡（G04） | 迷狂牢笼同时维持地面与空中关系，自身受击资格也读取这些关系。当前获取要求双方同层，切层会解除原有关系。 [实际配置](../research/evidence/resource-mechanisms-20261114/life/content.json#L136150) · [当前资格检查](../../src/core/battle/blocking/operations.ts#L51) |
| 待接入 | 动态空中阻挡半径（U022） | 凯尔希·思衡托 S1 让在场干员拦截原半径外的空中目标。当前 Restriction 只能筛除固定搜索范围内的候选。 [实际规则](../research/cases/21-tippi-air-blocking.md#L96) · [当前搜索](../../src/core/battle/blocking/operations.ts#L183) |
| 待接入 | 迷狂牢笼的阻挡站位 | 牢笼保留距离 0.2 格内目标的位置，较远目标向中心聚拢。当前取得关系会向外推开近处目标，探针中距离 0.1 格的目标被推入邻格。 [站位依据](../research/evidence/cage-block-position-20261122/README.md) · [当前取得流程](../../src/core/battle/blocking/operations.ts#L150) |
| 待查证 | 满容量时的关系增容 | 大君之触／赐被阻挡后可提高阻挡者容量。需核对容量已满时能否先取得关系，以及增容什么时候生效。常规路径在满容量时终止搜索。 [满阻挡与增容](blocking.md#满阻挡筛选与关系引起的容量变化) |

## Navigation / Route / Locomotion / Shifting

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 出口离场原因（G08） | 自然到达蓝门与思旧强制出口结算会产生可独立消费的出口事实。当前自然抵达和同位置脚本清除都传 `SCRIPT`。 [原生出口路径](../research/cases/13-route-and-movement-timing.md#L153) · [实际业务消费者](../research/cases/30-scheduler-action-data-fields.md#L155) |
| 待查证 | 跨格路点偏移（U006） | 主线 5-2 破阵者的 MOVE 偏移后落在另一格。项目探针分别按原格和偏移格构场时得出不同中间点，需要核对原生取格是否会改变实际走位、到达或接敌。Plan 已保存两个输入。 [实际配置与导航探针](../research/cases/12-navigation-native-algorithm.md#10-实际路线中的跨格-move) |
| 待查证 | 自主运动的冲撞资格（U019） | 水手重艇和凶豕兽的冲撞模板先检查自主运动。核对仅受外力移动或已停但仍有历史速度时的实际冲撞结果，以及现有运动状态能否区分。 [冲撞配置与出场记录](../research/cases/15-locomotion-native-semantics.md#moving-不是唯一事实) |

## Schedule

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 动态出生参与调度等待（U048） | FD-8 的糖果车动态出生后加入当前波次和终局等待，主线 12-20 的分身只加入终局等待。Core 可以直接创建这些 Unit，等待登记只由计划内 Spawn 使用。 [实际出生与等待登记](../research/evidence/managed-summons-20261122/README.md) · [当前调度](../../src/core/battle/schedule/runtime.ts#L13) |
