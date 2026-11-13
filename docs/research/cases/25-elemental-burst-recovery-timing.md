# 元素爆发恢复：首次推进与宿主更新顺序

研究日期：2026-11-02；项目基线 `635617b`。2026-11-05 补核零时长参数进入 Buff 的启动、结束与子效果路径，项目基线 `2f8612d`。核对范围为官方 Windows IL2CPP 客户端普通 native 分支，没有运行完整游戏或核实活跃 XLua；不据此决定 Core 的调度或接口设计。

## 1. 问题与结论

**原生普通恢复入口没有“爆发创建当逻辑 Tick 一律不推进”的规则。** 爆发同步建立恢复状态；此后每次到达宿主的 `EPController.OnTick(deltaTime)`，都会按本次时间步长与当前恢复速度增加恢复进度，再判断是否结束。首次推进取决于爆发触发与该宿主更新的先后，不能统一推迟到下一 Tick。

| 问题 | 结论及证据边界 |
| --- | --- |
| 爆发是否只登记、等下一次更新才给予效果 | 否。EP 归零后同步进入 `OnElementBreak`，先创建爆发 Buff，再启动恢复。 |
| 是否保存创建 Tick 或上次恢复 Tick，以跳过创建当次更新 | 已展开的普通触发、启动与推进分支中没有这类字段或判断。控制器保存恢复总量与已恢复进度。 |
| 一次恢复调用如何处理预算 | 先执行 `elapsed += deltaTime × 当前恢复速度`，再与总预算比较；本次达到预算就结束，不额外等待一次更新。 |
| 能否断言所有爆发都在触发当帧推进 | 不能。若触发先于该宿主尚未执行的恢复调用，且后续仍到达该调用，当次即可推进；若触发在它之后，则等下一次调用。这是调用链的条件性推断，不是实机逐帧观测。 |
| 冷却期间真实 EP 是否一直为零 | 否。启动时先清零；未到期的恢复调用按当前最大 EP 与恢复比例写回全部 EP，到期时写满并解除恢复状态。 |
| 零时长是否跳过所有爆发效果 | 不能这样归纳。有限零寿命 Buff 仍运行开始、结束动作，但跳过自身普通启用和 Tick；开始动作创建的子 Buff 按各自时长与派生关系处理。见下文零参数补查。 |

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

### N／I：零时长参数进入 Buff 后仍可执行开始动作

2026-11-05 复核的 DLL／metadata 指纹与上述批次相同。新指令、字段、当前本机模板及独立来源的固定 BuffDB 镜像摘录见[零参数取证批次](../evidence/elemental-zero-duration-20261105/README.md)。以下是给定零参数时的静态路径，不表示已发现正式的零秒标准爆发配置。

控制器从 `EPBreakBuffData.elementBreakDuration` 或 `enemyElementBreakDuration` 选择时长；同一值先用于 `_CreateBrokenBuff` 的黑板参数，再传给 `_StartEPRecovery`。恢复速度只在后续推进时读取，不参与将初始预算计算成零。

对于已初始化宿主、允许安装且开始程序不重写自身寿命的普通路径：

```text
LIMITED + duration = 0
→ Buff.Reset 保留零寿命
→ OnStart 执行 event0，再设置 started
→ NewBuff 检查到 started 且 lifeTime 为零
→ 同步结束并移除该 Buff，执行结束程序
→ 跳过该 Buff 自身的普通启用与 Tick
```

直接证据保存在 [Buff 指令与结论](../evidence/elemental-zero-duration-20261105/buff/findings.json)：

- `Reset` 66092 在 `0x1806d647d–0x1806d6530` 读取寿命；类型转换 helper `0x184741640` 对 LIMITED 保留输入值，不把配置中的 LifeType 枚举改成 IMMEDIATELY。
- `OnStart` 66123 在 `0x1806d5035` 运行 event0，再于 `0x1806d503c` 设置 started。`get_isFinished` 66080 判断显式结束，或 started 且 `MathUtil.IsZero(m_lifeTime)`。
- `NewBuff` 66301 先在 `0x1806b6fe5` 调用 OnStart，再于 `0x1806b705f` 检查结束，零寿命分支于 `0x1806b707e` 进入结束移除；普通启用入口在其后的 `0x1806b70ac`。
- 该根 Buff 的属性／异常登记及 OnEnable 动作不执行，也没有对应的 OnDisable 转移；开始、结束动作仍可执行。动作自身的目标资格和条件仍独立决定其业务结果，执行程序不等于伤害一定被接收。

开始动作创建子 Buff 时，`CreateBuff.Execute` 98388 先完整安装子 Buff（`0x1810bf8d9`），再登记派生关系（`0x1810bf911`）。因此：

- 有独立非零或无限寿命的子 Buff 可以执行自己的开始、启用程序，甚至先产生属性、异常或伤害输出。
- 已登记、配置随父结束的派生子 Buff 在父收尾时被标记结束；此前已经完成的业务不回滚。非派生子 Buff 不因这条父子关系自动结束。
- `firstTriggerInterval = 0` 只初始化计时器，不等于安装时执行一次周期动作。普通周期输出由后续 OnTick 触发；内容显式触发属于另一条路径。

### D／I：标准模板中的即时、独立与派生效果

当前本机 Holder 的开始动作与父子标记见[模板摘录](../evidence/elemental-zero-duration-20261105/templates/selected-templates.json)；LifeType、持续时间键和数值另来自[固定提取镜像](../evidence/elemental-zero-duration-20261105/templates/buffdb-mirror.json)，两种来源分开登记。

