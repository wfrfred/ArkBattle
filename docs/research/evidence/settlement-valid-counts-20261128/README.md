# 额外有效结算计数的消费者

日期：2026-11-28。仅核对有效计数的直接消费者及图鉴配置；机制结论见[案例 30](../../cases/30-scheduler-action-data-fields.md)。客户端 DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，与 11-07 Scheduler 证据一致。配置镜像为 `17759cc8cdf37388414145d16262a3a06f3ab25e`。

- [consumers.json](consumers.json)：三个 getter 的完整方法起始片段、直接 E8/E9 候选及对应调用方法；保留关键消费者的完整起始片段，其余只留调用点附近摘录。
- [finish-and-getters.json](finish-and-getters.json)：关卡结束数据调用片段与 Enemy 三个字段 getter。
- [finish-literal.json](finish-literal.json)：使用 metadata v29 字符串 usage slot（kind=5，index=(value & 0x1ffffffe)>>1）按长度及数据索引解码的 `validKillCnt`；解码方式同 [既有 decoder](../scheduler-general-20261107/lifecycle/decode_tag_literals.py)。
- [handbook.json](handbook.json)：固定镜像 enemy_handbook_table.json /enemyData 中 isInvalidKilled 为 true 或 overrideKillCntInfos 非空的 54 个节点，保留对应字段及源 SHA256。其中唯一非空 override 属乌萨斯平民。关卡 stage_table.json /stages/camp_r_03 指向 Obt/Campaign/level_camp_r_03。

## 定向复跑

从仓库根目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research/scripts
uv run --locked --offline "$skill/native.py" --out /tmp/valid-search.json search validKilledEnemiesCnt
uv run --locked --offline "$skill/native.py" --out /tmp/valid-getters.json disasm 73246 73247 73248 77683 77684 77685
uv run --locked --offline "$skill/native.py" --out /tmp/valid-killed-xrefs.json xrefs 0x180988a00
uv run --locked --offline "$skill/native.py" --out /tmp/valid-finished-xrefs.json xrefs 0x180988960
uv run --locked --offline "$skill/native.py" --out /tmp/valid-missed-xrefs.json xrefs 0x180988aa0
uv run --locked --offline "$skill/native.py" --out /tmp/valid-finish-fragment.json disasm-at 0x180b4113e --max-bytes 160
```

调用方法 index 与指令 VA 见 consumers.json 的 method 及 call 字段，可用 disasm 按 index 重提。用 finishFragment 中 0x180b41162 的 RIP 引用读取 usage slot 0x188b61340，按上述 decoder 解码。

## 限制

直接调用扫描不包括内联字段读取、虚调用、委托或 XLua 覆盖；返回直接调用候选不是所有可能消费者的证明。ComposeBattleRoundFinishData 已证实写入 validKillCnt，但不涉及服务端实际发奖、胜负规则或日志任务判定的完整追踪。已确认 Enemy 字段 getter 与 EnemyHandBookData 配置，并检查 Enemy.Init/OnInit/Spawn 普通方法的连续片段；尚未定位图鉴／关卡键具体绑定的全部写入链。静态配置提供非默认值见证，不代表实机已经验证该绑定。
