# 架构文档

这里定义项目的目标架构：模块应承担的职责、数据与 API、依赖方向及执行语义。实现以这些契约为依据，文件划分服务于职责与阅读顺序。

**已定稿的同步结算契约：** [跨领域操作后的读取与续执行](functional-core.md#状态接续后的读取与续执行)、[每次派发独立选取 Hook 候选](functional-core.md#7-同步候选范围)、[Lifetime 请求与依赖析构](lifetime.md)、[离场清理的必要偏序](deployment.md#离场清理的偏序)。请求同步发布终止态并执行 Prepare；最外层结算器按 DAG 完成 Finalize，宿主等待真实依赖者完整返回。嵌套结束不保证槽位已释放或对象已注销，后继实时事实从最新 battle 查询。

**已定稿的输出与接收边界：** [Calculate 与 Apply](vitality.md#1-calculate-与-apply-的语义边界)分别负责本笔伤害／治疗的输出计算与目标接收。输出计算不派发本笔受击响应；零计算输出在 Apply 入口拒绝，零实际变化允许成功。两阶段按机制语义安排内容程序，不以复刻原生 Hook 时序为目标。

**已定稿的结算 Hook 类型与登记：** [固定 Context、工作值与取消](vitality.md#16-已定稿的结算-hook-类型)由四种业务分别提供精确契约。取消不停止接收派发，后续保留已有取消及原因；领域 cancel 构造函数封装类型断言，Applied 只携带成功提交事实。[类型化键与 Unit 本地 Hooks](hook.md)承载固有及动态登记，通用 setHook／removeHook 返回 Change，生命周期键也允许运行时修改；专属接收仍归 Capability。目标契约已定，源码尚待迁移。

**已定稿的资源操作边界：** [Vitality／Elemental 的资格、接收与提交](vitality.md#18-已定稿的接收与资源提交接口)由 Battle 编排、Capability 实施；commit 复用对应业务的 CommitContext，返回能力定义的资源报告。HP 死亡确认位于两侧 Applied 后，EP Burst 随资源提交同步处理。四项设计已闭合，源码仍待迁移。

**已确定的 Unit 变更与 Blocking 政策：** [Unit 批量变更](api-conventions.md#51-unit-完整操作与批量变更)采用 Ref 绑定 Change：全批纯转换、一次 Field 发布、原顺序结算；精确私有 state 写回和完整生命周期操作保持原协议。[Blocking](blocking.md#已确定的职责与调度政策)明确构造与通知关系，后继局部维护本对象或受影响 owner，不扫描无关批次；完整 Tile 操作仍可全场维护。临时 HP 为 0 不提前解除旧关系，真实离场由 Unit.remove 的统一 prepare 节点接入 Blocking 自身清理。普通接敌每 Tick 在 Movement 后统一执行。

各领域文档记录有效的数据模型、API 和执行语义。尚未完成的重构、开放问题和验收要求保留在对应章节；[接口约定](api-conventions.md)汇总尚未统一的接口，[目标语义与实现缺口](tactical-semantics.md)记录未完成的玩法接入。

已审查部分先按[语义验收](verification.md)确定保留目标，再重新选择最小测试。当前范围为 Battlefield、Unit 独立领域、Action／Allegiance／Blocking／Deployable Capability 及对应 Battle 协作。领域文档的关键语义、接入／实现说明与未决内容分别阅读，接口和字段列表不自动成为测试清单。

| 文档                                      | 内容                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| [总体架构](ARCHITECTURE.md)               | 项目分层、状态归属、Tick 发布、不可变约定与模块惯例                                |
| [已审查范围的语义验收](verification.md) | 关键保留目标、范围边界与最小验收原则 |
| [Battlefield](battlefield.md) | 地图、纯存储、结构占格、导航与空间查询，以及完整 Battle 结算边界 |
| [Tactical 函数式内核](functional-core.md) | 状态接续、同步结算、Hook、状态归属与 Tick 发布 |
| [Tactical 目标语义与实现缺口](tactical-semantics.md) | 未完成的玩法机制、待核对问题与验收案例 |
| [Capability API](capability.md) | 能力配对、统一初始化与装配、Change 工厂、完整结算、事件责任与模块命名 |
| [接口约定](api-conventions.md) | 五类接口、Typed Ref、self、时间与尚未统一的接口 |
| [Hook 集合与登记](hook.md) | 类型化键、Unit 本地不可变集合、固有组合、动态 Change 与生命周期派发 |
| [Lifetime 与依赖析构](lifetime.md) | 静态描述符、Scope、权威依赖图、同步 Prepare、Pending DAG 与最外层 Finalize |
| [Action 设计](action.md) | 基础间隔与速度、贡献、Cooldown／Casting、程序与实例、调度和 Hook 契约及待定项 |
| [Skill 设计](skill.md) | 单槽 Skill／Activation 聚合、两种 Ref、Capability 工厂、SP、持续预算、业务 Hook 与完整终止 |
| [Elemental 设计](elemental.md) | 四型 EP、动态属性、稳定 Burst 身份、请求与损失通知、完整终止及内容边界 |
| [Targeting 与 Targetable 设计](targeting.md) | 显式请求与选择入口、只读 Filter／Comparator、支持随机的 Selector、固有与动态限制 API |
| [Spatial Query](spatial.md) | 命中几何、离散／连续范围、形状扫掠及只读候选查询 |
| [几何与坐标 API](geometry.md) | Tile／World、Shape／Range、坐标转换与纯几何相交及首次接触 |
| [Terrain 与 Mechanism](terrain.md) | 逐格参数、类型化 Tiles、地形轮询、控制器与 Unit Effect 的职责 |
| [Navigation、Route 与 Locomotion 设计](navigation.md) | 地图、Overlay、寻路查询、路线执行与运动结算的职责划分 |
| [Blocking 设计](blocking.md) | 双端关系、Blockable 唯一归属、分阶段通知、每 Tick 搜索、实时容量与关系身份 |
| [Vitality / Damage 设计](vitality.md) | Calculate／Apply 边界、精确 Hook 类型、取消与提交报告，以及弱点伤害和特殊生命语义 |
| [Deployment 与 Unit 生命周期](deployment.md) | Card／场上实例、部署参数与 API、登场／离场职责及支持范围 |
| [Effect 设计](effect.md)                  | Unit 附着实例、Definition 泛型、生命周期、Hook／Contribution 接入、Aura 与文件职责 |
| [Projectile 设计](projectile.md) | 独立完整实例、异构 Store／Query、内容回调与更新、Step 候选及终止请求／Finalize |
| [Tactical 内容接入](content.md) | 主模式配置、静态角色代码、登场内容与 Core 边界 |

[Tactical 研究](../research/00-INDEX.md) 提供玩法行为依据。大语义遵从官方，小差异从简；项目选择自己的执行结构，设计取舍按以下已有分类处理：

1. 显著改变实际游戏行为的差异，优先核对并处理。
2. 只有局部轨迹或一个 Tick 左右的时序差异时，评估影响范围，采用简单、确定的项目约定，不要求完全复刻官方调度。
3. 只改变内部实现、不影响可观察结果的差异，不为此增加设计复杂度。
4. 不因客户端存在某个分支，就保留没有实际业务需求的抽象或 API。

中间过程存在真实业务观察者时，先说明观察者及实际影响，再决定是否细化时序。研究记录中的客户端事实不自动成为项目的实现要求。

架构以玩法需求与明确的项目规则为依据。职责、接口或语义的决策改变时，同步更新相应文档。
