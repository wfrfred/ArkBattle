# Route 操作与状态保留调查

2026-11-07。依据完整方法／类型集合、真实写入、调用者和选定内容，调查创建、修改、替换、重置、切换与恢复。机制结论、状态矩阵及证据缺口集中在[案例 31](../../cases/31-route-operations-and-state.md)；本批不修改 Core 或确定最终 API。

## 来源与范围

本机 Windows x64、IL2CPP metadata v29、imageBase `0x180000000`：

- GameAssembly.dll：223112680 bytes，SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- global-metadata.dat：46669332 bytes，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

资源 Bundle 各自记录身份及指纹。镜像数据固定修订 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`；客户端与镜像是两种来源，不假定同一次构建。配置引用、组件绑定、条件可满足与游戏观测分别判断。

| 材料 | 作用 |
| --- | --- |
| `inventory.py`／`inventory.json` | 从 Route／Enemy／BasicCursor 及实际继承关系建立完整声明清单，再扫描全 Torappu 方法签名与字段类型引用；31 类型、92 签名、19 字段所属类型 |
| `data-source-verification.json` | 完整 Character／Skill 原始表与固定修订的 Git blob 逐文件核对；实际条目由子目录选择器摘录 |
| [endpoint/](endpoint/README.md) | 热情导游的施放、全局标记生产、目标选择与终点覆盖条件闭合 |
| [cursor/](cursor/README.md) | Route 全部 39 个普通方法、Cursor／相关 Checkpoint 普通方法、状态写入、直接调用候选及 Enemy 派生槽位／覆盖方法审查 |
| [content/](content/README.md) | Enemy 347 方法的槽写入筛选、业务入口及调用者、实际模板／Prefab／固定关卡绑定 |
| [temporary/](temporary/README.md) | Fear／Attract／Trace 接管、更新、恢复及实际内容引用 |
| [navigation/](navigation/README.md) | 地块与 Map 路线导航更新、登记表维护、机制使用者 |

复用[路线创建批次](../route-creation-20261107/README.md)、[Checkpoint 语义批次](../checkpoint-semantics-20261107/README.md)和[非默认参数内容批次](../checkpoint-nondefault-20261107/README.md)；正文链接原件，不重写旧材料的取证身份。

## 复跑与校验

仓库根目录执行，具体资源解码命令见子目录 README：

```sh
python3 docs/research/evidence/route-operations-20261107/inventory.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-replay/inventory.json
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/route-operations-20261107 \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/route-operations-replay/native
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/route-operations-20261107
```

方法正文保留精确 selector／index／token／VA、连续代码片段与工具边界；直接引用与槽写入候选均不是未经确认的语义结论。泛型共享、反射、委托、间接写入和在线 XLua 仍有各自限制。未运行客户端或 Core 测试；研究脚本、JSON、清单与本地引用单独校验。
