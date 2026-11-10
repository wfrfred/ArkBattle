# 敌人技能配置与实际资源绑定

2026-11-10。结论来自 `bindings.json`：三项精确 Actor、当前已安装 Prefab 及固定镜像 EnemyDB；不以 `skills[]` 数量推导同时启用，不把配置绑定等同实机观测。

## 来源与复跑

- 当前客户端资源：`battle/enm_pfb_28.ab`（炎佑）、`battle/enm_pfb_17.ab`（霜星）、`battle/enm_pfb_3.ab`（圣堂射手），外部 MonoScript 包 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`。各 Bundle、选中对象、外部脚本身份及读取工具的哈希均在 JSON provenance 中。
- EnemyDB 镜像：`Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，`zh_CN/gamedata/levels/enemydata/enemy_database.json`，Git blob `62ab806926b9c8ca5c80524730caf0066f6c2c2f`；脚本验证原始 SHA256。该镜像提交时间早于当前客户端调查，不宣称它代表所有最新热更新数值。
- 主线 4-10：相同固定修订的 `obt/main/level_main_04-10.json`，原始字节与既有 Git 核验清单对照相同；`enemyDbRefs` 选择霜星 level 0，`/waves/0/fragments/0/actions/1` 是 count=1、routeIndex=1 的实际 SPAWN。首项 DISPLAY_ENEMY_INFO 不计作出生。

仓库根目录运行：

```sh
python3 docs/research/evidence/enemy-skill-semantics-20261110/content/extract_bindings.py --out .cache/native-research/enemy-skill-semantics-20261110/replay/content/bindings.json
```

脚本复用既有 UnityFS／SerializedFile／type-tree 读器；不修改共享工具。GameObject 层级来自真实 Transform 父引用，MonoScript 身份按 SerializedFile 的外部 PPtr 解析。Skill 与 Ability 的同 GameObject 配对、Trigger 直接引用及 Mode root 引用均保留。

## 原始参数与绑定

下表为 EnemyDB level 0，时间单位为原始秒。冷却、优先级、SP 消耗是 EnemySkill 参数；Ability 的动画、施放周期和输出配置另存于同对象的具体 Ability。

| Actor | Skill key | 首次 / 后续冷却 | priority / spCost | 当前资源绑定 |
| --- | --- | --- | --- | --- |
| 炎佑 `enemy_9012_acloon` | Skill | 15 / 15 | 0 / 0 | Mode `1` 的 Body/Skills；同对象 `RangedAttack`，Trigger 引用为空 |
| 同上 | Skill_2 | 15 / 15 | 0 / 0 | Mode `2` 的 Body/Skills；同对象 `RangedAttack`，Trigger 引用为空 |
| 霜星 `enemy_1505_frstar` | ArcticBlast | 8.5 / 8.5 | 1 / 0 | 根 Skills；同对象 `RangedAttack`，直接绑定 `SelectorTrigger` |
| 同上 | IceShield | 30 / 30 | 2 / 0 | 根 Skills；同对象 `SpawnTokenOnTileAbility`，直接绑定 `TileTrigger` |
| 圣堂射手 `enemy_10088_hlsnip` | AddBullet | 0 / 0 | 0 / 0 | Default 模式 Body/Skills；`EmptyAnimatedAbility`、`NeverTrigger`、`BuffToOwner` |
| 同上 | Sniping | 5 / 0 | 1 / 1 | 同一 Default 模式 Body/Skills；`RangedAttack`、`SelectorTrigger`、`BuffAfterAffecting` |

### 炎佑：纠正此前例证

当前 Enemy root 的 `_modes` 依次引用 Default、1、2；两个 EnemySkill 分别位于 Mode 1 和 Mode 2，不能用 EnemyDB 有两条记录证明同一模式同时拥有两个可自动选用的技能。两条实际执行内容都是 `RangedAttack`，挂有不同模板 `acloon_s_1` / `acloon_s_2`。本批不追踪使装置切模式的全部天赋／Buff 条件。它是 Enemy 模型的装置，不作为普通敌方 Boss 的正例。

### 霜星：普通主线的两项技能正例

root `_modes` 只有 Default，两项 EnemySkill 均位于 root/Skills，不分别藏在互斥 Mode 下；它们具有各自可用 Trigger 和输出 Ability。IceShield 的 Ability 明确生成 `trap_004_iceblock`；ArcticBlast 明确发射 `projectile_frstar_s1` 并配置自己的施放前延迟。结合主线 4-10 的实际 SPAWN，该 Actor 不只是存在于资源库中的未用模板。

这证明同一真实敌人确有两个独立配置的技能入口；是否当前能发动仍由原生选择、资格与计时检查决定，不证明两个施放可同时执行。

### 圣堂射手：SP 与动作组合

Actor 的 `spData` 为 TIME，maxSp=1、initSp=1、increment=0；Sniping 的 spCost=1。root `_showSpAsBulletMode=true`。AddBullet 的 `BuffToOwner` 配置 `hlsnip_s1[add_sp]`，Sniping 的 `BuffAfterAffecting` 配置延迟标记 `hlsnip_s2[delay_add_bullet]`。这些是原生内容明确把 SP 当作弹药样式资源使用的配置依据。

AddBullet 是 `NeverTrigger`，本批没有闭合它的外部触发模板，因此不把它计作自动选择器中的第二个可选招式，也不宣称已经还原完整装填周期。本批未补其关卡 SPAWN 正例；它只用于已绑定非零 SP 消耗与具体 Ability 的内容样本。SP 余额由谁持有、何时扣除，以同批原生调用证据为准，不能从这张表推成每个技能各有一条 SP 槽。

## 证据限制

- 未执行官方客户端、XLua 或运行时热更新。
- Prefab 组件存在、模式归属、直接引用和具体输出均可追溯；运行时附着、暂停、支付与结束仍依赖原生方法链。
- 原始数据时间不直接等于项目 Action 的攻击间隔，也不直接决定项目应采用何种 Capability。
- 嵌套 Buff 内不属于本题的枚举、字符串与字段不作新语义解释；原始对象哈希及所复用读器可用于定向重提。
