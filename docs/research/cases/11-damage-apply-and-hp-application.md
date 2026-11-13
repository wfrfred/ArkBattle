# Damage Apply 与 HP Application 机制时序对照

整理日期：2026-10-17。本文将客户端证据、PRTS 说明与 ArkBattle 的设计选择分开记录，不实现接口。当前普通 Calculate／Apply、HP 资源提交与死亡顺序见 [Vitality / Damage 设计](../../architecture/vitality.md)；特殊生命干预协议仍延期。本页保留各次原生核对的证据边界。

## 1. 证据分层与边界

| 标记 | 依据 | 可证明的范围 |
| --- | --- | --- |
| N | [damage-apply-20261017.json](../evidence/damage-apply-20261017/records.json) 与补充的 [hp-application-combinations-20261017.json](../evidence/hp-application-combinations-20261017/records.json) 中的本机原生方法与匹配 Buff 模板 | 所选普通原生分支的调用、判断及模板动作顺序；没有运行游戏或验证 XLua 热更新。 |
| W | 下文直接链接的 PRTS 机制或角色说明 | Wiki 所述的行为与时点；本轮未核对相应角色模板／原生分支的项目不标为 N。 |
| P | 用户已确认的 [Vitality 设计](../../architecture/vitality.md)、[公共 Hook 契约](../../architecture/functional-core.md#6-hook-和生命周期的纯契约)与[离场契约](../../architecture/deployment.md#离场清理的偏序) | ArkBattle 选择的语义；不作为客户端事实。 |
| 未定 | 尚缺足以判断的证据或尚未选择项目政策 | 不由当前测试、方法名或其他效果的类似描述补足。 |

N 的输入版本与哈希保存在证据文件中；所选 DLL SHA256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`。本轮沿用该证据，不宣称完成所有生命机制或运行版本兼容验证。旧案例 03 的项目 Resources／Work 与祖先候选继承描述已被后续架构替代，不能反向覆盖 P。

## 2. 接收与伤判

| 机制 | 客户端静态确认（N） | PRTS 说明（W） | ArkBattle 政策／待定 | 可观测区分 |
| --- | --- | --- | --- | --- |
| 初始零伤害 | get_isCancelled 包含零值判定；普通 ApplyModifier 在接收前拒绝已取消输入。 | 本表不据其他零伤害描述扩展此路径。 | Calculate 最终零输出在 Apply 入口拒绝，不进入本笔接收；零实际变化允许成功，与后来抵挡或取消分别处理。 | 是否回复 SP、触发受击响应。 |
| 无敌 | OnTakeDamage 普通分支在 SP 检查前请求取消，随后存在 Buff 接收派发；不能由此概括全部无敌／忽略无敌路径。 | [特殊机制](https://prts.wiki/w/特殊机制)描述无敌及特殊绕过条件。 | 不将无敌直接等同于所有接收通知都未发生；具体参与资格与例外尚待核对。 | SP、计数、反伤是否发生。 |
| 普通受击回复 SP | OnTakeDamage 先检查当前取消与 ignoreForSp，再尝试回复，随后调用 BuffContainer.OnTakeDamage。 | 不能把所有“受击回复”天赋都当作这一普通 SP 路径。 | 放入接收开始的职责；Skill 通过公开 Hook 接入，Vitality 不依赖 Skill。 | 正伤害后来被盾挡掉，仍可能已完成普通回复。 |
| 有序伤判与取消 | Cancel 保留数值并单独标记取消；Evade／BlockDamage 检查取消状态，InverseDamage 可不筛除已取消伤害。 | [伤判效果](https://prts.wiki/w/伤判效果)说明优先级、获得顺序与各效果自己的伤判条件。 | 取消不停止整次 Receiving；排序由领域决定，资格逐项读取最新状态。 | 盾次数、反伤、计数，以及减伤与屏障组合结果。 |
| 成功闪避／抵挡 | Evade 仅在 Cancel(EVADE) 成功后同步调用 OnEvadeDamage；BlockDamage 有对应即时响应。 | [事件](https://prts.wiki/w/事件)将成功响应描述为插入处理。 | 在成功节点同步响应；尝试、成功与后续派发资格分别表达。 | 闪避成功后补弹等业务是否先于后续伤判。 |
| 泥岩盾与治疗 | mudrok_t_1[shield_a] 的事件 10 依次执行 BlockDamage、HealViaMaxHpRatio、表现与 FinishBuff。 | 不将这一模板扩展为所有护盾的固定治疗或消耗顺序。 | Receiving 允许同步治疗；外层取消保留已经完成的盾消耗与治疗。 | 不掉 HP 仍可消耗盾并治疗。 |
| 煌半血保护 | huang_t_1[lock] 在事件 10 执行 HpNoLessThanCertainPercentModifier；原生节点读取当前 HP／maxHP，必要时将本次伤害限制为 max(当前 HP − 指定比例 maxHP, 0)。 | [煌](https://prts.wiki/w/煌)说明半血保护通过伤判减少本次伤害实现。 | 这是 Receiving 的限损机制，不直接定义所有 HP 写入的下限；尚未选定特殊组合的简化政策。 | 后继伤判仍可改变伤害；不能把限损实现为额外治疗。 |
| 受击时先治疗 | 本轮未核对乌尔比安／三角初华的角色模板。 | [乌尔比安](https://prts.wiki/w/乌尔比安)与[三角初华](https://prts.wiki/w/初华)均说明相应治疗发生在正式应用伤害前；前者允许伤害被闪避／抵挡后触发。 | 此类治疗属于 Receiving，和生命变化已应用后的治疗分别表达。 | 同一伤害能否致死，治疗量使用哪个时点的 HP。 |
| 玛恩纳反伤 | mlynar_t_2[inverse] 在事件 10 执行 InverseDamage，filterModifierCancelled=false；原生动作同步调用独立 ApplyModifier。 | 不将该结论推广为所有反伤的时点。 | 允许外层扣 HP 前反伤；已取消的外层伤害不自动排除此 Hook。 | 外层未扣血也可反伤；嵌套返回影响后续状态。 |
| 斯卡蒂 S1 分担 | skadi2_s_1[protect] 先 DamageSplit，再缩放外层伤害；被分担部分走特殊接收路径。 | 此案是协议压力样例，不按当前棋子默认 S3 限缩领域要求。 | 保留同步分担能力；特殊接收输入如何表达未定，不直接暴露 SKIP 字段。 | 是否重复分担、嵌套生命变化与外层先后。 |

无视闪避的 Wiki 描述与已读普通原生路径存在范围差别，详见 N 的 limits；不由名称直接决定是否抽样或消耗资源。项目无须复制无语义影响的官方 RNG 消费轨迹，但概率、次数与成功响应仍须有明确规则。

## 3. 生命应用与致命干预

| 机制 | 客户端静态确认（N） | PRTS 说明（W） | ArkBattle 政策／待定 | 可观测区分 |
| --- | --- | --- | --- | --- |
| 每次只减少 1 HP | 本轮未完整核对小说卷轴的具体模板与 setter 组合。 | [特殊机制](https://prts.wiki/w/特殊机制)区分原伤害量与实际只降低 1 HP。 | HP Application 必须允许伤害数值与生命变化不同；工作值与报告未定。 | 受伤次数与按伤害量计算的其他效果。 |
| 非致命与提前致命预判 | 当前 metadata 的 DAMAGE_IS_UNDEADABLE_THIS_TIME=8；普通 DoApplyModifier 在该标记下先将拟写 HP 限制为至少 1，再调用 set_hp，早于 setter 中的归零前回调。 | [衍生生命](https://prts.wiki/w/衍生生命)区分提前预判、非致命限制与归零前干预；其斯卡蒂示例存在下述当前模板冲突。 | 不由一次 candidateHp 推导所有致命机制的资格；具体组合另核对。 | 较早预判与实际尝试归零不是同一事件；非致命输入不会因此触发普通归零免死。 |
| 不死与归零前干预 | SetHpInternal 中先存在归零前回调，后有不死处理；仅确认所选普通原生分支。 | [衍生生命](https://prts.wiki/w/衍生生命)给出相应顺序；部分保护会自行检查不死。 | 不写成所有机制共用的“不死优先于免死”，也不由该原生顺序规定项目必须复制同一调用结构。 | 是否消费保护、是否切形态与最终生命状态。 |
| 多个普通免死 | ConsumeTrySetHpZeroModifier 自身拒绝已取消的归零请求，可配置已有不死时拒绝取得成功。Container 记录首个 consumer 后继续遍历；后续普通 Consume 自行失败。Post 的 IsConsumer 只允许成功者执行自己的后续。 | [特殊机制](https://prts.wiki/w/特殊机制)描述按优先级竞争、单次最多一个成功及成功后的后续。 | 普通免死的竞争只作用于该类业务；不自动包括不死、替身等。具体工作值未定。 | 一次伤害消费几个保护，谁执行后续；成功不等于停止整个派发。 |
| 若叶睦与普通傀儡师 | 当前 makoto_tr 在归零前事件使用 _dontConsumeWhenUndeadable=false；surtr_t_2、skadi_e_muso 等模板为 true。 | [若叶睦](https://prts.wiki/w/睦)说明通常傀儡师与她在持有不死时的切换资格不同。 | 一项保护成立不能全局屏蔽其他致命干预；不将某个客户端节点或标记直接升级为项目统一竞争协议。 | 持有不死仍切替身、形态与持续状态。 |
| HP 写入与成功通知 | DoApplyModifier 读取当时 HP；普通 SetHpInternal 先写 HP，再携带获胜 consumer 派发 Post，模板自行确认是否为成功者；普通 OnAppliedModifier 先通知目标，再通知来源 OnAfterOutputDamage。 | 不据“成功受到伤害后”文字推断所有死亡响应都已完成或都未开始。 | 当前项目在目标／来源 Applied 后按最新 HP 确认死亡；特殊 HP 应用接管与普通免死成功归属的接口仍延期。此项目顺序不冒充原生顺序。 | 回调治疗是否有效，能观察到哪些 HP／生命事实。 |
| 真实离场 | 本轮未穷尽原生死亡、复活与对象回收路径。 | 不从角色“被击倒”文案直接推导真实离场。 | 沿 P 的 LEAVING → 完整领域清理 → Unit 移除 → onLeave；生命保护成功不等于真实离场。 | 死亡触发、Effect 清理、依赖结束与旧实例是否还在。 |
| 生命流失 | 2026-11-13 已补齐物理／法术／真实配置与公式、skip 接收、普通 HP setter；见第 6 节。 | [游戏数据基础](https://prts.wiki/w/游戏数据基础#伤害机制)说明物法流失仍受 DEF／RES；[衍生生命](https://prts.wiki/w/衍生生命)区分相关致命干预。 | 原生 skip 不等于跳过一切保护；项目以统一 Calculate／Apply、nature 与机制资格表达流失，HIT 许可独立，见当前 Vitality 契约。 | 防御公式、计算事件、护盾／SP 与致命保护是不同参与条件。 |

2026-11-13 PRTS 复核：[游戏数据基础·伤害机制](https://prts.wiki/w/游戏数据基础#伤害机制)将生命流失说明为携带 SKIP_MODIFIER_EVENT 的伤害，默认类型为真实；物理流失仍受防御力影响，法术流失仍受法术抗性影响。数学公式与事件参与是两个维度，不能由跳过事件推导出跳过防御计算，也不能把所有生命流失直接等同于已确定数额的 HP 负增量。第 6 节已新增客户端公式分支与实际配置绑定；特殊生命机制的全部组合仍不在本轮已证范围。

## 4. HP Application 设计须回答的问题

当前已确认的是下列事实须可分别表达，不是某个字段、统一竞争组或状态机已获确认：

1. 哪项 HP 变化仍待默认路径应用；其他机制何时已经接管或完成这一责任。
2. 某次普通免死是否已有成功者；它的成功、后续与消耗不等同于所有生命干预停止。
3. 当前真实 HP、形态与生命状态是什么；通过最新 BattleState 查询，不由前两项反推。

后续 Hook 可在默认应用被接管后继续观察或干预；普通免死已有成功者也不自动排除替身等其他机制。致命预判事实与“现在是否仍会归零”还需区分；哪部分属于固定 Context、哪部分接续为 current，留待机制组合验证。

需要用以下区分轨迹审查工作值，再定类型：

| 区分轨迹 | 必须避免的错误 |
| --- | --- |
| 受击治疗结束后继续应用原伤害 | 以旧 HP 覆盖治疗，或把治疗当成整次伤害已处理。 |
| 生命保护已接管本次应用，后续 Hook 仍观察该决定 | 自动停止全体 Hook，或再次默认扣血。 |
| 多个普通免死，同时还有不死／替身机制 | 把所有干预塞进一个 protected 布尔值，导致额外消耗或漏掉形态转换。 |
| 回调嵌套终结宿主，然后返回外层 | 根据旧对象继续写 HP、治疗或重复离场。 |

表中的轨迹是项目设计验收要求，不冒充已观测到的具体客户端完整执行记录。示意数值与最终项目类型均未在此确定；具有可观测差异的简化须单独列为项目政策后再使用。

## 5. 生命限损、前置治疗与免死的组合核对

本节核对普通 HP 路径，不将结论推广到负生命值、额外生命值和特殊派生单位。数字均是区分语义的假设，不是官方参数；组合结果按已证实单项规则推导，未进行游戏内组合实测。项目尚未在这些组合上另选简化政策。

| 组合 | 执行与结果 | 证据边界 |
| --- | --- | --- |
| 单次最多扣 30 HP ＋ 不死 | 当前 HP 100、原伤害 150，限损后扣 30 得到 70；当前 HP 20 时，同样的限损仍可导致归零尝试，最终不死保留 1。 | 纯数值上限示例；实际限制若在 Receiving 发生，之后仍可能有其他伤判，不把此上限当作最后写入下限。 |
| 非致命伤害 ＋ 不死 | 当前 HP 100、伤害 150，普通 DoApplyModifier 先把拟写 HP 限制为 1，setter 不需要对本次写入派发归零前免死。已有不死不因此消耗普通免死。 | N 已确认标记、限制公式与 setter 调用顺序；不排除更早有独立致命预判效果。 |
| 每击只减 1 HP ＋ 不死 | 当前 HP 2，单次 HP 变化为 −1 后剩 1；再次扣 1 的归零尝试受不死限制，仍为 1。原伤害事实不因只扣 1 改成 1。 | 单项规则的组合推导，未验证小说卷轴实际获得不死的场景。 |
| 前置治疗足够 ＋ 普通免死 | 当前 HP 100、伤害 150；Receiving 实际治疗 100 后，HP 200；DoApplyModifier 读取该 HP，扣 150 得 50，没有普通归零免死的成功与消耗。 | W 确认相关治疗在伤害应用前；N 确认后续 DoApplyModifier 读取当时 HP。组合为时序推导。 |
| 前置治疗不足 ＋ 普通免死 | 同例只实际治疗 20，则 HP 120，本次伤害仍导致归零尝试；成功者按自己的保护方式处理该次变化，再执行自己的后续。不能一概指定最终 HP。 | 实际治疗量可能受禁疗、上限、目标重定向影响；免死成功后的恢复不再重复应用原伤害。 |
| 已有不死 ＋ 普通免死 | 当前模板中配置 _dontConsumeWhenUndeadable=true 的普通 Consume 节点，读取到已有不死后不取得本次成功；setter 之后以不死下限处理。 | N 的资格检查先于最终不死下限；不是“不死已经终止所有致命回调”。若叶睦模板显式采用不同资格。 |

普通免死本身也存在不同的应用政策。Consume 节点配置 _blockThisHpSet=true 时，保留给 setter 的本次 delta 为 0；false 时保留原变化，并在取消归零后至少保留 1。之后携带 consumer 派发 Post，模板确认自己成功后执行后续。当前 skadi_e_muso 采用 false，Post 安装恢复／属性效果并结束旧免死 Buff；这与先在 Receiving 治疗、再继续承受原伤害是两种不同顺序。项目需要保留这些可观测差异，不要求照搬客户端字段或统一全部致命干预。

“前置治疗足够便不消耗免死”的推导限定于治疗发生在普通 DoApplyModifier 读取当前 HP 之前。如果治疗直接发生在 OnBeforeTrySetHpZero 回调中，当前普通 setter 并未承诺每个回调后都重算：未取消归零请求时沿用先前拟写值；取消后才读取当前 HP 并接续所保留的 delta。单纯治疗不能被视为已经改变这次待应用的生命变化。此项是静态控制流结论，尚未定位一个只治疗、不处理归零请求的真实内容组合；不据此给 ArkBattle 选择覆盖治疗的政策。

### 当前模板与旧 Wiki 案例的冲突

[衍生生命](https://prts.wiki/w/衍生生命)把斯卡蒂 Y 模组举为 OnTakeDamage 提前致命预判的例子，但当前匹配模板 skadi_e_muso 在优先级 −3000 的事件 27 取得归零干预，事件 82 确认成功者并执行恢复／结束。本机普通 setter 也在 HP 提交后派发事件 82。本轮以这份静态证据描述当前模板，不继续用旧例证明“斯卡蒂复活甲会在非致命限制之前消耗”。其他真正的提前预判机制仍需分别定位，不能由这个旧例替代证据。

## 6. 生命流失补核（2026-11-13）

本轮补齐物理、法术、真实流失的配置与客户端应用链。证据为 [hp-loss-settlement-20261113](../evidence/hp-loss-settlement-20261113/README.md)：客户端 DLL `cf7956bf…`、metadata `e58fb854…`，关卡镜像固定为 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。这是配置绑定与普通原生分支的静态核对，没有运行游戏，也没有验证 XLua 是否替换这些方法。镜像与安装资源各自记录版本，不宣称二者来自同一次发布。

### 6.1 实际配置与模板存在必须分开

| 类型 | 实际配置链 | 本轮确认 |
| --- | --- | --- |
| 物理流失 | `act26side_tr02` 预置 `trap_118_rockfl`，黑板指定 `enemy_1343_ltrock`；同关卡实际 SPAWN `enemy_3005_lpeopl`。落石 Prefab 的 `Talents/HitLpeopl` 具有启用的 Talent、Aura 及受选验证器；Aura 登记 `ltrock_hit[lpeopl]`，验证器要求 `mark_neutral[lpeopl]`，居民 Prefab 的 `NeutralTag` 实际提供此标记。 | 模板事件 0 执行 `FixedValueDamage(PHYSICAL, skip=true)`，读取 `hit_value`；不是将普通物理伤害误叫流失。这里核对到关卡配置、Prefab 和动作节点绑定，未把关卡运行中的具体碰撞当作实测。 |
| 法术流失 | `main_15-18` 实际 SPAWN `enemy_1565_mpprme`。其 Enemy 根组件的 `_modes` 引用 `FlyMode_Ray_P2`，该 Mode 的 `_generalAbilities` 引用名为 `Ray` 的能力。该 Mode 的 `FlyRay` 天赋登记 `enemy_mpprme_fly_ray`，其事件 32 同步触发 `Ray`；`Ray._activeBuffs` 登记 `enemy_mpprme_ray_damage`。 | 模板事件 2 执行 `AdvancedApplyDamage(MAGICAL, skip=true)`，比例键为 `ray_atk_scale`。这是已配置的实际模式／能力链；不声称本轮模拟了第 15 章模式切换机制。 |
| 真实流失 | `act12side_09` 实际 SPAWN 无人爆破艇。`enemy_1164_bmbmot/Talents/Bleed` 登记 `bmbmot_bleed`，实际使用模板 `periodic_damage_by_hp_ratio[skip_modifier_fix]`。 | 模板使用 `DamageViaMaxHpRatio(PURE, skip=true, _getMaxHpFromTarget=false)`；每次触发按来源最大 HP 比例形成一笔数额，触发周期由 Buff 配置另决定。 |

完整模板 Holder 共 9054 项，其中发现 196 个 `skip=true` 节点：8 个 PHYSICAL、6 个 MAGICAL，其余含 PURE 及非伤害节点。这个计数只描述当前 Holder，不证明每个模板均被实际内容使用。例如旧 `enemy_bmbmot_t` 虽含物理 skip 节点，当前无人爆破艇却绑定上表的 PURE 模板，因此不能拿旧模板当作该敌人的物理流失证据。归档仅保留选中的 13 个组件与 5 个模板；其余检索为紧凑索引。

### 6.2 防御公式与计算事件先于 skip 标记

选中节点的顺序为：

```text
读取固定数值、ATK 或最大 HP 比例
→ BattleUtil.CalculateDamageBy…
    → BattleFormula.CalculateDamage
        → 按参数决定来源／目标计算事件
        → CalculateDamageNoEvent → CalculateDamageInternal
        → 按参数决定来源计算后事件
    → NewDamageModifierAfterCalculate
→ 设置 SKIP_MODIFIER_EVENT
→ target.ApplyModifier
```

`CalculateDamageInternal`（65900，`0x180685790`）按 DamageType 分支：物理在 `0x180685b3a` 读取目标 `def`，法术在 `0x1806859ed` 读取 `magicResistance`；真实分支不使用这两项防御属性。`CalculateDamageNoEvent` 还根据来源及类型取得穿透参数。`FixedValueDamage` 在 `0x181102198/19f/1ca` 完成计算与 Modifier 构造，之后才在 `0x181102257` 设置 skip；`AdvancedApplyDamage` 同样在完成计算后设置标志。**跳过应用事件不等于跳过防御公式，也不等于跳过计算事件。**

计算事件还必须按具体分支判断：

- 落石配置 `_triggerOnCalculateDamage=false`，走 `CalculateDamageByAtkWithSourceNoOnCalDmg`：传给 `CalculateDamage` 的目标计算事件开关为 true、来源为 false。该名称中的 NoOnCalDmg 不能解释为目标计算事件也被关闭。
- 拟态机械射线采用非缓存、保留来源的普通 `AdvancedApplyDamage` 分支，`0x1810f5794` 调用 `CalculateDamageBySource`。该入口的正式计算开启来源与目标计算事件，另算无来源基准；不能由模板 `_emitSourceOnCalculateDamage=false` 推导这个分支不派发来源计算事件，该字段在其他构造分支才决定相应选择。
- 无人爆破艇的所选 `DamageViaMaxHpRatio` 在来源存在且 `_noSourceDamage=false` 时调用 `CalculateDamageByAtkWithSourceNoOnCalDmg`（`0x1811007bd`），否则调用 `CalculateDamageByAtkNoSource`（`0x181100823`）。两支的目标计算事件均开启、来源均关闭。节点不读取触发间隔，不能按旧 Bleeding 模板的每秒速率解释。

因此，不能用“生命流失”这个名称推出统一的计算 Hook 清单；伤害数值的来源、公式类型、计算事件参数与应用事件政策是不同事实。

### 6.3 skip 的精确接收与通知范围

`Entity.ApplyModifier`（67665，`0x1807211a0`）的普通分支如下：

```text
目标 alive；输入尚未取消（原生也将零值视为取消）
→ 检查 SKIP_MODIFIER_EVENT
    → 若还具有 SKIP_MODIFIER_CONSIDER_UNHURTABLE，检查消失／不可受伤并可取消
    → 目标 BuffContainer.OnApplyingSkippedModifier（事件 41）
→ 再检查取消
→ 来源存在时执行 BeforeTargetApplyModifier（事件 61）
→ GameMode.OnEntityApplyModifier 资格
→ 虚派发 DoApplyModifier
→ skip 路径不执行普通 OnAppliedModifier
```

关键位置：skip／额外不可受伤标志分别在 `0x1807212c8`／`0x180721353` 检查；目标 skip 接收入口为 `0x18072140e`，其 `Buff.OnApplyingSkippedModifier` 明确运行事件 41；取消复核为 `0x1807218da`；来源提交前程序为 `0x180721984`；实际资源派发为 `0x180721b08`；提交后的 `0x180721b2e` 再次检查 skip，绕过 `OnAppliedModifier`。

这条路径绕过目标普通应用前事件 5、来源输出事件 8、普通 `_OnApplyingModifier / OnTakeDamage`，也绕过普通应用后及来源伤害后通知。因此，普通受击 SP、在普通 OnTakeDamage 上登记的闪避／护盾／减伤／反伤不会仅因这笔流失自动参与；但事件 41 能修改／取消本笔 Modifier，来源事件 61 也仍可执行。不能把它概括成“无接收程序”或“无同步回调”。

消失与无敌沿用[案例 18](18-projectile-source-and-target-lifecycles.md)已核实的区分：普通 skip 不进入常规不可受伤伤判；同时设置 `0x8000` 时仍进行该检查。`IsUnhurtableWithModifier` 又有自己的免疫与 `0x100` 旁路条件，而消失并不等价于可用同一标志穿过的无敌。节点的 `_considerUnhurtable`、Modifier 的其他标志及内容自己的事件 41 必须分别看待。

### 6.4 HP 提交、致命干预与直接 setter

skip 不改变 HP 目标仍进入 `Entity.DoApplyModifier`（67683）的事实。普通 HP 分支读取提交时当前 HP／ES，取得 `finalDelta`，按已有 ES 规则处理，再在 `0x18072340f` 调用普通 `set_hp`。它没有因为 skip 改走 `SetHpDirectly`。

| 机制 | 所在阶段与边界 |
| --- | --- |
| 本次非致命标志 | `DAMAGE_IS_UNDEADABLE_THIS_TIME=8` 在 DoApplyModifier 中将拟写 HP 限制为至少 1，然后才进入 setter；不会因此产生一次实际归零请求。它与 skip 是不同标志。 |
| 普通归零前干预 | `set_hp` 虚派发 `SetHpInternal`（67625）。拟写值到零且存在容器时仍构造 `TrySetHpZero`，执行 `OnBeforeTrySetHpZero`；skip 没有在此取消这些调用。 |
| 不死下限 | 普通 setter 在归零前干预之后处理 `isUndeadable`，再限制最终 HP。不能把流失写成绕过不死，也不能把不死写成阻止全部前置生命程序。 |
| 生命归零与死亡 | HP 写入后仍可能同步调用 `OnHpZero → FinishMe / OnFinish`；skip 只绕过之后的普通 Modifier 应用后通知，不抑制该死亡链。普通内容的完整离场／回收时序仍按案例 27 的证据范围，不推广到全部重生或 GameMode。 |
| 提前致命预判、特殊 HP 改写 | 是否参与取决于具体程序登记在普通接收、事件 41、来源提交前还是 setter 上，不能仅凭 Wiki 的“生命流失”分类判定。本轮没有完成“每击只减 1 HP”等所有派生 DoApplyModifier 的特殊组合，也不将其冒称已闭合。 |
| 直接 setter | `SetHpDirectly`／`SetHpInternalDirectly` 的所选普通分支跳过 Modifier 与 `OnBeforeTrySetHpZero`，但仍有 alive、不死下限和 HP 范围限制；写入值不大于零时仅将数值截为 0，不派发普通满值通知或 OnHpZero 死亡业务。它们既不等于普通生命流失，也不等于无条件写一个字段。 |

`SetHpInternal` 的当前关键位置为：构造归零请求 `0x18072eb83`，归零前派发 `0x18072ed51/7e`，不死检查 `0x18072ef21/efbc`，HP 写入 `0x18072f02b`，归零处理 `0x18072f297`，存在成功 consumer 且宿主仍 unfinished 时执行 Post `0x18072f2c9`。负生命等扩展分支在同一方法内，但本轮不借此声称穷尽其所有内容组合。

相邻核对：`OnFinish`（67653）在 `0x18072a16e` 读取 BattleContext，`0x18072a189..19d` 取其栈顶来源，并于 `0x18072a407` 调该来源的 `OnTargetKilled`。这里没有直接读取 Modifier 的 source／originalSource。本轮未追该栈全部入栈入口，所以不能进一步断言击杀归属总与其中某个字段相同。

### 6.5 对项目选择的约束范围

上述证据回答原生语义，不另定 ArkBattle API。已确认的项目 Calculate／Apply 划分、普通两侧 Applied 后再按最新 HP 确认死亡，以及同步重入规则保持不变。未来表达生命流失时需要分别保存公式与事件政策；不能以直接 HP 减法代替所有物理／法术流失，也不能机械复刻原生所有事件编号。特殊 HP 改写与提前致命预判的具体内容组合仍按各自证据决定，不以本次研究替换已定普通伤害时序。

## 7. 统一管线的实际内容对照（2026-11-13）

普通损伤与流失都使用现有 Calculate／Apply 和 Hook 集合，请求携带 `DAMAGE / LOSS` 业务性质，各机制通过 Rule／Hook 资格决定响应。本节记录支持该设计的内容对照；2026-11-14 已接入 nature 与独立 hitRecovery 许可，现行接口以 [Vitality 契约](../../architecture/vitality.md#12-请求与计算参数)为准，不按原生事件开关数量设计接口。

证据与复跑入口集中在 [hp-loss-hook-interactions-20261113](../evidence/hp-loss-hook-interactions-20261113/README.md)。N 表示实际配置绑定与普通原生调用链；W 表示社区资料；组合结果没有冒充本轮游戏内实测。

| 实际内容 | 原生结果与证据 | 对统一模型的判断 |
| --- | --- | --- |
| 华法琳 S2 与乌尔比安 | N：S2 实际配置使用 PURE skip 模板；乌尔比安各模式的受伤回血天赋绑定 `ulpia_t_2`，程序只在普通 OnTakeDamage 事件 10 执行。该流失绕过事件 10，因此不会触发回血。 | 将这项回血限定普通伤害即可保留结果，不需要另一套 Receiving。 |
| 华法琳 S2 与雷蛇 | N：雷蛇天赋的实际脚本为 `TriggerWhenTakenDamageAbility`，订阅 Entity 事件 12，还检查取消及 `ignoreForSp`。LOSS 不进入普通 OnTakeDamage，也不派发该事件。它不是原生 Applied 监听。 | `LOSS` 不触发这项回 SP；具体程序按接收语义接入，不因文案含“受伤后”就机械迁到 Applied。 |
| “睚”的分身退场与铃兰脆弱 | W：当前敌人正文明确，不消失时承受 35% 最大生命的普通真实伤害，消失时改为 35% 流失。2023-01-25 的 WB-EX-8 实战讨论解释铃兰 40% 脆弱下前者为 49%，后者仍为 35%。 | 真伤类型不够区分；`DAMAGE / LOSS` 加上脆弱的响应资格可表达。35%／49%为当前规则及历史社区反馈，不是本次客户端实测。 |
| 拟态机械射线与庇护 | N：第 6 节已闭合射线的法术 skip 分支与 RES 公式。W：淬羽赫默能提供庇护；普通庇护不降低流失。这是可共存内容的规则组合推导。 | 保留法抗计算，庇护的普通伤判不响应 LOSS；无需因忽略庇护就跳过整个 Calculate。 |
| 活性源石与乌尔比安／雷蛇 | N：真实地块绑定 `periodic_damage → NoSourceDamage(PURE, ignoreForSp=true)`，未设置 skip。普通接收只跳过 HIT 回 SP，仍派发事件 10，乌尔比安回血程序没有 `ignoreForSp` 门控；雷蛇自身检查该标记而不回 SP。 | 同属 DAMAGE 也存在不同响应资格。`nature` 不能替代 HIT／受击回复资格；这是与 LOSS 正交的既有需求，不是增加阶段开关的理由。 |

来源 Formula 另做了定向排查：9054 个模板中定位到 205 项来源计算事件 14 配置，再检查阿、华法琳、史尔特尔、红隼及 Sharp 的相关入口；**未找到能够闭合到实际执行、证明统一 Calculate 必须增加来源／目标派发开关的反例**。阿的倍率配置与周期自损虽均已定位，但倍率的实际存续窗口未闭合，不能声称自损会由 1% 变为 1.5%。排除条件与检索边界见证据中的 `source/README.md`。

这些实例支持统一管线与机制资格的设计方向。当前接口区分普通伤害／流失，并保留独立的普通 HIT 回复许可；“未找到来源计算反例”不是所有内容全局等价的证明。普通死亡顺序继续按既定项目选择，本节不重开其时序。
