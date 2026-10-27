# 案例 B：普通远程行动与投射物阶段

研究日期：2026-10-08。沿用 [本轮研究约束](00-INDEX.md)，只提取会影响可观察结果的调用协议，不复刻官方 coroutine 调度或 RNG 消费轨迹。

## 1. 样例与证据范围

本案主体是本机实际 `char_1035_wisdel` 的 `Modes/Default/Body/Attack`，以及它引用的 `projectile_chr_wisdel_default`。S3 只用于对照伤害取值策略，不展开完整技能。

**范围限制**：当前 `data/chess.json` 没有 `charId=char_1035_wisdel`。维什戴尔是此前用户讨论中选定的协议压力样例，不构成本季卫戍协议可达角色证明，也不自动扩展支持名单。仓库确有能天使 `chess_char_3_01_a/b → char_103_angel`，但本案没有进一步核对其能力 prefab，不能把同为远程职业当成同一引用链。

客户端与资源版本身份见 [持久化证据](../evidence/client-excerpts.json)。本案读了真实 prefab、IL2CPP metadata 与对应原生方法，没有执行 Lua/hotfix、战斗注入或实战录制。

下文区分三类结论：**证实**是实际字段及已经展开的分支；**推导**是这些证据要求项目保留的语义区别；**未核对**是没有补齐的外层调度、对象退场和动画路径。项目协议选择另行标明。

临时材料主要位于 `/tmp/stronghold-wisadel-research`；本案追加展开的主 coroutine 和取值方法位于 `/tmp/stronghold-official-pathfinding`。本文保留对象 ID、方法 index、地址及关键顺序，避免只依赖临时报告。

## 2. 实际引用链

普通模式 `Attack` 对象 `-3919129585840132641` 使用随机能力组，持有以下三个子能力：

| 路径 | 对象 ID | 实际选择 |
| --- | --- | --- |
| `Default/Body/Attack/Attack_A` | `-1978783587831353889` | 普通 `RangedAttack` |
| `Default/Body/Attack/Attack_B` | `-4191133412231909921` | 同一普通 projectile，动画 B |
| `Default/Body/Attack/Attack_C` | `3082456590823550431` | 同一普通 projectile，动画 C |

组的 `_abilities` 明确引用上述组件；它不是按显示名称查找攻击代码。三个子能力的协议相关字段相同，以下用 A 表示：

```text
_projectileKey = projectile_chr_wisdel_default
_selectTargetSource = INPUT_TARGET(2)
_selectTargetTiming = BEFORE_SPELL_START(1)
_alwaysIncludeTarget = true
_selector = null
_waitForAttackEvent = true
_interuptIfTargetDead = false
_waitForProjectileInvalid = false
_useCachedAtkOnly = false
_transferSource = false
_activeBuffs = [wisdel_t_1[bomb]]
```

投射物根 GameObject 为 `-3808210983750987232`，主组件为 `-5585397881333280224`。它包含独立运动、主段命中和停止时余震组件：

| 组件 | 对象 ID | 关键配置 |
| --- | --- | --- |
| 运动 | `5069541600172708384` | speed=10；到达后 delay=0.15；追踪目标位置 |
| 主段 `ScaleableHitBehaviour` | `3549973520629240352` | 到达时查命中；主目标额外倍率；无余震倍率 |
| 余震 `ScaleableHitBehaviour` | `-6367834235042393568` | 停止时查命中；余震倍率与主目标倍率 |

主组件配置 `_stopWhenSourceInvalid=false`、`_managedBySource=false`、`_alwaysReachInTheEnd=true`、寿命 5 秒。它们支持来源和投射物生命周期独立，但不证明所有离场方式都已走到同一行为。

## 3. 启动、前摇与实际释放目标

**证实**：`AbilityStandard.CastToTarget`（62617，`0x1805e2320`）先保存输入目标与输入位置，经启动检查，注册一次结束回调、重置计时器，再执行 `StartCastingInternal` 和 `_DoCast`。

`StartCastingInternal`（62581，`0x1805ea3e0`）写 `m_isCasting=true`、记录当前逻辑帧，再调用 `OnCastStart`。因此“已接受一次行动”是有状态的事实，尚不意味着伤害或投射物已经产生。

本次实际展开了 `AbilityStandard+<_DoCast>d__85.MoveNext`（62708，`0x1805f9b70`），不是从 callback 名字猜流程。其与本案相关的顺序为：

