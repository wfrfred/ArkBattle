# 架构文档

本目录描述当前设计与支持边界；[Research](../research/00-INDEX.md)保存原生依据和实际使用例。阅读顺序是[总体架构](ARCHITECTURE.md) → 所属领域 → 需要时查公共协议。测试从[语义验收](verification.md)导出，不按接口或历史用例逐项保留。

## 公共契约

| 文档 | 权威说明 |
| --- | --- |
| [总体架构](ARCHITECTURE.md) | 项目分层、状态层级、Tick 顺序、外部驱动边界 |
| [函数式内核](functional-core.md) | 不可变版本、同步重入、明确采样与最新事实、执行责任 |
| [接口约定](api-conventions.md) | 命名、Typed Ref、类型恢复、Query、Change 与写回 |
| [Attribute](attribute.md) | 数值底值、有效贡献、当前范围与领域后继 |
| [Hook](hook.md) | 类型化 Key、登记、优先级、固定候选与逐项读取 |
| [Lifetime](lifetime.md) | Scope、依赖图、Prepare／Finalize 与延后操作 |
| [Resource](resource.md) | 四种 Calculate／Apply、Pending、排除／豁免、死亡归属 |
| [Event](event.md) | UI 瞬时事实及其与业务结算的边界 |
| [语义验收](verification.md) | 必要结果、代表场景和集中测试归属 |

## 领域

| 领域 | 文档 |
| --- | --- |
| Unit 构造与能力装配 | [Capability](capability.md) |
| HP／负生命、EP／Burst | [Vitality](vitality.md)、[Elemental](elemental.md) |
| 行动、技能、附着实例、弹道 | [Action](action.md)、[Skill](skill.md)、[Effect](effect.md)、[Projectile](projectile.md) |
| 目标资格与选择、暂时消失 | [Targeting／Targetable](targeting.md)、[Presence](presence.md) |
| 战场、几何与空间查询 | [Battlefield](battlefield.md)、[Geometry](geometry.md)、[Spatial](spatial.md) |
| 寻路、路线与运动 | [Navigation／Route／Locomotion](navigation.md) |
| 阻挡、占格、部署 | [Blocking](blocking.md)、[Occupancy](occupancy.md)、[Deployment](deployment.md) |
| 出兵与等待、地形与非空间机制 | [Schedule](schedule.md)、[Terrain／Mechanism](terrain.md) |
| 静态资料与具体行为接入 | [Data](data.md)、[Content](content.md) |
| 当前支持与真实缺口 | [内容支持边界](tactical-semantics.md) |

当前 [Core 缺口与待查证](research-necessity-20261122.md)及[全库初次盘点](research-audit-20261122.md)分别保留复核结果和原始编号。

每项语义只在所属文档维护完整说明，其他位置链接引用。领域文档保留职责、重要状态、业务顺序、可观察边界和依据；不复制导出清单、通用协议或废弃设计。调查不足和未实现需求必须可见，不能用已有实现或测试互相证明已经完整。
