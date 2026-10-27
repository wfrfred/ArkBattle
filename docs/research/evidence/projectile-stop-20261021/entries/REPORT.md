# Projectile Stop 入口与命中政策

日期：2026-10-21。仅研究停止/终结入口；不研究来源或目标离场，不修改项目源码。原生 DLL 与 Metadata SHA256 同 `docs/tactical-research/evidence/projectile-boundaries-20261021/manifest.json`。本报告读取当前本机原生代码；未执行客户端注入或审计活跃 XLua 替换。

## 核心结论

**直接证实：普通 Stop 没有停止原因参数，多个入口共享一个 StopMe；但消除弹道另有 TryEliminate，先标记 eliminated，因此并非所有终结都执行相同的末尾保底命中。**

同一个 `SimpleProjectile`（例如实际 `projectile_crossbow_logic`：`_alwaysHitTraceTargetInTheEnd=1`、`_alwaysReachInTheEnd=0`、寿命5秒），在原目标仍有效存活且未命中的前提下：

| 入口 | 最终调用 | 是否尝试根对象原目标保底命中 |
| --- | --- | --- |
| AdvancedMovement 正常抵达，无到达后延迟 | Behaviour.Stop → StopMe | 是 |
| 外部 Interrupt | StopMe | 是 |
| FriendComponent.StopProjectile | StopMe | 是 |
| RangedAttack.ClearProjectile | Interrupt → StopMe | 是 |
| 普通逻辑弹道寿命耗尽 | OnTick → ExtraCheckToFinish → StopMe | 是 |
| RecycleSelfImmediately | StopMe | 是，名字不表示静默回收 |
| BattleController._ClearResourcesInHolder 中的弹道回收 | RecycleSelfImmediately → StopMe | 是；这里只确认入口，不宣称战斗退出过程中一定产生可观察伤害 |
| 成功 TryEliminate（实际逻各斯三技能结束清弹） | eliminated=true → StopMe | **跳过根对象末尾保底命中及 alwaysReachInTheEnd** |
| TryEliminate 但 eliminatable=false | 返回false，不Stop | 无停止/命中 |

表格中的“是”表示尝试该入口，仍需通过 `_DealHitTraceTarget` 的有效/存活/已经尝试检查及 `DealHitTarget` 命中历史政策；不等于保证造成HP伤害。TryEliminate 跳过根对象这两个收尾入口，但仍派发 ActionController/Behaviour.OnProjectileStop，因此不能由此推导所有 Content 停止回调都绝对没有输出。

## 1. 共用停止操作

`Projectile.StopMe [71373] @0x1808daf40` 没有参数：

```text
if m_isStopped: return
m_isStopped = true
virtual OnProjectileStop()
BObject.DestroyMe()
```

- `0x1808daf7f–0x1808daf87`：重复停止保护，先设置 `m_isStopped`。
- `0x1808dafb2`：调用虚拟 `OnProjectileStop`（slot53）。
- `0x1808dafbe`：尾调用 `BObject.DestroyMe [65032]`。

停止前先标记 stopped，能防止停止期间命中触发再次Stop而重复进入停止流程。这里不存在按调用来源分支的 stop reason。

`Projectile.Interrupt [71338] @0x1808d8ab0`、`Projectile.RecycleSelfImmediately [71374] @0x1808da060`、`Projectile.Behaviour.Stop [71422] @0x1808ce920`、`FriendComponent.StopProjectile [71399] @0x1808d0ca0` 的非XLua路径都直接调用/尾调 `StopMe`，没有预先设置 eliminated。

## 2. 停止时为何可能发生新命中

`Projectile.OnProjectileStop [71361] @0x1808d97d0`：

```text
if !m_isEliminated:
    if alwaysHitTraceTargetInTheEnd:
        _DealHitTraceTarget()
    if alwaysReachInTheEnd:
        OnProjectileReached()
ActionController.OnProjectileStop()
for each Behaviour:
    Behaviour.OnProjectileStop()
finish stop-follow effects
ClearMainEffectIfNot()
play stop audio
```

- `0x1808d982b` 检查偏移 `0xa5 = m_isEliminated`；真时跳到 `0x1808d989c`，越过两项末尾业务。
- `0x1808d9849` 读取虚拟属性slot43 `alwaysHitTraceTargetInTheEnd`；`0x1808d9862` 调 `_DealHitTraceTarget`。
- `0x1808d987e` 读取slot45 `alwaysReachInTheEnd`；`0x1808d9897` 调 `OnProjectileReached`。
- ActionController 通知 `0x1808d98bd` 与 Behaviour 通知循环 `0x1808d98e0–0x1808d994a` 在上述分支之后，无 eliminated 总体跳过。

`SimpleProjectile.get_alwaysHitTraceTargetInTheEnd [71473]` 直接读取Definition序列化字段偏移 `0x1b3`，不是根据停止来源动态计算。

