# 临时运动控制与追踪路线

2026-11-07。作为 Route 操作全集调查的临时控制分支。本目录保存普通静态原生方法、所选实际内容配置及资源绑定；机制结论由父批次对应案例统一维护。本批不修改 Core 接口。

## 来源与选择范围

Windows x64、metadata v29。原件 `native.json` 的 provenance 保存完整来源与工具身份：

- GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- `extract_temporary.py` 从完整类型表选择 FearController、AttractController、MoveState、EntityOnRouteTrigger、BaseTraceTargetAbility 及六种追踪实现、五个恐惧／诱导动作节点；保存所选类型的全部字段和方法签名，再保存具备可区分方法体的连续 `.pdata` 片段。生成的 XLua BaseProxy、无原生地址及超过 100 个方法共用的函数体列入 `bodiesOmitted`，不将它们指定为一个方法的独占实现。
- 从所有所选方法地址反查全 executable section 的 E8/E9 候选调用者。候选只是检索线索，正文使用的调用要通过实际方法体核对；虚调用、接口调用与 XLua 不在直接调用扫描的完备性范围内。
- `EntityOnRouteTrigger` 是从 Cursor 类型字段反查出的查询消费者。新增 ActiveTraceTileAbility、UpdateTraceTileAbility、SimpleTraceTargetAbility 来自 RegisterTraceTile 的实际调用者；并非只凭初始 Fear／Attract 方法名确定范围。

| 材料 | 选择范围 |
| --- | --- |
| `native.json` | 主 Cursor、独立 Fear／Attract Cursor、Enemy 追踪 Cursor 的选择／更新／解除及实际调用者候选；完整签名与当前字段偏移 |
| `advance-selection-20261108/` | `get_moveCursor`／`get_cursor` 虚槽及实际 Tick 接收者补核，另提当前普通移动两方法；纠正 Trace 被选中时 Main 仍推进的旧推论 |
| `content.json` | 妮芙 S2 的 CastSkill／RangedAttack／SelectorTrigger／Projectile，酒神 S2 Token 的相关能力，炎佑的 Priority Trace，main_14-02 的 lrmm／TraceStorm／信标及玩家可部署祭坛；所有 MonoScript 按各 SerializedFile 的外部引用表解析 |
| `templates.json` | `nymph_s_2[trace_taregt]`、`fear_buff`、`token_phatm2_encdool_trigger`、`token_phatm2_encdool_target`、`enemy_bigstorm[traceStorm]`、`trap_stormcoord[summon_and_suicide]` 六项，含原 SerializedState 和解析后动作 |
| `fear-data.json` | 固定 Git 修订下 `/fear` 的筛选摘录；source Git blob SHA 保留，未伪装为完整源文件 |
| `nymph-data.json`、`phatm2-data.json`、`phatm2-token-data.json` | 固定 character_table 中名称、S2／召唤物绑定和相关天赋字段 |
| `skchr_nymph_2-data.json`、`skchr_phatm2_2-data.json`、`sktok_phatm2_encdool_2-data.json` | 固定 skill_table 中名称及两端等级的黑板值 |
| `lrmm-stage.json`、`lrchld-stage.json`、`lrchld-db-ref.json` | `level_main_14-02.json` 同一主 Fragment 的前两个 SPAWN：活性源石风暴与信标，无随机组；信标明确使用数据库 level 0 |
| `lrmm-data.json`、`lrchld-data.json` | 固定 EnemyData 的名字、实际 Prefab key 与天赋黑板，防止按代号猜测单位身份 |
| `lrcage-card.json` | 同关卡预置一份可见的枯朽祭坛手牌，玩家部署、触发该装置的事件 4 后可另外召唤信标 |
| `talent-binding.json` | Enemy 为 Prefab Talent 赋值（null 黑板仍生成有效空板）、收集 Talent 与普通附着流程 |
| `acloon-stage.json` | 卫戍协议 Branch dragon 的 SPAWN，**仅作分支配置存在的证据**；本批没有证明该 Branch 的最终触发条件 |
| `community.json` | 已查阅 PRTS 的日期、链接及适用范围；不把社区资料当作原生方法或现场观测 |

JSON 来源：`Kengxxiao/ArknightsGameData` 固定修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。配置输出保存原文件 raw SHA-256／bytes 和查询参数；源表不整体归档。资源输出单独保存每个 Bundle 的实际 SHA-256、SerializedFile、PathID、原对象 SHA-256及脚本 PPtr 解析。代码版本与资源版本分别标记，不能互相代替。

## 复跑

在仓库根目录执行，输出到独立目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/route-operations-20261107/temporary/extract_temporary.py \
  --out .cache/native-research/route-operations-replay/temporary/native.json
python3 docs/research/evidence/route-operations-20261107/temporary/extract_content.py \
  --out .cache/native-research/route-operations-replay/temporary/content.json
python3 docs/research/evidence/route-operations-20261107/temporary/extract_templates.py \
  --out .cache/native-research/route-operations-replay/temporary/templates.json
```

三项专用脚本支持 `--game`，复用共享 native／UnityFS／type-tree 解码器。内容脚本保留外部脚本的实际文件绑定；资源树中的相同 PathID 不直接视为同一对象。

配置以输出 provenance 中的 input、固定 revision、query 重跑共享 `config.py`。例如：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/route-operations-20261107/data/character_table.json \
  --source-url https://github.com/Kengxxiao/ArknightsGameData \
  --revision 63c7cec73c3858d0ae913f85cc89af3cef4d744f \
  --out .cache/native-research/route-operations-replay/temporary/nymph-data.json \
  select /char_4146_nymph --field /name --field /skills/1
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/route-operations-20261107/temporary
```

## 限制

这是静态 native 与配置绑定调查，未运行游戏或验证活跃 XLua。存在追踪脚本或 Branch 条目不自动证明该时刻已经施放；目标选择资格、模式启用、内容回调分别核对。生息演算、斗蛐蛐等专用调用者只列为来源类别，不据此增加普通战斗 Core 需求。main_14-02 的活性源石风暴与信标是同 Fragment 两条直接出生配置；信标的已启用 Immune／PassiveBuffAbility 提供所需 `enemy_stormcoord[passive]`，不需要假设未找到的外部召唤。另一路玩家祭坛召唤记录为有部署前提的可执行内容。临时控制与缓存／恢复主路线是不同路径，不因方法同含 Route 就合并其状态语义。
