# 卫戍开场的干员入场效果样本

2026-11-22 核对「卫戍协议·规程·序列Ⅰ」`act3autochess/V3_1` 的实际默认干员配置，以及本机 Windows 技能 Prefab、角色 Prefab 和 Buff Holder。配置镜像、基础角色包和本机热更新资源的来源分别记录在 [result.json](result.json)。开场逐个用 Card 创建实战单位的路径见[开场部署原生分支](../stronghold-opening-deploy-20261122/README.md)。普通 Card 走到 `Character.LocateOnTile` 后仍调用出生虚槽，见[实际出生链](../special-redeploy-failure-20261122/README.md#特殊入场的实际观察者)。

| 样本 | 当前配置和实际执行 |
| --- | --- |
| 砾 S1「影袭」 | `chess_char_2_06_a` 默认技能下标 `0`，精一 60、技能四级。热更新根 `skchr_gravel_1` 同时挂有启用的 `AppearSkill`（`4339346020550054301`）和 `ActiveBuffAbility`（`-3447525517632663139`）。`_castOnLocate=0`，出生时请求发动。技能给自身装 `gravel_s_1 → def_atten`，其每次推进按余量修正防御。该等级配置 `def=2.7`、持续 7 秒。 |
| 宴 S2「落地斩·破门」 | `chess_char_2_16_a` 默认技能下标 `1`，精一 60、技能四级。热更新根 `skchr_utage_2` 同时挂启用的 `AppearSkill`（`-7589396649162081342`）和 `ActiveBuffAbility`（`2105435139465313218`）。`_castOnLocate=1`，定位完成时请求发动。技能给自身装 `utage_s_2[self_damage] → utage_s_2`，效果开始时以 `DamageViaCurHpRatio` 对自身按 `hp_ratio=0.5` 扣当前生命。另一项 `utage_s_2[atk] → switch_mode` 切换攻击模式并提供攻击加成。本效果不需要敌方目标。 |
| 斥罪第一天赋「律法卫士」 | `chess_char_4_16_a` 初始精二 1 级，达到该天赋的解锁条件。角色包 `char_4065_judge.ab` 中启用的 `PassiveBuffAbility -5237745640822817507` 装 `judge_t_1`。热 Holder 的该效果在开始时读取自身最大生命，按 `born_hp_ratio` 得出屏障并写入动态耐久。固定角色表的精二基础值是 50%，对应潜能后为 55%。 |

- `Character.OnBorn #77334` 在 `0x180aa2e8e` 调用技能出生虚槽 61。`AppearSkill.OnBorn #73734` 在 `0x180990776` 检查 `_castOnLocate`，值为零走技能发动请求。出生状态正常计时完成后，`BornState.OnTick #77465` 在 `0x180a9b72c` 调用 `Character.OnLocate #77339`，后者在 `0x180aa3a90` 调用技能定位虚槽 62。`AppearSkill.OnLocate #73735` 在 `0x180990970` 检查同一字段，值为一走技能发动请求。这两个原生分支未见以免费或开场阶段跳过。两者的 `_switchToState=0`，因此 `AppearSkill.UseSkill #73733` 调用 `BasicSkill.Cast`。`ActiveBuffAbility.DoOnSpellStart #92986` 在 `0x180f57124` 添加本次发动的 Buff。
- `Character.OnInit #77332` 在 `0x180aa3946` 附着满足资格的天赋。`BasicTalent.DoAttach #74552` 在 `0x1809be1a4` 转到 `Ability.Attach`。普通 `AddPassiveBuffs #64057` 在 `0x180601d3d` 调用 `Entity.AddBuff`。`Buff.OnStart #66123` 在 `0x1806d5035` 执行事件 0 的模板程序。斥罪的初始屏障走这条被动附着链。

这些样本给出出生、定位完成和天赋附着三条实际效果入口，所查静态分支不支持卫戍开场统一关闭干员入场效果。宴的掉血在敌人尚未出生时就可以独立观察。这里没有记录本期实战，亦未穷尽其他效果和运行时热更。 [宴的技能说明](https://prts.wiki/w/宴#技能)

## 复跑

在仓库根目录运行。当前活动表以固定公开镜像为输入，复取命令见[本期活动配置](../stronghold-opening-current-content-20261122/README.md#复跑)。`--game` 可指定有相同指纹的 Windows 安装，`--gamedata` 可指定固定角色及技能表目录。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/stronghold-opening-operator-effects-20261122/extract.py \
  --activity /tmp/arkbattle-current-activity-20261113.json \
  --out /tmp/arkbattle-stronghold-opening-operator-effects.json
```
