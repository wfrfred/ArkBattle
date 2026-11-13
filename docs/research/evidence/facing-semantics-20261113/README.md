# 左右面向的写入与玩法消费

查阅／提取日期：2026-11-13。范围仅为 Entity／Enemy 的面向写入、Unit 的读取覆盖，以及一个会按方向累计部位生命并触发 Buff 的消费者；不设计项目 Capability 或 API。

## 来源与文件

- Windows x64 本机提取；资源清单 `hot_update_list.json` 的 `versionId=26-10-20-11-10-38-04170990`，DLL／metadata 单独按 `provenance.json` 中 SHA-256 固定。资源清单编号不代表整个客户端或 DLL 版本，也不把 PRTS 的 2.7.91 声明当作本机版本。
- `search.json`：按 FaceTo／BodyDirection／faceSign 等名称的定位结果；搜索结果不是全部都参与结论。
- `core.json`：Entity 字段、FaceTo／BodyDirection、Enemy 初始化与方向政策、直接调用候选。
- `writers-consumers.json`、`semantic-consumers.json`：移动、攻击、受力写入，以及几个候选消费者；最终方向消费以 `part-application.json` 为准，不以名字或 HUD 显示推断。
- `face-publication.json`、`sign-storage.json`：Enemy → Unit → Animator 的通知，以及保存左右符号的写入。
- `part-application.json`：完整提取 `MhPartHpHudPluginTalent` 的直接 native 方法，包含接收伤害、部位数值变化和归零触发 Buff。
- `result.json`：本批结论、关键 VA 与限制。
- `extract.py`／`.lock`：限定方法选择的提取脚本。每份 JSON 保存本次实际选择及提取时的工具指纹；脚本后续增加了选择参数，早期提取指纹不因此改写。

## 已证实的最短链

1. `Enemy._MoveByCursor` 经 `_CalculateFaceDirection` 调用 `Entity.FaceTo`；攻击的 `AbstractAnimatedAbility.DealWithFaceDirection` 按自身配置选择是否朝向目标；`Enemy.KnockBack` 的 `changeFaceByDirection=true` 且非零方向分支会面向施力方向的反向。
2. `FaceTo` 将向量写入 `Entity.m_faceTo +0x8c`，随后执行虚拟 `OnFaceChanged`。`SetBodyDirection` 另写 `m_direction +0xec`，还产生自己的 Buff 方向变化通知。不能当成同一字段。
3. `Enemy.OnFaceChanged` 通知 Unit／Animator，并按 BodyDirectionPolicy 更新身体四向；`Unit.faceSign` 在 Animator 存在时读取其保存符号，没有 Animator 才回退到 `m_faceTo.x`。`FaceSwitcher.m_currentLOrR +0x24` 与 `UnitAnimator.m_faceSign +0x18` 都是保存状态，不是每次从当前速度求值。
4. `MhPartHpHudPluginTalent._OnApplyedModifier` 读取来源与宿主位置之差，调用宿主 `faceSign`，结合 `_facePosition` 决定是否更新 `m_partHp`；达到条件时触发已登记的 Buff。因此这个消费者不只是 HUD 表现。

`CheckDirection` 是一个容易误判的名字：本批提取显示其 Enemy 分支读取 `lastMoveDirection`，不能拿它代替左右面向证据。`CheckAxisRelativeDirection` 也主要比较位置符号，不是面向读取的直接证明。

## 摄像机与世界方向

`Enemy._CalculateFaceDirection` 存在明确分支：`_useMoveDirAsFaceDir=true` 直接返回；否则仅在近竖直且 `BattleController.isDeterministic=false` 时调用 `CameraController.WorldToViewportDirectionV2`。之后仍近竖直时可以读取 Cursor 的下一次转向。因此“全都按摄像机”与“永远按世界 X”都不能作为无条件原生规则。

同时，Entity 的目标向量、身体四向和 Animator 保存的左右符号是不同层次。PRTS《作战机制》和较新《特殊机制》的简述不能直接逐字互换。本批不决定 ArkBattle 的平面近似，也不要求模拟渲染器或摄像机。

## 内容绑定与限制

PRTS 的火龙断尾／甩尾和眩光手雷分别提供实际玩法需求；本批直接证明的是上述 generic native 消费者。**没有完成 `enemy_1537_mhrors` 的 Prefab → Talent 组件绑定，不将类名中的 `Mh` 当作火龙绑定证据。**

做过的最小资源定位：本地 EnemyDB 镜像已有 `enemy_1537_mhrors` 键；本机资源没有同名 Bundle，manifest 中资源位于聚合包，本批没有重建索引映射或扫描全部敌人包。内容绑定仍按此范围标为未核实。也未执行游戏、验证运行中的 XLua 替换、穷举所有 Animator 或所有攻击政策。

对当前项目的判断仅到：**会影响战斗的持久面向事实确实存在，位置、速度和部署四向不能总是还原它。** 单个内容的部位耐久可私有保存；共同面向事实由何领域维护仍待架构选择，不能为了消除缺口就宣称每个内容轮询速度已自然覆盖完整写入时序。

## 复查

每份提取 JSON 的 `result.selection` 保存完整参数；固定 DLL／metadata 后可据此复跑。例如：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  docs/research/evidence/facing-semantics-20261113/extract.py \
  --out .cache/native-research/facing-replay.json \
  --body-prefix Torappu.Battle.MhPartHpHudPluginTalent.
```

公共重提工具会先核对指纹：

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --locked --offline \
  .agents/skills/arkbattle-native-research/scripts/replay.py \
  docs/research/evidence/facing-semantics-20261113 \
  --out .cache/native-research/facing-replay
```

直接 xrefs 只覆盖 E8/E9 候选；虚调通过 metadata slot 与实际 Unit／Animator 覆盖分档核对。`fullyDecoded` 只描述所存区间，不声称热更新及全运行时路径已验证。
