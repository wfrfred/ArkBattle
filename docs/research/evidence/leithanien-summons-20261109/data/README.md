# EnemyData 查询范围与缺口

`enemy-data-lookup.json` 记录对 `enemy_9025_aclts` 和 `enemy_9026_acltm` 的精确查询。下载的 Kengxxiao 全局 EnemyDB 为 Blob `62ab806926b9c8ca5c80524730caf0066f6c2c2f`，原始字节 SHA-256 为 `eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b`。查询时仓库 HEAD 为 `63c7cec73c3858d0ae913f85cc89af3cef4d744f`，提交时间 `2026-11-01T02:17:15Z`，早于本次新内容开放。

扫描全局 `enemies` 的 2216 条记录，两 key 均未命中。该结果只界定这份镜像，不证明当前客户端中不存在两项配置，不能据此补造 `sideType`、`blockCnt`、`moveSpeed` 或关卡覆盖值。整份 15 MB 数据仅保留在 `.cache`，未归档到本证据目录。

另已核对镜像的 `activities/act1autochess/level_autochess_enemy_data.json`（Blob `7fac4e46369747703a3f2e625cb9ea40eff8e8dd`）无两 key；同名 `act3autochess` 路径返回 404。这些仍是镜像范围内的结果。

当前本地热更缓存 `.cache/native-research/autochess-update-20261108/level_autochess_enemy_data.raw` 为加密二进制，本批只记录指纹，未解密，因此上述数值和覆盖仍未知。Prefab 与客户端阻挡、追踪实现由同批其他证据独立核对。

这里的缺口限定为 EnemyData 表；两单位 Prefab 的 ALLY 阵营索引已由 [content](../content/README.md) 独立确认，不将表未取得误写成阵营配置完全未知。

复跑（缓存文件已存在时）：

```sh
python docs/research/evidence/leithanien-summons-20261109/data/inspect_enemy_data.py \
  --database .cache/native-research/leithanien-enemydata-20261109/enemy_database.json \
  --commit .cache/native-research/leithanien-enemydata-20261109/master-commit.json \
  --encrypted-level .cache/native-research/autochess-update-20261108/level_autochess_enemy_data.raw \
  --out /tmp/leithanien-enemy-data-lookup.json
```

不可变镜像原件可由 JSON provenance 中的 Git Blob URL 获取；下载后解码 API 返回的 Base64 `content`，并核对字节 SHA-256。重新下载 `master` 可能取得不同版本，脚本会核验本批 Blob SHA，避免把新旧版本混为一份证据。
