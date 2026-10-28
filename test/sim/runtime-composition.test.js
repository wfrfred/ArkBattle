import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { lifetime as actionLifetime } from "../../dist/core/unit/action/operations.js";
import * as unitQueries from "../../dist/core/unit/index.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { fixtureBattle } from "../helpers/unit.js";
import { healing } from "../helpers/vitality.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { initialize as initializeActionState } from "../../dist/core/unit/capability/action/index.js";
import {
    setAttackContribution,
    removeAttackContribution,
} from "../../dist/core/unit/capability/offense/index.js";
import {
    setHook as setDamageHook,
    removeHook as removeDamageHook,
} from "../../dist/core/battle/damage/index.js";
import { get as getEffect } from "../../dist/core/unit/effect/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/index.js";

import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";
import { initialize, placement } from "../helpers/unit.js";
import { effectFixtureWork } from "../helpers/effects.js";
import { effectPlacement } from "../helpers/aura.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { actionCapability } from "../helpers/actions.js";
import { executionRef } from "../../dist/core/unit/action/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { install as installEffect, setData as setEffectData, end as endEffect } from "../../dist/core/unit/effect/index.js";
import * as modifier from "../../dist/core/unit/contribution/attribute.js";
import { initialize as initializeVitalityState } from "../../dist/core/unit/capability/vitality/index.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { getUnit, replaceUnit } from "../helpers/unit.js";
import * as tracking from "../../dist/content/projectiles/tracking.js";
import { all as allProjectiles, get as getProjectile, ref as projectileRef } from "../../dist/core/projectile/index.js";
import { create as createProjectile, update as updateProjectile, stop as stopProjectile } from "../../dist/core/battle/projectile.js";

const hit = { type: "CIRCLE", offset: [0, 0], radius: 0.1 };
const range = [{ type: "CIRCLE", offset: [0, 0], radius: 12 }];

function passive(id, hp = 100) {
    return {
        id,
        vitality: { maxHp: hp, defense: 0, resistance: 0 },
        offense: { attack: 10 },
        allegiance: { side: "ENEMY" },
        layer: { type: "GROUND" },
        hitbox: { shape: hit },
    };
}

function actor(id, program) {
    return {
        ...passive(id),
        allegiance: { side: "ALLY" },
        blocker: { capacity: 0, geometry: { radius: 0.1 } },
        action: actionCapability(program),
    };
}

function effect(snapshot, unitId, ref) {
    return unitQueries.all(snapshot).toArray()
        .find((unit) => unit.id === unitId)
        .effects.values().toArray().find((instance) => instance.definition.id === ref.id);
}

