# 阻挡站位：插值曲线与解除、中断

研究日期：2026-10-31。核查本机 Windows IL2CPP 客户端普通 native 路径；没有启动游戏或核实活跃 XLua。复用 2026-10-23 的位置几何研究，本轮重新读取输入、方法地址及指令，补齐 Tween 内部推进和停止路径。

## 1. 问题与结论

**确定性 BattleTween 分支使用线性插值；解除关系不等于所有入口都取消 Tween。未完成的插值也不是自主移动的统一互斥条件：确定性 Tween 先于普通对象更新，符合移动条件的 Enemy 随后仍可执行路线积分。**

| 问题 | 结论及边界 |
| --- | --- |
| 是否可以用 6 Tick 线性插值 | 确定性分支有线性原生依据。原生持续时间来自 float32 约 0.2 秒，不是硬编码六次推进；6 Tick 是项目 30 Hz 下的映射，不包含原生 FP 舍入及调度等价保证。 |
| 敌人主动解除 | ReleaseFromBlocker 先同步解除关系，再 Kill(false) 当前 m_blockTween。确定性 Kill(false) 不提交终点，停止回调只清句柄，因此保留已经写入的实际位置。 |
| 容量裁撤／阻挡者清场 | UpdateBlockees／ClearAllBlockees 直接调用 UnregisterBlocker；该普通主体清归属并通知，没有直接取消 Tween；仍在播放的确定性 Tween 继续由独立管理器推进。不能把主动解除的停止语义推广到这些入口；内容回调可能另行干预。 |
| 插值未结束时恢复自主移动 | Tween 未完成不是统一禁移条件。Enemy 是否执行路线积分取决于当前状态、目标、Ability 退战等待及移动资格；不保证解除当 Tick 立即恢复。已满足普通 MoveState 路线分支时，可先提交本轮 Tween 位置，再执行自主移动。 |
| 同一逻辑 Tick 顺序解除后重新接敌 | ReleaseBlock 没有通用的本 Tick 重接敌锁；仍需另一个合法搜索／取得入口。确定性新 Tween 从创建时 mapPosition 采样起点，重新使用完整约 0.2 秒。 |
| 解除通知中同步重入接敌 | 与上一行不同。外层 ReleaseFromBlocker 在 RemoveBlockee 返回后才读取当前 m_blockTween；重入程序若已创建新 Tween，外层可能取消新句柄。该条件性调用链不是“原生保证保留新计划”，本轮也没有找到并执行实际触发它的内容实例。 |
| 被阻挡的敌人死亡／结束 | 已核对 Enemy DeadState.OnEnter 和 Enemy.OnFinish 调用 ReleaseBlock，接续上述取消路径。阻挡者死亡清场走 ClearAllBlockees，不能与目标自身离场混为一谈。 |
| 传送／强制设置位置 | 已核对 ForceSetPositionByWorldCoords 与三个普通 Blink 入口：战斗条件满足时先 ReleaseBlock，再接续位置／状态处理。不是先发布新位置再通知解除；低层 SetPosition 本身不是统一取消入口。 |
| 推拉／失衡覆盖位置 | 已核对 KnockBack／BeginPull 与 UnbalanceState 的普通路径；进入 UnbalanceState 会 ReleaseBlock，解除站位 Tween，再由物理运动负责位置。免疫、未进入该状态、特殊子类和不经该入口的位移不能一律套用。 |

## 2. 资料与证据

