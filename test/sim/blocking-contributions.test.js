import { unitsAt } from "../helpers/battlefield.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fixtureBattle, initialize } from "../helpers/unit.js";
import { fixture as blockingFixture, acquire, blockedIds } from "../helpers/blocking.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { deadline } from "../../dist/core/unit/effect/effect.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { usedCapacity } from "../../dist/core/battle/blocking/query.js";
import { resolveCapacity } from "../../dist/core/unit/capability/blocking/blocker.js";
import {
    setCapacityContribution,
    removeCapacityContribution,
} from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { resolveVolume } from "../../dist/core/unit/capability/blocking/blockable.js";
import {
    setVolumeContribution, removeVolumeContribution, setRule, removeRule,
} from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { compileAttributeModifiers, parseAttributeModifiers } from "../../dist/data/arknights/modifier.js";
import { compileBuffStacking, parseBuffStacking } from "../../dist/data/arknights/buff-stacking.js";
import {
    maxHpBuff, at, effectFixtureWork,
} from "../helpers/effects.js";

const fixtures = JSON.parse(
    readFileSync(new URL("../fixtures/arknights/blocking_buffs.json", import.meta.url), "utf8"),
);
const fixture = (key) => fixtures.find((entry) => entry.node._buff.buffKey === key);
const effectAddress = { host: { id: 0 }, id: 0 };

const blocker = (capacity = 3) =>
    initialize({
        id: 0,
        position: [0, 0],
        definition: {
            id: "capacity-holder",
            allegiance: { side: "ALLY" },
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            blocker: { layer: "GROUND", rules: [], capacity, radius: 1 },
        },
    });
const enemy = (id, volume = 1) =>
    initialize({
        id,
        position: [0.25, 0],
        definition: {
            id: `blocked-${id}`,
            allegiance: { side: "ENEMY" },
            layer: { type: "GROUND" },
            blockable: { volume },
        },
    });
const capacityOf = (unit) => resolveCapacity(unit.definition.blocker, unit.blocker);
const capacity = (work) => capacityOf(getUnit(work, 0));
const output = (value) => ({
    set: setCapacityContribution,
    remove: removeCapacityContribution,
    value,
});
const install = (work, effect, expiresAtTick = null) =>
    effects.install(work, unitRef(getUnit(work, 0)), effect, {
        source: unitRef(initialize({
            id: 7, position: [0, 0], definition: { id: "blocking-buff-source" },
        })),
        scopes: expiresAtTick === null ? [] : [{ type: "TICK", tick: expiresAtTick }],
    });
const change = (work, next, setting) => {
    const currentData = effects.get(work, effectAddress).data;
    work = effects.setData(work, effectAddress, { ...currentData, ...next });
    return refreshContribution(work, effectAddress, setting);
};
const entry = (id, value) => ({ id, value: [value] });

function contributionEffect(id, initial, setting, callbacks = {}) {
    return {
        id,
        initialize: () => initial,
        ...callbacks,
        onEnable(battle, self) {
            battle = setting.set(battle, self.host, {
                id: `${self.host.id}:${self.id}`, value: setting.value(self),
            });
            return callbacks.onEnable ? callbacks.onEnable(battle, self) : battle;
        },
        onDisable(battle, self) {
            battle = setting.remove(battle, self.host, `${self.host.id}:${self.id}`);
            return callbacks.onDisable ? callbacks.onDisable(battle, self) : battle;
        },
    };
}

function refreshContribution(battle, reference, setting) {
    const self = effects.get(battle, reference);
    if (self?.status !== "ACTIVE") return battle;
    return setting.set(battle, self.host, {
        id: `${self.host.id}:${self.id}`, value: setting.value(self),
    });
}

test("blocking initialization accepts plain definitions and validates them through unit initialization", () => {
    const radius = 1;
    const definition = { hooks: [], id: "both", blocker: { layer: "GROUND", rules: [], capacity: 3, radius }, blockable: { volume: 2 } };
    const unit = initialize({ id: 0, position: [0, 0], definition });
    assert.equal(unit.definition, definition);
    assert.equal(unit.blocker.radius, radius);
    assert.deepEqual(unit.blocker, { layer: "GROUND", capacity: [], radius, rules: [], blocked: [], acquired: [], released: [] });
    assert.deepEqual(unit.blockable, { volume: [], rules: [], blocker: null, acquired: [], released: [] });
    for (const [capability, invalid] of [
        ["blocker", { layer: "GROUND", rules: [], capacity: -1, radius }],
        ["blocker", { layer: "GROUND", rules: [], capacity: 1.5, radius }],
        ["blocker", { layer: "GROUND", rules: [], capacity: 1, radius: -1 }],
        ["blockable", { volume: 0 }],
        ["blockable", { volume: 1.5 }],
    ]) {
        assert.throws(() => initialize({
            id: 0, position: [0, 0], definition: { hooks: [], id: "invalid", [capability]: invalid },
        }), RangeError);
    }
});

