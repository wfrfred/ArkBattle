# Enemy 路线操作与实际内容

2026-11-07。本目录提供[案例 31](../../../cases/31-route-operations-and-state.md)所需的 Enemy 操作、上游调用者、资源绑定与正例配置。机制结论集中维护在案例；这里记录材料身份、检索范围和复跑方式。

## 来源

本机 Windows x64 客户端，metadata v29、imageBase `0x180000000`：

- `GameAssembly.dll`：223112680 bytes，SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat`：46669332 bytes，SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

资源与数据分别固定版本，不由客户端代码指纹代替：

- 当前安装的 `config/buff_template_holder.ab`，SHA256 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`。实际 Holder 为 `CAB-7983df61b3ae63c96fb4e076fc3d80af`／PathID `6070581171229484677`。
- `battle/enm_pfb_*.ab` 及 `pkgrps/btl_pfb_tokens_*.ab` 共 45 包；逐包指纹在 `route-prefabs.json.provenance.sources`。只把字节筛选后成功解码并解析外部 MonoScript 的对象用于绑定证据。候选 script PathID 先按文件外部表解析，不能仅凭数字相同认定类型。
- MonoScript 包 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`，SHA256 `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99`。
- 公共数据镜像 `Kengxxiao/ArknightsGameData`，固定提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。关卡和 EnemyData 来自完整 `zh_CN/gamedata/levels` 缓存；烟花 Trap 静态配置来自同提交 `zh_CN/gamedata/excel/character_table.json`。输入 SHA256 随各摘录保存，Git blob 校验由[父批次](../README.md)的数据来源材料记录。配置版本与安装资源版本独立，不宣称已在同一次游戏运行中加载。

## 原件及范围

| 文件 | 记录内容 |
| --- | --- |
| `enemy-type.json` | Enemy 完整声明、字段偏移及 347 方法签名 |
| `enemy-route-inventory.json`、`extract_enemy_routes.py` | 全部 Enemy 方法中四个路线槽位写入的 15 条候选；9 个核心入口的 40 条直接调用候选，后补 Transport／Durbus 释放后共 49 条。逐条按完整方法指令边界复核；位移筛选和 E8/E9 本身不包含间接调用证明 |
| `enemy-route-bodies.json` | Reassign／Reconstruct／缓存／仅终点／寻路方式等入口的全部连续 `.pdata` 片段及签名；不将 `AssignHostRouteProgress` 补写为执行指定项 OnBegin |
| `caller-bodies.json` | 运输、Durbus、缓存节点、空间节点、插入／清除／Branch／覆盖节点、WAIT跳过等具体调用正文；ChangeEnemyRouteMotionMode 的 slot97 虚调用也在此文件 |
| `transport-callers.json`、`transport-node-body.json` | TransportInternal 的四条直接调用均位于 Transport.Execute；完整节点用于确认不同传输方向与路点处理。尚未闭合普通关卡的该节点配置链，不以 Durbus 的另一条 Reassign 链替代 |
| `durbus-release-callers.json` | OnDetached 和搜索乘员对 ReleaseAllPassengers 的实际调用路径；与组件 `_useHostRoute` 等配值共同判定真实释放分支 |
| `route-templates.json`、`extract_route_templates.py` | 当前 Holder 递归扫描指定 22 类节点，选出 92 模板／145 处节点；保留完整模板及原始 SerializedState，包含嵌套条件。首次只看顶层动作的扫描已废弃。Transport 在本次 Holder 选择中无命中，只是限定材料范围的结果 |
| `route-prefabs.json`、`extract_route_prefabs.py` | 模板／特定脚本的实际组件、祖先 Enemy／Skill／Mode／Trap、直接引用的 Validator，以及源对象哈希和外部 MonoScript 绑定；包含为临时控制调查定位的 Trace 候选，未把全部候选当启用正例 |
| `content-levels.json`、`extract_content_levels.py` | 九个明确普通 SPAWN 正例、完整 EnemyData 选择、对应 Route／Branch／Rune 及必要地图标记。只用于正例，不以选不到直接 SPAWN 推断某敌人没有内容消费者 |
| `act46-type.json`、`act46-route-body.json`、`act46-init-body.json` | NPC路线操作使用的全局点索引、地图标记读取与路线构造；生成的路线 start=end、空CP，并非从原路线保留完整运行上下文 |
| `act46-literals.json`、`extract_act46_literals.py` | 从已知方法读取的三个 IL2CPP string-literal usage，确认 `check_point_index`、`avalanche_index`、`avalanche_state`，不是按关卡字段猜消费者 |
| `act38-type.json`、`act38-firework-body.json` | m_fireworkTrap／TrapData 字段、ResetFirework 运行实例创建、CarnivalStart 切换 mode1，以及结束入口。InitFirework 复用[前批完整正文](../../checkpoint-nondefault-20261107/runtime/additional-content-bodies.json) |
| `character-selection.json`、`prts-sources.json` | 烟花发射器静态配置与社区对实际玩法的描述；P 与 N/D 分开 |

Cursor 重建、Reset、索引写入的完整下游直接复用[同批 Cursor 原件](../cursor/README.md)，不重复复制。热情导游的全局地块标记生产者与可满足条件另见[终点条件补核](../endpoint/README.md)。

## 内容链的证据强度

以下均为静态可执行链，未运行游戏：

- **思旧**：Act40Side_07 正常 SPAWN；默认模式 Absorb Aura 显式登记 `enemy_cjstel_absorb`，Validator 选择 cjgfod／cjbfod 标记目标。EnemyData 给出 `Absorb.branch_id=cjstel_move_1`、`action_index=0`；所选关卡存在该 Branch 和食物敌人。模板消费 Branch 路线，不据组件 enabled 单独推断实际已经吸收。飞行模板有实际模式登记，分别调用身份切换和寻路方式切换。
- **烟花**：Act38Side_07 选择 `env_020_act38side`，隐藏烟花 Card 提供静态实例数据；InitFirework／ResetFirework 创建真正的 Trap。CarnivalStart 调用 SwitchMode(1)，Trap 的 `_modes[1]` 指 Fire；Fire 的 GlobalAura 显式登记 route 模板。模板有出现状态、标记、目标存活与可达性等守卫；满足时缓存替换，移除时条件恢复。PRTS 对狂欢吸引和恢复的说明是独立社区佐证。
- **喀兰圣女**：Act46Side_10 选择 `env_037_act46side`、出生 spbell，EnemyData 的 pray 与实际 EnemySkill／BuffToOwner 配对。模板事件24进入路线节点；Manager 从地图 `check_point_index` 建表，本关有0–3四点。索引范围及可达性仍由实际 native 守卫决定，不宣称每次祈祷必定成功换路。
- **商贩**：Act38Side_07 正常出生 cnvpvd；静态 summon 技能与同GO的实际动作组件配对，召唤 `enemy_10037_cnvpcar`，并立即施加 no_wait 模板。模板选择跳过当前相对 WAIT 的 true 分支；原路线含120秒 WAIT。未把这写成无条件跳过任意 Checkpoint。
- **木裂**：rogue3_b-5-b 正常出生 smlead；Demon 模式 PassiveBuffAbility 登记恢复模板，进入／恢复程序分别开关 IgnoreAllButMoveCp。该过滤的具体保留集合以 Cursor 消费正文为准。
- **沙滩车**：Act17Mini_02 正常出生 durbus；实际 DurbusAbility 配置 `_useHostRoute=true`、`_passengerUseBranchRoute=false`、`_passengerToNearestEndPoint=false`，脱离后的路线／索引来自宿主。其他分支出现在通用 native 中，不把它们都当成本关实际选择。
- **后兽、运输车、钓鱼等**：保留实际模板／组件和所选出生引用，供“跳过全部剩余指令”“复制来源路线”“指定索引重绑”等入口归类。未继续闭合的具体触发守卫不升级为完整可执行正例。

马特奥的插入／清空程序正例直接复用[既有批次](../../checkpoint-nondefault-20261107/README.md)，不重新描述为本次新发现。

## 复跑

从仓库根目录运行，输出写到独立目录；关卡缓存参数可替换为同修订镜像：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/route-operations-20261107/content/extract_enemy_routes.py \
  --out .cache/native-research/route-operations-replay/enemy-route-inventory.json
python3 docs/research/evidence/route-operations-20261107/content/extract_route_templates.py \
  --out .cache/native-research/route-operations-replay/route-templates.json
python3 docs/research/evidence/route-operations-20261107/content/extract_route_prefabs.py \
  --out .cache/native-research/route-operations-replay/route-prefabs.json
python3 docs/research/evidence/route-operations-20261107/content/extract_content_levels.py \
  --levels .cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels \
  --out .cache/native-research/route-operations-replay/content-levels.json
python3 docs/research/evidence/route-operations-20261107/content/extract_act46_literals.py \
  --out .cache/native-research/route-operations-replay/act46-literals.json
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/route-operations-20261107/content \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-replay/native
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/route-operations-20261107/content
```

共享 replay 只重提已登记的原生／对象选择器，不替代本目录专用模板、Prefab、输入筛选和 string-literal 解码。模板／资源解码复用仓库归档的 type-tree 与外部引用 reader，路径与哈希写入 provenance。

本轮不修改 Core 或 Data 实现，不运行 Core 测试。未核验活跃 XLua、全部间接调用、所有 Prefab 实际施放条件或实机路径。只按明确来源区分范围外玩法与未调查候选，不从类名猜测支持边界。
