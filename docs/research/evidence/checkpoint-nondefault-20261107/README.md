# Checkpoint 非默认参数的内容正例搜索

日期：2026-11-07。针对 randomizeReachOffset=true 与非零 reachDistance 继续查真实内容，不把原生字段存在或有限样本零命中当作需求结论。本批不修改 Route 类型、Data 解析器或 Core。结论集中在[案例 13 第 10 节](../../cases/13-route-and-movement-timing.md#10-非默认参数的内容正例与搜索范围2026-11-07-补核)。

## 证据路径

| 目录 | 来源与复跑范围 |
| --- | --- |
| [config](config/README.md) | 固定镜像两次修订的完整关卡目录、共享字段统计、逐文件 Git blob 与来源集合核验 |
| [runtime](runtime/README.md) | 本机客户端的运行时生成者、CheckpointData 类型引用候选、插入节点的参数消费、当前模板与马特奥技能 Prefab 绑定 |
| [search](search/README.md) | 正式敌人数据、实际关卡出生引用与 PRTS 机制参照；不代替客户端绑定 |

镜像来源为 `Kengxxiao/ArknightsGameData`，固定修订 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` 与 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。关卡 JSON 与客户端资源独立标注版本，不假定彼此同步。

原生客户端沿用当日已核对指纹：GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，Windows x64、metadata v29。Bundle／SerializedFile／PathID、模板及必要组件的身份与哈希由运行时子目录分别登记。

代码／网页搜索对字段名、true 或数值的共现不具备足够精度，因此只用于找线索；没有将搜索页零命中当作全局不存在的证据，也没有保留无法区分默认值的命中作为正例。

## 复查

配置使用共享 `config.py`，再运行本批 `config/profile.py` 验证整个 Git tree 选择范围；实际命令见配置子目录。客户端／资源可按清单重提到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/checkpoint-nondefault-20261107 \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/checkpoint-nondefault-replay
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/checkpoint-nondefault-20261107
```

共享 replay 不自动恢复专用类型树／Prefab 层级投影，按 runtime 子目录的解码脚本复跑。验证包括配置解析、完整来源集合及 Git blob 核验、原件 JSON／脚本语法、材料哈希与本地链接；没有运行完整战斗，也没有核实实际 XLua 覆盖。已闭合的内容正例与仍未找到的非零半径消费者分别记录，不互相替代。
