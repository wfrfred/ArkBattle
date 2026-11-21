# Action 设计

Action 管理行动程序的启动、冷却、执行进度与终止；Content 决定目标、输出和与 Skill／Effect 的组合。[公共入口](../../src/core/unit/capability/action/index.ts)提供具体类型与操作。通用变更、状态接续、Hook 和析构分别遵守[接口约定](api-conventions.md)、[Functional Core](functional-core.md)、[Hook](hook.md)和[Lifetime](lifetime.md)。

## 关键语义

- 每种配置具有持久 Action 和独立 Cooldown，每次启动产生新的 Execution 身份；结束保留持久状态和冷却。
- 同宿主同配置至多一个未完成执行；ACTIVE 与 ENDING 都占位。不同配置可同时执行，互斥与抢占由 Content 表达。
- 启动 Restriction 只控制新执行；需要打断现有执行时显式取消。
- 释放拦截、成功释放和实际输出是不同业务时点。后续取消不撤销已完成的前缀业务。
- 冷却变更保留指定的时间进度；完成或取消不默认重置，错过的机会不积攒补发。

## 1. 状态与领域职责

Unit 的 Action Capability 保存宿主的攻速／基础攻击间隔 Attribute、行动容器、宿主内执行身份计数和启动限制。容器中每项 Action 聚合 Definition、持久 state、Cooldown 与可空 execution。Execution 是按本轮身份读取的同一聚合，execution 确定非空；执行私有数据与持久数据分开。

Definition 提供基础时序、持久初始化、prepare、onTick 和可选 onEnd。宿主 Ref 由内容回调参数传入，聚合不重复保存 host。Runtime 负责调度；Action 不拥有全场执行集合。

## 2. 模块与导入

`unit/capability/action/` 集中装配、宿主属性、释放 Hook，以及行动聚合、冷却与执行操作。公共入口用 `ActionCapability` 表示宿主能力，用 `Action` 表示单项行动。

## 3. Definition、Action 与 Execution

Content 在 Action Capability 的 `definitions` 中按顺序声明行动。Capability 装配时逐项接续 BattleState，执行 Definition 的持久初始化，并保存带就绪冷却和空执行槽位的 Action。`select` 仍由 Content 决定运行时选招。共享 Definition 的不同宿主分别产生私有状态。初始化期间宿主尚未登记，也不能假定兄弟能力已完成装配。

`Definition<P, E, H>` 声明持久状态 `P`、执行状态 `E` 和额外宿主要求 `H`。`prepare`、`onTick` 和 `onEnd` 的 `source` 类型是 `Ref<Unit & ActionCapability & H>`。回调的 `self` 使用 `Action<P, E>` 或 `Execution<P, E>` 保留私有状态类型。只依赖 Action Capability 的程序可使用默认的 `H`。

Content 先声明具体的行动 Definition，再在具备所需能力的 Unit 配置中组装行动列表。`CapabilityDefinition<H>` 在组装处校验行动与宿主的配对，并为 `select` 提供对应的宿主类型。例如，声明了 `Offense` 的行动在查到宿主后可以直接读取攻击力。

prepare 检查本次内容条件、初始化执行数据并采样；返回 null 表示未启动，已经完成的状态变化仍接续。需要执行身份的伤害、召唤、绑定 Effect 等业务放在登记后的 onTick；prepare 不递归启动自己或改变来源配置。

`onTick` 返回接续的 BattleState。程序正常完成时调用 `finish`，取消时调用 `cancel`。本轮进度由执行状态操作发布，需要被嵌套业务观察的进度先提交。

## 4. 异构容器与两种引用身份

行动按配置 ID 登记，重复 ID 在创建边界拒绝。异构容器内部擦除 `P/E`。普通查询通过已有 `Snapshot` 类型提供公共字段，并保留 Definition 对象身份。Battle 按配置 ID 启动行动，按执行引用推进。Action 操作从宿主读取已登记的聚合，在调用回调或写回时恢复类型。按 Definition 对象身份查询或使用精确 Ref 可以恢复持久状态和执行状态的类型。

持久 Ref 由宿主和 Definition 对象标识，跨多轮有效。构造时，`ref` 的宿主参数必须满足具体 Definition 的 `H`。`executionRef` 根据已配对的宿主和本轮执行构造精确引用。`ExecutionRef` 表示宿主和本轮执行 ID，可用于 `forUnit` 查询返回、释放通知和取消命令。执行 ID 在宿主内单调分配，不回收，旧引用不能操作后来的执行。`getExecution` 与 `hasExecution` 均读到仍占位的 ENDING 本轮，直到该轮清空。

