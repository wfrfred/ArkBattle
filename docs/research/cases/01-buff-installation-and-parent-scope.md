# Case A：Buff 安装、有效性与父作用域

研究日期：2026-10-07；当前实现基线 `3f35bfd` 及当前目录整理工作树。本篇只确定影响游戏结果的实例与调用顺序，不冻结 API，不要求复刻官方容器、回收时机或浮点轨迹。

**范围**：维什戴尔残影是用户此前提出的协议压力样例；当前 `data/chess.json` 未包含该干员，不能据此增加本季角色支持承诺。鼓舞对照采用本季 `chess_char_6_04_a/b → char_1012_skadi2 → skchr_skadi2_3`；S2 不作为本季默认技能证据。

**证据**：客户端版本与哈希沿用 [05](../05-evidence-and-open-questions.md)。以下“证实”指本机常规原生分支与真实模板；未运行客户端，也未排除 Lua 覆盖。“推断”是据此得到的项目约束，“待核对”是尚未闭合的行为。完整新增摘录保存在 `/tmp/stronghold-case-a/`，关键短摘录保留在本文。

## 1. 本案需要区分的事实

| 事实 | 残影实例 | 鼓舞实例 |
| --- | --- | --- |
| 内容定义 | `wisdel_t_1[bomb]` 的参数、开始动作、UNIQUE 覆盖政策 | `atk_to_atk[final_addition]` 的刷新动作及采样规则 |
| 接收者 | 被附着的目标单位 | 被鼓舞的友方单位 |
| 来源 | 本次附着的来源单位 | 当前鼓舞来源单位 |
| 父作用域 | 来源身上的具体 `wisdel_t_1` 实例 | 接收者身上的刷新父 Buff 与其派生 `encourage[atk]` |
| 实例事实 | 身份、父关联、开始／有效／结束进度 | 上述事实，加上已经采样的属性贡献值 |
| 派生贡献 | 本例没有属性 modifier；有效残影由内容查询消费 | 子实例有效时参与目标 ATK 的 FINAL_ADDITION |

**证实**：客户端把 `m_started`、`m_isFinished`、`m_isActuallyFinished`、`m_isActuallyEnabled`、`m_isManuallyEnabled`、`m_isValid` 分开保存。仅从其中一个字段不能推出其他字段，也不能把“容器中还存在”解释为“仍有效”。

**推断**：项目需要区分安装尝试、开始动作、有效参与、结束传播和最终清理。它们是不同语义，不要求照抄这组客户端布尔字段。

## 2. 残影的最小内容链

**证实**：`char_1035_wisdel` 攻击 prefab 的 active Buff 引用 `wisdel_t_1[bomb]`；其描述包含 `overrideType=UNIQUE(2)`、`maxStackCnt=1`、`independentCharacterSource=false`，属性 modifier 为空。

父天赋 `wisdel_t_1` 的实际 Buff 使用 `templateKey=empty`。本例的父作用域不是“维什戴尔这个 Unit”，而是该 Unit 身上的具体天赋 Buff。

残影模板的开始动作投影为：

```text
ON_BUFF_START（0）
  CheckContainsBuff(BUFF_SOURCE, wisdel_t_1, checkBuffSource=false)
  成功：AttachAsDerivedBuffById(wisdel_t_1,
          finishDerivedBuffIfParentFinish=true)
  失败：FinishBuff(updateOverrideMap=true)
```

**证实**：`AttachAsDerivedBuffById.Execute`（95198）按 key 从来源的容器取第一个 enabled 父实例，再调用 `AddDerivedBuffSafe`。最终联系是实例联系；只保存父模板 key 无法区分天赋重装前后的两个实例。

主 projectile 的 `_AttachBuffs` 先于伤害动作，详见 [02](../02-combat-buffs-and-effects.md)。因此“有残影”不要求此次 HP 伤害已经确认，也不能把安装条件放成 `actualHpLoss > 0`。

