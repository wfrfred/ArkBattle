# Modifier 接收管线

依据本目录 `native.json` 的当前指纹完整方法。以下是普通 native fallback 的静态控制流，未执行游戏、未验证有效 XLua；不据原生函数或事件数量决定 ArkBattle 的公开 Hook 数量。实际程序的资源绑定由同批 `../content/` 单独核对。

## 1. 构造与入口

HP Damage 的 `NewDamageModifierAfterCalculate` #72179/#72180 在公式之后构造 Modifier，保存已算量、数学类型、applyWay、source/target、attackType 与 originAtk；双数额重载还保存 rawValue。HP Healing 的 `NewHeal` #72182 构造正向 HP／HEAL；EP Damage 的 #72181 构造负向 EP 并写元素类型；EP Healing 的 #72183 构造正向 EP。构造器并不执行目标普通接收程序。

EP Damage 构造还调用 `CheckElementModifierValid` #79619：普通分支读取目标 `BObject.side`（`+0x1c`），值为4时返回 false；SideType 的 NEUTRAL=4 映射见既有 Case20。构造器随后以 UNHURTABLE 取消（`0x18090aa04–09`），早于 Apply。不能假定所有已构造的请求都会抵达接收前程序。调用方还可在构造后修改 flags／取消许可；本批不把某个构造器默认值推成所有输出的完整政策。

`Modifier.get_isCancelled` #72132：deltaType 为 NONE，或当前 value 为零，都会返回 true。它不是单独读取一个取消布尔值。`get_isDamage` #72134 则只检查 HP 目标及伤害数学类型不为 NONE／HEAL，不检查取消、value 或 attackType。

`Entity.ApplyModifier` #67665 在 `0x18072126a` 虚检查目标 alive，`0x18072128e` 检查输入未取消；失败即返回 false，尚未执行目标事件5。force 不绕过这两个入口条件。随后保存 source 并检查 skip 标记。

## 2. 普通路径的完整顺序

```text
目标 alive，输入未取消
→ 目标 Buff 事件5（ON_BEFORE_APPLYING_MODIFIER）
→ 若已取消且原因为 INTERRUPT，整次 Apply 返回 false
→ 来源存在：来源 Buff 事件8（ON_OUTPUT_MODIFIER）
→ 本笔当前是 HP damage：来源 Buff 事件11（ON_OUTPUT_DAMAGE）
→ 目标 Buff 事件6（ON_APPLYING_MODIFIER）
→ 按当前 Modifier 的目标／数学类型进入专属接收：
    HP damage：不可伤／来源未命中 → 普通 HIT SP → 目标 Buff 事件10
    HP healing：禁疗检查，无专属 Buff 受疗事件
    EP damage：EPFreeAll／不可伤 → 目标 Buff 事件68
    EP healing：无专属接收分支
→ 复查 Modifier 是否取消；取消则返回 false
→ 来源存在：来源 Buff 事件61（ON_BEFORE_TARGET_APPLY_MODIFIER）
→ GameMode.OnEntityApplyModifier；返回 false 则退出
→ 虚派发目标 DoApplyModifier；返回 false 则退出
→ 当前没有 skip：目标 Buff 事件7（ON_APPLIED_MODIFIER）
→ 按当前分类派发来源输出后事件21／85／83
→ Apply 返回 true
```

关键指令：事件5 `0x1807214bd`；INTERRUPT 早退 `0x180721615–640`；来源8 `0x1807216f3`；来源11 `0x180721819`；进入 `_OnApplyingModifier` `0x1807218bb`；专属接收后的取消复核 `0x1807218da`；来源61 `0x180721984`；GameMode 资格 `0x180721ad4`；DoApply `0x180721b08`；提交后 skip 检查 `0x180721b2e`；目标已应用 `0x180721b40`。

两轮来源输出事件位于目标事件5和6之间。它们不是 Formula 的别名，也不是资源已经提交后的通知。来源8适用于普通通用 Modifier；来源11额外要求本笔为 HP damage。

目标事件5后的特殊早退只检查 INTERRUPT。其他取消仍能进入来源8/11和目标6；取消也不自动终止同一容器剩余 Buff。来源61以后，Apply 本体没有再执行一轮通用 isCancelled 检查；普通 DoApply 使用 finalDelta，而 finalDelta 在 deltaType=NONE 时为零。不能把来源61概括成“取消后绝不会进入提交方法”。

`DefaultGameMode.OnEntityApplyModifier` #84160 fallback 返回 true；`OnFinalizeEntityDamage` #84161 fallback 无业务。其它 GameMode 的不同分支保留在 Apply 原体，但本批未据此决定项目支持范围。

## 3. 资格前阶段可以修改什么