```text
启动 behaviour；通知 CAST_START
等待 OnWaitForPreDelay
owner.OnBeforeAbilitySpellOn
若 timing=BEFORE_SPELL_START：UpdateTargets(true)
失败：按无目标路径结束
成功：OnSpellStart
若仍在 casting：增加 spellCnt；判断是否还有一次 spell
最后一次后：输出结束相关动作；等待 OnWaitForPostDelay
FinishIfNot
```

前摇等待也已展开：`EasyToStartAbility+<OnWaitForPreDelay>d__16.MoveNext`（90872，`0x180ed6a00`）检查实际 `_waitForAttackEvent`；为 true 时等待来源 event pool 中事件 19，带最长等待时间。false 则走指定时间等待分支。

事件等待的注册、恢复和注销位于 `WaitForNextEvent` coroutine（90866，`0x180ed71d0`）。本案没有继续还原具体 Spine clip、事件 19 的生成器及其帧偏移，不能给出“第几帧一定释放”的官方数字；`_preDelay=0` 也不意味着没有前摇。

**证实**：前摇之后才执行上述 timing 的目标更新。但普通 A/B/C 的 source 是 `INPUT_TARGET`，selector 为空，`alwaysIncludeTarget=true`。`AbilityStandard.UpdateTargets`（62652）更新输入位置、重建 castTargets，最后按输入目标的当前存活条件补入它；这里没有重新从 owner 范围挑选另一个敌人。

所以至少有三个不同事实：启动传入的目标、释放阶段产生的 castTargets、投射物到达后的命中名单。`BEFORE_SPELL_START` 不能统一解释成“前摇结束后重新普通索敌”。

**未核对**：外层随机组在本季实际操作中的启动尝试频率、全部失败理由及冷却重置；本案不要求复刻无效目标尝试或动画变体的随机消费。

## 4. 发射时冻结什么，命中时又读取什么

`OnSpellStart`（62637）在实际目标检查后收集动作、Buff 和 attachment，并调用 `DoCastOnTargets`。`RangedAttack.OnCastOnTarget`（89818，`0x180ea4e10`）按 `_projectileDestination` 取得定位对象，普通值 0 使用目标 `hitMountPoint`，再调用 `CreateProjectile`。

`RangedAttack.CreateProjectile`（89829，`0x180ea3e40`）将实际 projectile key、owner、发射挂点、目标定位对象、ability 交给 `BattleController.CreateProjectile`。`Projectile._InitInline`（70497）保存来源、起点、追踪目标和 ability；这是在途实例的事实，不是继续查询普通行动目标。

**证实**：`Projectile.ActionController.Init`（70597，`0x1808b36c0`）取得能力 Buff/attachment，并为各 projectile event 注册动作。HIT_TARGET 对应 `RangedAttack.GetProjectileActions`（89821），它明确调用 `PreprocessActionsForProjectile`。

`ApplyDamage.PreprocessForProjectile`（95716，`0x18102c290`）实际执行 `source.get_atk`，保存 `m_cachedAtk`；来源无效时写 −1。该缓存属于已经准备给投射物的动作事实，发生在初始化动作阶段，不是行动启动时统一快照全部属性。

但“有缓存 ATK”仍不等于“所有命中强制使用缓存”：

| 路径 | 已证实的取值行为 |
| --- | --- |
| 普通 `ApplyDamage.CreateDamageModifier`（95712） | 来源对象有效：`CalculateDamageBySource`；来源对象无效：使用缓存 ATK，`CalculateDamageByAtkNoSource` |
| `CalculateDamageBySource`（77306） | 本次调用读来源 `get_atk`，再构造 AttackInfo 与来源事件 |
| S3 `RangedAttack.NewDamageNode`（89828） | `_useCachedAtkOnly=true` 创建 `ApplyCacheAtkDamageFromProjectile` |
| S3 专用节点（95720） | 交给 `CalculateCachedAtkDamageFromProjectile`（77308），使用已缓存 ATK，同时保留该入口的来源／目标事件规则 |

这能区分一个说明用轨迹：发射准备时 ATK=100，命中时有效来源 ATK=200。普通路径读取 200；缓存专用路径使用缓存输入 100；普通路径若来源对象已经无效，则回退缓存输入 100。它们仍会经过各自的公式／事件，不能把输入 100 写成最终 HP 伤害 100。

