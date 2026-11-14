# 特殊取消原因的生产路径

本批只读核对 `INTERRUPT`、`MINUS_HEALTH`、`HIT_FAILED`，同时保留发现的有效 `Cancel(NONE)` 路径。结论由[案例 38](../../../../cases/38-damage-classification-and-permissions.md)维护，不改产品行为或确定 Reason 类型。

## 输入与范围

- 2026-11-14 本机 Windows 客户端；DLL SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。每份原生记录含输入、工具及方法选取参数。
- `direct-cancel-producers.json`：全部指令边界核验的 Battle 范围 `Modifier.Cancel` E8/E9 直接调用，30 调用、21 个完整逻辑方法。
- `cancel-holder.json`：当前 Holder 全部 9,054 模板中的 125 个 `CancelModifier` 节点；完整保留涉及 INTERRUPT 的 7 份程序。原因分布 NONE 44、INTERRUPT 8、UNHURTABLE 67、MISS 1、BLOCKED 5；所扫节点没有 MINUS_HEALTH。
- `hit-failed-native.json`：`Entity._VerifyAbilityDamageMiss` #67708 完整体及 Entity 字段。
- `miss-flag-producers.json`：Ability／Projectile 的 `set_damageMissFlag` 直接引用；Modifier 原因 getter 和字段用于核对。
- `miss-flag-caller-bodies.json`：AbstractBasicAttack.OnCastStart #92299／OnCastEnd #92300、Projectile.Init #72512／#72514、Modifier.get_isCancelled #72132 完整体。
- `hitrate-attributes.json`：Entity 两种命中率 getter #67462／#67463，以属性 33／34 调用 `Attributes.GetValue`；与[内容证据](../cancel-content/bindings.json)的阿斯卡纶 S3 Aura 33／34 关联。

INTERRUPT 的实际单位／关卡绑定、伺夜与阿斯卡纶完整内容程序复用[内容批次](../cancel-content/README.md)。原因 getter、setter 的直接消费者复用[消费者批次](../cancel-consumers/README.md)。不把模板存在单独当作实战激活证据。

## 复跑

在仓库根目录执行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline docs/research/evidence/resource-mechanisms-20261114/damage/cancel-specials/trace.py
python docs/research/evidence/resource-mechanisms-20261114/damage/cancel-specials/scan_cancel_nodes.py
```

其余四份文件由公共 `docs/research/evidence/facing-semantics-20261113/extract.py` 提取，各自 `result.selection` 保存 `body`／`body_index`／`owner`／`xref` 参数，可用公共 replay 重提。`trace.py` 按下一 metadata 原生入口保留方法内分段；本批脚本不扩充共享工具。

所有观察均为当前静态 fallback；直接调用与所选 Holder 程序不穷尽虚调用、其它资源、反射或有效 XLua。未找到 MINUS_HEALTH 生产者不等于证明全局不存在；不得据其名称推定负生命债务或某种 HP 接管。`Cancel(NONE)` 的有效取消由 Cancel 与 isCancelled 的当前方法体核对，不以枚举名解释。
