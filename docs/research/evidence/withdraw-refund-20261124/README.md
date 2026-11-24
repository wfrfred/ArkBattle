# 普通撤退的返费资格

2026-11-24 从 Windows x64 客户端重新提取槽 227 的两个返费资格 getter。[native.json](native.json) 保存 DLL 与 metadata 指纹、方法及指令。结论见[案例 24 的返费与在场费用](../../cases/24-deployment-cost-and-supply.md#二返费与在场费用)。

| 证据 | 定位 |
| --- | --- |
| 撤退先检查在场单位的返费资格 | `Character.Withdraw`（77251）在 `0x180aa96ad–0x180aa96c5` 调用虚槽 227，返回 false 时越过计算及 `ModifyCost`。 [撤退指令](../card-source-identity-20261111/deployment/native/Withdraw-77251.asm#L119) |
| 普通 Character 读取返费标记 | `Character.get_allowWithdrawGainCost`（77210）检查角色数据的 `+0x90` 字节，为零时读取实例 `+0x519` 的 `m_externWithdrawGainCostFlag`。 [Character 字段](../card-source-identity-20261111/deployment/native/metadata.json#L2326) |
| 普通 Token 拒绝返费 | `Token.get_allowWithdrawGainCost`（78771）在 `0x180b04a2f–0x180b04a36` 返回 false。非默认 XLua 分支在 `0x180b04a42` 跳转至 DelegateBridge。 |
| 中继器的实际绑定 | `token_10070_aphris_pc` 的 Prefab 脚本为 `Torappu.Battle.Token`，`_cardPolicy=2`，`_withdrawCostRecoverRatio=0.5`。 [脚本绑定](../repeater-recovery-20261122/result.json#L63) · [倍率配置](../card-policy-distribution-20261102/controllers.json#L31125) |

从仓库根目录复查对应指纹的客户端。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/withdraw-refund-20261124 --out /tmp/arkbattle-withdraw-refund-replay
```
