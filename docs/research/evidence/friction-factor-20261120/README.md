# 失衡摩擦的单位倍率与地块附加量

2026-11-20 使用与[推拉取证](../forced-motion-20261118/README.md)相同指纹的 Windows x64 客户端和 IL2CPP v29 metadata。配置摘录另记录实际 Bundle／固定数据表指纹。机制结论见 [Case 15](../../cases/15-locomotion-native-semantics.md#2026-11-20-补核失衡摩擦的来源)。

- [原生记录](native.json) 保存倍率读写、Buff 节点、地块初始化与换格的指令。`excerpt: true` 标出筛选保留的完整指令行。E8／E9 扫描是直接调用候选，范围限于该次二进制。
- [普通关卡](battle-scope.json) 保存支持范围内的冰面、弹力球样例和固定镜像的关卡黑板扫描。
- [地块配置](terrain.json) 保存排除范围内的 `tile_football` 对照样本，供复查地块字段的写入来源。
- [单位配置](enemy-content.json) 保存弹力球的黑板、Prefab 天赋和 Buff 模板绑定。

## 复查

从仓库根目录运行。客户端不在默认位置时，传入 `--game`。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --with capstone==5.0.7 python \
  docs/research/evidence/friction-factor-20261120/extract.py \
  --out /tmp/arkbattle-friction-native-recheck.json
```

资源提取入口和摘录路径见两个配置记录的 `provenance`。静态指令与配置可以核对倍率的读写和已安装内容绑定，脚本热更与实际滑行轨迹需另行观测。

关卡黑板扫描在 `battle-scope.json` 记录的镜像修订执行，从镜像根目录逐文件查找字面键名。

```sh
rg --no-ignore -g 'level_*.json' '"key"\s*:\s*"friction_factor"' zh_CN/gamedata/levels
```
