# 妮芙 S1：目标、弹道与结算时序取证

取证日期：2026-11-03；项目基线 `269584a`。问题与结论集中在[案例 27](../../cases/27-attack-additions-and-damage-events.md)。本批补齐一次 S1 攻击的目标取得、发射、弹道抵达、属性采样、HP 应用与普通死亡短链，不修改运行代码、测试或项目时序政策。

## 输入与适用范围

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `battle/prefabs/[uc]projectiles.ab` | 1905483 | `cc3f21b73b10fbc619a1ff8b099f31e678c883ddacb7bb6775fea960ffecb0e1` |
| `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin` | 477255 | `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99` |

Windows x64 PE，metadata v29，image base `0x180000000`。指纹与[前批次](../attack-addon-order-20261102/README.md)一致；上游脚本还实际复查前批次四个资源包（妮芙、技能、Buff Holder、弹道）的当前哈希，结果记录在 `provenance.reusedContent`。新解码的匿名包用于绑定弹道组件的外部 MonoScript；不由字符串相同推断类身份。

共享工具为 native research skill 的 `scripts/native.py`，SHA-256 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`，资源解包复用 `unity_assets.py`。工具、输入和专用脚本的实际身份保存在各 JSON 的 provenance；工具目录在当前工作树中被忽略，项目提交号不能代替工具哈希。原生提取依赖由各脚本的 PEP 723 声明和 `.lock` 固定为 Capstone 5.0.7。

结论限定真实 S1 配置的普通 native 分支。未运行客户端、未核实活跃 XLua、所有 GameMode、重生／死亡规避及特殊弹道。HP 归零、业务完成、对象回收分别定位，不以其中一项推断另外两项的时点。

## 材料与复用

| 文件 | 用途 |
| --- | --- |
| `prts-sources.json` | 本轮 PRTS 查阅范围、来源性质与无法回答的时序。 |
| `target/selected-native.json` | 7 个上游方法：开始取得目标、释放前条件性重选、释放与创建参数。 |
| `target/selector-enums.json`、`fields.json` | 当前 metadata 的时点枚举、字段和所需虚 slot 绑定。 |
| `target/extract_target.py`、`.lock` | 当前方法名定位与四个既有资源包的指纹复查；不读取侦察缓存。 |
| `projectile/native.json` | 实际创建、初始化、移动分支、抵达／停止命中、程序顺序及攻击力备用样本；包含必要 helper、跳表原始字节与复用记录。 |
| `projectile/projectile-content.json` | S1 Prefab 的三个实际 MonoBehaviour、字段、层级及外部脚本绑定。 |
| `projectile/projectile-*.bin` | 三个相关小型原始对象，可和内容投影中的对象哈希核对。 |
| `projectile/extract.py`、`.lock` | 完整方法名重新定位所需 Projectile 原生链。 |
| `projectile/decode_projectile.py`、`.lock` | 从真实资源类型树重新解码 S1 层级，不依赖临时辅助脚本。 |
| `damage/native-damage.json` | 属性采样、主值／参考值计算、HP setter、击杀／结束／Buff 清理、回收与 alive 门；53 个方法身份，44 个新增正文。 |
| `damage/extract_damage.py`、`.lock` | 当前方法与虚 slot 定位；对复用的 9 个既有正文逐条验证当前指令 bytes。 |
| `target/README.md`、`projectile/README.md` | 上游及弹道的直接锚点与取证范围。 |
| `archive.json` | 本批材料哈希、来源及方法选择器索引。 |

既有内容和 Buff 模板不重复复制：引用[前批次内容投影](../attack-addon-order-20261102/content/decoded-content.json)、[实际模板](../attack-addon-order-20261102/content/selected-templates.json)及相关 HP／事件正文。复用的原生方法在新输出中显式登记，不能以“省略正文”假装本轮重新保存了完整方法。EP 耗尽后同步启动爆发的链复用[案例 25 的同指纹证据](../elemental-timing-20261102/README.md)。

方法按连续 `.pdata` 分段提取，保留原地址、bytes、解码标记与边界。旧 ApplyModifier 的尾随异常／数据片段仍有已记录的未完整解码区间；移动方法中的跳表单独保存数据，不把数据的线性反汇编当作可执行语义。间接调用只展开本例所需分支，不能由已解码所选区间宣称穷尽所有运行路径。

## 从空输出目录复跑

从仓库根目录执行，输出位置可以替换。需要上述指纹对应的客户端、既有证据文件和 skill 共享工具；依赖首次未缓存时去掉 `--offline`。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"

uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/target/extract_target.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/nymph-action-settlement-replay/target

uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/projectile/extract.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/nymph-action-settlement-replay/projectile

uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/nymph-action-settlement-replay/projectile

uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/damage/extract_damage.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/nymph-action-settlement-replay/damage/native-damage.json
```

本轮已从独立的空输出目录运行这四个归档脚本，比较重新产生的 result 与取证结果，并核对三个原始对象的哈希。没有运行游戏测试，也没有将人工数据推演标为客户端轨迹。
