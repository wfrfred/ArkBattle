# Ability Family 装配与施放对象

本批只核对已选内容的 TALENT／GENERAL 分类来源及传播，不新增玩法或 Core 类型。实际资源绑定见[同批配置](../content/bindings.json)；结论由 [Case 25](../../../cases/25-elemental-burst-recovery-timing.md) 汇总。

## 来源与范围

- 2026-11-17 当前 Windows 客户端，metadata v29。
- `GameAssembly.dll` SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat` SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 每份原件保留具体输入位置、指纹、method index／VA、字段布局与完整方法区间。静态 fallback，不验证运行时 XLua，也不作为游戏内实测。

| 原件 | 选择范围 |
| --- | --- |
| [discovery.json](discovery.json) | BasicTalent.AssignData 完整体；Ability、Unit、UnitMode、BasicTalent 的方法定位与 Options 布局 |
| [assignment.json](assignment.json) | Options 写入／复制、common 与 general Ability 装配、Talent Awake／Attach |
| [attachment.json](attachment.json) | Ability.Attach／DoAttach、AddPassiveBuffs、PassiveBuffAbility.GetPassiveBuffs、family getter |
| [metadata.json](metadata.json) | 六个相关类型的父类、完整声明方法与字段 |
| [appear.json](appear.json) | AppearTalent 与 GloballUniqueBuffAbility 定位；`_OnBorn` 完整体 |
| [dispatch.json](dispatch.json) | AbilityStandard.DoSetData／CastDirectly／OnAttached、AppearTalent.DoAttach；四类父类与方法表 |
| [spell.json](spell.json) | GloballUniqueBuffAbility.OnSpellStart／_DoUpdateTarget、标准 OnSpellStart |

## 已闭合的调用点与边界

- `BasicTalent.AssignData#74536`：Options 本地起点 `rbp-0x20`，`familyGroup` 位于 `+0x1c`；`0x1809beee0` 写入 `3`，`0x1809bef09` 将整份 Options 传给 `m_ability(+0x38).SetData`。玫兰莎 `melan_t_1` 的 PassiveBuffAbility 与 Talent 在同一 GameObject；刺玫『土壤基肥改良』同理关联 GloballUniqueBuffAbility。
- `Unit.InitCommonAbilities#78996`：遍历 `_commonAbilities(+0x1a8)`，`0x180b18013` 写入 `4`，`0x180b18046` 以当前 Unit 为 owner 调用各项 SetData。浊心斯卡蒂的 `immune_to_encourage` PassiveBuffAbility 是该数组的实际条目。`UnitMode.OnInit#79161` 也为 `_generalAbilities` 写入 `4`；动态登记辅助入口 `#79163` 在 `0x180b138bc` 写入同值。
- `AbilityStandard.DoSetData#64096` 调用基类 `Ability.DoSetData#64011`；后者在 `0x180602d26/36` 将 32 字节 Options 存入 `Ability+0x98`。`Ability.get_familyGroup#63972` 直接读取该 Options 的末四字节；没有向天赋来源／父 caster 追溯，也没有读取 `_forceAsDmgOrHealAbility`。因此不能把“由天赋触发”一概当作 TALENT；应看本次执行对象收到的 Options。
- 两个 PassiveBuffAbility 代表的普通挂载路径是 `BasicTalent.DoAttach#74552` 或公共 Ability 装配，随后 `Ability.DoAttach#64019 → AddPassiveBuffs#64057 → Entity.AddBuff`。它们证明实际程序的归属与挂载，不是一次 SPELL_ON 被过滤的运行时观测。
- 刺玫 `AppearTalent._OnBorn#74504`：`_castOnLocate=false` 时取得 `m_ability`，在 `0x1809be905` 经 slot 36 调用 `CastDirectly(finishCb=null, firstAttack=true)`；实际对象继承标准 `CastDirectly#64099`。这闭合了登场施放入口。`GloballUniqueBuffAbility.OnSpellStart#94505` 成功后只把 `m_startCheck(+0x200)` 置 true，`_DoUpdateTarget#94510` 自行选取对象并安装 Buff；当前选择**没有闭合它是否另外产生 SPELL_ON**，不能把 CastDirectly 等同于已发生该通知。

通用通知消费复用既有原件：[狂躁事件链](../../anger-20261116/native.json)、[分类 mask／getter](../../anger-exclusions-20261117/policy-native.json)。`AbilityStandard.ExecuteSpell#64119` 在 `0x1805fd766` 把 **this Ability** 交给 `Entity.OnAbilitySpellOn`；`FilterAbilityFamily#101280` 读取本次事件快照的 Ability，调用其 family getter，再做 mask 位测试。`ATTACK_OR_SKILL=7` 接受 0／1／2，不接受 3／4。没有把“被某个天赋持有”的其它攻击对象一并排除。

项目将上述纯挂载／登场 Buff 程序表达为 Enter／Effect，并不触发 Action.released 或 Skill.activationStarted；这能自然避开已确认的两类程序。该比较不证明所有原生 Talent／General 都只安装 Buff，也不要求项目公开原生枚举。

## 复跑与核对

从仓库根目录运行，`UV_CACHE_DIR="$PWD/.cache/uv"`。三个新脚本／专用选择器：

```sh
uv run --offline --no-project python docs/research/evidence/anger-family-20261117/native/inspect_metadata.py --out /tmp/anger-family-native/metadata.json
uv run --offline docs/research/evidence/anger-family-20261117/native/extract_dispatch.py --out /tmp/anger-family-native/dispatch.json
uv run --offline --no-project python docs/research/evidence/anger-family-20261117/native/verify.py --out /tmp/anger-family-native/verification.json
```

其余五份由共享 [extract.py](../../facing-semantics-20261113/extract.py) 提取，各自 `result.selection` 完整保存 `--search`、`--body`、`--body-index`、`--owner` 和输入路径；更换 `--out` 后可按原选择器复提。统一归档后也可使用 skill `replay.py` 对本批原生方法重提。

[verification.json](verification.json) 从当前文件独立重读方法身份、字段／继承布局、所有已存指令字节及完整区间连续性；不重复证明运行时热更新或实际 SPELL_ON 观测。
