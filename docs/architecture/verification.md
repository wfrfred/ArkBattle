# 语义验收

先在领域架构文档确认需要保障的结果，再选择能区分正确与错误行为的已有场景。下表的结果链接直接指向代表用例。一个场景可同时验证相关结果，共享契约用一个入口代表。能力约束、身份、资源不变量和可观察时序各有明确的保留理由。

用公开构造和领域操作建立场景。纯算法直接接收合法输入。改动已有语义时先更新对应代表。暂缓机制和原生待查项见 [Tactical 语义](tactical-semantics.md) 和 [Core 缺口](research-necessity-20261122.md)。运行方法见[测试说明](../../test/README.md)。

## 类型不变量

[集中类型检查](../../test/core/types.test.js)编译以下独立场景。同一 Capability 前提以一个代表检查，不按查询、写回或通知的函数数量扩充。

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Action · 3. Definition、Action 与 Execution](action.md#3-definitionaction-与-execution)、[Skill · 1. 单槽聚合、Definition 与两种身份](skill.md#1-单槽聚合definition-与两种身份) | [Content 将 Action 和 Skill 分别装配到具体宿主。两个 Definition 各自拒绝缺能力的宿主，回调直接通过 source 与 self 访问已声明的能力和两层私有状态。](../../test/core/types.test.js#L47) |
| [Capability · 初始化与装配](capability.md#初始化与装配)、[Schedule · 从 Spawn 到 Unit](schedule.md#从-spawn-到-unit)、[Deployment · 静态内容与 Card](deployment.md#静态内容与-card) | [同一 Unit 构造由 Definition 推导必需 Initial。接受已知备用输入，但不给结果增加能力，仍校验备用输入值。Spawn 只接受可提供的 Initial。](../../test/core/types.test.js#L99)<br>[Card 绑定时排除需要 Route Initial 的蓝图。Runtime 的异构开场配置不抹平各 Unit 的 Initial。](../../test/core/types.test.js#L363) |
| [接口约定 · 查询与候选](api-conventions.md#查询与候选)、[Targeting · 标准资格](targeting.md#标准资格)、[Skill · 1. 单槽聚合、Definition 与两种身份](skill.md#1-单槽聚合definition-与两种身份) | [以 Vitality 的存活查询代表能力前提。普通布尔筛选不建立能力证明，治疗候选和显式 SP 守卫保留输入的 Action 能力。](../../test/core/types.test.js#L117) |
| [接口约定 · 5.1 Unit 完整操作与批量变更](api-conventions.md#51-unit-完整操作与批量变更)、[Capability · Classification](capability.md#classification) | [组合 Change 要求两项能力并保留输入精度，带正确守卫的 optional 可用于未装配该能力的 Unit。](../../test/core/types.test.js#L134)<br>[明确类别的判断保留既有能力，动态类别和职业匹配的失败分支不排除有效类型。职业配置拒绝不相配的子职业。](../../test/core/types.test.js#L147) |
| [接口约定 · 统一 Typed Ref 与类型恢复](api-conventions.md#统一-typed-ref-与类型恢复)、[Action · 4. 异构容器与两种引用身份](action.md#4-异构容器与两种引用身份)、[Skill · 引用、查询与写回](skill.md#引用查询与写回) | [数字地址不能伪造 Ref。Action 持久身份与执行身份分别使用，精确执行 Ref 不可通过泛型推断或提前拓宽写错私有状态。普通查询给出 object 与取消身份，不能读取私有字段、证明额外宿主能力或提交私有写入。](../../test/core/types.test.js#L164)<br>[Skill 发动要求具体 Skill Ref，返回的 Activation Ref 恢复持久和本轮私有状态。本次手工指定的参数同时提供门槛和支付额。](../../test/core/types.test.js#L191) |
| [Action · 5. Capability 与冷却](action.md#5-capability-与冷却)、[Skill · 4. Restriction、程序与 Hook](skill.md#4-restriction程序与-hook) | [输出方式由普通模板的操作推导，专属输出须显式声明。普通攻击模板的 timing 保留私有状态，冷却 Change 仅接收静态修正。回复限制不能充当发动豁免。](../../test/core/types.test.js#L204) |
| [Effect · 2. Definition、实例与泛型](effect.md#2-definition实例与泛型)、[接口约定 · 6. Effect self 的身份与宿主约束](api-conventions.md#6-effect-self-的身份与宿主约束) | [DECAY 安装和写回都拒绝绝对期限。合并结果保留层数与计时政策，不能借本次传入的 Definition 恢复旧私有状态。精确 Definition 查询可恢复该状态。](../../test/core/types.test.js#L225) |
| [Projectile · 4. 创建、查询与内容更新](projectile.md#4-创建查询与内容更新)、[Projectile · 移除与消除](projectile.md#移除与消除) | [Projectile 创建必须装配回调声明的 Trait，普通弹道不暴露该字段。创建后的精确 Ref 保留 Definition 的消除资格，普通 Ref 不允许以消除原因移除。](../../test/core/types.test.js#L250) |
| [Hook · 类型化键与集合](hook.md#类型化键与集合)、[Capability · 资格限制](capability.md#资格限制)、[Vitality · 伤害写入前后](vitality.md#伤害写入前后) | [Hook Key 决定载荷、可改工作值与所需宿主。提交后通知不能改已提交的生命报告。接收限制只有对应阶段可用，Elemental 的伤害限制不能用作治疗限制。](../../test/core/types.test.js#L276) |
| [Resource · 请求分类](resource.md#请求分类)、[Resource · 接收工作值、数值固定与取消](resource.md#接收工作值数值固定与取消)、[Resource · 生命状态、通知与离场](resource.md#生命状态通知与离场) | [被固定和取消的工作值无法恢复，已有的取消原因不能改写。取消使用本次权限和所属领域的原因集。每笔伤害显式声明攻击方式与归属，离场请求也明确死亡归属，提交报告不提前暴露击杀结果。](../../test/core/types.test.js#L298) |
| [Deployment · 静态内容与 Card](deployment.md#静态内容与-card)、[Terrain · Mechanism 操作](terrain.md#mechanism-操作)、[接口约定 · 统一 Typed Ref 与类型恢复](api-conventions.md#统一-typed-ref-与类型恢复) | [Card 的精确 Ref 恢复私有状态及策略。普通查询按策略收窄，只有 QUEUED 能入队。Runtime 接收同场多种 Card 与 Mechanism 状态，装配和登记拒绝 Definition 与状态错配。](../../test/core/types.test.js#L332) |

## 通用数据与算法

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [接口约定 · 查询与候选](api-conventions.md#查询与候选) | [排序和 TopK 同分保留候选原序，TopK 扫描全体，输入顺序不变](../../test/common/order.test.js#L6)<br>[惰性筛选保持源顺序，重复遍历及并行迭代各自持有游标](../../test/common/query.test.js#L6)<br>[展开遵守内外层顺序，有限消费提前停止并关闭源迭代器](../../test/common/query.test.js#L26)<br>[替换不改登记位置，删除保持其余顺序，历史候选固定在原版本](../../test/common/store.test.js#L6) |
| [Attribute](attribute.md) | [四项修正依公式组合，乘区下限为零，结果保留小数](../../test/common/modifier.test.js#L6) |
| [Capability · 属性与贡献](capability.md#属性与贡献) | [独立来源叠加，同组只采用最高优先级，同级由明确的登记 ID 决胜](../../test/common/contribution.test.js#L6) |
| [函数式内核 · 查询与局部计算](functional-core.md#查询与局部计算) | [同种子重放结果与推进状态一致，有效抽样不放回，空抽样不消耗随机数](../../test/common/rng.test.js#L6) |
| [Geometry · 通用二维向量](geometry.md#通用二维向量) | [欧氏限长保留位移方向，已有长度未超限时维持原位移](../../test/common/vector.test.js#L6) |
| [Geometry · 坐标语义与转换](geometry.md#坐标语义与转换) | [正负半整数均取最近偶数，为坐标与需要该规则的消费者集中验证舍入](../../test/common/math.test.js#L6)<br>[格心换轴、连续位置中点取偶、四向偏移旋转保持各自几何语义](../../test/core/geometry/coordinate.test.js#L6) |
| [接口约定 · 5. 数值输入、查询与字段写回](api-conventions.md#5-数值输入查询与字段写回) | [字段改写建立新版本并共享未修改的兄弟引用，相同值保留旧引用](../../test/core/common/object.test.js#L6) |
| [Geometry · Shape 与 Range](geometry.md#shape-与-range) | [轴对齐胶囊按中线与圆帽判断，点和其他形状与边界相切均可命中](../../test/core/geometry/range.test.js#L21)<br>[离散格形状按指定方向映射到连续世界原点，多个分离格形成范围并集](../../test/core/geometry/range.test.js#L38)<br>[零半长和零半径分别使胶囊退化为圆、线段及点，仍按实际边界扫掠](../../test/core/geometry/sweep.test.js#L46) |
| [Geometry · 几何计算](geometry.md#几何计算) | [圆与矩形相切命中，矩形角外点按实际圆距排除](../../test/core/geometry/range.test.js#L7)<br>[同类圆或盒返回首次接触比例，相切与略微分离分别得到接触与无接触](../../test/core/geometry/sweep.test.js#L16)<br>[圆对盒扫掠使用圆角而非扩大的直角盒，并应用双方自己的局部偏移](../../test/core/geometry/sweep.test.js#L23)<br>[静止分离无接触，起点相切为零，终点才接触为一](../../test/core/geometry/sweep.test.js#L29)<br>[胶囊相对圆和垂直轴胶囊按实形与偏移得到不同方向的首次接触比例](../../test/core/geometry/sweep.test.js#L36)<br>[胶囊扫掠盒角使用圆角首次接触，物理分支提供斜向与相切法线](../../test/core/geometry/sweep.test.js#L55)<br>[盒撞物理地块时公开首接触时间及向外盒面法线](../../test/core/geometry/sweep.test.js#L79) |

## Unit、Change、Hook 与 Lifetime

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Capability · 初始化与装配](capability.md#初始化与装配) | [互斥阻挡角色拒绝装配，无该能力的额外已知 Initial 不创建能力，入场 Effect 附在已登记 Unit](../../test/core/unit.test.js#L16)<br>[开场和后续单位共用身份分配，未登记时不可查，新实例必须保留已有单位](../../test/core/unit.test.js#L72) |
| [Capability · 资格限制](capability.md#资格限制) | [各限制列表只拒绝自身重复 ID，同名跨能力独立，运行替换只改所属列表](../../test/core/unit.test.js#L44) |
| [Resource · 直接致死的调用者组合](resource.md#直接致死的调用者组合) | [伤害和直接致死先通知击杀方再清受害者依赖，沿用首份 Departure，调用者组合直接致死也只奖励一次](../../test/core/unit.test.js#L88) |
| [接口约定 · 5.1 Unit 完整操作与批量变更](api-conventions.md#51-unit-完整操作与批量变更) | [组合依序读取先前结果并一次发布最终值，嵌套结算先完成，最终回原值仍执行前项已登记的结算](../../test/core/change.test.js#L10) |
| [Capability · Classification](capability.md#classification) | [类别与 Side 独立，敌对关系取决于恰有一方为 ENEMY](../../test/core/classification.test.js#L24)<br>[战斗标签与组织标签各按类别提供，缺少对应字段时匹配失败](../../test/core/classification.test.js#L65)<br>[按请求考虑额外职业，召唤复用子职业而没有常规职业，等级只匹配 ENEMY](../../test/core/classification.test.js#L111) |
| [Attribute](attribute.md#attribute) | [底值按定义边界规范化，修改后数值再按当前范围限幅](../../test/core/attribute.test.js#L7)<br>[后写替换整个区间，未提供一侧恢复该默认边界，清范围与移除数值来源彼此独立](../../test/core/attribute.test.js#L27)<br>[只求值竞争胜出的动态来源，每次读取调用者当前事实](../../test/core/attribute.test.js#L44) |
| [Hook · 类型化键与集合](hook.md#类型化键与集合) | [同名 Hook Key 仍按对象身份区分，替换同 ID 保留顺序和旧版本](../../test/core/hook.test.js#L12) |
| [Hook · 派发与生命周期](hook.md#派发与生命周期) | [本轮固定候选及优先级，删除跳过、替换读最新、平级稳定，嵌套独立采样](../../test/core/hook.test.js#L25)<br>[全局 entered 在单位登记后施加规则，本地 entered 读到实际已落地的外部效果](../../test/core/hook.test.js#L82)<br>[全局 entered 同步结束宿主时，剩余全局及本地入场程序都停止](../../test/core/hook.test.js#L123)<br>[removing 已发布 ENDING 并先于依赖收尾，removed 使用注销前最新登记和原历史载荷，本地结束后全局才通知](../../test/core/hook.test.js#L149)<br>[Skill 和 Burst 的结束通知仍能在宿主 ENDING 时读取已清空的激活和爆发](../../test/core/lifetime.test.js#L18) |
| [Lifetime · 请求与 Prepare](lifetime.md#请求与-prepare) | [上游宿主 ENDING 时拒绝新的间接依赖，即使中间 Action Execution 尚未收到结束请求](../../test/core/lifetime.test.js#L224) |
| [Lifetime · Finalize 与完成边界](lifetime.md#finalize-与完成边界) | [显式依赖查询排除隐含宿主，反向绑定拒绝闭环。先撤销输出，依赖者完成后才能终结父实例，首次结束固定原因。 显式解绑后只随宿主结束](../../test/core/lifetime.test.js#L63) |
| [Lifetime · 析构后执行操作](lifetime.md#析构后执行操作) | [结算之外延后操作立即产生其业务结果](../../test/core/lifetime.test.js#L143)<br>[析构队列按登记顺序读取最新状态，嵌套析构完成而新增任务不能抢先](../../test/core/lifetime.test.js#L152) |

## Action、Skill 与 Effect

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Action · 3. Definition、Action 与 Execution](action.md#3-definitionaction-与-execution) | [两个 Action 和 Skill 依装配顺序初始化，各自私有结果接续前一程序已提交的 BattleState](../../test/core/action.test.js#L18) |
| [Action · 5. Capability 与冷却](action.md#5-capability-与冷却) | [刷新攻速与间隔时各自按比例维持进度，FIXED 不动，公式限幅和属性范围分开](../../test/core/action.test.js#L128) |
| [Action · 6. 完整启动、写回与终止](action.md#6-完整启动写回与终止) | [拒绝保留准备期已完成的写入，结束期间仍可写该轮并保留持久状态，旧轮取消不影响新轮](../../test/core/action.test.js#L54) |
| [Action · 7. 调度](action.md#7-调度) | [重复自动候选的即时行动只执行一次，无释放程序不授 ACTION SP，空间消失时跳过选择](../../test/core/action.test.js#L258) |
| [Action · 8. 普通攻击、释放 Hook 与移动](action.md#8-普通攻击释放-hook-与移动) | [具体 onStart 在释放前转向一次，手动改变朝向后输出不再次转向，固定前后摇独立于攻速](../../test/content/actions/attack.test.js#L49)<br>[各组选敌以及 prepare 接续前组随机结果，实际输出落到已绑定的各组接收者](../../test/content/actions/attack.test.js#L88)<br>[触发组为空不进入内容准备，仍保留其他选敌程序已经消费的随机数](../../test/content/actions/attack.test.js#L114)<br>[既定治疗对象不被后来限制导致的新选择替换，纯治愈与未注册行动都汇总 NONE](../../test/content/actions/attack.test.js#L127)<br>[实际释放和结束遵守作者缩放上下界，执行占用与冷却就绪各自判断](../../test/content/actions/attack.test.js#L201)<br>[执行中改速立即影响冷却，已进入的等待保留样本，下一轮重新采样](../../test/content/actions/attack.test.js#L223)<br>[起手的等待和总预算先固定，中途改速能改变下一段采样，减速仍受原缓存截止限制](../../test/content/actions/attack.test.js#L254)<br>[每个目标独立读取最新攻击力，前一个目标的同步反应影响下一个，伤害保留本次明确分类](../../test/content/actions/output.test.js#L18)<br>[无 Offense 的宿主仍按静态数值施加伤害和自疗](../../test/content/actions/output.test.js#L52)<br>[释放前拦截不给 ACTION 回复，释放通知导致消失会保留回复并停止旧输出，成功攻击按序发布事实](../../test/core/action.test.js#L174) |
| [Skill · 2. SP](skill.md#2-sp) | [发动门槛和足额支付彼此独立，单次零费覆盖不改通常策略或后续启动](../../test/core/skill.test.js#L123)<br>[支付与阻回独立，满槽和阻回不追补，正速率按实时贡献推进，归零后恢复须等完整周期](../../test/core/skill.test.js#L284) |
| [Skill · 3. Duration 与弹药](skill.md#3-duration-与弹药) | [只延长当前 TIME，消失仍推进这轮，持久进度可使后续激活选 INFINITE](../../test/core/skill.test.js#L343)<br>[扣费前按当轮基础抽取弹药贡献，消费和耗尽检查分开，补弹与授予各守额度，正补弹报告已经提交的前后值。 旧行动输出期间切换激活，旧行动不扣新轮弹药，新行动才扣](../../test/core/skill.test.js#L394)<br>[弹药贡献可以在 TIME 期间登记和撤销，只改变以后取样的 AMMO 预算](../../test/core/skill.test.js#L482) |
| [Skill · 4. Restriction、程序与 Hook](skill.md#4-restriction程序与-hook) | [只受理声明且当前获准的主动处理器，受理可保留当前激活，内部结束独立](../../test/core/skill.test.js#L211) |
| [Skill · 5. 发动与完整结束](skill.md#5-发动与完整结束) | [拒绝不初始化不支付，支付与激活先发布，在启动通知导致暂时消失时仍可 onStart，结束只清原轮并在清槽后通知](../../test/core/skill.test.js#L16)<br>[支付通知中同步结束会保留已经支付的费用，继续旧 onStart 受重新读取后的激活资格约束](../../test/core/skill.test.js#L172) |
| [Effect · 4. 生效状态与覆写](effect.md#4-生效状态与覆写) | [DEFAULT 保留已安装的候选，优先级及同级顺序决定参与，停用胜出者仍压制候补，移除后才切换](../../test/core/effect.test.js#L113) |
| [Effect · 重复施加与叠层](effect.md#重复施加与叠层) | [EXTEND 更新剩余量，EXTEND_TIME 累加总量与余量，更新保留旧身份、内容及 Scope，拒绝不兼容的政策](../../test/core/effect.test.js#L257)<br>[STACK 区分层数和有效层数，满层续时、手动消耗和到期衰减各自结算，停用保存层数但不输出](../../test/core/effect.test.js#L333) |
| [Effect · 来源分组](effect.md#来源分组) | [UNIQUE 按共享、Unit 或无来源分别去重，来源归属和显式 Scope 的结束分别处理](../../test/core/effect.test.js#L468)<br>[同一 Card 的历史及新 Unit 共享来源组，不同 Card 和同数字的无卡 Unit 各自独立](../../test/core/effect.test.js#L525) |
| [Effect · 5. 回调与同步操作](effect.md#5-回调与同步操作) | [安装中续期或结束采样当前实例，零期限不短暂生效，结束读取撤销输出后的最新私有状态](../../test/core/effect.test.js#L19) |
| [Effect · 6. 时间推进](effect.md#6-时间推进) | [停用时仍扣时，只有 ACTIVE 执行业务，可手动推进和末次续期，新增实例不进本轮](../../test/core/effect.test.js#L160) |
| [Effect · 支持范围](effect.md#支持范围) | [眩晕中断 Action 并限制受影响的能力，允许独立 SP 恢复，其他同类来源仍有效时撤掉一个来源不能恢复](../../test/core/effects/control.test.js#L49)<br>[关闭父项下的 SP 回复限制可恢复回复，沉默仍阻止技能发动。父项结束清理两个标准子效果](../../test/core/effects/control.test.js#L93)<br>[技能按定义豁免各来源的眩晕发动限制，沉默、SP 门槛及其他能力的眩晕限制仍生效](../../test/core/effects/control.test.js#L120) |

## Battlefield、空间与调度

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Battlefield · 关键语义](battlefield.md#关键语义) | [批量交换按最终布局占格，保留旧版本和身体位置，结构写回不派发生命周期通知](../../test/core/battlefield.test.js#L19) |
| [Battlefield · 地图与地块](battlefield.md#地图与地块) | [非整数地址不能命中已有格，也不能登记占格或将覆盖误投到整数格](../../test/core/battlefield.test.js#L60) |
| [Navigation · Overlay 登记](navigation.md#overlay-登记) | [独立覆盖可以按身份撤销，有向出口和地块代价改变导航的实际路径，旧覆盖引用无法误删新限制，更新失效引用报告错误](../../test/core/battlefield.test.js#L80) |
| [Spatial · 数据归属与查询入口](spatial.md#数据归属与查询入口) | [身体原点与偏移命中体分开选中，扫掠按接触比例排列且排除消失和仍登记的 ENDING 对象](../../test/core/battlefield.test.js#L135) |
| [Blocking · 关系资格与 Restriction](blocking.md#关系资格与-restriction) | [双方有效限制、阵营、层、目标占量及地块根格共同决定能否取得或维持阻挡](../../test/core/blocking.test.js#L92) |
| [Blocking · 已确定的操作接口](blocking.md#已确定的操作接口) | [同值自身切层仍清理，整批双端先释放再通知，旧关系不能解除同双方后来重建的关系](../../test/core/blocking.test.js#L259) |
| [Blocking · 主动解除阻挡的空间操作](blocking.md#主动解除阻挡的空间操作) | [后执行的切层结算解除较早结算期间取得的当前关系，涵盖自身层与阻挡目标层](../../test/core/blocking.test.js#L216) |
| [Blocking · 显式关系操作与同步维护](blocking.md#显式关系操作与同步维护) | [缩容先裁最新关系，收到释放回调产生的新容量后决定是否继续裁撤](../../test/core/blocking.test.js#L169) |
| [Blocking · 两侧通知顺序](blocking.md#两侧通知顺序) | [关系通知先固定双方优先级却读取更新登记，本次搜索因回调增容可接住已有后继候选，不接住新出生单位](../../test/core/blocking.test.js#L33) |
| [Blocking · 站位计算与位置推进](blocking.md#站位计算与位置推进) | [近身站位分散并独立推进，普通解除或阻挡者离场保留计划，目标主动脱离和空间覆盖取消计划](../../test/core/blocking.test.js#L332) |
| [Capability · Facing](capability.md#facing) | [实例拥有左右方向，普通转向服从当前限制，强制转向可绕过转向限制，仍不能改变 ENDING 宿主](../../test/core/facing.test.js#L13) |
| [Capability · 触发与跨领域交互](capability.md#触发与跨领域交互) | [有效自主移动按导航方向而非历史速度朝向，拒绝转向不撤回位移，纯纵向或过近目标保留原朝向](../../test/core/facing.test.js#L55) |
| [Occupancy · 已通知的业务配对](occupancy.md#已通知的业务配对) | [双槽共存且同槽排他，Pair 先向双方发布再通知，旧 Pair 先解除再通知，撤退中重建的配对留存，下一次登记继续分配不同身份，摆放方向变化不移动占格或重建 Pair](../../test/core/occupancy.test.js#L26) |
| [Presence · 发布与同步结算](presence.md#发布与同步结算) | [消失保留占格和已有寿命，先提交限制并解除阻挡，再取消 Action，恢复仅解除自己的限制](../../test/core/presence.test.js#L19) |
| [总体架构 · 战斗状态的层级](ARCHITECTURE.md#战斗状态的层级) | [初始化手牌先于机制，机制先于逐个开场 Unit，后续入场读取前序同步业务的最新状态](../../test/core/runtime.test.js#L28) |
| [函数式内核 · 正常取消与失败](functional-core.md#正常取消与失败) | [Tick 各阶段接续已发布资源，后继异常不污染输入版本，无调度计划仍可正常推进战斗](../../test/core/runtime.test.js#L113) |
| [Skill · 5. 发动与完整结束](skill.md#5-发动与完整结束) | [命令 MANUAL 检查触发类型而不抑制 AUTO 或 PASSIVE，显式发动可按程序启动 AUTO](../../test/core/runtime.test.js#L164) |
| [Schedule · 调度时间](schedule.md#调度时间) | [主线待重试操作不快进本队列，其他队列照常推进，目标出现后待重试和已到期后继继续接续](../../test/core/schedule.test.js#L91) |
| [Schedule · 从 Spawn 到 Unit](schedule.md#从-spawn-到-unit) | [波次和片段前延迟决定实际出生 Tick，出生位置和 Route 使用同一偏移样本](../../test/core/schedule.test.js#L56)<br>[出生已登记的等待在该 Unit 的 entered 立即移除自身时同步释放，允许下一波按时出生](../../test/core/schedule.test.js#L292) |
| [Schedule · Branch 抽选与同步重入](schedule.md#branch-抽选与同步重入) | [已抽中的 Branch 操作可保留到过期后，使用实际出现的新目标完成该实例](../../test/core/schedule.test.js#L148)<br>[Branch 在 entered 中触发后继 Phase 能读到已发布索引，外层旧 Phase 后继保留](../../test/core/schedule.test.js#L325)<br>[循环重入时重新抽选并在 entered 前发布 RNG，各次实例保存自己已选择的后续条目](../../test/core/schedule.test.js#L366) |
| [Schedule · Route 的主流程时间上下文](schedule.md#route-的主流程时间上下文) | [动态出生取得主线 Wave 和 Fragment 时基快照，之后 Route 的绝对等待按其出生时基推进](../../test/core/schedule.test.js#L417) |
| [Schedule · 等待关系与生命周期](schedule.md#等待关系与生命周期) | [出生的等待先于 entered 可见，Wave 超时只清前进等待，最终等待在对应 Unit 完成离场后解除](../../test/core/schedule.test.js#L190)<br>[活 Unit 可只撤销自身 Wave 等待，操作本身不推进，也保留实例和最终等待](../../test/core/schedule.test.js#L259) |
| [Navigation · distance](navigation.md#distance) | [路线剩余距离使用导航几何长度且排除瞬移路段，不用搜索代价](../../test/core/navigation/route.test.js#L42) |
| [Navigation · Route／Locomotion 的交互约束](navigation.md#routelocomotion-的交互约束) | [受力时路线等待继续经过，控制权在外力运动完成后恢复自主推进](../../test/core/navigation/route.test.js#L120)<br>[所在格变为不可通时能移向邻格恢复，当前 MOVE 不因无导航建议而被消费](../../test/core/navigation/route.test.js#L145) |
| [Navigation · 类型与身份](navigation.md#类型与身份) | [指定 Context 的距离查询不随另一个路线取得当前控制权而改变](../../test/core/navigation/route.test.js#L68) |
| [Navigation · 控制选择与计时](navigation.md#控制选择与计时) | [Context 控制权和计时独立，ENTER 可暂停，绝对等待仍沿出生时钟推进](../../test/core/navigation/route.test.js#L89) |
| [Navigation · Checkpoint 与进入](navigation.md#checkpoint-与进入) | [MOVE 仅在进入时采样，读取不重抽，循环再进入才产生新样本](../../test/core/navigation/route.test.js#L190)<br>[TRACE 到达仍保留目标格和控制权，只有显式重启或移除会结束当前保留状态](../../test/core/navigation/route.test.js#L202) |
| [Navigation · 推进与同步操作](navigation.md#推进与同步操作) | [长即时无环链可以一次完成，当前即时循环让出而不阻塞 Tick](../../test/core/navigation/route.test.js#L179)<br>[APPEAR 等空间指令先发布消费结果再触发回调，继续时使用最新 Context](../../test/core/navigation/route.test.js#L263) |
| [Navigation · 公开操作](navigation.md#公开操作) | [路线重指派重建当前已进入指令，skipWait 只跳过允许跳过的相对等待](../../test/core/navigation/route.test.js#L165) |
| [Navigation · 运动目标与 Main 出口](navigation.md#运动目标与-main-出口) | [Main 出口检查独立于临时 Context 控制，完整离场仅发生一次](../../test/core/navigation/route.test.js#L230) |
| [Navigation · Locomotion](navigation.md#locomotion) | [身体半宽只延伸水平方向障碍接触范围，不能被当作圆半径](../../test/core/navigation/avoidance.test.js#L23)<br>[仅同时跨越两轴的斜角参与避障，多个穿入量先汇总再决定合力方向](../../test/core/navigation/avoidance.test.js#L30)<br>[WALK 避开超高费用格，FLY 只避开硬障碍](../../test/core/navigation/avoidance.test.js#L38)<br>[避障剔除当前行进方向分量，余量按历史速度缩放](../../test/core/navigation/avoidance.test.js#L45)<br>[不可通当前格选择最近的可通邻格恢复，允许斜向高代价格作为有效逃逸](../../test/core/navigation/avoidance.test.js#L55)<br>[驱动力与避障先合并并限力，随后积分速度并限速](../../test/core/navigation/locomotion.test.js#L25)<br>[落脚格反射只修改本次位移，不沿途扫掠或迭代反射](../../test/core/navigation/locomotion.test.js#L39)<br>[经过中间建议点不吸附，到精确终点可以吸附且保留历史速度](../../test/core/navigation/locomotion.test.js#L51)<br>[无 Route 的 Unit 仍经 Runtime 推进受力运动，距离里程按实际已提交位移采样](../../test/core/navigation/locomotion.test.js#L66)<br>[普通运动读取当前地块，遇阻反射本次位移而保留控制器速度](../../test/core/navigation/locomotion.test.js#L93)<br>[运动速度、速度最小值和允许自行移动是三个事实，禁止移动不等同于擦掉有效数值](../../test/core/navigation/speed.test.js#L14) |
| [Navigation · 施力入口](navigation.md#施力入口) | [推击使用当前施力等级、加成与重量，开始运动前释放阻挡](../../test/core/navigation/unbalance.test.js#L62)<br>[零拉力查表结果或已注销施力者拒绝建立牵引](../../test/core/navigation/unbalance.test.js#L100)<br>[受力免疫既能拒绝创建，也能在现有失衡位移前终止该段](../../test/core/navigation/unbalance.test.js#L252) |
| [Navigation · 牵引的身份、近停和结束](navigation.md#牵引的身份近停和结束) | [已创建牵引保留采样后的力，改变施力和重量仅影响下一次创建](../../test/core/navigation/unbalance.test.js#L110)<br>[同一来源能建立多条独立牵引，只有唯一有效牵引可清共享速度](../../test/core/navigation/unbalance.test.js#L128)<br>[动态拉点可离开近停后恢复有效受力，移除其来源结束牵引而保留动量](../../test/core/navigation/unbalance.test.js#L154)<br>[默认 ONCE 不重复刹车，WHILE_NEAR 在再次受力后仍可重新清速](../../test/core/navigation/unbalance.test.js#L193)<br>[结束旧失衡段完成其牵引依赖，嵌套启动的新段及其身份继续有效](../../test/core/navigation/unbalance.test.js#L325) |
| [Navigation · 单步结算](navigation.md#单步结算) | [发布位移与通知后才清速，近停保留牵引实例，手动结束后失衡由后续推进结算](../../test/core/navigation/unbalance.test.js#L214)<br>[摩擦修正每步读取，后续失衡段同样使用该值，撤销后恢复配置底值](../../test/core/navigation/unbalance.test.js#L270)<br>[强制移动以实际 Shape 与障碍首次接触并滑动，通知读取已提交位置](../../test/core/navigation/unbalance.test.js#L302) |
| [Targeting · 查询组合](targeting.md#查询组合) | [同一绑定来源的伤害谓词在不同 BattleState 上读取当前受选限制](../../test/core/targeting/eligibility.test.js#L72) |
| [Targeting · 标准资格](targeting.md#标准资格) | [混合治疗接受 HP 或 EP 任一有效需求，仅 ACTIVE healFree 影响 HP 选敌](../../test/core/targeting/eligibility.test.js#L88)<br>[EP 选择用当前资源需求和 Burst 资格，未执行实际接收 Restriction](../../test/core/targeting/eligibility.test.js#L134)<br>[不同阵营与真正敌对关系分开，以调用者传入来源为基准判断](../../test/core/targeting/targetable.test.js#L58) |
| [Targeting · 空间与优先级](targeting.md#空间与优先级) | [HP 资格与显式原点及 Hitbox 几何分离，消失不再候选，变更受选类别立即影响同范围筛选](../../test/core/targeting/eligibility.test.js#L44)<br>[嘲讽比较读取带符号的有效属性及取偶舍入，动态贡献可改变排序](../../test/core/targeting/targetable.test.js#L73) |
| [Targeting · Targetable](targeting.md#targetable) | [按定义身份豁免时先选有效贡献，同函数不同定义保留独立，豁免胜出项不会恢复败项](../../test/core/targeting/targetable.test.js#L26) |

## Deployment

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Deployment · 静态内容与 Card](deployment.md#静态内容与-card) | [初始化先保留互异 Card 身份，添加后才能查询且按登记顺序追加](../../test/core/deployment.test.js#L48) |
| [Deployment · 待部署区顺序](deployment.md#待部署区顺序) | [两个 Card 收费变化都参与当 Tick 排序，撤销规则保留已排顺序，显式排序可同步重排](../../test/core/deployment.test.js#L67) |
| [Deployment · 部署历史](deployment.md#部署历史) | [多张不同价格的 Card 共用 Unit 蓝图，开场 Unit 无 Card，成功记录按实际顺序先于 entered 发布](../../test/core/deployment.test.js#L107) |
| [Deployment · 请求与统一资格](deployment.md#请求与统一资格) | [策略覆盖不能豁免库存、支付、地图和占格固有前提，免支付及合法零支付均保有本次真实部署事实](../../test/core/deployment.test.js#L252)<br>[Card Definition 与 DeployRequest 各在本身入口拒绝同列表重复限制 ID](../../test/core/deployment.test.js#L291)<br>[分层按 ID 覆盖之后才求有效组贡献，并用稳定拒绝原因报告第一项失败](../../test/core/deployment.test.js#L313) |
| [Deployment · 普通部署流程](deployment.md#普通部署流程) | [预览和实际操作共享报价与资格，拒绝无消费或通知，成功先结账再构造和入场，并保留本次摆放方向](../../test/core/deployment.test.js#L155) |
| [Deployment · 卡牌费用](deployment.md#卡牌费用) | [实际部署报价采用费用覆写与有效的涨费倍率上限，分两段取整并最后加固定值，移除贡献后恢复报价](../../test/core/deployment.test.js#L345) |
| [Deployment · 离场结算](deployment.md#离场结算) | [撤退先退款、注销统一回收 Card，死亡无退款且即时清格，额度延后一秒归还，同一 Card 再部署产生新身份而可反查旧来源](../../test/core/deployment.test.js#L345)<br>[SELF 与 EXTERNAL 都不返还撤退 DP，只有 EXTERNAL 启动 Card 回收和涨费](../../test/core/deployment.test.js#L512) |
| [Deployment · 库存与计时](deployment.md#库存与计时) | [DEFAULT 部署开钟，撤退不重置计时也不还库存，显式补货仍等待原冷却后方可部署](../../test/core/deployment.test.js#L532)<br>[QUEUED 追加与暂停保留当前段，可边恢复边部署，归零也每 Tick 最多转一份，当次 onTick 读取已发布库存](../../test/core/deployment.test.js#L561)<br>[持有上限同时计可用及待恢复，缩容优先保留队列、裁空清计时和暂停，在场上限只限制新部署](../../test/core/deployment.test.js#L636) |
| [Deployment · DP](deployment.md#dp) | [真实 Tick 产生的自然 DP 在同 Tick 部署命令前可用](../../test/core/deployment.test.js#L693)<br>[负 DP 半速、跨零保留已积进度，满额期间不积攒待恢复预算](../../test/core/deployment.test.js#L719)<br>[上限变更默认保留超额，显式裁剪只向下，有效下限控制足额支付，提高下限会同步补齐余额](../../test/core/deployment.test.js#L751)<br>[恢复倍率的登记与移除保留已经积累的自然回复进度](../../test/core/deployment.test.js#L802) |
| [Deployment · Slot](deployment.md#slot) | [有效限位增加可多部署，撤销不驱逐已有单位，超额时零占用部署仍允许](../../test/core/deployment.test.js#L456)<br>[基础不限位不受有限增量约束](../../test/core/deployment.test.js#L492) |

## Projectile、Mechanism 与 Terrain

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Projectile · 4. 创建、查询与内容更新](projectile.md#4-创建查询与内容更新) | [初始化仅预留身份，登记后入场能读取自己并接续嵌套创建，弹道保存自身阵营](../../test/core/projectile.test.js#L28) |
| [Projectile · 5. 时间推进](projectile.md#5-时间推进) | [固定候选轮到时取最新资格，先前弹道已经移除的候选不再执行](../../test/core/projectile.test.js#L72)<br>[Runtime 在整 Tick 起点锁定弹道，Unit 和 Action 阶段创建的弹道都立即入场、下一 Tick 才推进](../../test/core/projectile.test.js#L116) |
| [Projectile · 外部变速与运动](projectile.md#外部变速与运动) | [选择支持变速的弹道，多来源相乘，同 ID 覆盖及独立撤销都体现在后续实际位移](../../test/core/projectile.test.js#L88) |
| [Projectile · 6. 终止请求与 Finalize](projectile.md#6-终止请求与-finalize) | [登记期间当场结束可进入结束程序，回调看到 ENDING 与指定原因，随后注销](../../test/core/projectile.test.js#L55) |
| [Terrain · Mechanism 操作](terrain.md#mechanism-操作) | [初始配置可直接 INACTIVE 且登记时只调用 onEnter。运行时同样先保留新身份并在登记后通知，只有实际启停边沿在写入后派发](../../test/core/mechanism.test.js#L21)<br>[停用保存私有状态而不推进，但仍能作为 Lifetime 依赖，移除它时先执行依赖 onEnd 再执行宿主 onEnd](../../test/core/mechanism.test.js#L69) |
| [Projectile · 移除与消除](projectile.md#移除与消除) | [普通停止可对当前原目标结算保底，可消除弹道收到 ELIMINATED 则跳过保底](../../test/content/projectiles/arrow.test.js#L75) |
| [Projectile · 7. 命中与内容状态](projectile.md#7-命中与内容状态) | [目标暂时消失仍使用实时位置，几何抵达尝试原目标但接收可拒绝，正常拥有延迟终止](../../test/content/projectiles/arrow.test.js#L50)<br>[伤害同步回调停止弹道时已发布的命中记录防止结算第二次](../../test/content/projectiles/arrow.test.js#L90)<br>[箭从在场来源读最新攻击力，来源注销后维持弹道并使用发射样本](../../test/content/projectiles/arrow.test.js#L109)<br>[目标注销后仍朝最后记忆位置飞行，到达不会改为命中该处新对象](../../test/content/projectiles/arrow.test.js#L130) |
| [Occupancy · 与其他领域协作](occupancy.md#与其他领域协作) | [平台立即释放其地面乘员的阻挡，地块普通阻挡权仍可由其他单位使用](../../test/content/devices/shooting-platform.test.js#L45)<br>[平台乘员可用空中阻挡，切回地面退出原关系且不能重新接敌](../../test/content/devices/shooting-platform.test.js#L55)<br>[平台移除完整击倒自己的乘员且保留别格单位，同时恢复本格地形](../../test/content/devices/shooting-platform.test.js#L66) |
| [Terrain · Content 行为](terrain.md#content-行为) | [箱体改的是登记格，普通阻碍成本为 1000 而地穴固定成本不变，离场只恢复自己负责的属性](../../test/content/devices/tiles.test.js#L43)<br>[源石分格入场并独立保留期限，覆盖暂停弱效果周期后延续，离格和控制器停用后按自身期限结束，ENVIRONMENT 正常接收而不授 HIT](../../test/content/terrain.test.js#L85)<br>[沼泽相邻格保留叠层周期，本步有效重量分辨单双层，离开撤销效果](../../test/content/terrain.test.js#L152)<br>[深水只影响地面敌人，地穴检查强制移动落点及空地变化，移除符合资格的单位](../../test/content/terrain.test.js#L184)<br>[烟雾按我方 DEFAULT 资格接纳地面及空中，建立阻挡不破隐，离开取消](../../test/content/terrain.test.js#L223) |
| [Terrain · 地形接触与调度](terrain.md#地形接触与调度) | [Runtime 在本 Tick 路线自主移动之后扫描地形，用实际落点立即应用效果](../../test/content/terrain.test.js#L249) |

## Hook 与伤害／治疗的回归语义

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Vitality · 自然 HP 回复](vitality.md#自然-hp-回复) | [自然恢复在 Effect 后 Action 前按当前属性推进，不经普通治疗，消失可自然恢复而零 HP 不可](../../test/core/vitality.test.js#L29) |
| [Vitality · 伤害写入前后](vitality.md#伤害写入前后) | [保护读写完整 Health，按当前宿主提交并先输出 Event，嵌套后继不改原报告，失去宿主不提交](../../test/core/vitality.test.js#L130) |
| [Vitality · 负生命与资源分配](vitality.md#负生命与资源分配) | [MaxHP 与债务按最新容量处理，恢复先填债再恢复生命并分离溢出，恢复导致离场也保留实际报告](../../test/core/vitality.test.js#L242) |
| [Elemental · 3. 查询、结算与资源提交](elemental.md#3-查询结算与资源提交) | [五条 EP 独立扣减、各得同额治疗并按当前容量归位，零收益不通知 healed，回复无需 Vitality](../../test/core/elemental.test.js#L305) |
| [Elemental · 4. Hook、提交事实与同步重入](elemental.md#4-hook提交事实与同步重入) | [EP 耗尽先发布 Burst 和标准输出，再通知资源损伤与 Applied](../../test/core/elemental.test.js#L221)<br>[同步取消新 Burst 抑制后续标准输出，原 EP 损失和身份报告仍有效](../../test/core/elemental.test.js#L265) |
| [Elemental · 5. 完整结束与离场](elemental.md#5-完整结束与离场) | [结束通知中新建爆发不会被旧 Ref 改写，已有独立眩晕只按自身期限解除](../../test/core/elemental.test.js#L128) |
| [Elemental · 6. 时间推进](elemental.md#6-时间推进) | [敌方凋亡依消耗的恢复预算推进元素伤害及攻击衰减，停钟无输出、变速仍走完同一周期](../../test/core/effects/elemental.test.js#L106)<br>[爆发期间拒收普通 EP，消失仍按当前速度和 MaxEP 推进，完成或取消后撤销根依赖输出](../../test/core/elemental.test.js#L41)<br>[缩短恢复保留已推进量，耗尽可直接以最新 MaxEP 回填，清理根附属且不补发输出和治疗](../../test/core/elemental.test.js#L88)<br>[零恢复预算仍可保留安装时业务及独立眩晕，不执行后续周期](../../test/core/elemental.test.js#L180) |
| [Elemental · 2. Burst Effect 与标准规则](elemental.md#2-burst-effect-与标准规则) | [敌我侵蚀的减防都在恢复后保留，再次爆发叠加且触发本次伤害](../../test/core/effects/elemental.test.js#L67)<br>[角色凋亡结算十五次法术脉冲和扣 SP，根存续封住发动及回复并在结束后恢复](../../test/core/effects/elemental.test.js#L81)<br>[未消耗的神经麻痹在根结束后仍中止行动，续爆重置剩余层数](../../test/core/effects/elemental.test.js#L159) |
| [Elemental · 狂躁的行动与时间累加](elemental.md#狂躁的行动与时间累加) | [角色狂躁同一执行只计其首次释放，技能单独累加，伤害封顶并允许 HIT，结束恢复根后独立程序仍持续](../../test/core/effects/elemental.test.js#L181)<br>[只有 Skill 的角色也监听成功激活，激活被拒绝不累加](../../test/core/effects/elemental.test.js#L241)<br>[敌方狂躁用独立 ACTIVE Tick 计数，不随恢复变速，不给 HIT，保留最后一次脉冲](../../test/core/effects/elemental.test.js#L263) |
| [Resource · Calculate 与 Apply 的语义边界](resource.md#calculate-与-apply-的语义边界) | [接收和提交前 Hook 的资源改写作为当前结算基线，Applied 中发生的变化不能重写本笔报告](../../test/core/resource/application.test.js#L296)<br>[HP 计算输出零拒绝，正输出接收为零仍提交，提交后目标离场跳过剩余目标通知，来源继续读取已固定报告](../../test/core/resource/application.test.js#L535)<br>[满血治疗仍能产生溢出，自疗分别通知双 Applied 但只一次 Completed，消失目标可受实际治疗不能受普通 HP 或 EP 损伤](../../test/core/resource/application.test.js#L999)<br>[以 EP 治疗验证公式可修正负输入，最终负输出归零且不执行 Apply 接收](../../test/core/resource/calculation.test.js#L231) |
| [Resource · 请求分类](resource.md#请求分类) | [前置取消跨准入保留且阻止 HIT，但准入通过仍可通知接收，解除保护后才恢复受伤及 HIT](../../test/core/resource/application.test.js#L153)<br>[LOSS 可穿过不在场及无敌限制，仍接续普通损伤流程，但本笔不给 HIT](../../test/core/resource/application.test.js#L636)<br>[环境 EP 用同一抗性和接收流程，基于 Nature 的取消可由本次调用豁免](../../test/core/resource/application.test.js#L716) |
| [Resource · 基础公式与弱点选择](resource.md#基础公式与弱点选择) | [计算采用最终伤害类型与采样防御，Apply 接续已采样数额，计算不启动接收](../../test/core/resource/calculation.test.js#L43)<br>[EP 抗性与 HP 元素抗性独立，基础保底可被 Output 继续降低，已计算 EP 输出不受后续抗性变化重算](../../test/core/resource/calculation.test.js#L180) |
| [Resource · 弱点伤害的项目规则](resource.md#弱点伤害的项目规则) | [各 Calculate 从同一原版本独立结算嵌套业务，只发布所选分支的状态和一次 Apply](../../test/core/resource/calculation.test.js#L137) |
| [Resource · 接收工作值、数值固定与取消](resource.md#接收工作值数值固定与取消) | [禁用取消理由及固定量约束工作值单向演进，提前完成的治疗、恢复及反伤不回滚](../../test/core/resource/application.test.js#L401) |
| [Resource · 本次 Hook 排除、取消权限与接收豁免](resource.md#本次-hook-排除取消权限与接收豁免) | [排除按 Key 或 ID 作用于本次各宿主，Calculate、Apply 和嵌套业务独立，同名不同 Key 不受影响](../../test/core/resource/application.test.js#L37)<br>[同一次豁免按最新有效限制复检，不传给没有明确选项的嵌套伤害](../../test/core/resource/application.test.js#L247) |
| [Resource · 生命状态、通知与离场](resource.md#生命状态通知与离场) | [零 HP 直到 Applied 后才确认离场，正常治疗拒绝，直接恢复可保留原阻挡，未恢复才清理](../../test/core/resource/application.test.js#L775) |
| [Resource · 单笔击杀结果与 targetKilled](resource.md#单笔击杀结果与-targetkilled) | [嵌套损伤首次获确认，不因延迟注销而重复归属，仍登记的 ENDING 击杀者可异于请求来源](../../test/core/resource/application.test.js#L877)<br>[Completed 启动的致死后继不能改写已经固定的外层击杀结果](../../test/core/resource/application.test.js#L969) |

## Event 的回归语义

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Event · 类型归属与收集](event.md#类型归属与收集) | [四种成功结算输出实际变化，HP 取消输出零而 EP 损伤取消无输出，下一 Tick 清空而旧状态仍可读](../../test/core/event.test.js#L20) |
| [Event · 输出时点与业务独立](event.md#输出时点与业务独立) | [爆发保留发生时位置，Tick 内后续移动和死亡不会改写历史 Event](../../test/core/event.test.js#L80) |

## Data 与单位内容

| 架构条款 | 验收结果与代表场景 |
| --- | --- |
| [Data · 业务输入](data.md#业务输入) | [实际场景中的沼泽与深水控制器被绑定为机制，所选真实技能黑板提供各自地形参数](../../test/data/level/predefined.test.js#L96) |
| [Data · 共享读取与换算](data.md#共享读取与换算) | [作者帧换算保留 Begin 与连续小数，负上限按无限制规范化](../../test/data/action/timing.test.js#L12)<br>[预置个体指定技能级别并覆盖黑板时，实际场景参数使用覆盖值](../../test/data/level/predefined.test.js#L115) |
| [Data · 干员静态资料](data.md#干员静态资料) | [按角色身份连接组织标签、养成、范围与选定技能数据，转换范围并保留技能费用和黑板](../../test/data/unit/operator.test.js#L42)<br>[完整原表保留未消费原始行和模式候选，常规内容只解释本次选中数据](../../test/data/unit/operator.test.js#L66)<br>[阶段成长保留连续基础间隔，只对整数属性舍入，并拒绝越过定级上限](../../test/data/unit/operator.test.js#L111)<br>[界面潜能映射累积原表等级，同一份潜能同时影响基础修正与可用天赋候选](../../test/data/unit/operator.test.js#L119)<br>[信赖独立插值和舍入后叠加，超过 100% 与 100% 战斗属性一致](../../test/data/unit/operator.test.js#L133)<br>[实际技能按解锁与专精门槛选择，校验跨表身份，专精后读取新的费用和倍率](../../test/data/unit/operator.test.js#L147)<br>[同个精英阶段内可以跨级更换天赋候选，天赋额外攻击不写进基础攻击属性](../../test/data/unit/operator.test.js#L160)<br>[模组各阶段用各自总属性并检查信赖、等级、归属，替换候选仍受潜能和所选模组身份约束](../../test/data/unit/operator.test.js#L169)<br>[模组的纯数据槽覆盖或追加天赋时保留原生身份和字符串黑板](../../test/data/unit/operator.test.js#L191) |
| [Data · 敌人静态资料](data.md#敌人静态资料) | [关卡覆写最终 Prefab 后读取该 Prefab 的运动配置，敌人属性进入回血、等级和元素绑定，未支持免疫明确拒绝](../../test/content/enemies.test.js#L84)<br>[等级继承与关卡覆盖逐字段依 m_defined 合并，显式零及标签、位阶、回血规范化](../../test/data/unit/enemy.test.js#L14)<br>[基础、选中等级和关卡原始层分别保留技能、天赋及共享 SP，同层普通属性仍正常读取](../../test/data/unit/enemy.test.js#L43) |
| [Data · 静态配置与数值](data.md#静态配置与数值) | [真实预置保留别名、隐藏和登记坐标，Prefab 阵营/筛选标签与角色组织标签独立于装置固定受选类别](../../test/data/level/predefined.test.js#L34)<br>[未选中潜能的未支持公式不影响通常装配，选中才在内容配置入口拒绝](../../test/data/unit/operator.test.js#L211)<br>[标签转换保留大小写和首次出现顺序，重复项去除，缺源和无效成员在入口拒绝](../../test/data/unit/tags.test.js#L6) |
| [Data · 当前支持边界](data.md#当前支持边界) | [原生叠层解析分别保存总层上限、生效层、满层续期、到期清理和样本选项](../../test/data/effect.test.js#L19)<br>[修正公式、属性标识规范化，仍保留黑板和原属性延后采样标记](../../test/data/effect.test.js#L41) |
| [Elemental · 1. 能力与定义](elemental.md#1-能力与定义) | [原生字符串 ANGER 与数值 5 都规范成统一运行类型 MANIA](../../test/data/effect.test.js#L14) |
| [Navigation · Checkpoint 与进入](navigation.md#checkpoint-与进入) | [原生巡逻解析成 MOVE 与 GOTO，四类 WAIT 各保留其时间基准并换算为 Tick](../../test/data/level/route-schedule.test.js#L47) |
| [Navigation · 施力入口](navigation.md#施力入口) | [关卡可设推击倍率，显式零不会被默认值覆盖](../../test/data/level/route-schedule.test.js#L63) |
| [Schedule · 静态计划](schedule.md#静态计划) | [主线加权组先选 Action，按原顺序展开唯一选中组的 count/interval，预处理拒绝不支持的 Pack](../../test/data/level/route-schedule.test.js#L70) |
| [Schedule · Branch 抽选与同步重入](schedule.md#branch-抽选与同步重入) | [Branch 保持完整候选组和来源顺序，把抽选和随机状态消耗留给 Runtime](../../test/data/level/route-schedule.test.js#L93) |
| [Schedule · 等待关系与生命周期](schedule.md#等待关系与生命周期) | [关卡 Action 与敌人数据库的统计豁免传入调度，仍在场的单位不阻塞 Wave 或完成](../../test/data/level/route-schedule.test.js#L106) |
| [Action · 8. 普通攻击、释放 Hook 与移动](action.md#8-普通攻击释放-hook-与移动) | [真实弩手按事件释放、弹箭到达才造成伤害、恢复期间继续停步并在结束后恢复路线，注册攻击方式汇总 ALL](../../test/content/enemies.test.js#L204)<br>[首次攻击等待 Begin，连续攻击跳过，目标间断或中止后的下一轮恢复 Begin](../../test/content/operators/melantha.test.js#L64) |
| [Content · Core 标准机制与 Content 共享工厂](content.md#core-标准机制与-content-共享工厂) | [登场面向读取首检查点执行完的最新位置及后继移动目标](../../test/content/enemies.test.js#L116)<br>[真实弩手近远模式切换不覆盖对方冷却，分别按自己 ready 时间再次输出](../../test/content/enemies.test.js#L247) |
| [Targeting · 调用业务](targeting.md#调用业务) | [猎狗可攻击真正阻挡自己的隐匿目标，命中仍尊重无敌](../../test/content/enemies.test.js#L146)<br>[弩手近战绑定实际阻挡关系，未阻挡时使用远程选择且仍受远程默认限制](../../test/content/enemies.test.js#L168)<br>[玫兰莎即使建立阻挡也保持普通攻击的隐匿资格](../../test/content/operators/melantha.test.js#L55) |
| [Content · 语义证据与项目政策](content.md#语义证据与项目政策) | [固定配置使天赋与 S1 同时作用于实际攻击，技能到期后保留永久天赋](../../test/content/operators/melantha.test.js#L37)<br>[环境伤害可被盾抵挡并触发自疗，已满足本笔资格的普通 HIT 回复不回滚](../../test/content/operators/mudrock.test.js#L71)<br>[护盾满层继续推进充能，清空后按此前周期准时获得盾，有效时实际抵挡](../../test/content/operators/mudrock.test.js#L86)<br>[X 模组用当前 MaxHP 计算盾疗，普通伤害按萨卡兹与实际阻挡关系区分减伤](../../test/content/operators/mudrock.test.js#L98)<br>[成功 BLOCKED 才耗盾、自疗、额外授 SP，权限禁止或已取消时保留盾，FIXED 与 NORMAL 各守数值规则](../../test/content/operators/mudrock.test.js#L116)<br>[S2 缺适格目标时不激活也不支付已满足的费用](../../test/content/operators/mudrock.test.js#L173)<br>[S2 可取代已释放普攻的恢复，清冷却后按绑定目标重验而不补选，单次自疗并在规定时刻解除目标控制](../../test/content/operators/mudrock.test.js#L181)<br>[S2 可截断未释放的普攻，推进过本应命中的时刻仍只有技能伤害](../../test/content/operators/mudrock.test.js#L223)<br>[实际内容工厂明确拒绝 Y 模组，防止套用 X 的已实现行为](../../test/content/operators/mudrock.test.js#L246) |
