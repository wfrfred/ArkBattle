# 全局个体结算计数

[Statistics](../../src/core/battle/statistics.ts) 保存关卡的普通个体统计。它不决定调度等待、单位身份、关卡生命值、胜负或外部得分。

## State 与统计口径

| 字段 | 语义 |
| --- | --- |
| `total` | 关卡构造时明确提供的计划统计总数；不是已出生或仍在场的 Unit 数。 |
| `finished` | 已完成普通个体结算的数量。 |
| `killed` | 已按普通击杀口径结算的数量，不一定对应真实死亡。 |
| `pending` | 以稳定 `Ref<Unit>` 为键，记录尚未结算的个体及其 Policy。 |

`Battle.Input.statistics.total` 提供非负安全整数，总数不因运行期登记或结算自动改变。普通原生出怪的总数在 Data 预处理选定主 Wave 条目、展开出生数量后确定；不计 Branch，不由 Wait 反推。`finished` 和 `killed` 初始为零。派生的剩余数可由消费者计算 `total - finished`，不保存额外字段，也不根据计划总数拒绝或裁剪实际结算。

## 资格与登记

凡纳入普通统计的个体具有明确的 Policy：

| Policy | DEATH 离场 | 其他完整离场 |
| --- | --- | --- |
| `NORMAL` | Finished 和 Killed 各加一 | 仅 Finished 加一 |
| `ALWAYS_KILLED` | Finished 和 Killed 各加一 | Finished 和 Killed 各加一 |

不参与统计的个体不登记。计数资格是本次出生的事实，不由 Classification、Unit Definition、Schedule Wait 或是否有 Vitality 推断。初始 Unit 及 Schedule.Spawn 各自显式提供 `statistics: Policy | null`，null 不登记。其他创建者若需要计数，在 `Unit.initialize` 之后、`Unit.add` 之前调用 `statistics.register(battle, ref, policy)` 一次；不修改通用 Unit 构造或登记契约。这样 entered 中的即时结算也可读到已登记资格。

## 个体结算

Battle 初始化安装全局 `battle.unit.removed` Hook。在 Unit 完整注销后，用首次 Departure 的结束原因和稳定 Ref 读取最新 pending 登记；有登记才完成上述账务并移除登记。没有登记时不计数。Unit 自身和 Schedule 等待解除操作不持有统计状态，不读取表现 Event 更新统计。

`markKilled(battle, reference)` 允许提前完成普通击杀结算，Finished、Killed 各加一并消费同一 pending 登记；它不移除 Unit，不自动解除调度等待，也不产生死亡事实。已经结算的个体随后离场不会再次计数；提前结算与正常离场均使用同一账务处理。需要解除当前波等待等其他业务时，Content 调用相应领域操作。

## 原生依据与边界

原生的普通计划总数、完成数和击杀数是独立于等待集合的个体账务。普通 EXIT 算完成、不算击杀；特殊无害计击杀配置和提前 MarkEnemyKilled 支持上述独立资格与结算入口。[Case 30](../research/cases/30-scheduler-action-data-fields.md#5-四个争议字段与退出账务)

项目暂不支持原生 `validFinished`／`validKilled`／`validMissed` 的另一组界面及外部统计口径；不因此增加普通计数字段。关卡生命值仍有独立缺口，外部规则读取领域事实后裁决胜负。[支持边界](research-audit-20261122.md#已有项目方案与暂缓项) · [有效统计证据](../research/evidence/settlement-valid-counts-20261128/README.md)