事件5、8、11、6、10、68、41、61及应用后 Buff 程序都沿 `Modifier&` 接续。容器将当前 Modifier 写入 Context.ChangeGuard；每个 Buff 执行动作后，把相应快照中的 Modifier 写回调用者。

因此事件5、6不是只能执行 BattleState 业务的 void 通知。对应程序可以改变 value、取消、分类或 flags，并可同步执行其它领域业务；具体节点仍受自己的数值／取消许可约束。内核没有在事件5或6统一禁止这些修改。

`Buff._IsActionValid` #66091 只确认对应事件动作数组非空；容器逐项排除已结束／禁用 Buff，再进入该 Buff 程序。`_RunActions`／`_RunActionsCore` 负责动作解释及同步重入控制，具体动作的 bool 结果可以停止自己的后继。这不等于全部 Buff 共享一次“未取消才派发”的门。

Entity.EmitEvent 与全局 EventPool 在若干位置还收到装箱的 Modifier 副本。它们不是 Buff/Event 的同一数字枚举，不能把 Entity 事件8/9等直接称为 Buff 的来源8/事件9；Apply 没有将这些副本按 Modifier& 拷回。本批不以这些副本通知替代上面的 Buff 可变接续。

## 4. HP Damage：资格、HIT 与受击程序

`_OnApplyingModifier` #67667 先在 `0x180731560` 执行目标事件6，再在 `0x1807316a8` 检查 isDamage，`0x1807316dd` 虚派发 slot131。事件6之后没有 isCancelled 门；不能仅因这里取消为 MISS，就声称跳过整个 OnTakeDamage 或 Buff 事件10。

`Entity.OnTakeDamage` #67709 的顺序：

1. `m_disappear` 非零：尝试 Cancel(NONE) 后直接退出该专属接收，不执行 HIT 或事件10；force 不绕此分支。位置 `0x18072b9a6 → 0x18072bdc5–de7`。
2. 非 force 时调用 `IsUnhurtableWithModifier`；成立尝试 Cancel(UNHURTABLE)。位置 `0x18072b9b0`、`0x18072ba34–5d`。
3. `_VerifyAbilityDamageMiss` #67708：force、BUFF attackType 或无 source 时返回 false；否则优先读当前 Projectile，没有时读当前 Ability 的 damageMissFlag。命中失败尝试 Cancel(HIT_FAILED)。位置 `0x18072ba6f–98`；helper 的 force／BUFF 门为 `0x180732557–582`。
4. SP controller 检查 SP type 包含 TAKEN_DAMAGE、Modifier 尚未取消、ignoreForSp 为 false，再恢复普通 HIT SP。位置 `0x18072bb10–44`，恢复 `0x18072bba8`。
5. 目标 Buff 事件10：`0x18072bbe1`。这里不会因为前述不可伤／HIT_FAILED 已取消而统一跳过；每个节点自己决定是否响应。
6. GameMode.OnFinalizeEntityDamage，再发 Entity 自身的受击通知。它们位于 Buff 事件10之后。

所以事件5／6／来源8／11的提前取消可以阻止本次普通 HIT 回复；在事件10才成功的闪避／盾则发生在普通 HIT 回复之后，不能回滚已发生的回复。这里证明的是顺序与资格，不自动证明需要独立的公开 ReceivingStarted Key。

### 虚派发没有隐藏的普通 Character／Enemy 前置门

本次 metadata 全范围匹配同名 slot131/132/133，结果保存在 `virtualReceptionOverrides`：Entity 的三项实现，HP 另有 Unit、BossHudTrap、EnemyGiantBoss、EnemyRistar、FootballEnemy；没有 Character 或普通 Enemy 的独立 OnTakeDamage 覆盖。

`Unit.OnTakeDamage` #79019 先在 `0x180b1a57c` 调 Entity，返回后 `0x180b1a59b` 才检查取消，取消时跳过后续当前 Mode 响应。该检查不可能阻止早已在 Entity 中完成的事件10。四个特殊派生也均先调用 Unit；其后继各有自己的限制，不改变这条普通前半链。

### HIT 回 SP 的下游

`SpController._RecoverMp` #67752：非 force 检查 spRecoverStopped，读取当前 SP，加本次数额后进入 `Entity.set_sp` #67439。后者虚派发 SetSpInternal(slot113)。全 metadata 该同名 slot 只有 Entity #67628 与 Trap #78833，保存在 `virtualSpOverrides`。

普通 Entity 路径只检查 alive／force、按当前 MaxSP 限幅并写 ObscuredFP，没有 SP 满通知、技能触发、Buff 安装或 Content 派发。Trap 覆盖在配置开启时把 DoSetSpInternal 转发到关联对象，也没有在这条路径执行技能或 Buff 程序。未发现普通 HIT 恢复本身需要同步重建受击 Hook 候选的原生依据；不能据理论上的“两轮候选快照”差异要求独立公开阶段。XLua 分支未执行，不将 fallback 的范围扩张为热更全局保证。

