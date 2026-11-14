# 单位分类：配置与内容绑定

2026-11-14。核对静态分类输入、非默认实例和实际内容绑定，不设计 ArkBattle API，不修改模拟代码。

## 来源与材料

| 材料 | 固定来源与范围 |
| --- | --- |
| `static-inputs.json` | 完整 `character_table`（1382项）、EnemyDB（2216项／2483等级行）、两个模组的配置摘录；完整输入 SHA256、Git Blob SHA1、提交和原文 Pointer 均保留。 |
| `professions-query.json`、`enemy-tags-query.json` | 共享 `config.py` 的原始查询；后者没有过滤 `m_defined`，精确区分定义／缺省请看 `static-inputs.json`。 |
| `prefabs.json` | 本机守林人、泥岩和维娜Y模组的选定层级组件；SerializedFile、PathID、脚本绑定、对象与 Bundle 指纹。 |
| `templates.json` | 五个选定 Buff 模板的原始配置与动作程序；三个干员／模组的绑定闭合，两个卫戍模板只作为配置候选。 |
| `prts-sources.json` | 查阅 URL、主题、限定摘录、转述和证据限制。社区描述与 native／配置证据分开。 |

角色表和模组表来自第三方镜像 `Kengxxiao/ArknightsGameData` 提交 `17759cc8cdf37388414145d16262a3a06f3ab25e`，EnemyDB 来自同镜像提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。两次镜像快照与安装资源不是同一版本；脚本核对缓存原始字节 SHA256 和 Git Blob SHA1，不以项目 Data 转换结果代替原件。

安装资源的 Buff Holder SHA256 为 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`；其余文件指纹在输出的 `provenance.sources`。复用的卫戍热更 Enemy 样本另有更新版本，不与基础安装混写，见[莱塔尼亚召唤物原件](../../leithanien-summons-20261109/content/README.md)。

结论和缺口见 [findings.md](findings.md)。配置绑定能够证明相应程序被内容引用，不能证明某场实机战斗已经执行。

## 复跑

从仓库根目录执行；要求上述原件缓存与本机安装资源仍可读：

```sh
python docs/research/evidence/unit-classification-20261114/config/extract_static.py \
  --out .cache/native-research/unit-classification-20261114/config/replay/static-inputs.json
python docs/research/evidence/unit-classification-20261114/config/extract_prefabs.py \
  --out .cache/native-research/unit-classification-20261114/config/replay/prefabs.json
python docs/research/evidence/unit-classification-20261114/config/extract_templates.py \
  --out .cache/native-research/unit-classification-20261114/config/replay/templates.json
python .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/unit-audit-20261110/operator-config/character_table.json \
  --out .cache/native-research/unit-classification-20261114/config/professions-query.json \
  --source-url https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel/character_table.json \
  --revision 17759cc8cdf37388414145d16262a3a06f3ab25e \
  stats '/*' --by /profession
python .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/leithanien-enemydata-20261109/enemy_database.json \
  --out .cache/native-research/unit-classification-20261114/config/enemy-tags-query.json \
  --source-url https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/63c7cec73c3858d0ae913f85cc89af3cef4d744f/zh_CN/gamedata/levels/enemydata/enemy_database.json \
  --revision 63c7cec73c3858d0ae913f85cc89af3cef4d744f \
  stats '/enemies/*/Value/*/enemyData/enemyTags' --by /m_value
```

三个提取器已按上述命令复跑到独立缓存目录，完整 `result` 与归档结果逐项相等，见 `replay-check.json`；比较不包含输出路径／脚本指纹等 provenance。两项共享 `config.py` 查询也成功，0个解析错误。没有运行产品测试、启动游戏或修改资源。

省略 `--out` 会覆盖本目录对应摘录；复核时应使用独立输出路径。
