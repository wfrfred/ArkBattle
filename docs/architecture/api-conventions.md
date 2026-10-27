# Tactical 接口约定

按操作职责组织参数和返回值。各领域文档定义具体业务契约；本文保留通用规则及尚未完成的接口整理。

接口实现遵守以下边界：数据在实际入口校验一次，内部计算信任已经建立的约束。格子坐标在真正接收 unknown 的数据边界使用 Tile.is 建立安全整数元组约束，连续坐标使用 Vec2.is 建立有限数元组约束。已明确分量的创建和解析入口按需要使用现有 assert 工具，内部直接使用元组与通用 Vec2 运算，不再设坐标工厂或顶层守卫。内部消费 typed 坐标时直接信任，不重复断言。格式错误在创建／解析入口抛出 RangeError，地图越界由对应业务契约处理。不要在每个内部查询或辅助函数重复验证相同数据。

外部可变数据转入领域时完成必要转换；领域内部的 readonly 对象、数组和坐标直接共享，不以“快照”或假设调用方违约修改为理由重复复制、冻结。新状态只创建实际改变的部分。不得为推测的低概率并发或安全场景增加复杂度；确有必要时先说明并通知用户。只用一次的逻辑直接放在所属操作内，不提前包装；异常直接抛出，不使用 try/catch 或静默容错掩盖非法输入。

数值按当前游戏尺度处理：数据和配置入口校验有限数、正负与整数等业务约束，内部信任这些约束。已校验数值的加减乘算、Tick 累加和身份递增不为极端浮点溢出或安全整数上界追加结果检查。游戏规定的范围、容量、舍入与普通浮点误差纠正仍按具体业务执行。

Tile 的构造入口 tile.create 接收 `{ terrain, initial }` Definition，校验初始 walkCost，返回 `{ definition, state: definition.initial }`。只读 Definition、初始 State 与地形参数直接共享，不 freeze、不深拷贝、不规范化负零，也不由 Core 补充 Content 的部署条件。具体参数由 Content 的 Terrain Definition.create 校验；原始地图解析通过泛型入口加入 Tiles，内部不重复检查具体地形参数。

battlefield/map/map.ts 公开 Map、Marker、BlockEdge 和 create／contains／get，不引入品牌或 Fields 包装。create 校验正行列数、Tiles 数量、标记坐标与边的合法范围。Tiles 通过泛型 add 建立稠密序列，普通 get／values 返回公共 View，传入 Terrain Definition 时按对象身份恢复具体 Tile 类型。replace(index, state) 保留 Tile Definition，只更新通用 State，不要求调用方恢复地形参数类型；内部信任上层已经确认的索引与 State，不重复检查索引存在性或 walkCost。markers／blockEdges 空洞在读取属性时自然抛错，不另设防御分支。get 复用 contains 的边界判断，内部不重复校验坐标格式。

field.map 持有当前地块。battlefield/tile.update 是运行态地块变更入口，确认目标地块并校验新 walkCost 后，同步当前 Tile 与 Navigation baseline，并保留 overlay；这与 tile.create 的初始值校验属于不同入口。battle/tile.update 是完整战斗操作，在此基础上维护 Blocking，不重复校验。内容调用完整入口，不直接写 Tiles 后遗漏派生投影或阻挡维护。

## 1. 基本分类

按操作职责决定参数和返回值。领域负责自己的完整操作，其他领域依赖公开业务契约；跨领域流程负责组合与顺序，调度负责何时推进。

| 类别 | 基本形状 | 约束 |
| --- | --- | --- |
| 局部值转换 | `f(state / self, ...) => 新值` | 只处理传入的值，不涉及完整战斗结算；包括局部查询、数值计算、不可变值更新。 |
| 战斗查询 | `f(battle, ref / ...) => 查询结果` | 读取当前战斗事实，不推进状态。 |
| 领域操作 | `f(battle, ref, ...) => BattleState / Result<T>` | 从最新 battle 定位对象，检查本领域资格，完成完整业务结算。 |
| 时间推进 | `f(battle, ref) => BattleState` | 推进战斗中的运行实例，由 Runtime 调度。 |
| Definition 回调 | `f(battle, self, ...) => BattleState / Result<T>` | 派发方已确定实例与 Definition 的类型配对，执行内容程序；Action 回调显式接收 `(battle, source, self, ...)`。 |

分类按职责划分，不按函数名、返回值或是否带一个对象参数机械判断。`currentTarget(progress)` 这类局部查询直接读取输入值，不要求传入 battle 或 ref。完整伤害结算可以返回报告；`card.advance(card, tick)` 仍是局部值转换，不是调度入口。

