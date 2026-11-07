# alwaysCheckCurrentPoint 的执行实例政策

2026-11-08。本目录核实该配置从 Enemy Prefab 到 Cursor 的传递，并选取允许恐惧的 true 敌人与妮芙 S2 作交叉正例。这里只记录参数、资格及静态调用链，不修改架构或决定字段组织。

## 原生参数

复用既有 Windows x64、metadata v29 原件，DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。`parameter-evidence.json` 通过专用脚本从旧原件选择必要指令，保留来源文件及哈希；**不是新的客户端提取或游戏观测**。完整正文均可沿 source 回查。

DirectionCursor 构造器八个参数依次为 Route、Snapshot、Offset、Owner、ignoreAllButMoveCp、visitEveryTileCenter、visitEveryNodeCenter、alwaysCheckCurrentPoint。Windows x64 调用点最后一项在调用前的 `rsp+0x40`；不能将相邻三个 bool 误读成它。构造器保存到 `m_alwaysCheckCurrentPoint(+0x80)`，getter 直接读取该字段。Enemy 对应 Prefab 字段在 `+0x345`。

| 入口 | 实际传递／保留 |
| --- | --- |
| Enemy.Init | `0x180abcd19` 读 Enemy `+0x345`，`0x180abcd6e` 写调用栈 `+0x40`，`0x180abcd9e` 构造主 Cursor |
| Enemy.ReassignRoute／ReconstructRoute | 复用主 Cursor，走 OnRouteChanged／Reset；普通路径不写该字段，因此保持原值 |
| FearController.UpdateFearCursor | `0x180adf556` 向最后 bool 写 0，`0x180adf585` 构造临时 Cursor |
| AttractController.UpdateAttractCursor | `0x180ad5066` 向最后 bool 写 0，`0x180ad509b` 构造临时 Cursor |
| Enemy.ChangePathMotionMode | `0x180ab9e53` 向最后 bool 写 0，`0x180ab9e8c` 构造新的主 Cursor；后续写回旧索引也不恢复该值 |

普通 OnRouteChanged／Reset 的保持结论只针对方法直接处理的同一个 Cursor；Checkpoint.OnBegin 允许同步业务，不能保证任意重入后宿主仍引用该实例。Fear／Attract 使用独立 Cursor，不会把原主 Cursor 的 true 一并改成 false。

## 猎犬proto × 妮芙 S2

**D：** 全包扫描的 true 配置及精确脚本身份见[配置批次](../config/README.md)。其中 `enemy_2137_shsdgo` 的 Enemy 组件位于 `battle/enm_pfb_33.ab`／`CAB-16a59ea5c517e295fc7dc956bda936e3`／PathID `5490958040163831875`，`_alwaysCheckCurrentPoint=true`。普通出生与路线引用由父批次的关卡选择记录，不以 Prefab 存在代替出生。

**D：** [既有 EnemyData 正例](../../route-operations-20261107/content/content-levels.json)包含猎犬proto的完整数据库项：`fearedImmune=false`、`attractImmune=false`。其 Jump 模板虽然调用 ForceSetToSourcePosition，但 `_reassignRoute=false`，不能把它误当成该 true 敌人主动重绑路线的正例。

**D：** [既有 S2 资源绑定](../../route-operations-20261107/temporary/content.json)中，CastSkill、RangedAttack 和弹道均已配对。RangedAttack 的 `_selector` 指 `-1113161849908813312`；本次只补提该对象，保存为 `fear-selector.json`：它是 AdvancedSelector，位于 `skchr_nymph_2/SkillTrigger`，选择敌侧、空地 ALL、DEFAULT 类别，并限制目标数量。没有敌人ID、职业或重量排除项；普通目标可选性和攻击范围检查仍生效。

**N＋D：** 弹道命中时的 `nymph_s_2[trace_taregt]` 先要求来源存活，再对存活、非 Character／Token／Trap 的目标安装数据库 `fear`。`fear` 带 FEARED，模板 `fear_buff` 注册恐惧目标格，最终进入 FearController。模板、数据库、原生接收与注册链复用[临时控制批次](../../route-operations-20261107/temporary/README.md)。猎犬proto是可恐惧的 Enemy，没有上述身份排除。因此在其存活、正常可选且位于妮芙技能范围内等既定条件下，这是一条实际内容接口可执行的静态组合，不是人为构造新的控制机制。

**结论范围：** 该组合可以形成同一个单位的主 Cursor 为 true、恐惧临时 Cursor 为 false；临时控制结束后仍返回原主 Cursor。这足以证明这项政策可以随执行实例不同。没有运行游戏，也没有证明某段实际不可达地形中必然出现可观察的不同走位。

## 其他 true 对象与缺口

全量扫描另有 `enemy_10163_mnctur`、`enemy_10163_mnctur_2`。本轮已归档路线操作模板／组件没有闭合它们主动 ChangePathMotionMode 的实际调用链；不能按方法存在推断 true→false 主 Cursor 替换已在其内容中发生。此项保留未知，不扩大到整套新调查。Attract 的构造参数为 false 已证，猎犬proto也没有静态吸引免疫；本次最小正例只集中闭合妮芙 S2 恐惧链。

## 来源与复跑

`fear-selector.json` 是当前 `battle/prefabs/[uc]skills.ab` 的实际单对象提取，保留 Bundle／对象 SHA256、层级、MonoScript 外部 PPtr 及解码工具身份。代码、资源和固定数据镜像版本分别标记；资源提取不冒充实机施放。

```sh
python3 docs/research/evidence/always-check-point-20261108/runtime/select_parameter_evidence.py \
  --out .cache/native-research/always-check-point-replay/parameter-evidence.json
python3 docs/research/evidence/always-check-point-20261108/runtime/extract_fear_selector.py \
  --out .cache/native-research/always-check-point-replay/fear-selector.json
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/always-check-point-20261108/runtime
```

原生普通路径与运行时 XLua 覆盖分开，本轮未核验在线热更，也没有运行客户端或 Core 测试。
