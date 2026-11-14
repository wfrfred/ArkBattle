# 弱点伤害、攻击倍率与概率判定

核对日期：2026-11-14。当前Windows客户端DLL `cf7956bf…cf76ff`、metadata `e58fb854…f9caa5`；原体、实际山／赤刃明霄陈组件、BuffDB定义和独立重提见[资源机制证据](../evidence/resource-mechanisms-20261114/damage/README.md)。本轮用当前匹配指纹重新核对，不沿用旧版方法索引或未解析MonoScript推断。

[weak-native.json](../evidence/resource-mechanisms-20261114/damage/weak-native.json)、[weak-attack-info.json](../evidence/resource-mechanisms-20261114/damage/weak-attack-info.json)、[weak-rng.json](../evidence/resource-mechanisms-20261114/damage/weak-rng.json)、[weak-database.json](../evidence/resource-mechanisms-20261114/damage/weak-database.json)保存代码；[weak-content.json](../evidence/resource-mechanisms-20261114/damage/weak-content.json)保存120组件、角色表和完整DB选择；[weak-templates.json](../evidence/resource-mechanisms-20261114/damage/weak-templates.json)保存当前Holder程序。镜像提交与安装资源分别标版本。静态调用链不冒充实机执行，活跃XLua未验证。

## 1. 当前弱点试算仍不重新派发公式事件

| 当前方法 | metadata索引 | 地址 |
| --- | ---: | --- |
| `WeakDamage.Execute` | 99373 | `0x181108a50` |
| `WeakDamage.TryGetWeakDamage` | 99374 | `0x181108b90` |
| `AtkScaleUp.Execute` | 99202 | `0x1810f9130` |
| `AttackInfo(atk, damageType, atkScale)` | 65917 | `0x180676f70` |
| `ProbAdditionNextAtkTalent.OnBeforeAttack` | 74728 | `0x1809c8010` |

`TryGetWeakDamage` 先读取当前 Snapshot.atkInfo，只有当前类型为 PHYSICAL／MAGICAL 才进行普通比较；然后取同一份当前 atk 和 atkScale，构造物理／法术候选，分别在 `0x181108d66`、`0x181108db6` 调 `CalculateDamageNoEvent #65899`。它没有新建Modifier，也没有对两个候选分别接收／应用。原本的 PURE／ELEMENT／HEAL 不因该普通比较自动改成物理或法术。

`Execute` 用两次 `RELATIVE_GT` 判断候选，只将较高的一方类型写回当前 AttackInfo；近似相等保留当前类型。当前已经形成的 atk／atkScale 同时进入两个候选，试算不会把之前的倍率丢弃，也不会再次派发来源／目标公式事件或重掷其中的概率逻辑。

当前 `AtkScaleUp` 仍通过 Snapshot.atkInfo.atkScale 工作，按 `_overwriteAtkScale` 选择覆盖或调用 `BattleUtil.MergeScale` 后写回。因此“先改倍率再比较”与“先比较再改倍率”仍是不同的程序顺序；不能将两个独立内容正例拼成所有暴击与弱点的统一先后规则。

## 2. 山的概率倍率已闭合实际脚本身份

山的角色表天赋1选择 `prefabKey="1"`，其普通精英2配置为 `prob=0.2`、`atk_scale=1.6`（潜能等另有候选，完整保留）。默认 Mode 的攻击为 AbilityRandomGroup `-4074554129588501326`，位于该攻击的 `Talents/1` 同一GameObject具有：

- `ProbAdditionNextAtkTalent` **818008825083708594**，已用实际 MonoScript PPtr 解码，`_probKey="prob"`；不再只是根据名字猜测匿名组件。
- `PassiveAttachmentAbility` **-4581070507872107342**，其被动Buff `f12yin_t_1[atkScale]` 选择 `f12yin_t_atk_scale`。S2／S3另有对应真实组件，数据未强行压成一种配置。

