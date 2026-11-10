# Ability 启动结果与调用方

2026-11-10。只回答实际调用者如何消费启动成败、是否据具体失败原因分流；不提出 ArkBattle API。案例 02／07／08／33 提供已有内容与阶段背景，本批按当前完整方法名重新定位。

## 来源

- Windows x64／IL2CPP metadata v29，普通 native fallback；未执行客户端或确认活跃 XLua。
- DLL SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 完整文件路径、工具指纹和本次字段／方法身份见各 JSON 的 provenance。

## 直接证据

| 消费路径 | 已核实分支 |
| --- | --- |
| `AbilityStandard.CastToTarget` 64098 | 返回类型为 bool。目标无效、readiness 或开始检查失败均转到 `0x1805fc169` 返回 false；注册回调、重置计时器、启动 coroutine 后在 `0x1805fc165` 返回 true。拒绝时没有将各项失败细分带回调用方。 |
| `AbilityStandard.CastDirectly` 64099 | 同样返回 bool；失败出口 `0x1805fbb48`，成功出口 `0x1805fbb34`。 |
| `AbilityFirstSucceedGroup.CastToTarget` 93657 | 每项先检查 readiness；子项 Cast 返回后在 `0x180f878c5` 检查 AL。false 继续下一项，true 记录所选子项并启动组；全失败清理一次性回调。`CastDirectly` 93658 同样只有成败结果。 |
| `AbilityRandomGroup.CastToTarget` 93766 | 选择单个子能力，检查 readiness 后尝试 Cast。`0x180f8b15e` 的 false 转入清理并返回 false，不按原因或重抽其他项。`CastDirectly` 93767 同样消费 bool。 |
| Character `AttackState._StartAttack` 77505 | `0x180ab5967` 检查 Cast 返回的 AL；失败执行本次 `OnAfterAttack` 后返回 false。`_NextAttackOrExit` 77504 在 `0x180ab5593` 只检查成败，再走普通继续／退出分支。 |
| Enemy `AttackWrapper.Cast` 78175 与 `CombatWrapper._DoCast` 78198 | 对普通 Ability 或 EnemySkill 的调用均只检查 bool；成功才保留本次选择与后续配置。所选技能失败不被解释成不同 FailureReason。 |
| `EnemySkill.CastToTarget` 67304 | TryReduceSp 与 Ability.Cast 的失败均汇合到 `0x18070e75a` 的清理／false；成功路径才继续技能成功处理。 |
| `TriggerAbility.Execute` 102055 | CastToTarget／CastDirectly 的 bool 在 `0x181206448` 受 `_useCastResult` 控制：true 保留 AL，false 将节点返回值改为 true。字段实际偏移 `0x23`，见 contracts.json。 |
| `WangVisualStoneMarkAbility.DoOnHasNoTarget` 96082 | 本地无目标分支按自身计数调用 `RunFailedActions` 96080；后者无失败原因参数，只执行所配置的一组动作。这是已经进入施放流程的特定能力业务，不能据其名字推导公开启动失败枚举。 |

上述 bool 确实被调用者用于后继选择；它不是“没有返回结果”。所选路径没有把目标、冷却、施放中等不同拒绝原因作为返回载荷交给上层。各项准入条件在内部仍有不同判断，部分上游也会事先检查 readiness／Trigger。

回调参数 `Ability.FinishReason` 表示已启动能力的结束原因，与本问题的启动拒绝分别处理；没有将两者合并解释。

## 实际内容绑定

`content-bindings.json` 摘录既有案例 33 的原始组件，重新比较当前本机对应 Bundle 指纹，二者均一致；同时复核固定镜像的完整 Character／Skill 文件哈希。

- `char_513_apionr`（郁金香）→ `skchr_apionr_1`（只余芬芳）→ shared skills 的 `AbilityFirstSucceedGroup` `5117273669797411021`。顺序子项为 `MultiMeleeAttack` `7343246726752041165`（`allowNoTarget=false`）和 `EmptyAnimatedAbility` `-4887580023928719155`（`allowNoTarget=true`）。这是角色技能表实际绑定的首个成功分组，不是仅按类名找到的孤立模板。分组的原生 bool 回退逻辑适用于该配置；没有实战执行或 XLua 激活观测。
- `char_1045_svash2` 的 Character `_modes` 指向 Default Mode `727491709581147437`，该 Mode 的 `_attack` 指向 `AbilityRandomGroup` `8869629110901357869`，组再引用三个实际 MeleeAttack 子项。默认攻击分组不是名称相似的未引用对象。
- `_useCastResult=true` 的具体 Buff 动作与 Touch 的失败后继由上层同批 Content 调查归档；本目录只证明其调用协议，未把旧模板缓存单独当作当前可执行引用。

## 文件与复跑

`native-bodies.json` 保留所选 15 个方法的签名、连续 .pdata 分段与指令；所选区间均完整解码。`contracts.json` 只保留本问题使用的方法与字段。完整广搜与其余组实现留在 `.cache/native-research/operation-results-20261110/action`，不作为全部 Ability 路径已调查的证明。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/operation-results-20261110/action/extract_action.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/operation-results-20261110/action/replay \
  --methods-file docs/research/evidence/operation-results-20261110/action/methods.json
```

复跑的 `bodies.json` 对应归档 `native-bodies.json`。类型与资源引用可按记录的完整类型名、SerializedFile＋PathID 和来源哈希重新提取。`fullyDecoded` 只说明选定指令区间，不覆盖运行时 hotfix 或所有虚派生类。

本次结论限于所列通用入口、调用方和实际内容绑定；不能据此证明全游戏不存在按其他细节处理失败的特殊机制。
