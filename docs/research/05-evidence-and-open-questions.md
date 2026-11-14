# 证据登记与待核对事项

初始核查日期：2026-10-08；必要语义审计补核：2026-11-10；覆盖组与到期补核：2026-11-11；HP 资源与机制目录补核：2026-11-13。此文件记录来源和未决行为；历史批次与当前补证分别解释，导航整理不等同于重新执行历史取证。

研究遵循[模拟原则](00-INDEX.md)：保证项目自身确定性与重要玩法语义，不追求官方 RNG 消费轨迹、同 seed 结果或内部实现一致。帧率与微时序允许近似；每个待核对问题需要说明是否可能改变重要离散结果、产生可察觉差异或累积显著数值偏差。只有发生时点不同、没有上述影响的实现细节不列为设计前置。

## 本次 Unit 审计的补核结果

测试清理与原生调查分开进行。`93361c8` 删除／归并重复测试并简化断言，执行用例由 204 减到 191，全部通过；没有因此将未闭合行为认定为正确。必要测试仍按[验收原则](../architecture/verification.md)选择，发现相反证据后应先修正语义，再调整对应代表场景。

| 补核问题 | 结果与集中记录 |
| --- | --- |
| 原始 Attribute、Buff 合并与覆盖组 | 黑板缺值／显式 0、层数与 scaler 顺序、source 转槽、实际／有效层数、五类普通合并、priority／UID 选胜均有直接分支；[Case 01 §8](cases/01-buff-installation-and-parent-scope.md#8-2026-11-10-补核属性-descriptor合并与覆盖组)。 |
| 覆盖组身份与 STACK 到期 | 基础键、Character.cardUid 独立键与无 Character 回退、disableOverride 联用、组政策重置，以及到期减层／实例清层标记、结束扫描和下一帧回收已闭合；[Case 01 §9](cases/01-buff-installation-and-parent-scope.md#9-2026-11-11-补核覆盖组身份与-stack-到期)。配置、原生分支和实战观测分别说明。 |
| 来源身份的生成与重部署 | cardUid 来自转换阶段形成的 BattleCharacterData.uniqueId，Card getter 转读它，普通部署写入 Character；普通退场返回原卡并在再次部署沿用该值。AutoChess 普通加载为同名棋子逐份转换并生成不同 cardUid。[Case 24 第十三节](cases/24-deployment-cost-and-supply.md#十三carduid-的生成与普通重部署2026-11-11)。普通重部署保留的结论不扩推到新建卡、TokenCard 或特殊移动，也不要求项目 Effect 通用依赖 Card。 |
| 装置的 Character 来源资格 | 当前原生继承链为 Trap → Token → Character，装置也满足 independentCharacterSource 的 Character 判断；TokenCard 部署从 Card.data.uniqueId 写入 Character.cardUid。[Case 01 §9.7](cases/01-buff-installation-and-parent-scope.md#97-character-包含召唤物与装置)。不因此扩推全部预置、特殊创建或多库存回收政策。 |
| 无 Card 的预放置干员 | 普通 characterInsts 直接创建 Character；卡牌注入只取独立的 characterCards 数组。没有 Card 的预放干员仍从角色数据取得 cardUid，属于 Character 独立来源分组，不等于非 Character 回退。[Case 01 §9.8](cases/01-buff-installation-and-parent-scope.md#98-无-card-的预放置干员)。没有据此增加项目身份协议。 |
| 分组简化的实际内容影响 | 已核对浊蒂／海嗣、帕拉斯 S3、妮芙、vampir 光照计数及次生预案标记的真实来源，未找到实际结果改变正例。已确认为 [Effect 来源分组](../architecture/effect.md#来源分组)项目契约，Core 已接入；完整扫描范围与证据限度见 [Case 01 §9.9](cases/01-buff-installation-and-parent-scope.md#99-分组简化的实际内容影响)。 |
| 控制效果与普通多目标攻击 | 标准 stun 的资格／中断与真实多目标逐目标读取 ATK 分别核对；[Case 08](cases/08-action-eligibility-and-interruption.md)、[Case 07](cases/07-action-timing-and-animation.md)。不推广到预采样弹道或所有特化技能。 |
| 地形与射击台 | 重新核对配置、模板及消费链，包含当前实现的相反证据；[空间研究](03-space-units-and-mechanisms.md)。 |
| 坐标、数值范围与运动 | 当前 World→Tile 取偶舍入、属性元数据／最终限幅和公式保底已分开核对；[Case 15](cases/15-locomotion-native-semantics.md)、[属性研究](02-combat-buffs-and-effects.md)。避障每次实际积分重算是已确定的项目选择；身体／locator 定位基准差异单独核对。 |
| Schedule 配置限制 | Pack 和交错 Branch 随机组有实际配置，原生归组消费也不要求连续；[Case 30](cases/30-scheduler-action-data-fields.md)。解析器拒绝属于当前支持范围，不能当作原生禁止。 |
| 干员配置 | 等级／信赖字段写回、模组单阶段完整加值和真实字符串黑板正例；[Case 06](cases/06-talent-lifecycle-and-model.md#干员配置数据补核2026-11-10)。 |

烟雾、活性源石入格与候补、等级／信赖整数字段写回、元素抗性范围与公式保底已按本次证据修正；必要语义与原有代表测试分别归入架构文档。

EXTEND 的 snapshot 不等于重载属性 modifier；实际 Effect 接入仍需保持这一区别。此前仅测试消费的 Data planner 已删除，不能把其算法作为原生机制或运行接入依据。

尚需收口的是具体支持或映射政策：Locomotion 的身体／locator 与脚点定位基准差异；地穴的原生 Enemy 类型资格如何映射到项目内容。避障在每次实际积分时重算、取消三次调用更新周期的政策已经确定，不属于待决项。Effect 的来源分组、重复施加与计时已接入 Core，契约见 [Effect](../architecture/effect.md)。其中先决定重复施加结果、仅新建分支执行安装程序属于明确的项目选择；原生安装与合并顺序仍按 Case 01 记录。

仍需补的具体内容证据包括：受支持普通内容中的 EXTEND+snapshot 完整执行正例，RO5 交错随机组示例中条件 Buff 的完整安装来源，以及 [Case 01 §9.5](cases/01-buff-installation-and-parent-scope.md#95-实际配置与范围) 注明的有限 STACK 非零时长绑定。妮芙父天赋来源已由标准安装链闭合，见 9.9。模板、条件分支与关卡覆盖已归档，未将它们冒充实战观测；也不因此否定已直接核实的普通分支。

## HP 资源路径与机制目录补核

- [案例 29](cases/29-hp-and-ep-healing-settlement.md#5-skip生命复原与自然回复)闭合普通自然 HP 回复：有效属性、正速率门控、单点周期计时、速率改变、满血与 HP setter 通知。它不经过普通治疗 Modifier；也没有把负速率当作生命流失的分支。原生每 1 HP 脉冲是机制事实，不自动成为项目推进政策。
- [案例 11](cases/11-damage-apply-and-hp-application.md)补查生命流失的实际内容、公式、skip 接收及 HP 提交。数学类别与事件参与分别判断，不能将流失统一简化为跳过防御的 HP 负增量，也不能把 skip 理解为绕过所有生命保护。
- [案例 34](cases/34-prts-mechanism-coverage-audit.md)按 PRTS 目录与代表机制比较公共需求，区分新发现、已有延期和可以由内容组合的能力。具体干员／Effect 未接入不单独算 Core 缺口；目录覆盖也不是全客户端完整性证明。

仍在场的 Unit 只解除当前 Wave 等待、保留最终等待，现已由 Schedule.releaseFromWave 提供。不能由当前速度、位置或部署四向还原的持久面向由 [Facing](../architecture/capability.md#facing) 保存，移动、既有攻击和眩晕已接入；原生资格、调用时点和内容绑定见[案例35](cases/35-facing-and-turning-conditions.md)。HP Damage 的 [APPLIED.killed](../architecture/vitality.md#34-单笔击杀结果)报告本笔确认的击杀，归属沿用 request.source，由 Content 使用单笔结果；原生独立击杀来源的传递仍未闭合，证据范围见案例34。Damage 的攻击分类、途径、取消权限及属性范围覆写属于既有缺口的细化，不是新建一批子系统的依据。

本轮只补机制证据和实现对照，不修改 Core。Calculate／Apply 划分、死亡通知顺序、自然回复不派发普通 Healing Hook、避障每次积分重算等已确认项目选择保持不变。

## 尚未完成整体审计的范围

Unit、其 Capability 及对应 Battle／Battlefield 协作已逐项审查；上述依据或映射缺口保留，不能概括为全部闭合。公共 Hook、Lifetime、Typed Ref、Change 等已有集中契约测试，不因新增消费者重复审计或展开矩阵。

| 范围 | 已做与未做的边界 |
| --- | --- |
| Projectile 整体领域 | 已研究命中、来源／目标生命周期并检查 Unit 接入；完整创建、运动、停止、回收与各种内容接口尚未按本轮标准整体复审。 |
| Mechanism 独立领域 | Unit 离场通知和 Lifetime 协作已检查；自身启停、推进、创建和内容政策尚未整体审计。 |
| Data 全层 | Route／Schedule 和部分干员转换已定向核对；敌人／干员、原始 Buff、装备与其余转换器的完整支持范围、校验及输出接口尚未整体审计。 |
| 具体 Content 与通用效果库 | 已核对接入代表和本次控制／地形短链；其余 Action／Skill 模板、干员、敌人、装置及通用效果参数没有逐项完成内容语义审计。 |
| Legacy／表现适配 | Event 必要输出和快照契约已收紧；旧输入适配、动画提示、界面数据协议没有完成整体审计。 |

移动再部署、特殊生命干预和完整战斗统计等延期设计不等同于现有代码漏审；继续按对应需求单独推进，不在本次测试清理中预建框架。

## 1. 不同来源不能互相替代

| 来源 | 本轮用途 | 限制 |
| --- | --- | --- |
| 已安装官方客户端 DLL／metadata | 字段、方法、原生调用顺序、条件和数值路径 | 本轮静态核查；许多方法有 Lua 热更新入口，没有确认运行现场覆盖 |
| 同客户端 Unity prefab／Buff 模板 | 组件绑定、实际选择、参数 key、动作顺序、覆盖／周期／生命周期描述 | 字段存在不证明该内容在目标模式可达；必须确认实际引用与选择 |
| 原始关卡／角色／技能数据的镜像快照 | 关卡引用、skillIndex、override、路线及黑板 | 原文件镜像的提交号未完整保留；不能自动与安装客户端清单绑定为同一版本 |
| 仓库 [Data 转换实现](../../src/data) | 核对当前静态转换的输入解释与支持范围 | 项目实现及转换结果不是原始资料本身，也不能证明原生运行行为 |
| 早期外部研究（当前仓库未保留） | 历史线索 | 不作为当前可复查证据，不继承其“已验证”标签；必要结论回到已归档原件或重新取证 |
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
| 地块有 MIRE／DEEPSEA 参数就已实现地形 Buff | 配置存在不能证明运行执行；当前原生短链与项目差异见空间研究第 5.1 节 |
| 地图包含某 controller 就必定执行同名效果 | `trap_1112_acblzd` 的实际 override 可选 `sktok_empty`；还要追踪模式激活链 |
| 本机所有卫戍战斗精确 30 Hz | 官方原生默认约 30 Hz，特定领袖步进约 20 Hz；项目固定 30 tick/s 是选择 |
| 维什戴尔残影是伤害成功后的标记 | projectile 命中流程先附着，再运行伤害动作；伤害取消不自动证明没有标记 |
| 官方 Dice 先于纯条件检查，所以项目也必须按此消费 RNG | 来源顺序不自动成为契约；保持概率、条件依赖与后续行为即可，未影响语义的抽样可以省略 |
| 持续效果都随来源 Unit 生命周期结束 | 来源、父 Buff 作用域、覆盖来源和触发匹配是不同关系 |
| 高阶函数能替代所有状态与依赖管理 | 函数只承担行为；层数、期限、顺序、父子结束及派生失效仍需明确事实与契约 |
| 所有全局贡献都可复制进每个 Unit | 接收者贡献属于对应 Capability；全局额度、周期及源到接收实例的安装关联需独立作用域 |
| 光环安装关联只是当前范围查询的缓存 | 接收实例身份、采样值、层数和退出后继依赖已发生的安装；几何候选可以重建，安装过程事实不能仅由当前几何恢复 |
| `env_gbuff_new_with_verify` 表示同一种持续数值光环 | 具体 key 可以组织持续分发、开局选择或全局事件；同一入口名不能决定内容协议 |

## 5. 首轮案例提取的协议事实

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

这些事实限定在各自取证批次。它们说明长期进度、采样结果和安装关联需要明确所有者，不要求复制原生类、候选队列或事件顺序；当前项目契约以架构文档和已确认的选择为准。

## 6. 其余内容研究的具体入口

以下属于尚未整体审计的 Content／机制，不作为 Unit 公共契约的新前置，也不重新调查已经确认的 MaxHP、EP、治疗或 Route 基础语义。

| 入口 | 仍需按具体内容核实的部分 |
| --- | --- |
| 多源光环与鼓舞 | 具体模板的刷新、竞争和源到接收实例的清理；普通队列算法已由 Case 01 §8 闭合，不重复泛查。 |
| 全局共享复活额度 | 埃芒加德 `act1autochess_band28_buff` 的实际安装链、额度作用域、消耗与刷新；描述和参数不能替代执行证据。 |
| 静态预处理 | `char_attribute_mul` 的 runeKey 注册与 `CAttributesMul` 消费绑定；不凭名称决定所有属性乘区。 |
| 特殊 Action／Skill／Projectile | 具体技能取消、耗弹、缓存和目标失效后的内容后继；普通多目标 ATK 结论不统一这些政策。 |
| 外力与复杂战斗内容 | 完整推拉／失衡、共享生命和跨场事实；恐惧／诱导／Trace 的 Route 公共组织已有 Case 13、31、32，不列为全新缺口。 |

研究以实际需要的调用链和可区分行为结束。没有玩法影响的对象更新微相位、官方同 seed 轨迹和无效抽样顺序不增加验收义务；已有固定 Tick 与领域边界不因本次补证重新表决。
