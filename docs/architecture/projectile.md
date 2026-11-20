# Projectile 设计

## 1. 领域边界

Projectile 是独立运行实例，提供创建、正常推进和完整终结。具体内容决定运动、目标、数值采样、命中及终止业务，不把全部弹道压成一种追踪／碰撞模型。

来源、目标、到达、命中与结束是不同事实；独立弹道不因来源 Unit／Action 结束自动消失。

## 模块归属

[projectile](../../src/core/projectile)集中模型、查询、异构容器与完整操作。Battlefield 持有唯一集合，Battle 调度当前 Tick 的候选。构造、登记、更新及类型恢复遵守[接口约定](api-conventions.md)，终止共用 [Lifetime](lifetime.md)。

## 2. 实例与 Definition

实例保存身份、Definition、ACTIVE／ENDING、位置与私有 state。Definition 静态共享；私有状态可包含追踪目标、记忆位置、来源、样本、命中记录与业务时钟。

生命周期程序沿用 Action 和 Effect 的配对方式。`S` 表示私有状态，`T` 表示已装配到实例上的额外字段。`Projectile<S, T>` 组合基础字段与 `T`，保存 `state: S` 和 `definition: Definition<S, T>`。调度读取实例后直接调用该实例的 Definition 回调。

```typescript
export interface Definition<S extends object = object, T extends object = object> {
    readonly id: string;
    readonly onEnter?: (battle: BattleState, self: Projectile<S, T>) => BattleState;
    readonly onTick?: (battle: BattleState, self: Projectile<S, T>) => BattleState;
    readonly onEnd?: (
        battle: BattleState,
        self: Projectile<S, T>,
        reason: EndReason,
    ) => BattleState;
}
```

例如，`Definition<ArrowState, Slowable>` 的回调可以直接读取 `self.state` 中的弩箭私有状态，以及 `Slowable` 提供的实例字段。

结束原因交给 `onEnd` 决定收尾。 [Definition 与 EndReason](../../src/core/projectile/definition.ts)

## 3. 异构集合与类型恢复

Projectiles 保存完整异构实例，普通查询不承诺未知私有形状，精确 Ref／Definition 对象身份恢复类型；类型擦除集中在容器边界。字符串相同不代表同一 Definition。

创建操作使用 BattleState 中的身份分配进度，替换保留登记位置，删除后不复用。容器只处理存储，不负责业务资格；Query 绑定不可变输入版本。诊断或表现投影不替代运行实例。

## 4. 创建、查询与内容更新

创建分为 `initialize` 和 `add`，与 Unit 的流程一致。`initialize(battle, input)` 分配 ID、装配 `S` 和 `T`，返回 `Result<Projectile<S, T>>`。调用方接续返回的战斗状态，并可从该实例取得保留具体类型的 Ref。

`add(battle, self)` 登记 ACTIVE 实例，随后执行 `onEnter` 并返回 `BattleState`。`onEnter` 与 Unit 的 `enter` 都发生在登记后。Projectile 直接调用 Definition 回调，Unit 则通过 `enter` 键派发已登记的 Hook。`onEnter` 可以立即结束弹道，调用方取得的 Ref 仍表示这次分配的身份。 [Unit 登记](../../src/core/unit/operations.ts)

get 返回指定版本中的完整实例，不隐含 ACTIVE 筛选。update 只设置位置及私有 state，保留身份、Definition 与生命周期；ENDING 也可提交命中／清理进度，不因普通写回恢复实例。

跨完整业务后需要当前进度或资格时重新查询，不以旧 self 覆盖新版本；私有类型和写回错误遵守公共契约。

### 弹道阵营

