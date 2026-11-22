# 普通关卡的战中召唤与调度等待

2026-11-22。证据绑定 FD-8／GA-6 的寻路者甜品商和主线 12-20 的变形者集群第一形态。结论、Core 对照和适用范围见[案例 30](../../cases/30-scheduler-action-data-fields.md#2026-11-22-补查战中召唤与本波最终等待)。

## 配置与 Prefab

[content.json](content.json) 保存 ArknightsGameData 固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 下的原始关卡出生项、EnemyDB 技能及天赋参数、BuffDB 事件操作以及 Unity 组件引用。文件与组件 SHA-256 见记录头及条目。两套来源分别固定，未视为同一版本的运行时录像。

| 来源 | 选择 |
| --- | --- |
| `levels/activities/act15mini/level_act15mini_08.json` | `/waves/0/fragments/0/actions/9` 实际安排 `enemy_1217_rescar`。第一波的 `maxTimeWaitingForNextWave=-1`，该关共三波。 |
| `levels/activities/act16side/level_act16side_06.json` | `/waves/0/fragments/0/actions/0`、`/waves/0/fragments/1/actions/0` 实际安排同一敌人，两项 count=1。 |
| `battle/enm_pfb_9.ab` / `CAB-d5c3740664210131f56a568859981fef` | Enemy `-3312300244513874879`。`Skills/BornCar` 下的 `BuffToOwner` `1826194474851408961` 绑定 `enemy_rescar_skill[summon]`；同一个 GameObject 的 `EnemySkill` 为 `1921009252554546241`。EnemyDB 的 `BornCar` 配置初始冷却 5、冷却 10、消耗 1。 |
| `levels/obt/main/level_main_12-18.json` | `/waves/0/fragments/0/actions/0` 安排 `enemy_1542_wdslm`。P1 普通召唤的天赋参数选择 `/branches/branch_2/phases/0/actions/0`。 |
| `battle/enm_pfb_18.ab` / `CAB-0df5f4c8c8dade07e2ee475a972da576` | Enemy `5624699378828557120`，P1 `UnitMode` `9068715731461847872`，P1 `P1SummonStand` `PassiveBuffAbility` `-4151659502025327808` 绑定 `enemy_wdslm[p1SummonTrigger]`。另存 `P1SummonHLevel` 作对照，第一道 Blackboard 条件要求 `hlevel_mark` 非零，本关的普通配置为零。 |

## 原生参数链

[native.json](native.json) 保存本轮新提取的指令、结构成员、解析的 Blackboard 字面项。来源为 Windows x64 客户端，IL2CPP 元数据 v29，加载基址 `0x180000000`。

- `GameAssembly.dll` SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat` SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

| 路径 | 复核位置 |
| --- | --- |
| `SummonEnemiesFollowMyRoute.Execute` → `Scheduler.SpawnSummonedEnemyTrackedInGameMode` | `0x1811a8218`、`0x1811a821f` 分别读取节点管理和波次开关，把两字节装入参数结构，`0x1811a86b4`／`0x1811a87cc` 调用结构参数重载。`0x18098135a–0x180981394` 保存参数到协程实例。 |
| `SpawnSummonedEnemyTrackedInGameMode` 的 `d__131.MoveNext` | `0x180989ed0`、`0x180989f0b` 读取宿主原路线与路线进度，`0x180989f64` 处理延迟。新单位的路线光标在 `0x18098a1aa` 设置进度，`0x18098a302`、`0x18098a308` 读取管理与波次开关，`0x18098a328`、`0x18098a347` 分别登记新实例。 [完整协程](../scheduler-general-20261107/lifecycle/Torappu.Battle.Scheduler_SpawnSummonedEnemyTrackedInGameModed__131.MoveNext-0x180989de0.txt) |
| `SummonEnemiesFollowBranchRoute.Execute` → `_SummonEnemy` → `SpawnSummonedEnemyWithBranchRoute` | 读取 `branch_id`、`action_index`、`enemy_key`。`0x1811a70cd` 固定 `dontBlockWave=true`，`0x1811a70ed–0x1811a70f1` 传结构成员 `_managedByScheduler`，`0x1811a7109` 调度出生。模板的分支游标仅用来选敌人和路线，`0x180981ad0` 把本次调用参数转交出生。 [分支入口原件](../scheduler-general-20261107/lifecycle/SpawnSummonedEnemyWithBranchRoute-0x1809818d0.txt) |
| bool 重载 `SpawnEnemyWithRoute` 的登记 | `0x180980cd4` 检查管理开关。管理为真、固定不阻波时跳过本波登记，在 `0x180980d1b` 加入最终集合。管理为假时两处均跳过；卫戍炎羁绊有实际内容对照。 [出生原件](../scheduler-general-20261107/lifecycle/SpawnEnemyWithRoute-0x180980b70.txt) |
| 等待消费 | `_DealWave.MoveNext` 在 `0x18098c936` 读本波最大等待，`0x18098ca08` 是无期限谓词等待。`_CheckWaveNotFinish` 在 `0x1809848f4` 读本波集合，`_CheckFinalNotFinish` 在 `0x1809846eb` 读最终集合。 [波次与最终等待原件](../scheduler-native-20261107/branch-bodies.json) |

本批核对固定内容实际使用的普通客户端分支。没有在客户端回放关卡，未对 XLua、逐帧唤醒行为或最终解除等待的运行时配置取值作推断。变形者集群第二形态的弹道召唤另有绑定，不能沿用第一形态的管理开关。[第二形态证据](../wdslm-ep-interrupt-20261122/README.md)

## 复跑

从仓库根目录执行，指定用于核对的客户端目录，输出到独立位置。

```sh
batch=docs/research/evidence/managed-summons-20261122
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --with 'capstone==5.0.7' python "$batch/extract.py" \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out /tmp/arkbattle-managed-summon-content.json \
    --native-out /tmp/arkbattle-managed-summon-native.json
```
