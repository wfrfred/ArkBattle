# 无手卡预置 Character 的创建与来源身份

采集：2026-11-12，Windows x64 IL2CPP、metadata v29。输入、工具、签名和选中代码范围见 `bodies/{native,metadata,xrefs}.json`；配置正例见[主线 08-09 摘录](../content/README.md)。不执行客户端，也不核实 XLua 替代分支。

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

## 配置、注入与实例创建

`PredefinedData` 的四个独立字段为 characterInsts（+0x10）、tokenInsts（+0x18）、characterCards（+0x20）、tokenCards（+0x28）。实例配置与卡牌配置不是同一个数组。

1. 既有 [ConvertToBattlePlayerData（79227）](../../card-source-identity-20261111/allocation/native/ConvertToBattlePlayerData-79227.asm)在 `0x180b09966` 调用 `GenPredefinedCardsToInject`。本批提取的 helper（34447）在普通分支 `0x18278b68d` 取 LevelData.predefines，再于 `0x18278b6a5` 返回 characterCards（+0x20）。它不从 characterInsts 生成隐藏卡。开关关闭可返回 null；模式 2 另走 Hard 配置合成，本批不展开该合成 helper。
2. `CheckStagePredefine`（34446）读取对应选项开关，影响 Converter 是否接纳玩家原队伍；该方法本身不创建实例或卡牌。不能把它的布尔结果解释为“所有预置实例均有 Card”。
3. `_LoadPredefinedData`（65763）读取 characterInsts（+0x10），跳过被隐藏的项，在 `0x180669cab` 令 isToken=false，并于 `0x180669cb4` 直接调用 `_CreatePredefinedCharacter`。另一个循环处理 tokenInsts；本方法没有创建或登记 Card。
4. `_CreatePredefinedCharacter`（65760）在 `0x180664d2b` 调用 ConvertToCharacterData 创建独立 BattleCharacterData，完成黑板覆写和预处理后，非 Token 分支于 `0x180664dc1` 直接调用 BattleFactory.CreateCharacter。数据的 +0x98 字符串为空时跳过既有 Deck 查询；该可选查询也只是寻找已有的预置卡牌并互写 +0xa0 的 tokenUid，不创建本预置角色的 Card。
5. 随后 `0x180665070` 将该 data 直接交给 Character.BuildAsPredefined（77240），后者构造 BuildParam 并在 `0x180a9d151` 调用 _BuildAtInternal。BuildParam 没有 Card 字段，不能把置空的 deckBuffs 等输入误称为“Card 槽”。

08-09 的普通配置有可见的 char_391_rosmon 预置实例，characterCards 为空。结合上述普通注入与加载分支，实例可以直接创建而不为它注入或构造手卡；不能仅凭 BuildAsPredefined 的参数签名作出这个结论。

## cardUid 不要求存在 Card 对象

ConvertToCharacterData → _ConvertInternal → UID helper 的分配逻辑复用[既有分配证据](../../card-source-identity-20261111/allocation/README.md)。其生成的是 BattleCharacterData.uniqueId，生成步骤本身不要求 Card 对象。

BuildAsPredefined 将这份 data 交给 `_BuildAtInternal`；[后者已有正文](../../card-source-identity-20261111/deployment/native/_BuildAtInternal-77293.asm)在 `0x180aaac1c` 读取 data.uniqueId（+0x6c），在 `0x180aaac22` 写入 Character.cardUid。因此，无手卡的预置 Character 仍能具有 cardUid，并进入原生 Character 来源独立分组分支；不能从字段名反推一张实际 Card 必须存在。

`_PreprocessPredefinedCharacter`（65762）另有 Rune 与 GameMode 预处理；普通 DefaultGameMode.NeedPreprocessPredefinedCharacter（84127）返回 false，没有相关 Rune 时直接跳过。即使预处理创建临时 Character dummy，也不等于创建 Deck Card。本批不推广到需要特化预处理的全部玩法。

## 复跑与代码边界

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  docs/research/evidence/predefined-source-20261112/native/extract.py \
  --out .cache/native-research/predefined-source-20261112/native/replay
```

脚本按完整方法名重新定位，提取八个必要方法和两个配置类型。BuildAsPredefined 的 `0x180a9d1b8` 起、_CreatePredefinedCharacter 的 `0x18066520c` 起、_PreprocessPredefinedCharacter 的 `0x18066c568` 起为尾部切换表和对齐数据，明确排除，不当作指令解码；native.json 同时记录 codeEnd 与下一方法边界。所有选中代码分段完整解码。

配置镜像与本机客户端分别记录版本；本批闭合一个普通可见预置实例无 characterCards 的配置与实现路径，不宣称已运行该关卡，也不排除热更新、外部脚本或特殊玩法另行建立 Card。
