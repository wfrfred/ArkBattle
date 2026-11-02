# 测试

测试验证游戏行为和已确认的接口契约，不锁定历史实现。

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
| [unit](sim/unit.test.js) | 正常构造建立能力配对并拒绝双重阻挡角色；初始 Effect 在登记后安装。 |
| [settlement](sim/settlement.test.js) | 全批变换先发布，结算按序接续最新事实；公共 Hook 固定候选、读取最新登记、独立嵌套派发。 |
| [lifetime](sim/lifetime.test.js) | 依赖者完整结束后宿主才注销；首次原因和收尾唯一；祖先开始结束后拒收新依赖。 |
| [action](sim/action.test.js) | 启动拒绝、持久与执行身份、冷却与变速、攻击中断／释放／输出、Combat 推进及确定性。 |
| [skill](sim/skill.test.js) | 持久与本轮状态、SP 门槛／支付／回复许可、TIME 当轮延时、Ammo 公式／采样／补弹额度／耗尽。 |
| [effect](sim/effect.test.js) | 安装与启停输出、覆写赢家、私有进度与绝对期限、续期、来源与生命周期依赖分离。 |
| [contribution](sim/contribution.test.js) | 先选互斥赢家再动态求值，真实属性输出遵循领域公式。 |
| [allegiance](sim/allegiance.test.js) | ALLY／ENEMY／NEUTRAL 的敌对关系。 |
| [blocking](sim/blocking.test.js) | 成对资格、层与地块、容量尾部裁撤、批量解除与旧 Ref、多目标分散及独立位置计划；归零通知期间保留关系，确认死亡后清理。 |
| [deployment](sim/deployment.test.js) | Request 预览与执行一致、拒绝不消费、消费先于入场；撤退／死亡账务、Card 延续、Occupancy 配对、逐份恢复预算及 DP。 |
| [core-types](sim/core-types.test.js) | Typed Ref 保留身份和私有数据配对，普通擦除查询不泄漏 `any`；能力证明与不透明 Change 约束写入。 |

[battle 夹具](helpers/battle.js)只通过 Runtime 的公开输入构造地图和预置 Unit。场景通过实际领域操作建立执行、资源及依赖事实；纯算法直接使用合法值。

其余套件覆盖未纳入本轮重新定标的 Capability、完整 Runtime／Schedule／Projectile／Mechanism、Data／Content 和 Legacy 等范围，不代表这些测试已通过同样的必要性审查。公共协议不再按接入领域重复建立矩阵，修复问题也不自动新增回归套件。
