import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { Unit } from "../../unit.js";
import { createRegistrationOperations } from "../../registration.js";

export interface Definition {
    readonly attack: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Offense>;

interface Contributions {
    readonly attack: readonly contribution.Contribution<Input>[];
}

export interface State extends Contributions {}

export interface Offense {
    readonly definition: {
        readonly offense: Definition;
    };
    readonly offense: State;
}

export function hasOffense<U extends Unit>(unit: U): unit is U & Offense {
    return "offense" in unit && "offense" in unit.definition;
}

export function initialize<U extends Unit & Pick<Offense, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Offense> {
    assertNonnegativeNumber(unit.definition.offense.attack, "attack");

    return { state: battle, value: { ...unit, offense: { attack: [] } } };
}

export const { set: setAttackContribution, remove: removeAttackContribution } =
    createRegistrationOperations<Unit & Offense, "offense", keyof Contributions>(
        "offense",
        "attack",
    );
