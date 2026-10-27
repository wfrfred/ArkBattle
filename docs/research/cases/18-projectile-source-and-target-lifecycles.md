# Projectile：Source 与 Target 生命周期

研究日期：2026-10-21，项目对照 `c40d79b5`。本轮只确认来源／目标的死亡、撤退、暂时消失及其对普通弹道的影响；不设计 Definition、State 或新接口，不修改源码。

## 1. 证据与三个不同的资格

依据本机原生 fallback 与实际 Prefab；没有执行客户端注入、实机录屏或核实活跃 XLua 替换。客户端身份、选定原生指令、代表配置与校验值见 [manifest.json](../evidence/projectile-lifecycle-20261021/manifest.json)。

| 资格 | 原生检查 | 与其他资格的区别 |
| --- | --- | --- |
| 实例身份有效 | `ObjectPtr.IsValid / Lock`，保存的身份与对象当前身份一致 | 不要求 alive，不检查暂时消失或挂点空间资格 |
| 仍存活 | `ValidAndAlive`：身份有效，再调用 `Entity.alive` | 普通 Entity 要求状态机运行且 HP > 0；Character 另排除 dummy／dying |
| 参与空间／普通索敌 | Collider、isDisappeared、TargetFree 等各自检查 | 暂时消失可以禁止普通索敌，却保留有效且存活的身份 |

这不是一套可以互换的“Unit 有效性”判断。`ObjectPtr.IsValid` 的闭合体为 `0x185159fc0`；`ValidAndAlive` 的闭合体是 `0x18449ab40`，后者额外调用 alive。不能因名字里都有 valid 就混为一个契约。

分项记录：[死亡与撤退](../evidence/projectile-lifecycle-20261021/target/REPORT.md)、[暂时消失](../evidence/projectile-lifecycle-20261021/presence/REPORT.md)、[来源与伤害](../evidence/projectile-lifecycle-20261021/source-damage/REPORT.md)、[来源依赖](../evidence/projectile-lifecycle-20261021/source-binding/REPORT.md)。下文区分直接证实与代码推论。

## 2. 原目标死亡、撤退和暂时消失

以下是普通 Advanced／Paracurve 追踪和已保存原目标的保底入口，不泛化为所有特殊运动。

| 原目标状态 | 运动读取位置 | Reached／Stop 的原目标保底 |
| --- | --- | --- |
| HP 已归零，尚未回收，挂点仍有效 | 仍可读当前挂点，包括死亡动画中的位置变化 | alive=false，拒绝 |
| 普通撤退完成，身份已回收 | 使用最后保存的目标坐标 | 身份失效，拒绝 |
| 标准路线暂时消失，身份和 HP 仍有效 | 挂点仍可读，不必立即切记忆坐标 | 不检查消失本身，可以进入 Hit；后续接收规则另判 |
| 之后在别处重新出现，仍是同一身份 | 后续追踪可读新的挂点位置 | 重新检查当时资格；仍受已命中／已尝试政策约束 |

不能统一表述为“目标不在场就停止追踪”，也不能统一表述为“死亡瞬间就冻结目标坐标”。普通位置读取只在目标挂点身份失效时退回记忆样本。

### 2.1 死亡与撤退的先后

`Entity.FinishMe` [66633] `0x1806f3360`：

```text
记录终结原因
StateMachine.Stop
OnFinish：清理单位的相关业务
GameMode.DestroyEntity：根据原因决定立即或延迟回收
```

状态机先停止，所以即使 HP 仍为正，已经 Finish 的 Entity 也不再 alive。死亡归零则更早就因 HP=0 不满足 alive。

默认 GameMode 对普通死亡采用延迟回收；因此存在 `身份仍有效 && alive=false` 的真实窗口。普通 Character 手动／静默撤退经 `Withdraw` [75944] `0x180a33970` → `Character.FinishMe` [75971] → Entity.FinishMe → 即时回收。死亡式撤退则沿死亡原因采用延迟回收，不与普通撤退混用。

`BObject.OnRecycle` [65035] 在注销后清零实例身份。重新部署或对象池复用会取得新身份，不会使旧弹道引用自动指向新实例。

### 2.2 追踪与保底是两条检查

`MountPoint.get_isValid` [71036] `0x1808b5ca0` 只检查 owner 的 ObjectPtr。`BasicMovement.GetTraceTargetMapPosition` [71223] `0x1808cafa0`：

