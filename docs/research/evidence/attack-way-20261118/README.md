# 单位攻击方式与形态切换

2026-11-18 补核 [案例 36](../../cases/36-unit-classification-and-combat-tags.md#23-守林人目标的攻击方式)。普通客户端分支和实际资源用来区分目标单位的攻击方式、当前动作与本笔伤害。客户端输入指纹见 [Mode 原生正文](mode-init.json)，与原分类调查一致。实际装备等级来自固定资料快照，指纹和字段位置见 [equip-parts.json](equip-parts.json)。

| 事实 | 原件 |
| --- | --- |
| Mode 汇总方式 | [字段布局](unit-mode.json) 对应 `_combat +0x38`、`_attack +0x40`、汇总值 `+0xc0`。[OnInit 原体](mode-init.json) #79161 在 `0x180b129e9` 清零，在 `0x180b12c04..08` 和 `0x180b12d7f..83` 将两个组件的虚槽 23 返回值分别 OR 入汇总。槽身份及普通攻击／治疗返回值见[既有消费者原件](../unit-classification-20261114/inventory/README.md)。 |
| 同一实体切换 | [贝娜组件原件](../resource-mechanisms-20261114/life/content.json) 的 `/result/components/97`（本体）和 `119`（替身）只配置 `_attack`，分别引用 `89`（MeleeAttack）和 `91`（RangedAttack）。根组件 `98` 将两模式分别列为 0 和 1。替身出生组件 `106` 传入 `mode=1` 给 `bena_switchend` 的 SwitchMode 节点（见[模板原件](../resource-mechanisms-20261114/life/templates.json)），保留同一宿主。 |
| 禁止发动的对照 | 同一[组件原件](../resource-mechanisms-20261114/life/content.json) 的 `1796`（磐蟹）与 `1807`（战术点）分别引用 `1779`、`1787`，都是 MeleeAttack。战术点的 `_attackTrigger` 引用 `1767`（NeverTrigger）。[形态切换路径](../entity-category-20261118/README.md)另有实际材料。 |
| 模组选择与绑定 | [二、三级配置](equip-parts.json) 分别选择 `milu_equip_1_2_p2` 和 `milu_equip_1_3_p2`。[组件原件](prefabs.json) 的 `/result/6` 与 `/result/5` 均安装 `milu_e_t_1`。 |
| 公式判断 | [模板原件](templates.json) 的 `milu_e_t_1` 在事件 14 依次配置 NONE 的 AtkScaleUp、IfNot、RANGED 的 AtkScaleUp。#99202 在 `0x1810f920a` 检查零值，在 `0x1810f922d..35` 检查所需位全部包含。目标读取及支路见[原公式正文和分析](../unit-classification-20261114/tags/findings.md#5-守林人攻击方式标签并非本次伤害的攻击方式)。[PRTS 守林人](https://prts.wiki/w/Firewatch)记载无攻击方式的敌方角色类目标也可触发加成。 |

## 复提

从仓库根目录执行：

```sh
skill=.agents/skills/arkbattle-native-research
batch=docs/research/evidence/attack-way-20261118
work=.cache/native-research/attack-way-20261118/recheck
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline "$skill/scripts/native.py" --out "$work/unit-mode.json" type Torappu.Battle.UnitMode
uv run --locked --offline "$skill/scripts/native.py" --out "$work/mode-init.json" disasm 79161
python "$batch/extract_prefabs.py" --out "$work/prefabs.json"
python "$batch/extract_templates.py" --out "$work/templates.json"
```

模组表复查使用 `equip-parts.json` 中的固定 URL、指纹和 JSON Pointer。

当前证据闭合普通分支、模式配置及实际模组选择，未执行实机，也未核实活跃 XLua。尚无同一个 Enemy 在战中改写有效攻击方式并由实际消费者读到新值的已核例子。基础 EnemyDB 等级 0 查询及 Ability 攻击方式查询继续按各自的读取对象解释。
