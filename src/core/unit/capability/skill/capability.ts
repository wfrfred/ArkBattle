import type { Definition as UnitDefinition, Unit } from "../../unit.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Skill as SkillState } from "../../skill/skill.js";
import type { Events, Hook, Key } from "./hook.js";
import type { Input as AmmoInput } from "../../skill/ammo.js";
import type { Rule } from "./rule.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";

export interface Definition {
    readonly initialize: (battle: BattleState) => Result<SkillState<any, any>>;
}

export interface State extends SkillState {
    readonly nextActivationId: number;
    readonly ammo: readonly contribution.Contribution<AmmoInput>[];
    readonly rules: readonly Rule[];
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

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    const initialized = definition.initialize(battle);
    const skill = initialized.value;
    const value: State = {
        ...skill,
        nextActivationId: 0,
        ammo: [],
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
        activationStarted: [],
        activationEnded: [],
    };

    return { state: initialized.state, value };
}

export function setRule(reference: Ref<Unit & Skill>, rule: Rule): Change {
    return createChange(reference, (self) => {
        const rules = registry.set(self.skill.rules, rule);

        return rules === self.skill.rules ? self : { ...self, skill: { ...self.skill, rules } };
    });
}

export function removeRule(reference: Ref<Unit & Skill>, id: string): Change {
    return createChange(reference, (self) => {
        const rules = registry.remove(self.skill.rules, id);

        return rules === self.skill.rules ? self : { ...self, skill: { ...self.skill, rules } };
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
