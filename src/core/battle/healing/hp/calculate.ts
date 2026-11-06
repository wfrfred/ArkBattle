import type { Result, State as BattleState } from "../../state.js";
import * as units from "../../../unit/query.js";
import type { Calculated, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output as outputKey } from "./hook.js";

export function calculateHealing(
    battle: BattleState,
    request: Request,
): Result<Calculated | undefined> {
    const unavailable = (current: BattleState) => {
        const target = units.get(current, request.target);

        return target?.lifecycle !== "PRESENT" || target.vitality.hp <= 0;
    };
    if (unavailable(battle)) {
        return { state: battle, value: undefined };
    }

    let parameters = request.parameters;

    const context = { target: request.target, request };

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

    const amount = Math.max(0, parameters.power * parameters.multiplier);
    const output = dispatch(battle, request.source, outputKey, context, amount, unavailable);

    return {
        state: output.state,
        value: unavailable(output.state) ? undefined : { amount: Math.max(0, output.value) },
    };
}
