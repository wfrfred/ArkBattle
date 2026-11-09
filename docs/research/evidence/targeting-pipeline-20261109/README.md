# Targeting／Targetable 通用调用链原件

日期：2026-11-09；项目基线 `9a24854`。机制结论集中维护在[案例33](../../cases/33-targeting-and-targetable-pipeline.md)，本目录保存方法／资源选择、版本、必要原件与复跑入口。未修改 Core、Content 或架构契约。

## 来源与边界

客户端为 Windows x64、IL2CPP metadata v29：

- `GameAssembly.dll` SHA-256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat` SHA-256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

本次 probe 与11月3日若干旧批相同；当前消费者按完整方法名重新定位，早期案例的 index／VA 不直接套用。每个 JSON 保留自身 provenance；Bundle 与固定数据镜像的实际来源、PPtr、修订及指纹见 Content 子目录。旧案例和原件的引用目的与文件指纹见 `reused-evidence.json`；文件被引用不表示它所用的早期客户端版本自动变成当前版本。

静态原生分析没有运行完整游戏，也没有验证实际启用的 XLua。枚举分支与普通原体可直接证明该路径的消费者；实际内容是否启用另由配置链说明。未找到非默认样本只限制本次选定范围。

## 文件

| 文件／目录 | 选择与用途 |
| --- | --- |
| `extract_qualification.py`、`.lock` | 复用 skill 的 Native 解析器，按完整方法名提取本次资格／来源／范围方法；原生地址只用于已经定位的虚派发 helper。 |
| `qualification-methods.json` | 基础 Selector、TargetOptions 与 validator 的精确方法清单。 |
| `qualification.json` | 以上方法的完整签名、相关类型字段与分段指令；包括 Reset／SetData、黑板更新、SourceSnapshot、基础 Validate。 |
| `qualification-mechanism-methods.json`、`qualification-mechanisms.json` | 目标可选性、当前异常查询、阻挡选择的额外验证、范围 Verify 与地图层；保留 `0x180025df0` 虚派发 helper，确认 slot87。 |
| `qualification-source-methods.json`、`qualification-sources.json` | 目标异常的有效性／免疫、来源运动方式、能力 Purpose；附当前 Selector／Range／Validator 继承及方法清单，清单不冒充全部路径已调查。 |
| `range-methods.json`、`range.json` | PhysicsRange／GlobalRange 的候选生成、Box2d 查询的有效／alive／去重／TargetOptions 与自定义 validator。 |
| [priority/](priority/README.md) | 权重、优先队列、二次优先、阻挡加前、晚嘲讽、随机、数量，以及角色／敌人仇恨与路线距离来源。 |
| [binding/](binding/README.md) | 从触发搜索到输入绑定、source／timing、施放名单、逐项验证、发射与最终作用的锚点。 |
| [content/](content/README.md) | 真实模式／能力／Selector 配置、固定数据的解锁引用、非默认字段样本与有限调查范围。 |
| `prts-sources.json` | 本次查阅的社区资料、用途和不能据此证明的范围。 |
| `archive.json` | 由 skill archive.py 生成的本批输入／方法／块／字段选择与复查清单。 |

原体按下一已知方法边界保留连续 `.pdata` 片段。`fullyDecoded` 仅说明选取区间的解码，不保证某个派生类、间接调用、跳转数据表或 XLua 也已闭合；抽象／无直接指针的方法单独标记 unavailable，不伪造原体。方法的实际调用者、虚槽与 generic 身份在对应证据中另有绑定。

具体边界：TargetSelector.CheckTargetIn 与 Range.CheckTargetIn 没有直接原生指针，按虚槽使用具体 Range 实现；TargetSelector.FindTargets 的 `0x180a41473–0x180a414c6` 选录包含尾部零数据，最后一字节未解码，不将该区域解释为业务分支。其他资格／来源／范围选定方法的已取分段均解码完整；Priority 的表数据限制见其 README。

## 复跑基础资格

从仓库根目录运行，输出到新的工作目录：

```sh
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
batch=docs/research/evidence/targeting-pipeline-20261109
work=.cache/native-research/targeting-qualification-replay
export UV_CACHE_DIR="$PWD/.cache/uv"

uv run --locked --offline "$batch/extract_qualification.py" --game "$game" \
  --out "$work/qualification.json" --methods-file "$batch/qualification-methods.json"
uv run --locked --offline "$batch/extract_qualification.py" --game "$game" \
  --out "$work/qualification-mechanisms.json" \
  --methods-file "$batch/qualification-mechanism-methods.json" --address 0x180025df0
uv run --locked --offline "$batch/extract_qualification.py" --game "$game" \
  --out "$work/qualification-sources.json" --methods-file "$batch/qualification-source-methods.json" \
  --type Torappu.Battle.Range --type Torappu.Battle.Entity --type Torappu.Battle.Ability \
  --address 0x1800252e0
uv run --locked --offline "$batch/extract_qualification.py" --game "$game" \
  --out "$work/range.json" --methods-file "$batch/range-methods.json" \
  --type Torappu.Battle.PhysicsRange --type Torappu.Battle.GlobalRange
```

脚本通过元数据名称重新定位普通方法；`--address` 仍绑定上述指纹。换客户端后须先定位虚派发 helper，不能只替换预期哈希。来源与布局检查、清单复查也可以分别运行：

```sh
uv run .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py "$batch" \
  --game "$game" --out "$work/replay"
```

本批已完成全量清单复查：2779项方法身份／选录、68项类型、6项常量、17个实际 Bundle，未出现不可复查选择项；这些数字不是2779个独立反编译函数体。专用 Binding 脚本亦已重放比较结果，配置与其余方法已按最终脚本重新提取并核对脚本／查询指纹。仅复查一个方法时可追加 `--method 76375`。

这类 replay 验证登记的原生选录／资源选择，不执行私有解码和游戏运行。其余子调查的专用复跑命令见各 README。需要 uncached 依赖时去掉 `--offline`。
