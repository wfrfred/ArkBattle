# 全项目一致性审查（2026-11-27）

审查基线 `1f098eca`。这是审查记录，而不是新增规范。按模块组织、实例与身份、状态修改与扩展、业务操作与查询四个维度横向比较 Core，并核对 Content、Data、测试中的实际使用。已有文档、代码和测试均为待审材料：一致不证明设计合理，不一致也不证明应当合并。实际业务语义与已经确认的项目选择决定统一边界。

当前轮仅迁移语义等价的历史残余；有设计、类型或战斗行为取舍的项保持现状，等待定稿。原生机制未闭接入项仍由[剩余缺口](research-necessity-20261122.md)管理，不在本表重复立项。

## 已清理

| 概念 | 历史差异 | 统一结果 |
| --- | --- | --- |
| 领域操作与推进 | Schedule 使用 `runtime.ts`，其他领域使用 `operations.ts` | [Schedule operations](../../src/core/battle/schedule/operations.ts)，总战斗协调保留 `battle/runtime.ts`。 |
| 普通字段 Change | Layer 的 `setType`、Occupancy 的 `setDirection` 置于完整操作文件 | 归各自 [Layer](../../src/core/unit/capability/layer/capability.ts)、[Occupancy](../../src/core/unit/capability/occupancy/capability.ts) 的状态定义文件，保留原后继。 |
| 资源资格查询 | Vitality 的 `canReceiveDamage`、`canReceiveHp` 在 operations，Elemental 在 query | 归 [Vitality query](../../src/core/unit/capability/vitality/query.ts)，公共入口与资格语义不变。 |
| Ref 读取 | Action、Skill 分别为同一个 `ref` 导出 `executionRef`、`activationRef` | 统一公开 `ref(self)`；保留真实的 ExecutionRef、ActivationRef 类型，局部导入按需命名。 |
| 引用归属 | Pull 保存 `unbalance`、Unbalance 保存 `host`，均与各自稳定 Ref 的归属字段相同 | 只读 `self.ref.unbalance`／`self.ref.host`，去掉重复实体字段。[Pull](../../src/core/unit/capability/shifting/pull.ts) · [Unbalance](../../src/core/unit/capability/shifting/unbalance.ts) |
| 通用结果 | Battle 单独导出 `OperationResult`，实际为通用 Result，部分调用点又改回 Result | 公共出口统一 `Result`，同时删除 Battle Runtime 重复的 Input／Command／Event 类型转发。[Battle index](../../src/core/battle/index.ts) |
| 读取与求值 | Action.getApplyWay 实际归并 Definition；Elemental.get 实际要求所给 Burst 仍占当前槽 | `resolveApplyWay` 与 `getCurrentBurst`，不把后者与 Ref 的登记查询混为一谈。[Action query](../../src/core/unit/capability/action/query.ts) · [Elemental query](../../src/core/unit/capability/elemental/query.ts) |
| 不存在的业务状态 | EP Healing Pending 恒带 `cancellation:null`，但该业务没有取消协议 | 仅保留 amount，不新增虚构的判别状态。[EP Healing](../../src/core/battle/resource/ep/healing/contract.ts) |
| 不可变字段写回 | Card 的 Hook/Restriction 手写同一叶字段替换；Targetable 独有无用 readonly 数组复制 | 具体 Card 使用 `replaceIn`，保留原 no-op 行为；Targetable 与其他 Capability 一样共享不可变初值。 |

相关[接口约定](api-conventions.md)与领域文档已迁移。不为这些等价迁移新增长期测试用例。

## 待取舍

### 1. 实例类型与擦除边界（优先）

现有 Effect、Skill 允许具体实例向默认 `object` 视图泛化；Card、Action 的具体 Ref 无法赋给默认 Ref（以项目严格模式类型探针验证）。[Card](../../src/core/battle/deployment/deck/card/card.ts) 及其公共 Hook、部署请求、查询使用 `any` 处理方差障碍；[Action](../../src/core/unit/capability/action/action.ts)、[Execution](../../src/core/unit/capability/action/execution.ts)、[Activation](../../src/core/unit/capability/skill/activation.ts) 存在不变泛型或额外 Identity 视图。[Projectile](../../src/core/projectile/projectile.ts) 的回调配对与额外字段类型擦除也不同于 Effect／Action。

