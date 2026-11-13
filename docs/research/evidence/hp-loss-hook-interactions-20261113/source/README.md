# 来源计算修正与生命流失：定向排查

2026-11-13。问题是：是否有实际内容要求同为生命流失的两笔计算，对同一来源机制采取无法用业务资格表达的相反政策。本批没有找到这样的闭合反例；原生开关不同本身不构成反例。

## 保存的证据

[aak-loss-and-attack-scale.json](aak-loss-and-attack-scale.json) 新解码安装客户端的 Buff Holder 与阿的两项组件，保留源 Bundle、原始对象与脚本指纹：

- Holder 共 9054 个模板；事件 14（来源 OnCalculateDamage）共有 205 项，保存模板索引及直接动作节点类型。
- `char_225_haak/Trait`（PathID `3868378729437944045`）每秒触发一次 `haak_tr`，使用 `periodic_damage_by_hp_ratio[skip_modifier_fix][undeadable]`。其动作是 PURE `DamageViaMaxHpRatio`、skip=true、非致命；来源存在时采用关闭来源计算事件、开启目标计算事件的构造分支，原生方法证据复用[生命流失批次](../../hp-loss-settlement-20261113/README.md)。
- `char_225_haak/Talents/1`（PathID `3956923551127066861`）通过 `_additiveActiveBuffs` 接入 `haak_t_1`。其开始程序先结束旧 `haak_t_atk`，然后随机创建一个效果并结束自身；随机分支之一是在 BUFF_SOURCE 上创建 `haak_t_atk`。
- `haak_t_atk` 的事件 14 只有 AtkScaleUp，未配置 ApplyWay、弹道或 NONE ApplyWay 过滤。它的 lifeTimeType 为 INFINITY、triggerLifeType 为 IMMEDIATELY；创建节点未将其绑定为父 Buff 的派生效果。
- 静态 Character 配置中，阿特性的 hp_ratio=0.01，天赋倍率 atk_scale=1.5。该表复用 `Kengxxiao/ArknightsGameData@17759cc8cdf37388414145d16262a3a06f3ab25e` 的已存输入，指纹与版本记录见[原输入归档](../../unit-audit-20261110/operator-config/configuration.json)。

**阿仍是未闭合候选。** 上述配置不能证明 `haak_t_atk` 在周期自损发生时仍然有效：它可能只覆盖当次攻击的同步计算窗口。INFINITY 不能证明跨出该窗口，IMMEDIATELY 也不能单独证明立刻结束。本批没有完成该安装／触发／清理链，因此不声称自损能与倍率实际相遇，不把“1% 变 1.5%”当作已证玩法结果或架构反例。

## 排查边界

除所存阿摘录外，本轮还定向查看华法琳、史尔特尔、红隼、领主·Sharp 的 Character Prefab 和相关模板，未保存整包转储：

| 候选 | 不能作为反例的原因 |
| --- | --- |
| 史尔特尔 | 固有熔火配置为属性穿透；S2 暴击模板与 S3 流失不能仅凭同角色名字视为可同时生效。未找到需要相反 LOSS 资格的来源修正链。 |
| 红隼 | 事件 14 的天赋暴击有实际 Character 绑定，但 `rfalcn_apply_damage` 法术 skip 模板未在本次所查 Character／模板引用中闭合到启用入口。不能仅凭模板存在组成组合。 |
| 领主·Sharp | 模组附加法术 skip 节点存在，但所查固有天赋配置没有来源事件 14 修正；没有闭合会改变该笔流失的计算程序。 |
| 华法琳 | 所查 Character 主要给出 SP 天赋；S2 在公共技能资源中的完整绑定与来源关系没有在本批继续追踪，不能据此宣称与任意来源计算天赋形成了组合。 |

检索没有穷举全角色、公共技能、模组、玩法全局 Buff 或所有临时来源修正，也不由未命中推导全局不存在。当前结果不能推翻统一 Calculate／Apply 加业务资格的模型，也不能证明所有流失的计算程序天然完全相同。

## 复跑

仓库根目录：

```sh
batch=docs/research/evidence/hp-loss-hook-interactions-20261113/source
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline "$batch/extract.py" \
  --character-table .cache/native-research/unit-audit-20261110/operator-config/character_table.json \
  --out .cache/native-research/hp-loss-hook-source-replay
python .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
```

脚本只归档上述两项组件及三个模板，不输出五个 Character 的整包转储；保留完整来源事件 14 索引用于复查本轮的候选范围。没有新原生实现结论或游戏内实测。
