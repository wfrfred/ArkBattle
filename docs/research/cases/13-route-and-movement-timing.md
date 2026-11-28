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

### 3.1 临时控制的实际 Tick 接收者（2026-11-08 补核）

**N：** 当前客户端的 `Enemy.OnTick` 并非固定 Tick 主 Cursor。metadata 将 `get_cursor` 声明为 slot 225（vtable `+0xf50`），`get_moveCursor` 声明为 slot 226（`+0xf60`）。`Enemy.OnTick` 在 `0x180ac0b61` 取后者，`0x180ac0c09` 对返回值调用 `DirectionCursor.OnTick`。`get_moveCursor` 在普通存活且 `usingTraceCursor` 成立时返回 Trace Cursor，否则返回主 Cursor。准确虚槽、接收者字段及选录见[补核批次](../evidence/route-operations-20261107/temporary/advance-selection-20261108/README.md)。

| Tick 接收者 | `checkReached` |
| --- | --- |
| `get_moveCursor()` 返回的主或 Trace Cursor | `!isFeared && !isAttracted` |
| FearController 当前 Cursor | `isFeared` |
| AttractController 当前 Cursor | `!isFeared && isAttracted` |

三次 Tick 的先后为 moveCursor（`0x180ac0c09`）、主终点检查（`0x180ac0c66`）、Fear（`0x180ac0f35`）、Attract（`0x180ac102e`）；主终点检查若触发离场，会提前返回。控制器 Cursor 非空时，即使 `checkReached=false` 仍转发 Tick；DirectionCursor 先执行当前 Checkpoint.OnTick，随后才判断是否检查到达。

因此，“恐惧／吸引期间 Main 相对 WAIT 继续扣时”须限定 `moveCursor` 仍为 Main。若当前选用 Trace，这次 Tick 的时间与路点检查作用于 Trace，不能因 `checkReached=true` 就推断 Main 仍推进；Main 的相对 WAIT 不经该路径扣 dt。绝对时钟继续流逝也不自动使未被检查的主路点前进。

**N：** 普通 MoveState 的实际移动同样经 `_MoveByRoute` 取得 `get_moveCursor`（`0x180ac80fc`），再于 `0x180ac8121` 传给 `_MoveByCursor`；后者使用该参数，没有另取主 Cursor 作为另一推进对象。Fear／Attract 移动则优先使用各自控制器的 Cursor。故本次核对的普通移动与 Tick 两条链，都不能支持“Trace 控制期间 Main 仍经另一普通入口推进”的旧推论。主最终终点仍另取 `get_cursor` 独立检查，见第 5.1 节。本补核未运行游戏，也不排除特化子类、内容回调或 XLua 另行操作主进度。

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

### 5.1 终点检查与蓝门离场（2026-11-08 补核）

本节核对当前客户端普通 Enemy／DefaultGameMode 的静态分支，未运行游戏。准确方法、指令、枚举与版本见[定向离场批次](../evidence/route-exit-20261108/README.md)。

**N：** Enemy.OnTick（77845，`0x180ac09a0`）在 alive 分支取得主 Cursor，调用其 CheckReached（`0x180ac0c66`）。成立后，继续检查 rootTile 有效、Enemy.canNotExit 为 false，再调用 BattleController.CheckEnemyCanExit（`0x180ac0d96`）。DefaultGameMode.CheckEnemyCanExit（84172，`0x180c9c120`）普通非 XLua 分支直接返回 true。canNotExit 来自 Enemy 自身的 m_canNotExit（+0x420），不是 rootTile 的字段。

这条主终点路径没有读取 blocker 或阻挡关系，也不要求当前是 MoveState；不能将项目的“被阻挡时暂不离场”当作该普通原生路径的资格。rootTile 无效或禁止退出时不进入后续结束流程。

**N：** 资格通过后，同一次 OnTick 直接切换 Enemy 状态为 REACH_EXIT（枚举值 7，`0x180ac0e67`），随后调用 FinishMe，原因是 FinishReason.REACH_EXIT（枚举值 1，`0x180ac0e7a`）。在这条“主终点检查 → 退出资格 → 结束”普通调用链中，没有先保存独立的 Route completed 标志、待资格恢复后再消费该标志；资格未通过时，后续 Tick 仍从当前位置重新检查。这个结论限于本次已核对的路径，不证明客户端全局不存在其他完成状态。

**N：** Enemy.FinishMe 委托 Entity.FinishMe。后者确认 unfinished，写 finishReason，停止状态机并调用虚 OnFinish。Enemy.OnFinish 经 Unit／Entity 的清理与完成通知后，清理 Tile 关联、调用 ReleaseBlock，再在 REACH_EXIT 且非无害选项时调用 BattleController.OnEnemyReachedExit。默认模式读取 Enemy.lifePointReduce，取负后交 ModifyLifePoint 扣除关卡生命。原件分别在 `finish.json`、`lifecycle.json`、`settlement.json`。

