# Tactical 接口约定

按操作职责组织参数和返回值。各领域文档定义具体业务契约；本文保留通用规则及尚未完成的接口整理。

同类概念遵循一致的设计规律，包括命名、字段、类型、数据结构、函数签名、行为约定及职责组织。出现特例就必须追查，检查是否存在约束遗漏、职责错位或建模不一致；不能以当前代码、历史习惯或局部可用证明特例合理。追查后有真实领域语义差异的，应保留差异，并通过明确的概念与结构表达。

要求某项 Capability 的接口应在类型上表达该要求，不因能够在内部返回空值、false 或静默跳过就放宽宿主类型。类型守卫保留输入已有的完整类型，异构参数之间的配对关系贯穿公开接口。

发布后的领域状态、Definition、Ref、事件和集合遵守不可变值约定，通过各层 readonly 数据声明和只读集合接口表达；不依赖 Object.freeze，不为强制该约定新增递归只读类型包装。局部构建过程可使用可变对象和容器。

接口实现遵守以下边界：数据在实际入口校验一次，内部计算信任已经建立的约束。格子坐标在真正接收 unknown 的数据边界使用 Tile.is 建立安全整数元组约束，连续坐标使用 Vec2.is 建立有限数元组约束。已明确分量的创建和解析入口按需要使用现有 assert 工具，内部直接使用元组与通用 Vec2 运算，不再设坐标工厂或顶层守卫。内部消费 typed 坐标时直接信任，不重复断言。格式错误在创建／解析入口抛出 RangeError，地图越界由对应业务契约处理。不要在每个内部查询或辅助函数重复验证相同数据。

Vec2.equal(a, b) 按两个分量的 === 比较坐标是否相等。Vec2.lerp(from, to, progress) 只计算线性插值，不校验或钳制进度；具体领域负责进度范围和到期处理。

外部可变数据转入领域时完成必要转换；领域内部的 readonly 对象、数组和坐标直接共享，不以“快照”或假设调用方违约修改为理由重复复制、冻结。新状态只创建实际改变的部分。不得为推测的低概率并发或安全场景增加复杂度；确有必要时先说明并通知用户。只用一次的逻辑直接放在所属操作内，不提前包装；异常直接抛出，不使用 try/catch 或静默容错掩盖非法输入。

已知内容 Definition 建立的私有 State 在内容内部直接信任。例如已确认身份的护盾数据按 ShieldState 读取，不重新作为 unknown JSON 校验每个字段；外部 JSON 与配置仍在真正入口校验。

数值按当前游戏尺度处理：数据和配置入口校验有限数、正负与整数等业务约束，内部信任这些约束。已校验数值的加减乘算、Tick 累加和身份递增不为极端浮点溢出或安全整数上界追加结果检查。游戏规定的范围、容量、舍入与普通浮点误差纠正仍按具体业务执行。

Tile 的构造入口 tile.create 接收 `{ terrain, initial }` Definition，校验初始 walkCost，返回 `{ definition, state: definition.initial }`。只读 Definition、初始 State 与地形参数直接共享，不 freeze、不深拷贝、不规范化负零，也不由 Core 补充 Content 的部署条件。具体参数由 Content 的 Terrain Definition.create 校验；原始地图解析通过泛型入口加入 Tiles，内部不重复检查具体地形参数。

battlefield/map/map.ts 公开 Map、Marker、BlockEdge 和 create／contains／get，不引入品牌或 Fields 包装。create 校验正行列数、Tiles 数量、标记坐标与边的合法范围。Tiles 通过泛型 add 建立稠密序列，普通 get／values 返回完整 Tile<object>，内部 Tile<any> 保存异构参数，传入 Terrain Definition 时按对象身份恢复具体 Tile<P>。replace(index, state) 保留 Tile Definition，只更新通用 State，不要求调用方恢复地形参数类型；内部信任上层已经确认的索引与 State，不重复检查索引存在性或 walkCost。markers／blockEdges 空洞在读取属性时自然抛错，不另设防御分支。get 复用 contains 的边界判断，内部不重复校验坐标格式。

field.map 持有当前地块。battlefield/tile.update 是运行态地块变更入口，确认目标地块并校验新 walkCost 后，同步当前 Tile 与 Navigation baseline，并保留 overlay；这与 tile.create 的初始值校验属于不同入口。battle/tile.update 是完整战斗操作，在此基础上同步复核已有 Blocking 关系资格，不裁撤容量或重复校验。内容调用完整入口，不直接写 Tiles 后遗漏派生投影或关系复核。

## 1. 基本分类

按操作职责决定参数和返回值。领域负责自己的完整操作，其他领域依赖公开业务契约；跨领域流程负责组合与顺序，调度负责何时推进。

业务状态按逻辑领域归属。任何领域修改其它领域拥有的业务状态，都只能使用所属领域提供的合法 Change 或完整操作；Core 协调层同样遵守，不得直接重建、spread 或写入其它领域的 State 字段，再借 update／replace 发布。领域按业务职责划分，不按目录划分；构造装配与底层存储发布不接管领域业务状态的修改权。

| 类别 | 基本形状 | 约束 |
| --- | --- | --- |
| 局部值转换 | `f(state / self, ...) => 新值` | 只处理传入的值，不涉及完整战斗结算；包括局部查询、数值计算、不可变值更新。 |
| 变更工厂 | `f(业务参数) => Change<C>` | 声明所需宿主能力与纯转换，必要时附带同步结算；工厂不绑定 Ref、不读取 battle，也不自行发布。 |
| 战斗查询 | `f(battle, ref / ...) => 查询结果` | 读取当前战斗事实，不推进状态。 |
| 领域操作 | `f(battle, ref, ...) => BattleState / Result<T>` | 从最新 battle 定位对象，检查本领域资格并接续结算；嵌套终止的返回保证以 Lifetime 请求／Prepare 为界。 |
| 时间推进 | `f(battle, ref) => BattleState` | 推进战斗中的运行实例，由 Runtime 调度。 |
| Definition 回调 | `f(battle, self, ...) => BattleState / Result<T>` | 派发方已确定实例与 Definition 的类型配对，执行内容程序；Action 与 Skill 回调显式接收 `(battle, source, self, ...)`。 |

分类按职责划分，不按函数名、返回值或是否带一个对象参数机械判断。`currentTarget(progress)` 这类局部查询直接读取输入值，不要求传入 battle 或 ref。完整伤害结算可以返回报告；`card/state.advance(card, tick)` 仍是内部局部值转换，不是调度入口。

Capability 可以提供完整领域操作，例如 Locomotion.advance。Rule、Hook、Contribution、Blocker.layer 以及 SpatialPresence.appear／disappear 的状态变更统一为 `Change<C>` 工厂，由 `battle/unit.update(battle, ref, change)` 完成同一宿主的纯转换、一次发布及顺序结算；多项通过 compose 组合为一个 Change。是否附带结算由所属领域决定，无业务后继的 Hook 登记同样返回 Change，不再要求 Content 重建 Unit。取得、解除及通知仍由明确 Blocking 操作负责，通用发布不推断关系。

命名按实际调用时点区分：初始化使用 initialize，执行前准备使用 prepare；生命周期回调使用 onXxx，主动领域操作保留 start、advance、cancel、stop 等动词。initialize 构造初始私有数据，prepare 准备一次执行并允许拒绝，两者均不要求运行实例已登记。onStart 在成功登记后执行启动业务，onTick 表示一次由调度器安排的执行机会，onEnd 用于正常完成和取消的收尾。

Action 的准备程序为 prepare，推进与结束回调为 onTick／onEnd；Projectile 的登记后启动、推进与结束回调为 onStart／onTick／onEnd。onEnter／onLeave、onEnable／onDisable 与 onInstall 保留各自的场景、参与状态及安装语义，不因命名统一而合并或增加生命周期阶段，也不改变返回协议或调度职责。

Hook 与领域操作按执行语义命名：

| 类别 | 命名与含义 |
| --- | --- |
| 实例自身程序 | onStart／onTick／onEnd，由所属领域调用已配对的 Definition 程序。 |
| 公共生命周期通知 | 对象名＋Started／Ended，如 activationStarted／activationEnded、burstStarted／burstEnded。 |
| 业务事实通知 | 对象名＋过去分词，如 spPaid、ammoConsumed；completed 表示一次业务结算完成，不表示实例终止。 |
| 前置干预 | beforeXxx，如 beforeRelease；与已经发生的 released 事实分开。 |
| 具体 Hook 类型 | 对应通知或干预名＋Hook，如 BeforeReleaseHook、ReleasedHook；通用协议仍为 Hook<C, T>。 |
| 主动生命周期操作 | start／end 表示实例开始／结束，finish 表示正常完成，cancel 表示取消；activate 等已有领域业务动词保持原义。 |

