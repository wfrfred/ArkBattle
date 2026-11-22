# 卫戍开场实际部署的入场效果派发

2026-11-22 核对安装版 Windows 客户端的实际部署与出生通知。[native.json](native.json) 保留本批原生方法和 DLL／metadata 指纹。开场入口、费用与库存分支见[开场部署调用链](../stronghold-opening-deploy-20261122/README.md)。

| 步骤 | 原生静态指令 |
| --- | --- |
| 开场棋子实际落地 | `_DoPreSpawn #80989` 调用 `_TryDeployChessInst #80930`，走 Card 生成。`Character.LocateOnTile #77255` 先登记地块，在 `0x180aa10d5` 和 `0x180aa10dc` 写入本次手动／免费标记，随后在 `0x180aa1108` 调用出生虚槽。普通分支没有根据免费标记跳过该调用。 |
| 生效时点 | `Character.Born #77242` 在 `0x180a9ce37` 进入 `BObject.Born #66006`。`Character.OnBorn #77334` 在 `0x180aa2ddc` 调用 `Unit.OnBorn #79022`。后者先在 `0x180b18992` 调用 `Entity.OnBorn #67647`，再于 `0x180b189b5` 登记 Unit，最后于 `0x180b18c22` 进入效果容器的 `OnOwnerPostBorn`。 |
| 出生效果派发 | `Entity.OnBorn` 在 `0x1807292c3` 调用 `BuffContainer.OnOwnerBorn #66364`。该容器在 `0x1806c37d0–0x1806c37e2` 跳过已经结束或停用的效果，执行其余效果的 `Buff.OnOwnerBorn #66131`。`#66131` 检查效果是否具有事件 `0x0c` 的程序，在 `0x1806d3df8` 执行。`Buff._IsActionValid #66091` 的默认分支检查该效果自身对应的程序槽。 |

已核对的普通免费生成分支保留出生效果派发。是否初始化或启用某个效果、效果是否接收该阶段及其业务资格，需沿具体资源判断。同日[热更登记镜像](../stronghold-opening-hotfix-20261122/README.md)未列出对上述出生方法的直接替换。镜像与本机 Windows 资源标识不同，本批没有实战回放或验证运行中的所有替换。

从仓库根目录复跑。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out /tmp/arkbattle-stronghold-born-dispatch.json \
  disasm 77255 77242 66006 77334 79022 67647 66364 66131 66091
```
