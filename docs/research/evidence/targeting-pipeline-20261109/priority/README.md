# 目标排序与仇恨来源原件

2026-11-09。属于 Targeting 通用调用链调查；机制结论集中维护在本批对应案例。这里只保存来源、方法锚点、复跑入口和证据限制。

## 来源与边界

Windows x64，IL2CPP metadata v29：

- `GameAssembly.dll` SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat` SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

与案例 27、31、32 所用客户端相同；按本次完整方法名重新定位，未套用早期 Blocking 调查的索引。没有运行游戏或验证活跃 XLua、派生类覆盖。Prefab 配置由同批 `content/` 提供；方法的存在不等于某个具体内容启用了该分支。

| 文件 | 范围 |
| --- | --- |
| `queries.json` | 本次精确方法名、指纹绑定的泛型代码区间、MethodRef 存储位置与常量选择。地址只对所列客户端有效。 |
| `extract_priority.py`、`.lock` | 导入共享 `native.py`，检查指纹，按查询生成下列原件；客户端变化时拒绝沿用地址。 |
| `native.json` | 所选普通方法至下一已知方法的连续 `.pdata` 片段；另保存从真实调用定位的闭合泛型 Filter、WeightedTarget、队列 Add、稳定排序、裁剪和随机 helper。原体保留指令、字节校验与分段边界。 |
| `fields.json` | 被选方法的当前字段与签名，绑定虚槽和状态读取。 |
| `types.json` | Route／Cursor 继承、Node 字段、WeightedTarget 开放泛型声明及 BattleController 静态字段。后者只取字段，不把全部 Controller API 纳入本轮范围。开放泛型的零字段偏移不用于解释闭合实例布局。 |
| `generic-bindings.json` | 从调用者加载的 encoded MethodRef 解出 MethodSpec 及闭合类型实参；确认 `Filter<Entity>`、`StableBubbleSort<Entity>`、`Shrink<Entity>`、`WeightedTarget<Entity>` 和队列登记的身份。共享地址本身不作为方法身份。 |
| `constants.json` | 原生公式及比较间距读取的实际 float 常量；保留 float 的实际表示值。 |
| `xrefs.json` | `Character.UpdateHatred` 的直接调用候选。正文使用的 BuildAt 与 OnAttributeDirty 已读取完整原体；零命中不证明没有虚调用或 XLua 调用者。 |

## 方法锚点

| 问题 | 当前方法与锚点 |
| --- | --- |
| 普通后置排序和最后嘲讽 | `AdvancedSelector.OnPostFilter` 75505，`0x1809f1630`；`0x1809f1894` 调普通 Filter，`0x1809f1922` 调另一个晚嘲讽流程。`FilterWithFilterByPriorCompFunc` 75921，`0x180a20d20`，先 Filter，再稳定排序，再 Shrink。 |
| 二次优先 | `SecondaryFilterAdvancedSelector.OnPostFilter` 76207，`0x180a3b940`：`0x180a3ba89` 基础过滤排序，`0x180a3bc62/77` 交换，`0x180a3bd4c` 可选稳定嘲讽排序，`0x180a3bd80` 最后裁剪。`_CheckSecondFilter` 76209 保存实际分派。 |
| 阻挡对象加前与范围补入 | `BlockedOrAdvancedSelector.DoFindTargets_DISPOSE` 75741，`0x180a15f50`：`0x180a162e8` 对阻挡对象调用本 Selector 的 ValidateTarget，`0x180a1633a` 先追加，未满才于 `0x180a1636a` 调范围分支。 |
| 数量与有效阻挡数 | `get_maxTargetNum` 75482 读取 `m_maxTargetNum`；`BattleUtil.LimitMaxNumToBlockCnt` 79621，`0x180b42a30`。Prefab 初值与 Blackboard 更新源见同批 `AdvancedSelector.SetData` 75503。 |
| 普通 Filter 委托与权重 | `FilterUtil.Filter` 75920，`0x180a212c0`；一权重 `Filter<Entity>` `0x1846f8270–0x1846f8870`，双权重 `0x1846f8870–0x1846f8e90`。资格失败在入队前跳过；超额逐次裁队尾。 |
| 权重比较 | 队列 Add `0x1853ff430` 在 `0x1853ff544` 调闭合 WeightedTarget 比较；比较选录 `0x185795910–0x1857962a0` 包含普通分支和重载尾段；Entity.CompareTo 67718，`0x180722b30`。 |
| 最后嘲讽比较 | `_CompareEntityTauntLevel` 75504，`0x1809f2140`，直接比较当前 tauntLevel 降序；`StableBubbleSort<Entity>` `0x18469b420` 仅在比较结果正数时交换。 |
| 随机权重 | `_Filter_Random` 75950，`0x180a2a9a0`，在 `0x180a2aa35` 取得 Battle RNG，`0x180a2aa49` 调随机 helper，`0x180a2aa6b` 转为 FP 权重。 |
| 嘲讽属性 | `Entity.get_tauntLevel` 67479，`0x18073a3e0`，以属性 20 调 `Attributes.GetValueRoundToInt`。 |
| 角色仇恨与创建事实 | `Character._BuildAtInternal` 77293 在 `0x180aaac77/7c` 保存 fixedPlayTime，`0x180aab082–8f` 递增本帧创建计数并重算仇恨；`OnAttributeDirty` 77342 在属性 20 变脏后重算；`UpdateHatred` 77358，`0x180aa8d20`，读取当前全局帧计数。 |
| 敌人仇恨与运动 Cursor | `Enemy.get_hatred` 77631，`0x180acbeb0`；其内联距离读取与 `get_distToExit` 77613 均使用 slot 226 (`get_moveCursor`)，然后调用 Cursor 的 slot 7 (`distToExit`)，不是 slot 8 (`distToExitPrecise`)。 |
| Main 与 Trace 选择 | `get_cursor` 77710 为 Main；`get_moveCursor` 77711 普通存活且使用 Trace 时返回 Trace，否则 Main。Fear／Attract 身体移动链复用案例 31 的补核。 |
| 路线估计距离 | `DirectionCursor.get_distToExit` 71402，`0x1808d51d0`：从当前索引寻找后续 MoveCheckpoint，调用 `GetEstimatedDistToFinal` 71336，`0x1808da8a0`；否则转最终地图。节点合法时读取累计 `distToFinal` 并做方向投影修正，不可用时取当前路点／最终格的直线距离。 |
| 距离累计来源 | `Route._ReconstructNextMapInto` 71504、`_ComplementFinalDistance` 71527 保存当前版本的地图衔接与累计节点距离，不从名字推断巡逻、出现／消失的影响。 |

实际 method index 均可由 `native.json.method.index` 核对；表中地址只作本次锚点。x64 虚表项基址为类对象 `+0x140`，每槽 16 字节。

## 复用材料

- [案例 31 的推进与移动接收者补核](../../route-operations-20261107/temporary/advance-selection-20261108/README.md)：Main／Trace 与 Fear／Attract 各自接收推进和身体移动，不重复提取。
- [Elemental 时序原件](../../elemental-timing-20261102/schedule-native.json)：相同指纹 `BattleController.OnTick` 的 `0x18065acaf` 将 `s_buildCountInOneFrame` 写零，结合本批字段和 `_BuildAtInternal` 的递增复核本帧计数来源。
- 同批 Content 的 Melantha、Kroos、Steward、Bison、桑葚配置：分别提供阻挡加前、飞行二次优先、防御排序、动态嘲讽和 HP／EP 两层权重的实际启用样本。

## 复跑

从仓库根目录执行，输出到独立目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/targeting-pipeline-20261109/priority/extract_priority.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/targeting-priority-replay
```

`--query` 可指定另一份完整查询；更换客户端须先重新定位并更新指纹绑定，不能只改期望哈希。

`fullyDecoded=false` 的普通 Filter 尾部包含跳转数据表／填充，不能将其当作缺失分支已经被证明；其实际普通返回、异常和选择分支分别保留。查询的泛型区间明确保存边界，不宣称相邻所有共享代码都属于单一 C# 方法。未执行完整客户端或验证活跃 XLua；未出现于已取样 Prefab 的晚嘲讽开关只证明原生普通分支，不冒充实际 Content 启用证据。
