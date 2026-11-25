// Contract: [forced movement](../../../docs/architecture/navigation.md#强制位移).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { attribute } from "../../helpers/attribute.js";
import { step } from "../../../dist/core/battle/runtime.js";
import * as blocking from "../../../dist/core/battle/blocking/index.js";
import { blockableReleased } from "../../../dist/core/unit/capability/blocking/index.js";
import { update as updateTile } from "../../../dist/core/battle/tile.js";
import { get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { create as modifier } from "../../../dist/core/common/modifier.js";
import { Hooks } from "../../../dist/core/hook.js";
import * as lifetime from "../../../dist/core/lifetime/index.js";
import * as projectiles from "../../../dist/core/projectile/index.js";
import * as units from "../../../dist/core/unit/index.js";
import * as effects from "../../../dist/core/effect/index.js";
import { pull, push, shifter, shiftable, unbalance } from "../../../dist/core/unit/capability/shifting/index.js";
import { unbalanceImmunity } from "../../../dist/core/effects/protection.js";

const body = { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 }, mass: 1, frictionFactor: 0 };
const targetDefinition = {
    id: "forced-movement-target",
    hooks: Hooks.empty(),
    locomotion: {
        speed: attribute(1),
        halfBodyWidth: 0.1,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
    },
    shiftable: { massLevel: attribute(0), restrictions: [], body },
};
const sourceDefinition = {
    id: "forced-movement-source",
    hooks: Hooks.empty(),
    shifter: { baseForceLevel: attribute(0) },
};

function setup(definition = targetDefinition, options) {
    const state = battle([
        { definition, position: [1, 1] },
        { definition: sourceDefinition, position: [0, 0] },
    ], options);
    return { state, host: units.ref(get(state, 0)), source: units.ref(get(state, 1)) };
}

function fixedPull(source, position, options = {}) {
    return {
        scope: source,
        point: { type: "FIXED", position },
        forceLevel: 0,
        nearStop: [],
        ...options,
    };
}

function assertPosition(state, [expectedX, expectedY]) {
    const [x, y] = get(state, 0).position;
    assert.ok(Math.abs(x - expectedX) < 1e-12, `${x} ≈ ${expectedX}`);
    assert.ok(Math.abs(y - expectedY) < 1e-12, `${y} ≈ ${expectedY}`);
}

test("push uses current grades and releases blocking before forced movement begins", () => {
    const releases = [];
    const state = battle([{
        definition: {
            ...targetDefinition,
            layer: { type: "GROUND" },
            blockable: { volume: 1, restrictions: [] },
            shiftable: { ...targetDefinition.shiftable, massLevel: attribute(2.5) },
            hooks: Hooks.empty().set(blockableReleased, {
                id: "observe-unbalance",
                invoke(current) {
                    releases.push(shiftable.isUnbalanced(get(current, 0)));
                    return { state: current, value: undefined };
                },
            }),
        },
        position: [1, 1],
    }, {
        definition: {
            ...sourceDefinition,
            blocker: { capacity: 1, layer: "GROUND", restrictions: [] },
        },
        position: [0.75, 1],
    }], { pushMultiplier: 0.25 });
    const host = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    const strengthened = units.update(state, source, shifter.setBaseForceLevelContribution({
        id: "extra-force", value: [modifier({ addition: 3.5 })],
    }));
    const held = blocking.acquire(strengthened, source, host);
    const shifted = push(held, source, host, { forceLevel: 0, direction: [1, 0] });
    assert.ok(shifted.value);
    assert.deepEqual(releases, [true]);
    const moved = step(shifted.state, []);
    assertPosition(moved, [1 + 530 * 0.25 * 0.02 / 30, 1]);
    assert.deepEqual(blocking.blocked(moved, source), []);
});

test("pull creation refuses a zero table result and an ended source", () => {
    const { state, host, source } = setup();
    const tooLight = pull.apply(state, source, host, fixedPull(source, [5, 1], { forceLevel: -4 }));
    assert.deepEqual(tooLight, { state, value: null });

    const departed = units.remove(state, source, { reason: "SCRIPT" });
    const withoutSource = pull.apply(departed, source, host, fixedPull(source, [5, 1]));
    assert.deepEqual(withoutSource, { state: departed, value: null });
});

test("a pull samples its force once and later pulls use the updated grades", () => {
    const { state, host, source } = setup();
    const options = fixedPull(source, [5, 1]);
    const original = pull.apply(state, source, host, options);
    assert.ok(original.value);
    const stronger = units.update(original.state, source, shifter.setBaseForceLevelContribution({
        id: "extra-force", value: [modifier({ addition: 2 })],
    }));
    const changed = units.update(stronger, host, shiftable.setMassLevelContribution({
        id: "extra-weight", value: [modifier({ addition: 4 })],
    }));
    assertPosition(step(changed, []), [1 + 40 / 900, 1]);

    const fresh = pull.apply(pull.remove(changed, original.value), source, host, options);
    assert.ok(fresh.value);
    assertPosition(step(fresh.state, []), [1 + 2 / 900, 1]);
});

