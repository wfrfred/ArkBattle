# 配置调查

用于查 JSON、数据表和 Prefab 的结构、取值、覆盖与引用。只查问题所需材料；需要确认消费逻辑或时序时，转[客户端实现调查](client-workflow.md)。

## 来源与范围

固定镜像提交或客户端资源版本，记录文件／Bundle 指纹及实际选择范围。标明完整源文件、筛选摘录、已解码资源和项目加工数据的区别；镜像不是官方文档。传输工具若重排 JSON，规范化哈希与原始字节哈希分别标明。

## JSON 与已解码 Prefab

从仓库根目录运行，输入可换成文件或目录：

```sh
skill=.agents/skills/arkbattle-native-research
work=.cache/native-research/configuration
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run "$skill/scripts/config.py" test/fixtures/arknights/level_act1autochess_01.json --out "$work/phase.json" select /branches/dragon/phases/0
uv run "$skill/scripts/config.py" test/fixtures/arknights --glob 'level_*.json' --out "$work/actions.json" select '/waves/*/fragments/*/actions/*' --where /count 2 --field /key
uv run "$skill/scripts/config.py" test/fixtures/arknights/level_act1autochess_h07_02.json --out "$work/counts.json" stats '/waves/*/fragments/*/actions/*' --by /key --sum /count
uv run "$skill/scripts/config.py" test/fixtures/arknights/prefab_enemy_9012_acloon.json --out "$work/field.json" find --key _alwaysCheckCurrentPoint
```

`config.py` 只需标准库；完整结果写入 `--out`，终端返回摘要。按问题选命令，无需逐项执行：

- `select` 用 JSON Pointer 摘录，支持 `*`／`**`，可按值筛选和投影字段。
- `find --key` 查字段名，`--value` 查字符串引用，`--equals` 查 JSON 值；只是定位，不自动解析引用。
- `stats --by` 统计选中节点的分组数量，`--sum` 汇总数值字段。动作数与出生数量等业务计数要明确选择。

`--out`／`--glob` 等全局参数放在子命令前。Pointer 用 `~0`／`~1` 转义；`--field` 和筛选字段用字面路径。`--where`／`--equals` 接收 JSON，字符串值需保留双引号，例如 `--where /actionType '"SPAWN"'`。需要标注上游来源时用 `--source-url`／`--revision`，脚本不会代为验证。

结果记录输入指纹、查询参数、原文路径及失败文件。零命中只说明本次范围未找到；显式 null、缺失和输入读取／JSON 解析失败分别报告。`complete` 仅表示扫描输入均成功，不表示材料覆盖完整资源或全部玩法。

## Bundle 与二进制 Prefab

沿配置实际引用找到资源包，先索引，再提取所需对象；`file_name`／`path_id` 取自本次 `assets.json`：

```sh
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
bundle="$game/Arknights_Data/StreamingAssets/AB/Windows/charpack/char_4191_tippi.ab"
uv run "$skill/scripts/assets.py" "$bundle" --out "$work/assets"
uv run "$skill/scripts/assets.py" "$bundle" --find 'Block' --out "$work/matches"
uv run "$skill/scripts/assets.py" "$bundle" --file "$file_name" --object "$path_id" --out "$work/object"
```

`assets.py` 依赖系统 `liblz4`，支持 UnityFS／SerializedFile v22、普通 LZ4 和 LZ4AK；`--find` 是 UTF-8 字节搜索。它提供对象索引、MonoScript 信息和原始字节，不自动恢复自定义字段或解析外部 PPtr。对象身份是 SerializedFile + PathID；跨文件还需按 PPtr 的文件引用追踪，不能仅匹配数字。

按实际序列化布局解码组件、行为节点、黑板和引用，必要时查 metadata；序列化偏移不能套用原生对象字段偏移。通用解析扩展共享工具，专用解码脚本随证据保存，解码后的 JSON 继续用 `config.py` 查询。

核对配置、实例覆盖及实际选用的资源，归档原文路径／对象身份、版本指纹和复跑命令。
