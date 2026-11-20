# 敌方弹道的选择、减速与消除

2026-11-20 补查逻各斯 S3，项目对照为 `153f9f9`。玩法结论见[案例 17 的补核](../../cases/17-projectile-stop-and-termination.md#22-逻各斯的敌方弹道选择减速与消除)。

## 输入与取证范围

| 客户端输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

`native.json` 保存关键分支、字段偏移和黑板字符串定位。`logos.json` 保存当前安装资源的组件引用与固定镜像技能表的黑板值，分别记录来源与指纹。`dispel-prefabs.json` 记录当前 PersistentData 中「十字路口」量产型的发射能力与不可变速、不可消除弹道。 [原生摘录](native.json) · [逻各斯技能资源](logos.json) · [敌方弹道样例](dispel-prefabs.json)

## 关键定位

- `AdvancedProjectileSelector._ValidateProjectile` #76147 在 `0x180a2bd7a–0x180a2bd86` 读取弹道的 `BObject.side`。普通发射在 `0x180916ff6` 读取来源阵营，在 `0x18091704b` 传给 `BObject.Init` #66009。以另一弹道为来源的分支在 `0x180916897` 读取旧弹道阵营。
- `Projectile._InitOuterAdjustableSettings` #72575 在 `0x18091afb7` 写可变速、在 `0x18091b06e` 写可消除。可消除的自动分支读取刚得到的可变速值。`TryEliminate` #72522 在 `0x180919b14` 检查可消除值后才进入消除及停止分支。
- `ProjectileMoveScaleBehaviour.SetData` #97010 在 `0x18105c7dc` 读取黑板键。`0x18105c7c3` 的 RIP 引用对应 metadata 字符串 `projectile_move_scale`。进入和离开分别在 `0x18105c5d0`、`0x18105c6e0` 尾调登记和移除。`BasicMovement._CalculateFinalMoveScale` #72410 的 `0x180900fbb` 在循环中乘各倍率。
- `Projectile.OnTick` #72526 在 `0x1809186d7` 将根时间增量乘运动倍率，在 `0x18091873d` 提交 `currentTime`，后续检查寿命。行为循环在 `0x1809188f0` 读取各自的时间倍率，在 `0x18091895e` 推进当前行为。

本批为静态资源与原生分支核对。未验证活跃 XLua、具体弹道的全部等待计时或运行时改写资格的用例。技能表固定镜像和安装资源各有版本，取证时未将其视为同一快照。

## 复查

从仓库根目录执行。技能表从 `logos.json` 记录的固定地址取得，提取器会核对文件哈希。重提取在其他机器上可指定同版本安装目录。`extract_logos.py` 接受 `--game`，`extract_dispel_prefabs.py` 接受指向 `Arknights_Data` 的 `--game-data`。归档中的 PersistentData 资源路径以安装目录为基准。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
tools=.agents/skills/arkbattle-native-research/scripts
batch=docs/research/evidence/projectile-control-20261120
out=.cache/native-research/projectile-control-replay

uv run --offline --locked "$tools/replay.py" "$batch" --out "$out"
python "$batch/extract_logos.py" --skill-table /tmp/skill_table.json --out "$out/logos.json"
python "$batch/extract_dispel_prefabs.py" --out "$out/dispel-prefabs.json"
uv run --offline --locked "$tools/native.py" --out "$out/init-settings.json" disasm-at 0x18091ae9f
uv run --offline --locked "$tools/native.py" --out "$out/root-clock.json" disasm-at 0x1809185f8
uv run --offline --locked "$tools/native.py" --out "$out/behaviour-clock.json" disasm-at 0x180918886
```
