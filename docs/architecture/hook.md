# Hook 集合与登记

本文规定类型化 Hook、宿主约束、登记与派发契约。四种伤害／治疗的阶段类型见 [结算 Hook 类型](vitality.md#16-结算-hook-类型)。

## 存储与领域职责

所有登记式 Hook 使用类型化 Key。属于 Unit 的登记统一存于不可变的 `Unit.hooks`；Battle 领域的登记存于各自的 Hooks 集合。只保存实际提供的条目，无登记时使用 `Hooks.empty()`。Definition 自身的 onStart、onInstall、onTick 等程序仍直接由对应实例调用，不转换成登记式 Hook。

各领域定义自己的键、Hook 类型和执行时点。集合只负责存取和组合，不广播、不排序，也不判断业务资格。

| 登记 | 存储位置 | 派发职责 |
| --- | --- | --- |
| Unit 的 enter／tick／prepare／leave | Unit.hooks | Unit 生命周期操作 |
| 伤害／治疗的 Formula、Output、BeforeReceive、BeforeCommit、Applied、Completed | 来源或目标的 Unit.hooks | 对应 Resource 业务 |
| HP Damage／Healing Receiving | 目标 Unit.hooks | Vitality 接收接口 |
| EP Damage Receiving | 目标 Unit.hooks | Elemental 接收接口 |
| HP damageCommitting／damageCommitted | 目标 Unit.hooks | Vitality.commitDamage |
| HP Damage targetKilled | 击杀者 Unit.hooks | 本笔 Apply 登记的目标临时 prepare Hook |
| Action beforeRelease／released | 宿主 Unit.hooks | Action 释放操作 |
| Skill 资源与 Activation 通知 | 宿主 Unit.hooks | Skill 业务 |
| Blocking acquired／released | 双方各自的 Unit.hooks | Blocking 关系操作 |
| Burst 与实际 EP 变化通知 | 宿主 Unit.hooks | Elemental 业务 |
| Unit 离场的全局观察 | Battle.unitHooks | Unit 完整离场操作 |
| 部署观察 | Battle.deployment.hooks | Deployment 业务 |

HP Damage、EP Damage、HP Healing、EP Healing 各自定义精确键，不建立四种 Context 的联合。接收与能力事实通知仍由对应领域定义和派发；存储一致不合并它们的业务时点。

Vitality.damageCommitting 接续 `Health { hp, minusHp }`，Context 提供 request 与 previous；damageCommitted 接续 void，Context 提供 request 与已固定的 application。后者在实际写入与报告确定后、普通 Applied 前执行，后继变化不重写本次报告。两者均不自动继承 Apply 的排除项；恢复与 MaxHP Change 不派发它们。完整契约见[伤害写入前后](vitality.md#02-伤害写入前后)。

## 类型化键与集合

键对象提供运行时身份，name 只用于诊断。Content 与派发者导入同一个领域键，不重新创建同名键查找登记。

`Key<H, Owner extends object = object>` 关联完整 Hook 类型 H 和最低宿主要求 Owner。Owner 只参与类型检查，不保存或查找宿主，不增加运行时登记。公共集合接纳不同 Owner 的键；通用 Unit 写入由键推导 `Change<Unit & Owner>`，交由 update 的 Ref 证明宿主能力。

```typescript
declare function key<H extends Entry, Owner extends object = object>(
    name: string,
): Key<H, Owner>;

declare class Hooks {
    static empty(): Hooks;

    get<H extends Entry, Owner extends object>(key: Key<H, Owner>): readonly H[];
    find<H extends Entry, Owner extends object>(key: Key<H, Owner>, id: string): H | undefined;
    set<H extends Entry, Owner extends object>(key: Key<H, Owner>, entry: NoInfer<H>): Hooks;
    remove<H extends Entry, Owner extends object>(key: Key<H, Owner>, id: string): Hooks;
    merge(other: Hooks): Hooks;
}
```

Key 保留特殊 ReceivingHook 的泛型 invoke，不将其放宽成普通 Hook<C, T>。写入由键确定类型，读取通过同一个键恢复类型；异构擦除集中在容器内部。Resource 的 [receiving.ts](../../src/core/battle/resource/receiving.ts) 共用 NORMAL／FIXED／CANCELLED 与转换构造函数，各业务绑定自己的 Reason 和 Context。FIXED 不恢复 NORMAL，CANCELLED 不恢复或改原因；固定及取消后的数值由 Hook 契约保证，不增加运行时纠正。

get 对未登记的键返回空集合。同键同 ID 的 set 替换原项并保留位置；新 ID 追加，remove 只移除对应项。merge 按 other 的键内顺序应用同一 set 规则。ID 的范围是所属集合 × Key × ID；不同键和宿主可以复用 ID。删除不恢复被覆盖的 Definition 旧项。

容器只要求 id；Entry 与数组 set／remove 复用 [common/collection/entries.ts](../../src/core/common/collection/entries.ts)。公共 `Hook<C, T>` 提供 `priority?: number`，所有登记式 Hook 缺省为 0；同一派发集合按 priority 降序，同优先级保持登记顺序。排序不改变存储顺序，也不跨领域阶段重排。Definition 的单一回调不增加 priority。

普通 HIT 回复与伤判共用 HP Damage.receiving，前者约定使用 10000 量级的高优先级并原样返回 Pending，普通伤判通常使用缺省 0；不增加独立派发轮次或强制分区。beforeReceive 与 receiving 使用所属业务相同的 ReceivingHook 类型、不同 Key，分别在准入前后派发，接续同一 Pending。

## 固有声明与初始化

Unit Definition、创建输入和运行实例使用同一种 Hooks 集合。领域导出精确键，例如 `hpDamage.sourceApplied` 与 `hpDamage.receiving`；接收键携带 Vitality／Elemental 宿主要求。Content 直接声明：

```typescript
hooks: Hooks.empty().set(hpDamage.sourceApplied, {
    id: "talent/after-damage",
    invoke(battle, context) {
        return { state: afterDamage(battle, context), value: undefined };
    },
}),
```

固有 Hook 不必先包装为 Effect，也无需通过 enter 登记。静态集合可共享，运行时更新产生新集合，不修改 Definition。

初始化从创建输入的 Hooks 开始，按 Capability initializer 顺序 fold，最后 merge Definition.hooks；各 initializer 保留已有登记，可在生命周期键内前置必要清理。全部固有 Hook 在 Unit 登记和任何 enter 程序之前就绪。

Deployment 的初始程序、Card.unitHooks、Request.hooks 和 Predefined 创建输入使用同一集合。Card 修改只影响以后创建的 Unit，不追溯修改已有实例。

## 动态登记

```typescript
declare function setHook<H extends Entry, Owner extends object>(
    key: Key<H, Owner>,
    entry: NoInfer<H>,
): Change<Unit & Owner>;

declare function removeHook<H extends Entry, Owner extends object>(
    key: Key<H, Owner>,
    id: string,
): Change<Unit & Owner>;
```

所有 Unit 本地 Hook 使用通用 setHook／removeHook，包括生命周期、接收与能力通知。Key 保留最低宿主能力，不能因入口统一而在错误的 Unit 上登记。Change 只修改 Unit.hooks，由 update 发布；登记本身不执行内容或关系维护。

临时 Effect 按启停程序登记、撤销自己的输出。B 的机制向 A 登记 Hook 时，B 负责在机制失效时撤销；A 注销自然移除其全部本地登记，不维护外置 Unit 订阅表。

Battle 归属的全局观察使用对应领域的 typed Key 与 Hooks 集合，经领域的 setHook／removeHook 修改，不要求观察者具有被观察能力。

## 派发与生命周期

公共 dispatch 接收固定 Context、初始 current、candidates／find 与可选 stop。candidates 返回本次候选 Hook 条目，领域按本次 Options 过滤排除项；公共派发器在入口一并采样 ID 与 priority，稳定降序排序后固定本轮顺序；逐项判断停止条件，从最新 BattleState 查登记及资格、检查 accepts、执行 invoke。新增 ID 不进入本轮，替换同 ID 使用最新版本，删除则跳过；替换后的 priority 不重排本轮。嵌套派发独立取候选。

公共集合不规定 PRESENT 资格。Resource 常规阶段要求宿主 PRESENT；专属接收保留所属能力的资格与停止条件。Skill、Elemental 的结束事实通知与 HP Damage.targetKilled 允许仍登记的 LEAVING 宿主参与，不能套用来源输出的 PRESENT 限制。

Blocking 每条关系在第一个业务回调前同时采样双方候选及 priority，分别固定各自顺序，随后始终先 Blocker、后 Blockable，逐项读取最新登记；Blockable 的高优先级不越过 Blocker 阶段。ACQUIRED 只继续仍属于原 Relation 的响应；RELEASED 是解除后的历史通知。后续关系到轮到它时再取候选，不提前冻结整批通知的登记。

Unit 的 enter／tick／prepare 同样固定优先级排序后的候选和本次 Context。enter／tick 每项前要求宿主 PRESENT；prepare 在发布 LEAVING 后、自动请求依赖者结束前执行，保留原 Departure；DEATH 分支携带调用者给定的 killer。leave 在注销前从最新 Unit 捕获 Hook 对象快照及其优先级顺序，注销后执行这些程序并检查 accepts，不查询已删除宿主。登记快照与 Departure.unit 的历史采样分别处理。

HP Damage 确认本笔死亡且 killer 非 null 后，在受害者临时登记 priority=10000 的 Unit.prepare Hook，由其 invoke 派发 killer 本地 targetKilled；普通 prepare 业务约定低于 10000，来源后继先于受害者普通准备业务；10000 仅是顺序约定，更高优先级及同级先登记项仍按公共规则执行。只在本笔确认死亡时登记，不预装于 Unit 或 Vitality，不增加全局 Prepare。targetKilled 使用完整死亡 Departure，首次结束与 Prepare 去重仍归 Lifetime。

动态登记不重放已完成阶段。sourceApplied 与 targetApplied 使用不同键，按目标、来源顺序执行；同一 Unit 承担两个角色时仍分别通知。

## 本次调用的 Hook 排除

公共 Hook 模块提供 `Exclusion`、可选 `exclude` 的 `Options` 和匹配函数 `excluded(options, key, id)`，公共 dispatch 不解释键或排除政策。Exclusion 是 `[key, id]`：key 使用键对象身份，id 为 string 或 null。null 排除该键的整个阶段，string 只排除同键的指定登记；未匹配项正常派发。不按 name 匹配，也不修改登记、current、Request 或计算结果。

四种 Resource 的 Calculate 与 Apply 分别接受可选 `Options.exclude`。选项仅对这次操作负责派发的 Hook 生效：Calculate 不把选项保存进 Calculated，Apply 不继承 Calculate 的选项；嵌套业务也不会自动继承。Apply 将选项传给自己调用的专属接收阶段；HP Damage 的临时 Prepare 闭包还将本笔排除项用于 killer 本地 targetKilled，按其 Key／ID 过滤；临时 Unit.prepare 登记本身不受该排除影响，也不改变其他生命周期或嵌套操作。Vitality 内部 damageCommitting／damageCommitted、其余提交事实通知和生命周期操作不自动继承排除，保持原有完整业务。

```typescript
type Exclusion = readonly [key: Key<any, any>, id: string | null];

interface Options {
    readonly exclude?: readonly Exclusion[];
}
```

HP Damage、EP Damage、HP Healing 的 ApplyOptions 可另带本业务 `forbidden?: ReadonlySet<Reason>`，它不是 Hook 排除项。Apply 将其或新建空集合固定为 ReceivingContext.forbidden，各 Hook 显式用于 cancel，Commit／Applied 继承；嵌套业务独立选择选项。EP Healing 的 beforeReceive 使用简单 Pending，不提供专属 receiving 键或 Reason，也不增加该字段。完整契约见 [接收工作值](vitality.md#接收工作值数值固定与取消)。

同一 Key 若在本次操作的多个宿主上派发，匹配项作用于所有这些派发；不额外引入宿主筛选。sourceApplied／targetApplied 等已有不同键仍可独立排除。排除 HP Damage.receiving 整轮也排除普通 HIT 回复；只排除某项时使用对应 ID。排除整个阶段不执行其 accepts／invoke，排除单项保留其他候选的顺序、资格与同步重入；它不等于取消伤害，也不绕过基础目标前提或接收 Restriction。
