# 郁金香 S1 空目标分支的狂躁计数

## 结论与范围

**普通 native 分支中，无目标时成功选择 EmptyAnimatedAbility，仍是成功的技能发动并消耗 SP，但不增加狂躁周期伤害；有目标选择 MultiMeleeAttack 时增加一次。父 FirstSucceedGroup 不会补发一个合格的 SpellOn。**

本批只闭合 `char_513_apionr / skchr_apionr_1`，不修改项目 API、源码、测试或案例正文。依据静态配置与完整所选 native 体的调用链推导，没有运行客户端或验证活跃 XLua。父组能启动、触发 SkillStart，不等于父组运行自己的施放协程。

来源为 Windows 客户端 DLL `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29，与 [Case09 §3.3](../../../cases/09-skill-mechanisms-and-requirements.md#33-启动结果与失败后继实际需求核对) 的十一月证据一致。[PRTS 郁金香](https://prts.wiki/w/Tulip)交叉确认该技能及费用回复、多段斩击；页面不证明本批的狂躁过滤与组内通知结论。

## 实际绑定

[content.json](content.json)复用已解码组件，并重新核对当前技能 Bundle、角色表和技能表哈希；这是经指纹复核的原有解码投影，不冒充第二次资源解码。资料镜像固定于 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`。

| 同一 `skchr_apionr_1` Prefab 中的对象 | PathID 与作用 |
| --- | --- |
| 根 CastSkill | `7014566040663161037`；手动技能、允许无目标，关联同一根 Ability |
| 根 AbilityFirstSucceedGroup | `5117273669797411021`；依次尝试下列两个子项 |
| Skill / MultiMeleeAttack | `7343246726752041165`；不允许空目标，序列化 `_ignorePalsyInterrupt=0` |
| Empty / EmptyAnimatedAbility | `-4887580023928719155`；允许空目标；其继承字段虽然也是0，实际虚 getter 固定返回 true |

## Options 与事件参数

[native.json](native.json)的 `result.owners` 保存实际类继承、字段与虚 slot；`result.bodies` 保存完整所选方法，`result.selection.methods` 是确切复提选择器。

1. `BasicSkill.AssignData` #73860 在 `0x180992cf9` 读取虚 slot37 `get_familyGroup`，把结果放入 Options，再于 `0x180992d24` 对根调用 `Ability.SetData`。本类 getter #73824 普通分支返回 SKILL=2。
2. `AbilityFirstSucceedGroup.DoSetData` #93656 在 `0x180f87e19..e9a` 为每个子项复制完整32字节 Options，只重写 signalId，再调用其 SetData。`Options.familyGroup` 的 unboxed offset 为28；没有因 Empty 分支改为 GENERAL。
3. `_DoCast.MoveNext` #64190 在 `0x1806117f7` 经虚 slot84调用正在运行的子项 ExecuteSpell。`AbilityStandard.ExecuteSpell` #64119 在 `0x1805fd760` 将执行者 `this` 放入 RDX，随后于 `0x1805fd766` 调用 `Entity.OnAbilitySpellOn`。事件参数是实际 Empty 或 MultiMelee 对象，不是父 Group。
4. MultiMelee 的实际继承链未覆盖该通知与 ignore getter：后者由 `AbstractAnimatedAbility.get_ignorePalsyInterrupt` #93882读取自己的序列化字段（偏移 `0x1a5`），本例为 false。Empty 则由 #92227 在 `0x180f47bcc` 固定返回 true。狂躁本身的 family／ignore 消费和事件18程序复用[排除调查](../../anger-exclusions-20261117/README.md)及[原始狂躁调查](../../anger-20261116/README.md)。

因此两侧 family 都通过；Empty 被 `ignorePalsyInterrupt` 过滤，MultiMelee 不被过滤。同轮多次 SpellOn 仍由狂躁程序的 mark 去重。

## 父 Group 不会另发 SpellOn

