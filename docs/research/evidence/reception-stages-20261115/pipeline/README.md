# 接收阶段：普通 Modifier 管线

只读静态调查，结论见 [findings.md](findings.md)。不修改产品接口或决定公开 Hook 数量；实际程序绑定由同批 `../content/` 提供。

- 日期：2026-11-15。
- Windows DLL SHA256：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- metadata SHA256：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29；模块基址 `0x180000000`。
- `native.json`：84个完整方法、Buff/Event的111个常量、相关字段布局；覆盖构造、Apply、通用／专属接收、skip／force、来源提交前、普通提交、两侧提交后与EP屏障的资格前消费。metadata全范围补取同名接收slot131/132/133与SP写入slot113的全部实现，避免仅凭基类推断普通Character／Enemy。
- `extract.py` 的确切owner／方法名选择保存在 `result.selection`；正文读取器复用既有 `trace_flags.full_body`，直到下一个metadata入口，保留.pdata分段。工具和输入指纹均在provenance。
- `verification.json`：独立重提比较完整result；没有执行客户端或产品测试。XLua delegate只保留分支，未验证活跃替换。

从仓库根执行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/reception-stages-20261115/pipeline/extract.py \
  --out docs/research/evidence/reception-stages-20261115/pipeline/native.json

python docs/research/evidence/reception-stages-20261115/pipeline/verify.py \
  --out .cache/native-research/reception-stages-20261115/pipeline/replay
```

安装目录可用 `extract.py --game` 覆盖。`native.json`包含当前完整原体；旧Case11/38及既有resource-mechanisms原件只作问题定位，没有被产品实现或测试替代原生证据。
