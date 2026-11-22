# SPFA、路径平滑与移动消费：客户端原生核对

研究日期：2026-10-18。本轮重新读取当前安装的 DLL 与 metadata，不沿用旧报告的函数地址。不修改 Stronghold 源码或测试。

## 1. 结论与证据范围

**最终 NavigationField 不需要同时保存 rawNext 与 next。** 常规客户端在同一个 Node 数组上先生成原始 next，再原地平滑覆盖 next；正常移动消费平滑后的唯一 next。nextTurn 是方向向量，不是原始后继。

Stronghold 当前的 rawNext 确实有消费者，但它服务于项目自己的「平滑目标 → 原始相邻格 → 当前格中心」连续线段检查与回退政策。客户端常规移动链没有这套三候选回退；它通过转向、局部避障与不可通目的格的位移修正处理实际运动。因此不能仅删字段而保留现有 query 算法不动。

本文使用三种标记：

- **N：客户端直接证实。** 当前 metadata 字段、原生主分支指令或直接调用支持。
- **I：调用链推断。** 由已核实的方法组合推导，写明限定范围。
- **U：尚未确认。** 没有核实运行时 Lua／热更替换、实战完整轨迹或所有特化分支。

隔离射线验证执行了原始 x64 指令，使用少量数组／Node／初始化依赖替身；它验证射线控制流，不等同于启动客户端或验证游戏现场。合成反例也不冒充真实关卡配置。

### 输入与复查入口

| 输入 | SHA-256 |
| --- | --- |
| GameAssembly.dll，218523112 bytes | `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5` |
| global-metadata.dat，45805368 bytes，IL2CPP v29 | `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f` |

原文件路径、方法 token／参数、字段布局和反汇编校验值见 [manifest](../evidence/navigation-native-20261018/manifest.json)。地址均为 VA，image base 为 `0x180000000`。IL2CPP 值类型字段偏移表含 boxed header；下文 Node 偏移已减去 `0x10`，对应数组元素的实际数据。

本轮使用 Capstone 与 Unicorn 的临时隔离环境，没有修改项目依赖或系统安装。已保存的输入、指令及仿真结果与当前复查范围见[批次说明](../evidence/navigation-native-20261018/README.md)；当时的共享解析器和隔离仿真脚本未随批次归档，现有工具重提 native 方法不等于重建原仿真环境。

## 2. 实际执行顺序

```text
Route 请求目标格、运动方式、allowDiagonalMove
    ↓
SPFA.GenerateNextMap
    ├─ cache hit：复制已平滑节点，清理调用方工作值
    └─ cache miss：
         重置同一个 Node[,] 数组
         → 四方向 SPFA，写唯一 next 和 distance
         → 行优先原地平滑，覆盖同一个 next
    ↓
Route 计算后续转向／到终点距离等派生信息
    ↓
DirectionCursor：当前 locator → 当前格 → 平滑后的 next
    ├─ 显式中心访问政策
    ├─ 当前 Checkpoint 的偏移目标
    └─ 越界时返回地图内的修正方向
    ↓
Enemy._MoveByCursor
    ├─ 本次距离足够：PredictReached 后直接到目标
    └─ 否则：方向 → MoveController 转向／局部避障 → 位移
                  → 检查跨入不可通目的格并修正位移
    ↓
提交实际位置；后续 Route 判断到达／推进
```

**N：** 正常 `GenerateNextMap`（70331，`0x1808a4ec0`）在 miss 时对同一输出数组依次调用 `_GenerateNextMapImpl`（`0x1808a4ffa`）和 `_PostprocessAndMakeNextMapSmoothly`（`0x1808a5015`）。中间没有复制原始数组。cache hit 复制的是正常已平滑的节点内容。[生成入口](../evidence/navigation-native-20261018/70331-call-chain.asm)

另有 **raw-only API** `GenerateNextMapWithoutCaching`（70332，`0x1808a4e00`）：其主分支只调用原始生成，不调用平滑。它说明客户端可以单独请求原始场，不说明最终正常场同时保存两份后继。[raw-only 入口](../evidence/navigation-native-20261018/70332-call-chain.asm)

## 3. SPFA 原始路径生成

