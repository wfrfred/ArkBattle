import { assertNonnegativeNumber } from "../../common/assert.js";
import type { State as BattleState, Result } from "../../battle/state.js";
import { period } from "../capability/action/timing.js";
import { Actions } from "./actions.js";
import type { Definition } from "./definition.js";
import * as cooldown from "./cooldown.js";

export type Initializer = (battle: BattleState, actions: Actions) => Result<Actions>;

export function create<P extends object, E extends object>(
    definition: Definition<P, E>,
): Initializer {
    if (definition.id.length === 0) {
        throw new TypeError("action definition identity must be nonempty");
    }

    assertNonnegativeNumber(definition.intervalTicks, "action base interval");
    assertNonnegativeNumber(definition.speed, "action base speed");

    return (battle, actions) => {
        const initialized = definition.initialize(battle);

        return {
            state: initialized.state,
            value: actions.add({
                definition,
                state: initialized.value,
                execution: null,
                cooldown: cooldown.initialize(
                    period(definition.intervalTicks, definition.speed),
                    initialized.state.tick,
                ),
            }),
        };
    };
}

export function createActions(
    battle: BattleState,
    ...initializers: readonly Initializer[]
): Result<Actions> {
    let actions = Actions.empty();

    for (const initialize of initializers) {
        const initialized = initialize(battle, actions);
        battle = initialized.state;
        actions = initialized.value;
    }

    return { state: battle, value: actions };
}
