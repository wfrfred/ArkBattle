# Blocking 资格、竞争、保持与几何取证

## 调查问题与范围

取证日期：2026-10-23。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

分别核对模式／地块／阵营资格、新关系候选与容量预算、旧关系保持和容量裁撤、接敌位置与插值。范围为当时安装客户端重新展开的普通原生方法、接口和泛型路径。

## 来源与指纹

[manifest.json](manifest.json) 记录当时项目基线、范围和制品校验值；DLL／metadata 的路径、大小及 SHA-256 见 [retention/provenance.json](retention/provenance.json)。子报告保留各自方法、布局和分支依据，不将安装版本称为线上最新。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [report.txt](report.txt) | 当时调查的总报告，含原生事实、项目差异及未闭合问题；当前结论以关联案例为入口。 |
| [modes/report.txt](modes/report.txt) | 模式、地块、阵营和半径；同目录保存字段、正确解码的枚举和原生指令。 |
| [competition/report.txt](competition/report.txt) | 对象更新顺序、候选权重、容量预选与建立时复核；相关泛型方法保留在同组。 |
| [retention/report.txt](retention/report.txt) | 关系保持、容量裁撤、解除／重接敌、生命周期和通知顺序。 |
| [geometry/report.txt](geometry/report.txt) | 接敌偏移、稳定阻挡位置及位置插值。 |
| [legacy/](legacy/) | 原提取源码的历史存档；依赖已失效临时路径，不作为当前执行入口。 |
| [archive.json](archive.json) | 统一来源、文件清单及共享入口可重提取范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/blocking-native-20261023 --out .cache/native-research/blocking-native-20261023
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

未运行游戏或活跃 XLua。原始报告中“完整方法”是当时提取口径，跳表被反汇编成指令的尾部不能当作可达代码；当前重提取需按区间外分支继续展开。泛型展开、原枚举解码等专用历史处理并非共享入口全部自动覆盖，见归档列明的范围。

## 关联案例

- [阻挡空地资格与清理](../../cases/21-tippi-air-blocking.md)。
- [阵营与定向阻挡资格](../../cases/20-norport-civilian-allegiance-and-blocking.md)。
