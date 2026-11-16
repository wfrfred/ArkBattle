# 狂躁的能力排除边界

当前结论集中在 [Case25 §11](../../cases/25-elemental-burst-recovery-timing.md#11-狂躁计数的原生排除范围)。不改产品代码或确定新的资格接口。

## 来源与范围

- Windows 客户端 DLL `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，v29。普通 native 静态分支，没有实机或活跃 XLua 验证。
- `inventory.json` 解码 FamilyGroup／FamilyGroupMask 原始枚举编码，定位全部同名 family／ignorePalsy getter；`policy-native.json` 保存8个完整方法，含32／64位mask位测试、基类family与两个固定true派生getter。原始 FilterAbilityFamily／FilterByAbilityIgnorePalsyInterrupt 及事件16／18链复用[前批](../anger-20261116/native.json)。
- `field-scan.json` 按明确列出的1180个本机资源包扫描全部匹配MonoBehaviour类型树及内联JSON：解码10253个候选组件，7970个false／55个true、0失败。55个true全部位于Enemy Prefab；每项保留完整组件、资源／对象身份及哈希。这个统计没有覆盖运行时字段写入或固定返回值的getter，不能用它否定派生例外。
- `content.json` 重新提取靳天师根／模式／Attack配对，以及郁金香S1根／两个子能力的真实组件。固定表来自 `Kengxxiao/ArknightsGameData@63c7cec73c3858d0ae913f85cc89af3cef4d744f`，具体原文件指纹与Pointer随输出记录。资源绑定、静态可执行路径与实机观察分别判断。
- 郁金香为集成战略支援干员，不因其来源而归入已排除的生息演算／保全派驻。原有角色／技能绑定及组合选择普通分支见[Case09](../../cases/09-skill-mechanisms-and-requirements.md#33-启动结果与失败后继实际需求核对)。

## 已证与未证

`ATTACK_OR_SKILL=7`实际接受ATTACK、COMBAT、SKILL，排除TALENT、GENERAL；位测试消费者已核。`EmptyAbility`／`EmptyAnimatedAbility`的普通getter固定true，不能只读取其继承序列化字段判断资格。

本批仅定位郁金香的 EmptyAnimatedAbility 子项，完整父子通知、普通发动入口与成功扣费路径见[调用链补核](../anger-family-20261117/empty/README.md)。55个字段正例也不是55个已观测的狂躁排除案例：这些Enemy通常使用另一套按时间增长的爆发程序。具体分类程序与项目支持边界统一见 [Case25 §11](../../cases/25-elemental-burst-recovery-timing.md#11-狂躁计数的原生排除范围)。

## 复跑与验证

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
batch=docs/research/evidence/anger-exclusions-20261117
work=.cache/native-research/anger-exclusions-20261117/replay

python3 "$batch/scan_fields.py" --out "$work/field-scan.json"
uv run --offline "$batch/inventory.py" --out "$work/inventory.json"
python3 "$batch/group_inventory.py" --out "$work/group-inventory.json"
python3 "$batch/extract_content.py" --out "$work/content.json" --raw-out "$work/raw"
python3 "$batch/verify.py" --out "$work/verification.json"
python3 .agents/skills/arkbattle-native-research/scripts/archive.py --batch "$batch"
```

`policy-native.json.result.selection`记录共享提取器的确切方法／owner selectors。`verification.json`独立核对全部所选原生指令、方法身份、枚举原始编码及55个正例对象；不冒充再次完整负搜索或游戏运行。
