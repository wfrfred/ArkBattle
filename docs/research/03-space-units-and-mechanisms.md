# 空间、单位与机制边界

更新于 2026-10-07。本篇记录卫戍协议所需空间规则的研究结论，不冻结最终 API，也不把客户端继承体系作为 core 的模块划分。

范围包含卫戍协议场景及其使用的普通战斗规则；排除生息演算、保全派驻、船运寻路和 WORD／辞岁行机制。普通箱子只用于对照通用设备规则，不据此扩大卫戍内容范围。

## 1. 证据等级与限度

本文使用以下标记：

- **证实**：原始字段、实际引用的 prefab 对象或已读常规原生方法支持该结论。
- **推断**：由这些证据作出的领域归属或行为解释，需要与官方实现事实区分。
- **未核对**：没有闭合具体模板、调用顺序、状态转换或热更新证据。

客户端来源为本机 `GameAssembly.dll`、`global-metadata.dat` 与真实 UnityFS bundle。已有审计记录的 Unity 版本是 2021.3.39f1，资源版本为 `26-08-16-14-00-43_415873`；这不是全部热更新分支的验证结论。没有运行客户端或执行 Lua。

方法记录第一行保留 metadata 类型、方法 index、地址及参数。多个类型共享 native 地址时不能仅按地址选择类名；prefab 的外部 MonoScript PPtr 未找到目标 CAB 时，也不宣称已确认具体脚本类型。

原始 Level／character／skill 数据和真实 prefab 的权威性高于旧模拟器的简化。`external/upstream/docs/research` 中的 DATA、ASSUMED、旧轨迹验证分别处理；下文明确指出已被新证据修正的旧假设。

## 2. 核心结论

空间实例、地图事实、范围贡献和非空间关卡状态是四种不同信息，不能互相替代。

| 信息 | 代表实例 | 不应从它自动推出 |
| --- | --- | --- |
| 有身份与位置的场上对象 | 干员、敌人、工事、平台、召唤物 | 必有生命、能被普攻、能阻挡、能自走 |
| 地图基础事实 | heightType、buildableType、passableMask、静态边 | 当前部署一定合法、全部地形效果已经运行 |
| 某来源在某范围内的规则贡献 | 导航代价、通行限制、未来区域 Buff | 它本身就是 Unit，或拥有来源的完整生命周期 |
| 非空间关卡状态 | 环境开关、控制器启停、地图演变条件 | 必须伪造世界位置、HP 或阵营 |

**推断**：core 按独立事实及规则组合单位能力，比按 ENEMY／OPERATOR／DEVICE／OBSTACLE 互斥类别划分更贴近现有证据。这里的 Unit、Mechanism 与贡献归属是项目领域模型，不声称官方存在同名结构。

位置表达也不等于位置约束。当前世界位置、部署占位、返回预留、主路线目标和出生 locator 偏移具有不同规则意义，不应压成一个 tile 坐标或多份可写当前位置。

## 3. 原始地图与 marker

**证实**：原始地块没有统一的 `terrain` 字段。Level 的 `mapData.map` 是地块表索引矩阵，`mapData.tiles` 保存定义；相关字段为 `tileKey`、`heightType`、`buildableType`、`passableMask`、`playerSideMask`、`blackboard` 等。

`blackboard` 是 `key / value / valueStr` 参数表，参数可以写在地块、技能或关卡预置覆写中；它不是独立的运行机制类型。仅知道地块名和空 blackboard，不能推出该地块没有机制。

高度、基本部署类型和通行掩码在数据中分别存在。高级部署位掩码还可能来自 prefab 预处理，不应把基础 JSON 当成最终有效部署规则。

### 深水是明确反例

`act2autochess_m04` 的原始 `tile_deepsea` 为 LOWLAND／ALL／ALL，blackboard 为空。真实 `tile_deepsea` 根组件却保存 `_advancedBuildableMask=2`。

- `Tile.Init`（69854）构造原始选项后调用预处理虚槽。
- `DynamicBuffTileFixedWithExtraOptions.PreprocessTileOptions`（69708）与另一 extra-options 实现（69711）将该额外掩码写入有效选项。
- `BuildCondition._CheckBuildable`（77190）要求 `(tileRequired & unitAllowed) == tileRequired`，除非内容显式忽略高级掩码。

**证实**：深水的部署限制不能从 ALL 或 DEEPSEA 名称直接决定。**未核对**：外部 MonoScript 的完整类绑定、全部动态豁免和模式切换生命周期。

稳定证据见 [deepsea prefab fixture](../../test/fixtures/arknights/prefab_tile_deepsea.json)；对象与 native 调用闭环见 [部署审计报告](/tmp/stronghold-6b-deployment-report.md)。

### 红蓝门与传送门是位置角色

**证实**：联合防御单场路线从 `(9,10)` 到 `(9,2)`，多场路线从 `(9,18)` 到 `(9,2)`。两张原始模板的 `(9,10)` 和 `(9,18)` 都标为 `tile_start`；多场中间的 START 可以只是途经位置。

