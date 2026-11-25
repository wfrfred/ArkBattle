# Occupancy 与 Support

Occupancy 拥有单格登记、可选四向摆放方向及已通知的业务配对；Battlefield 维护双槽结构索引。Deployable 单向依赖它，普通占格对象不必有 Card 或撤退业务。

## 关键协作语义

OCCUPANT／SUPPORT 两槽可同格共存，同槽排他。登记格与身体位置、Presence、HP 分开，不因移动／消失自动搬格。配对先发布双方共享事实，再通知；旧组合解除不能清除替代实例的新绑定。

## 模型与构造

静态 Definition 选择固定 Slot，SUPPORT 可提供乘员加入／移除程序。声明能力必须给 Initial.tile 与 Initial.direction，无方向时传 null；State 始终保留非空 tile，不占格的 Unit 不选择该能力。

Catalog 先 Occupancy 后 Deployable，能力自行登记 entered／removed，实际顺序遵守 [Hook](hook.md)，不增加专用能力阶段。setDirection 只改方向，不移动地块或通知配对；方向相关几何通过 hasDirection 取得有效值。

## 结构索引

结构查询返回同格两个 Ref；add／update／remove 原子维护实体与反向登记，不执行内容。登记限地图内，同槽唯一；批量布局先撤销旧登记再检查最终结构，可表达合法交换，但没有公开业务搬格操作。

结构层不判断阵营、费用或地形部署策略。真实离场移除索引，历史 Unit 仍保留原 tile；Occupancy 只清配对，不把地块置空。

## 已通知的业务配对

Pair 保存 tile 及建立时的双方快照，两端引用同一对象。建立前的快照不含自身绑定，避免自引用；它们是历史事实，实时资源和状态按 Ref 重查。

任一端后入场都查询当前同格并建立配对，相同 Pair 不重复通知；对端旧绑定先完整解除，再以最新状态建立。先一次发布双方 Pair，再调用 SUPPORT.onOccupantAdded。

离场使用固定 Departure.unit 的旧 Pair，仅清当前仍持有该 Pair 的端点，先发布再 onOccupantRemoved。若旧组合已被解除，不重复通知，也不影响同格新对象。入场通知开始时双方 ACTIVE 且已配对；移除通知处理原历史组合。

普通 Unit.update／replace 不调用配对程序。配对回调可执行同步业务，外层接续最新 BattleState，通用规则见 [Functional Core](functional-core.md)。

## 与其他领域协作

Deployment 提供落点与本次方向，Support 配对由 Unit 的本地 entered 程序完成。Card 的成功部署通知在 Unit.add 返回后派发，见 [Deployment](deployment.md)。

Blocking 对占格 Unit 使用登记根格，无占格则身体格；平台限制不从高度自动推断。射击台加入配对时只禁止乘员 GROUND 阻挡，解除只撤销自身来源。

设施销毁击倒乘员、改格和恢复由内容查询当前对象并调用完整操作；不直接删存储，不建立通用覆写栈。具体地块业务见 [Terrain](terrain.md)。

## 范围

当前支持单格双槽及 Pair 通知。公开搬格、大型设施多格、完整特殊重部署和更多设施后继仍未完整实现；大型 Hitbox 不代替多格登记。验收归属见 [Verification](verification.md)。
