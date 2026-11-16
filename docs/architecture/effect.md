# Effect

Effect 拥有附着实例、私有状态、生效竞争、重复施加、时间与结束。具体 Definition 组合各领域操作实现属性效果、护盾、周期输出和光环。公共类型与操作见 [unit/effect](../../src/core/unit/effect/index.ts)；通用协议见[接口约定](api-conventions.md)、[Hook](hook.md)、[Lifetime](lifetime.md)和[状态接续](functional-core.md)。

普通 HP 与负生命债务由 [Vitality](vitality.md) 持有，Effect 只提供启用条件与专属行为。屏障／独立吸收额度可以放在 Effect 私有状态，通过资源 Hook 响应；过量治疗转换读取固定的 overflow，不重复维护生命债务或临时 ES。具体保护和转换内容仍见[支持缺口](tactical-semantics.md)。

## 关键语义

- 安装、存在与实际生效分开。零时长仍执行安装业务，随后结束，不短暂启用。
- 重复施加先决定新建、合并或拒绝；只有新建登记身份、Lifetime 并运行 onInstall，候补也不例外。
- 整体覆写先选赢家再检查 enabled；禁用赢家不让弱者补位，赢家结束后候补才可能生效。
- source 记录来源，不自动建立依赖；宿主所有权与显式 Scope 决定随谁结束。
- DURATION 在 ACTIVE／INACTIVE 都扣时，只有 ACTIVE 执行业务；最后一次业务先于到期，回调续期按最新状态生效。
- 层数变化先发布再通知；结束先撤销输出、等待依赖，再收尾移除。

## 1. 目录与职责

`core/unit/effect/` 提供通用实例、异构容器、安装与生命周期；`core/effects/` 提供标准规则成品；`content/` 提供具体角色的程序及标准成品的使用方式。

Unit.effects 保存实例，Unit.hooks 保存登记；属性与限制贡献归对应 Capability。Effect 不解释 HP／EP 的结算流程，完整资源协议由 [Resource](resource.md) 说明。

## 2. Definition、实例与泛型

Definition 是共享行为；实例保存稳定身份、宿主、实际来源、私有 state、expiration、enabled 与 lifecycle。初始 state、来源、Scope、时间与启用许可属于本次安装输入，不覆写 Definition 的规则。Unit 初始化为空 Effects，初始效果在宿主登记后的 enter 程序中正常安装。

私有状态类型与宿主能力要求由具体 Definition 配对，精确 Ref 保持它们。普通查询返回完整实体但不承诺未知私有形状；异构存储及调用自身 Definition 的边界集中擦除类型，内容不逐个断言私有 state。

普通与 STACK 的 Definition／Effect 分开。STACK 额外保存 stackCount，私有 state 不承担通用层数。END 允许全部 Expiration；DECAY 仅允许 DURATION／INFINITE，不能使用缺少重启预算的 DEADLINE。这项配对贯穿安装、回调与时间写回；具体内容选定 END 或 DECAY 后取得准确上下文类型。

### 不可变 Effects 容器

Effects 保存完整实例和宿主内单调分配的 ID。Ref 的身份为宿主与局部 ID；重新生效或修改 state 不改变身份。Definition 对象身份查询可恢复具体类型，仅字符串 ID 相同不能互相代替。

容器只管理存储，不派发业务。旧版本保持可读，诊断 Snapshot 不承担恢复 Definition 或运行程序的协议。内容使用领域操作，不直接替换完整实例。

## 3. 生命周期约束

安装要求宿主 PRESENT、输入 Scope 可用。先发布 INSTALLING 实例并登记 Unit 所有权和显式依赖，再调用 onInstall。来源允许已经退场；确实需要随来源结束的内容另外绑定 Scope。

