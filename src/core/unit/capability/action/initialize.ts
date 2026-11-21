import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { resolvePeriod } from "./timing.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Action } from "./action.js";
import type { Definition } from "./definition.js";
import * as cooldown from "./cooldown.js";

export function initialize<P extends object, E extends object>(
    battle: BattleState,
    source: Unit & ActionCapability,
    definition: Definition<P, E>,
): Result<Action<P, E>> {
    if (definition.id.length === 0) {
        throw new TypeError("action definition identity must be nonempty");
    }

    if (definition.period.type === "FIXED") {
        assertNonnegativeNumber(definition.period.ticks, "action period");
    }

    const initialized = definition.initialize(battle);

    return {
        state: initialized.state,
        value: {
            definition,
            state: initialized.value,
            execution: null,
            cooldown: cooldown.initialize(
                resolvePeriod(source, definition),
                initialized.state.tick,
            ),
        },
    };
}
