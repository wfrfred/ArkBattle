# Projectile motion / hit boundary — native audit

Read-only research, 2026-10-21. No repository source changed. This report covers question A; stop/source expiry policies are mentioned only where required to establish a real timed-hit path.

## Results

1. **Directly confirmed:** normal projectile strategies share `Torappu.Battle.Projectile` lifecycle. Motion is a `BasicMovement` component (itself a `Projectile.Behaviour`), separate from `HitBehaviour`, `SelectorHitBehaviour`, effects and action execution. `SimpleProjectile` can be paired with `AdvancedMovement`, `ParacurveMovement`, or Amiya-specific movement without changing the root lifecycle class.
2. **Directly confirmed:** motion is genuinely replaceable/composable. `GroupedMovement` initializes multiple child movements, advances a switch controller, then advances only its selected movement. Switching changes the active index, can inherit direction, and calls `OnMovementSwitched` on the selected component. It does not allocate a new Projectile or reset its shared hit history/lifecycle.
3. **Directly confirmed:** root Projectile does **not** impose “update position → geometric arrival → collision → hit” as the only sequence. Motion can emit Reached/Stop; a separate condition behaviour can emit Reached from distance/tile conditions; collision behaviour can emit Reached; hit on stopped trace target need not run a collision/ordinary selector at all.
4. **Directly confirmed with actual content:** Amiya default and S2 are timer-controlled hit paths. Their actual projectile prefabs have no `HitBehaviour`. Movement starts a short visual scatter phase, then follows the target with a fixed remaining duration. The timer reaching zero triggers Stop; `SimpleProjectile.alwaysHitTraceTargetInTheEnd=true` then attempts to hit the locked target. S2 explicitly reports Reached before Stop at timer exhaustion.
5. **Precision of the answer to “hit before visual arrival”:** the hit event has **no mandatory geometric-arrival/visual-position prerequisite** on this timed branch. However, the same motion algorithm adjusts its speed to cover the remaining distance within the remaining time. This is not evidence that Amiya normally produces a visibly early hit. S2 also has an independent sinusoidal body offset that does not gate the hit. We did not run a client capture proving a named normal gameplay situation where the visible projectile is still short of the target when HP changes. State the former as confirmed and the latter as unconfirmed.

## Provenance

See `provenance.json` for exact DLL/metadata paths and SHA256. Current metadata indices are 712xx/713xx for movement/projectile, not old 703xx/704xx indices in existing research docs. All addresses below were regenerated from this installed client. XLua hotfix slots exist; this audit establishes compiled fallback plus shipped prefab wiring, not active hotfix execution.

## 1. Shared lifetime and independently wired behaviours

`Torappu.Battle.Projectile` (type 10773) inherits `BObject`, owns:

- `m_lifeTime` +0x98, `m_isStopped` +0xa4, `m_hasReached` +0xa6;
- `m_currentHitNum` +0xa8 and `m_targetsAlreadyHit` +0x158;
- `m_movement: BasicMovement` +0xf0;
- `m_behaviours: Behaviour[]` +0x148;
- source, traceTarget, action controller, currentTime.

`BasicMovement` (type 10757) inherits `Projectile.Behaviour` (10767). `HitBehaviour` (12551) separately inherits the same Behaviour. The relationship is not inferred merely from field names:

| Actual operation | Native evidence |
| --- | --- |
| Root resolves/keeps its Behaviour array | `Projectile._InitBahavioursIfNot` [71395] @0x1808dbcd0; local/children component-query choice at 0x1808dbd38–0x1808dbd5e, array stored +0x148 at 0x1808dbd68 |
| Root initializes each behaviour with same Projectile | `_InitInline` [71334] @0x1808dbda0, loop 0x1808dc0de–0x1808dc16c invokes virtual slot4 Init; writes behavioursInited after all |
| Motion explicitly registers itself with root | `BasicMovement.Init` [71209] @0x1808cb090, 0x1808cb21b–0x1808cb222 stores self in root +0xf0; `Projectile.RegisterMovement` [71335] @0x1808da700 exposes same assignment |
| Root advances all behaviours | `Projectile.OnTick` [71344] @0x1808d9af0, 0x1808d9e36–0x1808d9f24 loops array and calls slot5 OnTick; per-component GetTimeScale slot14 at 0x1808d9e92 |
| Reached is dispatched to all behaviours and controller | `Projectile.OnProjectileReached` [71365] @0x1808d96b0 writes hasReached then `DealProjectileReached` [71366] @0x1808d6db0 runs controller REACHED actions and calls every behaviour's slot9 |

Simplified runtime structure (initialization/reset/timeout details omitted):

```text
Projectile.Init
  assign shared source/target/time/lifetime
  foreach behaviour: behaviour.Init(this, ...)

Projectile.OnTick(dt)
  update shared projectile clock
  perform root lifetime/qualification policy
  foreach configured behaviour:
    behaviour.OnTick(dt * behaviour.GetTimeScale())
```

