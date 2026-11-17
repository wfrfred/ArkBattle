// Contract: [capability](../../docs/architecture/capability.md#classification).
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { hasClassification } from "../../dist/core/unit/capability/classification/capability.js";
import {
    isType,
    areHostile,
    hasFilterTag,
    hasGroupTag,
    matchesProfession,
    matchesSubProfession,
    matchesRank,
} from "../../dist/core/unit/capability/classification/query.js";
import { battle, get } from "../helpers/battle.js";

function creation(id, classification) {
    return {
        definition: { id, hooks: Hooks.empty(), classification },
        position: [0, 0],
    };
}

test("CLASSIFICATION-01: unit category does not determine side or hostility", () => {
    const state = battle([
        creation("allied-enemy", {
            type: "ENEMY",
            side: "ALLY",
            filterTags: [],
            rank: "NORMAL",
        }),
        creation("enemy-operator", {
            type: "OPERATOR",
            side: "ENEMY",
            groupTags: [],
            profession: "WARRIOR",
            subProfession: "FEARLESS",
            extraProfessions: [],
        }),
        creation("neutral-device", {
            type: "DEVICE",
            side: "NEUTRAL",
            filterTags: [],
            groupTags: [],
        }),
    ]);
    const units = [get(state, 0), get(state, 1), get(state, 2)];
    const expected = [
        [false, true, false],
        [true, false, true],
        [false, true, false],
    ];

    assert.equal(isType(units[0], "ENEMY"), true);
    assert.equal(isType(units[0], "OPERATOR"), false);

    for (const [leftIndex, left] of units.entries()) {
        assert.equal(hasClassification(left), true);
        for (const [rightIndex, right] of units.entries()) {
            assert.equal(areHostile(left, right), expected[leftIndex][rightIndex]);
        }
    }
});

test("CLASSIFICATION-02: filter and group tags are distinct facts available to their categories", () => {
    const state = battle([
        creation("filter-tagged-enemy", {
            type: "ENEMY",
            side: "ENEMY",
            filterTags: ["sarkaz"],
            rank: "ELITE",
        }),
        creation("group-tagged-operator", {
            type: "OPERATOR",
            side: "ALLY",
            groupTags: ["rhodes"],
            profession: "TANK",
            subProfession: "UNYIELD",
            extraProfessions: [],
        }),
        creation("tagged-device", {
            type: "DEVICE",
            side: "ALLY",
            filterTags: ["machine"],
            groupTags: ["rhodes"],
        }),
        creation("tagged-summon", {
            type: "SUMMON",
            side: "ALLY",
            groupTags: ["rhodes"],
            subProfession: null,
        }),
    ]);
    const filtered = get(state, 0);
    const grouped = get(state, 1);
    const device = get(state, 2);
    const summon = get(state, 3);

    assert.equal(hasFilterTag(filtered, "sarkaz"), true);
    assert.equal(hasGroupTag(filtered, "sarkaz"), false);
    assert.equal(hasFilterTag(grouped, "sarkaz"), false);
    assert.equal(hasGroupTag(grouped, "rhodes"), true);
    assert.equal(hasFilterTag(device, "machine"), true);
    assert.equal(hasGroupTag(device, "rhodes"), true);
    assert.equal(hasGroupTag(device, "machine"), false);
    assert.equal(hasFilterTag(summon, "machine"), false);
    assert.equal(hasGroupTag(summon, "rhodes"), true);
    assert.equal(matchesSubProfession(summon, ["EXECUTOR"]), false);
});

test("CLASSIFICATION-03: extra professions and a summon's reused subprofession do not change its category", () => {
    const state = battle([
        creation("additional-caster", {
            type: "OPERATOR",
            side: "ALLY",
            groupTags: [],
            profession: "WARRIOR",
            subProfession: "FEARLESS",
            extraProfessions: ["CASTER"],
        }),
        creation("executor-operator", {
            type: "OPERATOR",
            side: "ALLY",
            groupTags: [],
            profession: "SPECIAL",
            subProfession: "EXECUTOR",
            extraProfessions: [],
        }),
        creation("mirrored-summon", {
            type: "SUMMON",
            side: "ALLY",
            groupTags: [],
            subProfession: "EXECUTOR",
        }),
        creation("boss", {
            type: "ENEMY",
            side: "ENEMY",
            filterTags: [],
            rank: "BOSS",
        }),
        creation("device", {
            type: "DEVICE",
            side: "NEUTRAL",
            filterTags: [],
            groupTags: [],
        }),
    ]);
    const profession = get(state, 0);
    const executor = get(state, 1);
    const summon = get(state, 2);
    const boss = get(state, 3);
    const device = get(state, 4);

    assert.equal(matchesProfession(profession, ["WARRIOR"], false), true);
    assert.equal(matchesSubProfession(profession, ["FEARLESS"]), true);
    assert.equal(matchesProfession(profession, ["CASTER"], false), false);
    assert.equal(matchesProfession(profession, ["CASTER"], true), true);
    assert.equal(matchesProfession(executor, ["SPECIAL"], false), true);
    assert.equal(matchesSubProfession(executor, ["EXECUTOR"]), true);
    assert.equal(matchesSubProfession(summon, ["EXECUTOR"]), true);
    assert.equal(matchesProfession(summon, ["SPECIAL"], true), false);
    assert.equal(matchesProfession(boss, ["CASTER"], true), false);
    assert.equal(matchesProfession(device, ["WARRIOR"], true), false);
    assert.equal(matchesSubProfession(boss, ["EXECUTOR"]), false);
    assert.equal(matchesSubProfession(device, ["EXECUTOR"]), false);
    assert.equal(matchesRank(boss, ["NORMAL", "BOSS"]), true);
    assert.equal(matchesRank(boss, ["ELITE"]), false);
    assert.equal(matchesRank(summon, ["BOSS"]), false);
    assert.equal(matchesRank(device, ["NORMAL"]), false);
});
