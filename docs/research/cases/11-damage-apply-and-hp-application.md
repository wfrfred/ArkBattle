# HP 应用、生命干预与生命流失

核对日期：2026-11-14。本文集中记录 HP、额外生命、负生命、免死竞争、不死、替身、复活、特殊提交与生命流失。普通 native 原体与实际内容绑定见[本轮生命证据](../evidence/resource-mechanisms-20261114/life/README.md)；调用分类／权限见[案例38](38-damage-classification-and-permissions.md)，最终死亡归属及属性范围见[案例39](39-death-attribution-and-attribute-ranges.md)。完整覆盖与证据边界见[案例37](37-resource-mechanism-coverage.md)。

当前客户端 DLL 为 `cf7956bf…cf76ff`、metadata 为 `e58fb854…f9caa5`。旧版方法／模板原件保留在各自批次，但本文以当前匹配绑定解释机制；不以旧角色归属或 Wiki 概括覆盖当前原体。所有客户端结论均为静态 native 分支，未运行游戏、未验证活跃 XLua。程序绑定、控制流推导、实机观测不混称。研究没有批准简化或排除普通玩法机制。

## 1. 常规 HP、额外生命与负生命分别保存

当前 `Entity` 保存 `m_hp`（`+0x40`）、`m_es`（`+0x48`）、`minusHp`（`+0x180`）及 `maxMinusHpRatio`（`+0x188`）。负生命是独立的非负债务量，不是将 `hp` 字段允许为负。

- `get_maxMinusHp` #67447：当前 `get_maxHp() × maxMinusHpRatio`。
- `set_minusHp` #67444、`set_maxMinusHpRatio` #67446：各自写入对应字段；setter 本体不额外调整普通 HP。
- `Entity.alive` #67348：普通分支检查状态机运行和普通 HP 大于零；因此负生命路径会保留普通 HP，而不能把 debt 与普通 HP 合并后沿用这一资格判断。
- `SetHpInternal` #67625：启用负生命时，导致拟写 HP 非正的变化先进入债务累计；债务达到上限才派发该路径的归零前干预。正向 HP 变化先偿还债务，超过债务的部分才增加普通 HP。
- 不死处理发生在归零前干预后。负生命启用时，非 force 写入将债务限制到 `maxMinusHp − 1`，普通 HP 保留至少 1；普通路径则对 HP 使用相应下限。
- 最终归零判断同时检查普通 HP 与债务是否到上限。债务耗尽时把普通 HP 置零，再虚派发 `OnHpZero(noSource, skipReborn)`。不能只检查先前普通 HP 是否已经变成零。

直接位置：#67625 的 `0x18072eaa3` 读取债务上限；`0x18072ece4` 写债务；`0x18072ed21` 比较债务上限；`0x18072ed51/7e` 进入归零干预；`0x18072ee16–eee4` 处理正向恢复与偿债；`0x18072ef21–efa4` 处理负生命的不死下限；`0x18072f205–297` 判定终结并进入归零回调。完整方法见 [native.json](../evidence/resource-mechanisms-20261114/life/native.json)，字段布局见 [inventory.json](../evidence/resource-mechanisms-20261114/life/inventory.json)。

实际使用已从 `char_1044_hsgma2` 的 Talent 1 PassiveBuffAbility（PathID `2269239921198506466`）闭合到 `hsgma2_t_1` 模板。模板开始时执行 `SetMaxMinusHpRatio(BUFF_OWNER, 1)`；周期通过 `CheckIfAtMinusHpState` 决定安装自回／禁疗效果。对应执行节点为 #102154、#102124；不是仅因 metadata 存在该字段而推定需求。

债务累计不能概括成“普通 HP 允许为负”或“每一击固定少损失 1”。对 #67625 此分支中的归零请求量 `d = abs(requestedHp − oldHp)`：旧普通 HP 大于 1 时写入 `minusHp = d − oldHp`；旧普通 HP 不大于 1 时写入 `minusHp = oldMinusHp + d`。之后普通 HP 的非 force 下限为 1。PRTS 生命值页的每击数值概括不足以代替这两条分支；本批没有用实机数字实验宣称两者完全等价。

债务写入位于归零前回调**之前**；该分支也不经过普通无债务路径读取 `isCancelled`、重新合成拟写 HP 的那一段。因而不能用“归零请求被取消”概括为先前债务写入自动回滚；本次回调新增不死后的债务上限处理仍是另一步。

MaxHP 变更也不能直接推成债务永远不变。[属性变更原体](../evidence/resource-mechanisms-20261114/death-attributes/attribute-recomputation.json) 的 `Entity.OnAttributeDirty` #67699 通过普通 `set_hp(currentHp / oldMaxHp × newMaxHp)` 同步 HP；而普通 setter 会先偿债。因此“HP 为 1、最大生命翻倍时拟恢复到 2，可能先偿还 1 债务”是两段原生代码的组合推导，尚非实机观测。债务 setter 本体不按比例缩放，与完整 MaxHP 变更没有后继影响，是两种不同结论。

