# Core 架构缺口复核

复查基线 `7ba99d2`。[初次审计](research-audit-20261122.md)的 G01–G11 和 U001–U059 编号继续有效。原生依据来自归档的客户端、配置和实际内容，下面的 Core 探针仅验证项目公开入口的可表达性。一个原生字段、事件位置或实现差异只有在支持范围内产生不同战斗结果，且现有入口不能合理组合时，才进入领域契约设计。

## 已证实的架构缺口

| 编号 | 区分现有 Core 与所需玩法的结果 |
| --- | --- |
| G04 跨层阻挡 | 迷狂牢笼需要让同一阻挡者同时保有地面和空中关系，自身的受击资格会读取这些关系。现有基础资格只允许一层，切层还会解除旧关系。 |
| U022 动态空中阻挡半径 | 凯尔希·思衡托 S1 可让已部署友方拦截原半径外的空中目标，失效时恢复正常获取范围。当前 Restriction 只能筛掉候选，无法让固定半径外的目标进入关系获取。 |
| 迷狂牢笼的阻挡站位 | 牢笼保留距离 0.2 格以内目标的位置，较远目标向牢笼中心聚拢。现有 `acquire` 在取得关系时将近处目标向外推至 0.5 格。探针中距牢笼 0.1 格的目标被推入邻格。用 `presence.appear` 移回会同时解除阻挡。 [原生站位](../research/evidence/cage-block-position-20261122/README.md) · [Core 取得](../../src/core/battle/blocking/operations.ts#L150) |
| G05 战中 DP 上限 | 鉴定过的诺伯特平民进保护区后，普通 DP 账户能存下此前存不下的 DP。目前自然回复和显式加费都受开场上限约束。 |
| G08 出口结算原因 | 到达蓝门和思旧的强制出口结算都能产生独立于死亡、脚本清除的业务结果。当前自然抵达和同位置的脚本清除都让 `Unit.removed` 收到 `SCRIPT`。圣女停在终点已有组合，见下文。 |
| U038 死亡后全局部署位的独立归还 | 普通死亡时 Card 先结算，满额队伍仍需等全局部署位归还才能下另一张卡。当前离场同时归还名额和开始卡牌恢复。 |
| U048 动态召唤参与现有调度等待 | FD-8 的糖果车在实时路线和位置出生后能阻止下一波和关卡完成。当前普通动态出生能创建实际 Unit，但可共用的波次／最终登记路径只接收计划内 Spawn。 |

G03 是已确认且明确暂缓的标准狂躁行为差异。U023 目前已有单独模组的组合路径。其余条目的结论以已核对案例及实际交互条件为准。

## 原审计的十一项

| 编号 | 实际需要保持的结果 | 现有入口与判断 |
| --- | --- | --- |
| G01 同实例复活 | 保持同一 Unit、等待、逐步恢复、接续新阶段。 | 已验证 `damageCommitting` 保留 1 HP，`damageCommitted` 装等待 Effect，取消 Action／Activation、解除阻挡和限制受选，后续通过 `increaseHp` 恢复。沿用定稿。 [Vitality](vitality.md#特殊-hp-application-的支持边界) |
| G02 全局效果与后来出生 | 已经处于第二形态的后兽让后来出生的合格目标改变路线。 | 已用正常 Schedule Spawn 验证同步组合。该关卡绑定会受影响的出生蓝图，在 Unit `entered` 查询活跃来源，`Effect.install` 后用 `Unit.update(route.reassign(...))` 改路线，后续入场观察者按 Ref 读取已是新路线。切入来源阶段时枚举在场目标执行同一安装程序；用 Scope 管理依赖清理。现有样本可覆盖。需要证明由未知创建入口产生、且在首个公开可组合时点已经改变结果，才有依据要求全局登记回调。 [原生链](../research/evidence/insert-patrol-20261107/content/README.md) · [Unit.add](../../src/core/unit/operations.ts#L14) |
| G03 空施放与狂躁 | 郁金香 S1 的空分支仍成功并扣 SP，有目标实放才加狂躁。 | 标准狂躁同时消费 `activationStarted` 与 `Action.released`。正常 `SKILL ACTIVATE` 探针中，两种分支都扣 SP，狂躁首段伤害依次是无施放 100、空施放 150、直接输出 150、发动并经 Action 释放 200。在 Activation 初始化中保存目标后，Hook 可以读取该事实，标准狂躁仍按每次成功发动计数。差异限于标准 Effect 表达，由既有项目决定暂缓。 [空施放原生证据](../research/evidence/anger-family-20261117/empty/README.md) · [标准狂躁的两项监听](../../src/core/effects/elemental/mania.ts#L104) · [Elemental](elemental.md#支持边界) |
| G04 跨层阻挡 | 迷狂牢笼可在同格同时建立地面与飞行的实际阻挡关系。其受击资格也消费该关系。 | 用 `Blocker.setLayer` 和正常阻挡搜索验证了单层切换只留下当前层的关系。资格先做层相等检查，Restriction 无法放行被这一步拒绝的目标。降低飞行目标的 Layer 会改变其他索敌和阻挡。确有跨层阻挡资格差异，范围在现有 Blocking 建立关系的规则。 [原生属性](../research/evidence/resource-mechanisms-20261114/life/content.json#L136150) · [迷狂牢笼社区规则](https://prts.wiki/w/迷狂牢笼) · [资格检查](../../src/core/battle/blocking/operations.ts#L51) |
| G05 战中 DP 上限 | 鉴定完成的诺伯特平民抵达保护区后提高我方账户上限。 | `dp.modify`、`recover`、`pay` 与 `advance` 都走初始上限。预填更高的静态上限会允许奖励前多存 DP，另设余额会绕开普通支付。现有 DP 账户缺少这项状态变化。Card 价格上限的联动由 U024 单独核对。 [实际内容](../research/cases/20-norport-civilian-allegiance-and-blocking.md#L22) · [当前 DP](../../src/core/battle/deployment/dp.ts#L5) |
| G06 松桐 S2 部署附加 | 本次部署获得生命上限加成，满 HP 出生，下一次部署不重复获益。 | 已用正常 `deploy` 验证。施加技能时用 `card.setUnitHook` 登记高优先级 `entered`，在该回调中 `Unit.update(vitality.setMaxHpContribution(...))` 按比例将满血提升到有效上限并移除已消费的 Card Hook。后续业务按 Ref 查询得到实时 115／115，下次部署恢复 100／100。传给已派发回调的入场快照仍为 100／100。目前没有实际消费者要求快照或初始化本身看到该加成，U035 仅保留这条具体交互问题。 [实际绑定](../research/cases/24-deployment-cost-and-supply.md#L266) · [Unit.add](../../src/core/unit/operations.ts#L14) |
| G07 同卡特殊部署 | 卫戍开场保留 Card 关联，预放不扣相应资源。开场布阵不进入耀骑士临光 S2 的上一次卡西米尔干员部署判定。 | 已验证同一卡用 `createRequest` 取得请求，开场按规则提供 `quote.dp=null`、`quote.stock=0`，走正常 `deploy` 留下关联历史。模式私有状态暂存同步处理的初始请求。负责更新「上次部署的干员」的 `deployed` 监听用 `accepts` 跳过这一请求，耀骑士临光消费该事实。后续普通部署照常。自动失败、共享限制和计时见 U032–U040。 [模式样例](../research/cases/24-deployment-cost-and-supply.md#L208) · [战斗阶段说明](https://prts.wiki/w/卫戍协议/帮助#作战阶段) · [当前部署链](../../src/core/battle/deployment/operations.ts#L87) |
| G08 路线退出 | 圣女有真实终点且抵达后留场。普通抵达和思旧拾取进入出口结算，脚本清除和死亡走各自结算。 | 圣女已知路线可保留 `endPosition`，在末端增加 MOVE 与 ENTER WAIT，通过 `requireAllCheckpoints` 和 `setTicking` 保持等待。探针正常移到终点，`remainingDistance` 从 2 降到 0，180 Tick 后仍在场。`skipWait` 可恢复出口。另在完全相同的终点状态执行 `Route.advance` 和 `Unit.remove(SCRIPT)`，得到相同 `Unit.removed` 业务载荷，区别只在表现 Event；思旧触发的出口还能在几何终点之外发生。已证缺口是离场原因。 [路线退出及思旧实证](../research/cases/13-route-and-movement-timing.md#L153) · [统计依据](../research/cases/30-scheduler-action-data-fields.md#L155) · [表现事件边界](event.md) |
| G09 Branch 取路线 | 思旧吸收后按关卡配置改变路线。 | 固定活动的 23 份关卡中查到 18 个相关分支，每个只有一 Phase 和一条路线条目。17 次分支名引用均是敌人参数。Data 可把对应 Plan 绑定给吸收程序，调用 `Unit.update(route.reassign(...))`，探针验证原 Unit 改道且 Schedule 不变、没有出生新单位。未取得同一分支游标在受支持内容中由取路线和触发出怪共同消费的正例。 [配置扫描](../research/evidence/cjstel-route-selection-20261122/README.md) · [Route.reassign](../../src/core/unit/capability/route/operations.ts#L151) |
| G10 金币与 SP | 琳琅诗怀雅可在同一技能内处理不同付款与金币容量。 | Content 的 Skill 私有状态保存金币，现有 `activate` 传本次付款参数。具体金币累计、清空、上限及支付在自己的程序中处理。普通 SP 动态改变尚缺独立正例，见 U058。 [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L115) |
| G11 魔力与 SP | 玛露西尔的魔力需要跨部署，消耗时与普通 SP 修改隔离。 | Card 私有状态持久化，Card.onTick 推进场下回复，单位入场和退场同步到技能私有状态。一般 SP 修改只碰 SP。保留既定方案，普通 SP 的封闭仍需独立的实际消费。 [Case 09](../research/cases/09-skill-mechanisms-and-requirements.md#L317) |

## 回收、部署额度与动态召唤的原生调用链

| 编号 | 已查实的可观察结果 | 当前 Core 对照 |
| --- | --- | --- |
| U025 中继器回收 | 实际中继器的结束 Buff 先按 ON_FINISH 补货，再进入 Card 回收。持有上限稳定、确实补入一份且无显式刷新时，剩余总份和排队份数同加，可用份数保持不变。正在恢复时再次普通归队只追加恢复份数，不重置当前段时钟。谬因 S3 的显式重置节点将当前时钟归零。 | `enqueueRecovery` 已能保留当前段，下段在启动时采样预算。其余技能库存逻辑可独立处理，运行中单段归零可用 `clearCooldown(..., "RECOVERY")`。 [原生与实际绑定](../research/evidence/repeater-recovery-20261122/README.md) |
| U038／U039 部署额度和同卡名额 | 普通撤退先返 DP。普通死亡和撤退都在 `Character.OnFinish` 通知原 Card。此时普通 UNIQUE 卡开始冷却，TokenCard 可释放自身在场名额。全局部署额度到 `Unit.OnRecycle → UnitManager.Unregister` 才释放。普通撤退即时回收，普通死亡走延迟回收，Character 默认预算为 1 秒。 | 实际部署资格读取剩余全局额度，已满额时另一张 Card 必须等这个预算结束。当前探针中普通 DEATH 完成时 `usedSlots` 同 Tick 归零，另一张 Card 可立即部署。保留整个 Unit 会延迟 Card 冷却或同卡名额，单卡 DEPLOY Restriction 则无法让全局额度查询保持占用。U039 的同卡名额已随退场结算，明确差异是 U038 的独立全局占用。 [原生与资格](../research/evidence/deployment-exit-limits-20261122/README.md) · [Core 释放](../../src/core/unit/capability/deployable/capability.ts#L62) |
| U048 动态召唤与调度等待 | 寻路者甜品商按活宿主的当前路线和进度生成糖果车。真实调用在成功出生后将它加入当前波次与最终两处等待。主线 12-20 的变形者集群分身只加入最终等待。卫戍炎佑只借用 `dragon` 路线，其调用参数明确跳过两处。 | `Unit.initialize → Unit.add` 能创建动态 Unit，两个等待集合仍为空，Schedule 可以提前完成。固定 Branch Spawn 可以先登记等待，随后在 `entered` 用动态 APPEAR 重定位。探针验证这个组合能阻止进波，但 `entered` 的出生快照仍是模板位置，Spawn 还会额外消费共享 RNG。分别在主线及 Branch 增加阻塞 Operation 可以等待已知结果，需要在关卡另行管理待出生对象和两套等待。缺的是让普通动态创建的真实 Unit 参与同一调度等待。 [真实出生与等待](../research/evidence/managed-summons-20261122/README.md) · [炎佑反例](../research/evidence/stronghold-yan-summon-20261122/README.md) · [Core 等待登记](../../src/core/battle/schedule/runtime.ts#L13) |

本节闭合所述实际普通路径。其它模式的政策、特例和不同版本仍按原证据适用范围记录。

## 凛御银灰模组的再部署涨费上限

U023 的实际样本是凛御银灰 X 模组 3 级。符合天赋条件的 Card 退场后获得 `-0.25` 的再部署倍率上限修正，普通第二层从 ×2 限为 ×1.75。原生先按这个上限算出 rawCost 并取整，再处理运行时倍率和加值。 [实际模组、天赋绑定和原生算价](../research/evidence/redeploy-cost-cap-20261122/README.md)

`resolveCost` 的标准涨费上限固定为 ×2。单独使用 X3 时，退场账务完成后用 `resolveBaseCost` 读取基数 `B`，为第二层且基数大于零的 Card 设置 `finalScaler = floor(B × 1.75) / (2 × B)`，在下一次部署的 `entered` 移除。公开入口探针用凛御银灰的 13 基础费用验证报价、扣款、在场 COST 陆续为 13、19、22，消耗修正后 Card 回到 26。先按原生取整求比值，也通过了固定基础费叠加后段倍率的合成探针。基础价后来再变且另有后段倍率时，采样值可能过期，目前没有查到这种组合的实际内容。按已有证据，U023 未证明需要改 Core。 [当前算价](../../src/core/battle/deployment/card/state.ts#L18)

## 原审计的五十九项候选

下面沿真实业务和已有操作检查原审计 U001–U059。原生取证未覆盖的路径保留具体条件。仅有原生方法或可构造的反例时，当前领域设计维持既定约定。

| 原审计编号 | 可复查的结果和余下条件 |
| --- | --- |
| U001 | 父 Effect 结束时子实例的资格由 `Lifetime.available` 同步失效。维什戴尔残影的实际查询只需要该资格，子 `ON_FINISH` 为空。当前依赖清理可以表达这一例。仍需真实内容在父结束程序读取尚未完成的子清理，才构成改变 Finalize 顺序的理由。 [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L147) · [Lifetime](../../src/core/lifetime/operations.ts#L57) |
| U002 | 已找到的 EXTEND+snapshot 模板来自生息演算。需要先证明支持范围内的重延实例如何重新采样并让输出或组赢家改变。Effect 可以用 `setState`、`setExpiration` 和所属 Capability 的贡献写回组织内容已知的刷新。共享动态优先级仍待实际竞争者。 [Case 01](../research/cases/01-buff-installation-and-parent-scope.md#L275) |
| U003 | 本版唯一直接调用在次生预案的 HalfIdleGameMode.GainExp，普通战斗未见同类调用。常见模式附着可以靠 Effect 的已知 Ref 用 setEnabled／install，加计数留在私有 State。是否支持战中养成，以及它是否必须替换同身份天赋的配置，保留为该玩法的问题。 [定向取证](../research/evidence/talent-schedule-callers-20261122/README.md) |
| U004 | 本轮尚无非默认重挂机制会改变下一轮 Action 可用时点的支持范围内正例。哈蒂娅已证延长的是正在运行的技能，走现有 `extendTime`。保留已定普通攻速的冷却处理政策。 [Case 07](../research/cases/07-action-timing-and-animation.md#L132) |
| U005 | 没有查到 TakeDamageMoveBackEnemy 的实用绑定。已知同步生命内容可按实际计算差值，正差用 increaseHp，负差经资源请求传入已核实的接收政策。真正从这些入口泄漏出错误伤判或死亡才构成另一个操作的依据。 [生命同步](../research/cases/29-hp-and-ep-healing-settlement.md#L153) |
| U006 | 主线 4-1 弩手有路点原格与偏移后量化格不同的配置。沿 5-2 真实地图做同实现单变量比较，选原格或偏移后量化格会得到不同下一移动目标。尚待和原生走位以及可观察的到达／阻挡结果对照。Plan 已保存格和偏移，现有证据只指向内部查询。 [配置与导航](../research/cases/12-navigation-native-algorithm.md) |
| U007–U009 | alwaysCheckCurrentPoint 已有 true 样本；临时控制可以 createContext 后独立 selectContext。还缺主动重建 Main、策略改变、遇到不可达点的实际交集。首 APPEAR／DISAPPEAR 的此次直接普通 Spawn 扫描无命中，Unit.initialize 已接收本次位置、登记后的 entered 可执行首指令。固定数据复扫无非零 reachDistance，三个问题各需实际观察者或正例。 [Case 13](../research/cases/13-route-and-movement-timing.md) |
| U010–U013 | 固定数据扫到的路线都允许对角移动，无必须访问格中心或后继节点中心的非默认选项。E_NUM 确有静态路线和出生引用，已查普通活动例包含占位和被关闭条目，尚缺实际以 E_NUM 行走的实例。中心序列明确时可编为 MOVE。Data 继续核对占位与运行路线替换，Core 保持 WALK／FLY。 [Case 14](../research/cases/14-route-definition-fields.md) |
| U014–U016 | Route 已用 Context.offset 计算定位点，Locomotion 另消费身体位置。脚点差异仍需地图反例。已见邻居分离绑定来自对战／特殊样本，普通玩法可达性待证。2-8 等地图碰撞可用 Tile collider 和 Shifting，动态单位碰撞层暂缺独立正例。 [Case 15](../research/cases/15-locomotion-native-semantics.md#L148) |
| U017–U019 | 暗索等用有效来源和弹道 Scope 即可建立牵引。空来源机制须另找到支持范围内的真实持续牵引。SN-5、BI-TR-2 可用现有摩擦设置与恢复；足球多源对照保留。具体内容可以分别观察失衡速度与自主运动，短期先找这两种查询的实际模板和结果，避免把历史速度当作当前准入。 [Case 15](../research/cases/15-locomotion-native-semantics.md#L249) |
| U020 | Projectile 私有 State 可保存来源和采样，HP／EP 请求可以显式指定实际来源。要确认反射是否还必须保留弹道身份、改 Side，需从实际反射内容查清，不从静态来源替换候选推定。 [Case 18](../research/cases/18-projectile-source-and-target-lifecycles.md#L198) |
| U021 | 多原点有原生代码，仍待支持内容中同一关系所有者从多个原点搜索的实际配置。G04 的同格跨层只证明层资格。 [Case 21](../research/cases/21-tippi-air-blocking.md#L86) |
| U022 | 凯尔希·思衡托 S1 提高已在场友方干员的空中阻挡半径，配置有明确倍率。现有 `setLayer` 按初始配置重设半径并解除旧关系，Restriction 无法让 `search` 或 `acquire` 接纳固定圆外的目标。预先调大所有潜在受益者的半径再用限制缩回，需要在 Content 重复维护正常半径、有效半径和关系保留政策。应在现有 Blocking 获取规则内核对有效半径及恢复后的关系。同 G04 一并评估。 [实际配置和规则](../research/cases/21-tippi-air-blocking.md#L96) · [现有搜索](../../src/core/battle/blocking/operations.ts#L183) |
| U023 | 已知凛冬、极境与费用交换可分别用卡牌费用贡献。凛御银灰 X3 的实际单独效果经现有 Card 操作验证。原先合成探针只排除了后段直接乘 0.875 的近似，已取整的固定基础费校正通过。若找到基础费后改且同时有后段倍率的真实组合，才需重新判断共同算价的表达能力。 [原生与 Core 对照](#凛御银灰模组的再部署涨费上限) |
| U024 | 主线 12-13 和训练 22 的同一符文将 DP 上限设为 20、卡牌标价截断设为 99，并关闭同步。静态初值已有 Deployment.definition.maxDp 和 costCeiling，Data 可直接转换。已定位战中账户上限写入口，仍需 sync=true 的实际内容与完整后继证明运行时必须联动。 [原生与实际关卡](../research/evidence/dp-cap-20261122/README.md) · [当前 Definition](../../src/core/battle/deployment/deployment.ts#L14) |
| U025–U027 | U025 的普通连续归队按本次定向补查结论保留当前段。银灰和砾分别作用下一次预算与当前段，已有对应贡献和操作。回滚、半值取整和多来源顺序继续按真实组合查证。 [Case 24](../research/cases/24-deployment-cost-and-supply.md#L109) |
| U028 | 现有 Request 可以豁免本次冷却、提供零 DP，同时保留 Card 的真实时钟，随后走同卡 deploy。特殊移动的原实例可 Unit.remove，后续同步识别实际结果。需要先查具体移动继承的 HP／SP、失败后继和退场业务原因，再判断是否要调整已有操作。已有增加 HP 操作不能模拟任意生命迁移。 [Case 24](../research/cases/24-deployment-cost-and-supply.md#L171) |
| U029–U031 | 同屏上限和当前库存已有独立字段，临时在场上限可由 Request 限制表达。谬因 S3 的额外中继器和清 CD 要核实是否还改变持有截断。已知批量回收可选具体 Unit Ref 逐一 remove，随后用 Card.recharge／enqueueRecovery。未用卡可分别控制 DISPLAY／SELECT／DEPLOY；要查实际是否移除身份、何时裁剪、或有业务依赖回收原子顺序。 [Case 24](../research/cases/24-deployment-cost-and-supply.md#L189) |
| U032–U034 | 卫戍开场的已证 G07 可组合。倒地和自动重试可由 Mechanism 的私有进度与正常 evaluate／deploy 推进。现有暂停、缩短和清空可以分别操作当前段与恢复段；需查堆叠时钟是每实例并行还是按同卡串行，以及哪些失败、暂停组合真实适用。 [Case 24](../research/cases/24-deployment-cost-and-supply.md#L220) |
| U035 | G06 的探针保留真实实时 HP，冻结载荷仍是出生旧样本。优先找必须消费早期出生事实的内容，查清基础 SP、MaxHP 与该消费者的时点。若具体消费者可按 Ref 查询，则已有路径。 [Case 24](../research/cases/24-deployment-cost-and-supply.md#L266) |
| U036–U037 | 岁相的矩形清场、按格布置封印可用 Box 查询、Unit.remove 与独立地块覆盖／单位。多格 Occupancy 需找到消费同一主体跨格占位的业务。普通无卡预置用 Unit.initialize；关联既有 Card 的特殊预置尚需查清退场返费、库存及具体回收对象。 [方向和巨型范围](../research/cases/24-deployment-cost-and-supply.md#L291) · [预置样本](../research/cases/24-deployment-cost-and-supply.md#L418) |
| U038–U040 | 普通死亡的部署额度与同卡名额已经分别追到各自的写回及资格查询，见定向补查。源石封印是否约束自动入口仍缺实际规则。共用同一卡时已有 DEPLOY Restriction 可供明确政策消费。 [普通回收](../research/cases/24-deployment-cost-and-supply.md#普通撤退与死亡的结算顺序) |
| U041 | 已有 Burst 在 onInstall 先建立槽，随后派启动通知，后续准入看到该槽。当前定稿允许独立子 Effect。有静态重入窗口，尚无真实内容依赖同宿主并行第二轮，保留已有选择。 [Case 25](../research/cases/25-elemental-burst-recovery-timing.md#L200) · [Elemental](elemental.md#支持边界) |
| U042 | 妮芙的 Action／Projectile 先按命中前爆发事实决定附段，HP beforeCommit 可以装延迟程序，sourceApplied 触发 EP。若主 HP 已归零而未救回，后续 EP 不可用。若其他已知伤后程序须与这个观察者排序，先查是否可由同轮 Hook 优先级组织，再找真实相互覆盖。 [Case 27](../research/cases/27-attack-additions-and-damage-events.md#L152) |
| U043–U044 | 奥术法阵按每笔跳跃目标做来源输出，现有 output 能访问本笔 target，已完成的 HP 报告可读实际变化和取消。零值、免疫、全吸收的原生资格仍待核。泥岩盾先尝试 cancel(BLOCKED) 再减层／治疗，后继可读结果。未见需要另发独立抵挡通知或区分两个 BLOCKED 的业务消费者。 [Case 26](../research/cases/26-arcane-circle-chain-silence.md) · [Case 28](../research/cases/28-damage-hooks-and-event-granularity.md#L42) |
| U045 | 原生目标的 reason 5 能跳过来源输出，现有 Calculate.output 已早于 Apply.beforeReceive。主线 12-20 的变形者集群通过弹道召唤带 EP INTERRUPT 天赋的解构畸变体，其模板只拦 ENEMY 来源的 EP，普通我方 EP 输出不能构成这个冲突。仍缺同一可达请求中有副作用的来源 EP 程序。 [先后比较](../research/cases/28-damage-hooks-and-event-granularity.md#L50) · [召唤链证据](../research/evidence/wdslm-ep-interrupt-20261122/README.md) |
| U046 | 已绑定的均摊 HP／EP 是保全派驻战地援护无人机，联合分治候选有生息演算单位绑定。适用范围内若有分多人回复，可先由作用程序固定成员列表，再按比例对各 Ref 发起现有 Healing。只有共享结算资格产生真实差异时再问资源模型。 [Case 29](../research/cases/29-hp-and-ep-healing-settlement.md#L164) |
| U047 | 本版原生 getter 实读运行配置；销毁和显式记账有确认调用。固定 gamedata 没有同名取值。Core 当前在 Unit 注销释放等待，表现回收独立。是否需要让玩法等物理回收，仍缺明确模式的实际结果，现有延迟等待也可由关卡现有 Operation 表达。 [定向取证](../research/evidence/talent-schedule-callers-20261122/README.md) |
| U048 | 本次定向补查确认了动态创建后加入调度的实际调用，以及本波加最终、只最终、两处均无的三个真实样本。活 Unit 独立解除本波等待继续由已存在的 `releaseFromWave` 表达。 [Case 30](../research/cases/30-scheduler-action-data-fields.md) · [解除等待的原生正例](../research/cases/34-prts-mechanism-coverage-audit.md#L17) |
| U049 | 马特奥已证清原路线后重建，现有 reassign 可用。后兽实际插 MOVE，但样本没有旧巡逻交集。显式 MOVE／GOTO 的替换可由内容组装 Plan，若实际还须保留当前 WAIT 私有进度或随机样本才需额外核对。 [Case 31](../research/cases/31-route-operations-and-state.md#L123) |
| U050–U051 | 莱塔尼亚召唤物正例只建立出向关系。Blocker + Route TRACE + acquired／released 修改 Locomotion 资格就能表达停走和阻挡攻击。未找到同时入向和出向的正例，保留现有互斥。追踪的目标 Ref 与地块可分别保存在内容状态，通过 setTraceTarget 恢复追踪，隐藏条件与重选的实际后继仍待证。 [Case 32](../research/cases/32-leithanien-summons-blocking-and-movement.md) |
| U052–U053 | 火龙确有朝向消费者，但没有证据链接到 MultiSpine 的延迟发布。异常恢复自动补发也未见正例。若某内容确实延迟转向，可由其 Effect 在实际时点清限制再调 facing.turn。 [Case 35](../research/cases/35-facing-and-turning-conditions.md#L69) |
| U054–U057 | 煌的最后生命下限走 damageCommitting，合作的接收程序可提前用 FIXED 稳定本笔候选值。实际无修改权限的独立 writer 交互仍待证。未找到 flag4 的实际缩放消费者，有具体内容时先测 Calculate.exclude。现有 EP 接收及返回可以读取已知取消值，通用后置消费仍无正例。蒂比 S2 的前置发动及闪避可用 beforeReceive，天赋计时的实机与静态分歧保持待证。 [Case 38](../research/cases/38-damage-classification-and-permissions.md#L256) |
| U058 | 尚无普通 SP 动态切换恢复类型的实际正例。内容自有时序可以用 Action.released、HP receiving 或 Skill.onTick，显式 recover(EXTERNAL)。需要真实内容依赖原来源通知、且与既有 SP 计时续接交叉，才考虑领域配置操作。 [Skill 取证](../research/evidence/skill-audit-20261117/sp/result.md#L26) |
| U059 | 固定卫戍资料至少两版配置采用不同共享次数。验证了 Mechanism.state 可保存同一预算，多个 Unit 的 damageCommitting 同步取用，成功者进入 G01 等待。需要继续核对真实判例的扣减、例外和后来加入单位的装配，已证共享预算无需第二套计数机制。 [全局样例](../research/03-space-units-and-mechanisms.md#L285) |

## 验证与范围

运行 `npm test`，62 份测试通过。公开入口探针用于核对表中实际争议和备选组合，原生证据保存在对应案例。已证实的清单按当前证据维护，尚不能改变缺口判断的原生细节保留在研究记录中。
