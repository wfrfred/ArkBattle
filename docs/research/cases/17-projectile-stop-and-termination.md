# Projectile：Stop、Hit、Destroy 与延迟

研究日期：2026-10-21。项目对照为 `c40d79b5`。本轮只调查停止、消除、命中与销毁的关系，不设计新的类型或 API，不修改源码，不展开来源／目标离场。

## 1. 证据范围

沿用 [运动与命中调查](16-projectile-motion-and-hit-boundaries.md) 的本机客户端。DLL、metadata 身份及所保存证据的校验值见 [manifest.json](../evidence/projectile-stop-20261021/manifest.json)。结论来自原生 fallback、闭合的实际调用链与真实 Prefab；没有执行客户端注入、录屏或核实活跃 XLua 替换。

分项记录：[入口](../evidence/projectile-stop-20261021/entries/REPORT.md)、[顺序与回收](../evidence/projectile-stop-20261021/order/REPORT.md)、[延迟与实际内容](../evidence/projectile-stop-20261021/delay/REPORT.md)。下文的执行顺序和配置事实为直接证实，架构影响另列。

## 2. Stop 是带有收尾结算的终结操作

`Projectile.StopMe` [71373] `0x1808daf40` 没有原因参数，其普通路径为：

```text
如果 stopped：返回
stopped = true
OnProjectileStop()
DestroyMe()
```

`0x1808daf87` 在回调前设置 stopped；`0x1808dafb2` 同步调用停止回调；`0x1808dafbe` 调用无参 `BObject.DestroyMe`。停止回调内再次 Stop，不会重复进入整套收尾流程。

因此，普通 Stop 同时承担生命周期终结和收尾触发。命中可以发生在停止过程中，停止也可以由命中次数政策引发；两者不是互斥事件。

### 2.1 不同入口是否采用相同命中政策

以下比较同一个配置了末尾原目标保底的普通逻辑 `SimpleProjectile`；“尝试”仍受原目标资格、保底尝试标记及命中历史约束，不保证产生新的 Hit 或 HP 损失。

| 已核实入口 | 实际调用链 | 根对象是否尝试原目标保底 |
| --- | --- | --- |
| Movement 正常抵达后的停止 | `Behaviour.Stop → StopMe` | 是；到达派发可能已经命中过，随后受保护跳过 |
| 外部主动中断 | `Interrupt → StopMe` | 是 |
| 普通远程能力清理弹道 | `RangedAttack.ClearProjectile → Interrupt → StopMe` | 是 |
| 普通逻辑弹道超时 | `OnTick → ExtraCheckToFinish → StopMe` | 是 |
| 已核实的资源 Holder 清理 | `_ClearResourcesInHolder → RecycleSelfImmediately → StopMe` | 是；这里不推导战斗退出时一定产生可观察伤害 |
| 成功消除弹道 | `TryEliminate：eliminated=true → StopMe` | **跳过末尾保底** |

`TryEliminate` [71340] `0x1808db100` 先检查是否允许消除；不允许则返回 false，不停止。成功后先在 `0x1808db18e` 设置 eliminated，再调用普通 StopMe。

这不是抽象字段推测：真实 `char_4133_logos.ab` 的 `Modes/S3_End/Body/Attack` 配置 `EliminateProjectileAbility`，其 `OnCastOnProjectile` [91088] `0x180eb8840` 在 `0x180eb889c` 调用 TryEliminate。普通 `RangedAttack.ClearProjectile` [90823] `0x180ec2f00` 则在 `0x180ec303a` 调 Interrupt，语义不同。

超时也有资格条件：当前时间达到寿命，且 Movement 不属于跟随逻辑弹道的特殊模式，再通过 ExtraCheckToFinish 才 Stop。普通 AdvancedMovement 沿用 `followsLogicProjectile=false`，基础 ExtraCheckToFinish=true；不能将此概括成所有图形追随组件无条件超时。

## 3. Stop 内部的准确顺序

`Projectile.OnProjectileStop` [71361] `0x1808d97d0`：

