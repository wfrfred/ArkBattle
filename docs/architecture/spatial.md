# Battlefield Spatial Query

Spatial 提供 Unit 位置与 Hitbox 的空间查询。查询来源是坐标和几何值，不要求来源为 Unit；Projectile、Effect 和 Content 可以复用。

## 数据归属与查询入口

Unit.position 保存实际世界位置，Hitbox Definition 的 shape 保存单个静态 [Shape](geometry.md#shape-与-range)，可以是圆、轴对齐矩形或轴对齐胶囊。[Presence](presence.md) 表达身体是否参与普通空间交互，没有该 Capability 的 Unit 默认具有空间存在性。暂时消失保留真实坐标和身份，不等于移除位置字段；Layer 的空地身份独立于这些几何事实。

Spatial 在传入的 BattlefieldState 上枚举 Unit，用类型守卫保留 Capability 信息，在公开结果边界形成 Ref 和数组。它不要求完整 BattleState，不维护另一份空间索引；结果始终属于本次查询的输入版本。

单位身体所属格通过 World.toTile 的 ties-to-even 规则计算；它与连续 Shape 的包含判定有不同的边界语义。Spatial 提供位置包含、Hitbox 相交和扫掠接触三种查询，具体签名见[公共入口](../../src/core/battlefield/spatial/query.ts)。

within 检查 Unit.position 是否在 Range 内，不要求 Hitbox，也不使用 Hitbox 的 offset 替代单位位置。overlap 检查 Range 与目标 Hitbox 的相交，使用 Unit.position 作为目标 Shape 的原点。Range 是 Shape 数组表示的并集；空 Range 不匹配任何对象。

sweep 检查单个 Shape 沿 from 到 to 线性平移时，与各目标静态 Hitbox 的首次接触。双方各自使用 Shape 的 offset。fraction 在 [0, 1] 内，初始重叠或相切为 0，起点与终点相同时退化为静态相交。结果按 fraction 稳定升序排列，相等时保留 Unit 登记顺序。它不计算目标在 Tick 内的运动轨迹。

三种查询只纳入 `unit.lifecycle === "ACTIVE" && presence.isPresent(unit)` 的 Unit，不检查 HP、阵营、Targetable 或 Effect 免疫。overlap 和 sweep 要求 Hitbox，within 不要求。ENDING 宿主在清理回调期间仍能通过 `ref.get(battle)` 读取。

每个 Unit 最多返回一次。within 和 overlap 保留 Unit Query 的逻辑登记顺序，不追加优先级。查询不按地图边界裁剪，来源不要求对应实际 Unit。

## 几何与业务执行边界

`geometry/intersection.ts` 提供 contains、overlaps、sweep 的纯几何计算。已持有 Unit 的调用方可直接传入形状与坐标，由自身业务契约决定资格。

空间查询仅接收 BattlefieldState，直接通过通用 Query 遍历该版本的 field.units。查询不修改状态、不执行 Hook、不消费 RNG。结果是传入状态版本上的已完成查询。`Contact.fraction` 保存当时的几何事实，Ref 可在调用方提供的 BattleState 中查找同一对象。后续同步业务改变状态后，需要当前资格或几何时，从最新 BattleState 重新读取和判定。消费方从接触顺序中选择符合业务资格的对象，不能把第一个几何接触默认当成实际命中。

Projectile 是否查询范围或扫掠，由具体命中程序决定；按保存身份命中的路径不要求 Hitbox。空间 sweep 本身不自动让 Projectile 成为沿途碰撞弹道。

阻挡的中点与阻挡半径、Locomotion 的地形避障以及 Navigation 的通行射线各有自身语义。