test("blocking capacity: immutable additions resolve ties to even after clamping", () => {
    const original = effectFixtureWork(blocker());
    assert.equal(capacity(original), 3);
    const first = setCapacityContribution(original, { id: 0 }, entry("first", { type: "ADD", value: 1.5 }));
    const modified = setCapacityContribution(first, { id: 0 }, entry("second", { type: "ADD", value: 2.5 }));
    assert.equal(capacity(modified), 7);
    const reduced = removeCapacityContribution(modified, { id: 0 }, "first");
    assert.equal(capacity(reduced), 6);
    const restored = removeCapacityContribution(reduced, { id: 0 }, "second");
    assert.deepEqual(getUnit(restored, 0).blocker.capacity, []);
    assert.equal(capacity(restored), 3);
    assert.deepEqual(getUnit(original, 0).blocker.capacity, []);
    assert.equal(capacity(modified), 7);
    for (const [value, expected] of [
        [-3, 0], [-0.5, 0], [0.49, 0], [0.5, 0], [0.51, 1],
        [1.5, 2], [2.5, 2], [3.5, 4],
    ]) {
        const result = setCapacityContribution(original, { id: 0 }, entry("rounding", { type: "ADD", value: value - 3 }));
        assert.equal(capacity(result), expected, `resolved ${value}`);
    }
});

test("blocking capacity: ZERO overrides additions from every source and removing it restores them", () => {
    let battle = effectFixtureWork(blocker());
    battle = setCapacityContribution(battle, { id: 0 }, {
        id: "a-additions", value: [{ type: "ADD", value: 10 }, { type: "ADD", value: -1 }],
    });
    battle = setCapacityContribution(battle, { id: 0 }, {
        id: "z-additions", value: [{ type: "ADD", value: 20 }],
    });
    assert.equal(capacity(battle), 32);
    for (const zeroId of ["0-zero", "m-zero", "zz-zero"]) {
        const zeroed = setCapacityContribution(battle, { id: 0 }, {
            id: zeroId, value: [{ type: "ADD", value: 100 }, { type: "ZERO" }, { type: "ADD", value: 100 }],
        });
        assert.equal(capacity(zeroed), 0, zeroId);
        assert.equal(capacity(removeCapacityContribution(zeroed, { id: 0 }, zeroId)), 32);
    }
    assert.equal(capacity(battle), 32);
});

test("blocking capacity: exclusive group selection happens before ZERO is applied", () => {
    const battle = effectFixtureWork(blocker());
    const zeroed = setCapacityContribution(battle, { id: 0 }, {
        id: "zero", value: [{ type: "ZERO" }], group: { id: "capacity-rule", priority: 1 },
    });
    const selected = setCapacityContribution(zeroed, { id: 0 }, {
        id: "addition", value: [{ type: "ADD", value: 2 }], group: { id: "capacity-rule", priority: 2 },
    });
    assert.equal(capacity(selected), 5);
    const fallback = removeCapacityContribution(selected, { id: 0 }, "addition");
    assert.equal(capacity(fallback), 0);
    assert.equal(capacity(removeCapacityContribution(fallback, { id: 0 }, "zero")), 3);
    const independent = setCapacityContribution(selected, { id: 0 }, { id: "independent", value: [{ type: "ZERO" }] });
    assert.equal(capacity(independent), 0);
});

test("blocking capacity: explicit refresh and lifecycle output changes preserve base capacity and unrelated HP", () => {
    const setting = output((instance) => [{ type: "ADD", value: instance.data.amount }]);
    const effect = contributionEffect("capacity", { amount: -1 }, setting);
    const initialized = blocker();
    const owner = { ...initialized, vitality: { ...initialized.vitality, hp: 50 } };
    let work = effectFixtureWork(owner);
    work = install(work, effect).state;
    const old = getUnit(work, 0);
    assert.equal(capacity(work), 2);
    work = change(work, { amount: -2 }, setting);
    assert.equal(capacity(work), 1);
    work = effects.setEnabled(work, effectAddress, false);
    assert.equal(capacity(work), 3);
    work = change(work, { amount: -9 }, setting);
    assert.equal(capacity(work), 3);
    work = effects.setEnabled(work, effectAddress, true);
    assert.equal(capacity(work), 0);
    work = effects.install(work, unitRef(getUnit(work, 0)), maxHpBuff("hp", 100)).state;
    assert.equal(getUnit(work, 0).vitality.hp, 100);
    work = effects.end(work, effectAddress);
    assert.equal(capacity(work), 3);
    assert.equal(getUnit(work, 0).vitality.hp, 100);
    assert.equal(old.blocker.capacity.length, 1);
    assert.equal(capacityOf(old), 2);
});

