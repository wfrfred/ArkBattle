# Route creation origin evidence

2026-11-07，范围仅为已有 Route、运行时构造 Route、源格／目标格与出生偏移的创建输入；不扩展 Route 运行生命周期。

客户端指纹与根批次 probe 相同：GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，metadata v29。

- `route-origins-bodies.json`：按当前 metadata 全名重定位的 Map.GenerateRuntimeRoute 三重载、Scheduler.GenerateRuntimeRoute、两个 Action 召唤节点与 LevelScript 召唤节点；保留完整相邻 .pdata 片段及指令 VA。
- `existing-origin-bodies.json`：从同指纹的旧批次原样选取已有 Route、RuntimeRoute、Npc、tracked 与内部创建重载。derivation 保存来源、SHA-256 和方法选择器，不将旧反编译结论冒充本次执行观测。
- `route-type.json`、`route-data-type.json`：当前 Route／RouteData 字段及方法签名。
- `origin-node-types.json`：三个调用节点的字段与方法签名，用于对应指令字段偏移。

新方法使用共享完整片段提取器复跑，例如：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out /tmp/route-origin-replay.json \
  --method Torappu.Battle.Map.GenerateRuntimeRoute \
  --method Torappu.Battle.Scheduler.GenerateRuntimeRoute \
  --method Torappu.Battle.Action.Nodes/SummonEnemyWithRuntimeRoute.Execute \
  --method Torappu.Battle.Action.Nodes/SummonEnemyOnTargetTileWithRuntimeRoute.Execute \
  --method Torappu.Battle.LevelScript.LevelScriptNodes/SummonEnemyWithRuntimeRoute.Execute
```

类型使用 `native.py type <完整类型名>` 复跑；具体选择器见 JSON 的 fullname。普通静态分支未运行客户端，不确认 XLua 运行时覆盖、资源激活或所有外部调用者。机制结论由根任务维护于案例，不在本目录建立第二套结论。
