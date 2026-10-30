# Case C：派发期间增删 Buff 与嵌套结算

核查日期：2026-10-07。第 8 节源码对照：`314b942`。本篇确定可观察的顺序与可见性，不要求复刻官方容器、随机消费轨迹或浮点实现。

## 1. 本例回答什么

需要分别回答三个问题：事件开始时有哪些候选；轮到候选时它是否仍有效；事件动作中的新伤害／回复何时完成。
“锁定候选”不意味着锁定 HP、属性或全部战场查询；“结束实例”也不意味着取消已经进入的内容程序。

证据等级沿用 [02](../02-combat-buffs-and-effects.md)：**A** 为本机原生路径，**B** 为模板与执行器共同确认，**推断** 为据此推导的例子，**未核对** 不作为兼容要求。
客户端与输入指纹见 [05](../05-evidence-and-open-questions.md)。本轮未执行 Lua 热更新，也没有实战逐帧采样。

## 2. 最小内容与引用范围

| 样例 | 已核对的引用 | 用途与范围限制 |
| --- | --- | --- |
| 泥岩最后一层次数盾 | `chess_char_4_18_a/b → char_311_mudrok`；默认 S2，天赋 `hp_ratio=0.2`；角色 prefab 被动组件配置 `mudrok_t_1[recharge]`／`[init]`，模板生成 `[shield_a]` | 本季池内的次数盾、非医疗回复与结束程序；不据此宣布整套角色已实现 |
| `skadi2_s_1[protect]` | holder 中的受击列表与 `DamageSplit.Execute` | 通用接收协议的压力例；当前 `chess_char_6_04_a/b` 默认 S3，S1 不作为本季默认可达证明 |
| `shield_all` | holder 中 `BlockDamage → IsBlackboardZero → FinishBuff` | 额度屏障耗尽的有限对照；模板存在不证明某一卫戍内容选择它 |

泥岩角色 bundle 为 `charpack/char_311_mudrok.ab`，CAB 为 `CAB-d0d07c59305464049e780ccb732095f7`。
被动 Buff 组件 PathID 为 `4005481957556965552`；角色初始化与技能选择的完整动态流程不是本例的研究范围。
模板来自 `config/buff_template_holder.ab`，动作列表已解码 `SerializedState`，不是按节点名称猜测行为。

持久证据为下文保留的关键方法／VA、模板动作与轨迹，输入版本登记见[初始客户端批次](../evidence/client-excerpts-20261007/README.md)。当时 `methods.json`、`enums.txt`、模板／角色组件的完整解码和 `audit.py`／`generic.py`／`buffer-extra.py` 专用提取脚本没有归档；这些未保存产物不作为当前可执行入口。

## 3. 候选集合锁定，执行资格实时检查

**A。** `BuffContainer.m_buffs` 位于对象 `+0x18`，类型为 `SortedDoubleBufferedBuffList`。
`OnTakeDamage`（64807）通过该集合开始枚举，并非先提取全部受击倍率统一合并。

通用 `DoubleBufferedList<T>.GetEnumerator` 路径由这个调用定位到共享体 `0x185714400`：

```text
保存旧 m_eCounter，随后加一
旧值为 0：清理 m_cachedBuffer，并从 m_internalList 建立缓存
旧值非 0：保留现有 m_cachedBuffer
新枚举器使用 m_cachedBuffer
Dispose 回调：m_eCounter 减一
```

关键分支在 `0x18571444d–0x1857144ad`，枚举器恢复路径仍取 `+0x18` 缓存。
释放回调共享体 `0x185714e30` 在 `0x185714e7c` 减少计数；逆向枚举有对应路径。
`SortedDoubleBufferedBuffList.Add`（64708）和 `DoubleBufferedBuffList.Remove`（64704）修改的是 `m_internalList`（`+0x10`）。

这里能确认的是**同一集合的嵌套枚举共享最外层候选缓存**，不只是“本次 foreach 不看新增”。
本轮核对的相同容器其他 Buff 事件也由同一 `m_buffs` 枚举入口取得候选；不同单位的容器分别维护缓存。
不需要在项目里照搬池化枚举器或双缓冲数组；需要保留能够改变结算结果的候选范围。

**A。** `OnTakeDamage` 取得每个弱引用后重新调用 `get_isFinishedOrDisabled`（64530）：

```text
取候选身份
→ 引用无效：跳过
→ finished 或 !enabled：跳过
→ 将当前 Modifier 放入临时 context
→ 执行该 Buff 的 OnTakeDamage
→ 继续下一个候选
```

资格检查位于 `0x180685c69–0x180685c7e`；不是事件开始时就固定每个实例的有效性。
`Buff.OnTakeDamage`（64595）执行 `_RunActions` 后，把返回的 Modifier 写回传入引用。
因此后续实例读到前一个实例修改后的值；同一个实例的当前余量和黑板也不是候选缓存的副本。

