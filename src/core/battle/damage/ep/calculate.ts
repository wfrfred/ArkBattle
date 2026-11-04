import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../state.js";
import * as units from "../../../unit/query.js";
import { available, resolveElementResistance } from "../../../unit/capability/elemental/query.js";
import type { Calculated, Parameters, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output } from "./hook.js";

export function calculateDamage(
    battle: BattleState,
    request: Request,
): Result<Calculated | undefined> {
    assertNonnegativeNumber(request.power, "element damage power");

    const unavailable = (current: BattleState) => {
        const target = units.get(current, request.target);

        return target === undefined || !available(target);
    };
    if (unavailable(battle)) {
        return { state: battle, value: undefined };
    }

    const context = { target: request.target, request };
    let parameters: Parameters = { type: request.type, power: request.power };

    for (const [owner, key] of [
        [request.source, sourceFormula],
        [request.target, targetFormula],
    ] as const) {
        const result = dispatch(battle, owner, key, context, parameters, unavailable);
        battle = result.state;
        parameters = result.value;
    }

    const target = units.get(battle, request.target);
    if (target === undefined || !available(target)) {
        return { state: battle, value: undefined };
    }

    const resistance = resolveElementResistance(battle, target);
    const amount = Math.max(0, parameters.power) * (1 - resistance / 100);
    const result = dispatch(
        battle,
        request.source,
        output,
        { ...context, type: parameters.type },
        amount,
        unavailable,
    );

    return {
        state: result.state,
        value: unavailable(result.state)
            ? undefined
            : { type: parameters.type, amount: result.value },
    };
}
