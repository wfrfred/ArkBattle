# Skill 修正、参数操作与实际内容：证据归档

## 调查问题与范围

取证日期：2026-10-29。核对 Skill 参数究竟由属性修正、配置预处理、资源操作还是本轮执行状态变化解释，并追踪相关实际内容。

## 来源与文件用途

[native.json](native.json) 与 [parameter-operations.json](parameter-operations.json) 分别保存客户端指纹、工具 SHA／版本、方法和字段；[content.json](content.json) 的 sources 保存 Bundle、第三方 activity_table 镜像及其版本关联限制。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [native.json](native.json)：Skill 数值／时长相关基本方法、类型与枚举。
- [parameter-operations.json](parameter-operations.json)：Rune／遗物逐来源预处理、SP 配置与查询、Duration／Blackboard 操作。
- [content.json](content.json)：实际技能、Buff、Fever 与模式配置的精选字段和资源引用。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/skill-modifier-20261029 --out .cache/native-research/skill-modifier-20261029
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

原 native helper 指纹、Python 3.14.8 和 Capstone 5.0.6 已记录，但完整 helper／资源专用解码器及命令未归档；新工具不会冒充历史工具。

## 限制与关联结论

原生方法说明参数如何被修改，不直接证明项目必须采用某种 Modifier API。资源投影及第三方镜像不等于运行轨迹；未确认活跃 XLua，未独立将镜像完整绑定到客户端修订。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/09-skill-mechanisms-and-requirements.md)。本 README 只登记证据用途与复查方式。
