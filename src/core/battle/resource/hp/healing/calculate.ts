import type { Options } from "../../../../hook.js";
import type { Result, State as BattleState } from "../../../state.js";
import { isAlive } from "../../../../unit/capability/vitality/query.js";
import type { Calculated, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output as outputKey } from "./hook.js";

export function calculateHealing(
    battle: BattleState,
    request: Request,
    options: Options | null,
): Result<Calculated | undefined> {
    const unavailable = (current: BattleState) => {
        const target = request.target.get(current);

        return target?.lifecycle !== "ACTIVE" || !isAlive(target);
    };
    if (unavailable(battle)) {
        return { state: battle, value: undefined };
    }

    let parameters = request.parameters;

    const context = { request };

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

    const amount = Math.max(0, parameters.power * parameters.multiplier);
    const output = dispatch(
        battle,
        request.source,
        outputKey,
        context,
        amount,
        options,
        unavailable,
    );

    return {
        state: output.state,
        value: unavailable(output.state) ? undefined : { amount: Math.max(0, output.value) },
    };
}
