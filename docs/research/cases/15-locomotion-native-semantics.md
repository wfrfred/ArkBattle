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

上述是原生时间单位下的积分公式；项目按 Tick 的参数换算与实现见 [Locomotion](../../architecture/navigation.md#locomotion)，不能只由是否显式出现 dt 判断数学是否相同。

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

2026-11-10 补核：当前客户端的 `MoveController.OnStart`（72232）仍采样脚点偏移，`CalculateIsHanging`（72236，`0x18090f280`）仍先推进 `PeriodicTicker`，仅到期时读取 `Enemy.offsetMapPosition`、重算及缓存局部力，再调用 `Next`；构造器（72247）将周期设为 3。`Enemy.get_offsetMapPosition`（77675）有 Cursor 时调用 `GetLocatorPosition`，否则取身体位置。[当前指纹与方法原文](../evidence/unit-audit-20261110/coordinates-numeric/native.json)。

**项目选择：** ArkBattle 已明确采用每次实际积分重新计算局部避障力，省略原生三次调用的更新周期与缓存。这是已确定的简化，不是原生等价声明，也不属于待决事项，见 [Locomotion](../../architecture/navigation.md#locomotion)。当前使用身体位置、未引入 locator 与脚点安装偏移，是另一项输入基准差异，应与刷新周期的决定分开核对。

### 世界坐标转地块的半整数规则

**N：** 当前 `GridPosition.FromVectorPosition`（28641，`0x18214cb40`）分别将 y、x 送入 `0x18052eb60`，返回 row、col。该辅助程序分离整数与小数部分，在小数等于 `+0.5` 或 `-0.5` 时检查整数低位，选择偶数；因此正负半整数都采用 ties-to-even。`UnityEngine.Mathf.RoundToInt`（288330）经 `0x180007310` 使用相同奇偶判断。`0.5`、`-0.5`、`1.0` 的实际字节与两辅助程序原文见[本批证据](../evidence/unit-audit-20261110/coordinates-numeric/native.json)。这支持项目的 World→Tile 取偶；没有执行游戏或据此宣称验证非有限坐标、全部浮点精度路径。

### WALK、FLY 与动态障碍

**N：** 两种移动方式共用上述普通运动结构，但读取各自的通行矩阵。FLY 不等于无条件穿越所有不可通地形：它仍受自己的硬不可通掩码限制。`CheckObstacleLikeOrUnpassable` 对硬不可通均返回 true；可通行时只有 WALK 继续检查 Tile.isObstacleLike，默认门槛为 moveCost>=1000。因此高成本可通格可以参与 WALK 避障，而不必成为硬不可通格。

已核实的 `Tile.RewriteOptions → Map.UpdatePassableMap` 路径会刷新当前通行矩阵；实际运动读到的是运行中的矩阵，不只是最初地图。不能由此推断所有 Tile 属性写入都刷新矩阵。方向出口属于另外的通行规则：上述普通目的格检查没有再次检查有向出口，不能把当前项目的逐边 canTraverse 写成已证实的原生行为。[70013](../evidence/locomotion-native-20261019/space/70013.asm)、[70014](../evidence/locomotion-native-20261019/space/70014.asm)、[70739](../evidence/locomotion-native-20261019/space/70739.asm)。

## 6. 移动资格与战斗状态

**N：** `Entity.canMove` 的普通原生分支要求没有眩晕、UNMOVABLE、UNMOVABLE_PRIVATE、冻结和 Levitate；`_MoveByCursor` 还单独拒绝 isActuallyGroundBound。速度属性下限不是这些资格的替代品。

GROUND_BOUND 与 UNMOVABLE 是不同标志；isActuallyGroundBound 还会结合 Levitate 及两者的登记先后判断，不能把这两种限制合并成同一个布尔条件。

普通 MoveState 先处理对话、Levitate、眩晕、冻结、Palsy 等状态，再检查阻挡／战斗目标、攻击目标等，最后选择普通路线、恐惧或吸引移动。进入 Attack／Combat 状态后，相应普通 OnTick 进行攻击／Ability 处理，没有调用同一普通路线移动入口。不能把“所有 Skill 激活”写成基础运动系统统一禁移：具体 Skill 可造成状态切换或设置 UNMOVABLE_PRIVATE，单有技能实例并不等于上述条件已成立。

状态优先级和动作资格的证据见 [66413 canMove](../evidence/locomotion-native-20261019/states/66413-Entity-get_canMove.asm)、[76658 MoveState](../evidence/locomotion-native-20261019/states/76658-Enemy-States-MoveState-OnTick.asm) 与 [状态证据清单](../evidence/locomotion-native-20261019/states/metadata.json)。

**U：** 这不是全部特殊状态、技能、Boss 子类和时间停止的通用判定表；每种内容是否设置相应 flag 仍需沿其实际安装机制核对。

### 2026-11-05 补核：自身空地身份切换与主动脱离

本次只回答自身空地身份变化的阻挡清理由谁负责，不重做运动状态、异常叠加或寻路调查。先查 [PRTS 行动方式](https://prts.wiki/w/行动方式)和[异常效果](https://prts.wiki/w/异常效果)：社区资料区分当前身份、寻路方式与浮空控制，但没有说明普通切换入口的清理责任，因而补查官方客户端普通 native 分支。新客户端 DLL／metadata 与本篇原批次不同，按方法名重新定位，指纹、完整分段和复跑命令见 [layer-transition-20261105](../evidence/layer-transition-20261105/README.md)。

**N：** 新版 `Enemy.ChangeMotionMode`（77856）先调用 `Entity.ChangeMotionMode`，随后尾跳 `Enemy.ReleaseBlock`；`Enemy.ResetMotionMode`（77857）同样先执行基类重置，再调用 `ReleaseBlock`。两个外层普通分支都没有新旧身份比较，也不根据基类是否实际改值决定是否脱离。因此，主动脱离并非只有浮空状态自行提供，也不是等下一次阻挡检查或只解除已经不兼容的关系。

**N：** 基类 `ChangeMotionMode`（67597）进入 raw Setter（67372）；Setter 写入原始可变身份，只在新旧值不同时调用 virtual slot 128 的 `OnMotionModeChanged`。基类回调（67704）通知 Buff 容器；Enemy 覆盖（77755）继续通知当前地块。已展开的普通主体没有直接调用 `ReleaseBlock`，完整脱离发生在上述 Enemy 业务入口。基类 `ResetMotionMode`（67598）读取 `pathMotionMode` 再写入可变身份，没有反过来修改寻路配置；这是重置操作的特定语义，不表示空地身份与寻路必须始终相同。

**N：** 同版 `ReleaseBlock` 先调用 `ReleaseFromBlocker`，具有阻挡他人能力时再调用 `ClearAllBlockees`。`ReleaseFromBlocker`（77805）解除现有入向关系后，以 `Kill(false)` 取消当前 `m_blockTween`；即使没有有效 owner，也会处理仍存在的阻挡插值。字段类型与 Kill 派发已在同版 metadata／指令中核对。浮空状态的 `OnEnter` 也独立调用 `ReleaseBlock`，说明特殊控制与普通显式切换都可发起完整脱离；不能以此把任何视觉升高都解释为自身身份切换。蒂比的区别仍见[案例 21](21-tippi-air-blocking.md)。

**项目关联：** 这些证据用于确定 Layer 修改入口与主动脱离的责任，不自行决定 Change 的批次语义或 API。原生上述业务入口在同值调用时也会脱离；项目若保留同值 no-op，属于明确的工程取舍。未核实运行时 XLua、全部特殊子类及具体内容重写，不由这组普通入口推断异常竞争或全部导航后继。

## 7. 单位间分离与强制位移

### 单位分离是可选控制器行为

**N：** 基础 MoveController 的 CalculateIsHanging 计算地形避障；`SeparateMoveController` 覆盖该方法并增加 `_CalculateSeparationForce`（72516）。后者读取邻近敌人，过滤自身及不符合 isMovingBySelf 等条件的对象；它不是按邻居刚体速度或重量做普通碰撞求解。

分离计算对每轴距离使用配置半径，累计经 L1 距离下限修正的邻居 delta，归一化后取反并乘力系数；有自己的三次调用 ticker 和缓存。每次使用缓存时乘以 `|v_previous|/s`，没有基础避障的 0.5 最小系数。构造默认值为半径 0.5、力系数 1000、距离分母下限 0.05，具体 Prefab 可以覆盖。实际 Prefab 样例 `enemy_5046_dqmir` 使用该脚本，且安装关卡 `activities/act5fun/level_act5fun_01.json` 有引用；不能仅凭子类存在就宣称所有普通敌人都相互排斥。[方法、资产及引用证据](../evidence/locomotion-native-20261019/interactions/metadata.json)。

**U：** 基础控制器没有单位分离调用，不单独证明所有普通敌人的 Unity 碰撞体都允许重叠；碰撞层、触发器与特殊 Prefab 的全部组合未在本轮穷尽。

### 推拉与直接传送不是路线转向力

**N：** KnockBack 使用 Rigidbody2D.AddForce 的 Impulse 模式；BeginPull／StillPull 使用 Force 模式，并与 Unbalance 状态配合。Unbalance 管理阻挡释放和非触发碰撞体；退出时 `_ResetPhysicsStatus` 清除刚体速度、休眠，并按配置关闭相应碰撞体。

这些已检查普通原生路径没有覆盖 MoveController.m_lastVelocity。普通 MoveState 进入／退出也不直接 Reset；因此应区分路线控制器速度与物理刚体速度。`ForceSetPositionByWorldCoords` 直接改变位置并处理阻挡／朝向，不在所查原生分支中重置两类速度。不能把所有推拉、强制传送和正常导航位移接到一套相同的通行否决协议上。[强制位移证据](../evidence/locomotion-native-20261019/interactions/metadata.json)。

**I：** 已核实普通推拉结束后，恢复路线运动可能继续使用之前的路线速度历史；这不等于刚体的推拉速度被带进路线积分。特殊内容、子类或 Lua 回调可以另行改变这些值。

### 2026-11-18 补核：推拉、失衡和地形

本次把阿消一、二技能和暗索一、二技能作为普通推拉样例，另用 2-8、TR-14 和 CH-5 核对地形。当前客户端指纹、配置和方法分段见[本次证据批次](../evidence/forced-motion-20261118/README.md)。[PRTS「推力与拉力」](https://prts.wiki/w/作战机制#推力与拉力)和[失衡位移机制](https://prts.wiki/w/失衡位移机制)用于对照。

**N｜推击。** 阿消两技能各自发射对应弹道，弹道命中安装 Buff，Buff 事件执行 `Knockback`。节点当场读取施力者的基础力度、当前朝向、双方位置和目标的有效重量等级。阿消配置下，目标位于施力者朝向的扇区内且距离大于 0.25 格时沿该朝向推；其他情况扣两档，按双方当前位置的连线向外推。查表值通过近零门槛后，在物理体上施加一次冲量，大小是 `表值 × MOVE_MULTIPLIER × 0.02`。普通默认倍率 0.5，关卡可提供自己的移动倍率。近零的方向向量会被安全归一化成零，目标仍可能进入失衡。[阿消配置与命中链](../evidence/forced-motion-20261118/README.md#推击)。

**N｜牵引。** 暗索的 Harpoon 用弹道力度和来源基础力度之和减去目标有效重量，查得本次最大拉力；后续读取目标当前位置，朝拉点施加衰减后的力。持续时间用弹道力度单独减目标重量，差值不大于 −2 时取 0.5 秒，否则用弹道配置时长，暗索样例为 1 秒。源或目标失效、达到配置的近停条件等可以结束拉拽。本地停止链先通知目标 `EndPull`，再允许施力者立即搜索阻挡目标。共享衰减公式和近停分支见下方补核。[牵引公式和当前方法](../evidence/forced-motion-20261118/README.md#牵引与力值)、[暗索弹道的来源资格](18-projectile-source-and-target-lifecycles.md#5-实际存在可选的来源生命周期依赖)、[阻挡时序](../evidence/blocking-timing-native-20261023/immediate/report.txt)。

**N｜朝来源的冲量。** 薄绿二技能的攻击安装 `mint_s_2[pull]`。其 `DragTowardSource` 将方向指向来源，查推表并通过同一个 `Enemy.KnockBack` 入口一次施加冲量。受力方向和一次／连续施力是独立选择。[薄绿配置与原生入口](../evidence/forced-motion-20261118/README.md#牵引与力值)。

**N｜力度和重量。** 两张表都以 `clamp(3 + 有效力度等级 − 有效重量等级, 0, 表长 − 1)` 取值，推力与拉力各自用表。查表读取当时的重量等级，物理减速另用刚体质量、摩擦倍率和时间步。力度等级、重量等级、质量和位移距离分别有不同的消费者。[力度表取证](../evidence/forced-motion-20261118/README.md#牵引与力值)、[质量与重量等级的 Prefab 对照](../03-space-units-and-mechanisms.md#6-阻挡受击体作用范围和物理-body)。

**N｜失衡。** 进入时释放现有阻挡关系并启用物理路径，失衡期间的属性标志会使常规阻挡资格拒绝该敌人。进入以及普通新推击／开始牵引刷新 0.1 秒保护。普通解除检查在摩擦降速后进行，要求速度不大于 0.1、保护已到期且没有有效拉力来源；浮空和获得失衡免疫还有独立的转换分支。退出清理物理速度和拉力集合，保留普通转向控制器的原有速度。自主路线积分可暂停，路线本身还有独立的时钟和检查。[失衡与阻挡资格](../evidence/forced-motion-20261118/README.md#失衡状态)。

**N｜地形与时序。** 三个样例的高台各有实际地块碰撞体，低地地穴走入格事件。磐蟹和普通弩手的实体碰撞层与高台层相碰，该敌人层内部关闭碰撞。2-8 的地穴对地面路线为 `FLY_ONLY`，场景的地穴对象没有用于挡推拉的实体碰撞体。手动物理步进路径先执行对象更新，再结算并提交物理位置。普通敌人的后继对象更新采样当时的格坐标，更新地块成员并触发地穴的入格事件；地穴可向满足条件的地面敌人发起坠落。高台接触也可通知 Buff。已经开始的钩索协程可以在物理提交后结束并发起局部阻挡搜索。[场景、碰撞层与地块事件](../evidence/forced-motion-20261118/README.md#地形和物理更新)。

**N｜拐角冰面。** `IceCornerTile` 在符合条件的失衡敌人入格时直接修整它的当前物理速度，并按分支追加独立的向心力。后续可通过事件继续影响运动，出格时清理相应订阅并恢复摩擦。钩索的持续力仍依据自身拉点计算。[冰面和物理速度接口](../evidence/forced-motion-20261118/README.md#地形和物理更新)。

**I｜对 Core 的约束。** 已有 `Locomotion` 的路线速度和通行反射只能覆盖自主移动。推拉需要表达独立的物理速度、瞬时冲量与可取消的持续受力、失衡和阻挡资格，以及地块读取并影响正在发生的位移。技能力度、方向修正规则、牵引参数和收尾条件由相应内容提供。规则已核对到可以讨论接口的程度，具体组件归属待项目决定。

**U｜轨迹精度。** 社区记录了同力度下弹道与直接特效推击可能差一个物理帧的结果。当前批次确定了物理和钩索的阶段以及地图样例，尚缺同条件下两种命中时序的端到端测量、墙角和多目标的精确接触轨迹，以及特殊 Prefab、运行时碰撞层覆盖与活跃热更验证。[PRTS 位移距离表](https://prts.wiki/w/作战机制#推力：推开)。

#### 移动距离伤害

**N：** `Enemy.OnTick` 每 5 个逻辑 Tick 取当前实际坐标，把它到上次采样点的距离加到累计值。该分支位于普通单位更新中，适用于自主运动和强制位移。`DamageByDistance` 读取同一累计值，用本次与 Buff 保存基线的差结算，并更新基线。

温蒂 S3 命中附加独立的 `rupture`，安装时保存基线，周期与结束时消费差值，伤害为真实伤害。歌蕾蒂娅与暗索的 X 模组也使用 `DamageByDistance`，伤害为法术，由来源的使敌人失衡和结束牵引事件分别附加及按键移除对应 Buff。结束事件关闭来源匹配。它们用 `CheckEnemyUnbalanced` 限定采样和结算，周期失效时结束 Buff。两种效果各自拥有伤害基线，同一敌人的移动累计值可供它们共同读取。[模板、配置和原生读写](../evidence/forced-motion-20261118/README.md#移动距离伤害)。

2026-11-19 补核弧光锋卫及锋卫长。常驻 `enemy_cbjedi_bleed` 周期检查当前失衡。检查通过且缺少 `cbjedi_blood` 时装上固定值真实伤害 Buff，检查失败时撤掉它。伤害模板直接使用 `NoSourceDamage`。在两个检查点之间退出并重新进入失衡时，下一次检查仍可保留已有伤害 Buff。这是模板的采样语义，实际同 Tick 轨迹尚未做实机观测。[弧光锋卫与伤害模板](../evidence/forced-motion-20261118/damage/arc-frontliner.json)。

### 2026-11-19 补核牵引公式与近停

**N｜共用公式。** 普通钩索 `HarpoonProjectile`、捕网 `NetCatcherProjectile`、`PullHitTargetBehaviour`、`VortexMultiHitBehaviour` 和 `PullCastTargets` 是当前客户端中直接调用牵引衰减函数的五条执行路径。逐条核对指令，五者都用同一张拉力表取初始力度，将其乘以衰减因子后向目标提交持续力。初始距离大于零时，衰减因子为 `min(1, 当前距离 / 初始距离)^4`。原生直接调用扫描只覆盖 E8／E9 调用与跳转。拐角冰面另以空来源提交向心力，薄绿 S2 向来源施加一次冲量，两条路径各自结算。[牵引调用点与分支](../evidence/forced-motion-20261118/pull/native-branches.json)、[冰面力入口](../evidence/forced-motion-20261118/collision/ice-corner-velocity.json)。

**N｜技能样例。** 暗索 S1／S2、崖心 S1／S2、雪雉 S1、歌蕾蒂娅 S1／S2 都绑定 `HarpoonProjectile`。歌蕾蒂娅 S2 通过 Buff 切换到角色模式 1，该模式的普攻发射钩索。七个钩索样例均启用阻挡范围判定，且近停时保留牵引。雪雉 S2 使用捕网。歌蕾蒂娅 S3 的三个攻击节点分别引用套索、带漩涡行为的弹道与收尾捕网。这两个捕网样例都在第一阶段近停时保留牵引，在第二阶段近停时结束该段。从 Prefab 读取的是序列化配置，单次运行仍可受技能黑板控制。[技能与弹道绑定](../evidence/forced-motion-20261118/pull/prefab-mappings.json)、[暗索配置](../evidence/projectile-lifecycle-20261021/source-binding/witness-projectile-configs.json)。

**N｜普通钩索的距离判定。** 每 Tick 评估两条路径，命中任一条就进入近停分支。[Harpoon 距离分支及阻挡范围实现](../evidence/forced-motion-20261118/pull/native-branches.json)。

- 目标距钩索保存的拉点不超过 0.05 格。`_pullToPosInBB` 启用时，该阈值为 `_pullSourceOffset + 0.05`。
- `_notInfluencedByBlock` 关闭，且施力者的收缩阻挡范围包含目标。普通 `Character.CheckInBlockRange` 比较双方平面距离的平方与阻挡范围平方阈值减去 0.05，边界取等号。平方阈值为 0.5 时，相当于约 0.6708 格。[PRTS 距离对照](https://prts.wiki/w/作战机制#拉力：拖拽)。

**N｜近停的三个结果。** 已进入近停分支时，`TryEarlyStopPull` 先清理无效来源，当前请求来源恰好是唯一有效来源时才把目标的共享外力速度写零。普通钩索记住清速成功，之后不再重复清速。接着 `_stopAfterPulledBack` 决定结束钩索，或保留钩索并提交零力。这一选择独立于清速是否成功。钩索保留时，每 Tick 仍重算距离，目标离开近停范围可恢复普通衰减力。若钩索先在范围外结束，停止提交自身的力，剩余速度继续由失衡结算。[钩索与清速指令](../evidence/forced-motion-20261118/pull/native-branches.json)、[失衡物理](../evidence/forced-motion-20261118/README.md#失衡状态)。

**N｜变体。** 漩涡以弹道当前位置为中心，阈值为 0.05 格，命中该判定时尝试清速并提交零力。捕网检查保存的拉点半径 0.05 格，也可通过施力者的收缩阻挡范围触发。捕网按当前阶段的停止标志选择结束本段牵引或提交零力，结束本段后弹道可接续其他阶段。命中牵引和 Ability 牵引也使用两条距离判定，并在续帧入口单独检查剩余时间是否已到期。[五条入口的近停分支](../evidence/forced-motion-20261118/pull/native-branches.json)。

**N｜漩涡的单次牵引。** 对一个目标的同一次 `_DoPull` 中，漩涡首次登记成功后清除首帧标记。后续每次推进重新判定距离，近停时尝试清速，再对同一个弹道来源调用 `StillPull(0)`。续拉成功后挂起，下一次推进仍继续这一条牵引。到期时另走收尾路径，先尝试清速，再调用 `EndPull`。这条证据覆盖一次 `_DoPull` 内的多次清速，技能下一次命中另行判定。[开始、续帧和结束指令](../evidence/forced-motion-20261118/pull/native-branches.json)。

**N｜力度来源与推进资格。** 钩索、捕网、漩涡、命中牵引和 Ability 牵引都有取不到施力者时按基础力度 0 查表的分支。原生另检查弹道能否继续。Harpoon、Laser 与 Lasso 都继承 LinkProjectile 的来源失效停止策略，`Projectile.OnTick` 会检查来源 `ValidAndAlive`，普通钩索协程也独立检查。暗索钩索与歌蕾蒂娅 S3 漩涡属于这组来源绑定的样例。现有样例尚未证明施力者失效后仍能创建普通持续牵引。[来源的取值和校验](../evidence/forced-motion-20261118/pull/entry-and-end.json)、[技能和弹道](../evidence/forced-motion-20261118/pull/prefab-mappings.json)、[基础力度调用点](../evidence/forced-motion-20261118/base-force/consumers.json)。

**N｜首轮登记。** Harpoon 与 NetCatcher 算出的初始拉力为零时，在调用 `BeginPull` 前走停止。初始拉力大于零时，首轮也先评估近停，再决定是否登记。配置为到位结束时直接走钩索停止或捕网本段清理，跳过本次 `BeginPull`，因而本次牵引未新建失衡。配置为到位后保留时可以登记零力牵引。登记前的清速仍要求当前来源已是目标唯一有效牵引，因此一个此前没有登记的新来源不能先清掉目标的旧速度。[首轮停止、登记与清速指令](../evidence/forced-motion-20261118/pull/entry-and-end.json)。

**N｜续帧收尾。** 在已核实的手动物理和协程推进分支中，战斗先模拟并发布物理位置，续帧牵引用该位置重新判断到位。已挂接的钩索和捕网走弹道停止分支时，在相应资格满足的路径上先调用目标的 `EndPull`。目标移除来源后，符合条件时同步推进一次失衡状态检查，再通知 `OnEndPulling`。弹道收尾随后能让施力者即时搜索阻挡目标，仍受阻挡资格限制。弹道因其他原因在普通对象更新中停止，也能走自己的停止链。位移伤害另使用定期采样的累计距离，见本节上方。[物理提交与停止调用顺序](../evidence/forced-motion-20261118/pull/entry-and-end.json)、[阻挡搜索历史取证](../evidence/blocking-timing-native-20261023/immediate/report.txt)。

**I｜对 Core 的约束。** 已核实的持续牵引共用力值衰减。拉点、阻挡范围判定、零力、唯一来源清速和结束牵引各有独立条件。保留牵引而暂时输出零力，以及另一条牵引继续施力，都应能表达。

**U｜调查范围。** 本节使用同版 Windows x64 客户端的静态原生指令与所列技能 Prefab。尚未核实运行时热更、锏 S3 等其他特殊技能的资产绑定及近停后重新施力的实战逐帧轨迹。[输入版本与复查入口](../evidence/forced-motion-20261118/README.md#牵引公式与近停补核)。

### 2026-11-19 补核基础力度等级

**N｜属性归属。** `BASE_FORCE_LEVEL` 是 `Entity` 的通用 Attribute，编号为 24。`AttributesData.baseForceLevel` 是整数配置字段，默认 0。属性元数据的上下限沿用 FP 的可表示范围。Entity 初始化把属性配置交给 `Attributes.Reset`，底值、修正项和有效值缓存与其他 Attribute 一起保存。通用 Modifier 的添加和移除覆盖属性 24。业务 getter `Entity.get_baseForceLevel` 读取修正和限幅后的有效值，并取最近偶数整数。[属性定义、存储和求值指令](../evidence/forced-motion-20261118/base-force/attribute.json)、[通用属性求值](39-death-attribution-and-attribute-ranges.md#底值修正与有效值)。

**N｜初始配置。** 固定修订的角色表有 4,916 条阶段属性关键帧和 1,013 条信赖属性关键帧，两组 `baseForceLevel` 全为 0。该修订的敌人数据库有 2,483 条等级数据写有此字段，均为未定义且原字段值为 0。此统计覆盖这两张表的指定字段，关卡覆写与战中修正另行考察。[固定表版本、查询和计数](../evidence/forced-motion-20261118/base-force/data-tables.json)。

**N｜战中修正。** 温蒂 S2 的 `ActiveBuffAbility` 安装 `weedy_s_2`，该 Buff 切换水炮模式，并用技能黑板的 `base_force_level` 加算属性 24。技能 1–3 级为 −1，4 级至专精二为 0，专精三为 +1。2-8 的两个 `tile_bigforce` 分别位于高台和地面，关卡黑板都配置 +1。地块的 `BuffTile` 对同一属性提供加算，配置为离格清除。阿消两技能的 `force` 则由对应施力动作读取，作为该次执行的力度档位。[技能、关卡和 Modifier 引用](../evidence/forced-motion-20261118/base-force/content.json)。

**N｜玩法配置。** 安装包中「锈刃-神力」的两个收藏品条目 `rogue_2_relic_fight_80` 与 `rogue_1_relic_p40` 都绑定 `char_attribute_add` Rune，黑板 `base_force_level` 为 +2，职业筛选为特种。活动「推斥管控」的三档配置使用同一个 Rune 键，黑板值分别为 +1、+1、+2。[安装包数据和字段指针](../evidence/forced-motion-20261118/base-force/content.json)、[PRTS 收藏品对照](https://prts.wiki/w/锈刃-神力)。

**N｜候选 Rune 处理链。** `CAttributesAdd.DoPreprocessChar` 在角色预处理阶段把 `AttributesData` 传给 `Rune.ApplyChangesToAttributesAdd`。通用函数按属性读取黑板增量和旧字段值，应用加法及属性范围，再写回 `AttributesData`。目前确认了这条数据写入链，`char_attribute_add` 的注册映射仍待追溯。[处理链的调用及写入指令](../evidence/forced-motion-20261118/base-force/content.json)。

**N｜施力时的取值。** 当前二进制对 `Entity.get_baseForceLevel` 的直接调用扫描得到 11 处，经指令边界核对后，分为六个使用推力表的 Action Node 和五条持续牵引入口。常规推击在效果执行时读取来源的基础力度和目标的重量，合并技能力度及该技能的方向修正，再查推表。持续牵引入口开始时采样来源基础力度和目标重量，查拉力表并保存力值，后续以该值乘距离衰减。拉力表的这些调用发生在各施力入口，目标侧的 `BeginPull` 接收已算好的方向与力。[11 处读取、入参和调用指令](../evidence/forced-motion-20261118/base-force/consumers.json)。

**N｜牵引时长。** 普通钩索以弹道自身的力度等级减目标重量来选 0.5 秒或配置时长。捕网以对应等级差决定是否将当前阶段的时长减半，然后另行合并来源基础力度来算力。基础力度改变的是初始实际拉力，已核对的这两条时长分支各自读取弹道档位和重量。[时长和查表分支](../evidence/forced-motion-20261118/base-force/consumers.json)。

**U｜覆盖边界。** 上述调用点是安装版的静态直接调用。脚本热更、间接调用和其他配置修正来源仍需按具体内容复查。固定角色表另有四个 `base_force_level` 天赋黑板条目，已记录原值和指针，实际绑定尚待核实。[天赋黑板查询](../evidence/forced-motion-20261118/base-force/data-tables.json)、[取证版本和复查入口](../evidence/forced-motion-20261118/README.md#基础力度等级补核)。

### 2026-11-20 补核失衡摩擦的来源

**N｜有效倍率。** `Enemy.get_frictionFactor`（77716）读取当前单位倍率和地块附加量，返回 `max(0, 单位当前倍率 + 地块附加量)`。`UpdateFrictionFactor`（77723）覆盖单位侧当前倍率。`RestoreFrictionFactor`（77724）把同一字段写回 `1`，保留地块附加量。失衡积分另乘质量、重力、普通摩擦系数 `0.5` 和时间步。[字段读取与覆写](../evidence/friction-factor-20261120/native.json)、[失衡积分](../evidence/forced-motion-20261118/README.md#失衡状态)。

**N｜地块附加量。** `Tile.Init`（71840）从地块黑板读取 `friction_factor`，缺省为 `0`。`Enemy._UpdateCurrentTile`（77814）经 `Tile.get_additionalFriction`（71796）把当前地块的值写入敌人保存的地块附加量。足球地块通过切换模式写入这个值，该模式排除在项目支持范围之外。普通活动关 BI-TR-2 的 `IceCornerTile` 直接修改冻结单位的当前倍率，出格时恢复。[地块写入的排除样本](../evidence/friction-factor-20261120/terrain.json)、[原生读写](../evidence/friction-factor-20261120/native.json)、[BI-TR-2 关卡配置](../evidence/friction-factor-20261120/battle-scope.json)。

**N｜单位内容。** 《愚人号》普通关 SN-5 注册圣徒之手 `trap_060_bouncy` 和三种弹力球敌人模板。弹力球（`enemy_1236_bouncy`）的敌人黑板配置 `friction.friction_factor = 0.6`。Prefab 的摩擦天赋安装 `enemy_bouncy_friction`，模板通过 `UpdateFrictionFactor` 节点读取黑板 `friction_factor` 或恢复倍率。这个值由具体天赋配置。运行时黑板前缀的推导路径未单独解码。[SN-5 关卡配置](../evidence/friction-factor-20261120/battle-scope.json)、[敌人黑板、Prefab 和 Buff 模板](../evidence/friction-factor-20261120/enemy-content.json)、[节点读取和分派](../evidence/friction-factor-20261120/native.json)。

**U｜调查范围。** 固定镜像的 4,025 份 `level_*.json` 中没有字面黑板键 `friction_factor`。这次扫描只覆盖关卡 JSON，地块 Prefab、脚本和热更仍按实际内容核实。E8／E9 扫描只记录直接调用候选。[取样记录](../evidence/friction-factor-20261120/battle-scope.json)、[输入与复查入口](../evidence/friction-factor-20261120/README.md)。

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

项目速度与范围契约见 [Locomotion](../../architecture/navigation.md#locomotion)，不能将普通属性下限当成全局倍率后的最低位移。

### moving 不是唯一事实

**N：** 原生至少区分：

- MoveController 保存的转向积分速度。
- Rigidbody2D 的物理速度。
- `Enemy.isMovingBySelf`：未消失、当前状态为 Move 且 Blackboard.isHanging=false。
- `isHanging`：普通 CalculateMoveDelta 根据方向与局部力是否为零等输入建立的控制结果；并非直接比较两个实际位置。
- Enemy 累计的实际 mapPosition 变化距离。

`Action.IfEnemyIsMoving`（99311）读取刚体速度并检查模长>0.1；`IfEnemyIsMovingBySelf`（99314）读取上述状态查询，说明区分具有实际内容消费者。不能将所有“移动时”条件统一解释成 positionChanged。[查询与消费者](../evidence/locomotion-native-20261019/states/metadata.json)。

固定数据 `17759cc8cdf37388414145d16262a3a06f3ab25e` 中，`enemy_hvymot_crash` 与 `enemy_mhboar_crash` 的 `ON_BUFF_START` 均在伤害前以 `SOURCE` 检查 `IfEnemyIsMovingBySelf`。水手重艇和凶豕兽分别有支线、集成战略关卡的直接出怪配置。仍待核对这两条冲撞调用在仅受外力移动或自主停步后是否触发。 [水手重艇冲撞](../../../assets/arknights-game-data/zh_CN/gamedata/battle/buff_template_data.json#L36582) · [凶豕兽冲撞](../../../assets/arknights-game-data/zh_CN/gamedata/battle/buff_template_data.json#L99147) · [支线出怪](../../../assets/arknights-game-data/zh_CN/gamedata/levels/activities/act12side/level_act12side_07.json#L3000) · [集成战略出怪](../../../assets/arknights-game-data/zh_CN/gamedata/levels/obt/roguelike/ro5/level_rogue5_2-2.json#L3352)

## 9. 证据边界

积分与参数开关、预测吸附、速度保留、普通空间修正及移动资格已有直接分支。自主运动方向、运动积分和实际位移约束不能仅凭相同最终坐标互相替代；各类“正在移动”查询也不能统一为 positionChanged。

未完成的现场范围包括活跃热更、全部特殊敌人／内容的碰撞配置、全场物理与对象更新的完整顺序，以及客户端端到端轨迹的定量对比。项目实现与明确近似见 [Navigation／Locomotion](../../architecture/navigation.md)。

## 阻挡站位后续核查

2026-10-31 的 [Case 22](22-block-positioning-and-interruption.md) 补核确定性线性插值、主动解除与容量裁撤的取消差别，以及离场、传送和失衡入口；不将所有位置写入合并为通用取消规则。
