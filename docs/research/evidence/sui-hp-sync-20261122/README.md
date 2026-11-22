# 「岁」的部位生命同步

2026-11-22 核对固定资料镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 和安装的 Windows x64 客户端。[证据](evidence.json)保存客户端与资源指纹、实际出怪、Prefab 组件和 Holder、原生方法与选择区间。下文描述该版本的普通静态路径。

- TA-10「镇神头」和 TA-EX-8「《朝野汇编》」的 `/waves/1/fragments/0/actions/1–4` 分别安排左掌、右掌、尾、首，四项均为实际 SPAWN。游戏内图鉴说明四部位共享生命值。 [社区对照](https://prts.wiki/w/岁)
- 安装资源 `battle/enm_pfb_30.ab` 的 `CAB-4259af29fb317836113f2409abf8b606` 中，四个部位各有一份启用的 `PassiveBuffAbility` 引用 `enemy_sui_report_damage`。Holder 中这份程序的事件 7（应用后）先检查 HP 伤害，再执行 `Act49sideBossSyncHPRatio`。
- `Act49sideBossSyncHPRatio.Execute`（97662）在 `0x18108605e` 调用 `ApplyDamageToLevelBoss`（69527），后者在 `0x1807d828a` 转交 `Act49sideBossState.UpdateEnemyHP`（69565）。普通有效同步分支中，受击部位已经完成本次 HP 应用。管理器按受击部位累加 `Modifier.value`，对其它部位计算 `(受击部位当前 HP 比例 − 接收部位当前 HP 比例) × 接收部位 MaxHP`。例如同步到首部的分支在 `0x18082d840–0x18082d960` 读两个比例、计算有符号差值、构造 `NewHp`、写入共享标志 7 并调用 `ApplyModifier`，其余三个部位沿用这套运算。同步后管理器读取首部实际 HP 和 MaxHP，分别写进状态字段。 [跳过普通通知时的资源应用路径](../../cases/29-hp-and-ep-healing-settlement.md)

玩法上的共享血量由部位各自结算、应用后同步实现。本批未执行实战或有效 XLua，也未展开无效部位、致死和阶段退出的全部分支。

从仓库根复跑。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/sui-hp-sync-20261122/extract.py \
  --out /tmp/arkbattle-sui-hp-sync-replay.json
```
