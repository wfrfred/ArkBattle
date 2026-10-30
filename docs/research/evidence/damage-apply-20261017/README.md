# Damage Apply 与接收顺序取证

## 调查问题与范围

取证日期：2026-10-17。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

核对受击回复、Buff 接收、取消／闪避、反伤／分担和 HP 写入的相对顺序，区分零输入、取消与零实际损失。范围为精选普通原生路径及匹配模板，不决定项目 Apply API。

## 来源与指纹

[records.json](records.json) 的 `files` 保存 DLL／metadata 指纹，`templateSource` 保存模板来源、旧导出路径及指纹；`sources` 保存 PRTS 页。旧模板 JSON 的来源是本机 `config/buff_template_holder.ab`，不能把中间 JSON 的历史位置视为持久可用入口。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [records.json](records.json) | `methods`：精选原生指令；`templates`：匹配模板；`findings`、`limits`：原始归纳、PRTS 差异和审查范围。 |
| [archive.json](archive.json) | 统一归档元数据及原生／资源可重提取范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/damage-apply-20261017 --out .cache/native-research/damage-apply-20261017
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

没有运行客户端或 XLua。重生、负 HP、击杀归属和回收未穷尽；不能把忽略闪避与不可被闪避取消的描述推广成统一 RNG 或额度行为。旧模板投影的专用解码脚本和完整命令未保存，资源索引重提取不等于自动恢复该投影。

## 关联案例

- [Damage Apply 与 HP Application](../../cases/11-damage-apply-and-hp-application.md)。
- [接收派发与嵌套结算](../../cases/03-dispatch-and-nested-settlement.md)。
