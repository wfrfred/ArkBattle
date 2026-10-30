# Navigation 原生寻路与射线：证据归档

## 调查问题与范围

取证日期：2026-10-18。定位原生 SPFA、路径平滑、Node 资格及射线遍历，并在有界输入下比较原始指令、还原模型与当时项目实现。

## 来源与文件用途

客户端输入指纹、方法 token／VA、Node 布局和摘录校验值见 [manifest.json](manifest.json)；[inputs.json](inputs.json) 保留输入文件登记，[stronghold-inputs.json](stronghold-inputs.json) 是当时项目输入指纹，二者不可互相替代。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [manifest.json](manifest.json)：客户端来源、方法定位、布局及证据文件校验值。
- `*.asm`：已选择的方法与调用链指令摘录。
- [emulated-ray-results.json](emulated-ray-results.json)：Unicorn 执行原始射线指令的输入、输出及依赖调用轨迹。
- [emulation-notes.txt](emulation-notes.txt)：仿真入口、Unicorn 2.1.4、stub 和未执行部分。
- [semantic-witnesses.json](semantic-witnesses.json)：还原模型与当时项目实现的合成输入对照，不是实战观测。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/navigation-native-20261018 --out .cache/native-research/navigation-native-20261018
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

仿真版本与 stub 已记录于 emulation-notes.txt；原仿真脚本、共享 helper 源码和完整原命令未随本批次保存。

## 限制与关联结论

共享复现入口可复查已登记原生方法，不能重建未归档的 emulate-rays.py 或证明其 stub 的行为正确。Unicorn 结果只覆盖 WALK 和记录的有界场景，不能当作完整游戏寻路验证。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/12-navigation-native-algorithm.md)。本 README 只登记证据用途与复查方式。
