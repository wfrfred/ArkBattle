# 蒂比空中阻挡精选证据：证据归档

## 调查问题与范围

取证日期：2026-10-29。核对 char_4191_tippi 的初始控制器、起降模式、飞行／地面 Buff、图形高度及运动禁选访问器，区分内容触发时点与通用 Skill 生命周期。

## 来源与文件用途

[selected-assets.json](selected-assets.json) 的 sources 保存资源 SHA、CAB、PathID 与模板字段路径；[selected-native.json](selected-native.json) 保存 DLL／metadata 指纹、原生方法／枚举及复用证据的路径和校验值。Unity PathID 保留十进制字符串。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [selected-assets.json](selected-assets.json)：角色初始字段、Default／S1／S2 起降程序、Buff 与图形高度节点的必要投影。
- [selected-native.json](selected-native.json)：运动禁选访问器、签名、原始指令、压缩枚举与既有 Blocking 证据锚点。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/tippi-air-blocking-20261029 --out .cache/native-research/tippi-air-blocking-20261029
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

保存了对象与字段定位和局部解码校验，完整专用提取器／命令未归档。

## 限制与关联结论

省略字段不表示字段不存在；初始 WALK 与已查起降节点不代替全部外部／全局 Buff 审计。sourceMotionMode 的完整调用方取值链和现场 XLua 未在此批次核实。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/21-tippi-air-blocking.md)。本 README 只登记证据用途与复查方式。
