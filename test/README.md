# 测试

测试按[架构文档](../docs/architecture/README.md)的领域边界组织，保障其中的必要语义。每项独立结果选择最小代表，共用协议集中证明；跨领域场景归负责组织该业务的领域，消费者只增加自己的业务后果。

## 编写与修改

- 先确定原生依据或明确的项目选择，再写预期；实现与文档冲突时先查清语义。
- 每个套件开头用 Contract 链接所属文档，具体必要结果与集中归属由[语义验收](../docs/architecture/verification.md)维护。
- 保留资源、身份、生命周期、采样和同步重入等会改变结果的边界，不按 Getter、字段或内部步骤铺矩阵。
- 通过合法构造和领域操作建立场景，不篡改 readonly Definition、身份计数或生命周期。
- 夹具只准备事实、组合实际接口，不另写一套待验证算法或未接入内容。
- 类型测试集中保障能力、身份、Initial 和私有状态／回调配对，不逐字段验证普通声明。
- 收敛不以文件或 test() 数量衡量；删除重复证明时同时清理无用途的夹具，修复回归优先补足所属代表。

## 目录

```text
test/
├── common/     # 通用算法、容器与惰性查询
├── core/       # Core 领域与公共执行契约
├── data/       # 静态转换及其产物
├── content/    # 具体角色、装置、弹道与地形行为
├── fixtures/   # 原始资料样本
└── helpers/    # 合法场景构造与实际操作组合
```

单一套件按主题命名，同一主题有多个套件时使用子目录。以被保障的结果决定归属，不按导入了哪些模块分类，也不镜像实现文件。

## 已审查范围

一篇文档可以对应多个套件。下表导航到实际位置，业务契约只在所属文档与语义验收中维护。

| 文档主题 | 套件 |
| --- | --- |
| [接口与查询](../docs/architecture/api-conventions.md) | [order](common/order.test.js)、[query](common/query.test.js)、[store](common/store.test.js) |
| [数值与静态换算](../docs/architecture/data.md)、[属性](../docs/architecture/attribute.md)、[确定性](../docs/architecture/functional-core.md) | [math](common/math.test.js)、[modifier](common/modifier.test.js)、[attribute](core/attribute.test.js)、[RNG](common/rng.test.js) |
| [类型约束](../docs/architecture/api-conventions.md#统一-typed-ref-与类型恢复) | [types](core/types.test.js) |
| [Unit 构造](../docs/architecture/capability.md)、[状态接续](../docs/architecture/functional-core.md)、[Change](../docs/architecture/api-conventions.md#51-unit-完整操作与批量变更) | [unit](core/unit.test.js)、[runtime](core/runtime.test.js)、[change](core/change.test.js) |
| [Hook](../docs/architecture/hook.md)、[Lifetime](../docs/architecture/lifetime.md) | [hook](core/hook.test.js)、[lifetime](core/lifetime.test.js) |
| [Resource](../docs/architecture/resource.md) | [Calculate](core/resource/calculation.test.js)、[Apply](core/resource/application.test.js) |
| [Vitality](../docs/architecture/vitality.md)、[Elemental](../docs/architecture/elemental.md) | [vitality](core/vitality.test.js)、[elemental](core/elemental.test.js) |
| [Action](../docs/architecture/action.md)、[Skill](../docs/architecture/skill.md) | [action](core/action.test.js)、[skill](core/skill.test.js) |
| [Effect 与标准效果](../docs/architecture/effect.md) | [引擎](core/effect.test.js)、[控制](core/effects/control.test.js)、[元素爆发](core/effects/elemental.test.js) |
| [Capability](../docs/architecture/capability.md) | [contribution](common/contribution.test.js)、[classification](core/classification.test.js)、[facing](core/facing.test.js) |
| [Battlefield](../docs/architecture/battlefield.md) | [battlefield](core/battlefield.test.js) |
| [Geometry](../docs/architecture/geometry.md) | [vector](common/vector.test.js)、[coordinate](core/geometry/coordinate.test.js)、[range](core/geometry/range.test.js)、[sweep](core/geometry/sweep.test.js) |
| [Navigation／Route／Locomotion](../docs/architecture/navigation.md) | [route](core/navigation/route.test.js)、[locomotion](core/navigation/locomotion.test.js)、[unbalance](core/navigation/unbalance.test.js)、[avoidance](core/navigation/avoidance.test.js)、[speed](core/navigation/speed.test.js) |
| [Schedule](../docs/architecture/schedule.md) | [schedule](core/schedule.test.js) |
| [Targeting／Targetable](../docs/architecture/targeting.md)、[Presence](../docs/architecture/presence.md) | [eligibility](core/targeting/eligibility.test.js)、[targetable](core/targeting/targetable.test.js)、[presence](core/presence.test.js) |
| [Blocking](../docs/architecture/blocking.md)、[Occupancy](../docs/architecture/occupancy.md)、[Deployment](../docs/architecture/deployment.md) | [blocking](core/blocking.test.js)、[occupancy](core/occupancy.test.js)、[deployment](core/deployment.test.js) |
| [Projectile](../docs/architecture/projectile.md)、[Mechanism](../docs/architecture/terrain.md)、[Event](../docs/architecture/event.md) | [projectile](core/projectile.test.js)、[mechanism](core/mechanism.test.js)、[event](core/event.test.js) |
| [Data：单位配置](../docs/architecture/data.md) | [operator](data/unit/operator.test.js)、[enemy](data/unit/enemy.test.js)、[tags](data/unit/tags.test.js) |
| [Data：Effect 与关卡](../docs/architecture/data.md) | [effect](data/effect.test.js)、[route／schedule](data/level/route-schedule.test.js)、[predefined](data/level/predefined.test.js) |
| [Content：行动与角色](../docs/architecture/content.md) | [attack](content/actions/attack.test.js)、[output](content/actions/output.test.js)、[enemies](content/enemies.test.js)、[Melantha](content/operators/melantha.test.js)、[Mudrock](content/operators/mudrock.test.js) |
| [Content：装置、弹道与地形](../docs/architecture/content.md) | [tiles](content/devices/tiles.test.js)、[shooting-platform](content/devices/shooting-platform.test.js)、[arrow](content/projectiles/arrow.test.js)、[terrain](content/terrain.test.js) |

[battle 夹具](helpers/battle.js)通过 Runtime 输入构造地图与预置 Unit，不接受任意能力状态或进度注入。综合场景只保留新增的协作结果。

## 运行

`npm test` 先编译，再递归执行 test 下的全部 `*.test.js`，包含上述四类套件，不执行 fixtures 和 helpers。`npm run check` 检查 lint、源码格式和类型。

局部修改先运行受影响套件，例如 `node --test test/core/vitality.test.js`；JS 测试从 dist 导入，定向执行前先 build。跨领域整理后运行完整检查。
