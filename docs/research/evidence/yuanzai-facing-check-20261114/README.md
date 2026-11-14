# 圆仔面向的定向核对

日期：2026-11-14。目的：检验独立 Facing、默认移动改向及内容规则能否表达圆仔。未修改 Core 或 Content。

- `sources.json`：PRTS 级别0的能力说明、来源和限定结论。
- `node-type.json`：当前客户端通用候选节点 `FaceToDirectionViaMoreTargets` 的字段和方法。
- `logical-node.json`：102443／102445 的完整逻辑区间，使用既有提取脚本展开多个 `.pdata` 片段。原始339字节的首片段不能代表完整 Execute。

原生文件版本与指纹由两个 JSON 的 provenance 保存。沿用本次已核对的客户端；未执行游戏、未核实 XLua 覆盖，也未证明圆仔实际绑定此节点。节点的四方向扫描不能直接用作圆仔的左右统计实现结论。特殊改向是否经过普通控制准入、控制结束后是否重发未生效的方向，仍未闭合。

复跑命令（仓库根目录，输出到独立缓存目录）：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py --out .cache/native-research/yuanzai-facing-recheck/type.json type Torappu.Battle.Action.Nodes/FaceToDirectionViaMoreTargets
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline docs/research/evidence/facing-semantics-20261113/extract.py --out .cache/native-research/yuanzai-facing-recheck/logical.json --body-index 102443 --body-index 102445 --search Backward --search disableSwitchFaceByMove
```

统一当前结论见 [案例35](../../cases/35-facing-and-turning-conditions.md#7-圆仔的表达能力核对)。通用操作或 Wiki 说明不是完整圆仔内容已经实现的证明。

已用 `replay.py --method 102443` 在独立目录复提1项方法，客户端指纹一致，unavailable=0；这只复核已记录的原生选择器，不补齐内容绑定或动态运行证据。
