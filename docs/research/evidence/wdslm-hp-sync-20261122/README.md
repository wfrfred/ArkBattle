# 变形者集群与同构碎片的生命比例同步

2026-11-22 补核。本批记录主线 12-20 普通配置（文件 `level_main_12-18.json`）的实际首领、第一形态分身与同步程序。关卡、模板、安装包的指纹、JSON Pointer 和序列化对象见 [content.json](content.json)。

| 证据 | 已核对内容 |
| --- | --- |
| `/waves/0/fragments/0/actions/0`、`/branches/branch_2/phases/0/actions/0` | 分别为 `enemy_1542_wdslm` 与 `enemy_1542_wdslm_2`。关卡实际调用分支的配置和原生调用见 [动态召唤批次](../managed-summons-20261122/README.md)。 |
| `battle/enm_pfb_18.ab`，`CAB-0df5f4c8c8dade07e2ee475a972da576` | 首领与分身各有一个 `Talents/splitDamage` 的 `PassiveBuffAbility`，PathID 为 `-2043665165734528192`、`238617005377944023`，均引用 `enemy_wdslm[splitDamage]`。两个 `Talents/standRegisterList` 是同别名的 `WdslmsStandAbility`，PathID 为 `-3648310526488036544`、`2772085753718274519`。 |
| `enemy_wdslm[splitDamage]` | 在 `ON_APPLIED_MODIFIER` 先筛伤害，再按 `STANDS_EXCEPT_SELF` 和 `HOST` 两组分别调用 `EqualizeTargetHpRatio`。两组均选择 Buff 宿主的当前生命比例，`_skipModifierEvent=false`。 |

原生 `EqualizeTargetHpRatio.Execute`（102136）在 `0x1811fca00`、`0x1811fca16` 分别读取来源、目标的生命比例，`0x1811fca3c–57` 取比例差乘目标的最大 HP，`0x1811fca88` 以该有符号差值构造 `Modifier.NewHp`，`0x1811fcb25` 对目标调用 `Entity.ApplyModifier`。`NewHp` 按差值方向构造伤害或治疗。这里各实例先保有自己的 HP，再通过普通资源请求同步比例。 [原生指令](../resource-mechanisms-20261114/damage/flag-callers.json#L138190) · [NewHp 构造器](../resource-mechanisms-20261114/recovery-elemental/hp-synchronization.json#L278)

取证范围覆盖所列静态绑定与正常生命修改路径。分身列表枚举中的结束、无敌与命中后继还需按实际内容配对，轮转、同次打中多成员、死亡与二阶段的全部规则未从本批推导。

在仓库根目录使用所列版本的资源复提。

```sh
python3 docs/research/evidence/wdslm-hp-sync-20261122/extract.py --out /tmp/wdslm-hp-sync.json
```
