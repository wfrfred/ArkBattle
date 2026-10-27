# Skill 开始、同步结束与内容后继

核查日期：2026-10-13。当前已安装官方客户端普通原生路径；未核对运行中的 XLua 替换和全部内容派生类。结论依据 DLL／metadata，不依据项目测试。

## 来源

GameAssembly.dll SHA256：`583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`。metadata SHA256：`d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。IL2CPP v29；Assembly-CSharp CodeGenModule `0x1872593c0`，methodPointers `0x1885d6f80`，数量 219703，按当前 metadata token RID−1 定位。不可混用旧客户端方法索引。

关键指令持久摘录见 [skill-lifecycle.json](../evidence/skill-lifecycle.json)。临时完整转储：`/tmp/stronghold-skill-native-disassembly.txt`；提取脚本：`/tmp/stronghold-skill-native-inspect.py`；完整有界报告：`/tmp/stronghold-skill-native-findings.md`。

## 已核对的业务顺序

- `Ability.StartCastingInternal`（63104，`0x1805d6d20`）先设置 casting、保存帧号，再调用 OnCastStart。
- `Ability.FinishIfNot`（63098，`0x1805d5910`）仅在 casting 时执行：保存一次结束回调 → CleanupForNextCast → OnCastEnd → 冷却更新 → 常驻结束回调 → 已保存的一次回调。清理与回调同步发生。
- `Ability.CleanupForNextCast`（63078，`0x1805d4bd0`）停止该 Ability 的 coroutine，清一次回调、casting 与帧号，然后才进入结束业务。
- `BasicSkill.OnOwnerFinish`（72679，`0x18095c0f0`）先中断 Ability，再 detach，随后通知行为并清 owner。`OnCastFinish`（72704，`0x18095b990`）依 affecting 状态立即 OnSkillEnd 或保留 pending 标记；不能把每一种 Ability 结束都直接等同 Skill 持续期结束。
- `BasicSkill.DoStartSkill`（72688，`0x180959790`）同步调用开始 delegate。`OnSkillStart`（72666，`0x18095ca00`）按顺序通知 behaviors，循环边界没有重新检查 alive／casting／affecting。
- `ActionUtil.RunActions`（100608，`0x181190690`）按动作类型和 CheckExecute／前一节点结果逐项执行；执行返回后进入下一项。共享循环没有通用的来源存活或 casting 检查。具体节点仍可自行拒绝或跳过。
- `AbilityStandard.CastDirectly`（63141，`0x1805ce650`）在 StartCastingInternal 返回后继续启动施法 coroutine，没有在这一调用边界重新检查 casting。主施法 coroutine MoveNext（63231，`0x1805e3dd0`）则在 OnSpellStart 返回后显式检查 casting，失效时退出。

结束或宿主退场没有一个通用机制来撤销已经进入的同步内容栈。同步结束完成后，控制流可以返回外层内容并继续；未来过程的取消、后继节点自身的执行资格与当前同步调用是不同的边界。以上不证明所有内容节点在来源失效后都能执行，也未核对弹药耗尽的全部派生路径与本季具体可达链。

## 项目事件协议

领域事件是结算输出，当前不驱动战斗业务。完整结算登记自身事件，额外报告只保留业务结果；Tick 收尾可投影 Removal Facts。

普通激活：内容成功且本次 activation 仍成立之后登记 SKILL_ACTIVATED；结束：关闭生命周期并完成结束回调之后登记 SKILL_FINISHED。普通零持续期采用“激活内容事件 → ACTIVATED → 清理／结束内容事件 → FINISHED”。

激活内容中已经结束本次 activation 时，继续接续已完成的状态和事件，返回 FINISHED；不在返回时补一个描述当前已不存在激活的 ACTIVATED。内容拒绝保留已完成前缀并返回拒绝原因。这是项目报告约定，不宣称官方具有同名事件流。

## 审查问题的应对

重要业务时序查官方；条件性差异先确认中间业务与影响；约一个 Tick 的小差异采用简单约定；仅报告排序或工程中间过程不阻塞设计。研究业务是否执行与生命周期何时关闭，不为了复制客户端内部结构增加通用调度层。
