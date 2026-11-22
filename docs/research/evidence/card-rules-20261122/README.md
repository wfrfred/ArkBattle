# 卡牌算价、计时、库存及阻挡增容

2026-11-22 采集的 Windows IL2CPP 静态证据。[result.json](result.json) 保存解码后的实际组件与 Holder 节点、固定版本原表摘录、原生方法和指令选段。方法编号对应文件中记录的客户端与 metadata 指纹。组件组与数据表以路径和独立 SHA-256 校验。本批没有运行战斗或执行 XLua。

## 费用修正

- `char_496_wildmn.ab` 的启用组件 `-3488643510784291281` 装配 `wildmn_t_1`。Holder 对未部署近卫加 `UNTIL_NEXT_SPAWN` 的整数 CardBuff。固定角色表记录 `value=-1` 和上限 5。`BaseCreateCardBuff.DoCreateCardBuff#98706` 将参数交给战斗控制器。
- `RuntimeCostModifier.CreateRuntimeModifier#66993` 的 `0x18071930a`、`0x180719348`、`0x18071936e` 分别引用 `value`、`cost_scale`、`multiplier_max_offset`。其第一遍 `#66996` 和 `Card._UpdateCardBuff#66869` 分开汇总和提交整数偏移、后段倍率与涨费上限偏移。凛御银灰 X3 的实际偏移来源已在[前一批证据](../redeploy-cost-cap-20261122/README.md)核实。
- `Card.get_rawCost#66823` 按涨费上限乘费用基数并取 floor。`Card.get_cost#66826` 传入原始费用和 Card 的两项运行时修正。`BattleFormula.CalculateRuntimeCardCost#65914` 在 `0x18068735d–0x180687399` 先乘并取 floor，再加整数偏移，最后截断。普通 `Deck.SpawnCharacterOrToken#66755` 在 `0x1806fd2bd` 取 Card 费用作余额检查，`0x1806fd582` 再经同一调用槽取费用，取负后提交 `ModifyCost`。假设费用基数 18、涨费达到上限、凛御银灰把上限压至 1.75、后段倍率为 1、野鬃叠一层，两次修正给 30 费。将野鬃减费提前作用于基数则给 29 费。

## 再部署计时

- 银灰 X3 的 `AuraAbility` `-1918662421834868884` 装配 `svrash_e_002_t[aura]`。实际模组参数含 `respawn_time=-0.1`。`7966293647921525027` 装配的 `svrash_e_002_tr` 在结束时按该键清除 CardBuff。`Card.FinishCardBuffsByKey#66890` 触发 `Card._UpdateCardBuff#66869`。
- `RuntimeRespawnTimeModifier` 的 `#67007`、`#67008` 与 `#67009` 更新后续周期预算；`#66869` 在 `0x1806f1283` 写 `m_newRespawnTimePeriod`，新一轮 `#66865` 或 `#66909` 才给 PeriodicTimer 新预算。已有计时器的剩余量读自 PeriodicTimer `+0x18`。重算时仅改变后续周期预算会保留本段的周期与余量。
- 砾 X 的实际 `gravel_e_t_10` 由启用组件 `724506915439801841` 和 `-2052492723133430373` 装配，为卡西米尔目标安装含 `remaining_respawn_time` 的 `HOLD_BY_BUFF` CardBuff。X2 为 3、X3 为 5。`RemainingRespawnTimeModifier.CreateRuntimeModifier#67016` 依据该键创建修正。`#67017` 只对有效且未结束的计时在第一遍扣定值，`#67018` 处理比例分支。`#66869` 可写回本段余量并将负数截到零。提取的普通计时链使用 FP 运算。
- 两个来源组件的 Buff `lifeTimeType` 字节均为 `00`，即 `IMMEDIATELY`。`Buff.OnTick#66126` 对延迟开始的 Buff 执行 `OnStart` 后随即检查结束，管理器检查已结束 Buff 并安排下一帧回收。`Buff.OnRecycle#66120` 清空实例 UID，此后 `CardBuff.get_owner#67035` 的引用查询失效。`Card._UpdateCardBuff#66869` 在首遍修正前剔除这类失效引用。普通稍后撤退银灰因此只重算仍有效的修正。若回收前含该修正的 Card 被重算，`CardBuff.ApplyModifiersFirstPass#67039` 会再次应用同一倒计时减项。该分支的真实同帧组合尚未观测。 [同版本 Buff 时长、开始和结束证据](../elemental-zero-duration-20261105/README.md)

