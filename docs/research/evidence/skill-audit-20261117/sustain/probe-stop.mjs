// Project expression probe using the real Melantha factory; not native execution.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { prepare } from "../../../../../dist/data/unit/operator.js";
import { create } from "../../../../../dist/content/operators/melantha/unit.js";
import { battle, get } from "../../../../../test/helpers/battle.js";
import * as units from "../../../../../dist/core/unit/index.js";
import * as skills from "../../../../../dist/core/unit/skill/index.js";
import { resolveAttack } from "../../../../../dist/core/unit/capability/offense/index.js";

const root = new URL("../../../../../", import.meta.url);
const fixture = "test/fixtures/arknights/main-mode-units.json";
const data = JSON.parse(readFileSync(new URL(fixture, root)));
const profile = prepare(
    { id: "char_208_melan", record: data.characters.char_208_melan },
    data.skills["skcom_atk_up[1]"],
    { elite: 1, level: 55, potential: 6, skillIndex: 0, skillLevel: 7, trust: 100 },
    { ranges: data.ranges, favor: data.favor },
);
let state = battle([{
    definition: create(profile),
    position: [0, 0],
    initial: {
        occupancy: { tile: [0, 0], direction: "RIGHT" },
        facing: { direction: "RIGHT" },
    },
}]);
const host = units.ref(get(state, 0));
const before = resolveAttack(state, get(state, 0));
state = skills.modify(state, host, 40).state;
const started = skills.activate(state, skills.ref(host, get(state, 0).skill.definition));
assert.notEqual(started.value, null);
state = started.state;
const active = resolveAttack(state, get(state, 0));
const stopped = skills.operate(state, started.value, "STOP");
assert.equal(stopped.value, true);
assert.equal(get(stopped.state, 0).skill.activation, null);
assert.equal(resolveAttack(stopped.state, get(stopped.state, 0)), before);
console.log(JSON.stringify({
    provenance: {
        checkedOn: "2026-11-17",
        scope: "Project public API and production Content; not native execution",
        inputs: [fixture, "src/content/operators/melantha/unit.ts", "src/core/unit/skill/operations.ts"].map(path => {
            const bytes = readFileSync(new URL(path, root));
            return { path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
        }),
    },
    result: {
        skillId: profile.skill.definition.id,
        tick: stopped.state.tick,
        stopAccepted: stopped.value,
        activationRemoved: get(stopped.state, 0).skill.activation === null,
        attack: { before, active, afterStop: resolveAttack(stopped.state, get(stopped.state, 0)) },
    },
}, null, 2));
