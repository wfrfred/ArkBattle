# 最终等待的对象池回收配置

2026-11-22 补查 [Case 30](../../cases/30-scheduler-action-data-fields.md)。[result.json](result.json) 记录 Windows 客户端、配置资源、关卡与敌人组件的指纹和选择位置。

| 环节 | 证据 |
| --- | --- |
| 安装版配置与回退值 | `DynamicConfig.Load` 在 `0x183e51185` 读取 `GlobalOptions`，经 `0x183e511e5` 加载 `dynamicConfigPath` 指向的 TextAsset，在 `0x183e51229` 反序列化为 `InternalConfig`。`sharedassets0.assets` 存有地址 `Config/config`。`init/config/common.ab` 对应的资源包中，`dyn/config/config.json` 指向 TextAsset `-8829083249734110803`。该 JSON 未覆盖 `useRecycleToFinishScheduler`，基础与缓存更新清单为此资源记录了相同的内容校验值。`InternalConfig..ctor` 在 `0x183e57388` 对包含 `+0x32` 的四个字节写 `0x01010101`，`Load` 的回退创建也写同样的值。普通加载路径据此使用 true。 |
| 销毁与回收 | `Scheduler._OnUnitDestroyed` 解除 wave 后在 `0x180986ea4–0x180986eab` 读取该开关，为 true 时保留 final。`_OnEnemyRecycled` 在 `0x180986bc9` 移除 final 成员。 [两处回调原件](../scheduler-general-20261107/lifecycle/README.md) |
| 实际普通敌人 | 主线 0-1 的 `/waves/0/fragments/5/actions/1` 编排一名 `enemy_1002_nsabr`，受 Schedule 管理且参与本波等待。Prefab 的启用组件是标准 `Enemy`。其回收 getter 在 `0x180acb147` 读取 `+0x4d8`，构造和 Reset 在 `0x180ac9c7e`、`0x180ac0358` 将该值设为 1.0。未由特殊分支截获的普通死亡使用回收等待。 [普通回收协程](../deployment-exit-limits-20261122/README.md) |
| 最终等待的消费者 | `_DoSchedule.MoveNext` 在 `0x18098e357` 装入 `_CheckFinalNotFinish`，随后于 `0x18098e36e` 调 `WaitWhileFixed`。结束等待后 `0x18098e5f8` 调 `SchedulerDriver.OnSchedulerFinish`。默认分支的 `_IsAllFinished` 通过时，于 `0x18097c29c` 调 `BattleController.FinishGame`。 |

证据限于固定安装资料和所列普通静态分支。未执行原生关卡，未观测活跃 XLua、特殊回收改写或实际秒数。

从仓库根目录执行以下命令。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/scheduler-recycle-config-20261122/extract.py \
    --out /tmp/arkbattle-scheduler-recycle-config-replay.json
```
