# Skill 设计

Skill 管理 SP、发动、持续预算、主动操作与完整终止。Action 管理行动程序，Effect 管理附着影响；具体内容组合它们，不由 Skill 推断攻击内容。领域入口见 [unit/capability/skill](../../src/core/unit/capability/skill/index.ts)。

## 关键语义

- Activation 保存 Skill 本轮发动阶段；结束清空本轮，保留持久状态和资源，旧引用不能操作新激活。
- 发动门槛与支付额由 Activation Definition 显式定义；调用方可以完整指定本次参数。先提交支付与激活，再执行启动通知和程序；已结束的本轮不继续启动。
- 回复、支付和直接增减各自遵守资源契约。满槽或阻回期间不积攒补发。
- 时长和弹药归本轮；延时不改下一轮，消费、耗尽检查、补弹与内容增加弹药分别结算。
- onEnd 读取本轮数据，activationEnded 通知槽位释放后的历史事实。

## 模块与入口

`unit/capability/skill/` 集中装配、贡献、限制和通知，以及技能聚合、SP、弹药和 Activation 的完整操作。公共入口用 `SkillCapability` 表示宿主能力，用 `Skill` 表示技能聚合。登记和写回遵守[接口约定](api-conventions.md)。

SP 可以不存在；hasSp 同时证明配置与状态存在。SP Definition 保存初始值、容量、回复来源及回复速度／倍率两项 Attribute；Activation Definition 保存静态发动门槛、支付额和本轮初始化程序。SP 余额和容量不是 Attribute；弹药容量使用自己的贡献模型。

## 1. 单槽聚合、Definition 与两种身份

每个 Unit 保存一份 Skill 聚合：Definition、持久 state、可空 SP 与可空 activation。Activation 是同一聚合的非空视图，本轮包含身份、开始时刻、生命周期、Duration 与私有状态。Capability 另保存宿主内激活计数、Ammo 贡献和许可。

持久 state 保存跨激活事实，本轮 state 保存当次进度。可直接由 activation 槽位判断的阶段不再重复保存；SP.value 是余额的唯一事实。聚合不重复保存 host，内容程序显式接收宿主 Ref。

Content 在 Skill Capability 的 `definition` 中声明选定技能。Capability 装配时执行该 Definition 的持久初始化，建立私有状态、SP 初态和空激活槽位，并接续返回的 BattleState。Unit 尚未登记时不能查询自己或假定兄弟能力已装配。

### 引用、查询与写回

持久 Ref 由宿主与 Definition 对象标识；Activation Ref 由宿主与本轮 ID 标识。查询保留完整聚合，精确引用恢复私有类型；旧激活 Ref 不读取或更新后来的轮次。

持久与本轮状态有各自写回操作，仅更新对应字段。持久状态可在结束程序更新，本轮 ENDING 后不接受普通私有状态写入。跨完整业务后接续最新状态；通用类型、错误和不可变约定见[接口约定](api-conventions.md)。

## 2. SP

SP 的容量 capacity 与 Activation Definition 的发动门槛 requirement、支付额 cost 分开；requirement 与 cost 均须显式配置。发动须同时满足门槛与足额支付，特殊付款由具体程序使用资源操作完成。

`activate(battle, reference, parameters?)` 的 Parameters 包含必填的 requirement 与 cost。未提供时使用 Definition 的整组静态值；提供时只用于本次资格检查和实际支付，不修改 Definition、SP 配置或后续普通启动。Fever 等内容可以显式传入 `{ requirement: 0, cost: 0 }`，其余启动限制和操作前提照常检查。

recoverySpeed 与 recoveryMultiplier 均须显式提供 [Attribute](attribute.md) Definition，默认下限0。每次查询按当前贡献和范围取得连续值，再相乘得到自然回复速率。贡献或范围 Change 只发布属性；计时器在下一次 SP.advance 读取有效速率，不同步回复或重置余额。

