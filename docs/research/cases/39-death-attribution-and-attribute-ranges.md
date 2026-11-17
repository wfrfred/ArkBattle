# 死亡归属、最终结束与属性范围

核对日期：2026-11-14；属性清单、求值与范围入口于 2026-11-17 补核。依据为当前 Windows 客户端普通 native 分支、实际角色／技能／模组 Prefab、Buff Holder 和固定版本资料。死亡来源原件见[原批次](../evidence/resource-mechanisms-20261114/death-attributes/README.md)，完整属性及范围使用见[属性批次](../evidence/attribute-ranges-20261117/README.md)。没有运行游戏或验证活跃 XLua。本文记录原生需求，不决定新 API，也不批准简化。

## 1. 伤害来源、原始来源与当前程序来源分别存在

原生 `Modifier` 有 `source`、`target`、`originalSource`；战斗还持有 `Torappu.Battle.Context`，其中 source、target、buff、ability、modifier、projectile、mainTarget 等分别保存为栈。它们不是一组可互相替代的别名。

`Context.BeginChangeGard` #66677 复制各栈顶部；`ChangeGuard.set_source` #66694 替换本层 source；`Dispose` #66713 弹出本层，恢复外层值。空栈 getter 返回空引用。对象引用还经过 ObjectPtr 的有效性检查，不是只判断一个历史 ID。字段及 helper 原体见 `metadata.json`、`context-bodies.json`。

本批核对全部20个直接调用 `set_source` 的方法，并展开其逻辑体（`source-writers.json`）。典型来源如下：

| 进入的程序 | 设置的本层 source |
| --- | --- |
| 普通 Ability 事件 | Ability 的 owner |
| `Buff._RunActionsCore` #66233 | Buff.source；调用者另决定 target／mainTarget |
| Projectile 的 ActionController | Projectile.source |
| 环境、敌人专属能力及模式动作 | 各自调用者确定的 source，不能按“没有普通攻击”推定为空 |

因此同步嵌套程序结束实体时，归属可能来自正在执行的程序上下文。直接调用扫描不覆盖所有潜在内联、间接写栈或 XLua；本结论还以实际伤害／Buff 入口的完整体交叉核对，不凭20这个计数宣称整个客户端不可能有其他写法。

### 实际无伤害来源正例：锡人 S1

实际技能 `skchr_tinman_1` 根组件 `-3864122712601635940` 安装 `tinman_s_1[dot]`，其周期程序是 `NoSourceDamage(MAGICAL, BUFF)`，`setOriginalSource=true`、`originalSourceType=BUFF_SOURCE`。节点以无来源公式构造 `Modifier.source=null`，另外保存 originalSource。完整选择和构造体见[Damage分类调查](38-damage-classification-and-permissions.md)。

这条周期程序本身由 Buff 动作执行，Buff._RunActionsCore 的 source 栈仍按 Buff.source 设置。**“本笔伤害无来源”不能推出“同步死亡没有程序来源”**；也不能把 originalSource 默认认作击杀字段。最终读取哪项事实见下一节。这里是实际绑定与普通静态调用链推导，不是实机击杀计数实验。

这条普通 HP 提交由 `Entity.DoApplyModifier` #67683 调用 `set_hp`。后者在 `0x18073af61..85` 以 `force=false, noSource=false, skipReborn=false` 虚派发 SetHpInternal，见[普通 HP setter 原体](../evidence/hp-regeneration-20261113/native.json)。因此 Modifier.source 为空不会自动选择 HP_ZERO_WITH_NO_SOURCE；不能将 NoSourceDamage 节点名称与死亡入口的 noSource 参数等同。

## 2. 最终死亡怎样读取归属

`Entity.SetHpInternal` 最后通过虚 `OnHpZero(noSource, skipReborn)` 分流。先前的普通免死、替身、不死、同实例复活见[生命应用](11-damage-apply-and-hp-application.md)。成功进入这些机制不等于已经执行最终 OnFinish。

未被复活接管时，`Entity.OnHpZero` #67650 先通知 `BuffContainer.OnOwnerBeforeDead`（Buff.Event72），再以 noSource 选择 `HP_ZERO=2` 或 `HP_ZERO_WITH_NO_SOURCE=8`，调用虚 FinishMe。它本身不改 source 栈。

