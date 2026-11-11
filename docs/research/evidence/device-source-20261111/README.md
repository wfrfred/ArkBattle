# 装置的 Character 来源身份

核查日期：2026-11-11。核实 independentCharacterSource 中的 Character 是否包含装置，以及手牌部署如何写入 cardUid。机制结论集中在 [Case 01 §9.7](../../cases/01-buff-installation-and-parent-scope.md#97-character-包含召唤物与装置)与 [Case 24](../../cases/24-deployment-cost-and-supply.md#召唤物与装置的部署身份)，不修改 Core 或规定项目类型映射。

## 输入与选择

本机 Windows x64 IL2CPP、metadata v29。没有运行游戏或验证 XLua 替代分支。

| 文件 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

| 目录 | 范围 |
| --- | --- |
| [hierarchy](hierarchy/README.md) | Character、Token、Trap、Enemy、Unit 五个类型的父类，Character.cardUid 字段及相关方法签名；签名不代替未提取的创建正文。 |
| [spawn](spawn/README.md) | TokenCard.SpawnInternal 与 BattleController.CreateToken 的普通部署链、Card 数据读取和 cardUid 写入。 |

Buff.Reset 的 Character 类型判断复用 [buff-group-expiry](../buff-group-expiry-20261111/README.md)；Card.get_uniqueId、Character.cardUid getter／setter 和 BuildAt 后续写入复用 [card-source-identity](../card-source-identity-20261111/README.md)。不重复归档这些已有正文。

## 复查

各子目录 README 提供专用提取命令。共享清单与选择器复查：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/device-source-20261111
uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/device-source-20261111 \
  --out .cache/native-research/device-source-20261111/shared-replay
```

本批不据此认定所有原生 Character 都经过可操作手卡，也不将预置、特殊运行时创建或多库存回收路径冒充已闭合。Trap 装置参与 Character 类型分支，直接来自 metadata 继承关系，不来自中文名称或项目 Capability。

两项专用提取已在独立目录复跑：五个类型的记录、全部 JSON result、三份 ASM 和输入／脚本指纹一致，选中原生分段全部完整解码。另以直接读取 metadata 类型表的方式核对父类关系。共享选择器复查完成七个方法，无不可复查项；五个精简继承记录由专用脚本复查，不依赖共享选择器推断。