**限制**：这里的“来源对象有效”沿实际 Entity 引用取得与 native Unity 对象检查，不等于“还在场上单位表”，也不等于“HP 大于零”。`Projectile.get_source`（70457）从保存的引用取得 Entity；撤退、死亡、引用失效、对象回收的先后没有在本案逐条展开。项目不能把 Unit 查不到时回退 Definition 常量冒充这个缓存规则。

`atkScale` 又是另一层：能力 `_atkScaleKey` 参与构造基础伤害节点；`ScaleableHitBehaviour.OnBeforeHitTarget`（85485）在每个实际接收者前按 traceTarget 身份合并 `main_atk_scale`，余震还合并 `append_atk_scale`，再调用 `Projectile.ApplyAtkScaleToDamageNode`（70516）。倍率不是一个需要复制整个 Unit 的快照。

本案证实倍率对接收者的应用时点；没有穷尽 blackboard 更新对已在途组件缓存值的传播。因此不能进一步声称“所有 atkScale 参数都在发射时冻结”或“所有倍率都在命中时重新读取技能配置”。

## 5. 弹道、到达、命中与停止

**证实**：普通 projectile 的主段只在到达时查命中，余震只在停止时查命中。`HitBehaviour.OnProjectileReached`（85294）实际调用 `Box2dPhysicsUtil.FindTargets_DISPOSE`，再逐个调用命中方法；这是按到达时的空间事实和 targetOptions 得到的名单。

主段范围内可以包含非 traceTarget。`ScaleableHitBehaviour.DealHitTarget`（85484）先按当前接收者调整倍率，再委托 `HitBehaviour.DealHitTarget`（85296）。后者检查当前 camouflage、来源排除、traceTarget 限制等配置，然后才进入 projectile 的命中接收。

`Projectile.DealHitTarget`（70510）检查已命中过的目标、次数限制，执行命中动作，再增加当前命中次数，并按停止规则决定是否停止。普通 `_canHitSameTargetMultipleTimes=false` 的去重是投射物事实，不是 Unit 全局“这一帧已受击”。

**证实：身份历史与命中次数有不同的写入时点。** `DealHitTarget` 在 `0x1808c47fa` 调用虚槽 55，即 `CheckTargetAlreadyHitAndUpdate`（70532）。普通禁止重复命中的路径先查询 `CheckTargetAlreadyHit`，未命中则在 `0x1808c4299` 调用 `UpdateAlreadyHit`（70533）。`Projectile.OnHitTarget`（70525）又在 `0x1808c6bfc` 写入历史，随后才调用 `OnBehavioursHitTarget` 与 `ActionController.OnHitTarget`。历史是 `m_targetsAlreadyHit`（偏移 `0x150`）的目标引用到有效截止时间字典，不能等同于 `m_currentHitNum`。

`DealHitTarget` 在 `0x1808c4826` 执行命中回调，返回后才在 `0x1808c482b` 递增 `m_currentHitNum`（偏移 `0xa8`），再检查 `stopAfterMaxHit`／`stopAfterFirstHit`，必要时调用 `StopMe`。普通成功命中的局部顺序因此是：

```text
接纳目标并写入身份去重历史
→ 命中 Behaviour／内容动作
→ 命中次数递增
→ 按命中次数政策自动停止
```

这不能简化成“所有命中事实都在回调返回后写入”。Core 的 `hitUnitIds` 用于身份去重，按本案结论在 contact 前登记；当前尚无独立的命中次数政策，不能用身份集合代替未来需要的次数事实。

**证实：显式停止仍同步结算。** `StopMe`（70536）在 `0x1808c8847` 标记 stopped，`0x1808c8872` 同步调用停止处理，随后才 `DestroyMe`；没有统一排队到命中回调返回之后。`Act45SideCheckBlockerBehaviour.OnHitTarget`（85089）在 `0x180d079a7` 调用 `Behaviour.Stop`（70583），后者直接进入 `StopMe`，证明命中处理中同步停止是实际原生协议。Act45 这里只作协议旁证，未证明属于本季支持内容。

**本季内容与实质影响：地灵。** 真实 `projectile_skgoat` 逻辑组件 `-8980875176474924141` 配置 `_maxHitNum=1`、`_stopAfterMaxHit=true`、`_canHitSameTargetMultipleTimes=false`、`_alwaysHitTraceTargetInTheEnd=true`、`_alwaysHitTraceTargetWhenReached=false`。其普通单次命中后的停止来自计数政策，不要求 HIT 内容调用 `stopSelf()`。

