# Skill 设计

Skill 管理 SP、发动、持续预算、主动操作与完整终止。Action 管理行动程序，Effect 管理附着影响；具体内容组合它们，不由 Skill 推断攻击内容。领域入口为 [unit/skill](../../src/core/unit/skill/index.ts)，能力装配与限制入口为 [capability/skill](../../src/core/unit/capability/skill/index.ts)。

## 关键语义

- 持久 Skill 与本轮 Activation 分开；结束清空本轮，保留持久状态和资源，旧引用不能操作新激活。
- 发动门槛与实际支付分别求值。先提交支付与激活，再执行启动通知和程序；已结束的本轮不继续启动。
- 回复、支付和直接增减各自遵守资源契约。满槽或阻回期间不积攒补发。
- 时长和弹药归本轮；延时不改下一轮，消费、耗尽检查、补弹与内容增加弹药分别结算。
- onEnd 读取本轮数据，activationEnded 通知槽位释放后的历史事实。

## 模块与入口

`unit/skill/` 拥有聚合、身份、SP／Ammo、持续预算与完整操作；Capability 负责装配、结构守卫、贡献、限制和通知 Key。具体声明以源码为准，登记和写回遵守[接口约定](api-conventions.md)。

SP 可以不存在；hasSp 同时证明配置与状态存在。容量、门槛、默认费用和 TIME 基础时长是静态配置；只有回复速度／倍率及弹药容量具有现有贡献入口，不能以贡献代替配置切换或资源支付。

## 1. 单槽聚合、Definition 与两种身份

每个 Unit 保存一份 Skill 聚合：Definition、持久 state、可空 SP 与可空 activation。Activation 是同一聚合的非空视图，本轮包含身份、开始时刻、生命周期、Sustain 与私有状态。Capability 另保存宿主内激活计数、Ammo 贡献和许可。

持久 state 保存跨激活事实，本轮 state 保存当次进度。可直接由 activation 槽位判断的阶段不再重复保存；SP.value 是余额的唯一事实。聚合不重复保存 host，内容程序显式接收宿主 Ref。

创建入口接续持久初始化和 SP 初态，建立私有状态与回调的配对。Unit 尚未登记时不能查询自己或假定兄弟能力已装配。具体 Definition 由内容工厂确定，不以联合 Definition 构造一套运行时能力分派。

### 引用、查询与写回

持久 Ref 由宿主与 Definition 对象标识；Activation Ref 由宿主与本轮 ID 标识。查询保留完整聚合，精确引用恢复私有类型；旧激活 Ref 不读取或更新后来的轮次。

持久与本轮状态有各自写回操作，仅更新对应字段。持久状态可在结束程序更新，本轮 ENDING 后不接受普通私有状态写入。跨完整业务后接续最新状态；通用类型、错误和不可变约定见[接口约定](api-conventions.md)。

## 2. SP

容量 capacity、发动门槛 requirement 与默认支付 cost 分开；未配置 cost 时使用 requirement。Activation.cost 可在本次发动版本选择实际费用，运行中的逐次支付仍通过资源操作。

