# 待部署区、部署费用与卡牌供给

研究日期：2026-10-31；2026-11-01 补查部署附加、出生时序、库存恢复预算及负 DP，并以更新后的客户端复核相关短链；2026-11-11 补核 cardUid 的生成与普通重部署保留；2026-11-22 交叉复核普通退出顺序和费用汇总写回。本案核对部署费用的计算边界、待部署卡牌的顺序与状态、场下推进、部署资格、供给及场上实例之间的关系。只记录机制证据、限制和项目关联，不确定重构接口。

PRTS 检索以待部署区为入口，按费用与返还、左右与近邻选择、临时效果与共享消耗、当前／下次冷却、场下资源、点选与部署限制、补数与回收、宿主退场和模式差异系统展开，再沿干员、召唤物、敌人、装置及藏品链接交叉核对。按不同语义保留代表实例，不逐档复制数值，也不声称穷尽 PRTS 全站。前三节为费用客户端短链，第四节另列排序调查的范围与缺口，第十节为后续部署入场取证；其它机制表为对应日期查阅的社区资料。普通机制与卫戍协议、其它模式对照分别说明，不把调查覆盖视作项目接入承诺。

## 结论与证据强度

- **N：有效卡牌费用在 getter 中截断，使用独立的 `BattleOptions.MAX_COST_CEIL`。** 当前普通 native 分支先计算再部署倍率后的 `rawCost`，再计算 `floor(rawCost × rawCostScale) + costDelta`，最后限定到 `[0, MAX_COST_CEIL]`。不是等最终扣款时才限制，也没有在该公式中直接读取当前持有费用上限。
- **C：部署费用属性、实际扣款与本次是否允许返费是不同事实。** 免费投递后仍可返费的内容实例能区分三者，不能用“实付为 0”直接推导“本次费用属性为 0”或“不可返费”。
- **C：在场实例的费用与隐藏待部署卡牌的费用可以不同。** 前者通常保留部署时的值；后者即使对应干员已经在场，仍可接受部分卡组减费与排序效果。
- **C：供给至少存在部署时冷却、离场时冷却和离场后排队冷却三种机制。** 可用持有数、同时在场数、冷却队列与冷却起点不是同一个量。
- **N／I：中继器普通回收追加待恢复份数，保留已启动的一段。** Card 保存待恢复份数和一条当前计时器。一段到期后，剩余份数按届时 Card 已记录的后续周期逐份恢复。技能显式重置与当前剩余时间修正走独立路径。
- **N／C：负 DP 还改变自然回复推进。** 当前 DP 小于 0 时，自然回复计时推进量乘默认 0.5；每次推进重新看当前符号，回到 0 后恢复正常速度，保留已有进度。主动加费不因此减半。
- **C：待部署卡牌可接受效果并成为业务目标。** 左右顺序、相对位置、费用与职业都可参与选取；某些效果先在卡牌上登记，再于后续部署或退场时生效、消耗。普通初始排序与持续重排不是同一规则。
- **C：卡牌存在、显示、点选、部署资格与实际计时分别有不同机制。** 冷却归零仍可被锁定；封印未必禁止部署；真实冷却已经开始时，也可能临时按零冷却获得特殊部署资格。
- **C：场上实例与其供给来源并非统一的拥有关系。** 来源退场会移除部分召唤物，但幻影和医疗探机可继续存在；未使用卡牌如何保留、隐藏或删除不能仅由场上清理推导。
- **N／I：普通退场的 Card 回收和部署位归还分别结算。** 有资格的撤退先返 DP。普通撤退和 HP 归零死亡均在角色的 OnFinish 中回收 Card，并扣减有限 TokenCard 所计入的在场数。固定客户端的默认对象池路径在 Unit 的 OnRecycle 归还全局部署位，普通撤退即时回收，普通死亡传入默认 1 秒战斗时间的回收等待。实机复测确认死亡后延迟归还，报告未给出时长。见[普通退出结算](#普通撤退与死亡的结算顺序)。

N 表示客户端静态 native 分支的直接证据。I 表示将配置和调用链应用于具体场景的推导。C 表示 PRTS 社区资料。实机复测另列来源和范围。XLua 覆盖未核实。

## 一、费用计算与上限

### 普通 native 分支

本轮[费用短链证据](../evidence/deployment-native-20261031/README.md)限定以下方法：

| 方法 | 本轮定位 | 直接说明 |
| --- | --- | --- |
| `Deck.Card.get_rawCost` | metadata 65831，`0x1806c1f70`；正常分段自 `0x1806c2018` 继续 | 从费用快照或 raw-cost 覆写取得输入，计算有上限的再部署倍率，乘算后 `FloorToInt`。 |
| `Deck.Card.get_cost` | metadata 65833，`0x1806c0e60`；正常分段自 `0x1806c0eab` 继续 | 读取 `m_costDelta`、`m_rawCostScale`，取得 raw cost 后调用运行时费用公式。 |
| `BattleFormula.CalculateRuntimeCardCost` | metadata 64934，`0x1806586c0` | 先乘算、向下取整，再加 runtime delta，最后按 0 与 `MAX_COST_CEIL` 截断。 |

用方法输入表示，普通分支的顺序为：

```text
R = 快照费用，或被 raw-cost 覆写后的费用
rawCost = floor(R × min(再部署倍率上限, 1 + 计数 × 每层倍率))
cost = clamp(floor(rawCost × rawCostScale) + costDelta, 0, MAX_COST_CEIL)
```

这是两个方法的实际取整顺序；本轮没有沿费用快照的构造追查所有基础修正、符文预处理和内容特化，也不将上述内部输入直接解释为项目应提供的修正接口。

分阶段取整不能一般化地合并为末尾一次取整。例如说明用输入 `R = 3`、再部署倍率 `1.5`、`rawCostScale = 2`、`costDelta = 0`，按上述阶段得到 `floor(floor(3 × 1.5) × 2) = 8`，末尾一次取整则得到 `9`。这些数值只用于区分计算顺序，不代表本轮核实了对应内容组合。

关键指令位置：

- `get_rawCost` 的 `0x1806c224f` 取倍率最小值，`0x1806c225d` 乘算，`0x1806c227f` 向下取整。
- `get_cost` 的 `0x1806c0ebb`、`0x1806c0eea` 分别读取 `m_costDelta`（实例偏移 `0x1a0`）和 `m_rawCostScale`（`0x1a8`），`0x1806c0f18` 转入运行时费用公式。
- 公式的 `0x18065877f` 乘算，`0x1806587a1` 向下取整，`0x180658808` 加 delta；随后分别处理负值与超过上限的值。
- `0x1806587a6` 的类型引用解析为 `Torappu.Battle.BattleOptions`（type 9843），`0x1806587cb` 读取静态字段偏移 `0x44`，对应 `MAX_COST_CEIL`。同类型另有 `MAX_COST`（`0x30`）与 `SYNC_MAXCOST_CEIL_WITH_MAXCOST`（`0xc1`）。绑定原始编码、类型索引及字段记录保存在 `cap-field-binding.json`。

费用截断上限与账户上限具有独立身份。2026-11-22 补查 `BattleOptions..cctor`，两个上限默认 99，同步位默认为 true。关卡加载时，`LoadOptions` 在同步位为 true 时将 `MAX_COST` 复制到 `MAX_COST_CEIL`，为 false 时跳过复制并恢复同步位。普通 `LMaxCostSet.PreprocessLevelOptions` 从黑板读取 `max_cost` 与 `max_cost_ceil`，分别写入关卡 Options 与 `MAX_COST_CEIL`，随后将同步位设为 false。主线 12-13 的实际 `cbuff_max_cost` 给出 20 与 99，关中还有上限奖励的诺伯特平民。[配置与原生证据](../evidence/dp-cap-20261122/README.md)

HE-7「以爱相连」刷出的赏金猎人扰乱者通过已启用的 `PassiveBuffAbility` 施加 `bthtms_t_1[max_cost]`，以 10 为幅度对账户上限执行减与还。该普通运行期路径从 `ModifyMaxCost` 走到 `BattleCostManager.SetMaxCost`，读取关卡已设置的 `MAX_COST_CEIL` 后写入阵营账户。卡牌费用公式仍读取 `MAX_COST_CEIL`，因此这次账户上限变化没有同步改变卡牌费用截断。证据覆盖该样本的普通分支。[关卡、Prefab、Buff 模板与原生调用](../evidence/dp-cap-20261122/README.md) [同版本卡牌费用公式](../evidence/deployment-recovery-20261101/cost-version/runtime-cost.json)

### PRTS 对照

2026-10-31 查阅[部署费用·待部署区单位的部署费用](https://prts.wiki/w/部署费用#待部署区单位的部署费用)：社区公式区分初始费用、基础增减、再部署倍率与实时增减；普通再部署惩罚在撤退或被击倒后增加，最多两层，每层增加 0.5 倍率，特殊“移动”可不累积。该页面标注仍在编辑，并以客户端 2.7.71 为最近维护参考，具体例外应保留来源边界。

[数值范围](https://prts.wiki/w/数值范围)将 COST 的默认属性上限记为定点数上限，同时注明实际部署费用受关卡最大费用限制；[新人入门·部署费用](https://prts.wiki/w/新人入门#部署费用)列出通常 99 与特定关卡可超过百费的例子。这些社区说明与“实际费用另行截断”相容，但不能单独确定 `MAX_COST_CEIL` 与当前可变费用上限如何同步。

### 玩家当前 DP 的另一边界

[部署费用·负数当前费用](https://prts.wiki/w/部署费用#负数当前费用)与[可露希尔·天赋](https://prts.wiki/w/可露希尔#天赋)记录了费用下限低于零、按该下限继续支付，以及负数区间自然回复速度减半、与其它回复速度数值乘算的机制。这是玩家持有的 DP 资源及支付范围，不是 Card 的有效部署费用变为负数。

2026-11-01 对[新版客户端的补查](../evidence/deployment-recovery-20261101/README.md)进一步直接确认：`BattleCostManager.UpdateCost` 每次读取当前 DP，仅负值分支将本次 `fixedDeltaTime` 乘 `m_negativeRecoveryMultiplier` 后推进同一计时器，构造默认值为 0.5。回到 0 后下一次推进恢复正常速度，不因跨零清空既有进度；主动增加 DP 不经过该减半路径。同次调用内若结算多个点数，使用入口采样的符号，不在循环跨零时再次拆分。只降低账户下限、在进入负值时固定双倍周期，或把所有回复量统一减半，都不能准确描述这条原生行为。

本案不由此确定项目实现范围，也不以负 DP 规则代替 `MAX_COST_CEIL` 的独立身份或补定其动态同步规则。

### 2026-11-01 新客户端复核

本机 DLL／metadata 已更新，指纹与 2026-10-31 批次不同；现有工具仍支持其 v29 结构，本轮方法和字段全部重新定位。两个 floor 与独立 `MAX_COST_CEIL` 的结论仍成立，但新版倍率上限先计算 `max(1, 原倍率上限 + m_respawnCostMaxMultiplierOffset)`，再限制当前再部署倍率。具体指纹、定位与复现入口见[新版复核证据](../evidence/deployment-recovery-20261101/README.md)；其它旧案例未因本次局部复查自动获得新版适用性。

**N**　2026-11-22 交叉核对 Card 政策批次。`Card._UpdateCardBuff` 调用 `CardBuff.ApplyModifiersFirstPass`、`ApplyModifiersSecondPass` 和 `ApplyModifierFinalPass`，随后在 `0x1806f115a`、`0x1806f1172`、`0x1806f117e` 分别写入 `m_costDelta`、`m_rawCostScale` 和 `m_respawnCostMaxMultiplierOffset`。字段身份由同一批元数据偏移确认。具体来源进入各轮修正的条件、相互竞争与数值叠加仍需核对。[修正和写回正文](../evidence/card-policy-distribution-20261102/native-evidence.json)

**N／I　凛御银灰 X 模组三级会把这次离场后下一次部署所用的涨费倍率上限减少 0.25。** 模组的天赋 Blackboard 在符合条件的单位离场时经 `ON_OWNER_FINISH` 传给 CardBuff。`RuntimeCostModifier.ApplyFirstPass` 将该偏移加入本轮已接纳修正的总和。费用使用 `max(1, 原倍率上限 + 总偏移)` 限制这次再部署倍率，再乘费用基数并取 floor，之后才施加 `rawCostScale` 与 `costDelta`，用费用上限截断。普通情况下，该效果保留初始与第一次涨费倍率 1 和 1.5，第二次及以上的倍率从 2 降为 1.75。其对应修正持续到下一次生成。其它来源的接纳和竞争条件按实际样本核对。[X 模组的配置、写入路径与取整用例](../evidence/redeploy-cost-cap-20261122/README.md)

### 凛御银灰 X3 与野鬃

**N／D：** 野鬃精二天赋的实际 Prefab `wildmn_t_1` 给未部署近卫安装带 `value=-1` 的 CardBuff，下一次部署时消耗。`RuntimeCostModifier.ApplyFirstPass` 将整数减费计入 `m_costDelta`，并独立聚合凛御银灰 X3 的 `m_respawnCostMaxMultiplierOffset`。先按 ×1.75 上限计算并向下取整 `rawCost`，再经运行时费用倍率取整，最后施加野鬃减费。举例时取基数 18、涨费达到两层、后段倍率为 1、只叠一层野鬃，费用为 `floor(18 × 1.75) − 1 = 30`，前置减费会得到 `floor(17 × 1.75) = 29`。普通部署的余额校验及付款均调用 Card 的费用 getter。本批证据为静态调用和实际组件绑定。 [本轮组件与算价证据](../evidence/card-rules-20261122/README.md#费用修正) · [凛御银灰上限](../evidence/redeploy-cost-cap-20261122/README.md)

## 二、返费与在场费用

以下公式与例子来自 2026-10-31 查阅的[部署费用·在场干员的部署费用／撤退返费](https://prts.wiki/w/部署费用#在场干员的部署费用)。普通撤退何时写入 DP 见[普通退出结算](#普通撤退与死亡的结算顺序)。

```text
返费量 = floor(min(本次部署费用属性 × 返还倍率, 返还上限))
```

普通返还上限为基础费用，不能把再部署惩罚后的全部费用直接当作上限。例如本次属性费用 15、基础费用 10、返还倍率 0.5，返还 7；部分冲锋手／处决者模组将上限改为本次部署费用属性。

同页“可返费”记录新约能天使 S3 免费投递干员后仍可按费用属性返费的实例，说明实际扣款与返费资格不能互相替代。撤退、死亡、自动离场和特殊移动也不能只按名称推定返费与惩罚相同，仍需核对具体原因和路径。

同页还说明：在场干员通常继承部署时的费用属性，不随隐藏卡牌后续减费自动更新；隐藏卡牌仍可被琴柳减费、凛御银灰识别和排序。因此同一干员存在两份不同生命周期的费用事实，有具体机制依据。

## 三、供给、冷却与特殊部署

2026-10-31 查阅的社区资料：

| 来源 | 已说明的机制及边界 |
| --- | --- |
| [中继器·队列策略](https://prts.wiki/w/中继器#队列策略)及其属性中的再部署策略说明 | 默认策略在部署时开始冷却；唯一策略在场上实例离场后开始冷却；队列策略在离场时增加待冷却份数，由一条冷却依次归还可用数。三件各需 30 秒的实例进入队列，全部归还需要 90 秒；尚有可用数时仍可部署。页面标注不确定的动态上限调整、多个来源合并细节不纳入结论。 |
| [数值范围](https://prts.wiki/w/数值范围) | `MAX_DEPLOY_COUNT` 表达单来源同时在场数量，`MAX_DECK_STACK_CNT` 表达单来源待部署可叠加数量。名称相近不意味着二者可以合并。 |
| [贾维·天赋](https://prts.wiki/w/贾维#天赋) | 已经生效的再部署减免不会因贾维退场而取消。它否定了“来源退场就重新按完整时长计算正在进行的冷却”；尚不足确定开始冷却的精确退出阶段。 |
| [卫戍协议·战斗部署](https://prts.wiki/w/卫戍协议/帮助#战斗部署) | 初始部署不扣部署费用；预先放置的召唤物不消耗持有数；不触发耀骑士临光 S2 卡西米尔检查等部分普通部署效果。它不只是把普通部署的支付数值改成 0。 |
| [渡桥·天赋备注](https://prts.wiki/w/渡桥#天赋) | 泄压准备以“手动部署并消耗费用”的操作为条件，正常 0 费也可计入，但特殊免费部署、上次退场为特殊移动等情况被排除；樱桃三号另有明确例外。正常支付结果为 0 与跳过支付流程并不等价。 |

这些实例支持区分供给消费、费用消费、出场和特定部署触发；没有据此证明所有干员、召唤物和装置必须共用某一种策略或同一组标志。

### 本次部署临时不占部署位

2026-11-01 查阅 [AT-TR-1·关卡内剧情](https://prts.wiki/w/AT-TR-1_天命滚滚#关卡内剧情)与 [AT-2·特殊地形效果](https://prts.wiki/w/AT-2_灵异特辑#普通)。PRTS 收录的教程文本明确说明：强运期间，待部署费用最高的干员成为幸运儿，本次部署不占部署位；强运结束后，这些幸运儿被强制撤退。关卡机制表另列每次升级刷新 35 秒强运、幸运儿部署费用减少 99、当次再部署时间减少 90%、部署后获得 100 SP，且不消耗部署位。

**C：存在由临时关卡机制改变本次部署额度占用的实例。** 免占位取决于本次是否受强运影响，不能一律视作干员所选配置的静态属性，也不能仅用“允许突破部署上限”代替实际不占位。这里确认的是本次部署的玩法结果；本轮未调查免占位是否由创建参数、Buff 或其它内部路径实现，不据此确定项目报价或请求的字段归属。

### 多份队列恢复的预算采样

2026-11-01 的[新版 native 短链](../evidence/deployment-recovery-20261101/README.md)确认：普通 QUEUED 策略存储待恢复份数与单个 PeriodicTimer，不为每份记录入队时长。当前一段预算已经保存在 Timer 中；一段到期后，若仍有待恢复份数，`OnTick` 读取当时 Card 的 `m_newRespawnTimePeriod`，Reset 出下一段。因此后续预算采用启动该段时已写入 Card 的后续周期值，不是每份离场时各存一份，也不是整条队列共用首次启动时的永久快照。这里是读取已有值，不是在启动处即时重新求值全部修正；同次 `OnTick` 中限时 CardBuff 的推进和相应更新位于计时器处理之后。

2026-11-22 的[中继器 Prefab／模板与离场调用链](../evidence/repeater-recovery-20261122/README.md)确认了普通回收的实际入参。离场时若回收 Buff 仍在，`Character.OnFinish` 经 `Unit.OnFinish`、`Entity.OnFinish` 同步结束这个 Buff，执行 `RechargeToken(1, ON_FINISH, false)`，之后才通知原 Card 的 `OnRecycle`。Buff 自然结束也执行同一补充动作。在持有上限稳定且有份数可归还时，总份数和排队份数同时加一，可用份数不变。第一份回收启动计时。第一段尚在进行时，第二份普通回收维持原来的 QUEUING 或 RESPAWNING，保留第一份已经经过的时间。若此间部署了最后一份可用库存，Draw 已切到 RESPAWNING 并保留原计时。

`OnRecycle` 的状态切换 Reset 分支仍存在。`_UpdateCardBuff` 可以显式修改当前剩余时间。谬因三技能的 `aphris_sk3[token-withdraw]` 在起始和宿主结束事件中都经 `ResetTokenRespawnTime(waitFirstPeriod=false)` 将当前计时器置为零，库存仍由 Card 的队列推进。这个显式指令有独立入口。技能额外补货、强制撤回的其它条件，以及运行时 XLua，未纳入本段普通回收的推导。[节点参数与时钟写入](../evidence/repeater-recovery-20261122/README.md#调用锚点)

**N／I：谬因 S3 同时变更两种上限。** 实际技能组件与 Holder 表明，开始时先增加 2 份，再强制撤回在场中继器并清当前恢复计时，技能正常结束反向扣减 2 份后再撤回及清时钟。`TokenCard.ForceRecharge` 用同一个有符号增量更新持有上限、同卡在场上限与总份数。`ON_FINISH` 还按变更后的总份数同时修正排队数量。总数、排队和可用份数须分开理解。[技能绑定与容量写入](../evidence/redeploy-state-and-repeater-20261122/README.md#谬因-s3-的中继器)

## 四、手牌顺序与目标选择

以下均为 C 级社区资料。页面所说的干员、角色类单位不自动覆盖所有召唤物和装置；除明确记载的条件外，不补造冷却中、隐藏或库存为零时的统一筛选规则。

| 机制 | 目标与采样／持续时点 | 已说明的结果与限制 | 来源 |
| --- | --- | --- | --- |
| 普通初始排序 | 按含符文影响的初始费用、职业枚举、模板 ID 文本及自有队伍／初始装置／助战分类建立顺序 | 顺序随后固定，撤退时插回原位；不是按运行时 Card ID、Unit ID 或当前费用持续重排 | [待部署区·单位的排序](https://prts.wiki/w/待部署区#单位的排序) |
| 中途加入召唤物／装置 | 新增时按费用、模板 ID 文本插入 | 不经过初始职业排序；特殊模式的抽调规则另述 | [待部署区·单位的排序](https://prts.wiki/w/待部署区#单位的排序) |
| 凛御银灰持续重排 | 自身在场时，按当前费用、受技能影响的先后、职业和模板 ID 排序，风雪之眼另有顺序说明 | 与风雪之眼有关的位置判定受当前页限制；离场后恢复位置未闭合 | [凛御银灰·天赋备注](https://prts.wiki/w/凛御银灰#天赋) |
| 松桐 S1 | 开启时选当前最右一名干员 | 当次给予减费；点选松桐时显示候选标记，不等于已经施加；消耗期限未展开 | [松桐·技能1](https://prts.wiki/w/松桐#技能) |
| 凛御银灰 S1／S2 近邻选择 | 风雪之眼右侧最近的近卫／术师／狙击优先，其次右侧其它干员，再次左侧干员 | 职业优先于跨类近邻；S2 减费后立即重排，再按新顺序给左侧干员登记后续攻击 | [凛御银灰·技能1／2备注](https://prts.wiki/w/凛御银灰#技能) |
| 凛御银灰 S3 费用选择 | 选择最高费与最低费干员，最高费一侧另有近卫／术师／狙击优先说明 | 待部署人数不足不耗成功次数；费用交换的实际作用方式见第五节 | [凛御银灰·技能3备注](https://prts.wiki/w/凛御银灰#技能) |
| 新约能天使 S3 投递 | 选可部署到投递位置的干员，按页面所说的再部署时间选择；不必局限近战干员，实际投递要求当前页 | 投递时仍检查地块与部署位，不支付 DP但保留费用属性；最长时间的比较量及并列顺序未闭合 | [新约能天使·使命必达备注](https://prts.wiki/w/新约能天使#技能) |

第二节已记录隐藏卡牌仍可接受部分减费、识别和排序。该事实不证明每个策士技能都覆盖隐藏卡牌；也不证明所有待部署技能都会排除冷却中的对象。

[2026-10-31 多来源重排取证](../evidence/card-ordering-20261031/README.md)已归档调查范围与缺口：凛御银灰实际比较器的安装／撤销连接尚未定位，多个来源的竞争和退出恢复规则仍未闭合。

## 五、卡牌效果、部署后继与共享消耗

| 机制 | 触发、范围与持续／解除 | 已说明的边界或未知 | 来源 |
| --- | --- | --- | --- |
| 凛冬编队减费 | 精二编入队伍时使先锋职业干员部署费用降低 | 不以凛冬当前在场为条件；这里不推导多来源公式 | [凛冬·冲锋领袖](https://prts.wiki/w/凛冬#天赋) |
| 极境在场减费 | 自身在场时降低狙击职业干员部署费用 | 与编队常驻修正的参与条件不同；不据此改变已在场对象的采样费用 | [极境·天赋](https://prts.wiki/w/极境#天赋) |
| 野鬃累计减费 | 精二每次部署，使未部署近卫干员费用降低；精一只首次部署触发 | 每个目标每次部署前，本天赋最多降低 5 费；该上限不限制其它来源的减费 | [野鬃·天赋](https://prts.wiki/w/野鬃#天赋) |
| 松桐永久攻击增益 | 在场满 30 秒时，仅一次作用于场上与待部署区的重装、辅助干员 | 页面注明永久；重复进场叠加和后来加入者是否追授未展开 | [松桐·天赋](https://prts.wiki/w/松桐#天赋) |
| 松桐 S2 后续生命增益 | 开启时对待部署区重装、辅助减费，并给予最多两层的生命上限增益，持续至下次撤退 | Card 先接受效果，再由后续部署的实例受益；隐藏、冷却、零库存目标的细则未列明 | [松桐·技能2](https://prts.wiki/w/松桐#技能) |
| 凛御银灰 S1 部署屏障 | 近邻目标减费并获得部署后的屏障；屏障量取施法时凛御银灰生命上限，不叠加 | 不是等部署后重新采样来源生命上限；其它消耗期限未展开 | [凛御银灰·技能1备注](https://prts.wiki/w/凛御银灰#技能) |
| 凛御银灰 S2 部署攻击 | 第四节顺序选出的左侧目标最多登记两层；部署后 1.1 秒起、每 0.5 秒触发，按受益干员自身攻击力计算 | 各干员独立计数；提前退场等取消细则未闭合 | [凛御银灰·技能2备注](https://prts.wiki/w/凛御银灰#技能) |
| 凛御银灰 S3 费用交换 | 依据双方基础费用差值，分别提供实时费用增减，生效至各自下次退场；整场最多成功一次 | **不是直接交换基础费用字段**，不交换再部署倍率或临时减费；页面列有伊内丝假部署、瞬间撤退的消耗例外 | [凛御银灰·技能3备注](https://prts.wiki/w/凛御银灰#技能) |
| 银灰 X 模组额外再部署效果 | 天赋选中范围内目标时授予一次，同一卡牌持有期间不重复授予；至目标下次部署或银灰退场 | 页面以 CardBuff 区别于常驻天赋；选中不是玩家点选，解除是否回滚已经开始的冷却未闭合 | [银灰·天赋备注](https://prts.wiki/w/银灰#天赋) |
| 琴柳下一次部署优惠 | 优惠覆盖待部署区所有干员，任一受影响者首次部署后统一失效 | **激活时点表述冲突**：正文联系琴柳部署后，备注写战斗开始后且存在提供延迟；不替其确定时序，Y 模组另行判定 | [琴柳·精神感召](https://prts.wiki/w/琴柳#天赋)、[天赋生效条件一览](https://prts.wiki/w/天赋生效条件一览) |
| 历阵锐枪芬下一次部署优惠 | 自身首次优惠在首次部署后失效；撤退后对待部署区所有干员提供下一次优惠，任一受影响者首次部署时统一失效 | 不是每张 Card 各自享受一次；不由此推广其它优惠的消耗范围 | [历阵锐枪芬·天赋备注](https://prts.wiki/w/历阵锐枪芬#天赋) |

## 六、再部署计时与场下资源

第三节区分了冷却起点及贾维已生效减免的保留。下面继续区分再部署属性、当前剩余计时和需要跨次保存的资源；本节没有建立统一聚合或取整公式。

| 机制 | 触发、范围与持续／解除 | 已说明的边界或未知 | 来源 |
| --- | --- | --- | --- |
| 银灰编队再部署修正 | 编入队伍即可作用于可部署单位的再部署属性 | 页面给出直接乘算和就近取整；完整多来源顺序、半数取整边界未闭合 | [银灰·天赋](https://prts.wiki/w/银灰#天赋) |
| 砾缩短当前计时 | X 模组部署触发，对正在再部署的卡西米尔干员缩短剩余时间 | 是本轮正在进行的冷却操作，不是永久降低每轮基础时长 | [砾·天赋](https://prts.wiki/w/砾#天赋) |
| 玛露西尔跨部署魔力 | 本场战斗保存魔力；部署时转为技能 SP，退场时剩余 SP 转回魔力；场下自然回复，在场 SP 不自然回复 | 保存范围不扩展到下一场战斗；吞噬等某些不可部署状态会暂停场下回复，精确门控集合未闭合 | [玛露西尔·天赋及备注](https://prts.wiki/w/玛露西尔#天赋) |

暂停、清空、下次冷却累计与本场实际计时的临时豁免还各有实例，分别见第七节的待投放与第九节的特定模式对照。它们不能由相同的“再部署时间减少”表述合并推断。

### 银灰 X 与砾 X 的两个计时量

**N／D：** 原版银灰 X3 的范围效果写 `respawn_time=-0.1`，与编队天赋一样进入后续周期计算。银灰退场时按键移除范围 CardBuff，再计算 `m_newRespawnTimePeriod`。已启动段的 PeriodicTimer 仍保存启动时的周期和当时剩余时间，解除这项持续修正不会回滚本段。砾 X 的 `remaining_respawn_time` 则在有效且未结束的计时器上直接扣本段剩余，X2 为 3 秒、X3 为 5 秒。两者分别作用于启动预算与当前剩余量，不互相反算；扣到负值时按 0 写回。实际计时路径传递 FP 周期与剩余值，该路径未找到将周期先取到整数秒的指令。PRTS 的就近取整描述与显示、可操作时点如何对应仍需独立客户端观测。 [组件、字段及计时指令](../evidence/card-rules-20261122/README.md#再部署计时)

砾的减时 CardBuff 依赖部署时安装的零时长 Buff。它的源实例回收后，即使砾仍在场，银灰退场重算也不会再次扣除这笔剩余时间。原生实现会逐项重算尚存的 CardBuff，因此在源 Buff 进入回收队列、旧引用仍有效的短窗口内，同一张卡再次重算存在重复扣减的静态分支。本轮未确认这两名干员的普通操作实际命中该窗口。 [实际生命周期与重算入口](../evidence/card-rules-20261122/README.md#再部署计时)

## 七、点选与部署资格

| 机制 | 触发、对象与解除 | 已说明的结果及未知 | 来源 |
| --- | --- | --- | --- |
| 当前费用不足 | Card 费用超过当前 DP 时限制拖选与完成部署，后续按当前数值判断 | 不等于冷却、吞噬或 Card 已不存在 | [部署费用·待部署区单位的部署费用](https://prts.wiki/w/部署费用#待部署区单位的部署费用) |
| 吞噬锁定 | 枯朽吞噬者强制击倒目标干员，使对应 Card 冷却归零，但禁止部署；个体技能写吞噬者死亡时解除 | 待部署区通说写离场；逃逸等非死亡离场是否相同未闭合，不能推广解除原因 | [萨卡兹枯朽吞噬者·吞噬](https://prts.wiki/w/萨卡兹枯朽吞噬者)、[待部署区·待部署Buff](https://prts.wiki/w/待部署区#待部署Buff) |
| 有限消化后另起冷却 | 暴走食虫花吞食干员后先使 CD 归零并锁定，消化完成才开始再部署冷却；召唤物直接进入自身 CD | 与等待吞噬者死亡解除的机制不同；初始／普通消化时长不在此统一 | [暴走食虫花·天赋及技能](https://prts.wiki/w/暴走食虫花) |
| 源石封印 | 静滞虚幻弹道抵达终端后，选未封印且不在再部署冷却的最高费、并列最右对象，禁止点选与部署 20 秒 | 该技能明确排除 CD；不能由此推导所有 Card 目标筛选 | [静滞虚幻·α](https://prts.wiki/w/静滞虚幻·α)、[静滞虚幻·β](https://prts.wiki/w/静滞虚幻·β) |
| 只限制点选的封印 | 拟态机械的限制写入影响四个合格手牌，封印 20 秒 | 页面明确仍可部署而不能点选；具体交互入口未核清，不能只按封印名称归并部署权限 | [拟态机械·限制写入](https://prts.wiki/w/拟态机械) |
| 风雪之眼使用窗口 | 持有者在场时加入；常态不可部署，S3 中才可部署，且地块上目标有条件 | Card 存在与可部署不同；与左侧干员有关的部署技力、下次冷却减免另有时点 | [风雪之眼·特性及天赋](https://prts.wiki/w/风雪之眼) |
| 待投放 | 凯尔希·思衡托第二天赋及相应技能／战术锚点流程，使合格干员返手后开始实际冷却，同时按零费用、零有效再部署时间获得范围受限的部署资格 | 关卡直接预置且不可返手者不能选；状态解除及移动失败的完整接续未闭合，不能把临时豁免等同于清除真实计时 | [凯尔希·思衡托·天赋及技能](https://prts.wiki/w/凯尔希·思衡托#天赋)、[战术锚点](https://prts.wiki/w/战术锚点) |

这些实例分别证明：显示、点选、拖选、当前接纳部署和计时推进并不等同。它们尚不足以确定所有特殊自动部署如何与封印、锁定组合。

### 特殊移动的结束原因

2026-11-02 补查。**N：当前客户端的结束原因枚举显式区分特殊移动。** [本轮 metadata 摘录](../evidence/deployment-move-20261102/README.md)直接列出 `Entity/FinishReason.MOVE_LIKE_RESPAWN_SELF` 与 `MOVE_LIKE_RESPAWN_EXTERNAL`，并与 `WITHDRAW`、`RESPAWN_SELF` 等成员区分。

[案例 23 的旧版本调用链](23-blocker-and-blockable-roles.md#原生调用链与关系维护)另已确认特殊移动先调用 `FinishMe(reason)`，再走新实例创建；保留指令中 Self／External 路径传入不同的结束原因常量。两批客户端指纹不同，本轮不把旧常量直接映射为新版枚举值，也没有重新提取新版的完整移动正文。

2026-11-22 沿当前客户端补查乌尔比安与 Mon3tr S3。**N／I：两者的实际 Self 移动通过原 Card 生成新实例，并由专属 Buff 保存、恢复 HP 比例。** 乌尔比安仅在 `MOVE_LIKE_RESPAWN_SELF` 结束时保存比例，新实例出生读取；Mon3tr 的重生模式在 Buff 安装时读取比例。`FetchHpToBlackboard` 以新实例最大 HP 计算从当前比例到目标比例的有符号差量，设置 `SKIP_MODIFIER_EVENT` 后提交。两份技能各有专属进度键和返回条件，乌尔比安移动、返回模式分别绑定清 SP；通用 `RespawnCharacter` 另有 External 的 HP／SP 比例传递，Mon3tr S3 的实际调用关闭它。 [组件、Holder 与原生调用](../evidence/redeploy-state-and-repeater-20261122/README.md#特殊移动)

思衡托 S3 的待投放路径先为选中友方的 Card 设置部署许可与报价，再撤退原单位。实际冷却从撤退开始推进，待投放期间符合范围条件才以零费用和零有效冷却部署。思衡托自己移动后的技能剩余时间从弹道发出前锁定的进度接续。 [实际绑定](../evidence/redeploy-state-and-repeater-20261122/README.md#特殊移动) · [PRTS 破梏重生](https://prts.wiki/index.php?title=凯尔希·思衡托&oldid=448412#技能)

2026-11-22 分别复查三个技能的常规作战备注。**P：落点无效时的实际结果由技能和失败阶段共同决定。**

| 技能 | 去程 | 返回或待投放的后继 |
| --- | --- | --- |
| 乌尔比安 S3 | 船锚落点、落点后一格、当前格依次尝试。前两个目标都不可部署时仍可原地完成特殊移动。成功后保留技能进度和第二天赋层数。 | 技能结束或被手动结束时尝试返回原位置。异格移动时留在原位置的「从不混淆的方向」提供返回标志。返回失败按术语说明进入击倒分支，黑夜、深水、临时步道列为可返回的例外。返回清空 SP，后续来源仍可给予 SP。 [PRTS 必须开辟的通路](https://prts.wiki/index.php?title=乌尔比安&oldid=446659#技能) |
| Mon3tr S3 | 先撤回重构体，再检查其原格。原格不可用时立即结束技能并返还 SP。成功时新位置进入技能形态，原格的路标重构体用于返回。 | 技能结束或致命伤时触发返回。若标志物未能部署或目标格无法返回，可实际击倒离场。支持标志物的地块以及返回后原重构体是否继续留场，按技能自身策略判定。 [PRTS 策略：熔毁](https://prts.wiki/index.php?title=Mon3tr&oldid=446534#技能) |
| 凯尔希·思衡托 S3 | 抵达锚点时若首轮检查已不合法，自身被击倒，余下待投放 Card 当即解除。首轮合法而特殊离场后才失去部署资格，自身回到待部署区，余下待投放 Card 被锁定。 | 上述再次检查失败时，等思衡托下次部署才解除那些 Card 的待投放。成功移动时，未使用的待投放持续到本轮技能结束。备注没有给出独立于本轮技能的待投放到期时钟。 [PRTS 破梏重生](https://prts.wiki/index.php?title=凯尔希·思衡托&oldid=448412#技能) |

**D：Mon3tr 去程失败有专属后继。** 选中的 `monstr_s_3_buff[respawn]` 把 `RespawnCharacter` 用作条件。失败分支移除 `respawn_buff`，中断自身技能，通过比例 `ModifySp` 恢复技力，最后进入重构体补货条件。成功分支另外尝试在原格设置返回标志。 [实际 Holder 分支](../evidence/redeploy-state-and-repeater-20261122/result.json#L3073)

**N　思衡托离场前拒绝和离场后创建失败会走不同后继。** 弹道先检查目标格及占位者归属，拒绝时调用 `Suicide`。首轮通过后保存技能进度和待投放 Card，特殊离场会跳过普通退场的待投放清理。原 Card 创建失败时，原生清掉落点坐标和旧 HP 比例，保留技能恢复标记、剩余进度及待投放 Card 记录。下次部署从原 Card 读回这份数据，恢复计时。所查原生路径在接续计时结束时清除相关 Card／Deck Buff 和附加部署检查。PRTS 确认思衡托离场时友方 Card 被锁、再次部署后解锁。出生至解锁的间隔未实测。 [落点、失败返回和下一次部署的实际调用](../evidence/special-redeploy-failure-20261122/README.md) · [PRTS 破梏重生](https://prts.wiki/index.php?title=凯尔希·思衡托&oldid=448412#技能)

乌尔比安与 Mon3tr 的技能根共用 `UlpiaS3CastSkill._RespawnToLocatedPos`。返回到不同格时会检查场上占位者及所属 Card，允许特定 Buff 豁免，返回条件失败时执行 `Suicide`。 [返回检查](../evidence/special-redeploy-failure-20261122/README.md)

**N／P：部署通知与技能接续是两个事实。** 同一卡的特殊移动跳过普通 DP 检查、扣费和旧实例的普通卡牌回收，落点再检查失败后默认模式会回收 Card。PRTS 记录移动后可再次触发部分部署效果，手动部署才计入的效果仍按自身条件判断，例如渡桥的泄压准备。思衡托的 `SkillProgressHooker.RestoreSkillProgress` 写回计时进度并安装恢复 Buff，普通技能发动和 SP 支付没有在这条入口重跑。恢复 Buff 有条件地请求 `RespawnBorn`。该能力是角色的公共 `EmptyAnimatedAbility`，若执行到标准 `SpellOn` 分支则派发自己的能力通知，编号为 `GENERAL` 的公共能力不计入标准狂躁的攻击／技能次数。其他技能接续和通知的过滤仍取决于各自实现。 [费用、回收与原生恢复程序](../evidence/special-redeploy-failure-20261122/README.md) · [泄压准备](https://prts.wiki/w/渡桥#天赋)

#### 特殊入场如何触发部署效果

自身特殊移动经原 Card 创建新实例，保留通常的出生、登记和出生后通知。集成战略「岁怒」的真实程序收到友方单位的出生后通知便请求触发，特殊移动可再次触发。「他缚」收到同一类通知后读取原 Card 记录的上次离场原因，遇到 `MOVE_LIKE_RESPAWN_SELF` 跳过生命损失。渡桥的泄压准备还要求本次为手动部署且经过费用结算。新实例出生、是否手动部署、是否参与费用结算和上次离场原因是这些消费者分别使用的事实。 [实际组件、原表及通知调用链](../evidence/special-redeploy-failure-20261122/README.md#特殊入场的实际观察者) · [渡桥的部署条件](https://prts.wiki/w/渡桥#天赋)

### 在场单位的手动撤退资格

2026-11-01 查阅 [扎罗，“狼之主”·溶血骇惧](https://prts.wiki/w/扎罗，“狼之主”)与 [异常效果·无法撤退](https://prts.wiki/w/异常效果#无法撤退)。**C：手动撤退资格存在运行中的临时限制。** 溶血骇惧使最多三名我方单位获得无法撤退，并降低攻击速度、持续流失生命；扎罗达到该技能规定的生命损失条件或开始重生时解除相关技能效果。不能仅用静态的单位种类或本次初始配置决定其整个在场期间的撤退资格。

异常效果页将 `NOT_WITHDRAWABLE` 明确解释为无法执行手动撤退。这里的限制不等于禁止所有离场，也不据此改变死亡或内容强制移除的语义。是否以可登记的 Rule 表达该资格属于项目设计；本次只确认内容实例与限制范围，未调查对应客户端 Buff 的完整实现。

## 八、供给、补数与宿主关系

默认／唯一／队列的冷却政策已在第三节记录。下表只补充不同的数量事实、供给变化与来源结束行为；页面使用“回收”时，不额外推定统一的加库存、重置 CD 或通知顺序。

| 机制 | 触发、范围与持续／解除 | 已说明的边界或未知 | 来源 |
| --- | --- | --- | --- |
| 持有上限与发放数不同 | 梅尔精二提供五份水獭，但持有上限六；麦哲伦可持有五架，通常同时最多部署三架 | 发放、持有及在场上限不是同一个量；动态上限变更后的裁剪未闭合 | [梅尔·特性备注](https://prts.wiki/w/梅尔#特性)、[麦哲伦·天赋](https://prts.wiki/w/麦哲伦#天赋) |
| 部署时补充 | 夜莺每次部署补幻影，普通补二、持有上限三，模组可增加补充数 | 是补充，不是把库存重置为固定值；宿主离场后的未用卡片保留方式未知 | [夜莺·天赋备注](https://prts.wiki/w/夜莺#天赋) |
| 技能触发补充 | 稀音 S2 获得摄影车、多萝西主动技能获得陷阱 | 不要求旧实例先退场；满库存时的门控和溢出须逐内容核对 | [稀音·技能2](https://prts.wiki/w/稀音#技能)、[多萝西·技能](https://prts.wiki/w/多萝西#技能) |
| 条件额外获得 | 白铁周围八格的自身装置损毁后可额外获得装置，手动撤回也可触发 | 按内容范围和概率处理，不是所有实例结束都固定返还 | [白铁·第二天赋](https://prts.wiki/w/白铁#天赋) |
| 批量或条件回收 | 梅尔 S2 回收水獭；麦哲伦技能结束回收无人机；令 S2 只回收生命值低于一半的召唤物 | 回收的库存与 CD 更新时点、通知和溢出未形成已证统一链路 | [梅尔·技能2](https://prts.wiki/w/梅尔#技能)、[麦哲伦·技能](https://prts.wiki/w/麦哲伦#技能)、[令·技能2](https://prts.wiki/w/令#技能) |
| 自动放置与消费分离 | 多萝西初始自动陷阱不耗持有数但占在场上限；模组额外放置可无视旧 CD，同时启动新的 CD | 不消耗库存不能推出不占额度或不启动冷却 | [多萝西·天赋备注](https://prts.wiki/w/多萝西#天赋) |
| 实例退场返还 | Mon3tr 退场返还一份可部署供给，采用唯一再部署策略 | 返还数、同时在场数、冷却起算分别记录 | [Mon3tr·备注及再部署策略](https://prts.wiki/w/Mon3tr(凯尔希的召唤物)) |
| 随宿主清理的在场对象 | 麦哲伦、多萝西、白铁的附属对象随来源退场；诅咒娃娃也会随巫恋退场，另有自身期限 | 不能推广到全部召唤物；未用 Card 究竟隐藏、删除或保留库存未闭合 | [麦哲伦·特性](https://prts.wiki/w/麦哲伦#特性)、[多萝西·特性](https://prts.wiki/w/多萝西#特性)、[白铁·特性](https://prts.wiki/w/白铁#特性)、[诅咒娃娃](https://prts.wiki/w/诅咒娃娃) |
| 来源离场后实例继续存在 | 夜莺幻影、赫默医疗探机已部署后不随来源退场；探机按自身期限结束 | 来源关系不等于统一拥有关系，也不证明未用手牌在来源缺席时仍可部署 | [幻影](https://prts.wiki/w/幻影)、[医疗探机](https://prts.wiki/w/医疗探机) |
| 技能使用窗口与场上销毁 | 淬羽赫默相应技能期间可使用辅助无人机；在场对象在技能结束或持有者离场时销毁 | 技能结束清零同一卡的库存。手动撤回和冷却另走通常回收。见下文实际绑定 | [淬羽赫默·俯瞰视界](https://prts.wiki/w/淬羽赫默#技能) |

仅有技能在场生成的召唤物，不能因为页面列出召唤物职业与策略模板，就据此证明它存在可由玩家操作的手卡。

### 已核的两条附属 Card 路径

**N／D　淬羽赫默 S2 的夜灯使用已有 Card。** 技能根安装一次发放 `trigger_charge_token`（`cnt=1`，通常累加），窗口结束先撤回场上无人机，再以 `RechargeToken(0, NORMAL, true)` 把剩余库存重设为 0。两者都从宿主的 Token Card UID 查询已有卡，只更新库存。该 `UNIQUE` 卡手动撤回后，冷却按普通回收处理。清库存和重新发放保留同一计时，零库存期间已启动且未暂停的冷却仍会推进。 [技能根、Token Card、库存与计时写入](../evidence/card-rules-20261122/README.md#淬羽赫默-s2)

**N／D　谬因 S3 的宿主提前结束有两个阶段的清理程序。** 准备阶段的 `aphris_sk3[token-withdraw]` 以 `charge_time` 为限，宿主提前结束时用 `ON_OWNER_FINISH` 撤销两份容量和库存，再将当前余量置零。普通阶段交接先将准备 Buff 标记结束，再启动持续阶段。持续阶段的 `aphris_sk3[on_finish]` 在 Buff 结束时按撤容量、召回在场件、清余量执行。每条 `ON_FINISH` -2 把排队数按本次增量与更新后的总份数截断。 [实际两个阶段的配置和宿主结束调用链](../evidence/card-rules-20261122/README.md#谬因-s3)

## 九、模式对照

### 卫戍协议

本节取当前[卫戍协议帮助](https://prts.wiki/w/卫戍协议/帮助)所述规则，区分休整阶段经营手牌与作战阶段隐藏的待部署区，不以旧版本替代当前规则。

| 机制 | 触发、对象与结果 | 范围或未知 | 来源 |
| --- | --- | --- | --- |
| 经营手牌 | 招募加入手牌，三名初始干员合成为精锐；可出售场上或手牌干员 | 跨回合经营事实，不等于战斗内一次 Unit 退场 | [干员的获得与精锐化](https://prts.wiki/w/卫戍协议/帮助#干员的获得与精锐化) |
| 休整供给 | 部署宿主时按召唤物部署上限发放；同名召唤物可堆叠，不同干员的召唤物不合并 | 新约能天使投递坐标另有例外；不扩为运行时宿主分组算法 | [战斗部署](https://prts.wiki/w/卫戍协议/帮助#战斗部署) |
| 撤回与移动 | 撤回宿主移除其场上召唤物；移动宿主使召唤物退场并重置至休整手牌 | 休整操作，不套用普通战斗离场政策 | [战斗部署](https://prts.wiki/w/卫戍协议/帮助#战斗部署) |
| 手牌容量 | 常规槽与临时槽分别处理，满员限制招募／撤回；临时溢出在阶段结束清空，附属供给下回合返还 | 不是一般战斗 Card 集合的通用数量上限 | [手牌区](https://prts.wiki/w/卫戍协议/帮助#手牌区) |
| 初始布阵进入战斗 | 按休整站位部署，不扣费用；预放召唤物不消耗持有数，部分普通部署效果不触发 | 参见第三节，不能等同普通部署支付零费用 | [作战阶段](https://prts.wiki/w/卫戍协议/帮助#作战阶段) |
| 退场与自动再部署 | 作战中待部署区隐藏；干员退场后返入该隐藏区域，满足 CD 和费用条件后原位自动再部署，预放召唤物也有补回机制 | 不是退回经营手牌；具体逐帧调度与特殊限制组合未知 | [作战阶段](https://prts.wiki/w/卫戍协议/帮助#作战阶段) |
| 倒地位置 | 倒地位置阻止其它我方部署；与其他对象初始位冲突时尝试返回自身初始位 | 不证明阻挡部署必须通过普通存活 Unit 占格实现 | [作战阶段](https://prts.wiki/w/卫戍协议/帮助#作战阶段) |

2026-11-01 补核同名干员的计时归属：帮助页明确允许同时持有／部署多个同名干员；各干员退场后留下对应倒地对象，可分别查看待部署属性、下次部署费用、当前再部署限制及进度环，满足条件后在对应位置重新部署。上述规则支持每份干员具有独立待部署记录及再部署计时的推断，不能因内容同名就套用一条串行库存恢复队列。**证据等级为社区规则链推断**：页面没有直接描述两个同名干员同时倒地时计时器如何推进，本轮未反汇编该模式的双实例计时链。

同一宿主的同名召唤物堆叠、不同宿主不合并，是另一项直接记载的规则。恢复时间取决于战斗 Card 的归属与回收政策。

2026-11-22 补核默认卫戍的 Card 分配与自动部署。**N：默认加载为每个宿主生成一份 Token Card 数据，同侧、同宿主的召唤物棋子共用该 Card UID。** `AutoChessBattleTrigger` 跳过已在战斗的棋子，按该 UID 读取 `readyToSpawn`，沿同一位置尝试 `SpawnCharacterOrToken`，成功才写回新实例及清理倒地对象。独立 Card 分别推进，共用 Card 的棋子读取同一份库存和资格。谬因中继器的实际配置采用 `QUEUED`，同一宿主的中继器在该政策下共享串行恢复。 [Card 分配](../evidence/same-character-source-20261111/native/bodies/_LoadBattlePlayerData-81754.asm)、[自动部署与中继器证据](../evidence/redeploy-state-and-repeater-20261122/README.md#卫戍自动再部署)

**C／D　开场布阵分别跳过费用和预放召唤物库存消耗。** 卫戍作战说明记录这次部署不进入耀骑士临光 S2 对卡西米尔干员的判定。固定原表显示，S2 结束程序读取场上的 `nearl2_t_1[mark]`，该标记由出生时对应 Card 是否持有特定 Buff 决定。本轮对开场豁免的证据限于说明中列出的这一实际消费者。 [卫戍作战阶段](https://prts.wiki/w/卫戍协议/帮助#作战阶段) · [模板摘录](../evidence/card-rules-20261122/README.md#卫戍开场的部署记录)

**N　初始布阵和战中自动补位调用同一个 Card 部署入口。** 安装版静态代码均传 `spawnManually=true`，初始布阵额外传 `freely=true`。普通部署的 `freely` 分支跳过 DP 与库存结算，仍能走到 `Card.Draw` 的组合通知。现有静态证据尚未定位卫戍开场排除 S2 判定的具体分支。 [开场和补位的实参与原生分支](../evidence/stronghold-opening-deploy-20261122/README.md)

### 上一名部署者与在场时间

**N／D　耀骑士临光的卡西米尔判定使用牌组管理的标记。** `DeckManagedCardBuffController` 为她的卡保存一份组合规则。一次参与此规则的 `Card.Draw` 到来时，召唤物和装置跳过更新。其余牌按 `kazimierz` 判定，有该势力时给她的卡写 `nearl2_t_1`，否则清除。它只保存当前判定结果。部署的新对象先执行出生程序，随后才处理该卡的 `Draw`，所以她入场时读到上一张有效牌留下的结果。第一天赋和 S2 使用本次出生时确认的 Unit 标记，之后再部署别人不改写这次 S2 的退场优惠。S3 的耀阳有自己的 Card 标记，并在耀阳出生时另行采样，因而能认到此前部署的耀骑士临光本人。 [实际角色与召唤物组件、写入和读取链](../evidence/nearl-deployment-combo-20261122/README.md) · [干员天赋与技能](https://prts.wiki/w/174)

**N／D　集成战略「罗德之门」保存的是最后一张合格 Card 的 UID。** 其 `rogue_4_log_final_locate` 在出生事件中判断角色并排除自身特殊移动，写入玩法黑板的 `unique_id` 并增加发生次数。写入字符串会覆盖旧值。`Rogue4DLC2LastDeployManager` 在结算时读这两项，按 UID 转回玩家阵容身份。撤退不清该选择，目标不再适用时也不回退到上一个。 [实际写入和战斗结束消费者](../evidence/deployment-order-consumers-20261122/README.md) · [罗德之门备注](https://prts.wiki/w/罗德之门)

**N／D　思衡托 S3 和菲亚梅塔模组需要当前仍在场的候选。** 思衡托在范围与 Card 资格筛选后按当前角色的 `createdTime` 降序取至多两名。菲亚梅塔模组按在场对象的创建时间选最近部署的其他合格干员，只在自己的效果里缓存攻击范围锚点。敌方「门」也从当前场上的候选选最后出现的目标，成功取得 Card 后才锁牌。 [思衡托实际选择器](../evidence/deployment-target-order-20261122/README.md) · [菲亚梅塔的原生查询与敌方「门」](../evidence/deployment-order-consumers-20261122/README.md) · [「门」的资格说明](https://prts.wiki/w/“门”)

**D　界园通宝「分久必合」由登场触发效果转移。** 新入场者取得效果，并通过程序移除其他在场者的同类效果。此路径使用本次入场与当前场上对象。 [通宝实际模板](../evidence/deployment-order-consumers-20261122/README.md)

上述消费者各自保留接力结果、结算目标或当前在场对象的创建时间。与这些状态并存的是普通部署时记录的来源身份。原生 Character 携带跨同卡重部署保持的 `cardUid`，包括由卡部署的召唤物与装置。ArkBattle 的 `battle.deployment.history` 保存单位与原 Card 的关联，供 `cardForUnit` 在来源注销后继续反查 Effect 的来源分组。 [原生来源身份](01-buff-installation-and-parent-scope.md#96-carduid-的生成与重部署保留) · [项目部署历史](../../architecture/deployment.md#部署历史)

### 其它模式与活动

以下仅作语义对照，不自动成为主模式或卫戍协议的实现范围。

| 机制 | 触发、目标与持续／解除 | 范围及未知 | 来源 |
| --- | --- | --- | --- |
| 开战打乱费用 | 一串钱伥在战斗开始时打乱干员部署费用；不同集成战略主题版本另有差别 | 不推导随机算法、基础字段覆写方式或多来源公式 | [一串钱伥](https://prts.wiki/w/一串钱伥) |
| 左右部署触发 | 士影／匠影分别标记最右／最左干员，标记对象部署后才计算下个目标，给场上干员屏障／技力 | 不是每次外部顺序变化都更换目标；冷却、隐藏细则未展开 | [士影](https://prts.wiki/w/士影)、[匠影](https://prts.wiki/w/匠影) |
| 战斗开始固定目标 | 艺影／商影在开战时选最左／最右干员，赋予部署后属性，商影还有返费 | 不是 Unit 每次入场重新选择；跨再次部署的保留边界未展开 | [艺影](https://prts.wiki/w/艺影)、[商影](https://prts.wiki/w/商影) |
| Card 在区内持续作用 | 妄躯向待部署区添加宿怒，区内已有至少八张时失败；灸灼目标数为宿怒数量加一；宿怒留在区内就可影响场上敌人 | 对应集成战略关卡；不把 Card 仅视为部署按钮，也不推导其它 Card 的在区效果 | [妄躯·谋炎／灸灼](https://prts.wiki/w/妄躯)、[宿怒](https://prts.wiki/w/宿怒) |
| 下次冷却累计 | 傀影 ISW-α 模组由本体及虚影攻击减少自身和另一方下次再部署时间 | 仅对应集成战略模组；累计下限、重置和精确清除顺序未闭合 | [傀影·模组](https://prts.wiki/w/傀影#模组) |
| 清空当前 CD | 镇岁柱相应阶段技能撤离干员后，清空待部署区再部署时间 | 不证明基础再部署属性改为零 | [镇岁柱·装置技能](https://prts.wiki/w/镇岁柱#装置技能) |
| 暂停计时 | 特定弗莱蒙特存在时，附着目标以非移动、非无声撤退方式离场，放逐的黑棺暂停对应手卡计时，黑棺退场解除 | 相应试炼／集成战略；暂停期间其它缩短操作如何交互未知 | [“放逐的黑棺”·天赋与能力](https://prts.wiki/w/“放逐的黑棺”) |
| 多来源暂停的特例 | 托生莲座装载后暂停计时，直到其被击杀或对应转阶段；页面列有多个莲座关联同一干员时，任一退场即恢复计时的情况 | 仅该内容的社区记录，不推广为通用的全部来源解除或任一解除算法 | [托生莲座](https://prts.wiki/w/托生莲座) |
| 关卡阶段筛选与隐藏 | 奎隆转阶段时隐藏未被装载运送的干员，解除已运送者的不可部署并清空 CD；未用支援道具保留 | 只证实隐藏，不证明物理删除 Card | [奎隆，摩诃萨埵权化](https://prts.wiki/w/奎隆，摩诃萨埵权化) |
| 分区与拥挤 | 保全派驻区分预备、待部署、休整区，退场通常不直接返手计 CD；待部署区拥挤时不同类别进入不同区域或消失 | 模式专属流转，不能当普通或卫戍离场政策 | [保全派驻·干员的调度](https://prts.wiki/w/保全派驻#干员的调度) |
| 效果跨区保留 | 皇家科学院望远镜抽调狙击／术师并令其费用为零；即使拥挤转入休整区，零费效果仍保留 | 只说明该效果不随可见手牌成员资格消失，其它回区路径未闭合 | [皇家科学院望远镜](https://prts.wiki/w/皇家科学院望远镜) |
| 在区即影响其它 Card | 米兰投放的污染晶石在待部署区时阻止其它 Card 部署；聚热晶簇从预备区调入待部署区时造成伤害后消失 | 保全专属；存在／进入区域即有业务，不需要先部署到战场 | [“米兰”·急性污染／高热隐患](https://prts.wiki/w/“米兰”) |
| 活动中途添加 | 建筑工具间在休整期发放设施建筑工；杂物堆满足解救条件后发放高级建筑工 | 对应经营／防御活动，只作来源例子 | [建筑工具间](https://prts.wiki/w/建筑工具间)、[坍塌的杂物堆](https://prts.wiki/w/坍塌的杂物堆) |
| 显示分页 | 生息演算按 UI 宽度分页，首次部署前后容量不同；部分干员另有当前页作用条件 | 分页容量不能直接解释为供给数量上限 | [待部署区·单位数量溢出](https://prts.wiki/w/待部署区#单位数量溢出) |

## 十、卡牌附加与部署时序

2026-11-01 补查的问题是：待部署对象接受的生命增益、屏障、后续攻击和资源变化，是否具有一个共同的、早于新实例全部入场程序的执行时点。[本轮证据](../evidence/deployment-entry-20261101/README.md)分别保存 PRTS 说明、普通 native 调用链与具体内容资源绑定；不依据回调名称推定顺序。

### 社区资料能够区分的采样点

| 机制 | 已确认的时点 | 尚不能从 PRTS 推定的顺序 |
| --- | --- | --- |
| 松桐 S2 | 开技能时向待部署重装／辅助授予最多两层生命上限增益，持续至目标下次撤退 | 增益进入新实例与基础属性、当前 HP、技能初始化的先后 |
| 凛御银灰 S1 | 屏障量取来源开技能时的生命上限；受益者部署后获得 | 受益者屏障生效与自身出生技能／天赋之间的先后 |
| 凛御银灰 S2 | 受益者部署 1.1 秒后开始、每隔 0.5 秒触发；每次输出读取受益者当时的攻击力 | 延迟程序何时挂载，以及部署零点对应客户端哪一步 |
| 凛御银灰天赋 | 主页面将原描述的“初始技力”修正为部署时获得技力；另有下次再部署减免 | SP 初始化、额外获得、下一轮 CD 记录的实际阶段 |
| 风笛 | 编队初始 SP 与模组自身部署额外 SP 是两项不同条件的业务 | 两条客户端路径与其它出生业务的相对顺序 |
| 玛露西尔 | 入场将场下保存的魔力转换为技能 SP，离场再转回 | 仅凭“入场”一词不能确定与其它内容的执行次序 |

来源：[松桐·技能](https://prts.wiki/w/松桐#技能)、[凛御银灰·技能及天赋](https://prts.wiki/w/凛御银灰)、[风笛·天赋](https://prts.wiki/w/风笛#天赋)、[玛露西尔·天赋](https://prts.wiki/w/玛露西尔#天赋)。逐项出处、短摘录与未知条件见证据中的 `prts-sources.json`。这些事实不支持把全部数值统一在部署时采样。

### 普通 native 分支的阶段区别

卡牌携带的场上 Buff 数据会传入新角色，并在 `Character.OnInit` 末尾由 `_SpawnDeckBuffs` 调用 `Entity.AddBuff`。但角色自身天赋在同一 `OnInit` 的此前步骤已具备附着机会；此前[天赋调查](06-talent-lifecycle-and-model.md)也已确认这一点。因此“早于出生回调”不能推广为“早于自身全部初始化或入场业务”。

这里的实际桥是 `get_deckBuffOnBorn` 携带的 **DeckBuff 数据**；原生另有作用于卡牌属性的 CardBuff，不能把本链解释为全部 CardBuff 都会迁为场上 Buff。

基础初始 SP 也不是在这些附加 Buff 之后才统一建立：`Entity.Init` 先读取 `SpData.initSp`，以 `maxSp` 限制后写入当前 SP，再调用 `BObject.Init` 进入后续初始化。该通用路径不证明凛御银灰、风笛等额外 SP 都使用同一种操作；具体内容的出生事件仍需单独追踪。

这条安装链也不只是登记等待：普通合格 Buff 在 `NewBuff`／组选择流程中启用后，会先向 `Attributes` 登记修正，再执行自己的启用动作。`BObject.Init` 返回后，`Entity.Init` 才通过 `get_initHp` 读取初始 HP；其普通实现读取当前最大生命值。因而本轮通用路径中，卡牌携带的合格生命修正能够参与出生 HP 的建立，基础 SP 的采样则已经发生。虚槽的解释同时由本轮 metadata slot 与 `BObject.Init → OnInit` 的真实调用位置核对，没有仅按 displacement 猜测回调身份。

具体内容资源还进一步区分了以下职责：

| 客户端绑定 | 直接证实的内容 | 不能混同的阶段 |
| --- | --- | --- |
| 松桐 `makiri_s_2 → makiri_s_2[attr]` | 技能向 Card 添加 `UNTIL_NEXT_SPAWN` 的 DeckBuff；场上 Buff 为 `MAX_HP / MULTIPLIER`、最多两层、`empty` 模板 | 生命修正随 Buff 参与属性计算，不需要假定另有一个出生动作再添加生命值 |
| 凛御银灰 S1 → `shield` | 先把已采样的屏障数据装入 DeckBuff；普通 shield 模板的对应动作是未来伤害结算时消耗屏障并判断耗尽 | 数据进入角色与未来受伤时消耗屏障是两个时点；不是出生事件中另跑一次屏障创建程序 |
| 凛御银灰 `svash2_s_2[build]` | Buff 的开始事件建立计时状态，后续 Trigger 事件执行延迟输出 | 程序安装不等于立即输出；原生计时配置与 PRTS 的 1.1／0.5 秒说明分别保留，本轮未展开其完整 Tick 调度 |
| 玛露西尔 `marcil_t` 的事件 12 | 既有资源证据记录清空 SP、调整资源参数、写入保存魔力；本轮确认事件 12 对应 `OnOwnerBorn` | 入场资源转换是出生业务，不等于修改基础 `SpData.initSp`，也不等于 Buff 初次启用 |

`OnOwnerBorn` 也不能笼统称为“登记后的入场通知”：本轮 `Unit.OnBorn → Entity.OnBorn → BuffContainer.OnOwnerBorn` 的实际调用早于 `Unit.OnBorn` 随后的 `RegisterUnit`。这只是原生调用位置，不要求项目对尚未登记的 Unit 开放领域操作；项目如何映射仍是架构问题。

另一个实际例子是集成战略「他缚」。它在 `ON_OWNER_POST_BORN` 读取已建立的当前 HP，按比例产生无来源扣血。 [实际出生后消费者](../evidence/resource-observers-20261122/README.md#锁血只保留原有数值权限)

具体 key、黑板、模板、资源身份和事件映射见本轮内容摘录；玛露西尔的局部操作链复用[技能机制研究](09-skill-mechanisms-and-requirements.md)。这些是静态 native／本机内容资源结论，未核验现场 XLua 覆盖。

本案只据已闭合的路径区分数据携带、属性参与、出生事件和后续计时，不据此确定 ArkBattle 的 Entry 接口或把全部外来附加程序排在 `Skill.enter` 之前。

## 十一、部署朝向与巨型占据范围

2026-11-01 补查的[朝向与巨型范围证据](../evidence/deployment-direction-20261101/README.md)区分两类来源。PRTS 的[谐振器机制](https://prts.wiki/w/“谐振器”#装置机制)明确区分有朝向设置的部署单位和无朝向设置的可选召唤物，后者由该机制规定向左发射束流；可部署于某处不等于具有相同的朝向设置。[TN-4 岁相](https://prts.wiki/w/TN-4_辞旧岁/敌方情报pro#岁相)具有独立矩形占据范围，出生清场后以封印的地面占用对应地块；范围与封印装置不能直接视为同一事实。

新版客户端的类级别材料另行确认：Entity 保存离散方向，Enemy 分别保存范围、身体方向策略与碰撞器，身体朝向操作使用 Vector2；EnemyGiantBoss 的普通出生路径会清理地块中的角色、创建实例和位置特效。**本批未闭合岁相资源到 EnemyGiantBoss 的绑定**，不将社区实例与原生类材料拼接成已证实的单体调用链，也不由原生基类存在方向字段推导全部对象的可选部署行为。该调查只记录机制和来源边界，不确定项目字段或能力依赖。

## 十二、CardPolicy、消耗行为与回收涨费的实际分布（2026-11-02）

针对“部署后 CD／回收后 CD、队列与可消耗份数是否能归并”的设计争议，本轮先核对 PRTS，再扫描客户端配置和原生执行分支。[完整证据、指纹和复现入口](../evidence/card-policy-distribution-20261102/README.md)。这些结果用于判断需求，不直接决定项目必须复制客户端状态机。

### 配置分布

本机 7 个 `pkgrps/btl_pfb_tokens_*.ab` 中，共 941 个带 `_cardPolicy` 的控制器：DEFAULT 661、UNIQUE 279、QUEUED 1。进一步只按 `token_` 名称前缀筛选，是 **69 个**（调查中一次进度消息误报 67，此处以脚本汇总为准）：

| 原生 CardPolicy | `_isInfinity = false` | `_isInfinity = true` | 合计 |
| --- | ---: | ---: | ---: |
| DEFAULT（0） | 44 | 9 | 53 |
| UNIQUE（1） | 12 | 3 | 15 |
| QUEUED（2） | 1 | 0 | 1 |

QUEUED 对应 `token_10070_aphris_pc`（中继器）；DEFAULT／有限份数中包含令的 `token_10020_ling_soul*`，UNIQUE／有限份数中包含 `token_10002_kalts_mon3tr`。资源名称只是绑定锚点，未将全部对象都证明为玩家能操作的 Card；自动生成、隐藏与未发布内容没有被排除。941 是控制器配置数，不是有效卡牌或玩法实例数。`_rechargeOnlyOnce` 在这 69 个 token 配置中均为 false，在包含 Trap 的全体中有 69 个 true 配置，均落在 UNIQUE＋isInfinity=true 组；它的实际判定位置见证据，不能据名字代替调用链。

### 计时与消耗是不同的原生维度

**N：** TokenCard 从 Token Prefab 分别读取 CardPolicy 与 isInfinity；普通 Draw 路径先检查 isInfinity，真时跳过 remainingCnt 递减，再按 policy 推进状态。因此同一 CD 策略确实存在不同消耗行为，不应由“部署后 CD”直接推导“消耗品”。

**N：** 普通 CharacterCard.get_cardPolicy 返回 UNIQUE，get_isInfinity 返回 true。原生普通干员不靠每次 Draw 递减库存实现单实例部署限制，而靠 UNIQUE 的使用中与再部署状态。项目若使用 `stock 1→0→1`，属于项目重新表达相同业务的取舍，不是直接复刻此原生字段。

**N／C：** DEFAULT 在部署的普通状态更新路径启动再部署计时。UNIQUE 在 Draw 后进入 INUSE，在 OnRecycle 中转为 RESPAWNING 并启动计时。QUEUED 有独立的 queuedRespawnCnt、可用份数与 QUEUING／RESPAWNING 分支。中继器没有额外的连续投放间隔，离场后串行恢复份数。第三节的实际调用链确认普通追加回收保留当前计时。

**限制：** isInfinity=false 仅证明普通 Draw 会按条件消耗份数，不能证明退场永不归还。Mon3tr 就是有限份数＋UNIQUE，PRTS 另明确其退场返还一份。库存归还的来源与具体退出链仍应另外核对，不能把字段名或零库存直接当作生命周期策略。

### 涨费与回收的关系

**N：** Card.OnRecycle 的 UNIQUE＋当前 INUSE 分支启动再部署，并按 m_addRespawnCostMultCnt 开关增加 m_respawnCostMultCnt。该增量确实附着在回收路径，而不是一项任意部署后回调。DEFAULT／QUEUED 不走这段计数增加分支。

**N：** 开关由构造默认值及 CardBuff 求值决定，`_UpdateCardBuff` 能写回它；另有 ModifyRespawnParameters 直接修改计数与倍率。因此“涨费通常属于回收结算”有直接依据，“所有回收都会涨费”或“计数只有回收能改变”没有依据。没有把计数变化自动等同于所有来源的最终价格变化，也没有穷尽关闭惩罚的内容来源。

CD 策略、份数消耗／归还和回收惩罚有不同原生维度；当前项目类型和结算见 [Deployment](../../architecture/deployment.md)。

## 十三、cardUid 的生成与普通重部署（2026-11-11）

本节补核 [Buff 来源分组](01-buff-installation-and-parent-scope.md#92-基础键与最终键)所读取的 Character.cardUid。**N** 为当前普通原生分支直接证实，**I** 为这些分支接续后的推导。使用当前 Windows x64、metadata v29；输入、选中方法、字段、代码范围与复跑入口见[来源身份批次](../evidence/card-source-identity-20261111/README.md)。没有执行游戏或验证 XLua／hotfix。

### 身份在角色数据转换时形成

**N**：[Card.get_uniqueId（66804）](../evidence/card-source-identity-20261111/allocation/native/get_uniqueId-66804.asm) 读取 `Card.m_data.uniqueId`，数据类型为 BattleCharacterData，字段偏移为 `+0x6c`。Card 的构造与 Init 保存／使用这份数据，不在此分配新的 uniqueId；Character.cardUid 是部署时复制该值的另一个字段。

**N**：[BattleDataConverter._ConvertInternal（79236）](../evidence/card-source-identity-20261111/allocation/native/_ConvertInternal-79236.asm) 在 `0x180b0baf9` 判断 generateUniqueId：为真时调用 _GetUniqueIdByPlayerId，再于 `0x180b0bb47` 写入 BattleCharacterData.uniqueId；为假时写零。[ConvertToCharacterData（79217）](../evidence/card-source-identity-20261111/allocation/native/ConvertToCharacterData-79217.asm) 的普通入口传 true，TouchCharacterData 的入口传 false。

[生成 helper（79238）](../evidence/card-source-identity-20261111/allocation/native/_GetUniqueIdByPlayerId-79238.asm) 的普通分支分别为：

| 输入 | 身份来源 |
| --- | --- |
| playerInstId > 0 | 用 playerInstId 与 playerSide 分区、Character／助战／非 Character 类别位构造值，不消耗递增计数。 |
| playerInstId <= 0 | 先递增静态 s_uniqueId，再混入 playerSide 分区。 |

这不是“每次创建 Card 都递增一次”。模板 key 也不是该 helper 的身份输入。[ConvertToBattlePlayerData（79227）](../evidence/card-source-identity-20261111/allocation/native/ConvertToBattlePlayerData-79227.asm) 在 resetIdCounterFlag=true 时重置该静态计数器；不能从中推出所有调用都重置，也不能把辅助计数器与正 playerInstId 的确定性构造混为一项。

**N**：[BattleCharacterData.Duplicate（79469）](../evidence/card-source-identity-20261111/allocation/native/Duplicate-79469.asm) 在 `0x180b2c164–c167` 复制原 uniqueId，不重新分配。新建数据对象、相同模板和新身份是不同事实；具体复制流程是否需要另取身份，仍应检查调用者，不能仅按对象引用判断。

### 部署复制数据身份，普通回收保留原 Card

**N**：普通 CharacterCard 的完整身份链为：

```text
转换得到 BattleCharacterData.uniqueId
  → Card 保存该数据
  → CharacterCard.SpawnInternal 把自身 Card 传给 Controller.CreateCharacter
  → Controller 读取 Card.data，创建 Character
  → 把 data.uniqueId 写入 Character.cardUid
  → BuildAt／_BuildAtInternal 仍使用同一 Card.data，接续写入相同身份

普通退场
  → Character.OnFinish
  → Controller.OnCharacterFinished 读取 Character.cardUid
  → Deck 按 m_cardMap 找已有 Card，调用 Card.OnRecycle
  → 原 Card 进入并推进自己的恢复状态
  → 再次部署时读取同一 Card.data.uniqueId
```

关键锚点：

- [CharacterCard.SpawnInternal（67060）](../evidence/card-source-identity-20261111/deployment/native/SpawnInternal-67060.asm) 传递 this；[CreateCharacter（65677）](../evidence/card-source-identity-20261111/deployment/native/CreateCharacter-65677.asm) 在 `0x18064bb34` 取得 Card.data，`0x18064bb69–bb72` 读取 uniqueId 并调用 Character.set_cardUid。
- [OnCharacterFinished（65741）](../evidence/card-source-identity-20261111/deployment/native/OnCharacterFinished-65741.asm) 在 `0x180658fa7–8fb4` 读取 cardUid 并交给 Deck；[Deck.RecycleCard（66748）](../evidence/card-source-identity-20261111/deployment/native/RecycleCard-66748.asm) 查已有映射项后调用其 OnRecycle，不在这条普通路径构造新卡。
- [Card.OnRecycle（66867）](../evidence/card-source-identity-20261111/deployment/native/OnRecycle-66867.asm)、[Draw（66861）](../evidence/card-source-identity-20261111/deployment/native/Draw-66861.asm)与 [OnTick（66909）](../evidence/card-source-identity-20261111/deployment/native/OnTick-66909.asm) 接续该 Card 的状态、份数和恢复进度，不为本次普通重部署生成新的 uniqueId。

**I**：普通同一 CharacterCard 撤退、冷却后再次部署，Character.cardUid 沿用原值。证明来自生成、字段赋值和原卡回收链，不来自 cardUid 的命名，也不依赖场上 Character 对象是否由池复用。

本结论限定于上述普通路径。删除后重新建立 Card、TokenCard 的多库存、预置创建、变形／复活、术语移动及模式替换未因此一并闭合。同模板也不能单独证明同一身份；同一数据对象或 Duplicate 保留的值，则不能仅因对象新建就解释成新来源。

### 普通撤退与死亡的结算顺序

2026-11-22 交叉核对同一 Windows x64 客户端指纹的身份、撤退、死亡和额度结算。默认模式的普通 CharacterCard 与有限 TokenCard 使用以下路径。字段、分支、消费者和复跑命令见[退场额度证据](../evidence/deployment-exit-limits-20261122/README.md)。

- **N**　允许返费时，`Character.Withdraw`（77251）在 `0x180aa97b8` 调用 `BattleController.ModifyCost`，随后在 `0x180aa97ee` 通过虚槽 117 调用 `FinishMe`。这补齐了第二节社区资料未核对的返费顺序。[Withdraw 正文](../evidence/card-source-identity-20261111/deployment/native/Withdraw-77251.asm) · [撤退虚调用核对](33-targeting-and-targetable-pipeline.md#46-来源离场后的真实群攻弹道)
- **N／I**　普通撤退和未被复活接管的 HP 归零死亡都进入 `FinishMe`，再派发 `OnFinish`。在 `Character.OnFinish` 的普通分支，`0x180aa348a` 调用地块清理，`0x180aa34a1` 清理阻挡，`0x180aa34d3` 才通知 Controller 回收原 Card。普通 UNIQUE 卡在 INUSE 状态下由 `Card.OnRecycle` 启动冷却，并按开关增加再部署费用阶段。[OnFinish 正文](../evidence/card-source-identity-20261111/deployment/native/OnFinish-77340.asm) · [死亡入口与 FinishMe](39-death-attribution-and-attribute-ranges.md#2-最终死亡怎样读取归属) · [Card 回收分支](../evidence/card-source-identity-20261111/deployment/native/OnRecycle-66867.asm)
- **N**　同卡在场计数在 `Character.OnFinish → BattleController.OnCharacterFinished → Deck.RecycleCard → TokenCard.OnRecycle` 减少。计入在场数的实例部署时增加 `m_spawnedCnt`，Card 回收时减一。有限 TokenCard 的准备资格通过 `isMaxDeployed` 读取 `m_spawnedCnt >= maxDeployCnt`。普通干员的 UNIQUE 卡使用 INUSE／RESPAWNING 冷却状态，库存和全局部署位还各有独立检查。[计数与资格调用链](../evidence/deployment-exit-limits-20261122/README.md#资格与计数)
- **N**　全局部署位在 `Unit.OnRecycle → BattleController.UnregisterUnit → UnitManager.Unregister` 归还。确认已从登记集合移除后，才从玩家部署占用计数减去该 Character 的占用量。部署资格和界面都从 `GetRemainingAvailableCharacterCnt` 读取玩家额度减占用数的结果。回收随后由 `BObject.OnRecycle` 注销对象身份。[计数与资格调用链](../evidence/deployment-exit-limits-20261122/README.md#资格与计数)
- **N／I**　`FinishMe` 在 `OnFinish` 返回后才派发 `DefaultGameMode.DestroyEntity`。普通撤退立即回收，普通死亡的对象池分支先等待角色的回收延迟。Character 构造与 Reset 默认值为 1 秒，回收协程先用该值做 `WaitForFixedSeconds`，恢复后才调用对象池回收。全局部署位已用尽时，另一张需占位的 Card 即便满足格子、费用等其余条件，也要等全局占用扣减才能部署。普通撤退在同一调用内归还额度。[退出与延迟调用链](../evidence/deployment-exit-limits-20261122/README.md#退出与延迟)

静态复查核对了普通干员的对象池创建、HP 归零原因、独立部署位计数的直接写入与正常部署提交检查。未找到早于 `OnRecycle` 的普通死亡计数扣减。2026-11-22 用户在原生客户端复测，确认干员被击倒后全局部署位延迟归还，报告未给出时长。角色特化、模式替换、复活接管与 XLua 回调按各自入口核对。 [复查证据](../evidence/deployment-exit-limits-20261122/README.md#对提前归还与实际部署入口的复核) · [实机复测记录](../evidence/deployment-exit-limits-20261122/README.md#实机复测)

### 卫戍的同名副本

同日补核 AutoChess 的棋子创建与角色数据转换，见[同名副本批次](../evidence/same-character-source-20261111/README.md)。以下仍限定于静态普通分支，不包含 XLua 替代或运行观测。

**N**：[本地训练的购买与复制](../evidence/same-character-source-20261111/content/README.md)把 chessId 交给 _AddOwnedChess；该方法递增 m_generateId，为新 CharChess 写入独立 instId。相同 chessId 可以对应不同棋子实例。这个 instId 不是直接写入 Character.cardUid 的值。

**N**：[AutoChessSquadModel._GetChessSquadConfig（81941）](../evidence/same-character-source-20261111/native/bodies/_GetChessSquadConfig-81941.asm)创建 AdvancedCharacterInst，将其 Metadata.playerInstId 设为 0；ChessInst.get_charInst 的普通分支返回共享的 chessSquad.inst。[逐实例加载（81754）](../evidence/same-character-source-20261111/native/bodies/_LoadBattlePlayerData-81754.asm)对每份 ChessInst 分别调用 ConvertToCharacterData，再把结果 uniqueId 存入该棋子的 cardUid。ApplyInstDataToSharedData 只向 Blackboard 写入棋子 instId／chessId，不覆盖 uniqueId。

**I**：接续前述 playerInstId <= 0 的递增分支，每份同名棋子分别取得不同 cardUid。共享角色模板或 Squad 配置不使它们共享身份；已核对的逐份转换调用链未见 UID 计数器重置。此处不因此补齐卫戍自动再部署或特殊重建路径。

### 召唤物与装置的部署身份

同日补核 [Token／Trap 批次](../evidence/device-source-20261111/README.md)，解决 Buff 的 independentCharacterSource 是否包含装置这一问题。当前 metadata 的实际继承链为 `Trap → Token → Character → Unit`；Enemy 直接继承 Unit，不经过 Character。Token 和 Trap 均继承 Character.cardUid。

**N**：TokenCard.SpawnInternal（67086）返回 Character，普通分支把自身 Card 传给 BattleController.CreateToken（65678）。CreateToken 在 `0x1806514b8` 读取 Card.data，`0x1806514d3` 调用 BattleFactory.CreateToken(data)，随后在 `0x1806514ed` 读取 data.uniqueId（+0x6c），于 `0x1806514f6` 调用 Character.set_cardUid；后续 `0x180651649` 调用的 Character.BuildAt 仍使用该 Card。不是按场上 Token／Trap 对象实例重新分配这个字段。

**I**：使用同一 TokenCard.data 的场上实例取得同一 cardUid；该路径下的召唤物与装置均满足 Buff 的 Character 来源判断。普通干员和装置在本问题上的差别不是“是否参与 Character 独立来源分组”。本节只闭合这一部署写入链，没有将预置、特殊运行时创建或全部多库存回收政策一并认定为相同。

### 无 Card 的预放置干员

2026-11-12 补核普通预置创建链与[固定关卡正例](../evidence/predefined-source-20261112/README.md)。镜像提交 bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d 的 level_main_08-09，在 `/predefines/characterInsts/0` 放置可见的迷迭香 char_391_rosmon；`/predefines/characterCards` 与 `/hardPredefines/characterCards` 均为空。配置与本机客户端分别注明版本，不将静态链解释为游戏运行观测。

**N**：PredefinedData 的 characterInsts、tokenInsts、characterCards、tokenCards 是四个不同字段，分别位于 +0x10、+0x18、+0x20、+0x28。GenPredefinedCardsToInject（34447）的普通分支只返回所选预置数据的 characterCards 或 null，不把 characterInsts 转为卡牌；上述空数组不会在这个入口为预放实例补造隐藏 Card。

**N**：_LoadPredefinedData（65763）读取实例数组，以 isToken=false 调用 _CreatePredefinedCharacter（65760）。普通无需预处理的路径直接调用 ConvertToCharacterData、BattleFactory.CreateCharacter 和 Character.BuildAsPredefined（77240），没有构造或登记本实例 Card；可选的现有 Card 查询分支不构造新 Card。BuildAsPredefined 以角色数据构造 BuildParam，再进入既有 _BuildAtInternal，由 data.uniqueId 写入 Character.cardUid。

**I**：普通预放置干员可以没有对应 Card，却仍有自己的 Character.cardUid，并参与 Buff 的 Character 独立来源分组。cardUid 在这里是角色数据身份，不是“已关联 Card 对象”的证明。此处不因此归纳全部预处理玩法、运行时创建、重复出现或预置退场回收政策。

### 关卡预置的实例、手卡与别名

2026-11-22 补核普通／困难配置的合成、隐藏别名以及撤回。采用固定镜像提交 `17759cc8cdf37388414145d16262a3a06f3ab25e` 和同前一批指纹的 Windows 客户端。原表 Pointer、完整方法选段和复跑命令见[预置入口证据](../evidence/predefined-lifecycle-20261122/README.md)。

| 原表路径 | 数据形态及样例 |
| --- | --- |
| `/predefines/characterInsts/*`、`/predefines/tokenInsts/*` | 继承 `hidden` 和 `alias`，另有 `position`、`direction` 和角色配置。M8-6 的迷迭香在普通实例表登记位置，两类手卡数组均空。关卡开始加载会创建非隐藏实例。隐藏项留给别名操作。 [PRTS M8-6](https://prts.wiki/w/M8-6) |
| `/predefines/characterCards/*` | 角色配置另带 `hidden`、`alias`。位置和朝向由实例配置声明。1-2 有八张可见干员卡和空实例数组。TR-1 则有两张可见卡、一张隐藏的芙蓉卡，干员实例数组为空。 [PRTS 1-2](https://prts.wiki/w/1-2) · [PRTS TR-1](https://prts.wiki/w/TR-1_%E6%88%98%E5%9C%B0%E5%8C%BB%E7%96%97) |
| `/predefines/tokenCards/*` | 类型在普通预置卡字段上另有 `initialCnt`。3-7 同时包含一个预置探测装置实例和一条 `initialCnt=5` 的障碍物卡记录。该数量属于卡配置。 |
| `/hardPredefines/characterCards/*` | TW-S-1、TW-S-2 的困难块分别有 10、12 张干员卡，普通块有隐藏干员实例、可见留声机及空的干员卡数组。两关各自的普通与遭遇阶段引用同一个关卡资源。PRTS 分别记述了遭遇固定编队及已部署干员。 [PRTS TW-S-1](https://prts.wiki/w/TW-S-1#遭遇) · [PRTS TW-S-2](https://prts.wiki/w/TW-S-2#遭遇) |

**N**　普通 `GenPredefinedCardsToInject`（34447）读普通块的 `characterCards`。模式值 2 转到 `LoadComposeHardPredefine`（34313）。困难块存在且 `options.isHardTrainingLevel=true` 时，该方法构造组合块，将困难块的 `characterCards` 整个赋值给结果，按原引用保留普通的 `characterInsts`、`tokenCards`、`tokenInsts`。由困难数组本身决定空或 null。替换发生在数组层。其余分支直接返回普通块。普通注入入口在 `isPredefinedCardsSelectable=true` 时返回 null。UI 选择流程的卡牌入口尚未追踪。既有 `CheckStagePredefine`（34446）按模式检查 `isTrainingLevel` 或 `isHardTrainingLevel`，玩家原队伍的接纳由 Converter 连同额外输入开关另行判断。见[注入与配置合成正文](../evidence/predefined-lifecycle-20261122/README.md#客户端证据)。

**N**　关卡预置别名使用 `GetAliasId`（32208），取配置 `alias`，为 null 或空串时取角色 ID。1-11 以 `char_211_adnach` 激活未填写 alias 的隐藏安德切尔实例。14-10 则以不同 alias 区分推王的两个预置位置，先撤回 `char_112_siege#1`，再激活 `char_112_siege#2`。固定镜像中的关卡的这组操作使用 `ACTIVATE_PREDEFINED`／`WITHDRAW_PREDEFINED`。有关含 `APPEAR`／`DISAPPEAR` 的路线检查点另见[路线操作](31-route-operations-and-state.md)。 [PRTS 作战机制](https://prts.wiki/w/%E4%BD%9C%E6%88%98%E6%9C%BA%E5%88%B6)

**N**　`ACTIVATE_PREDEFINED` 将 Action 的 key 交给 `TryActivePredefined`（73336）。它完成 `ActivateInternalHiddenCard` 和 `SpawnPredefinedInstanceByAlias` 两次调用后统计成功次数。一条成功时返回 true，两条均成功时记录错误并直接返回 false。前一路遍历活跃 Deck 按别名找到已有的隐藏卡，调用 `Card.SetHidden(false, hiddenKey)`。`Deck.ActivateHiddenCard`（66759）此后可返回 true，卡处理后可见时才通知 `OnCardListChanged`。TR-1 的 key `char_120_hibisc` 对应这类隐藏卡配置。后一路按别名先查干员实例数组，再查 Token 实例数组，命中后直接调用预置创建。普通 `WITHDRAW_PREDEFINED` 只在实例数组中解析别名，由 `_WithdrawPredefinedCharacter`（65761）在配置位置检查当前角色、匹配角色 ID 并要求 `isBuiltPredefined` 后结束实例。`TRIGGER_PREDEFINED` 与 `SHOW_ALL_HIDDEN_CARDS` 是独立的调度入口。见[别名调用链](../evidence/predefined-lifecycle-20261122/README.md#客户端证据)及 [Scheduler 执行器](30-scheduler-action-data-fields.md#非-spawn-执行器)。

**N**　`TRIGGER_PREDEFINED` 执行已在场对象挂载的 Ability。`_DoTriggerPredefined.MoveNext`（73538）解析 Action key，以第一段为别名，通过 `UnitManager.GetCharacterByAlias`（`0x18098f774`）查询当前对象，第二段交给 `TryFindFirstAttachedAbility` 查找 Ability（`0x18098f7d9`）。找到后在 `0x18098f89a` 调用虚槽 36，即 `Ability.CastDirectly(null, true)`。BI-EX-2 的同一 Fragment 先以 `ACTIVATE_PREDEFINED` 和 `trap_050_blizzard#1` 令暴风雪装置登场，下一项用 `TRIGGER_PREDEFINED` 和 `trap_050_blizzard#1:Right` 执行该对象的 `Right` Ability。[关卡摘录](../evidence/predefined-lifecycle-20261122/content/levels.json) · [执行器正文与类型](../evidence/predefined-lifecycle-20261122/README.md#客户端证据)

按别名找不到对象时，执行器记录错误并暂让协程，恢复后重新查询（`0x18098f945`、`0x18098f982`、`0x18098f547`）。对象存在而 Ability 查找失败时，则记录错误并进入动作完成路径（`0x18098f830`、`0x18098f89c`）。

**U**　证据范围为固定版本配置和原生静态分支。重复激活的占位冲突、隐藏原因的全量来源、预置实例结束时的 Card 回收／返费、TokenCard 的初始库存创建细节、其它模式与 XLua 替换均需各自取证。

## 未决项

1. **费用上限与多来源计算。** 已定位 `Card._UpdateCardBuff` 的费用汇总写回、凛御银灰 X3 的涨费倍率上限修正，以及野鬃减费在原始费用取整后的叠加。其他费用来源的竞争与模式特化，以及再部署计时的显示取整，仍按实际路径核对。
2. **退出阶段的剩余问题。** 普通退出返费、同卡上限、全局部署位和回收的时点已核对。贾维等具体减免的采样条件，以及特殊或模式替换的退出分支，按各自入口核对。见[普通退出结算](#普通撤退与死亡的结算顺序)。
3. **暂停与叠加。** 黑棺／莲座的暂停与显式减时、归零、临时豁免如何交互，多个锁定／封印如何组合尚未形成完整证据。银灰 X 解除修正保留本段计时的结论见第六节，适用于所查正常分支。
4. **顺序与目标资格。** [多来源重排调查](../evidence/card-ordering-20261031/README.md)尚未定位凛御银灰实际比较器的安装／撤销连接，退场恢复与多个来源的竞争规则仍未知；各策士技能是否纳入隐藏、冷却中、被封印或库存为零的 Card，也尚未逐技能闭合。只在已有明确条件的具体机制中作判断。
5. **删除、隐藏与宿主关系。** 淬羽赫默 S2 的通常窗口已查明持续使用原卡。其他附属 Card 在宿主结束时是否保留身份、库存与 CD 仍依各自实际调用核对。
6. **共享消耗与表述矛盾。** 琴柳可确认所有待部署干员共享下一次优惠，但正文与备注对激活时点的说法不一致；另一汇总页重复备注不构成独立消歧证据。本案不自行选择其中一个时序。
7. **模式与特殊部署。** 免费投递、特殊移动、卫戍初始／自动部署各有消费、资格与通知差异；源石封印对自动入口的影响、卫戍自动再部署的逐帧调度及失败组合尚未闭合。其它模式实例不构成实现范围或接口选择。
8. **入场阶段映射。** 第十节区分了卡牌携带数据、角色初始化、基础 SP 与具体出生业务，未建立全部内容统一早于某项初始化回调的证据；各机制的具体绑定和尚未闭合的条件以本轮证据范围为准。不能为了简化 Entry 接口而预先写入统一顺序。

本案集中维护待部署对象与本次场上实例的不同事实及适用条件，不规定应采用字段、规则、效果容器或何种写回 API。当前项目的代码、文档和测试不能代替上述机制证据。
