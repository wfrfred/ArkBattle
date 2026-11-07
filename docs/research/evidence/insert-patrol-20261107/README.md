# Insert 与巡逻路线的交叉筛选

2026-11-07。检查已定位的保留旧路线 Insert 使用者，是否实际作用于包含 PATROL_MOVE／ALERT 的路线。结果与范围见[案例 31](../../cases/31-route-operations-and-state.md)第 4.1 节，不把算法可构造反例当作已启用玩法。

## 输入与选择

- 关卡镜像：`Kengxxiao/ArknightsGameData` 固定提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，完整 `zh_CN/gamedata/levels/obt/**/*.json` 与 `activities/**/*.json`，共 4,025 文件。完整目录与 Git blob 的先前核验见[前批配置材料](../checkpoint-nondefault-20261107/config/README.md)；本轮命中的文件另记录原始大小和 SHA-256。
- Insert 模板选择复用[上一批递归提取](../route-operations-20261107/content/route-templates.json)：20 个模板、38 处节点。先清空旧程序的组合不作为“保留原巡逻再插入”的正例。
- 原生与 Bundle 的准确指纹、选择器随 [content/](content/README.md)、[reid/](reid/README.md)、[acfnc/](acfnc/README.md) 保存。客户端与关卡镜像版本分别记录；均非实机运行。

`scan.py`／`scan.json` 扫描 routes、extraRoutes 全部路点；按主 waves 使用 routes、Branch 使用 extraRoutes 关联有效且 count>0 的 SPAWN。记录随机与 Branch 原始配置而不假定实际已触发。对六个明确敌人键及其前缀变体列出引用，并在同场所有路线中再次检查未引用的 PATROL／ALERT。为未闭合来源的模板前缀追加字面符号筛选，其命中只是候选，不能当作施放或内容归属。

## 材料

| 目录／文件 | 用途 |
| --- | --- |
| `scan.py`、`scan.json` | 完整目录扫描、出生至路线的关联、同场全路线复核与其它模板符号筛选 |
| [content/](content/README.md) | 后兽 Aura 的真实目标策略：其它同侧单位、同 mapLayer、排自身／dyjsfg；作用于目标当前路线 |
| [reid/](reid/README.md) | 复仇者 Rush 的实际组件与 Insert 实参；被修改的是作为 BuffSource 的施放者自身 |
| [acfnc/](acfnc/README.md) | 父模板用于新召唤物，指定 Branch 后头插；当前镜像没有对应符号，资源启用未闭合 |

## 复跑

仓库根目录执行：

```sh
python3 docs/research/evidence/insert-patrol-20261107/scan.py \
  --levels .cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels \
  --out .cache/native-research/insert-patrol-replay/scan.json
python3 .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/insert-patrol-20261107
```

各组件／原生补核的命令见子目录 README。`scan.py` 只需 Python 标准库。1,070 个 null Route 槽位单列，不将其当成解析失败或真实路线；本轮没有 null Checkpoint。

零交集只描述本轮固定静态目录与列明的消费链，不证明任意运行时生成、玩法预处理替换、外部配置或 XLua 都不存在相应组合。仅在前述未知路径建立真实内容后，才需要扩大交叉输入。未修改 Core 或测试。
