# Projectile: delayed reach / stop audit

Read-only native and installed-prefab research, 2026-10-21. Scope is delayed reach/stop only; no source/target leave policy, no proposed Definition/State/API, no source modifications. DLL/metadata identity is unchanged from `/tmp/stronghold-projectile-20261021/identity.json` (DLL SHA256 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`, metadata `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`). Asset hashes are in `asset-provenance.json`. Native fallback and shipped configuration are directly inspected; active XLua replacements and live-client timing/video are not audited.

## Findings

1. **Confirmed:** ordinary AdvancedMovement and Paracurve delay is **Reached -> live waiting -> Stop**, not Stop -> delayed lifecycle destruction. During this window, root `m_isStopped` remains false unless another terminal operation stops it early. The root continues ticking its configured Behaviours. Only these ordinary movement controllers suppress their own further position integration once `m_reachedTarget` is true.
2. **Confirmed with real content:** no universal answer to whether delay is before or after hit. Wisdel default has a Reached hit plus additional Stop hits after a positive delay; Sesa S2 has only a Stop hit after a positive arrival delay. The same lifecycle window can therefore be after one hit and before another, or before all damage.
3. **Confirmed with real content:** delayed arrival does not freeze all hit programs. Greyy2 S2 keeps periodic SelectorHitBehaviour ticking *after* Reached until Stop. A separate ordinary HitBehaviour example has neither reach-only nor stop-only flags; its trigger code contains no common `hasReached` refusal. Actual acceptance remains owned by the hit behaviour, root hit budget/history, and current receiver qualification.
4. **Confirmed separate mechanism:** AdvancedMovement `_delayToReachAfterHit` delays the **Reached** signal after an accepted hit. It does not delay that hit and does not initially mark stopped. Heyak S3's installed projectile has a positive value. Motion may continue until this delayed Reached is delivered.
5. No conclusion here requires a core `STOPPING` state or a common delay field. Those are later architecture choices; the native facts are distinct Reached/motion-complete and terminal Stop, plus content-owned actions in between.

## 1. AdvancedMovement: arrival first, delayed Stop later

Fields: `_delayAfterReached` float +0xd4; runtime FP `m_delayAfterReached` +0x110; `_clearTraceTargetWhenReached` +0xdc; `_updateDelayTimeOnlyOnce` +0xdd; local reached +0x6c; root stopped +0xa4. See `type-12611.json` and `type-10773.json`.

`OnInit` [86741] @ `0x180d529b0` reads serialized delay (+0xd4) at `0x180d52a9a`, then resolves blackboard `projectile_delay_time` at `0x180d52ac3-0x180d52ada`, storing effective FP delay +0x110 at `0x180d52b06`. Serialized values in the examples below are **prefab defaults**, not a claim of every skill-rank/runtime duration: blackboard can override them.

`BasicMovement.CheckReached` [71221] @ `0x1808ca5f0` calls virtual arrival logic if not reached already. Actual geometric arrival calls `BasicMovement.DealReached` [71220] @ `0x1808ca720`: guards the local flag, writes local reached=true at `0x1808ca77e`, updates arrival position when configured, then calls root `Projectile.OnProjectileReached` at `0x1808caa2b`. Root reach actions/hit behaviours therefore execute synchronously **before** the following delay scheduling.

`AdvancedMovement.DoCheckReached` [86735] @ `0x180d522b0`, simplified:

```text
if !CheckReached(): return
if gameObject.activeSelf && effectiveDelay > 0:
    projectile.EnsureLifeTime(effectiveDelay, clearTraceTargetWhenReached)
    if !updateOnlyOnce || !alreadyScheduled:
        _UpdateAfterReach()
        alreadyScheduled = true
else:
    Stop()
```

Evidence: CheckReached call `0x180d52310`; activeSelf check `0x180d52322-0x180d5233a`; delay check `0x180d5234e-0x180d523a3`; EnsureLifeTime `0x180d523c9`; scheduling `0x180d523e5` / `0x180d52401`; no-delay Stop tail `0x180d52410`.

The unnamed engine wrappers are closed by embedded icall literals, not guessed: `0x186b59d80` resolves `UnityEngine.Component::get_gameObject()`; `0x186b5c980` resolves `UnityEngine.GameObject::get_activeSelf()`. See `Component_get_gameObject_closed.asm` / `UnityGameObject_get_activeSelf_closed.asm`. The condition is **not** a logic-projectile identity getter.

`_UpdateAfterReach` [86736] @ `0x180d54a10` inlines scheduling equivalent to `_ScheduleDeferredStop` [86737] @ `0x180d548d0`: cancels any prior stop coroutine, constructs a callback, starts battle coroutine with effective delay, stores coroutine ID +0x150. Callback [86756] @ `0x180d53e00` invalidates the ID and then either calls Comeback for the configured first leg or calls Behaviour.Stop at `0x180d53e73`. **Stop is in the delayed callback**, not at the start of the delay.

`EnsureLifeTime` [71349] @ `0x1808d7050` sets root current time from lifeTime minus requested remaining window; when its clear flag is true, it also clears the trace-target ObjectPtr. This does not mark root stopped. Timeout/coroutine scheduling may coarsely coincide; exact same-Tick ordering is not used to define a different lifecycle state here.

## 2. ParacurveMovement: same lifecycle boundary, own controller

Paracurve's `_delayAfterReached` is a **bool** +0xb8, with float `_delayTime` +0xbc and runtime float `m_delayAfterReached` +0xec; do not misinterpret its bool as a one-second duration. `OnInit` [87122] resolves `projectile_delay_time` over the serialized `_delayTime` (`0x180d78102-0x180d78129`).

`DoCheckReached` [87125] @ `0x180d77aa0` calls BasicMovement.CheckReached at `0x180d77afd`, so the root Reached delivery occurs first. If delay enabled, activeSelf, and effective delay > 0, it calls EnsureLifeTime(delay, true) at `0x180d77bc2` and `_UpdateAfterReach` at `0x180d77bde` / `0x180d77c0e`. Otherwise tail-calls Stop at `0x180d77c27`.

`_UpdateAfterReach` [87126] @ `0x180d788b0` schedules callback with +0xec delay (`0x180d78948-0x180d7895d`). Callback [87131] @ `0x180d782f0` selects Comeback or Stop, with Stop at `0x180d7830b`.

## 3. During the wait: local motion stops, other programs remain active

- Root `Projectile.OnTick` [71344] @ `0x1808d9af0` tests **stopped**, not reached, at `0x1808d9b5b`. Until terminal Stop, its clock advances and the Behaviour loop `0x1808d9e36-0x1808d9f24` still runs. No common arrival-wait branch skips that loop.
- AdvancedMovement.OnTick [86734] @ `0x180d530c0` calls `CheckStartTick` at `0x180d5315f`; `CheckStartTick` [86746] @ `0x180d519f0` returns false on own reached flag at `0x180d51a47-0x180d51a4a`. It also recognizes a separate root-hasReached fix flag. This suppresses further ordinary movement integration while waiting.
- ParacurveMovement.OnTick [87124] @ `0x180d78190` directly skips position/gravity integration when +0x6c is true (`0x180d7820b-0x180d78212`).
- These are properties of the inspected ordinary controllers; not a rule that *every* Movement/Behaviour must freeze after Reached.
- Common `HitBehaviour.OnTriggerEnter2D` [86269] @ `0x180d358a0` decides whether to process triggers from its own flags (`0x180d3595f-0x180d35979`), plus physics/target policy. It contains no global `hasReached` rejection. `_DoTargetEnter` [86267] then checks current target qualification and invokes hit. Thus arrival delay itself does not disable subsequent contact. This is not a promise every delayed projectile has ordinary-contact hit logic or remaining hit budget.

### Real ongoing hit: Greyy2 S2

`battle/prefabs/[uc]skills.ab`: actual `skchr_greyy2_2` contains RangedAttack PathID `-4068769652025599049` pointing to `projectile_chr_greyy2_s2`; see `greyy2-s2-emitter.json`.

`projectile_chr_greyy2_s2_logic`, see `ongoing-hit-witnesses.json`:

- AdvancedMovement `-2429070142563909577`: serialized delayAfterReached **9.0**, updateOnlyOnce=true, comeback=false.
- SelectorHitBehaviour `-6297594645437317065`: onlyCheckHitWhenReachTarget=false, onlyCheckHitWhenStop=false, **hitPasserby=false**, interval **1.5**, waitFirstPeriod=false, stopWhenLimitedHitTimesUsedUp=false. Interval may also come from BB key `interval`.
- SimpleProjectile `3874667769863307319`: no stop-after-first/max; always-end-hit=false, keepAlreadyHitTime=.1; root configured to permit this persistent program.

`SelectorHitBehaviour.get_checkHitWhenTick` [86494] @ `0x180d4a2d0` enables periodic Tick mode precisely when both only flags are false. `OnTick` [86499] @ `0x180d49a40` checks this at `0x180d49b1e`; when !hitPasserby it **requires hasReached** (`0x180d49b28-0x180d49b3b`), then updates PeriodicTimer at `0x180d49c25` and selects/hits on its trigger at `0x180d49c36`. Therefore this is explicitly an after-arrival active hit window before Stop, not a purely visual linger.

Additional structural witness: `projectile_chr_udflow_s2_logic` has Advanced delay .05 and ordinary HitBehaviour with both only flags false. The common Trigger path remains enabled during such a wait if target qualification and hit budget permit. No emitter chain was needed or claimed for this supplemental witness.

## 4. Delay relative to damage: two contrasting real operators

### Wisdel default: main hit -> wait -> appended Stop hit

Actual `char_1035_wisdel.ab` Attack_A / Attack_B / Attack_C RangedAttack components all reference `projectile_chr_wisdel_default`; see `wisdel-emitter.json`.

`projectile_chr_wisdel_default_logic` (full wiring `wisdel-delay-witnesses.json`):

- AdvancedMovement `-2529621977274648364`: delayAfterReached **.15 prefab default**, updateOnlyOnce=true, comeback=false.
- ScaleableHitBehaviour `2528897625209632980`: **onlyCheckHitWhenReachTarget=true**, onlyCheckHitWhenStop=false; first arrival hit.
- ScaleableHitBehaviour `-207587472550659884`: onlyCheckHitWhenReachTarget=false, **onlyCheckHitWhenStop=true**, extra append_atk_scale; delayed appended hit.
- Further ScaleableHitBehaviour `-4337854049909212972`: Stop-only, additionally gated by BB `enable_third_attack`; not a claim this third segment is always active.
- Root SimpleProjectile `3204693032964126932`: stopAfterMaxHit=false, stopAfterFirstHit=false, always-end-hit=false, keepAlreadyHitTime=0; these hits are intentionally supplied by different Behaviour stages.

`HitBehaviour.OnProjectileReached` [86264] @ `0x180d34fc0` tests reach-only flag +0x89 at `0x180d35091` then scans current range and hits. `OnProjectileStop` [86265] @ `0x180d35410` tests not eliminated and stop-only flag +0x8a at `0x180d354f9-0x180d3550c`, then performs its range hit. Thus the .15-default window lies **after the main hit and before appended hit**, not after all combat output.

Wisdel S1 / S3 logical prefabs independently repeat this Reached + Stop split. Separate S1 shock projectile variants have .5 / .65 default delays, but this report does not need a full talent chain or assert these all run together.

### Sesa S2: arrival -> wait -> first explosion

Actual `char_379_sesa.ab` RangedAttack `4404844242656265205` points to `projectile_sesa_s2`; see `sesa-emitter.json`.

`projectile_sesa_s2_logic`, `delay-witnesses.json`:

- ParacurveMovement `-5462933652690799968`: delayAfterReached=true, delayTime **2.0 prefab default**.
- HitBehaviour `3763221006184641184`: reach-only=false, **stop-only=true**.
- Root SimpleProjectile `3007869759292469920`: neither arrival nor end fallback locked-target hit.

This configuration does not output its explosion on Reached. Its delayed Stop triggers the explosion; the wait is **before** the damage.

### Crossbow control

Ordinary `projectile_crossbow_logic` has Advanced delayAfterReached=0, delayToReachAfterHit=0. It immediately enters Stop on arrival; its damage is root locked-target fallback. It should not be described as having a mandatory positive stopped/linger phase.

## 5. Hit -> delayed Reached is a different wait

AdvancedMovement.OnHitTarget [86740] @ `0x180d52810` first runs base OnHitTarget, reads `_delayToReachAfterHit` +0xd8 at `0x180d528a4`, and if positive with no already-valid reach-delay coroutine, schedules its **virtual DealReached** callback (`vtable +0x2a8` MethodInfo at `0x180d52935`; timer duration at `0x180d5294d`; coroutine at `0x180d52960`). It does not defer the already-completed hit. The delay is scheduled only once while the stored reach-delay ID is valid.

Real installed `projectile_chr_heyak_s3_logic` has FarthestPointMovement delayToReachAfterHit=.13, delayAfterReached=0, with active SelectorHitBehaviour. See `delay-witnesses.json`. This proves the field is used by content, but exact Ho'olheyak ability/skill emitter chain was not separately required or audited here. Until the delayed DealReached runs (or ordinary geometric arrival/another terminal action occurs), ordinary movement and other Behaviours can continue. It cannot be treated as a universal post-Stop linger timer.

## 6. Repeated/external Stop while a delay is scheduled

Directly confirmed:

- `_ScheduleDeferredStop` / `_UpdateAfterReach` calls `_CancelStopCoroutine` before replacing its own timer. `_CancelStopCoroutine` [86738] @ `0x180d53e80` checks stored ID, calls BattleController.StopBattleCoroutine at `0x180d53f34`, then marks it invalid.
- Advanced has no OnProjectileStop override. Inherited BasicMovement.OnProjectileStop [71216] @ `0x1808cbab0` handles force-Reached and clears movement-modifier list, and does **not** directly call Advanced._CancelStopCoroutine.
- The delayed callback [86756] has no separate root-stopped check; ordinary path forwards to Behaviour.Stop. Root StopMe [71373] has an idempotent stopped guard (+0xa4) at `0x1808daf7f-0x1808daf85`, so a later repeat against the same not-reused instance would not emit another stop callback or destroy again.

**Not closed here:** whether common coroutine-owner cleanup always cancels the pending movement timer on root logical unregister, and precisely how callbacks are invalidated across pooled object reuse. Do not claim either guaranteed explicit cancellation or a guaranteed later callback after external Stop. This unclosed engine ownership detail does not change the verified ordering that the scheduled wait occurs *before the first terminal Stop*.