```text
如果未被消除：
  按配置尝试原目标保底命中
  按配置补派 Reached

ActionController.OnProjectileStop
逐个 Behaviour.OnProjectileStop
结束相关特效与音效收尾

返回 StopMe
  → DestroyMe
```

这里存在三个独立的命中来源：原目标保底、补派 Reached 时的命中、停止 Behaviour 的范围命中。`HitBehaviour.OnProjectileStop` [86265] `0x180d35410` 在配置为 stop-only 时查询当前范围并命中，因此停止回调可以产生新的命中名单。

消除不等于完全静默：

- 根对象跳过原目标保底与 `alwaysReachInTheEnd`。
- `BasicMovement.OnProjectileStop` [71216] 也检查 eliminated，跳过停止时强制到达，避免从这条标准路径重新触发到达命中。
- 标准 `HitBehaviour.OnProjectileStop` 检查 eliminated，跳过停止范围命中。
- Controller 仍按配置撤销关联 Buff，并改为执行 `ON_PROJECTILE_ELIMINATE`；普通停止执行的是 `ON_PROJECTILE_STOP`。
- 其他 Behaviour 仍收到停止通知；不能由上述标准保护推导任意自定义消除回调都没有业务输出。

### 3.1 到达保底与停止保底不是两个独立伤害

本轮补全上一轮的表述：`DealProjectileReached` [71366] `0x1808d6db0` 在 `alwaysHitTraceTargetInTheEnd` **或** `alwaysHitTraceTargetWhenReached` 为 true 时，都会调用同一个 `_DealHitTraceTarget`。字段名中的 InTheEnd 不能解释成只在 Stop 内执行。

普通弩箭可以先在 Reached 命中，随后 Stop 再走同一保底入口但被保护跳过。阿米娅二技能计时结束先 Reached、再 Stop，也应按这个顺序理解。

`_DealHitTraceTarget` 在进入业务前设置专用的“已尝试原目标保底”标记；通用命中历史又提供独立的去重。普通 `DealHitTarget` 的顺序是：

```text
命中历史检查／登记
命中次数资格检查（force 可绕过这一项）
OnHitTarget 内容与通知
命中次数 +1
按次数政策决定是否 Stop
```

所以 Stop 的重入保护、原目标保底尝试、目标命中历史和命中次数不能合并理解。OnHitTarget 同步触发 Stop 时，外层命中次数可能还没有递增，但身份历史已经写入。

## 4. Destroy 与停止后的存在性

普通 StopMe 调用无参 `BObject.DestroyMe` [65032] `0x1806627c0`：

```text
PoolManager.Recycle
  → BObject.OnRecycle
      → BattleController.UnregisterBObject
          → ObjectManager.Unregister：移出正式弹道与对象集合
      → instanceUid = 0，isValid 变为 false
  → 禁用 GameObject 并回收到对象池
```

`BObject.OnRecycle` [65035] `0x1806629d0` 在 `0x180662a0f` 注销，在 `0x180662a14` 清零身份。正式集合移除也已展开为同步 Remove，不是等待后续战斗阶段统一删除。

因此，正常停止回调期间可以观察到 `stopped=true`，但实例通常仍 valid、仍已登记；最外层正常 Stop 完成后实例即失效。这是同步终结栈内的窗口，不是一个之后还能继续多个 Tick 的 STOPPED 存活阶段。对象池保留内存不代表战场实例继续存在。

另有 `DestroyMe(float)` 延迟回收重载，但 StopMe 没有调用它。无参 DestroyMe 自身负责回收，不会先替调用者补做整套 Stop；不能任意互换两者。

### 4.1 终结不自动中断既有调用栈

`Projectile.OnTick` 只在入口检查 stopped。已经进入的 Behaviour 循环不会逐项重新检查；正常回收也不清空该数组。因此 B1.OnTick 内 Stop 后，原调用栈仍可能继续调用 B2.OnTick，B2 自己的资格检查另论。

ObjectManager 也先生成本次 Tick 名单，注销不会自动改写已生成的名单。未来对已停止根对象的 OnTick 尝试会被入口守卫拦住。应区分正式生命周期终结与已在执行的栈尾继续，不能将 stopped 当作所有同步程序的自动中断器。

