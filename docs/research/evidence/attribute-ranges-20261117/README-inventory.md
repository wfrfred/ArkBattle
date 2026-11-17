# AttributesData／AttributeType 完整库存

2026-11-17。完整读取当前客户端的 AttributeType、AttributesData 字段与 AttributeMeta，另读取构造器、属性字段读写及边界转换。未执行客户端或核实活跃 XLua。

## 覆盖与来源

- [inventory-native.json](inventory-native.json)：39个枚举值、34项数值声明、完整字段、构造器默认写入与原生正文。
- [inventory.json](inventory.json)：按编号组织的默认值／上下限／字段表示及限定消费说明，可从原件独立重建。
- DLL SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，version 29。
- 复用同指纹的2026-11-14属性声明解码器；旧 numeric-parameters 缺完整指纹，不以旧批次路径证明版本。

## 默认值和默认范围

默认值是普通 `new AttributesData()` 的值，不是所有角色／敌人在资料缺失时的统一补值。34项可修正属性中，32项有显式构造器写入；ATK／DEF 保持 CLR 零初始化，ObscuredInt.InternalDecrypt 的未初始化分支明确返回0。构造器同时写入非 AttributeType 的 blockVolume=-1。

`FP.MinValue`／`FP.MaxValue` 表示缺省固定点表示边界。AttributeMeta 构造器里的 float.MinValue／MaxValue 不是缺省运行范围的直接来源：`GetRangeAsTVector2` 根据 m_hasMin／m_hasMax 决定读取声明数值还是 FP 静态边界。表内小数按语义显示；原件保留 float32 精度。

| ID | 属性／字段 | 默认值 | 下限 | 上限 | Data 字段 |
| ---: | --- | ---: | --- | --- | --- |
| 0 | `MAX_HP`／`maxHp` | 100 | 1 | FP.MaxValue | Int |
| 1 | `ATK`／`atk` | 0 | 0 | FP.MaxValue | Int |
| 2 | `DEF`／`def` | 0 | 0 | FP.MaxValue | Int |
| 3 | `MAGIC_RESISTANCE`／`magicResistance` | 0 | 0 | 100 | Float |
| 4 | `COST`／`cost` | 1 | 0 | FP.MaxValue | Int |
| 5 | `BLOCK_CNT`／`blockCnt` | 1 | 0 | FP.MaxValue | Int |
| 6 | `MOVE_SPEED`／`moveSpeed` | 1 | 0.1 | FP.MaxValue | Float |
| 7 | `ATTACK_SPEED`／`attackSpeed` | 100 | 20 | FP.MaxValue | Float |
| 8 | `BASE_ATTACK_TIME`／`baseAttackTime` | 1 | 0 | FP.MaxValue | Float |
| 13 | `HP_RECOVERY_PER_SEC`／`hpRecoveryPerSec` | 0 | 0 | FP.MaxValue | Float |
| 14 | `SP_RECOVERY_PER_SEC`／`spRecoveryPerSec` | 1 | 0 | FP.MaxValue | Float |
| 15 | `ABILITY_RANGE_FORWARD_EXTEND`／`abilityRangeForwardExtend` | 0 | FP.MinValue | FP.MaxValue | Float |
| 16 | `MAX_DEPLOY_COUNT`／`maxDeployCount` | 1 | 0 | FP.MaxValue | Int |
| 17 | `DEF_PENETRATE`／`defPenetrate` | 0 | 0 | 1 | Float |
| 18 | `MAGIC_RESIST_PENETRATE`／`magicResistPenetrate` | 0 | 0 | 1 | Float |
| 19 | `HP_RECOVERY_PER_SEC_BY_MAX_HP_RATIO`／`hpRecoveryPerSecByMaxHpRatio` | 0 | 0 | 1 | Float |
| 20 | `TAUNT_LEVEL`／`tauntLevel` | 0 | -2 | 2 | Int |
| 21 | `RESPAWN_TIME`／`respawnTime` | 60 | 0 | FP.MaxValue | Int |
| 22 | `MAX_DECK_STACK_CNT`／`maxDeckStackCnt` | 0 | 0 | FP.MaxValue | Int |
| 23 | `MASS_LEVEL`／`massLevel` | 0 | FP.MinValue | FP.MaxValue | Int |
| 24 | `BASE_FORCE_LEVEL`／`baseForceLevel` | 0 | FP.MinValue | FP.MaxValue | Int |
| 25 | `DEF_PENETRATE_FIXED`／`defPenetrateFixed` | 0 | 0 | FP.MaxValue | Float |
| 26 | `ONE_MINUS_STATUS_RESISTANCE`／`oneMinusStatusResistance` | 1 | 0.001 | 1000 | Float |
| 27 | `MAGIC_RESIST_PENETRATE_FIXED`／`magicResistPenetrateFixed` | 0 | 0 | FP.MaxValue | Float |
| 28 | `MAX_EP`／`maxEp` | 1000 | 0 | 1000 | Int |
| 29 | `EP_RECOVERY_PER_SEC`／`epRecoveryPerSec` | 0 | 0 | FP.MaxValue | Float |
| 30 | `SP_RECOVER_RATIO`／`spRecoverRatio` | 1 | 0 | FP.MaxValue | Float |
| 31 | `EP_DAMAGE_RESISTANCE`／`epDamageResistance` | 0 | 0 | 100 | Float |
| 32 | `EP_RESISTANCE`／`epResistance` | 0 | 0 | 100 | Float |
| 33 | `DAMAGE_HITRATE_PHYSICAL`／`damageHitratePhysical` | 1 | 0 | 1 | Float |
| 34 | `DAMAGE_HITRATE_MAGICAL`／`damageHitrateMagical` | 1 | 0 | 1 | Float |
| 35 | `EP_BREAK_RECOVER_SPEED`／`epBreakRecoverSpeed` | 1 | 0 | FP.MaxValue | Float |
| 36 | `SLOW_DOWN`／`slowDown` | 1 | 0 | 1 | Float |
| 37 | `BLOCK_RADIUS_SCALE`／`blockRadiusScale` | 1 | 0 | FP.MaxValue | Float |

