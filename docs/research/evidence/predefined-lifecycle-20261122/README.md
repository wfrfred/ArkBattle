# 关卡预置的困难合成与别名入口

2026-11-22 补核关卡预置实例和预置卡。机制结论维护在 [Case 24](../../cases/24-deployment-cost-and-supply.md#关卡预置的实例手卡与别名)。普通预置创建、普通卡注入及角色来源身份复用 [2026-11-12 批次](../predefined-source-20261112/README.md)。调度执行器的前置及后置行为见 [Case 30](../../cases/30-scheduler-action-data-fields.md#非-spawn-执行器)。

## 原表证据

[levels.json](content/levels.json) 从仓库固定的 `Kengxxiao/ArknightsGameData@17759cc8cdf37388414145d16262a3a06f3ab25e` 读取八份关卡和对应阶段表行。记录原文件相对路径、Git blob、原始字节 SHA-256、四数组条数及选中的 JSON Pointer。此处为用途取样，涵盖普通有卡无实例、直接预放、隐藏卡共用调度命令、同角色不同实例别名、Token 卡与实例并存及困难数组的实际正例。

社区对照按各自页面的固定编队、已部署干员和调度行为读取。表字段与原生调用关系由本批的镜像及客户端证据分别证明。 [PRTS 1-2](https://prts.wiki/w/1-2) · [M8-6](https://prts.wiki/w/M8-6) · [TW-S-1](https://prts.wiki/w/TW-S-1#遭遇) · [作战机制](https://prts.wiki/w/%E4%BD%9C%E6%88%98%E6%9C%BA%E5%88%B6)

## 客户端证据

Windows x64 IL2CPP，metadata v29。以下输入指纹与前一批一致。配置镜像与客户端分开固定版本，正文为静态分支取证。

| 原件 | SHA-256 |
| --- | --- |
| GameAssembly.dll | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

- [native.json](native/bodies/native.json) 保留方法签名、字段名及偏移、PE 选段边界和输入指纹。方法正文的 `.asm` 由共享工具逐段解码。
- [LoadComposeHardPredefine](native/bodies/LoadComposeHardPredefine-34313.asm) 在 `0x182791b1d` 和 `0x182791b37` 核对困难块及选项，`0x182791b72–0x182791bd5` 记录四数组来源。普通注入和模式选择保存在[前批正文](../predefined-source-20261112/native/README.md#配置注入与实例创建)。
- [ACTIVATE_PREDEFINED 包装](native/bodies/MoveNext-73514.asm) 和 [TryActivePredefined](native/bodies/TryActivePredefined-73336.asm) 定位 Action key、调用顺序及返回分支。[GetAliasId](native/bodies/GetAliasId-32208.asm) 固定别名回退。[预置加载](native/bodies/LoadPredefinedData-65640.asm)、[别名创建](native/bodies/SpawnPredefinedInstanceByAlias-65656.asm) 固定存储容器与命中后的创建入口。
- [卡分支](native/bodies/ActivateInternalHiddenCard-65627.asm)、[Deck 回调](native/bodies/_ActivateInternalHiddenCard_b__0-65860.asm) 和 [Deck 别名入口](native/bodies/ActivateHiddenCard-66758.asm) 固定活跃 Deck 查卡链。[Deck 卡对象重载](native/bodies/ActivateHiddenCard-66759.asm) 保留 `SetHidden` 及之后的列表通知判断。全量隐藏卡命令另见 [Scheduler 执行器原件](../scheduler-general-20261107/execution/native.json) 的 #73526。
- [撤回别名解析](native/bodies/WithdrawPredefinedInstByAlias-65660.asm) 和[撤回资格及结束](native/bodies/_WithdrawPredefinedCharacter-65761.asm) 固定配置匹配及实际单位判定。

## 复跑

从仓库根目录运行。需要检出指定镜像提交及具有同一输入指纹的客户端。脚本默认使用仓库中的镜像子模块和前批客户端位置，分别可通过 `--repo`、`--game` 指定。

```sh
batch=docs/research/evidence/predefined-lifecycle-20261122
work=.cache/native-research/predefined-lifecycle-20261122/replay
export UV_CACHE_DIR="$PWD/.cache/uv"
python3 "$batch/content/extract.py" --out "$work/levels.json"
uv run --offline --locked "$batch/native/extract.py" --out "$work/native"
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
```

复核范围为原表样本、选中的普通静态分支及已有证据依赖。客户端运行、热更新、其它模式、重复激活与退出的完整结算均在本批范围之外。
