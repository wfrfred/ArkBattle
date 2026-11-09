import { compose } from "../../dist/core/unit/index.js";
import { Hooks } from "../../dist/core/hook.js";
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fixtureBattle, initialize } from '../helpers/unit.js';
import { add as addUnit, remove as removeUnit, update as updateUnits } from '../../dist/core/battle/unit.js';
import { appear, disappear } from '../../dist/core/unit/capability/presence/index.js';
import { getUnit } from '../helpers/unit.js';
import * as projectiles from '../../dist/core/battle/projectile.js';
import * as projectilesQuery from '../../dist/core/projectile/query.js';
import { advance } from '../../dist/core/battle/projectile.js';
import { ref } from '../../dist/core/unit/query.js';
import { createArrow } from '../../dist/content/enemies/crossbowman/action.js';
import { targetApplied } from '../../dist/core/battle/damage/hp/index.js';
import { setAttackContribution } from '../../dist/core/unit/capability/offense/index.js';
import { create as modifier } from '../../dist/core/unit/contribution/attribute.js';

function setup(targetHooks = Hooks.empty()) {
  const source = initialize({ id: 0, position: [0, 0], definition: { hooks: Hooks.empty(),
    id: 'source', offense: { attack: 40 },
  } });
  const target = initialize({ id: 1, position: [1, 0], definition: { hooks: targetHooks,
    id: 'target', vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    spatialPresence: {}, targetable: { taunt: 0, restrictions: [{ id: 'hidden', value: {
      allows: () => false,
    } }] },
  } });
  const battle = addUnit(addUnit(fixtureBattle(), source), target);
  const state = {
    source: ref(source), target: ref(target), destination: target.position,
    cachedAtk: 40, speedPerTick: 1, stopDelayTicks: 0, stopAtTick: null,
    hitAttempted: false, launchedAtTick: 0,
  };
  return { battle, source, target, state };
}

function step(battle, tick) {
  return advance({ ...battle, tick }, projectilesQuery.all(battle).map(projectilesQuery.ref));
}

test('locked arrows follow a disappeared target position and separate identity hits from damage reception', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), {
    position: [0, 0], state: { ...fixture.state, stopDelayTicks: 1 },
  });
  let state = updateUnits(launched.state, ref(fixture.target), compose(appear([3, 0]), disappear()));
  state = step(state, 1);
  assert.deepEqual(projectilesQuery.get(state, launched.value).position, [1, 0]);
  assert.deepEqual(projectilesQuery.get(state, launched.value).state.destination, [3, 0]);
  state = step(state, 2);
  state = step(state, 3);
  assert.equal(projectilesQuery.get(state, launched.value).state.hitAttempted, true);
  assert.equal(getUnit(state, 1).vitality.hp, 1000);
  state = step(state, 4);
  assert.equal(projectilesQuery.get(state, launched.value), undefined);

  state = updateUnits(state, ref(fixture.target), appear([3, 0]));
  const visible = projectiles.create(state, createArrow(), { position: [3, 0], state: fixture.state });
  state = step(visible.state, 5);
  assert.equal(getUnit(state, 1).vitality.hp, 960);
});

test('dispel skips the ordinary arrow fallback hit while explicit stop performs it once', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const dispelled = projectiles.stop(launched.state, launched.value, 'DISPEL');
  const stopped = projectiles.stop(launched.state, launched.value);

  assert.equal(getUnit(dispelled, 1).vitality.hp, 1000);
  assert.equal(getUnit(stopped, 1).vitality.hp, 960);
  assert.equal(dispelled.battlefield.projectiles.size, 0);
  assert.equal(stopped.battlefield.projectiles.size, 0);
});

test('an arrow cannot hit twice when its damage response stops the projectile', () => {
  let arrow;
  let hits = 0;
  const fixture = setup(Hooks.empty().set(targetApplied, {
    id: 'stop-on-hit',
    invoke(state) {
      hits++;
      return { state: projectiles.stop(state, arrow), value: undefined };
    },
  }));
  const launched = projectiles.create(fixture.battle, createArrow(), {
    position: [0, 0], state: fixture.state,
  });
  arrow = launched.value;
  const after = step(launched.state, 1);

  assert.equal(hits, 1);
  assert.equal(getUnit(after, 1).vitality.hp, 960);
  assert.equal(projectilesQuery.get(after, arrow), undefined);
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
  assert.equal(getUnit(ended, 1).vitality.hp, 960);
});

test('tracking reads current source attack and falls back to its launch sample after removal', () => {
  const sources = [];
  const fixture = setup(Hooks.empty().set(targetApplied, {
    id: 'observe-source',
    invoke(battle, context) {
      sources.push(context.request.source);
      return { state: battle, value: undefined };
    },
  }));
  const launched = projectiles.create(fixture.battle, createArrow(), {
    position: [0, 0], state: { ...fixture.state, cachedAtk: 40 },
  });
  const boosted = updateUnits(launched.state, ref(fixture.source), setAttackContribution({
    id: 'after-launch', value: [modifier({ addition: 20 })],
  }));
  const withSource = step(boosted, 1);
  assert.equal(getUnit(withSource, 1).vitality.hp, 940);
  const withoutSource = removeUnit(boosted, fixture.source.id, "SCRIPT");
  const after = step(withoutSource, 1);
  assert.equal(getUnit(after, 1).vitality.hp, 960);
  assert.deepEqual(sources, [ref(fixture.source), null]);
});

test('a missing locked target does not redirect its arrow to another nearby unit', () => {
  const fixture = setup();
  const launched = projectiles.create(fixture.battle, createArrow(), { position: [0, 0], state: fixture.state });
  const other = initialize({ id: 2, position: [1, 0], definition: { hooks: Hooks.empty(),
    id: 'nearby', vitality: { maxHp: 100, defense: 0, resistance: 0 },
  } });
  const withoutTarget = addUnit(removeUnit(launched.state, fixture.target.id, "SCRIPT"), other);
  const after = step(withoutTarget, 1);

  assert.equal(getUnit(after, 2).vitality.hp, 100);
  assert.equal(after.battlefield.projectiles.size, 0);
});
