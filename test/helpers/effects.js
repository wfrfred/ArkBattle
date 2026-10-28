import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { fixtureBattlefieldState as fixtureBattlefield } from "./battlefield.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { getUnit, replaceUnit } from "./unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import {
    setAttackContribution,
    removeAttackContribution,
} from "../../dist/core/unit/capability/offense/index.js";
import {
    setMaxHpContribution,
    removeMaxHpContribution,
} from "../../dist/core/unit/capability/vitality/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";

export function effectFixtureWork(...units) {
    return createBattleState(fixtureBattlefield(units));
}

export function installFixtureEffect(unit, definition, initial = {}, tick = 0) {
    const state = effectFixtureWork(unit);
    const installed = effects.install({ ...state, tick }, unitRef(unit), definition, initial);
    return getUnit(installed.state, unit.id);
}

export const definition = (id, initial = {}, callbacks = {}) => ({
    id,
    initialize: () => initial,
    ...callbacks,
});

export function install(
    state,
    definition,
    unitId = [...state.battlefield.units.keys()][0],
    initial = {},
) {
    return effects.install(state, unitRef(getUnit(state, unitId)), definition, initial);
}

export function at(state, tick) {
    return { ...state, tick };
}

export function attackBuff(id = "attack-buff", amount = 20, callbacks = {}) {
    return contributionBuff(
        id,
        amount,
        (unit, entry) => ({ ...unit, offense: setAttackContribution(unit.offense, entry) }),
        (unit, entryId) => ({ ...unit, offense: removeAttackContribution(unit.offense, entryId) }),
        callbacks,
    );
}

export function maxHpBuff(id = "max-hp-buff", amount = 100, callbacks = {}) {
    return contributionBuff(
        id,
        amount,
        (unit, entry) => ({
            ...unit,
            vitality: setMaxHpContribution(unit.vitality, unit.definition.vitality, entry),
        }),
        (unit, entryId) => ({
            ...unit,
            vitality: removeMaxHpContribution(unit.vitality, unit.definition.vitality, entryId),
        }),
        callbacks,
    );
}

function contributionBuff(id, amount, set, remove, callbacks) {
    return definition(
        id,
        { amount },
        {
            ...callbacks,
            onEnable(state, self) {
                const unit = getUnit(state, self.host.id);
                if (unit !== undefined) {
                    state = replaceUnit(state, set(unit, {
                        id: `${self.host.id}:${self.id}`,
                        value: [modifier({ finalAddition: self.data.amount })],
                    }));
                }
                return callbacks.onEnable ? callbacks.onEnable(state, self) : state;
            },
            onDisable(state, self) {
                const unit = getUnit(state, self.host.id);
                if (unit !== undefined) {
                    state = replaceUnit(state, remove(unit, `${self.host.id}:${self.id}`));
                }
                return callbacks.onDisable ? callbacks.onDisable(state, self) : state;
            },
        },
    );
}

export function refreshAttack(state, ref) {
    const instance = get(state, ref);
    if (instance?.status !== "ACTIVE") return state;
    const unit = getUnit(state, ref.host.id);
    if (unit === undefined) return state;
    return replaceUnit(state, {
        ...unit,
        offense: setAttackContribution(unit.offense, {
            id: `${ref.host.id}:${ref.id}`,
            value: [modifier({ finalAddition: instance.data.amount })],
        }),
    });
}

export function contributionEffect(
    id,
    initial,
    { capability, set, remove, value, group, dynamic = false },
    callbacks = {},
) {
    let content;
    const key = (ref) => `${ref.host.id}:${ref.id}`;
    const publish = (state, self) => {
        const unit = getUnit(state, self.host.id);
        if (unit === undefined) return state;
        return replaceUnit(state, {
            ...unit,
            [capability]: set(unit[capability], {
                id: key(effectRef(self)),
                ...(group === undefined
                    ? {}
                    : { group: typeof group === "function" ? group(self) : group }),
                value: dynamic
                    ? (battle, host) => {
                          const current = get(battle, effectRef(self));
                          return current === undefined ? [] : value(current, battle, host);
                      }
                    : value(self, state, unit),
            }),
        });
    };
    content = definition(id, initial, {
        ...callbacks,
        onEnable(state, self) {
            state = publish(state, self);
            return callbacks.onEnable ? callbacks.onEnable(state, self) : state;
        },
        onDisable(state, self) {
            const unit = getUnit(state, self.host.id);
            if (unit !== undefined) {
                state = replaceUnit(state, {
                    ...unit,
                    [capability]: remove(unit[capability], key(effectRef(self))),
                });
            }
            return callbacks.onDisable ? callbacks.onDisable(state, self) : state;
        },
    });
    return content;
}

export function refreshContribution(state, ref, content, { capability, set, value, group }) {
    const current = get(state, ref);
    if (current?.status !== "ACTIVE") return state;
    const unit = getUnit(state, ref.host.id);
    if (unit === undefined) return state;
    return replaceUnit(state, {
        ...unit,
        [capability]: set(unit[capability], {
            id: `${ref.host.id}:${ref.id}`,
            ...(group === undefined
                ? {}
                : { group: typeof group === "function" ? group(current) : group }),
            value: value(current, state, unit),
        }),
    });
}
