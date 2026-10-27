import { tiles as tileEntries } from "../helpers/tiles.js";
import * as blockingQueries from "../../dist/core/battle/blocking/query.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import { calculateDamage } from "../../dist/core/battle/damage/calculate.js";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { definition as skillDefinition } from "../helpers/skill.js";
import { enter as enterSkill } from "../../dist/core/unit/capability/skill/operations.js";
import { Definitions } from "../../dist/core/unit/action/definitions.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { chessRec, enemyRec } from "../helpers/records.js";
import { createLegacyCombatBattle } from "../helpers/legacy-combat.js";
import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { initialize as initializeBattle, step as advanceBattle } from "../../dist/core/battle/runtime.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { initialize } from "../helpers/unit.js";
import { start as startAction } from "../../dist/core/unit/action/operations.js";
import { damage as damageFixture, healing as healingFixture } from "../helpers/targeting.js";
import { topK } from "../../dist/core/common/collection.js";
import { setMaxHpContribution } from "../../dist/core/unit/capability/vitality/capability.js";
import { select as selectTargets } from "../../dist/core/battle/targeting/select.js";
import { setRestriction, allowsRestrictions } from "../../dist/core/unit/capability/targetable/capability.js";
import { invincible, healFree } from "../../dist/content/effects/protection.js";
import { invisible, camouflage, untargetable, allyUntargetable } from "../../dist/content/effects/visibility.js";
import { installFixtureEffect } from "../helpers/effects.js";
import * as effects from "../../dist/core/unit/effect/operations.js";
import { healing } from "../helpers/vitality.js";
import { setHook as setDamageHook } from "../../dist/core/battle/damage/hook.js";
import * as contribution from "../../dist/core/unit/contribution/contribution.js";
import * as modifier from "../../dist/core/unit/contribution/attribute.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { update as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";

const startSingleAction = (source, definition, context) => {
  let battleState = createBattleState(context.battlefield);
  battleState = updateUnit({ ...battleState, tick: context.tick }, [source]);
  const actionState = startAction(battleState, unitRef(source), definition).state;
  battleState = actionState;
  return { units: [...battleState.battlefield.units.values()],
    removedUnitIds: battleState.removedUnits.map(value => value.unitId),
    events: battleState.events, execution: battleState.execution, state: getUnit(actionState, source.id).action };
};


const guard = (o = {}) => chessRec({ id: 't_guard', profession: 'WARRIOR', stats: { atk: 300, blockCnt: 2 }, skill: null, ...o });

const sniper = (o = {}) => chessRec({ id: 't_sniper', profession: 'SNIPER', subProfessionId: 'closerange', stats: { atk: 300 }, rangeGrid: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3], [-1, 0], [-1, 1], [-1, 2], [-1, 3]], skill: null, ...o });

const walker = (o = {}) => enemyRec({ key: 'enemy_walker', hp: 1e6, speed: 1, ...o });


function coreCombatRoute(startPosition = [1, 8], overrides = {}) {
  return createRouteDefinition({
    pathMotionMode: 'WALK', startPosition, endPosition: [1, 0],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [],
    allowDiagonalMove: false, visitEveryTileCenter: false,
    visitEveryNodeCenter: false, visitEveryCheckPoint: true, ...overrides,
  });
}


function unitFacts(unit) {
  return unit.action === undefined ? unit : {
    ...unit,
    action: { ...unit.action, actions: new Map(unit.action.actions.values().map(state => {
      const id = state.definition.id;
      const { initialize, start, step, onEnd, ...definition } = state.definition;
      if (definition.attack !== undefined) {
        definition.attack = { ...definition.attack, targetGroups: definition.attack.targetGroups.map(group => {
          const { filter, selector, ...targeting } = group.targeting;
          return { ...group, targeting };
        }) };
      }
      return [id, { ...state, definition }];
    })) },
  };
}


function eventFacts(event) {
  return 'unit' in event ? { ...event, unit: unitFacts(event.unit) } : event;
}


function combatFacts(state) {
  return {
    tick: state.tick,
    combatants: [...state.battlefield.units.values()].map(unit => ({
      id: unit.id, position: unit.position, hp: unit.vitality?.hp,
      action: unit.action === undefined ? undefined : {
        cooldowns: unit.action.actions.values().map(current => ({
          id: current.definition.id, cooldown: current.cooldown,
        })).toArray(),
        instances: unit.action.actions.values().filter(self => self.execution !== null).map(current => ({
          id: current.execution.id, status: current.execution.status, state: current.execution.state,
        })).toArray(),
      },
    })),
    blocked: blockingQueries.relations(state).map(({ blocker, blocked }) => [blocker.id, blocked.id]),
    execution: state.execution,
    result: state.result,
  };
}


function coreCombatTrace(options) {
  let battle = createLegacyCombatBattle({ rows: 3, columns: 10, ...options });
  const trace = [];

  while (battle.result === null) {
    const stepped = (battle = advanceBattle(battle, []));
    trace.push({ events: stepped.events.map(eventFacts), facts: combatFacts(battle) });
  }

  return { battle, trace, events: trace.flatMap(step => step.events) };
}


