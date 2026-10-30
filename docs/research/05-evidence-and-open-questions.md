# 证据登记与下一轮研究问题

初始核查日期：2026-10-08；证据导航整理：2026-10-31。此文件记录来源和未决行为，不是实现批次清单；导航整理不等同于本次重新执行历史取证。

研究遵循[模拟原则](00-INDEX.md)：保证项目自身确定性与重要玩法语义，不追求官方 RNG 消费轨迹、同 seed 结果或内部实现一致。帧率与微时序允许近似；每个待核对问题需要说明是否可能改变重要离散结果、产生可察觉差异或累积显著数值偏差。只有发生时点不同、没有上述影响的实现细节不列为设计前置。

## 1. 不同来源不能互相替代

| 来源 | 本轮用途 | 限制 |
| --- | --- | --- |
| 已安装官方客户端 DLL／metadata | 字段、方法、原生调用顺序、条件和数值路径 | 本轮静态核查；许多方法有 Lua 热更新入口，没有确认运行现场覆盖 |
| 同客户端 Unity prefab／Buff 模板 | 组件绑定、实际选择、参数 key、动作顺序、覆盖／周期／生命周期描述 | 字段存在不证明该内容在目标模式可达；必须确认实际引用与选择 |
| 原始关卡／角色／技能数据的镜像快照 | 关卡引用、skillIndex、override、路线及黑板 | 原文件镜像的提交号未完整保留；不能自动与安装客户端清单绑定为同一版本 |
| 仓库 [data](../../data) | 当前项目内容集合与整理输出 | 部分字段经过解释、裁剪、假设或项目政策处理；不是原始描述语言本身 |
| [已有 research](../../external/upstream/docs/research/00-INDEX.md) | 研究线索、内容范围、交叉核对 | 包含旧赛季、ASSUMED 条目和互相修订的说明；逐条核查，不整篇继承“已验证”标签 |
| [当前 TS](../../src/core) | 实现能力、限制与确定性约定 | 代码及测试只证明本项目行为，不能单独证明官方正确性 |

`Kengxxiao/ArknightsGameData` 是客户端数据的第三方镜像，不是官方文档。旧研究把它写为“Official”时，本文只继承其数据来源线索；不会继承这个可信度标签。

## 2. 本机客户端定位信息

本节保留初始客户端的定位信息；后续批次各自记录输入指纹和资源版本，不能将下表当作现行客户端版本声明。

