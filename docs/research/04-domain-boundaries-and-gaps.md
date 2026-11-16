# 领域主题索引

研究确认原生行为；领域职责与公开接口以[总体架构](../architecture/ARCHITECTURE.md)为准。本页仅连接两者，不维护独立的实现差距表。

| 主题 | 原生结论 | 项目契约 |
| --- | --- | --- |
| 属性与生命资源 | [属性概览](02-combat-buffs-and-effects.md)、[HP 应用](cases/11-damage-apply-and-hp-application.md)、[资源覆盖](cases/37-resource-mechanism-coverage.md) | [Vitality](../architecture/vitality.md)、[Elemental](../architecture/elemental.md)、[Resource](../architecture/resource.md) |
| Buff 身份、重复施加与竞争 | [安装、父作用域与覆盖组](cases/01-buff-installation-and-parent-scope.md) | [Effect](../architecture/effect.md)、[Lifetime](../architecture/lifetime.md) |
| 派发与嵌套调用 | [候选与嵌套结算](cases/03-dispatch-and-nested-settlement.md)、[原生协议归纳](cases/04-protocol-conclusions.md) | [Hook](../architecture/hook.md)、[函数式核心](../architecture/functional-core.md) |
| 行动、技能与在途过程 | [行动／弹道](cases/02-action-and-projectile-phases.md)、[行动时序](cases/07-action-timing-and-animation.md)、[技能机制](cases/09-skill-mechanisms-and-requirements.md)、[Projectile](cases/16-projectile-motion-and-hit-boundaries.md) | [Action](../architecture/action.md)、[Skill](../architecture/skill.md)、[Projectile](../architecture/projectile.md) |
| 地图、设备与非空间机制 | [空间与关卡证据](03-space-units-and-mechanisms.md) | [Battlefield](../architecture/battlefield.md)、[Mechanism](../architecture/ARCHITECTURE.md) |
| 阻挡与运动 | [Blocker／Blockable](cases/23-blocker-and-blockable-roles.md)、[Navigation](cases/12-navigation-native-algorithm.md)、[Route](cases/31-route-operations-and-state.md)、[Locomotion](cases/15-locomotion-native-semantics.md) | [Blocking](../architecture/blocking.md)、[Navigation](../architecture/navigation.md)、[Route](../architecture/navigation.md#route-定义与进度)、[Locomotion](../architecture/navigation.md#locomotion) |
| 目标选择与最终作用 | [Targeting 全链](cases/33-targeting-and-targetable-pipeline.md)、[Effect 选择与免疫](cases/19-effect-selection-and-immunity.md) | [Targeting](../architecture/targeting.md)、[Resource](../architecture/resource.md) |
| 出兵、部署与来源身份 | [Scheduler 字段](cases/30-scheduler-action-data-fields.md)、[部署与 Card](cases/24-deployment-cost-and-supply.md) | [Schedule](../architecture/schedule.md)、[Deployment](../architecture/deployment.md) |

实际内容未接入与领域模型不能表达必须分开判断。尚未闭合的原生问题维护在相应案例中；配置、方法或测试存在均不能单独证明完整机制已覆盖。
