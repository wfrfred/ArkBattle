# 负治疗数值的原生分支证据

调查日期：2026-11-06；工具与项目基线 `92f76d2d08f8544bd90fe0a22e06ff09b13e0a10`。补充[案例 29](../../cases/29-hp-and-ep-healing-settlement.md)，限定普通 native 的 HP／EP 治疗公式、Modifier 构造与提交符号，不决定项目输入政策。

## 输入与范围

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

Windows x64、metadata v29、image base `0x180000000`，与案例 29 的输入相同。共享 `native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`；Python 3.14.8、Capstone 5.0.7。各 JSON 保留本次实际 provenance。未运行完整客户端，未验证活跃 XLua、特殊模式或实际内容中负治疗参数的可达性。

PRTS 查阅于 2026-11-06：[游戏数据基础·治疗量](https://prts.wiki/w/游戏数据基础#治疗量)给出基础治疗公式，但没有说明负数 EP 输入的处理；[特殊机制](https://prts.wiki/w/特殊机制)也未闭合此问题。PRTS 是社区资料。

## 材料与关键位置

- `native-constructors.json`：从本次 `extract_ep_heal.py --extra` 输出中仅选取新增的三个完整方法，其原始 provenance 不变。`set_deltaType`（72131，`0x18090e5d0`）在 `0x18090e630` 直接存方向；`set_value`（72157，`0x18090ec30`）在无特殊共享标志的普通分支 `0x18090ecb4` 直接保存输入；`NewHeal`（72182，`0x18090ad20`）原样传入 value，固定 HP、正方向和 HEAL 类型，不取绝对值或按数值符号变更类别。
- `native-get-value.json`：共享工具直接输出的 `get_value`（72156，`0x18090e0a0`）；普通分支 `0x18090e0fa` 直接读取保存的 FP，不做符号转换。
- `archive.json`：仅本批材料的哈希、输入和可复查选择器清单。

以下同指纹材料直接复用，不重复复制：

- [HP 治疗公式与 finalDelta](../healing-settlement-20261103/hp/native-hp-healing.json)：CalculateHeal 65905／65906；finalDelta 72155（`0x18090cff0`）。`finalDelta` 先取 `max(0, value)`，再乘声明方向；提交时仍为负的治疗值不会变为伤害。
- [GetFinalAtk](../nymph-action-settlement-20261103/damage/native-damage.json)：65919（`0x180676e40`），`0x180676f25` 乘 ATK 与 scale，随后加允许的 addition，`0x180676f68` 才以零取 Max。治疗 addition 为零，因此是 `max(0, ATK × scale)`，不是先裁 ATK。
- [EP 治疗节点及构造](../healing-settlement-20261103/ep/native-ep-heal.json)：ApplyElementHeal.Execute 99906、NewElementHeal 72183（`0x18090ab00`）。普通节点直接将 ATK × ratio 交给固定 EP／正方向的 Modifier，没有经过 HP 的基础公式裁零。
- [入口取消判断](../damage-hook-needs-20261103/native-reception.json)：get_isCancelled 72132（`0x18090d200`），普通分支检查方向 NONE 或 `MathUtil.IsZero(value)`，没有负数比较。负值在提交时裁零，不等于入口先被视为零取消；接收程序可能仍执行并改变后续结果。
- [ApplyModifier 与 DoApplyModifier](../attack-addon-order-20261102/hp/native-hp.json)、[EP 提交](../elemental-timing-20261102/schedule-native.json)：EP 提交分支按声明方向区分，并用 finalDelta 增加 EP，不按原始 value 的符号转为 EP 损伤。

这些指令直接支持普通分支中“Modifier 提交时仍为负，其最终资源增量裁为零”的判断，不能证明存在某个实际内容主动产生负治疗，也不能把提交量为零泛化成整次调用没有 Hook 或其他副作用。

## 复跑

从仓库根目录执行，`--game` 可替换安装位置；依赖未缓存时移除 `--offline`。新增方法已按当前 metadata 定位并与既有输入核对；下面的共享工具命令可独立重新读取四个必要方法，无需本次缓存目录。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
work=.cache/native-research/healing-negative-values-replay
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/probe.json" probe
uv run --locked --offline "$skill/scripts/native.py" --game "$game" --out "$work/methods.json" disasm 72131 72156 72157 72182
uv run --locked --offline "$skill/scripts/replay.py" docs/research/evidence/healing-negative-values-20261106 --out "$work/registered"
```

本次新增三个方法的实际提取入口为案例 29 已归档的 `ep/extract_ep_heal.py`，额外选择器为 `Torappu.Battle.Modifier.NewHeal`、`Torappu.Battle.Modifier.set_value`、`Torappu.Battle.Modifier.get_deltaType`、`Torappu.Battle.Modifier.set_deltaType`、`Torappu.Battle.BattleFormula/AttackInfo.GetFinalAtk`；已存在的正文未再次归档。其余方法只复用上述材料，不重新扩大调查。
