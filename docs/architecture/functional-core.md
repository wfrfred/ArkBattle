# Tactical 函数式内核

具体玩法目标、PRTS 对照与当前实现缺口见 [Tactical 目标语义与实现缺口](tactical-semantics.md)。本文规定这些规则如何通过纯状态契约组合，不以工程结构替代玩法完成度。

本文规定 Tactical 的函数契约与状态归属。领域计算与结算显式接续不可变状态，外部驱动负责状态发布与 I/O。

总体领域划分见 [总体架构](ARCHITECTURE.md)，行动接口见 [Action 设计](action.md)，附着实例模型见 [Effect 设计](effect.md)。Action 推进只由调度器调用，内容通过启动、取消与具体结算接口交互。

## 状态接续后的读取与续执行

> **任何跨领域操作都按状态失效边界处理。同步回调允许重入，重入操作可以终结外层正在执行的实例或其宿主。操作返回后，后续若依赖自己或宿主的存在性、生命周期或资格，必须从最新 BattleState 查询并确认。此前明确采样的数值继续保留。**

这是所有同步领域结算与内容程序共同遵守的契约，不只适用于 Action。同领域的完整操作如果可能触发同步回调，也遵守这条规则。只读查询与局部计算本身不会推进战斗版本；两次状态推进之间不要求反复查询相同事实。Typed Ref 保留身份与稳定类型，不保证对象仍存在、仍在运行或宿主仍在场。

1. **旧引用是历史快照。** 先前取得的对象仍是输入版本中的有效值，可以表示已发生的事实，例如离场载荷；不能据此假设对象仍在最新战斗中存在、运行或具备资格。
2. **实时事实从最新版本读取。** 后续需要当前 HP、执行进度、Effect 状态等事实时，从接续后的 BattleState 重新查询。不得用嵌套前保留的整份 Unit、Action 或 Effect 覆盖嵌套结算产生的新版本，也不得重新插入已经结束或移除的实例。
3. **续执行条件由具体业务确认。** 后续步骤要求当前实例仍存在、仍在执行或仍有资格时，重新确认这些条件。伤害、治疗、启动等完整操作负责本领域的执行资格，调用方只检查自己续执行所需的条件，无需重复整套下层规则。
4. **明确采样的事实继续保留。** 发射时攻击力、固定动作预算、已进入等待等按业务规则确定的历史事实，可以继续使用；是否需要采样或实时读取由具体规则决定，不由值的类型决定。
5. **中间进度先提交，再进入观察它的业务。** 若同步回调需要看到已经释放、已经扣除次数等事实，先把它们纳入后继 BattleState，再调用伤害、治疗等结算。完整操作接续返回状态，避免另一次自动私有状态写回覆盖嵌套更新。

例如 Action 的一次攻击触发反击，反击又导致来源离场：嵌套结算返回后，已经发生的伤害与采样仍保留；后续步骤若要求原 Action 仍在执行，就从最新版本查询并决定是否继续。两次状态推进之间可以使用一次取得的当前对象完成连续局部计算，不要求每次读取字段都重新查询。

