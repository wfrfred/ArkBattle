# 热情导游：终点覆盖的标记来源

2026-11-07。补齐 `enemy_flgshp[end_point]` 的 `flgshp_tile_mark > 0` 条件来源，区分模板存在、资源装配与可执行的静态链；不改变 Core API。完整路线操作结论由父批次的案例维护。

## 来源与材料

- Windows x64 客户端、metadata v29。`endpoint-native.json` provenance 记录 DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 资源为当前安装的 `config/buff_template_holder.ab`、`battle/enm_pfb_35.ab` 与外部脚本包 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`。每个 Bundle 指纹、SerializedFile、PathID、原对象 SHA-256、MonoScript 外部 PPtr 解析写入 `endpoint-positive.json`，不靠相同数字 PathID 猜匹配。
- 关卡与 EnemyData 来自 `Kengxxiao/ArknightsGameData` 固定提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。提取器核对两个原始 JSON 的固定 SHA-256，不以本地路径代替版本。

`endpoint-positive.json` 包含：

1. 完整 Holder 按字面键 `flgshp_tile_mark` 搜索到的三项模板：`enemy_flgshp_allow[check]`、`enemy_flgshp_mark`、`enemy_flgshp[end_point]`。保留完整事件程序与所有前置条件。
2. `enemy_17002_flgshp` 下 16 个相关组件，包括 common PassiveBuffAbility、Focus 的 EnemySkill／SelectorTrigger／SelfSelector、BuffDuringCastingFixed、ExtraAbilities、TileSelect／TileSelector／GlobalRange，以及 ChangeRouteAura wrapper／GlobalAuraAbility／TargetValidator。组件 `enabled`、技能和选择器引用均保留。
3. `act1dp_sub-02` 的普通主 Wave SPAWN、实际 Route、关卡 EnemyDbRef、数据库完整敌人项与四个 LOWLAND `tile_end` 定义。地块出现位置标为 JSON 数组索引，未将数组行号冒充原生世界坐标。

`endpoint-native.json` 保存 8 个相关类型和 13 个选择器的完整连续 `.pdata` 片段：标记读写、选中地块写入黑板、显式触发 Ability、BuffDuringCastingFixed 施放开始／结束，以及 TileSelector／Options 的实际消费。FilterType 与 TileSortType 的值从本版 metadata 压缩默认值解码，原编码字节和位置保留；不把四字节直读当作合法 enum 值。`_DoFilter` 等方法尾部有内联跳转表，解码标记按原样保留，未将表数据当作额外分支行为。

## 复跑

仓库根目录：

```sh
python3 docs/research/evidence/route-operations-20261107/endpoint/extract_endpoint.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --levels .cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels \
  --out .cache/native-research/route-operations-20261107/endpoint-replay

UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/route-operations-20261107/endpoint/extract_native.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-20261107/endpoint-native-replay
```

## 证据边界

这里闭合的是普通静态程序可满足其条件的链：同一导游的施放 Buff 是标记写入者，先写入 mark／row／col，再触发终点覆盖光环。未运行游戏，也未声称任意受控、沉默、死亡、已有其他导游标记等状态下都必然施放。没有穷举全部 TileSelector 特殊分支或活跃 XLua；所选 JSON 的完整性不等于全内容覆盖。
