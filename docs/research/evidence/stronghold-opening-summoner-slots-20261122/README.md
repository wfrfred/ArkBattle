# 卫戍协议规程·序列Ⅰ开场部署与召唤师模组

2026-11-22 核对 [PRTS 卫戍协议帮助](https://prts.wiki/w/卫戍协议/帮助#战斗部署) 所写的召唤师 Y 模组例子。证据来自公开客户端数据镜像和本机安装的 Windows 客户端。[result.json](result.json) 保存镜像来源、资源指纹、字段和原生指令。

## 模组与本期配置

- 麦哲伦、稀音、梅尔和衡沙的 SUM-X 一级特性拥有首个召唤物免部署位。麦哲伦 `uniequip_002_mgllan` 的 `mgllan_equip_1_1_p1` 在已安装热更 Prefab 中关联 `free_summon[card]` 和 `free_summon[token]`。前者配置 `dont_occupy_deploy_cnt=1`；检查器使用 `_chooseMyToken=true`、`_inverse=true` 和 `_minCnt=0`。
- 深海色、令和麦哲伦的 SUM-Y 一级分支配置持有上限增加和费用降低。令 `uniequip_002_ling` 的 `ling_equip_1_1_p1` 在已安装热更 Prefab 中关联 `trigger_charge_token`；对应 Holder 程序执行 `RechargeToken`。Y 模组的特性没有首个召唤物免部署位。
- 2026-11-13 镜像的 `act3autochess/V3_1.charShopChessDatas` 有 155 条记录。143 个不同的普通 `charId` 和 89 个不同的 `backupCharId` 均未匹配 `character_table` 的 `summoner` 分支。数据同时包含 12 个自选棋子槽位；检查固定商店记录无法判断玩家自选阵容。

## 部署位的两个结算路径

| 路径 | 原生证据 |
| --- | --- |
| 模组修改卡牌 | `free_summon[card]` 执行 `CreateCardBuffToMyToken`。`#98651` 按 `tokenOrHostUid` 查所属 Deck 的 Card，再调用 `DoCreateCardBuff`。`Card._UpdateCardBuff #66869` 在 `0x1806f13d9` 写入 `+0xb0`，`Card.get_dontOccupyDeployCnt #66841` 读取该字段。 |
| 真实生成 | `TokenCard.SpawnInternal #67086` 调用 `CreateToken #65678`。`Character.BuildAt #77239` 在 `0x180a9d4fb` 从该 Card 读取部署位标记，`_BuildAtInternal #77293` 将其写入 Character `+0x37a`。`CreateToken` 随后另行把免费参数传给 `Tile.LocateCharacter`。真实单位登记时，`UnitManager.Register #79124` 读取 `Character.get_remainingCharacterCntVolume` 并更新计数。`#77177` 检查 Character `+0x37a`，有免部署位标记时贡献为零。 |
| 战前站位计数 | `AutoChessDummyManager._RefreshDeployStatus #81082` 检查 `inPrepareState`、`inSpPrepareState`，以棋盘上的 Dummy Character 部署位贡献量更新计数。 |

SUM-Y 的例子无法证明开场会屏蔽免部署位，原生模组资料把该资格配置在 SUM-X。本批为静态证据，尚未实测本期使用 SUM-X 自选棋子布阵，也没有确认站位 Dummy 与真实卡牌在开场落地前是否都已获得 SUM-X 修正。

从仓库根目录复跑。将 [result.json](result.json) 的 `provenance.tableMirror` 中四个 URL 对应的文件保存到同一目录，文件名沿用 URL。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-opening-summoner-slots-20261122/extract.py \
  --tables /tmp/arkbattle-summoner-tables-20261113 \
  --out /tmp/arkbattle-summoner-slots-result.json
```
