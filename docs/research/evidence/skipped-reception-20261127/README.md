# 跳过普通接收事件的实际消费者补核

核对 2026-11-27。复用 `docs/research/evidence/reception-stages-20261115/content/` 的完整 Holder 事件索引 `inventory.json`、普通伤害程序 `programs.json` 和 524 包精确资源引用 `resource-search.json`。完整 Holder 为 base StreamingAssets/config/buff_template_holder.ab，SHA-256 `8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79`，对象 `CAB-7983df61b3ae63c96fb4e076fc3d80af / 6070581171229484677`，对象 SHA-256 `c03149251d47fa31e6f6cb5b696f9e93925f51a97bf9ee335593c888bdcb6fec`。将原 scan_reception.py 的 EVENTS 改成 (41,) 后重提同一对象，9054 模板、27 份事件41程序、172节点、0解析失败（[事件41原件](programs.json)）。独立固定镜像 `assets/arknights-game-data` revision `17759cc8cdf37388414145d16262a3a06f3ab25e` 的 `zh_CN/gamedata/battle/buff_template_data.json` 中 8662 模板得出相同 27 个键。

- event41 (ON_APPLYING_SKIPPED_MODIFIER) 共27模板；6条也有 event6 (ON_APPLYING_MODIFIER)，其余21条没有6但全部有 event10 (ON_TAKE_DAMAGE)。其中全部21条在既有524包扫描中有明确 Buff 模板序列化引用，共28处；不等同运行时激活观测。
- 该结果说明「不订阅普通 Applying 而订阅 skipped Applying」确实存在；但本范围内没有只处理41、既不处理6也不处理10的样本。41并非普通Applying6的镜像；主要是普通受伤链被绕过时，明确获准保留的内容逻辑。

| 内容／模板 | Holder index、事件 | 资源绑定（既有 resource-search.json /result/hits） | 事件10（programs.json索引）／41处理 |
|---|---|---|---|
| 伺夜狼群 `vigil_wolf_t_1[listener]` | 4547，[27,41,10] | /1416/references/0；pkgrps/btl_pfb_tokens_0.ab，token_10028_vigil_wolf/Modes/Default/Body/Talents/1，PathID -4165121327147104433 | 10 (348)／41：满足狼影持有和致死条件时取消、消耗狼影、补回生命；41另判断IsDamage。 |
| 刺胄之弹 `enemy_acstmr[check]` | 4225，[2,10,41] | /449/references/0；battle/enm_pfb_28.ab，enemy_9016_acstmr/Talents/check_block，6902620838181312984 | 10 (320)：非自身来源取消并重新生成 skip=true 的纯伤害；41：非自身来源取消，不再重新生成。 |
| 废热喷口 `trap_eradio_eradio_trait` | 1492，[10,41] | /1437/references/0；pkgrps/btl_pfb_tokens_1.ab，trap_124_eradio/Others/Direction/Talents/1，-2981399925274812531 | 10 (128)：直接 CancelModifier(UNHURTABLE)；41：IsDamage 后同样取消。 |

复现既有证据筛选（仓库根路径）：

```sh
python - <<'PY'
import json
from pathlib import Path
from collections import Counter
p=Path('docs/research/evidence/reception-stages-20261115/content')
idx=json.loads((p/'inventory.json').read_text())['result']['templates']
hits=json.loads((p/'resource-search.json').read_text())['result']['hits']
selected=[x for x in idx if 41 in x['events']]
without6={x['template'] for x in selected if 6 not in x['events']}
refs=Counter(r['resolvedTemplateKey'] for h in hits for r in h['references'] if r['resolvedTemplateKey'] in without6)
print(len(idx), len(selected), len(without6), sum(10 in x['events'] for x in selected if x['template'] in without6), len(refs), sum(refs.values()))
for x in selected: print(x['index'], x['template'], x['events'])
# 9054 27 21 21 21 28
PY
```

复提 41 的完整程序：在临时目录复制同一批次 `scan_reception.py`，将 EVENTS = (5, 6, 10) 改为 EVENTS = (41,)，更新 scope 字符串，再运行 `python <临时脚本> --out <新目录>`。固定镜像对应事件名为 ON_APPLYING_SKIPPED_MODIFIER。此证据范围不包括热更新覆盖结果或实际运行、活跃 XLua；资源中的直接绑定并不单独证明每份 Buff 已生效。