以下情况按同一职责分类处理：

| 情况 | 形状或规则 |
| --- | --- |
| 全局或批量操作 | 没有单个主要对象时省略 ref，例如 `unit.advance(battle)`；仍按职责属于领域操作或时间推进，不新增一类。 |
| 依赖战场的查询 | 动态 Contribution 可以依赖战场事实，公开入口使用 `(battle, ref, ...)`，读取当前对象后直接以 `(battle, self)` 求值；不包装 Unit 与 BattlefieldView，也不把战斗事实藏进通用 Context。 |
| 纯值转换带业务结果 | 返回本领域的下一值及结果，例如 SP 获得量、拒绝原因。这里的 state 是局部 State，不套固定为 BattleState 的 `battle.Result<T>`。 |
| 创建操作与创建回调 | 对象尚不存在，接收宿主身份、Definition 和创建输入，返回创建身份或初始化结果；不要求传入不存在的 self / ref。 |
| 内容状态更新 | Action.update 只转换 execution.state，updateState／updateCooldown 分别转换持久 state／Cooldown；Effect.update 只转换 data。Projectile 的 transform 接收完整只读实例，返回 position／state 的局部更新。Core 均先读取最新值；transform 只转换值，不执行其他 BattleState 操作。 |
| 完整实例写回 | Action 容器 `replace(definition, next)` 提交聚合条目，Effect／Projectile 容器按各自身份提交完整实例；均由 Core 内部使用。身份、Definition、执行进度与生命周期按对应领域契约维护。 |
| 程序回调有额外结果 | 可以返回 `Result<T>`；例如 Action.start 的初始化结果、Action.step 的完成指示和 Hook 的业务指令。 |
| Damage／Healing 两阶段接续 | `applyDamage(request, calculation: Result<CalculatedDamage \| undefined>)` 与 `applyHealing(request, calculation: Result<CalculatedHealing \| undefined>)` 通过计算 Result 显式接续 state 和数值，分别返回领域 Outcome。插入其他操作时调用者须更新其中 state。 |

## 2. 参数与职责

完整操作的主要对象身份置于 battle 之后；其余参数是业务输入。指定 Unit 使用 `Ref<U>`，指定 Effect 使用它的组合 Ref；Action / Projectile 使用各自领域的 Typed Ref，不套用 Unit Ref。伤害、治疗、元素积累的主要对象为接收 Unit，来源身份等仍是业务输入，不要求把所有 ID 都拆成位置参数。

完整操作使用 `battle.tick` 作为当前时间，避免同一调用同时携带 battle.tick、request.tick、context.tick。局部纯计算没有 battle，必要的 tick 参数保留。计划时点、发射采样、previousTick 等历史事实仍作为明确业务数据保存或传递。

程序回调直接取得 self。结束原因、伤害请求、目标身份、阶段输入等作为普通业务参数，不再与当前 Unit、BattlefieldView、tick、调用范围混装成通用 Context。

结构化业务输入可以保留自己的类型，例如 DamageRequest、Departure、部署结果；内部只读算法也可以接收有明确职责的事实集合。统一的是职责与调用协议，不是禁止任何名为 Context 的类型。`accepts` 等只读条件与会改变 battle 的 `invoke` 不应因为共用载体就混成同一类接口。

