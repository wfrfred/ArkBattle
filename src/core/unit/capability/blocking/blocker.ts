import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { roundToEven } from "../../../common/math.js";
import * as contribution from "../../../common/contribution.js";
import * as modifier from "../../../common/modifier.js";
import { validateRestrictions } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Type as LayerType } from "../layer/capability.js";
import type { Relation, Hook } from "./contract.js";
import type { Restriction } from "./restriction.js";
import { removing } from "./blocker-operations.js";
import { Hooks as UnitHooks, key } from "../../../hook.js";
import { removing as removingKey } from "../../hook.js";

export type Modifier = { readonly type: "ADD"; readonly value: number } | { readonly type: "ZERO" };

export interface Rule {
    readonly layers: readonly LayerType[];
    readonly radius: number;
    readonly ignoreTerrain: boolean;
}

export const ground: Rule = {
    layers: ["GROUND"],
    radius: 0.7071,
    ignoreTerrain: false,
};

export const air: Rule = {
    layers: ["AIR"],
    radius: 0.8944,
    ignoreTerrain: true,
};

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface Definition extends Restrictions {
    readonly capacity: number;
    readonly rule: Rule;
}

export interface State extends Restrictions {
    readonly relations: readonly Relation[];
    readonly capacity: readonly contribution.Contribution<readonly Modifier[]>[];
    readonly rule: Rule;
    readonly radius: readonly contribution.Contribution<modifier.Modifier>[];
}

export interface Blocker {
    readonly definition: {
        readonly blocker: Definition;
    };
    readonly blocker: State;
}

export const acquired = key<Hook<Unit & Blocker>, Unit & Blocker>("blocker.acquired");

export const released = key<Hook<Unit & Blocker>, Unit & Blocker>("blocker.released");

export function hasBlocker<U extends Unit>(unit: U): unit is U & Blocker {
    return "blocker" in unit && "blocker" in unit.definition;
}

export function initialize<U extends Unit & Pick<Blocker, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Blocker> {
    if ("blockable" in unit.definition) {
        throw new TypeError("a unit cannot be both blocker and blockable");
    }

    const definition = unit.definition.blocker;
    assertNonnegativeSafeInteger(definition.capacity, "blocking capacity");
    assertNonnegativeNumber(definition.rule.radius, "block radius");
    validateRestrictions(definition.restrictions);

    return {
        state: battle,
        value: {
            ...unit,
            hooks: UnitHooks.empty().set(removingKey, removing).merge(unit.hooks),
            blocker: {
                relations: [],
                capacity: [],
                rule: definition.rule,
                radius: [],
                restrictions: definition.restrictions,
            },
        },
    };
}

export function resolveCapacity(definition: Definition, state: State): number {
    let addition = 0;

    for (const modifier of contribution.resolve(state.capacity).flat()) {
        if (modifier.type === "ZERO") {
            return 0;
        }

        addition += modifier.value;
    }

    return roundToEven(Math.max(0, definition.capacity + addition));
}

export function resolveRadius(state: State): number {
    return Math.max(0, modifier.apply(state.rule.radius, contribution.resolve(state.radius)));
}

export const { set: setRadiusContribution, remove: removeRadiusContribution } =
    createRegistrationOperations<Unit & Blocker, "blocker", "radius">("blocker", "radius");
