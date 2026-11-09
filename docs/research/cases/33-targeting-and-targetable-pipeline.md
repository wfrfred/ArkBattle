# Targeting／Targetable：配置、选择、绑定与作用

研究日期：2026-11-09；项目对照 `9a24854`。本案沿通用单位选择流程组织已有证据，并补齐资格来源、优先级和再次验证。这里的 Targetable 指项目能力；原生没有与它一一对应的单一组件。

## 1. 证据与范围

- **原生事实**：当前 DLL／metadata 普通 native 分支、真实资源组件与已解析的引用。指令直接证明与组合调用链推导分别注明；没有运行完整客户端，也没有确认运行时实际启用的 XLua 替换。
- **现有实现**：本次仓库源码的行为，不能反过来证明游戏规则。
- **项目选择**：已经确认的模拟语义，不因本案调查自动改变。
- **未决**：缺少真实启用配置、完整调用者或动态验证的具体问题。方法存在、组件存在、最终在所选模式启用不是同一层证据。

当前 `GameAssembly.dll` SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，Windows x64／metadata v29。新增证据、字段布局、脚本与复跑入口见[本批 README](../evidence/targeting-pipeline-20261109/README.md)。引用旧批次时使用其各自版本及适用范围；新增消费者按当前完整方法名重新定位，没有套用旧 index／VA。

主线是 Entity 目标选择；Self／地块／弹道对象选择不被强行合并为同一套单位候选流程。样本覆盖普通近战、远程、医师／行医、特殊排序、状态施加和光环，不能据此宣称全部派生 Selector 或特殊玩法均已穷尽。

复用的主要案例：

| 证据 | 本案复用内容 |
| --- | --- |
| [02 Action 与 Projectile](02-action-and-projectile-phases.md)、[07 攻击周期](07-action-timing-and-animation.md)、[08 启动与中断](08-action-eligibility-and-interruption.md) | 输入目标、实际施放名单、前摇、发射和取消是不同步骤。 |
| [16 命中边界](16-projectile-motion-and-hit-boundaries.md)、[18 目标生命周期](18-projectile-source-and-target-lifecycles.md) | 原目标直选、范围／接触命中与存活、消失、身份的区别。 |
| [19 Effect 索敌与免疫](19-effect-selection-and-immunity.md) | 睡眠免疫者在限额前被排除；施加拒绝与异常生效抑制分开。 |
| [20 阵营](20-norport-civilian-allegiance-and-blocking.md)、[21 蒂比](21-tippi-air-blocking.md) | 主观阵营、对地规避与自身空地身份不同。 |
| [27 一次攻击](27-attack-additions-and-damage-events.md)、[28 伤害事件](28-damage-hooks-and-event-granularity.md)、[29 治疗](29-hp-and-ep-healing-settlement.md) | 妮芙、目标自己的 hitRange 限制、医师／行医、独立资源结算。 |
| [31 路线操作](31-route-operations-and-state.md)、[32 追踪召唤物](32-leithanien-summons-blocking-and-movement.md) | 主路线与临时运动控制、同阵营不同实体类，不能由阵营猜仇恨公式。 |

