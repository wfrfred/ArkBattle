# 解除阻挡后的 Tween 与自主移动调度

取证日期：2026-10-31。针对“Blocker 侧解除关系、站位 Tween 仍在播放时，自主移动是否必须等插值完成”补核普通 native 调用链。结论、条件与项目关联集中于 [Case 22 的调度补核](../../../cases/22-block-positioning-and-interruption.md#ni未完成插值与自主移动的调度)。未运行游戏或核实活跃 XLua。

## 来源与文件用途

两份 selected JSON 均使用 skill 的 `provenance`／`result` 格式，独立记录本轮 DLL／metadata 路径、大小和 SHA-256、共享工具指纹及本批次脚本指纹。输入与本批次原有 [selected-native.json](../selected-native.json) 相同，未混用初始旧客户端。项目基线为 `41c0821`；被 Git 忽略的共享 skill 仍以内容哈希标识，不声称该提交固定了工具源码。

| 文件 | 用途 |
| --- | --- |
| [tick/selected-native.json](tick/selected-native.json) | 11 个方法、30 个代码区间：全局 Tick 顺序、Tween 登记／播放／回收、注销关系与位置回调。 |
| [movement/selected-movement.json](movement/selected-movement.json) | 20 个方法、89 个代码区间：普通路线移动、状态切换、移动资格及 Ability 退战计时。 |
| [movement/field508-candidates.json](movement/field508-candidates.json) | 扫描 +0x508 位移的候选及所属方法；只有展开的实例写入才用于解释退战计时，静态热更槽不能混同。 |
| [tick/extract.py](tick/extract.py)、[movement/extract.py](movement/extract.py) | 专用提取脚本，复用共享 `Native`，从所在路径向上定位仓库根目录。 |

结果的 `bodies[].selector` 标识方法，`address`／`end` 标识代码区间；方法内单独的 `.pdata` 区间和跳转已按提取器范围展开。区间外调用仍按其独立选择器核对，不把单个 `fullyDecoded` 标记等同于完整控制流证明。省略过多共享别名时保留数量标记。

## 复跑

从仓库根目录执行，准备对应客户端、`uv` 和 native research skill；固定依赖与包校验值保存在两份 `extract.py.lock`。输出到独立工作目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked docs/research/evidence/block-positioning-20261031/scheduling/tick/extract.py \
  --out .cache/native-research/block-scheduling-tick-replay
uv run --locked docs/research/evidence/block-positioning-20261031/scheduling/movement/extract.py \
  --out .cache/native-research/block-scheduling-movement-replay
```

可添加 `--game` 指定安装目录；依赖已缓存时可加 `--offline`。脚本在入口核对本批次原生文件指纹后才使用已定位的选择器；新客户端需要重新定位。

实际取证运行的是归档脚本的同字节工作副本，命令分别为：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline .cache/native-research/block-scheduling-tick/extract.py \
  --out .cache/native-research/block-scheduling-tick/final
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline .cache/native-research/block-scheduling-movement/extract.py \
  --out .cache/native-research/block-scheduling-movement/final-verified
```

原执行路径保留在 JSON 的工具记录中；归档脚本内容哈希与该记录一致。工作输出中的重复单方法转储未再复制，本目录保留支撑结论的集中摘录和复现脚本。

## 结论边界

本次核对了确定性 Tween 管理器及普通 Enemy 移动链。它证明没有统一的 Tween 未完成禁移门控，并支持在移动资格成立时先 Tween 写位置、后自主路线写位置的条件性调用链推断；不声称解除必然当 Tick 移动，也未核实全部特殊状态、普通 DOTween 的最终更新阶段或现场逐帧轨迹。PRTS 作战机制页于 2026-10-31 查阅，几何说明不能代替此处的调度证据。
