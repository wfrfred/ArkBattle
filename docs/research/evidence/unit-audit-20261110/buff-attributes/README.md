# Buff、Attribute descriptor 与整体覆盖组补证

核查日期：2026-11-10。范围是本轮 Unit 测试审计中尚缺依据的三个问题：原始属性 operand 的解释、Buff 合并规则、Effect 整体组政策。没有修改源码、测试或架构文档。

先复用了 [Case 01](../../../cases/01-buff-installation-and-parent-scope.md)、[战斗属性与 Buff 调查](../../../02-combat-buffs-and-effects.md)及 [numeric-parameters](../../numeric-parameters/README.md)，再查 PRTS 与当前客户端的具体消费分支。原有完整四组求值、鼓舞内容绑定与华法琳配置不在本批重复转储。

## 输入与范围

| 输入 | SHA-256 |
| --- | --- |
| `GameAssembly.dll` | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `config/buff_template_holder.ab` | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |

路径、长度、提取工具与脚本指纹保存在 [native/metadata.json](native/metadata.json) 和 [configurations.json](configurations.json)。当前模板 holder 共 9054 项；本批只保留选中 descriptor 子树及其 CAB、PathID、模板内字节范围和哈希。模板存在与真实可执行绑定分开说明。

`native/` 保存 23 个按当前全名重新定位的方法、3 个有实际调用锚点的共享泛型 helper 的指令，以及各段范围／字节哈希。方法按相邻方法边界补齐 `.pdata` 分段。共享空实现地址的海量 metadata 别名没有复制。广搜结果与完整中间 JSON 留在 `.cache/native-research/unit-audit-20261110/buff-attributes/`。

本批仅证明所列静态原生分支。未运行客户端、未验证 XLua/hotfix、未穷尽所有特化 Buff 或内容。泛型 helper 的地址属于本批 DLL，不可直接套用到其他版本。

## 复跑

从仓库根目录执行；默认读取本机安装路径，也可传 `--game`：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/unit-audit-20261110/buff-attributes/extract.py \
  --out .cache/native-research/unit-audit-20261110/buff-attributes/replay-native \
  --expand 0x1853ff1d0 --expand 0x184706710 --expand 0x185cadad0
uv run --offline --locked docs/research/evidence/unit-audit-20261110/buff-attributes/configurations.py \
  --out .cache/native-research/unit-audit-20261110/buff-attributes/replay-configurations.json
```

两个脚本各有锁文件。`extract.py` 复用单个 `Native` 实例；`configurations.py` 使用项目窄格式解码器读取 holder，不依赖旧的全量缓存。输入哈希不同时，应重新定位共享调用目标并重新判断。

机制结论由根任务统一补回 Case01／研究02；证据目录不另存一份长期结论。
