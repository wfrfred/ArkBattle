# HP 写入、免死与组合干预取证

## 调查问题与范围

取证日期：2026-10-17。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

核对 BeforeTry／PostTry、免死与锁血消费、消费者身份和 HP 写入顺序，并区分直接静态分支与治疗／伤害组合的时序推断。范围为普通 HP 路径及匹配 BuffTemplateHolder。

## 来源与指纹

[records.json](records.json) 的 `inputs` 保存 DLL、metadata 和匹配 holder 投影的指纹；`methods` 保留地址、参数和指令，`templates`、`sharedFlagConstants` 保留模板及共享标记。PRTS 旧示例与当前模板不一致的处理记录在 `limits`。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [records.json](records.json) | 原生 HP setter、消费节点与消费者检查，史尔特尔／斯卡蒂／真等匹配模板和组合推断。 |
| [archive.json](archive.json) | 统一来源、文件清单及当前可重提取覆盖。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/hp-application-combinations-20261017 --out .cache/native-research/hp-application-combinations-20261017
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

未运行游戏或 XLua；普通 HP 结论不推广到负 HP、ES 或自定义 HP override。组合时序样例不是该组合的实战测量。旧 holder JSON 的专用解码脚本、原工具版本和完整命令未记录，共享资源入口不自动恢复该历史投影。

## 关联案例

- [Damage Apply 与 HP Application](../../cases/11-damage-apply-and-hp-application.md)。
