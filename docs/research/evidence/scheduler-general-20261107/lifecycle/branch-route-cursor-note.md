# Branch 路线提取的游标实参纠正

旧分工说明将 `TryPickNextPhase(true)` 误称为 peek。本记录按原件签名和写入指令更正，不依方法名推断只读性。

- 原件 `../../scheduler-native-20261107/branch-bodies.json`：完整方法 `Torappu.Battle.Scheduler/BranchRuntime.TryPickNextPhase`，VA `0x180978640`。metadata 两项显式参数是 `result: Torappu.LevelData/BranchData/PhaseData&` 与 `isLoop: bool`。
- `0x180978675` 检查 isLoop；true 且 phases 非空且已没有下一项时，`0x1809786a9` 将 `this+0x18`（nextPhaseI）重置为0。
- 成功取项前，`0x180978718` 读取当前 nextPhaseI，`0x180978720` 计算 index+1，`0x180978723` 写回 nextPhaseI，再在 `0x180978730` 取 phases[index]。因此 true 表示允许循环，不表示不推进游标。
- 原件 `extra-bodies.json`：`Torappu.Battle.Scheduler.TryGetEnemyRouteFromBranch` @ `0x180983c80` 在 `0x180983d7d` 将 r8b=1，于 `0x180983d80` 调用该方法；Phase取出后才验证列表、actionIndex、type并提取 routeIndex/key。
- 同原件：`Torappu.Battle.Scheduler.TryGetAllEnemyRoutFromBranch` @ `0x1809837b0` 在 `0x18098389d` 将 r8b=1，于 `0x1809838a0` 调用该方法；Phase取出后才检查Action类型、路线和key。
- 上述两个调用者后继失败分支没有恢复 nextPhaseI 的写入。故“TryGet”入口并非无副作用窥视；Phase已成功取得后再发生参数/内容检查失败，也没有这两个方法内部的回滚。

范围：普通原生分支，未验证 XLua 替换。
