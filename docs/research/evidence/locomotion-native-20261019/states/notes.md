# Locomotion 原生核查：资格、状态、速度与 moving 信号（2026-10-19）

仅研究普通塔防 Enemy 原生路径；不修改 src/tests，不提交 commit，不纳入生息演算、舟艇或赛车。N=指令/metadata 直接支持；I=限定调用链推断；U=本轮未确认。未运行战斗现场，也未证明 Lua hotfix/所有子类保留原生普通分支。

证据目录：`docs/tactical-research/evidence/locomotion-native-20261019/states/`。`metadata.json` 收录方法 index/VA/显式读取 size/code SHA256/参数、字段、正确解码的 enum、速度字段 AttributeMeta 原始 blob 与常量地址。每份 asm 使用下一已知函数作为显式读取边界，末尾可能有填充/跳转表；共享泛型或空函数的多名称注释不能当成无关业务调用。方法索引均来自当前 metadata，不沿用旧报告索引。

GameAssembly SHA256 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`；metadata SHA256 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。

## 1. 移动资格与控制状态

**N** `Entity.get_canMove` 66413 (`0x180702180`, size0x150) 普通结果为：

```text
!isStunned && !isUnmovable && !isFrozen && !isLevitate
isUnmovable = AbnormalFlag.UNMOVABLE(13) || UNMOVABLE_PRIVATE(22)
isStunned = STUNNED(0) || STUNNED_NO_AMPLIFY_DAMAGE(19)
```

`isFrozen` 66488 读 FROZEN(16)；`isLevitate` 66490 读 LEVITATE(25)。FORCE_LEVITATE(36) 是另一个flag，本getter没有读它。本轮不将这个 getter 扩大成所有强制位置变化的禁令。`canMove` 不看属性移速是否为0，也不直接检查 blocker、ability casting 或攻击状态。普通路线是否调用运动由状态机另管；实际 controller 也有 canMove 门禁（root 负责71056）。

**N** `MoveState.OnTick` 76658 (`0x180a977d0`, size0x4c0) 按下表依次检查，命中后切状态并返回，未进入后面的普通移动：

| 检查顺序 | 条件 | 后继 |
|---|---|---|
|1|isDialogTarget|DIALOG15|
|2|isActuallyLevitate|LEVITATE14|
|3|isStunned|STUN4|
|4|isFrozen|FROZEN13|
|5|isPalsying|PALSY16|
|6|blocker存在，或TryGetCombatTargetBlockee成功|COMBAT3|
|7|_SearchAttackTarget成功|ATTACK2|
|8|isFeared|FearController及_MoveInFearArea|
|9|isAttracted|AttractController及_MoveInAttractArea|
|10|普通路线|虚槽237 `_MoveByRoute`76487|

后三条运动调用都通过 out bool 更新 `Blackboard.isHanging`。束缚 UNMOVABLE 没有专用状态切换：仍可能在 MOVE 中发起路线方向/运动请求，由 controller.canMove 阻止实际自主位移。因此“束缚一定离开MOVE”不成立。

**N** Attack.OnTick76662 不调用普通路线移动；检查 actuallyLevitate/stun/freeze/palsy，否则在 attackAbilityCasted 仍 casting 时留在ATTACK，结束后切MOVE1。Combat.OnTick76699 同样先检查控制状态，随后协调 combat ability、目标和 escapeTime，不执行普通路线移动。Attack.OnExit76663/Combat.OnExit76700 有 Ability 中断；不能因此把资格false统一解释成停止所有Ability。

**N** Stun.OnTick76703 在 levitate 优先后，若仍stunned则停留；否则依次freeze/palsy，再转DEFAULT0。Freeze.OnTick76721 同样检查levitate/stun/仍freeze/palsy，否则DEFAULT0。CheckSwitchOut76704/76723分别要求已不再stunned/frozen。控制结束并非这里直接消费一份新移动预算。

**N** `isActuallyGroundBound`66492 与 `isActuallyLevitate`66493 同时存在时按 `m_groundBoundPresentSeq+0xa0`、`m_levitatePresentSeq+0xa8` 的较晚序列决定实际生效者；不是简单把两者OR。GROUND_BOUND45与UNMOVABLE13也不是同一枚flag，不应使用中文“束缚”混称。

## 2. 停止自主移动不等于清除控制器记忆

**N** 已完整读取的普通 `MoveState.OnExit`76657 跳空基类 stub；`MoveState.OnEnter`76656 只操作 hanging/动画（含 born 后 idle 特例），都没有 MoveController.Reset/set_velocity，也没有直接访问 controller/lastVelocity。

**N** Stun.OnEnter76702 只播放/暂停 animator；Freeze.OnEnter76720 保存/暂停 animator、发事件、加 attribute modifier；Levitate.OnEnter76732 ReleaseBlock、加 modifier、动画/事件/buff通知。Attack/Combat 的 enter/exit 做 Ability 与动画/状态业务，没有直接 reset/set controller velocity。内容回调、modifier/event副作用及子类入口未穷尽。

**N** MoveController.OnTick71063 (`0x1808b68e0`, size0xa0) 仅调用 `_ConveyorMove`71064；Enemy.OnTick76531 后段固定有这一入口，但它不是把保存的lastVelocity继续积分的普通自主运动tick。

**N** MoveController.Reset71054 (`0x1808b6980`) 明确把 `m_lastVelocity+0x38`、`m_lastObstacleAvoidForce+0x40`、`m_lastSeparationForce+0x48` 写Vector2.zero，并重置两个ticker。set_velocity71049 直接写+0x38。明确的reset与普通状态暂停应区分。

**I** 限定上述普通进入/退出链、没有其他内容写入：暂停期间未调用CalculateMoveDelta时，lastVelocity可保留；恢复时可能继续作为运动控制的历史输入。不能宣称每次stun/block/attack都自动将lastVelocity清零，也不能宣称所有特殊控制都保留。root另有71056早退与PredictReached snap跳过controller的直接证据。

## 3. Skill 不具有统一的停止移动语义

**N** TriggerEnemySkill76425普通分支：已在Attack且family匹配则经AttackWrapper直接Cast；已在Combat且family匹配则经CombatWrapper.CastWithAssignedSkill；另一条允许切ATTACK2的分支先AssignAbility再切state。前两条是否停留本状态由原本状态决定，后一条会离开MOVE。

**N** EnemySkill.CastToTarget66305本身扣SP并进入Ability.CastToTarget，没有通用MoveState/MoveController停机调用；_OnCastStart66318只通知effect集合。普通MoveState76658也没有“宿主任意Ability正在casting就禁止移动”的扫描。

**I** 常规经Attack/Combat状态的技能会在这些状态占用自主路线运动，但“任意Skill casting都停移动”没有统一原生依据。具体Ability/节点可以改变状态/属性/位置，应按实际内容判断。没有本轮实机案例能证明任意技能同时移动的全部表现；这是范围限制，不应反向写成统一停止规则。

## 4. Tick次序

**N** 本轮复核当前索引：Enemy.OnTick76531→Unit.OnTick77699→Entity.OnTick66697。Entity.OnTick先StateMachine.Tick33274 (`0x1806faea6`)，再BuffContainer.Tick65356 (`0x1806faec7`)，随后存活分支的HP/EP恢复、SP/EP控制、Ability tick（跳过首次casting帧）。因此MoveState内普通位移先于这一Entity.Buff.Tick。

返回Enemy.OnTick后依次height、阻挡相关更新、正常DirectionCursor.OnTick70287、终点业务、fear/attract cursor tick、MoveController.OnTick71063 (`0x180a729e9`)、_UpdateCurrentTile76500、周期位置更新/距离累计、启用EnemySkill.Tick66312。这里只报告所读普通同步链，不定义项目必须复制的固定阶段。

**N** EnemyStateMachine.OnTick76640调用StateMachine.OnTick33282之后，在BattleController.isDeterministic为true时TruncateCurrentPos77884。该位置量化也不等于controller.velocity清零。

## 5. moveSpeed下限、属性公式与单位

**N** `Entity.get_moveSpeed`66467 (`0x180707aa0`, size0x150)：

```text
float(FP(Attributes.GetValue(MOVE_SPEED=6)) * FP(BattleOptions.MOVE_MULTIPLIER))
```

getter自身没有0.1 clamp，也没有canMove检查。MoveController.get_moveSpeed71047对普通Entity目标转此getter。

**N** 真正0.1来自 `Torappu.AttributesData.moveSpeed` field23206 token`0x04005aa7`的AttributeMetaAttribute ctor30777(attribute,min)：metadata attributesDataOffset42773828，rangeIndex8754，start147447/end147466，绝对42921275，原blob`013978000002000055c0014e540c0ccdcccc3d`；解码`MOVE_SPEED6,min0.1f`，未指定max。0.1f二进制是`cdcccc3d`，float32值0.10000000149011612。

**N** Attributes.Reset64268从get_fieldMetas30786取AttributeMeta，调用GetRangeAsTVector230781，写`m_dataRange+0x60`，并将初始raw字段转换FP后clamp到此range。Attributes.GetValue64276在dirty时进入_CalculateAttributeValue64295，先汇总modifier，再将最终结果clamp到有效range，缓存。64295公式结构：

```text
((raw + sum(flat)) * max(0, 1 + sum(additiveRatio)) + sum(postFlat))
    * product(finalScale)
