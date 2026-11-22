# Blocking 设计

Blocking 拥有双端关系、取得／解除、资格维护、容量裁撤与取得站位。Blockable 拥有自己的位置修正计划。关系操作见 [battle/blocking](../../src/core/battle/blocking/index.ts)，能力配置、Change 和通知 Key 见 [capability/blocking](../../src/core/unit/capability/blocking/index.ts)。

## 关键语义

- 每个目标至多一个阻挡者；双端共享同一 Relation，取得关系与位置计划在通知前一起发布。
- 旧 Relation 不能解除后来重建的同双方关系。
- 容量不足从建立顺序末尾逐项裁撤，每项通知后使用最新容量。
- 批量解除先发布全部双端结果再通知；通知中建立的新关系不追溯清理，不自动补搜索。
- 关系与偏移计划独立：普通释放保留计划，目标主动脱离或覆盖位置才取消自身计划。
- 保持关系不因 Applied 前后短暂零 HP 提前解除；新取得仍要求正生命。

## 职责与调度政策

两端状态是关系的唯一权威，不另建全场关系表。Runtime 在 Movement、Mechanism 后执行 Blocking：固定阶段入口的 Blocker 候选，复核旧关系，再逐个搜索。新建 Blocker 不加入已经固定的普通候选，内容仍可明确调用即时 search／acquire。

search 固定入口按距离稳定排序的目标，同距保留 Unit 登记顺序；每次 acquire 重读资格、归属与容量。Hook 增容可让后续候选在同次搜索取得，减容可使其失败；新增单位不加入候选。普通阶段不循环全场到收敛。

Change 的局部后继在操作返回前完成；读取任意 Battle 事实的 Restriction 不意味着每次写入自动全场维护。间接变化在下一检查点反映，需要同步的业务显式调用完整关系操作。

## 状态与关系身份

构造时 Blocker／Blockable 互斥，也可都没有；能力组成不推导阵营、自身空地身份或 Route／Locomotion。

Blocker 按建立顺序保存 relations，Blockable 保存唯一 relation。每次取得创建一个不可变 Relation，含两端 Typed Ref，两端及查询／Hook 共享该对象；解除重建产生新对象。旧候选按对象身份确认，不重建端点投影充当关系。

Blockable.adjustment 保存起点、终点与开始 Tick；无关系而仍有计划是合法状态。关系和计划只能由所属完整操作修改，普通 Unit 发布不补齐双端或派发通知。

容量贡献使用 ADD／ZERO：先选有效来源，任一有效 ZERO 将容量归零，否则基础容量累加 ADD、取偶舍入并截到非负。未胜出来源的 ZERO 无效。volume 为整数追加、下限一。这是项目的数值协议，不声称覆盖全部原生特殊容量规则。

## 关系资格与 Restriction

双方限制使用同一二元 Context `{ blocker, blockable }`，分别解析有效贡献后 AND 判断。限制是纯资格查询，登记所有者不改变两端角色。可选 sides 限制检查目标 Classification 的 side，不要求阻挡者具有 Classification；未登记时没有隐含敌对条件。

| 判断 | 范围 |
| --- | --- |
| 搜索入口 | 阻挡者 ACTIVE，有 Vitality 时要求存活；GROUND 根格允许阻挡，AIR 豁免地块条件。 |
| 保持关系 | 双方 ACTIVE、阻挡层匹配目标 Layer、双方限制允许；GROUND 根格仍允许阻挡。临时零 HP 不默认打断旧关系。 |
| 新取得 | 另要求双方有 Vitality 时活着、目标无归属、在接敌距离内且容量足够。 |
| 容量裁撤 | 比较总占用与容量，从关系末尾逐项解除。 |

距离只约束新取得，移动超出接敌半径不解除旧关系。没有 Layer 的 Blockable 不参与普通空地匹配。Presence 通过双方限制及主动释放表达消失，Blocking 不直接读取 Presence。

普通伤害完成 Applied 后才确认真实死亡；资源写入不自动维护关系，见 [Resource](resource.md)。

