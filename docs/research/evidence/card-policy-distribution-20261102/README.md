# CardPolicy、消耗行为与回收涨费的实际分布

取证日期：2026-11-02；项目基线 `bcff16edc10264fdbb7a8acd0dbd77b07ec89cb0`。结论集中维护于 [案例 24 第十二节](../../cases/24-deployment-cost-and-supply.md#十二cardpolicy消耗行为与回收涨费的实际分布2026-11-02)。本批只调查资料与客户端，不修改游戏实现或决定项目政策。

## 文件

- `assets.py`：复用 native-research 的 UnityFS／SerializedFile 读取器，以及 [上一批的 type-tree 结构读取](../blocker-roles-20261031/extract.py)。按每个对象自己的完整 tree 解码；任何长度不符均失败。选择含 `_cardPolicy` 字段的对象，不按固定 native 偏移猜测序列化布局。
- `controllers.json`：全部 7 个 `pkgrps/btl_pfb_tokens_*.ab` 的大小和 SHA-256，以及 941 个控制器的 SerializedFile、PathID、对象名、原始对象哈希和精选字段／偏移。
- `summarize.py`／`summary.json`：按策略及 `_isInfinity` 等字段汇总。`token_` 前缀组为 69 个；没有将隐藏／自动生成／未发布的控制器当作已验证可手动部署的卡牌。
- `native.py`／锁文件：使用 skill 的 Native 解析器重新定位 getter、枚举、Draw、Recharge、OnRecycle、费用参数与 CardBuff 写回。扩展扫描 Card 方法中相关字段偏移的出现位置，用于发现写入者；字节命中本身不作为字段写入证明，实际结论按反汇编指令判断。
- `native-evidence.json`：本轮 DLL／metadata 指纹、类型／字段、方法签名和 31 个相关方法的分段指令。省略无关共享泛型地址别名；保留 static 分支，不包含完整客户端或运行时实验。

## 从仓库根目录复现

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/card-policy-distribution-20261102/assets.py --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' --out .cache/native-research/card-policy-replay/controllers.json
python docs/research/evidence/card-policy-distribution-20261102/summarize.py .cache/native-research/card-policy-replay/controllers.json --out .cache/native-research/card-policy-replay/summary.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked docs/research/evidence/card-policy-distribution-20261102/native.py --out .cache/native-research/card-policy-replay/native-evidence.json
```

资源脚本无第三方 Python 包，解压依赖系统 liblz4；native 脚本使用锁定的 Capstone 5.0.7。共享脚本路径、哈希和 Python 版本在原生 provenance 中，资源和本批脚本哈希另由 archive.json 登记。native 脚本使用 metadata 名称重新定位，不套用旧索引；已有记录对应 DLL `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`、metadata `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。

## 关键原生定位

| 方法／字段 | 当前定位 | 核对结果 |
| --- | --- | --- |
| CardPolicy 枚举 | DEFAULT=0、UNIQUE=1、QUEUED=2 | 从 metadata 压缩有符号默认值解码。 |
| CharacterCard.get_cardPolicy / get_isInfinity | 67058 `0x180707aa0` / 67055 `0x180707bc0` | 普通分支分别返回 1、true。 |
| TokenCard.OnFetchDataFromPrefab | 67095 `0x18071d000` | 将 Token 的 policy、rechargeOnlyOnce、isInfinity 读取到 Card 的 `+0x1e8/+0x1f4/+0x1fc`。 |
| Card.Draw | 66861 `0x1806eb980` | isInfinity 为真越过份数递减；普通状态更新路径对 DEFAULT 启动 Timer，对 UNIQUE 切 INUSE，对 QUEUED 检查待恢复数和状态。 |
| TokenCard.Recharge | 67088 `0x18071d4d0` | 先检查 isInfinity；NORMAL 路径的 rechargeOnlyOnce 检查位于其后。不能把该字段仅凭名称推导成“离场归还一次”。 |
| Card.OnRecycle | 66867 `0x1806ecc70` | UNIQUE 且原状态 INUSE 时 Reset 计时、切 RESPAWNING；`0x1806ecd6f–0x1806ecd78` 按 `m_addRespawnCostMultCnt(+0x15c)` 增加计数 `+0x158`。QUEUED 另有专门状态／计数分支。 |
| Card 构造 / _UpdateCardBuff | 66853 / 66869 | 构造写计数开关为 true；`0x1806f1138` 从本轮 Buff 求值结果写回它，因此不是不可变的“只要回收必涨费”规则。 |
| Card.ModifyRespawnParameters | 66902 `0x1806eca10` | 另有直接修改计数及倍率参数的显式操作，普通 OnRecycle 增量路径不等于计数只有这一种写入来源。 |

Draw 的 freely、forceReduceRemainingCnt、dontUpdateState、forceDraw 是已有独立参数；本批没有把普通默认调用概括为所有特殊入口。OnRecycle 的进入本身也不证明对应现实退出原因一定走此分支。

## PRTS 与边界

2026-11-02 核对 [中继器](https://prts.wiki/w/中继器)、[Mon3tr](https://prts.wiki/w/Mon3tr(凯尔希的召唤物))、[弦惊](https://prts.wiki/w/“弦惊”)、[风雪之眼](https://prts.wiki/w/风雪之眼) 等页面的再部署策略说明。Wiki 是社区资料；中继器的可用数／冷却数与串行恢复描述用于交叉验证，标有存疑的动态上限和多来源合并不纳入结论。

本批资源统计只覆盖指定的 7 个包，非完整游戏实例生成分布；不计关卡放置次数，不穷尽其他包、Lua 覆盖、运行时改变或 CardBuff 来源。原生 CharacterCard 无条件 UNIQUE 与 isInfinity 为真是类级默认，不冒充逐个角色所有特殊状态均不改变。本批没有完成全部退出原因到 Recharge／OnRecycle 的实际实参链；有限份数也不能直接等同于“永远不返还”。
