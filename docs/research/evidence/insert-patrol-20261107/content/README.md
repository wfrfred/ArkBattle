# 后兽 Insert 的目标与安装条件

2026-11-07。为父批次的关卡扫描确定目标选择范围，避免只检查后兽自己的路线。复用[已归档 Insert 方法](../../route-operations-20261107/content/caller-bodies.json)及[该模板](../../route-operations-20261107/content/route-templates.json)，本目录只补目标枚举含义、Aura 安装程序和实际 Prefab。

## 来源及材料

本机同一 Windows x64 客户端，metadata v29，imageBase `0x180000000`。DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。每份原生原件保留准确方法签名、VA 和完整连续 `.pdata` 片段。未执行游戏或验证 XLua。

- `dyjsww-prefab.json`：当前 `battle/enm_pfb_27.ab`／`CAB-f7d0767dfe76da4c0a422da445f8800f` 中 `enemy_2123_dyjsww` 的90个实际组件。脚本按真实 GameObject 层级取对象，解析外部文件表后解析 MonoScript，不凭 PathID 数字猜脚本。
- `dyjsww-templates.json`：当前 Holder 中 `enemy_dyjsww_check_switch`、`enemy_dyjsww_trigger_switch`、`enemy_dyjsww_t[modify_route]` 三项程序；含原 SerializedState。前两项只用于记录模式切换线索，没有据此宣称完整死亡事件到技能施放资格已全部补核。
- `target-types.json`：GlobalAura／TargetValidator／TargetOptions 类型与实际引用的枚举。默认字段常量使用 IL2CPP v29 压缩有符号整数解码，保留编码字节；不是将相邻压缩值直接读成 int32。
- `aura-bodies.json`：DoAttach／DealTarget／后续出生回调／维护／资格，以及 TargetOptions 的实际初始化与检查。
- `side-and-aura-support.json`：TargetValidator.SetData、ConvertSideType 与目标表刷新；确认配置 ALLY 是相对来源的同侧选择。

资源 SHA256、MonoScript 包指纹及脚本身份在各文件 provenance，不用代码指纹代替资源版本。

## 可供关卡联查的精确策略

**D：** 后兽 Root 的 `_modes[1]` 指实际 M2 UnitMode `-2875396146955768849`；M2／Talents／ModifyRoute 的 GlobalAura `-5110032637526889489` 引用目标 Validator `5699489780707273711`，并登记插入模板。模板启用时还要求后兽存活。

**N＋D：** 该 Validator 配置：

- `targetSide=ALLY(1)`；TargetOptions.Init 调用 ConvertSideType，ALLY 分支取来源的 GetSameSideMask，因此通常为与后兽同属敌方的对象。
- `targetMotion=ALL(3)`，`targetCategory=DEFAULT(1)`，`ignoreTargetFree=true`；没有额外职业、重量或异常状态筛选。
- GlobalAura `selfOption=EXCLUDE(2)` 排除后兽自身；VerityTarget 要求同 mapLayer，DealTarget 要求目标仍有效且存活。没有距离门槛。
- 模板额外排除 `enemy_2124_dyjsfg`。

**N：** Aura.DoAttach 枚举当时 UnitManager 的现有对象，逐项调用 DealTarget；之后登记出生／复生通知并继续处理新目标。DealTarget 把该 Buff 安装到 target，并把 Ability.owner 作为 Buff source 传入 AddBuffsToIdList。因此这里 `BUFF_SOURCE` 是后兽，`BUFF_OWNER` 是另一个受影响对象。

**N＋D：** Insert 从后兽读取当前格作为新 MOVE 位置；修改的是受 Aura 对象的程序，`clear=false`，默认在其当前索引前插入并从插入位置继续。不是给后兽自己的巡逻程序插入。

因此，父批次应先找“后兽所在关卡中，其它 SPAWN／Branch 绑定了 PATROL／ALERT 路线”的候选，再核同侧、类别和排除ID；不能只连接后兽自己的 routeIndex。若连全场其它实体以及未引用路线都没有这些指令，是否实际进入 M2 不会改变该关卡没有交集的结论。

## 模式触发的限定

当前实际 Prefab 有 DyjswwSwitch EnemySkill／NeverTrigger／ActionToOwner，后者动作显式 SwitchMode(1)。另有 CheckDyjAlive Aura 与三个模式相关模板，表明模式切换由内容程序发起，不能因为 NeverTrigger 就说该技能不可调用。本轮没有把整套死亡事件、CreateBuff 的上下文继承、技能施放守卫重做一遍；仅把这些材料作为 M2 的可追溯入口。父批次阴性筛选不依赖假定 M2 必然发生。

## 复跑

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/insert-patrol-20261107/content/extract_target_types.py \
  --out .cache/native-research/insert-patrol-replay/target-types.json
python3 docs/research/evidence/insert-patrol-20261107/content/extract_dyjsww_prefab.py \
  --out .cache/native-research/insert-patrol-replay/dyjsww-prefab.json
python3 docs/research/evidence/insert-patrol-20261107/content/extract_dyjsww_templates.py \
  --out .cache/native-research/insert-patrol-replay/dyjsww-templates.json
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/insert-patrol-20261107/content \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/insert-patrol-replay/native
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/insert-patrol-20261107/content
```

未修改 Core、Data、根案例或原有证据；未运行 Core 测试。此目录不把假设构造的两项 Patrol 反例当作实际 Content 正例。
