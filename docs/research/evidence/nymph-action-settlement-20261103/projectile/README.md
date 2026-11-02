# 妮芙 S1：创建弹道到主伤害动作

2026-11-03；本轮项目 HEAD `269584a2719c4714d220caa203f2b50433c715e5`。仅静态 ordinary native 分支；未执行客户端、未核实运行时 XLua。研究结论由父批次案例 27 集中维护，本目录记录中间链及可复跑证据。

输入已重新校验：GameAssembly.dll `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。完整大小、定位与工具哈希在 `native.json` 的 provenance。资源 `[uc]projectiles.ab` SHA-256 `cc3f21b73b10fbc619a1ff8b099f31e678c883ddacb7bb6775fea960ffecb0e1`；MonoScript bundle 为 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`，SHA-256 `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99`。

## 直接证据

- `projectile-content.json` 完整遍历 S1 prefab 的 MonoBehaviour 层级，绑定 `SimpleProjectile`、`EffectBehaviour`、`AdvancedMovement` 三个实际组件；外部 PPtr 通过 SerializedFile 和 MonoScript PathID 解析。没有目标选择或 HitBehaviour 组件。Movement 的 `_moveType=1`、`_speed=10`、`_useDynamicSpeed=false`、三个 delay 为零；Projectile 的 `_alwaysHitTraceTargetInTheEnd=true`、`_alwaysHitTraceTargetWhenReached=false`、`_maxHitNum=1`、`_stopAfterMaxHit=true`。
- `RangedAttack.CreateProjectile` [92841] 在 `0x180f69bcf` 传入 key、owner、start mount、target locatable、ability 与 graphicProjectile out。它不直接传入 HIT_TARGET 动作列表。`BattleController.CreateProjectile` [65683/65684] 最终调用 `Projectile.Init` [72512]；该入口保存 ability.owner 的引用 `+0x100`、ability 引用 `+0x140`，调用 ActionController.Init，再 `_InitInline` 保存追踪目标并初始化 Behaviour。
- ActionController.Init 在发射初始化时取得 activeBuffs 并复制进自身列表；调用 GetAbilityAttachments 并保留其集合引用；逐事件取得 GetProjectileActions 并复制动作列表。GetProjectileActions [92833] 只对 event 0 调 PreprocessActionsForProjectile。普通 NewDamageNode [92840] 因真实 S1 `_useCachedAtkOnly=false` 调到 AbstractAnimatedAbility.NewDamageNode [93893] 并构造普通 ApplyDamage。
- `ApplyDamage.PreprocessForProjectile` [99122] 在 `0x1810dc9cb` 调 get_atk，将数值写入 `m_cachedAtk +0x28`；这一步没有执行 HP 应用。这里只证实缓存赋值，不把动作节点或黑板称为全部属性的深拷贝。
- AdvancedMovement.OnTick [88708] 的 moveType 1 跳表进入 `0x180deac65`，通过 slot 24 GetTraceTargetMapPosition 读取目标挂点当前坐标，写入 m_targetPos，再按速度与 deltaTime 移动，靠近时截到目标坐标；随后检查到达。对应跳表字节在 `native.json.result.jumpTables`。BasicMovement.DealReached [72397] 同步调用 Behaviour.Reached [72607]，进入 Projectile.OnProjectileReached [72548] → DealProjectileReached [72549]。
- DealProjectileReached 先执行到达动作与 Behaviour，随后检查 slot 43/44。S1 的 slot 43 返回 true，因此 `0x18091594e` 直接进入 `_DealHitTraceTarget` [72558]。它检查保存的追踪引用有效及 alive，先置尝试锁，再对同一目标调用 DealHitTarget(force=true)。不重跑 Unit 普通索敌。DealHitTarget 仍先检查身份历史；命中动作返回后增加命中数，并按配置停止。停止路径再调用保底入口时锁已置位。
- `Projectile.OnHitTarget` [72545] 先写命中历史、派发 Behaviour 命中、来源 Entity.OnProjectileHitTarget，再调用 ActionController.OnHitTarget。后者安装 activeBuffs → AbilityAttachment.Apply → event 0 主动作。三个 ActionController 已有同指纹正文通过 `reusedEvidence` 明确复用；同步 AddBuff/OnStart 链复用上一批案例 27。
- `_RunActions` [72633] 在命中执行时重新取得保存的来源引用；设置实际 hit target、mainTarget=traceTarget、ability，再执行动作。ApplyDamage.Execute [99115] 通过 slot 9 调 CreateDamageModifier [99118]，最后在 `0x1810dc8f4` 调目标 ApplyModifier。slot 9 的生成派发入口 `0x180047460` 也已保存。
- CreateDamageModifier 在命中时检查来源 Unity 对象有效性：有效来源在 `0x1810dc4a8` 进入 CalculateDamageBySource；不可取得的来源用 max(0,cachedAtk) 在 `0x1810dc42e` 进入 CalculateDamageByAtkNoSource。实际当前 ATK、DEF/RES 和计算通知顺序由同批 `damage` 子目录闭合。

## 采样解释及限制

直接支持“身份与程序引用在发射初始化保存、条件程序在命中运行、主伤害在命中计算”。不支持“发射时锁定全部来源与目标属性”。Attachments 特别没有深拷贝：Init 保存 GetAbilityAttachments 的集合指针；Entity.GetAbilityAttachments [67608] 返回 owner 数组槽中的集合，AbilityAttachment.Apply [64076] 在命中枚举保存集合。本轮不调查它在飞行中是否会被原地修改。

`_DealHitTraceTarget` 的生成检查入口 `0x184683e30` 先走引用有效性，再调用 Entity slot 40（alive；同批 Damage metadata）。引用有效性入口 `0x1853ae780` 排除 destroyed/null 并比较保存身份与对象当前身份；get_source 本身只走身份获取，没有 alive 检查。不能将当前对象仍可取得等同于 HP 大于零。

完整方法采用连续 pdata fragments 至下一已知方法；movement 尾部包含跳表数据，不把这些数据的反汇编当代码，相关表另保存原始字节。生成引用 getter 的一个 5-byte unconditional-jump thunk 明确仅保存这条跳转，再保存实际目标；没有用无界 fallback 扩大为无关代码转储。相关正常分支均保留，未穷尽所有间接内容、图形弹道变体或运行时覆盖。

## 材料与复跑

持久证据只需 `native.json`、`projectile-content.json`、两个脚本及各自 `.lock`、三个 `projectile-*.bin`。`method-*.asm`、`entry-*.asm` 是便于人工阅读的重复投影；无需归档。`method-search.json`、`discovery.json` 是侦察输出，不归档。

从仓库根目录运行，归档后替换 script 路径即可；输出到新的独立目录。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/projectile/extract.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/nymph-projectile-replay
uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/nymph-projectile-replay
```

Native 脚本按本次 metadata 的完整方法名重定位，不依赖旧方法 index；少量生成 helper 地址由本批实际直接调用给出，并由输入指纹约束。共用解析器为 skill 的 native.py / unity_assets.py；专用资源解码按上一批 decode_content.py 的 type-tree walk 扩展，仅取本 S1 层级与实际脚本绑定。