```text
挂点身份仍有效：读当前挂点坐标，并由追踪运动保存本次样本
挂点身份失效：使用记忆坐标
```

这里没有 alive 检查。普通追踪不会仅因原目标 HP 归零统一 Stop。

`Projectile._DealHitTraceTarget` [71375] `0x1808db940` 则要求保存身份有效且 alive，不查询挂点、坐标、空间碰撞、isDisappeared 或普通索敌限制。通过后才设置原目标保底尝试标记并进入命中；命中历史仍独立生效。

**代码推论**：某次 Reached 因 dead／invalid 拒绝时，没有消耗保底尝试标记；如果同一身份后来恢复资格且弹道尚存，Stop 仍可重新检查。这不表示普通死亡／撤退会恢复旧身份，也不取消已经成功取得的尝试标记或命中历史。

## 3. 暂时消失保留什么

真实路线调用链为：

```text
DisappearCheckpoint.OnBegin → SetDisappeared(true)
  → Enemy 状态机切到 DisappearState
  → 状态效果／渐隐／GameObject 停用
  → 保留 Entity 身份、HP、Transform 和 MountPoint

AppearAtPosCheckpoint.OnBegin
  → 设置同一单位的新位置
  → SetDisappeared(false)
  → 退出消失状态并恢复表现
```

定位：`BasicCursor.DisappearCheckpoint.OnBegin` [70207] `0x180898ac0`；`AppearAtPosCheckpoint.OnBegin` [70216] `0x18088ff90`；`BObject.SetDisappeared` [65027] `0x180662be0`；`Enemy.OnDisappearChanged` [76479] `0x180a70650`。

SetDisappeared 修改标记并调用前后回调，没有注销、清零 UID 或停止整个状态机。消失 coroutine 停用 GameObject，但 retained Transform 仍可被 MountPoint 读取；停用不是对象销毁。DisappearState 还施加 BLOCK_FREE、INVINCIBLE、UNBALANCE_IMMUNE；这些不会直接把 HP 清零。

普通索敌有直接拒绝：`Entity.get_isTargetFree` [66501] `0x180706b40` 检查 isDisappeared 并返回 true。已有弹道的原目标保底不调用该查询。因此，**无法被普通索敌选中，与已有弹道不能再命中，不是同一个结论**。

这里“允许命中”只指 Hit 入场、回调和历史／次数；伤害、治疗、附着等后续操作仍有各自接收条件，不能据此声称消失期间一定扣血。原生的这个例子也保留坐标，不应被描述为数据层面真的没有位置字段。

SetDisappeared 自身还会同步派发事件和 Buff 回调。具体 Content 可以借此另行杀死／终结单位；上面的结论以回调之后身份和 alive 仍成立为条件，不替任意内容提供存活保证。

## 4. 来源死亡或撤退后，弹道与伤害分别判断

**直接证实**：普通弩手、维什戴尔普攻／三技能实际弹道没有统一的“来源死亡就停止”政策。它们可以继续运动与命中，受自身寿命、命中行为及显式外部操作约束。

普通伤害 Action 在执行时通过 `Projectile.get_source` [71293] `0x1808dd7b0` 重新 Lock 来源身份；这里不检查来源 alive。随后普通 `ApplyDamage.CreateDamageModifier` [96826] `0x18104a3d0` 分支为：

| 来源状态（弹道仍允许存活） | 普通 ApplyDamage 的 ATK 输入 | 伤害结算的 source |
| --- | --- | --- |
| 来源存活、身份有效 | 执行时当前 ATK | 当前来源身份 |
| 来源已死亡、身份尚有效 | 仍读取当前 ATK | 仍保留来源身份 |
| 来源已回收、旧身份失效 | 发射准备时缓存的 ATK | null |
| 原角色重新部署／对象池复用 | 旧引用不追随新身份，仍使用缓存 | null |

`ApplyDamage.PreprocessForProjectile` [96830] `0x18104aa40` 在为弹道准备伤害 Action 时采样 ATK。`CalculateDamageBySource` [78242] `0x180adf370` 则在执行时读取来源当前属性；无来源回退 `CalculateDamageByAtkNoSource` [78243] `0x180aded30` 明确创建 source=null 的 Modifier。

### 4.1 缓存 ATK 不等于缓存全部来源机制

