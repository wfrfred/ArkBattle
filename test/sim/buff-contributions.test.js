import * as unitQueries from "../../dist/core/unit/query.js";
import { resolveDefense } from "../../dist/core/unit/capability/vitality/query.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { deadline } from "../../dist/core/unit/effect/effect.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compileBuffStacking, parseBuffStacking } from "../../dist/data/arknights/buff-stacking.js";
import {
    compileAttributeModifiers,
    parseAttributeModifiers,
} from "../../dist/data/arknights/modifier.js";
import { getUnit } from "../helpers/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { initialize } from "../helpers/unit.js";
import {
    setAttackContribution,
    removeAttackContribution,
} from "../../dist/core/unit/capability/offense/capability.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import {
    setDefenseContribution,
    removeDefenseContribution,
} from "../../dist/core/unit/capability/vitality/capability.js";
import {
    contributionEffect,
    refreshContribution,
    at,
    effectFixtureWork,
} from "../helpers/effects.js";

const fixtures = JSON.parse(
    readFileSync(new URL("../fixtures/arknights/buff_stacking.json", import.meta.url)),
);
const raw = fixtures.fixtures.find((entry) => entry.templateKey === "astesi_t_1").buff;
const close = (value, expected) =>
    assert.ok(Math.abs(value - expected) < 1e-9, `${value} ≈ ${expected}`);
const sourceRef = (id) => unitRef(initialize({
    id, position: [0, 0], definition: { id: `buff-source-${id}` },
}));

test("Buff contribution integration: the native Astesia DEF facet merges layers, preserves the first blackboard and source, and renews its instance", () => {
    const policy = compileBuffStacking(parseBuffStacking(raw));
    const [compiled] = compileAttributeModifiers(
        parseAttributeModifiers(raw.attributes.attributeModifiers).filter(
            (entry) => entry.attributeType === "DEF",
        ),
    );
    let starts = 0;
    const output = {
        capability: "vitality", set: setDefenseContribution,
        remove: removeDefenseContribution,
        value: (instance) => {
            const value = compiled.sample({
                blackboard: new Map([["def", instance.data.defenseRatio]]),
                stackCount: policy.validStackCount(instance.data.stackCount),
                readSourceAttribute: () => undefined,
            });
            return value === undefined ? [] : [value];
        },
    };
    const program = contributionEffect(raw.buffKey, { stackCount: 1, defenseRatio: 0.2 }, output, {
        onInstall: state => {
            starts++;
            return state;
        },
    });
    let work = effectFixtureWork(
        initialize({
            id: 0,
            position: [0, 0],
            definition: { hooks: [], id: "receiver", vitality: { maxHp: 100, defense: 100, resistance: 0 } },
        }),
    );
    const original = work;
    const apply = (source, defenseRatio, expiresAtTick, tick) => {
        const current = getUnit(work, 0).effects?.values().find(
            (instance) => instance.definition === program && instance.status !== "ENDING",
        );
        const plan = policy.plan(
            current === undefined
                ? undefined
                : { stackCount: current.data.stackCount, expiresAtTick: deadline(current) },
            { stackCount: 1, expiresAtTick },
            tick,
        );
        if (plan.type === "INSTALL") {
            work = effects.install(at(work, tick), unitRef(getUnit(work, 0)), program, {
                source: sourceRef(source),
                scopes: expiresAtTick === null ? [] : [{ type: "TICK", tick: expiresAtTick }],
                data: { stackCount: 1, defenseRatio },
            }).state;
        } else if (plan.type === "REFRESH") {
            const address = { host: { id: 0 }, id: current.id };
            const currentData = effects.get(work, address).data;
            work = effects.setData(work, address, { ...currentData, stackCount: plan.stackCount });
            work = effects.setDeadline(work, address, plan.expiresAtTick);
            work = refreshContribution(work, address, program, output);
        }
        return plan;
    };
    const effective = () => {
        const unit = getUnit(work, 0);
        return resolveDefense(work, unitRef(unit)).defense;
    };
    apply(10, 0.2, 10, 0);
    close(effective(), 120);
    const first = work;
    apply(20, 0.9, 15, 1);
    close(effective(), 140);
    let instance = getUnit(work, 0).effects.values().toArray()[0];
    assert.deepEqual(instance.source, sourceRef(10));
    assert.equal(instance.data.defenseRatio, 0.2);
    assert.equal(instance.data.stackCount, 2);
    assert.equal(deadline(instance), 15);
    assert.equal(getUnit(work, 0).effects.values().toArray().length, 1);
    assert.equal(unitQueries.get(first, { id: 0 }).effects.values().toArray()[0].data.stackCount, 1);
    assert.equal(starts, 1);
    const address = { host: { id: 0 }, id: instance.id };
    work = effects.setEnabled(work, address, false);
    apply(30, 0.8, 20, 3);
    assert.equal(effective(), 100);
    work = effects.setEnabled(work, address, true);
    close(effective(), 160);
    apply(30, 0.8, 20, 5);
    apply(30, 0.8, 20, 6);
    close(effective(), 200);
    const capped = work;
    assert.equal(apply(40, 0.8, 100, 7).type, "REJECT");
    assert.equal(getUnit(work, 0), unitQueries.get(capped, { id: 0 }));
    work = effects.advance(at(work, 19));
    close(effective(), 200);
    work = effects.end(work, address);
    assert.equal(effective(), 100);
    const originalUnit = getUnit(original, 0);
    assert.equal(resolveDefense(original, unitRef(originalUnit)).defense, 100);
    assert.equal(starts, 1);
    instance = getUnit(work, 0).effects.values().toArray()[0];
    assert.equal(instance, undefined);
});

