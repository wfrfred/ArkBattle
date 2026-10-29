# 第一轮 case study：subsystem 调用协议

研究日期：2026-10-07。沿用 [研究原则](../00-INDEX.md)：项目自身确定性与可观察游戏语义一致，不复刻官方 RNG 消费轨迹或无语义影响的内部实现。

本轮不增加大领域清单，不修改代码，也不确定最终 API。目标是用具体调用链回答：长期事实归谁；一步返回时完成了什么；后续步骤与嵌套调用可以看见什么。

案例区分本季实际引用与协议压力样例。当前整理棋子池没有维什戴尔，浊心斯卡蒂默认技能为 S3；维什戴尔和斯卡蒂 S1 分担模板用于验证常规引擎的协议能力，不作为本季新增角色／技能支持承诺。鼓舞的本季引用则沿斯卡蒂 S3 的实际配置核对。

## 案例

| 案例 | 内容锚点 | 主要问题 |
| --- | --- | --- |
| [01 Buff 安装与父作用域](01-buff-installation-and-parent-scope.md) | 维什戴尔残影；鼓舞源值刷新作对照 | 安装／生效／开始动作的区别；父作用域与来源；结束传播与贡献撤销 |
| [02 Action 与 projectile 阶段](02-action-and-projectile-phases.md) | 维什戴尔普通远程攻击；确有必要的技能模式对照 | 目标与数值读取时点；在途事实；命中、取消与执行后继 |
| [03 Dispatch 与嵌套结算](03-dispatch-and-nested-settlement.md) | 本季泥岩盾；真实分担模板作对照 | 伤害取消与盾消耗／回复；本次／嵌套／下次派发；嵌套返回与外层继续结算 |
| [04 协议结论](04-protocol-conclusions.md) | 前三案交叉核对当前实现 | 可落定的调用约束、局部事实与派生关系可见性，以及仍不能统一的部分 |
| [05 Skill 开始与结束](05-skill-start-and-finish.md) | 已安装客户端普通 Skill／Ability 原生路径 | 同步结束回调、进入内容的后继与未来 coroutine 的取消边界 |
| [06 天赋生命周期与建模](06-talent-lifecycle-and-model.md) | 当前客户端 BasicTalent／RebornTalent 与代表性主模式天赋 | 选型、参与、私有状态与多种作用域；独立 Talent Capability 的判断依据 |
| [07 攻击周期、动画与执行占用](07-action-timing-and-animation.md) | 玫兰莎、能天使、泥岩、弩手、安洁莉娜与莫斯提马 | Cooldown 与 Casting、缓存等待、逻辑动画事件、起手／续轮与后继释放 |
| [08 Action 启动资格与中断](08-action-eligibility-and-interruption.md) | 当前客户端 Ability、单位攻击状态与 EnemySkill；PRTS 异常／触发规则 | 主动作互斥与嵌套调用、启动与中断、结束业务、敌人技能计时与随机平局 |
| [09 Skill 机制与需求](09-skill-mechanisms-and-requirements.md) | PRTS 技力／特殊技能／模式策略；客户端 metadata、原生指令与实际资源；10-29 补核修正协议 | SP 与进度、支付与门槛、触发与持续、跨次状态、弹药与二次操作、结束后输出；2.5／2.6 区分统一数据 Input、项目归并政策与 Rune／遗物逐项舍入 |
| [10 弱点伤害与概率判定](10-weak-damage-and-critical.md) | 本机 WeakDamage、AtkScaleUp、CalculateDamage 与 Buff 模板 | 已有倍率与无事件试算的区别、事件先后、概率状态及原生／热更新证据边界 |
| [11 Damage Apply 与 HP Application](11-damage-apply-and-hp-application.md) | 本机接收／HP 原生路径、泥岩盾／玛恩纳反伤／分担模板与 PRTS 致命机制 | 分列客户端证据、Wiki 说明与项目政策；取消后资格、同步反应、普通免死竞争与其他生命干预的边界 |
| [12 SPFA、平滑与移动消费](12-navigation-native-algorithm.md) | 当前 DLL／metadata 原生指令、射线隔离仿真与 Stronghold 对照 | 原地后继更新、Bresenham 边界、运行时移动恢复、地图重规划与最终 Field 是否需要 rawNext |
| [13 Route、等待与实际移动时序](13-route-and-movement-timing.md) | 当前 Enemy 状态机、DirectionCursor 与 Checkpoint 原生分支 | 请求方向与 Tick 的两处推进、等待计时、不可达路点跳过、目标采样及 nextPoint 简化边界 |
| [14 RouteDefinition 字段消费](14-route-definition-fields.md) | 当前出生／Cursor／完成检查原生分支及固定版本全部关卡 JSON | 十个字段的行为与归属、持续路线偏移、中心访问开关使用情况和提前终点完成 |
| [15 Locomotion 运动与空间约束](15-locomotion-native-semantics.md) | 当前 MoveController、Enemy 状态机、地图与物理原生分支，实际控制器 Prefab | 积分、吸附与速度保留、地形避障和反射、移动资格、分离与推拉、移速范围及 moving 观察语义 |
| [16 Projectile 运动与命中边界](16-projectile-motion-and-hit-boundaries.md) | 当前 Projectile / Movement / HitBehaviour 原生分支，普通弩手、空爆、沿途碰撞和阿米娅实际 Prefab | 共用生命周期、运动组合与计时命中、原目标直选与附加候选资格、Targeting 调用归属 |
| [17 Projectile 停止与终结](17-projectile-stop-and-termination.md) | StopMe / TryEliminate / 回收原生分支，逻各斯清弹、维什戴尔、慑砂与承曦格雷伊实际配置 | 普通停止与消除、Hit / Stop / Destroy 顺序、同步终结重入和到达后活动等待 |
| [18 Projectile 来源与目标生命周期](18-projectile-source-and-target-lifecycles.md) | Entity 死亡／撤退／路线消失、ObjectPtr / MountPoint、普通 ApplyDamage、暗索套索及维什戴尔实际配置 | 身份与存活／空间资格、继续追踪与保底命中、来源数值回退与归属、可选生命周期依赖 |
| [19 Effect 索敌与异常免疫](19-effect-selection-and-immunity.md) | 爱丽丝／卡夫卡睡眠选择、鼓舞光环与标记、Buff 安装及异常 Anti／Immune 原生分支 | 免疫者是否占目标名额、选择与施加／生效的区别、EFFECT Purpose 的必要性及当前项目缺失 |

