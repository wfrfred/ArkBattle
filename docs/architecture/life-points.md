# 关卡生命值

[Life Points](../../src/core/battle/life-points.ts) 管理本场普通生命与临时生命，不从出口地块、Unit HP、Schedule Wait 或 Statistics 推导生命值，也不裁决胜负。

## 资源与修改

`Battle.Input.lifePoints` 显式提供 `balance` 和 `temporary` 两个非负整数初值；普通关卡从 `options.maxLifePoint` 取得普通生命初值，临时生命初值为零。`State` 保留这两个账户、待结算的个体损失登记 `pending` 和 `hooks`。普通与临时生命最低均为零，不设置通用运行时上限。

- `modify(battle, delta)` 接受有符号整数，正值增加普通生命。
- `addTemporary(battle, amount)` 接受非负整数，正值增加临时生命。
- 两者使用同一修改程序。负向变化优先扣除临时生命，剩余损失扣普通生命，最低截到零。

两个入口先派发 `beforeModify`，上下文 `"BALANCE" | "TEMPORARY"` 表示正向变化的目标账户，工作值为有符号变化量。Hook 可调整变化量或将其设为零；最终工作值取偶舍入，按前置 Hook 返回的最新 BattleState 结算。负向变化的分配顺序不受目标账户影响。

账户提交后，仅当普通或临时生命确实变化时派发 `modified`，载荷 `balanceDelta`、`temporaryDelta` 分别描述本次实际变化，而非原始请求。后续 Hook 可读取已提交资源并触发独立的修改；需要只触发一次的具体效果应先消费自己的资格，再发起二次扣减，不由 Core 屏蔽重入。`setHook`、`removeHook` 按项目通用 Hook 契约管理登记。

## 个体出口结算

`pending: ReadonlyMap<Ref<Unit>, number>` 保存每个实例尚待结算的出口扣血量。`register(battle, ref, amount)` 接受非负安全整数；正值登记或更新当前损失量，零删除登记。不纳入扣血的实例不保留登记。

初始 Unit 与 Schedule.Spawn 显式提供 `lifePointLoss`；在 `Unit.initialize` 之后、`Unit.add` 之前登记，以支持 entered 中的同步离场。其他创建者可自行登记。此资格独立于 Unit Definition、普通击杀统计与调度等待；`statistics.markKilled` 不取消生命损失。

Battle 装配全局 `battle.unit.removed` Hook。完整离场时先消费对应登记，再在原结束原因是 `EXIT` 时请求相应负向生命修改；自然与强制出口走同一入口。其他原因离场只删除登记，无扣血。先清除登记确保一次离场只提交一次个体损失。

## 玩法边界与依据

Core 只持有单场的一个生命账户。普通生命归零时不停止 Tick、不设置战斗结果，外部读取账户和其他领域事实裁决胜负。肉鸽探索级别的上限、跨战斗护盾及卫戍多人账户和回合结算属于各玩法外层。

原生的临时生命优先消耗、普通与临时生命的修改前后时点、个体扣血量与统计资格分离，见 [Case 13](../research/cases/13-route-and-movement-timing.md#52-关卡生命值补核2026-11-28) 与 [Case 37](../research/cases/37-resource-mechanism-coverage.md#6-关卡生命点与临时生命)。具体一次性附加扣血程序由 Content 实现，不在 Core 保存玩法标记。
