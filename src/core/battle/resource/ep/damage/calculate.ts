import type { Options } from "../../../../hook.js";
import type { State as BattleState, Result } from "../../../state.js";
import {
    available,
    resolveElementResistance,
} from "../../../../unit/capability/elemental/query.js";
import type { Calculated, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output } from "./hook.js";

export function calculateDamage(
    battle: BattleState,
    request: Request,
    options?: Options,
): Result<Calculated | undefined> {
    const unavailable = (current: BattleState) => {
        const target = request.target.get(current);

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

    const target = request.target.get(battle);
    if (target === undefined || !available(target)) {
        return { state: battle, value: undefined };
    }

    const resistance = resolveElementResistance(battle, target);
    const power = Math.max(0, parameters.power);
    const amount = Math.max(power * 0.05, power * (1 - resistance / 100));
    const result = dispatch(
        battle,
        request.source,
        output,
        { ...context, type: parameters.type },
        amount,
        options,
        unavailable,
    );

    return {
        state: result.state,
        value: unavailable(result.state)
            ? undefined
            : { type: parameters.type, amount: Math.max(0, result.value) },
    };
}