2026-10-31 查阅 [PRTS 作战机制](https://prts.wiki/w/作战机制)的阻挡偏移说明：空降时的 0.5 分离、中心重合例外及多目标偏移可作几何交叉依据。该说明不足以确定插值曲线、取消和同步重入顺序，因此继续核对客户端。

本轮输入指纹与旧 Blocking 几何批次一致：

- GameAssembly.dll：218523112 bytes，SHA-256 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`。
- global-metadata.dat：45805368 bytes，SHA-256 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`，metadata v29。

新指令、参数、字段和常量集中在 [selected-native.json](../evidence/block-positioning-20261031/selected-native.json)；按 `result.bodies[].selector` 和指令地址定位。方法由当前 metadata 查询定位，下面编号不是其他版本的定位规则。

### N：确定性曲线

`Enemy._MoveToBlockPosition` 76515 在 `0x180a79b1b` 查询 isDeterministic；真分支读取当前 mapPosition，向 StartBattleTween 64749 传入起点、目标及约 0.2 秒（常量 VA `0x186e40b18`），设置 OnStop 后 Play。该路径没有 SetEase。

`BattleTweenMgr.To(Vector2)` 22097 → Tween.Init(Vector2) 22107 → 标量 Init 22106；OnAllocate 22109 清空 m_easeFunc（+0x40）。Tick 22108 在 `0x18199708a` 区分缓动函数是否存在，无缓动分支在 `0x181997153` 计算 accumTime／duration，`0x18199717c` 调用 TSMath.Lerp。Vector2 回调 22119 在 `0x18199726c–0x1819972a6` 限制参数到 [0,1]，按 `from + (to-from)*progress` 计算两个分量；完成路径提交终值。

### N／U：普通 DOTween 分支

76515 的非确定性分支调用 DOTween.To，后续两个泛型辅助调用分别写 target（Tween +0x48）及 onKill（+0x88）；Deprecated_PlayTweenInBattle 78250 设置更新方式并播放。已检查这些直接路径没有 SetEase。

本机 DOTween..cctor 305282 在 `0x184250205` 将 defaultEaseType（静态 +0x54）初始化为 6；metadata 小整数默认值解码确认 OutQuad=6、Linear=1，原始字节和定位保存在 result.enumDefaults。[DOTween 当前文档](https://dotween.demigiant.com/documentation.php)给出的默认类型为 OutQuad，可作交叉资料。这里仅确认客户端的初始化值及未局部设置曲线，不声称已经核实游戏启动后所有全局赋值、活跃热更及普通运行现场的最终曲线。确定性分支的线性结论不依赖这一未决项。

### N：取消与通知顺序

ReleaseFromBlocker 76492：`0x180a742cc` 调用 RemoveBlockee 77193；之后 `0x180a742d1` 才检查 +0x3f0，并在 `0x180a742e7` 以 false 调用 Kill 接口派发辅助函数 `0x1805e75e0`。

Tween.Kill 22112 仅在 complete 参数为真且正在播放时调用 _OnComplete；false 路径转 STOPPED 并执行 OnStop。敌人停止回调 76565／76568 共享 `0x180a76b20`，只将 m_blockTween 清零；不会调用 SetPosition。普通 DOTweenWrapper.Kill 22093 转交 TweenExtensions.Kill，仍传递 false。

UnregisterBlocker 76433 在匹配当前 blocker 后清归属，再 EmitEvent 和 OnOwnerBlockeeChanged；没有直接读取 +0x3f0 或 Kill。RemoveBlockee 77193、容量裁撤 UpdateBlockees 77192 和 ClearAllBlockees 77196 均经它处理目标。本结论限定这些直接 native 控制流，不排除同步内容回调自行取消。

### N／I：离场、传送、推拉与重入

- Enemy DeadState.OnEnter 76666 在 `0x180a8b419`、OnFinish 76529 在 `0x180a70ce8` 调用 ReleaseBlock。
- ForceSetPositionByWorldCoords 76452 在 `0x180a6da41` ReleaseBlock，`0x180a6dab6` 才 SetPosition。Blink 76448／76449／76450 的战斗分支同样调用 ReleaseBlock。
- UnbalanceState.OnEnter 76746 在 `0x180a9e858` ReleaseBlock；KnockBack 76435／BeginPull 76437 的力学及失衡配合另见 [Case 15](15-locomotion-native-semantics.md)。这些普通入口不代表任意位置写入的统一协议。
- 普通顺序重新取得时，新确定性 Tween 起点由 `0x180a79c2a` 当前 mapPosition 读取；ReleaseBlock 76546 本身不搜索。若在解除通知内部重入，76492 的后置字段读取及停止回调的无条件清零只能支持“可能影响新句柄”的条件性推断，不能证明某个实战内容一定触发。

### N／I：未完成插值与自主移动的调度

同日补核的直接指令见 [Tween 调度证据](../evidence/block-positioning-20261031/scheduling/tick/selected-native.json) 和 [移动资格证据](../evidence/block-positioning-20261031/scheduling/movement/selected-movement.json)。两条提取路径重新核对相同输入指纹，分别保留可复跑脚本；不是仅根据先前“未直接 Kill”推断继续执行。

1. **Tween 独立登记。** `BattleTweenMgr.To(Vector2)` 22097 在 `0x181986b9b–0x181986bae` 将 Tween 加入 `m_tweenList`（管理器 +0x18）。`Play` 22113 在 `0x181996e63` 将状态设为 PLAYING（2），随后立即提交起点；后续时间累计由管理器驱动。
2. **先 Tween，后普通对象。** `BattleController.OnTick` 64825 在 `0x18062c7a1` 调用 `BattleTweenMgr.Tick` 22098，之后 `0x18062ca4d` 才调用 `ObjectManager.OnFixedUpdate` 71077。Enemy 的状态机和普通路线位移属于后者，二者不是一项按优先级择一执行的任务。管理器在开头采样 Tween 列表长度；普通对象阶段中新建的 Tween 不倒回已执行的管理器阶段。
3. **关系解除不移除仍在播放的计划。** 管理器在 `0x181986920–0x18198692f` 按 Tween 状态为 PLAYING（2）调用其 `Tick`，不查询 Enemy 当前 blocker；第二遍在 `0x18198696c–0x18198699c` 回收 STOPPED（3）项。`UnregisterBlocker` 清归属及通知而不改变 Tween 状态，因此仍在播放的 Tween 可继续调用原位置更新程序。位置回调 76564／76567 共享 `0x180a76b10`，在 `0x180a76b13` 尾调用 `VisualObject.SetPosition`，写入的是实际位置。
4. **自主路线没有 Tween 互斥判断。** `MoveState.OnTick` 76658 的普通路线分支，经虚 slot 237 进入 `Enemy._MoveByRoute` 76487，再调用 `_MoveByCursor` 76491。该路径检查状态、GroundBound 和移动条件，未以 `m_blockTween`（+0x3f0）是否非空作为等待条件。`_MoveByCursor` 在 `0x180a793ac`、`0x180a7942c`、`0x180a7952d` 的对应分支调用 `VisualObject.SetPosition`，写入真实位置。
5. **完成也不建立额外停走 Tick。** `Tween._OnComplete` 22117 在 `0x18199731a` 先提交终点，再设置 STOPPED 并执行 OnStop；Enemy 回调 76565／76568 清 Tween 句柄，管理器第二遍移除该项。在管理器 Tick 推进至自然完成的这条路径中，上述处理发生在普通对象更新之前。是否随后移动仍按对象自身状态判断，没有统一“完成当 Tick 仍跳过、下 Tick 才恢复”的规则。

由上述调用链可推导的区分场景是：**某个 Tick 开始时残留 Tween 仍在播放，且 Enemy 随后的普通更新已满足 MoveState 路线分支，则同一真实坐标可先被 Tween 写入插值点，再由路线积分写入。** 这不等于关系解除必定立即移动，也不保证 Combat 切到 Move 的同一 Tick 重新进入 Move.OnTick。

`CombatWrapper.NextCombatOrExit` 76878 的退出路径还检查目标与退战等待：无目标且时间已到时，在 `0x180a8a1cb–0x180a8a1d3` 请求切到 MOVE（1）。Enemy 的 `m_combatNextEscapeTime`（+0x508）由构造器 76562 初始化为 FP(0)；`CombatFinishCallback` 76880 在 `0x180a89e82` 取 fixedPlayTime，经 Ability 虚 slot 22 取得 `escapeTime`，相加后在 `0x180a89ef3` 写回该字段。基础 getter 63043 返回 FP(0)，动画 Ability getter 91778 在 `0x180f01324` 读取实例 float 参数 +0x18c。它不是本轮站位 Tween 的约 0.2 秒常量；状态切换和攻击退战等待仍可推迟实际恢复移动。`RegisterBlocker` 中同为 +0x508 的访问属于类型静态字段表的热更槽，不能误认作该实例字段。

## 3. 未决项与区分案例

未执行游戏、热更或完整物理模拟；未证明全部模式使用相同 Tween 分支，没有给线性六步与客户端逐帧轨迹作数值等价背书。DOTween 运行态最终默认曲线、特殊传送／位移覆盖、全部特殊状态下的最终轨迹，以及同步重入的具体内容实例仍需按需补证。上文确定性管理器与普通移动分支的结论不等于实战逐帧观测。

需要区分的场景：插值半途由目标主动释放，与仅降容量清归属；解除完成后再取得，与解除通知中重入取得；目标死亡，与阻挡者死亡清场；ForceSetPosition 的解除通知，与之后的新坐标写入。不能用一项“解除必取消”的人工测试覆盖这些差异。

## 4. 项目关联

影响 Blocking 的关系清理、站位状态归属、Movement 调度与实际坐标观察。此前讨论中“任意解除都先取消计划”“传送先同时发布新位置再通知”属于项目方案，不能作为原生事实。项目可采用更一致的清理协议，但应明确记录与上述原生入口的差别，由架构审查决定；本次不修改实现或既定项目政策。

本轮时序补核不支持把“存在 PositionAdjustment 时，本 Tick 一律跳过 Locomotion”写成原生固定优先级。保留独立计划与真实位置的区分有直接依据；是否在项目中额外规定互斥推进，属于另行明确的模拟政策，本次不替项目作出该选择。
