# Projectile 来源与目标生命周期：证据归档

## 调查问题与范围

取证日期：2026-10-21。区分来源／目标身份、存活与空间资格，核对消失后追踪、命中、来源数值及缓存回退路径。

## 来源与文件用途

DLL／metadata、输入文件与摘录指纹见 [manifest.json](manifest.json)；资源 PathID、发射器字段和缓存见 source-binding/、source-damage/ 中的精选 JSON。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [presence/](presence/)：死亡、撤退、消失与异常标记相关指令及字段。
- [target/](target/)：目标身份、追踪与失效处理的原生摘录。
- [source-binding/](source-binding/)：ObjectPtr／MountPoint、来源绑定及实际套索／维什戴尔资源投影。
- [source-damage/](source-damage/)：来源伤害读取与缓存回退，以及相关角色／敌人字段样本。
- [manifest.json](manifest.json)：批次输入与证据文件校验值。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/projectile-lifecycle-20261021 --out .cache/native-research/projectile-lifecycle-20261021
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

原报告保留提取／xref 线索，完整临时 helper 和解码工具未随本批次归档。

## 限制与关联结论

不把 Unity 对象有效性、Entity.alive 和场上资格混为一谈；历史文件名的修正说明保留在原报告。未执行客户端或审计现场 XLua，精选样例不覆盖所有 Projectile 子类。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/18-projectile-source-and-target-lifecycles.md)。本 README 只登记证据用途与复查方式。
