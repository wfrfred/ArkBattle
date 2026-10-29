# 空中阻挡半径：默认值、属性与覆盖

2026-10-29。复用 Blocking 原生模式调查，仅增量读取同一客户端的相关 float 常量和属性字段元数据。没有运行客户端、修改实现、清点全游戏内容或审计活跃 XLua。

[selected-witnesses.json](selected-witnesses.json) 保存 DLL／metadata 指纹、常量地址与原始字节、字段定位及既有指令文件的哈希引用，不复制整套反汇编。

## 已证事实

| 对象或路径 | 半径来源 |
| --- | --- |
| 普通 Character，WALK | 默认半径约 0.7071，由 Character getter 的 DLL 常量提供。 |
| 普通 Character，FLY | 默认半径约 0.8944，同样来自 Character getter 的 DLL 常量。 |
| FLY 属性修正路径 | 读取该实例当前 `Attributes[BLOCK_RADIUS_SCALE]`，使用 `0.8944 × 当前倍率`；WALK 不走这项修正。 |
| `defaultBlockRadiusScale` | Character 与 Enemy 的普通 getter 都读取同一个 1.0 常量，不读取每个角色的 Prefab 半径字段。 |
| Trap | getter 直接读取实例 float `_blockRadiusSquare`，属于配置覆盖，字段保存的是半径平方。 |
| GiantTrap | getter 使用 WALK 默认平方常量；距离检查另遍历多个位置原点，不能统一当作单个中心圆。 |

`HookBlockRadius` 只在 FLY 模式比较当前 `BLOCK_RADIUS_SCALE` 与默认倍率；普通默认路径与属性修正路径因此需要区分。`defaultBlockRadiusScale=1` 不代表当前倍率永远是 1，也不代表每个单位分别配置了自己的最终半径。

`Torappu.AttributesData` 确实具有 `blockRadiusScale` 数据字段，`AttributeType.BLOCK_RADIUS_SCALE` 的枚举值为 37。这说明倍率属于原生属性数据，而不是蒂比专属参数；实际半径还由所属对象的 getter 与当前模式解释。字段存在本身不证明本轮已经找到了某个具体干员、模组或 Buff 使用非默认倍率。

## 结论边界

可确认的是“普通角色有共享默认常量，FLY 另消费当前属性倍率，特殊对象可覆盖半径或距离原点”。不能将其缩成“所有空中阻挡半径永远相同”，也不能说“所有单位都必须单独配置一个半径”。

这里只记录原生事实，不据此直接决定项目字段归 Core 还是 Content。实际内容如何提供倍率、角色是否具有其他覆盖、热更新行为，以及此前记录的 FLY 旧关系距离重验疑点，均未在本轮扩展调查。
