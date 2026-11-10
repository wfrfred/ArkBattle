import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { battle, get } from "../helpers/battle.js";
import { update } from "../../dist/core/battle/unit.js";
import * as units from "../../dist/core/unit/query.js";
import * as targetable from "../../dist/core/unit/capability/targetable/capability.js";
import * as targeting from "../../dist/core/battle/targeting/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { topK } from "../../dist/core/common/collection.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import {
    invisible, invisibleRestriction, untargetable,
    camouflageRestriction, allyUntargetableRestriction,
} from "../../dist/core/effects/visibility.js";

const definition = (side, restrictions = [], taunt = 0) => ({
    id: `targetable-${side}`, hooks: Hooks.empty(), allegiance: { side },
    targetable: { taunt, restrictions },
});
const creation = (side, restrictions, taunt) => ({
    definition: definition(side, restrictions, taunt), position: [0, 0],
});

test("restriction exemptions use effective definition identity without reviving suppressed entries", () => {
    let state = battle([
        creation("ALLY"),
        creation("ENEMY", [{ id: "innate", value: invisibleRestriction }]),
        creation("ENEMY", [
            { id: "hidden", value: invisibleRestriction, group: { id: "visibility", priority: 1 } },
            { id: "camouflage", value: camouflageRestriction, group: { id: "visibility", priority: 2 } },
        ]),
    ]);
    const source = get(state, 0);
    assert.equal(targetable.allowsRestrictions(state, source)(get(state, 2)), false);
    assert.equal(targetable.allowsRestrictions(state, source,
        restriction => restriction === camouflageRestriction)(get(state, 2)), true);
    const target = units.ref(get(state, 1));
    const installed = effects.install(state, target, invisible);
    state = installed.state;
    const visibleToDetector = state => targetable.allowsRestrictions(
        state, source, restriction => restriction === invisibleRestriction,
    )(units.get(state, target));

    assert.equal(visibleToDetector(state), true);
    const independent = effects.install(state, target, untargetable);
    state = independent.state;
    assert.equal(visibleToDetector(state), false);
    assert.equal(targetable.allowsRestrictions(state, source, () => true)(units.get(state, target)), true);
    state = effects.end(state, independent.value);
    assert.equal(visibleToDetector(state), true);
    state = effects.end(state, installed.value);
    assert.equal(targetable.allowsRestrictions(state, source)(units.get(state, target)), false);
    assert.equal(visibleToDetector(state), true);
});

test("visibility distinguishes different sides from hostile sides using the supplied source", () => {
    const state = battle([
        creation("ALLY"),
        creation("NEUTRAL", [{ id: "hidden", value: invisibleRestriction }]),
        creation("NEUTRAL", [{ id: "camouflage", value: camouflageRestriction }]),
        creation("ALLY", [{ id: "ally-free", value: allyUntargetableRestriction }]),
    ]);
    const source = get(state, 0);
    const allows = targetable.allowsRestrictions(state, source);

    assert.equal(allows(get(state, 1)), false);
    assert.equal(allows(get(state, 2)), true);
    assert.equal(allows(get(state, 3)), false);
});

test("ordinary taunt comparison uses signed integer attributes after contribution changes", () => {
    let state = battle([creation("ENEMY", [], -1), creation("ENEMY", [], 0)]);
    const target = units.ref(get(state, 0));
    const preferred = state => topK(units.all(state).filter(targetable.hasTargetable), 1, targeting.taunt(state))[0].id;

    assert.equal(preferred(state), 1);
    state = update(state, target, targetable.setTauntContribution({
        id: "taunt", value: [modifier({ addition: 2 })],
    }));
    assert.equal(preferred(state), 0);
});
