# Skill 机制与调用点复核：证据归档

## 调查问题与范围

取证日期：2026-10-15。复查技能类型、SP／Ammo／Sustain 相关字段和保留指令中的直接调用点，界定这轮复查实际补证的范围。

## 来源与文件用途

[records.json](records.json) 保存本轮 DLL／metadata SHA-256、类型信息及 directCallChecks；scope 明确写明不是重新完整反汇编全部方法。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [records.json](records.json)：重新核对的输入指纹、类型／字段，以及已有反汇编的 opcode／位移复核。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/skill-mechanisms-20261015 --out .cache/native-research/skill-mechanisms-20261015
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

原复查脚本未保存；保留的字节与方法身份可按记录重新检查。

## 限制与关联结论

本批次是文件身份与选定调用点复查，不能标成完整的新方法转储或运行时验证。新复现入口生成的完整 native 输出也不会改变这份历史记录的证据强度。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/09-skill-mechanisms-and-requirements.md)。本 README 只登记证据用途与复查方式。
