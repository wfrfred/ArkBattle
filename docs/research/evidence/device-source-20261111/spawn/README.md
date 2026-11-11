# TokenCard 部署装置的来源身份

采集：2026-11-11，Windows x64 IL2CPP、metadata v29。输入指纹、方法签名、代码范围和工具身份见 `bodies/native.json`；本批只提取三个普通创建方法。

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

## 静态调用链

1. `Deck/TokenCard.SpawnInternal`（67086）签名返回 `Torappu.Battle.Character`。普通分支在 `0x18071daac` 把自身 Card 作为第二参数，在 `0x18071dabf` 调用 `BattleController.CreateToken`。
2. `BattleController.CreateToken`（65678）在 `0x1806514b8` 取得 `Card.data`，在 `0x1806514d3` 将该数据交给 `BattleFactory.CreateToken`。在 `0x1806514ed` 读取 `data+0x6c`，于 `0x1806514f6` 调用 `Character.set_cardUid`；随后 `0x180651649` 仍调用 `Character.BuildAt`。
3. `BattleFactory.CreateToken`（72801）也声明返回 `Character`，按 `BattleCharacterData.GetPrefabKey → ResourceRouter.GetTokenPath` 获取资源，再设置父节点和缩放后返回。这里没有另外生成来源身份。

`BattleCharacterData.uniqueId` 的字段布局、`Character.set_cardUid` 和 BuildAt 的后续同值写入复用[既有来源身份批次](../../card-source-identity-20261111/README.md)。装置是否属于 Character 由本批的继承链记录核实，不从 TokenCard 名称或卡牌存在反推。

这直接证明普通 TokenCard 部署的产物从 Card 数据取得 cardUid，而不是改用场上 Unit UID 或模板 ID。同一 Card 数据经这条链重复创建时复制同一个数据身份；本批没有扩大调查 TokenCard 的份数、回收、重新创建 Card 或特殊自动部署。

## 复跑与限制

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  docs/research/evidence/device-source-20261111/spawn/extract.py \
  --out .cache/native-research/device-source-20261111/spawn/replay
```

脚本按完整方法名定位并提取至下一已登记方法地址，包含分段和尾部 funclet；三个选中方法的全部分段均完整解码。`SpawnInternal`、Controller 和 Factory 均存在 XLua 替代分支，本批未验证热更新或运行游戏；不把当前静态普通分支推广到所有装置生成方式。
