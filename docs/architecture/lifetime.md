# Lifetime 与依赖析构

Lifetime 统一实例的结束请求、依赖传播和最终析构。领域继续拥有实例、Definition、私有状态、创建与存储；公共协议不解释内容数据，也不统一 start。具体领域入口仍是 end、cancel、stop、remove 等业务操作。

状态和接口遵守[函数式内核](functional-core.md)与[接口约定](api-conventions.md)。结束请求同步执行 Prepare，单个最外层结算器再按依赖完成顺序执行 Finalize。所有真实依赖者完整完成后，所属 owner 才能最终注销。

## 身份、Scope 与公共入口

公共入口为 `core/lifetime/index.ts`，显式导出 create、scope、getRef、available 及公开类型。request、drain、Pending、异构擦除和索引修改不作为 Content API。领域从自己的操作模块或 index 导出共享静态 lifetime 描述符。

每种生命周期的描述符提供稳定 kind 与数值地址，不分配另一套全局 ID：

| 实例 | 地址 |
| --- | --- |
| Unit | unitId |
| Action Execution | hostId、executionId |
| Skill Activation | hostId、activationId |
| Elemental Burst | hostId、burstId |
| Effect | hostId、effectId |
| Projectile | projectileId |
| Mechanism | mechanismId |

Key 由 kind 与整个数值地址作无歧义编码；地址排序使用数值，不按编码字符串排序。相同地址的 Ref 值表达同一个身份，不依赖 Scope 对象引用相等。描述符是共享静态程序，不使用动态注册器。

```typescript
import { scope, getRef, available } from "../../lifetime/index.js";
import { lifetime as burstLifetime } from "../capability/elemental/index.js";

const binding = scope(burstLifetime, burstRef);
const ref = getRef(binding, burstLifetime);
const usable = available(battle, binding);
```

Scope 公开 type: "LIFETIME"、kind 和只读数值 address，描述符／Ref 的配对保存在内部受信边界，不向内容暴露存储容器。scope 保持描述符与 Ref 的领域配对，不查询 battle。getRef 仅在描述符匹配时返回 Ref<V>，恢复描述符的公开完整类型而不推断 Scope 原始私有参数；例如 Elemental 周期 Effect 从自身 scopes 取回 Burst 身份后读取当前 Burst。异构配对只在公共模块内部擦除，调用方不能把别的领域 Ref 配给描述符。

available 沿依赖图的父边检查目标自身及全部上游（实际 owner 与显式 Scope）：任一节点缺失、已 Pending 或结束中，目标均不可接纳新依赖。检查使用当前 BattleState；父对象已开始结束、子对象尚未收到结束请求的发布／Prepare 窗口也适用。Unit 要求 PRESENT，Action 要求 RUNNING，Skill／Burst 要求 ACTIVE；Effect 的 INSTALLING／INACTIVE 和 Mechanism 的 INACTIVE 仍可成为依赖目标。HP、空间在场和 source 是否存活不属于这项判断。

Effect 的 Scope 为 Lifetime Scope 或 `{ type: "TICK", tick }`。TICK 是期限，不进入依赖图；source 和普通私有 Ref 不自动产生关系。额外 Scope 的安装／绑定入口检查目标可用性及合并图的闭环，内部派生与析构信任这些约束。

公共导出不扩大调用权限：Content 可以构造 Scope 并调用已有业务入口；Action 的正常完成与推进仍归相应内容协议和调度器，不因描述符可见而允许任意执行完整实例写回。

## 静态析构适配

```typescript
interface Definition<V extends Identified<object>, S extends V, E> {
    readonly kind: string;
    readonly address: (ref: Ref<V>) => readonly number[];
    readonly get: (battle: BattleState, ref: Ref<V>) => S | undefined;
    readonly isEnding: (self: S) => boolean;
    readonly begin: (self: S) => S;
    readonly replace: (battle: BattleState, ref: Ref<V>, next: S) => BattleState;
    readonly prepare?: (
        battle: BattleState, ref: Ref<V>, initial: S, end: E,
    ) => BattleState;
    readonly finalize: (battle: BattleState, ref: Ref<V>, end: E) => BattleState;
    readonly reason: (end: E) => string;
    readonly fromDependency?: (reason: string) => E;
}
```

