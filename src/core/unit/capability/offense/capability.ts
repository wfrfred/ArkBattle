import type { State as BattleState, Result } from "../../../battle/state.js";
import type * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type { Unit } from "../../unit.js";
import { createChange, type Change } from "../../change.js";

export interface Definition {
    readonly attack: attribute.Definition;
}

export type Input = attribute.Input<Unit & Offense>;

export interface State {
    readonly attack: attribute.State<Input>;
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

export function initialize<U extends Unit & Pick<Offense, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Offense> {
    return {
        state: battle,
        value: {
            ...unit,
            offense: { attack: attribute.initialize<Input>(unit.definition.offense.attack) },
        },
    };
}

export function setAttackContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Offense> {
    return createChange<Unit & Offense>((self) =>
        updateAttack(self, attribute.setContribution(self.offense.attack, entry)),
    );
}

export function removeAttackContribution(id: string): Change<Unit & Offense> {
    return createChange<Unit & Offense>((self) =>
        updateAttack(self, attribute.removeContribution(self.offense.attack, id)),
    );
}

export function setAttackRange(range: attribute.Range): Change<Unit & Offense> {
    return createChange<Unit & Offense>((self) =>
        updateAttack(
            self,
            attribute.setRange(self.definition.offense.attack, self.offense.attack, range),
        ),
    );
}

export function clearAttackRange(): Change<Unit & Offense> {
    return createChange<Unit & Offense>((self) =>
        updateAttack(
            self,
            attribute.clearRange(self.definition.offense.attack, self.offense.attack),
        ),
    );
}

function updateAttack<U extends Unit & Offense>(self: U, attack: attribute.State<Input>): U {
    return attack === self.offense.attack
        ? self
        : { ...self, offense: { ...self.offense, attack } };
}
