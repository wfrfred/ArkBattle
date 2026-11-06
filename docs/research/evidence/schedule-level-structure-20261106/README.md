# 两份关卡的主线与分支配置

调查日期：2026-11-06。补充[战斗推进研究第 6 节](../../01-scope-and-battle-flow.md#6-官方-scheduler-已确认的语义)，只核对原始配置镜像的结构；不修改 Core，不据此确定项目 API。

## 来源

先查 PRTS [作战机制·扩展阅读：波次](https://prts.wiki/w/作战机制#扩展阅读：波次)，查阅日期 2026-11-06。该社区页面说明 Wave → Fragment → Action 的层级，不提供独立 Timeline 模型，也没有给出本批分支的实际触发程序。

随后从 `Kengxxiao/ArknightsGameData` 固定提交 `bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d` 读取两份客户端配置镜像：

- [H8-1](https://github.com/Kengxxiao/ArknightsGameData/blob/bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d/zh_CN/gamedata/levels/obt/hard/level_hard_08-01.json)。
- [卫戍模板 act1autochess_h07_02](https://github.com/Kengxxiao/ArknightsGameData/blob/bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d/zh_CN/gamedata/levels/activities/act1autochess/level_act1autochess_h07_02.json)。

本次通过 GitHub 连接器读取固定版本的完整 JSON，再用 `extract.py` 保留必要 JSON Pointer 摘录及完整配置的结构摘要。连接器可能调整空白格式，因此记录解析后完整 JSON 的规范化 SHA-256，不将本地传输文本的哈希冒充原始 Git Blob 指纹。两份记录的 `provenance` 保存版本、路径、来源 URL、哈希算法和选择器；`result.excerpts` 保留对应字段原值。

## 材料与边界

- `level_hard_08-01.json`：一波、六个片段、`branches: null`；保留一个完整片段与一条 count=2、interval=8 的出生动作。
- `level_act1autochess_h07_02.json`：一波、一个主线片段、四个命名分支；保留完整主波、所有分支以及 dragon 所用的 extraRoutes[0]。
- `extract.py`：本问题的可复用提取过程；固定源版本与 JSON Pointer，可从本地原始文件或公开镜像重新提取。
- `archive.json`：本批材料清单与哈希，由共享 archive.py 生成。

两份配置都没有顶层 timeline 字段。只能据此确认这两份的结构；不能从两个样本推出所有玩法均无其他调度入口。分支配置只有 phases，每项是 preDelay 与 actions，未携带触发器。配置存在不能证明实际激活；本批没有重新分析客户端调用，也没有补齐这些具体分支的触发条件。推进游标与 loop 的普通原生语义复用已有研究，不把项目 TRIGGER_BRANCH 命令当作原生证据。

## 复跑

从仓库根目录运行，输出到独立目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run docs/research/evidence/schedule-level-structure-20261106/extract.py --out .cache/native-research/schedule-level-structure-replay
```

已有上述两个同名完整 JSON 文件时，可以离线运行：

```sh
uv run docs/research/evidence/schedule-level-structure-20261106/extract.py --input-dir /path/to/level-json --out .cache/native-research/schedule-level-structure-replay
```

比较新旧记录的 `canonicalJsonSha256`、结构摘要及摘录即可。只更新本批归档清单：

```sh
python3 -B - <<'PY'
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path('.agents/skills/arkbattle-native-research/scripts').resolve()))
from archive import archive
batch = Path('docs/research/evidence/schedule-level-structure-20261106')
(batch / 'archive.json').write_text(json.dumps(archive(batch), ensure_ascii=False, indent=2) + '\n')
PY
```