公共通知只携带观察者所需的公开事实，不把完整 Definition 或私有 state 当作事件协议。Skill 的 ActivationStarted 为 `{ ref: Ref<Activation> }`，ActivationEnded 为 `{ ref: Ref<Activation>, end: End }`；Context.host 已提供宿主。本次载荷固定，实时事实另从最新 battle 查询；activationEnded 在清槽后派发，不能据其中的 Ref 假定本轮仍可查询。命名统一不改变通知时点、activate 操作或 SKILL_ACTIVATED 表现事件名，不为形式一致合并不同阶段。

同一语义复用已有动词。函数内部的辅助函数可以依靠上下文使用 check 等短名；提升为模块级辅助函数时应补充用途，例如 checkStart。共享写回沿用 replace，并按实际对象区分 replaceAction、replaceHost，不为同类操作另造动词。公共接口结合所属领域与具体职责命名。

以下情况按同一职责分类处理：

| 情况 | 形状或规则 |
| --- | --- |
| 全局或批量操作 | 没有单个主要对象时省略 ref，例如 `unit.advance(battle)`；仍按职责属于领域操作或时间推进，不新增一类。 |
| 依赖战场的查询 | 对象查找使用 `(battle, ref)`；动态 Contribution 求值使用已取得的实体和只读 battle。Unit 自身属性使用 `(battle, self)`，宿主与具体实例分离时使用 `(battle, source, self)`，不新增 Ref 转发入口或通用 Context。 |
| 纯值转换带业务结果 | 返回本领域的下一值及结果，例如 SP 获得量、拒绝原因。这里的 state 是局部 State，不套固定为 BattleState 的 `battle.Result<T>`。 |
| 创建操作与创建回调 | 对象尚不存在，接收宿主身份、Definition 和创建输入，返回创建身份或初始化结果；不要求传入不存在的 self / ref。 |
| 内容状态写回 | 只接收已经计算好的结果值。Action.setExecutionState 设置 execution.state，setState／setCooldown 分别设置持久 state／Cooldown；Effect.setState 设置私有 state，Skill.setState／setActivationState 分别设置持久 state／本轮激活 state，Mechanism.setState 设置私有 state，Projectile.update 接收 `{ position?, state? }`。Core 读取当前实例，只替换允许字段并保留其他事实。 |
| 完整实例写回 | Action 容器 `replace(definition, next)` 提交聚合条目，Effect／Projectile 容器按各自身份提交完整实例；均由 Core 内部使用。身份、Definition、执行进度与生命周期按对应领域契约维护。 |
| 程序回调有额外结果 | 可以返回 `Result<T>`；例如 Action Definition.prepare 的准备结果、onTick 的完成指示和 Hook 的业务指令。 |
| Damage／Healing 两阶段接续 | `applyDamage(request, calculation: Result<CalculatedDamage \| undefined>)` 与 `applyHealing(request, calculation: Result<CalculatedHealing \| undefined>)` 通过计算 Result 显式接续 state 和数值，分别返回领域 Outcome。四种 Request 的公式输入均放入 parameters，Outcome 均用 type 判别。插入其他操作时调用者须更新其中 state。 |
| Vitality／Elemental 资源提交 | `commitDamage(battle, context)`／`commitHealing(battle, context)` 复用对应业务的精确 CommitContext，返回 Capability 定义的 Application 报告；专属接收用 receiveDamage／receiveHealing，资格查询用 canReceiveDamage／canReceiveHealing。EP Healing 不增加空的 receiveHealing；Battle 编排 BeforeCommit 与通用 Applied。见[已定稿资源接口](vitality.md#18-已定稿的接收与资源提交接口)。 |

生命周期结束的公开 end／cancel／stop／remove 委托 [Lifetime](lifetime.md)：无活动结算时，本次调用完成 request 与 drain，返回时 Pending 为空；有活动结算时，只同步完成首次请求和 Prepare，不承诺槽位释放、注销或最终通知。重复 PREPARING 请求不等待原 Prepare。Finalize 整体返回才解除依赖者对 owner 的等待；Damage.completed 只报告本次伤害完成，不保证目标离场 Finalize 已完成。

### Rule 接口约定

Rule 使用公共 `Rule<C>` 类型，只有登记身份 `id` 和纯资格判断 `allows(battle, context): boolean`。所有业务输入放入所属领域的 Context，BattleState 单独传入；不再混用额外位置参数或多个可选的 allowsXxx 方法。Context 使用已有对象或 Ref 表达实际读取契约，不为统一形式增加重复查询。

单判断节点领域使用 `setRule(rule)`／`removeRule(id)`；多节点领域使用 `setRule(key, rule)`／`removeRule(key, id)`，key 与 Context 类型配对。Skill 的字段为 activationRules／operationRules／recoveryRules，Elemental 为 damageRules／healingRules；Rules 声明这些只读数组，State 直接继承 Rules，不另嵌套 rules 对象。ID 只在对应宿主、对应字段内唯一；同 ID 替换保留原位置，新 ID 追加，撤销缺失项不改变状态。

各节点按登记顺序检查，任一拒绝即停止，空集合允许；判断只读，不消费资源或推进 BattleState。Unit 能力的登记返回 Change，由 Unit.update 执行，必要后继仍由领域提供；Card 的登记沿自身完整操作写回。检查时点、默认资格及 Blocking 关系复核不由公共类型推断。

Card 的 RuleContext 按用途区分：DISPLAY／SELECT 接收 Card Ref，DEPLOY 接收真实 Request；Card.allows 仅接受前两种查询，部署资格统一由 Deployment 的 evaluate／preview 计算。注册的 Card Rule 仍可参与完整 DEPLOY 判断，不为展示或点选伪造落点。普通规则只知道公开的 Card 类型，查询入口仍接纳具体私有状态的 Typed Ref。

这项约定统一接口与登记语义，不新增公共集合工具、规则运行时类或执行引擎。Targetable Restriction 仍按 Contribution 的登记与互斥规则组合，其 allows 同样采用 `(battle, context)`，kind 豁免语义保持独立。

### 模块与公共入口

1. 按领域组织目录，按职责组织文件。query.ts 只负责只读查询，operations.ts 负责完整业务结算，局部状态变换归所属数据或 Capability 模块，Tick 调度归 Runtime。内部辅助步骤保持业务内聚，文件长度与函数名本身不决定拆分。
2. 一个领域需要从多个实现文件提供公共 API 时，以 index.ts 显式列出公开的值与类型，不使用 export *。只有一个清晰入口的小领域不强制增加 index；公共入口直接重导出现有实现，不增加运行时包装。
3. Content、Legacy 等上层消费侧默认从领域 index 导入，领域内部直接导入所属实现。Core 内部可以直接依赖明确的查询、模型或操作文件，以控制实际依赖方向；这是正常的依赖管理方式，不要求全部导入经过 index。不得为了 barrel 搬动 Unit／Projectile 的模型与完整 Battle 操作边界。
4. 调用权限由业务契约决定，不由是否出现在 index 决定。公共入口可以包含供 Core 协作或调度的接口；例如 Action.advance 仍只由调度器主动调用，Content 不能借公共导出主动推进。
5. 实现文件的 export 可以用于领域内部共享，不自动构成公共 API。内部模型、容器与配对读写协议按实际需要深导；不为覆盖全部内部导出扩大 index，也不为公共入口复制另一套类型。
6. 按实际用途整理各领域，不套统一拆分模板，不增加只缩短路径的转发层，不保留重复类型；仅调整公共导出与导入路径时不新增测试，不借入口整理扩张业务语义或无关实现。

### Core 领域入口与保留边界

下表列出当前公共入口及保留的直接依赖。index 只选择已有契约，不汇聚所有 Core 导出；Core 内部仍按实际依赖精确导入实现文件。

| 领域 | 公共入口 | 保留边界 |
| --- | --- | --- |
| 战斗运行 | [battle/index.ts](../../src/core/battle/index.ts) | 仅 initialize／step／simulateBattle、战斗契约类型、State／OperationResult 与 appendEvents；不聚合 Unit、Projectile、Creation 等独立操作。 |
| Unit | [unit/index.ts](../../src/core/unit/index.ts) | 模型、生命周期 Hook 键、通用 setHook／removeHook Change 工厂、Change／compose／optional、initialize 与 ref／all／get；Hook 集合迁移见[已定稿契约](hook.md)。完整登记、更新、离场、推进与 Unit lifetime 仍归 battle/unit.ts，Field 的纯存储操作仍归 battlefield/unit.ts。 |
| Action | [unit/action/index.ts](../../src/core/unit/action/index.ts) | 创建、查询、字段更新、lifetime、业务操作与调度协作；advance 由 operations.ts 实现，经 index 导出且仅由调度器调用。Actions、execution.State 与 Cooldown 按职责深导，不扩大内容写回或推进权限。 |
| Skill | [unit/skill/index.ts](../../src/core/unit/skill/index.ts) | create、Skill／Activation、两种 Ref 与 getSkill／getActivation、setState／setActivationState、资源与激活业务、lifetime；不转发 Capability guards 或 Rule／Hook／Ammo 贡献 Change 工厂。 |
| Effect | [unit/effect/index.ts](../../src/core/unit/effect/index.ts) | 类型、ref、get、lifetime 与生命周期操作；get 归 query.ts，Effects 容器保持内部职责。 |
| Lifetime | [lifetime/index.ts](../../src/core/lifetime/index.ts) | create／scope／getRef／available／dependencies／bind／unbind 和公开类型；dependencies 只查显式依赖、不含 owner。register／unregister、request／drain、Pending 与异构配对擦除保持 Core 内部职责。 |
| Projectile | [projectile/index.ts](../../src/core/projectile/index.ts) | 类型与 ref／all／get；完整 create／update／stop／advance 及 lifetime 保留 battle/projectile.ts，容器仍由 Battlefield 持有。 |
| Blocking | [battle/blocking/index.ts](../../src/core/battle/blocking/index.ts)、[capability/blocking/index.ts](../../src/core/unit/capability/blocking/index.ts) | Battle 入口提供关系查询及 acquire／release／maintain／maintainAll／search／advance；relations(battle, ref?) 局部直接读取原关联，release 接收 readonly Relation[]，批量解除后顺序通知，不附加维护或搜索。maintain 接收单条 Relation，仅复核原身份的当前资格；maintainAll 固定入口关系并逐条复核一遍。Capability 入口导出 Blocker 完整操作 releaseAll，并提供 setLayer、两端 Rule／容量／volume／Hook 的 Change 工厂及模型类型；工厂经 Unit.update 统一发布后结算，容量／volume 使用内部 settleCapacity 裁撤。容量仅用 ADD／ZERO，半径保存于 Definition.radius 和 State.radius。releaseAll 读取当前宿主；setLayer 的 Settlement 复用 releaseAll 清理当时当前关系，不回填旧 Unit；DEFAULT_RADIUS 与 settleCapacity 保持内部。 |
| Damage／Healing | [damage/index.ts](../../src/core/battle/damage/index.ts)、[healing/index.ts](../../src/core/battle/healing/index.ts) | 各自的 Calculate／Apply 两阶段、请求／报告及 Hook 登记；阶段派发保持内部实现，不合并结算协议。 |
| Targeting | [battle/targeting/index.ts](../../src/core/battle/targeting/index.ts) | Filter／Comparator／Selector、hasCandidate 与 select；只读 hasCandidate 归 query.ts，可能消费 RNG 的选择保留 select.ts。 |
| Deployment | [battle/deployment/index.ts](../../src/core/battle/deployment/index.ts) | 部署经济、addCard、完整 Request／Quote、统一 evaluate／preview／positions、deploy 与领域部署 Hook。retreat／canRetreat 归 Deployable，Deployment 入口保留协作导出；部署与撤退 Command 统一以 ref 携带 Typed Ref，部署据此生成完整请求，撤退直接调用领域操作。详见[部署契约](deployment.md)。 |
| Card | [battle/deployment/card/index.ts](../../src/core/battle/deployment/card/index.ts) | Card<S>、私有程序 Definition<S>、ref、get／all、有效值查询、规则、unitHooks、费用贡献、库存、部署间隔和串行恢复。addCard 接收含顶层 card 配置的完整静态 Unit Definition，Card 保留同一引用供部署使用；本次部署事实归 Deployable State。setUnitHook／removeUnitHook 管理注入以后部署实例的 Unit 生命周期程序。字段／资源操作接收 BattleState 与 Typed Ref，纯状态变换及完整替换由 Core 内部使用。详见[静态内容与 Card](deployment.md#静态内容与-card)。 |
| Schedule | [battle/schedule/index.ts](../../src/core/battle/schedule/index.ts) | 配置、执行状态、创建、推进、登记／结算与统计查询；isSpawnScheduleCompleted／getSpawnedCount／getSpawnScheduleCounts／getUnspawnedCount 归 query.ts，队列算法与辅助计算保持内部依赖。 |
| 多文件 Capability | unit/capability/ 下 action、blocking、deployable、elemental、layer、locomotion、occupancy、offense、presence、route、skill、vitality 各自的 index.ts | 按能力职责选择导出。Layer 提供自身空地身份的 setType Change，模型与 operations 分开；Occupancy 保存可空的摆放朝向并提供 setDirection Change；Skill 入口只提供工厂 Definition、Capability／State、守卫、初始化及 Rule／Hook／Ammo 贡献 Change 工厂，不导出领域程序、资源结算或 Activation 业务。完整实例写回、阶段派发和具体运动算法不因共享导出成为内容 API。 |
| 小 Capability 与 Catalog | allegiance／hitbox／targetable 的 capability.ts；unit/capability/catalog.ts | 单文件能力保留自然入口；Catalog 只维护初始化字典与派生类型，不增加模板 index 或另一套能力映射。 |
| Contribution、Hook 与 Tick | unit/contribution/contribution.ts、attribute.ts；core/hook.ts、tick.ts | 各自保留明确的数据／计算／派发入口，不设全 Core 聚合层。 |
| Common 与 Geometry | common/、geometry/ 下现有功能模块 | Ref、Query、集合、数值、坐标与几何按用途直接导入；私有 Store 不经公共入口公开。 |
| Map、Field 与空间查询 | battlefield/map/map.ts、tile.ts、terrain.ts；battlefield/state.ts、occupancy.ts、spatial/query.ts | 保留现有自然入口及只读／纯转换边界；Tiles 等内部容器不为 index 公开，完整地块结算仍归 battle/tile.ts。 |
| Navigation | battlefield/navigation/ 下现有状态、缓存、寻路与射线模块 | 按实际算法和依赖直接导入，不为统一模板增加聚合入口。 |
| Mechanism 与 Creation | battle/mechanism.ts；battle/creation/ 下具体创建模块 | Mechanism 保留单模块契约、lifetime 及内部容器；路线规范化、Mechanism 创建保留实际业务。普通 Unit 直接调用 unit.initialize，Predefined 只管理关卡预置与当前实例绑定，不另设通用创建包装。 |
| Runtime 内部协作 | battle/execution/、steps/ 及 battle/occupancy.ts 等同步协作实现 | 阶段编排和登记观察按需直接依赖，不作为独立内容入口；battle/unit-hook.ts 管理真实 leave 的全局观察；占格配对由 Occupancy 自身程序处理；共享依赖析构归 core/lifetime。 |

## 2. 参数与职责

完整操作的主要对象身份置于 battle 之后；其余参数是业务输入。指定 Unit 使用 `Ref<U>`，指定 Effect 使用它的组合 Ref；Action / Projectile 使用各自领域的 Typed Ref，不套用 Unit Ref。伤害、治疗、元素积累的主要对象为接收 Unit，来源身份等仍是业务输入，不要求把所有 ID 都拆成位置参数。

Action.cancelForUnit、forUnit 和 isCasting 均要求 `Ref<Unit & ActionCapability>`，异构 Unit 的调用方先通过 hasAction 缩窄。内部不重复检查类型已证明的能力；对象存在性和当前业务资格按各自操作处理。forUnit 从明确版本采样当前执行身份，Combat 仍使用阶段开始的版本。

完整操作使用 `battle.tick` 作为当前时间，避免同一调用同时携带 battle.tick、request.tick、context.tick。局部纯计算没有 battle，必要的 tick 参数保留。计划时点、发射采样、previousTick 等历史事实仍作为明确业务数据保存或传递。

程序回调直接取得 self。结束原因、伤害请求、目标身份、阶段输入等作为普通业务参数，不再与当前 Unit、战场状态、tick、调用范围混装成通用 Context。

结构化业务输入可以保留自己的类型，例如 DamageRequest、Departure、部署结果；内部只读算法也可以接收有明确职责的事实集合。统一的是职责与调用协议，不是禁止任何名为 Context 的类型。`accepts` 等只读条件与会改变 battle 的 `invoke` 不应因为共用载体就混成同一类接口。

嵌套调用返回后，battle 接续新版本；self 仍是本次进入时的值。后续实时事实从新 battle 查询，已明确采样的数据继续使用，遵守 [状态接续约定](functional-core.md#状态接续后的读取与续执行)。领域在 Finalize 内注销后仍可用局部取得的 self 派发历史通知；所有权等待保护的是上游 owner，不保证已物理移除的自身仍可查询，也不维护通用最后可得快照。

实例身份根据实际存储确定。Projectile 的 Typed Ref 以全场唯一的实例 ID 定位；Action 的本轮 Execution、Effect、Skill Activation 与 Elemental Burst 的实例 ID 仅在宿主内唯一，Ref 同时携带 host 与 id。Action 的 ref(source, definition) 生成跨多轮有效的 Ref<Action<P, E>>，地址为 host 与 Definition 对象，保留 P／E 配对；executionRef(source, self) 从显式宿主和当前 execution.id 生成只绑定本轮的 Ref<Execution<P, E>>。两种引用共享现有聚合条目，不要求条目保存 host，不增加存储或 ID 分配。

### 统一 Typed Ref 与类型恢复

Unit 查询返回绑定某个不可变状态版本的 Unit 对象序列。类型守卫保留筛选后的结构类型；调用方显式 ref(unit) 提取协变的运行身份。完整操作消费 Ref，并从传入的最新 BattleState 取得对象。

构造输入同样保留类型关联。Runtime 的 Input 按 Card、初始 Mechanism 和预置项分别推断各项 Definition／私有状态；Card 内容先声明完整 Definition<S>，聚合后仍保持 initialize 与回调配对，内联回调不获得 any 私有状态。PredefinedDefinition<T> 的 Unit 分支关联完整 Definition 与 Initial，Mechanism 分支保留完整 MechanismDefinition<S>；createPredefinedDefinition 与 Runtime 使用同一输入约束。构造完成后，Core 的 StoredPredefinedDefinition 才作为异构静态存储擦除类型，不使用缺失回调的投影再强转恢复，也不新增运行对象或配对品牌。

```typescript
// core/common/ref.ts
declare const identity: unique symbol;
declare const referent: unique symbol;
export type Identified<I extends object, T extends object = object> =
    Omit<T, typeof identity> & object & { readonly [identity]?: I };
export type Identity<T> = typeof identity extends keyof T
    ? T extends { readonly [identity]?: infer I extends object } ? I : never
    : never;
export interface Phantom<out T> {
    readonly [referent]: T;
}
export type Ref<T> = Identity<T> & Phantom<T>;

// Unit 以 id 定位，Effect 以 host + id 定位。
interface Unit extends Identified<{ readonly id: UnitId }> {}
interface Effect<S extends object, H extends object> extends Identified<{
    readonly host: Ref<Unit & H>;
    readonly id: EffectId;
}> {
    readonly host: Ref<Unit & H>;
}

// unit/index.ts 公开；实现在 unit/query.ts
export declare function ref<U extends Unit>(unit: U): Ref<U>;
export declare function all(battle: BattleState): Query<Unit>;

export declare function get<U extends Unit>(
    battle: BattleState,
    ref: Ref<U>,
): U | undefined;

// 需要较少能力的操作可以接收具有更多能力的身份。
declare const complete: Ref<Unit & Locomotion & Vitality>;
const locomotionRef: Ref<Unit & Locomotion> = complete;
// 反向赋值不成立。

const snapshot = battle;
const candidates = units.all(snapshot).filter(hasLocomotion);
for (const unit of candidates) {
    battle = locomotion.advance(battle, units.ref(unit), target, movementContext);
}
```

公共 Ref 由定位数据与只读类型证明组成。各领域通过可选 unique-symbol 的 Identified 协议声明地址类型，不增加运行时字段，也不使用集中列举所有领域的条件映射。Unit 查询层和实例创建 / ref(self) 入口产生引用；业务代码不能凭裸 ID 任意指定对象类型。定位数据与 Phantom 不增加运行时字段；完整实体本身仍保留 Definition、私有数据与类型关联。

`Identified<I, T>` 保留 T 的业务字段，先移除已有 identity 声明，再将身份替换为 I；省略 T 时默认 object。Execution 与 Activation 分别以 `Identified<本轮地址, Action<P, E>>`、`Identified<本轮地址, Skill<S, A>>` 保留完整聚合字段并声明本轮身份，不通过交叉类型合并持久身份与本轮身份。临时擦除身份使用 `Identified<never, T>`，业务字段仍保留，但其 Identity 与 Ref 均为 never；这些声明都不要求实例保存 symbol 字段。

Identity 先用 `typeof identity extends keyof T` 确认协议键存在，因此 `{}`、object、unknown 及普通业务结构均不能仅凭可选属性匹配得到身份。所有成员均声明协议的联合类型按成员提取身份；联合中只要有成员缺少该键，整个 Identity 与 Ref 就为 never，不从部分成员恢复可用身份。

Core 直接公开完整实体，Action／Execution、Skill／Activation、Effect、Projectile、Mechanism、Tile／Terrain 的默认私有参数均为 object，不另设元数据实体或兼容别名。普通查询返回完整的默认类型，具体字段形状只由已知 Definition／精确 Ref 证明；实际诊断 Snapshot 与 Presentation 保留各自用途，不作为另一套运行模型。

Core 的异构存储、统一执行边界、内部完整读取、创建组合边界及接纳不同私有类型的泛型上界可使用 any。ESLint 默认启用 no-explicit-any，仅在 src/core 下放宽；Content、Data、Legacy 保持该规则，使用具体类型或保留私有参数的泛型。ref／get 等泛型函数在上界擦除后仍返回原 T，普通公开返回不把默认值改为 any。字段 setter 以 Ref<T> 绑定对象，NoInfer<T[字段]> 只约束已经证明的字段载荷；创建操作继续由 Definition 配对泛型，不为这一类型边界增加运行时校验。

all 绑定创建查询时的不可变状态版本，返回 Unit 对象，保留逻辑登记顺序，不隐含生命周期、HP、空间存在、阵营或 Targetable 条件。get 只解析传入版本中的身份，LEAVING 对象在注销前仍可读取；对象已移除则返回 undefined。更新已有单位不改变登记顺序，删除后重新登记排在末尾；需要 ID 或其他优先级的业务显式排序。

core/common/query.ts 的 Query 是可重复执行的同步遍历描述，每次 [Symbol.iterator]() 建立独立游标，不自动缓存。filter 保留元素表示并支持类型守卫收窄，map 改变表示，flatMap 展开子序列，take 取当前顺序的前若干项；some、find、reduce、toArray 才消费查询。take(0) 不访问源。提前结束和回调异常遵守 IteratorClose，flatMap 同时关闭内部游标。

Ref 在调用领域操作处按需生成，不要求预先 .map(units.ref)；.toArray() 只在数组返回契约、序列化或需要索引访问等边界物化。固定本轮对象来源依靠不可变 Query 快照，不依靠生成数组；重复遍历会重新执行只读回调。Combat 的初始 Execution 等派生身份同样从保存的阶段初始 BattleState 查询，不能随循环中的 battle 改变采样版本。查询回调必须使用同一快照，不捕获随后改变的 battle 变量，不消费 RNG 或推进领域状态。完整操作由显式循环逐项接续最新 BattleState，不增加 Query.apply。

collection.sort 和 topK 接受 Iterable，返回只读数组。排序保持比较相等时的源顺序；topK 可遍历全部候选而只保存前 K 个。take 不能代替排序、TopK 或随机抽样。

ReadonlyMap 是可保留的只读关联容器协议，不要求为持久化容器提前增加 Store。Query 不负责存储更新；未来容器替换需单独处理当前 new Map(source) 更新路径，并保留 Unit Query 的逻辑登记顺序。完整操作仍负责当前生命周期和业务资格；SP、HP、是否允许移动等动态事实不由 Ref 保证。

未来改用持久化树等容器时，枚举顺序是必须保留的业务契约：Combat、Movement 和路线完成检查直接按 Unit 顺序推进；Blocking 的等距离候选、Sweep 的等 fraction 接触依赖稳定排序保留输入顺序。空间查询直接遍历 Field.units.values()，也须与 Unit.all() 遵循同一顺序。可以使用保序存储，或在 UID 顺序满足所需登记顺序时，由存储／查询边界统一保证升序枚举；不能让树节点、哈希桶或重平衡改变这些结果，也不在各调用点重新散布排序。容器迁移时应复核上述遍历、同分选择和本轮固定候选的约定。

跨 Battle 使用 Ref 属于调用契约错误；不为此加入 Battle 泛型品牌、owner token、注册表或跨 Battle 运行时检查。同一运行身份不复用于另一个 Unit，且 Ref 在实例所属 Battle 的合法接续版本中使用。

U 表示该身份存续期间稳定的结构 / Capability 约束。类型守卫的实现是可信边界；不能用某次 HP 等于固定值、当前正在移动等动态判断，建立 get 后永久有效的类型承诺。配置型 Capability 的组成检查只能支持其覆盖的结构约束，不证明所有自定义谓词永久成立。

Query.filter 的结构守卫负责建立证明，ref 保留类型；get 内部从异构 Unit 存储恢复 U，依赖上述身份与稳定结构契约。TypeScript 不会自行证明 Map.get 返回 U，恢复集中在 Unit 查询模块，不要求业务调用方断言或重复筛选。

Effect.install 返回 Ref<Effect<S, H>>；精确引用与 Definition 查询保留已有 S／H。普通 get(id)／values() 返回完整 Effect<object, object>，内部存储使用 Effect<any, any> 擦除异构参数；Core 统一通过 get(id) 取得默认 object 的完整实例并调用自身 Definition，不解释私有 state 或 H，不把内部 any 当作内容写回证明。

Projectile 使用 `create(battle, definition, { position, state }) → Result<Ref<Projectile<S>>>`；ref 保留已知实例类型，get 按引用读取当前对象。projectile/projectiles.ts 中的 Projectiles 以私有 Store 保存完整实例，Battlefield 持有容器状态，battle/projectile.ts 直接完成容器替换，普通查询返回默认 object 的完整 Projectile；精确 Ref 和 Definition 对象身份查询保留已有类型，内部擦除的完整实例用于自身程序派发，见 [Projectile 设计](projectile.md#3-异构集合与类型恢复)。

存储 Map、关系表和 UI 输出事件可以保留数字 ID；Command 是 Core 的操作输入，不要求使用裸 ID。部署与撤退命令使用 Typed Ref，其他命令按各自既有目标语义处理。Unit 查询由 unit/index.ts 公开 all／get，实现在 unit/query.ts，不再提供 battle.getUnit。已有 Ref 的业务保留身份传递；旧回调与 remove 的 Unit ID 入参仍沿用现有契约，不增加另一套查询协议。

## 3. 固定 Hook Context 与状态接续

Hook<C,T> 是 `(battle, context, current) => Result<T>`。C 是本次派发固定的身份和事件事实；Battle 与 current 逐项接续。固定 C 不携带候选范围或声称持续最新的 Unit／Effect；需要实时状态时按 typed Ref 查询最新 battle。已发生的业务事实即使对应实例结束或替换，仍保持本次原始含义。

公共 dispatch 的 options 只提供 candidates、find、可选 stop。候选在本次入口确定一次；find 每项确认最新登记与节点资格，accepts 只读，stop 决定是否结束整个派发。普通通知用 void；控制和业务取消由领域明确表达。详见[公共 Hook 契约](functional-core.md#6-hook-和生命周期的纯契约)。

Unit 本地登记使用[类型化 Hooks 集合](hook.md)，固有 Hook 在构造期装配，运行期间可经 setHook(key, hook)／removeHook(key, id) 返回的 Change 修改，包括生命周期键。enter／tick／prepare 沿用固定候选 ID、逐项读取最新登记的协议，Context 不随实时查询改写；leave 在注销前取本轮最新 Hook 对象快照，注销后执行并接续状态。全局 Unit 观察者及 Capability 专属登记保持各自的存储入口。

同步嵌套操作独立收集候选，不通过 BattleState、全局变量或其他容器继承外层派发的快照。

## 4. 未完成的完整操作整理

以下接口尚未满足统一约定，保留当前签名与目标，直到对应重构完成。

| 接口 | 当前形状 | 待调整内容 |
| --- | --- | --- |
| [advanceSpawning](../../src/core/battle/steps/spawning.ts) | `(battle, commands, tick)` | 实际调用重复传入当前 battle.tick；保留 Schedule 局部计算自己的时点参数。 |

接口整理保留真实可接受输入：允许普通 Unit 并用报告表达缺少能力的操作，继续使用 `Ref<Unit>`；要求明确能力的推进使用 `Ref<Unit & H>`。命名遵循 ESM 惯例，不以转发层统一签名。

阶段中命令处理与自动推进保持既定顺序；拆分函数和统一签名不改变时序。Unit 生命周期复用通用 Hook 类型和 Unit 本地集合，装配与动态派发见 [Hook 集合与登记](hook.md)；部署 Hook 及其余接口按下节记录，标签与 Profile 的已知问题见 [Capability 记录](capability.md#待整理单位标签与-profile-依赖)。

## 5. 数值输入、查询与字段写回

这里记录接口形状与职责；关键语义及本轮验收范围以[语义验收](verification.md)为准。签名中的字段、异常类型与无变化优化不自动形成独立测试项。

数值贡献的静态／动态输入统一复用 `unit/contribution/contribution.ts` 中的泛型类型：

```typescript
export type Input<M, H> =
    | readonly M[]
    | ((battle: BattleState, self: H) => readonly M[]);
```

`M` 由所属领域定义修正数据，`H` 保留对应宿主能力。需要动态输入的领域复用这个共享类型；互斥组先选择，再对保留输入在同一 BattleState 中只读求值并展开列表，由领域公式归并。输入函数不接收累计结果，也不执行支付或写回操作；具体求值与采样时点由所属查询或操作决定。Action 的 speed／interval 只接受静态 Modifier 列表，使用下述独立契约。

Contribution 求值返回 number，并按实际对象角色组织参数。Unit 动态属性使用 `resolveXxx(battle, self)`，self 是已取得的完整能力对象。Action 的时序使用 `resolveSpeed／resolveBaseInterval／resolvePeriod(source, self)`，source 是宿主 Unit，self 是具体 Action；基础时序来自 self.definition，静态贡献来自 source，不传无用途的 BattleState 或裸 Definition。求值不按 Ref 再次定位、不检查存在性或生命周期；缺失、能力资格、来源离场后的缓存和跨完整业务操作后的重新读取由业务入口负责。不为统一参数个数引入包装对象或新增实例字段。

Action speed／interval 的载荷为 `readonly attribute.Modifier[]`，不接受动态求值函数。set／remove 仍返回带 Settlement 的 Change；全批 Transformation 发布后，按最终贡献刷新该宿主 Action 的周期，保留当前冷却已完成比例。普通 Tick 只推进已保存的冷却，不再次轮询时序贡献。依赖玩法状态的时序变化由相应业务在事实改变处提交新的列表，不取消其他领域已支持的动态 Input。

Action 时序的必要回归语义是：静态贡献增删会在完整更新返回前调整当前周期并保留完成比例，同一批按最终贡献求值；普通推进不会反复改写周期。静态载荷的类型约束集中在公共类型检查中证明，不为 speed／interval 分别复制登记协议矩阵。

纯公式只接收实际需要的局部值：MaxHP 与 Blocking 的容量／体积统一为 `(definition, state)`；Ammo 使用 `(base, modifiers)`；Card 持有自身 Definition 与 State，继续接收 Card 值。局部公式不为形式一致增加 Battle 或 Ref。普通配置字段直接读取，不包装 Getter；SP 容量、门槛和默认费用直接来自 Definition，本次发动费用仍由 Activation.cost 程序与默认配置共同决定。SP 可空槽位在资源入口通过 hasSp 收窄后求值，两项回复属性同样返回 number。属性公式模块只保留 Modifier、create、apply。

战场查询直接归所属领域，返回完整实体或确有用途的关系投影。Unit 使用 all／get，Blocking 使用 blockerOf／blocked／usedCapacity／relations；relations(battle, ref?) 省略 Ref 时投影全场，提供 Ref 时直接读取局部关联并保留原 blocked Ref，不扫描全场后过滤。Projectile 使用 get 及容器查询。Occupancy.at(field, tile) 返回 occupant／support 双槽登记，消费方直接读取并按需取得当前 Unit；map 与 navigation 可直接读取 Field 的只读字段。战斗入口为 initialize(input) 与 step(battle, commands)，直接返回不可变 BattleState，commands 是必填数组；消费侧按所需语义形成局部输出，不提供第二套完整 Snapshot 或 Runtime 对象。

Tactical 的导出函数、Definition 回调、Change 工厂与容器公共方法遵循上述职责分类。Hook 的固定事件 Context、MovementContext 业务输入、创建时的宿主身份、容器内部数字键、私有状态结果值、纯 Geometry／Navigation／Card／Cooldown 计算均有明确职责，不能机械升级为 Battle 操作。battle/deployment/query.ts 的 evaluate(battle, request) 读取部署资源和 Battlefield 的当前地块与占格事实；归属按业务职责划分，参数按实际数据需求选择，不因位于 Battle 目录就增加包装。

Skill 的程序、单槽 Skill<S, A> 聚合、非空 Activation<S, A> 视图、资源与完整业务归 unit/skill；capability/skill 只配置 initialize 工厂，State 扩展默认 Skill，并补规则、Hook、贡献和轮次 ID。完整程序与元数据从 unit.skill.definition 读取，Unit Definition.skill 不保存程序。通用读取直接使用当前 unit.skill，getSkill／getActivation 通过精确 Ref 恢复类型，不提供 Instance 包装或泛型 reader。

Skill 的 ref(source, definition) 返回持久 Ref<Skill<S, A>>，用于 getSkill／activate／setState；activationRef(source, self) 返回 host＋本轮 ID 的 Ref<Activation<S, A>>，用于查询与轮次操作。两者读取同一个 unit.skill，聚合不重复保存 host。setState 以 Ref<T> 绑定 Skill，接收 NoInfer<T["state"]>，只更新持久 state，允许 LEAVING／结束程序更新；setActivationState 以 Ref<T> 绑定 Activation，接收 NoInfer<T["activation"]["state"]>，只更新 activation.state，ENDING 抛出 TypeError。缺失宿主或过期轮次抛出 RangeError，持久 Definition 不匹配抛出 TypeError。两者从最新 battle 保留其他字段，同引用时返回原 battle，只接受结果值，不提交旧聚合或扩大生命周期权限。

Skill.state 保存跨次玩法事实，Activation.state 保存本轮事实，由 Definition 程序解释；若模式就是激活存在，不重复保存 mode。SP Core 不解释私有字段，私有 state 不重复保存 SP.value。将来确需动态有效参数时，领域通过类型化 Definition 回调取值，本轮不新增该接口或独立配置状态机。发动资格和支付早于 Activation 创建，不能读取尚未建立的本轮 state。

SP setContribution／removeContribution 仍归 unit/skill/sp.ts，只接受 recoverySpeed／recoveryMultiplier 两项属性，并返回所需宿主为 Skill Capability 的 Change；它们使用 Attribute 修正数据与公式。Ammo 的 Input 使用独立 Modifier 和已核实的容量公式，来源直接登记在 Capability.ammo。capacity／requirement／cost 与 TIME duration 没有通用 Contribution 接口；配置切换、消费与当前轮次延时属于明确操作。共享 Input<M, H> 只统一数据提供形式，不决定这些操作或其公式。Contribution.group.priority 只负责互斥选择。非 TIME 的 sp.advance 直接 no-op，不更新 lastTick。Elemental 的完整宿主写回由领域操作通过内部 Unit.replace 完成，query.ts 负责查询；完整静态 Definition 的数值与爆发时长在 initialize 入口校验。两者均不向内容推广完整实例写回。Action 按 Definition 聚合持久 state、Cooldown 和当前 Execution；内容分别用 setState、setCooldown、setExecutionState 设置对应字段，不提交完整旧条目。Unit 的 leave Hook 以 Departure 为固定终止历史载荷，保留开始离场时的 Unit 与 reason。

Card 的 state.ts 与 Action 的局部 Cooldown 计算只处理显式传入的局部值，保留必要的 tick 参数。Card 公共写回接收 BattleState 与 Card Typed Ref，setState 接收结果值；unitHooks、setUnitHook／removeUnitHook 管理未来 Unit 的生命周期程序。setRedeployTimeContribution 影响以后启动的周期，reduceCooldown／clearCooldown／pauseCooldown／resumeCooldown 必须指定 COOLDOWN 或 RECOVERY，只操作所选当前段；enqueueRecovery 追加待恢复份数并保留已有计时。普通干员使用库存恢复；剩余库存的部署资格不受恢复队列存在影响。暂停操作保存剩余时间，来源特化由具体内容组合。Deployment.advance(battle) 使用 battle.tick 推进 Card 与 DP。部署资格查询先接续一次当前资源，再用完整 Request 求值；evaluate／preview 只读临时版本，deploy 在同一版本上判断并消费，positions 复用资源与规则集合。activeCount 接收 Ref<Card<any>>，仅按身份统计，接纳具体私有状态的 Card Ref。实例创建复用静态 Definition。Projectile 的发射时点、到期时点等采样事实也继续保存。

### 5.1 Unit 完整操作与批量变更

`battle/unit.ts` 提供完整 Unit 操作；`unit/index.ts` 导出 Change、compose 与 optional，update 不由该入口转发：

```typescript
add(battle: BattleState, unit: Unit): BattleState;
update<U extends Unit>(
    battle: BattleState,
    ref: Ref<U>,
    change: Change<NoInfer<U>>,
): BattleState;
remove(battle: BattleState, unitId: Id, reason: LeaveReason): BattleState;
advance(battle: BattleState): BattleState;
```

Rule、Hook、Contribution、Layer.type、Blocker.layer 与 Occupancy.direction 的公开工厂不接收 Ref，返回只要求相应能力的 `Change<C>`。Ref 由 update 接收，证明宿主满足所需能力；NoInfer 防止 Change 反向放宽目标类型。工厂不读取 BattleState，也不自行发布：

```typescript
battle = update(battle, reference, setLayer("AIR"));
battle = update(battle, reference, compose(
    setBlockerRule(rule),
    setLayer("AIR"),
));
```

Change 是保留完整宿主类型的纯函数，不绑定运行身份：

```typescript
type Change<in C extends Unit> = <U extends C>(self: U) => Applied<U>;
interface Applied<U extends Unit> {
    readonly next: U;
    readonly settlements: readonly Settlement[];
}
type Settlement = (battle: BattleState) => BattleState;

compose<A extends Unit, B extends Unit>(
    first: Change<A>,
    second: Change<B>,
): Change<A & B>;
optional<C extends Unit>(
    has: <U extends Unit>(self: U) => self is U & C,
    change: Change<C>,
): Change<Unit>;
```

直接调用 `change(self)`，不读取 BattleState、不执行业务回调，只返回下一宿主值与已经捕获旧事实的结算程序。泛型 U 保留输入中超出最低能力 C 的字段，`in C` 明确能力要求的逆变关系。Applied 是本次纯应用结果，尚未发布或结算；Settlement 不再接收 Unit 参数，其闭包已经保存所属变换的 previous。

Core 内部的 `createChange<C extends Unit>(transform, settle?)` 将纯变换与可选结算配对。transform 为 `<U extends C>(self: U) => U`，settle 为 `(battle, previous: C) => BattleState`。返回的 Change 函数先计算 next；当 next 与输入 self 为同一引用，或没有 settle 时，不登记本项结算；否则用闭包捕获本项输入 self。无变化转换必须返回原对象，不做字段深比较。Content 使用所属领域工厂，不提交完整旧 Unit。

compose 是二元、有序的组合：先调用 `first(self)`，再用其 next 调用 second，返回最终 next，并依次连接两者 settlements。组合满足结合律，不满足交换律；组合本身不增加发布或结算边界。

optional 用能力守卫限定已有 Change 的应用：实际调用时检查当前位置的 self，通过时直接返回 `change(self)`，否则返回原 self 与空结算列表。放在 compose 中时，守卫读取前序变换产生的 next，不在构造组合时提前采样。它仍是普通 Change，不引入展开节点，也不改变逐项 previous、no-op、发布与结算顺序。

普通数组注册由内部 [registration.ts](../../src/core/unit/registration.ts) 的 `createRegistrationOperations<U, P, K>(property)` 生成 set／remove Change。Capability 用 Rules、Contributions、Hooks 分组声明普通登记字段，State 直接继承这些分组；K 取 `keyof` 分组，Entry 直接从真实 U[P][K] 提取。set 由具体 Key 推断内联回调类型，再与字段／Entry 的映射元组联合交叉，保持联合 Key 的配对。返回的 Change 只要求相应宿主能力，不要求调用者提前绑定 Ref。单字段接口通过工厂的 `(property, key)` 重载固定字段，生成省略 key 的 set／remove，无需各领域重复数组修改逻辑。工厂复用按 ID 替换保序的数组操作，只完成纯变换和不可变复制，不增加运行时字段清单、能力校验、初始化、求值或派发。

Vitality 的 damageRules、普通贡献与专属 Hook，Elemental 的 Rules／Contributions／Hooks，Skill 的 Rules／Hooks，Action 的 Rules／Hooks，以及 Deployable、Locomotion、Offense、Targetable 的普通登记共用此工厂；Blocking 两侧的普通 Hook 也使用同一工厂。它不经 Unit 公共入口导出。MaxHP 的贡献与 HP 比例在同一次变换中更新；Ammo 注册保留 AMMO 适用条件，发动时采样容量，当前轮次仍由资源操作改变；Action interval／speed 与 Blocking Rule／容量／体积保留所属领域 Settlement。可空 SP、Unit Typed Key Hooks、Card／Battle 登记保持各自明确的状态和写回协议，不扩展通用路径或后继配置。

update 每次只处理 Ref 指向的一个 Unit：

1. 从传入 BattleState 读取宿主，缺失时抛出 RangeError，再调用 `change(self)`。组合中的各项依次读取前项产生的最新宿主值；此阶段不执行 Hook 或完整领域操作。
2. 一次发布最终 next，Field 维护 Unit 存储和 Occupancy 双槽。普通 update／replace 不扫描能力槽位或更新 Lifetime 关系。
3. 按 Applied.settlements 的顺序执行结算，每项接续最新 BattleState。各项 previous 在自己的纯变换前捕获，只表示有意采样的旧事实；实时对象必须重新查询，不整体回填 previous。

先完成同一宿主的全部纯转换，再执行任何结算。较早结算的 Hook 能看到最终字段，也能看到较晚结算尚未清理的关系。同次组合先降容量再恢复只按最终容量裁撤；跨两次 update 则先完成第一次的解除。GROUND→AIR→GROUND 仍保留两次真实切层对应的旧关系清理。即使最终 next 与入口 Unit 为同一引用，也必须执行此前已经登记的 settlements，不能据最终值丢弃逐项结算；只有 next 未变且结算列表为空时，整个操作才直接返回原 battle。

每次业务回调中的嵌套 update 独立完成自己的纯应用、发布和结算，不调度外层尚未执行的项。系统不保存全局 pending、updating 或隐式事务。领域后继还必须限制作用范围：Blocking 的容量 Settlement 只按最新容量从本 Blocker 列表末尾裁撤，volume 在 settle 读取当前 owner 并结算该阻挡组，不追随 Hook 中的新归属；两者共享内部 settleCapacity，完成每条解除的 Hook 后重读，不夹带资格扫描。Rule 后继固定自身关系列表，逐条 maintain 复核资格，不裁容量或维护其他关系。release 只执行给定旧集合，不自动维护。嵌套操作确实修改同一对象或关联时，双方接续同一最新事实，不承诺隔离。显式全场操作如地块更新使用 maintainAll，固定入口关系、按顺序各复核一次资格，不回头重扫或处理容量。

Rule 可读取任意 Battle 事实，但读取范围不表示自动订阅每次字段写入。每 Tick 的 Blocking 阶段先固定阶段初 Blocker 候选，再 maintainAll 复核旧关系，最后搜索新关系；晚于某条复核才发生的间接条件变化留到下一检查点，需要同步生效的业务明确调用关系操作。acquire 的 Hook 返回后只复核本次新 Relation；Locomotion 与 Blockable 位置推进只提交位置／计划，不调用 Blocking 维护。

Core 内部 `replace(battle, readonly Unit[])` 仅发布已合法构造的完整对象与派生索引，信任身份、Definition 和能力配对，不重复校验或派发内容 Hook。它不是公开原始 Unit 写回协议；生命周期、精确私有 state 写回及关系双端构造继续由各领域使用。Field 保留地图边界与最终双槽冲突校验。通用 update／replace 均不派发 Occupancy 或 Blocking 通知；当前生产中只有 add／remove 明确改变占格登记，仍在各自既定时点通知 SUPPORT，不为尚无内容需求的搬格创建新工厂。

Action.interval／speed Change 的 settle 调用 refreshCooldowns，按最终静态贡献重算当前冷却并保留完成比例；Combat 不逐 Tick 调用该刷新。Blocker.layer 的 transform 只改 layer／radius，createChange 根据该项 transform 的引用变化决定是否登记 settle，再由 settle 调用 releaseAll(battle, ref(previous)) 批量解除当前关系，不能重新调用 setLayer 或写回旧 Unit。MaxHP 的比例响应属于纯 transform，不附带治疗通知。Stun 先通过一批 Change 发布各能力限制，再由 Blocking 后继清理关系，update 返回后才取消 Action。

Layer 的 `setType(type: Type): Change<Unit & Layer>` 是设置自身身份并主动脱离阻挡的完整请求，同值也要结算。transform 每次建立新的 Layer State 和 Unit，只写 layer.type；全批发布后，settle 依据 previous 的稳定角色分支。Blocker 调用 releaseAll(battle, ref(previous))，Blockable 调用自身 release，均清理结算时当前关系；Blockable 同时取消位置计划。释放操作在入口固定候选，保留本次通知中新建的关系；后续另一项请求可再次脱离新取得的关系；无角色则无阻挡后继。操作不自动搜索，不修改 Definition、position、Route 或 Blocker.layer／radius；宿主的存在性由通用 update 及复用的关系操作处理，不在 Layer 重复读取判空。此类完整请求的字段同值不等于整项无业务动作，通用 Change／update 不增加例外协议。

Unit.initialize 将 Blocker／Blockable 的组合限制为至多一种，两者皆无合法；内部信任该构造约束及能力身份稳定，不在各操作重复检查。角色不决定阵营、宿主 Layer、Route 或 Locomotion，临时容量为 0 或禁挡也不改变角色。

Blocking.release(battle, readonly Relation[]) 在入口过滤失效旧身份与重复项，先发布整批双端解除结果，再按首次输入顺序逐条派发 Hook。每条开始时同时固定两端候选 ID，后续读取最新登记；ACQUIRED 按旧身份失效停止，RELEASED 作为历史通知继续。release 不接受额外 Unit 更新值，不自动维护、搜索或取消偏移。Presence 与 Route 的主动空间变更先纯发布空间字段，再按角色调用 Blockable.release 或 Blocker.releaseAll；前者自行取消当前计划并解除当前关系，后者批量解除当前出向关系并保留目标计划。各完整释放操作在首个通知前完成本次清理。

Blocker Capability 公开 `releaseAll(battle, reference: Ref<Unit & Blocker>): BattleState`，从当前 BattleState 读取一次宿主；缺失返回原状态，存在则将当前 blocked 原 Ref 组成关系交给 Blocking.release，不取消目标计划或附加搜索／维护。Blocker.prepare 调用公开 releaseAll；Departure.unit 只提供身份，不能把它的历史关系当作当前列表。

add 接收创建方完成初始化的完整 Unit，登记后按顺序执行 enter。Deployment 在初始化 fold 前登记自己的 enter，Occupancy 随后追加配对程序，各程序按登记顺序执行。Unit Definition.hooks 必填，无监听传 Hooks.empty()；同键同 ID 替换保留首次位置。全部固有 Hook 在 add 前就绪，生命周期键也允许运行时修改；enter／tick／prepare 按固定候选 ID 读取最新登记，enter／tick 每项前确认 PRESENT。prepare／leave 使用固定 Departure，leave 的程序快照在物理注销前从最新 Unit 捕获，注销后执行。能力创建输入保持可选；Deployable 在初始化入口要求已有 Occupancy。实际部署在初始化前提交 DP／库存／额度，在未登记 Unit 上写入本次部署事实，再由 add 登记并执行已组装的 enter 程序。

remove 按 Unit ID 请求 Lifetime 结束，首次请求保存 Departure、发布 LEAVING，再执行已登记 prepare。Blocking 自行清理关系与位置计划。真实依赖者完整 Finalize 后才注销 Unit、记录移除事实，执行本地 leave，最后派发全局 leave；Unit 不识别能力或扫描领域状态补救。主动撤退由 Deployable 接口在 remove 前直接结算退款、Card 费用阶段与库存恢复；被动死亡程序只接受已确认死亡，不对所有 leave 无条件回收。Occupancy 用已通知的旧 pair 清理，不把同格新实例当旧对端；Deployable 在本地 leave 归还该实例额度。嵌套 remove 只保证请求／Prepare，最外层结算结束才保证完成；主动撤退的资源结算不等待物理注销。advance 固定入口候选，再逐项读取最新 PRESENT Unit 执行 tick。

battlefield/unit.ts 的 add／update／remove 是纯存储与索引转换，Field.update 接收完整 Unit 数组，battle/unit.update 接收一个 Unit Ref 和一个 Change，同宿主组合由 compose 表达。特殊撤退—再部署的支持范围见 [Deployment](deployment.md#支持范围)。

## 6. Effect self 的身份与宿主约束

Effect 实例保存 `host: Ref<Unit> & Ref<Unit & H>`，使内部 H 擦除为 any 时仍保留 Unit 身份。安装入口使用 `Ref<Unit & NoInfer<H>>`，从最新 battle 读取宿主，并原样保存身份；H 由 Definition 决定，不能通过双方共同推导削弱能力要求。返回的 `Ref<Effect<S, H>>` 以 host + id 定位。

`effect.ref(self)` 从已知实例保留完整类型，`effects.get(battle, ref)` 恢复 S / H；`units.get(battle, self.host)` 返回 `(Unit & H) | undefined`。同地址的不同 Ref 值可以使用。内容通过 `effects.setState(battle, ref, nextState)` 提交私有数据结果值，Core 保留当前身份、Definition、expiration 和生命周期；ENDING 中仍可完成私有清理。

Unit 初始化不接收预装 Effects，始终建立空容器；初始内容在 enter 键下的 Unit Hook 中调用 Effect.install。Effect 的 Initial.source、实例与诊断 Snapshot 均使用 `Ref<Unit> | null` 标注施加者；来源不要求仍在场，也不隐含 Scope 或存活依赖，需要绑定时显式提供生命周期 Scope。

Effect.install 在入口检查宿主 PRESENT、输入 Scope 可用性与 expiration；Initial.expiration 省略时为 INFINITE。登记实例及 Lifetime owner／显式依赖后调用 onInstall，再重读当前实例；零有效时长或已到期的实例通过 Lifetime 结束，不进入 onEnable／onTick／onDisable。回调可提交新的时间状态，后继使用最新结果；准备启用实例的生效协调同样先处理到期。后续绑定统一使用 Lifetime.bind，由该入口检查两端资格与 DAG；Effect 不再保存 scopes。setExpiration 在写回入口校验时间状态。私有 replaceEffect(battle, unit, self) 信任已取得且配对的完整对象，只提交写回，不再次查找或验证存在性；updateStatus 用 Lifetime.available 检查自身及全部上游资格。Effects.replace 信任 Core 提供的 Ref／ID／host／Definition 配对，读取当前槽位以保留缺失实例及同引用时的 no-op，不重复校验身份。Effects.add 保留 id === nextId 的登记约束，身份直接递增；get(ref) 的宿主识别和 get(id, definition) 的类型查询继续保留。完整 Unit 更新或内容程序返回后，后继业务仍按最新 battle 重读；这与重复校验同一输入属于不同职责。

`Effect.setExpiration<T>(battle, ref: Ref<T>, expiration: NoInfer<T["expiration"]>)` 返回 BattleState，T 约束为 Effect，Ref 保留实例的具体泛型与时间类型，只替换时间状态，不修改 Lifetime 图或当前 status。Expiration 为 `DURATION { elapsed, total, rate }`、`DEADLINE { tick }` 或 `INFINITE`；普通 Effect 可以切换时间类型，Burst 的 Ref 只接受 DURATION。DURATION 三项在入口校验为有限非负数，tick 校验为非负安全整数，内部计算信任这些约束。非法输入及缺失宿主／实例均抛出 RangeError；同一 expiration 引用返回原 BattleState。ENDING 可写入但不会复活，Setter 不额外推进或立即结束。

Effect.advance 对 ACTIVE 实例先采样旧 Expiration、自动推进并发布 DURATION，再调用 `onTick(battle, self, previousExpiration)`，最后重读当前实例与时间状态判断结束。rate 为零仍调用 onTick；INACTIVE 不推进有效时长、不调用 onTick，绝对期限仍会到期，INFINITE 无到期。回调通过 setExpiration 提交结果值，可以续期或转换类型。第三参数是本次推进的历史样本，不保存为另一份持久状态。完整时间与必要回归语义见 [Effect 时间推进](effect.md#6-时间推进)。

Action 的 `setExecutionState(battle, ref, nextState)` 通过 Execution Ref 只设置本轮 execution.state，缺失时抛出 RangeError，execution 为 ENDING 时抛出 TypeError。getAction、start、setState、setCooldown、resetCooldown 和 clearCooldown 使用持久 Action Ref；setState 和 setCooldown 分别设置持久 state／Cooldown，允许结束程序更新这些持久事实。getExecution、advance 和 cancel 使用本轮 Execution Ref；refreshCooldowns 仍按宿主批量刷新。各操作在字段引用未变时返回原 BattleState；完整聚合替换由 Core 内部完成。

通用写回遵守“查询、计算、提交”：调用方从当前 battle 取得所需事实，局部计算结果值后提交；计算与提交之间不执行其他完整操作，跨领域调用后先接续 battle 并重读。通用 setter 不接收转换函数，不提供值或函数的双协议；Hook、生命周期程序与动态 Contribution Input 仍按各自业务协议执行。私有 Contribution 集合辅助 setter 同样接收已经算好的集合。

`NoInfer` 阻止结果值参与泛型推导。私有写回必须保留实例与 Definition 对应的原始类型关联；Ref 可协变用于公共查询，但不得借预先弱化的完整实例 Ref 写入不兼容的私有数据。后者属于调用契约错误，不为此增加运行时数据形状校验。普通 object 结果不提供具体私有形状证明，读写须保留原始泛型关联。

Projectile 的 update 接收 `{ position?, state? }` 结果值，并从最新 battle 读取实例。Core 只提取这两个允许字段，缺失实例抛出 RangeError，未提供字段保留当前值，两个字段均未变化时返回原 BattleState。ACTIVE 与 ENDING 均可更新；stop 接收 Projectile Ref，请求阶段发布 ENDING 并记录停止事实，Finalize 在依赖者完成后调用 onEnd、注销。嵌套 stop 不保证 Finalize 已完成。Runtime 在整个 Step 任何阶段回调之前保留 Projectile Query 快照，推进接口接收 Iterable<Ref<P>>，在操作处按需生成 Ref 并逐项读取最新 ACTIVE 实例；本次新建实例下次才正常推进，不保存 lastAdvancedTick。

Lifetime 使用各领域共享静态描述符与 Ref 配对，scope(lifetime, ref) 不读取 battle；getRef 通过匹配描述符恢复对应 Ref，available 查询 Pending 和当前领域资格。Action 绑定本轮 Execution，Skill 绑定本轮 Activation，标准 Burst 使用 Effect 的精确运行身份与描述符，不绑定持久配置。kind 与完整数值地址确定身份，不新增全局 ID 或动态注册器。BattleState.lifetime.dependencies 是 owner 与显式 scopes 的唯一关系权威；各领域创建／结束自行登记／注销，不由 Unit.update 或 replace 扫描投影。createBattleState 从空图开始，初始 Unit 必须经完整创建与 add 入场。直接子候选按边登记顺序，更新同一边保序、解绑后重绑追加。ENDING 关系保留到物理移除，Pending.parents 保留到完整 Finalize 返回。

Lifetime 的 begin 是纯值转换，replace 接收完整结果值；prepare／finalize 是 Core 操作适配，不是 Content 的新生命周期回调。Effect 的 onInstall／onEnable／onDisable 接收 `(battle, self: Effect<S, H>)`，onTick 额外接收本次推进前的 Expiration，onEnd 额外接收独立 reason。运行器不解释私有 state；Typed Ref／NoInfer 写回边界不变。

