# Buff 覆盖组身份与容器消费证据

采集日期：2026-11-11。只读取本机 Windows x64 IL2CPP metadata v29 与原生指令，没有运行客户端或验证 XLua/hotfix。结论统一维护在 [Case 01](../../../cases/01-buff-installation-and-parent-scope.md)。

## 输入与范围

| 输入 | SHA-256 |
| --- | --- |
| `GameAssembly.dll` | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| `global-metadata.dat` | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

完整路径、长度、工具指纹及当前注册表在 [native/metadata.json](native/metadata.json)。

选择范围：`BuffData.GetOverrideKey`，`Buff.Reset`，`Character.cardUid`，容器的 NewBuff、覆盖组创建／查询／key 候选／迁移、结束清理与整体回收，以及 OverrideGroup 的重置与移除。补查 `CreateBuff.Execute` 和 Buff 动作 Context 的来源，用于核对实际内容。每个选中方法按当前完整方法名定位，并拆解到下一原生方法边界；完整正文保存在 `native/*.asm`，方法与各段字节 SHA-256 在 [native/native.json](native/native.json)。

[xrefs.json](native/xrefs.json) 是三个选中入口的 E8／E9 直接引用候选，不代表全部虚调用或特化入口。[literals.json](literals.json) 从本次指令读取的静态 usage 槽，解码 key 拼接字符串及两个类型身份；不是运行时堆对象采样。

## 复跑

从仓库根目录执行，输出到独立缓存目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --offline --locked docs/research/evidence/buff-group-expiry-20261111/group/extract.py \
  --out .cache/native-research/buff-group-expiry-20261111/group/replay \
  --xrefs 0x1806b3fa0 --xrefs 0x1806b43c0 --xrefs 0x1806b6150
python docs/research/evidence/buff-group-expiry-20261111/group/decode_literals.py \
  --native .cache/native-research/buff-group-expiry-20261111/group/replay/metadata.json \
  --out .cache/native-research/buff-group-expiry-20261111/group/replay/literals.json
```

`decode_literals.py` 校验实际输入与 metadata 记录的指纹，再从已定位的 MetadataRegistration 解码类型表；本批槽位属于上述客户端，不套用于更新后的版本。配置存在及真实启用路径由同批配置调查分别记录。
