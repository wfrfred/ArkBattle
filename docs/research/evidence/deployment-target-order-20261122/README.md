# 思衡托 S3 按在场实例创建时间选目标

2026-11-22。`result.json` 保存实际角色包、技能模板及同版本 Windows IL2CPP 指令摘录。结论适用于所查静态分支。[实战规则](https://prts.wiki/w/凯尔希·思衡托#技能) 还注明创建时间相同时优先先部署的对象。本次未复放同时出生的场景。

- `kalts2_s3_trigger_transporting` 和 `kalts2_s_3[on_token_born]` 都让 `CreateBuffUseAbilitySelector` 调用 `S3OperatorSelector`。实际角色包 `charpack/char_1052_kalts2.ab` 的同名能力指向 `Kalts2S3TransportCharacterSelector`，限制最多两名，排除自己，并要求同玩家侧和有效 Card UID。
- `OnPostFilter#76060` 检查候选角色的 Card UID，之后调用 `AdvancedSelector.OnPostFilter#75505`。实际 `_postFilter=34` 对应 `FilterUtil/FilterType.CREATED_TIME_DES`。`_Filter_CreatedTimeDes#75974` 读取当前候选对象的创建时间并取负作为权重。
- `Character._BuildAtInternal#77293` 在 `0x180aaac77–0x180aaac7c` 把当前 `fixedPlayTime` 写入新角色的 `m_createdTime`。`Character.get_createdTime#77217` 读取该字段。选目标按候选对象自身时间排序。

从仓库根目录复跑。可用 `--game` 指定有相同指纹的安装。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/deployment-target-order-20261122/extract.py \
  --out /tmp/arkbattle-deployment-target-order.json
```
