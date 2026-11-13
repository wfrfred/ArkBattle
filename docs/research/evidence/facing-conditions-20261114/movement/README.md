# Enemy 改向入口与输入

日期：2026-11-14。只读 Windows x64 native，不执行游戏。DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`；完整来源与工具指纹见 `provenance.json`。沿用前批固定输入，不将资源清单版本当作 DLL 版本。

## 直接结论

详细 VA、分档和引用见 `notes.json`。

| 入口 | 尝试改向的条件与输入 |
| --- | --- |
| `InitFaceTo`／`OnBorn` | `_dontSetEnemyFaceByCursorWhenBorn=false`，读取当前 `moveCursor.GetNextDirection`，`FaceTo(force=true)`；不经移动方向修正。 |
| 普通／Fear／Attract 移动 | 共用 `_MoveByCursor`。要求未禁用移动改向、方向非零、距 `PredictReached` 给出的当前导航目标大于 0.25，再修正方向并 `FaceTo(false)`。0.25 是目标距离门槛，不能解释成每帧速度门槛。不可通格返回分支不尝试改向。 |
| 近竖直修正 | `_useMoveDirAsFaceDir=true` 直接使用输入。否则近竖直且非 deterministic 才投影；处理后仍近竖直则尝试 Cursor 的下一转向。判定为 `abs(dot(direction, up)) > 0.99199998`，此函数不自行归一化。 |
| `OnDisappearChanged(false)` | 当前 Cursor 方向经修正后 `FaceTo(true)`，不检查出生时的禁改开关；消失的 true 分支不改向。重新出现不能无条件沿用旧面向。 |
| 强制定位与即时 Blink 辅助 | 归一化目标与旧位置之差；发布位置后，方向非零才 `FaceTo(false)`。不使用普通移动的目标距离门槛。 |
| `BlinkWithDirection`／`TransportInternal` | 使用调用者给出的方向。切 BlinkState 的路径另在状态阶段处理；不能把所有瞬移归纳为保留旧面向。 |
| `ReassignRoute`／`ChangePathMotionMode` | 所提取本体没有直接 FaceTo 调用；Cursor 重建仍可能经 Checkpoint.OnBegin 的空间副作用同步改向，后续移动另使用当前 Cursor。完整初始化后继复用案例31。 |

这些是调用者的尝试条件；是否真正写入还要经过 `Entity.FaceTo` 的统一准入，见同批其他分工。它们不等同于 Locomotion 的速度／steering 规则。

## 文件与限制

- `initial-search.json`：普通移动及方向修正完整本体。
- `operations.json`、`blocked-turn.json`：出生、出现、定位、Blink、路线操作和显式方向入口。
- `callers.json`、`cursor-type.json`：移动包装、`PredictReached`／Cursor 虚 slot、召唤出生调用者、RushAttack 调用者。
- `blocking-registration.json`、`blocker-owner.json`、`block-manager-tick.json`、`blocked-wrappers.json`：阻挡登记／维护及方向包装的有限追踪。
- `blocking.json`：确认 `FaceToTarget` 的一个候选实际属于 GraphicFollowController；同时用 `Vector2..cctor` 核实 up 向量。
- `block-states.json`：Blink 动画状态的后续方向提交；另一个候选是 DialogState，不能充当阻挡证据。
- `constants.json`：固定 PE 字节解码，0.0625、0.992、正负水平向量与归一化 epsilon。

**阻挡建立时的自动转向尚未闭合。** 已检查所列本体中的直接调用及 `SetBodyAndFaceDirection` 虚 slot 90 候选，未取得实际转向链；不能据此否定 Wiki 需求或证明全游戏不存在。没有穷举所有状态、Buff、特化内容及 XLua。出生禁改开关启用时，此段保留既有值；初始默认值不由这段代码决定。

## 复提

原生提取复用前批 `facing-semantics-20261113/extract.py`，每份 JSON 的 `result.selection` 保存完整参数；中间结果位于 `.cache/native-research/facing-conditions-20261114/movement/`。例如：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/facing-semantics-20261113/extract.py \
  --out .cache/native-research/facing-conditions-20261114/movement/initial-search.json \
  --body Torappu.Battle.Enemy._MoveByCursor \
  --body Torappu.Battle.Enemy._CalculateFaceDirection

python docs/research/evidence/facing-conditions-20261114/movement/decode_constants.py \
  --reference docs/research/evidence/facing-conditions-20261114/movement/operations.json \
  --out .cache/native-research/facing-conditions-20261114/movement/constants.json
```

常量解码器先核对 DLL 指纹。直接 xrefs 只覆盖 E8／E9 候选，虚调按当前 metadata slot 配对；不将 `fullyDecoded` 解释为全部运行时路径已验证。