来源为 `act1autochess_escaped_single`／`escaped_multi` 原始 JSON，已读取地图矩阵和 routes；地图行序转换后核对同一逻辑位置。

START／END 不能自行创建敌人或判断路线完成。TELEPORT_IN／OUT 也不能自行配对传送；实际路线样本通过 DISAPPEAR、等待、APPEAR_AT_POS 表达出现／消失。

**推断**：marker 保存地图的可查询位置语义；出生、目标与传送行为由路线或内容使用 marker，不能由 marker 替代路线脚本。

### 格子通行和边通行确实不同

`Map.GetGotoDirectionalPassableMask`（69251）对 `blockEdges` 两端设置相反方向的禁行位。普通 tile 都可通行时，某条相邻边仍可禁止跨越。

**证实**：原始 blockEdges 的这条路径为对称限制。**项目扩展**：当前导航贡献还能表达单个格子的有向 departure 禁止，不能把该支持误称为已发现原始数据普遍使用单向边。

## 4. 设备、障碍与动态创建

原始 character 表中的 `trap_001_crate`、`trap_1105_accrate`、`trap_1106_achplat`、`trap_098_mire`、`trap_042_tidectrl` 都是 TRAP／NONE。这个分类同时覆盖空间设施和环境控制内容，不能作为能力推导规则。

### 工事与平台改变有效格规则

| 实际对象 | 数据／prefab 已证实事实 | 领域含义 |
| --- | --- | --- |
| `trap_1105_accrate` 阻隔工事 | HP 100、blockCnt 0；所引用 mode 保留 passage、将 buildableType 改为 NONE、设置 obstacle-like 成本 | 可以是有生命的固定实例，附带导航／部署贡献；不是 Blocker 的同义词 |
| `trap_1106_achplat` 射击台 | HP 100、blockCnt 0；所引用 mode 保留 passage、改为 RANGED／HIGHLAND、设置 obstacle-like 成本 | 平台实例、地块覆写与上方部署支撑分别表达 |
| `trap_001_crate` 普通障碍物 | 真正引用的 mode 同样 keepPassable=true；根对象 ignoreBlockAnyRoutes=false | 与卫戍工事存在不同内容许可；不能复用一份“箱子类型”完成全部语义 |

工事实际 mode 为 `8586248165343953339`，平台为 `188846094545021249`；必须从根对象 `_modes` 追踪引用，不能任选 bundle 中同名组件。

`Tile.RefreshTileOptionsViaToken`（69923）分别检查 keepPassable、keepBuildable、rewriteHeightType、rewriteAdvancedBuildMask。某个数值字段存在，不意味着对应覆写开关已开启。

平台的 `_tileOptions.advancedBuildMask=1` 当前没有覆写权；其 `_rewriteTileAdvancedBuildMask=false`，因此不能用该数字覆盖已有深水掩码。

`Tile.get_moveCost`（69846）把普通成本与 obstacle-like 成本区分为 1 和 1000；FLY 搜索使用成本 1。**证实**：所选工事／平台通过高成本改变 WALK 路线，仍保留基础 passage。

[旧 waves 研究](../../external/upstream/docs/research/08-waves-official.md)中的“射击台阻断地面 [ASSUMED]”不能继续作为规则依据；真实 prefab 已支持相反结论。当前 core 的 WALK costFloor 1000 投影与该证据一致。

**未核对**：普通箱子的完整闭路部署检查、卫戍工事“敌人接触后破坏”的技能／受击调用链、全部 mode 切换与销毁时序。`ignoreBlockAnyRoutes` 的实际取值差异已证实，不能仅凭字段名宣称其完整执行政策。

### recipe、活实例与库存分开

`BattleController._LoadPredefinedData`（记录中的地址 `0x180648ff0`）检查 hidden 后跳过初始创建；`SpawnPredefinedInstanceByAlias`（地址 `0x180640e60`）按 alias 创建预置实例。

**证实**：hidden recipe 不是“已在场但不可见的 Unit”。这与已有 Unit 经 DISAPPEAR 暂停空间贡献不同。

- `act1autochess_m01` 有 12 个最初可见工事。
- `act1autochess_m02` 有 16 个 hidden 工事和 16 个 hidden 平台。
- `data/effects.json` 的 `map_m02_1` 使用 `auto_chess_change_map`，参数按工事／平台 alias 指定变化；描述为工事变为射击台。

**证实**：卫戍数据支持设施的出现／移除和地图演变描述。**未核对**：该内容的实际触发时点、alias 执行链和全部模式下的生效条件，不能只凭描述把它当成任意战中部署入口。

原始 Predefines 结构分别提供 tokenInsts 与 tokenCards。此次检查的 17 份卫戍原始 Level 未发现非空 tokenCards；不能把通用明日方舟箱子库存能力宣称为这些关卡已给出的事实。

