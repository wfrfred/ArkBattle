# 非默认路点参数的内容身份与出生引用

日期：2026-11-07。这里只核对候选模板的实际内容名称、正式敌人数据字段、普通关卡出生引用和公开机制描述。客户端节点消费、当前 Prefab 与模板绑定由同批运行时调查维护；不因代号相似或社区描述就判定节点已经启用。

## 固定来源

`Kengxxiao/ArknightsGameData` 修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。源文件清单、大小、SHA-256 与 Git blob SHA-1 在 [identity-sources.json](identity-sources.json)；本次逐文件用原文字节重算并核对 Git blob。这里是当前镜像修订，不冒充此前 bee3f83 样本或安装客户端的版本。

| 文件组 | 原文选择器 |
| --- | --- |
| `bolicp-data.json`、`bolicp-stage.json` | enemy_database `/enemies/1451/Value/0/enemyData` 的 name／prefabKey／skills／talentBlackboard；act32side_08 `/waves/0/fragments/1/actions/3` |
| `cledub-data.json`、`cledub-stage.json` | `/enemies/1443/Value/0/enemyData` 同组字段；act26side_08 `/waves/0/fragments/0/actions/5` |
| `folchr-data.json`、`folchr-stage.json` | `/enemies/1475/Value/0/enemyData` 同组字段；main_16-15 `/waves/0/fragments/4/actions/0` |
| `prts-sources.json` | 三个内容页面的 URL、查阅日期、章节和释义；不保存完整页面 |

所有 data／stage 摘录均由共享 `config.py` 生成，保留完整 provenance、查询与原文 Pointer。它们能证明名称、参数配置和出生引用，不能单独证明旧解码缓存中的 Buff 模板被当前客户端实际安装。

## 复跑

先取得上述固定修订的原文件，再用共享选择器，例如：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels/enemydata/enemy_database.json \
  --source-url https://github.com/Kengxxiao/ArknightsGameData/blob/63c7cec73c3858d0ae913f85cc89af3cef4d744f/zh_CN/gamedata/levels/enemydata/enemy_database.json \
  --revision 63c7cec73c3858d0ae913f85cc89af3cef4d744f \
  --out .cache/native-research/checkpoint-nondefault-replay/bolicp-data.json \
  select /enemies/1451/Value/0/enemyData \
  --field /name --field /prefabKey --field /skills --field /talentBlackboard
```

其余摘录的源 URL、Pointer 与字段在各 JSON 的 provenance 中；通过 `git hash-object` 或 `SHA1("blob " + size + NUL + rawBytes)` 核对 manifest 中的 Git blob。社区材料按其链接复查，未运行游戏；不把关卡 JSON 的字段默认值、旧缓存或网站语言概括替代实际运行链。
