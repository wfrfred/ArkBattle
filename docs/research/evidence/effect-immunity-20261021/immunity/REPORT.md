# Buff 接受、异常免疫与净化：当前客户端复核

范围：安装于本机 Windows 客户端的 IL2CPP 原生常规分支及真实 buff_template_holder 配置。未运行游戏，未确认实时 XLua 覆盖。方法索引使用当前 metadata 重新查询；旧 Case A 的 NewBuff64730 等索引不能直接复用，当前为65310。manifest.json 固定二进制及配置哈希。

## 直接证实：三个不同机制，不是统一 canInstall

|机制|当前原生入口|语义|
|---|---|---|
|一般异常 Immune|Attributes.GetAbnormalFlag[64279] @0x180649280；GetAbnormalImmune[64280] @0x180649370|按异常 flag 的独立计数抑制普通 flag 的有效查询；不是按 Buff ID 拒绝整个实例。|
|异常 Anti|BuffContainer._CheckThroughBuffAbnormalAnti[65363] @0x18067e9f0；_FilterBuffAbnormalAnti[65367] @0x18067f670|安装时拒绝含被禁止 flag 的整个 Buff；安装 Anti 提供者时结束相交的旧 Buff。|
|组合异常 Immune|Attributes.CheckAbnormalComboImmune[64293] @0x180648860；AbnormalComboManager.CheckAbnormalComboImmune[64316]|独立组合类型计数。SLEEPING=0，SHELTERING=1，ISOLATE=2；与普通 flag 的 Immune、Anti 不同。|

### 1. 一般 Immune 是单个异常事实是否生效

当前 Attributes 字段：+0x20 m_abnormalFlagsCounter；+0x28 m_abnormalImmuneCounter；+0x30 m_abnormalAntiCounter；+0x50 m_abnormalComboMgr。Buff 的对应 mask 也分开保存。

GetAbnormalFlag[64279] 在0x1806492d2检查对应 Immune count；count<=0 且普通 flag count>0时返回true（0x1806492ea..2f2）。否则转入组合管理器的有效 flag 位图检查（0x1806492ff..934c）。所以不能把所有有效状态简化为一个普通 count && !immune 公式，组合生成的 flag 有独立分支。

本方法不修改容器，不删除 Buff。NewBuff 的普通接受流程没有把 GetAbnormalImmune 当成通用拒绝条件。Buff.OnEnable[65141]、_UpdateIsEnabledIfNotFinished[65267] 把整个 modifier 登记到 Attributes，未见“因其中一个 flag 被 Immune 而禁用整个 Buff”的通用分支。因此，复合 Buff 的一个异常 flag 被免疫，不能据此推断其其他 flag、属性及动作全部消失。

**恢复边界**：读法支持“保留普通 flag 计数，在免疫计数撤销后再次查询可能有效”的推断；本轮没有闭合所有具体 Buff 的计时、状态退出、动作净化链，也未执行客户端，不能声称每种异常都会在免疫结束后恢复。Content 完全可能另行结束实例。

### 2. Anti 既阻止新增，也净化旧 Buff

Entity.AddBuff[66544] @0x1806ef340在0x1806ef418调用 BuffContainer.NewBuff[65310] @0x180668f20，不经过普通 TargetSelector/Purpose。

NewBuff顺序：

```
0x180668fc2 _CheckFinishedBuffs[65361]
0x180668fd1 _CheckThroughBuffAbnormalAnti[65363](input.data)
  false -> 0x1806694ee return null
...
0x1806693c2 Buff.Reset[65112]
...
0x1806695c5 Buff.OnStart[65143]
0x180669635 _FilterBuffAbnormalAnti[65367](newBuff.abnormalAntiMask)
```

_CheckThroughBuffAbnormalAnti 遍历输入 data.attributes.abnormalFlags；0x18067eb34读取目标 Attributes.GetAbnormalAnti[64282]。遇到任意一项禁止即返回false（0x18067eb3b..4c），在新实例 Reset/OnStart前拒绝整个Buff。不是按 Buff key 匹配。

