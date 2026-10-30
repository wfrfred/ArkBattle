import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import type { Blockable } from "./blockable.js";
import type { Hook } from "./contract.js";
import type { Rule } from "./rule.js";

export type Layer = "GROUND" | "AIR";

export type Modifier = { readonly type: "ADD"; readonly value: number } | { readonly type: "ZERO" };

export const DEFAULT_RADIUS: Readonly<Record<Layer, number>> = {
    GROUND: 0.7071,
    AIR: 0.8944,
};

export interface Definition {
    readonly capacity: number;
    readonly layer: Layer;
    readonly radius?: number;
    readonly rules: readonly Rule[];
}

export interface State {
    readonly blocked: readonly Ref<Unit & Blockable>[];
    readonly capacity: readonly contribution.Contribution<readonly Modifier[]>[];
    readonly layer: Layer;
    readonly radius: number;
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
    const radius = definition.radius ?? DEFAULT_RADIUS[definition.layer];
    assertNonnegativeSafeInteger(definition.capacity, "blocking capacity");
    assertNonnegativeNumber(radius, "block radius");

    return {
        state: battle,
        value: {
            blocked: [],
            capacity: [],
            layer: definition.layer,
            radius,
            rules: definition.rules,
            acquired: [],
            released: [],
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

    const value = Math.max(0, definition.capacity + addition);
    const lower = Math.floor(value);

    return value - lower === 0.5 ? lower + (lower % 2) : Math.round(value);
}
