# 无 Card 预放置干员的来源身份

核查日期：2026-11-12。核实普通预放置干员是否必须关联 Card，以及没有 Card 时 Character.cardUid 从哪里取得。机制结论集中在 [Case 01 §9.8](../../cases/01-buff-installation-and-parent-scope.md#98-无-card-的预放置干员)和 [Case 24](../../cases/24-deployment-cost-and-supply.md#无-card-的预放置干员)。不修改 Core 或设计新的身份协议。

## 输入与选择

| 材料 | 范围与版本 |
| --- | --- |
| [content](content/README.md) | 固定镜像提交 bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d 的 level_main_08-09，保留预放迷迭香和普通／困难预置手卡数组三个 Pointer。配置不单独证明客户端没有隐藏卡。 |
| [native](native/README.md) | 普通预置实例加载、创建、预处理选择、BuildAsPredefined 和独立手卡注入；保留八个方法与必要字段。 |

本机客户端为 Windows x64 IL2CPP、metadata v29：GameAssembly.dll SHA-256 为 cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff，metadata 为 e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5。镜像与客户端分别固定来源，不冒充相同发布版本或游戏运行观测；XLua 替代未核实。

角色数据转换分配 uniqueId、ConvertToCharacterData 的生成开关及 _BuildAtInternal 的 cardUid 写入复用 [card-source-identity](../card-source-identity-20261111/README.md)。本批补其预置调用者，不重复保存已闭合正文。三处 switch 表记录实际 codeEnd 和排除区间，不将数据解码为指令。

## 复查与限制

各子目录 README 提供专用脚本命令，输出到独立目录后比较 result、ASM 与输入指纹。共享清单及原生选择器复查：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/predefined-source-20261112
uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/predefined-source-20261112 \
  --out .cache/native-research/predefined-source-20261112/shared-replay
```

共享 replay 不恢复专用代码截止位置或镜像配置筛选；父关卡配置由 content 脚本从固定 Git blob 复查。仅确认普通预置正例和静态调用链，不扩推全部预处理玩法、特殊运行时创建或预置重复出现政策。BuildAsPredefined 不接收 Card，但“无对应 Card”的结论还依赖本批核实的独立卡牌注入与实际创建路径，不能只由签名推定。

本批已独立复跑两项专用提取：配置摘录、八份 ASM、全部 result 及输入／脚本指纹一致，选中代码分段完整解码。共享选择器复查完成十二个方法，无不可复查项；代码表边界仍以专用脚本为准。