额外生命的治疗来源、溢出许可及实际休谟斯／医生例由本批 recovery-elemental 专项记录。生命提交端 #67683 先以 ES 抵扣负向 Modifier，剩余变化才进入 HP setter；治疗超额路径另受独立的共享标记限制。ES 不是次数盾或伤判屏障的另一名称。

## 2. 普通免死的竞争及专属后继

`ConsumeTrySetHpZeroModifier.Execute` #100294 先要求本次目标类别正确且尚未取消，再按 `_dontConsumeWhenUndeadable` 检查宿主已有不死；成功时取消归零请求。`_blockThisHpSet` 决定是否将本次保留的 HP 变化改成零。

`BuffContainer.OnBeforeTrySetHpZero` #66423 记录首个成功 consumer，仍继续派发后续候选；后续普通 Consume 自身因已取消而失败。`OnPostTrySetHpZero` #66424 携带该 consumer，`IsConsumerOfTrySetHpZeroModifier` #100291 供程序判断自己是否成功。它们不构成全部生命干预共用的“处理完毕”开关。

当前实际内容至少存在两种普通免死 HP 应用政策：

| 内容 | 实际程序 | 应用区别 |
| --- | --- | --- |
| 史尔特尔天赋 | `char_350_surtr/Talents/2` → `surtr_t_2` | `_blockThisHpSet=false`、`_dontConsumeWhenUndeadable=true`；Post 成功者安装不死并结束旧保护 |
| 号角天赋 | `char_4039_horn/Others/Direction/Talents/1` → `horn_t_1[muso]` | 同样保留本次变化，成功者结束一次性保护后安装变更 MaxHP／攻速／防御与恢复的后继 |
| 斯卡蒂 Y 模组 | `skadi_equip_1_*_p1` → `skadi_e_muso` | 相应模块资源实际安装该保护，不能用旧 Wiki 的提前预判例子代替其当前事件 27／82 程序 |
| 信仰搅拌机 S2 | `skchr_rmixer_2` ActiveBuffAbility → `rmixer_sk2` | `_blockThisHpSet=true`；成功时保留原 HP，消耗弹药；不是先承受原伤害再回复 |

上述实际组件、同一 GameObject 身份与 PPtr→MonoScript 绑定保存在 [content.json](../evidence/resource-mechanisms-20261114/life/content.json)；完整模板保存在 [templates.json](../evidence/resource-mechanisms-20261114/life/templates.json)。HP setter 的取消续接、force 与不死分支保存在 [native.json](../evidence/resource-mechanisms-20261114/life/native.json)。

锁血另有修改权限语义。`HpNoLessThanCertainPercentModifier.Execute` #100255 调整数值时还管理共享标记 16；`Modifier.set_value` #72157 在该标记有效时拒绝普通写值。煌 `huang_t_1` 是实际使用例，不能从“仍派发后续伤判”推导“后续一定能够改写该值”。数值改写权限及标记精确分支由本批 damage 专项继续记录。

## 3. 替身切换与普通免死不是同一种执行程序

### 若叶睦与结城理必须分别记录

固定角色表明确：`char_4183_mortis` 是若叶睦，`char_4217_makoto` 是结城理。此前把 `makoto_tr` 写成若叶睦的原生模板是身份归属错误。

- 若叶睦实际 `char_4183_mortis/Others/Direction/Talents/-1` 的 PassiveBuffAbility（PathID `-796464561225199805`）安装 **`mortis_tr`**。该模板在事件 27 的本体分支中**没有 Consume 节点**：直接创建派生不死 `mortis_tr_undead`，再尝试触发 `mortis[switch2stand]`。已有不死不是这条模板进入切换尝试前的 Consume 排除条件。
- 结城理实际 `char_4217_makoto/Others/Direction/Talents/-1` 的 PassiveBuffAbility（PathID `361641197296733733`）安装 **`makoto_tr`**。该模板根据模式和技能选择设置切换资格，使用 `_dontConsumeWhenUndeadable=false` 的 Consume，再选择相应的 `makoto[switch2stand_s1/s2/s3_*]`。这才能证明这个非默认 Consume 配置在实际角色中使用。
- 贝娜 `bena_tr` 则使用 `_dontConsumeWhenUndeadable=true` 的普通 Consume，再安装派生不死并尝试切换。不能把三者归成完全相同的免死竞争关系。

### 切换有明确的保留与重建

贝娜与若叶睦的实际开始／结束切换程序调用 `ClearAllBuffs`，但并非字面上的“清除所有 Buff”：

