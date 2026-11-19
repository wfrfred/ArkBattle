// Contract: [forced movement](../../../docs/architecture/navigation.md#强制位移).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { attribute } from "../../helpers/attribute.js";
import { step } from "../../../dist/core/battle/runtime.js";
import { update as updateTile } from "../../../dist/core/battle/tile.js";
import { get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { Hooks } from "../../../dist/core/hook.js";
import * as lifetime from "../../../dist/core/lifetime/index.js";
import * as projectiles from "../../../dist/core/projectile/index.js";
import * as units from "../../../dist/core/unit/index.js";
import * as effects from "../../../dist/core/unit/effect/index.js";
import * as locomotion from "../../../dist/core/unit/capability/locomotion/index.js";
import { unbalanceImmunity } from "../../../dist/core/effects/protection.js";

const body = { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 }, mass: 1, frictionFactor: 0 };
const definition = {
    id: "forced-movement-target",
    hooks: Hooks.empty(),
    locomotion: {
        body,
        speed: attribute(1),
        halfBodyWidth: 0.1,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
    },
};
const target = () => battle([{ definition, position: [1, 1] }]);

function assertPosition(state, expected) {
    const [x, y] = get(state, 0).position;
    assert.ok(Math.abs(x - expected[0]) < 1e-12, `${x} ≈ ${expected[0]}`);
    assert.ok(Math.abs(y - expected[1]) < 1e-12, `${y} ≈ ${expected[1]}`);
}

test("independent pulls apply their current force until they or their source end", () => {
    let state = target();
    const host = units.ref(get(state, 0));
    const projectile = { id: "pull-source" };
    const first = projectiles.create(state, projectile, { position: [0, 0], state: {} });
    const second = projectiles.create(first.state, projectile, { position: [0, 0], state: {} });
    const left = lifetime.scope(projectiles.lifetime, first.value);
    const right = lifetime.scope(projectiles.lifetime, second.value);
    const initial = locomotion.applyImpulse(second.state, host, [0.6, 0]);
    const repeat = locomotion.applyImpulse(initial.state, host, [0.6, 0]);
    const pullA = locomotion.beginPull(repeat.state, host, left, [9, 0]);
    const repeatPull = locomotion.beginPull(pullA.state, host, left, [9, 0]);
    const pullB = locomotion.beginPull(repeatPull.state, host, right, [0, 9]);
    assert.deepEqual(repeat.value, initial.value);
    assert.deepEqual(repeatPull.value, pullA.value);
    assert.notDeepEqual(pullB.value, pullA.value);

    let endReason;
    const attached = effects.install(pullB.state, host, {
        id: "pull-dependent",
        initialize: () => ({}),
        onEnd(current, _effect, reason) {
            endReason = reason;
            return current;
        },
    }, { scopes: [lifetime.scope(locomotion.pullLifetime, pullB.value)] });
    state = step(attached.state, []);
    assertPosition(state, [1.05, 1.01]);

    state = locomotion.endPull(state, pullA.value, { stopIfLast: true });
    const restarted = locomotion.beginPull(state, host, left, [0, 0]);
    assert.notDeepEqual(restarted.value, pullA.value);
    state = locomotion.endPull(restarted.state, pullA.value);
    assert.equal(lifetime.available(state, lifetime.scope(locomotion.pullLifetime, restarted.value)), true);
    state = locomotion.endPull(state, restarted.value);
    state = locomotion.continuePull(state, pullB.value, [0, 18]).state;
    state = step(state, []);
    assertPosition(state, [1.10, 1.04]);
    state = step(state, []);
    assertPosition(state, [1.15, 1.09]);

    state = projectiles.stop(state, second.value, "DISPEL");
    assert.equal(endReason, "DISPEL");
    state = step(state, []);
    assertPosition(state, [1.20, 1.14]);

    const last = locomotion.beginPull(state, host, left, [0, 0]);
    state = locomotion.endPull(last.state, last.value, { stopIfLast: true });
    assertPosition(step(state, []), [1.20, 1.14]);
});

test("immunity rejects reception and ends an existing segment before displacement", () => {
    const state = target();
    const host = units.ref(get(state, 0));
    const pushed = locomotion.applyImpulse(state, host, [30, 0]);
    const immunity = effects.install(pushed.state, host, unbalanceImmunity);
    assert.equal(locomotion.applyImpulse(immunity.state, host, [30, 0]).value, null);
    assert.equal(locomotion.isUnbalanced(get(immunity.state, 0)), true);

    const advanced = step(immunity.state, []);
    assertPosition(advanced, [1, 1]);
    assert.equal(locomotion.isUnbalanced(get(advanced, 0)), false);
    assert.equal(lifetime.available(advanced, lifetime.scope(locomotion.unbalanceLifetime, pushed.value)), false);

    const released = effects.end(advanced, immunity.value, "SCRIPT");
    const knocked = locomotion.applyImpulse(released, host, [30, 0]);
    assert.ok(knocked.value);
    assertPosition(step(knocked.state, []), [2, 1]);
});

test("forced movement slides along a physical wall and publishes its committed contact", () => {
    let contact;
    let state = battle([{
        position: [1, 1],
        definition: {
            ...definition,
            hooks: Hooks.empty().set(locomotion.forcedMoved, {
                id: "record-contact",
                invoke(current, movement) {
                    assertPosition(current, [1.4, 1.5]);
                    contact = movement.contacts;
                    return { state: current, value: undefined };
                },
            }),
        },
    }]);
    const tile = getTile(state.battlefield.map, [1, 2]);
    state = updateTile(state, [1, 2], {
        ...tile.state,
        collision: { type: "BOX", offset: [0, 0], halfExtents: [0.5, 0.5] },
    });
    state = locomotion.applyImpulse(state, units.ref(get(state, 0)), [45, 15]).state;
    state = step(state, []);
    assertPosition(state, [1.4, 1.5]);
    assert.deepEqual(contact, [{ tile: [1, 2], normal: [-1, 0] }]);
});

test("ending a segment settles its pulls even when a pull dependent starts the next segment", () => {
    const state = target();
    const host = units.ref(get(state, 0));
    const source = projectiles.create(state, { id: "rebound-source" }, { position: [0, 0], state: {} });
    const sourceScope = lifetime.scope(projectiles.lifetime, source.value);
    const first = locomotion.beginPull(source.state, host, sourceScope, [9, 0]);
    const oldScope = lifetime.scope(locomotion.unbalanceLifetime, first.value.unbalance);
    const oldPullScope = lifetime.scope(locomotion.pullLifetime, first.value);
    let next;
    const installed = effects.install(first.state, host, {
        id: "rebound",
        initialize: () => ({}),
        onEnd(current) {
            assert.equal(locomotion.isUnbalanced(get(current, 0)), false);
            assert.equal(lifetime.available(current, oldScope), false);
            assert.equal(lifetime.available(current, oldPullScope), false);
            const started = locomotion.beginPull(current, host, sourceScope, [0, 900]);
            next = started.value;
            return started.state;
        },
    }, { scopes: [oldPullScope] });
    const ended = locomotion.unbalanceLifetime.end(installed.state, first.value.unbalance, "SETTLED");
    assert.ok(next);
    assert.notDeepEqual(next.unbalance, first.value.unbalance);
    assert.deepEqual(lifetime.dependencies(ended, oldPullScope), []);
    assert.equal(lifetime.available(ended, lifetime.scope(locomotion.pullLifetime, next)), true);
    assertPosition(step(ended, []), [1, 2]);
});
