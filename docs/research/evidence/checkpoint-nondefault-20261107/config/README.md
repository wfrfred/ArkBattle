# 非默认 Checkpoint 参数：完整关卡目录核对

2026-11-07。按字段值定向检索 randomizeReachOffset 与 reachDistance，不使用代码搜索中的关键词共现作为启用证据。这里覆盖固定镜像两次修订的 `zh_CN/gamedata/levels/obt/**/*.json` 与 `activities/**/*.json`；它包含不同玩法的配置，不以当前项目的支持范围缩小检索。运行时生成的路点不属于这份 JSON 集合。

## 来源与材料

仓库：`Kengxxiao/ArknightsGameData`。

| 固定修订 | 完整 JSON 文件 | Checkpoint | 材料 |
| --- | --- | --- | --- |
| `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` | 3997 | 513890 | `randomize-stats.json`、`reach-distance-stats.json`、`pinned-profile.json` |
| `63c7cec73c3858d0ae913f85cc89af3cef4d744f` | 4025 | 517501 | `current-randomize-stats.json`、`current-reach-distance-stats.json`、`current-profile.json` |

前者是既有 Route 调查的固定数据版本；后者是本轮取得并固定的镜像修订。镜像提交与本机客户端不自动视为同一版本。

四份 stats 是共享 `config.py` 的原始 provenance／result。`profile.py` 从对应修订的 Git tree 枚举完整选择范围，逐文件核验原文字节的 Git blob SHA-1，再确认两次 selector 的输入集合、SHA-256、大小与该 tree 完全一致。两份 profile 保存源清单及统计原件哈希。配置读取无解析失败或所查字段缺失；结论与运行时资源正例统一维护在案例，不在此建立另一套机制解释。

## 复跑

取得公开镜像时可以稀疏下载关卡目录；不需下载全仓库历史或其他数据目录。每次统计前固定 checkout，而不使用可变化的分支名：

```sh
git clone --filter=blob:none --no-checkout --depth 1 \
  https://github.com/Kengxxiao/ArknightsGameData.git \
  .cache/native-research/checkpoint-nondefault-replay/mirror
git -C .cache/native-research/checkpoint-nondefault-replay/mirror \
  fetch --filter=blob:none --depth 1 origin bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d
git -C .cache/native-research/checkpoint-nondefault-replay/mirror \
  sparse-checkout set --no-cone '/zh_CN/gamedata/levels/'
git -C .cache/native-research/checkpoint-nondefault-replay/mirror \
  checkout --detach bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d
```

使用相同输入分别统计两个字段，随后核验整个来源集合：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/checkpoint-nondefault-replay/mirror/zh_CN/gamedata/levels \
  --glob 'obt/**/*.json' --glob 'activities/**/*.json' --preview 0 \
  --source-url https://github.com/Kengxxiao/ArknightsGameData \
  --revision bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d \
  --out .cache/native-research/checkpoint-nondefault-replay/randomize-stats.json \
  stats '/**/checkpoints/*' --by /randomizeReachOffset
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/checkpoint-nondefault-replay/mirror/zh_CN/gamedata/levels \
  --glob 'obt/**/*.json' --glob 'activities/**/*.json' --preview 0 \
  --source-url https://github.com/Kengxxiao/ArknightsGameData \
  --revision bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d \
  --out .cache/native-research/checkpoint-nondefault-replay/reach-distance-stats.json \
  stats '/**/checkpoints/*' --by /reachDistance
python3 docs/research/evidence/checkpoint-nondefault-20261107/config/profile.py \
  --mirror .cache/native-research/checkpoint-nondefault-replay/mirror \
  --revision bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d \
  --randomize .cache/native-research/checkpoint-nondefault-replay/randomize-stats.json \
  --distance .cache/native-research/checkpoint-nondefault-replay/reach-distance-stats.json \
  --out .cache/native-research/checkpoint-nondefault-replay/profile.json
```

第二修订使用相同命令，将 revision、checkout 及输出名换成表中对应值。复跑的采集时间、绝对路径可以不同，比较字段值分布与源文件身份。新 selector 的时间戳不应伪装成旧原件字节一致。
