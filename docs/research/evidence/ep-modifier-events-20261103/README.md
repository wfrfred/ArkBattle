# EP Modifier 的共享与专属事件

研究日期：2026-11-03；项目与共享工具基线 `a768ca3dee224de9b8762fdcf35a9209d05c5777`。结论补入[案例 27](../../cases/27-attack-additions-and-damage-events.md#6-ep-损伤的共用与专属事件)。只补查 EP 事件分支和一个真实内容绑定，不重做 HP 主链，也不决定 ArkBattle 接口或时序政策。

## 输入与范围

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `config/buff_template_holder.ab` | 2151020 | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |
| `battle/enm_pfb_34.ab` | 413007 | `f6bae238962bc330c6cc72734f788fe09be81dd6eae8eda1305312495899bafb` |

Windows x64，metadata v29，image base `0x180000000`。共享 `native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`；专用脚本、工具和输入身份保存在各 JSON provenance 中。没有运行完整游戏，也未验证活跃 XLua 覆盖。

复用同指纹证据：

- [elemental-timing-20261102](../elemental-timing-20261102/README.md) 的 `schedule-native.json`、`ep-native.json`：ApplyModifier、EP 提交、归零和同步爆发。
- [attack-addon-order-20261102](../attack-addon-order-20261102/README.md) 的 `hp/native-hp.json`：目标接收、目标应用后及来源 HP／EP 后置分流；`content/native/event-bindings.json`：来源应用前事件。
- [nymph-action-settlement-20261103](../nymph-action-settlement-20261103/README.md) 的 `damage/native-damage.json`：来源伤害后程序内同步派生 EP 的上下文。

`reused-inputs.json` 登记复用文件与工具的路径、大小和 SHA-256，不复制上述主链。

## 材料与定位

- `prts-sources.json`、`content/prts-sources.json`：PRTS 页面、章节、查阅日期和证据限制；社区资料不标为官方文档。
- `extract_ep_events.py`、`.lock`、`native-ep-events.json`：13 个补缺方法的当前签名、token、VA、连续 `.pdata` 分段、指令和必要字段；Capstone 固定为 5.0.7。
- `content/extract_agpack.py`：复用 skill 的 `unity_assets.py` 与已归档 `attack-addon-order-20261102/content/decode_content.py`，只解码浮空信件相关的两个模板及一个精确被动对象。输入 bundle 指纹在入口核对。
- `content/agpack-templates.json`：Holder 的 SerializedFile `CAB-7983df61b3ae63c96fb4e076fc3d80af`、PathID `6070581171229484677`；`agpack_t[record_damage_cnt]` 的 event5 使用 `IsDamage OR IsElementDamage`。
- `content/agpack-prefab.json` 与 `agpack-passive--4786395766426076502.bin`：`battle/enm_pfb_34.ab` 的 SerializedFile `CAB-aa22395bb3f0e1a2e0e3e1bbfb74af3b`、PassiveAbility PathID `-4786395766426076502`，确认 `enemy_10231_agpack → Talents → 1` 直接引用上述模板。原对象仅 316 字节。
- `archive.json`：材料、输入与选择器清单。

新增关键方法：`CalculateElementDamage` 三个重载 65902–65904；`get_isDamage` 72134、`get_isElementDamage` 72136；EP 构造 72181；Buff 的通用事件映射 66139／66140／66141／66143、EP 事件映射 66147／66153；无敌资格 67664。Buff.Event 编号与 Entity／EventPool 编号不是同一枚举。

## 复跑

从仓库根目录执行；输出目录可以不存在。需要上述指纹客户端与仓库中已归档的类型树读取器，不依赖先前的工作目录。依赖未缓存时去掉 `--offline`。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/ep-modifier-events-20261103/extract_ep_events.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/ep-modifier-events-replay/native-ep-events.json
uv run --offline docs/research/evidence/ep-modifier-events-20261103/content/extract_agpack.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/ep-modifier-events-replay/content
```

脚本已从全新输出目录复跑；原生 result、两个内容 result 与原对象均与初次提取一致。静态绑定证明内容选择了同一前置时点，不证明每种运行时组合；通用回调按当前 Modifier 分类，可能改变后续分流。未穷尽 force／skip／GameMode 特化、所有订阅者或 EP 公式静态下限的初始化值。
