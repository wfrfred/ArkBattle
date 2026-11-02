# 攻击附加程序与伤害通知：妮芙一技能

研究日期：2026-11-02；项目基线 `5ffe575`。核对官方 Windows IL2CPP 客户端的普通 native 分支与真实资源，未执行完整游戏或验证活跃 XLua 覆盖。输入、工具身份与复跑入口见[证据批次](../evidence/attack-addon-order-20261102/README.md)。

## 1. 问题与结论

问题：是否可以先完成一次 HP Damage 的全部 Hook 和收尾，再统一施加攻击附带的元素损伤或 Effect？

**不能把所有附加程序固定放在完整 HP Damage 返回后。** 真实攻击包含不同的接入时点：妮芙 S1 的附加 Buff 在主伤害动作前同步运行；按法术伤害产生的凋亡损伤，则由来源的伤害后事件程序执行。前置条件采样与后置 EP 结算不能合并成统一的攻击结束步骤。

| 结论 | 证据与边界 |
| --- | --- |
| S1 额外元素 HP 段先判断目标是否已经处于 DARK 爆发 | 真实攻击引用 `nymph_s_1[ep_damage]`；其 OnStart 先检查技能生效及目标爆发，再输出额外 ELEMENT HP 伤害。 |
| 这段附加程序在主伤害前运行 | 当前 Projectile 命中先安装 activeBuffs，再执行 HIT_TARGET 动作；安装同步进入 Buff.OnStart。 |
| S1 按伤害比例产生的 EP 属于来源伤害后程序 | S1 的 ActiveEP 引用 `ep_damage_based_on_damage_value`，模板事件 21 绑定当前 Buff.OnAfterOutputDamage。 |
| HP 应用、目标通知、来源通知有先后 | 当前普通链为接收处理、HP 写回、目标 OnAppliedModifier、来源 OnAfterOutputDamage。EP 动作在后者执行过程中同步进行。 |
| 不能用此例声称同 Tick 后置 EP 必然漏掉第一天赋 | 第一天赋另建短延迟监听，稍后才检查爆发。尚未触发的监听仍可能观察到同 Tick 后续 EP 造成的爆发。 |

这些事实不要求项目照搬原生 Buff 容器、监听器结构或事件编号，也不直接决定新的 Damage API。

## 2. 社区资料与具体样例

2026-11-02 查阅 PRTS：

