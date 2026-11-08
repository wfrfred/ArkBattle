# 莱塔尼亚盟约召唤物：阻挡与移动

2026-11-09。核对卫戍协议·规程的 `enemy_9025_aclts`（一个小节）和 `enemy_9026_acltm`（一个乐部）。机制结论维护于[案例 32](../../cases/32-leithanien-summons-blocking-and-movement.md)。未修改 Core 实现，未运行游戏。

## 来源与材料

| 目录 | 内容与复跑入口 |
| --- | --- |
| [content](content/README.md) | 当前热更新召唤模板、实际 Enemy Prefab／MonoScript 引用、阵营索引与阻挡掩码、资格与半径常量 |
| [movement](movement/README.md) | 实际 Selector 枚举、Trace 消费、普通移动／攻击／阻挡作战状态和默认地块解释 |
| [data](data/README.md) | 已固定公共镜像的查询范围及当前 EnemyData 数值缺口，不把镜像未命中当作客户端没有配置 |

客户端 GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；Windows x64、metadata v29。热更新资源与原生程序集分别核对，具体 Bundle、manifest、SerializedFile、对象与外部引用指纹保存在各输出 provenance。

PRTS 社区资料入口为[卫戍协议·规程／PRTS 盟约记录](https://prts.wiki/w/卫戍协议·规程/PRTS盟约记录)，本次查阅日期 2026-11-09。它支持名称与盟约召唤条件，不作为原生阻挡、Selector 或运动时序的直接证据。

## 复查与限制

按各子目录 README 的专用脚本复跑，写入独立输出路径；同指纹的已有方法正文可以按选择器复提，不将既有摘录标为本次新反编译。必要指纹和读取位置均随结果保存。

```sh
python .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/leithanien-summons-20261109
```

本批没有解析当前加密 EnemyData，因此不报告最终阻挡容量、移动速度或关卡覆盖。没有验证执行中的 XLua、特殊强制位移或完整实战轨迹；不从字段存在推断实际发生双端阻挡，也不从模板存在推断任意场景都满足其触发资格。