Lifetime<V, S, E> 的 V 是公开完整实体类型，通常使用默认 object 参数；S 是 Core 内部接纳不同私有形状的完整类型上界，E 是业务结束输入。例如 Effect 使用公开 Effect 与内部 Effect<any, any>，不再要求单独的元数据目标。描述符的内部 [paired] 保留真实 Definition<V, S, E>，维持参数推导；scope 与 end 接纳 T extends S 的精确 Ref，getRef 仅恢复公开 Ref<V>。begin 是纯值转换，只把原状态改为 ENDING／LEAVING。replace 接收已经算好的完整值，由各领域适配器发布实例与必要派生索引；Unit 的适配器在发布 LEAVING 后明确调用 Blocking.release 释放自身全部关系，不让通用 Unit 更新推断或通知阻挡变化。

prepare／finalize 是 Core 的完整操作适配，不是 Content Definition 的生命周期回调。Content 继续接收已有 self。prepare 的 initial 是标记前的同一不可变对象，供 Effect 判断原先是否 ACTIVE 等业务使用；需要实时值时从当前 battle 查询，不把 initial 整体写回。

finalize 只接收 Ref 和 E，从当前存储读取实例。完整 owner 边保护了宿主，Skill 可从当前 unit.skill.definition、Burst 可从仍存在的 Unit 取得原 Definition，不需要通用 fallback self 或最后可得快照。领域在自己注销后仍要通知时，可以使用 Finalize 内明确取得的历史值。Unit 的 Departure.unit 则是离场开始时的业务事实，由 remove 入口构造一次并随 E 保留。

描述符提供的结束操作为：

```typescript
end(battle, ref, end, dependencyReason?): BattleState;
```

业务 End 与依赖传播原因是两条通道；默认传播原因取 reason(end)。Pending 保留本次业务 End，不保存 dependencyReason；传播原因由 end／request 参数沿同步请求传递，在 Prepare 返回后通过 fromDependency 展开子请求。重复请求不重新 Prepare 或展开依赖，因此首次原因仍不被覆盖。例如 Unit 死亡时，Action.onEnd 与事件记录 SOURCE_ABSENT，依赖 Effect 接收 DEATH。fromDependency 只在实际允许成为依赖者的领域提供，Unit 本轮没有任意上游绑定。

## 状态归属与关系权威

`BattleState.lifetime` 保存 dependencies、endings 和 settling。dependencies 是派生关系索引；endings 是本次结算的未完成工作，Pending 仅含 target、end、parents、phase；settling 表示已有最外层结算器。正常对外稳定状态的 endings 为空，settling 为 false。

权威关系来自实际存储：Unit 持有 Execution、Activation、Burst 和 Effects；额外 Scope 来自 Effect.scopes。索引同时支持 child→parents 和 parent→owned／scoped，不保存第二份实例、Definition 或生命周期状态。

Unit add／内部 replace／remove 在业务通知前，对已知变更 Unit 的生命周期投影增量 derive；公开 Change update 完成全批纯转换后，只投影批前到最终状态，不登记暂存中间值。当前 Projectile／Mechanism 没有自身 owner 或可写上游 Scope，作为目标的关系由 Unit Effect 投影维护，不对空投影额外 derive。公共 Lifetime 不导入具体领域、不全场扫描，也不要求 Effect setter 手工双写关系。

ENDING 对象在物理移除前仍保留关系。关闭资格由 Pending 与原领域状态共同表达，不靠提前丢弃关系实现。物理移除可以撤去活索引，但 Pending.parents 一直保留到整个 Finalize 返回。查询直接依赖者合并活索引与未完成 Pending 的 parents 并按 Key 去重，覆盖子项已注销、末尾通知才请求 owner 的情况。

图中 child→parent 表示 child 依赖 parent；parent 完成析构必须晚于 child。Scope 绑定入口先检查目标及全部上游的可用性，再针对所有权与显式 Scope 的合并图检查闭环。available 信任已建立的 DAG，不在检查上游资格时重复检测环；request／drain 仍按已有关系执行结束，不重新验证整图。

## 请求与 Prepare

父节点已 Pending 不代表每个子节点已收到结束请求。以下顺序中，发布 Hook 或 Prepare 显式先请求子节点结束，仍由该子节点首次有效请求确定 End 与传播原因；上游可用性限制新绑定，不拒绝结束请求或覆盖其原因。

首次有效请求按以下顺序同步执行：

1. 先查 Pending；重复请求不覆盖首次 End／传播原因，不重复 Prepare。随后从领域查询实例，缺失时不创建工作。
2. 固定当前 parents 和直接子候选，建立结算标记及 PREPARING 节点。
3. 调用纯 begin，经 replace 发布终止态及必要关系。任何状态发布回调都能同时看到 Pending、settling 和领域终止态。
4. 执行本实例 Prepare，接续返回状态。
5. 按确定顺序请求直接依赖者，接续每项状态，再把当前节点置为 READY。

