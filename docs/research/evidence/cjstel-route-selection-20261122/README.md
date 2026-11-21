# 思旧的关卡路线配置

2026-11-22 核对 Kengxxiao/ArknightsGameData 固定提交 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 23 份 `gamedata/levels/activities/act40side/level_*.json`。每份输入的 SHA-256、匹配的分支和字符串引用 Pointer 见 [result.json](result.json)。

扫描匹配 6 份关卡中的 18 个 `cjstel_move_N` 分支。每个分支只有一个 Phase、一个 SPAWN 条目。17 次同名字符串引用均位于 enemyDbRefs 的参数中，所选关卡 JSON 中没有引用这些名称来执行出怪的动作。固定 OR-7 的五个分支分别提供下标 2–6。扫描没有展开关卡的运行时程序和动态字符串组合。拾取后换路见 PRTS 的社区记录，吸收模板与原生路线读取复用此前取证。 [思旧](https://prts.wiki/w/思旧) · [实际绑定](../route-operations-20261107/content/README.md#内容链的证据强度) · [原生游标](../scheduler-general-20261107/lifecycle/branch-route-cursor-note.md)

从仓库根目录用下列命令复跑。

```sh
python3 docs/research/evidence/cjstel-route-selection-20261122/inspect_routes.py \
  assets/arknights-game-data/zh_CN/gamedata/levels/activities/act40side \
  --out /tmp/arkbattle-cjstel-route-replay.json
cmp /tmp/arkbattle-cjstel-route-replay.json docs/research/evidence/cjstel-route-selection-20261122/result.json
```
