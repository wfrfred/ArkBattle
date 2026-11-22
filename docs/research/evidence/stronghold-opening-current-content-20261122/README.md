# 卫戍规程序列Ⅰ的砾、临光和卡西米尔盟约

2026-11-22 核对活动 `act3autochess/V3_1`。活动配置来自固定的 11 月 13 日资源镜像，盟约模板来自本机 Windows 已下载的 Holder。原表指针、模板身份及两份输入的指纹见 [result.json](result.json)。镜像版本与本机缓存的差异见[热更新批次](../stronghold-opening-hotfix-20261122/README.md)。

- 本期商店数据包含砾 `chess_char_2_06_a` 与耀骑士临光 `chess_char_6_05_a`。默认技能下标分别是 `0` 和 `2`。临光棋子有 `kazimierzShip` 和 `raidShip` 盟约，初始形态为精英二阶段。 [活动表固定版本](https://github.com/yuanyan3060/ArknightsGameResource/blob/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/excel/activity_table.json)
- 卡西米尔盟约的 `bondeffect_kazimierz_2` 通过 `env_gbuff_new` 选择 `act3autochess_bond_eff_kazimierz`。实际热更模板在效果开始时向 `kazimierz_born` 加一，推进时读取该计数计算攻击加成。该配置描述玩法盟约的独立计数。临光 S2 仍按自身接力标记选择退场倍率。 [临光 S2 原生程序](../nearl-deployment-combo-20261122/README.md)

本批证据核对模式内的实际角色选项、盟约配置和模板绑定。运行中盟约启用范围、开局部署时每张卡的具体状态以及临光 S2 的实战结果需独立取证。

## 复跑

从仓库根目录执行。`--game` 可以选择有同一 Holder 的客户端安装。

```sh
curl -fsSL 'https://raw.githubusercontent.com/yuanyan3060/ArknightsGameResource/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/excel/activity_table.json' \
  -o /tmp/arkbattle-current-activity-20261113.json
python3 docs/research/evidence/stronghold-opening-current-content-20261122/extract.py \
  --activity /tmp/arkbattle-current-activity-20261113.json \
  --out /tmp/arkbattle-stronghold-opening-current-content.json
```
