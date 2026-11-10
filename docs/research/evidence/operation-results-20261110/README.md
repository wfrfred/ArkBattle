# 启动结果与失败后继

取证日期：2026-11-10。问题是实际 Skill／Ability 调用者是否需要观察启动成败，以及是否依不同失败原因执行不同后继。结论集中于[案例 09 第 3.3 节](../../cases/09-skill-mechanisms-and-requirements.md#33-启动结果与失败后继实际需求核对)，不由当前 ArkBattle 调用者或测试推导需求，不修改 Core 或确定 API。

## 来源与范围

- 当前 DLL SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，IL2CPP v29。
- 只分析所选原生普通分支；未运行客户端、注入场景或验证活跃 XLua。直接 E8／E9 调用候选与虚表分派分别核实，方法存在不等于具体角色启用。
- Action 内容绑定复用案例 33 的已解码实际 Prefab，重新核对当前本地资源指纹；角色／技能表镜像固定为 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`。
- PRTS 为社区内容说明；“Touch”，再生之流固定到 `oldid=443827`，访问日期为本轮日期。本轮未把它的文字说明冒充已闭合的当前原生绑定。

## 文件

| 文件 | 用途 |
| --- | --- |
| `skill/native.json`、`skill/result.json` | 普通 Cast、WithCost、Retrigger、Character、SkillState、UI 与失败回调的签名、指令、调用锚点及结论。 |
| `skill/content-reuse.json` | 旧雷狼龙内容绑定的来源复核；当前 Bundle 指纹不同及旧 MonoScript 来源缺失均保留为限制。 |
| `skill/extract.py` | 该子调查的提取入口；按完整方法名重新定位，保存当前字段／slot 与指令。 |
| `action/contracts.json`、`action/native-bodies.json` | 所选 Ability、FirstSucceed／Random 组合、调用方与 TriggerAbility 的签名及指令。 |
| `action/content-bindings.json` | 郁金香技能、凛御银灰普通攻击的角色／模式／能力引用及资源指纹。 |
| `action/methods.json`、`action/extract_action.py` | 选定方法与提取入口；广搜中间产物不归入本批。 |
| `content/prts-failure-continuations.json` | 具体失败回退、重试、无效果的内容说明，以及与启动拒绝不同的业务阶段。 |
| `content/use-cast-result-existing.json`、`content/template-4952.json`、`content/template-5167.json` | 既有模板数据中 `_useCastResult=true` 的查询来源与两个小摘录；不单凭模板名宣称当前角色启用。 |

## 复查

从仓库根目录执行；提取输出到独立目录，不覆盖本批原件：

```sh
operation_results_game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
operation_results_work='.cache/native-research/operation-results-20261110/replay'
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline docs/research/evidence/operation-results-20261110/skill/extract.py --game "$operation_results_game" --out "$operation_results_work/skill"
uv run --offline --locked docs/research/evidence/operation-results-20261110/action/extract_action.py --game "$operation_results_game" --out "$operation_results_work/action" --methods-file docs/research/evidence/operation-results-20261110/action/methods.json --xrefs
```

Action 提取器输出的 `bodies.json` 在本批保存为 `native-bodies.json`。配置摘录的完整来源及筛选参数保存在对应 provenance；网页固定版本与原文位置保存在内容记录。通用 `replay.py` 可按 `archive.json` 重提可识别的原生选择器，不能重建网页、镜像准备、缺失的旧资源或未归档解码过程。

已确认的样本需要可观察的成功／失败结果。所覆盖调用者与内容未消费统一的启动失败原因码；这不是对全部内容不存在此类需求的穷举证明。开始失败、已进入 SkillState 后失败和已经开始后的结束不合并为一种事件。
