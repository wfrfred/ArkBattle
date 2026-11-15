# 接收前置、普通 HIT 与伤判

核对日期：2026-11-15。问题是原生实际机制需要哪些接收机会及顺序，不以 ArkBattle 当前的 Content 接入数量或 Hook 名称判断必要性，也不按原生函数数量决定公开 API。

结论集中维护在[案例38](../../cases/38-damage-classification-and-permissions.md#11-接收前置普通-hit-与伤判)。本批只补研究，不修改模拟实现或测试。

## 证据范围

- [客户端调用链](pipeline/README.md)：普通 HP／EP Damage／Healing、force 与 skip 路径，目标接收前程序、资格、SP 回复和专属伤判；包括接收与 SP setter 的虚派发覆盖。84 个完整方法独立重提一致。
- [完整配置及实际绑定](content/README.md)：扫描安装资源的 9,054 个 Buff 模板，事件5／6／10分别有20／59／650个程序；按机制类别追踪实际 Prefab、Buff 定义和原表，不将模板存在等同于内容启用。
- [PRTS交叉来源](prts-sources.json)：社区事件、伤判和蒂比资料，仅用于交叉核对；与当前 native fallback 的差异单独保留。

DLL／metadata、Bundle、SerializedFile、对象、原表和脚本指纹均在各子目录的 provenance 中。客户端静态控制流与配置绑定不冒充实机观测；有效 XLua 未执行。原表镜像与安装客户端分别标注版本。

## 复查

在仓库根目录按两个子目录 README 的命令独立重提。配置扫描覆盖完整输入后，再用实际绑定确认样例；调用链复查比较完整语义结果，不仅检查文件能否解析。不运行产品测试。
