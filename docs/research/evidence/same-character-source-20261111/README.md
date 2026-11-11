# 卫戍同名副本的来源身份

核查日期：2026-11-11。补核多个相同角色是否取得同一 cardUid，以及该身份与 Buff 来源分组的关系。机制结论集中在 [Case 24 第十三节](../../cases/24-deployment-cost-and-supply.md#卫戍的同名副本)和 [Case 01 §9.6](../../cases/01-buff-installation-and-parent-scope.md#96-carduid-的生成与重部署保留)；不修改项目实现或规定分组 API。

## 输入与范围

本机 Windows x64 IL2CPP、metadata v29。方法按本次签名和调用定位，未执行游戏或验证 XLua 替代分支。

| 文件 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

| 目录 | 选择与证据范围 |
| --- | --- |
| [content](content/README.md) | 本地训练的购买、复制、_AddOwnedChess 和构造器，共 4 个方法；证明同 chessId 可创建不同 instId，不单独证明 cardUid。 |
| [native](native/README.md) | Squad 配置、get_charInst、棋子数据加载和 Blackboard 写入，共 7 个方法；接续既有 Converter 证据，核实逐棋子 UID 转换。 |

Converter 分配计数器、Card getter 和 Character 写入复用[来源身份批次](../card-source-identity-20261111/README.md)，不重复保存。子目录 JSON 记录来源路径、工具、字段、签名和代码范围；ASM 保存选中完整方法区间。

## 复查

子目录 README 提供专用脚本命令，输出到独立目录后比对 ASM、JSON result 和输入指纹。共享清单与选择器复查：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/same-character-source-20261111
uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/same-character-source-20261111 \
  --out .cache/native-research/same-character-source-20261111/shared-replay
```

共享复查不恢复热更新或运行时调用图；本地训练创建分支不能冒充线上服务端记录。本批不因此证明卫戍的所有自动重部署政策，也不把原生 cardUid 变成项目 Effect 的通用来源身份。

本批已在独立目录复跑两项专用提取：11 份 ASM、全部 JSON result、输入与提取脚本指纹一致，所有选中分段完整解码。共享选择器复查完成 11 个方法、11 个代码块和 10 个类型，没有不可复查项。
