# 测试

测试保障[架构文档中的必要语义](../docs/architecture/verification.md)，不锁定历史实现。每项独立结果选择最小代表，共用协议集中证明；消费者只增加自己的业务后果。收敛不以文件或 test() 数量衡量，同一用例内的重复证明也应删除。

## 编写与修改

- 先确定原生依据或明确的项目选择，再写预期；实现与文档冲突时先查清语义。
- 保留资源、身份、生命周期、采样和同步重入等会改变结果的边界，不按 Getter、字段或内部步骤铺矩阵。
- 通过合法构造和领域操作建立场景，不篡改 readonly Definition、身份计数或生命周期。
- 夹具只准备事实、组合实际接口，不另写一套待验证算法或未接入内容。
- 类型测试保障能力、身份、Initial 和私有状态／回调配对，不逐字段验证普通类型声明。
- 删除重复用例时一并清理无用途的夹具和故障注入；修复回归优先补足所属代表场景。

## 已审查范围

每项关键结果、集中归属及支持边界由[语义验收](../docs/architecture/verification.md)维护。下表只导航到套件，不重复业务契约。

| 主题 | 套件 |
| --- | --- |
| 公共集合、Query、数值、RNG | [common](common/) |
| State／Unit／Change／Hook／Lifetime | [runtime](sim/runtime.test.js)、[unit](sim/unit.test.js)、[unit-change](sim/unit-change.test.js)、[hook](sim/hook.test.js)、[lifetime](sim/lifetime.test.js)、[core-types](sim/core-types.test.js) |
| HP／EP 结算与恢复、Burst | [damage](sim/damage.test.js)、[healing](sim/healing.test.js)、[elemental](sim/elemental.test.js)、[标准爆发](sim/elemental-runtime.test.js) |
| Action／Skill／Effect／Contribution | [action](sim/action.test.js)、[skill](sim/skill.test.js)、[effect](sim/effect.test.js)、[contribution](sim/contribution.test.js) |
| 路线、出兵与转换 | [route](sim/route-capability.test.js)、[schedule](sim/schedule.test.js)、[静态转换](content/route-schedule-data.test.js) |
| 战场、几何与运动 | [battlefield](sim/battlefield.test.js)、[坐标](sim/coordinate.test.js)、[范围](sim/geometry-range.test.js)、[扫掠](sim/geometry-sweep.test.js)、[locomotion](sim/locomotion.test.js)、[避障](sim/locomotion-avoidance.test.js)、[移速](sim/move-speed-contributions.test.js) |
| 目标资格、选择与存在 | [targeting](sim/targeting.test.js)、[targetable](sim/targetable-restrictions.test.js)、[攻击接入](sim/targeting-action.test.js)、[presence](sim/presence.test.js)、[阵营](sim/allegiance.test.js) |
| 阻挡与部署 | [blocking](sim/blocking.test.js)、[deployment](sim/deployment.test.js) |
| 独立过程与表现 | [追踪弹道](sim/projectile-tracking.test.js)、[UI Event](sim/event-output.test.js) |
| 静态资料与真实内容 | [content](content/)、[Effect 数据](content/effect-data.test.js) |

[battle 夹具](helpers/battle.js)通过 Runtime 输入构造地图与预置 Unit，不接受任意能力状态或进度注入。综合场景仍只保留新增的跨领域结果，不能因为文件涉及多个领域就豁免重复覆盖。

## 运行

`npm test` 先编译，再运行全部套件。`npm run check` 检查 lint、源码格式和类型。局部修改先运行受影响套件，跨领域清理后运行完整检查；JS 测试从 dist 导入，定向执行前先 build。
