# Projectile source-bound lifetime investigation

2026-10-21, read-only native/prefab investigation. No repository source edited. Scope: projectile survival / explicit source dependence; damage power and attribution investigated separately by parent. This report distinguishes source validity, source alive, source ownership collections, and Ability cleanup. Native implementations below are the compiled fallback; XLua runtime replacement is not proved absent.

## Results

1. Ordinary projectiles do not inherently die with their source. Actual crossbow, Wisdel normal and Wisdel S3 logic prefabs all use `SimpleProjectile._stopWhenSourceInvalid=0`, `_managedBySource=0`. Real Wisdel Character also has `_clearProjectileWhenDead=0`; her ordinary/S3 RangedAttack configurations have `_waitForProjectileInvalid=0`. These remove all three examined default source-cleanup paths. They may continue ticking after source death/removal, subject to their own lifetime/movement/hit policies.
2. There is real source-bound content: Rope skill 1/2 emit actual HarpoonProjectile prefabs. Harpoon derives LinkProjectile, whose `get_stopWhenSourceInvalid` returns true unconditionally. Projectile.OnTick tests **BattleUtil.ValidAndAlive(source)**, not merely source identity. A dead-but-still-registered source is sufficient to request ordinary Stop before Behaviour advancement. A removed source also fails. Temporary disappearance is not itself included in this alive predicate (parent's presence investigation); do not equate disappearance with source death.
3. `_managedBySource` is a registration/ownership collection policy, not proof of source-lifetime dependence. Init records the projectile in `source.managedProjectiles`; inspected cleanup uses explicit `Action.Nodes.FinishManagedProjectiles` which interrupts the current collection then clears it. Source-bound Rope has `_managedBySource=0`. Therefore these mechanisms cannot be collapsed into a single inferred invariant.
4. Ability/Character cleanup is another independent path. `_clearProjectileWhenDead` opt-in makes Character.ClearAbilities call each Ability.ClearProjectile; ordinary RangedAttack.ClearProjectile interrupts tracked projectiles. Independently, a RangedAttack which waits for projectile invalidity clears them in OnCastEnd unless explicitly exempted. That can end an active tether/skill's projectile without a universal projectile source binding.

## Native build / assets

The same installed GameAssembly.dll / metadata build and parser used in cases 16/17. Assembly SHA256 `583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5`; metadata SHA256 `d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f`.

- Shared projectile bundle: `battle/prefabs/[uc]projectiles.ab`, SHA256 `bfd637cca7e39e239534da33a580bc6a02d8f160a24708466028dee5e32d7b73`.
- Shared skills bundle: `battle/prefabs/[uc]skills.ab`, SHA256 `14306a31b1856f61b25812a69a2a057b7c4634561fb2c2bccc42fb37ee41a27e`.
- Rope character: `charpack/char_236_rope.ab`, SHA256 `0b0ea36ff71ef48238dad89fda2cd5cdcb2266e04bf51753d26e5e46188cf874`.
- Wisdel character: `charpack/char_1035_wisdel.ab`, SHA256 `dab9e0c52a280e2f8042e78cd2b71dcdabb373d92bab2a687f9a7fd57ae03d44`.

Compact witnesses: `witness-projectile-configs.json`, `rope-skills.compact.json`, `char_1035_wisdel.ab.compact.json`, `char_236_rope.ab.compact.json`. Full decoded shared bundles remain under `/tmp/stronghold-projectile-20261021/examples/`.

## A. Source-bound stop exactly checks ValidAndAlive

`Projectile.OnTick [71344] @0x1808d9af0`, `71344-OnTick.asm`:

```text
0x1808d9db1   load virtual slot 42 (class +0x3e0) = stopWhenSourceInvalid
0x1808d9dc3   false -> Behaviour loop at 0x1808d9e36
0x1808d9dc5   copy m_source at projectile+0xf8
0x1808d9ddd   call 0x18449ab40 with GenericMethodInfo285168
0x1808d9de4   true -> Behaviour loop
0x1808d9dfd   load virtual slot 46 (class+0x420) = ExtraCheckToFinish
0x1808d9e0f   false -> Behaviour loop
0x1808d9e16   call Projectile.StopMe[71373]; return before Behaviour loop
```

The same stop path is reached if ordinary projectile time expires and Ability does not have the examined lifetime extension condition. Source death is not a separate elimination event; it invokes normal Stop. ExtraCheckToFinish[71346] defaults true. Parent confirmed GenericMethodInfo285168 -> `BattleUtil.ValidAndAlive<Entity>[78227]`: ObjectPtr.IsValid, fetch current Entity, `Entity.alive` virtual slot40. **This is not ObjectPtr.IsValid itself**. The IsValid generic instance used at registration is GenericMethodInfo280378 ->0x185159fc0. Do not confuse those addresses/names.

`LinkProjectile.get_stopWhenSourceInvalid [71169] @0x1808d3560`:

```text
0x1808d359c mov al,1
0x1808d35a3 ret
```

`BounceProjectile.get_stopWhenSourceInvalid [71101] @0x1808cf900` returns false. `SimpleProjectile.get_stopWhenSourceInvalid [71472] @0x1808e35f0` reads projectile+0x1b2 (`_stopWhenSourceInvalid`). Thus this is a content/type policy, not the common lifecycle's unconditional rule.

## B. Real bound witness: Rope S1 / S2

Shared skills actual emitters:

| Skill GameObject | RangedAttack PathID | projectile key |
|---|---:|---|
| skchr_rope_1 | -1130966464347162232 | projectile_rope_s1 |
| skchr_rope_2 | -6690356152633072640 | projectile_rope_s2 |

Both have `_waitForProjectileInvalid=1`, `_notClearProjectileWhenCastEnd=0`, `_fireAttackFinishWhenProjectileInvalid=1`; the projectile is part of the active pull Ability, not an assumed flag on an unused prefab.

Shared projectiles actual `_logic` components:

| prefab | HarpoonProjectile PathID | HarpoonMovement PathID |
|---|---:|---:|
| projectile_rope_s1_logic | -6398049183091636726 | 8951896940441650698 |
| projectile_rope_s2_logic | -8262687393199105708 | -4107044324282738348 |

Both HarpoonProjectile components have `_managedBySource=0`. Metadata type10750 HarpoonProjectile parent type10756 LinkProjectile; no Harpoon override of stopWhenSourceInvalid. Thus the true getter above is the actual inherited runtime behavior.

There is also direct pull-phase enforcement: `HarpoonProjectile.<DoLink>d__19.MoveNext [71125] @0x1808e3890`, `0x1808e3e34..0x1808e3e78`:

```text
ValidAndAlive(projectile.m_target)  // +0x1b8, call0x18449ab40
ValidAndAlive(projectile.m_source)  // +0xf8, call0x18449ab40
false ->0x1808e3b57 -> StopMe at0x1808e3b5c
```

The common OnTick enforces the dependency while flying; the coroutine also enforces it while pulling. Harpoon.OnProjectileStop[71113] first calls the normal base stop behavior, cleans pull interaction if still applicable, and stops its coroutines (`BattleController.StopAllBattleCoroutines[64745]` at0x1808d13ba). Do not model source death as “destroy without OnStop”.

The actual Rope Character `_clearProjectileWhenDead=0`; source-bound behavior above does not rely on that Character opt-in. The active Ability may independently end and clear due to `_waitForProjectileInvalid=1`; exact first winner depends on scheduler/callback ordering, not a different end contract.

## C. Ordinary independent witnesses

| prefab | SimpleProjectile PathID | source stop | source managed |
|---|---:|---:|---:|
| projectile_crossbow_logic | 5817916136774037088 | 0 | 0 |
| projectile_chr_wisdel_default_logic | 3204693032964126932 | 0 | 0 |
| projectile_chr_wisdel_s3_logic | 8513298565353880937 | 0 | 0 |

Real crossbow emitter `enemy_1003_ncbow` RangedAttack ->projectile_crossbow already closed in case16. Real Wisdel emitters in her character prefab:

- default Attack_A PathID -1978783587831353889 and other default attacks ->projectile_chr_wisdel_default;
- S3 MainAttack PathID -6478552835978072609 ->projectile_chr_wisdel_s3;
- actual Character PathID7220730069727538655 `_clearProjectileWhenDead=0`;
- `_waitForProjectileInvalid=0` in those attacks, so ordinary RangedAttack.OnCastEnd doesn't clear them merely on cast ending.

This proves the inspected native projectile lifecycle does not force these already emitted bullets to die with the source. It is not a promise against a specific external `TryEliminate` / scripted cleanup: those remain valid independent operations.

## D. Managed collection is not an automatic lifetime dependency

`Projectile.Init [71331] @0x1808d7560`, decisive block `0x1808d7c20..0x1808d7d14`:

```text
if (_managedBySource && m_source.IsValid()) {
    m_source.Target.managedProjectiles.Add(ObjectPtr(this));
}
```

The register guard is source **identity only** (`280378@0x185159fc0`), not ValidAndAlive. Entity.get_managedProjectiles is abstract virtual slot54. Character[75909] stores the list in `BattleCharacterData.SharedData.managedProjectiles` (+0x28); Enemy[76321] stores its list at +0x448. Character shared data is persistent deployment data, so the existence of this list itself cannot establish removal semantics.

Raw vtable-reference search artifacts: `virtual-managed-possible-xrefs.json` (candidate list, many are unrelated same displacement; only subsequently disassembled uses are evidence).

`Action.Nodes.FinishManagedProjectiles.Execute [98048] @0x1810ae7f0` explicitly:

```text
GetActionTarget(context, targetSpec).managedProjectiles
for (candidate in list):
    if(candidate.IsValid()): candidate.Target.Interrupt()
list.Clear()
```

Interrupt call at0x1810ae9c6; second getter and Clear at0x1810aea19..0x1810aea4d. `EmitProjectileFromManagedProjectiles[98054]` is another consumer. Thus source management enables Content operations on a group; it is separate from the common alive-dependent stopping check.

Inspection of Entity.OnFinish, Character.OnFinish, Enemy.OnFinish and the raw slot54 refs did not find a common automatic `managedProjectiles -> Interrupt` on source finish. This is a **bounded negative result**, not proof that every special content/Lua path leaves managed projectiles alive. Do not derive generic lifetime binding solely from `_managedBySource=1`.

## E. Ability/Character cleanup is independently configurable

`Entity.OnFinish[66653] @0x1806f8c40` invokes virtual ClearAbilities slot118 at0x1806f9066; Character override `ClearAbilities[75984] @0x180a28870` inlines `_ClearAbilityProjectilesIfNeeded[75985]`:

```text
if (character._clearProjectileWhenDead) { // +0x368
    for (ability in m_abilities): ability.ClearProjectile(); // slot67 +0x570
}
base.ClearAbilities(); // Entity[66639] -> Ability.Detach[63059]
```

Clear's flag is a real source/Character configuration, not unconditional cleanup.

`RangedAttack.OnCastEnd[90822] @0x180ec3fd0` independently gates ClearProjectile:

```text
base.OnCastEnd(...);
if (_waitForProjectileInvalid && !_notClearProjectileWhenCastEnd)
    ClearProjectile();
```

Gate offsets +0x22c/+0x22d. `RangedAttack.ClearProjectile[90823] @0x180ec2f00` traverses its own tracked references, checks reference validity then calls `Projectile.Interrupt[71338]` at0x180ec303a. This is ordinary Stop with callbacks/fallback hit policy from case17, not elimination or raw deletion.

These policies permit content which waits for its projectile to also clean it on cancellation/end. They do not require all ordinary bullets to inherit source lifetime, nor do they prove every source-bound mechanism is only an Ability cancellation side effect.

## Limits

- No claim that all subclasses/content use these same policies.
- No live XLua patch equivalence claim.
- Damage attribution / cached-vs-live attack values are outside this subtask.
- Source becoming spatially absent but alive is distinguished by parent evidence; predicates here don't add that check. Specific content events may independently Clear/Interrupt.
- No public API / Definition / State proposal is made in this report.