- 贝娜 `bena_switchbegin/end` 有各自 `_retainedBuffsWhenClear` 白名单；`_alsoRemoveDurableBuff=false`。
- 若叶睦 `mortis_switchbegin`、`mortis_switchbegin_2`、`mortis_switchend` 也有白名单，保留 trait、部分 S1 核心、自身标记、暗盾、fever 等指定效果，并保留 durable Buff。
- 开始程序还执行具体技能／能力中断、技力清空和 `OnRallyPointLikeReborn`；结束程序再次清理后切换模式。程序与当前技能／模式相关，不能用 Unit 完整离场替代。
- `ClearAllBuffs.Execute` #98537 根据白名单进入 `BuffContainer.ClearWithWhiteList`，否则进入 `Clear`；`OnRallyPointLikeReborn.Execute` #102356 的 Character 路径调用 #77383，后者包含外部关系通知、重新启用主碰撞体和重新生成 Deck Buff。

是否进入同一个 Ability、是否拒绝重启正在施放的切换、具体动画事件何时恢复 HP，按实际所选 Ability 及事件程序分别核对；不把模板的 TriggerAbility 尝试直接写成无条件完成切换。

## 4. 每击固定减少 HP 的实际派生实现

小说卷轴 `enemy_1198_msfshu` 与诗画卷轴 `enemy_1198_msfshu_2` 的实际脚本都是 `PropLikeEnemy`，不是普通 Enemy setter 的纯配置变体。

`PropLikeEnemy.DoApplyModifier` #78593 在所配置模式下处理 HP Modifier：先按 `_acceptSpecificDamageType`／`_acceptDamageType` 筛选，负向 `finalDelta` 通过后调用普通 `set_hp(currentHp − 1)`，将该 Modifier 的 `realDelta` 写为 `−1`。它没有把原 `value` 改成 1，也没有改写来源计算结果。非负 HP Modifier 在该分支不增加普通 HP；不在所配置模式时可回退普通 `Entity.DoApplyModifier`。

当前小说卷轴 Prefab `_acceptSpecificDamageType=false`、`_onlyAffectSpecificModeIndex=false`，所以这两个过滤开关不会在本例限制为单一伤害类型或模式。Setter 仍可进入普通不死／归零干预，不能将固定损失解释为跳过所有生命机制。

实际根对象 PathID `2025451907330735734`／`8739512195532306877` 及脚本 PPtr 在 [content.json](../evidence/resource-mechanisms-20261114/life/content.json)；完整派生方法和字段在 [native-specializations.json](../evidence/resource-mechanisms-20261114/life/native-specializations.json)。其他 HP 应用派生实现与配置分布在 [native-overrides.json](../evidence/resource-mechanisms-20261114/life/native-overrides.json)、[prefab-policy-scan.json](../evidence/resource-mechanisms-20261114/life/prefab-policy-scan.json) 单独核对，不由这两个对象推断所有物件行为相同。

额外派生实现已找到实际资源，而不是只留下类名：`PropLikeStaticBlockToken` #78604 对应 `token_10055_phatm2_mndclv`（迷狂牢笼，PathID `6352044219529720151`），有来源属于自己阻挡列表的接收条件，再走每击减 1；酒神原始角色配置将其绑定为 S1／S3 的 `overrideTokenKey`。`PropLikeTrap` #78622 对应 `trap_246_bigbtle`，也有 HP 负向 Modifier 的每击减 1 分支。后者本批仅闭合到实际 Prefab，不把此资源存在写成某一关卡已执行。它们都不能由次数盾代替；完整正文见 [native-overrides.json](../evidence/resource-mechanisms-20261114/life/native-overrides.json)。

## 5. HP 归零后的复活是同一实例的另一条生命周期

### 从归零入口到复活状态

`Unit.OnHpZero` #79030 并不无条件进入最终死亡。`skipReborn=false` 时调用 `Unit.CheckReborn` #79009；后者遍历当前天赋，取得第一个成功的复活数据。没有成功数据，或 `skipReborn=true`，才调用 `Entity.OnHpZero`。这条分流发生在同一 Unit 上，不是先完整注销后再创建新 Unit。

`RebornTalent.CheckReborn` #74763 检查可选的 `_validWhenContainsBuff`、剩余次数，成功后增加天赋自己的计数及 `Entity.respawnCnt`，返回本次的 `RebornData`。负最大次数表示不受次数上限限制。首轮和后续轮可取不同的模式、处理能力及恢复配置；不能只保存一个“已复活过”布尔值。

成功后虚派发 slot 188。实际 Character／Enemy 使用各自覆盖：

```text
Unit.OnHpZero
  → CheckReborn
  → Character.OnReborn #77335 / Enemy.OnReborn #77787
      → DoFakeDeath（slot 184）
      → 构造 RebornState，并切入状态机
  → RebornState 推进等待
  → DoReborn（slot 185）
```

不能把基类 `Unit.OnReborn` #79031 的 `DoFakeDeath → 立即 DoReborn` 用来描述这两个真实派生对象。`Character.DoFakeDeath` #77279 先清空出向阻挡；`Enemy.DoFakeDeath` #77798 调用 `ReleaseBlock`。随后 `Unit.DoFakeDeath` #79010 按本次 `buffsRetainedWhenReborn` 白名单清 Buff，清理持有的表现 Effect，通知外部事件并派发保留 Buff 的 `OnOwnerReborn`。这不是 Unit 正常离场的全部业务。

