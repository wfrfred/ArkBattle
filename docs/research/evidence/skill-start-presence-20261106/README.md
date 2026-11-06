# 技能开始通知中的宿主消失

取证日期：2026-11-06（Asia/Singapore），项目基线 `34069e6`。问题是宿主消失是否结束已经成立的持续技能，以及开始通知中的同步消失是否阻止后续开始程序。结论集中在[案例 05](../../cases/05-skill-start-and-finish.md#2026-11-06复核开始通知中的宿主消失)。本批只分析当前普通 native 分支，未修改模拟实现、接口或测试，未运行游戏、注入回调或核实活跃 XLua。

## 输入与资料

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

安装目录为 `/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game`。metadata v29，image base `0x180000000`；方法索引和地址由当前输入重新定位，不沿用案例 05 的旧客户端编号。uv 0.12.24、Python 3.14.8、Capstone 5.0.7；共享解析工具及专用提取脚本的指纹保存在 JSON 中。

PRTS 社区资料[技能](https://prts.wiki/w/技能#特殊属性)、[作战机制／传送](https://prts.wiki/w/作战机制#传送)、[余／厚礼上宾](https://prts.wiki/w/Yu#技能)查阅于 2026-11-06。传送说明主要涉及 Enemy 的消失状态；余的相关条件排除已消失目标。它们没有给出 Character 在技能开始通知中消失的精确行为，不能用隐匿、目标丢失或模型隐藏代替本题，因此继续检查客户端。

## 选取范围

| `native/native.json` 内的选取 | 必要定位 |
| --- | --- |
| 消失与中断 | `SetDisappeared`、Character 状态 8 的注册及切换、`SkillState.OnExit`、开始中断、casting 中断与持续期结束的区别 |
| 开始派发 | `AssignData` 的开始 delegate 绑定、`StartCastingInternal`、Ability 开始回调、Character 通知与 BasicSkill 开始行为循环 |
| 推进 | `Character.OnTick → BasicSkill.Tick → OnTick / Behaviour.OnTick`；用于复核消失是否构成通用推进门禁 |

关键锚点：

- `Character.OnDisappearChanged` 77343 在 `0x180aa3032` 请求状态 8；`States.ConstructStateMachine` 77455 在 `0x180ab4314` 将 `DisappearState` 注册到该编号。
- `SkillState.OnExit` 77512 在 `0x180ad221e` 调用 `InterruptStartIfNot`，然后经 slot 56 调用技能的 `InterruptIfNot`。普通分支不根据目的状态筛选。
- `BasicSkill.InterruptIfNot` 73868 在 `0x1809944f8` 中断 Ability；`0x1809944fa` 检查字段 `_stopAffectOnInterrupt +0x5a`，为 true 时额外调用 `StopAffect`。`OnCastFinish` 73902 在 `0x180995d2b` 查询 `isAffecting`，仍生效时只在 `0x180995d59` 标记等待结束。
- `BasicSkill.AssignData` 73860 在 `0x180992d8e` 取 `0x188c66b18` 的 MethodInfo 选择器，构造指向 `OnSkillStart` 73864 的 Action，并在 `0x180992db0` 写入 Ability 的 `onCastStart +0x18`。选择器原始值及解码随提取输出保存。
- `BasicSkill.OnSkillStart` 在 `0x180996e33` 调用 `Character.OnSkillStart`；Character 在 `0x180aa4509`、`0x180aa4546` 分别通知 Buff 与实体事件池。返回后，BasicSkill 在 `0x180996eab` 调用开始行为。该虚调用的类偏移 `0x1d0` 对应 slot 9（本客户端 vtable 起点 `0x140`）。
- `Character.OnTick` 77329 在 `0x180aa4891` 调用 `BasicSkill.Tick` 73862。BasicSkill 的 `+0x26` 是 `_canSilenced`，不是 BObject 的同偏移消失字段；不能跨类型解释偏移。

## 复跑

从仓库根目录执行，写入独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/skill-start-presence-20261106/native/extract.py \
    --out .cache/native-research/skill-start-presence-replay
```

入口支持 `--game`，校验两份客户端输入指纹；依赖未缓存时去掉 `--offline`。脚本复用 skill 的 `native.py`，逐段提取选定方法至下一已知方法地址，保留每段指令、边界和字节哈希；`fullyDecoded` 仅表示该选定区间完成解码。类型材料只保留实例字段和相关方法；特别长的共享地址别名列表只列本题类型，另存完整列表的总数和哈希，不把共享入口任意认定为单一方法。`archive.json` 是材料与可复查选择器清单，不代替以上专用提取过程。

本批没有绑定一个实际 Character 配置来证明“开始通知正好调用消失”的真实内容案例，也没有穷尽技能派生类、逐个行为节点的资格或热更新。静态链只能证明所列普通分支的条件及调用顺序，不把全部 casting 当作持续技能，也不以此制定项目取消政策。
