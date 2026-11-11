# 来源分组简化的实际内容影响

核查日期：2026-11-12。评估以 Card 身份、无 Card Unit 身份和固定空来源身份区分独立组，是否改变真实内容的伤害、治疗、计数、叠层或竞争。结论集中在 [Case 01 §9.9](../../cases/01-buff-installation-and-parent-scope.md#99-分组简化的实际内容影响)。该简化同日确认为 [Effect 来源分组](../../../architecture/effect.md#来源分组)项目契约；Core 实现及具体接口尚未接入。

## 输入与范围

本机 Windows x64 IL2CPP、metadata v29。GameAssembly.dll SHA-256 为 cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff，metadata 为 e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5。资源包各有独立指纹，不冒充镜像与客户端同版或运行游戏观测；XLua 替代未核实。

| 目录 | 选择与用途 |
| --- | --- |
| [content](content/README.md) | 9054 模板中的来源独立描述清单；38 个敌人 Prefab 包的直接描述扫描；vampir 与次生预案标记的实际绑定、来源和枚举。 |
| [character](character/README.md) | 帕拉斯 S3 模式 Aura，浊蒂本体／海嗣的治疗描述，以及海嗣向宿主转发 source 的两个方法。 |
| [nullable](nullable/README.md) | 标准 PassiveBuffAbility 的附着、父 Buff source=self 与清理操作；确认妮芙实际来源，限制空来源差异推断。 |

组键的原生构造与接纳算法复用 [buff-group-expiry](../buff-group-expiry-20261111/README.md)；Card 数据身份与普通重部署复用 [card-source-identity](../card-source-identity-20261111/README.md)；无 Card 预放置干员复用 [predefined-source](../predefined-source-20261112/README.md)。不重复归档这些已闭合正文。

## 复查与限制

各子目录 README 提供专用复跑命令。共享清单和原生选择器复查：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/independent-group-impact-20261112
uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/independent-group-impact-20261112 \
  --out .cache/native-research/independent-group-impact-20261112/shared-replay
```

共享 replay 不恢复资源专用解码或完整 Prefab 扫描，相关内容由各提取脚本复查。零命中只覆盖实际扫描范围；未将模板名、配置存在或普通弹道可失去来源推导成已发生的分组差异。只有实际引用、来源和消费政策闭合的机制才进入结果对照。

三项专用提取已独立复跑：七份 JSON result、七份 ASM 及输入／脚本指纹一致，选中代码分段完整解码。共享选择器复查完成九个方法、六个类型和四十四个资源包，无不可复查项；完整资源解码与描述扫描仍由专用脚本复查。
