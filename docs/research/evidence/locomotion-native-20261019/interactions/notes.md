# Locomotion interactions: native/client evidence, 2026-10-19

Scope: local unit separation, forced displacement and direct position changes. No simulator/source/test changes or commits. No boat or 生息演算 mechanic analysis. All conclusions concern ordinary compiled native branches; XLua bridge gates remain present. **N** = directly observed native instructions or installed client resources, **I** = inference from that evidence, **U** = unresolved/runtime dependent.

Evidence root: `docs/tactical-research/evidence/locomotion-native-20261019/interactions/`. Every numbered `.asm` starts with metadata index, token, VA, RVA and explicit next-managed-method read bound. `metadata.json` records field offsets, virtual slots, constants, source hashes and method parameter metadata. Image base is `0x180000000`.

Source fingerprints (SHA256):

- GameAssembly.dll: `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`
- global-metadata.dat: `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`
- MonoScript bundle: `eb1f2d8339c466192624c42dbb0ab986efa38517e8aca22fd54b5737d78908f3`
- enm_pfb_22.ab (enemy_5046_dqmir): `9397b1f6f7570f1144b553be7d80af5c3d7f98c361eb4e229d6798b0437ea5bf`
- enm_pfb_34.ab (enemy_19017_akrang): `10bfe513eabd460d5f2776fe25939ff5b1138f46c6fc69ee89f3f0a5b66eb799`


## 5. Other enemies: base versus separate controller

**N:** The base `MoveController.CalculateIsHanging` (71059, VA `0x1808b5e60`) refreshes tile obstacle avoidance, caches `m_lastObstacleAvoidForce` (+0x40), removes its component along the supplied route direction, and adds that cached force to the result. It does not enumerate enemies. The base declares separation constants, `m_lastSeparationForce` (+0x48) and ticker (+0x58), but these declarations do not establish neighbor avoidance in the base implementation.

**N:** `SeparateMoveController` overrides only virtual slot 8 (`CalculateIsHanging`) among the movement slots 4–8; its slot 6 still points to base `CalculateMoveDelta` and slot 7 to base `_CalculateSteeringForce`. This is confirmed in metadata vtables, not inferred from names. The override (72515, VA `0x18094d440`) first invokes the base at `0x18094d49e`, then updates separation at `0x18094d4c0` only when `m_separationTicker.Tick()` is ready.

**N:** Separation is a cached steering contribution, not a collision resolution or new route search. The override adds:

```text
resultForce += cachedSeparationForce * magnitude(m_lastVelocity) / moveSpeed
```

The native sequence is `0x18094d50f–0x18094d580`. In contrast to the base obstacle contribution, this contribution has no minimum influence floor. A zero stored route velocity therefore scales it to zero (subject to the separate zero-speed division issue; no claim of special NaN handling).

**N:** `_CalculateSeparationForce` (72516, VA `0x18094d5e0`) requires `m_target` to be an `Enemy`; otherwise it returns zero. Candidate enumeration has two branches:

- `RemoteConfig.enableDynamicTree` (223632, VA `0x1867927a0`) true: build a `TCircle` at target `worldPosition`, radius `_separationRadius`, and use `BattleController.physicManager.QueryEnemy` (78700, VA `0x180b231c0`) at `0x18094da8b`.
- False: use target `rootTile` and `Map.GetAdjacentTilesEnemies` (70087, VA `0x18087bda0`) at `0x18094dcd5`. That helper gathers current tile enemies and the configured adjacent tile offsets. It does not perform a priority or velocity arbitration.

**N:** Once the candidate list exists, the filtering/calculation at `0x18094dd8c–0x18094dfc8` is:

```text
sum = (0, 0)
for candidate:
    delta = candidate.(x, y) - target.mapPosition
    skip unless abs(delta.x) < radius and abs(delta.y) < radius
    skip unless candidate.get_isMovingBySelf()       // virtual slot 0x9e
    skip candidate == target
    skip IUseEnemyTrace candidate with hasTargetInRange
    sum += delta / max(abs(delta.x) + abs(delta.y), minSeparationSumDelta)
return -normalize(sum) * separationForceFactor
```

`virtual-bool-helper.asm` resolves the call helper and `metadata.json` resolves enemy slot 0x9e to `get_isMovingBySelf` (76359, VA `0x180a7e3a0`). `enemy-trace-helper.asm` resolves the trace-range test to `IUseEnemyTrace.get_hasTargetInRange` (slot 2). The normalization uses the usual ~1e-5 magnitude threshold at `0x18094df62`; very small sum yields zero. Coincident positions contribute zero; no random tie breaker is present here. There is no distance-squared weight, mass/weight comparison, route progress/target priority, other-unit velocity prediction, or reciprocal collision guarantee in this method.

**N:** `get_isMovingBySelf` requires the enemy not to be disappeared (`BObject.isDisappeared` +0x26), state-machine state 1 (Move), and blackboard `isHanging` false. The controller filters for self-moving neighbors; a nearby blocked or hanging enemy need not produce repulsion through this method. It does not test only the geometry of every neighbor.