**推断**：战斗中新增设施应创建有自身身份与生命周期的空间实例，再登记其贡献；库存、费用与卡牌许可属于外层供给。它不是修改静态 TileMap，也不需要把所有可部署对象收编到 Battlefield 的供给管理。

## 5. 地形配置与实际机制

| 地形样本 | 原始配置和实际模板证据 | 当前证据限度 |
| --- | --- | --- |
| INFECTION：act1 m04 | tile blackboard 为 damage=70、atk=0.2、attack_speed=20、duration=300 | 数据证实参数；尚未闭合具体 tile prefab、伤害类别及进入／离开时序 |
| MIRE：act2 m02 | tile blackboard 空；预置 trap_098_mire，sktok_mire 引用 buff_mire[mark]／buff_mire[checker]；覆写 value=3、每层 attack_speed／move_speed=-0.05、max_stack_cnt=10 | 控制器、技能与参数已闭合；完整叠层／清除／免疫执行尚未闭合 |
| SMOG：act2 m03 | tile blackboard 空 | 不能从空参数推出无机制；具体状态 flag、来源及进出规则本轮未核对 |
| DEEPSEA：act2 m04 | trap_042_tidectrl 选 skillIndex=2；sktok_tidectrl_3 引用 sea_drown[enemy]／buff_sea，参数 damage=40、attack_speed=-0.6、move_speed=0.6 | 周期伤害与属性内容有模板证据；逐 tick 调用、豁免与模式生命周期仍需核对 |

技能等级需沿 character.skills、phase、skillIndex、mainSkillLvl 选择；`SkillDataBundle.TryGetSkill` 会夹到已有 levels 范围。`Blackboard.Assign` 按大小写无关键覆写，保留未覆写的基础项。

当前加载器已解析所选 MIRE／DEEPSEA 参数，并按项目 30 Hz 表达时间或每 tick 量；这是加载结果，不是完整效果执行或客户端数值逐位兼容证明。

**推断**：静态 Tile 可以保存已归一化的地形配置，当前叠层、状态贡献、周期伤害和控制器开关仍必须有独立运行事实及转换。一个 INFECTION 标签或参数对象不能替代这些事实。

当前 `terrain.ts` 和 Tile.mechanism 仅完成参数选择／归一化。感染伤害与增益、沼泽叠层、烟雾状态、深水伤害与属性转换均未接入运行解释器。

## 6. 阻挡、受击体、作用范围和物理 Body

| 概念 | 已核对的官方行为 | 与当前模型的关系 |
| --- | --- | --- |
| 空间位置 | VisualObject.mapPosition／worldPosition 提供连续位置 | Unit.position 是当前几何事实，格位置为查询或独立占位事实 |
| 阻挡几何 | Character.CheckInBlockRange 比较双方 mapPosition 距离平方与阻挡半径平方 | BlockGeometry 是建立关系的接触规则，不是 HitGeometry |
| 受击几何 | Unit.get_hitColliders 返回 collider 集合；范围查询可以检查 bounds／圆半径或执行物理 overlap | 单一“被索敌半径”不足以覆盖所有实际受击体 |
| 攻击／效果覆盖 | CircleRange、PhysicsRange、GridPositionRange、EntityLocateRange 等具有各自查找／包含规则 | 本研究的 AttackGeometry 是角色描述；当前 RangeGeometry 用于更一般的行动查询，并非官方字段名 |
| 物理 Body | Rigidbody2D 的 bodyType／mass／velocity 与地图碰撞、失衡提交分别读取 | 不能以受击半径、重量等级或空地分类代替 |

`Character.CheckInBlockRange`（75131）读取双方连续位置，在 `0x180a05015` 比较半径平方；常规分支没有把目标 hit 半径加到阻挡半径。

`BlockRadiusManager.GetBlockRadius`（75409）还读取 blockMode 和有效 Attributes。**证实**：阻挡半径可以随规则变化，不能由固定职业常量承担全部语义。

`Character._SearchBlockee`（75132）先检查容量、状态和 Tile.isMeleeBlockable，再寻找候选；Enemy.CheckBlockableWithoutCheckRange（75569）独立处理 BLOCK_FREE、运动／阻挡模式与特殊条件。

**证实**：几何接近不是完整阻挡资格。当前 core 已检查静态 WALK 许可、当前 BlockerState radius 和容量；不能宣称已覆盖所有官方 blockMode、状态免疫和 specialBlockCondition。

`Box2dPhysicsUtil.FindTargets_DISPOSE`（73085）先进行 collider 查询，再调用 TargetOptions 验证。`EntityLocateRange.CheckTargetIn`（73188）和 `PhysicsRange.CheckTargetInOriginRange`（73280）包含 bounds／圆半径判断。Unity 绑定已确认 OverlapCircle／OverlapBox 入口。

**证实**：范围查询不普遍等价于“目标中心是否位于某个格”。**未核对**：全部 selector 的 shape 细节、Unity 相切容差、旋转／缩放、多 collider 的动态更新与高速扫掠。