当前 `OnBeforeAttack #74728` 检查 family／概率等资格，在 `0x1809c8110` 通过 Battle RNG 判定，成功才在 `0x1809c813e` 给 owner Attach 对应 Ability。当前 Holder 的 `f12yin_t_atk_scale` 事件14只有 `AtkScaleUp(atk_scale)`。这闭合“攻击前概率选择→倍率程序参与随后公式”的实际路径；它不证明所有角色的概率增幅都使用此入口，也不把红字展示规则当作独立的通用暴击属性。

## 3. 赤刃明霄陈的loadFromDB已经展开

赤刃明霄陈的角色表天赋1确实选择 `prefabKey="1"`，实际 `Others/Direction/Talents/1` PassiveBuffAbility **3596095358020829763** 同时安装自己的属性Buff和 `buffKey="common_weak_damage", loadFromDB=1`。不能把Prefab占位的 `templateKey="empty"` 当成最终定义。

完整 BuffDB 镜像固定为 `bffe31bf66739842f99b457327066c695e2af389`，原文件 SHA256 `f9c67db93cd9e8d40a3ff76ec6375d232993f1b61f3d277cb96b05e32fe537c3`，114条记录。`/common_weak_damage` 的实际定义是 `templateKey="common_weak_damage_buff"`、INFINITY、DEFAULT覆盖与DEFAULT事件优先级。当前 `BuffDBUtil.TryGetBuffData #79645` 的key查找原体同时归档。镜像与当前安装资源分别标版本，没有宣称两者同步发布。

当前 Holder `common_weak_damage_buff` 的事件14：检查目标固定弱点标记并按其类型改伤害；未设置固定类型时，才执行 `WeakDamage(_sourceType=BUFF_OWNER)`。因此弱点计算不是空模板或仅存在的工具方法，已有实际干员选择、DB别名和当前模板的完整引用链。固定弱点标记的生产者另有范围边界：本次517资源按 `common_weak_damage_flag` 的精确搜索零命中；这不影响普通弱点路径已绑定，也不把该条件分支宣布废弃。

顺带完整扫描114条DB的 **templateKey**（不是仅查同名buffKey）：`common_weak_damage_buff` 只有上述别名；`scale_damage_on_hp_less` 零命中。flag4消费者的未绑定边界因此增加了完整固定版本BuffDB这一层，仍不推广到热更新或其他版本。

## 4. atkAddition差异仍存在，不能伪造热更新结论

当前 `AttackInfo` 是值类型，unboxed `atkAddition` 位于 `+0x20`。三参数构造器 #65917 在 `0x180676fee` 将 `FP.Zero`（静态字段偏移0x38）写入它；四参数构造器 #65918 另接受atkAddition，但 `TryGetWeakDamage` 两个分支没有调用它。**所以当前普通native弱点候选仍未带入当前atkAddition。**

[PRTS伤害分类](https://prts.wiki/index.php?title=伤害分类&oldid=450401)（自述2.7.91）将攻击力附加值列入理论比较项。该差异已从旧指纹重新核到当前指纹，仍需有效XLua或客户端运行证据才能判断线上行为；没有用Wiki覆盖原体，也没有把fallback提升为线上实测。ArkBattle已确认的完整双Calculate仍是项目选择，本次不撤销或额外简化。

## 5. 项目选择与证据边界

ArkBattle已确认两个候选从同一输入分别执行完整Calculate，选择数值及其BattleState，只Apply一次；这与原生静默试算不同，见[弱点伤害契约](../../architecture/vitality.md#2-弱点伤害的项目规则)。本调查不撤销该选择，不在Calculate中触发目标受击。

固定弱点marker的当前生产者在517资源精确搜索中无命中，普通弱点本身已有实际干员绑定；不把这一条件分支宣布废弃。atkAddition当前native与Wiki冲突按第4节保留，不能因换成当前指纹就宣称线上热更已证。

历史原件[weak-damage-20261016](../evidence/weak-damage-20261016/README.md)保留原指纹与原记录；机制结论以本页当前核对为准。全领域覆盖见[案例37](37-resource-mechanism-coverage.md)。
