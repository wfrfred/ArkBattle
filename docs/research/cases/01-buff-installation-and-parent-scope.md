# Case A：Buff 安装、有效性与父作用域

研究日期：2026-10-07；当前实现基线 `3f35bfd` 及当前目录整理工作树。本篇只确定影响游戏结果的实例与调用顺序，不冻结 API，不要求复刻官方容器、回收时机或浮点轨迹。

**范围**：维什戴尔残影是用户此前提出的协议压力样例；当前 `data/chess.json` 未包含该干员，不能据此增加本季角色支持承诺。鼓舞对照采用本季 `chess_char_6_04_a/b → char_1012_skadi2 → skchr_skadi2_3`；S2 不作为本季默认技能证据。

**证据**：首轮客户端版本与哈希沿用 [05](../05-evidence-and-open-questions.md)。以下“证实”指本机常规原生分支与真实模板；未运行客户端，也未排除 Lua 覆盖。“推断”是据此得到的项目约束，“待核对”是尚未闭合的行为。关键短摘录保留在本文及[初始客户端批次](../evidence/client-excerpts-20261007/README.md)；当时完整新增转储与专用解码脚本未归档。2026-11-10 的属性、合并与覆盖组补核见第 8 节，使用该批次独立记录的输入指纹与当前方法索引。

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

首轮没有落定完整 override 状态机；第 8 节补齐普通合并与覆盖组选胜分支。来源分组、源退场与父暂停的全部传播政策、Buff 图循环处理、所有安装免疫、全局结束动作队列、范围成员刷新及多鼓舞的完整内容链仍未穷尽，不能用一个统一 owner 或 `group {id,strength}` 自动推导。

## 7. 复查锚点

| 主题 | 方法／数据 |
| --- | --- |
| 安装与开始 | Entity.AddBuff 65958／65959；NewBuff 64730；Reset 64539；OnStart 64567 |
| 查询与有效性 | GetBuffByUid 64743；ContainsBuff 64755；GetFirstBuffByKey 64744；set_isEnabled 64526；_UpdateIsEnabledIfNotFinished 64688 |
| 覆盖与结束 | _DoAddInternal 64720；MarkFinish 64548；_FinishAndRemoveBuff 64787；_FinishBuff 64788；_CheckFinishedBuffs 64780 |
| 父子联系 | AddDerivedBuffSafe 64560；AddDerivedBuff 64572；ClearDerivedBuffsIfNot 64696；AttachAsDerivedBuffById.Execute 95198 |
| 鼓舞刷新 | CheckBuffAttributeModifierChanged.Execute 95594；FinishDerivedBuff.Execute 95001；CreateBuff.Execute 95014；_LoadAttributesModifier 64674；OnTrigger 64569 |
| 持久模板摘录 | [client-excerpts.json](../evidence/client-excerpts-20261007/records.json) 中的残影开始动作；本篇保留鼓舞动作与 S3 组件 ID／周期配置 |

模板来源为本机 `char_1035_wisdel`、`buff_template_holder` 与 skills 资源的当时解码。持久摘录及输入见[初始客户端批次](../evidence/client-excerpts-20261007/README.md)；完整模板、追加方法转储和鼓舞专用解码脚本未归档，本文仅保留已列出的字段／动作投影。第三方数据镜像与客户端清单不是已证明相同版本。

## 8. 2026-11-10 补核：属性 descriptor、合并与覆盖组

本节的 **N** 表示当前静态原生分支或配置直接证实，**I** 表示调用链推导，**P** 表示项目接口／支持范围选择，**G** 表示仍未闭合。没有运行客户端或排除 XLua／特化入口。证据、输入 SHA-256、当前方法签名、指令范围与复跑脚本见[补核批次](../evidence/unit-audit-20261110/buff-attributes/README.md)；旧索引与本节索引分别解释。

### 8.1 原始属性 operand 的解释

**N**：[`Buff._LoadAttributesModifier`](../evidence/unit-audit-20261110/buff-attributes/native/_LoadAttributesModifier-66234.asm)（66234）先确定 operand，再乘传入层数，之后处理 source 和 FormulaItem：

