# 单位分类与战斗标签调查

2026-11-14。结论集中维护在 [Case 36](../../cases/36-unit-classification-and-combat-tags.md)。本批核对原生分类的来源、构造、查询与实际内容，未修改模拟代码或确定新接口。

## 来源与版本

- 当前本机 Windows 客户端：`GameAssembly.dll` SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，版本 29。
- 固定角色／模组资料：第三方镜像 `Kengxxiao/ArknightsGameData` 提交 `17759cc8cdf37388414145d16262a3a06f3ab25e`；EnemyDB 提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。字节、Git Blob 与记录指针在 `config/static-inputs.json`。
- 安装资源、已有莱塔尼亚热更样本与镜像快照分别保留指纹，不假定同版本。PRTS 为社区资料，本批未固定 MediaWiki oldid，查阅范围和限制在 `config/prts-sources.json`。

## 材料

| 目录 | 作用 |
| --- | --- |
| [inventory](inventory/README.md) | 分类轴元数据定位；敌人级别、目标攻击方式、本次 Ability 攻击方式及阵营字段 |
| [identity](identity/README.md) | 类继承、类型掩码、实体类别、职业／附加职业、精确枚举常量与选择器分支 |
| [tags](tags/README.md) | Enemy／Character／Trap 的 FilterTag，Character GroupTag，数据建立及已核修改范围 |
| [config](config/README.md) | 完整表统计及选定记录；泥岩、守林人、维娜模组与迷迭香模组的静态来源和资源绑定 |

各目录的 README 给出脚本与选择器；`findings.md` 解释其证据，不取代案例中的综合结论。`archive.json` 汇总来源、文件指纹和可重提选择器。

## 证据边界

本批取得的是元数据、选定普通原生分支、固定静态资料和资源绑定。方法分片及解码限制分别保留在原件与子目录说明中。没有实机运行或观测活跃 XLua；存在热更新出口的方法均不能据普通分支排除热更新行为。名称扫描的无命中也不证明反射、任意内容或热更新没有写入。

实际绑定与配置候选分别标明。表中没有多标签或跨等级分类变化的正例，不能反推原生容器或覆写机制不支持它们。`RuntimeData`、`Preprocess` 等名称也不能单独证明战中修改时点。

## 清单与复核

从仓库根目录生成清单，重提输出必须位于本批之外：

```sh
python .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/unit-classification-20261114
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/unit-classification-20261114 --out .cache/native-research/unit-classification-replay --method 79594 --method 77296 --method 77737 --method 78846 --method 101575 --method 102473 --method 78894 --method 84730
```

`replay.py` 校验来源指纹、方法身份和地址，并重提选定原生片段；不重建整个逻辑方法、内容解码器或实战。本批完整方法提取由各目录记录的专用命令负责。

本次复核：三个配置提取器的独立输出 `result` 全等；分类定位脚本的独立输出全等；上述 8 个方法重提成功、0 个不可用选择器。所引用 Python 脚本的记录指纹与现存文件一致。JSON、Python 语法及本批文档本地链接检查通过。本轮未改产品代码，没有运行产品测试。
