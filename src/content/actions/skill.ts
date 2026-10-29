import { assertPositiveSafeInteger } from "../../core/common/assert.js";
import type { Identified, Ref } from "../../core/common/ref.js";

import { executionRef, getExecution } from "../../core/unit/action/index.js";
import { activationRef, type Activation, consume, check } from "../../core/unit/skill/index.js";
import { hasSkill } from "../../core/unit/capability/skill/index.js";

import * as units from "../../core/unit/index.js";
import { createWithState, type Attack, type Definition as AttackDefinition } from "./attack.js";

export interface State {
    readonly activation: Ref<Activation> | null;
}

export interface Definition extends AttackDefinition<object, State> {
    readonly ammoPerAction?: number;
}

export function create(definition: Definition): Attack<object, State> {
    const amount = definition.ammoPerAction ?? 1;
    const afterOutput = definition.afterOutput;
    assertPositiveSafeInteger(amount, "skill attack ammunition consumption");

    return createWithState<object, State>({
        ...definition,
        initialize: (battle) => ({ state: battle, value: {} }),
        prepare(battle, source) {
            const host = units.get(battle, source);

            return {
                state: battle,
                value: {
                    activation:
                        host !== undefined && hasSkill(host) && host.skill.activation !== null
                            ? activationRef<Activation>(
                                  units.ref(host),
                                  host.skill as Identified<never, typeof host.skill> as Activation,
                              )
                            : null,
                },
            };
        },
        afterOutput(battle, source, self) {
            battle = afterOutput?.(battle, source, self) ?? battle;
            const current = getExecution(battle, executionRef(source, self));
            const activation = current?.execution.state.data.activation;
            if (current?.execution.status !== "RUNNING" || activation == null) {
                return battle;
            }

            battle = consume(battle, activation, amount).state;

            return check(battle, activation);
        },
    });
}
