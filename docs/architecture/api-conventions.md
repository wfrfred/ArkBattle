# Tactical 接口约定

按操作职责组织参数和返回值。各领域文档定义具体业务契约；本文保留通用规则及尚未完成的接口整理。

发布后的领域状态、Definition、Ref、事件和集合遵守不可变值约定，通过各层 readonly 数据声明和只读集合接口表达；不依赖 Object.freeze，不为强制该约定新增递归只读类型包装。局部构建过程可使用可变对象和容器。

接口实现遵守以下边界：数据在实际入口校验一次，内部计算信任已经建立的约束。格子坐标在真正接收 unknown 的数据边界使用 Tile.is 建立安全整数元组约束，连续坐标使用 Vec2.is 建立有限数元组约束。已明确分量的创建和解析入口按需要使用现有 assert 工具，内部直接使用元组与通用 Vec2 运算，不再设坐标工厂或顶层守卫。内部消费 typed 坐标时直接信任，不重复断言。格式错误在创建／解析入口抛出 RangeError，地图越界由对应业务契约处理。不要在每个内部查询或辅助函数重复验证相同数据。

外部可变数据转入领域时完成必要转换；领域内部的 readonly 对象、数组和坐标直接共享，不以“快照”或假设调用方违约修改为理由重复复制、冻结。新状态只创建实际改变的部分。不得为推测的低概率并发或安全场景增加复杂度；确有必要时先说明并通知用户。只用一次的逻辑直接放在所属操作内，不提前包装；异常直接抛出，不使用 try/catch 或静默容错掩盖非法输入。

已知内容 Definition 建立的私有 State 在内容内部直接信任。例如已确认身份的护盾数据按 ShieldState 读取，不重新作为 unknown JSON 校验每个字段；外部 JSON 与配置仍在真正入口校验。

数值按当前游戏尺度处理：数据和配置入口校验有限数、正负与整数等业务约束，内部信任这些约束。已校验数值的加减乘算、Tick 累加和身份递增不为极端浮点溢出或安全整数上界追加结果检查。游戏规定的范围、容量、舍入与普通浮点误差纠正仍按具体业务执行。

Tile 的构造入口 tile.create 接收 `{ terrain, initial }` Definition，校验初始 walkCost，返回 `{ definition, state: definition.initial }`。只读 Definition、初始 State 与地形参数直接共享，不 freeze、不深拷贝、不规范化负零，也不由 Core 补充 Content 的部署条件。具体参数由 Content 的 Terrain Definition.create 校验；原始地图解析通过泛型入口加入 Tiles，内部不重复检查具体地形参数。

battlefield/map/map.ts 公开 Map、Marker、BlockEdge 和 create／contains／get，不引入品牌或 Fields 包装。create 校验正行列数、Tiles 数量、标记坐标与边的合法范围。Tiles 通过泛型 add 建立稠密序列，普通 get／values 返回完整 Tile<object>，内部 Tile<any> 保存异构参数，传入 Terrain Definition 时按对象身份恢复具体 Tile<P>。replace(index, state) 保留 Tile Definition，只更新通用 State，不要求调用方恢复地形参数类型；内部信任上层已经确认的索引与 State，不重复检查索引存在性或 walkCost。markers／blockEdges 空洞在读取属性时自然抛错，不另设防御分支。get 复用 contains 的边界判断，内部不重复校验坐标格式。

field.map 持有当前地块。battlefield/tile.update 是运行态地块变更入口，确认目标地块并校验新 walkCost 后，同步当前 Tile 与 Navigation baseline，并保留 overlay；这与 tile.create 的初始值校验属于不同入口。battle/tile.update 是完整战斗操作，在此基础上维护 Blocking，不重复校验。内容调用完整入口，不直接写 Tiles 后遗漏派生投影或阻挡维护。

## 1. 基本分类

按操作职责决定参数和返回值。领域负责自己的完整操作，其他领域依赖公开业务契约；跨领域流程负责组合与顺序，调度负责何时推进。

| 类别 | 基本形状 | 约束 |
| --- | --- | --- |
| 局部值转换 | `f(state / self, ...) => 新值` | 只处理传入的值，不涉及完整战斗结算；包括局部查询、数值计算、不可变值更新。 |
| 战斗查询 | `f(battle, ref / ...) => 查询结果` | 读取当前战斗事实，不推进状态。 |
| 领域操作 | `f(battle, ref, ...) => BattleState / Result<T>` | 从最新 battle 定位对象，检查本领域资格并接续结算；嵌套终止的返回保证以 Lifetime 请求／Prepare 为界。 |
| 时间推进 | `f(battle, ref) => BattleState` | 推进战斗中的运行实例，由 Runtime 调度。 |
| Definition 回调 | `f(battle, self, ...) => BattleState / Result<T>` | 派发方已确定实例与 Definition 的类型配对，执行内容程序；Action 与 Skill 回调显式接收 `(battle, source, self, ...)`。 |

