
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as burstLifetime } from "../../dist/core/unit/capability/elemental/operations.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { baseUnit, fixtureBattle } from "../helpers/unit.js";
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { ELEMENT_TYPES, elementValues, initialize as initializeElementalState, setContribution, setDamageHook, removeDamageHook, setHook } from '../../dist/core/unit/capability/elemental/capability.js';
import * as elemental from '../../dist/core/unit/capability/elemental/operations.js';
import { get as getBurst, resolveBurstRecoverySpeed, resolveDamageResistance } from '../../dist/core/unit/capability/elemental/query.js';
import {
  createArknightsElementalDefinition,
  getArknightsElementalBurstProfile,
  parseElementType,
} from '../../dist/data/arknights/elemental.js';
import { initialize } from "../helpers/unit.js";
import { get, ref } from '../../dist/core/unit/query.js';

import { remove } from '../../dist/core/battle/unit.js';
import { create as modifier } from '../../dist/core/unit/contribution/attribute.js';
import * as effects from '../../dist/core/unit/effect/index.js';
import { effectFixtureWork } from '../helpers/effects.js';

const simpleBursts = (program = {}) => Object.fromEntries(ELEMENT_TYPES.map(type => [type, {
  durationTicks: 300,
  onStart: battle => battle,
  ...program,
}]));
const holder = (options = {}, extras = {}) => initialize({
  id: 1,
  position: [0, 0],
  definition: { hooks: [],
    id: 'element-holder',
    allegiance: { side: 'ALLY' },
    elemental: createArknightsElementalDefinition({ receiver: 'CHARACTER', ...options }),
    ...extras,
  },
});
const fixture = (options = {}, program = {}) => {
  const unit = holder({}, { elemental: {
    maxEp: 1000, recoveryPerSecond: 0, elementResistance: 0,
    damageResistance: 0, burstRecoverySpeed: 1, bursts: simpleBursts(program), ...options,
  } });
  return { battle: effectFixtureWork(unit), target: ref(unit) };
};
const request = (type = 'BURN', power = 100, source = { id: 9 }) => ({ type, power, source });

const hook = (id, invoke, accepts = () => true) => ({ id, accepts, invoke });
const at = (battle, tick) => ({ ...battle, tick });
const advance = (battle, target, tick) => {
  for (let next = battle.tick + 1; next <= tick; next++) {
    battle = elemental.advance(at(battle, next), target);
  }
  return battle;
};
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);


test('Elemental initialization validates a complete directly constructed definition', () => {
  const definition = {
    maxEp: 0, recoveryPerSecond: 0, elementResistance: 0,
    damageResistance: 0, burstRecoverySpeed: 1, bursts: simpleBursts(),
  };
  assert.throws(() => initializeElementalState(
    fixtureBattle(), baseUnit({ id: 'invalid-elemental', hooks: [], elemental: definition }),
  ), RangeError);
});

test('EP bars retain independent partial loss and resistance has a five percent floor independent of HP resistance', () => {
  const f = fixture();
  let battle = f.battle;
  for (const type of ELEMENT_TYPES) battle = elemental.damage(battle, f.target, request(type, 200)).state;
  assert.deepEqual(get(battle, f.target).elemental.ep, elementValues(800));
  battle = elemental.damage(battle, f.target, request('NECROSIS', 50)).state;
  assert.equal(get(battle, f.target).elemental.ep.NECROSIS, 750);
  for (const [elementResistance, expected] of [[0, 100], [50, 50], [100, 5], [500, 5], [-50, 100]]) {
    const current = fixture({ elementResistance, damageResistance: 100 });
    const result = elemental.damage(current.battle, current.target, request('EROSION'));
    near(result.value.amount, expected);
    assert.equal(get(result.state, current.target).elemental.ep.EROSION, 1000 - expected);
    assert.equal(resolveDamageResistance(result.state, current.target), 95);
  }
});

