# Locomotion：运动积分、空间约束与状态交互

研究日期：2026-10-19。范围是当前安装客户端普通 Enemy 的原生移动路径；不重新研究 SPFA、平滑或 Route 指令。不修改 Stronghold 的实现、测试或 Capability 接口，也不纳入生息演算、船运等模式的运动机制。

**结论：现有转向公式在限定条件下与原生同构，但当前 Locomotion 还不能当作原生运动语义的完整实现。** 已确认的主要差异是预测吸附的对象与速度保存、独立的局部避障、目的格反射与整段通行检查的区别，以及运动状态和实际位移的区别。

本文使用 **N：原生直接证实**、**I：限定调用链推断**、**U：尚未确认**。没有启动游戏、核实运行现场 XLua／热更委托或进行端到端轨迹比对。未发现某调用，不等于证明所有子类、物理层或内容回调都不可能执行它。

## 1. 输入与证据

DLL／metadata 指纹与 Case 12 一致：

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| GameAssembly.dll | 218523112 bytes | `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5` |
| global-metadata.dat，IL2CPP v29 | 45805368 bytes | `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f` |

路径、方法索引、参数、VA、读取范围、字段布局与摘录校验值分列于：

- [运动积分与到达](../evidence/locomotion-native-20261019/motion/metadata.json)、[辅助方法与配置](../evidence/locomotion-native-20261019/motion/support-metadata.json)、[预测目标与向量限幅](../evidence/locomotion-native-20261019/motion/arrival-support-metadata.json)。
- [空间约束与地形](../evidence/locomotion-native-20261019/space/metadata.json)。
- [移动资格、属性与时序](../evidence/locomotion-native-20261019/states/metadata.json)。
- [单位分离与强制位移](../evidence/locomotion-native-20261019/interactions/metadata.json)。

地址为 VA，image base 是 `0x180000000`。反汇编按方法入口至下一已知方法读取，尾部可能包含跳转表或对齐字节；判断以实际可达分支为准。原生共享空函数在工具注释中可能同时列出多个别名，不据此推导无关业务调用。当前 metadata 的枚举默认值采用压缩有符号编码，不能把相邻四个字节直接当作枚举整数；修正后的值及原始字节保存在证据中。

## 2. 普通单单位的运动链

**N：** `Enemy._MoveByCursor`（76491，`0x180a78fc0`）存在三个不同的定位分支，而非所有情况都调用同一个积分器：

```typescript
if (isActuallyGroundBound) {
    isHanging = true;
    return zero;
}

if (!map.checkGridValid(currentGrid)) {
    const direction = map.getDirectionToGoBackFromInvalidPos(currentGrid);
    setPosition(position + direction * moveSpeed * dt);
} else if (cursor.predictReached(moveSpeed * dt, out direction, out bodyTarget)) {
    setPosition(bodyTarget);
} else {
    const direction = cursor.getNextDirection();
    let delta = moveController.calculateMoveDelta(direction, dt, out isHanging);

    if (grid(position + delta) !== currentGrid && !map.checkPassable(mode, grid(position + delta))) {
        const normal = normalize(center(grid(position + delta)) - position);
        delta -= 2 * dot(delta, normal) * normal;
    }

    setPosition(position + delta);
}
```

这是对已核实普通分支的简化，不是完整原生函数。调用位置分别为：当前越界检查 `0x180a790a1..d3`，预测到达 `0x180a790d9..9129`，积分 `0x180a79188..91a2`，目的格检查与反射 `0x180a791db..93ac`，直接到达 `0x180a79405..942c`，越界恢复 `0x180a794a6..952d`。[完整移动方法](../evidence/locomotion-native-20261019/motion/76491-_MoveByCursor.asm)

## 3. 运动积分与转向公式

**N：** `MoveController.CalculateMoveDelta`（71056，`0x1808b6140`）保存 `m_lastVelocity`，单位是每秒速度。正常资格下的结构为：

