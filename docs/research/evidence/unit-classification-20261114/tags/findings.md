# 标签与分类查询的原生事实

## 1. 至少四套不同资料，不能统称“种族”

| 资料 | 保存位置 | 已证实消费者 |
| --- | --- | --- |
| 敌人战斗标签 `enemyTags: string[]` | `LevelData.EnemyData`，偏移 `0x38` | `Enemy.CheckHasFilterTag`；泥岩第二天赋查 `sarkaz` |
| 陷阱筛选标签 `_filterTag: string[]` | `Trap` Prefab，偏移 `0x590` | `Trap.CheckHasFilterTag` |
| 角色组织标签 | `BattleCharacterData.nationId/groupId/teamId/subPower`，另有 `runtimeData.extraGroupTags` | `CheckGroupTag`、组标签 Selector/Rule/Action |
| 攻击方式 `SourceApplyWay` | 敌人资料 `applyWay`；普通 Unit 的当前 Mode `allApplyWay` | 守林人 `AtkScaleUp`；其他检查也可能明确查 EnemyDB |

`CharacterData.tagList` 是另一份静态字段，不能仅因带 tag 名称就认定进入上述战斗查询。职业、实体类别、阵营、精英/Boss、空地身份也各有独立字段和消费者，不由这几套标签相互推导。

**C# 普通分支中 `Character.CheckHasFilterTag` 直接返回 false。** `Enemy` 实现检查其 `enemyTags`；`Trap` 实现检查 Prefab 的 `_filterTag`。因此，同一个 Entity 虚查询并不表示它们拥有同一份标签资料，也不表示角色档案的萨卡兹种族会自动满足泥岩的敌人标签检查。各方法均存在 XLua 替换出口；这里没有把可替换出口当成正在使用的内容。

证据：`tag-bodies.json` #77296、#77646、#77737、#78846；`field-owners.json`；同批配置资料。

## 2. 敌人标签从资料折叠进入实例

已证调用链：

```text
EnemyDB.TryGet
  → EnemyDatabase.GetComputedEnemyData
      → 取得该 Enemy 的等级记录
      → 构造 LevelData.EnemyData
      → 按指定等级依次 ApplyDefinedData
          → _ApplyUndefinableData
  → Enemy.Init
      → _AssignData
          → 保存 Enemy.data
  → Enemy.get_enemyTags
      → 返回 Enemy.data.enemyTags
```

`GetComputedEnemyData` 的非负等级分支遍历等级记录，超过指定等级便停止；负等级有单独的首项分支。`ApplyDefinedData` 先调用 `_ApplyUndefinableData`，再处理属性、黑板、技能等。`_ApplyUndefinableData` 使用字段反射，检测输入包装字段并通过 `FieldInfo.SetValue` 写入对应输出字段；不是遍历敌人后追加一条标签的业务。

`Enemy._AssignData` 在 `0x180ac583c` 写入实例 `data`（`Enemy + 0x530`）。`get_enemyTags` 在 `0x180acb767` 调用 `get_data`，再读取 `data + 0x38`，没有复制到一个独立可增删的 Enemy 标签容器。

本批配置有逐级显式字段正例：`enemy_1570_ymgscm` 的 level 1 显式提供空数组，但 level 0 也为空数组，**这不是标签值实际变化的正例**。本次没有找到非默认等级改变标签值的配置。输入中存在空数组、null、未定义包装；它们的覆盖语义必须结合原生包装的有效性检查确认，不能单凭 JSON 形状断言不同的战斗结果。具体记录见 `config/static-inputs.json`。

证据：`source-construction.json` #28322/#28323；`database-folding.json` #31938/#31942/#31943；`tag-lifecycle-consumers.json` #77782/#77835；`tag-bodies.json` #77646。

## 3. 已核实的运行时变化范围

