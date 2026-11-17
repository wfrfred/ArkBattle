# 发动参数变化：付款与 SP 门槛

2026-11-17。本分支统计已查技能需要改变什么，不把原生类结构、特殊资源复用 SP 或方法存在直接当作 Core 类型需求。未修改产品代码。

## 结果

新提取直接绑定 **5名干员、11个 Fever SkillID**，另核对流明S2／薇薇安娜S1两项付款差异；雷狼龙S空爆S1／S2复用已完成的原生链。以下是定向样例集合，不是全游戏技能普查。

| 机制／技能 | 付款层变化 | 本分支证明需要改变预算判别类型／整份 Activation 程序吗 |
| --- | --- | --- |
| Fever参与的11技能 | 最终发动门槛与支付豁免；同一种共同机制 | 没有。已有持续的延时与退出另由Fever程序处理，不由付款结论抹掉 |
| 流明S2「沛霖」 | 采样强化资格，再明确清空当前SP | 没有；是采样与资源操作 |
| 薇薇安娜S1「光影迅捷剑」 | 普通基础费用；已形成的蓄力mode在技能开始时另清SP | 没有；需要持久锁存事实，不能只按发动时余额重建 |
| 雷狼龙S空爆S1／S2 | 先支付首层，再按剩余SP计算充能层数、清空并增加当前持续量 | 没有；是支付／采样／清空／数值延时的顺序 |

**本分支没有取得必须替换整份 Activation 回调契约或改变字段类型的正例。** 这只限制付款／门槛结论，不否认其它程序分支可能需要不同表达。数值可采样、操作可编排，也不证明这些数值都遵守 Attribute 四段修正公式；不能由此直接选定 Contribution 或完整定义选择器。

### Fever名单与去重

| 干员 | SkillID |
| --- | --- |
| 祐天寺若麦 | `skchr_amoris_1`、`skchr_amoris_2` |
| 三角初华 | `skchr_dolris_1`、`skchr_dolris_2` |
| 八幡海铃 | `skchr_tmoris_1`、`skchr_tmoris_2` |
| 若叶睦 | `skchr_mortis_1`、`skchr_mortis_2` |
| 丰川祥子 | `skchr_oblvns_1`、`skchr_oblvns_2`、`skchr_oblvns_3` |

完整扫描本机 `[uc]skills.ab` 中具有 `_feverKey` 的组件，解析脚本后仅计 `FeverCommonBehaviour`，得到11个组件／Prefab根／实际SkillID。另两个 `FeverValidator` 不新增参与技能，不能再计两次。角色表实际skills和Skill表prefabId逐项配对，未只按资源名猜测；不宣称其它包或运行时脚本绝无额外参与者。

共同免门槛／免付SP与已有技能延时依据复用[上轮Fever完整原件](../../skill-audit-20261117/sustain/native.json)及[结论边界](../../skill-audit-20261117/sustain/README.md)。静态接入名单支持Content共同工厂处理这一规则，不要求所有普通角色程序分别识别Fever。

### 两项付款差异的实际绑定

[content.json](content.json)保留两根的完整组件、PPtr、同对象列表和四个完整Holder模板：

- 流明S2根是普通CastSkill，额外PassiveBuffAbility与BuffDuringSkill实际引用相应模板。`lumen_s_2_enhance_judge` 的安装event0先以 `CompareCharSkillAvailableCnt>=2` 登记强化，然后执行 `ClearCharacterSp`。固定满级输入每层13、容量2层。模板证明明确清空操作，不把它简写成所有技能都应使用一条统一费用公式。
- 薇薇安娜S1根是ReplacementSkillFixed，额外ToggleablePassiveBuffAbility通过SpRatioToggleChecker控制；阈值ratio=1。`_unmanagedBuffsWhenToggleOn` 安装 `vvana_s_1[mode]`，该mode在事件33（技能开始）清空SP、事件20（技能结束）结束。固定满级输入每层4、容量2层。已经形成的mode可以在余额下降后保留，所以不能无条件写成“当前SP不足两层便只付一层”；是否已锁存也是输入。当前模板与[社区说明](https://prts.wiki/w/Vvan)共同支持这一边界。

本批没有重新追踪两根全部启动回调与付款指令之间的每个阶段。通用支付与特殊操作的已知先后仍按 [Case09 §2.7](../../../cases/09-skill-mechanisms-and-requirements.md#27-原生公式复核ammosp-与具体持续时间操作)及原件解释；不将配置链当作实机执行。

### 不计为动态定义正例的项目

- 金币／魔力可以是Content私有资源。原生把它们复用到SP条，不证明项目必须提供普通SP的持久配置切换；玛露容量和初始输入还可在构造前合成。
- `SpScaleAfterSkillCast` 的方法／字段已查，但引用的材料没有闭合支持范围内实际普通技能绑定。旧 `[uc]skills` 字段扫描只得到3个琳琅诗怀雅组件，不能据此宣称全客户端不存在其它调用。
- 卫戍 `act2autochess_bond_eff_sunt` 的固定资料有 `sp_ratio=.7`，但原生绑定未闭合。[PRTS盟约记录](https://prts.wiki/w/卫戍协议：盟约_下半/PRTS盟约记录)注明在战斗开始时把所需SP降至70%、向下取整且可为0。不能仅凭主描述中的在场人数，把它算作战中持续修改普通SP配置的反例；也不把社区备注冒充本批native时点证明。

## 原件、版本与复跑

- [content.json](content.json)：本轮新解36个组件、13个固定Skill绑定、4个完整模板及去重名单。
- [result.json](result.json)：可机器读取的分类、原件指纹、名单、固定最高等级记录和明确未知项。
- [prts.json](prts.json)：当前查阅社区说明与限定，不是全文存档或官方实现证据。
- [verification.json](verification.json)：独立配置重新提取及派生统计对照。

本机资源逐文件SHA-256记录在provenance；继承使用的native为DLL `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。角色／Skill原表固定镜像为 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，原字节及Git Blob与[既有校验](../../route-operations-20261107/data-source-verification.json)核对，和本机资源分别版本化。雷狼龙S空爆的旧原体保留其原指纹与版本，不能冒充本轮重提。

```sh
python docs/research/evidence/skill-activation-variation-20261117/payment/extract.py --out /tmp/skill-payment/content.json
python docs/research/evidence/skill-activation-variation-20261117/payment/summarize.py --out /tmp/skill-payment/result.json
python docs/research/evidence/skill-activation-variation-20261117/payment/verify.py --out /tmp/skill-payment/verification.json
```

专用解码复用已归档配置工具；未运行游戏、未验证活跃XLua，不据有限选择给出全游戏比例。
