# 诺伯特平民的初始阵营与阻挡：证据归档

## 调查问题与范围

取证日期：2026-10-29。核对平民／寻路密探的 Enemy Prefab 初始阵营、阻挡相关字段和原生枚举映射，区分玩法友好标签与实际 sideType。

## 来源与文件用途

[selected-witnesses.json](selected-witnesses.json) 的 sources 保存 enm_pfb_13.ab、DLL 和 metadata 指纹；prefabs 保存 CAB、PathID 及精选字段。该文件的 existingBlockingEvidence 指向复用的阻挡取证。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [selected-witnesses.json](selected-witnesses.json)：输入指纹、平民控制器／模式字段、SideTypeIndex 解码、原生访问器及已有证据锚点。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/norport-civilian-20261029 --out .cache/native-research/norport-civilian-20261029
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

保留了所查对象和原生定位，没有保存完整专用提取脚本、工具版本和原命令。

## 限制与关联结论

初始资源和普通 native 分支不能证明运行中阵营从不改变。鉴定、颜色、无敌和禁挡的完整内容／Lua 实现没有在此批次追踪，玩法资料与原生直接证据须分别解释。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/20-norport-civilian-allegiance-and-blocking.md)。本 README 只登记证据用途与复查方式。
