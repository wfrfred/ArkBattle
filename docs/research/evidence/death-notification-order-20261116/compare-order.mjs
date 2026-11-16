import { resolve } from 'node:path';
const root = resolve(process.cwd());
import assert from 'node:assert/strict';
const { battle, get } = await import(`${root}/test/helpers/battle.js`);
const { Hooks } = await import(`${root}/dist/core/hook.js`);
const units = await import(`${root}/dist/core/unit/index.js`);
const { update } = await import(`${root}/dist/core/battle/unit.js`);
const effects = await import(`${root}/dist/core/unit/effect/index.js`);
const hpDamage = await import(`${root}/dist/core/battle/resource/hp/damage/index.js`);
const epDamage = await import(`${root}/dist/core/battle/resource/ep/damage/index.js`);
const { createArknightsElementalDefinition } = await import(`${root}/dist/data/effect/elemental.js`);

// Public-API expression probe, not production Penance/FC-8 content or a live-game test.
const maximum = 4655; // E2 max level, full trust, potential 1, no module.
const oldHp = 1800;

function run(order) {
    let source, target, barrier;
    const trace = [];
    const hp = (state, from, to, amount, type = 'TRUE') => {
        const request = {
            source: from, killer: from, target: to, attackType: 'SPLASH', applyWay: 'MELEE', nature: 'DAMAGE', hitRecovery: false,
            parameters: { type, attack: { power: amount, multiplier: 1, addition: 0 },
                ...(type === 'ARTS' ? { penetration: { fixed: 0, proportional: 0 } } : {}) },
        };
        return hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    };
    const grantBarrier = state => {
        const current = effects.get(state, barrier);
        trace.push({ stage: 'kill barrier', amount: maximum * 0.1 });
        return effects.setState(state, barrier, { amount: current.state.amount + maximum * 0.1 });
    };
    let state = battle([
        { definition: { id: 'penance-probe',
            vitality: { maxHp: maximum, defense: 616, resistance: 10, recoverySpeed: 0, recoveryRatio: 0 },
            elemental: createArknightsElementalDefinition({ receiver: 'CHARACTER', recoveryPerSecond: 0 }),
            hooks: Hooks.empty(),
        }, position: [0, 0] },
        { definition: { id: 'duchns-probe',
            vitality: { maxHp: 1, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
            hooks: Hooks.empty().set(units.prepare, {
                id: 'death-burst', invoke(current, { reason }) {
                    if (reason !== 'DEATH') return { state: current, value: undefined };
                    if (order === 'BEFORE_VICTIM') current = grantBarrier(current);
                    const arts = hp(current, target, source, 800, 'ARTS');
                    current = arts.state;
                    trace.push({ stage: 'death arts', hp: get(current, source.id)?.vitality.health.hp ?? null });
                    const request = { source: target, target: source, attackType: 'SPLASH', applyWay: 'NONE', parameters: { type: 'BURN', power: 1000 } };
                    const elemental = epDamage.applyDamage(request, epDamage.calculateDamage(current, request));
                    trace.push({ stage: 'death burn', hp: get(elemental.state, source.id)?.vitality.health.hp ?? null });
                    return { state: elemental.state, value: undefined };
                },
            }),
        }, position: [1, 0] },
    ]);
    source = units.ref(get(state, 0)); target = units.ref(get(state, 1));
    const installed = effects.install(state, source, {
        id: 'barrier-expression', initialize: () => ({ amount: maximum * 0.5 }),
        onEnable(current, self) {
            return update(current, self.host, units.setHook(hpDamage.receiving, {
                id: 'barrier', priority: -1000,
                invoke(next, context, pending) {
                    assert.equal(pending.type, 'NORMAL');
                    const current = effects.get(next, effects.ref(self));
                    const used = Math.min(current.state.amount, pending.amount);
                    const remainder = pending.amount - used;
                    const value = remainder === 0 ? hpDamage.cancel(pending, 'BLOCKED', context.forbidden) : { ...pending, amount: remainder };
                    return { state: effects.setState(next, effects.ref(self), { amount: current.state.amount - used }), value };
                },
            }));
        },
        onDisable: (current, self) => update(current, self.host, units.removeHook(hpDamage.receiving, 'barrier')),
    });
    state = installed.state; barrier = installed.value;
    state = hp(state, null, source, maximum * 1.5 - oldHp).state;
    assert.equal(get(state, source.id).vitality.health.hp, oldHp);
    assert.equal(effects.get(state, barrier).state.amount, 0);
    const result = hp(state, source, target, 1);
    state = result.state;
    if (order === 'AFTER_APPLY' && result.value.killed) {
        if (get(state, source.id)?.lifecycle === 'PRESENT') state = grantBarrier(state);
        else trace.push({ stage: 'caller kill reward', result: 'source already left' });
    }
    return { order, killed: result.value.killed, survivingHp: get(state, source.id)?.vitality.health.hp ?? null, trace };
}

const early = run('BEFORE_VICTIM');
const late = run('AFTER_APPLY');
assert.equal(early.killed, true);
assert.equal(late.killed, true);
assert.equal(early.survivingHp, 345.5);
assert.equal(late.survivingHp, null);
console.log(JSON.stringify({ maximum, oldHp, early, late }, null, 2));
