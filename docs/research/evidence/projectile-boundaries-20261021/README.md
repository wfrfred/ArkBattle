# Projectile 运动与命中边界：证据归档

## 调查问题与范围

取证日期：2026-10-21。核对 Projectile 的运动推进、命中入口、计时与候选筛选，并沿普通弩手等实际 Prefab 追踪内容绑定。

## 来源与文件用途

客户端、资源和摘录指纹见 [manifest.json](manifest.json)；具体资源字段及引用链见 [examples/crsbow-emitter.json](examples/crsbow-emitter.json) 与 [examples/logical-examples.json](examples/logical-examples.json)。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [movement/](movement/)：推进、运动和时间处理的指令及当轮 REPORT.md。
- [hit/](hit/)：命中、原目标及附加候选资格的指令和当轮分析。
- [examples/](examples/)：实际发射器与内容程序的必要投影及引用说明。
- [manifest.json](manifest.json)：客户端／资源身份、projectHead 和证据校验值。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/projectile-boundaries-20261021 --out .cache/native-research/projectile-boundaries-20261021
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

历史 REPORT.md 记录提取线索，但未保存其引用的完整临时工具链及全部原命令。

## 限制与关联结论

静态普通原生分支及精选内容投影，不包含客户端执行、活跃 XLua 或全内容扫描。原目标与额外候选必须按各自路径判断；样例存在不证明目标模式可达。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/16-projectile-motion-and-hit-boundaries.md)。本 README 只登记证据用途与复查方式。
