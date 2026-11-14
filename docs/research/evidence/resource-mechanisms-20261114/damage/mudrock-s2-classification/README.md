# 泥岩S2的伤害分类

核对日期：2026-11-15。仅补既有泥岩S2请求的 `attackType`／`applyWay`，不按范围攻击、技能或Effect猜分类，不改产品代码。

结论：当前安装配置和普通native分支为 **`NORMAL / MELEE`**。

| 链路 | 直接证据 |
| --- | --- |
| 实际技能选择 | 已归档泥岩角色资料的第二技能为 `skchr_mudrok_2`，完整片段及来源指纹复用到 `content.json`。 |
| 技能执行根 | `skchr_mudrok_2` 上的 `AnimatedActionToOwnerAbility` **3130726341302253684**，其序列化动作显式 `TriggerAbility(_abilityName="RollAttack")`，之后执行自身回复与表现。 |
| 实际伤害能力 | 子对象 `skchr_mudrok_2/RollAttack` **8290759946353997940**；MonoScript PPtr 解码为 `Torappu.Battle.Abilities.MeleeAttack`。 |
| 攻击类型 | 该对象 `_attackType=1`（NORMAL）、`_useDynamicAttackType=0`；没有根据主／扩散目标动态改成SPLASH。 |
| 施加途径 | 当前 `MeleeAttack.get_applyWay #92334`，入口 `0x180f50960`，普通分支 `0x180f5099b: mov eax,1`，即MELEE。该值来自实际类的getter，不是根据动画或AOE推断。 |

选择器和范围影响这次作用于哪些目标，不把本次伤害自动改成SPLASH或BUFF。结论限定于所存配置和当前普通native；没有执行游戏或验证有效XLua覆盖。

`content.json` 保留本技能根及子层级8个组件、外部脚本引用、原始对象SHA256；`native.json` 保留当前DLL／metadata指纹和相关getter／调用体。其他原件、完整枚举均继续只读复用。

复提：

```sh
python docs/research/evidence/resource-mechanisms-20261114/damage/mudrock-s2-classification/verify.py \
  --out .cache/native-research/resource-mechanisms-20261114/damage/mudrock-s2-classification/replay
```

结果见 `verification.json`；不运行产品测试。
