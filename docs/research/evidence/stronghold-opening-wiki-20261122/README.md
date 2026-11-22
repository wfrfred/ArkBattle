# 卫戍开场与耀骑士临光的 PRTS 修订沿革

2026-11-22 查阅三份帮助页的公开修订正文。记录覆盖旧页 92 份修订、现行帮助页 66 份修订及 `帮助v2` 14 份修订。[revisions.json](revisions.json) 保存关键修订号、API 时间、正文指纹及相关短句。日期和时间在下表以 UTC+8 表示。

| 版本 | 修订证据 |
| --- | --- |
| 2024 年首期「卫戍协议」 | 11 月 22 日 01:01，`327715` 首次加入临光 S2 判定说明。`327716` 暂时撤销此编辑，`327806` 在同日 23:34 恢复说明。当时的开场顺序是先从下到上，再从左到右。该页后于 2025 年 11 月 18 日移入 2024 年归档。 [加入修订](https://prts.wiki/index.php?oldid=327715) · [恢复修订](https://prts.wiki/index.php?oldid=327806) · [旧页作战期](https://prts.wiki/w/卫戍协议/2024/帮助#作战期) · [2024 年官方开服公告](https://ak.hypergryph.com/news/9626) |
| 2025 年「盟约」 | 11 月 25 日 13:58 新帮助页的第一份修订 `375846` 已包含该说明。后续正文将 2026 年 3 月 14 日「盟约」下半的开场顺序记为先从上到下，再从左到右。 [新帮助页首版](https://prts.wiki/index.php?oldid=375846) · [现行帮助作战阶段](https://m.prts.wiki/w/卫戍协议/帮助#作战阶段) · [2025 年官方开服公告](https://ak.hypergryph.com/news/9606) |
| 2026 年「规程·序列Ⅰ」 | 11 月 17 日 15:50 的现行帮助修订 `450752` 仍有该说明。11 月 21 日 18:46，`帮助v2` 首版 `451117` 的完整正文与 `450752` 完全相同。这句话在此后一直保留到 11 月 22 日 16:45 的 `451231`。 [现行帮助修订](https://prts.wiki/index.php?oldid=450752) · [帮助 v2 首版](https://prts.wiki/index.php?oldid=451117) · [帮助 v2 作战阶段](https://prts.wiki/w/卫戍协议/帮助v2#作战阶段) · [2026 年官方开服公告](https://ak.hypergryph.com/news/4915) |

这些修订能证明现行文档沿用了 2024 年首期的描述。两份现行说明共用正文来源，未找到「规程·序列Ⅰ」对临光 S2 这项判定的独立实战复测。官方公告只用于核对赛季开启时间。

## 复查

以下是关键修订正文的公开查询。查看正文各行是否出现 `卡西米尔干员判定`，并对 `slots.main` 的原始正文按 UTF-8 计算 SHA-256。完整历史复查可将 `revids` 换成单一页的 `pageids` 和 `rvlimit=50`，并按返回的 `continue` 参数翻页。三份页面 ID 为 `73556`、`86165`、`100756`。

```sh
curl --fail --silent --show-error --compressed --get 'https://prts.wiki/api.php' \
  --data-urlencode 'action=query' --data-urlencode 'prop=revisions' \
  --data-urlencode 'revids=326779|327580|327715|327716|327727|327806|375102|375846|450752|451117|451231' \
  --data-urlencode 'rvprop=ids|timestamp|comment|content' \
  --data-urlencode 'rvslots=main' --data-urlencode 'format=json'
```
