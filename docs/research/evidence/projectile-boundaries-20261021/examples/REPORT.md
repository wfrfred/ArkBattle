# Projectile: installed prefab witnesses

Read-only investigation, 2026-10-21. No project source edited. These are serialized configuration facts; movement / hit implementation is researched by the other two agents. A field's name alone is not treated as proof of runtime ordering.

## Reproduction / source

Installed asset root:
`/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data/StreamingAssets/AB/Windows/`.

Decoder: `/tmp/stronghold-target-sort-20261020/steward/decode_prefab.py`, UnityFS reader `/tmp/stronghold_interaction_assets.py`. MonoScript PathID -> class map: `/tmp/stronghold-random-target-20261021/content/script-map.json`, decoded from shared `anon/88b3c3ecaaefa6003de730686dd5ac53.bin`.

Sources and SHA256:

- `battle/prefabs/[uc]projectiles.ab`: `bfd637cca7e39e239534da33a580bc6a02d8f160a24708466028dee5e32d7b73`; complete fields `projectiles.json`, CAB `CAB-34af01ecb5d2ad63aca01b6e0d71279d`.
- `charpack/char_282_catap.ab`: `c2fcc2f00bc1bf2de2d6dfc0e959f37d2bcd59a5b7a52c418686ae83ef1ef788`; full fields `catapult.json`.
- `battle/enm_pfb_base_0.ab`: `da7e5c5fd620eac9b7020f143423285b87eea861a0b6cf6534142db7dcf06b5b`; already decoded `/tmp/stronghold-target-sort-20261020/blocking/enm-base-decoded.json`, linked modes summarized `.../blocking/content-witnesses.json`.

Compact fields including all components and colliders for the main examples: `logical-examples.json`. `representatives.json` also includes unsuffixed and graphic variants and the nsbomb timer configuration; `amiya-projectiles.json` has Amiya normal + logic variants.

## 1. Actual ordinary crossbowman -> locked projectile

`enemy_1003_ncbow` / `enemy_1003_ncbow_2`, Default mode, `_attack` is `Torappu.Battle.Abilities.RangedAttack`:

```text
_projectileKey = projectile_crossbow
_projectileDestination = 0
_selectTargetSource = 2
_alwaysIncludeTarget = 1
_useCachedAtkOnly = 0
```

The shared projectile bundle contains `projectile_crossbow`, `projectile_crossbow_logic`, `projectile_crossbow_graphic`. The unsuffixed and logic variants agree on relevant logic configuration. `_logic` GameObject has exactly these script components:

- SimpleProjectile PathID `5817916136774037088`.
- AdvancedMovement PathID `-5354178854122688928`.
- EffectBehaviour PathID `5585898552488029792`.
- **No HitBehaviour or SelectorHitBehaviour**.

```text
AdvancedMovement:
  _moveType = 1
  _speed = 10
  _onlyReachedInTime = 0
  _flyToTargetLocationOnly = 0
  _clearTraceTargetWhenReached = 1
  _forceReachedWhenTimeup = 1
SimpleProjectile:
  _lifeTimeType = 1, _lifeTime = 5
  _hitNumType = 1, _maxHitNum = 1
  _stopAfterMaxHit = 1, _stopAfterFirstHit = 0
  _alwaysHitTraceTargetInTheEnd = 1
  _alwaysHitTraceTargetWhenReached = 0
  _alwaysReachInTheEnd = 0
  _stopWhenSourceInvalid = 0
```

Unsuffixed SimpleProjectile PathID `5238304719443313584`, AdvancedMovement `-2310959377298832464` has the same values. This is a real ranged enemy definition using the locked-target SimpleProjectile path, not an invented generic projectile shape. Runtime force-deal-hit semantics require the SimpleProjectile implementation evidence.

## 2. Actual Catapult -> parabolic explosion

`charpack/char_282_catap.ab` actual RangedAttack components PathIDs `6924529403159253219` and `8821200858721226979` both have `_projectileKey=projectile_catap`, `_projectileDestination=0`.

`projectile_catap_logic` components:

- SimpleProjectile `-6697424808613116192`.
- ParacurveMovement `8015532543194105568`.
- HitBehaviour `-2434201079515248928`.
- EffectBehaviour `7182038264257644256`.

