# 动画行动的转向条件与时点

提取日期：2026-11-14。Windows x64；DLL／metadata 指纹分别保存在每份 native JSON，不沿用旧索引猜测调用。资源版本与本机指纹按本批根说明；未执行游戏或 XLua。

## 结论

- `Ability.StartCastingInternal` 先写施法事实和启动帧，再虚调 `OnCastStart`。`AbstractAnimatedAbility.OnCastStart` 的顺序是父程序 → slot108 `DealWithFaceDirection` → slot112 `GetAnimKey` → 动画。`OnCastEnd` 不在基类中重转向。
- 普通转向首个启用项依次为 target、default、front、firstCastTarget；全部关闭直接返回。force 仅是下层参数。target 优先读取对象当前 `mapPosition`，对象无效时用保存坐标；firstCastTarget 要求首项引用有效且 `alive`，不会跳过死首项再找后项。
- `checkFaceToFirstCastTargetDownAttack` 由 `CheckDownAttack` 消费，影响下向动画选择，不增加转向时点。
- 所查普通 Tick、目标更新与施法协程没有随重新索敌再次调用该转向程序；不能把特殊子类或动画行为也一并归纳为仅启动改向。
- 三个 native 覆盖各有语义：TargetCenteredAreaMeleeAttack 取中心目标，缺目标回身体方向，并要求宿主 alive；CastOnTileAbility 可在 base 之后朝首格；PyczogMultiRangedAttack 完全替换 base，按自身方向表改向。详情与关键 VA 在 `notes.json`。

统一 `FaceTo` 准入、`FaceToTarget` 的距离门控和待机恢复见同批 `gates/`。通用 slot 跳板的 `slot-helper.json` 证明首项分支的 0x28 调用对应 slot40 `get_alive`，不是 `get_isAlive`。

## 材料与实际配置

`ability.json`、`overrides-start.json`、`targeting-tick.json`、`cast-coroutine.json`、`activation.json` 保存基类、覆盖、调用者及完整所选 native 区间；`methods` 中保留 slot 与签名。间接调用按本客户端 vtable 基址 0x140 配对，直接 xrefs 仅作为 E8/E9 候选。

`current-config/decoded.json` 保存13个当前组件及登记根，附原始对象字节、Bundle/CAB/PathID、层级与指纹。普通弩手的实际 UnitMode 绑定远近攻击、末药 Default 绑定普通治疗，均 target=1；泥岩 S2 的 `_extraAbilities` 直接绑定 RollAttack，四种 base 改向模式均为0；莫斯提马 S2 的 ChannelingMeleeAttack 配置 default=1。这是明确的 Prefab 配置和引用，不是原生默认值推断或实战观测。

旧配置仅用于定位。本次核验发现 enemy／skills Bundle 指纹已变化，已重新提取；`config-resource-checks.json` 记录比较结果。不能以旧 PathID 永久对应同一对象为前提，当前解码同时检查对象名称、层级及实际引用。

## 复跑

native 每份 JSON 的 `result.selection` 保存旧批提取器的完整参数；同指纹时可按它复跑，或由根目录的 `replay.py` 读取。使用的提取器为 `docs/research/evidence/facing-semantics-20261113/extract.py`，其指纹随 JSON 保存。slot 跳板的复跑命令为：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/facing-conditions-20261114/attack/slot-helper.json \
  disasm-at 0x180005610 --max-bytes 192
```

配置脚本的选中对象清单、使用的旧 type-tree 解码工具与 Bundle 指纹均保存于 `current-config/decoded.json`：

```sh
python3 docs/research/evidence/facing-conditions-20261114/attack/extract-config.py
python3 docs/research/evidence/facing-conditions-20261114/attack/check-config-resources.py
```

未穷举全游戏配置；firstCastTarget、faceToTile、force 尚无本轮实际启用正例。三项专属 override 的 native 分支已证实，未将它们冒充已闭合的实际 Content 路径；特殊算法、热更新和其它方向写入仍按各自证据范围解释。