- `AbilityFirstSucceedGroup.CastToTarget` #93657／`CastDirectly` #93658 完整成功分支为：子项 Cast 返回 true → `_OnSubAbilityCasted` → `StartCastingInternal` → `ResetCooldown` → true。它们没有调用父的 `_DoCast` 或启动父协程。
- `_OnSubAbilityCasted` #93667 只按 `_fixAffectingAbilityParam` 更新所选索引／冷却；没有转发 SpellOn。`StartCastingInternal` #64062 只设置 casting／开始帧，然后调用虚 slot54。
- 根继承 `AbilityStandard.OnCastStart` #64121；其 `0x1805ff283` 发出的是 `OnAbilityStart`（事件16），随后调用 `Ability.OnCastStart` #64045 的本地 delegate。没有 ExecuteSpell 或事件18。
- 本地 delegate 在 `BasicSkill.AssignData` 的 `0x180992d8e..db7` 注册；[metadata-usages.json](metadata-usages.json)把所加载的 MethodDef usage `0x60024111` 解码为 #73864 `BasicSkill.OnSkillStart`。该方法调用 Character 的 SkillStart 链；不是将组对象转发为 AbilitySpellOn。
- Group 继承的 `AbilityStandard.OnTick` #64130 只更新基础 Ability 与已附着 Behaviour，不从 casting 标记建立 `_DoCast` 协程。本例根没有能转发 SpellOn 的 Behaviour 组件。
- 子项完成回调 `_OnSubAbilityFinished` #93666 通过虚 slot65 `FinishIfNot` 结束父组；`OnCastEnd` #93663 负责组内结束／清理，不补做施放。

这区分了“父组继承了 ExecuteSpell 方法”和“本次实际运行过父组 ExecuteSpell”：本例只运行所选子项的施放协程。

## 空目标仍成功发动

Group 的两个 Cast 在子项返回 true 后分别于 `0x180f878ee`／`0x180f876f5` 固定成功值，最终返回 true。`CastSkill.DoCast` #74106 的成功值在 `0x1809ada14..1a` 接续；成功时于 `0x1809ada34..41` 读取配置 spCost 并调用 ReduceSp。根 OnCastStart 的 delegate 仍产生 SkillStart。故空分支不是无目标导致 activate 失败，而是**已成功发动的技能，其实际施放能力被狂躁过滤**。

### 普通发动入口不会提前拒绝空目标

本例的 CastSkill 配置 `_availableValidator=null`、`_trigger=null`、`_checkHasTargetBeforeDoCast=0`、`_allowNoTarget=1`、`_onlyAvailableWhenTokenValid=0`，没有靠特殊脚本把技能直接塞入 Group：

- `BasicSkill.IsAvailable` #73788 检查技能／SP、宿主资格及可选 Validator；本例无 Validator。`CastSkill.IsAvailable` #74093 另检查根 Ability readiness 和可选 Token 条件；根的 `Ability.get_isReady` #63989 检查可施放、附着／冷却／casting 等自身状态，不搜索敌方候选。
- 手动入口 `IsOpTriggerable` #73796 → `IsClickable` #73797 → `IsTriggerable` #73793 的所选普通分支检查受理、触发类型与宿主状态；`CastSkill.CanTriggerWithReason` #74098／其基类没有增加目标搜索门槛。
- SkillState.OnTick #77511 的启动分支读取当前技能 `CanCastCheckBeforeStart`，再调用 UseSkill。该虚方法在 `CastSkill.CanCastCheckBeforeStart` #74102 的 `0x1809ad303..309` 读取 `_checkHasTargetBeforeDoCast`；本例为0，直接落到基类 #73871，普通分支 `0x18099357f` 返回 true，不调用目标 Trigger。
- 根的 `AbilityFirstSucceedGroup.get_selectTargetSource` #93646 在 `0x180f88dac` 返回0；继承的 `AbilityStandard.get_allowNoTarget` #64085 在 `0x180601500..504` 按这个返回值等于0得到 true。不能只用 CastSkill 自己的同名允许配置，代替根 Ability 的实际资格。
- `CastSkill.UseSkill` #74108 正常进入 SkillState／Cast；`CastSkill.DoCast` 无显式输入目标且根允许无目标时，在 `0x1809ad9ca..ada0f` 读取根 allowNoTarget 并调用根 CastDirectly。于是 Group 确实能选择允许无目标的 Empty 子项，结果再进入上面的成功扣费路径。

这些证据证明本例空分支经实际普通发动入口可达，不只是对内部 CastDirectly 的理论调用。它们不保证无 SP、受控、已有 casting 或其它独立规则拒绝时仍可发动。

## 复跑

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
batch=docs/research/evidence/anger-family-20261117/empty
work=.cache/native-research/anger-family-20261117/empty-replay

uv run --offline "$batch/extract.py" --out "$work/native.json"
python3 "$batch/content.py" --out "$work/content.json"
python3 "$batch/decode_usages.py" --native "$work/native.json" --out "$work/metadata-usages.json"
```

提取器使用本次 Method 全名定位，不将历史 index 当作跨版本常量。完整体的范围到下一已知原生方法入口，包含拆分的 `.pdata` 顺序块；涉及的虚调用另按当前 owner、slot 和参数核实。`fullyDecoded` 仅描述所选字节完整解码，不等于实机执行；本例外的热更新、外部内容新增回调及其他 Group 不在结论范围内。
