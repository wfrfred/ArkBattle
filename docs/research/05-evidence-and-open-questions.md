# 证据来源与未决项

各批次记录自己的来源版本、选择范围和复现限制。本文只维护研究入口；机制结论在案例中更新，项目契约在[架构文档](../architecture/ARCHITECTURE.md)维护。

## 1. 不同来源不能互相替代

| 来源 | 本轮用途 | 限制 |
| --- | --- | --- |
| 已安装官方客户端 DLL／metadata | 字段、方法、原生调用顺序、条件和数值路径 | 本轮静态核查；许多方法有 Lua 热更新入口，没有确认运行现场覆盖 |
| 同客户端 Unity prefab／Buff 模板 | 组件绑定、实际选择、参数 key、动作顺序、覆盖／周期／生命周期描述 | 字段存在不证明该内容在目标模式可达；必须确认实际引用与选择 |
| 原始关卡／角色／技能数据的镜像快照 | 关卡引用、skillIndex、override、路线及黑板 | 原文件镜像的提交号未完整保留；不能自动与安装客户端清单绑定为同一版本 |
| 早期外部研究（当前仓库未保留） | 历史线索 | 不作为当前可复查证据，不继承其“已验证”标签；必要结论回到已归档原件或重新取证 |

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
| 地块有 MIRE／DEEPSEA 参数就已实现地形 Buff | 配置存在不能证明运行执行；原生短链见空间研究第 5.1 节 |
| 地图包含某 controller 就必定执行同名效果 | `trap_1112_acblzd` 的实际 override 可选 `sktok_empty`；还要追踪模式激活链 |
| 本机所有卫戍战斗精确 30 Hz | 官方原生默认约 30 Hz，特定领袖步进约 20 Hz；项目固定 30 tick/s 是选择 |
| 维什戴尔残影是伤害成功后的标记 | projectile 命中流程先附着，再运行伤害动作；伤害取消不自动证明没有标记 |
| 官方 Dice 先于纯条件检查，所以项目也必须按此消费 RNG | 来源顺序不自动成为契约；保持概率、条件依赖与后续行为即可，未影响语义的抽样可以省略 |
| 持续效果都随来源 Unit 生命周期结束 | 来源、父 Buff 作用域、覆盖来源和触发匹配是不同关系 |
| 高阶函数能替代所有状态与依赖管理 | 函数只承担行为；层数、期限、顺序、父子结束及派生失效仍需明确事实与契约 |
| 所有全局贡献都可复制进每个 Unit | 接收者贡献属于对应 Capability；全局额度、周期及源到接收实例的安装关联需独立作用域 |
| 光环安装关联只是当前范围查询的缓存 | 接收实例身份、采样值、层数和退出后继依赖已发生的安装；几何候选可以重建，安装过程事实不能仅由当前几何恢复 |
| `env_gbuff_new_with_verify` 表示同一种持续数值光环 | 具体 key 可以组织持续分发、开局选择或全局事件；同一入口名不能决定内容协议 |

## 5. 具体未决项

未决项按原生问题维护，不以某轮代码审计或测试数量表示覆盖完成。

| 主题 | 仍需核实的范围 |
| --- | --- |
| Buff | 受支持普通内容中 EXTEND+snapshot 的完整执行正例、有限 STACK 非零时长绑定及具体 OnBuffExtend 消费者，见 [Case 01](cases/01-buff-installation-and-parent-scope.md)。 |
| Scheduler | Pack／交错随机组的条件 Buff 安装来源与特定分支真实触发链，见 [Case 30](cases/30-scheduler-action-data-fields.md)。 |
| Route／运动 | 非默认到达半径的实际内容、特殊路线操作及定位基准的覆盖范围，见 [Case 13](cases/13-route-and-movement-timing.md)、[Case 15](cases/15-locomotion-native-semantics.md)、[Case 31](cases/31-route-operations-and-state.md)。 |
| HP／EP | 全链结论及残余证据边界集中于 [Case 37](cases/37-resource-mechanism-coverage.md)，不沿用早期“生命干预／归属全部待查”的笼统清单。 |
| 单位分类 | 分类、标签预处理与动态追加的实际消费者，见 [Case 36](cases/36-unit-classification-and-combat-tags.md)。 |
| 全局共享内容 | 埃芒加德共享复活额度、卡莱莎触发／接收实例、桑葚战斗开始选择的完整安装与执行链，见[空间研究 §9](03-space-units-and-mechanisms.md#9-非空间机制与范围贡献)。 |
| 静态预处理 | char_attribute_mul 的 runeKey 注册与 CAttributesMul 消费绑定；不能只凭名称确定属性乘区。 |
| 特殊内容 | 特定 Action／Skill／Projectile 的取消、耗弹、缓存和目标失效后继，以及完整推拉／失衡、共享生命与跨场事实；已有普通路径不自动覆盖这些机制。 |

实际 Content 未接入、项目明确选择及尚无原生依据分别处理。项目实现与验收政策见[架构入口](../architecture/ARCHITECTURE.md)，研究中不维护另一份当前支持表。
