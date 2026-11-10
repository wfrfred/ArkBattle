# 控制、多目标采样与地形材料

采集日期：2026-11-10。机制结论统一放在[案例 08](../../../cases/08-action-eligibility-and-interruption.md#7-晕眩的资格与中断范围2026-11-10-补核)、[案例 07](../../../cases/07-action-timing-and-animation.md#12-普通多目标近战的-atk-采样2026-11-10-补核)及[空间研究第 4、5 节](../../../03-space-units-and-mechanisms.md)。本目录只保存所选来源、提取范围和复跑入口。

## 来源与选择

- 本机 Windows x64 客户端：`GameAssembly.dll` 223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata v29、46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- [native.json](native.json)：44 个针对性方法，保留完整选定方法及 `.pdata` 后继分块、精确参数／虚槽、字段偏移和所需枚举。方法名由当前 metadata 重新定位；不套用旧客户端索引。`selection.names` 是完整选择清单，不是所有内容的入口穷举。
- [components.json](components.json)：幽灵鲨普通攻击、五种地形、沼泽／潮汐控制技能和三个实际 Trap 根层级，共 75 个 MonoBehaviour；全部 MonoScript PPtr 已解析。每项保留 Bundle／CAB／PathID、对象哈希、字段和层级，源文件指纹独立记录。
- [templates.json](templates.json)：由实际组件绑定的七个根模板起步，递归保留其嵌入的非 BuffDB 程序，共十个完整模板；未遗漏待解析的 BuffDB 引用。当前 holder SHA-256 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`。
- [configuration.json](configuration.json)：固定镜像 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f` 的五张关卡原始地块、相关预置项和七项 Character／Skill 配置；记录 JSON Pointer、实际地块引用位置、Git blob 与完整文件 SHA-256。Character／Skill 表沿用[已有来源核验](../../route-operations-20261107/data-source-verification.json)，本次再次检查完整文件哈希。
- [web-sources.json](web-sources.json)：PRTS 访问日期、原始页面链接与有限摘要；具体配置／调用不由通用术语说明替代。

已归档的同版 Buff `Reset`、`NewBuff` 及创建后启用链继续引用[零时长 Buff 材料](../../elemental-zero-duration-20261105/buff/native.json)，不重复整包转储。既有资格、时间和伤害研究另见案例 08、15、25、27、33。

## 复跑

在仓库根目录执行。客户端路径默认为本机安装位置，可用 `--game` 替换。JSON 镜像与两张完整表须先按上述修订下载到独立缓存；脚本不会将未经核验的数据当成同版材料。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/unit-audit-20261110/control-terrain/extract_native.py --out .cache/native-research/control-terrain-replay/native.json
uv run --locked --offline docs/research/evidence/unit-audit-20261110/control-terrain/extract_components.py --out .cache/native-research/control-terrain-replay
uv run --locked --offline docs/research/evidence/unit-audit-20261110/control-terrain/extract_templates.py --out .cache/native-research/control-terrain-replay/templates.json
uv run --locked --offline docs/research/evidence/unit-audit-20261110/control-terrain/extract_configuration.py --mirror .cache/native-research/checkpoint-nondefault-20261107/mirror-current --tables .cache/native-research/route-operations-20261107/data --out .cache/native-research/control-terrain-replay/configuration.json
```

只读解析与反汇编，没有执行客户端、实机战斗或 XLua；配置和 Prefab 是独立版本来源。hidden 预置存在不代表已被激活；本批没有继续穷举平台地图演变的启用路径、所有晕眩技能豁免、地形模式切换或特殊免疫。静态调用链推导和这些限度分别写在对应案例中。
