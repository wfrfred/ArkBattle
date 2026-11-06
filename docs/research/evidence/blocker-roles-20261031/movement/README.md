# Character 特殊移位与默认状态机

取证日期：2026-10-31；项目基线 `378ff7d35353fcea6e173953100087029952de68`。本轮核对普通 Character 是否执行自主路线移动，以及特殊移位是否只是连续坐标写入。结论与外部资料集中在[案例 23 的移动补查](../../../cases/23-blocker-and-blockable-roles.md#补查阻挡者是否会自主移动)。未修改项目实现，未运行游戏或核实活跃 XLua。

## 输入与工具

输入路径、大小、SHA-256、metadata v29、image base、CodeGenModule 定位与共享工具指纹见 `selected-character-movement.json.provenance`。DLL SHA-256 为 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`，metadata 为 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`，与原角色扫描及 2026-10-23 阻挡调查一致。

工具为 uv 0.12.24、Python 3.14.8、Capstone 5.0.7。共享 skill 在被 Git 忽略的 `.agents` 中，其实际版本由 provenance 的源码 SHA-256 标识，不把项目提交号当作工具源码版本。

## 文件与复现

- `extract.py`：复用 skill 的 `Native`，按本次 metadata 完整名称选择 Character 移位与默认状态机构造方法，继续展开同一方法区间内的分支及 fall-through；不复制 PE／metadata 解析器。附带当前 `FinishMe` 的 slot 定位。
- `extract.py.lock`：固定与共享工具相同的 Capstone 依赖及制品校验值。
- `selected-character-movement.json`：保留相关方法、默认状态方法表、完整选定代码区间及输入／工具指纹。省略无关的大量共享地址别名并记录数量；不把别名当作实际调用者证据。

从仓库根目录执行，可用 `--game` 指定客户端目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  docs/research/evidence/blocker-roles-20261031/movement/extract.py \
  --out .cache/native-research/moving-blocker/archive-replay.json
```

本轮实际执行上述命令，将结果保存为本目录的 `selected-character-movement.json`。脚本从当前 metadata 重新定位，不套用旧方法编号；比较结果时仍需先确认输入指纹。

## 定位与范围

| 方法／位置 | 可直接核查的事实 |
| --- | --- |
| `Character.MoveLikeRespawnSelf` 75978，`0x180a2c347` | 调用虚 slot 117，随后调用 `_MoveLikeRespawn`。 |
| `Character.MoveLikeRespawnExternal` 75979，`0x180a2bfe7` | 同样先调用虚 slot 117，再执行特殊移位。 |
| `result.finishMethod`，`Character.FinishMe` 75971 | metadata slot 为 117；不是仅凭虚表 displacement 命名。 |
| `Character._MoveLikeRespawn` 75980，`0x180a3698d` | 调用 `Deck.SpawnCharacterOrToken`；结合前述调用区分结束旧对象与生成新对象。 |
| `Character.ConstructStateMachine` 76034、`Character/States.ConstructStateMachine` 76146 | 默认状态机构造与状态方法表；其中没有 Enemy 那套普通 MoveState，不据此证明全部派生或热更路径不存在移动。 |

旧 `Character.OnFinish` 的清场、容量／volume 变化入口与 `Enemy.MoveState.OnTick` 不重复复制，分别引用[旧关系调查](../../blocking-native-20261023/retention/report.txt)与[对象运动及搜索调查](../../blocking-timing-native-20261023/order/report.txt)。后者的 `76658.asm` 在 `0x180a979a5` 检查自身正在阻挡的战斗目标，存在时转入战斗，不能把可选 Enemy 阻挡能力解释为普通边走边阻挡。

区间内分支已展开，但区间外调用、虚调用实际对象、技能覆盖与运行时 XLua 仍须按具体问题核对。这批静态证据不证明每种特殊移位的全部继承／清理细节，也不构成自主移动 Blocker 的真实内容实例。