### 复活等待和最终恢复

`Character/States/RebornState` 与 Enemy 同名状态各自保存 `remainingTime`、本次 `RebornData`。状态提供的普通异常掩码分别为 `0x28` 和 `0x128`，即包含 BLOCK_FREE、INVINCIBLE，Enemy 另含 UNBALANCE_IMMUNE；这些是该状态的贡献，不能忽略其他有效反制后称它们为不可覆盖的最终资格。

普通计时比较使用严格 `remainingTime < deltaTime` 才完成，否则减去本次 delta。Enemy 另支持波次门控：进入时保存 `Scheduler.spawnedWavesCnt`，推进时只有当前计数 **大于** `entryCount + rebornAfterWaveCnt` 才继续剩余时间判断。应保留这里的原始比较，不在不了解 Scheduler 计数起点时直接翻译成“等一波”。

Enemy 的 `keepAlive` 路径在进入复活状态时以 force 将 HP 置 1；普通路径不作这次写入。状态退出清理自己添加的属性贡献及所持有的表现产物。`clearEffectsAfterReborn` 指向状态保存的表现 Effect 列表，不是另一项“清除所有战斗 Buff”的政策。

`_PlayAnimation` #77560／#78146 的名称不能作为纯表现的证据：它还建立真正写 HP 的恢复插值。持续时间为 `Clamp01(hpRechargeRatio) × rebornTime`，延迟到本次复活时间的最后这一段开始。非确定性路径使用 DOTween，确定性路径使用 BattleTween；回调 #77562/63、#78148/50 均会把当前 MaxHP 乘插值比例，虚调用 `SetHpInternal(force=true)`。因此原生复活期间可已有渐进 HP 写入，不能只记录结束时的一次恢复。如何在项目中分离动画与实际恢复，是后续设计问题，本批不自行删除该状态语义。

`Unit.DoReborn` #79011 才派发复活后事件、以本次 `hpRatio × 当前MaxHP` 强制写回 HP、切换本次 mode 并添加指定 Buff。`Character.DoReborn` #77280 随后启动普通状态机；`Enemy.DoReborn` #77799 还重新初始化敌人技能并通知 BattleController。这里的 mode、当前 MaxHP、Buff 与技能初始化有真实顺序，不等同于任意 HP 恢复。

### 实际配置说明这些分支确实有用

| 实际内容 | 绑定与非默认配置 | 证据范围 |
| --- | --- | --- |
| 霜星／霜星“冬痕” | `enemy_1505_frstar`／`enemy_1510_frstar2` 的 RebornTalent；最多 1 次，冬痕改到 mode 1；原始黑板分别有 `reborn.duration=5/10` | Prefab、原始 EnemyData、4-10 的真实 DB／SPAWN 引用 |
| 屠谕者，大群意志 | `enemy_1529_dsdevr/Talents/Reborn`，PathID `1481962230876378660`；`rebornAfterWave=true`、`MarkP2`，后续 presets 改用 MarkP3/4 与 mode 3/5 | Prefab 完整组件、ExtraAbilities 引用、不同等级黑板的最大复活次数 1／3、实际关卡引用 |
| `enemy_1562_cjtaot` | RebornTalent PathID `8023359325304706546`；`keepAlive=true`、白名单保留地块标记、处理能力 Reborn | Prefab 实际同对象能力、原始黑板 `Reborn.duration=30`；不靠普通霜星分支推测此参数 |
| 酣睡飞行员 | `enemy_1595_agbmes`，PathID `-2824917765930982313`；实际设置 `detachAbilityWhenReborn=true`、保留两个指定 Buff，黑板 `hp_ratio=.01`、`duration=1.87` | Prefab／同对象处理能力与 EnemyData；不是全扫描中随便一个模板名 |

`RebornTalent.AssignData` #74760 消费原始黑板 `duration`、`hp_ratio`、`max_respawn_cnt`、`after_wave_cnt`、`min_hp_ratio`，因此不能只统计 Prefab 序列化默认值就判断某项一直为默认或无用。`_OnRebornAfterFakeDeath` #74767 根据当前轮选择已附着处理 Ability，按配置触发／分离；`_OnAfterReborn` #74768 可结束仍在施放的处理 Ability。完整体及字符串解析见 [native.json](../evidence/resource-mechanisms-20261114/life/native.json)、[literals.json](../evidence/resource-mechanisms-20261114/life/literals.json)。

### 主动复活与集结点恢复的独立入口

#### ManualTriggerRebornTalent

该类普通 `CheckReborn` #74716 总是失败；主动 `CanBeManualTriggered` #74717 才检查和消耗次数、返回数据。`SwitchToRebornState.Execute` #102430 找当前有效的该类天赋，成功后调用同一 Unit 的虚 `OnReborn`。因此“HP 归零时不自动复活”不能推成“对象没有复活能力”。

