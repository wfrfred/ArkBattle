# Map 与路线导航调用者

2026-11-07。保存当前 Map 路线集合维护、地块更新、导航刷新及两个机制使用者的原件。结论由[案例 31](../../../cases/31-route-operations-and-state.md)集中维护。

## 来源与材料

Windows x64、metadata v29；GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，global-metadata.dat SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。完整指纹、selector 与工具身份在各 JSON provenance。

- `native.json`／`query.py`：12 个完整名称选择器及全部名称含 PathMotionMode 的方法，实际 15 个方法正文；同次读取各入口的直接 E8／E9 候选，共 40 条。候选同时保留指令 VA 和邻近方法身份，不把字节匹配本身当调用证明。
- `consumer-bodies.json`：Tile.RewriteOptions、TryUpdateOptions、HiddenAreaManager._ShowHiddenArea、Mainline15PrtsManager.TryNextSubAction、PrtsMoveSubAction.StartAction、LhshipRouteManager._UpdateLhshipRoutes 的完整连续片段；用于回查实际调用指令。
- `process-routes.json`：Map._ProcessRoutes 的非泛型正文，使用当前 index 71136 提取。另一个同名 metadata 方法 address=0，不能用名字相同替代其方法身份。
- `lhship-data.json`：镜像 `Kengxxiao/ArknightsGameData` 固定修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，从完整 enemy_database.json 选取 `enemy_18001_lhship`。输入路径、SHA-256、选择器及无错误完成标志在 provenance／result。该条目只确认运输汽艇身份，不证明实际出生或组件绑定。
- `community-sources.json`：本轮 PRTS 导航记录与限量摘要；P 级，不替代本机配置或可执行条件。

本目录的直接候选还涉及 AutoChess 存档加载、EnemyDuel、Cooperate 船体偏移、Act38／Act46 等来源。候选所属类型不自动决定项目支持范围；只有本轮实际展开的消费者才作为状态判断依据。运输汽艇属于次生预案的内容来源，不能仅据英文缩写认作生息演算；本批没有为其补齐完整装卸机资源链。

## 复跑

从仓库根目录运行，独立输出：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/route-operations-20261107/navigation/query.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-replay/navigation.json
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/route-operations-20261107/navigation \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-replay/navigation
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels/enemydata/enemy_database.json \
  --source-url https://github.com/Kengxxiao/ArknightsGameData \
  --revision 63c7cec73c3858d0ae913f85cc89af3cef4d744f --preview 0 \
  --out .cache/native-research/route-operations-replay/lhship-data.json \
  select '/enemies/*' --where /Key '"enemy_18001_lhship"'
```

正文提取边界为连续 `.pdata` 片段至下一已知方法，可能含填充；`process-routes.json` 使用共享工具声明的单 `.pdata` 边界。未执行游戏、未验证活跃 XLua；无直接候选不排除虚调用、委托或反射。