## 已确定的操作接口

acquire 失败不发布关系；成功先发布双端与新位置计划，再通知双方，最后只维护本次新 Relation。它不顺带复核其他关系或裁撤全组。

release 接受原 Relation 集合，按入口当前有效对象去重并保留输入顺序；先发布整批双端解除，再逐条通知。它不取消目标计划、搜索替代目标或维护无关关系。releaseAll 在操作入口取得当前 Blocker 的全部出向关系后使用同一批量协议。

Blockable.release（公共名 releaseBlockable）先取消自身计划，再解除当前入向关系；两者之间无回调，首个 RELEASED 已可见两项结果。

Blocker.setLayer 的真实变化先发布 layer／radius，Settlement 再释放当时全部出向关系；同层请求无变更。Unit 自身 Layer.setType 采用主动脱离政策，同值调用也清理关系，原生依据见[运动身份调查](../research/cases/15-locomotion-native-semantics.md)。两种层分别表达宿主身份与可阻挡目标，不能混用。

## 主动解除阻挡的空间操作

[Presence](presence.md) 和 Route 主动覆盖位置先发布新空间事实，再按稳定能力角色调用 Blockable.release／Blocker.releaseAll。Blocker 不取消原目标的独立位置计划。

组合 Change 统一发布最终字段，Settlement 仍按组合顺序执行。每次释放只承诺其操作入口固定集合在自身首个通知前清空，不承诺整个 Change 批次第一个 RELEASED 前全部旧关系已解除；较早容量后继仍可能先逐项裁撤。

## 显式关系操作与同步维护

| 来源 | 同步后继 |
| --- | --- |
| 双方 Restriction Change | 固定自身当前关系，逐条检查保持资格。 |
| Blocker 容量 Change | 对当前组按尾部裁撤，不替代资格维护。 |
| Blockable volume Change | 结算执行时当前 owner 的容量，不在通知后追随新 owner。 |
| acquire | 通知后仅复核本次关系。 |
| maintainAll／完整地块更新 | 固定入口关系，按既定顺序各检查一次资格，不裁容量。 |
| 普通位置／偏移提交 | 只改位置和计划；资格在关系检查点读取。 |

maintain 先确认同一个 Relation 仍存在，再检查当前双方；失效才释放。Hook 登记、私有状态写回和通用 Unit.replace 不自动维护 Blocking。

## 取得归属与通知时点

两端关系和站位计划在首个可重入回调前提交。其他阻挡者在 Hook 中尝试取得同一目标时读取当前归属，不需要锁或 ACQUIRING 阶段。

## 两侧通知顺序

每条通知先 Blocker、后 Blockable，不跨两方比较 Hook priority。ACQUIRED 每项执行前确认原 Relation 仍有效；Hook 解除旧关系后，外层停止旧取得的后续响应，同双方重建也不能恢复它。

RELEASED 是解除后的历史通知，不要求旧关系仍存在，允许仍登记的 ENDING 宿主响应。两端的候选及优先级在该条通知开始时一起固定，登记替换、嵌套和优先级遵守[公共 Hook](hook.md)。后续关系轮到时才采样，不提前冻结整批通知。

## 查询、Hook 与 Runtime 接入

关系查询直接返回两端保存的原对象。局部查询不扫描全场；全场查询按 Unit 和关系建立顺序汇集。端点查询返回 Typed Ref，引用不充当关系轮次身份。

Movement 先推进所有已有 Blockable 计划，再推进 Route；根据当前关系决定是否执行自主 Locomotion。阻挡不停止路线等待、即时指令或强制空间操作。真实离场、依赖保护与最终注销统一遵守 [Lifetime](lifetime.md)。

## 地块阻挡资格

GROUND 只使用一个根格：有 Occupancy 时取登记格，否则取身体所在格，再读取当前 allowsBlocking。AIR 豁免该地块条件；显式允许阻挡的高地不能被 elevation 硬判断否决。完整地块更新在发布后同步复核旧关系。