实际 `enemy_1288_duskls` 主模式有普通 RebornTalent（mode 1），道具模式有 ManualTriggerRebornTalent（mode 0，PathID `-4178707869654469388`）。道具模式实际登记的 `enemy_duskls_revive_listener` 在事件 2 进入 `SwitchToRebornState` 并恢复原 MaxHP；开始时会先保存原 MaxHP 并改为道具用值。完整模式、PassiveBuffAbility、原始程序已保存，不能仅根据名为“复活”的技能概括这条路。

本指纹 #102430 普通 native 完整体只读取节点的 `_targetType`（偏移 `+0x10`），未读取 `_isForce`（`+0x14`）。Holder 的实际 duskls 程序该字段为 true，spnwiz 程序为 false。该事实只支持“此 native 分支未消费该字段”，不支持擅自宣布字段在全部热更／客户端中废弃。

#### RallyPoint 不是 Unit 完整死亡

真实豆苗配置关联 `token_10014_bstalk_crab`；物理 Prefab 在 `pkgrps/btl_pfb_tokens_0.ab`，根脚本为 RallyPoint。完整链为：

```text
Crab 模式 PassiveBuffAbility → crab_s_1[listener]
  → 事件 27 切 Flower 模式
  → common passive crab_state_1 重新有效（包含 UNDEADABLE 等标记）
  → 普通 HP setter 后续按当前不死资格保留生命
Flower 首个计时 passive + RallyPointRebornTalent
  → crab_switch
  → crab_t_1[start]
  → RallyPoint.RecoverHpLikeReborn #78635
      → force 写回当前 MaxHP
      → Character.OnRallyPointLikeReborn
  → 切 Crab 模式
```

实际 RebornTalent PathID `5244788638733915618`、首个 passive `-2084070266286156318`、`crab_switch` Ability `2351807352474260962` 和全部 PPtr 都在 [content.json](../evidence/resource-mechanisms-20261114/life/content.json)。`RallyPointRebornTalent` #74751/52 绑定的是宿主 Ability 首个 passive Buff 身份，用它提供恢复进度；不是借用 RebornTalent 的 HP 归零计数器。

伺夜狼群另有生命层数和较早取消致命 Modifier 的程序，不应仅因为根脚本同为 RallyPoint 就与豆苗逐节点合并。`vigil_wolf_t_1[listener]`、`vigil_wolf_t_1[reborn]` 全文已保留；本批用豆苗闭合基础入口，不宣称已逐一验证所有召唤物技能。

## 6. 生命流失补核（2026-11-13）

本轮补齐物理、法术、真实流失的配置与客户端应用链。证据为 [hp-loss-settlement-20261113](../evidence/hp-loss-settlement-20261113/README.md)：客户端 DLL `cf7956bf…`、metadata `e58fb854…`，关卡镜像固定为 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。这是配置绑定与普通原生分支的静态核对，没有运行游戏，也没有验证 XLua 是否替换这些方法。镜像与安装资源各自记录版本，不宣称二者来自同一次发布。

### 6.1 实际配置与模板存在必须分开

| 类型 | 实际配置链 | 本轮确认 |
| --- | --- | --- |
| 物理流失 | `act26side_tr02` 预置 `trap_118_rockfl`，黑板指定 `enemy_1343_ltrock`；同关卡实际 SPAWN `enemy_3005_lpeopl`。落石 Prefab 的 `Talents/HitLpeopl` 具有启用的 Talent、Aura 及受选验证器；Aura 登记 `ltrock_hit[lpeopl]`，验证器要求 `mark_neutral[lpeopl]`，居民 Prefab 的 `NeutralTag` 实际提供此标记。 | 模板事件 0 执行 `FixedValueDamage(PHYSICAL, skip=true)`，读取 `hit_value`；不是将普通物理伤害误叫流失。这里核对到关卡配置、Prefab 和动作节点绑定，未把关卡运行中的具体碰撞当作实测。 |
| 法术流失 | `main_15-18` 实际 SPAWN `enemy_1565_mpprme`。其 Enemy 根组件的 `_modes` 引用 `FlyMode_Ray_P2`，该 Mode 的 `_generalAbilities` 引用名为 `Ray` 的能力。该 Mode 的 `FlyRay` 天赋登记 `enemy_mpprme_fly_ray`，其事件 32 同步触发 `Ray`；`Ray._activeBuffs` 登记 `enemy_mpprme_ray_damage`。 | 模板事件 2 执行 `AdvancedApplyDamage(MAGICAL, skip=true)`，比例键为 `ray_atk_scale`。这是已配置的实际模式／能力链；不声称本轮模拟了第 15 章模式切换机制。 |
| 真实流失 | `act12side_09` 实际 SPAWN 无人爆破艇。`enemy_1164_bmbmot/Talents/Bleed` 登记 `bmbmot_bleed`，实际使用模板 `periodic_damage_by_hp_ratio[skip_modifier_fix]`。 | 模板使用 `DamageViaMaxHpRatio(PURE, skip=true, _getMaxHpFromTarget=false)`；每次触发按来源最大 HP 比例形成一笔数额，触发周期由 Buff 配置另决定。 |

