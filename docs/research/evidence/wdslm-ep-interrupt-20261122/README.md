# 解构畸变体的实际召唤入口

补核日期 2026-11-22。固定资料修订 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 [12-18 关卡](../../../../assets/arknights-game-data/zh_CN/gamedata/levels/obt/main/level_main_12-18.json#L2555)在 `/waves/0/fragments/0/actions/0` 出生变形者集群 `enemy_1542_wdslm`。同一修订的[敌人详情](../../../../assets/arknights-game-data/zh_CN/gamedata/excel/enemy_handbook_table.json#L43265)明确记录其第二形态的「命脉勃发」召唤解构畸变体 `enemy_1323_wdbshd`。

[组件原件](content.json)保存三个客户端 Bundle 及 MonoScript 指纹、实际 SerializedFile／PathID、组件层级、所选序列化字段和完整召唤节点。P2 的 `syncAttackWithSummon` 发射 `projectile_enemy_wdslm_p2s2`，弹道 ActionController 的 `SummonEnemiesOnTargetTile` 指定一次召唤 `enemy_1323_wdbshd`，读取追踪目标所在格，并将 `_managedByScheduler` 设为 false。子对象 `Talents/lossHP` 的 PassiveBuffAbility 关联 `enemy_wdsdw[loss_hp]`。该模板的 EP 前置中断复用[接收阶段补核](../reception-stages-20261115/content/findings.md#身份版本与未闭合边界)的普通原生路径。

此处核对关卡、Prefab 和实际绑定。活动热更、实机执行、被阻断的来源后继及精确取消原因是否存在独立消费者，未由本批验证。

从仓库根目录复查。

```sh
python3 docs/research/evidence/wdslm-ep-interrupt-20261122/extract.py --out /tmp/wdslm-ep-interrupt.json
```
