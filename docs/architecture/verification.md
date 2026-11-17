# 已审查范围的语义验收

本页只规定关键结果和集中保障位置，详细语义以链接的领域文档为权威。测试从这些契约和真实机制导出，现有用例、文件数和 test() 数量不能反向决定架构。具体套件归属见[测试说明](../../test/README.md#已审查范围)。

## 范围

覆盖 Battlefield、Unit 构造／Change／查询、各 Capability，以及 Action、Skill、Effect、Contribution、Deployment、Blocking、Occupancy、Route／Schedule 和 Runtime 协作；包括公共 Hook／Ref／Lifetime 与 HP／EP 四类结算。完整 Projectile、Mechanism 的独立业务仍按其领域审查，参与已审查协作时不豁免公共契约。

## 保留依据

- 保障实际玩法结果、身份与资源不变量，以及会改变结果的发布／结算边界。未接入内容和设计示例不作为已实现行为验收。
- 每个独立重要结果有代表场景，共享协议只集中保障一次，消费者仅增加自己的业务后果；同一输入、种子与程序得到相同重要结果。测试目录、主题命名与本文领域一致，每个套件以 Contract 链接对应契约。
- 身份、资源与生命周期通过公开领域操作建立；纯算法直接使用合法值。夹具准备事实，不伪造完成状态或另写产品算法。
- 有冲突先依机制证据与已确认选择统一文档，再修实现和测试；具体语义尺度见[架构约定](README.md)。

## Data 的必要验收

依据 [Data](data.md)，验证原始资料及本次静态配置到规范化结果：

| 结果 | 集中代表 |
| --- | --- |
| 养成、等级覆盖、技能选择、静态覆写、范围与资源关联正确；真实非零自然回复保留单位换算。 | [单位配置](../../test/data/unit/)使用实际资料，不枚举默认零值。 |
| 地图几何、路线时基与控制流、出兵展开、随机组及等待政策保留。 | [Route／Schedule 转换](../../test/data/level/route-schedule.test.js)与[预置配置](../../test/data/level/predefined.test.js)；主线预处理、Branch 运行时抽选及 notCountInTotal 转换。 |
| Effect 重应用、层数／续期和属性修正位置、黑板与来源采样标记完整。 | [Effect 转换](../../test/data/effect.test.js)使用已启用描述，不以静态读取证明运行算法。 |

Prefab、范围读取和换算由实际业务使用；目录移动、提取工具或未接入原型不产生额外运行验收承诺。

## 必须保障的结果

| 领域与权威契约 | 关键结果与集中归属 |
| --- | --- |
| [Battlefield](battlefield.md)、[Spatial](spatial.md) | 不可变发布、全批最终占格、Tile／Overlay 导航与空间资格；结构写入不执行业务。位置、Presence、占格和 Hitbox 分开；接触不等于命中。 |
| [Unit 构造](capability.md#初始化与装配) | 具体 Definition 与所选 State／Initial 配对，拒绝阻挡双角色，登记后能力组成稳定；额外已知 Initial 可忽略。初始 Effect 经登记后的正常 install。 |
| [Change](api-conventions.md#51-unit-完整操作与批量变更) | 同目标 compose 结合而不交换，各项 previous、no-op 和有序 Settlement；纯变换一次发布后结算，真实后继不因最终恢复入口引用丢失。optional 读取前序输入；嵌套 update 接续最新状态。 |
| [Hook](hook.md)、[Lifetime](lifetime.md) | 候选固定、最新登记、独立嵌套、priority 同级稳定；首次有效结束固定载荷，依赖完整结束后宿主才注销。旧执行 Ref 不操作后来实例。 |
| [Action](action.md)、[Skill](skill.md) | 启动受理与已发生前缀、静态时序修正的同步冷却结算、释放／中断／输出、持久与单轮身份；发动门槛与支付额独立且显式声明，拒绝不初始化或支付，支付通知看到已发布的本轮；显式 SP 支付与回复许可、Ammo 和 TIME 当轮预算；主动操作须有处理器并通过限制，受理不等于结束，内部结束独立；跨回调不重复消费或恢复旧执行。 |
| [Effect](effect.md)、[Contribution](capability.md#属性与贡献) | 安装与启停、竞争、重应用、到期和最后业务正确；先选有效贡献再求动态输入，所属公式保留小数与数值范围。 |
| [Occupancy](occupancy.md)、[Deployment](deployment.md) | 双槽排他、Pair 先发布再通知，旧配对不影响替代实例；Quote 预览与执行一致，资源先消费再入场，主动／被动离场分别结账，库存／DP 预算及 Card 延续正确。 |
| [Blocking](blocking.md)、[Layer](capability.md#layer-与-hitbox) | 资格、容量尾裁、批量双端发布与旧 Relation；主动空间覆盖取消自身计划、解除当前关系。Layer 同值请求仍清理，Settlement 使用当时当前关系，通知中新建关系不追删。 |
| [Locomotion](navigation.md) | 历史速度、限力／限速、转向、最终目标吸附、地形避障与反射；自主移动和阻挡偏移独立，Route 不重复运动公式。 |
| [Targeting](targeting.md)、[Presence](presence.md) | 选择、空间存在、锁定命中与实际接收独立；具体重要协作见下节。 |
| [Resource](resource.md)、[Vitality](vitality.md)、[Elemental](elemental.md) | 输出／接收／实际变化分离，HP／债务与 EP 准确提交，后继报告固定，死亡与 Burst 顺序正确；集中结果见资源清单。 |
| [Runtime](functional-core.md) | 出生等待先于 enter，逐对象接续最新状态，预置重入保留新绑定，Tick 阶段确定、失败不发布；调度完成后 step 仍可推进。 |

## 集中归属与收敛完成条件

公共容器、Query、RNG、数值取整及几何算法各自集中验证；坐标旋转、范围并集、圆／盒／混合形状的独立相交和扫掠结果不复制到消费者。Targeting 只补一个实际 Hitbox 范围接入，锁定弹道单独验证身份命中。

[公共类型契约](../../test/core/types.test.js) 集中证明构造与私有状态／回调配对、Typed Ref、具体 Initial 必填与额外已知输入、Query／optional 收窄、Change 能力逆变和 Hook Key 载荷关联。Occupancy 必需 tile、Route 必需 plan／offset、Spawn 所需与禁止能力由构造边界代表覆盖，不按字段、数组长度或每种 Capability 扩矩阵。

普通注册保序、结构共享、Hook 候选与 Lifetime 析构只在公共代表中保障；MaxHP、冷却、Ammo 和 Blocking 等具有真实后继的 Change 留在所属业务。综合场景仅保障新增跨领域结果，Content 位置或涉及未完整审查领域不是保留重复用例的理由。

## Effect 分组、重复施加与计时

依据 [Effect](effect.md)，集中在 [Effect 主套件](../../test/core/effect.test.js)保障：

- 来源分组区分共享／空来源独立组、同 Card 多实例、不同 Card、无 Card Unit；来源注销与再部署不改变历史 Card 归属。Deployment 只保障历史在 enter 前登记、拒绝不登记、离场不删除。
- 重应用正确拒绝、新建或保留身份与私有状态；实际／有效叠层上限、满层续期、END／DECAY 和手动减层产生对应结果。实际变层先发布再通知，即使有效层数未变；满层只续期不通知变层。停用期间仍通知，但不恢复旧输出，重新启用读最新层数。
- 零时长仍安装后结束；INACTIVE 自动扣时、ACTIVE 才执行 onTick，手动推进、绝对期限和最新时间续期保留最后业务。通用计时不复制到每种 Burst。

类型代表保障具体政策回调与实例配对、DECAY 禁止 DEADLINE，以及 install 新建／合并返回的正确精度。具体角色与效果只验证自己的输出，不重复公共类型或重应用矩阵。

## Targeting 与 Targetable 的回归语义

依据 [Targeting](targeting.md)，由[标准资格](../../test/core/targeting/eligibility.test.js)、[受选限制](../../test/core/targeting/targetable.test.js)与[实际攻击](../../test/content/actions/attack.test.js)分别保障：

| 关键结果 | 集中代表 |
| --- | --- |
| HP／EP 候选与实际接收分开，来源能力和集合目标类型保持。 | 标准选择及 [公共类型契约](../../test/core/types.test.js)；不复制四个谓词矩阵。 |
| Restriction 先竞争再按定义身份豁免，独立机制保留，移除不误删其它来源。 | Targetable 一个竞争与共享定义场景。 |
| 有效 MaxHP、HP／EP 混合需求、ACTIVE healFree 与嘲讽排序正确。 | 混合治疗、贡献与选择场景；公共取整只测一次。 |
| 选择组接续 RNG，启动拒绝保留消费；保存目标不自动重选，显式复验不重新竞争。 | 实际攻击接入。 |

来源退场后的样本归 Projectile／Content；复杂选择由 Query 组合，不另建测试专用 Selector 程序。

## Route 与 Schedule 的回归语义

依据 [Route](navigation.md) 和 [Schedule](schedule.md)，对应[路线](../../test/core/navigation/route.test.js)与[调度](../../test/core/schedule.test.js)套件：

- Route：首指令同步进入、MOVE 进入与重入采样、长无环链完整执行／即时环让出；active 与 ticking 独立，ENTER 可暂停而绝对等待保留出生时基。TRACE 到达后保留指令和最后格，支持同格重启；Main 出口不随临时控制权改变，无终点不离场。空间副作用后使用最新 Context。
- Schedule：前延迟、出生偏移和位置共用样本、等待先于 enter；Wave 超时只解除 wave 等待，final 保留；活 Unit 的指定等待释放与完整离场各有正确结果。Branch 每次整组重抽，出生前发布索引／RNG／实例，触发 Tick 不重复推进，重入不丢实例。空计划与完成后继续 step 正常。

路线距离只累计导航运动，不计 APPEAR 跳跃；Data 转换与 Core 运行分别集中保障，Hook／RNG 不重复验证。

## Presence 的回归语义

依据 [Presence](presence.md)，[主套件](../../test/core/presence.test.js)保障保留 Unit、位置、占格、部署份额、Effect 与 Lifetime；全部限制先发布，再清理当前 Blocking 和自身计划、取消 Action。appear 只移除自身限制，主动位置覆盖包括同值请求。

跨领域代表只补独立后果：Blocker 不取消原目标的独立偏移；旧 Action 输出停止、已成立 Skill 继续；普通 HP／EP 损伤拒收而 HP LOSS 可结算，明确恢复与自然恢复独立；普通空间／目标／Terrain 排除消失对象，tracking 弹道仍追真实位置。公共 Restriction 与结束协议不重复。

## Restriction 与部署许可的回归语义

依据 [Restriction](capability.md#资格限制) 和 [Deployment](deployment.md)：

| 编号 | 关键结果与集中代表 |
| --- | --- |
| RESTRICTION-01 | 有效贡献、组竞争、定义身份和 AND 判断正确；复用 Targetable，不为 resolve 查询建同构矩阵。 |
| RESTRICTION-02 | 三次接收复检使用同一 ignore、最新有效项，豁免不恢复败项、不绕过固有前提、不传嵌套；资源代表补同步变化。 |
| RESTRICTION-03 | 领域操作保留各自资格时点和后继，类型不放宽能力／载荷；[公共类型契约](../../test/core/types.test.js)、Blocking／Skill／Presence 各承担自身结果。 |
| DEPLOY-RESTRICTION-01 | 非法 Quote 在预览与部署一致拒绝；库存、支付、地图、双槽等固定前提不能被规则覆盖，免费与免支付保留不同账务。 |
| DEPLOY-RESTRICTION-02 | Definition／Card／Request 的覆盖和互斥选择得到稳定拒绝原因；一个分层代表，不枚举所有字段和来源。 |

## Hook 与伤害／治疗的回归语义

详细契约只在 [Resource](resource.md)、[Vitality](vitality.md)、[Elemental](elemental.md) 与 [Hook](hook.md) 定义。下列结果决定必要场景，不按四管线或所有阶段复制：

| 编号 | 关键结果 | 集中代表 |
| --- | --- | --- |
| HOOK-01 | 固定候选及初始 priority、最新登记、同级稳定和独立嵌套；leave 使用注销前程序快照，结束事实不丢仍登记的 LEAVING 宿主。 | [Hook](../../test/core/hook.test.js)、[类型](../../test/core/types.test.js)与真实生命周期。 |
| HOOK-02 | Calculate／Apply 排除独立，键身份和 ID 匹配正确；排除不变成免疫豁免或嵌套政策。 | [资源结算](../../test/core/resource/application.test.js)中的来源／目标及嵌套代表。 |
| HOOK-03 | Blocking 两方候选和 priority 在任一通知前固定，仍先 Blocker 后 Blockable；关系失效与历史通知按各自契约处理。 | [Blocking](../../test/core/blocking.test.js)关系重入，不复制公共候选矩阵。 |
| HP-01 | 当前公式类型与防御采样贯穿计算／应用；分类事实保留，不产生计算期受击。 | [Calculate](../../test/core/resource/calculation.test.js)实际公式与采样。 |
| HP-02 | 独立 Calculate 分支只接续选中的完整 State，随后仅 Apply 一次。 | [Calculate](../../test/core/resource/calculation.test.js)的独立计算分支，不自写未接入的弱点内容。 |
| APPLY-01 | BeforeReceive 改变准入并接续工作值，取消保留已完成前缀；HIT 与普通伤判同轮，前置取消不授予 HIT，后续取消不回滚已得 SP。 | [Apply](../../test/core/resource/application.test.js)的接收与同步后继。 |
| APPLY-02 | 最终非负边界、零计算拒绝与零接收／零实际变化成功分开；报告在写点固定。 | [Apply](../../test/core/resource/application.test.js)与[Calculate](../../test/core/resource/calculation.test.js)的零值和报告。 |
| APPLY-03 | 固定／取消单向接续，取消权限与成功后继分开；禁止抵挡保留护盾且仍有普通减伤，FIXED 不被普通改量恢复。 | [泥岩](../../test/content/operators/mudrock.test.js)真实 Hook 与[接收类型](../../test/core/types.test.js)。 |
| HP-03 | damageCommitted、两侧 Applied 完成后才确认死亡；零 HP 期间保留 Unit 与 Blocking，可救回，不由嵌套 Combat 提前判死。 | [Apply](../../test/core/resource/application.test.js)的致死与恢复。 |
| KILL-01 | 显式 killer 与 source 独立；targetKilled 先于普通目标 Prepare，排除或来源 LEAVING 不改变目标结算。 | [Apply](../../test/core/resource/application.test.js)确认与[Unit](../../test/core/unit.test.js)本地通知。 |
| KILL-02 | 内层取得死亡确认时外层不重复；首次 End 固定归属，重复不 Prepare，Finalize 延后不丢 killed，Completed 后发业务不改旧结果。 | [Apply](../../test/core/resource/application.test.js)嵌套死亡与真实 Lifetime。 |
| KILL-03 | InstantKill 调用者先登记 Prepare，再请求结束；通知看到已发布 LEAVING 与固定 Departure，不要求先写 HP0，直接 remove 不自动生成来源通知。 | [Unit](../../test/core/unit.test.js)的直接结束组合，不另建 InstantKill 框架。 |
| HP-04 | MaxHP 变更同步比例与债务分配，容量耗尽由 Settlement 处理；不伪装治疗或复活。 | [Vitality](../../test/core/vitality.test.js)贡献变化及[治疗排序](../../test/core/targeting/eligibility.test.js)。 |
| HP-05 | 三种 Nature 共用管线；无敌／Presence 不阻止 LOSS，环境标签不自动跳 Hook。 | [Apply](../../test/core/resource/application.test.js)流失与接收。 |
| HP-06 | HIT 许可与 Nature 独立，非 LOSS 且许可为真才回复；环境和 Effect 输出不靠全局阻回伪装。 | [Skill](../../test/core/skill.test.js)、[泥岩](../../test/content/operators/mudrock.test.js)及[实际地形](../../test/content/terrain.test.js)；标准 Burst 由其成品套件保障。 |
| HP-07 | 自然回复读取当前属性、逐 Tick 偿债／回 HP，顺序和零速／存活门控正确，不进入普通治疗。 | [Vitality](../../test/core/vitality.test.js)的自然回复。 |
| HP-08 | Health 候选干预后读最新宿主，失效保留前缀而不成功写入；成功含零变化均执行 void 后继，原报告不受其更改／离场影响。 | [Vitality](../../test/core/vitality.test.js)提交干预与[类型](../../test/core/types.test.js)。 |
| HP-09 | 负生命两条累计分支、容量耗尽与配置延后清算正确，设置比例不即时清债或判死。 | [Vitality](../../test/core/vitality.test.js)的受击、债务与动态容量。 |
| HEAL-01 | 恢复先偿债，真正溢出与 HP 增益分开；容量缩减后的 Healing 写入即使引发 DEATH，仍返回 APPLIED 和固定报告。 | [Vitality](../../test/core/vitality.test.js)债务恢复与容量缩减，核对离场和固定报告。 |
| EP-01 | EP 与 HP 元素抗性独立；最新 MaxEP 的规范化真实写入 State，与报告写点一致。显式恢复逐型全量；healed 只通知正增益，零增益仍可成功 Applied。 | [资源公式](../../test/core/resource/calculation.test.js)与[Elemental](../../test/core/elemental.test.js)的实际提交。 |
| EP-02 | 耗尽同步创建 Burst，创建通知先于仍有效的一次性输出，随后 damaged／Applied；启动取消不改旧损失报告。 | [Elemental](../../test/core/elemental.test.js)的耗尽与启动取消。 |
| EP-03 | 唯一恢复预算、动态上限／速度、暂停、末次周期、零预算输出与产物期限正确；自然 EP 回复不派发 healed 或普通治疗。 | [Elemental](../../test/core/elemental.test.js)与[标准成品](../../test/core/effects/elemental.test.js)，不重写恢复算法或展开标准参数矩阵。 |
| EP-04 | MANIA 接收与全型回填正确；角色程序按 Execution 首次释放及每次 Skill 激活增加伤害，两种能力分别监听，失败发动不计数，允许 HIT 且取消根后独立保留；敌方周期按实际 ACTIVE Tick 增伤，不被恢复倍率加速，末次输出与攻速清理正确。 | [Data 映射](../../test/data/effect.test.js)与[Elemental](../../test/core/elemental.test.js)保障第五型接入和全型资源；[标准成品](../../test/core/effects/elemental.test.js)保障两套时钟、施放与根结束的差异。 |
| EP-05 | ENVIRONMENT 仍使用普通 EP 抗性和接收管线；环境免疫 Hook 能取消环境 EP 而不影响普通 EP，单次排除该 Hook 后可正常接收。 | [Apply](../../test/core/resource/application.test.js)的环境免疫场景，不复制公共 Hook 排除矩阵。 |
| EP-06 | 缩时保留已推进量，按当前 MaxEP 即时回填，不补周期或 healed；耗尽时完整结束并清理根绑定产物，独立眩晕保留原期限，结束回调中的新 Burst 不受旧 Ref 影响。 | [Elemental](../../test/core/elemental.test.js)的即时回填与同步结束两个成品场景。 |

具体过量转屏障、非致命、保护、复活和其它特殊内容接入后，再验证其新增玩法结果；已有资源报告或 Hook 不构成这些内容已实现的证明。EP 具体内容与暂缓例外见 [Elemental 支持边界](elemental.md#支持边界)。

## Event 的回归语义

依据 [Event](event.md)：成功的 HP／EP 结算输出实际变化，包含零实际变化；拒绝不产生成功 Event。元素 HP 伤害与 EP 损伤分开；爆发位置与注销历史不会因随后移动／删除丢失；顺序按发生时点，Tick 清空旧输出但旧版本可读，表现不反向改变领域状态。

这些结果集中在 UI 适配与实际结算组合，领域业务通过 State、Outcome／Application 或 Hook 验证，不为 Blocking、Projectile 等复制诊断输出矩阵。

## 不单独保留的内容

不按每个 Getter／Setter、字段、空数组、同引用或缺失对象建立用例；不验证已删 API 的不存在或内部存储／缓存形状；不为不可达数值、非法调度或篡改只读状态增加防御矩阵；不把测试夹具自写的 Aura／Buff／选择算法当作产品实现。

已有语义的回归修正其集中代表，只有独立重要结果才增加场景。覆盖充分以语义和实际结果判断，重复层级或文件数量不增加保证。
