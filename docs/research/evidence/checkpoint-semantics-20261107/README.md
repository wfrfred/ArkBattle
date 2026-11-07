# Checkpoint 参数与首次执行时序

日期：2026-11-07。只补核 MOVE 的目标采样／到达半径，以及初始化首路点的即时副作用与身份、位置、出生程序、单位登记之间的顺序；其余路点语义复用既有调查。结论集中在[案例 13 第 9 节](../../cases/13-route-and-movement-timing.md#9-checkpoint-参数与首路点时序2026-11-07-补核)。本批不修改 Core、Data 解析器或架构类型。

## 来源

本机 Windows x64、metadata v29、imageBase `0x180000000`。各新原件的 provenance 记录实际工具、来源与边界：

- GameAssembly.dll：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

与 [Route 创建批次](../route-creation-20261107/README.md)指纹一致，因此直接引用其 Enemy.Init、Enemy.Spawn、Cursor 构造／Reset／首路点进入证据，不复制原件。固定镜像配置的修订、原文字节与选择范围由 [move](move/README.md) 单独记录，不假定镜像与安装客户端属于同一版本。

社区参照：[PRTS 作战机制](https://prts.wiki/w/作战机制)的行动指令／传送说明，查阅于 2026-11-07。其描述不能证明初始化内部顺序；本批没有用社区文字替代方法消费或配置引用证据。

| 文件 | 用途 |
| --- | --- |
| [move](move/README.md) | 配置扫描、固定偏移正例及出生引用；当前 MOVE 公式、常量与 Fear 生成路点 |
| [presence](presence/README.md) | DISAPPEAR／APPEAR 的 OnBegin、位置计算、前后回调、状态切换及 BornState 入口 |
| [allocation](allocation/README.md) | Factory 返回前的 OnAllocate 调用，连接 UID／BObject 身份登记 |
| `entry-bodies.json` | Factory.CreateEnemy、RegisterBObject、RegisterUnit、OnUnitBorn 与 Enemy.Born／OnBorn |
| `initialization-bodies.json` | BObject 的分配／初始化／Born，Entity 初始化及 Entity／Unit 的出生回调 |
| `state-start-bodies.json`、`init-state-body.json` | Start 的强制切换与 Enemy 初始状态选择；Enemy.OnInit |
| `state-switch-internal.json` | 普通状态切换的当前状态资格，区别标志写入与成功进入状态 |
| `state-constructor-body.json` | StateMachine 构造与 Stop；初始／停止状态的适用边界 |

## 复跑

从仓库根目录执行，结果写入独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/checkpoint-semantics-20261107 \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/checkpoint-semantics-replay
```

需要完整连续 `.pdata` 片段时，使用现有提取器并显式列出原件的 `result.bodies[].selector.fullname`；例如：

```sh
uv run --locked --offline docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/checkpoint-semantics-replay/entry.json \
  --method Torappu.Battle.BObject.OnAllocate \
  --method Torappu.Battle.BObject.Init \
  --method Torappu.Battle.Entity.OnBorn \
  --method Torappu.Battle.Unit.OnBorn

python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/checkpoint-semantics-20261107
```

泛型分配 helper 的未具名地址及续段、配置的重取和扫描命令见子目录；尾随 MethodInfo、泛型类型转换和热更分支不按位置猜成玩法参数。校验包括 JSON、材料哈希和本地链接；没有以 Core 测试证明原生行为，没有运行游戏或验证实际 XLua 替换。首次消失／出现的内容正例、非默认配置覆盖和后续状态变化的证据限制见案例。
