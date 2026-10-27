# Projectile Stop / Hit / Destroy 顺序核对

核对日期：2026-10-21。只检查当前安装客户端 GameAssembly.dll 的原生 fallback（各函数 XLua 热修复入口均可整体替换本体；本轮没有解包确认 live Lua 替换）。来源/目标离场的规则不在本报告范围。

## 结论

1. `StopMe()` 是一次同步终结操作，包含 `stopped=true → OnProjectileStop() → DestroyMe()`。不是单纯“停止运动”事件，也没有在 `StopMe` 本体内等待若干 Tick。
2. `OnProjectileStop` 可以产生新的 Hit：普通未被消除的弹道按配置先保底命中主目标、可补派 Reached，然后调用 Controller 和各 Behaviour 的 stop 回调；HitBehaviour 还可以配置为停止时范围命中。
3. `stopped`、`hasReached`、`hasHitTraceTarget`、Hit 去重历史、命中次数、`isValid` 是独立事实，不能合为一个开关。`StopMe` 重复调用/同步重入被 `m_isStopped` 拦截；这不等于 Hit 去重统一由 Stop 负责。
4. 正常 Stop 回调执行时，root 已 `stopped`，但默认仍登记且 valid；到最外层 Stop 的回调返回之后才 DestroyMe / 同步注销 / instanceUid 清零。这个窗口是同步调用栈内的终结窗口，不是一个后续 Tick 还能继续活动的 STOPPED 阶段。
5. root 的未来 OnTick 在入口见 stopped 就返回；**本次已经在执行的 Behaviour 循环不会因中途 Stop 自动中断**。个别 Behaviour 自己的资格检查另论，不能说“置 stopped 后绝不再执行任何回调”。

## 1. Stop 的准确顺序与重复保护（直接证实）

`Projectile.StopMe [71373] VA 0x1808daf40`：

```text
0x1808daf7f  cmp byte [self+0xa4], 0
0x1808daf85  jne return
0x1808daf87  mov byte [self+0xa4], 1       // m_isStopped
0x1808dafb2  call virtual slot 53         // OnProjectileStop
0x1808dafbe  jmp BObject.DestroyMe[65032] // 无参，直接Recycle
```

Vtable 基址 0x140，slot 53 对应 0x490。field offsets 以 `fields-10773.json` 为证。`SimpleProjectile` 没有 OnProjectileStop/OnRecycle 覆盖（`projectile-derived-overrides.json`），只提供各策略属性 getter。

简化伪码：

```cs
void StopMe() {
    if (m_isStopped) return;
    m_isStopped = true;
    OnProjectileStop();
    DestroyMe();
}
```

因此 stop 回调触发同步业务，再次调同一 Projectile.StopMe 不会重复调用 stop 回调/再次 DestroyMe。此为正常返回路径；异常/任意 Content 主动先销毁没有额外 transactional 保证。

## 2. OnProjectileStop 可以产生 Hit（直接证实）

`Projectile.OnProjectileStop [71361] VA 0x1808d97d0`：

```cs
if (!m_isEliminated) {
    if (alwaysHitTraceTargetInTheEnd) _DealHitTraceTarget();
    if (alwaysReachInTheEnd) OnProjectileReached();
}
actionController.OnProjectileStop();
foreach (b in m_behaviours) b.OnProjectileStop();
// extra follow effects finish, main visual clear, stop audio
```

定位：

- 0x1808d982b 检查 self+0xa5 `m_isEliminated`。
- 0x1808d9857 调 slot43 `alwaysHitTraceTargetInTheEnd`；9862 调 `_DealHitTraceTarget`。
- 0x1808d988c 调 slot45 `alwaysReachInTheEnd`；9897 调 `OnProjectileReached`。
- 0x1808d98bd 调 ActionController.OnProjectileStop[71443]。
- 0x1808d98e0–994a 依登记数组顺序调用 Behaviour.OnProjectileStop(slot7)。

`SimpleProjectile.get_alwaysHitTraceTargetInTheEnd[71473]` 读取 self+0x1b3；`...WhenReached[71474]` +0x1b4；`...alwaysReachInTheEnd[71475]` +0x1b5。它们是三个分开的 prefab 配置。

`_DealHitTraceTarget[71375]`：检查 `m_hasHitTraceTarget`，检查当前目标身份 valid+alive，**在业务回调之前**设置 `m_hasHitTraceTarget=true`，然后 `DealHitTarget(target, force:true)`。

