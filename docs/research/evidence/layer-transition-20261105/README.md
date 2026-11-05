# 自身空地身份切换与阻挡清理

取证日期：2026-11-05；项目与共享工具基线 `a39b4fb`。问题限于：普通自身身份切换是否负责主动脱离，还是只有浮空等特殊效果负责。结论集中于[案例 15 的补核小节](../../cases/15-locomotion-native-semantics.md#2026-11-05-补核自身空地身份切换与主动脱离)。未运行官方战斗、核实活跃 XLua 或修改项目实现、测试。

## 输入与资料

本机官方 Windows 客户端安装目录：`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| GameAssembly.dll | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

metadata version 29，Windows x64，image base 为 `0x180000000`。本批按当前 metadata 名称重新定位，不沿用 2026-10-19／23 批次的索引或地址。

共享 `native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`。运行环境为 uv 0.12.24、Python 3.14.8、锁定 Capstone 5.0.7；每份原生输出保留真实输入指纹、工具身份与解析注册表定位。

先查 [PRTS 行动方式](https://prts.wiki/w/行动方式)及[异常效果](https://prts.wiki/w/异常效果)，查阅日期为 2026-11-05。社区资料支持身份、寻路与异常控制的区分，没有说明普通入口的清理责任，故继续客户端取证；资料登记见 [prts-sources.json](prts-sources.json)。

## 必要材料

- `probe.json`：本次输入与解析版本。
- `motion-transition.json`：Entity raw Setter／有效身份 Getter、Entity／Enemy 的变化回调、Enemy Change／Reset 入口。
- `setter-continuation.json`、`setter-epilogue.json`：raw Setter 入口的连续后半段。
- `enemy-changed-continuation.json`、`enemy-changed-epilogue.json`：Enemy 变化回调的连续普通主体与收尾。
- `base-and-levitate.json`：Entity Change／Reset、寻路字段 Getter／Setter，以及同版浮空状态进入／退出。
- `levitate-enter-continuation.json`、`levitate-enter-completion.json`：浮空进入方法的后半段与收尾。
- `release-block.json`：同版完整脱离入口。
- `release-from-blocker.json`、`release-from-blocker-continuation.json`、`release-from-blocker-epilogue.json`：入向关系解除与阻挡插值取消。
- `selected-enemy-fields.json`：当前 Enemy 的 m_blocker、m_blockTween 字段及必要方法投影；不归档完整类型转储。
- `tween-kill-dispatch.json`、`tween-kill-case-1.json`、`tween-kill-case-2.json`、`tween-kill-case-3.json`：Kill 派发及已见具体目标，不继续展开 Tween 内部实现。
- `archive.json`：材料哈希与复查选择器。

PE `.pdata` 将部分方法拆成多个连续区间。入口输出的 `fullyDecoded` 只指该区间，必须与列出的后续区间共同阅读；不以入口段缺少调用证明整个方法没有副作用。已命名的尾调用对应独立方法，不将热更委托解释为普通 native 业务。

关键锚点：Enemy Change 的 `0x180ab9b75` 调用基类，`0x180ab9b89` 尾跳 ReleaseBlock；Reset 的对应位置为 `0x180ac2afc` 与 `0x180ac2b0b`。这两个外层普通分支没有新旧身份门禁。

## 从独立目录复跑

从仓库根目录执行，准备同指纹客户端及共享工具的锁定依赖。先核对 `probe.json`，不匹配时停止；不能继续应用本批数字选择器。每条命令都可加 `--game` 指定另一处安装目录。

```sh
research_skill=.agents/skills/arkbattle-native-research
research_out=.cache/native-research/layer-transition-replay
export UV_CACHE_DIR="$PWD/.cache/uv"

uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/probe.json" probe
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/search-motion-mode.json" search MotionMode
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/motion-transition.json" disasm 67372 67373 67704 77755 77856 77857
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/base-and-levitate.json" disasm 67597 67598 78046 78048 67370 67371
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/setter-continuation.json" disasm-at 0x18073ac8d
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/setter-epilogue.json" disasm-at 0x18073acd2
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/enemy-changed-continuation.json" disasm-at 0x180abfa95
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/enemy-changed-epilogue.json" disasm-at 0x180abfb64
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/levitate-enter-continuation.json" disasm-at 0x180ae459f
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/levitate-enter-completion.json" disasm-at 0x180ae4613
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/release-block.json" disasm-at 0x180ac2770
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/release-from-blocker.json" disasm-at 0x180ac2820
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/release-from-blocker-continuation.json" disasm-at 0x180ac289c
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/release-from-blocker-epilogue.json" disasm-at 0x180ac2951
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/tween-kill-dispatch.json" disasm-at 0x180614be0
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/tween-kill-case-1.json" disasm-at 0x180614d4b
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/tween-kill-case-2.json" disasm-at 0x180614d36
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/tween-kill-case-3.json" disasm-at 0x180614cb8
uv run --locked --offline "$research_skill/scripts/native.py" --out "$research_out/enemy-type.json" type Torappu.Battle.Enemy
```

`selected-enemy-fields.json` 对最后一个类型查询结果保留 m_blocker／m_blockTween 两个字段，以及 get_rootTile／OnMotionModeChanged／ReleaseFromBlocker／ReleaseBlock 四个方法；来源 provenance 保持不变。完整类型查询只用于复核，不纳入持久证据。

离线参数使用已缓存的依赖；首次准备可去掉 `--offline`，由 uv 按脚本锁获取。以上命令重新提取记录，不写入原证据目录；其输出也不等同于执行完整游戏。

## 适用边界

本批确认普通显式身份切换的主动脱离归属，不穷尽特殊子类、运行时热更、异常竞争、全部导航后继或具体内容的重新接敌。Entity raw Setter、Enemy 的完整业务入口与浮空状态是不同层次，不能把其中一个分支的行为当作所有原始字段写入的共同副作用。项目 Change 的 no-op 与批量发布规则另行决定，不由原生字段组织直接推出。
