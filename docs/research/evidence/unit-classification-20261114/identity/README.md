# 单位分类：类、Category、职业

采集日期：2026-11-14。结论见 [findings.md](findings.md)。这是原生取证，不包含 ArkBattle 架构决策或代码修改。

## 输入与边界

- 本机 Windows x64 客户端，metadata v29。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。
- `native.json.provenance` 保存完整源路径、大小、指纹、重新定位的 CodeGenModule／MetadataRegistration 和脚本指纹。字段及方法先从全 metadata 定位，再按记录的领域／名称选择；不以现有方法名列表代表全部入口。
- 研究通用战斗，含干员、敌人、召唤物、装置及集成战略的实际附加职业配置；不调查生息演算、保全派驻或船运机制。metadata 中保留的局部枚举只用于分辨同名数值，不能据此声称对应模式在范围内。
- 方法按连续 `.pdata` 区间提到下一注册方法地址；不是只保存首个异常处理片段。原生 XLua 分支存在，但本批只静态核实 fallback，没有运行完整游戏。

## 文件

| 文件 | 内容 |
| --- | --- |
| `extract.py`、`.lock` | 扫描字段／方法、核对父类、解枚举、提完整 native 方法、直接调用候选和使用点字符串。 |
| `native.json` | `provenance/result`；16 个完整方法，字段与父类清单，18 组枚举／常量，3 个 TypeInfo 槽、黑板字面量、直接 xref 候选。候选不自动等于已确认调用；对应已选 caller 的指令才作结论。 |
| `select_content.py` | 同输入复用 Case 33 的冻河 S3 Selector 及数据绑定，重新验证本机 shared skills 和 MonoScript Bundle 字节哈希。 |
| `content.json` | 精确源记录指针、组件 PathID、层级、MonoScript 关联及角色／技能绑定。 |
| `findings.md` | 已证实的分类轴、初始化／修改／读取链、真实内容和未闭合边界。 |

整数枚举用 metadata 的压缩整数和有符号转换解码，保留 `encodedBytes`；包含 `0xf0/0xfe/0xff` 的完整整数形式，故 `PlayerSideMask.NONE` 正确为 `int.MinValue`，不按字段名猜值。`ProfessionCategories` 是常量类而非 Enum，单独标明父类；不存在有数据的常量时不制造枚举值。

## 复用证据

- Case 24 的同指纹 `device-source-20261111/hierarchy/metadata.json`：Trap／Token／Character 类链及 Card 数据链。
- `card-source-identity-20261111/allocation/native/_ConvertInternal-79236.asm` 与其 `native.json`：基础职业及 mainPower／subPower 转入 BattleCharacterData。大方法已有完整分段，未重复归档。
- Case 32：我方莱塔尼亚召唤物仍为 Enemy 的实际内容与 Side 变更。
- `targeting-pipeline-20261109/content/selected-prefabs.json`、`selected-data.json`：已绑定的冻河 S3 Selector。本批哈希匹配后精确摘录。
- 同批 `../config/static-inputs.json`：TOKEN／TRAP 职业及镜中虚影的 executor 分支；迷迭香集成战略模组的 `extra_profession: caster` 正例与原始 JSON 指针。

## 复跑

在仓库根目录，输出到缓存空目录：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
work=.cache/native-research/unit-classification-20261114/identity/replay
batch=docs/research/evidence/unit-classification-20261114/identity
uv run --locked --offline "$batch/extract.py" --out "$work/native.json" \
  --body 76369 --body 76375 --body 76376 --body 79594 --body 79597 \
  --body 84729 --body 84730 --body 87516 --body 78792 --body 78757 \
  --body 78927 --body 79217 --body 78633 --body 98858 --body 77384 \
  --body 78793 --xref 84730 --xref 79594 --xref 78792
python "$batch/select_content.py" --out "$work/content.json"
```

两脚本默认本机安装路径。native 可用 `--game` 指定替代输入；content 的复用验证明确针对原档案记录的本机路径，任一 Bundle 哈希不同便停止，不能静默复用另一版本。复跑比较 `result`；采集路径、脚本指纹等 provenance 可独立核对。
