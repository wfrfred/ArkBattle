# 干员静态资料的跨表绑定

2026-11-21 核对角色阶段、技能槽位、技能等级、天赋候选及模组阶段如何关联。结论见 [Case 06](../../cases/06-talent-lifecycle-and-model.md#干员跨表绑定2026-11-21)。

| 摘录 | 输入与选择 |
| --- | --- |
| [角色绑定](character-bindings.json) | `character_table.json`，选取玫兰莎和泥岩的阶段、技能槽位与天赋，及拜松共享技能、蜜蜡技能槽的召唤物引用。 |
| [技能等级](skill-levels.json) | `skill_table.json`，选取玫兰莎 S1 七级、泥岩 S2 七级与专三、泥岩 S1 所引用共用技能的一级。 |
| [装备登记](equipment-registry.json) | `uniequip_table.json`，选取泥岩的 `charEquip` 与三个装备条目的身份及解锁。 |
| [模组阶段](equipment-parts.json) | `battle_equip_table.json`，选取泥岩 X、Y 阶段属性与候选，另取黍的字符串黑板和迷迭香的新增／覆写正例。 |

角色与技能输入来自 [固定表 `63c7cec7`](https://github.com/Kengxxiao/ArknightsGameData/tree/63c7cec73c3858d0ae913f85cc89af3cef4d744f/zh_CN/gamedata/excel)，与[原始文件 Git blob 和 SHA-256](../route-operations-20261107/data-source-verification.json)比对一致。装备输入来自 [固定表 `17759cc8`](https://github.com/Kengxxiao/ArknightsGameData/tree/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel)，完整文件指纹见[前次配置摘录](../unit-audit-20261110/operator-config/configuration.json)。范围 `1-1`／`x-4` 使用仓库[已筛选夹具](../../../../test/fixtures/arknights/main-mode-units.json)的 `ranges` 段，夹具声明版本为 `17759cc8`，SHA-256 为 `53d0c51a46f346015138c9598fc28029694dca1533dc3f5848b1123d2ef3289e`。跨批次只对照这里列出的引用与取值，表镜像和客户端静态证据各自固定版本。

2026-11-21 对照 [PRTS 泥岩](https://prts.wiki/index.php?title=泥岩&oldid=446594)与 [PRTS 玫兰莎](https://prts.wiki/index.php?title=玫兰莎&oldid=442324)的技能开放和分级数值。JSON 结构与路径以固定镜像的表为依据，PRTS 用于玩法互证。

两处 `missingFields` 是对完整表的精确路径检查。`skill_table` 中缺少 `/skchr_mudrok_1`，`battle_equip_table` 中缺少 `/uniequip_001_mudrok`。前者在角色技能槽用作资源覆盖，后者在装备登记表属于 `INITIAL`。

每份摘录保存 `config.py` 的完整 `provenance.argv` 和 `provenance.inputs`。在仓库根目录按 `provenance.sourceUrl` 取得对应的完整表，比对字节 SHA-256 后放入 `argv[0]` 指定路径。复跑到新目录，保留原件。

```sh
python3 - <<'PY'
import json
from pathlib import Path
import subprocess

batch = Path("docs/research/evidence/operator-table-bindings-20261121")
output = Path(".cache/native-research/operator-table-bindings-replay")
script = ".agents/skills/arkbattle-native-research/scripts/config.py"
for name in ("character-bindings", "skill-levels", "equipment-registry", "equipment-parts"):
    evidence = json.loads((batch / f"{name}.json").read_text())
    args = evidence["provenance"]["argv"]
    args[args.index("--out") + 1] = str(output / f"{name}.json")
    subprocess.run(["python3", script, *args], check=True)
PY
```

本次范围是表结构、实际引用与代表参数。技能资源内部节点、特殊模式配置的取舍优先级、热更新和运行时行为仍由相应案例核实。
