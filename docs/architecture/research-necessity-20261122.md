# Core 架构缺口复核

当前范围为卫戍协议、集成战略关卡、主线和支线常规作战。编号沿用[全库初次盘点](research-audit-20261122.md)。此前查证、项目定稿和 Core 组合验证的明细见[逐项复核记录](https://github.com/wfrfred/ArkBattle/blob/b2327f6d5105230fd6b96464b8fdc7c18bcb6a40/docs/architecture/research-necessity-20261122.md)。有限样本中的未命中仍按各自研究记录的覆盖范围理解。

本页跟踪 Core 的表达能力。真实需求能由现有操作组合表达时，沿用这些操作，实际技能的接入进度由对应领域记录。特殊移动的组合验证与接入状态见 [Deployment](deployment.md#支持范围)。

## 待查证

| 领域 | 编号 | 待查证的行为 | 影响的结果 |
| --- | --- | --- | --- |
| Deployment | U023 | 凛御银灰 X3 已给一张两层涨费的待部署近卫卡登记 ×1.75 上限，随后部署野鬃使它减费。核对野鬃的修正进入哪段算价，以及上限修正是否按减费后的基数重新计算。 [模组公式](../research/evidence/redeploy-cost-cap-20261122/README.md) · [野鬃减费](../research/cases/24-deployment-cost-and-supply.md#L139) | 单独使用 X3 时，现有费用贡献能复现实际价格。如果组合会改变已采样的基数，需核对显示价、实际扣费和在场 COST。 |
| Deployment | U026、U027 | 原版银灰 X 模组的临时修正在受益卡冷却期间随银灰退场解除，核对本段剩余时间是否随之改变。结合砾 X 对同一冷却的显式减时，核对两种修正的先后及何时取整。 [实际规则](../research/cases/24-deployment-cost-and-supply.md#L145) · [原生计时入口](../research/evidence/deployment-recovery-20261101/README.md) | Core 在开始冷却时采样时长，并能显式缩短当前段。若解除临时修正也会重算本段，结果会影响卡牌何时重新可部署。 |
| Deployment | U029 | 谬因 S3 期间已有中继器排队恢复，谬因提前离场时，核对临时容量撤销、在场中继器回收和队列裁剪共同结算后的库存及恢复时钟。 [宿主结束分支](../research/evidence/redeploy-state-and-repeater-20261122/README.md#谬因-s3-的中继器) | 正常技能结束已有组合验证。提前离场的实际结果决定同一 Card 的容量恢复是否需要同当前恢复段一起处理。 |
| Deployment | U031 | 淬羽赫默 S2 结束时，未部署的辅助无人机卡是暂时隐藏还是结束生命周期。下次发动时核对是否为同一张卡，以及库存和冷却是否接续。 [技能窗口](../research/cases/24-deployment-cost-and-supply.md#L214) | 现有卡牌限制可控制使用资格。核对结果决定是否还需要注销临时 Card。 |
| Navigation / Route | U006 | 主线 5-2 的破阵者有一个偏移后落到另一格的 MOVE。用原格与偏移后格构场，项目探针得到不同中间移动目标。需对照原生完整走位，核对能否改变到达或被阻挡的结果。 [实际配置与对照](../research/cases/12-navigation-native-algorithm.md#10-实际路线中的跨格-move) | Plan 已保存原格和偏移。当前问题落在 Navigation 如何消费这两个输入。 |
| Locomotion / Shifting | U019 | 水手重艇和凶豕兽的冲撞模板在伤害前检查自主运动。核对实战中仅受推拉位移或已停步但残留速度时，触发链是否到达冲撞伤害。 [冲撞配置与出场记录](../research/cases/15-locomotion-native-semantics.md#moving-不是唯一事实) | 冲撞判定需要读取当时的运动资格。查证结果决定能否从现有运动状态直接判断。 |

## 已证实的架构缺口

| 领域 | 编号 | 已查实的行为与 Core 差异 |
| --- | --- | --- |
| Blocking | G04 | 迷狂牢笼能同时阻挡地面和空中目标，自身受击资格也读取这些关系。现有基础资格只允许一层，切层会解除原有关系。 [原生配置](../research/evidence/resource-mechanisms-20261114/life/content.json#L136150) · [Core](../../src/core/battle/blocking/operations.ts#L51) |
| Blocking | U022 | 凯尔希·思衡托 S1 让已部署友方能拦截原半径外的空中目标，失效后恢复原获取范围。现有 Restriction 只能筛除固定半径内的候选。 [原生规则](../research/cases/21-tippi-air-blocking.md#L96) · [Core](../../src/core/battle/blocking/operations.ts#L183) |
| Blocking | 迷狂牢笼的阻挡站位 | 牢笼保留距离 0.2 格以内目标的位置，较远目标向牢笼中心聚拢。现有 `acquire` 会把近处目标向外推至 0.5 格，探针中距中心 0.1 格的目标被推入邻格。用 `presence.appear` 移回会解除阻挡。 [原生站位](../research/evidence/cage-block-position-20261122/README.md) · [Core](../../src/core/battle/blocking/operations.ts#L150) |
| Deployment | G05 | 鉴定后的诺伯特平民进入保护区，提高普通 DP 账户上限。目前自然回复和显式加费都受开场上限约束。 [实际内容](../research/cases/20-norport-civilian-allegiance-and-blocking.md#L22) · [Core](../../src/core/battle/deployment/dp.ts#L5) |
| Deployment | U038 | 实机复测确认干员被击倒后仍暂占全局部署位。当前 Core 在死亡离场结算中立即归还，满额时另一张卡可随即部署。 [实机复测](../research/evidence/deployment-exit-limits-20261122/README.md#实机复测) |
| Route / Unit | G08 | 到达蓝门和思旧的强制出口结算有独立于死亡、脚本清除的业务结果。当前自然抵达和同位置脚本清除均向 `Unit.removed` 传递 `SCRIPT`。 [原生实例](../research/cases/13-route-and-movement-timing.md#L153) · [统计依据](../research/cases/30-scheduler-action-data-fields.md#L155) |
| Schedule | U048 | FD-8 的糖果车按实时路线和位置出生后会阻止进入下一波及结束关卡。当前普通动态出生能创建 Unit，等待登记只接收计划内 Spawn。 [原生调用](../research/evidence/managed-summons-20261122/README.md) · [Core](../../src/core/battle/schedule/runtime.ts#L13) |
