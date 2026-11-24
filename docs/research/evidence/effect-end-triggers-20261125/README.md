# Effect 收尾所读取的事实

2026-11-25 核对 Buff 自己到期、所属 Ability 结束、宿主死亡及离场的实际消费者。结论见 [Case 01](../../cases/01-buff-installation-and-parent-scope.md#10-effect-结束时的玩法条件)。

- `aegis-ability-end.json`、`reed-killed.json` 和 `reed-skill-clear.json` 来自数据镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 `buff_template_data.json`。每份记录包含输入 SHA-256、JSON Pointer 和 `config.py` 原始参数。按这些参数执行即可重新提取。
- 埃癸斯 S2 在 `[uc]skills.ab` 中的 GameObject `8285174059649894946` 上装配已启用的 `BuffDuringCastingFixed` `-3561545585881019870`，SerializedFile 为 `CAB-e39773c4d1462aefe0ea30134bbccdbb`，Bundle SHA-256 为 `0d0b4c0f9252c14a69a20d4bea09527403dd3eddfc2f7bcd757c3c30cf37ffc3`。其 Buff 与模板键均为 `aigis_s2_block_walk`。本机 `config/buff_template_holder.ab` 的模板持有者 PathID 为 `6070581171229484677`，Bundle SHA-256 为 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`。
- [埃癸斯检查节点的原生指令](aegis-native.json) 带客户端指纹。用 `native.py disasm 101289` 复查 `FilterByAbilityFinishReason.Execute`。在 `0x1811ba845–0x1811ba865`，`_useBuffAbility=true` 使其从本次 Buff 取得所属 Ability。随后在 `0x1811ba892–0x1811ba8a2` 读取并比较该 Ability 的结束结果。
- [结城理实际 Prefab](../resource-mechanisms-20261114/life/content.json#L19742) 与[模板的结束节点](../resource-mechanisms-20261114/life/templates.json#L10714) 沿用有指纹的既有摘录。普通 Buff 结束调度见 [OnFinish 指令](../buff-group-expiry-20261111/expiry/native/OnFinish-66124.asm#L24)。

本批使用固定镜像、客户端配置和普通原生分支。PRTS 的[结城理天赋](https://prts.wiki/w/结城理#天赋)、[埃癸斯技能](https://prts.wiki/w/埃癸斯#技能)及[焰影苇草技能](https://prts.wiki/w/焰影苇草#技能)在当日用于互证可观察行为。未运行战斗或核实活跃 XLua。
