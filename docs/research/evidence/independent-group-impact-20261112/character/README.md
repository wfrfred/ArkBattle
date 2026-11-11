# Character 来源的实际分组样本

核查日期：2026-11-12。本目录补齐浊心斯卡蒂本体／海嗣的实际治疗来源，以及帕拉斯三技能的角色模式绑定；不修改 Core 或规定分组 API。

## 输入与范围

本机 Windows x64 IL2CPP、metadata v29。GameAssembly.dll SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。未运行游戏或验证 XLua 替代分支。

`bodies/bindings.json` 保存三个实际 Actor 的八个选中组件：

- `char_1012_skadi2`：Default／S1／S2 模式的 HealAura；均给出 `skadi2_heal`，来源独立、DEFAULT。
- `token_10017_skadi2_dedant`：同三种模式的 HealAura，描述相同，组件类型为 `AuraWithHostAsSourceAbility`。
- `char_485_pallas`：Actor 的模式数组，以及 `Modes/S3/Body/Aura` 的 `pallas_s_3[peak]`；来源独立、DEFAULT，离开目标或能力分离时移除。

每条记录保存 Bundle 指纹、SerializedFile／PathID、对象哈希、层级、MonoScript 关联及必要描述字段。资源读取器复用 [既有配置提取器](../../buff-group-expiry-20261111/content/extract.py)，不重复保存整个 Prefab。

## 海嗣的实际来源

`bodies/native.json` 与两个 ASM 保存完整普通方法区间：

1. `AuraWithHostAsSourceAbility.DoAttach`（94085）：确认 owner 是 Token，读取 `tokenOrHostUid`，在 `0x180f98031` 调用 `UnitManager.GetFirstCharacterByUid`，将取得的宿主 Character 弱引用写入 `this+0x190`。
2. `DealTargetTouched`（94084）：在 `0x180f97cbb` 解析该宿主引用；`0x180f97cd8` 令 r9=宿主，于 `0x180f97cfd` 调用 `Entity.AddBuffsToIdList`。该方法的第 3 个显式参数是 source，签名复用 [既有 Entity 记录](../../leithanien-summons-20261109/movement/native.json)中的 67546。

因此海嗣 Aura 在接触目标时，以宿主浊心斯卡蒂为 Buff source，不是以执行 Aura 的海嗣自身为 source。本体与海嗣重叠提供 `skadi2_heal` 时，实际来源相同，进入同一个来源组；只替换组身份表示、不改变来源转发，不会额外制造一份治疗。不同来源 Card 的分组仍不同。该结论来自配置与普通方法的接续，不是实机治疗日志。

帕拉斯 `pallas_s_3[peak]` 的模板、回写来源的 stop 子 Buff 及共同 overrideKey 复用 [既有配置](../../buff-group-expiry-20261111/content/configurations.json)；`skchr_pallas_3` 切换 mode=2 的技能组件也在该记录。此处补 Actor 的 S3 Aura 直接绑定，不重提整套技能或 Buff 分组算法。

## 复跑

从仓库根目录输出到独立目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  docs/research/evidence/independent-group-impact-20261112/character/extract.py \
  --out .cache/native-research/independent-group-impact-20261112/character/replay
```

脚本按当前完整方法名定位，仅提取上述两个方法。所有选中代码分段完整解码；配置、ASM、JSON result 和输入／脚本指纹可逐项比较。没有把来源选择改写成 source=self，也未把仅有身份链的装置库存或预放干员当成已观测的独立 Buff 输出差异。