test("Buff contribution integration: only effective layer growth resamples the retained source, while renewal preserves the sample", () => {
    const policy = compileBuffStacking({
        overrideType: "STACK",
        maxStackCnt: 3,
        maxValidStackCnt: 2,
        refreshRemainingTimeWhenStackMax: true,
        takeSnapshotWhenExtend: false,
        clearAllStackCntWhenTimeUp: false,
    });
    const [compiled] = compileAttributeModifiers(
        parseAttributeModifiers([
            {
                attributeType: "ATK",
                formulaItem: "MULTIPLIER",
                value: 0.5,
                loadFromBlackboard: false,
                fetchBaseValueFromSourceEntity: true,
            },
        ]),
    );
    const output = {
        capability: "offense", set: setAttackContribution,
        remove: removeAttackContribution,
        value: (instance) => [
            compiled.sample({
                blackboard: new Map(),
                stackCount: policy.validStackCount(instance.data.stackCount),
                readSourceAttribute: () => instance.data.sourceAttack,
            }),
        ],
    };
    const program = contributionEffect(
        "source-layer-sample",
        { stackCount: 1, sourceAttack: 100 },
        output,
    );
    let work = effectFixtureWork(
        initialize({
            id: 0,
            position: [0, 0],
            definition: { hooks: [], id: "receiver", offense: { attack: 100 } },
        }),
    );
    const installed = effects.install(work, unitRef(getUnit(work, 0)), program, {
        source: sourceRef(10),
        scopes: [{ type: "TICK", tick: 10 }],
    });
    work = installed.state;
    const address = installed.value;
    const power = () => resolveAttack(work, unitRef(getUnit(work, 0)));
    assert.equal(power(), 150);
    const apply = (currentSourceAttack, tick, expiresAtTick) => {
        const current = getUnit(work, 0).effects.values().toArray()[0];
        const plan = policy.plan(
            { stackCount: current.data.stackCount, expiresAtTick: deadline(current) },
            { stackCount: 1, expiresAtTick },
            tick,
        );
        assert.equal(plan.type, "REFRESH");
        const currentData = effects.get(work, address).data;
        work = effects.setData(work, address, {
            ...currentData,
            stackCount: plan.stackCount,
            sourceAttack: plan.reloadModifiers ? currentSourceAttack : currentData.sourceAttack,
        });
        work = effects.setDeadline(work, address, plan.expiresAtTick);
        work = refreshContribution(work, address, program, output);
        return plan;
    };
    assert.equal(apply(200, 1, 20).reloadModifiers, true);
    assert.equal(power(), 300);
    assert.equal(apply(400, 2, 30).reloadModifiers, false);
    assert.equal(power(), 300);
    assert.equal(apply(800, 3, 40).reloadModifiers, false);
    assert.equal(power(), 300);
    const current = getUnit(work, 0).effects.values().toArray()[0];
    assert.equal(current.data.stackCount, 3);
    assert.equal(current.data.sourceAttack, 200);
    assert.equal(deadline(current), 40);
    assert.deepEqual(current.source, sourceRef(10));
});