- `loadFromBlackboard=true` 时，属性枚举名经字符串 helper 交给黑板查询；查询忽略大小写，所以 `ATK` 与 `atk` 等价。只有 `TryGetFP=false` 才回退 descriptor.value；显式数值 0 返回成功，不回退。锚点为 `0x1806dab02–b33`，以及 [`_TryGetNumber`](../evidence/unit-audit-20261110/buff-attributes/native/_TryGetNumber-31498.asm) 的 `0x182379e3c–e45`、`0x182379eb3–ebb`。
- `0x1806dab54–b6b` 先计算 `operand × stackCount`。[`ProcessFinalScaler`](../evidence/unit-audit-20261110/buff-attributes/native/ProcessFinalScaler-28624.asm)（28624）随后将负输入转换为 `1+x`，非负值原样返回。因此 `-0.2 × 3` 修正为 `0.4`，不是 `0.8³`。
- 需要 source 而 source 为 Unity null 时，在 `0x1806dabb4–bbb` 跳过整个 descriptor；不把不存在的 source 当作属性 0。

source 非空时先读取来源的当前有效属性，四种写槽分别为：

| 原始 FormulaItem | 接收方写槽 | 写入值，`v = operand × stackCount` |
| --- | --- | --- |
| ADDITION | ADDITION | `sourceValue + v` |
| MULTIPLIER | ADDITION | `sourceValue × v` |
| FINAL_ADDITION | FINAL_ADDITION | `sourceValue + v` |
| FINAL_SCALER | FINAL_ADDITION | `sourceValue × ProcessFinalScaler(v)` |

