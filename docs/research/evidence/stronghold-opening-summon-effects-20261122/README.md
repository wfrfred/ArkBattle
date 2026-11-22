# 卫戍开场召唤物的场上效果

2026-11-22 核对规程·序列Ⅰ的在场造型仪样本。[原生指令与资源摘录](result.json) 记录本机 Windows 客户端、安装资源与活动表镜像各自的输入指纹。模式实参与活动版本另见[开场部署](../stronghold-opening-deploy-20261122/README.md)和[开场热更核对](../stronghold-opening-hotfix-20261122/README.md)。

| 环节 | 证据 |
| --- | --- |
| 本期可选样本 | `act3autochess/V3_1` 的 `chess_char_3_19_a` 是罗比菈塔，初始已精二。干员天赋的召唤物引用为 `token_10018_robrta_mach`。 [活动表镜像固定版本](https://github.com/yuanyan3060/ArknightsGameResource/blob/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/excel/activity_table.json) |
| 实际召唤物配置 | `btl_pfb_tokens_0.ab` 中造型仪根 Token `1757915464240851100` 的公共能力包含启用的 `PassiveBuffAbility 5147192285674596508`，其初始状态包括 `robrta_mach_invincible`。同一个 Prefab 的 `Others/Direction/Talents` 下，启用的 `AuraAbility 4422298484895836316` 和 `-8855635408115472228` 均提供 `robrta_mach_t` 与 `robrta_mach_t[def]`。当前下载的模板中，前者成功挡伤后消耗造型仪的护盾层，后者在效果开始时建立运行状态。 [造型仪正常规则](https://prts.wiki/w/全自动造型仪) |
| 普通成功部署路径 | 开场经 `_TryDeployChessInst` 进入 Deck 的 Card 生成入口并传免费／手动标志。`TokenCard.SpawnInternal #67086` 在 `0x18071dabf` 调用 `CreateToken #65678`，成功分支在 `0x180651649` 调用 `Character.BuildAt`。落地的 `Character.LocateOnTile #77255` 在 `0x180aa10d5`、`0x180aa10dc` 写手动和免费，再于 `0x180aa1108` 调用出生虚槽。`Character.OnBorn #77334` 在 `0x180aa2ddc` 调用 `Unit.OnBorn #79022`，后者仍调用 `Entity.OnBorn`、登记单位及装配能力，普通分支中没有统一跳过的条件。 [TokenCard 创建来源](../device-source-20261111/spawn/README.md) |
| 光环施加 | `AuraAbility._DoTargetCheckAndEnter #94018` 在 `0x180f96ac2` 验证目标。目标接触处理 `DealTargetTouched #94015` 在 `0x180f94730` 把配置好的 Buff 放到目标。造型仪的防御与护盾要求有合格目标，属于在场能力启动、目标接触生效。 |

这组原生路径支持正常成功生成的预摆造型仪启动场上能力。它没有测量实际开场各帧、目标筛选在特定关卡的落点，也没有把光环接触当作任意单次出生事件的实战复测。本批未回放正在运行的战斗。

## 复跑

活动表选用 11 月 13 日公开镜像固定提交。本地 Windows 和公开镜像的版本区别列在[热更取证](../stronghold-opening-hotfix-20261122/README.md)。

```sh
curl -fsSL 'https://raw.githubusercontent.com/yuanyan3060/ArknightsGameResource/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/excel/activity_table.json' \
  -o /tmp/arkbattle-current-activity-20261113.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-opening-summon-effects-20261122/extract.py \
  --activity /tmp/arkbattle-current-activity-20261113.json \
  --out /tmp/arkbattle-stronghold-opening-summon-effects.json
```
