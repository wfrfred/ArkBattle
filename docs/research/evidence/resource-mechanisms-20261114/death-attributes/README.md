# 最终结束、来源栈与属性范围原件

机制结论集中在[案例39](../../../cases/39-death-attribution-and-attribute-ranges.md)，四领域覆盖见[案例37](../../../cases/37-resource-mechanism-coverage.md)。本目录保存选择、原体、实际绑定及复跑结果，不修改产品语义。

## 来源与限定

- 本机 Windows x64，metadata v29；DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 安装路径及完整脚本／Bundle／对象指纹在各记录 provenance。Method index／VA仅适用于这个输入；方法正文按当前PE边界展开全部片段，虚调用另按metadata slot核对。
- 固定第三方镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的角色／模组表，逐原始字节SHA256与Git Blob SHA1复核。与安装资源分别记录版本。
- 实际绑定为锡人（复用damage原件）、嵯峨、阿米娅与信仰搅拌机X；Nasti／pirene的额外模板只保留为候选，没有冒充已闭合的MaxHP覆写正例。
- 未运行客户端、未验证活跃XLua。直接xref不覆盖全部间接／内联写入；完整相关调用体和实际Content链分别校验。PRTS为次级资料，冲突不被静默覆盖。

## 原件用途

| 文件 | 内容 |
| --- | --- |
| `inventory.json` | 类型／字段／方法定位及source写入调用者身份 |
| `context-bodies.json`、`context-discovery.json` | Context各栈、Guard复制／恢复、FinishMe／OnFinish及属性范围体 |
| `source-writers.json` | 20个source setter直接调用者完整体，加实际FinishMe覆盖／InstantKill |
| `attribution-boundaries.json`、`death-observers.json`、`kill-observer-context.json` | Buff来源／创建继承、来源与受害者通知、回收入口 |
| `mode-termination.json`、`withdraw.json` | GameMode终结政策、实际Character撤退／death-like reason、原因分类 |
| `termination-attributes.json`、`attribute-recomputation.json` | 强制设零／结束、属性覆写、求值范围、MaxHP同步及回复timer |
| `metadata.json` | 34项AttributeMeta、11项另列异常字段、FinishReason／AttributeType、虚slot及栈helper机器码 |
| `content.json`、`templates.json`、`static-inputs.json` | 实际选定组件／PPtr／脚本、完整事件程序、固定资料选择 |
| `prts-sources.json` | 已查社区页面、限定主题及冲突边界；不是页面全文 |
| `verification.json` | 独立重提结果比较，不覆盖历史原件 |

`withdraw.json`额外保留同组查询的CheckBuildable／CheckRespawnSelfBuildable方法，不据这些方法推导本页死亡规则。原件的选择范围大于结论使用范围，不删去不利或无关分支。

## 复跑

从仓库根目录执行。逻辑原体复提复用已有提取器，各记录的result.selection保存精确选择；输出到独立目录，不覆盖本目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --with capstone==5.0.7 python \
  docs/research/evidence/resource-mechanisms-20261114/death-attributes/reextract_native.py \
  --out .cache/native-research/resource-mechanisms-20261114/death-attributes/replay
uv run --offline docs/research/evidence/resource-mechanisms-20261114/death-attributes/extract_metadata.py \
  --out .cache/native-research/resource-mechanisms-20261114/death-attributes/replay/metadata.json
uv run --offline docs/research/evidence/resource-mechanisms-20261114/death-attributes/inventory.py \
  --xref-record docs/research/evidence/resource-mechanisms-20261114/death-attributes/context-bodies.json \
  --out .cache/native-research/resource-mechanisms-20261114/death-attributes/replay/inventory.json
python docs/research/evidence/resource-mechanisms-20261114/death-attributes/extract_content.py \
  --out .cache/native-research/resource-mechanisms-20261114/death-attributes/replay/content.json
python docs/research/evidence/resource-mechanisms-20261114/death-attributes/extract_templates.py \
  --out .cache/native-research/resource-mechanisms-20261114/death-attributes/replay/templates.json
python docs/research/evidence/resource-mechanisms-20261114/death-attributes/extract_static.py \
  --out .cache/native-research/resource-mechanisms-20261114/death-attributes/replay/static-inputs.json
```

native脚本固定capstone5.0.7；配置脚本复用已归档标准库Bundle解码器，不下载或运行游戏。静态表必须具有记录的原始字节，缺失时从记录的固定URL恢复后核对hash；不要用项目转换结果补造。

独立复查比较result；只有原体选择中的输出目录被忽略，方法字节、调用、字段、模板及组件值不忽略。全部通过后再运行共享archive.py整理清单。元数据保留reserved字段和未声明界限，不给缺省添加自造数值。
