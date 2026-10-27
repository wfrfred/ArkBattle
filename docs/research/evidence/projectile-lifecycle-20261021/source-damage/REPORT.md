# Projectile 来源失效：伤害数值和结算来源

2026-10-21。只读原生调查，不改项目源码。依据本机 GameAssembly.dll / global-metadata.dat；DLL SHA256 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`，metadata SHA256 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。以下为编译后默认分支，未核实实际运行中的 XLua 替换。

## 1. 关键结论

1. Projectile 保存的是带实例身份的来源 ObjectPtr，不是强制存活绑定，也不是完整属性快照。`get_source` 的身份锁定没有检查 Entity.alive、HP、是否有空间位置或是否属于当前场上 Units 集合。
2. **普通 ApplyDamage** 在命中时若还能取得有效 source，读取 source 当前 ATK，走有来源计算；死亡本身并不会自动切为缓存。来源被回收导致 ObjectPtr 身份失效后，source 为 null，走已预处理保存的 cacheAtk，并生成 `Modifier.source = null` 的伤害。
3. cacheAtk 只保存一个发射时（准确说：给该弹道准备伤害 Action 时）取得的 ATK 数值。它不是穿透、来源 Buff、来源事件或所有伤害分类的完整快照。有来源计算仍实时读取穿透及执行来源计算事件；无来源回退不执行这条来源逻辑。
4. 无来源回退也会失去普通日志路径的来源角色伤害统计：`Entity.OnAppliedModifier → BattleLogger.LogModifier` 仅从 Modifier.source 恢复 Character 并取 characterId。Projectile 的 ExtraLogIds 另用于弹道生成次数统计，不能把它当作伤害/击杀归属的保留证明。最终击杀计数、奖励政策本轮未核对，不能由 source=null 推导所有归属系统的结果。
5. 缓存 ATK 与保留来源是可独立配置的。真实维什戴尔三技能配置 `_useCachedAtkOnly=1, _transferSource=1`；此分支从缓存构造攻击信息，同时可保留当前有效 source 参与后续公式/Modifier。来源失效仍然不会凭缓存恢复其对象或穿透。

## 2. 身份链：死亡与回收是两个边界

### 来源设置和读取（直接证实）

- `Projectile.Init` [71331] `0x1808d7560`：`0x1808d76a5` 读取 Ability.owner，`0x1808d76b9` 构造带当前身份的 ObjectPtr，`0x1808d76cc` 保存到 `Projectile.m_source (+0xf8)`。
- `Projectile.get_source` [71293] `0x1808dd7b0`：非 Hotfix 分支调用 generic spec **280377 = ObjectPtr<T>.Lock [22913]**，实编译体 `0x185159d80`。
- Lock 调用 isValid；spec **280378 = ObjectPtr<T>.get_isValid [22911]**，实编译体 `0x185159fc0`。
- isValid 先排空/销毁对象，再比较保存的实例 identity 与当前实例 identity。没有 alive/HP/空间/阵营检查。
- `BObject.get_isValid` [65018] `0x180663060` 是 `identity > 0`。
- `BObject.OnRecycle` [65035] `0x1806629d0`：`0x180662a0f` UnregisterBObject，`0x180662a14` 把 identity 设为 0。旧 ObjectPtr 保存的正身份不再匹配；对象池再利用分配新身份也不重新匹配。

**与 stopWhenSourceInvalid 区分**：Projectile.OnTick 的政策使用 `BattleUtil.ValidAndAlive`（generic spec285168 / [78227]，原生体 `0x18449ab40`），这条额外检查 alive。它与 get_source 的 ObjectPtr.Lock 不是同一 predicate。因此某弹道可以因“来源不再 alive”停止，但停止回调在来源身份尚有效时依然能读到 source；反过来普通不绑定来源弹道可以在来源回收后继续使用缓存 ATK。

本报告的“死亡尚未回收”指 ObjectPtr 身份仍有效的区间；具体角色 dying、敌人死亡动画、撤退何时调用回收，由生命周期子调查确认，不以“场上移除”概念直接代替原生身份失效。

### 命中 Action 如何取得来源（直接证实）

`Projectile.ActionController._RunActions` [71449] `0x1808ca1f0`：

```text
0x1808ca2f2 Projectile.get_source()
0x1808ca302 Context.ChangeGuard.set_source(result)
...
0x1808ca3ca ActionUtil.RunActions(... SourceType.PROJECTILE ...)
```

所以普通伤害 Action 使用命中时重新 Lock 的 source，不是初始化时保存的一份 Entity 裸指针，也不会因 SourceType.PROJECTILE 而要求 source alive。

## 3. 普通伤害：当前 ATK / 缓存 ATK 分支

### 缓存时点（直接证实）

- `RangedAttack.GetProjectileActions` [90817] `0x180ec3930`：ON_HIT_OBJECT 时，调用 `Ability.PreprocessActionsForProjectile` 的虚槽66。
- `Ability.PreprocessActionsForProjectile` [63101] `0x1805d66b0`：获取 owner，遍历并准备 `IDamageOrHealSourceNode`，传 owner 给 PreprocessForProjectile。
- `ApplyDamage.PreprocessForProjectile` [96830] `0x18104aa40`：`0x18104aacb` 调 `Entity.get_atk`，`0x18104aaf8` 保存到 `m_cachedAtk (+0x28)`；没有有效 Unity 来源时保存 -1。

普通 RangedAttack 会为每个弹道准备其 Action，所以这是弹道发射准备时的 ATK 采样，而不是 Projectile 提供通用完整攻击快照。

### 命中数值分支（直接证实）

`ApplyDamage.Execute` [96823] `0x18104a780`：目标 Unity 空对象则拒绝；来源为空但缓存非负仍可继续；传 source、target 给 CreateDamageModifier。

`ApplyDamage.CreateDamageModifier` [96826] `0x18104a3d0`：

```text
0x18104a473  Unity Object.op_Inequality(source, null)
0x18104a47a  non-null -> 0x18104a545

