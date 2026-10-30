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
import { initialize, fixtureBattle } from "../helpers/unit.js";
import { effectFixtureWork } from "../helpers/effects.js";

const owner = (id = 2, side = "ENEMY", restrictions = []) => initialize({
    id,
    position: [0, 0],
    definition: { hooks: [],
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

test("Targetable initializes innate restrictions in a new container while sharing immutable entries", () => {
    const entry = { id: "native-invisibility", value: invisibleRestriction };
    const second = { id: "another-invisibility", value: invisibleRestriction };
    const definition = { restrictions: Object.freeze([entry, second]) };
    const battle = fixtureBattle();
    const result = targetable.initialize(battle, definition);

    assert.strictEqual(result.state, battle);
    assert.notStrictEqual(result.value.restrictions, definition.restrictions);
    assert.strictEqual(result.value.restrictions[0], entry);
    assert.strictEqual(result.value.restrictions[1], second);
    assert.deepEqual(definition.restrictions, [entry, second]);
    assert.equal(targetable.hasTargetable(owner()), true);
    assert.equal(targetable.hasTargetable(initialize({ id: 3, position: [0, 0], definition: { hooks: [], id: "plain" } })), false);
});

test("Targetable initialization rejects different contributions with the same ID", () => {
    const first = { id: "duplicate", value: invisibleRestriction };
    const second = { id: "duplicate", value: untargetableRestriction };
    const definition = { restrictions: Object.freeze([first, second]) };

    assert.throws(
        () => targetable.initialize(fixtureBattle(), definition),
        { name: "TypeError", message: "duplicate targetable restriction identity: duplicate" },
    );
    assert.deepEqual(definition.restrictions, [first, second]);
});

test("Targetable initialization rejects a repeated reference to the same contribution", () => {
    const entry = { id: "duplicate", value: invisibleRestriction };
    const definition = { restrictions: Object.freeze([entry, entry]) };

    assert.throws(
        () => targetable.initialize(fixtureBattle(), definition),
        { name: "TypeError", message: "duplicate targetable restriction identity: duplicate" },
    );
    assert.deepEqual(definition.restrictions, [entry, entry]);
});

test("restriction registration shares ID replacement and no-change semantics with Contribution", () => {
    const original = owner();
    const reference = units.ref(original);
    const initial = effectFixtureWork(original);
    const entry = { id: "limit", value: restriction(Symbol("first")) };
    const installed = applyUnitChanges(initial, [targetable.setRestriction(reference, entry)]);

    assert.strictEqual(applyUnitChanges(installed, [targetable.setRestriction(reference, entry)]), installed);
    assert.strictEqual(applyUnitChanges(installed, [targetable.removeRestriction(reference, "absent")]), installed);
    assert.deepEqual(original.targetable.restrictions, []);

    const replacement = { id: entry.id, value: restriction(Symbol("second"), () => true) };
    const replaced = applyUnitChanges(installed, [targetable.setRestriction(reference, replacement)]);
    assert.deepEqual(units.get(replaced, reference).targetable.restrictions, [replacement]);
    assert.deepEqual(units.get(installed, reference).targetable.restrictions, [entry]);
    const copied = applyUnitChanges(replaced, [targetable.setRestriction(reference, { ...replacement })]);
    assert.notStrictEqual(copied, replaced);
    const removed = applyUnitChanges(replaced, [targetable.removeRestriction(reference, entry.id)]);
    assert.deepEqual(units.get(removed, reference).targetable, original.targetable);
});

test("a same-ID dynamic replacement does not restore the original definition entry when removed", () => {
    const original = { id: "shared", value: invisibleRestriction };
    const unit = owner(2, "ENEMY", [original]);
    const initialized = effectFixtureWork(unit);
    const reference = units.ref(unit);
    const replaced = applyUnitChanges(initialized, [targetable.setRestriction(reference, {
        id: "shared",
        value: untargetableRestriction,
    })]);

    const removed = applyUnitChanges(replaced, [targetable.removeRestriction(reference, "shared")]);
    assert.deepEqual(units.get(removed, reference).targetable.restrictions, []);
    assert.deepEqual(unit.targetable.restrictions, [original]);
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
    assert.deepEqual(received, [battle, input, target]);
    assert.equal(targetable.allowsRestrictions(battle, input, owner(3)), true);
});

test("visibility content distinguishes different sides from hostile sides independently of Purpose", () => {
    const ally = owner(1, "ALLY");
    const neutral = owner(2, "NEUTRAL");
    const enemy = owner(3, "ENEMY");
    const battle = effectFixtureWork(ally, neutral, enemy);

    for (const purposes of [[], ["DAMAGE"], ["HEAL"], ["ELEMENT_DAMAGE", "ELEMENT_HEAL"], ["EFFECT"]]) {
        const input = request(ally, purposes);
        assert.equal(invisibleRestriction.allows(battle, input, neutral), false);
        assert.equal(untargetableRestriction.allows(battle, input, neutral), false);
        assert.equal(camouflageRestriction.allows(battle, input, neutral), true);
        assert.equal(camouflageRestriction.allows(battle, input, enemy), false);
        assert.equal(invisibleRestriction.allows(battle, input, ally), true);
        assert.equal(allyUntargetableRestriction.allows(battle, input, ally), false);
        assert.equal(allyUntargetableRestriction.allows(battle, input, enemy), true);
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
