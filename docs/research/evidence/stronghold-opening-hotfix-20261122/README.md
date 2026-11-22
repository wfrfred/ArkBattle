# 卫戍规程序列Ⅰ的开场热更新核对

2026-11-22 核对两个独立来源。[结果](result.json) 保存 Windows 资源清单及已下载文件指纹，也保存 Lua 镜像的固定版本、22 份登记脚本的 Git Blob 和指纹、替换方法名称及相关调用定位。

- 本机 Windows 基础资源为 `26-10-20-11-10-38-04170990`，缓存更新为 `26-11-13-06-34-18-84612175`，格式均为 `V079`。缓存更新带有实际下载的 `activity/[uc]act3autochess.ab`，基础清单没有此包。两个清单中的 `charpack/char_1014_nearl2.ab` 条目有相同 MD5，本地仍用基础文件。已下载的技能和 Buff 资源与基础文件不同，先前按与本问题相关的对象分别提取，所查临光的技能根和 Buff 路径一致。 [临光配置投影](../nearl-deployment-combo-20261122/README.md)
- 公开 Lua 镜像固定于提交 `0fdfa06570cda97c404a4519da4df984eae56951`，资源标识 `26-11-13-06-37-23-89286612`。此标识与本机 Windows 缓存是同一天的不同标识，两份材料分别记录。镜像的 `definedfix.lua` 列出 22 个脚本，本次逐一查阅各脚本的 `Fix`／`Fix_ex` 声明。 [版本](https://github.com/yuanyan3060/ArknightsGameResource/blob/0fdfa06570cda97c404a4519da4df984eae56951/version) · [登记文件](https://github.com/yuanyan3060/ArknightsGameResource/blob/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/%5Buc%5Dlua/hotfixes/definedfix.lua)
- `AutoChessGameManagerHotfixer` 替换 `StartBattle`，仍在载入、重置和特定 Boss 步进模式设置后调用 `DoBattlePreSpawn()`。`AutoChessStepModeManagerHotfixer` 会在开场布阵期间跳过步进模式的角色状态通知 `_ReqCharBattleStatusChanged`。这批登记脚本中，没有直接替换 `DoBattlePreSpawn`、`_TryDeployChessInst`、牌组接力登记、`Card.Draw` 或 `OnCardDrawn` 的声明。 [开场替换函数](https://github.com/yuanyan3060/ArknightsGameResource/blob/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/%5Buc%5Dlua/hotfixes/autochessgamemanagerhotfixer.lua#L74-L87) · [步进角色状态通知](https://github.com/yuanyan3060/ArknightsGameResource/blob/0fdfa06570cda97c404a4519da4df984eae56951/gamedata/%5Buc%5Dlua/hotfixes/autochessstepmodemanagerhotfixer.lua#L48-L55)

原生开场、补位与接力路径见[原生调用链](../stronghold-opening-deploy-20261122/README.md)。镜像检查范围是该登记文件和所列脚本的静态声明。未重放本机客户端战斗，也未据镜像替代本机运行时实际注册状态。

## 复跑

从仓库根目录执行。工具默认从 GitHub 的固定提交读取 Lua 文件。离线时用 `--mirror` 提供该提交的本地工作树。可用 `--game` 指定 Windows 安装目录。记录中的 Git Blob 和 SHA-256 可校验镜像内容。

```sh
python3 docs/research/evidence/stronghold-opening-hotfix-20261122/extract.py \
  --out /tmp/arkbattle-stronghold-opening-hotfix.json
```
