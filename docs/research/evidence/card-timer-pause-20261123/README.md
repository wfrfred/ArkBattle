# Card 通用暂停与实际目标

2026-11-23 复核，结论归入[案例 24](../../cases/24-deployment-cost-and-supply.md#三种策略的停表样本)。配置来自 `arknights-game-data` 固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e`。客户端指纹记在[选敌指令](selector.json)中，与[卡牌策略分布](../card-policy-distribution-20261102/README.md)使用同一安装版本。

## 计时条件

`Card.OnTick`（66909）对 RESPAWNING 和 QUEUING 状态在 `0x1806ed729` 读取 `m_respawnTimerStopped`（`+0x1da`）。为真时在下一条指令跳过 `PeriodicTimer` 更新，仍会继续推进 CardBuff，无策略分支和剩余时间写入。前面的 `+0x1d9` 是 `m_respawnDisabled`，该分支转到 `0x1806ed7f4` 使计时失效。`Card._UpdateCardBuff`（66869）在 `0x1806f114f` 写回暂停位。 [字段与指令](../deployment-recovery-20261101/supply/supply-methods.json)

## 停表配置与目标

[固定 Buff 原表检索](config.json)记录 `respawn_stopped` 的三处命中，均为值 `1` 的黑板项。

| 来源 | 卡牌目标与解除 |
| --- | --- |
| 放逐的黑棺 | `skzhg_m0_t[aura]` 的 `ON_BUFF_START` 首节点以 `IsCharacter` 检查附着者。符合条件的附着者离场后，`skzhg_to_source_switch` 通过 `CreateCardBuff(BUFF_SOURCE)` 设置暂停，在 `ON_BEFORE_TRY_SET_HP_ZERO` 撤销 CardBuff。 |
| 托生莲座 | `skzjbc_t[swallow_mark]` 的 `ON_BUFF_START` 首节点也要求 `IsCharacter`。装载路径由 `skzjbc_t[cardbuff_ctrl]` 给被装载者创建 `PassengerStorage` CardBuff，莲座被击杀时按该键解除。 |
| 机械师 S3 | `mcnist_s_3_projectile_trigger` 把黑板项传给 `mcnist_s_3_projectile`。后者的 `ON_BUFF_START` 要求存在有效召唤物，通过 `CreateCardBuffToMyToken` 写入对应卡，结束时按 `mcnist_s_3_projectile_hide` 移除。预制体 `token_10069_mcnist_mcgraf` 的 `_cardPolicy=1`（UNIQUE）。这份配置可以确认卡牌目标，尚未观测到停表时该卡持有的具体余时。 [Token 控制器摘录](../card-policy-distribution-20261102/controllers.json) |

黑棺 `M0Aura` 与莲座 `swallowOperators` 的目标校验器都启用 `professionMask=639`（`0x27f`）。两个效果内的 `IsCharacter.Execute`（101487）也在 `0x1811d9d76` 调用 `BattleUtil.IsCharacter`（79623）。后者读取 `BattleCharacterData.profession`（`+0x70`），在 `0x180b42881–0x180b4288d` 检查 `(profession & 0x27f) == profession`。掩码排除 `TOKEN=0x80` 与 `TRAP=0x100`。中继器在 `excel/character_table.json` 的 `/token_10070_aphris_pc/profession` 为 `TOKEN`。普通 `CharacterCard` 固定返回 UNIQUE。 [Prefab 目标校验器](prefabs.json) · [检查指令](character-check.json) · [职业枚举](../unit-classification-20261114/identity/native.json) · [卡牌策略取值与来源](../card-policy-distribution-20261102/README.md)

## DEFAULT 重构体

重构体 `token_10050_monstr_prosts` 的 `_cardPolicy=0`。暂停参数来自安装资源 `pkgrps/btl_pfb_tokens_0.ab` 的 `CAB-f68700761ef4b9b267b0af89309727d6`，PathID `9174674518516416032`。幼体的启用 Buff `prosts_t_1[born_charge]` 直接携带 `respawn_stopped=1`。原表同名模板的 `ON_BUFF_START` 将参数传给目标卡的 `prosts_t_1[raw_born]`，`ON_BUFF_FINISH` 充值后按键移除它。DEFAULT 的普通充值不重置已启动的计时。 [Prefab 及原表解码](reconstruction.json) · [充值路径](../default-card-stock-return-20261123/README.md) · [重构体·特性](https://prts.wiki/w/重构体)

除固定 Buff 表，本轮在已装的 `charpack/*.ab`、`battle/enm_pfb_*.ab`、`battle/prefabs/*skills.ab`、`pkgrps/btl_pfb_tokens_*.ab` 中检索该键，涉及 517 个 Bundle、零解码错误。重构体是这个资源范围内的唯一命中。未做客户端实战观测，也未穷尽独立 Bundle、模式程序及热更新。

## 复跑

```sh
skill=.agents/skills/arkbattle-native-research
python3 "$skill/scripts/config.py" assets/arknights-game-data/zh_CN/gamedata/battle/buff_template_data.json \
  --revision 17759cc8cdf37388414145d16262a3a06f3ab25e --out /tmp/card-pause-config.json find --value respawn_stopped
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline "$skill/scripts/native.py" \
  --out /tmp/card-pause-selector.json disasm 101487 79623
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline "$skill/scripts/native.py" \
  --out /tmp/card-pause-character-check.json disasm-at 0x180b42830 --max-bytes 0x60
python3 docs/research/evidence/card-timer-pause-20261123/extract_prefabs.py --out /tmp/card-pause-prefabs.json
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
python3 "$skill/scripts/assets.py" "$game/Arknights_Data/StreamingAssets/AB/Windows/pkgrps/btl_pfb_tokens_0.ab" \
  --find respawn_stopped --out /tmp/card-pause-prosts
```