Prepare 先于自动请求普通依赖者。它主动请求子项时可以确定该子项的首次原因，后续传播不覆盖。请求顺序为 owned 在前、scoped 在后；Unit 的 owned 顺序为 Skill、Action（executionId 数值顺序）、Burst、Effect（容器现有 ID 登记顺序，不重复排序），scoped Effect 按数值 hostId／effectId 排序。同一实例同时 owned／scoped 于一个目标时，只请求一次，所有权组优先。

首次嵌套请求返回保证自身 Prepare 已完成，不保证 Finalize 已执行；重复请求 PREPARING 节点不等待原 Prepare。Prepare 是多步完整操作，不是原子业务事务：发布 ENDING 触发的 Hook 可能先于清理完成。需要随标记原子失效的具体事实必须一起纯提交，不能把任意 Content 回调宣称为原子执行。

结束中的实例立即拒绝新的依赖和正常推进。Unit 的 Prepare 在标记发布及 Blocking Hook 返回后读取最新 Unit 决定返费，Departure.unit 仍只表示离场历史。Effect 的 onDisable 在 Prepare 撤销输出；Group 在此时协调候补，但仍检查最新宿主 PRESENT、enabled、Scope 资格和既有竞争规则。LEAVING 宿主不会重新启用弱 Buff。

## Finalize 与完成边界

没有活动结算时，业务结束入口建立范围，执行 request，再 drain，清空标记后返回。有活动结算时只执行请求阶段，不递归开启另一个 drain。

Pending 的阶段是 PREPARING、READY、FINALIZING。READY 表示 Prepare 与依赖请求展开完成，不表示依赖者已完成。drain 每次从最新 Map 选择最早登记且没有未完成直接依赖者的 READY 节点，先标 FINALIZING，再调用领域 finalize。接续整个返回状态后才删除该 Pending，然后重新选择；不沿入口时固定的拓扑序循环。

物理删除、清空槽位和写入事件都不是公共完成信号。Finalize 的所有内容程序和末尾通知返回，才解除 parents 的等待约束。未完成工作非空却没有可执行节点表示关系或阶段合同错误，直接抛错；不强制删边或注销，不增加循环次数上限。

当前结算通过不可变 BattleState 显式接续，不使用模块级 busy、共享可变队列、全局 visited、额外 ready 队列或跨 Tick 工作。异常直接传播，不在 finally 中补做 Finalize；外部未发布的新版本不成为已提交状态。

## 可观察顺序与领域责任

请求顺序与完成顺序分别规定。兄弟可以都先成为 ENDING，前一个兄弟的 onEnd 不保证其他兄弟仍在运行。多个上游共享同一依赖者时，首次原因不变，Finalize 只执行一次。

嵌套 end／cancel／stop／remove 返回时，实例可能仍能通过 get／all 查询、仍占格或占用槽位，最终事件及通知可能尚未发生。普通目标、推进和绑定资格不能仅凭对象存在判断。在同一结算范围内 cancel 后立即 start 同一槽位可能被拒绝；依赖槽位释放的业务放在已有完成通知，不强行嵌套 drain。

Damage.completed 表达该次伤害结算完成，不承诺目标的全部离场 Finalize 已完成。Effect Group 候补在 Prepare 协调，早于原实例 onEnd。两者都是明确的项目执行语义。

业务调用不自动生成等待边。例如 Effect.onEnd 请求 Unit.remove，Unit 等待已有 Effect→Unit 关系，但 Effect 不因为调用了 remove 又反向等待 Unit。独立 Projectile 不随来源 Unit／Action 自动结束，普通 source、目标跟踪、Occupancy、Blocking、Card 冷却不自动转为 Lifetime 关系。

字段写回沿用各领域合同：Effect 私有 data／期限、Projectile 位置／state 和 Action 持久 state／Cooldown 可供清理使用；Action ENDING 的 execution.state 不接受普通写入。Mechanism disable 是可逆参与变化，与最终析构分开：ACTIVE remove 的 Prepare 以 ENDING self 调用已有 onDisable，INACTIVE remove 不重复调用，Finalize 再执行 onEnd。

实现职责分别位于 `core/lifetime/lifetime.ts`（模型与类型）、`dependency.ts`（投影索引与图查询）、`operations.ts`（组合器、请求与析构）、`index.ts`（显式公共入口）。领域按真实共享需要选择已有操作文件或 lifetime.ts，不套目录模板。
