# Lifetime 与依赖析构

Lifetime 统一结束请求、依赖传播与拓扑析构。领域负责创建实例、管理私有状态和存储，并通过 `remove`、`finish` 或 `cancel` 将本次结束输入交给 `Lifetime.end`。 [生命周期命名](api-conventions.md#生命周期命名)

## 身份、Scope 与公共入口

[公共入口](../../src/core/lifetime/index.ts)提供 `create`、`scope`、`available`、`bind`、`unbind` 和 `defer`。领域使用 `create` 声明一份共用的静态协议，每个已登记的实例都在图中有自己的节点。

节点身份由领域的 `kind` 和 Ref 对应的字符串地址组成。Unit、Projectile 和 Mechanism 使用自身 ID。Execution、Activation、Effect、Unbalance 和 Pull 使用各自 Ref 的宿主与局部身份。

`scope(lifetime, ref)` 封装描述符与实例 Ref，用来指定另一节点为依赖目标。B 登记 A 的 Scope 就建立 B → A。一个节点可依赖多个目标，也可供多个节点依赖，每条边的结束语义相同。普通来源、槽位与私有 Ref 仍由各领域解释。Burst 使用 Effect 的描述符和节点。

`available` 要求节点及其所有上游都已登记且尚未开始结束。失效沿依赖链立即传递，即使某个依赖者的领域状态还未发布 `ENDING`。已登记的 INSTALLING／INACTIVE Effect 与 INACTIVE Mechanism 仍可用。HP、空间存在与启停的业务资格由消费方判断。

`bind` 和 `unbind` 只修改两端都可用的边，由领域决定哪些业务依赖能动态调整。内嵌实例依赖其所在存储，调用者须保留这条边直至收尾完成，例如 Effect 对存放它的 Unit 的依赖。进入结束流程的节点及受其影响的下游依赖关系在本轮收尾期间冻结。重复绑定同一对节点只保留一条边，形成环的绑定会被拒绝。

## 静态析构适配

Lifetime 配置提供 `kind`、`address`、`get` 以及 `end.prepare`、`end.finalize` 和可选的 `end.dependencyEnd`。领域的结束回调取得 `battle`、`ref`、`initial` 和 `end`。首次有效请求确定 `initial` 为当时实例的不可变版本，`end` 为当时接受的结束输入。需要清理过程中产生的新事实时，回调按 Ref 读取最新实例。

依赖者配置 `dependencyEnd` 来描述自己在任一上游结束时接受的输入。Action 因宿主结束接收 `SOURCE_ABSENT` 取消，依附这轮 Action 的 Effect 接收自身配置的 `CANCELLED`。上游结束原因保留在上游业务。Unit、Projectile 和 Mechanism 可以作为依赖目标，三者当前只接受显式的结束请求。

Unit 以 `End` 请求结束。Lifetime 固定 `initial` 与 `End`，Unit 据此为 removing／removed 构造 `Departure`。DEATH 的 killer 来自首次请求。注销时从最新 Unit 取 removed 候选与优先级，`UNIT_REMOVED` 也记录注销前的最新 Unit。离场 Hook 的 `Departure.unit` 始终是开始结束时的历史快照。 [死亡归属与击杀响应](resource.md#生命状态通知与离场)

## 状态归属与关系权威

`BattleState.lifetime` 保存一张由 `nodes` 表示的 DAG、延后队列 `deferred` 和队列执行状态 `flushing`。节点保存自身 Scope、直接依赖的身份，以及结束期间的 `ending` 数据。实例数据仍存放在所属领域。

领域在实例写入存储后、执行入场业务前登记节点，即使该节点没有依赖。Lifetime 在节点的整个 Finalize 返回后移除节点及其依赖边。领域存储已注销、通知仍在执行时，图中的节点依旧有效地约束上游的收尾顺序。

## 请求与 Prepare

首次有效请求将 `initial` 和 `end` 固定到节点，调用其 Prepare 发布领域的 `ENDING` 并执行前置清理。Prepare 返回后，Lifetime 依次请求尚未开始结束的直接依赖者，顺序采用节点的登记顺序。Prepare 可以主动请求另一实例结束，重复请求沿用已经接受的快照与结束输入。

Unit 在 Prepare 阶段派发 `removing`，早于自动请求依赖者结束。Effect 在 Prepare 撤销持续输出并按宿主资格协调候补。副作用或通知需要看到的领域结束状态在对应 Prepare 的开始发布。 [Hook 顺序](hook.md)

## Finalize 与完成边界

最外层结束请求同步完成 Prepare、递归请求及拓扑收尾。已有结算时，嵌套结束只执行请求部分。首次嵌套请求返回时自身 Prepare 已完成，实例仍可能可查询、占格或占槽。

Finalize 以最新 DAG 为准。直接依赖者全部完成后，节点才可收尾。同一时点有多个节点可收尾时，优先处理先接受结束请求的节点。节点及依赖边保留到其 Finalize 完整返回，领域注销或事件写入仍处在这一边界内。若仍有结束请求但找不到可收尾的节点，结算报错。异常按[不可变状态规则](functional-core.md)传播。

## 可观察顺序与领域责任

同一依赖目标的多个依赖者可在收尾前都已进入 `ENDING`。同时依赖多个上游的实例只结束一次。Effect.onEnd 内请求结束宿主时，宿主可以先发布 `ENDING`，随后等当前 Effect 的 Finalize 返回再注销。普通函数调用和回调栈本身不产生等待。

需要等整轮结束结算完成的操作使用 `defer`。Damage 的 Completed／Outcome 只表达该笔已提交结果，相关离场可能仍在结算。清理期间可写哪些业务字段由领域决定。 [Resource](resource.md#生命状态通知与离场)

## 析构后执行操作

`defer(battle, operation)` 接收从 BattleState 返回下一份 BattleState 的同步操作。当前无节点正在结束且未在执行延后队列时直接调用，否则加入队尾。

最外层请求完成全部拓扑析构后冲刷队列。队列每次先取出队首再执行，从其返回的最新 BattleState 继续。延后操作发起的新一轮析构在该操作内同步完成，期间登记的任务追加到当前队尾。若已登记 A、B，A 期间又登记 C，则执行顺序为 A、B、C。整个过程在当前同步调用链内完成。
