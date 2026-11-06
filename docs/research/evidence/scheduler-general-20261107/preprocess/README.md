# Scheduler 预处理字段补核

独立调查日期：2026-11-07。字段／路径与 VA 注释见 [field-path-matrix.md](field-path-matrix.md)，机制结论与明确缺口统一维护于[案例 30](../../../cases/30-scheduler-action-data-fields.md)。仅补原生机制证据，不修改公共案例、项目实现或架构政策；生息最小随机候选只用于核实字段是否被读取，不调查其玩法。

输入为本机 Windows x64、IL2CPP v29。完整指纹在每份 JSON provenance：GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；global-metadata.dat SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。静态普通分支，不执行游戏、不确认运行时 XLua。完整方法提取边界为相邻原生方法间的连续 pdata 片段，可能含填充，不是运行轨迹。

- `preprocess-bodies.json`：DataDriven 构造、完整处理次序、单位置 killed count、共享 key remain budget、空 key、删除 invalid；ActionData weight getter；SandboxV3 最小候选；Enemy.SetExtraMeta。
- `preprocess-type.json`：DataDriven 的 valid／single killed／valid pack／remain 四个实例集合布局。
- `autochess-action-meta-producers.json`：Self／Help／Boss 生成器将具体 EnemyInfo 子类型写入 ActionData.extraMeta。
- `autochess-action-source.json`：对应 Action 构造与写回 Fragment.actions 的路径。
- `autochess-meta-consumers.json`：OnEnemyRegistered 的具体 EnemyInfo 类型检查与效果消费，以及死亡回调的最小调用关系。
- `autochess-meta-bodies.json`、`set-extra-meta-xrefs.json`：出生后 SetExtraMeta 的两处直接调用，区别于 ActionData 生产链。
- `enemy-options-xrefs.json`：定位最小卫戍消费入口的直接调用候选；不将候选本身当行为证据。
- `meta-types.json`、`extract_preprocess_types.py`：四个 EnemyInfo 类型、三条生成方法 List 的实际泛型参数、消费 TypeInfo 槽原始值与解码。

复提原生方法可使用共享 replay.py（由 archive 选择器读取），或直接复用旧 extractor 并按各 JSON 的 `selector.fullname` 显式逐个传 `--method`。切勿使用 extractor 的默认 EP 方法列表：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/scheduler-general-20261107/preprocess --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/preprocess-replay
uv run --locked --offline docs/research/evidence/scheduler-general-20261107/preprocess/extract_preprocess_types.py --out .cache/native-research/preprocess-meta-types-replay.json
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/scheduler-general-20261107/preprocess
```

专用类型脚本只展开本批三处泛型参数及一个 TypeInfo 槽；并非新的通用反编译器。旧批 ActionData 构造／复制、Phase Fetch、RandomGroup 与 `_DoSpawn` 原件不重复拷贝，矩阵给出文件／方法／VA 定位。
