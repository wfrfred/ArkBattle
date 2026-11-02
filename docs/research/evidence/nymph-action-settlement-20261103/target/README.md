# 妮芙 S1：目标取得到弹道创建

日期：2026-11-03。只核对 S1 的普通目标／释放分支，不穷尽所有 Selector、动画状态或特殊攻击。未运行完整客户端，未验证运行时 XLua。

## 复用与输出

当前 DLL SHA-256 为 `cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff`，metadata 为 `e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5`，与案例 27 一致。脚本自行检查两者，并复查原批次四个资源包的当前哈希，避免只核对 DLL。

S1 静态配置复用 `docs/research/evidence/attack-addon-order-20261102/content/decoded-content.json`，不复制旧配置。其引用及本轮实际资源指纹保存在新输出的 `provenance.reusedContent`。

- `extract_target.py`、`.lock`：通过当前完整方法名定位，默认只提取这条上游链的 7 个方法。
- `selected-native.json`：7 个方法至下一已知方法的完整连续 `.pdata` 分段，均保留字节、原地址和解码边界；本次全部分段 `fullyDecoded=true`。
- `selector-enums.json`：本次 metadata 的 source／timing 字面常量、字段索引和常量数据位置。
- `fields.json`：所需运行字段及相关虚 slot 的 metadata 绑定。

从仓库根目录、对空输出目录重跑：

```sh
export UV_CACHE_DIR="$PWD/.cache/uv"
uv run --locked --offline docs/research/evidence/nymph-action-settlement-20261103/target/extract_target.py \
    --game '/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game' \
    --out .cache/native-research/nymph-action-settlement-replay/target
```

脚本只导入 skill 的 `native.py`，不读取本轮 scout／flow 等探索缓存，也不使用历史方法索引。

## 已闭合的短链

S1 为 `selectTargetSource=1/FROM_OWNER`、`selectTargetTiming=0/AT_BEGINING`、`waitForAttackEvent=true`；没有选择 BEFORE_SPELL_START、RESELECT_IF_TARGET_DEAD 或 BEFORE_FIRST_SPELL_START。

1. `AbilityStandard.CastToTarget` 64098（`0x1805fbe40`）保存输入目标（`0x1805fc0b1` 写 `m_inputTarget`），然后检查 timing。0／2 分支在 `0x1805fc0f8` 经 slot 92 调用 `UpdateTargets(false)`。成功后才 `StartCastingInternal`（`0x1805fc12b`）并启动 `_DoCast`。
2. `AbilityStandard.UpdateTargets` 64134（`0x180600720`）按 source 选取。FROM_OWNER 分支位于 `0x180600cae`，在 `0x180600d32` 调用实际 Selector 的 `FindTargets_DISPOSE`，形成 `m_castTargets`。这里只记录调用时机，不将所有 Selector 资格或排序推广为统一规则。
3. `_DoCast.MoveNext` 64190（`0x1806113b0`）在释放前检查 timing：`0x180611583` 比较 1，`0x1806115e0` 比较 3，`0x180611632` 比较 2。只有这些分支会再请求 UpdateTargets；S1 的 0 不进入它们。
4. 本轮已取目标经 `ExecuteSpell → DoCastOnTargets → RangedAttack.OnCastOnTarget` 进入发射。普通 `_projectileDestination=0` 分支在 `0x180f6aab4` 取该目标的 `hitMountPoint`，再在 `0x180f6aae8` 经 slot 120 调用 CreateProjectile。
5. `RangedAttack.CreateProjectile` 92841（`0x180f699c0`）在当前调用读取 owner、ProjectileKey 和发射挂点；`0x180f69bcf` 调用 BattleController.CreateProjectile，交入 owner、已有目标的 locatable、Ability 与创建参数。

因此，S1 不是前摇后重新普通索敌。目标身份固定与“无条件成功发射／命中”不同：目标死亡或其他资格变化仍可能影响后续尝试；本批不把所有失效分支展开。

## 采样边界

- 来源与目标以对象／locatable 传给创建入口，不在这里重新索敌或把目标换成某个新候选。
- `CreateProjectile` 此处并不直接传入“一组已冻结的完整攻击结果”；初始化仍通过 Ability 取得程序与配置，见原批次的 ActionController.Init 证据。
- 本层没有据此证明 ATK、防御／法抗或所有附加程序在锁目标时采样。攻击力备用样本与命中实时来源选择由下游 Projectile／Damage 链说明，不能由 `_useCachedAtkOnly=false` 或“有缓存”这两个配置字样单独推断。
- 静态 `_preDelay=0` 不等于无动画前摇，S1 仍设置 `waitForAttackEvent=true`；本批没有追通用动画事件状态机。

虚方法名称由当前 metadata 的 slot 绑定，地址仅用于本次指纹；没有依据旧案例 02 的 index 或凭位移命名。
