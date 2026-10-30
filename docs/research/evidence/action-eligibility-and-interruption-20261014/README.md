# Action 启动资格、互斥与中断取证

## 调查问题与范围

取证日期：2026-10-14。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

区分 Ability 自身的可发动与施法标记、普通主行动串行、嵌套触发、中断和结束结算；核对泥岩 S2 等具体内容是否足以证明并行主行动。范围为当时安装客户端的普通原生分支及保留的实际技能组件。

## 来源与指纹

[records.json](records.json) 的 `source` 保存 DLL／metadata 指纹、metadata v29 和 vtable 定位，`sourceVerification` 保存本轮重新核对及技能资源包指纹。`prtsSources` 保存 Wiki 页面及对应问题，未记录独立于本次取证日期的逐页查阅时间。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [records.json](records.json) | `nativeMethods`、`fieldsAndVtables`：方法、指令与布局；`mudrockSkillComponents`：泥岩技能组件；`findings`、`limits`：当时归纳与边界。 |
| [archive.json](archive.json) | 统一来源、文件清单及当前共享工具可以重新提取的范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/action-eligibility-and-interruption-20261014 --out .cache/native-research/action-eligibility-and-interruption-20261014
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

没有运行 XLua 替换或实战录制；普通行动串行只覆盖已检查路径，嵌套子 Ability 不等于第二个长期主行动。不能把当时项目基线或现有测试当作原生证据。

## 关联案例

- [Action 资格与中断](../../cases/08-action-eligibility-and-interruption.md)。
- [Action 时间与动画](../../cases/07-action-timing-and-animation.md)。
