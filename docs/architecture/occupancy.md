# Occupancy 与 Support

Occupancy 保存单格登记、可选的四向摆放朝向和已经建立的业务配对。Battlefield 保存按地块查询的双槽结构索引。可部署对象单向依赖 Occupancy；普通场景对象可以只占格，不具有 Card 或撤退业务。

## 关键协作语义

本节限定 Deployment 与 Battlefield 已确认的协作结果，不将下文的每个字段或查询接口单独列为验收项。

1. **占格与身体事实分开。** 同格的 OCCUPANT／SUPPORT 两槽可以共存，同槽排他；身体位置、空间存在、HP 变化不自动搬动登记格，占格也不要求有朝向。
2. **通知表达已建立的配对。** 两端先发布同一个 pair，再通知 Support；任一端先入场均可建立配对。离场只解除原 pair，不能清掉同格替代实例的新绑定或重复通知旧组合。
3. **部署与配对各自完成业务。** Deployment 登记的部署程序先于 Occupancy 配对程序执行；真实离场通过已登记程序清理配对。平台输出及其撤销属于具体内容，不由结构存储或通用 Unit 更新猜测。

## 模型与构造

```typescript
type Slot = "OCCUPANT" | "SUPPORT";

type Definition =
    | { readonly slot: "OCCUPANT" }
    | {
          readonly slot: "SUPPORT";
          readonly onOccupantAdded?: (battle: BattleState, pair: Pair) => BattleState;
          readonly onOccupantRemoved?: (battle: BattleState, pair: Pair) => BattleState;
      };

interface Pair {
    readonly tile: TilePosition;
    readonly support: Unit & Occupancy & {
        readonly definition: {
            readonly occupancy: Extract<Definition, { readonly slot: "SUPPORT" }>;
        };
    };
    readonly occupant: Unit & Occupancy;
}

interface State {
    readonly tile: TilePosition;
    readonly direction: Direction | null;
    readonly pair: Pair | null;
}

interface Initial {
    readonly tile: TilePosition;
    readonly direction?: Direction;
}
```

Slot 来自静态 Definition，实例生命周期内不变。SUPPORT 按内容需要提供配对建立与解除程序。选择 Occupancy 的 Unit 必须通过 Initial 提供本次 tile，State.tile 始终非空；方向可省略，缺省为 null。静态 Definition 不包含本次方向，占格不意味着一定具有方向，基础 Unit 不增加方向字段。不占格的 Unit 不选择 Occupancy。

Catalog 先初始化 Occupancy，再初始化依赖它的 Deployable。Occupancy 保留已有程序并追加自己的 enter／leave。Deployment 在 fold 前已经登记的程序仍先执行；这里遵守普通登记顺序，不引入能力优先级。

setDirection 只接收方向，返回只改方向的 `Change<Unit & Occupancy>`，不修改地块或产生配对通知。hasDirection 仅缩窄 direction 非 null 的对象。调用者通过 hasDirection 取得有效朝向，再由 Geometry.fromTiles 旋转范围。

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

结构登记与 Unit.position、Presence、HP 分别表达。身体移动或暂时空间消失不自动改变部署格。离场由 Battlefield 删除结构登记，离场 Unit 仍保留原 tile；Occupancy 只清理 pair，不将 tile 置空。槽位不承担阵营、DP、地形部署许可等业务判断。

## 已通知的业务配对

结构索引表达当前同格对象；Pair 是 Occupancy Capability 持有的业务绑定事实。这两项事实在生命周期回调期间不能混为一谈：旧实例已注销时，其他程序可能已经在同格创建替代对象。

入场程序查询当前同格两端：Support 后入场与乘员后入场都走同一配对处理。已有相同 pair 时不重复通知；对端残留旧绑定时先完成其解除，再接续最新状态建立新绑定。

建立配对时，先取得双方尚未写入该 pair 的不可变快照，组成 Pair；然后一次发布两端的同一 pair，最后调用 Support Definition 的 onOccupantAdded。Pair 中的双方快照不包含自身绑定，避免自引用和历史配对链。

Pair 保存 tile、support、occupant，属于绑定建立时采样的事实，不能当作实时 Unit。内容程序需要当前 HP、能力状态或其他事实时，应根据身份重新查询。

离场程序使用 Departure.unit 中的旧 pair，而不根据当前同格重新猜旧对端。解除只清理当前仍持有同一 pair 的端点，先发布清理结果，再调用原 Support Definition 的 onOccupantRemoved。若后来的入场已经完成这条旧绑定的解除，旧离场不重复通知，也不清除替代对象的新绑定。

| 变化 | 通知 |
| --- | --- |
| 乘员登记到已有 Support | onOccupantAdded |
| Support 登记到已有乘员 | onOccupantAdded |
| 已建立的配对任一端离场 | onOccupantRemoved |
| 原组合未变化 | 不重复通知 |
| 同格出现替代实例 | 旧 pair 解除，新 pair 建立 |

配对通知直接调用 Support Definition 中对应的可选程序，并接续其返回的 BattleState。onOccupantAdded 开始时两端均为 PRESENT 且已经持有同一 pair；onOccupantRemoved 接收原 pair 的固定事实，不替换为同格新对象。配对程序可同步调用其他领域操作，返回后继续使用其最新状态。

Occupancy 通过已登记的 Unit enter／leave 程序处理配对通知。普通 update／replace 只发布状态及结构索引。当前没有公开搬格操作。

## 与其他领域协作

Deployment 通过 Request／Rule 检查地块和槽位，落点和本次方向通过 unit.initialize 的 initial.occupancy 输入。具有 Occupancy 的 Definition 要求提供该输入及其 tile；关卡预置使用同一约束，开场 Unit 声明 initiallyPresent:true。实际部署通知与 Support 配对是不同事件，前者由 Deployment 登记的 enter 程序触发。

Blocking 对具有 Occupancy 的 Unit 使用其登记格作为根格，读取地块允许阻挡的事实；没有 Occupancy 时使用身体坐标。地块登记与世界位置仍是两个独立事实。

平台对乘员的阻挡限制、平台销毁是否击倒乘员等，由具体内容程序表达。射击台在 onOccupantAdded 按平台实例 ID 登记自己的 Blocking Rule，只禁止 GROUND 阻挡，AIR 仍由其余 Blocking 规则判断；onOccupantRemoved 只撤销该平台的输出。

具体平台若需离场时击倒乘员，由自己的 leave 程序读取 Departure 的旧登记格并查询当前对象，再组合完整移除操作，不直接删除存储。地块属性修改与恢复也由具体内容调用完整 Tile 操作，不属于占格登记，不增加通用覆写栈。

## 范围

当前支持单格 OCCUPANT／SUPPORT 登记和配对通知。完整特殊撤退—再部署、公开搬格及大型设施多格登记尚未实现；大型 Hitbox 本身只描述受击几何。部署、主动操作与被动死亡的分工见 [Deployment](deployment.md)。