test('a burst has a stable identity, locks reception, preserves source and resets all bars on completion', () => {
  const f = fixture();
  const damaged = elemental.damage(f.battle, f.target, request('NEURAL', 400)).state;
  const result = elemental.damage(at(damaged, 4), f.target, request('BURN', 1500));
  assert.equal(result.value.type, 'APPLIED');
  assert.equal(result.value.amount, 1000);
  const burst = getBurst(result.state, result.value.burst);
  assert.equal(burst.type, 'BURN');
  assert.deepEqual(burst.source, { id: 9 });
  assert.deepEqual(burst.host, f.target);
  assert.equal(burst.startedAtTick, 4);
  assert.equal(burst.remainingTicks, 300);
  for (const type of ELEMENT_TYPES) assert.equal(elemental.damage(result.state, f.target, request(type)).value.type, 'REJECTED');
  assert.equal(elemental.heal(result.state, f.target, { source: null, power: 100 }).value.type, 'REJECTED');
  const firstAdvance = elemental.advance(result.state, f.target);
  assert.equal(getBurst(firstAdvance, result.value.burst).remainingTicks, 299);
  const halfway = advance(firstAdvance, f.target, 153);
  assert.equal(getBurst(halfway, result.value.burst).remainingTicks, 150);
  assert.deepEqual(get(halfway, f.target).elemental.ep, get(result.state, f.target).elemental.ep);
  const completed = advance(halfway, f.target, 303);
  assert.equal(getBurst(completed, result.value.burst), undefined);
  assert.equal(get(completed, f.target).elemental.burst, null);
  assert.deepEqual(get(completed, f.target).elemental.ep, elementValues(1000));
  const next = elemental.damage(completed, f.target, request('EROSION', 1000));
  assert.notEqual(next.value.burst.id, result.value.burst.id);
  assert.equal(elemental.finish(next.state, result.value.burst), next.state);
  assert.equal(elemental.cancel(next.state, result.value.burst, 'OLD'), next.state);
  assert.equal(getBurst(next.state, next.value.burst).status, 'ACTIVE');
});


test('received Hook may remove the host before settlement without publishing damage from a stale Unit', () => {
  const f = fixture();
  let damaged = false;
  let battle = applyUnitChanges(f.battle, [setHook(f.target, 'received', hook('remove-host', (current, { host }) => {
      const self = get(current, host);
return { state: remove(current, self.id, "DEATH"), value: undefined }; }))]);
  battle = applyUnitChanges(battle, [setHook(f.target, 'damaged', hook('observe', (current) => { damaged = true; return { state: current, value: undefined }; }))]);
  const result = elemental.damage(battle, f.target, request('BURN', 1000));
  assert.equal(result.value.type, 'REJECTED');
  assert.equal(get(result.state, f.target), undefined);
  assert.equal(damaged, false);
  assert.equal(result.state.events.some(event => event.type === 'ELEMENT_DAMAGE'), false);
});

test('request-specific damage Hooks can reduce one element without changing common resistance', () => {
  const f = fixture();
  const battle = applyUnitChanges(f.battle, [setDamageHook(f.target, {
    id: 'erosion-reduction',
    accepts: () => true,
    invoke: (current, { request }, amount) => ({ state: current, value: amount * (request.type === 'EROSION' ? 0.5 : 1) }),
  })]);
  assert.equal(elemental.damage(battle, f.target, request('EROSION')).value.amount, 50);
  assert.equal(elemental.damage(battle, f.target, request('BURN')).value.amount, 100);
});

const epShield = (id, budget) => ({
  id,
  initialize: () => ({ remaining: budget }),
  onEnable(battle, effectSelf) {
    const address = effectRef(effectSelf);
    return applyUnitChanges(battle, [setDamageHook(address.host, {
      id: `shield/${address.id}`,
      accepts: current => {
        const self = effects.get(current, address);
        return self?.status === 'ACTIVE' && self.data.remaining > 0;
      },
      invoke(current, _context, amount) {
        const self = effects.get(current, address);
        const blocked = Math.min(amount, self.data.remaining);
        current = effects.setData(current, address, {
          ...self.data,
          remaining: self.data.remaining - blocked,
        });
        return { state: current, value: amount - blocked };
      },
    })]);
  },
  onDisable(battle, self) {
    const unit = get(battle, self.host);
    return unit === undefined ? battle : applyUnitChanges(battle, [removeDamageHook(self.host, `shield/${self.id}`)]);
  },
});

test('Effects compose EP shields after resistance, retain their own budgets and unregister on disable', () => {
  const f = fixture({ elementResistance: 50 });
  const first = effects.install(f.battle, f.target, epShield('first-shield', 30));
  const second = effects.install(first.state, f.target, epShield('second-shield', 40));
  const original = second.state;
  let result = elemental.damage(original, f.target, request());
  assert.equal(result.value.amount, 0);
  assert.equal(effects.get(result.state, first.value).data.remaining, 0);
  assert.equal(effects.get(result.state, second.value).data.remaining, 20);
  assert.equal(effects.get(original, first.value).data.remaining, 30);
  assert.equal(get(result.state, f.target).elemental.ep.BURN, 1000);
  result = elemental.damage(result.state, f.target, request());
  assert.equal(result.value.amount, 30);
  assert.equal(get(result.state, f.target).elemental.ep.BURN, 970);
  const disabled = effects.setEnabled(original, first.value, false);
  result = elemental.damage(disabled, f.target, request());
  assert.equal(result.value.amount, 10);
  assert.equal(effects.get(result.state, first.value).data.remaining, 30);
  assert.equal(effects.get(result.state, second.value).data.remaining, 0);
});

