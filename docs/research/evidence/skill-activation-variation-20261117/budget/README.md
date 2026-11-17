# 初始持续预算与自动尝试：五个实际例子

2026-11-17。核对提丰 S2、棘刺 S3、薇薇安娜 S3、重岳 S3，以及假日威龙陈 S2 的蓄力弹药，不以原生组件数量决定项目接口数量。配置、普通 native 消费者与架构判断分别记录；没有运行游戏或核实活跃 XLua。

## 输入与复跑

- [content.json](content.json)：安装 `[uc]skills.ab` 的五个完整技能层级，共40组件；Holder 中五个角色前缀匹配的63个完整模板；固定第三方镜像的五个角色与技能记录。镜像固定为 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，与安装资源分别版本化。
- [chen2.json](chen2.json)：单个假日威龙陈 Prefab 的角色模式、S2／S2+完整攻击层级，共26组件，补齐模式到计数器的引用。
- [native.json](native.json)：10种相关类型的完整声明方法／字段清单及24个完整方法体，包含选 Buff、读取持续时间、按历史次数改黑板、远程触发技能和弹药基础容量的实际消费者。
- [result.json](result.json)：逐例分类及推断限制。

当前 DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata v29，SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。完整输入与工具指纹保存在两个原件中。

```sh
python3 docs/research/evidence/skill-activation-variation-20261117/budget/content.py \
  --out /tmp/skill-variation-budget/content.json
python3 docs/research/evidence/skill-activation-variation-20261117/budget/chen2.py \
  --out /tmp/skill-variation-budget/chen2.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/skill-activation-variation-20261117/budget/extract.py \
  --out /tmp/skill-variation-budget/native.json
```

复用已有配置解码器和完整 native 区间读取器，依赖及指纹均入原件；角色表／技能表需已有固定缓存。完整方法区间截至下一已知 native 入口，虚方法／delegate 另核，不将非局部跳转自动解释为当前方法。

## 五例的实际差别

| 实际绑定 | 已证变化 | 对项目表达的要求 |
| --- | --- | --- |
| 提丰 `char_2012_typhon → skchr_typhon_2`；ActiveOneOfBuffAbility `3542518838190549402` | 首轮 Buff 为 LIMITED，durationKey=first_duration，固定满级20秒；后续 Buff 为 INFINITY。 | 初始 Sustain 能按本单位历史轮次选择 TIME／INFINITE；输出程序按该轮阶段选择相应模式。 |
| 棘刺 `char_293_thorns → skchr_thorns_3`；ActiveOneOfBuffAbility `7317592448744409754` | 首轮 Buff 为 LIMITED，表持续30秒；后续为 INFINITY。满级黑板中后续 ATK／ASPD 也由0.6／25变为1.2／50。 | 持续预算变化与效果参数变化分属预算和内容，不能把每项数值都算作一套新 Skill 程序。 |
| 薇薇安娜 `char_4098_vvana → skchr_vvana_3`；BuffDuringSkill `6309311734724081776` | `vvana_s_3[check]` 按已触发次数选择 duration／enhance_duration 写入 duration_plus；满级为15／25秒，第二次起增强。ActiveBuffAbility 的 Buff 明确读取 duration_plus。 | 初始 TIME 数值按本轮事实求值；范围、连击等由同一内容程序依据持久阶段组织。不是第三次才增强。 |
| 重岳 `char_2024_chyue → skchr_chyue_3`；CastSkill `2844935836317647743` | 第五次后模板建立周期0.03秒的 `chyue_s_3_trigger`，执行 TriggerSkill；表 skillType 始终为 MANUAL，Prefab `_useTriggerInManualMode=true`。 | 自动尝试是内容政策变化，不是必然将手动触发身份改成 AUTO；技能动作和强化阶段由内容保存。 |
| 假日威龙陈 `char_1013_chen2 → skchr_chen2_2`；CastSkillWithLimitTimes `-2854407699123930724` | 普通 S2 与蓄力 S2+ 使用不同计数器，初始基础容量分别8／20，额外黑板键为 another_trigger_time。 | 在应用外部 Ammo 容量修正前，先选定本次基础预算；不是一项固定追加12发的贡献。 |

## 消费链

`ActiveOneOfBuffAbility.OnSpellStart #93017` 使用 `m_spellCnt`（字段偏移0x178）选择基本／额外 Buff 列表；基本路径或额外路径均递增次数。额外列表使用 `ActiveBuffAbility.DoOnSpellStart #92986`，再经 `SetLifeTime #92985` 和 `Ability.UpdateCooldown` 提交该次持续预算。选择器不是把时间简单强制写为固定常量。

