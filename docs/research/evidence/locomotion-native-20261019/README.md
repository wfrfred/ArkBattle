# Locomotion 运动与空间约束：证据归档

## 调查问题与范围

取证日期：2026-10-19。核对普通 Enemy 的运动积分、到达吸附、地形约束、移动资格、单位分离与强制位移；不重做 SPFA／Route 寻路研究。

## 来源与文件用途

DLL／metadata 的指纹和方法布局分列于 [motion/metadata.json](motion/metadata.json)、[space/metadata.json](space/metadata.json)、[states/metadata.json](states/metadata.json) 与 [interactions/metadata.json](interactions/metadata.json)。资源样本来源见 [interactions/sampled-content.json](interactions/sampled-content.json)。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [motion/](motion/)：积分、到达预测及辅助方法指令和字段。
- [space/](space/)：地图通行、局部避障、吸附、反射等空间约束摘录。
- [states/](states/)：移动状态、资格、属性及 Tick 顺序的指令与元数据。
- [interactions/](interactions/)：分离／推拉、控制器选择和具体资源样本；notes.md 保留当轮分析过程。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/locomotion-native-20261019 --out .cache/native-research/locomotion-native-20261019
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

历史元数据记录了部分 helper 位置和指令校验值；没有统一保存原提取命令及工具 Git 提交。

## 限制与关联结论

只覆盖所查普通原生路径和精选资源，未运行游戏、确认现场 XLua 或验证端到端轨迹。专用资源投影未作为通用字段解码器保存；复跑资源索引不等同于恢复全部历史投影。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/15-locomotion-native-semantics.md)。本 README 只登记证据用途与复查方式。
