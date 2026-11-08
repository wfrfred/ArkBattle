# Cursor 推进接收者补核

2026-11-08。纠正将 `Enemy.OnTick` 中的 `get_moveCursor` 误认成 `get_cursor`、进而声称 Trace 仍推进 Main 的结论。这里只核对普通静态移动与 Tick 调用链，机制结论维护于[案例 13](../../../../cases/13-route-and-movement-timing.md#31-临时控制的实际-tick-接收者2026-11-08-补核)和[案例 31](../../../../cases/31-route-operations-and-state.md#32-时间偏移运动方式和控制归属)，不决定项目推进接口。

## 来源与材料

Windows x64、metadata v29，与父批次相同客户端：

- GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

| 材料 | 范围 |
| --- | --- |
| `selection.json` | 从父批次 `temporary/native.json`、`content/enemy-type.json`、`cursor/state-bodies.json` 选择准确虚槽、字段和调用片段。记录输入 SHA-256 及选择脚本身份，不伪装成新反编译。 |
| `move-bodies.json` | 当前版本 `Enemy._MoveByRoute`、`Enemy._MoveByCursor` 的全部连续 `.pdata` 片段。前者 2 片段，后者 5 片段，止于下一已知方法；复用已有提取器，保留其 provenance。输出中的 `relatedMethods` 是该提取器附带的 EP 名称检索结果，本次不据此作结论。 |

## 接收者定位

当前 x64 vtable 入口基址为类型对象 `+0x140`，每槽 16 字节。metadata 声明 `get_cursor` 为 slot 225，对应 `+0xf50`；`get_moveCursor` 为 slot 226，对应 `+0xf60`。不能只看同为 DirectionCursor 的返回类型就把二者混同。

- `Enemy.OnTick` 在 `0x180ac0b61` 读取 `+0xf60` 并在 `0x180ac0b6f` 调用，`0x180ac0c09` Tick 该返回值。随后 `0x180ac0c25` 读取 `+0xf50`，`0x180ac0c66` 单独检查主 Cursor 最终终点。
- `get_moveCursor` 在普通存活且 `usingTraceCursor` 成立时返回 `m_traceTargetCursor`（`+0x390`）；否则经 `get_cursor` 返回 `m_cursor`（`+0x370`）。Trace Cursor 可以在此惰性创建。
- 普通 `MoveState` 分支在 `0x180ae560e` 读取 `+0x1020`，对应 slot 238 `_MoveByRoute`。后者在 `0x180ac80fc` 同样取 `get_moveCursor`，在 `0x180ac8121` 将其传给 `_MoveByCursor`。后者仅沿传入的 Cursor 预测／查询运动，没有另取主 Cursor 来推进。
- Fear／Attract 移动分支优先使用各控制器 `+0x20` 的 Cursor；尚不存在时回退到 `get_moveCursor`，见 `0x180ac82c6–0x180ac831e`、`0x180ac81c6–0x180ac821a`。

## Tick 与检查条件

以下为普通 alive 分支的顺序；若主终点检查触发离场并提前返回，后续控制器不再经本次调用推进。

| 接收者 | 调用点 | `checkReached` |
| --- | --- | --- |
| `get_moveCursor()` 的返回值 | `0x180ac0c09` | `!isFeared && !isAttracted` |
| FearController | `0x180ac0f35` | `isFeared` |
| AttractController | `0x180ac102e` | `!isFeared && isAttracted` |

FearController 与 AttractController 的 OnTick 共享 `0x180ad4bd0` 正文；调用者分别从 Enemy `+0x3e0`、`+0x3e8` 取得接收者。该函数在控制器 Cursor 非空时转发 `DirectionCursor.OnTick`，不能凭共享地址认定两次都操作同一种控制器。

`DirectionCursor.OnTick` 在 `0x1808d2879` 先调用当前 Checkpoint.OnTick，`0x1808d287b` 才判断 `checkReached`，成立且到达后于 `0x1808d28a3` 调用 `_MoveNext`。因此 false 只关闭这次到达推进，不关闭当前路点的 Tick。`WaitForSecondsCheckpoint.OnTick` 在 `0x1808e4478` 扣 dt，`0x1808e44a8` 写回截零后的剩余时间。

这区分了两种情况：未选用 Trace 时，Fear／Attract 可以让主 Cursor 收到 `checkReached=false` 的 Tick，主相对 WAIT 仍扣时；选用 Trace 后，上述首个 Tick 接收者是 Trace，Main 不由这条路径扣 dt 或跨路点。绝对时钟继续流逝不等于 Main 自动推进，但主终点检查仍独立执行。

Fear 与 Attract 各有多来源登记及一个共享当前 Cursor，并非每 Buff 一 Cursor。来源登记顺序、有效项回退和临时路线重建不等于多个 Cursor 同时推进；本次不补证容器泛型 helper 的精确命名。

## 复跑与限制

从仓库根目录执行，输出到独立路径：

```sh
python3 docs/research/evidence/route-operations-20261107/temporary/advance-selection-20261108/select_evidence.py \
  --out .cache/native-research/advance-selection-replay/selection.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/advance-selection-replay/move-bodies.json \
  --method Torappu.Battle.Enemy._MoveByRoute \
  --method Torappu.Battle.Enemy._MoveByCursor
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/route-operations-20261107/temporary/advance-selection-20261108
```

未运行游戏或核验活跃 XLua。结论限于所列普通 Enemy、MoveState 与 Cursor 方法，不证明任意子类、内容回调或其他入口都不能改动 Main。没有复查全部追踪创建与结束消费者，也不将该事实纠错直接转换为项目的暂停时钟政策。
