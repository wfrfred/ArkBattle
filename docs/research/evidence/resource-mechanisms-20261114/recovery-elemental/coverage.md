# 覆盖与剩余证据边界

这张表描述本次研究覆盖，不把现有Core实现或旧文档的“待实现”当作排除理由。通用权限／生命结束与本批其他专项合并后才能评价整个领域。

| 语义 | 当前结论级别 | 依据／实际使用 |
| --- | --- | --- |
| 元素种类、根效果映射、两类时长 | N+D闭合 | 当前枚举、完整五项BreakData；Touch实际ANGer普通攻击与关卡；角色+ALLY分类原体。 |
| 各型独立EP、普通／领袖MaxEP | N闭合，配置正例已选 | Entity数组1～5、Enemy当前属性+levelType bonus；五型表、Touch／结晶及角色配置。 |
| EP抗性与HP元素抗性、公式下限 | N闭合 | 两项属性31／32、5%公式常量；当前字段范围由root属性专项合并，不能以公式保底代替查询上限。 |
| 当前ATK／显式ATK／固定值／HP伤害派生／AOE EP来源 | N+D闭合普通节点 | 全节点字段与正文；Touch普通攻击、酒神固定EP、Holder逐模板locator；非计算分支不以名字推断。 |
| 普通EP接收、无敌、force／skip／环境flag | 与damage专项合并 | 自身OnTakeEPDamage完整体、结晶被动异常21、齐尔查克环境免疫完整绑定。 |
| EP量护盾 | N+D闭合 | BlockElementDamage99225、艾雅法拉S2实际skill Prefab／模板。 |
| 爆发同步启动、真实EP恢复、创建Tick | N+D闭合 | 控制器全部19体、原始时长表；普通速度正数、酒神S3动态修正。没有统一创建Tick跳过。 |
| 直接缩时、立即重算EP、提前结束 | N+D闭合 | 珊比实际Talent2→ReduceEpBreakCooldownDuration；旧elapsed保留、新total重算比例。 |
| 零时长 | N条件路径闭合，D无零值标准正例 | 当前五项表均正数；给定0时仍开始／结束，子产物按自己的时长与依赖。不宣称原生已有0秒标准内容。 |
| 爆发效果与独立控制生命周期 | N+D闭合普通表／模板 | 神经眩晕／麻痹、侵蚀独立减防、灼燃派生减抗、凋亡周期与衰减、狂躁动作计数；结束不能抹除既有独立业务。 |
| EP自然回复 | N+D闭合 | 余非零天赋、人数checker、当前MaxHP采样→属性29→timer；另有恐鱼铃／globalbuff／触手locator。 |
| HP普通治疗公式、输出与通用事件 | N+D闭合，复用Case29 | CalculateHeal两重载、末药RangedHeal实际绑定、主ApplyModifier通用前后置。 |
| 行医HP／EP组合、满HP仍EP | N+D闭合 | 桑葚Trait附件先EP后HP、.5黑板；两笔求值提交独立。 |
| HP／EP普通回复禁疗差异 | N+D闭合，项目另有选择 | HP OnTakeHeal检查HEAL_FREE；EP不复用HP接收；休谟斯Trait显式force；项目healFree仅Targeting不被研究覆盖。 |
| 初始0、正量实际0、负数 | N条件分支闭合，项目政策已确认 | Modifier入口取消与finalDelta截零分开；满HP正Heal可成功；没有找到实际负数普通治疗Content，不能推HP／EP错误策略不同。 |
| HP溢出、ES、屏障转换、来源相等 | N+D闭合来源，资源提交与life合并 | 休谟斯／医生、flag0x400、临时监听、Entity同一性比较、ES事件47；ES／负生命详细顺序以life原体为准。 |
| 生命复原与自然HP回复 | N+D闭合，项目近似单列 | 号角skip治疗、原生自然回复timer、缇缇满血通知；已有逐Tick小数回复选择不因消费者存在自动失效。 |
| CopyHealth与HP差量同步 | N+D资源图闭合 | 幻影创建链缺失HP伤害；喷口→目标装置Aura→.03秒同步MaxHP/HP。两种实现不能当作同一个公共操作。 |
| Atk转自然回复／巨型Boss治疗 | N+D闭合节点／配置 | 万顷S2；岁相产物trap_056_sfsuifire→HealCurrentGiantBoss。Boss生命策略由life合并。 |

仍不能无条件下结论的内容：

| 定位 | 已查范围 | 缺什么／为什么保留 |
| --- | --- | --- |
| `ElementHealViaMaxHpRatio` | 完整99914；全部9054模板、1180个固定资源Bundle中的33411个相关组件，无引用 | 未证明运行时程序构造／XLua无调用。属于可评估候选，不自动弃用；余自然EP是另一路真实需求。 |
| `AverageHealViaHpUseAbilitySelector` | 全Holder仅`legion_trap_cdrone_heal`；完整native | 模式表／实际Prefab选择未闭合，仅凭legion前缀不能宣告排除。 |
| `HealSplitToUnionFindMembers` | 全Holder仅`sandbox_v3_relic[paddy-share-heal]`／`sandbox_v3_xb2fmr2`；完整native | 同上，需实际模式绑定。不能把候选当全游戏无普通使用的证明。 |
| `OnBeforeTrySetEpZero` | 当前setter和通知包装、全Holder唯一统计模板 | event46消费者是LogExtraBattleInfo；本批未证明存在改变EP或取消爆发的消费者，不据此增新Hook。 |
| 缇缇满血重复no-op | 实际S3安装／结束／周期检查已闭合 | 没有“已满血仍合法保留且须靠下一次no-op通知结束”的可达轨迹。只证明满血通知有用，未推翻当前回复近似。 |
| 喷口Enemy的玩法创建 | 原始敌人配置、载具关卡EnemyDB声明、完整实际Prefab及同步目标 | 未把EnemyDB存在冒充Wave实际执行；特殊创建由载具玩法接入，不能依据排除船运导航就排除HP同步本身。 |

任何新增简化、某字段不用或排除具体需求的决定，都需依据这里的范围向用户说明并取得同意。