test('core combat: a blocked enemy exchanges attacks and death resolves the spawn schedule deterministically', () => {
  const options = {
    operators: [{
      definition: guard({ stats: { maxHp: 1000, atk: 100, def: 0, blockCnt: 1, bat: 0.1 }, rangeGrid: [[0, 0]] }),
      position: [1, 5],
    }],
    enemies: [{ definition: walker({ hp: 250, atk: 30, bat: 0.1 }), route: coreCombatRoute() }],
    seed: 123,
  };
  const first = coreCombatTrace(options);
  const second = coreCombatTrace(options);
  const damage = first.events.filter(event => event.type === 'DAMAGE');

  assert.deepEqual(first.trace, second.trace);
  assert.ok(damage.some(event => event.sourceUnitId === 0 && event.targetUnitId === 1));
  assert.ok(damage.some(event => event.sourceUnitId === 1 && event.targetUnitId === 0));
  assert.ok(first.events.some(event => event.type === 'UNIT_REMOVED' && event.unitId === 1 && event.reason === 'DEATH'));
  assert.equal(first.battle.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(first.battle.result.spawnedCount, 1);
  assert.equal(first.battle.result.completedRouteCount, 0);
  assert.deepEqual(first.battle.result.remainingUnitIds, [0]);
  assert.equal(blockingQueries.relations(first.battle).length, 0);
});


test('core combat: tile blocking is independent of passability and grants attacks outside normal range', () => {
  const spec = createLegacyCombatSpec({
    rows: 1, columns: 3, maxTicks: 2,
    operators: [{ definition: guard({
      stats: { maxHp: 1000, atk: 10, def: 0, blockCnt: 1, bat: 0.1 }, rangeGrid: [[0, 0]],
    }), position: [0, 1] }],
    enemies: [{ definition: walker({ hp: 1000, atk: 1, speed: 0, bat: 0.1 }),
      route: coreCombatRoute([0, 0], { endPosition: [0, 2], spawnOffset: [0.35, 0] }) }],
  });
  for (const meleeBlockable of [false, true]) {
    for (const passableMask of ['FLY_ONLY', 'NONE', 'ALL', 'WALK_ONLY']) {
      const map = createMap(1, 3, tileEntries(spec.map.tiles.values().toArray().map((tile, index) =>
        index === 1 ? createTile({ ...tile, meleeBlockable, passableMask }) : tile)));
      let battle = initializeBattle({ ...spec, map });
      const context = `meleeBlockable=${meleeBlockable}, passableMask=${passableMask}`;
      for (let tick = 0; tick < 2; tick++) {
        const { events } = (battle = advanceBattle(battle, []));
        assert.deepEqual(blockingQueries.relations(battle).map(({ blocker, blocked }) => [blocker.id, blocked.id]), meleeBlockable
          ? [[0, 1]] : [], context);
        assert.deepEqual(events.filter(event => event.type === 'ACTION').map(event => event.sourceUnitId),
          meleeBlockable && tick === 1 ? [0, 1] : [], context);
      }
    }
  }
});


test('core combat: lethal damage caps HP loss and dead units cannot act or be selected later in the phase', () => {
  const options = {
    rows: 3, columns: 10,
    operators: [0, 1].map(index => ({
      definition: guard({ id: `core_guard_${index}`, stats: { maxHp: 1000, atk: 100, def: 0, blockCnt: 1 }, rangeGrid: [[0, 0], [0, 1]] }),
      position: [1 + index, 5],
    })),
    enemies: [{ definition: walker({ hp: 7, atk: 100000, speed: 0 }), route: coreCombatRoute([1, 6], { spawnOffset: [-0.6, 0] }) }],
  };
  let battle = createLegacyCombatBattle(options);
  const { events } = (battle = advanceBattle(battle, []));
  const damage = events.filter(event => event.type === 'DAMAGE');

  assert.deepEqual(damage.map(event => [event.sourceUnitId, event.targetUnitId, event.amount, event.hp]), [[0, 2, 7, 0]]);
  assert.equal(events.filter(event => event.type === 'ACTION').length, 1);
  assert.equal(battle.battlefield.units.get(0).vitality.hp, 1000);
  assert.equal(battle.battlefield.units.has(2), false);
  assert.equal(blockingQueries.relations(battle).length, 0);
});


test('core visibility: consecutive attacks consume the current target HP within one combat phase', () => {
  let battle = createLegacyCombatBattle({
    rows: 3, columns: 10,
    operators: [0, 1].map(index => ({
      definition: guard({ id: `current_hp_guard_${index}`, stats: { maxHp: 1000, atk: 10, def: 0, blockCnt: 1 },
        rangeGrid: [[0, 0], [0, 1], [-1, 0], [-1, 1]] }),
      position: [1 + index, 5],
    })),
    enemies: [{ definition: walker({ hp: 25, atk: 0, def: 0, speed: 0 }),
      route: coreCombatRoute([1, 6], { spawnOffset: [-0.6, 0] }) }],
  });
  const { events } = (battle = advanceBattle(battle, []));
  const damage = events.filter(event => event.type === 'DAMAGE' && event.sourceUnitId < 2);

  assert.deepEqual(damage.map(event => [event.sourceUnitId, event.targetUnitId, event.amount, event.hp]),
    [[0, 2, 10, 15], [1, 2, 10, 5]]);
  assert.equal(battle.battlefield.units.get(2).vitality.hp, 5);
});


test('core visibility: release is immediate and replacement blocking waits for the fixed step', () => {
  let battle = createLegacyCombatBattle({
    rows: 3, columns: 10,
    operators: [
      { definition: guard({ id: 'available_front', stats: { maxHp: 1000, atk: 100, def: 0, blockCnt: 3 } }), position: [1, 6] },
      { definition: guard({ id: 'doomed_back', stats: { maxHp: 10, atk: 0, def: 0, blockCnt: 2 } }), position: [1, 5] },
    ],
    enemies: [
      { definition: walker({ key: 'front_target', hp: 1, atk: 0, def: 0, speed: 0 }),
        route: coreCombatRoute([1, 7], { spawnOffset: [-0.4, 0] }) },
      { definition: walker({ key: 'back_killer', hp: 1000, atk: 1000, def: 0, speed: 0 }),
        route: coreCombatRoute([1, 6], { spawnOffset: [-0.6, 0] }) },
      { definition: walker({ key: 'later_enemy', hp: 1000, atk: 10, def: 0, speed: 0 }),
        route: coreCombatRoute([1, 6], { spawnOffset: [-0.6, 0] }) },
    ],
  });
  const first = (battle = advanceBattle(battle, []));
  assert.deepEqual(first.events.filter(event => event.type === 'UNIT_REMOVED').map(event => event.unitId), [2]);
  assert.deepEqual(first.events.filter(event => event.type === 'ACTION').map(event => [event.sourceUnitId, event.targetUnitId]),
    [[0, 2], [1, 3]]);
  assert.deepEqual(blockingQueries.relations(battle).map(({ blocker, blocked }) => [blocker.id, blocked.id]),
    [[0, 3], [0, 4]]);

  const second = (battle = advanceBattle(battle, []));
  assert.deepEqual(second.events.filter(event => event.type === 'UNIT_REMOVED').map(event => event.unitId), [0]);
  assert.deepEqual(second.events.filter(event => event.type === 'ACTION').map(event => [event.sourceUnitId, event.targetUnitId]),
    [[3, 0]]);
  assert.equal(battle.battlefield.units.get(1).vitality.hp, 10);
  assert.deepEqual(blockingQueries.relations(battle).map(({ blocker, blocked }) => [blocker.id, blocked.id]),
    [[1, 3], [1, 4]]);

  const third = (battle = advanceBattle(battle, []));
  assert.deepEqual(third.events.filter(event => event.type === 'ACTION').map(event => [event.sourceUnitId, event.targetUnitId]),
    [[4, 1]]);
  assert.deepEqual(third.events.filter(event => event.type === 'UNIT_REMOVED').map(event => event.unitId), [1]);
  assert.deepEqual(blockingQueries.relations(battle).map(({ blocker, blocked }) => [blocker.id, blocked.id]), []);
});


test('core combat: air targeting follows unit data independently of the route motion mode', () => {
  let battle = createLegacyCombatBattle({
    rows: 3, columns: 10,
    operators: [
      { definition: guard({ canHitFly: false, rangeGrid: [[0, 0], [0, 1]] }), position: [1, 5] },
      { definition: sniper({ canHitFly: true, projectile: 'none', rangeGrid: [[-1, 0], [-1, 1]] }), position: [2, 5] },
    ],
    enemies: [{ definition: enemyRec({ key: 'core_air', hp: 1e6, speed: 0, motion: 'FLY' }), route: coreCombatRoute([1, 6]) }],
  });
  const { events } = (battle = advanceBattle(battle, []));

  assert.deepEqual(events.filter(event => event.type === 'ACTION').map(event => event.sourceUnitId), [1]);
  assert.equal(blockingQueries.relations(battle).length, 0);
  assert.equal(battle.battlefield.units.get(2).layer.type, 'AIR');
});


test('core combat: damage formulas retain the 5% floor and immutable vitality transitions', () => {
  for (const [type, defense, resistance, expected] of [
    ['PHYSICAL', 300, 0, 700], ['PHYSICAL', 2000, 0, 50],
    ['ARTS', 0, 30, 700], ['ARTS', 0, 100, 50], ['TRUE', 9999, 100, 1000],
  ]) {
    const receiver = initialize({ id: 0, position: [0, 0], definition: { hooks: [],
      id: 'formula-target', vitality: { maxHp: 5000, defense, resistance },
    } });
    const battle = createBattleState(fixtureBattlefieldState([receiver]));
    assert.equal(calculateDamage(battle, { source: null, target: unitRef(receiver), parameters: parameters(1000, type) }).value.amount, expected);
  }

  const unit = initialize({
    id: 0, position: [0, 0],
    definition: { hooks: [], id: 'core_target', vitality: { maxHp: 7, defense: 0, resistance: 0 } },
  });
  const state = createBattleState(fixtureBattlefieldState([unit]));

  const request = power => ({ source: null, target: unitRef(unit), parameters: parameters(power, 'TRUE') });
  const harmless = dealDamage(state, request(0));
  const lethal = dealDamage(state, request(1000));

  assert.equal(getUnit(harmless.state, 0), unit);
  assert.equal(harmless.value.kind, 'REJECTED');
  assert.equal(lethal.value.kind, 'APPLIED');
  assert.equal(lethal.value.application.hpLoss, 7);
  assert.equal(getUnit(lethal.state, 0), undefined);
  assert.equal(lethal.state.removedUnits[0].unit.vitality.hp, 0);
  assert.equal(unit.vitality.hp, 7);
});


test('core combat: immutable updates preserve earlier combat state', () => {
  const input = createLegacyCombatSpec({
    rows: 3, columns: 10,
    operators: [{ definition: guard({ stats: { atk: 0, maxHp: 1e6, blockCnt: 1 } }), position: [1, 5] }],
    enemies: [{ definition: walker({ speed: 0 }), route: coreCombatRoute([1, 6], { spawnOffset: [-0.6, 0] }) }],
  });
  let battle = initializeBattle(input);
  let replay = initializeBattle(input);
  assert.deepEqual((battle = advanceBattle(battle, [])), (replay = advanceBattle(replay, [])));
  const snapshot = battle;
  const operator = snapshot.battlefield.units.get(0);
  const actionId = operator.definition.action.definitions.values().toArray()[0].id;
  const readyAtTick = operator.action.actions.get(actionId).cooldown.readyAtTick;
  const hp = operator.vitality.hp;
  assert.deepEqual(blockingQueries.relations(snapshot).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);

  const battlefield = snapshot.battlefield;
  const previous = snapshot;
  const changed = {
    ...operator,
    action: { ...operator.action, actions: operator.action.actions.read(actionId, current => operator.action.actions.replace(current.definition, { ...current, cooldown: { ...current.cooldown, readyAtTick: 999999 } })) },
    allegiance: { ...operator.allegiance, side: 'ENEMY' },
    layer: { ...operator.layer, type: 'AIR' },
    targetable: setRestriction(operator.targetable,
      { id: 'changed-targeting', value: { kind: Symbol('changed-targeting'), allows: () => false } }),
    blocker: { ...operator.blocker, capacity: contribution.set([], { id: 'disabled-capacity', value: [modifier.create({ finalScaler: 0 })],
    }) },
    vitality: { ...operator.vitality, hp: 0 },
  };
  const updated = updateUnit(previous, [changed]);
  const draft = updated;
  assert.equal(unitQueries.get(draft, { id: 0 }).definition, changed.definition);
  assert.deepEqual(unitQueries.get(draft, { id: 0 }).blocker.blocked, []);
  assert.deepEqual(blockingQueries.relations(draft).map(({ blocker, blocked }) => ([blocker.id, blocked.id])), []);
  assert.equal(unitQueries.get(draft, { id: 0 }).action.actions.get(actionId).cooldown.readyAtTick, 999999);
  const targetingRequest = { source: unitRef(snapshot.battlefield.units.get(1)),
    ...operator.definition.action.definitions.values().toArray()[0].attack.targetGroups[0].targeting };
  assert.equal(allowsRestrictions({ battlefield }, targetingRequest, unitQueries.get(draft, { id: 0 })), false);

  assert.equal(unitQueries.get(previous, { id: 0 }), operator);
  assert.deepEqual(blockingQueries.relations(previous).map(({ blocker, blocked }) => ([blocker.id, blocked.id])), [[0, 1]]);
  assert.equal(operator.action.actions.get(actionId).cooldown.readyAtTick, readyAtTick);
  assert.equal(operator.allegiance.side, 'ALLY');
  assert.equal(operator.layer.type, 'GROUND');
  assert.equal(operator.definition.hitbox.shape.radius, 0.25);
  assert.equal(allowsRestrictions(previous, targetingRequest, operator), true);
  assert.deepEqual(operator.blocker.capacity, []);
  assert.equal(operator.vitality.hp, hp);
  assert.deepEqual(battle, snapshot);
  assert.deepEqual((battle = advanceBattle(battle, [])), (replay = advanceBattle(replay, [])));
  assert.deepEqual(battle, replay);
  assert.deepEqual(blockingQueries.relations(snapshot).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);
  assert.equal(operator.vitality.hp, hp);
});


test('core combat: a rejected tick preserves spawn identities, action state, HP and blocking', () => {
  const options = {
    rows: 3, columns: 10,
    operators: [{ definition: guard({ stats: { atk: 100, maxHp: 1e6, blockCnt: 1 } }), position: [1, 5] }],
    enemies: [{ definition: walker({ hp: 1000, speed: 0 }), route: coreCombatRoute([1, 6], { spawnOffset: [-0.6, 0] }) }],
  };
  let battle = createLegacyCombatBattle(options);
  const before = battle;

  assert.throws(() => (battle = advanceBattle(battle, [{ type: 'CLEAR_ALTERNATIVE_ROUTE', unitId: 999999 }])), /unknown alternative route unit/);
  assert.equal(battle, before);
});


test('core combat: the limited legacy adapter rejects unsupported content and preserves interval conversion', () => {
  const options = {
    rows: 3, columns: 10,
    operators: [{ definition: guard({ stats: { bat: 0.5, aspd: 200 } }), position: [1, 5] }],
    enemies: [{ definition: walker({ bat: 2, aspd: 100, speed: 1 }), route: coreCombatRoute() }],
  };
  let battle = createLegacyCombatBattle(options);
  assert.equal(battle.battlefield.units.get(0).definition.action.definitions.values().toArray()[0].intervalTicks, 15);
  (battle = advanceBattle(battle, []));
  const enemy = battle.battlefield.units.get(1);

  assert.equal(enemy.definition.action.definitions.values().toArray()[0].intervalTicks, 60);
  assert.equal(battle.battlefield.units.get(0).definition.action.definitions.values().toArray()[0].speed, 200);
  assert.equal(enemy.definition.locomotion.speed, 1 / 60);
  assert.throws(() => createLegacyCombatBattle({ ...options, operators: [{ definition: guard({ skill: { spCost: 1 } }), position: [1, 5] }] }), /does not execute operator skills/);
  assert.throws(() => createLegacyCombatBattle({ ...options, operators: [{ definition: guard({ dmgType: 'heal' }), position: [1, 5] }] }), /only supports physical, arts and true damage/);
  assert.throws(() => createLegacyCombatBattle({ ...options, operators: [{ definition: guard({ attackKind: 'none' }), position: [1, 5] }] }), /ordinary attacks/);
  for (const offset of [null, [0, 1, 2], [0.5, 1]]) {
    assert.throws(() => createLegacyCombatSpec({
      ...options, operators: [{ definition: guard({ rangeGrid: [offset] }), position: [1, 5] }],
    }), { name: 'RangeError', message: 'invalid tile position' });
  }
});


test('core targeting: explicit ID comparison resolves ties independently of insertion order', () => {
  const units = [7, 1, 4, 2].map(id => actionUnit(id, 'ENEMY', [1, 0]));
  const source = actionUnit(0, 'ALLY', [0, 0]);
  const before = [...units];
  for (const candidates of [units, units.toReversed()]) {
    const state = createBattleState(fixtureBattlefieldState([source, ...candidates]));
    const result = selectTargets(state, { source: unitRef(source), purposes: [],
      filter: (_battle, _request, target) => target.id !== 0 && target.id !== 1,
      selector: (battle, _request, eligible) => ({ state: battle,
        value: topK(eligible, 2, (left, right) => left.id - right.id).map(unitRef) }) });
    assert.deepEqual(result.value.map(ref => ref.id), [2, 4]);
    assert.equal(result.state, state);
  }
  assert.deepEqual(units, before);
});


test('core targeting: each finite target limit returns the same explicitly ranked prefix', () => {
  const source = actionUnit(100, 'ALLY', [0, 0]);
  const units = Array.from({ length: 37 }, (_, id) => actionUnit(id, 'ENEMY', [id % 6, 0]));
  const compare = (left, right) => left.position[0] - right.position[0] || left.id - right.id;
  const ordered = units.filter(unit => unit.id % 4 !== 0).sort(compare);
  for (const candidates of [units, units.toReversed(), units.map((_, id) => units[(id * 13) % 37])]) {
    const state = createBattleState(fixtureBattlefieldState([source, ...candidates]));
    for (const limit of [0, 1, 2, 3, 8, 37, 100]) {
      const result = selectTargets(state, { source: unitRef(source), purposes: [],
        filter: (_battle, _request, target) => target.id !== source.id && target.id % 4 !== 0,
        selector: (battle, _request, eligible) => ({ state: battle,
          value: topK(eligible, limit, compare).map(unitRef) }) });
      assert.deepEqual(result.value.map(ref => ref.id), ordered.slice(0, limit).map(unit => unit.id));
    }
  }
});


test('core targeting: a small multi-target query selects across a large unordered candidate set', () => {
  const source = actionUnit(1000, 'ALLY', [0, 0]);
  const units = Array.from({ length: 509 }, (_, id) => actionUnit(id, 'ENEMY', [(id * 73) % 509, 0]));
  const state = createBattleState(fixtureBattlefieldState([source, ...units]));
  const result = selectTargets(state, { source: unitRef(source), purposes: [],
    filter: (_battle, _request, target) => target.id !== source.id,
    selector: (battle, _request, eligible) => ({ state: battle,
      value: topK(eligible, 3, (left, right) => left.position[0] - right.position[0]).map(unitRef) }) });
  assert.deepEqual(result.value.map(ref => getUnit(result.state, ref.id).position[0]), [0, 1, 2]);
});


const actionRange = radius => [{ type: 'CIRCLE', offset: [0, 0], radius }];


const damageTargeting = (overrides = {}) => damageFixture({
  geometry: actionRange(10), ...overrides,
});


const healingTargeting = (overrides = {}) => healingFixture({
  geometry: actionRange(10), ...overrides,
});


const damageEffect = power => ({ type: 'DAMAGE', power, damageType: 'TRUE' });

const healEffect = power => ({ type: 'HEAL', power });


const attackDefinition = (targetGroups, followUps = []) => createAttack({
  id: 'normal', intervalTicks: 3, speed: 100, triggerBindingId: targetGroups[0].id, targetGroups, followUps, recoveryTicks: 0,
});


function actionUnit(id, side, position, { hp = 100, effects: initialEffects = [], action, skill } = {}) {
  const definition = { hooks: [],
    id: `action_unit_${id}`, targetable: { restrictions: [] }, vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side },
    layer: { type: 'GROUND' }, hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.1 } }, blocker: { capacity: 0, geometry: { radius: 0 } },
    ...(skill === undefined ? {} : { skill }),
    action: { definitions: Definitions.empty().add(action ?? attackDefinition([
      { id: 'primary', targeting: damageTargeting(), operations: [damageEffect(0)] },
    ])) },
  };
  let unit = initialize({ id, definition, position });
  unit = { ...unit, vitality: { ...unit.vitality, hp } };
  for (const effect of initialEffects) unit = installFixtureEffect(unit, effect);
  return unit;
}


