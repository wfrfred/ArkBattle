# 元素爆发恢复：首次推进与宿主更新顺序

研究日期：2026-11-02；项目基线 `635617b`。本轮核对官方 Windows IL2CPP 客户端普通 native 分支，没有运行完整游戏或核实活跃 XLua。研究问题限于元素爆发的恢复预算何时首次推进，不据此决定 Core 的调度设计。

## 1. 问题与结论

**原生普通恢复入口没有“爆发创建当逻辑 Tick 一律不推进”的规则。** 爆发同步建立恢复状态；此后每次到达宿主的 `EPController.OnTick(deltaTime)`，都会按本次时间步长与当前恢复速度增加恢复进度，再判断是否结束。首次推进取决于爆发触发与该宿主更新的先后，不能统一推迟到下一 Tick。

| 问题 | 结论及证据边界 |
| --- | --- |
| 爆发是否只登记、等下一次更新才给予效果 | 否。EP 归零后同步进入 `OnElementBreak`，先创建爆发 Buff，再启动恢复。 |
| 是否保存创建 Tick 或上次恢复 Tick，以跳过创建当次更新 | 已展开的普通触发、启动与推进分支中没有这类字段或判断。控制器保存恢复总量与已恢复进度。 |
| 一次恢复调用如何处理预算 | 先执行 `elapsed += deltaTime × 当前恢复速度`，再与总预算比较；本次达到预算就结束，不额外等待一次更新。 |
| 能否断言所有爆发都在触发当帧推进 | 不能。若触发先于该宿主尚未执行的恢复调用，且后续仍到达该调用，当次即可推进；若触发在它之后，则等下一次调用。这是调用链的条件性推断，不是实机逐帧观测。 |
| 冷却期间真实 EP 是否一直为零 | 否。启动时先清零；未到期的恢复调用按当前最大 EP 与恢复比例写回全部 EP，到期时写满并解除恢复状态。 |

“持续 N Tick”这一离散计时直觉不能证明原生统一跳过创建 Tick。项目若采用固定的首 Tick 政策，须作为独立工程选择明确评估。

## 2. 资料与取证范围

### 元素损伤与元素伤害的术语边界

