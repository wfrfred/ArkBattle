# 全量研究未决项与 Core 架构缺口

基线 `10256fe`，审计日期 2026-11-22。范围覆盖 `docs/research` 的 7 篇总览、39 篇编号案例和 102 个证据批次。复核案例正文、证据索引及批次中额外记录的具体疑问，并用现行领域契约及公共操作核对 Core 表达能力。 [研究入口](../research/00-INDEX.md) · [案例索引](../research/cases/00-INDEX.md) · [证据索引](../research/evidence/README.md)

初次盘点记录 181 个具体未决问题，170 个涉及当前项目，其中 59 个进入 Core 候选调查。下面保留该次盘点的分类、数量和编号。当前各领域的待查证和待接入事项见 [Core 剩余缺口](research-necessity-20261122.md)。

每条未决按可独立查证的问题计，同一问题在案例、总览和批次重复出现时只记一次。数字适用于本版归档中能落到具体机制的问题。原生结论足够且只剩内容接入的项、全游戏覆盖率和全量热更等通用证据限制不计入。模式对照、显示和逐帧验证中的具体问题列在本页末尾，仍纳入全库数量。 [项目范围](ARCHITECTURE.md#范围与行为依据) · [当前支持边界](tactical-semantics.md)

| 原生未决分类 | 数量 | 判定依据 |
| --- | ---: | --- |
| 可能影响 Core 契约 | 59 | 存在一个能改变共享状态、顺序、资格或操作边界的具体疑问，现有证据仍缺实际调用例、必要交叉条件或效果。 |
| 已有表达或具体内容 | 84 | 现有 Core 操作能承载已知区别。调查继续落实实际调用者、配置、资格、采样或结束条件。 |
| Data | 15 | 实际配置、来源、取值和解析仍待核实。 |
| 项目已有明确选择 | 11 | 保留有明确问题的原生差异和验证边界。 |
| Meta | 1 | 战斗外阶段与结果输入。 |
| 模式对照、显示、逐帧或外层 | 11 | 单列其调查边界及实际来源。 |

## 初次盘点的实现差异

下表保留初次盘点记录。当前仍需接入的 Core 能力见 [Core 剩余缺口](research-necessity-20261122.md)。

| 编号 | 缺口 | 实际机制 | 现有 Core 边界 | 依据 |
| --- | --- | --- | --- | --- |
| G02 | 全局效果同步覆盖后来出生者 | 普通 GlobalBuff 在登记时施加到符合资格的新单位。后兽的实际 GlobalAura 同时安装到现有和后来出生的目标。 | Unit.add 只派发本地 entered。Mechanism 定时扫描无法让嵌套创建或入场后的业务同步看到本次安装。 | [原生依据](../research/03-space-units-and-mechanisms.md#L285) · [Core](../../src/core/unit/operations.ts#L14) · [后兽实例](../research/cases/31-route-operations-and-state.md#L127) |
| G04 | 阻挡目标的运动层资格 | 酒神的迷狂牢笼在实际阻挡分支使用目标运动层豁免。 | 阻挡资格硬编码两侧层相等，Content 的限制只能进一步缩小集合。阻挡者的地块判断还需要自己的阻挡层。 | [原生依据](../research/evidence/resource-mechanisms-20261114/life/content.json#L136150) · [Core](../../src/core/battle/blocking/operations.ts#L51) · [原生资格检查](../research/evidence/blocking-native-20261023/modes/report.txt#L11) |
| G05 | 战中修改 DP 上限 | 诺伯特平民确认身份后进入保护区会增加我方费用上限。 | Core 提供动态下限。自然回复、余额修改及边界截断读取静态 Definition.maxDp。 | [原生依据](../research/cases/20-norport-civilian-allegiance-and-blocking.md#L22) · [Core](../../src/core/battle/deployment/dp/operations.ts#L5) |
| G06 | 本次部署参与初始化的 Card 效果 | 松桐 S2 的 DeckBuff 在读取本次出生 HP 前参与 MaxHP 计算。 | 部署入口以固定蓝图完成 Unit.initialize，卡牌只能注入 entered／removed Hook。进入注册后修改属性无法让之前的构造过程和固定入场快照看到该值。 | [原生依据](../research/cases/24-deployment-cost-and-supply.md#L268) · [Core](../../src/core/battle/deployment/operations.ts#L87) |
| G07 | 同一 Card 的特殊部署 | 卫戍初始布阵保留卡牌身份，免初始费用，预放召唤物免库存，并跳过部分普通部署效果。 | 走 deploy 可以留 Card 的关联历史，但固定派发普通部署通知。直接 Unit 初始化即使设置 Deployable.card，也不能用公开操作登记供 cardForUnit 读取的同一卡来源历史。 | [原生依据](../research/cases/24-deployment-cost-and-supply.md#L208) · [Core](../../src/core/battle/deployment/operations.ts#L86) · [Card 反查](../../src/core/battle/deployment/query.ts#L25) |
| G08 | 路线到达、退出资格与退出事实 | 普通终点结算用 REACH_EXIT。喀兰圣女等实际 Prefab 禁止退出但仍有路线，主线 6-15 另有不扣蓝门生命但计击杀的配置。 | 到达终点直接移除，内部结束原因通用 SCRIPT，只有表现事件区分出口。改成最后一道 MOVE 会丢失真实终点及剩余路程。 | [原生依据](../research/cases/13-route-and-movement-timing.md#L153) · [Core](../../src/core/unit/capability/route/operations.ts#L378) · [禁止退出配置](../research/evidence/route-operations-20261107/temporary/content.json#L2819) · [退出与击杀](../research/cases/30-scheduler-action-data-fields.md#L155) |
| G09 | 推进分支与执行分支分开 | 活动关卡实际出生的思旧通过 ModifyRuntimeRouteUseBranchRoute 取路线，消耗下一 Phase，取路线失败也保留已推进索引。 | 公开 triggerBranch 在推进索引后立即启动当前 Phase。Content 要保留同一游标并用于真正触发时，缺少可单独消费 Phase 的操作。 | [原生依据](../research/cases/31-route-operations-and-state.md#L105) · [Core](../../src/core/battle/schedule/runtime.ts#L228) |

首次复核确认主动返还 DP 在请求结束前，普通撤退与死亡的卡牌回收都在原生 `OnFinish`，对象注销在 `OnRecycle`。后续取证已定位全局部署额度与同卡在场名额各自的释放时点和部署资格消费者，也复核了本次审计当时留下的中继器回收、动态召唤等待线索。 [部署额度](../research/evidence/deployment-exit-limits-20261122/README.md) · [中继器回收](../research/evidence/repeater-recovery-20261122/README.md) · [动态召唤等待](../research/evidence/managed-summons-20261122/README.md)

标准沉默当前只限制 Skill 发动，已证实的天赋暂停与恢复仍需接入。现有 Effect 身份、启停和作用域能组织这一行为，已证需求暂无额外的 Effect 或 Lifetime 契约。纯烬艾雅法拉 S2 需要先消耗屏障再做 EP 准入，当前 `beforeReceive` 可以同时改本次值和盾池。 [沉默证据](../research/cases/06-talent-lifecycle-and-model.md#L34) · [EP 屏障](../research/cases/38-damage-classification-and-permissions.md#L287) · [EP Apply](../../src/core/battle/resource/ep/damage/apply.ts#L41)

## 已有项目方案与暂缓项

| 原审计编号 | 现行结论 |
| --- | --- |
| G01 | 同实例复活采用 1 HP、复活等待 Effect 和 increaseHp。恰在路线终点时的探针差异已接受。G08 仍覆盖有真实独立需求的路线退出资格与退出结算。 [Vitality](vitality.md#特殊-hp-application-的支持边界) |
| G03 | 郁金香 S1 空施放的狂躁计数是已知且明确暂缓的内容例外。普通双监听按已定契约运行。 [Elemental](elemental.md#支持边界) |
| G10 | 琳琅诗怀雅的金币可以由 Content 私有状态保存，技能可通过本次发动参数决定是否收取 SP。已查案例不足以确认普通 SP 配置需要运行期提交。 [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L115) · [Skill](skill.md#6-覆盖边界) |
| G11 | 若玛露西尔的魔力由 Content 私有状态承载，普通 SP 操作自然与魔力隔离。共享 SP 封闭仍取决于资源表示和真正需要它的普通 SP 消费者。 [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L317) |

## 逐项未决清单

### 初次盘点的 Core 候选（59）

| 编号 | 待核实问题 | 来源 |
| --- | --- | --- |
| U001 | 异宿主派生子项在父收尾时可已失效、仍未完成。具体支持内容是否读取这段先后。Core Lifetime 采用依赖完整收尾后再父 Finalize | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L165) |
| U002 | 普通支持范围内 EXTEND 是否重新采样并重载既有输出，以及动态 RefreshPriority 的实际使用。已绑定 EXTEND+快照配置来自排除的生息演算。单独保留支持范围内的正例问题 | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L275) |
| U003 | ReassignTalents 的真实调用者和旧天赋分离／重装时是否保持身份／计数。未见必须改 Unit Definition／能力组成的实证 | [Case 06](../research/cases/06-talent-lifecycle-and-model.md#L60) |
| U004 | 同一 Ability 重挂并改变周期，因保留已过时间影响下轮资格的实际配置。已有操作只按比例刷新或清空／重置。实际需要保持已过时间的现有技能持续已由 extendTime 表达 | [Case 07](../research/cases/07-action-timing-and-animation.md#L138) |
| U005 | 直接写当前 HP 的 TakeDamageMoveBackEnemy 等方法是否实际绑定支持玩法（同 Cases 37–39） | [Case 11](../research/cases/11-damage-apply-and-hp-application.md#L265) |
| U006 | 实际跨格偏移场景是否因使用原路点格或量化后的最终世界坐标而产生不同寻路结果 | [Case 12](../research/cases/12-navigation-native-algorithm.md#L339) |
| U007 | 启用 alwaysCheckCurrentPoint 的实际敌人是否主动重建 Main Cursor，从而改变不可达路点政策 | [Case 13](../research/cases/13-route-and-movement-timing.md#L143) |
| U008 | 是否有支持范围内的首 APPEAR 或 DISAPPEAR 正例需要普通 Unit 登记前的同步标志或回调 | [Case 13](../research/cases/13-route-and-movement-timing.md#L272) |
| U009 | 是否有实际内容使用 MOVE 的非零 reachDistance，并因此要求逐路点设置到达半径 | [Case 13](../research/cases/13-route-and-movement-timing.md#L318) |
| U010 | 是否存在会实际切换为不允许对角平滑的路线 | [Case 14](../research/cases/14-route-definition-fields.md#L38) |
| U011 | 是否存在实际要求每个经过格的中心都必须访问的路线 | [Case 14](../research/cases/14-route-definition-fields.md#L39) |
| U012 | 是否存在实际要求访问每个寻路后继节点中心的路线 | [Case 14](../research/cases/14-route-definition-fields.md#L40) |
| U013 | 原始路线 motionMode 为 E_NUM 时，是否允许实际执行以及如何决议运动方式 | [Case 14](../research/cases/14-route-definition-fields.md#L43) |
| U014 | 原生足部定位点和 Core 身体坐标的差异是否会在实际内容中导致不同的导航或避障决策 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L148) |
| U015 | 支持范围内是否有实际内容启用 SeparateMoveController 的邻居分离力 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L194) |
| U016 | 支持玩法中是否有实际推拉接触需要检测非地图实体的动态碰撞体 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L224) |
| U017 | 是否存在施力者已经失效却仍能创建普通持续牵引的实际内容 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L251) |
| U018 | 排除阵地足球后，是否存在地形或内容需要组合多个同时有效的加法摩擦修正 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L287) |
| U019 | 支持玩法的实际内容是否分别绑定刚体运动状态查询和自主运动状态查询，并产生不同结果 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L335) |
| U020 | 弹道反射或实际施法来源替换时，来源、属性采样与归属如何变化 | [Case 18](../research/cases/18-projectile-source-and-target-lifecycles.md#L200) |
| U021 | 支持范围内是否有实际 GiantTrap 配置，需要一个阻挡者从多个位置搜索目标 | [Case 21](../research/cases/21-tippi-air-blocking.md#L92) |
| U022 | 是否有实际内容修改 BLOCK_RADIUS_SCALE 并改变飞行阻挡半径 | [Case 21](../research/cases/21-tippi-air-blocking.md#L94) |
| U023 | 具体 CardBuff／符文来源进入费用汇总的资格、竞争和各段取整顺序 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L42) |
| U024 | MAX_COST_CEIL 的配置来源及与 MAX_COST 的动态同步条件 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L53) |
| U025 | 普通 QUEUED 归队实际哪些状态、调用实参和顺序会重置现行恢复时钟 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L113) |
| U026 | 银灰 X 模组临时再部署修正解除后是否回滚已运行冷却 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L145) |
| U027 | 再部署属性修正、一次缩短、多来源及半值取整顺序 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L155) |
| U028 | 特殊移动的 HP／技能继承、失败后继、返费、库存、计时与通知，含凯尔希·思衡托待投放解除 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L181) |
| U029 | 实际动态改变召唤物持有上限时的裁剪和恢复规则 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L195) |
| U030 | 梅尔／麦哲伦／令的批量或条件回收怎样接续库存、冷却、通知与溢出 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L199) |
| U031 | 夜莺、麦哲伦、多萝西、白铁等宿主离场时未用附属 Card 如何保留同一身份、库存和冷却。淬羽赫默技能窗口结束同类问题 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L202) |
| U032 | 卫戍自动再部署失败组合及特殊限制下的恢复接续 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L221) |
| U033 | 卫戍同一宿主堆叠召唤物究竟按并行时钟还是串行恢复 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L226) |
| U034 | 再部署暂停与显式减时、清零、临时豁免能否在支持范围内组成实际链 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L240) |
| U035 | 本次附加、一般初始化、基础 SP 与具体出生程序实际发生冲突时的可观察顺序（含 Case 01） | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L289) |
| U036 | 岁相资源到 EnemyGiantBoss 的实际绑定，以及大体型出生、朝向和地格清理的单体确证 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L295) |
| U037 | 预置对象结束时原 Card 返费、回收及身份关联规则 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L439) |
| U038 | 普通离场何时退还本次部署额度 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#普通撤退与死亡的结算顺序) |
| U039 | 同卡在场上限何时放行，是否从 ENDING 或注销分界独立 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#普通撤退与死亡的结算顺序) |
| U040 | 源石封印是否也限制卫戍自动入口。此处调查具体共享资格，与其他失败接续分开 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L449) |
| U041 | BeforeStart 起步窗口是否有真实可达的第二轮并行爆发，现仅有静态重入窗口 | [Case 25](../research/cases/25-elemental-burst-recovery-timing.md#L200) |
| U042 | 妮芙的 EP 后继和其他伤后观察者相对顺序是否改变可达结果 | [Case 27](../research/cases/27-attack-additions-and-damage-events.md#L156) |
| U043 | 零伤害、无敌、完全吸收下伤后观察者的资格，含奥术法阵各段跳跃与妮芙附加 EP | [Case 28](../research/cases/28-damage-hooks-and-event-granularity.md#L48) |
| U044 | 是否存在独立抵挡通知或区分两种 BLOCKED 的实际后继（含 Case 38） | [Case 28](../research/cases/28-damage-hooks-and-event-granularity.md#L48) |
| U045 | 实际内容中目标前置（含原因 5 提前中断）与来源输出换位是否会改变结果 | [Case 28](../research/cases/28-damage-hooks-and-event-granularity.md#L52) |
| U046 | 联合分担或均摊治疗能否绑定到支持范围内的实际玩法 | [Case 29](../research/cases/29-hp-and-ep-healing-settlement.md#9-剩余证据边界) |
| U047 | useRecycleToFinishScheduler 等运行动态配置的当前有效取值和实际等待差异 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L136) |
| U048 | 外部召唤或动态 Branch 生成是否实际需要登记到当前波次等待。卫戍 dragon 的触发条件纳入这一链 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L182) |
| U049 | acfnc 等保留原巡逻再插点的可达链和真实巡逻回边 | [Case 31](../research/cases/31-route-operations-and-state.md#L139) |
| U050 | 莱塔尼亚召唤物能否同时具有入向与出向阻挡关系（含 Case 23） | [Case 32](../research/cases/32-leithanien-summons-blocking-and-movement.md#L32) |
| U051 | Trace 短距预测在消失、隐藏等目标资格变化时的接续与到达后继 | [Case 32](../research/cases/32-leithanien-summons-blocking-and-movement.md#L83) |
| U052 | MultiSpine 延后发布有效朝向是否影响一项实际玩法 | [Case 35](../research/cases/35-facing-and-turning-conditions.md#L75) |
| U053 | 异常解除是否主动重发此前无法发布的面向 | [Case 35](../research/cases/35-facing-and-turning-conditions.md#L82) |
| U054 | 煌的锁血数值拒写与后续伤判联用时，是否有实际观察者需要看到较早锁定的值 | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L121) |
| U055 | DAMAGE_WITHOUT_MODIFY 越过低血量缩放的实际可达消费者（同 Case 10 flag4） | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L185) |
| U056 | EP 取消是否存在按具体原因分支的消费内容 | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L249) |
| U057 | 蒂比 S2 成功闪避后普通伤判和天赋时钟的线上行为 | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L298) |
| U058 | 非默认 SP 恢复类型切换的实际使用及计时续接 | [证据批次](../research/evidence/skill-audit-20261117/sp/result.md#L26) |
| U059 | 埃芒加德共享复活额度的实际扣减、取消及例外资格 | [总览03](../research/03-space-units-and-mechanisms.md#L295) |

### 已有表达或具体内容（84）

| 编号 | 待核实问题 | 来源 |
| --- | --- | --- |
| U060 | UNIQUE 拒绝前原生已运行开始动作。调查支持内容是否真的在失败前产生必须保留的副作用。候选残影未证明此行为 | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L105) |
| U061 | OnDisable 重入安装、特殊／循环派生的真实内容。普通关系和无环依赖已经有定义 | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L127) |
| U062 | 特化安装免疫、反制和父暂停／来源退出后的独立输出规则。普通免疫与整组反制另见 Case 19，父子 Effect、Scope 及 setEnabled 已支持组合 | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L216) |
| U063 | 具体 Aura 成员进入／退出、刷新快照和多个鼓舞的样本替换／交错。已有 Effect、查询、私有登记与子 Scope | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L216) |
| U064 | 维什戴尔 A／B／C 随机组的真实尝试频率、失败后继和重置冷却。Core 具备选招、同步成败及 Content 程序 | [Case 02](../research/cases/02-action-and-projectile-phases.md#L81) |
| U065 | 实际在途弹道的黑板倍率哪些发射时采样、哪些在不同目标命中时更新。State／实时查询可按路径选择 | [Case 02](../research/cases/02-action-and-projectile-phases.md#L108) |
| U066 | 前摇／飞行中目标资格失效后的落点、范围接收者、锁定后是否复验阵营。与 Cases 16–18、33 对照，普通位置／来源／停止链后续已补 | [Case 02](../research/cases/02-action-and-projectile-phases.md#L154) |
| U067 | 具体死亡反应中的重新回复／生成及外层后继持有已结束目标时的资格。Cases 11、18、39 已关闭普通死亡和失效查询的通用部分。同步接续可表达消费规则 | [Case 03](../research/cases/03-dispatch-and-nested-settlement.md#L178) |
| U068 | 一个实际技能开始通知令宿主消失时，施放中断、持续结束及后继钩子的组合。普通 native 分支已核实。Action cancel、Activation 结束与 Presence 分立 | [Case 05](../research/cases/05-skill-start-and-finish.md#L45) |
| U069 | 具体模式切换、假死及撤退重部署时，天赋计数和目标身份的持久范围。Card、持久 Skill、Effect 各有存储，假死期间保留同一 Unit Ref | [Case 06](../research/cases/06-talent-lifecycle-and-model.md#L59) |
| U070 | 切换 UnitMode 清普通攻击间隔的 native 具体调用者。项目 clearCooldown 已能表达 | [Case 07](../research/cases/07-action-timing-and-animation.md#L260) |
| U071 | Animator 特殊等待语义在中断后是否留下实际可观察的后继（普通动画帧换算已闭合） | [Case 07](../research/cases/07-action-timing-and-animation.md#L307) |
| U072 | 敌人独立技能计时因模式暂停的实际 native 调用者。持久 Skill／各 Action 内容可管理独立计时 | [Case 08](../research/cases/08-action-eligibility-and-interruption.md#L81) |
| U073 | EnemySkill 的 recoverSpWhenAffecting 属性实际消费，以及普通 BasicSkill _allowSpRecoveryWhenAffecting 的非默认实际使用（Case 09:25）。已有按来源恢复限制 | [Case 08](../research/cases/08-action-eligibility-and-interruption.md#L119) |
| U074 | 敌人先成功支付 SP、后续 Ability 启动失败时，实际调用者是否额外返还。成败结果已查，费用和启动可以显式分开 | [Case 08](../research/cases/08-action-eligibility-and-interruption.md#L135) |
| U075 | Touch 失败后直接执行后继的现行 Prefab 绑定，以及 TriggerAbility._useCastResult 的具体启用调用。通用真假后继完整可表达 | [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L272) |
| U076 | Fever／OxiFireRainSlotBehaviour 失败清理的实际启用，以及失败前是否已进入完成/持续。普通 Fever 免费启动／延时已在后文闭合 | [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L275) |
| U077 | 断罪者强力击具体扣费时点，以及丢目标／中断是否返还。冬时索敌失败有个例。正例可由 Skill 支付／回复及 Action 程序表达 | [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L289) |
| U078 | 攻击回 SP 与失效弹道、多段／多目标／剑豪的实际触发次数。当前先按成功释放给 ACTION 回复，仍可用恢复规则和显式输出程序选择不同策略 | [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L290) |
| U079 | 特定持续／延迟技能在来源退场后保留或结束（含蕾缪安）。可按实际政策给产物绑定或解除依赖 | [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L293) |
| U080 | 尚未归档的弹药消费、耗尽和退场分支，含 Case 05:21。灰烬已核实，无需猜统一开火消费时点。已有分离的 consume／check 和 Action 输出程序 | [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L345) |
| U081 | 星熊异格负生命债务在 MaxHP 变化时的实机数值组合 | [Case 11](../research/cases/11-damage-apply-and-hp-application.md#L26) |
| U082 | 具体替身开始／结束选中哪个 Ability、重复施放的拒绝及 HP 恢复的事件时点。主要保留／清理规则已查，可由 Effect 与 Action 管理 | [Case 11](../research/cases/11-damage-apply-and-hp-application.md#L68) |
| U083 | 伺夜狼群的早取消致命 Modifier 及每层生命消费与 RallyPoint 恢复的完整内容路径。豆苗正例闭合，狼群不可照搬 | [Case 11](../research/cases/11-damage-apply-and-hp-application.md#L157) |
| U084 | 阿周期自损时来源 Formula 的实际生效窗口，固定档案未证明 1% 自损会成为 1.5%。普通 LOSS 项目政策已定 | [Case 11](../research/cases/11-damage-apply-and-hp-application.md#L252) |
| U085 | 特殊召唤节点实际启用哪些配置字段，以及如何经 Prefab 和协程传到生成入口 | [Case 14](../research/cases/14-route-definition-fields.md#L143) |
| U086 | 具体内容何时以 GroundBound、不可移动或浮空状态控制自主运动，以及这些状态如何叠加 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L172) |
| U087 | 锏 S3 等特殊技能如何绑定其实际牵引资产与施力入口 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L259) |
| U088 | 具体 Rune 如何注册并应用 char_attribute_add 基础力度加成 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L271) |
| U089 | 四个含 base_force_level 的天赋黑板条目分别由什么实际节点消费 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L277) |
| U090 | 实际穿透和重复输出弹道如何配置命中预算、命中历史和命中间隔 | [Case 16](../research/cases/16-projectile-motion-and-hit-boundaries.md#L123) |
| U091 | 弹道减速时，到达后等待和周期触发分别消费什么时钟 | [Case 17](../research/cases/17-projectile-stop-and-termination.md#L53) |
| U092 | 外部提前停止时，原生是否必然取消到达后的旧延迟回调，以及复用前如何清理 | [Case 17](../research/cases/17-projectile-stop-and-termination.md#L165) |
| U093 | 干员、召唤物和装置哪些实际内容会切换空间消失状态 | [Case 18](../research/cases/18-projectile-source-and-target-lifecycles.md#L101) |
| U094 | 诺伯特平民的鉴定进度倒退、无敌、禁挡与到达奖励使用什么具体调用链 | [Case 20](../research/cases/20-norport-civilian-allegiance-and-blocking.md#L50) |
| U095 | 风絮的实际起飞 Buff 如何分别修改自身 Layer、阻挡层和避伤条件 | [Case 21](../research/cases/21-tippi-air-blocking.md#L84) |
| U096 | 未许之地的浮空区块如何绑定动态地块并更新驻足单位的阻挡模式 | [Case 21](../research/cases/21-tippi-air-blocking.md#L84) |
| U097 | 具体传送及位移入口依什么条件取消或覆盖已有阻挡站位 | [Case 22](../research/cases/22-block-positioning-and-interruption.md#L75) |
| U098 | 是否有实际内容在阻挡解除通知中同步重新取得阻挡关系 | [Case 22](../research/cases/22-block-positioning-and-interruption.md#L75) |
| U099 | 凛御银灰比较器的安装、离场恢复与多来源移除之间的接续约定 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L123) |
| U100 | 松桐 S1 已选择目标的减费实际消耗和期限 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L124) |
| U101 | 新约能天使 S3 投递最长再部署比较量、并列规则及页范围 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L127) |
| U102 | 松桐永久攻击增益跨重复进场是否叠加、后来加入是否追授 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L140) |
| U103 | 松桐等策士选择是否纳入隐藏、冷却、封印、零库存对象 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L141) |
| U104 | 凛御银灰 S1 屏障或减费在本次部署前的消耗期限 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L142) |
| U105 | 凛御银灰 S2 已登记延迟攻击在提前退出后的取消和层数变化 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L143) |
| U106 | 玛露西尔场下魔力自然回复暂停的准确限制集合 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L157) |
| U107 | 枯朽吞噬者逃逸等非死亡离场是否也解除锁定 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L166) |
| U108 | 拟态机械只封印点选但仍可部署时，实际可绕过点选的部署路径 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L169) |
| U109 | 夜莺幻影、赫默探机已经在场不随宿主删除时，来源缺席仍可用的未部署卡资格 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L203) |
| U110 | 同名角色独立 cardUid 已证。两棋同时倒地，独立计时的具体推进和复起路径 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L224) |
| U111 | 重复激活预置遇到占位冲突或同别名已有对象时如何处理 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L439) |
| U112 | 预置隐藏原因及其对显示、点选、部署的影响 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L439) |
| U113 | 贾维等实际再部署减免的采样资格和业务时点 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L444) |
| U114 | 多个锁定、封印的独立来源竞争和解除条件，含是否需要共享的来源优先政策 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L445) |
| U115 | 琴柳所有待部署干员共享下一次优惠的激活时点，正文与备注冲突 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L448) |
| U116 | 当前正式五型全局配置是否有零秒标准恢复的实际正例。零预算静态路径已查清 | [Case 25](../research/cases/25-elemental-burst-recovery-timing.md#L164) |
| U117 | ElementHealViaMaxHpRatio 节点的实际非默认启用对象，已证与自然 EP 回复不同 | [Case 25](../research/cases/25-elemental-burst-recovery-timing.md#L210) |
| U118 | 刺玫登场 CastDirectly 是否会发标准 SpellOn。已确认 TALENT 分类不入狂躁 | [Case 25](../research/cases/25-elemental-burst-recovery-timing.md#L270) |
| U119 | 来源离场后妮芙 S1 各段附加程序的保留范围 | [Case 27](../research/cases/27-attack-additions-and-damage-events.md#L191) |
| U120 | 行医在发射后目标条件改变时各段 HP／EP 的资格 | [Case 29](../research/cases/29-hp-and-ep-healing-settlement.md#L92) |
| U121 | 其他 Wave 标签特别是 boss_wave 的真实消费者，及其是否影响通用出怪 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L31) |
| U122 | Transport 及后兽、钓鱼等未闭合路线操作候选的支持玩法入口 | [Case 31](../research/cases/31-route-operations-and-state.md#L156) |
| U123 | timing3 真实启用配置 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L324) |
| U124 | ignoreMotionMode 的实际非默认启用对象 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L326) |
| U125 | ignoreHitRange 的实际非默认启用对象 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L326) |
| U126 | 典型睡眠例以外其他异常排除选项的实际非默认对象 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L326) |
| U127 | 最终嘲讽排序选项的实际非默认启用对象 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L326) |
| U128 | keepTarget 的实际启用与刷新时点 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L326) |
| U129 | 搜索间隔覆盖的实际启用配置与宿主 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L326) |
| U130 | 阻挡建立是否触发相对于攻击启动独立的转向请求 | [Case 35](../research/cases/35-facing-and-turning-conditions.md#L81) |
| U131 | 圆仔倒走的四向、停走、计时及实际 Prefab 特殊转向链 | [Case 35](../research/cases/35-facing-and-turning-conditions.md#L94) |
| U132 | 固定弱点标记的实际生产者及其输出消费（同 Case 10） | [Case 37](../research/cases/37-resource-mechanism-coverage.md#L96) |
| U133 | INSTANT_KILL_LIKE_DAMAGE 标记是否有另一个实际过滤后继 | [Case 37](../research/cases/37-resource-mechanism-coverage.md#L98) |
| U134 | 是否确有普通内容产生 MINUS_HEALTH 取消原因 | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L244) |
| U135 | 损伤中断和环境免疫的几个候选在支持玩法中的真实出场 | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L300) |
| U136 | 通用移速范围 GlobalBuff 的实际激活入口 | [Case 39](../research/cases/39-death-attribution-and-attribute-ranges.md#L193) |
| U137 | 娜斯提 S2 装置 init_max_hp／init_hp 的实际生产链 | [Case 39](../research/cases/39-death-attribution-and-attribute-ranges.md#L193) |
| U138 | 卫戍运行时热量、环境与领袖波次实际执行链中的调用者归属，合并 Case 30 的各模式来源 | [总览01](../research/01-scope-and-battle-flow.md#L141) |
| U139 | 卫戍样本的隐藏炮台实际启用条件 | [总览01](../research/01-scope-and-battle-flow.md#L144) |
| U140 | 卫戍寒风控制器选择空技能后由何种配置或程序激活 | [总览01](../research/01-scope-and-battle-flow.md#L152) |
| U141 | 普通部署时哪些内容实际同步触发即时接敌，何时仍等待周期搜索 | [总览03](../research/03-space-units-and-mechanisms.md#L205) |
| U142 | 卡莱莎叠攻的触发与新生单位、已有受益效果之间的接续 | [总览03](../research/03-space-units-and-mechanisms.md#L296) |
| U143 | 桑葚开场选最右的选择时点、资格与盾程序 | [总览03](../research/03-space-units-and-mechanisms.md#L297) |

### Data（15）

| 编号 | 待核实问题 | 来源 |
| --- | --- | --- |
| U144 | 某种天命 ymgpck 的 hit_count_duration 的最终值与有限 STACK 标记是否实际逐层衰减。Core 已支持 DECAY | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L402) |
| U145 | palsy[stack] 的 loadFromDB 是否给出实际有限到期配置 | [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L407) |
| U146 | 迷迭香隐藏天赋、召唤物模组部分及 OVERWRITE_BATTLE_DATA 的实际查表生效路径。黍的字符串 DATA_ONLY 正例已闭合 | [Case 06](../research/cases/06-talent-lifecycle-and-model.md#L105) |
| U147 | 能天使 S3 主模式 hit_interval 是否与本机资源同版，下一段等待怎样采样。现有多段 Action 私有程序可表达。默认路径已核实 | [Case 07](../research/cases/07-action-timing-and-animation.md#L312) |
| U148 | 预置 TokenCard 的初始库存创建与注入细节 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L439) |
| U149 | Pack 和交错组的具体来源绑定及使组合生效的真实条件。静态组合已有带权完整序列表达，Data 未转换 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L52) |
| U150 | forceBlockWaveInBranch=true 的真实非默认输入，等待行为已有表达 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L167) |
| U151 | ActionData.notCountInTotal=true 的真实非默认来源。EnemyData 正例已证，等待行为已有表达 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L168) |
| U152 | 隐藏组实际何时启用和筛选，与静态出现配置区分 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L182) |
| U153 | 非空键 EMPTY 项经实际转换如何不进入无执行器的普通队列 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L184) |
| U154 | 一个小节／一个乐部的最终 EnemyDB 数值及关卡覆盖 | [Case 32](../research/cases/32-leithanien-summons-blocking-and-movement.md#L93) |
| U155 | 号角等 Selector hook-key 最终覆盖值来源 | [Case 33](../research/cases/33-targeting-and-targetable-pipeline.md#L325) |
| U156 | 额外 GroupTag 的非默认 Rune 实际启用配置和作用范围 | [Case 36](../research/cases/36-unit-classification-and-combat-tags.md#L142) |
| U157 | 不同等级是否改变战斗分类或出现真正多项 enemyTags 的实际敌人 | [证据批次](../research/evidence/unit-classification-20261114/config/findings.md#L76) |
| U158 | char_attribute_mul 的 runeKey 注册、消费与乘区 | [总览05](../research/05-evidence-and-open-questions.md#L84) |

### 项目已有明确选择（11）

| 编号 | 待核实问题 | 来源 |
| --- | --- | --- |
| U159 | 更早 Deck／Tween 产生的弹道能否同逻辑步推进。项目已接受固定相位。仅具体有意义结果受影响时重查 | [Case 02](../research/cases/02-action-and-projectile-phases.md#L166) |
| U160 | 中断与释放同逻辑步的具体内容优先级、Case 07 动画／协程相位。微时序固定策略已确认，仍需核对明确改变重要结果的代表例 | [Case 02](../research/cases/02-action-and-projectile-phases.md#L213) |
| U161 | 当前原生普通弱点试算省略 atkAddition、社区描述纳入的差异。项目已明确两次完整 Calculate。不以推测 hotfix 覆盖固定版本 | [Case 10](../research/cases/10-weak-damage-and-critical.md#L50) |
| U162 | 卫戍自动再部署精确逐帧调度 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L221) |
| U163 | 凛御银灰 S2 原生 1.1／0.5 秒的完整逐 Tick 调度 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L282) |
| U164 | 客户端 FP 舍入、固定帧率及持续输出次数逐 Tick 完全一致 | [Case 25](../research/cases/25-elemental-burst-recovery-timing.md#L165) |
| U165 | 可同时命中的普通暴击和弱点程序的相对顺序及实际受影响结果 | [Case 28](../research/cases/28-damage-hooks-and-event-granularity.md#L48) |
| U166 | 缇缇满血后重复空 setter 通知是否产生额外结果 | [Case 29](../research/cases/29-hp-and-ep-healing-settlement.md#9-剩余证据边界) |
| U167 | 当前 EnemyData 与 level 0 上的攻击方式差异，能改变结果的同一敌人实际正例。项目明确以 Action Definition 推导 | [Case 36](../research/cases/36-unit-classification-and-combat-tags.md#L143) |
| U168 | 忽略闪避和忽略取消原因对有效线上随机消费的差异 | [Case 38](../research/cases/38-damage-classification-and-permissions.md#L186) |
| U169 | Scheduler 等待恢复相对于对象推进的原生帧内位置 | [总览01](../research/01-scope-and-battle-flow.md#L106) |

### Meta（1）

| 编号 | 待核实问题 | 来源 |
| --- | --- | --- |
| U170 | 卫戍准备、联合防御与领袖阶段的实际转换及结果输入 | [总览01](../research/01-scope-and-battle-flow.md#L31) |

### 模式对照、显示、逐帧或外层（11）

| 编号 | 来源类别 | 待核实问题 | 来源 |
| --- | --- | --- | --- |
| X01 | 逐帧或显示 | 近停后与拉点分离再恢复施力的实际逐帧轨迹 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L259) |
| X02 | 逐帧或显示 | 弧光锋卫目标在同 Tick 退出并重新进入失衡时的实际观测结果 | [Case 15](../research/cases/15-locomotion-native-semantics.md#L232) |
| X03 | 逐帧或显示 | 计时弹道是否有肉眼可见的先命中后视觉到达场景 | [Case 16](../research/cases/16-projectile-motion-and-hit-boundaries.md#L69) |
| X04 | 逐帧或显示 | 游戏运行时的全局 DOTween 设置是否覆盖常规阻挡站位的默认曲线 | [Case 22](../research/cases/22-block-positioning-and-interruption.md#L75) |
| X05 | 模式对照 | 士影／匠影标记的隐藏及冷却资格。艺影／商影固定起始标记的再次部署保留 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L235) |
| X06 | 模式对照 | 傀影集成战略模组下一次冷却缩短的累计下限、重置与清除 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L238) |
| X07 | 模式对照 | 奎隆转阶段隐藏是否进行其他身份变化 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L242) |
| X08 | 模式对照 | 保全皇家科学院望远镜零费用效果在其他跨区回归路径上是否仍保留 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L244) |
| X09 | UI／外层 | 预置可选择卡牌的 UI 及其卡牌注入入口 | [Case 24](../research/cases/24-deployment-cost-and-supply.md#L429) |
| X10 | 模式对照 | randomType 和 refreshType 非 ALWAYS 的周期策略实际消费者及刷新结果。现有非默认样本仅来自排除模式 | [Case 30](../research/cases/30-scheduler-action-data-fields.md#L180) |
| X11 | UI／外层 | 敌人手册展示 race／标签和战斗 FilterTag 的完整映射 | [Case 36](../research/cases/36-unit-classification-and-combat-tags.md#L144) |

## 收尾条件

Core 收尾以实际机制、适用范围和可观察结果为依据。先验证已有公开入口的组合，再记录仍需领域设计的边界。新设计的验收经正常公开入口验证代表交互。 [设计必要性复审](research-necessity-20261122.md) · [语义验收](verification.md)
