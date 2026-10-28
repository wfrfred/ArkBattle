import assert from "node:assert/strict";
import { test } from "node:test";
import { scope } from "../../dist/core/lifetime/index.js";
import { empty, derive, dependents, parents, wouldCycle, key } from "../../dist/core/lifetime/dependency.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { lifetime as actionLifetime } from "../../dist/core/unit/action/index.js";
import { lifetime as skillLifetime } from "../../dist/core/unit/skill/index.js";
import { lifetime as burstLifetime } from "../../dist/core/unit/capability/elemental/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/index.js";

const unit = id => scope(unitLifetime, { id });
const effect = (host, id = 0) => scope(effectLifetime, { host: { id: host }, id });
const entry = (target, scopes = [], owner = null) => ({ target, owner, scopes });
const identities = targets => targets.map(target => [target.kind, ...target.address]);

test("dependency identity separates domains and equal local IDs on different hosts", () => {
    const targets = [
        unit(1),
        scope(actionLifetime, { host: { id: 1 }, id: 0 }),
        scope(actionLifetime, { host: { id: 2 }, id: 0 }),
        scope(skillLifetime, { host: { id: 1 }, id: 0 }),
        scope(burstLifetime, { host: { id: 1 }, id: 0 }),
        effect(1),
    ];
    const initial = empty();
    for (const target of targets) assert.deepEqual(dependents(initial, target), []);
    assert.equal(new Set(targets.map(key)).size, targets.length);
    const projected = derive(initial, targets.map((target, index) => ({
        previous: undefined,
        next: entry(effect(index + 10), [target]),
    })));
    for (const [index, target] of targets.entries()) {
        assert.deepEqual(identities(dependents(projected, target)), [["EFFECT", index + 10, 0]]);
        assert.deepEqual(identities(parents(projected, effect(index + 10))), identities([target]));
    }
});

test("direct dependents keep owned order before numeric scoped order and preserve captured snapshots", () => {
    const target = unit(5);
    const entries = [
        entry(effect(9, 1), [target]),
        entry(effect(10), [target]),
        entry(effect(2), [target]),
        entry(effect(5, 1), [], { target, order: 2 }),
        entry(effect(5, 0), [], { target, order: 1 }),
    ];
    const initial = derive(empty(), entries.map(next => ({ previous: undefined, next })));
    const captured = dependents(initial, target);
    assert.deepEqual(identities(captured), [
        ["EFFECT", 5, 0], ["EFFECT", 5, 1], ["EFFECT", 2, 0], ["EFFECT", 9, 1], ["EFFECT", 10, 0],
    ]);
    const next = derive(initial, [{ previous: entries[0], next: undefined }]);
    assert.deepEqual(identities(dependents(next, target)), [
        ["EFFECT", 5, 0], ["EFFECT", 5, 1], ["EFFECT", 2, 0], ["EFFECT", 10, 0],
    ]);
    assert.deepEqual(identities(dependents(initial, target)), identities(captured));
});

test("owner and duplicate explicit scopes identify one dependency", () => {
    const owner = unit(1);
    const child = effect(1);
    const relation = entry(child, [owner, unit(1), effect(2)], { target: owner, order: 0 });
    const index = derive(empty(), [{ previous: undefined, next: relation }]);
    assert.deepEqual(identities(dependents(index, owner)), identities([child]));
    assert.deepEqual(identities(parents(index, child)), identities([owner, effect(2)]));
    assert.equal(wouldCycle(index, effect(2), child), true);
    assert.equal(wouldCycle(index, child, owner), false);
});

test("incremental relation updates retain immutable old graphs and ignore equivalent projections", () => {
    const first = entry(effect(10), [unit(1)]);
    const second = entry(effect(11), [unit(2)]);
    const initial = derive(empty(), [first, second].map(next => ({ previous: undefined, next })));
    assert.equal(derive(initial, [{ previous: first, next: { ...first, scopes: [unit(1)] } }]), initial);
    const changed = { ...first, scopes: [unit(3)] };
    const updated = derive(initial, [{ previous: first, next: changed }]);
    assert.deepEqual(identities(dependents(initial, unit(1))), identities([first.target]));
    assert.deepEqual(dependents(updated, unit(1)), []);
    assert.deepEqual(identities(dependents(updated, unit(3))), identities([first.target]));
    assert.deepEqual(identities(dependents(updated, unit(2))), identities([second.target]));
    const removed = derive(updated, [changed, second].map(previous => ({ previous, next: undefined })));
    assert.deepEqual(removed, empty());
});

test("binding checks follow transitive dependencies and reject a closed path", () => {
    const a = effect(1), b = effect(2), c = effect(3);
    const index = derive(empty(), [entry(b, [a]), entry(c, [b])].map(next => ({ previous: undefined, next })));
    assert.equal(wouldCycle(index, a, c), true);
    assert.equal(wouldCycle(index, c, a), false);
    assert.equal(wouldCycle(index, b, b), true);
});
