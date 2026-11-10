# EnemySkill、Ability 与共享 SP

取证日期：2026-11-10。问题是敌人技能的状态、资源和执行分别归谁，以判断其与 ArkBattle Action／Skill 的关系。结论集中在[案例 08 第 8 节](../../cases/08-action-eligibility-and-interruption.md#8-enemyskill-的触发动作与共享-sp2026-11-10)，本批不修改实现或确定新的 API。

## 来源与范围

- 当前 Windows x64 客户端，IL2CPP metadata v29。
- GameAssembly SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 当前 Prefab：`battle/enm_pfb_17.ab`、`battle/enm_pfb_3.ab`、`battle/enm_pfb_28.ab`，分别选取霜星、圣堂射手和炎佑；外部 MonoScript 按资源引用解析。Bundle、对象与读取工具指纹见 `content/bindings.json`。
- EnemyDB 和主线 4-10 使用固定镜像修订 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`；完整源文件及关卡摘录与既有来源清单核验哈希。镜像与当前客户端分别登记，不推定所有最新热更新参数一致。
- PRTS 为社区说明，访问位置与采用的事实见 `prts.json`；原生执行与实际配置以本批摘录为准。

只核对静态原生普通分支与所选资源绑定。未执行客户端、XLua 或运行时注入；未穷举所有敌人特化、装填后继及动态模式切换。

## 文件

| 文件 | 用途 |
| --- | --- |
| `native/probe.json` | 本次客户端、工具及注册定位指纹。 |
| `native/contracts.json` | 选定字段、方法、当前索引及分派槽。 |
| `native/selected-bodies.json` | 初始化、资格、计时、SP 支付、施放回调，以及 BasicSkill 对照方法的指令。 |
| `native/facts.md`、`native/extract_native.py` | 事实锚点、适用限制及原生复提入口。 |
| `content/bindings.json` | 三个 Actor 的 EnemyData、Enemy／Mode／EnemySkill／Ability 引用、Trigger 与主线出生配置。 |
| `content/facts.md`、`content/extract_bindings.py` | 内容结论、限制和复提入口，复用已有 Unity 读器。 |
| `prts.json` | 社区来源、访问位置、摘要及使用限制。 |

广搜与完整类型中间产物不归档。`fullyDecoded` 只表示选中区间完成解码，不证明全部间接调用或所有派生类都相同。

## 复查

从仓库根目录运行，输出到独立目录：

```sh
enemy_skill_game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
enemy_skill_work='.cache/native-research/enemy-skill-semantics-20261110/replay'
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline docs/research/evidence/enemy-skill-semantics-20261110/native/extract_native.py --game "$enemy_skill_game" --out "$enemy_skill_work/native"
python3 docs/research/evidence/enemy-skill-semantics-20261110/content/extract_bindings.py --game "$enemy_skill_game" --out "$enemy_skill_work/content/bindings.json"
```

内容脚本默认读取本机缓存的固定版本 EnemyDB 和关卡原文；可通过 `--database`、`--level`、`--level-manifest` 指定位置，来源及哈希须与本批记录一致。资源解码依赖仓库中已归档的读器，引用路径和指纹保存在 provenance。

`archive.json` 登记共享 replay 工具能够重提的原生选择器和输入。资源对象解码与镜像摘录使用本批专用入口，不将通用 replay 宣称为全部材料的恢复工具。
