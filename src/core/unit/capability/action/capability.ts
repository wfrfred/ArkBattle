import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type { Id as DefinitionId } from "../../action/definition.js";
import type { Actions } from "../../action/actions.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { BeforeReleaseHook, ReleasedHook } from "./release.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Rule as BaseRule } from "../../../rule.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<Actions>;
    readonly select?: (battle: BattleState, self: Unit & Action) => Result<readonly DefinitionId[]>;
}

export interface RuleContext {
    readonly self: Unit & Action;
    readonly definitionId: DefinitionId;
}

export type Rule = BaseRule<RuleContext>;

export type Input = readonly attribute.Modifier[];

interface Hooks {
    readonly beforeRelease: readonly BeforeReleaseHook[];
    readonly released: readonly ReleasedHook[];
}

interface Rules {
    readonly rules: readonly Rule[];
}

export interface State extends Rules, Hooks {
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

export function hasActionDefinition(
    definition: UnitDefinition,
): definition is UnitDefinition & Action["definition"] {
    return "action" in definition;
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
                rules: [],
                beforeRelease: [],
                released: [],
            },
        },
    };
}

export const { set: setRule, remove: removeRule } = createRegistrationOperations<
    Unit & Action,
    "action",
    keyof Rules
>("action", "rules");

export const { set: setHook, remove: removeHook } = createRegistrationOperations<
    Unit & Action,
    "action",
    keyof Hooks
>("action");