## 3. 安装顺序：登记早于开始，开始早于生效

**证实**：`Entity.AddBuff`（65958／65959）解析配置后调用容器 `NewBuff`（64730）。正常接收路径先清理本容器已结束实例，再检查安装免疫，随后创建并 Reset 新实例。

下面是 `NewBuff` 的短控制流投影；地址用于复查，不是 C# 原文：

```text
0x180675712  _CheckFinishedBuffs()
0x180675b12  Buff.Reset(...)
0x180675cca  m_buffs.Add(newBuff)
0x180675cf2  m_buffUidMap.Add(uid, newBuff)
0x180675d15  owner.inited 为真时 Buff.OnStart()
0x180675d85  _FilterBuffAbnormalAnti(...)
0x180675d8f  查询 isFinished；已结束则 _FinishAndRemoveBuff 并返回 null
0x180675ddc  无 overrideKey：set_isEnabled(true)
0x180675def  否则建立／取得覆盖组，接纳后更新有效成员
```

`owner + 0x24` 是 `BObject.inited`，不是出生字段；`borned` 位于 `+0x25`。**待核对**：未初始化目标跳过即时 OnStart 后的全部初始化／出生调用链；不能把本段顺序推广到所有开始入口。

**证实**：Reset 将 started、finished、actuallyFinished 及实际／手动 enabled 等初始字段清零。`ContainsBuff`（64755）与 `GetFirstBuffByKey`（64744）只返回 enabled 的匹配实例；`GetBuffByUid`（64743）直接查 UID 登记，不加 enabled 筛选。

复核确认前两种按 key 查询也通过 `m_buffs` 枚举，同集合活跃枚举期间复用候选缓存；UID 查询直接查 map。因此有效性与候选身份范围分别解释，不能把“按 key 检查 enabled”推成“总能看见刚启用的新身份”。具体锚点见 [Case C](03-dispatch-and-nested-settlement.md)。

因此“ON_START 能否查询自己”必须说明查询语义：

| 查询 | 已初始化目标的普通新实例，在启用前的结果 |
| --- | --- |
| 开始动作的当前 Buff 上下文 | 已有自身实例，可设置关联或结束自己 |
| 按已登记 UID 取实例 | 能取得新实例 |
| `ContainsBuff(key)`／`GetFirstBuffByKey(key)` | 不因新实例已登记而返回它；可能返回同 key 的旧有效实例 |
| 当前有效属性 | 新实例尚未启用，自己的 modifier 尚未加入属性集合 |

**证实**：`Buff.OnStart`（64567）先运行开始动作，随后才设置 started，再发出其他 Buff 开始通知及 `OnBuffStart`。即使开始动作已将自己 MarkFinish，该方法也没有在通知前重新筛掉自己；安装成功与开始通知不是同一个事实。

### Trace A1：正常安装返回后，后继能看见残影

前置事实：目标 E 已初始化且无残影；来源 S 在场，父 P=`wisdel_t_1` 已启用；两个容器没有外层未退出枚举。ID 是说明用符号。

```text
1. AddBuff(E, M)：登记 M；M 尚未 enabled。
2. M.ON_START：自身上下文=M；ContainsBuff(E,bomb)=false。
3. 查询 S 得到 P，P.derived 加入 M 的实例联系。
4. 开始动作返回；覆盖组为空，接纳 M 并启用。
5. AddBuff 返回 M；后继 CheckContainsBuff(E,bomb)=true。
6. projectile 继续伤害动作；该伤害仍可被接收端拒绝。
```

**推断**：安装调用可以在局部工作状态中同步完成关联与有效性；外层下一步必须读取安装返回后的事实。这不要求在步骤之间发布权威 Battlefield。

### Trace A2：安装被拒绝，前缀开始动作不自动回滚

前置事实：E 已有来自 S1 的有效 M1，父为 P1；S2 的父 P2 也有效。

