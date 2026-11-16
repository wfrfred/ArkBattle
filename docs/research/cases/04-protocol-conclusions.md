# 原生调用协议归纳

本页归纳 [Buff 安装与父关系](01-buff-installation-and-parent-scope.md)、[行动与弹道](02-action-and-projectile-phases.md)、[派发与嵌套结算](03-dispatch-and-nested-settlement.md)；详细调用锚点、版本和限制由各案维护。

| 原生事实 | 能区分的情况 |
| --- | --- |
| 登记、开始动作、接纳与生效分别发生 | NewBuff 可先执行开始动作，再因 UNIQUE 返回 null；拒绝不自动撤销已完成前缀。 |
| 停止贡献、结束通知、容器移除与池回收分别发生 | MarkFinish 先失效并传播；ON_FINISH 与清理有独立入口。 |
| 来源 Unit 与父 Buff 不是同一生命周期 | 维什戴尔父天赋可在来源留场时结束，残影随精确父实例失效。 |
| 属性样本是已发生的事实 | 鼓舞按触发刷新来源样本，不在每次属性查询时重算；弹道有 cachedAtkOnly 与普通路径之别。 |
| 行动与已发射弹道有独立执行边界 | 行动结束不自动撤销全部在途内容；停止、来源失效和父结束分别由具体政策处理。 |
| 派发候选与执行资格分别决定 | 同一 Buff 容器的未退出枚举共享身份范围，逐项读取有效性；UID 查询读取当前登记，新增身份不加入旧范围。 |
| 已进入程序与后续候选资格不同 | 结束当前 Buff 不必截断已进入的动作列表；下一节点仍受自身执行条件限制。 |
| 嵌套结算与本笔报告不同 | DamageSplit 完成独立接收后才返回外层；Modifier 结果不汇总整段内容的净生命变化。 |
| 取消本笔损伤与停止其他业务不同 | 泥岩成功抵挡仍执行消耗与回复；取消、归零和停止派发不可混为一项。 |
| 几何候选与安装关联不同 | Aura／GlobalBuff 记录目标到具体 Buff 的关联，离开、来源结束和后来出生有不同入口。 |

原生可变对象的写入只能证明相关后继读取顺序，不能直接要求项目每步公开提交状态，也不能决定项目的类型、容器或数据所有权。

以上结论限定于已核实的普通分支。未初始化目标、全部覆盖／免疫组合、特化采样和各死亡状态机仍需相应实际内容；不能从一个容器或一个伤害入口推出全引擎统一协议。

项目当前规范见 [Effect](../../architecture/effect.md)、[Hook](../../architecture/hook.md)、[Resource](../../architecture/resource.md)、[Action](../../architecture/action.md)、[Projectile](../../architecture/projectile.md)与[Lifetime](../../architecture/lifetime.md)。