编号9–12是 RESERVED_0–3，没有对应的 AttributeMeta；38是 E_NUM计数标记。另有 blockVolume 和11项异常免疫布尔字段：它们不属于34项 AttributeType。异常免疫字段默认false，具体名称见库存。

## 取整与消费者边界

- `AttributesData.WriteAttributesField` 对 Int 字段先取偶舍入，再写 ObscuredInt；Float 字段保留浮点。FP 重载先转浮点，再委托该入口。取整 helper 原件复用[同指纹数值批次](../unit-audit-20261110/coordinates-numeric/native.json)。
- 这不代表运行属性按 Data 字段类型取整。`Attributes.GetValue` 返回 FP，普通归并与当前范围 Clamp 不取整；显式 `GetValueRoundToInt` 才取偶舍入，见[本批求值记录](README-native.md)。具体 getter 的整数转换不能从字段名推导。
- ATTACK_SPEED 的 AttributeMeta 下限是20、未声明上限；普通攻击周期公式的输入限制另为10–600。600不是属性上限，公式下限10也不是属性默认下限。新常量证据见[本批求值记录](README-native.md)。
- 此库存完整覆盖声明与构造器默认值，没有穷举全部消费者的附加限制／量化、所有内容覆写或特殊玩法。已核消费者限制在案例39集中解释。

## 复跑

在仓库根目录执行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/attribute-ranges-20261117/extract_inventory.py --out /tmp/attribute-inventory-native.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/attribute-ranges-20261117/extract_inventory.py --summarize /tmp/attribute-inventory-native.json --out /tmp/attribute-inventory.json
```

先核对客户端指纹；方法／字段／常量地址由本次输入定位。构造器默认值解码仅支持本批已验证的参数与结构复制模式，遇到未知值报错，不作为通用原生模拟器。
