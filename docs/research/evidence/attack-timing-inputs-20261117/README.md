# 普通攻击时间输入补核

2026-11-17。补旧 Action 时序批次未覆盖的猎狗默认攻击参数，以及事件等待的固定超时。玫兰莎、泥岩和弩手的既有参数、缓存预算与三段行为继续引用 [Case07](../../cases/07-action-timing-and-animation.md)，没有改写旧原件。

`result.json` 保存本机 `enemy_1000_gopro` 的 Enemy → Default UnitMode → Combat Ability，以及 Animator → SkeletonAnimation → SkeletonDataAsset → TextAsset 完整引用、六个组件原文、Bundle／对象指纹。Default._attack 为空，实际近战入口是 Default._combat；不能按对象名另造普通 Attack。

猎狗 Combat 的 `_timeMode=0`、`_waitForAttackEvent=1`、`_animKey=Attack`、`_maxAnimScale=1`、`_preDelay=0`。映射的 authored speed 为1，Spine 3.8.99 的 Attack 原长1秒，OnAttack 原时间为 float32 `0.6000000238418579` 秒，即30帧资料中的第18帧。该事件不是0.5秒。

`.skel` 由独立提供的官方 Spine 3.8 解析器读取，仅提供无渲染占位附件，不运行战斗。原始数据与读取结果归档；外部解析器本体不复制入仓库，其固定提交、URL、SHA-256 在 provenance 中。解析器的资源时间不证明实际释放逻辑帧，也不决定项目的时间量化政策。

```sh
curl -L --fail 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/8b4844bd4b193ba9e54487ed397a777993cbad56/spine-ts/build/spine-core.js' -o /tmp/spine-core-3.8.js
python3 docs/research/evidence/attack-timing-inputs-20261117/extract.py --spine-runtime /tmp/spine-core-3.8.js --out /tmp/hound-timing-replay
```

`extract.py` 先核对外部解析器指纹，再从实际 Bundle 重提；复查结果写到独立目录。只确认所选默认猎狗资源，不穷举皮肤、热更新、敌人变体或特殊 Ability。

## 事件等待超时

`wait-timeout.json` 保存当前客户端 float／FP 两种 `WaitWhileForFixedSeconds.MoveNext` 的完整方法区间，以及 `MathUtil.RoundToInt`、`FP.Round`。原工具按 PDATA 提取的首段不包含完整状态机，因此此处按已核对的下一条 Reset 方法边界保存全部分支；各指令原字节、方法身份、DLL／metadata 指纹均在原件中。

FP 版本 `0x180690810` 先计算 `max(RoundToInt(timeout / deltaPlayTime), 1)`，将计数清零后先 yield；每次恢复先检查谓词，仍需等待则累加计数，达到预算即结束。`MathUtil.RoundToInt` 调用 `FP.Round`，恰好半整数按整数最低位取偶。因此缓存动作预算控制的事件超时也是固定 Tick 计数，不是连续时间截止。float 版本具有相同的计数结构。

这里证明等待器内部的量化和 yield 顺序；不证明 `StartCoroutine` 与当帧 Simulator 的实际恢复次数，也不把项目每 Tick 一次推进换算成官方实测释放帧。

```sh
PYTHONPATH=.cache/native-research/python python3 docs/research/evidence/attack-timing-inputs-20261117/extract-wait.py --out /tmp/wait-timeout-replay.json
```

脚本复用 `native.py` 定位表并校验当前客户端指纹；依赖为原生调查工具锁定的 Capstone 5.0.7。它只重提这四个方法，不执行客户端。机制结论集中维护在 [Case07](../../cases/07-action-timing-and-animation.md)。
