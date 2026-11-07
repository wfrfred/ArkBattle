# 出生路径的 Scheduler 时钟参数补核

本目录保存 `SchedulerSnapshot` 的生产、结构和临时 Cursor 初始化对照原件。机制结论由根批次对应案例集中维护；这里不定义 ArkBattle API。

客户端：GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，metadata v29，imageBase `0x180000000`。与本次 probe 及既有 scheduler-general／scheduler-native 批次指纹一致。

## 原件

- `take-snapshot.json`：`Scheduler.TakeSnapshot` 的完整普通及 XLua 分支。
- `snapshot-type.json`：`Scheduler/SchedulerSnapshot` 的本版本字段布局；值类型字段使用 unboxedOffset。
- `temporary-cursor-clocks.json`：`BasicCursor.get_snapshot`／`set_snapshot`，以及 `Enemy/FearController.UpdateFearCursor`、`Enemy/AttractController.UpdateAttractCursor` 的完整方法体。

复用已归档原件：

- [普通出生与内部出生器](../../scheduler-native-20261107/spawn-bodies.json)：两项 `_DoSpawnEnemyInternal` 及普通 `_DoSpawn.MoveNext`。
- [外部出生路径](../../scheduler-general-20261107/native-paths.json)：WithRoute、RuntimeRoute、Npc 与 tracked 入口。
- [tracked RuntimeRoute](../../scheduler-general-20261107/lifecycle/tracked-runtime-bodies.json)：延迟状态机。
- [Scheduler 字段布局](../../scheduler-native-20261107/scheduler-fields.json)：主 Wave／Fragment 时间字段。
- [Wave 推进](../../scheduler-native-20261107/branch-bodies.json)与[Fragment 推进](../../scheduler-native-20261107/random-bodies.json)：上述两个时间字段的写入。

上述材料中的相关选择器和参数签名保留在各 JSON 内；不能仅凭旧文件名或相似函数名替换重载身份。Enemy.Init 到 Cursor 构造的下游完整原件由根批次另外保存。

## 复跑

在仓库根目录执行，完整输出写入独立缓存目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/route-creation-replay/timing/take-snapshot.json \
  --method Torappu.Battle.Scheduler.TakeSnapshot

UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/route-creation-replay/timing/snapshot-type.json \
  type Torappu.Battle.Scheduler/SchedulerSnapshot

UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/route-creation-replay/timing/temporary-cursor-clocks.json \
  --method Torappu.Battle.Enemy/FearController.UpdateFearCursor \
  --method Torappu.Battle.Enemy/AttractController.UpdateAttractCursor \
  --method Torappu.Battle.BasicCursor.get_snapshot \
  --method Torappu.Battle.BasicCursor.set_snapshot
```

## 限制

- 这是静态原生普通路径核对，没有运行游戏、确认实际 XLua 绑定或全部特化入口。
- 外部方法先取得 Route，与实际 CreateEnemy 前读取 Snapshot 是两个不同观察点；延迟状态机需沿恢复后的调用继续追踪。
- Fear／Attract 仅作这两个具体初始化路径的对照，不推广为所有 Alternative 路线。
- Snapshot 存在 setter；构造时按值保存不等于此后绝不允许其他程序显式替换它。
- `actionStartTime` 的默认值与不同出生调用者传入的最终值分别核对，不从 `TakeSnapshot` 的一个默认写入推广全部创建入口。
