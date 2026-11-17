# Skill 触发、持续与特定控制豁免

2026-11-17。复用 Case05／08／09 与已有原件，只补会影响技能公开表达能力的实际配置。未改源码、测试或架构；不重新决定 Presence 或 Lifetime 协议。

## 新确认的实际输入

[result.json](result.json) 从当前官方技能 Bundle 精确提取四个根对象，记录外部 MonoScript、同 GameObject 的 Skill／Ability 组件表、对象及源文件指纹。角色／技能表使用另行固定的镜像，不声称与安装客户端同一发布。

| 实际输入 | 原表及当前组件 | 意义 |
| --- | --- | --- |
| 泥岩 S2 `skchr_mudrok_2` | AUTO，duration=0；CastSkill `-8621369842960336780` 与 AnimatedActionToOwnerAbility `3130726341302253684` 同对象。 | 原表零时长不能推出没有行动过程。具体能力按自身释放／结束推进，见 [Case08](../../../cases/08-action-eligibility-and-interruption.md) 的实际根／RollAttack 链。 |
| 慕斯 S1 `skchr_frncat_1` | AUTO，duration=0，攻击回复；当前根是 NextAtkAdditionSkill `5747343086491030346`。 | 特殊强力击程序不等同部署时启动一次的 PASSIVE，也不能依据 PRTS 的“特殊被动”文字改写原表触发枚举。其支付与普通技能通知的区别已在 [Case09 §3](../../../cases/09-skill-mechanisms-and-requirements.md#3-触发持续与输出)记录。 |
| 止颂 S2 `skchr_lessng_2` | PASSIVE，SP类型NONE、费用0，持续15～24秒；AppearSkill `424415836659428721` 与 ActiveBuffAbility `3851692001934290289` 同对象。 | 真实部署触发被动可以有限持续；不能将所有 PASSIVE 固定解释为无限期。 |
| 止颂 S3 `skchr_lessng_3` | MANUAL，持续20秒；CastSkill `-5787243488378523559` 的 `_canUseInAbnormalState=1`，同对象 ActiveBuffAbility `8172940558262366297`；角色表明确选择该技能。 | 特定控制尚有效时可以发动技能，再由技能程序处理净化；不能把“先把控制从模拟状态删除，再调用普通发动”当成同一发动资格。 |

### 豁免范围不是全部异常

复用原体 `BasicSkill.get_ownerCanUseInAbnormalState` #73791（`0x18099a6e0`）：`_canUseInAbnormalState` 或宿主对应资格通过后，普通分支仍查询 `Entity.get_isSilenced` 并取反。该字段不是无视全部限制的 force。

[PRTS 止颂](https://prts.wiki/w/止颂)将 S3 的开启／净化描述为可抵抗状态，持续期另有晕眩、寒冷、冻结反制。自伤的采样条件是另一个集合，不能与发动豁免集合混用。社区核对记录在 [prts.json](prts.json)。本轮最小确定需求是晕眩中的 S3 发动；未据一个 true 字段穷举或扩大到沉默、恐惧、消失等全部限制，也未完整反编译 S3 的全部净化／自伤模板。

## 当前公开接口的表达验证

[probe.mjs](probe.mjs)使用真实 Data 解析得到的止颂 S3 参数，以公开构造、SP 修改和 `effects.install(stun)` 建立场景；不手写 readonly State，不把它冒充已接入的止颂 Content。实际输出与当时源／构建物指纹见 [probe-result.json](probe-result.json)。

- 合法补至40 SP 后，眩晕仍 ACTIVE；普通 `activate` 返回 null，余额保持40，声明允许的 `activation.accepts` 没有获得执行机会。
- 通过 Effect 完整结束移除眩晕后，同一技能请求可发动并支付至0。

当前 `stun` 登记的技能启动限制是无条件拒绝，`activate` 又先对登记项做 AND 检查；Content 的 accepts 只能增加限制，无法豁免该特定项。这证明需要表达**本次发动对指定控制限制的豁免**，不要求复制原生布尔字段，也不决定所有限制都可被忽略。

## 已有链足以支持、未另增 Core 缺口的部分

- 手动／自动／部署被动：触发、具体程序与持续方式分开，已有上述真实输入。零持续与有限被动不是新状态机；泥岩实际 Content 用行动结束决定 Activation 完成，普通 TIME=0 仍可表达真正瞬间程序。
- 取消与沉默：禁止下一次发动、打断当前 Ability、停止持续效果是独立语义。所选普通技能 `_canSilenced=0`、`_stopAffectOnInterrupt=0`；不能让通用沉默或动作中断无条件取消所有 Activation。既有依据见 [Case05](../../../cases/05-skill-start-and-finish.md)与[开始／消失原体](../../skill-start-presence-20261106/README.md)。
- Enemy 多招式：霜星同模式的两项技能各有计时／次数，读取和支付同一宿主 SP；普通开始／结束协议也不等同 Character Skill。已有 [EnemySkill 原体及正例](../../enemy-skill-semantics-20261110/README.md)足够支持一份 Skill 持久状态编排多个 Action；未找到必须改成多份独立 SP／Activation 聚合的真实观察者。
- 通知载荷：既有 Case09 §8 的装备／盟约正例消费开始／结束事实，保存自己的计数／首次标记；没有据它们证明外部必须取得任意技能私有 State。原生技能整体成功与子能力释放的差别另由[郁金香调用链](../../anger-family-20261117/empty/README.md)保留。
- 同实例复活：既有 [Case11](../../../cases/11-damage-apply-and-hp-application.md)确认假死、Buff 白名单、重生状态和模式接续，不是 Unit 完整离场。下节补核通用重生入口对技能／能力的实际调用；这些调用仍不能推出统一的“保留／重置全部技能”政策。

上述“可以表达”不等于具体角色已实现。Fever／暂停预算由同批另一支调查，不在这里重复展开。

## 重生入口的技能接续

复用 [Case11 的生命原体](../../resource-mechanisms-20261114/life/native.json)及[模式操作原体](../../resource-mechanisms-20261114/life/native-specializations.json)，没有重新提取客户端或扩查角色：

| 入口 | 已确认调用 | 对技能表达的意义 |
| --- | --- | --- |
| `Character.OnReborn` #77335、`Enemy.OnReborn` #77787 | 先虚调用 `DoFakeDeath`，再进入各自 RebornState。 | 假死进入有实际状态切换，不是只改 HP。 |
| `Character.DoFakeDeath` #77279、`Enemy.DoFakeDeath` #77798 | 分别清空阻挡对象／释放自身被阻挡关系，再调用 `Unit.DoFakeDeath`。后者清 Buff 白名单、清持有效果、更新颜色并通知 Buff `OnOwnerReborn`。 | 该通用入口没有直接重置 Skill SP；`Unit.DoFakeDeath` 的 slot102 虚调用是 `UpdateBodyColor`，不能误认作技能中断。 |
| `Character.DoReborn` #77280 | 调用 `Unit.DoReborn`，再 `StateMachine.Start`。 | 所查 Character 入口没有统一 Skill.Init 或 SP 清零。 |
| `Enemy.DoReborn` #77799 | 调用 `Unit.DoReborn`，再遍历技能列表调用 `EnemySkill.Init`（`0x180abad19`），之后重新启动状态机。 | Enemy 每招自己的触发次数与初始冷却会重置；不是创建独立 SP 账户。Init 的具体分配见[已有 EnemySkill 调查](../../enemy-skill-semantics-20261110/README.md)。 |
| `Unit.DoReborn` #79011 | 恢复普通 HP，调用 `SwitchMode`，随后处理恢复 Buff。 | 模式重绑可能改变所用能力与配置，不能依据本方法没有 SP setter 就推断所有模式接续保持相同配置。 |

Character 若从 SkillState 切出，既有 [开始／消失原体](../../skill-start-presence-20261106/native/native.json)中的 `SkillState.OnExit` #77512 调用 `InterruptStartIfNot`，再调用 `InterruptIfNot`；后者只在 `_stopAffectOnInterrupt` 为真时额外停止持续效果。因此动作中断不等于所有 Activation 无条件结束。

对应项目操作已经可以分别表达：用 Action `cancel`／`cancelForUnit` 中断执行；按具体技能政策 `finish`／`cancel` Activation；用 Skill `setState` 重置敌人各招的计时与次数；若具体程序确需改变 SP 余额，使用 `pay`／`modify`。模式切换所需的运行期 SP 配置属于同批已确认的配置能力缺口，不另增加“重生 Skill”容器或统一重置协议。本节只闭合这些通用入口的操作种类，没有验证每个角色的全部恢复 Buff、模式能力或 XLua 接续。

## 复跑与来源边界

```sh
python3 docs/research/evidence/skill-audit-20261117/lifecycle/extract.py \
  --out .cache/native-research/skill-audit-20261117/lifecycle/result.json
node docs/research/evidence/skill-audit-20261117/lifecycle/probe.mjs
```

安装源为 `[uc]skills.ab` 与其实际 MonoScript Bundle；对象解码复用归档 TypeTree 读取器。固定角色／技能镜像为 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，输入路径和字节指纹在 result。原生 getter 复用 `unit-audit-20261110/control-terrain/native.json`，其 DLL／metadata 指纹保留于新证据，未改写旧原件。仅查四个实际技能根，没有全游戏支持或活跃 XLua、实机执行保证；公开接口 probe 是项目表达验证，不能作为原生行为证据。
