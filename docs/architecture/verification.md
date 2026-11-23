# 语义验收

先从各领域架构文档提取会改变业务结果、身份与资源不变量、合法调用范围或可观察顺序的契约，再为每项选择集中代表。已有测试也要按同一标准审查。一项场景可以同时保障多个相关结果，共享协议集中验证，消费者只验证自己的业务后果。

通过公开构造和领域操作建立场景。纯算法直接使用合法输入。修复既有语义时补足原代表。未接入的内容和待决语义见[Tactical 语义](tactical-semantics.md)和[Core 缺口](research-necessity-20261122.md)。套件运行方式见[测试说明](../../test/README.md)。

## 公共契约与 Unit

| 语义来源 | 需要保障的结果 | 集中代表 |
| --- | --- | --- |
| [接口约定](api-conventions.md#统一-typed-ref-与类型恢复)、[Capability 装配](capability.md#初始化与装配)、[Content 类型](content.md#unit-与-capability-的类型约束) | 构造结果保留所选能力及 Definition。必需 Initial 由创建入口提供，额外已知 Initial 不产生能力。异构开场输入逐项保持这些约束。 | [公共类型](../../test/core/types.test.js)的 Unit 直接创建、Route／Spawn、带 Route 的 Card 和异构 Runtime 输入。 |
| [接口约定](api-conventions.md#统一-typed-ref-与类型恢复)、[Action](action.md#3-definitionaction-与-execution)、[Skill](skill.md#1-单槽聚合definition-与两种身份)、[Projectile](projectile.md#3-异构集合与类型恢复)、[Effect](effect.md#2-definition实例与泛型) | Content 装配检查宿主能力及私有状态与回调的配对。精确 Ref 保留私有类型，普通枚举只提供公共结构。执行、实例及 Effect 的身份不能混用。能力守卫和 Query 保留已知能力，Hook Key 保持载荷及宿主要求，Change 只可用于满足其要求的宿主。 | [公共类型](../../test/core/types.test.js)的 Action／Skill 宿主装配和精确引用、Effect 政策、Projectile Trait 与消除资格、Card／Mechanism 登记，以及 Query／Hook／Change 组合。 |
| [Unit 构造](capability.md#初始化与装配)、[资格限制](capability.md#资格限制) | 开场和运行时共用身份分配，互斥 Blocking 角色不能同时装配，初始 Effect 经登记后正常安装。各限制列表独立管理登记 ID，同一初始列表拒绝重复登记。 | [Unit](../../test/core/unit.test.js)的构造、Restriction 和身份场景。 |
| [Classification](capability.md#classification) | 类别和 Side 独立。组织和战斗标签各依所属类别进行查询。额外职业参与指定匹配，召唤物可复用子职业。明确类别的守卫保留输入类型，动态类别及职业匹配的 false 分支不承诺排除类型。 | [Classification](../../test/core/classification.test.js)的敌对、标签、职业结果以及[公共类型](../../test/core/types.test.js)的职业配对和守卫。 |
| [Change](api-conventions.md#51-unit-完整操作与批量变更) | 同宿主组合保留操作顺序，一次发布最终值，Settlement 按顺序读取最新状态。中间真实变更的后继继续完成，即使字段最终回到原值。optional 根据组合时的当前输入判断能力。 | [Change](../../test/core/change.test.js)的组合和嵌套后继。 |
| [Hook](hook.md#派发与生命周期) | 固定本次候选及优先级，按最新登记执行，嵌套独立选取。全局 entered 先发布规则，再调用仍 ACTIVE 的宿主程序。removed 使用注销前捕获的登记，先本地通知历史 Departure，再派发全局通知。 | [Hook](../../test/core/hook.test.js)的重入、入场及注销通知。 |
| [Lifetime](lifetime.md#finalize-与完成边界)、[延后操作](lifetime.md#析构后执行操作) | 首次结束固定载荷，完成依赖收尾后才能注销宿主。ENDING 的作用域拒绝新的依赖。延后操作在结算外立即执行，在结算后依登记顺序接续最新状态，队列中的嵌套析构不抢先执行新增任务。 | [Lifetime](../../test/core/lifetime.test.js)的依赖析构、拒绝装配和 defer 顺序。 |
| [Contribution](capability.md#属性与贡献)、[Attribute](attribute.md) | 有效来源先竞争再求值，平级稳定，独立来源保留。四项数值修正保留连续值，底值及最终值使用所属边界，整区间覆写可恢复默认，范围与数值贡献独立。 | [贡献选择](../../test/common/contribution.test.js)、[数值公式](../../test/common/modifier.test.js)、[属性](../../test/core/attribute.test.js)。 |
| [查询与候选](api-conventions.md#查询与候选)、[不可变状态与确定性](functional-core.md)、[坐标与几何](geometry.md) | Store 新版本和 Query 的惰性读保持历史版本与顺序。RNG 同输入可重现，稳定排序保留同优先级顺序。取整、坐标转换、范围、相交和扫掠结果由纯算法保障。 | [Store](../../test/common/store.test.js)、[Query](../../test/common/query.test.js)、[RNG](../../test/common/rng.test.js)、[排序](../../test/common/order.test.js)、[取整](../../test/common/math.test.js)、[几何](../../test/core/geometry/)。 |

## Action、Skill 与 Effect

| 语义来源 | 需要保障的结果 | 集中代表 |
| --- | --- | --- |
| [Action 启动与调度](action.md#6-完整启动写回与终止) | 私有初始化依序接续。拒绝启动保留 prepare 已完成的业务，且不创建 Execution。取消后继读取最新持久状态，旧轮身份不能操作后续轮。受理、释放、输出和中断各有独立结果，瞬时执行一 Tick 只推进一次，重复候选也只执行一次。 | [Action](../../test/core/action.test.js)的装配、拒绝与重入、释放及 Combat。 |
| [Action 冷却](action.md#5-capability-与冷却)、[普通攻击时序](action.md#8-普通攻击释放-hook-与移动) | 同宿主冷却独立，属性提交同步按比例重算攻速周期，固定周期保留。攻击缩放、缓存预算、已进入等待和后续段采样各有确定边界。一次开始只转向一次，释放后的执行占用仍影响移动。 | [Action](../../test/core/action.test.js)的属性变更，[普通攻击](../../test/content/actions/attack.test.js)的预算、采样和开始程序，[弩手](../../test/content/enemies.test.js)的实际释放与移动。 |
| [攻击选择与输出](action.md#8-普通攻击释放-hook-与移动)、[选敌](targeting.md#调用业务) | 选择组接续 RNG 和状态，拒绝启动保留已消费前缀。已绑定目标按业务复验而无须重选。按当前攻击力逐目标输出与固定数值输出各有对应语义。 | [普通攻击](../../test/content/actions/attack.test.js)的选择与绑定，[攻击输出](../../test/content/actions/output.test.js)的逐目标采样和固定值。 |
| [Skill SP](skill.md#2-sp)、[发动](skill.md#5-发动与完整结束) | 门槛、支付、触发方式各有职责。拒绝不初始化或支付，本次特殊参数不覆盖后续普通配置。发布 Activation 和扣款后再通知，重入结束保留已支付资源并跳过旧 onStart。空闲、激活及暂停期间的 SP 回复按本身资格推进。 | [Skill](../../test/core/skill.test.js)的发动、显式费用、付款重入和 SP 回复，[Runtime](../../test/core/runtime.test.js)的手动与自动调度。 |
| [Skill 持续时间与弹药](skill.md#3-duration-与弹药)、[操作资格](skill.md#4-restriction程序与-hook) | 本轮 Duration 使用长期状态及支付前余额，后续弹药规则变更不反推早先采样。普通补弹在提交后通知实际增加量。操作须有处理器且通过当前限制，操作受理与完成独立。结束先清除本轮，保留通知中新建的新轮。 | [Skill](../../test/core/skill.test.js)的 TIME／INFINITE、AMMO、主动操作及结束重入。 |
| [Effect 分组](effect.md#重复施加与叠层) | 竞争决定参与，兼容重应用按政策拒绝、新建或保留实例和私有状态，不兼容政策报配置错误。实际和有效叠层、满层续期、消耗与衰减各有结果；变层先发布再通知，停用期间仍保存新层数。 | [Effect](../../test/core/effect.test.js)的 DEFAULT、EXTEND／EXTEND_TIME、STACK 及 UNIQUE。 |
| [Effect 来源与计时](effect.md#来源分组)、[时间推进](effect.md#6-时间推进) | 同 Card 不同 Unit 共享持久来源，区别于其他 Card、独立 Unit 及无来源。自动到期与参与状态独立，ACTIVE 才执行周期。初装即到期、最后一次周期及手动续期接续最新状态。 | [Effect](../../test/core/effect.test.js)的来源分组、安装及计时。 |
| [标准控制](effect.md#需要区分的基础机制)、[Facing](capability.md#facing) | 独立异常来源按各自期限撤销，强制转向只豁免转向限制，移动与转向可以独立成功。 | [标准控制](../../test/core/effects/control.test.js)、[Facing](../../test/core/facing.test.js)。 |

## Battlefield、单位空间与时序

| 语义来源 | 需要保障的结果 | 集中代表 |
| --- | --- | --- |
| [Battlefield](battlefield.md#关键语义)、[Occupancy](occupancy.md#已通知的业务配对) | 批量发布最终占格，结构写入独立于身体位置和业务通知。双槽独立排他，Pair 先发布再通知，旧配对清理不能影响同格替代实例。 | [Battlefield](../../test/core/battlefield.test.js)的结构批量，[Occupancy](../../test/core/occupancy.test.js)的配对替换。 |
| [Tile 与导航](terrain.md#地块与类型恢复)、[Navigation](navigation.md#overlay-登记)、[Spatial](spatial.md) | 非整格坐标不命中已有格。地块代价与方向限制影响寻路，Overlay 可独立改变路径。空间查询区分身体和 Hitbox。扫掠按接触比例排序，排除消失和 ENDING 的对象。接收资格由业务判断。 | [Battlefield](../../test/core/battlefield.test.js)的格地址、路径和接触。 |
| [Blocking](blocking.md#关系资格与-restriction)、[Layer](capability.md#layer-与-hitbox) | 取得和保持使用当前双方资格、阻挡量及层，有占格时按根格判断地面阻挡。缩容按建立顺序从尾释放，每次通知后按当前容量继续裁撤。双端关系在通知前发布，结算使用当前关系。同值切层也清理当前关系，主动空间覆盖取消本方计划，通知中新建关系不被追删。 | [Blocking](../../test/core/blocking.test.js)的关系资格、缩容、双侧通知、切层与主动覆盖。 |
| [Presence](presence.md#发布与同步结算)、[Targeting](targeting.md#标准资格) | 消失保留身份、占格、部署与 Lifetime，先发布限制再释放阻挡和取消 Action。恢复仅撤销自身限制。普通 HP／EP 损伤拒收，LOSS 可接收，治疗和自然回复遵守各自资格。选敌谓词按传入版本匹配当前限制，HP／EP 资格与实际接收独立，混合治疗和嘲讽使用有效属性。 | [Presence](../../test/core/presence.test.js)的状态与清理，[资格](../../test/core/targeting/eligibility.test.js)的实时判定与混合治疗，[Targetable](../../test/core/targeting/targetable.test.js)的组竞争、共享定义豁免和嘲讽。伤判见资源验收。 |
| [Route](navigation.md#route-定义与进度) | 进入首指令及每次 MOVE 采样，重入接续当前 Context；即时长链完成，环让出。同一 Context 控制权与计时独立，TRACE 到达保留控制，Main 出口独立于临时路线。不可通起点恢复保留本次 MOVE，距离不含瞬移。 | [Route](../../test/core/navigation/route.test.js)的时钟、进入、退出、阻地恢复及剩余距离。 |
| [Locomotion](navigation.md#locomotion) | 历史速度与限力／限速、避障反射、最终目标吸附；无 Route 仍可推进受力单位，并读取实际位移结果。 | [Locomotion](../../test/core/navigation/locomotion.test.js)、[避障](../../test/core/navigation/avoidance.test.js)、[速度](../../test/core/navigation/speed.test.js)。 |
| [Shifting](navigation.md#强制位移) | 推击读当前力度和重量，首次失衡先发布状态再释放阻挡，失衡中不能重新接敌。牵引创建时采样，同源多条仍独立。移动拉点可从零力恢复；只有唯一有效牵引可在位移通知后按策略清速。来源结束保留动量，显式解除后由推进结束失衡。免疫在位移前生效，摩擦读取当前值，旧段收尾保留新段。 | [Unbalance](../../test/core/navigation/unbalance.test.js)的采样、多来源、近停、免疫、摩擦、碰撞及结束重入。 |
| [Schedule](schedule.md#回归语义)、[Runtime](functional-core.md#同步候选范围) | 出生偏移与位置共享样本，等待在 entered 前发布。Operation 返回等待时暂停该队列，其他队列继续。Wave 超时、活单位主动解除和完整离场分别清理对应等待，解除 Wave 等待不提前推进策略。Branch 抽选发布后允许嵌套触发，每个实例按时推进。开场按 Card、Mechanism、Unit 顺序发布，入场动作接续已提交状态。战斗阶段按序推进，失败保留输入，调度完成后仍可 step。 | [Schedule](../../test/core/schedule.test.js)的时基、等候、Branch 与混排操作，[Runtime](../../test/core/runtime.test.js)的开场和 Tick。 |

## Deployment

依据 [Deployment](deployment.md)，以下场景集中在[部署套件](../../test/core/deployment.test.js)。Unit 和 Occupancy 的通用通知及结构约束在各自套件验证。

| 语义来源 | 需要保障的结果 | 代表场景 |
| --- | --- | --- |
| [Card 定义与 Unit 蓝图](deployment.md#静态内容与-card)、[部署历史](deployment.md#部署历史) | 多卡可共享蓝图，各有身份和资源。成功部署按发生顺序在 entered 前发布来源，失败或无卡 Unit 不入历史；旧 Unit 注销后仍能反查。 | 共用蓝图的两张卡与一个开场 Unit；撤退、重上及死亡后反查。 |
| [待部署区顺序](deployment.md#待部署区顺序) | Card 推进产生的新费用参与当 Tick 排序。撤销规则保留已排顺序，显式排序立即发布。 | 卡牌推进改变费用相对高低，检查实际牌序。 |
| [请求与统一资格](deployment.md#请求与统一资格)、[部署流程](deployment.md#普通部署流程) | 预览与执行共享落点、报价和拒绝理由，拒绝不消耗。固有资源及占格前提保留；免支付、零支付和零占用有各自的账务。先消费再初始化、登记和通知。两输入列表独立校验 ID，覆盖后才竞争并稳定返回首拒。 | 共享请求与入场观察；固有门槛及零报价；真实入口重复 ID；分层覆盖与冲突。 |
| [离场结算](deployment.md#离场结算) | 主动撤退在 removing 前退款，Card 在注销后按原因回收；SELF 跳过回收，EXTERNAL 回收，两者均无撤退退款。死亡立即清格及回收 Card，部署位一战斗秒后才可再用。 | 撤退与死亡的账务和下次部署，两个特殊离场原因。 |
| [库存与计时](deployment.md#库存与计时) | DEFAULT 部署开钟且离场不补货，UNIQUE 离场回货再开钟。QUEUED 可用份与待恢复份分开，现有余时保留，暂停无补发，后续时长重新采样。先推进再运行卡牌程序，每 Tick 最多转为可用一份，包括零时长。持有上限按照可用与待恢复的总量裁剪，在场上限只限制下次部署。 | DEFAULT 显式补货、离场后 UNIQUE 恢复、QUEUED 逐份恢复及牌内程序观察、缩容与在场额度。 |
| [DP](deployment.md#dp) | 当前余额用于查询与支付，按有效下限拒绝支付。负余额半速，跨零和变速保留进度，满额清进度。有效上限能保留超额或显式截断，提高下限同步补齐；自然 DP 可用于同 Tick 部署。 | 同 Tick 收支、自然回复时钟和上下限政策。 |
| [Slot](deployment.md#slot) | 动态限位只影响新部署；零额度仍允许零占用，不限位保持不限。到期归还参与同 Tick 部署资格。 | 上限 Contribution、无限额、死亡延迟与到期部署。 |

## Projectile 与 Terrain

| 语义来源 | 需要保障的结果 | 集中代表 |
| --- | --- | --- |
| [Projectile 创建与结束](projectile.md#4-创建查询与内容更新)、[推进](projectile.md#5-时间推进) | 先分配身份后登记，onEnter 可观察登记、嵌套创建或结束。Runtime 固定 Tick 入口候选，进入阶段读取当前实例，跳过已结束候选。 | [Projectile](../../test/core/projectile.test.js)的登记、Tick 候选和结束。 |
| [变速](projectile.md#外部变速与运动)、[消除](projectile.md#移除与消除)、[命中](projectile.md#7-命中与内容状态) | 变速资格按 Trait，来源倍率独立替换、相乘并撤销。普通停止可以按模板完成一次保底命中，消除跳过。锁定身份仍在时跟踪当前位置，命中与伤判分离，目标不存在不会转打附近单位。来源离场时弩箭读取发射样本，重入结束不重复命中。 | [Projectile](../../test/core/projectile.test.js)的变速，[弩箭](../../test/content/projectiles/arrow.test.js)的停止、锁定与采样，[Unbalance](../../test/core/navigation/unbalance.test.js)的弹道 Scope 清理。 |
| [Mechanism](terrain.md#mechanism-操作) | 开场与运行时共用身份分配，登记后 onEnter 一次；启停在发布新状态后通知实际变化，停用停止推进并保留私有状态，移除调用 onEnd。 | [Mechanism](../../test/core/mechanism.test.js)的开场、登记、启停和结束。 |
| [地形](terrain.md#地形接触与调度)、[Content 行为](terrain.md#content-行为) | 地形接触读取运动后的身体位置与当前资格。各地形保留自身的入场、周期和离格政策。装置只恢复所拥有的地块属性，射击台只为当前乘员安装限定层的禁挡。 | [地形场景](../../test/content/terrain.test.js)的接触政策，[地块装置](../../test/content/devices/tiles.test.js)和[射击台](../../test/content/devices/shooting-platform.test.js)的实际业务。 |

## Hook 与伤害／治疗的回归语义

| 语义来源 | 需要保障的结果 | 集中代表 |
| --- | --- | --- |
| [Resource 计算](resource.md#calculate-与-apply-的语义边界)、[公式与分支](resource.md#基础公式与弱点选择) | 计算采样对应抗性与类型，并保留固定请求。各计算分支独立，Apply 只接续被选中的一次结果。零输出拒绝与零实际变化的成功结算不同。 | [Calculate](../../test/core/resource/calculation.test.js)的实际公式、分支与零输出，[Apply](../../test/core/resource/application.test.js)的零变化和通知。 |
| [Resource 接收](resource.md#接收工作值数值固定与取消)、[单次排除](resource.md#本次-hook-排除取消权限与接收豁免) | Hook 排除限本次操作，接收豁免使用当前有效限制，嵌套不继承。取消和固定不可恢复为普通接收，允许的后继保留已发生业务。HIT 的资格与 Nature 独立，LOSS 仍经普通结算。EP 环境伤害使用同一接收流程。 | [Apply](../../test/core/resource/application.test.js)的 Hook 排除、免疫复检、接收取消、LOSS 与环境 EP；[泥岩护盾](../../test/content/operators/mudrock.test.js)的取消权限。 |
| [Resource 死亡](resource.md#生命状态通知与离场)、[击杀归属](resource.md#单笔击杀结果与-targetkilled) | 提交与 Applied 先于死亡确认，零 HP 时同步业务可以救回。嵌套确认不重复归属，显式 killer 与 source 独立，先通知来源，再进行目标离场，已发出结果不受 Completed 的新结算影响。直接致死也可固定归属。 | [Apply](../../test/core/resource/application.test.js)的致死、抢占确认及恢复，[Unit](../../test/core/unit.test.js)的直接结束。 |
| [Vitality](vitality.md#负生命与资源分配)、[报告](vitality.md#提交报告与特殊恢复) | HP 和债务按实时容量分配，恢复先还债，再增加 HP，真正溢出单列。提交前干预使用最新宿主，报告固定在成功写入，后继引发的离场不改报告。自然回复按 Tick 偿债与回 HP，不走治疗流程。 | [Vitality](../../test/core/vitality.test.js)的自然回复、提交干预、债务与 MaxHP 动态变化。 |
| [Elemental 提交](elemental.md#3-查询结算与资源提交)、[耗尽顺序](elemental.md#4-hook提交事实与同步重入) | HP 元素抗性与 EP 独立，EP 提交使用有效 MaxEP，逐型全量恢复，零增益不派 healed。耗尽先发布 Burst，再执行仍有效的标准输出及损伤通知；启动被取消仍保留原 EP 损失报告。 | [Calculate](../../test/core/resource/calculation.test.js)的抗性，[Elemental](../../test/core/elemental.test.js)的提交、恢复、耗尽与启动取消。 |
| [Elemental 恢复与结束](elemental.md#5-完整结束与离场)、[狂躁](elemental.md#狂躁的行动与时间累加) | Burst 按自身预算推进，暂停或速度变化不重复累积，零预算仍可有安装输出。缩时保留已推进量，结束按当前 MaxEP 回填并清理根绑定产物，独立异常和新轮保留。狂躁分别消费角色实际释放、激活和敌方 ACTIVE 周期。 | [Elemental](../../test/core/elemental.test.js)的预算及重入，[标准爆发](../../test/core/effects/elemental.test.js)的周期、独立产物与两类狂躁。 |

## Event 的回归语义

依据 [Event](event.md)，[Event](../../test/core/event.test.js)集中验证实际 HP／EP 变化（含成功零变化）、HP 取消输出零及 EP 损伤取消无输出，以及爆发保持发生时的位置、下一 Tick 清空而旧版本仍可读。[Action](../../test/core/action.test.js)观察开始、释放、输出和完成顺序，[Route](../../test/core/navigation/route.test.js)经真实 Main 退出发布一次离场表现。[Vitality](../../test/core/vitality.test.js)验证 HP 提交后调用后继之前已发布 Event，嵌套治疗及治疗引发的离场保持实际发生顺序。

## Data 与具体内容

| 语义来源 | 需要保障的结果 | 集中代表 |
| --- | --- | --- |
| [干员静态资料](data.md#干员静态资料)、[敌人静态资料](data.md#敌人静态资料) | 按资源关联取得完整原始资料，按选择处理解锁、曲线、模组与单位换算。敌人逐项继承等级基础值，关卡覆写最后生效，保留供 Content 使用的技能事实。 | [干员配置](../../test/data/unit/operator.test.js)、[敌人配置](../../test/data/unit/enemy.test.js)的实际资料。 |
| [Data 配置转换](data.md#静态配置与数值)、[Route 与 Schedule](schedule.md#静态计划) | 标签保留标识身份，合并去重；装置使用实际阵营、筛选标签和部署格配置。路线时基、随机组、等待和关卡推力系数保留，包括零系数。 | [标签](../../test/data/unit/tags.test.js)、[预置装置及控制器](../../test/data/level/predefined.test.js)、[Route／Schedule 转换](../../test/data/level/route-schedule.test.js)。 |
| [动作换算](data.md#共享读取与换算)、[Effect 配置](data.md#当前支持边界) | 作者帧转为起手及释放时间，保留小数和无界缩放。Effect 转换保留叠层上限、续期、修正位置与动态输入，并绑定已接入的元素类型。 | [动作配置](../../test/data/action/timing.test.js)、[Effect 配置](../../test/data/effect.test.js)。 |
| [具体内容](content.md#语义证据与项目政策)、[实际攻击时序](action.md#8-普通攻击释放-hook-与移动) | 角色测试证明其特有结果。玫兰莎在连续攻击中省去起手，间断后重新起手。泥岩 S2 替代旧普攻与回复并重验绑定目标，护盾按当前生命及来源结算。敌人读取实际朝向与阻挡目标，各攻击独立冷却。 | [玫兰莎](../../test/content/operators/melantha.test.js)、[泥岩](../../test/content/operators/mudrock.test.js)、[猎狗与弩手](../../test/content/enemies.test.js)。 |
