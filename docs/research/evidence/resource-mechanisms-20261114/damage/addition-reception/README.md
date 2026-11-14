# ADDITION 与普通接收路径

核对日期：2026-11-14。本批只回答伤害流程的事实：来源计算事件开关、攻击类型、skip、受击回复许可是否为独立维度，以及 ADDITION 是否在普通接收入口被统一排除。不新增角色调查、项目API或实现政策，不声称运行游戏观测。

## 1. 实际请求字段与构造

复用已归档的[实际仇白绑定](../operator-bindings.json)与[完整模板](../holder-scan.json)，不重新扫描内容：仇白天赋安装 `qiubai_t_1`，其后继 `qiubai_t_1[damage]` 的两个 DamageViaAttr 分支均为：

```text
damageType = MAGICAL
applyWay = NONE
attackType = ADDITION
ignoreForSp = false
skipModifierEvent = false
isUndeadable = false
targetType = TARGET
sourceType = SOURCE
```

`DamageViaAttr.Execute #99187` 在 `0x1810ff5f8` 使用 `CalculateDamageByAtkWithSourceNoOnCalDmg #79617`（来源有效的分支）；其构造把配置的 attackType 传入 `NewDamageModifierAfterCalculate #72179`，后者在 `0x18090a550` 写 attackType。

节点随后在 `0x1810ff657..65b` 把 `_ignoreForSp` 写入 Modifier 的 unboxed `+0x38`；`0x1810ff68b..6b3` 仅在 `_skipModifierEvent=true` 时设置 mask0x80，该实际配置为false。最后 `0x1810ff6cb` 执行 `ApplyModifier(force=false)`。**ADDITION 本身没有替代这两个许可字段。**

`#79617` 对 CalculateDamage 传 `triggerTargetEvent=true, triggerSourceEvent=false`（`0x180b3fc68..79`）。当前 CalculateDamage 同时用后一标记控制来源 OnCalculateDamage 与 OnAfterCalculateDamage，目标公式事件仍可执行；其完整体可复用同指纹的[HP流失原件](../../../hp-loss-settlement-20261113/native.json)。这个开关不代表跳过 Apply 的来源输出或目标接收。

## 2. Apply 到目标接收的必要门控

| 方法／地址 | 当前普通分支事实 |
| --- | --- |
| `Entity.ApplyModifier #67665` | 仍有目标有效性、请求预先取消、skip等入口分流；不能从“调用了Apply”直接推出后续全部执行。 |
| `Entity._OnApplyingModifier #67667`，`0x1807316a8` | 调用 `Modifier.get_isDamage`；成立时在 `0x1807316dd` 虚调用 slot131。 |
| `Modifier.get_isDamage #72134` | 检查 damageType 非NONE／HEAL、targetType为HP。**不读取 attackType。** |
| slot131 | metadata明确为 `Entity.OnTakeDamage #67709`／`Unit.OnTakeDamage #79019`。不是根据一个未命名虚调用猜测。 |
| `Unit.OnTakeDamage`，`0x180b1a57c` | 先调用 Entity.OnTakeDamage；返回后按取消状态决定是否继续其表现等后继，不按ADDITION统一跳过接收。 |

故在上述普通入口条件成立、没有先行改写分类／许可的情况下，这笔实际MAGICAL／ADDITION请求会进入普通目标接收链。这个结论来自门控、分类谓词和虚槽对应，不是仅凭多一次Apply推出来的。

## 3. 受击回复与目标Buff派发

`Entity.OnTakeDamage` 先处理消失、不可伤和命中失败等资格。随后内联的SP分支在 `0x18072bb10..bba8` 检查：

1. 目标 `m_spType` 包含受击回复 mask4。
2. 当时 Modifier 未取消。
3. `modifier.ignoreForSp == false`。

满足后使用 `m_increments[2]` 调用 `_RecoverMp`。`sp.json` 的当前 metadata 解码明确给出 `SpType.INCREASE_WHEN_TAKEN_DAMAGE=4`。独立 `SpController.OnTakeDamage #67748` 有相同门控（`0x18073b89b..932`）；不额外检查ADDITION，也不要求最终HP实际减少。

`_RecoverMp #67752` 还会检查 `spRecoverStopped` 等条件，随后进入SP写回。因此这里证明的是该请求具有**正常的受击回复机会**，不能写成任意目标必定实际获得固定1点SP。

之后 `Entity.OnTakeDamage` 在 `0x18072bbe1` 调用 `BuffContainer.OnTakeDamage #66383`。容器逐项转交 `Buff.OnTakeDamage #66152`；后者在 `_IsActionValid #66091` 确认事件10有动作，再进入 `_RunActions #66232 / _RunActionsCore #66233`。这一普通派发链没有针对ADDITION的统一排除。各Buff仍可以按自己配置过滤攻击类型、取消状态或来源。

## 4. 可以与不能得出的结论

- 来源公式事件许可、ADDITION分类、skip接收路径和ignoreForSp是独立事实；不能从其中一个推导其余三个。
- 当前仇白配置的附加伤害具有普通目标接收、受击回复和目标Buff事件机会；这不是新增一次攻击行为的证明。
- 不能因此推出所有“段数”“受击次数”“输出次数”计数器都增加。它们由具体观察时点与过滤条件决定，普通流程没有一个自动定义这些概念的通用计数器。
- 本批不再追具体内容计数器，也不据此提出接口改动。派生覆盖、有效XLua与运行版本仍是边界。

## 原件与复提

`native.json` 为同一当前指纹的34方法记录、16完整体和3字段owner；`sp.json` 保存SpType的6个常量与SP边界2体。原始DLL、metadata、读取器与脚本SHA256在各自provenance。只新增本子目录，没有修改此前原件、主案例或产品代码。

```sh
python docs/research/evidence/resource-mechanisms-20261114/damage/addition-reception/verify.py \
  --out .cache/native-research/resource-mechanisms-20261114/damage/addition-reception/replay
```

复提比对完整result，仅排除输出路径／game参数；结果见 `verification.json`。无产品测试或游戏运行。
