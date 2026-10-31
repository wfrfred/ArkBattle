# 阻挡站位插值与中断取证

取证日期：2026-10-31。范围、结论和未决项见 [Case 22](../../cases/22-block-positioning-and-interruption.md)。这是真正重新读取客户端的新批次，未运行游戏或活跃 XLua。

## 输入与工具

DLL／metadata 的路径、大小、SHA-256、metadata 版本、image base、当前注册表定位及共享工具指纹见 [selected-native.json](selected-native.json) 的 provenance。输入与 2026-10-23 Blocking 批次相同；不是线上最新版本声明。

项目基线为 `3ef1b86d16ad466e248a9c7f2614596023647311`。共享 skill 位于被 Git 忽略的 .agents，不能声称该提交固定了工具源码；工具内容由 provenance.tool.script.sha256、provenance.extractionScript.sha256 标识。Python 版本见 provenance，Capstone 固定为 5.0.7，依赖及 wheel 校验值见 extract.py.lock。

## 复跑

从仓库根目录执行，输出到独立目录，不覆盖历史材料：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked docs/research/evidence/block-positioning-20261031/extract.py \
  --out .cache/native-research/block-positioning-replay \
  --address 0x1805e75e0 --address 0x1845f1320 --address 0x1845eff90 \
  --address 0x18424f6a0 --address 0x1845f15a0 --address 0x1844bd2e0 \
  --query 'DOTween..cctor' --query 'BattleUtil.Deprecated_PlayTweenInBattle' \
  --query 'Enemy.get_isInCombat' --query 'Entity.get_isBlockFree'
```

可用 --game 指定客户端目录；脚本核对该批次指纹后才读取专用常量和原生辅助地址。指纹改变时需重新定位，不应删除检查直接套用。离线已缓存依赖时可加 --offline。

extract.py 复用 skill 的 Native；按当前完整方法名选取方法，展开已知方法区间内的跳转及 .pdata 边界的 fall-through，输出分段反汇编。区间外调用、间接调用、跳表数据和新版本变更仍需人工核对。selected-native.json 集中保留相关方法、字段、常量和指令，省略大量无关共享函数别名，明确记录省略数量。脚本使用的两个常量 VA 和辅助函数 VA 属于已校验指纹的批次选择器。

本轮实际执行过上述命令（输出目录为 .cache/native-research/block-positioning-verified），且使用共享工具单独补读过 DOTween.ApplyTo 入口。验证为静态调用链与指令核对，没有执行原始指令仿真或游戏轨迹测试。

PRTS 作战机制及 DOTween 文档均于 2026-10-31 查阅，链接与使用范围见 Case 22。普通 DOTween 的初始化值不等于已查明游戏运行现场的最终曲线；取消语义须区分具体入口。

## 解除后与自主移动的调度补核

同日补核材料见 [scheduling/README.md](scheduling/README.md)：分别保存确定性管理器和普通移动链的当前提取结果、原输入指纹、脚本及实际复跑命令。该补核解释已保留 Tween 如何继续推进、退战计时的 Ability 来源及与路线移动的写入顺序，不覆盖本目录原有摘录。结论与条件集中维护于 Case 22。
