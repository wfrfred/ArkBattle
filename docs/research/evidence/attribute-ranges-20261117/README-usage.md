# 属性范围覆写：实际使用

检查日期：2026-11-17。这里只记录原生入口、模板与实际内容的关联，不决定 ArkBattle 的接口。

## 范围与证据

- [usage-native.json](usage-native.json)：完整元数据中范围写入相关方法名匹配及直接 `E8/E9` 调用候选，保留原体和调用指令。实际业务入口是 `Attributes.OverrideDataRange`、`ClearDataRangeOverride` 与 `ModifyAttributeDataRangeOverride.Execute`；节点另有构造器及 `allowedSource` getter。前两个入口的已确认直接调用都来自该节点。节点通过虚调用执行，不能因没有直接调用者而判定未使用。
- [usage-templates.json](usage-templates.json)：完整当前 BuffHolder 的 **9,054** 条模板，按已解码节点类型检查，找到 **9** 个含范围操作的模板；同时保存模板间的直接字面引用。
- [usage-prefabs.json](usage-prefabs.json)：针对相关内容解码 **15** 个资源包，包括全部 **7** 个 Token 包；保存 **17** 个字面命中组件及其根对象下相关 Battle 组件。包哈希、对象 PathID、MonoScript 和层级均在记录中。
- [usage-static.json](usage-static.json)：固定资料中的角色／技能／敌人记录，以及所选关卡镜像中真实关卡对象的精确 ID 引用。记录原文件哈希与 JSON Pointer；不是游戏实跑记录。

客户端 DLL、元数据、BuffHolder 和 Prefab 的版本指纹分别保存在输出的 `provenance` 中。静态表来自此前固定缓存，不能据此宣称它与当前客户端每项内容完全同版。

## 支持玩法中的实际绑定

模板序号对应 `usage-templates.json` 的 `templateIndex`；组件 PathID 对应 `usage-prefabs.json`。

| 内容与启用路径 | 属性和实际写入 | 触发／清除 |
| --- | --- | --- |
| Touch 的根 Talent `StatusResist` → `PassiveBuffAbility -7358736329593478483` → `enemy_etouch_move_speed[lock]`（1236） | `MOVE_SPEED` 下限取接收者**当前 raw 值**，不指定上限 | Buff 开始取 raw 并写范围；停止清范围。`act3break_h04` 的敌人覆写实际指向 `enemy_8018_etouch`；同模板另绑定 `enemy_8019_pollut_2` 的 `MoveSpeedImmune`，不据此推定所有变体均启用 |
| 娜斯提二技能 `skchr_nasti_2` 的 `overrideTokenKey` → `token_10060_nasti_nstchr` → `EnsureBlood` 被动 `-7334112765017729342` → `nasti_nstchr[blood_one]`（5945） | `MAX_HP` 上下限均读取 `init_max_hp` | Buff 开始写入，随后以 `abs(init_max_hp - init_hp)` 执行初始生命调整。本批已闭合技能选择、Token、被动和模板绑定，未额外证明这两个 BB 键的生产者；不能把它改写成“固定最大生命为1” |
| 喷泉水池 `trap_279_pirene` → Talent `Passive` 的被动 `5043634488850521995` → `trap_pirene_init`（4439） | 先把接收者有效 `MAX_HP` 按 `scale` 读入 `hp_origin`，再令上下限均为 `hp_origin` | Buff 开始程序在满血／未满血分支后执行共同范围写入；不以满血为写入前提。`act48side` **17** 关及 `level_camp_r_34` 实际预置该装置 |
| 源阶方模块 `trap_324_shmbmb` → Talent `Passvie` 的被动 `-1676584991371456630` → `trap_shmbmb[init]`（8450） | `AssignAttributeAsDynamicVarToBB(MAX_HP, scale)` 建立 `dynamic` BB 值；范围节点读取它，令 `MAX_HP` 两侧相等。技能 `sktok_shmbmb` 的 `scale=0.2` | Buff 开始写入。`rogue6_b-5`、`rogue6_b-5-b` 有实际预置；模板使用 `ROGUELIKE` 全局 BB 通道，不能误归为卫戍专属或生息排除 |
| 赤金条 `enemy_2142_shsggd` 的 `_commonAbilities` → 被动 `5615750353070489994` → `enemy_shsggd_passive`（8432） | `ATTACK_SPEED` 两侧均为 **100**；`BASE_ATTACK_TIME` 两侧均为 **0.1** | Buff 开始用常数写入。`rogue6_b-2` 及 `rogue6_b-2_dlc1` 的 `/enemyDbRefs/2/id` 和首条 Spawn 均实际引用；这是已启用的集成战略内容，不能仅按自然物描述排除 |
| 沉沦的探险者 `trap_345_shadvt`／`trap_349_shadvt2` 的 Default Mode `generalAbilities` → 被动 `-6695502143702215596`／`510424361691216947` → `trap_shadvt_passive_log_kill`（8458） | `default_value` 在程序中赋常数 **1**；`SP_RECOVERY_PER_SEC`、`SP_RECOVER_RATIO` 上下限均为 **1** | Buff 开始写入；另一段程序独立取消增加 SP 的 Modifier。`rogue6_s-1` 同时预置并激活这两个对象。`trap_344_shadvr`／`trap_348_shadvr2` 也实际绑定同模板，所选镜像各有25关引用 |
| 信仰搅拌机 X3 → `rmixer_equip_1_3_p2` Aura `-6484846798081607645` → `rmixer_e_002_t1`（6932） | `ATTACK_SPEED` 下限取目标当前 raw 值 | `rmixer_t1[full-mark]` checker 与 `laterano` validator 控制施加；开始写范围，停止清范围。完整模组选择、checker 与标签链复用[原批次](../resource-mechanisms-20261114/death-attributes/README.md)，本批重新核对 Aura 和模板 |

