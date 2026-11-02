# 伤害 Hook 的玩法依据与接收节点

取证／查阅日期：2026-11-03；项目基线 `f5306f4`。结论集中在[案例 28](../../cases/28-damage-hooks-and-event-granularity.md)。本批按真实内容区分必要的语义机会、可直接编排的业务和仍无证据要求独立公开的 Hook，不决定最终接口或修改项目政策。

## 材料与范围

- `prts-sources.json`：PRTS 页面、章节、部分固定 revision、查阅日期及事实摘要。PRTS 是社区 Wiki；各角色未核对 native 的说明不升级为客户端实证。
- `native-reception.json`：从当前 metadata 完整名定位的 9 个新增方法及连续 `.pdata` 分段：取消／零值、闪避／抵挡的即时成功通知、同步反伤、归零前后与普通免死成功者。方法保留原地址、bytes、字段身份与解码边界。
- `extract_reception.py`、`.lock`：上述节点的提取脚本；Capstone 5.0.7 由 PEP 723／lock 固定。
- `selected-templates.json`：当前 Holder 中六个已有样例的实际事件与动作；模板存在不证明所有当前角色／模式仍会选择它。
- `decode_templates.py`、`.lock`：仅解码上述六个模板；复用仓库已归档的 `attack-addon-order-20261102/content/decode_content.py` 的类型树读取函数，以及 skill 的 `unity_assets.py`，不依赖临时解码文件。
- `archive.json`：本批材料、输入指纹和选择器清单。

通用计算、接收、HP setter、普通死亡与物理回收不重复提取，复用[妮芙短链证据](../nymph-action-settlement-20261103/README.md)和[前一批 HP 主体](../attack-addon-order-20261102/README.md)。[历史弱点证据](../weak-damage-20261016/README.md)保留旧指纹，不能把旧 index／VA 套入当前客户端。

本批当前输入：

| 输入 | 大小 | SHA-256 |
| --- | ---: | --- |
| `GameAssembly.dll` | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |
| `config/buff_template_holder.ab` | 2151020 | `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79` |

metadata v29，image base `0x180000000`。共享 `native.py` SHA-256 为 `1c6c16dc97e0dd9af0af4033c81a7534384dd65ebb1e604df3f4a3289df158e6`；工具、客户端及专用脚本身份保存在各文件 provenance。静态普通 native 分支，没有运行游戏或验证活跃 XLua。

## 必要锚点

- `Modifier.get_isCancelled`：当前零输入在普通接收前已被视为取消；`Cancel` 保留数值，分别记录成功与原因。
- `Evade.Execute` 在 `0x1810e69dd` 尝试取消，成功后 `0x1810e6a27` 同步通知；失败不发成功事件。`BlockDamage.Execute` 亦在成功分支通知。本次仅有焰尾的独立闪避观察者证据，不据两个原生入口强制两套公开 API。
- `InverseDamage.Execute` 可按自身配置保留已取消输入，在 `0x181102e95` 同步调用 ApplyModifier。
- 归零前容器记录首个 consumer 后继续枚举；普通 Consume 节点自行拒绝已取消／不符合资格的请求，Post 的 IsConsumer 只让成功者执行自己的后续。不把这个协议泛化为全部生命保护的统一竞争。
- 当前 Holder（SerializedFile `CAB-7983df61b3ae63c96fb4e076fc3d80af`，PathID `6070581171229484677`）中的泥岩旧 shield_a 模板仍为 Block→Heal→Finish；当前 PRTS 普通模式描述单 Buff 补层，故只确认各自范围，不混淆为统一实例生命周期。玛恩纳 inverse 的 filterCancelled=false；若叶睦与普通保护的不死资格也分别保存。

## 复跑

从仓库根目录执行。需要对应指纹客户端、skill 共享工具和上述已归档类型树读取器。依赖未缓存时去掉 `--offline`。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/damage-hook-needs-20261103/extract_reception.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/damage-hook-needs-replay/native-reception.json
uv run --locked --offline docs/research/evidence/damage-hook-needs-20261103/decode_templates.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/damage-hook-needs-replay/selected-templates.json
```

本轮脚本重新提取结果与独立 scratch 提取中相应方法／模板逐项一致；未复制整包资源、通用主链或易读 ASM 重复投影。有限语义推导与未核实时点均在案例中标明，没有为研究新增运行代码测试。
