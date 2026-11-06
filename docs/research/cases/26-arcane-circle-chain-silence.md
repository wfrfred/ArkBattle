# 奥术法阵与链术师跳跃沉默

查阅及客户端取证日期：2026-11-02。证据包括本机官方客户端普通 native 分支和资源、固定历史提交的第三方游戏数据镜像、PRTS 社区资料。未运行游戏实验，未验证运行时 XLua 覆盖。

## 问题与结论

惊蛰携带卫戍协议：盟约下半的奥术法阵时，沉默是否仅作用于首个攻击目标，还是后续跳跃伤害的目标也会受到沉默？

**后续跳跃目标也会被施加 5 秒沉默；惊蛰普通攻击和二技能均适用。** 这是装备的伤害触发分别作用于各受伤目标，不是沉默状态自行向附近敌人传播。最初结论由 PRTS 两项社区资料组合推得；后续已核对下述 native 调用链、本机 Prefab／模板和赛季装备数据绑定。结论为静态调用链与配置的联合证据，不冒充完整客户端运行观测。

区分场景：惊蛰攻击 A，随后跳跃伤害 B、C。首目标触发模型只会沉默 A；已核对的伤害触发模型会分别处理 A、B、C。未被跳跃伤害命中的附近目标不因此获得沉默。

## 证据

1. [卫戍协议：盟约 下半／PRTS 盟约记录](https://prts.wiki/w/卫戍协议：盟约_下半/PRTS盟约记录)，装备部分“Ⅲ阶 奥术法阵”及脚注：基础和进阶均记为造成伤害时施加 5 秒沉默；脚注明确解释，游戏内写的是攻击，Wiki 因描述与实际表现不符而修正。因此不能仅按游戏文字将效果限制为首个攻击目标。
2. [惊蛰](https://prts.wiki/w/惊蛰)，特性与分支信息：攻击在多个敌人间跳跃，每次跳跃产生衰减的法术伤害，精英二最多涉及四个敌人。后续目标并非仅获得停顿而不受伤害。
3. [官方 2026-03-27 更新公告](https://ak.hypergryph.com/news/8584)，装备调整：确认新增 5 秒失去特殊能力效果；公告本身没有区分首目标与跳跃目标，不单独作为触发范围证据。

## 客户端与配置核查

完整材料、指纹和复现命令见[本批证据](../evidence/arcane-chain-silence-20261102/README.md)。其中 N 为本机原生指令或资源直接证据，D 为第三方数据镜像中的固定历史配置；调用链结论由二者联合推得。

1. **D：实际装备绑定。** 镜像提交 `86b6e749d3384dd0c7b825abbb795845dc6df933` 的 `act2autochess` 中，基础／进阶奥术法阵 `eff_acarm048`／`eff_acgarm048` 均通过 `env_gbuff_new_with_verify` 指定 `key=silence_attachment`、`silence=5`。同提交的 `silence` Buff 具有 `SILENCED` 标记，持续时间读取黑板 `silence`。不将这份历史镜像标为本机配置转储。
2. **N：本机资源接续。** `[uc]globalbuffs.ab` 的 `silence_attachment` 组件内置同名 Buff／templateKey。`buff_template_holder.ab` 中同名模板在事件 **11** 执行 `CreateBuff`：从 DB 载入 `silence`，接收者为 **MODIFIER_TARGET**，未配置仅首目标限制。
3. **N：事件身份及伤害入口。** `Buff.OnOutputDamage`（66154，`0x1806d36a0`）明确以 11 调用 `_IsActionValid`／`_RunActions`。`Entity.ApplyModifier` 在确认 modifier 为伤害的路径上，调用来源 `BuffContainer.OnOutputDamage`，容器再逐个派发 Buff 的同名方法。因此该模板绑定的是伤害输出事件。
4. **N：目标不是首选目标。** 从 metadata 默认值解出 `ActionTargetType.MODIFIER_TARGET=4`；`GetActionTarget` 的实际跳表将该值送往 `0x18107ad61`，尾调用 `Modifier.get_target`。不是读取 mainTarget 或 projectile.traceTarget。
5. **N：惊蛰实际攻击与弹跳。** `char_306_leizi.ab` 的 Attack 分别指定 `projectile_leizi`／`projectile_leizi_s2`。对应弹道组件具有 ChainLightningHitBehaviour 的字段布局，跳跃倍率分别为约 0.85／1.0。`ChainLightningHitBehaviour._HitTargets` 循环读取第 i 个目标，以虚槽位 18 调用 `SelectorHitBehaviour.DealHitTarget`，后者接续 `Projectile.DealHitTarget`。该路径逐目标进入 `Projectile.OnHitTarget → ActionController.OnHitTarget → _RunActions`，以当前命中目标建立上下文。
6. **N：伤害节点接入相同管线。** `RangedAttack.NewDamageNode` 构造 `ApplyCacheAtkDamageFromProjectile`；该类型继承 `ApplyDamage` 且没有覆盖 Execute。`ApplyDamage.Execute` 将伤害交给 `Entity.ApplyModifier`。因此后续弹跳也进入装备监听的伤害事件，不只是播放链状效果。

实际链条为：每个跳跃目标的命中／伤害 → 来源的 OnOutputDamage → silence_attachment → 向本次 Modifier.target 施加 silence。未发现普通路径将附带沉默限定为第一个目标的分支。

## 范围与未决项

- 本结论范围为上述赛季与装备版本；不追溯增加沉默效果以前的版本。
- 未确认零伤害、无敌或伤害被完全抵消时是否触发，不用“命中”替代已查明的“造成伤害”。
- 施加沉默与目标的具体能力能否被沉默分别判断。
- 本机静态分支与历史赛季配置已核查；未执行完整游戏或确认 XLua 覆盖，不把静态证据当作所有运行版本的观测。

## 项目关联

若实现此装备，应以伤害触发为行为依据核对后续跳跃目标，不应仅凭“攻击”文案绑定首选目标。本轮不修改实现或决定 Core 接口。
