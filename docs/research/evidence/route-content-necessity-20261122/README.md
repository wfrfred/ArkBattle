# 路线配置复查

2026-11-22。检查固定镜像的 MOVE 跨格偏移、初始即时指令、到达半径、导航策略和 E_NUM。机制结论见[案例 12](../../cases/12-navigation-native-algorithm.md#10-实际路线中的跨格-move)、[案例 13](../../cases/13-route-and-movement-timing.md)及[案例 14](../../cases/14-route-definition-fields.md)。

本批使用 ArknightsGameData 镜像固定提交 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 `zh_CN/gamedata/levels/obt` 和 `levels/activities` 两个目录。关卡文件、字段和样本哈希见 [result.json](result.json)。出怪指针来自主 Wave 和 Branch 的正数 SPAWN，按 `routeIndex` 取得 `routes`。这一关联没有模拟 Branch 的启用条件、被特殊程序改写的路线或隐藏组。

本批的项目对照基于 `7ba99d2`。在同一张原表地图和同一套 Navigation 实现上，只改变为目标格建场的输入，分别测试偏移后世界点重新量化，及原格建场后在末段加偏移。501 个不同跨格路点中，133 个样本的地图能由当前 Data 解析器直接读取，读到 8 个建议点不相同的样本。起点用前一个确定移动／出现目标，若没有则用出生格。结果限定为单变量配置探针，未执行原生客户端、模拟其平滑算法或证明实战的伤害、阻挡与限时机制出现差异。

从仓库根目录复跑，临时结果写到指定文件。

复跑脚本已适配新版 Navigation 并传入当前 Data 的地图解析选项；未提供专用地形控制器参数或地块部署 Prefab。当前解析成功数及比较结果可能与上述历史版本不同，原始记录不随脚本更新。

```sh
batch=docs/research/evidence/route-content-necessity-20261122
npm run build
python3 "$batch/scan.py" > /tmp/arkbattle-route-config-scan.json
node "$batch/compare-navigation.mjs" /tmp/arkbattle-route-config-scan.json
```
