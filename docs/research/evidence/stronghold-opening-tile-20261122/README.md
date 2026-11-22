# 卫戍开场真实部署与教官 Y 模组的格位许可

2026-11-22 核对本机 Windows 客户端、基础与已下载的热更新模组包，以及固定游戏数据版本 `17759cc8cdf37388414145d16262a3a06f3ab25e`。来源指纹、所选原始指令和模组投影见 [result.json](result.json)。

- 杜宾、医生的 INS-Y 模组在所查三个模组等级都配置额外天赋 `10`，`buildable_type=2`。两人的基础部署位置均为 `MELEE`。两份模组的一级 Prefab 都是 `DeckMiscTalent`，选择器只匹配自身且无地图限制。`DeckMiscTalent.AssignData#74643` 在 `0x1809c3f99–0x1809c3faa` 从 Blackboard 读该值。`#74644` 把字段送入 `Card.MiscSettingModifier`。`Card.DealDummyTalent#66911` 在 `0x1806eb66f` 创建该修正，`Deck.PreprocessDeck#66741` 在 `0x1806fb590` 后处理此类修正，命中目标后在 `0x1806fe91d` 创建 CardBuff。修正的首轮合并 `#67028` 在 `0x180711824` 将格位标记按位并入聚合结果。`Card._UpdateCardBuff#66869` 在 `0x1806f13e5` 和 `0x1806f13f4` 将聚合后的 `AdditionalBuildCondition` 写入 Card 的 `m_additionalBuildCondition`。
- 实际开场免费部署通过 `Deck.SpawnCharacterOrToken`，传入 `spawnManually=true` 并保留 Card 原有的格位资格检查。`Card.CheckBuildable#66859` 在 `0x1806ea6a2` 合并基础和追加条件，`#79504` 在 `0x180b2eaf8` 将额外格位标记按位并入基础部署掩码，再比较格子的部署类型。战斗模式专属的 `AutoChessGameMode._CheckBuildableInBattle#82885` 对开场期间非手动来源有单独拒绝分支，实际开场的手动来源不会被该分支拒绝。通过战场区域与棋子检查后，该方法在 `0x180c63bf1` 把原条件交给通用 `CanBuildOrOverlap`。 [开场真实部署入口](../stronghold-opening-deploy-20261122/README.md)

原生分支支持的结论是：战斗 Card 已具备额外高台资格时，真实开场部署没有单独撤销该资格。样本用于验证教官 Y 模组如何提供该许可。未据此判断特定棋子能否在本期获得、布阵界面的摆位判定或游戏实测结果。 [当前客户端热更新核对](../stronghold-opening-hotfix-20261122/README.md)

从仓库根目录复跑。`--game` 可指定相同指纹的安装，`--tables` 可指定该版本的原生表目录。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-opening-tile-20261122/extract.py \
  --out /tmp/arkbattle-stronghold-opening-tile.json
```
