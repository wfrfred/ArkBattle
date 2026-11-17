# 属性求值、底值和范围覆写

2026-11-17。补核 [Case39](../../cases/39-death-attribution-and-attribute-ranges.md) 的通用属性链，不修改项目接口。`native-calculation.json` 保存19个完整原生方法、字段、常量原字节和精确选择；`native-calculation-facts.json` 汇总锚点。

输入为本机 Windows x64、metadata v29：DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。索引／地址仅适用于这些文件。没有运行客户端或验证活跃 XLua。

| 问题 | 直接确认 |
| --- | --- |
| 通用数值公式 | `((raw + Σaddition) × max(0, 1 + Σmultiplier) + ΣfinalAddition) × ΠfinalScaler`，最后按当前属性范围 Clamp，写缓存；没有通用取整。 |
| 取整 | `GetValueRoundToInt` 在 `GetValue` 之后显式调用取偶舍入。不能把它当成所有属性查询的必经步骤。 |
| raw | `GetRawValue` 直接读当前 `m_rawData`，不解析 Modifier、不 Clamp、不取整。它不是回读原始 JSON。Reset／整份覆写先按默认范围 Clamp 输入；单项 `OverwriteRawData` 直接写底值。 |
| 覆写一侧为 null | 该侧采用基础 `m_dataRange`，不继承上一次覆写；两侧均 null 直接返回，不等同 Clear。 |
| 清除与刷新 | Clear 清空该属性的整个范围覆写，再同步标脏；已初始化 Entity 的通知链会重新计算攻击周期并保留冷却进度。`refresh=true` 另显式求值，不是控制同步通知的开关。 |
| 攻速两层范围 | 属性默认下限20；周期公式另按 `[10, 600]` Clamp。普通默认范围下看似相同，覆写属性下限后不可合为一个20。 |

缓存／同步通知的 Entity 登记、属性分支和 `OnAttackTimeChanged → ResetButKeepProgress` 复用[2026-11-05 原件](../attack-speed-timing-20261105/dirty/native.json)及其[映射与结论](../attack-speed-timing-20261105/dirty/findings.json)。本批重新提取范围写入和标脏入口，闭合两者连接。

raw 的来源必须按写入路径判断。[出生附加调查](../../cases/24-deployment-cost-and-supply.md#十卡牌附加与部署时序)已确认 DeckBuff 在 Character 初始化中通过 `AddBuff` 登记场上 Modifier；松桐生命修正是实际正例，不会因它早于初始 HP 建立就自动变为 raw。创建者先改传入属性资料与后登记 Modifier 是不同路径；本批不穷举全部 CardBuff／模式预处理。

```sh
PYTHONPATH=.cache/native-research/python python3 docs/research/evidence/attribute-ranges-20261117/extract_native.py --out /tmp/attribute-native-replay.json
```

脚本复用 `native.py`，固定 Capstone 5.0.7，先校验输入指纹；按下一 metadata 方法边界展开分段，保留原字节。输出必须在历史批次外。用干净依赖环境时可用 `uv run --offline` 执行同一脚本。项目差异仅作只读标注：当前 `action/timing.ts` 的周期公式仍使用20下限，且各领域尚未持有独立的动态属性范围；本批不决定其重构形状。