function scenario({ failure = null, cancelled = false } = {}) {

    const fault = { enabled: failure !== null };
    const launches = [];
    const scopes = [];
    const attempts = [];
    const reports = [];
    const rejected = [];
    let auraAddress;
    let aura;

    const registerBuff = (id, addition) => ({
        id,
        initialize: () => ({ starts: 0, enables: 0 }),
        onInstall(state, self) {
            const currentData = getEffect(state, effectRef(self)).data;
            return setEffectData(state, effectRef(self), {
                    ...currentData,
                    starts: currentData.starts + 1,
                });
        },
        onEnable(state, self) {
            const currentData = getEffect(state, effectRef(self)).data;
            state = setEffectData(state, effectRef(self), {
                    ...currentData,
                    enables: currentData.enables + 1,
                });
            const id = `effect:${self.id}`;
            const currentUnit = getUnit(state, self.host.id);
            return replaceUnit(state, ({ ...currentUnit, offense: setAttackContribution(currentUnit.offense, {
                    id,
                    value: [modifier.create({ finalAddition: addition })],
                }) }));
        },
        onDisable(state, self) {
            const id = `effect:${self.id}`;
            const currentUnit1 = getUnit(state, self.host.id);
            return replaceUnit(state, ({ ...currentUnit1, offense: removeAttackContribution(currentUnit1.offense, id) }));
        },
    });
    const marker = registerBuff("receiver-mark", 3);
    const marked = (unit) => unit.effects.values().toArray().some(
        (instance) => instance.definition === marker && instance.status === "ACTIVE",
    );
    const scoped = registerBuff("execution-power", 2);
    const pulse = registerBuff("release-power", 1);
    const receiverOutput = registerBuff("aura-receiver", 5);
    const receiver = {
        ...receiverOutput,
        initialize: () => ({ ...receiverOutput.initialize(), uses: 0 }),
        onInstall(state, self) {
            state = receiverOutput.onInstall(state, self);
            const ref = effectRef(self);
            const currentUnit2 = getUnit(state, ref.host.id);
            return replaceUnit(state, ({ ...currentUnit2, vitality: setDamageHook(currentUnit2.vitality, {
                    id: `receiver:${ref.id}`,
                    stage: "receiving",
                    priority: 0,
                    accepts: (battle, invocation) =>
                        getUnit(battle, ref.host.id)?.effects.values().toArray().find(
                            (instance) => instance.id === ref.id,
                        )?.status === "ACTIVE",
                    invoke(state, invocation, pending) {
                        assert.ok(getEffect(state, auraAddress).data.remaining > 0);
                        const currentData = getEffect(state, auraAddress).data;
                        state = setEffectData(state, auraAddress, {
                                ...currentData,
                                remaining: currentData.remaining - 1,
                                consumed: currentData.consumed + 1,
                            });
                        const currentData2 = getEffect(state, ref).data;
                        state = setEffectData(state, ref, {
                                ...currentData2,
                                uses: currentData2.uses + 1,
                            });
                        if (cancelled) {
                            rejected.push({ type: "SKIPPED", reason: "CONTENT_CONDITION" });
                            state = healing(
                                state,
                                {
                                    source: { id: 0 },
                                    target: ref.host,
                                    parameters: { power: 4, multiplier: 1 },
                                },
                            ).state;
                        } else {
                            const installed = installEffect(
                                state,
                                unitRef(getUnit(state, ref.host.id)),
                                marker,
                                {
                                    source: auraAddress.host,
                                    scopes: [lifetimeScope(effectLifetime, ref)],
                                },
                            );
                            assert.ok(installed.value);
                            state = installed.state;
                        }
                        const quota = getEffect(state, auraAddress).data;
                        attempts.push({
                            address: ref,
                            quota: { remaining: quota.remaining, consumed: quota.consumed },
                            marked: marked(getUnit(state, ref.host.id)),
                        });
                        return {
                            state,
                            value: {
                                    ...pending,
                                    amount:
                                        fault.enabled && failure === "invalid-damage"
                                            ? NaN
                                            : pending.amount,
                                    cancellation: cancelled
                                        ? { reason: "BLOCKED" }
                                        : null,
                                },
                        };
                    },
                }) }));
        },
        onEnd(state, self) {
            const currentUnit3 = getUnit(state, self.host.id);
            return replaceUnit(state, ({ ...currentUnit3, vitality: removeDamageHook(currentUnit3.vitality, `receiver:${self.id}`) }));
        },
    };
    aura = {
        id: "combined-aura",
        initialize: () => ({ remaining: 3, consumed: 0, receivers: [] }),
        onInstall(state, self) {
            auraAddress = effectRef(self);
            return state;
        },
        onTick(state, effectSelf) {
            if (state.tick >= 3) {
                return endEffect(state, effectRef(effectSelf), "AURA_FINISHED");
            }
            for (const unitId of unitQueries.all(state).map(unit => unit.id).toArray()) {
                const self = getEffect(state, effectRef(effectSelf));
                if (self === undefined || self.status === "ENDING") return state;
                if (self.data.receivers.some((binding) => binding.unitId === unitId)) continue;
                const currentData = getEffect(state, effectRef(effectSelf)).data;
                state = setEffectData(state, effectRef(effectSelf), {
                        ...currentData,
                        receivers: [...currentData.receivers, { unitId, ref: null, attempts: 1 }],
                    });
                const installed = installEffect(
                    state,
                    unitRef(getUnit(state, unitId)),
                    receiver,
                    {
                        source: effectSelf.host,
                        scopes: [lifetimeScope(effectLifetime, effectRef(effectSelf))],
                    },
                                    );
                state = installed.state;
                const ref = installed.value;
                assert.ok(ref);
                const currentData2 = getEffect(state, effectRef(effectSelf)).data;
                state = setEffectData(state, effectRef(effectSelf), {
                        ...currentData2,
                        receivers: currentData2.receivers.map((binding) =>
                            binding.unitId === unitId ? { ...binding, ref } : binding,
                        ),
                    });
            }
            return state;
        },
    };
    const hitShell = (state, self) => tracking.hit(state, self, (state, self, target) => {
            scopes.push({ projectile: self, targetUnitId: target.id, tick: state.tick });
            const currentProjectile = getProjectile(state, projectileRef(self));
            state = updateProjectile(state, projectileRef(self), {
                state: { ...currentProjectile.state, contacts: currentProjectile.state.contacts + 1 },
            });
            const damaged = dealDamage(state, { source: self.state.source, target: unitRef(target), parameters: parameters(self.state.cachedAtk, "TRUE") });
            state = damaged.state;
            reports.push(damaged.value);
            state = stopProjectile(
                state,
                projectileRef(self),
                "EXPLICIT",
                            );
            if (fault.enabled && failure === "late-projectile") {
                const auraState = getUnit(state, 0).effects.values().toArray().find(
                    (instance) => instance.definition === aura,
                ).data;
                assert.deepEqual(
                    auraState.receivers.map((binding) => binding.unitId),
                    [0, 1, 2, 3],
                );
                assert.equal(getUnit(state, 1).vitality.hp, 83);
                assert.equal(marked(getUnit(state, 1)), true);
                assert.equal(getUnit(state, 2).action.actions.get("launch").cooldown.readyAtTick, 101);
                throw new Error("late composition failure");
            }
            return state;
    });
    const shell = {
        id: "combined-shell", tracking: true,
        onTick: (state, self) => tracking.advance(state, self, hitShell),
        onEnd: (state, self, reason) => reason === "DISPEL" ? state : hitShell(state, self),
    };
    const program = primary => ({
        id: "launch", intervalTicks: 100, speed: 100,
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: { emitted: 0 } }),
        onTick(state, source, self) {
            if (self.execution.state.emitted === 0) {
                state = actions.setExecutionState(state, executionRef(source, self), { emitted: 1 });
                self = actions.getExecution(state, executionRef(source, self));
                state = installation(state, source, self, scoped);
                state = launch(state, source, self, primary ? 1 : 3);
            }
            if (primary && self.execution.state.emitted === 1 && state.tick > self.execution.startedAtTick) {
                state = actions.setExecutionState(state, executionRef(source, self), { emitted: 2 });
                self = actions.getExecution(state, executionRef(source, self));
                state = installation(state, source, self, pulse);
                state = launch(state, source, self, 3);
            }
            return { state, value: state.tick >= self.execution.startedAtTick + (primary ? 3 : 4) };
        },
    });
    const primary = actor("primary-launcher", program(true));
    const sibling = actor("later-launcher", program(false));
    const siblingAction = initializeActionState(fixtureBattle(0), sibling.action).value;
    const currentAction = siblingAction.actions.getAction("launch");
    const delayedSiblingAction = {
        ...siblingAction,
        actions: siblingAction.actions.replace(currentAction.definition, {
            ...currentAction,
            cooldown: { periodTicks: 100, readyAtTick: 1 },
        }),
    };
    const scheduled = { hooks: [],
        spatialPresence: {},
        id: "managed-target",
        vitality: { maxHp: 17, defense: 0, resistance: 0 },
        locomotion: {
            halfBodyWidth: 0, minSpeed: 0, speed: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
        },
        ...passive("managed-target", 17),
    };
    const route = createRouteDefinition({
        pathMotionMode: "WALK",
        startPosition: [0, 6],
        endPosition: [0, 7],
        spawnOffset: [0, 0],
        spawnRandomRange: [0.25, 0.25],
        checkpoints: [{ type: "WAIT_FOR_TICKS", durationTicks: 100 }],
        allowDiagonalMove: false,
        visitEveryTileCenter: false,
        visitEveryNodeCenter: false,
        visitEveryCheckPoint: true,
    });
    const installation = (state, host, context, program) =>
        installEffect(
            state,
            unitRef(getUnit(state, host.id)),
            program,
            {
                source: host,
                scopes: [lifetimeScope(actionLifetime, executionRef(host, context))],
            },
        ).state;
    const launch = (state, host, context, targetUnitId) => {
        const source = getUnit(state, host.id);
        const target = getUnit(state, targetUnitId);
        const launched = createProjectile(state, shell, {
            position: source.position,
            state: {
                source: unitRef(source), target: unitRef(target),
                destination: target.position,
                cachedAtk: resolveAttack(state, unitRef(source)),
                speedPerTick: 1, stopDelayTicks: 0, stopAtTick: null,
                hitAttempted: false, launchedAtTick: state.tick, contacts: 0,
            },
        });
        launches.push({ id: launched.value.id, hostId: host.id, executionId: context.execution.id, targetUnitId });
        return launched.state;
    };
    const runtime = initializeBattle({
            ...createLegacyCombatSpec({
                rows: 3,
                columns: 8,
                operators: [],
                enemies: [],
                maxTicks: 20,
                seed: 17,
            }),
            initialUnits: [
                effectPlacement(
                    aura,
                    initialize({ id: 0, definition: primary, position: [0, 0] }),
                ),
                placement({
                    definition: passive("first-target"),
                    position: [1, 0],
                    ...(cancelled
                        ? {
                              states: {
                                  vitality: {
                                      ...initializeVitalityState(fixtureBattle(0), { maxHp: 100, defense: 0, resistance: 0 }).value,
                                      hp: 40,
                                  },
                              },
                          }
                        : {}),
                }),
                placement({
                    definition: sibling,
                    position: [0, 2],
                    states: { action: delayedSiblingAction },
                }),
            ],
            initialMechanisms: [],
            schedule: {
                type: "TIMELINE",
                spawns: [
                    {
                        definition: scheduled,
                        route,
                        tick: 1,
                        timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 },
                        alwaysCheckCurrentPoint: true,
                        notCountInTotal: false,
                    },
                ],
            },
        });
    return {
        runtime,
        fault,
        launches,
        attempts,
        scopes,
        reports,
        rejected,
        aura: aura,
        receiver: receiver,
        marker: marker,
        scoped: scoped,
        pulse: pulse,
    };
}

