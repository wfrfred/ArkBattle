import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type { Id as DefinitionId } from "../../action/definition.js";
import type { Actions } from "../../action/actions.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import * as hook from "../../../hook.js";
import type { BeforeReleaseHook, ReleasedHook } from "./release.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<Actions>;
    readonly select?: (battle: BattleState, self: Unit & Action) => Result<readonly DefinitionId[]>;
}

export interface Rule {
    readonly id: string;
    readonly allows: (
        battle: BattleState,
        self: Unit & Action,
        definitionId: DefinitionId,
    ) => boolean;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Action>;

export interface State {
    readonly actions: Actions;
    readonly nextExecutionId: number;
    readonly interval: readonly contribution.Contribution<Input>[];
    readonly speed: readonly contribution.Contribution<Input>[];
    readonly rules: readonly Rule[];
    readonly beforeRelease: readonly BeforeReleaseHook[];
    readonly released: readonly ReleasedHook[];
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

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    const initialized = definition.initialize(battle);

    return {
        state: initialized.state,
        value: {
            actions: initialized.value,
            nextExecutionId: 0,
            interval: [],
            speed: [],
            rules: [],
            beforeRelease: [],
            released: [],
        },
    };
}

export function setRule(reference: Ref<Unit & Action>, rule: Rule): Change {
    return createChange(reference, (self) => {
        const rules = hook.set(self.action.rules, rule);

        return rules === self.action.rules ? self : { ...self, action: { ...self.action, rules } };
    });
}

export function removeRule(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(reference, (self) => {
        const rules = hook.remove(self.action.rules, id);

        return rules === self.action.rules ? self : { ...self, action: { ...self.action, rules } };
    });
}

export function setBeforeReleaseHook(
    reference: Ref<Unit & Action>,
    entry: BeforeReleaseHook,
): Change {
    return createChange(reference, (self) => {
        const beforeRelease = hook.set(self.action.beforeRelease, entry);

        return beforeRelease === self.action.beforeRelease
            ? self
            : { ...self, action: { ...self.action, beforeRelease } };
    });
}

export function removeBeforeReleaseHook(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(reference, (self) => {
        const beforeRelease = hook.remove(self.action.beforeRelease, id);

        return beforeRelease === self.action.beforeRelease
            ? self
            : { ...self, action: { ...self.action, beforeRelease } };
    });
}

export function setReleasedHook(reference: Ref<Unit & Action>, entry: ReleasedHook): Change {
    return createChange(reference, (self) => {
        const released = hook.set(self.action.released, entry);

        return released === self.action.released
            ? self
            : { ...self, action: { ...self.action, released } };
    });
}

export function removeReleasedHook(reference: Ref<Unit & Action>, id: string): Change {
    return createChange(reference, (self) => {
        const released = hook.remove(self.action.released, id);

        return released === self.action.released
            ? self
            : { ...self, action: { ...self.action, released } };
    });
}
