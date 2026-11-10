# Hook 集合与登记

本文规定类型化 Hook 集合、登记与派发契约。四种伤害／治疗的精确阶段类型见 [结算 Hook 类型](vitality.md#16-结算-hook-类型)。

## 存储与领域职责

Unit Definition 与运行实例都持有不可变的 `Hooks` 集合。集合按类型化键分组，只保存实际提供的条目；无 Hook 时显式使用 `Hooks.empty()`。基础 Unit 依赖公共集合类型，不枚举伤害、治疗等具体领域的 Context。

各领域定义自己的键、Hook 类型和执行时点。集合只提供存取和组合，不负责广播、阶段调度、排序或资格判断。

| 登记 | 存储位置 | 派发职责 |
| --- | --- | --- |
| Unit 的 enter／tick／prepare／leave | Unit.hooks | Unit 生命周期操作 |
| 伤害／治疗的 Formula、Output、BeforeReceive、BeforeCommit、Applied | 来源或目标的 Unit.hooks | 对应 Battle 结算领域 |
| HP ReceivingStarted、HP Damage／Healing Receiving | Vitality State | Battle 调用能力接收接口 |
| EP Damage Receiving | Elemental State | Battle 调用能力接收接口 |
| Burst 与实际 EP 变化通知 | Elemental State | Elemental 业务 |

HP Damage、EP Damage、HP Healing、EP Healing 分别定义精确键，不建立四种 Context 的联合。专属接收与能力事实通知归对应 Capability；登记由宿主持有，并随宿主注销而移除。

## 类型化键与集合

键对象本身提供运行时身份，name 只用于诊断。Content 与派发者导入同一个领域键，不通过重新创建同名键查找登记。

```typescript
interface Entry {
    readonly id: string;
}

declare const entryType: unique symbol;

interface Key<H extends Entry> {
    readonly name: string;
    readonly [entryType]: (entry: H) => H;
}

declare function key<H extends Entry>(name: string): Key<H>;

declare class Hooks {
    static empty(): Hooks;

    get<H extends Entry>(key: Key<H>): readonly H[];
    find<H extends Entry>(key: Key<H>, id: string): H | undefined;
    set<H extends Entry>(key: Key<H>, entry: NoInfer<H>): Hooks;
    remove<H extends Entry>(key: Key<H>, id: string): Hooks;
    merge(other: Hooks): Hooks;
}
```

Key 参数化完整 Hook 类型 H，保留特殊 ReceivingHook 的泛型 invoke，不把它重新放宽成普通 Hook<C, T>。写入类型由键确定；读取由同一个键恢复对应类型。必要的异构擦除集中在容器内部，Content 不承担断言，不从普通查询取得 any。

get 对无登记的键返回空集合。同键同 ID 的 set 替换原项并保留位置；新 ID 追加，remove 只移除对应项。merge 按 other 的各键内登记顺序应用同一 set 规则。ID 作用域是 Unit 身份 × Hook 键 × Hook ID，不同键可以复用 ID。删除不恢复被替换的 Definition 旧项。

容器只要求 id；Entry 与底层数组 set／remove 复用 [common/collection/entries.ts](../../src/core/common/collection/entries.ts)。需要优先级的领域在自己的实际 Hook 类型上声明 `priority?: number`：缺省为 0，按降序派发，同优先级保持登记顺序。生命周期 Hook 按登记顺序执行，不引入普遍优先级。排序由派发领域完成，不改变集合中的登记顺序。

## 固有声明与初始化

```typescript
interface Definition {
    readonly id: string;
    readonly hooks: Hooks;
}

interface Unit {
    readonly definition: Definition;
    readonly hooks: Hooks;
}
```

领域导出静态键，例如 `hpDamage.sourceApplied = key<AppliedHook>("damage.hp.sourceApplied")`。Content 直接组合完整 Definition：

```typescript
hooks: Hooks.empty().set(hpDamage.sourceApplied, {
    id: "talent/after-damage",
    invoke(battle, context) {
        return { state: afterDamage(battle, context), value: undefined };
    },
}),
```

固有 Hook 不必先包装为 Effect，也不需要通过 enter 注册。静态集合可以共享，运行时变更产生新集合，不修改 Definition。

初始化从创建输入的 Hooks 开始，按 Capability initializer 顺序 fold，最后 merge Definition.hooks；各 initializer 保留已有登记，可在自己的生命周期键内明确前置必要清理。所有固有 Hook 在 Unit 登记和任何 enter 程序之前完成装配，不依赖其键在集合中的枚举顺序。

Deployment 的初始程序、Card.unitHooks、Request.hooks 及 Predefined 创建输入使用同一 Hooks 集合。Card 的登记修改只影响以后创建的 Unit，不追溯修改已创建实例；实例仍可独立更新自己的 Hook。

## 动态登记

```typescript
declare function setHook<H extends Entry>(
    key: Key<H>,
    entry: NoInfer<H>,
): Change<Unit>;

declare function removeHook<H extends Entry>(
    key: Key<H>,
    id: string,
): Change<Unit>;
```

通用 Unit 接口允许修改所有已公开的 Hook 键，包括生命周期键。Change 只转换 Unit.hooks，经 Unit.update 批量发布，不因登记或撤销自动执行业务。Capability 专属 Hook 继续通过相应能力的 Change API 修改。

临时 Effect 按自身启停程序登记和撤销输出。B 的机制向 A 登记 Hook 时，B 仍负责在机制失效时撤销；A 的物理注销自然移除其全部本地登记，无需同步清理外置表。

## 派发与生命周期

可查询宿主的派发遵守公共协议：阶段开始时固定该键下的候选 ID 与执行顺序，每项执行前从最新 BattleState 读取当前 Unit 和对应登记，再检查资格与 accepts。同 ID 替换读取新版本，移除则跳过，新 ID 不进入已开始的派发。优先级变更不重排本次派发的候选；嵌套派发独立取候选。

Unit 的 enter／tick／prepare 同样使用上述动态登记协议。enter／tick 的 Context 固定为本阶段开始时采样的 Unit，每项前要求宿主仍为 PRESENT；prepare 在已发布 LEAVING 后执行。Context 始终保留本次既定事实，prepare／leave 的 Departure 不因登记变化而改写。阶段已由键表达，条目无需再携带同义 stage 字段。

leave 在物理注销前从最新 Unit 取得该次离场的 Hook 对象快照，随后注销 Unit，再按快照顺序执行，逐项接续 BattleState 并检查 accepts；不查询已经注销的宿主。Prepare 及依赖者结束程序对 leave 登记的修改因此可以生效。leave 集合的采样与 Departure.unit 的历史采样分别处理，不用后者代替最新登记。

动态修改不重放已完成的阶段，不在 setHook 时执行新增的 enter 或 prepare。生命周期的必要业务偏序仍见 [离场清理](deployment.md#离场清理的偏序)。

结算的 sourceApplied 与 targetApplied 使用不同键，依次执行目标与来源节点；来源与目标为同一 Unit 时仍分别派发两个角色的登记。它们共用对应业务的 AppliedContext，不因宿主相同合并成一组。