**N:** Serialized defaults are `_separationForceFactor=1000`, `_separationRadius=0.5`, `_minSeparationSumDelta=0.05`, `_separationTickPeriod=3` (72517 ctor, VA `0x18094e090`, assignments at `0x18094e0d1–0x18094e0e6`). Tick/Reset/Next (25963/25962/25964, VAs `0x181e043d0/0x181e043c0/0x181e04370`) establish a refresh every three calls to this override after the initial ready call; force is reused between refreshes. This is a count of controller calls, not a wall-clock timer. Base `Reset` clears its velocity and both force caches and readies the tickers.

**I:** This is limited local repulsion blended into the ordinary steering pipeline. It is not enough evidence for universal enemy collision, RVO/ORCA, avoidance of blocked bodies, or guaranteed separation at spawn. Symmetric sums can cancel. Actual radius filtering is an axis-aligned square after the broad phase; the dynamic-tree broad phase itself is circular, so the two candidate sources can differ at the corners.

### Actual content, not just class existence

`sampled-content.json` preserves source bundle path, SHA256, CAB, object IDs, script IDs, serialized component bytes and values.

**N:** The known ordinary `enemy_1003_ncbow` prefab has a plain `MoveController` component, `_steeringFactor=8`, `_maxSteeringForce=10`, `_halfBodyWidth≈0.2`. Its exact component ID `2072793587615324749` was independently re-read and matches the existing `action-timing.json` extraction. The new minimal UnityFS reader was validated against that ID, script identity and all three values.

**N:** Installed script bundle maps `MoveController` to path ID `-7073810281583634641`, `SeparateMoveController` to `-2453998455604132987`. A bounded scan of all 38 `battle/enm_pfb*.ab` bundles found 156 Separate components among 2143 base-or-Separate components. Full scan output is temporary at `/tmp/stronghold-separate-prefabs.json`; the report should avoid promoting a resource census to runtime usage.

**N:** Two positive samples:

| Prefab root | Bundle | Other root script | Separation values |
|---|---|---|---|
| `enemy_5046_dqmir` | `enm_pfb_22.ab` | `TeamSideEnemy` | factor 1000, radius .5, min .05, period 3 |
| `enemy_19017_akrang` | `enm_pfb_34.ab` | `ArkDexEnemy` | factor 1000, radius .5, min .05, period 3 |

The existing locally cached `activities/act5fun/level_act5fun_01.json` explicitly references `enemy_5046_dqmir` in `/enemyDbRefs`; provenance and file hash are retained in the sample artifact. No localized mode identity is guessed. **I:** These are concrete specialized content uses, while the ordinary ncbow sample establishes that the base path is real too. **U:** This does not prove every route in those modes uses this controller at runtime, nor show runtime hotfix overrides. Do not generalize Separate behavior to ordinary enemies as a whole.

The sampling helper `read-sampled-unity-assets.py` uses system `liblz4` and a local-copy LZ4AK transform (with attribution), no installed Python packages, no asset mutation. It is an intentionally narrow UnityFS/SerializedFile v22 evidence reader, not project application code.

## 7. Forced displacement versus route movement

**N:** These are separate state and velocity paths, with different collision contracts:

| Mechanism | Native path | State/velocity effect |
|---|---|---|
| Ordinary route | Base/Separate `CalculateMoveDelta` then ordinary cursor movement | `MoveController.m_lastVelocity` (+0x38) and map/cursor navigation |
| Knockback | `Enemy.KnockBack` 76435, VA `0x180a6f120` | `Rigidbody2D.AddForce(..., Impulse=1)`; requests Unbalance state 9 |
| Pull | `Enemy.BeginPull` 76437, VA `0x180a69fe0`; `StillPull` 76438, VA `0x180a752d0` | `Rigidbody2D.AddForce(..., Force=0)`; Begin requests state 9, Still requires current unbalance |
| Direct position change | `ForceSetPositionByWorldCoords` 76452, VA `0x180a6d990` | Direct `VisualObject.SetPosition`, block release if in combat, face update |

### Knockback/pull entry and force handling

**N:** `KnockBack` checks `alive` via virtual slot40 and `isUnbalanceImmune`, optionally faces against nonzero force direction, and applies `direction * force * BattleOptions` scale `* .02` to `Rigidbody2D.AddForce` with mode1 at `0x180a6f344`. It refreshes blackboard protection (`0x180a6f375`) then calls `SwitchState(9)` at `0x180a6f398`.

**N:** `BeginPull` likewise checks alive and immunity, records its pull source, applies `-direction * pullForce` with mode0 at `0x180a6a17f`, refreshes protection, then requests state9 at `0x180a6a1db`. `StillPull` requires current unbalance, rejects a disabled source, and calls `AddForce` mode0 at `0x180a75477`. This is continuous force, unlike the impulse used by `KnockBack`. Force-mode values are directly verified as compressed metadata literals Force0/Impulse1.

