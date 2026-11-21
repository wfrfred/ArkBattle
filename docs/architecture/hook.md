# Hook 集合与登记

本文维护登记式 Hook 的共同契约。领域定义键、载荷、工作值、资格和执行时点；Definition 自身的 onInstall、onTick、onEnd 等单一程序由所属实例直接调用。

## 存储与领域职责

所有登记使用类型化 Key。Unit 的生命周期、资源、Action、Skill、Blocking、Elemental 等本地登记统一存于 `Unit.hooks`；全局 Unit 观察和 Deployment 观察存于各自 Battle 领域的 Hooks 集合。存储一致不合并业务阶段或宿主所有权。

各领域自行派发，不建立万能业务广播器。公共集合负责存取，公共 dispatch 负责共同调用协议；它们不判断 ACTIVE、资源资格或业务是否应继续。

## 类型化键与集合

Key 对象本身是运行身份，name 只用于诊断。同名新 Key 不能读取原键登记。Key<H, Owner> 同时保留完整 Hook 类型与最低宿主能力，通用 Unit 写入据此产生 Change<Unit & Owner>；Owner 不增加运行字段。

容器内部封装异构擦除，使用同一 Key 恢复精确类型，包括 ReceivingHook 的泛型 invoke，不能放宽成丢失状态转换约束的普通函数。

ID 的范围是集合 × Key × ID。无登记返回空集合；同键同 ID 的 set 替换并保留位置，新 ID 追加，remove 只撤销该项。merge 按后者条目顺序应用同样规则。删除不会恢复以前被覆盖的固有登记。

所有登记式 Hook 共用 `priority?: number`，默认 0，派发按降序、同级按登记顺序。存储顺序不变，不跨业务阶段重排。Definition 的单一程序没有 priority。

## 固有声明与初始化

Definition、创建输入与 Unit 使用同一种 Hooks 集合，无登记使用 Hooks.empty()。初始化从输入集合开始，按 Capability initializer 顺序装配，最后合并 Definition.hooks；全部固有登记在 add 与 entered 之前就绪。

固有 Hook 可以直接声明，不必包装 Effect。Card 的 Unit Hook 和 `Unit.Input` 也使用同一集合；修改 Card 只影响以后创建的 Unit，不追溯已有实例。

## 动态登记

通用 setHook／removeHook 返回 Change，由 Unit.update 发布；Key 保留最低宿主类型。登记本身不执行内容、重放旧阶段或维护关系。

机制向其他 Unit 登记时，由机制负责撤销；宿主注销自然移除本地集合。Effect 按自身启停或结束程序管理登记与资格，不维护外置 Unit 订阅表。Battle 归属的观察使用所属领域操作修改，不能强塞入某个 Unit。

## 派发与生命周期

一次 dispatch 固定 Context，逐项接续 BattleState 与 current：

1. 在入口一次采样候选 ID 和 priority，稳定降序排序，固定本轮顺序。
2. 每项前检查 stop，再从最新 State 查找登记和领域资格，检查 accepts，执行 invoke。
3. 新 ID 不进入本轮；删除跳过，同 ID 替换使用最新程序，但新 priority 不重排本轮。嵌套派发独立取候选。

accepts 只读。通知使用 void；取消、固定数值等工作值转换由领域定义，不能以公共派发器代替业务协议。

领域必须明确候选和资格的差异：

| 场景 | 必要语义 |
| --- | --- |
| Unit entered／tick | 固定候选，每项前要求当前宿主 ACTIVE |
| Unit removing | 固定 Departure 并发布 ENDING 后执行，早于 Lifetime 自动请求依赖者结束 |
| Unit removed | 注销前捕获最新 Hook 对象及 priority 快照，注销后执行；不再查已删除宿主 |
| Battle unit removed | `battle.unit.removed` 在 Unit 本地 `removed` 后派发 |
| Blocking 一条关系 | 首个回调前同时采样双方候选，各自排序，先 Blocker 后 Blockable；不跨角色按 priority 混排 |
| Blocking ACQUIRED／RELEASED | 前者随原 Relation 失效停止；后者通知已发生的解除，不追删回调中新建的关系 |
| 资源常规阶段 | 要求当前宿主 ACTIVE，具体阶段保留自己的停止条件 |
| Skill／Elemental 结束事实、HP targetKilled | 仍登记的 ENDING 宿主可以参与，不套用来源输出资格 |

一批关系逐条开始时取各自候选，不提前冻结整批登记。同一 Unit 承担来源和目标等不同角色时，仍按不同 Key 分别通知。历史载荷不随实时查询改变，见[状态接续](functional-core.md#状态接续后的读取与续执行)。

普通 HIT 回复与伤判共用 HP Damage.receiving；HIT 约定采用 10000 量级高优先级并原样返回工作值，普通伤判通常为 0。数值是内容顺序约定，不建立强制分区或额外派发轮次。beforeReceive 与 receiving 使用同一业务 Hook 类型、不同 Key，保留各自时点。

HP Damage 的临时 removing Hook 与 targetKilled 顺序由 [Resource](resource.md)规定；公共 Hook 不自动添加击杀程序。

## 本次调用的 Hook 排除

Exclusion 是 `[key, id]`：按 Key 对象身份匹配，id 为 null 时排除整键，字符串时只排除该登记。排除不修改集合、Request、工作值或历史结果。

Options.exclude 和匹配函数供领域派发器过滤候选，公共 dispatch 不解释业务键。整阶段被排除时不执行其 accepts／invoke；单项排除保留其余项的顺序和重入规则。同键若被本次操作在多个宿主派发，匹配作用于全部这些派发，不另加宿主协议。

选项只属于本次调用；独立阶段、嵌套操作和内部完整操作是否接收它，由调用接口明确决定，不能隐式传播。四种 Resource 的 Calculate／Apply 分别接受选项，其适用范围和与 forbidden／Restriction 豁免的区别只在 [Resource](resource.md)维护。
