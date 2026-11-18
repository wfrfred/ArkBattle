# 单位攻击方式与形态切换

2026-11-18 补核 [案例 36](../../cases/36-unit-classification-and-combat-tags.md#23-守林人目标的攻击方式)。普通客户端分支和实际资源用来区分目标单位的攻击方式、当前动作与本笔伤害。客户端输入指纹见 [Mode 原生正文](mode-init.json)，与原分类调查一致。实际装备等级来自固定资料快照，指纹和字段位置见 [equip-parts.json](equip-parts.json)。

| 事实 | 原件 |
| --- | --- |
| Mode 汇总方式 | [字段布局](unit-mode.json) 对应 `_combat +0x38`、`_attack +0x40`、汇总值 `+0xc0`。[OnInit 原体](mode-init.json) #79161 在 `0x180b129e9` 清零，在 `0x180b12c04..08` 和 `0x180b12d7f..83` 将两个组件的虚槽 23 返回值分别 OR 入汇总。槽身份及普通攻击／治疗返回值见[既有消费者原件](../unit-classification-20261114/inventory/README.md)。 |
| 同一实体切换 | [贝娜组件原件](../resource-mechanisms-20261114/life/content.json) 的 `/result/components/97`（本体）和 `119`（替身）只配置 `_attack`，分别引用 `89`（MeleeAttack）和 `91`（RangedAttack）。根组件 `98` 将两模式分别列为 0 和 1。替身出生组件 `106` 传入 `mode=1` 给 `bena_switchend` 的 SwitchMode 节点（见[模板原件](../resource-mechanisms-20261114/life/templates.json)），保留同一宿主。 |
| 禁止发动的对照 | 同一[组件原件](../resource-mechanisms-20261114/life/content.json) 的 `1796`（磐蟹）与 `1807`（战术点）分别引用 `1779`、`1787`，都是 MeleeAttack。战术点的 `_attackTrigger` 引用 `1767`（NeverTrigger）。[形态切换路径](../entity-category-20261118/README.md)另有实际材料。 |
| Enemy 资料与当前攻击不同 | 无餍的[资料摘录](enemy-apply-way.json)在等级 0 定义 `ALL`，等级 1 未定义覆盖。[组件原件](../resource-mechanisms-20261114/life/content.json)的 `/result/components/1330` 是普通 Enemy，引用 Default（`1373`）和 Reborn（`1468`）。前者的普通攻击和阻挡攻击都绑定 MeleeAttack（`1481`），后者都绑定 RangedAttack（`1390`）。因此普通 Enemy 资料查询与从当前形态动作推导会给出不同结果。复活的实际绑定见[生命机制研究](../../cases/11-damage-apply-and-hp-application.md)。 |
| 模组选择与绑定 | [二、三级配置](equip-parts.json) 分别选择 `milu_equip_1_2_p2` 和 `milu_equip_1_3_p2`。[组件原件](prefabs.json) 的 `/result/6` 与 `/result/5` 均安装 `milu_e_t_1`。 |
| 公式判断 | [模板原件](templates.json) 的 `milu_e_t_1` 在事件 14 依次配置 NONE 的 AtkScaleUp、IfNot、RANGED 的 AtkScaleUp。#99202 在 `0x1810f920a` 检查零值，在 `0x1810f922d..35` 检查所需位全部包含。目标读取及支路见[原公式正文和分析](../unit-classification-20261114/tags/findings.md#5-守林人攻击方式标签并非本次伤害的攻击方式)。[PRTS 守林人](https://prts.wiki/w/Firewatch)记载无攻击方式的敌方角色类目标也可触发加成。 |
| 棘刺读取中毒者 | [中毒模板](../skill-activation-variation-20261117/budget/content.json)的 `thorns_t_1` 在事件 2 用 IfTarget 检查 BUFF_OWNER 是否包含 RANGED，Enemy 类型检查关闭。命中走 `damage[ranged]`。 |
| 导火索读取伤害来源 | [实际绑定](../reception-stages-20261115/content/resource-search.json)的 `/result/hits/1329` 安装 `fuze_t_1`。[受击模板](../reception-stages-20261115/content/programs.json)事件 10 的 IfTarget 检查 MODIFIER_SOURCE 是否包含 RANGED，再进行概率和物理抵挡判断。Enemy 类型检查关闭。 |
| IfTarget 原生取值 | [字段布局](if-target-type.json)的 `_checkApplyWay` 位于 `+0x19`。[原体](if-target.json) #101657 在 `0x1811d9969..71` 调 Entity 虚槽 51，`0x1811d9976..7e` 检查是否包含要求的位。后续类型检查由独立的 `+0x1a` 开关控制。 |
| 非 Enemy 的伤害来源 | [阿的组件原件](aak-fuze-prefabs.json)中，`/result/30` 的 Character 只有 Default Mode（`37`），其普通攻击为 RangedAttack（`33`）。S2／S3 的实际伤害选择器为 `13`／`10`，接受默认类友方且排除自身；对应能力 `3`／`17` 安装 [instant_damage_physical[add_sp]](aak-damage-template.json)，以 SOURCE 向目标发出物理伤害，伤害事件未跳过。普通 Character 经 Entity 的[受击事件 10](../reception-stages-20261115/pipeline/findings.md)进入导火索天赋。因此在阿 S2／S3 命中友方导火索的原生普通链上，检查来源的 RANGED。此结论来自配置与原生分支交叉，未作实机测量。 |

## 复提

从仓库根目录执行：

```sh
skill=.agents/skills/arkbattle-native-research
batch=docs/research/evidence/attack-way-20261118
work=.cache/native-research/attack-way-20261118/recheck
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline "$skill/scripts/native.py" --out "$work/unit-mode.json" type Torappu.Battle.UnitMode
uv run --locked --offline "$skill/scripts/native.py" --out "$work/mode-init.json" disasm 79161
uv run --locked --offline "$skill/scripts/native.py" --out "$work/if-target.json" disasm 101657
uv run --locked --offline "$skill/scripts/native.py" --out "$work/if-target-type.json" type Torappu.Battle.Action.Nodes/IfTarget
python "$batch/extract_prefabs.py" --out "$work/prefabs.json"
python "$batch/extract_templates.py" --out "$work/templates.json"
python "$batch/extract_aak_fuze_prefabs.py" --out "$work/aak-fuze-prefabs.json"
```

模组表和敌人资料复查使用 `equip-parts.json`、`enemy-apply-way.json` 中的固定 URL、指纹和 JSON Pointer。

阿的定值伤害模板使用 `extract_templates.py` 的同一 Holder 解码器，选择集合 `KEYS={"instant_damage_physical[add_sp]"}`。

当前证据闭合普通分支、模式配置及实际模组选择，未执行实机，也未核实活跃 XLua。尚无同一个 Enemy 在战中改写有效攻击方式并由实际消费者读到新值的已核例子。基础 EnemyDB 等级 0 查询及 Ability 攻击方式查询继续按各自的读取对象解释。
