# 卫戍开场布阵与自动再部署

2026-11-22。核对已安装 Windows 客户端的开场布阵和后续自动部署。指令区间、原始字节、元数据、资源路径和指纹见 [result.json](result.json)。耀骑士临光的角色 Prefab、接力写入和 S2 消费链见[接力部署判定](../nearl-deployment-combo-20261122/README.md)。

| 路径 | 原生调用和状态 |
| --- | --- |
| 开场布阵 | `AutoChessBattleEntityManager.<DoBattlePreSpawn>d__33.MoveNext#80940` 在 `0x180bc71a3` 与 `0x180bc6fec` 设置和清除 `inBattlePrespawn`。开场协程 `#80989` 在 `0x180bc847a` 向 `_TryDeployChessInst#80930` 传 `free=true`。该值跳过 `0x180bb3710–0x180bb3770` 的外层 Card 状态和就绪检查。`0x180bb379a–0x180bb37a9` 仍用布阵实例的 `cardUid` 调用 `SpawnCharacterOrToken#66753`，参数为 `strict=true, spawnManually=true, freely=true`。 |
| 后续自动再部署 | `_TryDeployAvailableChessInst#80433` 检查布阵实例是否已在场，并取得 Card 以检查就绪状态，随后在 `0x180b72f1c` 调用 `_AutoDeploy#80435`。后者在 `0x180b70d3c–0x180b70d4b` 用同一个 Deck 入口，参数为 `strict=true, spawnManually=true, freely=false`。成功后将新角色写回布阵实例的引用。 |
| 费用和库存 | 按 UID 的 `#66753` 查 Card 后转发给 `#66755`，两条调用都默认关闭 `forceReduceRemainingCnt` 和 `dontUpdateState`。`#66755` 的 `freely` 跳过普通 DP 检查及扣费（`0x1806fd28b`、`0x1806fd569`）。`CheckDrawable#66860` 接受免费生成。`Card.Draw#66861` 的 `0x1806eba24` 根据 `freely` 和 `forceReduceRemainingCnt` 决定是否扣库存。 |
| 进入接力写入的普通成功分支 | `#66755` 在 `0x1806fd35f` 通过 Card 生成实例。付费和免费分支都能在 `0x1806fd5d1` 汇合，通过 `0x1806fd5e2` 的虚槽 41 检查 `Character.get_aliveOrDying`。该检查通过后，`0x1806fd60d` 执行 `Card.Draw`。`Card.Draw` 里免费跳过库存扣减后仍能到 `0x1806ebb0f` 派发 `OnCardDrawn`，其规则回调只收到 Card。`0x1806fd420` 是无角色实例而 `SpawnDetailsTracker` 报告成功时的重叠类旁路，要求 `isOverlapLikeOperation=true`、`ignoreRespawn=false` 才调用 Draw。 |
| 开场标记 | 可定位到 `AutoChessGameMode._CheckBuildableInBattle#82885` 在 `0x180c63af8` 读取该字段并参与落点合法性校验。所查普通成功的 Draw 和接力链路没有这个读点。 |

两个入口共用生成成功后的 Draw 路径，`spawnManually` 相同，`freely` 分支免去普通费用和库存操作。基础资源与本机已下载热更新 Holder 中的 `nearl2_t_1[mark]`、`nearl2_t_1[combo]`、`nearl2_s_2[end]` 投影完全相同。后续核对了临光接力在开场前的注册、同日公开镜像的热更新入口，以及社区说法的首期来源。本批未运行客户端对照战斗。 [注册时点](../stronghold-combo-registration-20261122/README.md) · [热更新核对](../stronghold-opening-hotfix-20261122/README.md) · [2024 至今的说明修订](../stronghold-opening-wiki-20261122/README.md)

从仓库根目录复跑。`--game` 可指定相同指纹的客户端安装。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-opening-deploy-20261122/extract.py \
  --out /tmp/arkbattle-stronghold-opening-deploy.json
```
