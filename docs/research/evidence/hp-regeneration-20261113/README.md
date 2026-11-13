# 自然 HP 回复：属性、计时与提交

2026-11-13。机制结论维护在[案例 29](../../cases/29-hp-and-ep-healing-settlement.md#5-skip生命复原与自然回复)。本批只做静态调查，不修改 Core 或选择接口。

## 来源与范围

- `native.json`：当前 Windows x64 客户端，metadata v29。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。保存方法、完整分段指令、字段与枚举默认值、回复属性元数据及字面量。
- `configuration.json`：独立的第三方镜像 EnemyDB／普通关卡正例，以及本机模板中的 HP 满值通知消费者。JSON 与本机客户端不视为相同版本。
- `extract_native.py`／`.lock`：基于共享 `native.py` 提取；属性元数据复用同客户端的[数值审计解码器](../unit-audit-20261110/coordinates-numeric/extract.py)。两者的脚本指纹随输出保存。
- `inspect_configuration.py`：核对固定 EnemyDB 字节哈希、摘录正值并统计负值，验证关卡与既有完整 Git tree 审计的哈希，再扫描本机模板的事件 98。Unity Reader 复用共享工具。

EnemyDB 来自 `Kengxxiao/ArknightsGameData` 修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，Blob `62ab806926b9c8ca5c80524730caf0066f6c2c2f`，SHA-256 `eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b`。来源身份复用[既有原件记录](../leithanien-summons-20261109/data/README.md)，脚本再次校验完整文件。

普通 5-8 关卡采用独立固定修订 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`，路径 `zh_CN/gamedata/levels/obt/main/level_main_05-08.json`，Blob `996cb6cbba9d79b6957c1a8aeea12bcf785b13b1`，SHA-256 `561cc82c44f1c3224b7fbfc5cf3c27873a70e5398065d3694d94201e335455a4`。对照[固定关卡清单](../checkpoint-nondefault-20261107/config/pinned-profile.json)核验，不把可变分支名作为版本证明。

## 关键定位

| 方法／数据 | 当前入口或证据 |
| --- | --- |
| 有效回复速率 | `Entity.get_sumUpHpRecoveryPerSec` 67475，`0x18073a2c0`；属性 13 加 MaxHP×属性 19 |
| 正数门控 | `Entity.get_canRecoverHp` 67407，`0x180733b50`；总速率与零比较 |
| 初始化 | `Entity.Init` 67624，`0x1807264b0`；正速率以 `1/rate`、`waitFirstPeriod=true` 重置 timer，否则 MarkInvalid |
| 每 Tick | `Entity.OnTick` 67697，`0x18072c290`；虚槽 40 的 `get_alive` 成立后调用回复；该槽与 `get_isAlive` 不同 |
| 单点回复循环 | `_UpdateHpRecovery` 67642，`0x180732280`；Update 后重复 Next，每次调用 `set_hp(hp+1)` |
| 精确计时 | `PrecisePeriodicTimer.Update` 26436、`Next` 26437、`get_isReady` 26433；remaining 减 dt，remaining≤0 就绪，Next 加一个 period |
| 速率变化 | `OnAttributeDirty` 67699，`0x180728510`；属性 0、13、19 进入 HP timer 更新分支 |
| 保留过去时间 | `PeriodicTimer.ResetButKeepPastTime` 26425，`0x181e4ad50`；新 remaining=`max(0,newPeriod-(oldPeriod-oldRemaining))` |
| 普通 HP setter | `set_hp` 67434→虚槽111 `SetHpInternal` 67625；Clamp 后写入，再判断当前 HP 比例是否满值 |
| 满值通知 | `SetHpInternal` `0x18072f01f..199`，`BuffContainer.OnOwnerHpFull` 66447；无 previous HP／实际变化量比较 |
| 属性约束 | `attributeMetadata`；固定速率 min=0，无声明 max；百分比速率 min=0、max=1 |

`native.json` 的 `virtualMethodSlots` 保留 Entity／Character／Enemy 对相关虚槽的声明。`get_alive` 的 Entity 普通实现要求状态机正在运行、HP>0；Character 的覆盖77129（`0x180aae990`）还要求不是 Dummy、没有处于 Dying 状态。`0x180aaea25` 的虚槽156由同指纹[Skill／Presence 元数据](../skill-start-presence-20261106/native/native.json)确认为 `Character.get_isInDyingState`，不是按调用位置推测。没有额外的满血、消失或禁疗判断。

满血时外层与循环没有停止计时或跳过 setter 的分支；普通 setter 在每次写后比较 `Clamp01(hp/maxHp)` 与 1，不检查是否从非满变满。因此，已满血的正速率脉冲也能进入 HP 满值通知。这里是静态路径推导，未执行实战。

模板全量扫描 9054 项，事件 98 有两项：`titi_s_3[doze_indoze]` 执行 `FinishBuff`，另一个为项目不支持的 `sandbox_v3_service[start]`。前者证明已配置消费者，但本批没有继续追踪缇缇 S3 的实际技能安装绑定，不将模板存在冒充技能现场触发。

## 复跑

从仓库根运行；输出到新目录，保留本批原件。客户端默认路径为 `/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`，可用 `--game` 覆盖。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/hp-regeneration-20261113/extract_native.py \
  --selector Torappu.Battle.Character.get_alive \
  --out .cache/native-research/hp-regeneration-replay/native.json
python docs/research/evidence/hp-regeneration-20261113/inspect_configuration.py \
  --out .cache/native-research/hp-regeneration-replay/configuration.json
python .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/hp-regeneration-20261113
```

配置脚本可用 `--database`、`--mirror` 指向相同原件；EnemyDB 可从上述 Git Blob API 取回 Base64 原始内容后校验 SHA-256，关卡从固定修订取回。脚本默认复用缓存，缺失输入不会自动改查当前版本。

## 限制

未运行完整客户端或验证活跃 XLua。计时、setter 与配置分别标注证据，未现场测量回复显示或消费时序。扫描仅覆盖所列完整 EnemyDB：993 个显式定义中 13 正、980 零、0 负，不能证明所有内容绝不临时赋负值；但普通属性元数据与 `canRecoverHp` 都不支持把负回复速率解释为自然生命流失。生命流失需独立核对其程序与 Modifier 路径。

本批不把自然回复等同于生命复原的 skip Modifier；后者复用案例 29 已有链。自然回复不派发普通 Healing Hook 是既定项目选择，普通 HP setter 的资源约束与满值通知是另一个层次。