完整模板 Holder 共 9054 项，其中发现 196 个 `skip=true` 节点：8 个 PHYSICAL、6 个 MAGICAL，其余含 PURE 及非伤害节点。这个计数只描述当前 Holder，不证明每个模板均被实际内容使用。例如旧 `enemy_bmbmot_t` 虽含物理 skip 节点，当前无人爆破艇却绑定上表的 PURE 模板，因此不能拿旧模板当作该敌人的物理流失证据。归档仅保留选中的 13 个组件与 5 个模板；其余检索为紧凑索引。

### 6.2 防御公式与计算事件先于 skip 标记

选中节点的顺序为：

```text
读取固定数值、ATK 或最大 HP 比例
→ BattleUtil.CalculateDamageBy…
    → BattleFormula.CalculateDamage
        → 按参数决定来源／目标计算事件
        → CalculateDamageNoEvent → CalculateDamageInternal
        → 按参数决定来源计算后事件
    → NewDamageModifierAfterCalculate
→ 设置 SKIP_MODIFIER_EVENT
→ target.ApplyModifier
```

`CalculateDamageInternal`（65900，`0x180685790`）按 DamageType 分支：物理在 `0x180685b3a` 读取目标 `def`，法术在 `0x1806859ed` 读取 `magicResistance`；真实分支不使用这两项防御属性。`CalculateDamageNoEvent` 还根据来源及类型取得穿透参数。`FixedValueDamage` 在 `0x181102198/19f/1ca` 完成计算与 Modifier 构造，之后才在 `0x181102257` 设置 skip；`AdvancedApplyDamage` 同样在完成计算后设置标志。**跳过应用事件不等于跳过防御公式，也不等于跳过计算事件。**

计算事件还必须按具体分支判断：

- 落石配置 `_triggerOnCalculateDamage=false`，走 `CalculateDamageByAtkWithSourceNoOnCalDmg`：传给 `CalculateDamage` 的目标计算事件开关为 true、来源为 false。该名称中的 NoOnCalDmg 不能解释为目标计算事件也被关闭。
- 拟态机械射线采用非缓存、保留来源的普通 `AdvancedApplyDamage` 分支，`0x1810f5794` 调用 `CalculateDamageBySource`。该入口的正式计算开启来源与目标计算事件，另算无来源基准；不能由模板 `_emitSourceOnCalculateDamage=false` 推导这个分支不派发来源计算事件，该字段在其他构造分支才决定相应选择。
- 无人爆破艇的所选 `DamageViaMaxHpRatio` 在来源存在且 `_noSourceDamage=false` 时调用 `CalculateDamageByAtkWithSourceNoOnCalDmg`（`0x1811007bd`），否则调用 `CalculateDamageByAtkNoSource`（`0x181100823`）。两支的目标计算事件均开启、来源均关闭。节点不读取触发间隔，不能按旧 Bleeding 模板的每秒速率解释。

因此，不能用“生命流失”这个名称推出统一的计算 Hook 清单；伤害数值的来源、公式类型、计算事件参数与应用事件政策是不同事实。

### 6.3 skip 的精确接收与通知范围

`Entity.ApplyModifier`（67665，`0x1807211a0`）的普通分支如下：

```text
目标 alive；输入尚未取消（原生也将零值视为取消）
→ 检查 SKIP_MODIFIER_EVENT
    → 若还具有 SKIP_MODIFIER_CONSIDER_UNHURTABLE，检查消失／不可受伤并可取消
    → 目标 BuffContainer.OnApplyingSkippedModifier（事件 41）
→ 再检查取消
→ 来源存在时执行 BeforeTargetApplyModifier（事件 61）
→ GameMode.OnEntityApplyModifier 资格
→ 虚派发 DoApplyModifier
→ skip 路径不执行普通 OnAppliedModifier
```

关键位置：skip／额外不可受伤标志分别在 `0x1807212c8`／`0x180721353` 检查；目标 skip 接收入口为 `0x18072140e`，其 `Buff.OnApplyingSkippedModifier` 明确运行事件 41；取消复核为 `0x1807218da`；来源提交前程序为 `0x180721984`；实际资源派发为 `0x180721b08`；提交后的 `0x180721b2e` 再次检查 skip，绕过 `OnAppliedModifier`。

这条路径绕过目标普通应用前事件 5、来源输出事件 8、普通 `_OnApplyingModifier / OnTakeDamage`，也绕过普通应用后及来源伤害后通知。因此，普通受击 SP、在普通 OnTakeDamage 上登记的闪避／护盾／减伤／反伤不会仅因这笔流失自动参与；但事件 41 能修改／取消本笔 Modifier，来源事件 61 也仍可执行。不能把它概括成“无接收程序”或“无同步回调”。