test('core protection effects: withdrawing one source retains the other source and earlier snapshots', () => {
  const source = actionUnit(0, 'ALLY', [0, 0]);
  const target = actionUnit(1, 'ENEMY', [1, 0], { hp: 50 });
  const request = { source: unitRef(source), target: unitRef(target), parameters: parameters(1000, 'TRUE') };
  const restricted = (effect, state) => {
    const current = getUnit(state, 1);
    if (effect === healFree) return !allowsRestrictions(state, { source: unitRef(source), ...healingTargeting() }, current);
    if (effect === untargetable) return selectTargets(state, { source: unitRef(source), ...damageTargeting() }).value.length === 0;
    const resolved = dealDamage(state, request);
    return resolved.value.kind === 'REJECTED';
  };

  for (const effect of [healFree, untargetable, invincible]) {
    let state = createBattleState(fixtureBattlefieldState([source, target]));
    const first = effects.install(state, unitRef(getUnit(state, 1)), effect);
    const second = effects.install(first.state, unitRef(getUnit(first.state, 1)), effect);
    state = second.state;
    const both = getUnit(state, 1);

    assert.equal(restricted(effect, state), true, effect.id);
    state = effects.setEnabled(state, first.value, false);
    assert.equal(restricted(effect, state), true, effect.id);
    state = effects.end(state, second.value);
    assert.equal(restricted(effect, state), false, effect.id);
    state = effects.setEnabled(state, first.value, true);
    assert.equal(restricted(effect, state), true, effect.id);
    state = effects.end(state, first.value);
    assert.equal(restricted(effect, state), false, effect.id);
    assert.equal(both.effects.values().toArray().length, 2);
    assert.equal(restricted(effect, second.state), true, effect.id);
    assert.equal(target.effects.values().toArray().length, 0);
  }
});


