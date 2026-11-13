# 有效左右符号与发布条件

提取日期：2026-11-14。只核实 `Enemy.OnFaceChanged → Unit → Animator/FaceSwitcher → faceSign`，并补齐普通关卡火龙的实际组件绑定；不决定项目模型。

## 来源

- DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。各原生 JSON 保存完整 provenance、方法选择和分支。
- 本机资源清单 `versionId=26-10-20-11-10-38-04170990`，仅为资源清单编号。Prefab 来自 `battle/enm_pfb_18.ab`；MonoScript 绑定来自 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`，指纹在 `fire-dragon-binding.json`。
- 关卡和 EnemyDB：Kengxxiao/ArknightsGameData 镜像提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，所选完整文件哈希、Pointer 与命令保存在三个 `fire-dragon-{level,ref,data}.json`。
- 复用 [前批玩法消费者](../../facing-semantics-20261113/part-application.json)，不重复提取或将原生实现当成项目政策。

## 结论与证据

1. **写入目标向量不保证符号已经改变。** `Enemy.OnFaceChanged` 先检查 `isStunned`，为真直接返回，连 `force` 也不绕过该下游检查；否则先通知 Unit/Animator，再按 BodyDirectionPolicy 更新身体方向。见 `animator-conditions.json` 的 77790，`0x180abee68–0x180abeeab`。本批不由此推断眩晕解除后永久不再更新；选取的 Stun/Freeze State 没有直接重发 FaceTo，后续其他路径另有自己的条件。
2. **近竖直时可以保留旧左右。** SingleSpineAnimator 先 `ParseDirection(newDir, 0)`；若不为 LEFT/RIGHT，仅在 `newDir.x < -0.05` 或 `> +0.05` 时转为左右，否则不更新。`force` 不能跳过这个选择。CharacterAnimator 使用另一分支：纵向时以 MathUtil.LT/GT 比较 `±0.2`，夹区沿用当前左右，四向解析另传 `0.25` 偏置。数值来自 `metadata.json`，不是只按字段名推测。
3. **SingleSpine/Character 的有效符号不等待视觉 Tween。** 两者有 FaceSwitcher 时，`get_faceSign` 直接读取 `m_currentLOrR`；StartSwitch 在开始 Tween 前同步更新该字段。RIGHT 返回 +1，LEFT 返回 -1。`immediately || m_firstTouch` 走立即回调；SingleSpine 的 `_neverImmediatelyFaceSwitcher` 只影响传给 StartSwitch 的立即选项，不改变上述符号读取。没有 FaceSwitcher 时则读取 UnitAnimator 保存的 `m_faceSign`。
4. **不能把上条推广给所有 Animator。** MultiSpineAnimator 不覆写 get_faceSign，继承 UnitAnimator 保存值；其非立即切换由回调 `_UpdateDirection → SetLeftOrRight` 写入，所以 Tween 路径可以延迟有效符号。`multi-spine-callbacks.json` 和 `tween-constructor.json` 闭合回调，继承链在 `metadata.json`。这只是原生类型链正证，**本批没有取得实际 Content 使用 MultiSpine 的绑定**。EmptyAnimator 的普通 get_faceSign 恒为 +1，也不能用目标向量统一还原所有 Animator。
5. **身体四向另有政策。** `DEFAULT_FOUR_WAYS=0` 将向量交给 SetBodyDirection；`LEFT_OR_RIGHT=1` 使用当前有效 `faceLOrR`，后者最终虚调 get_faceSign。它不是将部署四向、目标向量和左右符号合成一个字段。相关方法在 `animator-conditions.json`、`body-facing.json`，枚举在 `metadata.json`。

## 实际火龙调用链

`level_act24side_09.json` 的 `/waves/1/fragments/6/actions/1` 是 `enemy_1537_mhrors` 的 SPAWN，count=1；EnemyDB Ref 使用 level 0 且未覆写 prefabKey。EnemyDB level 0 的 prefabKey 为同名资源，`BornMode.mode=0`。

`fire-dragon-binding.json` 保存实际 PPtr、MonoScript 类、组件值、Root 和全部祖先 GameObject 的启用位：

```text
enemy_1537_mhrors / Enemy
  _animator → Graphic / SingleSpineAnimator
                _faceSwitcher → Graphic/FaceSwitcher
  Talents/TailCut / MhPartHpHudPluginTalent
```

- Enemy 的 `_bodyDirectionPolicy=LEFT_OR_RIGHT`；FaceSwitcher 默认 RIGHT、切换时间约 0.1 秒；SingleSpine 的 `_neverImmediatelyFaceSwitcher=false`。
- TailCut 组件启用、祖先均 active，`_validModeIndices=[0,6]`、`_facePosition=-1`，触发的 Buff 模板为 `enemy_mhrors_tail_cut`。不是根据类名含 Mh 推断绑定。
- 前批 DoAttach 登记 Modifier 事件 10；`_OnApplyedModifier` 检查有效 Mode，读取来源相对宿主的位置和宿主虚拟 faceSign，按 `_facePosition` 决定部位 HP 是否变化，并可触发 Buff。因此火龙是实际普通关卡中的玩法消费正例。

## 复跑与边界

`animator-conditions.json`、`animator-variants.json`、`body-facing.json`、`multi-spine-callbacks.json`、`tween-constructor.json` 和 `stun-state.json` 均使用前批 `extract.py`；每份 `result.selection` 保存完整命令选择。专用 Metadata 和 Prefab 解码复跑：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/facing-conditions-20261114/sign/extract_metadata.py \
  --out .cache/native-research/facing-conditions-20261114/sign/metadata-replay.json
python docs/research/evidence/facing-conditions-20261114/sign/extract_dragon.py \
  --out .cache/native-research/facing-conditions-20261114/sign/dragon-replay.json
```

Prefab 解码复用归档的通用 TypeTree 读取，不套 native 字段偏移。没有执行游戏或验证运行时 XLua 替换；没有穷举所有 Animator 配置。火龙的静态资源绑定、普通关卡可执行 SPAWN 与 native 消费链分别有证据，不据此声称进行了运行时观测。