test('nested EP damage consumes a shared Effect shield before the outer reception continues', () => {
  const f = fixture();
  const prepared = applyUnitChanges(f.battle, [setDamageHook(f.target, {
    id: 'nested-damage',
    accepts: () => true,
    invoke(battle, { host, request: incoming }, amount) {
      if (incoming.power === 100) {
        battle = elemental.damage(battle, host, request('BURN', 60)).state;
      }
      return { state: battle, value: amount };
    },
  })]);
  const installed = effects.install(prepared, f.target, epShield('shared-shield', 100));
  const result = elemental.damage(installed.state, f.target, request());
  assert.equal(result.value.amount, 60);
  assert.equal(effects.get(result.state, installed.value).data.remaining, 0);
  assert.equal(get(result.state, f.target).elemental.ep.BURN, 940);
  assert.deepEqual(result.state.events.filter(event => event.type === 'ELEMENT_DAMAGE').map(event => event.amount), [60]);
});


test('EP reception stops when a damage Hook removes the host', () => {
  const f = fixture();
  let battle = applyUnitChanges(f.battle, [setDamageHook(f.target, {
    id: 'leave',
    accepts: () => true,
    invoke: (current, { host }, amount) => ({ state: remove(current, host.id, "DEATH"), value: amount }),
  })]);
  battle = applyUnitChanges(battle, [setDamageHook(f.target, {
    id: 'unreachable',
    accepts: () => true,
    invoke: () => { throw new Error('removed host'); },
  })]);
  const result = elemental.damage(battle, f.target, request());
  assert.equal(result.value.type, 'REJECTED');
  assert.equal(get(result.state, f.target), undefined);
  assert.equal(result.state.events.some(event => event.type === 'ELEMENT_DAMAGE'), false);
});

test('burstStarted precedes damage observers and onStart rereads after nested cancellation', () => {
  const seen = [];
  const f = fixture({}, { onStart: battle => { seen.push('program'); return battle; } });
  let battle = applyUnitChanges(f.battle, [setHook(f.target, 'burstStarted', hook('start', (current, { event: burst }) => {
    seen.push('started'); return { state: elemental.cancel(current, burst, 'NESTED'), value: undefined };
  }))]);
  battle = applyUnitChanges(battle, [setHook(f.target, 'burstEnded', hook('end', (current, { event }) => {
    seen.push(['ended', event.end]); return { state: current, value: undefined };
  }))]);
  battle = applyUnitChanges(battle, [setHook(f.target, 'damaged', hook('damage', (current, { event }) => {
    seen.push(['damaged', event.amount]); return { state: current, value: undefined };
  }))]);
  elemental.damage(battle, f.target, request('BURN', 1000));
  assert.deepEqual(seen, ['started', ['ended', { type: 'CANCELLED', reason: 'NESTED' }], ['damaged', 1000]]);
});

test('reentrant replacement Burst does not authorize the previous Burst startup program', () => {
  const started = [];
  const f = fixture({}, { onStart: (battle, self) => { started.push(self.type); return battle; } });
  const battle = applyUnitChanges(f.battle, [setHook(f.target, 'burstStarted', hook('replace', (current, { event: burst }) => {
    if (burst.type !== 'BURN') return { state: current, value: undefined };
    current = elemental.cancel(current, burst, 'REPLACED');
    return { state: elemental.damage(current, f.target, request('NEURAL', 1000)).state, value: undefined };
  }))]);
  const result = elemental.damage(battle, f.target, request('BURN', 1000));
  assert.deepEqual(started, ['NEURAL']);
  assert.equal(getBurst(result.state, result.value.burst), undefined);
  assert.equal(get(result.state, f.target).elemental.burst.type, 'NEURAL');
});

