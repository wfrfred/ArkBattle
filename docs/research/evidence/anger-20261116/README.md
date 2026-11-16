# 狂躁的两套标准程序

结论集中在 [Case25 §10](../../cases/25-elemental-burst-recovery-timing.md#10-狂躁的两套程序与能力计数)，本批不决定架构或修改产品。

## 输入与范围

- 官方 Windows 静态客户端：GameAssembly SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29。
- 本机 Holder、镜匠 `char_4169_caledo` 及 `skchr_caledo_1/2` 完整组件与脚本引用，实际 Bundle／对象身份和哈希在 `content.json`。原生选择为 12 个完整方法和 6 个字段 owner；所有片段解码至下一 metadata 方法边界。
- 角色／技能表来自镜像 `Kengxxiao/ArknightsGameData` 固定提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`；BuffDB 使用单独固定提交 `bffe31bf66739842f99b457327066c695e2af389`。镜像与安装资源分别记录，不声称同一发布或实机加载。
- `content.json` 保留三份完整 ANGER BuffDB、三个标准模板、镜匠相关四个模板、26 个选定组件及具体角色／技能表项。镜匠 S1／S2给敌人施加狂躁、S2接收转损伤都有实际绑定；Touch 的关卡出生、攻击及比率覆盖复用 [既有原件](../resource-mechanisms-20261114/recovery-elemental/level-examples.json)。
- `native.json` 闭合 Ability Start／SpellOn 到 Buff 事件16／18、能力类型／忽略麻痹筛选；NoSourceDamage、BleedingDamagePerSec 与 HIT 消费复用 [flag-callers](../resource-mechanisms-20261114/damage/flag-callers.json) 和 [接收原件](../reception-stages-20261115/pipeline/native.json)，不再复制完整体。
- 社区说明与读取时间在 `prts-sources.json`。静态配置、普通 native 分支与社区说明分别使用；未运行游戏、未核实活跃 XLua，也未穷尽所有 Ability 派生与正例。有限选择中没有 `_ignorePalsyInterrupt=true`，不能推出该过滤无用。

## 复跑

从仓库根执行。共享提取器的确切 method／owner selectors保存在 `native.json.result.selection`；配置脚本重新读原 Bundle 和已固定镜像，不从历史结论生成结果。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
batch=docs/research/evidence/anger-20261116
work=.cache/native-research/anger-20261116/replay

python3 "$batch/extract_content.py" --out "$work/content.json" --raw-out "$work/raw"
python3 "$batch/verify.py" --out "$work/verification"
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
```

`verification.json` 对照独立重提的完整 native 片段、字段与配置结果；首次原件保留不覆盖。客户端热更新与浮点／FP逐帧结果不在这项静态等同性检查的保证内。