| 操作 | 这次直接确认的行为 |
| --- | --- |
| 普通 Enemy 初始化 | 接收并保存折叠好的 EnemyData，标签查询读该数据 |
| `Enemy.OnSwitchMode` | 本体处理模式和 EnemySkill 的挂接，不替换 Enemy.data |
| `Enemy.OnReborn` | 本体处理复活状态，不替换 Enemy.data |
| Character 组织标签预处理 | `CGroupTagAdd.DoPreprocessChar` 可向 `data.runtimeData.extraGroupTags` 添加字符串；同值已存在则不添加 |

全量 Torappu.Battle 方法/字段名称定位没有找到独立的 `AddEnemyTag`／`RemoveEnemyTag` 一类入口。结合 getter 与上述方法体，可以确认**本次已核普通初始化、模式切换及复活本体没有建立一套动态敌人标签登记机制**。这不足以证明所有内容程序、任意资料替换或 XLua 均无法修改标签；也不把“没有命中方法名”当成全局不可变证明。

`extraGroupTags` 的 Add 是正面代码证据，但不是已在场 Character 战中添加标签的正例。已核调用者是：

- `BattleController._PreprocessPredefinedCharacter` #65762：创建 Character/Token，调用 `MakeDummy`，再执行 RuneManager.PreprocessCharacter，最后回收临时对象。
- `Deck.Card.<UpdateDeckAttributeData>b__166_0` #66919：在 Dummy 与卡牌属性资料处理期间执行该预处理。
- `Deck.Card._PreprocessRunes` #66912：将传入 Character 交给同一个 RuneManager 入口；这个包装本体没有提供“可对任意已在场单位动态增删”的证据。

因此这里记录的是**构造/卡牌资料预处理路径中对 Character 数据的增补**，不因 `RuntimeData` 命名推断战中增删。本次配置代理定向搜索的已存 JSON 没有找到启用正例；不能因此宣称敌人 `enemyTags` 可任意增删，也不能宣称这项 Rune 从未使用。

证据：`tag-lifecycle-consumers.json` #77793/#77787/#87279；`group-tag-timing.json` #65762/#66919/#66912/#87029/#87223；`metadata-inventory.json`；`field-owners.json`。

#65762 的线性解码停止发生在尾部 switch 数据，而非这里使用的调用链：`0x18066c158/161` 经表 `0x18066c568` 跳向 `0x18066c16e/17a`；`0x18066c408/411` 经表 `0x18066c58c` 跳向 `0x18066c44a/41e/434`。两表各有 27 项字节映射，数据范围分别为 `[0x18066c568, 0x18066c58b)`、`[0x18066c58c, 0x18066c5b3)`。Create→Dummy→Preprocess→Recycle 的已引调用全部位于此前完整解码片段。原始字节及表引用见 `group-tag-switch-tables.json`；不把表数据的伪指令视作业务代码。

## 4. 泥岩：真实消费的是伤害来源的敌人标签

```text
char_311_mudrok/Talents/2
  PassiveBuffAbility
    buffKey = mudrok_t_2
    templateKey = filtertag[reduce_damage]
    blackboard.tag = sarkaz
      → 模板原生事件 10
          CheckFilterTag(MODIFIER_SOURCE, bbKey=tag)
          DamageScale
```

`CheckFilterTag.Execute` #101605 先按 `_targetType` 取得被检查实体，从 Blackboard 解析非空 tag，再调用 Entity 的 `CheckHasFilterTag` 虚槽。Enemy 分支最终对 `enemyTags` 做字符串成员检查。

这是一个已经闭合的“具体天赋配置 → 实际模板 → 原生执行节点 → 标签存储”案例，不是根据档案种族猜测。它也说明检查对象可以是伤害来源，并不只用于选取伤害目标。

资源指纹及精确 PPtr：`config/prefabs.json`，`char_311_mudrok/Talents/2` 的 PassiveBuffAbility path ID `-793291194028568400`；模板 `config/templates.json` 的 `filtertag[reduce_damage]`。执行体：`tag-lifecycle-consumers.json` #101605；标签分支见第 1 节。

## 5. 守林人：攻击方式标签并非本次伤害的攻击方式

```text
char_158_milu/Talents/1
  PassiveBuffAbility → milu_t_1
    → 模板原生事件 14
        AtkScaleUp(
          filterApplyWay=true,
          applyWay=RANGED,
          filterNoneApplyWay=false
        )
```

