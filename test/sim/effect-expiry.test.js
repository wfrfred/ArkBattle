import { deadline, ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";
import * as effect from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import { effectFixtureWork, install, definition, at } from "../helpers/effects.js";

const unit = () =>
    initialize({
        id: 0,
        position: [0, 0],
        definition: { hooks: [], id: "expiry-unit", vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    });

test("effect deadlines: writes wait for advance and termination remains ENDING through cleanup", () => {
    const trace = [];
    const value = definition(
        "deadline",
        {},
        {
            onInstall(state, self) {
                const changed = effect.setDeadline(state, effectRef(self), 2);
                assert.equal(get(changed, effectRef(self)).status, "INSTALLING");
                return changed;
            },
            onTick: (state, self) => {
                trace.push(["tick", state.tick]);
                return state;
            },
            onDisable: (state, self) => {
                trace.push(["disable"]);
                const changed = effect.setDeadline(state, effectRef(self), 8);
                assert.equal(get(changed, effectRef(self)).status, "ENDING");
                return changed;
            },
            onEnd: (state, self) => {
                trace.push(["end", self.status]);
                assert.equal(deadline(self), 8);
                const changed = effect.setDeadline(state, effectRef(self), null);
                assert.equal(get(changed, effectRef(self)).status, "ENDING");
                assert.equal(deadline(get(changed, effectRef(self))), null);
                return changed;
            },
        },
    );
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value));
    assert.deepEqual(trace, []);
    battle = effect.advance(at(battle, 1));
    assert.ok(get(battle, ref));
    battle = effect.setDeadline(at(battle, 2), ref, 1);
    assert.equal(get(battle, ref).status, "ACTIVE");
    assert.deepEqual(trace, [["tick", 1]]);
    battle = effect.advance(battle);
    assert.equal(get(battle, ref), undefined);
    battle = effect.advance(at(battle, 3));
    assert.deepEqual(trace, [["tick", 1], ["tick", 2], ["disable"], ["end", "ENDING"]]);
});

test("effect deadlines: layered content renews the same identity and ends only after its last layer", () => {
    const value = definition(
        "layered",
        { layers: 3, deadline: 2 },
        {
            onTick(state, self) {
                if (state.tick < self.data.deadline) return state;
                const layers = self.data.layers - 1;
                if (layers === 0) {
                    return effect.end(state, effectRef(self), "LAYERS_EXHAUSTED");
                }
                const deadline = state.tick + 2;
                const currentData = effect.get(state, effectRef(self)).data;
                state = effect.setData(state, effectRef(self), { ...currentData, layers, deadline });
                return effect.setDeadline(state, effectRef(self), deadline);
            },
        },
    );
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value, 0, {
        scopes: [{ type: "TICK", tick: 2 }],
    }));
    for (let tick = 0; tick < 6; tick++) battle = effect.advance(at(battle, tick));
    assert.equal(get(battle, ref).data.layers, 1);
    assert.equal(get(battle, ref).id, ref.id);
    battle = effect.advance(at(battle, 6));
    assert.equal(get(battle, ref), undefined);
});

test("effect deadlines: current scopes are read after an earlier callback renews a later candidate", () => {
    let later;
    const early = definition(
        "renewer",
        {},
        {
            onTick(state) {
                return effect.setDeadline(state, later, 10);
            },
        },
    );
    let battle = effectFixtureWork(unit());
    battle = install(battle, early).state;
    ({ state: battle, value: later } = install(battle, definition("later"), 0, {
        scopes: [{ type: "TICK", tick: 2 }],
    }));
    battle = effect.advance(at(battle, 2));
    assert.ok(get(battle, later));
});

test("effect deadlines: removing a deadline keeps an otherwise active instance alive", () => {
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, definition("permanent"), 0, {
        scopes: [{ type: "TICK", tick: 1 }],
    }));
    battle = effect.setDeadline(battle, ref, null);
    battle = effect.advance(at(battle, 100));
    assert.equal(get(battle, ref).status, "ACTIVE");
});
