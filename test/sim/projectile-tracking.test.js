import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fixtureBattle, initialize } from '../helpers/unit.js';
import { add as addUnit, remove as removeUnit, replace as updateUnit } from '../../dist/core/battle/unit.js';
import { getUnit } from '../helpers/unit.js';
import * as projectiles from '../../dist/core/battle/projectile.js';
import * as projectilesQuery from '../../dist/core/projectile/query.js';
import { advance } from '../../dist/core/battle/projectile.js';
import { ref } from '../../dist/core/unit/query.js';
import { createArrow } from '../../dist/content/enemies/crossbowman/action.js';
import * as tracking from '../../dist/content/projectiles/tracking.js';
import { unit as actionUnit } from '../helpers/action-fixture.js';
import { createTacticalProjectileDemo } from '../../dist/legacy/projectile-demo.js';
import { start as startAction, ref as actionRef } from '../../dist/core/unit/action/index.js';
import { advance as advanceAction } from '../../dist/core/unit/action/index.js';

function setup(sourceCapabilities = {}) {
  const source = initialize({ id: 0, position: [0, 0], definition: { hooks: [],
    id: 'source', offense: { attack: 40 }, ...sourceCapabilities,
  } });
  const target = initialize({ id: 1, position: [1, 0], definition: { hooks: [],
    id: 'target', vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    spatialPresence: {}, targetable: { restrictions: [{ id: 'hidden', value: {
      kind: Symbol('hidden'), allows: () => false,
    } }] },
  } });
  const battle = addUnit(addUnit(fixtureBattle(), source), target);
  const state = {
    source: ref(source), target: ref(target), destination: target.position,
    cachedAtk: 20, speedPerTick: 1, stopDelayTicks: 0, stopAtTick: null,
    hitAttempted: false, launchedAtTick: 0,
  };
  return { battle, source, target, state };
}

function step(battle, tick) {
  return advance({ ...battle, tick }, projectilesQuery.all(battle).map(projectilesQuery.ref).toArray());
}

test('locked arrow hit uses identity without requiring targetability, hitbox or spatial presence', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const hidden = updateUnit(launched.state, [{
    ...fixture.target, position: [10, 0], spatialPresence: { present: false },
  }]);
  const after = step(hidden, 1);

  assert.equal(getUnit(after, 1).vitality.hp, 960);
  assert.equal(after.battlefield.projectiles.size, 0);
  assert.deepEqual(after.events.filter(event => event.type.startsWith('PROJECTILE_')).map(event => event.type), [
    'PROJECTILE_REACHED', 'PROJECTILE_HIT', 'PROJECTILE_STOPPED',
  ]);
  assert.deepEqual(after.events.find(event => event.type === 'PROJECTILE_REACHED').position, [1, 0]);
  assert.ok(after.events.findIndex(event => event.type === 'PROJECTILE_HIT') < after.events.findIndex(event => event.type === 'DAMAGE'));
  assert.equal(getUnit(fixture.battle, 1).vitality.hp, 1000);
});

test('dispel skips the ordinary arrow fallback hit while explicit stop performs it once', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const dispelled = projectiles.stop(launched.state, launched.value, 'DISPEL');
  const stopped = projectiles.stop(launched.state, launched.value);

  assert.equal(getUnit(dispelled, 1).vitality.hp, 1000);
  assert.equal(getUnit(stopped, 1).vitality.hp, 960);
  assert.equal(dispelled.events.some(event => event.type === 'PROJECTILE_HIT'), false);
  assert.equal(stopped.events.filter(event => event.type === 'PROJECTILE_HIT').length, 1);
  assert.strictEqual(projectiles.stop(stopped, launched.value), stopped);
});

test('tracking commits its hit attempt before content can synchronously stop the same projectile', () => {
  const fixture = setup();
  const observed = [];
  const hit = (battle, self) => tracking.hit(battle, self, (current, marked) => {
    observed.push([marked.state.hitAttempted, projectilesQuery.get(current, projectilesQuery.ref(marked)).state.hitAttempted]);
    return projectiles.stop(current, projectilesQuery.ref(marked));
  });
  const definition = {
    id: 'reentrant-arrow', tracking: true,
    onTick: (battle, self) => tracking.advance(battle, self, hit),
    onEnd: (battle, self, reason) => reason === 'DISPEL' ? battle : hit(battle, self),
  };
  const launched = projectiles.create(fixture.battle, definition, { position: [0, 0], state: fixture.state });
  const after = step(launched.state, 1);

  assert.deepEqual(observed, [[true, true]]);
  assert.equal(after.events.filter(event => event.type === 'PROJECTILE_HIT').length, 1);
  assert.equal(after.events.filter(event => event.type === 'PROJECTILE_STOPPED').length, 1);
  assert.equal(after.battlefield.projectiles.size, 0);
});