- [伤害分类：攻击附加效果，固定版本 442847](https://prts.wiki/index.php?title=伤害分类&oldid=442847#攻击附加效果)：区分攻击配置的前置 Buff 与后置元素损伤，并说明 Buff 程序可以安排不同的执行顺序。
- [妮芙，固定版本 446578](https://prts.wiki/index.php?title=妮芙&oldid=446578)：S1 备注描述先检查既有凋亡爆发并输出额外元素伤害，再结算法术伤害与附加凋亡损伤；第一天赋备注说明触发爆发的当次攻击也能触发天赋。

PRTS 是社区资料，不能仅由“伤害之后”推导它相对每一个伤害通知的位置，因此继续核对客户端。网页与适用章节登记在 [prts-sources.json](../evidence/attack-addon-order-20261102/prts-sources.json)。

## 3. 真实内容绑定

资源投影见 [decoded-content.json](../evidence/attack-addon-order-20261102/content/decoded-content.json)，模板动作见 [selected-templates.json](../evidence/attack-addon-order-20261102/content/selected-templates.json)。对象身份由 SerializedFile 与 PathID 共同确定，不能只比对数字或字符串。

| 对象 | 实际绑定 |
| --- | --- |
| `charpack/char_4146_nymph.ab` | SerializedFile 为 `CAB-006dc4b4a46fa89f39fb416e2c9920e8`。 |
| S1 模式 | PathID `336072622153021997`，`_attack` 指向 `16031150783937069`，`_generalAbilities` 含 ActiveEP `6576157648104864301`。 |
| S1 攻击 | `_projectileKey=projectile_chr_nymph_s1`；`_activeBuffs` 引用 `nymph_s_1[ep_damage]`，`loadFromDB=false`；`_epDamageRatio=0`。不能由这个零值推断 S1 没有 EP 输出。 |
| ActiveEP | 通过已加载的 `ep_damage_based_on_damage_value` 程序实现按伤害值附加 EP，与上述 S1 前置 Buff 是不同的程序。 |
| S1 投射物 | `battle/prefabs/[uc]projectiles.ab`，SerializedFile `CAB-34af01ecb5d2ad63aca01b6e0d71279d`，PathID `-3708200872107265271`。配置没有禁用附加 Buff 或 Attachment，也没有配置停止时额外 Buff。 |

`nymph_s_1[ep_damage]` 的事件 0 按顺序执行：

```text
CheckCharSkillAffecting(BUFF_SOURCE)
→ FilterEPBreakRecoveryType(BUFF_OWNER, DARK)
→ AdvancedApplyDamage(ELEMENT, BUFF, NONE,
                      atkScaleVar=extra_ep_damage_scale)
```

过滤器显式要求正在恢复，而非只比较历史元素类型。因此目标在这个时点尚未爆发时，额外 HP 段不执行。

`ep_damage_based_on_damage_value` 的事件 21 先判断本次 Modifier 为伤害，再执行 `ApplyElementDamageBasedOnDamageValue`，目标为本次 Modifier 的接收者，元素为 DARK。不能把这个动作与前置模板同名中的 `ep_damage` 混成同一种伤害。

## 4. 当前原生调用链

### 前置附加程序

当前 `Projectile.ActionController.OnHitTarget` 为方法 72625，`0x1809207b0`。普通命中路径先在 `0x180920882` 调用 `_AttachBuffs`，随后处理 Attachment 与特定停止命中的附加程序，最后在 `0x180920a3b` 执行 HIT_TARGET 动作。

当前资源中的 S1 没有禁用 activeBuffs。`_AttachBuffs` 调用 Entity.AddBuff；AddBuff 进入 BuffContainer.NewBuff，后者在 `0x1806b6fe5` 同步调用 Buff.OnStart。OnStart 在 `0x1806d5035` 以事件 0 进入 `_RunActions`，不把这段开始程序排到主伤害之后。

Init 为方法 72620，`0x180920430`；`0x1809204ea` 调用的 slot 47 由当前 metadata 绑定到 Ability.GetActiveBuffs。RangedAttack 沿继承链采用 AbstractAnimatedAbility.GetActiveBuffs，93886，`0x180f90790`；普通分支在 `0x180f907cf` 返回 `_activeBuffs`（`+0x198`）。Init 将该集合复制进 `m_buffsToAttach`（`+0x30`），OnHitTarget 读取同一字段后调用 `_AttachBuffs`，后者在 `0x1809218e6` 调用 Entity.AddBuff。

字段、完整区间及继承链分别见 [projectile-active-buffs.json](../evidence/attack-addon-order-20261102/content/native/projectile-active-buffs.json)、[ability-active-buffs.json](../evidence/attack-addon-order-20261102/content/native/ability-active-buffs.json)、[ability-type-chain.json](../evidence/attack-addon-order-20261102/content/native/ability-type-chain.json)。不是根据旧版方法编号或仅凭 `_AttachBuffs` 名称认定顺序。

### HP 应用与后置 EP

普通 HP 主链的完整方法区间见 [native-hp.json](../evidence/attack-addon-order-20261102/hp/native-hp.json)：

| 锚点 | 直接证实的行为 |
| --- | --- |
| `Entity.ApplyModifier`，67665，`0x1807211a0` | 先进行接收处理；`0x180721b08` 派发 slot 124，当前绑定为 DoApplyModifier。 |
| `Entity.DoApplyModifier`，67683，`0x180722fe0` | HP 分支在 `0x18072340f` 调用 set_hp，随后写入实际变化载荷；这条 HP 分支没有自动串行调用 EP 分支。 |
| `Entity.OnAppliedModifier`，67669，`0x180727cb0` | `0x180727d8b` 先通知目标 BuffContainer；`0x18072803e` 再通知仍可取得的来源 BuffContainer.OnAfterOutputDamage。 |
| `Buff.OnAfterOutputDamage`，66145，`0x1806d00b0` | `0x1806d013f` 把事件 21 交给 `_RunActions`。事件编号通过当前实参绑定，非按模板名字猜测。 |
| `ApplyElementDamageBasedOnDamageValue.Execute`，99347，`0x1810f70b0` | 读本次 Modifier.get_value，乘比例，计算并构造 EP Modifier，在 `0x1810f74e2` 同步调用接收者 ApplyModifier。 |

因此，本例顺序中 EP 发生在来源的某次伤害后程序内部，不等于所有伤害后程序已经返回。目标的普通应用后通知又位于它之前，不能反过来要求所有通知都等待 EP。

该 EP 节点读取 `value`，不是 `finalDelta` 或 `realDelta`。项目若从 DamageOutcome 派生附加量，应核对对应数值，不能直接用前后 HP 差或默认用 `application.hpLoss` 代替。此处只确认访问器与运算链，没有据此穷尽过量伤害、屏障 ES 及所有取消路径的公式。

事件绑定的完整方法与关键指令见 [event-bindings.json](../evidence/attack-addon-order-20261102/content/native/event-bindings.json) 和 [event-bodies.json](../evidence/attack-addon-order-20261102/content/native/event-bodies.json)。

### 第一天赋的延迟判断

`nymph_t_1` 在事件 61，即当前 `OnBeforeTargetApplyModifier`，给本次目标安装 `nymph_t_1[listener]`。监听配置为一次触发、间隔 0.1 秒、等待首次间隔；其事件 2，即 OnTrigger，再检查目标是否处于 DARK 爆发，按来源和现有同名产物决定是否创建周期伤害 Buff。成功或失败分支最终都结束监听。

这解释了为何“触发爆发的这一击也能触发第一天赋”并不要求第一天赋在本击主伤害前就看到爆发。若仅把 EP 改为完整 HP 调用返回后的同 Tick 操作，目标存活且监听仍有效，它仍可能看到新爆发。本例不能证明这种改动必然漏天赋；也不能把第一天赋的稍后判断与 S1 额外 HP 段的前置判断互换。

## 5. 可观察影响与项目评估

以下是依据已证实条件与顺序的推导，**不是客户端实机测量**。取便于区分的合法输入：目标本击前没有 DARK 爆发，剩余 EP 为 10；本次主法术伤害为 100，产生 15 点凋亡损伤；额外元素 HP 段若满足条件则为 50，双方接收资格允许且目标不会在这些步骤中死亡。数值仅作示意，不表示角色面板。

| 实现顺序 | 本击 S1 额外 HP 段 |
| --- | --- |
| 原顺序：前置检查无爆发 → 主法术伤害 → EP 达阈值 | 0；EP 触发本次爆发，后续天赋另按其时点判断。 |
| 统一后置：主伤害完整返回 → EP 达阈值 → 再查当前爆发并执行附加 | 50；误把本击新产生的爆发用于本应较早的条件。 |

这会直接改变本击伤害，不是一 Tick 左右的微时序差异。提前采样条件可以避免“误多一段”，但不能仅据此宣称任意 HP 输出重排都等价；发生致死、归因或其他受伤响应时还需按具体机制验证。

项目当前 `applyDamage` 返回前已执行目标／来源 hpApplied、死亡确认及离场请求、completed。返回点不能直接等同原生来源 OnAfterOutputDamage 的执行入口。当前 Attack.afterOutput 又在全部目标组、操作和 follow-up 之后执行一次，不是每一击的 HP 后接入点。

评估结论：

1. 普通 Calculate／Apply 可以提供统一调用形状；这不自动要求所有附加内容放到返回后，也不能从函数名认定已覆盖完整攻击。
2. 内容必须能按实际机制在主伤害前运行或采样，在合适的 HP 后时点结算附加量；其他观察者读取哪个阶段的事实也须明确。
3. 继续由 Content 组合 HP Damage、EP 和 Effect，不能仅因它们都是“附加”就交给一个固定顺序或让 Damage 枚举全部内容。
4. 本轮不据此新增阶段框架、临时 Hook 协议或改变 API；先以这些可区分结果审查现有接入点。

## 6. 限制

- 结论限定本批指纹对应的静态 native 与资源；未核实活跃 XLua 或全部内容特化。
- 模板事件、资源引用与方法实参均已分别核对；不是运行完整战斗后的轨迹记录。
- 仅选择妮芙 S1 作为顺序样例，不由它规定所有攻击的附加元素、Buff、死亡或投射物来源失效政策。
- HP setter 内确有归零处理，但本轮没有闭合最终物理注销相对所有后置通知的位置；不得由项目当前立即 remove 的实现反推原生。
- 不将本例的 0.1 秒监听器、事件编号或容器布局升级为项目必须照搬的抽象。
