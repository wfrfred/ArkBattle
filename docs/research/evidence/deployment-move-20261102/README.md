# 特殊移动的结束原因

取证日期：2026-11-02。问题限定为：特殊撤退—再部署是否携带区别于普通结束的原因。结论集中在[案例 24](../../cases/24-deployment-cost-and-supply.md#特殊移动的结束原因)。本批不修改实现，不确定 ArkBattle 的结束原因或部署请求类型。

## 输入与方法

使用共享 `native.py` 从当前客户端 metadata 定位 `Torappu.Battle.Entity/FinishReason`，读取字段名及类型；未运行游戏，未验证现场 XLua。

| 文件 | 大小 | SHA-256 |
| --- | --- | --- |
| GameAssembly.dll | 223112680 | `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff` |
| global-metadata.dat | 46669332 | `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5` |

完整输入路径、metadata v29、image base、工具源码指纹和定位信息见 `finish-reason.json.provenance`。

## 证据与边界

`finish-reason.json` 直接列出 `MOVE_LIKE_RESPAWN_SELF`、`MOVE_LIKE_RESPAWN_EXTERNAL`，并与 `WITHDRAW`、`RESPAWN_SELF` 等字段区分。该输出只读取枚举成员，不提取其常量值，也不证明哪些具体技能调用这些路径。

[旧版本移动调用链](../blocker-roles-20261031/movement/README.md)另已确认：`MoveLikeRespawnSelf`／`MoveLikeRespawnExternal` 向 `FinishMe(reason)` 传入不同常量，随后调用创建入口。两批客户端指纹不同；本批不把旧地址、方法编号或常量直接套到新版本，也不据枚举名推断全部返费、冷却、继承或部署事件行为。

## 文件与复现

`finish-reason.json` 为以下命令的原始输出，保存所选类型及字段，不保存客户端本体。实际执行时使用 `.cache/native-research/move-deployment-review/finish-reason.json` 作为输出，随后原样归档。

从仓库根目录执行，`--game` 可指定其他客户端安装目录：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline --locked \
  .agents/skills/arkbattle-native-research/scripts/native.py \
  --out .cache/native-research/move-deployment-review/finish-reason.json \
  type 'Torappu.Battle.Entity/FinishReason'
```

共享工具根据当前 metadata 定位类型，不依赖本批的旧索引；复核时应先比较输入指纹。