test("runtime composition: late exceptions and invalid settlement propagate without publishing any domain", () => {
    for (const failure of ["late-projectile", "invalid-damage"]) {
        const failed = scenario({ failure });
        failed.runtime = stepBattle(failed.runtime, []);
        const before = failed.runtime;
        const maps = failed.runtime.battlefield.navigation;
        assert.equal(unitQueries.all(before).toArray().find(unit => unit.id === 0).action.nextExecutionId, 1);
        assert.equal(before.execution.nextProjectileId, 1);
        assert.equal(before.execution.nextUnitId, 3);
        assert.equal(before.schedule.spawnedCount, 0);
        assert.equal(effect(before, 0, failed.scoped).data.starts, 1);
        assert.equal(resolveAttack(before, unitRef(unitQueries.all(before).toArray().find((unit) => unit.id === 0))), 17);

        assert.throws(
            () => (failed.runtime = stepBattle(failed.runtime, [])),
            {
                "late-projectile": /late composition failure/,
                "invalid-damage": RangeError,
            }[failure],
        );
        assert.deepEqual(failed.runtime, before);
        assert.equal(failed.runtime.battlefield.navigation, maps);
        assert.deepEqual(
            failed.launches.map((launch) => [launch.id, launch.hostId, launch.executionId]),
            [
                [0, 0, 0],
                [1, 0, 0],
                [2, 2, 0],
            ],
        );
        assert.deepEqual(failed.attempts, [
            {
                address: { host: { id: 1 }, id: 0 },
                quota: { remaining: 2, consumed: 1 },
                marked: true,
            },
        ]);
    }
});

