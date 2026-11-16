# 来源击杀后继与死者死亡输出

结论集中在[案例39](../../cases/39-death-attribution-and-attribute-ranges.md)。本批核对已启用的角色／关卡程序，比较来源后继在死者输出前和伤害返回后的区别；不修改Core或批准新的接口。

## 输入与边界

- Windows客户端DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。方法索引及地址仅适用于该输入。
- Bundle、对象、镜像JSON、解码工具的完整指纹保存在各记录中。既有来源先于受害者响应的原体复用[死亡归属批次](../resource-mechanisms-20261114/death-attributes/README.md)。
- 静态native／配置核对，不运行客户端，不验证活跃XLua。组合可达性与数值结果是调用链推导；Node脚本是当前Core公开API的表达探针，不是完整角色实装或原生实机实验。
- 普通高能源石虫的爆炸有延迟，本批没有用它冒充同步死亡伤害；正例使用焦竭之火。

## 记录

| 文件 | 内容 |
| --- | --- |
| `source-prefabs.json`、`source-selection.json` | 炎客、苇草、焦竭之火实际组件与登记；复用既有Prefab解码器 |
| `shield-prefabs.json`、`shield-selection.json` | 斥罪实际天赋及 `judge_t_1`／表现Buff的登记 |
| `programs.json`、`operator-config.json` | 本例四个完整模板、原表天赋／特性黑板；不是仅凭名称推断 |
| `shield-stats.json` | 斥罪精二末级与信赖属性关键帧，保留原始数值 |
| `maxhp-sync.json` | 属性登记、标脏委托及当前HP比例同步的完整方法 |
| `actual-content.json`、`range-x5.json` | FC-8实际出生、Boss召唤、火的固有能力、范围与敌人属性及来源指纹 |
| `aoe-entry.json`、`aoe-regions.json`、`aoe-deal-regions.json` | AOE节点及跨.pdata区域的完整续接；同栈进入ApplyModifier |
| `owner-finished-check.json`、`owner-calc-regions.json` | BUFF_OWNER与伤害计算只要求对象存在，没有以来源alive／finished拒绝死亡程序 |
| `source-verification.json`、`program-verification.json` | 所选组件、完整方法及四份完整模板独立复提比较结果 |
| `compare-order.mjs`、`compare-order-result.json` | 斥罪先补盾／后补盾的HP与EP对照 |
| `lifetime-order.mjs`、`lifetime-order-result.jsonl` | Apply返回与死者Finalize的相对顺序随外层Lifetime作用域变化 |

## 核对位置

`Entity.OnFinish` #67653 在来源 OnTargetKilled（`0x18072a407`）返回后，才调用受害者 BuffContainer.OnOwnerFinish（`0x18072a44a`）；之后清Buff（`0x18072a46a`）。目标每个Buff内部的死亡／被击杀／结束程序见既有 #66135。

斥罪天赋路径为 `char_4065_judge/Others/Direction/Talents/1`，PassiveBuffAbility `-5237745640822817507`。`judge_t_1` 的击杀程序直接更新自身屏障额度，后续伤害接收读取同一份额度。炎客 `char_131_flameb/Talents/1` 的 `4123227869325778635` 登记 `flameb_t_1`；新增MaxHP当场同步当前HP，不等下一个Tick。

FC-8的 `waves[0].fragments[1].actions[4]` 出生 `enemy_1536_ncrmcr`；其 Chain_1／Chain_2 实际召唤 `enemy_1294_duchns`。火的 `Talent/Boom` 登记 `enemy_duchns_boom`。AOEDamage.Execute #99271 → `_DoAoeBuffAndDamage` → `_DealDamageAndEffect` → Entity.ApplyModifier，均为同步调用；没有Projectile／Timer中转。火自身没有无敌或不可选中，附着缴械／静默施加于同格宿主；反例中的斥罪位于四邻格。

## 复跑

在仓库根目录构建后执行：

```sh
npm run build
node docs/research/evidence/death-notification-order-20261116/compare-order.mjs
node docs/research/evidence/death-notification-order-20261116/lifetime-order.mjs
python docs/research/evidence/death-notification-order-20261116/extract_programs.py --out /tmp/death-order-programs.json
```

前者对两种顺序断言击杀结果均为true，而斥罪分别存活345.5 HP／死亡。初始屏障按部署值建立，再用前置伤害耗尽并留下1800 HP；目标选择与附着资格由原生记录独立核实，脚本显式提交符合范围的对象。第二个脚本展示合法的同步清理程序，不将临时禁回SP业务当作实际角色配置。

原生组件可用既有 `resource-mechanisms-20261114/death-attributes/extract_content.py`，分别传本批两份selection和独立输出路径重提。完整方法选择保存在各原件的selection，复用 `facing-semantics-20261113/extract.py` 的 `--body-index` 等选项重提。AOE续接按本批记录地址，用共享 `native.py disasm-at` 核对，不能只反编译方法首个.pdata区间。只与相同指纹输入比较。