`Projectile.OnProjectileStop`（70524）可以先调用 `_DealHitTraceTarget`（70538）保底命中，再进入 STOP 内容和各 Behaviour。保底以 `force=true` 调用 `DealHitTarget`；force 绕过次数上限，不绕过身份去重。因此当前接收者提前写入历史，可以阻止命中内部停止时再次结算同一目标。`m_hasHitTraceTarget`（偏移 `0xa7`）在保底入口提前设置，属于该入口的尝试门闩；`UpdateAlreadyHit` 不写它，不能把它当作身份字典的同义字段。

当前有限 Core 未接入这条原生保底命中，但提前登记历史是停止程序能够安全查询身份事实的前提，避免重复伤害、附着和其他命中后继。`PROJECTILE_HIT` 是项目 contact 程序完成报告，不能直接等同原生命中回调；程序内同步停止可以先产生 `PROJECTILE_STOPPED`，再产生 `PROJECTILE_HIT`。单纯报告顺序尚无已确认的玩法影响，不能据此延迟整个停止操作。

本季停止命中的内容也已沿引用链核对：`chess_char_5_22_a / chess_char_6_10_a → char_4146_nymph → skchr_nymph_2`，技能 RangedAttack 组件 `688936433221968384` 引用 `projectile_chr_nymph_s2`，其 HitBehaviour `-3988603138254794913` 配置 `_onlyCheckHitWhenStop=true`。`chess_char_6_12_a → char_391_rosmon → skchr_rosmon_2` 选择 attack mode 1，角色组件 `8002166357578185499` 引用 `projectile_chr_rosmon_s2`，其控制器开启 `_useExtraBuffsWhenStopHit` 并引用 `rosmon_s2_stun_equip`。后者是停止阶段发生 hit 时附着额外 Buff，不能推导成所有普通到达命中都会立即执行 STOP。

**证实**：`Projectile.ActionController.OnHitTarget`（70602，`0x1808b3990`）的顺序是：

```text
按 onlyTraceTarget / once 等条件附着 activeBuffs
AbilityAttachment.Apply
_AttachExtraBuffWhenStopHit
_RunActions(HIT_TARGET)
```

所以普通主目标残影先安装，主段伤害后执行；余震的 `projectile_shock` 也在余震伤害动作之前安装并运行开始程序。它不是“本次伤害结算完成后的统一 onHit”。详见 [Buff 父作用域案例](01-buff-installation-and-parent-scope.md)。

**推导**：同一次 contact 后继必须看见前面安装成功的 Buff／贡献；如果它触发嵌套伤害，嵌套返回后外层才继续后续动作。命中候选、contact 成立、伤害被接受、实际 HP 损失是四种不同结果。

**未核对**：目标在前摇中死亡、飞行中死亡、切换不可索敌或离场的全部最终表现；包含追踪挂点失效时的落点以及是否还有范围接收者。现有证据只允许说命中名单会重新查询，不能保证死亡 traceTarget 必被伤害，也不能保证整个投射物无效果。

### 对象更新与运动采样

**证实：普通原生路径没有全局 Projectile-before-Movement 阶段。** `ObjectManager.OnFixedUpdate`（70243，`0x1808c3140`）先从 `m_objects` 收集当前 validAndBorned 对象到 `m_cachedList`，再按该列表顺序逐个调用虚槽 27 的 `OnTick`。`m_objects` 是 `PriorityQueue<BObject>`，实际底层为排序 List，而非 heap：Register 调用的泛型 Add（`0x1850700f0`）按 `CompareTo` 查找位置后 `List.Insert`，`get_Item`（`0x184d3d960`）按原列表下标取值。

`BObject.CompareTo`（64450，`0x18066ed00`）先按 priority 排序，同 priority 按 `instanceUid` 升序。默认 `get_priority`（64449）返回 0；本机 metadata 中 Enemy／Projectile 的继承链没有该虚槽的 override。`BObject.OnAllocate`（64461）分配递增 UID 并登记对象。因此通常已经存在的追踪敌人早于其后来创建的弹体更新，敌人本 tick 的路线位移已经写入位置；对后来加入的其他接收者或改绑目标，先后可能相反。

