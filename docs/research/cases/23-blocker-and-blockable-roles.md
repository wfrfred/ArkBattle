# Blocker、Blockable 与阵营的关系

研究日期：2026-10-31。问题是原生是否存在同时阻挡别人、又能被别人阻挡的单位，以及阻挡者是否必须属于 ALLY。本案只调查事实，不修改项目能力组合或阵营规则。

## 结论

- **普通角色／敌人的类型职责明确不同。** 已有原生 `_CheckBlockable` 证据要求被挡对象可转换为 `Enemy`；普通 `Character` 不是该入口的被挡对象。Character 默认可以搜索阻挡，普通 Enemy 是否作为阻挡者则受独立字段控制。
- **原生 Enemy 预留了双重角色路径，但本轮没有找到实际启用的初始配置。** 对本机 38 个 `enm_pfb_*.ab` 的扫描，覆盖携带 `_specificBlockMask` 字段的 2,173 个控制器、20 种序列化类型，字段全部为 0。每个对象按自身完整 type tree 解码并核对消费长度，包含派生控制器，未用固定尾部偏移猜字段。
- **上述结果支持“当前所查普通内容不需要双重角色”的判断，不证明全游戏永久互斥。** Runtime 写入、Lua hotfix、其他资源路径中的实例与模式初始化覆盖不在此次扫描范围内。不能只凭基类有接口，就把双重角色称为真实内容需求。
- **“Blocker 必须是 ALLY”没有得到证明。** 原生搜索检查阻挡者的 `blockSideMask` 与目标阵营，现有检查不以阻挡者自身 `sideType == ALLY` 为前提。角色类／敌人类是实现分类，ALLY／ENEMY 是阵营，不能相互代替。

## PRTS 核对

