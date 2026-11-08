# 莱塔尼亚召唤物：追踪与停走

本目录核对 `enemy_9025_aclts`、`enemy_9026_acltm` 实际 Prefab 挂载的移动程序。配置原件见 `../content/prefabs.json`；这里保存其消费代码，不把静态配置当作实机观测。

## 来源与复跑

- 当前本机 `GameAssembly.dll`：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29、Windows x64。
- `native.json`：本轮重提 Enemy 状态、作战目标、Selector、GridPositionRange 的完整声明方法与元数据，31 个 body；不以方法名称代替实现核对。
- `trace-native.json`：从同 DLL／metadata 的 `route-operations-20261107/temporary/native.json` 选取 70 个既有完整 body，保留原 provenance 并补来源与选择脚本哈希；不是一次新的客户端提取。
- 新 Prefab 来自当前热更资源，确切资源指纹与对象身份由 `../content/` 记录。未运行游戏或解执行中的 XLua 热更；结论限定于已核绑定和正常原生分支。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/leithanien-summons-20261109/movement/extract_movement.py \
  --out .cache/native-research/leithanien-summons-20261109/replay-movement.json
python docs/research/evidence/leithanien-summons-20261109/movement/select_trace.py
```

## 已核事实

| 问题 | 直接证据 |
| --- | --- |
| 采用哪种移动控制 | 两个 Prefab 的 UnitMode 明确登记 `EnemyTraceTargetByPriorityAbility`，不是自定义 Enemy 子类。该能力 `OnAttached[95575]` 调用 Base.OnAttached[95255]，登记为宿主的追踪能力；能力与 Enemy 共用 TracePositionCursor（`get_tracePositionCursor[95560]`）。 |
| 追谁 | Trace 的 GroupSelector 和子 Selector 均挂 GlobalRange；子项 `targetSide=2`（ENEMY）、`targetMotion=1`（WALK_ONLY）、`postFilter=4`（HATRED_DES），最多一项。`_DoFindTargetByPriority[95581]` 使用该 Selector 返回的首项登记追踪。这里不是“追最近敌人”：DIST_TO_SOURCE_ASC 的枚举值是 11。 |
| 追踪路线如何变 | `_UpdateTraceTargetRoute[95591]` 正常分支把目标的 rootTile 交给 `RegisterTraceTile[95263]`。同一目标跨格、路线运动方式变化等由这条既有 Trace 程序重建运行路线；本例随机偏移为零。 |
| 与出生路线的关系 | 召唤配置创建 WALK、无终点、999 秒 WAIT 的主路线，见 `../content/`。Enemy 的 `_MoveByRoute[77800]` 通过 slot226 `get_moveCursor` 取得当前运动 Cursor；Trace 可用时使用 TraceCursor，不需要改写那条主路线。Enemy.OnTick[77845] 推进的也是 slot226，slot225 主 Cursor 另用于终点检查。 |
| 进入攻击范围是否结束追踪 | Prefab 的 `dontMarkReachedByInAttackRange=true`，跳过 `_CheckCurrentTraceTarget[95584]@180fe6f27` 和 `_UpdateTraceTargetRoute[95591]@180fe7c86` 的“射程内即标记追踪到达”分支。它不绕过普通 Enemy 作战状态机。 |
| 自己阻挡目标后会不会继续走 | `MoveState.OnTick[77972]@180ae54d0` 先检查自身 blocker；随后 `@180ae5525` 调用 TryGetCombatTargetBlockee。任一成立便切入 State3=COMBAT，未进入后面的移动分支。 |
| “有阻挡目标”的具体含义 | `TryGetCombatTargetBlockee[77859]` 要求 canBlockEnemies，再调用 BlockManager.TryGetCombatTarget[78516]；后者按阻挡列表取首个 alive 且非 invincible 的目标。alive 由 Entity slot40 对应，不由方法名猜测。不能扩大为“任意已阻挡对象，包括无敌对象，都必定停走”。 |
| 作战目标从哪里来 | CombatWrapper.GetTarget[78191] 优先返回自己的 blocker；没有时从自身 BlockManager 取上述目标。与全场 Trace 的优先级选择分开，因而可能与当前追踪目标不同。 |
| 普通攻击如何停走 | 没有上述阻挡目标时，MoveState 再调用 `_SearchAttackTarget[77808]`；成功切入 State2=ATTACK，不执行移动。两个 Prefab 的 Attack／Combat 均使用 BlockedOrAdvancedSelector。其 DoFindTargets[75741] 先添加合资格的已阻挡目标，数量不足才走普通范围搜索。 |
| 何时继续走 | AttackState.OnTick[77976] 等待攻击结束后返回 MOVE；CombatState.OnTick[78013]、CombatWrapper.NextCombatOrExit[78192] 在没有作战目标且相应攻击时间到后回 MOVE。这些普通 Attack／Combat 分支不调用移动。不能推断强制位移也因此被禁止。 |
| 没有目标时 | Priority.OnTick[95579] 走 DefaultTileSelector，输入为 owner.mapPosition。该 Selector 挂 GridPositionRange，配置只有相对 `(0,0)`。GridPositionRange.FindTiles[75353] 先将输入位置转为格坐标（`@1809fd847`），再加每个配置偏移（`@1809fd8eb`），所以选的是自身当前格，绝不是地图固定原点或全场随机漫游。候选还要通过 Selector 的通行／地势等配置；有候选时登记该格，无候选时不新增追踪地块。 |

### 关键虚槽

当前类型元数据与指令一起保存于 `native.json`／`trace-native.json`：

- Entity slot40 = `get_alive`，Enemy slot52 = `get_rootTile`。
- Enemy slot225 = `get_cursor`（主路线），slot226 = `get_moveCursor`（实际运动控制），slot238 = `_MoveByRoute`。
- BaseTrace slot103 = `get_usingTraceCursor`，slot105 = `get_traceTarget`，slot106 = `set_traceTarget`，slot107 = `get_tracePositionCursor`，slot108 = `get_hasTraceTarget`。Priority 重写 slot107，其余沿用 Base。
- `get_hasTraceTarget` 要求目标存在且 alive、追踪地块存在；`get_usingTraceCursor` 可由有效追踪目标或仍登记的追踪地块成立。

## 限制

这里没有重新测定移动速度、近战半径、仇恨具体数值公式，未观察目标不可达时的实机搜索时间，也不把 Prefab 的默认 1／5 秒搜索配置当作未经 Blackboard 覆盖的最终运行值。阻挡关系维持、阵营、阻挡数和属性数值由本批其他证据分别核对。