\[
 d=\operatorname{normalize}(direction)
\]
\[
 a=\operatorname{clampMagnitude}\big(F_{local}+(s d-v_{previous})k,\ F_{max}\big)
\]
\[
 v'=\operatorname{clampMagnitude}(v_{previous}+a\Delta t,\ s)
\]
\[
 \Delta p=v'\Delta t
\]

其中 `F_local` 由 `CalculateIsHanging` 及其子类产生，包含局部避障／可选分离分量；不是只计算朝向目标的转向力。归一化发生在 CalculateMoveDelta／CalculateTotalForce；局部力与转向误差相加后统一限幅，随后积分速度、限速，再计算位移。

直接证据：

- [71056](../evidence/locomotion-native-20261019/motion/71056-CalculateMoveDelta.asm) 在 `0x1808b640d..6422` 执行 `v + a*dt`，`0x1808b645b` 限速，`0x1808b6471..6476` 写回速度，再于 `0x1808b647b..6480` 乘 dt。
- [71058 `_CalculateSteeringForce`](../evidence/locomotion-native-20261019/motion/71058-_CalculateSteeringForce.asm) 在 `0x1808b72e8..732c` 计算方向乘速度、减旧速度、乘转向系数、加局部力，再限制模长。
- 调用目标 `0x1805e7770` 的[原始指令](../evidence/locomotion-native-20261019/motion/raw-1805e7770-vector-clamp.asm) 直接实现 `|v|<=max ? v : v/|v|*max`；该共享入口没有在直接 metadata 方法指针表中解析出唯一名称，不用猜测方法名代替其实际指令。

### 配置开关确实影响公式参数

`BattleOptions.STEERING_ENABLED` 为 false 时，`k=100`、`F_max=100`；为 true 时，`k=m_steeringFactor`、`F_max=_maxSteeringForce`。100 来自 `0x186e3fdc4` 的 float32 常量。`Reset(target)` 将 Prefab `_steeringFactor` 复制到运行态 `m_steeringFactor`，之后存在公开 setter，因此静态参数与当前系数不是同一个事实。

[BattleOptions 静态构造](../evidence/locomotion-native-20261019/motion/62950-Torappu_Battle_BattleOptions-_cctor.asm) 默认将该开关置 false，但不能据此说实际关卡不用 Prefab 参数：[`BattleOptions.LoadOptions`](../evidence/locomotion-native-20261019/space/62946.asm)（62946，`0x1805da010`）会读取关卡 `steeringEnabled` 并覆盖它，同时加载 `moveMultiplier`。[关卡加载入口](../evidence/locomotion-native-20261019/space/64811.asm)在模式／符文预处理后调用它，字段和常量定位见[空间证据清单](../evidence/locomotion-native-20261019/space/metadata.json)。

当前项目的 `movement-fragment.ts` 与 `movement-scenario.ts` 明确拒绝 `steeringEnabled=false` 的关卡。对于这些已接受输入、且 `F_local=0` 的情况，当前 `steering.ts` 与上述公式同构：项目保存每 Tick 位移量，所以 Prefab 中 `k` 除以 tickRate、`F_max` 除以 tickRate²，不能仅因写法没有显式 dt 就认定转换错误。

## 4. 吸附、停止与恢复

### 吸附的是预测目标，不是任意导航追踪点

**N：** `DirectionCursor.PredictReached`（70273）调用 `_GetNextTarget`（70275），取得预测目标，转换 locator／body 坐标，再比较：

\[
 (s\Delta t)^2 \geq \lVert targetLocator-currentLocator\rVert^2
\]

成功时 `_MoveByCursor` 直接写入预测的 bodyTarget，跳过 MoveController 转向、避障及普通目的格反射分支。失败时才取得导航方向并积分。`_GetNextTarget` 是 Cursor 的预测查询，不等于 GetNextDirection 正在跟随的每个平滑中间节点；其既有 Route 规则不在本轮重做。

