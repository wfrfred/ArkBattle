# 卡牌附加、属性初始化与出生业务

取证日期：2026-11-01；项目与共享工具基线 `b33bad5b9b5e74a30e3d0dc3d01253ee7d54847f`；uv 0.12.24、Capstone 5.0.7。机制结论集中在[案例 24 第十节](../../cases/24-deployment-cost-and-supply.md#十卡牌附加与部署时序)。本批不修改实现，不规定项目的统一 Entry 顺序。

## 问题与范围

核对松桐生命加成、凛御银灰屏障／部署攻击及入场资源变化，是否都应当被解释为一个早于新单位技能与自身入场程序的步骤。先核对 PRTS，再针对缺少的先后顺序提取普通 native 调用与具体 Buff 绑定。

结果不能概括为“部署时调用所有程序”：基础 SP、属性启用、初始 HP、出生事件和后续计时存在不同介入点。原生 `OnInit`、`OnOwnerBorn` 与 ArkBattle `Skill.enter` 不存在按名称确定的一一对应关系；本批不据此增加项目生命周期阶段。

本轮追踪的是 `get_deckBuffOnBorn` 携带的 DeckBuff 数据。原生作用于卡牌属性的 CardBuff 是另一条机制，不据本链声称所有 CardBuff 都会迁为场上 Buff。

## 输入

| 文件 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 218523112 | `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5` |
| `global-metadata.dat` | 45805368 | `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f` |
| `config/buff_template_holder.ab` | 2022247 | `12419ad8d1ea9f670cca214e525240c691cdf3796b82acc8050698d66c202a37` |
| `battle/prefabs/[uc]skills.ab` | 1343313 | `14306a31b1856f61b25812a69a2a057b7c4634561fb2c2bccc42fb37ee41a27e` |

Windows x64 PE、IL2CPP metadata v29、image base `0x180000000`。完整路径、注册表、CodeGenModule、工具身份见 `probe.json.provenance`。具体内容资源的指纹、SerializedFile、PathID 和投影方法保存在内容记录中，与 native 输入分别核对。

本批为静态取证，没有运行完整游戏，未验证现场 XLua 覆盖。PRTS 为社区资料，不标为官方文档；查阅日期、章节、短摘录和逐项未知见 `prts-sources.json`。

## 调用与内容定位

| 定位 | 普通路径直接说明 |
| --- | --- |
| `Character.BuildAt` 75932、`Card.get_deckBuffOnBorn` 65857 | Card 携带的 Buff 数据与黑板进入本次角色参数，不等于当场执行全部出生业务。 |
| `Character.OnInit` 76025、`_SpawnDeckBuffs` 76026 | 自身天赋先有附着机会，随后在初始化末尾添加携带的 Buff。不是在全部自身初始化之前统一执行外来程序。 |
| `Entity.Init` 66624 | `0x1806f565d` 读取 `SpData.initSp`（`+0x48`），`0x1806f5677` 起以 `maxSp` 限制，`0x1806f56a7` 起写入 `Entity.m_sp`（`+0x50`）；之后 `0x1806f5a2b` 才调用 `BObject.Init`。 |
| `BObject.Init` 65029、`Entity.get_initHp` 66506 | `BObject.Init` 调用 slot 30 的 `OnInit`；返回后，`Entity.Init` 在 `0x1806f5a55` 通过 slot 86 读取 `initHp`。该 getter 的普通实现读取当前 `maxHp`，所以合格的卡牌生命修正可以参与出生 HP。 |
| `Entity.AddBuff` 66545／66544、`BuffContainer.NewBuff` 65310、`Buff.set_isEnabled` 65099 | 添加流程会同步开始 Buff，再由启用／组选择路径决定参与。启用路径先提交属性修正，再执行启用动作，不能把所有内容业务都当作登记动作。 |
| `Buff._UpdateIsEnabledIfNotFinished` 65267 | 普通启用分支先登记 `Attributes.AddModifier`，再运行事件 24；不证明事件 12 等其它事件也在此运行。 |
| `Unit.OnBorn` 77696、`Entity.OnBorn` 66647、`BuffContainer.OnOwnerBorn` 65370、`Buff.OnOwnerBorn` 65151 | `Entity.OnBorn` 派发事件 12；它早于 `Unit.OnBorn` 随后的 `RegisterUnit`，不能标为“登记后通知”。 |
| `makiri_s_2[attr]` | 最多两层的 `MAX_HP / MULTIPLIER` 属性 Buff，`empty` 模板；不是另设出生动作再增加 HP。 |
| `shield` | 接受已采样的屏障数据；对应模板动作在未来伤害结算中消耗屏障，不是出生时重新采样来源 HP。 |
| `svash2_s_2[build]` | 开始事件初始化计时，Trigger 事件执行后续攻击；挂载和输出是不同时间。 |

虚槽解释经本轮 metadata 和调用位置交叉核对：`OnInit` slot 30 对应 `vtable + 0x320`，由此确定本客户端 vtable 起点为 `0x140`；`get_initHp` slot 86 对应 `+0x6a0`。没有仅按 displacement 赋予方法名称。

`Unit.OnBorn` 中先 `Entity.OnBorn`（`0x180aca102`）、后 `RegisterUnit`（`0x180aca125`）的调用顺序复用同 DLL／metadata 指纹的[天赋批次原记录](../talent-lifecycle-20261013/records.json) `nativeMethods` 中 method 77696；本轮 `generic-entry.json` 补齐的是前者通向事件 12 的方法正文，不把旧摘录重新标为本轮提取。

指令以 `.pdata` 范围保存，续段另列；`fullyDecoded=true` 仅说明本区间完成解码。外部错误、热更或其它分支保留在指令记录中，不声称已执行或覆盖它们。内容模板只有在 key／实际引用／动作链对上后才纳入结论，同名字符串不作为绑定证据。

## 文件与复现

| 材料 | 用途 |
| --- | --- |
| `probe.json`、`generic-entry.json` 及 `extract.py`／`.lock` | 当前客户端身份、Card → Character → Buff 的调用与属性／出生阶段；保留方法身份并提取必要续段。 |
| `sp-initialization.json`、`extract-sp.py`／`.lock` | 仅保存接受 `spData` 的 `Entity.Init` 重载、普通续段与字段身份，复核基础初始 SP 先于初始化回调的采样。 |
| `content-bindings.json`／`.py` | 7 个必要模板及 4 条技能 Prefab 字段绑定；包括资源指纹、SerializedFile 和 PathID。 |
| `content-event-mapping.json`、`content-extract.py`／`.lock` | 仅复核 `OnStart=0`、`OnTrigger=2`、`OnTakeDamage=10`，不凭事件数字猜测其语义。 |
| `prts-sources.json` | 7 项机制的社区资料与未回答的次序，包含 S1 施法采样、S2 每次输出采样。 |
| `archive.json` | 材料哈希和共享 replay 可重新读取的选择器，不代替专用内容解码。 |

从仓库根目录执行，`--game` 可指定同指纹的客户端安装：

```sh
batch=docs/research/evidence/deployment-entry-20261101
work=.cache/native-research/deployment-entry-replay
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked "$batch/extract.py" --out "$work/generic"
uv run --offline --locked "$batch/extract-sp.py" --out "$work/sp"
uv run --offline "$batch/content-bindings.py" --out "$work/content-bindings.json"
uv run --offline --locked "$batch/content-extract.py" --out "$work/content-event-mapping.json"
```

三条 native 提取入口在读取旧选择器前核对客户端指纹；内容资源入口从本次资源布局提取指定模板并记录资源指纹。输出到独立目录，不覆盖本批原记录。上述入口已实际运行验证；`--offline` 使用本机已缓存依赖，首次准备环境时可去掉该选项由 `uv` 按锁文件获取依赖。

## 限制与未决项

- 凛御银灰的部署额外 SP、下一轮再部署减免，以及风笛编队／模组 SP 的完整具体路径，本轮未逐项闭合。基础 SP 的赋值不能替代它们的业务证据。
- S2 原生计时参数与 PRTS 的部署后 1.1 秒、其后每 0.5 秒分别记录；未为了凑出该数值而自行补算 Trigger 的 Tick 调度。
- 玛露西尔事件 12 的局部资源操作链复用[既有技能机制研究](../../cases/09-skill-mechanisms-and-requirements.md)，本轮补的是该事件的实际出生入口，不重新声称覆盖全部魔力机制。
- 具体来源退场、隐藏卡牌、自动部署、模式特化和现场 XLua 是否改变这些路径，仍以各机制独立证据为准。
- 本轮不决定项目应当复制原生登记前事件，也不把统一前置 Entry 写成已证实的官方规则。