test('delayed tracking keeps the instance active after arrival without repeating the hit', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), {
    position: [0, 0], state: { ...fixture.state, stopDelayTicks: 2 },
  });
  const reached = step(launched.state, 1);
  const waiting = step(reached, 2);
  const ended = step(waiting, 3);

  assert.equal(projectilesQuery.get(reached, launched.value).lifecycle, 'ACTIVE');
  assert.equal(projectilesQuery.get(reached, launched.value).state.stopAtTick, 3);
  assert.equal(projectilesQuery.get(waiting, launched.value).lifecycle, 'ACTIVE');
  assert.equal(projectilesQuery.get(ended, launched.value), undefined);
  assert.equal(ended.events.filter(event => event.type === 'PROJECTILE_HIT').length, 1);
  assert.equal(getUnit(ended, 1).vitality.hp, 960);
});

test('tracking reads current source attack and falls back to its launch sample after removal', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const self = projectilesQuery.get(launched.state, launched.value);

  assert.equal(tracking.attackPower(launched.state, self), 40);
  const withSource = step(launched.state, 1);
  assert.equal(withSource.events.find(event => event.type === 'DAMAGE').sourceUnitId, fixture.source.id);
  assert.equal(getUnit(withSource, 1).vitality.hp, 960);
  const withoutSource = removeUnit(launched.state, fixture.source.id, "DEATH");
  assert.equal(tracking.attackPower(withoutSource, self), 20);
  for (const after of [step(withoutSource, 1), projectiles.stop(withoutSource, launched.value)]) {
    assert.equal(getUnit(after, 1).vitality.hp, 980);
    assert.equal(after.events.find(event => event.type === 'DAMAGE').sourceUnitId, null);
    assert.equal(after.events.find(event => event.type === 'PROJECTILE_HIT').source, fixture.source.id);
  }
});

test('arrow damage retains an existing source identity even when its HP is zero and it is spatially absent', () => {
  const fixture = setup({ vitality: { maxHp: 100, defense: 0, resistance: 0 }, spatialPresence: {} });
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const inactiveSource = updateUnit(launched.state, [{
    ...fixture.source,
    vitality: { ...fixture.source.vitality, hp: 0 },
    spatialPresence: { present: false },
  }]);
  const after = step(inactiveSource, 1);

  assert.equal(after.events.find(event => event.type === 'DAMAGE').sourceUnitId, fixture.source.id);
  assert.equal(getUnit(after, 1).vitality.hp, 960);
});

test('demo projectile damage clears removed sources for both live and cached attack policies', () => {
  for (const cachedOnly of [false, true]) {
    const actor = actionUnit(0, { action: true });
    const attack = actor.action.actions.get('primary').definition;
    const { input } = createTacticalProjectileDemo({
      initialUnits: [{ definition: { ...actor.definition, attack }, position: actor.position }],
      schedule: { type: 'TIMELINE', spawns: [] },
    }, cachedOnly);
    const source = initialize({ id: 0, ...input.initialUnits[0] });
    const target = actionUnit(1);
    const battle = addUnit(addUnit(fixtureBattle(), source), target);
    const configured = source.action.actions.get('primary');
    const started = startAction(battle, actionRef(ref(source), configured.definition));
    assert.equal(started.value.type, 'STARTED');
    const launched = advanceAction({ ...started.state, tick: 6 }, started.value.ref);
    const self = projectilesQuery.all(launched).toArray()[0];
    assert.ok(self);
    const existing = projectiles.stop(launched, projectilesQuery.ref(self));
    const withoutSource = projectiles.stop(removeUnit(launched, source.id, "DEATH"), projectilesQuery.ref(self));
    const liveDamage = existing.events.find(event => event.type === 'DAMAGE');
    const cachedDamage = withoutSource.events.find(event => event.type === 'DAMAGE');

    assert.equal(liveDamage.sourceUnitId, source.id);
    assert.equal(liveDamage.amount, cachedOnly ? 10 : 70);
    assert.equal(cachedDamage.sourceUnitId, null);
    assert.equal(cachedDamage.amount, 10);
    assert.equal(self.state.source.id, source.id);
  }
});

test('a missing locked target does not redirect its arrow to another nearby unit', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const other = initialize({ id: 2, position: [1, 0], definition: { hooks: [],
    id: 'nearby', vitality: { maxHp: 100, defense: 0, resistance: 0 },
  } });
  const withoutTarget = addUnit(removeUnit(launched.state, fixture.target.id, "DEATH"), other);
  const after = step(withoutTarget, 1);

  assert.equal(getUnit(after, 2).vitality.hp, 100);
  assert.equal(after.events.some(event => event.type === 'PROJECTILE_HIT'), false);
  assert.equal(after.battlefield.projectiles.size, 0);
});

test('tracking presentation projects known program references and leaves unrelated programs opaque', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  assert.deepEqual(tracking.project(launched.state, launched.value), {
    id: launched.value.id, source: 0, traceTarget: 1, position: [0, 0], destination: [1, 0], launchedAtTick: 0,
  });
  const unrelated = projectiles.create(launched.state, { id: 'unrelated' }, { position: [0, 0], state: {} });
  assert.equal(tracking.project(unrelated.state, unrelated.value), undefined);
});
