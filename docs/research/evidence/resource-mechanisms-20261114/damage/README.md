# Damage 原生证据

结论见 [findings.md](findings.md)。本目录只保存调查与可复跑提取器，不修改 ArkBattle 行为。

## 固定输入

- 调查日期：2026-11-14；本机 Windows `GameAssembly.dll` SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29；模块基址 `0x180000000`。
- 资源、序列化对象、读取器、脚本与角色表的 SHA256 在各 JSON 的 `provenance` 中；角色表固定到 `17759cc8cdf37388414145d16262a3a06f3ab25e`。资源与在线数据独立标版本，不假定同步发布。
- 只读静态提取，没有执行游戏；保留 XLua 替换边界。PRTS 的交叉来源及冲突见 `prts-sources.json`。

## 文件与复跑

| 文件 | 提取器／范围 |
| --- | --- |
| `inventory.json` | `inventory.py`：15 owner、141 method、10 enum 的 metadata 清单。short 枚举与 int32 编码分开读取。 |
| `modifier-core.json` | 公共 `facing-semantics-20261113/extract.py`，`result.selection` 保存全部参数。 |
| `flag-callers.json` | `trace_flags.py`：157个指令边界核验的直接 helper 调用、91个逻辑方法。 |
| `classification-producers.json`、`secondary-contracts.json` | 公共 extractor；分类解析、公式 helpers、过滤器。 |
| `receiving-dispatch.json`、`receiving-actions.json` | 公共 extractor；目标接收至 Buff 动作的完整链。 |
| `buff-missable.json` | `trace_buff_missable.py`：242个 Buff 本类方法的字段访问候选与完整命中方法。不是全模块别名分析。 |
| `holder-scan.json` | `scan_holder.py`：完整9,054模板、3,084定位、39个完整事件程序；记录选取规则与键。 |
| `operator-bindings.json` | `extract_bindings.py`：17角色表配置及所选角色／技能／心烛资源的586组件；保留 PPtr、脚本、层级和完整数据。 |
| `dynamic-classification.json` | `scan_dynamic_classification.py`：517资源文件，相关5,630对象完整解码，74对象非默认，0错误；所有定位与true对象完整体。Holder JSON另外覆盖。 |
| `resource-bindings-search.json` | `search_bindings.py`：517文件的指定字节／对象搜索，0错误；负命中只说明该范围未定位。 |
| `literal-consumers.json` | `trace_literals.py`：指定 metadata 字面量及已验证 RIP 指令引用；没有命中不等于死代码。 |
| `entlec-origin.json`、`entlec-templates.json` | `extract_entlec_origin.py`复用资源读取器，另保留隐德来希S3实际召唤链、固定版本skill／level片段；模板由`scan_holder.py --select`提取。 |
| `weak-native.json`、`weak-attack-info.json`、`weak-rng.json`、`weak-database.json` | 当前指纹WeakDamage／AtkScaleUp、AttackInfo构造、山概率Talent与DB查找完整体。 |
| `weak-content.json`、`weak-templates.json`、`weak-flag-bindings.json` | `extract_weak_content.py`：山／赤刃明霄陈120组件、完整DB别名、114条templateKey扫描；当前Holder完整程序及固定弱点flag的517资源负搜索。 |

在仓库根目录执行：

```sh
python docs/research/evidence/resource-mechanisms-20261114/damage/verify.py \
  --native \
  --out .cache/native-research/resource-mechanisms-20261114/damage/replay
```

`verify.py` 读取已归档选取参数，独立重提全部资源与原生记录，比对 `result`（仅排除输出路径／game参数），并解析所有 Python 文件。`uv` 使用仓库 `.cache/uv`，不写用户只读缓存；不运行产品测试。最终复提报告归档为 `verification.json`。

`.pdata` 是方法内分段，不是完整方法边界。公共 extractor 与 `trace_flags.full_body` 按下一个 metadata 原生入口扩展并保留所有分段。某些方法尾部含 switch 表或异常数据，完整保留不等于把每个字节认定为代码。直接 call/xref 无法穷尽虚调用、反射或有效 XLua。

