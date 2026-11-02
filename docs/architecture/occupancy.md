# Occupancy 与 Support

Occupancy 保存单格登记、可选的四向摆放朝向和已经通知的配对。Battlefield 保存按地块查询的双槽结构索引。可部署对象单向依赖 Occupancy；普通场景对象可以只占格，不具有 Card 或撤退业务。

## 模型与构造

```typescript
type Slot = "OCCUPANT" | "SUPPORT";

type Definition =
    | { readonly slot: "OCCUPANT" }
    | { readonly slot: "SUPPORT"; readonly hooks: readonly SupportHook[] };

interface State {
    readonly tile: TilePosition | null;
    readonly direction: Direction | null;
    readonly pair: Context | null;
}

interface Initial {
    readonly tile?: TilePosition | null;
    readonly direction?: Direction;
}
```

Slot 来自静态 Definition，实例生命周期内不变。没有 Support 响应时也明确写 hooks:[]。本次地块和方向由 Initial 提供，缺省为 null；静态 Definition 不包含本次方向。占格不意味着一定具有方向，基础 Unit 不增加方向字段。

Catalog 先初始化 Occupancy，再初始化依赖它的 Deployable。Occupancy 保留已有程序并追加自己的 enter／leave。Deployment 在 fold 前已经登记的程序仍先执行；这里遵守普通登记顺序，不引入能力优先级。

setDirection 接收 Occupancy Typed Ref，返回只改方向的 Change，不修改地块或产生配对通知。hasDirection 仅缩窄 direction 非 null 的对象。方向范围由 Targeting 根据当前值旋转。

## 结构索引

```typescript
interface TileOccupancy {
    readonly occupant: Ref<Unit & Occupancy> | null;
    readonly support: Ref<Unit & Occupancy> | null;
}
```

occupancy.at(field, tile) 直接返回同格两槽；对象属性从当前 BattleState 查询。表使用 row * columns + col 的稀疏键，两槽均为空时删除条目。

battlefield/unit.ts 的 add／update／remove 原子维护 Unit 存储及反向表，不执行内容回调：

- 登记必须位于地图内，同格同槽至多一个实例；两种 Slot 可以共存。
- 批量修改先统一撤销旧登记，再检查并写入最终布局，允许结构层的合法交换。
- 相同坐标值保留旧条目与 Ref；其他字段替换不重新登记。
- 更新已有实例保持枚举顺序，删除不回收身份。

结构登记与 Unit.position、SpatialPresence、HP 分别表达。身体移动或暂时空间消失不自动改变部署格。槽位不承担阵营、DP、地形部署许可等业务判断。

## 已通知的业务配对

结构索引表达当前同格对象；pair 表达已经向 Support 通知过的业务绑定。这两项事实在生命周期回调期间不能混为一谈：旧实例已注销时，其他程序可能已经在同格创建替代对象。

入场程序查询当前同格两端：Support 后入场与乘员后入场都走同一配对处理。已有相同 pair 时不重复通知；对端残留旧绑定时先完成其解除，再接续最新状态建立新绑定。

建立配对时，先取得双方尚未写入该 pair 的不可变快照，组成 Context；然后一次发布两端的同一 pair，最后通知 occupantAdded。Context 不包含自身绑定，避免自引用和历史配对链。

Context 保存 tile、support、occupant，属于绑定建立时采样的事实，不能当作实时 Unit。内容程序需要当前 HP、能力状态或其他事实时，应根据身份重新查询。

离场程序使用 Departure.unit 中的旧 pair，而不根据当前同格重新猜旧对端。解除只清理当前仍持有同一 pair 的端点，再派发 occupantRemoved。若后来的入场已经完成这条旧绑定的解除，旧离场不重复通知，也不清除替代对象的新绑定。

| 变化 | 通知 |
| --- | --- |
| 乘员登记到已有 Support | occupantAdded |
| Support 登记到已有乘员 | occupantAdded |
| 已通知的配对任一端离场 | occupantRemoved |
| 原组合未变化 | 不重复通知 |
| 同格出现替代实例 | 旧 pair 解除，新 pair 建立 |

通知只向 Support 的静态 hooks 派发。Added 每个回调前确认两端仍为 PRESENT 且持有原 pair；回调导致组合失效时停止后继 Added。Removed 携带原 pair 的固定事实，不替换为同格新对象。所有回调接续最新 BattleState。

Occupancy 通过已登记的 Unit enter／leave 程序处理配对通知。普通 update／replace 只发布状态及结构索引。当前没有公开搬格操作。

## 与其他领域协作

Deployment 通过 Request／Rule 检查地块和槽位，落点和本次方向通过 unit.initialize 的可选 initial.occupancy 输入。关卡预置使用同一输入，开场 Unit 声明 initiallyPresent:true。实际部署通知与 Support 配对是不同事件，前者由 Deployment 登记的 enter 程序触发。

Blocking 有非空登记格时，以该格作为根格读取地块允许阻挡的事实；没有登记格时回退到身体坐标。地块登记与世界位置仍是两个独立事实。

平台对乘员的阻挡限制、平台销毁是否击倒乘员等，由具体内容程序表达。射击台按平台实例 ID 登记自己的 Blocking Rule，地面阻挡受限而空中阻挡按对应规则处理；移除时只撤销自己的输出。

具体平台若需离场时击倒乘员，由自己的 leave 程序读取 Departure 的旧登记格并查询当前对象，再组合完整移除操作，不直接删除存储。地块属性修改与恢复也由具体内容调用完整 Tile 操作，不属于占格登记，不增加通用覆写栈。

## 范围

当前支持单格 OCCUPANT／SUPPORT 登记和配对通知。完整特殊撤退—再部署、公开搬格及大型设施多格登记尚未实现；大型 Hitbox 本身只描述受击几何。部署、主动操作与被动死亡的分工见 [Deployment](deployment.md)。
