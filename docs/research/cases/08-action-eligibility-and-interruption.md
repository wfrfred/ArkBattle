# Action 启动资格、互斥与中断

核查日期：2026-10-14。项目基线：`73597d6d`。本轮回答 Action API 草案中尚需证实的行为，仅保存调查结果，不修改源码或测试，不将建议视为已定 API。

## 证据范围

复用 [07 时间研究](07-action-timing-and-animation.md) 的本机官方 Windows 客户端，重新读取原生方法并核对 GameAssembly、metadata 和泥岩技能资源包的 SHA256，三者均未改变。metadata version 29，IL2CPPClass vtable 起点为 `0x140`。

- GameAssembly：`583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`。
- metadata：`d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。
- `[uc]skills.ab`：`14306a31b1856f61b25812a69a2a057b7c4634561fb2c2bccc42fb37ee41a27e`。

方法地址、完整普通分支、字段／虚表映射和泥岩 Prefab 对应保存在 [证据包](../evidence/action-eligibility-and-interruption.json)。未执行 XLua hotfix，也未运行官方战斗；不将本机静态分支推广成所有版本和所有内容的实机结论。

## 1. 排他性发生在哪一层

已核对的事实：

| 层级 | 证据 | 能确认的行为 |
| --- | --- | --- |
| Ability readiness | `Ability.get_isReady`，63033，`0x1805d8040`；`get_isAffecting`，63036，`0x1805d7cc0` | 普通 readiness 检查接收 Ability 自己的 timer 与 affecting；普通 affecting 读取自身 casting |
| 开始执行 | `StartCastingInternal`，63104，`0x1805d6d20` | 写入接收 Ability 的 `m_isCasting` 和开始帧，再执行自身 OnCastStart |
| 普通角色攻击 | `Character.AttackState.OnTick`，76193，`0x180a65120`；OnExit，76194，`0x180a64f20` | 行为状态协调当前普通攻击和下一轮；离开时通过 Ability 的中断入口结束当前攻击 |
| 普通敌人攻击 | `Enemy.AttackState.OnTick`，76662，`0x180a85990`；`TriggerEnemySkill`，76425，`0x180a75770` | 攻击状态观察所持当前 Ability 的 casting；技能调用通过 Attack／Combat Wrapper 或状态切换接入 |
| 命名子能力 | `Nodes.TriggerAbility.Execute`，99721，`0x18115def0` | 在来源上查找指定的 attached Ability，检查或调用该 Ability；所读普通路径没有全 Unit casting 扫描 |

所以，底层 Ability 的储存及启动入口没有把“宿主只允许一个 Ability 在执行”作为统一不变量。普通主动作的串行由单位行为流程协调。

具体例子是泥岩二技能：根 `AnimatedActionToOwnerAbility` 的释放动作先在 SOURCE 上调用 `RollAttack`，再治疗并产生表现效果。根与 RollAttack 是不同 Ability，根正在执行时可以进入子能力调用。Prefab 的 Root／Child 及 TriggerAbility 参数均收入证据包。

这个例子证明嵌套能力调用，并不证明泥岩同时拥有两条长期并行的普攻；Stronghold 可以把整段内容组合进一个 Action。不能仅凭官方 Ability 数量要求项目引入并发调度框架，也不能反向宣称全 Unit 硬互斥是官方通则。

**对草案的约束：**“每 Unit 一条占用性的主动作”可以作为明确的项目模型，但主动作的等待、替换和抢占必须由内容表达。普通 casting 不能让强制打断后启动的技能请求无条件排队。若 Action 的定义范围还包括独立可执行程序，则不能把同 Unit 的第二个实例直接视为非法。

## 2. 禁止启动与中断当前执行是两项规则

[PRTS 异常效果](https://prts.wiki/w/异常效果#异常效果（AbnormalFlag）) 给出了可区分的规则：

| 机制 | 启动资格与结束行为 |
| --- | --- |
| 缴械 | 禁止普攻，并中断正在执行的普攻；仍有无敌例外 |
| 战栗 | 限制 Combat 下启动普通攻击；现有攻击的打断由相关 Buff 另行负责 |
| 沉默 | 作用于可以被沉默的技能／能力，不是对所有执行程序的统一停止 |

[PRTS 特殊机制](https://prts.wiki/w/特殊机制) 还区分了强制抢占当前动作、空闲时才触发，以及还需要满足普通资格的触发方式。这里的“不打断”不是与现有主动作同时发动，而是当前主动作尚在执行时不触发。

客户端侧也存在分开的入口：

- `Entity.get_canUseAbility`／`get_canUseAtkOrCbt`（66411／66412）查询当前资格。
- `EnemySkill.CheckAvailable`（66310，`0x1806dd560`）检查本技能是否启用、冷却、次数、可用状态及所需 SP。
- `EnemySkill.CastToTarget`（66305，`0x1806dd2d0`）调用 `TryReduceSp` 后进入 Ability 施放；再次启动所需 SP 不足，不等于撤销已经接受的施放。
- `Character.AttackState.OnExit` 与 `Enemy.InterruptLastAbilityIfNot`（76417，`0x180a6e9b0`）明确调用中断流程。

**对草案的约束：**不能定义为任意 `canAct` Rule 返回 false 就自动取消当前 Action。启动 Rule 负责准入；确实需要中断的控制／技能／阶段切换业务调用取消操作。共享内容模板可以封装常见中断规则，但不用一个 Unit 级布尔结果替代所有内容的中断政策。

## 3. 外部取消需要承接内容结束业务

重新核对 `Ability.FinishIfNot`（63098，`0x1805d5910`），普通分支顺序是：

```text
确认自身仍在 casting
→ CleanupForNextCast（slot 43）
→ OnCastEnd（slot 53）
→ 明确的 cooldown 政策
→ 常驻 finish callbacks
→ 此次保存的一次 finish callback
```

这与 [05 Skill 开始与结束](05-skill-start-and-finish.md)、[07 时间研究](07-action-timing-and-animation.md#8-弩手恢复移动与取消后摇) 的已有证据一致。普通结束／普通中断不默认重启完整攻击周期，但显式重置、前摇目标死亡与结束时的小幅时间修正各有入口。

**对草案的约束：**外部 cancel 也必须能够执行内容结束业务。只删除 Action、关闭依赖 Effect 并发出事件，不能承担任意单位行为状态、收尾表现或周期政策。可选的内容结束回调能提供这一能力；不需要复制官方回调名称、委托容器或继承结构。

## 4. 攻击周期与敌人技能 cooldown 不应混用

额外发现了草案容易忽略的一项时间规则：

- 普通攻击 Ability 的 timer 与 casting 并行，已在 07 证实。
- `EnemySkill.Tick`（66312，`0x1806de520`）另有自己的 timer：所读普通分支在自身 Ability 正在 casting 时跳过该 timer 的更新。
- `EnemySkill._OnCastFinish`（66319，`0x1806debf0`）对该技能 timer 调用 `Reset(true)`，而且有单独影响 main Ability cooldown 的配置分支。

[PRTS 敌人技能说明](https://prts.wiki/w/矢量战术装备#技能) 同样区分首次与后续技能冷却，并记录施放期间或不处于对应模式时暂停冷却的情况。模式暂停的具体原生调用方本轮没有继续穷举，只将其记录为 PRTS 支持的规则。

**对草案的约束：**按 Definition 保存攻击周期是合理的；不能进一步把每种敌人技能的触发 cooldown 都解释为“Action 开始时设 readyAt，随后无条件随绝对时间流逝”。技能触发资格可以由 Skill／具体内容保存，并在 Definition 启动前查询；Action 内核不需要因此增加敌人专用模式标记。

## 5. 固定声明顺序不能完整代替敌人技能选择

`Enemy.CombatWrapper._PickAbility`（76886，`0x180a8aac0`）收集一个优先级层内满足 Family／Trigger 条件的候选。`0x180a8ac8b` 比较后续候选 priority；不同层时结束收集。非空候选集在 `0x180a8ae13` 取得战斗 RNG，并交给候选抽选辅助函数。

[PRTS 敌人技能说明](https://prts.wiki/w/矢量战术装备#技能) 明确描述同优先级随机选取。这里的随机平局会改变实际释放的技能，不属于可以删去的无效 RNG 消费。

**对草案的约束：**有序 Definition 列表可以提供默认选择，但“顺序尝试第一个成功 start”不是全部敌人技能的目标语义。具体敌人需要表达优先级与同层选择，实际选择业务应通过内容函数接入；这项事实不要求建立中央 Selector 注册表。

## 6. 不需要查官方来决定的部分

私有状态在嵌套调用前是否写入后继 BattleState，属于函数式状态传递契约；不靠官方的共享可变对象设计来决定。异构类型封装、文件树和 Snapshot 保留字段属于工程设计。Unit.onTick 已确认的项目执行点不因本次查证而重排。

本轮尚未验证所有特殊内容是否需要独立的长期并行动作、所有 enemy 技能模式的暂停入口，以及 Lua 对普通分支的替换。上述限制不会否定已明确的启动／中断区别、嵌套子能力调用和敌人技能平局选择。