嵌套调用返回后，battle 接续新版本；self 仍是本次进入时的值。后续实时事实从新 battle 查询，已明确采样的数据继续使用，遵守 [状态接续约定](functional-core.md#状态接续后的读取与续执行)。终止回调的对象可能已经移除，self 可以是明确的终止快照，不能要求它始终能在 battle 中查到。

实例身份根据实际存储确定。Projectile 的 Typed Ref 以全场唯一的实例 ID 定位；Action 的本轮 Execution、Effect、Skill Activation 与 Elemental Burst 的实例 ID 仅在宿主内唯一，Ref 同时携带 host 与 id。Action 的 ref(source, self) 从显式宿主和当前 execution.id 生成 Ref<Executing<P, E>>，不要求聚合条目保存 host。

### 统一 Typed Ref 与类型恢复

Unit 查询返回绑定某个不可变状态版本的 Unit 对象序列。类型守卫保留筛选后的结构类型；调用方显式 ref(unit) 提取协变的运行身份。完整操作消费 Ref，并从传入的最新 BattleState 取得对象。

```typescript
// core/common/ref.ts
declare const identity: unique symbol;
declare const referent: unique symbol;
export interface Identified<out I extends object> {
    readonly [identity]?: I;
}
export type Identity<T> = T extends Identified<infer I> ? I : never;
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

// unit/query.ts
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

公共 Ref 由定位数据与只读类型证明组成。各领域通过可选 unique-symbol 的 Identified 协议声明地址类型，不增加运行时字段，也不使用集中列举所有领域的条件映射。Unit 查询层和实例创建 / ref(self) 入口产生引用；业务代码不能凭裸 ID 任意指定对象类型。定位投影与 Phantom 均保持协变，不把消费 T 的函数放进地址。

all 绑定创建查询时的不可变状态版本，返回 Unit 对象，保留逻辑登记顺序，不隐含生命周期、HP、空间存在、阵营或 Targetable 条件。get 只解析传入版本中的身份，LEAVING 对象在注销前仍可读取；对象已移除则返回 undefined。更新已有单位不改变登记顺序，删除后重新登记排在末尾；需要 ID 或其他优先级的业务显式排序。

core/common/query.ts 的 Query 是可重复执行的同步遍历描述，每次 [Symbol.iterator]() 建立独立游标，不自动缓存。filter 保留元素表示并支持类型守卫收窄，map 改变表示，flatMap 展开子序列，take 取当前顺序的前若干项；some、find、reduce、toArray 才消费查询。take(0) 不访问源。提前结束和回调异常遵守 IteratorClose，flatMap 同时关闭内部游标。

.map(units.ref) 才提取身份，.toArray() 才物化。查询绑定快照不依赖是否生成数组，重复遍历会重新执行只读回调；回调必须使用同一快照，不捕获随后改变的 battle 变量，不消费 RNG 或推进领域状态。完整操作由显式循环逐项接续最新 BattleState，不增加 Query.apply。

collection.sort 和 topK 接受 Iterable，返回只读数组。排序保持比较相等时的源顺序；topK 可遍历全部候选而只保存前 K 个。take 不能代替排序、TopK 或随机抽样。

ReadonlyMap 是可保留的只读关联容器协议，不要求为持久化容器提前增加 Store。Query 不负责存储更新；未来容器替换需单独处理当前 new Map(source) 更新路径，并保留 Unit Query 的逻辑登记顺序。完整操作仍负责当前生命周期和业务资格；SP、HP、是否允许移动等动态事实不由 Ref 保证。

跨 Battle 使用 Ref 属于调用契约错误；不为此加入 Battle 泛型品牌、owner token、注册表或跨 Battle 运行时检查。同一运行身份不复用于另一个 Unit，且 Ref 在实例所属 Battle 的合法接续版本中使用。

U 表示该身份存续期间稳定的结构 / Capability 约束。类型守卫的实现是可信边界；不能用某次 HP 等于固定值、当前正在移动等动态判断，建立 get 后永久有效的类型承诺。配置型 Capability 的组成检查只能支持其覆盖的结构约束，不证明所有自定义谓词永久成立。

Query.filter 的结构守卫负责建立证明，ref 保留类型；get 内部从异构 Unit 存储恢复 U，依赖上述身份与稳定结构契约。TypeScript 不会自行证明 Map.get 返回 U，恢复集中在 Unit 查询模块，不要求业务调用方断言或重复筛选。

Effect.install 返回 Ref<Effect<S, H>>；get(battle, ref) 从精确引用恢复对象，不再要求重复传 Definition。Effect 的 get 约束复用容器已有的共同结构，保留正常泛型实例与回调关系，不把默认 Effect<object, object> 当成所有实例的超型。未知条目的泛型派发与按 Definition 恢复由容器 read / get(id, definition) 封装。

Projectile 使用 `create(battle, definition, { position, state }) → Result<Ref<Projectile<S>>>`；ref 保留已知实例类型，get 按引用读取当前对象。projectile/projectiles.ts 中的 Projectiles 以私有 Store 保存完整实例，Battlefield 持有容器状态，battle/projectile.ts 直接完成容器替换，普通查询返回不含 state／回调的 View；精确 Ref、Definition 对象身份查询和 read 分别负责已知类型读取与通用派发，见 [Projectile 设计](projectile.md#3-异构集合与类型恢复)。

存储 Map、关系表、事件和 Command 中的数字 ID 是协议数据。Unit 查询统一使用 unit/query.ts 的 all／get，不再提供 battle.getUnit。已有 Ref 的业务保留身份传递；命令、旧回调与 remove 的 Unit ID 入参仍沿用现有契约，不为本轮模块收敛增加另一套查询协议。

## 3. 固定 Hook Context 与状态接续

Hook<C,T> 是 `(battle, context, current) => Result<T>`。C 是本次派发固定的身份和事件事实；Battle 与 current 逐项接续。固定 C 不携带候选范围或声称持续最新的 Unit／Effect；需要实时状态时按 typed Ref 查询最新 battle。已提交事件即使对应实例结束或替换，仍保持本次原始事实。

公共 dispatch 的 options 只提供 candidates、find、可选 stop。候选在本次入口确定一次；find 每项确认最新登记与节点资格，accepts 只读，stop 决定是否结束整个派发。普通通知用 void；控制和业务取消由领域明确表达。详见[公共 Hook 契约](functional-core.md#6-hook-和生命周期的纯契约)。

同步嵌套操作独立收集候选，不通过 BattleState、全局变量或其他容器继承外层派发的快照。

## 4. 未完成的完整操作整理

以下接口尚未满足统一约定，保留当前签名与目标，直到对应重构完成。

| 接口 | 当前形状 | 待调整内容 |
| --- | --- | --- |
| [Deployment.retreat / deploy](../../src/core/battle/deployment/operations.ts) | retreat 按 unitId；deploy 接收 request | 目标为 `retreat(battle, ref)`；deploy 接收 Card 身份与部署输入，属于创建操作。 |
| [refundUnit / recycleUnitCard](../../src/core/battle/deployment/deployment.ts) | `(battle, unit, reason, tick) => BattleState` | unit 是离场前明确取得的历史业务载荷，不应机械改成查询已移除 Unit；当前 tick 是 battle.tick 的重复来源，后续收口。 |
| [Deployment.advance](../../src/core/battle/deployment/deployment.ts)／[advanceSpawning](../../src/core/battle/steps/spawning.ts) | `(battle, tick)`／`(battle, commands, tick)` | 实际调用重复传入当前 battle.tick；保留 Card／Schedule 局部计算自己的时点参数。 |

接口整理保留真实可接受输入：允许普通 Unit 并用报告表达缺少能力的操作，继续使用 `Ref<Unit>`；要求明确能力的推进使用 `Ref<Unit & H>`。命名遵循 ESM 惯例，不以转发层统一签名。

阶段中命令处理与自动推进保持既定顺序；拆分函数和统一签名不改变时序。Unit 生命周期通过静态 Definition.hooks 的 enter／tick／leave 阶段复用通用 Hook，部署 Hook 及其余接口按下节记录；标签与 Profile 的已知问题见 [Capability 记录](capability.md#待整理单位标签与-profile-依赖)。

## 5. 未完成的回调与查询整理

| 接口 | 当前载体 | 待调整内容 |
| --- | --- | --- |
| [Mechanism.onUnitLeave](../../src/core/battle/mechanism.ts) | `(battle, mechanismId, departure)` | 回调已知 Mechanism，应传 self，再传离场业务载荷。 |

Offense、Action、Locomotion、Vitality 的动态 Input 均为 `(battle, self: Unit & 对应Capability) => readonly Modifier[]`；公开属性查询从最新 BattleState 按 Ref 读取宿主，属性公式模块只保留 Modifier、create、apply。互斥组先选择，再求值。

战场查询直接归所属领域，不经过聚合 View。Unit 使用 all／get，Blocking 使用 blockerOf／blocked／usedCapacity／relations，Projectile 使用 get 及容器查询。Occupancy.at(field, tile) 返回 occupant／support 双槽登记，消费方直接读取并按需取得当前 Unit；map 与 navigation 可直接读取 Field 的只读字段。战斗入口为 initialize(input) 与 step(battle, commands)，直接返回不可变 BattleState，commands 是必填数组；消费侧按所需语义形成局部输出，不提供第二套完整 Snapshot 或 Runtime 对象。

Tactical 的导出函数、Definition 回调与容器公共方法遵循五类约定。Hook 的固定事件 Context、MovementContext 业务输入、创建时的宿主身份、容器内部数字键、私有状态 transform、纯 Geometry／Navigation／Card／Cooldown 计算均有明确职责，不能机械升级为 Battle 操作。battle/deployment/query.ts 的 evaluateDeployment(field, request) 是 Deployment 的纯资格计算，读取 Battlefield 提供的当前地块与占格事实；归属按业务职责划分，参数按实际数据需求收窄，不因位于 Battle 目录就要求完整 BattleState。

Skill／Elemental 查询文件中的完整实例写回是 Core 内部协议，不向内容推广为通用操作。Action 按 Definition 聚合持久 state、Cooldown 和当前 Execution；内容分别用 updateState、updateCooldown、update 变换对应字段，不提交完整旧条目。Unit 的 leave Hook 以 Departure 为固定终止历史载荷，保留开始离场时的 Unit 与 reason。

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

remove 按当前 Unit ID 读取对象，先进入 LEAVING 防止重复离场，依次完成现有 Skill、Action、Elemental 与 Unit Lifetime 清理，再注销、回收卡片并派发历史离场事实。各同步操作后需要当前事实时重新读取最新状态。advance 固定本轮候选 Ref，逐个读取最新 PRESENT Unit 并派发 tick Hook，每项前确认宿主仍为 PRESENT。

Deployment 的卡消费与 DP 扣除在 add 前完成。add 登记及维护之后由 Deployment 记录卡归属单位的 UNIT_DEPLOYED，再执行 Skill 入场与 Unit 的 enter Hook；完整部署通知仍由 Deployment 在 add 返回后派发。此顺序保留登记维护中同步 Hook 与入场 Hook 各自可观察到的事件前缀，不增加分步入场或通用插点。

battlefield/unit.ts 提供纯 add／update／remove。Field 的 update 信任 Battle 已确认的身份与 Definition，不重复校验；Field 仍负责地图范围、最终占格冲突等空间结构。add 信任创建阶段建立的合法 Unit ID，保留重复登记的存储约束。BattleState 不保留另一套 Unit CRUD／查询／转换入口，旧 execution/unit.ts 已合并并删除。通用 setBattlefield 已移除，Unit 修改必须提供明确的最终 Unit 数组；Field 更新与 Effect 依赖同步仍由内部实现完成，不通过比较任意 Field 版本恢复修改意图。本轮不提供直接重定位操作；特殊撤退—再部署留待实际内容审查。

## 6. Effect self 的身份与宿主约束

Effect 实例保存 `host: Ref<Unit & H>`。安装入口使用 `Ref<Unit & NoInfer<H>>`，从最新 battle 读取宿主，并原样保存身份；H 由 Definition 决定，不能通过双方共同推导削弱能力要求。返回的 `Ref<Effect<S, H>>` 以 host + id 定位。

`effect.ref(self)` 从已知实例保留完整类型，`effects.get(battle, ref)` 恢复 S / H；`units.get(battle, self.host)` 返回 `(Unit & H) | undefined`。同地址的不同 Ref 值可以使用。内容通过 `effects.update(battle, ref, data => next)` 更新最新私有数据，不能借此改变身份、Definition、scopes 或生命周期；ENDING 中仍可完成私有清理。

Action 的 `update(battle, ref, state => next)` 只转换本轮 execution.state，缺失时抛出 RangeError，execution 为 ENDING 时抛出 TypeError，均不执行 transform。updateState 和 updateCooldown 按 source 与配置身份变换最新持久 state／Cooldown，允许结束程序更新这些持久事实。各操作在字段引用未变时返回原 BattleState；完整聚合替换由 Core 内部完成。

`NoInfer` 阻止变换结果参与泛型推导。私有更新必须保留实例与 Definition 对应的原始类型关联；Ref 可协变用于公共查询，但不得借预先弱化的完整实例 Ref 写入不兼容的私有数据。后者属于调用契约错误，不为此增加运行时数据形状校验。公共 `Ref<View>` 不能调用私有 update。

Projectile 的 update 同样从最新 battle 读取实例，transform 接收完整只读 Projectile，只返回 position／state 的局部更新。Core 只提取这两个允许字段，缺失实例抛出 RangeError 且不调用 transform，未提供字段保留原值，两个字段均未变化时返回原 BattleState。ACTIVE 与 ENDING 均可更新；stop 只需 `Ref<View>`，按 ACTIVE → ENDING → 终结事件 → onTerminate → 注销完成同步结算。Runtime 在整个 Step 任何阶段回调之前固定候选 Ref，逐项读取最新 ACTIVE 实例；本次新建实例下次才正常推进，不保存 lastAdvancedTick。

Effect Lifetime 使用 `{ type: "EFFECT", ref }`。Action Lifetime 保存本轮 Ref<ExecutingView>；Skill／Elemental Burst Lifetime 保存对应 typed 实例 Ref，Unit Lifetime 使用 `{ type: "UNIT", ref: Ref<Unit> }`。Effect 的 onInstall／onEnable／onDisable／onTick 直接接收 `(battle, self: Effect<S, H>)`，onEnd 额外接收独立 reason。self 自身保存 typed 宿主身份，ref(self) 生成 `Ref<Effect<S, H>>`；宿主与当前实例从最新 battle 查询，不再包装 Context／EndContext。

