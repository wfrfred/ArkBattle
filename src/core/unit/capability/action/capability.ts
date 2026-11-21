import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Definition as ActionDefinition, End, Id as DefinitionId } from "./definition.js";
import { Actions } from "./actions.js";
import { initialize as initializeAction } from "./initialize.js";
import type * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type * as modifier from "../../../common/modifier.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";

export interface Definition<H extends object = never> {
    readonly speed: attribute.Definition;
    readonly interval: attribute.Definition;
    readonly definitions: readonly (Omit<ActionDefinition, "prepare" | "onTick" | "onEnd"> & {
        readonly prepare: (
            battle: BattleState,
            source: Ref<Unit & Action & H>,
            self: never,
        ) => Result<object | null>;
        readonly onTick: (
            battle: BattleState,
            source: Ref<Unit & Action & H>,
            self: never,
        ) => BattleState;
        readonly onEnd?: (
            battle: BattleState,
            source: Ref<Unit & Action & H>,
            self: never,
            end: End,
        ) => BattleState;
    })[];
    readonly select?: (
        battle: BattleState,
        self: Unit & Action & H,
    ) => Result<readonly DefinitionId[]>;
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
    let actions = self.action.actions;

    for (const program of definition.definitions) {
        const initialized = initializeAction(battle, self, program as ActionDefinition<any, any>);
        battle = initialized.state;
        actions = actions.add(initialized.value);
    }

    return {
        state: battle,
        value: {
            ...self,
            action: {
                ...self.action,
                actions,
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Action,
    "action",
    keyof Restrictions
>("action", "restrictions");
