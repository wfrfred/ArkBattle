# 架构文档

这里说明 ArkBattle 的领域职责、数据与 API、依赖方向和执行语义。文档描述当前实现及明确的支持边界；机制证据与调查过程保存在 [Research](../research/00-INDEX.md)。职责、接口或行为改变时，同步修改对应文档。

重要的公共契约：

- [状态接续与同步重入](functional-core.md#状态接续后的读取与续执行)：业务回调可以结束外层实例；后继实时事实从最新 BattleState 查询，明确采样的事实保留。每次 Hook 派发独立固定候选。
- [Change 与 Unit 更新](api-conventions.md#51-unit-完整操作与批量变更)：同一宿主的纯变换有序组合，一次发布最终状态，再顺序执行 Settlement。跨领域状态只能通过所属领域操作修改。
- [Lifetime](lifetime.md)：请求同步发布终止态并执行 Prepare；最外层结算器按依赖图完成 Finalize，宿主等待真实依赖者完整返回。嵌套结束返回不保证对象已注销或槽位已释放。
- [Calculate 与 Apply](vitality.md#1-calculate-与-apply-的语义边界)：输出计算不构成受击，Apply 才开始接收。零计算输出拒绝，零实际变化允许成功；HP 死亡确认在两侧 Applied 后，EP Burst 随提交同步启动。
- [Hook](hook.md) 与 [Event](event.md)：类型化的 Unit 本地 Hooks 承载同步业务，Capability 保存专属接收；Event 只提供 UI 需要的瞬时事实，不承担业务结算或统计。
- [Route](navigation.md#route-定义与进度) 与 [Schedule](schedule.md)：创建者提供静态 Unit Definition 和本次 `initial.route: { plan, offset }`；Route 解释路线并发起 Main 终点离场，Schedule 负责出生与等待关系。Core 每次 step 推进一个 Tick，由调用者决定是否继续。

测试先从[语义验收](verification.md)选定重要结果，再选择最小代表场景。接口、字段和实现步骤不自动成为独立测试目标；公共契约集中保障，各领域只补充不同的业务后果。

| 文档 | 内容 |
| --- | --- |
| [总体架构](ARCHITECTURE.md) | 项目分层、状态归属、Tick 发布、不可变约定与模块惯例 |
| [语义验收](verification.md) | 重要结果、集中测试归属与最小验收原则 |
| [函数式内核](functional-core.md) | 状态接续、同步结算、Hook 与执行边界 |
| [内容支持与缺口](tactical-semantics.md) | 当前覆盖、未接入机制与验收要求 |
| [Capability](capability.md) | 配置／状态配对、初始化装配、领域操作与类型约束 |
| [接口约定](api-conventions.md) | 职责分类、Typed Ref、Change、登记、查询和字段写回 |
| [Battlefield](battlefield.md) | 地图、纯存储、结构占格、导航与空间查询 |
| [Hook](hook.md) | 类型化键、本地不可变集合、固有登记、动态变更与派发 |
| [UI 瞬时输出](event.md) | Event 归属、必要载荷和发生时点 |
| [Lifetime](lifetime.md) | 所有权、Scope、依赖图、同步 Prepare 与 Finalize |
| [Action](action.md) | 聚合与执行身份、冷却、释放、输出和终止 |
| [Skill](skill.md) | 持久 Skill、Activation、SP、持续预算与弹药 |
| [Elemental](elemental.md) | 四型 EP、Burst Effect、动态恢复预算与同步通知 |
| [Vitality／Damage／Healing](vitality.md) | 四类结算、Hook、取消、资源提交与死亡 |
| [Effect](effect.md) | 附着实例、竞争、启停、时间与标准效果库 |
| [Projectile](projectile.md) | 独立实例、异构集合、运动命中程序与生命周期 |
| [Targeting／Targetable](targeting.md) | 查询组合、标准资格、目标限制、嘲讽与优先级 |
| [空间存在](presence.md) | 暂时消失、能力限制、主动清理与持续程序 |
| [空间查询](spatial.md) | 命中几何、范围、扫掠和候选查询 |
| [几何与坐标](geometry.md) | Tile／World、Shape／Range、转换、相交与首次接触 |
| [Terrain／Mechanism](terrain.md) | 逐格参数、地形控制器与 Unit Effect |
| [Navigation／Route／Locomotion](navigation.md) | 寻路、路线解释、Context 与自主运动 |
| [Schedule](schedule.md) | Wave／Fragment、Branch、出生、时基与等待 |
| [Blocking](blocking.md) | 关系、资格、容量、批量通知与位置计划 |
| [Deployment](deployment.md) | Card、经济、部署请求、撤退与死亡账务 |
| [Occupancy](occupancy.md) | 双槽占格、实例朝向与乘员／支撑配对 |
| [静态数据转换](data.md) | Unit、Skill、Action、Effect、Level 的输入职责、共享读取与转换边界 |
| [内容接入](content.md) | 静态角色定义、数据编译、共享规则与 Core 边界 |

项目以重要的游戏语义为依据选择工程结构：

1. 显著改变实际玩法结果的差异，优先核对并处理。
2. 局部轨迹或约一个 Tick 的差异，结合实际影响采用简单、确定的项目政策，不要求复刻客户端调度。
3. 没有可观察业务影响的实现差异，不为此增加复杂度。
4. 客户端存在某个分支，不自动构成保留抽象或 API 的需求。

中间过程存在真实业务观察者时，先确定观察者和结果差异，再决定是否细化时序。原生事实、项目选择和当前支持边界分别说明，不能用现有代码或测试证明设计理应如此。

资源机制的原生全链与真实内容依据集中在[案例37](../research/cases/37-resource-mechanism-coverage.md)。本目录描述当前实现，不以普通四条结算管线已存在代替完整原生覆盖；五型EP、特殊生命、归属和权限的差距均按该表保留。