test('core vitality: invincibility rejects receiving before HIT SP and removing it restores reception', () => {
  const observed = [];
  const protectedTarget = actionUnit(1, 'ALLY', [1, 0], { effects: [invincible], skill: skillDefinition({
    id: 'hit-sp', sp: { initial: 0, capacity: 10, requirement: 10, recovery: { type: 'HIT', amount: 1 } },
    activation: { trigger: 'MANUAL', sustain: { type: 'INFINITE' }, initialize: () => ({}) },
  }) });
  const target = { ...protectedTarget, vitality: setDamageHook(protectedTarget.vitality, {
    id: 'observe-reception', stage: 'receiving', priority: 0,
    invoke(state, context, pending) {
      observed.push(getUnit(state, context.request.target.id).skill.sp.value);
      return { state, value: pending };
    },
  }) };
  const state = enterSkill(createBattleState(fixtureBattlefieldState([target])), unitRef(target));
  const request = { source: null, target: unitRef(target), parameters: parameters(10, 'TRUE') };
  const blocked = dealDamage(state, request);
  const protection = getUnit(state, 1).effects.values().toArray().find(effect => effect.definition === invincible);
  const unprotected = effects.end(state, { host: unitRef(target), id: protection.id });
  const allowed = dealDamage(unprotected, request);

  assert.equal(blocked.value.kind, 'REJECTED');
  assert.equal(getUnit(blocked.state, 1).skill.sp.value, 0);
  assert.equal(allowed.value.kind, 'APPLIED');
  assert.equal(allowed.value.application.hpLoss, 10);
  assert.equal(getUnit(allowed.state, 1).skill.sp.value, 1);
  assert.deepEqual(observed, [1]);
  assert.equal(target.skill.sp.value, 0);
  assert.equal(target.vitality.hp, 100);
});