因此只能确认“存在预算足够时的直接吸附”，不能直接为当前 `step.ts` 的“到任何 nextPoint 的距离 <= speed 就吸附”背书。[预测比较](../evidence/locomotion-native-20261019/motion/70273-PredictReached.asm)、[预测目标来源](../evidence/locomotion-native-20261019/motion/70275-_GetNextTarget.asm)。

### 停止位移不等于清除旧速度

**N：** 以下路径具有不同状态效果：

| 路径 | 本次位移 | `m_lastVelocity` |
| --- | --- | --- |
| 正常调用积分器 | 根据合力积分 | 写回限速后的速度 |
| 速度近零或 target.canMove=false | 返回零，isHanging=true | 提前返回分支没有覆盖旧速度 |
| PredictReached 成功 | 直接设置预测目标 | 不经过积分器，没有将速度改为本次吸附位移 |
| 普通 Move／Attack／Combat／Stun／Freeze 等已检查状态切换 | 取决于状态是否调用移动 | 已检查的进入／退出方法没有直接清零 MoveController 速度 |
| 显式 `MoveController.Reset(target)` | 初始化操作 | 清零旧速度、避障／分离缓存并重置 ticker |

证据为 [71056 的 `0x1808b64ad` 提前返回](../evidence/locomotion-native-20261019/motion/71056-CalculateMoveDelta.asm)、[71054 Reset](../evidence/locomotion-native-20261019/motion/71054-Reset.asm) 与[状态方法清单](../evidence/locomotion-native-20261019/states/metadata.json)。不排除特殊内容或热更显式调用 Reset／setter。

**I：** 运动入口暂停、零方向仍调用积分器、预测吸附是三种不同情形。不能将它们都翻译成 `target=null → velocity=0`。零方向但仍进行积分时，还可能产生由旧速度决定的减速位移；是否进入该路径由调用者和 Cursor 决定。

## 5. 空间约束：局部避障与目的格修正

### 目的格反射

**N：** 普通非吸附分支只在候选位置跨入另一格时调用 `Map.CheckPassable(mode, destinationGrid)`。此调用不接收起点或方向，也没有整条线段／身体轮廓扫描。目的格不可通时，围绕“当前位置指向目的格中心”的法向量反射这次 delta，随后提交一次位置；已核实分支没有再次检查反射后的目标格。

这既不是 `canTraverse()` 整段否决，也不是贴墙截断、按墙面滑动或格中心回退。不能从这段局部调用推出物理层和所有特殊位移都不做碰撞。[76491](../evidence/locomotion-native-20261019/space/76491.asm)、[70011 CheckPassable](../evidence/locomotion-native-20261019/space/70011.asm)。

### 避障具有自己的输入、历史与采样频率

**N：** 基础 MoveController 使用 `m_footOffset`、`_halfBodyWidth`、`m_lastObstacleAvoidForce` 和 `m_obstacleAvoidTicker`。OnStart 采样 `footMapPosition-mapPosition`。避障围绕 `GridPosition(target.offsetMapPosition)` 检查八个邻格；Enemy 存在 DirectionCursor 时，此定位点来自 locator，可能不同于硬通行检查使用的身体格。计算还使用身体位置加缓存 footOffset 得到的脚点及水平半身宽度，结合 0.25 阈值累积远离障碍的向量；这不是圆形碰撞体的 swept test。

`CalculateIsHanging` 每次调用推进 ticker；初始即可重算，之后每三次调用重算一次。没有调用此方法时，不独立消耗“过去了几帧”。重算后缓存：

\[
 F_{cached}=F_{avoid}-(F_{avoid}\cdot d)d
\]

每次调用继续使用：

\[
 F_{local} \mathrel{+}= F_{cached}\max\big(0.5,\lVert v_{previous}\rVert/s\big)
\]

若当前格在地图内却不可通，避障另有选择最近相邻可通格的分支；这与“当前位置超出地图矩形”不同。[71059](../evidence/locomotion-native-20261019/space/71059.asm)、[71060](../evidence/locomotion-native-20261019/space/71060.asm)、[周期与常量](../evidence/locomotion-native-20261019/space/metadata.json)。

