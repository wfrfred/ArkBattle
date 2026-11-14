# HP／EP资源机制全链调查

研究入口：[案例37：完整覆盖与项目边界](../../cases/37-resource-mechanism-coverage.md)。本批调查原生输入、传播、接收、资源提交、生命／爆发后继及实际内容绑定；不修改Core、Data、Content或测试。

| 专项 | 原件与复跑 | 对应案例 |
| --- | --- | --- |
| 分类／权限／接收 | [damage](damage/README.md) | [38](../../cases/38-damage-classification-and-permissions.md) |
| HP／ES／债务／生命干预／复活 | [life](life/README.md) | [11](../../cases/11-damage-apply-and-hp-application.md) |
| HP／EP回复及元素 | [recovery-elemental](recovery-elemental/README.md) | [25](../../cases/25-elemental-burst-recovery-timing.md)、[29](../../cases/29-hp-and-ep-healing-settlement.md) |
| 最终结束／归属／属性范围 | [death-attributes](death-attributes/README.md) | [39](../../cases/39-death-attribution-and-attribute-ranges.md) |

各专项保留原始来源指纹、选择器、完整方法片段、配置Pointer／PPtr、扫描范围、失败计数和独立重提比较。版本、静态调用推导和实机观测分别记录。未运行游戏／验证活跃XLua，不把无引用候选判为废弃，也未批准新的简化或模式排除。

机制结论以案例为准；原件不因旧结论修正而重写。共享归档清单由 `archive.py --batch docs/research/evidence/resource-mechanisms-20261114` 生成。专项专用解码须按各README复跑，通用replay.py不能代替这些JSON／Prefab／自定义metadata解码。
