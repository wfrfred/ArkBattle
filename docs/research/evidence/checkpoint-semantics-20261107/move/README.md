# MOVE 参数与有限配置样本

2026-11-07。范围：MOVE 的 reachOffset、randomizeReachOffset、reachDistance，以及两个直接引用非零 reachOffset 的主线 SPAWN。这里只登记来源、选择范围和复跑；机制结论由上层案例维护。

## 来源与原件

本机客户端 GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，metadata v29。普通静态原生分支，未运行游戏或确认 XLua 实际绑定。

- `native-bodies.json`：当前 MoveCheckpoint.OnBegin、get_targetPos、两项 CheckReached，以及 MathUtil.CheckDistance 的精确签名和完整连续片段。
- `checkpoint-data-type.json`：当前 CheckpointData 字段及原生偏移。
- `reach-distance-floor.json`：CheckReached(Vector2) 在 `0x1808da836` 读取的 float 常量原始字节。
- `random-vector-body.json`：RandomExtensions.RandomVector2 两重载和 `0x1808cb670` 分派 helper 的首片段。
- `fear-and-random-continuations.json`：FearController._InitializeFearRouteData，以及上述 helper 的延伸分支。
- `random-wrapper-body.json`：BattleRandomWrapper／AutoChessRandomWrapper 的 RandomVector2 重载及 helper 剩余分支；类型分派不等于调查其他模式的随机政策。
- `random-constants.json`：`0x1870adda0` 的 176 字节，包含 Fear 参数缩放常量和 RandomVector2 浮点取负掩码。
- `config-summary.json`：共享配置选择器的有限样本统计、源 manifest 校验和两组完整 Route／SPAWN 见证。
- `profile.py`：读取共享 selector 结果、逐文件复核 Git blob SHA-1，并生成上述有限统计与见证。不替代配置选择器。

配置复用[Scheduler 来源清单](../../scheduler-general-20261107/config/sources.json)：`Kengxxiao/ArknightsGameData` 固定提交 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` 的 82 份完整关卡缓存，按该清单的 unsupportedModeControl 排除三份 sandbox 对照后为 79 份。此集合原为 Scheduler 调查选取，不是全量关卡样本，也不与客户端版本自动等同。

首路点检查仅遍历这些完整源文件的 routes／extraRoutes；具体类型分布和匹配结果保存于 summary。当前未找到的非默认值与首即时指令，只能作为有限范围的证据缺口，不证明客户端全局没有消费者。

## 复跑

源缓存存在时，从仓库根目录执行；缺失时按上述 source manifest 的固定 URL 重取并验证 Git blob，不替换为默认分支：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/scheduler-general-20261107/levels --glob 'level_*.json' \
  --source-url https://github.com/Kengxxiao/ArknightsGameData \
  --revision bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d \
  --out .cache/native-research/checkpoint-semantics-20261107/move/checkpoints.json \
  select '/**/checkpoints/*'
python3 docs/research/evidence/checkpoint-semantics-20261107/move/profile.py
```

完整方法使用已有共享片段提取器，选择器见各 JSON 的 `result.bodies[].selector`；helper 的所有分支按所记录 VA 延伸，不用首个 `.pdata` 片段声称完整：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/checkpoint-move-replay.json \
  --method Torappu.Battle.BasicCursor/MoveCheckpoint.OnBegin \
  --method Torappu.Battle.BasicCursor/MoveCheckpoint.CheckReached \
  --method Torappu.Battle.BasicCursor/MoveCheckpoint.get_targetPos \
  --method Torappu.MathUtil.CheckDistance
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/checkpoint-semantics-20261107/move
```

类型使用 `native.py type Torappu.RouteData/CheckpointData`；两处常量按实际格式重提：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/checkpoint-floor-replay.json \
  read 0x1870aed7c --format '<f'
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/checkpoint-random-constants-replay.json \
  read 0x1870adda0 --size 176 --format '<44I'
```

配置引用可证明内容配置了这条路线，不能替代游戏现场执行观察。未发现某个开关的非默认样本时，不把原生分支存在或当前 Data 丢弃字段当作 Core 必须公开该开关的证明。
