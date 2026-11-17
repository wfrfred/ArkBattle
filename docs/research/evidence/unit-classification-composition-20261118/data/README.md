# 召唤物与分类资料的 JSON 核对

2026-11-18。本目录只检查资料结构、取值和显式引用，不由表来源、资源 key 前缀或职业推断运行控制器、敌我阵营或实际启用状态。综合结论由父批次和 Case 36 维护。

## 来源与范围

复用 Case 36 固定的完整镜像输入：

- `character_table.json`：提交 `17759cc8cdf37388414145d16262a3a06f3ab25e`，1382项。
- `enemy_database.json`：提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，2216项。

两份原文的 SHA256、Git Blob SHA1、字节数、URL、脚本指纹及原文 Pointer 均保存在 [result.json](result.json)。`extract.py` 在提取前严格校验原文字节。全表包含项目排除模式，统计不代表全部内容在项目范围内。

## 直接结果

| Character 表中的显式职业 | 项数 | 组织字段情况 |
| --- | ---: | --- |
| 八职业合计 | 461 | 432项有非空主要或附加归属，29项均为空 |
| TOKEN | 75 | `mainPower` 的三个值均空，`subPower=null` |
| TRAP | 846 | 主要归属均空；843项附加归属为空，3项附加归属包含 `laterano` |

三个有附加拉特兰归属的 TRAP 原件为 `trap_235_hlnpcm`（圣徒像扮演者）、`trap_236_hlnpcs`（圣堂射手扮演者）、`trap_237_hlnpcb`（圣堂保育员扮演者）。这里只证明这些资料具有归属，不自行证明某个组织效果对它们生效。

TOKEN 的分支有73项 `notchar1`，镜中虚影为 `executor`，猎潮的骑士 `trap_079_allydonq` 为 `pioneer`。职业、分支和 key 前缀不是一一对应关系。TRAP 的分支均为 `notchar2`。TOKEN／TRAP 的 `tagList` 均为 null；它不是 EnemyDB 的 `enemyTags`。

八职业中无组织归属的29项包括预备干员及特定模式支援角色，例如 `char_504_rguard`、`char_510_amedic`、`char_616_pithst`。角色／职业配置存在不保证存在非空组织归属；空集合是一项真实资料状态。

选定显式关联包括：深海色天赋 `tokenKey` → 触手；傀影天赋 → 镜中虚影；麦哲伦三个技能的 `overrideTokenKey` → 三种无人机；琳琅诗怀雅第二技能 → 龙门币炸弹。原字段位置和目标的职业、名称保存在 `selectedTokenReferences`，未把 `displayTokenDict` 当运行创建程序。

对两份完整 JSON 递归检查精确字段名 `side`、`sideType`、`sideTypeIndex`、`_sideTypeIndex`、`playerSide`，均无命中。它们没有直接提供这些阵营字段；实际阵营仍须核对 Prefab／创建／修改入口。固定 EnemyDB 不含新版莱塔尼亚两项召唤物，不能据此否定已有热更 Prefab 证据。

## 复跑

从仓库根目录运行，输出到本批次之外：

```sh
python3 docs/research/evidence/unit-classification-composition-20261118/data/extract.py \
  --out .cache/native-research/unit-classification-composition-20261118/data-replay.json
```

比较两份输出的 `result`；输出路径不参与结果。无原文缓存或指纹变化时脚本报错，不静默替换版本。JSON 的字段与引用调查没有启动游戏、核实活跃 XLua 或修改产品代码。
