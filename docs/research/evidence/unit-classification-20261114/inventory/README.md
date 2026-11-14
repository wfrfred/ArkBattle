# 分类轴定位与等级／攻击方式消费者

2026-11-14。机制结论集中在 [Case 36](../../../cases/36-unit-classification-and-combat-tags.md)。这是静态客户端调查，未运行游戏或核实活跃 XLua。

## 原件

- `extract.py`、`metadata.json`：按记录的名称模式扫描 Battle 元数据，定位分类轴、字段和方法。`Race` 排除 `Trace` 的名称误匹配；结果是定位清单，不是所有字段写入的穷尽证明。部分 UI／特殊模式类型仅是名称命中，不纳入本案机制范围。
- `level-applyway-bodies.json`：10 个方法身份、9 份逻辑方法正文；含 Enemy／Unit 攻击方式、Enemy 级别消费者和 BObject 的阵营字段访问。
- `data-details.json`：补充 EnemyData 布局、EnemyDB 重载、Ability 攻击方式及等级掩码消费者；10 个方法身份、6 份正文、6 个字段所有者。

两份正文使用已有 [extract.py](../../facing-semantics-20261113/extract.py)，覆盖下一方法前的 `.pdata` 分片；记录 `fullyDecoded`、代码指纹和调用目标。`Entity.get_allApplyWay`（67375）只有声明，没有可提取正文。输入 DLL／metadata、工具和脚本指纹在各文件 `provenance` 中。

## 关键读取

| 消费者 | 直接读取 |
| --- | --- |
| `CheckEnemyLevelType.Execute` 101575 | 当前 `Enemy.data.levelType`；`0x1811ce700` 取 data，`0x1811ce70d` 比较 `+0x60` |
| `CheckEnemyLevelMask.Execute` 101572 | 当前 `Enemy.data.levelType`；`0x1811ce4d3` 取 data，`0x1811ce4dd–4e2` 取级别作为移位位置测试掩码 |
| `Enemy.get_isBoss` 77658 → `EnemyData.get_isBoss` 32168 | `levelType == BOSS(2)`，不是另存一个 Boss 标志 |
| `Enemy.get_allApplyWay` 77593 | 当前 `Enemy.data.applyWay`（`+0x30`） |
| `Unit.get_allApplyWay` 78894 | `m_currentMode.allApplyWay`（Unit `+0x200`，Mode `+0xc0`），不是某一笔 Modifier 的方式；Unit 字段布局见同批 `identity/native.json` |
| `CheckEnemyApplyWay.Execute` 102473 | `EnemyDB.TryGet(Entity.id, 0, out data)` 后读 `applyWay`；`0x18120ac58 xor r8d,r8d` 明确 level=0，所调重载是 28322 |
| `FilterAbilityApplyWay.Execute` 101277 | Ability 虚属性槽 23 的 `applyWay`，再测试配置掩码；不是上述两种敌人数据查询 |

`EnemyData.applyWay`、`motion`、`enemyTags`、`levelType` 分别位于 `+0x30/+0x34/+0x38/+0x60`。字段相邻不表示语义相同。

普通原生 `Ability.get_applyWay` 返回 NONE；MeleeAttack 返回 MELEE(1)，RangedAttack 返回 RANGED(2)，Heal 返回 NONE(0)。这些 getter 都有独立热更新分支，普通分支不能代替运行中的热更新结果。

`BObject.side` 与 `playerSide` 分别保存于 `+0x1c/+0x20`。本批仅核布局和 side 普通 getter/setter；阵营变更的所有调用者没有穷尽。实现类与阵营独立的实际正例复用 [Case 32](../../../cases/32-leithanien-summons-blocking-and-movement.md)。

## 复跑

从仓库根目录执行，`--out` 改到独立缓存目录。依赖 `native.py`、Capstone 5.0.7 和记录指纹的客户端：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/unit-classification-20261114/inventory/extract.py --out .cache/native-research/unit-classification-recheck/inventory.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/unit-classification-recheck/level-applyway.json --body-index 67375 --body-index 77593 --body-index 78894 --body-index 79152 --body-index 77658 --body-index 102473 --body-index 101575 --body-index 101277 --body-index 65990 --body-index 65991 --owner Torappu.Battle.Enemy --owner Torappu.Battle.UnitMode --owner Torappu.Battle.BObject
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/unit-classification-recheck/data-details.json --owner Torappu.LevelData/EnemyData --owner Torappu.Battle.Ability --owner Torappu.Battle.UnitMode --owner Torappu.Battle.BObject --owner Torappu.Battle.Action.Nodes/CheckEnemyLevelMask --owner Torappu.Battle.Action.Nodes/CheckEnemyApplyWay --search Torappu.EnemyDB.TryGet --search Torappu.LevelData/EnemyData.get_isBoss --body Torappu.LevelData/EnemyData.get_isBoss --body-index 64000 --body-index 92334 --body-index 92819 --body-index 93050 --body-index 101572
```

选择器索引只适用于同指纹客户端。父批次清单提供所选方法的身份与重提计划；重提证明来源和静态代码一致，不证明 Content 在实机执行。
