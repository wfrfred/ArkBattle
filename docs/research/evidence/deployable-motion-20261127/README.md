# Card 部署体与连续移动、失衡的边界

取证日期：2026-11-27。问题是主线、支线、集成战略、卫戍中经 Card 实际部署的单位，是否还需要自主路线积分或通常的推拉失衡运动。集中结论见 [Case 23](../../cases/23-blocker-and-blockable-roles.md#2026-11-27-补查card-部署体与连续运动)。本批不执行游戏，不规定项目能力组合。

## 新取证

- [prefab-scan.txt](prefab-scan.txt)：使用 [scan_prefab.py](scan_prefab.py) 读取基础安装与本机缓存更新中的 `charpack/*.ab`、`pkgrps/btl_pfb_tokens_*.ab` 和 `battle/prefabs/levelprefabs/**/*.ab`。选择组包内全部 MonoBehaviour，以 SerializedFile 外部引用文件名和 PathID 联合匹配 MonoScript；检查五种已知移动控制器和 Enemy，同时统计 Character、Token、Trap、GiantTrap 作为扫描对照。没有读取所有敌人包，也没有将组件存在解释成运行时启用。
- [prefab-provenance.json](prefab-provenance.json)：输入范围、Bundle 明细、MonoScript 来源、共享读取器与缓存更新 manifest 指纹。缓存更新为 `26-11-13-06-34-18-84612175`；指纹清单在同次扫描后从相同安装路径采集。扫描包含基础与当前已有缓存，不表示已合并覆盖后的完整客户端资源。
- [knockback-methods.json](knockback-methods.json)：当前 DLL/metadata 方法名检索 `KnockBack`，用于检查原生接收者及槽位，不重复提取已有施力代码。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- [cards.json](cards.json)：固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e` 的关卡定义 Card 键与角色表联合扫描，区分常规／突袭预置普通干员 Card 与召唤物 Card；输入字节指纹、选择指针、失败项及复跑脚本 [scan-cards.py](scan-cards.py) 同批保存。不是运行时动态授卡清单。扫描范围与结果如下。

| 资源根 | 组包 | 包数 | 实际匹配的对照组件 | 移动控制器／Enemy |
| --- | --- | ---: | --- | ---: |
| 基础 | charpack | 471 | Character 471 | 0 |
| 基础 | tokens | 7 | Trap 808、Token 59、GiantTrap 11、Character 10 | 0 |
| 基础 | levelprefabs | 78 | 无 | 0 |
| 缓存更新 | charpack | 3 | Character 3 | 0 |
| 缓存更新 | tokens | 2 | Trap 220、Token 1 | 0 |
| 缓存更新 | levelprefabs | 38 | 无 | 0 |

Prefab 扫描无读取错误，外部脚本源为 SerializedFile `CAB-658d74aab777086fc32b93f385be999a`（基础安装 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`）。匹配的移动控制器脚本名及 PathID：

| 脚本 | PathID |
| --- | ---: |
| MoveController | -7073810281583634641 |
| SeparateMoveController | -2453998455604132987 |
| Act6FunMoveController | -8854352574184952311 |
| RacingMoveController | 1533165044555006893 |
| MarblesMoveController | 8628789143852540608 |
| Enemy（控制器身份对照） | -6629209555389654693 |

JSON 扫描共 3,946 份关卡文件，按路径排除 `/sandbox` 和 `/tower` 后 3,663 份（卫戍 120、主线 401、集成战略 593、其它 2,549）。成功解析全部选中输入，抽取 4,126 条 Card（characterCards 1,779、tokenCards 2,347），共 485 种不同键，全部存在角色表（359 个 char_、126 个 trap_），无 enemy_ 键。

## 复用证据

- [Character 默认状态机及特殊移动](../blocker-roles-20261031/movement/README.md) 使用较早指纹；[技能实际重部署及状态继承](../redeploy-state-and-repeater-20261122/README.md) 和 [外部重部署](../external-redeploy-20261122/README.md) 使用当前指纹，不混用方法索引。
- [CharacterCard 普通部署](../card-source-identity-20261111/deployment/README.md) 与 [TokenCard 普通部署](../device-source-20261111/spawn/README.md) 证明普通 Card 创建的对象是 Character 家族，后者的 [metadata 继承链](../device-source-20261111/hierarchy/README.md) 为 Trap → Token → Character；Enemy 是另外的 Unit 分支。
- [普通推拉与失衡原生接收链](../forced-motion-20261118/README.md)、[卫戍莱塔尼亚召唤物配置及自主移动](../leithanien-summons-20261109/README.md)、[实际盟约的敌人控制器掩码](../spatial-content-20261122/README.md#卫戍更新中的普通阻挡掩码)。旧批次直接证据保持原样。

## 复跑与限制

从仓库根目录运行并输出到独立目录：

```sh
python3 docs/research/evidence/deployable-motion-20261127/scan_prefab.py > /tmp/deployable-prefab-recheck.txt
python3 docs/research/evidence/deployable-motion-20261127/scan-cards.py --out /tmp/deployable-cards-recheck.json
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked .agents/skills/arkbattle-native-research/scripts/native.py --out /tmp/deployable-knockback-recheck.json search KnockBack
```

Prefab 脚本共享默认游戏安装位置（见 native.py），只匹配上述 MonoScript 文件中的已知组件名，未穷尽其他资源组、运行时绑定、其它脚本类型、位置改写、派生类覆盖或 live XLua。未制作实战轨迹；Prefab 负结果与 JSON 负结果均仅限所列材料，不能证明全游戏不存在例外。