**I：** 避障缓存、ticker、旧速度均会影响后续轨迹，属于单位的运动运行事实，不能放进语义不可观测的 Navigation WeakMap 缓存。每 Tick 重新计算避障也不是已经证明等价的实现替换。

### WALK、FLY 与动态障碍

**N：** 两种移动方式共用上述普通运动结构，但读取各自的通行矩阵。FLY 不等于无条件穿越所有不可通地形：它仍受自己的硬不可通掩码限制。`CheckObstacleLikeOrUnpassable` 对硬不可通均返回 true；可通行时只有 WALK 继续检查 Tile.isObstacleLike，默认门槛为 moveCost>=1000。因此高成本可通格可以参与 WALK 避障，而不必成为硬不可通格。

已核实的 `Tile.RewriteOptions → Map.UpdatePassableMap` 路径会刷新当前通行矩阵；实际运动读到的是运行中的矩阵，不只是最初地图。不能由此推断所有 Tile 属性写入都刷新矩阵。方向出口属于另外的通行规则：上述普通目的格检查没有再次检查有向出口，不能把当前项目的逐边 canTraverse 写成已证实的原生行为。[70013](../evidence/locomotion-native-20261019/space/70013.asm)、[70014](../evidence/locomotion-native-20261019/space/70014.asm)、[70739](../evidence/locomotion-native-20261019/space/70739.asm)。

## 6. 移动资格与战斗状态

**N：** `Entity.canMove` 的普通原生分支要求没有眩晕、UNMOVABLE、UNMOVABLE_PRIVATE、冻结和 Levitate；`_MoveByCursor` 还单独拒绝 isActuallyGroundBound。速度属性下限不是这些资格的替代品。

GROUND_BOUND 与 UNMOVABLE 是不同标志；isActuallyGroundBound 还会结合 Levitate 及两者的登记先后判断，不能把这两种限制合并成同一个布尔条件。

普通 MoveState 先处理对话、Levitate、眩晕、冻结、Palsy 等状态，再检查阻挡／战斗目标、攻击目标等，最后选择普通路线、恐惧或吸引移动。进入 Attack／Combat 状态后，相应普通 OnTick 进行攻击／Ability 处理，没有调用同一普通路线移动入口。不能把“所有 Skill 激活”写成基础运动系统统一禁移：具体 Skill 可造成状态切换或设置 UNMOVABLE_PRIVATE，单有技能实例并不等于上述条件已成立。

状态优先级和动作资格的证据见 [66413 canMove](../evidence/locomotion-native-20261019/states/66413-Entity-get_canMove.asm)、[76658 MoveState](../evidence/locomotion-native-20261019/states/76658-Enemy-States-MoveState-OnTick.asm) 与 [状态证据清单](../evidence/locomotion-native-20261019/states/metadata.json)。

**U：** 这不是全部特殊状态、技能、Boss 子类和时间停止的通用判定表；每种内容是否设置相应 flag 仍需沿其实际安装机制核对。

## 7. 单位间分离与强制位移

### 单位分离是可选控制器行为

**N：** 基础 MoveController 的 CalculateIsHanging 计算地形避障；`SeparateMoveController` 覆盖该方法并增加 `_CalculateSeparationForce`（72516）。后者读取邻近敌人，过滤自身及不符合 isMovingBySelf 等条件的对象；它不是按邻居刚体速度或重量做普通碰撞求解。

分离计算对每轴距离使用配置半径，累计经 L1 距离下限修正的邻居 delta，归一化后取反并乘力系数；有自己的三次调用 ticker 和缓存。每次使用缓存时乘以 `|v_previous|/s`，没有基础避障的 0.5 最小系数。构造默认值为半径 0.5、力系数 1000、距离分母下限 0.05，具体 Prefab 可以覆盖。实际 Prefab 样例 `enemy_5046_dqmir` 使用该脚本，且安装关卡 `activities/act5fun/level_act5fun_01.json` 有引用；不能仅凭子类存在就宣称所有普通敌人都相互排斥。[方法、资产及引用证据](../evidence/locomotion-native-20261019/interactions/metadata.json)。

