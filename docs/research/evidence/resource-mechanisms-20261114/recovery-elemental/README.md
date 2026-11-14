# HP／EP 回复与元素：2026-11-14 取证

结论草稿见 [findings.md](findings.md)，根案例统一更新 Case25／29／34／37。本目录只保存研究，未修改产品代码或确定新简化。

## 输入与限制

- 官方Windows安装目录：`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。
- GameAssembly SHA256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29。
- 静态镜像各自固定提交：EP表／关卡／EnemyDB `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`；角色表 `17759cc8cdf37388414145d16262a3a06f3ab25e`；技能表 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`；BuffDB `bffe31bf66739842f99b457327066c695e2af389`。输出逐文件保存原始字节SHA／Blob身份及选择Pointer；镜像不标作官方文档。
- 本机Holder共9054模板，来源Bundle SHA `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`；完整来源列表在配置输出provenance。
- 均为静态取证，没有运行游戏或验证活跃XLua。`complete`只表示指定输入处理成功；无命中不是废弃或不存在证明。

## 文件

| 文件 | 选择及职责 |
| --- | --- |
| `inventory.json` | 当前相关类型及普通方法／字段定位，347个所选方法；大共享owner按记录正则过滤。索引不自行证明语义。 |
| `core-operations.json` | HP／EP普通回复节点、EP损伤来源、EP setter／自然回复、EP提交、免疫与恢复缩时等46个完整方法。 |
| `formula-operations.json`、`maximum-ep.json`、`constants.json` | 精确公式、5%常量、Enemy最大EP的levelType附加项。 |
| `burst-controller.json` | EPController全部19个普通方法完整体，除旧Case25外独立补核开始／结束通知、异常修改器与缩时。 |
| `prezero-operations.json` | EP归零前通知与EP恢复类型/剩余进度查询节点。 |
| `overflow-operations.json` | ES读写节点、ES作伤害、来源实体比较、ES正值通知。资源提交复用同批life／damage，避免混淆ES与屏障。 |
| `special-recovery.json`、`hp-synchronization.json` | CopyHealth、ATK转回复属性、巨型Boss治疗，以及SetHpSameToSource／NewHp。 |
| `ep-regeneration-content.json` | 余人数checker与属性更新节点的完整体。 |
| `attack-ep-source.json` | AbstractBasicAttack读取BB与附带EP节点构造；实际Touch默认0值被EnemyData覆写的证据。 |
| `metadata-details.json` | 元素／Buff事件枚举常量、正文RIP metadata usage、float32读取的独立解码，包含解码脚本及每份body输入指纹。 |
| `static-inputs.json`、`level-examples.json` | 完整五型EP表、所选角色天赋／Trait／技能，以及实际关卡与EnemyDB原文投影。 |
| `content.json`、`templates.json` | 本机明确选择的完整组件／脚本PPtr与模板递归闭包。未解析可选第二script bundle不存在的事实显式保留。 |
| `holder-usage.json` | 全9054模板的恢复／元素动作节点locator；不能把每个命中当实际启用。 |
| `rare-inputs.json` | 全1180 Bundle／33411相关MonoBehaviour，检测数值29及字符串属性、内联JSON与稀少回复节点，0失败。包含7个token包；无ElementHealViaMaxHpRatio引用。 |
| `native-verification.json`、`configuration-verification.json` | 独立重提／配置复跑对照结果。复查原体放独立cache，未覆盖历史原件。 |

共享native正文提取器为 `docs/research/evidence/facing-semantics-20261113/extract.py`，遍历.pdata片段直到下一metadata方法。每份native JSON的 `result.selection` 保留确切selectors。不能只用首段ret截掉异常／switch后续分支。metadata decoder复用unit-audit中压缩整数读取，指纹已记录。

## 复跑

从仓库根执行，`UV_CACHE_DIR` 使用项目缓存。原始静态表下载URL／版本／字节哈希见 `static-inputs.json`，脚本会拒绝不匹配的输入。以下不会访问或修改游戏运行状态。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
batch=docs/research/evidence/resource-mechanisms-20261114/recovery-elemental
work=.cache/native-research/resource-mechanisms-20261114/recovery-elemental/replay

uv run --offline --locked "$batch/inventory.py" --out "$work/inventory.json"
python "$batch/extract_static.py" --ep-table .cache/native-research/resource-mechanisms-20261114/recovery-elemental/ep_breakbuff_table.json --out "$work/static-inputs.json"
python "$batch/extract_levels.py" --out "$work/level-examples.json"
python "$batch/extract_content.py" --out "$work/content"
python "$batch/scan_recovery_inputs.py" --out "$work/rare-inputs.json"
python "$batch/verify_native.py" --out "$work/native"
```

`verify_native.py`从上述所有native原件取正文索引，重新执行共享提取器，一次加载当前Native，再比较名称、logicalEnd、全部片段／指令／目标解析。它先确认重叠原件相同，不以方法计数替代正文相等。

`extract_metadata.py`的重复 `--bodies` 使用上述native JSON；其参数记录在输出的 `provenance.caseTool.bodyInputs`。当前锁定capstone5.0.7。枚举解码与浮点读取没有依赖反编译伪代码。

## 复用原件

- Case25：`elemental-timing-20261102`、`elemental-zero-duration-20261105`；本批补全当前第五型和原始BreakData表。
- Case27：`nymph-action-settlement-20261103`；EP来源与HP不是同一笔提交。
- Case29：`healing-settlement-20261103`、`healing-negative-values-20261106`、`hp-regeneration-20261113`；本批补实际溢出源、自然EP及已有事件消费者。
- 同批 `damage`：完整ApplyModifier、flags及环境EP的齐尔查克消费者。
- 同批 `life`：ES／负生命提交、号角生命复原、巨型Boss特殊生命规则。

本批未知见[覆盖矩阵](coverage.md)及[案例37第4节](../../../cases/37-resource-mechanism-coverage.md#4-没有被当作废弃或批准简化的项目)；它们未被自动判作延期、废弃或可简化。