已经确认的项目选择是 Content 精确类型、普通 Core 使用 `object`、异构存储和派发边界允许受控 `any`；宽视图不主动写调用者不知道的私有状态，不要求 TS 额外证明这一约定。**待定的是如何统一实际模型，而不是重新禁止宽视图。** 推荐先明确各实例保存 Definition 的配对方式，再统一公开查询和操作约束；保留 Projectile 的实际能力装配及具体 Definition 类型，不贸然抹去 T 或引入新 View／Identity 协议。方差改变会影响装配、精确 Ref 和回调，不能视作纯改名。

### 2. Blocking 固有 Hook 的顺序（优先）

[Blocker](../../src/core/unit/capability/blocking/blocker/blocker.ts)、[Blockable](../../src/core/unit/capability/blocking/blockable/blockable.ts) 初始化用 `Hooks.empty().set(...).merge(unit.hooks)` 前置固有 removing；Deployable、Skill、Route、Occupancy 则在现有集合上 set。两侧 Blocking 固有 Hook 都是 priority 0。因此前者改变同级执行顺序，以及同 ID 的输入／固有登记覆盖方向。阻挡释放会派发同步通知，顺序差异可被观察，不能直接换成 set。

需要决定是否有明确业务理由让解除阻挡早于输入的同级 removing；若有，推荐以实际优先级明确表达，而非隐藏在装配方式里；若无，统一通常的登记方式。现有 Hook／Capability 文档原先没有描述例外，已标明待决事实，不把例外定成规范。

### 3. 完整操作与 Change 的文件归属

[Presence operations](../../src/core/unit/capability/presence/operations.ts) 的 appear/disappear 返回 Change，但组合可见性、移动限制、Action 中断和 Blocking 释放，是完整业务主题。[Route operations](../../src/core/unit/capability/route/operations.ts) 的 removeContext、reassign、skipWait、setTraceTarget 与共同解释器紧密配合。与已迁移的简单字段 Change 不同，拆到 capability.ts 会跨文件共享内部解释和结算入口。

需要决定规范以实际业务职责为准，还是所有 Change 工厂必须位于模型文件。推荐按职责区分，小而相连的完整主题共置，不能单纯依据返回类型机械移动。

### 4. 基础 Unit 活性与领域准入

Elemental 的 available、SP 私有 available、Action 启动及 Skill 发动等多处重复「ACTIVE 且有 Vitality 时 HP>0」，HP 资源也检查这两项。[Elemental query](../../src/core/unit/capability/elemental/query.ts) · [SP](../../src/core/unit/capability/skill/sp.ts) · [Action operations](../../src/core/unit/capability/action/operations.ts) · [Skill operations](../../src/core/unit/capability/skill/operations.ts)

可提供 Unit 层共同活性谓词，但须区分 `vitality.isAlive`（只读 HP）、没有 Vitality 的 Unit、仅要求 ACTIVE 的持续执行，以及 Lifetime.available（依赖资格）。**新增共同语义和名字仍待定**，不扩大任何业务资格、不删除同步重入后的复查。

### 5. SP 状态变更的最低宿主类型

[SP](../../src/core/unit/capability/skill/sp.ts) 的属性 Contribution/Range Change 接受所有 Skill；无 SP 时忽略。其他属性 Change 要求对应能力，且已有 `hasSp`。需决定这是面向所有技能的便利操作（无 SP 是正常结果），还是只允许具有 SP 的宿主，调用方在真实运行期不确定时使用 optional。SP 完整业务操作的 `NO_SP` 等拒绝结果不因此改义。

### 6. Card 限制的覆盖生命周期

[Card query](../../src/core/battle/deployment/deck/card/query.ts) 按 default、Definition、runtime、Request 四层同 ID 覆盖，撤销 runtime 项会重新露出底层限制；Unit 初始化把 Definition 的限制装成唯一运行列表，撤销同 ID 项不恢复旧值。Request 的短期覆盖有特殊移动部署这一实际需求，应保留。待决定 Definition 与 runtime 的覆盖是临时替换还是永久登记替换；没有证据要求把 Unit 的所有限制改成四层。Deck 负责有序 Card 集合，Card 入口读取/登记集合可由 Deck 实现，不为目录一致改变这一既有所有权。

### 7. SP 的 Tick 边界与实时推进

