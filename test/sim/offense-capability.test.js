import { Hooks } from "../../dist/core/hook.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
    initialize,
    setAttackContribution,
    removeAttackContribution,
} from "../../dist/core/unit/capability/offense/capability.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";
import { add as addUnit, replace as updateUnit } from "../../dist/core/battle/unit.js";
import * as units from "../../dist/core/unit/query.js";
import * as attribute from "../../dist/core/unit/contribution/attribute.js";
import { baseUnit, fixtureBattle } from "../helpers/unit.js";

const createUnit = (battle, id, attack, capabilities = {}) => initializeUnit(battle, {     id,
    position: [id, 0],
    definition: { hooks: Hooks.empty(), id: `offense-${id}`, offense: { attack }, ...capabilities },
}).value;

test("Offense initialization validates its base attribute through both construction entrances", () => {
    const battle = fixtureBattle(7);

    for (const attack of [0, 0.25, 125.75]) {
        const initialized = initialize(battle, baseUnit({ id: "offense", hooks: Hooks.empty(), offense: { attack } }));
        assert.strictEqual(initialized.state, battle);
        assert.deepEqual(initialized.value.offense, { attack: [] });
        const unit = createUnit(battle, 0, attack);
        assert.equal(resolveAttack(addUnit(battle, unit), units.ref(unit)), attack);
    }

    for (const attack of [-0.25, NaN, Infinity, -Infinity, "100", undefined]) {
        assert.throws(() => initialize(battle, baseUnit({ id: "offense", hooks: Hooks.empty(), offense: { attack } })), /attack must be a finite nonnegative number/);
        assert.throws(() => createUnit(battle, 0, attack), /attack must be a finite nonnegative number/);
    }
});


test("Offense dynamic contributions receive the queried battle and its current typed owner", () => {
    let battle = fixtureBattle(2);
    const source = createUnit(battle, 0, 40);
    const sourceRef = units.ref(source);
    const original = createUnit(battle, 1, 10);
    battle = addUnit(addUnit(battle, source), original);
    battle = applyUnitChanges(battle, [setAttackContribution(units.ref(original), {
            id: "dynamic",
            value: (current, self) => {
                assert.strictEqual(units.get(current, units.ref(self)), self);
                return [attribute.create({
                    finalAddition: resolveAttack(current, sourceRef) + self.position[0] + current.tick,
                })];
            },
        })]);
    const receiver = units.get(battle, units.ref(original));
    const initial = battle;
    const reference = units.ref(receiver);
    assert.equal(resolveAttack(initial, reference), 53);

    battle = applyUnitChanges(battle, [setAttackContribution({ id: source.id }, {
            id: "source-bonus",
            value: [attribute.create({ addition: 25 })],
        })]);
    battle = updateUnit({ ...battle, tick: 4 }, [{ ...receiver, position: [3, 0] }]);

    assert.equal(resolveAttack(battle, reference), 82);
    assert.equal(resolveAttack(initial, reference), 53);
    assert.equal(resolveAttack(initial, sourceRef), 40);
    assert.equal(resolveAttack(battle, sourceRef), 65);
});

test("Offense resolves exclusive contribution winners before evaluating dynamic values", () => {
    const initial = fixtureBattle();
    const original = createUnit(initial, 0, 100);
    let weakerEvaluations = 0;
    const weaker = {
        id: "a-weaker",
        group: { id: "inspiration", priority: 1 },
        value: () => {
            weakerEvaluations++;
            return [attribute.create({ finalAddition: 500 })];
        },
    };
    const stronger = {
        id: "z-stronger",
        group: { id: "inspiration", priority: 2 },
        value: (_battle, self) => [attribute.create({ finalAddition: self.definition.offense.attack / 2 })],
    };
    const reference = units.ref(original);
    const battle = applyUnitChanges(addUnit(initial, original), [
        setAttackContribution(reference, weaker),
        setAttackContribution(reference, stronger),
    ]);

    assert.equal(resolveAttack(battle, reference), 150);
    assert.equal(weakerEvaluations, 0);
    const current = applyUnitChanges(battle, [removeAttackContribution(reference, stronger.id)]);
    assert.equal(resolveAttack(current, reference), 600);
    assert.equal(weakerEvaluations, 1);
    assert.equal(resolveAttack(battle, reference), 150);
    assert.equal(weakerEvaluations, 1);
});


test("Offense retains fractional attribute values and applies only its nonnegative bound", () => {
    const initial = fixtureBattle();
    const original = createUnit(initial, 0, 100.25);
    const reference = units.ref(original);
    const battle = applyUnitChanges(addUnit(initial, original), [setAttackContribution(reference, {
            id: "four-terms",
            value: [attribute.create({ addition: 0.25, multiplier: 0.5, finalAddition: 0.75, finalScaler: 1.2 })],
        })]);
    assert.ok(Math.abs(resolveAttack(battle, reference) - 181.8) < 1e-9);

    const clamped = applyUnitChanges(battle, [setAttackContribution(reference, {
            id: "four-terms",
            value: [attribute.create({ finalAddition: -101 })],
        })]);
    assert.equal(resolveAttack(clamped, reference), 0);
    assert.ok(Math.abs(resolveAttack(battle, reference) - 181.8) < 1e-9);
});
