# 目标前置与来源输出的顺序核对

研究日期：2026-11-03；项目与工具基线 `d10f407`。结论见[案例28第6节](../../cases/28-damage-hooks-and-event-granularity.md#6-目标前置与来源输出能否交换)：有限查找未确认正常可达的实际反例，不证明全游戏的任意程序可以交换，也不修改项目接口或政策。

## 材料与范围

- `native-targeting.json`：四个必要方法的完整普通 native 分段、token、签名和 slot，核对羽毛笔与禁闭所的候选资格；不重提取伤害主链。
- `extract_hit_range.py`、`.lock`：使用 skill 的 Native 读取与反汇编；Capstone 固定5.0.7，支持 `--game/--out/--method`。
- `crow/`：Character、S2模式、S2 Attack 与实际 Selector四个小对象及配置投影。
- `prison/`：禁闭所本体与挂载范围检查 Buff 的 Ability两个小对象及配置投影；不把母 Boss Selector 中出现的目标字符串当成装置本体。
- `templates/decoded-content.json`：仅保留羽毛笔S2、禁闭所范围门、心烛保底候选与蒂比S2触发的四个模板。
- `prts-sources.json`：社区资料、章节、查阅日期与支持边界。
- `archive.json`：本批材料、指纹与选择器清单。

内容投影复用已归档的 `healing-settlement-20261103/content/extract_content.py` 和其类型树依赖。该旧提取器 provenance 中的 scope 文本沿用其医师任务说明，不是本批研究范围；此处实际 bundle、SerializedFile、PathID 和源哈希界定的是羽毛笔、禁闭所与上述模板。没有因此声称本批对象属于医师。

来源输出／目标前置的实际顺序与取消门复用 `attack-addon-order-20261102/hp/native-hp.json` 的 ApplyModifier67665；浮空信件计数 Buff 的不可沉默配置复用 `ep-modifier-events-20261103/content/agpack-prefab.json`、`agpack-templates.json`。不重复归档这些主体，也不依赖未提交的奥术法阵调查才能成立。

## 输入与锚点

DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；Windows x64、metadata v29。具体文件大小、路径、工具与专用脚本指纹随 JSON 保存。

禁闭所：`pkgrps/btl_pfb_tokens_4.ab`、SerializedFile `CAB-425a845ff37dbe17e203e6b341c4f664`，本体 `-8720332516268970448`，Ability `-664377713333506512`。羽毛笔：`charpack/char_421_crow.ab`、SerializedFile `CAB-02047c32aaf8d32a5697a6b6c7b09e5e`，S2模式 `-3069682105502667693` → Attack `2831199944281353299` → Selector `-164417716366349229`。

TargetSelector.ValidateTarget76395 在 `0x180a41836` 调 get_ignoreHitRange；未豁免时，在 `0x180a41858` 取来源格，在 `0x180a4195f` 调目标 slot135的 IsInHitRange。Trap.IsInHitRange78848 同为 slot135，最终在 `0x180b07419` 查询实际来源格。普通范围外输入因此在结算前已经被排除。

只读模板与指令分析不等于运行游戏。没有穷尽所有特化选择、强行指定目标、动态空间变化或 XLua，也没有借未闭合组合决定项目必须增加阶段 Hook。

## 复跑

从仓库根目录执行；需要上述指纹客户端和已归档解析器。依赖未缓存时去掉 `--offline`。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
batch=docs/research/evidence/damage-output-order-20261103
decoder=docs/research/evidence/healing-settlement-20261103/content/extract_content.py
work=.cache/native-research/damage-output-order-replay
uv run --locked --offline "$batch/extract_hit_range.py" --game "$game" --out "$work/native-targeting.json" \
    --method 78848 --method 67720 --method 75508 --method 76395
uv run --offline "$decoder" --game "$game" --out "$work/crow" --bundle charpack/char_421_crow.ab \
    --object 8803867177890016339 --object -3069682105502667693 \
    --object 2831199944281353299 --object -164417716366349229
uv run --offline "$decoder" --game "$game" --out "$work/prison" --bundle pkgrps/btl_pfb_tokens_4.ab \
    --object -8720332516268970448 --object -664377713333506512
uv run --offline "$decoder" --game "$game" --out "$work/templates" --bundle config/buff_template_holder.ab \
    --template crow_s_2 --template 'ubprison_p[check_range]' \
    --template 'entlec_t[ensure_dmg]' --template 'tippi_s_2[trigger]'
```

已重新执行选定内容提取和四个原生方法的提取；结果分别与侦察材料中对应对象／方法一致。未新增或运行项目测试。
