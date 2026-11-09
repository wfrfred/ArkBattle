# AOE 弹道来源退场与范围筛选

2026-11-09。只核对普通群攻在发射后来源身份失效时，命中范围如何取得候选；机制结论维护于[案例33](../../cases/33-targeting-and-targetable-pipeline.md)。本批未修改源码、测试或项目契约，未运行游戏或验证运行时 XLua。

## 样本与版本

主要样本是空爆 `char_282_catap` 默认 Mode：实际 RangedAttack 引用 `projectile_catap`，对应逻辑弹道包含 SimpleProjectile、HitBehaviour、ParacurveMovement 及 CircleRange。完整组件字段与外部 MonoScript 身份保存在 `emitters.json`、`projectile.json`。

炎熔 `char_121_lava` 同时作为对照读取：其实际普通攻击是 MeleeAttack，使用 INPUT_POINT 的作用范围与 UberEffectEmitter。没有将视觉表现当作承担结算的逻辑弹道，来源退场后的投射物范围问题以空爆核对。

本机 Windows x64／metadata v29：

- GameAssembly.dll SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

Bundle 路径／指纹、SerializedFile、PathID、外部 MonoScript PPtr 与完整原始组件字节哈希在配置 JSON 中各自保存。配置是字段解码，未运行该能力；脚本复用已有 type-tree reader，没有按原生对象偏移解释序列化资源。

## 原件与范围

| 文件 | 保存内容 |
| --- | --- |
| `extract_config.py` | 复用已归档字段解码器，读取所选根节点下完整 MonoBehaviour 字段及外部脚本身份。 |
| `emitters.json` | 炎熔、空爆的角色、Mode、攻击、触发器与选择配置。 |
| `projectile.json` | `projectile_catap` 与 `projectile_catap_logic` 的逻辑、命中、运动、范围和表现组件；两者对象身份分别保留。 |
| `catap-data.json` | 已固定镜像中角色名称、职业、Prefab 与技能绑定；原表字节已与既有 Git blob 验证记录比较。 |
| `emitter-native.json` | 当前 Character.ClearAbilities、RangedAttack 的发射、动作构造、清理条件；按完整方法名提取连续 `.pdata` 分段。 |
| `native-impl/methods.json`、`native-impl/bodies.json` | 当前 HitBehaviour.Init、OnProjectileReached、DealHitTarget 的连续方法原体及必要字段。 |
| `native-impl/withdraw-methods.json`、`native-impl/withdraw.json`、`native-impl/withdraw-virtual-invoker.json` | 普通 Character.Withdraw → FinishMe → OnFinish → ClearAbilities，及 Withdraw 使用的虚派发器；均重新按当前版本定位。 |
| `detach-methods.json`、`detach-native.json` | Entity.ClearAbilities、Ability.Detach／收尾、Projectile.Init／OnTick 与 RangedAttack.ClearProjectile。 |
| `detach-details-methods.json`、`detach-details-native.json` | DoDetach 的停止与卸载程序、StopAffect／DoFinish、AbilityStandard.OnEvent。 |
| `lifecycle-boundaries-methods.json`、`lifecycle-boundaries-native.json` | InterruptIfNot、SimpleProjectile 的来源失效停止 getter、普通 RangedAttack 的额外事件节点为空的分支。 |
| `reused-evidence.json` | Case33 的 TargetOptions.Init／来源样本／范围查询、RangedAttack 施放方法的原件路径、指纹与精确方法选择；不复制已有原件。 |
| `prts-sources.json` | 空爆、炎熔和 AOE 时点的社区资料；不使用社区简介证明来源失效分支。 |
| `archive.json` | 由共享 archive.py 生成的选择与复查清单。 |

重点选录是 HitBehaviour.Init 中对 TargetOptions 的初始化，以及 OnProjectileReached 中先用保存选项查询候选、后读取当前来源与通知、最后逐项命中的顺序。来源身份、来源是否 alive、配置是否启用退出清理是不同条件；本批只核对该真实样本，不推导全部弹道的统一政策。

