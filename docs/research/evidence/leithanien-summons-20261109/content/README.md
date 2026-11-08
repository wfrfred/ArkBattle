# 莱塔尼亚盟约召唤物：创建、Prefab 与阻挡

2026-11-09。只核对当前客户端的静态配置和普通 native 消费路径，不修改 Core 或确定 API。移动及 Trace 行为见[同批 movement](../movement/README.md)，本目录不重复其完整原件。

## 来源版本

- 更新清单 `Arknights_Data/PersistentData/Bundles/hot_update_list.json`：`versionId=26-11-06-12-42-25-70182449`，`manifestVersion=V079`，SHA-256 `5a7813f93442bfd2372d797de33e92c460d38e497ca1abc452fdb4987380c077`。
- 更新逻辑包 `battle/enm_pfb_36.ab`：SHA-256 `1df48c571e7e419e735e351d174c9345c502c8a694b31b464d7884fe3745033c`。
- 更新 `config/buff_template_holder.ab`：SHA-256 `2777f1a840acf9160e53f4413a850b355be468ea90ca3aa5ec01c81862d1e15d`。
- DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata v29、SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。代码版本与资源更新版本分别记录。

Prefab 与模板从以上实际文件重新提取，不以 `.cache/native-research/autochess-update-20261108/delta.json` 及其已缺失的旧生成脚本作为可复跑依赖。MonoScript 按 SerializedFile 的外部 PPtr 解析；所用脚本包位于基础安装 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`，完整指纹在 `prefabs.json`。

## 材料

| 文件 | 范围 |
| --- | --- |
| `prefabs.json` | `enemy_9025_aclts`、`enemy_9026_acltm` 两根及所有后代的 58 个 MonoBehaviour；完整解码、层级、对象指纹和实际 MonoScript 绑定，无未解析脚本。 |
| `templates.json` | 当前 holder 中 6 个莱塔尼亚盟约程序及两召唤物自身的持续损血／攻速光环程序；保留完整模板和已解析动作。 |
| `blocking-native.json` | 两个 Enemy 阻挡资格、掩码、模式和半径 getter，以及 BlockManager 的候选接收与 Tick；连续 `.pdata` 片段。 |
| `side-types.json` | 当前 metadata 的 SideTypeIndex、SideType、MotionMode 及压缩整数枚举值；不能把 index 与 mask 当同一数值体系。 |
| `block-constants.json` | 半径平方和默认缩放常量的精确 VA、原始字节及 float32 解码。脚本拒绝在不同 DLL 上套用这些地址。 |

`blocking-native.json` 复用已有通用方法提取器；其附带的 `relatedMethods` 是 EP 名称检索结果，本题不据此作结论。

## 创建与实际组件

[PRTS 盟约记录](https://prts.wiki/w/卫戍协议·规程/PRTS盟约记录)于 2026-11-09 查阅，描述敌方被击倒后召唤“一个小节”、强化后概率改为“一个乐部”。本地普通与强化召唤分支分别引用 `enemy_9025_aclts`、`enemy_9026_acltm`。这是社区描述与当前配置分支的对应；本批未取得新 EnemyData 的中文 name 字段。

当前 holder 的动作链为：

```text
act3autochess_bond_eff_lethania[enemy]，事件 4
  → 过滤 HP_ZERO / HP_ZERO_WITH_NO_SOURCE / FALLDOWN
  → 创建 act3autochess_bond_eff_lethania[summoner]
      → 检查盟约人数与当前召唤物数量上限
      → 求层数相关召唤概率
      → 强化条件与概率分支
          ├─ enemy_9026_acltm
          └─ enemy_9025_aclts
      → SummonEnemyWithRuntimeRoute
      → 为新单位附加 act3autochess_bond_eff_lethania[summoned]
