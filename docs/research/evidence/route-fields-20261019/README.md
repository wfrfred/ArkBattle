# RouteDefinition 字段消费：证据归档

## 调查问题与范围

取证日期：2026-10-19。核对出生、Cursor 和路线完成阶段如何消费 Route 字段，并检查固定数据镜像中相关字段的配置使用情况。

## 来源与文件用途

[manifest.json](manifest.json) 保存 client_inputs 和固定镜像 repository／commit；[summary.json](summary.json) 记录配置扫描范围，[visit-checkpoints-case.json](visit-checkpoints-case.json) 保存具体关卡 Git blob 与路由 JSON Pointer。镜像与安装客户端不自动视为同一版本。

[archive.json](archive.json) 统一登记本批次来源、原始材料清单和当前可复查选择器；历史原件保留原有字段、指令与字节，不改写为本次新提取结果。

- [manifest.json](manifest.json)：客户端指纹、镜像修订、范围与批次文件说明。
- [summary.json](summary.json)：固定修订关卡 JSON 的扫描汇总及排除范围。
- [visit-checkpoints-case.json](visit-checkpoints-case.json)：中心访问开关的具体关卡、路由与出生配置见证。
- `*.asm`：Route、Cursor、随机偏移及完成检查相关原生方法。

## 复现入口

从仓库根目录执行，安装本机客户端及 native research skill 后运行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/replay.py docs/research/evidence/route-fields-20261019 --out .cache/native-research/route-fields-20261019
```

入口按 `archive.json` 的输入指纹核对来源，按 `result.replay` 列出的覆盖范围复查已有方法、字段、常量或资源索引，输出到 `--out`，不覆盖历史文件。当前工具输出带 `provenance`／`result`；这次重新读取不冒充原调查过程，也不自动恢复专用资源投影、旧配置统计或仿真环境。

镜像修订与单文件校验值已保存，完整扫描脚本与当轮全部命令未归档。

## 限制与关联结论

共享入口只重查已有 native／资源选择器，不会重新克隆并扫描全部关卡镜像。恢复完整配置统计需取得同一镜像修订并重建原扫描器；不能用当前镜像替代旧结果。

机制结论、调用链推断、未决项与项目关联集中维护于 [案例](../../cases/14-route-definition-fields.md)。本 README 只登记证据用途与复查方式。
