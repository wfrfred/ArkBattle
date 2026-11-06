# advancedWaveTag 最小消费短查

2026-11-07；仅核对字段消费和直接输出，不扩展模式玩法实现。来源客户端指纹与 lifecycle/README 相同，全部为普通原生分支，XLua 另有入口且未核验实际绑定。

字段布局沿用 `../execution/supporting-types.json`：`Torappu.LevelData/WaveData.advancedWaveTag` 为 string，偏移 `+0x28`。配置取值见 `../execution/wave-tags.json`；配置与当前客户端不自动视为同一版本现场。

## 明确结果

1. **N：BossRush 直接解释 `bonuswave` / `bosswave`，标签不是只保存不消费的通用空字段。**
   - `BossRushGameMode.OnWaveWillStart(WaveData)` @ `0x180c6b3c0`：参数明确是 WaveData。`0x180c6b55e` 检查 `waveData+0x28` 非空，`0x180c6b572`/`0x180c6b576` 与字符串 `bonuswave` 比较；若不匹配，`0x180c6b7fd`/`0x180c6b801` 再与 `bosswave` 比较。前者分支最终在 `0x180c6b650` 写模式 `+0x84=false`，后者在 `0x180c6b80e`/`0x180c6b816` 清 `+0x85/+0x86` 并写 `+0x84=true`，后续可调用 BuffContainer.OnBossWaveWillStart。这里不扩写这些模式状态的全部玩法含义。
   - `BossRushGameMode.OnWaveWillFinish(WaveData)` @ `0x180c6b0c0`：`0x180c6b189`/`0x180c6b19d`/`0x180c6b1a1` 直接检查并比较当前 Wave 的 `bonuswave` 标签，走不同的模式完成处理。后继增加模式内部 Wave 索引及判断后继 Wave 的标签；不能把它当成通用 Scheduler 对任意 tag 的相同行为。
   - `BossRushGameMode.NextWaveIsBonusWave()` @ `0x180c6ad90`：取模式当前索引 `+0x50` 后加一；越界或下一 Wave 的 `+0x28` 为空则返回 false；非空时在 `0x180c6aeb7` 读取标签，`0x180c6aec0` 装入 `bonuswave`，`0x180c6aed4` 尾调用 String.Equals，比较结果即返回值。它是读取 tag 后输出 bool 的直接消费。
   - `BossrushGameModeWaveHandler.get_skipCurWave()` @ `0x180c6cb70`：本身不读 Wave tag；读取模式 `+0x84`/`+0x85` 状态输出 skip bool。与上面的写入存在字段依赖，但不能把 handler 写成再次解释原始 tag。
   - 本次 BossRushGameMode 元数据 50 项方法中没有自有 TryGetNextWaveIndexInGameMode。有限的方法表足以说明“本类型未声明该 override”，不宣称继承/XLua 全局没有替换。

2. **N：CooperateGameMode.TryGetNextWaveIndexInGameMode 本体不直接读 tag；它委派给子模式。**
   - `CooperateGameMode.TryGetNextWaveIndexInGameMode(int& index)` @ `0x180c74ec0` 读取 `this+0x38` 的子模式，在 `0x180c74f40`—`0x180c74f58` 虚调用其对应方法，传递输出引用；没有访问 WaveData。
   - `CooperateSubMode.TryGetNextWaveIndexInGameMode` @ `0x180c8c890` 与 `CooperateSailBoatModeManager.TryGetNextWaveIndexInGameMode` @ `0x180c91880` 的普通分支写 index=0、返回 false，无标签读取。
   - `CooperateFootballModeManager.TryGetNextWaveIndexInGameMode` @ `0x180c8c560` 用模式参数、DB 和随机选择取得一个键，再调用 `CooperatePreProcessor.get_Item`（`0x180c8c80b`）；`0x180c8c838` 将结果写到 index 引用并返回 true。本方法没有直接读 tag，输出由已准备的索引表提供。

3. **N：已归档的 CooperatePreProcessor 确有 tag 消费；`stage` 及可解析数字在不同分支解释。**
   - 沿前述 `get_Item` 关联，仅复用原有 `CooperatePreProcessor.DoPreprocess` @ `0x18099c840`，没有继续追模式业务。
   - `IsFootballMode=true` 分支：遍历 levelData.waves，`0x18099d6a6` 直接取 Wave+0x28；非空后在 `0x18099d6c7` TryParse、`0x18099d6d9` Parse 为 int，该数作为后继容器查找/写入参数；空或不可解析走 key=0 分支；`0x18099d804`/`0x18099d809` 将当前 wave index 加入所选集合。本批不将数字标签的全部内容政策移入 Core。
   - `IsNormalMode=true` 分支：`0x18099d8d9` 检查当前 Wave+0x28 非空，`0x18099d8ea`/`0x18099d8ee` 与字符串 **`stage`** 比较；命中后重置局部段累计量并在模式容器保存当前 Wave 索引（`0x18099d8f7`—`0x18099d955`）。因此 `stage` 已有普通原生直接消费，不能写成仅有配置见证。

4. **U：`boss_wave` 的具体消费尚未由本次最小选择闭合。** 不能因为已证实 BossRush 的 `bosswave` 就把下划线不同的 `boss_wave` 视为同一关键字，也不能由 Cooperate 的 `stage` 消费推定其所有 tag 都具有同一规则。本次停止于这条明确边界。

## 原件与字面量

- `tag-next-wave-methods.json`：完整名称搜索 TryGetNextWaveIndexInGameMode 的结果。
- `tag-bossrush-methods.json`：BossRushGameMode 的 50 项元数据方法。
- `tag-consumer-bodies.json`：BossRush Init/OnWaveWillStart/OnWaveWillFinish/NextWaveIsBonusWave/CreateWaveHandler、Cooperate 主委派方法完整 `.pdata` 连续片段。
- `tag-forwarded-bodies.json`：Cooperate 三种子实现及 BossRush handler。
- `tag-cooperate-preprocessor.json`：从根批次 native-paths.json 复用的 CooperatePreProcessor.DoPreprocess 独立摘录，保留相同 provenance 和方法选择器；无重新运行或修改方法。
- `tag-literals.json`：引用到的 IL2CPP 字符串字面量槽、编码值、metadata 索引、字面量长度及文本。`0x188be2468`=`bonuswave`；`0x188beb2d0`=`bosswave`；`0x188c21fd8`=`stage`。
- `decode_tag_literals.py`：专用解码器。v29 metadata table0/1 提供 literal records/data；仅识别 kind=5 的奇数编码使用项，index=`(encoded & 0x1ffffffe)>>1`，检查索引与长度边界后读取 UTF-8。实际指令引用 VA 与字面量原始位置均保留，避免仅凭方法名字猜字串。

复跑字面量：`python docs/research/evidence/scheduler-general-20261107/lifecycle/decode_tag_literals.py`。方法重新提取可用原件 selector 配合 `extract_schedule.py` 或标准 replay；此处没有运行游戏，也没有查询远端配置。
