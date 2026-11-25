# 接口约定

本文统一接口职责、命名、类型边界和写回方式。具体领域的业务顺序归专题文档；Hook、Lifetime、资源结算分别见[Hook](hook.md)、[Lifetime](lifetime.md)、[Resource](resource.md)。

同类概念应遵循相同规律。命名、字段、签名或实现出现特例必须追查；只有真实领域语义差异才能说明特例必要，历史写法或现有测试不能作为理由。

## 1. 基本分类

| 职责 | 输入与返回 | 边界 |
| --- | --- | --- |
| 局部查询／转换 | 已取得的值 → 结果值 | 不推进世界，不为统一形式增加 BattleState 或 Ref |
| 变更工厂 | 业务参数 → `Change<C>` | 声明最低宿主要求，不绑定 Ref、不读取战斗 |
| 战斗查询 | BattleState、身份或查询条件 → 结果 | 只读当前版本 |
| 完整操作 | BattleState、主要身份、业务输入 → State／Result | 定位当前实例、检查领域资格并完成本次结算 |
| 调度推进 | BattleState、实例或候选 → State | 由调度器在所属阶段调用 |
| Definition 程序 | BattleState、已配对的 self、业务输入 → State／Result | 执行所属内容，不重新传入重复身份或 Definition |

无单个主要对象的批量操作可以省略 Ref。函数所在目录、名字及是否返回 State，不决定它属于哪类。私有 setter 接收计算完成的结果值；只写状态的操作直接返回 State，有调用者实际消费的结果时才使用 Result 或 Outcome。

实例生命周期阶段统一叫 `lifecycle`，两态生命周期使用 `ACTIVE`／`ENDING`。私有业务数据叫 `state`。Effect.enabled 表达启用意图，Lifetime 节点的 `ending` 保存首次结束数据。Definition 描述配置和程序，Initial 提供本次构造事实；不为普通定义另造 Runtime、Compiled、Program 等别名。

实例程序用 `onStart`、`onTick`、`onEnd` 等场景动词。事实通知用 `started`、`ended`、`paid` 等已发生名称，前置干预用 `beforeXxx`。主动操作按业务命名，同一语义复用已有动词，不以转发包装统一表面签名。

### 生命周期命名

