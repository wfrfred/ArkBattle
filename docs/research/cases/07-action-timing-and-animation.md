# Action 的攻击周期、动画与执行占用

核查日期：2026-10-14。研究 Stronghold Action 重构所需的官方时间语义，本轮不修改源码、不决定新的 Action API。

## 证据范围

直接读取本机官方 Windows 客户端的 IL2CPP metadata、原生方法和资源引用，交叉核对 PRTS。以下“原生实现”均指本轮读取的非 XLua 替换分支；没有运行官方战斗、执行 Lua hotfix 或逐帧录制。因此，代码中的计算与资源参数可以确认，实际事件落在哪一逻辑帧仍须区分推算与运行观测。

当前客户端身份：

- `GameAssembly.dll` SHA256：`583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`。
- `global-metadata.dat` SHA256：`d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`，metadata version 29。
- 资源版本：`26-09-13-15-28-10-30688348`，manifest `074c396967a291d157f01a3e40c79119.idx`，`V078`。
- IL2CPPClass vtable 起点为 `0x140`；TypeDefinition stride 为 92。这些位置不能与旧客户端证据混用。

可复核的原生指令、方法与字段对应、Prefab 组件引用、Spine 映射和事件时间保存在 [action-timing.json](../evidence/action-timing-20261014/records.json)。资源以 `UnitMode._attack/_combat` 和具体 PPtr 建立归属，不能仅根据 GameObject 名称推断技能编号。

## 1. 必须区分的时间事实

| 事实 | 回答的问题 | 本轮读到的官方承载位置 |
| --- | --- | --- |
| 攻击周期 / cooldown | 这个 Ability 下一次是否满足时间资格？ | `Ability.m_cooldownTimer` |
| 正在执行 / casting | 这个 Ability 当前行动是否仍未结束？ | `Ability.m_isCasting` |
| 当前动画位置与速度 | 当前 clip 播到哪里，什么时候发动画事件？ | Spine Track / `SkeletonAnimation.timeScale` |
| 动作预算 | 本次执行打算持续多久？ | `m_attackTime`，开始执行时缓存为 `m_cachedDuration` |
| 已进入的等待 | 这次协程还要等多少逻辑帧？ | `WaitForFixedSeconds` 的整数 `tickCount` |
| 多段释放间隔 | 首次释放之后，后续几发何时发生？ | MultiRanged / Channeling 的独立等待 |
| 状态机许可 | 动作结束后是否留在攻击状态、是否可以恢复移动？ | Character / Enemy AttackState、CombatWrapper |

这些事实可以恰好对齐，但不是一个变量的七种名字。它们分别计时，结束策略可以关联它们；不意味着完全互不影响。不能把全部时序都解释为“攻速驱动的统一 Action progress”。

## 2. 一次普通行动怎样开始、释放和完成

读到的普通路径如下：

```text
状态机选择 Ability 与目标
    → 检查 isReady：cooldown 就绪，并且没有仍在 affecting 的执行
    → ResetCooldown
    → 开始 casting，启动行动与动画
    → 进入前摇等待：动画 OnAttack 事件，或指定时间
    → 执行本次释放 / 多段后继释放
    → 等待动作预算中剩余的后摇
    → 完成 casting
    → 状态机决定下一次攻击或恢复移动

期间：cooldown 独立推进，不等待 casting 完成才开始倒数。
```

`AbilityStandard.CastToTarget`（63140，`0x1805cebf0`）实际检查 readiness，再重置 timer 并启动执行。`Ability.get_isReady`（63033）要求 cooled down 且不 affecting；普通 `isAffecting`（63036）读取 `m_isCasting`。

`Entity.OnTick`（66697，`0x1806fadf0`）先推进状态机，再推进缓存中的 Ability，唯独跳过刚开始施放的首帧。`Ability.OnTick` 没有以“不是 casting”为计时前提。因此周期在行动期间流逝，而不是后摇完成后再加一个完整攻击间隔。

`AbilityStandard.OnAttackFinished`（63167）只置 `isAttackFinished`，没有直接清除 `m_isCasting`。一个动画 AttackFinished 标志不能自动代表执行已经结束。

