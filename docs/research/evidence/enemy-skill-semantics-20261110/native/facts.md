# EnemySkill 原生职责补核

来源：本机 Windows x64 客户端，metadata v29。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。本批重新 probe 和定位，不套用 2026-10-14 的旧索引。

## 直接证实

### 1. 技能门控与执行是两层

EnemySkill 保存 `m_cooldownTimer`（0x48）、`m_triggerCnt`（0x40）、`m_spCost`（0x3c）、`ability`（0x70）、`owner: Enemy`（0x88）、`parentMode`（0x78）等事实。自身没有独立 SP 余额。Ability 则保存 `m_isCasting`、开始帧、执行结束回调和自己的 Ability timer。

`EnemySkill.CheckAvailable`（67309，0x18070e7d0）依次检查：

- 0x18070e829：本技能 isEnabled。
- 0x18070e836–0x18070e86c：自己的 PeriodicTimer.isReady（虚表 slot 4）。
- 0x18070e877–0x18070e8b2：自己的 Ability.isReady（slot 19）。
- 0x18070e8eb–0x18070e908：非负 maxTriggerTime 与已触发次数。
- 0x18070e90e–0x18070e9d7：沉默／晕眩与宿主 isSkillActivatable 资格；ignoreSilence 有自己的分支。
- 0x18070e9de–0x18070ea29：读取 owner.sp，比较本技能 m_spCost。

`CastToTarget`（67304，0x18070e540）先确认底层 Ability 所在对象 activeInHierarchy，再 TryReduceSp，成功后调用 Ability.CastToTarget（slot 35）。只有底层施放返回成功才在 0x18070e704 增加 triggerCnt，并登记本技能的活动 modifier。

### 2. SP 是宿主共享的

- `Entity` 只有 `m_sp`（0x50）、`m_spController`（0xf8）与 maxSp（0x178）等宿主资源字段。
- `EnemySkill.CheckAvailable` 在 0x18070e9de 取 owner，0x18070e9ed 调 `Entity.get_sp`；比较的是该宿主余额与自己的费用。
- `EnemySkill.TryReduceSp`（67315，0x18070fab0）对正费用取负，0x18070fbcb、0x18070fc17 都取同一个 owner；0x18070fc5d 用 owner 同时作为 source/target 构造 `Modifier.NewSp`，0x18070fd3c 向 owner 调 `Entity.ApplyModifier`。非正费用直接成功。
- `Enemy._GenerateSpData`（77855，0x180ac70c0）从 EnemyData.spData 创建宿主 SP 配置，缺省走 SpData.GetDefault。

因此同一敌人上多个 EnemySkill 的费用竞争同一份 Entity SP，不是每个技能分别保有一个 SP 槽。此结论是本机普通实现的资源归属；不替所有内容承诺相同回复配置。

### 3. 技能冷却不是普通攻击周期

`EnemySkill.Tick`（67311，0x18070f790）：

- 0x18070f8f4 读取自己的 ability，0x18070f913 调自己的 Ability.isCasting。
- 正在 casting 时跳过自己的 timer.Update；不是查询宿主是否有任意其它技能正在执行。
- 未 casting 时，0x18070f978 读 owner.slowDown，与传入 delta 相乘后，在 0x18070f9d7 调自己 timer.Update（slot 5）。
- 无论是否跳过 timer，其后仍逐项调用本技能 behaviours 的 OnTick。

`EnemySkill.Init`（67301，0x18070f010）清 triggerCnt；0x18070f1fe 后按非负 overwriteInitCooldown 或 data.initCooldown 选择首次等待，再调用 PeriodicTimer.Reset。

`_OnCastFinish`（67318，0x18070fe70）在 0x18070fefe 对本技能 timer.Reset(true)；此处不因传入 FinishReason 改变自身重置动作。之后可以按 `_resetMainAbilityCdWhenCastEnd`／`_resetCdWaitFirstPeriod` 重置传入的 mainAbility 冷却，清理本次回调并通知 behaviours。这是另外一项配置，并不把两份 timer 合并。

