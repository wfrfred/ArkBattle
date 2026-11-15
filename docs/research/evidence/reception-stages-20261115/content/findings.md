# 内容复核结论

## 已闭合的实际路径

| 内容与绑定 | 程序与实际作用 | 时序结论及证据强度 |
| - | - | - |
| 浮空信件 `enemy_10231_agpack`，`Talents/1` 的 `PassiveBuffAbility -4786395766426076502`，同对象 `Talent -4915418759506462038` | `agpack_t[record_damage_cnt]` event 5：排除已有无敌、检查 HP／EP 请求、我方存活来源、目标未消失及不同地块；强制增加自身 SP。到达满 SP 后安装 `agpack_t[born_invincible]`，插入消失／在来源处出现／等待路线，再清空 SP。敌人表为 maxSp=5、initSp=0、increment=0。 | `act53side_01` 等 23 关有真实 SPAWN。第五次符合条件的请求在目标后续准入前已经安装无敌。把这段程序移至准入后，会让该次准入先读取旧状态。配置与原生管线组合推导，非实机运行记录。 |
| 纯烬艾雅法拉 S2 `skchr_agoat2_2/Shield/Aura`，`AuraAbility -8250027821135118959`、`TargetValidator 2147056433657986449` | event 6 `agoat2_s_2` 的 `BlockElementDamage` 读取同 Aura 的 `agoat2_s_2[shield]` 公共额度并改写本次值；技能表明确是持续范围损伤屏障。实际 validator 的 purposeMask=0，未启用异常旗标包含／排除；反应 Buff 无异常旗标、无眩晕等状态停用，disableOverride=1。 | 原体 #99225 不检查 EPFreeAll，先扣池再改值；普通 EP 准入在 event 6 后。原生 EPController 恢复期添加旗标 21、不撤销外来 Aura，见本轮管线证据。因此可构造真实配置组合：普通存活干员进入侵蚀恢复期，再被 S2 范围屏障覆盖，下一笔正 EP 请求先消耗屏障额度，再受 EPFreeAll 拒绝；若全部吸收则后续先遇零值。此为配置与 fallback 原体组合推导，尚无实机记录。 |
| 菲莱 `char_4148_philae` 天赋 `PassiveBuffAbility -1069816149529665061` 与 S2 `ActiveBuffAbility 3388098405148834621` | `philae_t_1` event 6 处理元素损伤，按 DARK 类型回复 SP；`philae_s_2` event 6 遇元素损伤且无标记时安装攻击力 Buff。技能表明确“若技能期间受到元素损伤则攻击力提升至技能结束”。 | 证明接收前可以发生资源与属性状态变化，不能把所有 event 6 当成纯数值 Modifier。是否应与某一项目阶段等价，需要保持其实际接收政策；本目录不把“字段／模板存在”直接提升为新增 Hook 要求。 |
| 蒂比 S2 `skchr_tippi_2` 的 `ActiveBuffAbility 6599285509847769121`、`CastSkill -7083031897589489631` | 被动安装 `tippi_s_2[trigger]`，event 6 为 HP 伤害且当前 mode0 时 `TriggerAutoSkill`，随后物法 `Evade`；触发黑板 prob=1。主动安装 mode4 切换，结束转 mode6。技能表为时间回复，不是受击回复。 | 证明准入／HIT 前确有实际技能启动和模式切换程序。不能由此宣称 event 6 的 MISS 必然跳过 event 10：当前管线无这个统一早退。计时冲突另见下文。 |
| 齐尔查克 `char_4144_chilc/.../CommonAbilities/Ability0/ImmuneAura`，组件 `2240213445508825714` | `char_chilc[immune_env_dmg][include_element]` event 6 检查环境伤害 SharedFlag，取消 HP／EP 请求。 | 实际普通角色 Aura 绑定；可作为具体接收政策的来源，但单凭取消程序不能证明它必须保留独立的项目 Hook 阶段。 |

全部组件及原始字段见 `selected-content.json`，完整节点见 `selected-programs.json`；事件时点由 `../pipeline/native.json` 与相关原体证据核对，不从事件名称猜测。

## 全量程序的分类覆盖

