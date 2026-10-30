# Projectile 停止与终结：证据归档

## 调查问题与范围

取证日期：2026-10-21。核对 StopMe、TryEliminate、命中后等待、Destroy／回收顺序及同步终结相关路径，并追踪逻各斯清弹和延迟命中的实际配置。

## 来源与文件用途

客户端及证据校验值见 [manifest.json](manifest.json)，延迟样例的资源来源另见 [delay/asset-provenance.json](delay/asset-provenance.json)。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [entries/](entries/)：停止／消除入口、直接调用候选及逻各斯实际组件。
- [order/](order/)：Hit、Stop、Destroy 和对象管理顺序的指令与字段。
- [delay/](delay/)：维什戴尔、慑砂、承曦格雷伊等延迟／持续命中的精选发射器与模板投影。
- [manifest.json](manifest.json)：批次输入文件和证据校验值。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/projectile-stop-20261021 --out .cache/native-research/projectile-stop-20261021
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

REPORT.md 记录过部分 extract／xref 工具线索；完整原脚本和调用参数未全部保存。

## 限制与关联结论

普通停止、消除与对象回收分别解释。静态路径、xref 字节命中和资源存在都不能单独证明某场战斗的实际执行；未核实运行中 Lua 替换。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/17-projectile-stop-and-termination.md)。本 README 只登记证据用途与复查方式。