弱点专项补核单独重提，避免把旧指纹Case10当成本轮当前体；完整选取参数仍在各记录中：

```sh
python docs/research/evidence/resource-mechanisms-20261114/damage/verify_weak.py \
  --out .cache/native-research/resource-mechanisms-20261114/damage/weak-replay
```

7份记录的独立重提结果见 `verification-weak.json`。DB镜像与安装资源分开标版本，已关闭“loadFromDB最终定义未恢复”的旧缺口；atkAddition与Wiki的差异仍保留，见[案例10第4节](../../../cases/10-weak-damage-and-critical.md#4-atkaddition差异仍存在不能伪造热更新结论)。

## 覆盖与未证矩阵

| 机制 | 生产／传播 | 消费 | 实际使用与结论 |
| --- | --- | --- | --- |
| DamageType／AttackType／ApplyWay | 构造、ApplyDamage、DamageApplyConfig、Assign／Split | 公式、Filter、接收节点 | 锡人、仇白、响石、佩佩／怒潮凛冬；已闭合独立维度。 |
| 动态主目标／扩散分类 | `_SetAttackTypeByMainTarget`、`_ResolveAttackType` | 显式目标相等判断、后续AttackType过滤 | 全资源找到74个true；奥达默认／S2攻击及S1实际绑定，已闭合。 |
| value不可改／非致命 | flag16 setter与专门解锁；flag3 | setter、普通HP提交及派生例外 | 煌／嵯峨由同批life闭合；不能推广为所有派生提交者。 |
| 忽略闪避／取消原因权限 | 远牙、骋风实际模板 | Modifier.Cancel／CheckIgnoreCancel、实际焰尾闪避链 | 权限闭合；RNG与Wiki描述冲突，需有效XLua或客户端运行才能消除冲突。 |
| 计次护盾／动态屏障 | 泥岩盾链、砾S2 `shield_atten` | BlockDamage、动态额度、取消与后继程序 | 已闭合；不能把一种护盾的完整顺序推成全部护盾政策。 |
| 分担／反伤 | 浊心斯卡蒂S1、玛恩纳天赋2 | 新公式／新Modifier／同步Apply | 已闭合实际来源及嵌套次序。 |
| 计算事件与缓存ATK | 各公式helper、实际仇白附加、既有Case18弹道 | 目标／来源公式事件和当前公式 | 已闭合入口差别；缓存ATK不等于完整属性快照。 |
| 弱点／概率倍率 | 山的实际ProbAdditionNextAtkTalent、赤刃明霄陈天赋的DB别名 | 当前WeakDamage／AtkScaleUp／AttackInfo构造 | 当前代码及实际引用闭合；atkAddition候选置零与Wiki描述冲突，不伪造热更新结论。 |
| HP／EP环境、睡眠权限、锤手目标 | shared flag5／14／8／19／20 | 亚叶／齐尔查克、资格判断、怒潮凛冬 | 已闭合实际绑定；EP消费者与治疗由同批EP/Healing进一步归档。 |
| `DAMAGE_WITHOUT_MODIFY` | Holder71处字段、6处true | 唯一定位模板 `scale_damage_on_hp_less` | 该消费者未获资源绑定；全517与字面量搜索边界明确。未证现役需求，不标废弃。 |
| `INSTANT_KILL_LIKE_DAMAGE`、source／originalSource | NoSourceDamage、实际锡人S1等 | 内容过滤器、UI、死亡消费者 | 本目录闭合构造传播，死亡归属由同批death研究闭合。不得凭名字等同强制死亡。 |
| UI／SP／全局生命点／部署费 flags | 当前helper调用者全定位 | HUD、技能与BattleController | 分类保留，未误当四类HP／EP操作的统一输入。 |

研究没有决定删去或简化未证机制。心烛由隐德来希S3实际召唤配置闭合，而非Schedule SPAWN；关卡预置隐德来希的S2卡片不会冒充S3施放证据。补充内容链的重提命令与结果见 `verification-additional.json`。