敌人的主要路线位移发生在 `Enemy.OnTick → Unit／Entity.OnTick → StateMachine.Tick → MoveState → _MoveByCursor → SetPosition`，不是一个独立于所有对象的全局 Movement pass。Projectile 的追踪运动在自身更新中读取挂点的当前 mapPosition；`BasicMovement.GetTraceTargetMapPosition`（70388）使用 live 挂点位置，无效时使用记住的目标位置。到达检测使用本次运动采样的目标位置，不能统一理解成全场上一 tick 的坐标快照。

**影响限度与项目选择**：先后可能改变弹体方向、到达边界、范围接收者和伤害相对移动／退出的时点，静态链没有证明它会导致重要玩法差异，也不证明每种内容恰好提前或延后一个 tick。项目接受固定 30 tick/s 与 `Combat → Projectile → Movement`，无须复制官方对象队列。按[模拟原则](../00-INDEX.md)，一 tick 偏移本身无需修复；若具体支持内容出现重要目标选择、重复／漏失命中、触发次数或胜负变化、显著累计数值偏差，再核查并修正该路径。少见边界不自动等于重要玩法差异，这项近似也不声称所有场景严格等价。

对象候选列表收集完毕后，新登记的弹体不进入该轮 OnTick。ActionExecutorManager 又在 ObjectManager 之后运行，因此它释放的弹体也不会被本轮 ObjectManager 推进；更早的 Deck／Tween 等创建路径尚不能一概保证发射当 tick 不推进。未执行 Lua/hotfix 或客户端现场记录，这些结论限定为已展开的普通原生路径。

## 6. 结束与取消不是一个传播开关

**证实**：普通配置 `waitForProjectileInvalid=false`。`RangedAttack` 的后摇 coroutine（89852，`0x180ea7720`）因此委托 `EasyToStartAbility.OnWaitForPostDelay`，没有等待所有投射物失效。行动结束可以先于命中。

`RangedAttack.OnCastEnd`（89826，`0x180ea4d70`）仅当 `waitForProjectileInvalid && !notClearProjectileWhenCastEnd` 时调用清弹；普通配置不进入该分支。不能只看到 `_notClearProjectileWhenCastEnd=false` 就断言结束必销毁已发射弹。

显式清弹另走 `RangedAttack.ClearProjectile`（89827）遍历记录并调用 `Projectile.Interrupt`（70501）；后者实际转到 `StopMe`（70536）。`StopMe` 先设置 stopped，调用停止处理，再 `DestroyMe`，重复停止直接返回。

停止会运行领域后继，不能统一视为丢弃：本案余震 `HitBehaviour.OnProjectileStop`（85295）进入停止命中流程；`ActionController.OnProjectileStop`（70604）另按配置撤销已附着 Buff、执行 STOP 动作、附着停止专用 Buff。普通的 `detachAllBuffsWhenStopped=false` 不会因 projectile 停止就撤销主目标残影。

`Ability.FinishIfNot`（62575，`0x1805e9020`）只在仍 casting 时完成结束处理，调用清理／`OnCastEnd(reason)`、冷却策略和结束通知。开始事实、结束原因和投射物停止事实各自存在；重复结束不能再制造一次释放。

**推导**：取消应阻止尚未取得独立所有权的行动后继；对已发射投射物，必须由具体清弹／停止政策决定。取消不回滚已经成立的 contact、嵌套结算或 Buff 安装。普通状态结束通知也不能代替来源父 Buff 的结束传播。

**未核对**：所有中断源对主 coroutine 的停止方式、取消与释放同逻辑步的最终优先级、撤退时托管容器是否另外清弹。本案没有证明任何中断都只影响未释放部分，也没有把回调注销顺序直接规定为项目的权威发布顺序。

## 7. 最小 trace 与事实归属

下面使用说明用 Unit ID，不给出未核对的官方 tick 数；`A1` 是一次行动，`P1` 是其已释放投射物。

```text
t0：接收 A1，记录输入目标 E1、启动 tick；等待释放条件
t1：前摇结束，按本能力政策取得 castTargets；无目标则结束
t1：创建 P1，保存来源 O1、traceTarget E1、起点和缓存 ATK
t2：A1 完成后摇；P1 仍可以在途
t3：P1 到达，按当前空间与资格查询 E1/E2
t3：对 E1 调整本次倍率 → 安装残影 → 执行伤害
t4：P1 停止，按停止流程查询余震接收者并执行后继
```

这个 trace 只表达已经确认的先后与独立性；到达是否早于后摇结束取决于距离与时间，不固定 `t2<t3`。第二条最小变体是在 `t1` 前取消：没有 P1，就不能让迟到的释放条件再次制造 P1。