回复速度与倍率各自按[属性贡献](capability.md#属性与贡献)求值、限制下限为零，再相乘；保留连续值。配置切换、清空余额、支付和持续期改变不是数值贡献的后继。

Recovery 为 TIME、ACTION、HIT 或 NONE；EXTERNAL 是显式操作的来源。recover 检查来源与回复许可并限制到容量；pay 足额支付或失败，不受回复限制；modify 直接增减，普通正增量仍检查 EXTERNAL 许可，负增量不被阻回拦截，forced 只绕过规定的回复限制。三者要求宿主 PRESENT，具有 Vitality 时仍活着；无 Vitality 的 Skill 宿主也可使用资源。

TIME 自然回复保留周期、余时和上次时刻：

- 满槽、阻回或宿主暂不具备资源资格时暂停，不积攒补算。
- 速度变化保留绝对已过时间；速度归零使计时无效，恢复后从完整周期开始。
- 达到满槽后停止消费余下时间。ACTION／HIT／NONE 不推进自然计时。

默认激活阻回由一项可移除的 recoveryRestriction 表达，资源操作不硬编码“激活必然禁止回复”。

ACTION 回复监听成功释放；普通 Action 的启动或结束不自动授予 SP。HIT 回复由 Skill 入场时登记到 HP Damage.receiving，使用 10000 量级优先级：工作值未取消且为正、nature 非 LOSS、hitRecovery 为 true 时尝试回复。前置取消／归零不授予 HIT，后续抵挡／闪避不回滚已完成回复。回复仍受当前 Skill 许可与容量约束，Damage 不依赖 Skill；公共伤害阶段见[Resource](resource.md)。

## 3. Sustain 与弹药

TIME 保存本轮截止 Tick，extendTime 明确调整它；INFINITE 由内容结束。AMMO 保存本次初始容量、余量和累计补弹量。

弹药容量在发动、支付 SP 之前采样，后来的贡献只影响后续发动。公式为 `max(1, base + Σaddition + RoundToEven(base × Σratio))`，固定追加不参与比例乘算。当前覆盖初始基础上限与原始上限相同的普通情况，运行中基础上限变化尚未支持。

consume 按完整指定数额消费，允许负余量，不自动结束；check 独立检查同一 Activation 并结束耗尽轮次。replenish 同时受本次容量和累计补弹额度限制；grant 是内容自身增加，不占普通补弹额度，但仍受容量限制。结束丢弃余量不算消费。

ammoReplenished 仅通知普通补弹的正实际增量，保存 requested、实际量和前后快照；grant 不派发该通知。嵌套业务不重算已经确定的报告。

具体行动决定消费节点。[弹药行动组合器](action.md#8-普通攻击释放-hook-与移动)在启动时采样 Activation Ref，在自己的 afterOutput 消费／检查；旧行动不能消费新激活。取消本身不推导消费或返还。AMMO 是预算模型，不是全部“弹药类技能”加成资格。

## 4. Restriction、程序与 Hook

启动、主动操作和回复分别持有精确限制。启动要求 PRESENT、正生命及 activationRestrictions；[Presence](presence.md)通过限制禁止消失期间的新激活。operate 检查 PRESENT、当前轮 ACTIVE 和 operationRestrictions，不额外要求空间存在或 HP；内部到期、完成及宿主离场不受主动操作限制否决。

入场 Hook 先登记回复监听，再执行 onEnter，最后重新取得仍为 PRESENT 的宿主尝试 PASSIVE 发动。持久 onTick 按 PRESENT 推进，本轮 onTick 另要求 ACTIVE；它们不机械继承自然 SP 回复的暂停条件。

STOP／RETRIGGER 由内容程序处理；没有自定义 onOperation 时 STOP 默认正常结束。operate 返回是否受理，不承诺激活已经结束。

Skill 通知包括 SP 回复／支付／修改、耗弹／普通补弹和激活创建／结束。全部使用[公共 Hook](hook.md)，结束事实允许仍登记的 LEAVING 宿主响应。激活报告只保留本轮 Ref 与必要结束原因，不复制私有状态；activationEnded 在清空槽位后派发，该旧 Ref 不保证仍可查询。

## 5. 发动与完整结束

发动检查宿主、触发方式、限制、门槛与足额支付，采样本轮状态和持续预算，再一次发布扣费与 Activation，登记其 Unit 所有权。随后记录启动表现、派发 activationStarted 和 spPaid，再重读同一身份、ACTIVE 状态及宿主生命资格，决定是否执行 onStart。

暂时消失本身不跳过仍成立的 onStart，也不自动结束已有持续技能。启动通知可同步结束本轮；返回的 Ref 仍表示创建事实，支付与已经完成的业务不回滚。依赖本轮身份的业务在登记后执行，不能为前置判断另建本轮状态。

结束按[Lifetime](lifetime.md)等待依赖清理，调用本轮 onEnd，随后只清空同一 activation、保留最新持久状态和 SP，再通知 activationEnded。ENDING 持续占位；在已有结算中，嵌套 finish／cancel 返回不保证槽位已释放，需要下一轮的业务在结束通知中继续。

## 6. 待完成的机制覆盖

完整范围见[内容缺口](tactical-semantics.md)与[技能覆盖研究](../research/cases/09-skill-mechanisms-and-requirements.md#3-触发持续与输出)。运行时 SP 配置切换、跨部署魔力、Fever 暂停／恢复、独立弹药与 TIME／INFINITE 并存、特殊发动资格及弹药类加成身份尚未完整接入，不能由现有字段或贡献推定已覆盖。

长期保留零 HP、同身份复活后的技能接续仍依赖特殊生命领域决策。运行期容量／最低门槛／逐次支付与持续时间的原生差异见[公式及时间操作调查](../research/cases/09-skill-mechanisms-and-requirements.md#27-原生公式复核ammosp-与具体持续时间操作)。
