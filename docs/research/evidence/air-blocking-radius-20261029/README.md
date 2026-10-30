# 空中阻挡半径与非巡空者内容取证

## 调查问题与范围

取证日期：2026-10-29。2026-10-31 按统一归档规范整理；整理本身不代表重新取证。

区分普通 Character／Enemy 的阻挡默认常量、当前属性倍率与 Trap／GiantTrap 覆盖；补查非巡空者内容中的空中阻挡。原生方法复用此前 Blocking 证据，本批次保存增量常量、字段及实际内容描述投影。

## 来源与指纹

[selected-witnesses.json](selected-witnesses.json) 的 `sources` 保存 DLL／metadata 指纹，`reusedEvidence` 定位复用指令及校验值。[content-witnesses.json](content-witnesses.json) 的 `sources` 单独记录第三方客户端表镜像路径与指纹，并在每条内容中给出 JSON Pointer 和交叉资料；镜像未证明与安装客户端同版。

## 文件用途

| 文件或分组 | 用途 |
| --- | --- |
| [selected-witnesses.json](selected-witnesses.json) | float32 常量的 VA、原始字节和数值，字段布局、枚举编码及复用指令定位。 |
| [content-witnesses.json](content-witnesses.json) | UR-4 可浮空区块、风絮等配置／描述投影及 Wiki 交叉来源。 |
| [archive.json](archive.json) | 统一来源和当前可重提取的原生／资源范围。 |

## 复现入口

从仓库根目录执行；先按 [archive.json](archive.json) 的输入记录准备匹配客户端：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/air-blocking-radius-20261029 --out .cache/native-research/air-blocking-radius-20261029
```

当前入口按 `archive.json.result.replay` 列明的范围生成新输出，写入 `--out`，不覆盖历史材料。它不代表已恢复当时的完整工具环境、专用解码或运行现场；原始记录没有保留的工具提交、版本或命令不作补造。

## 未决项与限制

不是全游戏空中阻挡清点，没有运行客户端或审计活跃 XLua；字段存在不证明某个具体 Buff 使用非默认倍率。第三方镜像的内容投影不能由当前本机 bundle 索引直接重建，原专用提取脚本和逐页查阅时间未完整记录。

## 关联案例

- [蒂比、空中阻挡及半径边界](../../cases/21-tippi-air-blocking.md)。
