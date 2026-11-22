# 卫戍开场前注册接力规则

2026-11-22。核对已安装 Windows 客户端的普通原生分支。DLL、metadata、指令摘录及选择范围见 [result.json](result.json)。本批确认接力规则的注册时点，区别于[开场与补位的实际部署分支](../stronghold-opening-deploy-20261122/README.md)。

| 步骤 | 指令证据 |
| --- | --- |
| 读取任务、建牌 | `AutoChessGameManager.<StartBattle>d__114.MoveNext #81393` 先在 `0x180bffe45` 执行 `DoLoadGameInternal #81328`。该方法经 `0x180bd503e` 调用 `LoadGameWithRune #65788`，后者在 `0x180656473` 调用 `_GenerateDeckDict #65789`。生成牌组在 `0x180666b7b` 调用 `Deck..ctor #66739`。此构造函数先在 `0x1806fefd2` 创建牌组接力控制器，随后在 `0x1806ff05d` 构造各 `CharacterCard #67063`。 |
| 同步注册临光的接力 | `CharacterCard..ctor` 在 `0x180707a50` 进入 `Card..ctor #66853`。其调用槽 21 从实际类上解析为 `CharacterCard.TouchPrefab #67059`，转入 `BattleFactory.TouchCharacter #72802`。资源有效时该方法在 `0x180926fe4` 同步执行构造回调，随后回收取出的资源对象并返回成功。回调 `#67048` 在 `0x18071eb18` 调用 `Card.DealDummyTalent #66911`，沿已核对的[临光角色配置与注册路径](../nearl-deployment-combo-20261122/README.md#card-上的状态如何维护)登记规则。该链没有等待正式开战或临光自己的场上实例。 |
| 开始布阵 | `#81393` 完成载入和重置后，在协程下一状态调用 `DoBattlePreSpawn`，调用点 `0x180bffe0b`。执行每个棋子的 `#80989` 在 `0x180bc8491` 调用 `_TryDeployChessInst`，生成成功后在 `0x180bc84a9` 等待固定秒数，并跨协程迭代继续，确实是依次创建实例。`_TryDeployChessInst #80930` 在 `0x180bb36ff` 依 `chessInst.side` 找牌组。接力规则保存在各自牌组中，检查开场顺序时应使用同一侧的合格卡牌。 |
| 写入接力 | 普通 `Card.AddCardBuff #66884` 在 `0x1806ea155` 将修正追加到该卡的列表，所查路径无需该卡已上场或公开展示。临光的选择配置也未启用 `excludeNotInHand`、`excludeNotShowInCardList` 或 `excludeHiddenByCardState`。 [实际选择配置](../nearl-deployment-combo-20261122/result.json) |

实际注册要求天赋有效。`RegisterDeckManagedCardBuff #74635` 在 `0x1809c387e` 调用 `BasicTalent.get_isValid #74509`。该方法的普通分支在 `0x1809c08f0–0x1809c08f7` 检查本地天赋数据非空；注册分支随后按 `manageType=1` 进入接力控制器。在所查分支中未见读取卫戍或开场状态。镜像 `character_table.json` 的 `char_1014_nearl2/talents/0/candidates` 从精一 1 级起已启用模板 `1`，精二 1 级也使用这个模板，两个候选均无需潜能。 [固定角色配置](https://github.com/Kengxxiao/ArknightsGameData/blob/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel/character_table.json)

**静态分支推论。** 若同一牌组的一张符合条件的卡西米尔普通干员牌成功在临光前生成，临光规则已登记，且普通 `Draw` 会看到它。建牌时机、隐藏待部署区和免费均不能从已查分支解释为何跳过临光接力。此推论没有覆盖不同牌组、特殊棋子生成方式、当前实战运行时的热更与额外配置。 [规程序列Ⅰ的相关热更新核对](../stronghold-opening-hotfix-20261122/README.md)

从仓库根目录复跑。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-combo-registration-20261122/extract.py \
  --out /tmp/arkbattle-stronghold-combo-registration.json
```
