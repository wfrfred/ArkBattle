# Tactical runtime protocol

> 本文仍含重构前的 EffectProgram、Binding、CombatWork、EffectSource 与 finalize 协议。Effect、Hook、Contribution 和 Aura 的当前设计以 [Effect 设计](../architecture/effect.md)及[总体架构](../architecture/ARCHITECTURE.md)为准；下文对应的旧接口与文件链接仅供历史核对，不能据此恢复已删除的机制。

> 2026-10-17：Damage／Healing 已迁到 battle 下的两阶段操作。下文第 6 节的旧 Healing 接收政策与原始字段适配已由 [Healing 项目政策](../architecture/vitality.md#4-healing-的两阶段契约)替代：healFree 只限制目标选择，显式 Ref 治疗不检查该限制，旧 ignoreHealFree／skipModifierEvents 请求及适配器已删除。历史客户端事实继续保留，不作为当前 Core 接口要求。

本文规定当前 Core 的同步交战、Effect 生命周期、Action／Projectile 过程及调用期可见性。它描述项目已实现的有限协议，不把当前阶段顺序推广为官方所有攻击、回复和死亡路径。兼容验收采用[模拟原则](00-INDEX.md)：保持项目确定性与重要玩法语义，允许不造成可察觉差异、重要离散结果变化或显著累计数值偏差的帧率／微时序近似。

## 1. 事实、资源与执行作用域

| 内容 | 归属 |
| --- | --- |
| Unit、HP、Effect 身份与状态、父关系、领域贡献、身份分配进度 | 权威运行事实；完成的 transition 立即成为当前工作状态 |
| EffectProgram、领域 hook、贡献求值函数及注册表 | 可重建 Resources；不捕获上一次的 HP、位置或实例状态 |
| 活跃事件的候选身份、已进入 callback 的实例暂存 | 同步执行 scope；正常／异常退出都释放，不进入 snapshot |

[CombatWork](../../src/core/battle/execution/work.ts) 组织当前交战事实与结果；[EffectDispatchScope](../../src/core/unit/capability/effects/dispatch.ts) 组织调用期范围。两者不代替 Blocking 等领域已经选择的阶段基线。

## 2. 内容的组合登记

[CombatResources.registerEffect](../../src/core/battle/resources.ts) 接收领域 facets：

```typescript
resources.registerEffect(program, {
    contributions,
    bindings,
    damage,
    healing,
    lifecycle,
});
```

所有字段都可省略。`resources.registerEffect(program)` 合法：实例可以没有贡献、接收 hook 或生命周期动作；领域登记缺席表示没有该领域行为。

登记发生在资源构建期间。Binding registry 在登记时取得数组和操作描述对象的所有权，复制并冻结这两层结构；函数引用共享，函数捕获的配置仍须不可变。底层 program registry 允许同一个 program 对象重复登记；相同 ref 不允许替换已有 program 描述。组合入口仍按各领域的重复登记政策拒绝再次登记。

Program registry 也取得行为描述的所有权，复制并冻结 initialize／ownState 的函数引用，返回自己的描述对象；来源对象和返回对象均可作为同一次底层重复登记的身份。程序 ref 保留原身份，必须不可变，通常来自 createEffectProgram。调用方随后修改来源描述，不改变已经登记的规则。Binding 编译器同样捕获配置值，不保留调用方可变的配置对象。

组合登记失败后，整份资源构建结果失效，必须重新构建；已完成的部分登记不原地回滚，也不允许继续读取、登记或交付。`BattleRuntime` 创建系统时关闭整份资源图的登记入口，包括各领域 registry。关闭后仍可读取规则、创建实例与延迟编译 Action；延迟编译不得登记新规则。战斗中的实例安装不属于程序登记。

这是组合层向各领域登记的入口。[EffectProgram](../../src/core/unit/capability/effects/program.ts) 仅定义程序身份、状态初始化及状态取得所有权，不追加一套包办所有 subsystem 的行为槽位。Damage、Healing、Status 等继续拥有自身契约；同一实例可以同时具有多个 facet。

## 3. Effect 生命周期与父关系

[公开生命周期操作](../../src/core/unit/capability/effects/lifecycle.ts) 统一维护实例及领域 bindings。内容程序只获得明确的 [Effect operations](../../src/core/unit/capability/effects/contract.ts)，不能直接增删实例数组。Status 通过 [自身 binding](../../src/core/unit/capability/status/binding.ts) 接入。

| 转换 | 完成后的事实 |
| --- | --- |
| 安装 | 先清理接收者的 finished 实例；登记新身份，执行 start，再安装 bindings、判断 admission、开始参与 |
| 当前参与变化 | 实例参与事实和领域 bindings 同步变化；停止参与保留载荷，恢复不自动重新采样 |
| 状态更新 | 实例载荷及已安装的领域投影同步更新 |
| finish | 先在同一 Unit transition 更新 finished、停止参与及 bindings，再执行相应 disable，父回调返回后同步向精确父身份的子实例传播 |
| finalize | 先移除登记身份，再执行结束动作并清理 bindings；子实例由自身接收者独立清理 |

自动安装在清理连锁完成后读取最新身份计数器，避免 ON_FINISH 嵌套安装后复用 ID。安装拒绝是正常结果，保留已完成的 start 前缀和身份进度。

start 已结束实例时，安装直接 finalize 并返回 `START_FINISHED`，不初始化或移除尚未安装的 bindings；`started` 保持 false，表示安装尚未进入绑定初始化阶段。普通 admission 拒绝仍清理已经安装的 bindings。

终止回调读取 `finished=true`、`participating=false` 和已停止参与的贡献；终止事实本身阻止重新启用与重复 finish，不另存 finishing 状态。暂时停止参与仍保持 `finished=false`，可以恢复原载荷；已经非参与的实例 finish 不重复调用 disable。外层 finish 返回前完成子实例终止传播，finalize 仍由各接收者独立执行。

生命周期动作必须同步完成并返回 undefined；调用原 callback 的编译边界拒绝其他返回值。context 的实例查询、facts 和 operations 只在当前 callback 调用期有效，正常或异常退出都关闭。不得保存 operations 后通过微任务、定时器或其他延后 continuation 调用；跨 tick 行为须保存为明确的过程事实。

Damage／Healing hook 的借出 facts、实例查询和 operations 同样在 callback 退出时关闭；同步嵌套结算期间，外层 callback 的接口仍有效。

Effect 实例的 `source` 保存来源 UnitId，`parent` 保存精确父实例地址，`scope` 保存生命周期绑定。`scope` 的类型为 `EffectLifetimeScope`，可以绑定 Unit 或一次 ActionExecution；它属于快照中的运行事实，独立于临时 dispatch scope。

父身份是 `{ unitId, instanceId }`，独立于 `source` 和 `scope`。`attachEffectParent()` 返回 `{ work, result }`；内容操作 `effects.attachParent()` 提交同一工作变化并返回 `result`：

| result.type | 含义 |
| --- | --- |
| `BOUND` | 已建立请求中的活父绑定，或本来已绑定同一活父 |
| `CHILD_ABSENT` | 子实例未登记 |
| `CHILD_FINISHED` | 子实例已经结束 |
| `PARENT_UNAVAILABLE` | 父实例缺席或已结束；`reason` 为 `ABSENT`／`FINISHED` |

`finishIfParentFinished` 默认 `true`：父缺席和父已结束都通过统一 finish 操作结束子实例，不伪造父绑定，不隐式 finalize。显式传 `false` 时返回拒绝且不改变子实例。活父重绑与环关系属于非法图，仍抛异常。

## 4. 候选范围与已进入程序

每个接收 Unit 在一个活跃领域事件内捕获全部登记身份，包含当前非参与的实例。同接收者的嵌套事件复用该范围；另一个没有活跃事件的接收者从自己的当前登记建立范围。事件完全退出后，后续事件重新建立范围，不冻结整次 Damage 或整个 tick。

候选轮到前重新读取当前实例、参与事实和领域资格。新实例按 UID 立即可见，但不进入旧范围；旧停用候选恢复后可以参与。候选身份冻结，HP、载荷及有效参数仍按对应查询契约读取。

普通 `EffectFacts` 查询始终读取当前登记与参与事实，不借用派发候选缓存；新安装且已参与的实例立即出现在 `participating()` 中。普通查询与逐候选派发共用 `started && participating && !finished` 资格，候选身份是否属于本次事件另外判断。

Effect 的 unit／execution scope 与 parent 关系使用本次 Work 链内的派生生命周期索引，权威关系仍来自 EffectInstance。普通 HP／Action／事件变化复用索引；实例数组变化与 Unit 移除由唯一工作状态入口维护投影。新 Work 独立构建，不以可变 Battlefield view 的对象身份跨阶段复用；索引不进入 Resources 或 Snapshot。归属查询先捕获按接收者与实例身份排序的候选，生命周期 operation 轮到时重查当前实例。即时行动结束因此不再逐次扫描全场无关 Effect。

领域事件结束后清理接收者的 finished 实例。嵌套 cleanup 可以先于外层事件结束，运行结束动作并安装新实例；它不会重建尚活跃的外层候选。

单接收者清理只捕获该接收者当时的全部实例身份，逐个重读是否 finished。结束动作结束的原有候选仍可在本轮清理；结束动作新装的实例不加入本轮。局部事实查询不枚举单位，View 的成员列表仅在实际读取时构建，且与该 View 的 getUnit 使用同一份 Work。

已经进入的 callback 不因实例 finish／finalize 自动中断。finalize 删除 UID 前向活跃 invocation 保存该实例最后事实，callback 后继可以读取最后载荷；UID 和参与查询已经看不到该登记。这个暂存退出 callback 即清除，不延迟 cleanup，也不进入 Resources 或 snapshot。

## 5. 领域排序、取消与嵌套

Damage／Healing 拥有自己的排序与结算流程。一个事件内部按 priority 降序、获得次序升序、instance ID 升序执行；逐候选资格 live。priority 不用于跨 Unit 合并排序。

| 确认报告后的反应 | Unit 顺序 |
| --- | --- |
| Damage | 来源，再目标 |
| Healing | 目标，再来源 |

来源为空时跳过；来源和目标为同一 Unit 时只执行一次该报告反应。每个 Unit 内独立按该领域事件 priority 排序。以上是当前项目合同，不是对所有官方后置通知顺序的兼容声明。

领域 cancellation 与 `stopDispatch` 独立。取消 HP 应用不自动停止已进入派发的剩余候选，不回滚实例消耗、嵌套回复或允许的内容后继；只有明确 `stopDispatch` 停止该事件的后续候选。

[Hook context](../../src/core/unit/capability/vitality/hook.ts) 只暴露阶段事实及明确注入的 Effect／Damage／Healing operation，不暴露 Work、全量 Resources 或任意 Battlefield mutation；共享源事实通过独立的 Source 载荷操作访问。公式阶段只提供 Effect 操作。嵌套领域操作完整结算后返回本次报告，后继读取最新工作事实；本次报告不汇总嵌套操作的净 HP 变化。

## 6. Core 接收政策与原始数据适配

Core 的伤害类别与接收政策独立。`TRUE` 不自动跳过 Modifier 事件；Damage 的 `skipModifierEvents` 与 `considerInvincibility` 是独立输入。

Core Healing 的两个输入也独立：

| 输入 | 控制内容 |
| --- | --- |
| `ignoreHealFree` | 是否绕过接收时的 HEAL_FREE 判定 |
| `skipModifierEvents` | 是否跳过普通输出／接收／报告反应，改用独立 `skippedReception` |

因此直接 Core 调用的 `skipModifierEvents: true` 不隐含 `ignoreHealFree: true`。接收许可在该请求的 admission 时判断；随后 hook 改变 HEAL_FREE 不追溯撤销已经接纳的回复，新的请求重新判断。

[readArknightsHealingRequest](../../src/data/arknights/healing.ts) 只适配原生 `Torappu.Battle.Action.Nodes+HealViaMaxHpRatio` 的两个布尔字段。调用者已经解析来源／目标并结算 `power`；适配器不解释黑板比例、目标描述或完整动作程序。其映射为：

```typescript
ignoreHealFree = raw._ignoreHealFree || raw._skipModifierEvent;
skipModifierEvents = raw._skipModifierEvent;
```

这个原始数据映射表达该原生动作的 skip 接收绕过普通 HEAL_FREE 判断，不把两种 Core 输入合并，也不宣布其他原生回复动作采用同一描述格式。

## 7. 异常与权威发布

正常拒绝、领域取消和零 HP 变化都是可提交结果。只有未处理异常或明确 tick abort 才放弃本 tick 工作事实；权威 Battlefield 在整 tick 成功后发布。

进入 HP 转换的最终伤害和治疗量必须有限且非负，非法扩展结果抛 RangeError；公式和输出中写入 DamageReport 的数值必须有限，中间有符号修正不被统一归零。取消不使非法最终量变成合法量。公开生命 transition 使用同一数值边界；Healing 源请求既有的负 power 归零归一化继续保留。

候选范围和活跃实例暂存在 `finally` 中释放。异常后的新事件必须重新建立身份范围；不得把失败调用的候选、HP、实例载荷、身份进度或公开事件留入下一次权威结果。

## 8. 非空间效果源与接收联系

[EffectSource](../../src/core/battlefield/effect-source/state.ts) 是非空间 Mechanism 的一组运行事实。源与接收 Buff 有不同身份：源保存程序关联、共享载荷、初始化／结束事实和 receiver→精确 Buff 地址及安装尝试历史；接收者保存自己的实例及领域贡献。几何候选由程序查询，不代替已安装联系。程序、筛选与安装策略保存在独立 Source registry，快照只有数据和不可变程序 ref。

运行期新增源第一次协调时补选当前单位。持续分发程序另外声明 acceptsRegistration；部署、预置实例出现、波次出生都先登记单位，再由该次 REGISTER_UNIT 的实际结果接入源，接收者已可查询，安装完成后才进入下一 phase。开局一次选择不声明该入口，因此后续出生不自动加入。当前光环成员协调发生在出生／部署之后的交战前、移动之后；不声称重现所有原生 callback 时点。

Source active 是唯一源参与事实。默认跟随源参与的接收实例通过公开 Effect 操作启停；非参与期间的新登记保留未安装联系，恢复参与后补装。followsParticipation 可以明确脱钩；范围离开、源结束、重新安装分别由该程序选择。源停止按保存的地址处理接收实例；不能在结束时重新查询当前几何范围来代替清理。保留接收实例的策略表示其后续生命周期独立于结束的源。来源 Unit 只是 provenance，是否随来源退出结束由 shouldFinish 明示。

安装前记录 installationAttempts，包含正常拒绝，默认不会在每次协调时重试。成功安装另存 address；源历史与当前实例存在分别表达。重新安装必须由 shouldReinstall 明示。初始化载荷在 receiver ON_START 前取得所有权，不通过安装后补写来建立源关联。

共享额度只有源 state 一份权威事实。Damage／Healing hook 可以取得 [窄 Source operations](../../src/core/battlefield/effect-source/operations.ts)，同步读取和更新该载荷；不能修改接收联系或任意 Mechanism。tryConsume 对不存在、结束、非参与的源返回 false；正常额度不足保留之前的转换。接口随 hook 退出关闭。共享载荷更新复用已取得所有权的 receiver 数组，避免每次消费复制所有接收者。

这一批覆盖普通持续 GlobalBuff 分发、一次选择、显式光环范围政策及共享计数压力案例。计数例只验证项目协议，不代表已实现复活或尚未闭合的 autochess Lua 时序。低层 Battlefield 的存储 changes 不承担 Buff 结算；内容必须通过 Source 领域入口协调启停和结束，不能先删除 host 再要求系统找回安装联系。

## 9. 行动程序与可恢复执行

[ActionExecution](../../src/core/unit/capability/action/process.ts) 保存在独立 Action 领域集合，并由 BattleSystemStates 与 BattleSnapshot 保存。每次执行有单调身份、来源、不可变 ActionDefinition 关联、接受时点与输入目标、绑定、数值样本、游标及等待事实；同一来源可以有多个执行。集合中没有函数、Map、候选作用域或同步调用帧。生成的执行事实不可变，复制集合时复用它们。编译段落只保存在定义关联的私有程序缓存中，缓存取得描述对象与数组的所有权。

所有行动使用同一种编译 program 与同一个 runner。先检查来源、启动许可、冷却与恢复，再调用纯 bind 查询实际目标；bind 不接收 Work 或执行准备转换。不为更新展示目标每 tick 完整绑定。接受后立即分配执行身份，记录 ACTION，并按 intervalTicks／recoveryTicks 更新 Unit.ActionState。当前 ActionState 只保存 readyAtTick 与 recoveryUntilTick，不重复记录历史或当前目标；输入目标与绑定归 ActionExecution.inputTargetUnitId／bindings。当前展示使用 ACTION／ACTION_RELEASED 事件及在途事实，需要实时朝向时另作纯 projection，不修改执行绑定。

runner 连续推进同步步骤，完成时结束精确执行身份的生命周期绑定；遇到未完成等待才保留 continuation。瞬时完成也有执行身份，可以绑定临时 Effect，但不保留长期执行。执行输入与接受绑定不因之后的展示变化而改写；程序可以在某段安装后重新查询／绑定，不强迫所有后续目标在接受时固定。

编译段落只有同步执行、等待及释放标记这些有限控制操作。一个已进入的 EXECUTE 及其同步嵌套领域结算完整返回 Working facts，完成后才推进游标；来源在本段内退出不截断当前回调，也不回滚已完成事实，但不保证整个同步 program 的所有后继仍执行。本段可以明确请求正常 FINISH 或 CONTENT_CANCELLED，保留已返回的事实，再结束精确执行身份的生命周期绑定，不执行后继。需要在来源退出后继续完成的同步动作由当前 EXECUTE 显式组合；需要独立存续的延迟工作建立独立过程。异常则由整 tick 不发布政策处理，不能用异常代替正常取消。

相对等待在进入时保存 remainingTicks，此 tick 不消费；之后每次获准推进的新 tick 消耗一个，同 tick 重入不重复消费。绝对等待按 targetTick 判断；跳过推进后恢复时，两者仍有不同语义。不会用 Promise、generator 或跨 tick 调用栈保存等待。

当前推进合同如下：

1. 阶段准备先处理显式 CANCEL_ACTION_EXECUTION；同 tick 取消早于恢复等待／释放。
2. 交战按来源 UnitId 递增处理。各来源先按执行接受次序恢复旧进程，再考虑普通行动的新接受，不把全场延迟释放统一挪到即时行动之前。
3. 当前段落的 allowNewAction 许可在同来源多个执行之间取交集；blockingMovement 只要有一项阻止就拒绝移动。Movement 取得 Action 的纯许可查询，不读取进程游标或程序内部。
4. 每次进入尚未执行的段落前检查来源，包括同步后继、WAIT 的进入／恢复和 RELEASE；来源缺席或不再有空间存在则以 SOURCE_ABSENT 取消后继，缺席来源仍加入待处理身份集合。当前已进入的 EXECUTE 完整返回，其明确 FINISH／CONTENT_CANCELLED 优先按本段结果处理；若它已经是最后一段，则正常 FINISHED，不因已完成后来源退出改判取消。已经释放的 Projectile 独立存在，不由此取消回滚。取消／完成清理的是精确 ownerUnitId＋executionId，不结束同来源的其他进程。
5. RELEASE、FINISHED、CANCELLED 在实际发生处写入 Work 事件序列。段落控制结果另返回相同 signal，协调层不再次追加。阶段事件先于该阶段提交产生的 SUPPORT_LOST 以及后续登记回调事件；UNIT_REMOVED 保持原有整 tick 汇总报告。

这一批实现显式 tick 等待与释放的有限路径，未猜测原生动画事件对应帧数，也未实现全部 spell 重复策略或输入位置格式。来源在 Action phase 之后退出的未完成进程，下次 Action phase 再处理。在途 Projectile 与 cachedAtk 独立保存，终局政策见下一节。

## 10. 独立 Projectile 过程

[ProjectileState](../../src/core/battlefield/projectile/state.ts) 是独立过程集合，由 BattleSystemStates 与 BattleSnapshot 保存，不伪装为 Unit 或非空间 Mechanism。身份单调分配；每个实例保存不可变程序 ref、来源／追踪身份、当前位置／最后目标、cachedAtk、每 tick 速度、接触范围、发射／推进时点、到期、命中身份与停止进度，以及内容私有载荷。运动、命中、停止程序只在 [ProjectileResources](../../src/core/battlefield/projectile/resources.ts) 中。

Action program 通过借出的 [发射 operations](../../src/core/battlefield/projectile/operations.ts) 创建实例；身份和事实在同次调用立即可取。该接口只在 Action phase 有效，正常或异常退出都关闭，不进入 ActionExecution 或 snapshot。程序登记随整份资源图在战斗开始时关闭。

第一条有限路径是恒速追踪：每次推进读取当前追踪目标位置，目标不再有空间存在时保留最后目标；到达后重新执行 contact 查询。Contact 捕获当时已有 Unit 身份，按 UnitId 递增处理；轮到时重查当前位置、Hit geometry、命中历史及内容资格。候选收集不提前执行资格 predicate，之前不符合的既有身份可以在同步转换后参加，新身份不进入本轮。几何查询与内容资格不普遍要求 Vitality 或存活。

命中程序通过 [窄 context](../../src/core/battlefield/projectile/context.ts) 读取当前事实，组合 Effect／Damage／Healing、更新自身载荷或停止自身，不取得任意 Battlefield mutation。接纳目标后先写入 `hitUnitIds`，再执行 contact 程序；停止回调与同步后继可读取本次已登记身份，防止重新结算同一目标。附着后伤害被取消时，已完成附着仍保留。嵌套停止不取消已进入的内容后继，也不重新插回已移除实例。`attackPower()` 从当前来源的 Offense 查询有效 ATK，来源不可查询时回退到发射时的 cachedAtk；cached-only 内容直接读取 projectile.cachedAtk，没有 Definition.power 回退。

[Case B](cases/02-action-and-projectile-phases.md) 已确认原生身份去重历史在命中回调前更新，只有命中次数在回调后增加；本季地灵的停止保底命中仍检查身份历史。身份历史前置防止重复命中，属于重要离散结果的保护，不是为了追求内部时序一致。Core 当前没有独立命中次数政策，`hitUnitIds` 不替代未来内容需要的次数事实。

`PROJECTILE_HIT` 是 contact 程序完成后的结果报告，不是驱动命中行为的事件。程序内 `stopSelf()` 同步完成停止转换与停止程序，再返回 contact 后继；因此该路径可以先报告 `PROJECTILE_STOPPED`，后报告 `PROJECTILE_HIT`。停止程序已能看到本次接纳的命中身份。不能为了报告顺序延迟领域结算。

停止先标记 STOPPED 并记录 signal，再同步执行停止程序、移除实例；重复停止不重复结算。进入程序时的最后实例事实供同步后继读取，调用退出后不保留执行作用域。到达、命中、停止事件在实际发生处写入同一工作事件序列。异常使整 tick 的新发射身份、过程、领域转换和事件一起不发布；领域取消保留已完成前缀。

以下是明确的项目政策，不能从原生引用或 prefab 推断成完整官方时序：

| 政策 | 当前行为 |
| --- | --- |
| 推进位置 | Combat／Action 之后、Movement 之前；新发射当 tick 不消费移动预算 |
| 追踪失去目标 | 保留最后目标继续飞行 |
| 来源取值可用性 | 当前 Unit 与 Offense 可查询就取当前 ATK，否则取 cachedAtk；不模拟 Unity 引用释放时点 |
| Action 结束／来源退场 | 不自动结束已经发射的 Projectile |
| Schedule 完成／时间上限 | 冻结剩余 Action／Projectile facts，不等待命中、不补 stop、不延长战斗 |

上述推进位置与普通原生路径有已确认差异：官方 ObjectManager 按对象 priority／instanceUid 的排序列表依次推进，通常既有追踪敌人已经执行本 tick 位移，后来创建的弹体再读取其当前位置。项目接受固定 `Combat → Projectile → Movement` 作为近似，不复制原生对象队列，不把一 tick 的到达偏移列为必须修复的差距。测试锁定项目阶段读取契约；具体内容若出现重要目标选择、重复／漏失命中、触发次数或胜负变化、显著累计数值偏差，再据该案例调整。这个选择没有声称所有边界与官方严格等价。

官方依据见 [Case B](cases/02-action-and-projectile-phases.md) 的发射样本、contact 重查、附着／命中及停止路径。当前不包含完整 prefab 加载、贯穿、往返、多段、光束或全部内容程序。同进程复制事实后可以用原不可变 ref 继续推进；structuredClone 只验证快照纯数据，不宣称跨进程程序关联恢复或完整 BattleRuntime.restore。

## 11. 路线、导航与位移提交

[Route](../../src/core/unit/capability/locomotion/route/execution.ts) 决定当前 checkpoint、已解析目标与等待；[queryNavigation](../../src/core/battlefield/navigation/state.ts) 是唯一导航查询入口，返回下一可执行目标、cursor／visits 更新及 `ARRIVAL_CANDIDATE`，不自行提交到达。无 WAIT 预览路线。[Locomotion](../../src/core/unit/capability/locomotion/step.ts) 按运动许可和预算消费该段，END 在本 tick 运动完成后检查并提交到达，不提前产生 ARRIVED 再重建 FOLLOWING。

checkpoint 展开使用项目执行预算，耗尽后保留精确后继的 `NOT_ENTERED`，下 tick 在 `routeAdvanceAllowed` 允许时只续入活动路线。临时路线接管期间主路线不执行待进入指令，后台主路线等待仍按原许可计时。预算不改变 PATROL 后继、不强行离开循环，也不重放已执行的通知、安装或随机采样。退化循环不会因预算耗尽被隐式跳过，具体内容需要的错误／恢复政策另行确定。

平滑与实际运动共享[有向边线段遍历](../../src/core/battlefield/navigation/segment.ts)：按真实 from→to 检查出发格、跨边及拐角，终点后的出边不属于该线段。平滑另按同一连续成本口径与原路径预算比较，保留高成本区域避让；通行允许不意味着可以忽略路线成本。位置与 locator 越界使用共同恢复目标及裁剪后的地图内通行检查。单格成本与有限目标场距离采用项目安全整数范围，保留非法输入及真实溢出检查，不受原生 int32 上限约束。

验收比较通道选择、明显绕路、穿墙、卡死、等待、临时路线恢复及长期数值结果；细小转角、轨迹与到达时点差异按模拟原则接受。测试验证确定性和这些玩法契约，不把旧射线、预测入口或防卡死阈值永久固定为规范。

## 12. 验收范围

[派发回归](../../test/sim/effect-dispatch.test.js)、[生命周期回归](../../test/sim/effects.test.js) 和 [贡献回归](../../test/sim/contributions.test.js) 验证上述协议。[源过程](../../test/sim/effect-sources.test.js)、[源接入](../../test/sim/effect-source-runtime.test.js)、[行动进程](../../test/sim/action-process.test.js)、[行动接入](../../test/sim/action-process-runtime.test.js) 与 [Projectile 接入](../../test/sim/projectile-runtime.test.js) 验证联系、复制推进、正常取消与整 tick 异常不发布。共享 [Effect fixture](../../test/helpers/effects.js) 使用统一安装入口；手工 Unit fixture 先通过 [initializeUnit](../../src/core/unit/initialize.ts) 建立能力事实，再通过合法 transition 调整测试输入，不手造过时 capability state。

[空间回归](../../test/sim/core.test.js) 和 [路线回归](../../test/sim/pathing.test.js) 验证候选／提交分离、执行预算续跑、有向边合法性及高成本避让。旧实现细节随明确项目政策调整；前缀只执行一次、命中不重复／漏失、作用域收尾、重要离散结果及显著累计数值仍是验收约束。

从空构建产物验收，避免已删除模块的残留 JS 使测试假通过：

```sh
rm -rf dist
npm run build:ts
npm run check
node --test --test-isolation=none \
    test/content/tokens_devices.test.js \
    test/render/interp.test.js \
    test/sim/battle.test.js \
    test/sim/combat-program.test.js \
    test/sim/action-process.test.js \
    test/sim/action-process-runtime.test.js \
    test/sim/action-event-order.test.js \
    test/sim/combat-work.test.js \
    test/sim/combat.test.js \
    test/sim/contributions.test.js \
    test/sim/core.test.js \
    test/sim/damage-pipeline.test.js \
    test/sim/effect-dispatch.test.js \
    test/sim/effect-cleanup.test.js \
    test/sim/effects.test.js \
    test/sim/effect-sources.test.js \
    test/sim/effect-source-runtime.test.js \
    test/sim/facing.test.js \
    test/sim/feedback1b-displacement.test.js \
    test/sim/pathing-crosscheck.test.js \
    test/sim/pathing.test.js \
    test/sim/playtest5_blocking.test.js \
    test/sim/resource-registration.test.js \
    test/sim/settlement-invariants.test.js \
    test/sim/projectile-runtime.test.js
```

该命令只包含已接入 TypeScript 的 legacy 相关测试；统计不混入全仓库其他测试。
