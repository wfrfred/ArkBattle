# 元素爆发、抵挡与技力观察规则补查

2026-11-22 对照 [案例25](../../cases/25-elemental-burst-recovery-timing.md)、[案例28](../../cases/28-damage-hooks-and-event-granularity.md)和[案例38](../../cases/38-damage-classification-and-permissions.md)。[原件摘录](evidence.json)包含 Windows 客户端 DLL／metadata、资源包、固定资料修订 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的指纹、Prefab PathID、实际绑定、关卡 Pointer、表内递归检索和关键原生指令。静态调用的结果按所列输入推导，未验证运行期 XLua 或实战。

## 爆发前置实际发射的是延迟弹道

- 红丝绒 AD-8 与 AD-EX-8 的出怪条目直接使用 `enemy_1568_dirctr`。已安装资源 `battle/enm_pfb_25.ab` 的 Default、m1、m2 启用三个 `GlobalAuraAbility`，分别绑定 `enemy_dirctr_t[aura]`、`[aura2]`、`[aura3]`。过滤神经损伤后，在 `ON_BEFORE_EP_BREAK_START` 创建范围弹道。
- 两个实际弹道的 `AttachToTarget` 均保存 `_delayAfterReached=true`、`_delayTime=2`。节点 `_dealHitTargetAfterCreate=false`。原生 `EmitProjectile.Execute` 在 `0x1811750b9–c0` 以该字段控制创建后立即命中，`_forceDealHitTarget` 只在立即命中分支内于 `0x1811750e8` 读取。因此这次前置程序只发射弹道，后续 HP／EP 由弹道命中派发。配置能使邻近对象陆续爆发，不能作为同一宿主在前置回调中同步创建第二轮的见证。 [红丝绒玩法背景](https://prts.wiki/w/红丝绒)

## 星熊 Y2／Y3 消费独立的成功抵挡

- `uniequip_002_hsguma` 的二级、三级资源分别为 `hsguma_equip_1_2_p1` 和 `hsguma_equip_1_3_p1`，对应已启用的 `PassiveBuffAbility`，均安装 `hsguma_e_002_t`。该模板的 `ON_TAKE_DAMAGE` 是自身概率抵挡，`ON_BLOCK_DAMAGE` 则独立安装攻击增益。后者没有按施加者或取消原因过滤，可响应另外的抵挡程序。 [星熊 Y 模组备注](https://prts.wiki/w/星熊#天赋)
- 原生 `BlockDamage.Execute`（99230）在 `0x1810fa3ca` 试图以原因 3 取消，在 `0x1810fa475` 试图以原因 4 取消。各自只有成功时在 `0x1810fa40d`／`0x1810fa4b8` 派发同一 `Entity.OnBlockDamage`，随后才继续原 BlockDamage 节点。两个原因都驱动同一天赋。这组实际绑定提供了独立观察者，没有提供业务结果因是否显示蓝字而不同的见证。 [原生通知说明](https://prts.wiki/w/事件)

## 锁血只保留原有数值权限

`huang_t_1[lock]` 的 `ON_TAKE_DAMAGE` 只执行 `HpNoLessThanCertainPercentModifier`。通常值过大时，方法（100255）在 `0x181177239` 检查共享标记 16。如果原请求未设该标记，在 `0x1811772bd` 写入限幅后的伤害值后直接返回。如果已设，方法暂时解除标记、写值并在 `0x18117735f` 复原原标记。普通锁血不会给本来可改值的请求增加写保护。

实际的写保护输入之一是“他缚”。主题表 `/details/rogue_6/relics/rogue_6_relic_fight_11` 给普通干员安装 `rogue_6_char_loss_hp`，配置 `hp_ratio=0.7`，对应的物品条目说明部署后失去 70% 当前生命。模板在 `ON_OWNER_POST_BORN` 排除 `MOVE_LIKE_RESPAWN_SELF` 后构造无来源真实伤害，保留普通接收，不禁止取消。`NoSourceDamage.Execute`（99151）在 `0x181104187` 读取 `_isNotChangeableValue`，为真时在 `0x1811041ae` 写入标记 16。固定模板中显式设置该字段的另外两处是其最大生命值变体 `rogue_6_char_loss_hp[max]` 与心烛 `entlec_a[damage]`。[他缚说明](https://prts.wiki/w/他缚) · [心烛实际来源](../../cases/38-damage-classification-and-permissions.md#心烛的实际来源不是-schedule-spawn)

## 取消原因与 SP 方式的固定表检索

- 递归扫描固定镜像的 8662 条模板，共得到八处 `FilterModifierCancelReason`，都位于 `ON_TAKE_DAMAGE` 的 HP 专属事件。维吉尔的狼群程序分别匹配两种抵挡原因，二者进入同一跳过失去狼的分支。没有找到该节点在 EP 事件中消费具体原因。扫描范围限此定义和固定表，不包括其他原生判断、独立热更新或未列入的媒体资源。
- 固定模板中唯一配置 `ModifySpData._onlyUpdateSpCost=false` 的是 `multi_fortress_p[mesh]`。多维合作的建筑工具间有真实预置 `/predefines/tokenInsts/2`，其 M1 的启用 `PassiveBuffAbility` 绑定该模板。该节点在 `0x1810ed49e–4a3` 只覆写 `SpData.spCost` 的两段存储（字段偏移 `0x34`），没有覆写 `spType`（偏移 `0x10`）。`_onlyUpdateSpCost=false` 令控制器复制原恢复类型和回复量并推进计时器路径，不能由此认定发生了恢复类型切换。 [建筑工具间](https://prts.wiki/w/建筑工具间)

## 复查

在仓库根运行。工具使用当前固定的 Data 子模块和具有已记录指纹的客户端。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/resource-observers-20261122/extract.py \
  --out /tmp/arkbattle-resource-observers-replay.json
```