终止不等待已经进入调用栈的程序退出。Action.step 或 Effect.onEnd 中的同步重入可以完成自己或宿主的终止，返回后原函数按自身控制流继续，并为后续依赖当前生命周期的业务重新确认条件。这是允许同步重入及终结外层对象的直接结果，不为避免检查而增加统一延迟删除、回调退出屏障或跨领域调用上下文。离场只要求[已确定的清理偏序](deployment.md#离场清理的偏序)，其余沿用当前确定顺序。

## 1. 范围与依据

范围是本项目选定的 `act2autochess` 战斗，以及这些干员、敌人、召唤物、装备、盟约与地图机制实际需要的常规功能。[范围研究](../research/01-scope-and-battle-flow.md)区分本季引用、原生证据、整理数据与项目选择；[待核对事项](../research/05-evidence-and-open-questions.md)记录尚未闭合的分支。

Meta 通过战斗输入、内容规则和结果接口接入。商店、经济、手牌、跨回合状态机归外层玩法。装备、盟约、策略的研究用于验证 Tactical 能否执行它们提供的战斗行为，不要求 Tactical 理解整个 Meta 数据模型。

普通一 Tick 左右的差异按明确项目政策处理；重要离散结果、可察觉表现和显著累计数值偏差按具体内容验证。固定 30 Hz、线性的 Tick 顺序及 `Combat → Projectile → Movement → Blocking` 是项目选择；其中 Movement 后执行普通 Blocking 搜索，再检查路线完成与离场。固定阶段可能改变接敌归属与漏怪等结果，按[Blocking 对照验收](blocking.md#与原生的差异及对照验收)判断影响，不预先认定只是一个 Tick。客户端对象队列、无业务影响的 RNG 消费轨迹或 coroutine 实现不决定领域 API。

## 2. 目标功能要求什么

| 目标功能与代表内容                           | 必须表达的事实和顺序                                                                       | 依据                                                                                                                                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 次数盾、额度屏障、有序增减伤；泥岩盾         | 每个接收规则消费上一项返回的值；扣盾、回复、结束按顺序发生；取消伤害不回滚前缀             | [嵌套结算案例](../research/cases/03-dispatch-and-nested-settlement.md)第 3、6 节                                                                                                           |
| 攻击后治疗、治疗后装盾；焰影苇草、护盾无人机 | 得到实际领域报告，再选择目标、消费 RNG、调用 Healing 或安装另一 Unit 的 Effect             | [干员研究](../../external/upstream/docs/research/03-operators.md)焰影苇草；[装备研究](../../external/upstream/docs/research/04-items.md)护盾无人机                                                                                                      |
| 反伤、分担、死亡爆炸与传播                   | 触发消耗先形成新状态，再进入嵌套操作；嵌套完成后外层接续新状态；每次报告只描述本次请求     | [嵌套结算案例](../research/cases/03-dispatch-and-nested-settlement.md)第 5、7 节；[干员研究](../../external/upstream/docs/research/03-operators.md)焰影苇草、星熊                                                    |
| 致死干预、倒地再生、复活、实际退场           | HP 到零、击倒、复活、离场分别表达；不能固定为 `hp <= 0 → removeUnit`                       | [嵌套结算案例](../research/cases/03-dispatch-and-nested-settlement.md)第 7 节；[干员研究](../../external/upstream/docs/research/03-operators.md)烛煌、圣聆初雪、史尔特尔；[装备研究](../../external/upstream/docs/research/04-items.md)M3 茧甲 |
| Buff 覆写、安装中嵌套、父子与 Skill 约束     | 身份登记、安装完成、生效、结束中、移除不同；source 不代替 lifetime；结束可以级联           | [安装与父作用域案例](../research/cases/01-buff-installation-and-parent-scope.md)第 3、4 节                                                                                                 |
| 鼓舞、Aura、周期采样；本季浊心斯卡蒂 S3      | 来源样本、刷新进度、目标与接收实例关联是事实；刷新前保留旧值；范围查询不等于安装记录       | [安装与父作用域案例](../research/cases/01-buff-installation-and-parent-scope.md)第 5 节                                                                                                    |
| MaxHP 响应、直接 HP 变换、元素积累与回复     | MaxHP 修改可纯地返回包含 HP 响应的新 Unit；Healing、直接 HP 调整、EP 操作分别处理          | [战斗研究](../research/02-combat-buffs-and-effects.md)属性、治疗与元素章节                                                                                                                 |
| 技能 SP、Ammo、技能启动与结束后继            | 接入点由 Skill／Action 领域提供；耗弹、补弹、补 SP、强退等可以跨 Unit 接续状态             | [干员研究](../../external/upstream/docs/research/03-operators.md)流明、新约能天使、烛煌；[装备研究](../../external/upstream/docs/research/04-items.md)黄沙罗盘、骑士戒律                                                                                |
| 前摇、释放、多段攻击、Projectile             | 同步程序直接调用；跨 Tick 保存游标、等待、绑定、样本、命中历史；行动和弹体生命周期独立     | [行动与弹道案例](../research/cases/02-action-and-projectile-phases.md)                                                                                                                     |
| 恐惧、诱导、巡逻、等待与位移                 | 活动路线与主路线进度分开；重寻路不重抽已解析目标；等待推进和移动许可分别决定               | [空间研究](../research/03-space-units-and-mechanisms.md)路线与运动章节                                                                                                                     |
| 部署、工事、平台、动态地图、阻挡             | Battlefield 维护存储与索引；完整操作同步维护必要关系并通知，普通接敌由固定阶段推进；后继读取返回版本 | [Blocking 结算政策](blocking.md#已确定的职责与调度政策)及[空间研究](../research/03-space-units-and-mechanisms.md)                                                                 |
| 波次、片段、出生与完成等待                   | 出生动作完成、波次存活、最终完成和击杀／漏怪账本不混为敌人数                               | [范围研究](../research/01-scope-and-battle-flow.md)Scheduler 章节                                                                                                                          |
| 全场复活额度、领袖共享生命、战斗规则计数     | 同一作用域只有一份权威事实；不能给每个 Unit 复制额度或共享 HP                              | [空间研究](../research/03-space-units-and-mechanisms.md)全局共享状态；[整局规则](../../external/upstream/docs/research/01-core-rules.md)领袖与策略                                                                   |
| 盟约、装备、特质的战斗接入                   | 由外层提供内容；战斗期间需要的进度显式保存，收益／结果交回外层；不把全部行为冻结为初始数值 | [范围研究](../research/01-scope-and-battle-flow.md)战斗前中后；[盟约研究](../../external/upstream/docs/research/02-bonds.md)层数与战斗触发                                                                           |

维什戴尔及斯卡蒂 S1 是研究中的协议压力案例，不是本季角色／技能新增承诺。吸血的数值基线、复活恢复量、特殊覆写与刷新规则按具体引用核对，不能从文案或当前报告字段猜测。

以上需求没有要求领域代码修改共享对象，也没有要求把所有后继变成命令队列。它们要求明确的状态版本、读取时点、执行顺序和跨 Tick 事实。

## 3. 三个职责层次

下文从局部计算、领域结算和外部驱动说明分工；具体函数接口按[五类约定](api-conventions.md#1-基本分类)划分。

### 3.1 查询与局部计算

输入不可变值和必要的只读事实，返回结果；不推进世界、RNG、ID、周期或贡献刷新。

```typescript
absorb(shieldState, incoming) → { state: shieldState, value: incoming }
setAttackContribution(offenseState, contribution) → OffenseState
resolveAttack(battle, sourceRef) → number | undefined
sort(candidates, compare) → T[]
topK(candidates, k, compare) → T[]
```

名称示意实际职责，不要求所有函数使用同一 Result 类型，也不要求通过大量 Pick 表达最小依赖。

Targeting 的 Filter 与 Comparator 属于只读查询。完整选择由 Selector 返回 Result，可以在筛选完成的候选中消费 RNG 并接续状态；随机抽样不放在 Comparator 的逐次比较中。类型见 [Targeting 与 Targetable 类型](targeting.md)。

### 3.2 领域结算与具体内容程序

需要组合多个事实的操作接收当前战斗状态，返回下一版本及实际结果。同步嵌套直接调用普通函数。

```typescript
interface Result<A> {
    readonly state: BattleState;
    readonly value: A;
}

calculateDamage(battle, request) → Result<CalculatedDamage | undefined>
applyDamage(request, calculation) → Result<DamageOutcome>
calculateHealing(battle, request) → Result<CalculatedHealing | undefined>
applyHealing(request, calculation) → Result<HealingOutcome>
install(battle, hostRef, definition, initial) → Result<Ref<Effect<S, H>> | undefined>
effects.update(battle, effectRef, current => nextData) → BattleState
actions.update(battle, actionRef, current => nextState) → BattleState
end(battle, ref, reason?) → BattleState
advanceAction(battle, actionRef) → BattleState
```

`BattleState` 是不可变数据值。只需要返回状态的操作可以直接返回 BattleState；报告和 outcome 按各领域的真实需求决定。完整接口分类见[接口约定](api-conventions.md)；上面的 advanceAction 只由 Runtime 调度。

Hook、生命周期和具体装备／技能程序同样遵守显式状态返回。它们可以调用 Damage、Healing、Effect、Skill 等纯结算函数，但不通过 setter、全局变量或捕获的旧执行上下文写回。

### 3.3 调用方持有状态

initialize(input) 返回完整 battle.State，包括 Schedule、预置进度、统计和结果。step(battle, commands) 开帧通过新值清空或覆盖本 Tick 的临时字段，按顺序调用纯领域函数并返回完整新 State。commands 必填，无命令时传 []；events/result 在返回的 State 中，不另返回 Step 包装。网络、文件、渲染、现实时间和日志输出由外层处理。

```text
step(battle, commands)
    ├─ 形成清空本 Tick 临时事实的新值
    ├─ Deployment 时间推进 → 接续状态
    ├─ Predefined → 接续状态与 Presence
    ├─ Combat.prepare → 接续状态
    ├─ Deployment → 接续状态
    ├─ Spawning → 接续状态与 Schedule
    ├─ Unit → 接续状态
    ├─ Effects → 接续状态
    ├─ Elemental → 接续状态
    ├─ Skills → 接续状态
    ├─ Route Commands → 接续状态
    ├─ Combat → 接续状态
    ├─ Projectile → 接续状态
    ├─ Movement → 接续状态
    ├─ Mechanism → 地形接触与控制器扫描 → 接续状态
    ├─ Blocking 每 Tick 统一搜索 → 接续状态
    ├─ 路线完成与离场检查 → 接续状态
    ├─ 判断结束，形成整体 State
    └─ 返回 State，由调用方接续
```

Tick 的执行顺序在 step() 中直接可读。领域函数负责各自的纯结算；函数式契约不要求再建立一个完整的 Tick 入口或执行文件。

函数内部用局部 `let state` 顺序接续，调用方用 `battle = step(battle, commands)` 保存结果，不重放操作或已执行的回调。函数抛出时输入值仍完整保留；没有额外提交、发布或回滚协议。

## 4. 状态归属

| 所属领域                           | 权威事实                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Battlefield                        | Units、Navigation、Projectiles、占位／承载与派生索引      |
| Unit.blocker／Unit.blockable | 当前唯一阻挡归属与有序关联；接敌、解除及必要维护由 Blocking 领域执行 |
| Unit／Capability                   | HP、控制状态、行动就绪、技能状态、路线、各自 Hook 与 Contribution 集合   |
| Unit.effects                       | Effects 容器保存实例身份、Definition、私有 data、生效状态、来源与 scopes |
| Schedule                           | 波次、片段、出生与完成账本                                               |
| Unit.action.instances              | 宿主内已接受行动的身份、Definition、私有执行进度及生命周期事实           |
| PredefinedPresence                 | 预置 Definition 到实际实例的绑定                                         |
| Execution                          | RNG 和全局 ID／请求分配进度；宿主内 Effect ID 仍归对应 Effect 集合       |
| Battle.mechanisms：非空间 Mechanism | 共享额度、共享生命、周期、一次性锁和来源过程进度                         |
| Battle                             | Tick、统计、结果，以及本 Tick 产生的不可变事件和变更事实                 |

战斗状态组合这些值，没有第二份 Unit 覆盖层，也不复制 Battlefield 的索引维护职责。全局规则只有需要独立状态时才创建 Mechanism；不把所有特殊技能归成一种通用机制对象。

实例直接共享不可变 Definition，异构条目的类型配对与恢复由所属集合封装。Typed Ref 与生命周期地址表达运行身份；跨进程恢复在序列化入口重新关联定义。Skill 的类型与行为见 [Skill 设计](skill.md)。

事件与注册／移除记录可以在 Tick 工作值中按顺序累积，step() 返回时形成输出。它们是结果数据，不是随后重放的修改指令。纯函数可以内部使用本次新建的数组／Map 构建结果，不能修改输入版本或已经返回的共享值。

调用期候选与只读资源不进入长期状态：

- Definition、编译后的内容、地图及静态规则可以共享引用。
- 当前事件参数、PendingDamage、候选身份范围属于本次调用。
- 跨 Tick 的计时、次数、RNG、绑定、执行游标不能放在资源或闭包里。
- 缓存只保存可重建结果，内部可变缓存不得改变领域结果；跨 Tick 的权威进度保存在 State。Navigation 的缓存契约见 [Navigation 设计](navigation.md#职责与状态归属)。

## 5. Battlefield 的状态一致性与阻挡结算

Battlefield 提供不可变 State 与直接的集合操作。create(map: Map) 直接接收地图，不为单个参数提供 Input 包装。State 的 units 统一为 ReadonlyMap<Id, Unit>，不为异构集合声明共同的具体 Unit 类型；精确类型由 Typed Ref 与查询守卫恢复。普通操作直接返回已经维护一致性的下一版本：

```typescript
fieldUnit.add(field, unit) → nextField
fieldUnit.update(field, units) → nextField
fieldUnit.remove(field, ref) → nextField

unit.add(battle, unit) → nextBattle
unit.update(battle, updates) → nextBattle
unit.remove(battle, id, reason) → nextBattle
unit.advance(battle) → nextBattle
```

battlefield/unit.ts 的 add／update／remove 只完成纯状态转换；完整 Unit 业务统一位于 battle/unit.ts，提供 add／update／remove／advance。remove 在入口建立 LEAVING，清理操作返回后重新读取当前 Unit，再直接注销并记录移除事实，不另设重复保证生命周期的 unregister 步骤。add 负责登记和入场，remove 负责生命周期清理和注销，调用方不再拼接两段操作。BattleState 不另提供 Unit 登记或注销入口。

add 拒绝重复身份，update 要求身份已存在且 Definition 不变；替换保持登记顺序。删除使用 Typed Ref。Unit 的 update 要求目标均已登记；任一目标缺失时抛出 RangeError，在任何业务通知前拒绝整批更新。空批次或所有对象引用均未变化时返回原状态。Unit 更新显式传递受影响身份集合，Occupancy 按整批最终状态统一维护，不为已知变更全量比较集合。Unit 的所属格在查询时读取 position 与 SpatialPresence，不另存位置索引或空间依赖分类。

部署和空间出现等跨字段操作，由所属领域构造新的不可变 Unit，通过 update 的 Unit 数组维护登记。普通操作传入 [unit]；只有确实要求同时提交最终状态时才使用多元素数组，不把本来逐次完成的独立领域操作合并以减少调用。battlefield/unit.ts 的私有 Change 记录 ADD 的 next、UPDATE 的 previous/next 或 REMOVE 的 previous。私有 applyChanges(field, changes) 统一写入 Unit 容器，并依据登记值的变化维护 Occupancy，不重新扫描完整 Unit 集合计算差分；Effect 依赖索引由 Battle 层接续。接口不返回需要另行执行的指令、闭包或提交计划，也不要求操作返回后再调用 settle。

Battle 层通过 unit.update 接续一组最终 Unit，统一维护 Battlefield 和本批 Effect 依赖索引；消费方直接从当前 Occupancy 双槽查询平台与乘员，所需属性由消费方读取；受影响登记格按承载差分向 SUPPORT 的 occupantAdded／occupantRemoved Hook 同步通知，不提供额外的 SUPPORT_LOST 事件。平台离场的后继业务由其 leave Hook 组合公开操作，普通单单位操作调用 update(battle, [unit])。Blocking 在纯准备阶段合并本批关系两侧，所有 Unit、Occupancy 与 Effect 依赖就绪后才派发关系通知，之后不得写回旧 Unit。承载不另存权威关系表，见 [Occupancy 与 Support](occupancy.md)。注册者已经知道本次创建的实例；UnitRemoval 是实际删除时采样的独立业务记录，不从通用变更日志恢复。删除记录与离场开始时的 Departure 历史快照分别表达各自时点。

初始化、刷怪和预定义出现逐个完成创建、登记与入场，接续 Hook 返回的最新 BattleState 后才处理下一个对象，不预先分配后续实例身份。刷怪按当前实例逐个登记调度归属和出生事件后再执行 enter Hook；待生成数量随实际生成递减。纯集合批量写入不定义批量入场语义。Field 状态转换不执行阻挡业务；完整 Battle 操作承接必要维护。

Blocking 保留 unit.update(battle, [unit]) 的完整更新保证：Capability 的纯 State 转换照常提交；Battle 层接续存储与索引，再由 Blocking 完整操作同步完成必要的 Release、容量裁撤、失效清理及 Hook，返回最新 BattleState。Runtime 提交 Unit 修改统一使用 unit.update 或相应完整领域操作；battlefield/unit.update 不是可以绕过完整结算的业务入口。底层只接收 BattlefieldState 的存储转换不执行任意战斗程序。

普通搜索每 Tick 在 Movement 后的固定阶段统一执行，不保存独立搜索周期，不随每次 Unit 修改全局搜索。完整更新保证既有关系合法和移动约束一致，允许尚未取得的新关系等待下一次普通搜索；有真实业务要求时可显式立即搜索。归属与关联保存在 Blockable／Blocker State；关系两侧在同一批写入中就绪，再按 Blocker、Blockable 顺序同步通知。后续接续 Hook 返回的最新状态，不自动扩充名单或全场搜索至稳定。详见[职责与调度政策](blocking.md#已确定的职责与调度政策)。

查询直接使用所属领域的接口：Unit 的 all／get、Blocking 的关系查询、Occupancy 的 at、Support 的 of／all，以及 Projectile 的实例查询；map 与 navigation 直接从 Field 读取。Navigation 的状态与查询接口见 [Navigation 设计](navigation.md)。HP 到零后的业务裁决、Effect 回调和 Meta 内容后继由相应领域负责，不能让 storage 一致性维护隐式执行任意游戏程序。

## 6. Hook 和生命周期的纯契约

Hook 使用统一的泛型状态转换与动态派发协议，登记仍由所属领域持有。公共层只依赖 BattleState、Result 和字符串登记身份，不认识具体 Capability。

```typescript
interface Hook<C, T> {
    readonly id: string;
    readonly accepts?: (battle: BattleState, context: C, current: T) => boolean;
    readonly invoke: (battle: BattleState, context: C, current: T) => Result<T>;
}

interface DispatchOptions<C, T> {
    readonly candidates: (battle: BattleState) => readonly string[];
    readonly find: (battle: BattleState, id: string) => Hook<C, T> | undefined;
    readonly stop?: (battle: BattleState, current: T) => boolean;
}

dispatch(battle, fixedContext, initialValue, options): Result<T>;
```

三个通道分别是固定 Context、动态 Battle、可接续 current。Context 保留本次事件身份、历史事实和明确采样值，不因实例结束或替换而改写。实时状态从最新 Battle 按身份查询；Context 内的历史对象不被当成持续最新的对象。需要当前 Effect 私有数据的程序通过捕获的 typed Ref 查询，不捕获可变运行进度。

candidates 每次派发调用一次并复制 ID 序列，顺序由领域决定。每项依次检查 stop、find、accepts，再 invoke；三个查询只读，不消费 RNG。find 重新读取最新登记并确认节点／阶段资格。accepts 缺省为允许，返回 false 则跳过；stop 结束整次派发，保留已完成的状态和值，不自动取消业务或回滚。嵌套派发独立取得 Context、current 和候选；返回后接续其 Battle，外层 Context 不变，外层 current 由当前 Hook 返回值决定。

不需要操作值的通知使用 T=void，仍返回 Result<void>，C 也可为 void。需要终止后续通知时，领域定义自己的控制值，不把业务取消、停止派发和生命周期终结混为同一个布尔值。Vitality 的阶段控制只在本节点生效，不能成为后续业务事实的一部分。

公共 API 为 set、remove、dispatch；set/remove 按 ID 登记、替换与撤销，保留结构共享。领域持有登记集合，定义节点、排序、资格与停止条件。Effect 与 [Projectile](projectile.md) 的 Definition 回调直接接收 self，未知私有类型与 Definition 的配对由容器 read 保持。Definition 程序与本次 Hook 派发的固定 Context 分别定义。

Unit 持有不可变 Effects 容器，容器内部使用私有 Store 保存完整实例及 ID 进度。普通 `get(id)`／`values()` 只承诺公共 View 的身份、参与状态、来源、scopes 和定义元数据，不暴露私有 data 或完整回调。`values()`／`keys()` 返回绑定容器版本的 Query。精确 Ref 查询保留已有类型证明；`get(id, definition)` 检查 Definition 对象身份；通用生命周期操作通过 `read(id, reader)` 在同一组泛型下访问完整实例与 Definition。

容器不接收战斗状态，也不决定生命周期阶段。添加只接受当前 nextId，替换保持身份与 Definition 对象，删除保留 ID 进度；完整实例的 replace 由 Core 用于提交已经配对的值。普通内容通过 `effects.update(battle, ref, current => next)` 更新私有 data，Action 执行 state 使用同样的 update 形式。两者均从传入 battle 读取当前载荷，缺失时不调用 transform，返回相同载荷引用时不生成新的 battle。Action 在 ENDING 时不更新；Effect 在 ENDING 中仍可更新私有数据以完成清理。

Projectile 的异构容器归 projectile/projectiles.ts，状态仍由 Battlefield 持有，完整 battle/projectile.ts 操作直接替换容器。Projectile 使用同样的 latest-state 更新原则，但其 transform 直接读取完整只读实例，并返回 position／state 的局部更新；Core 只提取允许字段，ACTIVE 与 ENDING 均可写。Runtime 在整个 Step 的阶段回调开始前固定候选 Ref，逐项读取最新 ACTIVE 实例，本次新建实例不参与正常推进。

transform 是纯局部值转换，不修改输入或执行战斗操作；固定实例字段与生命周期由所属领域操作维护。`NoInfer` 限制新值参与泛型推导；调用者必须保留实例与 Definition 的原始私有类型关联。Ref 可协变查询，但借预先弱化的完整 Ref 写入不兼容数据属于调用契约错误，不增加运行时形状校验。Action／Effect 容器的 toJSON 诊断保存私有载荷与 ID 进度，不反过来扩大普通 View，也不作为 Definition、回调或容器的恢复协议。

self 是输入版本的值。嵌套调用返回后，遵守 [状态接续后的读取与续执行](#状态接续后的读取与续执行)：实时事实从返回 State 重新查询，明确采样与历史载荷保留。不使用动态 getter 偷偷追踪一个可变工作对象，也不以旧整份 Unit 覆盖新版本。

安装先登记 INSTALLING，执行安装程序，接续其返回值；仍存在且安装完成的实例再决定是否 ACTIVE。结束先进入 ENDING、撤销输出，按生命周期关系结束依赖，执行结束程序后移除。依赖保持 DAG；source 是来源，不隐含随来源结束。

已经进入的内容程序按自身控制流继续。结束自身后仍需使用的载荷可以保留为本次函数的局部值；需要终态结果时由结束操作明确返回。不得为所有操作增加全局延迟删除、恢复调度或最后载荷表。

普通私有 data 转换不自动刷新 Contribution。静态、周期采样、状态响应更新和实时只读求值分别由具体内容与 Capability 表达。Effect 覆写、Contribution 分组、Hook 执行顺序和本次业务条件仍是四件事。

## 7. 同步候选范围

每次派发独立选取候选，不继承祖先派发的候选快照。领域派发遵守：

1. 本次派发开始时，从当前 BattleState 确定候选身份。
2. 每项执行前从最新返回 State 读取实例和资格。
3. 新登记身份不自动加入已经确定的候选；候选资格按当前事实判断。
4. 候选集合由派发领域管理，不作为所有操作的通用参数。
5. 嵌套 Damage / Healing 是新操作，其每个派发从最新状态取得候选。外层后续独立阶段同样重新取候选；外层当前尚未完成的派发继续使用原候选。

对 Hook 集合，候选身份是登记 ID。每项执行前按 ID 从最新集合读取当前 Hook，再执行其 accepts／invoke；同 ID 替换在本轮使用新版本，移除则跳过，新 ID 不加入已开始的派发。初始优先级决定本轮候选顺序，替换不重排；阶段改变后不符合本轮阶段的登记跳过。该身份约定不以 Hook、Unit 或 Effect 对象引用是否变化决定参与。

例如 H1 安装新 Effect 并登记 H2 后发起嵌套伤害，H2 可以参加该新伤害中符合阶段条件的派发；它不补进外层正在执行的派发。候选身份和实际资格分别处理。

候选 ID 序列是本次派发的局部值。每个领域明确自己的集合与参与规则；[原生派发研究](../research/cases/03-dispatch-and-nested-settlement.md)用于对照具体 Buff 行为。

## 8. 完整调用链示意

以吸收伤害后触发治疗的盾程序为例，派发方传入确定类型的 self 与伤害输入，程序按以下顺序接续：

1. 从当前 battle 按 typed Ref 取得 Effect，使用当前 data 局部计算吸收结果。
2. 用 `effects.update(battle, ref, current => next)` 把本次盾数消耗写入当前 data；计算与写入之间不推进 battle，transform 不执行后续业务。
3. 调用 Healing 的完整操作，并接续返回的 battle。
4. 用 Effect 身份从新 battle 读取当前实例；若内容条件要求结束，调用 end 并接续其返回值。
5. 返回最终 battle 与本次吸收结果。

这不规定所有次数盾都在零层时结束，也不宣称所有盾的治疗、结束顺序相同。Effect self 已保存 typed host Ref，定位引用由实例产生，不为示例引入另一种通用 Context。

`effects.update` 只写私有 data，不自动刷新 Contribution；需要修改已登记贡献的内容显式执行对应刷新。安装／启停／绑定／结束仍由生命周期操作完成，不通过私有数据转换绕过这些规则。

Healing 中若嵌套 Damage，Damage 必须把冷却消耗、HP、致死裁决、实际退场和 Effect 后继形成的新状态返回给 Healing，再返回外层盾程序。每层报告描述本次操作，不用最终 HP 净变化反推本次伤害／治疗量。

同样的组合可以表达治疗后给其他 Unit 装盾、灼痕死亡爆炸、技能结束补 SP、共享复活额度消耗。普通函数调用、if 和 for 足够，不要求通用指令解释器。

## 9. 正常取消与失败

正常拒绝／取消返回已经完成的状态与 outcome：盾的消耗、开始动作、嵌套回复、正常已消费的 RNG／ID 不因后继拒绝而回滚。取消伤害、停止剩余 Hook、结束 Action 和实际退场分别表达。

未处理异常表示本次模拟失败。step() 尚未到达最终发布位置，已发布版本保持不变，错误直接传播。它不定义可恢复、自动重试或 catch/drop 机制。

伤害领域必须容纳致死裁决和到零后处理。只有实际离场才关闭 Unit 的宿主生命周期并完成其相关清理。死亡爆炸等内容接入明确的击倒／死亡协议，不能把任意 Effect.onEnd 都解释为宿主死亡。

跨 Tick 保存可恢复数据；不保存同步 Hook 栈、Promise、generator 或某次调用的 Context。Action、Projectile、Route 和周期 Effect 各自推进，不合并为统一过程框架。

## 10. Meta 接入边界

Meta／Data 提供具体战斗配置、Definition、规则程序及其初始参数。Tactical 按领域接入点执行这些纯程序，并保存本场实际需要的共享进度、一次性锁、次数、样本和绑定。

盟约的持久层数、装备配置等由 Meta 管理；本场需要变化的内容通过明确输入／输出或规则实例 State 交接。Tactical 不定义商店或盟约管理器，也不直接修改 Meta 对象。联防是否禁止收益、全场额度的玩家作用域、里程碑触发等由传入的内容规则决定。

战斗内已经形成的规则进度及反馈通过 Tick／战斗结果交回外层。反馈用于后续玩法，不重复重放战斗内已经完成的同一状态变化。需要本场立即影响后继的规则通过本场返回 State 表达，不能只等待战斗结束再执行。

装备、盟约本身不是 Unit。Aura 是普通宿主 Effect；非空间共享额度是独立规则事实。这些接入不要求 Aura Capability、EffectSource 或全域事件总线。

## 11. 内容接入

代表内容与共享规则仍需验证 Aura 采样、治疗后装盾、死亡传播、Ammo／SP 事件、全场额度及 Meta 输入／反馈。具体盟约与装备规则由 Content 组合领域操作，Effect core 维护通用实例契约。

新增内容沿语义闭合的调用链接入，使用普通返回对象和直观线性代码。只有真实接续样板妨碍阅读时，才评估小型状态组合函数；不为代码形状另建通用解释器。

## 12. 从目标推导的验收

| 验收路径                     | 要证明的结果                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| 泥岩式盾 → 回复 → 结束／充能 | 外层取消 HP 伤害，消耗与回复仍保留；嵌套和后继读取正确版本；输入版本不变             |
| 护盾无人机                   | 治疗报告 → RNG → 目标安装盾；嵌套读取新盾；失败 Tick 不发布进度                      |
| 灼痕死亡传播                 | 明确的宿主击倒触发爆炸、查询目标、顺序伤害及安装；Skill scope 结束不等于每个宿主死亡 |
| 致死回复／倒地复活           | 不因 HP 到零提前移除宿主；内容裁决完成后决定后继，具体恢复量由已核对规则给出         |
| 鼓舞与 Aura                  | 刷新前读旧样本，刷新后读新样本；暂停、离开、恢复按内容；接收实例身份不由几何查询重造 |
| 共享额度                     | 第一次消耗后，嵌套第二次读取剩余额度；每个接收者不各有完整额度                       |
| 技能／Ammo／SP               | 消耗、补充、技能结束与跨单位后继接续状态；不把所有技能视为耗时 Buff                  |
| Action／Projectile           | 已释放弹体独立存在；命中历史先形成，再附着／伤害／停止；等待是可恢复数据             |
| 路线／地图／阻挡             | 临时路线恢复不重抽目标；必要解除／裁撤同步，普通接敌每 Tick 在 Movement 后统一推进；时序差异以对照案例验收 |
| Meta 接入                    | 外层规则可提供本场共享事实、限制与反馈；不写 Meta 对象、不重复应用同一收益           |

验收检查目标结果、正常取消前缀、顺序可见性、确定性及旧输入／旧 View 不变。旧测试可以复用有依据的场景，不能仅为兼容中间实现而保留错误契约。

## 13. 尚未确定的内容语义

特殊覆写、动态优先级、父子结束回调的原生时点及具体内容约束、复活／死亡通知时点、吸血的数值基线、再生与 Healing 的统计范围、盟约变化后刷新时点、特殊位移等仍按真实内容补证或明确项目政策。Effect 的简单同步递归默认顺序见 [Effect 结束流程](effect.md#结束流程)，不将它当作原生行为证据。

这些事项影响某个领域或内容的规则，不阻止确定纯状态输入／输出、同步接续、唯一 Battlefield 转换与外层发布。未证实的行为不写成官方规则；项目采用的简单约定明确标注，出现具体内容依赖时再验证。
