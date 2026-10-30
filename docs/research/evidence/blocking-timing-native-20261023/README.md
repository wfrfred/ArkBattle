# Blocking 搜索与运动时序取证

## 调查问题与范围

取证日期：2026-10-23。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

核对逻辑 Tick 内对象更新、自主运动与普通搜索的先后，PeriodicTicker 的推进，以及显式立即搜索和额外调用。范围为 BattleController／ObjectManager／Character／Enemy 的已展开普通原生调用链。

## 来源与指纹

[manifest.json](manifest.json) 保存制品清单和校验值；DLL／metadata 及旧提取器定位见 [order/provenance.json](order/provenance.json)。该来源记载的是普通静态分支，不是 Unity 渲染帧追踪。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [report.txt](report.txt) | 本轮总报告：对象内部和跨对象的搜索时点、普通搜索周期与显式搜索边界。 |
| [driver/report.txt](driver/report.txt) | 战斗驱动、对象更新及 late 阶段调用。 |
| [order/report.txt](order/report.txt) | 对象内推进顺序及相关方法、类与字段。 |
| [frequency/report.txt](frequency/report.txt) | PeriodicTicker、普通搜索频率和强制搜索调用；同组保留扫描候选。 |
| [immediate/report.txt](immediate/report.txt) | 显式立即搜索、弹道停止等调用链和 Coroutine 相关证据。 |
| [legacy/](legacy/) | 原扫描／提取源码的历史存档，不再按其中临时路径运行。 |
| [archive.json](archive.json) | 统一来源及可通过共享工具重提取的范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/blocking-timing-native-20261023 --out .cache/native-research/blocking-timing-native-20261023
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

逻辑 Tick 不等同于渲染帧；没有实战轨迹、完整物理宽相同步或所有模式／XLua 覆盖的证明。直接 call 扫描只产生候选，报告中展开确认的调用才支撑结论；不把普通路径结论推广为每个特殊单位的统一调度。

## 关联案例

- [路线与移动时序](../../cases/13-route-and-movement-timing.md)。
- [阻挡层切换及项目接入范围](../../cases/21-tippi-air-blocking.md)。
