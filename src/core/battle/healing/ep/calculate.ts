import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../state.js";
import * as units from "../../../unit/query.js";
import { available } from "../../../unit/capability/elemental/query.js";
import type { Calculated, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output } from "./hook.js";

export function calculateHealing(
    battle: BattleState,
    request: Request,
): Result<Calculated | undefined> {
    assertNonnegativeNumber(request.parameters.power, "element healing power");

    const unavailable = (current: BattleState) => {
        const target = units.get(current, request.target);

        return target === undefined || !available(target);
    };
    if (unavailable(battle)) {
        return { state: battle, value: undefined };
    }

    const context = { target: request.target, request };
    let parameters = request.parameters;

    for (const [owner, key] of [
        [request.source, sourceFormula],
        [request.target, targetFormula],
    ] as const) {
        const result = dispatch(battle, owner, key, context, parameters, unavailable);
        battle = result.state;
        parameters = result.value;
    }

    if (unavailable(battle)) {
        return { state: battle, value: undefined };
    }

    const result = dispatch(
        battle,
        request.source,
        output,
        context,
        Math.max(0, parameters.power),
        unavailable,
    );

    return {
        state: result.state,
        value: unavailable(result.state) ? undefined : { amount: result.value },
    };
}
