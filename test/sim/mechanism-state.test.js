import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as mechanisms from "../../dist/core/battle/mechanism.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { remove as removeUnit } from "../../dist/core/battle/unit.js";
import { step } from "../../dist/core/battle/runtime.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { fixtureBattle, initialize } from "../helpers/unit.js";

const counter = (id, extra = {}) => mechanisms.createMechanismDefinition({
    id, initialize: () => ({ count: 0 }), ...extra,
});

function register(battle, definition, options) {
    const created = mechanisms.create(battle, definition, options);
    return [created.state, created.value];
}

test("mechanism instances keep typed independent state and old snapshots", () => {
    const initial = fixtureBattle();
    const definition = counter("shared");
    const [first, left] = register(initial, definition);
    const [base, right] = register(first, definition);
    const currentState = mechanisms.get(base, left).state;
    const updated = mechanisms.setState(base, left, { count: currentState.count + 1 });

    assert.equal(initial.mechanisms.size, 0);
    assert.equal("mechanisms" in base.battlefield, false);
    assert.equal(mechanisms.get(base, left).definition, definition);
    assert.equal(mechanisms.get(updated, left).state.count, 1);
    assert.equal(mechanisms.get(base, left).state.count, 0);
    assert.equal(mechanisms.get(updated, right).state.count, 0);
    assert.notEqual(mechanisms.get(base, left).state, mechanisms.get(base, right).state);
    assert.equal(base.battlefield, initial.battlefield);
    assert.equal(updated.execution, base.execution);
    assert.equal(base.execution.nextMechanismId, 2);
    const currentState2 = mechanisms.get(base, left).state;
    assert.equal(mechanisms.setState(base, left, currentState2), base);
    assert.deepEqual(base.mechanisms.keys().toArray(), [left.id, right.id]);

    const sibling = mechanisms.setState(base, right, { count: 9 });
    assert.equal(mechanisms.get(sibling, left).state.count, 0);
    assert.equal(mechanisms.get(updated, right).state.count, 0);
    assert.equal(base.mechanisms.get(left.id, definition), mechanisms.get(base, left));
    assert.equal(base.mechanisms.get(left.id, counter("shared")), undefined);
});

test("mechanism private updates and identity allocation reject invalid operations", () => {
    const initial = fixtureBattle();
    const definition = counter("counter");
    const [battle, reference] = register(initial, definition);
    const self = mechanisms.get(battle, reference);
    assert.equal(mechanisms.remove(initial, reference), initial);
    assert.equal(mechanisms.setActive(initial, reference, false), initial);
    assert.throws(() => mechanisms.setState(initial, reference, { count: 1 }), RangeError);
    assert.throws(() => battle.mechanisms.replace(reference, { ...self, id: 99 }), TypeError);
    assert.throws(() => battle.mechanisms.replace(reference, {
        ...self, definition: counter("other"),
    }), TypeError);
    assert.throws(() => initial.mechanisms.remove(reference.id), RangeError);
    for (const id of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
        assert.throws(() => mechanisms.create({
            ...initial, execution: { ...initial.execution, nextMechanismId: id },
        }, definition), RangeError);
    }
    assert.equal(battle.mechanisms.size, 1);
    assert.equal(mechanisms.get(battle, reference), self);
});

test("disable and end publish lifecycle before reentrant callbacks", () => {
    const trace = [];
    const [initial, sibling] = register(fixtureBattle(), counter("sibling"));
    const definition = counter("cleanup", {
        onDisable(battle, self) {
            const reference = mechanisms.ref(self);
            trace.push(["disable", mechanisms.get(battle, reference).status]);
            assert.equal(mechanisms.setActive(battle, reference, false), battle);
            const currentState = mechanisms.get(battle, reference).state;
            return mechanisms.setState(battle, reference, { count: currentState.count + 1 });
        },
        onEnd(battle, self) {
            const reference = mechanisms.ref(self);
            trace.push(["end", mechanisms.get(battle, reference).status, self.state.count]);
            assert.equal(mechanisms.remove(battle, reference), battle);
            assert.equal(mechanisms.setActive(battle, reference, true), battle);
            const currentState = mechanisms.get(battle, reference).state;
            battle = mechanisms.setState(battle, reference, { count: currentState.count + 1 });
            return mechanisms.setState(battle, sibling, { count: 7 });
        },
    });
    const [active, reference] = register(initial, definition);
    const inactive = mechanisms.setActive(active, reference, false);
    assert.equal(mechanisms.get(inactive, reference).state.count, 1);
    assert.equal(mechanisms.get(active, reference).status, "ACTIVE");
    assert.equal(mechanisms.setActive(inactive, reference, false), inactive);
    const removed = mechanisms.remove(inactive, reference);
    assert.deepEqual(trace, [["disable", "INACTIVE"], ["end", "ENDING", 1]]);
    assert.equal(mechanisms.get(removed, reference), undefined);
    assert.equal(mechanisms.get(removed, sibling).state.count, 7);
    assert.equal(mechanisms.remove(removed, reference), removed);
    assert.equal(mechanisms.get(active, sibling).state.count, 0);
    assert.equal(mechanisms.get(inactive, reference).status, "INACTIVE");
});

