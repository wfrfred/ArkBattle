# 耀骑士临光的接力部署判定

2026-11-22 核对现行 Windows 客户端的角色、技能、模组、召唤物与 Buff 配置，以及 Deck 的原生调用。技能、模组和 Holder 在本机的缓存包中有副本，所选组件和模板与基础包一致，角色和召唤物使用基础包。[result.json](result.json) 保存资源路径和组件 Path ID、相关 Buff 程序、带地址和字节的原生指令、客户端和资源 SHA-256。本次采用静态客户端取证，未执行 XLua 热更新或实战回放。相关玩法见 [Case 24](../../cases/24-deployment-cost-and-supply.md) 和 [PRTS 耀骑士临光](https://prts.wiki/w/耀骑士临光)。

## Card 上的状态如何维护

| 阶段 | 原生行为与位置 |
| --- | --- |
| 注册 | `charpack/char_1014_nearl2.ab` 的 `DeckManagedCardBuffTalent` `-5770778439147031165` 配置 `nearl2_t_1`、`_manageType=1`、`_excludeTokenAndTrap=true` 和 `kazimierz`。`Card.DealDummyTalent#66911` 在 `0x1806eb91a` 调用 `RegisterDeckManagedCardBuff#74635`，后者走 `0x1809c3aa7` 的 `RegisterComboDrawCardBuff#67123`。 |
| 初始状态 | Deck 在 `+0xc0` 持有 `DeckManagedCardBuffController`，见 `get_managedCardBuffController#66792`。控制器在 `+0x18` 保存规则实例列表。每条规则持有所属 Card、可复用 CardBuff、选择器、排除召唤物及装置的标记和 `m_isActive` 布尔。规则注册 `0x18070cc13` 创建默认实例，`0x18070ccaa–0x18070ccf4` 写入配置，未设置 `m_isActive`。`Init#67125` 只处理 `+0x10` 的常驻 CardBuff 列表。普通初始化时规则为 false，所属 Card 上没有该接力 Buff。 |
| 写入 | `Deck.SpawnCharacterOrToken#66755` 在 `0x1806fd35f` 从 Card 创建角色，后在 `0x1806fd60d` 调用 `Card.Draw#66861`。`Draw` 在 `0x1806ebb0f` 调用控制器的 `OnCardDrawn#67124`，控制器在 `0x18070c9d5` 让注册的每条规则处理此次 Draw。`Draw` 路径允许不减少库存。具体是否刷新接力取决于是否真正进入这条通知链。 |
| 过滤 | `ManagedComboDrawCardBuff.OnCardDrawn#67130` 在 `0x180711530–0x180711566` 按规则预先跳过 Token、Trap。这些 Draw 保留当前布尔。其他 Draw 在 `0x18071157a` 调用 `DeckSelector.Verify#67162`，以实际选择器匹配职业类别与 `kazimierz`；`CheckGroupTag#79465` 的调用在 `0x18070d901`。`excludeMe=false`，因此所属 Card 本身也按同样规则处理。 |
| 结果 | 匹配结果改变时在 `0x1807115a3` 写 `m_isActive`，在 `0x1807115f6` 更新 Card 的 `comboState`，并在 `0x180711644` 移除或 `0x18071165d` 添加所属 Card 的 `nearl2_t_1`。本链只保存匹配结果，无前序 Unit Ref、前序 Card Ref 或部署列表。`UICard._UpdateComboState#104760` 在 `0x1812c90d2` 读取同一个 Card 的显示状态。 |

例如，先部署砾，再经普通 Draw 部署非卡西米尔干员，接力就会清除。若中间只有被跳过的召唤物 Draw，接力保留。砾是否仍在场不参与判定。耀骑士临光自己的 Draw 也可能为后续实例设立接力。

## 谁读取这项状态

| 消费者 | 读取时点和证据 |
| --- | --- |
| 耀骑士临光第一天赋 | 同一角色组件 `PassiveBuffAbility -8334569484248517245` 安装 `nearl2_t_1[mark]`。Holder 的 `ON_OWNER_BORN` 检查本次实例所属的 Card 是否含有 `nearl2_t_1`，缺失时结束这份出生标记。`CheckContainsCardBuff.Execute#98730` 在 `0x1810c676a` 查 Card，在 `0x1810c6836` 查 CardBuff。普通 `MeleeAttack -4516670402379287165` 与 Y 模组阶段 `nearl2_equip_2_2_p3` 的 `MeleeAttack 5615665115770057395` 均通过 `nearl2_t_1[combo]` 消费出生标记。 |
| S2 结束时的再部署时间 | `PassiveBuffAbility -4621350421976157959` 的 `nearl2_s_2[end]` 根据本实例既有的 `nearl2_t_1[mark]` 决定是否走附带再部署惩罚的分支。`nearl2_s_2[withdraw]` 的 `ON_BUFF_FINISH` 分支只在应惩罚时添加 Card 调整，再触发撤退。部署后发生的其他 Draw 不改变本实例已经读取的接力。 |
| S3 召唤的“耀阳” | `pkgrps/btl_pfb_tokens_0.ab` 中的 `token_10019_nearl2_sword` 自带相同规则（`DeckManagedCardBuffTalent -8241836201348457715`）和出生标记程序（`PassiveBuffAbility 3472860911299042061`）。它从自己的 Card 读取出生标记，`sktok_nearl2_3` 的 `MeleeAttack 1149999816210528705` 读这份标记，耀骑士临光的 Draw 本身可使其满足条件。耀骑士临光 S3 的 `nearl2_s_3[effect]` 另读取自身 Card，切换 `nearl2_buff_01_start` 的视觉 Buff。 |

成功的普通生成路径经 `Card.SpawnPrefab#66857` 同步执行出生程序，再到上述 `Card.Draw`。因此本次出生读取先前结果，此次 Draw 再更新后续出生看到的规则状态。[出生与 Draw 的原生调用链](../special-redeploy-failure-20261122/README.md#特殊入场的实际观察者)

从仓库根目录复跑。可用 `--game` 指定相同版本的客户端安装。

```sh
UV_CACHE_DIR="$PWD/.cache/uv" uv run --offline \
  docs/research/evidence/nearl-deployment-combo-20261122/extract.py \
  --out /tmp/arkbattle-nearl-deployment-combo.json
```