`Entity.FinishMe` #67633 的顺序为：检查 unfinished → 保存 finishReason／停止状态机 → 虚派发 **OnFinish（slot123）** → `GameMode.DestroyEntity`。虚调用位置为 `0x180724805..813`。不能因没有直接调用方法名就漏掉这一步，也不能把 OnFinish 一概推迟到对象回收。

`Entity.OnFinish` #67653 在 `0x18072a189..19d` 读取 Context.source 栈顶，保存本次捕获值；没有读取 Modifier.source 或 originalSource。后续分成两个方向：

| 通知 | 当前普通分支的条件及载荷 |
| --- | --- |
| 来源 `BuffContainer.OnTargetKilled` → Buff.Event9 | reason 为2／3／5／8且捕获来源对象有效；mainTarget 为被结束对象 |
| 受害者 Buff.Event3（死亡） | death-like reason；mainTarget 传入捕获来源 |
| 受害者 Buff.Event29（被击杀） | death-like reason、来源有效，**另排除 reason8**；mainTarget 为来源 |
| 受害者 Buff.Event34（到达出口） | reason1；不是死亡事件 |
| 受害者 Buff.Event4（结束） | 通用完成路径，不等同于死亡或被击杀 |

来源通知完成后，BuffContainer.OnOwnerFinish 对受害者 Buff 作一次遍历；每个 Buff 内按条件执行死亡、被击杀、通用结束响应，再处理下一个 Buff，并非整个容器分别广播三轮。全部响应返回后才清 Buff及其他附属内容，再进入 GameMode 的物理销毁／回收政策。实际 Character／Enemy 的 FinishMe 覆盖也已展开，不把基类一个方法等同于所有对象的完整最终结束。

`BuffContainer.OnOwnerFinish` 原样转交 source；`Buff.OnOwnerFinish` #66135 在 `0x1806d407d` 排除 reason8，之后检查来源有效，再决定 Event29。本链没有发现“来源为空便在这里替换为受害者自身”的分支。PRTS 的无击杀来源默认自身概括不能直接替代本指纹；若要主张其他入口有该政策，须找到那个入口。本批不据此新增或省略项目归属字段。

受害者 Buff 如何取得击杀者也已闭合：`Buff.OnOwnerFinish` 在 `0x1806d40c2..40f2` 将传入的 source 压入 mainTarget 栈，再派发事件29，结束后恢复栈。对锡人持续伤害与嵯峨重伤的组合，静态调用链为：

```text
锡人 Buff 执行周期程序：Context.source = 锡人
→ NoSourceDamage 扣血：Modifier.source = null
→ 最终死亡：捕获 Context.source = 锡人
→ 重伤 Buff 的事件29：MAIN_TARGET = 锡人，BUFF_SOURCE 仍为嵯峨
→ ModifySp(MAIN_TARGET)：给锡人回复技力
```

重伤不重新猜测击杀者，也不读取自己的 Buff.source 作为奖励接收者。传参原体见[kill-observer-context.json](../evidence/resource-mechanisms-20261114/death-attributes/kill-observer-context.json)，实际 `cripple` 的事件29与 ModifySp 目标见[templates.json](../evidence/resource-mechanisms-20261114/death-attributes/templates.json)。这仍是两条实际内容与普通 native 的组合推导，没有进行实机组合验证。

### 实际内容区分

| 实际绑定 | 能区分的业务 |
| --- | --- |
| 阿米娅 Talent1 的 `amiya_t_1[kill]` → `kill_to_add_sp`，事件9给 SOURCE 加SP | 来源击杀通知有实际消费者；不是观察任何 HP 扣减 |
| 嵯峨 Talent1 → `saga_t_1` → `cripple`，事件29给 MAIN_TARGET 加SP | 获得奖励的是受害者程序观察到的击杀者；非致命伤害标记与后续处决是独立步骤 |
| `cripple` 周期／出现条件的 `InstantKill(noSource=true)`，Saga S2 的处决为 false | 自然结束与主动处决可选择不同 reason；不能把来源 Event9、目标 Event29 合并成一个“是否有击杀者”判断 |
| 阿米娅 S3 实际另装模板 `suicide`，其开始动作是 `Withdraw(withdrawSource=true,switchToDeadState=true,force=false)` | 名为 suicide 的模板并不调用 InstantKill。实际 Character.Withdraw 以 reason5 调虚 FinishMe；不是普通可保护的 HP Damage |