普通 `EasyToStartAbility` 的后摇预算是：

```text
开始时：cachedDuration = GetDuration()
前摇进入时：realStartTime = fixedPlayTime
后摇进入时：remaining = max(0, cachedDuration - (now - realStartTime))
```

后摇填补的是原预算剩余部分。不是“前摇 + 完整后摇 + 完整 cooldown”三个时间串行相加。不同 Ability 可以覆写这些入口，不能将普通式强加给所有特殊技能。

结束流程仍可修改 timer，具体政策见第 8 节。因此“周期与执行分别推进”不能扩大为“执行结束永远不影响周期”。

## 3. 攻速中途变化：冷却保留比例，但不是全部时钟一起变速

[PRTS 攻速公式](https://prts.wiki/w/游戏数据基础#攻速公式) 给出通常攻击间隔与攻速的关系。此次原生核查进一步确认了普通攻速变化的实际更新入口。

`Entity.OnAttributeDirty`（66699，`0x1806f7100`）的 ASPD / BASE_ATTACK_TIME 分支计算新间隔，通知每个 `m_abilities` 的 `OnAttackTimeChanged`。`AbstractAnimatedAbility.OnAttackTimeChanged`（91782，`0x180f00070`）在 `FROM_ATTACK_SPEED` 模式重算动画参数，然后在 `0x180f0011b` 调用 `PeriodicTimer.ResetButKeepProgress`。

该 timer 操作的原生算术为：

```text
p = oldPeriod == 0 ? 1 : clamp01(1 - oldRemaining / oldPeriod)
newRemaining = newPeriod * (1 - p)
```

例如旧周期 2 秒、还剩 1 秒时，已完成 50%；新周期改为 1 秒，新剩余时间为 0.5 秒。这是对 cooldown 的结论。

还有另一个 `ResetButKeepPastTime`，保留的是已经过去的绝对时长：

```text
newRemaining = max(0, newPeriod - (oldPeriod - oldRemaining))
```

`Ability.UpdateCooldown` 存在这条不同路径。不能看到“更新冷却”就默认它们采用同一政策。

对当前行动，另外三件事必须分别看：

1. `OnAttackTimeChanged` 会更新 `m_attackTime / m_animScale / playbackSpeed` 等参数，但 `EasyToStartAbility` 在施放开始时已经复制了一份 `m_cachedDuration`。没有在该通知链找到把它重新按比例计算的动作。
2. `WaitForFixedSeconds` 在首次进入时，把请求时长转换为 `max(RoundToInt(duration / deltaPlayTime), 1)` 个逻辑帧，之后只计帧数。已经进入的等待不会重新读取攻速；下一段新建等待可以读取更新后的参数。
3. 重算 `Ability.playbackSpeed` 不等于立即写入正在播放的 `SkeletonAnimation.timeScale`。所读 Entity → Unit → Character / Enemy 属性通知链，没有对 ASPD 再调用一次当前动画速度更新；所读常规 animator tick 也没有每帧从 Ability 自动拉取该速度。三段行为自身另有显式改速策略，见第 5 节。

因此，“中途攻速变化保留 cooldown 完成比例”已确认；“当前前摇、后摇、当前 clip 和未来各段全部按比例移动”不能作为通则。

## 4. 普通动画缩放：周期长短和占用长短可以分离

`AbstractAnimatedAbility.UpdatePlaybackSpeed`（91798，`0x180f00820`）的普通、无 SlowDown 分支，结合真实 animator 映射，计算：

```text
L = rawClipLength / authoredSpeed
a = max(T / L, 0.1)
若 maxAnimScale >= 0：a = min(a, maxAnimScale)
D = a * L
播放速度 = authoredSpeed / a
```

`T` 是当前 `get_cooldown()` 结果，`D` 是这个入口产生的动作预算。不能把 `maxAnimScale` 理解为攻击周期上限。

对开始后参数不变、事件未被其他因素打断的行动，动画原始事件时间 `e` 的标称释放时刻为 `e * a / authoredSpeed`。本轮表格中的 authoredSpeed 均为 1，因而可简写为 `e * a`。这只是连续时间推算；每帧事件派发和协程恢复仍有量化。

由此可以确认两种有实际玩法影响的边界：

- 低攻速达到动画拉伸上限时，`D < T`：动画 / 执行可以先结束，周期尚未就绪。
- 高攻速遇到缩放下限时，`D > T`：周期可以先就绪，但同一 Ability 仍在 casting，不能据此提前开始下一次。

三段模板可以覆写播放速度计算，并使用不同限制；`0.1` 不是所有 Action 的全局最短比例。

### 真实资源参数

下表是默认模型的资源原始秒数。`T` 仍是运行时输入，不代替具体等级、潜能、技能和装备计算。

| 对象与真实组件引用 | 原 clip 长度 / OnAttack 时刻 | 拉伸上限 | 标称预算 |
| --- | --- | --- | --- |
| 能天使 Default `_attack` → MeleeAttack | `1 / 0.3` | 2 | `min(max(T, 0.1), 2)` |
| 能天使 S1 → MultiRangedAttack | `1 / 0.3` | 1 | `min(max(T, 0.1), 1)` |
| 能天使 S3 切换到 mode 1 的 MultiRangedAttack | `1 / 0.3` | 2 | `min(max(T, 0.1), 2)` |
| 弩手 Default `_attack` → RangedAttack | `1 / 16⁄30` | 1 | `min(max(T, 0.1), 1)` |
| 同一弩手 `_combat` → 另一个 MeleeAttack | `1 / 1⁄2` | 1 | `min(max(T, 0.1), 1)` |
| 泥岩 Default `_attack` → MeleeAttack | `1.6 / 19⁄30` | 1 | `min(max(T, 0.16), 1.6)` |
| 泥岩 S2 根 AnimatedActionToOwnerAbility | `1.6 / 20⁄30` | 不设上限 | `max(T, 0.16)` |

泥岩是 `char_311_mudrok`；`char_416_zumama` 是森蚺，二者不能混用。泥岩 S2 根程序按序 TriggerAbility(`RollAttack`) → HealViaMaxHpRatio → CreateEffect；RollAttack 子节点是指定时间、无动画事件等待的另一 Ability，不能把根动画预算再套一次作为其伤害前摇。

在原生派发中，`SpineAnimator._OnEvent`（63866，`0x180612690`）匹配真实字符串 `OnAttack` 后向宿主 EventPool 发事件 19；匹配 `OnAttackFinished` 发事件 20。EasyToStart 前摇注册的是事件 19。动画对玩法的影响来自这些事件和执行等待，不来自 UI 端看起来还剩多少帧。

## 5. 玫兰莎：首次起手、续轮、收尾是不同事实

真实 `char_208_melan` 的 MeleeAttack 同时挂 `ThreePartOneshotAnimation`：

- Begin：key `Attack_Begin` → clip `Attack_Start`，0.5 秒。
- Oneshot：`Attack_Loop`，1 秒，OnAttack 在 14⁄30 秒。
- Behaviour 的 `_endAnim` 为空，自己的 min/max scale 均为 -1。
- 父 Ability 的 `_endAnimKey=Attack_End`，0.5 秒，`escapeTime=0.5`。

ThreePartOneshot 用参与本轮的段长总和计算 `a=T/total`，不是复用上节普通 clamp。第一次合计 1.5 秒；续轮只有 Loop，合计 1 秒。

`firstAttack` 指进入 Character AttackState 后的第一轮：OnEnter 传 true，同状态续轮传 false。不是每次部署仅有一次起手。重新进入攻击状态可以再次起手。

例如取本轮 `T=1.5` 秒、途中参数不变：首轮 speed=1，标称事件在 `0.5+14/30≈0.9667` 秒；续轮 speed=2/3，事件约 0.7 秒。两轮的总行为预算均对齐 1.5 秒，但释放相位不同。真实帧仍会量化。

父 `OnCastEnd` 的 Attack_End 是另外一次播放调用，其返回的动画长度被忽略，没有等待它播完。玫兰莎 escapeTime>0，会走父收尾播放路径；资源里存在 0.5 秒 End，不代表下一次普攻必额外被占用 0.5 秒。

中途改速时，ThreePartOneshot 总会重算未来段使用的速度。仅当 `fixAnimWhenCooldownSlow && oldSpeed > newSpeed && isCasting` 时，它才显式更新正在播放的 clip。玫兰莎该配置为 false。已经创建的段等待仍不变。

## 6. 能天使：多段发射有自己的时间链

所读 MultiRangedAttack 配置 `_waitAttackEventForAllAttacks=false`。首次发射等待 OnAttack；后继发射走：

```text
delta = blackboard.GetFloatOrDefault("hit_interval", configuredTriggerDelta)
后继等待请求 = delta * 当前 animScale
实际等待帧数 = max(RoundToInt(请求 / deltaPlayTime), 1)
```

组件的默认 triggerDelta 是 0.05 秒，但 Blackboard 的 `hit_interval` 可以覆盖它；`times` 决定后继发数。

另取到 [2026-10-08 主模式技能表](https://github.com/Kengxxiao/ArknightsGameData/blob/e8588a82074bf695aa3849959037dd2de7e6e5cf/zh_CN/gamedata/excel/skill_table.json)，固定 commit `e8588a82074bf695aa3849959037dd2de7e6e5cf`，全表 SHA256 `b6559b845efea6042e23f1d976185f12e13de3d749464543f5c2c17a7d2fa280`：S1 各级 `times=3`，S2 `attack@times=4`，S3 `attack@times=5`；三者均没有 `hit_interval / attack@hit_interval` 覆盖，所查表因此支持使用组件的 0.05 秒缺省。S3 专三的 `base_attack_time` 原始值为 -0.11，不能在未看属性施加方式前把它擅自解释为绝对减 0.11 秒。各级完整 BB 与 JSONPath 已收入证据。

该公网主模式表没有被证明与本机 2026-09-13 客户端快照同版；这里将数据表结果和本机原生结果分别保留，没有用卫戍变体替代，也不把版本混合的数值推算称为当前实机测量。

每一个后继等待分别量化。已进入的间隔不追改；下一段间隔可使用新 animScale。多段释放可以比缓存动作预算更长；最终后摇按开始以来已用时间扣除预算剩余，并不是每发后都再等待完整 D。“至少 1 个等待帧”如何对应创建点到释放点，仍需结合第 9 节的调度顺序。

## 7. 安洁莉娜与莫斯提马：循环外观不等于循环伤害

`ThreePartChannelingAnimation` 独立计算 Begin/End 的缩放与 Loop 的预算。在所读 `DoPlayAnimation` 中，Loop 的请求播放速度是字面值 1；它没有按父 Ability 当前 playbackSpeed 每帧变速。

安洁莉娜技能模型的 Skill1/2_Loop 都是 14⁄30 秒，OnAttack 在 7⁄30 秒，loop=true。技能状态中的普通攻击 Ability 自己按攻速推进周期和事件等待；固定循环中的事件与新行动的等待相位可能错开。前摇另有缓存预算超时，因此不能推出“每个循环事件一定释放”或“必等下一个事件才释放”。本轮没有官方实机帧记录，不把旧 sandbox 的 2–14 帧或 42/56 帧直接登记为当前精确数值。

莫斯提马 S2 的真实技能 Prefab 是 `skchr_mostma_2` 的 `ChannelingMeleeAttack`。不能把 charpack 中叫 S2 的 Mode 当成该技能，那个 Mode 是另一个技能的切换模式。

S2 Begin 为 25⁄30 秒，OnAttack 在 17⁄30 秒；Loop 为 80⁄30 秒，**没有 OnAttack 事件**。Ability 另读 `duration / triggerDelta`，以触发间隔计时后继伤害。`CheckAnotherSpell` 根据技能剩余时长及结束阈值判断是否继续，并非每次再启动普通攻击。这个原生路径与 [PRTS 莫斯提马 S2 的固定 1 秒攻击说明](https://prts.wiki/w/莫斯提马#技能) 相符。

因此，视觉 Loop、固定伤害间隔和攻速周期可以分别存在。无需为了保留它们把所有内容都改成同一个时间模式。

## 8. 弩手恢复移动与“取消后摇”

同一弩手 Prefab 的远程 `_attack` 与阻挡 `_combat` 指向两个不同 Ability；每个 Ability 持有自己的 timer。普通原生路径没有一个由名字推导出的全 Unit 唯一 cooldown。是否共享时间必须看引用或具体组合逻辑。

Enemy AttackState.OnTick（76662，`0x180a85990`）在普通路径等待 `attackAbilityCasted.isCasting == false` 才切回 MOVE。不能以箭矢已经释放或 `isAttackFinished` 为恢复移动时点。若演示中在这之前滑步，应查实际执行占用和动画接入。

阻挡 CombatWrapper 还有另一条逃逸约束：完成回调将 `combatNextEscapeTime` 设置为 `fixedPlayTime + ability.escapeTime`；目标消失时由 CombatState / Wrapper 检查。这个时间以完成回调为锚，不是所有攻击统一采用的“发射后 escapeTime”。

[PRTS UnitMode 切换说明](https://prts.wiki/w/游戏数据基础#其他复用机制) 明确切换会中断普通攻击并清空攻击间隔。停止动作、停止动画、结束占用、清空周期是可分别被业务改变的事实；不能通过一个笼统的 `cancel()` 默认全部重置。

### 普通结束、中断与周期政策

本轮另外读通了默认结束链：

| 情况 | 原生入口与周期结果 |
| --- | --- |
| 普通执行完后摇 | `_DoCast.MoveNext` 在 `0x1805e3edd` 调 `FinishIfNot(NORMAL_EXIT, false)`；不重置满周期 |
| 普通中断 | `InterruptIfNot` 在 `0x1805d6100` 调 `FinishIfNot(INTERRUPTED, false)`；不默认重置满周期 |
| 调用方明确要求重置 | `FinishIfNot(..., true)` 调 timer `Reset(true)`，余量变为完整 period |
| 前摇中目标死亡 | 默认策略在 `TARGET_DEAD && CheckAtPreCastPhase()` 时 `Reset(false)`，清零余量 |

`FinishIfNot` 的顺序为清理 → `OnCastEnd` → 周期政策 → finish callbacks。普通完成和普通中断均不能解释为“从此刻开始下一整周期”。

`EasyToStartAbility.OnCastEnd` 还有帧误差处理：仅当 `MathUtil.Equals(cachedDuration, 当前 cooldown)` 为真时，按 HALF_FRAME / ONE_FRAME / EPSILON 策略检查很小的剩余时间，符合条件则 `Reset(false)` 清零；NONE 不修正。这里是近似相等，**不是 cachedDuration 小于 cooldown**。检查没有按结束原因跳过中断，故“普通中断保留余量”也有这一小幅修正。

UnitMode 的 native 小链已确认需要时重启 FSM，Character AttackState.OnExit 会调用普通中断；本轮尚未定位“清空间隔”的具体 native 调用者。因此模式清间隔仍以 PRTS 正式机制说明为依据，不声称已由 `Unit.OnSwitchMode` 本身的指令证明。

## 9. 逻辑帧中，动画事件与协程怎样相遇

当前 `BattleController.OnTick`（64825，`0x18062c440`）所读的确定性模拟分支，有明确顺序：

```text
ObjectManager.OnFixedUpdate
    → Entity StateMachine.Tick
    → BuffContainer.Tick
    → Ability.OnTick：攻击计时

CoroutineSimulator.SimulateTick
    → 恢复行动协程

ObjectManager.OnLateFixedUpdate
    → Unit.OnLateTick
    → Animator.OnTick
    → Spine 手动推进与动画事件生成
```

因此，LateTick 产生的 OnAttack 不能倒流到此前已经完成的协程恢复阶段；等待方需要后继恢复机会才能消费它。仅用动画原始事件秒数除以播放速度，不能得到最终释放逻辑帧。

对象更新是逐个对象执行 StateMachine → Buff → Ability，不是全场状态机完成后再统一推进所有 Ability。这里抽取的是动画与协程之间的先后，省略了 Controller 中与本问题无关的地图、输入和全局机制步骤。

`SimulateTick` 会复制活跃 handler 名单并逐个推进，每个名单项调用一次 RuntimeHandler.MoveNext；但一个 handler 内部会推进嵌套 IEnumerator，直到遇到需要等待的 yield，不能误写成“每个 IEnumerator 每 Tick 只运行一次”。

另一个重要入口是 `StartCoroutine`：它在注册前立即推进一次 handler。若在对象更新阶段创建，随后可能又在同帧 SimulateTick 推进。因此 `WaitForFixedSeconds` 内部最小 tickCount 为 1，不足以证明“从任何创建点开始必定跨过完整一个逻辑帧”。在 SimulateTick 内进入的连射后继等待，则需该 handler 后继的恢复机会。

非确定性分支走 Unity.StartCoroutine，不能直接套用 Simulator 的全部顺序；Spine 此处也限于手动 Tick 路径，additionalFrame 配置还可能让某些调用仅累积时间而不立即推进动画。`isDeterministic` 的字段和读写入口已确认，但实际开战时的最终值未确认。这些条件与方法位置一同保留在证据中，不宣称该分支是当前实机默认或所有客户端模式使用同一帧内时间线。

## 10. 对重构有约束的结论

此处只列由证据推得的要求，不决定具体类型名或新增框架。

- 必须分别表达时间资格与正在执行的占用；不能因 cooldown 就绪而忽略同一执行尚未完成。
- cooldown 的攻速更新通常保留比例；内容或其他更新入口可以采用不同政策。
- 开始时缓存的预算、当前动画速度和已进入等待的帧数不能自动合并成一个全局 progress。
- 动画事件影响玩法，但显示用的收尾 clip 可以不占用；名称不能代替执行语义。
- 后继释放可以使用独立间隔；Begin/Loop/End 模板、固定装填和特殊强制后摇由相应内容规则表达。
- “所有动画都不可压缩”“攻速只缩后摇”“所有前后摇都随新攻速实时缩放”“后摇后再加完整攻击周期”都不能作为通则。

若使用函数式 Action 私有状态，以上事实可以由明确的状态与顺序表达；不要求复刻 IL2CPP Coroutine、Ability 类继承或动画 Behaviour。此前建议的统一累计进度方案，最多适用于明确选择该时间政策的部分计算，不能作为整套官方行动语义。

## 11. 仍未实测的界限与项目选择

| 项目 | 当前证据与处理 |
| --- | --- |
| 冷却与 casting 并行、低速动画上限、高速占用下限、固定 Loop / 后继释放政策 | 会影响持续输出或移动，按已查原生规则设计；不可当作纯显示差异省略 |
| 中途改速后的当前 clip 与缓存等待相位 | 已查普通路径与 ThreePart 显式分支；涉及未释放动作时会改变业务，保留各自事实，不能猜一个统一实时缩放规则 |
| 同一帧动画事件、状态机检查和协程恢复的精确先后 | 已查确定性 Simulator / 手动 Spine 分支顺序，尚未做实机逐帧验收；无持续输出影响的小差异可按项目原则选择简单约定，有边界连射 / 连锁业务时应单独验收 |
| XLua hotfix、所有皮肤、所有特殊 Ability 变体 | 未运行或穷举；不能把普通原生分支宣称为全部内容的最终动态结果 |
| 能天使主模式 `hit_interval` 等技能 BB | 已取得并固定 2026-10-08 主模式表，无间隔覆盖；尚未证明与本机资源同版，保留版本界限 |
| JSON 持久化、Coroutine 形式、原生类命名和显示混合参数 | 属于实现选择，不要求 Stronghold 复刻 |

[PRTS 作战机制 sandbox](https://prts.wiki/w/作战机制/sandbox) 页首明确尚需测试，且关于动画压缩存在前后不一致的历史描述。本轮没有将其概括或旧数值作为最终规则。猎手固定装填、蕾缪安的瞄准和强制后摇等正式内容说明，是未来内容验收的代表性补充，不要求所有 Action 都按普攻模板推进。
