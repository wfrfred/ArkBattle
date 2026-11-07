# Route 创建与初始化补核

日期：2026-11-07。补核已有路线、运行时生成路线及不同 Enemy 出生入口如何确定位置、偏移和时间快照。结论集中在[案例 14 第 6 节](../../cases/14-route-definition-fields.md#6-路线创建与初始化2026-11-07-补核)，不在本批确定 Core 类型或初始化 API。

## 来源与范围

本机 Windows x64 客户端，metadata v29，imageBase `0x180000000`：

- `GameAssembly.dll`：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat`：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

指纹与当日 Scheduler 取证一致，故复用其外部出生入口，不沿用十月客户端的索引。完整来源、工具身份和注册表见 [initialization/probe.json](initialization/probe.json)；正文保存实际 selector、token、index、VA 和全部所选 `.pdata` 片段。

| 文件 | 选择范围 |
| --- | --- |
| `initialization/core-init-bodies.json` | Enemy.Init、DirectionCursor 构造；位置、偏移及 snapshot 传递 |
| `initialization/create-enemy-bodies.json` | Controller.CreateEnemy 两重载的准确签名与初始化转交 |
| `initialization/enemy-spawn-body.json` | Spawn 保存 Options 后转交 Init；与 Enemy 类型的虚方法 slot 对照 |
| `initialization/enemy-type.json`、`enemy-options-type.json` | Enemy 初始化虚方法及 Options 的实际字段 |
| `initialization/basic-cursor-bodies.json` | BasicCursor 构造、_CreateCheckpoint、_MoveNext |
| `initialization/cursor-reset-bodies.json` | BasicCursor／DirectionCursor.Reset，构造时首次进入 Checkpoint 的短链 |
| `initialization/basic-cursor-type.json`、`cursor-methods.json` | 字段偏移、方法签名与虚方法 slot |
| `origins/` | Map／Scheduler 的运行时路线生成及三个代表调用节点、配置类型布局 |
| `timing/` | TakeSnapshot、Snapshot 字段、临时 Cursor 的时钟输入 |

复用原件：

- [Scheduler 普通出生及内部出生](../scheduler-native-20261107/spawn-bodies.json)。
- [Route／RuntimeRoute／Npc 外部入口](../scheduler-general-20261107/native-paths.json)及其 [lifecycle 可读摘录](../scheduler-general-20261107/lifecycle/README.md)。
- [延迟 tracked RuntimeRoute 状态机](../scheduler-general-20261107/lifecycle/tracked-runtime-bodies.json)。
- [既有出生偏移、locator 与导航目标转换](../route-fields-20261019/README.md)。

## 复跑

仓库根目录执行，输出写入独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/route-creation-20261107 \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-creation-replay
```

要重提到下一已知入口前的全部连续片段，复用已有提取器，显式指定 JSON 中的 `result.bodies[].selector.fullname`；同名方法包含全部重载：

```sh
uv run --locked --offline docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-creation-replay/init.json \
  --method Torappu.Battle.Enemy.Init \
  --method Torappu.Battle.DirectionCursor..ctor \
  --method Torappu.Battle.BasicCursor..ctor

python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/route-creation-20261107
```

`*.txt` 仅为 JSON 指令的可读展平，不是反编译得到的 C#。本批验证 JSON、清单和本地引用，没有运行游戏或 Core 测试。普通静态分支不代表运行时 XLua 覆盖；未穷举所有召唤 Content，也不在本批证明替代路线的完整接管／恢复语义。
