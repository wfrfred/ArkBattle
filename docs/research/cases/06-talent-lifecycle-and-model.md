# 天赋的运行事实与项目建模

调研日期：2026-10-13。范围是主模式代表性干员及普通引擎协议，目标是决定 Talent 是否需要成为独立 Unit Capability。这里只记录证据与建议，不修改天赋执行架构。

## 结论

官方确实有 BasicTalent 组件、Unit 的天赋集合、数据绑定、附着／分离和领域回调；部分天赋还保存专门运行状态。不能将天赋概括为静态数值，也不能以“一个 onEnter 安装 Buff”覆盖所有天赋。

项目当前建议是：保留天赋的内容选型和装配职责，按实际机制保存运行事实，暂不新增承载所有天赋私有状态的 Talent Capability。官方共同组件外壳是正面证据，但是否建立同名 Capability，还需判断项目是否存在独立的公共查询、转换与不变量责任。Effect／Hook 可以承担持续行为和介入点；复活、待部署资源、退场后生成物等事实必须归相应状态所有者，不因来自天赋就统一放进 Effect。

这项建议不是“天赋没有共用协议”的结论，也不是禁止后续增加 Talent Capability。若多个真实内容确实需要统一查询天赋实例、切换参与或重新绑定内容，应围绕这些操作建立有明确责任的模型，避免再维护一套重复的 Effect 生命周期。

## 来源与版本

