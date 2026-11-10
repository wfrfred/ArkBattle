# Buff 到期与逐层移除：原生证据

核查日期：2026-11-11。只读取已安装 Windows x64 IL2CPP 客户端，没有运行游戏；不修改 Core、Data 或架构契约。机制结论统一维护在 Case 01，本目录保留选中方法与复跑入口。

## 输入

| 文件 | SHA-256 |
| --- | --- |
| `GameAssembly.dll` | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

完整路径、大小、metadata v29、注册表位置、工具与脚本指纹见 [native/native.json](native/native.json) 的 provenance。方法按本次全名和实际调用定位；本批输入与 2026-11-10 补证相同。

## 选择范围

[native/metadata.json](native/metadata.json) 保留 Buff、BuffData、BuffContainer 和 OverrideGroup 的相关字段与签名。[native/native.json](native/native.json) 记录 24 个方法、2 个 helper 的分段范围与字节哈希，`.asm` 为对应指令。范围包含：

- Reset 中时长、实际层数和 `clearAllStackCntWhenTimeUp` 的初始化。
- Buff.OnTick、预处理 delta、周期触发、到期减层、属性重载与 MarkFinish。
- BuffContainer.Tick 的两次遍历、结束扫描、列表／UID 移除、结束程序及组成员移除。
- BattleController 的下一帧回收登记、消费及池回收 helper；Buff.OnRecycle。

[native/xrefs.json](native/xrefs.json) 是直接 E8／E9 候选，并结合调用者指令确认，不代表穷尽虚调用或运行时调用。池回收 helper `0x1853acb60` 和 OnRecycle 分派 helper `0x185e87f60` 来自本批调用指令；后者代码截到 `0x185e8839c`，其后为跳转表数据，不作为指令解释。其余非本问题的特化 Buff、XLua／hotfix 和完整游戏运行没有验证。

## 复跑

从仓库根目录执行：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/buff-group-expiry-20261111/expiry/extract.py \
  --out .cache/native-research/buff-group-expiry-20261111/expiry/replay-native \
  --xref Torappu.Battle.Buff.OnTick \
  --xref Torappu.Battle.Buff.OnLateTick \
  --xref Torappu.Battle.Buff.OnFinish \
  --xref Torappu.Battle.BattleController._UpdateDelayToRecycleBuffContainer \
  --expand 0x1853acb60 --expand 0x185e87f60 \
  --code-end 0x185e87f60:0x185e8839c \
  --extra Torappu.Battle.BattleController.OnTick
```

默认读取共享脚本规定的本机安装路径，可用 `--game` 覆盖。跨版本应重新核对输入指纹、方法身份、helper 地址和跳转表边界，不能直接复用地址。共享 `replay.py` 可按 native.json 的方法选择器独立复查；xrefs 和专用 helper 边界用以上命令复跑。
