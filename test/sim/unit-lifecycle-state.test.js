import * as unitQueries from "../../dist/core/unit/query.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { add, remove } from "../../dist/core/battle/unit.js";
import { initialize } from "../helpers/unit.js";

import * as mechanisms from "../../dist/core/battle/mechanism.js";
import * as effects from "../../dist/core/unit/effect/operations.js";
import { createDefinition as createSkillDefinition, setEndedHook } from "../../dist/core/unit/capability/skill/capability.js";
import { activate, finish } from "../../dist/core/unit/capability/skill/operations.js";
import { ref as activationRef } from "../../dist/core/unit/capability/skill/activation.js";
import { actionCapability } from "../helpers/actions.js";
import * as actions from "../../dist/core/unit/action/operations.js";
import { fixtureBattlefieldState as fixtureBattlefield } from "../helpers/battlefield.js";

const unit = (id, extra = {}) => initialize({ id, position: [0, id], definition: { hooks: [], id: `lifecycle-unit-${id}`, vitality: { maxHp: 100, defense: 0, resistance: 0 }, ...extra } });

for (const reason of ["DEATH", "RETREAT", "SCRIPT"]) {
  test(`${reason} retains Skill cancellation when Action cleanup tries to finish it`, () => {
    const programEnds = [];
    const observedEnds = [];
    const effectEnds = [];
    let actionEnds = 0;
    const skill = createSkillDefinition({
      id: "action-dependent-skill", initialize: () => ({}), sp: null,
      activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onEnd(state, self, end) {
          programEnds.push(end);
          assert.equal(getUnit(state, self.host.id).lifecycle, "LEAVING");
          assert.equal(getUnit(state, self.host.id).skill.active.status, "ENDING");
          return state;
        },
      },
    });
    const action = {
      id: "skill-completing-action", intervalTicks: 1, speed: 100,
      initialize: state => ({ state, value: {} }),
      prepare: state => ({ state, value: { activation: activationRef(getUnit(state, 0).skill.active) } }),
      onTick: state => ({ state, value: false }),
      onEnd(state, source, self) {
        actionEnds++;
        return finish(state, self.execution.state.activation);
      },
    };
    let state = createBattleState(fixtureBattlefield([
      unit(0, { skill, action: actionCapability(action) }),
      unit(1),
    ]));
    const source = getUnit(state, 0);
    state = updateUnit(state, [{ ...source, skill: setEndedHook(source.skill, {
      id: "observe-cancellation",
      invoke(state, { host, event }) {
        const self = getUnit(state, host.id);
        observedEnds.push(event.end);
        assert.equal(self.lifecycle, "LEAVING");
        assert.equal(self.skill.active, null);
        return { state: finish(state, activationRef(event.activation)), value: undefined };
      },
    }) }]);
    const activated = activate(state, unitRef(source));
    state = activated.state;
    const started = actions.start(state, unitRef(getUnit(state, 0)), action);
    assert.equal(started.value.type, "STARTED");
    state = started.state;
    for (const [id, host, scopes] of [
      ["skill-dependent", 1, [{ type: "SKILL", ref: activated.value.ref }]],
      ["host-dependent", 0, []],
    ]) {
      state = effects.install(state, unitRef(getUnit(state, host)), {
        id, initialize: () => ({}),
        onEnd(state, self, reason) {
          effectEnds.push([id, reason]);
          return state;
        },
      }, { scopes }).state;
    }
    const before = state;
    state = remove({ ...state, tick: 1 }, 0, reason);
    const expected = { type: "CANCELLED", reason };
    assert.deepEqual(programEnds, [expected]);
    assert.deepEqual(observedEnds, [expected]);
    assert.deepEqual(state.events.filter(event => event.type === "SKILL_FINISHED").map(event => event.end), [expected]);
    assert.equal(actionEnds, 1);
    assert.equal(effectEnds.length, 2);
    assert.deepEqual(new Map(effectEnds), new Map([["skill-dependent", reason], ["host-dependent", reason]]));
    assert.equal(getUnit(state, 0), undefined);
    assert.deepEqual(getUnit(state, 1).effects.values().toArray(), []);
    assert.equal(actions.get(state, started.value.ref), undefined);
    assert.equal(remove(state, 0, reason), state);
    assert.equal(finish(state, activated.value.ref), state);
    assert.equal(getUnit(before, 0).skill.active.status, "ACTIVE");
    assert.equal(getUnit(before, 1).effects.values().toArray().length, 1);
  });
}

