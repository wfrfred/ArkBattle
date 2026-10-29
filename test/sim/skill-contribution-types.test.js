import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Skill contributions cover recovery attributes and ammunition while resource configuration stays separate", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-skill-contributions-"));
    const source = (name) => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "contributions.mts");
    try {
        writeFileSync(path, `
import * as attribute from ${source("unit/contribution/attribute")};
import type { Input } from ${source("unit/contribution/contribution")};
import type { State as BattleState } from ${source("battle/state")};
import type { Unit } from ${source("unit/unit")};
import type { Skill, State } from ${source("unit/capability/skill/capability")};
import type { Offense } from ${source("unit/capability/offense/capability")};
import * as capability from ${source("unit/capability/skill/capability")};
import { setAmmoContribution } from ${source("unit/capability/skill/capability")};
import * as sp from ${source("unit/skill/sp")};
import type { Modifier as AmmoModifier } from ${source("unit/skill/ammo")};
declare const state: State;
declare const resource: sp.State;
declare const uncertainKey: "capacity" | "recoverySpeed";
const dynamic: Input<attribute.Modifier, Unit & Skill> = (battle, self) => {
    const fact: BattleState = battle;
    const host: Unit & Skill = self;
    return host.skill.activation === null ? [] : [attribute.create({ addition: fact.tick })];
};
const fixed: Input<attribute.Modifier, Unit & Skill> = [attribute.create({ addition: 2 })];
const ammunition: readonly AmmoModifier[] = [{ addition: 2, ratio: 0.5 }];
const legacyProgram = { priority: 0, apply: (_battle: BattleState, _self: Unit & Skill, current: number) => current };
declare const wrongHost: (battle: BattleState, self: Unit & Offense) => readonly attribute.Modifier[];
declare const wrongAmmoHost: (battle: BattleState, self: Unit & Offense) => readonly AmmoModifier[];
sp.setContribution(resource, "recoverySpeed", { id: "speed", value: dynamic });
sp.setContribution(resource, "recoveryMultiplier", { id: "fixed", value: fixed });
sp.setContribution(resource, "recoveryMultiplier", { id: "ratio", value: (battle, self) => [attribute.create({ finalScaler: self.skill.activation === null ? 1 : battle.tick })] });
setAmmoContribution(state, { id: "ammo", value: ammunition });
setAmmoContribution(state, { id: "live-ammo", value: (battle, self) => [{ addition: battle.tick, ratio: self.skill.activation === null ? 0 : 0.5 }] });
// @ts-expect-error resource capacity is configuration, not a contribution parameter.
sp.setContribution(resource, "capacity", { id: "wrong", value: dynamic });
// @ts-expect-error activation requirement is configuration, not a contribution parameter.
sp.setContribution(resource, "requirement", { id: "wrong", value: fixed });
// @ts-expect-error activation payment is configuration, not a contribution parameter.
sp.setContribution(resource, "cost", { id: "wrong", value: dynamic });
// @ts-expect-error a key must prove it is one of the two recovery attributes.
sp.setContribution(resource, uncertainKey, { id: "wrong", value: dynamic });
// @ts-expect-error removed configuration parameters cannot be removed from a contribution registry.
sp.removeContribution(resource, "capacity", "wrong");
// @ts-expect-error SP state has no capacity contribution registry.
resource.capacity;
// @ts-expect-error SP state has no requirement contribution registry.
resource.requirement;
// @ts-expect-error SP state has no payment contribution registry.
resource.cost;
// @ts-expect-error TIME budgets no longer have a persistent contribution setter.
capability.setDurationContribution(state, { id: "wrong", value: dynamic });
// @ts-expect-error TIME budgets no longer have a persistent contribution remover.
capability.removeDurationContribution(state, "wrong");
// @ts-expect-error recovery inputs require lists rather than a single modifier.
sp.setContribution(resource, "recoverySpeed", { id: "wrong", value: attribute.create() });
// @ts-expect-error ammunition inputs require lists rather than a single modifier.
setAmmoContribution(state, { id: "wrong", value: { addition: 2, ratio: 0.5 } });
// @ts-expect-error recovery data inputs do not accept ordered parameter programs.
sp.setContribution(resource, "recoveryMultiplier", { id: "wrong", value: legacyProgram });
// @ts-expect-error ammunition data inputs do not accept ordered parameter programs.
setAmmoContribution(state, { id: "wrong", value: legacyProgram });
// @ts-expect-error recovery callbacks cannot require an Offense host when only Skill is guaranteed.
sp.setContribution(resource, "recoverySpeed", { id: "wrong", value: wrongHost });
// @ts-expect-error ammunition callbacks receive Skill hosts rather than Offense hosts.
setAmmoContribution(state, { id: "wrong", value: wrongAmmoHost });
// @ts-expect-error ammunition modifier data cannot be used for a recovery attribute.
sp.setContribution(resource, "recoveryMultiplier", { id: "wrong", value: ammunition });
// @ts-expect-error ammunition does not accept attribute modifier data.
setAmmoContribution(state, { id: "wrong", value: [attribute.create()] });
// @ts-expect-error ammunition payloads cannot be applied as attribute modifiers.
attribute.apply(10, [{ addition: 2, ratio: 0.5 }]);
`);
        const program = ts.createProgram([path], {
            noEmit: true, strict: true, exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true, target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
            skipLibCheck: true, types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
