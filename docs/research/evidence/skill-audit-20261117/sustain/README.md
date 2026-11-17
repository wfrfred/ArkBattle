# Skill 持续、弹药与 Fever

2026-11-17，复核现有 Sustain／Ammo／主动操作与实际机制的对应关系。仅调查普通 native 分支和静态配置，没有运行客户端或核实活跃 XLua。

## 来源与复跑

- [native.json](native.json)：当前客户端 24 个完整方法体、8 个相关类型的方法／字段清单。DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- [content.json](content.json)：安装资源中所有 Fever 命名技能 Behaviour、图耶 S2 与通用攻击强化的 25 个组件；逐项保留 PPtr、同对象组件、脚本与输入指纹。角色／技能表来自既有固定镜像 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，与安装资源分别版本化。
- [result.json](result.json)：原生事实、当前接口表达能力、实际问题和范围限制；社区资料链接分别记录，未将其当作客户端运行观测。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/skill-audit-20261117/sustain/extract.py \
  --out /tmp/skill-sustain-replay/native.json
python3 docs/research/evidence/skill-audit-20261117/sustain/content.py \
  --out /tmp/skill-sustain-replay/content.json
node docs/research/evidence/skill-audit-20261117/sustain/probe-stop.mjs
```

`content.py` 复用已有配置解码器，读取路径和依赖指纹均在输出中记录；完整角色表／技能表仍需已有缓存，不把摘录冒充原始资料。

## Fever 不单独证明需要改造 TIME

实际 `skchr_mortis_1` 的 FeverCommonBehaviour（PathID `6052952230982506290`）启用 `_updateAbilityCooldown` 与 `_updateCoolDownIfInterrupt`，不是只有环境模板存在。

关键调用：

- `_JoinFeverDuringSkill #73951` 在 `0x1809b31cb` 将 `m_isJoinDuringSkill` 与 `m_isSelfInFever` 都设为 true；`_LeaveFever #73953` 在 `0x1809b3757..377d` 将进入前已在技能中的标记传给 `OnBeforeLeaveFever`。
- `OnAfterJoinFever #73995` 在 `0x1809b4293..4308` 读取 Ability.cooldown、加上 feverTime，再调用 `UpdateCooldown(period, waitFirst=false, keepPassedTime=true)`。虚拟方法身份可由 Ability 方法清单的 slot17／41核对。
- `OnBeforeLeaveFever #73996` 在 `0x1809b4995..4998` 对已有技能分支跳过中断；新开启的分支才中断 Ability／切出 SkillState，再按配置恢复原始 SkillData.duration。
- `get_feverTime #73984` 从 FeverSystemManager.data 的 `+0x18` 读取配置时长；本证据没有把它解释为任意时刻的剩余 Fever 时长。

这条实际路径可以用既有 `extendTime` 保留原技能在已知 Fever 窗口之外的剩余持续时间，由具体 Fever 程序管理进入／退出。它不要求新增一套通用 pause 状态，也不证明所有持续程序都要改成 remaining／rate。

发动资源仍有真实差别：[Fever 社区说明](https://prts.wiki/w/术语释义#Fever)允许未满 SP 发动且不支付。当前 `activation.cost=0` 仍不能跨过固定 requirement。此问题归入运行期 SP／发动政策；原生 `_RecoverSpCost #73993`、`_RevertRecoverSpCost #73994` 的临时补入／退回不能直接成为项目必须照搬的接口。

## 弹药预算与“弹药类技能”资格

图耶 S2 的实际根 `-4181712626622038329` 是 CastSkillWithLimitTimes，另有 AbilityEventCounter；角色表选中 `skchr_tuye_2`，表的 durationType 为 NONE。结合[图耶说明](https://prts.wiki/w/图耶#技能)和既有[Case09](../../../cases/09-skill-mechanisms-and-requirements.md#3-触发持续与输出)，其三发弹药消费、偷弹与补弹是实际资源业务，不等同于普通 AMMO 持续类型的加成资格。

当前 AMMO 预算可自然表示这类“耗尽才结束”的技能；没有必要仅为原生类型不同再复制 INFINITE＋Ammo 两份结束事实。隐现等加成仍须按共享静态资格判断，不能把 `sustain.type===AMMO` 当作所有加成的唯一条件。既有动态 Ammo Input 可按内容的 Definition 身份／资格过滤。

本次未取得有限 TIME 与弹药两个退出预算同时工作的实际正例，也未取得运行中修改 Counter 基础上限的实际内容。既有 Ammo 原生方法清单已覆盖获取 Counter、容量追加、消费、恢复和重置；不能把类型上可以组合写成已经存在的玩法要求。

普通补弹的累计上限、自身额外弹药不计额度且仍受容量限制，分别可用现有 replenish／grant 表达。[烛煌说明](https://prts.wiki/w/烛煌#技能)明确额外弹药不能超过上限；[圣约送葬人说明](https://prts.wiki/w/圣约送葬人#技能)区分自身补充与普通补弹额度。容量公式、隐现／蕾缪安的发动采样复用[既有原生证据](../../skill-parameter-formulas-20261029/README.md)，不重复改变消费／取消时序。

## 已有内容的 STOP 资格遗漏

玫兰莎的真实绑定为 `char_208_melan → skcom_atk_up[1] → prefabId skcom_atk_up`；安装资源的根组件 `-2253778771189300242` 是普通 CastSkill。它没有覆盖 BasicSkill.IsDiscardable／isRetriggerable；普通分支 `IsDiscardable #73803`（`0x18099023f`）和 `isRetriggerable #73801`（`0x18099beff`）均返回 false。图耶的专属 `IsDiscardable #74189` 另检查 `_canDiscardRemainingCount`，实际配置也是 false。

当前 Skill.operate 对没有 onOperation 的 STOP 默认 finish，初始 operationRestrictions 为空；玫兰莎 Content 未提供这两项，命令层会直接转发，因此普通攻击强化能被主动关闭。这是现有接入遗漏主动操作资格，不是模型无法表达：onOperation／operationRestrictions 已能区分合法关闭、条件倾泻和拒绝。默认权限放 Core 还是 Content 需另作架构决定，本批不改实现。

[公开 API probe](probe-stop.mjs)使用实际 Data 与玫兰莎工厂创建单位，合法补 SP、发动后在同 Tick 请求 STOP；[输出](probe-stop-result.json)确认请求受理、Activation 清空且攻击强化移除。它验证项目现存行为，不是官方客户端执行证据，也不提前规定后续接口方案。
