# Terrain 与 Mechanism

Tile 保存地形定义、初始空间属性与当前空间属性。Mechanism 保存接触记录、扫描时间和自身生命周期。持续伤害、属性修正、索敌限制及叠层保存在宿主 Unit 的 Effect 中。

## 地块与类型恢复

Core 的 Terrain 只表达 `Definition<P>` 与 `params: P` 的配对，不列举具体游戏地形。Definition 的 `create(params)` 在构造边界校验并打包参数，内部共享 readonly 值。

Tile 的结构是 `{ definition: { terrain, initial }, state }`。`definition.terrain` 保存类型化地形与逐格参数，`definition.initial` 是初始 State；当前 State 包含 `elevation`、`placement`、`passability`、`walkCost`、`allowsBlocking` 与 `siteCondition`。tile.create 校验初始 walkCost；初始创建时 state 与 initial 共享引用，后续更新保留 definition。

Map 的 Tiles 是稠密的不可变序列。`add(tile)` 接受完整泛型 Tile，普通 `get(index)` 和 `values()` 返回公共 View；`get(index, definition)` 通过原 Terrain Definition 对象身份恢复参数类型。`replace(index, state)` 只替换当前 State，保留原 Tile definition，更新通用属性不需要恢复参数类型；它信任上层确认的索引与 State，不重复校验索引存在性或 walkCost。State 引用未变时返回原容器，变更时返回新容器。容器内部集中处理类型擦除，业务不检查未知参数结构或断言具体 Params。

`field.map` 保存当前 Tile，是地块属性的唯一事实来源，不另设 tileStates 或另一份当前 Tiles。Navigation baseline 从当前 `passability` 与 `walkCost` 投影：WALK 使用步行代价，FLY 的代价为 1。Core 不导入 Content 的地穴 Definition。

`battlefield/tile.update(field, position, state)` 是运行态地块变更入口，确认目标地块并校验新 walkCost；这与 tile.create 的初始值校验属于不同入口。通行规则或步行代价改变时同步重建 Navigation baseline，保留已有 overlay。完整战斗入口 `battle/tile.update(battle, position, state)` 接续该结果并维护 Blocking，不重复校验。内容改格使用完整入口。

`siteCondition` 是单个 `symbol | null`，表达该格要求的部署场地条件；Deployable 的 `allowedSiteConditions` 数组列出支持的条件。null 表示没有场地条件要求，Content 的普通场地 `condition.normal`（NORMAL）则是一个实际条件，两者不同。Core 不默认导入普通场地，也不解释官方位掩码。Data 当前把官方位值 1／2／4／8／32 转成 normal／deepsea／tide／night／brokenWalkway；`brokenWalkway` 仅接入场地许可，完整步道切换与坠落机制尚未接入。

`elevation` 表达当前高度类别，`placement` 表达当前部署类别，`passability` 表达导航通行类别；三者不代替 `allowsBlocking`。地图适配以显式 `tile_blockable` 优先、初始高地默认不可阻挡的规则生成 `allowsBlocking` 初值。Blocking 有登记格时只查登记根格的当前许可，无登记格才查身体格；不以当前 elevation 再次硬拒绝。原生 `Tile.isMeleeBlockable`（70673，`0x1808c6070`）同样优先返回黑板覆盖；其默认 `isHighland`（70670，`0x1808c5f10`）读原始 TileData 高度，与可被 Token 改写的当前 Options.heightType 分开。项目已将有效阻挡许可显式保存为字段，调用方直接消费该字段。

## Mechanism 操作

Mechanism 使用全场唯一的 Typed Ref，私有 State 与 Definition 在容器内保持泛型关联，普通 View 不暴露私有 State 或回调。

- `create(battle, definition, options)` 初始化并登记实例，返回 Ref。
- `get(battle, ref)` 查询当前实例。
- `setState(battle, ref, state)` 接收已经计算好的私有 State，只替换该字段；当前实例的其他事实由 Core 保留，相同 State 引用返回原 BattleState。
- `setActive(battle, ref, active)` 切换运行资格，停用时同步执行内容清理。
- `remove(battle, ref)` 委托静态 lifetime，先同步请求并发布 ENDING，最外层结算器在依赖者完整完成后执行 Finalize 与注销。
- `advance(battle)` 固定本轮候选，逐项读取最新 ACTIVE 实例并执行 `onTick(battle, self)`。

