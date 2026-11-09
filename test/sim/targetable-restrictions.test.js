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
    invisible, invisibleRestriction, invisibilityKind,
    camouflageRestriction, camouflageKind, allyUntargetableRestriction,
} from "../../dist/core/effects/visibility.js";

const definition = (side, restrictions = [], taunt = 0) => ({
    id: `targetable-${side}`, hooks: Hooks.empty(), allegiance: { side },
    targetable: { taunt, restrictions },
});
const creation = (side, restrictions, taunt) => ({
    definition: definition(side, restrictions, taunt), position: [0, 0],
});

test("mechanism exemption follows Contribution competition without reviving a suppressed restriction", () => {
    const state = battle([
        creation("ALLY"),
        creation("ENEMY", [
            { id: "hidden", value: invisibleRestriction, group: { id: "visibility", priority: 1 } },
            { id: "camouflage", value: camouflageRestriction, group: { id: "visibility", priority: 2 } },
        ]),
    ]);
    const source = get(state, 0);
    const owner = get(state, 1);

    assert.equal(targetable.allowsRestrictions(state, source, ["DAMAGE"])(owner), false);
    assert.equal(targetable.allowsRestrictions(state, source, ["DAMAGE"], kind => kind === camouflageKind)(owner), true);
});

test("all instances of an exempt mechanism are skipped while independent restrictions and innate sources remain", () => {
    let state = battle([
        creation("ALLY"),
        creation("ENEMY", [{ id: "innate", value: invisibleRestriction }]),
    ]);
    const source = get(state, 0);
    const target = units.ref(get(state, 1));
    const installed = effects.install(state, target, invisible);
    state = installed.state;
    const visibleToDetector = state => targetable.allowsRestrictions(
        state, source, ["DAMAGE"], kind => kind === invisibilityKind,
    )(units.get(state, target));

    assert.equal(visibleToDetector(state), true);
    state = update(state, target, targetable.setRestriction({ id: "independent", value: camouflageRestriction }));
    assert.equal(visibleToDetector(state), false);
    state = update(state, target, targetable.removeRestriction("independent"));
    state = effects.end(state, installed.value);
    assert.equal(targetable.allowsRestrictions(state, source, ["DAMAGE"])(units.get(state, target)), false);
    assert.equal(visibleToDetector(state), true);
    state = update(state, target, targetable.removeRestriction("innate"));
    assert.equal(targetable.allowsRestrictions(state, source, ["DAMAGE"])(units.get(state, target)), true);
});

test("visibility distinguishes different sides from hostile sides using the supplied source", () => {
    const state = battle([
        creation("ALLY"),
        creation("NEUTRAL", [{ id: "hidden", value: invisibleRestriction }]),
        creation("NEUTRAL", [{ id: "camouflage", value: camouflageRestriction }]),
        creation("ALLY", [{ id: "ally-free", value: allyUntargetableRestriction }]),
    ]);
    const source = get(state, 0);
    const allows = purpose => targetable.allowsRestrictions(state, source, [purpose]);

    assert.equal(allows("DAMAGE")(get(state, 1)), false);
    assert.equal(allows("DAMAGE")(get(state, 2)), true);
    assert.equal(allows("DAMAGE")(get(state, 3)), false);
});

test("ordinary taunt comparison uses signed integer attributes after contribution changes", () => {
    let state = battle([creation("ENEMY", [], 0), creation("ENEMY", [], -1)]);
    const target = units.ref(get(state, 1));
    const preferred = state => topK(units.all(state).filter(targetable.hasTargetable), 1, targeting.taunt(state))[0].id;

    assert.equal(preferred(state), 0);
    state = update(state, target, targetable.setTauntContribution({
        id: "taunt", value: [modifier({ addition: 2 })],
    }));
    assert.equal(targetable.resolveTaunt(state, units.get(state, target)), 1);
    assert.equal(preferred(state), 1);
    state = update(state, target, targetable.setTauntContribution({
        id: "taunt", value: [modifier({ addition: -1 })],
    }));
    assert.equal(targetable.resolveTaunt(state, units.get(state, target)), -2);
    assert.equal(preferred(state), 0);
    state = update(state, target, targetable.removeTauntContribution("taunt"));
    assert.equal(targetable.resolveTaunt(state, units.get(state, target)), -1);
});
