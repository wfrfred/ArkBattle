# Effect

Effect 拥有可附着或独立存在的运行实例、私有状态、生效竞争、重复施加、时间与结束。具体 Definition 组合各领域操作实现属性效果、护盾、周期输出和光环。公共类型与操作见 [effect](../../src/core/effect/index.ts)；通用协议见[接口约定](api-conventions.md)、[Hook](hook.md)、[Lifetime](lifetime.md)和[状态接续](functional-core.md)。

普通 HP 与负生命债务由 [Vitality](vitality.md) 持有，Effect 只提供启用条件与专属行为。屏障／独立吸收额度可以放在 Effect 私有状态，通过资源 Hook 响应；过量治疗转换读取固定的 overflow，不重复维护生命债务或临时 ES。具体保护和转换内容仍见[支持缺口](tactical-semantics.md)。

## 关键语义

- 安装、存在与实际生效分开。零时长仍执行安装业务，随后结束，不短暂启用。
- 重复施加先决定新建、合并或拒绝；只有新建初始化私有状态、登记身份和 Lifetime 并运行 onInstall，候补也不例外。
- DEFAULT 整体覆写先选赢家再检查 enabled；禁用赢家不让弱者补位，赢家结束后候补才可能生效。其他组不参与优先级竞争。
- source 记录来源，不自动建立依赖；宿主所有权与显式依赖决定随谁结束。
- DURATION 在 ACTIVE／INACTIVE 都扣时，只有 ACTIVE 执行业务；最后一次业务先于到期，回调续期按最新状态生效。
- 层数变化先发布再通知；结束先撤销输出、等待依赖，再收尾移除。

## 1. 目录与职责

`core/effect/` 提供通用实例、查询、安装与生命周期；`core/effects/` 提供标准规则成品；`content/` 提供具体角色的程序及标准成品的使用方式。

`effect.ts` 定义实例及身份，`definition.ts` 定义共享程序，`group.ts` 定义分组规则并处理纯合并计算，`expiration.ts` 提供时间类型和纯时间算法，`query.ts` 负责实例、同组成员、竞争结果与有效层数查询。`operations.ts` 负责安装、启停、层数与时间的业务提交、生命周期结束及 Tick 推进。

`BattleState.effects` 统一保存全部 Effect 实例。有宿主时通过宿主 Ref 查询，Unit.hooks 继续保存本地 Hook 登记；属性与限制贡献归对应 Capability。Effect 不解释 HP／EP 的结算流程，完整资源协议由 [Resource](resource.md) 说明。

## 2. Definition、实例与泛型

Definition 是共享行为；实例保存稳定身份、实际来源、私有 state、expiration、enabled 与 lifecycle，Ref 携带可空的宿主引用。`Initial` 是非泛型的本次安装输入，包含四个必填字段：`source`（可空的来源 Unit Ref）、`scopes`（依赖 Ref 数组）、`expiration`（时间状态）及 `enabled`（启用许可）。没有来源、额外依赖或到期限制时，也分别显式提供 null、空数组和 INFINITE。

私有 state 统一由 `Definition.initialize(battle): S` 构造，可以读取本次安装时的战斗事实。只有确定新建实例后才调用；合并或拒绝不初始化，也不从安装输入覆盖私有 state。有宿主的初始效果在宿主登记后正常安装，无宿主程序可以由 `initialEffects` 开场安装，每项均提供 Definition 与完整 Initial。

`Effect<S, H>` 是基础实例；`StackEffect<S, H>` 继承它，增加 `stackCount` 和具体叠层定义。`S` 表达私有状态，`H extends Lifetime | null` 表达宿主要求，任意已登记且可用的 Lifetime 可作为宿主，`null` 表达无宿主。精确 Ref 保留具体私有状态、宿主和叠层实例类型；普通查询返回基础 `Effect`，通过 `hasStack` 按 `stackCount` 字段是否存在收窄叠层实例。