上述角色选择、完整模板与 PPtr 在 `static-inputs.json`、`content.json`、`templates.json`；Withdraw 原体在 `withdraw.json`。事件名与编号属于 Buff.Event，不与 Entity.Event 或 UI Event 混用。

### 来源后继与死者输出的顺序会改变生死

2026-11-16 定向补核的实际配置、完整原体和可执行对照见[死亡通知顺序证据](../evidence/death-notification-order-20261116/README.md)。这不是实机组合测试，原生事实与项目探针分别记录。

- 斥罪固有天赋实际登记 `judge_t_1`。精二无模组每次击杀先给同一 Buff 黑板增加 `10% MaxHP` 屏障；接收伤害时直接读取该额度，无需等待下一 Tick。
- 炎客实际天赋 `flameb_t_1` 在击杀响应中登记 MaxHP 叠层。属性登记同步通知 Entity，当前 HP 当场按新旧 MaxHP 比例更新。
- FC-8 实际出生的“领袖”召唤 `enemy_1294_duchns`（焦竭之火）；火的固有死亡程序直接执行范围法术伤害，再执行灼燃损伤，没有先生成延时弹道。普通配置为 800 法术输出、1000 灼燃损伤，范围为中心及四邻格。四邻格斥罪可攻击它，不受仅作用于同格宿主的附着缴械／静默限制。

可达配置的组合推导：取精二满级满信赖、潜能1、无模组斥罪，MaxHP=4655、RES=10，击杀前剩1800 HP、屏障已耗尽，灼燃条未积累。她击杀四邻格的焦竭之火：

| 来源后继时点 | 数值过程 | 结果 |
| --- | --- | --- |
| 死者死亡输出前补盾 | 获得465.5屏障；800法术输出经RES成为720，扣盾后损失254.5 HP；随后1000灼燃引发爆发，降RES后造成1200法术伤害 | 剩345.5 HP |
| 完整伤害返回后补盾 | 先损失720 HP，剩1080；随后灼燃爆发造成1200伤害 | 先被击倒，无法等到补盾 |

`compare-order.mjs` 用当前 Core 公开操作验证这两个顺序，并包含1000灼燃损伤及标准爆发，没有把元素后继省略；它只实现本例必要步骤，不是完整斥罪或FC-8实装。原生绑定、普通结束顺序与这些数值规则支持上述组合推导，不将项目运行结果当成原生实机观测。

`lifetime-order.mjs` 另验证了返回时点的边界：无外层 Lifetime 结算时，死者 Effect 的 Finalize 通常已先于 Apply 返回；伤害发生在其他 Effect.onEnd 内时，Finalize 会延后。因此，把来源业务放在返回后，不保证它相对死者清理的稳定先后。该探针通过清理中登记禁回SP得到0／1 SP的差异，是公开API执行示例，不冒充实际角色配置。

这些依据证明来源后继不能整体视为可以任意后置的返回后业务。Outcome.killed 仍可表示本笔请求确认死亡；来源后继如何在死亡协议中获得明确时点，属于后续架构决定，不据原生事件编号自动新增Hook。

## 3. 死亡原因、强制设零和回收不能合并

当前 FinishReason 枚举：NONE、REACH_EXIT、HP_ZERO、FALLDOWN、WITHDRAW、DEADLIKE_WITHDRAW、SILENT_WITHDRAW、OTHER、HP_ZERO_WITH_NO_SOURCE、REPLACED、RESPAWN_SELF、MOVE_LIKE_RESPAWN_SELF、MOVE_LIKE_RESPAWN_EXTERNAL（依次0..12）。`IfReasonIsDeath` 接受2／3／5／8，`IfReasonIsHpZero` 接受2／8。

`InstantKill`、`Suicide`、Withdraw 与 FinishWithNoReason 有不同前置门控和最终原因。`SetHpInternal(force=true)` 仍可能进入归零前程序；“force”不是跳过全部免死。原因、skipReborn、force、当前归属各自独立，不能由一个操作名字推导四项政策。

