import { update } from "../../dist/core/battle/unit.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { initialize } from "./unit.js";
import { getUnit } from "./unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as damageHooks from "../../dist/core/battle/damage/index.js";
import * as healingHooks from "../../dist/core/battle/healing/index.js";
import { calculateHealing } from "../../dist/core/battle/healing/index.js";
import { applyHealing } from "../../dist/core/battle/healing/index.js";
import { calculateDamage } from "../../dist/core/battle/damage/index.js";
import { applyDamage } from "../../dist/core/battle/damage/index.js";
import { definition, effectFixtureWork } from "./effects.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";

export function attach(fixture, effect) {
    const prepared = "unit" in fixture ? fixture : { unit: fixture, effects: [] };
    return { unit: prepared.unit, effects: [...prepared.effects, effect] };
}

export function workFor(...fixtures) {
    let battle = effectFixtureWork(...fixtures.map(fixture => fixture.unit ?? fixture));
    for (const fixture of fixtures) {
        if ("unit" in fixture) {
            for (const effect of fixture.effects) {
                battle = effects.install(battle, unitRef(fixture.unit), effect).state;
            }
        }
    }
    return battle;
}

export function unit(
    id,
    { hp = 5000, maxHp = hp, attack = 100, defense = 0, resistance = 0, vitality = {} } = {},
) {
    const value = initialize({
        id,
        position: [0, 0],
        definition: { hooks: [],
            id: `vitality-${id}`,
            vitality: { maxHp, defense, resistance },
            targetable: { restrictions: [] },
            offense: { attack },
        },
    });
    return { ...value, vitality: { ...value.vitality, hp, ...vitality } };
}

export function parameters(power, type = "PHYSICAL", penetration = { fixed: 0, proportional: 0 }) {
    const attack = { power, multiplier: 1, addition: 0 };
    return type === "PHYSICAL" || type === "ARTS"
        ? { type, attack, penetration }
        : { type, attack };
}

export function request(power = 100, overrides = {}) {
    return {
        source: { id: 1 },
        target: { id: 2 },
        parameters: parameters(power),
        ...overrides,
    };
}

export function damage(battle, request) {
    return applyDamage(request, calculateDamage(battle, request));
}

export function healing(battle, request) {
    return applyHealing(request, calculateHealing(battle, request));
}

export function setSelf(state, context, self, next) {
    const unit = getUnit(state, context.host.id);
    const current = unit && unit.effects.get(self.id, self.definition);
    return current === undefined
        ? state
        : effects.setData(state, effectRef(current), next);
}

function hookEffect(domain, id, initial, entries, callbacks = {}) {
    let content;
    content = definition(id, initial, {
        ...callbacks,
        onInstall(state, self) {
            state = update(state,
                entries.map((entry, index) => domain.setHook(self.host, {
                            id: `${self.host.id}:${self.id}:${index}`,
                            stage: entry.stage,
                            priority: entry.priority ?? 0,
                            accepts(state, contextValue, input) {
                                const invocation = { ...contextValue, host: self.host };
                                const current = effects.get(state, effectRef(self));
                                return (
                                    current?.status === "ACTIVE" &&
                                    (entry.accepts?.(state, invocation, current, input) ?? true)
                                );
                            },
                            invoke(state, contextValue, input) {
                                const invocation = { ...contextValue, host: self.host };
                                return entry.invoke(
                                    state,
                                    invocation,
                                    effects.get(state, effectRef(self)),
                                    input,
                                );
                            },
                        })),
            );
            return callbacks.onInstall ? callbacks.onInstall(state, self) : state;
        },
        onEnd(state, self, reason) {
            state = update(state, entries.map((_entry, index) =>
                domain.removeHook(self.host, `${self.host.id}:${self.id}:${index}`)));
            return callbacks.onEnd ? callbacks.onEnd(state, self, reason) : state;
        },
    });
    return content;
}

export function damageEffect(id, initial, entries, callbacks) {
    return hookEffect(damageHooks, id, initial, entries, callbacks);
}

export function healingEffect(id, initial, entries, callbacks) {
    return hookEffect(healingHooks, id, initial, entries, callbacks);
}

export function barrier(id = "barrier", remainingAmount = 500, priority = 0) {
    return damageEffect(id, { remainingAmount }, [
        {
            stage: "receiving",
            priority,
            invoke(state, context, self, pending) {
                if (pending.cancellation !== null) return { state, value: pending };
                const absorbed = Math.min(pending.amount, self.data.remainingAmount);
                if (absorbed <= 0) return { state, value: pending };
                state = setSelf(state, context, self, {
                    ...self.data,
                    remainingAmount: self.data.remainingAmount - absorbed,
                });
                return {
                    state,
                    value: {
                        ...pending,
                        amount: pending.amount - absorbed,
                    },
                };
            },
        },
    ]);
}

export function stateOf(battle, unitId, content) {
    return getUnit(battle, unitId)
        .effects.values()
        .find((instance) => instance.definition === content)?.data;
}