test('core vitality: nested direct healing ignores target selection restrictions and supplies the latest HP', () => {
  for (const installedInitially of [false, true]) {
    const original = actionUnit(1, 'ENEMY', [1, 0], {
      hp: 40, effects: installedInitially ? [healFree] : [],
    });
    const target = { ...original, vitality: setDamageHook(original.vitality, {
      id: 'change-healing-restriction', stage: 'receiving', priority: 0,
      invoke(state, context, pending) {
        if (installedInitially) {
          state = effects.end(state, { host: context.request.target,
            id: getUnit(state, context.request.target.id).effects.values().toArray()[0].id });
        } else {
          state = effects.install(state, context.request.target, healFree).state;
        }
        state = healing(state, { source: null, target: context.request.target,
          parameters: { power: 30, multiplier: 1 } }).state;
        return { state, value: pending };
      },
    }) };
    const state = createBattleState(fixtureBattlefieldState([target]));
    const resolved = dealDamage(state, { source: null, target: unitRef(target), parameters: parameters(60, 'TRUE') });

    assert.equal(resolved.value.kind, 'APPLIED');
    assert.deepEqual(resolved.value.application, { hpBefore: 70, hpAfter: 10, hpLoss: 60 });
    assert.equal(getUnit(resolved.state, 1).vitality.hp, 10);
    assert.equal(target.vitality.hp, 40);
  }
});


