# 5-2 跨格路点和敌人冲撞资格

2026-11-22。机制结论见[案例 12](../../cases/12-navigation-native-algorithm.md#10-实际路线中的跨格-move)与[案例 15](../../cases/15-locomotion-native-semantics.md#水手重艇与凶豕兽的冲撞)。本批检查普通客户端分支、固定 JSON 和实际安装资产。实机移动轨迹、现场 XLua 执行与同帧触发先后不在取证范围。

- [config.json](config.json) 保存 5-2 路线 29、路点相邻格、两处出怪、三个 Prefab 及相关组件。关卡取固定数据镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e`。从基础资产 `26-10-20-11-10-38-04170990` 读取对应敌人组件，同时检查本机更新 `26-11-13-06-34-18-84612175` 的同名资源。两版 Holder 的三个选定模板均保留事件动作及组件／对象指纹。
- [native.json](native.json) 是当前 Windows x64 安装版的选择性反汇编与字段。GameAssembly SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，global-metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。保留了路点格输入、末段偏移、Bresenham 包围矩形检查以及冲撞条件和推拉切换的指令。
- [project-compare.json](project-compare.json) 使用项目自身 Navigation 和固定 5-2 地图对照构场输入。从前一固定目标开始比较下一追踪点。以 `Route` 指令和原生目录中的 SPFA 证据另行确认原生构场输入。

## 复跑

从仓库根目录运行。

```sh
batch=docs/research/evidence/route-crash-20261122
work=$(mktemp -d)
export UV_CACHE_DIR="$PWD/.cache/uv"
python3 "$batch/extract.py" --out "$work/config.json"
uv run --offline --with 'capstone==5.0.7' python \
  docs/research/evidence/forced-motion-20261118/collision/extract_ranges.py \
  --out "$work/full.json" \
  --index 71327 71328 71331 71338 71474 71482 71483 71504 71526 77672 77748 77750 94015 94018 101641 101644 \
  --select 'Torappu.Battle.Enemy.get_isUnbalanced' \
  --fields 'Torappu.RouteData' 'Torappu.RouteData/CheckpointData' 'Torappu.Battle.Enemy/States/Blackboard' \
  'Torappu.Battle.BObject' 'Torappu.Battle.BasicCursor/Checkpoint' 'Torappu.Battle.BasicCursor/MoveCheckpoint'
python3 "$batch/select-native.py" "$work/full.json" --out "$work/native.json"
npm run build
node "$batch/compare.mjs" > "$work/project-compare.json"
```
