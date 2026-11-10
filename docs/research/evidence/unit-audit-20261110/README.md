# Unit 必要语义补核

2026-11-10。补核测试／文档审计中缺少来源的具体行为；测试清理与取证分开提交，未用测试或现有实现证明原生规则。结果与剩余范围集中在[证据与待核对事项](../../05-evidence-and-open-questions.md#本次-unit-审计的补核结果)。

| 材料 | 对应结论 |
| --- | --- |
| [Buff／属性](buff-attributes/README.md) | [Case 01 §8](../../cases/01-buff-installation-and-parent-scope.md#8-2026-11-10-补核属性-descriptor合并与覆盖组) |
| [控制／多目标／地形](control-terrain/README.md) | [Case 07](../../cases/07-action-timing-and-animation.md)、[Case 08](../../cases/08-action-eligibility-and-interruption.md)、[空间研究](../../03-space-units-and-mechanisms.md) |
| [坐标／数值／Schedule](coordinates-numeric/README.md) | [Case 15](../../cases/15-locomotion-native-semantics.md)、[Case 30](../../cases/30-scheduler-action-data-fields.md)、[属性研究](../../02-combat-buffs-and-effects.md) |
| [干员配置](operator-config/README.md) | [Case 06](../../cases/06-talent-lifecycle-and-model.md#干员配置数据补核2026-11-10) |

各目录说明实际输入、选择范围、复跑命令与限制。新客户端均为 Windows x64、metadata v29；第三方镜像按各自固定提交记录，不与安装客户端混作同版。只归档选中方法、字段、组件、模板及配置；完整发现结果和中间文件留在 `.cache`。

`archive.json` 统一登记来源与可提取选择器；各组专用解码和配置扫描按相应 README 运行。共享地址、连续分片及未解码字节的限制保留在原记录中。未执行游戏、未验证活跃 XLua；静态条件可执行、实际配置引用和运行时观测分别判断。本批不替项目批准支持范围、数值近似或接口变更。
