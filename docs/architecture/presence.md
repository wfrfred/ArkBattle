# 空间存在

SpatialPresence 表示身体是否参与普通空间交互。无此 Capability 的 Unit 默认具有空间存在性；有此能力时，Definition 为空，State 保存 `present`，初始化为 true。

暂时消失保留 Unit 身份、真实位置、Lifetime、部署及 Occupancy 登记。它不是离场，不触发 enter／leave，也不统一结束 Skill、Effect、Burst 或独立 Projectile。原生机制及各接收路径的差异见[案例 18](../research/cases/18-projectile-source-and-target-lifecycles.md)，技能开始通知中的同步变化见[案例 05](../research/cases/05-skill-start-and-finish.md#2026-11-06复核开始通知中的宿主消失)。

## 操作与职责

`disappear(ref): Change` 和 `appear(ref, position): Change` 绑定具有 SpatialPresence 的 Typed Ref，由 `unit.update(battle, changes)` 提交。工厂不读取 BattleState，也不自行发布。appear 同时主动覆盖位置，即使当前已 present，也要清理本次空间覆盖所涉及的旧关系和自身偏移。

```typescript
battle = update(battle, [presence.disappear(reference)]);
battle = update(battle, [presence.appear(reference, position)]);
```

Presence 根据宿主实际拥有的能力，登记或撤销自己持有的限制 Rule：

| 所属能力 | 消失期间的限制 |
| --- | --- |
| Action | 禁止新的执行；已存在的 Execution 以 SOURCE_ABSENT 取消。 |
| Skill | 禁止新的 Activation；已成立的 Activation、STOP／RETRIGGER、资源回复和持续程序仍遵守 Skill 自身的契约。 |
| Locomotion | 禁止自主移动，保留 velocity。 |
| Blocker／Blockable | 禁止取得或维持阻挡关系。 |
| Vitality／Elemental | 拒收普通 HP／EP Damage；不附带普通 Healing 或资源自然恢复限制。 |

这些限制使用所属领域已有的 Rule 类型与按 ID 登记协议，和空间事实在同一个 Change 中纯转换，不增加 Rule 种类、额外 Change 列表或并行资格系统。恢复出现只移除 Presence 自己的登记，其它 Rule 继续生效。Capability 和 Action／Skill 的业务不反向读取 Presence。

空间查询、普通 Targeting 和 Terrain 接触直接消费空间存在事实。Combat 在调用可能消费 RNG 的 select 之前排除消失来源，不靠启动 Rule 补救已经发生的选择。已经锁定的 tracking Projectile 继续读取现存目标的真实位置；身份失效后才使用记忆位置。命中、重新索敌和伤害接收分别判断。

## 发布与同步结算

Presence Change 可以与其它变更组合，遵守 `unit.update` 的统一协议：

1. Transformation 读取该项之前的暂存 Unit，更新 present／position、各能力的自有 Rule，并取消自身 Blockable 的未完成偏移。LEAVING 宿主不再接受空间变更。
2. 全部 Change 的 Transformation 完成后一次发布；之后按 Change 顺序执行 Settlement，不为 Presence 另设优先级。
3. Presence Settlement 从本项 `previous` 快照识别旧关系和旧 Execution，先解除仍成立的旧关系，再按启动顺序取消旧 Execution。

Presence 自己发出的第一次 RELEASED 回调已能读取本批最终空间事实、限制、自身偏移取消及此次整批关系解除结果。其它 Change 的先行 Settlement 仍遵守其自身契约。Blocker 使用旧 blocked Ref 批量解除，不取消其原目标的独立偏移；Blockable 仅解除仍属旧轮次的入向关系，已经换轮的关系和新计划保留。

回调允许重新出现、创建新关系或启动新 Execution。即使更早的 Settlement 已经重入，后续 Presence 结算仍只处理本项 previous 中的旧实例，不回填旧 Unit，也不重新扫描当前执行来确定取消范围。

Skill 的 activationStarted／spPaid 通知后，仍按最新宿主和本轮 Activation 的身份及生命周期决定是否执行 onStart；暂时消失本身不单独跳过开始程序。持续技能后续推进不以 Presence 作为统一门禁。Action 已经发生的输出、弹药消费和后继由具体内容决定，不从本轮取消推导统一消费政策。

## 验证边界

按[语义验收清单](verification.md)集中验证限制与批量解除的发布顺序、旧实例清理、Skill 开始与持续、伤害和恢复的区别，以及锁定弹道的真实位置。Hook、Change 和 Lifetime 的公共协议不在 Presence 消费者中重复展开。
