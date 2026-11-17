# 召唤、装置与阵营的定向复核

2026-11-18。核对分类资料、创建路径和阵营之间的关系，不决定 ArkBattle 类型或接口。Windows 客户端 DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`、v29。仅静态普通分支，未运行客户端或验证 XLua。

## 证据

- `side-getters.json`：新提 Character／Token 的初始化阵营 getter、Token 敌方判断、Entity.Init 两个重载及相关字段。共享提取器、方法索引、完整片段、来源和脚本指纹保存在原件。
- `bobject-init.json`：新提 BObject.Init、实例字段，直接确认最终 side／playerSide 分开写入。
- `select_evidence.py`、`selected-evidence.json`：从既有原件定向摘录五个组件、一个可见关卡预置、两套阵营枚举及部署实参片段，并从固定角色表核对三个对象的中文名称与职业；各源文件 SHA-256、原始 Pointer／PathID 和源资源指纹仍可追溯。不重新整包复制已归档资源。

## 已核事实

1. **我方召唤物可以采用 Enemy 资料与控制器。** 卫戍莱塔尼亚两个召唤物 `enemy_9025_aclts`／`enemy_9026_acltm` 的实际 MonoScript 为 Enemy，Prefab `_sideTypeIndex=0`。此字段是 `SideTypeIndex`，0 对应 ALLY；不同于 `SideType.ALLY=1`。实际召唤节点为 SummonEnemyWithRuntimeRoute，完整安装链和行为见 [Case32](../../../cases/32-leithanien-summons-blocking-and-movement.md)。Enemy.Init 的既有原件先调用虚槽222的 sideTypeIndex，再经 IndexConvertToBinaryMask 得到 side；这个 side 传入 Entity.Init。不能把 Enemy 控制器、召唤来源和敌方阵营当成同一事实。

2. **Token／Trap 的初始化阵营取自其 Prefab，普通 Character 默认我方。** Token 的 `_sideType` 字段明确为 `Torappu.Battle.SideType`，偏移 `0x550`。Token.get_initSideType #78756 的普通分支在 `0x180b04eec` 直接读该字段；get_isEnemySideToken #78754 在 `0x180b04f4b` 比较其是否为2。Character.get_initSideType #77126 的普通分支在 `0x180ab0844` 返回1。这里没有从召唤者推导 side，也不证明所有特殊创建入口都使用这一默认值。

3. **部署路径确实消费上述策略。** 既有 Character.BuildAt #77239 在 `0x180a9d537–54f` 经虚槽212取得 initSideType，写入 BuildParam.sideType；该值类型为 SideType、unboxed 偏移 `0x18`。_BuildAtInternal #77293 在 `0x180aaaf4c` 读取含该字段的结构片段，`0x180aaafc8–cd` 取出 side，`0x180aaafd8` 传入 Entity.Init #67624。该方法在 `0x180726e0b` 继续调用 BObject.Init #66009；后者在 `0x1806afb51` 写 side 到 `+0x1c`，在 `0x1806afb5c` 写 playerSide 到 `+0x20`。TokenCard 创建、BuildAt 入口和 Card 身份仍复用 [TokenCard 原件](../../device-source-20261111/spawn/README.md)，不重复声称全部运行时召唤都经 Card。

4. **敌方 Trap 与带战斗标签的 Trap 都有实际对象。** `trap_317_ubprison` 的组件 `_sideType=2`、`_category=1`；其 MonoScript PPtr 与同安装包中已解析的 Trap 绑定相同。它是[禁闭所实际索敌消费者](../../../cases/28-damage-hooks-and-event-granularity.md#6-目标前置与来源输出能否交换)对应的敌方装置，不能从 TRAP 职业或 character_table 来源推出我方。`trap_042_tidectrl` 的实际 MonoScript 为 Trap，`_sideType=1`、`_category=2`，并有非空 `_filterTag=["redman_exclude","storm"]`；act2autochess m04 的 `/predefines/tokenInsts/4` 可见预置了它、选用第三技能。故 FilterTag 也不是 Enemy 资料独有；本例未进一步穷举这两个标签的所有消费者。另保存 `trap_098_mire` 的空标签作为对照。排除模式的 SANDBOX_FACTORY 对象未作为项目需求正例。

上述结论不证明阵营在所有生命周期阶段不变，也未穷举敌方 Token、普通 Token 的所有召唤路径或动态角色数据替换。留声机控制权变化不在此处当作 side 变化证据。

## 复跑

从仓库根目录运行，原生输出改至独立缓存目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/classification-composition-replay/side-getters.json --body-index 77126 --body-index 78756 --body-index 78754 --body Torappu.Battle.Entity.Init --owner Torappu.Battle.Token --owner Torappu.Battle.Character/BuildParam --owner Torappu.Battle.SideType --owner Torappu.Battle.SideTypeIndex
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/classification-composition-replay/bobject-init.json --body Torappu.Battle.BObject.Init --owner Torappu.Battle.BObject
python3 docs/research/evidence/unit-classification-composition-20261118/native/select_evidence.py --out .cache/native-research/classification-composition-replay/selected-evidence.json
```

索引只适用于上述同指纹客户端。摘录脚本只读取已归档的精确源文件；结果记录源文件指纹，不把镜像、安装包与热更新包说成同一版本。
