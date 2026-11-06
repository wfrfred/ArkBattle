# 奥术法阵与链术师跳跃沉默

取证日期：2026-11-02；整理时项目提交 `2f0f3dc311e2d84d9f3224d66f17b42d791c039d`。结论见[案例 26](../../cases/26-arcane-circle-chain-silence.md)。本批只调查，不修改模拟实现。

## 输入和范围

- 本机 Windows x64 `GameAssembly.dll`：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata v29：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；image base `0x180000000`。共享解析器路径、哈希、Python 与 Capstone 信息在 native-evidence.json。
- 本机 `charpack/char_306_leizi.ab`、`battle/prefabs/[uc]projectiles.ab`、`battle/prefabs/[uc]globalbuffs.ab` 与 `config/buff_template_holder.ab`，指纹见 assets.json、templates.json。
- 装备赛季绑定及沉默基础配置来自第三方提取镜像 `Kengxxiao/ArknightsGameData` 的固定历史提交 `86b6e749d3384dd0c7b825abbb795845dc6df933`。不是将在线镜像当成本机资源；完整源文件大小和 SHA-256 在 season-bindings.json。当前 master 的旧赛季数据已被清空，故明确取历史提交。
- 未运行游戏，未验证 XLua 热更新覆盖。原生方法名和字段均从本次 metadata 重新定位；不套用旧客户端索引。

## 材料

- native.py／锁文件：复用 skill 的 Native 解析器，按方法名提取 17 个方法以及相关类型、字段、继承、虚方法 slot；连续收集方法入口至下一已知方法入口间的 pdata 分段。另按 _HitTargets 内槽位 18 的调用位置提取虚派发 helper。区间外尾调用通过单独选取的下游方法核对，不把 fullyDecoded 当成全部调用链完成证明。
- native-evidence.json：上述原生指令与定位。保留原始 VA、字节哈希和间接调用，不将共享地址别名任意认定为实际执行者。
- assets.py／assets.json：复用共享 UnityFS／SerializedFile 读取及案例 23 的 type-tree 读取器，对每个所选组件完整走 tree，并断言精确消费原始长度。保留实际字段名、PPtr、组件 PathID 与对象哈希；common:161／814／928 分别按 float／有符号 64 位／无符号字节读取，其他未知基础类型保留原始字节。部分 common 字段名仍保留偏移编号。没有把跨文件 MonoScript PPtr 仅按 PathID 当成本地对象；链式组件通过字段布局与 native 类型交叉核对。
- templates.py／templates.json：从完整 holder 解码中仅保留 silence_attachment；验证完整 holder 长度，保存条目偏移、哈希和真实事件／Action 配置。
- project-season.py／season-bindings.json：从固定镜像提交投影两个装备效果、Rune 绑定以及 silence Buff。
- target-switch.py／target-switch.json：利用本批实际提取的字段 index 和 switch 指令，解码 MODIFIER_TARGET=4，读取跳表确认其分支尾调用 Modifier.get_target。
- verify.py：校验保留材料之间的装备绑定、模板、事件、目标选择和继承关系，不模拟运行游戏。GetActionTarget 的 pdata 区间末尾含 12 项跳表，不能把它当连续机器指令；Entity.ApplyModifier 一个尾段还剩一字节零填充。工具保留这两处 fullyDecoded=false，验证脚本单独核对数据区／填充，不声称全部区间均为代码。

## 从仓库根目录复现

```sh
batch=docs/research/evidence/arcane-chain-silence-20261102
work=.cache/native-research/arcane-chain-replay
mkdir -p "$work"
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked "$batch/native.py" --out "$work/native.json"
python "$batch/assets.py" --out "$work/assets.json"
python "$batch/templates.py" --out "$work/templates.json"
python "$batch/target-switch.py" --native "$work/native.json" --out "$work/target-switch.json"
curl --fail --location 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/86b6e749d3384dd0c7b825abbb795845dc6df933/zh_CN/gamedata/excel/activity_table.json' --output "$work/activity.json"
curl --fail --location 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/86b6e749d3384dd0c7b825abbb795845dc6df933/zh_CN/gamedata/buff_table.json' --output "$work/buff.json"
python "$batch/project-season.py" --activity "$work/activity.json" --buff "$work/buff.json" --out "$work/season-bindings.json"
python "$batch/verify.py"
```

Native 默认本机安装路径；可加 --game。assets.py 和 templates.py 同样支持 --game。Capstone 5.0.7 由 uv 锁定；离线命令要求已有依赖缓存。资源读取使用系统 liblz4，不安装到项目 npm 依赖。

## 关键定位

- 奥术法阵效果 `eff_acarm048`／`eff_acgarm048`：`env_gbuff_new_with_verify`，黑板 key=`silence_attachment`、silence=5。
- 本机全局 Buff：`CAB-5190f775f1046bf06a9a8584da742e20`，组件 `-4504444553839901735`，内置 Buff 的 templateKey=`silence_attachment`。
- 模板：`CAB-7983df61b3ae63c96fb4e076fc3d80af`，holder `6070581171229484677`，条目偏移 `7843452`；事件 11，CreateBuff，buffKey=`silence`，loadFromDB=true，owner=`MODIFIER_TARGET`。
- Buff.OnOutputDamage：66154，`0x1806d36a0`；`0x1806d3708/0x1806d3729` 使用事件 11。
- Entity.ApplyModifier：67665，`0x1807211a0`；`0x180721792` 检查 isDamage，`0x180721819` 调用来源 BuffContainer.OnOutputDamage，后者经 `0x1806c25df` 调用各 Buff 的 OnOutputDamage。
- GetActionTarget：97346，`0x18107acb0`；MODIFIER_TARGET=4 的跳表目的地 `0x18107ad61`，尾跳 `0x18107ad86` 指向 Modifier.get_target。
- 惊蛰两种 Attack 的 projectileKey 为 projectile_leizi／projectile_leizi_s2；对应组件具有 ChainLightningHitBehaviour 字段组合，跳跃倍率分别为约 0.85／1.0。
- ChainLightningHitBehaviour._HitTargets：88075，`0x180daac60`；循环在 `0x180dab054` 读取第 i 个目标，以槽位 18 在 `0x180dab067` 调用 DealHitTarget，再继续下一个目标。SelectorHitBehaviour.DealHitTarget 的 slot=18，正常路径到 Projectile.DealHitTarget。
- 后续经 Projectile.OnHitTarget、ActionController.OnHitTarget／_RunActions；当前 target 进入上下文，伤害节点进入 Entity.ApplyModifier。未把链动画本身当作伤害证据。

零伤害、免疫、死亡先后等额外边界不由本批外推。
