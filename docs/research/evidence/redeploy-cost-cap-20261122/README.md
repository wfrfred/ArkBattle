# 凛御银灰 X 模组的再部署涨费上限

2026-11-22 补查 [案例 24 第一节](../../cases/24-deployment-cost-and-supply.md)，使用 [2026-11-01 复核](../deployment-recovery-20261101/README.md)的同一安装版客户端。[result.json](result.json) 记录客户端、资源包、原表哈希与指令摘录。原表从本机已有 Git 对象 `bffe31bf66739842f99b457327066c695e2af389` 读取，该版记录的游戏数据为 `26-10-29-15-36-11-33649006`，本批未变更项目数据子模块的固定版本。

## 实际内容来源

- `uniequip_table.json` 的 `uniequip_002_svash2` 是凛御银灰的 CSR-X「邀约」。`battle_equip_table.json` 的 `phases[2].parts[2]` 覆盖天赋 0，使用 `svash2_equip_1_3_p2`，天赋 Blackboard 提供 `multiplier_max_offset=-0.25`。对应二级模组只提供 `respawn_time`、`sp` 与 `atk`。[PRTS·凛御银灰](https://prts.wiki/w/凛御银灰#天赋)
- `battle/prefabs/[uc]equips.ab` 中该资源装配启用的 `Svash2DeckAuraBehaviour` 和 `PassiveBuffAbility`，分别引用 `svash2_t_1[sp]` 和 `svash2_t_1[resp]`。前者经 DeckBuff 将能力 Blackboard 提供给符合条件的目标，后者装在自身。Aura 配置 `_containsCardBuff=false`，由 Buff 的结束事件登记 CardBuff。
- `config/buff_template_holder.ab` 的两个模板在 `ON_OWNER_FINISH` 对 Buff 宿主执行 `CreateCardBuff`，继承 Blackboard，`_filterIsInHand=false`，生命周期为 `UNTIL_NEXT_SPAWN`。改动随这次离场登记到对应 Card，允许登记到暂时不在待部署区的 Card，下一次生成时消耗。

## 参数到费用的原生调用

| 路径 | 指令锚点 |
| --- | --- |
| Aura 从能力 Blackboard 构造 DeckBuff 的参数 | `DeckBuffCardBuffDeckArua..ctor` 在 `0x18100cdd0` 取 Blackboard，`0x18100cdda` 复制；`_ApplyByFilter` 在 `0x18100ca5b` 调 `Card.AddDeckBuffWithKey`。 |
| 宿主离场时按自己的 Card 身份登记修正 | `CreateCardBuff.Execute` 在 `0x1810d33a4` 取被修正角色的 `cardUid`，`0x1810d33ba` 查卡牌。`DoCreateCardBuff` 在 `0x1810c5f4c` 把参数交给 `BattleController.CreateCardBuffWithBlackboard`。它在 `0x18064b697` 调 `RuntimeCostModifier.CreateRuntimeModifier`，然后在 `0x18064b83c` 调 `Card.CreateCardBuffByBuff`，后者在 `0x1806eb0d7` 登记 CardBuff，触发 `_UpdateCardBuff`。 |
| 加总涨费上限修正 | 元数据字面量索引 `32722` 和文件中 `0x188c2da30` 的编码槽定位到 `multiplier_max_offset`。`RuntimeCostModifier.CreateRuntimeModifier` 在 `0x180719383` 读取这个数，`0x1807193d6` 存入修正的 `+0x28`。其 `ApplyFirstPass` 在 `0x18071918e–0x1807191a5` 加到本轮汇总的 `+0x28` 槽。`Card._UpdateCardBuff` 随后在 `0x1806f117e` 写回 Card 的 `m_respawnCostMaxMultiplierOffset`。 |
| 限制涨费倍率，计算基础费用阶段结果 | `get_rawCost` 于 `0x1806f3706` 取偏移，与原倍率上限相加，并以 1 为下限。于 `0x1806f37b6` 与当前再部署倍率取较低值，乘费用基数后，在 `0x1806f37e6` 取 floor。然后才由 `get_cost` 处理后续费用修正与第二次 floor。 |

普通倍率上限 2 受一次该效果影响时变为 1.75。以费用基数 20 举例，零次、一次、两次及以上涨费分别得到 20、30、35，后一项的无效果结果为 40。用一组合成输入区分取整顺序，费用基数为 17、已达两次涨费、后段费率为 0.75 时，原生顺序是 `floor(floor(17 × 1.75) × 0.75) = 21`。把两项合成后段费率会得到 `floor(34 × 0.875 × 0.75) = 22`。这组费率用于验证公式，没有核对对应的实战叠加内容。

已确认的叠加事实是同一轮被接纳的成本修正的上限偏移相加。其它效果何时竞争、是否被重复接纳、能否与该模组同时存在，未据此套用一条规则。未执行完整游戏或读取 live XLua。

## 复跑

从仓库根目录运行。Git 子模块库需含上述数据对象，工作树无需切换。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/redeploy-cost-cap-20261122/extract.py --out .cache/native-research/redeploy-cost-cap-replay/result.json
```
