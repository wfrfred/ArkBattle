# SP 配置、支付与跨部署魔力核对

2026-11-17。只调查，不修改产品代码。结果见 [result.md](result.md)，由 [Case09](../../../cases/09-skill-mechanisms-and-requirements.md) 汇总；这里不决定新接口类型。

## 输入与证据范围

- 当前 Windows 原生：DLL `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata v29，SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。各文件保留路径、工具指纹、方法身份与完整区间。
- 当前安装 Prefab／Holder 与固定第三方原表分别版本化。两角色、六技能的原表来自 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，按[原表校验记录](../../route-operations-20261107/data-source-verification.json)核对原字节 SHA-256／Git Blob；不把镜像和本机资源混称同一发布。
- 新提取当前实现和实际组件，复用 Case09 §2.7 的已核算法。未运行客户端、未验证活跃 XLua；配置与调用链支持的组合结果不写成实机观测。

| 原件 | 内容 |
| --- | --- |
| [discovery.json](discovery.json) | SP 方法及字段定位 |
| [inventory.json](inventory.json) | BasicSkill、SpController、SpData、Deck/Card 的完整声明方法；Entity 的 SP 名称／参数检索；状态、SP、异常、Buff 事件枚举 |
| [native.json](native.json) | 当前指纹的容量、门槛、支付、配置提交／恢复、共享数据和创建场下修改器等15个完整体 |
| [mana.json](mana.json) | 场下修改器的 SetData／OnTick／实际加值、SP 上限 setter 与余额限幅，共5个完整体 |
| [content.json](content.json) | 玛露西尔 Character／天赋、两角色六技能的120个选定组件；25个完整模板；完整9054 Holder中配置／共享数据节点定位 |
| [static-inputs.json](static-inputs.json) | 两角色、六技能完整固定表记录，保留黑板合成输入 |
| [prts.json](prts.json) | 本轮查阅社区说明与限定，不代替 native |
| [verification.json](verification.json) | 独立字节／身份／字段复读及配置重新提取结果 |

Inventory 是入口清单，不把未选方法名当作已核实际消费者。Entity 名称索引大小写不敏感，会包含 Speed／Spell 等假阳性；BasicSkill 和 SpController 则保存全部声明方法，避免只检索已知例子。`[uc]skills.ab` 的配置行为组件检索只在该包内完整，找到3个 ModifySpDataAfterSkillCast，均为琳琅诗怀雅且 `_modifySpType=false`；不能据此声称全游戏没有恢复类型切换。

## 复跑

仓库根目录，先设置 `UV_CACHE_DIR="$PWD/.cache/uv"`。专用脚本：

```sh
python docs/research/evidence/skill-audit-20261117/sp/extract_content.py --out /tmp/skill-sp/content.json
python docs/research/evidence/skill-audit-20261117/sp/extract_static.py --out /tmp/skill-sp/static-inputs.json
uv run --offline --no-project python docs/research/evidence/skill-audit-20261117/sp/inventory.py --out /tmp/skill-sp/inventory.json
uv run --offline --no-project python docs/research/evidence/skill-audit-20261117/sp/verify.py --out .cache/native-research/skill-audit-20261117/sp-verification
```

三个 native 原件由共享 [extract.py](../../facing-semantics-20261113/extract.py) 提取；其 `result.selection` 保留精确 body／index／owner 选择，更换输出路径即可复提。统一归档后可用 skill `replay.py` 执行原生选择器。验证输出先写独立缓存目录，再归档摘要，保留原件。

SP 封闭读取者直接复用同指纹的 [Entity.DoApplyModifier#67683](../../reception-stages-20261115/pipeline/native.json)；普通凋亡减 SP 的完整根／子模板及参数复用[元素原件](../../resource-mechanisms-20261114/recovery-elemental/templates.json)。不为同一完整体再造重复证据。
