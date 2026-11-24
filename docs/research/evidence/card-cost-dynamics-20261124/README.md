# 卡牌费用参数的运行时修改

2026-11-24 核对 Windows x64 客户端的默认静态分支。客户端与原表指纹见各 JSON 的来源记录，固定游戏数据修订为 `17759cc8cdf37388414145d16262a3a06f3ab25e`。结论见[案例 24 的各费用参数修改时点](../../cases/24-deployment-cost-and-supply.md#各费用参数的修改时点)。

| 行为 | 核对位置 |
| --- | --- |
| 默认涨幅和上限 | [Card 构造正文](../card-policy-distribution-20261102/native-evidence.json)在 `0x1806f19fb`、`0x1806f1a07` 写入基础上限和每层涨幅。[常量读取](native.json)得到 2 和 0.5。 |
| 开场覆盖基础上限 | `Deck.PreprocessDeck`（66741）在 `0x1806fb557` 调后处理，后者在 `0x1806fe56b` 逐 Card 调 `ProcessDeckModifier`（66868）。该方法在 `0x1806edd2e`、`0x1806edd45` 写入有效覆盖值或默认值。对应覆写实现 `TryHookMaxMultiplier`（74697）仅接纳正配置值。 [指令摘录](native.json) |
| 显式替换三个涨费参数 | `Card.ModifyRespawnParameters`（66902）在 `0x1806eca55–0x1806eca62` 直接写次数、每层涨幅和基础上限。直接 E8/E9 调用来自足球的 83451、83953，实参均为 `(0, 1, 1)`。 [调用候选](replacement-callers.json) · [正文与实参](native.json) |
| 普通回收累加次数 | `Card.OnRecycle`（66867）在 `0x1806ecd6d–0x1806ecd78` 按标志给已有次数加 0 或 1。倍率上限在费用 getter 求值。 [回收正文](../card-source-identity-20261111/deployment/native/OnRecycle-66867.asm) · [算价正文](../deployment-recovery-20261101/cost-version/expanded.json) |
| 普通回收跳过累加 | 焰狐龙梓兰精二的启用组件装配 `orchd2_t_1[respawn_cost]`，在 Buff 开始或宿主离场时补装同一键的永久 CardBuff。原生把 `not_add_respawn_cost_cnt` 取反后与其它允许标志聚合，在 `0x1806f1138` 写回。 [Prefab 与 Holder](orchid-assets.json) · [精英阶段取值](orchid-config.json) · [原生消费](orchid-native.json) |
| 一次撤退跳过累加后恢复 | 《未许之地》的 `Act47SideBattleManager` 在 `0x1807d411b` 登记重建 CardBuff，随后于 `0x1807d4125` 撤退单位。`_CreateRebuildCardBuff`（69449）于 `0x1807d35a4` 创建禁增修正，以 `UNTIL_NEXT_SPAWN` 登记。新实例生成成功后，`FinishCardBuffsOnSpawned`（66892）于 `0x1806ec14c` 移除效果，随后重算 Card 修正。 [普通支线客户端摘录](native.json) |
| 战中交换费用基数 | 凛御银灰 S3 的 `GenerateCostDic`（98773）在 `0x1810d874e`、`0x1810d87d1` 采样双方的费用快照，以对方 UID 写入。调用者在 `0x1810d8da0` 登记映射。`get_rawCost` 在 `0x1806f366f` 选择映射基数，再计算涨费。 [写入摘录](native.json) · [读取正文](../deployment-recovery-20261101/cost-version/expanded.json) · [触发与解除](../card-sort-retention-20261123/README.md) |
| 开场打乱角色费用 | 一串钱伥对应的 `MShuffleDeckCost.OnInit`（87872）读取 `BattlePlayerData` 中的角色费用列表，用玩法的藏品随机源洗牌，再于 `0x180db15c2–0x180db15dc` 把结果写回角色 `AttributesData.cost`。 [写入摘录](native.json) · [字段布局](fields.json) |
| 后段倍率、固定值及上限偏移聚合 | `RuntimeCostModifier.ApplyFirstPass`（66996）分别加整数偏移、乘费率、加上限偏移。「铁卫-轻行」配置首次部署倍率 0.25。 [聚合指令](../card-rules-20261122/result.json) · [藏品参数](roguelike-config.json) |

直接引用扫描覆盖该客户端的 E8/E9 调用候选。运行中的 XLua 改写以及经函数指针或内联执行的写入仍按具体样本核实。

## 历阵锐枪芬的共享减费

[Prefab、Holder、字段和指令摘录](fang2-shared-discount.json)保留已安装的 `char_1036_fang2.ab` 中启用的 `PassiveBuffAbility` 及 `fang2_t_1` 实际模板。模板在宿主因 `WITHDRAW` 离场时对适用 Card 登记 `UNTIL_NEXT_SPAWN_DECK_TRIGGER_ONCE`，并排除 Token 和 Trap。该值在同版本元数据中为 5。`FinishCardBuffsOnSpawned`（66892）在 `0x1806ec229` 匹配该值，取得本次 Card 上修正的键后调用 `ForeachCard`。其回调（67052）于 `0x18071f0f0` 对各 Card 调 `FinishCardBuffByKey`。

普通 `SpawnCharacterOrToken`（66755）先经 `SpawnPrefab` 执行 Unit 出生，再走付款和条件性的 `Card.Draw`，随后在 `0x1806fd669` 结束这些 CardBuff。在 `SpawnPrefab` 返回空的分支，原生检查 `SpawnDetailsTracker.isSpawnOperationSucceed` 及叠放标志。成功的叠放类操作在 `0x1806fd472` 调用同一 CardBuff 结束函数。资格拒绝直接返回 false。此处核对分支条件，未逐个验证所有内容适用的叠放配置。[普通出生调用链](../special-redeploy-failure-20261122/README.md#特殊入场的实际观察者) · [Deck 指令](../card-source-identity-20261111/deployment/native/SpawnCharacterOrToken-66755.asm#L124)

## 复查

从仓库根目录运行。共享工具按已登记的指纹重提方法和常量。对分段方法，可从 `native.json` 的选段首地址用 `native.py disasm-at` 补读。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/card-cost-dynamics-20261124 --out /tmp/arkbattle-card-cost-dynamics-replay
```

复查调用候选时以 `0x1806eca00` 为 `native.py xrefs` 的目标。梓兰 Prefab 可以复用 [Card 资源解码](../card-rules-20261122/extract.py) 的 `read_assets`，将选择器设为 `charpack/char_1048_orchd2.ab` 的 PathID `-8213570048818500284` 与模板 `orchd2_t_1[respawn_cost]`。

复查芬的实际模板时，使用同一个 `read_assets`，将选择器设为 `charpack/char_1036_fang2.ab` 的 PathID `-6268552104545291712` 与模板 `fang2_t_1`。用 `native.py disasm 66755 66892 67052` 复读普通部署与清除分支，用 `native.py type` 读取 `Torappu.Battle.Deck/SpawnDetailsTracker` 和 `Torappu.Battle.Deck/Card/CardBuff/LifeType`。
