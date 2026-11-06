# 测试

测试验证游戏行为和已确认的接口契约，不锁定历史实现。

收敛按独立语义的最小覆盖判断，不以 `test()` 数量衡量；合并在同一条目中的重复证明也应删除。

- 按独立行为选代表场景。底层算法验证自身条件，集成测试验证跨领域协作新增的风险，不逐层复制同一组断言。
- 保留原生公式、目标选择、资源消费、状态转换和累计输出等玩法结果。
- 保留批量发布早于通知、旧 Ref 身份、最新状态接续、依赖者先于宿主析构等关键结算边界，以及合法领域操作引起的同步重入。
- 保留真实输入入口的代表性校验和 Typed Ref、私有状态配对的类型检查。
- 不可变版本、容器顺序、惰性查询等公共机制集中验证，领域测试不逐层重复相同断言。失败不发布由 Battle 层统一覆盖。
- Hook 候选、登记替换和嵌套派发等通用协议集中验证，接入领域只增加其特有的业务结果。类型测试关注推断、类型擦除和身份配对，不逐字段证明普通类型声明。
- 使用合法构造和领域操作准备场景，不通过篡改只读 Definition、内部计数或生命周期状态制造游戏中不可达的情况。
- 夹具用于准备场景，不另写一套产品中不存在的算法，再用测试验证夹具自身。
- 不验证已删除 API 继续不存在、包装函数的具体形状或底层集合的特殊数值行为；不为极端溢出和调度契约外的调用维护用例。

修改时按受影响范围运行测试；跨领域清理后运行完整测试集。删除用例时一并清理失去用途的夹具、故障注入和辅助代码。

## 已审查范围

以下场景依据[语义验收清单](../docs/architecture/verification.md)组织。按重要结果划分场景，同一场景可以顺序验证多个业务阶段，不按接口数量拆分。

