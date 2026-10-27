# Route、等待与实际移动的客户端时序

研究日期：2026-10-18。直接读取 Case 12 同一份安装客户端的 GameAssembly.dll 与 metadata，补查普通 Enemy 的状态机、DirectionCursor 与 Checkpoint。只更新研究记录，不修改源码，也不把此前提出的 route.settle 接口当作官方结构。

证据入口：[本轮方法清单](../evidence/route-movement-20261018/manifest.json)、[字段布局](../evidence/route-movement-20261018/fields.json)。二进制路径及 SHA-256 沿用 [Case 12 输入清单](../evidence/navigation-native-20261018/manifest.json)。下文 N 表示原生指令直接支持，I 表示组合调用链的限定推断，U 表示未确认。没有运行游戏现场、核实 Lua 替换或验证全部子类。

## 1. 普通移动状态的实际调用顺序

```text
Enemy.OnTick(dt)
    ↓
Unit.OnTick → Entity.OnTick → StateMachine.Tick
    ↓
当前状态逻辑；在普通 MoveState 中：
    检查眩晕、冻结、阻挡、攻击目标等
    → 选择正常路线／恐惧／吸引移动
    → _MoveByRoute → _MoveByCursor
        ├─ PredictReached：本次距离足够时直接定位到预测目标
        └─ GetNextDirection → MoveController → 提交实际位置
    ↓
返回 Enemy.OnTick
    ↓
DirectionCursor.OnTick(dt, checkReached)
    当前 Checkpoint.OnTick(dt)
    → 若 checkReached，检查当前路点并可能 _MoveNext
    ↓
检查主路线终点资格，可能进入离场状态
```

**N：** Enemy.OnTick（76531，`0x180a72340`）在 `0x180a723db` 调用 Unit.OnTick，在较后的 `0x180a725a9` 调用 DirectionCursor.OnTick。Unit.OnTick（77699）调用 Entity.OnTick（66697），后者在 `0x1806faea6` 调用 StateMachine.Tick（33274）。状态机分派当前状态；MoveState.OnTick（76658，`0x180a977d0`）在普通路线分支通过虚槽 237 调用 Enemy._MoveByRoute（76487），后者调用 _MoveByCursor（76491）。[Enemy.OnTick](../evidence/route-movement-20261018/76531.asm)、[Entity.OnTick](../evidence/route-movement-20261018/66697.asm)、[MoveState](../evidence/route-movement-20261018/76658.asm)。

**I：限定普通 MoveState 的上述同步链，** 本 Tick 实际运动先于后续 Cursor 的路点计时与检查。其他状态可以不移动，不应将该图解释为所有状态每 Tick 都会执行一次 _MoveByCursor。

_MoveByCursor 的普通路径进行一次位移；预测到达分支直接 SetPosition 后返回，没有把剩余距离继续用于下一路点的循环。GetNextDirection 内可以推进多个已经满足的路点，这是脚本推进，与重新获得一份运动预算不同。[实际移动](../evidence/route-movement-20261018/76491.asm)

## 2. 路点推进存在两个位置

### 请求移动方向时

**N：** DirectionCursor.GetNextDirection（70277，`0x180894f60`）包含循环。在 `0x18089539c` 调用当前 Checkpoint 的 CheckReached；满足时在 `0x1808953e0` 调用 _MoveNext，然后 `0x1808953f5` 跳回循环处理新的路点。部分路点要求在切换后重取 locator，相关虚方法资格在同一分支处理。[方向与推进](../evidence/route-movement-20261018/70277.asm)

因此，在请求方向期间可以连续消耗已经满足的路点。不能仅用“每 Tick 最多推进一个路点”概括客户端。

### Cursor.OnTick 时

**N：** DirectionCursor.OnTick（70287，`0x180895d70`）先调用当前 Checkpoint.OnTick，再根据独立的 checkReached 参数决定是否执行 CheckReached；满足后调用一次 _MoveNext。此处没有循环把同一 dt 再交给刚进入的下一个路点。[Cursor.OnTick](../evidence/route-movement-20261018/70287.asm)

简化伪代码：

```typescript
currentCheckpoint.onTick(dt);

if (checkReached && currentCheckpoint.checkReached(locator)) {
    moveNext();
}
```

_MoveNext（70163，`0x180876920`）调用旧路点结束接口、通过该路点的 NextCursor 计算后继，再调用新路点 OnBegin。后继不一定是简单的 index + 1；巡逻及忽略非移动路点等有各自规则。[切换路点](../evidence/route-movement-20261018/70163.asm)

**结论：** “移动前统一 settle 一次，移动后再 settle 一次”是 Stronghold 可以采用的重组方案，不是官方函数时序。按项目判断标准，普通等待结束前后的一个 Tick 左右差异属于低优先级；保证等待计时和移动预算不重复消费即可。只有实际观察者产生显著业务影响时，才需要进一步细化相关时点。

## 3. 等待如何计时

**N：** WaitForSecondsCheckpoint.OnBegin（70223）将配置 time 写入 m_time；OnTick（70224）执行 `m_time = Max(0, m_time - dt)`；isReached（70217）检查 `m_time <= 0`。FP 算术与 TSMath.Max 已通过对应程序集方法表确认。[开始等待](../evidence/route-movement-20261018/70223.asm)、[扣减时间](../evidence/route-movement-20261018/70224.asm)、[完成条件](../evidence/route-movement-20261018/70217.asm)

| 等待类别 | 原生判断 |
| --- | --- |
| WAIT_FOR_SECONDS | 进入路点时设置剩余时间；每次当前路点 OnTick 扣减 dt。 |
| WAIT_FOR_PLAY_TIME | fixedPlayTime 达到配置 time。 |
| WAIT_CURRENT_WAVE_TIME | userFixedPlayTime 达到 Cursor 所存波次开始时间加配置 time。 |
| WAIT_CURRENT_FRAGMENT_TIME | userFixedPlayTime 达到 Cursor 所存片段开始时间加配置 time。 |

