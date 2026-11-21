# 内容接入

Core 提供通用机制并保存模拟状态，Content 提供具体行为，Data 转换静态资料。结构以可观察玩法语义为依据，不照搬原生类和字段布局。

## 数据与行为

[Data](data.md)解析、选择、覆写和换算静态输入，可以建图或为已有工厂绑定参数；Content 通过 ESM 明确组合 Capability、Effect、Hook 和 Action，提供完整 Definition。Core 使用 Definition／Initial 创建和推进实例。

Unit Definition 保存实际消费者读取的配置。干员的 `create(configuration)` 用解析后的参数构造 Action、Skill 和 Effect，再组装完整 Definition。行动配置集中在 `action.definitions`。

Content 不自行推进模拟，不在共享模块或闭包中保存本场事实；私有运行数据由初始化程序放入 State，不通过字符串动态装载程序。Meta 提供本次阵容与玩法配置；未支持配置在入口明确拒绝，不静默丢弃。

## 内容目录与共享规则

### 单位内容的归属

`content/operators/`、`content/enemies/` 和 `content/devices/` 分别组织干员、敌人和装置内容。包含多个文件的具体单位使用独立目录。专属召唤物放在所属内容目录下的 `summons/`，例如 `operators/ling/summons/dragon.ts` 和 `operators/kaltsit/summons/mon3tr.ts`。召唤物的战斗身份由 `Classification<"SUMMON">` 表达，目录归属用于组织代码。跨单位共享的攻击、弹道和地形程序放在对应的 `actions/`、`projectiles/` 和 `terrain/`。[Classification](capability.md#classification)

具体单位按实际职责拆分文件。单个召唤物的实现可写在一个文件，内容较多时可继续按这些职责拆分。

| 文件 | 职责 |
| --- | --- |
| `unit.ts` | 声明具体 Unit 类型，组合 Capability 配置和完整 Definition。Core 根据这些配置装配实例。 |
| `action.ts` | 定义普攻和特殊行动的目标、时序与输出程序。技能期间带独立执行和冷却的行动也写在这里。 |
| `skill.ts` | 定义 Skill、Activation 程序及该技能专属的 SP 规则。 |
| `effect.ts` | 定义该单位专属的 Effect。 |
| `parameters.ts` | 从传入的原表读取所选干员和配置，解析各工厂所需的具名参数。 |
| `projectile.ts` | 定义该单位专属的弹道及其命中程序。 |
| `summons/` | 组织专属召唤物自身的 Unit、Action、Skill 等程序。 |

### Core 标准机制与 Content 共享工厂

Core 定义战斗的标准语义。Action 的执行与冷却、Skill 的 SP 与激活、Effect 的实例与生命周期由对应 Core 领域处理。标准 Effect 实现位于 `core/effects/`，实例操作位于 `core/unit/effect/`。实现标准眩晕等行为时，Content 调用对应的 Core 实现，并决定目标、时点、时长和专属后继。角色与敌人的默认元素配置调用共享的 Content 工厂。[标准 Effect](../../src/core/effects) · [Effect 实例操作](../../src/core/unit/effect/index.ts) · [Elemental](elemental.md)

Content 共享的是可选工厂。`content/actions/attack.ts` 提供常见攻击的组装，特殊行动可以直接编写 Action Definition。共享工厂按产出的 Definition 归类。`content/actions/skill.ts` 复用攻击模板，产出由技能驱动的 Action。返回 Skill Definition 的共享工厂归 `content/skills/`。共用规则用普通函数组合，具体数值读取规范化数据。

攻击 Operation 明确提供攻击类别与施加途径，HP 伤害另提供性质、HIT 许可和死亡归属，不由范围、距离、来源或技能状态猜测。共同输出协议见 [Resource](resource.md)。

猎狗和弩手各自声明所需的 `Parameters`，由 `create(parameters)` 直接组装 Unit Definition。关卡接入处读取敌人属性和 Prefab，将结果与该敌人的攻击时序等参数一起交给工厂。两者各自校验 `WALK`、使用 Prefab 提供的路点策略，并明确登记共用的攻击停步与登场面向 Hook。弩手近远程独立冷却与主行动互斥属于其内容政策，场景负责选择内容和波次。[敌人数据接入](data.md#敌人静态资料) · [共用敌人 Hook](../../src/content/enemies/hook.ts)

Content 按 [Attribute](attribute.md) 契约绑定所属能力的属性；攻速与连续基础攻击间隔归 Action Capability，每个 Action 显式选择 ATTACK_SPEED 或 FIXED 周期。普通攻击接收 Data 转换的静态时序，共享程序处理缩放、开始预算和分段等待。玫兰莎的首次／续轮起手由其持久 Action 状态组织，不由 Core 保存动画状态，详细时序见 [Action](action.md#8-普通攻击释放-hook-与移动)。

装置也使用普通 Unit。射击台以 SUPPORT 配对向当前乘员登记平台独占限制，只禁止 GROUND 阻挡，解除只撤销自身来源，不改地块允许阻挡字段。改格及离场恢复由具体装置程序执行；结构索引支持交换不意味着游戏允许任意搬格，见 [Occupancy](occupancy.md)与 [Terrain](terrain.md)。

## 状态与登场

`Unit.initialize` 分配单位身份并根据具体 Definition 装配标准能力。初始化 Hook 在 add 和 entered 前就绪，初始 Effect 在宿主登记后的 entered 正常安装。装配顺序与执行优先级分开，详见 [Capability](capability.md#初始化与装配)。

出生和部署逐对象接续：一个对象的创建、登记及 entered 完成后，下一项使用最新 BattleState。普通 Unit.tick 位于出生之后、Effect／Skill／Action 之前；需要即时响应伤害或行动结果的变化使用所属业务 Hook，不等待下一 Tick。

内容可扩展 Unit 的私有阶段事实，但不预装标准能力 State、不直接改其他领域状态。占格 Pair、部署账务、来源历史和生命周期由其所属领域维护；历史载荷需要实时字段时重新查询。完整状态接续见 [Functional Core](functional-core.md)。

## 语义证据与项目政策

泥岩 S2 满足目标条件时不等待普攻周期，其 Action 周期为 FIXED(0)；启动先显式取消正在执行的普攻，再清空相关冷却，旧普攻不继续输出，依据见[技能状态切换](../research/cases/08-action-eligibility-and-interruption.md)。普通攻击已接入攻速时序，S2 的执行使用专属 FIXED 时序，未完整接入其根／子程序的原生时间链。

护盾耗尽不移除充能机制。先成功以 BLOCKED 取消才扣盾、自疗和获得盾额外 SP，禁止抵挡或已有取消不执行这些后继；普通 HIT 仍独立按本笔资格。NORMAL 的萨卡兹／阻挡减伤与 FIXED 保值分别遵守接收协议，见[抵挡研究](../research/cases/38-damage-classification-and-permissions.md#抵挡及屏障)。

护盾满层仍推进充能、S2 对实际结算目标独立抽样，以及现有受击回复时点采用明确项目政策；不以组件拆分相似证明原生一致。原生嵌套依据见[同步结算](../research/cases/03-dispatch-and-nested-settlement.md)，公开玩法资料见[PRTS 泥岩](https://prts.wiki/w/泥岩)，两类证据不能互相冒充。

当前支持泥岩 S2（无模组／X）、玫兰莎 S1、猎狗与弩手等代表内容；未实现 Y 模组或其他技能明确拒绝。完整内容和机制缺口集中见 [Tactical 语义](tactical-semantics.md)。

## Unit 与 Capability 的类型约束

基础类型及类别内共享的装配函数放在所属类别目录。`Operator` 用于普通可部署干员，`Enemy` 用于常规战斗敌人。`Device` 表达装置身份，地块装置另行组合自身能力。[干员基型](../../src/content/operators/operator.ts) · [敌人基型](../../src/content/enemies/enemy.ts) · [装置基型](../../src/content/devices/device.ts)

```typescript
type Operator = Unit &
    Classification<"OPERATOR"> &
    Vitality &
    Elemental &
    Offense &
    Blocker &
    Targetable &
    Layer &
    Hitbox &
    Facing &
    Occupancy &
    Deployable;

type Enemy = Unit &
    Classification<"ENEMY"> &
    Vitality &
    Elemental &
    Offense &
    Targetable &
    Layer &
    Hitbox &
    Facing;

type Device = Unit & Classification<"DEVICE">;
```

普通原生角色默认具备阻挡能力，因此 `Blocker` 属于 `Operator` 的基础组合。零阻挡以容量 `0` 表达，高台等情况依照地块和阻挡层资格结算。[原生阻挡证据](../research/cases/23-blocker-and-blockable-roles.md) · [阻挡资格](blocking.md#关系资格与-restriction)

普通干员和敌人都具备 `Elemental` 和用于空间命中的 `Hitbox`。具体 Definition 绑定角色或敌人的元素接收规则，并配置命中体形状。元素免疫由接收限制表达。[元素接收](elemental.md#1-能力与定义) · [空间查询](spatial.md)

猎狗和弩手各自在 `Enemy` 上组合被阻挡、受力移动、路线和 Presence。战术装备整理箱和战术射击台各自在 `Device` 上组合生命、受选、占格与部署。两种装置按各自的出入场流程调用共用的地块修改和恢复函数。具体单位均从自身的 `definition` 推导配置类型。[猎狗](../../src/content/enemies/hound/unit.ts) · [战术装备整理箱](../../src/content/devices/crate.ts) · [地块操作](../../src/content/devices/tile.ts)

### 具体单位的写法

干员通过 `create(configuration, tables)` 构造。配置使用 `operators/configuration.ts` 中的 `Configuration`，有技能的干员同时要求 `SkillSelection`。`tables` 是 Data 提供的完整原表。该干员的 `resolve(configuration, tables)` 选择自己使用的角色记录、技能等级和模组阶段，解释相应字段并返回属性、普攻、技能和效果的具名参数。Action、Skill 和 Effect 的工厂声明自己需要的参数，由 `unit.ts` 调用并组装。常规养成、解锁和普通天赋候选选择由 `operators/parameters.ts` 共享。[干员静态资料](data.md#干员静态资料)

在 `content/operators/melantha/unit.ts` 中声明具体单位的能力组合，从该单位的 `definition` 推导完整配置类型，并用 `satisfies` 检查实际提供的配置。

```typescript
type Melantha =
    Operator &
    ActionCapability<Melantha> &
    SkillCapability<Melantha>;

type Definition = Melantha["definition"];

const definition = {
    ...operatorDefinition,
    action: actionConfiguration,
    skill: { definition: skillDefinition },
} satisfies Definition;
```

`satisfies` 校验必需的能力配置，并保留具体 Definition 对象的推导类型。Action 和 Skill 的能力配置以 `Melantha` 校验宿主配对，接收宿主 Ref 的回调可以直接读取已声明的能力。

`ActionCapability<H>` 的配置用具体宿主检查行动列表并为 `select` 提供宿主类型。`SkillCapability<H>` 的配置以同样方式检查选定技能。具体 Action、Skill 和 Activation Definition 声明回调所需的最小宿主能力，再组装进单位 Definition。

Effect 也通过 Definition 声明宿主要求。调用者先确定具体构造分支，Catalog 自动推导标准状态和必需 Initial；允许额外已知 Initial，不为联合 Definition 维护并行校验层。

干员的 `create(configuration, tables)` 返回 Unit Definition。编队把它与独立的 Card Definition 绑定为开场手牌，普通干员的费用与再部署时间可由 `operators/card.ts` 组装。Unit 的 `Deployable` 和 `Occupancy` 由各具体内容声明。预布置和普通出生直接使用 Unit Definition，方向属于本次 Initial。[干员 Card 工厂](../../src/content/operators/card.ts) · [部署](deployment.md#静态内容与-card)

同宿主多个领域写入组合其合法 Change 后一次提交；动态能力判断由 optional 读取实际前序结果。精确私有写回、完整生命周期与跨领域结算保持所属业务契约，不直接调用 Core 内部 replace。完整规则见[接口约定](api-conventions.md)与[领域能力](capability.md)。
