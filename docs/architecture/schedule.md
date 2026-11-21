# Schedule 设计

Schedule 保存出生计划、主 Wave 进度、Branch 实例和出生 Unit 的等待关系。当前调度范围是出怪及其波次等待。关卡程序使用 Unit 和 Mechanism 的普通操作处理实体出现、触发与离场。

## 静态计划

Definition 包含主 Waves 与按名称查找的 Branches。Wave 提供前延迟、后延迟、可空最大等待和 Fragment 序列；Fragment 提供前延迟与确定 Spawn 序列；Branch 的每个 Phase 提供前延迟及 Entry 序列。Entry 是确定出生组或按权重选取整组 Spawn 的候选。

每项 Spawn 只描述一次出生：完整 UnitDefinition、本次 Route Plan、固定 offset、随机半宽 randomRange、前延迟后的 atTick 和 Wait。主线 count／interval 与随机组在 Data 预处理为确定序列；Branch 随执行抽选。

普通 Spawn 的定义必须有 Route，可选择 Facing 等其他能力；不支持 Occupancy／Deployable，因为出生不提供登记地块。创建同时提供 Route 的 Plan／offset 和 Facing 的 RIGHT 初值；未声明 Facing 时按通用规则忽略额外已知输入。Plan 与实例偏移独立于共享 UnitDefinition，具体类型见 [schedule/index.ts](../../src/core/battle/schedule/index.ts)。

