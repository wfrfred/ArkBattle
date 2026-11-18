import type { Options } from "../../../../hook.js";
import type { State as BattleState, Result } from "../../../state.js";
import * as units from "../../../../unit/query.js";
import { available } from "../../../../unit/capability/elemental/query.js";
import type { Calculated, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output } from "./hook.js";

export function calculateHealing(
    battle: BattleState,
    request: Request,
    options?: Options,
): Result<Calculated | undefined> {
    const unavailable = (current: BattleState) => {
        const target = units.get(current, request.target);

        return target === undefined || !available(target);
    };
    if (unavailable(battle)) {
        return { state: battle, value: undefined };
    }

    const context = { request };
    let parameters = request.parameters;

    for (const [owner, key] of [
        [request.source, sourceFormula],
        [request.target, targetFormula],
    ] as const) {
        const result = dispatch(battle, owner, key, context, parameters, options, unavailable);
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
        options,
        unavailable,
    );

    return {
        state: result.state,
        value: unavailable(result.state) ? undefined : { amount: Math.max(0, result.value) },
    };
}
