import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { State as BattleState } from "../../battle/state.js";
import type { Definition as ActivationDefinition } from "./activation.js";
import type { Instance } from "./instance.js";
import * as sp from "./sp.js";

export interface View {
    readonly id: string;
    readonly sp: sp.Definition | null;
    readonly activation: Pick<ActivationDefinition<object, object>, "trigger" | "sustain"> | null;
}

export interface Definition<S extends object = object, A extends object = object> extends View {
    readonly initialize: () => S;
    readonly activation: ActivationDefinition<S, A> | null;
    readonly onEnter?: (battle: BattleState, self: Instance<S, A>) => BattleState;
    readonly onTick?: (battle: BattleState, self: Instance<S, A>) => BattleState;
}

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