**N：** `_GenerateNextMapImpl`，method 70333，`0x1808a5860`。[完整相关主体](../evidence/navigation-native-20261018/70333-SPFA-GenerateRaw.asm)

```typescript
resetEveryNode();
queue.clear();

if (targetTile.isPassable(mode)) {
    nodes[target].distance = 0;
    nodes[target].isInOpenList = true;
    enqueue(target);
}

while (!queue.empty()) {
    const current = dequeue();
    nodes[current].isInOpenList = false;

    for (const direction of [UP, RIGHT, DOWN, LEFT]) {
        const neighbor = current + direction;
        if (!insideMap(neighbor)) continue;
        if (!tile(neighbor).isPassableGoTo(mode, opposite(direction))) continue;

        const cost = mode === FLY ? 1 : tile(neighbor).moveCost;
        const candidate = nodes[current].distance + cost;

        if (nodes[neighbor].isValid && candidate >= nodes[neighbor].distance) continue;

        nodes[neighbor].next = current;
        nodes[neighbor].hasNext = true;
        nodes[neighbor].distance = candidate;
        if (!nodes[neighbor].isInOpenList) {
            nodes[neighbor].isInOpenList = true;
            enqueue(neighbor);
        }
    }
}
```

关键事实：

| 项目 | 直接证据与含义 |
| --- | --- |
| 四邻居 | `GridPosition..cctor`，28063，`0x182103c00`，按 UP `(row+1,col)`、RIGHT、DOWN、LEFT 填充 `GRID_FOUR_WAYS`；没有对角搜索边。 |
| 方向 | 原始生成 `0x1808a5c7a..5cdf` 读取反方向数组再检查邻格的出口，即检查正向运动的 `neighbor → current`。`SharedConsts.REVERSE_FOUR_WAYS` 原始四项为 `[2,3,0,1]`。 |
| 队列 | `0x1808a5b23..5b68` 对 FIFO 出队；每个 Node 的 `isInOpenList` 避免重复入队。不是优先队列。 |
| 成本 | `0x1808a5cea..5d2e`：FLY 为 1；其余通过邻格 Tile 虚方法取得成本。因为是逆向扩展，正向 `A → B → C` 收取 `cost(A)+cost(B)`，不含目标 C。 |
| 平距 | `0x1808a5d49..5d60` 为 `candidate >= old` 就跳过；距离相同保留首先成功写入的后继。固定 FIFO 和邻居顺序因此影响平局路线。 |
| 目标资格 | 目标必须可通行才置 distance=0 并入队；不可通目标不会被无条件当作有效种子。 |
| 数值 | `distance` 是 int32，普通 `add`，未见安全整数或 checked 溢出保护。Stronghold 的安全整数上限是工程差异，无须复刻 int32 溢出。 |

关键写入：

```asm
; 0x1808a5d49..5d78，简化摘录
add  ecx, r14d
cmp  ecx, [neighbor + 24h]
jge  skip
mov  [neighbor + 18h], currentPosition
mov  [neighbor + 24h], candidate
mov  byte ptr [neighbor + 20h], 1
```

### Node 数据与生命周期

**N：** `Torappu.Battle.Route.Node` 为大小 `0x30` 的值类型，二维数组元素只有下面八个字段：

| 未装箱偏移 | 字段 | 类型／用途 |
| --- | --- | --- |
| `+00h` | pos | 当前格的 GridPosition |
| `+08h` | tile | Tile 引用 |
| `+10h` | nextTurn | Vector2，后续转向信息 |
| `+18h` | next | 唯一的后继 GridPosition |
| `+20h` | hasNext | 是否存在后继 |
| `+24h` | distance | 原始 SPFA 距离，int |
| `+28h` | distToFinal | 后续距离工作值，int |
| `+2ch` | isInOpenList | 生成时的队列标记 |

`Node.Reset`（70388，`0x1808a0d60`）将 next 置为自身、hasNext=false、distance/distToFinal=-1、isInOpenList=false。[Reset](../evidence/navigation-native-20261018/70388-Node-Reset.asm)

生成期间原始路径就在 next 中；平滑覆盖后不再保留原始后继。`Node.GetSafeNextGrid`（70390，`0x1808a0aa0`）只读取该 next；无有效后继时返回 pos。[安全后继读取](../evidence/navigation-native-20261018/70390-Node-SafeNextGrid.asm)