| 套件 | 需要保障的结果 |
| --- | --- |
| [battlefield](sim/battlefield.test.js) | 不可变版本、全批最终占格；Tile／Overlay 决定导航和代价选择；身体位置、空间存在和命中几何分离。 |
| [presence](sim/presence.test.js) | 暂时消失保留 Unit、部署与 Occupancy、普通 Effect／Lifetime；appear／disappear 产生 Change，可位于组合批次任意位置，所有变换先发布，再清理本项 previous 的旧关系／执行。较早 Settlement 的合法通知中重新出现和启动的新执行保留，不重复公共 Rule／Hook／Ref 协议。 |
| [坐标](sim/coordinate.test.js)、[范围](sim/geometry-range.test.js)、[扫掠](sim/geometry-sweep.test.js) | 坐标旋转、连续范围并集、圆／盒／混合圆角的独立公式与首次接触边界集中验证，不向空间查询和具体内容复制数值矩阵。 |
| [unit](sim/unit.test.js) | 正常构造建立能力配对并拒绝双重阻挡角色；初始 Effect 在登记后安装。 |
| [unit-change](sim/unit-change.test.js) | update 接收单个 Change，批量显式 combine；一个主场景集中验证空／嵌套 combine 等价平铺列表、跨 Unit 与同 Unit 顺序暂存、每叶 previous／no-op／Settlement。延迟 combine 在 prepare 阶段按当前暂存 Unit 选择能力及子 Change，不执行 Hook 或完整领域操作，也不中途发布；全批一次发布后才结算，嵌套操作的结果不丢失。 |
| [hook](sim/hook.test.js) | 公共 Hook 固定候选、读取最新登记、独立嵌套派发。 |
| [runtime](sim/runtime.test.js) | 初始化／出生事实先于 enter；正常预置替换接续最新绑定；Tick 阶段有序、失败不发布。 |
| [lifetime](sim/lifetime.test.js) | 依赖者完整结束后宿主才注销；首次原因和收尾唯一；祖先开始结束后拒收新依赖。 |
| [action](sim/action.test.js) | 启动拒绝、持久与执行身份、静态时序贡献变更时同步保留冷却进度、攻击中断／释放／输出、Combat 推进及确定性；释放通知中消失保留前缀并停止旧输出，出现后可恢复行动，不推导弹药消费政策。 |
| [skill](sim/skill.test.js) | 持久与本轮状态、SP 门槛／支付／回复许可、TIME 当轮延时、Ammo 公式／采样／补弹额度／耗尽；开始通知中消失仍 ACTIVE 时执行 onStart，既有持续期照常推进。 |
| [effect](sim/effect.test.js) | 安装与启停输出、零时长安装、覆写赢家、三种互斥时间、有效时长暂停与手动推进、末次回调续期、来源与生命周期依赖分离。 |
| [contribution](sim/contribution.test.js) | 先选互斥赢家再动态求值，真实属性输出遵循领域公式。 |
| [allegiance](sim/allegiance.test.js) | ALLY／ENEMY／NEUTRAL 的敌对关系。 |
| [blocking](sim/blocking.test.js) | 成对资格、层与地块、容量尾部裁撤、批量解除与旧 Ref、多目标分散及独立位置计划；自身空地设置（含同值）完成角色对应的关系／偏移清理，通知可见已发布的新身份；主动空间覆盖先发布新位置和解除结果，再通知。复用代表场景，不展开字段／角色矩阵。 |
| [locomotion](sim/locomotion.test.js)、[避障](sim/locomotion-avoidance.test.js)、[速度贡献](sim/move-speed-contributions.test.js) | 按 Locomotion 关键语义集中验证转向、限力／限速、速度与许可、最终目标吸附、地形避障和目的格反射。算法使用合法局部值，运行场景使用真实地图与领域操作，不注入速度，不复制公共不可变性或方向／缺失对象矩阵。Route／Battle 集成只保留新增的跨领域结果。 |
| [deployment](sim/deployment.test.js) | Request 预览与执行一致、拒绝不消费、消费先于入场；撤退／死亡账务与 Card 延续；离场注销、结构占格和部署额度释放先于本地内容通知，死亡 Card 先于 Card／Request 通知结算；旧 Occupancy 配对清理、逐份恢复预算及 DP。 |
| [core-types](sim/core-types.test.js) | Typed Ref 保留身份和私有数据配对，普通擦除查询不泄漏 `any`；能力证明与不透明 Change 约束写入，combine 仍返回 opaque Change，延迟展开的 self 只由 Ref 推断；普通注册的按 Key 和固定字段接口均保留 Entry 与能力 Ref 的类型关联。 |
| [damage](sim/damage.test.js) | 按[伤害／治疗回归清单](../docs/architecture/verification.md#hook-与伤害治疗的回归语义)保障 HP／EP 公式与采样、独立 Calculate 状态、接收与提交、零值和取消、最新资源、Applied 后死亡及同步 Burst。 |
| [healing](sim/healing.test.js) | HP／EP 治疗公式、四型恢复、满资源仍成功、双侧 Applied 和自然恢复的区别；一次双资源场景区分消失期间 Damage 拒收与 Healing 接收。 |
| [elemental](sim/elemental.test.js) | rate 为零的标准 Burst 手动推进唯一时间进度，恢复期间四型 EP 逐步回填；动态与暂停预算、完整周期、零预算的一次性输出和独立产物、完成／取消后的资源与作用生命周期；自然 EP 回复及既有 Burst 不因消失冻结，不复制公共时间或 Lifetime 矩阵。 |
| [tracking 弹道](sim/projectile-tracking.test.js) | 已锁定目标消失后仍追真实位置；身份命中不依赖 Targetable／Hitbox，Damage 接收独立判断。保留原目标失效、来源采样和具体终止结果，不为 Presence 新增通用 Projectile Rule。 |
| [UI瞬时输出](sim/event-output.test.js) | 按EVENT清单集中验证真实结算飘字、爆发位置与注销快照、路线计数独立和Tick输出清空。 |
| [标准元素爆发](sim/elemental-runtime.test.js) | Core 具体 Effect 使用 Data 绑定的真实数值产生伤害、异常、永久输出和周期累计结果；不重写夹具算法或按八套配置逐字段扩展。 |

[battle 夹具](helpers/battle.js)只通过 Runtime 的公开输入构造地图和预置 Unit。场景通过实际领域操作建立执行、资源及依赖事实；纯算法直接使用合法值。

伤害／治疗定向套件从文档清单编写，直接使用真实构造、Hook 登记、资源操作和 Lifetime。helper 只组合 Calculate／Apply，不承担能力装配、状态注入或另一套领域程序。

综合套件只验证其独立结果：Battle 的 Schedule／Route 行为，Targeting 的选择与几何，Projectile 的飞行与命中，Mechanism 的存续，以及真实 Data／Content 和 UI 转换。它们涉及已审查领域的重复覆盖同样需要删除，不整文件豁免。未完整审查领域的独立业务仍按现有范围保留，公共协议不因换一个消费者再次展开，修复问题也不自动新增回归套件。

Hitbox 接入归 Targeting 的一个代表场景，真实锁定弹道单独保障身份命中。具体归属及删减边界见[几何与空间验收](../docs/architecture/verification.md#集中归属与收敛完成条件)。
