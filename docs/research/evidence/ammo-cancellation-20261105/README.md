# 灰烬 S2：弹药消费节点与攻击中断

取证日期：2026-11-05 至 2026-11-06（Asia/Singapore），批次按开始日期命名；项目基线 `9678109f78af0d2bb01ec1eb2af024c0360a0356`。研究问题是普通弹药攻击在中断前后是否消费，以及消费发生于目标输出、施放或结束的哪个节点。不从项目 `afterOutput` 的现有位置推导原生时序，也不从“已经输出”推导尚未发生的消费义务。结论集中于[案例 09](../../cases/09-skill-mechanisms-and-requirements.md)。本批没有修改模拟实现、接口或测试，未运行游戏或核实活跃 XLua。

## 输入

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `charpack/char_456_ash.ab` | 24355 | `c675a7ba388ceb8f484558a7eae5ea9c96f66dd43b813a3b9f0ee3c63defdc43` |
| `battle/prefabs/[uc]skills.ab` | 1367500 | `0d0b4c0f9252c14a69a20d4bea09527403dd3eddfc2f7bcd757c3c30cf37ffc3` |
| `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin` | 477255 | `10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99` |

当前安装目录为 `/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。metadata v29，image base `0x180000000`；索引与地址由当前输入重新定位。依赖使用 uv 0.12.24、Python 3.14.8、Capstone 5.0.7；共享工具、专用脚本与类型树解码器身份随原始 JSON 保存。未下载客户端包。

PRTS 社区资料 [灰烬](https://prts.wiki/w/灰烬)、[假日威龙陈](https://prts.wiki/w/水陈)、[流明](https://prts.wiki/w/流明#技能)及[技能／特殊属性](https://prts.wiki/w/技能#特殊属性)查阅于 2026-11-05。公开说明能区分普通消费、条件消费、手动关闭和弹药倾泻，不能单独闭合本例被中断时的精确计数节点，因此继续读取本机配置与指令。社区资料不标作官方文档。

## 实际配置绑定

`content/ash-s2-content.json` 保存实际 AssetBundle 容器条目、组件及脚本引用，不以字符串命中代替资源绑定：

- `char_456_ash.prefab` Root Character `8466356838105471859` 的 `_modes[2]` 指向 S2 UnitMode `19486450107865971`；该 Mode 的 `_attack` 指向 RangedAttack `8324062437122366323`。
- Attack GameObject `-349758418146829453` 的组件数组同时包含上述 RangedAttack 和 AbilityEventCounter `7918768805007055731`，二者的外部 PPtr 解析为实际 MonoScript。
- Counter 的 `_countEvent=4`、`_expendPerTrigger=1`、`_resetAfterEnd=true`、`_resetImmediatelyWhenProgressEnd=false`、`_resetWhenAttackFinished=false`、`_ignoreTriggerOnce=false`。对象中的事件字段位于偏移 32，原始字节 `04000000`；字段值与 native metadata 的枚举标签分别核对。
- `skchr_ash_2.prefab` 的 CastSkillWithLimitTimes `-2996655092864802062` 配置 `_fetchFromMainAttack=true`、`_fromMainRawAttack=false`、`_modeIndex=2`、`_finishSkillWithProgress=true`、`_canDiscardRemainingCount=true`；其 Switch 子程序配置切至 mode 2。
- 当前 `_FetchCounterSource` 经过弹药模式资格后，按配置获取当前主攻击及其 Counter。不能将 `_modeIndex=2` 直接解释成该方法索引 `_modes[2]` 取 Counter。

Prefab 的 `_triggerTimeCount=31` 仅作为所存字段保留，不借此推断黑板初始化后的最终预算。此次保留七个必要 MonoBehaviour、十四个 GO／Transform 和七个 MonoScript 的解码及原始对象；没有保存全包或无关动画、特效对象。

## 消费、输出与中断

当前 metadata 的枚举常量为 `ON_SPELL_ON=4`、`ON_CAST_END=3`、`ON_DETACHED=1`；结束原因 `NORMAL_EXIT=0`、`INTERRUPTED=1`。metadata 常量使用压缩整数解码，不能按连续四字节读取；Prefab 字段则按其实际序列化类型解码。

| 锚点 | 直接证实的行为 |
| --- | --- |
| `AbilityStandard.ExecuteSpell` 64119，`0x1805fd6cb..6d6` | 先发 `ON_SPELL_ON(4)`；此调用不运行该事件的内容动作，但仍向 Behaviour（含 Counter）派发 |
| `AbilityEventCounter.OnEvent` 96417 | 事件与 `_countEvent` 相同、未被本次计数资格排除时，进入 `DealCountEvent` |
| `OnEvent` 的中间派发 | `0x181004b52` 是 `OnCountEvent` 扩展点，当前普通 native 不做消费；真正匹配／去重后在 `0x181004bbe` 经 helper `0x180005610` 的 slot 16 进入 `DealCountEvent` |
| `AbilityEventCounter.DealCountEvent` 96419，`0x181004147`、`0x181004179` | 先写 `m_eventCount +0x48`，再进入 `OnEventCountConsumed`；普通未免耗分支按本例配置消费一发 |
| `ExecuteSpell`，`0x1805fd766`、`0x1805fd866` | 计数事件返回后才进入 `Entity.OnAbilitySpellOn` 和目标输出虚调用 |
| `Ability.InterruptIfNot` 64025，`0x180603635` | 以 `INTERRUPTED(1)`、不重置完整周期调用 `FinishIfNot` |
| 实际攻击 `OnCastEnd` 继承链 | `RangedAttack → AbstractBasicAttack → AbstractAnimatedAbility → EasyToStartAbility → AbilityStandard`；结束派发的是 `ON_CAST_END(3)`，没有以此补发本次 `ON_SPELL_ON(4)` |

因此，对本例普通 native 路径：

```text
进入本次 ON_SPELL_ON
→ 计入本次弹药消费并通知
→ 来源施放程序
→ 目标输出
→ 后续攻击过程与结束
```

本次尚未到消费节点就被中断，所查结束链不会额外补出该次消费；本次已经计数后再被中断，所查中断／结束链没有按 `INTERRUPTED` 返还这次消费。不能将此说成“取消统一耗弹”或“取消统一不耗弹”，也不能把其它内容显式补弹、清理计数或关闭技能混作普通取消的隐含退款。

消费与耗尽结束是不同节点。Counter 在适用结束事件、已耗尽且配置要求时才标记 ready-to-reset；`ResetCount` 96427 的 ready 门未通过时返回 false。`CastSkillWithLimitTimes.OnTick` 74188 在进度耗尽后还要等待 `ResetCount` 成功，才进入技能结束／周期后继。因此不能根据消费先于输出，就把项目 `consume` 和 `check` 整段一起移到输出之前。

## 复跑与材料

从仓库根目录执行，输出到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/ammo-cancellation-20261105/native/extract.py \
    --out .cache/native-research/ammo-cancellation-replay/native
uv run --offline docs/research/evidence/ammo-cancellation-20261105/content/extract_ash.py \
    --out .cache/native-research/ammo-cancellation-replay/content
```

