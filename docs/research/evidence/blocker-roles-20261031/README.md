# 阻挡角色与初始 Enemy 掩码

取证日期：2026-10-31；工作树基线 `54b73aaea29e7785e8c24f403abfed5785210e83`；uv 0.12.24。结论集中见 [案例 23](../../cases/23-blocker-and-blockable-roles.md)。

- `extract.py`：复用 skill 的 UnityFS／SerializedFile 读取器，按资源自带 type tree 完整消费所有含 `_specificBlockMask` 的对象，投影掩码与相关字段。包括派生类型；无法解码或长度不符时失败，不静默跳过。
- `controllers.json`：38 个 bundle 的路径名、大小与 SHA-256，2,173 个控制器／20 种序列化类型的数量，非零掩码匹配列表（为空），以及扫描脚本与共享读取器指纹。
- `native-methods.json`：本轮 metadata 方法检索与 DLL／metadata 指纹。与旧调查一致，复用旧原生指令；未将旧指令冒充新反汇编。

从仓库根目录复现：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/blocker-roles-20261031/extract.py --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/blocker-roles-replay/controllers.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked .agents/skills/arkbattle-native-research/scripts/native.py --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/blocker-roles-replay/native-methods.json search get_canBlockEnemies
```

脚本不需要第三方 Python 依赖，Unity bundle 解压仍使用系统 liblz4。扫描限定 `battle/enm_pfb_*.ab`；没有读取所有其他资源、运行时动态写入或 live XLua。资源 type tree 的共同字段证明结构继承，20 种序列化类型不冒充已经解析命名的 20 个运行时类型。

PRTS 页面与读取限制、复用原生证据的位置均在案例中说明。阵地屏障的属性未被当作普通阻挡关系的直接证据。

同日补查阻挡者移动与角色特殊移位，见 [movement/README.md](movement/README.md)。新增提取与原资源扫描分别保留，结论仍集中在案例 23。
