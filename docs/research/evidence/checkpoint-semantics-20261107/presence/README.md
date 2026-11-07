# Checkpoint 消失与出现短链

日期：2026-11-07。只补核首个 Checkpoint 初始化中的 DISAPPEAR／APPEAR_AT_POS 副作用、setter 门槛、目标位置和同步回调。创建／登记顺序由本批根目录取证；结论集中维护于案例，不在本目录决定项目 API。

本机 Windows x64 普通静态分支：GameAssembly.dll SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，metadata v29、imageBase `0x180000000`。与 [Route 创建批次](../../route-creation-20261107/README.md)及 [Case 18 的 11-05 取证](../../presence-passengers-20261105/README.md)同指纹。

## 原件

- `checkpoint-presence-bodies.json`：DisappearCheckpoint.OnBegin、AppearAtPosCheckpoint.OnBegin、BObject.SetDisappeared、BObject／Enemy.OnDisappearChanged。
- `entity-presence-bodies.json`：继承的 Entity.OnBeforeDisappearChanged、Entity.OnDisappearChanged 和独立资格查询 CheckCanSwitchToDisappearState。后者存在不等于 setter 调用了该查询。
- `appear-target-bodies.json`：APPEAR 的 targetGrid／targetPos 及 Enum SwitchState helper `0x184bbb860`；helper 只是 enum 转 int 后尾转普通 StateMachine.SwitchState。
- `state-switch-body.json`：普通 SwitchState 的准确签名及到 _SwitchStateInternal 的尾转。完整 internal 门槛见根目录对应原件。
- `born-state-enter-body.json`：BornState.OnEnter／OnTick；只检查出生初始状态是否立即消费消失标志，不展开动画实现。

字段布局复用 [Enemy](../../route-creation-20261107/initialization/enemy-type.json)、[Entity](../../scheduler-general-20261107/lifecycle/entity-type.json)和本批 `move/checkpoint-data-type.json`；不重复复制原件。

## 复跑

仓库根目录执行；完整结果写到独立目录，方法全名及 token 均在 JSON selector 中：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/checkpoint-presence-replay.json \
  --method Torappu.Battle.BasicCursor/DisappearCheckpoint.OnBegin \
  --method Torappu.Battle.BasicCursor/AppearAtPosCheckpoint.OnBegin \
  --method Torappu.Battle.BObject.SetDisappeared \
  --method Torappu.Battle.Entity.OnBeforeDisappearChanged \
  --method Torappu.Battle.Enemy.OnDisappearChanged
```

其余方法按各 JSON 的 selector 重提；带 helper 的文件另传 `--helper 0x184bbb860`。`.pdata` 完整片段、字节哈希与工具指纹随原件保存。没有运行游戏或验证 XLua 实际覆盖；前置／后置回调进入同步事件派发，不代表本次初始化时必有已登记的内容处理器。调用 OnBegin、改变消失标志、实际进入消失 State 是不同观察点，不可仅凭第一项宣称后三项全部完成。