| 变化发生在外层枚举期间 | 外层剩余候选 | 同容器嵌套 Buff 事件 | 完全退出后新事件 |
| --- | --- | --- | --- |
| 新建并最终启用 C | C 不加入旧候选缓存 | C 不加入共享的旧缓存 | 新缓存可以包含 C |
| 对旧候选 B 执行 MarkFinish | 轮到 B 时跳过 | B 即使仍在缓存中也跳过 | 清理后不再登记 |
| 旧候选 B 被覆盖而禁用 | 轮到 B 时跳过 | 重新检查时跳过 | 按届时有效性判断 |
| 缓存已有的禁用 B 被重新启用 | 轮到 B 时可参加 | 按当时有效性检查 | 按届时有效性判断 |
| 修改 B 的护盾余量 | 若轮到 B，读取最新事实 | 读取最新事实 | 读取最新事实 |

上表是原生普通路径的规则推导，尚未逐项运行客户端实验。候选缓存并非开始时有效规则的预过滤列表。
若在另一个容器开始事件，且那个容器没有未退出枚举，它会从自己的当前集合建立新缓存。
**A，交叉复核。** 按 key 查询也使用同一个枚举集合：`ContainsBuff`（64755）在 `0x180672403` 取得 `m_buffs`，`0x180672417` 调用 `0x185714400`，随后在 `0x1806724da` 检查当前 enabled；`GetFirstBuffByKey`（64744）对应锚点为 `0x180674b93`、`0x180674ba7`、`0x180674c6a`。因此它们在同集合活跃枚举期间也复用旧候选，而不保证能查到刚安装的新身份。

`GetBuffByUid`（64743）在 `0x1806740c3` 读取 UID map，`0x1806740d8` 直接查找，不枚举 `m_buffs`，也不筛 enabled。新登记 C 可以按 UID 取得，而按 key 的嵌套查询仍可能找不到 C。属性集合是否共享这一候选范围未核对；这些证据不冻结 HP、实例余量或整个世界。

## 4. MarkFinish、移除、通知与回收不是一个步骤

**A。** `MarkFinish`（64548）首次执行时先 `set_isEnabled(false)`，再置 finished，再处理派生实例与覆盖组。
禁用过程撤销属性贡献并执行相应禁用通知，详见 [Case A](01-buff-installation-and-parent-scope.md)。
实例在集合中尚有引用，不妨碍后续事件检查立刻发现它已失效。

受击遍历结束后，`OnTakeDamage` 调用 `_CheckFinishedBuffs`（64780）。
后者枚举 finished 实例，调用 `_FinishAndRemoveBuff`（64787）：从集合和 UID map 移除，再执行 `_FinishBuff`（64788）。
结束动作、来源／覆盖关系清理与 Unity 对象回收还有后续步骤；常规移除路径可调用 `RecycleBuffNextFrame`。

这个清理也可能发生在**嵌套事件返回前**，因为嵌套容器事件同样有结束检查。
不能规定所有 ON_FINISH 都固定等到最外层派发结束；嵌套清理仍不会重建正在使用的候选缓存。

**A+B。** “失效后跳过下一次事件”不等于“停止已进入的动作列表”。
`Action.ActionUtil.RunActions`（99407）检查节点允许来源、`executeCondition` 和前一步成功值，再同步调用节点。
普通列表循环没有每个节点都重新检查 Buff.enabled 的通用中断条件。
例如真实 `enemy_xi_s2[shield_last]` 的列表在 `FinishBuff` 后仍列有表现、日志与能力中断动作。
这只说明结束后的后继允许存在，不把该敌人的模板存在视为本季可达证据。

## 5. DamageSplit：嵌套接收先完成，外层才继续

**B。** `skadi2_s_1[protect]` 的受击优先级为 −2000，事件 10 的动作顺序是：

```text
DamageSplit(target = BUFF_SOURCE)
→ DamageScale(isOneMinus = true)
→ 表现动作
```

**A。** `DamageSplit.Execute`（95849）取得外层当前 Modifier 的值，按非负比例计算分担量。
它通过 `CalculateDamageByAtkNoSource`（77307）建立一个**无来源、PURE** 的独立 Modifier。
随后设置 `SharedFlagIndex.SKIP_MODIFIER_EVENT`（7），直接调用接收者的 `ApplyModifier`（66079），再返回本节点结果。
调用与返回见 `0x18103476a–0x18103478a`；没有先把本次分担投递到下一 tick。