## 淬羽赫默 S2

- `[uc]skills.ab` 的 `4611325026417859596` 把 `slent2_s_2` 和 `trigger_charge_token` 装到技能根。后者开始时发放一份，前者结束时撤回场上无人机，再走 `RechargeToken(0, NORMAL, true)` 清库存。
- `Character.RechargeToken#77256` 把宿主关联的 Token Card UID 交给 `Deck.RechargeToken#66742`，后者按 `m_tokenMap` 查既有卡，找到才调用 `TokenCard.Recharge#67088`。两个动作均使用这张卡，当前库存和再次发放数量改变，冷却由回收链另行管理。
- Token Prefab `-5202899342101043299` 记录 `_cardPolicy=1`（`UNIQUE`）、`_isInfinity=false`、`_rechargeOnlyOnce=false`。`#67088` 的队列更新只进入 `QUEUED` 且 `ON_FINISH` 的分支。

## 谬因 S3

- `AbilitySequenceGroup` `-1073599293142318865` 按顺序持有准备包装器 `-4303161870961327889` 和持续阶段 `-5427451279434235665`。准备包装器装配 `875698991745679599`。两阶段分别使用 `aphris_sk3[token-withdraw]` 和 `aphris_sk3[on_finish]`。准备期响应宿主结束并撤销两份增量、清余量。持续期响应 Buff 结束，按撤容量、召回、清余量执行。
- `Ability.FinishIfNot#64056` 先在 `0x180602f58` 调用准备阶段的 `ActiveAbilityWrapper.OnCastEnd#93933`。该程序解除附属 `PassiveBuffAbility`，经 `Ability.DoDetach#64020 → Entity.RemoveBuffs#67549 → BuffContainer.RemoveBuffs#66304` 同步标记准备 Buff 结束。然后 `#64056` 才执行启动后继阶段的回调。所查普通顺序下，准备 Buff 的结束标记先于持续阶段启动。
- `Entity.OnFinish#67653` 的 `0x18072a431–0x18072a470` 先调用 `OnOwnerFinish` 再清理 Buff，`Character.OnFinish#77340` 另执行 Card 回收后继。`TokenCard.ForceRecharge#67089` 先提交容量，再裁剪当前库存。`ON_FINISH` 的排队份数受新库存及本次增量约束。`TokenCard.ResetRespawnTimer#67092` 写入计时，队列完成由后续 Card 推进。实际中继器卡配置见[前一批证据](../redeploy-state-and-repeater-20261122/README.md#谬因-s3-的中继器)。

## 大君之触与大君之赐

- `battle/enm_pfb_10.ab` 的两个根 `4850455197129071671` 和 `7775323765339889168` 都有启用的 `ToggleablePassiveBuffAbility` 与 `BlockedToggleChecker`。实际组件及 Holder 随结果文件保存。主线 10-8 刷出大君之触，集成战略「朝谒」刷出大君之赐，固定关卡表的 SPAWN 取样也保存在结果中。
- `BlockManager.SearchBlockee#78504` 容量满时返回。`AddBlockee#78505` 先检查占用和容量。`Enemy.RegisterBlocker#77745` 在 `0x180ac25d3` 写关系，然后在 `0x180ac25ea` 派发通知。
- `ToggleablePassiveBuffAbility._UpdateEnemyBlockeeBuffs#94719` 在 `0x180fc0c26–0x180fc0c59` 读取已经存在的 blocker，再到 `0x180fc0d00–0x180fc0d5f` 安装 Buff。`enemy_bloodsucker_block_cnt[control]` 对阻挡者新增 `BLOCK_CNT` 层，结束时撤一层。能力生效路径以已取得的关系为输入。

## 卫戍开场的部署记录

固定原表的 `nearl2_t_1[mark]` 在角色出生时检查对应 Card 是否持有 `nearl2_t_1`。`nearl2_s_2[end]` 按这个在场标记分支。卫戍作战说明分别记载开场部署免费用、手动召唤物不消耗份数、耀骑士临光 S2 的卡西米尔判定不计入开场部署。尚未提取模式入口派发通知或筛选该消费者的具体指令。 [卫戍协议作战阶段](https://prts.wiki/w/卫戍协议/帮助#作战阶段)

## 复跑

从仓库根目录运行，`--game` 可指定具有相同指纹的客户端。原表要求本地子模块能读取记录中的 Git 修订。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/card-rules-20261122/extract.py \
  --out /tmp/arkbattle-card-rules-replay.json
```
