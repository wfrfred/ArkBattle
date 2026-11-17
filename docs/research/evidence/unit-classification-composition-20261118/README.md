# 召唤物、装置与分类资料组合

2026-11-18。核对召唤物采用哪些分类资料、阵营从何处建立，以及组织／筛选标签是否互斥。机制结论集中在 [Case 36](../../cases/36-unit-classification-and-combat-tags.md)，本批不决定 Core 的 Capability 或联合类型。

## 来源与材料

- [data](data/README.md)：固定镜像 `character_table` 提交 `17759cc8cdf37388414145d16262a3a06f3ab25e`、EnemyDB 提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。全表按显式职业核对组织资料、分支、召唤引用和阵营字段；原文字节指纹、Pointer 和复跑脚本齐备。
- [native](native/README.md)：复用已有 Token 创建、Enemy 召唤、莱塔尼亚召唤物与 Trap Prefab 证据，并定向补核阵营初始化／读取。客户端 DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，metadata v29。
- [community.json](community.json)：PRTS 的扮演者、猎潮骑士和留声机页面。社区描述独立记录；不把装置占领模式等同于阵营变化。
- [archive.json](archive.json)：材料与可重提选择器清单。

各子目录说明原件、复用记录和精确命令。重新提取到批次外，不覆盖归档输入：

```sh
python3 docs/research/evidence/unit-classification-composition-20261118/data/extract.py \
  --out .cache/native-research/unit-classification-composition-20261118/data-replay.json
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/unit-classification-composition-20261118
```

## 边界

固定 JSON、客户端与热更资源各自有版本，不假定同步。全表统计含排除模式，支持范围的具体正例分别说明。静态引用不自动代表某场战斗启用；没有启动游戏或核实活跃 XLua。

本批证明召唤途径、阵营、职业／级别资料及标签来源不能相互替代；不声称穷尽所有职业变更、Category 切换或分类修改。没有发现实际需要的组合不构成原生全局禁止该组合的证明。