原生搜索使用 Entity.rootTile 与 Tile.isMeleeBlockable；后者先看显式 tile_blockable，无配置才按高度回退。项目以 Occupancy 表达登记角色根格，无登记对象回退身体格，并将地块条件用于关系保持；后两者属于项目政策。原件见[阻挡调查](../research/evidence/blocking-native-20261023/report.txt)。

射击台的禁挡来自具体内容：Support 配对时向乘员登记平台独占限制，仅禁止 GROUND；解除配对只移除自身登记，不改变地块 allowsBlocking。AIR 继续由其他规则判断，见 [Occupancy](occupancy.md)。

## 阻挡层与其他领域的边界

目标 Layer 表示当前空地身份，blocker.layer 表示可阻挡目标层；Route Plan.motionMode 表示寻路方式；禁挡由二元限制表达。它们不互相推导，详见[原生模式调查](../research/evidence/blocking-native-20261023/modes/report.txt)。

[蒂比与空中阻挡研究](../research/cases/21-tippi-air-blocking.md)确认自身 WALK、阻挡 AIR、对地规避可以独立存在。普通空中阻挡默认半径 0.8944，可由 Definition 显式覆盖；角色起降及运行时半径倍率仍按实际内容接入。

## 站位计算与位置推进

取得站位先以目标与 Blocker 的真实位置计算径向间距：不足 0.5 时推至最小间距，近零向量不制造方向。0.5 是站位间距，不是接敌半径或 Hitbox 尺寸。

前序目标使用仍有关系时的 `adjustment.to ?? position` 稳定位置。径向位置与已有点距离平方不足 0.01 时做分散：距离不足 0.1 使用相对阻挡者的顺时针垂线，0.1–0.4 使用分离方向加权贡献，达到 0.4 不贡献；最终以归一化分散方向的 0.2 修正方向并保留径向距离。

新计划从当前真实位置建立并覆盖旧计划，按 0.2 秒（30 Hz 下六 Tick）线性推进；完成清除计划，不改关系。Unit.position 是唯一真实坐标，不另存 Tween、位置进度或速度。普通释放、容量裁撤和 Blocker 离场保留目标计划；目标自身主动脱离／覆盖位置／离场取消计划。

Movement 两遍推进各项接续最新状态，不承诺所有偏移一次原子发布。即使没有 Route，Blockable 仍推进计划；计划完成本身不阻止随后按当前关系与移动资格推进。时序及取消依据见[位置修正研究](../research/cases/22-block-positioning-and-interruption.md)。

## 支持边界

特殊层豁免、运行时半径倍率、Trap／GiantTrap 特殊几何与浮空区块内容尚未完整接入。当前接口和已有 Definition 覆盖不表示这些真实机制已完成，统一缺口见 [Tactical 语义](tactical-semantics.md)。

## 与原生的差异及对照验收

原生普通搜索按起始容量预选名单，并与对象移动交错；项目采用 Movement 后固定阶段、固定候选和逐次当前容量。增容可能更早接敌，也可能改变归属、攻击机会与漏怪，不预先断言只是微小帧差。该阶段与容量政策是明确项目选择，见[原生时序](../research/evidence/blocking-timing-native-20261023/report.txt)。

验收按[统一清单](verification.md)覆盖双端发布、旧身份、批量释放、容量裁撤、站位与独立计划，不按每个回调排列建立矩阵。

## 满阻挡筛选与关系引起的容量变化

大君之触／大君之赐使阻挡者容量增加，同类最多六层；容量贡献与目标占用是独立事实，不能将 volume 改零代替。项目的实时容量只允许后续既有候选重新尝试，不绕过当前容量前提。

大君之触／赐的实际增容要等目标已有阻挡者才生效。其普通原生搜索和关系取得入口均先检查可用容量，满员时无法凭目标自己的增容取得它。 [实际关系取得与增容](../research/cases/22-block-positioning-and-interruption.md#大君之触与大君之赐的阻挡增容) · [Tactical 语义](tactical-semantics.md)
