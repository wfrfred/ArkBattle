# 关卡生命点与临时生命结算

取证日期：2026-11-28。Windows 客户端 DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，与既有 route-exit 批次相同；原件各含 provenance。静态无热更新分支证据，不是实际运行记录。

- `search.json` / `bodies.json`：按 LifePoint 搜索，提取 BattleController 的常规、临时生命接口、Modifier 创建、Rune 预处理、Roguelike 修改和 Action node。
- `trace.json`：资源字段、_ApplyGlobalModifier、默认生命归零及显示的后继分支；`settle.json`、`settle-branch.json`：_DoApplyGlobalModifier #65794，入口和 0x180665328 主后继。
- `side.json`、`mode.json`、`manager.json`、`manager-branches.json`：PlayerSide 枚举、AutoChessGameMode、AutoChessGameManager 和实际退出状态管理的后继。单看入口的 pdata 边界会截断重要逻辑，因此另附后继。领袖轮全部跨场状态结算未追尽。
- 社区材料：2026-11-28 检索 [集成战略·基本状态值](https://prts.wiki/w/集成战略)、[水月与深蓝之树](https://prts.wiki/w/水月与深蓝之树)、[岁的界园志异](https://prts.wiki/w/界园)、[卫戍协议帮助](https://prts.wiki/w/卫戍协议/帮助)、[卫戍协议：盟约](https://m.prts.wiki/w/卫戍协议：盟约)。社区材料用于模式文义，不代替原生静态结算。网页修订号本批未取得；不声称固定历史版本。

复跑（从仓库根，保持相同客户端）：

```sh
skill=.agents/skills/arkbattle-native-research
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
mkdir -p .cache/native-research/life-point-20261128
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked "$skill/scripts/native.py" --game "$game" --out .cache/native-research/life-point-20261128/search.json search LifePoint
uv run --offline --locked "$skill/scripts/native.py" --game "$game" --out .cache/native-research/life-point-20261128/bodies.json disasm 65543 65545 65546 65547 65548 65549 65550 65551 65601 65602 84094 87466 87074 87075 87078 87079 98839 98842 72190
uv run --offline --locked "$skill/scripts/native.py" --game "$game" --out .cache/native-research/life-point-20261128/settle.json disasm 65794
uv run --offline --locked "$skill/scripts/native.py" --game "$game" --out .cache/native-research/life-point-20261128/settle-branch.json disasm-at 0x180665328
for script in trace side mode manager manager-branches; do
  uv run --offline --with capstone==5.0.7 python "docs/research/evidence/life-point-20261128/$script.py"
done
```

结论集中见 [Case 37](../../cases/37-resource-mechanism-coverage.md#6-关卡生命点与临时生命)。