test("departure callbacks observe LEAVING while old snapshots remain PRESENT", () => {
  const skill = createSkillDefinition({
    id: "observe-departure", initialize: () => ({}), sp: null,
    activation: {
      trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
      onEnd: state => observe(state, "finish skill"),
    },
  });
  let state = createBattleState(fixtureBattlefield([unit(0, { skill })]));
  const original = state;
  const trace = [];
  const observe = (state, stage) => {
    const current = getUnit(state, 0);
    trace.push([stage, current.lifecycle]);
    const nested = remove(state, 0, "DEATH");
    assert.equal(nested, state);
    assert.equal(getUnit(nested, 0), current);
    return nested;
  };
  state = activate(state, unitRef(getUnit(state, 0))).state;
  state = effects.install(state, unitRef(getUnit(state, 0)), {
    id: "departure-observer", initialize: () => ({}),
    onDisable: state => observe(state, "disable effect"),
    onEnd: state => observe(state, "end effect"),
  }).state;
  const before = state;
  state = remove(state, 0, "RETREAT");
  assert.equal(trace.length, 3);
  assert.deepEqual(new Map(trace), new Map([["disable effect", "LEAVING"], ["end effect", "LEAVING"], ["finish skill", "LEAVING"]]));
  assert.ok(trace.findIndex(([stage]) => stage === "disable effect") < trace.findIndex(([stage]) => stage === "end effect"));
  assert.equal(unitQueries.get(before, { id: 0 }).lifecycle, "PRESENT");
  assert.equal(unitQueries.get(before, { id: 0 }).effects.values().toArray()[0].status, "ACTIVE");
  assert.equal(getUnit(original, 0).lifecycle, "PRESENT");
  assert.equal(getUnit(state, 0), undefined);
  assert.deepEqual(state.removedUnits.map(({ unitId, reason }) => [unitId, reason]), [[0, "RETREAT"]]);
});

