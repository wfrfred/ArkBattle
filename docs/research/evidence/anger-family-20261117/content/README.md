# Talent 与 Common Ability 的实际绑定

2026-11-17，只取当前安装客户端的玫兰莎、浊心斯卡蒂、刺玫三个代表。本文保存配置身份；`TALENT`／`GENERAL` 的最终判定必须接合同批原生初始化赋值，不从对象目录名、技能文本或“无法打断”推断。

## 配置证据

[bindings.json](bindings.json) 保存精确 SerializedFile、PathID、对象字节 SHA-256、外部 MonoScript PPtr／类身份、GameObject 组件表及完整祖先链。

| 代表 | 可直接确认的绑定 |
| --- | --- |
| 玫兰莎 `char_208_melan` | Character `-7356919617350662683` 的后代 GameObject `-6550878888601582107` 同时拥有 Talent `-1353240200450669083` 与 PassiveBuffAbility `-1757267164089940507`，均启用。能力装入 `melan_t_1`：ATK 乘算项从黑板读取。Talent 的 `_checkValidBySkillIndex` 为空，`_defaultModeIndex=-1`，没有限定某一技能。 |
| 浊心斯卡蒂 `char_1012_skadi2` | Character `-3662291628995893316` 的 `_commonAbilities.Array[0]` 直接指向本文件 PassiveBuffAbility `-3551814154833287236`，装入 `immune_to_encourage`。该 Buff 的模板为 `empty`，属性与异常数组均空；不是从其目录名判定 Common Ability。 |
| 刺玫 `char_494_vendla` | Character `-5727053032967838823` 的后代 GameObject `6136287853142336409` 同时拥有 AppearTalent `3830709308923437977` 与 GloballUniqueBuffAbility `7110607010283185049`，均启用。前者 `_castOnLocate=0`，后者 `_ignorePalsyInterrupt=0`、`_uniqueBuff.buffKey=vendla_t_1`；其具体 Cast／SpellOn 调用需接原生链。 |

角色表摘录分别确认中文名称、技能选型与 Talent 内容：玫兰莎第一天赋“攻击提升”的候选均为 `prefabKey="1"`，提供 4%／8% ATK；本包该 Talent 对象名为 `1`，并与内部能力共用同一 GameObject。浊心斯卡蒂 Common Ability 由角色根对象直接引用，不依赖当前选用 S1／S2／S3。

刺玫的第一天赋为“土壤基肥改良”：攻击范围内生命上限最高的友方角色受治疗效果提升 8%／11%／15%／18%，候选均 `prefabKey="1"`。该天赋与其 S2 反伤程序不同，不能从角色关联的另一技能借用业务说明。其 Talent 的 `_checkValidBySkillIndex` 为空、`_defaultModeIndex=-1`，没有限定某一技能。

Talent 的内部能力还需通过原生 `BasicTalent.Awake` 的组件查找及 `AssignData` 的 Options 写入，才能闭合 `TALENT` 分类；刺玫另需接 AppearTalent 的出生施放链。浊心斯卡蒂则需接 `Unit.InitCommonAbilities` 的 Options 写入以闭合 `GENERAL`。配置摘录本身不证明能力会派发释放事件，也不将这些程序等同于一次攻击／技能执行。

## 来源与复跑

```sh
python3 docs/research/evidence/anger-family-20261117/content/extract_bindings.py \
  --out .cache/native-research/anger-family-20261117/content/bindings.json
```

当前安装输入为官方 `charpack/char_208_melan.ab`、`charpack/char_1012_skadi2.ab`、`charpack/char_494_vendla.ab` 与实际外部 MonoScript 包 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`；各自大小与指纹在 JSON 中。解码复用已归档 TypeTree 读取器，并记录脚本／辅助工具指纹，不将序列化偏移当成 native 内存偏移。

角色名称与候选数据复用独立固定镜像的 [selected-data.json](../../targeting-pipeline-20261109/content/selected-data.json)及[刺玫 profiles](../../reception-stages-20261115/content/profiles.json)，完整来源声明、原表固定版本与指纹一并保留，未将镜像与当前安装资源声称为同一版本。未运行客户端或核实活跃 XLua。仅验证这些实际绑定，不以有限样本推导全部 Talent／General 的内容或调用方式。