**U：** 基础控制器没有单位分离调用，不单独证明所有普通敌人的 Unity 碰撞体都允许重叠；碰撞层、触发器与特殊 Prefab 的全部组合未在本轮穷尽。

### 推拉与直接传送不是路线转向力

**N：** KnockBack 使用 Rigidbody2D.AddForce 的 Impulse 模式；BeginPull／StillPull 使用 Force 模式，并与 Unbalance 状态配合。Unbalance 管理阻挡释放和非触发碰撞体；退出时 `_ResetPhysicsStatus` 清除刚体速度、休眠，并按配置关闭相应碰撞体。

这些已检查普通原生路径没有覆盖 MoveController.m_lastVelocity。普通 MoveState 进入／退出也不直接 Reset；因此应区分路线控制器速度与物理刚体速度。`ForceSetPositionByWorldCoords` 直接改变位置并处理阻挡／朝向，不在所查原生分支中重置两类速度。不能把所有推拉、强制传送和正常导航位移接到一套相同的通行否决协议上。[强制位移证据](../evidence/locomotion-native-20261019/interactions/metadata.json)。

**I：** 已核实普通推拉结束后，恢复路线运动可能继续使用之前的路线速度历史；这不等于刚体的推拉速度被带进路线积分。特殊内容、子类或 Lua 回调可以另行改变这些值。

## 8. Tick 顺序、移速与 moving

### 单敌人内部顺序

**N：** 现有普通调用链是：

```text
Enemy.OnTick
    → Unit／Entity.OnTick → StateMachine.Tick
        → 当前状态判断资格并可能执行实际运动／攻击
    → Enemy 的相关阻挡管理
    → Main Cursor.OnTick
    → 独立主终点完成检查
    → 恐惧／吸引控制器更新
    → MoveController.OnTick（额外处理传送带）
    → 其他记录／累计实际移动距离
```

MoveController.OnTick 不是普通路线速度积分的第二次入口；普通积分已经在状态机调用链内执行。该方法包含传送带移动，说明自主移动暂停不自动等于禁止所有外部运动。这里不要求 Stronghold 复刻函数调用位置，但不得重复消费运动预算或混淆资格。[76531](../evidence/locomotion-native-20261019/states/76531-Enemy-OnTick.asm)、[71063](../evidence/locomotion-native-20261019/states/71063-MoveController-OnTick.asm)。

**U：** 未穷尽全场不同 Unit 的调度、阻挡刷新与 Unity 物理步进的所有相对顺序；不能从单敌人方法推出全部同 Tick 交互偏序。

### 移速公式与 0.1 下限

**N：** MOVE_SPEED 属性编号为 6。`AttributesData.moveSpeed` 的 AttributeMeta 声明默认 min=0.1；Attributes.Reset 建立范围，最终属性修正计算后再次按默认范围或当前 override 范围 clamp。`Entity.moveSpeed` 再乘 `BattleOptions.MOVE_MULTIPLIER`。

因此：

\[
 s=\operatorname{clamp}(\operatorname{attributeFormula}(base,modifiers),currentRange)\times moveMultiplier
\]

0.1 是普通属性范围的下限，不是经过全局倍率后的最低速度，也不是每 Tick 最少位移。覆盖属性范围、canMove、GroundBound 和状态机资格是另外的机制。冻结可同时影响属性与状态，但不应因此把移动禁止等同于把速度减到零。[属性元数据、原始字节与范围计算](../evidence/locomotion-native-20261019/states/metadata.json)。

当前项目 `enemy.ts` 的默认 minimumMoveSpeedPerTick=0.1/tickRate 有普通属性依据；当前 `movement-fragment.ts`／`movement-scenario.ts` 也把关卡 moveMultiplier 传入 Battle，因此这里没有确认全局倍率遗漏。仍需在未来属性模型中决定怎样表达原生已存在的范围 override；本轮不修改接口。