领域若公开按 Ref 请求终结实例的通用入口，命名为 `remove`。结束原因和载荷由所属领域定义。`finish` 和 `cancel` 表达执行的具体结束结果，分别提交 `FINISHED` 和 `CANCELLED`。这些操作委托 `Lifetime.end`，完成边界遵守 [Lifetime](lifetime.md#finalize-与完成边界)。

| 执行时点 | 名称 |
| --- | --- |
| 登记实例之后 | Definition 程序 `onEnter` 或 Unit 通知 `entered`，Battle 级键名为 `battle.unit.entered` |
| 已发布 `ENDING`，自动请求依赖者结束之前 | Unit Hook `removing` |
| 依赖者完成收尾之后，实例注销之前 | Definition 程序 `onEnd` |
| 实例注销之后 | Unit 通知 `removed`，Battle 级键名为 `battle.unit.removed` |

`onEnable` 与 `onDisable` 对应生效与停用。Effect 在安装生效或重新生效时调用 `onEnable`，在可逆停用或移除 `ACTIVE` 实例时调用 `onDisable`。

### Restriction 接口约定

Restriction 只提供纯 `allows(battle, context)`，不携带登记身份。领域保存 `Contribution<Restriction<C>>`：id 管登记、替换与撤销，value 是共享定义及豁免身份，group 必填，null 表示不参与互斥竞争。

公共求值先选有效贡献，再按 AND 判断；空集合允许。豁免在竞争后执行，不激活落败项。普通布尔结果不依赖检查顺序；竞争按 priority 决定，等优先级才以 ID 确定赢家。同组候选存在明确业务优劣时，用 priority 表达，不依赖 ID 命名决胜；组竞争优先级不决定限制的检查顺序。

单节点使用 setRestriction／removeRestriction，多节点增加与 Context 配对的 key。ID 只在宿主对应字段内唯一；同 ID 替换保留位置，新 ID 追加，移除缺失项不改变状态。领域决定基础前提、检查时点、拒绝结果与后继；Restriction 不执行支付、RNG 或状态修改。

### 模块与公共入口

文件组织应帮助读者从业务概念找到所属模块，并连贯理解实现。经常一起阅读、修改的内容尽量靠近；模型、初始化、查询和操作可以共同构成一个文件，形成独立主题后再拆分。相似领域采用容易预测的组织方式，同时允许实际复杂度带来差异，不以文件短小或目录整齐衡量效果。

明确属于某领域的内容可由其他领域直接依赖；脱离具体领域仍成立的基础机制集中在 common，避免为共享而拆散完整概念。多个实现文件组成公共领域时，由 index 显式导出；不使用 export *，不为单一清晰入口强加 barrel。

Content／Data 默认从领域入口消费；Core 内部按实际依赖精确导入。实现文件的 export 不自动代表公共契约，公共导出也不改变调用权限：调度入口仍不能被 Content 任意推进。避免只缩短路径的转发层、重复模型和万能入口。

### Core 领域入口与职责边界

Unit／Projectile 的模型、查询与完整登记、更新、结束归自身领域。Occupancy 自行维护业务配对，Field 维护存储与索引。Battle 的业务子目录各自定义完整结算，Runtime 安排 Tick 顺序，Battle 的协调入口通过所属领域的操作接续状态。其余领域的公开能力与使用边界由各专题说明。

## 2. 参数与职责

要求某项 Capability 的接口必须在类型上表达，不能因内部可以返回 false 或跳过就放宽宿主。已经取得的实体直接参与局部计算；完整操作用 Typed Ref 定位，不额外转传 self、id 或 Definition 的同一事实。

Context 只保存本次业务所需的输入和明确样本，不把 `request.target` 再复制成 target，或用动态 getter 假装实时。可以直接从既有参数取得的事实不另建协议。创建时对象尚不存在，接收 Definition、宿主身份与 Initial，不要求不存在的 self。

初始化只负责构造实例、读取战场事实及分配身份、消费 RNG 等构造所需的状态接续；`card.beforeDeploy` 负责本次构造输入与相关卡牌效果的消费，召唤、伤害等独立入场业务应在实例登记后的入场程序中执行。

业务配置字段及表达有无值的业务状态字段必须显式提供：允许没有值时使用 `T | null`，开关使用必填 `boolean`，不以可选字段或隐式默认值表达业务选择。没有对应业务程序的回调可以省略，使用 `?`。局部覆写（包括数学中性值构造器的局部覆写）、外部原始数据及类型标记等有独立缺省语义的结构不适用配置字段的规则。

### 统一 Typed Ref 与类型恢复

Ref 对目标类型协变，每个运行实例在创建时分配一次 Ref，各不可变版本沿用同一个对象。实体的 Map／Store、相等判断、关系和等待集合统一以 Ref 对象为身份。数字 ID 仅用于有独立意义的表现输出、顺序或贡献登记，波次分支和 Definition 等静态配置保留自身 ID。子实例的 Ref 可以保存宿主或其他归属引用。

`reference.get(battle)` 在传入版本中按 Ref 对象身份读取对应实体。同一状态分出的两条分支各自创建的实例可以复用数字 ID，各自有独立的 Ref。签名 `(this: object, battle: BattleState) => T | undefined` 要求通过引用调用，同样适用于不同领域的联合 Ref。

`Identified<I>` 用可选类型标记描述 Ref 所需的附加信息 `I`，并要求实例保存公共身份类型的 `ref`。各领域在创建时调用 `createRef` 配对附加信息与共享读取函数。调用方通过 `ref(self)` 取得同一个 Ref，并保留当前已知的实体类型。带 Definition 的查询按 Definition 身份恢复私有类型。

能力组成在同一实例身份下稳定，泛型类型守卫保留输入已有的完整类型。动态 HP、位置、生命周期等谓词只证明当前版本的事实，不能据此建立跨状态更新仍有效的类型保证。

异构集合内部可以擦除泛型，公开入口必须先保持 Definition、私有状态和回调的配对，读取时恢复。默认公开实例用 object，不用 any 逃避内容检查；不得在 Content 回调逐项断言。具体创建分支提供具体 Definition，不增加专为联合 Definition 服务的校验框架。

Unit Initial 由 Catalog 推导：所选能力要求的输入必填，额外的已知能力输入允许提供并忽略，未知键由普通对象类型检查。精确构造约束见 [Capability](capability.md#初始化与装配)。

### 查询与候选

Query 是绑定输入版本的可重复惰性遍历，每次迭代有独立游标。all 返回完整实体，按登记顺序，不隐式筛选能力、生命、Presence 或阵营。Ref 读取指定版本，ENDING 在物理移除前仍可读。

filter 保留类型收窄，map／flatMap／take 组合候选；some／find／reduce／toArray 消费序列。take(0) 不访问源，提前退出或异常时关闭迭代器，flatMap 同时关闭当前内层。只有确实需要数组、索引或序列化时才物化。

Query 回调只读同一版本，不捕获持续变化的 battle；完整业务通过显式循环逐项接续最新状态。不可变 Query 本身足以固定候选，不要求先转数组或 Ref 列表。

sort／topK 接受 Iterable，同分保留来源顺序；topK 扫描全体候选，不能用 take 代替。随机抽样显式接续 RNG，不放入谓词或比较器。领域可以采用登记顺序作为有意义的同分政策，但不能把它误作跨领域通用优先级。

## 3. 固定 Hook Context 与状态接续

Hook 固定 Context，逐项接续 BattleState 和工作值；通知使用 void。候选、priority、最新登记、资格与接受条件的共同协议只在 [Hook](hook.md#派发与生命周期)维护。

历史载荷与实时对象分别处理。例如 Activation 结束通知中的 Ref 表示已结束轮次，不保证槽位仍可查询；资源 Application 表示本次已经写入的事实，不随后继改写。同步回调后的读取遵守[状态接续规则](functional-core.md#状态接续后的读取与续执行)。

## 4. 完整操作

完整操作自行检查所属领域的身份、生命周期与资源前提。允许普通 Unit 并报告缺少能力的接口使用 Ref<Unit>；本来就要求能力的入口使用相应交叉类型。正常业务拒绝不是异常，缺失身份或非法输入按所属操作契约处理。

首次有效的嵌套结束请求在自身 Prepare 完成后返回，Finalize 仍可待结算。需要当前资格的新业务必须重新查询，已经发生的责任按具体语义完成。 [Lifetime](lifetime.md#finalize-与完成边界)

## 5. 数值输入、查询与字段写回

外部资料在真正输入边界完成格式、有限数、符号、整数和单位校验；内部信任既有类型和范围。运行态公开写入口校验其新的业务输入，不在每个辅助查询重复断言。非法输入直接抛出，不静默补默认值。内部运算不为假想极值添加浮点溢出或身份计数防御；真实容量、舍入和范围仍按领域处理。

readonly 表达调用约定，不依赖 freeze、深拷贝或递归只读包装。未变字段共享，真正无变化返回原引用；同值请求若仍有明确业务后继，就不能当作整个操作 no-op。

`replaceIn(state, path, value)` 接收非空键元组和算好的字段值。调用方保证路径经过普通状态对象，判别联合应先收窄。数组和实例可以作为叶值整体替换。叶值按 `Object.is` 比较，相同则返回原对象，否则只复制路径上的对象。

Contribution 的动态 Input 在只读查询时求值，不接收累计值或推进状态；先竞争再求值。会驱动持续时序的 Action speed／interval 只接受静态 Modifier，并在变更后同步结算当前冷却，不在每 Tick 查询刷新。领域公式直接使用真实需要的 self、definition／state 或 base／modifiers，不为统一参数数量增加无用途的 BattleState。

私有状态采用“查询、计算、提交”：计算与 setter 之间不执行其他完整操作。setter 接收结果值，只替换允许字段并保留最新身份、进度及生命周期；不接收值／转换函数双协议，也不写回旧聚合。Typed Ref 与 NoInfer 保持原始私有类型配对，不能先弱化 Ref 再写入不兼容状态。

仍登记的 ENDING 实例可以提交私有 state，写回保留其生命周期。启动和推进操作各自检查执行资格。

### 5.1 Unit 完整操作与批量变更

Change 是与 Ref 无关、保留输入完整 Unit 类型的变换：

```typescript
type Change<in C extends Unit> =
    <U extends C>(self: U) => Applied<U>;

// Applied 保存 next 与有序 settlements。
```

C 是最低宿主要求；compose 按顺序合并所需能力，满足结合律、不满足交换律。optional 通过能力守卫有条件地应用同一 Change，不另建组合树、绑定层或跨 Unit 批次协议。

`update(battle, ref, change)` 只处理一个 Unit：

1. 从输入 State 读取宿主，依序应用纯变换。每项读取前项结果，并捕获自己的 previous；此时不调用 Hook 或完整操作。
2. 一次发布最终 next，维护 Unit 存储和 Occupancy 索引。
3. 按 settlements 顺序接续最新 BattleState；previous 只表示明确采样的旧事实，实时对象重新查询。

即使最终 next 回到入口引用，已登记的结算仍要执行。只有 next 未变且无结算时，整个 update 才返回原 battle。较早结算可以观察全部最终字段，以及较晚结算尚未清理的关系。

嵌套 update 独立完成自己的三步，不执行外层剩余结算，也不承诺隔离。领域 Settlement 限定自己的作用范围，不能借全场扫描扩大维护。Blocking 的资格复核、容量裁撤、主动解除分别由其[领域操作](blocking.md)处理。

内部 replace 只发布合法完整对象及索引，信任 Core 已建立的身份、Definition 和能力配对；不扫描能力、推导差异、维护 Lifetime 或补发业务通知。它不构成 Content 的原始状态写回入口。

Unit 的 add／remove 与生命周期 Hook 见 [Capability](capability.md)和 [Hook](hook.md)；依赖清理见 [Lifetime](lifetime.md)。Unit 不识别每项能力后再扫描补救，能力通过合法装配与所属操作维护自己的业务。

## 6. Effect self 的身份与宿主约束

Effect 的 S、H 分别约束私有数据和宿主类型；`StackEffect` 直接继承 Effect 并表达叠层身份，精确 Ref 保留实例实际的配对。安装以 Definition 决定最低宿主要求；合并可能保留旧 Definition，不能借本次传入类型证明旧私有 state 的类型。

`Definition` 和 `StackDefinition` 的 Self 泛型保留具体回调的实例要求；实例持有的 Definition 将 Self 擦除为 never，实际调用自身 Definition 时由 Core 恢复已建立的配对。安装必须提供独立于私有类型的完整 Initial，只有新实例才由 `Definition.initialize(battle)` 构造私有 state。叠层的 END／DECAY 到期形式由安装与时间写回边界检查。安装返回及类型擦除边界由 [Effect](effect.md#2-definition实例与泛型)维护。通用私有写回规则与其他实例相同，不另提供失去类型关联的写入口。
