import assert from "node:assert/strict";
import { test } from "node:test";
import { all, get, ref } from "../../dist/core/projectile/query.js";
import { fixtureBattle } from "../helpers/unit.js";

const projectile = (id, lifecycle = "ACTIVE") => ({
    id, definition: { id: `query-${id}` }, lifecycle, position: [id, 0], state: {},
});

function battle(...instances) {
    const initial = fixtureBattle();
    return { ...initial, battlefield: { ...initial.battlefield,
        projectiles: instances.reduce((entries, self) => entries.add(self), initial.battlefield.projectiles),
    } };
}

test("all is lazy and repeatable, preserving registration order and ENDING projectiles", () => {
    const first = projectile(8);
    const ending = projectile(2, "ENDING");
    const initial = battle(first, ending);
    const visited = [];
    const query = all(initial).map(self => {
        visited.push(self.id);
        return self;
    });

    assert.deepEqual(visited, []);
    assert.deepEqual(query.take(1).toArray(), [first]);
    assert.deepEqual(visited, [8]);
    assert.deepEqual(query.toArray(), [first, ending]);
    assert.deepEqual(query.toArray(), [first, ending]);
    assert.deepEqual(visited, [8, 8, 2, 8, 2]);
    assert.deepEqual(all(initial).map(ref).toArray(), [ref(first), ref(ending)]);
    assert.deepEqual(all(battle()).toArray(), []);
});

test("Projectile queries retain their battle version through replacement, removal and re-registration", () => {
    const first = projectile(8);
    const second = projectile(2);
    const third = projectile(5);
    const initial = battle(first, second, third);
    const query = all(initial);
    const changed = { ...second, position: [9, 0] };
    const updated = initial.battlefield.projectiles.replace(ref(second), changed);
    const current = { ...initial, battlefield: { ...initial.battlefield,
        projectiles: updated.remove(first.id).add(first),
    } };

    const left = query[Symbol.iterator]();
    const right = query[Symbol.iterator]();
    for (const self of [first, second, third]) {
        assert.strictEqual(left.next().value, self);
        assert.strictEqual(right.next().value, self);
    }
    assert.equal(left.next().done, true);
    assert.equal(right.next().done, true);
    assert.deepEqual(query.toArray(), [first, second, third]);
    assert.deepEqual(all(current).toArray(), [changed, third, first]);
    assert.strictEqual(get(initial, ref(second)), second);
    assert.strictEqual(get(current, ref(second)), changed);
});