**Important qualification:** these components are not pure “return a next position” functions. They can call the root's Reached/Stop/DealHitTarget operations. Separating responsibilities is supported by the client, but forcing a new pure Movement API would be a Stronghold design decision, not a literal native contract.

## 2. Strategy variety and actual switching

`AdvancedMovement.MoveType` (12609), compressed signed metadata enum constants decoded correctly:

```text
0 NONE
1 TRACE_TARGET_WITH_SPEED
2 TRACE_TARGET_WITHIN_TIME
3 TWO_POINTS
4 FIXED_DIRECTION
5 FIXED_DISTANCE
6 FUNC_ANGLE_AND_TIME
7 FUNC_INIT_SPEED_AND_ACC
8 FUNC_CURVE_AND_X_LENGTH
9 FUNC_TURN_AND_WAVE_TO_TARGET
```

`AdvancedMovement.OnTick` [86734] @0x180d530c0 has a real switch over these modes at 0x180d531dc–0x180d53200. The speed-tracking branch reads the current target position via slot24 and updates target cache at 0x180d5322b–0x180d53243. It moves toward that position and can snap when this tick's distance budget reaches it. Time-tracking mode computes distance / `projectile.remainingTime` at 0x180d53658–0x180d536ab instead of one constant flight speed. At the end it calls BasicMovement.OnTick and slot20 DoCheckReached (0x180d53b36, 0x180d53b52–0x180d53b60).

Other strategies in the same hierarchy and expanded here:

- `ParacurveMovement.OnTick` [87124] @0x180d78190 calls `_CalculateNextPosition` [87129], writes position, updates vertical velocity from gravity, then checks arrival through slot30. This is a motion specialization under the same root.
- `RotateAroundMovement.OnTick` [87168] @0x180d7a550 runs orbit logic. Its `DealReached` [87167] @0x180d79ea0 is empty in the ordinary fallback, so “every movement eventually geometrically arrives” is not a common invariant.
- `AttachToTarget` type12617 has its own delay, attachment and arrival check; `FarthestPointMovement` type12623 extends AdvancedMovement and chooses its farthest destination at initialization; HarpoonMovement type12632 has its own speed/acceleration/extension logic.

Actual dynamic composition:

```text
GroupedMovement.Init [86950] @0x180d69670
  foreach child: child.Init(same projectile,...)
  BasicMovement.Init(...)  // registers the wrapper as root movement
  controller.Init(same projectile, this, ...)

GroupedMovement.OnTick [86955] @0x180d69e50
  controller.OnTick(dt)             // 0x180d69ed3
  current = get_curMovement()       // 0x180d69eda
  current.OnTick(dt)                // 0x180d69f1e (slot5 tail-call)

MovementSwitchController.SwitchMovementIndex [87001] @0x180d72c30
  optionally sample previous direction
  curMovementIndex = requestedIndex // 0x180d72cc8 or 0x180d72d08
  optionally write new direction
  selected.OnMovementSwitched()     // slot27 at 0x180d72d34–0x180d72d57
```

`GroupedMovement.get_curMovement` [86946] @0x180d6a340 reads the controller's current index and chooses that child. `MovementSwitchControllerBasedOnTime.OnTick` [87032] @0x180d6ee90 provides a real timer-driven switch controller. The generic mechanism exists and is called, not just a serialized unused list. We did not require an exhaustive actual-content inventory of every switch-controller subclass for the domain conclusion.

## 3. Real timed hit: Amiya default and S2

Actual prefab records are independently decoded in `../examples/amiya-projectiles.json`; source is installed `char_002_amiya.ab`. Key facts:

| Projectile | Root policy | Motion | Hit component |
| --- | --- | --- | --- |
| `projectile_amiya` and `_logic` | SimpleProjectile, alwaysEnd=true, alwaysWhenReached=false, stopAfterMax=true, maxHit1 | AmiyaDefaultMovement: startDuration .15, time .15, startDistance2.5 | none |
| `projectile_amiya_s2` and `_logic` | SimpleProjectile, alwaysEnd=true, alwaysWhenReached=false, maxHit1 | AmiyaS2Movement: startDuration .15, time .15, startDistance2, body sine amplitude .1/speed5 | none |

These are timer durations in serialized seconds, not a promise of exact .3 seconds under all tick/tween/time-scale circumstances.

`AmiyaDefaultMovement.OnInit` [86795] @0x180d55c10 initializes base targeting, picks an initial random visual scatter direction, and starts a `.15` duration tween. Deterministic execution uses BattleController.StartBattleTween at 0x180d5605d with callback `<OnInit>b__10_1` [86799] @0x180d56400. That callback sets `m_remainingTime = _time` (+0xbc → +0xc4) and marks the initial phase finished. S2's callback [86809] @0x180d56d90 does the same (+0xbc → +0xcc).

Default `OnTick` [86796] @0x180d560f0, relevant actual order:

```text
if not startPhaseFinished: return
if not reached:
  if CheckReached(): Stop()
  targetPos = GetTraceTargetMapPosition()
  velocity = normalize(targetPos-position) * distance(targetPos,position)/remaining
  position += velocity * dt
remaining -= dt
if remaining <= 0:
  remaining = 0
  Stop()                           // 0x180d5635d, independent of distance test
```

S2 `OnTick` [86805] @0x180d56ab0 does the same fixed-remaining-duration flight, but its timer expiry explicitly does:

```text
remaining = 0
Reached()  // 0x180d56d43
Stop()     // 0x180d56d4d
```

S2 `_UpdateBodyAnimation` [86806] @0x180d56db0 writes local body `(0,sin(phase)*_yAnimateOffset,0)` through `Behaviour.AssignBodyTransformLocalPos` at 0x180d56e26. Arrival/hit qualification never inspects that animation offset.

Minimal hit call chain (not a comprehensive Stop policy review):

```text
AmiyaMovement timer -> Behaviour.Stop [71422]
  -> Projectile.StopMe [71373] @0x1808daf40
     -> Projectile.OnProjectileStop [71361] @0x1808d97d0
        if alwaysHitTraceTargetInTheEnd:
          _DealHitTraceTarget [71375] @0x1808db940
            verify original target still valid/alive
            DealHitTarget(originalTarget, force=true) [71347]
```

The call at 0x1808d9862 is conditioned on root slot43 (alwaysEnd). `_DealHitTraceTarget` has no projectile-target-distance or HitBehaviour collision requirement. It does **not** imply dead targets can still be damaged: the helper checks a live target first. Force bypasses ordinary hit-count qualification, not necessarily all downstream damage-reception rules.

### Geometric and time-reached branch are not interchangeable facts

`BasicMovement.DoCheckReachedInternal` [71222] @0x1808caa70 has an `_onlyReachedInTime>0` branch (0x1808cacea onward) that compares Projectile.currentTime to the configured deadline and calls virtual DealReached. Otherwise it tests position proximity. But AdvancedMovement overrides this method, so **do not** infer that the inherited field alone defines AdvancedMovement's full arrival policy. The real Amiya example above does not need this field (`_onlyReachedInTime=0` there); its explicit remaining-time branch proves timed control independently.

## 4. Arrival can be reported from hit / extra conditions

This prevents overstating native ownership as “only Movement is allowed to emit Reached”.

- `ProjectileReachConditionBehaviour.OnTick` [86402] @0x180d41ea0 checks max distance from source or tile condition and calls Behaviour.Reached at 0x180d42093. This does not require reaching the original target.
- `HitBehaviour._DoTargetEnter` [86267] @0x180d35da0, when `_markReachedOnlyWhenTargetEnter` (+0x9d) is enabled and target options accept, calls `Behaviour.Reached` at 0x180d35fc0. Collision can produce a reach signal rather than waiting for Movement.
- `Behaviour.Reached` [71423] @0x1808ce870 invokes root OnProjectileReached; `TouchReached` [71424] @0x1808ce9d0 instead invokes root DealProjectileReached directly. These are native reporting mechanisms, not a recommendation to expose both in Stronghold.

## 5. Target sampling while moving

`BasicMovement.GetTraceTargetMapPosition` [71223] @0x1808cafa0:

```text
if predefined-location mode: query configured location
else if targetMountPoint.isValid:
  return targetMountPoint.mapPositionV3  // 0x1808cb024
else:
  return remembered targetPos          // +0x60; 0x1808cb009
```

Advanced and Amiya movements call this and update cached targetPos. Thus target movement normally changes the trajectory; an invalid mount point retains the last sampled target position rather than automatically stopping. ParacurveMovement._CalculateNextPosition [87129] @0x180d78310 independently confirms the same behaviour: 0x180d783be invokes slot24 and 0x180d783c9–0x180d783ce updates m_targetPos, then continues integrating. Neither this target-position query nor these ordinary motion branches checks Entity.alive. **Entity death, invisibility, departure and mount-point invalidity are different facts**; do not substitute one for another without the other agent's hit/target qualification evidence.

## Architectural implications, without proposing types

Confirmed enough to reject a universal core “arrived then contact-check” implementation. Native root OnTick iterates configured behaviours; it does not implement a global first-update-all-movement, then-resolve-all-hits schedule. Movement may synchronously cause Reached/Stop and therefore nested hit handling inside its own OnTick. Preserve independent facts: position/trajectory progress, Reached, accepted target hit, stopped. Particular behaviour may connect them in different ways.

Also reject the opposite overclaim that all Projectile state must be split into a new mandatory Movement/Hit plugin framework. The native component model establishes separable responsibilities and concrete variation; Stronghold may express these through content programs and reusable algorithms. This audit does not design Definition/State or demand public advanceMovement/resolveHit functions. Shared instance identity/lifecycle plus independent motion and hit programs is sufficient as a boundary conclusion.