test("skill finish sees LEAVING and cannot install dependencies on its departing source", () => {
  const skill = createSkillDefinition({
    id: "departing-skill", initialize: () => ({}),
    sp: { initial: 1, capacity: 1, requirement: 1, recovery: { type: "NONE" } },
    activation: {
      trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
      onEnd(state) {
        statuses.push(getUnit(state, 0).lifecycle);
        state = remove(state, 0, "DEATH");
        const rejected = effects.install(state, unitRef(getUnit(state, 1)), { id: "late-dependency", initialize: () => ({}), onInstall(state) { installations++; return state; } }, { scopes: [{ type: "UNIT", ref: { id: 0 } }] });
        assert.equal(rejected.value, undefined);
        return rejected.state;
      },
    },
  });
  let state = createBattleState(fixtureBattlefield([unit(0, { skill }), unit(1)]));
  const statuses = [];
  let installations = 0;
  state = activate(state, unitRef(getUnit(state, 0))).state;
  const before = state;
  state = remove({ ...state, tick: 1 }, 0, "SCRIPT");
  assert.deepEqual(statuses, ["LEAVING"]);
  assert.equal(installations, 0);
  assert.equal(getUnit(state, 1).effects.nextId, 0);
  assert.equal(unitQueries.get(before, { id: 0 }).lifecycle, "PRESENT");
  assert.ok(unitQueries.get(before, { id: 0 }).skill.active);
  assert.equal(getUnit(state, 0), undefined);
  assert.equal(state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
  assert.deepEqual(state.events.find(({ type }) => type === "SKILL_FINISHED").end, { type: "CANCELLED", reason: "SCRIPT" });
  assert.deepEqual(state.removedUnits.map(({ unitId, reason }) => [unitId, reason]), [[0, "SCRIPT"]]);
});

test("departure callbacks cannot start a new skill activation", () => {
  const skill = createSkillDefinition({
    id: "closed-host-activation", initialize: () => ({}), sp: null,
    activation: {
      trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
      onStart(state) { activations++; return state; },
    },
  });
  let activations = 0;
  let attempted;
  const original = createBattleState(fixtureBattlefield([unit(0, { skill })]));
  const installed = effects.install(original, unitRef(getUnit(original, 0)), {
    id: "activation-on-departure", initialize: () => ({}),
    onEnd(state) {
      attempted = activate(state, unitRef(getUnit(state, 0)));
      assert.equal(attempted.state, state);
      assert.equal(getUnit(attempted.state, 0).skill.active, null);
      return attempted.state;
    },
  });
  const state = remove(installed.state, 0, "RETREAT");
  assert.deepEqual(attempted.value, { type: "REJECTED", reason: "UNAVAILABLE" });
  assert.equal(activations, 0);
  assert.equal(getUnit(state, 0), undefined);
  assert.equal(getUnit(original, 0).lifecycle, "PRESENT");
  assert.equal(getUnit(original, 0).skill.nextActivationId, 0);
});

test("onLeave reads the pre-cleanup Unit after removal and passes its changes to mechanisms", () => {
  const trace = [];
  const skill = createSkillDefinition({
    id: "leave-with-sp", initialize: () => ({}),
    sp: { initial: 3, capacity: 3, requirement: 1, recovery: { type: "NONE" } },
    activation: {
      trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
      onEnd(state) {
        trace.push("skill finish");
        const current = getUnit(state, 0);
        assert.equal(current.lifecycle, "LEAVING");
        assert.equal(current.skill.active.status, "ENDING");
        return updateUnit(state, [{ ...current, skill: { ...current.skill, sp: { ...current.skill.sp, value: 0 } } }]);
      },
    },
  });
  let departing;
  const child = unit(2, {
    hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
      trace.push("new unit enter");
      return { state: updateUnit(state, [{ ...self, vitality: { ...self.vitality, hp: 55 } }]), value: undefined };
    } }],
  });
  const host = unit(0, {
    skill,
    hooks: [{ id: "test/leave", stage: "leave", invoke(state, departure) {
      trace.push("unit leave");
      assert.equal(getUnit(state, 0), undefined);
      assert.equal(departure.unit, departing);
      assert.equal(departure.reason, "RETREAT");
      assert.equal(departure.unit.lifecycle, "PRESENT");
      assert.equal(departure.unit.skill.sp.value, 2);
      assert.equal(departure.unit.skill.active.id, 0);
      assert.equal(departure.unit.effects.values().toArray()[0].status, "ACTIVE");
      const other = getUnit(state, 1);
      state = updateUnit(state, [{ ...other, vitality: { ...other.vitality, hp: 77 } }]);
      return { state: addUnit(state, child), value: undefined };
    } }],
  });
  const mechanism = {
      id: "observe-unit-leave",
      initialize: () => ({}),
      onUnitLeave(state, self, departure) {
        trace.push("mechanism leave");
        assert.equal(self.id, 0);
        assert.equal(departure.unit, departing);
        assert.equal(getUnit(state, 0), undefined);
        assert.equal(getUnit(state, 1).vitality.hp, 77);
        assert.equal(getUnit(state, 2).vitality.hp, 55);
        const other = getUnit(state, 1);
        return updateUnit(state, [{ ...other, vitality: { ...other.vitality, hp: 60 } }]);
      },
  };
  let state = mechanisms.create(createBattleState(fixtureBattlefield([host, unit(1)])), mechanism).state;
  state = activate(state, unitRef(getUnit(state, 0))).state;
  state = effects.install(state, unitRef(getUnit(state, 0)), {
    id: "leave-effect", initialize: () => ({}),
    onDisable(state) { trace.push("effect disable"); return state; },
    onEnd(state) { trace.push("effect end"); return state; },
  }).state;
  departing = getUnit(state, 0);
  const before = state;
  state = remove({ ...state, tick: 1 }, 0, "RETREAT");
  assert.equal(trace.length, 6);
  assert.deepEqual(new Set(trace), new Set(["effect disable", "effect end", "skill finish", "unit leave", "new unit enter", "mechanism leave"]));
  assert.ok(trace.indexOf("effect disable") < trace.indexOf("effect end"));
  for (const cleanup of ["effect disable", "effect end", "skill finish"]) assert.ok(trace.indexOf(cleanup) < trace.indexOf("unit leave"));
  assert.ok(trace.indexOf("unit leave") < trace.indexOf("new unit enter"));
  assert.ok(trace.indexOf("new unit enter") < trace.indexOf("mechanism leave"));
  assert.equal(getUnit(state, 1).vitality.hp, 60);
  assert.equal(getUnit(state, 2).vitality.hp, 55);
  const removed = state.removedUnits.find(({ unitId }) => unitId === 0).unit;
  assert.equal(removed.lifecycle, "LEAVING");
  assert.equal(removed.skill.sp.value, 0);
  assert.equal(removed.skill.active, null);
  assert.equal(removed.effects.size, 0);
  assert.equal(getUnit(before, 0), departing);
  assert.equal(getUnit(before, 1).vitality.hp, 100);
  assert.equal(getUnit(before, 2), undefined);
});