test("pulls with a shared source scope stack and only the sole pull can brake", () => {
    const { state, host, source } = setup();
    const initial = unbalance.applyImpulse(state, host, [0.6, 0]);
    const repeat = unbalance.applyImpulse(initial.state, host, [0.6, 0]);
    const options = fixedPull(source, [5, 1]);
    const first = pull.apply(repeat.state, source, host, options);
    const second = pull.apply(first.state, source, host, options);
    assert.ok(first.value && second.value);
    assert.equal(repeat.value, initial.value);
    assert.equal(first.value.unbalance, second.value.unbalance);
    assert.notEqual(first.value, second.value);

    const multiple = pull.brake(second.state, first.value);
    assertPosition(step(multiple, []), [1 + 1.2 / 30 + 80 / 900, 1]);

    const remaining = pull.remove(multiple, first.value);
    assert.equal(lifetime.available(remaining, first.value), false);
    assert.equal(lifetime.available(remaining, second.value), true);
    assert.deepEqual(repeat.value.get(remaining).velocity, [1.2 / 30, 0]);
    const braked = pull.brake(remaining, second.value);
    assert.deepEqual(repeat.value.get(braked).velocity, [0, 0]);
    assert.equal(lifetime.available(braked, second.value), true);
});

test("a moving pull point can hold a pull at zero, resume it, and end it without clearing momentum", () => {
    const { state, host, source } = setup();
    const anchor = projectiles.initialize(state, {
        definition: { id: "pull-anchor", eliminatable: true }, side: "ALLY", position: [2, 1], state: {},
    });
    const anchorRef = projectiles.ref(anchor.value);
    const added = projectiles.add(anchor.state, anchor.value);
    const linked = pull.apply(added, source, host, fixedPull(source, [2, 1], {
        point: { type: "PROJECTILE", projectile: anchorRef },
        nearStop: [pull.withinRadius(0.05)],
    }));
    assert.ok(linked.value);
    let endReason;
    const watched = effects.install(linked.state, host, {
        id: "pull-dependent",
        initialize: () => ({}),
        onEnd(current, _effect, reason) {
            endReason = reason;
            return current;
        },
    }, { scopes: [linked.value] });

    let current = projectiles.update(watched.state, anchorRef, { position: [1.01, 1] });
    for (let i = 0; i < 4; i++) current = step(current, []);
    assertPosition(current, [1, 1]);
    assert.equal(lifetime.available(current, linked.value), true);

    current = step(projectiles.update(current, anchorRef, { position: [1.5, 1] }), []);
    assertPosition(current, [1 + 2.5 / 900, 1]);
    current = projectiles.remove(current, anchorRef, "ELIMINATED");
    assert.equal(endReason, "CANCELLED");
    assert.equal(lifetime.available(current, linked.value), false);
    assert.equal(shiftable.isUnbalanced(get(current, 0)), true);
    current = step(current, []);
    assertPosition(current, [1 + 5 / 900, 1]);
    assert.equal(shiftable.isUnbalanced(get(current, 0)), false);
});

test("near braking defaults to ONCE and WHILE_NEAR brakes again", () => {
    const { state, host, source } = setup();
    for (const { options, secondVelocity } of [
        { options: {}, secondVelocity: [0.05, 0] },
        { options: { brake: "WHILE_NEAR" }, secondVelocity: [0, 0] },
    ]) {
        const linked = pull.apply(state, source, host, fixedPull(source, [1.01, 1], {
            nearStop: [pull.withinRadius(0.2)],
            ...options,
        }));
        assert.ok(linked.value);
        const segment = linked.value.unbalance;
        const first = step(unbalance.applyImpulse(linked.state, host, [1.5, 0]).state, []);
        assertPosition(first, [1.05, 1]);
        assert.deepEqual(segment.get(first).velocity, [0, 0]);
        const second = step(unbalance.applyImpulse(first, host, [1.5, 0]).state, []);
        assertPosition(second, [1.10, 1]);
        assert.deepEqual(segment.get(second).velocity, secondVelocity);
    }
});

test("near braking follows displacement and leaves the pull active until explicitly ended", () => {
    let moved = false;
    let pullRef;
    const { state, host, source } = setup({
        ...targetDefinition,
        hooks: Hooks.empty().set(unbalance.forcedMoved, {
            id: "observe-near-stop",
            invoke(current) {
                const position = get(current, 0).position;
                assert.ok(position[0] >= 1.8 && position[0] <= 2.2);
                assert.ok(pullRef.unbalance.get(current).velocity[0] > 0);
                assert.equal(lifetime.available(current, pullRef), true);
                moved = true;
                return { state: current, value: undefined };
            },
        }),
    });
    const linked = pull.apply(state, source, host, fixedPull(source, [2, 1], {
        nearStop: [pull.withinRadius(0.2)],
        brake: "ONCE",
    }));
    pullRef = linked.value;
    assert.ok(pullRef);
    let current = step(unbalance.applyImpulse(linked.state, host, [24, 0]).state, []);
    assert.equal(moved, true);
    assert.deepEqual(pullRef.unbalance.get(current).velocity, [0, 0]);
    for (let i = 0; i < 3; i++) current = step(current, []);
    assert.equal(lifetime.available(current, pullRef), true);
    assert.equal(shiftable.isUnbalanced(get(current, 0)), true);

    current = pull.remove(current, pullRef);
    assert.equal(lifetime.available(current, pullRef), false);
    assert.equal(shiftable.isUnbalanced(get(current, 0)), true);
    current = step(current, []);
    assert.equal(shiftable.isUnbalanced(get(current, 0)), false);
});

