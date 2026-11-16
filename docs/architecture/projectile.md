# Projectile 设计

## 1. 领域边界

Projectile 是独立运行实例，提供创建、正常推进和完整终结。具体内容决定运动、目标、数值采样、命中及终止业务，不把全部弹道压成一种追踪／碰撞模型。

来源、目标、到达、命中与结束是不同事实；独立弹道不因来源 Unit／Action 结束自动消失。

## 模块归属

[projectile](../../src/core/projectile)保存类型、查询与异构容器，Battlefield 持有唯一集合；[battle/projectile.ts](../../src/core/battle/projectile.ts)组织创建、更新、推进与停止。领域 API 与不可变写回遵守[接口约定](api-conventions.md)，终止共用 [Lifetime](lifetime.md)。

## 2. 实例与 Definition

实例保存身份、Definition、ACTIVE／ENDING、位置与私有 state。Definition 提供可选 onStart／onTick／onEnd，静态共享；私有状态可包含追踪目标、记忆位置、来源、样本、命中记录与业务时钟，不由根类型强制这些字段。

停止原因包括抵达、到期、显式停止、来源失效与 DISPEL；原因交给内容选择收尾，不拆成不同生命周期机制。具体类型以[源码](../../src/core/projectile/projectile.ts)为准。

## 3. 异构集合与类型恢复

Projectiles 保存完整异构实例，普通查询不承诺未知私有形状，精确 Ref／Definition 对象身份恢复类型；类型擦除集中在容器边界。字符串相同不代表同一 Definition。

身份由 Battle 分配，替换保留登记位置，删除后不复用。容器只处理存储，不负责业务资格；Query 绑定不可变输入版本。诊断或表现投影不替代运行实例。

## 4. 创建、查询与内容更新

创建方确定 Definition、位置和完整私有初态；需要读取属性或消费 RNG 时先明确接续相应状态。身份分配和 ACTIVE 登记先于 onStart，嵌套创建不复用 ID。onStart 可以结束自己，返回 Ref 仍表示已创建事实，不保证实例仍存在。

get 返回指定版本中的完整实例，不隐含 ACTIVE 筛选。update 只设置位置及私有 state，保留身份、Definition 与生命周期；ENDING 也可提交命中／清理进度，不因普通写回恢复实例。

跨完整业务后需要当前进度或资格时重新查询，不以旧 self 覆盖新版本；私有类型和写回错误遵守公共契约。

## 5. 时间推进

Runtime 在整个 Tick 开始时固定弹道 Ref 候选，到 Projectile 阶段逐项读取最新 ACTIVE 实例。先前回调结束的候选跳过，名单之后新建的实例等后续 Tick；创建和显式停止的程序仍同步执行。

正常推进仅由调度器调用一次，不保存实例级重复调度标记。抵达后可保持 ACTIVE、停止移动并继续等待或周期业务；不强制全场先移动、再命中、再结束。

## 6. 终止请求与 Finalize

stop 固定首次原因并发布 ENDING，阻止后续正常推进。待依赖完成后，onEnd 读取当前实例执行业务，再从最新集合移除，保留回调中新建或修改的其他弹道。

无活动结算时 stop 完成整批收尾后返回；嵌套调用的完成边界见 [Lifetime](lifetime.md#finalize-与完成边界)。停止不截断已经进入的普通同步调用栈；后续新输出仍须重新确认资格，不能只在末尾靠停止防重。

普通停止可执行原目标保底或落点爆炸，DISPEL 是否跳过这些业务由具体 Definition 决定。两者共用 onEnd 和析构保护，不另建消除回调系统。UI 不输出到达／停止诊断事件，资源输出按 [Event](event.md)处理。

## 7. 命中与内容状态

原目标直选、落点范围、沿途接触和周期重选各有资格，不能统一套用空间重叠或普通索敌。命中记录在可重入回调前提交；次数、轮次、原目标保底及终结防重分别保存，不默认整条弹道每目标只命中一次。

tracking 在目标身份仍存在时读取真实位置，暂时消失不回退记忆；身份失效才使用记忆位置。原目标命中要求 PRESENT 且正生命，不重查阵营、Presence 或 Targetable；最终 Damage 是否接收仍独立判断。

已接入的弩箭保存来源、目标、记忆位置、攻击样本和必要记录，到达与普通停止协调同一次原目标命中。来源仍在场时按其当前攻击力，否则沿用发射样本；这是具体弹体政策，不是通用来源快照。

慑砂 S2 的抵达后延时爆炸、承曦格雷伊 S2 的抵达后周期业务说明不同边界，具体内容尚未接入；不能以测试夹具替代内容程序。

## 8. 语义边界与研究依据

当前 stop 不提供可拒绝的消除准入；沿途碰撞、附着、套索及更复杂周期弹体尚未完整接入。来源退场后的取值差异由具体内容采样政策处理，不由 Projectile 统一保存 Unit 快照。缺口集中见 [Tactical 语义](tactical-semantics.md)。

原生依据见[运动与命中](../research/cases/16-projectile-motion-and-hit-boundaries.md)、[停止与终结](../research/cases/17-projectile-stop-and-termination.md)、[来源和目标](../research/cases/18-projectile-source-and-target-lifecycles.md)。当前实现的必要结果按[统一验收](verification.md)验证。
