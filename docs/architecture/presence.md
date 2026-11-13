# 空间存在

Presence 表示身体是否参与普通空间交互。Definition 为空，对应 `definition.presence`；State 位于 `unit.presence`，保存 `present`，初始化为 true。`hasPresence` 判断能力组成，`presence.isPresent(unit)` 查询当前空间存在性；无此 Capability 的 Unit 默认返回 true。

暂时消失保留 Unit 身份、真实位置、Lifetime、部署及 Occupancy 登记。它不是离场，不触发 enter／leave，也不统一结束 Skill、Effect、Burst 或独立 Projectile。原生机制及各接收路径的差异见[案例 18](../research/cases/18-projectile-source-and-target-lifecycles.md)，技能开始通知中的同步变化见[案例 05](../research/cases/05-skill-start-and-finish.md#2026-11-06复核开始通知中的宿主消失)。

## 操作与职责

`disappear(): Change<Unit & Presence>` 和 `appear(position): Change<Unit & Presence>` 不绑定 Ref，由 `unit.update(battle, ref, change)` 提交。工厂不读取 BattleState，也不自行发布。appear 同时主动覆盖位置，即使当前已 present，也要调用所属阻挡能力的完整释放操作，清理当前关系及自身偏移。

```typescript
battle = update(battle, reference, presence.disappear());
battle = update(battle, reference, presence.appear(position));
```

Presence 根据宿主实际拥有的能力，登记或撤销自己持有的限制 Rule：

| 所属能力 | 消失期间的限制 |
| --- | --- |
| Action | 禁止新的执行；已存在的 Execution 以 SOURCE_ABSENT 取消。 |
| Skill | 禁止新的 Activation；已成立的 Activation、STOP／RETRIGGER、资源回复和持续程序仍遵守 Skill 自身的契约。 |
| Locomotion | 禁止自主移动，保留 velocity。 |
| Blocker／Blockable | 禁止取得或维持阻挡关系。 |
| Vitality／Elemental | 拒收普通 HP／EP Damage；HP LOSS 不受这项空间接收限制，不附带普通 Healing 或资源自然恢复限制。 |

两个入口返回的 Change 以 compose 排序，自身空间变更排在首位，随后用 optional 按当前宿主能力应用各能力的 setRule／removeRule Change，不手写其它能力的 Rule State 或结算列表。optional 在实际应用时读取前序变换的 next。全部变换共同参与一次发布，组合不增加发布或结算边界。恢复出现只移除 Presence 自己的登记，其它 Rule 继续生效。Capability 和 Action／Skill 的业务不反向读取 Presence。

空间查询、普通 Targeting 和 Terrain 接触直接消费空间存在事实。Combat 在执行可能消费 RNG 的目标选择程序之前排除消失来源，Action 的启动 Rule 则在执行入口判断资格。已经锁定的 tracking Projectile 继续读取现存目标的真实位置；身份失效后才使用记忆位置。命中、重新索敌和伤害接收分别判断。

## 发布与同步结算

Presence Change 可以通过 compose 与同宿主的其它变更组合，遵守[统一变更协议](api-conventions.md#51-unit-完整操作与批量变更)：

1. Change 函数读取当前位置的当前宿主；LEAVING 宿主返回原值与空结算列表，不产生空间变更。
2. 自身叶子的 Transformation 只更新 present／position；后续所属能力的 Rule Change 各自完成纯登记或撤销。
3. 整个 Change 函数返回后一次发布，再按捕获的 settlements 顺序结算；不为 Presence 另设全批优先级。
4. 自身叶子的 Settlement 按 `previous` 的稳定能力角色，调用 Blockable.release 或 Blocker.releaseAll；完整操作从最新 BattleState 读取当前关系，Blockable 同时取消自身位置计划。disappear 在释放后调用 Action.cancelForUnit，由 Action 从最新 BattleState 读取当前执行并取消；appear 不取消执行。后续 Rule Settlement 接续最新状态。

Presence 调用的释放操作在自己的第一次 RELEASED 回调前完成当前关系的整批双端解除；Blockable 自身计划也已取消，Blocker 不取消其原目标的独立偏移。回调同时可以读取本批最终空间事实与限制。其它 Change 的先行 Settlement 仍遵守其自身契约。

释放操作按自身入口固定关系集合，通知中新建的关系不属于该次释放候选。

Skill 的 activationStarted／spPaid 通知后，按最新宿主和当前 Activation 的身份及生命周期决定是否执行 onStart；暂时消失本身不单独跳过开始程序。持续技能后续推进不以 Presence 作为统一门禁。Action 已经发生的输出、弹药消费和后继由具体内容决定，取消执行本身不决定这些结果。

## 验证边界

按[语义验收清单](verification.md)集中验证限制与批量解除的发布顺序、旧实例清理、Skill 开始与持续、伤害和恢复的区别，以及锁定弹道的真实位置。Hook、Change 和 Lifetime 的公共协议不在 Presence 消费者中重复展开。
