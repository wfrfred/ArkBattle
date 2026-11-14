# Vitality、Elemental、Damage、Healing 原生机制覆盖

核对日期：2026-11-14。本页是这四个领域的需求与证据入口。目标是先掌握原生资源模型、计算／接收／提交、生命干预和后继，再整体评估架构；**现有实现、已列 TODO 或测试通过均不构成原生需求完整的证明**。

原生结论、真实内容使用、项目选择和证据边界分别记录。未实现不等于获准简化；未找到引用不等于废弃。本轮只调查和修正文档，没有修改 Core 或为未决机制设计占位 API。

## 1. 调查输入与方法

主体为本机 Windows IL2CPP 客户端：DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。资源、固定镜像 JSON、PRTS 各有自己的版本，不能混称同一发布。旧证据只在指纹、调用身份及配置适用性相符时复用。

从 Entity／Unit／Character／Enemy、Modifier、BattleFormula、HP／ES／EP setter、EPController、实际派生覆盖的方法／字段清单出发，追生产者、复制传播、消费者、归零／结束和实际 Content 绑定。不是只复查普通伤害 Hook，也不由原生类数目反推项目类型。

| 证据批次 | 本轮范围与产物 |
| --- | --- |
| [Damage分类、权限与接收](../evidence/resource-mechanisms-20261114/damage/README.md) | Modifier字段／枚举与完整helper调用者、公式和接收体；9054个Holder模板；实际干员、技能、敌人组件；动态攻击分类完整资源字段扫描 |
| [HP与生命](../evidence/resource-mechanisms-20261114/life/README.md) | HP／ES／债务、免死竞争、派生提交、替身、普通／主动复活与战术点恢复；charpack／enemy／token共517包政策扫描，实际非默认绑定 |
| [回复与元素](../evidence/resource-mechanisms-20261114/recovery-elemental/README.md) | 普通与特殊回复、五类EP、爆发配置／恢复／缩时、自然回复、溢出ES、满血通知；1180包／33411个相关组件，零解码失败 |
| [归属与属性](../evidence/resource-mechanisms-20261114/death-attributes/README.md) | Context来源栈写入者／恢复、最终结束与两种击杀通知、属性范围声明及覆写、MaxHP同步setter；实际锡人、嵯峨、阿米娅、信仰搅拌机 |

这里的“实际使用”指固定资料选择与安装资源中可追溯的引用链，**不是本轮运行游戏观测**。所有 native 结论都保留 XLua／版本边界；字节完整解码也不等于已验证活跃热更新。扫描零失败只对注明的输入范围负责。

## 2. 原生语义与实际使用对照

### 计算、分类与接收

