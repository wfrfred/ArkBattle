# 元素爆发恢复与首次推进取证

取证日期：2026-11-02；项目基线 `635617b`；uv 0.12.24、Capstone 5.0.7。结论集中于[案例 25](../../cases/25-elemental-burst-recovery-timing.md)。本批保存 EP 耗尽、爆发同步启动、恢复更新与宿主调度的原生短链，不决定项目接口或调度政策。

## 输入与适用范围

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `Arknights_Data/il2cpp_data/Metadata/global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

metadata v29，image base `0x180000000`。只分析无对应 XLua delegate 覆盖时的普通静态 native 分支，没有运行游戏。方法按本次 metadata 重新定位；不能把本批 index／VA 套入不同指纹的客户端。

共享解析器为 `.agents/skills/arkbattle-native-research/scripts/native.py`，SHA-256 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`。该工具在本工作树中被忽略，项目提交号本身不能代替工具内容身份；复跑需要提供上述哈希对应的 skill 工具。JSON 的 `provenance` 保留输入、工具、注册表定位与提取环境，专用脚本和 lock 随本批保存。

| 脚本 | SHA-256 |
| --- | --- |
| `extract_ep.py` | `5fe88ba1aa3498c5c41cc9bd5fadaaca1055bf42bb598482df4feaa6eed07942` |
| `extract_schedule.py` | `928f06c9fe859049b20fbae68d95d119cc60e87b8141807682897a5ca61fd614` |

## 材料

| 文件 | 用途 |
| --- | --- |
| `ep-native.json` | 完整 EPController 字段及各方法的连续 `.pdata` 分段，包含触发、启动、推进、到期、显式缩短等方法；指令保留原地址、bytes、调用身份与解码边界。 |
| `ep-controller.json` | 当前 metadata 中 EPController 的实例字段、静态热更槽及方法签名。 |
| `schedule-native.json` | 全局／逐对象／Entity 更新、EP Modifier 与耗尽触发短链；方法正文、相关方法和必要 helper。 |
| `maxep-helper.json` | `OnTick` 调用的虚派发辅助函数；配合 slot 80 的 metadata 身份核实最大 EP 的读取。 |
| `prts-sources.json` | PRTS 固定页面、章节、查阅日期与无法回答的首帧问题。 |
| `extract_ep.py`、`.lock` | 从当前 metadata 定位 EPController 并导出完整连续原生区间。 |
| `extract_schedule.py`、`.lock` | 复读本批调度、Modifier 短链和指定 helper。 |
| `archive.json` | 本批材料哈希、来源与复查选择器索引。 |

`.pdata` 主体与区间外辅助调用的范围分别保存；已完整解码某个方法区间不等于穷尽全部间接调用、内容特化或热更。大型同址别名列表的省略保留计数，不能从共享地址任意指认单个方法。

`schedule-native.json` 中保留一处 `fullyDecoded=false`：`Entity.ApplyModifier` 的 `0x180721baa–0x180721bef` 异常／尾随区域仅解码到 `0x180721bee`，包含异常出口与尾随数据迹象，不参与本批核心时序结论。EPController 关键方法的各分段均完整解码；没有修改原始解码标记。

## 复跑

本次提取从仓库根目录执行以下命令；归档脚本与原执行脚本的内容相同：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .cache/native-research/elemental-timing-20261102/extract_ep.py \
    --out .cache/native-research/elemental-timing-20261102/controller
uv run --locked --offline .cache/native-research/elemental-timing-20261102/scheduling/extract_schedule.py \
    --helper 0x180005610 \
    --out .cache/native-research/elemental-timing-20261102/scheduling/schedule-native.json
```

从仓库根目录运行；`--game` 可指定相同指纹的另一安装目录。输出使用独立工作目录，不覆盖本批材料。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/elemental-timing-20261102/extract_ep.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/elemental-timing-replay/controller

uv run --locked --offline docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --helper 0x180005610 \
    --out .cache/native-research/elemental-timing-replay/schedule-native.json
```

`--offline` 适用于依赖已缓存的环境；首次获取锁定依赖时去掉该参数。EP 专用入口核对输入指纹；对调度输出同样先比对 `provenance.client`，再解释地址或分支。

控制器 metadata 与当前版本已绑定 helper 可通过共享工具复读：

```sh
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/elemental-timing-replay/ep-controller.json \
    type 'Torappu.Battle.Entity/EPController'

uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/elemental-timing-replay/maxep-helper.json \
    disasm-at 0x180005610
```

最后一个地址是本批 `OnTick` 指令中已绑定的直接调用目标；必须先确认相同输入指纹。另一版本应从新输出的调用指令重新定位，不能据此硬编码选择器。
