# 部署朝向与巨型占据范围

取证日期：2026-11-01；工作树基线 `1724630ed8f726a5f10387ebd2b296608970ebfa`。工具为 native research skill 的共享 `native.py`，uv 0.12.24、Capstone 5.0.7。结论集中于[案例 24](../../cases/24-deployment-cost-and-supply.md)。本批区分可选部署朝向、巨型范围、位置封印和原生身体朝向，不确定项目的数据模型或接口。

## 来源与证据边界

**C：具体社区机制。** 2026-11-01 查阅 PRTS 的 [TN-4 岁相](https://prts.wiki/w/TN-4_辞旧岁/敌方情报pro#岁相)、[封印的地面](https://prts.wiki/w/封印的地面#装置机制)与[“谐振器”](https://prts.wiki/w/“谐振器”#装置机制)，逐项发现见 `sources.json`。

- 岁相在该作战的占据范围为宽 3.95、高 4.95 的矩形，偏移为向上 2、向左 0.5；无法移动且不可阻挡。出现时先移除范围内的我方单位，再在相应地块部署封印的地面。
- 封印的地面通过占用位置禁止玩家部署，自身没有受击判定区域。巨型范围、命中范围与封印装置在这些说明中承担不同职责。
- 谐振器机制明确区分有朝向设置的部署单位和无朝向设置的可选召唤物：前者沿部署方向发射束流，后者由机制规定向左发射。不能仅凭“可以部署在此处”断言都有相同的朝向设置。

**N：当前客户端类结构与普通 native 分支。** 下述 `EnemyGiantBoss` 是原生类级别证据，**本批没有恢复岁相 prefab 到该类的资源绑定**，不将其冒充为上面社区实例的完整官方调用链。没有运行完整客户端或核实 live XLua 覆盖。

## 原生输入

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `Arknights_Data/il2cpp_data/Metadata/global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

Windows x64 PE、metadata v29，51811 个类型与 326501 个方法。方法、类型和字段从本轮 metadata 重新定位，不复用旧版索引。完整输入、工具脚本指纹和注册表记录位于各 JSON 的 `provenance`。

## 类与调用定位

`selected-types.json` 只保存四个相关类型的继承身份、必要字段及六个方法签名：

| 对象 | 本轮证据 |
| --- | --- |
| `Entity.m_direction` | `SharedConsts.Direction`，实例偏移 `0xec`；getter 67390、setter 67391。原生基类存在方向字段不等于每类对象都允许玩家选择部署朝向。 |
| `Enemy._locateRange` | 独立 `Range`，偏移 `0x2d8`。同类型另有身体方向策略、实际碰撞器和碰撞半径字段。 |
| `Enemy.SetBodyAndFaceDirection`／`_CalculateFaceDirection` | 方法 77788／77833，身体方向输入及计算结果使用 `UnityEngine.Vector2`，与部署入口的离散四向参数不应只凭同名混同。 |
| `EnemyGiantBoss` | 另有 `_locateTileEffectKey`（`0x5a0`）与 `_tokenToSpawn`（`0x5a8`）。 |

`giant-born.json` 保存 `EnemyGiantBoss._DoBorn`（78312）的本轮原生正文及后续 `.pdata` 分段，包含下列明确调用：

- `0x180adc502`：`Tile.GetCharacter`。
- `0x180adc58a`：`Tile.ClearCharacterIfExists`。
- `0x180adc5de`：`BattleController.CreateRuntimeInstance`。
- `0x180adc63f`：`BattleController.CreateEffectAtMapPos`。

这直接记录类的清场、创建实例与位置特效路径，不由类名推定具体内容 key。正文保留代码字节与地址；共同空桩有大量同址别名时，以 `sharedMethodAliasCount` 标记省略的别名枚举，不任意选其中一个身份。`fullyDecoded` 仅表示所选代码区间完整解码，不保证所有间接调用、热更和具体内容可达性均已展开。

## 文件与复跑

| 文件 | 用途 |
| --- | --- |
| `sources.json` | 社区页面、章节、查阅日期与逐项发现。 |
| `probe.json` | 本次客户端输入指纹和解析定位。 |
| `selected-types.json` | 必要类、字段和方法签名，不是整套 metadata 转储。 |
| `giant-born.json` | 巨型敌人类 `_DoBorn` 的范围与原始指令。 |
| `extract.py`、`extract.py.lock` | 本问题的可独立复跑入口和固定依赖。 |
| `archive.json` | 材料哈希与共享 replay 可读取的选择器。 |

从仓库根目录执行；输出目录可以不存在，`--game` 可换成具有上文指纹的另一安装目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked docs/research/evidence/deployment-direction-20261101/extract.py \
  --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
  --out .cache/native-research/deployment-direction-replay
```

缓存完整时可以加 `--offline`。入口先核对记录指纹，再按完整类型和方法名定位，使用共享 `Native` 解析和反汇编能力；不依赖此前的临时工作输出，不复制客户端。该命令重建本批 native 材料；PRTS 资料按所列页面复查，不能由静态方法提取替代具体资源绑定或运行现场观察。
