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

_MoveNext（70163，`0x180876920`）通过当前路点的 NextCursor 计算后继，在存在未被过滤的新路点时调用其 OnBegin。后继不一定是简单的 index + 1；巡逻及忽略非移动路点等有各自规则。[切换路点](../evidence/route-movement-20261018/70163.asm)。当前客户端的完整操作、过滤及 Reset 时序另见[案例 31](31-route-operations-and-state.md)，不根据通用生命周期习惯补入 OnEnd 时点。

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

2026-11-07 补核：出生入口的快照绑定、原生 Fragment 基准包含前延迟，以及 Fear／Attract 的快照继承，集中见[案例 14 第 6 节](14-route-definition-fields.md#6-路线创建与初始化2026-11-07-补核)。

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

### 4.1 配置来源与 Cursor 政策（2026-11-08 补核）

**N：** 配置来自 Enemy Prefab 的 `_alwaysCheckCurrentPoint`，不在 RouteData。普通 `Enemy.Init` 将它传入 `DirectionCursor` 构造器，由 Cursor 保存并供 MOVE 到达检查使用。复用原 Cursor 与创建新 Cursor 的政策不同：

| 操作 | alwaysCheckCurrentPoint |
| --- | --- |
| 普通 Enemy 初始化 | 从 Enemy Prefab 复制 |
| ReassignRoute／ReconstructRoute | 复用原 Cursor，保留该值 |
| Fear／Attract 创建临时 Cursor | 明确传 false，不复制主 Cursor 的值 |
| ChangePathMotionMode 创建新主 Cursor | 明确传 false，不重新读取 Prefab 初值 |

精确参数位置、原生选择器与原件引用见[参数核对](../evidence/always-check-point-20261108/runtime/)。这些结论描述普通静态方法，不保证任意同步内容回调后仍保留同一个 Cursor。

**D：** 本轮成功扫描 45 个敌人／Token Prefab 包。已识别的 2,206 个 Enemy 组件中，只有以下三个配置为 true，其余 2,203 个为 false，没有字段缺失：

| Prefab | EnemyData 名称 | 直接主 Wave 出生正例 |
| --- | --- | --- |
| enemy_10163_mnctur | 帕拉杜利斯 | act48side_07，Wave 0／Fragment 2／Action 0 |
| enemy_10163_mnctur_2 | 神勇的帕拉杜利斯 | act48side_ex03，Wave 0／Fragment 0／Action 0 |
| enemy_2137_shsdgo | 猎犬proto | rogue6_c-7，Wave 0／Fragment 3／Action 0 |

这三个出生引用均为正数 count、无 hiddenGroup、无 Action 随机组；所绑定路线包含 MOVE。[Prefab 扫描](../evidence/always-check-point-20261108/config/prefabs.json)、[数据与关卡正例](../evidence/always-check-point-20261108/content/)。因此，true 不是仅存在于未启用模板的参数。该范围不代表扫描了客户端全部资源，也不证明所列 MOVE 实际不可达。

**N／D／I：** 猎犬proto的基础 `fearedImmune=false`。妮芙 S2 的实际选择器、命中弹道、fear 数据库与模板、恐惧目标登记及 FearController 构造链已经配对：在目标存活、正常可选且位于技能范围内等条件下，它可拥有 true 的主 Cursor，同时由恐惧创建 false 的临时 Cursor；恐惧结束后返回原主 Cursor。[完整交叉与新增选择器原件](../evidence/always-check-point-20261108/runtime/README.md#猎犬proto--妮芙-s2)。这是实际内容的静态可执行组合，不是实机施放或不可达时不同走位的观测。

**U：** 三个 true 对象是否实际通过 ChangePathMotionMode 将主 Cursor 政策改为 false，本轮未闭合。不能用恐惧的独立临时 Cursor 代替这项主 Cursor 替换的内容证据。

**项目影响：** 配置来源与执行政策是不同问题。原生并不保证一个 Enemy 的全部 Cursor 都使用相同政策；也不能仅因值从 Prefab 读取，就将它认定为路线方案本身的字段。实际内容交叉与新 Cursor 参数应一起用于后续架构判断，本次不决定 Plan、初始化输入或 Execution 的最终字段。

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

## 8. ALERT 与巡逻回边（2026-11-06 补核）

本节针对普通 BasicCursor 的两个检查点，不重新调查整条运动链。PRTS [作战机制](https://prts.wiki/w/作战机制)查阅于 2026-11-06：确认巡逻点重复经过，但没有说明分段算法；ALERT 的合作关卡警示用途使用了不确定表述。因此读取当前官方 Windows 客户端的实际消费者。输入指纹、完整选择器和复跑命令见[本批 README](../evidence/route-alert-patrol-20261106/README.md)，与 2026-10-18 的旧批次不是同一份客户端。

### ALERT：当前格的声音与警示特效

**N：** AlertCheckpoint.OnBegin（71390，`0x1808cc0f0`）检查 Cursor.owner 有效，按其当前格取得 Tile，然后调用 `BattleController.PlayAudioAtPos` 和 `BattleController.CreateEffect`。完整普通路径没有设置警觉、索敌、攻击或其他战斗行为状态。CheckReached（71388）恒为 true，不等待特效完成。[入口与完整尾段](../evidence/route-alert-patrol-20261106/native-alert.json)

因此，这条普通 native 路径直接支持的是即时警示表现，不能仅因名称 ALERT 而赋予它额外的战斗状态语义。本次没有核实具体警示资源、运行时 XLua 替换或特殊 Cursor；不将此结论扩大成所有模式下同名操作的保证。

### PATROL_MOVE：连续非普通 MOVE 段的回边

**N：** PatrolMoveCheckpoint.NextCursor（71342，`0x1808dbb00`）先看下一项；下一项属于合法巡逻段检查点时，直接前进。遇到末尾或下一项不合法时，从当前项的前一项开始向前扫描，回到这一连续段最早的前置项。若没有合法前置项，则仍然向后前进。当前方法以 `type - 1 <= 9` 判断合法范围，包含等待、出现／消失、ALERT、PATROL_MOVE 等检查点，排除普通 MOVE（0）。IsValidPatrolCheckPoint（71340）采用相同条件。[后继算法与实际分派](../evidence/route-alert-patrol-20261106/native-patrol.json)

由这些分支可以直接推得：

| 路点序列 | 普通 native 的后继 |
| --- | --- |
| 只有一个 PATROL_MOVE | 完成后前进，不自行构成循环。 |
| WAIT → PATROL_MOVE → 末尾 | Patrol 回到 WAIT；每次重新进入 WAIT 都执行其 OnBegin。 |
| MOVE → WAIT → PATROL_MOVE → PATROL_MOVE → MOVE | 最后一个 Patrol 回到 WAIT；前面的普通 MOVE 不属于循环段，后面的普通 MOVE 构成回跳边界。 |
| PATROL_MOVE 后接合法非 MOVE 检查点 | 当前 Patrol 先前进，不因自身是巡逻点立即回跳；只有实际执行 Patrol.NextCursor 的边界才生成回边。 |

**N：** BasicCursor._MoveNext 普通路径通过虚槽 12 调用当前检查点的 NextCursor，Patrol 的实现位于同槽，随后开始新检查点。上述规则是实际 Cursor 使用的后继算法，不只是类型名或未调用辅助方法的推测。

**N：** 原生另有每个 PatrolCheckpoint 自身的重复切换计数；计数大于 50 时记录错误并前进，OnTick 将计数清零。这是该实现的局部防循环保护，不能据此宣称原生每 Tick 有统一的 50 次或 128 次 Route 推进额度。

**U：** 以上来自当前静态普通 native 分支，未验证活跃 XLua、特殊 Cursor 或实机行为；本轮不据此决定项目的推进预算、表现 Event 或公开 API。

## 9. Checkpoint 参数与首路点时序（2026-11-07 补核）

本轮只补 MOVE 的三个目标／到达参数及首个即时指令，不重新调查全部 Checkpoint。客户端与配置分别记录版本；原件、指纹与复跑见[Checkpoint 批次](../evidence/checkpoint-semantics-20261107/README.md)。N 为静态普通原生分支，D 为固定镜像配置及引用，I 为据此推导，U 为未闭合项。

### MOVE：目标偏移与到达半径

**N：** `MoveCheckpoint.OnBegin` 在每次进入时决定本次实例目标偏移：randomizeReachOffset=false 时直接复制 reachOffset；为 true 时，以 reachOffset 的各轴值作为随机半宽，取得各轴 `[-range, +range]` 的样本。两者是互斥解释，**不是固定偏移再加一份随机偏移**。后续 targetPos 为路点格中心加这次偏移；与整个路线实例的出生偏移属于不同层。[当前方法及类型](../evidence/checkpoint-semantics-20261107/move/native-bodies.json)、[随机分派及续段](../evidence/checkpoint-semantics-20261107/move/random-wrapper-body.json)。重新进入会重新执行 OnBegin，已有巡逻回边结论不变。

**N：** 在地图／导航资格允许进行距离判断的分支，`CheckReached(Vector2)` 使用：

```text
radius = max(0.05, checkpoint.reachDistance)
reached = squaredDistance(locator, sampledTarget) <= radius * radius
```

固定下限的原始字节是 `cd cc 4c 3d`（float32，约 0.05），不是从配置默认值猜测。[常量](../evidence/checkpoint-semantics-20261107/move/reach-distance-floor.json)、[CheckReached 与 CheckDistance](../evidence/checkpoint-semantics-20261107/move/native-bodies.json)。因此 reachDistance=0 不表示必须精确到达一个点；更大的值会提前满足距离条件。第 4 节的不可达跳过分支仍可先于这个距离条件成立，不能用半径公式替代完整资格。

**D：** 复用固定提交 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` 的 82 份完整关卡。排除三份 sandbox 对照后为 79 份、8,278 个 MOVE，其中 643 项 reachOffset 非零。两个直接出生引用见证：

| 关卡 | 路点原值 | 普通 SPAWN 引用 |
| --- | --- | --- |
| 主线 3-4 | `/routes/40/checkpoints/0`，reachOffset=(0.48, -0.49) | `/waves/1/fragments/0/actions/1`，enemy_1501_demonk |
| 主线 10-15 | `/routes/9/checkpoints/4`，reachOffset=(-0.5, -0.47) | `/waves/0/fragments/2/actions/1`，enemy_1528_manfri |

[源文件身份、原值、Pointer 与统计](../evidence/checkpoint-semantics-20261107/move/config-summary.json)。这些固定偏移不能只当成显示坐标或无用字段。

上述有限样本的 randomizeReachOffset 均为 false、reachDistance 均为 0，不能推导全局不用。后续完整目录搜索及 **randomizeReachOffset=true 的实际内容绑定**见第 10 节；非零 reachDistance 的内容需求仍未完成验证。**N：** Fear 的 `_InitializeFearRouteData` 会在生成临时路点时先取随机样本，再写入 reachOffset；所查方法没有将 randomizeReachOffset 设为 true。[生成原件](../evidence/checkpoint-semantics-20261107/move/fear-and-random-continuations.json)。因此“恐惧目标有随机偏移”也不能充当该开关启用的证明。

### 首个即时指令：身份、位置与出生登记

**N：** 普通创建链区分 BObject 身份索引与 UnitManager 场上登记。沿成功、未被嵌套回调改变的路径，顺序如下：

```text
Factory 分配／取得 Enemy
  → OnAllocate：分配 UID、清消失标志、RegisterBObject
  → Enemy.Spawn → Enemy.Init
      → Entity.Init：建立初始位置，执行 OnInit 等初始化
      → 构造 Cursor，进入首个 Checkpoint.OnBegin
      → 构造返回，新 Cursor 写回 Enemy
  → Born／OnBorn
      → Entity.OnBorn：启动状态机，执行出生事件及 Buff 程序
      → Unit.OnBorn：RegisterUnit，再执行其余出生业务
  → 最外层 BObject.Born 返回前标记 born
```

Factory 的默认分配路径在 `0x18476ff16` 调用分配回调，经过 Unit.OnAllocate，最终由 BObject.OnAllocate 在 `0x1806afc18` 写 UID、`0x1806afc23` 清消失标志、`0x1806afc72` 调用 RegisterBObject。[分配链](../evidence/checkpoint-semantics-20261107/allocation/README.md)、[基础初始化](../evidence/checkpoint-semantics-20261107/initialization-bodies.json)。

BObject.Init 在 `0x1806afb63` 建立位置，早于 Enemy.Init 随后的 Cursor 构造；首次 OnBegin 与 Cursor 写回时点复用[案例 14](14-route-definition-fields.md#64-初始执行与临时-cursor-不是同一初始化政策)。Entity.OnBorn 在 `0x180729293` 才调用 StateMachine.Start；Unit.OnBorn 在它返回后的 `0x180b189b5` 调用 RegisterUnit；BObject.Born 到 `0x1806af830` 才写 born 标志。[初始化及出生原件](../evidence/checkpoint-semantics-20261107/initialization-bodies.json)、[Enemy 与登记入口](../evidence/checkpoint-semantics-20261107/entry-bodies.json)。所以首次 OnBegin 执行时已有有效 UID 与初始位置，但不能当成已在普通场上单位列表中登记。

**N：** 两个指令的即时行为还需要分别判断：

| 指令 | OnBegin 与首次执行的区别 |
| --- | --- |
| DISAPPEAR | 直接调用 SetDisappeared(true)。setter 只要求 UID>0 且标志不同，不要求 born 或 UnitManager 登记；依次执行前回调、写标志、后回调。Enemy 的前回调包含同步事件与 Buff 程序，因此初始化阶段存在真实的副作用机会。 |
| APPEAR_AT_POS | 先把同一单位的位置设为路点格中心加 **reachOffset**，再调用 SetDisappeared(false)。目标 getter 不使用 Cursor 出生偏移，也不按 randomizeReachOffset 采样。普通新实例的消失标志已是 false，因此首次执行可以只有位置写入，而没有出现前后回调。 |

[OnBegin 与 setter](../evidence/checkpoint-semantics-20261107/presence/checkpoint-presence-bodies.json)、[出现目标计算](../evidence/checkpoint-semantics-20261107/presence/appear-target-bodies.json)、[同步回调](../evidence/checkpoint-semantics-20261107/presence/entity-presence-bodies.json)。位置写入发生在 setter 的资格与同值判断之前，不能因后者 no-op 而跳过整个 APPEAR 指令。

**N／I：** 消失标志改变不等于已经进入 DisappearState。Enemy 的后回调会请求该状态；普通 SwitchState 在 currentStateId<=0 时拒绝转换，而未启动的新 StateMachine 的该字段为默认零。因此，初始化首 DISAPPEAR 可以已写标志并执行同步回调，却尚未施加 DisappearState 的渐隐和状态效果。后面的 Start 使用强制切换进入 Enemy 的初始状态；所查 BornState.OnEnter 初始化出生动画和等待，并不检查该标志。[普通切换](../evidence/checkpoint-semantics-20261107/state-switch-internal.json)、[构造](../evidence/checkpoint-semantics-20261107/state-constructor-body.json)、[Start](../evidence/checkpoint-semantics-20261107/state-start-bodies.json)、[初始状态](../evidence/checkpoint-semantics-20261107/init-state-body.json)、[BornState](../evidence/checkpoint-semantics-20261107/presence/born-state-enter-body.json)。本轮不据此推导之后永远不进入消失状态。

**U：** 82 份完整源文件的 routes／extraRoutes 中，未找到首个 Checkpoint 为 DISAPPEAR／APPEAR_AT_POS 的配置；不能将这种静态允许的调用链冒充已验证的实际关卡行为，也不能宣称全局没有此类路线。未运行游戏、核实活跃 XLua、穷举 OnInit 已安装的监听器，或继续展开出生结束后的全部状态选择。

### 对后续设计的约束

首路点进入可能包含随机采样、位置写入和同步业务，不能把“构造 Route State”和“进入首路点”混成纯字段初始化，也不能未经判断统一推迟到首个移动 Tick。原生两层登记及类方法顺序不是项目必须照搬的结构；应据实际观察语义决定完整创建／Enter 的边界。当前 Data 接受参数却未传递的现状，不构成字段无用的证据；非默认使用尚未闭合的部分继续保留为调查缺口，不据此提前扩大公开接口。

## 10. 非默认参数的内容正例与搜索范围（2026-11-07 补核）

这轮继续查两个参数的实际来源，不重做公式调查。完整来源、固定修订、原件与复跑见[非默认参数批次](../evidence/checkpoint-nondefault-20261107/README.md)。N 为本机静态原生消费，D 为镜像／资源直接配置，P 为社区描述；未运行战斗或验证活跃 XLua。

### 完整关卡 JSON：两次固定修订均无非默认值

**D：** 选择范围是镜像 `zh_CN/gamedata/levels/obt/**/*.json` 与 `activities/**/*.json`，包含不同玩法，未只挑普通主线或既有 Scheduler 样本。共享 config.py 按原文 JSON 值分组，另由 Git tree 核对完整文件集合，并逐文件校验 Git blob SHA-1、SHA-256 与输入大小。

| 固定修订 | 完整关卡 JSON | Checkpoint 数 | randomizeReachOffset | reachDistance |
| --- | --- | --- | --- | --- |
| `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` | 3997 | 513890 | 全部 false | 全部 0 |
| `63c7cec73c3858d0ae913f85cc89af3cef4d744f` | 4025 | 517501 | 全部 false | 全部 0 |

没有字段缺失或解析失败。[统计、原文身份与完整性核验](../evidence/checkpoint-nondefault-20261107/config/README.md)。这是对这两个固定修订及目录的完整检查，不是对所有客户端资源或运行时构造的全局否定。

### randomizeReachOffset：马特奥上尉的实际启用链

**D／N：** 正例来自内容程序插入的运行时路点，而不是关卡 Route 数组。最小链为：

```text
act32side_08 的 SPAWN：enemy_1551_bolicp
  → 正式敌人数据：马特奥上尉，技能键 CallBdguad
  → 当前 Enemy Prefab 的 _modes[1]：Reborn
      → Body / Skills / CallBdguad
      → 有目标能力的 _activeBuffs[1]
      → templateKey = enemy_bolicp_s3[call]
  → 当前 Buff 模板的 MOVE 插入节点
      → _randomizeReachOffset = true
      → _reachOffset = (0.3, 0.3)
  → InsertCheckPointInRuntimeRoute.Execute
      → 写入 CheckpointData.randomizeReachOffset
  → MoveCheckpoint.OnBegin 按该范围采样目标
```

关卡引用为 `/waves/0/fragments/1/actions/3`，routeIndex=10；正式敌人数据给出名称、prefabKey 和 CallBdguad 技能。[关卡摘录](../evidence/checkpoint-nondefault-20261107/search/bolicp-stage.json)、[敌人数据](../evidence/checkpoint-nondefault-20261107/search/bolicp-data.json)、[来源身份](../evidence/checkpoint-nondefault-20261107/search/identity-sources.json)。

当前 `enm_pfb_18.ab` 的必要组件及层级引用已核对：能力对象 PathID `-1903693957362766850`，层级归于 Reborn UnitMode `9106343686940568574`；同一 CallBdguad 下有启用的 EnemySkill，目标 Selector 按 `enemy_bdguad_mark` 筛选亲卫。该能力直接配置召集模板，而不是仅因模板名称与敌人相似就推断使用。**资源层级不独自决定施放阶段**；本轮未追完整模式切换与施放资格，也不宣称首次出生就立即执行。[当前 Prefab／模板及节点原件](../evidence/checkpoint-nondefault-20261107/runtime/README.md)。

节点普通分支在 `0x18122960b` 读取配置 bool，在 `0x181229610` 写入 CheckpointData 的 randomizeReachOffset。当前模板实际为 true，配合第 9 节已核公式，目标范围是相应格中心各轴 ±0.3，即边长 0.6 的正方形。同一模板还配置 30 秒 WAIT。**P：** [PRTS 马特奥上尉](https://prts.wiki/w/马特奥上尉)对“集合！”的描述也包含亲卫改变检查点、前往附近随机位置并停留 30 秒；这里只作内容机制对照，不替代字段与执行绑定。

**D：** 当前 holder 还包含 `cledub_s3[ridicule_lpeopl]`（花匠）与 `folchr_t[attract_mcreep_core]`（第 16 章圣愚）的相同 true／(0.3, 0.3) 配置，并已核对正式敌人身份及关卡出生引用。本轮用马特奥的完整 Prefab 链作为主正例，不以另外两个模板的存在替代各自的完整执行链。[身份与引用材料](../evidence/checkpoint-nondefault-20261107/search/README.md)。生息用的 `trap_xbblure_attract` 另作资源对照，不作为本项目支持范围的需求依据。

### reachDistance：仍没有实际内容正例

**N／范围：** 除完整关卡目录外，本轮定向检查了当前 CheckpointData 类型信息的代码引用候选，并沿运行时创建者核对字段写入，包括 Fear／Attract、TraceAndWait、敌人目标格重建、插入路点节点及若干实际内容生成者。Fear 提前随机后写入 reachOffset；Attract 构造普通 MOVE；插入节点虽然提供随机开关，但没有对应的 reachDistance 配置字段。所查普通生成分支没有得到非零半径的启用正例。具体方法、候选定位方式、实际反编译范围和未覆盖入口见[运行时材料](../evidence/checkpoint-nondefault-20261107/runtime/README.md)。

这比有限关卡样本更强，但仍不能证明所有既有 CheckpointData 的运行时修改、特殊反序列化输入或热更都不会给出非零值。当前能确定的是原生支持该参数，并且默认 0 经过公式得到 0.05 容差；**尚不能把可配置到达半径当作已经证实的 Content 需求**。

本轮因此闭合了随机目标偏移的内容需求，并保持非零到达半径的证据状态独立。这里不决定后续公开字段、操作或类型的具体形式。
