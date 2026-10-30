# Skill 启动与结束协议：证据归档

## 调查问题与范围

取证日期：2026-10-13。追踪技能开启、同步内容接续、结束与清理回调的顺序，区分 Ability 的准备、释放及下一轮清理。

## 来源与文件用途

[records.json](records.json) 的 client 保存 DLL／metadata 指纹、当前方法表和 image 信息，methods 保留方法身份与指令摘录。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [records.json](records.json)：批次范围、客户端身份、方法 token／slot／VA 和关键指令。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/skill-lifecycle-20261013 --out .cache/native-research/skill-lifecycle-20261013
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

保留了指令摘录与定位信息，但未保存完整原工具链、命令及脚本源码。

## 限制与关联结论

只检查普通 native 分支；没有验证 XLua 现场覆盖。方法之间存在共享地址，原始别名不能单独作为业务调用证据。原完整转储及专用脚本未归档，不将旧临时文件名作为现行入口。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/05-skill-start-and-finish.md)。本 README 只登记证据用途与复查方式。
