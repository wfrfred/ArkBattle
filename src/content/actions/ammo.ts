import { assertPositiveSafeInteger } from "../../core/common/assert.js";

import { ref as executionRef } from "../../core/unit/capability/action/index.js";
import {
    ref as activationRef,
    type ActivationRef,
    consume,
    check,
    type SkillCapability,
} from "../../core/unit/capability/skill/index.js";

import { createWithState, type Attack, type Definition as AttackDefinition } from "./attack.js";

export interface State {
    readonly activation: ActivationRef | null;
}

export type Definition<H extends object = object> = AttackDefinition<
    object,
    State,
    H & SkillCapability
> & {
    readonly ammoPerAction: number;
};

export function create<H extends object = object>(
    definition: Definition<H>,
): Attack<object, State, H & SkillCapability> {
    const amount = definition.ammoPerAction;
    const afterOutput = definition.afterOutput;
    assertPositiveSafeInteger(amount, "skill attack ammunition consumption");

    return createWithState<object, State, H & SkillCapability>({
        ...definition,
        initialize: (battle) => ({ state: battle, value: {} }),
        prepare(battle, host) {
            const activation = host.get(battle)?.skill.activation;

            return {
                state: battle,
                value: {
                    activation:
                        activation?.duration.type === "AMMO" ? activationRef(activation) : null,
                },
            };
        },
        afterOutput(battle, host, self, action) {
            battle = afterOutput?.(battle, host, self, action) ?? battle;
            const current = executionRef(self).get(battle);
            const activation = current?.state.data.activation;
            if (current?.lifecycle !== "ACTIVE" || activation == null) {
                return battle;
            }

            battle = consume(battle, activation, amount).state;

            return check(battle, activation);
        },
    });
}