分支锚点为 `0x1806dabe7`、`0x1806dac17–c70`、`0x1806dad43`。[PRTS 固定版本的属性修正说明](https://prts.wiki/index.php?title=游戏数据基础&oldid=447894)互证来源转槽；层数先后和缺键分支以本批指令为准。四组最终求值沿用[研究02](../02-combat-buffs-and-effects.md#属性与伤害不是同一个倍率集合)及既有 numeric-parameters 证据，不重复转储。

**N+P+I**：原生 BAT 使用时间单位、移速使用每秒速度，见 [Case07](07-action-timing-and-animation.md)及 [Case15 第 2、8 节](15-locomotion-native-semantics.md)。项目统一 Tick 后，BAT 的两类加算换成 Tick、移速的两类加算换成每 Tick 位移，而 multiplier／finalScaler 保持无量纲，这是单位换算；不是客户端存在同名 `/30` 转换的证据。

第 5 节已经闭合鼓舞的实际内容链；本批又复核当前 `atk_to_atk[final_addition] → encourage[atk]` descriptor。其他源码分支有算法证据，不等于已经找到每一种对应的实际启用内容。

### 8.2 普通 Buff 合并分支

**N**：[`OverrideGroup._DoAddInternal`](../evidence/unit-audit-20261110/buff-attributes/native/_DoAddInternal-66291.asm)（66291）区分以下处理；retained 指组内保留实例，incoming 指本次新应用：

| 模式 | 普通分支 |
| --- | --- |
| DEFAULT | incoming 加入覆盖队列；独立登记不意味着所有成员同时生效。 |
| STACK | 空组接纳 incoming；非空时按 retained 的实际层数加 **1**，不是加 incoming.stackCnt。实际 cap<0 或加一未超 cap 才加层，并取两者 remainingTime 的最大值。 |
| STACK 达上限 | 只有 retainedCount==cap 且 `refreshRemainingTimeWhenStackMax=true` 才刷新 remainingTime 最大值；不加层、不重载属性。 |
| UNIQUE | 非空组拒绝 incoming，不因旧实例当前停用而放行；不消费 EXTEND snapshot 标志。 |
| EXTEND | [`_FillRemainingTime`](../evidence/unit-audit-20261110/buff-attributes/native/_FillRemainingTime-66247.asm)（66247）在 incoming.lifeTime 有限时取 `max(retained.remainingTime, incoming.lifeTime)`；incoming.lifeTime 为负时写入该无限时限标记。 |
| EXTEND_TIME | [`_ExtendRemainingTime`](../evidence/unit-audit-20261110/buff-attributes/native/_ExtendRemainingTime-66248.asm)（66248）在 incoming.lifeTime>=0 时，分别给 retained.remainingTime、retained.lifeTime 加 incoming.lifeTime；为负时跳过这两项加算。 |

两种延长方法消费的是 incoming.lifeTime。普通新应用尚未推进时，它与 incoming.remainingTime 相同；不能把任意已运行实例的剩余时间无条件代入，也不能把项目 `null` 一概无穷加法称为原生规则。

**N**：实际 cap 与有效 cap 分别由 [`ResetWithBuff`](../evidence/unit-audit-20261110/buff-attributes/native/ResetWithBuff-66282.asm)（66282）读取，黑板缺值时使用对应 descriptor 字段。`get_validStackCnt`（66085）在有效 cap<0 时返回实际层数，否则返回两者最小值。[`_DoUpdateStack`](../evidence/unit-audit-20261110/buff-attributes/native/_DoUpdateStack-66244.asm)（66244，`0x1806d93d0–9404`）只在实际层数未超过有效 cap 时重载属性；超过后仍能增加实际层数而不增加属性贡献。重载使用 retained 的 data、source 和 stackCount，incoming source 不替换原来源。

**N**：EXTEND 的 snapshot 是另一条操作。`_DoAddInternal` 先 `_FillRemainingTime`，再检查 retained.data.takeSnapshotWhenExtend；为真时先 [`TakeSnapshotToBuffAttribute`](../evidence/unit-audit-20261110/buff-attributes/native/TakeSnapshotToBuffAttribute-66236.asm)（66236），然后复制 incoming.blackboard。snapshot 更新 retained source 的 `RuntimeAttributesSnapshot`，没有调用 `_LoadAttributesModifier`。`_FillRemainingTime` 还会通知 owner.OnBuffExtend；特定内容的额外响应未穷尽。

**I**：`takeSnapshotWhenExtend` 不能直接等价为 `reloadModifiers=true`。现有 Data planner 将两者绑定，不由上述通用分支支持；不能反过来断言任何特化内容都不会在 OnBuffExtend 重载属性。

### 8.3 覆盖组选胜与候补

以下直接检查普通 OverrideGroup 队列，未从 UNIQUE 拒绝推导整体竞争：

| 规则 | 原生锚点与范围 |
| --- | --- |
| 高 priority 优先 | **N**：`Buff.CompareTo`（66089）反向比较 priority；queue Add 按比较结果插入，`_DoUpdateInternal` 选首个未结束者。 |
| 同级先分配者优先 | **N**：CompareTo 按 instanceUid 升序；`OnAllocate`（66119，`0x1806d0399–3ea`）递增全局 counter 后写 UID。**I**：普通创建链对应更早分配的实例，不要求项目复制全局计数器。 |
| 未生效的赢家仍可占位 | **N**：`_DoUpdateInternal`（66292，`0x1806e10ec–1106`）选候选只看 isFinished，不按 actuallyEnabled 过滤。它设置手动启用后，`_UpdateIsEnabledIfNotFinished` 才因 silence／stun 等决定实际启用；被压制的赢家不会自动让位。 |
| 移除赢家后启用候补 | **N**：`OverrideGroup.Remove`（66284）成功移除后重新 `_DoUpdateInternal`；RefreshPriority 则移除、重插、重选。 |

证据见本批 [`CompareTo`](../evidence/unit-audit-20261110/buff-attributes/native/CompareTo-66089.asm)、[queue Add helper](../evidence/unit-audit-20261110/buff-attributes/native/helper-0x1853ff1d0.asm)、[`_DoUpdateInternal`](../evidence/unit-audit-20261110/buff-attributes/native/_DoUpdateInternal-66292.asm)和 [`Remove`](../evidence/unit-audit-20261110/buff-attributes/native/Remove-66284.asm)。[PRTS 术语释义固定版本](https://prts.wiki/index.php?title=术语释义&oldid=448536)区分先获得者生效与高效果优先，可作内容层互证，不独立证明通用队列算法。

**P 边界**：Core `Effect.enabled=false` 是调用方的持久启用意图；原生 group 会重写 manuallyEnabled，实际生效还受其他条件控制。原生支持“当前未生效者仍占组位置”的竞争形状，不能单独证明项目 setter 的持续性、重入时序，或任意 group.id 与原生 key／来源分组的完整映射。整体竞争也不替代 UNIQUE 接纳、STACK 合并等其他政策。

### 8.4 配置证据与尚未决定的范围

当前[选中配置](../evidence/unit-audit-20261110/buff-attributes/configurations.json)分别含 `astesi_t_1[Stack]` 的实际 cap=5、`sbell2_e_002_trait[interval]` 的实际无限／有效 cap=5、`enemy_shushu_support` 的 cap=20／有效 cap=1、`ascln_t_1[debuff]` 的达上限刷新，以及 EXTEND、EXTEND_TIME 的非默认实例。这些是 **N-配置**；本批没有逐个补齐其 prefab→Ability→模板启动条件，不能全部提升为已闭合的实战链。

全部 9054 个当前 holder 模板中，EXTEND+snapshot=true 仅命中 `gamecity_miner_byokai_archook_reward`。**G**：本批没有受支持常规内容的完整可执行正例；该有限集合的命中不能证明全游戏有无此需求。**P**：独立 Data Buff planner 的支持范围、公开协议及其期限表示仍需项目决定，算法有证据不等于该中间接口必须保留。本次补证不要求恢复人工动态 cap 或任意 null／0 时间测试矩阵。

## 9. 2026-11-11 补核：覆盖组身份与 STACK 到期

本节补齐组键构造、组的登记／清理，以及有限时长实例到期后的减层／结束链。**N** 为本次静态原生分支或配置直接证实，**I** 为调用链推导，**G** 为未验证范围。输入仍为 Windows x64、metadata v29，与第 8 节指纹相同；方法重新按全名定位。完整提取、字段、字面量、配置、复跑入口和限制见[本批证据](../evidence/buff-group-expiry-20261111/README.md)。没有运行游戏或验证 XLua／hotfix，本节不修改项目 Effect 契约。

### 9.1 原生职责与安装链

| 对象 | 本问题中的职责 |
| --- | --- |
| BuffData | 保存原始覆盖字段、合并类型、层数上限和到期配置；GetOverrideKey 计算基础键。 |
| Buff | Reset 形成最终 overrideKey，保存本实例的来源、实际层数、有效上限、lifeTime、remainingTime 和到期清层标记；OnTick 处理到期。 |
| 宿主的 BuffContainer | 保存实例列表、UID 索引和最终键到 OverrideGroup 的字典，完成登记、组查找、结束扫描及移除。 |
| OverrideGroup | 保存组内队列、当前合并类型及实际／有效上限，执行第 8 节的接纳、合并和选胜；不持有每层独立时钟。 |
| BattleController | 接收延后回收登记，在指定帧把已清理 Buff 交回对象池。 |

**N**：[NewBuff（66301）](../evidence/buff-group-expiry-20261111/group/native/NewBuff-66301.asm) 在 Reset 后登记列表与 UID，已初始化宿主执行 OnStart，再处理结束检查及覆盖组。最终 overrideKey 为空时直接启用，否则 EnsureOverrideGroup 后执行组的接纳和更新。因此组身份属于**接收者容器内的最终键**，不属于全战场；开始程序也不以已经通过组接纳为前提。Reset 中的独立键迁移早于新实例登记，不能把它误写成接纳之后的动作。

### 9.2 基础键与最终键

**N**：[BuffData.GetOverrideKey（31510）](../evidence/buff-group-expiry-20261111/group/native/GetOverrideKey-31510.asm) 在 `0x18237ae38–ae6e` 的普通分支为：

```text
disableOverride=true → 基础键为空字符串
否则 overrideKey 非空 → 使用 overrideKey
否则 → 使用 buffKey
```

**N**：[Buff.Reset（66092）](../evidence/buff-group-expiry-20261111/group/native/Reset-66092.asm) 随后才处理 independentCharacterSource；不是由 GetOverrideKey 一次决定最终身份。

| independentCharacterSource | 来源事实 | 最终键 |
| --- | --- | --- |
| false | 任意 | 基础键 |
| true | 来源能收窄为未被 Unity 判空的 Character | `基础键 + "^" + Character.cardUid` |
| true | 来源为空、非 Character 或被 Unity 判空 | 先构造 `prefix = 基础键 + "^"`；取当前覆盖字典中首个 StartsWith(prefix) 的键，无命中则使用 prefix。 |

Character 的动态类型、`"^"` 和拼接格式均由[本次静态 usage 解码](../evidence/buff-group-expiry-20261111/group/literals.json)确认。`0x1806d6b33` 调用 [Character.get_cardUid（77135）](../evidence/buff-group-expiry-20261111/group/native/get_cardUid-77135.asm)，不是 BObject／Unit 的实例 UID，也不是角色模板 key。本节不从 getter 名称额外推导跨部署的身份政策。

**N**：[GetOverrideKeyCandidate（66326）](../evidence/buff-group-expiry-20261111/group/native/GetOverrideKeyCandidate-66326.asm) 的回退直接枚举当前字典键并做字符串前缀判断，不比较组优先级或来源有效性；本批不为字典枚举顺序赋予额外玩法政策。

**N**：有效 Character 分支还执行 EnsureOverrideIndependentKey 的普通逻辑：prefix 条目已存在、完整键尚不存在时，将**同一组对象**从 prefix 键迁到完整键。它不重建组，也没有改写旧组成员各自保存的 overrideKey。锚点为 Reset 的 `0x1806d6c4f–6cce` 和[独立入口（66327）](../evidence/buff-group-expiry-20261111/group/native/EnsureOverrideIndependentKey-66327.asm)。不能把空来源统一解释成一个与既有来源组完全隔离的新身份。

由此有一个容易遗漏的组合：**disableOverride=true 并不无条件保证最终绕过组。** independentCharacterSource=true 时，空基础键仍会变成 `"^<cardUid>"` 或以 `"^"` 为前缀的回退键，无匹配时使用 `"^"`。只有最终键为空，NewBuff 才走无组路径；不是重新检查原始 disableOverride。实际配置证据见 9.5。

### 9.3 组政策、空组与清理

**N**：[EnsureOverrideGroup（66302）](../evidence/buff-group-expiry-20261111/group/native/EnsureOverrideGroup-66302.asm) 按最终键查字典：

- 已有非空组直接复用，不按 incoming 的 descriptor 改换合并类型及 cap。
- 键不存在时创建组；已有组队列为空时复用并重新配置组。两种情况都从本次 Buff 的 data／blackboard 取得政策。
- STACK 的实际与有效 cap 分别读取黑板，缺值使用各自 descriptor；非 STACK 的普通初始化采用实际 cap=1、有效 cap=-1。

因此，overrideType、priority、cap 不是分组键。相同最终键先决定是否进入同一组，组内再依据当前政策合并或竞争；组清空后的下一次应用可以重新确定政策。具体五类分支沿用 8.2，不增加另一套解释。

**N**：普通成员 Remove 会重新选胜，但不因组空就删除覆盖字典条目；容器 [ClearOnRecycle（66350）](../evidence/buff-group-expiry-20261111/group/native/ClearOnRecycle-66350.asm) 会清空覆盖字典和 UID 索引。`TryGetOverrideGroup(Buff, ...)` 读取实例保存的最终键做直接查找，不重新根据当前来源计算身份。

### 9.4 到期减层、结束与回收

**N**：Reset 在 `0x1806d6837–683b` 将 data.clearAllStackCntWhenTimeUp 复制到 Buff 实例。到期行为由实例实际层数和这个标记决定，不由 OverrideGroup 调度，也不在到期处再次检查 overrideType。

[Buff.OnTick（66126）](../evidence/buff-group-expiry-20261111/expiry/native/OnTick-66126.asm) 的普通链为：

```text
尚未开始且未结束 → OnStart
未结束 → 预处理 delta
已启用且周期满足 → OnTrigger
remainingTime >= 0
  → remainingTime -= delta
  → remainingTime <= 0 时 DecStackCntOrMarkFinish(true, true, 1)
累加 existingTime
```

**N**：[DecStackCntOrMarkFinish（66102）](../evidence/buff-group-expiry-20261111/expiry/native/DecStackCntOrMarkFinish-66102.asm) 的参数是 updateOverrideMap、isTimeUp、decCnt。普通路径先在 `isTimeUp && clearAllStackCntWhenTimeUp` 时将实际层数置零，再执行 `max(0, stackCnt - decCnt)`：

| 到期时事实 | 本次结果 |
| --- | --- |
| 多层、clearAll=false | 减一层，保留同一 Buff；remainingTime 重置为本实例完整 lifeTime，调用 _DoUpdateStack。 |
| 多层、clearAll=true | 层数归零，remainingTime=0，MarkFinish。 |
| 最后一层 | 两种配置都层数归零并 MarkFinish。 |

这是**一个实例、一份剩余时间、逐次减层**；不是每层记录自己的安装期限。重置使用实例 lifeTime，不取 incoming 的任意剩余时长。减层保留同一实例和来源，不重新执行 Reset／OnStart，也不在该分支重置 existingTime 或周期触发器。`_DoUpdateStack` 仍按有效 cap 决定是否重载 retained 的属性；实际层数高于有效 cap 时，不因此额外放大贡献。

`0x1806ced51–ced64` 直接重置时长后返回，OnTick 没有补处理循环。因此单次 delta 超过多个时长也只减一次，不结转超出时间；lifeTime=0 也没有一 Tick 保底，本次只处理一层，余层到后续 OnTick 再处理。这是静态分支事实，不自动要求项目采用相同的微时序。

**N**：OnTick 的 isEnabled 判断只守卫周期 Trigger，扣时在其分支之外；[delta 预处理（66254）](../evidence/buff-group-expiry-20261111/expiry/native/_PreprocessDeltaTime-66254.asm) 根据状态抵抗、元素恢复速度与 slowdown 调整 delta，没有按 enabled 暂停。只要容器继续调度，有限时长的普通覆盖候补／停用实例仍倒计时；不能将原生“未生效”直接等同项目 DURATION 暂停。

**N**：层数归零后的收尾分三个时点：

1. [MarkFinish（66101）](../evidence/buff-group-expiry-20261111/expiry/native/MarkFinish-66101.asm) 先禁用，再写 finished，处理派生 Buff，并更新覆盖组。有效输出可立即撤销，候补可重新参与选胜；这一步不是 OnFinish。
2. [BuffContainer.Tick（66349）](../evidence/buff-group-expiry-20261111/expiry/native/Tick-66349.asm) 完成 OnTick 和 OnLateTick 两次遍历后，[结束扫描（66355）](../evidence/buff-group-expiry-20261111/expiry/native/_CheckFinishedBuffs-66355.asm)移除实例列表和 UID 登记，调用 _FinishBuff，执行一次 Finish 程序、属性／异常抗性移除及 owner.OnBuffFinish，并登记下一帧回收；返回后再从覆盖组移除。显式 ForceRefreshFinishedBuffs 也可进入结束扫描。
3. [RecycleBuffNextFrame（65727）](../evidence/buff-group-expiry-20261111/expiry/native/RecycleBuffNextFrame-65727.asm) 已按 fixedFrameCnt+1 登记回收桶；对应帧的 BattleController 回收阶段将其交回池，调用 Buff.OnRecycle 清理 UID 等复用字段。物理回收延期不表示仍在容器或仍生效。

第 2 步依据 [_FinishAndRemoveBuff（66362）](../evidence/buff-group-expiry-20261111/expiry/native/_FinishAndRemoveBuff-66362.asm)和 [_FinishBuff（66363）](../evidence/buff-group-expiry-20261111/expiry/native/_FinishBuff-66363.asm)；第 3 步的池分派和跳转表边界见[到期证据说明](../evidence/buff-group-expiry-20261111/expiry/README.md)。这是普通自然到期路径，不把所有显式移除入口都解释为等待 Tick 尾部。

### 9.5 实际配置与范围

当前配置、Prefab 引用及其证据等级集中在[内容摘录](../evidence/buff-group-expiry-20261111/content/configurations.json)，普通分支与社区概述的区别见[PRTS 记录](../evidence/buff-group-expiry-20261111/content/prts.json)。配置存在、原生调用分支和实际运行观测分别解释；没有排除热更新，也没有运行游戏验证。

| 配置样本 | 已确认的引用与区别 |
| --- | --- |
| 浊心斯卡蒂第二天赋 | 角色的 AuraAbility 实际携带 skadi2_t_2；模板两个分支创建不同 buffKey，均使用 overrideKey=skadi2_t_2[atk]。证明 buffKey 与组基础键不是同一身份。 |
| 浊心斯卡蒂三技能鼓舞 | 技能 Aura 实际携带 disableOverride=true 的 skadi2_s_3[atk]，关联 atk_to_atk[final_addition] 模板；不能仅从模板名猜覆盖政策。 |
| 阿斯卡纶第一天赋 | 角色 PassiveBuffAbility 携带 ascln_t_1；模板创建有限时长 STACK 的 ascln_t_1[debuff]，clearAllStackCntWhenTimeUp=true。 |
| 妮芙第一天赋 | 角色 PassiveBuffAbility 携带 nymph_t_1；事件 61 的 listener 描述同时开启 disableOverride 和 independentCharacterSource，owner=MODIFIER_TARGET。模组版也有同样字段组合，本批只闭合普通版角色根绑定。 |
| 某种天命 | 固定镜像 EnemyData 的 enemy_10111_ymgpck 指向同名 Prefab；本机 enm_pfb_26.ab 的 Talents/PushEnemy AuraAbility 携带 ymgpck_t[push_enemy]，模板条件分支创建有限时长 STACK 标记，clearAll=false、cap=1000。这是静态引用链；默认 lifeTime=0，durationKey=hit_count_duration 的非零最终值未定位，不能声称已观测正持续时长后的自然衰减。 |
| pallas_s_3[peak] | 保留显式键＋来源独立的非默认描述；该模板的完整根启动链未补齐。 |

**N+G**：妮芙 listener 没有开启特殊 source；[CreateBuff.Execute（98388）](../evidence/buff-group-expiry-20261111/group/native/Execute-98388.asm) 的默认来源读取当前 `Snapshot.buff.source`，不是 owner 或一般 Context.source。如果父天赋 Buff 的来源是有效妮芙 Character，最终组键为 `"^" + cardUid`；本批没有单独重证父天赋的初始来源，所以只作条件结论。当前 holder 的 9054 个模板中，这两个 listener 是仅有的两项 disableOverride＋independentCharacterSource 同开描述；统计不覆盖全部 Prefab、BuffDB 或运行覆盖。

麻痹 palsy[stack] 的两个创建节点均开启 loadFromDB，节点默认时长不能代替数据库解析后的配置；本批没有将它们当作普通有限寿命逐层减层的正例。PRTS BUFF 页能互证一般 STACK 到期政策，但其禁用覆盖概述没有解释上述来源独立组合；组合条件以 9.2 的实际指令为准。

本次闭合的是覆盖组身份与 STACK 自然到期的普通原生架构。第 8 节仍缺的受支持普通内容 EXTEND+snapshot 完整执行正例不因本次调查自动解决；项目如何表达分组、来源与暂停时钟，也仍由后续架构讨论决定。