| 机制 | 实际使用或区分样例 | 证据与结论 |
| --- | --- | --- |
| 物理、法术、真实、元素HP公式 | 普通攻击、阿米娅／妮芙输出、标准元素爆发 | [10](10-weak-damage-and-critical.md)、[27](27-attack-additions-and-damage-events.md)、[38](38-damage-classification-and-permissions.md)：数学类型与EP类型分开，防御／穿透采样及基础保底先于后续修正 |
| 弱点双分支、暴击与随机倍率 | 已绑定的WeakDamage／AtkScaleUp内容 | [10](10-weak-damage-and-critical.md)：原生无事件比较与最终事件路径分开；项目完整双Calculate另列选择 |
| NORMAL／SPLASH／BUFF／ADDITION | 奥达动态主／扩散、锡人S1 Buff输出、仇白附加伤害 | [38](38-damage-classification-and-permissions.md)：不是普攻／技能分类，实际节点及Filter均已核对 |
| MELEE／RANGED／ALL／NONE | 响石S2、仇白天赋、反伤 | [38](38-damage-classification-and-permissions.md)：施加途径与Unit运动层、动画分开 |
| 来源存在、当前ATK、缓存输入、无来源输入 | 锡人S1、实际弹道、仇白附加伤害 | [18](18-projectile-source-and-target-lifecycles.md)、[38](38-damage-classification-and-permissions.md)：保留来源不保证派发来源公式事件；缓存ATK不等于全部来源快照 |
| 共同Modifier与HP／EP专属事件 | 妮芙S1、末药／桑葚普通治疗 | [27](27-attack-additions-and-damage-events.md)、[29](29-hp-and-ep-healing-settlement.md)：多笔输出各自结算，非整次攻击事务 |
| skip／流失仍算防御并进入HP setter | 实际物理落石、拟态机械射线、无人爆破艇 | [11 §6](11-damage-apply-and-hp-application.md#6-生命流失补核2026-11-13)：公式、普通接收事件和致命保护是不同参与条件 |
| 普通HIT回复许可 | 雷蛇、活性源石、华法琳S2流失 | [11 §7](11-damage-apply-and-hp-application.md#7-统一管线的实际内容对照2026-11-13)：ignoreForSp不等于跳过一切受伤程序 |
| 无敌／不可伤／睡眠权限 | 瑕光天赋、实际无敌单位及齐尔查克 | [38](38-damage-classification-and-permissions.md)：入口不可伤、取消权限及接收规则分别存在 |
| 忽略闪避、忽略取消原因 | 远牙天赋、骋风S2、焰尾闪避及成功后继 | [38](38-damage-classification-and-permissions.md)：两权限有实际生产／消费；当前native与Wiki的RNG描述冲突保留，见第4节 |
| 抵挡次数／额度与同步成功程序 | 泥岩盾、砾S2屏障 | [38](38-damage-classification-and-permissions.md)：先检查取消权限，再执行该节点资源处理；屏障不等于ES |
| 限损与禁止后继改数值 | 煌半血保护 | [11](11-damage-apply-and-hp-application.md)、[38](38-damage-classification-and-permissions.md)：flag16由value setter执行，不能概括成“后继Hook随时可改值” |
| 受击治疗、反伤与分担 | 乌尔比安、玛恩纳、浊心斯卡蒂S1 | [11](11-damage-apply-and-hp-application.md)、[38](38-damage-classification-and-permissions.md)：外层写HP前同步嵌套；反伤允许观察取消、分担有独立接收路径 |
| 环境HP／EP输出 | 活性源石、齐尔查克光环 | [11](11-damage-apply-and-hp-application.md)、[38](38-damage-classification-and-permissions.md)：环境HP与环境EP是不同标记，不能凭无来源推导 |

### HP、生命干预与结束

| 机制 | 实际使用 | 证据与结论 |
| --- | --- | --- |
| 普通HP、ES及负生命债务 | 休谟斯／医生；斩业星熊 | [11](11-damage-apply-and-hp-application.md)、[29](29-hp-and-ep-healing-settlement.md)：独立存储、消耗与偿还顺序；damage值不等于HP差 |
| 每击固定损失HP | 小说／诗画卷轴；酒神迷狂牢笼 | [11](11-damage-apply-and-hp-application.md)：派生提交保留原value，另写realDelta；普通nonlethal分支不能自动覆盖派生提交 |
| 非致命、不死与普通免死 | 嵯峨、史尔特尔、号角、斯卡蒂Y、信仰搅拌机S2 | [11](11-damage-apply-and-hp-application.md)：拟写HP限制、动态下限、consumer竞争和成功后继分别存在 |
| 替身／模式切换 | 贝娜、若叶睦、结城理 | [11](11-damage-apply-and-hp-application.md)：若叶睦是mortis而非makoto；程序不同、保留白名单、未完整离场 |
| 普通复活与轮次配置 | 霜星、屠谕者、酣睡飞行员 | [11](11-damage-apply-and-hp-application.md)：CheckReborn→假死→RebornState→DoReborn；次数、波次、模式、恢复和Buff继承分别读取 |
| 主动复活 | 实际duskls道具模式 | [11](11-damage-apply-and-hp-application.md)：不由HP0检查取得，主动入口选择数据后进入同实例复活 |
| 战术点召唤物恢复 | 豆苗磐蟹 | [11](11-damage-apply-and-hp-application.md)：切模式／计时Buff／RecoverHpLikeReborn，与普通复活计数器不同 |
| 强制设零、直接死亡／撤退 | 嵯峨处决、阿米娅S3结束 | [39](39-death-attribution-and-attribute-ranges.md)：force、skipReborn、reason及归属独立，模板suicide实际调用Withdraw |
| 伤害来源与击杀来源 | 锡人S1无来源伤害、嵯峨cripple、阿米娅击杀回SP | [39](39-death-attribution-and-attribute-ranges.md)：Context栈来源与Modifier两种source分开；来源Event9与目标Event29条件不同 |
| 最终死亡和物理回收 | Character／Enemy FinishMe；AutoChess Dummy路径 | [39](39-death-attribution-and-attribute-ranges.md)：OnFinish先于GameMode.DestroyEntity，不能与替身／复活合并 |
| 动态属性范围及MaxHP后继 | 信仰搅拌机X模组；负生命setter组合 | [39](39-death-attribution-and-attribute-ranges.md)：范围覆写不同于加算；MaxHP变化会走普通HP setter，组合推导有明确限制 |

### 治疗与元素

| 机制 | 实际使用 | 证据与结论 |
| --- | --- | --- |
| 普通HP治疗／禁疗／force | 末药、桑葚、休谟斯Trait | [29](29-hp-and-ep-healing-settlement.md)：CalculateHeal、不受DEF／RES、普通OnTakeHeal检查；选择豁免和最终接收分开 |
| HP／EP同次命中独立输出 | 桑葚普通攻击 | [29](29-hp-and-ep-healing-settlement.md)：Trait附件先EP、后HP，EP基数不取实际HP增量；0.5参数已补原始Trait记录 |
| 零输出、负值及零实际变化 | 普通构造器／setter完整分支；满血正治疗推导 | [29](29-hp-and-ep-healing-settlement.md)：没有实际负治疗Content正例，不将人为负输入当玩法需求；原生最终提交裁零与项目Calculate裁零分开 |
| 自然HP／EP回复 | 5-8宿主士兵；余天赋2 | [29](29-hp-and-ep-healing-settlement.md)、[25](25-elemental-burst-recovery-timing.md)：属性timer每脉冲+1，变速时保留过去时间；不是普通Heal |
| 生命复原 | 号角恢复效果 | [29](29-hp-and-ep-healing-settlement.md)：skip Modifier仍有部分回调；与自然属性回复不同 |
| 溢出治疗转ES／屏障 | 休谟斯、医生 | [29](29-hp-and-ep-healing-settlement.md)：shared许可、ES上限、event47与临时listener；不能无条件以received−hpGain当溢出 |
| 满血通知 | 缇缇S3 doze_indoze | [29](29-hp-and-ep-healing-settlement.md)：真实消费者已闭合；未证明重复满血no-op脉冲有额外结果，不擅改已定近似 |
| 缺血复制与持续HP同步 | dsdivi／卫戍acstma、喷口／装置 | [29](29-hp-and-ep-healing-settlement.md)：CopyHealth和SetHpSameToSource不同算法、方向及输入，不能按命名合并 |
| 五类EP与两套标准爆发分支 | 神经／侵蚀／灼燃／凋亡／狂躁；实际etouch攻击 | [25](25-elemental-burst-recovery-timing.md)：五型均有真实配置；接收者按Character且ALLY等条件分流，不等同阵营二分 |
| EP公式、属性范围及领袖MaxEP | 实际攻击／爆发与Enemy getter | [25](25-elemental-burst-recovery-timing.md)：两种抗性分开；5%保底在公式；领袖额外EP在getter追加 |
| EP免疫／接收护盾 | sggem、纯烬艾雅法拉S2 | [25](25-elemental-burst-recovery-timing.md)：EPFreeAll、force及BlockElementDamage池的不同职责 |
| EP0同步爆发、恢复及子效果 | 五型break表→根／子模板 | [25](25-elemental-burst-recovery-timing.md)：实际EP逐步回填，控制器时钟不等于所有子Buff时钟，开始与结束可同步嵌套 |
| 动态恢复速度／直接缩时 | 酒神S3；珊比天赋2 | [25](25-elemental-burst-recovery-timing.md)：速度每次读取；缩短total保留elapsed并当场重写EP，两者不同 |
| 零时长爆发参数 | 当前五型标准表均正数；零参数代码路径 | [25](25-elemental-burst-recovery-timing.md)：有真实零参数处理，无正式0秒标准配置正例；独立子产物不自动全部消失 |

上述表覆盖原生资源、输入分类、公式、资格、接收、提交、后继、修改入口及生命周期交接。具体数值、配置Pointer、对象PPtr与分支地址在对应案例／原件，不在概览重复整份反汇编。

## 3. 已确认的项目选择

以下选择来自既有用户确认，研究不以“更像原生”为由撤销。它们只覆盖所写差异，不能扩大为其他机制的简化授权。

| 项目选择 | 与原生的边界 |
| --- | --- |
| 四个独立HP／EP Damage／Healing接口，Calculate→Apply | 输出计算完成后才开始接收；不逐事件复刻原生交替顺序，不引入联合Request／Context |
| 弱点双分支完整Calculate，选一支Apply | 原生有无事件试算；项目不因此让目标响应两次接收 |
| Calculate最终非负、零计算输出拒绝；零实际变化允许成功 | 原生Modifier负数和最终delta处理时点不同；不把后者重新移入项目Commit |
| Receiving取消后继续，取消及原因不恢复 | 每项仍判断自身资格，已发生的独立业务不回滚 |
| healFree仅影响Targeting | 原生普通OnTakeHeal另检查；项目不自动新增这项治疗接收禁用 |
| 自然HP／EP按当前速度逐Tick加小数 | 不复刻每+1脉冲、已积累timer或三帧刷新；不派发普通Healing Hook |
| 目标Applied→来源Applied→最新资格确认死亡→Completed／Outcome.killed | 不把原生Context来源通知机械映射为新Kill Hook；特殊生命归属尚须完整设计 |
| Burst由Effect承载，恢复时钟rate=0手动推进；onInstall一次性业务 | 是项目组织方式，不意味着恢复控制器和各独立子效果原生共享一个时钟 |
| UI Event只输出表现所需瞬时事实 | Outcome／Application、当前State、同步Hook各司其职，不为复刻Modifier全部事件增加日志 |

## 4. 没有被当作废弃或批准简化的项目

| 项目 | 已知证据与保留边界 |
| --- | --- |
| `DAMAGE_WITHOUT_MODIFY`特定消费者 | 有生产配置与Holder消费者；在明确517资源范围未闭合该消费者绑定。它与真正value写保护flag16不同；未宣布废弃 |
| 两种忽略闪避的RNG描述 | 实际权限来源与消费已证；完整当前fallback两者均在RNG后的Cancel检查，PRTS说法不同。需要当前有效XLua／运行证据才能宣称线上差别闭合；未选择合并权限 |
| `SwitchToRebornState._isForce` | 实际true／false配置都存在；当前完整native未读取该字段。只记录版本内不消费，不推出热更或其他版本废弃 |
| `ElementHealViaMaxHpRatio` | 方法完整体已读；1180包和9054Holder未发现引用。普通EP自然回复另有余的真实正例，不能因该节点无命中而删掉自然回复 |
| `TakeDamageMoveBackEnemy` | 派生方法已读；当前517包生命政策池无实例。不把一个类型无绑定推成可忽略所有特殊提交 |
| 弱点候选的atkAddition／固定类型marker | 当前指纹弱点三参构造器仍将附加值置零，与Wiki理论比较不符；实际陈弱点和山概率链已闭合，marker生产者在517资源无命中。分别保留热更冲突与无绑定范围，不宣布废弃 |
| `INSTANT_KILL_LIKE_DAMAGE` | 有构造入口／过滤消费者；它不是InstantKill操作。UI标记或未闭合候选不单独证明一项通用强制死亡机制 |
| 标准爆发初始0时长 | 五型正式表均正，所查无0秒正例；给定0时的真实代码行为仍记录，不以非默认无配置判为任意行为 |
| 动画驱动复活HP插值 | native回调确实写实际HP，不得当纯表现删去。项目坚持逻辑Core不依赖动画，如何保留业务须显式设计，尚未批准瞬间恢复替代 |

这些是可审阅的证据边界，没有被包装成“以后再说，所以本领域完成”。能通过进一步静态输入闭合的继续追；涉及活跃热更新／运行观测的如实保留，不能伪造证据。任何新增不实现或简化须单独提供实际影响并由用户确认。

既有明确排除为生息演算、保全派驻、船运寻路。`HealSplitToUnionFindMembers`和`AverageHealViaHpUseAbilitySelector`的当前命中另保留具体模板及来源，不仅按名字断言全客户端只有这些模式。SP、部署费用、全局生命点及胜负的Modifier标记也列入原生清单，但其资源业务归对应领域，不能强塞进HP／EP接口。

## 5. 对下一次架构审查的约束

当前普通四条管线已实现，不代表上述原生需求已全部实现。至少生命资源／干预、分类与权限、同实例复活／模式交接、独立击杀归属、范围覆写、第五类EP及爆发缩时必须一起纳入差距评估，不能再逐个当作孤立Content扩展。

先按本页与原件确认需要保留的事实、输入和时点，再组织领域接口；不从22个标志倒推22个API，也不从当前Request缺字段反推需求不成立。既有项目选择继续有效；新增差异必须明确提交用户决定。实现后的测试只验证文档必要语义，测试夹具不能替代原生依据。
