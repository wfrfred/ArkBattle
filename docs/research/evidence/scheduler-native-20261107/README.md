# Scheduler 通用执行链补核

调查日期：2026-11-07。结论集中于[战斗推进研究第 6 节](../../01-scope-and-battle-flow.md#6-官方-scheduler-已确认的语义)。范围为通用 Scheduler 与卫戍所需边界，不调查生息演算、保全派驻的刷新规则。

## 来源与材料

本机 Windows x64 客户端，IL2CPP metadata v29；静态普通分支，未执行游戏或验证全部 XLua 覆盖。

- GameAssembly.dll：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- `branch-bodies.json`：分支启动、游标、隐藏组资格、波次推进、结束判定。
- `random-bodies.json`：Branch Phase 随机 Action、关联 Pack、主线 Fragment 与 Action 展开，以及初始化；未闭合的调用不当作已确认规则。
- `random-helper.json`：Phase 选择调用的权重累计、随机区间与逐项选择辅助程序。共享泛型地址不直接指认唯一方法名。
- `spawn-bodies.json`：出生、动作完成回调、销毁／回收及主调度；包含所选方法中调用到的其他模式分支，不因此扩大支持范围。
- `scheduler-fields.json`：从本次 `native.py type Torappu.Battle.Scheduler` 输出保留实例账本及常量字段，去掉 Hotfix 静态登记字段和方法列表。

配置背景复用[两份关卡配置证据](../schedule-level-structure-20261106/README.md)与 [PRTS 波次说明](https://prts.wiki/w/作战机制#扩展阅读：波次)（2026-11-07 查阅）。具体 dragon 触发来源、主线随机预处理与 advancedWaveTag 消费仍未闭合。

## 复查

原始方法全名、token、当前索引和 VA 均保存在各记录中。完整方法摘录复用 `../elemental-timing-20261102/extract_schedule.py`：向 `--method` 传入记录中的 selector.fullname，显式覆盖该脚本默认列表；共享辅助程序用 `--helper`。边界为相邻已知原生方法之间的连续 pdata 片段，包含填充；不是运行时轨迹。

可用共享复查器按归档选择器复提：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/scheduler-native-20261107 --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/scheduler-replay
```

复查器不恢复专用跨片段收集逻辑；检查尾跳转、分段边界时仍使用上述 extractor。仅更新本批清单：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/scheduler-native-20261107
```
