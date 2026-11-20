# Terrain 与 Mechanism

Tile 拥有地形定义、初始和当前空间属性；Mechanism 保存接触记录、扫描时间与生命周期；持续伤害、修正、限制和叠层归宿主 Unit 上的 Effect。

## 地块与类型恢复

Terrain 在构造入口建立 Definition 与逐格 params 配对，不列举全部游戏地形。Tile 保留静态 terrain／initial 和当前 State；稠密不可变 Tiles 查询完整对象，精确 Definition 身份恢复参数类型，普通属性更新不修改定义。

当前地图是地块属性唯一权威，不另存 tileStates。完整 Tile 更新校验新步行代价，通行或代价改变时同步重建 Navigation 基础图并保留 Overlay，再维护 Blocking；Content 调用战斗完整入口，不直接改底层图。

高度、可部署类型、通行类型与 allowsBlocking 是不同事实。显式 tile_blockable 优先决定初始阻挡许可，无配置才按原始高地回退；Blocking 消费当前许可，不用当前 elevation 再否决显式允许。相关原生依据见[地形研究](../research/03-space-units-and-mechanisms.md)。

siteCondition 是单个条件身份或 null，null 不等于普通场地条件。Content 部署限制判断是否支持；Data 将原始位值转换为 normal／deepsea／tide／night／brokenWalkway。后者目前仅接场地许可，完整步道切换和坠落尚未接入。

## Mechanism 操作

Mechanism 是全场独立身份，其[领域模块](../../src/core/mechanism/index.ts)拥有模型、容器、创建与生命周期；Battle 保存容器并安排推进。具体 Definition 配对初始化和私有 state；setState 只改私有数据。setActive 可逆切换参与资格，remove 不可逆结束。INACTIVE 仍存在且可作依赖，ACTIVE remove 的 Prepare 以 ENDING 调用 onDisable，INACTIVE 不重复停用；Finalize 再 onEnd、注销。

嵌套结束与依赖完成统一见 [Lifetime](lifetime.md)，不在地形再实现一套停止协议。

## 地形接触与调度

Runtime 顺序为 Movement → Mechanism → Blocking。Movement 先推进阻挡位置计划，再推进路线／自主运动；地形读取这些操作后的身体位置，要求 ACTIVE 且空间存在，不用 Occupancy 代替接触。

轮询维护进入、离开和持续接触，并每次重判动态资格：活性源石、沼泽、深水、地穴要求地面，烟雾允许空中。轮询不捕获同 Tick 所有中间位置，也不复刻 Unity 对象交错。

同一控制器可管理参数不同的多格；预置控制器负责其沼泽／深水，静态装配排除重复管理。预置出现、隐藏和移除复用 Mechanism 生命周期。

## Content 行为

装置按 Occupancy 登记格改写地块，离场仅恢复自己拥有的字段至 initial，保留其他当前字段；没有通用撤销栈。射击台在 Support 配对中登记乘员的 GROUND 禁挡，不改 allowsBlocking，详见 [Occupancy](occupancy.md)。

walkCost 是最终有效代价。普通装置阻碍为 1000，真实地穴固定 1,000,000，不用任意 max 叠加或 hole-like 状态替代地穴身份；导航与部署统一消费当前属性。原件和推导见[地形研究](../research/03-space-units-and-mechanisms.md)。

- 活性源石每次入格安装独立 Effect，相邻同参数格也分别登记，离格保留。绝对期限从入格算起，被覆盖仍流逝，停留到期不重装。同组优先级为 `roundToEven(1000 × (attackBonusRatio + attackSpeedBonus))`，高者生效，同级先安装者生效。周期仅 ACTIVE 推进，首次等待一秒，被覆盖时暂停周期，恢复沿用余量且不补发。
- 烟雾为受选类别为 DEFAULT 的我方单位安装标准隐匿，离开撤销；阻挡不破隐，也没有三秒恢复延迟，空中同样受益。
- 沼泽与深水分开保存控制器扫描和宿主 Effect 周期，不每轮重装；沼泽一秒叠层与重量门槛是独立参数，重型敌人按内容取得双层。
- 活性源石 HP 周期伤害为 ENVIRONMENT，敌方深水为 DAMAGE；均禁本笔 HIT 而保留正常接收／Applied，不把地形、无来源或周期一概等同流失，见 [Resource](resource.md)。
- 必须随控制器结束的接触 Effect 绑定其 Lifetime；onDisable 清 Contact，可逆停用时按业务结束，移除时由依赖图结束产物，不在 onEnd 再重复清理。离格保留的活性源石不自动绑定控制器。
- 地穴由内容判断坠落资格并完整移除 Unit，空地变化在后续接触轮询重判。

活性源石与烟雾的调用链见[原生短链](../research/03-space-units-and-mechanisms.md#51-进入周期与资格的原生短链2026-11-10-补核)。当前支持和更多地形缺口见 [Tactical 语义](tactical-semantics.md)，独立结果的集中验收见 [Verification](verification.md)。
