# 31 Route 操作、调用来源与状态保留

调查日期：2026-11-07。目标是从原生路线执行者及其使用者归纳实际操作需求，不从 ArkBattle 现有 Route API 倒推范围，也不把原生方法数量直接变成 Core 接口数量。创建与出生时间基准复用[案例 14 第 6 节](14-route-definition-fields.md#6-路线创建与初始化2026-11-07-补核)，Checkpoint 自身的行为复用[案例 13](13-route-and-movement-timing.md)。本案集中核对出生以后的路线修改、接管和恢复。

**证据标记：** N 为当前客户端普通静态分支；D 为固定配置或实际资源绑定；P 为 PRTS 社区描述；I 为沿已证实调用链的推导；U 为尚未闭合。静态可执行链不等于实机观测，未确认运行时 XLua。版本、完整选择器、指纹与复跑见[本批 README](../evidence/route-operations-20261107/README.md)。

## 1. 如何检查入口，而不是只搜索已知名字

本轮分四层建立发现范围：

1. 从 metadata 完整枚举 Route、Enemy、BasicCursor 的声明，并沿父类型关系枚举派生者；根清单包含 31 个类型。另枚举所有 Torappu 方法签名及字段中引用这些路线／Cursor 类型的使用者，分别得到 92 个方法签名、19 个字段所属类型。[全局清单及脚本](../evidence/route-operations-20261107/inventory.json)
2. 读取 Basic／Direction／Grid／TracePosition Cursor 的完整普通声明方法及相关 Checkpoint 实现，检查真实写入和下游虚分派，保留 22 类型的完整声明清单及 83 个精选方法正文。Checkpoint 正文复用既有调查并按本轮操作补充，不宣称重新读取所有 Checkpoint 方法。`GetNextDirection` 实际能推进 Checkpoint 并执行 `OnBegin`，说明按 Get／Set 名称分类不足以判断操作。[Cursor 原件](../evidence/route-operations-20261107/cursor/README.md)
3. 对 Enemy 全部 347 个声明方法检查主 Cursor、缓存 Route／索引、追踪 Cursor 四个槽位的写入候选，再核对接收者来源。另对 22 个 Enemy 派生类型的 308 个普通方法作同类筛选，补读 18 个实际初始化／选择／移动覆盖。派生筛选没有发现这四个基类槽的新直接写入；派生类仍可能使用自己的 Cursor 槽或直接控制位置。[Enemy 审查](../evidence/route-operations-20261107/content/enemy-route-inventory.json)、[派生审查](../evidence/route-operations-20261107/cursor/subclass-slot-audit.json)
4. 对实际写入入口追 E8／E9 调用者并回查完整调用方法；虚调用另核 metadata slot 和实际分派。例如 `ChangePathMotionMode` 没有普通外部直接调用候选，但 `ChangeEnemyRouteMotionMode.Execute` 通过 Entity slot 97 调用它，不能按直接引用零命中认定未使用。[调用者正文](../evidence/route-operations-20261107/content/caller-bodies.json)

Route 本体的 39 个普通声明方法另作全部正文审查，不只读取按名字筛选出的修改方法。`GetCheckpointNextMap(index,profile)`／`GetTargetNextMap(profile)` 会懒创建导航场缓存；`GetSpawnOffset` 会消费 Map RNG。它们分别是缓存构造与实例采样，不是额外的 Checkpoint 程序替换入口。[Route 全类原件](../evidence/route-operations-20261107/cursor/route-all-bodies.json)

这些检查覆盖列明的 metadata、方法正文和写入形式，不能证明已排除任意原生别名写入、反射、所有委托绑定、泛型共享实现或 XLua。字段位移候选和最近方法名本身不算完成调用链证明。

## 2. 原生实际存在的操作

| 操作类别 | 实际入口与上游 | 原生行为 |
| --- | --- | --- |
| 创建路线与执行实例 | Map 的 GenerateRuntimeRoute／TraceRoute／ExtraRoute；Scheduler 普通出生、已有 Route 召唤及 RuntimeRoute 召唤 | Route 与 Cursor 是不同对象；路线可以来自关卡或运行时，出生再建立主 Cursor、偏移和时间快照。详见案例 14 |
| 替换主路线、指定索引 | `Enemy.ReassignRoute`；调用者包括运输、Blink、覆盖路线、运行时插入／清空 Checkpoint、Branch 路线替换 | 复用主 Cursor，重建 Checkpoint；Reset 后直接写索引，不是恢复旧运行状态 |
| 重写当前路线程序 | `Enemy.ReconstructRoute`；敌人改目标、关卡点击、Ristar／Durcar 等生成者 | 原地改当前 RouteData 的终点和 Checkpoint 数组，再重建 Route 导航及 Cursor Checkpoint；不保留旧索引 |
| 只改终点的业务入口 | `ReassignRouteEndPointOnly`，由 `AssignSpecialEndPointOrRevert` 调用 | 保留／取回原终点的内容意图与通用重建不同；底层仍重建 Checkpoint 后写回旧索引 |
| 缓存当前路线后替换／恢复 | `TryReassignRouteAndCacheOrigin`／`RestoreCachedRoute`；Act38 烟花、Act46 NPC 路线节点 | 只有一组 Route 引用与索引，非栈，也非完整 Cursor 快照；替换失败还有恢复路径 |
| 改变寻路方式 | Entity／Enemy `ChangePathMotionMode`，经 `ChangeEnemyRouteMotionMode` 虚调用 | 修改寻路与可变运动身份，生成 Route 和新主 Cursor，再接续索引；不同于普通身份切换 |
| 临时运动控制 | Fear／Attract 控制器、TracePositionCursor 与相应 Ability／Action | 使用独立执行上下文；接管优先级、目标更新和恢复条件由控制者决定，主路线并未统一被替换 |
| 修改执行进度 | `TrySkipIfCurrentCheckpointIsWaitForSeconds`、`SkipCheckPoint`、`IgnoreAllButMoveCp` | 分别涉及当前 WAIT、全部余下指令、后续指令过滤，不能按方法名字都理解成“跳过一个路点” |
| 更新导航场 | Tile 变更 → Map.UpdateRoutes／UpdateAllRoutes → Route.ReconstructNextMap | 保留程序与 Cursor 执行状态，只重算导航场 |
| 路线登记表维护 | Map.ClearAllRoutes／ReplaceAllRoutes／TryRemoveRuntimeRoute／RemoveRuntimeExtraRoute | 修改 Map 的 Route 集合；不自动等于对某个 Enemy 重置执行进度 |

Enemy 入口的完整方法、准确参数与 VA 在[操作原件](../evidence/route-operations-20261107/content/enemy-route-bodies.json)；Cursor 入口在[状态原件](../evidence/route-operations-20261107/cursor/state-bodies.json)；Map／导航入口及调用者在[导航原件](../evidence/route-operations-20261107/navigation/README.md)。

**N：从 Branch 取得路线也可能是操作。** `ModifyRuntimeRouteUseBranchRoute` 使用的 `Scheduler.TryGetEnemyRouteFromBranch` 并非只读查询：它先按允许循环的政策取下一 Phase 并推进 Branch 索引，再验证指定 Action、取得对应 Route。这条链不因此执行该 Action 或出生 Unit，后续取路线失败也不回滚已推进的 Phase。`TryGetAllEnemyRoutFromBranch` 具有同类推进。原件及实参纠正见[既有调用记录](../evidence/scheduler-general-20261107/lifecycle/branch-route-cursor-note.md)。因此，原生 Branch 既可以执行出生，也可以被内容作为路线选择来源；不能把两者都误写成 triggerBranch 出怪。如何在 Data／Content／Core 表达这种需求尚未定稿。

## 3. 状态究竟保留什么

### 3.1 程序、进度与路点私有状态

| 操作 | 路线程序／Checkpoint 索引 | 当前 WAIT／已采样移动目标 |
| --- | --- | --- |
| `BasicCursor.OnRouteChanged(route)` | 写新 Route，重建全部运行 Checkpoint，然后虚调 Reset | 旧 Checkpoint 对象丢弃；执行 Reset 选中的首个路点 `OnBegin`（若有） |
| `DirectionCursor.Reset()` | Route 与 Checkpoint 对象不换；索引归 -1 后选择第一个未被过滤的路点 | 选中的首项重新 `OnBegin`（若有）；不是将所有 Checkpoint 私有字段一次清空 |
| `AssignHostRouteProgress(index)` | 只写索引 | 不调用所跳入项的 `OnBegin`／`OnEnd`，不复制 WAIT 或目标 |
| `Enemy.ReassignRoute(route,index)` | `OnRouteChanged → Reset → Assign(index)` | 先发生 Reset 选中的首项开始程序（若有），再写指定索引；不能描述成“重新进入指定路点” |
| `Enemy.ReconstructRoute(end,cps)` | 原地修改同一 RouteData；重建 Route 与 Checkpoint，停留在 Reset 后的进度 | 旧 WAIT／目标丢弃 |
| `ReconstructRouteWithTargetGridMove` | 改成 MOVE＋长 WAIT 的程序，再走 ReconstructRoute | WAIT 配值为 999999 秒；不是原生无限时长类型；不保留原执行进度 |
| `TryReassign…／RestoreCachedRoute` | 缓存／恢复 Route 引用与索引；Checkpoint 仍重建 | 不恢复旧 WAIT 剩余或旧随机样本；失败回退同样不是无副作用回滚 |
| `ReassignRouteEndPointOnly` | 取旧索引、复制 Checkpoint 数组，再重建并 Assign 旧索引 | 不恢复原 Checkpoint 实例；cachedRoute 是引用，不是不可变深拷贝 |
| `ChangePathMotionMode` | 新 Route、新 Cursor、新 Checkpoint；最后写回旧索引 | 原 WAIT／目标丢弃；构造仍先运行 Reset 选中的首项开始程序（若有） |
| `Route.ReconstructNextMap` | 程序、索引、Checkpoint 对象不改 | 保留 |

**N：** `AssignHostRouteProgress` 普通实现仅在 `0x1808d1512` 写索引；`OnRouteChanged` 重建 Checkpoint 后经虚 slot 5 Reset。MOVE／WAIT 构造本身不初始化进入时的样本／预算。因此，不能为了让原生流程更容易解释，就把这条链补写成“恢复原索引并执行该项 OnBegin”。实际再如何推进须结合进入的具体 Checkpoint 与调用路径。相关原件见 Cursor 批次。

Reset 的 `_MoveNext` 会应用已有的指令过滤；无 Checkpoint 或全部被过滤时没有开始程序。当前普通 `_MoveNext` 通过旧项的 NextCursor 计算后继、调用选中项 OnBegin，没有执行 Checkpoint 的 OnEnd 虚槽。不能凭通用生命周期习惯补出一个旧项结束回调。

**N：** `Enemy.ReconstructRoute` 在同一 RouteData 上写入 end、checkpoints；Route.ReconstructRoute 本身也没有 Duplicate。仅终点入口首次保存当前 Route 引用，不足以建立“冻结原模板”的契约。其缓存字段也没有与完整缓存替换操作相同的索引写入，不能任意配对 `RestoreCachedRoute`。

表中“保留”指所列普通方法没有重写相应存储。`OnBegin` 可以执行消失／出现等内容程序并同步触发回调；表格不保证任意重入之后，宿主仍然引用进入操作前的 Cursor 或状态。

### 3.2 时间、偏移、运动方式和控制归属

| 操作 | 时间基准／路线偏移 | 运动方式与主／临时路线 |
| --- | --- | --- |
| 同 Cursor 的 OnRouteChanged／Reset／Reassign／Reconstruct | 保留 Cursor snapshot、offset；不重新查询 Scheduler 或采样出生偏移 | Cursor 的 motionMode 从当前 RouteData 读取；主 Cursor 身份保留 |
| `ChangePathMotionMode` | 继承旧 snapshot，新 Cursor 传零 offset，不重新采样旧出生偏移 | 修改 Entity 的 pathMotionMode 与 changeableMotionMode；新 Route 使用新方式；trace／cached 槽此方法不写 |
| Fear／Attract 创建临时 Cursor | 继承宿主 Cursor snapshot，临时 offset 为零 | 另有自己的 Route／Cursor；不能将其称为替换并重置主路线 |
| 地图导航刷新 | 不改这些实例事实 | 重算各自方式的导航场；不重建主／临时 Cursor |

Direction.Reset 在中心访问政策启用时清理所需访问记录、清 cachedDirection；它不写 nextGrid、totalDist、offset 或 snapshot。OnRouteChanged 还沿用已有中心访问标志的 true 状态，不能笼统写成“所有导航局部状态全部重置”。这些是客户端具体状态处理，不自动构成项目必须复制的字段布局。

**N：临时控制也不具有统一的“暂停主路线”语义。** Fear／Attract 使用独立 Cursor；主 Cursor 仍执行 `OnTick`，当前相对 WAIT 继续扣时，但 Checkpoint 到达推进按 Fear → Attract → 主路线的优先级选择。Trace 控制本身不关闭主路线的到达检查，主 Checkpoint 可能继续推进。控制结束后回到主 Cursor，不调用主线 Reset，也不重新采样主目标。主路线最终终点检查还独立于这些 Checkpoint 推进开关，见案例 14 第 5 节。[临时控制原件](../evidence/route-operations-20261107/temporary/native.json)

恢复控制权不回滚已经发生的身体移动。Fear／Attract 的路线方式由主 Route 复制；Trace 的目标路线则可以按 owner.changeableMotionMode 生成。两者不能仅因都使用临时导航就被赋予完全相同的方式选择政策。

Fear／Attract 的目标刷新可以对各自现有临时 Cursor 调用 OnRouteChanged，重建的是临时 Checkpoint。追踪另有共享的 Enemy.traceTargetCursor；TracePositionCursor.MarkReached、ResetReachedOffset 只修改追踪的完成标志／到达偏移，不能因此推断主路线被重建。

### 3.3 执行进度操作的区别

| 原生入口 | 普通路径的实际效果 |
| --- | --- |
| `TrySkipIfCurrentCheckpointIsWaitForSeconds(false)` | 只对当前相对 WAIT 生效，将剩余时间置零，索引不变 |
| 同上 `true` | 确认当前是相对 WAIT 后立即 `_MoveNext`，使用旧项 NextCursor 决定后继，再执行选中项的 OnBegin（若有） |
| `SkipCheckPoint()` | 直接把索引设到全部 Checkpoint 之后，不逐项执行开始／结束程序 |
| `IgnoreAllButMoveCp(true)` | 打开过滤，并跳过当前不保留的指令；实际保留 MOVE、PATROL_MOVE、DISAPPEAR、APPEAR_AT_POS、MAP_OFFSET_MOVE，不是字面上的“只留 MOVE” |
| `SkipNextCheckPoint(skipWait)` | 正常推进一次；参数为 true 且新项为相对 WAIT 时再推进一次；本轮没有找到普通直接内容消费者，不据方法存在单独增加需求 |

越过全部 Checkpoint 不等于到达路线终点；Route 最终完成仍有独立条件。当前相对 WAIT、按战斗／Wave／Fragment 时钟等待也不能互相替代。

## 4. 内容证据与可执行条件

本轮分别记录关卡／数据引用、实际组件与模板绑定、原生触发和消费条件。资源存在或组件 enabled 都不足以证明某条条件分支已经执行；没有实机轨迹的条目只称静态链。

内容证据及其逐项限制见[内容批次](../evidence/route-operations-20261107/content/README.md)和[临时控制批次](../evidence/route-operations-20261107/temporary/README.md)。马特奥的召集链直接复用[案例 13 第 10 节](13-route-and-movement-timing.md#10-非默认参数的内容正例与搜索范围2026-11-07-补核)，避免把同一资源换个目录再次称作新取证。

| 实际内容 | 配置／组件／消费链 | 证据范围 |
| --- | --- | --- |
| 马特奥上尉“集合！” | Act32Side_08 出生 → CallBdguad 技能 → 实际 Ability → `enemy_bolicp_s3[call]` → InsertCheckPointInRuntimeRoute → ReassignRoute | 前案已闭合静态内容链；证明运行时改写程序并非仅工具用途 |
| “思旧” | Act40Side_07 出生与 Branch 配置 → Absorb Aura 的实际绑定 → `enemy_cjstel_absorb` → ModifyRuntimeRouteUseBranchRoute | 实际路线来源与调用者；其中 Branch Phase 选择具有前述推进副作用 |
| “思旧”的飞行转换 | 实际 `enemy_cjstel_fly` 模板分别调用 ChangeMotionMode 与 ChangeEnemyRouteMotionMode → slot 97 → Enemy.ChangePathMotionMode | 两个节点分别存在；不能把自身空地身份与寻路程序变更合成一个字段 |
| 风情街“热情导游” | 普通主 Wave 出生 → allow 检查使 Focus 资格成立 → 施放安装 mark → 选择实际终点地块，先写全局标记／坐标再启动 ChangeRouteAura → endpoint 条件成立 | 已找到同一内容中的标记生产者；不依赖未知关卡程序预先提供标记 |
| 烟花发射器的狂欢 | Act38Side_07 选择 env_020_act38side，隐藏 Card 为 trap_186_cnvfwks → Manager 创建实际 Unit → 狂欢切入 Fire Mode → GlobalAura 安装 `trap_cnvfwks[route]` → 缓存替换；Detach 移除 Buff → OnEnd 恢复 | Trap root、模式槽、Aura、Validator、环境选择和原生切换链均已核对；恢复只按实际缓存模型解释 |
| 喀兰圣女祈祷 | Act46Side_10 选择 env_037_act46side、实际出生与技能／BuffToOwner 绑定 → 事件 24 → Act46SideRebuildNpcRoute → Manager | Manager 按地块 `check_point_index` 建序列；本关有 0–3 四个点。成功调用推进点索引，生成 start=end、无 Checkpoint 的路线，再进入缓存替换 |
| 节日零食商贩召唤 | 实际 summon Ability 为新出生者安装 `enemy_cnvpvd[no_wait]` → EnemySkipWaitCheckPoint | 参数为立即切换；证明解除当前相对 WAIT 是内容操作 |
| 木裂 | 关卡出生、实际 PassiveBuffAbility → 恶魔化／恢复模板 → IgnoreAllButMoveCp | 内容打开／关闭过滤；不将节点名称按字面解释成仅保留 MOVE |
| 全封闭沙滩车 | Act17Mini_02 出生 → 实际 DurbusAbility → 释放乘员时 ReassignRoute | 本实例 useHostRoute=true；Branch 与 nearestEnd 开关均 false，另两条只作为通用实现分支记录 |
| 妮芙 S2 | Character／Skill 固定数据 → 启用的 CastSkill／RangedAttack → S2 弹道 → extraBuff → 数据库 fear → fear_buff → FearController | 已核对弹道、Buff 数据、异常资格及注册／移除节点的静态条件链 |
| 酒神 S2 | Character 的 S2 overrideTokenKey → “本能的召唤”天赋／被动 Buff → 启用的 attract Ability → flag 41 与模板 → AttractController | 目标由实时 Selector 决定；内容与控制器通路已闭合，不代表任意单位都满足目标资格 |
| 活性源石风暴的 TraceStorm | `level_main_14-02.json` 同一 Fragment 直接出生风暴 lrmm 与信标 lrchld → 风暴 Default Mode／周期触发 → TraceStorm；信标实际 PassiveBuffAbility 提供目标过滤所需标记 | 已闭合目标生产者、Talent 附着、模式绑定和目标消费条件；未把文件编号猜作游戏显示关卡号 |
| “炎佑”的 Priority Trace | 卫戍 dragon Branch 的 acloon 配置与实际启用 Priority Trace Ability | 仅 D 绑定；此前未闭合 dragon 的真实触发，本轮也不据 Branch 条目存在宣称已经出生 |

内容原件保留实际 GameObject／组件身份、外部 MonoScript PPtr、模板动作与关卡 Pointer。模板递归扫描包含 IfElse 等嵌套动作；只扫描顶层动作的首次结果已废弃。热情导游的仅终点改写另有独立[条件正例补核](../evidence/route-operations-20261107/endpoint/README.md)，以免把 `flgshp_tile_mark > 0` 当作没有来源的假设。

## 5. 能归并的实现与不能抹平的语义

以下是依据 N／D 的需求归纳，不是已定 Core API：

当前证据支持的最小能力是：建立带实例上下文的路线执行过程；按明确进度政策改变程序；控制当前相对 WAIT 与指令过滤；处理具有各自推进政策的临时运动目标；在保留执行状态时更新导航。缓存来源程序、选择 Branch 路线、组织传送或乘员释放，可以围绕这些能力组合，证据没有要求逐一保留原生包装方法。

- **路线程序与运行进度要分开。** 重用同一个路线对象不表示保留 Checkpoint 私有状态；恢复路线与索引也不表示恢复 WAIT 和随机目标。
- **程序替换可以复用底层写入机制，但调用者的进度政策不能丢。** 从头开始、指定索引、仅改变终点、保存后恢复来源路线，具有不同内容目的；它们可以共享实现，不能靠一个含糊的“set route”默认行为隐式决定。
- **临时控制与主程序替换要区分。** Fear、Attract、追踪有自己的目标和有效期；主路线的等待与完成判断仍可能继续，恢复时不能假定主路线被冻结。
- **导航失效更新是独立需求。** 地形变化需要让同一执行实例读取新导航结果，不应因此重启当前 WAIT 或重新采样目标。
- **当前 WAIT 和指令过滤有真实内容需求。** 烟花恢复后的 WAIT 归零、商贩召唤物立即离开 WAIT、木裂开关过滤已具有正例。跳过全部余项等入口具有不同原生效果，但具体触发尚未闭合的条目不据此独立增加 Core 需求；底层都改变索引也不足以证明语义等价。
- **不需要逐一公开全部原生方法。** `AssignHostRouteProgress`、Map Route 集合维护、预览 Cursor 与内部导航构造可以是实现细节；是否公开，应看内容是否确需直接表达其业务目的。

尤其是“先执行 Reset 选中的首项开始程序、再直接改索引”的客户端链，只能先如实记录。项目若采用更直接的显式后继和进入协议，需要单独判断重要玩法差异，不能把调查事实偷换成应照搬的结构，也不能默默改写成完整状态恢复。

## 6. 调查限制

- 没有执行客户端，没有核验 XLua 在线覆盖；本案的“可执行”指已闭合的静态条件与调用链，不指实机已经观察到全部分支。
- 方法全集、字段槽写入和直接调用者审查具有明确范围，不能证明全程序不存在其他间接写入。专用派生运动控制、预览、玩法 Route 集合维护分别记录，不凭类型名称直接推定用途或支持范围。
- 未把生息、保全等范围外玩法的消费者作为普通战斗的需求正例；其他仅发现类型或社区描述的玩法来源也不据此自动扩展支持承诺。
- `TransportInternal → Transport.Execute` 已核对，但本轮选中的 Holder 没有该节点配置正例；不以沙滩车直接 Reassign 的另一条链代替它。后兽、钓鱼等候选的部分触发条件尚未继续闭合，来源与等级保留在内容批次。已闭合的其他消费者足以证明主程序替换需求，不需要据这些候选预设更多独立接口。
