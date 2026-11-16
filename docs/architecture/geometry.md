# 几何与坐标 API

通用二维向量位于 [common/vector.ts](../../src/core/common/vector.ts)，坐标转换位于 [geometry/coordinate.ts](../../src/core/geometry/coordinate.ts)，形状和相交算法位于 `geometry/`。几何不读取 Unit、BattleState、生命周期或业务资格。

## 通用二维向量

位置、偏移、速度与力使用 readonly 二元数值元组，以字段名表达用途。真实未知输入边界检查有限分量；内部算术信任已经建立的约束，不冻结对象或重复构造包装。

向量提供精确比较、四则运算、线性插值、欧氏长度和平方距离；插值不限制进度范围，限长保持方向。通用算术不在坐标模块重复实现。

## 坐标语义与转换

TilePosition 按 `[row, col]` 解释，WorldPosition 按 `[x, y]` 解释。格子分量为安全整数，连续坐标分量为有限数；两者复用向量表示。

Tile.center 将 `[row, col]` 转为 `[col, row]`；World.toTile 使用 ties-to-even 舍入。Tile.rotate 按四向 Direction 旋转相对格子向量。方向是几何值，不意味着每个 Unit 都具有朝向：摆放方向归 Occupancy，左右面向归 Facing。

## Shape 与 Range

Shape 为圆或轴对齐矩形，offset 相对调用方传入的世界原点。圆半径、矩形半宽高非负且有限，不支持旋转或递归 Union。

Range 是 Shape 并集，空列表为空范围。fromTiles 先按指定朝向旋转相对格子，再将其转换为半宽高 0.5 的矩形；查询时另传实际世界原点。单个 Hitbox 保存一个 Shape，身体所属格查询不替代连续几何判定。

## 几何计算

contains 检查点，overlaps 检查形状；任意成员命中即满足 Range，相切视为相交。

sweep 返回形状沿直线平移的首次接触比例，范围为 0–1；初始重叠或相切为 0，无接触为 null。起终点相同退化为静态相交。计算期间双方尺寸、偏移和目标位置不变，不计算旋转或目标轨迹。

几何公式及边界由[几何与空间验收](verification.md)集中保障；战场筛选与命中业务另见[Spatial](spatial.md)和[Projectile](projectile.md)。
