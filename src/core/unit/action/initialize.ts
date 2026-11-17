import { assertNonnegativeNumber } from "../../common/assert.js";
import type { State as BattleState, Result } from "../../battle/state.js";
import { resolvePeriod } from "../capability/action/timing.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import { Actions } from "./actions.js";
import type { Definition } from "./definition.js";
import * as cooldown from "./cooldown.js";

export type Initializer = (
    battle: BattleState,
    source: Unit & ActionCapability,
    actions: Actions,
) => Result<Actions>;

export function create<P extends object, E extends object>(
    definition: Definition<P, E>,
): Initializer {
    if (definition.id.length === 0) {
        throw new TypeError("action definition identity must be nonempty");
    }

    if (definition.period.type === "FIXED") {
        assertNonnegativeNumber(definition.period.ticks, "action period");
    }

    return (battle, source, actions) => {
        const initialized = definition.initialize(battle);

        return {
            state: initialized.state,
            value: actions.add({
                definition,
                state: initialized.value,
                execution: null,
                cooldown: cooldown.initialize(
                    resolvePeriod(source, definition),
                    initialized.state.tick,
                ),
            }),
        };
    };
}

export function createActions(
    battle: BattleState,
    source: Unit & ActionCapability,
    ...initializers: readonly Initializer[]
): Result<Actions> {
    let actions = Actions.empty();

    for (const initialize of initializers) {
        const initialized = initialize(battle, source, actions);
        battle = initialized.state;
        actions = initialized.value;
    }

    return { state: battle, value: actions };
}
