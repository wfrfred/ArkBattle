import { getRef } from "../../dist/core/lifetime/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { remove as endUnit } from "../../dist/core/battle/unit.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { getUnit, replaceUnit } from "../helpers/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { definition, effectFixtureWork, install, at } from "../helpers/effects.js";
import { attackEffect, auraUnit, auraEffect } from "../helpers/aura.js";
const move = (battle, id, x) =>
    {
        const currentUnit = getUnit(battle, id);
        return replaceUnit(battle, ({ ...currentUnit, position: [x, 0] }));
    };

test("aura membership persists after a child ends until leave and reentry", () => {
    const receiver = attackEffect("receiver");
    const aura = auraEffect(receiver, { accepts: (unit) => unit.position[0] < 2 });
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1, [1, 0]));
    let ref;
    ({ state: battle, value: ref } = install(battle, aura, 0));
    const child = get(battle, ref).data.bindings[0].refs[0];
    const before = battle;
    battle = effects.end(battle, child);
    battle = effects.advance(at(battle, 1));
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
    assert.deepEqual(get(battle, ref).data.bindings[0].refs, [child]);
    battle = move(battle, 1, 3);
    battle = effects.advance(at(battle, 2));
    assert.deepEqual(get(battle, ref).data.bindings, []);
    battle = move(battle, 1, 1);
    battle = effects.advance(at(battle, 3));
    assert.notDeepEqual(get(battle, ref).data.bindings[0].refs[0], child);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 120);
    assert.equal(unitQueries.get(before, { id: 1 }).effects.values().toArray()[0].status, "ACTIVE");
});

test("aura refresh frequency belongs to its tick callback", () => {
    const aura = auraEffect(attackEffect("interval"), {
        accepts: (unit) => unit.position[0] < 2,
        refreshInterval: 3,
    });
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1, [1, 0]), auraUnit(2, [3, 0]));
    let ref;
    ({ state: battle, value: ref } = install(battle, aura, 0));
    battle = effects.advance(at(battle, 0));
    battle = move(battle, 1, 3);
    battle = move(battle, 2, 1);
    for (const tick of [1, 2]) {
        battle = effects.advance(at(battle, tick));
        assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 120);
        assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 2))), 100);
    }
    battle = effects.advance(at(battle, 3));
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 2))), 120);
    assert.equal(get(battle, ref).data.nextRefreshTick, 6);
});

test("host lifetime closes remote children only when explicitly bound", () => {
    for (const bindLifetime of [true, false]) {
        let battle = effectFixtureWork(auraUnit(0), auraUnit(1));
        const aura = auraEffect(attackEffect(`bound-${bindLifetime}`), { bindLifetime });
        let ref;
        ({ state: battle, value: ref } = install(battle, aura, 0));
        const child = get(battle, ref).data.bindings[0].refs[0];
        battle = endUnit(battle, (unitRef(getUnit(battle, 0))).id, "RETREAT");
        assert.equal(get(battle, ref), undefined);
        assert.equal(get(battle, child) === undefined, bindLifetime);
        assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), bindLifetime ? 100 : 120);
    }
});

test("nested end policies request all receivers before their Finalize callbacks", () => {
    const trace = [];
    const marker = definition("retention-marker");
    const receiver = attackEffect("retention", {
        onEnd(state, self) {
            trace.push(["end", self.host.id]);
            return self.host.id === 1
                ? effects.install(state, unitRef(getUnit(state, 2)), marker, {}).state
                : state;
        },
    });
    const aura = definition(
        "retention-aura",
        { bindings: [] },
        {
            onEnable(state, self) {
                for (const unitId of [1, 2]) {
                    const installed = effects.install(
                        state,
                        unitRef(getUnit(state, unitId)),
                        receiver,
                        {},
                    );
                    state = installed.state;
                    const currentData = effects.get(state, effectRef(self)).data;
                    state = effects.setData(state, effectRef(self), {
                            ...currentData,
                            bindings: [...currentData.bindings, { unitId, ref: installed.value }],
                        });
                }
                return state;
            },
            onEnd(state, self) {
                for (const binding of self.data.bindings) {
                    const keep = getUnit(state, binding.unitId).effects.values().some(
                        (value) => value.definition === marker,
                    );
                    trace.push(["decide", binding.unitId, keep]);
                    if (!keep) state = effects.end(state, binding.ref, "EXPLICIT");
                }
                return state;
            },
        },
    );
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1), auraUnit(2));
    let ref;
    ({ state: battle, value: ref } = install(battle, aura, 0));
    battle = effects.end(battle, ref);
    assert.deepEqual(trace, [
        ["decide", 1, false],
        ["decide", 2, false],
        ["end", 1],
        ["end", 2],
    ]);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 2))), 100);
});

test("group suppression preserves aura members and child identities", () => {
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1));
    const aura = auraEffect(attackEffect("competing-child"), {
        group: { id: "aura", priority: 1 },
    });
    let ref;
    ({ state: battle, value: ref } = install(battle, aura));
    const binding = get(battle, ref).data.bindings[0];
    let winner;
    ({ state: battle, value: winner } = install(
        battle,
        definition(
            "aura-winner",
            {},
            {
                group: { id: "aura", priority: 2 },
            },
        ),
    ));
    assert.equal(get(battle, ref).status, "INACTIVE");
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
    battle = effects.end(battle, winner);
    assert.deepEqual(get(battle, ref).data.bindings[0], binding);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 120);
    assert.equal(getUnit(battle, 1).effects.nextId, 1);
});

test("reenabling refreshes departed receivers before restoring child outputs", () => {
    const enabled = [];
    const receiver = attackEffect("resume", {
        onEnable: (state, self) => {
            enabled.push(self.host.id);
            return state;
        },
    });
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1, [1, 0]), auraUnit(2, [1, 0]));
    let ref;
    ({ state: battle, value: ref } = install(
        battle,
        auraEffect(receiver, { accepts: (unit) => unit.position[0] < 2 }),
        0,
    ));
    const child = get(battle, ref).data.bindings[0].refs[0];
    battle = effects.setEnabled(battle, ref, false);
    enabled.length = 0;
    battle = move(battle, 1, 3);
    battle = effects.setEnabled(battle, ref, true);
    assert.deepEqual(enabled, [2]);
    assert.equal(get(battle, child), undefined);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 2))), 120);
});

test("nested installation can disable an aura before later receivers enter", () => {
    const starts = [];
    const receiver = attackEffect("nested-stop", {
        onInstall(state, self) {
            starts.push(self.host.id);
            return effects.setEnabled(state, getRef(self.scopes[0], effectLifetime), false);
        },
    });
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1), auraUnit(2));
    let ref;
    ({ state: battle, value: ref } = install(battle, auraEffect(receiver), 0));
    assert.deepEqual(starts, [1]);
    assert.equal(get(battle, ref).status, "INACTIVE");
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
    assert.equal(getUnit(battle, 2).effects.values().toArray().length, 0);
});

test("nested child installation ending the aura does not revive parent or child", () => {
    const starts = [];
    const receiver = attackEffect("nested-end", {
        onInstall(state, self) {
            starts.push(self.host.id);
            return effects.end(state, getRef(self.scopes[0], effectLifetime), "EXPLICIT");
        },
    });
    let battle = effectFixtureWork(auraUnit(0), auraUnit(1), auraUnit(2));
    let ref;
    ({ state: battle, value: ref } = install(battle, auraEffect(receiver), 0));
    assert.equal(get(battle, ref), undefined);
    assert.deepEqual(starts, [1]);
    assert.deepEqual(getUnit(battle, 1).effects.values().toArray(), []);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 100);
});
