# 部署先后与最后部署的具体消费者

2026-11-22 查阅原生配置镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 及本机 Windows 客户端。DLL 指纹前缀 `cf7956bf`，metadata 指纹前缀 `e58fb854`。所列方法对应当前安装版本的静态分支。

| 消费者 | 配置、执行和数据依赖 |
| --- | --- |
| 萨卡兹的无终奇语藏品「罗德之门」 | `rogue_4_relic_explore_8` 装入职业过滤的全局 Buff `rogue_4_log_final_locate`，并登记 `env_022_ro4dlc2_log_final_deploy` 与结算事件 `rogue_last_deploy`。Environment Prefab 绑定了处于启用状态的 `Rogue4DLC2LastDeployManager`。该 Buff 的 `ON_OWNER_BORN` 排除 `MOVE_LIKE_RESPAWN_SELF`，检查 Character，向 ROGUELIKE Global Blackboard 增加计数并写入这次 Card UID 的字符串。 `AddGlobalBlackboard.Execute #98976` 数值分支读取旧值再累加（`0x1810dbac2–0x1810dbafb`），字符串分支直接以新值 Assign（`0x1810dbb02–0x1810dbb3f`）。`Rogue4DLC2LastDeployManager._OnGameOver #70902` 读取正计数和单个 `unique_id` 字符串（`0x1808aa2d1–0x1808aa342`），用 `Convert.ToUInt32`、`TryGetPlayerIdByUniqueId` 换算为有效玩家干员 ID，再写结算记录（`0x1808aa361–0x1808aa424`）。此路径保存最近一次的 Card 身份，消费者没有查询在场单位或遍历历史。PRTS 记录已撤退仍可命中，若记录对象已被敌方「门」带走，不会自动递补。 [PRTS 罗德之门](https://prts.wiki/w/罗德之门) · [想象实体图鉴](https://prts.wiki/w/萨卡兹的无终奇语/想象实体图鉴#罗德之门) |
| 萨卡兹的无终奇语敌方「门」 | `skzcy_t[first_step]` 的 `ON_OWNER_KILLED` 调用本体上 `JustSelector`，向选中的目标安装 `skzcy_t[ban_card]`。后者依次执行卡牌限制、外部结算记录和强制击倒的节点。PRTS 记录候选是当前场上符合筛选且最后出现的对象，排除心烛。无职业的敌人类单位可能因选择器规则进入候选，但成功锁定卡牌才有后续击倒。选择器的排序字段和同值规则未从 prefab 独立解码。 [PRTS “门”](https://prts.wiki/w/“门”) |
| 岁的界园志异通宝「分久必合」 | `rogue_5_copper_buff_E_05_a` 为取出通宝配置 `rogue_5_last_character_get_buff`。该 Buff 在 `ON_BUFF_START` 给除自身外的合资格在场我方干员施加瞬时清理 Buff，后者通过 `FinishBuffsById` 清除同一全局效果。随后在自身执行初始 SP 修改。PRTS 记录干员登场就获得该效果，其他持有效果的干员同时失去，即使孤立亦能清除。其增益换手路径未读取部署记录。 [PRTS 通宝](https://prts.wiki/w/通宝#分久必合) |
| 菲亚梅塔 ISW-α | `uniequip_004_phenxi` 明确读取当前最后部署的另一名干员的攻击范围。PRTS 记录它在释放 S2 或执行适用攻击时取在场候选。固定 Buff 表里 `CacheOrAssignLatestDeployedAllyCharacter` 的三个引用均使用菲亚梅塔的 `anchor_uid_key`，分别属于 `phenxi_echo_buff` 的 `ON_ABILITY_SPELL_ON`／`ON_BUFF_TRIGGER` 和 `phenxi_echo_buff[modify]` 的 `ON_BUFF_TRIGGER`。`CacheOrAssignLatestDeployedAllyCharacter.Execute #102293` 调用 `Nodes._TryGetLatestDeployedAllyCharacter #97351`（`0x1811f8adf`），并可将取得的身份保存到内容 Blackboard（`0x1811f8b09`）。该 helper 枚举 UnitManager 当前集合，排除自己、Token 及不同阵营，在 `0x18107bab4` 用 `FP.CompareTo` 严格取较新的候选。独立的 `LatestDeployedAllyAttackRangeSelector._TryGetLatestDeployedAllyCharacter #76071` 也在原件中。这个 Selector 组件的实例绑定于 `charpack/char_300_phenxi.ab` 中的 Selector GameObject。 [PRTS 菲亚梅塔](https://prts.wiki/w/烈火爆炸狂) |

社区资料还明确记载两个常规支线的在场排序样本。AD-5 的摄影机实时选择相邻且朝向自己的最后部署干员。BB-8 的接驳地块部署时，在范围内选最后部署且锁链有余量的在场干员。原表中另有焰狐龙梓兰的「上次部署位置」描述，PRTS 将它解释为自身离场时留下的持续弹道覆盖区，直至自己再次部署或重设。以上三例的具体 prefab 程序未核对。 [AD-5](https://prts.wiki/w/AD-5_终将重逢) · [BB-8](https://prts.wiki/w/BB-8) · [焰狐龙梓兰](https://m.prts.wiki/w/焰狐龙梓兰)

固定 `excel` 和 `battle` JSON 中，按下列描述词扫描，关于「紧邻的上一名部署干员」的直接命中全部对应耀骑士临光的技能、天赋和模组记录。「最后部署」还命中菲亚梅塔、集成战略条目以及仅见于保全派驻 LT-6 的敌方「绝对安保」试做型。配置字面检索覆盖显式描述词与列明的节点，无法穷举同义词、未标注语义、Prefab、动态调用和在线热更。 [绝对安保试做型](https://prts.wiki/w/“绝对安保”试做型) · [LT-6](https://prts.wiki/w/LT-6_特别顾客)

## 原件与复查

[配置指针与摘录](config.json)、[部署相关方法](native.json)、[方法及字符串标注](native-annotated.txt)、[Blackboard 原件](blackboard.json) 、[Blackboard 指令标注](blackboard-annotated.txt)与 [Prefab 绑定](prefab.json)。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research/scripts
gameData=assets/arknights-game-data/zh_CN/gamedata
uv run --offline "$skill/native.py" --out /tmp/ark-deployment-order-methods.json disasm 70901 70902 70903 97351 102293 76071
uv run --offline "$skill/native.py" --out /tmp/ark-deployment-order-blackboard.json disasm 98976 65920 65921 65922 65925
uv run --offline "$skill/config.py" "$gameData/battle/buff_template_data.json" --out /tmp/ark-deployment-order-node-references.json find --contains CacheOrAssignLatestDeployedAllyCharacter
python docs/research/evidence/deployment-order-consumers-20261122/prefab_bindings.py > /tmp/ark-deployment-order-prefab.json
rg -n '上一名部署干员|前一名部署干员|上一个部署的干员|上一个登场的干员|前[两三二]名部署|最后部署|最后出现的我方干员' "$gameData"/{excel,battle} -g '*.json'
```

其他配置条目可按 `config.json` 中的文件和指针用 `config.py select` 重提取。辅助标注脚本 `annotate.py` 使用 `uv run --offline --with capstone==5.0.7`，参数为上列方法索引，标注当前静态指令的直达目标与可解码的 IL2CPP 字符串引用。
