# Occupancy 与 Support

Occupancy 保存 Unit 的单格登记；Battlefield 保存按地块查询的双槽反向表。消费方直接读取该表，不再提供另一套 Support Relation 查询。

## Unit 登记

```typescript
export type Slot = "OCCUPANT" | "SUPPORT";

export type Definition =
    | { readonly slot: "OCCUPANT" }
    | {
          readonly slot: "SUPPORT";
          readonly hooks: readonly SupportHook[];
      };

export interface State {
    readonly tile: TilePosition | null;
}
```

Occupancy Definition 明确记录 slot，initialize 返回 tile 为 null 的 State。普通干员和阻隔工事配置为 OCCUPANT；射击台配置为 SUPPORT。只有 SUPPORT 提供必填 hooks 数组，没有响应时显式传入 []；State 仍只保存 tile，不复制静态 Hook，也不新增动态登记接口。单个 Unit 最多登记一个地块，实例生命周期内不改变 Slot。Deployment 直接读取 Definition.slot 确定登记类别。

登记与 Unit.position、SpatialPresence、HP 和生命周期阶段分别表达。身体移动或暂时空间消失不改变登记；明确修改 occupancy.tile 或从 Battlefield 移除 Unit 才改变反向表。

## Battlefield 反向表

```typescript
export interface TileOccupancy {
    readonly occupant: Ref<Unit & Occupancy> | null;
    readonly support: Ref<Unit & Occupancy> | null;
}

export interface State {
    readonly occupancy: ReadonlyMap<number, TileOccupancy>;
}

export function at(
    field: BattlefieldState,
    tile: TilePosition,
): TileOccupancy | undefined;
```

内部以 row * columns + col 索引。查询先检查地图边界，越界或没有任何登记返回 undefined。表采用稀疏存储，两槽都为空时删除条目。

battlefield/unit.ts 的 add、update、remove 经私有 applyChanges(field, changes) 在返回前完成 Unit 存储与占格维护，不执行内容回调。Change 只在内部表达 ADD、UPDATE、REMOVE 及已经确认的前后实例，不作为公开变更协议：

- 登记必须位于地图内，同格同槽只允许一个 Unit。
- 非空 occupancy.tile 与反向表双向对应；槽位中的 Ref 指向当前已登记的 Unit。
- update 仅接收 readonly Unit[]。applyChanges 先写入 Unit，再从原 Change 数组筛选登记值发生变化的条目；先统一撤销这些条目的旧登记，再校验并写入新占格。筛选保留原 Change 引用，不构造另一套登记变更对象；支持交换占格与循环换位，不逐条执行完整更新。
- Slot 来自不可变 Definition，登记变化只比较地块坐标值。相同值保留旧表、条目和 Ref，Unit 的其他字段正常更新。空批次和所有对象均未改变时返回原 Field。
- 完整 battle/unit.update 在同一入口统一校验同批 ID 不重复、目标存在及 Definition 对象身份不变。Field 信任这些已确认的输入，不重复校验；add 信任创建阶段建立的合法 Unit ID，保留重复登记约束。
- Field 维护最终布局的地图范围与同槽唯一性；最终越界或冲突时拒绝更新，输入状态不变。替换已有 Unit 保持登记顺序。
- 搬格、解除登记和移除从当前登记撤销旧项，建立合法的新项；冲突抛出 RangeError，输入版本保持不变。
- 槽位登记只维护结构。部署类型、阵营、费用、地形许可等由 Deployment 判断。

## 承载查询

occupancy.at(field, tile) 直接返回同格的 occupant 和 support。需要对象属性时，从当前 State 取得对应 Unit，不能把 Ref 当作 Unit 快照；不再构造 Relation 或提供 of／all 包装。

双槽登记不按地块部署类型或 SpatialPresence 过滤。Deployment 读取当前 Tile.state 的 placement 与 siteCondition，不从 support 对象推导覆写值；部署判定只返回资格结果，需要承载登记时直接查询 Occupancy。Blocking 有非空登记格时，以该格作为根格读取当前 `allowsBlocking`；没有登记格时才回退到身体世界位置所在格。不额外用高地 elevation 否决显式阻挡许可，也不同时检查两个格子的高度与许可。登记仍与身体位置分别保存，具体消费方按自己的空间语义选择坐标。

## 同步登记通知