两个入口均支持 `--game`；原生入口校验 DLL／metadata，资源入口校验全部五份输入。变更客户端时不继续套用本批索引和 PathID。Native 脚本默认包含本问题的必要选择器，并自动补齐选定结束程序的实际 base 调用。资源入口复用 skill 的 UnityFS／SerializedFile 读取器和 `nymph-action-settlement-20261103/projectile/decode_projectile.py` 的类型树解析，不依赖侦察缓存；必要字节字段按数值保留，不将非零枚举强制当作 bool。首次依赖尚未缓存时去掉 `--offline`。

| 文件 | 用途 |
| --- | --- |
| `native/extract.py`、`.lock` | 当前输入的选择、枚举常量和必要方法分段提取 |
| `native/native.json` | Counter、施放、普通／中断结束、计数源与耗尽收尾指令；区间与字节哈希随 fragment 保存 |
| `content/extract_ash.py` | 固定资源输入的实际 Prefab 绑定提取 |
| `content/ash-s2-content.json`、选定 `.bin` | 精确资源引用、字段偏移、原始字节与哈希 |
| `archive.json` | 材料清单和共享工具可复查的选择器 |

本批限定灰烬 S2 的普通原生路径及所列计数条件，不穷尽条件消费、节弹、弹药倾泻、所有结束原因或节点自定义程序；也没有执行玩家操作、注入中断或验证实际热更新。它确认消费节点和普通结束链，不据此决定项目的 Lifetime 范围、ENDING 写入权限或所有技能共享的耗弹接口。
