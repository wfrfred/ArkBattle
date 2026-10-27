# 几何与坐标 API

`src/core/common/vector.ts` 提供通用二维向量，不依赖 Tactical 几何领域。`geometry/coordinate.ts` 只负责格子坐标与世界坐标的语义、旋转和转换。位置、偏移、速度与力通过字段和参数名表达用途，不另设 Offset 类型。

## 通用二维向量

```typescript
// common/vector.ts
export type Vec2 = readonly [number, number];

export declare const Vec2: {
    is(value: unknown): value is Vec2;
    add(a: Vec2, b: Vec2): Vec2;
    sub(a: Vec2, b: Vec2): Vec2;
    negate(v: Vec2): Vec2;
    scale(v: Vec2, factor: number): Vec2;
    length(v: Vec2): number;
    distanceSquared(a: Vec2, b: Vec2): number;
    clampLength(v: Vec2, maxLength: number): Vec2;
};
```

`Vec2.is` 判断输入是否为两个有限数构成的数组。七个数学操作直接计算已建立约束的数据，不执行内部校验、冻结或包装构造。`add`、`sub`、`negate`、`scale` 返回新元组；`length` 使用欧氏范数，`distanceSquared` 返回平方距离。`clampLength` 超限时保持方向，未超限时可直接返回输入；调用方保证 `maxLength` 为非负有限数。

## 坐标语义与转换

```typescript
// tactical/geometry/coordinate.ts
import type { Vec2 } from "../common/vector.js";
import type { Direction } from "./direction.js";

export type TilePosition = Vec2;
export type WorldPosition = Vec2;

export declare const Tile: {
    is(value: unknown): value is TilePosition;
    rotate(vector: TilePosition, direction: Direction): TilePosition;
    center(position: TilePosition): WorldPosition;
};

export declare const World: {
    toTile(position: WorldPosition): TilePosition;
};
```

`TilePosition` 按 `[row, col]` 解释，`WorldPosition` 按 `[x, y]` 解释；两个名称都复用 `Vec2` 表示，格式约束在真实输入边界建立。`Tile.is` 检查两个分量均为安全整数；接收未知连续坐标时使用 `Vec2.is`。已明确坐标分量的构造处直接使用元组字面量，需要数值校验的创建或解析入口使用已有 assert 工具，不另设坐标工厂或顶层类型守卫。

`Tile.center([row, col])` 返回 `[col, row]`。`World.toTile()` 按 ties-to-even 舍入并直接返回元组，不再通过工厂重复校验。`Tile.rotate()` 保留既定方向旋转语义。`Direction.vector()` 返回 `Vec2`，Direction 模块只依赖通用向量类型，不反向依赖坐标模块。

通用算术统一调用 `Vec2`，`Tile` 与 `World` 不重复提供向量运算。内部 typed 数据直接共享，通过 TypeScript `readonly` 遵守不可变约定，不归一化 `-0`，不执行 `Object.freeze()`。

## Shape 与 Range

Shape 是单个连续几何图元，offset 相对使用方传入的世界原点。Circle 使用非负有限 radius，轴对齐 Box 使用非负有限 halfExtents；不包含旋转或递归 Union。

```typescript
export type Shape =
    | { readonly type: "CIRCLE"; readonly offset: WorldPosition; readonly radius: number }
    | { readonly type: "BOX"; readonly offset: WorldPosition; readonly halfExtents: WorldPosition };

export function validateShape(shape: Shape): void;

export type Range = readonly Shape[];

export function fromTiles(tiles: readonly TilePosition[], direction: Direction): Range;
```

Range 表示形状并集，空数组表示空范围。fromTiles 将相对原点的格子坐标绕 [0, 0] 按 direction 旋转，再转换成半宽高均为 0.5 的 Box；查询时决定实际世界原点。它不执行目标所属格查询，需要格心原点的调用方使用 Tile.center(originTile)。单个 Hitbox 直接保存 Shape，不使用中间 Geometry 包装。遵守 readonly 约定，不要求运行时冻结。

## 几何计算

```typescript
export function contains(range: Range, origin: WorldPosition, point: WorldPosition): boolean;

export function overlaps(
    range: Range,
    origin: WorldPosition,
    shape: Shape,
    shapeOrigin: WorldPosition,
): boolean;

export function sweep(
    moving: Shape,
    from: WorldPosition,
    to: WorldPosition,
    target: Shape,
    targetOrigin: WorldPosition,
): number | null;
```

contains 和 overlaps 按 Range 中任意 Shape 满足判定；空 Range 返回 false，相切视为相交。sweep 返回线性平移的首次接触比例 [0, 1]，初始重叠或相切返回 0，无接触返回 null；from、to 的坐标分量相等时退化为静态相交。尺寸、offset 和目标位置在计算期间保持不变，不计算旋转。

intersection.ts 不认识 Unit、Hitbox、BattleState、Ref 或生命周期，只封装圆与轴对齐矩形的几何算法。