```text
0x1808db98b cmp self+0xa7,0               // dedicated fallback attempted flag
0x1808db9ab call ValidAndAlive           // existing generic 285168
0x1808db9b6 mov byte [self+0xa7],1
0x1808db9c8 mov r8b,1                    // force skips count quota, not dedup
0x1808db9d6 jmp DealHitTarget[71347]
```

**清弹与正常停止有区别，但不完全静默**：`HitBehaviour.OnProjectileStop[86265]` 在 0x180d354f9 读取 projectile.isEliminated，35500 为 true 跳过它的停止范围命中；随后 `_checkHitWhenStop` 对应 +0x8a 控制正常 stop 时是否扫描范围。Controller.OnProjectileStop[71443] 则对 eliminated 运行不同 Action 组：

- 0x1808c8e64 读取 self projectile +0xa5。
- true → `_RunActions(4)` = `ON_PROJECTILE_ELIMINATE`。
- false → `_AttachExtraBuffWhenStop()` → `_RunActions(3)` = `ON_PROJECTILE_STOP`。
- 两种前面都可按配置移除之前附着的 Buff。

枚举采用 metadata 压缩有符号整型解码，见 `projectile-events.json`（旧 helper.enum_values 的 raw int32 读法不正确）。因此可以确认清弹跳过普通 forced-main、强制 Reached 和 HitBehaviour stop范围命中；不能推导成所有消除 Action 都无业务输出。

## 3. Reached、Hit、Stop 是不同语义（直接证实）

`OnProjectileReached[71365]` 在 0x1808d9782 检查 m_hasReached，未到达则 978d **先设 true**，9797 调 `DealProjectileReached[71366]`。其本体没有 StopMe 调用。

`DealProjectileReached[71366]`：

```cs
actionController.Run(ON_REACHED_TARGET);
actionController.AttachExtraBuffWhenReached(traceTarget);
foreach (b in behaviours) b.OnProjectileReached();
if (alwaysHitTraceTargetInTheEnd || alwaysHitTraceTargetWhenReached)
    _DealHitTraceTarget();
// visual/audio
```

定位：0x1808d6e35 Controller REACHED，6ec6 Behaviour.Reached，6f3c 主目标保底。

限定：OnProjectileReached 可选的来源 EventPool 通知在 hasReached guard 之前；保证一次的是 DealProjectileReached 主体，不能声称直接任意重复调用该方法的每个通知全都幂等。

`DealHitTarget[71347]`：

```cs
if (CheckTargetAlreadyHitAndUpdate(target)) return false;
if (!force && currentHitNum >= maxHitNum) return false;
OnHitTarget(target);
currentHitNum++;
if ((stopAfterMaxHit && currentHitNum >= maxHitNum) || stopAfterFirstHit)
    StopMe();
return true;
```

定位：0x1808d6cba virtual去重；6cc9–6cd5 次数资格（force可跳过）；6ce6 虚调用 slot54 OnHitTarget；6ceb 之后才命中次数+1；6d5a 调 StopMe。**没有 m_isStopped 或自身 isValid 检查。**

`OnHitTarget[71362]`：

1. 0x1808d9130 UpdateAlreadyHit(target)，在业务前登记/刷新历史。
2. 0x1808d913e OnBehavioursHitTarget，逐项回调。
3. 0x1808d919e 来源 OnProjectileHitTarget（来源存在时）。
4. 0x1808d91b6 ActionController.OnHitTarget。
5. 命中特效/音效清理。

“命中成功”表示进入这组 Hit 回调与计数，不保证 Damage 导致了 HP 损失。

去重默认由 `CheckTargetAlreadyHitAndUpdate[71369]` 实施；`_canHitSameTargetMultipleTimes` (+0x8d) 可跳过检查。历史表记录到期时间；GetKeepAlreadyHitTime <=0 时 sentinel永久，否则 fixedPlayTime+时长。Stop guard、主目标保底尝试 guard、通用目标历史、总命中次数彼此独立。无需在本轮把所有历史政策强制合并。

一个可观察的重入细节：OnHitTarget 内同步触发 Stop 时，外层 `m_currentHitNum++` 尚未执行；Stop中的主目标保底可插入另一笔 Hit，之后外层原栈仍会计数。故不能把 count 当作严格的已全部提交业务事实或把 Stop 视为栈中断。

## 4. DestroyMe 的逻辑失效、容器移除与对象回收（直接证实）

