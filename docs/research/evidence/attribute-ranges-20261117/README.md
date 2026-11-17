# 属性清单、求值与动态范围

2026-11-17。补核 [Case39](../../cases/39-death-attribution-and-attribute-ranges.md) 的完整属性范围、公式与实际使用，不修改 Core、架构政策或测试。机制结论集中维护在案例中。

本机 Windows x64、metadata v29；DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。所选 Bundle 与对象指纹另见各原件 provenance。此批使用当前静态资源及普通 native 分支，没有运行客户端或验证活跃 XLua。

| 资料 | 内容与复跑 |
| --- | --- |
| [完整库存](README-inventory.md) | 全部 AttributeType、34项正式属性的声明边界与构造默认、其他字段及整数写入规则。 |
| [求值与通知](README-native.md) | raw／有效值、四项公式、范围覆写／清除、缓存、同步通知及攻击周期的独立限制。 |
| [实际使用](README-usage.md) | 全部已选 Buff Holder 的范围节点、调用入口和所选内容的资源引用；排除玩法与未证明的绑定分别记录。 |
| `prts.json` | 社区资料的版本与交叉核对边界；不代替本机原件。 |

提取脚本将复查结果写到批次外，不覆盖已归档原件。各记录的选择范围不是全部热更新内容的穷尽证明；方法、模板、资源引用和实际触发条件分别判断。`archive.json` 由共享 `archive.py` 生成，保留各输入、选择与原件的可追溯关系。