```text
ParacurveMovement:
  _speed = 8
  _raiseHeight = 0.3
  _onlyReachedInTime = 0
  _flyToTargetLocationOnly = 0
  _forceReachedWhenTimeup = 1
SimpleProjectile:
  _lifeTimeType = 1, _lifeTime = 10
  _hitNumType = 2, _maxHitNum = 1
  _stopAfterMaxHit = 1, _stopAfterFirstHit = 0
  _alwaysHitTraceTargetInTheEnd = 1
  _alwaysHitTraceTargetWhenReached = 0
  _alwaysReachInTheEnd = 0
  _stopWhenSourceInvalid = 0
HitBehaviour:
  _onlyCheckHitWhenReachTarget = 1
  _onlyCheckHitWhenStop = 0
  _onlyTraceTarget = 0
  _exceptTraceTarget = 0
  _ignoreCamouflage = 1
  _rangeToLoad -> CircleRange 7942857942245574368
  _goThroughWall = 1
targetOptions:
  targetSide=2, targetMotion=3, targetCategory=1
  enableAdvancedOptions=1
  ignoreTargetFree=0, ignoreAllyTargetFree=0, ignoreHealFree=0
  ignoreTargetSide=0, ignoreMotionMode=0
  purposeMask=0
```

The CircleRange's GameObject has CircleCollider2D PathID `-6369831841128380704`, radius `1`, offset `(0,0)`; its transform is child of the logic projectile at local `(0,0,0)`. Hence this really supplies an impact-centered area, not only the locked target. `_scaleble=1`, so this prefab radius is a configuration baseline, not a proof that every runtime hit has exactly radius 1.

The unsuffixed `projectile_catap` has identical relevant flags. The graphic variant has movement/effect but no HitBehaviour. Selection of logic/graphic resource variants was not re-investigated; no logic/graphic timing equivalence is inferred here.

## 3. Along-path collision witness: map crossbow projectile

Use `projectile_crsbow`, **different from enemy `projectile_crossbow`**. Its trail is `trap_crsbow_attack_01_trail`. A bounded follow-up found its actual skill emitter `sktok_crsbow` (section 6); stage placement and the trap Unit's DB skill linkage were not separately decoded.

Components:

- SimpleProjectile `1864997230084971479`.
- FarthestPointMovement `-123534182117188649`.
- HitBehaviour `-2008815958967297065`.
- EffectBehaviour `1279840423073635287`.
- CircleCollider2D `-2721299313409238057`: radius `0.5`, trigger true, offset `(0,0)`.
- Rigidbody2D `-4798306852508181545`: bodyType `1`.

```text
FarthestPointMovement:
  _moveType = 4
  _speed = 10
  _distance = 0
  _useSourceDirection = 1
  _withinAbilityRange = 1
  _forceReachedWhenTimeup = 0
SimpleProjectile:
  _lifeTimeType = 1, _lifeTime = 60
  _hitNumType = 1, _maxHitNum = 1
  _stopAfterMaxHit = 1
  _alwaysHitTraceTargetInTheEnd = 0
  _alwaysHitTraceTargetWhenReached = 0
  _alwaysReachInTheEnd = 0
  _stopWhenSourceInvalid = 0
HitBehaviour:
  _onlyCheckHitWhenReachTarget = 0
  _onlyCheckHitWhenStop = 0
  _onlyTraceTarget = 0
  _ignoreCamouflage = 0
  _goThroughWall = 1
  _rangeToLoad = null
targetOptions:
  targetSide=2, targetMotion=3, targetCategory=1
  enableAdvancedOptions=1, ignoreTargetFree=0
  ignoreAllyTargetFree=0, ignoreHealFree=0
  ignoreTargetSide=0, ignoreMotionMode=0, purposeMask=0
```

This configuration supports collision candidates before geometric terminal arrival; implementation proof is the HitBehaviour trigger path researched separately. It does **not** have end-hit fallback to a trace target. Unlike Catapult its hit behaviour does not ignore camouflage.

## 4. Actual timed movement witness: Amiya normal and S2

Actual `charpack/char_002_amiya.ab` links `projectile_amiya_s2` through MultiRangedAttack, proven in `/tmp/stronghold-random-target-20261021/content/REPORT.md` and complete `amiya.json`. The same prefab has base RangedAttack `_projectileKey=projectile_amiya`.

