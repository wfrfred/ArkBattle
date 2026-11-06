import type { Result, State as BattleState } from "../../state.js";
import * as units from "../../../unit/query.js";
import type { Unit } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";
import { resolveDefense, resolveResistance } from "../../../unit/capability/vitality/query.js";
import { hasElemental } from "../../../unit/capability/elemental/capability.js";
import { resolveDamageResistance } from "../../../unit/capability/elemental/query.js";
import type { Calculated, Parameters, Request } from "./contract.js";
import { dispatch, sourceFormula, targetFormula, output as outputKey } from "./hook.js";

export function calculateDamage(
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

    const target = units.get(battle, request.target);
    if (target?.lifecycle !== "PRESENT" || target.vitality.hp <= 0) {
        return { state: battle, value: undefined };
    }

    const amount = formula(battle, target, parameters);
    const output = dispatch(
        battle,
        request.source,
        outputKey,
        { ...context, type: parameters.type },
        amount,
        unavailable,
    );

    return {
        state: output.state,
        value: unavailable(output.state)
            ? undefined
            : { type: parameters.type, amount: Math.max(0, output.value) },
    };
}

function formula(battle: BattleState, target: Unit & Vitality, parameters: Parameters): number {
    const attack = parameters.attack;
    const power = Math.max(0, attack.power * attack.multiplier + attack.addition);

    switch (parameters.type) {
        case "PHYSICAL": {
            const defense = resolveDefense(battle, target);
            const effective =
                Math.max(0, defense - parameters.penetration.fixed) *
                Math.max(0, 1 - parameters.penetration.proportional);

            return Math.max(power * 0.05, power - effective);
        }

        case "ARTS": {
            const resistance = resolveResistance(battle, target);
            const effective =
                Math.max(0, resistance - parameters.penetration.fixed) *
                Math.max(0, 1 - parameters.penetration.proportional);

            return Math.max(power * 0.05, power * (1 - effective / 100));
        }

        case "TRUE":
            return power;

        case "ELEMENTAL": {
            const resistance = hasElemental(target) ? resolveDamageResistance(battle, target) : 0;

            return Math.max(power * 0.05, power * Math.max(0, 1 - resistance / 100));
        }
    }
}