_FilterBuffAbnormalAnti遍历已有Buff，0x18067f824调用 Buff.CheckAbnormalFlagAnti[65253]，相交则0x18067f839 MarkFinish[65121](true)。CheckAbnormalFlagAnti在0x180680698..6b8检查本Buff的abnormalFlagMask与antiMask是否有交集，返回的是整个实例是否应结束。没有“从旧Buff剥离一个flag”的处理。

因此：同一复合Buff里若含X、Y，Anti(X)会拒绝/结束整件；普通Immune(X)本身只影响X的普通有效flag读取。这两个行为不能压成统一布尔安装免疫。

### 3. 组合 SLEEPING 的资格查询不是整个 Buff 的通用接受查询

CheckAbnormalComboImmune[64293]读取 Attributes+0x50 的 ComboManager，再读取其+0x18的组合免疫计数，返回指定combo计数是否>0（0x18064889a..8ba）。它不读取待安装Buff，不比较buffKey，也不调用BuffContainer。

这可由具体 Selector/Filter 在选取“准备使目标睡眠”的候选时使用；仅凭这个查询不能认定所有施加入口都已自动拒绝SLEEPING，更不能以“睡眠免疫”推导Effect定义ID免疫。实际具体节点是否另外做检查，需按调用者证据解释。

### 4. 另有来源/接收者配对的施加资格，仍在安装侧

NewBuff[65310]在0x1806692da..9342：若有效source具有 flag37 BUFF_ADD_CAN_BE_CANCELED_IF_DEFENSE，且owner具有flag38 DEFENSE_BUFF_ADD_IF_CANCELABLE_BUFF，则返回null。它不要求 Targeting 参与，也不是前述普通/组合异常免疫。这个证据仅说明存在独立施加契约，本轮没有穷尽其实际内容使用，不能据此新建通用Purpose。

## 真实配置证人

selected-templates.json 包含完整父模板与嵌套 BuffData；来自真实 config/buff_template_holder.ab，不是合成示例。

- immune_common模板派生 immune_common[derived]：abnormalImmunes=[STUNNED,FROZEN,SILENCED,LEVITATE]，abnormalAntis=[]。说明两类独立配置不是空壳。
- mlyss_wtrman_during_anim：普通 flags=[FORCE_DISARMED,SKILL_NOT_ACTIVATABLE,DISABLE_COMBAT]，同时 immune和anti均含STUNNED,FROZEN。配置显式组合“抑制有效异常”与“拒绝/净化Buff”。
- blaze2_t_2[reborn_state]：immune=[]，anti=[STUNNED,FROZEN,STUNNED_NO_AMPLIFY_DAMAGE]。不能把Anti当成Immune的同义字段。
- ltnova_s[purify]：immune=[]，anti=[STUNNED]。
- [g]rogue_4_lock_all_chars：同一Buff含STUNNED,TARGET_FREE及BLOCK_CNT=-99属性，证明确有复合实例。若对此类实例施加Anti(STUNNED)，按已确认的交集算法整件结束；这里只是算法应用推断，不声称实战存在这个特定组合。

## 对当前设计问题能支持的结论

1. Effect接受、生效抑制、已有实例净化与候选提前过滤是可观察上不同的机制。
2. 以“Effect id”作为统一免疫键不足以表示普通/组合异常种类免疫，也不足以表示部分影响被抑制。
3. 直接附加效果路径客观绕过Targeting，因此不能仅在Targetable实施实际施加/生效保护。
4. 特殊Filter可以查询具体领域规则以排除候选；是否排除影响换选目标，必须有内容依据，不能默认对所有Effect索敌执行。
5. 本轮研究不推荐完整API，更不要求复制官方计数器/位图；先保留这些可观察差异。
