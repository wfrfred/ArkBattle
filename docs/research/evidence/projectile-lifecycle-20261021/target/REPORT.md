# Target 生命周期：普通 Projectile 的追踪与原目标保底

研究日期：2026-10-21。范围是本机客户端原生 fallback；没有运行注入、观察实机录屏或核对当前活跃 XLua 替换。版本身份沿用项目 `docs/tactical-research/evidence/projectile-stop-20261021/manifest.json`。仅研究死亡、撤退与对象有效性，暂时消失由 root 的独立分支补齐。没有修改源码。

## 1. 结论

**直接证实：追踪位置资格与原目标命中资格是两个独立检查。**

- `MountPoint.isValid` 只判断保存的 owner ObjectPtr 当前身份仍然有效，没有调用 `Entity.alive` 或检查 `isDisappeared`、索敌限制、物理 Collider 状态。
- `BasicMovement.GetTraceTargetMapPosition` 在 MountPoint 有效时读取当前挂点 transform 坐标；失效时使用之前保存的坐标。Advanced 和 Paracurve 追踪分支接着保存该样本。
- `_DealHitTraceTarget` 要求保留的目标 ObjectPtr 有效，并调用目标虚属性 `alive`。不检查挂点或空间存在。通过之后才设置原目标保底的尝试标记，继而强制进入普通 DealHitTarget（仍有独立命中历史）。

因此，目标 HP 归零但尚未回收：**可能仍在被追踪当前挂点，却已不能被普通保底命中**。不能说“死亡立即停止追踪并转向记忆坐标”。

普通 Character 撤退则会完成 Entity，并立即回收（普通 WITHDRAW / SILENT_WITHDRAW）；`alive=false` 发生在 ObjectPtr 身份清零之前。回收后两个引用都失效，普通追踪转为记忆坐标，原目标保底拒绝；没有因此统一停止整个弹道。

## 2. 引用检查闭合

### 2.1 MountPoint

- `MountPoint.get_isValid` [71036] `0x1808b5ca0`，`0x1808b5cd5` 直接尾调 ObjectPtr.IsValid 闭合体 `0x185159fc0`，接收本身 `+0x18` 的 owner ref。
- `ObjectPtr.IsValid` 闭合体：先检查对象为 null / Unity 已销毁，再在 `0x18515a026` 读取当前对象的 instanceUid，`0x18515a02b` 与捕获的 uid 比较。不调用 alive。
- instanceUid 通用调用桥 `0x180bfec30` 对 BObject 分支在 `0x180bfec96` 直接读取对象 `+0x18`。
- `MountPoint.get_mapPositionV3` [71040] `0x1808b5ce0` 在 `0x1808b5d1d` 读取保存 transform 的 position，再转地图坐标。

`ObjectPtr_IsValid.asm` 与 `ValidAndAlive.asm` 是两个不同闭合体；后者不能用于解释挂点是否仍有效。

### 2.2 原目标保底

`Projectile._DealHitTraceTarget` [71375] `0x1808db940`：

```text
if alreadyAttempted: return
if !ValidAndAlive(traceTarget): return
alreadyAttempted = true
DealHitTarget(traceTarget, force=true)
```

- `0x1808db9ab` 调用 `ValidAndAlive` spec 285168 的共享闭合体 `0x18449ab40`。
- 此体 `0x18449aba5` 检查 ObjectPtr 身份；`0x18449abff` 调用虚槽 40 的 Entity.alive。
- `_DealHitTraceTarget` 在 `0x1808db9b6` 才设置 `+0xa7`，前面的无效／死亡返回不会消耗这一标记。
- 这里没有读取 MountPoint、空间碰撞资格、isDisappeared、阵营或 Targetable 限制。后续实际 HP 接收由 Damage 路径负责，不能由 Hit 入场推导一定扣血。

**代码推论：**若某次 Reached 时只是资格暂时失败，后来的 Stop 仍可重试；只有在原目标身份仍相同、又恢复 alive、弹道仍未终结时才可能通过。普通撤退的 ObjectPtr 失效不会因同一对象池内存再使用而恢复。已经取得保底尝试或命中过的目标，仍有各自标记／历史防重复。本轮没有把这种推论声称为实机常见现象。

## 3. 死亡但尚未注销

### 3.1 alive 直接排除

- `Entity.get_alive` [66349] `0x180701920`：先 `StateMachine.isRunning`，再检查 HP>0。
- `Character.get_alive` [75822] `0x180a38df0`：还要求非 dummy、非 dying。
- 普通 Enemy 沿用 Entity.alive。只要 HP 已经是 0，哪怕 Unit 仍登记、动画尚存，原目标保底就拒绝。
- 普通 HP_ZERO 路径：Character.OnHpZero [76029] / Enemy.OnHpZero [76481] → Unit.OnHpZero [77704]；无重生分支时 → Entity.OnHpZero [66650]。在 `0x1806f9211` 传 reason=HP_ZERO(2)，通过虚槽117调用 FinishMe；无来源归零使用8。

