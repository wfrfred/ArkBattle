# 通用 Scheduler 字段与调用路径证据

调查日期：2026-11-07。机制结论集中维护于[案例 30](../../cases/30-scheduler-action-data-fields.md)。本批按字段消费链、不同入口与非默认配置取证，不修改 Core、Data 或 Skill，不从单一玩法的默认值决定通用类型。

## 来源

- 本机 Windows x64、IL2CPP metadata v29，静态普通分支；未执行游戏或确认实际 XLua 绑定。
- GameAssembly.dll：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 配置镜像：`Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。82 个目的性样本逐文件核验 Git blob；79 份非生息样本与 3 份排除模式字段对照分别统计。取样不构成全仓覆盖或玩法支持承诺。

## 材料导航

| 材料 | 选择范围 |
| --- | --- |
| [native-paths.json](native-paths.json) | Reset／UpdateWaves、主队列、计划总数、普通及外部 Route／RuntimeRoute／Npc／tracked 出生、Verify／MarkEnemyKilled、非 SPAWN 和相关预处理 |
| [execution/native.json](execution/native.json) | 主线执行队列、完成回调、前后延迟和非 SPAWN 执行器 |
| [execution/supporting-types.json](execution/supporting-types.json)、[wave-tags.json](execution/wave-tags.json) | Wave／Fragment／Branch／Phase 字段布局与实际 Wave 标签摘录 |
| [lifecycle](lifecycle/README.md) | 出生登记、销毁／回收、最终判断、外部重载、Branch 路线模板提取与 alive 虚分派定位 |
| [preprocess](preprocess/README.md) | 构造／预处理顺序、位置与共享预算、invalid 删除、EnemyInfo 载荷实际生产与消费 |
| [config](config/README.md) | 固定版本来源、完整动作节点、敌人覆盖节点、按来源分组统计和可复跑提取 |
| [archive.json](archive.json) | 本批原件、哈希与复查选择器，包含各子目录 |

构造器与旧字段布局复用[初次字段批次](../scheduler-action-fields-20261107/README.md)；Action 展开、普通 SPAWN 和 Phase 随机原件复用[队列与出生批次](../scheduler-native-20261107/README.md)。这些是来源导航，最终结论以案例当前矩阵为准。

原生方法 JSON 保存 fullname、token、当前索引、VA 和全部所选片段；专用类型解码还保留原值、地址与算法。共享原生地址不直接指认唯一方法身份。文本指令摘录用于阅读，完整字节和客户端／工具指纹以原生 JSON 为准。

## 复跑和验证

从仓库根目录运行，按原生选择器重提到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/scheduler-general-20261107 --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/scheduler-general-replay
```

需要到下一个已知入口之间的完整连续 pdata 时，复用 `../elemental-timing-20261102/extract_schedule.py`，显式传入记录中的 `result.bodies[].selector.fullname`，不使用它的默认 EP 方法列表；类型解码及配置重取命令见各子目录。

完整源配置缓存存在时，复算配置指纹、节点与统计：

```sh
python3 docs/research/evidence/scheduler-general-20261107/config/profile.py
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/scheduler-general-20261107
```

本轮验证包括原文 Git blob 与 JSON Pointer 校验、统计分组、JSON／专用脚本语法及本地引用检查。没有以 Core 测试证明原生结论，没有运行全量项目测试。

## 证据限制

普通方法体与具体内容可达性分别记录；配置正例不是运行时观测。forceBlockWaveInBranch=true、ActionData.notCountInTotal=true 的非默认来源，以及 randomType／refreshType 的具体周期策略消费者仍有缺口。未找到不能改写为不存在；取到排除模式的字段对照也不自动形成 Core 要求。完整限制见案例第 9 节。
