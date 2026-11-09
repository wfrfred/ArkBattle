# 已审查范围的语义验收

先确定需要保障的语义，再选择最小的代表场景。本页定义验收依据，不按现有测试反推需求，也不为每个接口、字段或内部步骤建立用例。代表场景的测试归属见[测试说明](../../test/README.md#已审查范围)。

## 范围

- `core/battlefield/`：地图与地块、Unit 存储、结构占格、Navigation 和 Spatial 查询。
- `core/unit/` 的基础 Unit、构造、查询、Change，以及独立的 Action、Skill、Effect、Contribution 领域。
- `core/unit/capability/` 的 Action、Allegiance、Blocking、Deployable、Elemental、Hitbox、Layer、Locomotion、Occupancy、Offense、Route、Skill、Presence、Targetable 与 Vitality。
- 对应的 `core/battle/unit.ts`、Tile、Blocking、Deployment／Card、Occupancy 协作、Schedule 主线与 Branch 调度，以及 Runtime 对上述领域的调用。
- Unit 本地类型化 Hooks、HP／EP 的 Damage／Healing 两阶段结算，以及 Vitality／Elemental 的专属接收、资源提交与 Burst 协作。
- 公共 Hook、Typed Ref 和 Lifetime 只承担上述领域共享的契约，不按每个消费者重复展开。

Deployable 对 Occupancy 的构造依赖、单格双槽登记、入场与配对，以及 Skill Capability 的宿主配对与资源职责均属于上述范围。完整 Projectile、Mechanism 与 Legacy 展示协议的独立业务不在本页范围内；它们参与的已审查跨领域语义按下文集中保障。

## 保留依据

领域文档的“关键语义”说明需要保障的结果；接口与实现章节供接入和维护参考，不自动转化为测试要求。尚未接入的机制、调查方向和设计示例不是已完成产品的验收承诺。

重要语义包括实际游戏结果、身份与资源不变量，以及会决定这些结果的跨领域结算边界。没有业务影响的遍历细序、对象复用、缓存结构和一 Tick 左右的局部轨迹差异，依照[项目语义尺度](README.md)取舍。

文档发生冲突时，先依据已确认的约定和机制证据统一文档。源码用于核对实现与缺口，既有测试不能裁定领域契约。

纯算法可以直接使用合法值，不要求每次计算都重放整场战斗。涉及运行身份、资源账务或生命周期的场景，通过所属领域操作建立事实；合成数据不得替代这些操作而伪造其已完成的结果。

## 必须保障的结果

下列条目是验收义务，不指定测试文件数或 `test()` 数量。一个真实场景可以同时覆盖多项；同一共享协议只保留集中保障，各领域仅补充不同的业务后果。

| 领域 | 关键结果 | 契约来源 |
| --- | --- | --- |
| Battlefield 版本与结构 | 写回不改写旧版本；全批最终布局决定同格双槽的唯一归属；结构发布不代办业务回调。 | [Battlefield](battlefield.md#关键语义) |
| 地图、导航与空间查询 | Tile 与 Overlay 决定当前可达性和导航结果；缓存不改变结果。身体位置、空间存在、占格和命中几何分别表达，空间接触不等于业务命中。 | [Battlefield](battlefield.md#关键语义)、[Spatial](spatial.md) |
| 空间存在 | presence.isPresent(unit) 查询空间存在，与 Unit.lifecycle 分开；暂时消失保留身份、位置、占格、部署与生命周期。Presence Change 可位于组合任意位置，全部空间事实及限制先发布，再由自身 Settlement 调用 Blocking 完整操作清理当前关系及自身计划，之后委托 Action 领域取消宿主执行。已成立的 Skill、Effect、Burst 与独立 Projectile 不统一结束，伤害、恢复、选择与锁定命中分别判断。 | [Presence](presence.md) |
| Unit 构造与能力 | 静态 Definition 决定能力组成，构造后配置与状态配对、组成稳定；初始 Effect 通过登记后的正常安装形成。 | [构造与装配](capability.md#初始化与装配) |
| Occupancy 与 Support | 单格 OCCUPANT／SUPPORT 两槽各自排他，占格、身体位置、空间存在与朝向分开；两端先发布同一 Pair 再通知，任一端先入场均可配对。Pair 保留建立时采样的事实；离场只解除原 Pair，不能清除替代实例的新配对或重复通知旧组合。 | [Occupancy](occupancy.md#关键协作语义) |
| Unit 组合变更 | update(battle, ref, change) 只更新一个目标。二元 compose 左到右接续同一 Unit，组合满足结合律但不交换；各项保留自己的 previous、no-op 与 Settlement 顺序。optional 在实际执行时判断当前输入，包括前序变换后的值；false 保留原对象且无后继，true 转发原 Change 的结果。全部纯应用完成后一次发布最终 next，再按序结算；Settlement 中的嵌套 update 可以改变其它 Unit，后续结算接续最新状态。 | [批量变更](api-conventions.md#51-unit-完整操作与批量变更) |
| 普通注册 Change | Capability 用扁平 Rules／Contributions／Hooks 分组明确选择自动字段；工厂不绑定 Ref，按 Key 和固定字段两种接口均保持字段、Entry 与所需能力的类型关联，由 update 的目标 Ref 满足能力要求。注册遵守按 ID 替换保序和无变化不结算，特殊字段由领域完成自身变换与后继。 | [批量变更](api-conventions.md#51-unit-完整操作与批量变更) |
| 状态接续与 Hook | 同步业务接续最新状态；有意采样的历史事实保留。一次派发不吸收后来新增的候选，执行时使用最新登记与资格，嵌套派发独立。 | [状态接续](functional-core.md#状态接续后的读取与续执行)、[同步候选](functional-core.md#7-同步候选范围) |
| 身份与结束 | 持久对象与单次执行身份不同，旧执行引用不操作后来的执行；结束立即拒收新的依赖，依赖者完整结束后宿主才注销，收尾不重复执行或覆盖首次原因。 | [Lifetime](lifetime.md)、[Action](action.md#关键语义)、[Skill](skill.md#关键语义) |
| Action | 启动受理、冷却、释放和输出保持各自含义；普通拒绝不创建执行。攻速与间隔使用静态修正列表，变更时同步按新周期保留完成比例，普通 Tick 不轮询刷新；释放前中断不伪造成功释放，已完成的输出与资源结算不回滚。 | [Action](action.md#关键语义) |
| Skill 与资源 | 持久状态与单次 Activation 状态分离；SP 门槛、实际支付、回复许可分开；TIME 延时只影响当前 Activation，Ammo 使用自身公式、额度和耗尽政策。 | [Skill](skill.md#关键语义) |
| Effect 生命周期 | 安装、生效、禁用与结束产生正确输出；安装回调完成后已到期的实例直接结束，不启用或推进，安装业务保留；禁用保留实例与私有进度，结束撤销输出；生命周期依赖与来源信息分开。 | [Effect](effect.md#关键语义) |
| Effect 竞争与时间 | 覆写组赢家及禁用政策正确；DURATION、DEADLINE、INFINITE 互斥。有效时长在 ACTIVE 自动推进并先于 onTick 发布，绝对期限不因禁用暂停；rate 为零仍执行内容程序，回调可手动推进、续期或切换时间类型，结束判断采用回调后的最新时间。暂停不积攒补发。 | [Effect](effect.md#关键语义) |
| Contribution 与阵营 | 互斥选择先于动态求值，修正采用所属领域公式；阵营不隐式决定其它能力或关系资格。 | [属性与贡献](capability.md#属性与贡献)、[Allegiance](capability.md#allegiance) |
| Targeting 与 Targetable | 标准资格、目标侧限制和范围分别组合，来源由调用方提供 Unit 值；HP／EP 候选与最终接收分开。有效限制先竞争再豁免，嘲讽读取贡献且允许负值；仇恨只作比较，入场先后使用 UID。攻击保存绑定并接续各组随机状态，显式复验不重选。 | [目标选择](targeting.md#关键语义与验收) |
| Offense 与攻击采样 | 攻击力先选有效贡献，再按 Attribute 公式求值并限制下限为零，保留小数。查询使用已取得的当前宿主；逐次输出、发射缓存与整段业务的采样时点由调用内容决定。 | [Offense](capability.md#offense) |
| 数值求值 | 动态属性接收同一 BattleState 中已取得的能力对象，贡献求值返回确定数值；对象缺失与采样时点由业务入口决定。Action 时序明确区分宿主 source 与具体 Action self，基础值取 self.definition。局部公式使用显式配置与状态，不自行回查宿主。 | [数值接口](api-conventions.md#5-数值输入查询与字段写回) |
| Blocking 资格与容量 | 双方资格、阻挡层、当前容量与体积决定取得；容量减少从后建立的关系开始裁撤，HP Applied 响应结束并确认死亡前保留旧关系。 | [Blocking](blocking.md#关键语义) |
| Blocking 关系与站位 | 批量解除先发布双端结果再通知；旧 Relation 不清掉新关系；普通关系解除与位置计划各有生命周期，主动脱离和空间覆盖完成自身清理。自身 Layer.setType 包含同值请求的角色清理，全批新身份先于通知发布；Layer 与 Blocker.setLayer 的 Settlement 清理当前关系，包括较早 Settlement 已取得的关系；释放操作在入口固定批量候选，保留自身通知中新建的关系。Blockable 主动脱离当前入向关系并取消位置计划。 | [Blocking](blocking.md#关键语义)、[Layer](capability.md#layer-与-hitbox) |
| Locomotion | 速度修正、下限和倍率与移动许可分开；转向使用历史速度、限力和限速；只吸附最终目标并保留速度，地形避障与目的格反射各自完成空间修正。 | [Locomotion](navigation.md#关键语义) |
| Route | Plan 与进入后的 current 分开，随机偏移只在进入时采样；活动 Context 决定推进与运动目标，各 Context 的 ticking 独立。相对等待与绝对等待遵守各自时基，持续 TRACE 不因到达自动消费；循环同步解释能让出，空间操作重入后读取最新进度。只有 Main 满足出口条件才完整离场，motionMode 与 Layer 分离。 | [Route](navigation.md#route-定义与进度) |
| Schedule | Spawn 时间相对前延迟结束计算，等待登记先于 enter。Fragment、Wave 与最终等待分别表达；超时只释放 wave，完整离场通过 Hook 同步释放等待。Branch 每次整组抽选并保留重入后的最新索引与 RNG，Route 捕获实际出生时的主线时间；notCountInTotal 对应 NONE，不进入等待集合。 | [Schedule](schedule.md#回归语义) |
| 部署受理与消费 | 查询和执行使用完整 Request 与一致资源事实；公开入口共用 Quote 数值契约，非法报价一致抛异常，不能预览允许而执行失败。业务拒绝不消费，通过后先消费再构造、登记、入场；预览不创建实例或发布消费。 | [Deployment](deployment.md#关键语义) |
| Card 与经济 | Card 跨场上实例存续；库存、部署间隔和逐份恢复分别结算，启动时采样预算，暂停与减时不篡改其它段。DP 自然回复与主动增减分开。 | [Deployment](deployment.md#关键语义) |
| 撤退、死亡与占格配对 | 主动撤退先结算退款和 Card，再请求离场；死亡响应确认后的死亡事实。依赖者先结束，Unit 注销、结构占格与部署额度释放先于本地内容 leave；死亡 Card 先于 Card／Request 通知结算，旧业务配对清理不影响替代实例的新关系。 | [Deployment](deployment.md#主动操作与被动死亡)、[Occupancy](occupancy.md#关键协作语义) |
| 确定性与信任边界 | 相同输入、种子和程序得到相同重要结果；合法构造之后内部信任身份、能力与私有数据配对。复杂类型边界由少量编译期代表证明，不以运行时形状校验替代。 | [总体目标](ARCHITECTURE.md#范围与行为依据)、[构造与校验](capability.md#构造校验与命名) |

## 集中归属与收敛完成条件

已审查范围按下表集中保障。综合测试只保障独立的跨领域业务结果，所属领域的公式、输入矩阵、Setter、生命周期或 Hook 协议集中在各自代表场景中。文件位于 Content／Legacy 或同时涉及尚未审查领域，不构成重复测试的保留理由。

构造期配对由 core-types 集中保障：Card 与 Mechanism 的初始化结果和自身回调保持同一私有类型，聚合输入不提供 any 上下文；Unit 的创建输入只能对应 Definition 声明的能力，且必须提供所选 initializer 要求的实例输入。Occupancy 要求非空 tile，Route 要求 plan 与 offset；普通构造、Input 类型、预置与 Runtime 转交均保留这些要求。Schedule Spawn 要求 Route，Locomotion 按 Definition 可选，并排除 Occupancy／Deployable。无必需实例输入时可省略 initial。代表场景覆盖这些构造边界，不按每种能力、回调或数组长度扩展矩阵。类型守卫在 Query 与 optional 中保留已有完整宿主，Hook 派发与登记同样保持键和载荷的配对。

| 语义 | 集中归属与最小代表 |
| --- | --- |
| Unit 构造、能力配对和生命周期程序 | Unit：合法构造与一次真实生命周期。Hook 候选细则归 Hook，依赖析构细则归 Lifetime。 |
| 组合变更与同步状态接续 | Unit Change 的一个主场景集中验证同目标 compose 的结合律与非交换、每项 previous／no-op／Settlement，以及最终 next 一次发布和嵌套后继。optional 复用已有变换，验证 false 为原对象及空后继、true 读取前序变换后的输入，不增加守卫／能力矩阵。第二 Unit 通过 Settlement 中正常的 update 改变，不作为跨 Unit 批次；各消费者只验证不同的业务后果。 |
| Hook 派发 | Hook：一次登记变化与嵌套派发，集中保障固定候选和最新登记。 |
| Runtime 组合 | 集中验证完整初始化／出生等待登记先于 enter、通过 appear／remove 直接操作预置项并在离场重入时保留最新绑定，以及 Tick 的阶段顺序／不可变发布与失败不发布。Schedule 的离场等待释放归 Schedule，Runtime 只验证调度组合结果。以公开创建、部署、资源和离场操作构造，不另写身份进度或内部存储夹具。 |
| HP／EP 接收与死亡 | 伤害／治疗回归清单。死亡确认前保留 Blocking 只归 HP-03，不在 Blocking／Combat 再做同构场景。 |
| 阻挡及位置计划 | Blocking：资格与层、容量尾部裁撤、批量通知与旧身份、独立位置计划。自身空地设置的清理（含同值）复用批量解除与位置计划代表场景，通知读取已发布的新身份；主动空间覆盖取消计划并解除旧关系，首个通知可见新位置。不按字段、角色或切换方向另建矩阵。 |
| 空间存在及其协作 | Presence 集中验证保留身份、部署与 Occupancy、Effect／Lifetime，以及全部限制先于自身批量解除通知、领域释放后取消行动、appear 只移除自身限制。Blocking 保留自身偏移与目标独立计划的区别；Action／Skill、资源接收、Burst 和 tracking 弹道只在各自主场景验证新增的业务结果，不复制 Rule 登记、Hook 或生命周期矩阵。 |
| 自主运动 | Locomotion：纯算法集中验证转向、直邻／斜邻避障及反射公式；真实移动场景验证当前速度、最终目标吸附和暂停后的历史速度。半身宽、WALK 高代价格／FLY 硬障碍、方向投影与速度比例、不可通格恢复各保留独立结果，不枚举八方向及微小数值变体。历史速度通过实际推进建立，不直接注入 Unit；Route 只保障自身指令与运动协作结果。 |
| Route 与 Schedule | 各自代表场景分别保障路线解释与调度等待，具体结果见下文回归语义。路线距离以导航几何段长和位置修正估计，不累计 APPEAR 跳跃；显式 Context 查询不随临时控制权改变。Route 不重复 Locomotion 公式；Schedule 不重复 Hook、RNG 算法或 Unit 生命周期矩阵。 |
| Occupancy 配对 | 结构双槽登记由 Battlefield 保障；双方入场顺序、通知前发布与旧 Pair 保护集中在 Deployment 的 Occupancy 协作场景，具体平台只验证自身输出。 |
| Card、部署与离场 | Deployment：Request 与资源消费、主动／被动离场账务、逐份恢复预算和 DP。在受理场景用一个非法 Quote 验证查询与执行入口一致，不按字段扩异常矩阵；部署事实、退款和额度释放通过所属领域操作完成，由时序场景验证，不单测转发或局部 setter。 |
| Action、Skill、Effect 与 Contribution | 各自主套件。共有身份、候选、输入校验和不可变版本由公共套件承担，不因更换内容宿主再测一遍。 |
| 公共容器、Query 与类型关系 | 公共套件集中验证有序不可变写入、独立可重复遍历和必要的类型推断。Blocking 的 Relation 端点保留能力类型，Elemental.available 要求已有 Elemental，实体 Command 的 Ref 证明对应实例或能力，在 core-types 集中验证。共享 Relation 身份在 Blocking 身份保护场景中验证：两端、查询与 Hook 取得同一对象，重建生成新对象，不增加字段、查询、逐方法空值、同引用或存储形状矩阵。 |
| 普通注册工厂与变更类型 | core-types 集中证明自动字段、Entry 与能力要求的关联，包含不同 Hook 载荷及联合 Key 的代表。Change 的能力参数逆变，compose 合并两侧要求为交集；optional 的守卫必须证明被包装 Change 所需能力，结果只要求 Unit。两种组合的泛型调用保留输入完整宿主类型，update 拒绝能力不足的目标 Ref，cancelForUnit 要求具有 Action 能力的 Ref。运行行为复用已有 Contribution、Hook、Unit Change 与伤害／治疗场景，不为每个 Capability、字段或生成函数新增测试。MaxHP 比例、Ammo 发动采样、Action 冷却和 Blocking 容量后继继续归各自主场景。 |
| 属性求值边界与 Offense | Contribution 的属性场景验证先选有效贡献、动态输入取得本次 Battle 和宿主，以及实际攻击力公式；core-types 集中证明能力对象和可空 SP 的类型边界。多目标间重新采样、发射时缓存及来源离场后的沿用政策归实际攻击／弹体场景，不按属性重复建立缺失矩阵。 |
| 几何与空间算法 | Coordinate 集中验证坐标转换与四向旋转；Range 用一次非默认朝向、连续原点与不连续并集验证组合。Geometry 保留圆、盒及混合圆角的独立相交／首次扫掠公式、局部偏移与必要接触边界，不按方向、尺寸或微小数值变体复制。输入校验只留真正边界的代表。Battlefield 验证位置与 Hitbox 的区别、空间资格和接触顺序，不重复精确交点或旧版本不可变性。 |
| UI 输出与具体内容 | Event 清单；内容只保留真实角色、装置或原生数据的独立结果，不自写护盾、Aura 等算法来重复证明公共结算。 |

Hitbox 的 Targeting 接入只保留一个代表场景：显式范围使用受击几何，无 Hitbox 的对象可以通过不含几何条件的选择，空地过滤读取当前 Layer 而非 Definition 初值或 Route。空间消失通过真实领域操作形成，不构造未发布的离场／零 HP 快照。按身份命中的真实锁定弹道另行保留，它有独立的命中语义；不在该场景重复 UI 条数或旧状态验证。具体 Content 不为传递几何字段或比较没有独立玩法结果的细小运动差异建立回归。

覆盖完整且收敛的条件是：已审查语义有明确的集中归属，每个独立重要结果由代表场景保障，共享协议不因消费者变化而重复展开，夹具只承担合法场景准备。测试文件数与 test() 数量不作为覆盖充分性或冗余的判断依据。

尚未完整审查的完整 Projectile／Mechanism 等独立业务按各自范围保障；它们参与的上述已审查语义使用相同的集中归属规则，不按整个文件豁免。

## Targeting 与 Targetable 的回归语义

依据 [Targeting](targeting.md#关键语义与验收)确定最小代表，不为已删除的选择协议保留用例。

| 重要结果 | 集中归属 |
| --- | --- |
| 标准 HP 资格读取当前空间存在和生命；独立几何原点使用目标 Hitbox，不要求来源就是搜索中心。当前 Layer 的额外条件由查询明确组合。 | Targeting 一个选择与几何场景，复用真实 Presence 操作。 |
| 治疗需求与比例使用有效 MaxHP；联合 HP／EP 需求采用或，Burst 不阻止其中的 HP 需求。 | Targeting 一个资源需求与比较场景。具体行医未接入的排序政策不靠夹具另写产品实现。 |
| EP 候选不执行完整接收 Rule，实际 Apply 仍可拒绝；只有 EP 能力的合法 Unit 可以参与对应选择。 | Targeting 一个候选／接收分离场景，不重复 EP 公式或 Burst 生命周期矩阵。 |
| 定义对象豁免覆盖共享定义的多个来源，但保留其它定义，即使共用 allows 函数；竞争先于豁免，不复活被压制项；固有与临时登记互不误删。 | Targetable 合并代表场景，公共注册与 Effect 竞争不逐项重测。 |
| ACTIVE 的标准 healFree 使普通 HP 治疗选择拒绝目标，禁用或结束后恢复资格；独立 EP 回复与明确目标的 Healing 接收不因该标记拒绝。 | 复用资源需求与绑定治疗场景，Effect 生命周期协议集中保障。 |
| 有效嘲讽经过贡献和整数求值，负值合法；优先级使用显式比较规则和 ID，不新增仇恨状态。 | Targetable／Targeting 一个贡献与选择场景；数值取整公式集中在公共算法。 |
| 已保存目标不会因为后来不再普通可选而自动换人；显式复验不重新竞争。各选择组接续 RNG，启动拒绝也保留已发生的选择消费。 | 攻击接入两个代表结果，复用实际 Action 操作，不重复伤害、Hook、冷却或不可变性证明。 |
| 标准资格要求来源具有 Allegiance；查询能力守卫保留原有结构并增加 Vitality／Elemental 及 Allegiance 证明；集合终端保持完整目标类型。 | core-types 的集中编译期代表，不为四个函数分别复制矩阵。 |

阻挡前缀、分组回退与并行选择由内容的普通查询程序表达。已有生产内容的独立结果应保留；尚未实现的角色机制不新增一套测试专用算法。Query 遍历、TopK 稳定性和无放回抽样只在公共套件验证。来源退出后的快照采样归具体 Projectile／Content，不为 Targeting 增设通用生命周期或快照测试矩阵。

## Route 与 Schedule 的回归语义

以 [Route 回归清单](navigation.md#回归语义)与 [Schedule 回归清单](schedule.md#回归语义)确定代表场景，集中归属如下：

- Route 保障 enter 同步进入首指令，MOVE 进入时采样且重新进入时重抽，长无环指令链完整执行、即时循环让出。activeId 与 ticking 独立，ENTER 等待可以暂停，绝对等待使用实际出生时捕获的时基。TRACE 到达后保留指令与最后目标格，支持同格重启；Main 出口独立于活动 Context，无终点不离场。同步空间操作返回后接续最新 Context，已移除或失去资格的执行停止。
- Schedule 保障前延迟之后的出生时间、出生位置与 Route offset 共用样本，以及等待登记先于 enter。WAVE 同时进入 wave／final 集合，超时只释放 wave，完整离场在 Tick 内外均同步释放等待。Branch 每次按整组权重重抽，出生前发布索引、RNG 与实例，触发 Tick 与后续推进不重复出生，重入不丢失实例。Route 捕获实际出生时的主线时基；空计划、空 Wave 与调度完成后的查询和继续 step 具有明确结果。

原生 JSON 的路线编译、count／interval 展开、随机组预处理和 Action／Enemy 的 notCountInTotal 合并归 Data，使用实际配置与最少确定输入验证转换；Core 消费编译后的 Plan 与 Spawn。notCountInTotal 在主线和 Branch 中均对应 NONE，不进入 wave／final 等待。普通注册、Hook 派发、Typed Ref 与 Change 组合集中在公共套件；Core 类型入口集中证明 Route Initial 必需与 Spawn 的能力约束。

场景通过正常初始化、enter、step 和公开领域操作建立状态，由出生登记、完整离场解除实际等待关系，不注入调度阶段、完成状态或等待游标。Core.step 在空计划或调度结束后仍正常推进；调用者自行决定何时停止，场景不需要为 Runtime 延续安排占位出生。

## Presence 的回归语义

以下结果依据 [Presence 契约](presence.md)确定；场景通过正常构造、部署、阻挡取得、启动与资源结算建立事实。`appear(position)`／`disappear()` 返回要求 Presence 的 Change，由 `unit.update(battle, ref, change)` 提交；同目标变更通过二元 compose 组合，Presence 可以在组合中的任意位置，最终 Unit 先发布，不要求它排在首位。关系与自身计划在 Presence 自身 Settlement 中由 `releaseAll`／`release` 完成，领域操作先清理再通知；消失随后调用 `Action.cancelForUnit`，由 Action 领域读取当前执行并完成取消。

| 必须保障的业务结果 | 集中归属 |
| --- | --- |
| 消失保留原 Unit、占格、部署额度及普通 Effect／Lifetime，不派发入场或离场；全部限制先发布，自身 Settlement 调用的 Blocking 操作先清理当前整组双端关系再通知，释放结束后委托 Action 领域取消宿主执行。appear 只移除 Presence 自身限制，其它来源的 Rule 仍生效，独立限制移除后可以正常启动。 | Presence 主场景；公共旧 Relation、Hook 候选和析构协议不重测。 |
| 自身 Blockable 偏移随主动空间覆盖取消；Blocker 消失只解除关系，原目标的独立偏移继续。已 present 的 appear 仍执行位置覆盖及自身清理。 | Blocking 位置计划场景。 |
| 消失禁止新的 Action／Activation，取消旧 Action 并停止旧输出；已完成释放前缀保留。开始通知中消失但仍 ACTIVE 的同次 Skill 执行 onStart，既有持续技能仍正常推进及到期。 | Action／Skill 代表场景；不据此增加弹药消费政策。 |
| 消失期间普通 HP／EP Damage 拒收；明确目标的 HP／EP Healing 仍遵守各自条件。自然 EP 回复与已启动 Burst 的恢复预算继续，消失不取消其 Effect。 | 一次双资源接收场景及 Elemental 恢复场景，不重复四条管线的公式与通知矩阵。 |
| 普通空间查询、Targeting 与 Terrain 排除消失对象；已锁定 tracking 弹道仍追现存目标的真实位置，身份命中与 Damage 接收分开。 | 空间／目标／Terrain 场景与真实弩箭追踪场景，不增加 Projectile Rule 或每个消费者的隐藏版本。 |

## Hook 与伤害／治疗的回归语义

以下结果依据 [Hook 契约](hook.md)、[输出与接收](vitality.md#1-calculate-与-apply-的语义边界)、[资源提交](vitality.md#18-接收与资源提交接口)和 [Elemental](elemental.md)确定。代表场景按独立结果组织，不按接口或阶段扩展，也不以现有测试的预期反推要求。

| 编号 | 必须保障的业务结果 | 定向场景 |
| --- | --- | --- |
| HOOK-01 | Unit 可以携带不同领域的精确 Hook，固有登记在首次 enter 前就绪；生命周期动态修改遵守固定候选、最新登记，leave 使用注销前最新程序及原 Departure。 | 公共集合／类型与一个实际 Unit 生命周期场景集中验证，不在四条管线重复候选矩阵。 |
| HP-01 | 物理、法术、真实及元素 HP 伤害采用各自公式；公式后类型与防御采样传到 Apply，初始 Request 不变。Calculate 不构成受击，也不写入本笔 HP。 | 合法基础属性与 Formula／Output 干预，核对最终数额、类型和接收前 HP。 |
| HP-02 | 从同一输入分别执行 Calculate 时，各自业务状态独立，调用方接续其中一个结果后只发生该次 Apply。弱点选高属于尚未接入的具体内容组合。 | 验证真实 Calculate／Apply 的独立分支和状态接续；不在夹具手写“选高”算法来证明产品已支持弱点。 |
| APPLY-01 | BeforeReceive 可改变准入；Receiving 的取消保留已完成业务并继续独立响应，取消后不提交。BeforeCommit 位于接收后与写入前，返回后使用最新资格及资源。 | 以真实无敌 Effect 与 Skill 的 HIT 回复接入、嵌套恢复等操作组合，核对准入先于受击回复、最终资源和固定提交报告；Hook 通用排序集中保障。 |
| APPLY-02 | 四种业务在全部 Output Hook 后形成非负 Calculated；负输出截为零，与零输出一同在 Apply 入口拒绝，计算期间已经完成的业务保留。具有 Receiving 的业务在全部接收 Hook 后形成非负 Pending，BeforeCommit、提交与 Applied 使用同一接收量；正数输出被接收为零或实际变化为零仍可成功。来源无 Vitality 仍可执行输出 Hook；同源同目标的两个 Applied 角色分别执行。 | 以最小合法 Unit 组合集中验证最终输出与接收边界；治疗使用满资源，损伤使用固定减伤超过待接收量的代表，确认实际变化为零而成功。Formula 从请求原始参数开始，不另设 EP 负数入口异常。不按非法数值、Hook 阶段或资源种类展开防御矩阵。 |
| HP-03 | HP 写入后先执行两侧 Applied，再按最新 HP 确认死亡，随后清理关系和注销。普通 Healing 不恢复零 HP；Core 不提供特殊生命干预协议。 | 真实致死场景观察两侧响应中的零 HP、仍在场及原关系，响应结束后才注销并释放；不伪造零 HP 回正或复制 Lifetime 的整套析构测试。 |
| HP-04 | MaxHP 修正的登记、替换与撤销按比例接续当前 HP，不构成普通治疗；正常资源保留小数。 | 从合法构造与真实损伤形成受损对象，再通过 Contribution Change 验证资源比例。不用伪造零 HP、回调排列或逐字段构造校验矩阵。 |
| EP-01 | EP 抗性在 Calculate 采样，Apply 使用实际元素类型和最新 EP；四型独立损伤，治疗对每型应用完整数额，HP 元素抗性与 EP 抗性分离。损伤比例、恢复资格和 UI 使用同一有效 MaxEP。 | 明确的公式转换／抗性贡献和多型损伤、恢复，核对逐型结果；在已有恢复场景改变 MaxEP 贡献，验证损伤比例与元素圈一致，不另建 Getter 或 UI 矩阵，不以伪造运行状态准备场景。 |
| EP-02 | EP 耗尽在 Commit 内同步安装标准 Burst Effect：登记引用后通知 burstStarted，在 onInstall 完成仍有效的该次爆发一次性业务，再通知 damaged，最后执行 Battle Applied；同步取消后不执行该实例的启动输出，原损失报告不被改写。 | 一个真实标准爆发与一个在创建事实中取消的代表场景；通过标准效果或正常 install／scope 验证依赖，不注入任意 Burst 启动回调模拟内容。 |
| EP-03 | Burst 使用 rate 为零的 DURATION，在 onTick 按当前恢复速度手动推进同一份 expiration.elapsed；该进度决定恢复预算与周期边界，恢复期间四型 EP 按当前有效上限逐步回填，期间拒收损伤与治疗，动态速度与暂停不积攒补算。自然完成包含预算内最后一次周期输出，取消、提前结束与离场不补未来输出；结束先清依赖，再写满 EP、清槽并通知 burstEnded。零预算仍执行安装业务后结束，不补周期输出；永久减防、剩余麻痹和独立眩晕使用各自生命周期。自然恢复保持小数且不触发普通治疗通知。 | 通过真实损伤、贡献、结束和时间推进验证暂停、恢复中间值、完成／取消及作用生命周期；零预算只用实际标准效果验证一次性输出与独立产物，公共时间边界归 Effect。不检查内部身份递增或按每型配置逐字段展开。 |

标准爆发的伤害、异常、SP 与累计周期输出由 Core 的八个具体 Effect 执行，Data 选择对应实现并提供各自的数值参数。测试保留代表性的实际标准效果结果，不在夹具中重写爆发算法，也不为八套配置建立重复的字段或回调矩阵。

公共阶段、Hook 派发和数值边界各有集中归属；四种结算只增加不同的资源或业务结果。夹具使用公开构造与领域操作，不定义平行的登记、接收或提交协议。

## Event 的回归语义

依据 [UI 瞬时输出](event.md)确定以下结果，并选择最小代表场景。其它领域的业务验收观察实际状态、返回结果与 Hook，不以诊断输出条数为依据。

| 编号 | 必须保障的结果 | 定向场景 |
| --- | --- | --- |
| EVENT-01 | HP／EP 伤害与治疗成功提交时输出本次实际变化，包括零实际变化；零计算输出的拒绝不产生成功 Event。元素损伤与元素 HP 伤害明确区分；资源变化及同步业务不依赖 Event 消费。 | 真实 Calculate／Apply 组合并交给实际表现转换器，集中验证正常及零值飘字；EP 使用满资源回复与接收归零的代表，不复制四套管线矩阵。 |
| EVENT-02 | 元素爆发保存发生位置，Unit 注销保存离场历史事实；同 Tick 移动或注销不使 UI 丢失这些瞬时表现。输出顺序遵循实际发生顺序。 | 真实 EP 耗尽触发爆发，随后通过正常领域操作改变宿主位置并离场，UI 仍能输出原位置特效和死亡表现。 |
| EVENT-03 | UI 输出不反向改变领域状态；Tick 清空旧输出，旧 State 仍可读取其输出。 | 复用正常离场与公开 appendEvents 场景，观察领域结果与各版本的输出。 |

领域业务结果使用所属操作的 Outcome／Application、State 或 Hook 观察；UI 瞬时表现集中由 Event 场景保障。Projectile／Blocking 等消费者不重复同一组输出协议。

## 不单独保留的内容

- 每个 Getter／Setter 的字段形状、空数组、同引用、对象共享和重复缺失对象检查。
- 按领域、阶段、回调复制相同的 Hook、查询或生命周期矩阵。
- 无独立业务含义的接口增减、文件导出布局、Map／Hash／缓存键等实现形式。
- 绕过构造入口伪造内部身份、进度或关系，再要求内部防御；按游戏尺度不可达的溢出与非法调度。
- 夹具自写 Aura、Buff 应用或其它未接入的产品程序，再测试夹具自身的算法。

测试场景从上述结果与真实机制推导。夹具只准备这些场景需要的合法事实，不提供平行的能力装配、状态注入或领域结算协议。回归问题若属于已有语义，应修正或扩充其代表场景；只有独立的重要结果才需要新场景。

生命周期的关键转换由各自领域场景保障，不单独验证字段命名。实体命令使用从实际实例取得的 Ref；停止已消失对象可复用对象存续时取得的引用，不用任意 ID 或预测未来实体身份构造场景。