GameMode 最后决定销毁／回收方式。Default／AutoChess／GameCity 的 DestroyEntity 和模式工厂已提取到 `mode-termination.json`、`kill-observer-context.json`；AutoChess 有保留 Dummy 的后续。它们不改变基类 FinishMe 中 OnFinish 先执行的事实。GameCity 的模式名称不是生息演算的充分证据，本批未据此排除；没有为 Core 选定复刻原生对象池或场景物件的政策。

来源已经结束／回收后，原生 ObjectPtr 与动作入口各自决定是否仍能取得它；完整弹道例见[案例18](18-projectile-source-and-target-lifecycles.md)。不能只凭保存 Ref 就假定所有后继能继续访问活来源，也不能因普通 Damage.source 为空便丢弃已采样数值。

## 4. 属性求值与范围

### 完整数值属性清单

当前 `AttributeType` 的 0–37 共38个编号：34项正式属性，9–12为保留项；38是计数标记 `E_NUM`。下表完整列出34项 `AttributeMeta` 的默认业务边界，所有属性均进入同一求值机制。`—` 表示未额外限制，实际使用 FP 可表示边界，不是0或数学无穷；小数按语义值显示，原始 float 字节、构造器及默认值保存在[完整库存](../evidence/attribute-ranges-20261117/inventory-native.json)。

| ID | 原生属性 | 含义 | 下限 | 上限 |
| ---: | --- | --- | ---: | ---: |
| 0 | MAX_HP | 最大生命 | 1 | — |
| 1 | ATK | 攻击力 | 0 | — |
| 2 | DEF | 防御力 | 0 | — |
| 3 | MAGIC_RESISTANCE | 法术抗性 | 0 | 100 |
| 4 | COST | 部署费用 | 0 | — |
| 5 | BLOCK_CNT | 阻挡数 | 0 | — |
| 6 | MOVE_SPEED | 移动速度 | 0.1 | — |
| 7 | ATTACK_SPEED | 攻击速度 | 20 | — |
| 8 | BASE_ATTACK_TIME | 基础攻击间隔 | 0 | — |
| 13 | HP_RECOVERY_PER_SEC | 固定生命回复速度 | 0 | — |
| 14 | SP_RECOVERY_PER_SEC | 自然技力回复速度 | 0 | — |
| 15 | ABILITY_RANGE_FORWARD_EXTEND | 攻击距离扩展 | — | — |
| 16 | MAX_DEPLOY_COUNT | 最大同时部署数 | 0 | — |
| 17 | DEF_PENETRATE | 比例物理穿透 | 0 | 1 |
| 18 | MAGIC_RESIST_PENETRATE | 比例法术穿透 | 0 | 1 |
| 19 | HP_RECOVERY_PER_SEC_BY_MAX_HP_RATIO | 比例生命回复速度 | 0 | 1 |
| 20 | TAUNT_LEVEL | 嘲讽等级 | -2 | 2 |
| 21 | RESPAWN_TIME | 再部署时间 | 0 | — |
| 22 | MAX_DECK_STACK_CNT | 最大待部署叠加数量 | 0 | — |
| 23 | MASS_LEVEL | 重量 | — | — |
| 24 | BASE_FORCE_LEVEL | 基础力度等级 | — | — |
| 25 | DEF_PENETRATE_FIXED | 固定物理穿透 | 0 | — |
| 26 | ONE_MINUS_STATUS_RESISTANCE | 一减状态抵抗率 | 0.001 | 1000 |
| 27 | MAGIC_RESIST_PENETRATE_FIXED | 固定法术穿透 | 0 | — |
| 28 | MAX_EP | 基础最大元素值 | 0 | 1000 |
| 29 | EP_RECOVERY_PER_SEC | 元素回复速度 | 0 | — |
| 30 | SP_RECOVER_RATIO | 自然技力回复倍率 | 0 | — |
| 31 | EP_DAMAGE_RESISTANCE | HP元素伤害抗性 | 0 | 100 |
| 32 | EP_RESISTANCE | EP损伤抗性 | 0 | 100 |
| 33 | DAMAGE_HITRATE_PHYSICAL | 物理命中率 | 0 | 1 |
| 34 | DAMAGE_HITRATE_MAGICAL | 法术命中率 | 0 | 1 |
| 35 | EP_BREAK_RECOVER_SPEED | 元素爆发恢复速度 | 0 | — |
| 36 | SLOW_DOWN | 迟钝乘数 | 0 | 1 |
| 37 | BLOCK_RADIUS_SCALE | 飞行阻挡半径倍率 | 0 | — |