```text
1. 新 M2 登记；ON_START 将它联系到 P2。
2. UNIQUE 组已有 M1，_DoAddInternal 拒绝 M2。
3. NewBuff 对 M2 执行结束／移除，返回 null。
4. M1 仍是有效残影，父仍为 P1；不是改归 S2/P2。
```

**证实**：UNIQUE 非空拒绝路径在 `_DoAddInternal`（64720）；它发生在 ON_START 之后。安装失败不能被通用执行器解释为“所有开始动作从未发生”。本例没有由 M2 开始动作产生的伤害，因此不据此声称任何角色有安装失败伤害。

复核 UNIQUE 分支 `0x18069dbf5–0x18069dc25`：它只检查覆盖组集合是否为空，没有按 enabled 筛选。已接纳、尚未结束的旧实例暂时停用，也仍占据唯一安装位置；恢复参与不会允许第二个同组实例同时存在。这个有限结论仍依赖具体覆盖组与来源分组配置，不代表完整 override 政策已经实现。

如果开始时来源已经没有有效父，残影的失败分支会 MarkFinish 自己；NewBuff 随后清理并返回 null。**证实**：来源 Unit 仍在场也不足以使安装成功。

## 4. 结束传播：先失效，结束动作另有触发点

**证实**：`MarkFinish`（64548）首次进入的常规顺序如下；已有显式 finished 标记时早退：

```text
set_isEnabled(false)
  actuallyEnabled 先变 false
  移除属性／异常抗性贡献
  运行 ON_BUFF_DISABLE（25）
m_isFinished = true
ClearDerivedBuffsIfNot(updateOverrideMap)
  对仍可解析的派生弱引用逐个调用 MarkFinish
  清空本父的派生集合
可选更新覆盖组，使替补重新参加有效性判断
```

ON_DISABLE 在显式 finished 标记写入之前运行；它不是 ON_FINISH。**待核对**：复杂 ON_DISABLE 重入安装、相同实例循环关联及特殊 Lua 分支的完整行为；本案父与残影模板没有这些动作，不先制造全局重入协议。

**证实**：`ClearDerivedBuffsIfNot`（64696）直接递归标记子实例，没有调用子 ON_FINISH。因此禁用及贡献撤销可同步传播，而子结束动作不必同步传播。

### 参数名不能代替分支语义

`AddDerivedBuffSafe`（64560）的 `finishDerivedBuffIfParentFinish` 只影响**绑定时父已经结束**的分支：

| 绑定时事实 | 常规结果 |
| --- | --- |
| 父、子非空，父未结束 | 将子加入父派生集合；不保存此布尔值 |
| 父已结束，参数 true | 标记父结束，并标记子结束；不建立联系 |
| 父已结束，参数 false | 不建立联系，也不因此标记子结束 |
| 父或子为空 | 返回，不建立联系 |

**证实**：活父分支调用 `AddDerivedBuff`（64572），派生集合只存子弱引用；父以后清理该集合时不按此参数筛选。因此鼓舞 CreateBuff 的该参数为 false，不能解释成“成功绑定后，父以后结束也保留子”。

### Trace A3：父结束而来源 Unit 留场

前置事实：S、E 在场；P 与残影 M 有效，M 位于 E，父 P 位于 S。

```text
1. MarkFinish(P)：P 先失去有效贡献／有效查询资格。
2. P.finished=true；递归 MarkFinish(M)，M 同步禁用。
3. MarkFinish(P) 返回：S、E 仍在场；ContainsBuff(E,bomb)=false。
4. 两个容器可能还登记 P/M，UID 查询仍可能取得待清理实例。
5. S 的容器清理 P：P.ON_FINISH 可执行；它不保证 M.ON_FINISH 已执行。
6. E 的容器清理 M 时才处理 M.ON_FINISH；本例模板该动作为空。
```