## 5. 延迟是到达后、首次 Stop 前的活动窗口

普通 AdvancedMovement / Paracurve 的已核实流程：

```text
识别到达
  → 设置 Movement 到达进度
  → 同步派发 Projectile.Reached
  → 调整剩余寿命并安排延迟回调
  → 等待期间 root 尚未 stopped，继续推进 Behaviour
  → 延迟回调实际调用 Stop
  → 停止结算及销毁
```

关键定位：`AdvancedMovement.DoCheckReached` [86735] `0x180d522b0`；`_ScheduleDeferredStop` [86737] `0x180d548d0`；回调 [86756] `0x180d53e00`。Paracurve 对应 [87125] `0x180d77aa0`，回调 [87131] `0x180d782f0`。

### 5.1 延迟与命中的相对位置由实际行为决定

下表数值是 Prefab 默认值，`projectile_delay_time`、`interval` 等内容参数可以覆盖；不作为所有技能等级的最终时长。

| 真实引用链 | 已核实时间关系 |
| --- | --- |
| 维什戴尔普攻 → `projectile_chr_wisdel_default` | Reached 主段命中 → 默认 0.15 秒等待 → Stop 附加命中 |
| 慑砂二技能 → `projectile_sesa_s2` | Reached → 默认 2 秒等待 → Stop 爆炸；两个原目标保底开关均关闭，没有隐含的提前主目标命中 |
| `skchr_greyy2_2` → `projectile_chr_greyy2_s2` | Reached → 默认 9 秒活动窗口内周期索敌命中 → Stop；周期默认 1.5 秒 |

这三项都有实际发射能力与弹道配置相连。延迟可以发生在首次命中之前，也可以处于两次命中之间，还可以包含持续的周期命中。

### 5.2 等待期间哪些部分继续

- **普通运动积分停止**：AdvancedMovement 的 CheckStartTick 检查自身 reached；Paracurve 也在 reached 后跳过普通位置／重力积分。所选示例未配置返回起点行为。
- **其他 Behaviour 继续推进**：根对象尚未 stopped，仍推进时间并调用 Behaviour.OnTick。承曦格雷伊二技能的 SelectorHitBehaviour 明确要求 hasReached 后才进入周期索敌，直接证明等待不是整体冻结。
- **接触资格由命中行为决定**：标准 Trigger 入口没有统一的 hasReached 拒绝。已经到达这一事实本身不会禁止后来接触；是否接纳还受 reach-only / stop-only 配置、命中历史、次数与目标资格影响。不能声称每个延迟弹道都继续碰撞命中。

另有 `_delayToReachAfterHit`：AdvancedMovement 接受一次 Hit 后安排延迟的 Reached。它不推迟已经发生的 Hit，也不是 Stop 后等待；在到达实际发生前，普通运动仍可能继续。

## 6. 重复停止、未确认事项与本轮边界

延迟安排被重新设置时，AdvancedMovement 会取消自己的旧 Stop 协程。但普通停止回调没有直接调用该取消方法。已经确认的是：若延迟回调再次针对同一个尚未复用的实例调用 StopMe，stopped 守卫会防止重复收尾。

尚未闭合的是：外部提前 Stop 后，统一协程所有权清理是否必然撤销该延迟，以及对象池复用前如何处理旧回调。不宣称它一定取消，也不宣称一定会迟到执行。这是具体未决的计时器清理问题，不影响“等待发生在首次 Stop 前”的主要结论。

**架构判断限于证据支持的范围**：到达等待、同步终结、实例销毁是不同阶段。延迟事实本身不足以要求一个全局 STOPPING 状态；若该名称表示“已经 Stop，但继续等若干 Tick 才结束”，就与本轮普通路径不符。同步终结仍需要重入保护，这与是否把行为等待保存为 Content 私有状态是两个问题。

当前 Stronghold 的 `WAITING_TO_STOP` 进入时机也是到达之后、实际 stop 之前；其主要限制是分支只更新等待时间，冻结其他推进，不能直接覆盖承曦格雷伊这样的持续命中窗口。本轮只记录差异，不据此修改类型、回调或代码。