## 5. Healing 与 EP 的差异

| 本笔类型 | 目标事件6之后的资格与程序 | force／提交差异 |
| --- | --- | --- |
| HP Damage | 上节的 disappear、不可伤、HIT_FAILED、普通HIT、事件10 | force 绕普通不可伤与来源未命中，不绕 disappear，不关闭通用或事件10程序。HP 最终写入仍调用普通 set_hp。 |
| HP Healing | #67710／#67667的内联分支：非 force 检查 HEAL_FREE 并可 Cancel(NONE)，随后发 Entity 受疗通知；没有专属 Buff.OnTakeHeal | force 绕 HEAL_FREE，不关闭通用5/8/6。普通 HP setter 仍执行自己的生命范围与干预。 |
| EP Damage | #67711／#67667的内联分支：非 force 检查 EPFreeAll 和 IsUnhurtableWithModifier，再派发 Buff事件68；没有普通HIT | 此分支没有 HP OnTakeDamage 那个独立 disappear 提前返回。force 绕这里的两项检查；DoApply 的 EP 分支仍独立检查 EPFreeAll，并可返回 false。 |
| EP Healing | 没有 HP damage／heal／EP damage 的专属分支，仍经过通用5/8/6和61 | DoApply 的 EPFreeAll 检查也作用于正向 EP；不能因为没有专属 Receiving 就认为没有准入或通用响应。 |

位置：HP Heal 的 HEAL_FREE `0x18072c0d9–10c`／内联 `0x1807317d6–809`；EP 接收 `0x18072bec8–bfb4`／内联 `0x18073193a–1a12`；EP 提交资格 `0x180723642–649`。EP damage和healing均由 #67684 使用当前 finalDelta 进入 SetEpInternal，并累计 realDelta。

### EP 屏障的资格前消费

同批 Content 绑定定位到 `philae_s_1`／`agoat2_s_2` 的事件6程序。本批补取对应 `BlockElementDamage.Execute` #99225：先排除已取消 Modifier（`0x1810fabf6`）及非 EP damage（`0x1810fac1e`），然后取得配置指定的 Buff／dynamic 额度；`0x1810fae36` 先写扣除后的额度，`0x1810fae77` 再更新本笔 value。此方法没有读取 EPFreeAll、Burst 或不可伤资格。

因此，只要屏障当前有效、剩余额度为正，它的事件6处理位于后面的 EPFreeAll／不可伤检查之前。不能仅用“EP最终不接受本笔资源变化”推定该额度从未消费。屏障与某种具体免疫／爆发状态的实际共存，以及该 Buff 在这些状态中的有效性，仍需对应 Content 绑定证明；本批不将两个可组合字段当作实际场景。

## 6. skip 路径不是普通阶段的重命名

Apply 最早在 `0x1807212c8` 检查 SKIP_MODIFIER_EVENT：

```text
入口 alive、输入未取消
→ 若有 SKIP_MODIFIER_CONSIDER_UNHURTABLE：检查 disappear／不可伤，可 Cancel(NONE)
→ 目标 Buff事件41
→ 复查取消
→ 来源事件61
→ GameMode资格
→ DoApply
→ 不执行普通 OnAppliedModifier（目标7、来源21/85/83）
```

它不执行普通目标5、来源8/11、目标6、普通 HP 的 HIT／事件10或 EP 事件68。考虑不可伤的检查早于事件41；Apply 的这段检查没有 force 分支。实际资源 setter 及其不死、免死、EP归零程序并不因 skip 自动消失，仍由提交方法与其特化解释。

提交后的 skip 标记会再次读取，不是仅沿入口分支的本地布尔值决定后置通知。此处只记录 native 数据流，不据此为项目引入动态阶段开关。

## 7. 当前可直接用于架构判断的事实

- 必须检查真实机制是否需要在目标不可伤资格之前改变状态／Modifier；原生确有这类执行位置，不能以 ArkBattle 尚无订阅推定没有需求。
- 普通 HIT 发生在 Buff 事件10之前，但恢复本身没有已证的同步 Content 回调。可以保留业务顺序而重新设计公开 Hook 组织。
- 早期取消与普通受击内取消，对 HIT 的影响确实不同；某个实际程序是否还跳过后续天赋或计数，须继续查其 filter、mode、有效性与实际绑定，不能仅从事件6的名字推断。
- 本批不决定公开 Hook 数量、不将全部原生事件一一复刻，也不批准删除或简化尚未闭合的实际机制。