[SP](../../src/core/unit/capability/skill/sp.ts) 用 lastTick 保存实际已过时间，创建时采样；DP、HP、EP 则每次调度推进一步。现有 [Skill 契约](skill.md) 明确 SP 的首 Tick、停速及恢复行为。若统一为每次 advance 固定推进一次，需要决定创建 Tick 是否计时及速率恢复时点，不能直接删除 lastTick。其他资源的周期保留方式不是同一语义，不要求统一状态形状。

### 8. HP / EP 的完成通知

HP Damage/Healing 派发 Completed，EP Damage/Healing 直接返回 Outcome。之前 Resource 文档的公共流程图未区分，已纠正文档事实。是否需要 EP 对失败、取消和完成结果的独立观察，须以业务需求决定；不因对称性增加 Hook。EP 的 damaged/healed 前置于 Applied 且要求实际正变化，与 HP 的 lossCommitted 并非同义。

### 9. 次一级边界问题（未证明需要重构）

- **容量规则：** HP 的 MaxHP 变化同步调整 HP 比例；EP 的 MaxEP 可动态求值、后继损伤/恢复裁剪；DP、Slot 和库存有各自明确规则。EP 上限动态降低、禁疗期间的原始 EP 保存是否改变真实玩法仍需机制依据，不能凭 HP 的行为要求 EP 同步调整。
- **校验位置：** Ammo 的静态与动态贡献均到 `resolveCapacity` 才校验，而 Blockable volume、Projectile slowdown 在登记时校验；应按真实外部输入与动态求值的信任边界决定，不统一为每次查询重复检查。不同缺失 Ref 的错误形式仅在违反调用前提时才出现，Card 是不终结根；不为统一非法调用表现添加防御。
- **Pull.scope：** 与已移除的 `host`／`unbalance` 不同，它可能记录初次施加的历史事实，而 Lifetime 的依赖边可改变。未证明有消费者也未证明该事实应废弃；若只用于登记，可考虑移除实例字段。Overlay 对等值更新不保留旧聚合状态 的做法也未证明有业务或实际性能问题，本次不增加新的 no-op 检查。

## 合理保留的差异

| 对照 | 差异依据 |
| --- | --- |
| Unit / Card / Projectile / Effect 创建 | 普通实体分离 initialize、add；Effect 重复安装可能保留旧实例与 Definition，install 是完整原子业务；Card 为不可终结依赖根；Action/Skill 持久身份与执行轮次独立。 |
| 生命周期通知与执行结果 | Unit entered/removing/removed、Definition onEnd、Effect 启停、Action/Activation finish/cancel 是不同业务时点，不强制所有实体拥有同样 Hook。 |
| Store 与领域局部存储 | Route 三类执行槽、Overlay 的运动模式、Unbalance 本轮和历史 ENDING 实例具有各自存储关系，不为统一容器强行增加 Store。 |
| 文件层次 | Blocking 分子能力、多操作文件；Shifting 的 shifter/shiftable 与独立失衡/牵引主题；短 Definition 与实体同文件，多文件才使用公共 index。按实际复杂度组织。 |
| Change 与写回 | Unit Change 支持一次发布多字段及 Settlement；Card 的局部资源转换返回 Card，Projectile 按 Ref 局部更新。泛型 Unit/Action/Card 等直接使用 replaceIn 受 PathValue 约束（独立严格类型探针失败），保留必要 spread，不强行断言或重做类型。 |
| Hook 分派 | 通用 Key、候选、优先级、dispatch 已统一。Unit.removed 的注销前候选、Blocking 双角色、Resource 的活来源限制、Card 不终结根的分派机会是不同业务边界。 |
| 计时 | Action 保相对比例、SP 保绝对进度、DP 基础 Tick 累计、Supply 当前剩余冷却与后续周期、Effect DURATION/DEADLINE 都有领域语义。Projectile 固定全 Tick 入口候选也不同于领域阶段候选。 |
| 资源 | DP/SP 支付、库存 consume、弹药允许负值并延后检查；HP 剩余比例与 EP 损伤比例；免支付报价与部署牌价 COST。没有理由把它们统一成万能资源模型。 |
| 参数 | null 表示明确无业务值；可选程序、Partial 局部覆盖、`?: never` 禁止组合、仅类型标记不是业务缺省状态。 |

## 后续复审原则

改变公共约定应横向检查全部同类概念与调用链；明确等价的迁移一次做完。已证实的行为差异先问业务来源与必要性，不能用已有实现或文档为特例循环论证；有取舍的项在定稿前不写新的规范、不添加专门为中间方案建立的长期测试。
