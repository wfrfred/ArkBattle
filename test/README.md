# 测试

测试验证游戏行为和已确认的接口契约，不锁定历史实现。

收敛按独立语义的最小覆盖判断，不以 `test()` 数量衡量；合并在同一条目中的重复证明也应删除。

- 按独立行为选代表场景。底层算法验证自身条件，集成测试验证跨领域协作新增的风险，不逐层复制同一组断言。
- 保留原生公式、目标选择、资源消费、状态转换和累计输出等玩法结果。
- 保留批量发布早于通知、旧实例／关系身份、最新状态接续、依赖者先于宿主析构等关键结算边界，以及合法领域操作引起的同步重入。
- 保留真实输入入口的代表性校验和 Typed Ref、私有状态配对的类型检查。
- 不可变版本、容器顺序、惰性查询等公共机制集中验证，领域测试不逐层重复相同断言。失败不发布由 Battle 层统一覆盖。
- Hook 候选、登记替换和嵌套派发等通用协议集中验证，接入领域只增加其特有的业务结果。类型测试关注推断、类型擦除和身份配对，不逐字段证明普通类型声明。
- 使用合法构造和领域操作准备场景，不通过篡改只读 Definition、内部计数或生命周期状态制造游戏中不可达的情况。
- 夹具用于准备场景，不另写一套产品中不存在的算法，再用测试验证夹具自身。
- 不验证已删除 API 继续不存在、包装函数的具体形状或底层集合的特殊数值行为；不为极端溢出和调度契约外的调用维护用例。

修改时按受影响范围运行测试；跨领域清理后运行完整测试集。删除用例时一并清理失去用途的夹具、故障注入和辅助代码。

## 已审查范围

以下场景依据[语义验收清单](../docs/architecture/verification.md)组织。先确定独立的重要结果及集中归属，再选择代表场景；现有用例不构成保留依据。同一场景可以顺序验证多个业务阶段，不按接口数量拆分。

