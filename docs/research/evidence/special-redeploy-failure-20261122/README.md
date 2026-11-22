# 特殊移动落点、返回与技能接续

2026-11-22 补核 [Case 24 特殊移动](../../cases/24-deployment-cost-and-supply.md#特殊移动的结束原因)。[result.json](result.json) 保存选定的原生分支、指令字节、能力类型继承关系和客户端指纹。[prefab.json](prefab.json) 保存实际技能、角色组件、Buff 程序和资源指纹。方法摘录以同版本相邻的已知方法地址为反汇编边界，只保存所列指令区间。结论适用于当前客户端静态分支，实战中的临时条件或 XLua 替换未验证。

| 问题 | 原件选择 |
| --- | --- |
| 同一卡创建、费用和回收 | `Character.MoveLikeRespawnSelf#77285` 在 `0x180aa1c01–0x180aa1c5d` 以原因 `0xb` 结束旧实例再创建；`Character._MoveLikeRespawn#77287` 在 `0x180aac45e–0x180aac4a2` 取原 Card，`0x180aac51f` 写入 `freely=true`，`0x180aac52d` 调用 `Deck.SpawnCharacterOrToken#66755`。`0x1806fd28b` 和 `0x1806fd569` 随该标记跳过普通 DP 余额检查与扣费，实际路径仍调用 Card 的 `CheckDrawable`，成功分支也保留有条件的 `Draw`。`BattleController.OnCharacterFinished#65741` 在 `0x180658f8d–0x180658f93` 为 `0xa/0xb` 跳过普通回收。后检创建失败才进入 GameMode 的失败入口，其默认实现 `DefaultGameMode.OnCharacterRespawnFailed#84168` 在 `0x180c9dd03` 回收 Card。 |
| 乌尔比安去程尝试当前格，返回失败 | 既有角色文件绑定 `UlpiaS3Ability`。`OnProjectileReached#95993` 在 `0x180fffe0f–0x180fffe4d` 检查锚点、尝试第二候选，再回退到宿主格。实际两份技能根均绑定 `UlpiaS3CastSkill`；`_RespawnToLocatedPos#74456` 在 `0x1809d4354–0x1809d4403` 查原格角色、所属 Card 与 Buff，`0x1809d452d–0x1809d4549` 进入 Suicide 分支。技能根、角色组件及相关 Buff 见[现行绑定](../redeploy-state-and-repeater-20261122/result.json)。 |
| 思衡托落点先验判定和友方 Card 的待投放分支 | 实际角色包中 `projectile_chr_kalts2_s3_2` 对应组件的 `_extraActions` 先调用 `Kalts2S3CheckAbleToLand`，随后保存技能剩余进度、待投放 Card 的身份并进入 `RespawnCharacter` 的 Self 分支。`Kalts2S3CheckAbleToLand.Execute#102649` 在 `0x1812121df–0x181212283` 检查落点占位者归属，必要时移除它。`0x181212326` 检查 `BuildCondition`，拒绝后 `0x181212366` 对技能宿主调用 `Suicide`。`Kalts2StatesRecorder.OnOwnerFinish#74010` 在 `0x1809b6236` 特判原因 `0xb`，普通分支移除已登记 Card 的临时限制后处理惩罚 Buff。`Kalts2S3RegisterExtraBuildableChecker#74014` 在 `0x1809b5ebc–0x1809b5ed2` 创建并安装 CardBuff，再于 `0x1809b5f38` 绑定附加部署检查。 |
| 思衡托重新部署后的恢复与已知清理入口 | 角色公共能力 `TryRestoreSkill` 安装 `kalts2_try_restore_skill`。Holder 会在共享 `kalts2_respawn > 0` 时调用 `RestoreCharacterSkillStates#102822`，由 `0x18122d710` 进入 `RestoreSkillProgress`。`Kalts2StatesRecorder.OnInit#74009` 在 `0x1809b607c–0x1809b60eb` 按实际配置的 `kalts2_restore_skill_progress` 读取保存的待投放 Card。接续计时结束后，`SkillProgressHooker.OnTick#74055` 在 `0x1809bcb3d` 进入中断程序，并于 `0x1809bd48b` 安装 `kalts2_s_3_interrupt`。该 Buff 的 `ON_BUFF_START` 结束相关 Card／Deck Buff、移除附加部署检查并清理记录。`Kalts2S3CancelExtraBuildableChecker.Execute#102344` 在 `0x181211d70` 调用记录器，`0x1809b5d05` 和 `0x1809b5d2d` 移除两张记录 Card 的附加部署检查。上述分支没有闭合特殊离场后创建失败，到下次部署时解除待投放的最后一次派发。 |
| 思衡托实际技能恢复与狂躁计数 | `skchr_kalts2_3` 的 `SkillProgressHooker` 绑定 `kalts2_s_3[restore]`。`RestoreSkillProgress#74051` 先在 `0x1809bcd82` 恢复计时进度，再于 `0x1809bce6f` 安装该 Buff。Holder 在条件满足时通过 `_castDirectly=true` 请求 `RespawnBorn`。角色 `_commonAbilities.Array[0]` 直接指向该能力的 `EmptyAnimatedAbility`，其基类链为 `AbstractAnimatedAbility → EasyToStartAbility → AbilityStandard`。执行到标准 `ExecuteSpell` 的通知分支时派发的是该能力自己的 `SpellOn`。公共能力装配指定 `GENERAL`，标准狂躁的 `ATTACK_OR_SKILL` 不计入该能力。动画何时执行及其他观察者的过滤结果不在本次验证范围。 [Holder 配置](../redeploy-state-and-repeater-20261122/result.json#L2180) · [角色与技能组件](prefab.json) · [公共能力装配与狂躁过滤](../anger-family-20261117/native/README.md#已闭合的调用点与边界) |

现行绑定使用相同的 Windows x64 客户端。`GameAssembly.dll` SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata v29 SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。社区资料的固定页面版本及实际行为归 [Case 24](../../cases/24-deployment-cost-and-supply.md#特殊移动的结束原因)。

从仓库根目录复跑，可用 `--game` 指定具备相同指纹的安装。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/special-redeploy-failure-20261122/extract.py \
  --out /tmp/arkbattle-special-redeploy-replay.json

UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/special-redeploy-failure-20261122/extract_prefab.py \
  --out /tmp/arkbattle-special-redeploy-prefab.json
```
