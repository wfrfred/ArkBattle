# 普通程序与 HP 流失的实际交互

2026-11-13。只核对华法琳 S2、乌尔比安受伤回血、雷蛇回 SP，以及若叶睦 S2 的自伤分类；没有运行客户端、穷举角色或修改 Core。

## 结论

这几项没有构成“统一 HP Damage Calculate／Apply，加 `nature`”的模型反例。普通伤害程序按 `nature === "DAMAGE"` 选择参与，就能保留所查 LOSS 的排除效果。但 `nature` 不能替代其他已经存在的独立资格，尤其 `ignoreForSp`。

| 实际组合 | 原生结果与证据 | 对方案的判断 |
| --- | --- | --- |
| 华法琳 S2 选择乌尔比安 | S2 的实际技能组件给目标安装 `bldsk_s_2`，使用 `periodic_damage_by_hp_ratio[skip_modifier_fix]`；节点为 PURE、skip=true 的 `DamageViaMaxHpRatio`。乌尔比安 Default／技能模式使用 `ulpia_t_2`；其回血只在普通 OnTakeDamage 的 Buff.Event10 运行。所查 LOSS 不进入该入口，因此不触发这次回血。 | 乌尔比安的 Receiving 程序只参与 DAMAGE，自然排除 LOSS。无需因此拆开另一套提交或接收协议。若无条件执行回血，当然会改变血量；那是参与资格写错，不是统一管线表达不了。 |
| 活性源石同时影响乌尔比安、雷蛇 | 实际 `tile_infection` 使用 `periodic_damage`：PURE、环境、`ignoreForSp=true`、`damageWithoutModify=false` 的 NoSourceDamage，走普通 Damage 应用。普通 OnTakeDamage 只跳过基础 HIT 回复，仍执行 Event10；乌尔比安回血程序内部没有 ignoreForSp 过滤，因而仍参与。雷蛇的真实天赋类另查 ignoreForSp，因而不回天赋 SP。 | 两者都处理 DAMAGE，参与结果仍不同。必须保留已经确认的 SP 回复资格，不能把“普通伤害”和“允许 HIT／雷蛇回 SP”压成同一个 nature。这个事实原本就存在，并非引入 LOSS 才产生的新系统需求。 |
| 华法琳 S2 选择雷蛇 | S2 为 LOSS；雷蛇依赖普通 OnTakeDamage 末尾的 Entity.Event12，skip 不派发它。 | 以 DAMAGE 为前提的雷蛇程序也排除 LOSS。这里不是要求旧协议里增加一个 Applied 通知。 |

雷蛇的原生通知具体位于**接收末尾、HP 提交之前**；将其放到项目的哪个既有语义位置由内容迁移决定。本材料没有把 Entity.Event12 改名为 Applied，也不以这次调查恢复原生所有阶段。

### 自伤不等于 LOSS

若叶睦 S2 的真实技能 Buff 绑定 `mortis_s2[self_damage]`。其事件61先检查 IsDamage、排除带 `char_mortis_self_mark` 的目标，再对自身执行 `FixedValueDamage(MAGICAL, skip=false)`。本体的实际 Passive 给自身登记这项 marker。因此：

- 这笔自伤属于普通 DAMAGE，而不是 LOSS；不能按 `source === target`、技能自扣 HP 或文案“自伤”推断 nature。
- `nature` 只提供通用性质。防止这项自伤递归触发仍使用目标的既有内容身份／标记，不需要为它增加新的通用 Damage 标志。
- 本批没有重新核实其所有 Fever、免死、替身切换组合，也不据原生事件61推翻项目的已定时序。

## 证据链

`bindings.json` 保留当前 Bundle 指纹、CAB／PathID、对象原件 SHA-256、层级、Buff 描述与完整选定模板。所有选中组件的 MonoScript PPtr 均解析到真实脚本：

