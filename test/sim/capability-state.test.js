import { fixtureBattle, fixtureDefinition, getUnit, initialize } from "../helpers/unit.js";
import { fixture, holder, target } from "../helpers/blocking.js";
import { add as addUnit, update as applyUnitChanges, replace as updateUnit } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as offense from "../../dist/core/unit/capability/offense/capability.js";
import * as blockerOperations from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import * as blockableOperations from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import * as movement from "../../dist/core/unit/capability/locomotion/index.js";
import * as action from "../../dist/core/unit/capability/action/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/capability.js";
import * as damage from "../../dist/core/battle/damage/hook.js";
import * as healing from "../../dist/core/battle/healing/hook.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";

const entries = [
    [
        "offense",
        "attack",
        offense.setAttackContribution,
        offense.removeAttackContribution,
    ],
    [
        "vitality",
        "defense",
        vitality.setDefenseContribution,
        vitality.removeDefenseContribution,
    ],
    [
        "vitality",
        "resistance",
        vitality.setResistanceContribution,
        vitality.removeResistanceContribution,
    ],
    [
        "locomotion",
        "speed",
        movement.setSpeedContribution,
        movement.removeSpeedContribution,
    ],
    [
        "action",
        "speed",
        action.setSpeedContribution,
        action.removeSpeedContribution,
    ],
    [
        "action",
        "interval",
        action.setIntervalContribution,
        action.removeIntervalContribution,
    ],
];

test("contribution Changes share untouched state and leave earlier versions stable", () => {
    for (const [capability, field, set, remove] of entries) {
        const unit = initialize({ id: 1, position: [0, 0], definition: {
            id: `${capability}-${field}`, [capability]: fixtureDefinition(capability),
        } });
        const initial = addUnit(fixtureBattle(), unit);
        const reference = { id: unit.id };
        const value = [create({ addition: 10 })];
        const entry = { id: "bonus", value };
        const added = applyUnitChanges(initial, [set(reference, entry)]);
        const current = getUnit(added, unit.id)[capability];
        assert.equal(unit[capability][field].length, 0, field);
        assert.equal(current[field][0], entry, field);
        assert.equal(applyUnitChanges(added, [set(reference, entry)]), added, field);
        assert.equal(applyUnitChanges(added, [remove(reference, "missing")]), added, field);
        for (const key of Object.keys(unit[capability]).filter((key) => key !== field)) {
            assert.equal(current[key], unit[capability][key], `${field}: ${key}`);
        }
        const removed = applyUnitChanges(added, [remove(reference, entry.id)]);
        assert.equal(getUnit(removed, unit.id)[capability][field].length, 0, field);
        assert.equal(current[field][0], entry, field);
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
        const added = applyUnitChanges(initial, [set(reference, entry)]);
        const current = getUnit(added, id);
        assert.equal(current[capability][field].find(item => item.id === entry.id), entry);
        assert.equal(before[capability][field].some(item => item.id === entry.id), false);
        assert.equal(applyUnitChanges(added, [set(reference, entry)]), added);
        assert.equal(applyUnitChanges(added, [remove(reference, "missing")]), added);
        for (const key of Object.keys(before[capability]).filter(key => key !== field)) {
            assert.equal(current[capability][key], before[capability][key], key);
        }
        const removed = applyUnitChanges(added, [remove(reference, entry.id)]);
        assert.deepEqual(getUnit(removed, id)[capability][field], before[capability][field]);
        assert.equal(getUnit(added, id)[capability][field].find(item => item.id === entry.id), entry);
    });

    test(`complete Blocking ${name} writes reject a missing host and allow LEAVING cleanup`, () => {
        const missing = fixture();
        assert.throws(() => applyUnitChanges(missing, [set({ id }, entry)]), RangeError);
        assert.throws(() => applyUnitChanges(missing, [remove({ id }, entry.id)]), RangeError);
        const added = applyUnitChanges(fixture([holder(), target()]), [set({ id }, entry)]);
        const self = getUnit(added, id);
        const leaving = updateUnit(added, [{ ...self, lifecycle: "LEAVING" }]);
        const removed = applyUnitChanges(leaving, [remove({ id }, entry.id)]);
        assert.equal(getUnit(removed, id).lifecycle, "LEAVING");
        assert.equal(getUnit(removed, id)[capability][field].some(item => item.id === entry.id), false);
    });
}

test("Hook Changes retain progress and change only their registration collection", () => {
    const hook = {
        id: "hook",
        stage: "receiving",
        priority: 0,
        accepts: () => true,
        invoke: (state, _context, value) => ({ state, value }),
    };
    const registrations = [
        [
            "vitality",
            "damageHooks",
            damage.setHook,
            damage.removeHook,
        ],
        [
            "vitality",
            "healingHooks",
            healing.setHook,
            healing.removeHook,
        ],
        [
            "action",
            "beforeRelease",
            action.setBeforeReleaseHook,
            action.removeBeforeReleaseHook,
        ],
        [
            "action",
            "released",
            action.setReleasedHook,
            action.removeReleasedHook,
        ],
    ];
    for (const [capability, field, set, remove] of registrations) {
        const unit = initialize({ id: 1, position: [0, 0], definition: {
            id: `${capability}-${field}`, [capability]: fixtureDefinition(capability),
        } });
        const initial = addUnit(fixtureBattle(), unit);
        const reference = { id: unit.id };
        const entry = hook;
        const added = applyUnitChanges(initial, [set(reference, entry)]);
        const current = getUnit(added, unit.id)[capability];
        assert.equal(current[field][0], entry, field);
        assert.equal(unit[capability][field].length, 0, field);
        assert.equal(applyUnitChanges(added, [set(reference, entry)]), added, field);
        assert.equal(applyUnitChanges(added, [remove(reference, "missing")]), added, field);
        for (const key of Object.keys(unit[capability]).filter((key) => key !== field)) {
            assert.equal(current[key], unit[capability][key], `${field}: ${key}`);
        }
        assert.equal(getUnit(applyUnitChanges(added, [remove(reference, hook.id)]), unit.id)[capability][field].length, 0, field);
        assert.equal(current[field][0], entry, field);
    }
});
