# 翔虫技能的外部特殊移动

2026-11-22 核对支线「泡影苍霆」的两个翔虫技能。选用当前 Windows x64 客户端，DLL、metadata、Bundle 指纹及数据镜像提交见 [result.json](result.json)。

- `trap_274_pyctrn` 绑定 `sktok_pyctrn`，其部件安装 `trap_pyctrn_s`。Holder 在 `ON_BUFF_START` 配置 `RespawnCharacter`，设置 `_useExternalRespawn=true`、`_respawnInSameTile=true` 和 `_loadDirectionFromBB=true`。`trap_275_pycfly` 绑定 `sktok_pycfly`，其实际 `trap_pycfly_s` 的两个创建分支同样使用外部移动。 [泡影流大冲击](https://prts.wiki/w/泡影流大冲击) · [支线技能说明](https://prts.wiki/w/泡影苍霆#翔虫技)
- `Character.MoveLikeRespawnExternal#77286` 在 `0x180aa18a1` 写结束原因 `0xc`，在 `0x180aa18b7` 调用 `FinishMe`，再于 `0x180aa18fd` 调用 `_MoveLikeRespawn`。该路径沿用同一 Card，且与自身移动共用免费创建入口。 [共同创建入口](../special-redeploy-failure-20261122/README.md)
- `BattleController.OnCharacterFinished#65741` 在 `0x180658f8d–0x180658f93` 只为 `0xa` 和 `0xb` 跳过回收。自身特殊移动使用 `0xb`。外部特殊移动使用 `0xc`，对满足回收前提的角色在 `0x180658fb4` 调用 `Deck.RecycleCard`。普通 UNIQUE 卡的 `OnRecycle` 依卡牌开关累积费用阶段，解释了泡影流大冲击免费创建当次 Unit、仍能提高原 Card 后续部署费用的行为。 [Card.OnRecycle](../card-policy-distribution-20261102/README.md) · [泡影流大冲击机制](https://prts.wiki/w/泡影流大冲击#装置机制)
- `RespawnCharacter._DealWithRespawn#102387` 的外部移动分支采样并恢复 HP 和 SP 比例。所核对的是实际 Holder 配置和静态原生分支。 [HP 与 SP 的实际指令](../redeploy-state-and-repeater-20261122/README.md#特殊移动)

从仓库根目录复跑。可用 `--game` 指定具备相同指纹的客户端。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/external-redeploy-20261122/extract.py \
  --out /tmp/arkbattle-external-redeploy-replay.json
```
