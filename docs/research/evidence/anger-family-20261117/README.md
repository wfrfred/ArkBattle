# 狂躁排除程序的实际来源

机制结论集中在 [Case25 §11](../../cases/25-elemental-burst-recovery-timing.md#11-狂躁计数的原生排除范围)。本批只调查实际分类、施放入口与空技能分支，不修改模拟接口。

## 输入与选择

- Windows 客户端：GameAssembly SHA256 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`；metadata SHA256 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29。静态普通分支，不包含活跃 XLua 或实机观测。
- [配置原件](content/README.md)：重新提取玫兰莎、浊心斯卡蒂和刺玫的根对象及相关组件；保存数组 PPtr、同对象组件表、脚本身份、参数与资源哈希。角色候选来自单独固定的镜像版本，不冒充与安装客户端同一发布。
- [分类与挂载](native/README.md)：追踪 BasicTalent、Unit／UnitMode 写入 TALENT／GENERAL，Ability 保存和读取 Options，以及被动挂载和登场主动施放。
- [郁金香空分支](empty/README.md)：追踪 FirstSucceedGroup 的选项、成功返回、父子开始／施放／结束通知，以及成功后扣除 SP；子能力的 true getter 复用[前批证据](../anger-exclusions-20261117/README.md)。

## 复跑

各子目录说明保存具体选择与提取命令。共享原生重提入口：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
batch=docs/research/evidence/anger-family-20261117
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
uv run --offline .agents/skills/arkbattle-native-research/scripts/replay.py "$batch" --out .cache/native-research/anger-family-20261117/replay
```

重提核对客户端指纹、方法身份与记录的原生选择器；配置按子目录提取器读取实际 Bundle，不从结论反推。完整指令和配置绑定可追溯，不等同于现场运行结果。
