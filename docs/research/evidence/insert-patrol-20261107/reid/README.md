# “复仇者”Rush 的路线插入对象

2026-11-07。只核对 `enemy_reid_change_route` 的实际挂载、位置来源与被修改路线身份，为父批次的 Insert／PATROL 配置交集检查提供约束；不重新调查全部 Route，不决定 Core 控制流接口。

## 材料与版本

- Windows x64 当前客户端、metadata v29，DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。Native 选择器与完整连续 `.pdata` 片段在 `native.json`。
- 资源来自当前 `config/buff_template_holder.ab`、`battle/enm_pfb_18.ab` 与外部 MonoScript 包；各文件指纹、SerializedFile、PathID、对象哈希、PPtr 外部解析在 `templates.json`／`bindings.json`。Holder 按精确键引用选取完整模板，而不是只保留节点字段。
- `identity.json` 摘录固定镜像提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f` 敌人表 `/enemies/1435`：`enemy_1539_reid` 是带引号的 **“复仇者”**，不是普通 `enemy_1025_reveng_2`。其 Rush 配置为初始冷却 0、冷却 5 秒、duration 4.5、move_speed 2、range_radius 1.5。关卡覆盖及 PATROL 交集由父批次另核。

`bindings.json` 选取该 Actor 的 17 个相关组件：Enemy root、四个 UnitMode、Default／Reborn 下 Rush 的 EnemySkill、AnimatedActionToOwnerAbility、EntityOnRouteTrigger、AdvancedSelector、CircleRange 和 BuffToOwner。记录树位置与实际 PPtr，不仅凭层级推断可施放阶段。

## 角色关系与普通条件

- **D：** Default Rush 的 AnimatedActionToOwnerAbility `7946918876667845726`、Reborn Rush 的 `3275276650861304926`，其 `_activeBuffs` 都引用 `enemy_reid_change_route`，`loadFromDB=false`、`templateKey` 相同、组件 enabled。
- **D：** 两个 Rush 的触发器实际为 EntityOnRouteTrigger，不是任意受击后广播。Default 的触发器 `1204238559074262110`、Selector `2986350004330765406`、CircleRange `-240757873342079906`，均在 `bindings.json`；Selector 的阵营／运动／类别、数量、隐藏资格等原字段完整保留，不在本批凭整数猜枚举含义。
- **N：** EntityOnRouteTrigger.Search 使用自己的 Cursor 建立路线相关地块集合，然后调用普通 SelectorTrigger.Search；Validator 先检查目标所在地块是否在集合，再接续基类 Validator。本批没有把普通目标资格等价成“同关任意 Unit”。
- **N：** `AbilityStandard.OnCastOnTarget(target, …, buffs, …)` 在 `0x1805fec43` 调用 `target.AddBuff`，source 实参来自该 Ability 的 owner 引用；此处不能从 AnimatedActionToOwnerAbility 的类名反推 BuffOwner 必然是 AbilityOwner。
- **D＋N／I：** 该 Buff 的 source 是施放 Rush 的“复仇者”；owner 是收到该 activeBuff 的施放目标。精确选目标政策没有在本批继续穷举，但不影响被修改路线的身份判断。

模板字段具有不同职责：

| 字段 | 值 | 已核实的消费 |
| --- | --- | --- |
| `_source` | `BUFF_OWNER` | `0x181229403–0x1812294a5` 读取该对象的 gridPosition，作为新 MOVE 的目标格 |
| `_target` | `BUFF_SOURCE` | `0x1812294f3–0x1812295c2` 取得该对象的 Cursor／Route，随后重建并 Reassign 这条路线 |
| `_clearRouteBeforeInsert` | false | 保留原 Checkpoint 序列后插入 |
| `_addIntoRuntimeRoute` | false | 采用该节点相应的路线生成分支；不据名字推定插入对象 |
| `_type` | MOVE | 新插入项是普通 MOVE |

因此，**该模板修改施放者“复仇者”自己的路线；Buff 接收者只提供新 MOVE 的位置。** 检查 PATROL 共现时必须关联被修改 Actor 的实际路线，不能把关卡中另一敌人的 PATROL 或未引用的路线对象算成此操作的真实交集。

## 复跑

仓库根目录：

```sh
python3 docs/research/evidence/insert-patrol-20261107/reid/extract_templates.py \
  --out .cache/native-research/insert-patrol-20261107/reid-replay/templates.json
python3 docs/research/evidence/insert-patrol-20261107/reid/extract_bindings.py \
  --out .cache/native-research/insert-patrol-20261107/reid-replay
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/insert-patrol-20261107/reid/extract_native.py \
  --out .cache/native-research/insert-patrol-20261107/reid-replay/native.json
python3 .agents/skills/arkbattle-native-research/scripts/config.py \
  .cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels/enemydata/enemy_database.json \
  --source-url https://github.com/Kengxxiao/ArknightsGameData \
  --revision 63c7cec73c3858d0ae913f85cc89af3cef4d744f \
  --out .cache/native-research/insert-patrol-20261107/reid-replay/identity.json \
  select /enemies/1435
```

没有运行客户端或核实活跃 XLua。这里建立实际资源装配与普通静态身份传递，不声称任意目标都能触发 Rush；也不根据模板存在单独证明 PATROL 共现。后续分段、插入索引和实际关卡交集由父批次集中说明。
