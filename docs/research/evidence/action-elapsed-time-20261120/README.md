# Ability 重新挂接与计时接续

取证日期为 2026-11-20，项目基线为 `d96923e`。本批核对保留绝对已过时间的调用点，重点追踪 `Ability.Attach` 和 UnitMode 切换。结论见[案例 07](../../cases/07-action-timing-and-animation.md)。普通攻速属性变化仍引用[攻速刷新批次](../attack-speed-timing-20261105/README.md)。

## 输入与记录

读取本机官方 Windows 客户端，哈希与 2026-11-05 攻速刷新批次相同。

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

[native.json](native.json) 保留客户端和工具指纹、方法签名、实读指令、所需字段及直接调用定位。[archive.json](archive.json) 记录本批材料哈希和可重提的方法选择器。

## 关键定位

- `PeriodicTimer.ResetButKeepPastTime` 为 #26425，地址 `0x181e4ad50`。直接调用候选包含 Ability 挂接、显式冷却修正，以及 Card、HP 和 SP 等计时入口。后续判断须结合各调用点的用途。
- `Ability..ctor` #64068 在 `0x180604b79–0x180604b87` 初始化并保存 `m_cooldownTimer`。`Ability.Attach` #64016 在常规分支检查 `isAttached`，未挂接时才进入虚调用；`AbstractAnimatedAbility.DoAttach` #93888 调用基类挂接后，读取现有 timer 与当前周期，并在 `0x180f90764` 跳到 #26425。
- `AbilityFirstSucceedGroup.DoAttach` #93659 先挂接子 Ability，再在 `_updateCooldownAfterSubAbilitiesAttached` 启用时刷新组计时器。保留已过时间的调用在 `0x180f87ae3`。
- `UnitMode.OnInactivate` #79165 和 `OnActivate` #79164 都遍历同一 `+0x98` 集合。前者在 `0x180b1286d` 调用 `Detach`，后者在 `0x180b12704` 调用 `Attach`，允许同一个 Ability 对象重新挂接。基类 `DoDetach` #64020 的常规指令包含中断、虚回调和脱离清理，末尾在 `0x180602934` 调用 `set_isAttached(false)`。该方法本体保持原计时器字段，具体虚回调对计时状态的影响须按 Ability 核对。
- 显式 `Ability.UpdateCooldown` 的三参数重载 #64029 根据 `keepPassedTime` 选择计时分支。直接调用候选还包括 `ChannelingMeleeAttack` #92317、`ActiveBuffAbility` #92976 和 `ActiveAbilityWrapper` #93927 的覆写。已经闭合的真实配置用于在途技能延时，见[案例 09](../../cases/09-skill-mechanisms-and-requirements.md)。

## 复查

从仓库根目录用同指纹客户端复查。脚本默认读取本机安装位置；可传 `--game` 选择同一版本的另一份安装。归档回放先比对输入指纹，分段和调用候选可用下列选择器追加核对。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research/scripts
batch=docs/research/evidence/action-elapsed-time-20261120
out=.cache/native-research/action-elapsed-time-replay

uv run --offline --locked "$skill/replay.py" "$batch" --out "$out"
uv run --offline --locked "$skill/native.py" --out "$out/past-time-xrefs.json" xrefs 0x181e4ad50
uv run --offline --locked "$skill/native.py" --out "$out/animated-attach.json" disasm-at 0x180f9068a --max-bytes 0xdf
uv run --offline --locked "$skill/native.py" --out "$out/group-attach.json" disasm-at 0x180f879c7 --max-bytes 0x18a
uv run --offline --locked "$skill/native.py" --out "$out/base-attach.json" disasm-at 0x180602502 --max-bytes 0x1a4
uv run --offline --locked "$skill/native.py" --out "$out/base-detach-a.json" disasm-at 0x180602737 --max-bytes 0x202
uv run --offline --locked "$skill/native.py" --out "$out/base-detach-b.json" disasm-at 0x18060281e --max-bytes 0xe4
uv run --offline --locked "$skill/native.py" --out "$out/base-detach-c.json" disasm-at 0x180602855 --max-bytes 0xe4
```

## 证据边界

本次读取的是静态常规分支，未运行客户端或校验活跃 XLua。直接调用扫描只返回 E8／E9 候选，间接调用和虚派发须单独核对。同对象重挂的调用链已定位，尚未核对某一已支持模式的具体 UnitMode 配置是否会在重挂前保留未完成冷却、在重挂时改变其周期，并因此产生可观察的进度差异。本批也没有找到显式冷却覆写用于调整下一轮 Action 启动时间的实际内容配置。