### moving 不是唯一事实

**N：** 原生至少区分：

- MoveController 保存的转向积分速度。
- Rigidbody2D 的物理速度。
- `Enemy.isMovingBySelf`：未消失、当前状态为 Move 且 Blackboard.isHanging=false。
- `isHanging`：普通 CalculateMoveDelta 根据方向与局部力是否为零等输入建立的控制结果；并非直接比较两个实际位置。
- Enemy 累计的实际 mapPosition 变化距离。

`Action.IfEnemyIsMoving`（99311）读取刚体速度并检查模长>0.1；`IfEnemyIsMovingBySelf`（99314）读取上述状态查询，说明区分具有实际内容消费者。不能将所有“移动时”效果都默认接到当前项目 `moving = positionChanged` 上。[查询与消费者](../evidence/locomotion-native-20261019/states/metadata.json)。

## 9. 与当前实现的对照

| 当前位置 | 本轮判断 | 可观测影响 |
| --- | --- | --- |
| `locomotion/steering.ts` | 对已支持的 steeringEnabled=true、零局部力场景，数学结构与原生同构；按 Tick 的参数转换有依据 | 不应为了重构而推翻正确的基础积分。 |
| `locomotion/step.ts` 的 distance<=speed | 原生确有吸附，但对象来自 Cursor.PredictReached，不是每个 nextPoint | 中间转向节点可能被过早吸附，绕过转向。 |
| 吸附时将 lastVelocity 设为本次 direction | 所查原生吸附分支不更新控制器速度 | 后续转向／恢复运动的历史不同。 |
| target=null 时清零速度 | 不能对应所有原生暂停／零方向情况 | 停走恢复、等待后的惯性可能不同。 |
| 当前完整线段与 locator/body 双重检查 | 项目政策；原生普通分支是目的格判断／反射，另有局部避障 | 可能提前停滞，也可能与原生高速轨迹不同。 |
| `motion.ts` 的反射工具 | 与已核实目的格反射存在相应数学，但尚未成为当前主路径 | 不能仅凭“工具已有”认定功能已接入。 |
| 未保存避障力与 ticker | 缺少已确认的普通控制器运行事实 | 贴墙、转角、移动方式及动态障碍附近会有轨迹差异。 |
| Route 的地图外修正目标 | 当前将坐标夹向共同合法范围；原生按越界方向直接步进 | 越界／偏移后的恢复轨迹不同，应单独决定简化政策。 |
| `minimumMoveSpeedPerTick` | 普通 0.1 属性下限有依据；全局倍率与禁止资格需继续分开 | 不能把“存在下限”解释为禁移仍产生位移。 |
| `State.moving` | 当前表示实际位移，不能替代所有原生内容查询 | 移动条件、动画展示与物理移动响应可能需要不同事实。 |

## 10. 可以据此进入设计，但本轮不定类型

优先级最高的四项已有直接证据：积分与参数开关、预测吸附和速度保留、普通空间修正、移动资格与状态关系。接下来的设计应先明确三种责任：本次自主运动的资格和方向、运动积分与局部力历史、实际位移／外部物理运动的约束。

这些事实不要求照抄 MoveController 或 Unity 类型，也不要求把每个原生字段都做成通用开关。需要保留的只是会改变轨迹、停走恢复和内容条件的差异。具体 State、Definition、Battlefield 依赖及 Hook／Rule 接口，留到下一轮依据这些证据收口；不得把当前 Stronghold 的分层或 segment.ts 当成原生正确性的依据。

未完成的现场范围包括：运行时热更覆盖；全部特殊敌人／内容的碰撞配置；全场物理与单位更新的完整顺序；以及与客户端端到端轨迹的定量对比。本轮静态调查没有解决这些问题，也不据此阻塞普通机制的后续设计。
