# 死亡归属、最终结束与属性范围

核对日期：2026-11-14。依据为当前 Windows 客户端普通 native 分支、实际角色／技能／模组 Prefab、Buff Holder 和固定版本资料。完整来源、原体及复跑见[证据批次](../evidence/resource-mechanisms-20261114/death-attributes/README.md)。没有运行游戏或验证活跃 XLua。本文记录原生需求，不决定新 API，也不批准简化。

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

## 4. 属性范围与伤害保底属于不同节点

本批解码当前 AttributesData 的34项 AttributeMeta 声明，11项异常布尔字段另列，不将它们误作普通数值。`metadata.json` 保留构造器、声明边界、原字节及枚举；未声明的界限由构造器默认／FP范围决定，不将缺省误写成0。与四个资源领域直接相关的默认声明为：

| 属性 | 声明下限 | 声明上限 |
| --- | ---: | ---: |
| MaxHP | 1 | 未声明 |
| ATK／DEF | 0 | 未声明 |
| RES | 0 | 100 |
| HP固定回复 | 0 | 未声明 |
| HP比例回复 | 0 | 1 |
| MaxEP基础属性 | 0 | 1000 |
| EP自然回复 | 0 | 未声明 |
| EP损伤抗性／元素HP伤害抗性 | 0 | 100 |
| 爆发恢复速度 | 0 | 未声明 |

敌人 MaxEP getter 另加级别对应常量，见[案例25](25-elemental-burst-recovery-timing.md)；不能把基础属性的1000上限当作所有实体最终MaxEP上限。物理／法术／元素公式的最低伤害比例也不属于属性上限；详见[案例38](38-damage-classification-and-permissions.md)。

`Attributes.GetMinValue/GetMaxValue` #65263/64 优先取本属性 nullable range override，缺省才使用基础范围。`_CalculateAttributeValue` 最后按选中的范围限幅。`OverrideDataRange`／`ClearDataRangeOverride` 标脏，refresh=true 时立即求值。当前存储是每属性一个可覆写范围，不是已证明的多来源合并 Contribution。

### 实际范围覆写：信仰搅拌机 X 模组

固定资料 `uniequip_002_rmixer`（毛刷套装），3级实际资源 `rmixer_equip_1_3_p2` 的 Talent／ToggleablePassiveAbilityGroup 关联 GlobalAuraAbility `-6484846798081607645`；checker 要求 `rmixer_t1[full-mark]`。Aura 的 validator 为 `FilterGroupTagTargetValidator`，标签 `laterano`，实际装 `rmixer_e_002_t1`。

模板启用程序先 `AssignAttributeRawDataIntoBlackboard(ATTACK_SPEED,minValue)`，再 `ModifyAttributeDataRangeOverride(minKey=minValue,maxKey=null,refresh=true)`；停用清范围覆写。**实际下限来自接收者原始攻速，不是硬编码10或100。** 原始属性、有效属性、下限及额外攻速修正不能合为一个数值 Contribution。完整资料／组件／模板和原体在本批；非默认使用有实际模组选择，不只是一项工具方法存在。

### MaxHP 变化会进入普通 HP setter

`Entity.OnAttributeDirty` #67699 对 MaxHP 先计算 `currentHP / oldMaxHP × newMaxHP`，再调用普通 `set_hp`（`0x1807287ee`）。随后以 dt=0接续自然回复timer并重设速率。它不是只写比例后的裸字段。

这会与负生命偿还、HP范围和资源通知交互。比如负生命有效、普通HP为1时，MaxHP翻倍使拟写HP为2，该正向变化可能先偿还1点债务。这是两段原生代码的组合推导，不是本次实机观测；不能继续引用“负生命绝不受MaxHP变更影响”的绝对概括。项目 MaxHP 与债务分配契约见 [Vitality](../../architecture/vitality.md)，不能继续沿用旧的纯比例字段写入假设。

## 5. 项目对应

来源与 killer 的独立事实、死亡确认、来源 targetKilled 先于受害者普通 Prepare，以及 InstantKill 调用方的合法生命周期编排见 [Resource](../../architecture/resource.md)与[Lifetime](../../architecture/lifetime.md)。本案不把原生 Context 栈、原因值或对象池变成项目同名协议。

HP／债务、属性范围和生命保护的当前边界见 [Vitality](../../architecture/vitality.md)；完整原生覆盖及具体证据限制见 [Case 37](37-resource-mechanism-coverage.md)。项目选择不能反过来作为原生结论的依据。
