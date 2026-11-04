# 有效攻速变更与攻击冷却刷新

取证日期：2026-11-05；项目基线 `55459c2`。本批核对 Modifier 增删、属性缓存失效通知、当前攻击周期换算及普通计时推进的先后。结论集中于[案例 07 的补核小节](../../cases/07-action-timing-and-animation.md#2026-11-05-补核属性变更时同步调整冷却)。没有运行官方战斗、核实活跃 XLua 或修改项目实现、测试。

## 输入与来源

本机官方 Windows 客户端安装目录：`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| GameAssembly.dll | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

metadata version 29，Windows x64 PE image base 为 `0x180000000`。地址与索引只适用于以上指纹。

提取入口复用仓库 `55459c2` 的 native-research 工具；`native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`。Python 与 Capstone 版本、方法签名、注册表定位和实际文件指纹保存在各输出的 `provenance` 中；脚本及依赖锁随本批保留。

[PRTS 正式攻速公式页](https://prts.wiki/w/游戏数据基础#攻速公式) 是社区机制资料，不是官方说明。2026-11-05 读取普通页时，页脚版本为 `oldid=447894`；直接访问固定版本链接失败，此边界记于 [sources.json](prts/sources.json)。页面给出公式，没有规定属性通知、当前冷却接续或前后摇更新时点。

动画、开始时缓存的动作预算及固定等待沿用 [2026-10-14 批次](../action-timing-20261014/README.md)，不复制旧材料，也不把其旧客户端地址混入当前调用链。本批重新核对的是属性变更到普通冷却调整的路径。

## 文件用途

| 文件 | 内容 |
| --- | --- |
| [dirty/extract.py](dirty/extract.py)／[锁文件](dirty/extract.py.lock) | 校验客户端指纹，按当前类型／方法名提取必要方法、字段、连续分段和 switch 表。 |
| [dirty/metadata.json](dirty/metadata.json) | Attributes、Entity、Ability 与 AbstractAnimatedAbility 的方法签名、字段和 virtual slot。 |
| [dirty/native.json](dirty/native.json) | Modifier 增删、标脏、缓存读取／计算、Entity 登记与撤销通知、OnAttributeDirty 和 OnAttackTimeChanged 的指令。 |
| [dirty/switch.json](dirty/switch.json) | Entity 属性分支的原始表字节与按 image base 解出的目标。 |
| [dirty/findings.json](dirty/findings.json) | 当前版本的直接锚点、调用链解释和未核实范围。 |
| [timer/metadata.json](timer/metadata.json) | 当前 PeriodicTimer 的字段、方法与签名。 |
| [timer/native.json](timer/native.json) | 进度读取、两类周期换算和两个 Update 重载的指令。 |
| [prts/sources.json](prts/sources.json) | 社区公式来源、读取日期、版本和未覆盖的问题。 |
| [archive.json](archive.json) | 本批材料哈希与可重提取选择器。 |

当前关键选择器：

- Attributes：65240／65241 增删 Modifier，65243 GetValue，65257／65258 标脏，65262 计算失效缓存。
- Entity：67624 Init 登记属性回调，67646 OnReset 撤销；67699 OnAttributeDirty 为 virtual slot 126。
- Ability／AbstractAnimatedAbility：64051／93883 的 OnAttackTimeChanged 均为 virtual slot 60。
- PeriodicTimer：26420 progress，26425 ResetButKeepPastTime，26426 ResetButKeepProgress，26430／26431 Update。

## 从独立目录复跑

从仓库根目录执行。先运行指纹校验的专用入口；不匹配时停止，不能继续套用本批数字选择器。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"

uv run --locked --offline \
  docs/research/evidence/attack-speed-timing-20261105/dirty/extract.py \
  --out .cache/native-research/attack-speed-replay/dirty

uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/attack-speed-replay/timer/metadata.json \
  type Torappu.PeriodicTimer

uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/attack-speed-replay/timer/native.json \
  disasm 26420 26425 26426 26430 26431
```

两个入口均接受 `--game` 指定另一处同指纹安装目录。`--offline` 使用已缓存的锁定依赖；首次准备环境时可去掉它，由 uv 按脚本锁获取依赖。专用脚本的 `.asm` 是便于阅读的派生输出，归档保留包含相同指令及定位信息的 JSON 即可。

## 结论边界

同步通知与惰性数值缓存分别由直接指令支持；virtual slot 根据当前 metadata 与调用偏移核对。这里不证明任意 Battle 事实变化都会使属性失效，也不穷尽全部特殊 Ability、Buff 动态参数或运行时热更。项目是否允许任意 Battle 查询式 Contribution、是否每 Tick 主动刷新属于另外的接口决策，不能由这份静态调用链替用户决定。
