# 统一转向准入与角色待机恢复

本目录仅记录静态客户端事实，不确定 ArkBattle 的字段、Rule 或操作签名。

- `metadata.json`：Entity／Character／Enemy 方法及 slot、AbnormalFlag 数值、四项直接调用搜索的调用者候选。`extract_metadata.py` 使用已有整数默认值解码器，原始参数与输入指纹写入输出。
- `native.json`：FaceTo 系列、固定朝向 getter、异常状态 getter、Character 待机恢复及直接调用候选。使用上一批 `facing-semantics-20261113/extract.py`，每份输出内的 selection 保存完整选择器。
- `idle-callers.json`：Character IdleState、AnimationEmitBehaviour 和两个显式待机操作节点的调用位置。
- `explicit-and-initial.json`：角色出生、死亡后动画、切换模式和显式朝向节点，区分初始／重置／内容程序与普通自主移动。
- `target-threshold.json`：FaceToTarget 的原始距离平方常量 `0x1870af1c0`，以 float 读取为 `0.04000000283122063`。

## 已确认

`Entity.OnFaceChanged` 的 metadata slot 为127，对应 FaceTo 内虚调用偏移0x930，推得该客户端 vtable 基址0x140。入口读取0x590对应 slot69；Entity 声明抽象 `get_isFixedRotation`，Character／Enemy 覆盖分别读取自身 `_isFixedRotation`。

FaceTo 的普通准入要求：非固定朝向、非 get_isStunned、没有 UNMOVABLE(13)／UNMOVABLE_PRIVATE(22)、非 get_isFrozen、非 get_isLevitate。get_isStunned 包含 STUNNED(0) 与 STUNNED_NO_AMPLIFY_DAMAGE(19)；另外两 getter 分别查询 FROZEN(16)、LEVITATE(25)。`force=true` 与普通资格作 OR，再决定是否写 m_faceTo 并调用 OnFaceChanged。该函数本身没有按方向非零或相同值提前返回。

`FaceToTarget` 先以目标地图位置减自身地图位置；差向量平方必须大于上述约0.04常量，才把原始差向量交给 FaceTo。force 参数不会绕过这一前置距离检查。FaceToDirection／Front／Back 根据身体方向及其对应向量生成输入，不能据名称把身体四向与持久左右符号当成同一个值。

Character.TryFaceToIdleDirection 要求：没有来源键控制的待机恢复禁用、当前阻挡数为零、Idle 动画存在；随后调用 FaceToDirection(force=false, idle=true)。Idle 来自调用点0x180aa7eea所读字符串 usage，原始编码和 literalIndex 在 metadata.json。Character IdleState.OnEnter、AnimationEmitBehaviour 的对应分支和显式动作节点会调用它。SetDisableFaceToIdleDirection 先按 reason 改 EnableStateWithKey，alsoTryFaceToIdle=true 时再尝试恢复，不承诺一定转向。

## 范围

直接调用搜索只覆盖 E8／E9 候选，不能证明虚调或热更新路径均被穷举。上述 force 只保证越过 FaceTo 自己的准入，下游 OnFaceChanged 和 Animator 是否改变有效左右符号另见 `../sign/`。没有执行游戏或运行 XLua。

## 复查

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/facing-conditions-20261114/gates/extract_metadata.py \
  --calls-from docs/research/evidence/facing-conditions-20261114/gates/native.json \
  --out .cache/native-research/facing-gates-replay.json
```

其余 native 提取可按对应 JSON 的 selection 使用原提取器复跑；常量使用 native.py 的 `read 0x1870af1c0 --format '<f'`。
