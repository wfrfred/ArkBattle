# AutoChess 同名棋子的来源身份

采集：2026-11-11，Windows x64 IL2CPP、metadata v29。客户端 `GameAssembly.dll` SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。完整来源、工具指纹、方法签名和范围在 `bodies/{native,metadata}.json`。

本批仅补 AutoChess 的身份生产者与调用链。普通 Converter 的 UID 分配和 Character.cardUid 写入复用 [card-source-identity/allocation](../../card-source-identity-20261111/allocation/README.md)。

## 直接核实的静态链

1. `_GetChessSquadConfig`（81941）创建 `AdvancedCharacterInst`，将 Metadata 的 `playerInstId` 设为 0：`0x180c2c59a` 后清零 `r13d`，`0x180c2c69c` 将零写入栈结构的 `+0x18`，`0x180c2c6d6–0x180c2c6da` 将该结构复制至实例 `+0x10`。Metadata 的 `playerInstId` 无装箱偏移为 `+0x18`，故对象偏移为 `+0x28`。`_PostProcessDB`（81936）组织与分类 Squad，未将这个字段改成棋子 instId。
2. `ChessInst.get_charInst`（81862）普通分支返回 `this.chessSquad.inst`。它不是使用 `ChessInst.instId` 查找玩家持有角色。
3. `_LoadInstsBattlePlayerData`（81760）分别将场上和手牌实例交给 `_LoadBattlePlayerData`（81754）。后者逐实例遍历，在 `0x180c02c7e` 取得上述 AdvancedCharacterInst，在 `0x180c02c98` 调用 `ConvertToCharacterData`。
4. 已归档的 Converter 对 `playerInstId <= 0` 使用递增计数器。因此，即使两份棋子使用同一 `ChessSquad.inst`，它们逐份转换时也会得到不同的 `BattleCharacterData.uniqueId`。
5. `ApplyInstDataToSharedData`（81985）仅把棋子 instId、chessId 写进 SharedData 的 Blackboard，不覆盖 `uniqueId`。随后 `0x180c02cbc–0x180c02cc3` 将转换结果的 `uniqueId` 写入各自的 `ChessInst.cardUid`，并保存对应 BattleCharacterData。

由此，这条原生普通分支不会因为角色同名或共享 Squad 配置而合并 `cardUid`。棋子 `instId`、角色 `playerInstId`、最终 `cardUid` 是这条链中三个不同的输入／结果。

## 范围与限制

这些是静态原生实现，不是运行时观测。`get_charInst`（`0x180c2df43`）、`_GetChessSquadConfig`（`0x180c2c5bf`）、`_PostProcessDB`（`0x180c2cdff`）和 `_LoadBattlePlayerData`（81754，`0x180c02aeb`）都有 XLua 替代分支。本批没有解码热更新 Lua，也没有证明某场运行实际选择哪条分支；不能据此宣称所有版本和玩法都已动态验证。

## 复跑

从仓库根目录执行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/same-character-source-20261111/native/extract.py \
  --out .cache/native-research/same-character-source-20261111/native/replay
```

脚本按完整方法名重新定位，提取至下一个已登记原生方法地址，包含尾部 funclet 与分段解码。`_LoadBattlePlayerData` 两个重载均保留，不通过名字猜选重载。