当前 Circle／Box 并集、相切包含与 GRID 的连续来源锚点是明确的项目几何规则；尚未完整加载真实 hitColliders、Collider 开关和 Body，不能宣称这些有限规则复现所有客户端范围。

物理对照已取得真实 root prefab：slime 为 Dynamic／mass 1，yokai 为 Kinematic／mass 1，acloon 为 Dynamic／mass 1；后两者均为 FLY。原始 massLevel 又分别为 0、0、10。

**证实**：FLY 不等于静态刚体，重量等级也不等于物理质量。详见 [位移审计](/tmp/stronghold-6b-displacement-report.md)；推拉入口免疫、失衡和碰撞是后续独立规则。

### 6.1 阻挡关系的维持、释放与重新获取（2026-10-10 补查）

这一补查使用当前安装客户端的普通原生分支，而非将项目既有测试视为官方规则。客户端清单为 V078／`26-09-13-15-28-10-30688348`；GameAssembly.dll SHA256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`，metadata SHA256 为 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。本小节的方法索引属于这份 metadata，不能与本节前面的旧客户端索引混用。地址、关键指令及项目复现结果见 [补查证据](evidence/blocking-lifecycle.json)。未验证运行中的 XLua 替换分支或完整实机战斗。

**证实：普通搜索属于阻挡者自身的更新。** `Character.OnTick`（76022）先调用 `Unit.OnTick`，处理阻挡模式和状态，再推进自身 `BlockManager.Tick` 并调用 `_SearchBlockee(false)`。`BlockManager` 的构造函数（77205）创建 `PeriodicTicker(3, false)`；Ticker 每次 Tick 将剩余次数减一，普通 `SearchBlockee`（77190）仅在 ready 时执行。这里的 3 是逻辑更新次数，不是 3 秒。`ObjectManager.OnFixedUpdate`（71077）冻结本轮对象名单并逐对象更新；`BattleController.OnTick`（64825）在这一遍历之后才调用 `ActionExecutorManager.Tick`。没有查到与项目 `Blocking → Combat → Projectile → Movement → Blocking` 等价的两个全场搜索入口。

**证实：已建立的关系具有持续性，搜索不会抢走其他阻挡者的敌人。** `Enemy.CheckBlockable`（76428）首先排除已有有效 blocker 的敌人，再检查范围与其他资格。`BlockManager.SearchBlockee` 只填充剩余容量，不重新分配现有关系；其候选权重来自敌人与当前阻挡者的距离平方（`_CheckBlockable`，77194）。这是阻挡者搜索附近敌人，而非项目按敌人 ID 遍历、为每个敌人选择最近阻挡者的全局算法。在多个阻挡范围重叠时，两种算法不能推定等价。通用关系中未发现固定最大阻挡时长，或为了避免长时间阻挡而定期强制放行的机制；具体敌人和 Buff 的特殊规则仍需另行核对。

**证实：释放与获取不是同一个操作。** `Character.States.DyingState.OnEnter`（76185）、`DeadState.OnEnter`（76171）及 `Character.OnFinish`（76033）均同步进入 `ClearAllBlockees`（77196），后者逐个调用 `Enemy.UnregisterBlocker`（76433）清除关系并触发通知。这些通用释放入口不调用全场搜索，也不向敌人设置通用的“解除后若干帧不可再阻挡”期限。能否随后被 B 接住，取决于 B 的搜索是否到时或被显式触发，以及敌人当时的位置、资格和容量；不能据此规定敌人必须先移动一帧。敌人自身的行动与状态机也可能继续限制移动，所以解除阻挡并不等于当帧一定移动。

**证实：特定领域操作能够立即搜索。** `Character.SearchBlockeeImmediate`（75955）将 force=true 传入 `_SearchBlockee`，绕过普通 ready 检查，但保留搜索中的资格和容量检查。`PullHitTargetBehaviour.OnProjectileStop`（86413）以及 `Action.Nodes.CharSearchBlockeeImmediate.Execute`（99962）具有直接调用点。它证明拉拽结束等操作可以要求立即接住目标，不能把普通周期搜索当成所有操作都必须等待的唯一时点。尚未逐一核对所有部署动画／行动数据何时触发该节点，不据此宣称所有部署都会立即建立关系。

**证实：重新阻挡包含位置结算。** `BlockManager.AddBlockee`（77191）经 `BlockBalancer.CalculateBlockOffset` 计算偏移，调用 `Enemy.RegisterBlocker`（76432）；后者在记录关系和派发通知后调用 `_MoveToBlockPosition`（76515），把敌人调整到阻挡位置。该函数同时具有普通 Tween 和确定性 BattleTween 分支。项目当前 `advanceBlocking` 只写关系，没有这个位置调整。因此轮换阻挡是否最终让敌人通过，不仅与搜索顺序有关，还与每次接住时的位置结算有关。不能仅凭一次快照中的关系相同判定长期结果等价。

**证实：部分资格变化会释放旧关系。** 普通 `Character.OnTick` 在相应原生分支检测到 STUNNED／BLOCK_FREE 时调用 `ClearAllBlockees`，`SearchBlockee` 也拒绝这些状态。`OnBlockModeChanged`（75970）会清空关系。阻挡容量下降经 `OnAttributeDirty`（76035）同步调用 `UpdateBlockees`（77192），后者从接收列表尾部移除，直到总占用不超限，不是重新选择最近的一组敌人。强制设置敌人位置具有显式 `ReleaseBlock` 路径；这些释放规则不能用“每帧检测是否仍在半径内”替代。

与当前 TS Core 的对照：

| 情形 | 当前实现 | 本次已核对的官方语义及影响 |
| --- | --- | --- |
| A 在 Combat 中死亡，B 仍能接住 E | Battlefield 更新立即解除 A–E，下一次获取在 Movement 之后；E 可能移动，或在路线终点直接完成移除 | 原生没有同一全场 Combat-before-Movement 结构；释放后是否能先被 B 搜索到依赖具体时点，不能默认项目这段空窗等价 |
| 现有 blocker 仍有效 | 保留关系，不每轮换给最近者 | 与普通原生关系持续性方向一致；未证明所有特殊失效条件均已覆盖 |
| 多个 blocker 范围重叠 | 依敌人 ID 顺序，给每个敌人选择最近 blocker | 官方由各 blocker 执行搜索，候选是附近敌人；分配结果可能不同 |
| 阻挡者被眩晕 | `readBlockingFacts` 未读取 STUNNED；纯状态更新及后续 Blocking 都保留关系 | 普通原生路径会清空并拒绝重新获取，这是可复现的资格缺口，不能归为一帧近似 |
| 重新阻挡 | 只建立关系，敌人位置不变 | 原生会调整到阻挡位置，可能改变轮换与长期通行结果 |

眩晕问题已用当前构建复现：创建一个具有 Status／Blocker 的干员和一个敌人，获取关系后仅给干员添加 STUNNED contribution，再调用 `Battlefield.advance(UPDATE_UNIT)` 和 `advanceBlocking`；两次之后 `blockerOf(enemy)` 都仍指向该干员。旧 `server/sim` 的“眩晕解除阻挡”测试不证明 TS Core 已具备此行为。

后续应分别确定并验证：阻挡资格与释放条件；多个候选的分配规则；普通与显式立即获取的时点；重新获取的位置结算；既有 Action 是否继续执行。至少覆盖 A 死亡／退场而 B 在范围内、眩晕及恢复、容量下降／恢复、重叠范围、拉拽后接住、路线终点和多轮轮换。持续接住敌人本身不能直接判为 Bug；真正要避免的是遗漏失效条件或人为时序空窗改变战斗规则。本次只补查和记录，没有修改源码。

## 7. 索敌资格属于具体查询与效果

native `ActionPurposeMask` 明确有 DAMAGE=1、HEAL=2、EP_DAMAGE=4、EP_HEAL=8。TargetOptions 又分别保存 ignoreTargetFree、ignoreAllyTargetFree、ignoreHealFree、motion／side 等条件。

`TargetOptions._VerifyAdvanced`（74203）调用 isTargetFree／isAllyTargetFree，并在 HEAL 用途位参与时检查 isHealFree；`BattleUtil.VerifyTarget`（77297）另外读取目标当前运动分类、类别和玩家侧。

**证实**：TARGET_FREE、ALLY_TARGET_FREE、HEAL_FREE 不是一份统一的“目标不可选”。相同目标可以被某项行动排除、被另一项查询选中，或被选中后仍被接收入口拒绝。

`Entity.OnTakeHeal(modifier, force)`（66122）在非 force 路径再次读取 HEAL_FREE 并 Cancel Modifier。这是效果接收许可，不能因为查询曾通过就省略。

实际 `char_491_humus`／`char_188_helage` trait prefab 含 abnormalFlags=[7]，即 HEAL_FREE；休谟斯在卫戍池 `chess_char_2_09` 的特性同时描述无法被友方治疗和攻击恢复自身生命。

**证实**：需要区分普通治疗与其他恢复政策。**未核对**：休谟斯自恢复的完整调用链，以及各种再生／溢出屏障是否走 force 或其他 HP 入口，不能仅从文字把它们统一成忽略禁疗。

`enemy_9012_acloon` 的实际常见能力模板 `acloon_enable` 含 abnormalFlags=[15]，即 ALLY_TARGET_FREE；它也不能从敌人身份自动推导全部索敌资格。

**推断**：状态保存事实，查询用途／来源关系／形状与当前状态共同形成 eligibility，接收端保留自己的政策。QueryPurpose 应是独立语义，不直接别名为 Effect 类型。

当前 DAMAGE／HEAL 查询已实现有限资格与确定性优先选择，混合绑定组聚合用途；完整官方 selector、职业限制、嘲讽／出生顺序、部分不可选原因和状态免疫仍未加载。

## 8. Route、Navigation、Locomotion 与临时控制

Route 描述路线脚本，Navigation 回答当前移动意图如何经过有效空间，Locomotion 消费速度／控制输入形成位移。这是领域解释，不要求照搬官方类继承。

`Enemy._MoveByRoute`（75627）读取活动 cursor；`_MoveByCursor`（75631）先 PredictReached，再按 GetNextDirection／MoveController.CalculateMoveDelta 移动。预测坐标与实际 heading 不是同一个查询。

`Enemy.OnTick`（75671）经过状态机更新、主游标计时、恐惧／诱导游标和 MoveController；阻挡、零速或晕眩不自动暂停 WAIT_FOR_SECONDS。恐惧／诱导还可以禁止主路线推进而继续当前等待计时。

`RouteData.motionMode` 给寻路输入；Entity.changeableMotionMode 被索敌和阻挡规则读取。`Enemy.ChangePathMotionMode`（75610）会生成新 RuntimeRoute 和 DirectionCursor。

**证实**：当前分类与寻路方式有不同调用职责。**未核对**：全部特殊敌人的临时运动变化是否保持二者一致；不能从 core 可表达独立值推出官方允许任意组合。

### 出生与目标随机必须区分

`Enemy.Init`（75609）一次解析 Route.GetSpawnOffset（69536），将其加到出生格中心，并把负偏移给 cursor。它不是 Body 的 footOffset，也不是 checkpoint reachOffset。

`MoveCheckpoint.OnBegin`（69365）进入时才解析 reachOffset；前瞻不执行 OnBegin。重建 Field 不等于重新进入 checkpoint，PATROL 真正回跳则重新进入并抽样。

**项目契约**：同一移动意图保存已解析 goal，重新规划／临时接管恢复不重抽。原生模式重建的 m_offset 恢复并未完全保持同样行为，不能声称该保存策略是完整 native 兼容。

### 恐惧与诱导在卫戍范围内

`data/chess.json` 的妮芙 `chess_char_5_22_a` 使用 skchr_nymph_2，圣聆初雪 `chess_char_6_02_a` 使用 skchr_sbell2_3；分别含恐惧与诱导描述，不能因推迟实施而视为范围外。

- FearController._TryGetFearRouteReachable（76020）随机选择、生成动态路线、检查 Route.CheckReachable 与目标距离。
- FearController._UpdateFearRoute（76021）调用 Scheduler.GenerateRuntimeRoute；Enemy._MoveInFearArea（75628）继续使用 _MoveByCursor。
- AttractController._TryGetAttractRouteReachable（76031）检查动态路线可达；_UpdateAttractRoute（76032）生成 RuntimeRoute，Enemy._MoveInAttractArea（75629）消费自己的 cursor。

**证实**：临时控制改变活动行进上下文，不要求把整份主脚本改写，也不是一个相反速度向量就能复现。

当前 mainRoute／alternativeRoute 已保留独立执行上下文和主路线意图，显式 SET／CLEAR 可以演示接管恢复；实际 Buff 来源、候选生成、优先级、到达重选、到期移除及官方数值尚未接入。

详见 [连续运动核查](/tmp/stronghold-motion-audit-20261006.md)和[路线核查](/tmp/stronghold-route-audit-20261006.md)。两份旧记录含已实施或范围外项目，不作为当前缺口清单。

## 9. 非空间机制与范围贡献

### 控制器与导航贡献

实际预置控制器仍由官方 Token prefab／技能承载，保留配置位置；trap_098_mire／trap_042_tidectrl 的根对象 disableUIHub、unwithdrawable，且 rewriteTileOptions=false，核心效果来自技能模板。

**推断**：项目可以把所需的全局启停／关卡进度投影为非空间 Mechanism，不必保留没有规则用途的位置。**证据限度**：这不证明官方控制器本来就没有空间对象，也不证明全部设备可以丢弃位置或生命。

当前 MechanismRuntime 只有 id、definition、active；所选 controller 的参数加载和实例登记不等于技能、地形 Buff 或周期伤害已经执行。

当前俗称 SpatialEffect 的实际类型是 NavigationSpatialEffect。它只提供 WALK／FLY 通行、departure 和 WALK costFloor 贡献，支持 UNIT／MECHANISM 来源及 FIXED／FOLLOW_UNIT 区域。

**当前实现事实**：空间索引按有效来源、锚点与区域构建导航投影；FOLLOW_UNIT 以量化格展开。这与行动 RangeGeometry 的连续锚点 overlap 是不同空间语义。

尚无通用区域伤害／Buff／视野运行支持，不能因已有 effectsAt／effectsFrom 索引便宣称这些机制已实现。单位附着 Effects 也不收编导航贡献或非空间 Mechanism。

### 光环分发与接收实例

**证实**：常规 `AuraAbility` 将空间候选、目标资格、进入／退出与接收端 Buff 安装分开处理。`_DoTargetCheckAndEnter`（90907）通过资格后创建 TargetMeta；`DealTargetTouched`（90904）调用 `Entity.AddBuffsToIdList`，保存所安装的 Buff 身份；`DealTargetLeft`（90905）按 `_removeBuffWhenTargetLeave` 配置决定是否调用 `Entity.RemoveBuffs`。`DoDetach`（90900）另有移除接收端 Buff 的清理路径。

`CharacterNonPhysicsAuraAbility` 通过更新目标集合和范围检查分发；`GlobalAuraAbility.DealTarget`（91076）同样调用 `AddBuffsToIdList`，并保存目标到接收实例的关联。后者还处理单位出生／集结点重生（91077）、更新目标 map（91081／91082）和 Detach 清理（91070／91073）；`_removeBuffWhenAbilityDetached` 配置参与清理判断。**证据限度**：这些常规原生入口不意味着所有内容都采用相同刷新周期、离开立即撤销或来源退场政策；实际能力选择与配置仍须逐项追踪。

**推断**：空间查询回答本次候选；分发过程决定进入、保留、退出及接收规则；目标附着实例再向本领域 Capability 安装贡献。源光环与每个接收实例有不同身份，不能只在每次参数查询时临时扫描“当前在圈内的来源”来代替已发生的安装。

源实例的安装关联是可恢复的运行事实：某来源已经向哪个目标安装了哪些接收实例，可能还关联采样值、层数、期限和退出后继。它不能仅由当前几何候选重新计算；否则恢复时可能重复安装、重抽、重采样或触发进入动作。空间候选、索引和纯几何缓存则是可重建查询资源。来源侧保存接收实例关联，接收端保存贡献载荷，避免两边各维护一份数值。

本季斯卡蒂 S3 已确认鼓舞按触发刷新采样贡献，见 [Case A](cases/01-buff-installation-and-parent-scope.md)。这同时说明范围成员维护与贡献取值刷新是不同过程；本案没有穷尽多鼓舞竞争、全部范围刷新和离开后的接收实例政策。

### 普通 GlobalBuff 与全局共享状态

**证实**：`BattleController.RegisterUnit`（64099）先登记 Unit，再遍历 `m_globalBuffs` 并调用 `GlobalBuff.TryAddBuff(unit, true)`。后来注册的单位会经过已存在普通 GlobalBuff 的资格检查；确切入口是注册，不应笼统写成“所有出生回调完成后统一补施加”。

`CreateAndAttachAllUnitGlobalBuff`（64218）初始化全局实例后，对当前 UnitManager 内的单位补调用同一安装入口。另有 `CreateAndInitGlobalBuff`（64217），不能仅因名称相似就把全部创建入口当成同一补施加契约。

`GlobalBuff.TryAddBuff`（66773）检查目标、extraValidator 与施加次数等条件，对 prefab 的 `_buffs` 调用 `Entity.AddBuff`，在 `m_targetMap` 保存目标到所创建 Buff UID 列表的关联。`OnRemoved`（66775）按这些关联调用 `Entity.RemoveBuffs`，再清理目标 map 并通知来源。因此全局规则实例、接收端 Buff 实例与数值贡献仍是不同事实。

| 卫戍数据中的全局内容 | 已知语义与领域归属 | 仍未闭合的执行细节 |
| --- | --- | --- |
| 埃芒加德 `act1autochess_band28_buff`，`max_respawn_cnt=3` | 描述为战斗中前 3 个被击倒干员复活；需一份战斗／玩家作用域额度，不能给每个 Unit 各复制 3 次 | Lua 中额度字段、消耗与复活的微时序、例外资格 |
| 卡莱莎 `act1autochess_band15_buff`，`atk=0.2`、`max_stack_cnt=10` | 己方击倒触发，对场上剩余单位分别叠 ATK；全局触发状态与接收者贡献分开 | 动态出生、重复触发及各接收实例结束的完整调用链 |
| 桑葚 `act1autochess_band17_buff`，`prob=0.25` | 描述指定战斗开始时选最右边单位，不能默认改成持续覆盖后来出生单位 | 开始时选择入口、后续资格和盾反应程序 |

这些数据都使用 `env_gbuff_new_with_verify`。**证实**：该字段连到具体内容 key；字段名不能自行决定内容是持续分发、一次目标采样还是全局事件机制。[盟约研究](../../external/upstream/docs/research/02-bonds.md)中关于层数变化后立即重算全部 Buff 的 ASSUMED 条目也不能当作已确认的刷新协议。

`GlobalEnvSystem` 独立保存 executors、managers、blackboard、身份与寿命设置，由 `GlobalEnvSystemController` 创建、Tick、移除，并提供环境变更和 Action／Projectile 等入口。**推断**：全局周期、共享计数、阶段与环境启停自然属于非 Unit 的机制事实；不能强制全部环境规则都展开成每个 Unit 的属性 Buff。

### 对当前架构的约束

Effect 实例负责自身生命周期和安装关联；接收端 Capability 保存已安装的本领域贡献与参与事实，由领域 operation 修改和合成。全局共享额度、源周期和分发进度保留在来源作用域，不能复制到接收端，也不需要重新引入统合的 Attributes 管理器。数值贡献、状态贡献和导航投影分别交给对应领域消费。

当前导航区域索引可作为纯空间投影，但尚无 Aura／GlobalBuff 分发过程与接收实例关联。现有 `MechanismRuntime` 的 active 不足以承担全局共享额度或周期进度；单位 Effects 容器也不能代替源到接收者的安装关系。

投射物的跨 tick 行进、命中去重和 continuation 已确认是独立执行事实，见 [Case B](cases/02-action-and-projectile-phases.md)。这不自动决定全部投射物是否要组合成 Unit；应按具体内容的碰撞、引用与能力需求判断。

## 10. 当前实现与准确缺口

| 领域 | 当前已具备 | 仍需内容或行为核查 |
| --- | --- | --- |
| 静态地图 | marker、通行／部署基础值、静态边、所选 prefab 掩码 | HOLE 键到真实组件绑定、更多 prefab 及动态有效地块政策 |
| 工事／平台 | 固定生命实例、导航贡献、所选部署覆写、支撑／占位关系 | 工事接触破坏、全部地图演变触发、完整平台移除内容政策 |
| 部署生命周期 | 明确创建、重定位、撤退及预置出现／移除命令 | 原始卡牌供给、返回／再部署、隐藏配方与实际技能触发链 |
| 几何 | 当前阻挡半径、Circle／Box／GRID 纯查询 | 真实多 hitCollider、Body、旋转缩放、物理避障与扫掠 |
| 索敌／接收 | 有限 DAMAGE／HEAL、状态贡献、独立禁疗／无敌接收 | 特殊 selector、职业及状态免疫内容、更多恢复政策 |
| 行进 | 30 Hz、主／临时上下文、等待与移动许可分开 | 完整 steering／物理衔接、特殊敌人覆盖、恐惧／诱导控制器 |
| 地形机制 | 四类静态配置、所选 controller／skill 参数 | 感染、烟雾、沼泽叠层、深水 Buff／周期伤害的运行转换 |
| 非空间机制 | id／definition／active 及来源清理 | 全局共享额度、周期、触发、分发关联与机制生命周期 |
| 区域与投射物 | 导航区域投影；基本即时行动 | Aura／GlobalBuff 接收实例与成员维护、区域伤害、独立投射物执行及具体采样政策 |

这些缺口不要求重新合并 Tile、设备、单位和机制；它们要求在已有边界内补足具体规则、当前事实与内容编译，并保持加载支持范围可核查。

## 11. 可复查证据入口

- 真实场景：[m01](../../test/fixtures/arknights/level_act1autochess_m01.json)、[m02](../../test/fixtures/arknights/level_act1autochess_m02.json)、[act2 m02](../../test/fixtures/arknights/level_act2autochess_m02.json)、[act2 m04](../../test/fixtures/arknights/level_act2autochess_m04.json)。原始全表位于本地 `/tmp/stronghold-original-*.json`。
- 引用绑定：[工事 prefab](../../test/fixtures/arknights/prefab_trap_1105_accrate.json)、[平台 prefab](../../test/fixtures/arknights/prefab_trap_1106_achplat.json)、[地形 skill fixtures](../../test/fixtures/arknights/prefab_sktok_mire.json)与[sktok_tidectrl_3](../../test/fixtures/arknights/prefab_sktok_tidectrl_3.json)。
- 创建与控制器：[预置／prefab 报告](/tmp/stronghold-batch4-predefined-report.md)、[部署／深水报告](/tmp/stronghold-6b-deployment-report.md)。
- 原生几何与资格：`/tmp/stronghold-blocking-targeting-native/`、`/tmp/stronghold-target-eligibility-native/`，含方法、字段、枚举和 Unity overlap 绑定。
- 路线、导航和运动：[pathfinding 报告](/tmp/stronghold-official-pathfinding/REPORT.md)、[地图审计](/tmp/stronghold-map-audit-20261006.md)、[运动审计](/tmp/stronghold-motion-audit-20261006.md)、[路线审计](/tmp/stronghold-route-audit-20261006.md)。船运／WORD 等历史段落明确不纳入本文范围。
- 受击与物理区别：[位移报告](/tmp/stronghold-6b-displacement-report.md)，实际 yokai 根组件、bodyType／mass、免疫、失衡与地图碰撞调用记录分别可查。
- 光环与全局分发：`/tmp/stronghold-aura-research/`、`/tmp/stronghold-global-effect-audit/`；关键方法、调用与字段投影已保存于[持久证据](evidence/client-excerpts.json)。
- 当前源码边界：[navigation-effect.ts](../../src/core/battlefield/navigation/effect.ts)、[mechanism.ts](../../src/core/battlefield/mechanism.ts)、[blocking.ts](../../src/core/battlefield/blocking/relations.ts)、[shape.ts](../../src/core/geometry/shape.ts)、[targeting.ts](../../src/core/unit/targeting/compile.ts)、[locomotion](../../src/core/unit/capability/locomotion/capability.ts)。
