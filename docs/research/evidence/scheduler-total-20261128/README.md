# 普通计划总数与独立增量入口

日期：2026-11-28；机制结论见[案例 30](../../cases/30-scheduler-action-data-fields.md)。仅追踪 Scheduler.totalEnemiesCnt 的初始化、显式调整与直接调用者，不检查所有字段内联写入。

来源：Windows x64 IL2CPP metadata v29，DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，与 11-07 批次相同。配置见 `config.json`，本地镜像提交 `17759cc8cdf37388414145d16262a3a06f3ab25e`。

- `bodies.json`：CalculateStates、Init、Reset、UpdateWaves、AddTotalEnemiesCnt、setter、TryDealDynamicPhase wrapper 等连续 pdata。
- `search-total.json`：metadata 方法名包含 totalEnemiesCnt 的结果；`xref-*.json`：CalculateStates、AddTotalEnemiesCnt、setter 与 TryDealDynamicPhase 直接 E8/E9 候选。
- `callers-add.json`：两个增量调用点、Act1Vase 分配计数来源的可读指令摘录。`callers-set-calc.json`：AutoChess 的重算调用点摘录。`dynamic.json` 与 `phase-count.json`：动态协程及 PhaseData.GetEnemiesCnt 的完整连续 pdata，另含 Act1Vase 与 ArkDex 的分配／计数方法。
- `callers-dynamic.json`：九个直接候选均按完整连续 pdata 定位调用指令后截取实参附近片段。`includeInTotalEnemy=true` 有 Sandbox._ParseCatchedAnimalsInBuildMode (0x180efbb4e)、SandboxLevelDataProcessor.OnStartGame (0x180f3705d)、SandboxLevelDataProcessor 的 OnFinalSchedule 协程 (0x180f5646e)；其余六个直接调用点传 false：ArkDexCapture 两处、HalfIdle 一处、SandboxV3 两处与 Sandbox.SummonNextInsectPhase 一处。
- `config.json`：活动表 basicInfo、关卡表 stages、关卡 options.configBlackBoard、匹配 rune、主 waves 的 SPAWN count 和 Branch 数量摘录，记录输入文件 SHA256。

## 复跑

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research/scripts
uv run --locked --offline "$skill/native.py" --out /tmp/total-search.json search totalEnemiesCnt
uv run --locked --offline "$skill/native.py" --out /tmp/total-add-xrefs.json xrefs 0x18097d870
uv run --locked --offline "$skill/native.py" --out /tmp/total-calc-xrefs.json xrefs 0x18097d950
uv run --locked --offline "$skill/native.py" --out /tmp/total-set-xrefs.json xrefs 0x180988e50
uv run --locked --offline "$skill/native.py" --out /tmp/total-phase-xrefs.json xrefs 0x1809836a0
uv run --locked --offline "$skill/native.py" --out /tmp/total-add-callers.json disasm 68824 82722 81584
uv run --locked --offline docs/research/evidence/elemental-timing-20261102/extract_schedule.py --out /tmp/total-phase-replay.json --method 'Torappu.Battle.Scheduler/<TryDealDynamicPhase>d__127.MoveNext' --method 'Torappu.LevelData/BranchData/PhaseData.GetEnemiesCnt'
```

其余完整连续片段使用同一 extract_schedule.py，以各 JSON 的 `result.bodies[].selector.fullname` 作为 `--method` 重提；调用点摘录按记录的 VA 选取。`config.json` 可在固定镜像中按表路径、活动/关卡 ID 与 rune key 重查，SPAWN 数量按主 waves[*].fragments[*].actions[*] 的 actionType=SPAWN 加 count，Branch 按对象 key 数量统计。

边界：静态未走 XLua 的路径，未运行客户端、未核实活动实际入口全链。不含所有内联字段写入、间接调用、虚分派、delegate 与 XLua 补丁；不能从直接候选未命中证明所有常规关卡永无独立调整。特殊活动 ACTIVITY 的 stageType 本身不能证明它属于通用玩法范围。
