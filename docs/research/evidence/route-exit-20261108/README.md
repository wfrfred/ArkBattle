# 普通 Enemy 的终点与蓝门离场

2026-11-08 定向核对。机制结论维护于[案例 13 第 5.1 节](../../cases/13-route-and-movement-timing.md#51-终点检查与蓝门离场2026-11-08-补核)。本批只核对普通 Enemy／DefaultGameMode，未运行客户端，不扩展特殊玩法或全部资源回收路径。

## 来源

- Windows x64 客户端，metadata v29；GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 各 JSON 保存完整 provenance、准确方法 selector、原生 VA 和连续 `.pdata` 片段。尾部 padding／跳表不作为可执行路径解释。

## 材料

| 文件 | 选择 |
| --- | --- |
| `on-tick.json` | 从[既有当前版本原件](../route-operations-20261107/temporary/native.json)摘录 Enemy.OnTick，保留原 provenance |
| `entry.json` | Enemy 的退出资格、ReachExit／FinishWithReachExit，BattleController 的退出资格分派与 Entity 包装 |
| `finish.json` | DefaultGameMode.CheckEnemyCanExit，Enemy.FinishMe／OnFinish／状态机构造包装 |
| `lifecycle.json` | 状态机构造、Entity.FinishMe／OnFinish、Unit.OnFinish、两项 BattleController 通知 |
| `settlement.json` | Enemy.canNotExit getter／setter、默认模式漏怪扣生命与 DestroyEntity、Unit 完成通知 |
| `types.json`、`inspect_types.py` | 精确枚举值及相关方法签名；State.REACH_EXIT=7，FinishReason.REACH_EXIT=1 |

`canNotExit` getter 在 `0x180aca947` 读取 Enemy 自身 `m_canNotExit`（+0x420），setter 在 `0x180ac305e` 写同一字段。rootTile 是另一个存在性条件，不是该属性的拥有者。[Enemy 字段与虚槽](../route-operations-20261107/content/enemy-type.json)分别给出 rootTile slot 52、canNotExit slot 215、主 cursor slot 225、运动 cursor slot 226。OnTick 的主 Cursor.CheckReached 为 Cursor slot 9；本批按这些 metadata 签名定位虚调用，不由调用名猜测。

## 复跑

在仓库根目录执行，输出到独立目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/route-exit-20261108/inspect_types.py \
  --out /tmp/route-exit-types.json

UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out /tmp/route-exit-entry.json \
  --method Torappu.Battle.Enemy.OnTick \
  --method Torappu.Battle.Enemy._CheckEnemyCanExit \
  --method Torappu.Battle.Enemy.ReachExit \
  --method Torappu.Battle.Enemy.FinishWithReachExit \
  --method Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.CheckEnemyCanExit
```

其余方法可用 JSON 的 `result.bodies[].selector.fullname` 传入同一提取器，或按本批 archive 选择器使用共享 `replay.py`。统计和 Scheduler 集合释放复用[案例 30](../../cases/30-scheduler-action-data-fields.md#5-四个争议字段与退出账务)及[已有生命周期原件](../scheduler-general-20261107/lifecycle/README.md)，未重查所有通知绑定。

本批未在“主终点检查 → 退出资格 → REACH_EXIT／FinishMe”这条普通静态路径看到独立的 Route completed 锁存，也未看到 Blocking 阻止退出的检查。这不证明其他特化、XLua 或内容路径全局不存在相应状态或限制。DefaultGameMode.DestroyEntity 对 REACH_EXIT 走延迟回收；本批不保证视觉回收完成时点与逻辑结束、统计或 Scheduler 最终集合释放同一时刻。
