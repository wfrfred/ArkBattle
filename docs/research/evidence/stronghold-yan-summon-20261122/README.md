# 卫戍协议「炎」盟约的召唤与等待

2026-11-22 补核炎佑的真实召唤入口。关卡和活动数据取 Kengxxiao/ArknightsGameData 固定修订 `17759cc8cdf37388414145d16262a3a06f3ab25e`。原生静态分支和已安装 Holder 分开记录指纹。 [Holder 与配置](content.json) · [模式通知原体](mode-notification.json)

| 证据 | 事实 |
| --- | --- |
| 活动表 `bondeffect_yan` | `env_gbuff_new` 指向 `act1autochess_bond_eff_yan`，两版配置均给出 `power_bond_char_cnt=6`。选中的一版另有 `ex_bond_char_cnt=9`。 |
| Holder 根及后继 | 事件 96 的召唤程序检查 `trap_ac_controller_mark` 与炎盟约人数。召唤节点读取 `dragon`，明确 `_managedByScheduler=false`。加量分支和到期时另召一份的节点也传 false。 |
| 原生模式通知 | `MainGameInBattle._OnAutoChessModeChanged` 在 `0x180c7c7ac` 通知合格单位的 Buff 容器。容器于 `0x1806ba082` 调用 Buff。Buff 常规分支用 `0x60` 检查并执行事件。 |
| 真正的召唤消费 | 普通 `SummonEnemiesFollowBranchRoute` 把节点自身的管理参数传给外部出生入口。false 时跳过本波和最终两处登记。两份关卡内作为路线模板使用的相同 Action 却写 `managedByScheduler=true`，该字段不参与这条外部出生。 [普通调用链](../managed-summons-20261122/README.md) |

此处核对的是实际配置结合普通客户端的静态链。没有校验运行中的 XLua 与所有卫戍版本。社区规则用于交叉核对 6／9 人的开战召唤条件。 [卫戍盟约记录](https://prts.wiki/w/卫戍协议：盟约_下半/PRTS盟约记录) · [案例 31](../../cases/31-route-operations-and-state.md)

从仓库根目录复取 Holder 和关卡材料。

```sh
python3 docs/research/evidence/stronghold-yan-summon-20261122/extract.py --out /tmp/arkbattle-yan-content.json
cmp /tmp/arkbattle-yan-content.json docs/research/evidence/stronghold-yan-summon-20261122/content.json
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out /tmp/arkbattle-yan-mode.json \
  --method 'Torappu.Battle.GameMode.GameModeFactory/AutoChessGameMode/MainGameInBattle._OnAutoChessModeChanged' \
  --method 'Torappu.Battle.Buff/BuffContainer.OnAutoChessModeChanged' \
  --method 'Torappu.Battle.Buff.OnAutoChessModeChanged'
```
