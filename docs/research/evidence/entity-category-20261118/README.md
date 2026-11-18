# 豆苗磐蟹的战中类别切换

2026-11-18 补核。结论见[单位分类研究](../../cases/36-unit-classification-and-combat-tags.md#3-初始化与变化范围)。本批复用已归档的内容原件，新增节点正文与黑板键的定位。

| 环节 | 原件与定位 |
| --- | --- |
| 实际 Prefab | [生命机制内容](../resource-mechanisms-20261114/life/content.json) 的 `/result/components/1812` 保存 `token_10014_bstalk_crab` 根组件，脚本为 RallyPoint，Prefab `_category=2`。`1789` 是 Crab 的 `crab_s_1[listener]`，`1782` 是 Flower 的计时入口，`1795` 是 `crab_switch`，其 `_activeBuffs.Array[0]` 绑定 `crab_t_1[start]` 并传入 `category=1`、`mode=1`。 |
| 节点配置 | [Buff 模板](../resource-mechanisms-20261114/life/templates.json) 的 `/result/selectedTemplates/4` 是击倒监听器，事件 27 先切类别再切 Flower。索引 `5` 是恢复模板，事件 0 先切类别，再执行 RallyPointReborn 和 SwitchMode。节点配置的 `NONE,TRAP_OR_ITEM` 对应掩码值 2。 |
| 节点执行 | [节点正文](node.json) `SwitchRallyPointCategory.Execute`（98855）在 `0x1810f006b` 读取 `category` 黑板键，`0x1810f007d` 调用 `Blackboard.TryGetInt`。命中时取黑板值，否则取节点 `+0x10` 的 `_category`。`0x1810f00ad..bb` 按虚槽 242 派发。 |
| 写入与读取 | [分类原件](../unit-classification-20261114/identity/native.json) 记录虚槽 242、`RallyPoint.SwitchCategory`（78633）和 `Token.SwitchCategory`（78792）。前者在 `0x180aff492` 调用后者，后者在 `0x180aff685` 写入 `m_category`（`+0x584`）。[生命机制正文](../resource-mechanisms-20261114/life/native.json) 中 `RallyPoint.get_category`（78627）在 `0x180affa2c` 直接读取同一字段。 |
| 索敌消费 | [分类原件](../unit-classification-20261114/identity/native.json) 的 `TargetOptions.VerifyTarget`（76369）在 `0x180a40a5e..71` 将 `targetCategory` 传给 `BattleUtil.VerifyTarget`（79605）。[索敌正文](../targeting-pipeline-20261109/qualification-mechanisms.json) 在 `0x180b438be..ce` 通过虚槽 49 读取目标类别并检查掩码交集。 |

客户端 DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。内容 Bundle 的路径、指纹、PathID 和 MonoScript 绑定见复用原件。配置、客户端普通分支与[豆苗的战术点说明](https://prts.wiki/w/豆苗)相符。本批未运行客户端或核对活跃 XLua。

## 复跑

从仓库根目录读取相同指纹的本机客户端。第一条命令重提节点正文，第二条命令用既有字符串定位逻辑复核 `0x1810f006b` 的 metadata 字面量。

```sh
work=.cache/native-research/entity-category-20261118/replay
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py --out "$work/body.json" disasm 98855
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/unit-classification-20261114/identity/extract.py --out "$work/literals.json" --body 98855
```