test('burst onEnd observes ENDING and full cancellation reason; dependent Effects end while permanent Effects survive', () => {
  const seen = [];
  const f = fixture({}, { onEnd: (battle, self, end) => {
    seen.push([self.status, end, elemental.damage(battle, self.host, request()).value.type]); return battle;
  } });
  const result = elemental.damage(f.battle, f.target, request('BURN', 1000));
  const bound = effects.install(result.state, f.target, { id: 'bound', initialize: () => ({}) }, { scopes: [lifetimeScope(burstLifetime, result.value.burst)] });
  const permanent = effects.install(bound.state, f.target, { id: 'permanent', initialize: () => ({}) });
  const ended = elemental.cancel(permanent.state, result.value.burst, 'CONTENT');
  assert.deepEqual(seen, [['ENDING', { type: 'CANCELLED', reason: 'CONTENT' }, 'REJECTED']]);
  assert.equal(effects.get(ended, bound.value), undefined);
  assert.equal(effects.get(ended, permanent.value).status, 'ACTIVE');
});

test('normal completion reports FINISHED and host departure closes an active Burst with its actual reason', () => {
  const seen = [];
  const f = fixture({}, { onEnd: (battle, _self, end) => { seen.push(end); return battle; } });
  let result = elemental.damage(f.battle, f.target, request('BURN', 1000));
  let battle = elemental.finish(result.state, result.value.burst);
  assert.deepEqual(seen, [{ type: 'FINISHED' }]);
  result = elemental.damage(battle, f.target, request('BURN', 1000));
  battle = remove(result.state, f.target.id, "DEATH");
  assert.deepEqual(seen, [{ type: 'FINISHED' }, { type: 'CANCELLED', reason: 'DEATH' }]);
  assert.equal(get(battle, f.target), undefined);
  assert.equal(getBurst(battle, result.value.burst), undefined);
});

test('nested host departure during onEnd cannot resurrect the ending Unit or Burst', () => {
  let calls = 0;
  const f = fixture({}, { onEnd: (battle, self) => { calls++; return remove(battle, self.host.id, "DEATH"); } });
  const result = elemental.damage(f.battle, f.target, request('BURN', 1000));
  const ended = elemental.finish(result.state, result.value.burst);
  assert.equal(calls, 1);
  assert.equal(get(ended, f.target), undefined);
  assert.equal(getBurst(ended, result.value.burst), undefined);
});

test('dynamic burst speed preserves elapsed budget and zero speed does not accumulate deferred progress', () => {
  const f = fixture();
  const result = elemental.damage(f.battle, f.target, request('BURN', 1000));
  let battle = advance(result.state, f.target, 60);
  assert.equal(getBurst(battle, result.value.burst).remainingTicks, 240);
  battle = applyUnitChanges(battle, [setContribution(f.target, 'burstRecoverySpeed', { id: 'speed', value: [modifier({ finalScaler: 0 })] })]);
  battle = advance(battle, f.target, 1000);
  assert.equal(getBurst(battle, result.value.burst).remainingTicks, 240);
  battle = applyUnitChanges(battle, [setContribution(f.target, 'burstRecoverySpeed', { id: 'speed', value: [modifier({ finalScaler: 2 })] })]);
  assert.equal(resolveBurstRecoverySpeed(battle, f.target), 2);
  battle = advance(battle, f.target, 1060);
  assert.equal(getBurst(battle, result.value.burst).remainingTicks, 120);
  battle = advance(battle, f.target, 1120);
  assert.equal(getBurst(battle, result.value.burst), undefined);
});

test('natural recovery preserves fractional EP and never accumulates a full-bar healing budget', () => {
  const f = fixture({ recoveryPerSecond: 15 });
  let battle = advance(f.battle, f.target, 1000);
  battle = elemental.damage(battle, f.target, request('BURN', 100)).state;
  battle = advance(battle, f.target, 1001);
  assert.equal(get(battle, f.target).elemental.ep.BURN, 900.5);
  assert.equal(get(battle, f.target).elemental.ep.NEURAL, 1000);
  battle = advance(battle, f.target, 1002);
  assert.equal(get(battle, f.target).elemental.ep.BURN, 901);
});

test('ordinary damage and healing before the scheduled advance do not consume natural recovery time', () => {
  const f = fixture({ recoveryPerSecond: 30 });
  let battle = elemental.damage(f.battle, f.target, request('BURN', 100)).state;
  for (let tick = 1; tick <= 10; tick++) {
    battle = at(battle, tick);
    battle = elemental.damage(battle, f.target, request('BURN', 2)).state;
    battle = elemental.heal(battle, f.target, { source: null, power: 0.5 }).state;
    battle = elemental.advance(battle, f.target);
  }
  assert.equal(get(battle, f.target).elemental.ep.BURN, 895);
});


