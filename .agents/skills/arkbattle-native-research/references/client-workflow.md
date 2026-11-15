# 客户端实现调查

用于核实配置的消费方式、条件、公式与时序。配置来源和资源绑定见[配置调查](configuration-workflow.md)；已有证据足够时无需重新反编译。

## 输入与定位

从仓库根目录运行，路径可按实际安装位置替换：

```sh
skill=.agents/skills/arkbattle-native-research
game='/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'
work=.cache/native-research/implementation
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/probe.json" probe
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/methods.json" search 'Enemy.CheckBlockable'
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/type.json" type 'Torappu.Battle.Enemy'
```

`probe` 记录 DLL／metadata 指纹及本次定位的注册表。当前解析器适用于 Windows x64、metadata v29 和已核对的 Arknights 92-byte TypeDefinition；格式不符先核对解析器，客户端更新后重新定位，不套旧索引或地址。依赖由 `uv` 和锁文件管理，已缓存时可加 `--offline`。

`search` 按方法全名做子串检索，`type` 要求完整类型名。先核对签名、重载、返回类型和 slot；共享原生地址不表示方法身份相同。字段偏移区分 boxed 与 unboxed，`runtime-only-table` 不解释为字段为空。

## 追踪实现

按问题追踪输入、条件、状态写入和下游调用。以下索引、分支地址及常量地址均取自本次结果，按需执行：

```sh
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/body.json" disasm "$method_index"
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/branch.json" disasm-at "$branch_va"
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/callers.json" xrefs "$target_va"
uv run --locked "$skill/scripts/native.py" --game "$game" --out "$work/constant.json" read "$constant_va" --format '<f'
```

- `disasm` 支持批量索引；批量分析可复用 `Native` 实例，避免反复解析客户端。
- `fullyDecoded` 只表示选定代码区间解码完整。尾跳转、funclet 和 `targetOutsideRange` 指向的分支仍需展开；截断结果不能证明完整行为。
- `xrefs` 只给 E8/E9 直接调用候选；确认指令边界和实参。虚调用、delegate 和间接调用需结合类型、slot 与实际分派核实。
- 公式核对常量、取整和限幅；时序核对真实调用者及前后状态。客户端时间、逻辑帧和项目 Tick 分别记录。

涉及具体内容时回查选中的配置及资源引用；默认值、覆盖来源和触发者不能只凭字段名推断。静态分支注明 XLua／特化入口的未核实范围。仍有影响结论的歧义时再做最小实验或指令模拟，记录输入、stub 和未执行部分。

## 归档与复查

保留实际方法全名、index／VA、字段布局、关键分支和输入指纹；结论区分指令直接证明与调用链推断。辅助解析格式可参考 [Il2CppDumper](https://github.com/Perfare/Il2CppDumper/tree/master/Il2CppDumper/Il2Cpp)，实际布局以本次文件为准。

```sh
uv run "$skill/scripts/archive.py" --batch docs/research/evidence/example-YYYYMMDD
uv run --locked "$skill/scripts/replay.py" docs/research/evidence/example-YYYYMMDD --game "$game" --out "$work/replay"
```

`replay.py` 先核对历史指纹，再读取已登记的原生／资源选择器，可用 `--method` 限定方法。版本不符先重新定位；不可复查项返回非零并列入 `result.unavailable`。它不恢复专用解码、JSON 扫描、模拟 stub 或运行时热更新。`archive.py` 不带 `--batch` 时处理所给父目录下的全部批次。
