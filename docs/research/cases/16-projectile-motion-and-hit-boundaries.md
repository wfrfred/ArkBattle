# Projectile：运动与命中边界

研究日期：2026-10-21。项目对照为 `refactor/typescript-migration` 的 `c40d79b5`。本轮只确认运动、到达、命中与 Targeting 的关系，不确定新的 Definition、State 或公开操作，也不实施源码重构。

## 1. 证据与结论范围

依据本机 `GameAssembly.dll`、`global-metadata.dat` 及实际敌人、干员、共享弹道 Prefab。版本身份、完整原生指令及代表配置见 [证据清单](../evidence/projectile-boundaries-20261021/manifest.json)。本轮重新生成定位，不沿用旧文档的方法编号或地址。

- DLL SHA256：`583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`。
- Metadata SHA256：`d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。
- **直接证实**指编译后的原生分支与真实 Prefab 配置相互对应；没有执行客户端注入、录屏或审计本次运行中实际启用的 XLua 替换。
- **架构推导**与**尚未确认**分别标明，不能由组件名称推定完整游戏政策。

PRTS 的 [游戏数据基础：弹道](https://prts.wiki/w/游戏数据基础#弹道) 和 [弹道](https://prts.wiki/w/抛射物) 用于机制对照；运动、计时及命中资格的具体结论以本轮客户端执行链为依据。

## 2. A：共同生命周期，运动可组合，但会触发业务节点

**直接证实**：普通弹道共用 `Projectile` 的实例、时间、到达标记、停止状态和命中历史。`BasicMovement` 继承 `Projectile.Behaviour`，`HitBehaviour` 是另一个独立 Behaviour。实际 `SimpleProjectile` 可以分别组合直线、抛物线和阿米娅专用运动，不需要每种运动重新实现整个 Projectile 生命周期。

关键执行链：

```text
Projectile._InitInline
  初始化共用来源、目标、时间等
  对配置中的每个 Behaviour：Init(同一 Projectile)

Projectile.OnTick
  推进共用时间及根对象生命周期政策
  对配置中的每个 Behaviour：OnTick
    Movement 可以更新位置、报告 Reached 或调用 Stop
    命中 Behaviour 可以处理到达、碰撞或周期条件
```

| 事实 | 原生定位 |
| --- | --- |
| 获取并保存 Behaviour 数组 | `Projectile._InitBahavioursIfNot` [71395] `0x1808dbcd0` |
| 逐项初始化 | `Projectile._InitInline` [71334] `0x1808dbda0`，循环 `0x1808dc0de–0x1808dc16c` |
| Movement 登记到共用实例 | `BasicMovement.Init` [71209] `0x1808cb090`，写入 `Projectile.m_movement` |
| 逐项推进 | `Projectile.OnTick` [71344] `0x1808d9af0`，循环 `0x1808d9e36–0x1808d9f24` |
| 运行时切换 Movement | `GroupedMovement.OnTick` [86955] `0x180d69e50` → 控制器 → 当前子 Movement；`MovementSwitchController.SwitchMovementIndex` [87001] `0x180d72c30` |

`GroupedMovement` 会初始化多个子运动，随后每次只推进控制器选中的一个。切换不创建新的 Projectile，也不重新分配根实例的命中历史。这里有可替换运动的真实调用链，不只是字段推测。

但不能把原生解释为严格纯粹的“Movement 返回坐标，外层统一判断命中”：Movement 本身可以同步调用到达和停止；`HitBehaviour` 的某些配置也可以在接触目标时反向报告到达。原生不存在所有弹道统一先运动、再统一命中的两遍调度契约。

**架构推导**：需要保留运动进度、到达、目标命中、停止这些不同事实；不因此要求公开 `advanceMovement()` / `resolveHit()`，也不要求照搬 Unity 组件系统。

## 3. 定时命中：实际阿米娅配置

**直接证实**：真实 `char_002_amiya` 的普攻和二技能分别引用 `projectile_amiya`、`projectile_amiya_s2`。相应逻辑 Prefab 都是 `SimpleProjectile + Amiya*Movement + EffectBehaviour`，没有 `HitBehaviour`。两者都配置停止时尝试命中原目标；到达派发也可以调用同一个保底入口，不能理解为只允许停止时命中。具体到达／停止顺序见 [停止与终结调查](17-projectile-stop-and-termination.md)。

运动先执行启动散射阶段，然后设置固定剩余飞行时间；两段配置均约 0.15 秒，不能仅将其中一个数当作总飞行时间。后续运动按剩余距离和剩余时间调整速度：

```text
启动阶段结束：remainingTime = 配置的飞行时间
每次推进：
  根据当前目标位置 / remainingTime 计算速度并移动
  remainingTime -= dt
  remainingTime <= 0：
    普攻：Stop
    二技能：Reached → Stop

