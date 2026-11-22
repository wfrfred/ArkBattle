# 普通退场的部署额度与同卡在场上限

本批次定位普通撤退和 HP 归零死亡的全局部署位与同卡在场计数写入，并核对部署资格读取的数值。结论见[案例 24 的普通退出结算](../../cases/24-deployment-cost-and-supply.md#普通撤退与死亡的结算顺序)。

## 来源与范围

- Windows x64 客户端，IL2CPP metadata v29。GameAssembly.dll SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，global-metadata.dat 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- [native.json](native.json) 记录本批方法身份、字段偏移、反汇编和代码区间指纹。沿用[普通返费和卡牌身份证据](../card-source-identity-20261111/README.md)及[HP 归零结束入口证据](../../cases/39-death-attribution-and-attribute-ranges.md#2-最终死亡怎样读取归属)。
- [部署费用](https://prts.wiki/w/部署费用)和[待部署区](https://prts.wiki/w/待部署区)提供返费、卡牌和资格的玩法背景。2026-11-22 核对这两页，未见普通死亡何时归还全局部署位的记录。下述时序为同一客户端静态证据与推导。
- 仅核对默认模式的普通静态分支，死亡延迟结论适用于使用普通 Character 默认回收时长的对象池路径。未运行客户端对战，未核对动态 XLua、复活接管、特殊模式、角色改写回收延迟或非对象池回调行为。

## 资格与计数

| 方法 | 写入或实际消费 |
| --- | --- |
| `BattleController.GetRemainingAvailableCharacterCnt`（65525） | `0x18065403e–4a` 读取玩家额度与 `UnitManager.GetPlayerCharacterCnt` 并差值限幅到非负。额度字典位于 Controller `+0xc8`，占用计数字典位于 UnitManager `+0x40`。 |
| `Deck.CharacterCard.CheckBuildable`（67062） | `0x18070766a–75` 查询全局可用部署位。普通分支中需占位的卡在剩余量 ≤0 时判定不可部署。同方法后续留有其它资格判断。普通 `Deck.Card.CheckBuildable`（66859）在 `0x1806ea89f` 也取得此值。 |
| `UIController._UpdateGameInfo`（105924） | `0x18132a266` 调用同一全局额度 getter。 |
| `UnitManager.Register / Unregister`（79124／79125） | 登记成功后增加角色占用量（`0x180b115c8`）。移除登记成功后读取 `Character.get_remainingCharacterCntVolume`，在 `0x180b11c2d–40` 以负占用量调用 `SetPlayerCharacterCnt`。 |
| `TokenCard.get_isMaxDeployed`（67076） | `0x18071e2d5` 比较 `m_spawnedCnt`（`+0x1f0`）与 `maxDeployCnt`（`+0x204`）。`m_dontOccupyMaxDeployCnt` 可跳过限制。有限卡的 `get_readyToSpawn` 和 `get_readyToSpawnWithoutCheckCost`（67072／67073）经虚槽 18 读取该结果。无限卡先跳过该分支。 |
| `TokenCard.OnSpawned / OnRecycle`（67093／67094） | 计入同卡上限的实例在 `0x18071d493` 使 `m_spawnedCnt` 加一；Card 回收时调用基类回收，在 `0x18071d357` 使该计数减一。 |
| `Card.get_isMaxDeployed / OnRecycle`（66839／66867） | 普通基类的上限 getter 返回 false。普通 UNIQUE 卡在 INUSE 时经 `OnRecycle` 于 `0x1806ecd49` 转入 RESPAWNING，并于 `0x1806ecd68` 重设计时器。 |

## 退出与延迟

1. `Entity.FinishMe`（67633）派发 `OnFinish`，随后调用 GameMode（`0x1807248f2`）。`Character.OnFinish`（77340）清理地块和阻挡，经过 `0x180aa34d3` 调用 Controller，按原 Card UID 找到 Card 并调用其 `OnRecycle`。有限 TokenCard 的同卡计数在这里变化。
2. `DefaultGameMode.DestroyEntity`（84162）于 `0x180c9c7b3` 检查死亡原因。普通撤退由 `0x180c9c7da` 走 `RecycleSelfImmediately`。普通死亡由 `0x180c9c7f8` 走 `RecycleSelfWithDelay`（67635）。后者于 `0x18072c7bb` 调用 Character 重写的 `get_delayToRecycle`（77209，虚槽 68），再调用 `BObject.DestroyMe(float)`。Character 构造（77400，`0x180aae422`）和 Reset（77337，`0x180aa411a`）均把 `m_delayToRecycle`（`+0x460`）设为 Float32 `1.0`。
3. `BObject.DestroyMe(float)`（66013）在非零延迟分支进入 `RecycleAsyncByBattleCoroutine`（65219）。对象池路径把延迟写入协程的 `+0x20`（`0x18068d7be`），于 `0x18068d7e6` 调用 `StartBattleCoroutine`。两个 `_RecycleAsync` 重载生成的 `MoveNext`（65222／65228）都先以该字段调用 `AsyncUtil.WaitForFixedSeconds`（`0x180690a0e`／`0x180690afa`）并暂停，恢复后才调用 `PoolManager.BattleOnly_RawRecycle`。该调用与即时回收均转到 `PoolManager._RecycleInternal`，再走 `GameObjectPool.Recycle`。回收的消息分支在 `0x182ab8df0` 载入字面量 `OnRecycle`，在 `0x182ab8e11` 或 `0x182ab8e32` 发出该消息，随后停用对象。
4. `Unit.OnRecycle`（79024）在 `0x180b19d4e` 调用 `BattleController.UnregisterUnit`（65649）。后者于 `0x180663710` 调用 `UnitManager.Unregister`，执行上文的部署位归还。随后沿 `Entity.OnRecycle`（67658）到达 `BObject.OnRecycle`（66015），再于 `0x1806afcef` 注销对象身份。

## 对提前归还与实际部署入口的复核

- **普通占位干员的致死与对象来源。** `BattleFactory.CreateCharacter`（72800）在 `0x180925c10` 装入 MethodSpec 306240，即 `PoolManager.Allocate<Character>`，在 `0x180925c1a` 调用该对象池分配。PoolManager 构造器在 `0x182ac40ed` 默认启用对象池。未由复活接管的 `Character.OnHpZero → Unit.OnHpZero → Entity.OnHpZero` 向 FinishMe 传入 `HP_ZERO` 或 `NO_SOURCE`。`Entity.IfReasonIsDeath` 对两者都成立。`DefaultGameMode.DestroyEntity` 对 `REACH_EXIT` 另行判断。
- **早于回收的账务。** `GetPlayerCharacterCnt` 从独立字典中按阵营取值；没有按存活、清格结果或 Card 状态临时重算。已核对的其他直接 `SetPlayerCharacterCnt` 调用者是卫戍准备阶段重算和显式 Action。固定游戏数据 `17759cc8cdf37388414145d16262a3a06f3ab25e` 中未找到该 Action 的绑定。`Unit.OnFinish → OnUnitFinished` 普通分支派发通知并处理音频，默认模式 `OnCharacterFinished` 回退体为空。直接调用检索不能排除回调、虚分派或 XLua 在各自具体内容中的作用。
- **会挡住实际请求的检查。** `Deck.SpawnCharacterOrToken` 的普通 UID 重载传 `forceSpawn=false`。`0x1806fd25f–0x1806fd283` 通过虚槽 23 调用 Card `CheckBuildable` 并在拒绝时退出，早于 `SpawnPrefab`。已经达到上限时，界面和实际部署许可都消费同一全局计数。
- **等待单位。** `AsyncUtil.WaitForFixedSeconds`（65094）保存入参，`MoveNext`（65116）在 `0x18068ffb8–0x18068ffd5` 用 `BattleController.get_deltaPlayTime` 把该值换算为更新步数。默认 `1.0` 表示战斗时间。实机中从 HP 归零到另一张卡首次能成功部署的时点尚未观测。

## 复查

从仓库根目录执行。可用 `--game` 指定相同指纹的客户端安装目录。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline docs/research/evidence/deployment-exit-limits-20261122/extract.py \
  --out /tmp/arkbattle-deployment-exit-limits.json
```