2026-10-31 查阅 [作战机制](https://prts.wiki/w/作战机制) 的索敌与阻挡说明，常规描述确实以干员等单位阻挡敌人为主，未取得同时具有双重角色的明确实例。

[阵地屏障](https://prts.wiki/w/阵地屏障) 的搜索结果资料列出敌方阵营、阻挡数 1 和反弹足球；[阵地足球锦标](https://prts.wiki/w/阵地足球锦标) 描述双方球门的屏障。正文直读多次超时，且反弹足球、阻断路线或具有阻挡数属性都不能单独证明它建立普通 Blocking 关系。本案不把屏障当作已经闭合的非 ALLY 阻挡者反例。

## 客户端证据

本轮 [资源扫描与方法定位](../evidence/blocker-roles-20261031/README.md) 保存 bundle 指纹、工具指纹和复现命令。DLL／metadata 与旧阻挡调查指纹相同，可以复用以下原始指令：

| 证据 | 直接说明 |
| --- | --- |
| [模式与资格调查](../evidence/blocking-native-20261023/modes/report.txt)，`_CheckBlockable` 77194 | 被挡候选必须是 Enemy；按 source 的定向掩码筛选候选，没有要求 source 自身为 ALLY。 |
| 同批 `Character.get_canBlockEnemies` 75885 与 `get_blockSideMask` 75886 | 普通 native 分支分别返回 true 与 ENEMY 掩码。 |
| 同批 `Enemy.get_canBlockEnemies` 76559 与 `get_blockSideMask` 76560 | 普通 native 分支分别判断 `_specificBlockMask > 0`、返回该字段。 |
| [Enemy 普通 Tick](../evidence/blocking-timing-native-20261023/order/report.txt) | canBlockEnemies 为真时推进自己的 BlockManager 并搜索被挡者。接口并非只有空声明。 |
| 本轮全 metadata 搜索 `get_canBlockEnemies` | 仅定位到 Character、Enemy 两个具体 getter，以及 IBlocker 接口；没有找到其他同名 getter 实现。这里只检查方法名，不等同于穷尽 Lua／接口映射变化。 |
| 本轮 `controllers.json` | 38 个 bundle、2,173 个控制器、20 种序列化类型的初始 `_specificBlockMask` 均为 0。 |

因此必须区分：原生具备表达和执行路径，与具体内容确实启用该路径。旧报告中“特殊敌人阻挡能力可以配置其他掩码”描述的是实现能力，不是已经举证的实际内容实例。

## 项目关联与未决项

不应以尚未举证的双重身份作为保留额外处理复杂度的理由；相应压力测试只能证明项目允许这种组合，不能证明原生存在它。是否正式限制两种 Capability 互斥仍属于项目设计决定，本案不新增断言。

也不应把本次扫描结论扩张为 Blocking 必须硬编码 ALLY。当前定向阵营 Rule 的依据与角色能否双重组合是两个问题，前者不因本次未发现双重实例而失效。

若未来实际内容需要双重身份，应补核其资源绑定、运行时掩码来源、双方资格及是否同时建立两种关系；当前没有这样的已闭合案例。

## 补查：阻挡者是否会自主移动

2026-10-31 补查。问题限定为：是否有实际内容在作战期间执行自主路线移动，同时作为普通 Blocking 的阻挡者；这种移动是否需要统一的关系维护入口。项目尚未接入的 Content 组合不作为原生需求证据。

**本轮没有取得自主移动且建立普通阻挡关系的具体内容证据。普通角色的固定站位、角色的特殊移位、布阵调整，以及敌人类的自主移动必须分别判断；不能因为存在位置或移速字段、我方移动对象，或 Enemy 的可选 IBlocker 接口，就推导出移动阻挡者的实际需求。**

### PRTS 机制与内容核对

以下页面于 2026-10-31 查阅，属于社区机制资料，不标为官方文档：

| 资料 | 说明与适用边界 |
| --- | --- |
| [游戏数据基础·移速](https://prts.wiki/w/游戏数据基础#移速) | 说明普通我方干员、装置、召唤物虽有默认移速属性，却不执行自主移动。该说明不等于所有我方阵营的对象都属于角色类。 |
| [术语释义·杂项机制](https://prts.wiki/w/术语释义#杂项机制)、[Mon3tr·策略：熔毁](https://prts.wiki/w/Mon3tr#技能)、[乌尔比安·技能](https://prts.wiki/w/乌尔比安#技能) | 此处术语“移动”是特殊的撤退与再部署：检查目标部署条件，离开原位置后在新位置部署。它不能证明角色会沿路线行走并保留原阻挡组。技能有各自的状态继承例外，不能由通用术语推断全部技能细节。 |
| [卫戍协议·战斗部署与流程](https://prts.wiki/w/卫戍协议/帮助#战斗部署) | 站位调整发生于布阵／休整；作战开始再按指定位置部署，之后禁止玩家干预。页面将初始站位描述为一般固定，不能将布阵拖动等同于战斗中的路线积分。 |
| [“炎佑”](https://prts.wiki/w/“炎佑”)及[盟约记录](https://prts.wiki/w/卫戍协议：盟约/PRTS盟约记录) | 是可以自主行动的敌人类我方飞行单位，说明“我方”不等于固定角色类；本轮没有取得它建立普通阻挡关系的证据，不能拿来充当移动 Blocker。 |
| [萨卡兹骸骨卫士长](https://prts.wiki/w/萨卡兹骸骨卫士长) | 其阻止反巫术变位炸弹移动的具体机制是范围内提供束缚；文本中的阻止移动不能直接当作普通 Blocking 关系。 |

### 原生调用链与关系维护

- **N：Character 的特殊移位结束旧对象后重新生成。** [本轮原生证据](../evidence/blocker-roles-20261031/movement/README.md)确认 `MoveLikeRespawnSelf` 与 `MoveLikeRespawnExternal` 分别在 `0x180a2c347`、`0x180a2bfe7` 调用虚 slot 117；metadata 确认该槽是 `Character.FinishMe`。随后 `_MoveLikeRespawn` 在 `0x180a3698d` 调用 `Deck.SpawnCharacterOrToken`。这与 PRTS 特殊撤退／再部署的解释相互支持；已有 `Character.OnFinish` 清场证据位于 `0x180a2dbd1`，不能将这条路径当作保留原对象阻挡组的普通行走。
- **N：本轮默认 Character 状态机没有 Enemy 的 MoveState。** 同批保留默认状态机构造及 124 个 `Character/States` 方法供核查；这只描述已读取的普通类型，不扩张为所有技能、派生类型或热更都不可能改变位置。
- **N：Enemy 的可选阻挡能力不等于边走边阻挡。** 已有 [MoveState.OnTick 指令](../evidence/blocking-timing-native-20261023/order/76658.asm)在 `0x180a97950` 检查自身 blocker；随后 `0x180a979a5` 调用 `TryGetCombatTargetBlockee`，存在自己阻挡的战斗目标时同样跳向 `0x180a97c19` 的战斗状态切换，跳过后续普通路线移动。这是普通状态机路径，不覆盖强制位移或全部内容覆盖。
- **N／I：普通关系不按当前距离逐 Tick 重建。** [旧关系与容量调查](../evidence/blocking-native-20261023/retention/report.txt)已闭合 Character／Enemy 的普通 Tick、BlockManager.Tick 和搜索链；接敌距离用于新关系取得，现有链不能支持“每次坐标变化都必须统一维护整组关系”的说法。
- **N：容量和体积有各自的明确结算入口。** 同批 `Character.OnAttributeDirty` 在阻挡数变化时同步调用 `UpdateBlockees`；`Enemy.OnBlockVolumeChanged` 重算当前 owner 的总 volume 后调用 `UpdateBlockees`。这能证明对应数值变化需要结算，不能证明所有角色都应经过一个接收任意 Unit 的维护函数。

### 本轮结论的边界

本轮检索了普通角色移动说明、实际角色移位技能、卫戍协议站位／自主行动例外，以及 Enemy 的可选阻挡与普通状态机。没有穷尽运行时掩码修改、XLua 或全部未来内容，因此不宣称全游戏不存在移动阻挡者。

当前证据不足以用“Blocker 可能移动”解释 `maintain(Ref<Unit>)` 的必要性；同样不能用项目尚未接入某种 Capability 组合来证明它不需要支持。统一维护入口的职责和作用范围仍是工程设计问题，本次调查不决定接口、不修改实现。
