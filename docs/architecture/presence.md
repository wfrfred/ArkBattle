# 空间存在

Presence 保存身体是否参与普通空间交互，初始 present 为 true；无该能力默认空间存在。暂时消失保留 Unit 身份、真实位置、Lifetime、部署和 Occupancy，不等于离场，不派发 entered／removed，也不统一结束 Skill、Effect、Burst 或独立弹道。

原生依据见[来源和目标生命周期](../research/cases/18-projectile-source-and-target-lifecycles.md)与[技能开始通知](../research/cases/05-skill-start-and-finish.md#2026-11-06复核开始通知中的宿主消失)。

## 操作与职责

appear／disappear 返回同宿主 Change，由 Unit.update 提交。appear 同时主动覆盖位置，即使已经出现也执行自身阻挡清理；disappear 在清理后取消当前 Action。

| 能力 | 消失期间政策 |
| --- | --- |
| Action | 禁止新执行，并取消当前执行。 |
| Skill | 禁止新激活；已有激活、主动操作和资源／持续程序使用自身规则。 |
| Locomotion | 禁止自主移动，保留历史速度。 |
| Blocking | 禁止取得／保持关系，并主动释放。 |
| HP／EP | 拒收普通损伤；HP LOSS 不受此空间限制，不限制普通治疗或自然恢复。 |

Presence 组合各能力自己提供的限制 Change，恢复只移除自身登记；能力不反向读 Presence。普通空间查询、Targeting、地形接触直接读存在事实。Combat 在可能消费 RNG 的 select 前排除消失来源，启动入口另由限制检查。

锁定弹道继续使用现存目标真实位置，重新选择、命中与最终接收各自判断，见 [Projectile](projectile.md)。

## 发布与同步结算

空间变化先于所属能力限制的变换组合，完成全部应用后一次发布，再按 Change 顺序 Settlement，详细协议见[接口约定](api-conventions.md#51-unit-完整操作与批量变更)。ENDING 宿主不再产生空间变化。

自身 Settlement 按稳定能力角色调用 `blockable.release` 或 `blocker.releaseAll`，由完整操作读取当前关系；Blockable 同时取消自身计划，Blocker 不接管目标计划。disappear 完成释放后委托 Action.cancelForUnit 从最新状态取消执行；appear 不取消执行。后续限制后继继续接续最新状态。

每次释放在自身首个 RELEASED 前完成入口集合的双端解除，回调可见已发布的最终空间事实与限制。通知中新建的关系不追溯删除；混合 Change 的较早 Settlement 仍按自己的顺序执行，不承诺全批事务。

技能启动回调返回后按最新同一 Activation 决定 onStart，消失本身不跳过仍有效的开始程序。已发生输出、耗弹和后继由具体内容的时序决定，不从 Action 取消推导返还或额外消费。

## 验证边界

限制与批量释放顺序、保留身份、Skill 持续、损伤／恢复区别和锁定位置在[统一验收](verification.md)集中分工，不复制公共 Hook、Change 或 Lifetime 测试。
