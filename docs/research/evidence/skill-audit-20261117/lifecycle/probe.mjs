// Project expression probe, not a native battle or implemented Lessing content.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { battle, get } from "../../../../../test/helpers/battle.js";
import { ref } from "../../../../../dist/core/unit/index.js";
import * as skills from "../../../../../dist/core/unit/skill/index.js";
import * as effects from "../../../../../dist/core/unit/effect/index.js";
import { stun } from "../../../../../dist/core/effects/control.js";
import { Hooks } from "../../../../../dist/core/hook.js";
import { parseArknightsSkillLevel } from "../../../../../dist/data/skill/operator.js";

const evidence = JSON.parse(readFileSync(new URL("result.json", import.meta.url), "utf8"));
const raw = JSON.parse(readFileSync(evidence.provenance.mirror.inputs[1].path, "utf8"));
const parsed = parseArknightsSkillLevel(raw.skchr_lessng_3, 10);
let acceptsCalls = 0;
const definition = {
    ...parsed.definition,
    activation: {
        ...parsed.definition.activation,
        accepts: () => { acceptsCalls++; return true; },
    },
};
let state = battle([{ definition: {
    id: "lessing-qualification-only", hooks: Hooks.empty(),
    skill: { initialize: current => skills.create(current, definition) },
}, position: [0, 0] }]);
const host = ref(get(state, 0));
state = skills.modify(state, host, 10).state;
assert.equal(get(state, 0).skill.sp.value, 40);
const installed = effects.install(state, host, stun, { expiration: { type: "DEADLINE", tick: 100 } });
const attempted = skills.activate(installed.state, skills.ref(host, definition));
assert.equal(attempted.value, null);
assert.equal(acceptsCalls, 0);
assert.equal(get(attempted.state, 0).skill.sp.value, 40);
assert.equal(effects.get(attempted.state, installed.value).lifecycle, "ACTIVE");
const cleared = effects.end(attempted.state, installed.value);
const after = skills.activate(cleared, skills.ref(host, definition));
assert.notEqual(after.value, null);
assert.equal(acceptsCalls, 1);
assert.equal(get(after.state, 0).skill.sp.value, 0);
const files = [
    "src/core/unit/skill/operations.ts", "src/core/effects/control.ts",
    "dist/core/unit/skill/operations.js", "dist/core/effects/control.js",
];
console.log(JSON.stringify({
    provenance: {
        checkedOn: "2026-11-17",
        scope: "Project public API expression; not implemented Lessing gameplay or native execution",
        inputs: files.map(path => {
            const data = readFileSync(new URL(`../../../../../${path}`, import.meta.url));
            return { path, bytes: data.length, sha256: createHash("sha256").update(data).digest("hex") };
        }),
    },
    result: {
        skillId: definition.id,
        whileStunned: { activated: false, sp: 40, acceptsCalled: false, stunRetained: true },
        afterEndingStun: { activated: true, sp: 0 },
    },
}, null, 2));
