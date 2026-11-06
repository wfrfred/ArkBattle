# 部署费用 getter、取整与截断上限

取证日期：2026-10-31；工作树基线 `b33bad5b9b5e74a30e3d0dc3d01253ee7d54847f`；uv 0.12.24。机制结论、PRTS 资料和未决项集中于[案例 24](../../cases/24-deployment-cost-and-supply.md)。本批只保存支撑费用短链的必要 native 材料，不将社区的供给说明冒充已反汇编结论。

## 输入与范围

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 218523112 | `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5` |
| `Arknights_Data/il2cpp_data/Metadata/global-metadata.dat` | 45805368 | `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f` |

Windows x64 PE、IL2CPP metadata v29。完整路径、注册表及工具指纹位于 `probe.json.provenance`；共享 `native.py` 所属提交同上，提取脚本及锁文件与本批一起保存。当前 DLL 指纹与旧 Blocking 证据一致，但本批方法及字段均重新定位，不套用旧摘录。

只分析不存在相应 hotfix delegate 时的普通 native 分支；未运行游戏、未读取 live XLua，不覆盖派生类型或具体内容对方法的运行时替换。`fullyDecoded` 只表示所选 `.pdata` 区间解码完毕，不表示穷尽所有热更和特化路径。

## 文件与定位

| 文件 | 用途 |
| --- | --- |
| `probe.json` | 本次输入、工具与 metadata／CodeGenModule 定位，供复现入口核对指纹。 |
| `card-cost.json` | `Deck.Card.get_rawCost` 65831、`get_cost` 65833 的 metadata 身份与入口区间。 |
| `expanded.json` | 上述两个 getter 正常 native 分支的后续 `.pdata` 区间，分别从 `0x1806c2018`、`0x1806c0eab` 开始；不包含退出链等无关调查。 |
| `runtime-cost.json` | `BattleFormula.CalculateRuntimeCardCost` 64934，`0x1806586c0`；乘算、取整、加 delta 及 `[0, MAX_COST_CEIL]` 截断。 |
| `cap-field.json` | `BattleOptions` type 9843 的静态字段布局，含 `MAX_COST`、`MAX_COST_CEIL` 和同步开关。 |
| `cap-field-binding.json` | 从费用公式的 RIP-relative 类型引用，解码 metadata usage 并绑定 `BattleOptions.MAX_COST_CEIL` 的原始值、索引和字段记录。 |
| `extract.py`、`extract.py.lock` | 复用 skill `Native` 解析／反汇编能力的本问题入口；固定 Capstone 5.0.7。 |
| `archive.json` | 材料哈希、来源与共享 replay 可读取的选择器；不代替本批专用入口。 |

`get_rawCost` 在 `0x1806c224f` 限制再部署倍率、`0x1806c227f` 取整；`get_cost` 在 `0x1806c0f18` 转入运行时公式。公式在 `0x1806587a1` 取整，`0x180658808` 加 delta，之后截断；上限字段读取位于 `0x1806587cb`。

该类型引用的文件内编码为 `0x20015af1`，解码得到 TypeInfo usage、类型索引 44408；对应 Il2CppType kind `0x12`、TypeDefinition 9843（`BattleOptions`）。所读静态偏移 `0x44` 对应 `MAX_COST_CEIL`。字段身份与其值从何配置是两个问题，本批没有调查初始化和动态同步。

## 从干净工作目录复现

从仓库根目录执行，`--game` 可指定具有上述指纹的另一安装位置；输出目录可以不存在：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked docs/research/evidence/deployment-native-20261031/extract.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/deployment-native-replay
```

依赖已缓存时可增加 `--offline`。入口先核对本批记录的 DLL／metadata 指纹，再按完整方法名重新定位，提取三个方法、两个正常分段及字段绑定；不依赖既有缓存输出或一次性的 Python 搜索路径。它输出新的 `provenance`／`result`，不覆盖本批材料。

仅重新读取清单登记的身份时，也可运行共享入口：

```sh
uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/deployment-native-20261031 \
  --out .cache/native-research/deployment-native-selectors
```

共享 replay 不恢复本批的 TypeInfo 解码和正常分段选择；完整短链复核使用 `extract.py`。

## 来源边界

供给三种策略、返费、免费投递和卫戍部署差异来自案例中逐项列明的 PRTS 页面，查阅日期均为 2026-10-31。本批未反汇编返费、卡牌回收或退场的完整调用链，也没有证明部署额度、同卡在场限制、占位与冷却必须同时释放。
