# 属性数值与限幅元数据：证据归档

## 调查问题与范围

取证日期：原取证日期未记录；目录名保留，不以首次提交日期代替调查日期。核对属性变脏时 MaxHP／HP 的处理以及属性最终归并、限幅和元数据声明，保留字段 token 与原始 attribute blob。

## 来源与文件用途

[attribute-meta-evidence.json](attribute-meta-evidence.json) 保存 metadata 源文件路径、字段 token、blob 偏移与字节，以及构造器定位。本批次未独立保存 DLL／metadata 文件指纹，不能仅凭路径断言它与其他批次属于同一客户端。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [attribute-meta-evidence.json](attribute-meta-evidence.json)：maxHp、magicResistance 等属性元数据的原始 blob 与已解码字段。
- `*.asm`：属性归并、限幅和 HP 比例调整相关指令摘录。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/numeric-parameters --out .cache/native-research/numeric-parameters
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

没有可核实的原工具与命令记录。

## 限制与关联结论

原取证日期、客户端完整指纹、工具版本、提取命令和专用元数据解码脚本均未记录。复现入口会将缺少原始输入身份依据的选择器列为 `unavailable`。需要重新调查时可按 skill 检索当前客户端并另存本轮来源，不能把新的客户端读数回填成这批历史材料的来源。

原生证据的解释见 [属性与数值调查](../../02-combat-buffs-and-effects.md)。本批次没有独立编号案例，不新增重复结论。
