# 多原点阻挡与规程召唤插点的内容核对

2026-11-22 读取基础 Windows Bundle 和本地已有热更新 `26-11-13-06-34-18-84612175`。Bundle、MonoScript、Prefab、模板和表格指纹位于各自 JSON 的 `provenance` 和包清单。基础原生方法引用原有批次。本次调查使用静态材料，没有执行客户端战斗或热更 XLua。

## GiantTrap 的实际配置

[giant-traps.json](giant-traps.json) 对基础安装的 123 包和本机缓存更新的 44 包逐一检查 `battle/enm_pfb_*.ab`、`pkgrps/btl_pfb_tokens_*.ab` 及 `battle/prefabs/levelprefabs/` 下的 `.ab`。匹配外部 MonoScript 的 SerializedFile 和 PathID，再核对组件类型树。基础安装有 11 个匹配组件，缓存更新无匹配。

11 个组件中，7 个的标识能在 `sandbox_perm_table` 的生息演算配置关联。四个非零基础阻挡数也均在其中，分别是“纪念” 50、风沙营垒 999、大型兽栏两型 20 和 1。另外四个通过 `activity_table /activity/HALFIDLE_VERIFY1/act1vhalfidle/trapMetaDict` 绑定到次生预案，已见属性关键帧均为零，组件均设置 `_alwaysBlockFreeOptimize=true`。精确配置键和所有包清单保存在结果内。[原生多原点距离实现](../blocking-native-20261023/modes/report.txt) · [PRTS 装置表](https://prts.wiki/w/装置一览)

检查范围包括所列组包和本地已有的更新。这一结果为多原点可从有阻挡容量的装置消费提供了模式关联，也限定了目前正例的范围。动态授予阻挡数、包外资源或额外版本有待对应内容支持；本批不从负结果推导全局不存在。

## 假想敌：械的召唤路线

[acfnc.json](acfnc.json) 连接 `battle/enm_pfb_36.ab` 的热更新 Prefab 与同更新 `config/buff_template_holder.ab` 的实际节点。两种 `enemy_9029_acfnc` 的 `Talents/Summon` 都挂 `PassiveBuffAbility`、模板 `acfnc_t1`，`Skills/SommonSquad` 的 `EnemySkill` 和 `BuffToCastTargets` 启用，后者挂 `acfnc[skill]`。两模板均召出 `enemy_9028_acfncb`，向新增实例提供 `acfnc[insert-cp]`，各自参数设 `_managedByScheduler=false`。当前 Holder 的模板索引为 4303、4310 和 4311。 [假想敌：械](https://prts.wiki/w/假想敌：械) · [量变之械](https://prts.wiki/w/量变之械)

`acfnc[insert-cp]` 的 `AUTOCHESS` 路径先按左右选 Branch，继而将一个非随机 MOVE 插入并从索引 0 开始执行。另一个模式分支先清空原程序。此处涉及的是新生实例的一条刚选定的路线，插在首位会把原路线整体后移。它没有利用同一实例已经消耗的巡逻或等待进度。当前仍未取得实际关卡的左右 Branch 原表，目标选择、技能次数和完整领袖流程不在本次取证内。[Branch 重绑原生流程](../route-operations-20261107/content/caller-bodies.json) · [先前模板补核](../insert-patrol-20261107/acfnc/README.md)

## 卫戍更新中的普通阻挡掩码

[hot-blockers.json](hot-blockers.json) 依各 Prefab 的完整序列化布局检查本机四个缓存在 `PersistentData/Bundles/battle` 的 `enm_pfb` 包。184 个含 `_specificBlockMask` 的控制器来自 7 种序列化类型。非零的只有 `enemy_9025_aclts`、`enemy_9026_acltm` 与 `enemy_9024_acsgnt`。三种对象的 `_sideTypeIndex=0`（ALLY）、`_specificBlockMask=2`（选择 ENEMY）、`_blockVolume=1`。在所扫样本中，另外没有可面向这些我方单位取得入向阻挡的 Enemy 掩码。这个结论限于当前已缓存的 Prefab 初值。 [双方阵营枚举与资格](../leithanien-summons-20261109/content/README.md#阵营与阻挡) · [不眠雪山身份](https://prts.wiki/w/“不眠雪山”)

## 复跑

从仓库根目录运行，可用 `--game` 指定本安装和对应热更新所在游戏目录。

```sh
python3 docs/research/evidence/spatial-content-20261122/extract_giant_traps.py --out /tmp/arkbattle-giant-traps.json
python3 docs/research/evidence/spatial-content-20261122/extract_acfnc.py --out /tmp/arkbattle-acfnc.json
python3 docs/research/evidence/spatial-content-20261122/extract_hot_blockers.py --out /tmp/arkbattle-hot-blockers.json
```