nextTurn 不能解释成 rawNext：metadata 类型是 Vector2；`Route._GetNextTurn`（70384，`0x1808a3ee0`）沿已经生成的 next 递归求后续转向，并将方向缓存到 nextTurn。[转向计算](../evidence/navigation-native-20261018/70384-call-chain.asm)

## 4. 平滑：原地更新、读取当前后继

**N：** `_PostprocessAndMakeNextMapSmoothly`，70341，`0x1808a5fe0`。[反汇编](../evidence/navigation-native-20261018/70341-SPFA-Smooth.asm)

```typescript
for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
        const node = nodes[row, col];
        node.distToFinal = node.distance;
        if (!node.isValid || !node.hasNext) continue;

        let next = node.next;
        while (nodes[next].hasNext) {
            const candidate = nodes[next].next;
            const allowed = request.allowDiagonalMove
                ? raycastBresenham(node.pos, candidate, mode, nodes)
                : sameRowOrColumn(node.pos, candidate);
            if (!allowed) break;
            next = nodes[next].next;
        }
        node.next = next;
    }
}
```

这里的 `nodes[next].next` 来自当前数组，不是平滑前的副本。已经处理过的下游节点会提供已经平滑的 next；尚未处理的节点仍提供原始 next。因此节点遍历顺序和原地写回可以影响最终跳点。

```asm
; 候选：从当前 nextMap 中读取下游 next
0x1808a61d9: mov r8, [rax + 18h]
0x1808a61dd: call SPFA._RaycastBresenhamLine
...
0x1808a61f4: mov rdi, [rax + 18h]
...
; 覆盖当前节点唯一的 next
0x1808a61ff: mov [r14 + 18h], rdi
```

**N：没有累计距离／线段代价预算。** 成功条件由对应射线方法决定；平滑不会计算 Stronghold 当前的 `node.distance - destination.distance + endpointCorrection`，也不会重新累计捷径的加权线段成本。distance 在这里没有随着 next 的拉直重新计算。

### allowDiagonalMove=false

**N：** `_RaycastSegmentLine`，70343，`0x1808a68f0`，原生主分支就是：

```typescript
return a.row === b.row || a.col === b.col;
```

它没有读取 Node 数组、成本或方向掩码。这一方法在既有后继链上承担同轴合并，不是一个可以任意起终点调用的通用安全线段检查。[轴向分支](../evidence/navigation-native-20261018/70343-SPFA-Axis.asm)

所以此前把 false 分支描述成「只检查同行／同列的完整通行射线」不够准确。原生代码甚至可以把同一轴线上、代价 1000 的中间节点直接合并。

### allowDiagonalMove=true：Bresenham 的具体约束

**N：** `_RaycastBresenhamLine`，70342，`0x1808a6290`。[反汇编](../evidence/navigation-native-20261018/70342-SPFA-Bresenham.asm)

它不是 Stronghold 当前的真实线段穿格算法，过程为：

1. 比较行／列位移，必要时交换主轴；归一化为主轴递增扫描。
2. 若次轴绝对位移不超过 1，先检查**原始两个端点的整个包围矩形**。矩形内每个 Node 都须有效且不是该运动方式下的障碍类节点；随后仍继续 Bresenham。
3. 用整数误差量推进栅格：初值 `error = -majorDelta`，每步加 `2*minorDelta`，`error >= 0` 时推进次轴，再减 `2*majorDelta`。
4. 每个扫描格检查 Node 有效性、障碍类以及主轴正方向出口。
5. 同时推进两轴时，还检查两个正交侧格，以及组成该角点方格的额外三条方向边。加上当前格已经检查的主轴边，共四条边。
6. 包含终点；终点仍检查主轴正方向出口。这个出口未必是实际线段还要跨越的边。

将主轴转成 x、次轴转成 y 后，核心可简化为：

```typescript
if (abs(dy) <= 1 && !allNodesClear(originalEndpointRectangle)) return false;

let error = -dx;
let y = y0;
for (let x = x0; x <= x1; x++) {
    if (!clear(x, y) || !allowsMajorPositive(x, y)) return false;
    error += 2 * abs(dy);

    if (x < x1 && error >= 0) {
        if (!clear(x, y + sy) || !clear(x + 1, y)) return false;
        if (!allowsMinor(x, y, sy)) return false;
        if (!allowsMinor(x + 1, y, sy)) return false;
        if (!allowsMajorPositive(x, y + sy)) return false;
        y += sy;
        error -= 2 * dx;
    }
}
return true;
```

