# Effect-sensitive target selection: native fallback audit

Read-only 2026-10-21. No repository source modified.

## Confirmed result

There is a real **selection-stage exclusion based on an effect's immunity**, not merely rejection when attaching the effect: Iris S2 uses the sleep-immune-excluding filter with a 2-target limit; Kafka S1 uses the same filter without a target-number limit. Their exact prefab chain is recorded by the separate content audit in ../content/REPORT.md. Parsed witnesses: ../content/sleep-skills.json and ../content/iris-s2-projectiles.json. This demonstrates that a unit can remain eligible for ordinary attack yet be ineligible for this sleep selection. Sleep immunity does not globally make that unit untargetable.

This is **not** a general rule that every effect-emitting attack must exclude immune units. Content explicitly chooses the special filter. The decision also is not evidence that a concrete Effect Definition ID must be part of every TargetRequest: native's special filter reads shared sleep-immunity state directly, not a requested buff ID.

## Actual content closure

- Iris S2 `RangedAttack` PathID -370435481658135158 points at `AdvancedSelector` 2841671250638531978, `_postFilter=31`, `_limitTargetNum=1`, `_maxNum=2`; projectile key `projectile_chr_iris_s2_1`. That projectile controller end-extra-buff `iris_s_2[sleep]` declares `abnormalCombos:[0]` (SLEEPING). The 2 slots are therefore sleep recipients, not a merely coincidental selector somewhere in the bundle.
- Kafka S1 sleep child Ability PathID5889527310525842887 uses its own selector31 and active sleep combo buff. The later damage Selector5168085173266269639 uses `_postFilter=0` instead; the control eligibility is not a blanket exclusion from the damage query.

## Reproducible native evidence

Installed GameAssembly.dll / metadata build and hashes are the same baseline as previous Projectile/Targeting studies. C# metadata and compiled native fallback inspected; runtime XLua replacements not executed/audited.

- `enums.json`: compressed signed metadata enum values decoded correctly. `FilterType.HATRED_DES_IMMUNE_SLEEPING_EXCLUDE=31`, `HATRED_DES_SLEEPING_LAST_EXCLUDE_SLEEP_IMMUNE=73`, `AbnormalCombo.SLEEPING=0`.
- `AdvancedSelector.OnPostFilter` [74238] @0x1809c34f0:
  - 0x1809c371d calls `get_maxTargetNum`.
  - 0x1809c372b reads configured post-filter enum at instance+0xbc.
  - 0x1809c3754 calls `FilterUtil.Filter` [74633] with list, source, max count, enum.
- `FilterUtil._CreateFilterFuncs` [74636] @0x1809d9890:
  - 0x1809d9d98 binds method [74679] into a FilterFunc.
  - 0x1809d9db6 registers it with key 0x1f (31).
- `FilterUtil._Filter_HatredDesExcludeImmuneSleeping` [74679] @0x1809dd850:
  - 0x1809dd8d4 obtains target.attributes.
  - 0x1809dd8e5 sets edx=0 (SLEEPING).
  - 0x1809dd8ea calls `Attributes.CheckAbnormalComboImmune` [64293].
  - If immune, 0x1809dd8f1 branches to0x1809dd950, then returns false at0x1809dd971.
  - Otherwise it returns current hatred-derived weight with true at0x1809dd93e.
- `Attributes.CheckAbnormalComboImmune` [64293] @0x180648860 checks the current combo immunity counter>0 (0x1806488af..8ba). This is a dynamic target attribute query, not a duplicate independent immunity decision.
- `FilterUtil.Filter` [74633] @0x1809d8270 resolves the enum's registered FilterFunc and invokes generic body [74619] at0x1844f9140 (call0x1809d8586). Proof matching closed generic specs/table addresses is `generic-filter-proof.json`, reused from previous sort investigation.
- Closed generic Filter body `1844f9140.asm`:
  -0x1844f9386 calls FilterFunc.
  -0x1844f938b branches directly to next candidate0x1844f94df when false.
  - accepted candidate only then reaches heap insert0x1844f946f and k pruning0x1844f949b.
  - Therefore an immune unit does **not** consume one of Iris's two selected target slots. This is not select-two-then-let-install-fail.
- The sibling filter [74678] @0x1809de2d0 also checks sleep immunity first (0x1809de372), returns false if immune and otherwise assigns sleeping-last priority. Actual regular-mode prefab usage of73 has not been established; do not cite its mere existence as content evidence.

Simplified confirmed selection:

```text
candidate accepted by ordinary selector qualifications
  -> special sleep filter reads current sleep immunity
  -> immune: discard candidate
  -> nonimmune: assign hatred weight and compete for k slots
  -> cast/attach sleep only to selected results
```

## Architectural consequence

The behavior to support is **explicit effect-aware eligibility in particular queries**, reusing the same dynamic immunity fact as application/effective-state logic. It does not justify putting all immunity into Targetable or globally applying the rule to attack+CC. A general EFFECT-purpose union is one possible transport if a restriction needs request-specific mechanism identity, but this native witness can be expressed by a composed Filter that reads sleep immunity. Whether stronger generic effect identity is needed should be decided from other witnesses, not assumed from this one.