source == null:
  cacheAtk = max(m_cachedAtk, 0)
  0x18104a53e CalculateDamageByAtkNoSource(cacheAtk, target, type, way, scale, attackType)

source != null:
  0x18104a5b8 CalculateDamageBySource(source, target, type, way, scale, attackType)
```

此处的 `0x186b63a70` 是 Unity `op_Inequality(Object,Object)`（参数是 source 与 null），**不是 Entity.alive**；证据文件早期命名 `UnityObject-opImplicit.asm` 保留但名称不准确，以实参和反编译为准。

- `CalculateDamageBySource` [78242] `0x180adf370`：`0x180adf440` 和 `0x180adf46a` 读取 `Entity.atk`；`0x180adf4e2` 调 `CalculateDamage(target, source, triggerTarget=true, triggerSource=true, atkInfo)`；`0x180adf56c` 把 source 放进 NewDamageModifierAfterCalculate 参数。
- `Entity.get_atk` [66458] `0x180701b30`：读当前 Attributes.GetValue(ATK)，无 HP/死亡资格检查。
- `CalculateDamageByAtkNoSource` [78243] `0x180aded30`：`0x180adee0a` source 参数清0；`0x180adee0f` CalculateDamage；`0x180adee6c` NewDamageModifierAfterCalculate 的 source 参数也清0。
- `Modifier.NewDamageModifierAfterCalculate` [71002]/[71003] 经 `Modifier..ctor` [71000] `0x1808b3660`，将传入 source 转 ObjectPtr 保存到 Modifier；不是仅按“无来源公式”计算完又把历史来源补回。

据此：

| 来源情况（其余弹道政策仍允许它存活/命中） | 普通 ApplyDamage 用值 | Modifier.source |
| --- | --- | --- |
| 仍存活且身份有效 | 命中时当前 ATK | 来源身份 |
| 已死亡/不可移动，但身份尚有效 | 当前 ATK；不自动改用缓存 | 来源身份 |
| 已回收/旧身份失效 | 发射准备保存的 cacheAtk | null |
| 重新部署/池复用为新实例 | 旧引用不追随新实例；缓存 | null |

“当前 ATK”具体是否已因死亡清 Buff 而改变，取决于来源当前 Attributes，不是本分支保存死亡前完整数据；因此不可承诺等于离场瞬间 ATK。

## 4. 为什么缓存 ATK 不等于完整属性快照

`BattleFormula.CalculateDamage` [64918] `0x1806573c0`：来源存在且 triggerSource 时，`0x18065748e` OnCalculateDamage；基础公式后 `0x18065757e` OnAfterCalculateDamage。target 事件独立，`0x1806574cf` OnBeingCalculateDamage。

`BattleFormula.CalculateDamageNoEvent` [64919] `0x180657050`：source 存在时，按最终伤害类型查询：

- `0x1806571d5` source.defPenetrateRatio。
- `0x1806571ef` source.magicResistPenetrate。
- `0x1806572ae` source.defPenetrateFixed。
- `0x1806572c8` source.magicResistPenetrateFixed。

source 为空则走默认值，不从 m_cachedAtk 推导穿透，不从 Projectile 恢复来源 Buff。这些字段不存在于 ApplyDamage 的缓存状态中。

因此不能说“来源撤退后按发射时所有攻击属性继续正常结算”；准确说法是“普通分支有一个 ATK 数值兜底，来源相关动态机制不由这个缓存保存”。内容自己的 AdvancedApplyDamage、固定值/Blackboard 等节点可以另行选择采样方式，未全部统一为普通分支。

## 5. 真实代表与缓存配置对照

### 普通弩手（直接配置 + 调用链）

本机 `battle/enm_pfb_base_0.ab`，SHA256 `da7e5c5fd620eac9b7020f143423285b87eea861a0b6cf6534142db7dcf06b5b`。现有完整解码：`/tmp/stronghold-target-sort-20261020/blocking/enm-base-decoded.json`。

`enemy_1003_ncbow` / `_2` 的攻击 RangedAttack：`_projectileKey=projectile_crossbow`, `_useCachedAtkOnly=0`, `_transferSource=0`。

`RangedAttack.NewDamageNode` [90824] `0x180ec3ca0`：flag `_useCachedAtkOnly (+0x242)` 为0时，`0x180ec3d10` 转 `AbstractAnimatedAbility.NewDamageNode` [91792] `0x180effe20`，构造普通 ApplyDamage；flag为1才创建 ApplyCacheAtkDamageFromProjectile。

共享 SimpleProjectile `_stopWhenSourceInvalid=0`（既有例证），所以它的 root 不因来源死亡/回收自动停止。运动/命中能继续，伤害依上节分支处理。

紧凑证据：`enm-base-decoded-cache-witness.json`；包含原始 JSON 路径及完整字段。

### 维什戴尔三技能（直接配置）

本机 `charpack/char_1035_wisdel.ab`，SHA256 `dab9e0c52a280e2f8042e78cd2b71dcdabb373d92bab2a687f9a7fd57ae03d44`，完整解码 `/tmp/stronghold-projectile-stop-20261021/delay/wisdel-character.json`。

实际字段 `_projectileKey=projectile_chr_wisdel_s3`, `_useCachedAtkOnly=1`, `_transferSource=1`；紧凑证据 `wisdel-character-cache-witness.json`。

`ApplyCacheAtkDamageFromProjectile.CreateDamageModifier` [96834] `0x181049e50` 调：

`BattleUtil.CalculateCachedAtkDamageFromProjectile` [78244] `0x180adea80`：

```text
以 cacheAtk 建立 AttackInfo
source存在时：Entity.OnCalculateCachedProjectileDamage(target, ref atkInfo)
transferSource为false：将 source 清为 null
CalculateDamage(target, source-or-null, true, triggerSource=false, atkInfo)
NewDamageModifierAfterCalculate(... source-or-null ...)
```

- `0x180adeb79` 调专用缓存弹道计算事件，仍可能更改缓存构造的 atkInfo。
- `0x180adeba5` 依 transferSource 把 source 置0。
- `0x180adebd2` CalculateDamage，其通用 triggerSource=false；不应说缓存分支仍派发普通 OnCalculateDamage。
- `0x180adec3a` Modifier来源沿用政策后的 source。

这个对照说明：ATK 采样和是否带来源参与公式/结算并不等价，也不是 Projectile 生命周期必须和 source 绑定的理由。

## 6. 归属限界 / 仍未确认

- **直接证实**：普通无来源回退生成 Modifier.source=null；有效来源则保存当前来源身份。来源身份在回收后不指向重部署实例。
- **直接证实**：Projectile另缓存 ExtraLogIds。`Projectile.Init` [71331] `0x1808d7c1b` → `ExtraBattleLogDB.FetchLoggerIds` [78479]；参数含 sourceId/sourceMode/projectileName/abilityName。
- **补查得到的实际消费者**：`Projectile.OnProjectileBorn` [71360] `0x1808d958d` 把 `m_ExtraLogIds` 作为 indexs，`logType=2`，在 `0x1808d959f` 调 `BattleLogger.LogExtraBattleInfoAddCount` [66995] `0x180710440`。后者对 extraBattleInfoSubStats[logType][id] 加1。这是弹道出生/生成次数统计，不是把 sourceId 传入 Damage 或 Modifier。
- **普通伤害日志路径直接证实**：`Entity.OnAppliedModifier` [66669] `0x1806f6e28` → `BattleLogger.LogModifier` [66981] `0x1807114b0`，唯一业务参数是 Modifier。`0x180711634–0x180711650` 两次读取 Modifier.source，再转 Character；`0x18071167c` 来源不存在时跳过角色输出统计；有效 Character 则 `get_characterId → BattleStats.TouchCharAdvancedStats`，更新 `outputDamageRange(+0x10)`、`outputDamageTotal(+0x20)` 和 `outputDamageByTypeTotal(+0x38)`。`0x1807118f0` 起另读 Modifier.target 记目标侧数据。
- 因而当前已证明：普通缓存回退的 source=null **不会借 Projectile.ExtraLogIds 补回这条来源角色伤害统计**。但不能声称全部统计消失；目标侧统计和弹道生成计数是独立路径。
- **未确认**：最终击杀计数、击杀奖励或特定任务归属是否另用其他记录。本轮没有闭合这部分，不能写成“撤退后弹道击杀必然没有击杀归属”。
- **未穷尽**：所有 AdvancedApplyDamage / 自定义节点的来源政策；特殊 source 替换/反射弹道；实际 XLua 修补。
- **不在本子任务内**：source死亡/撤退对 root 停止/持有者清理的全部调用点，target的消失/复归。

## 7. 文件与复现

本目录保存重新提取 asm、方法/参数 JSON、字段 JSON。helper：`/tmp/stronghold-navigation-native-20261018/native.py`。`extract.py`、`more.py`是本轮提取脚本。不得直接沿用早期文档方法编号；上文编号均已按当前 DLL metadata 对齐。


### 补查的范围说明

在 Projectile 根类所有已编译方法中搜索字段偏移 `+0xe8`，真正对 `m_ExtraLogIds` 的使用出现在 Init/构造与 OnProjectileBorn（另有同偏移的 static Hotfix字段假阳性），证据 `projectile-log-field-uses.json`。当前普通 ApplyDamage / Modifier 构造链没有传递此列表。这是对本次普通路径的有界核查，不是对任意 Lua/自定义内容的全局无引用证明。
