# Battlefield

Battlefield 保存战场的空间事实，提供纯状态写回和只读查询。Unit 的完整登场、离场、Hook、Lifetime、部署账务和阻挡关系结算由对应的 Battle／Unit 领域负责。

## 状态归属

| 状态 | 含义 |
| --- | --- |
| map | 地块布局、标记、阻隔边，以及各 Tile 的当前状态 |
| units | 当前已登记的 Unit |
| projectiles | 当前已登记的 Projectile |
| occupancy | 由 Unit 占格事实维护的同格双槽结构索引 |
| navigation | 地块投影得到的基础通行图与当前 Overlay |

这些状态随不可变版本发布。有效导航图、寻路场和空间查询结果从对应版本派生，不另存一份可独立修改的空间事实。

## 关键语义

1. **状态版本隔离。** 新版本的登记、替换、移除与地块变更不改写旧版本；后继查询使用调用方传入的版本。
2. **最终占格一致。** 一次 Unit 批量写回按最终布局维护双槽索引，同格同槽至多一个实例；合法交换不因中间布局暂时冲突而被拒绝。完整操作的首个业务通知应看到已经发布的结构结果。
3. **空间事实各自独立。** Unit.position、空间存在、占格、HP 与空地身份分别表达。身体移动或空间消失不自动改写部署格；地块可通行、可部署与允许阻挡也不能互相推导。
4. **地块变化影响后续导航。** 通行性或代价改变后，新版本的导航查询使用新规则并保留现有 Overlay；旧版本继续按旧规则查询。
5. **导航遵守实际限制。** WALK／FLY 的通行资格、代价、有向出口及 Overlay 共同决定可达性与追踪点；缓存与内部表示不改变结果。
6. **空间查询只报告几何事实。** 查询排除离场中和空间不存在的对象，位置查询与 Hitbox 相交查询有不同含义；HP、阵营、索敌限制及实际命中由消费领域判断。
7. **纯写回不代办业务。** Field 的存储和索引更新不派发内容回调、不推导 Blocking 事件，也不扫描 Capability 来重建 Lifetime 关系。

验收围绕这些结果选取代表场景。内部 Map／数组布局、Hash 数值、缓存命中次数、对象复用及逐字段 Setter 形状不各自成为玩法要求。

## 地图与地块

Map 保存矩形地块布局、标记和阻隔边。Tile 引用静态 Definition，并保存当前 State；Definition.initial 是初始地块事实，当前状态可以由地块操作替换。Terrain 的类型和参数随 Definition 提供，具体地形行为由 Content 的 Mechanism／Effect 表达。

数据解析与地图、地块构造入口建立尺寸、地块数量、坐标和通行代价等约束。内部投影与计算信任这些已构造的数据，不逐次重验地图、复制 Definition 或验证内容私有数据。

`battlefield/tile.update` 纯地发布 Tile 状态；passability 或 walkCost 改变时，同时更新基础导航投影并保留 Overlay。该入口不执行地形内容或阻挡维护。需要同步完整地块结算的调用方使用 `battle/tile.update`，它在发布后调用 Blocking 的关系维护。

## Unit 存储与 Occupancy

`battlefield/unit` 接收合法构造的完整 Unit，更新存储及反向占格索引；已有实例的替换保持逻辑登记顺序。身份、Definition 与 Capability 组成由构造和所属领域维护，内部完整写回不重新解释或恢复这些配对。

批量写回先撤销受影响对象的旧占格，再登记最终布局。地图内登记、同槽唯一性由结构写入口维护，两个不同槽可以共存。索引只表达当前结构，不代表 Support 已经通知过的业务配对，详见 [Occupancy](occupancy.md)。

Content 提交 Capability Change 或调用完整领域操作。`battle/unit.update` 组织全批转换、一次发布与后续 Settlement；`battle/unit.add`／`remove` 组织生命周期。纯 Field 写回不是这些操作的替代入口，完整协议见 [Unit 批量变更](api-conventions.md#51-unit-完整操作与批量变更)。

## Navigation 与 Spatial

地块按移动方式投影通行资格：WALK 使用当前 walkCost，FLY 的基础代价为 1；阻隔边按其适用的移动方式限制出口。Overlay 只能增加禁止或提高代价，撤销一项不会解除其他来源的限制。Navigation 返回追踪建议，实际位置推进由运动领域处理，详见 [Navigation](navigation.md#职责与状态归属)。

Spatial 的 within 检查真实位置，overlap 检查 Hitbox 相交，sweep 返回首次几何接触及其比例。查询不按地图边界裁剪，不要求来源是 Unit，也不执行伤害或选择目标。返回 Ref 供后继操作读取最新对象，接触比例则保留当次查询的几何事实，详见 [Spatial](spatial.md)。

缓存是可丢弃的派生优化。相同状态与查询参数必须给出相同的导航或空间结果；内部是否重建、共享对象或采用何种索引，不增加额外业务状态或隐式历史。
