# Temporarily disappeared targets and locked projectiles

2026-10-21. Read-only native fallback investigation. No source edits or Type/API design. Root investigation, independently reviewed by the target-lifecycle agent. DLL/metadata identities are in ../identity.json. Active XLua replacement and live-client timing are not proved here.

## Confirmed distinction

Temporary disappearance itself does not revoke the Entity's instance identity or set HP to zero. It changes world participation and normal targetability; the native object still retains its transform and MountPoint. Therefore the concrete example is not an object with literally no coordinates.

- `BObject.SetDisappeared[65027] @0x180662be0`: valid identity guard, OnBeforeDisappearChanged, writes bool +0x26, OnDisappearChanged. No UID reset, FinishMe, Recycle, or HP write in this operation.
- `BasicCursor.DisappearCheckpoint.OnBegin[70207] @0x180898ac0`, 0x180898adf directly calls SetDisappeared(true).
- `BasicCursor.AppearAtPosCheckpoint.OnBegin[70216] @0x18088ff90` calls VisualObject.SetPosition at0x18088ffdf, then SetDisappeared(false) at0x180890005. It reuses the same owner instead of allocating a new entity identity.
- `Enemy.OnDisappearChanged[76479] @0x180a70650` on true switches the running state machine to DISAPPEAR; it does not call StateMachine.Stop.
- `DisappearState.OnEnter[76777] @0x180a8d030` adds its attribute modifier and starts its disappearance coroutine. `GetValue[76776]` returns no direct numeric modification in the native fallback. `get_abnormalFlagMask[76771]` returns0x128 = BLOCK_FREE(bit3) | INVINCIBLE(bit5) | UNBALANCE_IMMUNE(bit8). Values are decoded from int32 compressed enum constants in abnormal-enum.json.
- `DisappearState.<_DoDisappear>d__21.MoveNext[76795] @0x180a9da10`, after its fade wait, calls GameObject.SetActive(false) at0x180a9de89. This is not DestroyMe or unregister.
- `DisappearState.OnExit[76778] @0x180a8d1f0` removes its modifier at0x180a8d332 and starts _DoAppear[76781]; the latter sets the GameObject active at0x180a8d57d.

Enemy's full inheritance chain contains no OnDisable/OnEnable/OnDestroy implementation that would convert this deactivation into the native FinishMe/UID-reset chain. Entity.alive[66349] only checks running state machine + positive HP. BObject.validAndBorned[65019] checks born flag and positive identity, not GameObject.activeSelf or isDisappeared.

## Tracking and target qualification

MountPoint.get_isValid[71036] @0x1808b5ca0 delegates to ObjectPtr.IsValid for its owner field +0x18. It does not inspect transform active state, Entity.alive or isDisappeared. MountPoint.get_mapPositionV3[71040] @0x1808b5ce0 reads the retained transform's position and converts it into map coordinates. An inactive but non-destroyed Unity GameObject still supplies this transform; no activeSelf condition is imposed by these native getters.

Thus ordinary Advanced/Paracurve tracking can keep reading the retained disappeared entity's mount point, including a new position after AppearAtPos. If some separate operation actually invalidates that owner identity, the already-proved BasicMovement.GetTraceTargetMapPosition fallback uses remembered position instead.

Normal targeting does reject disappearance explicitly:

- Entity.get_isTargetFree[66501] @0x180706b40, checks isDisappeared at0x180706b9f and returns true.
- Entity.IsStillTargetFreeWithImmuneFlag[66507] @0x1806f5ea0 also checks the bool before ordinary immunity logic.

The locked-main path Projectile._DealHitTraceTarget[71375] uses ObjectPtr validity + Entity.alive. It does not call those targetability getters and does not read a MountPoint or any position. Therefore an already-locked, otherwise alive disappeared target is not excluded from **Hit notification** by spatial disappearance alone.

This does not mean the damage must change HP: standard disappearance has its own receiver protection (including the modifier above), and Entity.ApplyModifier owns further acceptance. Do not conflate a projectile's accepted Hit and its count/history with successful Damage application, healing or Buff attachment.

## Caveats and exact scope

SetDisappeared invokes synchronous EventPool/Buff callbacks. Those programs may independently Finish or kill the target. The conclusion is conditional on identity and alive still holding afterward, not a claim that arbitrary content disappears without other effects.

The native evidence demonstrates retained identity and retained transform under a spatially absent state. For Stronghold, the architecture inference is that spatial eligibility is a separate qualification from existing locked identity. This report does not prescribe keeping/removing a position field or redesigning Presence.

Death, withdrawal and pooled reuse are covered by ../target/REPORT.md. Special fake deaths, every other disappearance mechanism, custom GameModes and live hotfixes are not generalized here.
