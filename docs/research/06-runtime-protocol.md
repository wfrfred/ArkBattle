# 调用协议研究索引

本目录保存原生调用事实，不另设一份项目 Runtime 规范。当前同步调用、状态所有权、生命周期和 Hook 协议见[函数式核心](../architecture/functional-core.md)、[API 约定](../architecture/api-conventions.md)、[Lifetime](../architecture/lifetime.md)与[Hook](../architecture/hook.md)。

| 问题 | 原生依据 | 当前领域契约 |
| --- | --- | --- |
| 登记、开始、生效、结束与回收 | [Case 01](cases/01-buff-installation-and-parent-scope.md) | [Effect](../architecture/effect.md)、[Lifetime](../architecture/lifetime.md) |
| 候选身份、实时资格及同步嵌套 | [Case 03](cases/03-dispatch-and-nested-settlement.md)、[Case 04](cases/04-protocol-conclusions.md) | [Hook](../architecture/hook.md) |
| 公式、接收、资源提交及死亡通知 | [Case 11](cases/11-damage-apply-and-hp-application.md)、[Case 28](cases/28-damage-hooks-and-event-granularity.md)、[Case 38](cases/38-damage-classification-and-permissions.md)、[Case 39](cases/39-death-attribution-and-attribute-ranges.md) | [Resource](../architecture/resource.md)、[Vitality](../architecture/vitality.md) |
| 普通治疗、自然回复与元素恢复 | [Case 29](cases/29-hp-and-ep-healing-settlement.md)、[Case 25](cases/25-elemental-burst-recovery-timing.md) | [Resource](../architecture/resource.md)、[Elemental](../architecture/elemental.md) |
| Action 的接受、等待、释放与取消 | [Case 02](cases/02-action-and-projectile-phases.md)、[Case 07](cases/07-action-timing-and-animation.md)、[Case 08](cases/08-action-eligibility-and-interruption.md) | [Action](../architecture/action.md)、[Skill](../architecture/skill.md) |
| Projectile 的命中、停止与独立存续 | [Case 16](cases/16-projectile-motion-and-hit-boundaries.md)、[Case 17](cases/17-projectile-stop-and-termination.md)、[Case 18](cases/18-projectile-source-and-target-lifecycles.md) | [Projectile](../architecture/projectile.md) |
| 路线解释、导航与实际位移 | [Case 13](cases/13-route-and-movement-timing.md)、[Case 15](cases/15-locomotion-native-semantics.md)、[Case 31](cases/31-route-operations-and-state.md) | [Route](../architecture/navigation.md#route-定义与进度)、[Navigation](../architecture/navigation.md)、[Locomotion](../architecture/navigation.md#locomotion) |
| 光环与全局分发的安装关联 | [空间研究 §9](03-space-units-and-mechanisms.md#9-非空间机制与范围贡献) | [Effect](../architecture/effect.md)、[Mechanism](../architecture/ARCHITECTURE.md) |

原生可变对象的局部写入、回调返回、容器清理和池回收不是同一个时点。每个案例分别说明事实何时可见，不将某个 Buff 容器的枚举规则推广为所有领域的统一执行模型。项目代表测试与验收范围集中维护在[验证文档](../architecture/verification.md)。