出生 offset 为固定量加各轴范围内随机扰动，同一次样本用于出生位置和 Route.Initial.offset。MOVE 的进入随机偏移是另一项语义，见 [Route](navigation.md#checkpoint-与进入)。

## 运行 State

主线保存 waveIndex、waveStartTick、fragmentStartTick 与阶段：PRE_DELAY、带当前 fragmentIndex 的 FRAGMENT、带开始时刻的 WAITING／POST_DELAY、COMPLETED。fragmentIndex 只在 FRAGMENT 持有，其他阶段从主线位置与 Definition 查最近进入过的片段。

每个 Branch 保存下次 Phase 索引，活动实例保存 Phase 定义、触发时刻与本次抽选的完整 Spawn 列表。waiting.wave 与 waiting.final 分别保存实际 Unit 等待关系。

主线 COMPLETED 不等于全部调度完成：仍可能有活动 Phase 或 final 等待。没有出生队列游标、剩余序列、独立 lastTick 或完成锁存。

## 公开入口

initialize 建立初始主线、Branch 索引和空等待；无 Wave 时主线直接完成，尚无历史的时基为零。isCompleted 只读推导主线完成、活动 Phase 为空且 final 等待为空，不裁决战斗胜负。

advance 推进主线与已有活动 Phase；triggerBranch 触发一个 Phase，loop 仅决定末尾选择是否回首；resolveUnits 释放已离场 Unit 的两个集合关系；releaseFromWave 只解除指定活 Unit 的 wave 等待。后两者不隐式 advance，不移除 Unit 或改变计数。

Battle 初始化登记全局 `battle.unit.removed` 反馈，任意完整 Unit 离场同步释放等待；通用 Unit 生命周期不依赖 Schedule。

## 出生时间

所有时刻基于 battle.tick。进入阶段的时刻不含前延迟：

- Wave 就绪为 waveStartTick 加 Wave 前延迟。
- Fragment 出生为 fragmentStartTick 加 Fragment 前延迟和 Spawn.atTick。
- Phase 出生为本实例 startTick 加 Phase 前延迟和 Spawn.atTick。
- Wave 等待超时为 WAITING.startTick 加最大等待；null 表示无超时。
- 后延迟结束为 POST_DELAY.startTick 加 Wave 后延迟。

进入新阶段记录当前 Tick，推进不快进战斗时间；零延迟或已满足条件在本次调用连续处理。

## 从 Spawn 到 Unit

出生先采样偏移并发布 RNG，再由 `Unit.initialize` 分配身份，用原 Definition、本次 Route Plan／offset 与 Facing 初值完成装配。接续初始化状态后先登记等待，再用 `Unit.add` 登记完整对象并派发 entered。

Route 在实际初始化时取得主线时间快照，登记后的 entered 同步进入首指令；这些回调已经能看到完整出生和等待事实。unit.add 不解释路线。返回后始终接续最新 State，不覆盖嵌套操作的 Schedule／RNG／Unit 修改。

其他技能、Effect 与机制创建者复用 Unit 初始化通道，自行选择路线来源和出生业务，不强制使用 Schedule Spawn。

## 主线推进

PRE_DELAY → 各 FRAGMENT → WAITING → POST_DELAY → 下一 Wave／COMPLETED。

一次 advance 转换到未来出生／延迟、未解除的 Wave 等待或主线结束。Fragment 完成只表示出生操作执行完，不等 Unit 离场，空 Fragment 立即完成；WAITING 不看 final 集合。

常规主线每 Tick 推进一次；绝对出生 Tick 决定本 Tick 的项目。同步 Hook 返回后继续未执行项，不重新扫描已出生项目；新阶段以实际进入 Tick 重新计算后续时刻。

## Branch 抽选与同步重入

每次触发按当前下一索引选择一个 Phase，使用当前 RNG 对 WeightedSpawns 选一个完整组，再先发布下一索引、RNG 与新 ActivePhase，最后同步执行当前到期的出生。循环重入同一 Phase 重新抽选，执行期间不重抽或修改静态 Definition。

entered 重入同一 Branch 时已看见下一索引和新 RNG，会建立独立实例；外层接续最新状态继续自身剩余项目。完成时按本次实例对象身份从最新集合移除，不按相同定义或触发 Tick 批量删除。

triggerBranch 处理新实例触发 Tick 的到期项；常规 advance 仅推进 startTick 早于本 Tick 的已有实例，各一次。因此触发在普通推进之前、期间或之后，都不重复出生。

Data 当前支持无 Pack 的加权组：主线先选 Action 再按原序展开，Branch 要求组候选连续。交错组与 Pack 关联明确报不支持；Core 只执行转换后的序列和整组候选。

## Route 的主流程时间上下文

timing 返回当前 Wave 进入时刻和最近主 Fragment 的前延迟结束时刻。FRAGMENT 使用当前片段，WAITING／POST_DELAY 使用本 Wave 最后进入片段，PRE_DELAY 向前查历史，COMPLETED 保留最后进入历史；空 Wave 继续向前查，没有历史返回零。

Branch 出生也使用实际出生时的主线时基，不用 Phase 时间。Route 保存快照，后续 Schedule 不改它；已有 Unit 新 Context 共享原快照，新 Unit 独立取样。

## 等待关系与生命周期

| Wait | Wave 等待 | 最终等待 |
| --- | --- | --- |
| NONE | 无 | 无 |
| FINAL | 无 | 有 |
| WAVE | 有 | 有 |

超时只清 wave；releaseFromWave 只解除指定 Unit 的 wave；完整离场解除两个集合。进入 POST_DELAY 后不回退已完成等待，下一 Wave 清旧 wave，final 始终保留。等待政策不决定击杀、漏怪、扣血或计数资格。

Data 合并 Action／Enemy 的 notCountInTotal 后，按以下优先级转换：不计数或不受 Scheduler 管理为 NONE；否则 dontBlockWave 或 Branch 默认豁免为 FINAL；其余 WAVE。forceBlockWaveInBranch 只取消 Branch 默认豁免，不能压过前述 NONE 或 dontBlockWave。Core 不再从出生位置猜默认政策。

## 领域边界

Schedule 只维护调度与等待；Route 决定路线出口并请求完整离场，已登记的 removed 反馈等待释放。统计、关卡生命、得分和终局由对应规则／调用者处理，不保存 Battle.result 或 Total／Finished／Killed。

## 回归语义

[统一验收](verification.md)覆盖时间轴、同样本出生与路线、等待早于 entered、超时／活 Unit 解除／离场、Branch 整组重抽与同步重入，以及空计划和真实出生时基。公共 Hook、RNG、Unit 析构不逐入口重复。

## 机制依据

[Scheduler 字段与调用路径](../research/cases/30-scheduler-action-data-fields.md)记录 Wave／Fragment／Branch、预处理、管理集合和计数；[Route](navigation.md#route-定义与进度)定义初始化和出口。[火龙返巢研究](../research/cases/34-prts-mechanism-coverage-audit.md#21-活-unit-独立解除当前-wave-等待)提供活 Unit 解除等待的真实使用例。研究提供事实，本页区分并规定项目行为。
