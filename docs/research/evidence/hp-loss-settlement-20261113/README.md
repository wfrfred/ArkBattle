# 生命流失的公式、接收与 HP 提交

采集：2026-11-13。回答物理／法术／真实流失是否计算防御，以及跳过普通 Modifier 事件后仍经过哪些接收、生命保护和通知；不设计 ArkBattle API，不修改 Core。

## 输入与证据范围

- 安装客户端：`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。
- `GameAssembly.dll` SHA256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29。
- 关卡／敌人资料镜像：`Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。选择普通 act26side、主线 15 章及 act12side；不使用生息演算或保全派驻正例。镜像提交与安装资源分别记录，不冒充同一发布版本。
- [native.json](native.json) 保存当前 metadata、字段与方法体。普通分支和热更新桥分别可见；未运行游戏或验证 XLua 替换。
- [configuration.json](configuration.json) 保存三个关卡中相关 SPAWN、预置、敌人引用，以及四个敌人的数据库记录，保留 JSON Pointer、源指纹与修订。
- [content/content.json](content/content.json) 来自新解码的安装资源。完整扫描 9054 个模板，保留 196 个 skip 节点的定位索引；只归档 [content-selection.json](content-selection.json) 指定的 5 个模板及 13 个组件原始字节。对象身份为 Bundle 内 SerializedFile + PathID，层级与引用来自本次解码。

配置正例为：落石 `Talents/HitLpeopl → ltrock_hit[lpeopl]`（PHYSICAL）、拟态机械 `FlyMode_Ray_P2 → Ray._activeBuffs → enemy_mpprme_ray_damage`（MAGICAL）、无人爆破艇 `Talents/Bleed → periodic_damage_by_hp_ratio[skip_modifier_fix]`（PURE）。这些是实际关卡引用的敌人及绑定的能力／模式，不是只从模板名字推断。具体碰撞、模式切换和伤害没有游戏内实测。旧 `enemy_bmbmot_t` 的 PHYSICAL 节点只作为反例保留：当前艇 Prefab 没有绑定它。

## 关键原生定位

| 方法 | 当前 metadata / VA | 核对点 |
| --- | --- | --- |
| FixedValueDamage.Execute | 99166 / `0x181101db0` | 公式构造先于 skip 标志；来源计算事件的开关不关闭目标计算事件。 |
| AdvancedApplyDamage.Execute | 99141 / `0x1810f53a0` | 非缓存、保留来源的射线分支调用 CalculateDamageBySource，再设置 skip。 |
| DamageViaMaxHpRatio.Execute | 99171 / `0x181100540` | 当前 PURE 模板每次触发按来源 MaxHP 比例形成数额；不读取触发间隔，之后计算并设置 skip。 |
| BleedingDamagePerSec.Execute | 99304 / `0x1810f9690` | 旧 enemy_bmbmot_t 的 PHYSICAL 节点；与当前 PURE 模板分别记录，不作为当前艇的绑定。 |
| BattleFormula.CalculateDamage / NoEvent / Internal | 65898–65900 / `0x180685fb0` / `0x180685c40` / `0x180685790` | 计算事件开关、穿透、DEF／RES 的公式使用位置。 |
| BattleUtil.CalculateDamageBy… | 79614 / 79615 / 79617 / 79618 | 各构造入口实际传入的计算事件参数。 |
| Entity.ApplyModifier | 67665 / `0x1807211a0` | skip 的事件 41、取消复核、来源事件 61、GameMode 资格、资源提交、普通后置通知跳过。 |
| Buff.OnApplyingSkippedModifier / OnBeforeTargetApplyModifier | 66142 / 66144 | 事件编号分别为 41、61。 |
| Entity.DoApplyModifier | 67683 / `0x180722fe0` | HP／ES、非致命标志、普通 setter 与实际变化记录。 |
| Entity.set_hp / SetHpInternal | 67434 / 67625 | 普通 setter 的归零前干预、不死、写入、归零及 Post。 |
| SetHpDirectly / SetHpInternalDirectly | 67600 / 67626 | 与普通流失不同的直接设置入口；仍有数值限制，但不派发普通满值／归零死亡通知。 |
| Entity.OnHpZero / FinishMe / OnFinish | 67650 / 67633 / 67653 | 流失仍可同步进入生命归零／结束；击杀通知读取 BattleContext 栈顶来源，未追该栈全部入栈入口。 |

详细结论见[案例 11 第 6 节](../../cases/11-damage-apply-and-hp-application.md#6-生命流失补核2026-11-13)。本批不声称穷尽负生命、提前致命预判、每击固定减 1 HP、全部派生 DoApplyModifier、重生或特殊 GameMode 的组合。普通两侧 Applied 后确认死亡是 ArkBattle 的既定选择，不能用本批原生顺序覆盖。

## 复跑

在仓库根目录运行；安装客户端可用 `--game` 替换。`extract_native.py.lock` 固定 Capstone。复查输出到新目录，不覆盖归档原件。

```sh
batch=docs/research/evidence/hp-loss-settlement-20261113
work=.cache/native-research/hp-loss-settlement-replay-20261113
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked "$batch/extract_native.py" --out "$work/native.json"
uv run --offline "$batch/extract_content.py" --out "$work/content"
python "$batch/extract_config.py" \
  --mirror .cache/native-research/checkpoint-nondefault-20261107/mirror \
  --out "$work/configuration.json"
python .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
```

Content 脚本直接按选择文件输出精选对象，不需要手工删除全量转储。它复用仓库已有 TypeTree 解码器，来源脚本指纹与 Bundle／原始对象指纹均在结果中。配置脚本要求镜像检出上述固定提交；更换路径不改变选择规则。重新采集的时间与绝对路径可以变化，比较固定输入的哈希、对象身份、节点和指令。