Recovery 为 TIME、ACTION、HIT 或 NONE；EXTERNAL 是显式操作的来源。recover 检查来源与回复许可并限制到容量；pay 要求显式金额，足额支付或失败，不读取发动政策，也不受回复限制；modify 直接增减，普通正增量仍检查 EXTERNAL 许可，负增量不被阻回拦截，forced 只绕过规定的回复限制。三者要求宿主 ACTIVE，具有 Vitality 时仍活着；无 Vitality 的 Skill 宿主也可使用资源。

TIME 配置只表示回复来源，周期由 `TICKS_PER_SECOND / 有效回复速率` 得到；速率非正时不计时。自然回复保留周期、余时和上次时刻：

- 满槽、阻回或宿主暂不具备资源资格时暂停，不积攒补算。
- 速度变化保留绝对已过时间；速度归零使计时无效，恢复后从完整周期开始。
- 达到满槽后停止消费余下时间。ACTION／HIT／NONE 不推进自然计时。

默认激活阻回由一项可移除的 recoveryRestriction 表达，资源操作不硬编码“激活必然禁止回复”。

ACTION 回复监听成功释放；普通 Action 的启动或结束不自动授予 SP。HIT 回复由 Skill 入场时登记到 HP Damage.receiving，使用 10000 量级优先级：工作值未取消且为正、nature 非 LOSS、hitRecovery 为 true 时尝试回复。前置取消／归零不授予 HIT，后续抵挡／闪避不回滚已完成回复。回复仍受当前 Skill 许可与容量约束，Damage 不依赖 Skill；公共伤害阶段见[Resource](resource.md)。

## 3. Duration 与弹药

Activation.initialize 是纯求值，读取扣费前的完整 Skill，返回 `{ state, duration }`。duration 为 TIME、AMMO 或 INFINITE；可以根据长期状态、充能等本次事实选择预算。本轮预算在提交前校验，创建持久 Skill 时不执行本轮初始化。

TIME 保存本轮截止 Tick，extendTime 明确调整它；INFINITE 由内容结束。AMMO 保存本次初始容量、余量和累计补弹量。

Ammo 贡献的登记和撤销不依赖静态或当前 Duration 类型，也不改变已运行预算。只有本轮返回 AMMO 时，才以本轮 amount 为基础，在支付前采样贡献。公式为 `max(1, base + Σaddition + RoundToEven(base × Σratio))`，固定追加不参与比例乘算。当前覆盖初始基础上限与原始上限相同的普通情况，运行中基础上限变化尚未支持。

consume 按完整指定数额消费，允许负余量，不自动结束；check 独立检查同一 Activation 并结束耗尽轮次。replenish 同时受本次容量和累计补弹额度限制；grant 是内容自身增加，不占普通补弹额度，但仍受容量限制。结束丢弃余量不算消费。

ammoReplenished 仅通知普通补弹的正实际增量，保存 requested、实际量和前后快照；grant 不派发该通知。嵌套业务不重算已经确定的报告。

