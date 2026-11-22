# Core 剩余缺口

范围为卫戍协议、集成战略关卡、主线与支线常规作战。表内只列缺失或行为有差异的 Core 能力，以及仍需验证、可能改变 Core 设计的具体问题。编号沿用[全库初次盘点](research-audit-20261122.md)，此前的取证和组合验证见[逐项复核记录](https://github.com/wfrfred/ArkBattle/blob/b2327f6d5105230fd6b96464b8fdc7c18bcb6a40/docs/architecture/research-necessity-20261122.md)。

组合探针证明指定输入能得到某个结果。接口复核还要确认账务、状态和通知由负责该业务的领域维护。如果调用者要重算领域公式、另存同一业务事实，或借用其它操作模拟一个已有明确语义的业务，保留为 Core 缺口或待定取舍。

## Deployment / Card / DP

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入，细节待查证 | **特殊移动（U028）** | 缺明确的 `deployment.redeploy`，表达同一卡下的特殊离场与再入场。乌尔比安和 Mon3tr 的原生正常路径沿用原 Card、创建新 Unit。普通 `retreat` 会结算退款、涨费与库存恢复，普通 `deploy` 派发部署通知。渡桥会识别上次离场是否属于特殊移动，这个区别有实际用途。还需核对落点失败、同一卡的账务与通知、技能接续，以及思衡托待投放解除后如何接续。 [特殊移动原生路径](../research/cases/24-deployment-cost-and-supply.md#特殊移动的结束原因) · [渡桥的部署条件](../research/cases/24-deployment-cost-and-supply.md#L103) |
| 待定 | 同卡特殊部署的业务事实（G07） | 卫戍开场布阵保留 Card 关联，但不计入耀骑士临光 S2 使用的普通部署记录。现有 `Quote` 只表达费用、库存和部署位，探针另存本次请求供监听器辨认。需明确部署操作如何让多个观察者读取同一份部署事实。 [实际部署规则](../research/cases/24-deployment-cost-and-supply.md#L102) · [当前通知](../../src/core/battle/deployment/hook.ts#L8) |
| 待定 | Card 参与本次 Unit 的初始属性（G06、U035） | 松桐的生命上限修正用于建立出生 HP。探针用高优先级 `entered` 改 HP，按 Ref 读到 115／115，`entered` 和 `deployed` 的固定载荷仍是 100／100。需确定哪里提交这份部署输入，让入场观察者读取一致的创建事实。 [原生生命初始化](../research/cases/24-deployment-cost-and-supply.md#L286) · [当前入场载荷](../../src/core/unit/operations.ts#L14) |
| 待接入 | 战中调整 DP 上限（G05） | 诺伯特平民鉴定后进入保护区可提高我方 DP 上限。当前自然回复和显式加费都受开场上限约束。 [奖励依据](../research/cases/20-norport-civilian-allegiance-and-blocking.md#L22) · [现行上限](../../src/core/battle/deployment/dp.ts#L5) |
| 待接入 | 死亡后独立归还全局部署位（U038） | 实机确认干员被击倒后仍暂占全局部署位。当前死亡离场立即归还，满额时另一张卡可随即部署。 [原生与实机复测](../research/evidence/deployment-exit-limits-20261122/README.md#实机复测) |
| 待接入，细节待查证 | 可修正的再部署涨费上限（U023） | 凛御银灰 X3 在计算原始费用前把涨费上限从 ×2 改为 ×1.75。Core 把涨费上限固定为 ×2。探针要在调用端重算基础费用和取整，再将补偿编码成后段倍率。上限应由 Card 算价处理。与野鬃减费的叠加仍待核对。 [涨费公式](../research/evidence/redeploy-cost-cap-20261122/README.md) · [当前算价](../../src/core/battle/deployment/card/state.ts#L18) · [野鬃减费](../research/cases/24-deployment-cost-and-supply.md#L139) |
| 待查证 | 运行中的再部署冷却（U026、U027） | 原版银灰 X 模组修正随银灰退场解除时，是否重算受益卡正在运行的冷却。与砾 X 缩短当前段叠加时，核对结算顺序与取整。当前 Core 分开处理开始时采样与显式减时。 [实际规则](../research/cases/24-deployment-cost-and-supply.md#L145) · [原生计时入口](../research/evidence/deployment-recovery-20261101/README.md) |
| 待接入，细节待查证 | 动态容量与恢复队列（U029） | 谬因 S3 同时改变 Card 的持有上限、在场上限和恢复库存。部署与补货当前都读静态上限，探针预留最大容量，再由调用者加限制、召回并手工结算库存。有效容量与恢复队列的裁剪应由 Card 统一处理。宿主提前离场时各部分的结算顺序仍待核对。 [实际容量与结束分支](../research/evidence/redeploy-state-and-repeater-20261122/README.md#谬因-s3-的中继器) · [当前在场上限](../../src/core/battle/deployment/query.ts#L81) · [当前库存上限](../../src/core/battle/deployment/card/state.ts#L110) |
| 待查证 | 临时 Card 的结束与重建（U031） | 淬羽赫默 S2 结束后，未部署的无人机卡是否注销。下次发动是否沿用卡牌身份、库存和冷却。现有资格限制能控制窗口，是否需要 Card 注销入口取决于实际结果。 [技能窗口](../research/cases/24-deployment-cost-and-supply.md#L214) |

## Blocking

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 跨层阻挡（G04） | 迷狂牢笼同时维持地面与空中关系，自身受击资格也读取这些关系。当前获取要求双方同层，切层会解除原有关系。 [实际配置](../research/evidence/resource-mechanisms-20261114/life/content.json#L136150) · [当前资格检查](../../src/core/battle/blocking/operations.ts#L51) |
| 待接入 | 动态空中阻挡半径（U022） | 凯尔希·思衡托 S1 让在场干员拦截原半径外的空中目标。当前 Restriction 只能筛除固定搜索范围内的候选。 [实际规则](../research/cases/21-tippi-air-blocking.md#L96) · [当前搜索](../../src/core/battle/blocking/operations.ts#L183) |
| 待接入 | 迷狂牢笼的阻挡站位 | 牢笼保留距离 0.2 格内目标的位置，较远目标向中心聚拢。当前取得关系会向外推开近处目标，探针中距离 0.1 格的目标被推入邻格。 [站位依据](../research/evidence/cage-block-position-20261122/README.md) · [当前取得流程](../../src/core/battle/blocking/operations.ts#L150) |
| 待查证 | 满容量时的关系增容 | 大君之触／赐被阻挡后可提高阻挡者容量。需核对容量已满时能否先取得关系，以及增容什么时候生效。常规路径在满容量时终止搜索。 [满阻挡与增容](blocking.md#满阻挡筛选与关系引起的容量变化) |

## Unit / Effect

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待定 | 全局规则同步处理后来登记的 Unit（G02） | 全局效果在启用时补发给在场对象，后来出生者也接受同一资格判断。后兽的 Aura 已有实际例子。此前探针要在每种受影响的出生蓝图上注入 `entered`，全局规则因而依赖接收者的构造入口。需确定战斗级规则如何同步观察 Unit 登记，以及和本地 `entered` 的先后。 [后兽的实际注册](../research/evidence/insert-patrol-20261107/content/README.md#L28) · [全局施加](../research/03-space-units-and-mechanisms.md#普通-globalbuff-与全局共享状态) · [当前入场派发](../../src/core/unit/operations.ts#L14) |

## Navigation / Route / Locomotion / Shifting

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 出口资格与离场原因（G08） | 喀兰圣女有真实终点且抵达后留场，探针需要额外 MOVE 和持续 WAIT 才能保留两者。终点抵达与允许退出应作为独立判断。自然到达蓝门与思旧强制出口还应提供可供关卡结算消费的出口事实，当前自然抵达和同位置脚本清除都传 `SCRIPT`。 [原生出口路径](../research/cases/13-route-and-movement-timing.md#L153) · [实际业务消费者](../research/cases/30-scheduler-action-data-fields.md#L155) |
| 待查证 | 跨格路点偏移（U006） | 主线 5-2 破阵者的 MOVE 偏移后落在另一格。项目探针分别按原格和偏移格构场时得出不同中间点，需要核对原生取格是否会改变实际走位、到达或接敌。Plan 已保存两个输入。 [实际配置与导航探针](../research/cases/12-navigation-native-algorithm.md#10-实际路线中的跨格-move) |
| 待查证 | 自主运动的冲撞资格（U019） | 水手重艇和凶豕兽的冲撞模板先检查自主运动。核对仅受外力移动或已停但仍有历史速度时的实际冲撞结果，以及现有运动状态能否区分。 [冲撞配置与出场记录](../research/cases/15-locomotion-native-semantics.md#moving-不是唯一事实) |

## Targeting / Route

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待定 | 普通仇恨所用的路线距离 | 普通敌人仇恨取有效 Trace 或 Main 的剩余路程。恐惧和诱导可以接管移动，但其临时路线不参与这一距离。当前 `remainingDistance` 要求调用者自行选 Context，直接传活动 Context 会读错。需确定由哪一层解释仇恨所用的路线，比较政策仍由选敌程序决定。 [原生仇恨与路线选择](../research/cases/33-targeting-and-targetable-pipeline.md#L230) · [当前距离约定](navigation.md#运动目标与-main-出口) |

## Resource / Vitality

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待定，细节待查证 | 生命比例同步的 HP 调整 | 魔王和「岁」分别计算有符号 HP 差值，逐笔提交并跳过普通伤害或治疗通知。探针正差走 `increaseHp`，负差构造 `LOSS` 请求并排除两阶段 Hook，仍产生 `DAMAGE` Event。需核对实际的伤害报数与致命保护，再决定这两种方向是否共享一个 HP 调整入口。变形者的同步保留普通接收，使用不同政策。 [同步实证](../research/cases/29-hp-and-ep-healing-settlement.md#L164) · [当前提交](../../src/core/unit/capability/vitality/operations.ts#L131) |

## Schedule

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 动态出生参与调度等待（U048） | FD-8 的糖果车动态出生后加入当前波次和终局等待，主线 12-20 的分身只加入终局等待。Core 可以直接创建这些 Unit，等待登记只由计划内 Spawn 使用。 [实际出生与等待登记](../research/evidence/managed-summons-20261122/README.md) · [当前调度](../../src/core/battle/schedule/runtime.ts#L13) |
| 待定 | 波次和终局等待的释放时点（U047） | 主线 0-1 的普通敌人死亡时释放波次等待，之后回收才释放终局等待。当前 `resolveUnits` 同时解除两者。探针要为每次死亡另发一条延迟 Branch 才能保留结果。需决定项目是否区分这两个时点，再确定由 Schedule 还是终局规则持有这段等待。 [普通关卡配置和释放链](../research/evidence/scheduler-recycle-config-20261122/README.md) · [当前等待释放](../../src/core/battle/schedule/runtime.ts#L291) |
