import { resolve } from 'node:path';
const root = resolve(process.cwd());
const { battle, get } = await import(`${root}/test/helpers/battle.js`);
const { Hooks } = await import(`${root}/dist/core/hook.js`);
const units = await import(`${root}/dist/core/unit/index.js`);
const { update, remove } = await import(`${root}/dist/core/battle/unit.js`);
const damage = await import(`${root}/dist/core/battle/resource/hp/damage/index.js`);
const skill = await import(`${root}/dist/core/unit/skill/index.js`);
const skillCapability = await import(`${root}/dist/core/unit/capability/skill/index.js`);
const effects = await import(`${root}/dist/core/unit/effect/index.js`);

const vitality = { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 };
const program = {
 id: 'reward-resource', initialize: state => ({ state, value: {} }), activation: null,
 sp: { initial: 0, capacity: 10, requirement: 1, recovery: { type: 'NONE' } },
};
function fixture(action, place, rewardAt) {
 const trace = [];
 let source, target;
 function consequence(current) {
   trace.push({ stage: `target.${place}`, sourceLifecycle: get(current, source.id)?.lifecycle });
   if (action === 'remove-source') return remove(current, source, 'SCRIPT');
   return update(current, source, skillCapability.setRestriction('recoveryRestrictions', {
     id: 'death-forbids-sp', value: { allows: () => false },
   }));
 }
 let state = battle([
  { definition: { id: 'source', vitality, skill: { initialize: state => skill.create(state, program) },
    hooks: Hooks.empty()
     .set(damage.completed, { id: 'reward-after-damage', invoke(current, { outcome }) {
       if (outcome.type !== 'APPLIED' || !outcome.killed) return { state: current, value: undefined };
       trace.push({ stage: 'source.completed', targetLifecycle: get(current, target.id)?.lifecycle ?? 'REMOVED', settling: current.lifetime.settling });
       if (rewardAt === 'caller') return { state: current, value: undefined };
       const rewarded = skill.recover(current, source, 'EXTERNAL', 1);
       trace.push({ stage: 'source.reward', result: rewarded.value });
       return { state: rewarded.state, value: undefined };
     } })
     .set(units.prepare, { id: 'source-preparing', invoke(current) {
       trace.push({ stage: 'source.prepare', sp: get(current, source.id).skill.sp.value });
       return { state: current, value: undefined };
     } })
     .set(units.leave, { id: 'source-left', invoke(current) {
       trace.push({ stage: 'source.leave' }); return { state: current, value: undefined };
     } }),
  }, position: [0, 0] },
  { definition: { id: 'victim', vitality, hooks: Hooks.empty()
     .set(units.prepare, { id: 'victim-preparing', invoke(current) {
       trace.push({ stage: 'target.prepare' });
       return { state: place === 'prepare' ? consequence(current) : current, value: undefined };
     } })
     .set(units.leave, { id: 'victim-left', invoke(current) {
       trace.push({ stage: 'target.leave' }); return { state: current, value: undefined };
     } }),
  }, position: [1, 0] },
  { definition: { id: 'outer-finalizer-owner', hooks: Hooks.empty() }, position: [2, 0] },
 ]);
 source = units.ref(get(state, 0)); target = units.ref(get(state, 1));
 if (place === 'effect-end') state = effects.install(state, target, {
   id: 'victim-cleanup', initialize: () => ({}),
   onEnd: current => consequence(current),
 }).state;
 const request = { source, target, nature: 'DAMAGE', hitRecovery: false, attackType: 'NORMAL', applyWay: 'NONE',
   parameters: { type: 'TRUE', attack: { power: 100, multiplier: 1, addition: 0 } } };
 return { state, source, target, trace, request };
}
function run(action, place, insideFinalize, rewardAt = 'completed') {
 let { state, source, target, trace, request } = fixture(action, place, rewardAt);
 let outcome;
 const apply = current => {
   trace.push({ stage: 'apply.enter', settling: current.lifetime.settling });
   const result = damage.applyDamage(request, { state: current, value: { type: 'TRUE', amount: 100 } });
   outcome = result.value;
   trace.push({ stage: 'apply.return', killed: outcome.killed,
     targetLifecycle: get(result.state, target.id)?.lifecycle ?? 'REMOVED',
     sourceLifecycle: get(result.state, source.id)?.lifecycle ?? 'REMOVED',
     sourceSp: get(result.state, source.id)?.skill.sp.value,
   });
   if (rewardAt === 'caller' && outcome.killed) {
     const reward = skill.recover(result.state, source, 'EXTERNAL', 1);
     trace.push({ stage: 'caller.reward', result: reward.value });
     return reward.state;
   }
   return result.state;
 };
 if (insideFinalize) {
   const carrier = units.ref(get(state, 2));
   const installed = effects.install(state, carrier, {
     id: 'outer', initialize: () => ({}), onEnd(current) {
       trace.push({ stage: 'outer.onEnd.enter' });
       current = apply(current);
       trace.push({ stage: 'outer.onEnd.exit' });
       return current;
     },
   });
   state = effects.end(installed.state, installed.value, 'FINISHED');
 } else state = apply(state);
 console.log(JSON.stringify({ action, place, insideFinalize, rewardAt, killed: outcome.killed, application: outcome.application,
   finalSourceSp: get(state, source.id)?.skill.sp.value,
   sourcePresent: get(state, source.id) !== undefined,
   trace,
 }));
}
run('remove-source', 'prepare', false);
run('remove-source', 'effect-end', false);
run('block-sp', 'effect-end', false);
run('block-sp', 'effect-end', true);
run('remove-source', 'effect-end', true);

run('block-sp', 'effect-end', false, 'caller');
run('block-sp', 'effect-end', true, 'caller');
run('remove-source', 'prepare', false, 'caller');
run('remove-source', 'prepare', true);
run('remove-source', 'prepare', true, 'caller');
