# 坐标、属性范围与调度配置补证

2026-11-10。对应 Unit 审计中坐标取整、属性默认范围、局部避障采样及 Schedule Data 限制的来源缺口。机制结论分别归案例 15、30；属性范围与计算保底交由属性研究统一说明。本目录不确定 Core 的简化或支持范围。

## 来源与范围

当前 Windows x64 客户端、IL2CPP metadata v29：

| 输入 | bytes | SHA-256 |
| --- | --- | --- |
| GameAssembly.dll | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

配置镜像固定为 `Kengxxiao/ArknightsGameData@bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`，不将镜像和安装客户端视为同次构建。配置扫描选取 `zh_CN/gamedata/levels/**/level_*.json` 的 3,997 份固定 Git 对象，逐文件原文字节复算 Git blob SHA-1；3,714 份纳入样本、283 份 sandbox/tower 排除样本分开统计。旧数字 ActionType 未凭枚举顺序解码。零命中不证明所有内容不存在。

## 材料

- `native.json`：当前五个 AttributesData 字段的 token、原始 custom-attribute blob、构造器和受限解码；字段范围建立、最终 Clamp、三个 Entity 属性 getter、HP 元素与 EP 计算、坐标及取整辅助程序、最少局部避障输入/缓存入口、Branch 分组与执行入口。不是完整 metadata 转存。
- `configuration.json`：扫描范围摘要、交错组位置及必要原节点；保留 RO5 Branch、实际出生与 Enemy 覆盖/黑板、RO6 主线 Pack。完整原文件仍在缓存，所选文件指纹与 Git blob 身份在结果内。
- `content.json`、`dysuib-second-relic-passive.bin`：`enm_pfb_29.ab` 中 `enemy_2128_dysuib → Talents → SecondRelicTalent` 的实际组件及匹配模板。保留宿主 Buff 与 `active_relic_b` 条件，不把模板引用当作无条件触发。
- `reused-sources.json`：复用旧运动证据的原件指纹和版本，未把新客户端读数回填旧归档。完整扫描、无关 Bundle 索引和中间提取留在 `.cache`。

## 复跑

在仓库根运行。`extract.py` 以方法全名重新定位当前方法；复查历史结果前应先核对上述客户端指纹，版本不符重新调查，不套旧 VA。专用 custom-attribute 解码只处理第一个 AttributeMeta 的枚举及 float 参数；其余属性保留原文，不声称已通用解码。

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py \
  --out .cache/native-research/unit-audit-20261110/coordinates-numeric/replay-native
python docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract_content.py \
  --out .cache/native-research/unit-audit-20261110/coordinates-numeric/replay-content
python docs/research/evidence/unit-audit-20261110/coordinates-numeric/scan_config.py \
  --mirror .cache/native-research/checkpoint-nondefault-20261107/mirror \
  --out .cache/native-research/unit-audit-20261110/coordinates-numeric/replay-configuration
```

配置复跑需要固定修订的 Git tree 与原文件；缺失或字节不符直接报告失败，不把不可读取材料计入零命中。资源解码复用已归档的 `attack-addon-order-20261102/content/decode_content.py`，其指纹和依赖记录在输出中。调用共享 `config.py` 的初次整表选择结果与中间结果不归档；`scan_config.py` 复用其 selector/get 协议并验证选中文件。

## 限制

静态普通 native 分支，没有执行游戏、验证活跃 XLua 或覆盖全部属性范围覆写。方法按连续 `.pdata` 片段补到下一独立 managed 方法入口，以包含拆分的 fallback；分段与字节哈希均保留。两个 MoveController 片段末尾各有一字节 `01` 未解码，`fullyDecoded=false` 原样保留；所引缓存和输入指令可以直接定位，不将整段称为完整语义还原。匿名数学 helper 只保留所选窗口中的可达基本块，外部 tail 目标明确列出；未据此宣称验证全部非有限输入或处理器优化分支。共享地址超过八个方法名的别名列表仅记数量，不冒认唯一方法身份。

Pack 和交错组的静态支持、实际配置/模板引用与运行时观测分别判断。RO5 已保留 `rogue_5_dyswrd_relic_b` 宿主 Buff 条件及关卡 `active_relic_b=1` 覆盖；本批未沿玩法准备链追溯该条件 Buff 的全部安装来源，也未观测每次 Branch 实际执行。默认范围与可覆写范围、属性与公式保底必须分开；没有新增项目决定。
