# 主线关卡的预放置干员配置

核查日期：2026-11-12。从既有本地镜像读取固定版本的一个关卡，只保留预置干员和两项独立手卡配置。

- 仓库：Kengxxiao/ArknightsGameData。
- Revision：`bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d`。
- [原始镜像文件](https://github.com/Kengxxiao/ArknightsGameData/blob/bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d/zh_CN/gamedata/levels/obt/main/level_main_08-09.json)。
- 本次来源：`.cache/native-research/checkpoint-nondefault-20261107/mirror/zh_CN/gamedata/levels/obt/main/level_main_08-09.json`；绝对路径及字节数记录在 JSON provenance.source。
- 原始字节 SHA-256：`1321e847d9d2c4c873c72d0c108fe424fbcd38cc205583feb30f1b0b09adf9b3`。

`level_main_08-09.json` 记录三个 JSON Pointer：

| Pointer | 配置事实 |
| --- | --- |
| `/predefines/characterInsts/0` | char_391_rosmon，hidden=false，PHASE_2、Lv20，位置 row=4、col=1，direction=RIGHT。 |
| `/predefines/characterCards` | 空数组。 |
| `/hardPredefines/characterCards` | 空数组。 |

这是普通干员的预置实例正例。**配置本身不能证明客户端不会为该实例另建隐藏 Deck Card**，也不证明 cardUid 的赋值；这些问题须沿实际消费者调用链核实。此处没有运行游戏，不将配置存在写成运行现场观测。

从仓库根目录复跑到独立目录：

```sh
python3 docs/research/evidence/predefined-source-20261112/content/extract.py \
  --repo .cache/native-research/checkpoint-nondefault-20261107/mirror \
  --out .cache/native-research/predefined-source-20261112/content/replay
```

脚本先逐字节比较工作树文件和指定 revision 的 Git blob，再核对原始 SHA-256，之后才输出摘录。不请求网络，不修改镜像。输入对应版本的本地 checkout 后，比较输出的 result、来源指纹与脚本指纹即可复查。