PRTS 的[选择器](https://prts.wiki/w/选择器)、[仇恨](https://prts.wiki/w/仇恨)、[作战机制](https://prts.wiki/w/作战机制)用于交叉核对与选择区分样本；它们是社区资料。字段与时序结论以相应客户端证据为准，不把概括性 Wiki 描述推广为所有 Selector 的统一实现。

## 2. 从真实配置开始

完整 PPtr、Bundle 指纹、模式／能力选择链和字段值见[内容摘录](../evidence/targeting-pipeline-20261109/content/selected-prefabs.json)；旧内容锚点按原案例复用。

| 真实样本 | 选择／作用入口 | 能区分的行为 |
| --- | --- | --- |
| 玫兰莎普通攻击 | 实际近战能力与阻挡／范围 Selector | 阻挡名单加前、范围补足，与普通仇恨排序分开。 |
| 普通弩手 | 近战阻挡入口、远程选择、`projectile_crossbow` | 发射前选择与原目标弹道保底不共用全部资格。 |
| 妮芙 S1 | `FROM_OWNER + AT_BEGINING` | 启动选取；前摇结束不因 timing 自动重新普通索敌。 |
| 维什戴尔普攻 | `INPUT_TARGET + BEFORE_SPELL_START`，独立补入输入目标 | 更新施放名单不等于重新从 owner 范围选择另一目标。 |
| 陈 S3 | 实际 MultiMeleeAttack，`RESELECT_IF_TARGET_DEAD` | 输入目标死亡才触发重选，并重绑输入身份。 |
| 克洛丝、史都华德、拜松 | 飞行二次优先、精1天赋切换高防 Mode、技能嘲讽属性 | 特殊优先与基础仇恨来自不同配置／事实；史都华德初始 Default 不等于高防模式。 |
| 末药默认治疗 | RangedHeal 与普通缺血排序 | HP 资格、生命比例和治疗用途。 |
| 桑葚默认／S2 | 默认 postFilter 37、S2 postFilter 38 | HP／EP 双需求的排除条件相同，但主次权重不同。 |
| 炎熔普通攻击 | 仇恨／单目标 Trigger，另有全量作用 Selector，`INPUT_POINT` | 启动锁定与范围作用名单是两份策略，不能复用同一筛选结果。 |
| 铅踝 S2 | SelectorTrigger 的 minTargetNum=2 | 选择器最终只返回一人时，不满足该触发条件。 |
| 爱丽丝 S2、卡夫卡 S1 | 睡眠专用 postFilter 31 | 对异常免疫的排除先于名额竞争；后续伤害不必采用同一排除。 |
| 空／浊心斯卡蒂光环 | FilterBuffTargetValidator 与实际免鼓舞标记 | 机制标记筛选不等于试装一个 Effect，也不要求输入 Effect ID。 |
| 铅踝 S1 | `ignoreTargetFree + onlyIgnoreSomeOfTargetFreeCase + INVISIBLE` | 只忽略指定异常造成的禁选，不是忽略全部限制。 |
| 瑕光 S2 睡眠选择 | 指定 `SLEEPING` Combo 的局部豁免 | 机制组合身份与一个 Buff／Effect 的定义身份不同。 |
| 蒂比起飞 | 实际 Buff 的 `MOTION_TARGET_FREE`，目标侧 Character 覆盖 | 比较来源运动方式与自身阻挡方式，不是把蒂比改成飞行目标。 |
| 羽毛笔 S2／禁闭所 | Selector 与目标自身 `IsInHitRange` | 目标可以要求来源位于其登记范围；与攻击者范围是两个条件。 |
| 冻河 S3 | GroupSelector 与多项内部 Validator | 分组回退、有序 AND 和内部阵营豁免分别处理；不能扁平化为全场一次排序。 |

非默认字段需要沿实际消费者解释。号角 S1 的真实 Selector 声明了 target-option hook keys，而固定镜像的普通技能黑板未提供这些覆盖值；这只闭合了可挂接的真实配置和消费入口，没有证明普通 S1 已发生覆盖。

## 3. 通用流程与机制来源

```text
内容模式／Ability／TriggerSelector 配置
  → Reset／SetData：绑定 owner、Ability、validator、范围和有效选项
  → 触发侧决定是否开始，并提供输入目标／位置
  → Ability 按 source 和 timing 建立实际施放名单
      → 范围／全场候选生成
      → TargetOptions 与具体 ValidateTarget 排除
      → postFilter、附加优先级和数量处理
      → 能力层必要的原目标补入／重排
  → 对施放名单逐项验证身份与存活
  → 直接作用，或创建持有目标／位置的 Projectile
  → 原目标／范围／碰撞／周期选择入口产生实际接收者
  → Damage／Healing／Buff 的对应接收与作用
```

这是一条职责链，不表示原生存在唯一固定的阶段排列。候选生成与部分资格判断会交织；阻挡选择、全场选择、物理范围和能力的输入目标补入都有自己的路径。

### 3.1 配置不是最后生效值

原生直接证据：`TargetSelector.Reset` 76389 保存 owner、Ability 和 validator；`RangeSelector.Reset` 76187 建立 Range 与 `m_targetOptions`；`AdvancedSelector.Reset／SetData` 75502／75503 从配置、Ability options 与黑板建立有效值。[资格主体](../evidence/targeting-pipeline-20261109/qualification.json)

| 事实 | 来源与读取时点 | 不应混为一项的东西 |
| --- | --- | --- |
| targetSide／motion／category、各忽略项 | Selector 序列化配置，经 Reset／SetData 形成选项 | Prefab 默认值与当前有效选项。 |
| 数量 | limit 开关、静态 maxNum、黑板主键与附加键 | 数量上限与排序前的全部场上对象数。 |
| Purpose | 能力／选项形成的 purposeMask，再由接收选择选项消费 | 未来实际成功施加的 HP／EP／Effect 结果。 |
| 来源阵营／地图层 | TargetOptions.Init 建立的来源上下文 | 目标当前阵营、来源当前坐标。 |
| 来源运动方式 | 来源身份有效时读取当前 changeableMotionMode；失效时可回退初始化样本 | 来源能攻击空中与来源自身的运动方式。 |
| 目标禁选、迷彩、禁疗等 | 对目标当前 Entity／Attributes 的查询 | Buff 是否仍存在、该异常是否实际生效。 |
| 目标 hitRange | 目标自身当前登记的范围政策 | 发起者自己的攻击范围。 |

初始化样本限定于对应的 TargetOptions 消费者。普通 `TargetSelector.ValidateTarget` 的额外地图层校验、迷彩阵营判断和目标 hitRange 校验还分别读取 owner 的当前地图层、阵营与根格，见[资格原体](../evidence/targeting-pipeline-20261109/qualification.json)。因此，同一来源并没有适用于所有选择路径的统一快照时点。

`_UpdateTargetOptionsByBlackboard` 75511 不是任意字段反射：先检查登记的 hook-key 集合和黑板中是否存在对应键，再更新 ignoreTargetFree、选择性忽略开关、abnormalFlag 的有效值。当前普通消费者使用的字面键为 `ignore_target_free`、`only_ignore_some_of_target_free_case`、`abnormal_flag`，其 metadata 字面量绑定保存在原件。不能仅因某组件声明了相似字段名，就认定发生了有效覆盖；具体值有没有被内容／模块／玩法提供，仍需沿该内容的黑板来源核实。

数量的普通 `SetData` 分支：无数量限制时初值128，有限制时初值为静态 maxNum；有数量限制且取得黑板时，主键读取以该初值为缺省，再加附加键，结果截在 `[0,128]`。不能据这个分支推导“任何静态配置都被128截断”，也不能把范围生成、内部排序缓冲和最终 maxNum 的各处限额合成一个字段。

### 3.2 候选如何产生

- **物理范围**：`PhysicsRange.DoFindTargets_DISPOSE` 75405 把查询范围置于本次中心，调用 `Box2dPhysicsUtil.FindTargets_DISPOSE` 75179。后者按碰撞层重叠取得候选，验证对象有效／alive、排除与去重，再执行 TargetOptions 与 validator。阵营可以已经反映在碰撞查询 LayerMask 中，因此内部出现 `VerifyTargetWithoutCheckingTargetSide` 不代表整条选择不检查阵营。
- **全场范围**：`GlobalRange.DoFindTargets_DISPOSE` 75344 遍历 UnitManager，逐项检查有效／alive、完整 TargetOptions 和 validator，合格项加入本次候选容器；该普通体本身另有128项停止条件。
- **阻挡入口**：直接从当前阻挡关系列表取得对象；不是先把全场对象按同一范围过滤再给阻挡项增加权重。

证据：[范围与物理查询](../evidence/targeting-pipeline-20261109/range.json)。普通范围、全场和输入身份是不同候选来源，不能把它们的条件堆成一个所有选择都必须执行的默认 Filter。

### 3.3 触发层先决定输入，能力再组织作用名单

当前普通上游已闭合到[触发与状态机原体](../evidence/targeting-pipeline-20261109/binding/upstream/bodies.json)：

- **Character**：`_SearchAttackTarget` 77318 检查攻击能力与当前资格；替换攻击天赋／技能还可介入搜索。普通分支调用 attackTrigger.Search(false)，AttackState._GetTarget 77506 读取该触发器保存的目标并检查 alive，`_StartAttack` 77505 将该对象交给 Ability.CastToTarget。下一轮攻击再经过搜索／启动。
- **Enemy**：MoveState 可搜索并切入 AttackState；OnEnter 还会再次搜索。`AttackWrapper.SearchTarget` 78174 区分攻击／可用技能及其 Family、Trigger 和优先级，`Cast` 78175 将所选 Trigger 的目标交给相应 Ability／EnemySkill。选哪项能力与该能力选择哪些目标是两件事。
- **阻挡作战**：`CombatWrapper.GetTarget` 78191 从 blocker／BlockManager.combatTarget 取目标，再进入作战施放；不要求先经过普通范围 Trigger。

`SelectorTrigger` 不只是一个无状态 hasCandidate。Reset 76752 将自身的虚 Validator 作为委托传给内置 TargetSelector.Reset，使触发层附加资格参与同一轮候选排除；Search 76753 具有独立行为：

1. 未到搜索 ticker 的时点且 force=false，直接返回不就绪，不进行这轮选择；到期或强制搜索才推进 ticker 并执行 FindTargets(owner)。
2. Selector 返回的名单数量必须达到 minTargetNum；这已经是它执行筛选、排序与限额后的结果。未达到便清空保存目标并拒绝。铅踝 S2 的实际配置要求至少两个返回目标。
3. keepTarget=true 且旧目标仍在新名单中时保留旧目标，即使新名单第一名已经改变；否则保存新名单首项或 null。
4. 普通 Search 最后仍依据保存目标是否非空返回，所以 minTargetNum=0 本身不等于允许无目标发动。SelectorOrAlwaysTrigger 有另外的无目标分支。

其搜索间隔可使用默认 ticker，或由 overrideSearchTargetTick 显式设置；本次选定配置尚无 keepTarget=true／非默认搜索间隔的实际正例。原生消费者已确认，不把它们直接变成项目必须增加的缓存或节拍。

触发 Validator 还有 TargetOptions 以外的事实：普通 SelectorTrigger 先按来源视角检查目标 isHidden／isHiddenToAlly，再拒绝敌对迷彩。RangedSelectorTrigger 在这些条件失败时，可由内置 RangeSelector 的 **ignoreTargetFree** 豁免；这里不是 forceIgnoreCamouflage。对应 TargetOptions 原生未装箱字节偏移0x0d，由完整字段布局绑定。

所以同一内容的 Trigger 与作用 Selector 可以配置不同范围、数量和迷彩政策。炎熔的 Trigger 按仇恨取一个发动目标，实际范围能力使用另一份全量 Selector；已选中启动目标不能替代后来形成的范围作用名单。

## 4. 资格判断与目标侧机制

`TargetOptions.VerifyTarget` 76369 先处理相应阵营与基础 motion／category，再进入 `_VerifyAdvanced` 76375。`TargetSelector.ValidateTarget` 76395 还负责地图层、目标 hitRange、迷彩和额外 validator；具体类可以覆盖这些步骤。[资格主体](../evidence/targeting-pipeline-20261109/qualification.json)、[机制消费者](../evidence/targeting-pipeline-20261109/qualification-mechanisms.json)、[异常与来源](../evidence/targeting-pipeline-20261109/qualification-sources.json)

| 判断 | 原生普通分支 | 区分例子／边界 |
| --- | --- | --- |
| 身份与 alive | 候选生成检查有效身份，调用目标 alive 覆盖；普通 Entity 还要求状态机运行和 HP>0 | 对象尚存在不等于仍能作为活目标。 |
| 位置与消失 | `isTargetFree` 将未 located 或 disappeared 作为禁选事实 | 路线消失没有注销身份；已有锁定弹道可以走另一条资格。 |
| 触发侧 Hidden | SelectorTrigger 的额外 validator 按来源视角读取 isHidden／isHiddenToAlly；二者有独立异常及免疫查询 | 不能把 HIDDEN、DOZE、INVISIBLE 或空间消失都称为同一状态。 |
| 主观阵营 | Init 根据来源与 targetSide 政策建立相应掩码；目标当前 side 参与匹配 | ENEMY 对 NEUTRAL 的敌对关系不同于简单 side 不等。 |
| 目标 motion | 读取目标 changeableMotionMode，经 MotionMask 匹配 | 寻路模式与自身空地身份不同。 |
| category／unit type | category 掩码、可选 UnitTypeMask 分别查询实际类型 | 角色／敌人类不能由当前阵营推断；装置 category 也不是阵营。 |
| 普通 TargetFree | 异阵营来源未忽略时查询禁选；普通聚合包含 TARGET_FREE、INVINCIBLE、INVISIBLE、TOWER_TARGET_FREE | 隐匿与无敌都可能禁止选中，但无敌还另有资源接收语义。 |
| 局部忽略 | 选择性忽略传入指定 AbnormalFlag／Combo，仍检查其他禁选来源 | 铅踝忽略隐匿不等于忽略无敌；指定睡眠豁免不等于忽略所有异常。 |
| AllyTargetFree | 未忽略且来源与目标同 side 时检查 | 异阵营禁选与同阵营禁选不是一个开关。 |
| HealFree | 有 HEAL purpose 且未忽略时拒绝 | 普通治疗选择受限，不等于所有显式 HP／EP 回复都按同一资格拒绝。 |
| MotionTargetFree | 在相应来源／忽略分支中把 sourceMotionMode 传给目标虚方法 | 蒂比按 blockMode 与来源运动方式比较，不要求目标自身为 AIR。 |
| 迷彩 | TargetFree 之外的独立检查；受 forceIgnoreCamouflage 与 Ability 的迷彩政策影响 | 原目标直选与空爆附加目标可以采用不同政策。 |
| 职业与附加职业 | 职业掩码、Character 数据与共享附加职业按对应分支检查 | 不是通过部署方式或阵营猜职业。 |
| 异常包含／排除 | 对有效异常标志检查；另有具体 Selector 的标签／Buff／Combo 条件 | 免睡者不占爱丽丝两个名额，不代表普通攻击不能选择它。 |
| 排除自身 | AdvancedSelector 按 excludeOwner 在相应后置选择分支移除 owner | 不能把排除自身变成所有友方增益／治疗的固定条件。 |
| 地图层 | Selector 与 TargetOptions 具有相应层检查和豁免 | 不是 Unit 的 GROUND／AIR。 |
| 目标 hitRange | 未豁免时将来源根格交给目标 `IsInHitRange` | 禁闭所证明可由目标自身限制谁能选它，射程够大仍不充分。 |
| 额外 validator／排除名单 | 在通用资格之后按实际登记检查 | 标记光环不必检查欲安装的 Effect Definition。 |

字段名不能代替消费者：当前普通 `BattleUtil.VerifyTarget` 79605 按目标 changeableMotionMode 检查 MotionMask。`TargetOptions._VerifyAdvanced` 则使用自己的 ignoreMotionMode 跳过来源相关的 MotionTargetFree 检查；不能仅按名字把它解释成“忽略所有目标空地条件”。还须核对调用实参：BattleUtil 的第四个参数实际是 playerSideMask，该普通体未消费它，XLua 分支仍原样传递；它不是 ignoreMotionMode。本次选定组件没有后者的非默认启用正例，以上限定各自静态消费者，不推导其他入口也忽略玩家侧资格。

### 4.1 有效异常与登记实例分开

原生直接证据：`Entity.isTargetFreeWithImmuneFlag` 67507 汇总目标侧若干有效异常，使用 `Attributes.GetAbnormalFlagWithImmune`；`get_isHealFree` 67515 读 HEAL_FREE；`get_isAllyTargetFree` 67516 读 ALLY_TARGET_FREE。`get_isCamouflage` 67526 先读 CAMOUFLAGE，再检查 INVISIBLE 免疫，使迷彩失效，但不因此清除产生迷彩的 Buff。

来源包括单位初始配置、被动能力／Buff、技能／内容程序，以及位置／消失等宿主事实；不能从一个当前查询倒推唯一 Effect 实例。异常安装拒绝、免疫使异常失效、内容 Filter 主动排除免疫者仍分别遵守[案例19](19-effect-selection-and-immunity.md)的三种语义。

触发侧的 isHidden 使用异常 HIDDEN；isHiddenToAlly 还包含 DOZE，二者另有自身免疫查询；这些并不等价于普通禁选聚合中的 INVISIBLE。原件保留具体 getter 和常量，不能将一个谓词的名称或最终表现推广为其他谓词的来源。

### 4.2 同名 ignoreHealFree 的选择与作用

Mon3tr S1 的实际 RangedHeal 能力 `_ignoreHealFree=true`，其 AdvancedSelector 上的同名字段却为 false。新增原体已闭合：`Heal.GeneratePurposeMask` 93061 仍无条件加入 HEAL；`Heal.NewHealNode` 93058 将能力字段装入 ApplyHeal 节点；`ApplyHeal.Execute` 99857 再把它作为 Entity.ApplyModifier 的 force 参数传入。它不是修改 Selector 的禁疗豁免。

因此，**能对已确定的目标强制实施治疗**与**能在本次普通选择中选中禁疗目标**是两个事实。不能看到能力上的 true，就把 Selector 的 false 合并成 true。后续 force 接收分支复用案例29，项目既定 healFree 仅限制 Targeting 的政策仍独立保留。[实际配置与原体](../evidence/targeting-pipeline-20261109/content/healing-filters.json)

### 4.3 对地规避来源补核

`TargetOptions._TryGetSourceMotionMode` 76372 优先从有效来源身份读取当前 changeableMotionMode，身份失效时可使用 Init 保存的样本；`_VerifyAdvanced` 在异阵营且未豁免运动禁选的相应路径，经 slot87 调目标 `isStillMotionTargetFreeWithImmuneFlag`。当前 Character 覆盖 77321 比较自己的 blockMode 与这个来源参数。Entity 基类则按自身有效运动身份处理。

这补齐了案例21此前缺少的选择器上游：蒂比对地规避与“来源能否对空”无关，也不能通过修改蒂比自己的 Layer 代替。是否忽略该限制仍属于本次 Selector 的选项，不修改目标真实状态。

### 4.4 阻挡列表与普通范围的资格不同

关系加前分支调用 `BlockedOrAdvancedSelector.ValidateTarget` 75743，经 `BlockedBaseSelector.ValidateTarget` 75732 进入 Advanced／TargetSelector 的验证，仍可检查地图层、hitRange、迷彩和已登记 validator。随后有自身的无敌／指定异常豁免检查；默认未忽略禁选时检查 isInvincible，选择性忽略时另走 IsStillTargetFreeWithImmuneFlag。

这条关系列表分支没有调用范围查询中那次完整 `TargetOptions.VerifyTarget`。因此不能给它机械套用与普通范围相同的 motion／阵营／全部 TargetFree 流程，也不能反过来宣称“被阻挡就必定无视隐匿”。实际结果还受 Trigger 的额外验证、有效异常／反隐、关系生命周期和内容配置约束。敌人的 CombatWrapper 直接取得 blocker／combatTarget 则又是另一入口。

项目现有“敌人阻挡者直选”与“干员仍检查有效 Restriction”的内容政策保持独立；本案只补齐原生调用差异，不据某个跳过点静默改变已经确定的政策。

### 4.5 组合 Validator 与分组回退

冻河 S3 的 CastSkill 将一项 EmptyAbility 登记为 `SelectCharacter` 别名，后者引用 **GroupSelector**，其三个子项使用 AdvancedSelectorWithValidatorFilter；该组不是赤刃明霄陈 S2 使用的 ParallelGroupSelector。新增[组件摘录](../evidence/targeting-pipeline-20261109/content/validator-config.json)与[消费者原体](../evidence/targeting-pipeline-20261109/content/validator-composition.json)同时保留两条不同链。下面解释这个已登记入口执行时的选择程序，不把静态登记冒充完整技能动态观测。

- ValidatorFilter 先执行普通 AdvancedSelector.ValidateTarget，再按 settings 顺序要求每项 `validator.Validate(target) === isMatched`；这是短路 AND，isMatched=false 表示该项必须不匹配。
- 每项 ignoreTargetSide 在 Reset 时传给内部 TargetValidator.SetData，只影响对应内部 validator 的阵营判断，不能覆盖外层 AdvancedSelector 的阵营资格。
- AdvancedCharacterValidator 先过普通 TargetValidator，再要求目标实际为 Character，随后按自身开关检查建造／部署类别、稀有度、技能发动状态、是否有技能、技能类型和阻挡等条件。内部 TargetOptions.enableAdvancedOptions=false 只关闭它自己的高级选项，不会关闭这些派生类的独立条件。
- 所选 GroupSelector 配置 selectable=true，按 rangeSelectorsList 的顺序执行，遇首个非空结果便加入并停止；不是把三组候选先合并再统一排序。组自身还有数量和去重政策，不能由一个子项的 maxNum 代替。

这份 S3 配置具体依次尝试：有非被动技能且未处于技能 affecting 的对象；有非被动技能的对象；其余符合公共资格的对象。三组都排除本来源登记的 `tocka_s3[trigger]` 标记；各组另受外层阵营、行动方式、职业、实体类型和排除自身约束。`isMatched=false` 是对整个对应 validator 的结果取反，不是任意挑其中一个字段反向。技能类型 PASSIVE／MANUAL／AUTO 的原生枚举与配置绑定保存在新增原件，不自动对应项目 Skill 的类型组织。

这些事实解释的是已核实的资格组合与分组控制流，不要求项目复制相同类层次；当前显式 Filter／Selector 是否以及如何承载具体内容，留在架构设计阶段判断。

### 4.6 来源离场后的真实群攻弹道

2026-11-09 定向补核使用空爆的普通攻击，配置与连续原体见[本批证据](../evidence/targeting-aoe-source-20261109/README.md)。本节限定当前客户端普通 native 分支，没有执行实机撤退实验或确认活跃 XLua 替换。

真实配置链为 `char_282_catap` 的 Default Mode → `RangedAttack` → `projectile_catap` → `SimpleProjectile`／`HitBehaviour`／本地 `CircleRange`。该样本未启用已核对的来源失效停止、来源管理、Character 清理及等待弹道结束时清理选项；HitBehaviour 在抵达时做范围搜索，不限于保存的原目标。炎熔的所取普通攻击则使用 `MeleeAttack` 和视觉发射配置，不能仅凭画面表现把它当作同一类逻辑弹道正例。

**直接证实的先后关系：**

1. `HitBehaviour.Init` 在弹道创建时初始化自己的 TargetOptions，保存来源阵营相关选项及来源运动身份样本。
2. `HitBehaviour.OnProjectileReached` 先复制已保存的 TargetOptions，并据当前抵达位置执行 Box2d 范围查询；不是重新调用原攻击的 Selector，也不要求先成功取得当前来源。
3. 范围名单形成后才读取当前 source。source 失效时跳过来源的选择通知，但仍继续遍历名单并调用 `DealHitTarget`。
4. TargetOptions 中来源运动身份的查询遵守第 4.3 节的当前身份优先／初始化样本回退。目标自身的空间与资格检查仍发生在本次范围查询中，不是把发射时的目标名单固定下来。

普通撤退清理链另以当前客户端复核：`Character.Withdraw` → `FinishMe`／`OnFinish` → `Character.ClearAbilities` → `Entity.ClearAbilities` → Ability 的 Detach／结束。空爆未启用 Character 的弹道清理开关；RangedAttack 在结束时只于等待弹道且未豁免清理的组合下调用 ClearProjectile，该样本不等待。Projectile.Init 又因该弹道不受来源管理而跳过来源的 managedProjectiles 登记；来源失效停止也未启用。因此，这条普通撤退路径不会仅因来源退场终止已发出的该弹道。具体方法、虚派发与配置分别保存在本批原件，不由字段名称推导触发时点。

**调用链推论：** 对仍按自身生命周期运行并抵达的该弹道，当前来源身份失效不会阻止 AOE 搜索与逐项命中。发射时保留选择所需的来源信息，与抵达时选择当前范围目标，是两件独立的事。伤害使用当前 ATK 还是缓存 ATK、来源事件和归属是否保留，继续遵守[案例 18 的来源与伤害分支](18-projectile-source-and-target-lifecycles.md)，不能从范围选择仍成立推导完整来源属性与事件也被保存。

这补齐的是既有延迟范围作用的原生需求，不要求建立新的 Targeting 流程或保存整份 Unit。具体来源事实在项目 API 中如何提供，仍由架构设计确定；不能将“当前来源 Ref 无法解析”设为所有选择的统一拒绝条件。

## 5. 排序、限额与作用顺序

排序分支的完整锚点见[优先级证据](../evidence/targeting-pipeline-20261109/priority/README.md)。必须区分候选的权重、Selector 的名单修正、能力层的输入目标重排；最后实际作用顺序还可能受能力程序影响。

### 5.1 三类通用选择路径

1. **AdvancedSelector**：普通 postFilter 通过相应权重算法选择；配置最终嘲讽排序时，采用该分支的候选排序与裁剪流程，不能解释为只重排已经截取的最终 k 项。
2. **SecondaryFilterAdvancedSelector**：基础过滤／排序后执行二次优先处理，再按配置处理嘲讽和最终限额。二次操作具有自己的交换规则，不是天然等价于对所有候选再做一次稳定 sort。
3. **BlockedOrAdvancedSelector**：先按阻挡列表依次验证并加入输出；未满再调用范围选择补足，排除已加入项。范围内的最终嘲讽排序不能自动覆盖已经单独加入的阻挡前缀。

因此，当前项目 `blockedFirst` 的关系取得顺序可以表达一种阻挡加前政策；它与 `HATRED_DES_BLOCKED_FIRST` 的“先分阻挡组、组内比较仇恨”不是同一算法。也不能仅凭 Wiki 的概括顺序，声称所有 Selector 都在最后用嘲讽重新覆盖阻挡优先。

普通 Filter 为候选计算一个或两个权重后进入优先队列，资格失败发生在入队与名额裁剪之前。WeightedTarget 的比较涉及高等／普通权重、相应 FP 比较间距与分桶；比较仍相同时调用 Entity.CompareTo，以实例 UID 决胜。因此它不是所有情况下都保持候选输入顺序的稳定 topK。最后嘲讽路径所用的 StableBubbleSort 则在嘲讽相同的情况下保留此前名单次序。这两种平局政策不能合并描述。

随机 postFilter 为候选逐个从 Battle RNG 抽随机数作为排序权重，再经相同队列选择。项目的无放回洗牌消费方式不同；本案不据此要求复刻随机数消费轨迹。

`_abilityInputTargetAsSortSource` 为 true 且输入目标身份通过检查时，可将 Ability 的 inputTarget 作为本次 FilterUtil 的排序参考源；普通分支使用 owner。能力拥有者、搜索中心、排序距离的参考源是不同事实。所取 `skchr_chen3_2` 的子 Selector 配置提供了该开关的非默认正例；它与普通陈 S3 的 `skchr_chen_3` 不是同一个技能。

阻挡数量限额也独立于上述排序：`allowZeroBlockCntLimit=false` 时为 `min(maxNum,max(1,blockCnt))`，为 true 时为 `min(maxNum,blockCnt)`；是否启用由对应 Selector 配置决定，不从 Blocker 存在自动推导所有攻击只能选择其阻挡数。

### 5.2 仇恨与路线来源

原生角色类与敌人类按实际实体实现使用不同公式，和当前 side 无必然对应关系。本次普通分支为：

```text
Character:
  3×10^8 × tauntLevel
  + clamp(createdTime×1000 + 当前全局同帧创建计数, 0, 3×10^8)

Enemy（有运动 Cursor 时）:
  10^8 × tauntLevel
  + clamp(-moveCursor.distToExit, -10^8, 10^8)
```

常量与实际 float 表示见原件。`tauntLevel` 来自属性20的整数求值；Character 在实际创建时保存 fixedPlayTime、递增全局同帧计数并重算，嘲讽属性变脏也会触发重算，此时仍读取全局当前帧计数，不是本实例冻结的创建 ordinal。BattleController 的 Tick 清零该计数。Enemy getter 则读取当时的嘲讽和路线距离。

Enemy 无运动 Cursor 时的距离按0处理；不是读取一个不存在的终点，也不能将此规则直接等同于项目任意无终点 Plan 的距离。

当前 Enemy getter 经 `get_moveCursor` 取得距离：有效 Trace 采用 Trace，否则采用 Main。Fear／Attract 虽可能接管身体移动，却不直接成为这个 getter 返回的 Cursor；其间距离仍从单位新的身体位置向 Main／Trace 路线估算，不是冻结旧距离。

使用的是普通 estimated distToExit，不是名为 precise 的查询；不能直接改成“当前位置到最终终点的直线距离”。地图内可达时使用对应导航图及位置修正，地图外／不可达时有直线回退。项目的无终点 Plan 没有一个可直接照搬的原生 RouteData.endPosition=null 分支，不能补造原生数值。

累计导航距离从后续路段向前衔接；原生 APPEAR_AT_POS 的传送前后空间跳跃不作为普通行走路程累计。因此即使都能取得最终格，按坐标直接串联所有路点也不等价于这个查询。

### 5.3 混合 HP／EP 治疗

原生直接证据和默认／S2真实配置见[治疗筛选证据](../evidence/targeting-pipeline-20261109/content/healing-filters.json)。

| 桑葚配置 | 排除条件 | 排序主次 |
| --- | --- | --- |
| 默认 postFilter37 | HP 与有效 EP 都满才排除 | HP 比例优先，再比较最小当前 EP 的绝对剩余量。 |
| S2 postFilter38 | 同上 | 最小当前 EP 的绝对剩余量优先，再比较 HP 比例。 |

爆发恢复中用 maxEP 作为此处的有效 EP，即按满 EP 判断；这不是读取一个始终递增的 EP 损伤比例。不能仅凭某条 EP 接收 Rule 不通过，就从联合治疗的候选集合中移除整个目标。满 HP 但缺 EP 可以占据名额，缺 HP 但当前不能回复 EP 也不能由此统一排除。这里是内容选择政策；实际 HP／EP 仍分别结算，[案例29](29-hp-and-ep-healing-settlement.md)已确认桑葚所选普通命中链先附加 EP 再执行主 HP。

区分例（静态控制流推导）：A 半血但 EP 满，B 满 HP 但缺 EP，普通37先选 A、S2的38先选 B；只有 B 时普通37仍可选它。B 满 HP 且处于爆发恢复时，因两项都按满值而被排除；若其 HP 受伤则仍可因治疗需要入选。两个 Filter 本体不负责 HEAL_FREE，禁疗资格仍来自前述通用选项和 Purpose。

## 6. 绑定、更新时点与再次验证

完整当前方法、generic 身份／alive 校验与配置正例见[绑定证据](../evidence/targeting-pipeline-20261109/binding/README.md)。

### 6.1 三份不同的目标事实

- **inputTarget／input position**：触发侧或外部调用者交给能力的输入。
- **castTargets**：`AbilityStandard.UpdateTargets` 形成的本次施放名单。
- **Projectile 实际接收者**：保留的原目标身份，或抵达／接触／周期时重新形成的接收名单。

`UpdateTargets` 的 source 决定选择中心：FROM_OWNER 使用 owner，INPUT_TARGET 使用保存输入对象，INPUT_POINT 使用保存输入坐标，INPUT_GRID_POS 将其转为格中心，NONE 则不经一般候选搜索。INPUT_TARGET 不等于“原目标唯一候选”。

其布尔参数实际名为 **updateInputPos**：为 true 且输入对象仍有效时先读取其当前 mapPosition，更新保存位置／Locatable，再执行选择。启动选取传 false，施放前更新传 true。它不是“要不要刷新候选”的总开关。

独立的 alwaysIncludeTarget 可把仍 alive 的原输入目标补回施放名单：原目标尚不在列表时，非空名单先移除末项，再追加原目标；空名单则直接追加。该路径不重跑 Selector.ValidateTarget，不是无条件再增加一个名额。近战能力还可以把已包含的输入目标移到首位。这些发生在 Selector 排序之外，可能改变最终作用对象与顺序。

### 6.2 timing

| timing | 当前普通 native 消费 | 实际正例 |
| --- | --- | --- |
| AT_BEGINING=0 | 启动前更新一次名单 | 妮芙 S1。 |
| BEFORE_SPELL_START=1 | 每次 spell 前更新名单 | 维什戴尔普攻、羽毛笔 S2；仍要结合 source 和原目标补入政策解释。 |
| RESELECT_IF_TARGET_DEAD=2 | 启动时选择；每次 spell 前，仅 inputTarget 无效／不 alive 才重选，成功后可重绑新 inputTarget | 陈 S3。 |
| BEFORE_FIRST_SPELL_START=3 | 只在 spellCnt 为0的首次施放前更新 | 已展开分支；本次代表配置未取得实际启用正例。 |

前摇因目标死亡而中断是另外的能力政策；不能从 timing 不重选推导“必定完成输出”。同样，输入目标仍活着但获得隐匿、移出射程、改变阵营，不会单独触发 timing2 的死亡重选分支。

### 6.3 后续资格矩阵

“不重验”限定所述普通路径，具体覆盖或内容程序仍可明确增加检查。

| 阶段 | 身份／存活 | 消失、隐匿／迷彩、原射程、阵营 | 拒绝后的行为 |
| --- | --- | --- | --- |
| 实际 Selector 分支 | 按对应候选入口与 validator | 按本次有效选项和选择中心判断 | 不进入名单，再由剩余候选竞争。 |
| alwaysIncludeTarget 补入 | 原身份可取得且 alive | 不重新执行上述一般 Filter | 未通过便不补入；不是替它再索敌。 |
| 普通 DoCastOnTargets | 逐项 ObjectPtr 有效且 alive | 不统一重跑普通 Selector | 跳过失效项；不自动挑一个新目标替代。 |
| 普通弹道原目标保底 | 保存身份有效且 alive，另有尝试与命中历史 | 不统一重验 | 不自动换人；仍有独立停止／范围业务。 |
| 范围／碰撞命中 | 当前空间候选、身份／alive、TargetOptions | 按该次范围与 Behaviour 政策；不等于原攻击射程 | 按该入口的名单／次数政策处理，不自动替换原目标。 |
| 周期 SelectorHit | 本次自己的 Selector | 按本次政策重新选择 | 不是所有弹道必经阶段。 |
| 最终 HP／EP／Buff | 当前接收／安装／生效机制 | 不从“已选中”统一推导免疫与成功 | 拒绝或零实际变化不等于回到 Targeting 换人。 |

`OnSpellStart` 的 owner 许可入口 `CanDoAbilitySpellOn` 在当前普通 Entity 实现只返回允许；它保留可覆盖入口，不证明有一套通用的阵营／射程／隐匿重验。`DoCastOnTargets` 则已闭合到当前 ObjectPtr.ValidAndAlive 的实际 generic 体，不依据函数名猜测。

远程还有独立的位置输出分支：基类没有处理有效目标且 allowNoTarget 及相应配置成立时，`RangedAttack.DoCastOnTargets` 可用保存输入位置或其所在格中心创建 FixedPosition 并发射。它不重新挑选 Unit；跳过失效的 castTarget 不保证整个能力没有输出。原目标补入、无目标发射、弹道抵达后的原目标保底分别属于不同层，不能合并成一个“始终命中目标”的开关。

## 7. 最终作用与项目对照

选中、施放、命中、接收和实际资源变化必须分别记录。已有原目标弹道继续命中，不等于无视无敌；睡眠免疫者在名额前被排除，也不等于任何复合 Buff 都应安装失败。

| 差异 | 原生事实 | 现有实现 | 已确认的项目选择／本案结论 |
| --- | --- | --- | --- |
| 选择入口 | 多种 Selector、Range、Ability 时点与选项组合 | Request 显式 Filter + Selector | 保留显式策略；不复制原生类树或布尔开关集合。 |
| 用途 | Ability／动作节点生成 purposeMask，所取纯效果光环可为 NONE | Request.purposes 由调用方声明，另有 EFFECT | 不从后续 Operation 自动推导用途；EFFECT 不携带定义 ID，也不自动代表免疫检查。 |
| 目标侧限制 | Entity／Attributes／Buff／空间事实与具体 validator 共同形成 | Targetable 保存 Restriction Contribution，按 kind 豁免 | 机制身份与一次登记身份分开；不在 Targetable 重复保存异常免疫。 |
| 普通仇恨 | 嘲讽、实体类、时间／顺序、路线估计距离及具体优先算法 | 普通内容仍用 distance 等显式比较器 | 属于已知缺口，不能把最近目标称为完整普通仇恨。 |
| 角色出场次序 | Character.UpdateHatred 可重新读取本帧全局部署计数 | 尚未接入对应持久事实与普通排序 | 已选择固定实际入场顺序；不复刻这个全局缓存重读细节。 |
| 绑定与更新 | source／timing／补入／能力重排共同决定名单 | 普通攻击模板 prepare 选择并保存 bindings | 这是已实现的一种内容政策；其他内容不能自动套用。 |
| 启动条件与缓存目标 | Trigger 可检查最小数量、保持旧目标，并按搜索 ticker 决定是否重新查找 | hasCandidate 只判断显式 Filter 是否至少存在一个候选；普通模板自行选择 | 现有查询不能冒充全部原生 Trigger 政策；哪些内容需要这些行为，按已核实正例决定。 |
| 组合资格与组控制 | 内部 Validator 可取反、单独忽略阵营；Group 可按顺序取首个非空组 | 有 and／or／not 和自定义 Selector，尚未接入这些具体内容 | 不能将“接口可以表达”当作已经实现；也不因原生有组件类就新增一套对应框架。 |
| 来源和参考中心 | 来源运动方式可读取当前对象或回退样本；能力拥有者、选择中心、排序参考源可不同 | 标准 Filter 通常从 Request.source 读当前对象；不存在时按各查询返回拒绝或无比较差异 | 不在调查中把来源快照或替代中心统一塞入 Request；具体所需事实须按机制设计。 |
| 普通原目标命中 | 保存身份并复核有效／alive，不统一重跑普通选择 | tracking 原目标路径独立于 Targeting Filter | 现有边界有直接依据，不能为统一接口而强制重新索敌。 |
| HP／EP联合治疗 | 同一选择政策可包含两种需求，实际作用仍有顺序 | 有单项 Filter／HP比例比较，完整行医选择未接入 | 新证据补齐具体机制需求，不在调查中静默新增通用排序政策。 |
| 随机 | 逐候选抽随机排序权重，RNG 消费与筛选数量相关 | Fisher–Yates 无放回，零数量／空集合不消费 | 保持项目自身确定性；不要求复刻官方 RNG 消费轨迹。 |
| 近权重与平局 | 普通权重有 FP 比较间距及 UID 后继，晚嘲讽另用稳定排序 | 稳定 topK 保留登记顺序，Comparator 使用 JS 数值 | 本案明确差异，不据当前实现证明二者所有情况下结果相同；是否接入特定近值规则留待设计权衡。 |
| 数量与中间限额 | Range、Filter、Blackboard、阻挡数分别影响数量，部分路径有128项边界 | Selector 显式声明数量，没有统一的128项边界 | 记录各入口实际差异，不把实现中的每个缓冲上限自动变成项目统一限制。 |
| 最终结算 | 原生 Modifier／Buff 各有接收与事件分支 | 四条 Calculate→Apply 与 Effect 生命周期 | 保持已经确认的阶段边界，不按原生事件编号改写项目。 |

项目基线 `9a24854` 的核对入口：[Targeting 契约](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/core/battle/targeting/contract.ts)、[Filter](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/core/battle/targeting/filter.ts)、[Comparator](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/core/battle/targeting/compare.ts)、[Selector](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/core/battle/targeting/selector.ts)、[Targetable](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/core/unit/capability/targetable/capability.ts)、[攻击模板](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/content/actions/attack.ts)、[原目标弹道](https://github.com/wfrfred/ArkBattle/blob/9a24854/src/content/projectiles/tracking.ts)。项目政策对应[Targeting 架构](../../architecture/targeting.md)、[普通仇恨事实](../../architecture/tactical-semantics.md#仇恨事实与普通排序)、[Calculate／Apply 边界](../../architecture/vitality.md#1-calculate-与-apply-的语义边界)。这些文档与代码只作为项目对照，不作为原生证据。

本案没有修改 Core、Content 或测试，也没有为调查结果确定新的 API。

## 8. 覆盖与具体未决项

通用配置绑定、范围／全场候选、基础与高级资格、主要排序分支、输入绑定、四种 timing 的消费者、普通释放和原目标／范围命中已分别提供证据；已知特殊差异继续引用原案例。

仍需按内容核实的边界：

1. timing3 已有普通消费分支，但本次选定资源没有实际启用正例；不把方法存在当成新增支持需求。
2. 号角等真实 hook-key 声明的最终覆盖值来源尚未闭合；不能把普通黑板没有键推导成所有模块／玩法都不赋值。
3. 本次有限组件调查没有为所有 ignoreMotionMode、ignoreHitRange、异常排除、最终嘲讽、keepTarget、搜索间隔覆盖开关找到非默认实际启用样本。分支语义与启用证据分别记录，不推导这些字段无用；Shared skills 的统计也不冒充全部角色包调查。
4. 项目无终点 Plan、任意 GOTO 等程序不与原生所有路线字段一一对应；如何向仇恨提供准确事实仍需项目设计，不能补造“原生 null 终点距离”。
5. 活跃 XLua 与特殊派生 Selector 可替换通用分支，本案未执行实机观测；静态普通链不证明所有动态组合最终结果相同。

这些未决项分别限制具体配置或特殊路径；不重新推翻已经直接核实的普通流程，也不以“未穷尽全游戏”掩盖本案已明确的适用范围。
