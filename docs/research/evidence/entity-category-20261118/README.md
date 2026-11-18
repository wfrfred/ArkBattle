# 豆苗磐蟹的战中类别切换

2026-11-18 补核。结论见[单位分类研究](../../cases/36-unit-classification-and-combat-tags.md#3-初始化与变化范围)。本批复用已归档的内容原件，新增节点正文与黑板键的定位。

| 环节 | 原件与定位 |
| --- | --- |
| 实际 Prefab | [生命机制内容](../resource-mechanisms-20261114/life/content.json) 的 `/result/components/1812` 保存 `token_10014_bstalk_crab` 根组件，脚本为 RallyPoint，Prefab `_category=2`。`1789` 是 Crab 的 `crab_s_1[listener]`，`1782` 是 Flower 的计时入口，`1795` 是 `crab_switch`，其 `_activeBuffs.Array[0]` 绑定 `crab_t_1[start]` 并传入 `category=1`、`mode=1`。 |
| 节点配置 | [Buff 模板](../resource-mechanisms-20261114/life/templates.json) 的 `/result/selectedTemplates/4` 是击倒监听器，事件 27 先切类别再切 Flower。索引 `5` 是恢复模板，事件 0 先切类别，再执行 RallyPointReborn 和 SwitchMode。节点配置的 `NONE,TRAP_OR_ITEM` 对应掩码值 2。 |
| 节点执行 | [节点正文](node.json) `SwitchRallyPointCategory.Execute`（98855）在 `0x1810f006b` 读取 `category` 黑板键，`0x1810f007d` 调用 `Blackboard.TryGetInt`。命中时取黑板值，否则取节点 `+0x10` 的 `_category`。`0x1810f00ad..bb` 按虚槽 242 派发。 |
| 写入与读取 | [分类原件](../unit-classification-20261114/identity/native.json) 记录虚槽 242、`RallyPoint.SwitchCategory`（78633）和 `Token.SwitchCategory`（78792）。前者在 `0x180aff492` 调用后者，后者在 `0x180aff685` 写入 `m_category`（`+0x584`）。[生命机制正文](../resource-mechanisms-20261114/life/native.json) 中 `RallyPoint.get_category`（78627）在 `0x180affa2c` 直接读取同一字段。 |
| 索敌消费 | [分类原件](../unit-classification-20261114/identity/native.json) 的 `TargetOptions.VerifyTarget`（76369）在 `0x180a40a5e..71` 将 `targetCategory` 传给 `BattleUtil.VerifyTarget`（79605）。[索敌正文](../targeting-pipeline-20261109/qualification-mechanisms.json) 在 `0x180b438be..ce` 通过虚槽 49 读取目标类别并检查掩码交集。 |

客户端 DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。内容 Bundle 的路径、指纹、PathID 和 MonoScript 绑定见复用原件。配置、客户端普通分支与[豆苗的战术点说明](https://prts.wiki/w/豆苗)相符。本批未运行客户端或核对活跃 XLua。

## 实际查询方

| 内容 | 配置与消费 |
| --- | --- |
| 普通弩手的远程攻击 | [索敌 Prefab](../targeting-pipeline-20261109/content/selected-prefabs.json) 的 `/result/267` 为 `enemy_1003_ncbow` 的远程攻击 Trigger，`_targetCategory=1`。 |
| 齐尔查克的环境免伤光环 | [角色 Prefab](../resource-mechanisms-20261114/damage/operator-bindings.json) 的 `/result/components/282` 是启用该效果的 AuraAbility，引用 validator `-1845817763435871630`。同档 `280` 的 validator 使用 `targetCategory=3`、`targetSide=1`，并设置 `ignoreTargetFree` 和 `ignoreAllyTargetFree`。标准 `TargetValidator.Validate`（76974）转入 `TargetOptions.VerifyTarget` 或其跳过阵营检查的版本，两个入口都执行类别检查。实际天赋启用与效果见[伤害许可调查](../../cases/38-damage-classification-and-permissions.md)及[齐尔查克](https://prts.wiki/w/齐尔查克)。 |
| 无餍的废弃火灶处理 | [敌人 Prefab](../resource-mechanisms-20261114/life/content.json) 的 `/result/components/1363` 装配 `enemy_cjtaot_kill_cjbtow`，该[实际模板](consumer-templates.json)触发命名能力 `KillCjbtow`。同档 `1517` 的能力引用 `1524` 的 Selector，设置 `_targetCategory=2`、`_buffKey=trap_cjbtow[mark]`、`_limitTargetNum=1`、`_maxNum=1`，选中后执行 `instant_kill`。废弃火灶的[根组件记录](../card-policy-distribution-20261102/controllers.json)为 `/controllers/398`，`_category=2`。玩法说明见[无餍](https://prts.wiki/w/无餍)。 |

普通 Selector 的类别从 `RangeSelector.Reset`（76187）建立的选项进入范围资格检查。齐尔查克的 validator 路径和 Selector 的配置转换正文均已保留在[索敌资格原件](../targeting-pipeline-20261109/qualification.json)。这些绑定确认了普通攻击、扩大到装置的光环及专查装置的能力。它们没有覆盖任意查询对豆苗战术点的其他资格条件。

## 两种形态的分类查询

| 查询 | 原件与定位 |
| --- | --- |
| 类、职业与筛选标签 | [磐蟹角色资料](bean-character.json) 是固定镜像中的 `TOKEN` 记录，主要及附加组织归属为空。[生命机制内容](../resource-mechanisms-20261114/life/content.json) 的根组件 `/result/components/1812` 保存两个模式 PPtr 和 `_filterTag.Array=[]`。[类型和槽位](bean-type-evidence.json) 说明 `RallyPoint` 继承 `Trap`，而 `Trap` 继承 `Token`。虚槽 101 由 `Trap.CheckHasFilterTag`（78846）实现，见[标签正文](../unit-classification-20261114/tags/tag-bodies.json)。`BattleUtil.CheckEntityUnitType`（79594）类检查见[分类原件](../unit-classification-20261114/identity/native.json)。 |
| 豆苗 S1 | [角色绑定](../resource-mechanisms-20261114/life/static-bindings.json) 的 `/result/characters/10` 绑定 `skchr_bstalk_1`。其 [Prefab 原件](bean-s1-prefab.json) 的 CastSkill 和挂载 `bstalk_s_1` 的 AnimatedActionToOwnerAbility 分别为 `532514189762625254` 和 `1624118544394157798`，同属一个 GameObject。`CheckFirstRallyPointMode.Execute`（101218）在 `0x1811b6011` 调 `Character.FetchTokenOrHost`，找到首个 RallyPoint 后于 `0x1811b60e2` 查 `get_inRallyPointMode`。后者在[生命机制正文](../resource-mechanisms-20261114/life/native.json)（78625）的 `0x180affd2b` 读 `m_category`，比较 `TRAP_OR_ITEM=2`。[S1 模板](bean-s1-template.json) 成功分支向所属 Token 创建触发 `crab_switch` 的 Buff，失败分支为 `HealToken`。玩法描述见[豆苗 S1](https://prts.wiki/w/豆苗#技能)。 |
| 装置类别对照 | [禁闭所摘录](../unit-classification-composition-20261118/native/selected-evidence.json) 保存 `trap_317_ubprison` 的 Trap 组件，类别值为 `1`。[战术射击平台](../../../../test/fixtures/arknights/prefab_trap_1106_achplat.json) 与[战术装备整理箱](../../../../test/fixtures/arknights/prefab_trap_1105_accrate.json) 的 `/components/0/fields/_category` 分别为 `2` 和 `4`。 |

两种形态的类筛选和标签查询由同一个根对象处理。这里已核的是普通客户端分支与该实例的配置，未运行双方形态下所有外部职业、标签及索敌消费者。

## 复跑

从仓库根目录读取相同指纹的本机客户端。第一条命令重提节点正文，第二条命令用既有字符串定位逻辑复核 `0x1810f006b` 的 metadata 字面量。

```sh
work=.cache/native-research/entity-category-20261118/replay
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py --out "$work/body.json" disasm 98855
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/unit-classification-20261114/identity/extract.py --out "$work/literals.json" --body 98855
python docs/research/evidence/entity-category-20261118/extract_consumer_templates.py --out "$work/consumer-templates.json"
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/facing-semantics-20261113/extract.py --out "$work/bean-native.json" --body Torappu.Battle.Action.Nodes/CheckFirstRallyPointMode.Execute
decoder=docs/research/evidence/healing-settlement-20261103/content/extract_content.py
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline "$decoder" --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out "$work/bean-prefab" --bundle 'battle/prefabs/[uc]skills.ab' --object 532514189762625254 --object 1624118544394157798
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline "$decoder" --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out "$work/bean-template" --bundle config/buff_template_holder.ab --template bstalk_s_1
```

继承关系及声明槽位可用 `native.py type` 分别查询 `Torappu.Battle.RallyPoint`、`Trap`、`Token` 和 `Character`，再匹配各条 `parentIndex` 与对应类型的 `index`。磐蟹角色表的投影与输入指纹见 [bean-character.json](bean-character.json)。