| 选定模板路径 | 可区分零参数后果的事实 |
| --- | --- |
| 神经 → Character | 开始动作安装非派生 stun，再发起真实伤害；执行子 Buff 本来就是 IMMEDIATELY，stun 自己读取 `stun=10`，不读取根的 `ep_break_duration`。零恢复预算不能直接推出眩晕也是零秒。 |
| 神经 → Enemy | 开始动作创建独立麻痹层，再发起元素 HP 伤害；麻痹有自己的无限寿命与消费机制。 |
| 侵蚀 → Character | 开始动作先安装非派生无限期减防，再发起物理伤害；清理零寿命父 Buff 不自动撤销该永久减防。 |
| 侵蚀 → Enemy | 执行 Buff 自身无限期、非派生，开始时发起元素 HP 伤害，并提供自己的减防属性。 |
| 灼燃 | 即时伤害位于开始动作；减抗属于派生效果。子 Buff 完整安装早于父子关系登记，因此可能先以减抗后的属性结算即时伤害，再随零寿命父清理。 |
| 凋亡 | 开始时创建 SP、攻击力修正和周期伤害子项；数值型周期输出位于 event2。子项可能短暂启用，但零父立即清理不为周期动作补发一次；Enemy 攻击力恢复另有 `duration=15` 参数。 |

这些模板的派生项明确声明随父结束；所选 19 个模板没有 event70／79 监听。上表是在选定模板与固定镜像配置下，结合普通引擎指令推导的结果，没有运行零时长实机实验，也未穷尽各动作内部的所有条件。

恢复控制器的零预算收尾不是统一的子 Buff 析构入口。`set_isInBreakRecovery(false)` 发出结束前／后事件（79／70）、移除自身属性修饰并清空追踪列表，没有按该列表逐个 MarkFinish。列表另用于同步缩短 Buff 剩余时间；具体 Buff 仍按自身寿命、派生关系或内容事件结束。见[控制器收尾证据](../evidence/elemental-zero-duration-20261105/controller/controller-findings.json)。

## 4. 未决项

- 未运行完整客户端或做实机逐帧观测；静态分支的条件性结论不代表具体战斗中的每次爆发都在触发当 Tick 推进。
- 方法存在 XLua 分派入口，未核实当前运行环境的热更 delegate，结论限定无对应覆盖的普通 native 分支。
- 没有在本轮穷尽特殊单位、强制 EP 写入或全部爆发 Buff 的内容程序，也不据此宣称全部元素机制已核实。
- 零参数补查已展开 Buff 安装、开始、启用、结束和派生创建链；没有穷尽动作执行器的全部节点或活跃 XLua 覆盖，不能把开始程序可执行概括成所有业务效果必然成功。
- 尚未找到初始时长为零的正式标准爆发配置；本机 `EPBreakBuffData.elementBuffs` 到所列四个根模板键的全局配置选择尚未独立定位。当前 Holder 内部的 Character／Enemy 子模板绑定已核对，BuffDB 数值来自单独注明版本与哈希的第三方提取镜像。
- 未以固定 30 Hz 数值模拟证明客户端 FP 舍入、持续输出次数与项目逐 Tick 结果完全等价。

## 5. 项目关联

项目采用固定步长调度：Elemental 阶段只处理无 Burst 时的自然回复，每次恢复 `当前 recoverySpeed / TICKS_PER_SECOND`。标准 Burst 使用 Effect 的 DURATION Expiration，rate 为 0，由 onTick 按当前 `burstRecoverySpeed` 扣减唯一的 remaining；已推进量由 `duration - remaining` 得到。时间接口见 [Effect 契约](../../architecture/effect.md#6-时间推进)。执行到实例时使用当前状态，阶段之前创建的可以参与本次推进，阶段之后创建的等下一次候选；不设置统一的创建 Tick 跳过规则。

该选择忽略原生逐宿主更新与项目全场阶段之间的帧内微时序差异，不追求每个触发入口的首帧映射。固定步长与首次参与由调度契约决定，Elemental State 不保存上次推进时点。它是项目工程取舍，不将原生的条件性调用顺序改写为全场统一阶段。

标准 Burst Effect 使用同一有效进度确定恢复比例、周期输出和属性恢复，不另保存周期时钟。每次推进结算跨过的周期边界，自然预算耗尽时先完成预算内最后一次输出，再结束实例；取消、提前 finish 和宿主离场不补未来输出。这保留周期输出完整性，不增加原生首帧规则。

恢复期间按原生已确认的恢复比例逐步写回四型真实 EP，在项目的时间表示中为 `当前有效 MaxEP × (duration - remaining) / duration`；结束时写满并清空 Burst 引用。Burst 槽位存在期间仍拒绝新的 EP 损伤与显式回复；不能以准入受限为由把恢复中的真实 EP 一直保留为零。

零预算处理与标准效果的全部持续时间不能直接等同。项目的标准 Burst 在 onInstall 中登记创建事实并执行一次性爆发业务，随后由通用 Effect 安装流程检查时间；零预算不进入根实例的 onEnable 或 onTick，而是请求正常结束。独立眩晕使用自己的期限，永久减防和麻痹保留独立生命周期，需要随根结束的产物通过 Lifetime 绑定。资源 damaged 通知安排在这些同步安装业务之后。这是结合上述证据明确的项目契约，不将一个恢复预算机械套用到全部子效果，也不宣称完整复刻所有原生模板与热更时序。
