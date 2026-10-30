# 调查证据归档

本目录按取证批次保存材料；机制结论集中在[案例](../cases/00-INDEX.md)。2026-10-31 按 native research skill 整理目录、来源登记和复现入口，未将历史摘录改写成本次客户端调查，也未补造原工具版本、命令或缺失的指纹。

## 文件与输出格式

每个批次提供 `README.md` 和 `archive.json`：

- `README.md`：研究问题、适用范围、来源定位、文件用途、复现命令、限制和案例链接。
- `archive.json.provenance`：原取证日期及其依据、历史输入指纹与原记录位置、本次整理日期和整理工具身份。缺失日期或指纹保留为空；目录日期与原记录日期明确区分。
- `archive.json.result.artifacts`：保留材料的路径、用途类别、大小和 SHA-256。
- `archive.json.result.replay`：从原记录提取的方法、原生地址、类型、常量及资源选择器；它描述新工具能重新读取的部分，不是恢复出来的原始提取命令。

历史 JSON 保留原字段，汇编、原始字节及报告保留原内容。以前散落在本目录根部的 11 份 JSON 迁入对应日期批次的 `records.json`。一次性提取脚本归入所属批次的 `legacy/`，作为历史源码保存；共享取证入口由 skill 维护。

新提取输出与 skill 一致，使用 `provenance`／`result`，包含本次真实输入、工具和解析范围。原始摘录不是本次生成数据，不能仅为字段统一而给它们附上今日客户端或工具身份。

## 复查与更新

从仓库根目录执行，准备原记录对应的客户端、`uv` 及 native research skill：

```sh
skill=.agents/skills/arkbattle-native-research
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked "$skill/scripts/replay.py" docs/research/evidence/air-blocking-radius-20261029 --out .cache/native-research/air-blocking-radius
# 只复查已登记的某个方法时，可添加 --method <metadata index>。
```

入口先核对历史 DLL／metadata 指纹，再使用登记的身份和地址提取；资源包独立核对指纹。指纹不匹配时拒绝套用旧索引，缺失的输入、无法定位的身份和不可复查项会明确报告。输出写入 `--out`，不覆盖历史材料；遇到未完成选择器时返回非零退出码，并在已生成的 `replay.json.result.unavailable` 中列出原因。输入版本不匹配等入口错误在提取前终止。

方法正文仍按工具声明的原生代码区间读取。若 `targetOutsideRange` 指向区间外分支，按 skill 的 `disasm-at` 入口继续展开；`fullyDecoded=true` 只表示当前区间完成解码。重新提取方法或对象索引不等同于重建专用资源解码、第三方镜像扫描、旧 Unicorn stub 或运行时 XLua。

维护材料清单与选择器时运行：

```sh
uv run "$skill/scripts/archive.py" docs/research/evidence
```

整理器只从已有原记录和其中明确引用的来源登记输入身份，不读取今日客户端替代历史来源。它更新 `archive.json`，不改写原始材料；专用结论和证据限制仍由批次 README 与案例维护。

## 批次导航

| 批次 | 调查主题 |
| --- | --- |
| [client-excerpts-20261007](client-excerpts-20261007/README.md) | 初始客户端、Buff 模板与调用摘录；属于较早客户端指纹 |
| [blocking-lifecycle-20261010](blocking-lifecycle-20261010/README.md) | 阻挡维护、退场与旧项目实验 |
| [skill-lifecycle-20261013](skill-lifecycle-20261013/README.md) | 技能启动、支付、持续与结束 |
| [talent-lifecycle-20261013](talent-lifecycle-20261013/README.md) | 天赋初始化、入场及关联实例 |
| [action-timing-20261014](action-timing-20261014/README.md) | 行动进度、动画与阶段时序 |
| [action-eligibility-and-interruption-20261014](action-eligibility-and-interruption-20261014/README.md) | 行动资格、中断与泥岩配置 |
| [skill-mechanisms-20261015](skill-mechanisms-20261015/README.md) | 技能机制与原生调用复核 |
| [sp-calculation-20261015](sp-calculation-20261015/README.md) | SP 自然回复、计时器和阻回 |
| [weak-damage-20261016](weak-damage-20261016/README.md) | 脆弱、伤害倍率及暴击 |
| [damage-apply-20261017](damage-apply-20261017/README.md) | HP 写入、通知与死亡判断 |
| [hp-application-combinations-20261017](hp-application-combinations-20261017/README.md) | HP 变更组合及相关模板 |
| [navigation-native-20261018](navigation-native-20261018/README.md) | 寻路、射线与平滑算法 |
| [route-movement-20261018](route-movement-20261018/README.md) | 路线、Cursor 与运动推进 |
| [route-fields-20261019](route-fields-20261019/README.md) | RouteDefinition 字段消费与关卡数据 |
| [locomotion-native-20261019](locomotion-native-20261019/README.md) | 运动、空间约束、状态与物理交互 |
| [projectile-boundaries-20261021](projectile-boundaries-20261021/README.md) | 弹道运动、命中与候选边界 |
| [projectile-stop-20261021](projectile-stop-20261021/README.md) | 弹道停止、消除与终结顺序 |
| [projectile-lifecycle-20261021](projectile-lifecycle-20261021/README.md) | 弹道来源、目标与生命周期关系 |
| [effect-immunity-20261021](effect-immunity-20261021/README.md) | Effect 选择、施加与异常免疫 |
| [blocking-native-20261023](blocking-native-20261023/README.md) | 阻挡资格、半径、取得与保持 |
| [blocking-timing-native-20261023](blocking-timing-native-20261023/README.md) | 阻挡调度、立即搜索与 Tick 顺序 |
| [norport-civilian-20261029](norport-civilian-20261029/README.md) | 诺伯特平民的阵营、禁选与阻挡 |
| [tippi-air-blocking-20261029](tippi-air-blocking-20261029/README.md) | 蒂比、起降与空中阻挡 |
| [air-blocking-radius-20261029](air-blocking-radius-20261029/README.md) | 默认半径、属性倍率和特殊覆盖 |
| [skill-modifier-20261029](skill-modifier-20261029/README.md) | Skill 修正协议及内容扫描 |
| [skill-parameter-formulas-20261029](skill-parameter-formulas-20261029/README.md) | SP、Ammo 和时长的原生公式 |
| [numeric-parameters](numeric-parameters/README.md) | 属性数值与限幅；原取证日期和输入指纹未记录 |
