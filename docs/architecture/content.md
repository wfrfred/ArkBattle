# 内容接入

Core 提供通用机制并保存模拟状态，Content 提供具体行为，Data 转换静态资料。结构以可观察玩法语义为依据，不照搬原生类和字段布局。

## 数据与行为

[Data](data.md)解析、选择、覆写和换算静态输入，可以建图或为已有工厂绑定参数；Content 通过 ESM 明确组合 Capability、Effect、Hook 和 Action，提供完整 Definition。Core 使用 Definition／Initial 创建和推进实例。

Content 不自行推进模拟，不在共享模块或闭包中保存本场事实；私有运行数据由初始化程序放入 State，不通过字符串动态装载程序。Meta 提供本次阵容与玩法配置；未支持配置在入口明确拒绝，不静默丢弃。

## 内容目录与共享规则

具体角色按目录组织 action 与 unit：行动文件表达目标、时序和输出，单位文件组合能力、天赋和选择政策。实际共同规则用普通函数共享，不建立模板继承或中央角色 ID 分派器。分支规则与个人机制分别组合，数值读取规范化配置，不按职业名称硬编码。

标准成品位于 [core/effects](../../src/core/effects)，通用实例操作位于 [unit/effect](../../src/core/unit/effect/index.ts)。Content 选择对象、时点、参数和专属后继，不重写同一标准机制的竞争与伤判。Elemental 的已有成品可由 Data 静态绑定，执行仍归 Core，见 [Elemental](elemental.md)。

攻击 Operation 明确提供攻击类别与施加途径，HP 伤害另提供性质、HIT 许可和死亡归属，不由范围、距离、来源或技能状态猜测。共同输出协议见 [Resource](resource.md)。

猎狗／弩手等内容自行选择行动；弩手近远程独立冷却与主行动互斥属于其内容政策，不要求所有 Action 都互斥。场景负责选择内容和波次，不建立中央敌人工厂。

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

具体 Definition 必须声明回调实际依赖的能力，Effect 的宿主类型表达读取需求。调用者先确定具体构造分支，Catalog 自动推导标准状态和必需 Initial；允许额外已知 Initial，不为联合 Definition 维护并行校验层。

可部署内容明确声明 Card／Deployable／Occupancy，Card 持久状态与每次 Unit 初态分开；预置和普通出生直接复用统一初始化，不临时重组静态 Definition。方向属于本次 Initial，基础 Unit 不伪造方向。

同宿主多个领域写入组合其合法 Change 后一次提交；动态能力判断由 optional 读取实际前序结果。精确私有写回、完整生命周期与跨领域结算保持所属业务契约，不直接调用 Core 内部 replace。完整规则见[接口约定](api-conventions.md)与[领域能力](capability.md)。
