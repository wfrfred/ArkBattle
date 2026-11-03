import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import * as targetable from "../../dist/core/unit/capability/targetable/capability.js";
import * as units from "../../dist/core/unit/query.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import {
    invisible,
    invisibleRestriction,
    invisibilityKind,
    camouflageRestriction,
    untargetableRestriction,
    allyUntargetableRestriction,
} from "../../dist/content/effects/visibility.js";
import { healFreeRestriction } from "../../dist/content/effects/protection.js";
import { initialize, baseUnit, fixtureBattle } from "../helpers/unit.js";
import { effectFixtureWork } from "../helpers/effects.js";

const owner = (id = 2, side = "ENEMY", restrictions = []) => initialize({
    id,
    position: [0, 0],
    definition: { hooks: Hooks.empty(),
        id: `targetable-${id}`,
        allegiance: { side },
        targetable: { restrictions },
    },
});
const request = (source, purposes = ["DAMAGE"]) => ({
    source: units.ref(source),
    purposes,
    filter: () => true,
    selector: (state, _request, candidates) => ({ state, value: candidates.map(units.ref) }),
});
const restriction = (kind, allows = () => false) => ({ kind, allows });


test("Targetable initialization rejects different contributions with the same ID", () => {
    const first = { id: "duplicate", value: invisibleRestriction };
    const second = { id: "duplicate", value: untargetableRestriction };
    const definition = { restrictions: Object.freeze([first, second]) };

    assert.throws(
        () => targetable.initialize(fixtureBattle(), baseUnit({ id: "targetable", hooks: Hooks.empty(), targetable: definition })),
        { name: "TypeError", message: "duplicate targetable restriction identity: duplicate" },
    );
    assert.deepEqual(definition.restrictions, [first, second]);
});


test("query exemption applies after exclusive group resolution without reviving the suppressed limit", () => {
    const hidden = Symbol("hidden");
    const suppressed = Symbol("suppressed");
    let calls = 0;
    const target = owner(2, "ENEMY", [
        { id: "low", value: restriction(suppressed, () => { calls++; return false; }), group: { id: "one", priority: 1 } },
        { id: "high", value: restriction(hidden), group: { id: "one", priority: 2 } },
    ]);
    const source = owner(1, "ALLY");
    const battle = effectFixtureWork(source, target);

    assert.equal(targetable.allowsRestrictions(battle, request(source), target), false);
    assert.equal(targetable.allowsRestrictions(battle, request(source), target, kind => kind === hidden), true);
    assert.equal(calls, 0);
    assert.equal(targetable.allowsRestrictions(battle, request(source), target), false);
});

test("exempting a mechanism ignores all of its instances but preserves independent restrictions", () => {
    const source = owner(1, "ALLY");
    let target = owner(2, "ENEMY", [
        { id: "innate", value: invisibleRestriction },
        { id: "effect-a", value: invisibleRestriction },
        { id: "effect-b", value: invisibleRestriction },
    ]);
    let battle = effectFixtureWork(source, target);
    const input = request(source);

    assert.equal(targetable.allowsRestrictions(battle, input, target, kind => kind === invisibilityKind), true);
    assert.equal(targetable.allowsRestrictions(battle, input, target), false);
    battle = applyUnitChanges(battle, [targetable.setRestriction(units.ref(target), { id: "other", value: untargetableRestriction })]);
    target = units.get(battle, units.ref(target));
    assert.equal(targetable.allowsRestrictions(battle, input, target, kind => kind === invisibilityKind), false);
});

test("restriction callbacks receive the actual request, current battle and owner", () => {
    const source = owner(1, "ALLY");
    const input = request(source, []);
    let received;
    const target = owner(2, "ENEMY", [{
        id: "capture",
        value: restriction(Symbol("capture"), (...args) => { received = args; return true; }),
    }]);
    const battle = effectFixtureWork(source, target);

    assert.equal(targetable.allowsRestrictions(battle, input, target), true);
    assert.deepEqual(received, [battle, { request: input, owner: target }]);
    assert.equal(targetable.allowsRestrictions(battle, input, owner(3)), true);
});

test("visibility content distinguishes different sides from hostile sides independently of Purpose", () => {
    const ally = owner(1, "ALLY");
    const neutral = owner(2, "NEUTRAL");
    const enemy = owner(3, "ENEMY");
    const battle = effectFixtureWork(ally, neutral, enemy);

    for (const purposes of [[], ["DAMAGE"], ["HEAL"], ["ELEMENT_DAMAGE", "ELEMENT_HEAL"], ["EFFECT"]]) {
        const input = request(ally, purposes);
        assert.equal(invisibleRestriction.allows(battle, { request: input, owner: neutral }), false);
        assert.equal(untargetableRestriction.allows(battle, { request: input, owner: neutral }), false);
        assert.equal(camouflageRestriction.allows(battle, { request: input, owner: neutral }), true);
        assert.equal(camouflageRestriction.allows(battle, { request: input, owner: enemy }), false);
        assert.equal(invisibleRestriction.allows(battle, { request: input, owner: ally }), true);
        assert.equal(allyUntargetableRestriction.allows(battle, { request: input, owner: ally }), false);
        assert.equal(allyUntargetableRestriction.allows(battle, { request: input, owner: enemy }), true);
    }
});

test("heal-free content only restricts requests explicitly containing HEAL", () => {
    const source = owner(1, "ALLY");
    const target = owner(2, "ALLY", [{ id: "heal-free", value: healFreeRestriction }]);
    const battle = effectFixtureWork(source, target);

    assert.equal(targetable.allowsRestrictions(battle, request(source, ["HEAL"]), target), false);
    assert.equal(targetable.allowsRestrictions(battle, request(source, ["DAMAGE", "HEAL"]), target), false);
    assert.equal(targetable.allowsRestrictions(battle, request(source, ["ELEMENT_HEAL"]), target), true);
    assert.equal(targetable.allowsRestrictions(battle, request(source, ["EFFECT"]), target), true);
    assert.equal(targetable.allowsRestrictions(battle, request(source, []), target), true);
});

test("independent visibility effects preserve innate restrictions throughout their lifecycles", () => {
    const source = owner(1, "ALLY");
    const target = owner(2, "ENEMY", [{ id: "innate", value: invisibleRestriction }]);
    const initial = effectFixtureWork(source, target);
    const first = effects.install(initial, units.ref(target), invisible);
    const second = effects.install(first.state, units.ref(target), invisible);
    const installed = units.get(second.state, units.ref(target));

    assert.equal(installed.targetable.restrictions.length, 3);
    const disabled = effects.setEnabled(second.state, first.value, false);
    assert.equal(units.get(disabled, units.ref(target)).targetable.restrictions.length, 2);
    const ended = effects.end(disabled, second.value);
    const current = units.get(ended, units.ref(target));
    assert.deepEqual(current.targetable.restrictions, target.targetable.restrictions);
    assert.equal(targetable.allowsRestrictions(ended, request(source), current), false);
    assert.equal(targetable.allowsRestrictions(ended, request(source), current, kind => kind === invisibilityKind), true);
    assert.equal(units.get(initial, units.ref(target)).targetable.restrictions.length, 1);
});