| 长期或跨阶段事实 | 合理归属 | 查询时派生内容 |
| --- | --- | --- |
| 接受的行动身份、阶段、输入绑定、待执行后继、结束原因 | 行动执行过程 | 本次是否允许继续、是否需要重取目标 |
| 来源／traceTarget 身份、起点、当前位置、缓存伤害输入、已命中集合、停止事实 | 投射物实例 | 当前弹道方向、本次 contact 名单 |
| 当前 ATK／DEF／状态／位置／HP | 对应 Unit 及有效贡献 | 具体读取策略下的本次 operands 与接收许可 |
| 已安装残影及父作用域关联 | 附着实例 | 本次是否有效、父结束时撤销哪些贡献 |

投射物最终是否建模为 Unit，本案不作结论；有身份、位置和跨 tick 事实已经足以要求独立实例所有权，不能只剩一个展示动画。

## 8. 局部生效与权威发布

官方可变对象直接写入只能证明后继读取顺序，不能要求项目每个节点都公开提交 Battlefield。

**可落定的项目协议**：一次阶段工作内，创建投射物、安装附着、消耗次数及 HP 变化先在本次工作上下文局部生效；同一序列与嵌套调用读该上下文。领域阶段完成后返回数据结果，由 runtime 协调私有工作状态；沿用当前整 tick 成功后权威发布的规则，UI 消费已发布的阶段报告。

contact 阶段返回时必须说明已完成安装／结算的事实和留下的后继；返回“创建了 projectile”不表示已经完成其命中。跨 tick 后继保存数据与内容身份，编译函数留在 Resources，快照不保存 callback 或 generator。

不同视图不需要同时更新：Unit／附着局部事实可以即时可见，blocking 与导航投影仍按各自阶段契约。不能为了本案的 contact 可见性要求每个节点重建全部空间索引。

## 9. 当前 Core 的实现范围

- [Action process](../../../src/core/unit/capability/action/process.ts) 已保存独立执行事实，支持同步段落、tick 等待、释放、取消和恢复；原生输入位置、动画事件及全部 spell 重复政策不在当前范围。
- [Projectile](../../../src/core/battlefield/projectile/settlement.ts) 已接入独立在途集合、恒速追踪、到达时 contact、同步停止和结果报告；完整 prefab 编译、停止保底命中、贯穿、往返、多段等按具体内容扩展。
- Projectile 的 cachedAtk 由实例保存，普通内容查询当前来源 ATK、来源不可查询时回退样本，cached-only 内容直接读样本。即时 [compileEffect](../../../src/core/unit/capability/action/compile-effect.ts) 的 Definition.power 回退不能冒充发射缓存。
- [CombatWork](../../../src/core/battle/execution/work.ts) 保留局部 Unit／Effect 事实与嵌套读取，整 tick 成功后权威发布；[当前运行协议](../06-runtime-protocol.md) 明确身份历史前置、同步停止和阶段读取政策。
- 固定 phase 顺序是已接受的项目近似。剩余研究以具体支持内容的重要离散结果、可察觉差异和显著累计偏差为依据，不把原生对象更新顺序作为待迁移架构。

## 10. 本案可以落定的协议约束

1. 接受行动、释放一次 spell、产生在途实例、contact、伤害结算、行动结束分别有可识别结果；它们不共用一个“攻击成功”布尔值。
2. 目标策略决定绑定何时建立、何时保留、何时重新查询；投射物 contact 查询不能复用启动时范围名单。
3. 每个跨阶段数值写清来源与采样政策；缓存 ATK、当前 ATK、基础 atkScale、接收者倍率和当前防御不是同一快照。
4. 取消、独立实例停止、来源离场、父作用域结束有明确传播关系；重复通知不重复释放或结算，已完成事实不回滚。
5. 内容序列能够把安装／查询／结算交错；每一步返回前完成自身保证的局部变化与嵌套结算，外层随后读更新事实。
6. 对外报告以已经发生的阶段事实驱动演示，不让 UI 动画反过来推进 core；本项目把编译后的等待转换为确定性 tick 规则。

仍需选定或核对的只有会改变结果的具体问题：中断与释放同 tick 的顺序、目标失效时落点和接收者政策、来源离场到对象失效的取值切换。无需先复制官方 coroutine、动画系统或随机调用次数，才确立上述边界。