test("runtime composition: a successful battle preserves identities, snapshots and the terminal trace", () => {
    const run = scenario();
    const replay = scenario();
    const serialized = (value) => JSON.parse(JSON.stringify(value));
    const first = (run.runtime = stepBattle(run.runtime, []));
    assert.deepEqual(serialized(first.events), serialized((replay.runtime = stepBattle(replay.runtime, [])).events));
    const events = [...first.events];
    const before = run.runtime;
    const second = (run.runtime = stepBattle(run.runtime, []));
    assert.deepEqual(serialized(second.events), serialized((replay.runtime = stepBattle(replay.runtime, [])).events));
    assert.deepEqual(serialized(unitQueries.all(run.runtime).toArray()), serialized(unitQueries.all(replay.runtime).toArray()));
    assert.deepEqual(run.runtime.execution, replay.runtime.execution);
    assert.deepEqual(serialized(run.runtime.schedule), serialized(replay.runtime.schedule));
    assert.deepEqual(serialized(allProjectiles(run.runtime).map(self => ({ id: self.id, position: self.position, state: self.state })).toArray()),
      serialized(allProjectiles(replay.runtime).map(self => ({ id: self.id, position: self.position, state: self.state })).toArray()));
    events.push(...second.events);
    const after = run.runtime;
    assert.equal(effect(before, 0, run.aura).definition, run.aura);
    assert.equal(effect(after, 0, run.aura).definition, run.aura);
    assert.equal(effect(after, 1, run.receiver).definition, run.receiver);
    assert.notEqual(after.execution.rngState, before.execution.rngState);
    assert.equal(after.execution.nextUnitId, 4);
    assert.equal(after.schedule.cursor, 1);
    assert.equal(after.schedule.spawnedCount, 1);
    assert.deepEqual(after.schedule.managedFinalUnitIds, [3]);
    assert.equal(unitQueries.all(after).toArray().find(unit => unit.id === 2).action.nextExecutionId, 1);
    assert.equal(unitQueries.all(after).toArray().find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray()[0].execution.state.emitted, 2);
    assert.equal(after.execution.nextProjectileId, 3);
    assert.deepEqual(
        allProjectiles(after).map(self => self.id).toArray(),
        [1, 2],
    );
    assert.deepEqual(
        allProjectiles(after).map(self => self.state.cachedAtk).toArray(),
        [18, 17],
    );
    assert.equal(resolveAttack(after, unitRef(unitQueries.all(after).toArray().find((unit) => unit.id === 0))), 18);
    assert.equal(effect(after, 0, run.aura).data.remaining, 2);
    assert.equal(effect(after, 0, run.aura).data.consumed, 1);
    assert.deepEqual(
        effect(after, 0, run.aura).data.receivers.map((binding) => binding.attempts),
        [1, 1, 1, 1],
    );
    assert.deepEqual(effect(after, 3, run.receiver).data, { starts: 1, enables: 1, uses: 0 });
    assert.deepEqual(effect(after, 1, run.receiver).data, { starts: 1, enables: 1, uses: 1 });
    assert.equal(effect(after, 1, run.marker).id, 1);
    assert.deepEqual(effect(after, 1, run.marker).scopes, [
        lifetimeScope(effectLifetime, { host: { id: 1 }, id: 0 }),
    ]);
    assert.equal(unitQueries.all(after).toArray().find((unit) => unit.id === 1).effects.nextId, 2);
    assert.equal(unitQueries.all(before).toArray().find((unit) => unit.id === 1).effects.nextId, 1);
    assert.equal(
        effect(after, 1, run.marker)?.status === "ACTIVE",
        true,
    );
    assert.equal(unitQueries.all(after).toArray().find((unit) => unit.id === 1).vitality.hp, 83);
    assert.deepEqual(
        run.launches.map((launch) => launch.id),
        [0, 1, 2],
    );
    assert.deepEqual(
        unitQueries.all(before).toArray().map((unit) => unit.id),
        [0, 1, 2],
    );
    assert.equal(effect(before, 0, run.aura).data.remaining, 3);
    assert.equal(effect(before, 0, run.aura).data.consumed, 0);
    assert.deepEqual(
        effect(before, 0, run.aura).data.receivers.map((binding) => binding.unitId),
        [0, 1, 2],
    );
    assert.equal(unitQueries.all(before).toArray()[1].vitality.hp, 100);

    while (run.runtime.result === null) {
        const actual = (run.runtime = stepBattle(run.runtime, []));
        assert.deepEqual(serialized(actual.events), serialized((replay.runtime = stepBattle(replay.runtime, [])).events));
        assert.deepEqual(serialized(unitQueries.all(run.runtime).toArray()), serialized(unitQueries.all(replay.runtime).toArray()));
    assert.deepEqual(run.runtime.execution, replay.runtime.execution);
    assert.deepEqual(serialized(run.runtime.schedule), serialized(replay.runtime.schedule));
    assert.deepEqual(serialized(allProjectiles(run.runtime).map(self => ({ id: self.id, position: self.position, state: self.state })).toArray()),
      serialized(allProjectiles(replay.runtime).map(self => ({ id: self.id, position: self.position, state: self.state })).toArray()));
        events.push(...actual.events);
        if (run.runtime.tick === 4) {
            const cleaned = run.runtime;
            assert.equal(effect(cleaned, 0, run.aura), undefined);
            assert.ok(
                unitQueries.all(cleaned).toArray().every((unit) => effect(cleaned, unit.id, run.receiver) === undefined),
            );
            assert.equal(effect(before, 0, run.aura).status, "ACTIVE");
            assert.equal(
                effect(cleaned, 1, run.marker)?.status === "ACTIVE",
                false,
            );
            assert.equal(resolveAttack(cleaned, unitRef(unitQueries.all(cleaned).toArray().find((unit) => unit.id === 0))), 10);
            assert.equal(effect(cleaned, 0, run.scoped), undefined);
            assert.equal(effect(cleaned, 0, run.pulse), undefined);
        }
        if (run.runtime.tick === 5) {
            const finalized = run.runtime;
            assert.equal(effect(finalized, 0, run.scoped), undefined);
            assert.equal(effect(finalized, 0, run.pulse), undefined);
            assert.equal(effect(finalized, 1, run.marker), undefined);
        }
    }
    assert.deepEqual(
        events.filter((event) => event.type === "ENEMY_SPAWNED").map((event) => event.unitId),
        [3],
    );
    assert.deepEqual(
        events
            .filter((event) => event.type === "PROJECTILE_HIT")
            .map((event) => [event.projectileId, event.targetUnitId]),
        [
            [0, 1],
            [1, 3],
        ],
    );
    assert.deepEqual(
        events
            .filter((event) => event.type === "DAMAGE")
            .map((event) => [event.targetUnitId, event.amount]),
        [
            [1, 17],
            [3, 17],
        ],
    );
    assert.equal(run.reports.at(-1).received.amount, 18);
    assert.equal(run.reports.at(-1).application.hpLoss, 17);
    assert.equal(run.runtime.result.reason, "SCHEDULE_COMPLETED");
    assert.equal(run.runtime.result.spawnedCount, 1);
    assert.equal(run.runtime.result.unspawnedCount, 0);
    assert.equal(run.runtime.result.completedRouteCount, 0);
    assert.deepEqual(run.runtime.result.remainingUnitIds, [0, 1, 2]);
    assert.ok(run.runtime.result.elapsedTicks >= 7);
    const final = run.runtime;
    assert.strictEqual((run.runtime = stepBattle(run.runtime, [])), final);
});

