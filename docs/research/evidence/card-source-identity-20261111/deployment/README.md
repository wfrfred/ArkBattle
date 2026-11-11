# Card 部署、退场与再次部署的身份链

核查日期：2026-11-11。只读取本机 Windows x64 IL2CPP metadata v29 和原生指令，未运行游戏或验证 XLua／hotfix。机制结论由上层案例统一维护，本目录保存输入、选择和复跑入口。

## 输入与范围

| 文件 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

完整路径、大小、注册表及工具／脚本指纹见 [native/metadata.json](native/metadata.json) 和 [native/native.json](native/native.json) 的 provenance。方法按本次完整名称定位，未套用较早客户端的 Character 方法索引。

选择 19 个方法，范围为：

- Deck 根据指定 Card 执行 SpawnCharacterOrToken、Card.SpawnPrefab 与 CharacterCard.SpawnInternal；Controller.CreateCharacter 将数据身份写入所创建的 Character，BuildAt／_BuildAtInternal 接续本次部署绑定。
- Character 的 Withdraw、FinishMe、OnFinish 和 OnRecycle；Controller.OnCharacterFinished 根据 cardUid 回到 Deck。
- Deck.RecycleCard 对既有映射项调用 Card.OnRecycle；Card.Draw、OnTick 与普通 CharacterCard 的 cardPolicy。

字段摘录保留 Deck 的映射、Card 的数据／计时和 Character 的 cardUid／数据引用等；`xrefs.json` 是两个入口的直接 E8／E9 调用候选，不代表完整动态分派图。普通虚调用结合本次签名 slot 和具体 CharacterCard 实现解释。

`Deck.RecycleCard` 的 `0x1806fc2e0` 起、`Card.OnRecycle` 的 `0x1806ecf68` 起为跳转表数据，选中代码分别截于这两个地址；没有将表数据当作指令。每段的代码边界、字节哈希与解码完整性保存在 native.json。

本批范围是普通 CharacterCard 退回原卡、冷却后再次部署的路径；没有用它概括删除后新建 Card、TokenCard 多库存、预置创建、特殊原地复活、术语移动或模式替换。OnCharacterFinished 对特殊结束原因的分支如实保留，普通路径的结论不越过这些条件。

## 复跑

从仓库根目录执行，输出到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/card-source-identity-20261111/deployment/extract.py \
  --out .cache/native-research/card-source-identity-20261111/deployment/replay \
  --xref Torappu.Battle.Deck/Card.OnRecycle \
  --xref Torappu.Battle.Deck/CharacterCard.SpawnInternal \
  --code-end 0x1806fbed0:0x1806fc2e0 \
  --code-end 0x1806ecc70:0x1806ecf68
```

默认读取共享工具指定的客户端位置，可用 `--game` 覆盖。源码指纹变化后应重新定位身份、调用实参与跳转表边界，不能把本次地址直接用于其他版本。专用脚本复跑包含完整选中代码范围；共享选择器复查不代替该人工代码边界。