| 对象 | 身份与实际类型 |
| --- | --- |
| 华法琳 S2 应用能力 | `battle/prefabs/[uc]skills.ab`，PathID `5978367411090055933`；`AnimatedActionToTargetAbility`，`_activeBuffs` 指向上述 LOSS 模板；Selector 选择友方、排除自身后追加自身。 |
| 乌尔比安 Default 的回血天赋 | `charpack/char_4145_ulpia.ab`，PathID `-4043021218200161826`；`PassiveBuffAbility`，绑定 `ulpia_t_2`。 |
| 雷蛇第一天赋 | `charpack/char_107_liskam.ab`，PathID `-3509970960733692657`；`TriggerWhenTakenDamageAbility`，触发时施加 `modify_sp[start]`，`_alwaysIncludeSelf=true`。 |
| 若叶睦 S2 的来源程序 | `battle/prefabs/[uc]skills.ab`，PathID `-4455387707468489346`；其中登记 `mortis_s2[self_damage]`。 |
| 若叶睦自伤递归排除标记 | `charpack/char_4183_mortis.ab`，PathID `4491222975411326787`；Passive 登记 `char_mortis_self_mark`。 |

`native.json` 新提取实际雷蛇类及 NoSourceDamage 等必要方法：

- `TriggerWhenTakenDamageAbility.OnAttached` 94989：`0x180fce95b` 用 Entity 事件12登记监听。
- `_OnTakeDamage` 94991：`0x180fcebdb` 检查取消；`0x180fcebe4` 检查 snapshot 中 ignoreForSp；通过后 `0x180fcebef` 执行 OnTrigger。
- `NoSourceDamage.Execute` 99151：`0x181103ff5` 走无来源计算，形成 Modifier 后再应用；所选配置不采用 skip Modifier。

共同应用主体复用同指纹 [HP 流失批](../../hp-loss-settlement-20261113/README.md) 的 `native.json`：

- `Entity.OnTakeDamage` 67709 在 `0x18072bb41` 检查 `ignoreForSp`，成立则跳至 `0x18072bbc5`；仍于 `0x18072bbe1` 调 `BuffContainer.OnTakeDamage`，此入口派发 Event10。
- 普通接收末尾在 `0x18072bd7b`／`0x18072bd83` 发出 Entity.Event12。不能将同数值的 Entity 事件与 Buff 事件混用。
- Modifier 字段 `ignoreForSp` 的 unboxedOffset=56，与雷蛇回调复制的 snapshot 栈位置一致；不是根据字段名推断门控。
- skip 走独立接收、跳过普通 OnTakeDamage／普通后置的路径，见该批案例11第6节；没有因为统一模型就要求所有 Hook 都无条件响应 LOSS。

活性源石的真实 Tile 绑定与版本复用[地形材料](../../unit-audit-20261110/control-terrain/README.md)及[空间研究第5节](../../../03-space-units-and-mechanisms.md#5-地形配置与实际机制)：`tile_infection`→`periodic_damage`，一秒周期、ignoreForSp=true；本批没有将它误称为 SKIP 型生命流失。

PRTS 仅作社区内容线索：

- [华法琳](https://prts.wiki/w/Warfarin)：S2 影响自身与范围内随机友方，每秒流失最大 HP 的3%。
- [乌尔比安](https://prts.wiki/w/乌尔比安)：回血在正式扣血之前，普通闪避／抵挡不自动阻止触发。
- [伤判效果](https://prts.wiki/w/伤判效果)：雷蛇回 SP 与成功受伤的关系。
- [若叶睦](https://prts.wiki/w/睦)：S2 自伤及对若叶睦本体的排除说明。

本轮这些网页通过搜索正文核对，未保存整页快照。关键参与条件以上述本机绑定与方法为主，不把社区文案当作客户端调用顺序证明。

## 复跑与范围

```sh
python docs/research/evidence/hp-loss-hook-interactions-20261113/output/extract.py \
  --out .cache/native-research/hp-loss-hook-output-replay
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/hp-loss-hook-interactions-20261113/output/extract_native.py \
  --out .cache/native-research/hp-loss-hook-output-replay/native.json
```

默认客户端路径为 `/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`，可用 `--game` 覆盖。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；资源包另存完整哈希。

本批证明这些真实配置可以组成上述场景，没有现场运行组合。它不证明所有来源输出或生命流失分支都可统一过滤，也没有找到必须放弃统一 Calculate／Apply 的玩法反例。来源／目标计算事件的参与差异仍以各实际构造分支为准，不由 nature 或 source 是否为空代推。