`projectile_amiya_logic` scripts:

- SimpleProjectile `7667209295825846605`.
- AmiyaDefaultMovement `-207943885924744883`.
- EffectBehaviour `-1988626768282074803`.
- **No HitBehaviour**.

```text
AmiyaDefaultMovement:
  _startDistance = 2.5
  _startDuration = 0.15000000596
  _time = 0.15000000596
  _onlyReachedInTime = 0
  _forceReachedWhenTimeup = 1
SimpleProjectile:
  _lifeTime = 10, _maxHitNum = 1, _hitNumType = 1
  _stopAfterMaxHit = 1
  _alwaysHitTraceTargetInTheEnd = 1
  _alwaysHitTraceTargetWhenReached = 0
  _alwaysReachInTheEnd = 0
```

`projectile_amiya_s2_logic` scripts:

- SimpleProjectile `-3643411625692561938`.
- AmiyaS2Movement `947111864409980398`.
- EffectBehaviour `4869940359897415150`.
- **No HitBehaviour**.

```text
AmiyaS2Movement:
  _startDistance = 2
  _startDuration = 0.15000000596
  _time = 0.15000000596
  _onlyReachedInTime = 0
  _forceReachedWhenTimeup = 1
SimpleProjectile:
  _lifeTime = 5, _maxHitNum = 1, _hitNumType = 1
  _stopAfterMaxHit = 0
  _alwaysHitTraceTargetInTheEnd = 1
  _alwaysHitTraceTargetWhenReached = 0
  _alwaysReachInTheEnd = 0
```

The unsuffixed variants have the same relevant flags/times. Do not describe `.15` alone as total flight duration: there is a start phase and a subsequent timed phase, which the movement agent traces. However, this configuration directly ties the movement agent's timer->Stop result to a real skill whose hit is supplied by SimpleProjectile end fallback; geometric collision is not required.

## 5. Scope of proof

- Directly established here: independently composed SimpleProjectile / movement / hit-behaviour scripts; real enemy and operator projectile keys; concrete hit-mode flags, colliders, timers, and range configuration.
- Requires the other reports: actual per-Tick component order, exact meaning of movement enums, target-death/leave handling, geometry-vs-timer ordering, main-target force-hit and additional-target qualification.
- Not established: all projectile types, all native subclasses, active XLua overrides, live in-client trace/video, individual stage placements and trap Unit DB skill linkage, resource manager's normal/logic/graphic variant selection.
- These examples are sufficient evidence against making ordinary tracking + collision-at-arrival the only core lifecycle. They are **not** an argument for copying every client flag into Stronghold.

## 6. Bounded follow-up: actual crsbow skill emitter reference

Found by inspecting the installed asset index's `sktok_crsbow` entry, then decoding only the shared skills prefab bundle, without scanning all anonymous content bundles.

`battle/prefabs/[uc]skills.ab` SHA256 `14306a31b1856f61b25812a69a2a057b7c4634561fb2c2bccc42fb37ee41a27e`, CAB `CAB-e39773c4d1462aefe0ea30134bbccdbb`. Full decoded fields `skills.json`; extracted relevant components `crsbow-emitter.json`.

The actual GameObject `sktok_crsbow` PathID `2159293732999320231` contains:

- `Torappu.Battle.Abilities.MultiRangedAttack` PathID `-1066395501153103193`.
- `Torappu.Battle.AlwaysTrigger` PathID `-1578521892814335321`.
- `Torappu.Battle.CastSkill` PathID `8325836638443590311`.

MultiRangedAttack serialized configuration:

```text
_projectileKey = projectile_crsbow
_selector = null
_allowNoTarget = 1
_alwaysIncludeTarget = 1
_selectTargetSource = 2
_selectTargetTiming = 0
_projectileDestination = 0
_emitToInputPosWhenTargetIsInvalid = 1
_waitForAttackEvent = 0
_preDelay = 0.1669999957
_additionalTimes = 2
_triggerDelta = 0.10000000149
```

This closes the previously unconfirmed **emitter ability -> projectile** link. It is an actual autonomously triggered ability configured to emit this collision projectile, rather than merely an unused-looking projectile whose role was guessed from its name. This task did not separately load a stage to prove a specific placement or decode the trap Unit's data-table `sktok_crsbow` reference; those are not required to establish the movement/hit mechanism.