`Modifier.SetSharedFlag` 的 index 重载（70157）把 7 转为 mask `0x80`。
`ApplyModifier` 在 `0x1806fd254` 检查它，转入 `OnApplyingSkippedModifier`，绕过普通输出／受击 Modifier 事件。
因此这条分担不会再次走普通 `OnTakeDamage → DamageSplit`；防递归来自具体接收政策，不是任意深度上限。
它也会改变其他普通接收规则的参与资格，不能仅压成“禁止再次分担”。跳过入口仍有自己的事件处理。

该路径继续执行 `DoApplyModifier`（66095）和 HP 状态转换；正常 Modifier 后置事件也受 skip 标志约束。
“这条分担同步”不意味着所有反击、投射物或延迟能力都同步；`TriggerAbility` 可能启动另一种执行过程。

最小事实 trace（**推断**，使用便于区分顺序的输入，不代表官方技能数值）：

```text
被保护者 P：HP 1000；接收链当前伤害 D = 700
分担者 S：HP 1000；分担比例 q = 0.5
外层 P 的接收事件进入 protect
  新 Modifier 对 S 结算 350 PURE，走 skip 入口
  S 的 HP = 650，相关即时接收流程返回
  外层 context 恢复到 P／原 Modifier
  DamageScale 将 P 的当前 D 改为 350
外层对 P 扣血，P 的 HP = 650
```

如果把分担延迟到外层结束后才做，后续规则看到的 S 的 HP 就不同；若让分担重新走普通分担事件，参与次数也不同。
若 S 在嵌套操作中到零，零生命处理可在外层对 P 扣血之前发生；是否因此结束 protect、改变后继，要按实际父关系与内容动作另核对。

## 6. 泥岩：伤害取消仍有回复与实例结束

**B。** `mudrok_t_1[shield_a]` 的事件 10 列表为：

```text
BlockDamage
→ HealViaMaxHpRatio(target = BUFF_OWNER,
                    ignoreHealFree = true, skipModifierEvent = false)
→ 表现
→ FinishBuff(updateOverrideMap = true)
```

`BlockDamage.Execute`（95824）改变当前 Modifier 的取消／吸收事实；次数盾和额度屏障的配置分支不同。
`HealViaMaxHpRatio.Execute`（96425）建立新的 Heal Modifier，并同步调用 `ApplyModifier`，不是把外层已取消的伤害改成治疗。
本模板的 skip 为 false；这次回复可进入自己的正常 Modifier 事件，和外层 Buff 派发共享该单位的候选缓存。
`FinishBuff.Execute`（94978）调用的是 MarkFinish；之后的结束检查才进行移除与 ON_FINISH。

**推断 trace**：泥岩 HP 400／1000，盾 `[shield_a]` 生效，合格伤害被该盾挡住，且无其他回复修正／禁止。
本次伤害的 HP loss 为 0；天赋比例 0.2 的新回复使 HP 到 600；盾标记结束。
所以不能把“伤害取消”解释为回滚整个受击内容程序，或以 HP loss 为 0 就忽略实例消耗与回复。

模板的 ON_START 结束 `[recharge]`；ON_FINISH 创建 `[recharge]`。
这使盾清理可能同时改变实例集合。新 recharge 的安装／启动可以发生，参加事件候选则仍按集合的枚举作用域判断。
`shield_all` 提供另一对照：额度在 `BlockDamage` 中消耗，`IsBlackboardZero` 成功后 MarkFinish；部分吸收与全部挡住不能共享一个“没受伤”布尔值。

## 7. 上下文恢复、最新 HP 与死亡

**A。** `BuffContainer.OnTakeDamage` 与 `Buff._RunActions` 使用 `Context.BeginChangeGard`。
`Context.ChangeGuard.Dispose`（65138）恢复临时 source／target／buff／modifier 等上下文栈。
它不把此前修改的单位 HP、Buff 黑板或有效性恢复成进入事件前的快照。
因此嵌套调用返回后，“外层仍拿原 Modifier”与“外层读取最新领域事实”同时成立。

`DoApplyModifier` 在真正应用 HP 前取得当前 HP／额外生命；应用后读取结果并写该 Modifier 的实际变化。
这是一次 Modifier 的结果，不是整段内容中所有嵌套伤害与回复的净变化。
外层的 HP 基线必须在对应应用阶段解释，不能默认沿用整次行动开始时的 HP。

`SetHpInternal`（66039）有尝试到零前的 Buff 介入、免死限制与最终到零处理。
到零分支在 `0x18070ac65` 同步调用虚槽 120，即 `OnHpZero`，不是先等 ActionUtil 的整张动作表执行完。
`Unit.OnHpZero`（76772）还检查重生；普通路径进入 `Entity.OnHpZero`（66064），触发 `OnOwnerBeforeDead` 与结束请求。
这证明 HP 与相关零生命流程可以先发生，不证明场上对象已经从所有索引移除或视觉对象已回收。

