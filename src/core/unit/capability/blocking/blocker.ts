import type { State as BattleState, Result } from "../../../battle/state.js";
import * as registry from "../../../hook.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import type { Blockable } from "./blockable.js";
import type { Hook, Key } from "./contract.js";
import type { Rule } from "./rule.js";

export interface Definition {
    readonly capacity: number;
    readonly geometry: { readonly radius: number };
    readonly rules?: readonly Rule[];
}

export interface State {
    readonly blocked: readonly Ref<Unit & Blockable>[];
    readonly capacity: readonly contribution.Contribution<readonly attribute.Modifier[]>[];
    readonly geometry: { readonly radius: number };
    readonly rules: readonly Rule[];
    readonly acquired: readonly Hook<Unit & Blocker>[];
    readonly released: readonly Hook<Unit & Blocker>[];
}

export interface Blocker {
    readonly definition: {
        readonly blocker: Definition;
    };
    readonly blocker: State;
}

export function hasBlocker<U extends Unit>(unit: U): unit is U & Blocker {
    return "blocker" in unit && "blocker" in unit.definition;
}

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    assertNonnegativeSafeInteger(definition.capacity, "blocking capacity");
    assertNonnegativeNumber(definition.geometry.radius, "block radius");

    return {
        state: battle,
        value: {
            blocked: [],
            capacity: [],
            geometry: definition.geometry,
            rules: definition.rules ?? [],
            acquired: [],
            released: [],
        },
    };
}

export function setHook(state: State, key: Key, hook: Hook<Unit & Blocker>): State {
    const entries = registry.set(state[key], hook);

    return entries === state[key] ? state : { ...state, [key]: entries };
}

export function removeHook(state: State, key: Key, id: string): State {
    const entries = registry.remove(state[key], id);

    return entries === state[key] ? state : { ...state, [key]: entries };
}

export function setRule(state: State, rule: Rule): State {
    const rules = registry.set(state.rules, rule);

    return rules === state.rules ? state : { ...state, rules };
}

export function removeRule(state: State, id: string): State {
    const rules = registry.remove(state.rules, id);

    return rules === state.rules ? state : { ...state, rules };
}

function setCapacityContributions(state: State, capacity: State["capacity"]): State {
    return capacity === state.capacity ? state : { ...state, capacity };
}

export function setCapacityContribution(
    state: State,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): State {
    return setCapacityContributions(state, contribution.set(state.capacity, entry));
}

export function removeCapacityContribution(state: State, id: string): State {
    return setCapacityContributions(state, contribution.remove(state.capacity, id));
}

export function resolveCapacity(definition: Definition, state: State): number {
    const value = Math.max(
        0,
        attribute.apply(definition.capacity, contribution.resolve(state.capacity).flat()),
    );
    const lower = Math.floor(value);

    return value - lower === 0.5 ? lower + (lower % 2) : Math.round(value);
}