`onUnitLeave(battle, self, departure)` 接收 Unit Finalize 内已注销并完成 Card 回收后的历史离场事实，不表示离开地块；Unit 的 Pending 到该通知整个返回后才解除等待。回调可以重入，后续实时事实从返回的最新 BattleState 读取，不写回旧状态。

Mechanism 的 lifetime 由现有操作模块导出，公共请求／析构协议见 [Lifetime](lifetime.md)。INACTIVE 仍是存在的生命周期，可接受显式 Scope；disable 是可逆参与变化，不等于 remove。ACTIVE remove 的 Prepare 用当前 ENDING self 调用已有 onDisable，INACTIVE remove 不重复 disable；Finalize 调用 onEnd 后注销。嵌套 remove 首次返回只保证 Prepare，不保证 onEnd 或注销；重复 PREPARING 请求不等待原 Prepare，首次原因不覆盖。

## 地形接触与调度

Runtime 顺序为 `Movement → Mechanism → Blocking → RouteCompletion`。地形 Mechanism 按 Unit 当前世界坐标计算接触，要求生命周期 PRESENT 且空间存在，不用 Occupancy 代替接触。

轮询维护进入、离开和持续接触。保持接触时仍重判动态资格，例如飞行单位在地穴上落地。轮询不捕获同 Tick 所有中间位置，也不复刻 Unity 对象顺序。安装与结束请求继续显式接续状态；已有 Lifetime 结算时，嵌套 Effect.end 不保证最终注销已完成。

机制按实际地形配置装配，同一实例可以处理参数不同的多个格子。已由预置控制器管理的沼泽、深水不再重复注册静态机制。预置的出现、隐藏与移除使用同一个 Mechanism 生命周期。

## Content 行为

平台等 Content 按 Occupancy 登记格改写当前 Tile，而不是以身体世界位置代替登记。当前预置装置离场时，仅将自己改写的字段恢复为 `definition.initial` 对应值，保留其它当前字段。恢复政策由内容确定，没有通用撤销栈。TileBinding 和 tile-cost Effect 已移除，部署、阻挡与导航统一消费当前 Tile 属性。

射击台 Content 通过 Occupancy 的 SUPPORT Hook 同步为当前乘员安装平台实例独占的 Blocker.Rule，禁止其阻挡；occupantAdded 安装，occupantRemoved 只清除该平台规则，不覆写地块 `allowsBlocking`。处理旧关系事实时仍重查当前承载，避免删除重入后重新建立的规则，详见 [Occupancy 同步通知](occupancy.md#同步登记通知)。原生平台向乘员施加 WALK 条件下的 `highland_common[block_core]`／`BLOCK_FREE`，详见 [Blocking 的原生对照](blocking.md#地块阻挡资格)。

`walkCost` 保存最终有效步行代价，不是可任意累加或取最大值的基础代价。原生普通 `Tile.get_moveCost`（70678，`0x1808adc40`）按 `overrideObstacleLikeMoveCost` 返回 1000 或 1；`HoleTile.get_moveCost`（70580，`0x1808addd0`）直接返回 1,000,000，不受该标记降低。当前装置 Content 的 apply 对普通地形赋 1000，对真实地穴保留定义中的固定代价 1,000,000；不把这些结果泛化成 `max(任意当前代价, 1000)`。完整地穴身份由 Terrain Definition 表达，不能仅凭“hole-like”状态推断固定代价。

- 活性源石按进入格子的参数安装持续 Effect，离格后保留；duration 从附加时开始计时，首次伤害等待一秒。
- 烟雾的索敌限制随接触建立和撤销。
- 沼泽、深水分开保存控制器扫描进度与宿主 Effect 的周期进度，不在每次轮询重建 Effect 或重置周期。
- 非 retainOnLeave Effect 显式绑定控制器 Mechanism 的 lifetime，终止时由 DAG 清理并等待；控制器 Prepare 的 onDisable 在 ENDING 中只清 Contact，不再手工结束这些 Effect，也不在 onEnd 重复 clear。离格、换地形和可逆 Mechanism disable 继续按 Contact 业务请求结束。retainOnLeave 的活性源石等效果不自动建立绑定，避免错误缩短持续期。
- 地穴由 Content 判断坠落资格，并通过完整 Unit 离场操作完成逻辑结算。

本机沼泽模板的周期为一秒，黑板 value 是重量门槛；PRTS 的三秒描述仍有版本或热更新差异。参数应分别表达周期和重量，不把同一原始字段解释成两种职责。
