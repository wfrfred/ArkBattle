# Talent 生命周期与原生容器：证据归档

## 调查问题与范围

取证日期：2026-10-13。核对 Talent 的 Attach／Detach、数组／容器写入与使用，以及普通复活、撤退重部署和整局状态的边界。

## 来源与文件用途

[records.json](records.json) 的 clientFiles 保存本轮 DLL／metadata 指纹，locator 保存当前方法／虚表定位，nativeMethods 和 declaredFieldProjection 保存正面摘录。不能与旧客户端索引混用。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [records.json](records.json)：原生方法与字段投影、metadata 类型层次、发现及明确 unknowns。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/talent-lifecycle-20261013 --out .cache/native-research/talent-lifecycle-20261013
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

记录了定位方法和指令范围，原完整 helper、专用提取命令和工具 Git 提交未保存。

## 限制与关联结论

没有完整展开 shared generic collector 的 MethodInfo 与所有 Prefab 创建链；没有普查子类、模式可达性或现场 Lua。未列出的字段和服务不代表不存在，具体天赋计数的保留／重置仍须逐内容核对。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/06-talent-lifecycle-and-model.md)。本 README 只登记证据用途与复查方式。
