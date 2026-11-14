# 战斗标签、筛选标签及攻击方式

采集：2026-11-14。本目录只记录原生事实，不规定 ArkBattle API。

当前本机 Windows 客户端：

- `GameAssembly.dll` SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`
- `global-metadata.dat` SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`

每份 JSON 保存重新计算的客户端指纹、方法索引和地址。结论见 [findings.md](findings.md)。

| 文件 | 范围 |
| --- | --- |
| `metadata-inventory.json` | 全量 Torappu.Battle 名称扫描后的标签相关投影；排除 stage、trace 等误命中 |
| `field-owners.json` | 全 Torappu 类型中具有 `enemyTags`、`race`、`extraGroupTags` 精确字段名的所有者及方法 |
| `tag-bodies.json` | 标签 getter、Entity/Enemy/Character/Trap 检查、Character GroupTag 查询 |
| `tag-lifecycle-consumers.json` | Enemy 初始化、数据赋值、模式/复活、CheckFilterTag、组标签添加 |
| `formula-tag-consumers.json` | AtkScaleUp、CheckEnemyApplyWay、Enemy 选择过滤的完整方法体 |
| `source-construction.json` | EnemyDB 构造资料及相关方法定位 |
| `database-folding.json` | Enemy 等级数据折叠、定义字段覆盖的完整方法体 |
| `group-tag-*.json` | Rune 包装、Character 调用者及 Dummy/卡牌资料预处理时点 |
| `group-tag-switch-tables.json` | #65762 尾部两个 switch 表的原始字节及代码引用，解释线性解码停止 |
| `metadata-structs.json` | `PowerData` 字段顺序、`IUndefinable` 接口与包装字段声明 |

`inventory.py`、`field_audit.py` 从本机包重新提取元数据；`metadata_structs.py` 只解析当前 metadata 的声明，不推断运行时偏移。反汇编复用 [extract.py](../../facing-semantics-20261113/extract.py)；每份 JSON 的 `result.selection` 保存完整选择器。该工具一直读取到下一个元数据方法地址，包含独立 `.pdata` 片段。`archive.py` 把缓存结果归档，并将较大的发现清单投影为相关记录。

真实 Prefab 与模板绑定复用同批 [config/prefabs.json](../config/prefabs.json)、[config/templates.json](../config/templates.json)，不重复提取。同批静态表的版本及标签分布见 [config/static-inputs.json](../config/static-inputs.json)。其镜像数据版本与本机客户端指纹分别标识，不假定两者同版本。

本次证据是静态输入、资源绑定与可执行分支；没有启动客户端或记录一场实战。名称扫描、直接调用候选不证明覆盖所有反射、虚调用或 XLua 替换。

`group-tag-timing.json` 中 #65762 的 `0x18066c561–0x18066c5b3` 片段标记 `fullyDecoded=false`：`0x18066c568` 与 `0x18066c58c` 是已由间接分支引用的两个 switch 目标表，后接字节索引表；线性反汇编将数据当作指令，在第二表入口停止。`read_switch_tables.py` 直接从当前 DLL 读取并归档这些字节。Create、MakeDummy、PreprocessCharacter、Recycle 均位于完整解码的 `0x18066c0e4–0x18066c510` 代码片段；本报告不将整个“入口到下一方法地址”范围宣称为可完整解码的指令流。