Action Scope 绑定本轮 Execution，Skill Scope 绑定本轮 Activation，Burst 本身使用 Effect Scope。任一上游结束都会请求本实例结束；依赖不共享时间轴。INSTALLING／INACTIVE Effect 与 INACTIVE Mechanism 仍可作为可用依赖，开始结束的上游拒绝新绑定。资格与请求完成规则统一由 [Lifetime](lifetime.md) 定义，不从 HP 或空间存在推导生命周期。

## 4. 生效状态与覆写

INSTALLING 已登记但尚未运行生效／推进；ACTIVE 执行输出；INACTIVE 保留实例与私有进度但不执行业务；ENDING 不再正常参与，等待收尾移除。enabled 表达外部许可，与竞争决定的 lifecycle 不同。

同宿主同完整组先在未结束实例中选最高 priority，平局取先安装者，再检查 enabled。禁用最强者仍占组位置；它结束后才协调候补。重新生效调用 onEnable，不重跑 onInstall，也不默认重置状态或样本。

Effect 整体竞争、属性 Contribution 的有效项选择、Hook 的阶段顺序和本次业务资格各有自己的职责，不能互相替代。

### 重复施加与叠层

| 政策 | 同组已有实例时 |
| --- | --- |
| DEFAULT | 新建并参与整体生效竞争。 |
| UNIQUE | 拒绝安装，未生效实例也占位。 |
| STACK | 保留实例、按上限加层，剩余时间取较大值；满层是否刷新由配置决定。 |
| EXTEND | 保留实例，以本次完整持续时间补足剩余时间；无限输入可使其无限。 |
| EXTEND_TIME | 保留实例，有限输入同时增加完整预算和剩余量；无限输入不参与加算。 |

未声明组的安装互相独立。完整组的重复政策必须一致；合并使用保留实例的规则，并保留其 Definition、身份、来源、私有状态及依赖。有限续时按当前时间形式写回，DURATION 保留速率，DEADLINE 依据当前 Tick 计算期限。

STACK 实际上限控制可积累层数，有效上限控制业务取值，null 表示无上限。到期 END 结束整个实例；DECAY 尚有多层时减一并重置 `remaining = duration`，最后一层结束。无限期不会自然衰减。

onStackChange 接收已经发布的新实例和旧实际层数 previous；实际层数改变即调用，即使有效层数未变。INACTIVE 也通知变层，内容须避免恢复已撤销的贡献；onEnable 按最新层数恢复输出。满层仅刷新时间不通知，初建由安装／启用程序处理。

decreaseStack 是完整减层操作：剩余层数先发布再通知，耗尽正常结束；手动减层保留剩余时间，自然 DECAY 同时发布重启预算。层数如何改变实际输出由 Definition 与所属 Capability 操作表达。

