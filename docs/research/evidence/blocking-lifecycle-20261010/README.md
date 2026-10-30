# Blocking 生命周期与眩晕清理取证

## 调查问题与范围

取证日期：2026-10-10。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

核对普通原生推进中阻挡旧关系的维护、眩晕时解除／拒绝搜索，以及当时项目实现中的关系残留。客户端方法和项目眩晕复现实验是两种来源，不相互替代。

## 来源与指纹

[records.json](records.json) 的 `client` 保存 DLL／metadata 大小和指纹，`manifest` 保存 V078 资源标识；`methods` 与 `virtual_dispatch` 记录当前方法和虚派发定位。`project_stun_reproduction` 是项目提交 `9ef0fb3c` 下的历史复现，不是官方客户端运行观测。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [records.json](records.json) | 原生方法指令、虚派发定位，以及单独标识的项目眩晕操作序列和结果。 |
| [archive.json](archive.json) | 统一归档来源、制品和共享入口可重提取的范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/blocking-lifecycle-20261010 --out .cache/native-research/blocking-lifecycle-20261010
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

没有验证运行时 XLua 或完整玩法。项目旧状态模型及眩晕复现仅描述指定历史提交，不保证当前接口仍能执行同一操作序列。原生原始提取命令、工具版本和完整专用脚本未记录；共享入口只重提取列明的客户端材料。

## 关联案例

- [资格与中断边界](../../cases/08-action-eligibility-and-interruption.md)。
- [Blocking 层切换与清理](../../cases/21-tippi-air-blocking.md)。
