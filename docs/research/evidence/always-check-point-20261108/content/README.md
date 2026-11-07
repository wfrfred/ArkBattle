# alwaysCheckCurrentPoint 的实际内容配置

2026-11-08。将同批 Prefab 扫描中 `_alwaysCheckCurrentPoint=true` 的三个实体，绑定至固定 EnemyData、普通关卡实际 SPAWN 与 MOVE 路线。字段值、Cursor 构造／重建由同批其他目录取证；本目录不推导接口或修改实现。

## 来源与选择

公共数据镜像 `Kengxxiao/ArknightsGameData` 固定修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。脚本检查 `obt/**/*.json`、`activities/**/*.json` 与该修订 Git tree 的完整路径集合相同，逐份验证全部 4,025 个 JSON 的原始 Git blob SHA-1；EnemyData 原始文件也核对固定 Git blob。输出记录输入 SHA-256、bytes、原文 Pointer、脚本指纹和路径／Git blob 清单摘要。

`content.json` 只保存三个实体的必要身份字段、全扫描汇总和三个最小完整正例，不展开所有出生记录。`community.json` 保存名称／普通玩法的社区核对。PRTS 不用于证明 Prefab 字段或原生调用。

| Prefab／EnemyData key | 固定名称 | 最小关卡证据 | 路线 |
| --- | --- | --- | --- |
| `enemy_10163_mnctur` | 帕拉杜利斯 | `activities/act48side/level_act48side_07.json`，`/waves/0/fragments/2/actions/0` | `/routes/6`，MOVE、WAIT 及后续 MOVE |
| `enemy_10163_mnctur_2` | 神勇的帕拉杜利斯 | `activities/act48side/level_act48side_ex03.json`，`/waves/0/fragments/0/actions/0` | `/routes/0`，四个 MOVE |
| `enemy_2137_shsdgo` | 猎犬proto | `obt/roguelike/ro6/level_rogue6_c-7.json`，`/waves/0/fragments/3/actions/0` | `/routes/28`，MOVE → WAIT |

三项均为主 Wave 的正数 SPAWN、无 hiddenGroup、无随机组／随机包、`randomType=ALWAYS`，不是只在 EnemyDbRefs 出现、零数量或预览 Cursor；相应 EnemyDbRef 与完整路线保存于摘录。这样可以确认这些具备普通 MOVE 的实际内容配置使用相应实体，而非以没有任何移动路点的配置充当需求。

扫描汇总按 **SPAWN 条目**计数，不是实际生成数量：

| 实体 | 全目录 SPAWN 条目／文件 | 严格直接主线条目／文件 | 其中具备 MOVE／PATROL_MOVE 的条目 |
| --- | --- | --- | --- |
| 帕拉杜利斯 | 10／2 | 10／2 | 10 |
| 神勇的帕拉杜利斯 | 39／8 | 32／5 | 23 |
| 猎犬proto | 917／71 | 27／7 | 23 |

“严格直接主线”的筛选还要求 `count>0`、无 hiddenGroup／随机组／随机包且 `randomType=ALWAYS`。全部目录汇总包含不同玩法，不用它声称各玩法均在项目支持范围；三项主正例分别来自普通 SideStory 与集成战略。Branch 条目或隐藏／随机变体未据此推定为当前已经执行。

## 复跑

```sh
python3 docs/research/evidence/always-check-point-20261108/content/extract_content.py \
  --mirror .cache/native-research/checkpoint-nondefault-20261107/mirror-current \
  --enemy-db .cache/native-research/route-operations-20261107/data/enemy_database.json \
  --revision 63c7cec73c3858d0ae913f85cc89af3cef4d744f \
  --out .cache/native-research/always-check-point-replay/content/content.json
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/always-check-point-20261108/content
```

镜像可以换成本地具有同一固定修订的 checkout，但必须具备完整所选目录。脚本不将静态数据取代活跃 XLua 或游戏现场验证。这里没有证明任何地图已经实际形成不可达场景，也没有证明三个实体在每次路线重建后具体传入哪个参数；这些问题应沿原生构造与消费者另行核实。
