# Projectile hit and Targeting native investigation

Scope: current installed GameAssembly.dll/global-metadata.dat, identity recorded in ../identity.json. Native fallback code + real prefab configuration; no XLua hotfix branch audit. No source edits. Prior documents used as leads only: method indexes in old docs differ from the currently decoded metadata, so all addresses below were re-derived.

## Main findings

1. A common Projectile owner dispatches events, but hit triggering is not universally “arrive then scan”. Locked-target force hit, overlap-at-arrival, Unity trigger contact, and Selector-at-arrival/timer are independent paths.
2. A locked main target does not pass ordinary targeting again. Main hit is still guarded by valid object identity and `Entity.alive`; force does not mean “damage ignores reception/HP rules”.
3. Secondary AoE targets are collected using current spatial state and their own TargetOptions. They need not follow the same eligibility as the locked main target.
4. Projectile base does not unconditionally run a TargetSelector. Some hit components do; other components use direct locked identity or collision/overlap queries.

## Concrete actual content

Prefab decoding by sibling examples agent: ../examples/representatives.json and ../examples/projectiles.json.

| Case | Actual reference/configuration | Hit behavior |
| --- | --- | --- |
| Ordinary crossbow enemy | enemy_1003_ncbow RangedAttack -> projectile_crossbow; SimpleProjectile main PathID5238304719443313584; AdvancedMovement -2310959377298832464 | No HitBehaviour/SelectorHitBehaviour. `_alwaysHitTraceTargetInTheEnd=1`, reach=0, maxHit1, stopAfterMax1; AdvancedMovement TRACK_TARGET. Logical prefab has equivalent behavior. |
| Catapult AoE | char_282_catap RangedAttack -> projectile_catap; Simple4728945255441029912, Paracurve1567109441740266264, Hit144296354637142808 | Hit `_onlyCheckHitWhenReachTarget=1`, `_onlyTraceTarget=0`, `_ignoreCamouflage=1`; TargetOptions advanced enabled, ignoreTargetFree=0. Simple alwaysEnd1/reach0. Logical variant equivalent. |
| Map crossbow trap contact | projectile_crsbow; Simple1864997230084971479, Hit-2008815958967297065, FarthestPointMovement-123534182117188649 | Hit onlyReach0/onlyStop0, onlyTrace0, ignoreCamouflage0; no forced main hit, maxHit1. Movement follows source direction with speed10. This is a real contact projectile, not speculative “piercing”. |

Trap emitter asset reference is separately checked by examples agent. Above does not pretend all penetrating projectiles use the exact same hit policy.

## Locked target path: direct evidence

`Projectile._DealHitTraceTarget [71375] @0x1808db940`:

- 0x1808db98b checks `m_hasHitTraceTarget`.
- 0x1808db9ab calls generic spec285168 (method78227 `BattleUtil.ValidAndAlive`, methodInst478) on saved `m_traceTarget`.
- 0x1808db9b6 marks the main attempt, 0x1808db9c0 locks traceTarget, then 0x1808db9c8 sets force=true and 0x1808db9d6 jumps to base DealHitTarget71347.

Simplified:

```text
if hasHitTraceTarget || !ValidAndAlive(traceTarget): return
hasHitTraceTarget = true
DealHitTarget(traceTarget, force=true)
```

The generic compiled body `0x18449ab40` is saved as 78227-ValidAndAlive-285168.asm. It checks ObjectPtr validity, locks it, and invokes virtual slot40 `Entity.alive` (vtable base0x140; call [klass+0x3c0] at0x18449abff). It is NOT mere Unity object non-nullness.

- `Entity.get_alive [66349] @0x180701920`: state machine running, then HP greater than zero.
- `Character.get_alive [75822] @0x180a38df0`: !dummy, base alive, !isInDyingState.

`Projectile.DealHitTarget [71347] @0x1808d6c40`:

- virtual slot55 CheckTargetAlreadyHitAndUpdate at0x1808d6cba.
- if !force, count limit at0x1808d6cc9; force skips this count rejection.
- virtual OnHitTarget slot54 at0x1808d6ce6, increments currentHitNum afterward.
- No side, source relationship, range, TargetFree, Invisible, Camouflage, motion/category or TargetSelector call here.

Consequences directly supported by this path:

- Living locked target becoming invisible/camouflaged or moving out of original attack range is not rejected by these ordinary targeting conditions at main hit time.
- Main hit does not recheck faction. Hardcoded current-side tests in Stronghold projectile contact cannot be assumed native for locked main hits.
- Dead / non-alive or invalid identity is not hit by this forced-main path.
- Dedup still applies even with force. force is not a general bypass of all constraints.

`Projectile.OnHitTarget71362` calls behavior callbacks, source OnProjectileHitTarget, then ActionController.OnHitTarget71441. `ApplyDamage.Execute96823` reaches Entity.ApplyModifier66665; this is a separate damage reception path. Therefore “selected/force hit” does not establish damage through invincibility or every target lifecycle state. Do not conflate hit notification with actual HP loss.

## AoE at arrival: direct evidence

`Projectile.OnProjectileReached71365` sets `m_hasReached=true` and calls DealProjectileReached71366.

`Projectile.DealProjectileReached71366 @0x1808d6db0`:

1. REACH event actions.
2. Each Behavior.OnProjectileReached virtual slot9.
3. Depending on alwaysEnd/reach policy, `_DealHitTraceTarget` at0x1808d6f3c.

