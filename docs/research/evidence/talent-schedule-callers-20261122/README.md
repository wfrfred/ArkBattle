# 天赋重绑与 Scheduler 回收配置的调用点

2026-11-22 使用本机 Windows 客户端静态分支。输入、工具及方法指纹见 [result.json](result.json)。DLL 指纹前缀为 `cf7956bf`，metadata 为 `e58fb854`。同名旧版本的方法索引独立解释。

- `Character.ReassignTalents #77370` 的直接 E8／E9 扫描返回一个调用点。它位于 `HalfIdleGameMode.GainExp #84253`，实读 `0x180cd2d12`。关卡镜像的 `/activity/act1vhalfidle` 将该玩法识别为次生预案。该调用点没有提供普通战斗的第二个调用者，也没有验证旧天赋计数如何带入新附着实例。 [天赋案例](../../cases/06-talent-lifecycle-and-model.md)
- `DynamicConfig.get_useRecycleToFinishScheduler #44076` 的普通分支在 `0x183e52688` 读取配置对象 `+0x32` 的布尔值。`Scheduler._OnUnitDestroyed` 以它决定是否当场解除最终等待，`MarkEnemyKilled` 也读取该值。固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 gamedata JSON 未见同名字面配置。后续已定位客户端读取的安装包配置，普通路径保留 true 的默认值。 [安装配置与终局调用](../scheduler-recycle-config-20261122/README.md) · [调度案例](../../cases/30-scheduler-action-data-fields.md)

复查从仓库根目录使用所列指纹的客户端。直接调用扫描不涵盖虚调用、委托、在线替换和运行时动态解析。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
skill=.agents/skills/arkbattle-native-research/scripts
uv run --offline --locked "$skill/native.py" --out /tmp/arkbattle-talent-xrefs.json xrefs 0x180aa5730
uv run --offline --locked "$skill/native.py" --out /tmp/arkbattle-talent-bodies.json disasm 77370 84253
uv run --offline --locked "$skill/native.py" --out /tmp/arkbattle-recycle-xrefs.json xrefs 0x183e52640
uv run --offline --locked "$skill/native.py" --out /tmp/arkbattle-recycle-bodies.json disasm 44076 73334 73333
rg -ni 'useRecycleToFinishScheduler' assets/arknights-game-data/zh_CN/gamedata -g '*.json'
```
