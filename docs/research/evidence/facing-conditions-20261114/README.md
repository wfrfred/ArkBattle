# 面向转向条件与调用时点

提取日期：2026-11-14。机制结论统一维护在[案例35](../../cases/35-facing-and-turning-conditions.md)，本目录保留证据、选择器和限制，不设计 Core API。

## 来源

Windows x64 安装客户端的 DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，与[上一批](../facing-semantics-20261113/README.md)一致。每份原生记录保存各自提取器和源文件指纹；不把资源 manifest 编号当成 DLL 版本。

实际 Ability、Animator 和敌人部件绑定另按当前 Bundle、SerializedFile、PathID 与原始字节指纹固定。部分当前 Bundle 与早期行动研究的字节不同，本批重新提取，不混用旧值。普通 CF-9 的引用另固定数据镜像修订；它证明关卡有该配置，不证明本机执行结果与镜像逐帧一致。没有执行游戏、Prefab 脚本或 XLua 热更新。

## 材料

| 子目录／文件 | 范围 |
| --- | --- |
| [gates](gates/README.md) | FaceTo 统一准入、异常枚举与虚 slot、FaceToTarget 距离、角色待机恢复及显式方向操作。 |
| [movement](movement/README.md) | 出生、移动方向与目标距离门控、近竖直修正、重新出现、Blink／Transport 与阻挡候选。 |
| [attack](attack/README.md) | 普通启动时点、改向模式、特殊覆盖与实际攻击／治疗配置；区分施法启动和后续 Tick／spell。 |
| [sign](sign/README.md) | 向量发布到有效左右符号的条件、Animator 差别及火龙部位机制的实际引用链。 |
| `sources.json` | PRTS 页面、检索结果、访问失败与社区材料的使用边界。 |
| `archive.json` | 输入、方法、原始片段与产物清单；由共享 archive.py 生成。 |

直接调用搜索只给出 E8／E9 候选，虚调按本客户端 metadata slot 配对。函数本体与调用入口已分别保存，不以方法名、零命中或 fullyDecoded 代替全运行时证明。阻挡发生时是否有独立的通用改向链、所有 Animator 的实际内容绑定，以及异常恢复后的补发政策，见案例的未闭合事项。

## 复查

各子目录说明保存提取参数；使用既有 native.py、assets.py 和前批 extract.py，专用枚举／常量／Prefab 解码器随本批保存。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  .agents/skills/arkbattle-native-research/scripts/archive.py \
  --batch docs/research/evidence/facing-conditions-20261114
```

可用共享 replay.py 对 archive.json 中的原生选择器重提；它会先核对源指纹，不负责还原专用 Prefab 解码、客户端执行或热更新。
