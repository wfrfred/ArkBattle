import assert from "node:assert/strict";
import { test } from "node:test";
import * as units from "../../dist/core/unit/query.js";
import { initialize } from "../helpers/unit.js";
import { hasLocomotion } from "../../dist/core/unit/capability/locomotion/capability.js";
import { hasVitality } from "../../dist/core/unit/capability/vitality/capability.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { remove as removeUnit, replace as updateUnit } from "../../dist/core/battle/unit.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";

const locomotion = {
    halfBodyWidth: 0, minSpeed: 0, speed: 1,
    steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
};
const unit = (id, capabilities = {}) => initialize({
    id, position: [id, 0], definition: { hooks: [], id: `query-${id}`, ...capabilities },
});
const battle = (...values) => createBattleState(fixtureBattlefieldState(values));

test("all yields Unit objects in registration order without capability or lifecycle filtering", () => {
    const initial = battle(
        unit(8, { locomotion }),
        unit(2, { vitality: { maxHp: 100, defense: 0, resistance: 0 }, hooks: [{ id: "test/tick", stage: "tick", invoke(state) { return { state: state, value: undefined }; } }] }),
        { ...unit(5), lifecycle: "LEAVING" },
    );
    const query = units.all(initial);
    const values = query.toArray();

    assert.deepEqual(values.map(value => value.id), [8, 2, 5]);
    assert.strictEqual(values[0], initial.battlefield.units.get(8));
    assert.strictEqual(values[1], initial.battlefield.units.get(2));
    assert.equal(values[2].lifecycle, "LEAVING");
    assert.deepEqual(query.map(units.ref).toArray(), [{ id: 8 }, { id: 2 }, { id: 5 }]);
    assert.deepEqual(units.all(battle()).toArray(), []);
});

test("Unit filters retain matching objects until identity extraction is explicitly requested", () => {
    const initial = battle(
        unit(8, { locomotion }),
        unit(2, { vitality: { maxHp: 100, defense: 0, resistance: 0 } }),
        unit(5, { locomotion, vitality: { maxHp: 100, defense: 0, resistance: 0 } }),
    );
    const moving = units.all(initial).filter(hasLocomotion);
    assert.deepEqual(moving.map(value => value.id).toArray(), [8, 5]);
    assert.strictEqual(moving.toArray()[0], initial.battlefield.units.get(8));
    const combined = moving.filter(hasVitality);
    assert.equal(combined.toArray()[0].vitality.hp, 100);
    assert.deepEqual(combined.map(units.ref).toArray(), [{ id: 5 }]);
    assert.deepEqual(units.all(initial).filter(value => value.id > 4).map(value => value.id).toArray(), [8, 5]);
    assert.deepEqual(units.all(initial).filter(() => false).toArray(), []);
});


test("a Unit Ref reads the supplied battle version without retaining the old snapshot", () => {
    const original = unit(3, { locomotion, vitality: { maxHp: 100, defense: 0, resistance: 0 } });
    const initial = battle(original);
    const reference = units.ref(original);
    const updated = { ...original, position: [4, 0], vitality: { ...original.vitality, hp: 60 } };
    const current = updateUnit(initial, [updated]);

    assert.deepEqual(Reflect.ownKeys(reference), ["id"]);
    assert.strictEqual(units.get(initial, reference), original);
    assert.strictEqual(units.get(current, reference), updated);
    assert.equal(units.get(current, reference).vitality.hp, 60);
    assert.equal(units.get(initial, reference).vitality.hp, 100);
    assert.equal(units.get(removeUnit(current, reference.id, "DEATH"), reference), undefined);
});