默认无参链：

```text
StopMe
  → OnProjectileStop returned
  → BObject.DestroyMe[65032] 0x1806627c0
  → PoolManager.Recycle[34636] 0x182a4a830
      → IReusable.OnRecycle dispatch 0x185c27ff0
          → BObject.OnRecycle[65035] 0x1806629d0
              → BattleController.UnregisterBObject[64671]
                  → ObjectManager.Unregister[71075]
                      → projectiles.UnorderedArray.Remove
                      → objects.PriorityQueue.Remove
              → instanceUid = 0
      → pool _RecycleInternal / GameObjectPool._RecycleInternal
          → deactivate / move into pool
```

关键地址：

- DestroyMe 0x180662804 直接尾调 PoolManager.Recycle，无延迟 coroutine。
- PoolManager.Recycle 0x182a4a8d7 同步IReusable.OnRecycle，再做GameObject池回收。
- BObject.OnRecycle 0x180662a0f 调 Unregister；2a14 写 instanceUid+0x18=0。
- BObject.get_isValid[65018] 0x180663060 就是 instanceUid >0。
- ObjectManager.Unregister 0x1808d58a8 对 UnorderedArray.Remove，58cf 对 PriorityQueue.Remove。`manager-generic-names.json` 给出对应 GenericMethodInfo 精确名称。
- PriorityQueue.Remove 最终到 List.Remove 的共享体 0x184d139a0，0x184d13a75–a79 同步 count--、后移数组、清末项；不是延迟注销队列。
- GameObjectPool._RecycleInternal[34549] 0x182a435ac 以 false 设置活动，35ca 设置回收父对象。pool可能SendMessage OnRecycle，但没有清除Projectile.m_behaviours。

`DestroyMe(float)` 是另一重载[65033]，delay>0才走 RecycleAsyncByBattleCoroutine[64252]。**StopMe调用的是无参重载，不能用延迟Destroy重载的存在推导Stop自动延迟。**

`Projectile.get_isAlive[71285]` 默认只是 `isValid`，并不直接取反 m_isStopped。所以在默认OnProjectileStop回调里能看到 `isStopped=true, isAlive=true`；其后Recycle/Unregister完成变为invalid。不将对象池保留的CLR/Unity内存误当成战场生命周期继续存在。

## 5. 停止后的执行资格：未来 Tick 与当次栈尾必须区分（直接证实 + 调用链结论）

`Projectile.OnTick[71344]`：

- 0x1808d9b5b–b61 入口检查 m_isStopped，非零直接返回。
- 时间/其他检查造成Stop的分支（9e16）后本身立即return，不进入behaviour循环。
- 但已进入的 Behaviour loop 在 0x1808d9e50–9f24 每轮只读数组/元素，调用各 Behaviour.timeScale/OnTick，**从不重新读 m_isStopped/isValid**。
- 正常Recycle流程不清 m_behaviours；BObject.OnRecycle也不做数组清除。

因此若B1.OnTick触发StopMe，Stop回调和DestroyMe同步跑完后回到B1，再回到root循环，root仍会调用B2.OnTick；B2是否无操作、是否看owner.stopped由其自身实现决定。Unity禁用对象不会自动中止已经在C#调用栈里的普通方法调用。

ObjectManager.OnFixedUpdate[71077] 先从PriorityQueue收集validAndBorned到固定m_tickList，再遍历tickList调OnTick。Unregister会从正式集合同步删除，但不剪掉正在执行的root OnTick栈，也不能假定已经生成的tickList马上删除该对象。root自身入口stopped守卫仍会让后续尝试Tick直接返回。

## 6. 证据范围与架构影响

直接证实覆盖上述基类/SimpleProjectile路径，并枚举了原生Projectile派生类的Stop覆盖：Harpoon[71113]、Lasso[71148]、NetCatcher[71246]都先调base.OnProjectileStop再做自身清理（asm已保存）。没有为了本轮扩展调查来源或目标离场。

可以据此排除：把Stop理解为纯移动暂停、把Stop和Hit视为互斥、把pool回收当成延迟逻辑死亡、把原生stopped当作自动中断所有当前回调的通用屏障。

尚不由本报告确定：Stronghold 是否需要对外公开独立 stop/hit/destroy、是否有核心STOPPING状态。原生只证明同步终结窗口与终结前的行为等待必须区分；具体延迟机制由本轮delay调查另给证据。
