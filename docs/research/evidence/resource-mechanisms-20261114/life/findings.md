# HP 应用与生命机制

本批记录原生事实，不决定 ArkBattle API。全部客户端结论限于记录指纹的普通 native 分支；资源引用证明实际内容选择，不代表实机运行观测。静态镜像、安装资源及 PRTS 版本分别记录。

## 1. 常规 HP、额外生命与负生命分别保存

当前 `Entity` 保存 `m_hp`（`+0x40`）、`m_es`（`+0x48`）、`minusHp`（`+0x180`）及 `maxMinusHpRatio`（`+0x188`）。负生命是独立的非负债务量，不是将 `hp` 字段允许为负。

- `get_maxMinusHp` #67447：当前 `get_maxHp() × maxMinusHpRatio`。
- `set_minusHp` #67444、`set_maxMinusHpRatio` #67446：各自写入对应字段；setter 本体不额外调整普通 HP。
- `Entity.alive` #67348：普通分支检查状态机运行和普通 HP 大于零；因此负生命路径会保留普通 HP，而不能把 debt 与普通 HP 合并后沿用这一资格判断。
- `SetHpInternal` #67625：启用负生命时，导致拟写 HP 非正的变化先进入债务累计；债务达到上限才派发该路径的归零前干预。正向 HP 变化先偿还债务，超过债务的部分才增加普通 HP。
- 不死处理发生在归零前干预后。负生命启用时，非 force 写入将债务限制到 `maxMinusHp − 1`，普通 HP 保留至少 1；普通路径则对 HP 使用相应下限。
- 最终归零判断同时检查普通 HP 与债务是否到上限。债务耗尽时把普通 HP 置零，再虚派发 `OnHpZero(noSource, skipReborn)`。不能只检查先前普通 HP 是否已经变成零。

直接位置：#67625 的 `0x18072eaa3` 读取债务上限；`0x18072ece4` 写债务；`0x18072ed21` 比较债务上限；`0x18072ed51/7e` 进入归零干预；`0x18072ee16–eee4` 处理正向恢复与偿债；`0x18072ef21–efa4` 处理负生命的不死下限；`0x18072f205–297` 判定终结并进入归零回调。完整方法见 `native.json`，字段布局见 `inventory.json`。

实际使用已从 `char_1044_hsgma2` 的 Talent 1 PassiveBuffAbility（PathID `2269239921198506466`）闭合到 `hsgma2_t_1` 模板。模板开始时执行 `SetMaxMinusHpRatio(BUFF_OWNER, 1)`；周期通过 `CheckIfAtMinusHpState` 决定安装自回／禁疗效果。对应执行节点为 #102154、#102124；不是仅因 metadata 存在该字段而推定需求。

债务累计不能概括成“普通 HP 允许为负”或“每一击固定少损失 1”。对 #67625 此分支中的归零请求量 `d = abs(requestedHp − oldHp)`：旧普通 HP 大于 1 时写入 `minusHp = d − oldHp`；旧普通 HP 不大于 1 时写入 `minusHp = oldMinusHp + d`。之后普通 HP 的非 force 下限为 1。PRTS 生命值页的每击数值概括不足以代替这两条分支；本批没有用实机数字实验宣称两者完全等价。

债务写入位于归零前回调**之前**；该分支也不经过普通无债务路径读取 `isCancelled`、重新合成拟写 HP 的那一段。因而不能用“归零请求被取消”概括为先前债务写入自动回滚；本次回调新增不死后的债务上限处理仍是另一步。

MaxHP 变更也不能直接推成债务永远不变。父批 `death-attributes/attribute-recomputation.json` 的 `Entity.OnAttributeDirty` #67699 通过普通 `set_hp(currentHp / oldMaxHp × newMaxHp)` 同步 HP；而普通 setter 会先偿债。因此“HP 为 1、最大生命翻倍时拟恢复到 2，可能先偿还 1 债务”是两段原生代码的组合推导，尚非实机观测。债务 setter 本体不按比例缩放，与完整 MaxHP 变更没有后继影响，是两种不同结论。

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

上述实际组件、同一 GameObject 身份与 PPtr→MonoScript 绑定保存在 `content.json`；完整模板保存在 `templates.json`。HP setter 的取消续接、force 与不死分支保存在 `native.json`。

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

实际根对象 PathID `2025451907330735734`／`8739512195532306877` 及脚本 PPtr 在 `content.json`；完整派生方法和字段在 `native-specializations.json`。其他 HP 应用派生实现与配置分布在 `native-overrides.json`、`prefab-policy-scan.json` 单独核对，不由这两个对象推断所有物件行为相同。

额外派生实现已找到实际资源，而不是只留下类名：`PropLikeStaticBlockToken` #78604 对应 `token_10055_phatm2_mndclv`（迷狂牢笼，PathID `6352044219529720151`），有来源属于自己阻挡列表的接收条件，再走每击减 1；酒神原始角色配置将其绑定为 S1／S3 的 `overrideTokenKey`。`PropLikeTrap` #78622 对应 `trap_246_bigbtle`，也有 HP 负向 Modifier 的每击减 1 分支。后者本批仅闭合到实际 Prefab，不把此资源存在写成某一关卡已执行。它们都不能由次数盾代替；完整正文见 `native-overrides.json`。

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