```

两分支均明确配置 `motionMode=WALK`、`unharmful=true`、`alwaysCountAsKilled=false`、`waitTime=999`、`spawnOffset=0`、`summonOnNearestPassableTile=true`、`noEndPosition=true`。附加的 summoned 程序维护玩家所属召唤物计数并更新 ATK。强化盟约还包含我方死亡来源的同类召唤程序。

此动作节点的普通 native 消费与创建链复用[Route 创建原件](../../route-creation-20261107/origins/route-origins-bodies.json)：`Action.Nodes/SummonEnemyWithRuntimeRoute.Execute`（`0x1811ad060`）在 `0x1811ad87a` 调用 `Scheduler.SpawnSummonedEnemyWithRuntimeRoute`，后者通过公共 Enemy 创建、初始化与出生流程执行，见[案例 14 第 6 节](../../../cases/14-route-definition-fields.md#6-路线创建与初始化2026-11-07-补核)。这里没有新增一套 Character 或 Token 创建路径。

两个 Prefab 的 SerializedFile 均为 `CAB-83405aaa933fd36a5751fc087ae0984f`：

| Prefab key | 根 Enemy PathID | 主要配置 |
| --- | --- | --- |
| `enemy_9025_aclts` | `1348064420560207857` | 一个普通 UnitMode，MeleeAttack，MoveController，EnemyTraceTargetByPriorityAbility |
| `enemy_9026_acltm` | `-881802608265815001` | 一个普通 UnitMode，RangedAttack，MoveController，EnemyTraceTargetByPriorityAbility，附加技能与攻速光环 |

两根实际脚本均为 `Torappu.Battle.Enemy`，不是根据 key 前缀推测。UnitMode 的 `_generalAbilities` 明确指向各自 Trace 组件，不只是在 Prefab 中孤立存在该类型。

## 阵营与阻挡

两根都声明 `_sideTypeIndex=0`、`_specificBlockMask=2`、`_blockVolume=1`、`_ignoreBlockMode=false`；没有非默认特殊阻挡条件。

- **阵营配置：** `SideTypeIndex.ALLY=0`；`SideType.ALLY=1`，`SideType.ENEMY=2`。因此 Prefab 使用我方阵营 index，而阻挡掩码针对敌方阵营。索引 0 不能误读为 SideType.NONE，mask 2 也不能用来反推阻挡者自己是 ENEMY。
- **作为阻挡者：** `Enemy.get_canBlockEnemies` 在 `0x180aca8c7` 判断 `_specificBlockMask`（native `+0x348`）非零；`get_blockSideMask` 在 `0x180aca577` 返回同字段。两者由当前 Prefab 确实启用了普通 Enemy BlockManager 路径，不再只是旧样本中的未启用接口。
- **阻挡目标：** `BlockManager._CheckBlockable` 仍要求候选可转换为 Enemy；`0x180aef188–0x180aef192` 将候选 side 与阻挡者 mask 比较，然后调用候选 `Enemy.CheckBlockable`。阵营、存活、战斗能力、BlockFree、空地、特殊条件和剩余容量仍各有检查。
- **模式与半径：** `get_blockMode` 在 `0x180aca461` 返回自身 `changeableMotionMode`；召唤请求使用 WALK。WALK 分支基础半径约为 `0.7071`（平方 `0.4999903738498688`），FLY 分支约 `0.8944`（平方 `0.7999513745307922`），默认缩放 `1`。这是 getter 的基础规则，不表示后续所有属性修正或状态变化都被禁止；两单位 MoveController 的半身宽 `0.2` 不是阻挡半径。
- **容量未知：** `_blockVolume=1` 描述自身被挡时占用的体积，不是能挡几人的容量。实际 blockCnt、moveSpeed 及新 EnemyData／关卡覆盖尚未取得，见[同批 Data 缺口](../data/README.md)，不从 mask 或攻击数量猜数值。

### 不能据此断言实际双重关系

`Enemy.CheckBlockableWithoutCheckRange`（`0x180ab9f30`）没有因 `canBlockEnemies=true` 直接排除目标；它检查 alive、hasCombat（虚 slot 149）、BlockFree、运动方式及特殊条件。两者仍是 Enemy，不能将项目的角色互斥设计当成原生入口的限制。

但 `_blockVolume=1` 和存在被挡接收代码也不能证明本次内容实际同时建立入向与出向关系。候选还必须满足阻挡者允许的阵营掩码；普通 Character 的 ENEMY 掩码不会因此选择这些 ALLY 召唤物。本批没有闭合能阻挡它们的实际另一方及同时成立的双向关系，也没有现场运行记录。

Enemy 的自主移动、取得阻挡目标后的战斗状态及关系维持必须结合 MoveState 和 Trace 消费链判断，不能仅凭 `_specificBlockMask` 非零就称作“边走边保持普通干员式阻挡”，相关正例与边界归[同批 movement](../movement/README.md)。本次 `BlockManager.Tick`（`0x180aeebd0`）只推进内部 PeriodicTicker，不以当前双方距离逐项重建关系；不能据移动坐标变化自行补出一条距离释放政策。

## 复跑

从仓库根目录执行，核对上述版本后输出到独立目录：

```sh
python3 docs/research/evidence/leithanien-summons-20261109/content/extract_prefabs.py \
  --out .cache/native-research/leithanien-replay/content/prefabs.json
python3 docs/research/evidence/leithanien-summons-20261109/content/extract_templates.py \
  --out .cache/native-research/leithanien-replay/content/templates.json
python3 docs/research/evidence/leithanien-summons-20261109/content/extract_side_types.py \
  --out .cache/native-research/leithanien-replay/content/side-types.json
python3 docs/research/evidence/leithanien-summons-20261109/content/read_block_constants.py \
  --out .cache/native-research/leithanien-replay/content/block-constants.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/leithanien-replay/content/blocking-native.json \
  --method Torappu.Battle.Enemy.get_canBlockEnemies \
  --method Torappu.Battle.Enemy.get_blockSideMask \
  --method Torappu.Battle.Enemy.get_blockRadiusSquare \
  --method Torappu.Battle.Enemy.get_blockMode \
  --method Torappu.Battle.Enemy.get_defaultBlockRadiusScale \
  --method Torappu.Battle.Enemy.CheckBlockable \
  --method Torappu.Battle.Enemy.CheckBlockableWithoutCheckRange \
  --method Torappu.Battle.BlockManager._CheckBlockable \
  --method Torappu.Battle.BlockManager.Tick
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/leithanien-summons-20261109/content
```

未运行游戏、验证活跃 XLua 或穷尽其它盟约、装备及动态属性影响。当前配置存在与所列绑定、原生普通方法的可执行链、某场作战中已经发生，是不同证据等级。本批未重新展开 GameMode 从活动盟约记录安装起始 Buff 的全部入口；PRTS 的盟约条件与 holder 中相应程序不冒称实机观察。旧资源里 `_specificBlockMask` 全为零的扫描结论不能继续代表本次新增资源。