test('core vitality: a selected target remains directly healable after gaining a selection restriction', () => {
  const source = actionUnit(0, 'ALLY', [0, 0]);
  const target = actionUnit(1, 'ALLY', [1, 0], { hp: 40 });
  let state = createBattleState(fixtureBattlefieldState([source, target]));
  const query = { source: unitRef(source), ...healingTargeting() };
  const selected = selectTargets(state, query).value;
  assert.deepEqual(selected.map(unit => unit.id), [1]);
  const selectedRef = selected[0];
  state = effects.install(state, selectedRef, healFree).state;
  const result = healing(state, { source: unitRef(source), target: selectedRef,
    parameters: { power: 30, multiplier: 1 } });

  assert.deepEqual(selectTargets(state, query).value, []);
  assert.equal(result.value.kind, 'APPLIED');
  assert.equal(result.value.application.hpGain, 30);
  assert.equal(getUnit(result.state, 1).vitality.hp, 70);
  assert.equal(getUnit(state, 1).vitality.hp, 40);
  assert.equal(target.vitality.hp, 40);
});


test('core targeting uses static definition hitboxes and current layer', () => {
  const source = actionUnit(0, 'ALLY', [0, 0]);
  const target = actionUnit(1, 'ENEMY', [1.6, 0]);
  const request = { source: unitRef(source), ...damageTargeting({ geometry: actionRange(1) }) };
  const select = current => selectTargets(createBattleState(fixtureBattlefieldState([source, current])), request).value;

  assert.deepEqual(select(target), []);
  const expanded = initialize({ id: target.id, position: target.position, definition: {
    ...target.definition, hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.7 } },
  } });
  assert.deepEqual(select(expanded).map(unit => unit.id), [1]);
  assert.equal(target.definition.hitbox.shape.radius, 0.1);
  assert.deepEqual(select({ ...expanded, layer: { type: 'AIR' } }), []);
  assert.equal(target.definition.layer.type, 'GROUND');
});


test('core targeting: default healing eligibility and ordering use effective MaxHP', () => {
  const source = actionUnit(0, 'ALLY', [0, 0]);
  const base = actionUnit(1, 'ALLY', [1, 0]);
  const enlarged = { ...base, vitality: {
    ...setMaxHpContribution(base.vitality, base.definition.vitality, {
      id: 'equipment', value: [modifier.create({ finalAddition: 300 })],
    }), hp: 100,
  } };
  const ordinary = actionUnit(2, 'ALLY', [2, 0], { hp: 40 });
  const flooredBase = actionUnit(3, 'ALLY', [3, 0]);
  const floored = initialize({ id: 3, position: flooredBase.position, definition: {
    ...flooredBase.definition, vitality: { maxHp: 0, defense: 0, resistance: 0 },
  } });
  const fractional = { ...floored, vitality: { ...floored.vitality, hp: 0.5 } };
  const query = { source: unitRef(source), ...healingTargeting({ maxTargets: 3 }) };

  assert.deepEqual(selectTargets(createBattleState(fixtureBattlefieldState([source, enlarged, ordinary, fractional])),
    query).value.map(ref => ref.id), [1, 2, 3]);
});


