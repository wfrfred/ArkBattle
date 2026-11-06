# ActionData 字段消费补核

调查日期：2026-11-07。机制结论及未决项集中维护在[案例 30](../../cases/30-scheduler-action-data-fields.md)。不修改 Data／Core；本批配置样本和重点调用链取自卫戍，不将此取证范围当作 Core 的通用战斗语义边界。生息演算、保全派驻等特殊模式的刷新生命周期不在本批目标内。

## 来源

本机 Windows x64、IL2CPP metadata v29。静态普通分支，未执行游戏或确认全部 XLua 绑定。

- GameAssembly.dll：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 配置镜像：`Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。`sources.json` 列出实际 39 份源文件路径、固定链接和完整解析后 JSON 的规范化 SHA-256；不是 Git 原始 Blob 字节哈希。包含全部 6 份 act2autochess 文件及 33 份 act1autochess 非地图／非训练／非 enemy_data 模板，不等于全部实际可达关卡。

## 文件

| 文件 | 内容 |
| --- | --- |
| action-types.json | 本次字段、ActionID 与相关枚举布局，从已取得的 native 类型记录按完整类型名筛选；不补造序列化属性 |
| enemy-options.json | 出生选项字段布局，含 boxed／unboxed 偏移 |
| autochess-mode-type.json | AutoChessGameMode 的字段及本类方法清单 |
| action-fields-bodies.json | 构造／复制、通用／随机预处理、动作位置标识、出生执行器和卫戍替换 |
| field-extra-bodies.json | 动态 Phase、预置入口及外部结果处理的补充方法 |
| autochess-fields-bodies.json | 模板生成及 AutoChessGameMode 入口 |
| action-configs.json | 通过共享 config.py 选择的 473 条完整 Action，附来源文件、JSON Pointer 及输入指纹 |
| profile.py、profile.json | 对上述摘录逐字段统计，区分缺失与 null，并保留取值样本路径；不引入项目架构策略 |
| sources.json | 固定源版本、有限扫描范围与源配置规范化指纹 |

读取字段用途时还需联查[上一批](../scheduler-native-20261107/README.md)的 `_DealAction`、`_DoSpawn.MoveNext`、`_NotCountInTotal`、Phase 选择和隐藏组实现。

## 复跑

从仓库根目录运行。源 JSON 重新取自 sources.json 的固定链接后，放在同一输入目录，再用共享查询工具摘录：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/config.py /path/to/pinned-levels --out .cache/native-research/action-fields-replay/actions.json --revision bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d select '/**/actions/*'
```

只重算已归档的字段统计，不需要下载或启动客户端：

```sh
python3 docs/research/evidence/scheduler-action-fields-20261107/profile.py docs/research/evidence/scheduler-action-fields-20261107/action-configs.json docs/research/evidence/scheduler-action-fields-20261107/action-types.json --out .cache/native-research/action-profile-replay.json
```

原生方法全名／token／当前索引和 VA 保存在各记录中，使用共享 replay.py 按选择器重提；需要连续 pdata 完整边界时，复用 `../elemental-timing-20261102/extract_schedule.py`，显式传入各记录 selector.fullname，不采用它的默认方法列表。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/scheduler-action-fields-20261107 --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/action-fields-native-replay
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/scheduler-action-fields-20261107
```

方法摘录采用到下一个已知原生入口之间的连续 pdata 片段，可能含填充／跳表；不将字节线性解码冒充运行时调用轨迹。Archive 只记录本批材料，不证明所有字段用途已经闭合；未决问题见案例。
