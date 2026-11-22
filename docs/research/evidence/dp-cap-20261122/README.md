# 诺伯特平民、赏金猎人扰乱者与部署费用上限

2026-11-22 核对固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的图鉴、TR-22、主线 12-13、HE-7 和悖论模拟「安全框架」。客户端为 Windows x64、IL2CPP metadata v29。DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

[配置摘录](config.json)保留文件 SHA-256、图鉴、敌人数据库、关卡 rune、实际 SPAWN 和 Buff 模板的 JSON Pointer。[原生正文](native.json)保留静态字段、原生指令和选择区间。[部署费用公式](../deployment-recovery-20261101/cost-version/runtime-cost.json)使用相同 DLL 指纹。

HE-7「以爱相连」和圣约送葬人的悖论模拟「安全框架」均配置上限 99，`runes` 与 `globalBuffs` 均为 null，两关均有 `enemy_1341_bthtms` level 0 的 SPAWN。敌人数据库绑定同名 Prefab，并给出 `ReduceCost.max_cost = 10`。已安装原始 `enm_pfb_14.ab` 中的 `Talents/ReduceCost` 是启用的 `PassiveBuffAbility`，其 Buff 绑定 `bthtms_t_1[max_cost]`。热更的 Buff 模板 Holder 第 2792 项与镜像一致，Buff 建立时调 `ModifyMaxCost` 减少上限并限制当前账户余额，结束时反向归还。[已安装的 Prefab、MonoScript 和模板](assets.json) [关卡与敌人数据库](config.json)

| 原生位置 | 复查用途 |
| --- | --- |
| `BattleOptions..cctor` #63906，`0x18060801e`、`0x18060804b`、`0x1806081b8` | 普通默认两个上限均为 99，同步字段默认 true。 |
| `LMaxCostSet.PreprocessLevelOptions` #87070，`0x180d7b2c4`、`0x180d7b2f6`、`0x180d7b322`、`0x180d7b383`、`0x180d7b398` | 两项黑板的读取、不同位置的写入以及关闭同步。 |
| `BattleOptions.LoadOptions` #63902，`0x1806076c6–0x180607721` | 同步位为 true 时，将 `MAX_COST` 复制到 `MAX_COST_CEIL`。为 false 时跳过复制，并将同步位恢复为 true。 |
| `BattleController._ApplyGlobalModifier` #65795，`0x180663eab`、`0x180663ef4` | 普通模式经无热更替换的默认回调返回，后接 `_DoApplyGlobalModifier`。 |
| `BattleController._DoApplyGlobalModifier` #65794，`0x180665ba9–0x180665c0a` | 对既有阵营账户上限计算增减，调用 `BattleCostManager.SetMaxCost`。 |
| `BattleCostManager.SetMaxCost` #65878，`0x180684988`、`0x180684a21` | 在已开始的战斗路径读取独立费用截断上限，写入相应一侧的账户记录。 |
| `Action.Nodes/ModifyMaxCost.Execute` #98830，`0x1810ece26` | 赏金猎人扰乱者模板使用的节点通往 Controller 的修改入口。尚未把该节点绑定到诺伯特平民的具体内容程序。 |

本批核对普通静态分支。已验证的运行期上限修正只写阵营账户，卡牌费用仍读取关卡加载时设置的 `MAX_COST_CEIL`。模式专属改写与 XLua 替换仍需按实际内容核对。完整方法的末尾填充可能包含解码出来的非执行数据。机制结论见 [Case 20](../../cases/20-norport-civilian-allegiance-and-blocking.md) 与 [Case 24](../../cases/24-deployment-cost-and-supply.md)。

从仓库根目录复跑。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/dp-cap-20261122/extract.py \
  --out /tmp/arkbattle-dp-cap-replay
```