`RebornTalent.AssignData` #74760 消费原始黑板 `duration`、`hp_ratio`、`max_respawn_cnt`、`after_wave_cnt`、`min_hp_ratio`，因此不能只统计 Prefab 序列化默认值就判断某项一直为默认或无用。`_OnRebornAfterFakeDeath` #74767 根据当前轮选择已附着处理 Ability，按配置触发／分离；`_OnAfterReborn` #74768 可结束仍在施放的处理 Ability。完整体及字符串解析见 `native.json`、`literals.json`。

## 6. 主动复活与集结点恢复有独立入口

### ManualTriggerRebornTalent

该类普通 `CheckReborn` #74716 总是失败；主动 `CanBeManualTriggered` #74717 才检查和消耗次数、返回数据。`SwitchToRebornState.Execute` #102430 找当前有效的该类天赋，成功后调用同一 Unit 的虚 `OnReborn`。因此“HP 归零时不自动复活”不能推成“对象没有复活能力”。

实际 `enemy_1288_duskls` 主模式有普通 RebornTalent（mode 1），道具模式有 ManualTriggerRebornTalent（mode 0，PathID `-4178707869654469388`）。道具模式实际登记的 `enemy_duskls_revive_listener` 在事件 2 进入 `SwitchToRebornState` 并恢复原 MaxHP；开始时会先保存原 MaxHP 并改为道具用值。完整模式、PassiveBuffAbility、原始程序已保存，不能仅根据名为“复活”的技能概括这条路。

本指纹 #102430 普通 native 完整体只读取节点的 `_targetType`（偏移 `+0x10`），未读取 `_isForce`（`+0x14`）。Holder 的实际 duskls 程序该字段为 true，spnwiz 程序为 false。该事实只支持“此 native 分支未消费该字段”，不支持擅自宣布字段在全部热更／客户端中废弃。

### RallyPoint 不是 Unit 完整死亡

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

实际 RebornTalent PathID `5244788638733915618`、首个 passive `-2084070266286156318`、`crab_switch` Ability `2351807352474260962` 和全部 PPtr 都在 `content.json`。`RallyPointRebornTalent` #74751/52 绑定的是宿主 Ability 首个 passive Buff 身份，用它提供恢复进度；不是借用 RebornTalent 的 HP 归零计数器。

伺夜狼群另有生命层数和较早取消致命 Modifier 的程序，不应仅因为根脚本同为 RallyPoint 就与豆苗逐节点合并。`vigil_wolf_t_1[listener]`、`vigil_wolf_t_1[reborn]` 全文已保留；本批用豆苗闭合基础入口，不宣称已逐一验证所有召唤物技能。

## 7. force、来源与最终结束的界限

`Entity.SetHpInternal` #67625 的参数为 `(value, force, noSource, skipReborn)`，虚槽 111。force 不是“跳过全部生命程序”：请求非正 HP 且容器存在时仍构造 TrySetHpZero 并通知；它影响已结束对象的入口资格、取消后是否保留本次变化、以及后续不死下限。普通非 force 的保护结论不能直接套在 force 上。

Setter 本体不修改 BattleContext 来源栈；最后将 noSource、skipReborn 原样传给虚 `OnHpZero`。noSource 与不记击杀归属不是同义词。实际最终 OnFinish／GameMode 回收、普通死亡与强制死亡区别由父批 death-attributes 专项闭合，本文件不把 `FinishMe` 简写成即时物理注销。

## 8. 完整性边界与仍需标明的未知

- 本批元数据清单包含生命相关方法及相关类型完整普通方法集合；不是“几个 setter 的搜索结果”。完整方法与字段、当前包来源、所选模板全文分别保存在 inventory、native、content、templates 原件中。
- Prefab 政策扫描覆盖本机全部 `charpack/*.ab`、`battle/enm_pfb*.ab`、`pkgrps/btl_pfb_tokens_*.ab` 与明确列出的额外包；最终 517 包，零解码失败。只对所列精确脚本作统计，不推断未扫描玩法资源或动态热更不存在。
- `TakeDamageMoveBackEnemy` 普通正文已保存；当前上述资源池未找到该脚本实例。没有把“无命中”改写成全局废弃，更未为此决定 Core 不实现。
- 生息演算的 SandboxResTrap／SandboxV3ResTrap 专属 HP 改写、保全派驻的 Legion 专属恢复、船运寻路不纳入本批普通玩法实现目标。发现相关节点会保留归属，不用它们替代普通内容的正例；这也不排除相同底层节点在普通玩法另有用途。
- 所有“实际内容”指静态配置中可追溯的选择与执行程序。没有运行当前客户端观察 XLua 动态替换，也没有把纯静态代码推导写成数值实测。上述债务／MaxHP 交互、模式切换期间 Ability 已在施放时的结果都按此区分。
- 不在本批决定 ArkBattle 要复制、简化或排除哪些一般机制。Consumer、动态不死、特殊固定扣血、同实例复活、集结点模式与最终结束是已经证明有不同输入／时点的原生需求，后续架构应整体评估。