`AttributesData` 另有 blockVolume 和11项异常免疫布尔字段，它们不是上述 AttributeType；当前 HP／SP 等资源余额也不属于此表。属性是否参与某个单位的业务，由相应消费者决定，枚举存在不等于每种单位都使用它。

### 底值、修正与有效值

`GetRawValue` #65244 直接读取当前 `m_rawData`，不应用 Modifier、当前范围或取整。它指当前底值，不保证等于原始 JSON：`Reset` 按默认属性范围限幅初始输入后写底值和缓存；`OverwriteAllAttributesRawData` 也先按默认范围限幅，但单项 `OverwriteRawData` 直接写底值并标脏。场上 DeckBuff 通过普通 Modifier 生效，不因此进入 raw。

`GetValue` #65243 在缓存有效时直接返回；脏时调用 `_CalculateAttributeValue` #65262：

```text
unclamped = ((raw + Σaddition) × max(0, 1 + Σmultiplier)
             + ΣfinalAddition) × ΠfinalScaler
effective = Clamp(unclamped, currentMin, currentMax)
```

最后才限幅并写缓存。通用公式不取整；显式 `GetValueRoundToInt` 先取有效值，再取偶舍入。配置字段的整数写入、养成插值和具体业务 getter 各有政策，不能概括成“所有属性均取整”。原体与复跑见[求值记录](../evidence/attribute-ranges-20261117/README-native.md)。

### 范围覆写与同步通知

每个属性保存一份基础范围和至多一份当前覆写；`GetMinValue/GetMaxValue` 优先读取覆写。`OverrideDataRange` 用本次提供的边界构造新范围：只传一侧时，另一侧恢复基础范围对应侧，不保留上次覆写；两侧都为空则不操作。`ClearDataRangeOverride` 才明确清除覆写，恢复基础范围。

范围写入／清除先标脏，再同步通知 `onAttributeMarkedDirty`，载荷包含旧缓存；`refresh=true` 另显式调用 `GetValue`。通知内的消费者可立即查询新值：攻速／间隔会接入已有冷却刷新，MaxHP接入生命比例处理，不等待下一个 Tick。仅以脏缓存实现惰性求值，不意味着后继通知也延迟。

原生不是覆写来源栈或 Contribution：后写覆盖当前槽，清除不会自动恢复更早的覆写。若项目采用来源合并，必须另作明确的项目决策，不能称为本段原生事实。

### 属性范围与消费者限制分开

- 攻速属性默认下限20、没有声明上限；`BattleFormula.CalculateAttackInterval` 另将输入攻速限制到 `[10,600]`。默认路径先限制到20，因而通常看不出公式下限10；动态范围允许低于20时，两者不能混同。两个常量由 `BattleFormula..cctor` 的机器码直接确认。
- 移速属性的0.1下限先于 `BattleOptions.MOVE_MULTIPLIER`，不是最终每 Tick 的最低位移，见[移动调查](15-locomotion-native-semantics.md)。
- 敌人 MaxEP getter 另加级别对应常量，见[案例25](25-elemental-burst-recovery-timing.md)；不能把基础属性的1000上限当作所有实体最终MaxEP上限。
- 物理／法术／元素公式的最低伤害比例不属于属性范围；详见[案例38](38-damage-classification-and-permissions.md)。

### 实际范围覆写

完整当前 Buff Holder 的9054条模板中，9项含范围覆写节点。结合所选 Prefab、角色／技能资料及关卡引用，支持玩法的已核正例覆盖6种属性；完整 PathID、启用条件、关卡 JSON Pointer 与复跑见[实际使用记录](../evidence/attribute-ranges-20261117/README-usage.md)。

