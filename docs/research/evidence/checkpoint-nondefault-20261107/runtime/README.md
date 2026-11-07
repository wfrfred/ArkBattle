# 非默认 Checkpoint 参数的运行时与资源正例

2026-11-07。只保存针对 `randomizeReachOffset=true`、非零 `reachDistance` 的运行时生成者排查及选定资源绑定。机制结论由[案例 13](../../../cases/13-route-and-movement-timing.md)维护；本目录不设计 Route API。

## 版本与来源

本机 Windows x64、metadata v29、imageBase `0x180000000`。原生原件的 provenance 分别保留 DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` 及工具身份；与此前 Route／Checkpoint 批次相同。

资源另行核对，不用客户端代码指纹替代 Bundle 身份：

| Bundle | SHA-256 |
| --- | --- |
| `config/buff_template_holder.ab` | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |
| `battle/enm_pfb_18.ab` | `7bc74aef8fbb3cbc7ce86d7e4b789e2c0daaadf076d47b0e9989e83e7ff4eb69` |
| `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin` | `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99` |

`positive-templates.json` 是本次从安装资源重新解码的四项模板，保留原 SerializedState 和解析后动作，不是把旧缓存改写成新观察。`enemy-prefab-bindings.json` 只保留马特奥启用链的六个必要组件及各自外部 MonoScript 解析，不含探索阶段的 142 个候选组件。

## 材料及选择范围

- `positive-templates.json`：Holder 的 SerializedFile `CAB-7983df61b3ae63c96fb4e076fc3d80af`、PathID `6070581171229484677` 中，选取 `enemy_bolicp_s3[call]`、`cledub_s3[ridicule_lpeopl]`、`folchr_t[attract_mcreep_core]` 及其父模板 `folchr_t[attract_mcreep]`。只将前三者的实际参数视为所选资源配值；完整启用链以马特奥为主正例。
- `enemy-prefab-bindings.json`：`battle/enm_pfb_18.ab`／`CAB-0df5f4c8c8dade07e2ee475a972da576`。Enemy 组件 PathID `5876789642265996286` 的 `_modes[1]` 指向 Reborn UnitMode `9106343686940568574`；其 Body/Skills/CallBdguad 下 EnemySkill 是 `1333684876975582206`，AnimatedActionToTargetAbility 是 `-1903693957362766850`。后者 `_activeBuffs.Array[1]` 直接使用 `enemy_bolicp_s3[call]`，`loadFromDB=false`。Selector `-2088189509676651522` 读取标记 `enemy_bdguad_mark`，SelectorTrigger 是 `2019250468254297086`。这里记录层级绑定，不仅凭 GameObject 层级推断阶段限制或初次出生即执行。
- 每个组件保留 GameObject／Transform 层级、component enabled 值、原始对象 SHA-256、`m_Script` PPtr。PPtr 的 fileID 通过该 SerializedFile 的外部表解析到 `CAB-658d74aab777086fc32b93f385be999a`，再按 PathID 获取真实 MonoScript；不是只凭相同 PathID 在另一个文件中猜匹配。
- `enemy-skill-root-body.json`、`enemy-skill-type.json`：只用于限制层级推断。get_isRoot 的普通实现检查 parentMode 是否为空，不检查 `_familyMask`；后者类型是 Ability/FamilyGroupMask。这里不把掩码、组件 enabled 或资源树位置推成实际施放阶段，也没有继续调查全部模式／施放资格。
- `insert-checkpoint-node-type.json`、`content-checkpoint-bodies.json`：InsertCheckPointInRuntimeRoute 的字段布局及完整执行方法。配置 bool 从节点 `+0x20` 读取，写入新 CheckpointData `+0x28`（`0x18122960b–0x181229610`）；其后生成运行时路线并 ReassignRoute。这个节点没有 reachDistance 配置字段。文件还保留 ReconstructRouteWithTargetGridMove、EnemyDurcarChangeDirection、RistarMove 三个生成者作定向排查。
- `attract-route-body.json`：Attract 的路点构造／更新；`trace-route-bodies.json`：Scheduler 的 Trace／TraceAndWait，以及 Map 的 Trace／ExtraRoute。所选构造不能用一般的“随机移动”名称代替两个字段的实际写入。
- `additional-content-bodies.json`：TypeInfo 线索定位到的 Act1Vase、Act25SideExtra、Act38Side、TrapGarage、TrapRockfl、UnitSummonApopsis 六个生成者。写入不同对象的 `+0x28／+0x2c` 不视为 CheckpointData 字段写入。
- `checkpoint-typeinfo-refs.json`、`find_checkpoint_typeinfo_refs.py`：以 Attract 的已核实分配操作 `0x180ad5220` 为见证，搜索 CheckpointData TypeInfo 槽 `0x188bbcc08` 的 `48 8b/8d` RIP 相对候选，并记录邻近已知入口。只用于选择上述方法；字节候选与 nearestKnownEntry 本身不是控制流证明，也不覆盖反射分配、其他指令形式、所有序列化来源或热更。

Fear、普通 RuntimeRoute 召唤及 Npc 的已有生成证据直接复用[前批次](../../checkpoint-semantics-20261107/move/README.md)及[Route 来源批次](../../route-creation-20261107/origins/README.md)，不复制原件。EnemyDuel、SandboxRailway、Douququ 与反序列化／Duplicate 候选没有据此扩大为本轮普通内容消费者的穷举。

## 复跑

从仓库根目录运行，两个资源提取脚本会核对上列固定 Bundle 指纹；默认输出在独立缓存目录：

```sh
python3 docs/research/evidence/checkpoint-nondefault-20261107/runtime/extract_positive_templates.py
python3 docs/research/evidence/checkpoint-nondefault-20261107/runtime/extract_enemy_bindings.py
python3 docs/research/evidence/checkpoint-nondefault-20261107/runtime/find_checkpoint_typeinfo_refs.py
```

三个脚本支持 `--game` 和 `--out`，输出目录不存在时自动创建。脚本复用已有 type-tree 解码器与共享 `unity_assets.py`／`native.py`；所用脚本及原件身份都记录在输出中。原生完整连续 `.pdata` 片段按 JSON 的 selector 重提，例如：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/checkpoint-positive-replay.json \
  --method Torappu.Battle.Action.Nodes/InsertCheckPointInRuntimeRoute.Execute
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/checkpoint-nondefault-20261107/runtime
```

本批只证所选内容绑定和普通静态方法链，未运行游戏或验证活跃 XLua。重复资源值与明确调用链可以建立正例，不能把未找到非零 reachDistance 写成全客户端永远不用；全关卡 JSON 的覆盖、关卡出生引用、EnemyData 和 PRTS 另见父批次。