消失与无敌沿用[案例 18](18-projectile-source-and-target-lifecycles.md)已核实的区分：普通 skip 不进入常规不可受伤伤判；同时设置 `0x8000` 时仍进行该检查。`IsUnhurtableWithModifier` 又有自己的免疫与 `0x100` 旁路条件，而消失并不等价于可用同一标志穿过的无敌。节点的 `_considerUnhurtable`、Modifier 的其他标志及内容自己的事件 41 必须分别看待。

### 6.4 HP 提交、致命干预与直接 setter

skip 不改变 HP 目标仍进入 `Entity.DoApplyModifier`（67683）的事实。普通 HP 分支读取提交时当前 HP／ES，取得 `finalDelta`，按已有 ES 规则处理，再在 `0x18072340f` 调用普通 `set_hp`。它没有因为 skip 改走 `SetHpDirectly`。

| 机制 | 所在阶段与边界 |
| --- | --- |
| 本次非致命标志 | `DAMAGE_IS_UNDEADABLE_THIS_TIME=8` 在 DoApplyModifier 中将拟写 HP 限制为至少 1，然后才进入 setter；不会因此产生一次实际归零请求。它与 skip 是不同标志。 |
| 普通归零前干预 | `set_hp` 虚派发 `SetHpInternal`（67625）。拟写值到零且存在容器时仍构造 `TrySetHpZero`，执行 `OnBeforeTrySetHpZero`；skip 没有在此取消这些调用。 |
| 不死下限 | 普通 setter 在归零前干预之后处理 `isUndeadable`，再限制最终 HP。不能把流失写成绕过不死，也不能把不死写成阻止全部前置生命程序。 |
| 生命归零与死亡 | HP 写入后仍可能同步调用 `OnHpZero → FinishMe / OnFinish`；skip 只绕过之后的普通 Modifier 应用后通知，不抑制该死亡链。普通内容的完整离场／回收时序仍按案例 27 的证据范围，不推广到全部重生或 GameMode。 |
| 提前致命预判、特殊 HP 改写 | 是否参与取决于具体程序登记在普通接收、事件 41、来源提交前还是 setter 上，不能仅凭 Wiki 的“生命流失”分类判定。本轮已补小说卷轴等派生提交，见第4节；具体归零组合由其真实setter调用判断，不以普通Entity分支替代。 |
| 直接 setter | `SetHpDirectly`／`SetHpInternalDirectly` 的所选普通分支跳过 Modifier 与 `OnBeforeTrySetHpZero`，但仍有 alive、不死下限和 HP 范围限制；写入值不大于零时仅将数值截为 0，不派发普通满值通知或 OnHpZero 死亡业务。它们既不等于普通生命流失，也不等于无条件写一个字段。 |

`SetHpInternal` 的当前关键位置为：构造归零请求 `0x18072eb83`，归零前派发 `0x18072ed51/7e`，不死检查 `0x18072ef21/efbc`，HP 写入 `0x18072f02b`，归零处理 `0x18072f297`，存在成功 consumer 且宿主仍 unfinished 时执行 Post `0x18072f2c9`。负生命等扩展分支在同一方法内，但本轮不借此声称穷尽其所有内容组合。

相邻核对：`OnFinish`（67653）在 `0x18072a16e` 读取 Torappu.Battle.Context，`0x18072a189..19d` 取其栈顶来源，并于 `0x18072a407` 调该来源的 `OnTargetKilled`。这里没有直接读取 Modifier 的 source／originalSource。来源栈写入、恢复与真实内容归属已在[案例39](39-death-attribution-and-attribute-ranges.md)补核；不能进一步将其等同其中某个Modifier字段。

### 6.5 对项目选择的约束范围

上述证据回答原生语义，不另定 ArkBattle API。已确认的项目 Calculate／Apply 划分、普通两侧 Applied 后再按最新 HP 确认死亡，以及同步重入规则保持不变。未来表达生命流失时需要分别保存公式与事件政策；不能以直接 HP 减法代替所有物理／法术流失，也不能机械复刻原生所有事件编号。特殊 HP 改写与提前致命预判的具体内容组合仍按各自证据决定，不以本次研究替换已定普通伤害时序。

## 7. 统一管线的实际内容对照（2026-11-13）