普通撤退补核沿已发射弹道的真实清理入口检查：Character 的配置分支、Ability.Detach／StopAffect 与 OnCastEnd、Projectile 的来源管理登记和每帧来源依赖。Case18 早期原件的客户端指纹不同，本批只复用其问题与方法选择，重新定位当前方法，不套用旧索引／地址。运行时 XLua 和其他特殊内容清理不在此范围。

## 复跑

在仓库根目录执行，输出到新的工作目录：

```sh
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
batch=docs/research/evidence/targeting-aoe-source-20261109
work=.cache/native-research/targeting-aoe-source-replay
export UV_CACHE_DIR="$PWD/.cache/uv"

uv run --offline "$batch/extract_config.py" --game "$game" --out "$work/emitters.json" \
  --bundle charpack/char_121_lava.ab --bundle charpack/char_282_catap.ab \
  --root char_121_lava --root char_282_catap
uv run --offline "$batch/extract_config.py" --game "$game" --out "$work/projectile.json" \
  --bundle 'battle/prefabs/[uc]projectiles.ab' \
  --root projectile_catap_logic --root projectile_catap

uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/extract_qualification.py \
  --game "$game" --out "$work/emitter-native.json" \
  --type Torappu.Battle.Abilities.RangedAttack \
  --method Torappu.Battle.Abilities.RangedAttack.OnCastOnTarget \
  --method Torappu.Battle.Abilities.RangedAttack.CreateProjectile \
  --method Torappu.Battle.Abilities.RangedAttack.GetProjectileActions \
  --method Torappu.Battle.Abilities.RangedAttack.NewDamageNode \
  --method Torappu.Battle.Abilities.RangedAttack.OnCastEnd \
  --method Torappu.Battle.Character.ClearAbilities
uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/extract_qualification.py \
  --game "$game" --out "$work/hit-native.json" \
  --methods-file "$batch/native-impl/methods.json" \
  --type Torappu.Battle.Projectile --type Torappu.Battle.Projectile/Behaviour \
  --type Torappu.Battle.Projectiles.HitBehaviour --type Torappu.Battle.BObject

uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/extract_qualification.py \
  --game "$game" --out "$work/detach-native.json" --methods-file "$batch/detach-methods.json" \
  --type Torappu.Battle.Ability --type Torappu.Battle.AbilityStandard \
  --type Torappu.Battle.Projectile --type Torappu.Battle.Character
uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/extract_qualification.py \
  --game "$game" --out "$work/detach-details-native.json" \
  --methods-file "$batch/detach-details-methods.json" \
  --type Torappu.Battle.Ability --type Torappu.Battle.AbilityStandard
uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/extract_qualification.py \
  --game "$game" --out "$work/lifecycle-boundaries-native.json" \
  --methods-file "$batch/lifecycle-boundaries-methods.json" \
  --type Torappu.Battle.Ability --type Torappu.Battle.Abilities.RangedAttack \
  --type Torappu.Battle.SimpleProjectile
uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/extract_qualification.py \
  --game "$game" --out "$work/withdraw-native.json" \
  --methods-file "$batch/native-impl/withdraw-methods.json" \
  --type Torappu.Battle.Character --type Torappu.Battle.Unit --type Torappu.Battle.Entity

uv run .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py "$batch" \
  --game "$game" --out "$work/replay"
```

镜像固定为 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，原表 `zh_CN/gamedata/excel/character_table.json`。`catap-data.json.provenance` 保存 config.py 的完整查询参数；`reused-evidence.json.mirrorVerification` 关联原始 Git blob 比较。配置复跑与字段解码复跑分别进行。

Native replay 校验记录的方法身份与机器码选录，不执行游戏、资源解码程序或同步回调。本批结论来自已选静态路径，不能据此断言任何自定义 Projectile、关卡程序或 XLua 都没有额外清理。