`clear` 使用 `Node.CheckObstacleLikeOrInvalid`（70394，`0x1808a08a0`）：distance<0／Tile 无效则拒绝；WALK 再检查 Tile.isObstacleLike，非 WALK 不加这个成本障碍限制。[Node 检查](../evidence/navigation-native-20261018/70394-Node-Obstacle.asm)

`Tile.get_isObstacleLike`（70679，`0x1808adbb0`）的基础实现虚调当前 moveCost 并比较 `>=1000`。HoleTile 成本为 1,000,000 且直接为障碍类。因而本轮普通 WALK 证据可以用 cost 门槛解释，不需要为了客户端类名再引入独立的障碍类别字段。[Tile 门槛](../evidence/navigation-native-20261018/70679-Tile-IsObstacleLike.asm)

边界需要区分：Bresenham 以有效的场内格坐标直接索引 Node 数组，不负责将任意图外 WorldPosition 夹回地图。实际单位越界由 Cursor／Map 的独立回归分支处理。误差等于零时走次轴分支，角点不能只检查对角目标格。

## 5. 实际移动如何消费

### 当前追踪节点与偏移

**N：** `DirectionCursor.GetLocatorPosition`（70291，`0x180894ed0`）使用 `locator = object.mapPosition + cursor.offset`。

`DirectionCursor.GetNextDirection`（70277，`0x180894f60`）把实际 locator 转当前格，随后读取活动 Checkpoint 或终点 Field 的 Node。普通分支直接向该 Node 的安全 next 中心求方向，不要求单位先回到格中心。[Cursor](../evidence/navigation-native-20261018/70277-call-chain.asm)

`MoveCheckpoint.GetNextDirection`（70190，`0x1808a0200`）大致为：

```typescript
const grid = gridOf(locator);
const node = checkpoint.nextMap[grid];
if (!node.isValid) return zero;

let target = node.getSafeNextPosition();
if (node.getSafeNextGrid() === checkpoint.targetGrid) {
    target += checkpoint.sampledOffset;
}
return normalize(target - locator);
```

偏移作用在跟随到目标格的末段；它不是运行时从 rawNext 恢复目标。[Checkpoint](../evidence/navigation-native-20261018/70190-call-chain.asm)

**N：显式中心访问确实存在。** visitEveryTileCenter、visitEveryNodeCenter 分支使用约 0.05 容差；visitEveryNodeStably 使用 0.25。它们可要求先到当前格／被追踪节点中心，但这是访问政策，不是平滑目标遭射线阻挡后的 fallback。

### 连续运动与避障

**N：** `Enemy._MoveByRoute`（76487，`0x180a796f0`）调用 `_MoveByCursor`（76491，`0x180a78fc0`）。后者包含：

```typescript
if (cursor.predictReached(moveSpeed * deltaTime, out target)) {
    setPosition(target);
} else {
    const heading = cursor.getNextDirection();
    let delta = moveController.calculateMoveDelta(heading, deltaTime);
    const proposedGrid = gridOf(position + delta);

    if (proposedGrid !== oldGrid && !map.isPassable(mode, proposedGrid)) {
        const normal = normalize(center(proposedGrid) - position);
        delta -= 2 * dot(delta, normal) * normal;
    }
    setPosition(position + delta);
}
```

[Enemy 移动](../evidence/navigation-native-20261018/76491-call-chain.asm)；`PredictReached`（70273，`0x180896590`）是判断本次移动预算能否直接到当前目标，并处理 locator／body 坐标转换，不是连续整段碰撞扫描。[预测到达](../evidence/navigation-native-20261018/70273-call-chain.asm)

`MoveController.CalculateMoveDelta`（71056，`0x1808b6140`）处理转向力、速度积分与限速。`CalculateIsHanging`（71059，`0x1808b5e60`）周期调用 `_CalculateObstacleAvoidForce`（71060，`0x1808b6af0`），依据周围障碍类或不可通格生成局部避障分量；后者在 `0x1808b6dfc` 调用 `Map.CheckObstacleLikeOrUnpassable`，可通行的高成本障碍格也可能参与。[避障调用](../evidence/navigation-native-20261018/71059-call-chain.asm)、[避障实现](../evidence/navigation-native-20261018/71060-call-chain.asm)

