import type { Definition as UnitDefinition, Unit } from "../../unit.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Skill as SkillState } from "../../skill/skill.js";
import type { Events, Hook, Key } from "./hook.js";
import type { Input as AmmoInput } from "../../skill/ammo.js";
import type { Rule, Key as RuleKey, Rules } from "./rule.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";
import { enter } from "../../skill/operations.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<SkillState<any, any>>;
}

export interface State extends SkillState {
    readonly nextActivationId: number;
    readonly ammo: readonly contribution.Contribution<AmmoInput>[];
    readonly rules: Rules;
    readonly spRecovered: readonly Hook<Events["spRecovered"]>[];
    readonly spPaid: readonly Hook<Events["spPaid"]>[];
    readonly spModified: readonly Hook<Events["spModified"]>[];
    readonly ammoConsumed: readonly Hook<Events["ammoConsumed"]>[];
    readonly ammoReplenished: readonly Hook<Events["ammoReplenished"]>[];
    readonly activationStarted: readonly Hook<Events["activationStarted"]>[];
    readonly activationEnded: readonly Hook<Events["activationEnded"]>[];
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

export function initialize<U extends Unit & Pick<Skill, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Skill> {
    const initialized = unit.definition.skill.initialize(battle);
    const skill = initialized.value;
    const value: State = {
        ...skill,
        nextActivationId: 0,
        ammo: [],
        rules: {
            activation: [],
            operation: [],
            recovery: [
                {
                    id: "@skill/active-recovery",
                    allows: (_battle, { self }) => self.skill.activation === null,
                },
            ],
        },
        spRecovered: [],
        spPaid: [],
        spModified: [],
        ammoConsumed: [],
        ammoReplenished: [],
        activationStarted: [],
        activationEnded: [],
    };

    return {
        state: initialized.state,
        value: { ...unit, skill: value, hooks: registry.set(unit.hooks, enter) },
    };
}

export function setRule<K extends RuleKey>(
    reference: Ref<Unit & Skill>,
    key: K,
    rule: Rule<NoInfer<K>>,
): Change {
    return createChange(reference, (self) => {
        const entries = registry.set(self.skill.rules[key], rule);

        return entries === self.skill.rules[key]
            ? self
            : { ...self, skill: { ...self.skill, rules: { ...self.skill.rules, [key]: entries } } };
    });
}

export function removeRule(reference: Ref<Unit & Skill>, key: RuleKey, id: string): Change {
    return createChange(reference, (self) => {
        const entries = registry.remove<Rules[RuleKey][number]>(self.skill.rules[key], id);

        return entries === self.skill.rules[key]
            ? self
            : { ...self, skill: { ...self.skill, rules: { ...self.skill.rules, [key]: entries } } };
    });
}

export function setHook<K extends Key>(
    reference: Ref<Unit & Skill>,
    key: K,
    hook: Hook<Events[K]>,
): Change {
    return createChange(reference, (self) => {
        const hooks = registry.set(self.skill[key] as readonly Hook<Events[K]>[], hook);

        return hooks === self.skill[key]
            ? self
            : { ...self, skill: { ...self.skill, [key]: hooks } };
    });
}

export function removeHook(reference: Ref<Unit & Skill>, key: Key, id: string): Change {
    return createChange(reference, (self) => {
        const hooks = registry.remove<State[Key][number]>(self.skill[key], id);

        return hooks === self.skill[key]
            ? self
            : { ...self, skill: { ...self.skill, [key]: hooks } };
    });
}

export function setAmmoContribution(
    reference: Ref<Unit & Skill>,
    entry: contribution.Contribution<AmmoInput>,
): Change {
    return createChange(reference, (self) => {
        if (self.skill.definition.activation?.sustain.type !== "AMMO") {
            return self;
        }

        const ammo = contribution.set(self.skill.ammo, entry);

        return ammo === self.skill.ammo ? self : { ...self, skill: { ...self.skill, ammo } };
    });
}

export function removeAmmoContribution(reference: Ref<Unit & Skill>, id: string): Change {
    return createChange(reference, (self) => {
        if (self.skill.definition.activation?.sustain.type !== "AMMO") {
            return self;
        }

        const ammo = contribution.remove(self.skill.ammo, id);

        return ammo === self.skill.ammo ? self : { ...self, skill: { ...self.skill, ammo } };
    });
}
