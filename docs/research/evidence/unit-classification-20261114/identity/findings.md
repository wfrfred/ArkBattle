# 实体分类与职业：核实结果

本批只记录原生事实和静态调用链，不决定 ArkBattle 类型或 API。客户端指纹见 `native.json.provenance`；全部 native 结论限于该版本的 fallback，没有运行完整客户端或验证活跃 XLua。

## 不能合并的分类轴

| 轴 | 实际含义与消费者 | 证据 |
| --- | --- | --- |
| 托管类 | `Trap → Token → Character → Unit → Entity → BObject`；`Enemy → Unit`。类检查允许继承，不是互斥标签。 | `native.json.result.types` 的 parentName；复用 Case 24 的同指纹类链。 |
| `EntityCategory` | `DEFAULT=1`、`TRAP_OR_ITEM=2`、`OBSTACLE=4`；TargetOptions 的 targetCategory 对当前 category 做筛选。Unit 默认 getter 返回 DEFAULT；Token 可以用运行值覆盖 Prefab 的 `_category`。 | `native.json`：枚举、Token 字段；78927、78757、76369。 |
| `UnitTypeMask` | `CHARACTER=1`、`ENEMY=2`、`TOKEN=4`。`CheckEntityUnitType` 对应执行 Character／Enemy／Token 的类测试，按 OR 合并；`ALL=7` 直接允许。**Token 和 Trap 可以同时通过 CHARACTER 位与 TOKEN 位。** | 79594；`result.typeUsageSlots` 解出三个 TypeInfo，非按名称推断。 |
| `UnitType` | `CHARACTER=1`、`ENEMY=2`、`TOKEN=3` 是另一个普通枚举；不能把 TOKEN=3 直接当成上面的 TOKEN 位。 | `native.json.result.enums`。当前档案只核实值，未把它认定为所有实体的权威身份字段。 |
| 基础职业 | `BattleCharacterData.profession`，八职业及 TOKEN／TRAP。与 `subProfessionData` 独立；职业消费者可以另做 Character 类检查。 | CharacterData.profession +0xcc；BattleCharacterData.profession +0x70；下述转换链和76375。 |
| 附加职业 | `BattleCharacterData.shared.extraProfession` 是另一份职业位集；不会覆盖基础职业。目标检查是否纳入它由具体入口的 `checkExtraProfession` 决定。 | SharedData.extraProfession +0x34；84730、76369／76375、87516。 |
| Side／PlayerSide | 阵营与玩家归属另有字段、普通枚举及掩码。不能由 Character／Enemy 类或职业推导；我方莱塔尼亚召唤物本身仍为 Enemy 类。 | Case 32 及本批 root 的 BObject 档案；本文件枚举值只作辅助。 |

`AssignNearbyAllyCombatCountToBB.CharacterTypeMask` 又是局部枚举（CHARACTER=1、TOKEN=2、TRAP=4），不等于通用 UnitTypeMask。不能因字段或成员同名就复用数值。

## 来源、初始化和修改

基础职业来自角色静态资料的 profession，转换后保存在 CharacterData。`BattleDataConverter.ConvertToCharacterData`（79217）调用 `_ConvertInternal`（79236）；同指纹已归档的 `_ConvertInternal-79236.asm` 在 `0x180b0bc01 → 0x180b0bc07` 将 CharacterData.profession（+0xcc）复制到新 BattleCharacterData.profession（+0x70）。这里没有从阵营或 Prefab 类名推导职业。

复用位置：`../../card-source-identity-20261111/allocation/native/` 的 metadata.json、native.json、`_ConvertInternal-79236.asm`。本批 `native.json` 重新核对两端字段与客户端指纹。没有因已有取证而重复反编译该大方法。

附加职业已闭合一个支持玩法中的正例：迷迭香集成战略模组 `uniequip_003_rosmon` 的静态黑板含 `game_tag_meta: roguelike` 和 `extra_profession: caster`。原始 JSON 指针与固定输入哈希见 `../config/static-inputs.json` 的 `/result/equipmentExamples/21/candidate/blackboard`、`/result/equipmentExamples/26/candidate/blackboard`。

调用链是：

```
RoguelikeGameMode.PreprocessPlayerData（84729）
  → 检查 UniEquip 黑板及 game_tag_meta
  → _ProcessExtraProfession（84730）
      → Blackboard.TryGetString("extra_profession")
      → 按 ProfessionCategory 解析字符串
      → shared.extraProfession |= 解析结果
```

`0x180cf955f` 是 OR 写入；原始键字面量已从静态 metadata usage 解码保留在 `result.stringLiterals`。这是战斗数据预处理路径，不是施加一份运行期 Buff 改写基础职业。全 metadata 的方法名／字段清单没有定位到独立的通用“移除附加职业”入口；不据此断言任意外部脚本都不能修改公开字段。

Category 存在独立运行期变更：Token.SwitchCategory（78792）只写 `m_category`；Token.get_category（78757）在覆盖值非零时返回它，否则返回序列化 `_category`。RallyPoint.SwitchCategory（78633）及 `SwitchTokenCategory.Execute`（98858）的完整 native 体另外保留，用来区分值的写入与周边通知；本批没有把所有可执行内容中的调用穷举一遍。

## 查询政策与实际内容

`CheckProfessionMask(mask, category, true)` 的 fallback 是 `mask == 0 || (mask & category) == category`。TargetOptions 的 Character 路径先检查基础职业；不通过且 `checkExtraProfession` 为真时，再检查附加职业与 mask 是否有交集。它没有把两份位集永久合并。

非 Character 分支还有明确区别：当目标 `side == ALLY` 且 professionMask 非零时拒绝，否则可通过这一职业分支。因而“Enemy 没职业，所以职业限定总通过”不是对所有阵营组合都成立的完整规则（76375 的 `0x180a4115f–0x180a41170`）。这不代替此前其他资格检查。

冻河 S3「踽踽独行之春」是真实的两轴并用案例。已绑定的三个子 Selector 同时配置：

```
targetCategory = DEFAULT
checkUnitType = true
unitTypeMask = CHARACTER
needProfessionMask = true
professionMask = 639  // 八职业，排除 TOKEN 与 TRAP
```

精确 SerializedFile、PathID、MonoScript 身份、组件字节哈希和角色→技能→Prefab 绑定见 `content.json`。本批重新计算本机 `[uc]skills.ab` 与外部 MonoScript Bundle 哈希，和 Case 33 的输入相同后才复用记录。

这说明 CHARACTER 类筛选与“八职业单位”筛选不能合并：Token／Trap 的继承可通过前者，但 TOKEN／TRAP 职业不在后者的 mask 中。实际静态配置中，镜中虚影同时是 TOKEN 职业和 executor 分支，弩炮是 TRAP 职业；原始字段见 `../config/static-inputs.json`。这里根据完整 native 条件解释配置结果，没有声称实机执行测量。

## 尚未闭合的边界

- 没有穷举所有修改 category 的实际 Prefab 绑定；已核实接口和完整 fallback，不能由方法存在推出每个装置都会执行它。
- 没有证明基础职业或附加职业在任意 XLua／外部脚本下不可修改；当前正例确认的是预处理写入与选择时读取。
- 没有把 UnitType 普通枚举的所有消费者穷举为实体权威分类。已确认的索敌掩码消费者直接检查类。
- 以上不能推导 Character 等价于可部署、具有 Card、属于我方或八职业干员；也不能由玩家称谓“装置”推导实际类一定为 Trap。