因此，实际使用不只涉及攻速下限：已找到普通内容／关卡配置的属性包括 **移动速度、最大生命、攻速、基础攻击间隔、每秒 SP 回复、SP 回复倍率**。这是本批所选内容的正例覆盖，不是对全游戏所有可达程序的穷尽证明。

## 已发现但不能等同于启用

- `move_speed_range_override`（3200）有真实 `GlobalBuff 3537909968237324081` 资源。模板仅保留 Enemy、首次生命 `curRespawnCnt=0`：若 `custom_override_move_speed=1`，下限取 `minValue_move_speed`；否则取当前 raw 移速，停止时清范围。所选完整关卡镜像未找到该字面 key 的启用配置，因此只列为**资源已绑定，实际启用入口未闭合**，不当作新的玩法正例，也不声称全游戏不用它。
- `sandbox_v3_lock_maxhp`（8845）绑定 `trap_544_xb2fmr`、`545_xb2fmf`、`546_xb2fmr2`、`547_xb2fmf2`。事件24读取有效最大生命并只写上限，事件25清范围。属于明确排除的生息演算内容；不作为本次 Core 需求依据。

## “动态范围”的含义

`ModifyAttributeDataRangeOverride.Execute` 在执行时分别用 `Blackboard.TryGetFP` 求出两侧数值（`0x1810eacd1`、`0x1810ead17`），构造可空 FP 值后调用 `OverrideDataRange`（`0x1810ead85`）。它向 Attributes 写入的是一对数值，不是 BB 键、表达式或求值函数。

所以源阶方的 `dynamic` 是**BB 值来源**。范围节点执行时求值一次；之后属性 `GetValue` 不会因为该名字而重新调用动态 BB。只有再次执行写入程序才会改变已保存的边界。范围的完整存储、替换、清除与属性求值原体见 [native-calculation.json](native-calculation.json) 及[事实摘要](native-calculation-facts.json)。

本批没有重建 `init_max_hp` 的生产链、所有 Token BB 继承规则或全部 GlobalBuff 的间接载入入口。这些边界不影响“实际内容确实在运行时修改属性范围”的证据，也不能被扩写为未核实的具体数值政策。

## 复跑

在仓库根目录执行；依赖本机已安装客户端及脚本内列出的固定资料缓存。脚本不会联网，也不修改客户端。

```bash
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/attribute-ranges-20261117/extract_usage.py --out /tmp/attribute-usage-replay/usage-native.json native
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/attribute-ranges-20261117/extract_usage.py --out /tmp/attribute-usage-replay/usage-templates.json templates
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/attribute-ranges-20261117/extract_usage.py --out /tmp/attribute-usage-replay/usage-prefabs.json prefabs
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/attribute-ranges-20261117/extract_usage.py --out /tmp/attribute-usage-replay/usage-static.json static
```

复查写到批次外，不覆盖历史原件。`prefabs` 读取同目录生成的 `usage-templates.json`，应先运行 `templates`。未安装的旧 MonoScript 包会记录在 `unavailableScriptPackages`，不会伪造映射。
