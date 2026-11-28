# Terrain

Tile 拥有地形定义、初始和当前空间属性；无宿主 Effect 作为地形控制器，保存接触记录和扫描时间；持续伤害、修正、限制和叠层归以 Unit 为宿主的 Effect。

## 地块与类型恢复

Terrain 在构造入口建立 Definition 与逐格 params 配对，不列举全部游戏地形。原始 Definition 的 `create` 接收具体 params；实例保存同一个 Definition，但将 `create` 的输入擦为 `never`，保留 `Terrain<P>` 返回类型。Tile 保留静态 terrain／initial 和当前 State；稠密不可变 Tiles 保存并查询普通 Tile，原始 Definition 和实例持有的 Definition 均可按对象身份恢复精确参数类型，普通属性更新不修改定义。

当前地图是地块属性唯一权威，不另存 tileStates。完整 Tile 更新校验新步行代价，WALK 通行资格或步行代价改变时重建 WALK 基础图，FLY 通行资格改变时重建 FLY 基础图；保留各模式 Overlay 和未受影响的 ModeState，再维护 Blocking。Content 调用战斗完整入口，不直接改底层图。

高度、可部署类型、通行类型与 allowsBlocking 是不同事实。显式 tile_blockable 优先决定初始阻挡许可，无配置才按原始高地回退；Blocking 消费当前许可，不用当前 elevation 再否决显式允许。相关原生依据见[地形研究](../research/03-space-units-and-mechanisms.md)。

siteCondition 是单个条件身份或 null，null 不等于普通场地条件。Content 部署限制判断是否支持；Data 将原始位值转换为 normal／deepsea／tide／night／brokenWalkway。后者目前仅接场地许可，完整步道切换和坠落尚未接入。

## 地形控制器

控制器使用 `Definition<ContactState, null>` 表达独立的全场效果，开场通过 `initialEffects` 安装，运行中通过 `effect.install(battle, null, definition, initial)` 安装。两种入口均显式提供完整 Initial。Content 的 [地形控制器工厂](../../src/content/terrain/controller.ts) 提供具体程序；indices 为 null 时扫描全部对应地形，数组时仅扫描指定地块。各地形明确提供 retainOnLeave 策略；宿主修正中无对应修正的字段为 null。控制器沿用 [Effect](effect.md) 的登记、状态修改、启停、推进和移除，并可作为其他 Effect 的 Lifetime 依赖，不另建生命周期协议。

## 地形接触与调度

Runtime 统一在 Effect 阶段推进所有 Effect，该阶段早于 Movement；地形控制器只在 ACTIVE 时推进 `onTick`，读取当前身体位置，要求 Unit 为 ACTIVE 且空间存在，不用 Occupancy 代替接触。移动带来的接触变化在下一次扫描时处理。这是项目的统一调度选择，不要求复刻原生的 Tick 内执行先后。

轮询维护进入、离开和持续接触，并每次重判动态资格：活性源石、沼泽、深水、地穴要求地面，烟雾允许空中。单位离场时，其 Effect 随宿主 Lifetime 结束，地形在下一次扫描清理接触记录。轮询不捕获同 Tick 所有中间位置，也不复刻 Unity 对象交错。

同一控制器可管理参数不同的多格；关卡配置的控制器负责其沼泽／深水，静态装配排除重复管理。关卡程序可按 Effect 的生命周期操作安装、启停和移除控制器。

## Content 行为

装置按 Occupancy 登记格改写地块，离场仅恢复自己拥有的字段至 initial，保留其他当前字段；没有通用撤销栈。射击台在 Support 配对中登记乘员的阻挡限制，禁止阻挡 GROUND 目标，不改 allowsBlocking，详见 [Occupancy](occupancy.md)。

walkCost 是最终有效代价。普通装置阻碍为 1000，真实地穴固定 1,000,000，不用任意 max 叠加或 hole-like 状态替代地穴身份；导航与部署统一消费当前属性。原件和推导见[地形研究](../research/03-space-units-and-mechanisms.md)。

- 活性源石每次入格安装独立 Effect，相邻同参数格也分别登记，离格保留。绝对期限从入格算起，被覆盖仍流逝，停留到期不重装。同组优先级为 `roundToEven(1000 × (attackBonusRatio + attackSpeedBonus))`，高者生效，同级先安装者生效。周期仅 ACTIVE 推进，首次等待一秒，被覆盖时暂停周期，恢复沿用余量且不补发。
- 烟雾为受选类别为 DEFAULT 的我方单位安装标准隐匿，离开撤销；阻挡不破隐，也没有三秒恢复延迟，空中同样受益。
- 沼泽与深水分开保存控制器扫描和宿主 Effect 周期，不每轮重装；宿主 Effect 在自身 `initialize(battle)` 读取当前 Tick，初始化周期起点。沼泽一秒叠层与重量门槛是独立参数，重型敌人按内容取得双层。沼泽宿主 Effect 停用时撤销修正，不清除已累积层数或下一次计时；重新启用时立刻按已累积层数恢复修正，沿用原有计时。
- 活性源石 HP 周期伤害为 ENVIRONMENT，敌方深水为 DAMAGE；均禁本笔 HIT 而保留正常接收／Applied，不把地形、无来源或周期一概等同流失，见 [Resource](resource.md)。
- 停用控制器时，`onDisable` 清除接触记录，并按内容的保留规则结束接触 Effect。需要随控制器移除的 Effect 绑定其 Lifetime，在依赖结算阶段结束。活性源石的 Effect 在离格及控制器停用后保留，按自身期限结束。
- 地穴由内容判断坠落资格并完整移除 Unit，空地变化在后续接触轮询重判。

活性源石与烟雾的调用链见[原生短链](../research/03-space-units-and-mechanisms.md#51-进入周期与资格的原生短链2026-11-10-补核)。当前支持和更多地形缺口见 [Tactical 语义](tactical-semantics.md)，独立结果的集中验收见 [Verification](verification.md)。