- **本机官方客户端原生静态证据**：[本轮证据包](../evidence/talent-lifecycle-20261013/records.json)。输入为当前安装客户端，metadata 29。GameAssembly.dll SHA-256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`；metadata 为 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`。它们与旧 `client-excerpts.json` 不同，本案不混用旧方法索引／地址。未执行客户端或确认 XLua 现场覆盖。
- **客户端表镜像**：当时本机 `character_table.json` 与 `battle_equip_table.json` 的读取，来源定位见[批次说明](../evidence/talent-lifecycle-20261013/README.md)；仓库 main-mode fixture 的来源声明指向 [Kengxxiao 镜像 commit 17759cc8](https://github.com/Kengxxiao/ArknightsGameData/tree/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel)。本案未独立核验临时完整表与该 commit 的完整哈希，也不将表镜像与当前安装客户端绑定为同一版本。
- **PRTS 玩法资料**：用于核对具体天赋的作用对象、条件和持续方式，是社区资料，不替代原生调用链。[生效条件汇总](https://prts.wiki/w/天赋生效条件一览) 是案例入口，具体行为以各干员页面备注互证。

## 已确认的官方共同外壳

| 事实 | 本轮原生锚点 |
| --- | --- |
| Unit 与 UnitMode 各自保存 talents 数组；BasicTalent 保存 owner、内部 Ability、data 和 parentMode | Unit.OnAwake 77702、RecollectTalents 77703、UnitMode._InitTalents 77844；字段正面投影见证据包 |
| 角色配置先预处理天赋，再根据 skillIndex 和 talentKey 绑定数据；无匹配内容会标记无效 | Character._AssignData 76054、_AssignTalents 76062 |
| 数据有效与当前附着是不同事实 | BasicTalent.get_isValid 73274、get_isAttached 73275 |
| 基础天赋将数据与附着操作委托给内部 Ability | AssignData 73301、DoAttach 73317、DoDetach 73318 |
| OnInit 已有按当前模式资格附着天赋的入口，早于 OnBorn | Character.OnInit 76025、OnBorn 76027、Unit.OnBorn 77696 |
| 模式切换与重新选型可分别分离、重新绑定并附着内容 | UnitMode.OnActivate 77836、Unit.InactiveMode 77669、Character.ReassignTalents 76063 |
| 攻击前后有天赋虚回调，随后进入 BuffContainer 对应事件 | Character.OnBeforeAttack 76038、OnAfterAttack 76039 |
| 结束涉及 Buff 清理、Ability 分离及模式停用，回收另有天赋回调 | Character.OnFinish 76033、Unit.OnFinish 77689、Entity.OnFinish 66653、ClearAbilities 66639、Unit.OnRecycle 77698 |

这些是普通原生路径的结构和顺序；没有据此要求项目复制 Unity 组件、逐 Unit Update 或上述所有微时序。

## 子类状态不能抹掉，也不能推广到全部天赋

**SilenceableTalent** 持有手动附着意图；`_UpdateInternalAbilityAttachStatus`（73543）根据配置及宿主的沉默／结束状态决定内部 Ability 的实际附着。它证明需要表达特定内容的参与条件，不能据此规定所有天赋都响应沉默。

**RebornTalent** 持有最大复活次数、已使用次数及复活数据。`CheckReborn`（73528）通过条件后立即增加自己的计数及 Entity 的计数；`Unit.OnHpZero`（77704）在 `!skipReborn` 时先尝试 `Unit.CheckReborn`（77683），后者按附着资格选择并在首个成功结果后返回。复活的次数与结算位置是运行事实，不能由静态参数或已安装 Buff 名称替代。所有计数是否跨撤退／普通复活保留尚需逐机制核查。

**AppearTalent** 的 `_OnBorn`／`_OnLocate`（73269／73270）按配置选择出生或定位时调用内部 Ability。登场动作是一类天赋的行为，不是全部天赋的统一发动方式。

## 代表性主模式需求

| 案例与来源 | 区分出的事实 | 项目应接入的职责 |
| --- | --- | --- |
| [玫兰莎](https://prts.wiki/w/玫兰莎#天赋) | 配置选定的常驻攻击加成 | 参数选择；Offense Contribution 与常驻内容激活 |
| [泥岩](https://prts.wiki/w/泥岩#天赋) | 部署时初始盾层、周期补层与破盾回复；层数耗尽仍保留同一 Buff | Effect 私有层数／计时，时间推进与受伤 Hook |
| [风笛](https://prts.wiki/w/风笛#天赋) | 攻击概率机制、编队初始 SP，以及模组追加的自身部署 SP | 攻击准备／目标规则、战斗编队政策与 Skill 初始化、部署操作 |
| [银灰](https://prts.wiki/w/银灰#天赋) | 编队再部署修正与场上反隐作用域不同 | Deployment／待部署状态；Aura 与 Status |
| [砾](https://prts.wiki/w/砾#天赋) | 在场加防与部署时缩短其他干员剩余再部署计时是两种操作 | Defense Aura；部署时的一次计时转换 |
| [伊内丝](https://prts.wiki/w/伊内丝#天赋) | 目标标记依赖本次部署身份，退场后影哨继续存在 | 伤害后介入、来源身份与标记；独立战场生成物 |
| [玛露西尔](https://prts.wiki/w/玛露西尔#天赋) | 魔力整场保留，进场转为技能 SP、离场转换回魔力，场下仍回复 | 持续的待部署对象／战斗资源状态与场上 Skill 转换；不能仅存于离场即删除的宿主 Effect |

编队由 Meta 提供，但本场战斗的编队效果、待部署状态及部署参数仍应由 Tactical 的对应规则落实。把天赋标成 Meta 内容，不能替代这些战斗内转换。

原表的天赋候选承载解锁条件、潜能要求、prefabKey 和黑板等；模组可替换指定 talentIndex，也可新增隐藏候选。槽位用于选型，不直接证明玩家可动态选择天赋或需要固定运行槽数。表中未提供统一运行状态，不等于 prefab／代码没有专门状态；RebornTalent 的次数计数是直接例子。统一冷却规则仍未证实。

## 对当前实现的判断

当前 `onEnter(state, unitId) → state` 表示新战场实例注册后激活内容。泥岩与玫兰莎在此安装天赋 Effect 是可行接入，但这两个案例只能证明本次登场激活路径，不能证明天赋全生命周期已经接入。

需要逐功能完善的入口包括：编队规则、部署与退场、攻击准备、状态参与变化、HP 归零前的复活判断、独立生成物以及待部署资源的转换。是否抽出独立 Talent 内容模块，可以按这些真实用途推进；不先添加一个空的 TalentState，再让它转发所有领域操作。

Effect 私有状态可以保存护盾／标记／计时等持续机制；Capability 提供对应领域 Hook。对于需要跨退场保存或由多个对象共享的事实，先确定其生命周期与所有者，再决定是否形成新 Capability。官方 Talent 的内部状态不能一律搬进 Unit.effects，也不应复制一份 Talent 与 Effect 状态互相同步。

## 未闭合的事项

- 全部具体天赋 prefab 子类与主模式／卫戍模式可达链尚未穷尽；本案不宣称支持全部内容。
- 模式切换、假死复活、撤退重部署时，各机制的计数和目标身份如何保留，需要对应内容案例。
- 现有两个接入案例尚未验证编队效果、场下状态或天赋参与切换。
- 动态重绑天赋若成为项目目标，需要明确来源身份、旧实例结束和私有状态保留协议；官方 ReassignTalents 调用本身不能替项目决定这些政策。
- 当前客户端与旧调查版本的 hash 不同；本案的新地址仅用于本案输入，不倒推旧模板的所有执行路径。