完整 battle/unit.add、update、remove 通过 battle/occupancy.notify 同步通知承载关系变化。通知只派发给 SUPPORT 的静态 Hook，不在 Unit Definition 添加 Occupancy 专属回调，也不向 OCCUPANT 广播。只查询本批变更涉及的原／新登记格，不扫描全场。

unit/capability/occupancy/hook.ts 定义 Context 与 SupportHook。Context 保存本次关系的 support、occupant 两个 Unit & Occupancy 及 tile；OccupantAddedHook 和 OccupantRemovedHook 分别以 occupantAdded、occupantRemoved 阶段复用已有 Hook<Context, void>。该文件仅定义领域类型，不新增派发框架或 Hook 登记操作。

Added／Removed 表示相对于该 Support 的承载关系变化，不表示乘员 Unit 的创建／删除：

| 变化 | 通知 |
| --- | --- |
| A 部署到已有 P | P：occupantAdded(A) |
| A 从 P 解除登记或被移除 | P：occupantRemoved(A) |
| P 登记到已有 A 的格子 | P：occupantAdded(A) |
| A 不变，Support 从 P 换成 Q | P：occupantRemoved(A)，Q：occupantAdded(A) |
| 更新前后仍是同一 Support 和乘员 | 不通知 |

add 在 enter Hook 完成后通知，update 在已有 Blocking 通知完成后通知，remove 在物理注销后、leave Hook 前通知。先完成 Occupancy 数据维护，再固定本次关系事件与 Hook 候选，交给通用 Hook dispatcher 执行。Removed 使用旧 Support、旧乘员事实，已移除的 Support 仍能完成本次清理；Added 每项执行前确认当前登记仍是对应的 Support／乘员组合，嵌套操作使组合失效后停止其剩余响应。Context 是历史事实，不能代替后续当前查询，Hook 重入后必须接续最新 BattleState。只修改 blocker.rules 等非登记字段会共享原 occupancy Map，不再次触发通知。低层 battlefield/unit 仍不执行内容 Hook。

射击台 Content 使用平台实例独占的 Rule ID，在当前 PRESENT 乘员的 blocker.rules 登记共享二元 Rule，禁止其与任何目标建立或保留阻挡，不修改地块 allowsBlocking。乘员离开时只清除该平台的 Rule，保留眩晕等其他规则；旧通知执行时若乘员已重新由同一平台承载，就保留已建立的规则。安装前重查当前平台的生命周期、SUPPORT 登记及反向表和当前乘员，已有自身 Rule 时不重复更新。

## 平台离场与内容响应

平台和乘员由当前 Occupancy 的双槽登记直接查询。承载关系变化通过 Support Hook 同步维护内容规则；Unit 的真实离场仍使用 leave Hook，不把两者合成同一种生命周期。

如果具体平台要求离场时让格上单位一同离场，由它的 leave Hook 从固定 Departure.unit 读取旧登记格，再从最新 BattleState 查询当前 occupant，组合完整 Unit.remove。leave 执行时平台已经完成自身清理、注销和 Card 回收；历史 Unit 保留旧登记，不能直接删除乘员存储。因此平台移除记录先于内容引起的乘员移除记录。

占格变化不等于 Unit 离场，不执行 leave Hook。登记交换等批量更新验证的是最终布局与通知的一致性，不代表允许任意搬动游戏对象。本轮删除了直接重定位流程；真实特殊撤退—再部署尚未实现。

## 内容边界

平台改格按 Occupancy 登记格调用完整 battle/tile.update，直接修改 field.map 中当前 Tile.state。当前预置装置离场时，只把自身改过的字段恢复为 definition.initial 对应值，保留其它字段；局部恢复由内容负责，不提供通用覆写撤销栈。TileBinding 已移除，Occupancy 只维护登记，不负责地块属性。

平台对乘员的禁阻挡、丢失后的击倒、撤退或其他处理由对应内容提供，不是所有 Support 的默认规则。普通登记高地也不因 Slot 或 elevation 自动获得这些平台规则。官方普通版特制水上平台部署后销毁自身、留下地块改写；不能据此认定其具有“平台被摧毁导致上方单位离场”的规则。地块效果和持久平台均可按实际生命周期组织内容。

大型 Hitbox 不等于多格占用。本轮不支持 GiantTrap 对应的生息演算或次生预案大型设施，不为这些内容保留多格登记。