`SetLifeTime #92985` 从 Ability 黑板读取基础 duration，逐项调用 Buff.FetchDuration 并处理有限最大值／无限分支；`ActiveBuffAbility.OnSpellStart #92984` 在 `_updateLifetimeWhenSpellStart` 为真时重新求值。薇薇安娜的实际组件启用该选项。

薇薇安娜的 `BuffDuringSkill.OnSkillStart #86695` 安装 `vvana_s_3[check]`；其中 `FilterSkillTriggerdCnt.Execute #101776` 读取当前 Skill 的 triggerCnt，`ModifyAbilityBlackboard.Execute #102021` 将所选黑板值写入 Ability 黑板。因此15／25不是仅写在技能描述中的未消费字段。

重岳的 `TriggerSkill.Execute #100905` 在所配 `_checkBeforeTrigger=false` 路径调用 `Character.RemoteTrigSkill #77245`；后者核对普通触发资格，调用技能操作，不改写 SkillData.skillType。实际创建的周期 Buff 已在配置中闭合，不能把所有“自动使用”统称触发类型转换。[重岳说明](https://prts.wiki/w/重岳#技能)亦明确保持手动触发性质。

### 假日威龙陈的20发是基础值

`chen2_s_2_enhance_judge` 检查可用充能数是否至少2，成立时创建 enhance_mark；`chen2_s_2` 随后按该标记切入索引3的 S2+，否则索引2的普通 S2。两条 Mode 的攻击分别绑定各自的并行攻击组。

- 普通计数器 `-7744896943474643899`：`_useAnotherBBKey=false`，`_triggerTimeCount=8`。
- 蓄力计数器 `-7347793712462205883`：`_useAnotherBBKey=true`，`_triggerTimeCount=20`；固定技能表同时提供 `attack@another_trigger_time=20`。
- Skill 配置 `_fetchFromMainAttack=true`，额外模式索引为2／3。`_FetchCounterSource #74182` 取得对应 Counter；`_UpdateMaxAdditionCount #74183` 再应用独立容量追加。
- `AbilityEventCounter.SetData #96414` 在 `0x18100505b..509a` 把所选配置／黑板整数写入 `m_maxCount`（0x4c），在 `0x1810050c8..50cb` 复制到 `m_originalMaxCount`（0x50）。`get_originalMaxCount #96412` 直接读取后者；容量追加另存 `m_maxAdditionCount`（0x54）。

因此20是本次原始预算 B，不是 addition=12。已核容量公式的比例项以 B 为基数；不能为了复用现有固定 B=8 的入口，把这项原生选择擅自改写成一个固定追加。这里没有声称任何特定比例加成与本技能的实战组合已经观测。

## 对接口选择的有限结论

这五例支持三种初始预算变化：TIME数值变化、TIME／INFINITE选择、AMMO基础数量选择；另有一种自动尝试政策变化。其实际差异集中在预算及具体效果／动作的阶段参数，没有初始化方式、运行程序、结束程序和操作支持成组更换的正例，因此这些代表采用较窄求值是直接的组织方式；不是因“任何程序都能塞进一个 if”便否定独立 Definition。

仅针对这些已证需求，可求值的 Sustain 已足够；整份 Activation.Definition selector 是更广的 API 取舍，不能称为原生强制要求。也没有多个外部来源同时竞争整个初始预算的正例，不能据这些轮次分支推出 `Contribution<Activation.Definition>`。

AMMO数量的真实多来源叠加另有[隐现／蕾缪安证据](../../skill-parameter-formulas-20261029/README.md)：固定追加、比例归并和发动采样已有公共容量模型。陈 S2 补充的是修正前基础 B 的选择，不是新的追加公式，也不证明所有持续字段都应采用同一 Contribution 公式。

本结论限定所选五个代表和既有 Ammo 正例，不证明全游戏不存在更换执行程序的机制。社区交叉核对见[提丰](https://prts.wiki/w/提丰#技能)、[棘刺](https://prts.wiki/w/棘刺#技能)、[薇薇安娜](https://prts.wiki/w/薇薇安娜#技能)与[重岳](https://prts.wiki/w/重岳#技能)；陈 S2 由原表、当前 Prefab 与 Counter 消费者闭合。