Reached / Stop 按配置进入 _DealHitTraceTarget
  → 命中仍然有效且存活的原目标，保底尝试标记及命中历史防止重复
```

定位：`AmiyaDefaultMovement.OnTick` [86796] `0x180d560f0`，计时停止调用 `0x180d5635d`；`AmiyaS2Movement.OnTick` [86805] `0x180d56ab0`，计时结束在 `0x180d56d43` 报告到达，随后 `0x180d56d4d` 停止。

因此，**计时分支的命中不以几何碰撞或视觉位置到达为必要条件**。但其运动算法同时在努力按时追到目标，不能将此夸大为“阿米娅通常会明显未到先中”。是否有特定正常场景出现肉眼可见的先命中后视觉抵达，本轮没有录制证明。二技能另有独立的身体正弦动画偏移，它也不参与命中资格。

## 4. B：四种实际存在的命中入口

| 代表 | 运动 / 触发 | 接收者来源与资格 |
| --- | --- | --- |
| 普通弩手 `enemy_1003_ncbow → projectile_crossbow` | 直线追踪；没有 HitBehaviour；到达派发及停止流程都可尝试原目标保底 | 保存的原目标身份，经有效性和存活检查；不重新普通索敌；后续入口防止重复 |
| 空爆 `char_282_catap → projectile_catap` | 抛物线；到达时执行范围 HitBehaviour | 当前落点周围的碰撞候选经 TargetOptions；另有独立原目标保底入口 |
| 实际能力 `sktok_crsbow → projectile_crsbow` | 按方向飞行，Trigger 沿途接触；不要求到达目的地 | 接触候选经存活、TargetOptions 及命中 Behaviour 自身政策 |
| `SelectorHitBehaviour` | 可由到达或周期条件触发 | 具体 Behaviour 调用 TargetSelector；不是 Projectile 根对象必经步骤 |

`projectile_crsbow` 与普通敌人使用的 `projectile_crossbow` 是不同资源。`[uc]skills.ab` 中实际 `sktok_crsbow` 的 MultiRangedAttack 明确引用前者，同对象有 AlwaysTrigger，允许无目标发动。Collider、Movement、HitBehaviour 和发射能力均有实际配置佐证；本轮没有扩查具体关卡摆放。

### 4.1 原目标直选

`Projectile._DealHitTraceTarget` [71375] `0x1808db940`：

```text
如果已经尝试过，或原目标身份无效 / 不再 alive：返回
登记本次原目标尝试
DealHitTarget(traceTarget, force=true)
```

`ValidAndAlive` 的闭合泛型体 `0x18449ab40` 检查 ObjectPtr，再调用 `Entity.alive`，不是只检查 Unity 对象非空。普通 `Entity.get_alive` [66349] `0x180701920` 要求状态机仍运行且 HP > 0；`Character.get_alive` [75822] `0x180a38df0` 还排除 dummy 和 dying 状态。

后续 `Projectile.DealHitTarget` [71347] `0x1808d6c40` **不重新检查阵营、原攻击射程、隐匿、迷彩或 Targetable 限制**。因此，存活原目标在飞行中脱离攻击范围、获得隐匿或迷彩，不会被这条直选路径再次按普通索敌条件拒绝。`force` 仍然受命中历史去重，不能解释成绕过全部规则。

命中随后进入内容动作与 Damage 接收。**保底命中不等于无视无敌或保证 HP 减少**。

### 4.2 到达范围与沿途碰撞

空爆的范围入口：

```text
OnProjectileReached
  → HitBehaviour.OnProjectileReached [86264] 0x180d34fc0
  → Box2dPhysicsUtil.FindTargets_DISPOSE [73944]
  → 当前重叠对象 + 存活 / TargetOptions
  → HitBehaviour.DealHitTarget [86266] 0x180d34840
  → Projectile.DealHitTarget
