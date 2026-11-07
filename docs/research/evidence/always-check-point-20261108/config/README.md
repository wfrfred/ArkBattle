# Enemy Prefab 的 alwaysCheckCurrentPoint

2026-11-08 本机客户端静态配置扫描。结论限于序列化值，不证明关卡使用、技能触发或运行时 Cursor 仍保留此值。

## 来源与范围

- 客户端 `GameAssembly.dll`：`cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`。
- `global-metadata.dat`：`e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- 扫描 `Arknights_Data/StreamingAssets/AB/Windows/battle/enm_pfb_*.ab` 全部 38 包（包含 `enm_pfb_base_0.ab`），以及 `pkgrps/btl_pfb_tokens_*.ab` 全部 7 包。每包指纹及 Unity 版本见 `prefabs.json.provenance.sources`。
- 检查所有 66,031 个 MonoBehaviour 的脚本 PPtr。Enemy 基类与 22 个 metadata 派生类取自[已归档继承枚举](../../route-operations-20261107/cursor/subclass-slot-audit.json)；另检查所有包含 `_alwaysCheckCurrentPoint` 的 TypeTree，避免仅按类名筛选。
- MonoScript 外部引用解析到 `anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin`；对象身份保留 Bundle、SerializedFile、PathID、原始对象 SHA-256 和 GameObject 层级。不是把不同文件的相同 PathID 当成同一对象。

## 结果

45 包全部成功解码。找到 2,206 个 Enemy 组件：`true` 3、`false` 2,203、字段缺失 0、其他值 0。Token 包内没有 Enemy 组件或该字段命中。没有非 Enemy 类型携带该字段。

| Prefab 根对象 | Bundle | SerializedFile | Enemy 组件 PathID |
| --- | --- | --- | --- |
| `enemy_10163_mnctur` | `battle/enm_pfb_29.ab` | `CAB-ce545482313ddad0252173b3b1f77860` | `3980254807321068725` |
| `enemy_10163_mnctur_2` | `battle/enm_pfb_29.ab` | `CAB-ce545482313ddad0252173b3b1f77860` | `-1061643995761480392` |
| `enemy_2137_shsdgo` | `battle/enm_pfb_33.ab` | `CAB-16a59ea5c517e295fc7dc956bda936e3` | `5490958040163831875` |

这三个组件均直接绑定 `Torappu.Battle.Enemy`，MonoScript 为 `CAB-658d74aab777086fc32b93f385be999a` / `-6629209555389654693`。`prefabs.json.result.components` 保存全部命中条目的身份与布尔值，并保存三个 true 组件的完整解码字段。

另有 6 个 MonoBehaviour 的 MonoScript PPtr 为 `{fileID:0, pathID:0}`，仅包含通用 MonoBehaviour 字段，不含目标字段。它们单独列在 `nullScriptComponents`，不是未解析的非空引用；未解析非空脚本引用为 0。

## 复跑

在仓库根目录执行：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/always-check-point-20261108/config/scan_prefabs.py \
  --out /tmp/always-check-point-prefabs.json
```

可用 `--game` 指定客户端根目录；`--bundle battle/enm_pfb_29.ab` 可单独复查某包。脚本复用已归档 TypeTree 解码器与共享 `unity_assets.py`，不运行客户端。`complete` 只表示选定包均成功读取，不代表扫描了整个游戏的全部资源类别。此处不扩展到其他 Bundle、实例覆盖、XLua 或运行时写入。