客户端根目录：`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。

| 材料 | 定位 |
| --- | --- |
| 原生程序 | `GameAssembly.dll` |
| IL2CPP metadata | `Arknights_Data/il2cpp_data/Metadata/global-metadata.dat` |
| Unity bundle 根 | `Arknights_Data/StreamingAssets/AB/Windows/` |
| 资源清单 | 上述目录 `hot_update_list.json` |
| 清单版本 | `versionId=26-08-16-14-00-43_415873`，`manifestVersion=V077` |
| Unity | 已解码文件记录为 `2021.3.39f1` |

清单版本不等于程序版本，也不证明 Lua 在运行现场未被替换。程序、metadata 与清单的 SHA-256 记录于 [持久证据摘录](evidence/client-excerpts-20261007/records.json)。

2026-10-13 的[天赋调查](cases/06-talent-lifecycle-and-model.md)核对到当前 DLL／metadata 已与上述旧摘录的指纹不同。新方法定位和输入哈希单独保存在[本轮天赋证据](evidence/talent-lifecycle-20261013/records.json)，不混用两轮的方法索引或地址。

初始 `client-excerpts` 记录还保存了少量方法定位、残影 Buff 描述、有序动作摘录，以及 Aura／GlobalBuff 分发调用和字段投影。它是字段投影：未列字段不能理解为不存在；方法列表也不是完整反汇编。

## 3. 持久证据与复现入口

完整导航见[证据批次索引](evidence/README.md)。每批次的 README 说明输入指纹、文件用途、实际命令和可复现范围，`archive.json` 以 `provenance`／`result` 区分来源与归档内容。原始摘录保留原样，新的工具输出写到独立工作目录，不覆盖历史记录。

| 主题 | 持久材料 | 复查范围与缺口 |
| --- | --- | --- |
| 时间与帧推进 | [初始客户端摘录](evidence/client-excerpts-20261007/README.md)、[Blocking 推进时序](evidence/blocking-timing-native-20261023/README.md) | 所选 BattleController／对象推进方法、逻辑时间与调用锚点；初始完整报告未归档，两轮方法索引不能混用。 |
| 波次、分支与出生 | [初始客户端摘录](evidence/client-excerpts-20261007/README.md)、[范围与战斗流程](01-scope-and-battle-flow.md) | 初始批次登记输入，Scheduler 所选方法、出生队列与字段锚点保留在正文；没有保存当时所有原生转储及提取脚本。 |
| 伤害、属性、元素与 Buff | [初始摘录](evidence/client-excerpts-20261007/README.md)、[Damage Apply](evidence/damage-apply-20261017/README.md)、[HP Application 组合](evidence/hp-application-combinations-20261017/README.md) | 所选公式、接收／HP 分支及模板；后续补查不能自动补证早期所有路径。 |
| 内容程序顺序、安装与嵌套 | [初始摘录](evidence/client-excerpts-20261007/README.md)、[案例 A](cases/01-buff-installation-and-parent-scope.md)、[案例 B](cases/02-action-and-projectile-phases.md)、[案例 C](cases/03-dispatch-and-nested-settlement.md) | 模板 ID、组件 PathID、方法／VA 与短轨迹仍在；早期完整模板与一次性解码脚本未入仓。 |
| Action 与 Skill | [行动时间](evidence/action-timing-20261014/README.md)、[启动与中断](evidence/action-eligibility-and-interruption-20261014/README.md)、[Skill 生命周期](evidence/skill-lifecycle-20261013/README.md)、[SP 公式](evidence/sp-calculation-20261015/README.md) | 所选元数据、指令、参数和样例；资源专用解码及运行时 XLua 的限制见各批次。 |
| 阻挡与空间资格 | [Blocking 关系](evidence/blocking-lifecycle-20261010/README.md)、[Blocking 原生分支](evidence/blocking-native-20261023/README.md)、[Effect 索敌与免疫](evidence/effect-immunity-20261021/README.md) | 定向资格、关系取得／维持、模式／半径与选择／施加分支；没有穷尽全部 selector、Collider 和特化内容。 |
| 光环与全局分发 | [初始客户端摘录](evidence/client-excerpts-20261007/README.md)、[空间研究第 9 节](03-space-units-and-mechanisms.md#9-非空间机制与范围贡献) | Aura／GlobalBuff 调用与字段投影；完整旧报告、全量可达内容和活跃热更新未归档／验证。 |
| 设备与部署 | [空间研究第 11 节](03-space-units-and-mechanisms.md#11-可复查证据入口)、[初始客户端摘录](evidence/client-excerpts-20261007/README.md) | 现有 fixture 与正文保存工事、平台、深水的所选字段／引用；没有归档旧部署／预置报告全文。 |
| Route／Navigation／运动 | [导航原生算法](evidence/navigation-native-20261018/README.md)、[路线时序](evidence/route-movement-20261018/README.md)、[路线字段](evidence/route-fields-20261019/README.md)、[Locomotion](evidence/locomotion-native-20261019/README.md) | 所选原生方法与仿真／配置结果；专用仿真的 stub 和完整外部输入能否重建，以各批次保存情况为准。 |
| 投射物来源、运动与终止 | [运动与命中](evidence/projectile-boundaries-20261021/README.md)、[停止与终结](evidence/projectile-stop-20261021/README.md)、[来源与目标生命周期](evidence/projectile-lifecycle-20261021/README.md) | 原生路径、指针身份、内容投影与结束顺序；不代替运行时热更新或所有特化投射物验证。 |

历史的一次性报告和目录名称只说明当时分析环境，不能充当当前可执行入口。当前复查采用批次 README 的共享工具命令，先核对输入，再生成新的输出；指纹不符时不能照搬旧索引。早期船运扩展属于已排除范围，不能因旧地图报告提到它就恢复为本项目需求。

## 4. 已纠正的历史推断

| 历史推断 | 本轮结论 |
| --- | --- |
| 平台／障碍名称足以推出不可通行 | achplat 真实 mode 保持通行并提高 WALK 搜索成本；高度、部署、阻挡另判 |
| 地块有 MIRE／DEEPSEA 参数就已实现地形 Buff | 当前 core 保存所选参数，没有地形 Buff 执行；移速、攻速、周期伤害与进入／退出生命周期均未闭环 |
| 地图包含某 controller 就必定执行同名效果 | `trap_1112_acblzd` 的实际 override 可选 `sktok_empty`；还要追踪模式激活链 |
| 本机所有卫戍战斗精确 30 Hz | 官方原生默认约 30 Hz，特定领袖步进约 20 Hz；项目固定 30 tick/s 是选择 |
| 维什戴尔残影是伤害成功后的标记 | projectile 命中流程先附着，再运行伤害动作；伤害取消不自动证明没有标记 |
| 官方 Dice 先于纯条件检查，所以项目也必须按此消费 RNG | 来源顺序不自动成为契约；保持概率、条件依赖与后续行为即可，未影响语义的抽样可以省略 |
| 持续效果都随来源 Unit 生命周期结束 | 来源、父 Buff 作用域、覆盖来源和触发匹配是不同关系 |
| 高阶函数能替代所有状态与依赖管理 | 函数只承担行为；层数、期限、顺序、父子结束及派生失效仍需明确事实与契约 |
| 所有全局贡献都可复制进每个 Unit | 接收者贡献属于对应 Capability；全局额度、周期及源到接收实例的安装关联需独立作用域 |
| 光环安装关联只是当前范围查询的缓存 | 接收实例身份、采样值、层数和退出后继依赖已发生的安装；几何候选可以重建，安装过程事实不能仅由当前几何恢复 |
| `env_gbuff_new_with_verify` 表示同一种持续数值光环 | 具体 key 可以组织持续分发、开局选择或全局事件；同一入口名不能决定内容协议 |

## 5. 第一轮案例已确认的协议

完整轨迹与推导限度见[案例索引](cases/00-INDEX.md)，交叉结论见[协议归纳](cases/04-protocol-conclusions.md)。下表只登记已经缩小的 unknown，不把静态证据写成完整实战兼容。

| 主题 | 已确认的区分 | 证据／样例 |
| --- | --- | --- |
| 安装与资格 | 对已初始化目标，登记、开始动作与启用分别发生；UID 查询与有效 key 查询不同；拒绝不自动回滚开始动作 | Case A 的 NewBuff、UNIQUE 残影安装 |
| 父作用域与结束 | 来源仍在场时父 Buff 可以结束，子同步失效；失效与 ON_FINISH／移除／回收分别处理 | Case A 的残影父实例；派生绑定参数只影响绑定时父已结束的分支 |
| 来源属性采样 | 鼓舞按配置触发检查并重建采样贡献，不随每次属性查询重读来源 | Case A 的本季斯卡蒂 S3，triggerInterval=1.0 |
| 行动／命中与读值 | 启动输入、释放目标、contact 名单不同；普通弹道与 cachedAtkOnly 路径的 ATK 读取不同；行动结束不自动结束已发射弹道 | Case B 的普通远程攻击与 S3 对照；该角色是池外协议压力样例 |
| 派发候选与事实 | 同一 Buff 集合的未退出枚举共享候选身份，按 key 查询也使用该范围；UID 查询读取当前登记；有效性实时检查，另一容器独立管理候选 | Case C 的事件／查询枚举入口与 UID map 路径 |
| 同步嵌套接收 | 分担先完成独立 PURE／skip 接收，再返回外层缩放；skip 政策不等同真伤类别 | Case C 的 DamageSplit 与 ApplyModifier；S1 分担是非默认技能对照 |
| 取消与后继 | 单次伤害取消仍可执行回复、盾消耗与结束；已进入内容列表不因实例失效自动全部停止 | Case C 的本季泥岩护盾与动作执行器 |
| 光环与接收者 | 常规进入安装接收端 Buff，退出是否撤销由配置决定；来源保存目标到接收实例关联 | AuraAbility 90904／90905、TargetMeta.buffIds；GlobalAuraAbility 91076／91073 |
| 全局后加入与清理 | 普通 GlobalBuff 在 RegisterUnit 尝试补施加；全局移除按 receiver Buff UID 清理；当前单位补施加有专门创建入口 | RegisterUnit 64099、CreateAndAttachAllUnitGlobalBuff 64218、GlobalBuff 66773／66775 |

这些结论确定可观察的局部顺序，不要求每一步对外发布 Battlefield；当前整 tick 成功后权威发布的选择保留。异步执行进度、采样结果与父关联是运行事实；仅在同步调用内存在的派发候选与上下文可以由本次执行持有。

## 6. 需要继续核对的具体问题

“已证实缺项”和“尚不能定论”分开列出。以下问题影响契约，但现在不据此造最终 API。

| 问题 | 已知事实 | 尚需核对的行为／样例 |
| --- | --- | --- |
| Buff 安装与有效性 | Case A 已确认初始化后普通安装及 UNIQUE 拒绝；存在多种 override、有效层数和周期规则 | 未初始化目标的开始入口；叠层定时、激活／暂停、沉默／免疫与动态 priority 的完整相互作用 |
| 父子 Buff 结束 | Case A 已确认父结束同步禁用已绑定子，结束动作另有时点 | 父暂停、覆盖、更换、来源退场、子先结束时的区别；复杂结束连锁与重入 |
| 属性采样 | 四项代数与本季 S3 鼓舞的触发采样已核对；Case B 区分两种 ATK 策略 | 其他操作数与攻击模式的采样政策；maxHp 改变时 HP 保持或比例规则；多鼓舞竞争 |
| 光环成员与安装绑定 | 常规 Aura 按配置安装／撤销接收实例；GlobalAura 有目标更新与出生事件路径 | 具体 prefab 的刷新频率、进入／离开动作、覆盖／暂停、接收者先结束与来源结束；恢复后不能重复触发已完成的安装 |
| 全局效果与共享状态 | 普通 GlobalBuff 已确认注册补施加、目标到 Buff UID 关联和移除清理；数据描述存在共享复活额度 | autochess Lua 的额度作用域、消耗时点、动态资格与刷新；同名配置入口下的一次采样和持续规则不可混同 |
| 静态预处理与持续贡献 | CAttributesMul.DoPreprocessChar 84345 调用 ApplyChangesToAttributesMul，直接转换预处理参数 | `char_attribute_mul` runeKey 到该类的注册绑定尚未独立闭合；不能按 key 猜定所有持续／预处理乘区 |
| 行动阶段与命中 | Case B 已确认前摇后目标更新、在途独立性、contact 顺序与有限清弹路径 | 取消与释放同 tick 的顺序；死亡／撤退到引用失效的路径；目标失效时落点、弹药消耗与模式切换 |
| 嵌套反应与派发修改 | Case C 已确认同集合候选作用域、逐候选资格、同步分担与泥岩取消后继 | 其他事件／接收入口的差异；死亡状态机移除；外层持有已结束目标时的后继资格；结束动作连锁 |
| 治疗／再生 | 目标医疗资格与生命回复接收不是同一件事 | 非医疗直接回复、持续再生、来源缺失、治疗增益与触发统计的准确范围 |
| 元素损伤 | EPController 与普通 HP 伤害分离；容量、类型、抵抗和爆发存在独立规则 | 按本季干员／敌人实际引用核对各元素积累、爆发与恢复、医疗和表现条件 |
| 地形与空间机制 | 控制器选择和部分黑板数值已核对 | 沼泽层数离开后的撤销／恢复、深水阶段切换、环境伤害归属与技能免疫路径 |
| 恐惧／诱导／外力 | 本季有引用；临时路线与刚体位移不同 | 路线生成、控制解除、暂停规则、失衡与推拉完整算法；允许实现靠后，不从支持范围删除 |
| 领袖／联合防御 | 外层阶段、共享血池与限伤等有已有研究 | 共享生命接收端、反应归属、跨场保留／重建与胜负反馈完整映射 |
| 帧率与微时序近似 | 官方对象按 priority／instanceUid 更新，普通既有敌人通常先于后来创建的弹体位移；项目接受固定 30 tick/s 与 `Combat → Projectile → Movement` | 只在具体内容显示重复／漏失命中、重要目标或触发次数改变、胜负变化或显著累计偏差时追加核查；不以一 tick 偏移本身要求改变阶段顺序或复制对象队列 |
| 整季内容覆盖 | 当前有选定原始样本、整理集合与部分 prefab | 全部选定技能／模块／装备／羁绊／敌人／设备的引用闭包，不把词条文本当执行证明 |

## 7. 下一轮研究的优先顺序

前三项已形成第一轮案例结论，可以据此讨论持续实例生命周期、可恢复执行事实和局部调用上下文。剩余分支只在具体支持内容需要时补齐；不必等待所有 override、所有投射物或所有原生事件穷尽后再设计。

下一轮先用已有证据充分的三个案例验收调用协议，再扩大领域范围：

1. 本季斯卡蒂 S3：验证贡献分属接收端 Capability、来源采样、更新／撤销与安装关联恢复；多鼓舞竞争和范围刷新仍按具体缺口补证。
2. 本季泥岩盾：验证当前工作事实、伤害取消后回复与消耗、同步嵌套及实例失效／结束的区别，保留已确认的候选作用域。
3. 全局共享计数：沿埃芒加德 `act1autochess_band28_buff` 的实际 Lua／prefab 激活链核对一次共享额度的作用域与消耗时点，再验证普通全局后加入单位和来源清理。数据已证明描述与参数，额度内部实现尚未确认。

这三项优先回答“事实由谁持有、源到接收者如何关联、operation 返回后外层可见什么”，不先造统一 Attributes 或通用全局 HookBus。治疗／再生与 EP 随后验证 query、接收政策、积累／恢复及触发后继；地形控制器和工事／平台切换再验证跨领域协作。最后扩展本季内容引用闭包及联合防御／领袖状态衔接。恐惧、诱导与完整推拉可按既有偏好靠后。

每项研究以一条具体引用链和至少一个可区分语义的例子结束：触发、读值、状态变化、后继、退出。下一轮设计据此选择共同协议，不通过先建万能接口来掩盖尚未核对的行为。

随机机制核查概率、选择集合、重复／关联和条件依赖。官方概率 0／1 是否消耗随机数、失败条件之前是否存在无效抽样，以及仅导致后续随机序列偏移的内部调用顺序，均不作为研究前置。