2026-11-04 对照公开游戏文本数据镜像：纯烬艾雅法拉的回复描述使用 `<$ba.dt.element>Elemental Injury</>`，对应元素损伤与 EP；逻各斯模组在坏死爆发期间追加的 `Elemental Damage` 对应元素 HP 伤害。来源为 [纯烬艾雅法拉 Reference Data](https://closure.wiki/operators/eyjafjalla-the-hvit-aska)和 [逻各斯 Reference Data](https://closure.wiki/operators/logos)中的游戏表文本，网站属于社区镜像，不标为官方文档，也不据此推导 native 调用顺序。

这两个概念在项目命名中必须区分。EP 损伤的英文语义是 Elemental Injury；HP 的 ELEMENTAL 是 DamageType。旧标识中的 ELEMENT_DAMAGE 不能作为二者同义的依据。

### 恢复时序资料

2026-11-02 查阅 PRTS：

- [元素·元素损伤爆发](https://prts.wiki/index.php?title=元素&oldid=447011)：该版条目参考客户端 2.7.91，说明 EP 归零、立即给予效果、进入冷却及结束后恢复全部 EP；没有说明首次恢复调用或统一跳过创建帧。
- [元素·攻击附带的元素损伤](https://prts.wiki/index.php?title=元素&oldid=447011#攻击附带的元素损伤)：区分通常随攻击伤害之后施加，以及部分 Buff 路径先施加的情况，章节仍标注待补充；不能由此推定恢复更新的全局位置。
- [数值范围·基本属性](https://prts.wiki/index.php?title=数值范围&oldid=444062)：`EP_BREAK_RECOVER_SPEED` 为属性 35，默认值 1、默认下限 0，影响爆发恢复速度；没有首帧说明。

PRTS 是社区资料。其信息不足以闭合时序问题，因此继续调查客户端。网页定位、查阅日期与未回答范围保存在 [prts-sources.json](../evidence/elemental-timing-20261102/prts-sources.json)。

本轮客户端指纹为 DLL `cf7956bf…cf76ff`、metadata `e58fb854…f9caa5`，metadata v29；完整指纹、工具身份及复跑命令见[批次 README](../evidence/elemental-timing-20261102/README.md)。下列方法编号和地址只适用于该输入，不沿用旧版元素证据的编号。

## 3. 原生证据

### N：EP 归零后同步触发并启动恢复

[schedule-native.json](../evidence/elemental-timing-20261102/schedule-native.json) 中，`Entity.SetEpInternal` 67630（`0x18072e010`）写入本型 EP；相关耗尽分支在 `0x18072e2f2` 同步调用 `EPController.OnElementBreak` 67763。普通 Modifier 入口经 `DoApplyModifier`／`_DoApplyEPModifierInternal` 到达 EP 写入，触发并非一个统一延迟到下帧的队列任务。

[ep-native.json](../evidence/elemental-timing-20261102/ep-native.json) 展开 `OnElementBreak`（`0x18074e080`）及其全部相关 native 方法：`0x18074e2b7` 调用 `_CreateBrokenBuff` 67761，随后 `0x18074e2c5` 调用 `_StartEPRecovery` 67762。这支持“爆发业务立即开始，恢复状态随后建立”的普通调用顺序。

`_StartEPRecovery`（`0x18074ef70`）依次：

1. `0x18074efef` 将本次时长转换后的 FP 写入 `m_epRecoverTotal`（实例 `+0x30`）。
2. `0x18074effd` 将 FP(0) 写入 `m_epRecoverElapsed`（`+0x38`）。
3. `0x18074f006` 设置 `m_isInBreakRecovery`，随后 `0x18074f02d` 调用 `SetAllEpInternal(0, true)`。
4. 总预算非正的分支同步写满全部 EP 并解除恢复状态，不要求等待下一次 `OnTick`。

完整控制器字段与方法签名见 [ep-controller.json](../evidence/elemental-timing-20261102/ep-controller.json)。实例字段没有记录创建 Tick 或最近推进 Tick；所列 `__Hotfix...` 字段属于静态热更槽，不能当作实例时钟。

### N：每次调用先推进，再判断结束

`EPController.OnTick` 67758（`0x18074e490`）在恢复已启用且总预算为正时，按以下顺序执行：

- `0x18074e587`：读取宿主当前 `epBreakRecoverSpeed`。
- `0x18074e5ad`：计算本次 `deltaTime × speed`。
- `0x18074e5bb`／`0x18074e5ca`：与已有进度相加并写回 `m_epRecoverElapsed`。
- `0x18074e5ce`：以更新后的进度比较总预算。

这条普通分支没有按创建帧或最近推进时点跳过本次调用。其核心关系为：

```text
elapsed' = elapsed + deltaTime × currentRecoverySpeed

elapsed' < total:
    allEP = currentMaxEP × elapsed' / total

elapsed' >= total:
    allEP = currentMaxEP
    清除恢复预算与进度
    解除恢复状态
```

未到期分支在 `0x18074e61a` 除以总预算、`0x18074e628` 乘最大 EP、`0x18074e639` 写入全部 EP；到期分支在 `0x18074e673` 写满，随后清计时字段并解除恢复。速度为零时正预算不再增加，后续调用重新读取速度。

最大 EP 的调用身份已独立闭合：[maxep-helper.json](../evidence/elemental-timing-20261102/maxep-helper.json) 中 `0x180005610` 按传入 slot 派发虚调用，调用者传 `0x50` 即 slot 80；当前 metadata 的 `Entity.get_maxEp` 为方法 67451、slot 80。对应 vtable 项为对象 class 的 `0x140 + 80 × 16 = 0x640`，与启动非正预算分支的直接虚调用位置一致。上述比例写回不是仅凭 helper 地址猜测字段含义。

### N／I：首次推进由宿主调用顺序决定

[schedule-native.json](../evidence/elemental-timing-20261102/schedule-native.json) 保存当前版本的全局更新、逐对象派发、宿主更新和 EP Modifier 短链。`ObjectManager.OnFixedUpdate` 72254（`0x180913830`）逐对象经虚 slot 27 派发普通 `OnTick`。

当前版本的派生调用链也已重新核对：`Character.OnTick` 77329 在 `0x180aa45f3`、`Enemy.OnTick` 77845 在 `0x180ac0a3b` 调用 `Unit.OnTick` 79025，后者在 `0x180b1a69b` 调用 `Entity.OnTick` 67697。它们的 metadata slot 均为 27，结论不依赖旧版派生链或仅凭虚表位移命名。

`Entity.OnTick` 67697（`0x18072c290`）内部已核对的顺序为：

```text
自身状态机推进
→ BuffContainer.Tick
→ 普通 EP 自然恢复
→ SP 更新
→ EPController.OnTick
```

对应调用位置依次为 `0x18072c348`、`0x18072c369`、`0x18072c3b4`、`0x18072c3cf` 和 `0x18072c3ea`。元素恢复随宿主推进，不是所有对象完成业务之后再统一执行的一轮独立全场恢复。

由同步触发与上述更新方式可推导：

- 某次爆发若已在宿主本次 `EPController.OnTick` 之前触发，且后续仍执行到恢复调用，该调用直接使用刚建立的恢复状态，首个 `deltaTime × speed` 可以发生在同一逻辑 Tick。
- 若爆发在宿主本次恢复调用之后才触发，则首次推进留到下一次宿主恢复调用。

这里的“之前／之后”是该宿主的实际调用顺序，不是渲染帧编号，也没有证明每个内容实例都走同一种相位。条件性结论不依赖 ArkBattle 的现有阶段或人工跳 Tick 测试。

## 4. 未决项

- 未运行完整客户端或做实机逐帧观测；静态分支的条件性结论不代表具体战斗中的每次爆发都在触发当 Tick 推进。
- 方法存在 XLua 分派入口，未核实当前运行环境的热更 delegate，结论限定无对应覆盖的普通 native 分支。
- 没有在本轮穷尽特殊单位、强制 EP 写入或全部爆发 Buff 的内容程序，也不据此宣称全部元素机制已核实。
- 相关 Buff 更新已追至 `_RunActionsCore` 对 `ActionUtil.RunActions` 的调用，未展开该执行器内部。元素动作节点到 EP 耗尽的同步链单独成立，但没有据此认定某个具体 Buff 模板必然在触发当 Tick 输出。
- 未以固定 30 Hz 数值模拟证明客户端 FP 舍入、持续输出次数与项目逐 Tick 结果完全等价。

## 5. 项目关联

项目采用固定步长调度：Elemental 阶段只处理无 Burst 时的自然回复，每次恢复 `当前 recoverySpeed / TICKS_PER_SECOND`。Burst 由标准 Effect 的 onTick 推进，每次将当前 `burstRecoverySpeed` 累加到唯一有效进度。执行到实例时使用当前状态，阶段之前创建的可以参与本次推进，阶段之后创建的等下一次候选；不设置统一的创建 Tick 跳过规则。

该选择忽略原生逐宿主更新与项目全场阶段之间的帧内微时序差异，不追求每个触发入口的首帧映射。固定步长与首次参与由调度契约决定，Elemental State 不保存上次推进时点。它是项目工程取舍，不将原生的条件性调用顺序改写为全场统一阶段。

标准 Burst Effect 使用同一有效进度确定恢复比例、周期输出和属性恢复，不另保存周期时钟。每次推进结算跨过的周期边界，自然预算耗尽时先完成预算内最后一次输出，再结束实例；取消、提前 finish 和宿主离场不补未来输出。这保留周期输出完整性，不增加原生首帧规则。

恢复期间按原生已确认的公式逐步写回四型真实 EP：`当前有效 MaxEP × elapsed / total`，结束时写满并清空 Burst 引用。Burst 槽位存在期间仍拒绝新的 EP 损伤与显式回复；不能以准入受限为由把恢复中的真实 EP 一直保留为零。
