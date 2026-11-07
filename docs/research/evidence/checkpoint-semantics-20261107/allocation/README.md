# Enemy 创建前的分配与身份登记

2026-11-07。仅补核 `BattleFactory.CreateEnemy` 返回前的分配回调、UID 与 BObject 登记；不扩展对象池生命周期，也不决定项目 Enter 顺序。机制结论集中维护在本批对应案例。

本机 Windows x64，metadata v29，imageBase `0x180000000`：DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。与父批次和此前 Route 创建批次相同；各 JSON 保留实际工具身份及来源指纹。

## 原件范围

- `creation-helper-entry.json`：BObject.OnAllocate 当前方法，以及 Factory 调用的无 metadata helper `0x1847700a0` 首 `.pdata` 片段。
- `creation-helper-continuation.json`：该 helper 的普通路径续段 `0x184770116–0x1847701e1`。
- `generic-allocation.json`：普通路径下游 `0x18476fd20`，包含 PoolManager.Allocate 后的组件取得与分配回调调用。
- `allocate-dispatch.json`：`0x185e87ac0` 的实际运行类型分派及具名 OnAllocate 目标。switch table 的数据字节也由范围解码器保留，不作为执行指令解释。
- `unit-allocation.json`：Unit.OnAllocate，连接 BObject.OnAllocate 的直接调用。

Factory 的上游完整方法复用父批次 `entry-bodies.json`，Controller → Spawn → Init 复用此前 [Route 创建原件](../../route-creation-20261107/initialization/create-enemy-bodies.json)。不把每次复用都写成新的客户端执行观测。

## 复跑

仓库根目录，按 JSON 内 selector／原生地址重提到独立目录，例如：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/checkpoint-allocation-replay/dispatch.json \
  disasm-at 0x185e87ac0 --max-bytes 2048

uv run --locked --offline docs/research/evidence/elemental-timing-20261102/extract_schedule.py \
  --out .cache/native-research/checkpoint-allocation-replay/unit.json \
  --method Torappu.Battle.Unit.OnAllocate
```

默认游戏路径见共享工具，其他安装位置用 `--game`。其余 helper 地址与范围在各 JSON 中；`disasm-at` 的范围可能止于单个 `.pdata`，必须按已登记续段恢复普通路径。未取 `0x1847701e1` 起的 XLua 替换分支，不声称它也遵守普通创建协议。

本批没有运行游戏、确认现场 XLua 绑定或逐个验证所有 Unit 子类。普通创建 helper 在 PoolManager.Allocate 返回后统一调用分配回调，本批不再拆池内新建／复用的实现；不能据此推导对象回收的全部顺序。
