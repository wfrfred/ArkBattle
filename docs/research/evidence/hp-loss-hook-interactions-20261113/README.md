# 生命流失与计算／接收程序的实际交互

采集日期：2026-11-13；完成核对：2026-11-14。问题是：生命流失能否使用 ArkBattle 已选定的 Calculate／Apply 和 Hook 协议，通过业务性质与机制资格表达原生内容，而无需复制原生阶段开关。

结论维护在[案例 11 第 7 节](../../cases/11-damage-apply-and-hp-application.md#7-统一管线的实际内容对照2026-11-13)。本批未修改 Core、测试或既定两阶段／死亡契约，新增请求字段仍属于待定方案。

## 材料与范围

| 目录 | 内容与证据强度 |
| --- | --- |
| [output](output/README.md) | 华法琳 S2、乌尔比安与雷蛇实际配置及脚本绑定，普通接收／SP 过滤和活性源石分支。配置、原生分支及组合推导分别说明。 |
| [source](source/README.md) | 来源计算事件的定向排查；完整模板范围中的事件 14 索引、阿的最小配置摘录，以及不能作为真实反例的原因。 |
| [prts](prts/README.md) | “睚”／铃兰当前规则与历史社区实战反馈，拟态机械／庇护的规则组合及来源版本。未将社区资料标为客户端实测。 |

各目录记录自己的输入、对象身份、版本／指纹、脚本与复跑限制。当前客户端与关卡流失链复用 [hp-loss-settlement-20261113](../hp-loss-settlement-20261113/README.md)，不重复存储完整 DLL 或全部资源。不同修订的静态表、客户端资源和 Wiki 不当作同一次发布。

## 复查

从仓库根按各子目录 README 提取到独立缓存目录，不覆盖原件。维护本批清单：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/hp-loss-hook-interactions-20261113
```

本批没有完整运行客户端或验证活跃 XLua，也没有穷举所有角色与全局来源修正。来源事件参数不同不自动证明玩法不同；未闭合执行窗口的模板组合不作为反例。
