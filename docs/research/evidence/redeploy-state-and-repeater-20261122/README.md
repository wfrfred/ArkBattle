# 技能移动的状态接续与中继器容量变化

2026-11-22 补查 [Case 24](../../cases/24-deployment-cost-and-supply.md)。[result.json](result.json) 保存已安装客户端的组件 PathID、实际 Buff Holder 动作、指令摘录与输入指纹。公开数据来自固定镜像 `bffe31bf66739842f99b457327066c695e2af389`，供核对技能选用与参数。客户端为 Windows x64 IL2CPP v29，GameAssembly SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

## 特殊移动

- 乌尔比安 S3 的实际技能根 `-3750018467266955814` 绑定 `UlpiaS3CastSkill`。角色资源 `2516051002928001502` 的 `UlpiaS3Ability` 装配 `ulpia_s3_hp_ratio_sync`，并持有与技能一致的 `ulpia_skill_progress`。Buff 在 `ON_OWNER_FINISH` 匹配 `MOVE_LIKE_RESPAWN_SELF` 时记住 HP 比例，其它退场写入 −1。`ON_OWNER_BORN` 只对正比例作 HP 调整。返回模式 `ulpia_s3_restore` 与移动模式 `ulpia_s3_respawn_buff` 都包含清 SP 的动作。落点优先顺序与失败判例另见 [PRTS 乌尔比安](https://prts.wiki/w/乌尔比安#技能)。
- Mon3tr S3 的实际技能根 `1657737257676205052` 同样绑定 `UlpiaS3CastSkill`，具有自己的 `monstr_skill_progress` 与返回标志物。`916522204719311868` 的 `AnimatedActionToOwnerAbility` 装配 `monstr_s_3_buff[respawn]`，该模板调用 `RespawnCharacter` 时 `_useExternalRespawn=false`。角色 `267648895035992040` 的 S3_Reborn 模式实际装配 `monstr_s_3[sync_hp]`，由技能模式安装 Buff 时恢复非零 HP 比例。返回还使用独立的技能模式和预留地块条件。 [PRTS Mon3tr](https://prts.wiki/w/Mon3tr#技能)
- 思衡托 S3 的实际 `SkillProgressHooker`（`-2859062326968680928`）保存自己的恢复模板。待投放模板 `kalts2_s_3[withdraw]` 使用 `CreateCardBuff`、`Kalts2S3RecordSkillAffectedCardInfo`、`Kalts2S3ApplyExtraBuildableChecker`，再关闭退款并强制撤退。它另有留在待部署区的状态，和上述同步移动的处理时点不同。失效时的全部继承／回滚条件尚未核对。 [PRTS 凯尔希·思衡托](https://prts.wiki/w/凯尔希·思衡托#技能)

| 原生位置 | 静态证据 |
| --- | --- |
| `MoveLikeRespawnByProjectileBehaviour._OnProjectileStopped`（86845） | `0x180d65619` 先写位移共享数据，`0x180d6571a` 调用 `MoveLikeRespawnSelf`，失败可执行 `0x180d65738` 清除共享记录。 |
| `Character.MoveLikeRespawnSelf`（77285）及 `_MoveLikeRespawn`（77287） | `0x180aa1c01–17` 用原因 `0xb` 调用 slot 117 的 `FinishMe`，随后进入内部重部署。`_MoveLikeRespawn` 读取原来的 `cardUid`，以对应 Card 为参数在 `0x180aac52d` 调 `Deck.SpawnCharacterOrToken`，本次请求不按普通扣费。 |
| `FetchHpToBlackboard.Execute`（99367） | 对 HP 比例求 `(保存比例 − 当前比例) × 新实例最大 HP`，指令 `0x181101a12–53`。创建 HP Modifier，配置 `_skipModifierEvent=true` 时于 `0x181101b7d–8a` 设置 SharedFlag 7（`SKIP_MODIFIER_EVENT`），随后提交有符号差量（`0x181101b9d`）。新实例满 HP 且保存比例较低时，表现为一次降低 HP。 |
| `RespawnCharacter._DealWithRespawn`（102387） | 另有 `MoveLikeRespawnExternal` 分支，会在旧实例采样 HP／SP 比例（`0x1812192a7–b4`），在新实例上重算并提交 Modifier。Mon3tr S3 上述配置走 `0x181219580` 的 Self，不能把 External 的通用 HP／SP 继承套给该技能。 |

## 谬因 S3 的中继器

`skchr_aphris_3` 的 Charge/ActiveBuff（`875698991745679599`）装配 `aphris_sk3[token-withdraw]`，ActiveBuff（`-5427451279434235665`）装配 `aphris_sk3[on_finish]`，技能参数 `token_recharge_cnt=2`。当前 Holder 在开场先 `ForceRechargeToken(+2, NORMAL, false)`，再撤回在场中继器，最后清本段恢复时钟。技能正常结束先 `ForceRechargeToken(-2, ON_FINISH, false)`，再撤回中继器并清本段时钟。宿主结束分支也有撤销数量与清时钟的指令。 [PRTS 谬因](https://prts.wiki/w/谬因#技能)

| 原生位置 | 静态证据 |
| --- | --- |
| `ForceRechargeToken.Execute`（101247）→ `Character.ForceRechargeToken`（77257）→ `Deck.ForceRechargeToken`（66746） | Blackboard 的有符号份数在 `0x1811bc4c3` 读取，沿目标的 Token Card UID 传给 `TokenCard.ForceRecharge`（67089）。 |
| `TokenCard.ForceRecharge`（67089） | 同一个有符号增量分别加到 `maxDeckStackCnt`（`+0x218`，`0x18071c65c`／`0x18071c6a8`）和 `maxDeployCnt`（`+0x204`，`0x18071c764`／`0x18071c7ad`）。普通累加分支在 `0x18071c8f6–908` 把总剩余数改为 `min(新持有上限, 原总数 + 增量)`。QUEUED 且 ON_FINISH 时，`0x18071c94c–963` 将本次增量纳入排队数，并按新剩余数和零截断。 |

因此在场上限、持有上限、总份数和真正可用份数各有消费。普通回收和清当前段的证据见[中继器普通回收](../repeater-recovery-20261122/README.md)。本批核对实际组件及静态调用，未验证运行时热更、实战帧序或所有退场交互。

## 卫戍自动再部署

`AutoChessBattleTrigger._TryDeployAvailableChessInst`（80433）在 `0x180b72ecc` 跳过已 `validInBattle` 的条目。它用该棋子的 `+0x44` 数据查 Card，`0x180b72efd` 调用 Card 虚槽 16 的 `readyToSpawn`，通过才将实际 Card UID 和条目交给 `_AutoDeploy`。一次合法生成失败回到候选循环。

`_AutoDeploy`（80435）从棋子的 `+0x24` 读取坐标并调用普通 `Deck.SpawnCharacterOrToken`（`0x180b70d4b`）。失败分支在 `0x180b70d52` 跳过写回。成功才在 `0x180b70d79` 写回新的场上对象引用，并在 `0x180b70db8` 清除同位置的倒地对象。等待时间由所选 Card 的状态决定。 [卡牌资格的虚槽与计数](../deployment-exit-limits-20261122/README.md)、[同名干员的 Card UID](../same-character-source-20261111/README.md)

`AutoChessBattleDataModel._LoadBattlePlayerData`（81754）在 `0x180c02d45` 为当前宿主调用 `ConvertToTokenDataOrNull`，得到的 Token Card 数据保存在 `r15`。之后的候选循环在 `0x180c02e2d–51` 比较阵营、确认 `isToken`、匹配宿主 `instId`，并在 `0x180c02e53–5a` 把同一份数据的 `uniqueId` 和数据引用分别写入每个匹配棋子的 `cardUid`（`+0x44`）及数据字段（`+0x48`）。因此这些棋子的自动回补共用同一 Card 的资格。谬因中继器 Prefab 配置为 `_cardPolicy=2`（`QUEUED`），在该政策下按 Card 共享串行库存恢复。 [Card 分配指令](../same-character-source-20261111/native/bodies/_LoadBattlePlayerData-81754.asm)、[中继器回收配置](../repeater-recovery-20261122/README.md)、[卫戍协议技能触发](https://prts.wiki/w/卫戍协议/帮助v2#技能触发)

## 复跑

从仓库根目录执行，`--game` 可指定相同指纹的客户端安装目录。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/redeploy-state-and-repeater-20261122/extract.py \
  --out /tmp/arkbattle-u028-u029-replay.json
```
