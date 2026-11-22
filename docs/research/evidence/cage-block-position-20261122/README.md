# 迷狂牢笼的阻挡目标站位

2026-11-22 补核 [案例 22](../../cases/22-block-positioning-and-interruption.md)，使用指纹 `cf7956bf…` 的同一安装版 Windows 客户端。Prefab 对应酒神的 `token_10055_phatm2_mndclv`，组件为 `PropLikeStaticBlockToken`（PathID `6352044219529720151`），角色表 S1／S3 的 `overrideTokenKey` 链和组件原件见[实际内容绑定](../../cases/11-damage-apply-and-hp-application.md#L80)。[社区描述](https://prts.wiki/w/迷狂牢笼)给出 0.2 的站位范围。

| 环节 | 指令证据 |
| --- | --- |
| 按阻挡者覆盖位置 | 牢笼 `_SearchBlockee`（78605）在 `0x180afded2` 调用 `BlockManager.AddBlockee`。`0x180aee0f8` 先计算普通偏移，`0x180aee109` 随后调用 `IBlocker.BlockeeOffsetPosSet` 派发辅助函数。牢笼分支 `0x180aedb09` 跳到 `0x180afce20`。`0x180aee11a` 把实际返回偏移传给 `Enemy.RegisterBlocker`。 |
| 初始化阈值 | `PropLikeStaticBlockToken..cctor`（78610）在 `0x180afdf61` 读取 `0x1870afdc8` 的 double 0.2，转换为 FP 后在 `0x180afdf7e` 写入类型静态字段 +0x0，元数据为 `DIST_MAX`。 |
| 形成相对位置 | `BlockeeOffsetPosSet`（78606）读取敌人与牢笼的 `mapPosition`，在 `0x180afceed–0x180afcf03` 得到敌人相对牢笼的向量。向量长度不大于 `DIST_MAX` 时，`0x180afcf88` 返回原向量。 |
| 大于阈值 | `0x180afcfaf` 取原向量方向，普通 Battle RNG 分支在 `0x180afd116` 调 `Range(0, DIST_MAX)`，`0x180afd138–0x180afd13c` 将抽得长度乘到原方向。最终相对位置至多为 0.2。 |
| 写入阻挡位移目标 | `Enemy.RegisterBlocker`（77745）在 `0x180ac247c` 保存传入偏移，`0x180ac26ce–0x180ac26d4` 加上阻挡者位置，`0x180ac26e8` 调 `_MoveToBlockPosition`。因此覆盖值进入站位目标。 |

摘录来自固定客户端的原生回退分支。未运行客户端战斗或验证活跃 XLua，也未比较随机采样序列或 Tween 的逐帧轨迹。

从仓库根目录复跑并对照 [native.json](native.json)：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/cage-block-position-20261122/extract.py --out .cache/native-research/cage-block-position-replay/native.json
```
