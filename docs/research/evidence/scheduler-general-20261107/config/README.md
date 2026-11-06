# Scheduler 通用配置证据批次

来源固定为镜像 `Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。调查共选 82 份配置：79 份非生息来源样本，以及 3 份明确排除支持范围的生息字段对照。前者涵盖主线、教学、训练、绝境、资源、危机合约、肉鸽 1–6、普通 Side 活动、愚人节、引航者试炼、连锁竞赛与联机；来源多样性本身不构成玩法支持要求。本批未读取保全配置，也不是全仓扫描。

文件：

- [sources.json](sources.json)：82 份完整上游路径、固定 ref URL、Git blob SHA、原文字节 SHA-256、规范化 JSON SHA-256。全部 82 份原文字节复算 Git blob SHA-1，与 GitHub 返回 SHA 一致。
- [samples.json](samples.json)：79 个完整 ActionData 原文节点、各自文件与 JSON Pointer、入选字段；另有 17 个显式敌人 `notCountInTotal` 覆盖原文及引用动作位置。这里是字段与内容证据，不是运行时观测。
- [profile.json](profile.json)：全部原值、缺失数、有限范围计数及样本索引；`cohorts.generalNonSandboxSample` 单列 79 份 / 3,283 个动作，`cohorts.excludedSandboxFieldControls` 单列 3 份 / 164 个动作。总数仅用于指纹与提取校验，不混入支持范围结论。189 个数字枚举动作属于前一组的旧格式来源，原样保留，未凭声明顺序解码。
- [navigation.json](navigation.json)：默认分支 code search 的候选导航记录。返回 ref 为 `63c7cec...`，不是固定 pin 的检索；所有正例都再次取固定 pin 原文核实。普通 connector search 的字段与布尔值 OR 误命中未用作证据。
- [profile.py](profile.py)：消费共享选择器结果，复算各组字段统计、保存完整样本、断言 pointer 与源节点一致、验证源文件指纹。
- [refetch.py](refetch.py)：可选的本批 raw URL 重取脚本，逐文件核对 Git blob 指纹后保存。本次取数实际使用 GitHub connector，并未运行此脚本的网络路径。

字段统计覆盖客户端布局中的全部 24 个 ActionData 字段。`count>1`、`preDelay>0`、`interval>0`、`routeIndex>0`、无害标志与空 key 另有明确检查及最少必要原节点；两个自动 UI 检查只计名称枚举 `SPAWN`，不把其他动作保存的 true 当成对应执行路径的见证，也不擅自转换数字枚举。计时代表采用同一普通主线 SPAWN 的 `count=2, preDelay=3, interval=2, routeIndex=3`；字段值统计仍保留所有动作原值，不等于每种动作都会消费这些值。

复跑前提与命令：从仓库根目录运行。完整约 11 MB 源文件及共享选择器结果留在 `.cache/native-research/scheduler-general-20261107/`；缓存存在时跳过重取步骤。实际取数调用为 GitHub connector `fetch_file({repository_full_name:"Kengxxiao/ArknightsGameData",path,ref:"bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d"})`。

```sh
python docs/research/evidence/scheduler-general-20261107/config/refetch.py
python .agents/skills/arkbattle-native-research/scripts/config.py .cache/native-research/scheduler-general-20261107/levels --glob 'level_*.json' --source-url https://github.com/Kengxxiao/ArknightsGameData --revision bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d --out .cache/native-research/scheduler-general-20261107/action-configs.json select '/**/actions/*'
python docs/research/evidence/scheduler-general-20261107/config/profile.py
```

限制：

- 未找到固定 pin 的 `forceBlockWaveInBranch=true` 实际配置正例；默认分支搜索无候选不能证明全局不存在。非生息样本中显式 false 3,094 个，字段缺失 189 个，分别记录。
- `useExtraRoute`、`isValid`、`notCountInTotal`、`extraMeta`、`actionId` 在本批 3,447 个动作中全部缺失；缺失不等于 false、null 或无需运行时语义。`enemyDbRefs/*/overwrittenData/notCountInTotal` 是另一层字段，不能冒充 ActionData 用例。
- 非 `ALWAYS` 的 `randomType/refreshType` 本批仅在 3 份生息对照中找到，不据此提出 Core 要求；非生息样本零命中只表示本次范围无样本。
- branch 激活、hiddenGroup 选择及随机条件没有沿外部玩法链核实；配置启用不等于已观测执行。正例可证明原值及引用关系，不能单独证明调度归属或时序。
- 机制结论统一交由上层案例维护，本目录只归档来源、样本、统计与复跑方法。
