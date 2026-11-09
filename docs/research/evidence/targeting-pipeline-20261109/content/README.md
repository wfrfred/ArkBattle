# Targeting：内容配置与医师 Filter 证据

采集日期：2026-11-09。机制结论统一维护在本批对应案例；本目录保存配置来源、引用、方法、复跑入口与限制。

## 来源与范围

- 本机 Windows x64 客户端，metadata v29。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。完整路径、大小与方法定位见 `healing-filters.json.provenance`。
- Prefab 来自 `Arknights_Data/StreamingAssets/AB/Windows`。选择 14 份 Character Bundle、`battle/enm_pfb_base_0.ab` 的弩手，以及 shared skills 的具名组件。精确 Bundle SHA-256、SerializedFile、PathID、组件原始字节 SHA-256、层级与 MonoScript PPtr 保存在 `selected-prefabs.json`。
- 所选外部 MonoScript 均按引用的 SerializedFile + PathID 解到本机 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin` 的真实 MonoScript，而非按字段猜类名。旧资料中的另一个匿名包若不在本机，不作为必需来源；本次所有保留组件的脚本引用均已解析。
- 公共 Data 镜像固定为 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`。复用 [原批 Git blob 验证](../../route-operations-20261107/data-source-verification.json)，重新比较完整 `character_table.json`、`skill_table.json` 的原始字节 SHA-256，再摘录角色与技能绑定。镜像不是官方文档。

## 文件

| 文件 | 内容 |
| --- | --- |
| `extract_content.py` | 使用归档的 type-tree reader、共享 UnityFS 工具读取本机资源；独立按字段类型解码，`common:928` 保留原始 byte 值，不把多值 enum 压成 bool。 |
| `selected-prefabs.json` | 精选目标相关字段、原始对象身份与哈希、完整所需局部 PPtr。`survey` 记录 shared skills 内 1328 个含所查目标字段的组件及非默认值分布；计数对象是组件，不是已激活能力或全游戏 Selector。 |
| `extract_data.py`、`selected-data.json` | 固定镜像的角色→技能／天赋、技能→Prefab、Blackboard 摘录；包括所选 shared skill 的实际角色绑定。 |
| `extract_healing_filters.py`、`.lock` | 按本次完整方法名定位并提取 HP、混合 HP／EP Filter、资源 getter、Heal 的 Purpose 与节点构造；同时保存 Heal／RangedHeal／MultiMeleeAttack 声明方法及字段。 |
| `healing-filters.json` | 方法签名、index／VA、完整连续 `.pdata` 分段、常量读取、Entity slot80／81 绑定与客户端指纹。 |
| `validator-methods.json`、`validator-composition.json` | 使用根目录已冻结的 `extract_qualification.py` 提取组合 Selector、Character Validator、来源 Buff 验证与虚调用 thunk；类型字段、签名、完整方法分段及本次客户端指纹一并保存。 |
| `extract_validator_config.py`、`validator-config.json` | 补取粗投影未完整保留的冻河 S3 CastSkill 登记、EmptyAbility 别名和 GroupSelector 原始组件、实际外部 MonoScript 及精确子选择器引用；按本次 metadata 解出 SkillType 常量。旧 `selected-prefabs.json` 不改写。 |

`selected-prefabs.json` 是选定字段摘录，不是完整 Prefab 重新序列化。Buff 摘录保留属性、机制键、模板、Blackboard 与所需生命期字段，省略无关特效和序列化默认项。`objectSha256` 针对完整原始组件字节；Bundle 哈希单独记在 provenance.sources.sha256，二者不能混用。`selected-data.json` 的 phases 只保留 Prefab 与 range 引用，完整输入文件指纹另列。

## 复跑

在仓库根目录执行，输出到空目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
work=.cache/native-research/targeting-content-replay
batch=docs/research/evidence/targeting-pipeline-20261109/content
uv run --offline "$batch/extract_content.py" --game "$game" --out "$work"
uv run --offline "$batch/extract_data.py" \
    --data .cache/native-research/route-operations-20261107/data --out "$work"
uv run --locked --offline "$batch/extract_healing_filters.py" --game "$game" --out "$work"
uv run --locked --offline "$batch/../extract_qualification.py" --game "$game" \
    --out "$work/validator-composition.json" --methods-file "$batch/validator-methods.json" \
    --type Torappu.Battle.AdvancedSelectorWithValidatorFilter \
    --type Torappu.Battle.AdvancedCharacterValidator \
    --type Torappu.Battle.ParallelGroupSelector --type Torappu.Battle.GroupSelector \
    --type Torappu.Battle.BasicSkill --type Torappu.SkillData \
    --type Torappu.Battle.BattleCharacterData --type Torappu.SkillType \
    --address 0x180005480 --address 0x180013660
uv run --offline "$batch/extract_validator_config.py" --game "$game" \
    --contracts "$work/validator-composition.json" --out "$work/validator-config.json"
```

Data 输入目录可替换。缺少原表时，从上述固定提交的 `zh_CN/gamedata/excel/character_table.json`、`skill_table.json` 取得原始文件；脚本会按原批已经验证的字节哈希拒绝不同输入。`extract_data.py` 依赖同一输出目录中刚生成的 `selected-prefabs.json`，据此摘录真实角色绑定。

已有 Case 19 的睡眠免疫、鼓舞 marker 与 Case 21 的 Motion Target Free Buff 仍复用其原始证据；本批重新读取相应 Selector、Aura、Validator 和角色引用，不重复归档整份旧 Buff Holder。

组合配置的补充读取使用本目录新脚本，不改变粗投影脚本或原 JSON。冻河的组组件解到 `Torappu.Battle.GroupSelector`；赤刃明霄陈 S2 的组组件则是 `ParallelGroupSelector`，以外部脚本身份分别记录。两个固定 helper 地址只适用于上述客户端指纹，根提取器在有 `--address` 时检查该前提；不把它们当作跨客户端的定位入口。

## 限制

只读静态资源与 native fallback，没有运行完整客户端、测量实机帧序或验证活跃 XLua。Hierarchy 中存在组件、数据表引用了 Prefab、Mode 当前实际执行，是不同层次的事实；报告依据具体入口说明，不把 survey 命中当作能力实际激活。只检查所列包及字段，不从本次零命中推出全游戏没有该分支。

Horn S1 的 hook key 声明、当前技能 Blackboard 的实际键值分别保存，不能仅凭声明推定发生覆盖；其外部模块或玩法注入仍须单独闭合。方法分段的 `fullyDecoded` 仅表示已选代码区间解码完整，不表示已执行该分支。