| 套件 | 需要保障的结果 |
| --- | --- |
| [battlefield](sim/battlefield.test.js) | 不可变版本、全批最终占格；Tile／Overlay 决定导航和代价选择；身体位置、空间存在和命中几何分离。 |
| [presence](sim/presence.test.js) | 暂时消失保留 Unit、部署与 Occupancy、普通 Effect／Lifetime；无 Ref 的 appear／disappear 工厂产生同目标 Change，经 compose 组合后先发布最终 Unit，再在自身 Settlement 调用 Blocking 的 releaseAll／release 清理当前关系及自身计划，释放结束后委托 Action.cancelForUnit 取消宿主执行。appear 只移除自身 Rule，其它限制仍生效；独立限制移除后正常启动，不重复公共 Rule／Hook／Ref 协议。 |
| [坐标](sim/coordinate.test.js)、[范围](sim/geometry-range.test.js)、[扫掠](sim/geometry-sweep.test.js) | 坐标旋转、连续范围并集、圆／盒／混合圆角的独立公式与首次接触边界集中验证，不向空间查询和具体内容复制数值矩阵。 |
| [unit](sim/unit.test.js) | 正常构造建立能力配对并拒绝双重阻挡角色；初始 Effect 在登记后安装。 |
| [unit-change](sim/unit-change.test.js) | update(battle, ref, change) 单目标写入；一个主场景集中验证二元 compose 的结合律与非交换、逐项 previous／no-op／Settlement，以及 optional 的 false 原对象／空后继和 guard 读取前序变换后的输入。最终 next 一次发布后才按序结算，嵌套 update 对第二 Unit 的结果不丢失，不建立跨 Unit 批次或守卫矩阵。 |
| [hook](sim/hook.test.js) | 公共 Hook 固定候选、读取最新登记、独立嵌套派发。 |
| [runtime](sim/runtime.test.js) | 初始化／出生事实先于 enter；正常预置替换接续最新绑定；Tick 阶段有序、失败不发布。 |
| [route](sim/route-capability.test.js) | 首指令与重新进入、MOVE 采样、WAIT 时基与 ticking、即时循环让出、持续 TRACE、Main 出口及同步空间操作后的最新进度；距离查询采用导航几何长度、不计传送，并显式区分 Main 与 TRACE。 |
| [schedule](sim/schedule.test.js) | 统一出生时间与偏移、等待先于 enter、超时只释放 wave、离场同步解除、Branch 整组抽选与同步重入、实际出生时基。 |
| [路线与调度数据](content/route-schedule-data.test.js) | 原生路线控制流与等待编译、count／interval 展开、主线预选与 Branch 运行时选择，以及 Action／Enemy 的 notCountInTotal 合并到 NONE。 |
| [Effect 静态数据](content/effect-data.test.js) | 真实重应用描述保留独立层数限制与续期配置，属性修正保留规范化运算位置和延迟取值标记；运行机制由实际 Effect 接入后验收。 |
| [lifetime](sim/lifetime.test.js) | 依赖者完整结束后宿主才注销；首次原因和收尾唯一；祖先开始结束后拒收新依赖。 |
| [action](sim/action.test.js) | 启动拒绝、持久与执行身份、静态时序贡献变更时同步保留冷却进度、攻击中断／释放／输出、Combat 推进及确定性；释放通知中消失保留前缀并停止旧输出，出现后可恢复行动，不推导弹药消费政策。 |
| [skill](sim/skill.test.js) | 持久与本轮状态、SP 门槛／支付／回复许可、TIME 当轮延时、Ammo 公式／采样／补弹额度／耗尽；开始通知中消失仍 ACTIVE 时执行 onStart，既有持续期照常推进。 |
| [effect](sim/effect.test.js) | 安装与启停输出、零时长安装、覆写赢家、三种互斥时间、手动推进、末次回调续期、来源与生命周期依赖分离；新分组、重复施加与剩余时间契约的实现及测试按 [Effect 验收清单](../docs/architecture/verification.md#effect-分组重复施加与计时已确定待接入)接入。 |
| [contribution](sim/contribution.test.js) | 先选互斥赢家再动态求值，真实 Offense 输出遵循属性公式、零下限并保留小数。实际输出与弹道负责各自采样时点。 |
| [targeting](sim/targeting.test.js) | 标准 HP／EP 资格与目标限制、资源接收分开；独立空间原点使用 Hitbox，额外空地条件读取当前 Layer。有效 MaxHP 决定治疗需求与比例，联合治疗保留 HP 或 EP 需求，Burst 不抹掉 HP 需求。 |
| [targetable](sim/targetable-restrictions.test.js) | 按 Restriction 定义对象身份的豁免在贡献竞争后检查，覆盖共享定义的所有有效来源且保留独立限制，固有与临时限制互不误删；有效嘲讽允许负值并决定显式优先级。 |
| [攻击目标接入](sim/targeting-action.test.js) | 各组选择与 prepare 接续 RNG，启动拒绝保留已完成消费；保存的绑定不因后续选择限制而自动换人。实际内容需要复验时只检查原绑定。 |
| [公共随机](common/rng.test.js)、[整数取值](common/math.test.js) | 无放回抽样的确定性与消费、正负半值取偶集中验证；Targeting 不重复 Query 或 TopK 算法。 |
| [allegiance](sim/allegiance.test.js) | ALLY／ENEMY／NEUTRAL 的敌对关系。 |
| [blocking](sim/blocking.test.js) | 成对资格、层与地块、容量尾部裁撤、批量解除与旧 Relation、多目标分散及独立位置计划；自身空地设置（含同值）完成角色对应的关系／偏移清理，通知可见已发布的新身份；主动空间覆盖先发布新位置和解除结果，再通知。复用代表场景，不展开字段／角色矩阵。 |
| [locomotion](sim/locomotion.test.js)、[避障](sim/locomotion-avoidance.test.js)、[速度贡献](sim/move-speed-contributions.test.js) | 按 Locomotion 关键语义集中验证转向、限力／限速、速度与许可、最终目标吸附、地形避障和目的格反射。算法使用合法局部值，运行场景使用真实地图与领域操作，不注入速度，不复制公共不可变性或方向／缺失对象矩阵。Route／Battle 集成只保留新增的跨领域结果。 |
| [deployment](sim/deployment.test.js) | Request 预览与执行一致、拒绝不消费、消费先于入场；撤退／死亡账务与 Card 延续；离场注销、结构占格和部署额度释放先于本地内容通知，死亡 Card 先于 Card／Request 通知结算；旧 Occupancy 配对清理、逐份恢复预算及 DP。 |
| [core-types](sim/core-types.test.js) | Typed Ref、Projectile 创建／更新、Query 守卫与构造输入保留私有状态／回调配对，Runtime 聚合不提供 `any` 私有状态上下文；预置 Unit 的 initial 对应其 Definition 能力。Change 能力逆变、compose 合并交集、optional 与 Query 守卫保留完整宿主；目标资格增加 Vitality／Elemental 证明并贯穿集合终端，Action 专属操作和查询要求 Action 能力；普通登记与派发均保持键和载荷的关联。 |
| [damage](sim/damage.test.js) | 按[伤害／治疗回归清单](../docs/architecture/verification.md#hook-与伤害治疗的回归语义)保障 HP／EP 公式与采样、独立 Calculate 状态、接收与提交、零值和取消、最新资源、Applied 后死亡及同步 Burst。 |
| [healing](sim/healing.test.js) | HP／EP 治疗公式、四型恢复、满资源仍成功、双侧 Applied 和自然恢复的区别；一次双资源场景区分消失期间 Damage 拒收与 Healing 接收。 |
| [elemental](sim/elemental.test.js) | rate 为零的标准 Burst 手动推进唯一时间进度，恢复期间四型 EP 逐步回填；动态与暂停预算、完整周期、零预算的一次性输出和独立产物、完成／取消后的资源与作用生命周期；自然 EP 回复及既有 Burst 不因消失冻结，不复制公共时间或 Lifetime 矩阵。 |
| [tracking 弹道](sim/projectile-tracking.test.js) | 已锁定目标消失后仍追真实位置；身份命中不依赖 Targetable／Hitbox，Damage 接收独立判断。保留原目标失效、来源采样和具体终止结果，不为 Presence 新增通用 Projectile Rule。 |
| [UI瞬时输出](sim/event-output.test.js) | 按 EVENT 清单集中验证真实结算飘字、爆发位置与注销快照，以及 Tick 清空输出和旧版本保留；业务结算不依赖事件消费。 |
| [标准元素爆发](sim/elemental-runtime.test.js) | Core 具体 Effect 使用 Data 绑定的真实数值产生伤害、异常、永久输出和周期累计结果；不重写夹具算法或按八套配置逐字段扩展。 |

[battle 夹具](helpers/battle.js)通过 Runtime 的公开输入构造地图和预置 Unit。场景通过实际领域操作建立执行、资源及依赖事实；纯算法直接使用合法值。夹具使用当前字段和初始化契约，不翻译旧 API，也不提供任意能力状态、身份计数或进度注入。

伤害／治疗定向套件从文档清单编写，直接使用真实构造、Hook 登记、资源操作和 Lifetime。helper 只组合 Calculate／Apply，不承担能力装配、状态注入或另一套领域程序。

综合套件只验证其独立结果：Battle 的 Schedule／Route 行为，Targeting 的选择与几何，Projectile 的飞行与命中，Mechanism 的存续，以及真实 Data／Content。它们涉及已审查领域的重复覆盖同样需要删除，不整文件豁免。未完整审查领域的独立业务仍按现有范围保留，公共协议不因换一个消费者再次展开，修复问题也不自动新增回归套件。

Hitbox 接入归 Targeting 的一个代表场景，真实锁定弹道单独保障身份命中。具体归属及删减边界见[几何与空间验收](../docs/architecture/verification.md#集中归属与收敛完成条件)。
