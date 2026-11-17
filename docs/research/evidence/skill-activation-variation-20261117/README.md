# Skill 发动变化的数量与表达范围

2026-11-17。先统计真实内容改变了哪些输入，再比较参数修改、Contribution 和完整 Activation.Definition 生成函数；不以任何候选 API 作为机制需求。汇总结论集中于 [Case09 §10](../../cases/09-skill-mechanisms-and-requirements.md#10-发动变化的数量与表达范围2026-11-17)。本批不修改产品接口或测试。

| 子批 | 输入、核对内容与证据等级 |
| --- | --- |
| [静态目录](catalog/README.md) | 全部1846条 Skill、1403条 Character、各等级及实际引用；232个 SkillID 与53个角色／装置记录的候选人工分类。静态描述与配置不是客户端执行证据。 |
| [预算与自动尝试](budget/README.md) | 针对提丰、棘刺、薇薇安娜、重岳等代表核对实际 Prefab 与普通 native 消费者，区分预算参数、内容阶段和触发枚举。 |
| [门槛与支付](payment/README.md) | 实际11项 Fever Skill、流明 S2／薇薇安娜 S1的采样与支付，复用雷狼龙 S 空爆两技能的已有链路；分别保留具体支付节点与限制。 |

## 版本与限制

静态镜像固定为 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，与安装资源分别版本化，各子批保留原字节指纹和实际引用。新提 native 的 DLL SHA256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata v29、SHA256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

原生静态分支、资源绑定、表内描述和项目设计判断分别记录；没有运行官方战斗或验证活跃 XLua。全表关键词搜索仍可能漏掉其他表达；模块、其他表、外部 Effect 和敌人招式不是本批全量输入。数量按 SkillID 去重，分类交叉，不相加冒充全部动态技能总数。

此前[审查批次](../skill-audit-20261117/README.md)的原始证据保持不变；其中由原生金币／魔力复用 SP 推导通用配置写入／封闭接口必需的判断，由 Case09 的本轮分类收紧。方法存在与项目需要同样的领域结构是两件事。

## 复查

各子批 README 给出独立输出路径与复跑命令。原生选择器与文件清单统一由下列命令整理，不覆盖已有客户端原件：

```sh
python .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/skill-activation-variation-20261117
```