test('core targeting: enemies and neutral units select each other while allies and neutral units do not', () => {
  const ally = actionUnit(0, 'ALLY', [0, 0]);
  const enemy = actionUnit(1, 'ENEMY', [1, 0]);
  const neutral = actionUnit(2, 'NEUTRAL', [2, 0]);
  const battlefield = fixtureBattlefieldState([ally, enemy, neutral]);
  const targeting = damageTargeting({ maxTargets: 3 });
  const state = createBattleState(fixtureBattlefieldState(battlefield));
  const select = source => selectTargets(state, { source: unitRef(source), ...targeting }).value.map(ref => ref.id);

  assert.deepEqual(select(ally), [1]);
  assert.deepEqual(select(enemy), [0, 2]);
  assert.deepEqual(select(neutral), [1]);
  const unaffiliated = initialize({ id: 3, definition: { hooks: [], id: 'unaffiliated' }, position: [0, 0] });
  assert.deepEqual(select(unaffiliated), []);
});


test('core targeting: hostile restrictions, friend restrictions and explicit blocking exceptions stay separate', () => {
  const source = actionUnit(0, 'ALLY', [0, 0]);
  const query = (target, overrides = {}, relations = []) => selectTargets(
    createBattleState(fixtureBattlefieldState([source, target])),
    { source: unitRef(source), ...damageTargeting(overrides) }).value.map(ref => ref.id);

  for (const effect of [untargetable, invincible, invisible, camouflage]) {
    const target = actionUnit(1, 'ENEMY', [1, 0], { effects: [effect] });
    assert.deepEqual(query(target), [], effect.id);
    assert.deepEqual(query(target, { ignoreInvisible: true }), effect === invisible ? [1] : [], effect.id);
    assert.deepEqual(query(target, { ignoreTargetFree: true }), effect === camouflage ? [] : [1], effect.id);
    assert.deepEqual(query(target, { includeBlockingRelations: true },
      [[0, 1]]), [], effect.id);
    assert.deepEqual(query(target, { includeBlockingRelations: true },
      [[9, 1]]), [], effect.id);
  }

  const friend = actionUnit(2, 'ALLY', [1, 0], { hp: 50, effects: [invincible, untargetable, invisible] });
  const selectFriend = (target, overrides = {}) => selectTargets(
    createBattleState(fixtureBattlefieldState([source, target])),
    { source: unitRef(source), ...healingTargeting(overrides) }).value.map(ref => ref.id);
  assert.deepEqual(selectFriend(friend), [2]);
  const isolated = actionUnit(2, 'ALLY', [1, 0], { hp: 50, effects: [allyUntargetable] });
  assert.deepEqual(selectFriend(isolated), []);
  assert.deepEqual(selectFriend(isolated, { ignoreAllyTargetFree: true }), [2]);
});


test('core action: healing target selection owns the heal-free exception', () => {
  for (const queryIgnore of [false, true]) {
    const action = attackDefinition([{ id: 'heal', targeting: healingTargeting({ ignoreHealFree: queryIgnore }),
      operations: [healEffect(30)] }]);
    const source = actionUnit(0, 'ALLY', [0, 0], { action });
    const target = actionUnit(1, 'ALLY', [1, 0], { hp: 40, effects: [healFree] });
    const before = JSON.stringify([source, target]);
    const result = startSingleAction(source, source.definition.action.definitions.values().toArray()[0], {
      battlefield: fixtureBattlefieldState([source, target]), tick: 0,
    });
    const heals = result.events.filter(event => event.type === 'HEAL');

    assert.equal(result.events.some(event => event.type === 'ACTION'), queryIgnore);
    assert.deepEqual(heals.map(event => [event.amount, event.hp]), queryIgnore ? [[30, 70]] : []);
    assert.equal(JSON.stringify([source, target]), before);
  }
});


test('core action: explicitly declared query purposes gate mixed outputs while source follow-ups settle independently', () => {
  const target = actionUnit(1, 'ENEMY', [1, 0], { hp: 80, effects: [healFree] });
  const mixed = actionUnit(0, 'ALLY', [0, 0], { action: attackDefinition([
    { id: 'attack', targeting: damageTargeting({ purposes: ['DAMAGE', 'HEAL'] }), operations: [damageEffect(10), healEffect(5)] },
  ]) });
  const result = startSingleAction(mixed, mixed.definition.action.definitions.values().toArray()[0], {
    battlefield: fixtureBattlefieldState([mixed, target]), tick: 0,
  });
  assert.deepEqual(result.events, []);

  const damageOnly = actionUnit(0, 'ALLY', [0, 0], { action: attackDefinition([
    { id: 'attack', targeting: damageTargeting(), operations: [damageEffect(10), healEffect(5)] },
  ]) });
  const permitted = startSingleAction(damageOnly, damageOnly.definition.action.definitions.values().toArray()[0], {
    battlefield: fixtureBattlefieldState([damageOnly, target]), tick: 0,
  });
  assert.equal(permitted.events.find(event => event.type === 'DAMAGE').hp, 70);
  assert.equal(permitted.events.find(event => event.type === 'HEAL').hp, 75);

  const source = actionUnit(0, 'ALLY', [0, 0], { hp: 60, effects: [healFree], action: attackDefinition([
    { id: 'attack', targeting: damageTargeting(), operations: [damageEffect(10)] },
  ], [{ receiver: { type: 'SOURCE' }, operation: healEffect(15) }]) });
  const stepped = startSingleAction(source, source.definition.action.definitions.values().toArray()[0], {
    battlefield: fixtureBattlefieldState([source, target]), tick: 0,
  });
  assert.deepEqual(stepped.events.map(event => event.type), ['ACTION', 'ACTION_RELEASED', 'DAMAGE', 'HEAL', 'ACTION_FINISHED']);
  assert.equal(stepped.events.find(event => event.type === 'DAMAGE').hp, 70);
  assert.equal(stepped.events.find(event => event.type === 'HEAL').amount, 15);
  assert.equal(stepped.units.find(unit => unit.id === 0).vitality.hp, 75);
  assert.equal(stepped.units.find(unit => unit.id === 0).action.actions.get('normal').cooldown.readyAtTick, 3);
});