`Side` 定义在 `core/side.ts`，由 Projectile 和单位 Classification 共用。`initialize()` 的 `Input` 要求创建方传入 `side: Side`，弹道在实例上保存该值。继承原弹道归属时，创建方直接传入原弹道的 `side`。来源离场后，选择器仍读取弹道自身阵营。 [阵营取证](../research/cases/17-projectile-stop-and-termination.md#22-逻各斯的敌方弹道选择减速与消除)

## 5. 时间推进

Runtime 在整个 Tick 开始时固定弹道 Ref 候选，到 Projectile 阶段逐项读取最新 ACTIVE 实例。先前回调结束的候选跳过，名单之后登记的实例等后续 Tick。`add` 同步调用 `onEnter`。

正常推进仅由调度器调用一次，不保存实例级重复调度标记。抵达后可保持 ACTIVE、停止移动并继续等待或周期业务；不强制全场先移动、再命中、再结束。

### 外部变速与运动

`Slowable` 由实例上的 `move` 字段表达。支持变速的模板在初始化时装配该字段，内容用 `hasSlowable` 筛选，再调用 `setMoveContribution` 和 `removeMoveContribution` 按来源 ID 维护倍率。`resolveMoveScale` 将有效倍率相乘，空集合的倍率为 `1`。不可变速的弹道也可以在 `onTick` 从私有状态推进轨迹。「十字路口」量产型的远程弹道是实际样例。 [变速操作](../../src/core/projectile/slowable.ts) · [敌方弹道取证](../research/evidence/projectile-control-20261120/dispel-prefabs.json)

`onTick` 决定本步如何运动。正常一个 Tick 的时间增量为 `1`，接入 `move` 后按有效倍率缩放。飞行和随飞行缩放的寿命消耗使用同一份 `deltaTicks`，累积时保留小数。抵达后的等待和周期业务按各自的计时规则推进。 [计时入口](../research/cases/17-projectile-stop-and-termination.md#22-逻各斯的敌方弹道选择减速与消除)

Content 以纯函数计算运动结果，由 `onTick` 读取目标位置、提交状态、处理碰撞与业务后继。`towards` 接收位置、目标、速度和 `deltaTicks`，返回下一位置及本步是否几何抵达。线性步进可直接组合 `Vec2.add` 和 `Vec2.scale`。抛物线和绕行函数的签名随实际轨迹确定。 [运动案例](../research/cases/16-projectile-motion-and-hit-boundaries.md) · [当前追踪](../../src/content/projectiles/tracking.ts)

## 6. 终止请求与 Finalize

结束请求固定首次原因并发布 ENDING，阻止后续正常推进。待依赖完成后，`onEnd` 读取当前实例执行收尾，再从最新集合移除，保留回调中新建或修改的其他弹道。Unit 的 `leave` 在注销后派发，描述已经发生的离场。 [Unit 离场](../../src/core/unit/operations.ts)

无活动结算时，结束请求完成整批收尾后返回；嵌套调用的完成边界见 [Lifetime](lifetime.md#finalize-与完成边界)。结束请求发出后，已经进入的普通同步调用栈继续执行。后续新输出须重新确认资格。

### 移除与消除

`remove` 的 `ELIMINATED` 重载要求具有消除资格。资格由具体 Definition 的 `eliminatable: true` 表达，与 `move` 独立。

```typescript
export interface Eliminatable {
    readonly definition: { readonly eliminatable: true };
}

export function remove<P extends ProjectileFields<any, any>>(
    battle: BattleState,
    reference: Ref<P>,
    reason?: Exclude<EndReason, "ELIMINATED">,
): BattleState;

export function remove<P extends ProjectileFields<any, any> & Eliminatable>(
    battle: BattleState,
    reference: Ref<P>,
    reason: "ELIMINATED",
): BattleState;
```

逻各斯等内容从弹道集合按阵营、范围与 `hasEliminatable` 筛选。守卫收窄后的实例可生成满足消除重载的 Ref。两种重载进入同一个 Lifetime，`onEnd(battle, self, reason)` 按原因处理各自的收尾。普通停止可结算原目标保底，成功消除的标准路径会跳过这类保底。资源输出遵守 Event 契约。 [原生停止与消除](../research/cases/17-projectile-stop-and-termination.md#21-不同入口是否采用相同命中政策) · [Event](event.md)

战斗内清弹直接调用领域 `remove`。

## 7. 命中与内容状态

原目标直选、落点范围、沿途接触和周期重选各有资格，不能统一套用空间重叠或普通索敌。命中记录在可重入回调前提交；次数、轮次、原目标保底及终结防重分别保存，不默认整条弹道每目标只命中一次。

tracking 在目标身份仍存在时读取真实位置，暂时消失不回退记忆；身份失效才使用记忆位置。原目标命中要求 PRESENT 且正生命，不重查阵营、Presence 或 Targetable；最终 Damage 是否接收仍独立判断。

已接入的弩箭保存来源、目标、记忆位置、攻击样本和必要记录，到达与普通停止协调同一次原目标命中。来源仍在场时按其当前攻击力，否则沿用发射样本；这是具体弹体政策，不是通用来源快照。

落点范围索敌由具体内容决定何时读取来源。空爆这类弹道可在发射时保存来源 Ref 与选敌所用的 Unit 样本，抵达时按 Ref 读取当前来源，身份失效时使用样本。`targeting.damage(source)` 绑定选定的来源，输出时传入当前 `BattleState`，再过滤当前落点的候选。 [空爆案例](../research/cases/33-targeting-and-targetable-pipeline.md#46-来源离场后的真实群攻弹道)

慑砂 S2 的抵达后延时爆炸、承曦格雷伊 S2 的抵达后周期业务说明不同边界，具体内容尚未接入；不能以测试夹具替代内容程序。

## 8. 内容接入与研究依据

沿途碰撞、附着、套索、延时爆炸与周期弹体按实际内容接入。普通弩箭的五秒超时属于模板行为，实际变体的变速和消除资格仍待核实。来源退场后的伤害数值由各模板的采样政策决定。 [覆盖进度](tactical-semantics.md) · [弩箭变体和寿命](../research/evidence/projectile-control-20261120/dispel-prefabs.json)

原生依据见[运动与命中](../research/cases/16-projectile-motion-and-hit-boundaries.md)、[停止与终结](../research/cases/17-projectile-stop-and-termination.md)、[来源和目标](../research/cases/18-projectile-source-and-target-lifecycles.md)。当前实现的必要结果按[统一验收](verification.md)验证。
