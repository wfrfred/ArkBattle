# 架构文档

这里定义项目的目标架构：模块应承担的职责、数据与 API、依赖方向及执行语义。实现以这些契约为依据，文件划分服务于职责与阅读顺序。

**已定稿的同步结算契约：** [跨领域操作后的读取与续执行](functional-core.md#状态接续后的读取与续执行)、[每次派发独立选取 Hook 候选](functional-core.md#7-同步候选范围)、[离场清理的必要偏序](deployment.md#离场清理的偏序)。同步重入可以终结外层正在执行的对象；后继若依赖自己或宿主的当前生命周期，必须从最新 battle 查询并确认。

**已确定、待实施的 Blocking 政策：** [职责与调度](blocking.md#已确定的职责与调度政策)。保留 updateUnit() 完整更新；必要解除、容量裁撤与失效清理同步完成，关系 Hook 同步接续；普通接敌每 Tick 在 Movement 后统一执行，不保存各阻挡者的搜索周期。固定阶段造成的行为差异由对照测试评价。

各领域文档记录有效的数据模型、API 和执行语义。尚未完成的重构、开放问题和验收要求保留在对应章节；[接口约定](api-conventions.md)汇总尚未统一的接口，[目标语义与实现缺口](tactical-semantics.md)记录未完成的玩法接入。

| 文档                                      | 内容                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| [总体架构](ARCHITECTURE.md)               | 项目分层、状态归属、Tick 发布、不可变约定与模块惯例                                |
| [Tactical 函数式内核](functional-core.md) | 状态接续、同步结算、Hook、状态归属与 Tick 发布 |
| [Tactical 目标语义与实现缺口](tactical-semantics.md) | 未完成的玩法机制、待核对问题与验收案例 |
| [Capability API](capability.md) | 能力配对、统一初始化与装配、局部变换、完整结算、事件责任与模块命名 |
| [接口约定](api-conventions.md) | 五类接口、Typed Ref、self、时间与尚未统一的接口 |
| [Action 设计](action.md) | 基础间隔与速度、贡献、Cooldown／Casting、程序与实例、调度和 Hook 契约及待定项 |
| [Skill 设计](skill.md) | 泛型 Definition／Activation、SP、持续预算、业务 Hook、完整终止与内容边界 |
| [Elemental 设计](elemental.md) | 四型 EP、动态属性、稳定 Burst 身份、请求与损失通知、完整终止及内容边界 |
| [Targeting 与 Targetable 设计](targeting.md) | 显式请求与选择入口、只读 Filter／Comparator、支持随机的 Selector、固有与动态限制 API |
| [Spatial Query](spatial.md) | 命中几何、离散／连续范围、形状扫掠及只读候选查询 |
| [几何与坐标 API](geometry.md) | Tile／World、Shape／Range、坐标转换与纯几何相交及首次接触 |
| [Terrain 与 Mechanism](terrain.md) | 逐格参数、类型化 Tiles、地形轮询、控制器与 Unit Effect 的职责 |
| [Navigation、Route 与 Locomotion 设计](navigation.md) | 地图、Overlay、寻路查询、路线执行与运动结算的职责划分 |
| [Blocking 设计](blocking.md) | 双端关系、Blockable 唯一归属、分阶段通知、每 Tick 搜索、实时容量与关系身份 |
| [Vitality / Damage 设计](vitality.md) | Calculate、请求与参数类型、Apply 五个时点、普通结果、暂缓的特殊生命语义，以及弱点伤害的项目规则 |
| [Deployment 与 Unit 生命周期](deployment.md) | Card／场上实例、部署参数与 API、登场／离场职责及待定语义 |
| [Effect 设计](effect.md)                  | Unit 附着实例、Definition 泛型、生命周期、Hook／Contribution 接入、Aura 与文件职责 |
| [Projectile 设计](projectile.md) | 独立执行实例、View／Store／Query、内容回调与更新、Step 候选及同步终结 |
| [Tactical 内容接入](content.md) | 主模式配置、静态角色代码、登场内容与 Core 边界 |

[Tactical 研究](../research/00-INDEX.md) 提供玩法行为依据。大语义遵从官方，小差异从简；项目选择自己的执行结构，设计取舍按以下已有分类处理：

1. 显著改变实际游戏行为的差异，优先核对并处理。
2. 只有局部轨迹或一个 Tick 左右的时序差异时，评估影响范围，采用简单、确定的项目约定，不要求完全复刻官方调度。
3. 只改变内部实现、不影响可观察结果的差异，不为此增加设计复杂度。
4. 不因客户端存在某个分支，就保留没有实际业务需求的抽象或 API。

中间过程存在真实业务观察者时，先说明观察者及实际影响，再决定是否细化时序。研究记录中的客户端事实不自动成为项目的实现要求。

架构以玩法需求与明确的项目规则为依据。职责、接口或语义的决策改变时，同步更新相应文档。
