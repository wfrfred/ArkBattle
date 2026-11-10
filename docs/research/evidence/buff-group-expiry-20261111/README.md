# Buff 覆盖组身份与 STACK 到期

核查日期：2026-11-11。补齐覆盖组身份构造和到期处理两项原生架构缺口，复用已有合并／选胜研究。机制结论集中在 [Case 01 第 9 节](../../cases/01-buff-installation-and-parent-scope.md#9-2026-11-11-补核覆盖组身份与-stack-到期)，本批没有修改 Core、Content、Data 或架构契约。

## 输入

本机 Windows x64 IL2CPP、metadata v29；与 2026-11-10 补证相同指纹。没有运行客户端或验证 XLua／hotfix。

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |
| config/buff_template_holder.ab | 8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79 |

具体路径、大小、注册表、工具指纹及所选角色／敌人／技能 Bundle 的指纹在各子目录 provenance 内，镜像或社区资料不与安装资源混作同一来源。

## 材料与选择

| 目录 | 文件与范围 |
| --- | --- |
| [group](group/README.md) | 24 个方法：基础键、Buff.Reset、Character.cardUid、容器分组／迁移／清理，以及 CreateBuff 的来源读取。另有五个选中字符串／类型 usage 的专用解码。 |
| [expiry](expiry/README.md) | 24 个方法及 2 个 helper：OnTick、到期减层、属性刷新、结束扫描、组移除与下一帧池回收。池 helper 的跳转表数据单独排除。 |
| [content](content/README.md) | 完整遍历当前 9054 个 holder 模板，只归档指定模板与实际角色／技能组件。记录原始字段、资源引用、来源身份及证据等级；PRTS 固定版本仅作社区互证。 |

`.asm` 保存必要指令；`native.json` 保存方法身份、分段范围、字节哈希和解码完整性；`metadata.json` 保存相关字段和签名。直接 xrefs 是候选，非完整动态调用图。完整发现结果保留在 `.cache`，没有把模板存在等同运行激活。

## 复查

各子目录 README 给出本次真实提取命令。输出到独立目录后，对比 result 与 ASM；字符串／类型 usage 另用 group/decode_literals.py。读取源变化后必须重新定位，不能照搬旧方法索引、地址或 Bundle 对象身份。

归档与共享原生选择器复查：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/buff-group-expiry-20261111
uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/buff-group-expiry-20261111 \
  --out .cache/native-research/buff-group-expiry-20261111/shared-replay
```

共享 replay 重提原生／资源选择器，不恢复专用节点解码、xrefs 或 helper 的人工代码边界；这些部分用各目录的脚本复跑。来源字段、组键及自然到期的普通分支已核实；全部热更新、特化 Buff 与具体玩法的逐帧结果未穷尽。

本批已在独立目录复跑两项原生提取、字面量解码和最终配置提取：50 份 ASM、相关 result 与来源指纹一致。共享 replay 另外完成 42 个独立方法、44 个块、11 个类型及 7 个 Bundle 的选择器复查，unavailable 为零；该结果不代表游戏运行验证。
