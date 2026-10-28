import { assertFiniteNumber } from "../../../common/assert.js";
import type { Definition as UnitDefinition, Unit } from "../../unit.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Skill as SkillState } from "../../skill/skill.js";
import type { Events, Hook, Key } from "./hook.js";
import type { Input as AmmoInput } from "../../skill/ammo.js";
import type { Modifier } from "../../skill/modifier.js";
import type { Rule } from "./rule.js";
import * as sustain from "../../skill/sustain.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<SkillState<any, any>>;
}

export interface State extends SkillState {
    readonly nextActivationId: number;
    readonly sustain: sustain.Contributions | null;
    readonly rules: readonly Rule[];
    readonly spRecovered: readonly Hook<Events["spRecovered"]>[];
    readonly spPaid: readonly Hook<Events["spPaid"]>[];
    readonly spModified: readonly Hook<Events["spModified"]>[];
    readonly ammoConsumed: readonly Hook<Events["ammoConsumed"]>[];
    readonly ammoReplenished: readonly Hook<Events["ammoReplenished"]>[];
    readonly activated: readonly Hook<Events["activated"]>[];
    readonly ended: readonly Hook<Events["ended"]>[];
}

export interface Skill {
    readonly definition: { readonly skill: Definition };
    readonly skill: State;
}

export function hasSkill<U extends Unit>(unit: U): unit is U & Skill {
    return "skill" in unit && "skill" in unit.definition;
}

export function hasSkillDefinition(
    definition: UnitDefinition,
): definition is UnitDefinition & Skill["definition"] {
    return "skill" in definition;
}

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    const initialized = definition.initialize(battle);
    const skill = initialized.value;
    const value: State = {
        ...skill,
        nextActivationId: 0,
        sustain:
            skill.definition.activation === null
                ? null
                : sustain.initialize(skill.definition.activation.sustain),
        rules: [
            {
                id: "@skill/active-recovery",
                allowsRecovery: (_battle, self) => self.skill.activation === null,
            },
        ],
        spRecovered: [],
        spPaid: [],
        spModified: [],
        ammoConsumed: [],
        ammoReplenished: [],
        activated: [],
        ended: [],
    };

    return { state: initialized.state, value };
}

export function setRule(state: State, rule: Rule): State {
    const rules = registry.set(state.rules, rule);

    return rules === state.rules ? state : { ...state, rules };
}

export function removeRule(state: State, id: string): State {
    const rules = registry.remove(state.rules, id);

    return rules === state.rules ? state : { ...state, rules };
}

export function setHook<K extends Key>(state: State, key: K, hook: Hook<Events[K]>): State {
    const hooks = registry.set(state[key] as readonly Hook<Events[K]>[], hook);

    return hooks === state[key] ? state : { ...state, [key]: hooks };
}

export function removeHook(state: State, key: Key, id: string): State {
    const hooks = registry.remove<State[Key][number]>(state[key], id);

    return hooks === state[key] ? state : { ...state, [key]: hooks };
}

export function setAmmoContribution(
    state: State,
    entry: contribution.Contribution<AmmoInput>,
): State {
    const current = state.sustain;
    if (current?.type !== "AMMO") {
        return state;
    }

    const ammo = contribution.set(current.ammo, entry);

    return ammo === current.ammo ? state : { ...state, sustain: { ...current, ammo } };
}

export function removeAmmoContribution(state: State, id: string): State {
    const current = state.sustain;
    if (current?.type !== "AMMO") {
        return state;
    }

    const ammo = contribution.remove(current.ammo, id);

    return ammo === current.ammo ? state : { ...state, sustain: { ...current, ammo } };
}

export function setDurationContribution(
    state: State,
    entry: contribution.Contribution<Modifier>,
): State {
    const current = state.sustain;
    if (current?.type !== "TIME") {
        return state;
    }

    assertFiniteNumber(entry.value.priority, "skill modifier priority");
    const duration = contribution.set(current.duration, entry);

    return duration === current.duration ? state : { ...state, sustain: { ...current, duration } };
}

export function removeDurationContribution(state: State, id: string): State {
    const current = state.sustain;
    if (current?.type !== "TIME") {
        return state;
    }

    const duration = contribution.remove(current.duration, id);

    return duration === current.duration ? state : { ...state, sustain: { ...current, duration } };
}
