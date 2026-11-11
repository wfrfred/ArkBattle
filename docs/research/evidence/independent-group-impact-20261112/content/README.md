# 来源独立分组的实际配置覆盖

核查日期：2026-11-12。问题是将来源独立组简化为 Card 身份、无 Card 时的 Unit 身份及空来源组，是否改变实际内容。只读本机静态资源和 metadata，不修改 Core，也不把配置扫描解释成游戏运行观测。

## 范围与结果

`records/holder.json` 完整扫描本机 `config/buff_template_holder.ab`：9054 个模板中有 69 个模板、97 项 `independentCharacterSource=true` 描述。这 97 项均为 `loadFromDB=false`，所以其来源独立标记不是待由 BuffDB 覆写的默认占位值。保存模板定位与字节哈希、描述分组字段、直接创建节点的 owner／source 选项；没有复制其余模板程序。

`records/enemy-prefabs.json` 扫描当前安装的全部 38 个 `battle/enm_pfb*.ab`。共访问 53528 个 MonoBehaviour；11740 个对象的序列化布局包含该字段并完成解码，失败 0。其嵌入 Buff 描述中 `independentCharacterSource=true` 为 0。完整输入指纹和计数保留在该文件。这不等于敌人永远不能通过模板、代码、BuffDB 或热更新创建来源独立 Buff。

## 两个非普通干员名字的候选

只保留 `records/candidates.json` 中的两份必要模板动作、实际绑定／验证器和相关枚举值；不从模板名称推断来源类型。

| 候选 | 已核实的创建关系 | 对本次身份简化的意义 |
| --- | --- | --- |
| `vampir[light]` | `enm_pfb_35.ab` 的 `enemy_6034_vampir/Talents/DimLight` 是 GlobalAuraAbility，实际携带该模板。其目标验证器 professionMask=8；当前 metadata 中 8=MEDIC。模板把 `vampir[light_count]` 加到 BUFF_SOURCE，明确以 BUFF_OWNER 为特殊来源。 | 独立计数标记虽然位于 Boss 身上，来源是光环覆盖的医疗干员，而不是 Boss。不能把它当作 Enemy 来源按 Unit 身份拆组的反例；普通 Card 来源和无 Card 预置医疗来源都仍各自独立。 |
| `halfidle_damage_scale[stack]` | `globalbuffs.ab` 有同 key 的 GlobalBuff，目标 professionMask=639，为 WARRIOR、SNIPER、TANK、MEDIC、SUPPORT、CASTER、SPECIAL、PIONEER 的组合，不含 TOKEN／TRAP。安装模板的事件 11（ON_OUTPUT_DAMAGE）以 MODIFIER_SOURCE 为来源，在 MODIFIER_TARGET 上建立来源独立标记。 | 标记按输出伤害的干员区分；把 Card 归一、无 Card 干员按 Unit 区分仍保持这些来源之间的分隔关系。这里核实资源绑定与动作语义，不声称已执行整个“次生预案”活动或闭合其所有触发条件。 |

`electric_building[amplifier]` 等名字也出现在清单，但装置不能仅因不是普通干员就归入 Enemy；原生 Trap 属于 Character，见既有 [装置来源调查](../../device-source-20261111/README.md)。本批没有把未知创建路径或用户排除的生息配置当作实际损失。

在上述扫描与两条候选链中，没有得到“普通 Enemy 以自身为来源施加该类 Buff，因新分组方式而改变层数、刷新或伤害”的已闭合正例。这个结论是限定范围的未找到正例，不是所有内容均无差异的证明。空来源及来源退场后延迟施加须与实际创建链另行核对。

## 复跑

从仓库根目录执行，使用相同客户端；`--game` 可指定另一安装路径：

```sh
python3 docs/research/evidence/independent-group-impact-20261112/content/extract.py \
  --out .cache/native-research/independent-group-impact-20261112/content/replay
```

比较三份 JSON 的 result、全部 sources 和解码器／脚本指纹。枚举值直接从 metadata v29 的字段默认值表读取，选中值只需一字节／两字节压缩有符号整数解码；记录实际编码字节。完整客户端、资源和工具指纹见每份 JSON 的 provenance。

本机 metadata SHA-256：e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5。共享 Unity 解码器和脚本来源均记录哈希；不依赖旧文件索引猜测当前字段。
