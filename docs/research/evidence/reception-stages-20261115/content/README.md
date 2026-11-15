# 接收前程序与实际内容绑定

2026-11-15。调查 `Buff` event 5／6／10 的完整模板集合，并沿 Prefab、BuffDB 和关卡配置核对实际绑定。此目录保存配置证据，不决定项目 Hook 的数量或名称。

## 来源与覆盖

安装资源来自 `Arknights_Data/StreamingAssets/AB/Windows`，每个读取的 Bundle、选中对象和脚本均记录 SHA-256。完整 Holder 对象为 `CAB-7983df61b3ae63c96fb4e076fc3d80af / 6070581171229484677`，对象 SHA-256 为 `c03149251d47fa31e6f6cb5b696f9e93925f51a97bf9ee335593c888bdcb6fec`。

| 材料 | 覆盖 |
| - | - |
| Holder | 全部 9,054 个模板；event 5／6／10 分别 20／59／650 个完整程序，共 3,107 个节点，解析失败 0 |
| 资源引用 | `charpack/*.ab`、`battle/enm_pfb*.ab`、`battle/prefabs/*.ab`、`pkgrps/btl_pfb_tokens*.ab`、`config/*.ab`，共 524 包；1,544 个字节命中组件中解析出 1,174 份精确 Buff 引用，失败 0 |
| 选择复核 | 22 个资源选择项下的 674 个完整组件、138 份 Buff 引用及递归创建的 98 个完整模板；缺失模板和解码错误均为 0 |
| 固定关卡镜像 | 提交 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，4,025 个 JSON 全扫；7 个指定敌人的 111 个匹配关卡，区分 `enemyDbRefs` 与真实 `SPAWN` |

固定 BuffDB、角色表、技能表与敌人表独立于安装资源版本。来源指纹在各 JSON 的 `provenance` 中；BuffDB 来源另见 [既有镜像说明](../../elemental-zero-duration-20261105/templates/buffdb-mirror.json)。角色表固定提交为 `17759cc8cdf37388414145d16262a3a06f3ab25e`；新资源中的 tocka、dminon 不在这份旧表，不能据此认定未使用。旧缓存 `all-templates.json` 没有作为此次模板输出来源。

事件编号和消费者时序依据 [本轮原生管线](../pipeline/native.json)。5 是 `ON_BEFORE_APPLYING_MODIFIER`，6 是 `ON_APPLYING_MODIFIER`，10 是 `ON_TAKE_DAMAGE`；7 才是 `ON_APPLIED_MODIFIER`。编号相邻不意味着语义等价。

## 文件

- `inventory.json`／`programs.json`：全部模板索引、嵌套节点位置及三个事件的完整程序。
- `resource-search.json`：全部扫描输入、字节候选与精确序列化引用；显式保留 `buffKey`、`templateKey`、`loadFromDB` 和展开的 DB 定义。
- `family-inventory.json`：对每个程序按节点语法分类，并列出所有直接序列化绑定。分类只用于选样，不能代替节点原体调查。
- `selected-content.json`／`selected-programs.json`／`profiles.json`：选中内容的组件、PPtr、完整相关模板及角色资料。
- `static-inputs.json`／`level-witnesses.json`：技能／敌人静态记录与关卡实际动作摘录；后者保留每个扫描文件的指纹和命中文件的 Git Blob。
- [findings.md](findings.md)：有界结论、真实例子及未闭合边界。
- `verification.json`：在独立目录重新提取后，比较九份完整 `result` 的结果。

精确对象身份是 `SerializedFile + PathID`，跨文件通过 PPtr 的文件引用解析。`matchedBytes` 只是候选；精确 Buff 引用仍不自动证明该 Ability 已经运行。`no_direct_reference_in_scanned_families` 只表示没有直接绑定，程序可能由其他模板创建，也可能来自扫描范围外。

## 复提

从仓库根目录执行，使用当前安装资源和已有固定镜像缓存：

```sh
python3 docs/research/evidence/reception-stages-20261115/content/verify.py \
  --work .cache/native-research/reception-stages-20261115/content-replay \
  --out docs/research/evidence/reception-stages-20261115/content/verification.json
```

该命令顺序运行四个保存的调查脚本，将结果写入独立工作目录后比较完整 `result`。不会覆盖原始归档。输入资源更新后若结果变化，应保留差异并重新确定版本，不能直接改成通过。
