# Scheduler 出生、登记、销毁、回收与结束判断补核

日期：2026-11-07。这里只登记生命周期证据、复跑入口和限制，机制结论统一维护于[案例 30](../../../cases/30-scheduler-action-data-fields.md)。范围是通用 Scheduler 的普通原生分支；没有运行游戏，也没有验证 XLua 的实际绑定。生息、保全等特殊玩法不在支持范围内，类型分派中出现其方法不代表本批扩展其机制。

客户端指纹沿用原件：GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，metadata v29，imageBase `0x180000000`。

## 原件与复跑

- `../../scheduler-native-20261107/spawn-bodies.json`：`_DoSpawn`、两项 `_DoSpawnEnemyInternal`、`_OnActionExecuted`、`_OnUnitDestroyed`、`_OnEnemyRecycled`、`_CheckWaveNotFinish`。
- `../../scheduler-native-20261107/branch-bodies.json`：`_CheckFinalNotFinish` 等。
- `../../scheduler-action-fields-20261107/field-extra-bodies.json`：两项 Branch 外部召唤方法。
- 根批次[原件 native-paths.json](../native-paths.json)：`CalculateStates`、`Reset`、`_VerifyEnemy`、`MarkEnemyKilled`、外部 Route/RuntimeRoute/Npc 与 tracked 入口。本目录 `*.txt` 是这些 JSON 的可读摘录，保留指令 VA；源路径如为 `.cache`，以根批次归档原件为准。
- `extra-bodies.json`：本分工补提取 Branch 路线访问、`DontCountAsFinished`、remaining/completeProgress、`ReleaseEnemyFromCurrentWave`、`_NotCountInTotal`，以及虚调用 thunk `0x180005610`。
- `entity-type.json`：Entity 字段/方法结构，slot 40 是 `get_alive`。
- `tracked-runtime-bodies.json`：tracked RuntimeRoute 状态机、最终结束检查、默认 GameMode 最终条件及 Entity `get_alive`。
- [Branch 路线游标纠正](branch-route-cursor-note.md)：记录 `TryPickNextPhase` 的 isLoop 参数与 nextPhaseI 写入 VA；纠正早期将 true 误称 peek 的说明。
- [Wave tag 最小消费摘录](wave-tag-consumption.md)：BossRush/Cooperate 的直接字段读取和返回结果、委派路径及未闭合值；原件为 `tag-consumer-bodies.json`、`tag-forwarded-bodies.json`、`tag-cooperate-preprocessor.json`，字符串证据为 `tag-literals.json` 与专用解码器 `decode_tag_literals.py`。仅核对标签消费，不扩模式实现。

原生 JSON 由完整 `.pdata` 连续片段提取器生成：

```sh
UV_CACHE_DIR=$PWD/.cache/uv uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out /tmp/scheduler-lifecycle-replay.json \
  --method Torappu.Battle.Scheduler.TryGetEnemyRouteFromBranch \
  --method Torappu.Battle.Scheduler.TryGetAllEnemyRoutFromBranch \
  --method Torappu.Battle.Enemy.DontCountAsFinished \
  --method Torappu.Battle.Scheduler.get_remainingEnemiesCnt \
  --method Torappu.Battle.Scheduler.get_completeProgress \
  --method Torappu.Battle.Scheduler.ReleaseEnemyFromCurrentWave \
  --method Torappu.Battle.Scheduler._NotCountInTotal \
  --helper 0x180005610
```

其余选择器都在 JSON 的 `result.bodies[].selector` 内。`*.txt` 由 JSON 的方法与全部 fragments.instructions 按 `VA mnemonic operands methods` 展平，没有反编译成 C#。边界中的 `int3`、跳表数据以及 padding 保留；不将数据解码所得伪指令解释为实际路径。原件含 XLua 入口及模块/工具指纹；所有结论均为未走 XLua 的静态普通分支。

## 限制

- 静态普通分支，不确认运行时 XLua 覆盖或动态开关的当前值。
- 入口语义与真实内容可达性分别记录；没有为每个外部重载追踪全部调用者。
- 资格虚调用结合 helper 指令与 Entity slot 40 的 get_alive 定位，不仅根据寄存器中的槽号猜测方法名。
- 完成计数、击杀统计、本波集合、最终集合和退出时点的结论见案例，不能从 raw 方法名或某个布尔默认值推断。