`AtkScaleUp.Execute` #99202 在过滤分支中读取当前公式上下文中的目标（`context + 0x8`），通过 Entity 虚槽 **51 / `0x33`** 查询 `allApplyWay`，以位掩码包含关系判断，之后合并/覆盖 `atkScale`。这里读取的是目标分类，没有读取这笔 Modifier 的 `applyWay`。

- Enemy 的 slot 51 实现 #77593 返回 `Enemy.data.applyWay`。
- Unit 的 slot 51 实现 #78894 返回 `currentMode.allApplyWay`；没有当前 Mode 时返回 0。正文 `0x180b1f677`、`0x180b1f6a2` 读取 `Unit + 0x200`，同批字段元数据将其明确为 `m_currentMode`。它不是当前输出动作的 `Ability.applyWay`。
- `_filterNoneApplyWay=true` 是另一个明确分支：要求查询结果为 0，并非额外赋予一个非零“NONE 标签”。

另一个节点 **`CheckEnemyApplyWay.Execute` #102473 采用不同来源**：先要求目标为 Enemy，再用目标 id 及等级参数 **0** 调用 EnemyDB.TryGet，读取查表结果的 `applyWay`。因此不能仅凭方法都提到 applyWay，便把它们统一描述成“读取当前攻击方式”。本次没有替该节点声称一个尚未定位的具体内容绑定。

资源：`config/prefabs.json` path ID `963236196431464861`、`config/templates.json` 的 `milu_t_1`。方法：`formula-tag-consumers.json` #99202/#102473，`tag-lifecycle-consumers.json` #77593/#78894；slot 元数据在 `metadata-inventory.json`。

## 6. Character GroupTag 的精确范围

源转换已经核对：`CharacterData.mainPower` 是 `PowerData` 值类型，字段顺序为 `nationId/groupId/teamId`。`BattleDataConverter._ConvertInternal` #79236 在 `0x180b0be5a`、`0x180b0be7f`、`0x180b0bea4` 从输入 `+0x68/+0x70/+0x78` 复制到输出 `BattleCharacterData +0x140/+0x148/+0x150`；这是展开 `mainPower` 的三个字段。输入 `subPower` 数组（`+0x80`）另复制到输出 `+0x158`。不能把旧表的三个 legacy 字段与当前 `mainPower` 直接视为两套同时生效的组织资料。

`CheckGroupTagExceptExtraTag` #79466 对 `nationId`、`groupId`、`teamId` 及 `subPower` 各项中的对应组织标识逐项比较。`CheckGroupTag` #79464/#79465 在此基础上加入 `runtimeData.extraGroupTags.Contains(tag)`。数组重载对各个请求 tag 做 OR。

`AdvancedSelectorWithGroupTag.OnPostFilter` #75600 明确先取得 Character，再读取其 BattleCharacterData.CheckGroupTag。它没有通过 Enemy.CheckHasFilterTag 去解释 `sarkaz`、`drone` 等敌人标签。组织、职业与敌人种类在这条查询中仍然是不同机制。

转换体复用同客户端指纹的 [原始汇编](../../card-source-identity-20261111/allocation/native/_ConvertInternal-79236.asm)，当前字段元数据见同批 `identity` 的 CharacterData 记录及本目录 `metadata-structs.json` 的 `PowerData` 顺序；查询体见 `tag-bodies.json` #79464/#79465/#79466。

## 未证实的范围

- 本次没有取得一条支持玩法中对同一个 Enemy 实例动态增加/移除 `enemyTags` 的实际调用链；也没有取得 Rune 增加 GroupTag 的实际关卡配置正例。
- 没有证明所有“变身”都沿用同一实例及同一 EnemyData。具体内容若创建另一实体或替换资料，须按其创建/赋值链判断，不能由 `OnSwitchMode` 的结论推广。
- 旧资料、当前镜像、当前客户端的版本分别记录；不以本机包中的代码支持证明某个镜像配置已在同一客户端实战运行。
