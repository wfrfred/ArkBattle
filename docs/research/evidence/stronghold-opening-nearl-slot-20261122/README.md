# 卫戍开场耀骑士临光 S2 的部署位

2026-11-22 核对卫戍协议规程·序列Ⅰ适用的 Windows 基础客户端和本机已下载技能资源。方法指令、原始字节、Prefab 组件和输入指纹见 [result.json](result.json)。本期棋子默认选择第三技能，本批研究的是实际选择「逐夜烁光」的情况。 [本期角色配置](../stronghold-opening-current-content-20261122/README.md)

| 环节 | 证据 |
| --- | --- |
| S2 的部署位配置 | `[uc]skills.ab` 中 `skchr_nearl2_2` 的启用组件 `CardBuffWithSkill`（PathID `-1291650482406657799`）设置 `_dontOccupyDeployCnt=true`。基础和缓存此组件的投影一致。 |
| Card 上生效 | Card 构造回调 `#67048` 在 `0x18071ec4c` 执行选中技能的 `DealDummySkillBehaviours #73893`。该方法在 `0x180993acd` 通过虚槽 14 执行组件程序。组件的 `DealAttachInDummy #86711` 在 `0x180d5e8cd` 读取选项，在 `0x180d5e92e` 构造卡牌修正，在 `0x180d5e9b2` 登记。牌组初始化 `#67125` 在 `0x18070c875` 调用 `Card.AddCardBuff #66884`，后者在 `0x1806ea1dd` 进入 `Card._UpdateCardBuff #66869`，于 `0x1806f13d9` 更新 `Card+0xb0`。 |
| 开场正式落地 | 开场在正常 Card 生成入口加入 `freely=true`。`CharacterCard.SpawnInternal #67060` 经 `BattleController.CreateCharacter #65677` 传入该 Card。在 `0x18064bda0` 执行的 `Character.BuildAt #77239` 仍在 `0x180a9d4fb` 读取 `Card.get_dontOccupyDeployCnt #66841`，`_BuildAtInternal #77293` 在 `0x180aaad6c` 将结果写入 `Character+0x37a`。 [开场部署调用链](../stronghold-opening-deploy-20261122/README.md) |
| 实战部署位 | `Character.get_occupiedRemainingCharacterCnt #77177` 在 `0x180ab165d–0x180ab1664` 读取该标记。标记生效时，`#77180` 在 `0x180ab1ce3` 跳到 `0x180ab1d3f` 返回 `0`，`UnitManager.Register #79124` 在 `0x180b115b7–0x180b115c8` 将该值入账。 |
| 准备阶段布阵计数 | `_CreateDummyChess #81098` 通过 `AutoChessBattleUtil.CreateDummy #81997` 用角色数据调用 `CreateCharacterDummy #65687`，在 `0x18064b9ad` 使用 `Character.MakeDummy`。`_RefreshDeployStatus #81082` 在 `0x180bcd3ef` 和 `0x180bcd40d` 检查两种准备阶段，在 `0x180bcd4f6` 读取格上模型的部署位占用，`0x180bcd5d6` 写该阶段计数。 |

客户端静态路径显示，选择 S2 的耀骑士临光在开场实际落地时仍可获得零部署位的修正。布阵模型的计数走单独的准备阶段入口。11 月 13 日热更新登记镜像没有列出对这条链的直接替换。本批无实际战局回放。 [热更新范围](../stronghold-opening-hotfix-20261122/README.md)

从仓库根目录复跑。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-opening-nearl-slot-20261122/extract.py \
  --out /tmp/arkbattle-stronghold-opening-nearl-slot.json
```
