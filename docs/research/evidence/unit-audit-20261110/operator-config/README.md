# 干员配置数据补核

2026-11-10。核对等级／信赖关键帧、模组阶段属性及 TALENT_DATA_ONLY 的消费入口；机制结论见 [Case 06](../../../cases/06-talent-lifecycle-and-model.md#干员配置数据补核2026-11-10)。

- `native.json`：本机 Windows x64、metadata 29 的选定方法、字段及泛型关键帧取值入口。DLL SHA-256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata SHA-256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`。按方法全名及签名重新定位，不沿用旧索引。
- `configuration.json`：第三方镜像 `Kengxxiao/ArknightsGameData` 的固定提交 `17759cc8cdf37388414145d16262a3a06f3ab25e`，选择泥岩／黍的属性与天赋、两套模组及信赖表；记录四份完整输入的字节哈希和 Git blob SHA-1。表版本与本机客户端分别记录，不假定相同。
- 整数属性写入调用的取偶舍入 helper 另见 [coordinates-numeric](../coordinates-numeric/README.md)，不重复转储。

复跑：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked --script docs/research/evidence/unit-audit-20261110/operator-config/extract.py --out .cache/native-research/unit-audit-replay/operator-config
python docs/research/evidence/unit-audit-20261110/operator-config/select_config.py --data .cache/native-research/unit-audit-20261110/operator-config --out .cache/native-research/unit-audit-replay/operator-config
```

第二条命令输入为上述提交 `zh_CN/gamedata/excel/` 下的 `character_table.json`、`uniequip_table.json`、`battle_equip_table.json`、`favor_table.json`，下载后先比对 `configuration.json` 中的完整文件指纹。

方法区间取至下一已知方法，包含连续分片与填充；`fullyDecoded` 仅表示所选字节解码完整。泛型取值入口按当前 VA 选择，版本变化需重新定位。间接分派、XLua 热更和实际关卡运行未验证；配置正例不等于运行现场观测。此批不穷尽其他模组、模式过滤、天赋生命周期或外部预处理。
