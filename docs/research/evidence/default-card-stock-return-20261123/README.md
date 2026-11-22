# 本能的召唤的退场库存归还

2026-11-23 核对固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 Buff 模板、已安装 Prefab，以及[已归档客户端](../card-policy-distribution-20261102/README.md)的 DEFAULT 回收路径。结论归入[案例 24](../../cases/24-deployment-cost-and-supply.md#同一张-card-的计时器)。

[配置摘录](result.json)含 Bundle、MonoScript 和原表指纹。Prefab `token_10054_phatm2_encdool` 的 Token 控制器启用 DEFAULT 策略和有限份数，`_commonAbilities[0]` 直接指向已启用的 `Ability0`。该组件启用 `token_phatm2_passive`，绑定 `charge_token[finish]`。原表位置为 `/charge_token[finish]/eventToActions/ON_OWNER_FINISH/0`。该节点按 `ON_FINISH` 累加库存，局部黑板为空，`RechargeToken.Execute` 默认增加 1 的指令见[中继器回收](../repeater-recovery-20261122/README.md#调用锚点)。

在相同客户端的 [`TokenCard.Recharge`（67088）](../card-policy-distribution-20261102/native-evidence.json)，`0x18071d6b7` 写回总份数，`0x18071d6f0` 判断策略是否为 QUEUED，DEFAULT 在 `0x18071d6f3` 跳到 `0x18071d733`，越过待恢复数写入。该分支直接归还份数。本批证据是固定版本的资源绑定与静态实现，未做现场计时观测。

`Card.OnRecycle`（66867）的 DEFAULT 分支在 `0x1806eccea` 未进入 UNIQUE，随后在 `0x1806ecdaa` 未进入 QUEUED，接续到 `0x1806ece3c`，部署时启动的计时器沿用原进度。[普通回收指令](../deployment-recovery-20261101/supply/supply-methods.json)

从仓库根目录复跑。

```sh
python3 docs/research/evidence/default-card-stock-return-20261123/extract.py \
  --out /tmp/arkbattle-default-card-stock-return.json
```
