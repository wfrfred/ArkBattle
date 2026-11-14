# 面向、转向条件与写入时点

核对日期：2026-11-14。问题是单位何时尝试转向、何时允许转向，以及业务最终读取哪份方向事实。研究不新增 Core 字段或 Capability，不将原生 Animator、继承结构和标志枚举直接作为项目设计。

## 1. 来源与概念

本批复用[既有面向研究](../evidence/facing-semantics-20261113/README.md)，补提同指纹 DLL／metadata 的条件、调用者及配置。新证据见[批次说明](../evidence/facing-conditions-20261114/README.md)。原生分支、Prefab 绑定、关卡实际引用和运行观测分别标注；没有启动游戏或执行 XLua。

[PRTS 作战机制](https://prts.wiki/w/作战机制#敌人朝向与相对方位)提供移动、攻击、受力与正背面需求；[眩光手雷](https://prts.wiki/w/眩光手雷)是方向影响控制结果的例子。PRTS 的概述不代替下列限定调用链，摄像机投影尤其不是所有改向的统一规则。页面访问与检索限制见 `sources.json`。

| 原生事实 | 含义 |
| --- | --- |
| Entity.m_faceTo | 最近成功写入的目标方向向量。 |
| Entity.m_direction | 身体四向，可由独立操作与政策更新。 |
| Unit.faceSign | 玩法读取的有效左右符号；有 Animator 时使用对应实现，不保证总是 m_faceTo.x 的符号。 |

位置、控制器速度、部署四向都不能无条件还原历史左右面向。纯竖直输入、转向资格失败或下游未发布时，旧符号可能继续有效。反过来，动画翻转有过程不代表玩法符号一定等待过程结束。

## 2. 统一转向资格

`Entity.FaceTo(direction, force, idle)` 先决定能否写 m_faceTo，成功后写向量并调用虚拟 OnFaceChanged。普通 native 准入要求同时满足：

- `get_isFixedRotation` 为 false。metadata slot69，Character／Enemy 各自读取 `_isFixedRotation`。
- `get_isStunned` 为 false；包含 STUNNED 与 STUNNED_NO_AMPLIFY_DAMAGE。
- 没有 UNMOVABLE 和 UNMOVABLE_PRIVATE。
- `get_isFrozen`、`get_isLevitate` 均为 false。

`force=true` 与普通准入作 OR，可以越过这一层；但不能据此认定所有外层前置条件或下游符号更新都被越过。FaceTo 自身没有按同值或零向量提前返回。

`FaceToTarget` 则先计算目标地图位置减自身地图位置，仅当平方距离大于原始 float 常量约0.04时调用 FaceTo。force 不绕过该前置距离检查。Direction／Front／Back 入口另按身体方向生成向量，仍不是左右符号的直接 setter。

依据：`gates/native.json`、`gates/metadata.json`、`gates/target-threshold.json`。两个曾未解的异常编号13／22分别为 UNMOVABLE／UNMOVABLE_PRIVATE；0x590虚调用按本客户端 vtable 基址与 slot 配对为 get_isFixedRotation，不以偏移猜测业务名。

## 3. 调用者决定尝试时点与方向

### 移动、出生与位置操作

| 入口 | 已确认的尝试条件与取值 |
| --- | --- |
| 普通 Enemy._MoveByCursor | 未禁用移动改向，导航方向非零，距当前预测导航目标超过0.25，才计算面向并调用非强制 FaceTo。该距离不是本 Tick 位移或控制器速度。 |
| Enemy.InitFaceTo／OnBorn | dontSetEnemyFaceByCursorWhenBorn=false 才取当前 Cursor.GetNextDirection，强制 FaceTo；不经过普通移动的方向计算。 |
| Enemy.OnDisappearChanged | 重新出现时取 Cursor 方向，经方向计算后强制 FaceTo；消失分支不执行该改向。不能假定重新出现总保留旧面向。 |
| ForceSetPosition／部分 Blink | 使用新旧位置差的非零方向，按各入口调用非强制 FaceTo；并非任何位置写入都自动转向。 |
| BlinkWithDirection／TransportInternal | 使用调用者给出的方向；Transport 先改道、改位置，再尝试改向。 |
| ReassignRoute／ChangePathMotionMode | 所查方法本体没有直接 FaceTo 调用；不能据此排除 Cursor 初始化中 Checkpoint.OnBegin 的同步空间副作用，或后续移动引起的转向。 |

普通移动的 `_CalculateFaceDirection` 还区分：`useMoveDirAsFaceDir=true` 直接使用输入；否则在方向接近竖直且非 deterministic 的限定分支进行摄像机投影，仍接近竖直时可以查询 Cursor 下一次转向。不能全部压成无条件摄像机方向或无条件世界 X。具体阈值与向量来源见 `movement/`。

[路线操作调查](31-route-operations-and-state.md#3-状态究竟保留什么)已确认 ReassignRoute 会经 Cursor 重置执行首条 Checkpoint 的 OnBegin；若其触发重新出现，可同步进入上面的改向链。直接调用缺失与完整操作没有面向后继是两个不同判断。

### 攻击、治疗及其他动画行动

普通 `Ability.StartCastingInternal` 先发布施法事实，再调用 OnCastStart。`AbstractAnimatedAbility.OnCastStart` 调用父程序后处理面向，随后才启动动画。所查普通基类转向不在 OnCastEnd、命中或每 Tick 重新索敌时执行；特殊实现可以覆盖。

基类依次选择首个启用的配置：朝目标、朝默认方向、朝正面、朝首个施法目标。全部关闭则不由该程序改向。`forceFaceToDirection` 只决定调用下层时的 force，不是独立触发方式。`checkFaceToFirstCastTargetDownAttack` 用于下向攻击动画判定，不能额外解释为转向时点。

实际配置的差别见 `attack/`：普通弩手的远近攻击启用朝目标；泥岩 S2 的 RollAttack 不启用这些基类改向选项；莫斯提马 S2 使用默认方向；末药普通治疗启用朝目标。因此“攻击一律面向目标”和“治疗不转向”都不是通用规则。配置绑定可执行不等于实战观测，具体技能能否在本次战斗发动仍由其业务决定。

三个已确认覆盖不能混成基类参数：TargetCenteredAreaMeleeAttack 按中心目标及宿主 alive 处理；CastOnTileAbility 可在基类之后再朝首个施法格；PyczogMultiRangedAttack 使用自己的方向表。原始方法、slot 和具体分支见 `attack/README.md`。

### 受力、待机与显式机制

`Enemy.KnockBack` 仅在 changeFaceByDirection=true 且输入方向非零的分支尝试朝反施力方向转向。统一准入与后续发布仍适用，不把任意推拉或持续受力都等同于每 Tick 改向。

Character 的待机恢复是另一条业务：没有来源键禁用恢复、当前未阻挡目标、Idle 动画存在时，TryFaceToIdleDirection 调用非强制 FaceToDirection。IdleState.OnEnter、动画行为和显式节点可调用它。动作结束本身不是无条件恢复朝向的公共事实。

Character.OnBorn 从身体方向生成初始向量；非固定朝向且为上下方向时，地图的 TryGetInitialLOrR 可以参与左右选择，最后强制 FaceTo。Unit.SwitchMode 的非初始化路径会恢复切换前采样的向量与身体方向，不能把切模式一律解释为重置朝向。显式 FaceToTarget、SetBodyDirection 和按 Buff 时间改向的动作节点各有参数；身体与左右方向可能分开改写。

## 4. 从方向写入到有效左右面向

FaceTo 之后还要经过 Enemy.OnFaceChanged、Unit／Animator 及具体符号实现。Enemy 的所查普通分支在眩晕时不继续发布；因此强制写入 m_faceTo 不等于当下的有效左右符号已经改变。

SingleSpineAnimator 的有效符号可以直接读取 FaceSwitcher 的当前左右状态；StartSwitch 在启动切换时已同步写入这个状态。因此该实现的翻转动画时长不等于玩法面向延迟。其 ParseDirection、接近竖直时的 X 阈值以及其他 Animator 的差别见 `sign/`，不将一个实现的结论泛化到全部后端。

SingleSpine 在无法由四向解析得到左右时使用约±0.05的 X 门槛，CharacterAnimator 的对应计算使用约±0.2，夹区保留当前左右。MultiSpine 则继承基类 faceSign 存储，切换回调才更新它，普通 tween 路径可以延迟有效符号；这是已核实的类型链，但本批没有闭合一个会因此改变方向玩法结果的实际 MultiSpine 内容。不能据此要求 Core 实现动画计时，也不能把所有后端都描述为立即更新。

火龙的实际 Prefab、FaceSwitcher 和 TailCut 部件引用已补核；部位程序按方向累计数值并触发指定 Buff，不是纯 HUD 显示。具体身份、模式范围、实际普通关卡引用及提取指纹见 `sign/README.md`。

## 5. 未闭合事项与架构约束

- PRTS 概述还列出发生阻挡时改向。本次普通阻挡登记、位置调整及其回调中，尚未找到独立的改向调用链；已搜索的直接调用与虚调范围见 `movement/`。不能据此断言原生没有该行为，也不能把攻击启动造成的转身冒充阻挡登记必然同步转身。
- 没有穷举全游戏的 Animator、脚本热更新或所有机制参数。异常结束后是否主动重发此前未发布的面向，不能由上面的失败分支单独推出。

原生事实支持把历史面向、尝试改向的触发者、准入资格和具体正背面判定分开组织。面对一次移动或攻击，既要知道本次是否要求改向，也要知道准入及方向规则；普通伤害本身不应无条件替来源或目标转身。

## 6. 已确定的项目边界

Core 的有效面向使用字符串联合 LEFT／RIGHT；sign 按 LEFT=-1、RIGHT=1 推导，不作为第二份持久状态。通过业务资格并发布的面向变更立即对后续同步业务可见，读取仍接续最新 BattleState，不改变既有 Change 的发布与结算契约。

动画只消费模拟结果。Core 不让 Animator 类型、骨骼参数、翻转动画、动画回调或摄像机状态决定面向值及生效时点，也不按动画后端复制不同的纵向阈值。原生目标向量与动画符号的两层发布、MultiSpine 的符号延迟等保留为研究事实；项目选择由 Core 自己提交唯一的有效左右面向。

Facing 独立保存左右面向，定义提供 Rules，实例必须提供初始方向。普通 turn 要求当前宿主 PRESENT 且规则通过，FORCED 只绕过转向规则；同方向请求不生成状态。方向向量统一按世界 X 正负映射，X 为零保留原面向。Schedule 的 RIGHT 初值、地面敌人 enter 的导航初始化，以及 Deployment 对上下摆放采用 RIGHT 均为项目初始化政策，不声称复制全部原生地图与动画分支。

移动通过自身资格后才按导航方向尝试改向，转向失败不阻止移动；既有普通攻击在首次推进的开始程序请求改向，泥岩 S2 保持原面向。眩晕分别限制转向和移动。受力、待机与其他特殊程序继续由实际内容决定请求时点，不由任意位置或速度写回自动触发。完整类型、操作和必要回归语义集中见[Facing](../../architecture/capability.md#facing)。

## 7. 圆仔的表达能力核对

2026-11-14 依据 [PRTS 圆仔](https://prts.wiki/w/圆仔)级别0能力说明作定向核对，来源、候选原生节点与限制见[证据](../evidence/yuanzai-facing-check-20261114/README.md)。圆仔每0.3秒统计左右我方干员，忽略普通可选性且不计同X坐标，朝较多一侧，同票保持；不是每次普通改向请求都重新统计。

独立 Facing 能保存“面向左、仍向右移动”。内容程序可以在采样时更新自身 Facing Rule，使普通改向只允许本次采样选定的方向，再请求普通 turn；移动的相反方向请求被拒绝而不影响位移，其他控制 Rule 仍参与。规则若直接读取实时人数，会把0.3秒采样改成逐请求重算；仅在 Tick 中改向而不限制默认移动改向，也不能保持圆仔的锁定语义。正面物理／法术减伤可由接收 Hook 读取 Facing 与当前来源位置表达，PRTS 明确来源丢失不属于对应的方向来源。

倒走不能直接等同于历史 velocity 与 Facing 的符号不同。PRTS 使用四向移动面向：相反进入、相同退出；倒走中每30秒触发炫耀，退出时重置计时。上下方向、停走与计时推进的完整客户端条件尚未核实。这些状态与定时业务归圆仔内容，不由 Facing 二元状态或通用 Locomotion 自动生成。

本次只定位了通用 `FaceToDirectionViaMoreTargets` 节点，尚未确认圆仔的实际 Prefab 绑定和特殊改向的控制准入。不能据此断言普通 turn 或 FORCED 在所有控制情形下等价于原生，也不应为避免移动覆盖而未经核实地绕过全部转向 Rule。当前结论是已有公共能力可表达核心面向与方向减伤需求，圆仔的完整内容和精确时序尚未接入、未验证。