`HitBehaviour.OnProjectileReached86264 @0x180d34fc0` checks `_onlyCheckHitWhenReachTarget` +0x89 (0x180d35091). It takes current attached colliders and copied TargetOptions, calls Box2dPhysicsUtil.FindTargets_DISPOSE73944 at0x180d351aa. It then materializes candidates and calls virtual HitBehaviour.DealHitTarget per candidate at0x180d353d3.

`Box2dPhysicsUtil.FindTargets_DISPOSE73944 @0x1809a5850`:

- computes layer mask, spatially overlaps colliders.
- validates target is Unity-present, BObject.isValid and alive (virtual40).
- deduplicates Entity instance id across colliders.
- calls TargetOptions.VerifyTargetWithoutCheckingTargetSide75074 at0x1809a5c69; side already used by layer mask.

`TargetOptions75074` calls BattleUtil.VerifyTarget78233 (current motion/category) then `_VerifyAdvanced75077`. Advanced contains targetfree/invisibility aggregate conditional on source side and ignore options, ally-targetfree, heal-free etc. HitBehaviour.Init86263 initializes TargetOptions with source at0x180d34c38.

`HitBehaviour.DealHitTarget86266 @0x180d34840` separately:

- checks current Camouflage unless `_ignoreCamouflage` (+0x99), at0x180d348db.
- configured exceptSource, onlyTraceTarget, exceptTraceTarget and flying Character exclusions.
- finally forwards target+force to base Projectile.DealHitTarget at0x180d34a37.

Catapult’s real HitBehaviour ignoreCamouflage=true, but ignoreTargetFree=false. Thus its AoE can hit camouflaged bystanders while respecting still-effective targetfree/invisibility; its locked main target has an independent forced path and need not satisfy that AoE query. A main already hit by AoE is deduped, not applied twice.

Potential nested event order when max-hit causes Stop is out of this round’s lifecycle scope. Only the existence of separate main/area qualification is concluded here.

## Along-path contact: direct evidence

`HitBehaviour.OnTriggerEnter2D86269 @0x180d358a0` checks reach/stop policies; when both false, processes collision. It checks Unity collision layer, resolves Entity/Tile, then queues or invokes `_DoTargetEnter` through BattleController.TrigOrQueueFixedPtrEvent64664 at0x180d35b2f. Thus callback need not happen in the raw Unity trigger stack immediately; no blanket synchronous timing claim.

`_DoTargetEnter86267 @0x180d35da0`:

- Wall/Tile -> stop unless configured goThroughWall.
- Entity must be alive (slot40) at0x180d35f7b.
- TargetOptions.VerifyTargetWithoutCheckingTargetSide75074 at0x180d35f91.
- normally invokes virtual HitBehaviour.DealHitTarget slot15 at0x180d35fb1.
- special markReachedOnlyWhenTargetEnter calls Reached instead.

Actual projectile_crsbow has onlyReach0/onlyStop0, so contact can hit while moving, before destination arrival. It uses collision candidates; no global “reselect all Targets every tick”. Multiple/repeated-contact semantics require specific HitBehaviour/Projectile settings; do not derive them from this one-hit trap.

## TargetSelector is opt-in behavior, not base invariant

`SelectorHitBehaviour.OnProjectileReached86501 @0x180d498b0` conditionally calls DoSelectTargetToHit86505 on current projectile.mapPosition when `_onlyCheckHitWhenReachTarget`.

`DoSelectTargetToHit86505 @0x180d48e80` calls `_FindTargets_DISPOSE86507` at0x180d48feb, then DealHitTarget for each candidate.

`_FindTargets_DISPOSE86507 @0x180d49d20` reads configured selector, calls `TargetSelector.FindTargets_DISPOSE75093` at0x180d49de5, then source OnProjectileSelectTargets notification.

SelectorHitBehaviour also has periodic OnTick/timer path, independent from the reach callback. This is evidence against placing one mandatory Targeting strategy in every Projectile base. Whether Stronghold invokes its Targeting operation from a particular hit policy is a design conclusion, not an already-designed interface.

## Target movement / invalid mounts

Sibling movement proof: ../movement/71223-GetTraceTargetMapPosition.asm.

`BasicMovement.GetTraceTargetMapPosition71223 @0x1808cafa0`:

- target mount valid at0x1808cb000 -> live mapPositionV3 at0x1808cb024.
- invalid mount -> remembered m_targetPos at0x1808cb009.

Advanced TRACK_TARGET updates the sampled m_targetPos each movement tick. Moving locked target can be pursued; invalid mount can leave a remembered location. Entity.alive and mount validity are DIFFERENT conditions: dead Entity does not automatically imply mount already invalid, and an old coordinate can persist without permitting a forced hit of the dead identity.

## Not established / do not overgeneralize

- A universal `offBoard` flag does not exist in the proven main-hit path. Disappear, retreat, dying, prefab dummy and actual identity destruction may make `alive`/mount validity differ; exact retreat/disappear transitions are not fully researched here. Do not equate “not in Battlefield collection” with the native ObjectPtr predicate or claim every off-board identity remains hittable.
- Main path no faction recheck is directly visible. Whether a concrete mind-control content changes source classification, damage receiver handling, ownership or hit nodes later is not established by that absence alone.
- Hit success does not guarantee positive HP damage; damage receiver rules remain separate.
- No comprehensive lifeTime/stop/source-invalid investigation here, except calls necessary to explain ordinary locked main triggering.
- No copied Unity physics architecture proposed; overlap/contact/arrival are observable distinctions, their internal implementation can be reorganized.
