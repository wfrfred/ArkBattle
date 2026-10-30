# 初期客户端机制与内容精选摘录

## 调查问题与范围

取证日期：2026-10-07。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

保留最初对属性、伤害、Buff、Projectile、Aura／GlobalBuff 和实际内容动作顺序的取证投影，作为后续问题调查的来源锚点。该批次使用较早客户端，不能与后续方法索引混用。

## 来源与指纹

[records.json](records.json) 的 `clientRoot`、`clientFiles` 保存旧 DLL／metadata／资源清单路径、大小和 SHA-256，`manifest` 标识 V077 资源。此处 DLL／metadata 指纹不同于后续 2026-10-13 及之后的常用批次；复现必须提供匹配输入。原始表镜像、本机资源、项目 data 的来源仍分别记录。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [records.json](records.json) | `nativeMethods`、`selectedNativeCalls`：精选方法定位和调用；`prefabBuffDescriptors`、`buffTemplateExcerpts`、`prefabSources`：内容引用与模板；`auraAndGlobalFieldProjections`、`globalContentDataExcerpts`：后续问题所需字段投影。 |
| [archive.json](archive.json) | 统一历史来源、文件清单和当前可重提取的覆盖；不以当前客户端替代旧指纹。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/client-excerpts-20261007 --out .cache/native-research/client-excerpts-20261007
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

这是选择性字段投影，未列字段不代表不存在；未执行游戏、Lua 或 hotfix。完整原始提取脚本、命令和工具版本未保存。新客户端即使有同名方法也不能按旧 index 重现此记录；缺少旧输入时保留为历史摘录，不声称完成复跑。

## 关联案例

- [Buff 安装与父作用域](../../cases/01-buff-installation-and-parent-scope.md)。
- [Action 与 Projectile 阶段](../../cases/02-action-and-projectile-phases.md)。
- [派发与嵌套结算](../../cases/03-dispatch-and-nested-settlement.md)。
