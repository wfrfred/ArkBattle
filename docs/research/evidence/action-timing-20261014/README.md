# Action 周期、动画与执行占用取证

## 调查问题与范围

取证日期：2026-10-14。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

核对冷却推进、技能／攻击时间预算、释放事件、帧内调用顺序及 Spine 动画映射，区分原生计时政策和动画事件标称时间。范围为普通原生分支与已选择的默认模型资源，不覆盖所有皮肤或特殊 Ability。

## 来源与指纹

[records.json](records.json) 的 `source` 保存 DLL／metadata 指纹、方法表和布局；`resourcesVersion` 记录 V078 资源身份。`prtsSources` 保留 Wiki 页，`exusiaiMainModeBlackboard` 中的第三方表版本与本机资源并未证明完全一致。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [records.json](records.json) | `nativeMethods`、`manuallyResolvedBranches`、`frameOrderFindings`：原生调用与分支；`prefabComponents`、`monoScriptMapping`、`spineMappingsAndEvents`：实际资源关联与动画事件；`method`、`limits`：旧提取方式及边界。 |
| [archive.json](archive.json) | 统一归档元数据、文件清单与重提取覆盖。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/action-timing-20261014 --out .cache/native-research/action-timing-20261014
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

没有游戏逐帧观测或 XLua 运行核对。Spine runtime-3.8 的旧专用解析、手工间接分支解析和完整原始命令未随本批次完整保留，共享入口不会将动画标称时间自动升级为实测释放 Tick。

## 关联案例

- [Action 时间与动画](../../cases/07-action-timing-and-animation.md)。
- [Action 与 Projectile 阶段](../../cases/02-action-and-projectile-phases.md)。