分类按职责划分，不按函数名、返回值或是否带一个对象参数机械判断。`currentTarget(progress)` 这类局部查询直接读取输入值，不要求传入 battle 或 ref。完整伤害结算可以返回报告；`card.advance(card, tick)` 仍是局部值转换，不是调度入口。

命名按实际调用时点区分：初始化使用 initialize，执行前准备使用 prepare；生命周期回调使用 onXxx，主动领域操作保留 start、advance、cancel、stop 等动词。initialize 构造初始私有数据，prepare 准备一次执行并允许拒绝，两者均不要求运行实例已登记。onStart 在成功登记后执行启动业务，onTick 表示一次由调度器安排的执行机会，onEnd 用于正常完成和取消的收尾。

Action 的准备程序为 prepare，推进与结束回调为 onTick／onEnd；Projectile 的登记后启动、推进与结束回调为 onStart／onTick／onEnd。onEnter／onLeave、onEnable／onDisable 与 onInstall 保留各自的场景、参与状态及安装语义，不因命名统一而合并或增加生命周期阶段，也不改变返回协议或调度职责。

同一语义复用已有动词。函数内部的辅助函数可以依靠上下文使用 check 等短名；提升为模块级辅助函数时应补充用途，例如 checkStart。共享写回沿用 replace，并按实际对象区分 replaceAction、replaceHost，不为同类操作另造动词。公共接口结合所属领域与具体职责命名。

以下情况按同一职责分类处理：

| 情况 | 形状或规则 |
| --- | --- |
| 全局或批量操作 | 没有单个主要对象时省略 ref，例如 `unit.advance(battle)`；仍按职责属于领域操作或时间推进，不新增一类。 |
| 依赖战场的查询 | 动态 Contribution 可以依赖战场事实，公开入口使用 `(battle, ref, ...)`，读取当前对象后直接以 `(battle, self)` 求值；直接使用实体与战场事实，不把它们藏进通用 Context。 |
| 纯值转换带业务结果 | 返回本领域的下一值及结果，例如 SP 获得量、拒绝原因。这里的 state 是局部 State，不套固定为 BattleState 的 `battle.Result<T>`。 |
| 创建操作与创建回调 | 对象尚不存在，接收宿主身份、Definition 和创建输入，返回创建身份或初始化结果；不要求传入不存在的 self / ref。 |
| 内容状态写回 | 只接收已经计算好的结果值。Action.setExecutionState 设置 execution.state，setState／setCooldown 分别设置持久 state／Cooldown；Effect.setData 设置 data，Skill.setState／setActivationState 分别设置持久 state／本轮激活 state，Mechanism.setState 设置私有 state，Projectile.update 接收 `{ position?, state? }`。Core 读取当前实例，只替换允许字段并保留其他事实。 |
| 完整实例写回 | Action 容器 `replace(definition, next)` 提交聚合条目，Effect／Projectile 容器按各自身份提交完整实例；均由 Core 内部使用。身份、Definition、执行进度与生命周期按对应领域契约维护。 |
| 程序回调有额外结果 | 可以返回 `Result<T>`；例如 Action Definition.prepare 的准备结果、onTick 的完成指示和 Hook 的业务指令。 |
| Damage／Healing 两阶段接续 | `applyDamage(request, calculation: Result<CalculatedDamage \| undefined>)` 与 `applyHealing(request, calculation: Result<CalculatedHealing \| undefined>)` 通过计算 Result 显式接续 state 和数值，分别返回领域 Outcome。插入其他操作时调用者须更新其中 state。 |

