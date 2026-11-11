# 装置、召唤物与 Character 的继承边界

核查日期：2026-11-11。只读取当前客户端的五个类型定义、Character.cardUid 字段及四个方法签名，不提取或执行方法正文。

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

Windows x64 IL2CPP、metadata v29。完整来源路径、工具与提取脚本指纹见 metadata.json.provenance；result.types 同时保留原始 parentIndex 与解析后的 parentName。

直接声明的继承链为：

```text
Trap → Token → Character → Unit
Enemy → Unit
```

因此原生 Trap 也是 Character，继承其 cardUid 字段；不能把 Character 的类型判断理解成只接受普通干员。这里没有证明所有玩家称作“装置”的对象都使用 Trap 类型，也没有把 Character 等同于项目的 Deployable。

选中的 Character 声明包括：

- cardUid 的 backing field：uint，偏移 +0x528。
- get_cardUid／set_cardUid：77135／77136。
- BuildAsPredefined：77240，接受 BattleCharacterData、Tile、Direction。
- BuildAsRuntimeInst：77241，接受 BattleCharacterData、Tile、Direction、SideType、PlayerSide。

后两个入口的签名没有 Card 参数；**本批未读方法正文**，不能据此断言它们如何赋值 cardUid 或如何关联手卡。运行时 XLua 替代及具体 Prefab／调用链不在本批范围。

从仓库根目录复跑到独立目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/device-source-20261111/hierarchy/extract.py \
  --out .cache/native-research/device-source-20261111/hierarchy/replay
```

复查时比较 metadata.json.result、输入指纹和 extractionScript 指纹；不要将仅有签名的记录解释成完整原生方法取证。
