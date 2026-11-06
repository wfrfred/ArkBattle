# Route 的 ALERT 与 PATROL_MOVE

调查日期：2026-11-06；项目与工具基线 `2acf4c9`。补充[案例 13](../../cases/13-route-and-movement-timing.md)，只核对警报路点的直接程序，以及巡逻路点选择后继的规则。

## 来源与范围

PRTS [作战机制·路径检查点](https://prts.wiki/w/作战机制)查阅于 2026-11-06：说明巡逻点会重复经过；将 ALERT 的用途表述为可能用于多维合作下层警告特效。页面没有给出巡逻段边界，也没有闭合 ALERT 的实际调用，因此补查官方 Windows 客户端。PRTS 是社区资料。

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

Windows x64、metadata v29、image base `0x180000000`；共享 `native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`，Python 3.14.8、Capstone 5.0.7。JSON 保留实际提取的 provenance，仅按本问题选取完整方法、必要区间和字段，未改写指令。

结论限定普通 native 分支。`BasicCursor._MoveNext` 和 route getter 保留 XLua 分支；本次没有确认运行时委托是否装载，没有执行游戏，也没有穷尽特殊 Cursor 子类。

## 材料

- `native-alert.json`：AlertCheckpoint.CheckReached（71388，`0x18053d7a0`）恒返回 true；OnBegin（71390，`0x1808cc0f0`）及连续区间 `0x1808cc1e1`、`0x1808cc24b`。完整普通路径检查 owner、当前格并取得 Tile，随后在 `0x1808cc230` 调用 `BattleController.PlayAudioAtPos`，在 `0x1808cc274` 调用 `BattleController.CreateEffect`，返回前没有设置警觉／战斗行为状态。
- `native-patrol.json`：PatrolMoveCheckpoint.IsValidPatrolCheckPoint（71340，`0x1808dbad0`）、OnTick（71341，`0x1808dbdf0`）、NextCursor（71342，`0x1808dbb00`）；基类 Checkpoint.NextCursor（71323）与 BasicCursor._MoveNext（71303）的入口、普通主体和 XLua 尾跳转。
- `fields.json`：BasicCursor、Checkpoint、MoveCheckpoint、PatrolMoveCheckpoint、AlertCheckpoint、CheckpointData 与 CheckpointType 的本次布局。`m_checkpoints` 为 Cursor + `0x28`，Checkpoint.data 为 + `0x10`，data.type 为 + `0x10`；Patrol 的 `m_loopCursor` 为 + `0x38`。
- `archive.json`：本批材料哈希、输入指纹及可复查选择器。

关键分支：

- `NextCursor` 的 `0x1808dbc0c..0x1808dbc14` 检查下一项：`type - 1 <= 9` 时返回 `current + 1`。
- 否则 `0x1808dbc1a..0x1808dbc9c` 从 `current - 1` 向前扫描相同的合法范围，回到连续段最早的前置项；没有前置合法项则仍返回 `current + 1`。
- `0x1808dbb49..0x1808dbb5c` 存在单个 PatrolCheckpoint 的重复切换计数保护：当前计数大于 50 时记录错误并前进；OnTick 重置该计数。它不是 Route 每 Tick 的通用推进额度。
- `_MoveNext` 普通主体在 `0x1808cd7fe` 以虚槽 12 调用当前 Checkpoint 的 NextCursor；`0x1800053c0` 的分派辅助程序确认该槽的实际跳转。Patrol.NextCursor 的 metadata slot 为 12。新检查点随后在 `0x1808cd9d0` 执行 slot 10 的 OnBegin。因此上述后继选择确实接入 Cursor 推进，不是未调用的辅助函数。

## 复跑

从仓库根目录运行；依赖未缓存时去掉 `--offline`。所有 index 与地址均来自本次指纹，客户端更新后先重新定位，不能直接套用。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
work=.cache/native-research/route-alert-patrol-replay
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/probe.json" probe
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/locate.json" search 'BasicCursor'
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/methods.json" disasm 71303 71323 71340 71341 71342 71388 71390
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/move-next-body.json" disasm-at 0x1808cd793
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/move-next-hotfix.json" disasm-at 0x1808cd9e2
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/virtual-dispatch.json" disasm-at 0x1800053c0
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/alert-body.json" disasm-at 0x1808cc1e1
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/alert-tail.json" disasm-at 0x1808cc24b
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/patrol-fields.json" type 'Torappu.Battle.BasicCursor/PatrolMoveCheckpoint'
uv run --locked --offline "$skill/scripts/replay.py" docs/research/evidence/route-alert-patrol-20261106 --out "$work/registered"
```

其余字段同样使用 `type` 加上述完整类型名复查。`replay.py` 自动复查登记的方法和类型；独立区间按显式 `disasm-at` 命令读取。PE `.pdata` 会将 OnBegin／_MoveNext 分割为数个范围，单个入口的 `fullyDecoded=true` 不代表已经覆盖完整逻辑方法。