普通缓存只有 ATK 数值，不包含一份来源 Buff／穿透／计算事件快照。来源失效后，不能凭该数值恢复来源侧实时穿透或普通计算事件。死亡清理已经改变的属性，也不能被概括成“仍使用死亡前完整属性”。

数值采样与来源归属可以独立：真实维什戴尔三技能配置缓存 ATK、同时保留有效来源。它使用专门的缓存弹道计算事件，而不是普通来源计算事件。这说明不应把一个来源引用、一个缓存数值和来源生命周期合为同一事实。

### 4.2 归属的准确范围

source=null 是**伤害结算来源为空**。普通角色输出伤害统计也通过 `Modifier.source → Character.characterId` 取得来源；为空时跳过这条来源角色统计。

Projectile 另有发射时保存的日志 ID，已确认用于弹道生成次数记录，未见它传入普通 Damage／Modifier。不能借它的存在声称来源伤害或击杀统计仍全部保留。最终击杀计数、奖励和任务归属没有在本轮穷尽；与发射历史、伤害来源分别记录。

## 5. 实际存在可选的来源生命周期依赖

暗索一、二技能是闭合的真实案例：

```text
skchr_rope_1 / skchr_rope_2 的 RangedAttack
  → projectile_rope_s1 / projectile_rope_s2
  → HarpoonProjectile，继承 LinkProjectile
  → stopWhenSourceInvalid 恒为 true
  → 推进时检查 ValidAndAlive(source)
  → 来源不再存活或身份失效：普通 Stop，执行收尾
```

`LinkProjectile.get_stopWhenSourceInvalid` [71169] `0x1808d3560` 返回 true；`Projectile.OnTick` [71344] 在 `0x1808d9ddd` 调 ValidAndAlive，失败且允许结束时进入 StopMe。Harpoon 拉拽协程 [71125] `0x1808e3890` 也检查来源与目标的 alive。

因此，来源 HP 归零、身份尚未注销，也足以使这类弹道发起终结。这与普通伤害 Action 仍能读取同一死亡来源的当前属性并不矛盾，它们使用不同资格。该绑定检查本身不检查空间消失；具体 Ability 仍可能通过其他事件独立结束它。

### 5.1 三种机制不能混为一项

- **来源存活依赖**：上面的 Link／Harpoon 政策。
- **来源管理集合**：managedBySource 在初始化时把弹道加入集合，供内容批量操作。暗索弹道本身这一值为 false，已经证明它不是来源存活依赖的必要条件。已确认的清理消费者是显式 `FinishManagedProjectiles` [98048]；未发现一个可以概括所有内容的“加入集合就自动随来源结束”约束。
- **Ability／Character 清理**：Character 可按配置清理 Ability 的弹道；RangedAttack 也可以在技能／行动结束时清理自己等待的弹道。这些路径调用普通 Interrupt／Stop，不能替换为无回调删除。

**领域边界判断**：需要表达可选的来源依赖，但 `source` 本身不意味着生命周期父子关系。本轮证据没有要求所有 Projectile 都拥有来源绑定，也没有要求为原生托管集合建立一套同名通用框架。后续 Type 设计应保留这项区分，再决定如何复用相同的内容政策。

## 6. 与当前 Stronghold 的一项可观察差异

当前 Unit 普通致死结算立即执行离场与移除；`resolveProjectileAttackPower` 查不到来源就回退 cachedAtk。原生普通死亡存在“已经不 alive，但身份仍有效”的窗口，其普通伤害还会读取当前 ATK。两者不能直接等同。

说明用数值：发射样本为 100，来源死亡后的当前 ATK 为 200，弹道在原生来源身份回收前命中，则普通路径读取 200；当前项目若已立即移除来源，会回退 100。这是条件成立时的数值差异，不是官方具体干员参数。

是否接受这一简化，或为需要的内容保留终结采样，是后续设计需要明确的政策。不能为抹平名词差异，默认新增整个尸体 Unit 运行阶段，也不能把潜在数值差异说成只是对象池实现细节。本轮只记录，不修改现有即时离场契约。

## 7. 调查边界

已足够确认普通追踪、普通结算来源、路线暂时消失、暗索来源依赖及两类真实 ATK 策略。没有推广到所有假死／重生、自定义 GameMode、反射／来源替换或所有特殊弹道，也未穷尽最终击杀奖励统计。此前停止调查中尚未闭合的普通延迟协程统一撤销政策仍保留，不因本轮结论自动解决。
