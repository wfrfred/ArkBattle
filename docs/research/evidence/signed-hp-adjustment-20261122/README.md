# 有符号 HP 调整的接收、提交与报告

2026-11-22 定向补查。[原生指令和配置选段](settlement.json)保留 Windows x64 DLL、IL2CPP metadata v29、提取脚本、赫默模组配置及已解码 Prefab 的指纹。魔王 S3 和「岁」已经绑定实际产物，见[魔王 S3](../health-equalization-20261122/README.md)和[「岁」四部位](../sui-hp-sync-20261122/README.md)。固定配置提交为 `17759cc8cdf37388414145d16262a3a06f3ab25e`。

| 调查范围 | 本版普通静态分支 |
| --- | --- |
| 构造和接收 | 魔王 `EqualizeTargetHpRatio #102136` 和「岁」`UpdateEnemyHP #69565` 用 `NewHp #72184` 按差值正负构造 HP 恢复或损失，并设置标记 7，调用 `ApplyModifier #67665`。入口仍检查存活和取消。此请求未另外设置标记 15 的常规不可伤复核，继续走目标跳过分支 `OnApplyingSkippedModifier`、取消复核和有效来源的 `OnBeforeTargetApplyModifier`。 |
| 提交和归零 | 与普通 HP 修改共用 `DoApplyModifier #67683 → set_hp → SetHpInternal #67625`。跳过标记本身不设置非致命，不移除归零前处理、不死下限或最终归零派发。这里未创建 `SetHpDirectly` 的请求。 |
| 普通浮字和应用后报告 | HUD 的 `_ShowDamageText #106913` 订阅实体 `ON_TAKE_DAMAGE`（12）与 `ON_TAKE_HEAL`（13），普通 `OnTakeDamage #67709` 在 `0x18072bd83` 发事件 12，普通 `_OnApplyingModifier #67667` 在 `0x180731889` 发事件 13。跳过分支绕过这些普通接收。`ApplyModifier` 在 `0x180721b2e–40` 越过 `OnAppliedModifier #67669`，也就绕过目标应用后事件、HUD `_OnAppliedModifier #106914` 订阅的实体 `ON_APPLIED_MODIFIER`（10）和 `BattleLogger.LogModifier`。这组证据针对普通 Modifier 通知与浮字，不判断所有技能特效、血条刷新或现场表现。 [普通伤害发布位置](../reception-stages-20261115/pipeline/native.json#L59090) |
| 「岁」的阶段后继 | 管理器先同步其它部位，再读取首部实际 HP／MaxHP 写回，读取管理器比值并检查阈值，按阶段添加 Buff、创建镜头效果并尝试推进指定 Branch。部位 HP 提交与这段共享进度逻辑是不同步骤。 |

## 真的会读取跳过分支的保护

淬羽赫默 Y2／Y3「可控动量」的隐藏天赋分别选取 `slent2_equip_2_2_p2`、`slent2_equip_2_3_p2`。两条资源记录都把 `slent2_e_003_t2` 安装给对象。模板分别在 `ON_APPLYING_MODIFIER` 和 `ON_APPLYING_SKIPPED_MODIFIER` 处理损伤。后一个分支检查来源单位身份的既有 Card 标记，读取本笔拟收到的数值与目标当前 MaxHP，以本次损失后的预测值判断会否跌破 50%。通过后记录 Card 标记并授予屏障，Y2 与 Y3 分别按赫默 MaxHP 的 35% 和 50% 计算，莱茵生命翻倍。两条资源分别为 `CAB-7e3af38637f0d056d61e3e709179a7d1` 中的 PathID `-3638554255824138148` 与 `1407770864896514877`。 [社区规则](https://prts.wiki/w/淬羽赫默#模组)

组合推导：两名合格友方的 MaxHP 都为 1000，当前 HP 为 800 与 100，且均参与同一轮采样。魔王算得比例 45%，第一名收到 350 的 HP 损失。若其同时在赫默光环内且本来源的标记未出现，则原生已选分支比较 `0.80 < 0.50 + 0.35`，消费本轮资格并授予屏障。这个推导用于证明目标接收行为可产生实际战斗差别。没有运行两技能组合实机，也没有将随后发生的屏障竞争或额外生命结算等同于这一预测。 [魔王技能](https://prts.wiki/w/魔王#技能)

如需复提，在仓库根运行。脚本核对本版指纹，旧客户端或新版本需重新定位方法。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/signed-hp-adjustment-20261122/extract.py \
  --out /tmp/signed-hp-adjustment.json
```