**证实**：父作用域结束传播独立于来源退场；步骤 3 已足以改变后续余震能否引爆残影。只在 Unit 移除时清理来源效果会留下错误的有效标记。

### 结束动作与容器清理的真实顺序

**证实**：`_FinishAndRemoveBuff`（64787）先移除遍历集合与 UID 登记，再调用 `_FinishBuff`（64788）。后者再次 MarkFinish，通过 actuallyFinished 幂等门，运行 ON_BUFF_FINISH（1），移除贡献并发出 OnBuffFinish，最后回收或登记下帧回收。

`_CheckFinishedBuffs`（64780）会触发这条路径；NewBuff 开头、容器 Tick 收尾及 `ForceRefreshFinishedBuffs` 都是入口。本段描述本案容器清理路径，不把直接 `Buff.OnFinish` 当成已从容器删除的证明。

**推断**：父 ON_FINISH 内按 key 查询子应使用子已失效的事实；父结束动作不能默认等待异目标容器的子 ON_FINISH。若结束动作对该目标发起 NewBuff，其前置清理又可能同步执行子结束动作，再返回外层。同容器候选与派发期间新增实例的可见性已由 [Case C](03-dispatch-and-nested-settlement.md) 核对；复杂结束连锁仍未闭合。

## 5. 鼓舞对照：贡献有采样事实与刷新过程

**证实**：本机 `[uc]skills` 中本体 S3 组件 `6203907274112914333` 与 token 对照组件 `-5552751358999933326` 的 `skadi2_s_3[atk]` 都引用 `atk_to_atk[final_addition]`，配置 `triggerInterval=1.0`、`waitFirstTriggerInterval=false`、`disableOverride=true`。范围离开／能力分离的移除开关均开启，但完整目标进出调度未在本案核对。

模板动作短摘录如下：

```text
ON_BUFF_TRIGGER（2）
  CheckBuffAttributeModifierChanged(source=BUFF_SOURCE, ATK,
      buffAttribute=ATK, formula=FINAL_ADDITION, useFirstDerivedBuff=true)
  若变化：FinishDerivedBuff(updateOverrideMap=true)
          CreateBuff(encourage[atk], isDerivedBuff=true)
```

**证实**：事件 2 是 ON_BUFF_TRIGGER，不是 TICK；metadata 字段 `70568` 与 `Buff.OnTrigger`（64569）的 `_RunActions(ev=2)` 一致。它可以由周期计时触发，不等于每次属性查询实时重读来源。精确首次触发落在哪个项目 tick 不在此复刻。

CreateBuff 的 modifier 描述为 `ATK / FINAL_SCALER / fetchBaseValueFromSourceEntity=true`；`_LoadAttributesModifier`（64674）读取来源当前 ATK，处理系数后把结果写入子实例 FINAL_ADDITION 数组。`CheckBuffAttributeModifierChanged`（95594）比较当前源值推导结果与旧子记录值；不存在派生子时也要求建立它。

### Trace A4：刷新前旧值保留，嵌套安装返回后新值可见

说明用假设：接收者基础 ATK=500；鼓舞比例=0.5；没有竞争鼓舞或其他加成，不是本季实际技能等级参数。

```text
1. 源 ATK=300，子 C1 已采样 FINAL_ADDITION=150；目标有效 ATK=650。
2. 源 ATK 改为400；尚未触发刷新，查询目标仍得到650。
3. 父 R 的下一次 TRIGGER 比较200与C1的150，判定变化。
4. FinishDerivedBuff 标记C1；其贡献同步撤销，目标此时为500。
5. CreateBuff 安装C2：NewBuff先清理本容器C1，再采样源值400。
6. 子C2启用并加入贡献；AddBuff返回后才与R建立派生联系。
7. 整个刷新步骤返回；目标有效ATK=700，后续操作读到新值。
```