| 节点族 | event 5／6／10 节点数 | 实际绑定代表及边界 |
| - | - | - |
| 条件与控制流 | 70／172／1193 | 全部程序保留完整条件，不能将有条件的取消或写入表述成每次触发。 |
| 改写当前数值、取消与权限 | 18／63／504 | S2 元素屏障、齐尔查克环境保护；伤害抵挡／闪避主要也见 event 10。 |
| 安装、结束或触发 Buff | 11／21／433 | 浮空信件 event 5 安装无敌；菲莱 event 6 安装攻击力；逐腐兽攻击所施加的 `enemy_nhstlk_t[bleeding]` 在 event 6 的 `IsHeal → FinishBuff` 清除持续伤害。逐腐兽组件有精确绑定，但本次没有闭合一个“禁疗仍施加该 Heal”的具体同场内容例，不据此断言额外阶段不可合并。 |
| 黑板、计数或属性写入 | 11／33／141 | 浮空信件记录地块；菲莱实际安装的属性模板；全量节点及指针可回溯。 |
| 资源写入 | 2／3／31 | 浮空信件强制 SP、菲莱 DARK 元素损伤回 SP；前者不是普通 HIT SP。 |
| 嵌套伤害、治疗或分摊 | 1／6／97 | `enemy_mpascl_mark` event 5、act54side 的 `weak_block_handler` event 6 有精确 Prefab 绑定。其玩法路径和具体条件未在本次逐项闭合，不按名字认定排除或启用。 |
| 技能、行动或模式 | 0／1／70 | 蒂比 S2 的 event 6 启动；event 10 大量 TriggerAbility／TriggerSkill，不能仅据节点名统一时点。 |
| 空间、出生、路线或生命周期 | 4／2／35 | 浮空信件路线插入已闭合；`enemy_wangz[summon_trap]` event 6 有精确 Prefab 绑定，但此次不进一步声称每次请求都会召唤。 |
| 表现或日志 | 4／9／139 | 原程序完整保存；不因此要求项目输出 Event。 |
| 玩法专用或未分类 | 0／0／33 | 保留节点原名和实际引用，不按未知节点补造公共语义。 |

这里的节点族由 `summarize.py` 按类型名称分类，只用于证明扫描没有漏掉某一语法族。节点消费者与实际执行条件仍以原体及内容绑定为准。20／59／650 个程序中，19／47／499 个找到了本次扫描资源族中的直接序列化引用；其余不是“未使用”的结论。

## 身份、版本与未闭合边界

- `enemy_wdsdw[loss_hp]` 的实际绑定是 `enemy_1323_wdbshd/Talents/lossHP`（解构畸变体），不是名字接近的 `enemy_1324_wdsdw`。event 5 只对敌方来源 EP 请求写 `INTERRUPT`；七个普通主线／BossRush 关卡有 enemyDbRefs，但未找到直接 SPAWN，本次未续追召唤入口。
- `immune_env_damage` 的实际 Buff key 是 `bldrgn_immune_env_damage`，绑定巨翼兽 `enemy_7010_bldrgn`。它有 sandbox SPAWN，也有 act1arkhub capture SPAWN；后者玩法归属本次未核定，不能把此模板简单归为仅排除模式。
- `enemy_wlrage_t_check` 在四个敌人 Prefab 有精确绑定；选取的 wlrage 只有 act1arkhub enemyDbRefs，尚不能当普通主线直接启用例。`sandbox*` 程序有明确排除模式边界；`legion*` 不凭前缀推断属于保全派驻。
- 小号手 `enemy_1372_ltntpt` 在 act29side 有 13 关真实 SPAWN，但本次选中切模式程序不是 event 5／6 接收前程序；敌人表为攻击回复 SP，不能将其误作普通受击 SP 转路例。
- `dminon_s_2[unevadeable]`、`enemy_hlslp[heal_add_sp]` 等没有直接引用不代表缺乏运行入口。选择提取器沿已选模板递归解析创建的 Buff；全局直接引用清单则明确不宣称已经完成全部动态创建路径。
- `loadFromDB` 按固定镜像 BuffDB 展开；原始引用和 DB 定义都保留，不能用 blank templateKey 或不同 buffKey 判定绑定失败。镜像版本独立于当前安装资源，缺项需继续检查，不能补默认定义。

## 蒂比计时的证据冲突

当前配置中的 `tippi_t` event 10 直接结束 timer／stack 后按 evade 标记决定是否重新触发，没有显式“本次已取消则跳过”过滤；同 Talent 配置未见技能索引／模式禁用选项。`tippi_t[evade]` 的 event 10 则有取消过滤，二者不能混淆。

PRTS 对 S2 的说明称它在伤判前闪避，第一天赋计时不被重置。当前 fallback 的 event 6 后无统一取消早退，与这份行为说明尚未完全对齐。可能涉及未闭合的模式有效性、动态回调链或客户端差异；本目录保留实际配置和版本，不将其中一方写成另一方已经证明的事实。该冲突不影响浮空信件及元素屏障的独立例子。