具体行动决定消费节点。[弹药行动组合器](action.md#8-普通攻击释放-hook-与移动)在启动时采样 Activation Ref，在自己的 afterOutput 消费／检查；旧行动不能消费新激活。取消本身不推导消费或返还。AMMO 是预算模型，不是全部“弹药类技能”加成资格。

## 4. Restriction、程序与 Hook

启动、主动操作和回复分别持有精确限制。启动要求宿主 ACTIVE、正生命及 activationRestrictions；[Presence](presence.md)通过限制禁止消失期间的新激活。operate 检查宿主和当前 Activation 均为 ACTIVE，再检查 operationRestrictions，不额外要求空间存在或 HP；内部到期、完成及宿主离场不受主动操作限制否决。

Activation Definition 必须显式提供 `ignoreRestrictions: readonly ActivationRestriction[]`：普通技能为 `[]`，允许眩晕中发动的技能可填写共享的 `control.stunRestriction`。先解析有效贡献，再按定义对象身份豁免；同一定义的多个来源一起忽略，不按登记 ID 判断，也不恢复被竞争压制的项。该豁免只作用于本次 Skill 启动，不删除登记、解除 Effect 或恢复其他领域的能力；只忽略 stun 仍受 silence、Presence 等其余限制。宿主生命周期、已有 Activation、accepts 及本次 SP 前提仍须满足。

entered Hook 先登记回复监听，再执行 onEnter，最后重新取得仍为 ACTIVE 的宿主尝试 PASSIVE 发动。持久 onTick 要求宿主 ACTIVE，本轮 onTick 还要求当前 Activation 为 ACTIVE；它们不机械继承自然 SP 回复的暂停条件。

Activation Definition 的 operations 按 STOP／RETRIGGER 分别提供处理器，未声明的操作不受理。operate 先检查对应处理器存在，再检查 operationRestrictions，通过后调用该处理器并返回 true；处理器接收 BattleState、宿主 Ref 和完整 Activation，不重复接收操作键。true 表示已受理，不承诺激活已经结束。内部 finish／cancel 不受主动操作支持范围或限制否决。

Skill 通知包括 SP 回复／支付／修改、耗弹／普通补弹和激活创建／结束。全部使用[公共 Hook](hook.md)，结束事实允许仍登记的 ENDING 宿主响应。激活报告只保留本轮 Ref 与必要结束原因，不复制私有状态；activationEnded 在清空槽位后派发，该旧 Ref 不保证仍可查询。

## 5. 发动与完整结束

`Battle.step` 通过 `SKILL` 命令接收 Skill 宿主的 Unit Ref 和操作。`ACTIVATE` 仅受理 MANUAL 技能。`STOP` 与 `RETRIGGER` 在命令执行时取得当前激活并交给 `operate`，没有当前激活时跳过命令。

常规调度由 trigger 决定。advance 调度 AUTO 与尚未成功发动的 PASSIVE，entered 尝试 PASSIVE。Content 可以直接调用 `activate` 显式发动任意触发类型的技能。PASSIVE 始终只允许成功发动一次。

发动先检查宿主、占槽、限制、accepts、本次门槛与足额支付；拒绝不初始化、不支付。通过后调用本轮 initialize 一次，构造 Duration，再一次发布扣费、Activation 与下一轮身份，登记其 Unit 所有权。随后记录启动表现、派发 activationStarted 和 spPaid，再重读同一身份、ACTIVE 状态及宿主生命资格，决定是否执行 onStart。零时长也先执行仍有效的 onStart，再复查到期并结束。

暂时消失本身不跳过仍成立的 onStart，也不自动结束已有持续技能。启动通知可同步结束本轮；返回的 Ref 仍表示创建事实，支付与已经完成的业务不回滚。依赖本轮身份的业务在登记后执行，不能为前置判断另建本轮状态。

结束按[Lifetime](lifetime.md)等待依赖清理，调用本轮 onEnd，随后只清空同一 activation、保留最新持久状态和 SP，再通知 activationEnded。ENDING 持续占位；在已有结算中，嵌套 finish／cancel 返回不保证槽位已释放，需要下一轮的业务在结束通知中继续。

## 6. 覆盖边界

本轮初始化可以按次数／充能状态构造 Duration，启动豁免可以表达止颂 S3的定向异常许可；显式 activate 与本次 Parameters 可以编排 Fever 启动。上述具体内容仍须接入，变化范围与实际数量见[发动变化研究](../research/cases/09-skill-mechanisms-and-requirements.md#10-发动变化的数量与表达范围2026-11-17)。金币／魔力复用原生 SP，不直接证明项目必须提供普通 SP 运行期配置切换或封闭增减接口。

充能、条件耗弹、Fever 的已查期限延后及跨部署魔力的持久保存可以使用现有领域组合；这不代表相应内容已经接入。完整接入范围见[内容缺口](tactical-semantics.md)，同实例复活的技能接续按具体原生程序确定，不统一推断保留或重置。
