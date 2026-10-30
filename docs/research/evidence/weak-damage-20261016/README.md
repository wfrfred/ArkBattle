# Weak Damage 与 Critical：证据归档

## 调查问题与范围

取证日期：2026-10-16。核对弱化伤害倍率、暴击相关数据的原生消费及精选天赋／Buff 配置，区分字段、通用程序与具体角色绑定。

## 来源与文件用途

[records.json](records.json) 的 client 保存 DLL／metadata、资源清单版本和 Bundle 指纹，fields／templates／characterDescriptors／methods 分别保留元数据、资源投影与指令。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [records.json](records.json)：输入指纹、弱化／暴击相关字段、模板、角色组件与方法摘录。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/weak-damage-20261016 --out .cache/native-research/weak-damage-20261016
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

原提取工具版本、完整命令及专用资源解码脚本未在本批次统一保存。

## 限制与关联结论

Critical 并不是单一统一动作。Mountain 样本的外部 MonoScript PPtr 没有完整解析，不能仅凭 prob 字段把它断言为某个通用类；未执行客户端或审计现场 XLua。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/10-weak-damage-and-critical.md)。本 README 只登记证据用途与复查方式。
