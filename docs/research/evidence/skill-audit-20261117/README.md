# Skill 覆盖审查

2026-11-17 核对 Skill 从静态配置、SP 与发动资格到持续、主动操作和结束的完整链路。结论集中于 [Case 09 §9](../../cases/09-skill-mechanisms-and-requirements.md#9-skill-覆盖审查2026-11-17)；本批不修改运行代码或确立新的接口方案。

## 来源与范围

安装客户端的 `GameAssembly.dll` SHA256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata v29，SHA256 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。各子批保存资源与镜像版本、对象选择、方法签名和指令；既有证据按引用复用，不标为本轮重新执行。

| 子批 | 核对问题 |
| --- | --- |
| [SP](sp/README.md) | 当前配置与余额、运行期改值、普通增减封闭、玛露西尔跨部署魔力。 |
| [持续与弹药](sustain/README.md) | Fever 进入／退出、持续期限、弹药资源与加成资格、补弹和主动关闭。 |
| [发动与生命周期](lifecycle/README.md) | 止颂异常下发动、有限被动与特殊被动、既有 Activation 接续及敌人多技能组织。 |

原生静态分支与实际配置绑定分别核对；没有运行官方战斗或验证活跃 XLua。项目 API probe 只验证当前接口的表达限制，不是原生执行证据。未找到的组合只作为本次证据边界，不推导全游戏不存在。

## 复查

先按各子批 README 重提选择，再运行项目 API probe。完整输出保存到文件，不覆盖历史原件。统一清单由下列命令生成：

```sh
python .agents/skills/arkbattle-native-research/scripts/archive.py --batch docs/research/evidence/skill-audit-20261117
```