`_DealHitTraceTarget [71375] @0x1808db940`：先检查 `m_hasHitTraceTarget`，再 `ValidAndAlive(traceTarget)`，登记 `m_hasHitTraceTarget=true` 后调用 `DealHitTarget(traceTarget, force=true)`。本轮不重做前一轮的目标资格调查。

## 3. 正常抵达与寿命耗尽

`AdvancedMovement.DoCheckReached [86735] @0x180d522b0`：

- `0x180d52310` 先调用 `BasicMovement.CheckReached [71221]`。
- 若未配置保留到达后的存活时间，`0x180d52410` 尾调用 `Behaviour.Stop`。
- 配置延迟的分支会 `EnsureLifeTime` / `_UpdateAfterReach`；延迟详细语义由另一个分项调查处理，不能与调用 Stop 后延迟销毁混为一谈。

`Projectile.OnTick [71344] @0x1808d9af0`：

```text
if stopped: return
currentTime += dt * projectileTimeScale
if currentTime >= lifeTime:
    if movement is absent or !movement.followsLogicProjectile:
        if ExtraCheckToFinish():
            StopMe()
            return
... otherwise continue behaviours ...
```

- `0x1808d9d46` 是 `FP.op_GreaterThanOrEqual [220483]`，比较最新 currentTime 与 `m_lifeTime`。
- `0x1808d9d73` 检查 `m_movement`，非空时 `0x1808d9d91` 通过生成的虚调用辅助函数调用slot17 `BasicMovement.get_followsLogicProjectile [71200]`。
- 普通 `BasicMovement.get_followsLogicProjectile [71200] @0x1808cdab0` 固定false，AdvancedMovement未覆写；BouncedAdvancedMovement存在专门覆写，本轮不将所有图形追随组件概括为统一timeout政策。
- `0x1808d9e0b` 为slot46 `ExtraCheckToFinish`；基础实现 `[71346] @0x1808d4d70` 固定true。
- `0x1808d9e16` 调StopMe，没有设置eliminated。

因此普通逻辑弩箭即使通过超时结束，也采用同一末尾命中政策，而不是只有正常几何抵达才尝试原目标命中。

## 4. 真正的外部消除入口

`Projectile.TryEliminate [71340] @0x1808db100`：

```text
if !eliminatable: return false
m_isEliminated = true
StopMe()
return true
```

关键指令 `0x1808db18e` 写 `m_isEliminated`，`0x1808db198` 调StopMe。

已验证实际调用者：

1. `EliminateProjectileAbility.OnCastOnProjectile [91088] @0x180eb8840`：`0x180eb889c` 直接调用输入弹道的 TryEliminate。
2. `ProjectileProbElimateBehaviour._DoElimateProjectile [94825] @0x180fac6d0`：`0x180fac782` 调TryEliminate，成功后才播放对应消除音效/表现。
3. `ElimateProjectileByExitRangeTime.OnTick [94736] @0x180fa5a80`：`0x180fa61b5` 对满足离开范围时间的候选调用TryEliminate。

**真实Content闭合案例**：`charpack/char_4133_logos.ab` 的 `char_4133_logos/Modes/S3_End/Body/Attack` 是 `EliminateProjectileAbility`；配置 `_animKey="Skill_3_End"`，Selector为 `AdvancedProjectileSelector`，不是仅凭方法名字推断逻各斯清弹。序列化对象、资源SHA256和选择器见 `logos-elimination-components.json`，完整提取 `logos.json`。

相反，`RangedAttack.ClearProjectile [90823] @0x180ec2f00` 对当前有效弹道在 `0x180ec303a` 调 `Interrupt`，不是TryEliminate。因此不能把“外部主动清理”当成一个必然不命中的单一类别；实际入口不同。

## 5. 已确认的其他清理链与范围限制

`BattleController._ClearResourcesInHolder [64795] @0x180635bc0` 在读取 `BattleFactory.projectileFolder` 的弹道组件快照后，逐项 `0x180635dab` 调 `RecycleSelfImmediately`，后者仍走StopMe。没有在这条调用上发现 eliminated 预标记。

本轮未穷举所有 BattleFactory/PoolManager 的强制释放入口，所以不声称“客户端所有销毁都必须通过Stop”。`DestroyMe` 的具体同步回收与对象失效由停止顺序分项报告核对。这里只能确认以上列出的入口，并且“RecycleSelfImmediately”不能直接翻译成静默丢弃。

## 证据工具

- `extract.py` 按方法ID生成必要asm；`xrefs.py` 扫描 `.text` 和 `il2cpp` 段的直接call/jmp后人工展开相关方法验证，`xrefs.json` 保存命中定位；未把原始字节扫描本身视为业务证据。
- `.asm` 全部来自当前本地DLL，以metadata编号+VA定位。各Hotfix分支保留在asm中，报告描述非XLua原生实现路径。