`Definition<S, H, Self>` 与 `StackDefinition<S, H, Self>` 在内容声明时保留具体回调所接收的 self 类型，叠层回调可直接读取 `stackCount`。实例持有 `Self = never` 的共享定义，运行时仅在已经配对的真实实例与自身 Definition 的调用边界恢复该类型，不另建回调视图。普通查询不承诺未知私有状态的形状，内容不需要逐个断言自己已声明的类型。

`Expiration` 不再携带叠层政策泛型。普通效果与 END 叠层允许全部时间形式；DECAY 只允许 DURATION／INFINITE，不能使用缺少重启预算的 DEADLINE。安装和 `setExpiration` 在实际输入边界依据叠层定义检查该约束。

### 存储与查询

`BattleState.effects` 使用通用 `Store<Ref<Effect>, Effect>`，以 Ref 为键全局保存完整实例。安装新实例时分配一次 Ref，并从 `execution.nextEffectId` 取得全场递增的数字 ID，用于生成独立的 Hook／Contribution 登记名及稳定排序。合并与拒绝不分配新身份。

`all(battle)` 按登记顺序枚举，`forHost(battle, host)` 读取指定宿主的实例，`host = null` 读取无宿主实例。已知精确 Ref 时直接调用 `reference.get(battle)`；已知 Definition 时使用 `effects.get(battle, reference, definition)` 按 Definition 对象身份恢复对应的 `Effect<S, H>` 或 `StackEffect<S, H>`，不额外恢复任意 Self 子类型。重新生效或修改 state 沿用同一个 Ref。

Effect 的内部写回与注销直接使用 Store 的 `replace`、`remove`，遵守通用 Store 契约。旧版本保持可读。内容使用领域操作，不直接替换完整实例。

## 3. 生命周期约束

安装要求存在的宿主及输入的依赖引用均通过 Lifetime 可用性检查。决定新建后由 Definition 初始化私有 state，发布 INSTALLING 实例并登记对宿主（如果有）与输入引用的依赖，再调用 onInstall。来源允许已经退场；确实需要随来源结束的内容另外绑定依赖。

Action 与 Skill 的依赖分别绑定本轮 Execution 和 Activation 的 Ref，Burst 使用 Effect Ref。任一上游结束都会以 `CANCELLED` 请求 Effect 结束，Effect 保有自己的时间轴。INSTALLING／INACTIVE Effect 仍可作为可用依赖，开始结束的上游拒绝新绑定。资格与请求完成规则见 [Lifetime](lifetime.md)。

## 4. 生效状态与覆写

INSTALLING 已登记但尚未运行生效／推进；ACTIVE 执行输出；INACTIVE 保留实例与私有进度但不执行业务；ENDING 不再正常参与，等待收尾移除。enabled 表达外部许可，与竞争决定的 lifecycle 不同。

仅 DEFAULT 组拥有 priority。同宿主同完整 DEFAULT 组先在未结束实例中选最高优先级，平局取先安装者。`wins` 只判断竞争结果，不检查 enabled 或 Lifetime 可用性；实际启用操作同时检查这些条件。禁用最强者仍占组位置；它结束后才协调候补。UNIQUE、EXTEND、EXTEND_TIME 和 STACK 通过拒绝重复或合并来保留唯一实例，不参与生效竞争。重新生效调用 onEnable，不重跑 onInstall，也不默认重置状态或样本。

Effect 整体竞争、属性 Contribution 的有效项选择、Hook 的阶段顺序和本次业务资格各有自己的职责，不能互相替代。

### 重复施加与叠层

| 政策 | 同组已有实例时 |
| --- | --- |
| DEFAULT | 新建并参与整体生效竞争。 |
| UNIQUE | 拒绝安装，未生效实例也占位。 |
| STACK | 保留实例、按上限加层，剩余时间取较大值；满层是否刷新由配置决定。 |
| EXTEND | 保留实例，以本次完整持续时间补足剩余时间；无限输入可使其无限。 |
| EXTEND_TIME | 保留实例，有限输入同时增加完整预算和剩余量；无限输入不参与加算。 |

