# 越长尘：路线之外的消失控制

取证日期：2026-11-05；项目基线 `5a3a7e51f09cf15897e595c0eab39808b37d56c1`。问题是 SH16“越长尘”的乘客是否由装卸业务直接切换消失，而非执行乘客路线中的消失／出现检查点。结论集中于[案例 18](../../cases/18-projectile-source-and-target-lifecycles.md)。本批没有修改模拟实现或测试，没有运行完整游戏或核实活跃 XLua 替换。

## 输入与定位

| 输入 | 大小／用途 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 223112680 bytes，Windows x64 native | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 bytes，metadata v29 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `battle/enm_pfb_12.ab` | 本机敌人 Prefab 聚合包 | `2e9056a509d746f71fb22261f8f2daf8d41fbaebc7787f6d6a15d447576a2f2f` |
| `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin` | 本机 MonoScript 包 | `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99` |

本机默认目录为 `/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。原生 image base 为 `0x180000000`；本轮由当前 metadata 解析方法身份，不将旧客户端的编号套入当前输入。工具为 `uv 0.12.24`、Python 3.14.8、Capstone 5.0.7；共享工具与专用提取脚本的实际指纹随 JSON 保存。Native 工具代码基线与上述项目基线相同。

社区资料 [“越长尘”](https://m.prts.wiki/w/“越长尘”) 提供载客／卸客的机制线索，查阅日期为 2026-11-05；它不是本机资源绑定或机器指令的替代证据。本轮没有下载客户端包。

## 实际资源绑定

SerializedFile 为 `CAB-39e1b2e5768b3ccda9d22135c681ed56`：

1. AssetBundle 的真实 `m_Container` 条目 `dyn/battle/prefabs/enemies/enemy_1302_ymtro_2.prefab` 指向 Root GameObject `-290578867173269922`。
2. Root Enemy 组件 `-8440417371917263266` 的 `_modes[0]` 指向 Default UnitMode `-7751935427412369826`。
3. Default 的 Transform 子树 `Talents/Bus` 对应 GameObject `4923775148966796894`；该 GameObject 的组件数组同时包含 Talent `6559147715892665950` 和 DurbusAbility `109810286188617310`。
4. DurbusAbility 的实际脚本 PPtr 为 `(fileID=1, pathID=8689893180211089106)`。外部 SerializedFile `CAB-658d74aab777086fc32b93f385be999a` 中的精确 MonoScript 为 `Torappu.Battle.Abilities.DurbusAbility`，程序集为 `Assembly-CSharp.dll`。

Default 的 `_generalAbilities` 为空；不能将上述关系写成该数组直接登记了 Bus。`content/ymtro-prefab-binding.json` 保存选定 Enemy／Mode／Talent／Ability、Selector／Validator／Range、必要 GO／Transform 和实际 MonoScript 的解码、原始对象与哈希。容器只保存本例条目的投影及来源对象哈希，不复制整包容器名单。

当前 native 的 `UnitMode._InitTalents` 79173 在 `0x180b13736` 保存子天赋集合到 `talents +0xc8`，并逐项调用 `SetParentMode`；`BasicTalent.Awake` 74557 在 `0x1809bf08e` 将组件查询结果保存为 `m_ability +0x38`。`BasicTalent.DoAttach` 74552 在 `0x1809be1a4` 将该 Ability 和 owner 交给 `Ability.Attach` 64016；后者在 `0x1806020f8` 虚派 slot 32，与 DurbusAbility 的 `DoAttach` 94351 的 slot 一致。这里使用的是天赋持有的实际 Ability，不需要 `_generalAbilities` 再保存同一引用。

本例 `_useHostRoute=false`、`_passengerToNearestEndPoint=false`、`_passengerUseBranchRoute=false`、`_delayToReleasePassengers=0`、`_killPassengersOnDetach=false`、`_finishPassengersWithNoReasonOnDetach=false`。配置说明选择哪些分支，实际执行仍以原生指令为依据。

## 原生指令锚点

| 方法 | 当前索引 | 关键指令 |
| --- | --- | --- |
| `DurbusAbility.OnTick` | 94367 | 搜索开关开启且相应分支通过时，`0x180fa3e78` 调 `_SearchPassengers`；不将它概括成宿主未消失的统一门禁 |
| `DurbusAbility._SearchPassengers` | 94347 | 从目标集合取得乘员，检查资格并登记；`0x180fa5e80` 以 `RCX=r12, DL=1` 调 `BObject.SetDisappeared`，随后 `0x180fa5e8e` 调 `OnPassengerAdded` |
| `DurbusAbility.OnDetached` | 94352 | 本例不杀死乘客的分支在 `0x180fa3c21` 调 `ReleaseAllPassengers` |
| `DurbusAbility.ReleaseAllPassengers` | 94353 | 逐乘员进入 `_ReleasePassenger` |
| `DurbusAbility._ReleasePassenger` | 94362 | 零延迟分支在 `0x180fa586f` 直接调 `_DoReleasePassengers` |
| `DurbusAbility._DoReleasePassengers` | 94363 | `rbp` 来自 `Enemy passenger` 参数；`0x180fa5197` 设置该乘客位置，`0x180fa51a4` 以 `EDX=0` 对其调 `SetDisappeared` |
| `BObject.SetDisappeared` | 66007 | `0x1806aff06` 写 `isDisappeared` backing field `+0x26`，前后调用相应虚回调 |

装载中的 `r12` 是目标集合解引用得到的候选乘员，不是 Bus 宿主；卸载中的 `rbp` 是方法参数中的乘员。上述布尔写入均在 Ability 内直接发生，不通过 `BasicCursor.DisappearCheckpoint` 或 `AppearAtPosCheckpoint`。这不表示乘客没有 Route，也不表示别的配置不会在卸载时重新分配路线。

`.pdata` 将同一方法拆为多个范围；`native/native.json` 保留入口和连续续段，各 fragment 的边界、字节哈希、完整解码标志及区间外目标均可检查。选定区间被解码不等于穷尽所有下游内容程序。

## 文件与复跑

| 文件 | 用途 |
| --- | --- |
| `native/extract.py`、`.lock` | 复用 skill 的 Native 解析器，按完整方法名选取并校验客户端双指纹，保留所需续段 |
| `native/native.json` | 当前原生方法、字段及机器指令 |
| `content/extract_ymtro.py` | 复用 skill 的资源解析器和已有类型树解码器，核对资源双指纹并提取本例 |
| `content/ymtro-prefab-binding.json`、选定 `.bin` | 实际资源条目、对象引用、脚本映射、输入配置和必要原始对象 |
| `archive.json` | 材料清单、哈希及可重新读取的选择器 |

从仓库根目录执行，输出到独立工作目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/presence-passengers-20261105/native/extract.py \
    --out .cache/native-research/presence-passengers-replay/native
uv run --offline docs/research/evidence/presence-passengers-20261105/content/extract_ymtro.py \
    --out .cache/native-research/presence-passengers-replay/content
```

两个入口都支持 `--game`。首次依赖未缓存时去掉 `--offline`。资源解码器按路径复用 `nymph-action-settlement-20261103/projectile/decode_projectile.py`，其身份随结果保存；不依赖一次性的 scratch 文件。解码要求消费选定对象的完整字节范围。客户端指纹变化时停止，不能沿用本批地址或 PathID 推断新版本。

本批确认实际静态绑定和普通 native 调用，不声称观测了运行中的关卡、热更新执行或全部乘客资格。消失回调可以执行其它业务，不能因 setter 本身不注销身份，就保证任意内容的同步回调都不会结束该对象。
