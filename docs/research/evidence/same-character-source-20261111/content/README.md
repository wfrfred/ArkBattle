# 卫戍本地训练的棋子实例创建

来源为 2026-11-11 本机客户端，完整指纹见 `metadata.json`：

- `GameAssembly.dll` SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`
- `global-metadata.dat` SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`

选择范围只有 `AutoChessDataBridgeLocalPlayer` 的购买、复制、添加棋子及构造器，以及 `CharChess` 的字段布局。各 `.asm` 从方法入口提取至下一托管方法地址，包含相邻 `.pdata` 片段；方法名与范围见 `native.json`。

核对位置：

- `ReqBuyChess`：`0x180b75c01–0x180b75c0f` 将商店条目的 `chessId` 交给 `_AddOwnedChess`。
- `_CopyChess`：`0x180b7892c–0x180b7893a` 将既有 `ChessInst.chessId` 交给 `_AddOwnedChess`。
- `_AddOwnedChess`：`0x180b77c73–0x180b77c7b` 取得并递增 `m_generateId`；`0x180b77e98–0x180b77eb1` 创建 `CharChess`，分别写入实例 `instId` 和传入的 `chessId`。`0x180b77f4a–0x180b77fc7` 在创建后另行统计相同 `chessId` 并检查合成条件。
- 构造器：`0x180b7ed01` 将 `m_generateId` 初始化为 10000。

这些是未被 XLua 替换时的本地训练分支，不是线上服务器记录，也没有运行游戏验证。购买与复制路径支持相同 `chessId` 对应不同棋子 `instId`；它们本身不能证明 `Character.cardUid` 是否相同，后者须沿独立的战斗数据转换路径核实。

复跑到独立目录：

```bash
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/same-character-source-20261111/content/extract.py \
  --out .cache/native-research/same-character-source-20261111/content/replay
```

本批未解密缓存中的 AutoChess Lua 热更新；二进制 `.lua.raw` 无文本命中不能作为不存在替换路径的证据。
