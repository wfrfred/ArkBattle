# 零时长元素爆发：Buff 开始、启用与子效果

取证日期：2026-11-05；项目基线 `2f8612d`。问题是零时长参数进入原生 Buff 后，开始动作、属性／异常、周期输出、结束程序及子效果分别如何处理。结论集中于[案例 25](../../cases/25-elemental-burst-recovery-timing.md)。未运行完整游戏、注入零时长配置或核实活跃 XLua；没有修改项目源码或测试。

## 来源与范围

| 输入 | 大小 | SHA-256 |
| --- | --- | --- |
| GameAssembly.dll | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| 本机 config/buff_template_holder.ab | 见模板记录 | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |
| 第三方提取镜像 buff_table.json | 179395 | `f9c67db93cd9e8d40a3ff76ec6375d232993f1b61f3d277cb96b05e32fe537c3` |

DLL／metadata 与[2026-11-02 元素恢复批次](../elemental-timing-20261102/README.md) 相同；复用其 EPController 触发、零预算、结束通知和追踪列表指令，不复制整套旧材料。metadata v29，image base `0x180000000`。本批从当前 metadata 重新定位 Buff 方法；其它客户端不能直接套用编号和地址。

BuffDB 来自 [Kengxxiao/ArknightsGameData 固定提交 bffe31bf](https://github.com/Kengxxiao/ArknightsGameData/blob/bffe31bf66739842f99b457327066c695e2af389/zh_CN/gamedata/buff_table.json)，提交说明为 Client 2.7.91。它是第三方提取镜像，不标作本机资源或官方文档；当前本机 Holder 与镜像的用途分别记录。

2026-11-05 查阅的社区资料为 [BUFF／持续与触发](https://prts.wiki/w/BUFF#持续与触发)、[Buff 持续时间衰减率／不足一帧](https://prts.wiki/w/Buff衰减速率#不足1帧)。它们区分 LifeType 和不足一帧的表现，但不能单独证明本问题的零值原生路径，因此进一步读取客户端。

## 材料

| 文件 | 用途 |
| --- | --- |
| `buff/extract.py`、`.lock` | 使用 skill 的 Native 解析器，核对双指纹后读取 Buff 生命周期、派生创建与所需 helper；Capstone 固定为 5.0.7 |
| `buff/metadata.json` | Buff／Container、LifeType、CreateBuff 等字段与当前方法身份 |
| `buff/native.json` | Reset、OnStart、NewBuff、结束、启用、周期及派生创建的完整方法分段 |
| `buff/expanded.json` | 寿命类型转换与 IsZero 的叶子 helper |
| `buff/findings.json` | 条件明确的结论及指令锚点 |
| `controller/finish-events.json` | EP 恢复结束前／后事件的 Buff 与容器派发方法 |
| `controller/controller-findings.json` | 复用旧批次的预算与列表指令，结合新事件方法说明恢复结束并非统一 Buff 析构 |
| `templates/extract_templates.py` | 复用已归档类型树解码器，从本机 Holder 读取相关模板，并独立投影固定镜像配置 |
| `templates/selected-templates.json` | 19 个本机模板、动作与父子绑定标记；SerializedFile 与 PathID 随记录保存 |
| `templates/buffdb-mirror.json` | 所需镜像条目的寿命、持续键、黑板参数和属性配置 |
| `archive.json` | 材料哈希、来源及共享工具可以重新读取的选择器 |

工具身份随原始输出保存；本批脚本只组织所需选择器与内容投影，不重写 PE、metadata 或 UnityFS 解析器。叶子 helper 的有限范围及其它方法的连续分段边界见输出；`fullyDecoded` 不表示已展开所有下游内容程序。

## 从独立输出目录复读

从仓库根目录执行，准备相同客户端与 native research skill。先执行带指纹检查的 Buff 提取；若指纹不符，应重新定位，不能继续使用下面的固定方法编号。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/elemental-zero-duration-20261105/buff/extract.py \
    --address 0x184741640 --address 0x1869459c0 \
    --out .cache/native-research/elemental-zero-replay/buff

uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py \
    --out .cache/native-research/elemental-zero-replay/controller/finish-events.json \
    disasm 66198 66199 66387 66388

mkdir -p .cache/native-research/elemental-zero-replay/templates
curl -fL 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/bffe31bf66739842f99b457327066c695e2af389/zh_CN/gamedata/buff_table.json' \
    --output .cache/native-research/elemental-zero-replay/templates/buff_table.json
uv run --offline docs/research/evidence/elemental-zero-duration-20261105/templates/extract_templates.py \
    --buff-table .cache/native-research/elemental-zero-replay/templates/buff_table.json \
    --out .cache/native-research/elemental-zero-replay/templates/output
```

两个专用脚本均支持 `--game`；共享原生入口也支持该参数。首次尚未缓存依赖时去掉 `--offline`。模板脚本核对 Holder 和镜像哈希；依赖的类型树解码器为仓库内 `attack-addon-order-20261102/content/decode_content.py`，其身份随输出登记。复读不会依赖一次性临时目录或覆盖本批材料。

## 证据限制

本批证明给定零参数时的普通分支，不证明正式配置中存在零秒标准爆发。开始程序可以生成有独立参数的子 Buff，因此零父寿命既不表示所有效果跳过，也不表示所有效果完整持续。真正的开始／结束动作、派生标记、子项寿命、接收资格和显式触发仍分别决定结果。

当前 Holder 内部的根到 Character／Enemy 子模板绑定已读取；本机全局 EPBreakBuffData 的 elementBuffs 配置选择尚未独立定位。没有以项目测试或人工模拟代替这一缺口。具体机制结论及对项目零时长契约的影响只在案例 25 维护。
