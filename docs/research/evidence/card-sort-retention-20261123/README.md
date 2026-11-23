# 战中重排与撤销按费用重排

2026-11-23 核对 [案例 24 第四节](../../cases/24-deployment-cost-and-supply.md#四手牌顺序与目标选择)。[result.json](result.json) 保存安装版 Windows IL2CPP、实际 Prefab 和固定原表的指纹，以及相关方法的指令选段。原表镜像提交为 `17759cc8cdf37388414145d16262a3a06f3ab25e`。

## 内容和排序写入

- 基础凛御银灰 `charpack/char_1045_svash2.ab` 的启用组件 `-2811945632205488851` 装配 `Svash2DeckAuraBehaviour`，覆写键为 `svash2_t_1`。`[uc]skills.ab` 的启用组件 `465448942424363708` 属于 `skchr_svash2_3`，实际装配 `svash2_s_3`。
- `svash2_s_3` 可装配随父 Buff 结束的 `svash2_s_3[sort_once]`，后者只配置开始事件，依次执行换费与 `SortDeck`。原表 `buff_template_data.json` 中四个显式 `SortDeck` 节点均属凛御银灰，分别是出生、S1、S2 和 S3。这个计数只覆盖该固定表的显式节点。
- `SortDeck.Execute#99407` 在 `0x18111fdf4` 调用 `BattleController.SortDeckRuntime#65712`。`Deck.get_cards#66727` 在 `0x1806ff3fc` 直接返回 `m_cards`（`+0x50`）。重排程序在 `0x1806608d5` 取得该列表，在 `0x180660988–0x18066098d` 将它传给原地排序函数，之后传同一列表给模式排序入口并通知 `OnDeckSorted`。默认作战模式的普通排序后继无额外操作。排序函数在同版客户端的取证见[优先级取证](../targeting-pipeline-20261109/priority/README.md#方法锚点)。

## 停止自动重排

| 路径 | 确定的普通分支行为 |
| --- | --- |
| `Svash2DeckAuraBehaviour.OnEvent#96387` | 开始分支在 `0x181010c3f` 登记 Aura，结束分支在 `0x181010c99` 移除保存的 Aura。 |
| `Deck.RemoveDeckAura#66784` | `0x1806fc929` 在加锁时清除按费用重排的开关 `+0xb1`，`0x1806fca17` 调银灰 Aura 的 `OnDisable`。仅剩余启用项使 `0x1806fcae5` 重新置开关。该普通路径不恢复旧牌序、不请求重排。银灰 Aura 的普通 `OnDisable#96395` 无额外操作。 |
| `Deck.RemoveRawCostOverriderDataByCardUid#66789` | S3 换费后继由 `Svash2RemoveCardOverrideByCardUid#98776` 在 `0x1810d9300` 调用。映射删除成功并且按费用重排的开关开启时，`0x1806fcbdc` 才设置待重排标记 `+0x88`。普通 Card 费用变化也检查该开关。 |
| `Deck.OnFixedUpdate#66761` | 在推进所有 Card 后检查 `+0x88`，有标记时调用 `SortDeckRuntime` 并清除标记。移除 Aura 与清除已排队的重排是不同操作。 |

普通角色离场先清理能力，再回收卡牌。`Character.OnFinish#77340` 在 `0x180aa33f9` 调基类，`Entity.OnFinish#67653` 在 `0x18072a486–0x18072a494` 调虚槽 118 `ClearAbilities`。`Character.ClearAbilities#77291` 的普通分支进入 `Entity.ClearAbilities#67639`，在 `0x180722633` 调 `Ability.Detach#64017`。`Ability.DoDetach#64020` 通过虚槽 57 调 `AbilityStandard.OnDetached#64125`，后者把事件 1 交给 `OnEvent#64106`，虚派发到已装配的 `Svash2DeckAuraBehaviour`，同步撤销 Aura。基类调用返回后，`Character.OnFinish` 才在 `0x180aa34d3` 通知 `OnCharacterFinished` 回收卡牌。[卡牌回收后继](../repeater-recovery-20261122/README.md)

`Card.OnRecycle#66867` 在开关有效时才设置待重排标记。最后一个有效 Aura 已先撤销时，随后回收凛御银灰的卡牌不会再请求重排。`TokenCard.OnHostRecycled#67092` 的普通分支只清除宿主存活标志。

由此可知，普通离场撤销最后一个使开关有效的 Aura 时，可以保留最后的牌序。若已有待重排标记或之后另有显式排序，牌序仍可再次改动。证据来自实际配置与普通客户端静态链，未运行对局或核对实际加载的 XLua。公用排序入口可接收不同的比较器，多个来源下的业务比较细节仍未验证。社区资料记录了在场时的规则与 S3 换费的持续条件，未说明离场后是否复原。[PRTS 凛御银灰](https://prts.wiki/w/凛御银灰#天赋)

## 复跑

从仓库根执行。原表须能读取记录的子模块 Git 修订，客户端须匹配记录的指纹。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/card-sort-retention-20261123/extract.py \
  --out /tmp/arkbattle-card-sort-retention-replay.json
```