### 4. 模式、启用和推进

`get_isEnabled`（67269，0x1807108a0）按 `_checkParentActive` 决定读取该技能对象的 activeInHierarchy 或 activeSelf；并非无条件把所有 data.skills 项都视为当前模式可用。

`Enemy.OnTick`（77845）在 0x180ac117f 查询每项 EnemySkill.isEnabled，只有通过才在 0x180ac1191 调该项 Tick。禁用项不会由这个常规入口推进自己的技能冷却；具体模式下哪些对象启用，需结合配置绑定判断。

### 5. 与干员 Skill 开始／结束的区别

EnemySkill 的 `_OnCastStart`（67317，0x1807100a0）普通路径只枚举自身 behaviours，调用其 OnCastStart；`_OnCastFinish` 处理自身 timer、本次回调、modifier 及 behaviours。该包装的普通路径没有调用 Character.OnSkillStart／OnSkillFinish。

相对地，`BasicSkill.OnSkillStart`（73864）在 0x180996e33 明确调用 Character.OnSkillStart；`BasicSkill.OnSkillEnd`（73865）在 0x18099697d 明确调用 Character.OnSkillFinish，并处理自身开始／持续／结束相关状态和 behaviours。

这证明两条原生包装的业务协议有区别，不证明其所有 Behaviour 都永远不能间接产生同一种全局事件。Behaviour 虚分派、XLua 与全部具体内容未穷举。

### 6. 施放成功还登记宿主属性 modifier

`get_recoverSpWhenAffecting`（67286，0x180710cf0）的普通分支在 0x180710d2f 返回 false。`CastToTarget` 成功分支在 0x18070e745 将 registeredAsModifier 设为 true；`_UpdateRegisterAsModifier`（67319）保存该标志，true 时在 0x180710282 将自身加到 owner.attributes，false 时在 0x180710256 移除。`_OnCastFinish` 在 0x18070ffbf 将标志设为 false，因而执行相应清理。

这直接证明 EnemySkill 除了门控／计时／费用，还承担施放相关的宿主属性登记与清理。当前提取的 body 没有包括 Attributes 对 recoverSpWhenAffecting 的消费，不能仅凭 getter 名称和 false 值，将“施放期间必定抑制共享 SP 回复”当成本批已闭合结论，也不能把该登记的完整有效区间等同任意 Ability.affecting。公共执行对象可以调用登记／撤销程序；这些事实本身仍不决定 ArkBattle 应新增哪一种实例模型。

## 对本轮问题的限制

- 执行程序、技能触发门控、共享 SP、每项冷却是不同事实；原生把它们放在何种类中，不直接决定 ArkBattle 应称 Action 还是 Skill。
- 多个 EnemySkill 不推出多个独立 SP；多个配置也不推出同一模式同时启用。
- 已证实的自身 timer 暂停／结束重置政策不能由“Action 目前已有 cooldown”自动视为已实现。
- 本批不修改 ArkBattle API、不决定单槽 Skill 是否扩展，也不改变任何既定模拟时序。

## 文件与复跑

- `probe.json`：当前输入指纹和重新定位的注册表。
- `contracts.json`：按显式条件筛选的相关字段、方法与虚表 slot；不是完整原生类型导出。
- `selected-bodies.json`：必要方法的原生代码片段，普通分支的 .pdata continuation 已展开；Enemy.OnTick 仅保留相关调用窗口并注明 selector。
- `extract_native.py`：从本机当前 metadata 按完整方法名重新定位和提取。运行 `UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/enemy-skill-semantics-20261110/native/extract_native.py --out .cache/native-research/enemy-skill-semantics-20261110/recheck`。

完整广搜与重复导出仅留 `.cache/native-research/enemy-skill-semantics-20261110/`，不作为本批归档文件。没有执行官方战斗或运行时热更新；元数据后继地址只是保守提取边界，不证明所有非连续异常 funclet 和间接调用均已覆盖。
