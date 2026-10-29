# 蒂比空中阻挡：精选证据

2026-10-29，本机对象为 `char_4191_tippi`。仅补查角色资源与相关模板，复用已有 Blocking 原生取证；没有运行客户端、修改实现或审计活跃 XLua。

- [selected-assets.json](selected-assets.json)：角色初始字段、Default／S1 与 S2 起降模式的必要引用、飞行与地面 Buff、图形高度节点。保留资源 SHA、CAB、PathID 和模板字段路径；省略字段不表示字段不存在。Unity PathID 使用十进制字符串。
- [selected-native.json](selected-native.json)：运动禁选的四个短方法、参数签名、原始指令与字节指纹，及 BLOCK_FREE／MOTION_TARGET_FREE 的正确压缩枚举值；已有模式、半径和清关系方法仅列证据文件与指纹。

## 直接确认的内容

角色 Controller 的 `_motionMode=0`、`_blockMode=0`、`_ignoreBlockMode=0`。Default 模式的唯一 general Ability 是 `ClearFlyState`，安装 `tippi_tr[ground]`；该模板结束 `tippi_tr[fly_core]`，不安装 BLOCK_FREE。已查角色和蒂比专有模板没有落地时施加 BLOCK_FREE 的路径。这里确认的是初始 WALK 模式与已查内容路径，不代替所有外部／全局 Buff 的审计。

S1／S2 起飞模式的 Attack 对象各有 BuffToOwner 组件，向自身施加 `tippi_tr[fly]`。该模板创建 `tippi_tr[fly_core]`，其属性是 **MOTION_TARGET_FREE，不是 BLOCK_FREE**。fly_core 的模板事件 0 执行 `ChangeCharBlockMode(FLY)`，事件 1 执行 `ResetBlockMode`。在这条已查程序链中没有改变本人 motion 的节点。

BuffToOwner 的 `_runActionOnEvent` 类型是 `AbilityStandard.Event`，2／3 分别为 `ON_CAST_START`／`ON_CAST_END`；这里的 CAST 指起降模式中的 Attack Ability，不是 Skill 的开始／结束。字段和两个枚举成员复用既有取证，来源路径、JSON Pointer 与 SHA 已补入 selected-native.json。

高度变化另由 `ModifyGraphicHolderHeight` 表达。起飞和落地有各自的图形高度、模式切换程序；回到 Default 后才运行其地面清理。不能仅凭图形高度或 Skill 开始／结束时点替代实际模式与 Buff 变化时点。

普通原生 `ChangeBlockMode`／`ResetBlockMode` 写当前阻挡模式，再调用 `OnBlockModeChanged`。有效模式变化时先 `ClearAllBlockees`，重读有效模式后通知 Buff；该方法不立即搜索。完整指令见 [既有模式调查](../blocking-native-20261023/modes/report.txt)。

既有普通原生取证还确认：目标运动模式需匹配阻挡者模式，FLY 阻挡绕过近战地块许可检查；普通角色 WALK／FLY 半径分别约 0.7071／0.8944，BLOCK_RADIUS_SCALE 只调整 FLY 半径。这些是所查普通原生分支，不是对所有特殊装置或热更新路径的声明。

## 对地规避的证据边界

`Character.isStillMotionTargetFreeWithImmuneFlag`（76014，`0x180a3cf00`）的第三参数名为 `sourceMotionMode`。普通分支确认运动禁选后，比较自身 `get_blockMode()` 与该参数；Entity 基类对应分支比较自身当前 motion。蒂比的角色覆盖因此可以在本人初始 motion 仍为 WALK 的情况下，以 FLY 阻挡模式参与运动禁选。

本包没有继续追踪调用方如何取得 `sourceMotionMode`，也没有核实活跃 Lua。不同阵营地面单位的实际禁选及例外政策应与玩法资料交叉核对，不能只由枚举名字推出完整选择器算法。起飞不等于 BLOCK_FREE，也不能把能对空的选择器范围直接等同于来源本人的行动方式。
