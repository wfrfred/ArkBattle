# SP 回复公式与计时：证据归档

## 调查问题与范围

取证日期：2026-10-15。核对 SP 自然回复速度／倍率、回复计时器及阻回路径的原生算术、取整和调用关系。

## 来源与文件用途

[records.json](records.json) 的 client 保存客户端指纹、metadata 布局和方法表定位，tool 保存 Capstone wheel 文件名、URL 与 SHA-256；types 和 methods 保存字段及相关指令。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [records.json](records.json)：输入身份、Capstone 5.0.9 安装包来源、字段布局、31 个相关方法与公式证据。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/sp-calculation-20261015 --out .cache/native-research/sp-calculation-20261015
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

Capstone 包版本及指纹已记录，完整原提取脚本和执行命令未保存。

## 限制与关联结论

未执行客户端或确认运行时 XLua；本批次针对回复公式，不证明 SP 容量／门槛／支付或 TIME 采用同一归并规则。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/09-skill-mechanisms-and-requirements.md)。本 README 只登记证据用途与复查方式。