test("mechanism leave responses keep their candidate IDs and reread current registrations", () => {
  const trace = [];
  const later = {
    id: "registered-during-notification",
    initialize: () => ({}),
    onUnitLeave(state) { trace.push("new observer"); return state; },
  };
  let removedRef, inactiveRef;
  const definitions = [
    {
      id: "first-observer",
      initialize: () => ({}),
      onUnitLeave(state) {
        trace.push("first");
        state = mechanisms.remove(state, removedRef);
        state = mechanisms.setActive(state, inactiveRef, true);
        return mechanisms.create(state, later).state;
      },
    },
    {
      id: "removed-before-response",
      initialize: () => ({}),
      onUnitLeave(state) { trace.push("removed observer"); return state; },
    },
    {
      id: "activated-before-response",
      initialize: () => ({}),
      onUnitLeave(state) { trace.push("activated observer"); return state; },
    },
  ];
  let original = createBattleState(fixtureBattlefield([unit(0)]));
  for (const [index, definition] of definitions.entries()) {
    const created = mechanisms.create(original, definition, { active: index !== 2 });
    original = created.state;
    if (index === 1) removedRef = created.value;
    if (index === 2) inactiveRef = created.value;
  }
  const state = remove(original, 0, "SCRIPT");
  assert.deepEqual(trace, ["first", "activated observer"]);
  assert.deepEqual([...state.mechanisms.keys()], [0, 2, 3]);
  assert.deepEqual([...original.mechanisms.keys()], [0, 1, 2]);
});

test("initialized Units retain leave hooks and call them only for an actual departure", () => {
  let notifications = 0;
  const leaveHook = { id: "observe-departure", stage: "leave", invoke(state, departure) {
    notifications++;
    assert.equal(getUnit(state, departure.unit.id), undefined);
    assert.equal(departure.reason, "DEATH");
    return { state, value: undefined };
  } };
  const definition = {
    spatialPresence: {},
    id: "enemy-with-leave", vitality: { maxHp: 100, defense: 0, resistance: 0 },
    locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 } },
    hooks: [leaveHook],
  };
  let state = createBattleState(fixtureBattlefield([
    initialize({ id: 0, position: [0, 0], definition }),
  ]));
  state = remove(state, 0, "DEATH");
  assert.equal(remove(state, 0, "DEATH"), state);
  assert.equal(notifications, 1);
});