**N：上述常规消费分支没有**「从实际 world position 到平滑目标的完整线段射线 → 原始后继中心 → 当前格中心」三候选协议。无后继时 Node.SafeNext 返回自身中心、访问政策要求到中心、局部避障及位移反射，应分别理解。

**U：** 本轮没有穷尽 MoveController 所有避障常数、特殊体型、推拉覆盖和全部子类。这里证实了其参与层次，不宣称已经还原全部连续运动数学。

## 6. 地图变化后的重新规划

**N：** 普通 Tile 更新／重写以及批量更新结束，会进入 `Map.UpdateRoutes`（70004，`0x180882900`）：

```text
SPFA.ClearCache(motionMode)
    → 遍历相应运动方式的现有 Route
    → Route.ReconstructNextMap
    → 对现有终点／Checkpoint Node 数组重新生成场
```

[UpdateRoutes](../evidence/navigation-native-20261018/70004-call-chain.asm)、[ReconstructNextMap](../evidence/navigation-native-20261018/70362-call-chain.asm)。该路径没有创建新 Cursor、Reset 或重新进入 Checkpoint。

**I：限定在该普通地图更新链上，** 现有 Cursor、脚本索引、已访问记录、被追踪节点、定位偏移、计时及已采样目标偏移继续存在；后续读取已更新数组即可看到新 next。不能据此推导所有换路线／换运动方式都保留全部进度。

`Enemy.ChangePathMotionMode`（76470，`0x180a6b600`）会生成 RuntimeRoute 和新 DirectionCursor，再接续部分脚本进度；`BasicCursor.OnRouteChanged` 也有自己的 Reset 路径。它们与普通 Tile 更新不同。

## 7. 隔离仿真与历史对照

本节保留取证时的合成输入与结果。表中的 Stronghold 是该批编译版对照对象，不代表当前项目实现；完整输入及算法差异保留在证据文件中。

### 可复现的区分案例

坐标均为 `(row,col)`；除说明外全格代价为 1、四向出口开放。下表是合成输入，对照反汇编还原的平滑模型与当批编译版 Stronghold，不是游戏实战记录。[完整输入与结果](../evidence/navigation-native-20261018/semantic-witnesses.json)

| 输入 | 原生还原模型的下一节点 | 当批 Stronghold | 区分点 |
| --- | --- | --- | --- |
| 2×5，`(1,0)` 不可通，从 `(0,0)` 到 `(1,4)` | `(0,4)` | `(1,4)` | 远离理想线段的格子仍在窄矩形预检内。 |
| 1×3，终点 `(0,2)` 禁止 RIGHT，从 `(0,0)` 出发 | `(0,1)` | `(0,2)` | 原生包含终点的出边检查。 |
| 1×3，中格 cost=1000，false 模式 | `(0,2)` | `(0,1)` | 轴向分支没有高成本射线检查。 |
| 2×3，`(0,1)` cost=20，从 `(0,0)` 到 `(0,2)` | `(0,2)` | `(1,1)` | 原生没有 Stronghold 的捷径代价预算。 |
| 4×4，不通格 `(1,1),(2,2),(3,2)`，从 `(3,1)` 到 `(3,3)` | 原地链 `(3,0)`；若只改为读取原始链则 `(2,0)` | 当批完整算法为 `(1,0)` | 固定同一原生射线判定，单独改变后继读取方式也可改变结果。 |

另对原始 `_RaycastBresenhamLine`／`_RaycastSegmentLine` 的机器码做了五个最小案例的隔离仿真，全部符合还原模型，包括离线矩形格、角点侧格、终点出边与轴向高成本。逐次 Node 调用轨迹见 [仿真结果](../evidence/navigation-native-20261018/emulated-ray-results.json)，替身依赖与限度见 [验证说明](../evidence/navigation-native-20261018/emulation-notes.txt)。

## 8. 原生最终场的消费

