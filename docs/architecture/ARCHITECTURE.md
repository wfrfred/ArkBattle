# ArkBattle 架构

ArkBattle 是通用明日方舟战斗模拟器。Core 推进战斗、维护完整状态；Content 定义具体机制；Data 转换静态资料。卫戍协议是当前重点玩法，不是 Core 的语义边界。生息演算、保全派驻等特殊模式及船运寻路暂不支持。

本文说明整体边界和调度；领域契约由[专题文档](README.md)维护，原生依据见 [Research](../research/00-INDEX.md)。

## 范围与行为依据

机制设计以客户端、配置及实际内容为依据，不复刻原生类结构。显著影响玩法的差异需要核实；细微时序或轨迹差异也须根据实际结果决定，不能仅以“差一个 Tick”接受。简化属于明确的项目选择，证据不足或尚未实现的需求保留在[支持边界](tactical-semantics.md)。

相同初始状态、命令、种子和程序版本产生相同结果。Core 不读取现实时间，不执行网络、文件或渲染操作。

## 项目分层

| 层次 | 输入 | 输出与职责 |
| --- | --- | --- |
| Data | 原始资料、本次静态配置 | 原表读取、静态数据转换与初始地图 |
| Content | 原始资料和转换后的静态数据 | 完整 Definition，包括回调和初始化程序 |
| Core 初始化 | Definition、Initial | 初始 State |
| Core 推进 | 当前 State、命令 | 下一 State 及本次业务报告、UI 事件 |
| 外部调用者 | 战斗输入与 Core 返回值 | 驱动、胜负、得分、Meta、I/O 与展示 |

Data 按 [Unit、Skill、Action、Effect、Level](data.md)组织。调用已有工厂绑定静态参数不改变其转换职责；具体行为程序由 Content 或 Core 标准实现提供。内容私有数据随实例保存在 Core State 中，Content 模块不另存运行态。

## Meta 与 ArkBattle

Meta 管理商店、抽取、局外养成等过程，把选定的战斗配置交给 ArkBattle；ArkBattle 不反向依赖 Meta。房间、连接、现实计时和展示对象同样归外部。

Core 不裁定胜负，也不因 Schedule 完成而冻结。调用者读取调度、单位和其他领域事实，自行决定是否继续调用 `step`。

## 战斗状态的层级

`BattleState` 持有 Tick、RNG、实例编号分配进度、Schedule、Deployment、Effect Store、Lifetime 与本 Tick 的 events。Battlefield 持有 Map、Unit、Projectile、Navigation 和 Occupancy 结构索引。

每项业务事实有唯一所属领域。索引随权威状态同步维护，不形成第二份 Unit；UI 事件只记录表现所需的瞬时事实，不作为结算命令重放。各领域的所有权见[专题文档](README.md)，不可变和状态接续规则见[函数式内核](functional-core.md)。

`initialize` 按手牌、`initialEffects`、`initialUnits` 的顺序创建完整初态，每组按输入顺序逐个初始化并登记。`step(battle, commands)` 接收必填只读命令数组，每次成功调用推进一个 30 Hz 逻辑 Tick。无命令时传 `[]`。

当前 Tick 顺序如下，前一步返回的状态是后一步的输入：

| 顺序 | 调度阶段 |
| --- | --- |
| 开帧 | 固定本 Tick 的 Projectile 候选，清空上一 Tick 的 events |
| 1 | Deployment 计时与资源推进 |
| 2 | Combat 命令准备，再处理部署命令 |
| 3 | Schedule |
| 4 | Unit tick Hook |
| 5 | Effect（含全场无宿主程序） |
| 6 | Vitality 自然 HP 回复，再 Elemental 自然 EP 回复 |
| 7 | Skill，再 Combat |
| 8 | 开帧候选中的 Projectile |
| 9 | Movement：站位计划、Route 与 Locomotion |
| 10 | Blocking：维护旧关系，再搜索新关系 |
| 收帧 | Tick 加一并返回 |

领域决定自己的候选、首次推进和续执行资格。上述顺序不代表所有新实例都采用相同的“下 Tick 才推进”政策。Unit 完整离场会同步解除 Schedule 等待，不依赖收帧扫描；普通 HP 死亡由资源操作确认，不另做 Combat 零 HP 扫描。

