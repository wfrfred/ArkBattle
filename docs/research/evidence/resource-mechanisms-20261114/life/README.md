# HP 应用与生命机制原件

研究结论见 `findings.md`。本目录只提供原生证据，不修改产品、测试或项目政策。

## 来源与范围

- 安装位置：`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。
- GameAssembly SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；v29。
- 原始角色／装备表 revision `17759cc8cdf37388414145d16262a3a06f3ab25e`，敌人数据库 revision `63c7cec73c3858d0ae913f85cc89af3cef4d744f`；原始字节哈希与输入路径见 `static-bindings.json`。
- 关卡来自已有本地 Git 镜像 revision `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。使用 `GIT_NO_LAZY_FETCH=1` 读取；不是把任意目录当 Git 仓库，也不将不同版本强说成同一版。
- 所有 Prefab 原件包括物理 bundle 哈希、serialized file、PathID、对象哈希、脚本 PPtr 与 MonoScript 绑定。生命周期结论限普通 native 分支；未运行游戏、未验证运行时 XLua 替换。
- 517 包政策扫描包括全部本机 `charpack/*.ab`、`battle/enm_pfb*.ab`、`pkgrps/btl_pfb_tokens_*.ab`，外加 `battle/[pack]common.ab`。不将未扫描的其他资源视为不存在。生息演算、保全派驻和船运寻路不作为本批普通玩法的实现正例。

## 文件

| 原件 | 内容 |
| --- | --- |
| `inventory.json` | 生命相关元数据方法清单，以及相关类型的完整普通字段／方法集合 |
| `native.json` | HP／ES／负生命 setter、归零竞争、复活天赋／状态、主动复活与集结点方法完整正文 |
| `native-specializations.json` | PropLikeEnemy、Sui 特化、替身清理和模式切换等完整方法 |
| `native-overrides.json` | 另三种 HP 接收派生实现 |
| `native-binding.json` | 实际 Talent 创建／选择与同对象 Ability 关联的底层方法 |
| `literals.json` | 原件 RIP 槽的 metadata 字符串解析，包含复活黑板键 |
| `content.json` | 所选角色、敌人、Skadi 模组、技能与 Token 的完整 MonoBehaviour 配置 |
| `templates.json` | 全 9054 Holder 模板的生命节点清单及所选完整程序 |
| `prefab-policy-scan.json` | 精确脚本的完整资源池扫描、全部非默认配置、失败列表 |
| `static-bindings.json` | 原始角色／敌人／模组记录与普通关卡 DB／SPAWN 选择 |
| `sources.json` | PRTS 交叉核对及与 native 不可直接等同的说法 |
| `verification.json` | 本批独立重提比较结果，原件不被复查覆盖 |

`native-selection.json` 保存主要正文选择命令；其他正文的 `result.selection` 同样保留完整选择器。已有提取器按 PE 方法边界保存完整片段、字节哈希和 `fullyDecoded`，不是只摘有利的几行。

## 复跑

从仓库根目录执行。依赖使用锁定的 capstone 5.0.7，缓存写入工作区：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/resource-mechanisms-20261114/life/inventory.py --out .cache/native-research/resource-mechanisms-20261114/life/inventory.json
python docs/research/evidence/resource-mechanisms-20261114/life/extract_content.py --out .cache/native-research/resource-mechanisms-20261114/life/content.json
python docs/research/evidence/resource-mechanisms-20261114/life/extract_templates.py --out .cache/native-research/resource-mechanisms-20261114/life/templates.json
python docs/research/evidence/resource-mechanisms-20261114/life/scan_prefab_policies.py --extra-bundle 'battle/[pack]common.ab' --out .cache/native-research/resource-mechanisms-20261114/life/prefab-policy-scan.json
python docs/research/evidence/resource-mechanisms-20261114/life/extract_static.py --content .cache/native-research/resource-mechanisms-20261114/life/content.json --out .cache/native-research/resource-mechanisms-20261114/life/static-bindings.json
```

完整正文按相应 `result.selection` 调用 `docs/research/evidence/facing-semantics-20261113/extract.py`；`verify.py` 已统一实现这一复提过程，同时独立重提配置、重新解析字符串并比较选定结果：

```sh
python docs/research/evidence/resource-mechanisms-20261114/life/verify.py --out .cache/native-research/resource-mechanisms-20261114/life/verify
```

原始静态输入和当前安装资源缺失时，脚本会失败；不会改用另一份输入补造相同版本的证据。`verify.py` 只忽略输出目录字段，逐项比较 `result`，并核对 native 两个客户端指纹。
