# 被动天赋的来源与空来源证据边界

核查日期：2026-11-12。本目录只补妮芙标准被动父 Buff 的来源赋值，不将允许空来源的接口当作实际空来源施加案例。输入为当前 Windows x64 IL2CPP、metadata v29；没有运行游戏或验证 XLua 替代。

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff |
| global-metadata.dat | e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5 |

## 标准被动父 Buff 的来源

妮芙 `Talents/1` 的 PassiveBuffAbility 携带 `nymph_t_1`，实际组件绑定与完整父模板见[既有内容证据](../../buff-group-expiry-20261111/content/README.md)。本批补五个最小方法及必要字段／虚槽：

1. Ability.DoAttach（64019）已接收 owner，在 `0x18060264d` 读取 vtable `+0x560` 后调用。metadata 的 slot 66 为 AddPassiveBuffs；PassiveBuffAbility 没有覆盖该方法。该路径对普通非 dummy owner 执行，dummy 另受原有字段控制。
2. Ability.AddPassiveBuffs（64057）在 `0x180601bb2` 读取 vtable `+0x420`；slot 46 由 PassiveBuffAbility.GetPassiveBuffs（94573）覆盖，返回本组件 `_buffs`（+0x118）。
3. AddPassiveBuffs 在 `0x180601d06` 取得 Ability.owner，随后 `0x180601d25` 将其传入 source 参数，`0x180601d3d` 调用 Entity.AddBuff（67544）；接收 Entity 也来自同一 owner。metadata 保留该 AddBuff overload 的参数名与类型。标准被动父 Buff 的 source 因而是天赋宿主，不是本次伤害目标或某个空来源。
4. AddPassiveBuffs 保存成功安装的 UID；ClearPassiveBuffs（64058）对同 owner 调用 RemoveBuffs，再清空 UID 列表。此处只补清理接口正文，不重新展开已研究的整个 Unit 离场链。

get_owner 的短正文同时保留，以确认字段 `m_owner`（+0x50）经 ObjectPtr 取回来源，而非只按方法名解释。两个虚槽读取地址分别与 slot 66、46 及当前每项 16 字节的布局配对；同方法 metadata 还保留完整签名。

## 对空来源影响的结论范围

CreateBuff 默认读取父 Buff.source 的原生正文复用[已有 group 证据](../../buff-group-expiry-20261111/group/README.md)，不重复提取。结合上述标准安装器，普通妮芙父天赋及其 listener 的来源可以闭合为妮芙宿主。

`nymph_t_1` 创建 listener 时明确 `_isDerivedBuff=true`、`_finishDerivedBuffIfParentFinish=true`；已有 `nymph_t_1[ep_damage]` 模板的开始程序还要求附着到来源父天赋，否则结束自身。因此，不能仅凭“某些弹道在来源退场后可继续命中、伤害 source 可为 null”，就断言妮芙会以空来源再建立一个独立组并多打一份持续伤害。

本批所用 holder 扫描覆盖 9054 个模板，其中 97 份来源独立描述没有显式 NULL／NONE 来源选择。这只是本次扫描结果，不能证明游戏不存在运行时失效来源。clemnt_s2 等 EmitProjectile 模板含独立描述，但尚未闭合角色根绑定、来源回收后弹道继续以及实际 Buff 施加三项条件；不把这些候选列为已确认的空来源玩法差异。

## 复跑

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  docs/research/evidence/independent-group-impact-20261112/nullable/extract.py \
  --out .cache/native-research/independent-group-impact-20261112/nullable/replay
```

比较 JSON result、五份 ASM 和输入指纹。该提取不修改客户端或 Core，也不穷尽全部被动、弹道或来源结束语义。
