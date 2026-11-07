# alwaysCheckCurrentPoint 的配置与执行政策

2026-11-08。核实设为 true 的实际 Enemy，以及同一单位创建或复用 Cursor 时是否保持该政策。机制结论集中在[案例 13 第 4 节](../../cases/13-route-and-movement-timing.md#4-普通-move-路点不可达时)，不确定 ArkBattle 字段归属或修改 Core。

## 来源与范围

- 本机 Windows x64 客户端、IL2CPP metadata v29。GameAssembly.dll SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。所用原生方法复用[路线创建](../route-creation-20261107/README.md)与[路线操作](../route-operations-20261107/README.md)的原件；具体参数选择与引用见 runtime。
- 配置镜像固定修订为 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`。客户端资源、镜像数据与社区说明分别记录来源，不假定同一次构建。
- 本轮扫描 38 个 `battle/enm_pfb_*.ab` 与 7 个 `pkgrps/btl_pfb_tokens_*.ab`。45 包均成功读取；已识别的 2,206 个 Enemy 组件中，true 为 3、false 为 2,203，字段无缺失。完整 Bundle、SerializedFile、PathID、脚本绑定、对象指纹及扫描限制保存在 config。

## 材料

| 目录 | 内容 |
| --- | --- |
| [config/](config/) | 全部所选 Prefab 包的字段扫描、Enemy 身份与三项 true 配置 |
| [content/](content/) | 三项 true 对应的 EnemyData、实际主 Wave 出生与 MOVE 路线正例，及社区核对 |
| [runtime/](runtime/) | Enemy 初始化、同 Cursor 路线重绑与重建、Fear／Attract 和改变寻路方式的新 Cursor 参数；实际内容交叉与限制 |

三个 true 配置是 `enemy_10163_mnctur`（帕拉杜利斯）、`enemy_10163_mnctur_2`（神勇的帕拉杜利斯）和 `enemy_2137_shsdgo`（猎犬proto）。它们都有普通战斗关卡的直接出生引用，不仅是未启用的 Prefab 模板。

猎犬proto与妮芙 S2 的恐惧施加链可形成主 Cursor 为 true、临时 Cursor 为 false 的静态可执行组合。它证明同一单位的执行实例可以采用不同政策，但没有证明实际不可达时的走位差异。三个 true 对象主动调用 ChangePathMotionMode 的内容正例仍未闭合，不能用临时控制的证据代替。

## 复跑与限制

各子目录保存专用脚本、输入指纹、查询参数和复跑说明。仓库根目录执行：

```sh
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/always-check-point-20261108
```

本轮是配置与静态调用链调查，没有执行客户端。含 MOVE 的关卡证明该字段有实际消费场景，不证明该场景已经出现不可达、绕路或不同走位。没有找到某种交叉时，仅说明列明的选择范围内未闭合；不证明在线 XLua、其他 Prefab 包或运行时生成路线均不存在。普通路线重绑与新建 Cursor 的差异不能按方法名称互相代替。