test("runtime composition: content conditions skip installation while cancelled damage retains consumption and healing", () => {
    const run = scenario({ cancelled: true });
    run.runtime = stepBattle(run.runtime, []);
    const reached = (run.runtime = stepBattle(run.runtime, []));
    const after = run.runtime;
    assert.deepEqual(run.rejected, [
        {
            type: "SKIPPED",
            reason: "CONTENT_CONDITION",
        },
    ]);
    assert.equal(run.reports[0].kind, "CANCELLED");
    assert.deepEqual(run.reports[0].received.cancellation, { reason: "BLOCKED" });
    assert.deepEqual(
        reached.events
            .filter((event) => ["HEAL", "DAMAGE"].includes(event.type))
            .map((event) => [event.type, event.targetUnitId, event.amount, event.hp]),
        [
            ["HEAL", 1, 4, 44],
            ["DAMAGE", 1, 0, 44],
        ],
    );
    assert.equal(after.tick, 2);
    assert.equal(after.execution.nextUnitId, 4);
    assert.equal(after.schedule.spawnedCount, 1);
    assert.equal(unitQueries.all(after).toArray().find(unit => unit.id === 2).action.nextExecutionId, 1);
    assert.equal(after.execution.nextProjectileId, 3);
    assert.equal(effect(after, 0, run.aura).data.remaining, 2);
    assert.equal(effect(after, 0, run.aura).data.consumed, 1);
    assert.equal(effect(after, 1, run.receiver).data.uses, 1);
    assert.equal(effect(after, 1, run.marker), undefined);
    assert.equal(
        effect(after, 1, run.marker)?.status === "ACTIVE",
        false,
    );
    assert.equal(resolveAttack(after, unitRef(unitQueries.all(after).toArray().find((unit) => unit.id === 1))), 15);
    assert.equal(unitQueries.all(after).toArray().find((unit) => unit.id === 1).effects.nextId, 1);
    while (run.runtime.result === null) run.runtime = stepBattle(run.runtime, []);
    const final = run.runtime;
    assert.equal(final.result.reason, "SCHEDULE_COMPLETED");
    assert.equal(unitQueries.all(final).toArray().find((unit) => unit.id === 1).vitality.hp, 44);
    assert.equal(
        effect(final, 1, run.marker)?.status === "ACTIVE",
        false,
    );
    assert.equal(resolveAttack(final, unitRef(unitQueries.all(final).toArray().find((unit) => unit.id === 1))), 10);
});
