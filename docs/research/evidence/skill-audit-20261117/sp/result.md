# SP 审查结果

本页区分已证原生、当前表达能力和真实阻碍，不以静态配置没有 Contribution 推导必须增加动态查询。

## 1. 充能、门槛、支付和持续期扣费

原生 `SpData.get_maxSp#33512` 将每层费用与最大充能次数相乘；`BasicSkill.get_spEnough#73830` 独立解释最低门槛与无 SP 发动政策；`ReduceSp#73900` 又有本次支付与跳过扣费分支。普通余额写入在 `DoSetSpInternal#67631` 限制到当前容量。付款先后仍由具体 Skill 程序决定，旧完整例子见 Case09 §2.7，不能统一成一种原生顺序。

当前可以自然表达：

- 多次充能用 `capacity=N×单层费用`、`requirement=单层门槛`，每次只支付该次费用；余额本身已保存充能事实，不需再维护一份层数。
- 流明S2清空当前 SP、薇薇安娜S1只支付基本费用，可由本次 `Activation.cost` 分别取余额／固定量；它不修改最低门槛。
- 蓄满后保留强化模式，可由持久 Skill.state 和 Effect 表达，不把历史压回当前余额。
- 玛露西尔持续期间逐次扣魔力，已有 `pay`／明确 `modify` 和内容程序；不必把每次扣费伪装成新 Activation。

这些能力不等于整个角色已接入；本轮没有验证每种强力击中断／返还时点。

## 2. 运行期配置提交是真实需求

琳琅诗怀雅三个实际 Skill 根组件均启用 `ModifySpDataAfterSkillCast`，配置 `_spCost=0`、`_resetWhenSkillEnd=true`；S3由普通 SP 状态切入金币状态。`OnCastSucceed#86815` 保存旧费用后修改，`OnSkillEnd#86816` 按配置恢复，`_ModifySpData#86818` 提交 `Entity.UpdateSpData#67606`。天赋程序还明确清空余额、设置金币容量和补入金币；不能把这些写入藏进容量查询。

普通 `Entity.UpdateSpData` 更新派生 maxSp 和控制器配置；它不清空余额或按比例换算。`set_maxSp#67441` 本身也不做余额清算。`SpController.UpdateSpData#67747` 的 `onlyUpdateSpCost` 区分仅费用更新与类型／increment更新，后者维护自然回复计时。

当前 `Definition.sp` 的 capacity／requirement／cost／recovery 是静态配置，SP.state 没有当前配置，也没有合法配置修改入口；`setState` 只写私有 S。重建 Definition 会改变持久 Ref 的身份，跨领域直接重建 skill 也违反状态所有权。故这是明确的 Core 写入边界缺口，不能靠更多 cost 回调或动态 Contribution 自然补齐。

最小需求是允许内容在明确事件中提交当前 SP 配置，并分别安排余额结算；不要求每项配置成为贡献系统。若支持恢复类型替换，还需维护现有 ACTION／HIT 监听和 TIME 进度，但本轮 `[uc]skills` 样本未闭合非默认类型替换的实际内容，不能据支持方法存在虚构例子。Fever 的免费发动及门槛／付款豁免由同批其它专项核对，不以改默认 cost 代替内容自己的付款公式。

## 3. 阻回与封闭普通 SP 增减有不同消费者

这是当前真实许可缺口，不能仅当作没有接入一个异常 Effect。

当前玛露西尔天赋实际装 `marcil_t`。事件33为 `ON_SKILL_START`，登记派生 `marcil_sp_no_decrease`，异常为 `SP_MODIFY_STOPPED`；事件20 `ON_SKILL_FINISH` 撤销。她自己的周期／攻击扣魔力节点明确 `force=true`。

同指纹 `Entity.DoApplyModifier#67683` 的 SP 分支：

1. `0x18072349a..49d`：force=true 跳过封闭检查。
2. `0x180723507..523`：非强制读取异常29 `SP_MODIFY_STOPPED`，成立则拒绝，不区分增减方向。
3. `0x180723536..599`：后续另查 force 和普通阻回；阻回时仍允许负 finalDelta，拒绝非负增量。

普通减 SP 有实际来源：标准角色凋亡 `ep_break_dark_char → sp_loss → modify_sp[trigger]`，最终节点 `force=false`，黑板 `sp=-1`。它与玛露西尔封闭的组合结果由真实配置及普通消费者共同推出，本轮没有运行两者同场测试。

当前 `sp.modify` 只在正 delta 且非 forced 时调用回复限制；负 delta 总能继续。因此 `recoveryRestrictions` 既挡不住普通负 modify，也不能准确替代独立的 modifier 封闭。`recover`、普通／强制 `modify`、合法付款应保留各自政策；不应在 `spModified` 后回滚已公布的错误结果。

## 4. 跨部署魔力已有自然的持久载体

实际 `PeriodModifySharedDataBbTalent` 为玛露西尔绑定：period=1秒，valueKey=mana、addKey=mana_add、maxKey=mana_max、initKey=mana_init。`CreateHoldDataModifier#74804` 将 `Character.sharedData` 交给场下修改器；`Character.get_sharedData#77215` 读取 `BattleCharacterData.shared`，其中保存共享黑板。

`SharedDataBbModifier.OnTick#74809` 接收 Deck/Card；State.USING=2时使周期无效，其余状态按配置周期推进，写入 `min(mana+mana_add,mana_max)`。再次离开USING时重新建立完整周期，不把部署期间时间积攒成场下补算。`marcil_t` 的事件12先从共享黑板取魔力，再清 SP／提交所需配置／强制恢复余额；事件4按自身 clearSp 条件选择余额或零，再写回共享黑板。不能概括成任何退场都无条件保留。

初始值不能直接采用 Talent 原始默认。实际 UnitDataFlowConfig 将所选 Skill 的 mana_max 写入天赋，并合并第二天赋与所选 Skill 的 mana_init。所选固定满级三技能的 mana_max均80、技能初始量分别25／10／40，精二第二天赋另提供25。原始 Talent 的100／0不是这些合成结果。

当前可用 Card.state 保存持久魔力，Card.onTick 组织场下计时，Unit入场／离场程序通过公开 Card.setState 和 SP操作双向同步；查询部署历史 Ref 可判断当前实例是否仍登记。Card本来就跨部署存续，没有证据要求Core再新增第二种Mana资源或保存退出Unit。这里的卡牌／SP配置／具体触发尚未实现，不等于持久状态结构缺失。

## 5. 收敛范围

已证最值得补的公共能力是：当前 SP 配置的合法提交，以及与回复限制分开的普通 SP modifier 许可。充能计数、动态实际付款、途中支付、阈值锁存和跨部署保存已有直接组织方式；没有必要因这些案例增加多项动态贡献或通用原生脚本解释器。

恢复类型切换的非默认实际使用、每种特殊支付先后、技能切换调用者的额外清空／补入仍须据具体内容分别核对；本轮不把有限资源扫描零命中宣布为废弃，也不由方法存在推导项目必须照搬全部接口。