## Unit 与 Capability

Unit 提供身份、共享 Definition、连续位置、生命周期与本地 Hook 集合。Capability 为其增加成对的 Definition 和 State；登记后能力组成保持稳定。Catalog 从 initializer 签名推导装配与必需 Initial，创建者先确定具体 Definition，再初始化并登记 Unit。

Route 的本次 Plan／offset、Occupancy 的本次 tile 等实例事实经 Initial 提供。初始 Effect 在 Unit 登记后的 `entered` Hook 中安装，不接受预装运行实例。构造与类型约束见 [Capability](capability.md)及[接口约定](api-conventions.md)。

## Subsystem 的责任与调用

`battle/` 保存全局状态、外部命令、初始化和 Tick 调度。Blocking、Deployment、Resource、Schedule 和 Targeting 各有自己的子目录，定义在战斗上下文中生效的规则。`battlefield/` 提供地图、登记、空间索引与导航。Battlefield 的操作以战场状态为输入，Battle 负责协调这些空间事实与战斗业务。

`unit/` 保存 Unit、能力和宿主内实例。Action 与 Skill 各自在 Capability 目录中组织装配和运行模型。`projectile/` 与 `effect/` 各自负责独立实例及其生命周期。`lifetime/`、`geometry/` 与 `common/` 提供共享机制，`effects/` 提供标准效果。

| 领域 | 负责的事实与操作 |
| --- | --- |
| [Resource](resource.md) | HP／EP Damage、Healing 的 Calculate／Apply 与本次结算结果 |
| [Vitality](vitality.md)、[Elemental](elemental.md) | 各自资源、属性与提交；Elemental 另负责 Burst |
| [Action](action.md)、[Skill](skill.md) | 行动执行、冷却，以及技能资源和 Activation |
| [Effect](effect.md) | 有宿主或无宿主的运行实例、重复施加、竞争、启停与到期 |
| [Lifetime](lifetime.md) | 依赖、结束请求与 Finalize 顺序 |
| [Targeting](targeting.md) | 目标资格谓词与比较器，直接组合 Query |
| [Projectile](projectile.md) | 独立弹道实例及其内容程序 |
| [Navigation／Route／Locomotion](navigation.md) | 导航、路线解释与实际自主运动 |
| [Blocking](blocking.md)、[Occupancy](occupancy.md) | 阻挡关系与站位计划、双槽占格与配对 |
| [Presence](presence.md) | 暂时消失及适用的持续限制、主动清理 |
| [Schedule](schedule.md)、[Deployment](deployment.md) | 出生与等待，Card、部署资源与部署业务 |
| [Terrain](terrain.md) | 地块内容、接触控制器与接触结算 |

Runtime 只安排调用时点；各领域拥有内部顺序与业务资格。协调流程也只能通过所属领域的合法 Change 或完整操作修改状态。目录和导出位置不授予跨领域写入权。

## 不可变值与静态定义

Definition、State、Ref 和已发布集合共享不可变引用；更新只构造受影响路径。局部构建器和可重建缓存可以内部可变，不得改变已发布版本的事实。实例直接关联共享 Definition，不以另一套运行注册表代替它。

内存快照可以共享 Definition、Hook 和动态贡献函数。跨进程导出与恢复由序列化边界重新关联定义和行为，不把函数对象直接当作传输格式。

## TypeScript 与模块惯例

Core 是严格检查的 TypeScript 系统，使用 ESM 和具名导出。类型应保留实际能力、身份和私有状态配对；擦除集中于异构容器和受信任调用边界。输入校验、命名、模块入口及字段写回统一遵守[接口约定](api-conventions.md)。

## 验证与架构成本

先根据原生依据或明确的项目选择确定语义，再从中推导[必要验收](verification.md)。现有代码和测试不能反过来证明语义正确；未实现需求不能因普通路径已通过而宣告完成。

抽象应接管真实重复的身份、生命周期或结算职责。相似概念出现特例必须追查；存在真实领域差异时保留，不为表面统一或假想需求增加协议。
