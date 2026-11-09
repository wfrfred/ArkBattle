# UI 瞬时输出

`BattleState.events` 是模拟内核提供给 UI 的瞬时输出契约。State 驱动位置、资源条和当前执行等持续展示；Event 补充飘字、动画时点、爆发和离场表现需要的发生事实。具体动画、资源与颜色由 UI 选择。

UI 的实际需要决定输出哪些事实与字段。领域操作没有记录全部业务变化的义务；业务结果通过 Outcome／Application 返回，同步响应通过 Hook 执行。调试日志转发不构成保留 Event 的理由。内核不读取 Event 执行业务、累计统计或派发 Hook。

## 类型归属与收集

领域定义自己的 `Event`，Battle 在 `battle/event.ts` 通过类型联合汇总。没有实际输出需求的领域不建立事件枚举，也不强制每个领域单建 `event.ts`。类型归属由事实语义决定，输出位置由完整业务时点决定。

| 定义归属 | 保留输出 |
| --- | --- |
| Unit | `UNIT_REMOVED`：身份、原因和注销时的 Unit 历史事实，支持最终 State 已没有对象时的离场表现。 |
| Action | `ATTACK_STARTED`：攻击模板首次推进时的有目标攻击表现提示；`ACTION_RELEASED`、`ACTION_FINISHED`、`ACTION_CANCELLED`：行动释放、完成与取消的动画时点。 |
| Skill | `SKILL_ACTIVATED`、`SKILL_FINISHED`：技能动画的启动与结束。 |
| Elemental | `ELEMENTAL_BURST`：发生爆发的 Unit、元素类型与当时位置。 |
| Route | `ROUTE_COMPLETED`：路线完成后的漏怪表现，由 Route 确认 Main 终点离场时追加。 |
| HP Damage | `DAMAGE`：目标、伤害类型和实际 HP 损失。现有取消表现保留零值输出。 |
| EP Damage | `ELEMENTAL_INJURY`：目标、元素类型和实际 EP 损失。 |
| HP Healing | `HEAL`：目标和实际 HP 回复。现有取消表现保留零值输出。 |
| EP Healing | `ELEMENTAL_INJURY_HEALED`：目标和本次各型 EP 实际回复的合计。逐型报告仍从 Application 获取。 |

以上输出包含发生 Tick。元素损伤对应 Elemental Injury，元素 HP 伤害对应 Elemental Damage；后者仍是 `DAMAGE` 的 `ELEMENTAL` 伤害类型，两者不得混用。

四种伤害与治疗在成功提交时均输出对应 Event，实际资源变化为零也记录 amount 为零。零计算输出在 Apply 入口拒绝，不产生成功输出；取消表现仍按各业务已有约定处理。Elemental 的 damaged／healed 只通知实际变化大于零的业务，与 UI Event 的成功输出条件分开。

伤害与治疗 Event 不复制接收量、取消报告或提交后的资源值。Burst Event 不携带整个运行实例，使用发生时采样的位置，避免 UI 查询最终 State 得到移动后的位置或找不到同 Tick 已注销的宿主。

各领域直接调用 `appendEvents`，队列只保存在 `BattleState.events`。不建立事件总线、注册表、订阅或 Event 生命周期，也不保留并行的 Signal 输出类型。公共 Event 仅使用类型导入聚合。

## 输出时点与业务独立

Event 按事实发生时点追加；嵌套操作产生的输出保留其先后关系。EP 损伤先输出本次实际损失，再输出由其触发的爆发，之后才运行对应 Hook／内容程序。Unit 在物理注销时追加离场事实，随后执行 leave 程序；不在 Tick 末尾重新投影或按领域重排。

Tick 开始清空上一 Tick 的临时输出；保留旧 BattleState 仍可读取其原输出。初始化操作产生的输出也属于其返回状态。

Schedule 通过既有 Unit 全局离场 Hook 同步解除等待，不读取表现事件。Route 输出不承担全局计数或终局裁决。

Blocking 关系、Route 中间检查点、Projectile 到达／命中／停止、出生、部署与部署拒绝，以及元素自然恢复完成／爆发结束不再输出诊断 Event。其业务状态、返回结果与 Hook 保持原有职责。出现新的 UI 瞬时需求时，再由所属领域定义必要输出。

## 回归语义

验收依据见[Event 回归清单](verification.md#event-的回归语义)。测试只保障实际表现事实与业务独立性，不为每个事件变体、字段或被删除的事件名增加单独用例。
