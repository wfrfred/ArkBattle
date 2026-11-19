import type { State as BattleState, Result } from "../../../battle/state.js";
import type * as contribution from "../../../common/contribution.js";
import { roundToEven } from "../../../common/math.js";
import * as attribute from "../../attribute.js";
import { createChange, type Change } from "../../change.js";
import type { Unit } from "../../unit.js";

export interface Definition {
    readonly baseForceLevel: attribute.Definition;
}

export type Input = attribute.Input<Unit & Shifter>;

export interface State {
    readonly baseForceLevel: attribute.State<Input>;
}

export interface Shifter {
    readonly definition: { readonly shifter: Definition };
    readonly shifter: State;
}

export function hasShifter<U extends Unit>(unit: U): unit is U & Shifter {
    return "shifter" in unit && "shifter" in unit.definition;
}

export function initialize<U extends Unit & Pick<Shifter, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Shifter> {
    return {
        state: battle,
        value: {
            ...unit,
            shifter: {
                baseForceLevel: attribute.initialize<Input>(unit.definition.shifter.baseForceLevel),
            },
        },
    };
}

export function resolveBaseForceLevel(battle: BattleState, self: Unit & Shifter): number {
    return roundToEven(
        attribute.resolve(
            self.definition.shifter.baseForceLevel,
            self.shifter.baseForceLevel,
            battle,
            self,
        ),
    );
}

export function setBaseForceLevelContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Shifter> {
    return createChange<Unit & Shifter>((self) =>
        updateBaseForceLevel(self, attribute.setContribution(self.shifter.baseForceLevel, entry)),
    );
}

export function removeBaseForceLevelContribution(id: string): Change<Unit & Shifter> {
    return createChange<Unit & Shifter>((self) =>
        updateBaseForceLevel(self, attribute.removeContribution(self.shifter.baseForceLevel, id)),
    );
}

export function setBaseForceLevelRange(range: attribute.Range): Change<Unit & Shifter> {
    return createChange<Unit & Shifter>((self) =>
        updateBaseForceLevel(
            self,
            attribute.setRange(
                self.definition.shifter.baseForceLevel,
                self.shifter.baseForceLevel,
                range,
            ),
        ),
    );
}

export function clearBaseForceLevelRange(): Change<Unit & Shifter> {
    return createChange<Unit & Shifter>((self) =>
        updateBaseForceLevel(
            self,
            attribute.clearRange(
                self.definition.shifter.baseForceLevel,
                self.shifter.baseForceLevel,
            ),
        ),
    );
}

function updateBaseForceLevel<U extends Unit & Shifter>(
    self: U,
    baseForceLevel: attribute.State<Input>,
): U {
    return baseForceLevel === self.shifter.baseForceLevel
        ? self
        : { ...self, shifter: { ...self.shifter, baseForceLevel } };
}
