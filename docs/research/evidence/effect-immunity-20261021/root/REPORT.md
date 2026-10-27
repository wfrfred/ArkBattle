# Buff-key target validator: native audit

Read-only research, 2026-10-21. No source changes. Native C# fallback inspected; live XLua replacement not executed.

`FilterBuffTargetValidator.Validate` [75545] @ `0x180a129d0` first calls ordinary `TargetValidator.Validate` [75667] at `0x180a12a3c`. It then resolves the target Unit (with an optional host substitution; that substitution is not required by the cited Aura witnesses).

- `_filterBuffSource=false`: at `0x180a12b53`, calls `Entity.CheckOneOfFilterBuffs` [66604].
- `_filterBuffSource=true`: obtains validator owner, then at `0x180a12b3e` calls `Entity.CheckOneOfFilterBuffsFromCertainSource` [66605].
- `_excludeKey` at `0x180a12b66` negates the membership result.

`Entity.CheckOneOfFilterBuffs` [66604] @ `0x1806f0d40` iterates configured keys and calls `BuffContainer.ContainsBuff` [65336] at `0x1806f0e6d`; returns true if any key is present. This is an existing-Buff membership test, not a trial installation or a request containing the incoming Buff ID.

The actual Sora / Skadi Aura configuration and passive marker origin are in `../content/REPORT.md`. Their `immune_to_encourage` key is a content marker used by this validator. The marker's empty Buff configuration does not itself declare abnormal immunity or Anti. Therefore the proven mechanism is an explicit content selection restriction, not evidence that generic Effect installation rejects every requested encourage Effect.

Relevant field offsets are saved in `filter-validator-fields.json`; raw methods are adjacent `.asm` files. The optional host substitution, arbitrary special validators, runtime hotfixes and all global consumers of the marker key are outside this narrowly verified claim.
