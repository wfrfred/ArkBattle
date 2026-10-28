import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { lifetime as skillLifetime } from "../../dist/core/unit/skill/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { getUnit } from "../helpers/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as skills from "../../dist/core/unit/skill/operations.js";
import { ref as activationRef } from "../../dist/core/unit/skill/activation.js";
import * as query from "../../dist/core/unit/skill/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { initialize } from "../helpers/unit.js";
import { definition as effectDefinition, effectFixtureWork } from "../helpers/effects.js";
import { ref as skillRef, definition, at } from "../helpers/skill.js";

function fixture(callbacks = {}) {
    const ended = [];
    const disabled = [];
    const owned = effectDefinition("skill-owned", {}, {
        onDisable(battle, self) {
            disabled.push(self.id);
            return callbacks.disable?.(battle, self) ?? battle;
        },
    });
    const installOwned = (battle, source, self, expected = true) => {
        for (const extra of [[], [lifetimeScope(unitLifetime, unitRef(getUnit(battle, 1)))]]) {
            const installed = effects.install(battle, unitRef(getUnit(battle, 1)), owned, {
                source,
                scopes: [lifetimeScope(skillLifetime, activationRef(source, self)), ...extra],
            });
            battle = installed.state;
            assert.equal(installed.value !== undefined, expected);
        }
        return battle;
    };
    const skill = definition({ sp: null, activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onStart: (battle, source, self) => callbacks.start?.(battle, source, self, installOwned) ?? installOwned(battle, source, self),
        onEnd(battle, source, self, end) {
            const host = getUnit(battle, source.id);
            ended.push({ status: host?.skill.activation?.status, lifecycle: host?.lifecycle, end });
            return callbacks.end?.(battle, source, self, end) ?? battle;
        },
    } });
    const source = initialize({ id: 0, position: [0, 0], definition: { hooks: [], id: "source", skill, vitality: { maxHp: 100, defense: 0, resistance: 0 } } });
    const receiver = initialize({ id: 1, position: [1, 0], definition: { hooks: [], id: "receiver", vitality: { maxHp: 100, defense: 0, resistance: 0 } } });
    return { state: effectFixtureWork(source, receiver), source: unitRef(source), ended, disabled };
}

for (const reason of ["DEATH", "RETREAT", "SCRIPT"]) {
    test(`${reason} closes skill dependents once before removing the host`, () => {
        const f = fixture();
        const started = skills.activate(f.state, skillRef(getUnit(f.state, f.source.id)));
        const state = remove(at(started.state, 1), 0, reason);
        assert.equal(getUnit(state, 0), undefined);
        assert.deepEqual(getUnit(state, 1).effects.values().toArray(), []);
        assert.deepEqual(f.disabled, [0, 1]);
        assert.deepEqual(f.ended, [{ status: "ENDING", lifecycle: "LEAVING", end: { type: "CANCELLED", reason } }]);
        assert.equal(state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
        assert.equal(getUnit(started.state, 0).skill.activation.status, "ACTIVE");
        assert.equal(getUnit(started.state, 1).effects.values().toArray().length, 2);
        assert.equal(remove(state, 0, reason), state);
        assert.equal(f.ended.length, 1);
    });
}

test("entered start content continues after host departure and late lifetime dependencies are rejected", () => {
    const trace = [];
    const f = fixture({ start(battle, source, self, installOwned) {
        battle = installOwned(battle, source, self);
        battle = remove(battle, source.id, "SCRIPT");
        trace.push("continued");
        assert.equal(query.getActivation(battle, activationRef(source, self)), undefined);
        battle = installOwned(battle, source, self, false);
        assert.equal(getUnit(battle, 1).effects.nextId, 2);
        return battle;
    } });
    const activated = skills.activate(f.state, skillRef(getUnit(f.state, f.source.id)));
    assert.deepEqual(trace, ["continued"]);
    assert.equal(getUnit(activated.state, 0), undefined);
    assert.deepEqual(getUnit(activated.state, 1).effects.values().toArray(), []);
    assert.equal(f.ended.length, 1);
    assert.deepEqual(f.disabled, [0, 1]);
    assert.equal(getUnit(f.state, 0).skill.activation, null);
    assert.equal(getUnit(f.state, 1).effects.nextId, 0);
});

test("termination closes dependent lifetimes before onEnd and reentrant termination has no second effect", () => {
    let callbacks = 0;
    const f = fixture({ end(battle, source, self) {
        callbacks++;
        assert.deepEqual(getUnit(battle, 1).effects.values().toArray(), []);
        assert.equal(query.getActivation(battle, activationRef(source, self)).activation.status, "ENDING");
        assert.equal(skills.finish(battle, activationRef(source, self)), battle);
        assert.equal(skills.cancel(battle, activationRef(source, self), "NESTED"), battle);
        return battle;
    } });
    const started = skills.activate(f.state, skillRef(getUnit(f.state, f.source.id)));
    const finished = skills.finish(started.state, started.value.ref);
    assert.equal(callbacks, 1);
    assert.equal(query.getActivation(finished, started.value.ref), undefined);
    assert.equal(skills.finish(finished, started.value.ref), finished);
    assert.equal(callbacks, 1);
});

test("ending content may create independent remote effects while closed lifetime bindings remain unavailable", () => {
    const independent = effectDefinition("independent");
    let installedRef;
    const f = fixture({ end(battle, source, self) {
        const host = unitRef(getUnit(battle, 1));
        const bound = effects.install(battle, host, independent, { scopes: [lifetimeScope(skillLifetime, activationRef(source, self))] });
        assert.equal(bound.value, undefined);
        const installed = effects.install(bound.state, host, independent);
        installedRef = installed.value;
        return installed.state;
    } });
    const started = skills.activate(f.state, skillRef(getUnit(f.state, f.source.id)));
    const finished = skills.finish(started.state, started.value.ref);
    assert.equal(getUnit(finished, 1).effects.values().toArray().length, 1);
    assert.equal(effects.get(finished, installedRef).status, "ACTIVE");
});

test("departure cleanup failures propagate without changing the input version", () => {
    const failure = new Error("cleanup failed");
    const f = fixture({ disable() { throw failure; } });
    const started = skills.activate(f.state, skillRef(getUnit(f.state, f.source.id)));
    assert.throws(() => remove(started.state, 0, "SCRIPT"), (error) => error === failure);
    assert.equal(getUnit(started.state, 0).lifecycle, "PRESENT");
    assert.equal(getUnit(started.state, 0).skill.activation.status, "ACTIVE");
    assert.equal(getUnit(started.state, 1).effects.values().toArray().length, 2);
});
