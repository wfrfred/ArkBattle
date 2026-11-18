import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Id as DefinitionId } from "../../action/definition.js";
import { Actions } from "../../action/actions.js";
import type * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type * as modifier from "../../../common/modifier.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";

export interface Definition {
    readonly speed: attribute.Definition;
    readonly interval: attribute.Definition;
    readonly initialize: (battle: BattleState, self: Unit & Action) => Result<Actions>;
    readonly select?: (battle: BattleState, self: Unit & Action) => Result<readonly DefinitionId[]>;
}

export interface RestrictionContext {
    readonly self: Unit & Action;
    readonly definitionId: DefinitionId;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export type Input = readonly modifier.Modifier[];

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly actions: Actions;
    readonly nextExecutionId: number;
    readonly interval: attribute.State;
    readonly speed: attribute.State;
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
    const definition = unit.definition.action;
    const self: U & Action = {
        ...unit,
        action: {
            actions: Actions.empty(),
            nextExecutionId: 0,
            interval: attribute.initialize(definition.interval),
            speed: attribute.initialize(definition.speed),
            restrictions: [],
        },
    };
    const initialized = definition.initialize(battle, self);

    return {
        state: initialized.state,
        value: {
            ...self,
            action: {
                ...self.action,
                actions: initialized.value,
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Action,
    "action",
    keyof Restrictions
>("action", "restrictions");
