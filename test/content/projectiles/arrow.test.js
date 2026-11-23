import { attribute, vitality } from "../../helpers/attribute.js";
// Contract: [projectile](../../../docs/architecture/projectile.md).
import { compose } from "../../../dist/core/unit/index.js";
import { Hooks } from "../../../dist/core/hook.js";
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fixtureBattle, initialize } from '../../helpers/unit.js';
import { add as addUnit, remove as removeUnit, update as updateUnits } from '../../../dist/core/unit/operations.js';
import { appear, disappear } from '../../../dist/core/unit/capability/presence/index.js';
import { getUnit } from '../../helpers/unit.js';
import * as projectiles from '../../../dist/core/projectile/index.js';
import { advance } from '../../../dist/core/projectile/operations.js';
import { ref } from '../../../dist/core/unit/query.js';
import { createArrow } from '../../../dist/content/enemies/crossbowman/projectile.js';
import { targetApplied } from '../../../dist/core/battle/resource/hp/damage/index.js';
import { setAttackContribution } from '../../../dist/core/unit/capability/offense/index.js';
import { create as modifier } from '../../../dist/core/common/modifier.js';

function setup(targetHooks = Hooks.empty()) {
  const source = initialize({ id: 0, position: [0, 0], definition: { hooks: Hooks.empty(),
    id: 'source', offense: { attack: attribute(40) },
  } });
  const target = initialize({ id: 1, position: [1, 0], definition: { hooks: targetHooks,
    id: 'target', vitality: vitality(1000),
    presence: {}, targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions: [{ id: 'hidden', value: {
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

function launch(battle, state, position = [0, 0], definition = createArrow()) {
  const initialized = projectiles.initialize(battle, { definition, position, side: 'ENEMY', state });
  return {
    state: projectiles.add(initialized.state, initialized.value),
    value: projectiles.ref(initialized.value),
  };
}

function step(battle, tick) {
  return advance({ ...battle, tick }, projectiles.all(battle).map(projectiles.ref));
}

test('locked arrows follow a disappeared target position and separate identity hits from damage reception', () => {
  const fixture = setup();
  const launched = launch(fixture.battle, { ...fixture.state, stopDelayTicks: 1 });
  let state = updateUnits(launched.state, ref(fixture.target), compose(appear([3, 0]), disappear()));
  state = step(state, 1);
  assert.deepEqual(projectiles.get(state, launched.value).position, [1, 0]);
  assert.deepEqual(projectiles.get(state, launched.value).state.destination, [3, 0]);
  state = step(state, 2);
  state = step(state, 3);
  assert.equal(projectiles.get(state, launched.value).state.hitAttempted, true);
  assert.equal(getUnit(state, 1).vitality.health.hp, 1000);
  state = step(state, 4);
  assert.equal(projectiles.get(state, launched.value), undefined);

  state = updateUnits(state, ref(fixture.target), appear([3, 0]));
  const visible = launch(state, { ...fixture.state, stopDelayTicks: 2 }, [3, 0]);
  state = step(visible.state, 5);
  assert.equal(getUnit(state, 1).vitality.health.hp, 960);
  state = step(state, 6);
  assert.equal(projectiles.get(state, visible.value).lifecycle, 'ACTIVE');
  state = step(state, 7);
  assert.equal(projectiles.get(state, visible.value), undefined);
  assert.equal(getUnit(state, 1).vitality.health.hp, 960);
});

test('elimination skips the arrow fallback hit while explicit removal performs it once', () => {
  const fixture = setup();
  const definition = { ...createArrow(), eliminatable: true };
  const launched = launch(fixture.battle, fixture.state, [0, 0], definition);
  const arrow = projectiles.get(launched.state, launched.value);
  assert.ok(arrow && projectiles.hasEliminatable(arrow));
  const eliminated = projectiles.remove(launched.state, projectiles.ref(arrow), 'ELIMINATED');
  const removed = projectiles.remove(launched.state, launched.value, 'EXPLICIT');

  assert.equal(getUnit(eliminated, 1).vitality.health.hp, 1000);
  assert.equal(getUnit(removed, 1).vitality.health.hp, 960);
  assert.equal(eliminated.battlefield.projectiles.size, 0);
  assert.equal(removed.battlefield.projectiles.size, 0);
});

test('an arrow cannot hit twice when its damage response stops the projectile', () => {
  let arrow;
  let hits = 0;
  const fixture = setup(Hooks.empty().set(targetApplied, {
    id: 'stop-on-hit',
    invoke(state) {
      hits++;
      return { state: projectiles.remove(state, arrow, 'EXPLICIT'), value: undefined };
    },
  }));
  const launched = launch(fixture.battle, fixture.state);
  arrow = launched.value;
  const after = step(launched.state, 1);

  assert.equal(hits, 1);
  assert.equal(getUnit(after, 1).vitality.health.hp, 960);
  assert.equal(projectiles.get(after, arrow), undefined);
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
  const launched = launch(fixture.battle, { ...fixture.state, cachedAtk: 40 });
  const boosted = updateUnits(launched.state, ref(fixture.source), setAttackContribution({
    id: 'after-launch', value: [modifier({ addition: 20 })],
  }));
  const withSource = step(boosted, 1);
  assert.equal(getUnit(withSource, 1).vitality.health.hp, 940);
  const withoutSource = removeUnit(boosted, fixture.state.source, { reason: "SCRIPT" });
  const after = step(withoutSource, 1);
  assert.equal(getUnit(after, 1).vitality.health.hp, 960);
  assert.deepEqual(sources, [ref(fixture.source), null]);
});

test('a missing locked target does not redirect its arrow to another nearby unit', () => {
  const fixture = setup();
  const launched = launch(fixture.battle, fixture.state);
  const other = initialize({ id: 2, position: [1, 0], definition: { hooks: Hooks.empty(),
    id: 'nearby', vitality: vitality(100),
  } });
  const withoutTarget = addUnit(removeUnit(launched.state, fixture.state.target, { reason: "SCRIPT" }), other);
  const after = step(withoutTarget, 1);

  assert.equal(getUnit(after, 2).vitality.health.hp, 100);
  assert.equal(after.battlefield.projectiles.size, 0);
});
