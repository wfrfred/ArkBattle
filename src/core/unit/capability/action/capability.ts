import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Id as DefinitionId } from "../../action/definition.js";
import type { Actions } from "../../action/actions.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<Actions>;
    readonly select?: (battle: BattleState, self: Unit & Action) => Result<readonly DefinitionId[]>;
}

export interface RestrictionContext {
    readonly self: Unit & Action;
    readonly definitionId: DefinitionId;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export type Input = readonly attribute.Modifier[];

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly actions: Actions;
    readonly nextExecutionId: number;
    readonly interval: readonly contribution.Contribution<Input>[];
    readonly speed: readonly contribution.Contribution<Input>[];
}

export interface Action {
    readonly definition: { readonly action: Definition };
    readonly action: State;
}

export function hasAction<U extends Unit>(unit: U): unit is U & Action {
    return "action" in unit && "action" in unit.definition;
}

export function initialize<U extends Unit & Pick<Action, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Action> {
    const initialized = unit.definition.action.initialize(battle);

    return {
        state: initialized.state,
        value: {
            ...unit,
            action: {
                actions: initialized.value,
                nextExecutionId: 0,
                interval: [],
                speed: [],
                restrictions: [],
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Action,
    "action",
    keyof Restrictions
>("action", "restrictions");