尚未核对：各死亡状态机的移除时点、死亡反应中重新回复／生成对象的完整规则，以及外层持有已结束目标时各节点的资格判断。
不能仅从同步调用推导“原生会无条件完成外层攻击”，也不能统一在 HP 到零时删除对象并中断全部后继。

## 8. 对照当前 Work／Resources 的边界

下表记录项目目前选择的有限实现，不把代码与测试当成新的原生证据。

| 当前实现事实 | 协议范围与限制 |
| --- | --- |
| `CombatWork` 保存当前 Unit、创建／移除结果、事件与 execution；同步操作返回后立即接续最新工作事实 | 不冻结整个事件世界；Blocking 等仍读取已选阶段基线；整 tick 成功后才权威发布 |
| `EffectDispatchScope` 在每个接收 Unit 的活跃事件中捕获全部登记身份，含当前停用候选；同容器嵌套和参与查询共享范围 | 新身份可按 UID 取得，但不加入该活跃候选；另一接收 Unit 若没有活跃事件，建立自己的当前范围；不固定整次 Damage 的候选 |
| Damage／Healing 的领域 dispatch 在候选轮到前重新读取当前实例与参与事实，再按领域排序和规则资格执行 | 候选身份冻结，载荷与有效性 live；Damage 的分组胜者按当前参与项判定，不等同完整 Buff 覆盖状态机 |
| 统一 Effect 生命周期协调实例及领域 bindings；start、participation、finish、finalize 分开，父结束同步传播 | Status 也通过领域 binding 接入；停止参与保留旧载荷，finalize 先删除 UID，再执行结束程序及清理 binding；完整覆盖与未初始化接收路径仍未实现 |
| 每个领域事件返回后清理接收者的 finished 实例，嵌套 cleanup 可以先于外层事件结束 | 若外层同容器仍活跃，cleanup 的嵌套安装仍共享旧候选；自动安装在清理连锁后读取最新分配计数器 |
| 已进入 callback 在当前 scope 内保留实例最后事实；finalize 删除 UID 前更新这些活跃 continuation 的暂存 | 程序可继续读取最后载荷，但 UID 查询已 absent；退出 callback 后清除，不进入 Unit／Resources／snapshot，不延迟 cleanup |
| Hook 只获得阶段事实及明确注入的 Effect／Damage／Healing operation；嵌套完成后才返回 report | 没有通用世界写入或完整资源入口；公式阶段只提供 Effect 操作；跨 tick Action／Projectile 不因此改成同步调用 |
| 领域取消保留已完成 transition，剩余候选仍可执行；独立 `stopDispatch` 才停止该事件后续候选 | 伤害为零、取消 HP 应用、停止派发和取消内容程序分别解释；实例消耗、嵌套回复及允许的后继不回滚 |
| Damage 先确认本次 HP 结果，再按来源、目标顺序分派 report 反应，最后按当前项目退场契约处理致死对象 | 报告只描述本次请求，不汇总嵌套净变化；这不是对原生所有零生命、死亡通知、移除与回收阶段的完整映射 |
| DamageType 与接收政策分离；Damage／Healing 均有独立 `skippedReception` 入口，Healing Core 的 skip 与 ignoreHealFree 独立 | 已核对的原生 skip 回复绕过 `OnTakeHeal`／HEAL_FREE，由数据适配显式生成 ignoreHealFree=true；Core 仍可表达 skip 而遵守禁疗；不能据此统一所有接收事件与回复类别 |

Buff 领域拥有实例有效性、生命周期传播和调用期身份范围；Damage／Healing 拥有内部结算、排序与正常领域结果。内容程序组合这些公开操作，Resources 只保存可重建程序与登记。完整攻击阶段、投射物、死亡状态机和非 Unit 来源过程继续保持各自研究边界。

## 9. 尚需区分的最小验证

1. 同一集合外层 A 安装并启用 C，再发起嵌套事件：C 不参加旧候选；UID 查询可见，嵌套按 key 查询仍用旧候选；全部退出后按 key 查询可取新候选。
2. A 结束尚未执行的 B：外层和嵌套跳过 B，但已进入 B 的动作后继按内容条件继续。
3. A 在另一单位安装 C 再结算伤害：那个容器若未枚举，应从其当前集合建立候选。
4. 分担／回复使接收者到零或满血：分别记录本次 Modifier 结果、嵌套变化、生命周期通知与后继可见性。
5. 嵌套 `_CheckFinishedBuffs` 新建 Buff 的 ON_START／ON_FINISH 连锁：确认结束通知次数与覆盖组更新，不把语义简化为一次 delete。

这些是协议的可区分例子，不要求用相同 seed 对齐原生结果，也不要求复刻对象池、枚举器布局或所有内部调用顺序。