未声明组的安装互相独立。安装匹配到同一完整组中尚未进入 ENDING 的实例时，要求重复施加类型一致，STACK 还须采用相同的 END／DECAY 到期政策。配置冲突会抛出 TypeError。合并使用保留实例的规则，包括层数上限与满层刷新，并保留其 Definition、身份、来源、私有状态及依赖。有限续时按当前时间形式写回，DURATION 保留速率，DEADLINE 依据当前 Tick 计算期限。

STACK 实际上限控制可积累层数，`stacks(self)` 返回受有效上限限制的业务层数，null 表示无上限。到期 END 结束整个实例；DECAY 尚有多层时减一并重置 `remaining = duration`，最后一层结束。无限期不会自然衰减。

onStackChange 接收已经发布的新实例和旧实际层数 previous；实际层数改变即调用，即使有效层数未变。INACTIVE 也通知变层，内容须避免恢复已撤销的贡献；onEnable 按最新层数恢复输出。满层仅刷新时间不通知，初建由安装／启用程序处理。

decreaseStack 是完整减层操作：剩余层数先发布再通知，耗尽正常结束；手动减层保留剩余时间，自然 DECAY 同时发布重启预算。层数如何改变实际输出由 Definition 与所属 Capability 操作表达。

依据见[合并分支](../research/cases/01-buff-installation-and-parent-scope.md#82-普通-buff-合并分支)与[到期流程](../research/cases/01-buff-installation-and-parent-scope.md#9-2026-11-11-补核覆盖组身份与-stack-到期)。先决定重复结果再执行安装程序是明确项目选择。

### 来源分组

组限于同一宿主 Ref，所有无宿主实例共用 null 分组空间。independentSource 是否启用也是身份的一部分：

| 情况 | 分组身份 |
| --- | --- |
| 不按来源独立 | group.id |
| 按来源独立，来源关联 Card | group.id 与 Card Ref |
| 按来源独立，来源没有 Card | group.id 与 Unit Ref |
| 按来源独立，没有来源 | group.id 与 null |

共享组 x 与独立无来源组 `(x, null)` 不匹配。Card 与 Unit 属于不同身份域。`cardForUnit` 从[部署历史](deployment.md#部署历史)反查来源 Card，来源退场后仍可使用。旧弹道及再部署保留同一 Card 分区，不同 Card 不合并。无 Card 的预置对象按各自 Unit 区分。

Core 安装时采样 `groupSource: GroupSource`，其取值为 Card Ref、Unit Ref 或 null；调用者只传实际 source。该样本不替换 Effect.source，也不成为 Lifetime 依赖。来源由具体机制决定，例如海嗣转发宿主浊心斯卡蒂的身份。

这是明确的项目简化，不复刻原生匿名组迁移与 Character 前缀查找；实际内容影响见[来源分组调查](../research/cases/01-buff-installation-and-parent-scope.md#99-分组简化的实际内容影响)。

## 5. 回调与同步操作

onInstall 是新实例登记后的一次性程序，早于生效协调；onEnable／onDisable 对应输出启停；onTick 只在当前 ACTIVE 时执行；onStackChange 响应保留实例变层；onEnd 在依赖已清理且实例仍为 ENDING 时收尾。

onInstall 返回后重读实例与时间：仍 INSTALLING 才先结算到期，然后转 INACTIVE 并协调生效。安装回调可以续期，也可结束自己或宿主；外层流程不能恢复已经结束的实例。零时长只执行安装和结束，不运行 onEnable／onTick／onDisable。

启停先发布新 lifecycle 再运行回调。onDisable 的多个领域操作不是整体原子事务；需要随标记立即失效的事实必须在相应发布中建立。

### 公开 API

具体声明见[公共入口](../../src/core/effect/index.ts)。`install(battle, host, definition, initial)` 的四个参数均必填；新建或合并成功返回所保留实例的 Ref，拒绝返回 null。回调结束该实例不撤销创建／合并事实。普通与叠层安装各有一个签名，返回 Ref 一律擦除私有状态类型，保留宿主类型及实际可证明的实例类型。具体私有类型由 `effects.get(battle, reference, definition)` 按原 Definition 身份恢复。

setState 仅改私有数据，各 lifecycle 均可写入，不恢复实例或刷新静态输出；需要更新贡献的内容显式调用所属领域操作。setEnabled 完整结算启停。setExpiration 只替换合法时间状态，不立即推进、到期或改 Lifetime；remaining 写零仍由既定检查点结算。时间写回保留 Ref 已明确的时间类型（例如 Burst 的 DURATION），并在运行时拒绝 DECAY 叠层的 DEADLINE。

### 结束流程

`remove` 按 Ref 请求终结 Effect，默认原因为 `EXPLICIT`。Prepare 先发布 `ENDING`，按开始结束时的生命周期决定是否调用 `onDisable` 撤销原有输出；仅 DEFAULT 组需要再协调候补。依赖者完整 Finalize 后，调用当前实例的 `onEnd`，再移除实例。宿主 `ENDING` 时不启用候补。

onEnd 请求 Unit 离场会先标记 ENDING，宿主等到整个 Effect Finalize 返回才注销。普通 onTick 的后继按业务资格接续最新状态。 [请求、首次原因与嵌套结束](lifetime.md#请求与-prepare)

## 6. 时间推进

Runtime 每 Tick 在 Schedule／Unit tick 后、Elemental／Skill 前调用一次 Effect.advance，按全场登记顺序固定本次身份候选，包含所有宿主及无宿主程序；新装实例不加入已经固定的候选。

Expiration 有三种形式：DURATION 保存完整重启预算 duration、当前 remaining 与自动扣量 rate；DEADLINE 保存绝对 Tick；INFINITE 不自动到期。remaining 可大于 duration，刷新当前余量不自动改重启预算。

ACTIVE／INACTIVE 先自动扣减并发布时间，再仅对 ACTIVE 调用 onTick；第三参数保存本次推进前的时间样本。随后重读实例和时间，按普通／STACK 政策到期。自动扣到零仍执行最后一次业务，回调续期或转换时间形式以最新结果为准。

rate=0 不自动扣时，但 ACTIVE 仍运行 onTick；DEADLINE／INFINITE 的 ACTIVE 实例也照常执行业务。INACTIVE 不补发暂停期间的输出。周期相位归具体 Definition，不为所有 Effect 建立通用周期器或 Aura 阶段。

### 必要回归场景

安装中续期／结束、零时长不短暂生效、五种重应用、STACK 实际／有效层数与衰减、DECAY 到期形式的入口约束、停用扣时、rate=0、末次业务与回调续期集中由[语义验收](verification.md)保障。具体效果只验证自身新增的玩法结果。

## 7. Capability 的接入

### Hook：函数与资格闭包

Effect 可以在安装时登记稳定 Hook，在结束时撤销。闭包捕获精确 Ref 和静态配置，运行时读取当前实例、生效资格与私有进度；不能以安装时盾数代替当前值。消耗先发布，再调用可能重入的业务。

Hook 的类型化 Key、优先级、候选和替换统一见 [Hook](hook.md)。领域决定时点与停止条件，Effect 自己判断本次是否有效。没有盾层不意味着负责补盾的实例必须结束。

### Contribution：由 Capability 持有的数据包

属性输出通常在 onEnable 登记、onDisable 撤销；静态采样或动态求值由所属领域和内容决定。setState 不隐式刷新已登记输出。

Contribution 选择与计算见[属性与贡献](capability.md#属性与贡献)。贡献竞争的同级 ID 决胜与 Effect 覆写的安装先后是不同既定政策。

## 8. Aura 的支持边界

Core 没有通用 Aura 成品，具体光环尚未完整接入。现有组合边界是：宿主 Effect 保存目标登记、精确子 Ref 和刷新进度，通过 Targeting 选择接收者并安装普通 Effect。进出、替换样本、停用及恢复是否保留身份由具体内容决定。

子效果必须随 Aura 结束时绑定其 Effect Ref；允许残留时不绑定。依赖关系负责生命周期，不代替具体刷新或残留政策。未实现范围集中见 [Tactical 语义](tactical-semantics.md)。

## 9. 状态返回、可见性与不可变约定

self 是回调输入版本，跨 Tick 进度归实例 state，不是异步句柄。完整操作返回后接续 BattleState，需要实时事实时重新读取，不回填旧 Unit／Effect。

不可变共享、失败不发布和同步结算范围以 [Functional Core](functional-core.md) 为准；本页不重复一套 Effect 专用协议。

## 10. 标准效果库与候选范围

### 候选范围

通用控制、保护、受选限制、伤判、属性效果与元素爆发的必要语义依据见[异常与反制](../research/cases/19-effect-selection-and-immunity.md)、[启动与中断](../research/cases/08-action-eligibility-and-interruption.md)以及[资源机制覆盖](../research/cases/37-resource-mechanism-coverage.md)。这些种类不是封闭 Effect 枚举，也不意味着已有对应成品。

### 需要区分的基础机制

异常免疫／组合免疫影响状态的有效性。已核实的反制可以拒绝含对应异常的整份 Buff，并结束已有的匹配实例。抵抗改变适用效果的时间。技能强启具有自己的许可与清理业务，位移、传送和失衡许可由相应空间操作处理。

复合效果可由父 Effect 管理持续时间和重应用，子 Effect 各自执行标准眩晕、降攻等行为。已用现有接口验证，单独停用或恢复标准 `stun` 时降攻持续生效，父项到期会通过依赖关系清理两个子项。需要跟随父项启停时，由组合的启停回调显式控制子项。要求拒绝整份效果的反制在调用 `install` 前判断，提前解除整份效果时结束父项。

标准眩晕的共享免疫规则及具体反制、抵抗留到对应效果接入时处理。父子组合使用现有 Effect 接口。

### 目录与职责

标准成品位于 [core/effects](../../src/core/effects)：control、protection、visibility 和 elemental。通用 Effect 引擎不认识具体角色；Content 决定成品的对象、时点、参数与额外业务。Data 可为已有工厂绑定静态数值，不执行运行程序。

Elemental 拥有 EP 与当前 Burst 引用；标准元素 Effect 实现伤害、控制、修正和周期业务，共同恢复与结束归 [Elemental](elemental.md)。

### 支持范围

当前标准元素库实现五型十套效果。狂躁使用具体 Effect 的私有 State、Action／Skill Hook 与独立周期；根与子程序的计时及清理关系见 [Elemental](elemental.md#狂躁的行动与时间累加)，不改变通用 Effect 到期协议。control.silence 仅限制 Skill 发动，不代表完整沉默／静默。

stun 向已有 Action、Locomotion、Skill、Blocking 与 Facing 登记各自限制并取消当前 Action；停用只撤销自身登记。Facing 强制转向只绕过转向限制，不恢复其他能力。

control 公开共享的 stunRestriction、silenceRestriction 与 spRecoveryRestriction 定义；不同 Effect 来源以独立登记 ID 引用相应定义。Skill 可按定义身份豁免自身的启动限制，但不会解除异常、撤销登记或改变其他领域的限制，见 [Skill](skill.md#4-restriction程序与-hook)。

healFree 按标准 Definition 身份及 ACTIVE 状态限制普通 HP 治疗选择，不登记通用受选贡献，也不禁止明确目标的 HP／EP 治疗接收。资源阶段、伤判和死亡通知统一见 [Resource](resource.md)。具体尚未闭合的机制集中列于 [Tactical 语义](tactical-semantics.md)。
