import type { Definition as UnitDefinition, Unit } from "../../unit.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Skill as SkillState } from "../../skill/skill.js";
import type { Events, Hook } from "./hook.js";
import type { Input as AmmoInput } from "../../skill/ammo.js";
import type { Rule, Key as RuleKey, Rules } from "./rule.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";
import { enter } from "../../skill/operations.js";
import { enter as enterKey } from "../../hook.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<SkillState<any, any>>;
}

interface Hooks {
    readonly spRecovered: readonly Hook<Events["spRecovered"]>[];
    readonly spPaid: readonly Hook<Events["spPaid"]>[];
    readonly spModified: readonly Hook<Events["spModified"]>[];
    readonly ammoConsumed: readonly Hook<Events["ammoConsumed"]>[];
    readonly ammoReplenished: readonly Hook<Events["ammoReplenished"]>[];
    readonly activationStarted: readonly Hook<Events["activationStarted"]>[];
    readonly activationEnded: readonly Hook<Events["activationEnded"]>[];
}

export interface State extends SkillState, Hooks {
    readonly nextActivationId: number;
    readonly ammo: readonly contribution.Contribution<AmmoInput>[];
    readonly rules: Rules;
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
        value: { ...unit, skill: value, hooks: unit.hooks.set(enterKey, enter) },
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

export const { set: setHook, remove: removeHook } = createRegistrationOperations<
    Unit & Skill,
    "skill",
    keyof Hooks
>("skill");

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
