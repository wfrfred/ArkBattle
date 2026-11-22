# 魔王 S3 的生命重新分配

固定资料修订 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的角色第三技能槽选择 `skchr_cetsyr_3`，描述范围内友方的生命重新分配。取证使用已安装的 Windows IL2CPP v29 客户端、基础角色包以及本机缓存更新包中的技能和 Holder。 [技能说明与备注](https://prts.wiki/w/魔王#技能)

- 更新包 `battle/prefabs/[uc]skills.ab` 的 `skchr_cetsyr_3/Encourage` 是已启用的 `AuraAbility`，PathID `5353210746435603503`。它安装 `cetsyr_s_3`，该程序开始时执行 `SwitchMode(3)`。角色包中 `Character._modes[3]` 指向 S3 模式，包含已启用的 `S3/Body/AuraHeal`（`-8492696783154872102`），其 `_passiveBuffs` 绑定收集、计算两个模板。
- 已安装 Holder 的收集模板向范围内友方施加记录程序，分别累计存活对象的当前 HP 和最大 HP。计算模板以两项总和相除，并给第二次范围选择的目标挂设置模板。两次范围选择均显式允许 `ignoreHealFree`。
- 设置模板调用 `EqualizeTargetHpRatio`，参数 `_useSourceHpRatio=false`、`_skipModifierEvent=true`。在 `Execute #102136` 的此分支，`0x1811fc965` 读取黑板比例，`0x1811fc9a4–0x1811fc9cd` 计算 `(目标比例 − 当前比例) × 当前最大 HP`。`0x1811fca88` 构造带符号差量的 `Modifier.NewHp`，`0x1811fcb12` 设置标记 7，`0x1811fcb25` 调目标的 `Entity.ApplyModifier`。受益者可以增加 HP，贡献者可以减少 HP。 [共享标记与跳过路径](../../cases/29-hp-and-ep-healing-settlement.md#5-skip生命复原与自然回复)

[证据摘录](result.json)记录输入指纹、对象 SHA-256、实际脚本类型、关键程序集地址和完整选定模板。证据限于所列静态分支，未观测实际帧序、XLua 或同一轮入选资格变化。两次查询分别执行，不能由此推出引擎一次性写入全部单位。

从仓库根目录执行以下命令复提。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/health-equalization-20261122/extract.py \
  --out /tmp/arkbattle-health-equalization-replay.json
```
