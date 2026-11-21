# 诺伯特平民与部署费用上限

2026-11-22 核对固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的图鉴、TR-22 和主线 12-13。客户端为 Windows x64、IL2CPP metadata v29。DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

[配置摘录](config.json)保留文件 SHA-256、图鉴正文以及关卡 rune 和实际 SPAWN 的 JSON Pointer。[原生正文](native.json)保留当前的静态字段、方法索引、指令、`LMaxCostSet` 读取的两个字符串和 `.pdata` 续段。机制结论见 [Case 20](../../cases/20-norport-civilian-allegiance-and-blocking.md) 与 [Case 24](../../cases/24-deployment-cost-and-supply.md)。

| 原生位置 | 复查用途 |
| --- | --- |
| `BattleOptions..cctor` #63906，`0x18060801e`、`0x18060804b`、`0x1806081b8` | 普通默认两个上限均为 99，同步字段默认 true。 |
| `LMaxCostSet.PreprocessLevelOptions` #87070，`0x180d7b2c4`、`0x180d7b2f6`、`0x180d7b322`、`0x180d7b383`、`0x180d7b398` | 两项黑板的读取、不同位置的写入以及关闭同步。 |
| `BattleCostManager.SetMaxCost` #65878，`0x180684988`、`0x180684a21` | 在已开始的战斗路径读取独立费用截断上限，写入相应一侧的账户记录。 |
| `Action.Nodes/ModifyMaxCost.Execute` #98830，`0x1810ece26` | 通用运行时节点通往 Controller 的修改入口。尚未从此节点反向绑定到该平民的具体内容程序。 |

本批核对普通静态分支，未运行客户端或验证 XLua 替换。同步开关置 true 时的所有初始化、中途改费和模式覆盖路径未穷尽。完整方法的末尾填充可能包含解码出来的非执行数据。

从仓库根目录复跑。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/dp-cap-20261122/extract.py \
  --out /tmp/arkbattle-dp-cap-replay
```
