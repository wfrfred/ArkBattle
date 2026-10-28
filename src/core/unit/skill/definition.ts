import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { State as BattleState } from "../../battle/state.js";
import type { Definition as ActivationDefinition } from "./activation.js";
import type { Instance } from "./instance.js";
import * as sp from "./sp.js";
import type * as sustain from "./sustain.js";

export interface Definition<S extends object = object, A extends object = object> {
    readonly id: string;
    readonly initialize: () => S;
    readonly sp: sp.Definition | null;
    readonly activation: ActivationDefinition<S, A> | null;
    readonly onEnter?: (battle: BattleState, self: Instance<S, A>) => BattleState;
    readonly onTick?: (battle: BattleState, self: Instance<S, A>) => BattleState;
}

export type Declaration = Pick<Definition, "id" | "initialize" | "sp"> & {
    readonly activation: {
        readonly trigger: ActivationDefinition<object, object>["trigger"];
        readonly sustain: sustain.Definition;
        readonly initialize: (battle: BattleState, self: never) => object;
    } | null;
};

export function createDefinition<S extends object, A extends object>(
    definition: Definition<S, A>,
): Definition<S, A> {
    if (definition.id.length === 0) {
        throw new TypeError("skill identity must be nonempty");
    }
    if (definition.sp !== null) {
        sp.validateDefinition(definition.sp);
    }

    const policy = definition.activation?.sustain;
    if (policy?.type === "TIME") {
        assertNonnegativeSafeInteger(policy.durationTicks, "skill duration ticks");
    } else if (policy?.type === "AMMO") {
        assertNonnegativeSafeInteger(policy.amount, "skill ammunition");
    }

    return Object.freeze({ ...definition });
}
