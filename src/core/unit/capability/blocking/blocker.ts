import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { roundToEven } from "../../../common/math.js";
import * as contribution from "../../contribution/contribution.js";
import type { Unit } from "../../unit.js";
import type { Relation, Hook } from "./contract.js";
import type { Restriction } from "./restriction.js";
import { prepare } from "./blocker-operations.js";
import { Hooks as UnitHooks, key } from "../../../hook.js";
import { prepare as prepareKey } from "../../hook.js";

export type Layer = "GROUND" | "AIR";

export type Modifier = { readonly type: "ADD"; readonly value: number } | { readonly type: "ZERO" };

export const DEFAULT_RADIUS: Readonly<Record<Layer, number>> = {
    GROUND: 0.7071,
    AIR: 0.8944,
};

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface Definition extends Restrictions {
    readonly capacity: number;
    readonly layer: Layer;
    readonly radius?: number;
}

export interface State extends Restrictions {
    readonly relations: readonly Relation[];
    readonly capacity: readonly contribution.Contribution<readonly Modifier[]>[];
    readonly layer: Layer;
    readonly radius: number;
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
    const radius = definition.radius ?? DEFAULT_RADIUS[definition.layer];
    assertNonnegativeSafeInteger(definition.capacity, "blocking capacity");
    assertNonnegativeNumber(radius, "block radius");

    return {
        state: battle,
        value: {
            ...unit,
            hooks: UnitHooks.empty().set(prepareKey, prepare).merge(unit.hooks),
            blocker: {
                relations: [],
                capacity: [],
                layer: definition.layer,
                radius,
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