生命周期结束的公开 end／cancel／stop／remove 委托 [Lifetime](lifetime.md)：无活动结算时，本次调用完成 request 与 drain，返回时 Pending 为空；有活动结算时，只同步完成首次请求和 Prepare，不承诺槽位释放、注销或最终通知。重复 PREPARING 请求不等待原 Prepare。Finalize 整体返回才解除依赖者对 owner 的等待；Damage.completed 只报告本次伤害完成，不保证目标离场 Finalize 已完成。

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
| Unit | [unit/index.ts](../../src/core/unit/index.ts) | 模型、Hook 类型、initialize 与 ref／all／get；完整登记、更新、离场、推进与 Unit lifetime 仍归 battle/unit.ts，Field 的纯存储操作仍归 battlefield/unit.ts。 |
| Action | [unit/action/index.ts](../../src/core/unit/action/index.ts) | 创建、查询、字段更新、lifetime、业务操作与调度协作；advance 由 operations.ts 实现，经 index 导出且仅由调度器调用，end 是文件私有辅助步骤。Actions、execution.State 与 Cooldown 按职责深导，不扩大内容写回或推进权限。 |
| Skill | [unit/skill/index.ts](../../src/core/unit/skill/index.ts) | create、Skill／Activation、两种 Ref 与 getSkill／getActivation、setState／setActivationState、资源与激活业务、lifetime；不转发 Capability guards 或局部 Rule／Hook／持续预算贡献 setter。 |
| Effect | [unit/effect/index.ts](../../src/core/unit/effect/index.ts) | 类型、ref、get、lifetime 与生命周期操作；get 归 query.ts，Effects 容器保持内部职责。 |
| Lifetime | [lifetime/index.ts](../../src/core/lifetime/index.ts) | create／scope／getRef／available 和公开类型；request／drain、Pending、异构配对擦除与索引修改保持内部职责。 |
| Projectile | [projectile/index.ts](../../src/core/projectile/index.ts) | 类型与 ref／all／get；完整 create／update／stop／advance 及 lifetime 保留 battle/projectile.ts，容器仍由 Battlefield 持有。 |
| Blocking | [battle/blocking/index.ts](../../src/core/battle/blocking/index.ts) | 关系查询、公开操作与 Hook 类型；整批更新准备、差分、通知与维护继续在 operations.ts 内有序结算，内部阶段接口不从 index 导出。 |
| Damage／Healing | [damage/index.ts](../../src/core/battle/damage/index.ts)、[healing/index.ts](../../src/core/battle/healing/index.ts) | 各自的 Calculate／Apply 两阶段、请求／报告及 Hook 登记；阶段派发保持内部实现，不合并结算协议。 |
| Targeting | [battle/targeting/index.ts](../../src/core/battle/targeting/index.ts) | Filter／Comparator／Selector、hasCandidate 与 select；只读 hasCandidate 归 query.ts，可能消费 RNG 的选择保留 select.ts。 |
| Deployment | [battle/deployment/index.ts](../../src/core/battle/deployment/index.ts) | 模型、查询、资源维护、部署命令与生命周期协作；resources.ts 的完整 Card 写回 updateCard 不公开，lifecycle.ts 不依赖完整 Unit 操作。 |
| Schedule | [battle/schedule/index.ts](../../src/core/battle/schedule/index.ts) | 配置、执行状态、创建、推进、登记／结算与统计查询；isSpawnScheduleCompleted／getSpawnedCount／getSpawnScheduleCounts／getUnspawnedCount 归 query.ts，队列算法与辅助计算保持内部依赖。 |
| 多文件 Capability | unit/capability/ 下 action、blocking、deployable、elemental、locomotion、occupancy、offense、presence、route、skill、vitality 各自的 index.ts | 十一个入口按能力职责选择导出；Skill 入口只提供工厂 Definition、Skill Capability／State、守卫、初始化及局部 Rule／Hook／Ammo／时长贡献登记，不再导出领域 Definition、资源结算或 Activation 业务。完整实例写回、阶段派发和具体运动算法不因共享导出成为内容 API。 |
| 小 Capability 与 Catalog | allegiance／hitbox／layer／targetable 的 capability.ts；unit/capability/catalog.ts | 单文件能力保留自然入口；Catalog 只维护初始化字典与派生类型，不增加模板 index 或另一套能力映射。 |
| Contribution、Hook 与 Tick | unit/contribution/contribution.ts、attribute.ts；core/hook.ts、tick.ts | 各自保留明确的数据／计算／派发入口，不设全 Core 聚合层。 |
| Common 与 Geometry | common/、geometry/ 下现有功能模块 | Ref、Query、集合、数值、坐标与几何按用途直接导入；私有 Store 不经公共入口公开。 |
| Map、Field 与空间查询 | battlefield/map/map.ts、tile.ts、terrain.ts；battlefield/state.ts、occupancy.ts、spatial/query.ts | 保留现有自然入口及只读／纯转换边界；Tiles 等内部容器不为 index 公开，完整地块结算仍归 battle/tile.ts。 |
| Navigation | battlefield/navigation/ 下现有状态、缓存、寻路与射线模块 | 按实际算法和依赖直接导入，不为统一模板增加聚合入口。 |
| Mechanism 与 Creation | battle/mechanism.ts；battle/creation/ 下具体创建模块 | Mechanism 保留单模块契约、lifetime 及内部容器；各创建流程保留自身公开输入与结果，不并入 Runtime 入口。 |
| Runtime 内部协作 | battle/execution/、steps/ 及 battle/occupancy.ts 等同步协作实现 | 阶段编排和登记通知按需直接依赖，不作为独立内容入口；共享依赖析构归 core/lifetime。 |

## 2. 参数与职责

完整操作的主要对象身份置于 battle 之后；其余参数是业务输入。指定 Unit 使用 `Ref<U>`，指定 Effect 使用它的组合 Ref；Action / Projectile 使用各自领域的 Typed Ref，不套用 Unit Ref。伤害、治疗、元素积累的主要对象为接收 Unit，来源身份等仍是业务输入，不要求把所有 ID 都拆成位置参数。

完整操作使用 `battle.tick` 作为当前时间，避免同一调用同时携带 battle.tick、request.tick、context.tick。局部纯计算没有 battle，必要的 tick 参数保留。计划时点、发射采样、previousTick 等历史事实仍作为明确业务数据保存或传递。

程序回调直接取得 self。结束原因、伤害请求、目标身份、阶段输入等作为普通业务参数，不再与当前 Unit、战场状态、tick、调用范围混装成通用 Context。

