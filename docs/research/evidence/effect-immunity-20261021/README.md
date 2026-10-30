# Effect 选择、目的与异常免疫取证

## 调查问题与范围

取证日期：2026-10-21。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

核对非伤害效果如何选择接收者、免疫过滤发生于选取还是安装／生效，以及 Action Purpose、Buff 标记和异常 Anti／Immune 的作用边界。范围包括爱丽丝、卡夫卡、睡眠和鼓舞等实际资源及普通原生消费链。

## 来源与指纹

[manifest.json](manifest.json) 保存项目对照、DLL／metadata 指纹、Buff 模板来源及制品校验值。[immunity/manifest.json](immunity/manifest.json) 等子记录保留本组来源；实际技能／Prefab 和 MonoScript 映射见各组 JSON 与报告，不由方法名推定内容已使用。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [root/REPORT.md](root/REPORT.md) | Purpose getter、TargetValidator 和特定 Buff 过滤相关入口；同组保存布局及精选指令。 |
| [selection/REPORT.md](selection/REPORT.md) | 免疫过滤与有限目标选择顺序，泛型过滤和枚举依据。 |
| [immunity/REPORT.md](immunity/REPORT.md) | Buff 安装、异常 Anti／Immune、启用及异常变化的原生链。 |
| [content/REPORT.md](content/REPORT.md) | 实际 Aura、睡眠技能、鼓舞排除标记和接收者配置投影；同组 JSON 保留 PathID 与模板。 |
| [archive.json](archive.json) | 统一来源、制品及共享工具可重提取范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/effect-immunity-20261021 --out .cache/native-research/effect-immunity-20261021
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

没有实机注入或活跃 XLua 审计；序列化的 purposeMask 值不自动证明所有运行时 getter 的返回值。配置能证明具体选择需求，但不能据此决定新的项目 Purpose 联合类型。原专用资源解码及完整原始执行命令未随批次完整保存。

## 关联案例

- [Effect 索敌与异常免疫](../../cases/19-effect-selection-and-immunity.md)。
