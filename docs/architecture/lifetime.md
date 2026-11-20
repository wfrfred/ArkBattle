# Lifetime 与依赖析构

Lifetime 统一结束请求、依赖传播与最终析构。领域拥有实例、创建、私有状态和存储，以 end／cancel／stop／remove 等完整业务入口适配公共协议，不统一启动或解释内容数据。

请求同步执行 Prepare；单个最外层结算器按依赖完成顺序 Finalize。所有真实依赖者的整个 Finalize 返回后，owner 才可完成。

## 身份、Scope 与公共入口

[公共入口](../../src/core/lifetime/index.ts)提供静态描述符、Scope 构造／恢复、可用性、显式依赖查询及绑定／解绑；登记、注销和结算器属于内部协作。

身份使用领域 kind 与完整数值地址：Unit／Projectile／Mechanism 使用自身 ID，Execution／Activation／Effect 使用宿主与局部 ID。值相同的地址表达同一身份，不依赖 Scope 对象引用，也不分配另一套全局 ID。

Scope 保留描述符与 Ref 的领域配对。getRef 仅在描述符匹配时恢复公开实体类型，不凭 Scope 恢复未知私有参数；Burst 使用 Effect 的描述符，不另建类型。dependencies 只查询显式 Scope，不包含 owner；解绑不能解除 owner。

available 沿实际 owner 与显式 Scope 父边检查本节点及全部上游：缺失、Pending 或结束中均拒绝新依赖。Unit、Execution 与 Activation 要求 ACTIVE；INSTALLING／INACTIVE Effect 与 INACTIVE Mechanism 仍可绑定。HP、空间存在、普通 source 与时间都不属于这项资格。

绑定入口拒绝不可用端点，合并图闭环抛错；内部传播信任已建立的 DAG。公共描述符不授予 Content 绕过领域推进或私有写回协议的权限。

## 静态析构适配

描述符提供稳定身份、查询、结束态判断、纯 begin、发布、Prepare、Finalize 与原因转换。公开实体类型、内部异构上界和结束载荷在这个受信边界配对，具体声明以源码为准。

begin 只形成 ENDING；发布后再 Prepare。Prepare 可以读取标记前 initial 以决定撤销哪些输出，需要实时事实时另查最新状态。Finalize 只按 Ref 和固定结束载荷从当前存储取得实例，不回填入口快照。

Unit Departure 在 remove 入口固定：历史 unit 与 End；DEATH 明确带 killer，其他原因不带。后续 Finalize 不重推原因或归属。业务结束载荷与向依赖者传播的原因是两条通道：例如 Unit 死亡对 Action 表达 SOURCE_ABSENT 取消，对其依赖者仍传播 DEATH。首次请求同时固定两者，重复请求不覆盖。

Unit 不是可依赖结束的子节点，不提供 fromDependency；各能力自行登记 Unit.prepare 清理程序。来源击杀响应的编排归 [Resource](resource.md)，不是通用 Lifetime 的常设业务。

## 状态归属与关系权威

BattleState.lifetime 保存关系图、未完成 endings 和最外层 settling 标记。关系图是 owner／显式 Scope 唯一权威；槽位、普通私有 Ref 或 source 不投影成关系，字段更新也不重建图。

每个实例有一个 owner 和显式 scopes，反向 children 合并两种边并按身份去重。创建时登记，最终移除时注销。图不保存另一份实例、存活状态或时间。

Pending 保存本次结束载荷、父等待与阶段。实例物理移除可撤去活索引，但 Pending.parents 保留到整个 Finalize 返回；查询子项同时合并活关系与未完成工作，保证子项末尾通知请求 owner 时仍有保护。

初始 Battle 建空图，各领域通过正常创建登记，不扫描预装容器。稳定的最外层返回状态无未完成结算。

## 请求与 Prepare

首次有效请求依次执行：

1. 检查 Pending 防重；实例缺失则不创建工作。
2. 固定当前父关系与直接子候选，登记 PREPARING 和结算标记。
3. begin 并发布领域结束态。
4. 执行自身 Prepare，接续返回状态。
5. 按父子边登记顺序请求依赖者，再置 READY。

Prepare 早于自动请求依赖者；它可先主动结束子项，从而确定子项首次原因。父节点已经 Pending 不代表每个子节点已收到请求。相同边更新保序，解除重绑追加；兄弟请求顺序与真实依赖决定的完成偏序分别成立。

首次嵌套请求返回保证自身 Prepare 完成，不保证 Finalize；重复 PREPARING 请求也不等待原 Prepare。Prepare 是多个完整业务的序列，不是任意回调原子事务，需要随标记失效的事实应在对应发布中建立。

结束态立即阻止正常推进与新依赖。Unit.prepare 使用[公共 Hook](hook.md)顺序；Effect 在 Prepare 撤销输出、协调候补，但 ENDING 宿主不能重新启用弱者。主动撤退的退款等前置业务归 Deployment，不由通用 Prepare 推导。

## Finalize 与完成边界

无活动结算时，结束入口请求后 drain 到全部完成再返回；已有结算时只请求，不递归 drain。

阶段为 PREPARING、READY、FINALIZING。READY 表示准备与子请求展开完成。drain 每次从最新状态选择最早登记、没有未完成子项的 READY，标记 FINALIZING 后调用领域收尾；整个返回后才删除 Pending 并重新选择，不使用入口固定的拓扑列表。

物理删除、槽位清空或事件写入不是公共完成信号；所有末尾回调返回才解除父等待。尚有工作却无可执行节点是关系／阶段错误，直接抛出，不强制删边或增加循环预算。异常传播，不在 finally 补做收尾；不可变发布规则见 [Functional Core](functional-core.md)。

## 可观察顺序与领域责任

兄弟可以都先进入 ENDING，某个 onEnd 不保证其他兄弟仍正常运行。共享依赖只 Finalize 一次，首次原因保持不变。

嵌套结束返回时，实例可能仍可查询、占格或占槽。后继资格不能只看存在；依赖槽位释放的业务使用领域完成通知，不强行开启嵌套 drain。Damage 的 Completed／Outcome 不承诺目标所有离场 Finalize 已完成，见 [Resource](resource.md)。

等待只来自真实关系，普通函数调用不生成反向等待。例如 Effect.onEnd 请求 Unit.remove 时 Unit 等已有子 Effect 完成，Effect 不因为调用 remove 又等待 Unit。独立 Projectile 不随来源／Action 自动结束；Blocking、Occupancy 与 Card 冷却也不自动成为生命周期依赖。

清理期间允许哪些字段写回由领域决定。Mechanism.disable 可逆，remove 不可逆；ACTIVE remove 的 Prepare 以 ENDING 调用 onDisable，INACTIVE remove 不重复停用，Finalize 再 onEnd。领域只能使用自身合法操作修改状态。
