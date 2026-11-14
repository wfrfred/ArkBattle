# 取消原因的实际 Content 消费

2026-11-14。只调查内容配置及实际绑定，不修改 Core，不由原生枚举直接决定项目类型。

## 来源与复跑

- `holder.json`：当前安装资源的完整 9,054 个 Buff 模板；源 Bundle、对象及解码脚本 SHA256 在 provenance。命中 8 个 `FilterModifierCancelReason`、1 个 `FilterDamageCancellation`、10 处非默认 ignoreCancelReasonMask、131 个 BlockDamage（17 个显示伤害数字）。所选程序保留完整事件与嵌套条件。
- `bindings.json`：阿斯卡纶、逻各斯、塔露拉的 Character／Skill 实际组件，以及普通／精英小号手。216 个组件保留 SerializedFile、PathID、PPtr、层级及完整值。原表固定修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`；原表与安装资源独立标版本。
- `content-summary.json`：实际 Buff 引用、Character／Mode／Skill 组装字段及普通活动关卡 `act29side_04` 的 7 条正数 SPAWN。使用同一固定修订的 enemy_database 和关卡源文件，保留指纹与 JSON Pointer。
- `prts.json`：社区资料的定向交叉核对；不替代配置绑定、原生方法或游戏观测。

```sh
python docs/research/evidence/resource-mechanisms-20261114/damage/cancel-content/scan.py \
  --out docs/research/evidence/resource-mechanisms-20261114/damage/cancel-content/holder.json
python docs/research/evidence/resource-mechanisms-20261114/damage/cancel-content/bindings.py \
  --out docs/research/evidence/resource-mechanisms-20261114/damage/cancel-content/bindings.json
python docs/research/evidence/resource-mechanisms-20261114/damage/cancel-content/summarize.py \
  --out docs/research/evidence/resource-mechanisms-20261114/damage/cancel-content/content-summary.json
```

输出目录可换成独立复提目录；summarize 默认读取本目录归档输入。共享资源读取器和镜像源文件须存在于 provenance 记录的位置。安装资源取默认 Windows 客户端路径，前两个脚本可以使用 `--game` 覆盖。

## 已闭合的正例

| 实际内容 | 配置与绑定 | 直接证实的用途 |
| --- | --- | --- |
| 阿斯卡纶 S3 | 原表 `char_4132_ascln` 选择 `skchr_ascln_3`；技能 ActiveBuffAbility `5080775233322646902` 安装切换到 mode 2 的程序；Character 的 mode 2 为 UnitMode `3215301118787941140`，其 GeneralAbilities 引用 Aura `-364337856466685164`，后者安装 `ascln_s_3[self]`。 | self 模板事件10先精确筛选 `HIT_FAILED`，然后自疗；事件15另行自疗。它需要区分未命中、成功闪避和抵挡等其他取消，不能仅以“已经取消”决定全部后继。 |
| 塔露拉 S2 | 原表 `char_4247_oxi` 选择 `skchr_oxi_2`；CastSkill `3798141973149230893` 的 extraAbilities 指向 PassiveBuffAbility `4428682119480125229`，安装 `oxi_s_2_guard_manager`。 | 唯一 `FilterDamageCancellation` 的 `_acceptUncancelled=true`、`_allowedCancelReasons=[MISS,HIT_FAILED]`。两种取消仍被视为本机制的受击，而一般抵挡／不可伤取消不通过；后继是真实技能触发及反制，不只显示数字。 |
| 逻各斯 S1 | 原表及技能选择闭合；S1 mode 的 Aura `8645181548324165067` 安装 `logos_s_1[kill]`、template `logos_s_1`。 | 处决程序的 NoSourceDamage 显式忽略 `MISS,BLOCKED,BLOCKED_WITH_DAMAGE_NUMBER,HIT_FAILED`；不包含 `UNHURTABLE,INTERRUPT,MINUS_HEALTH`。这是真实内容的取消许可差异，不是空闲模板的字段默认值。 |
| 狼群监听 | `vigil_wolf_t_1[listener]` 的实际狼群组件绑定已在同批 `life/content.json` 归档；本批重提当前完整模板。 | 事件10嵌套 IfElse 排除 `UNHURTABLE,MISS,BLOCKED,BLOCKED_WITH_DAMAGE_NUMBER,INTERRUPT,HIT_FAILED`，每个成功分支为空；未命中这些原因才进入狼影层数／生命处理及模组后继。它将这六种原因归为同一排除集合，本身不证明必须分别建六种项目语义。 |
| 小号手十字溅射 | `enemy_1372_ltntpt`／`_2` 的 BuffToOwner 实际安装 `enemy_ltntpt[aoe_attack]` 和 `[aoe_attack_magic]`；普通活动关卡 `act29side_04` 有正数 SPAWN。 | 闭合另一个调查分支的 `INTERRUPT` 程序实际使用。普通小号手默认模式的 BuffToOwner 为 `-390230150962157024`，激昂模式为 `-227621871469598176`。完整程序与 early-return 消费由同批 `cancel-specials`／调用链材料负责，不能只凭 Cancel 字段推断效果。 |

## BLOCKED 与 BLOCKED_WITH_DAMAGE_NUMBER

完整 Holder 中，两种原因仅在狼群的精确原因排除链同时出现；所有包含 BLOCKED 的非默认 ignoreCancelReasonMask 也同时包含 BLOCKED_WITH_DAMAGE_NUMBER。此次配置调查没有找到“仅因这两种原因不同就执行不同玩法后继／取消许可”的实例。

BlockDamage 的 `_showDamageNumber` 确实有 17 个 true 节点，例如 `enemy_xi_s2[shield_last]`、`enemy_mdhmmr_shield`，另有 114 个 false。它证明表现配置实际非默认，不能单独证明这两种情况必须成为不同的业务取消原因。原生 UI 消费和全 C# 调用链由并行材料核对；本批不据此宣布二者全局等价。

## 边界

本批确认静态程序与实际组件／原表／普通关卡引用，没有运行客户端，也没有解析有效 XLua。完整 Holder 的负结果不涵盖全部 C# 专用逻辑、资源外程序或未来内容。重复列出原生枚举不能替代用途分析；如何表达闪避、未命中、抵挡、生命接管和表现差异仍由架构审查决定。
