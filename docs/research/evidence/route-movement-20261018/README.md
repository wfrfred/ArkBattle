# Route 与运动推进时序：证据归档

## 调查问题与范围

取证日期：2026-10-18。核对 Cursor 预测、等待、不可达点处理、运动推进和目标采样之间的原生调用关系。

## 来源与文件用途

[manifest.json](manifest.json) 明确复用 [Navigation 输入登记](../navigation-native-20261018/manifest.json) 的客户端指纹，并保存本批次方法和字段布局；不把没有另存指纹解释为新一次独立校验。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [manifest.json](manifest.json)：范围、方法 token／VA、字段布局及复用来源。
- [fields.json](fields.json)：BasicCursor、DirectionCursor 与等待／移动路点字段。
- `*.asm`：Route、Cursor、Enemy 和运动调用链相关指令。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/route-movement-20261018 --out .cache/native-research/route-movement-20261018
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

原提取工具版本与完整命令未独立登记。

## 限制与关联结论

静态普通分支，不是实战逐帧轨迹；逻辑 Tick 与渲染帧不混用。没有确认运行时 XLua 或其他模式的覆盖行为。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/13-route-and-movement-timing.md)。本 README 只登记证据用途与复查方式。
