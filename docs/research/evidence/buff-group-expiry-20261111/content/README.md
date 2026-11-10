# 覆盖组与到期政策的配置样本

核查日期：2026-11-11。使用本机安装资源，复用已有 UnityFS、SerializedFile 和类型树读取器；没有执行客户端、XLua 或实际战斗。本目录只保存配置及绑定证据，机制结论由 Case01 统一维护。

## 输入与选择

[configurations.json](configurations.json) 记录每个 Bundle 的 SHA-256，选中模板的 CAB、PathID、对象及模板字节哈希，以及 Prefab 组件、层级、MonoScript 引用和对应类名。

- `config/buff_template_holder.ab`：SHA-256 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`，9054 个模板。完整遍历只统计本题字段，归档九个指定模板的事件和描述。
- `charpack/char_1012_skadi2.ab`、`char_4132_ascln.ab`、`char_4146_nymph.ab`：选择对应角色根节点下携带 Buff 或模式引用的组件。
- `battle/enm_pfb_26.ab`：按 EnemyData 的精确 prefabKey 定位“某种天命”，只提取该 Actor 根的相关组件；没有扩展到其他 Enemy 内容。EnemyData 使用固定镜像版本 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，原始字节 SHA-256 为 `eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b`。镜像与本机资源分别标识，未宣称同版。
- `battle/prefabs/[uc]skills.ab`：只选择 `skchr_pallas_3`、`skchr_skadi2_3` 根节点中的相应组件。
- `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`：根据 Prefab 的外部文件引用及 PathID 解析 MonoScript，不按数字跨文件猜测类型。

完整 holder 中，同时 `disableOverride=true` 与 `independentCharacterSource=true` 的嵌入描述共两项，分别是 `nymph_t_1[listener]` 和 `nymph_e_003_t_1[listener]`。此计数只覆盖该 holder 的嵌入描述，不包括全部 Prefab 或 BuffDB，也不证明所有实例都会执行到这些节点。其他扫描计数按描述出现次数计，不能当作独立机制数量。

## 样本证据等级

| 样本 | 本批直接证实 | 范围限制 |
| --- | --- | --- |
| 浊心斯卡蒂第二天赋 | 角色 `Talents/2` 的 AuraAbility 组件 `2912961047409272764` 携带 `skadi2_t_2`；模板的成功／失败分支分别创建不同 buffKey，却都声明 `overrideKey=skadi2_t_2[atk]`。 | 分支条件在所存事件中；未运行两个分支或竞争场景。 |
| 浊心斯卡蒂治疗与三技能鼓舞 | Default 等模式的 HealAura 描述设置来源独立；三技能 Aura 组件 `6203907274112914333` 的 `skadi2_s_3[atk]` 设置 `disableOverride=true`，模板为 `atk_to_atk[final_addition]`。 | 证明实际配置关联；不由字段名自行推断组键算法。 |
| 阿斯卡纶第一天赋 | `Talents/1` 的 PassiveBuffAbility 组件 `7553749564675420948` 携带 `ascln_t_1`；模板创建 `ascln_t_1[debuff]`，STACK、有限时长、`durationKey=debuff_duration`、`clearAllStackCntWhenTimeUp=true`。 | 普通内容的实际绑定已找到；到期消费顺序由本批原生证据确定。 |
| 妮芙第一天赋 | `Talents/1` 的 PassiveBuffAbility 组件 `3118566733096761901` 携带 `nymph_t_1`；模板事件 61 创建 listener，同时设置禁用覆盖与来源独立，owner 为 MODIFIER_TARGET，未启用特殊 source。 | CreateBuff 默认来源另由原生解析；本配置证据不独自证明父天赋 Buff 的 source 必为 Character，也不直接断言最终组键。模组版 listener 只证明模板存在。 |
| 某种天命 | EnemyData `enemy_10111_ymgpck` 指向同名 Prefab；`Talents/PushEnemy` 的 AuraAbility 组件 `5806626303499283465` 携带 `ymgpck_t[push_enemy]`；模板事件 0 的条件分支创建 STACK 标记，cap=1000、LIMITED、到期不清全层。 | 根绑定已闭合；`durationKey=hit_count_duration` 的非零最终值尚未确定，原始默认 lifeTime=0。未观测实例实际存活并自然逐层衰减，不能把有限类型直接当作已证明的正持续时间。 |
| 帕拉斯 | `pallas_s_3[peak]` 含显式覆写名与来源独立的组合。 | 该模板的完整根绑定未补齐，只作为非默认描述正例。 |
| 麻痹创建节点 | `ep_break_sanity_enemy`、`abnormal_buff[creator]` 中存在 STACK 的 `palsy[stack]` 创建入口。 | 两者 `loadFromDB=true`，节点的默认时长字段不是最终配置；本批不将其当作普通持续时间到期逐层衰减的正例。 |

Prefab 的类型树读取复用旧解码器；本批只保留必要引用、分组字段和准确的原始整数，省略该读取器会渲染为布尔值的 `lifeTimeType` 字节枚举。时限判断使用 holder 的原始 JSON 描述，不用 Prefab 的此类枚举显示推断。分组布尔字段没有该歧义。

[prts.json](prts.json) 保存查阅的社区资料固定版本与短意译。BUFF 页说明一般禁用覆盖及 STACK 到期政策，但未解释来源独立与禁用覆盖同时开启的组合；组合语义以本批原生分支为准。

## 复跑

从仓库根目录执行：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/buff-group-expiry-20261111/content/extract.py \
  --out .cache/native-research/buff-group-expiry-20261111/content-replay.json
```

默认使用本机客户端路径，可传 `--game`。已独立重提并逐项比较结果一致。源指纹变化时需重新核对引用与选择范围。

EnemyData 默认读取 `.cache/native-research/leithanien-enemydata-20261109/enemy_database.json`。缓存缺失时可将[固定版本原文件](https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/63c7cec73c3858d0ae913f85cc89af3cef4d744f/zh_CN/gamedata/levels/enemydata/enemy_database.json)保存到任意路径，使用 `--database <文件>`；脚本核对上述原始字节 SHA-256，再选取目标敌人记录。无需恢复其他发现缓存。
