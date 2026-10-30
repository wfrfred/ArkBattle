import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";

export interface Definition {
    readonly attack: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Offense>;

export interface State {
    readonly attack: readonly contribution.Contribution<Input>[];
}

export interface Offense {
    readonly definition: {
        readonly offense: Definition;
    };
    readonly offense: State;
}

export function hasOffense<U extends Unit>(unit: U): unit is U & Offense {
    return "offense" in unit && "offense" in unit.definition;
}

export function hasOffenseDefinition(
    definition: UnitDefinition,
): definition is UnitDefinition & Offense["definition"] {
    return "offense" in definition;
}

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    assertNonnegativeNumber(definition.attack, "attack");

    return { state: battle, value: { attack: [] } };
}

export function setAttackContribution(
    reference: Ref<Unit & Offense>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(reference, (self) => {
        const attack = contribution.set(self.offense.attack, entry);

        return attack === self.offense.attack
            ? self
            : { ...self, offense: { ...self.offense, attack } };
    });
}

export function removeAttackContribution(reference: Ref<Unit & Offense>, id: string): Change {
    return createChange(reference, (self) => {
        const attack = contribution.remove(self.offense.attack, id);

        return attack === self.offense.attack
            ? self
            : { ...self, offense: { ...self.offense, attack } };
    });
}
