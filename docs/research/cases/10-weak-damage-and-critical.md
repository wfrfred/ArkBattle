# 弱点伤害、攻击倍率与概率判定

核查日期：2026-10-16。直接读取本机官方 Windows 客户端的 IL2CPP metadata、GameAssembly.dll 与 Buff 模板；未运行游戏或验证运行中的 XLua 替换。本篇记录客户端事实，不覆盖已确定的[项目伤害规则](../../architecture/vitality.md)。

持久证据：[weak-damage-20261016.json](../evidence/weak-damage-20261016/records.json)。客户端 manifest 为 V078／`26-09-13-15-28-10-30688348`，DLL SHA256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`，metadata SHA256 为 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。证据包含当前方法表索引、地址、指令、字段及模板投影；不混用旧方法索引。

## 1. 弱点试算读取已有倍率，不重新派发事件

`WeakDamage.TryGetWeakDamage`（97081，`0x1810754b0`）读取当前 Snapshot.atkInfo，取出当前 atk 与 atkScale，分别构造 PHYSICAL、MAGICAL 的 AttackInfo，再各调用一次 `BattleFormula.CalculateDamageNoEvent`（64919，`0x180657050`）。

两次调用使用同一份 atk 与 atkScale。关键指令为：

- `0x18107560e` 取得当前倍率；`0x181075628` 用它构造物理候选。
- `0x181075686` 调用物理的 CalculateDamageNoEvent。
- `0x18107568b` 再次使用同一个倍率；`0x1810756a7` 构造法术候选。
- `0x1810756d6` 调用法术的 CalculateDamageNoEvent。

`WeakDamage.Execute`（97080，`0x181075370`）用 RELATIVE_GT 比较两个值，只修改当前 Snapshot.atkInfo.damageType；近似相等时保留类型。该动作不会应用两个候选的 HP 变化，也不创建两份战斗状态再回滚。

因此，已经体现在当前 atk／atkScale 中的概率增幅会被两个候选共同使用；试算自身不会再触发一次暴击或倍率事件。不能将“不额外派发事件”解释成“排除此前事件已产生的倍率”。

## 2. 倍率动作与弱点动作的顺序有实际意义

`AtkScaleUp.Execute`（96910，`0x18104b320`）在 `0x18104b58f` 写回 Snapshot.atkInfo.atkScale，与弱点试算读取的是同一个字段。它支持合并倍率和覆盖倍率。

这支持以下条件结论：

| 顺序 | 弱点比较是否使用该倍率 |
| --- | --- |
| 倍率动作先执行，再执行 WeakDamage | 使用修改后的倍率，两种类型试算共享该值。 |
| WeakDamage 先执行，倍率动作随后执行 | 此次类型选择不使用后来的修改；后续正式伤害仍可以受到倍率影响。 |

本机 `config/buff_template_holder.ab` 中：

- `common_weak_damage_buff` 在事件 14（ON_CALCULATE_DAMAGE）执行 WeakDamage；若目标具有固定弱点标记，则先按标记修改类型并跳过普通比较。
- 山的 `f12yin_t_atk_scale` 也在事件 14 执行 AtkScaleUp，读取 `atk_scale`。
- 两个模板的 onEventPriority 均为 0。仅靠模板不能推出所有暴击效果都先于弱点；具体实际登记、覆盖优先级和事件处理顺序仍影响先后。

山的角色 prefab 关联了该倍率模板；赤刃明霄陈的角色 prefab 通过 loadFromDB 引用 `common_weak_damage`。后者最终的 DB 描述未在本次提取中恢复，因此不依据 prefab 的空模板占位推断其最终优先级。

## 3. 正式计算中的事件与概率状态

`BattleFormula.CalculateDamage`（64918，`0x1806573c0`）的普通原生路径，在各自触发标记允许时依次调用：

```text
来源 OnCalculateDamage
→ 目标 OnBeingCalculateDamage
→ CalculateDamageNoEvent
→ 来源 OnAfterCalculateDamage
```

WeakDamage 的两个候选调用不会重新进入这些正式计算事件。由此可知，弱点试算不会因为比较两个类型而额外执行两套概率 Hook，也没有丢弃一个候选 BattleState、恢复其中 RNG 的流程。

另外核查了通用 `ProbAdditionNextAtkTalent.OnBeforeAttack`（73493，`0x180994e20`）：它在实际攻击前取得 BattleController.randomImp，执行概率门槛，成功后 Attach 相应 Ability。这证明客户端存在先按攻击判定、再让后续伤害使用结果的实现路径；不把这一个类推广为全部暴击机制，也不凭相似字段断言它就是本次山 prefab 中尚未解析外部 MonoScript 身份的组件。

## 4. 证据限度

本机普通原生 WeakDamage 使用三参数 `AttackInfo(atk, damageType, atkScale)` 构造候选；该构造器将 atkAddition 置零。而 [PRTS 伤害分类](https://prts.wiki/w/伤害分类)将附加攻击力列为理论比较项。此差异尚未核对运行中的热更新，不能把原生路径或 Wiki 单独当成已验证的完整运行行为。

本轮能够确定“当前已有倍率进入两个试算，试算不重新派发计算事件”。某个具体概率增幅与弱点动作的实际先后，仍需其内容绑定与执行顺序证据，不能笼统写成“原版所有暴击都先判定”或“弱点一律不计算暴击”。