test('core action: secondary target groups cannot trigger the action and use independent query purposes', () => {
  const definition = attackDefinition([
    { id: 'attack', targeting: damageTargeting(), operations: [damageEffect(10)] },
    { id: 'heal', targeting: healingTargeting(), operations: [healEffect(20)] },
  ]);
  const source = actionUnit(0, 'ALLY', [0, 0], { action: definition });
  const friend = actionUnit(2, 'ALLY', [2, 0], { hp: 40 });
  const compiled = source.definition.action.definitions.values().toArray()[0];
  const noEnemy = startSingleAction(source, compiled, { battlefield: fixtureBattlefieldState([source, friend]), tick: 0 });
  assert.deepEqual(noEnemy.units.map(unit => unit.id), [source.id, friend.id]);
  assert.deepEqual(noEnemy.removedUnitIds, []);
  assert.deepEqual(noEnemy.events, []);
  assert.equal(noEnemy.state.nextExecutionId, 0);
  assert.equal(noEnemy.state.actions.values().some(action => action.execution !== null), false);

  const enemy = actionUnit(1, 'ENEMY', [1, 0], { hp: 80, effects: [healFree] });
  const stepped = startSingleAction(source, compiled, { battlefield: fixtureBattlefieldState([source, friend, enemy]), tick: 0 });
  assert.deepEqual(stepped.events.map(event => [event.type, event.targetUnitId]),
    [['ACTION', 1], ['ACTION_RELEASED', undefined], ['DAMAGE', 1], ['HEAL', 2], ['ACTION_FINISHED', undefined]]);
  assert.equal(stepped.units.find(unit => unit.id === 1).vitality.hp, 70);
  assert.equal(stepped.units.find(unit => unit.id === 2).vitality.hp, 60);
  assert.equal(source.vitality.hp, 100);
  assert.equal(friend.vitality.hp, 40);
  assert.equal(enemy.vitality.hp, 80);
});


test('core combat: healing sees earlier phase damage and replays the same combat facts', () => {
  const base = createLegacyCombatSpec({ rows: 1, columns: 4, operators: [], enemies: [], maxTicks: 2 });
  const attacker = actionUnit(0, 'ENEMY', [0, 0], { action: createAttack({
    id: 'normal', intervalTicks: 3, speed: 100, triggerBindingId: 'attack', recoveryTicks: 2,
    targetGroups: [{ id: 'attack', targeting: damageTargeting(), operations: [damageEffect(20)] }],
  }) });
  const friend = actionUnit(1, 'ALLY', [1, 0]);
  const medic = actionUnit(2, 'ALLY', [3, 0], { action: attackDefinition([
    { id: 'heal', targeting: healingTargeting(), operations: [healEffect(10)] },
  ]) });
  const input = { ...base, initialUnits: [attacker, friend, medic].map(unit => ({
    definition: unit.definition, position: unit.position,
  })) };
  const run = () => {
    let battle = initializeBattle(input);
    const step = (battle = advanceBattle(battle, []));
    const snapshot = battle;
    assert.equal(snapshot.battlefield.units.get(1).vitality.hp, 90);
    assert.deepEqual(step.events.filter(event => event.type === 'HEAL')
      .map(event => [event.sourceUnitId, event.targetUnitId, event.amount]), [[2, 1, 10]]);
    const facts = combatFacts(snapshot);
    assert.deepEqual(facts.combatants.find(unit => unit.id === 0).action.instances
      .map(({ id, status, state }) => [id, status, state.released, state.target.id]),
      [[0, 'RUNNING', true, 1]]);
    return { events: step.events.map(eventFacts), facts };
  };
  assert.deepEqual(run(), run());
});


test('core action: binding follow-ups retain the selected target and read preceding effect updates', () => {
  const source = actionUnit(0, 'ALLY', [0, 0], { action: attackDefinition([
    { id: 'restore', targeting: healingTargeting(), operations: [healEffect(20)] },
  ], [{ receiver: { type: 'BINDING', bindingId: 'restore' }, operation: healEffect(5) }]) });
  const first = actionUnit(1, 'ALLY', [1, 0], { hp: 30 });
  const second = actionUnit(2, 'ALLY', [2, 0], { hp: 40 });
  const result = startSingleAction(source, source.definition.action.definitions.values().toArray()[0], {
    battlefield: fixtureBattlefieldState([source, first, second]), tick: 0,
  });

  assert.deepEqual(result.events.filter(event => event.type === 'HEAL')
    .map(event => [event.targetUnitId, event.amount, event.hp]), [[1, 20, 50], [1, 5, 55]]);
  assert.equal(result.units.find(unit => unit.id === 1).vitality.hp, 55);
  assert.equal(result.units.find(unit => unit.id === 2).vitality.hp, 40);
  assert.equal(first.vitality.hp, 30);
  assert.equal(second.vitality.hp, 40);
});