```

真实空爆配置忽略迷彩，但没有设置忽略 TargetFree。因此附加范围目标可以通过迷彩豁免，却仍受有效隐匿 / 禁选限制；原目标则另有直选资格。原目标已从范围命中时，命中历史防止保底入口再结算一次。不能给主目标与附加目标无条件套同一份 Filter。

沿途入口：

```text
HitBehaviour.OnTriggerEnter2D [86269] 0x180d358a0
  → TrigOrQueueFixedPtrEvent
  → _DoTargetEnter [86267] 0x180d35da0
  → 存活 / TargetOptions / Behaviour 自身资格
  → Projectile.DealHitTarget
```

这条入口不等待 Movement 到达。原生可能排队物理事件，不能据此规定 Stronghold 必须在 Unity Trigger 的原始调用栈同步执行。这个样例只有一次命中预算，也不足以定义所有穿透、多次命中和命中间隔政策。

### 4.3 谁调用 Targeting

`SelectorHitBehaviour._FindTargets_DISPOSE` [86507] `0x180d49d20` 在 `0x180d49de5` 调用 `TargetSelector.FindTargets_DISPOSE`。其他已核实入口分别使用原目标身份、空间重叠或接触对象，并不都调用 TargetSelector。

**架构推导**：Targeting 应由需要筛选接收者的具体命中行为使用；不应成为每个 Projectile 每 Tick 的统一必经步骤。是否通过项目现有 Targeting 组合空间候选，是后续设计选择，不是要求复刻原生 Selector 类。

## 5. 目标移动、死亡和离场必须分开

**直接证实**：`BasicMovement.GetTraceTargetMapPosition` [71223] `0x1808cafa0` 在目标挂点有效时读取实时坐标；挂点失效时返回最后保存的目标坐标。Advanced 追踪分支和 Paracurve 的 `_CalculateNextPosition` 都会刷新该样本。这些普通运动分支没有因为目标 HP 归零而统一停止。

| 变化 | 本轮可以确认 |
| --- | --- |
| 目标移动 | 追踪型运动更新目标位置；不代表所有运动都追踪 |
| 原目标获得隐匿 / 迷彩或离开原射程 | 原目标直选不重验这些索敌资格；附加候选按自身政策检查 |
| 原目标不再 alive 或身份引用失效 | 原目标保底命中拒绝；运动可继续到记忆落点 |
| 目标挂点失效 | 普通追踪 / 抛物线继续使用记忆坐标；不自动推导为整个弹道停止 |
| 标准路线暂时消失、普通撤退 | 已在 [来源与目标生命周期调查](18-projectile-source-and-target-lifecycles.md) 分开核对；暂时消失本身保留身份与挂点，普通撤退完成后身份失效 |

停止、消除与超时见 [停止与终结调查](17-projectile-stop-and-termination.md)，来源死亡／撤退及目标暂时消失见 [来源与目标生命周期调查](18-projectile-source-and-target-lifecycles.md)。本篇仅以必要停止分支说明运动与命中边界。

## 6. 当前 Stronghold 的实际差异

| 当前实现 | 已证实的语义缺口 |
| --- | --- |
| `settlement.ts` 固定按 speedPerTick 直线追踪 | 无法直接表达实际的抛物线、计时、环绕、固定方向等不同推进政策 |
| 只有到达后才调用 `contact()` | 缺少沿途命中、周期命中和独立计时命中入口 |
| 所有 contact 候选先做范围接触检查 | 普通锁定命中没有独立身份入口，隐含了并非通用的碰撞前提 |
| 停止只执行自定义 stop 回调 | stop 可以产生输出，但还没有表达实际样例中可复用的原目标保底与停止命中语义 |
| 弩手 `acceptsContact` 写死目标当前为 ALLY | 原生普通锁定命中未重新进行这项阵营判断；需要在 Projectile 重构中处理 |

本轮不据此增加通用字段或原生 flags。足够确定的边界是：**共享弹道生命周期；运动与命中可分别组织；到达、命中和停止不强绑定；命中资格由具体入口决定；Damage / Healing 仍负责其自身结算。**

详细分项记录：[运动调查](../evidence/projectile-boundaries-20261021/movement/REPORT.md)、[命中调查](../evidence/projectile-boundaries-20261021/hit/REPORT.md)、[实际配置](../evidence/projectile-boundaries-20261021/examples/REPORT.md)。