function battlefield(units) {
    let battle = acquire(blockingFixture(units), 0);
    return {
        get state() { return battle.battlefield; },
        work() { return battle; },
        publish(next) { battle = next; },
        search() { battle = acquire(battle, 0); },
        blocked() { return blockedIds(battle, 0); },
    };
}

test("blocking volume: independent Effect contributions release targets and clean up by source", () => {
    const h = battlefield([blocker(), enemy(1), enemy(2)]);
    const original = h.state;
    const setting = {
        set: setVolumeContribution, remove: removeVolumeContribution,
        value: () => 1,
    };
    const first = contributionEffect("larger-a", {}, setting);
    const second = contributionEffect("larger-b", {}, setting);
    let result = effects.install(h.work(), unitRef(h.state.units.get(1)), first);
    h.publish(result.state);
    const firstRef = result.value;
    assert.deepEqual(h.blocked(), [1, 2]);
    result = effects.install(h.work(), unitRef(h.state.units.get(1)), second);
    h.publish(result.state);
    const secondRef = result.value;
    const expanded = h.state.units.get(1);
    assert.equal(resolveVolume(expanded.definition.blockable, expanded.blockable), 3);
    assert.deepEqual(h.blocked(), [1]);
    assert.equal(usedCapacity(h.work(), { id: 0 }), 3);

    h.publish(effects.end(h.work(), firstRef));
    assert.deepEqual(h.blocked(), [1]);
    h.search();
    assert.deepEqual(h.blocked(), [1, 2]);
    h.publish(effects.setEnabled(h.work(), secondRef, false));
    assert.equal(resolveVolume(h.state.units.get(1).definition.blockable, h.state.units.get(1).blockable), 1);
    h.publish(effects.setEnabled(h.work(), secondRef, true));
    assert.equal(resolveVolume(h.state.units.get(1).definition.blockable, h.state.units.get(1).blockable), 2);
    h.publish(effects.end(h.work(), secondRef));
    const current = h.state.units.get(1);
    assert.deepEqual(current.blockable.volume, []);
    assert.equal(current.definition.blockable.volume, 1);
    assert.equal(current.definition, expanded.definition);
    assert.equal(resolveVolume(expanded.definition.blockable, expanded.blockable), 3);
    assert.deepEqual(original.units.get(1).blockable.volume, []);
});

test("blocking volume: integer additions honor exclusive groups and restore the remaining candidate", () => {
    const h = battlefield([blocker(4), enemy(1), enemy(2)]);
    const original = h.state.units.get(1);
    h.publish(setVolumeContribution(h.work(), { id: 1 }, { id: "independent", value: 1 }));
    h.publish(setVolumeContribution(h.work(), { id: 1 }, {
        id: "lower", value: 1, group: { id: "size", priority: 1 },
    }));
    h.publish(setVolumeContribution(h.work(), { id: 1 }, {
        id: "higher", value: 2, group: { id: "size", priority: 2 },
    }));
    const expanded = h.state.units.get(1);
    assert.equal(resolveVolume(expanded.definition.blockable, expanded.blockable), 4);
    assert.deepEqual(h.blocked(), [1]);
    h.publish(removeVolumeContribution(h.work(), { id: 1 }, "higher"));
    assert.equal(resolveVolume(original.definition.blockable, h.state.units.get(1).blockable), 3);
    assert.deepEqual(h.blocked(), [1]);
    h.search();
    assert.deepEqual(h.blocked(), [1, 2]);
    assert.equal(resolveVolume(original.definition.blockable, expanded.blockable), 4);
    assert.equal(resolveVolume(original.definition.blockable, original.blockable), 1);
    h.publish(removeVolumeContribution(h.work(), { id: 1 }, "lower"));
    assert.equal(resolveVolume(original.definition.blockable, h.state.units.get(1).blockable), 2);
});

