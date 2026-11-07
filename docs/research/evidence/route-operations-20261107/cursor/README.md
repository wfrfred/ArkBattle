# Route／Cursor 方法清单与状态操作

2026-11-07。本目录提供 Route 操作调查的底层证据；集中结论由父批次引用的案例维护，不在本目录确定 Core API。

## 来源与范围

Windows x64 客户端，metadata v29，imageBase `0x180000000`：

- `GameAssembly.dll`：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat`：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

`inventory.json` 保存 Route、BasicCursor、DirectionCursor、GridCursor、TracePositionCursor、Act6FunEmptyCursor、DouququEmptyCursor、MarblesCursor、PreviewCursor 及 BasicCursor 嵌套 Checkpoint 类型的全部声明方法、字段、父类型与 slot，共 22 类型。选取列表见提取器，不把这个列表冒充全客户端调用入口全集；父批次另从全 metadata 的继承、字段与参数返回类型寻找使用者。

`state-bodies.json` 保存 BasicCursor、DirectionCursor、GridCursor、TracePositionCursor 的全部普通声明方法（不重复 XLua BaseProxy），以及 Route 重建／偏移写入和 MOVE、WAIT 的构造／初始化／修改方法，共 83 个选择器。保留到下一个已知 native 方法之前的全部连续 `.pdata` 片段。其余 Route 的距离／可达查询及专用 Cursor 声明在 inventory，未因此宣称其完整实现都被本批逐条核实。

`direct-callers.json` 对 14 个已选状态操作扫描全部 executable section 的 E8/E9 候选，共 60 条。字节候选、最近方法身份与实际合法调用分别判断；例如 AddMapOffsetMoveCkReachOffset 的共享 Convert 地址候选不能作为有效调用。虚调用、delegate、反射及 XLua 不由这个扫描覆盖。Reset 的实际虚调用另外根据 slot 5 与 OnRouteChanged／构造器指令核实。

## 派生类覆盖复核

`subclass-slot-audit.json` 从父批次完整继承清单取出 22 个 Enemy 派生类型，对其 308 个有地址的普通声明方法进行连续 `.pdata` 解码，排除 Enemy 基类及 XLua BaseProxy。记录每项选择器、代码区间、分段字节哈希与解码标记，检查目的内存操作数是否直接使用主 Cursor／缓存／追踪槽的 `+0x370／+0x378／+0x380／+0x390`，本范围没有候选。它不排除计算地址后再写入、跨槽宽写、其他字段偏移或任意间接／热更写入，不能写成全客户端没有其他写入。

`subclass-bodies.json` 保留实际细读的 18 个派生方法：BObjectFollower、Follower、FixedDirection 的运动覆盖，MarblesLike、Controllable 的初始化与 Cursor 选择，GameCityRoute 的移动／预览生成，TraceTarget 的运动分支，以及 TeamSide／ArkDex 的空 Cursor 选择。这些实现用于区分主路线程序变更、独立运动控制与表现预览；本目录没有凭类名决定它们所属玩法或实际启用。

`state-bodies.json` 的 `_CreateCheckpoint` 在普通分派代码后包含内联跳转表，末段 `fullyDecoded=false` 准确保留；不能将把数据当指令的连续解码结果作为额外行为。其余选择器也各自保留实际解码边界，完整字节范围与完整控制流不是同一个保证。

## Route 本体逐方法补核

`route-all-bodies.json` 另保存当前 Route 的全部 39 个普通声明方法正文及完整字段／签名，没有按 Get／Check 名称排除方法，也没有跳过共享 getter。程序重建和地图偏移写入仍归属于已选入口；本次新增确认的是两类查询副作用：带 PathCostProfile 的 GetCheckpointNextMap／GetTargetNextMap 会经 `_GetOrCreateProfiledNextMaps` 懒创建、登记并生成导航场缓存，GetSpawnOffset 则实际调用 Map 的 RNG 采样。前者不重建 Cursor／Checkpoint，后者不把样本存回 RouteData。其余逐项所查的距离、到达、可达及路径预测普通分支没有发现新的程序改写入口；出参和局部临时数据的写入不当作 Route 状态变化。

这里同时保留边界限制：共享 `GetTargetNextMap()` 在 `0x1805182c0` 的实际入口是读取 `+0x28` 后于 `0x1805182c4` 返回；由于后续泛型函数没有独立 metadata 地址，按下一已知入口保存的连续片段还包含 `0x1805182d0` 起的相邻代码。后者不可仅因落在归档范围就归因给该 getter。判定副作用结合入口可达控制流、对象来源和字段类型，不把全部尾随指令机械当作方法行为。

## 复跑

从仓库根目录执行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/route-operations-20261107/cursor/extract_cursor.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-20261107/cursor-replay
```

派生类复核使用同一版本客户端和父批次 `inventory.json`：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/route-operations-20261107/cursor/audit_subclasses.py \
  --inventory docs/research/evidence/route-operations-20261107/inventory.json \
  --out .cache/native-research/route-operations-20261107/subclass-replay
```

完整 Route 本体复跑：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/route-operations-20261107/cursor/audit_route.py \
  --out .cache/native-research/route-operations-20261107/route-all-replay
```

专用提取器复用共享 `native.py`，脚本身份写入各输出 provenance。选择器可用共享 `replay.py` 复查；字段／地址必须重新从当前版本定位，不能把本版 index 套给新客户端。

本批只核对静态普通分支，没有执行客户端，也没有验证活跃 XLua 覆盖或所有专用玩法 Cursor。内容正例与调用参数由父批次其他子目录提供，方法存在本身不表示有支持玩法的实际需求。
