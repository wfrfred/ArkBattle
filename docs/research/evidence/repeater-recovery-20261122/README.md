# 中继器普通回收的库存与计时

2026-11-22 补核 [案例 24 第三节](../../cases/24-deployment-cost-and-supply.md)。范围是谬因中继器持有上限稳定时，在同一张 Card 上连续回收两份普通中继器。使用 [2026-11-01 复核](../deployment-recovery-20261101/README.md) 同一版安装客户端，静态分支实参、Unity 资源和原表摘录见 [result.json](result.json)。未执行游戏或读取 live XLua。

## 配置与资源

- `pkgrps/btl_pfb_tokens_5.ab` 的 `token_10070_aphris_pc` 控制器保存 `_cardPolicy=2`、`_isInfinity=false` 和 `_rechargeOnlyOnce=false`。默认天赋子对象的启用 PassiveBuffAbility 装配 `aphris_pc[recharge]` 和 `aphris_pc_t[with-draw]`。两个 Buff 均是非 durable，时长由 `duration` 提供，局部 Blackboard 均为空。
- 数据子模块 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 `buff_template_data.json` 把 `aphris_pc[recharge]` 的 `ON_BUFF_FINISH` 绑定为 `RechargeToken(cnt, ON_FINISH, false)`。中继器的默认天赋参数提供 `duration`，`RechargeToken.Execute` 在没有 `cnt` 时取默认值 1。宿主天赋也为该中继器提供初始 1 份。另一个定时 Buff 的到期程序含强制撤退，具体门控记录在配置摘录。
- 同一原表的 `aphris_sk3[token-withdraw]` 另有 `ForceRechargeToken`、`WithdrawTokens` 和显式 `ResetTokenRespawnTime`。模板的 `ON_BUFF_START` 和 `ON_OWNER_FINISH` 都为重置节点传 `_waitFirstPeriod=false`。这是单独的技能路径。

## 调用锚点

| 运行路径 | 指令锚点 |
| --- | --- |
| 实体结束时同步完成普通回收 Buff | `Character.OnFinish` 在 `0x180aa33f9` 调 `Unit.OnFinish`，后者在 `0x180b18eae` 调 `Entity.OnFinish`。实体在 `0x18072a46a` 调 `BuffContainer.Clear(true)`。Clear 在 `0x1806b209e` 调 `_FinishBuff`，后者在 `0x1806cd867` 同步派发结束事件。已自然结束的 Buff 在先前的结束处完成同一动作。 |
| 回收 Buff 累加库存 | `RechargeToken.Execute` 在 `0x1811bf321` 提供缺省值 1，`0x1811bf333` 读取 `cnt`，`0x1811bf354` 传给 `Character.RechargeToken`，由后者在 `0x180aa5c29` 调 `Deck.RechargeToken`。Deck 找到对应 Card 后走虚调用。有限份数 `TokenCard.Recharge` 以 `ON_FINISH` 和 `refresh=false` 在 `0x18071d615–0x18071d6b7` 更新总份数，在 `0x18071d6fa–0x18071d711` 更新当前排队份数，两处各增加该次值并受上限约束。 |
| 本体随后通知卡牌回收 | `Character.OnFinish` 在上述调用返回后于 `0x180aa34d3` 调 `BattleController.OnCharacterFinished`，后者于 `0x180658fb4` 使用本体的 `cardUid` 调 `Deck.RecycleCard`。Deck 在 `0x1806fbf96` 派发回收虚槽，`TokenCard.OnRecycle` 在 `0x18071d344` 调基类。 |
| 只有改变到另一队列状态才从回收分支重启 | `Card.OnRecycle` 在 `0x1806ecd94–0x1806ece3c` 比较原状态和 `remainingCnt > queuedRespawnCnt`，同状态直接略过 Reset。普通 Draw 在 `0x1806eba2d` 消耗一份，若用掉最后一份可用库存且有排队份数，则跳到 `0x1806ebaaa` 进入 RESPAWNING，越过 `0x1806ebaa5` 的 Reset。 |
| 无独立入队预算 | `Card.OnTick` 的 `0x1806ed798` 起减少排队份数，若尚未清空，读取当时记录在 Card 的后续周期，启动下一段。 |
| 技能显式将当前计时归零 | `ResetTokenRespawnTime.Execute` 在 `0x18111f352` 读取节点的 `_waitFirstPeriod`，由 `Character.ResetTokenRespawnTime` 于 `0x180aa67a1` 使用对应 Token 卡 ID 传给 Deck。Deck 在 `0x1806fccb1` 调用 `Card.ResetRespawnTime`，后者在 `0x1806ee935` 传递该参数，`0x1806ee94e` 跳到 `PeriodicTimer.Reset`。该方法更新 period，`0x181e4b06a–0x181e4b093` 在 `waitFirstPeriod=false` 时写剩余时间为 0。计时器的 Reset 本身不发放库存，队列仍由 Card 推进。 |

令 `r` 为总份数、`q` 为排队份数，则可用份数是 `r−q`。在可归还份数未超过稳定上限、第一段正在进行且没有内容显式修改计时的条件下，第二份普通回收给 `r`、`q` 同时加一，因而保留进入原状态时的 `r>q` 条件。如果已经没有可用份数，则维持 RESPAWNING。有可用份数，则维持 QUEUING。两种情况都保留第一段已有进度。这个结论来自配置与静态调用链的组合。[PRTS 中继器](https://prts.wiki/w/中继器)另有逐份串行恢复的社区规则说明，[社区实测](https://prts.wiki/w/话题:Zhmzmxnbifzhjrt8)观察到部署最后一份可用库存时保留已有计时，该实测场景属于 Draw。

## 复跑

从仓库根目录运行。工具要求所记录的安装版客户端指纹，`--game` 可指定另一安装目录。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/repeater-recovery-20261122/extract.py --out .cache/native-research/repeater-recovery-replay/result.json
```