→ clamp(value, effectiveMin, effectiveMax)
```

此式只说明数值合并顺序，不把任意buff描述硬映射成某类。关键事实是计算后才再次clamp。

**N** Attributes.OverrideDataRange64270允许每attribute覆盖range（`m_overrideDataRange+0x70`）；64295/GetMinValue64296/GetMaxValue64297检查nullableoverride存在就用它，否则用m_dataRange。因此0.1是默认MOVE_SPEED属性范围，不能声称所有内容绝不可低于它。override要与最终MOVE_MULTIPLIER区分。

**N** FP(float)220498做float32乘2^32并截断为int64（常量0x187101c84）；0.1f转raw429496736。AsFloat220505做乘2^-32（常量0x187101c50）。此默认floor转回float仍为0.10000000149011612。

**N** BattleOptions..cctor62950从0x186e3fda4读取0.5f初始化MOVE_MULTIPLIER（指令0x1805daa19）。GridPosition.get_asLocalPosition28039直接返回(float col,float row)，无0.5缩放；FromVectorPosition28047直接round两个坐标，也无缩放。因此0.5是实际地图坐标速度因子，不是tile尺寸转换。普通默认总速度floor约0.05格/s（在仍允许移动且确实请求位移时），不是0.1格/s的硬最终下限。

**I/仓库核对** root已核实真实关卡加载经movement-fragment.ts/ movement-scenario.ts读取level.options.moveMultiplier并在runtime乘入；新adapter中的`minimumMoveSpeedPerTick=perSecondToPerTick(0.1)`不能单独视作遗漏0.5。应保留“属性默认下限在全局倍率之前”的事实，不把整个项目的最终速度认定为2倍错。

**N/跨agent补充** 当前相关真实level adapter要求options.steeringEnabled=true；BattleOptions.LoadOptions62946会按关卡options覆盖MOVE_MULTIPLIER与STEERING_ENABLED（collision agent保存对应证据），BattleOptions静态构造false不是实际关卡最终配置。此点避免把静态初值误写成此内容采用的实际分支，与速度floor是独立事项。

## 6. moving、hanging、速度、实际位移是不同观察值

**N** Enemy.get_isMovingBySelf76359 (`0x180a7e3a0`, size0xd0)结果：

```text
!BObject.isDisappeared(+0x26)
&& stateMachine.currentStateId(+0x48)==MOVE1
&& !Enemy.States.Blackboard.isHanging(+0x10)
```

它直接读Blackboard.isHanging，**不调用**MoveState.get_isHanging76654、不读controller速度、不比较位置。

**N** MoveState.get_isHanging76654结果`blackboard.isHanging || owner.isActuallyGroundBound`。因此`isMovingBySelf`与`!MoveState.isHanging`甚至不是完全相反的两个同义getter。Blackboard11351还保存`isStruggling+0x11`；UpdateMoveAnimation76659在getter hanging且非struggling时播Idle，否则PlayMoveAnim76444。set_isHanging76655只有存值发生变化时更新动画。MoveState.OnEnter76656还保留born后的idle配置业务。动画不能直接证明本Tick实际位移或测出的速度。

**N** 内容条件节点也明确分开：

- IfEnemyIsMovingBySelf.Execute99314调用Enemy虚槽158，即上述state/blackboard条件。
- IfEnemyIsMoving.Execute99311调用虚槽222 Enemy.get_velocity76382，后者读Rigidbody2D.get_velocity318544。节点要求`|velocity| > 0.1f`（严格大于，常量0x186e3ff14），不是当前与上一Tick位置比较。
- MoveController.velocity71048读`m_lastVelocity+0x38`，是另一份状态。
- Enemy.OnTick76531周期比较`mapPosition`与`m_posInLastFrame+0x410`，将距离累加`m_totalMoveDist+0x348`；get_totalMoveDist76319及AssignEnemyMoveDistIntoBlackboard95826读取它。它是周期采样累计距离，不是通用瞬时moving布尔。

**I** 技能/强制位移观察时，不能用一个字段替代上述全部事实；但本研究不要求项目复制四套公开API。应由具体观察者说明所需的是自主移动状态、物理速度、运动记忆还是实际位置变化。

## 7. 仍未知

U：全部技能与特殊子类的移动政策、Lua运行时覆盖、event/modifier/buff回调对位置或controller的任意写入、物理引擎写入Rigidbody速度的全部时点、所有状态切换边界的现场表现。本证据不覆盖舟艇/生息演算，也不把canMove=false解释成“世界坐标绝不变化”。