依据见[合并分支](../research/cases/01-buff-installation-and-parent-scope.md#82-普通-buff-合并分支)与[到期流程](../research/cases/01-buff-installation-and-parent-scope.md#9-2026-11-11-补核覆盖组身份与-stack-到期)。先决定重复结果再执行安装程序是明确项目选择。

### 来源分组

组限于同一宿主，independentSource 是否启用也是身份的一部分：

| 情况 | 分组身份 |
| --- | --- |
| 不按来源独立 | group.id |
| 按来源独立，来源关联 Card | group.id 与 Card 身份 |
| 按来源独立，来源没有 Card | group.id 与 Unit 身份 |
| 按来源独立，没有来源 | group.id 与 null |

共享组 x 与独立无来源组 `(x, null)` 不匹配；Card 与 Unit 属于不同身份域。Card.deployedUnits 保存本场成功部署历史，来源退场后仍可反查，旧弹道及再部署保留同一 Card 分区，不同 Card 不合并。无 Card 的预置对象按各自 Unit 区分。

Core 安装时采样 groupSource；调用者只传实际 source。该样本不替换 Effect.source，也不成为 Lifetime 依赖。来源由具体机制决定，例如海嗣转发宿主浊心斯卡蒂的身份。

这是明确的项目简化，不复刻原生匿名组迁移与 Character 前缀查找；实际内容影响见[来源分组调查](../research/cases/01-buff-installation-and-parent-scope.md#99-分组简化的实际内容影响)。

## 5. 回调与同步操作

onInstall 是新实例登记后的一次性程序，早于生效协调；onEnable／onDisable 对应输出启停；onTick 只在当前 ACTIVE 时执行；onStackChange 响应保留实例变层；onEnd 在依赖已清理且实例仍为 ENDING 时收尾。

onInstall 返回后重读实例与时间：仍 INSTALLING 才先结算到期，然后转 INACTIVE 并协调生效。安装回调可以续期，也可结束自己或宿主；外层流程不能恢复已经结束的实例。零时长只执行安装和结束，不运行 onEnable／onTick／onDisable。

启停先发布新 lifecycle 再运行回调。onDisable 的多个领域操作不是整体原子事务；需要随标记立即失效的事实必须在相应发布中建立。

### 公开 API

具体声明见[公共入口](../../src/core/unit/effect/index.ts)。install 新建或合并成功返回所保留实例的 Ref，拒绝返回 null；回调结束该实例不撤销创建／合并事实。可能合并的返回类型不能冒用传入 Definition 的私有状态，只保留实际可证明的普通／STACK 及到期政策，具体类型由原 Definition 身份恢复。

setState 仅改私有数据，各 lifecycle 均可写入，不恢复实例或刷新静态输出；需要更新贡献的内容显式调用所属领域操作。setEnabled 完整结算启停。setExpiration 只替换合法时间状态，不立即推进、到期或改 Lifetime；remaining 写零仍由既定检查点结算。时间写回保留 Ref 的普通／DECAY／Burst 约束。

### 结束流程

Effect 的 Prepare 发布 ENDING，并对原 ACTIVE 实例调用 onDisable 撤销输出、协调组候补。随后等待依赖者完整 Finalize，调用当前实例的 onEnd，再移除并注销关系。候补在 Prepare 阶段协调，早于原实例 onEnd；宿主 LEAVING 时不启用候补。

请求与完成、首次原因及嵌套结束的边界见 [Lifetime](lifetime.md#请求与-prepare)。onEnd 请求 Unit 离场会先标记 LEAVING，但所有权保护宿主直到整个 Effect Finalize 返回。普通 onTick 没有相同的调用栈保护；后继按业务资格接续最新状态。

## 6. 时间推进

Runtime 每 Tick 在 Schedule／Unit tick 后、Elemental／Skill 前调用一次 Effect.advance，固定本次身份候选；新装实例不加入已经固定的候选。

Expiration 有三种形式：DURATION 保存完整重启预算 duration、当前 remaining 与自动扣量 rate；DEADLINE 保存绝对 Tick；INFINITE 不自动到期。remaining 可大于 duration，刷新当前余量不自动改重启预算。

ACTIVE／INACTIVE 先自动扣减并发布时间，再仅对 ACTIVE 调用 onTick；第三参数保存本次推进前的时间样本。随后重读实例和时间，按普通／STACK 政策到期。自动扣到零仍执行最后一次业务，回调续期或转换时间形式以最新结果为准。

rate=0 不自动扣时，但 ACTIVE 仍运行 onTick；DEADLINE／INFINITE 的 ACTIVE 实例也照常执行业务。INACTIVE 不补发暂停期间的输出。周期相位归具体 Definition，不为所有 Effect 建立通用周期器或 Aura 阶段。

### 必要回归场景

安装中续期／结束、零时长不短暂生效、五种重应用、STACK 实际／有效层数与衰减、停用扣时、rate=0、末次业务与回调续期集中由[语义验收](verification.md)保障。具体效果只验证自身新增的玩法结果。

## 7. Capability 的接入

### Hook：函数与资格闭包

Effect 可以在安装时登记稳定 Hook，在结束时撤销。闭包捕获精确 Ref 和静态配置，运行时读取当前实例、生效资格与私有进度；不能以安装时盾数代替当前值。消耗先发布，再调用可能重入的业务。

Hook 的类型化 Key、优先级、候选和替换统一见 [Hook](hook.md)。领域决定时点与停止条件，Effect 自己判断本次是否有效。没有盾层不意味着负责补盾的实例必须结束。

### Contribution：由 Capability 持有的数据包

属性输出通常在 onEnable 登记、onDisable 撤销；静态采样或动态求值由所属领域和内容决定。setState 不隐式刷新已登记输出。

Contribution 选择与计算见[属性与贡献](capability.md#属性与贡献)。贡献竞争的同级 ID 决胜与 Effect 覆写的安装先后是不同既定政策。

## 8. Aura 的支持边界

Core 没有通用 Aura 成品，具体光环尚未完整接入。现有组合边界是：宿主 Effect 保存目标登记、精确子 Ref 和刷新进度，通过 Targeting 选择接收者并安装普通 Effect。进出、替换样本、停用及恢复是否保留身份由具体内容决定。

子效果必须随 Aura 结束时绑定其 Effect Scope；允许残留时不绑定。Scope 负责生命周期，不代替具体刷新或残留政策。未实现范围集中见 [Tactical 语义](tactical-semantics.md)。

## 9. 状态返回、可见性与不可变约定

self 是回调输入版本，跨 Tick 进度归实例 state，不是异步句柄。完整操作返回后接续 BattleState，需要实时事实时重新读取，不回填旧 Unit／Effect。

不可变共享、失败不发布和同步结算范围以 [Functional Core](functional-core.md) 为准；本页不重复一套 Effect 专用协议。

## 10. 标准效果库与候选范围

### 候选范围

通用控制、保护、受选限制、伤判、属性效果与元素爆发的必要语义依据见[异常与反制](../research/cases/19-effect-selection-and-immunity.md)、[启动与中断](../research/cases/08-action-eligibility-and-interruption.md)以及[资源机制覆盖](../research/cases/37-resource-mechanism-coverage.md)。这些种类不是封闭 Effect 枚举，也不意味着已有对应成品。

### 需要区分的基础机制

异常免疫／组合免疫判断状态是否有效，反制清除既有状态并阻止新增，抵抗改变适用效果的时间，技能强启具有独立的许可与清理业务。它们不等于拒绝整个 Effect 安装；位移、传送和失衡许可也归各自空间操作。

### 目录与职责

标准成品位于 [core/effects](../../src/core/effects)：control、protection、visibility 和 elemental。通用附着引擎不认识具体角色；Content 决定成品的对象、时点、参数与额外业务。Data 可为已有工厂绑定静态数值，不执行运行程序。

Elemental 拥有 EP 与当前 Burst 引用；标准元素 Effect 实现伤害、控制、修正和周期业务，共同恢复与结束归 [Elemental](elemental.md)。

### 支持范围

当前标准元素库实现五型十套效果。狂躁使用具体 Effect 的私有 State、Action／Skill Hook 与独立周期；根与子程序的计时及清理关系见 [Elemental](elemental.md#狂躁的行动与时间累加)，不改变通用 Effect 到期协议。control.silence 仅限制 Skill 发动，不代表完整沉默／静默。

stun 向已有 Action、Locomotion、Skill、Blocking 与 Facing 登记各自限制并取消当前 Action；停用只撤销自身登记。Facing 强制转向只绕过转向限制，不恢复其他能力。

healFree 按标准 Definition 身份及 ACTIVE 状态限制普通 HP 治疗选择，不登记通用受选贡献，也不禁止明确目标的 HP／EP 治疗接收。资源阶段、伤判和死亡通知统一见 [Resource](resource.md)。具体尚未闭合的机制集中列于 [Tactical 语义](tactical-semantics.md)。