普通损伤与流失都使用现有 Calculate／Apply 和 Hook 集合，请求携带 `DAMAGE / LOSS` 业务性质，各机制通过 Rule／Hook 资格决定响应。本节记录支持该设计的内容对照；2026-11-14 已接入 nature 与独立 hitRecovery 许可，现行接口以 [Vitality 契约](../../architecture/vitality.md#12-请求与计算参数)为准，不按原生事件开关数量设计接口。

证据与复跑入口集中在 [hp-loss-hook-interactions-20261113](../evidence/hp-loss-hook-interactions-20261113/README.md)。N 表示实际配置绑定与普通原生调用链；W 表示社区资料；组合结果没有冒充本轮游戏内实测。

| 实际内容 | 原生结果与证据 | 对统一模型的判断 |
| --- | --- | --- |
| 华法琳 S2 与乌尔比安 | N：S2 实际配置使用 PURE skip 模板；乌尔比安各模式的受伤回血天赋绑定 `ulpia_t_2`，程序只在普通 OnTakeDamage 事件 10 执行。该流失绕过事件 10，因此不会触发回血。 | 将这项回血限定普通伤害即可保留结果，不需要另一套 Receiving。 |
| 华法琳 S2 与雷蛇 | N：雷蛇天赋的实际脚本为 `TriggerWhenTakenDamageAbility`，订阅 Entity 事件 12，还检查取消及 `ignoreForSp`。LOSS 不进入普通 OnTakeDamage，也不派发该事件。它不是原生 Applied 监听。 | `LOSS` 不触发这项回 SP；具体程序按接收语义接入，不因文案含“受伤后”就机械迁到 Applied。 |
| “睚”的分身退场与铃兰脆弱 | W：当前敌人正文明确，不消失时承受 35% 最大生命的普通真实伤害，消失时改为 35% 流失。2023-01-25 的 WB-EX-8 实战讨论解释铃兰 40% 脆弱下前者为 49%，后者仍为 35%。 | 真伤类型不够区分；`DAMAGE / LOSS` 加上脆弱的响应资格可表达。35%／49%为当前规则及历史社区反馈，不是本次客户端实测。 |
| 拟态机械射线与庇护 | N：第 6 节已闭合射线的法术 skip 分支与 RES 公式。W：淬羽赫默能提供庇护；普通庇护不降低流失。这是可共存内容的规则组合推导。 | 保留法抗计算，庇护的普通伤判不响应 LOSS；无需因忽略庇护就跳过整个 Calculate。 |
| 活性源石与乌尔比安／雷蛇 | N：真实地块绑定 `periodic_damage → NoSourceDamage(PURE, ignoreForSp=true)`，未设置 skip。普通接收只跳过 HIT 回 SP，仍派发事件 10，乌尔比安回血程序没有 `ignoreForSp` 门控；雷蛇自身检查该标记而不回 SP。 | 同属 DAMAGE 也存在不同响应资格。`nature` 不能替代 HIT／受击回复资格；这是与 LOSS 正交的既有需求，不是增加阶段开关的理由。 |

来源 Formula 另做了定向排查：9054 个模板中定位到 205 项来源计算事件 14 配置，再检查阿、华法琳、史尔特尔、红隼及 Sharp 的相关入口；**未找到能够闭合到实际执行、证明统一 Calculate 必须增加来源／目标派发开关的反例**。阿的倍率配置与周期自损虽均已定位，但倍率的实际存续窗口未闭合，不能声称自损会由 1% 变为 1.5%。排除条件与检索边界见证据中的 `source/README.md`。

这些实例支持统一管线与机制资格的设计方向。当前接口区分普通伤害／流失，并保留独立的普通 HIT 回复许可；“未找到来源计算反例”不是所有内容全局等价的证明。普通死亡顺序继续按既定项目选择，本节不重开其时序。

## 8. force 与最终结束

`SetHpInternal(value, force, noSource, skipReborn)` 的 force 不等于跳过全部免死：普通体仍可构造归零前请求，force 改变入口门控、取消续接与下限处理。noSource、skipReborn 继续传入虚 OnHpZero；同实例复活和最终 FinishMe 不等价。原体见本批 `native.json`，完整实际处决、撤退、来源通知和物理回收见[案例39](39-death-attribution-and-attribute-ranges.md)。

项目采用 Calculate 输出／Apply 接收、Applied 后确认死亡、Outcome.killed；这些已确认选择没有因此被更改。它们也没有自动表达 consumer、不死资格、债务、ES、替身或复活。后续架构必须据上述真实需求一起评估，不能用“已延期”证明普通 HP 提交完整。

## 9. 限定与实际使用边界

- 生命方法清单、HP相关派生覆盖、普通／主动复活与资源绑定已分别核对；不是仅按旧 TODO 搜索几种免死。
- Prefab政策扫描覆盖517包，零解码失败，包含 charpack、enemy 和 token 物理分包。零命中的 `TakeDamageMoveBackEnemy` 只说明该范围未找到实例，不证明废弃。
- 生息演算专属 HP 改写、保全派驻专属恢复与船运寻路属于既有排除范围；同节点是否在普通玩法使用仍分别检查，不按名字统一排除。
- 部分工具参数在 native 未被消费、部分只有未绑定候选；详见[覆盖表中的证据边界](37-resource-mechanism-coverage.md#4-没有被当作废弃或批准简化的项目)。未绑定不构成自行不实现的授权。
- 原生复活动画回调会写实际HP，本文保留了该事实。如何以逻辑时钟表达属于后续项目设计，不能以“不依赖动画”为由悄悄删除这项业务。