配置登记顺序用于默认候选；本宿主已有执行按启动顺序枚举。诊断序列化不承担恢复 Definition 或程序的协议。

## 5. Capability 与冷却

Action Definition 的 period 明确选择 ATTACK_SPEED 或 FIXED。前者读取 Capability 的有效攻速／基础间隔，后者使用自身 ticks；两份 Action 的周期相同不表示共享冷却状态。周期策略属于持久 Action，不放在单轮 Execution。

间隔／速度 Attribute 的贡献只接受静态修正列表。贡献或范围 Change 完成全批发布后，在 Settlement 按最新周期只刷新 ATTACK_SPEED 的 Cooldown，并保留完成比例；FIXED 不受这些变更影响。Content 不手工补刷新，Combat 不逐 Tick 轮询刷新。依赖其他运行事实的速率变化由所属机制在适当时点重新提交贡献。

普通攻击周期为修正间隔 × 100／限制后的速度：攻速属性默认下限20，可由属性范围覆写；周期公式独立将攻速限制在10–600，有效普通攻击周期至少一 Tick。依据见[属性与周期范围](../research/cases/39-death-attribution-and-attribute-ranges.md#属性范围与消费者限制分开)。纯 Cooldown 与 FIXED 支持非负连续周期，不替具体攻击决定量化政策。

ATTACK_SPEED／FIXED 只决定周期求值。现有 Action 在启动时重置、自身执行期间继续计时；敌人技能独立的首次等待、模式暂停、自身施放暂停和结束重置仍由其内容程序组织，不因配置 FIXED 自动获得。

reset 从当前时刻开始完整周期，clear 立即就绪。成功启动开始冷却，本轮结束保留当前冷却。周期变化不缩放已采样的执行等待，普通攻击不足一 Tick 余量的节奏补偿归内容模板。

哈蒂娅 S2、雷狼龙 S 空爆等通过保留已过时间调整本轮技能持续预算。项目由 Skill 的 `extendTime()` 修改该轮截止 Tick。 [计时调查](../research/cases/07-action-timing-and-animation.md#2026-11-20-补核保留已过时间的实际用途)

### 攻击方式

Action Definition 显式提供 `applyWay`。攻击工厂从伤害与元素损伤操作合并方式，纯治疗生成 `NONE`。自定义输出显式提供自身方式，并供实际输出复用。伤害请求的 `applyWay` 表达该笔输出。

`getApplyWay(unit)` 合并单位所有已注册 Action 的 Definition，同一方式重复计入仍保持该值，近战和远程合并为 `ALL`，空集合为 `NONE`。普通单位和 Enemy 都按这一规则，空闲、冷却和当前 Execution 不影响结果。弩手注册近战与远程，因而得到 `ALL`。这是项目选择，原生模式汇总与敌人资料查询见[攻击方式调查](../research/cases/36-unit-classification-and-combat-tags.md#23-守林人目标的攻击方式)。

## 6. 完整启动、写回与终止

start 先检查配置身份、宿主资格、执行占位、限制与冷却，再运行 prepare；返回后按最新宿主、聚合和周期复查。仍可启动时才一次发布 Execution、Cooldown 与身份计数，并登记 Execution→Unit 所有权。普通拒绝不分配身份或开始周期，Result 保留准备程序已经提交的业务。start 只登记，首次执行由调度器调用 advance。

持久状态、执行状态和冷却各有字段级写回，只替换对应字段。写入私有状态需要与相应 Definition 配对的精确 Ref。结束程序可以更新仍登记的本轮私有状态，写回保留执行身份和 ENDING。缺失身份或 Definition 错配属于调用错误。最新读取和不可变发布遵守公共契约。

`finish` 请求 FINISHED，`cancel` 请求 CANCELLED。终止发布 ENDING，等待依赖者结束后将结果传给 onEnd，再只清空同一轮 execution，保留最新持久状态／冷却并输出结束事实。Lifetime 保护宿主到整个 Finalize 返回；它不保护任意普通 onTick 调用栈。嵌套结束请求返回时本轮可能仍占位，同一结算中立即重启可能被拒绝。

cancelForUnit 从当前状态取得执行 Ref 候选并逐项取消；Unit 真实离场通过所有权边传播。对 Action 报告的 SOURCE_ABSENT 与向依赖者传播的原离场原因分别保留。

## 7. 调度

Combat 固定入口的 Unit 与已有执行候选。对每个宿主先推进原执行，再读取最新来源；仍为 ACTIVE 且空间存在才运行可能消费 RNG 的 select。未配置 select 时采用已登记配置，候选去重后逐项启动；每项仍使用最新资格。

自动启动成功后，同 Tick 显式推进返回的 Execution；每个自动候选只尝试一次，即时完成不循环重启。内容直接或嵌套 start 仅登记，已固定候选之后产生的执行等后续调度。`advance` 检查执行与宿主资格，再直接接续 `onTick` 返回的 BattleState。[Presence](presence.md)通过启动限制和取消操作表达消失。

## 8. 普通攻击、释放 Hook 与移动

[普通攻击模板](../../src/content/actions/attack.ts)在 prepare 绑定目标与时序；首次 onTick 先发布开始进度，再调用可选 onStart。实际输出通过[资源操作](resource.md)执行，弹道使用独立 Projectile 生命周期。面向由具体程序调用 [Facing](capability.md#facing)；通用 Action 不推断转向。

时序程序归 Content，只消费静态业务参数，不把 Animator、Spine 或渲染状态引入 Core。FIXED 使用明确的前摇与恢复 Tick；ATTACK_SPEED 使用起手段、主段长度、主段内释放位置与缩放范围，参数由 [Data](data.md)转换。

设宿主有效普通攻击周期为 T、起手段长为 B、主段长为 L，缩放量为 `a = clamp(T / (B + L), minScale, maxScale)`，无上限时只限制下限。T独立读取宿主属性，不以本 Action 的 FIXED 冷却代替。开始时缓存动作预算 `(B + L) × a`；起手段的等待进入后固定，进入后续主段时可以用最新周期重新求释放时间。已经进入的等待与释放截止时间不随后来的改速重新缩放，冷却仍按自身契约更新。

事件等待最晚在 `startedAtTick + max(1, RoundToEven(cachedDuration))` 超时释放，后继主段改速不延后该缓存期限。释放后等待缓存预算扣除已用时间的余量，不再加一个完整恢复段或攻击周期。

分段固定等待和事件等待超时均按取偶舍入、最少一个 Tick，依据原生等待器；初次 yield 已计入等待，不再额外增加一个 Tick。本项目在 30 Hz 推进中，于首个达到标称事件时间或量化期限的整数 Tick 处理，不复刻官方动画事件与协程的帧内调度，也不称为实测官方释放帧，依据见[计时调查](../research/cases/07-action-timing-and-animation.md)。

玫兰莎的起手由具体内容保存攻击会话：首次带 Begin，同会话续轮只用主段，失去目标或中断后重新起手；收尾显示段不额外占用执行。

beforeRelease 返回继续或中断及恢复时长；released 表示已到达成功释放点，先于伤害／治疗输出。派发要求当前执行与宿主均为 ACTIVE，首个中断停止；恢复信息交给具体攻击，不增加通用 Unit 恢复字段。

攻击通过拦截后记录 ACTION_RELEASED、派发 released，再读取最新执行的输出载荷。释放通知可以取消执行或结束宿主，此时旧输出停止，已完成的释放事实和回复保留。Skill 在此登记 ACTION 回复，Action 本身不读取 Skill。

攻击模板的伤害 `power` 可以是固定值，也可以在每个目标结算前根据实时 BattleState 读取。`sourceAttack` 要求宿主具备 `Offense`，连续命中间发生的属性变化可影响后续目标。固定值伤害不要求 `Offense`。

afterOutput 只在对应执行仍 ACTIVE 时进入，不是无条件清理回调；它自身也可取消执行或结束技能。回调后重新读取同一身份，避免重复完成。已经发生的输出、耗弹与后继责任由具体内容的消费时序决定。

[弹药行动组合器](../../src/content/actions/skill.ts)在启动时采样 Activation Ref，并在自己的 afterOutput 消费及检查该轮弹药；旧攻击不能消费后来激活的弹药。跨轮起手、连续会话和模式事实由具体内容持有，失败启动不消费。

Locomotion 的移动许可独立判断当前状态；敌人可登记 casting 限制。Action 字段发布不自动维护 Blocking，改变阻挡资格的内容须显式复核关系。

## 9. 机制依据与领域协作

原生依据见[行动与弹道](../research/cases/02-action-and-projectile-phases.md)、[计时与动画](../research/cases/07-action-timing-and-animation.md)、[启动与中断](../research/cases/08-action-eligibility-and-interruption.md)。弩手近战／远程需要独立冷却；执行占用与冷却就绪是不同事实。

验收集中在[语义清单](verification.md)：启动拒绝、持久／本轮身份、静态时序变更、释放与输出、中断和调度。通用 Hook、Change、Lifetime 不因接入 Action 再复制测试。
