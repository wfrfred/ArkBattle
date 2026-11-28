# Schedule 设计

Schedule 推进主 Wave 和 Branch 的战斗操作，管理出生 Unit 的波次等待。关卡可以在同一计划中安排出怪、实体出现、触发和离场。

## 静态计划

Definition 包含主 Waves 与按名称查找的 Branches。Wave 提供前延迟、后延迟、可空最大等待和 Fragment 序列。Fragment 提供前延迟与 Entry 序列。Branch 的每个 Phase 提供前延迟，允许混排确定 Entry 与按权重抽选的整组 Entry。

Entry 可以是 Spawn 或 Operation。Spawn 描述一次出生，包含完整 UnitDefinition、本次 Route Plan、Locomotion mode、固定 offset、随机半宽 randomRange、前延迟后的 atTick、Wait、可空统计资格 statistics 和出口扣血量 lifePointLoss。主线 count／interval 与随机组在 Data 预处理为确定序列，Branch 随执行抽选。

Operation 包含相对时刻 `atTick` 和 `execute(battle): Result<boolean>`。条目到期时，关卡通过 execute 读取实时 BattleState，按业务规则同步调用各领域的正常入口。Data 的 `compileSpawnSchedule` 负责出怪转换，其他操作由关卡组装。

普通 Spawn 的定义必须有 Route 及其依赖 Locomotion，可选择 Facing 等其他能力；不支持 Occupancy／Deployable，因为出生不提供登记地块。创建同时提供 Route 的 Plan／offset、Locomotion 的 mode 和 Facing 的 RIGHT 初值；未声明 Facing 时按通用规则忽略额外已知输入。Plan 与实例偏移独立于共享 UnitDefinition，具体类型见 [schedule/index.ts](../../src/core/battle/schedule/index.ts)。

