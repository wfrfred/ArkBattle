# HP／EP 治疗结算证据

研究日期：2026-11-03；项目与工具基线 `a85aaa4`。结论集中在[案例 29](../../cases/29-hp-and-ep-healing-settlement.md)。只补治疗公式、分类、接收、后置和两名普通治疗者的必要绑定，不重新调查整条 Action，也不修改项目接口或政策。

## 输入与材料

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `charpack/char_117_myrrh.ab` | 17901 | `e8df52d0fc058c98b4e1cc655adc20e157ecf3386dcd93be8a9b62708a1d8ef9` |
| `charpack/char_473_mberry.ab` | 26199 | `ef53adb2b73899bf2db7b52102af86cb1612915f01f41a4e16e4a6417b204acb` |
| `battle/prefabs/[uc]projectiles.ab` | 1905483 | `cc3f21b73b10fbc619a1ff8b099f31e678c883ddacb7bb6775fea960ffecb0e1` |
| `config/buff_template_holder.ab` | 2151020 | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |
| `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin` | 477255 | `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99` |

Windows x64、metadata v29、image base `0x180000000`。通用 `native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`；实际输入、工具和专用脚本身份保存于各 JSON provenance。普通静态 native 与选定资源，没有运行完整客户端或验证活跃 XLua。

- `hp/extract_hp_healing.py`、`.lock`、`native-hp-healing.json`：两个 CalculateHeal 重载、AfterOutputHeal、OnTakeHeal、isHeal、finalDelta，共6个缺口方法，另定位 FP.Zero 字段。`hp/reused-inputs.json` 登记复用主链的哈希。
- `ep/extract_ep_heal.py`、`.lock`、`native-ep-heal.json`：EP 治疗节点、构造、分类与恢复资格，共10个缺口方法；默认比例常量、字段和复用输入也在记录中。
- `content/extract_native.py`、`.lock`、`native-content.json`：Heal 主动作、RangedHeal 弹道和 PassiveAttachment 的10个必要方法与字段。未保留无关 Aura 侦察正文。
- `content/extract_content.py`：使用 skill 的 Unity Reader、bundle／SerializedFile 解析及已归档 `attack-addon-order-20261102/content/decode_content.py` 的类型树读取；本批字段投影正确按 unsigned byte 读取 common:928，每个对象断言完整消费原始内容。
- `content/characters/`、`content/projectiles/`：11个角色／默认模式／治疗／索敌／Trait对象与4个实际弹道对象的 JSON、原始小对象。对象身份由 SerializedFile + PathID 确定。
- `content/templates/decoded-content.json`：只保留 Holder 中 `ep_heal_all`，没有复制整份 Holder。
- `content/resolve_trait_script.py`、`content/script-binding/`：沿角色的精确外部 PPtr 解析 MonoScript，直接确认 Trait 类为 `Torappu.Battle.Abilities.PassiveAttachmentAbility`；复用案例 27 已定位的脚本 bundle，不扫描其他包。只保存该脚本小对象。
- 各目录 `prts-sources.json`：社区页面、章节、日期、支持范围与缺口。
- `archive.json`：输入、材料哈希与可复查选择器清单。

HP／EP 的 ApplyModifier、普通 HP setter、EP setter、爆发锁定与命中 attachment 主体分别复用 [attack-addon-order-20261102](../attack-addon-order-20261102/README.md)、[nymph-action-settlement-20261103](../nymph-action-settlement-20261103/README.md)、[elemental-timing-20261102](../elemental-timing-20261102/README.md)、[ep-modifier-events-20261103](../ep-modifier-events-20261103/README.md)的同指纹证据，不重复归档。

## 必要资源锚点

末药 SerializedFile `CAB-bb39b949015fbd20018f01f85fe0cb3d`：Character `-6208793881063593099` → Default `6123565879521897333` → RangedHeal `-4946051259289834635`。桑葚 SerializedFile `CAB-64da1f07e74ec4318182d559126b9e0a`：Character `-427840004798160237` → Default `-8059306237034241389` → RangedHeal `8731248604591743635`；Trait `2182608855241056915`。

弹道 SerializedFile `CAB-34af01ecb5d2ad63aca01b6e0d71279d`：末药 `5235117087301787663`，桑葚 `-3219002462648043989`。Holder SerializedFile `CAB-7983df61b3ae63c96fb4e076fc3d80af`、PathID `6070581171229484677` 的模板908为 `ep_heal_all`，event0 同步执行 ApplyElementHeal。

## 复跑

从仓库根目录执行，`--game` 可替换安装目录。需要上述指纹输入、skill 工具和已归档类型树读取器；不依赖之前的工作目录。依赖未缓存时移除 `--offline`。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
batch=docs/research/evidence/healing-settlement-20261103
work=.cache/native-research/healing-settlement-replay
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
uv run --locked --offline "$batch/hp/extract_hp_healing.py" --game "$game" --out "$work/hp/native-hp-healing.json"
uv run --locked --offline "$batch/ep/extract_ep_heal.py" --game "$game" --out "$work/ep/native-ep-heal.json"
uv run --locked --offline "$batch/content/extract_native.py" --game "$game" --out "$work/content/native-content.json"
uv run --offline "$batch/content/extract_content.py" --game "$game" --out "$work/content/characters" \
    --bundle charpack/char_117_myrrh.ab --bundle charpack/char_473_mberry.ab \
    --object -6208793881063593099 --object 6123565879521897333 --object -4946051259289834635 \
    --object -2408678113008227467 --object -2627947242665088139 --object -427840004798160237 \
    --object -8059306237034241389 --object 8731248604591743635 --object -8088516567538670957 \
    --object 6895478437080457875 --object 2182608855241056915
uv run --offline "$batch/content/extract_content.py" --game "$game" --out "$work/content/projectiles" \
    --bundle 'battle/prefabs/[uc]projectiles.ab' --object -3219002462648043989 \
    --object 4965476126317245995 --object 5235117087301787663 --object 5862338322421014543
uv run --offline "$batch/content/extract_content.py" --game "$game" --out "$work/content/templates" \
    --bundle config/buff_template_holder.ab --find ep_heal_all --template ep_heal_all
uv run --offline "$batch/content/resolve_trait_script.py" --game "$game" --out "$work/content/script-binding"
```

上述脚本已向全新输出实际复跑，原生与配置 result 均与初次提取一致，原对象哈希吻合。26个新增方法只补缺口；前置程序、资源提交和后置的其余主体复用已登记材料。实际桑葚50%的外部黑板、所有动态组合与特化恢复仍按案例限定，不以未知数据补齐结论。
