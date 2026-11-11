# Card 来源身份的生成与保存

核查日期：2026-11-11。只读取本机 Windows x64 IL2CPP、metadata v29，未运行游戏或验证 XLua／hotfix。机制结论由根任务统一维护在案例中，本目录只保留选中原生方法、字段和复跑入口。

## 输入与范围

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

完整路径、大小、当前注册表、工具和本脚本指纹记录在 [native/native.json](native/native.json)。本批与 Buff 覆盖组调查使用相同客户端输入，方法按本次全名定位。

选取 15 个方法，覆盖：

- Card.uniqueId 读取、构造及初始化；Character.cardUid 的 getter／setter。
- ConvertToCharacterData、TouchCharacterData、ConvertToBattlePlayerData 及内部转换。
- `_GetUniqueIdByPlayerId`、静态计数器 Reset／GetCurUniqueId 与 playerSide 位移。
- BattleCharacterData 的构造与 Duplicate。

[native/metadata.json](native/metadata.json) 保存相关字段与所选签名，包括 CharacterInst 的嵌套 Metadata 布局；`.asm` 保存完整选定方法分段；native.json 保存各段原始字节哈希。直接 xrefs 是 E8／E9 候选，不代表完整虚调用、特化或热更新调用图。

本范围核对身份的生成阶段与传递，普通部署／回收后的沿用另由同批 deployment 证据核对。不从 static counter 推出每次部署都分配 ID，也不从 Duplicate 保留 uniqueId 推出任意模式都必须共享来源身份。没有穷尽所有模式重写 BattleCharacterData 的路径。

## 复跑

从仓库根目录执行，输出到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/card-source-identity-20261111/allocation/extract.py \
  --out .cache/native-research/card-source-identity-20261111/allocation/replay \
  --xref Torappu.Battle.BattleDataConverter._GetUniqueIdByPlayerId \
  --xref Torappu.Battle.BattleDataConverter.Reset
```

默认客户端路径由共享 native.py 指定，也可用 `--game` 覆盖。客户端变化后重新核对指纹、方法名和字段布局，不能直接套用旧索引或地址。
