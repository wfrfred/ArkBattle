# CancelReason 消费端证据

当前客户端指纹与父批次相同：GameAssembly SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。只读静态提取，保留 XLua 边界。机制结论由案例38集中维护。

- `getter.json`：`Modifier.get_cancelReason #72145` 完整体、直接调用候选、Modifier 字段；查到 `ApplyModifier`、两个过滤节点、UI 和 XLua 包装。
- `consumers.json`：`ApplyModifier #67665`、`FilterModifierCancelReason #100276`、`FilterDamageCancellation #101496`、`UIController.ShowModifierText #105936`、取消权限与忽略闪避方法完整体；另含原因 setter 和 Cancel 的直接调用候选。
- `ui-literals.json`：从上述 UI 指令的 RIP 槽解码静态字面量，同时保存 UI 字段。MISS、HIT_FAILED 均读取 `miss`；BLOCKED 读取 `block`，原因4转入数值显示。入口 `get_targetType == 0` 限定 HP；不是 EP UI 证据。
- `field-scan.json`：Modifier 本类65个完整方法中的非栈 `+0x70` 定位98处。两处标量访问是 getter／setter；其余向量指令传递整份 Modifier。没有把这些复制视为独立原因消费。范围不含全模块指针别名分析。
- 实际过滤器配置和单位／技能绑定见相邻 `cancel-content/`，避免重复保存整份 Holder 扫描；特殊原因的生产者见 `cancel-specials/`。

复跑（仓库根目录）：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/cancel-getter-replay.json --body Torappu.Battle.Modifier.get_cancelReason --xref Torappu.Battle.Modifier.get_cancelReason --owner Torappu.Battle.Modifier --search CancelReason
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/cancel-consumers-replay.json --body-index 67665 --body-index 100276 --body-index 101496 --body-index 105936 --body Torappu.Battle.Modifier.CheckIgnoreCancel --body Torappu.Battle.Modifier._CheckIgnoreMiss --xref Torappu.Battle.Modifier.set_cancelReason --xref Torappu.Battle.Modifier.Cancel --owner Torappu.Battle.Action.Nodes/FilterModifierCancelReason
python docs/research/evidence/resource-mechanisms-20261114/damage/cancel-consumers/decode_ui_literals.py --out .cache/native-research/cancel-ui-replay.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/cancel-modifier-field-bodies.json --body-prefix Torappu.Battle.Modifier. --owner Torappu.Battle.Modifier
python docs/research/evidence/resource-mechanisms-20261114/damage/cancel-consumers/summarize_field_scan.py --input .cache/native-research/cancel-modifier-field-bodies.json --out .cache/native-research/cancel-field-replay.json
```

`decode_ui_literals.py` 以已归档 `consumers.json` 的指令边界为输入，再核当前文件槽值；它不重新反编译 UI。`field-scan` 的完整中间体可由上述命令重提，归档保留选择、指纹与所有命中。getter／setter xref 仅覆盖直接 E8/E9；不能据此排除间接调用、有效 XLua 或整个模块中未经类型恢复的字段访问。