结构化业务输入可以保留自己的类型，例如 DamageRequest、Departure、部署结果；内部只读算法也可以接收有明确职责的事实集合。统一的是职责与调用协议，不是禁止任何名为 Context 的类型。`accepts` 等只读条件与会改变 battle 的 `invoke` 不应因为共用载体就混成同一类接口。

嵌套调用返回后，battle 接续新版本；self 仍是本次进入时的值。后续实时事实从新 battle 查询，已明确采样的数据继续使用，遵守 [状态接续约定](functional-core.md#状态接续后的读取与续执行)。领域在 Finalize 内注销后仍可用局部取得的 self 派发历史通知；所有权等待保护的是上游 owner，不保证已物理移除的自身仍可查询，也不维护通用最后可得快照。

实例身份根据实际存储确定。Projectile 的 Typed Ref 以全场唯一的实例 ID 定位；Action 的本轮 Execution、Effect、Skill Activation 与 Elemental Burst 的实例 ID 仅在宿主内唯一，Ref 同时携带 host 与 id。Action 的 ref(source, definition) 生成跨多轮有效的 Ref<Action<P, E>>，地址为 host 与 Definition 对象，保留 P／E 配对；executionRef(source, self) 从显式宿主和当前 execution.id 生成只绑定本轮的 Ref<Execution<P, E>>。两种引用共享现有聚合条目，不要求条目保存 host，不增加存储或 ID 分配。

### 统一 Typed Ref 与类型恢复

Unit 查询返回绑定某个不可变状态版本的 Unit 对象序列。类型守卫保留筛选后的结构类型；调用方显式 ref(unit) 提取协变的运行身份。完整操作消费 Ref，并从传入的最新 BattleState 取得对象。

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
const candidates = units.all(snapshot)
    .filter(hasLocomotion)
    .map(units.ref)
    .toArray();
for (const ref of candidates) {
    battle = locomotion.advance(battle, ref, target, movementContext);
}
```

公共 Ref 由定位数据与只读类型证明组成。各领域通过可选 unique-symbol 的 Identified 协议声明地址类型，不增加运行时字段，也不使用集中列举所有领域的条件映射。Unit 查询层和实例创建 / ref(self) 入口产生引用；业务代码不能凭裸 ID 任意指定对象类型。定位数据与 Phantom 不增加运行时字段；完整实体本身仍保留 Definition、私有数据与类型关联。

`Identified<I, T>` 保留 T 的业务字段，先移除已有 identity 声明，再将身份替换为 I；省略 T 时默认 object。Execution 与 Activation 分别以 `Identified<本轮地址, Action<P, E>>`、`Identified<本轮地址, Skill<S, A>>` 保留完整聚合字段并声明本轮身份，不通过交叉类型合并持久身份与本轮身份。临时擦除身份使用 `Identified<never, T>`，业务字段仍保留，但其 Identity 与 Ref 均为 never；这些声明都不要求实例保存 symbol 字段。

Identity 先用 `typeof identity extends keyof T` 确认协议键存在，因此 `{}`、object、unknown 及普通业务结构均不能仅凭可选属性匹配得到身份。所有成员均声明协议的联合类型按成员提取身份；联合中只要有成员缺少该键，整个 Identity 与 Ref 就为 never，不从部分成员恢复可用身份。

Core 直接公开完整实体，Action／Execution、Skill／Activation、Effect、Projectile、Mechanism、Tile／Terrain 的默认私有参数均为 object，不另设元数据实体或兼容别名。普通查询返回完整的默认类型，具体字段形状只由已知 Definition／精确 Ref 证明；实际诊断 Snapshot 与 Presentation 保留各自用途，不作为另一套运行模型。

Core 的异构存储、内部完整读取、创建组合边界及接纳不同私有类型的泛型上界可使用 any。ESLint 默认启用 no-explicit-any，仅在 src/core 下放宽；Content、Data、Legacy 保持该规则，使用具体类型或保留私有参数的泛型。ref／get 等泛型函数在上界擦除后仍返回原 T，普通公开返回不把默认值改为 any。字段 setter 以 Ref<T> 绑定对象，NoInfer<T[字段]> 只约束已经证明的字段载荷；创建操作继续由 Definition 配对泛型，不为这一类型边界增加运行时校验。

all 绑定创建查询时的不可变状态版本，返回 Unit 对象，保留逻辑登记顺序，不隐含生命周期、HP、空间存在、阵营或 Targetable 条件。get 只解析传入版本中的身份，LEAVING 对象在注销前仍可读取；对象已移除则返回 undefined。更新已有单位不改变登记顺序，删除后重新登记排在末尾；需要 ID 或其他优先级的业务显式排序。

core/common/query.ts 的 Query 是可重复执行的同步遍历描述，每次 [Symbol.iterator]() 建立独立游标，不自动缓存。filter 保留元素表示并支持类型守卫收窄，map 改变表示，flatMap 展开子序列，take 取当前顺序的前若干项；some、find、reduce、toArray 才消费查询。take(0) 不访问源。提前结束和回调异常遵守 IteratorClose，flatMap 同时关闭内部游标。

.map(units.ref) 才提取身份，.toArray() 才物化。查询绑定快照不依赖是否生成数组，重复遍历会重新执行只读回调；回调必须使用同一快照，不捕获随后改变的 battle 变量，不消费 RNG 或推进领域状态。完整操作由显式循环逐项接续最新 BattleState，不增加 Query.apply。

collection.sort 和 topK 接受 Iterable，返回只读数组。排序保持比较相等时的源顺序；topK 可遍历全部候选而只保存前 K 个。take 不能代替排序、TopK 或随机抽样。

ReadonlyMap 是可保留的只读关联容器协议，不要求为持久化容器提前增加 Store。Query 不负责存储更新；未来容器替换需单独处理当前 new Map(source) 更新路径，并保留 Unit Query 的逻辑登记顺序。完整操作仍负责当前生命周期和业务资格；SP、HP、是否允许移动等动态事实不由 Ref 保证。

跨 Battle 使用 Ref 属于调用契约错误；不为此加入 Battle 泛型品牌、owner token、注册表或跨 Battle 运行时检查。同一运行身份不复用于另一个 Unit，且 Ref 在实例所属 Battle 的合法接续版本中使用。

U 表示该身份存续期间稳定的结构 / Capability 约束。类型守卫的实现是可信边界；不能用某次 HP 等于固定值、当前正在移动等动态判断，建立 get 后永久有效的类型承诺。配置型 Capability 的组成检查只能支持其覆盖的结构约束，不证明所有自定义谓词永久成立。

Query.filter 的结构守卫负责建立证明，ref 保留类型；get 内部从异构 Unit 存储恢复 U，依赖上述身份与稳定结构契约。TypeScript 不会自行证明 Map.get 返回 U，恢复集中在 Unit 查询模块，不要求业务调用方断言或重复筛选。

Effect.install 返回 Ref<Effect<S, H>>；精确引用与 Definition 查询保留已有 S／H。普通 get(id)／values() 返回完整 Effect<object, object>，内部存储使用 Effect<any, any> 擦除异构参数；Core 统一通过 get(id) 取得默认 object 的完整实例并调用自身 Definition，不解释私有 data 或 H，不把内部 any 当作内容写回证明。

Projectile 使用 `create(battle, definition, { position, state }) → Result<Ref<Projectile<S>>>`；ref 保留已知实例类型，get 按引用读取当前对象。projectile/projectiles.ts 中的 Projectiles 以私有 Store 保存完整实例，Battlefield 持有容器状态，battle/projectile.ts 直接完成容器替换，普通查询返回默认 object 的完整 Projectile；精确 Ref 和 Definition 对象身份查询保留已有类型，内部擦除的完整实例用于自身程序派发，见 [Projectile 设计](projectile.md#3-异构集合与类型恢复)。

存储 Map、关系表、事件和 Command 中的数字 ID 是协议数据。Unit 查询由 unit/index.ts 公开 all／get，实现在 unit/query.ts，不再提供 battle.getUnit。已有 Ref 的业务保留身份传递；命令、旧回调与 remove 的 Unit ID 入参仍沿用现有契约，不为本轮模块收敛增加另一套查询协议。

## 3. 固定 Hook Context 与状态接续

Hook<C,T> 是 `(battle, context, current) => Result<T>`。C 是本次派发固定的身份和事件事实；Battle 与 current 逐项接续。固定 C 不携带候选范围或声称持续最新的 Unit／Effect；需要实时状态时按 typed Ref 查询最新 battle。已提交事件即使对应实例结束或替换，仍保持本次原始事实。

公共 dispatch 的 options 只提供 candidates、find、可选 stop。候选在本次入口确定一次；find 每项确认最新登记与节点资格，accepts 只读，stop 决定是否结束整个派发。普通通知用 void；控制和业务取消由领域明确表达。详见[公共 Hook 契约](functional-core.md#6-hook-和生命周期的纯契约)。

同步嵌套操作独立收集候选，不通过 BattleState、全局变量或其他容器继承外层派发的快照。

## 4. 未完成的完整操作整理

以下接口尚未满足统一约定，保留当前签名与目标，直到对应重构完成。

| 接口 | 当前形状 | 待调整内容 |
| --- | --- | --- |
| [Deployment.retreat / deploy](../../src/core/battle/deployment/operations.ts) | retreat 按 unitId；deploy 接收 request | 目标为 `retreat(battle, ref)`；deploy 接收 Card 身份与部署输入，属于创建操作。 |
| [refundUnit / recycleUnitCard](../../src/core/battle/deployment/lifecycle.ts) | `(battle, unit, reason, tick) => BattleState` | unit 是离场前明确取得的历史业务载荷，不应机械改成查询已移除 Unit；当前 tick 是 battle.tick 的重复来源，后续收口。 |
| [Deployment.advance](../../src/core/battle/deployment/resources.ts)／[advanceSpawning](../../src/core/battle/steps/spawning.ts) | `(battle, tick)`／`(battle, commands, tick)` | 实际调用重复传入当前 battle.tick；保留 Card／Schedule 局部计算自己的时点参数。 |

接口整理保留真实可接受输入：允许普通 Unit 并用报告表达缺少能力的操作，继续使用 `Ref<Unit>`；要求明确能力的推进使用 `Ref<Unit & H>`。命名遵循 ESM 惯例，不以转发层统一签名。

阶段中命令处理与自动推进保持既定顺序；拆分函数和统一签名不改变时序。Unit 生命周期通过静态 Definition.hooks 的 enter／tick／leave 阶段复用通用 Hook，部署 Hook 及其余接口按下节记录；标签与 Profile 的已知问题见 [Capability 记录](capability.md#待整理单位标签与-profile-依赖)。

## 5. 未完成的回调与查询整理

| 接口 | 当前载体 | 待调整内容 |
| --- | --- | --- |
| [Mechanism.onUnitLeave](../../src/core/battle/mechanism.ts) | `(battle, mechanismId, departure)` | 回调已知 Mechanism，应传 self，再传离场业务载荷。 |

数值贡献的静态／动态输入统一复用 `unit/contribution/contribution.ts` 中的泛型类型：

```typescript
export type Input<M, H> =
    | readonly M[]
    | ((battle: BattleState, self: H) => readonly M[]);
```

`M` 由所属领域定义修正数据，`H` 保留对应宿主能力。各领域的 Input 别名使用这个共享类型；互斥组先选择，再对保留输入在同一 BattleState 中只读求值并展开列表，由领域公式归并。输入函数不接收累计结果，也不执行支付或写回操作；具体求值与采样时点由所属查询或操作决定。

Offense、Action、Locomotion、Vitality、Elemental 的公开属性查询从最新 BattleState 按 Ref 读取宿主，属性公式模块只保留 Modifier、create、apply。

战场查询直接归所属领域，返回完整实体或确有用途的关系投影。Unit 使用 all／get，Blocking 使用 blockerOf／blocked／usedCapacity／relations，Projectile 使用 get 及容器查询。Occupancy.at(field, tile) 返回 occupant／support 双槽登记，消费方直接读取并按需取得当前 Unit；map 与 navigation 可直接读取 Field 的只读字段。战斗入口为 initialize(input) 与 step(battle, commands)，直接返回不可变 BattleState，commands 是必填数组；消费侧按所需语义形成局部输出，不提供第二套完整 Snapshot 或 Runtime 对象。

Tactical 的导出函数、Definition 回调与容器公共方法遵循五类约定。Hook 的固定事件 Context、MovementContext 业务输入、创建时的宿主身份、容器内部数字键、私有状态结果值、纯 Geometry／Navigation／Card／Cooldown 计算均有明确职责，不能机械升级为 Battle 操作。battle/deployment/query.ts 的 evaluateDeployment(field, request) 是 Deployment 的纯资格计算，读取 Battlefield 提供的当前地块与占格事实；归属按业务职责划分，参数按实际数据需求收窄，不因位于 Battle 目录就要求完整 BattleState。

Skill 的程序、单槽 Skill<S, A> 聚合、非空 Activation<S, A> 视图、资源与完整业务归 unit/skill；capability/skill 只配置 initialize 工厂，State 扩展默认 Skill，并补规则、Hook、贡献和轮次 ID。完整程序与元数据从 unit.skill.definition 读取，Unit Definition.skill 不保存程序。内部 getCurrent 返回擦除参数后的完整聚合，getSkill／getActivation 通过精确 Ref 恢复类型，不提供 Instance 包装或泛型 reader。

Skill 的 ref(source, definition) 返回持久 Ref<Skill<S, A>>，用于 getSkill／activate／setState；activationRef(source, self) 返回 host＋本轮 ID 的 Ref<Activation<S, A>>，用于查询与轮次操作。两者读取同一个 unit.skill，聚合不重复保存 host。setState 以 Ref<T> 绑定 Skill，接收 NoInfer<T["state"]>，只更新持久 state，允许 LEAVING／结束程序更新；setActivationState 以 Ref<T> 绑定 Activation，接收 NoInfer<T["activation"]["state"]>，只更新 activation.state，ENDING 抛出 TypeError。缺失宿主或过期轮次抛出 RangeError，持久 Definition 不匹配抛出 TypeError。两者从最新 battle 保留其他字段，同引用时返回原 battle，只接受结果值，不提交旧聚合或扩大生命周期权限。

SP setContribution／removeContribution 仍是 unit/skill/sp.ts 的局部资源操作。SP／TIME 的 Input 使用 Attribute 修正数据与固定归并，这是项目的纯贡献约定；Ammo 的 Input 使用自己的 Modifier 和公式。贡献登记不再保存或校验程序 priority，最终 SP 数值和时长预算在消费边界校验；Contribution.group.priority 只负责互斥选择。非 TIME 的 sp.advance 直接 no-op，不更新 lastTick。Elemental 的完整宿主写回是 operations.ts 中的私有 replaceHost；query.ts 只保留查询。两者均不向内容推广完整实例写回。Action 按 Definition 聚合持久 state、Cooldown 和当前 Execution；内容分别用 setState、setCooldown、setExecutionState 设置对应字段，不提交完整旧条目。Unit 的 leave Hook 以 Departure 为固定终止历史载荷，保留开始离场时的 Unit 与 reason。

Card.advance 与 Action 的局部 Cooldown 计算只处理显式传入的局部值，保留必要的 tick 参数。Projectile 的发射时点、到期时点等历史事实也继续保存。

### 5.1 Unit 完整操作

`battle/unit.ts` 是完整 Unit 操作的统一入口：

```typescript
add(battle: BattleState, unit: Unit): BattleState;
update(battle: BattleState, updates: readonly Unit[]): BattleState;
remove(battle: BattleState, unitId: Id, reason: LeaveReason): BattleState;
advance(battle: BattleState): BattleState;
```

add 接收创建方已经完成 Capability 初始化、部署信息及路线初态的完整 Unit，负责登记、必要维护、Skill 入场和 enter Hook。Skill 入场后读取最新 PRESENT Unit，直接使用 core/hook.ts 的 dispatch 派发 Definition 中该阶段的静态 Hook；Context 固定，每项前确认宿主仍为 PRESENT。leave Hook 在注销后以开始离场时捕获的 Departure 为固定 Context，不丢失清理前 SP 等事实。Unit Definition 的 hooks 必填，无监听传 []；Unit 实例不增加 Hook 数组或动态登记接口。add 不接收已登记 Unit 的 ID；重复登记由存储约束拒绝，创建方逐个完成 add 再继续下一对象。

Battle 与 Battlefield 的 update 都只接收 readonly Unit[]，不提供单 Unit 重载或兼容接口。在完整 Battle 入口统一校验整批 ID 不重复、目标存在及 Definition 对象身份不变，任一违反时抛出 RangeError 并拒绝整批更新；随后同步完成整批数据与索引更新、Blocking 对侧关联和通知及必要维护。空批次或全部未变时返回原 BattleState。Content 自行读取最新对象、构造新的不可变 Unit，不再经由 BattleState 的 transitionUnit 转换包装。

普通更新以 update(battle, [unit]) 完成一个单位的一次领域操作。只有业务要求多个单位以同一组最终状态提交时才传入多元素数组，例如交换占格、建立或解除阻挡两侧。不能为了减少调用次数而合并彼此独立的更新：逐次更新之间会执行同步维护与 Hook，合并提交会改变它们观察到的状态和执行顺序。

remove 按 Unit ID 请求 Unit Lifetime 结束，首次请求保留 Departure、发布 LEAVING 并执行返费。真实所有权边按 Skill、Action、Burst、Effect 顺序展开请求；所有子项与显式依赖者完整 Finalize 后才注销、回收 Card 和派发历史离场事实。嵌套 remove 只保证请求／Prepare，不保证 Unit 已物理移除。各完整操作后按需要读取最新状态。advance 固定候选 Ref，逐项读取最新 PRESENT Unit 并派发 tick Hook。

Deployment 的卡消费与 DP 扣除在 add 前完成。add 登记及维护之后由 Deployment 记录卡归属单位的 UNIT_DEPLOYED，再执行 Skill 入场与 Unit 的 enter Hook；完整部署通知仍由 Deployment 在 add 返回后派发。此顺序保留登记维护中同步 Hook 与入场 Hook 各自可观察到的事件前缀，不增加分步入场或通用插点。

battlefield/unit.ts 提供纯 add／update／remove。Field 的 update 信任 Battle 已确认的身份与 Definition，不重复校验；Field 仍负责地图范围、最终占格冲突等空间结构。add 信任创建阶段建立的合法 Unit ID，保留重复登记的存储约束。BattleState 不保留另一套 Unit CRUD／查询／转换入口，旧 execution/unit.ts 已合并并删除。通用 setBattlefield 已移除，Unit 修改必须提供明确的最终 Unit 数组；Field 更新与生命周期依赖索引同步仍由内部实现完成，不通过比较任意 Field 版本恢复修改意图。本轮不提供直接重定位操作；特殊撤退—再部署留待实际内容审查。

## 6. Effect self 的身份与宿主约束

Effect 实例保存 `host: Ref<Unit> & Ref<Unit & H>`，使内部 H 擦除为 any 时仍保留 Unit 身份。安装入口使用 `Ref<Unit & NoInfer<H>>`，从最新 battle 读取宿主，并原样保存身份；H 由 Definition 决定，不能通过双方共同推导削弱能力要求。返回的 `Ref<Effect<S, H>>` 以 host + id 定位。

`effect.ref(self)` 从已知实例保留完整类型，`effects.get(battle, ref)` 恢复 S / H；`units.get(battle, self.host)` 返回 `(Unit & H) | undefined`。同地址的不同 Ref 值可以使用。内容通过 `effects.setData(battle, ref, nextData)` 提交私有数据结果值，Core 保留当前身份、Definition、scopes 和生命周期；ENDING 中仍可完成私有清理。

Unit 初始化不接收预装 Effects，始终建立空容器；初始内容在现有 `stage: "enter"` 的 Unit Hook 中调用 Effect.install。Effect 的 Initial.source、实例与诊断 Snapshot 均使用 `Ref<Unit> | null` 标注施加者；来源不要求仍在场，也不隐含 Scope 或存活依赖，需要绑定时显式提供生命周期 Scope。

Effect 的安装／绑定入口负责输入、宿主与实例资格、TICK、Scope 与 DAG 等实际约束，setDeadline 在期限写回入口校验 TICK；战斗初始化不再全场扫描预装实例。私有 replaceEffect(battle, unit, self) 信任已取得且配对的完整对象，只提交写回，不再次查找或验证存在性；同一 battle 中的宿主生命周期直接从已有 Unit 读取。Effects.replace 信任 Core 提供的 Ref／ID／host／Definition 配对，读取当前槽位以保留缺失实例及同引用时的 no-op，不重复校验身份。Effects.add 保留 id === nextId 的登记约束，身份直接递增；get(ref) 的宿主识别和 get(id, definition) 的类型查询继续保留。完整 Unit 更新或内容程序返回后，后继业务仍按最新 battle 重读；这与重复校验同一输入属于不同职责。

`Effect.setDeadline(battle, ref: Ref<Effect<any, any>>, tick: number | null)` 返回 BattleState，按当前实例替换或清除 TICK Scope，保留非 TICK Scope 和当前 status。tick 非 null 时须为非负安全整数；非法期限及缺失宿主／实例均抛出 RangeError。当前唯一 TICK 期限已经相同，或本来没有期限且清除时，返回原 BattleState。ENDING 可更新期限而不会复活；该操作不额外推进或立即结束实例，到期仍在正常 advance 的 onTick 后按最新期限判断。

Action 的 `setExecutionState(battle, ref, nextState)` 通过 Execution Ref 只设置本轮 execution.state，缺失时抛出 RangeError，execution 为 ENDING 时抛出 TypeError。getAction、start、setState、setCooldown、resetCooldown 和 clearCooldown 使用持久 Action Ref；setState 和 setCooldown 分别设置持久 state／Cooldown，允许结束程序更新这些持久事实。getExecution、advance 和 cancel 使用本轮 Execution Ref；refreshCooldowns 仍按宿主批量刷新。各操作在字段引用未变时返回原 BattleState；完整聚合替换由 Core 内部完成。

通用写回遵守“查询、计算、提交”：调用方从当前 battle 取得所需事实，局部计算结果值后提交；计算与提交之间不执行其他完整操作，跨领域调用后先接续 battle 并重读。通用 setter 不接收转换函数，不提供值或函数的双协议；Hook、生命周期程序与动态 Contribution Input 仍按各自业务协议执行。私有 Contribution 集合辅助 setter 同样接收已经算好的集合。

`NoInfer` 阻止结果值参与泛型推导。私有写回必须保留实例与 Definition 对应的原始类型关联；Ref 可协变用于公共查询，但不得借预先弱化的完整实例 Ref 写入不兼容的私有数据。后者属于调用契约错误，不为此增加运行时数据形状校验。普通 object 结果不提供具体私有形状证明，读写须保留原始泛型关联。

Projectile 的 update 接收 `{ position?, state? }` 结果值，并从最新 battle 读取实例。Core 只提取这两个允许字段，缺失实例抛出 RangeError，未提供字段保留当前值，两个字段均未变化时返回原 BattleState。ACTIVE 与 ENDING 均可更新；stop 接收 Projectile Ref，请求阶段发布 ENDING 并记录停止事实，Finalize 在依赖者完成后调用 onEnd、注销。嵌套 stop 不保证 Finalize 已完成。Runtime 在整个 Step 任何阶段回调之前固定候选 Ref，逐项读取最新 ACTIVE 实例；本次新建实例下次才正常推进，不保存 lastAdvancedTick。

Lifetime 使用各领域共享静态描述符与 Ref 配对，scope(lifetime, ref) 不读取 battle；getRef 通过匹配描述符恢复对应 Ref，available 查询 Pending 和当前领域资格。Action 绑定本轮 Execution，Skill／Burst 绑定对应运行身份，不绑定持久配置。kind 与完整数值地址确定身份，不新增全局 ID 或动态注册器。所有权和 Effect.scopes 是关系权威，BattleState.lifetime.dependencies 只派生索引；ENDING 关系保留到物理移除，Pending.parents 保留到完整 Finalize 返回。

Lifetime 的 begin 是纯值转换，replace 接收完整结果值；prepare／finalize 是 Core 操作适配，不是 Content 的新生命周期回调。Effect 的 onInstall／onEnable／onDisable／onTick 仍接收 `(battle, self: Effect<S, H>)`，onEnd 额外接收独立 reason。运行器不解释私有 data；原有 Typed Ref／NoInfer 写回边界不变。

