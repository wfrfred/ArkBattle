# Battlefield Spatial Query

Spatial 提供 Unit 位置与 Hitbox 的空间查询。查询来源是坐标和几何值，不要求来源为 Unit；Projectile、Effect 和 Content 可以复用。

## 数据归属与查询入口

Unit.position 保存实际世界位置，Hitbox Definition 的 shape 保存单个静态 Shape。SpatialPresence 表达空间存在性，没有该 Capability 的 Unit 默认具有空间存在性。Layer 的空地身份独立于这些几何事实。

Spatial 通过 units.all(battle) 枚举传入状态版本中的 Unit，用类型守卫保留 Capability 信息，在公开结果边界显式转换成 Ref 和数组。它不直接依赖存储容器的遍历 API，不维护缓存或空间索引。

Battlefield State 不保存 spatial 或 unitsByTile。单位身体所属格通过 World.toTile 的 ties-to-even 规则计算；它与连续 Shape 的包含判定有不同的边界语义。生产空间查询只公开下列三个接口，不另外提供格子所属查询包装。

```typescript
export function within(
    field: BattlefieldState,
    range: Range,
    origin: WorldPosition,
): readonly Ref<Unit>[];

export function overlap(
    field: BattlefieldState,
    range: Range,
    origin: WorldPosition,
): readonly Ref<Unit & Hitbox>[];

export interface Contact {
    readonly target: Ref<Unit & Hitbox>;
    readonly fraction: number;
}

export function sweep(
    field: BattlefieldState,
    shape: Shape,
    from: WorldPosition,
    to: WorldPosition,
): readonly Contact[];
```

within 检查 Unit.position 是否在 Range 内，不要求 Hitbox，也不使用 Hitbox 的 offset 替代单位位置。overlap 检查 Range 与目标 Hitbox 的相交，使用 Unit.position 作为目标 Shape 的原点。Range 是 Shape 数组表示的并集；空 Range 不匹配任何对象。

sweep 检查单个 Shape 沿 from 到 to 线性平移时，与各目标静态 Hitbox 的首次接触。fraction 在 [0, 1] 内，初始重叠或相切为 0；坐标分量相等时退化为静态相交。结果按 fraction 升序、相等时 Unit ID 升序。它不计算目标在 Tick 内的运动轨迹。

三种查询只纳入 lifecycle 为 PRESENT 且 isSpatiallyPresent 的 Unit，不检查 HP、阵营、Targetable 或 Effect 免疫。overlap 和 sweep 要求 Hitbox，within 不要求。LEAVING 宿主在清理回调期间仍能通过 units.get 读取，但不再参与新的空间集合查询。

每个 Unit 最多返回一次。within 和 overlap 保留 Unit Query 的逻辑登记顺序，不追加优先级。查询不按地图边界裁剪，来源不要求对应实际 Unit。

## 几何与业务执行边界

geometry/intersection.ts 只提供 contains、overlaps、sweep 的几何计算，不认识 Unit 或生命周期。已持有 Unit 的调用方直接调用它，由自身业务契约决定资格；不保留 Spatial 的单对象包装函数。

空间查询仅接收 BattlefieldState，直接通过通用 Query 遍历该版本的 field.units；不为复用 Unit 查询入口而依赖完整 BattleState。查询不修改状态、不执行 Hook、不消费 RNG。结果是传入状态版本上的已完成查询；Ref 只保留身份，Contact.fraction 是当时的几何事实。后续同步业务改变状态后，需要当前资格或几何时，从最新 BattleState 重新读取和判定。消费方从接触顺序中选择符合业务资格的对象，不能把第一个几何接触默认当成实际命中。

Projectile 的现有到达接触流程固定全体候选身份，逐项读取最新弹道、单位和几何。不能以初始 overlap 命中列表替代，否则先前回调把既有 Unit 移入范围时会遗漏。空间 sweep 本身不自动让 Projectile 成为沿途碰撞弹道。

阻挡的中点与阻挡半径、Locomotion 的地形避障以及 Navigation 的通行射线各有自身语义。