test('raw element identities preserve the four supported native types and reject NONE, ANGER and guessed aliases', () => {
  for (const [index, raw, type] of [
    [1, 'SANITY', 'NEURAL'], [2, 'WATER', 'EROSION'], [3, 'FIRE', 'BURN'], [4, 'DARK', 'NECROSIS'],
  ]) {
    assert.equal(parseElementType(index), type);
    assert.equal(parseElementType(raw), type);
  }
  for (const value of [0, 5, 'NONE', 'ANGER', 'fire', 'BURN']) assert.throws(() => parseElementType(value), TypeError);
});


test('standard elemental profiles match the extracted client EPBreakBuffDB, BuffData and prefab damage nodes', () => {
  const fixture = JSON.parse(readFileSync(new URL('../fixtures/arknights-elemental-buffs.json', import.meta.url), 'utf8'));
  const rawDamageType = { PURE: 'TRUE', PHYSICAL: 'PHYSICAL', MAGICAL: 'ARTS', ELEMENT: 'ELEMENTAL' };
  const blackboard = key => new Map(fixture.buffData[key].blackboard.map(entry => [entry.key, entry.value]));
  const damageNode = key => fixture.buffTemplates.find(entry => entry.record.templateKey === key).record.eventToActions._items
    .flatMap(entry => JSON.parse(entry.value.SerializedState))
    .find(node => node.$type === 'Torappu.Battle.Action.Nodes+NoSourceDamage');
  for (const [raw, type] of [['SANITY', 'NEURAL'], ['WATER', 'EROSION'], ['FIRE', 'BURN'], ['DARK', 'NECROSIS']]) {
    const breakData = fixture.epBreakData[raw];
    for (const receiver of ['CHARACTER', 'ENEMY']) {
      const selected = getArknightsElementalBurstProfile(receiver, type);
      const suffix = receiver === 'CHARACTER' ? 'char' : 'enemy';
      const buffKey = `${breakData.elementBuffs[0]}_${suffix}`;
      const values = blackboard(buffKey);
      assert.equal(selected.durationTicks, 30 * breakData[receiver === 'CHARACTER' ? 'elementBreakDuration' : 'enemyElementBreakDuration']);
      if (raw !== 'DARK') {
        const node = damageNode(buffKey);
        assert.deepEqual(selected.burstDamage, { type: rawDamageType[node._damageType], power: values.get(node._damageKey) });
        assert.equal(node._ignoreForSp, false);
      } else {
        const node = damageNode(receiver === 'CHARACTER' ? 'periodic_magic_damage' : 'periodic_element_damage');
        assert.deepEqual(selected.damagePerSecond, { type: rawDamageType[node._damageType], power: values.get('damage') / values.get('interval') });
        assert.equal(node._ignoreForSp, true);
      }
    }
  }
  assert.equal(getArknightsElementalBurstProfile('CHARACTER', 'NEURAL').stunTicks, 30 * blackboard('ep_break_sanity_char').get('stun'));
  assert.equal(getArknightsElementalBurstProfile('ENEMY', 'NEURAL').paralysisStacks, blackboard('ep_break_sanity_enemy').get('palsy_stack_cnt'));
  assert.equal(getArknightsElementalBurstProfile('CHARACTER', 'EROSION').defReduction, -blackboard('ep_break_water_char').get('def'));
  assert.equal(getArknightsElementalBurstProfile('ENEMY', 'EROSION').defReduction, -fixture.buffData.ep_break_water_enemy.attributes.attributeModifiers[0].value);
  assert.equal(fixture.buffData.ep_break_water_enemy.isDurableBuff, true);
  assert.equal(getArknightsElementalBurstProfile('CHARACTER', 'BURN').resReduction, -blackboard('ep_break_fire_char').get('magic_resistance'));
  assert.equal(getArknightsElementalBurstProfile('ENEMY', 'BURN').resReduction, -fixture.buffData.ep_break_fire_enemy.attributes.attributeModifiers[0].value);
  assert.equal(getArknightsElementalBurstProfile('CHARACTER', 'NECROSIS').spDrainPerSecond, -blackboard('ep_break_dark_char').get('sp'));
  assert.equal(getArknightsElementalBurstProfile('ENEMY', 'NECROSIS').attackReductionRatio, -blackboard('ep_break_dark_enemy').get('atk_down'));
  assert.equal(holder({ receiver: 'ENEMY', boss: true }).definition.elemental.maxEp, 2000);
  assert.equal(holder({ receiver: 'CHARACTER', boss: true }).definition.elemental.maxEp, 1000);
});