出生 offset 为固定量加各轴范围内随机扰动，同一次样本用于出生位置和 Route.Initial.offset。MOVE 的进入随机偏移是另一项语义，见 [Route](navigation.md#checkpoint-与进入)。

## 运行 State

主线保存 waveIndex、waveStartTick、fragmentStartTick 与阶段。FRAGMENT 持有当前 fragmentIndex、排序后的条目与游标。WAITING／POST_DELAY 持有开始时刻。其他阶段从主线位置与 Definition 查最近进入过的片段。

每个 Branch 保存下次 Phase 索引，活动实例保存 Phase 定义、触发时刻、本次抽选并排序的条目及游标。waiting.wave 与 waiting.final 分别保存等待的 Unit Ref。

全部调度完成要求主线 COMPLETED、活动 Phase 为空且 final 等待为空。

## 公开入口

initialize 建立初始主线、Branch 索引和空等待；无 Wave 时主线直接完成，尚无历史的时基为零。isCompleted 只读推导主线完成、活动 Phase 为空且 final 等待为空，不裁决战斗胜负。

advance 推进主线与已有活动 Phase；triggerBranch 触发一个 Phase，loop 仅决定末尾选择是否回首；registerWait 按 Wait 为一次出生登记 Unit Ref；resolveUnits 按已离场的 Unit Ref 释放两个集合关系；releaseFromWave 只解除指定活 Unit 的 wave 等待。等待登记与解除不隐式 advance，不移除 Unit 或改变计数。

Battle 初始化登记全局 `battle.unit.removed` 反馈，任意完整 Unit 离场同步释放等待；通用 Unit 生命周期不依赖 Schedule。

## 调度时间

所有时刻基于 battle.tick。进入阶段的时刻不含前延迟：

- Wave 就绪为 waveStartTick 加 Wave 前延迟。
- Fragment 条目时刻为 fragmentStartTick 加 Fragment 前延迟和 Entry.atTick。
- Phase 条目时刻为本实例 startTick 加 Phase 前延迟和 Entry.atTick。
- Wave 等待超时为 WAITING.startTick 加最大等待；null 表示无超时。
- 后延迟结束为 POST_DELAY.startTick 加 Wave 后延迟。

进入新阶段记录当前 Tick，推进不快进战斗时间；零延迟或已满足条件在本次调用连续处理。

每个队列按 `atTick` 推进，同刻条目沿用计划顺序。条目到期后调用 execute 并接续返回的 State。操作完成时返回 `value: true`，游标推进。遇到目标尚未出现等情况时，操作可以返回 `{ state: battle, value: false }`，保留当前条目和后续条目，其他队列仍可推进。下次推进用当前 BattleState 重试，完成后接着处理同队列已到期的条目。各条目沿用最初的绝对时刻，进入下一 Fragment 或 Wave 才建立新的时基。

## 从 Spawn 到 Unit

出生先采样偏移并发布 RNG，再由 `Unit.initialize` 分配身份，用原 Definition、本次 Route Plan／offset、Locomotion mode 与 Facing 初值完成装配。接续初始化状态后登记等待，并按本次 `statistics` 在 [Statistics](statistics.md#资格与登记) 登记计数资格、按 `lifePointLoss` 在 [Life Points](life-points.md#个体出口结算) 登记出口扣血量，再用 `Unit.add` 登记完整对象并派发 entered。

Route 在实际初始化时取得主线时间快照，登记后的 entered 同步进入首指令；这些回调已经能看到完整出生、等待和计数登记事实。unit.add 不解释路线。返回后始终接续最新 State，不覆盖嵌套操作的 Schedule／RNG／Unit 修改。

其他技能、Effect 与机制创建者复用 Unit 初始化通道，自行选择路线来源和出生业务，不强制使用 Schedule Spawn。需参与等待时，与计划出生一样接续 Unit.initialize 的 state，在 Unit.add 前调用 `registerWait(battle, ref(unit), wait)`；每次出生只登记一次，NONE 不写入等待关系。需要参与计数或出口扣血时分别调用 `statistics.register` 或 `lifePoints.register`，三种登记彼此独立。

## 主线推进

PRE_DELAY → 各 FRAGMENT → WAITING → POST_DELAY → 下一 Wave／COMPLETED。

一次 advance 推进至未来条目、待重试的操作、阶段延迟、未解除的 Wave 等待或主线结束。Fragment 完成表示所有条目执行完，空 Fragment 立即完成。Unit 离场等待由 WAITING 处理，只看 wave 集合。

常规主线每 Tick 推进一次。同步操作和 Hook 返回后从最新 BattleState 继续剩余条目。

## Branch 抽选与同步重入

每次触发按当前下一索引选择一个 Phase，使用当前 RNG 从 WeightedEntries 选一个完整组，先发布下一索引、RNG 与新 ActivePhase，再同步执行当前到期的条目。循环重入同一 Phase 重新抽选，本次执行沿用已抽选的序列。

Operation 或 entered 钩子触发同一 Branch 时，会看到已发布的索引和 RNG，并建立独立实例。外层接续最新 BattleState 继续自己的条目，按当前实例对象更新游标或移除已完成实例。

triggerBranch 处理新实例触发 Tick 的到期项。常规 advance 只推进 startTick 早于本 Tick 的已有实例，各一次。

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

超时只清 wave；releaseFromWave 只解除指定 Unit 的 wave；完整离场同步解除 wave 与 final 两个集合。进入 POST_DELAY 后不回退已完成等待，下一 Wave 清旧 wave，final 始终保留。等待政策不决定击杀、漏怪、扣血或计数资格。

项目简化：原生普通路径启用 `useRecycleToFinishScheduler` 时，死亡销毁释放波次等待，对象池回收才释放终局等待，已核主线 0-1 普通敌人默认回收预算为 1 秒，因此终局等待可能晚于死亡解除。项目不模拟这段回收等待；完整离场同步解除两种等待，无需另存待回收实例或延迟 Branch。终局表现时序由外部决定。[原生证据](../research/evidence/scheduler-recycle-config-20261122/README.md)

Data 合并 Action／Enemy 的 notCountInTotal 后，按以下优先级转换：不计数或不受 Scheduler 管理为 NONE；否则 dontBlockWave 或 Branch 默认豁免为 FINAL；其余 WAVE。forceBlockWaveInBranch 只取消 Branch 默认豁免，不能压过前述 NONE 或 dontBlockWave。Core 不再从出生位置猜默认政策。

## 领域边界

Schedule 只维护调度与等待；Route 按 Main 的 EXIT 终点决定自然出口并请求 Unit 以 EXIT 原因完整离场；内容触发的强制出口也走同一生命周期。已登记的 removed 反馈等待释放，结算消费者可用 Departure.reason 区分出口与其他离场。Schedule 不持有 Total／Finished／Killed 或关卡生命值；[Statistics](statistics.md) 和 [Life Points](life-points.md) 独立维护普通个体账务与生命资源。各领域提供结算事实，外部规则／调用者裁决胜负、得分和终局；Core 不保存 Battle.result。

## 回归语义

[统一验收](verification.md)覆盖时间轴、混排操作等待目标并重试、同样本出生与路线、等待早于 entered、超时／活 Unit 解除／离场、Branch 整组重抽与同步重入，以及空计划和真实出生时基。

## 机制依据

[Scheduler 字段与调用路径](../research/cases/30-scheduler-action-data-fields.md)记录 Wave／Fragment／Branch、预处理、管理集合和计数；[Route](navigation.md#route-定义与进度)定义初始化和出口。[火龙返巢研究](../research/cases/34-prts-mechanism-coverage-audit.md#21-活-unit-独立解除当前-wave-等待)提供活 Unit 解除等待的真实使用例。研究提供事实，本页区分并规定项目行为。
