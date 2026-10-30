# Ammo、SP 与 TIME 的原生公式：证据归档

## 调查问题与范围

取证日期：2026-10-29。分别核对弹药容量归并、SP 配置／支付和技能时长调整的原生公式、取整位置及实际消费链，避免从普通 Attribute 公式外推。

## 来源与文件用途

[ammo-native.json](ammo-native.json)、[sp-native.json](sp-native.json) 与 [duration-native.json](duration-native.json) 保存客户端与工具指纹；[ammo-content.json](ammo-content.json) 和 duration-native.json 的 sources／components／templates 保存实际内容绑定及 Bundle 指纹。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [ammo-native.json](ammo-native.json)：EventCounter／Ammo 最大计数归并、源协议、类型和指令锚点。
- [ammo-content.json](ammo-content.json)：弹药上限修正动作、相关触发节点与实际技能／角色配置。
- [sp-native.json](sp-native.json)：SP 配置、资格、支付及余额写入路径。
- [duration-native.json](duration-native.json)：初始 TIME、雷狼龙S空爆／哈蒂娅延时与所查 Fever 分支的指令和实际资源链。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/skill-parameter-formulas-20261029 --out .cache/native-research/skill-parameter-formulas-20261029
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

保留 helper／部分 asset decoder 的 SHA 和 Python 版本，完整专用解码脚本及原执行命令未归档。

## 限制与关联结论

公式仅适用于已查普通分支；不以配置共存证明实战叠加已观测，也不以数学结果决定项目接口。不同 Skill 子类的支付顺序须按本记录分别解释；未验证现场 XLua。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/09-skill-mechanisms-and-requirements.md)。本 README 只登记证据用途与复查方式。
