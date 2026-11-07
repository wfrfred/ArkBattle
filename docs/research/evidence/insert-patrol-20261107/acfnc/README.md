# acfnc 插点候选的内容来源与作用范围

2026-11-07。定向核对 `acfnc[insert-cp]` 能否提供“实际内容在普通巡逻路线中间插点”的正例。只归档既有模板、其直接父程序和所选安装资源搜索；不修改 Core 或既有案例。

## 来源与复跑

`resources.json` 保存当前安装的 `config/buff_template_holder.ab` 指纹、SerializedFile、Holder PathID、对象 SHA-256 和三项完整原 SerializedState／解析后动作。Holder SHA-256 为 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`，与 Route 前批一致。

同时搜索本机 `battle/enm_pfb_*.ab`：38 个 Bundle、38 个 SerializedFile、53,528 个 MonoBehaviour、51,938 个 GameObject 的原始对象 UTF-8 字节，`acfnc` 零命中。每个 Bundle 保存完整 SHA-256／bytes；这是有限范围搜索，不证明其他资源、动态构造或未来版本不存在。

```sh
python3 docs/research/evidence/insert-patrol-20261107/acfnc/extract_acfnc.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/insert-patrol-replay/acfnc/resources.json
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/insert-patrol-20261107/acfnc
```

脚本使用共享 UnityFS／SerializedFile 解析和已归档 type-tree reader；输出保存专用脚本与依赖的身份。

## 实际取得的内容链

完整 Holder 的字面引用搜索找到两个父程序；这不覆盖运行时拼接 key、其他资源和 XLua：

| 父模板 | 配置动作 | `acfnc[insert-cp]` 的宿主 |
| --- | --- | --- |
| `acfnc_t1`，模板索引 4182，事件 21 | `SummonEnemiesWithRuntimeNearestEndPointRoute`，`enemyKey=enemy_9028_acfncb`，`summonCount=1`，`buffs` 附加插点 Buff | 本次新召唤的 `enemy_9028_acfncb` |
| `acfnc[skill]`，索引 4189，事件 0 | `SummonEnemiesAverageOnTilesToNearestEndPoint`，相同 enemyKey，`buffsUseTargetAsSource` 附加插点 Buff | 本次新召唤的 `enemy_9028_acfncb`；原目标作为 Buff 来源 |

不是把插点 Buff 直接施加给场上任意被选中的旧敌人。父动作是否在当前内容真正装配、触发，仍需实体／关卡来源；本批没有找到对应的已启用 Prefab，不能仅凭这两个模板宣布已实际使用。

子模板索引 4190 按 `FilterGameMode(AUTOCHESS)` 分支：

- AUTOCHESS：默认 `branch_left=left_acfncb`、`branch_right=right_acfncb`；根据方向选一侧，**先**执行 `ModifyRuntimeRouteUseBranchRoute`，然后才插入普通 MOVE。插入目标是 `BUFF_OWNER`，位置来源是 `BUFF_SOURCE`。`clearRouteBeforeInsert=false`、手动 `insertIndex=0`、`reassignIndex=0`、`addIntoRuntimeRoute=false`、`checkReachable=true`。
- 其他模式：`clearRouteBeforeInsert=true`，插入／重分配索引走默认政策。

`ModifyRuntimeRouteUseBranchRoute` 的普通原生链在[既有调用原件](../../route-operations-20261107/content/caller-bodies.json)中：读取 Branch key／Action index → `Scheduler.TryGetEnemyRouteFromBranch` → `RouteData.Duplicate` → Map 生成运行时路线 → `Enemy.ReassignRoute`。因此 AUTOCHESS 中被保留的是这次先指定的 Branch Route，不应描述成“任意旧敌人当时的巡逻程序”。固定版本关卡／Branch 的搜索另见[父批扫描](../scan.json)。

## 对巡逻问题的证据限度

这三项模板没有形成“作用于普通已有 PATROL 路线”的内容正例：宿主是新召唤物；AUTOCHESS 先选 Branch Route且只在索引 0 插入 MOVE；非 AUTOCHESS 清空原程序。本次安装资源搜索与固定关卡搜索也没有闭合父模板的实际启用来源。

即使后续找到相应 Branch，其索引 0 插入本身也不会从中间切开旧的连续巡逻段：原有路点整体后移，原段成员与边界保持。此项是根据已核实原生巡逻后继规则作出的推导，不是游戏现场验证，也不代替审查其他插入位置。

未继续扩展未知 AG 分组、全体装备／盟约／Rune。不能把这里的未知启用状态写成“已删除”“从未使用”或“不属于支持玩法”的确定结论。