## 每个案例的记录方式

每篇保留最小内容引用链、能区分语义的执行轨迹和证据锚点。区分客户端直接证实、由证据推导的约束、项目选择及尚未核对事项。示意中的数值和 ID 若不是原始数据，标为说明用假设，不能当成官方参数。

围绕一次调用记录以下内容：

| 维度 | 需要回答 |
| --- | --- |
| 输入与资格 | 调用者已经决定了什么；接收领域还必须检查什么 |
| 读取时点 | 哪些输入已经冻结；哪些读取本次最新事实；哪些关系来自阶段基线 |
| 状态归属 | Unit、附着实例、执行过程或机制保存什么；哪些只是派生结果 |
| 内部顺序 | 哪些顺序由领域保证；哪些后继由内容程序组织 |
| 返回与可见性 | 返回前完成哪些变化、报告和嵌套操作；外层下一步读到什么 |
| 退出与取消 | 拒绝、取消、结束、退场与延迟清理分别留下什么 |

## 两种提交点

**局部生效点**使变化成为后续步骤或嵌套调用的输入；**权威发布点**把工作结果提交并对外公开。二者不必相同，不能将官方可变对象写入动作直接翻译成“必须立即提交公开 Battlefield”。

单位事实、Buff 有效性、当前 Modifier、Blocking 关系和导航投影也不自动共享同一个可见性时点。每案分别说明，避免用“最新世界”掩盖差异。

## 研究验收

每项结论必须有一个能改变游戏结果的区分例子。例如父 Buff 结束而来源 Unit 尚在场、命中前来源 ATK 改变、前一个接收规则使后一个候选失效、分担目标先发生 HP 变化再返回外层处理。

若差异仅是无效抽样、内部容器、回调名称或与项目固定 tick 无关的调度实现，不作为协议前置。证据不足时保留具体未决问题；项目可以选择明确且确定性的行为，但不能把选择写成官方事实。

本轮产物是调用协议结论与差距，不是要求全部 subsystem 采用同一种 step、同一种 Work 或同一种生命周期接口。