**N:** `UnbalanceState.OnEnter` (76746, VA `0x180a9e7c0`) releases block at `0x180a9e858`, registers a physics object and enables `Enemy.m_nonTriggerCollider` (+0x420) at `0x180a9e977`. `_InitPhysics` (76539, VA `0x180a78c30`) obtains the rigidbody, collects attached colliders, picks a nontrigger collider into +0x420, stores the main trigger collider (+0x428) and its circle radius (+0x430), then `_ResetPhysicsStatus`.

**N:** `_UpdateFriction` (76750, VA `0x180a9f810`) uses actual `Rigidbody2D.velocity`, enemy mass, global `Consts.GRAVITY`, `frictionFactor`, `.5` and deltaTime to reduce speed, clamp to zero, then writes normalized-velocity times new speed back to the rigidbody. It does not derive displacement from the route controller. A .1 speed threshold and blackboard protection time affect whether the unbalance phase remains active. The exact overall transition predicates belong in the state research; do not equate the threshold with immediate unbalance exit.

### Collision contract and exit

**N:** Base `Enemy.get_onlyCollideWhenUnbalance` (76289, VA `0x180a7f4f0`) returns true in its compiled ordinary branch. `UnbalanceState.OnExit` (76747, VA `0x180a9ec10`) calls `_ResetPhysicsStatus` at `0x180a9ecdd`. `_ResetPhysicsStatus` (76493, VA `0x180a7a1f0`) writes rigidbody velocity zero at `0x180a7a2d7`, sleeps it at `0x180a7a2f4`, wakes it again in deterministic mode, and disables +0x420 if `onlyCollideWhenUnbalance` is true (`0x180a7a388–0x180a7a3a3`). It clears pull-source collections and protection time as well.

**N:** `_CheckCollideWithHighLand` (76749, VA `0x180a9f350`) is explicit collision-related bookkeeping for unbalance. It checks the target movement mode, the nontrigger collider's world bounds/offset and neighboring tiles with `heightType==1`, using inflated half-extents. It is not the ordinary route `CheckPassable` API. Unbalance emits the highland collision buff hook on appropriate checks. Raw method assembly includes incidental generic game-mode branches; this note analyzes no excluded game mode.

**I:** Ordinary routes, optional steering separation, and forced rigidbody contact are separate mechanisms. A plain enemy's ordinary nontrigger collider being disabled does not mean it lacks targeting/trigger geometry. Conversely, a forced push/pull collision outcome cannot be reconstructed solely by plugging force into ordinary route smoothing or applying the normal route arrival contract.

**U:** Exact Unity contact solver order, collision layer matrix, tunneling, all corner contacts and runtime deterministic physics behavior were not executed here. The highland checker is not a complete replacement for Unity contact resolution. No claim that every forced move collides with every other enemy follows from the collider toggle.

### What resets/retains velocity

**N:** `MoveController.Reset` (71054, VA `0x1808b6980`) explicitly clears `m_lastVelocity`, avoidance and separation caches at `0x1808b6a10–0x1808b6a93`. `OnStart` (71055) sets foot offset, not velocity. Direct call scan (`controller-reset-xrefs.txt`) finds `Enemy.OnReset` at `0x180a719fa` as the only mapped direct call to controller Reset. Controller `set_velocity` direct callers are specialized RacingEnemy fall handling and MarblesLikeEnemy velocity updates, not ordinary unbalance entry/exit.

**N:** KnockBack/BeginPull/StillPull, Unbalance entry/exit, `_ResetPhysicsStatus`, and MoveState OnEnter/OnExit do not access `Enemy.m_moveController` (+0x390), call controller Reset/set_velocity, or copy rigidbody velocity into its stored velocity. Rigidbody reset on unbalance exit therefore clears a different velocity from `MoveController.m_lastVelocity`.

**I:** In the ordinary compiled chain, push/pull retain the previous route-controller velocity/cache while physics manages its own velocity. Resuming route motion continues through that stored steering state unless some other explicit reset/override occurs. This is not a universal guarantee across all subclasses and hotfixes.

**N:** Direct `ForceSetPositionByWorldCoords` performs block release, compares new/old position for facing, then `VisualObject.SetPosition` at `0x180a6dab6`. It does not run route passability/arrival, clear either velocity, or reset the route/controller itself. There is an actual native action caller: `BlinkNode.Execute` calls it at `0x18117a74d` (direct-xref artifact). **I:** A forced teleport is another distinct position-change contract; it must not be described as ordinary steering catching up gradually. **U:** Callers/subclasses may arrange route reconstruction independently, and runtime hotfixes can replace native methods.

## Useful result for the final synthesis

The defensible ordinary-client model is **route steering + tile avoidance**, with **optional subclass neighbor repulsion**, a **separate unbalance rigidbody path for push/pull**, and **direct position assignment for blink-style actions**. The resource-backed base-versus-Separate distinction is strong. Strong global statements about all enemies separating, universal collision, push forces overwriting route velocity, or forced displacement sharing arrival/passability rules would exceed this evidence.