原始 next 是构造／平滑期间的工作值，普通运行消费读取平滑后的 next。distance 仍表示 SPFA 代价，不能因 next 被拉直就解释成连续世界中的实际剩余距离。原生构造可变性不决定项目是否使用不可变 Field。

当前 Field、连续安全检查及恢复政策见 [Navigation](../../architecture/navigation.md)。

## 9. 仍未确认的范围

- 运行现场是否加载了替代上述方法的 Lua／热更脚本。
- 全部模式、特殊敌人、船运／WORD 特化路径与局部避障数学；这些不自动进入当前项目支持范围。
- 本轮合成区分输入是否出现在特定官方关卡；反例只证明算法不等价，不能代替内容引用证据。
- 主线 5-2 跨格路点的原生构场输入及首段移动建议已经核实。现场走位、抵达和阻挡结果仍需区分验证，见下节。
- 尚未进行端到端客户端轨迹比对；当前证据能落定原始搜索、平滑控制流和常规消费结构，不能声称连续运动已完全复刻。

## 10. 实际路线中的跨格 MOVE

2026-11-22 复查固定镜像 `17759cc8cdf37388414145d16262a3a06f3ab25e`。按原生与项目共用的取最近偶数规则，在 118,248 个引用普通路线的正数 SPAWN 动作中，找到 528 次 MOVE／PATROL_MOVE 路点引用将偏移目标归入另一格，其中主线目录 117 次。此范围内未找到原格可通但偏移目标格静态不可通的案例。 [扫描及样本](../evidence/route-content-necessity-20261122/README.md)

主线 5-2 的 `/waves/0/fragments/4/actions/5` 为破阵者的出怪配置，`/routes/29/checkpoints/3` 的原路点是 `[1, 4]`、偏移是 `[0.25, 0.5]`，目标世界坐标 `[4.25, 1.5]` 被量化为 `[2, 4]`。从前一 MOVE 配置得到的位置 `[3.175, 0.85]` 出发，在同一张图和同一套项目 Navigation 算法中，只选原格构场并在末段加偏移会建议直接到 `[4.25, 1.5]`，按偏移后的目标重构场则先建议 `[4, 1]`。这一区分实验只比较目标归格，未模拟原生平滑算法或敌人完整实战轨迹。 [原表](../../../assets/arknights-game-data/zh_CN/gamedata/levels/obt/main/level_main_05-02.json) · [对照脚本与结果](../evidence/route-content-necessity-20261122/README.md)

**N：当前安装版的普通 MOVE 以原始路点格构场。** `Route._ReconstructNextMapInto`（71504）在 `0x1808df0bc` 从 `CheckpointData+0x18` 取 `position`，于 `0x1808df0c8` 把该 `GridPosition` 交给 `_GenerateNextMap`，随后在 `0x1808de525` 进入 SPFA。`reachOffset` 位于同一数据的 `+0x20`，在路点进入时才复制到本次实例。`MoveCheckpoint.GetNextDirection`（71331）在 `0x1808dad01` 比较安全后继格与 `targetGrid`，相等时在 `0x1808dad24–29` 把本次偏移加入格心。因此这两个值分别控制构场目标格和末段连续移动目标。 [当前汇编与字段](../evidence/route-crash-20261122/native.json) · [复跑说明](../evidence/route-crash-20261122/README.md)

**D／I：5-2 的实际地图能区分这两种输入。** 路线 29 的出生偏移为零，允许对角平滑，无强制格心访问。从上一固定路点位置 `[3.175, 0.85]` 采样，当前位置归入 `[1, 3]`。该格向右直邻原路点 `[1, 4]`，两格可步行且无阻隔边，原生构场直接以 `[1, 4]` 为后继并加偏移，给出朝 `[4.25, 1.5]` 的方向。若对偏移后的 `[2, 4]` 构场，`[2, 3]` 不可步行，当前项目建议先朝 `[4, 1]`。这证实同一真实关卡能出现不同的首段移动意图。连续积分、何时进入接敌半径以及最终是否影响阻挡或抵达，仍需现场轨迹；本次证据足以确定构场输入。 [关卡与 Prefab 摘录](../evidence/route-crash-20261122/config.json) · [项目对照](../evidence/route-crash-20261122/project-compare.json) · [PRTS 关卡与出怪](https://prts.wiki/w/5-2)