test("removing an active mechanism disables output before its single Finalize", () => {
    const trace = [];
    const [battle, reference] = register(fixtureBattle(), counter("active-end", {
        onDisable: state => { trace.push("disable"); return state; },
        onEnd: state => { trace.push("end"); return state; },
    }));
    const removed = mechanisms.remove(battle, reference);
    assert.deepEqual(trace, ["disable", "end"]);
    assert.equal(mechanisms.get(removed, reference), undefined);
});

test("advance fixes identities, rechecks latest state, and does not restore a removed self", () => {
    let removed;
    let activated;
    let created;
    const definition = counter("first", {
        onTick(battle, self) {
            battle = mechanisms.remove(battle, removed);
            battle = mechanisms.setActive(battle, activated, true);
            const added = mechanisms.create(battle, counter("created", {
                onTick: (state, next) => {
                    const currentState = mechanisms.get(state, mechanisms.ref(next)).state;
                    return mechanisms.setState(state, mechanisms.ref(next),
                    { count: currentState.count + 1 });
                },
            }));
            created = added.value;
            return mechanisms.remove(added.state, mechanisms.ref(self));
        },
    });
    let battle;
    let first;
    [battle, first] = register(fixtureBattle(), definition);
    [battle, removed] = register(battle, counter("removed", {
        onTick: () => assert.fail("removed candidates must be skipped"),
    }));
    [battle, activated] = register(battle, counter("activated", {
        onTick: (state, self) => {
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            return mechanisms.setState(state, mechanisms.ref(self),
            { count: currentState.count + 1 });
        },
    }), { active: false });
    const before = battle;
    battle = mechanisms.advance(battle);
    assert.equal(mechanisms.get(battle, first), undefined);
    assert.equal(mechanisms.get(battle, removed), undefined);
    assert.equal(mechanisms.get(battle, activated).state.count, 1);
    assert.equal(mechanisms.get(battle, created).state.count, 0);
    assert.equal(mechanisms.get(before, activated).status, "INACTIVE");
    battle = mechanisms.advance(battle);
    assert.equal(mechanisms.get(battle, created).state.count, 1);
});

test("onTick and nested unit departure preserve the latest mechanism state", () => {
    const host = initialize({ id: 0, position: [0, 0], definition: { hooks: [], id: "host" } });
    let battle = createBattleState(fixtureBattlefieldState([host]));
    const definition = mechanisms.createMechanismDefinition({
        id: "contacts", initialize: () => ({ contacts: [], departures: 0 }),
        onTick(state, self) {
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            state = mechanisms.setState(state, mechanisms.ref(self), {
                ...currentState, contacts: [0],
            });
            return removeUnit(state, 0, "SCRIPT");
        },
        onUnitLeave(state, self, departure) {
            assert.deepEqual(self.state.contacts, [departure.unit.id]);
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            return mechanisms.setState(state, mechanisms.ref(self), {
                contacts: [], departures: currentState.departures + 1,
            });
        },
    });
    let reference;
    [battle, reference] = register(battle, definition);
    battle = mechanisms.advance(battle);
    assert.deepEqual(mechanisms.get(battle, reference).state, { contacts: [], departures: 1 });
    assert.equal(battle.battlefield.units.get(0), undefined);
});