后三项分别见 [70226](../evidence/route-movement-20261018/70226.asm)、[70232](../evidence/route-movement-20261018/70232.asm)、[70238](../evidence/route-movement-20261018/70238.asm)。客户端区分 fixedPlayTime 与 userFixedPlayTime；不能未经核实将所有等待都解释为同一个全局时钟。

**N／I：** MoveState 会因眩晕、冻结、阻挡等转入其他状态或不执行普通移动；仍存活的 Enemy.OnTick 后续调用 Cursor.OnTick 的分支并不以这些移动资格为条件。因此在这条普通链上，禁止自主移动不自动暂停当前等待计时。不能推广为死亡、移出更新或所有特殊时间停止效果也继续计时。

Enemy.OnTick 给正常路线、恐惧与吸引控制器传递不同的 checkReached：恐惧或吸引接管时，正常路线的推进检查被关闭，但 Cursor.OnTick 仍先调用当前路点的 OnTick。正常路线处在时间等待时可以继续计时，不因失去当前运动控制而自动冻结。这里的结论针对恐惧／吸引原生分支，不直接等同于一切自定义替代路线。

## 4. 普通 MOVE 路点不可达时

**N：** MoveCheckpoint.CheckReached(Vector2)（70193，`0x18089fdb0`）读取 Cursor.alwaysCheckCurrentPoint。若为 false，会先检查当前格是否有效及本路点 Field 在当前格的 Node 是否有效；图外或 Node 无效时直接返回 true。在图内且 Node 有效，或 alwaysCheckCurrentPoint 为 true 时，才检查当前位置与目标位置的距离是否在容差内。[路点检查](../evidence/route-movement-20261018/70193.asm)

```typescript
if (!cursor.alwaysCheckCurrentPoint) {
    if (!insideMap(currentTile) || !checkpointField[currentTile].isValid) {
        return true;
    }
}

return withinDistance(locator, sampledTarget, reachDistance);
```

返回 true 会被方向查询循环或 Cursor.OnTick 用于推进该路点。因此：

- alwaysCheckCurrentPoint=false：普通 MOVE 路点不可达时可以跳过，即使没有实际抵达。
- alwaysCheckCurrentPoint=true：仍以实际抵达距离判断，不自动跳过。

这是一项客户端已存在的条件语义，不能将其笼统描述成“官方遇到不可达一律等待”或“具体 Content 可以随意决定”。Stronghold 若希望保留可观测行为，需要让 Route 能接收到导航不可达事实并表达对应政策。

此结论针对普通 MOVE 路点。不能直接推广为“不可达终点也视作完成”；终点走另外的 Route.CheckReached 检查。

## 5. 目标采样与最终完成

**N：** MoveCheckpoint.OnBegin（70197）根据 randomizeReachOffset 进行随机采样或复制固定 offset，并写入本路点实例的 m_offset。后续检查与移动沿用该值。巡逻重新进入同一路点时会重新执行 OnBegin，不能把“一次进入只采样一次”误写成该静态路点永久只采样一次。[采样入口](../evidence/route-movement-20261018/70197.asm)

**N：** DirectionCursor.CheckReached（70272）是最终路线到达检查。visitEveryCheckPoint 为 true 且仍有未处理路点时直接返回 false；否则调用 Route.CheckReached 检查实际终点。这与普通 MOVE 路点不可达时的跳过逻辑不同。[路线完成检查](../evidence/route-movement-20261018/70272.asm)

## 6. 末段跟踪差异与项目选择

最初的 nextPoint 草案只在当前格为目标节点时返回精确 target，其他可达格返回 next 格中心。它不执行额外 Raycast，不负责 Cursor、Visits、到达或实际运动。

**N：** 原生 MoveCheckpoint.GetNextDirection（70190）在安全 next 格已经指向路点目标格时，就将本次已采样 offset 加入 next 位置后求方向；不要求当前格先进入目标格。位置计算与分支见 `0x1808a03f3..0x1808a0437`。[末段方向](../evidence/route-movement-20261018/70190.asm)

因此在带非零 reachOffset 的路点上，该草案可能产生不同的局部末段轨迹，但最终目标相同。用户将其判断为小差异，采用不增加 API 的修正：当前格是目标节点，或 next 已指向目标格时，均返回精确 target；其余情况返回 next 格中心。现行契约见 [Navigation 设计](../../architecture/navigation.md)。

## 7. 对下一步接口审查的要求

- 区分路点时间更新、根据位置／可达性推进、实际运动三件事。
- Route 提供当前目标及抵达／不可达政策，Locomotion 消费建议并提交实际位置；无需复制客户端类层级。
- 地图内不可达可直接使用 nextPoint 的 null 结果反馈给 Route，目前不需要独立可达性查询或更复杂的结果类型；地图外恢复由 Locomotion 处理。
- 同 Tick 连续处理路点不得重复消耗同一份 dt；移动只消费一次预算。项目不强制复制客户端的推进位置。
- 中心访问记录等政策按实际配置需求继续审查，不预先设计；确需维护的历史归 Unit，不能藏进 Navigation 缓存。
- 局部避障与位移修正后续按实际业务审查，不因客户端存在相关分支就预设额外 API。

**U：** 未穷尽所有状态机子类、TracePositionCursor 预测前视对特殊短距离布局的影响、运行时热更覆盖和所有状态间切换的帧边界。本轮没有游戏现场验证，也没有以项目现有实现反证客户端。
