# 库存恢复预算、负 DP 与新版客户端复核

取证日期：2026-11-01；工作树基线 `1724630`；uv 0.12.24、Capstone 5.0.7。结论集中于[案例 24](../../cases/24-deployment-cost-and-supply.md)。本批补查队列多份恢复的预算采样、负 DP 自然回复及客户端更新对既有费用短链的影响，不决定 Deployment 的项目接口。

## 输入与版本边界

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `Arknights_Data/il2cpp_data/Metadata/global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

metadata v29；51811 个类型、326501 个方法。现有共享解析器可用，但与前批客户端指纹不同，方法、字段和地址全部重新定位；未把旧索引套入新版。旧证据保留原版本含义，本批只复核下列短链。

只分析无对应 hotfix delegate 时的普通静态 native 分支；未运行完整游戏或读取 live XLua。完整方法按当前方法入口至下一已知方法入口逐个展开 `.pdata`，分段单独保留；这不穷尽间接调用及运行时特化。

## 库存恢复预算

`supply/supply-fields.json` 保存 Card 的单个 `m_respawnTimer`（`0x30`）、待恢复计数 `m_queuedRespawnCnt`（`0x170`）、当前计算的后续周期 `m_newRespawnTimePeriod`（`0x1d0`）与计时器本轮周期／剩余时间。枚举以 metadata 压缩有符号整数解码：`CardPolicy.QUEUED=2`、`State.RESPAWNING=3`、`State.QUEUING=4`、`RechargeTiming.ON_FINISH=1`。

`supply/supply-methods.json` 保存：

| 方法 | Index / VA | 对本问题的证据 |
| --- | --- | --- |
| `Deck/Card.OnTick` | 66909 / `0x1806ed530` | 到期后递减 queued；仍大于 0 时，在 `0x1806ed7b5` 读取届时 Card 的后续周期，调用 `PeriodicTimer.Reset(newPeriod, true)`。没有为每份库存读取各自的入队预算。 |
| `Deck/Card._UpdateCardBuff` | 66869 / `0x1806f0c30` | 从属性及 CardBuff 求值后，在 `0x1806f1283` 写后续周期；另外存在显式修改当前剩余时间的 `SetRemainingTime` 分支。不可把两者混为一个采样协议。 |
| `Deck/Card.OnRecycle` | 66867 / `0x1806ecc70` | UNIQUE 与 QUEUED 的相应状态切换均读取 Card 后续周期并 Reset，不携带逐实例时长参数。 |
| `Deck/Card.Recharge` | 66862 / `0x1806edd80` | QUEUED 且 timing=ON_FINISH 的分支增加待恢复份数；`OnRecycle` 自身不增加该计数。 |
| `Deck/Card.Draw` | 66861 / `0x1806eb980` | 某些队列状态切换只修改 state，没有 Reset；不能从 state 改变推定计时必然重启。 |
| `PeriodicTimer.Reset(period, waitFirstPeriod)` | 26424 / `0x181e4afc0` | `waitFirstPeriod=true` 将本轮 period 和 remaining 都写为新预算，是真正重启，不是保留进度。 |

后续周期变化不会仅因 `m_newRespawnTimePeriod` 的写入自动改写计时器中已保存的本轮周期；显式剩余时间操作、Reset 则有独立路径。

下一段启动处直接读取已写入字段，没有立即重新求值全部修正。同次 `OnTick` 先处理计时器，随后 `0x1806ed7f9` 起才推进限时 CardBuff，`0x1806ed897` 才可能调用 `_UpdateCardBuff`；同 Tick 恰好到期的修正须保留这个顺序边界，不能将“读当前字段”夸大为所有更新都已发生。

有一项不能略去的原生分支：QUEUED 的 `OnRecycle` 中，`state != QUEUING && queued < m_remainingCnt` 时 Reset 并进入 QUEUING；否则在 `state != RESPAWNING && queued >= m_remainingCnt` 时 Reset 并进入 RESPAWNING。因此 QUEUING→RESPAWNING 也会重启。`TokenCard.OnRecycle` 的普通路径确实调用该基类方法，但本批没有闭合所有虚调用、Recharge 的实际实参及退出链，**不能将这个条件直接投影为某个具体“第几份归队”场景，也不能反向宣称追加归队绝不重置当前进度**。

静态证据足以区分“每份入队保存预算”与“后续周期启动时读取当前 Card 周期”；具体内容是否走热更新、直接改剩余时间或额外 Reset，须按内容另查。

## 负 DP 自然回复

`negative-dp/negative-dp.json` 保存六个相关方法及字段，`related.json` 保存辅助 FP 调用与 Timer 虚槽身份：

- `BattleCostManager.UpdateCost` 65895 / `0x180684d20`：每次读取当前 DP；`0x180684e28–e2a` 判断符号，负值分支读取 `this+0x40` 的倍率，并在 `0x180684e5e` 乘到本次 `fixedDeltaTime`，之后推进同一个 PrecisePeriodicTimer。
- `BattleCostManager..ctor` 65869 / `0x180685230`：`0x1806853d7` 写 `0x3f000000`，即默认 float 0.5。
- `BattleCostManager.SetCost` 65875 / `0x1806845d0`：达到最大费用时重置计时；未出现跨越 0 就重置进度的分支。
- Timer 到期循环每次回复 1，再用 `Next` 保留超出进度；同一次 UpdateCost 在入口采样一次符号，不在循环跨零时重新分段。回到 0 后下一次调用正常推进。不能把它实现含义解释为每次实际获得量减半，也不能应用到主动加费操作。

社区交叉资料：[部署费用·负数当前费用](https://prts.wiki/w/部署费用#负数当前费用)、[可露希尔·天赋](https://prts.wiki/w/可露希尔#天赋)，查阅 2026-11-01；短摘录与限制保存在 `negative-dp/prts-sources.json`。PRTS 为社区资料，不标为官方文档。

## 新版费用短链

`cost-version/` 保留 get_rawCost 66823（`0x1806f3420`）、get_cost 66826（`0x1806f2310`）、CalculateRuntimeCardCost 65914（`0x1806872b0`）及字段绑定。两次 floor 与独立 `MAX_COST_CEIL` 仍成立；后者仍是 BattleOptions 的 `0x44` 静态字段，与 `MAX_COST` 的 `0x30` 不同。

但新版 raw-cost 的倍率上限先计算 `max(1, m_respawnCostMaxMultiplier + m_respawnCostMaxMultiplierOffset)`，再与当前再部署倍率取最小值。新 offset 的内容来源未追查；不可宣布旧完整公式原样适用于新版，更不能由此新建项目修正接口。

## 复现与材料

从仓库根目录分别运行，`--game` 可指定具有本批指纹的另一安装目录。入口核对指纹、按方法全名新定位，不依赖旧工作输出：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked docs/research/evidence/deployment-recovery-20261101/supply/extract.py --out .cache/native-research/deployment-recovery-replay/supply
uv run --locked docs/research/evidence/deployment-recovery-20261101/negative-dp/extract.py --out .cache/native-research/deployment-recovery-replay/negative-dp
uv run --locked docs/research/evidence/deployment-recovery-20261101/cost-version/extract.py --out .cache/native-research/deployment-recovery-replay/cost-version
```

依赖已缓存时可加 `--offline`。各入口使用 skill 的 `native.py`，脚本锁定 Capstone，不复制客户端。三个子目录的 `probe.json` 记录输入，JSON 使用 `provenance`／`result`；`archive.json` 登记材料及共享 replay 选择器。负 DP 的辅助类型／调用身份也可通过共享 `replay.py` 复读，专用入口重建主要行为短链。