**证实**：CreateBuff（95014）先同步 AddBuff，再 AddDerivedBuffSafe；不是先把尚未安装的子绑定给父。**推断**：可以把没有中间观察者的刷新组合成一个项目 transition，但有开始／禁用／结束动作时不能以“原子替换数值”抹掉它们的可见性。

鼓舞与残影的共同点是独立实例与父关系；差异是鼓舞还保存采样结果并参与属性组合。**推断**：仅在 Resources 缓存程序、每次查询用最新源 ATK 动态计算，并不能保留上述刷新节律；采样值必须是可恢复的实例事实。

## 6. 有限协议结论与当前差距

| 结论 | 证据与限度 |
| --- | --- |
| 安装返回需要区分接纳／拒绝；后继读取返回后的局部事实 | **证实**：NewBuff 可执行开始动作后返回 null；拒绝不等于全前缀回滚 |
| 持有实例、按身份查询、按有效内容查询不是同一个查询 | **证实**：UID 登记与 enabled 筛选路径不同；不要求复制客户端容器 |
| 父关联是运行事实，不能只存来源 Unit 或模板名 | **证实**：父仍可在来源留场时结束；具体父重装会产生不同身份 |
| 失效传播及撤贡献先于后续有效查询；结束动作另按确定时点执行 | **证实**：MarkFinish 与容器清理分开；不据此规定所有领域统一队列 |
| 来源值采样与刷新由内容过程决定，属性查询消费当前贡献 | **证实**：本季 S3 的周期父与采样子；其他属性刷新政策不自动相同 |
| 局部生效与权威发布可以分开 | **推断**：工作状态保存同步步骤结果，成功后整体发布；不必直接改公开 Battlefield |

当前 EffectInstance 的纯数据／资源分离方向可保留；`lifetimeOwner` 只有 UNIT／EXECUTION，缺少父实例关联。当前 install/remove/expire 也没有开始、禁用、结束程序及覆盖接纳阶段。这些是本案证实的未覆盖路径，不证明现有有限直接效果实现本身错误。

不在本案落定：全 override 状态机、源退场与父暂停的全部传播政策、Buff 图循环处理、所有安装免疫、全局结束动作队列、范围成员刷新，以及多鼓舞竞争的完整政策。上述问题不能用一个统一 owner 或 `group {id,strength}` 自动推导。

## 7. 复查锚点

| 主题 | 方法／数据 |
| --- | --- |
| 安装与开始 | Entity.AddBuff 65958／65959；NewBuff 64730；Reset 64539；OnStart 64567 |
| 查询与有效性 | GetBuffByUid 64743；ContainsBuff 64755；GetFirstBuffByKey 64744；set_isEnabled 64526；_UpdateIsEnabledIfNotFinished 64688 |
| 覆盖与结束 | _DoAddInternal 64720；MarkFinish 64548；_FinishAndRemoveBuff 64787；_FinishBuff 64788；_CheckFinishedBuffs 64780 |
| 父子联系 | AddDerivedBuffSafe 64560；AddDerivedBuff 64572；ClearDerivedBuffsIfNot 64696；AttachAsDerivedBuffById.Execute 95198 |
| 鼓舞刷新 | CheckBuffAttributeModifierChanged.Execute 95594；FinishDerivedBuff.Execute 95001；CreateBuff.Execute 95014；_LoadAttributesModifier 64674；OnTrigger 64569 |
| 持久模板摘录 | [client-excerpts.json](../evidence/client-excerpts.json) 中的残影开始动作；本篇保留鼓舞动作与 S3 组件 ID／周期配置 |

完整模板来源：`/tmp/stronghold-wisadel-research/templates.json`、`char_1035_wisdel.json`；`/tmp/stronghold-damage-research-prefab/buff_template_holder.json`、`[uc]skills.json`。新增方法、字段与鼓舞投影位于 `/tmp/stronghold-case-a/`；第三方数据镜像与客户端清单不是已证明相同版本。