test("runtime scans mechanisms after movement and before route completion", () => {
    const route = (start, end) => ({
        pathMotionMode: "WALK", startPosition: start, endPosition: end,
        offset: [0, 0], checkpoints: [], requireAllCheckpoints: false,
        alwaysCheckCurrentPoint: true,
    });
    const moving = initialize({
        id: 0, position: [0, 0], definition: { hooks: [],
            id: "moving", spatialPresence: {}, route: route([0, 0], [0, 1]),
            locomotion: {
                speed: 1, minSpeed: 0, halfBodyWidth: 0,
                steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
            },
        },
    });
    const arriving = initialize({
        id: 1, position: [2, 0], definition: { hooks: [],
            id: "arriving", spatialPresence: {}, route: route([0, 2], [0, 2]),
        },
    });
    let battle = createBattleState(fixtureBattlefieldState([moving, arriving]));
    const definition = mechanisms.createMechanismDefinition({
        id: "terrain-stage", initialize: () => ({ position: null }),
        onTick(state, self) {
            assert.equal(state.battlefield.units.get(1).route.main.phase.type, "COMPLETED");
            state = mechanisms.setState(state, mechanisms.ref(self), {
                position: state.battlefield.units.get(0).position,
            });
            return removeUnit(state, 1, "DEATH");
        },
    });
    let reference;
    [battle, reference] = register(battle, definition);
    const before = battle;
    battle = step(battle, []);
    assert.deepEqual(mechanisms.get(battle, reference).state.position, [1, 0]);
    assert.equal(battle.battlefield.units.get(1), undefined);
    assert.deepEqual(battle.removedUnits.map(({ unitId, reason }) => [unitId, reason]), [[1, "DEATH"]]);
    assert.equal(battle.events.some(event => event.type === "ROUTE_COMPLETED"), false);
    assert.deepEqual(before.battlefield.units.get(0).position, [0, 0]);
});

test("typed mechanism state survives placement erasure and default programs keep object state", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-mechanism-types-"));
    const module = path => JSON.stringify(fileURLToPath(new URL(
        `../../src/core/${path}.js`, import.meta.url,
    )));
    const path = join(directory, "mechanisms.mts");
    try {
        writeFileSync(path, `
import * as mechanisms from ${module("battle/mechanism")};
import type { Input } from ${module("battle/contract")};
import type { State } from ${module("battle/state")};
import type { PredefinedDefinition } from ${module("battle/steps/predefined")};
declare const battle: State;
const definition = mechanisms.createMechanismDefinition({
  id: 'counter', initialize: () => ({ count: 0 }),
  onTick(battle, self) {
    const count: number = self.state.count;
    return mechanisms.setState(battle, mechanisms.ref(self), { count: self.state.count + 1 });
  },
});
const placed: Pick<Input, 'initialMechanisms'> = { initialMechanisms: [{ definition }] };
const predefined: PredefinedDefinition = {
  id: 0, alias: null, initiallyPresent: true, creation: { type: 'MECHANISM', definition },
};
const created = mechanisms.create(battle, definition);
const self = mechanisms.get(created.state, created.value)!;
const count: number = self.state.count;
mechanisms.setState(created.state, created.value, { count: self.state.count + 1 });
// @ts-expect-error Mechanism updates preserve the private state type.
mechanisms.setState(created.state, created.value, { name: 'wrong' });
// @ts-expect-error Mechanism state is supplied as a value rather than a transform.
mechanisms.setState(created.state, created.value, state => ({ count: state.count + 1 }));
const view = mechanisms.all(battle).find(() => true)!;
const defaultState: object = view.state;
view.definition.onTick?.(battle, view);
// @ts-expect-error Default Mechanism state cannot infer private fields.
view.state.count;
mechanisms.setState(battle, mechanisms.ref(view), {});
// @ts-expect-error Public mechanism lookup takes a typed Ref.
mechanisms.get(battle, 0);
// @ts-expect-error Public removal takes a typed Ref.
mechanisms.remove(battle, 0);
const currentMechanism = battle.mechanisms.get(0);
if (currentMechanism !== undefined) currentMechanism.definition.onTick?.(battle, currentMechanism);
`);
        const program = ts.createProgram([path], {
            noEmit: true, strict: true, exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true, target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
            skipLibCheck: true, types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic =>
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
