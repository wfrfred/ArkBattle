# Core 剩余缺口

范围为卫戍协议、集成战略关卡、主线与支线常规作战。表内只列缺失或行为有差异的 Core 能力，以及仍需验证、可能改变 Core 设计的具体问题。编号沿用[全库初次盘点](research-audit-20261122.md)，此前的取证和组合验证见[逐项复核记录](https://github.com/wfrfred/ArkBattle/blob/b2327f6d5105230fd6b96464b8fdc7c18bcb6a40/docs/architecture/research-necessity-20261122.md)。

组合探针证明指定输入能得到某个结果。接口复核还要确认账务、状态和通知由负责该业务的领域维护。如果调用者要重算领域公式、另存同一业务事实，或借用其它操作模拟一个已有明确语义的业务，保留为 Core 缺口或待定取舍。

本轮取证已更新各项状态。待查证指可能影响 Core 的具体组合或分支，待定指已有证据、仍需项目作设计取舍，待接入指已有语义缺少对应的 Core 表达。

## Battle / 关卡结算

| 状态 | 事项 | 剩下的问题 |
| --- | --- | --- |
| 待接入 | 全局个体结算计数 | Total、Finished、Killed 与 Schedule 的等待集合独立。Total 在主 Wave 预处理时确定；Finished、Killed 按个体资格及实际结算结果更新，普通出口只增加 Finished。原生也有不参与通常计数、无害但计击杀及提前完成结算的实际路径。Core 尚无对应计数状态和操作，历史定稿已明确统计事实与外部胜负裁决分离，具体模块与接口仍待定。 [原生依据](../research/cases/30-scheduler-action-data-fields.md#5-四个争议字段与退出账务) · [原架构定稿](https://github.com/wfrfred/ArkBattle/blob/c82a9cdf/docs/architecture/schedule.md#L293-L348) |
| 待接入 | 关卡生命值 | 关卡生命值是独立于出口位置、统计计数和胜负结果的全局战斗资源。普通出口依据个体结算资格和生命值损失量扣除，无害等情况不扣除。Core 尚无该资源的状态、结算或查询接口；外部规则读取领域提供的事实并裁决胜负，不要求 Core 保存胜负结果。 [原生出口结算](../research/cases/13-route-and-movement-timing.md#51-终点检查与蓝门离场2026-11-08-补核) |