这里的普通路径不扩张到特殊重生、假死；Unit.OnHpZero 确有先 CheckReborn 的独立分支。

### 3.2 Finish 与回收不同步

`Entity.FinishMe` [66633] `0x1806f3360`：

```text
if unfinished:
  set finishReason
  StateMachine.Stop()
  OnFinish(reason)
  gameMode.DestroyEntity(self, reason)
```

- `0x1806f3400` 先 Stop 状态机，`StateMachine.Stop` [33273] `0x1826483c0` 强制切 -1；`_SwitchStateInternal` [33284] `0x182648540` 在 `0x18264868e` 写 currentState=-1。故即便某类 Finish 未先令 HP 归零，后继 alive 也为 false。
- `0x1806f3433` 执行 OnFinish；之后才走 GameMode 回收政策。
- `DefaultGameMode.DestroyEntity` [82233] `0x180c18e70` 对死亡原因及 REACH_EXIT(1) 使用 `RecycleSelfWithDelay` [66635]，其他普通原因使用 `RecycleSelfImmediately` [66634]。
- `RecycleSelfWithDelay` `0x1806fb30b` 取虚属性 delayToRecycle；之后 `DestroyMe(float)` [65033] `0x180662710`。正延迟走 battle coroutine 的异步池回收；非正延迟直接 Recycle。

所以延迟回收期间有 `ObjectPtr valid && alive=false` 的真实窗口。

### 3.3 Movement 对此如何处理

`BasicMovement.GetTraceTargetMapPosition` [71223] `0x1808cafa0`：

```text
if predefinedLocation: read predefinedLocation
else if traceMountPoint.isValid:
  return traceMountPoint.mapPositionV3
else:
  return rememberedPosition
```

- `0x1808cb000` 检查 MountPoint.isValid。
- `0x1808cb009` 返回 movement `+0x60/+0x68` 保存样本。
- `0x1808cb024` 读取实时挂点坐标。
- Advanced.OnTick [86734] `0x180d530c0` 的追踪分支在 `0x180d5322b` 调虚槽24 `GetTraceTargetMapPosition`，`0x180d5323e/243` 写入样本；另一个追踪分支 `0x180d535cd/e0/e5` 同样处理。
- Paracurve._CalculateNextPosition [87129] `0x180d78310` 对应 `0x180d783be/c9` 调用和写回（原证据在 projectile-boundaries movement 目录）。

这些分支没有额外因目标不 alive 而终止运动。延迟回收之前仍可能追踪死亡动画挂点的变化；真正回收后才因引用身份不匹配使用记忆坐标。

## 4. Character 普通撤退

`Character.Withdraw` [75944] `0x180a33970` 参数为 `(switchToDeadState, force, manual, logAutoWithdraw)`：

- 默认逻辑先检查 unfinished 与 withdrawable（force可跳过后者）。
- `0x180a33c9a–cb6` 选原因：switchToDeadState→DEADLIKE_WITHDRAW(5)；正常 manual→WITHDRAW(4)；其他→SILENT_WITHDRAW(6)。
- `0x180a33cb6` ecx=0x75，经虚调用桥 `0x1800053c0` 调槽117 `Character.FinishMe`。`invoke-virtual117.asm` 可验证其虚表 base=0x140、每槽16字节。
- `Character.FinishMe` [75971] `0x180a29710` 在普通4/6原因下走 `0x180a2991e → Entity.FinishMe`。
- 普通4/6不被 IfReasonIsDeath [66713] 判为 death，故 DefaultGameMode.DestroyEntity 走即时回收；5属于deathlike，采用延迟回收。不要把两者混为所有撤退都立即回收。

通用 OnFinish 路径会清理领域资源；`Unit.OnFinish` [77689] 关闭常规 Collider / InactiveMode，Character.OnFinish [76033] 通知 Tile.OnCharacterFinished [70723]，清除地块占用和阻挡。正式 ObjectManager 注销发生在之后的 `BObject.OnRecycle`：

```text
BObject.OnRecycle [65035] @0x1806629d0
  0x180662a0f: BattleController.UnregisterBObject
  0x180662a14: instanceUid = 0
```

因此要分开描述：不再参与场上单位业务、alive变false、ObjectPtr失效不是同一个瞬间。普通撤退栈返回后已完成即时回收，后继 Projectile 挂点检查会失败并使用记忆坐标；保底入口拒绝身份。

## 5. 尚未确认与边界

- 没有声称所有 Enemy 自定义退场、所有重生／假死、所有 GameMode 使用 DefaultGameMode 同一回收政策。
- 没有从“挂点还能读”推导其仍可普通索敌或接收伤害。
- 这一分支没有证明“空间不存在”都会破坏 MountPoint；暂时消失分支须由 root 对照 SetDisappeared 与具体状态补齐。
- 没有因 Target 身份失败添加通用 Projectile.Stop：已核实普通追踪会继续到保存落点／按运动自身规则到达停止。