test("immunity rejects reception and ends an existing segment before displacement", () => {
    const { state, host } = setup();
    const pushed = unbalance.applyImpulse(state, host, [30, 0]);
    const immunity = effects.install(pushed.state, host, unbalanceImmunity);
    assert.equal(unbalance.applyImpulse(immunity.state, host, [30, 0]).value, null);
    assert.equal(shiftable.isUnbalanced(get(immunity.state, 0)), true);

    const advanced = step(immunity.state, []);
    assertPosition(advanced, [1, 1]);
    assert.equal(shiftable.isUnbalanced(get(advanced, 0)), false);
    assert.equal(lifetime.available(advanced, pushed.value), false);

    const released = effects.remove(advanced, immunity.value, "SCRIPT");
    const knocked = unbalance.applyImpulse(released, host, [30, 0]);
    assert.ok(knocked.value);
    assertPosition(step(knocked.state, []), [2, 1]);
});

test("runtime friction applies during a segment and the next segment until restored", () => {
    const { state, host } = setup({
        ...targetDefinition,
        shiftable: { ...targetDefinition.shiftable, body: { ...body, frictionFactor: 2 } },
    });
    const impulse = [3, 0];
    const speed = 0.1;
    const defaultSpeedAfterFriction = speed - 0.0109;
    const first = unbalance.applyImpulse(state, host, impulse);
    assert.ok(first.value);
    let current = step(first.state, []);
    assertPosition(current, [1 + defaultSpeedAfterFriction, 1]);

    current = units.update(current, host, shiftable.setFrictionFactor(0));
    current = step(current, []);
    const restingX = 1 + 2 * defaultSpeedAfterFriction;
    assertPosition(current, [restingX, 1]);

    current = unbalance.setVelocity(current, first.value, [0, 0]);
    for (let i = 0; i < 3; i++) current = step(current, []);
    assert.equal(shiftable.isUnbalanced(get(current, 0)), false);

    const second = unbalance.applyImpulse(current, host, impulse);
    assert.ok(second.value);
    assert.notEqual(second.value, first.value);
    current = step(second.state, []);
    assertPosition(current, [restingX + speed, 1]);

    current = units.update(current, host, shiftable.restoreFrictionFactor());
    assertPosition(step(current, []), [restingX + speed + defaultSpeedAfterFriction, 1]);
});

test("forced movement slides along a physical wall and publishes its committed contact", () => {
    let contact;
    const { state, host } = setup({
        ...targetDefinition,
        hooks: Hooks.empty().set(unbalance.forcedMoved, {
            id: "record-contact",
            invoke(current, movement) {
                assertPosition(current, [1.4, 1.5]);
                contact = movement.contacts;
                return { state: current, value: undefined };
            },
        }),
    });
    const tile = getTile(state.battlefield.map, [1, 2]);
    const wall = updateTile(state, [1, 2], {
        ...tile.state,
        collision: { type: "BOX", offset: [0, 0], halfExtents: [0.5, 0.5] },
    });
    const moved = step(unbalance.applyImpulse(wall, host, [45, 15]).state, []);
    assertPosition(moved, [1.4, 1.5]);
    assert.deepEqual(contact, [{ tile: [1, 2], normal: [-1, 0] }]);
});

test("ending a segment settles its pulls even when a pull dependent starts the next segment", () => {
    const { state, host, source } = setup();
    const first = pull.apply(state, source, host, fixedPull(source, [5, 1]));
    assert.ok(first.value);
    const oldScope = first.value.unbalance;
    const oldPullScope = first.value;
    let next;
    const installed = effects.install(first.state, host, {
        id: "rebound",
        initialize: () => ({}),
        onEnd(current) {
            assert.equal(shiftable.isUnbalanced(get(current, 0)), false);
            assert.equal(lifetime.available(current, oldScope), false);
            assert.equal(lifetime.available(current, oldPullScope), false);
            const started = pull.apply(current, source, host, fixedPull(source, [1, 2]));
            next = started.value;
            return started.state;
        },
    }, { scopes: [oldPullScope] });
    const ended = lifetime.end(installed.state, first.value.unbalance, "SETTLED");
    assert.ok(next);
    assert.notEqual(next.unbalance, first.value.unbalance);
    assert.equal(first.value.get(ended), undefined);
    assert.equal(lifetime.available(ended, next), true);
    assertPosition(step(pull.remove(ended, first.value), []), [1, 1 + 40 / 900]);
});