test("blocking volume: only integer additions are accepted", () => {
    const battle = effectFixtureWork(enemy(1, 2));
    for (const value of [0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(() => setVolumeContribution(battle, { id: 1 }, { id: "invalid", value }), RangeError);
    }
    const changed = setVolumeContribution(battle, { id: 1 }, { id: "zero", value: 0 });
    assert.equal(resolveVolume({ volume: 2 }, getUnit(changed, 1).blockable), 2);
});

test("blocking volume: negative additions still consume one capacity while Rules control eligibility", () => {
    const h = battlefield([blocker(1), enemy(1, 2)]);
    assert.deepEqual(h.blocked(), []);
    for (const value of [-2, -10]) {
        h.publish(setVolumeContribution(h.work(), { id: 1 }, { id: "reduced", value }));
        const current = h.state.units.get(1);
        assert.equal(resolveVolume(current.definition.blockable, current.blockable), 1);
        h.search();
        assert.deepEqual(h.blocked(), [1]);
        assert.equal(usedCapacity(h.work(), { id: 0 }), 1);
    }
    h.publish(addUnit(h.work(), enemy(2)));
    assert.deepEqual(h.blocked(), [1]);
    h.publish(setRule(h.work(), { id: 1 }, { id: "unblockable", allows: () => false }));
    assert.deepEqual(h.blocked(), []);
    h.search();
    assert.deepEqual(h.blocked(), [2]);
});

test("blocking eligibility: overlapping rules release and reacquire targets independently of volume", () => {
    const h = battlefield([blocker(), enemy(1), enemy(2)]);
    const original = h.state.units.get(1);
    const first = { id: "first", allows: () => false };
    const second = { id: "second", allows: () => false };
    h.publish(setRule(h.work(), { id: 1 }, first));
    assert.deepEqual(h.blocked(), [2]);
    h.publish(setRule(h.work(), { id: 1 }, second));
    h.publish(removeRule(h.work(), { id: 1 }, first.id));
    assert.deepEqual(h.state.units.get(1).blockable.rules.map(({ id }) => id), ["second"]);
    assert.deepEqual(h.blocked(), [2]);
    h.publish(removeRule(h.work(), { id: 1 }, second.id));
    assert.deepEqual(h.state.units.get(1).blockable.rules, []);
    assert.deepEqual(h.blocked(), [2]);
    h.search();
    assert.deepEqual(h.blocked(), [2, 1]);
    assert.equal(resolveVolume(original.definition.blockable, original.blockable), 1);
    assert.deepEqual(original.blockable.rules, []);
});

test("blocking volume: equivalent contribution changes leave the blocking projection clean", () => {
    const h = battlefield([blocker(), enemy(1)]);
    const before = h.state;
    h.publish(setVolumeContribution(h.work(), { id: 1 }, { id: "positive", value: 1 }));
    h.publish(setVolumeContribution(h.work(), { id: 1 }, { id: "negative", value: -1 }));
    assert.equal(h.state.units.get(0).blocker.blocked, before.units.get(0).blocker.blocked);
    assert.equal(h.state.occupancy, before.occupancy);
    assert.deepEqual(unitsAt(h.state, [0, 0]).map(unit => unit.id), unitsAt(before, [0, 0]).map(unit => unit.id));
    assert.equal(h.state.navigation, before.navigation);
});

function nativeModifier(raw) {
    const description = raw.node._buff.attributes.attributeModifiers.find(
        (value) => value.attributeType === "BLOCK_CNT",
    );
    const parsed = parseAttributeModifiers([description]);
    assert.deepEqual(parseAttributeModifiers([{ ...description, attributeType: 5 }]), parsed);
    return compileAttributeModifiers(parsed)[0];
}

test("blocking capacity: native stack renewal and terminal cleanup update real blocking relationships", () => {
    const raw = fixture("enemy_mcnist_block_cnt_advance");
    const rule = compileBuffStacking(parseBuffStacking(raw.node._buff));
    const compiled = nativeModifier(raw);
    const setting = output((instance) => {
        const sampled = compiled.sample({
            blackboard: new Map([["block_cnt", -1]]),
            stackCount: rule.validStackCount(instance.data.stackCount),
            readSourceAttribute: () => undefined,
        });
        return [{ type: "ADD", value: sampled.addition }];
    });
    const content = contributionEffect(
        raw.node._buff.buffKey,
        { stackCount: 3, lifetimeTicks: 2 },
        setting,
        {
            onTick(state, self) {
                if (state.tick < deadline(self)) return state;
                const plan = rule.expire(
                    { stackCount: self.data.stackCount, expiresAtTick: deadline(self) },
                    self.data.lifetimeTicks,
                    state.tick,
                );
                if (plan.type === "FINISH")
                    return effects.end(state, effectRef(self), "EXPIRED");
                else {
                    const currentData = effects.get(state, effectRef(self)).data;
                    state = effects.setData(state, effectRef(self), {
                        ...currentData,
                        stackCount: plan.stackCount,
                    });
                    state = effects.setDeadline(
                        state,
                        effectRef(self),
                        plan.expiresAtTick,
                    );
                    return refreshContribution(state, effectRef(self), setting);
                }
            },
        },
    );
    const h = battlefield([blocker(), enemy(1), enemy(2), enemy(3), enemy(4, 4)]);
    const original = h.state;
    let work = h.work();
    work = install(work, content, 2).state;
    h.publish(work);
    assert.deepEqual(h.blocked(), []);
    for (const [tick, remaining] of [
        [2, 1],
        [4, 2],
        [6, 3],
    ]) {
        let work = h.work();
        work = effects.advance(at(work, tick));
        h.publish(work);
        h.search();
        assert.equal(capacityOf(h.state.units.get(0)), remaining);
        assert.deepEqual(
            h.blocked(),
            Array.from({ length: remaining }, (_, index) => index + 1),
        );
    }
    assert.deepEqual(h.state.units.get(0).effects.values().toArray(), []);
    assert.equal(original.units.get(0).blocker.capacity.length, 0);
});

test("blocking capacity: native zero scaler releases weighted targets and restores capacity independently of their volume", () => {
    const raw = fixture("redace[taunt]");
    const compiled = nativeModifier(raw);
    const setting = output(() => {
        const sampled = compiled.sample({
            blackboard: new Map(),
            stackCount: 1,
            readSourceAttribute: () => undefined,
        });
        assert.equal(sampled.finalScaler, 0);
        return [{ type: "ZERO" }];
    });
    const content = contributionEffect(raw.node._buff.buffKey, {}, setting);
    const h = battlefield([blocker(), enemy(1, 2), enemy(2), enemy(3, 4)]);
    assert.deepEqual(h.blocked(), [1, 2]);
    let work = h.work();
    work = install(work, content).state;
    h.publish(work);
    assert.deepEqual(h.blocked(), []);
    let paused = h.work();
    paused = effects.setEnabled(paused, effectAddress, false);
    h.publish(paused);
    assert.deepEqual(h.blocked(), []);
    h.search();
    assert.deepEqual(h.blocked(), [1, 2]);
    let resumed = h.work();
    resumed = effects.setEnabled(resumed, effectAddress, true);
    h.publish(resumed);
    assert.deepEqual(h.blocked(), []);
    let finished = h.work();
    finished = effects.end(finished, effectAddress);
    h.publish(finished);
    assert.deepEqual(h.blocked(), []);
    h.search();
    assert.deepEqual(h.blocked(), [1, 2]);
    assert.deepEqual(
        [...h.state.units.values()].slice(1).map((unit) => resolveVolume(unit.definition.blockable, unit.blockable)),
        [2, 1, 4],
    );
});

test("blocking capacity: replacing contribution entries without changing the resolved number leaves projection clean", () => {
    const h = battlefield([blocker(), enemy(1)]);
    const before = h.state;
    const owner = before.units.get(0);
    h.publish(setCapacityContribution(h.work(), { id: 0 }, entry("positive", { type: "ADD", value: 1 })));
    h.publish(setCapacityContribution(h.work(), { id: 0 }, entry("negative", { type: "ADD", value: -1 })));
    const changed = h.state.units.get(0);
    assert.notEqual(changed.blocker.capacity, owner.blocker.capacity);
    assert.equal(capacityOf(changed), capacityOf(owner));
    assert.equal(h.state.units.get(0).blocker.blocked, before.units.get(0).blocker.blocked);
    assert.equal(h.state.occupancy, before.occupancy);
    assert.deepEqual(unitsAt(h.state, [0, 0]).map(unit => unit.id), unitsAt(before, [0, 0]).map(unit => unit.id));
    assert.equal(h.state.navigation, before.navigation);
    h.publish(setCapacityContribution(h.work(), { id: 0 }, entry("positive", { type: "ADD", value: 1.1 })));
    assert.equal(capacityOf(h.state.units.get(0)), 3);
    assert.equal(h.state.units.get(0).blocker.blocked, before.units.get(0).blocker.blocked);
});
