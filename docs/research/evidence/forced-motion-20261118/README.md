# 推拉、失衡和地形取证

取证日期为 2026-11-18，范围是本机 Windows x64 客户端的普通原生路径、明确的技能配置与关卡资源。结论见[运动案例](../../cases/15-locomotion-native-semantics.md#2026-11-18-补核推拉失衡和地形)。暗索的技能和弹道绑定沿用[前次配置证据](../projectile-lifecycle-20261021/source-binding/witness-projectile-configs.json)，本批重定位物理和牵引的原生方法。

| 输入 | 大小（字节） | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat`，IL2CPP v29 | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

地址为 VA，image base 为 `0x180000000`。反汇编以实际可达分支为准，记录可能包含对齐字节和共享地址的别名。

## 推击

- 阿消的角色表 `char_277_sqrrel.skills[0/1]` 选 `skchr_sqrrel_1/2`，两项均无 override。技能等级顺序为 1–7、专精一至三。两技能黑板的 `force` 分别为 `[0,0,0,1,1,1,1,1,1,2]`、`[0,0,0,1,1,1,2,2,2,2]`。[角色和技能表摘录](push/skill-inputs.json)。
- S1 的 ReplacementSkill 与 RangedAttack 位于同一对象，S2 的 CastSkill 与 RangedAttack 也位于同一对象。各自弹道 `projectile_sqrrel_s1/s2` 通过 active Buff 绑定 `sqrrel_s_1/2 → knockback[dir]`。模板事件 0 的来源与目标是 `SOURCE → TARGET`，`_useSourceDirection=true`，`_decreaseForceLevelWhenNotInDirection=2`。[能力 Prefab](push/prefabs.json)、[弹道](push/projectiles.json)、[Buff 模板](push/templates.json)。
- `Knockback.Execute`（100306）在 `0x181179361–376` 合并黑板与来源基础力度，`0x18117938c–4aa` 读取当前坐标与朝向并处理阈值，`0x1811794b9–520` 查询当前重量、取力并派发到 slot 233。已解码距离平方 0.0625、比较容差 1e−5、`force` 字面量。接收端 `Enemy.KnockBack`（77748）在 `0x180abd7bf–7e9` 检查存活及失衡免疫，在 `0x180abd819–85f` 可向受力反向转身，在 `0x180abd871–914` 以 Impulse 模式施加 `方向 × 表值 × MOVE_MULTIPLIER × 0.02`。当前 `BattleOptions.LoadOptions`（63902）读取 `LevelData.Options.moveMultiplier`，其构造默认和 `BattleOptions` 静态默认均为 0.5。[命中与推击原生链](push/native-push.json)、[关卡倍率与失衡](state/native-state.json)。

## 牵引与力值

`CalculatePushForce`（65910）与 `CalculatePullForce`（65913）各用一张运行数据表，索引都是 `clamp(3 + 有效力度等级 − 有效重量等级, 0, 6)`。推表还有返回索引的重载（65911、65912），其中 65912 的额外范围约束作用于查表索引。重量和来源基础力度分别由 Attribute 23、24 当前值取整。

| 力度减重量 | ≤−3 | −2 | −1 | 0 | 1 | 2 | ≥3 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 推表 | 0 | 100 | 200 | 400 | 450 | 530 | 580 |
| 拉表 | 0 | 2 | 10 | 40 | 42 | 44 | 46 |

当前安装的 `gamedata_const61fefd` FlatBuffer 槽 72／73 为推表和零档索引，75／76 为拉表和零档索引。相邻槽 74 的寻访计数数组供比对字段顺序。本机材料保留选中的数组与源包指纹，字段名与固定版本的数据解码相符。[本机表字节](formulas/force-tables.json)、[固定版本数据对照](https://github.com/Kengxxiao/ArknightsGameData/blob/7e560050b03c34661db1d322d008733072352b2a/zh_CN/gamedata/excel/gamedata_const.json#L1134-L1159)。

`HarpoonProjectile.<DoLink>d__19.MoveNext`（72302）在 `0x18091e7a6–7f0` 采样一次力度和重量，续帧在 `0x18091e432–45c` 用保存的力值乘衰减，再于 `0x18091e5ae` 调 `StillPull`。`CalculatePullAttenuationFactor`（79637）在 `0x180b40329–35c` 计算剩余距离比例的四次方，上限为 1。时长分支 `0x18091e61f–69e` 的等级差只取弹道力度与目标重量，`_ignoreTargetMess` 只让该时长比较使用零重量。差值不大于 −2 取 0.5 秒，否则读取 `linkDuration`，暗索两枚弹道均为 1 秒。[力度公式、Harpoon 与方向节点的指令](formulas/force-native-selected.json)。

薄绿的 `skchr_mint_2` 切到模式 2，该模式的 `MeleeAttack` 会附加 `mint_s_2[pull]`。模板事件 0 调用 `DragTowardSource`（100319），在 `0x18117016c–243` 取目标指向来源的向量、查推力表，再调用 slot 233 的 `Enemy.KnockBack`。[薄绿的技能、模式与模板](formulas/mint-config.json)、[共用推力表的指令](formulas/force-native-selected.json)。

## 牵引公式与近停补核

2026-11-19 沿用上表客户端指纹，核对五个牵引调用点的查表、衰减、距离判定、清速与当前来源的停止分支，并补查崖心、雪雉和歌蕾蒂娅的技能和弹道资源。可读结论集中在 [Case 15 的牵引补核](../../cases/15-locomotion-native-semantics.md#2026-11-19-补核牵引公式与近停)。

- 原生取证保存五个牵引入口的调用和关键指令，以及 `CheckInBlockRange`、`TryEarlyStopPull` 和半径常量。静态直接调用扫描覆盖当前二进制中的 E8／E9 候选。[原生分支](pull/native-branches.json)。
- 配置取证保存角色技能槽、技能节点、弹道 ID、组件类型、参数与输入指纹。歌蕾蒂娅 S2 同时保存技能 Buff、模式切换模板与角色模式的引用链。[技能与弹道配置](pull/prefab-mappings.json)。

## 基础力度等级补核

2026-11-19 复核了 `BASE_FORCE_LEVEL` 的声明、初始化、修正和读取点。安装包取证使用上表的客户端指纹，固定镜像表格的修订单独记录。结论位于 Case 15。[基础力度等级案例](../../cases/15-locomotion-native-semantics.md#2026-11-19-补核基础力度等级)。

- 属性记录保存 Entity 和 Attributes 的字段、默认值、范围、修正和有效值取整证据。[属性与存储](base-force/attribute.json)。
- 消费者记录保存 11 个直接调用点、施力参数和持续牵引的采样与时长分支。[原生调用](base-force/consumers.json)。
- 表格记录保存角色与敌人底值的完整字段统计，并摘录温蒂 S2 的技能黑板。原始 JSON 可按记录的镜像修订、源路径和 SHA-256 复查。[固定数据表](base-force/data-tables.json)。
- 内容记录保存技能、地块及玩法配置样例的实际资源引用和解码选择器。[配置与修正来源](base-force/content.json)。

## 失衡状态

- `UnbalanceState.OnEnter`（78060）释放阻挡，登记物理对象，启用非 Trigger Collider，登记状态属性修正。该状态的 `abnormalFlagMask`（78054）为 `1 << 3`，`Entity.get_isBlockFree`（67510）消费标志 3，`Enemy.CheckBlockableWithoutCheckRange`（77742）以其为拒绝条件。这给出了当前阻挡释放和持续拒绝两处独立行为。[状态和阻挡](state/native-state.json)。
- `OnTick`（78062）先考虑浮空和失衡免疫，再调用 `_UpdateFriction`（78064）。每步降速为 `|Physics2D.gravity| × 质量 × 0.5 × 摩擦倍率 × deltaTime`，速度模长钳到零再乘原速度方向。新速度仍大于 0.1，或固定战斗时间早于保护截止时间，就继续失衡。否则清理失效拉力来源并检查是否还有来源。普通退出接续考虑浮空、眩晕、冻结或默认状态。保护刷新和速度门槛分别使用 0.1 秒、0.1 速度单位。[状态、摩擦与常量](state/native-state.json)、[黑板保护时间](push/native-push.json)。
- `BeginPull`（77750）登记来源并刷新保护。`StillPull`（77751）检查当前失衡、免疫以及该来源的禁用状态。适用的 `TryEarlyStopPull`（77752）清理失效来源，检查仅有当前请求来源后写零速度。`EndPull`（77753）移除该来源并可同步触发状态机检查。`OnExit`（78061）通过 `_ResetPhysicsStatus` 清理物理状态。[牵引入口和退场](state/native-state.json)、[较早版本的重置链](../locomotion-native-20261019/interactions/notes.md#collision-contract-and-exit)。

## 地形和物理更新

- 2-8、TR-14、CH-5 的场景分别有 22、33、37 个与高台对应的地块 BoxCollider2D。该组碰撞体启用，为 layer 8 `TILE` 上的非 Trigger 单位方盒。2-8 的 23 个地穴对象没有这类碰撞体，地图将它们标为 `LOWLAND / NONE / FLY_ONLY`。TR-14、CH-5 样例的地穴为 `LOWLAND / NONE / ALL`。阿消第二件模组的任务要求在 2-8 使两只磐蟹坠入地穴，CH-5 的训练也要求利用牵引与地穴。[逐格校验与模组任务](collision/stage-witness.json)、[场景碰撞体](collision/tile-assets.json)、[CH-5 训练关说明](https://prts.wiki/w/CH-5_推力与拉力)。
- 磐蟹和普通弩手的 layer 19 `ENEMY_COLLIDER` 胶囊用于实体碰撞，根对象的 layer 9 Trigger 用于触发判定。安装包 `Physics2DSettings` 矩阵开启 19↔8，关闭 19↔19 和 9↔8。两个 Prefab 的实体刚体采用 Continuous 碰撞检测。[敌人 Prefab 与初始碰撞矩阵](collision/enemy-physics.json)。
- `BattleController.OnTick`（65802）的手动物理分支在普通对象更新之后调用 `Physics2D.Simulate`，再调用已登记对象的 `OnAfterPhysicSimulate`，然后推进逻辑协程。失衡的提交回调读取当前坐标并写入空间代理。普通 `Enemy.OnTick` 后段独立调用 `_UpdateCurrentTile`（77814）采样当前格，并切换地块成员。地穴按入格或行动方式变化调用 `FallDown`，检查敌人存活、未处于复活中及地面行动方式。按这条调用链，手动物理提交带来的跨格由后继对象更新消费。
- `UnbalanceState._CheckCollideWithHighLand`（78063）用非 Trigger 碰撞体 bounds 与相邻高台做几何检查，消费方是高台接触事件。实际运动接触由 Unity 物理处理。在这些入口可见的是当前格采样。接触链、地穴与地块碰撞构造见[当前原生方法](collision/contact-ranges.json)、[地块碰撞构造](collision/collider-build-ranges.json)。
- BI-TR-2 使用的 `tile_icetur_lt` Prefab 绑定 `IceCornerTile` 并配置了旋转中心。`OnEnemyEnter`（71750）当场调用 `_DoOrbitInternal`。失衡分支在格内通过 `_NormalDirectionDamping`（71744）修整速度分量，并通过 `Enemy.set_velocity`（77696）直接写入 `Rigidbody2D.velocity`。条件满足时 `_AddCentripetalForce`（71745）经 `StillPull(source=null)` 以 Force 模式额外施力。既有 Harpoon 在自己的续帧中继续使用自身的拉点和目标位置。冰面入格安装事件订阅，出格撤销订阅并恢复摩擦。[BI-TR-2 地块](collision/ice-corner-level.json)、[冰面 Prefab](collision/ice-corner-prefab.json)、[冰面处理](collision/ice-corner-native.json)、[速度和额外受力接口](collision/ice-corner-velocity.json)。

本批使用静态方法、配置和场景证据。逐帧终点、碰撞求解顺序、所有特殊 Prefab 的材质和活跃 XLua 需要另有运行证据。

## 移动距离伤害

- 当前 `Enemy..ctor`（77876）在 `0x180ac9a6e–82` 用周期 5 初始化 `m_updatePosTicker`。`Enemy.OnTick`（77845）在 `0x180ac106d–1125` 取当前位置和旧采样点的距离，加到 `m_totalMoveDist`。`DamageByDistance.Execute`（99181）在 `0x1810fbf0c` 读取它，`0x1810fbf75–8c` 计算与保存值的差，随后更新基线并执行预结算伤害分支。`CheckEnemyUnbalanced.Execute`（101818）在 `0x1811e2592` 读取当前失衡状态。[伤害与周期初始化](damage/native.json)、[累计值的更新](collision/contact-ranges.json)。
- 温蒂 `skchr_weedy_3` 的 RangedAttack 选择 `projectile_weedy_s3`，同时通过命中 Buff 分别绑定 `knockback[dir]` 和 `rupture`。后者的事件 0 初始化距离基线，事件 2 与 1 分别处理周期与结束。该模板的伤害类型为 `PURE`，专三配置的伤害系数为 1200，持续时间 8 秒，更新间隔黑板值 0.066 秒。[技能和 Buff 配置](damage/config.json)、[温蒂技能说明](https://m.prts.wiki/w/温蒂)。
- 歌蕾蒂娅和暗索的 X 模组特性组件 `glady_equip_1_1_p1` 和 `rope_equip_1_1_p1` 分别绑定 `glady_e_trait` 和 `rope_e_trait`。在事件 52 附加对应位移法伤 Buff，事件 53 对事件目标按对应 Buff key 移除，`_checkBuffSource=false`。当前方法 `Buff.OnMakeEnemyUnbalanced`（66194）、`Buff.OnEndPulling`（66203）分别派发 52、53。位移法伤模板通过 `CheckEnemyUnbalanced` 检查目标，周期分支检查失败时结束 Buff。[模组与模板配置](damage/config.json)、[事件派发和失衡检查](damage/native.json)、[歌蕾蒂娅](https://prts.wiki/w/歌蕾蒂娅)、[暗索](https://prts.wiki/w/暗索)。
- 2026-11-19 从 `battle/enm_pfb_13.ab` 复提两种弧光锋卫。两者的 `Talents/unbalanced_bleed` 都挂 `enemy_cbjedi_bleed`。模板索引 1372 仅配置周期事件 2，消费当前失衡和自身是否已有 `cbjedi_blood`，按检查结果创建或结束该 Buff。伤害模板索引 282 周期执行 `NoSourceDamage`，伤害类型为 `PURE`。[Prefab 与模板](damage/arc-frontliner.json)、[弧光锋卫](https://prts.wiki/w/弧光锋卫)。

## 复查

从仓库根目录执行。阿消和薄绿的角色表、技能表使用配置记录中的固定镜像提交，缓存目录是 `.cache/native-research/route-operations-20261107/data`。地块、场景和碰撞设置可按[专项复查命令](collision/README.md)提取。

```sh
batch=docs/research/evidence/forced-motion-20261118
work=.cache/native-research/forced-motion-20261118-replay
skill=.agents/skills/arkbattle-native-research
export UV_CACHE_DIR="$PWD/.cache/uv"
python "$batch/push/extract_push_config.py" --out-dir "$work/push"
uv run --offline "$batch/push/extract_push_native.py" --out "$work/push/native-push.json"
uv run --offline "$batch/state/extract_state.py" --out "$work/state/native-state.json"
python "$batch/formulas/extract_mint_config.py" --out "$work/formulas/mint-config.json"
python "$batch/formulas/decode_game_consts.py" --out "$work/formulas/force-tables.json"
python "$batch/damage/extract_config.py" --out "$work/damage/config.json"
python "$batch/damage/extract_arc_frontliner.py" --out "$work/damage/arc-frontliner.json"
uv run --offline --with 'capstone==5.0.7' python "$batch/collision/extract_ranges.py" \
  --out "$work/damage/native.json" --index 99181 101818 77876 66194 66203
uv run --offline --with 'capstone==5.0.7' python "$batch/collision/extract_ranges.py" \
  --out "$work/pull/native-full.json" \
  --index 72289 72302 72458 88379 88651 97040 77752 77322 79636 79637 \
  --xref 65913 79637 77751 --select Torappu.MathUtil.CheckDistance
uv run --offline --locked "$skill/scripts/native.py" --out "$work/pull/radius.json" \
  read 0x1870aed7c --format '<f'
uv run --offline --with 'capstone==5.0.7' python "$batch/collision/extract_ranges.py" \
  --out "$work/base-force/native-full.json" \
  --index 67480 67624 65240 65241 65242 --xref 67480 \
  --select Torappu.Battle.Attributes.Reset Torappu.Battle.Attributes.GetValueRoundToInt \
  --fields Torappu.Battle.Entity Torappu.Battle.Attributes Torappu.Battle.AttributesData
uv run --locked "$skill/scripts/replay.py" "$batch" --out "$work/native" \
  --method 78062 --method 77742 --method 72302 --method 65910 --method 65913
python "$skill/scripts/archive.py" --batch "$batch"
```

已核对技能与弹道的完整组件可复提到独立目录。根据 Bundle 指纹确认版本。[配置证据](pull/prefab-mappings.json)。

```sh
python - "$batch" "$work/pull" <<'PY'
import json
import runpy
import sys
from pathlib import Path

batch, output = map(Path, sys.argv[1:])
record = json.loads((batch / "pull/prefab-mappings.json").read_text())
extract = runpy.run_path(str(batch / "push/extract_push_config.py"))["extract_with"]
extract("extract_prefabs.py", output / "prefabs-full.json",
        SELECTION=record["provenance"]["prefabs"]["selection"])
extract("extract_templates.py", output / "templates.json",
        KEYS={"switch_mode_restart_fsm"})
PY
```
