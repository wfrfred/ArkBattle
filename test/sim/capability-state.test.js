import { fixtureBattle, fixtureDefinition, getUnit } from "../helpers/unit.js";
import { fixture, holder, target } from "../helpers/blocking.js";
import { update as updateUnit } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as offense from "../../dist/core/unit/capability/offense/capability.js";
import * as blockerOperations from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import * as blockableOperations from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/capability.js";
import * as movement from "../../dist/core/unit/capability/locomotion/index.js";
import * as action from "../../dist/core/unit/capability/action/capability.js";
import * as vitality from "../../dist/core/unit/capability/vitality/capability.js";
import * as damage from "../../dist/core/battle/damage/hook.js";
import * as healing from "../../dist/core/battle/healing/hook.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";

const entries = [
    [
        offense.initialize(fixtureBattle(0), fixtureDefinition("offense")).value,
        "attack",
        offense.setAttackContribution,
        offense.removeAttackContribution,
    ],
    [
        vitality.initialize(fixtureBattle(0), fixtureDefinition("vitality")).value,
        "defense",
        vitality.setDefenseContribution,
        vitality.removeDefenseContribution,
    ],
    [
        vitality.initialize(fixtureBattle(0), fixtureDefinition("vitality")).value,
        "resistance",
        vitality.setResistanceContribution,
        vitality.removeResistanceContribution,
    ],
    [
        locomotion.initialize(fixtureBattle(0), fixtureDefinition("locomotion")).value,
        "speed",
        movement.setSpeedContribution,
        movement.removeSpeedContribution,
    ],
    [
        action.initialize(fixtureBattle(0), fixtureDefinition("action")).value,
        "speed",
        action.setSpeedContribution,
        action.removeSpeedContribution,
    ],
    [
        action.initialize(fixtureBattle(0), fixtureDefinition("action")).value,
        "interval",
        action.setIntervalContribution,
        action.removeIntervalContribution,
    ],
];

test("local contribution updates share untouched state and leave earlier versions stable", () => {
    for (const [initial, field, set, remove] of entries) {
        const value = [create({ addition: 10 })];
        const entry = { id: "bonus", value };
        const added = set(initial, entry);
        assert.equal(initial[field].length, 0, field);
        assert.equal(added[field][0], entry, field);
        assert.equal(set(added, entry), added, field);
        assert.equal(remove(added, "missing"), added, field);
        for (const key of Object.keys(initial).filter((key) => key !== field)) {
            assert.equal(added[key], initial[key], `${field}: ${key}`);
        }
        const removed = remove(added, entry.id);
        assert.equal(removed[field].length, 0, field);
        assert.equal(added[field][0], entry, field);
    }
});

for (const [name, id, capability, field, set, remove, entry] of [
    ["capacity", 10, "blocker", "capacity", blockerOperations.setCapacityContribution, blockerOperations.removeCapacityContribution,
        { id: "bonus", value: [{ type: "ADD", value: 1 }] }],
    ["volume", 20, "blockable", "volume", blockableOperations.setVolumeContribution, blockableOperations.removeVolumeContribution,
        { id: "bonus", value: 1 }],
    ["Blocker Rule", 10, "blocker", "rules", blockerOperations.setRule, blockerOperations.removeRule,
        { id: "restriction", allows: () => false }],
    ["Blockable Rule", 20, "blockable", "rules", blockableOperations.setRule, blockableOperations.removeRule,
        { id: "restriction", allows: () => false }],
]) {
    test(`complete Blocking ${name} writes preserve unchanged state and recognize no-ops`, () => {
        const initial = fixture([holder(), target()]);
        const before = getUnit(initial, id);
        const reference = { id };
        const added = set(initial, reference, entry);
        const current = getUnit(added, id);
        assert.equal(current[capability][field].find(item => item.id === entry.id), entry);
        assert.equal(before[capability][field].some(item => item.id === entry.id), false);
        assert.equal(set(added, reference, entry), added);
        assert.equal(remove(added, reference, "missing"), added);
        for (const key of Object.keys(before[capability]).filter(key => key !== field)) {
            assert.equal(current[capability][key], before[capability][key], key);
        }
        const removed = remove(added, reference, entry.id);
        assert.deepEqual(getUnit(removed, id)[capability][field], before[capability][field]);
        assert.equal(getUnit(added, id)[capability][field].find(item => item.id === entry.id), entry);
    });

    test(`complete Blocking ${name} writes reject a missing host and allow LEAVING cleanup`, () => {
        const missing = fixture();
        assert.throws(() => set(missing, { id }, entry), RangeError);
        assert.throws(() => remove(missing, { id }, entry.id), RangeError);
        const added = set(fixture([holder(), target()]), { id }, entry);
        const self = getUnit(added, id);
        const leaving = updateUnit(added, [{ ...self, lifecycle: "LEAVING" }]);
        const removed = remove(leaving, { id }, entry.id);
        assert.equal(getUnit(removed, id).lifecycle, "LEAVING");
        assert.equal(getUnit(removed, id)[capability][field].some(item => item.id === entry.id), false);
    });
}

test("local hook registration retains progress and changes only its registration collection", () => {
    const hook = {
        id: "hook",
        stage: "receiving",
        priority: 0,
        accepts: () => true,
        invoke: (state, _context, value) => ({ state, value }),
    };
    const registrations = [
        [
            vitality.initialize(fixtureBattle(0), { maxHp: 100, defense: 0, resistance: 0 }).value,
            "damageHooks",
            damage.setHook,
            damage.removeHook,
        ],
        [
            vitality.initialize(fixtureBattle(0), { maxHp: 100, defense: 0, resistance: 0 }).value,
            "healingHooks",
            healing.setHook,
            healing.removeHook,
        ],
        [
            action.initialize(fixtureBattle(0), fixtureDefinition("action")).value,
            "beforeRelease",
            action.setBeforeReleaseHook,
            action.removeBeforeReleaseHook,
        ],
        [
            action.initialize(fixtureBattle(0), fixtureDefinition("action")).value,
            "released",
            action.setReleasedHook,
            action.removeReleasedHook,
        ],
    ];
    for (const [initial, field, set, remove] of registrations) {
        const entry = hook;
        const added = set(initial, entry);
        assert.equal(added[field][0], entry, field);
        assert.equal(initial[field].length, 0, field);
        assert.equal(set(added, entry), added, field);
        assert.equal(remove(added, "missing"), added, field);
        for (const key of Object.keys(initial).filter((key) => key !== field)) {
            assert.equal(added[key], initial[key], `${field}: ${key}`);
        }
        assert.equal(remove(added, hook.id)[field].length, 0, field);
        assert.equal(added[field][0], entry, field);
    }
});
