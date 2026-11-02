# 攻击附加程序与伤害通知取证

取证日期：2026-11-02；项目基线 `5ffe575`。问题与机制结论集中在[案例 27](../../cases/27-attack-additions-and-damage-events.md)。本批核对妮芙 S1 的前置附加 Buff、主 HP 伤害、后置 EP 及天赋监听，不决定新的项目 API，也不修改实现或测试。

## 输入与适用范围

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| GameAssembly.dll | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| charpack/char_4146_nymph.ab | 25609 | `e5f8d7c626ebfbeedda9a968da977e8cf35c99f0b7c7861d72e6ff34aa710c28` |
| battle/prefabs/[uc]skills.ab | 1367500 | `0d0b4c0f9252c14a69a20d4bea09527403dd3eddfc2f7bcd757c3c30cf37ffc3` |
| config/buff_template_holder.ab | 2151020 | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |
| battle/prefabs/[uc]projectiles.ab | 1905483 | `cc3f21b73b10fbc619a1ff8b099f31e678c883ddacb7bb6775fea960ffecb0e1` |

Windows x64 PE，metadata v29，image base `0x180000000`。资源的 SerializedFile、PathID、对象哈希及原始头版本由投影保存；不从资源头占位字符串推断完整引擎版本。只分析无相关 XLua 覆盖的普通静态分支，没有执行完整客户端。

原生解析复用 native research skill 的 `scripts/native.py`，SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`。资源解包复用该 skill 的 `unity_assets.py`；`decode_content.py` 只在此基础上解码本例相关的类型树与对象。各 JSON 的 provenance 保存实际工具、输入和专用脚本身份，专用脚本与依赖锁文件随批次保存。

## 材料

| 文件 | 用途 |
| --- | --- |
| `prts-sources.json` | PRTS 固定版本、章节、查阅日期与无法回答的事件时点。 |
| `hp/native-hp.json` | 12 个指定方法的 metadata 与完整连续原生区间，覆盖 HP 主链、安装同步启动、命中次序及按 value 产生 EP；仅保留必要 Modifier 字段。 |
| `hp/extract_hp_selected.py`、`.lock` | 按完整方法名重新定位本批 HP／EP 与安装方法；检查客户端指纹，实际重新提取，不读取历史缓存正文。 |
| `content/decoded-content.json` | 9 个相关对象的实际引用、Prefab 层级、字段、SerializedFile 与 PathID；包括 S1、天赋、ActiveEP 和真实投射物。 |
| `content/selected-templates.json` | 5 个实际引用模板的动作列表，保留 Holder 对象身份和模板序号。 |
| `content/*.bin` | 8 个相关小型原始对象，与 decoded-content 的 rawFile 和哈希对应；不包含完整资源包或完整 Holder。 |
| `content/native/event-bindings.json` | 当前 Buff 事件方法传给 `_RunActions` 的事件参数。 |
| `content/native/event-bodies.json` | 上述四个事件方法的原始指令与边界。 |
| `content/native/projectile-active-buffs.json` | 当前 ActionController.Init／_AttachBuffs 的完整连续区间与字段。 |
| `content/native/ability-active-buffs.json` | 当前 slot 47 的必要方法、字段与正文。 |
| `content/native/ability-type-chain.json` | RangedAttack 到 Ability 的继承及覆写定位。 |
| `content/decode_content.py` | 从安装资源重新提取本例配置，不依赖外部临时解码文件。 |
| `content/extract_native.py`、`.lock` | 从当前 metadata 重新定位事件、控制器与能力访问器。 |
| `archive.json` | 本批材料哈希、来源登记与复查选择器。 |

原生正文保留解码标记。`ApplyModifier` 在 `0x180721baa–0x180721bef` 的尾随异常／数据区域没有完整解码，与[案例 25](../../cases/25-elemental-burst-recovery-timing.md)记录一致；本案依赖的主体调用与其他关键方法完整解码。完整区间不代表穷尽全部间接调用、内容特化或运行时热更。

## 复跑

以下从仓库根目录执行，输出目录可以替换。需要对应指纹的客户端和上述 skill 共享工具；`--offline` 适用于依赖已缓存的环境，首次获取锁定依赖时去掉该参数。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"

uv run --locked --offline docs/research/evidence/attack-addon-order-20261102/hp/extract_hp_selected.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/attack-addon-order-replay/hp/native-hp.json

uv run --offline docs/research/evidence/attack-addon-order-20261102/content/decode_content.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/attack-addon-order-replay/content \
    --bundle charpack/char_4146_nymph.ab \
    --bundle 'battle/prefabs/[uc]skills.ab' \
    --bundle config/buff_template_holder.ab \
    --bundle 'battle/prefabs/[uc]projectiles.ab'

uv run --locked --offline docs/research/evidence/attack-addon-order-20261102/content/extract_native.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/attack-addon-order-replay/native
```

脚本共享解析器，但原生与内容取证互相独立：安装资源指纹不同应重新核对配置，DLL／metadata 指纹不同应重新定位方法；不得将不同版本的序号或字段位移混在一条链里。`.lock` 固定本批 native 提取所用的 Capstone 5.0.7。

本批没有核实原生物理注销相对全部后置通知的位置，也未穷尽 value、finalDelta、realDelta 在屏障／过量伤害等组合中的全部含义。案例明确区分直接证实的调用／配置、据此推导的伤害差异，以及未知项。
