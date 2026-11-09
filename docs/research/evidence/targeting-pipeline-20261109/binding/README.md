# 目标绑定、重选与释放复核证据

2026-11-09。范围是 Windows x64 客户端普通 native fallback；未运行完整客户端，未验证活跃 XLua。主问题的机制结论由上层案例维护，本目录提供本次新增证据及复跑入口。

## 来源与输出

- DLL SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；版本29。
- `extract_binding.py`／`.lock` 按当前完整方法名选择 AbilityStandard、MeleeAttack、RangedAttack、AbstractAnimatedAbility 与 EasyToStartAbility 的必要方法；嵌套 coroutine 按所属类型前缀定位，不套旧方法索引。
- `native/contracts.json` 保存枚举字面常量、当前字段布局及相关虚槽身份；Entity／VisualObject 仅保留本问题使用的方法。
- `native/bodies.json` 保存所选方法到下一个已知方法之间的连续 `.pdata` 分段、字节与分支；`fullyDecoded` 只表示解码边界完整。通用委托、虚调用、外部方法仍按调用者的实参和字段解释。
- `native/helpers.json` 保存本次调用方实际引用的 ObjectPtr 校验／读取闭合体；VA 参数仅对应以上指纹。
- `extract_upstream.py`／`.lock` 与 `upstream/` 补齐 Character／Enemy状态机、Attack／Combat Wrapper、SelectorTrigger 的搜索、保存目标、独立资格和输入绑定调用。

原生工具的版本、客户端文件、选中方法及脚本指纹也写入各 JSON 的 `provenance`。本目录不重复归档已有真实 Prefab；真实引用见同批 `../content/`，妮芙与维什戴尔的既有来源另列于下方。

## 复跑

从仓库根目录执行。首次需要解析依赖时可去掉 `--offline`，之后使用锁文件：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/binding/extract_binding.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/targeting-binding-replay \
  --helper 0x184683e30 --helper 0x1853ae780 --helper 0x1853ae540
```

```sh
uv run --locked --offline docs/research/evidence/targeting-pipeline-20261109/binding/extract_upstream.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/targeting-upstream-replay
```

改变客户端后先核对指纹并重新定位 helper，不能继续套这三个 VA。`--scout` 只输出当前类型契约及方法名；`--method` 可重复指定完整方法名进行定向提取。

## 复用范围

- [妮芙 S1 目标／发射证据](../../nymph-action-settlement-20261103/target/README.md)：真实 `FROM_OWNER + AT_BEGINING`，本次当前主体指纹相同；目标／发射方法已重新提取。
- [案例 02](../../../cases/02-action-and-projectile-phases.md)：维什戴尔普通攻击真实 `INPUT_TARGET + BEFORE_SPELL_START + alwaysIncludeTarget`。其早期方法索引／VA不与本次混用，配置由当前同批内容核对补充。
- [案例 16](../../../cases/16-projectile-motion-and-hit-boundaries.md)、[案例 18](../../../cases/18-projectile-source-and-target-lifecycles.md)：普通原目标命中、范围／沿途命中、挂点身份和存活条件；复用机制结论，不将旧客户端 VA 冒充本次地址。
- [案例 19](../../../cases/19-effect-selection-and-immunity.md)：目标筛选与异常安装／生效的区别。
- [案例 27](../../../cases/27-attack-additions-and-damage-events.md)、[案例 29](../../../cases/29-hp-and-ep-healing-settlement.md)：命中后 HP／EP 伤害、治疗与附加内容的独立结算。

## 限制

四种 timing 的通用消费分支已经展开，`RESELECT_IF_TARGET_DEAD` 已由同批陈S3真实配置闭合；`BEFORE_FIRST_SPELL_START` 尚未在本次代表 Prefab 中取得实际启用正例。不能据此认为它们不存在，也不将其自动转成 Core 必须新增的机制。Prefab 字段、默认值、方法可执行分支与实战观测分开记录。
