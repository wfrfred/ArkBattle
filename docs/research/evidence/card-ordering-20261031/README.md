# Card 多来源重排：调用短链与未闭合边界

取证日期：2026-10-31；仓库与共享工具基线 `b33bad5b9b5e74a30e3d0dc3d01253ee7d54847f`；uv 0.12.24、Capstone 5.0.7。对应[案例 24 第四节](../../cases/24-deployment-cost-and-supply.md#四手牌顺序与目标选择)。本批记录一次未闭合的窄范围调查，不规定项目的重排竞争政策。

## 问题与结果

问题是：多个凛御银灰／重排来源同时存在时，采用谁的排序，来源退出后如何恢复？

**本批尚不能确定。** PRTS 说明单个凛御银灰持续重排的比较规则；卫戍帮助明确同名干员可同时部署，但相关备注没有说明多来源竞争和退出恢复。本批已定位普通 native 排序入口、直接调用实参及相关 Aura，没有定位凛御银灰实际比较器的安装／撤销链。不能据登记顺序、默认比较器或 Aura 的 priority 补定答案。

2026-10-31 查阅的社区资料与检索范围见 `prts-sources.json`：[凛御银灰·天赋备注](https://prts.wiki/w/凛御银灰#天赋)、[卫戍协议／帮助·干员的获得与精锐化](https://prts.wiki/w/卫戍协议/帮助#干员的获得与精锐化)。PRTS 是社区机制记录；未检索到说明不等于证明不存在说明。

## 输入与证据范围

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 218523112 | `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5` |
| `Arknights_Data/il2cpp_data/Metadata/global-metadata.dat` | 45805368 | `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f` |

Windows x64 PE、IL2CPP metadata v29、image base `0x180000000`。完整路径、注册表、CodeGenModule 和工具指纹在 `probe.json.provenance`。未运行游戏，未核验实际安装的 XLua 脚本；普通 native 分支不能代替运行时特化行为。

指令正文按 PE `.pdata` 区间保存；`fullyDecoded` 只证明该区间解码完成。调用点摘录使用 `selectedInstructions` 并注明地址范围，不能据此声称方法全部分支已经覆盖。为压缩材料，省略每条调用附带的大量泛型方法别名，保留机器字节、地址、跳转、区间和 metadata 身份。

`SortDeckRuntime` 的 `.pdata` 区间末尾还包含跳转表；线性解码在 `0x180632334` 停止，记录如实保留 `fullyDecoded=false`。本批引用的参数选择、调用与通知指令均在此前，不宣称已经解码尾部数据或穷尽各模式实现。

## 关键定位

| 路径 | 普通分支直接证实的事实 | 记录 |
| --- | --- | --- |
| `BattleController.SortDeckRuntime`，method 64737，`0x180631f60` | 接收本次 comparer；空值时使用 Deck；随后再调用 GameMode 的运行时排序入口及 Deck 通知。入口也具有 XLua 分派 | `runtime-sort.json` |
| `Deck.Compare(Card, Card)`，method 65790，`0x1806c7de0` | 已保存入口及 `0x1806c7e32`、`0x1806c7f1d` 的普通后续区间；其中包含费用等通用判断，未闭合凛御银灰实际比较器的安装与撤销 | `runtime-sort.json` |
| XLua wrapper `_m_SortDeckRuntime`，method 17511，`0x180804630` | 三参数分支经 `ObjectTranslator.GetObject` 和接口检查取得 Lua 参数 3，在 `0x180804865` 传入 comparer；两参数分支在 `0x1808048cc` 传空 | `callers.json` |
| `Deck.OnFixedUpdate`，method 65769，`0x1806c9850` | 待重排标记触发排序，传空 comparer | `callers.json` |
| `Svash2LRCardPositionSwap._SwapCardByCount`，method 96495，`0x1810449da` | 换费后的重排调用传空 comparer | `callers.json` |
| `Nodes.SortDeck.Execute`，method 97114，`0x181071d64` | 该节点重排时传空 comparer | `callers.json` |
| `ClearDeckOverrider._ClearRawCostOverriderAndSort`，method 99981，`0x181164056` | 清理换费后的重排调用传空 comparer | `callers.json` |
| `Svash2DeckAuraBehaviour.DeckBuffCardBuffDeckArua`，methods 94222–94226 | 普通构造器在 `0x180f7cf4b` 将 priority 写为 0；Enable 跳入 `_ApplyByFilter`，该函数按过滤结果添加 DeckBuff／CardBuff | `aura.json`、`call-targets.json` |

最后一行记录的是给牌施加 Buff 的路径，**没有证明它是 Card 比较器提供者**。不能把 Aura 的 key／priority 或它的撤销，当成重排比较器的竞争／恢复规则。构造器还允许 XLua 接续，因此普通分支的 priority=0 也不代表已验证运行时优先级。

2026-11-01 更正：原说明把 `Compare` 的虚调用解释为“牌策略”，该命名不成立。[入场调查](../deployment-entry-20261101/README.md)通过 `BObject.Init → OnInit` 核对了本客户端的 vtable 起点 `0x140`，故 `+0x1e0` 对应 slot 10；[费用证据](../deployment-native-20261031/README.md)中的 `Card.get_cost` 正是 slot 10，`get_cardPolicy` 则为 slot 11。旧指令与 metadata 原记录保留；多来源比较器安装／撤销尚未闭合的结论不变。

`_ApplyByFilter` 中 `0x180f7ccab` 对应 `Card.AddDeckBuffWithKey`（method 65875），`0x180f7cd67` 对应 `Card.AddCardBuff`（method 65886）；相关方法身份保存在 `call-targets.json`。本批不复制无关 Buff 模板或整个客户端资源。

原调查还定向检查了直接 E8/E9 候选、卫戍相关模式排序、Svash／CardComparer／DeckComparer 等托管命名，以及凛御银灰 charpack 字段形状，没有取得实际比较器连接。上述检查不穷尽间接调用、所有内容脚本或模式特化；未闭合的探索性转储不作为确定机制证据纳入本批。

## 具体缺口

1. 凛御银灰怎样安装、替换或调用实际 Card 比较器，以及多来源是否经过仲裁。
2. 来源退出时怎样撤销该连接；剩余来源重算、默认规则重算与保留现排列，尚无法取舍。

XLua wrapper 证明脚本可以提供 comparer；它不证明凛御银灰实际使用该入口。仅有通用热更分支，也不能证明实际排序由 Lua 实现。后续如继续调查，应补实际内容调用者和安装／撤销连接，不重新把本批 Aura 路径当成排序者。

## 文件与复现

| 文件 | 用途 |
| --- | --- |
| `probe.json` | 实际输入和共享解析工具指纹、注册表及方法表定位 |
| `runtime-sort.json` | 排序入口与默认 Card 比较器的普通分段 |
| `callers.json` | 具体 comparer 实参和 Lua wrapper 的参数转换链 |
| `aura.json` | Aura 的 priority 初始化及按过滤条件施加 Buff 的必要正文／摘录 |
| `call-targets.json` | 指令所用方法的 metadata 身份，避免仅凭地址命名 |
| `prts-sources.json` | 社区资料链接、查阅日期、检索范围及未能回答的问题 |
| `extract.py`、`extract.py.lock` | 调用 skill `Native` 的独立复现入口，固定依赖 |
| `archive.json` | 材料哈希、输入来源与共享 replay 可读取的选择器 |

从仓库根目录执行，输出目录可不存在，输入目录可以通过 `--game` 更换：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked docs/research/evidence/card-ordering-20261031/extract.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/card-ordering-replay
```

已缓存依赖时可添加 `--offline`。入口先核对本批 DLL／metadata 指纹，再验证方法身份，输出新的 `provenance`／`result`；不读取既有缓存结果。2026-10-31 已实际运行本入口，验证范围仅为上述静态提取，不包括游戏运行、内容脚本连接或多来源竞争实验。

共享 `replay.py` 也可复查清单登记的方法；本批专用地址摘录与普通后续分段，以 `extract.py` 为完整复现入口。