DefaultGameMode.DestroyEntity 对 REACH_EXIT 使用 RecycleSelfWithDelay，逻辑结束不等于立即完成资源回收。Finished／Killed 计数与 Scheduler 等待集合分别依既有资格和销毁／回收通知处理，复用[案例 30 的生命周期结论](30-scheduler-action-data-fields.md#5-四个争议字段与退出账务)，本轮不扩展全部通知与回收链。

visitEveryCheckPoint=false 说明终点资格不只取决于指令索引；上述路径不保存独立 completed，不能为项目锁存标记或 Blocking 门槛背书。项目终点操作见 [Navigation／Route](../../architecture/navigation.md#运动目标与-main-出口)。

**2026-11-27 复核既有卫戍证据。** `AutoChessGameManager.OnEnemyRegistered` 在 Boss 战状态且 `IsBossEnemy` 成立的分支中调用 `Enemy.SetCanNotExit(true)`（`0x180bd65c2`）。这是登记阶段根据玩法设置退出行为的正例；未据此确认已经行动的单位需要在战斗中反复切换退出资格。 [既有原生消费者](../evidence/scheduler-general-20261107/preprocess/autochess-meta-consumers.json#L1668)

**2026-11-22 补核，内容可以直接请求出口结算。** 实际 OR-7（Act40Side_07）出生的思旧在默认模式用吸收光环为无谓／饮啄安装 `enemy_cjstel_absorb`。开始动作对被拾取者调用 `InstantKill`，实际配置为 `_markReachExit=true` 和 `_switchState=true`。普通 native 体 #99235 在 `0x181102858` 读取前者，进入 `0x18110287d..0x1811028b3`，把后者传给虚槽 95 的 `FinishWithReachExit`。Enemy 覆盖 #77832 切换到对应状态后，在 `0x180abbf26` 把 `REACH_EXIT=1` 传给 FinishMe。这条入口没有先查询被拾取者的几何终点。受害者的到达响应以及关卡扣血资格按各自消费者决定，常规完成／击杀／波次等待的区别仍见案例 30 和 39。此为实际配置和已存普通静态分支的交叉核对。 [绑定](31-route-operations-and-state.md#4-内容证据与可执行条件) · [模板](../evidence/route-operations-20261107/content/route-templates.json#L2589) · [InstantKill 原体](../evidence/resource-mechanisms-20261114/death-attributes/source-writers.json) · [FinishWithReachExit 原体](../evidence/route-exit-20261108/entry.json#L3241) · [PRTS 思旧](https://prts.wiki/w/思旧)

### 5.2 关卡生命值补核（2026-11-28）

**N：个体基础量。** Enemy.Init (#77782, 0x180abcb56) 调用 _AssignData (#77835)。后者读取 Enemy.options.unharmful（+0x538 首字节），为 true 时置 0，否则读取转换后的 LevelData/EnemyData.lifePointReduce（int，+0x50），于 0x180ac5963 写 Enemy 实例 +0x524。该字段有普通 getter/setter（#77639/#77640）；setter 的直接 E8/E9 候选为零，但已证初始化写入被内联，故不能据此否定其他内联写入或 XLua。尚未确认实际内容需要出生后动态重设 loss 或 unharmful。REACH_EXIT 且非 unharmful 才调用默认模式扣血；提前 MarkEnemyKilled 只更新完成／击杀账务并调用 DontCountAsFinished，不变更无害条件或此数值，不将统计资格作为扣血门槛。

**D：数值不是固定 1。** 固定敌人数据库中 m_defined=true 的 lifePointReduce 分布包括 0、1、2、3、5、10、15、30、50、999；简饲源石虫为 0、碎骨与霜星为 2。原始配置是实例初值来源，不等同于所有动态覆盖后的值。

**N/D：缺省值为 1。** 既有 `EnemyDatabase.GetComputedEnemyData` (#31938) 普通原生分支在 `0x182467e45` 向新建的 LevelData.EnemyData +0x50 写整数 1，随后执行 `ApplyDefinedData`；故各层均未定义 lifePointReduce 时保留 1，而不是采用未定义包装中的 m_value。实际关卡 `level_act1autochess_01` 的 `dragon` Branch 引用 `enemy_9012_acloon` level 0，无关卡覆写且 SPAWN 非无害；该敌人的 lifePointReduce 为 `m_defined=false, m_value=0`。[既有数据库折叠原体](../evidence/unit-classification-20261114/tags/database-folding.json#L4861) · [字段布局](../evidence/life-point-exit-20261128/enemy-data-type.json#L704) · [现有敌人样本](../../../test/fixtures/arknights/enemy_9012_acloon.json#L163) · [现有关卡样本](../../../test/fixtures/arknights/level_act1autochess_01.json#L4391)。

**N：实际全局结算。** ModifyLifePoint (#65601) 构造含整数值、来源、玩家侧的生命点 Modifier，isReachExit 为真时设 shared flag 0x200。_ApplyGlobalModifier（0x180663d30）先调用玩法的 OnApplyingGlobalModifier，再进入 _DoApplyGlobalModifier (#65794)。后者在有来源时先调用来源 OnOutputModifier（0x1806653cb），再检查 isCancelled（0x1806653ea）；取消不写资源。生命点分支取 RoundToInt(finalDelta)（0x18066572c），负值先由临时生命抵消（0x1806657d2–0x180665879），余量才交 SetLifePoint。普通 SetLifePoint (#65546) 将非正值置零，没有将正值上限截为 maxLifePoint 的分支。正值且允许临时生命 flag 时改写临时资源。realDelta（0x180665909）仅为普通生命写入后减写入前，因此护盾完全抵消时 realDelta 为 0。实际负值按 0x200 标志分别累计敌人出口／其他损失（0x180665966 后分支），再在有实际来源时调用 Entity.OnAppliedModifier（0x180665df9）。这些事实不要求项目采用原生 Modifier 的具体类型或通用 Hook。

**D/N：玩法与内容正例。** 萨米肉鸽 rogue_4_relic_encounter_3 配置 level_life_point_modify_scale=2，描述限定在诡谲断章生效且损失翻倍。RoguelikeGameMode.OnApplyingGlobalModifier 转给 Manager，后者 #87465 在 0x180d92228 检查 LIFE_POINT、0x180d922c6 检查 deltaType==2，再将 value 改为 RoundToInt(value × scale) + addition（0x180d92325–0x180d92384），在临时生命抵消之前修改请求，不专门依赖是否出口。普通 DefaultGameMode 的前置及后置回调普通 native 分支无实际修改。另有不经过出口的独立 ModifyLifePoint 模板（如乌萨斯平民 upeople_t 的 ON_OWNER_KILLED），以及额外出口扣血模板 extra_life_point_on_exit 和增加临时生命的模板 heyak_e_004_t_life；肉鸽 rogue_1_band_1 / q08 / q09 有关卡初始临时生命增加配置。

**D：不能把所有额外扣减都解释成前置拦截。** rogue_1_relic_c16 绑定 rogue_1_encore_first_life_point_reduce 模板；该模板的 ON_APPLIED_MODIFIER 分支筛 LIFE_POINT 的 realDelta < 0、检查共享首次标记，复制实扣 delta 然后另行 ModifyLifePoint。因此单看这条结算后分支，护盾全抵不会触发该条件。另有独立 ON_OWNER_REACH_EXIT 分支，读取个体 lifePointReduce，要求非 unharmful、值大于 0、首次标记未设，随后发起额外出口扣减；它没有检查 realDelta 或护盾。不能据第一条分支宣称整个内容在护盾全抵时都不会触发；本批未进行该双入口的实机时序验证。配置模板显式 LIFE_POINT 选择的扫描没有发现 ON_OUTPUT_MODIFIER 专用于该值的模板，未穷尽通用节点、其他资源和 XLua。

[定向原件、版本及复跑方法](../evidence/life-point-exit-20261128/README.md)。

## 6. 末段跟踪的偏移

**N：** 原生 MoveCheckpoint.GetNextDirection（70190）在安全 next 格已经指向路点目标格时，就将本次已采样 offset 加入 next 位置后求方向；不要求当前格先进入目标格。位置计算与分支见 `0x1808a03f3..0x1808a0437`。[末段方向](../evidence/route-movement-20261018/70190.asm)

原生末段偏移会在 next 指向目标格时参与，不只在当前格已经是目标格时参与；项目由 Route 将后继格转换为连续运动目标，见 [Navigation／Route](../../architecture/navigation.md#运动目标与-main-出口)。

## 7. 证据边界

路点时间更新、根据位置／可达性推进和实际移动有独立调用点；推进 Checkpoint 不能等同额外消费一次运动预算。尚未穷尽状态机子类、TracePositionCursor 在特殊短距布局中的预测、活跃 XLua 和所有状态切换的帧边界，没有进行游戏现场轨迹验证。

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

2026-11-22 对固定镜像的 3,944 份关卡复扫，在 `extraRoutes` 找到 48 条首项 DISAPPEAR 和 72 条首项 APPEAR，普通正数 SPAWN 的 `routes` 引用没有命中这两项。额外路线实际由什么业务选择、该业务何时执行以及谁依赖登记前的通知，仍需具体见证。 [关卡扫描](../evidence/route-content-necessity-20261122/README.md)

### 对后续设计的约束

首路点进入可能包含随机采样、位置写入和同步业务，不能把“构造 Route State”和“进入首路点”混成纯字段初始化，也不能未经判断统一推迟到首个移动 Tick。原生两层登记及类方法顺序不是项目必须照搬的结构；应据实际观察语义决定完整创建／Enter 的边界。非默认使用尚未闭合的部分继续保留为调查缺口，不据此提前扩大公开接口。

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
