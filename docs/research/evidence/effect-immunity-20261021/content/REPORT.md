# Effect recipient selection: installed content witnesses

Read-only prefab research, 2026-10-21. No repository source files changed. Decoded installed Windows prefab data using `/tmp/stronghold-target-sort-20261020/steward/decode_prefab.py` and its MonoScript map. These are actual serialized content configurations, not invented examples. Compiled native runtime/XLua policies still need the separate native audit to establish execution semantics.

## Direct conclusions

1. Non-damage Effect/buff recipient selection definitely exists in ordinary content: Shining S3 DEF aura, Nightingale S3 RES aura, Sora S2 inspiration aura; Sora S1 is a pure sleep aura.
2. Pure Effect selection is not uniformly equivalent to applying a damage filter or a healing filter. These aura validators all serialize `purposeMask=0`. This is a serialized value, not proof that every inherited/runtime purpose getter must be NONE.
3. Rejecting immune candidates **before limited target selection** is a real requirement: Iris S2 selects up to two non-sleep-immune candidates with postFilter31. Kafka S1 separately filters sleep recipients while its final damage selection does not use that filter.
4. Inspiration exclusion is a concrete target-selection policy based on target's current marker buff. It is not evidence for a generic Effect-install rejection check. The corresponding `immune_to_encourage` recipient marker is an empty passive buff with no abnormal immunity or attribute entries.
5. None of the inspected configurations carries an Effect Definition ID inside an ActionPurpose value. The actual selective policies are in a particular Validator / Selector configuration. These observations prove the need for selective Effect recipient eligibility; they do not by themselves force an `EFFECT {id}` branch in Stronghold's Request.

## A. Ordinary friendly auras and pure sleep aura

Source `[uc]skills.ab`, SHA256 `14306a31b1856f61b25812a69a2a057b7c4634561fb2c2bccc42fb37ee41a27e`.

| Content | Aura component PathID | Recipient buff | Validator PathID/class | Serialized purposeMask |
| --- | --- | --- | --- | --- |
| Shining S3 | 6210041310238912188 | `shining_s_3`, DEF modifier attr2/multiplier | -8827125961675076 / TargetValidator | 0 |
| Nightingale S3 | -8853210920096810818 | `cgbird_s_3[aura]`, RES modifier attr3/multiplier + `evade_magic` | -4566202139154761538 / TargetValidator | 0 |
| Sora S1 | -7622432885456742050 | `sora_s_1[aura]`, abnormalCombos[0] (sleep) | -1251798691132778146 / TargetValidator | 0 |
| Sora S2 | -7308068566113856829 | `sora_s_2[atk]`, `atk_to_atk[final_addition]` | -3025117199833640253 / FilterBuffTargetValidator | 0 |
| Skadi2 S2 | -6666251460559444500 | `skadi2_s_2[atk]` and `[def]` | -7512364938149960212 / FilterBuffTargetValidator | 0 |
| Skadi2 S3 | 6203907274112914333 | `skadi2_s_3[atk]` | 1941110442584658845 / FilterBuffTargetValidator | 0 |

All are actual AuraAbility `_targetValidator` references. Friendly auras use targetSide1, sleep uses targetSide2. Sora2 / Skadi2 inspiration validators additionally serialize `ignoreTargetFree=1`, `ignoreAllyTargetFree=1`; plain Shining/Nightingale/Sora1 validators serialize 0 for these. This reinforces that aura does not imply one universal target policy.

## B. Inspiration marker and selection chain

The three inspiration FilterBuffTargetValidator instances above have:

```json
{
  "_excludeKey": 1,
  "_buffs": ["immune_to_encourage"],
  "_filterBuffSource": 0,
  "_hostAsTarget": 0
}
```

The root native audit independently closes this validator into TargetValidator.Validate followed by Entity.CheckOneOfFilterBuffs / CheckOneOfFilterBuffsFromCertainSource. Thus the marker check is based on existing recipient buffs, rather than asking whether the incoming inspiration Effect may be installed.

Marker sources in actual recipients:

- `char_101_sora.ab`: Character PathID486200139143654937 `_commonAbilities` directly includes PassiveBuffAbility8239291566128246297 at `char_101_sora/Others/PassiveAbilities/ImmuneToEncourage`.
- `char_1012_skadi2.ab`: Character PathID-3662291628995893316 `_commonAbilities` directly includes PassiveBuffAbility-3551814154833287236 at `char_1012_skadi2/PassiveAbilities/ImmuneToEncourage`.
- Both PassiveBuffAbility configs install `buffKey=immune_to_encourage`, `templateKey=empty`, `loadFromDB=0`, lifetimeType2; abnormalFlags / abnormalImmunes / abnormalAntis / abnormalCombos / abnormalComboImmunes / attributeModifiers are all empty.

This supports the interpretation of a marker used by selection. We have **not** exhaustively searched for hardcoded native/XLua consumers of this buff key; do not claim that no application code anywhere checks it.

## C. Iris S2: immune candidates do not consume the two target slots

Actual path in skills prefab:

```text
skchr_iris_2 RangedAttack PathID -370435481658135158
    _selector -> AdvancedSelector PathID2841671250638531978
        _postFilter=31 (HATRED_DES_IMMUNE_SLEEPING_EXCLUDE)
        _limitTargetNum=1
        _maxNum=2, _maxTargetKey=max_target
        _targetSide=2, _targetMotion=3, _targetCategory=1
    _selectTargetSource=1 (FROM_OWNER)
    _projectileKey=projectile_chr_iris_s2_1
    _atkScale=0
```

The referenced projectile is present in `[uc]projectiles.ab`, SHA256 `bfd637cca7e39e239534da33a580bc6a02d8f160a24708466028dee5e32d7b73`:

- `SimpleProjectile` -4667220423960849574 (logical counterpart1147482224892878934).
- `_actionController._extraBuffsInTheEnd[0]`: `buffKey=iris_s_2[sleep]`, `attributes.abnormalCombos=[0]`, `templateKey=iris_s_2`, `durationKey=sleep`.
- A second countdown buff controls the later explosion logic. Initial selector's explicit immunity exclusion is not simply a generic restriction against all later damage from the skill.

The selection native audit confirms mode31 delegate74679 rejects sleep-immune candidates before top-k insertion. Therefore this configuration has observable behavior: it can choose another eligible enemy instead of spending one of two selection slots on an immune enemy. Final max_target comes from the configured BB key when present; `_maxNum=2` is the serialized default.

## D. Kafka S1: one skill uses different filters for sleep and final damage

```text
skchr_kafka_1 AbilityParallelGroup -5367884313813662265
    _abilities -> AnimatedActionToTargetAbility5889527310525842887
                  (skchr_kafka_1/ApplySleeping)
        _selector -> AdvancedSelector -632599811205511737
                     (skchr_kafka_1/ApplySleeping/Trigger)
            _postFilter=31
            _limitTargetNum=0
        _activeBuffs[0]=kafka_s_1[sleep]
            abnormalCombos=[0]
            templateKey=empty
            loadFromDB=0
```

Final damage is separate `MeleeAttack` -6310533032844802617 (`skchr_kafka_1/FinalAttack`), with Selector5168085173266269639 using `_postFilter=0` and no limit. Therefore being sleep-immune is not globally equivalent to being an invalid damage target for this skill.

Full skills scan found two mode31 selectors (Iris2, Kafka1), zero mode73 selectors. This count is **only this shared skills bundle**, not all character/token/dynamic/enemy prefabs. Do not generalize it to the entire game.

## Evidence files

- `selected-witnesses.json`: compact selected component configurations with source bundle path and hash, including recipient marker source and Character reference.
- `skill-witnesses.json`: broader aura/Erato/Blacknight configuration extracts.
- `sleep-skills.json`: full relevant Iris2/Kafka1 component configurations.
- `iris-s2-projectiles.json`: all Iris S2 projectile component configurations.
- `sora-character.json`, `skadi2-character.json`: complete decoded character bundles.

No new API, types, tests, or source changes were made in this audit.
