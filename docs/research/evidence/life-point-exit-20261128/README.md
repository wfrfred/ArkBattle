# 关卡生命值：普通出口、个体损失量及全局修改

2026-11-28 定向静态核对，结论见[案例 13](../../cases/13-route-and-movement-timing.md#52-关卡生命值补核2026-11-28)。Windows x64、metadata v29，DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，与前述出口批次一致。未运行游戏或执行 XLua；配置为本地 assets/arknights-game-data revision `17759cc8cdf37388414145d16262a3a06f3ab25e`，逐文件 SHA256 见 content.json。

- search.json：LifePoint 方法清单。
- body.json：各整数生命点 setter、ModifyLifePoint、AddTempLifePoint、Enemy 个体扣血量 getter/setter、相关 gameplay 和 action 节点方法起始片段。
- xrefs.json：直接 E8/E9 调用候选及前置分派/计算入口原件；不覆盖内联、间接、委托和 XLua。个体 setter 零直接候选与已证初始化内联一致。
- full.json：完整逻辑方法范围分段重提（含 _DoApplyGlobalModifier、Roguelike _OnModifyLifePoint 和 relic preprocess）。
- extra.json：RoguelikeBattleManager.OnApplyingGlobalModifier 的实际内联计算、Entity.OnOutputModifier、Enemy 创建和初始化入口。
- assign.json、enemy-data-type.json：Enemy._AssignData 及 LevelData.EnemyData 字段；Enemy/options 类型复用 [既有字段证据](../route-creation-20261107/initialization/README.md)。
- content.json：固定配置的实际 relic/item、模板、EnemyData 非默认扣血数统计和部分原节点、霍尔海雅模组。模板扫描选择包含 LifePoint/LIFE_POINT 字样的 event actions；未查出间接或通用未标明该 target 的消费者，不是全局不存在的证明。

## 复跑

从仓库根目录，输出到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research/scripts
uv run --locked --offline "$skill/native.py" --out /tmp/life-search.json search LifePoint
uv run --locked --offline "$skill/native.py" --out /tmp/life-data-type.json type 'Torappu.LevelData/EnemyData'
uv run --locked --offline "$skill/native.py" --out /tmp/life-body.json disasm 65546 65548 65601 65602 77639 77640 84094 87466 87721 87724 98239 98839 98842
uv run --locked --offline "$skill/native.py" --out /tmp/life-setter-xrefs.json xrefs 0x180ad0030
uv run --locked --offline "$skill/native.py" --out /tmp/life-modify-xrefs.json xrefs 0x180658490
uv run --locked --offline "$skill/native.py" --out /tmp/life-global-dispatch.json disasm-at 0x180663d30
```

full.json、extra.json、assign.json 的 `result.bodies[].selector.fullname` 可直接传入 `docs/research/evidence/elemental-timing-20261102/extract_schedule.py --out /tmp/life-full.json --method <fullname>`（逐项添加选择器），由该脚本处理方法范围内不连续的 PE 片段。配置按 content.json 中记录的路径与 JSON Pointer 重提；EnemyData 全部 enemyData.lifePointReduce 中筛 m_defined=true，按 m_value 计数。