| 实际内容 | 覆写属性 | 数值政策 |
| --- | --- | --- |
| 信仰搅拌机 X3 | 攻速 | 下限取目标当前 raw 攻速；停止清除。 |
| Touch 的固有被动 | 移速 | 下限取目标当前 raw 移速；停止清除。 |
| 喷泉水池 `trap_279_pirene` | MaxHP | 开始时采样有效 MaxHP 到 `hp_origin`，上下限均取此值；活动关卡及剿灭有实际预置。 |
| 源阶方模块 `trap_324_shmbmb` | MaxHP | 开始时读取 `dynamic` BB 作为相同的上下限；集成战略关卡有实际预置。 |
| 赤金条 `enemy_2142_shsggd` | 攻速、基础攻击间隔 | 上下限分别锁为100、0.1秒；实际出现在集成战略 `rogue6_b-2`，不能按名称或自然物描述排除。 |
| 沉沦的探险者 `trap_345_shadvt`／`trap_349_shadvt2` | 自然 SP 回复速度、倍率 | 两项上下限均锁为1；另一段程序独立处理增加 SP 的 Modifier。 |

娜斯提二技能装置已闭合技能选择、Token、被动及 `nasti_nstchr[blood_one]` 的 MaxHP范围节点绑定，但 `init_max_hp`／`init_hp` 的生产链未额外追踪，不能据模板名断言“固定最大生命为1”。通用 `move_speed_range_override` 有 GlobalBuff 资源，所选关卡没有找到实际启用字面 key，仍列为入口未闭合。`sandbox_v3_lock_maxhp` 属于明确排除的生息演算，不作为项目支持依据。

范围节点在执行时用 `Blackboard.TryGetFP` 读取边界并保存为数值；之后 `Attributes.GetValue` 只使用已保存范围，不重新求 BB。源阶方的 `dynamic` 是 BB 值来源，不代表属性查询持有动态回调。

信仰搅拌机 X 模组的完整绑定已在原批次核实：

固定资料 `uniequip_002_rmixer`（毛刷套装），3级实际资源 `rmixer_equip_1_3_p2` 的 Talent／ToggleablePassiveAbilityGroup 关联 GlobalAuraAbility `-6484846798081607645`；checker 要求 `rmixer_t1[full-mark]`。Aura 的 validator 为 `FilterGroupTagTargetValidator`，标签 `laterano`，实际装 `rmixer_e_002_t1`。

模板启用程序先 `AssignAttributeRawDataIntoBlackboard(ATTACK_SPEED,minValue)`，再 `ModifyAttributeDataRangeOverride(minKey=minValue,maxKey=null,refresh=true)`；停用清范围覆写。**实际下限来自接收者当前 raw 攻速底值，不是硬编码10或100。** 底值、有效属性、下限及额外攻速修正不能合为一个数值 Contribution。完整资料／组件／模板和原体在原批次；非默认使用有实际模组选择，不只是一项工具方法存在。

### MaxHP 变化会进入普通 HP setter

`Entity.OnAttributeDirty` #67699 对 MaxHP 先计算 `currentHP / oldMaxHP × newMaxHP`，再调用普通 `set_hp`（`0x1807287ee`）。随后以 dt=0接续自然回复timer并重设速率。它不是只写比例后的裸字段。

这会与负生命偿还、HP范围和资源通知交互。比如负生命有效、普通HP为1时，MaxHP翻倍使拟写HP为2，该正向变化可能先偿还1点债务。这是两段原生代码的组合推导，不是本次实机观测；不能继续引用“负生命绝不受MaxHP变更影响”的绝对概括。项目 MaxHP 与债务分配契约见 [Vitality](../../architecture/vitality.md)，不能继续沿用旧的纯比例字段写入假设。

## 5. 项目对应

来源与 killer 的独立事实、死亡确认、来源 targetKilled 先于受害者普通 Prepare，以及 InstantKill 调用方的合法生命周期编排见 [Resource](../../architecture/resource.md)与[Lifetime](../../architecture/lifetime.md)。本案不把原生 Context 栈、原因值或对象池变成项目同名协议。

HP／债务、属性范围和生命保护的当前边界见 [Vitality](../../architecture/vitality.md)；完整原生覆盖及具体证据限制见 [Case 37](37-resource-mechanism-coverage.md)。项目选择不能反过来作为原生结论的依据。
